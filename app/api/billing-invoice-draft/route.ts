import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { inflateSync, deflateSync } from "node:zlib";
import { verifyBillingSession } from "../../billing/billingAuth";

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";

type InvoiceItem = {
  type?: string;
  description?: string;
  qty?: number;
  rate?: number;
};

type PdfSectionRow = {
  kind: "title" | "detail" | "line";
  description: string;
  amount: number;
};

type InvoicePayload = {
  number?: string;
  date?: string;
  dueDate?: string;
  month?: string;
  subject?: string;
  title?: string;
  items?: InvoiceItem[];
  taxRate?: number;
  showShipTo?: boolean;
  shipTo?: string;
  total?: number;
};

type ClientPayload = {
  name?: string;
  email?: string;
  ccEmails?: string[];
  billTo?: string;
};

function envValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return "";
}

async function graphToken() {
  const tenantId = envValue("BILLING_MS_TENANT_ID", "BILLING_MICROSOFT_TENANT_ID", "MS_TENANT_ID", "MICROSOFT_TENANT_ID", "AZURE_TENANT_ID");
  const clientId = envValue("BILLING_MS_CLIENT_ID", "BILLING_MICROSOFT_CLIENT_ID", "MS_CLIENT_ID", "MICROSOFT_CLIENT_ID", "AZURE_CLIENT_ID");
  const clientSecret = envValue("BILLING_MS_CLIENT_SECRET", "BILLING_MICROSOFT_CLIENT_SECRET", "MS_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET", "AZURE_CLIENT_SECRET");

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Microsoft Graph app credentials.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Microsoft Graph auth failed.");
  }
  return String(data.access_token);
}

function text(value: unknown) {
  return String(value ?? "").replace(/[()\\]/g, "\\$&");
}

function pdfByteLength(value: string) {
  return Buffer.byteLength(value, "latin1");
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function invoiceTotal(invoice: InvoicePayload) {
  return (invoice.items || []).reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0),
    0,
  );
}

function lineItemAmount(item: InvoiceItem) {
  return Number(item.qty || 0) * Number(item.rate || 0);
}

function quoteLineType(item: InvoiceItem = {}) {
  return item.type || "line";
}

function quoteHasTitleLines(items: InvoiceItem[] = []) {
  return items.some(item => quoteLineType(item) === "title");
}

function quoteTitleLineAmount(items: InvoiceItem[] = [], titleIndex = 0) {
  let total = lineItemAmount(items[titleIndex] || {});
  for (let index = titleIndex + 1; index < items.length; index += 1) {
    if (quoteLineType(items[index]) === "title") break;
    total += lineItemAmount(items[index]);
  }
  return total;
}

function paethPredictor(left: number, above: number, upperLeft: number) {
  const p = left + above - upperLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - above);
  const pc = Math.abs(p - upperLeft);
  if (pa <= pb && pa <= pc) return left;
  if (pb <= pc) return above;
  return upperLeft;
}

