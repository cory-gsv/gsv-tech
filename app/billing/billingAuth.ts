const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12
export const VAULT_STEP_UP_MAX_AGE_MS = 60 * 60 * 1000

export type BillingSession = {
  issuedAt: number
  authenticatedAt: number
  email: string
  name: string
  authProvider: "microsoft" | "password"
  mfa: boolean
  tenantId: string
  subject: string
}

function billingSecret() {
  return (
    process.env.BILLING_HUB_SESSION_SECRET ||
    process.env.BILLING_HUB_PASSWORD ||
    process.env.GSV_BILLING_PASSWORD ||
    "local-dev-only"
  )
}

async function sign(value: string) {
  const data = new TextEncoder().encode(`${value}.${billingSecret()}`)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function base64UrlDecode(value: string) {
  const padded = `${value}${"=".repeat((4 - (value.length % 4)) % 4)}`
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export async function createBillingSession(
  session: Partial<Omit<BillingSession, "issuedAt">> = {}
) {
  const payload = JSON.stringify({
    issuedAt: Date.now(),
    authenticatedAt: Number(session.authenticatedAt) || Date.now(),
    email: session.email || "",
    name: session.name || "",
    authProvider: session.authProvider || "password",
    mfa: Boolean(session.mfa),
    tenantId: session.tenantId || "",
    subject: session.subject || "",
  } satisfies BillingSession)
  const encoded = base64UrlEncode(payload)
  return `${encoded}.${await sign(encoded)}`
}

function legacyPasswordSession(issuedAt: string): BillingSession {
  return {
    issuedAt: Number(issuedAt),
    authenticatedAt: Number(issuedAt),
    email: "",
    name: "Backup Login",
    authProvider: "password",
    mfa: false,
    tenantId: "",
    subject: "",
  }
}

export async function getBillingSession(token?: string): Promise<BillingSession | null> {
  if (!token) return null
  const [issuedAt, signature] = token.split(".")
  if (!issuedAt || !signature) return null

  if (signature === (await sign(issuedAt))) {
    if (/^\d+$/.test(issuedAt)) {
      const legacySession = legacyPasswordSession(issuedAt)
      const age = Date.now() - legacySession.issuedAt
      return Number.isFinite(age) &&
        age >= 0 &&
        age <= COOKIE_MAX_AGE_SECONDS * 1000
        ? legacySession
        : null
    }

    try {
      const session = JSON.parse(base64UrlDecode(issuedAt)) as BillingSession
      const age = Date.now() - Number(session.issuedAt)
      if (
        !Number.isFinite(age) ||
        age < 0 ||
        age > COOKIE_MAX_AGE_SECONDS * 1000
      ) {
        return null
      }
      return {
        issuedAt: Number(session.issuedAt),
        authenticatedAt: Number(session.authenticatedAt) || Number(session.issuedAt),
        email: String(session.email || "").toLowerCase(),
        name: String(session.name || ""),
        authProvider: session.authProvider === "microsoft" ? "microsoft" : "password",
        mfa: Boolean(session.mfa),
        tenantId: String(session.tenantId || ""),
        subject: String(session.subject || ""),
      }
    } catch {
      return null
    }
  }

  return null
}

export async function verifyBillingSession(token?: string) {
  return Boolean(await getBillingSession(token))
}

export function sessionRequiresMicrosoft(session: BillingSession | null) {
  return Boolean(session?.authProvider === "microsoft" && session.email)
}

export function sessionHasVaultStepUp(session: BillingSession | null) {
  if (!sessionRequiresMicrosoft(session)) return false
  const age = Date.now() - Number(session?.authenticatedAt || 0)
  return Boolean(session?.mfa && age >= 0 && age <= VAULT_STEP_UP_MAX_AGE_MS)
}

export { COOKIE_MAX_AGE_SECONDS }
