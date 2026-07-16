import { NextRequest, NextResponse } from "next/server"
import { saveNinjaOneTokens } from "../ninjaoneAuth"

const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

type NinjaOneTokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

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

function htmlEscape(value = "") {
  return value.replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    })[char] || char
  )
}

function tokenPage(token: NinjaOneTokenResponse) {
  const refreshLine = token.refresh_token
    ? `NINJAONE_REFRESH_TOKEN=${token.refresh_token}`
    : ""
  const accessLine = token.access_token
    ? `NINJAONE_ACCESS_TOKEN=${token.access_token}`
    : ""
  const preferred = refreshLine || accessLine
  const connectedTitle = refreshLine
    ? "NinjaOne OAuth Connected"
    : "NinjaOne Connected With Short-Lived Token"
  const connectedMessage = refreshLine
    ? "NinjaOne is connected locally. The portal saved the refresh token on this machine and will refresh it automatically."
    : "NinjaOne only returned a short-lived access token. The portal saved it locally, but NinjaOne did not give us the refresh token needed for seamless long-term use."

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NinjaOne Connected</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; background: #f6f8fb; color: #111820; }
    main { max-width: 860px; margin: 64px auto; padding: 32px; background: white; border: 1px solid #d9e1ea; border-radius: 10px; }
    h1 { margin-top: 0; }
    pre { white-space: pre-wrap; word-break: break-all; padding: 16px; background: #111820; color: #f8fafc; border-radius: 8px; }
    p { color: #52606d; line-height: 1.5; }
    a { color: #0b64c0; }
  </style>
</head>
<body>
  <main>
    <h1>${connectedTitle}</h1>
    <p>${connectedMessage}</p>
    <pre>${htmlEscape(preferred)}</pre>
    ${refreshLine && accessLine ? `<p>A refresh token was returned and saved locally, so you should not need to reconnect each time.</p>` : ""}
    ${!refreshLine && accessLine ? `<p><strong>Why short term only?</strong> NinjaOne did not return a refresh token. Confirm the GSV Portal client app has Refresh token enabled under Allowed grant types, then reconnect. If NinjaOne rejects the next reconnect because of <code>offline_access</code>, remove that scope from the code and NinjaOne is likely not exposing refresh tokens for this app type.</p>` : ""}
    <p>For Vercel production later, add the refresh token as <code>NINJAONE_REFRESH_TOKEN</code>.</p>
    <p><a href="/portal">Back to portal</a></p>
  </main>
</body>
</html>`
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const error = url.searchParams.get("error")
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const expectedState = request.cookies.get("gsv_ninjaone_oauth_state")?.value

  if (error) {
    return NextResponse.json(
      { error, description: url.searchParams.get("error_description") || "" },
      { status: 400 },
    )
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.json(
      { error: "NinjaOne OAuth state expired or did not match." },
      { status: 400 },
    )
  }

  const clientId = envValue("NINJAONE_OAUTH_CLIENT_ID")
  const clientSecret = envValue("NINJAONE_OAUTH_CLIENT_SECRET")
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "Missing NINJAONE_OAUTH_CLIENT_ID or NINJAONE_OAUTH_CLIENT_SECRET. The portal needs a NinjaOne Regular Web Application for ticket comments.",
      },
      { status: 500 },
    )
  }

  const tokenResponse = await fetch(`${NINJAONE_API_ROOT}/ws/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri(request),
    }),
    cache: "no-store",
  })
  const token = (await tokenResponse.json().catch(() => ({}))) as NinjaOneTokenResponse

  if (!tokenResponse.ok || (!token.access_token && !token.refresh_token)) {
    return NextResponse.json(
      {
        error:
          token.error_description ||
          token.error ||
          "NinjaOne token exchange failed.",
      },
      { status: 500 },
    )
  }

  await saveNinjaOneTokens(token)

  const response = new NextResponse(tokenPage(token), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
  if (token.access_token) {
    response.cookies.set("gsv_ninjaone_access_token", token.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.max(60, Number(token.expires_in || 3600) - 60),
    })
  }
  if (token.refresh_token) {
    response.cookies.set("gsv_ninjaone_refresh_token", token.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }
  response.cookies.delete("gsv_ninjaone_oauth_state")
  return response
}