function pdfLogoImageObject() {
  const png = readFileSync(join(process.cwd(), "public/billing-app/assets/gsv-logo.png"));
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];

  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const data = png.subarray(dataStart, dataEnd);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data[8];
      colorType = data[9];
      const interlace = data[12];
      if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
        throw new Error("Unsupported logo PNG format.");
      }
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset = dataEnd + 4;
  }

  if (!width || !height || colorType !== 6 || !idat.length) {
    throw new Error("Could not read logo PNG.");
  }

  const inflated = inflateSync(Buffer.concat(idat));
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const raw = Buffer.alloc(width * height * bytesPerPixel);
  let source = 0;
  let target = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[source];
    source += 1;
    for (let x = 0; x < stride; x += 1) {
      const value = inflated[source + x];
      const left = x >= bytesPerPixel ? raw[target + x - bytesPerPixel] : 0;
      const above = y > 0 ? raw[target + x - stride] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel ? raw[target + x - stride - bytesPerPixel] : 0;
      if (filter === 0) raw[target + x] = value;
      else if (filter === 1) raw[target + x] = (value + left) & 255;
      else if (filter === 2) raw[target + x] = (value + above) & 255;
      else if (filter === 3) raw[target + x] = (value + Math.floor((left + above) / 2)) & 255;
      else if (filter === 4) raw[target + x] = (value + paethPredictor(left, above, upperLeft)) & 255;
      else throw new Error("Unsupported logo PNG filter.");
    }
    source += stride;
    target += stride;
  }

  const imageWidth = 1200;
  const imageHeight = Math.round(height * (imageWidth / width));
  const rgb = Buffer.alloc(imageWidth * imageHeight * 3);
  for (let targetY = 0; targetY < imageHeight; targetY += 1) {
    const sourceY = Math.min(height - 1, Math.floor(targetY * height / imageHeight));
    for (let targetX = 0; targetX < imageWidth; targetX += 1) {
      const sourceX = Math.min(width - 1, Math.floor(targetX * width / imageWidth));
      const sourceIndex = (sourceY * width + sourceX) * 4;
      const targetIndex = (targetY * imageWidth + targetX) * 3;
      const alpha = raw[sourceIndex + 3] / 255;
      rgb[targetIndex] = Math.round(raw[sourceIndex] * alpha + 255 * (1 - alpha));
      rgb[targetIndex + 1] = Math.round(raw[sourceIndex + 1] * alpha + 255 * (1 - alpha));
      rgb[targetIndex + 2] = Math.round(raw[sourceIndex + 2] * alpha + 255 * (1 - alpha));
    }
  }

  const stream = deflateSync(rgb);
  return {
    width: imageWidth,
    height: imageHeight,
    object: `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${stream.length} >>\nstream\n${stream.toString("binary")}\nendstream`,
  };
}

