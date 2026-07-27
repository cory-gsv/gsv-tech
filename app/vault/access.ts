import { cookies, headers } from "next/headers"
import {
  BillingSession,
  getBillingSession,
  sessionHasVaultStepUp,
  sessionRequiresMicrosoft,
} from "../billing/billingAuth"
import { isVaultConfigured, vaultQuery } from "./db"

export type VaultUser = {
  id: string
  email: string
  display_name: string
  role: "admin" | "client"
  enabled: boolean
}

export type VaultClientAccess = {
  client_id: string
  external_client_id: string
  client_name: string
  can_view_credentials: boolean
  can_export: boolean
}

export async function currentBillingSession() {
  const cookieStore = await cookies()
  return getBillingSession(cookieStore.get("gsv_billing_session")?.value)
}

function internalAllowedEmails() {
  return [
    process.env.BILLING_AUTH_OWNER_EMAIL,
    process.env.BILLING_AUTH_ALLOWED_EMAIL,
    process.env.BILLING_HUB_ALLOWED_EMAILS,
    process.env.BILLING_AUTH_ALLOWED_EMAILS,
    "cory@gsvisions.com",
  ]
    .join(",")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function findVaultUserByEmail(email: string) {
  if (!email || !isVaultConfigured()) return null
  const rows = await vaultQuery<VaultUser>(
    `select id, email, display_name, role, enabled
       from vault_users
      where lower(email) = lower($1)
      limit 1`,
    [email]
  )
  return rows[0] || null
}

export async function isKnownPortalEmail(email: string) {
  const normalized = email.toLowerCase()
  if (internalAllowedEmails().includes(normalized)) return true
  try {
    const user = await findVaultUserByEmail(normalized)
    return Boolean(user?.enabled)
  } catch {
    return false
  }
}

export async function requireVaultUser() {
  const session = await currentBillingSession()
  if (!session) {
    return { error: "microsoft_required" as const, status: 401 as const }
  }

  if (!sessionRequiresMicrosoft(session)) {
    if (process.env.NODE_ENV !== "production" && session.authProvider === "password") {
      return {
        session,
        user: {
          id: "",
          email: "local-admin@gsvisions.local",
          display_name: session.name || "Local Admin",
          role: "admin" as const,
          enabled: true,
        },
      }
    }
    return { error: "microsoft_required" as const, status: 401 as const }
  }

  const authedSession: BillingSession = session
  const email = authedSession.email.toLowerCase()
  const dbUser = await findVaultUserByEmail(email)
  const internal = internalAllowedEmails().includes(email)
  const user: VaultUser | null = dbUser || (internal
    ? {
        id: "",
        email,
        display_name: authedSession.name || email,
        role: "admin",
        enabled: true,
      }
    : null)

  if (!user?.enabled) {
    return { error: "not_allowed" as const, status: 403 as const }
  }
  return { session: authedSession, user }
}

export async function requireVaultStepUp(session: BillingSession | null) {
  return sessionHasVaultStepUp(session)
}

export async function clientAccessForUser(user: VaultUser) {
  if (user.role === "admin") {
    return vaultQuery<VaultClientAccess>(
      `select id as client_id,
              external_client_id,
              name as client_name,
              true as can_view_credentials,
              true as can_export
         from vault_clients
        where status <> 'inactive'
        order by name`
    )
  }

  return vaultQuery<VaultClientAccess>(
      `select c.id as client_id,
              c.external_client_id,
            c.name as client_name,
            m.can_view_credentials,
            m.can_export
       from vault_client_memberships m
       join vault_clients c on c.id = m.client_id
      where m.user_id = $1
        and c.status <> 'inactive'
      order by c.name`,
    [user.id]
  )
}

export async function canAccessClient(
  user: VaultUser,
  clientId: string,
  permission: "view" | "export" = "view"
) {
  if (user.role === "admin") return true
  const access = await clientAccessForUser(user)
  return access.some((item) => {
    if (item.client_id !== clientId) return false
    return permission === "export" ? item.can_export : item.can_view_credentials
  })
}

export async function auditVaultEvent(input: {
  user: VaultUser
  clientId?: string
  targetType: string
  targetId?: string
  eventType: string
  reason?: string
}) {
  if (!isVaultConfigured()) return
  const headerStore = await headers()
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    ""
  const userAgent = headerStore.get("user-agent") || ""

  await vaultQuery(
    `insert into vault_access_events (
       actor_user_id,
       actor_email,
       client_id,
       target_type,
       target_id,
       event_type,
       reason,
       ip_address,
       user_agent
     ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      input.user.id || null,
      input.user.email,
      input.clientId || null,
      input.targetType,
      input.targetId || null,
      input.eventType,
      input.reason || "",
      ip,
      userAgent,
    ]
  )
}
