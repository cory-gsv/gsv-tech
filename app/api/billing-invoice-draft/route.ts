import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyBillingSession } from "../../billing/billingAuth";

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";

type InvoiceItem = {
  description?: string;
  qty?: number;
  rate?: number;
};

type InvoicePayload = {
  number?: string;
  date?: string;
  dueDate?: string;
  month?: string;
  items?: InvoiceItem[];
  total?: number;
};

type ClientPayload = {
  name?: string;
  email?: string;
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

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function invoiceTotal(invoice: InvoicePayload) {
  return (invoice.items || []).reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0),
    0,
  );
}

function generateInvoicePdf(invoice: InvoicePayload, client: ClientPayload) {
  const total = Number(invoice.total ?? invoiceTotal(invoice));
  const page = { width: 612, height: 792 };
  const ink = "0.11 0.15 0.19";
  const gold = "1 0.78 0.17";
  const goldText = "0.64 0.44 0";
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

  function brandMark(x: number, y: number) {
    // A compact gold line mark keeps the attachment on-brand without relying on browser-only assets.
    let mark = "";
    mark += `q ${goldText} RG 3 w ${x + 8} ${y + 45} m ${x + 38} ${y + 70} l ${x + 68} ${y + 45} l ${x + 96} ${y + 62} l ${x + 132} ${y + 42} l S Q\n`;
    mark += `q ${goldText} RG 3 w ${x + 8} ${y + 32} m ${x + 132} ${y + 32} l S Q\n`;
    mark += `q ${goldText} RG 3 w ${x + 8} ${y + 20} m ${x + 55} ${y + 20} l ${x + 70} ${y + 8} l ${x + 120} ${y + 8} l S Q\n`;
    mark += drawText("GOLDEN STATE VISIONS", x, y - 18, 18, goldText, "F2");
    mark += drawText("MANAGED IT SERVICES & CYBERSECURITY", x + 16, y - 34, 7, goldText);
    return mark;
  }

  let content = "";
  content += rect(0, 0, page.width, page.height, "1 1 1", "1 1 1");
  content += brandMark(margin, 675);
  content += drawText("info@gsvisions.com", margin, 593, 12);
  content += drawText("(916) 432-3373", margin, 565, 12);

  content += drawText("INVOICE", 434, 705, 30, ink, "F2");
  const metaX = 350;
  const metaValueX = 455;
  [
    ["Invoice #", invoice.number || ""],
    ["Date", invoice.date || ""],
    ["Due Date", invoice.dueDate || ""],
    ["Invoice Month", invoice.month || ""],
  ].forEach(([label, value], index) => {
    const y = 655 - index * 26;
    content += drawTextRight(label, metaX, y, 90, 12, ink, "F2");
    content += drawText(value, metaValueX, y, 12);
  });

  const tableX = margin;
  const tableW = page.width - margin * 2;
  const billY = 475;
  const billH = 112;
  content += rect(tableX, billY, tableW, billH);
  content += rect(tableX, billY + billH - 28, tableW, 28, headerFill);
  content += drawTextCenter("Bill To", tableX, billY + billH - 19, tableW, 12, ink, "F2");
  const billTo = (client.billTo || client.name || "").split(/\r?\n/).filter(Boolean);
  billTo.slice(0, 6).forEach((line, index) => {
    content += drawText(line, tableX + 8, billY + billH - 50 - index * 16, 12);
  });

  content += drawText("Monthly IT Services", tableX, 420, 18, ink, "F2");
  const items = (invoice.items || []).slice(0, 14);
  const rowH = 27;
  const headerH = 30;
  const itemsY = 170;
  const itemsH = headerH + rowH * Math.max(items.length, 1);
  const col = {
    desc: tableX,
    qty: tableX + 350,
    rate: tableX + 420,
    amount: tableX + 490,
  };
  const width = {
    desc: 350,
    qty: 70,
    rate: 70,
    amount: tableW - 490,
  };

  content += rect(tableX, itemsY, tableW, itemsH);
  content += rect(tableX, itemsY + itemsH - headerH, tableW, headerH, headerFill);
  content += vline(col.qty, itemsY, itemsY + itemsH);
  content += vline(col.rate, itemsY, itemsY + itemsH);
  content += vline(col.amount, itemsY, itemsY + itemsH);
  content += drawTextCenter("Description", col.desc, itemsY + itemsH - 20, width.desc, 12, ink, "F2");
  content += drawTextCenter("Qty", col.qty, itemsY + itemsH - 20, width.qty, 12, ink, "F2");
  content += drawTextCenter("Rate", col.rate, itemsY + itemsH - 20, width.rate, 12, ink, "F2");
  content += drawTextCenter("Amount", col.amount, itemsY + itemsH - 20, width.amount, 12, ink, "F2");

  let y = itemsY + itemsH - headerH;
  for (const item of (invoice.items || []).slice(0, 16)) {
    if (y - rowH < itemsY) break;
    const amount = Number(item.qty || 0) * Number(item.rate || 0);
    content += hline(tableX, y, tableX + tableW);
    const textY = y - 18;
    content += drawText(String(item.description || "").slice(0, 58), col.desc + 8, textY, 11);
    content += drawTextCenter(String(item.qty ?? ""), col.qty, textY, width.qty, 11);
    content += drawTextCenter(money(Number(item.rate || 0)), col.rate, textY, width.rate, 11);
    content += drawTextCenter(money(amount), col.amount, textY, width.amount, 11);
    y -= rowH;
  }

  const totalY = 112;
  content += rect(tableX, totalY, tableW, 36, gold);
  content += vline(tableX + tableW - 115, totalY, totalY + 36);
  content += drawTextRight("Total Due", tableX, totalY + 12, tableW - 120, 16, ink, "F2");
  content += drawTextCenter(money(total), tableX + tableW - 115, totalY + 12, 115, 16, ink, "F2");

  const stream = `q\n1 1 1 rg 0 0 612 792 re f\n0 0 0 RG 0 0 0 rg\n${content}Q`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
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

    const { invoice, client } = await request.json() as {
      invoice?: InvoicePayload;
      client?: ClientPayload;
    };
    if (!invoice || !client?.email) {
      return NextResponse.json({ error: "Invoice and client email are required." }, { status: 400 });
    }

    const fromMailbox = envValue("BILLING_SEND_FROM", "MS_SEND_FROM", "MICROSOFT_SEND_FROM");
    if (!fromMailbox) {
      throw new Error("Missing BILLING_SEND_FROM mailbox for Outlook drafts.");
    }

    const accessToken = await graphToken();
    const pdf = generateInvoicePdf(invoice, client);
    const subject = `Invoice ${invoice.number || ""} from Golden State Visions`;
    const total = money(Number(invoice.total ?? invoiceTotal(invoice)));
    const senderName = "Golden State Visions";
    const body = [
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
        bccRecipients: [
          { emailAddress: { address: "cory@gsvisions.com", name: "Cory" } },
        ],
        replyTo: [
          { emailAddress: { address: fromMailbox, name: senderName } },
        ],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: `${(invoice.number || "invoice").replace(/[^A-Za-z0-9._-]/g, "_")}.pdf`,
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
      message: "Outlook draft created with invoice PDF attached.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Outlook draft creation failed." },
      { status: 500 },
    );
  }
}
