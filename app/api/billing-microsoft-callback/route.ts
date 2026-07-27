import { NextRequest, NextResponse } from "next/server"
import {
  COOKIE_MAX_AGE_SECONDS,
  createBillingSession,
} from "../../billing/billingAuth"
import { isKnownPortalEmail } from "../../vault/access"
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose"

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

function legacyAllowedEmails() {
  return envValue("BILLING_AUTH_ALLOWED_EMAILS", "BILLING_HUB_ALLOWED_EMAILS")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function allowedEmail() {
  return (
    envValue("BILLING_AUTH_OWNER_EMAIL", "BILLING_AUTH_ALLOWED_EMAIL").toLowerCase() ||
    legacyAllowedEmails()[0] ||
    "cory@gsvisions.com"
  )
}

function claimString(claims: Record<string, unknown> | null, name: string) {
  const value = claims?.[name]
  return typeof value === "string" ? value : ""
}

function claimStringArray(claims: Record<string, unknown> | null, name: string) {
  const value = claims?.[name]
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
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
  const expectedNonce = request.cookies.get("gsv_billing_ms_nonce")?.value || ""
  const vaultStepUp = request.cookies.get("gsv_billing_ms_vault_stepup")?.value === "1"

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
    console.error("Microsoft token exchange failed", {
      status: tokenResponse.status,
      error: tokenJson.error || "missing_id_token",
      description: tokenJson.error_description || "Microsoft did not return an ID token",
    })
    return NextResponse.redirect(new URL(`${nextPath}?error=mstoken`, request.url))
  }

  let claims: Record<string, unknown>
  try {
    const jwks = createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`))
    const verified = await jwtVerify(tokenJson.id_token, jwks, {
      audience: clientId,
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      clockTolerance: 60,
    })
    claims = verified.payload as Record<string, unknown>
  } catch (verificationError) {
    const timestampClaims = decodeJwt(tokenJson.id_token)
    console.error("Microsoft ID token verification failed", {
      code: verificationError instanceof Error && "code" in verificationError ? String((verificationError as Error & { code?: unknown }).code || "") : "",
      message: verificationError instanceof Error ? verificationError.message : "Unknown verification error",
      serverTime: new Date().toISOString(),
      issuedAt: timestampClaims.iat ? new Date(timestampClaims.iat * 1000).toISOString() : "missing",
      expiresAt: timestampClaims.exp ? new Date(timestampClaims.exp * 1000).toISOString() : "missing",
    })
    return NextResponse.redirect(new URL(`${nextPath}?error=mstoken`, request.url))
  }
  const audience = claimString(claims, "aud")
  const email = (
    claimString(claims, "preferred_username") ||
    claimString(claims, "email") ||
    claimString(claims, "upn")
  ).toLowerCase()
  const permittedEmail = allowedEmail()
  const name = claimString(claims, "name")
  const subject = claimString(claims, "sub") || claimString(claims, "oid")
  const amr = claimStringArray(claims, "amr")
  const acrs = claimStringArray(claims, "acrs")
  const requiredAuthenticationContext = process.env.VAULT_AUTH_CONTEXT_ID || ""
  const authenticationContextSatisfied = Boolean(
    requiredAuthenticationContext && acrs.includes(requiredAuthenticationContext)
  )
  const mfaClaimPresent = amr.some((item) => ["mfa", "ngcmfa", "wiaormfa"].includes(item))
  const mfa = mfaClaimPresent || (
    vaultStepUp &&
    process.env.VAULT_ENTRA_MFA_POLICY_ENABLED === "true" &&
    authenticationContextSatisfied
  )
  const nonce = claimString(claims, "nonce")
  const authTime = Number(claims.auth_time || 0) * 1000

  if (
    audience !== clientId || !expectedNonce || nonce !== expectedNonce ||
    !email ||
    (email !== permittedEmail && !(await isKnownPortalEmail(email)))
  ) {
    return NextResponse.redirect(new URL(`${nextPath}?error=msunauthorized`, request.url))
  }
  if (vaultStepUp && (!authenticationContextSatisfied || !mfa)) {
    return NextResponse.redirect(new URL(`${nextPath}?error=mfa_required`, request.url))
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303,
  })
  response.cookies.set("gsv_billing_session", await createBillingSession({
    email,
    name,
    authProvider: "microsoft",
    mfa,
    authenticatedAt: vaultStepUp ? Date.now() : authTime || Date.now(),
    tenantId,
    subject,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
  response.cookies.delete("gsv_billing_ms_state")
  response.cookies.delete("gsv_billing_ms_next")
  response.cookies.delete("gsv_billing_ms_nonce")
  response.cookies.delete("gsv_billing_ms_vault_stepup")
  return response
}
