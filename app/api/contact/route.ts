import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  preferredTime?: string;
  inquiryType?: string;
  source?: string;
  message?: string;
  website?: string;
  formStartedAt?: number;
};

const CONTACT_TO_EMAIL = "info@gsvisions.com";
const CONTACT_FALLBACK_FROM_EMAIL = "Golden State Visions <onboarding@resend.dev>";
const CONTACT_SEND_ERROR_MESSAGE =
  "We could not send that message right now. Please call Golden State Visions at (916) 909-0500.";
const MAX_REQUEST_BYTES = 20_000;
const MIN_FORM_COMPLETION_MS = 2_000;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DUPLICATE_WINDOW_MS = 15 * 60 * 1_000;
const rateLimitStore = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();

const fieldLimits = {
  name: 120,
  email: 254,
  phone: 40,
  company: 160,
  preferredTime: 120,
  inquiryType: 100,
  source: 200,
  message: 12_000,
} as const;

export async function POST(request: Request) {
  try {
    if (!isJsonRequest(request)) {
      return NextResponse.json(
        { error: "This form only accepts JSON submissions." },
        { status: 415 },
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "That message is too large." }, { status: 413 });
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Invalid form origin." }, { status: 403 });
    }

    const clientKey = getClientKey(request);
    const rateLimit = checkRateLimit(clientKey);
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "Too many messages were submitted. Please wait a few minutes and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    const body = (await request.json()) as ContactPayload;

    // Silently accept honeypot submissions so automated tools do not learn
    // which field triggered the rejection.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = normalizeField(body.name);
    const email = normalizeField(body.email);
    const phone = normalizeField(body.phone);
    const company = normalizeField(body.company);
    const preferredTime = normalizeField(body.preferredTime);
    const inquiryType = normalizeField(body.inquiryType) || "Website inquiry";
    const source = normalizeField(body.source) || "Website";
    const message = normalizeMessage(body.message);

    const oversizedField = getOversizedField({
      name,
      email,
      phone,
      company,
      preferredTime,
      inquiryType,
      source,
      message,
    });

    if (oversizedField) {
      return NextResponse.json(
        { error: `${oversizedField} is longer than allowed.` },
        { status: 400 },
      );
    }

    if (!name || (!email && !phone) || !message) {
      return NextResponse.json(
        { error: "Please complete your name, email or phone, and message." },
        { status: 400 },
      );
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    if (source === "Contact page" && !hasValidCompletionTime(body.formStartedAt)) {
      return NextResponse.json(
        { error: "Please wait a moment and submit the form again." },
        { status: 400 },
      );
    }

    const submissionHash = createSubmissionHash(clientKey, email, phone, message);
    if (isDuplicateSubmission(submissionHash)) {
      return NextResponse.json(
        { error: "This message was already received. We will follow up shortly." },
        { status: 409 },
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

    recentSubmissions.set(submissionHash, Date.now());
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: CONTACT_SEND_ERROR_MESSAGE,
      },
      { status: 500 },
    );
  }
}

function isJsonRequest(request: Request) {
  return request.headers.get("content-type")?.toLowerCase().startsWith("application/json");
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    return originUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

function checkRateLimit(clientKey: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateLimitStore.get(clientKey) || []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((recent[0] + RATE_LIMIT_WINDOW_MS - now) / 1_000),
    );
    rateLimitStore.set(clientKey, recent);
    return { limited: true, retryAfterSeconds };
  }

  recent.push(now);
  rateLimitStore.set(clientKey, recent);
  pruneProtectionStores(now);
  return { limited: false, retryAfterSeconds: 0 };
}

function pruneProtectionStores(now: number) {
  if (rateLimitStore.size > 1_000) {
    for (const [key, timestamps] of rateLimitStore) {
      const recent = timestamps.filter(
        (timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS,
      );
      if (recent.length) rateLimitStore.set(key, recent);
      else rateLimitStore.delete(key);
    }
  }

  if (recentSubmissions.size > 1_000) {
    for (const [key, timestamp] of recentSubmissions) {
      if (timestamp <= now - DUPLICATE_WINDOW_MS) recentSubmissions.delete(key);
    }
  }
}

function normalizeField(value: unknown) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

function normalizeMessage(value: unknown) {
  return typeof value === "string"
    ? value
        .replace(/\u0000/g, "")
        .replace(/\r\n?/g, "\n")
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n{4,}/g, "\n\n\n")
        .trim()
    : "";
}

function getOversizedField(fields: Record<keyof typeof fieldLimits, string>) {
  for (const [field, limit] of Object.entries(fieldLimits) as [
    keyof typeof fieldLimits,
    number,
  ][]) {
    if (fields[field].length > limit) return field;
  }
  return "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function hasValidCompletionTime(formStartedAt: unknown) {
  if (typeof formStartedAt !== "number" || !Number.isFinite(formStartedAt)) {
    return false;
  }

  const elapsed = Date.now() - formStartedAt;
  return elapsed >= MIN_FORM_COMPLETION_MS && elapsed <= MAX_FORM_AGE_MS;
}

function createSubmissionHash(
  clientKey: string,
  email: string,
  phone: string,
  message: string,
) {
  return createHash("sha256")
    .update(`${clientKey}|${email.toLowerCase()}|${phone}|${message.toLowerCase()}`)
    .digest("hex");
}

function isDuplicateSubmission(hash: string) {
  const timestamp = recentSubmissions.get(hash);
  return typeof timestamp === "number" && timestamp > Date.now() - DUPLICATE_WINDOW_MS;
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
