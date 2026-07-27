import { NextResponse } from "next/server";
import { companyAiGuidance } from "@/app/config/companyAiGuidance";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role?: ChatRole;
  content?: string;
};

type SiteChatPayload = {
  messages?: ChatMessage[];
  page?: string;
  responseCount?: number;
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-sol";
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_GENERAL_AI_RESPONSES = 6;
const CHAT_COUNT_COOKIE = "gsv_site_chat_count";
const CHAT_COUNT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function GET(request: Request) {
  const responseCount = getCookieResponseCount(request);
  const country = getRequestCountry(request);
  const serviceAreaBlocked = Boolean(country && country !== "US");

  return NextResponse.json(
    {
      responseCount,
      limit: MAX_GENERAL_AI_RESPONSES,
      limitReached: responseCount >= MAX_GENERAL_AI_RESPONSES,
      country,
      serviceAreaBlocked,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  try {
    const country = getRequestCountry(request);
    if (country && country !== "US") {
      return NextResponse.json(
        {
          error:
            "It looks like you’re outside our U.S. service area. Golden State Visions currently serves customers in the United States.",
          serviceAreaBlocked: true,
          country,
        },
        { status: 403 },
      );
    }

    const apiKey =
      process.env.OPENAI_SITE_CHAT_API_KEY?.trim() ||
      process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "The AI chat is not connected yet. Add OPENAI_SITE_CHAT_API_KEY to enable live answers.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as SiteChatPayload;
    const messages = normalizeMessages(body.messages);
    const cookieResponseCount = getCookieResponseCount(request);
    const clientResponseCount = parseResponseCount(body.responseCount);
    const responseCount = Math.max(cookieResponseCount, clientResponseCount);

    if (!messages.length) {
      return NextResponse.json(
        { error: "Send a question to start the chat." },
        { status: 400 },
      );
    }

    if (responseCount >= MAX_GENERAL_AI_RESPONSES) {
      return NextResponse.json(
        {
          error:
            "The six-answer chat limit has been reached. You can still book a consult or request a call.",
          limitReached: true,
          responseCount: MAX_GENERAL_AI_RESPONSES,
        },
        { status: 429 },
      );
    }

    const model = process.env.OPENAI_SITE_CHAT_MODEL?.trim() || DEFAULT_MODEL;
    const currentPage = sanitizeText(body.page || "", 240);

    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: buildInstructions(currentPage),
        input: buildTranscript(messages),
        max_output_tokens: 360,
        store: false,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            data?.message ||
            `AI chat failed with status ${response.status}.`,
        },
        { status: response.status },
      );
    }

    const reply = cleanAssistantReply(extractOutputText(data));

    if (!reply) {
      return NextResponse.json(
        { error: "The AI chat returned an empty answer. Please try again." },
        { status: 502 },
      );
    }

    const nextResponseCount = responseCount + 1;
    const nextResponse = NextResponse.json({
      reply,
      responseCount: nextResponseCount,
    });
    nextResponse.cookies.set(CHAT_COUNT_COOKIE, String(nextResponseCount), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CHAT_COUNT_MAX_AGE_SECONDS,
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected AI chat error.",
      },
      { status: 500 },
    );
  }
}

function getCookieResponseCount(request: Request) {
  return parseResponseCount(
    request.headers
      .get("cookie")
      ?.match(new RegExp(`(?:^|;\\s*)${CHAT_COUNT_COOKIE}=([^;]*)`))?.[1],
  );
}

function getRequestCountry(request: Request) {
  return request.headers.get("x-vercel-ip-country")?.trim().toUpperCase() || "";
}

function parseResponseCount(value: unknown) {
  const count =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : 0;

  return Number.isFinite(count)
    ? Math.max(0, Math.min(Math.floor(count), MAX_GENERAL_AI_RESPONSES))
    : 0;
}

function normalizeMessages(
  messages?: ChatMessage[],
): { role: ChatRole; content: string }[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => {
      const role: ChatRole = message.role === "assistant" ? "assistant" : "user";

      return {
        role,
        content: sanitizeText(message.content || "", MAX_MESSAGE_LENGTH),
      };
    })
    .filter((message) => message.content.length > 0);
}

function sanitizeText(value: string, maxLength: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function buildInstructions(currentPage: string) {
  return `
${companyAiGuidance}

Current page path: ${currentPage || "unknown"}

Use the current page only as light context. Do not invent page-specific offers, prices, or guarantees.
`.trim();
}

function buildTranscript(messages: { role: ChatRole; content: string }[]) {
  return messages
    .map((message) => {
      const speaker = message.role === "assistant" ? "Assistant" : "Visitor";
      return `${speaker}: ${message.content}`;
    })
    .join("\n");
}

function extractOutputText(data: unknown) {
  if (!data || typeof data !== "object") return "";

  const response = data as {
    output_text?: unknown;
    output?: {
      type?: string;
      content?: {
        type?: string;
        text?: unknown;
      }[];
    }[];
  };

  if (typeof response.output_text === "string") {
    return response.output_text.trim();
  }

  const chunks =
    response.output
      ?.flatMap((item) => item.content || [])
      .filter((part) => part.type === "output_text" && typeof part.text === "string")
      .map((part) => part.text as string) || [];

  return chunks.join("\n").trim();
}

function cleanAssistantReply(reply: string) {
  return reply
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\bGSV\b/g, "Golden State Visions")
    .trim();
}
