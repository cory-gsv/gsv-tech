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
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-sol";
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;

export async function POST(request: Request) {
  try {
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

    if (!messages.length) {
      return NextResponse.json(
        { error: "Send a question to start the chat." },
        { status: 400 },
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

    return NextResponse.json({ reply });
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
