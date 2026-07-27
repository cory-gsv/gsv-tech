import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

type TranscriptMessage = {
  role?: "assistant" | "user";
  content?: string;
};

type TranscriptPayload = {
  sessionId?: string;
  page?: string;
  reason?: string;
  messages?: TranscriptMessage[];
  visitorInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  clientInfo?: {
    referrer?: string;
    language?: string;
    timezone?: string;
    screen?: string;
  };
};

const TRANSCRIPT_TO_EMAIL = "info@gsvisions.com";
const FALLBACK_FROM_EMAIL = "Golden State Visions <onboarding@resend.dev>";
const MAX_MESSAGES = 80;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_REQUEST_BYTES = 100_000;
const recentTranscripts = new Map<string, number>();
const DEDUPE_WINDOW_MS = 30 * 60 * 1_000;

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return NextResponse.json({ error: "Invalid transcript format." }, { status: 415 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Transcript is too large." }, { status: 413 });
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Invalid transcript origin." }, { status: 403 });
    }

    const body = (await request.json()) as TranscriptPayload;
    const sessionId = cleanText(body.sessionId, 100);
    const page = cleanText(body.page, 240) || "/";
    const reason = cleanText(body.reason, 80) || "Chat completed";
    const messages = normalizeMessages(body.messages);
    const visitorInfo = {
      name: cleanText(body.visitorInfo?.name, 120),
      phone: cleanText(body.visitorInfo?.phone, 40),
      email: cleanText(body.visitorInfo?.email, 254),
    };
    const clientInfo = {
      referrer: cleanText(body.clientInfo?.referrer, 500) || "Direct visit",
      language: cleanText(body.clientInfo?.language, 40) || "Unknown",
      timezone: cleanText(body.clientInfo?.timezone, 100) || "Unknown",
      screen: cleanText(body.clientInfo?.screen, 40) || "Unknown",
    };
    const requestInfo = getRequestInfo(request);

    if (!sessionId || !messages.some((message) => message.role === "user")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const transcript = messages
      .map((message) => `${message.role === "user" ? "Visitor" : "Assistant"}: ${message.content}`)
      .join("\n\n");
    const fingerprint = createHash("sha256")
      .update(`${sessionId}|${transcript}`)
      .digest("hex");

    if (isDuplicate(fingerprint)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: "Transcript email is not configured." }, { status: 500 });
    }

    const fromEmail = process.env.CONTACT_FROM_EMAIL || FALLBACK_FROM_EMAIL;
    const toEmail = process.env.CHAT_TRANSCRIPT_TO_EMAIL || TRANSCRIPT_TO_EMAIL;
    const locationLabel = [requestInfo.city, requestInfo.region]
      .filter(Boolean)
      .join(", ");
    const subject = `Website AI chat transcript — ${
      locationLabel ? `${locationLabel} — ` : ""
    }${reason}`;
    const text = [
      "Golden State Visions website AI chat transcript",
      `Completed because: ${reason}`,
      `Date/time: ${requestInfo.receivedAt}`,
      `Page: ${page}`,
      `Session: ${sessionId}`,
      "",
      "Visitor information",
      `Name: ${visitorInfo.name || "Not provided"}`,
      `Email: ${visitorInfo.email || "Not provided"}`,
      `Phone: ${visitorInfo.phone || "Not provided"}`,
      `IP address: ${requestInfo.ip || "Unavailable"}`,
      `Approximate location: ${
        [requestInfo.city, requestInfo.region, requestInfo.country]
          .filter(Boolean)
          .join(", ") || "Unavailable"
      }`,
      `Browser/device: ${requestInfo.userAgent || "Unavailable"}`,
      `Language: ${clientInfo.language}`,
      `Time zone: ${clientInfo.timezone}`,
      `Screen: ${clientInfo.screen}`,
      `Referrer: ${clientInfo.referrer}`,
      "",
      transcript,
    ].join("\n");
    const html = `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <h2 style="margin: 0 0 16px;">Website AI chat transcript</h2>
        <p><strong>Completed because:</strong> ${escapeHtml(reason)}</p>
        <p><strong>Date/time:</strong> ${escapeHtml(requestInfo.receivedAt)}</p>
        <p><strong>Page:</strong> ${escapeHtml(page)}</p>
        <p><strong>Session:</strong> ${escapeHtml(sessionId)}</p>
        <h3 style="margin: 22px 0 10px;">Visitor information</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 900px;">
          ${metadataRow("Name", visitorInfo.name || "Not provided")}
          ${metadataRow("Email", visitorInfo.email || "Not provided")}
          ${metadataRow("Phone", visitorInfo.phone || "Not provided")}
          ${metadataRow("IP address", requestInfo.ip || "Unavailable")}
          ${metadataRow(
            "Approximate location",
            [requestInfo.city, requestInfo.region, requestInfo.country]
              .filter(Boolean)
              .join(", ") || "Unavailable",
          )}
          ${metadataRow("Browser/device", requestInfo.userAgent || "Unavailable")}
          ${metadataRow("Language", clientInfo.language)}
          ${metadataRow("Time zone", clientInfo.timezone)}
          ${metadataRow("Screen", clientInfo.screen)}
          ${metadataRow("Referrer", clientInfo.referrer)}
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f5f3ee; border-radius: 12px;">
          ${messages
            .map(
              (message) =>
                `<p style="margin: 0 0 14px;"><strong>${
                  message.role === "user" ? "Visitor" : "Assistant"
                }:</strong> ${escapeHtml(message.content).replace(/\n/g, "<br />")}</p>`,
            )
            .join("")}
        </div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error("Chat transcript email failed", { status: response.status, data });
      return NextResponse.json({ error: "Transcript email failed." }, { status: 502 });
    }

    recentTranscripts.set(fingerprint, Date.now());
    pruneDuplicates();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Transcript email failed." }, { status: 500 });
  }
}

function normalizeMessages(messages: unknown) {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => {
      const item = message as TranscriptMessage;
      return {
        role: item.role === "user" ? ("user" as const) : ("assistant" as const),
        content: cleanText(item.content, MAX_MESSAGE_LENGTH),
      };
    })
    .filter((message) => message.content);
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim().slice(0, maxLength)
    : "";
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function getRequestInfo(request: Request) {
  const forwardedFor =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";

  return {
    ip: forwardedFor.split(",")[0]?.trim() || "",
    city: decodeHeader(request.headers.get("x-vercel-ip-city")),
    region: cleanText(request.headers.get("x-vercel-ip-country-region"), 80),
    country: cleanText(request.headers.get("x-vercel-ip-country"), 80),
    userAgent: cleanText(request.headers.get("user-agent"), 500),
    receivedAt: new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "medium",
      timeStyle: "long",
    }),
  };
}

function decodeHeader(value: string | null) {
  if (!value) return "";
  try {
    return cleanText(decodeURIComponent(value), 160);
  } catch {
    return cleanText(value, 160);
  }
}

function metadataRow(label: string, value: string) {
  return `
    <tr>
      <th style="padding: 6px 14px 6px 0; text-align: left; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</th>
      <td style="padding: 6px 0; overflow-wrap: anywhere;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function isDuplicate(fingerprint: string) {
  const sentAt = recentTranscripts.get(fingerprint);
  return typeof sentAt === "number" && sentAt > Date.now() - DEDUPE_WINDOW_MS;
}

function pruneDuplicates() {
  if (recentTranscripts.size <= 500) return;

  const cutoff = Date.now() - DEDUPE_WINDOW_MS;
  for (const [fingerprint, sentAt] of recentTranscripts) {
    if (sentAt <= cutoff) recentTranscripts.delete(fingerprint);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
