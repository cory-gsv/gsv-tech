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
  const tenantId = envValue("MS_TENANT_ID", "MICROSOFT_TENANT_ID", "AZURE_TENANT_ID");
  const clientId = envValue("MS_CLIENT_ID", "MICROSOFT_CLIENT_ID", "AZURE_CLIENT_ID");
  const clientSecret = envValue("MS_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET", "AZURE_CLIENT_SECRET");

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

function pdfLine(y: number, value: string, x = 54, size = 11) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${text(value)}) Tj ET\n`;
}

function generateInvoicePdf(invoice: InvoicePayload, client: ClientPayload) {
  const total = Number(invoice.total ?? invoiceTotal(invoice));
  let content = "";
  content += pdfLine(742, "GOLDEN STATE VISIONS", 54, 18);
  content += pdfLine(720, "info@gsvisions.com  |  (916) 432-3373", 54, 10);
  content += pdfLine(742, "INVOICE", 430, 26);
  content += pdfLine(704, `Invoice #: ${invoice.number || ""}`, 360, 11);
  content += pdfLine(686, `Date: ${invoice.date || ""}`, 360, 11);
  content += pdfLine(668, `Due Date: ${invoice.dueDate || ""}`, 360, 11);
  content += pdfLine(650, `Invoice Month: ${invoice.month || ""}`, 360, 11);

  content += pdfLine(620, "Bill To", 54, 13);
  const billTo = (client.billTo || client.name || "").split(/\r?\n/).filter(Boolean);
  billTo.slice(0, 6).forEach((line, index) => {
    content += pdfLine(600 - index * 16, line, 54, 11);
  });

  content += pdfLine(486, "Description", 54, 12);
  content += pdfLine(486, "Qty", 340, 12);
  content += pdfLine(486, "Rate", 410, 12);
  content += pdfLine(486, "Amount", 485, 12);
  content += "48 478 m 548 478 l S\n";

  let y = 456;
  for (const item of (invoice.items || []).slice(0, 16)) {
    const amount = Number(item.qty || 0) * Number(item.rate || 0);
    content += pdfLine(y, String(item.description || "").slice(0, 44), 54, 10);
    content += pdfLine(y, String(item.qty ?? ""), 348, 10);
    content += pdfLine(y, money(Number(item.rate || 0)), 405, 10);
    content += pdfLine(y, money(amount), 485, 10);
    y -= 18;
  }

  content += "330 122 m 548 122 l S\n";
  content += pdfLine(100, "Total Due", 380, 16);
  content += pdfLine(100, money(total), 485, 16);

  const stream = `q\n1 1 1 rg 0 0 612 792 re f\n0 0 0 RG 0 0 0 rg\n${content}Q`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
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
    const body = [
      `<p>Hi ${client.name || ""},</p>`,
      `<p>Invoice <strong>${invoice.number || ""}</strong> is attached as a PDF.</p>`,
      `<p>Total due: <strong>${total}</strong><br>Due date: ${invoice.dueDate || ""}</p>`,
      "<p>Please remit payment by check.</p>",
      "<p>Thank you,<br>Golden State Visions<br>info@gsvisions.com<br>(916) 432-3373</p>",
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
