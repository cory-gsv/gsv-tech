import { NextRequest, NextResponse } from "next/server"

const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

function envValue(key: string) {
  return process.env[key]?.trim() || ""
}

function redirectUri(request: NextRequest) {
  return (
    envValue("NINJAONE_OAUTH_REDIRECT_URI") ||
    envValue("NINJAONE_REDIRECT_URI") ||
    new URL("/api/ninjaone-oauth-callback", request.url).toString()
  )
}

export async function GET(request: NextRequest) {
  const clientId = envValue("NINJAONE_OAUTH_CLIENT_ID")

  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Missing NINJAONE_OAUTH_CLIENT_ID. Create a NinjaOne Regular Web Application for ticket comments, add its client ID/secret to Vercel, then retry.",
      },
      { status: 500 },
    )
  }

  const state = crypto.randomUUID()
  const authorizeUrl = new URL(`${NINJAONE_API_ROOT}/ws/oauth/authorize`)
  authorizeUrl.searchParams.set("response_type", "code")
  authorizeUrl.searchParams.set("client_id", clientId)
  authorizeUrl.searchParams.set("redirect_uri", redirectUri(request))
  authorizeUrl.searchParams.set("scope", "monitoring management control offline_access")
  authorizeUrl.searchParams.set("access_type", "offline")
  authorizeUrl.searchParams.set("prompt", "consent")
  authorizeUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set("gsv_ninjaone_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  })
  return response
}
