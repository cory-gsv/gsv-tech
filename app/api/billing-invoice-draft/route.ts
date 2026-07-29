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
  shippingCost?: number;
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

function documentSubtotal(invoice: InvoicePayload) {
  return (invoice.items || []).reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0),
    0,
  );
}

function documentTaxTotal(invoice: InvoicePayload) {
  const taxRate = Number(invoice.taxRate || 0);
  if (!taxRate) return 0;
  const taxableSubtotal = (invoice.items || []).reduce((sum, item: InvoiceItem & { taxable?: boolean }) => {
    if (!item.taxable) return sum;
    return sum + Number(item.qty || 0) * Number(item.rate || 0);
  }, 0);
  return Math.round(taxableSubtotal * (taxRate / 100) * 100) / 100;
}

function documentShippingTotal(invoice: InvoicePayload) {
  return Math.max(0, Number(invoice.shippingCost || 0));
}

function invoiceTotal(invoice: InvoicePayload) {
  return documentSubtotal(invoice) + documentTaxTotal(invoice) + documentShippingTotal(invoice);
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
  const png = readFileSync(join(process.cwd(), "public/billing-app/assets/gsv-bridge-mark.png"));
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
      const logoBackground = 255;
      rgb[targetIndex] = Math.round(raw[sourceIndex] * alpha + logoBackground * (1 - alpha));
      rgb[targetIndex + 1] = Math.round(raw[sourceIndex + 1] * alpha + logoBackground * (1 - alpha));
      rgb[targetIndex + 2] = Math.round(raw[sourceIndex + 2] * alpha + logoBackground * (1 - alpha));
    }
  }

  const stream = deflateSync(rgb);
  return {
    width: imageWidth,
    height: imageHeight,
    object: `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${stream.length} >>\nstream\n${stream.toString("binary")}\nendstream`,
  };
}

