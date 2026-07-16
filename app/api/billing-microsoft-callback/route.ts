import { NextRequest, NextResponse } from "next/server"
import {
  COOKIE_MAX_AGE_SECONDS,
  createBillingSession,
} from "../../billing/billingAuth"

type MicrosoftTokenResponse = {
  id_token?: string
  error?: string
  error_description?: string
}

function envValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value.trim()
  }
  return ""
}

function billingAuthConfig(request: NextRequest) {
  const tenantId = envValue(
    "BILLING_AUTH_MS_TENANT_ID",
    "BILLING_MS_TENANT_ID",
    "MS_TENANT_ID"
  )
  const clientId = envValue(
    "BILLING_AUTH_MS_CLIENT_ID",
    "BILLING_MS_CLIENT_ID",
    "MS_CLIENT_ID"
  )
  const clientSecret = envValue(
    "BILLING_AUTH_MS_CLIENT_SECRET",
    "BILLING_MS_CLIENT_SECRET",
    "MS_CLIENT_SECRET"
  )
  const redirectUri =
    envValue("BILLING_AUTH_REDIRECT_URI") ||
    new URL("/api/billing-microsoft-callback", request.url).toString()
  return { tenantId, clientId, clientSecret, redirectUri }
}

function base64UrlDecode(value: string) {
  const padded = `${value}${"=".repeat((4 - (value.length % 4)) % 4)}`
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64")
    .toString("utf8")
}

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1]
  if (!payload) return null
  try {
    return JSON.parse(base64UrlDecode(payload)) as Record<string, unknown>
  } catch {
    return null
  }
}

function allowedEmails() {
  return envValue("BILLING_AUTH_ALLOWED_EMAILS", "BILLING_HUB_ALLOWED_EMAILS")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function claimString(claims: Record<string, unknown> | null, name: string) {
  const value = claims?.[name]
  return typeof value === "string" ? value : ""
}

function safeCookiePath(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/billing"
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const error = url.searchParams.get("error")
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const expectedState = request.cookies.get("gsv_billing_ms_state")?.value
  const nextPath = safeCookiePath(request.cookies.get("gsv_billing_ms_next")?.value)

  if (error) {
    return NextResponse.redirect(new URL(`${nextPath}?error=msdenied`, request.url))
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL(`${nextPath}?error=msstate`, request.url))
  }

  const { tenantId, clientId, clientSecret, redirectUri } =
    billingAuthConfig(request)
  if (!tenantId || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`${nextPath}?error=msmissing`, request.url))
  }

  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        scope: "openid profile email",
      }),
      cache: "no-store",
    }
  )
  const tokenJson = (await tokenResponse.json()) as MicrosoftTokenResponse
  if (!tokenResponse.ok || !tokenJson.id_token) {
    return NextResponse.redirect(new URL(`${nextPath}?error=mstoken`, request.url))
  }

  const claims = decodeJwtPayload(tokenJson.id_token)
  const audience = claimString(claims, "aud")
  const email = (
    claimString(claims, "preferred_username") ||
    claimString(claims, "email") ||
    claimString(claims, "upn")
  ).toLowerCase()
  const allowlist = allowedEmails()

  if (audience !== clientId || !email || !allowlist.includes(email)) {
    return NextResponse.redirect(new URL(`${nextPath}?error=msunauthorized`, request.url))
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303,
  })
  response.cookies.set("gsv_billing_session", await createBillingSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
  response.cookies.delete("gsv_billing_ms_state")
  response.cookies.delete("gsv_billing_ms_next")
  return response
}
