import { NextRequest, NextResponse } from "next/server"
import {
  COOKIE_MAX_AGE_SECONDS,
  createBillingSession,
} from "../../billing/billingAuth"

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const password = String(form.get("password") || "").trim()
  const expected =
    (
      process.env.BILLING_HUB_PASSWORD ||
      process.env.GSV_BILLING_PASSWORD ||
      process.env.BILLING_HUB_SESSION_SECRET ||
      ""
    ).trim()

  if (!expected) {
    return NextResponse.redirect(
      new URL("/billing?error=missing", request.url),
      {
        status: 303,
      }
    )
  }

  if (password !== expected) {
    return NextResponse.redirect(new URL("/billing?error=wrong", request.url), {
      status: 303,
    })
  }

  const response = NextResponse.redirect(new URL("/billing", request.url), {
    status: 303,
  })
  response.cookies.set("gsv_billing_session", await createBillingSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
  return response
}