export function generateInvoicePdf(invoice: InvoicePayload, client: ClientPayload, documentType: "invoice" | "quote" = "invoice", contactEmail = "billing@gsvisions.com") {
  const subtotal = documentSubtotal(invoice);
  const tax = documentTaxTotal(invoice);
  const shipping = documentShippingTotal(invoice);
  const total = Number(invoice.total ?? invoiceTotal(invoice));
  const isQuote = documentType === "quote";
  const logo = pdfLogoImageObject();
  const page = { width: 612, height: 792 };
  const ink = "0.12 0.12 0.12";
  const gold = "1 0.7804 0.1725";
  const muted = "0.2706 0.2706 0.2706";
  const white = "1 1 1";
  const softFill = "0.965 0.965 0.965";
  const headerFill = "0.2706 0.2706 0.2706";
  const line = "0.82 0.82 0.82";
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
    return `BT /${font} ${size} Tf 0 Tc ${color} rg ${x} ${y} Td (${text(value)}) Tj ET\n`;
  }

  function drawTextRight(value: string, x: number, y: number, width: number, size = 11, color = ink, font = "F1") {
    return drawText(value, rightX(value, x, width, size), y, size, color, font);
  }

  function drawTextCenter(value: string, x: number, y: number, width: number, size = 11, color = ink, font = "F1") {
    return drawText(value, centerX(value, x, width, size), y, size, color, font);
  }

  function trackedWidth(value: string, size: number, tracking: number) {
    return value.length * size * 0.62 + Math.max(0, value.length - 1) * tracking;
  }

  function drawTrackedText(value: string, x: number, y: number, size: number, tracking: number, color = ink, font = "F2") {
    return `BT /${font} ${size} Tf ${tracking} Tc ${color} rg ${x} ${y} Td (${text(value)}) Tj ET\n`;
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

  function wrapLines(value: string, width: number, size: number) {
    const result: string[] = [];
    String(value || "").split(/\r?\n/).filter(Boolean).forEach(paragraph => {
      const words = paragraph.trim().split(/\s+/);
      let current = "";
      words.forEach(word => {
        const candidate = current ? `${current} ${word}` : word;
        if (current && approxWidth(candidate, size) > width) {
          result.push(current);
          current = word;
        } else {
          current = candidate;
        }
      });
      if (current) result.push(current);
    });
    return result;
  }

  const tableX = margin;
  const tableW = page.width - margin * 2;
  const sourceItems = invoice.items || [];
  const summaryRowCount = tax || shipping ? 1 + (tax ? 1 : 0) + (shipping ? 1 : 0) : 0;
  const summaryReserve = summaryRowCount * 24;
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
  const printableRows = sectionMode
    ? sectionRows.filter(row => row.kind !== "detail" || String(row.description || "").trim())
    : sourceItems;
  const rowH = sectionMode ? 22 : 24;
  const headerH = 26;
  const baseItemsTop = 428;
  const itemsBottom = 118 + summaryReserve;
  const requiredItemsH = headerH + Math.max(printableRows.length, 1) * rowH;
  const pageYOffset = Math.max(0, requiredItemsH - (baseItemsTop - itemsBottom));
  page.height += pageYOffset;
  const firstItemsTop = baseItemsTop + pageYOffset;
  const tableBottom = firstItemsTop - requiredItemsH;
  const chunks: Array<typeof printableRows> = [printableRows];

  function pageY(value: number) {
    return value + pageYOffset;
  }

  function drawFirstPageHeader() {
    let content = "";
    content += rect(0, 0, page.width, page.height, "1 1 1", "1 1 1");
    content += rect(0, pageY(756), page.width, 36, headerFill, headerFill);
    content += drawText("MANAGED IT SERVICES  /  CYBERSECURITY", margin, pageY(770), 8, gold, "F2");
    const brandX = margin;
    const brandW = 230;
    const markW = 110;
    const brandSize = 9;
    const brandTracking = brandSize * 0.17;
    const brandGap = brandSize * 1.1;
    const primaryLabel = "GOLDEN STATE";
    const accentLabel = "VISIONS";
    const primaryW = trackedWidth(primaryLabel, brandSize, brandTracking);
    const accentW = trackedWidth(accentLabel, brandSize, brandTracking);
    const wordmarkX = brandX + (brandW - primaryW - brandGap - accentW) / 2;
    content += drawLogo(brandX + (brandW - markW) / 2, pageY(655), markW);
    content += drawTrackedText(primaryLabel, wordmarkX, pageY(632), brandSize, brandTracking, headerFill);
    content += drawTrackedText(accentLabel, wordmarkX + primaryW + brandGap, pageY(632), brandSize, brandTracking, gold);
    content += drawText(contactEmail, margin, pageY(596), 8.5, muted);
    content += drawText("(916) 909-0500", 190, pageY(596), 8.5, muted);

    content += drawText(isQuote ? "PROJECT QUOTE" : "INVOICE", 404, pageY(708), 22, ink, "F2");
    content += rect(350, pageY(618), 222, 72, softFill, line);
    content += rect(350, pageY(618), 4, 72, gold, gold);
    const metaX = 360;
    const metaValueX = 460;
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
      const y = pageY(672 - index * 15);
      content += drawText(label.toUpperCase(), metaX, y, 7.5, muted, "F2");
      content += drawText(value, metaValueX, y, 9, ink, "F2");
    });
    content += rect(margin, pageY(580), tableW, 2, gold, gold);

    const billY = pageY(464);
    const billH = 96;
    const addressGap = 18;
    const addressW = (tableW - addressGap) / 2;
    const billCardW = invoice.showShipTo ? addressW : 320;
    content += rect(tableX, billY, billCardW, billH, softFill, line);
    content += rect(tableX, billY, 4, billH, gold, gold);
    content += drawText("BILL TO", tableX + 16, billY + billH - 20, 8, muted, "F2");
    const billTo = wrapLines(client.billTo || client.name || "", billCardW - 32, 8.5);
    billTo.slice(0, 7).forEach((addressLine, index) => {
      content += drawText(addressLine, tableX + 16, billY + billH - 38 - index * 10, 8.5, ink, index === 0 ? "F2" : "F1");
    });
    if (invoice.showShipTo) {
      const shipX = tableX + addressW + addressGap;
      content += rect(shipX, billY, addressW, billH, softFill, line);
      content += rect(shipX, billY, 4, billH, gold, gold);
      content += drawText("SHIP TO", shipX + 16, billY + billH - 20, 8, muted, "F2");
      const shipTo = wrapLines(invoice.shipTo || client.billTo || client.name || "", addressW - 32, 8.5);
      shipTo.slice(0, 7).forEach((addressLine, index) => {
        content += drawText(addressLine, shipX + 16, billY + billH - 38 - index * 10, 8.5, ink, index === 0 ? "F2" : "F1");
      });
    }

    content += drawText(isQuote ? (invoice.title || "Project Quote") : "SERVICES & LICENSING", tableX, pageY(442), 9, muted, "F2");
    return content;
  }

  function drawItemsTable(rows: typeof printableRows, itemsTop: number, itemsY: number) {
    let content = "";
    const itemsH = itemsTop - itemsY;
    content += rect(tableX, itemsY, tableW, itemsH, white, line);
    content += rect(tableX, itemsY + itemsH - headerH, tableW, headerH, headerFill);

    let y = itemsY + itemsH - headerH;
    if (sectionMode) {
      const sectionAmountX = tableX + tableW - 125;
      const sectionDescW = tableW - 125;
      content += vline(sectionAmountX, itemsY, itemsY + itemsH);
      content += drawTextCenter("DESCRIPTION", tableX, itemsY + itemsH - 18, sectionDescW, 8, white, "F2");
      content += drawTextCenter("TOTAL", sectionAmountX, itemsY + itemsH - 18, 125, 8, white, "F2");

      for (const item of rows as PdfSectionRow[]) {
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
      return content;
    }

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
    content += vline(col.qty, itemsY, itemsY + itemsH);
    content += vline(col.rate, itemsY, itemsY + itemsH);
    content += vline(col.amount, itemsY, itemsY + itemsH);
    content += drawText("DESCRIPTION", col.desc + 10, itemsY + itemsH - 18, 8, white, "F2");
    content += drawTextCenter("QTY", col.qty, itemsY + itemsH - 18, width.qty, 8, white, "F2");
    content += drawTextCenter("RATE", col.rate, itemsY + itemsH - 18, width.rate, 8, white, "F2");
    content += drawTextCenter("AMOUNT", col.amount, itemsY + itemsH - 18, width.amount, 8, white, "F2");

    for (const [index, item] of (rows as InvoiceItem[]).entries()) {
      if (y - rowH < itemsY) break;
      const amount = lineItemAmount(item);
      if (index % 2 === 1) content += rect(tableX, y - rowH, tableW, rowH, softFill, softFill);
      content += hline(tableX, y, tableX + tableW);
      const textY = y - 16;
      content += drawText(String(item.description || "").slice(0, 58), col.desc + 10, textY, 9);
      content += drawTextCenter(String(item.qty ?? ""), col.qty, textY, width.qty, 9);
      content += drawTextCenter(money(Number(item.rate || 0)), col.rate, textY, width.rate, 9);
      content += drawTextCenter(money(amount), col.amount, textY, width.amount, 9, ink, "F2");
      y -= rowH;
    }
    content += vline(col.qty, itemsY, itemsY + itemsH);
    content += vline(col.rate, itemsY, itemsY + itemsH);
    content += vline(col.amount, itemsY, itemsY + itemsH);
    return content;
  }

  function drawTotalBlock(totalY: number) {
    let content = "";
    const summaryRows = [
      ["Subtotal", subtotal],
      ...(tax ? [[`Tax (${Number(invoice.taxRate || 0).toFixed(2)}%)`, tax] as [string, number]] : []),
      ...(shipping ? [["Shipping", shipping] as [string, number]] : []),
    ];
    if (tax || shipping) {
      const rowH = 24;
      const summaryH = summaryRows.length * rowH;
      const summaryW = 270;
      const summaryX = tableX + tableW - summaryW;
      const y = totalY + 36;
      content += rect(summaryX, y, summaryW, summaryH);
      content += vline(summaryX + summaryW - 105, y, y + summaryH);
      summaryRows.forEach(([label, amount], index) => {
        const rowY = y + summaryH - (index + 1) * rowH;
        if (index > 0) content += hline(summaryX, rowY + rowH, summaryX + summaryW);
        content += drawTextRight(String(label), summaryX, rowY + 8, summaryW - 110, 10, ink, "F2");
        content += drawTextCenter(money(Number(amount)), summaryX + summaryW - 105, rowY + 8, 105, 10, ink, "F2");
      });
    }
    const totalW = 260;
    const totalX = tableX + tableW - totalW;
    content += rect(totalX, totalY, totalW, 42, headerFill, headerFill);
    content += rect(totalX + totalW - 122, totalY, 122, 42, gold, gold);
    content += drawTextRight(isQuote ? "TOTAL" : "TOTAL DUE", totalX, totalY + 15, totalW - 132, 10, white, "F2");
    content += drawTextCenter(money(total), totalX + totalW - 122, totalY + 13, 122, 15, ink, "F2");
    content += drawText("Thank you for trusting Golden State Visions.", tableX, totalY - 28, 8.5, muted);
    content += drawText("gsvisions.com  |  (916) 909-0500  |  Managed IT Services & Cybersecurity", tableX, 28, 8, muted);
    return content;
  }

  const pageContents = chunks.map((rows) => {
    let content = drawFirstPageHeader();
    content += drawItemsTable(rows, firstItemsTop, tableBottom);
    content += drawTotalBlock(Math.max(58, tableBottom - 52 - summaryReserve));
    return `q
1 1 1 rg 0 0 ${page.width} ${page.height} re f
0 0 0 RG 0 0 0 rg
${content}Q`;
  });

  const pageObjectStart = 6;
  const contentObjectStart = pageObjectStart + pageContents.length;
  const pageRefs = pageContents.map((_, index) => `${pageObjectStart + index} 0 R`).join(" ");
  const pageObjects = pageContents.map((_, index) => (
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Im1 5 0 R >> >> /Contents ${contentObjectStart + index} 0 R >>`
  ));
  const contentObjects = pageContents.map(stream => `<< /Length ${pdfByteLength(stream)} >>\nstream\n${stream}\nendstream`);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageRefs}] /Count ${pageContents.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    logo.object,
    ...pageObjects,
    ...contentObjects,
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
          `<p>Thank you,<br>${senderName}<br>${fromMailbox}<br>(916) 909-0500</p>`,
        ].join("")
      : [
          `<p>Hi ${client.name || ""},</p>`,
          `<p>Invoice <strong>${invoice.number || ""}</strong> is attached as a PDF.</p>`,
          `<p>Total due: <strong>${total}</strong><br>Due date: ${invoice.dueDate || ""}</p>`,
          `<p>Please remit payment by check.</p><p>Golden State Visions<br>757 Caber Drive<br>Lincoln, CA 95648</p>`,
          `<p>Thank you,<br>${senderName}<br>${fromMailbox}<br>(916) 909-0500</p>`,
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
