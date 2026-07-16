import { promises as fs } from "fs"
import path from "path"

const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

const TOKEN_STORE_PATH = path.join(process.cwd(), ".ninjaone-token.json")

type NinjaOneTokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

type StoredNinjaOneToken = {
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  updatedAt?: string
}

export function ninjaOneEnvValue(key: string) {
  return process.env[key]?.trim() || ""
}

export async function ninjaOneServiceAccessToken(scope = "monitoring management control") {
  const clientId =
    ninjaOneEnvValue("NINJAONE_SERVICE_CLIENT_ID") ||
    ninjaOneEnvValue("NINJAONE_CLIENT_ID")
  const clientSecret =
    ninjaOneEnvValue("NINJAONE_SERVICE_CLIENT_SECRET") ||
    ninjaOneEnvValue("NINJAONE_CLIENT_SECRET")

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing NinjaOne API credentials. Set NINJAONE_CLIENT_ID and NINJAONE_CLIENT_SECRET.",
    )
  }

  const response = await fetch(`${NINJAONE_API_ROOT}/ws/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope,
    }),
    cache: "no-store",
  })
  const data = (await response.json().catch(() => ({}))) as NinjaOneTokenResponse

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "NinjaOne authentication failed.",
    )
  }

  return String(data.access_token)
}

async function readStoredToken(): Promise<StoredNinjaOneToken> {
  try {
    return JSON.parse(await fs.readFile(TOKEN_STORE_PATH, "utf8"))
  } catch {
    return {}
  }
}

export async function saveNinjaOneTokens(token: NinjaOneTokenResponse) {
  const existing = await readStoredToken()
  const next: StoredNinjaOneToken = {
    ...existing,
    updatedAt: new Date().toISOString(),
  }

  if (token.access_token) next.accessToken = token.access_token
  if (token.refresh_token) next.refreshToken = token.refresh_token
  if (token.expires_in) {
    next.expiresAt = Date.now() + Math.max(30, Number(token.expires_in) - 60) * 1000
  }

  try {
    await fs.writeFile(TOKEN_STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, {
      mode: 0o600,
    })
  } catch {
    // Serverless production may not allow local writes. Vercel should use env vars.
  }
}

async function refreshUserToken(refreshToken: string) {
  const clientId = ninjaOneEnvValue("NINJAONE_CLIENT_ID")
  const clientSecret = ninjaOneEnvValue("NINJAONE_CLIENT_SECRET")

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing NinjaOne OAuth app credentials. Set NINJAONE_CLIENT_ID and NINJAONE_CLIENT_SECRET.",
    )
  }

  const response = await fetch(`${NINJAONE_API_ROOT}/ws/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      scope: "monitoring management control",
    }),
    cache: "no-store",
  })
  const data = (await response.json().catch(() => ({}))) as NinjaOneTokenResponse

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description ||
        data.error ||
        "NinjaOne refresh token failed. Reconnect NinjaOne from the portal.",
    )
  }

  await saveNinjaOneTokens({
    ...data,
    refresh_token: data.refresh_token || refreshToken,
  })
  return String(data.access_token)
}

export async function ninjaOneUserAccessToken() {
  const stored = await readStoredToken()
  const refreshToken = ninjaOneEnvValue("NINJAONE_REFRESH_TOKEN") || stored.refreshToken || ""
  const storedAccessToken = stored.accessToken || ""
  const envAccessToken = ninjaOneEnvValue("NINJAONE_ACCESS_TOKEN")

  if (refreshToken) return refreshUserToken(refreshToken)
  if (storedAccessToken && stored.expiresAt && stored.expiresAt > Date.now()) {
    return storedAccessToken
  }
  if (envAccessToken) return envAccessToken
  if (storedAccessToken) return storedAccessToken

  throw new Error("NinjaOne needs to be connected from the portal.")
}