function generateInvoicePdf(invoice: InvoicePayload, client: ClientPayload, documentType: "invoice" | "quote" = "invoice", contactEmail = "billing@gsvisions.com") {
  const total = Number(invoice.total ?? invoiceTotal(invoice));
  const isQuote = documentType === "quote";
  const logo = pdfLogoImageObject();
  const page = { width: 612, height: 792 };
  const ink = "0.11 0.15 0.19";
  const gold = "1 0.7804 0.1725";
  const headerFill = "0.89 0.92 0.95";
  const line = "0.07 0.09 0.12";
  const margin = 40;

  function approxWidth(value: string, size: number) {
    return value.length * size * 0.52;
  }

  function centerX(value: string, x: number, width: number, size: number) {
    return x + (width - approxWidth(value, size)) / 2;
  }

  function rightX(value: string, x: number, width: number, size: number) {
    return x + width - approxWidth(value, size) - 6;
  }

  function drawText(value: string, x: number, y: number, size = 11, color = ink, font = "F1") {
    return `BT /${font} ${size} Tf ${color} rg ${x} ${y} Td (${text(value)}) Tj ET\n`;
  }

  function drawTextRight(value: string, x: number, y: number, width: number, size = 11, color = ink, font = "F1") {
    return drawText(value, rightX(value, x, width, size), y, size, color, font);
  }

  function drawTextCenter(value: string, x: number, y: number, width: number, size = 11, color = ink, font = "F1") {
    return drawText(value, centerX(value, x, width, size), y, size, color, font);
  }

  function rect(x: number, y: number, width: number, height: number, fill = "", stroke = line) {
    const fillPart = fill ? `${fill} rg ` : "";
    const operator = fill ? "B" : "S";
    return `q ${stroke} RG ${fillPart}${x} ${y} ${width} ${height} re ${operator} Q\n`;
  }

  function hline(x1: number, y: number, x2: number, stroke = line, width = 1) {
    return `q ${stroke} RG ${width} w ${x1} ${y} m ${x2} ${y} l S Q\n`;
  }

  function vline(x: number, y1: number, y2: number, stroke = line, width = 1) {
    return `q ${stroke} RG ${width} w ${x} ${y1} m ${x} ${y2} l S Q\n`;
  }

  function drawLogo(x: number, y: number, width: number) {
    const height = width * (logo.height / logo.width);
    return `q ${width} 0 0 ${height} ${x} ${y} cm /Im1 Do Q\n`;
  }

  let content = "";
  content += rect(0, 0, page.width, page.height, "1 1 1", "1 1 1");
  content += drawLogo(margin, 650, 240);
  content += drawText(contactEmail, margin, 592, 12);
  content += drawText("(916) 432-3373", margin, 568, 12);

  content += drawText(isQuote ? "QUOTE" : "INVOICE", 434, 705, 30, ink, "F2");
  const metaX = 350;
  const metaValueX = 455;
  const metaRows = isQuote
    ? [
        ["Quote #", invoice.number || ""],
        ["Date", invoice.date || ""],
      ]
    : [
        ["Invoice #", invoice.number || ""],
        ["Date", invoice.date || ""],
        ["Due Date", invoice.dueDate || ""],
        ["Invoice Month", invoice.month || ""],
      ];
  metaRows.forEach(([label, value], index) => {
    const y = 655 - index * 26;
    content += drawTextRight(label, metaX, y, 90, 12, ink, "F2");
    content += drawText(value, metaValueX, y, 12);
  });

  const tableX = margin;
  const tableW = page.width - margin * 2;
  const billY = 430;
  const billH = 126;
  const addressGap = 18;
  const addressW = (tableW - addressGap) / 2;
  content += rect(tableX, billY, addressW, billH);
  content += rect(tableX, billY + billH - 28, addressW, 28, headerFill);
  content += drawTextCenter("Bill To", tableX, billY + billH - 19, addressW, 12, ink, "F2");
  const billTo = (client.billTo || client.name || "").split(/\r?\n/).filter(Boolean);
  billTo.slice(0, 6).forEach((line, index) => {
    content += drawText(line, tableX + 8, billY + billH - 50 - index * 15, 12);
  });
  if (invoice.showShipTo) {
    const shipX = tableX + addressW + addressGap;
    content += rect(shipX, billY, addressW, billH);
    content += rect(shipX, billY + billH - 28, addressW, 28, headerFill);
    content += drawTextCenter("Ship To", shipX, billY + billH - 19, addressW, 12, ink, "F2");
    const shipTo = (invoice.shipTo || client.billTo || client.name || "").split(/\r?\n/).filter(Boolean);
    shipTo.slice(0, 6).forEach((line, index) => {
      content += drawText(line, shipX + 8, billY + billH - 50 - index * 15, 12);
    });
  }

  content += drawText(isQuote ? (invoice.title || "Project Quote") : "Monthly IT Services", tableX, 382, 18, ink, "F2");
  const sourceItems = invoice.items || [];
  const sectionMode = isQuote && quoteHasTitleLines(sourceItems);
  const sectionRows: PdfSectionRow[] = sectionMode
    ? sourceItems.map((item, index) => {
        const rowType = quoteLineType(item);
        if (rowType === "title") {
          return {
            kind: "title",
            description: item.description || "Project Section",
            amount: quoteTitleLineAmount(sourceItems, index),
          };
        }
        const hasPriorTitle = sourceItems.slice(0, index).some(prior => quoteLineType(prior) === "title");
        if (hasPriorTitle || rowType === "detail") {
          return {
            kind: "detail",
            description: item.description || "",
            amount: 0,
          };
        }
        return {
          kind: "line",
          description: item.description || "",
          amount: lineItemAmount(item),
        };
      })
    : [];
  const sectionItems = sectionRows.slice(0, 18);
  const invoiceItems = sourceItems.slice(0, 14);
  const rowH = sectionMode ? 25 : 27;
  const headerH = 30;
  const itemsY = 135;
  const itemsH = headerH + rowH * Math.max(sectionMode ? sectionItems.length : invoiceItems.length, 1);
  const col = {
    desc: tableX,
    qty: tableX + 350,
    rate: tableX + 415,
    amount: tableX + 470,
  };
  const width = {
    desc: 350,
    qty: 65,
    rate: 55,
    amount: tableW - 470,
  };

  content += rect(tableX, itemsY, tableW, itemsH);
  content += rect(tableX, itemsY + itemsH - headerH, tableW, headerH, headerFill);

  let y = itemsY + itemsH - headerH;
  if (sectionMode) {
    const sectionAmountX = tableX + tableW - 125;
    const sectionDescW = tableW - 125;
    content += vline(sectionAmountX, itemsY, itemsY + itemsH);
    content += drawTextCenter("Description", tableX, itemsY + itemsH - 20, sectionDescW, 12, ink, "F2");
    content += drawTextCenter("Total", sectionAmountX, itemsY + itemsH - 20, 125, 12, ink, "F2");

    for (const item of sectionItems) {
      if (y - rowH < itemsY) break;
      content += hline(tableX, y, tableX + tableW);
      const textY = y - 17;
      if (item.kind === "detail") {
        const detailText = String(item.description || "").trim();
        if (detailText) content += drawText(`- ${detailText.slice(0, 78)}`, tableX + 18, textY, 10, "0.35 0.42 0.50");
      } else {
        content += drawText(String(item.description || "").slice(0, 70), tableX + 8, textY, 11, ink, "F2");
        content += drawTextCenter(money(Number(item.amount || 0)), sectionAmountX, textY, 125, 11, ink, "F2");
      }
      y -= rowH;
    }
  } else {
    content += vline(col.qty, itemsY, itemsY + itemsH);
    content += vline(col.rate, itemsY, itemsY + itemsH);
    content += vline(col.amount, itemsY, itemsY + itemsH);
    content += drawTextCenter("Description", col.desc, itemsY + itemsH - 20, width.desc, 12, ink, "F2");
    content += drawTextCenter("Qty", col.qty, itemsY + itemsH - 20, width.qty, 12, ink, "F2");
    content += drawTextCenter("Rate", col.rate, itemsY + itemsH - 20, width.rate, 12, ink, "F2");
    content += drawTextCenter("Amount", col.amount, itemsY + itemsH - 20, width.amount, 12, ink, "F2");

    for (const item of sourceItems.slice(0, 16)) {
      if (y - rowH < itemsY) break;
      const amount = lineItemAmount(item);
      content += hline(tableX, y, tableX + tableW);
      const textY = y - 18;
      content += drawText(String(item.description || "").slice(0, 58), col.desc + 8, textY, 11);
      content += drawTextCenter(String(item.qty ?? ""), col.qty, textY, width.qty, 11);
      content += drawTextCenter(money(Number(item.rate || 0)), col.rate, textY, width.rate, 11);
      content += drawTextCenter(money(amount), col.amount, textY, width.amount, 11);
      y -= rowH;
    }
  }

  const totalY = 58;
  content += rect(tableX, totalY, tableW, 36, gold);
  content += vline(tableX + tableW - 115, totalY, totalY + 36);
  content += drawTextRight(isQuote ? "Total" : "Total Due", tableX, totalY + 12, tableW - 120, 16, ink, "F2");
  content += drawTextCenter(money(total), tableX + tableW - 115, totalY + 12, 115, 16, ink, "F2");

  const stream = `q\n1 1 1 rg 0 0 612 792 re f\n0 0 0 RG 0 0 0 rg\n${content}Q`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << /Im1 6 0 R >> >> /Contents 7 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    logo.object,
    `<< /Length ${pdfByteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdfByteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdfByteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthed = await verifyBillingSession(
      cookieStore.get("gsv_billing_session")?.value,
    );
    if (!isAuthed) {
      return NextResponse.json({ error: "Billing Hub login required." }, { status: 401 });
    }

    const { documentType = "invoice", invoice, client } = await request.json() as {
      documentType?: "invoice" | "quote";
      invoice?: InvoicePayload;
      client?: ClientPayload;
    };
    if (!invoice || !client?.email) {
      return NextResponse.json({ error: "Document and client email are required." }, { status: 400 });
    }
    const isQuote = documentType === "quote";

    const fromMailbox = isQuote
      ? envValue("BILLING_QUOTE_SEND_FROM", "QUOTE_SEND_FROM") || "cory@gsvisions.com"
      : envValue("BILLING_SEND_FROM", "MS_SEND_FROM", "MICROSOFT_SEND_FROM");
    if (!fromMailbox) {
      throw new Error("Missing BILLING_SEND_FROM mailbox for Outlook drafts.");
    }

    const accessToken = await graphToken();
    const pdf = generateInvoicePdf(invoice, client, isQuote ? "quote" : "invoice", fromMailbox);
    const subject = invoice.subject?.trim() || (isQuote ? `Project Quote (${invoice.number || ""})` : `Monthly IT Services Invoice (${invoice.number || ""})`);
    const total = money(Number(invoice.total ?? invoiceTotal(invoice)));
    const senderName = "Golden State Visions";
    const body = isQuote
      ? [
          `<p>Hi ${client.name || ""},</p>`,
          `<p>Quote <strong>${invoice.number || ""}</strong> is attached as a PDF.</p>`,
          `<p>Total: <strong>${total}</strong></p>`,
          `<p>Thank you,<br>${senderName}<br>${fromMailbox}<br>(916) 432-3373</p>`,
        ].join("")
      : [
          `<p>Hi ${client.name || ""},</p>`,
          `<p>Invoice <strong>${invoice.number || ""}</strong> is attached as a PDF.</p>`,
          `<p>Total due: <strong>${total}</strong><br>Due date: ${invoice.dueDate || ""}</p>`,
          `<p>Please remit payment by check.</p><p>Golden State Visions<br>757 Caber Drive<br>Lincoln, CA 95648</p>`,
          `<p>Thank you,<br>${senderName}<br>${fromMailbox}<br>(916) 432-3373</p>`,
        ].join("");

    const response = await fetch(`${GRAPH_ROOT}/users/${encodeURIComponent(fromMailbox)}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        body: { contentType: "HTML", content: body },
        toRecipients: [
          { emailAddress: { address: client.email, name: client.name || client.email } },
        ],
        ccRecipients: (client.ccEmails || [])
          .filter(Boolean)
          .map((email) => ({ emailAddress: { address: email } })),
        bccRecipients: [
          { emailAddress: { address: "cory@gsvisions.com", name: "Cory" } },
        ],
        replyTo: [
          { emailAddress: { address: fromMailbox, name: senderName } },
        ],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: `${(invoice.number || documentType).replace(/[^A-Za-z0-9._-]/g, "_")}.pdf`,
            contentType: "application/pdf",
            contentBytes: pdf.toString("base64"),
          },
        ],
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (String(data.error?.message || "").includes("requested user")) {
        throw new Error(
          `Outlook sender mailbox ${fromMailbox} was not found in the configured billing Microsoft tenant. Set BILLING_MS_TENANT_ID / BILLING_MS_CLIENT_ID / BILLING_MS_CLIENT_SECRET for the GSV Outlook tenant, or set BILLING_SEND_FROM to a mailbox in that tenant.`,
        );
      }
      throw new Error(data.error?.message || `Outlook draft failed with ${response.status}.`);
    }

    return NextResponse.json({
      id: data.id,
      webLink: data.webLink || "",
      message: `Outlook draft created with ${isQuote ? "quote" : "invoice"} PDF attached.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Outlook draft creation failed." },
      { status: 500 },
    );
  }
}
