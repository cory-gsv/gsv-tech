import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  preferredTime?: string;
  inquiryType?: string;
  source?: string;
  message?: string;
};

const CONTACT_TO_EMAIL = "info@gsvisions.com";
const CONTACT_FALLBACK_FROM_EMAIL = "Golden State Visions <onboarding@resend.dev>";
const CONTACT_SEND_ERROR_MESSAGE =
  "We could not send that message right now. Please call Golden State Visions at (916) 432-3373.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const phone = body.phone?.trim() || "";
    const company = body.company?.trim() || "";
    const preferredTime = body.preferredTime?.trim() || "";
    const inquiryType = body.inquiryType?.trim() || "Website inquiry";
    const source = body.source?.trim() || "Website";
    const message = body.message?.trim() || "";

    if (!name || (!email && !phone) || !message) {
      return NextResponse.json(
        { error: "Please complete your name, email or phone, and message." },
        { status: 400 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY environment variable." },
        { status: 500 },
      );
    }

    const fromEmail = process.env.CONTACT_FROM_EMAIL || CONTACT_FALLBACK_FROM_EMAIL;

    const subject = `${inquiryType} from ${name}`;

    const text = `
${inquiryType}

Name: ${name}
Email: ${email || "Not provided"}
Phone: ${phone || "Not provided"}
Company / Project: ${company || "Not provided"}
Preferred time: ${preferredTime || "Not provided"}
Source: ${source}

Message:
${message}
`.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <h2 style="margin: 0 0 16px;">${escapeHtml(inquiryType)}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Company / Project:</strong> ${escapeHtml(company || "Not provided")}</p>
        <p><strong>Preferred time:</strong> ${escapeHtml(preferredTime || "Not provided")}</p>
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 14px 16px; background: #f5f3ee; border-radius: 12px;">
          ${escapeHtml(message).replace(/\n/g, "<br />")}
        </div>
      </div>
    `;

    const emailPayload = {
      from: fromEmail,
      to: CONTACT_TO_EMAIL,
      ...(email ? { reply_to: email } : {}),
      subject,
      text,
      html,
    };

    let res = await sendResendEmail(resendApiKey, emailPayload);
    let data = await res.json().catch(() => ({}));

    if (
      !res.ok &&
      fromEmail !== CONTACT_FALLBACK_FROM_EMAIL &&
      isResendDomainVerificationError(data)
    ) {
      console.error("Resend sender domain is not verified; retrying with fallback sender.", data);
      res = await sendResendEmail(resendApiKey, {
        ...emailPayload,
        from: CONTACT_FALLBACK_FROM_EMAIL,
      });
      data = await res.json().catch(() => ({}));
    }

    if (!res.ok) {
      console.error("Contact email failed", {
        status: res.status,
        data,
      });

      return NextResponse.json(
        { error: CONTACT_SEND_ERROR_MESSAGE },
        { status: res.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error: CONTACT_SEND_ERROR_MESSAGE,
      },
      { status: 500 },
    );
  }
}

function sendResendEmail(
  resendApiKey: string,
  payload: {
    from: string;
    to: string;
    reply_to?: string;
    subject: string;
    text: string;
    html: string;
  },
) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

function isResendDomainVerificationError(data: unknown) {
  const haystack = JSON.stringify(data || {}).toLowerCase();

  return (
    haystack.includes("domain is not verified") ||
    haystack.includes("verify your domain") ||
    haystack.includes("validation_error")
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
