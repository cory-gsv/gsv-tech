import { NextResponse } from "next/server";

const FUNCTION_NAME = "gcal-sync";

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

    const res = await fetch(`${supabaseUrl}/functions/v1/${FUNCTION_NAME}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text();

    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            data?.message ||
            `Supabase function failed with ${res.status}`,
          details: data,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
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
