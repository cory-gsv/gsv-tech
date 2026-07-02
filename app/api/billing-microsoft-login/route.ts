import { NextRequest, NextResponse } from "next/server"

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
  const redirectUri =
    envValue("BILLING_AUTH_REDIRECT_URI") ||
    new URL("/api/billing-microsoft-callback", request.url).toString()
  return { tenantId, clientId, redirectUri }
}

export async function GET(request: NextRequest) {
  const { tenantId, clientId, redirectUri } = billingAuthConfig(request)
  if (!tenantId || !clientId) {
    return NextResponse.redirect(new URL("/billing?error=msmissing", request.url))
  }

  const state = crypto.randomUUID()
  const authorizeUrl = new URL(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
  )
  authorizeUrl.searchParams.set("client_id", clientId)
  authorizeUrl.searchParams.set("response_type", "code")
  authorizeUrl.searchParams.set("redirect_uri", redirectUri)
  authorizeUrl.searchParams.set("response_mode", "query")
  authorizeUrl.searchParams.set("scope", "openid profile email")
  authorizeUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set("gsv_billing_ms_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  })
  return response
}
