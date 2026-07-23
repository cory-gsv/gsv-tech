import { NextResponse } from "next/server";

const FUNCTION_NAME = "gcal-sync";
const BOOKING_SERVICE_UNAVAILABLE_MESSAGE =
  "Booking availability is temporarily unavailable. Please contact Golden State Visions directly and we’ll help schedule your consultation.";
const BOOKING_COULD_NOT_COMPLETE_MESSAGE =
  "Booking could not be completed right now. Please call Golden State Visions at (916) 432-3373 and we’ll help schedule your consultation.";
const CONSULT_BOOKING_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

type SupabaseFunctionResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

const consultBookingPending = new Map<string, Promise<SupabaseFunctionResult>>();
const consultBookingCache = new Map<
  string,
  { expiresAt: number; result: SupabaseFunctionResult }
>();

function getResponseMessage(data: unknown, key: "error" | "message") {
  if (!data || typeof data !== "object" || !(key in data)) return "";

  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function getSupabaseFunctionUrl(supabaseUrl: string) {
  try {
    const url = new URL(supabaseUrl);

    if (url.protocol !== "https:") {
      return { error: "SUPABASE_URL must start with https://" };
    }

    url.pathname = `${url.pathname.replace(/\/$/, "")}/functions/v1/${FUNCTION_NAME}`;
    url.search = "";
    url.hash = "";

    return { url: url.toString() };
  } catch {
    return { error: "SUPABASE_URL is not a valid URL" };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL" },
        { status: 500 },
      );
    }

    if (!supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
        { status: 500 },
      );
    }

    const functionUrl = getSupabaseFunctionUrl(supabaseUrl);

    if (functionUrl.error || !functionUrl.url) {
      return NextResponse.json(
        { error: functionUrl.error || "Invalid Supabase function URL" },
        { status: 500 },
      );
    }

    const dedupeKey = getConsultBookingDedupeKey(body);

    if (dedupeKey) {
      pruneConsultBookingCache();

      const cached = consultBookingCache.get(dedupeKey);

      if (cached && cached.expiresAt > Date.now()) {
        console.info("Deduped repeated consult_book request", {
          action: getBodyString(body, "action"),
          start: getBodyString(body, "start"),
        });

        return createBookingResponse(cached.result);
      }

      const pending = consultBookingPending.get(dedupeKey);

      if (pending) {
        console.info("Deduped concurrent consult_book request", {
          action: getBodyString(body, "action"),
          start: getBodyString(body, "start"),
        });

        return createBookingResponse(await pending);
      }

      const requestPromise = invokeSupabaseBookingFunction(
        functionUrl.url,
        supabaseAnonKey,
        body,
      );

      consultBookingPending.set(dedupeKey, requestPromise);

      try {
        const result = await requestPromise;

        if (result.ok) {
          consultBookingCache.set(dedupeKey, {
            expiresAt: Date.now() + CONSULT_BOOKING_DEDUPE_WINDOW_MS,
            result,
          });
        }

        return createBookingResponse(result);
      } finally {
        consultBookingPending.delete(dedupeKey);
      }
    }

    return createBookingResponse(
      await invokeSupabaseBookingFunction(functionUrl.url, supabaseAnonKey, body),
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected booking API error",
      },
      { status: 500 },
    );
  }
}

async function invokeSupabaseBookingFunction(
  functionUrl: string,
  supabaseAnonKey: string,
  body: unknown,
): Promise<SupabaseFunctionResult> {
  let res: Response;

  try {
    res = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error: unknown) {
    console.error("Booking Supabase function request failed", error);

    return {
      ok: false,
      status: 503,
      body: { error: BOOKING_SERVICE_UNAVAILABLE_MESSAGE },
    };
  }

  const text = await res.text();

  let data: unknown = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    console.error("Booking Supabase function returned an error", {
      status: res.status,
      action: getBodyString(body, "action"),
      data,
    });

    const responseMessage =
      getResponseMessage(data, "error") ||
      getResponseMessage(data, "message") ||
      `Supabase function failed with ${res.status}`;

    return {
      ok: false,
      status: res.status,
      body: {
        error: getPublicBookingError(responseMessage, getBodyString(body, "action")),
      },
    };
  }

  console.info("Booking Supabase function succeeded", {
    action: getBodyString(body, "action"),
    start: getBodyString(body, "start"),
  });

  return { ok: true, status: res.status, body: data };
}

function createBookingResponse(result: SupabaseFunctionResult) {
  return NextResponse.json(result.body, { status: result.status });
}

function getConsultBookingDedupeKey(body: unknown) {
  if (!body || typeof body !== "object") return "";

  const action = getBodyString(body, "action");

  if (action !== "consult_book") return "";

  return [
    action,
    getBodyString(body, "start"),
    getBodyString(body, "end"),
    getBodyString(body, "email").toLowerCase(),
    getBodyString(body, "phone").replace(/\D/g, ""),
  ].join("|");
}

function getBodyString(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return "";

  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function pruneConsultBookingCache() {
  const now = Date.now();

  for (const [key, entry] of consultBookingCache) {
    if (entry.expiresAt <= now) {
      consultBookingCache.delete(key);
    }
  }
}

function getPublicBookingError(message: string, action: unknown) {
  const normalized = message.toLowerCase();

  if (action === "availability") {
    return BOOKING_SERVICE_UNAVAILABLE_MESSAGE;
  }

  if (
    normalized.includes("resend") ||
    normalized.includes("domain is not verified") ||
    normalized.includes("verify your domain") ||
    normalized.includes("validation_error") ||
    normalized.includes("supabase function failed")
  ) {
    return BOOKING_COULD_NOT_COMPLETE_MESSAGE;
  }

  return message || BOOKING_COULD_NOT_COMPLETE_MESSAGE;
}
