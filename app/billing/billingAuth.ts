const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12

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

export async function createBillingSession() {
  const issuedAt = Date.now().toString()
  return `${issuedAt}.${await sign(issuedAt)}`
}

export async function verifyBillingSession(token?: string) {
  if (!token) return false
  const [issuedAt, signature] = token.split(".")
  if (!issuedAt || !signature) return false

  const age = Date.now() - Number(issuedAt)
  if (
    !Number.isFinite(age) ||
    age < 0 ||
    age > COOKIE_MAX_AGE_SECONDS * 1000
  ) {
    return false
  }

  return signature === (await sign(issuedAt))
}

export { COOKIE_MAX_AGE_SECONDS }
