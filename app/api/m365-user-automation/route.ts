import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBillingSession } from "../../billing/billingAuth"
import { ninjaOneServiceAccessToken, ninjaOneUserAccessToken } from "../ninjaoneAuth"

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0"
const PAX8_API_ROOT = "https://api.pax8.com"
const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

type AutomationRequest = {
  mode?: "preview" | "run"
  request?: {
    id?: string
    clientId?: string
    firstName?: string
    lastName?: string
    displayName?: string
    userPrincipalName?: string
    license?: string
    requester?: string
    sourceEmail?: string
    setupEmail?: string
    ninjaTicketId?: string
    temporaryPassword?: string
    notes?: string
    pax8AlreadyIncreased?: boolean
    pax8SubscriptionId?: string
  }
  client?: {
    name?: string
    m365TenantKey?: string
    pax8CompanyId?: string
  }
}

type GraphSku = {
  skuId?: string
  skuPartNumber?: string
  consumedUnits?: number
  prepaidUnits?: {
    enabled?: number
    suspended?: number
    warning?: number
  }
}

type Pax8Page<T> = {
  content?: T[]
  page?: {
    totalPages?: number
  }
}

type Pax8Subscription = {
  id?: string
  companyId?: string
  productId?: string
  productName?: string
  quantity?: number
  status?: string
  billingTerm?: string
  commitment?: string
  startDate?: string
  price?: number
  partnerCost?: number
}

type LicenseAvailability = {
  sku: GraphSku
  available: number
  effectiveAvailable?: number
  pax8Available?: number
  pax8Quantity?: number
}

type GraphUser = {
  id?: string
  displayName?: string
  userPrincipalName?: string
  assignedLicenses?: Array<{ skuId?: string }>
}

function envValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return ""
}

function tenantEnvValue(tenantKey: string, ...keys: string[]) {
  const normalized = tenantKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, "_")
  if (normalized && normalized !== "DEFAULT") {
    const value = envValue(...keys.map((key) => `${normalized}_${key}`))
    if (value) return value
  }
  return envValue(...keys)
}

function graphProvisioningEnvValue(
  tenantKey: string,
  kind: "TENANT_ID" | "CLIENT_ID" | "CLIENT_SECRET",
) {
  const normalized = tenantEnvPrefix(tenantKey)
  const baseKeys =
    kind === "TENANT_ID"
      ? ["MS_TENANT_ID", "MICROSOFT_TENANT_ID", "AZURE_TENANT_ID"]
      : kind === "CLIENT_ID"
        ? ["MS_CLIENT_ID", "MICROSOFT_CLIENT_ID", "AZURE_CLIENT_ID"]
        : ["MS_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET", "AZURE_CLIENT_SECRET"]

  if (normalized && normalized !== "DEFAULT") {
    const tenantSpecific = envValue(...baseKeys.map((key) => `${normalized}_${key}`))
    if (tenantSpecific) return tenantSpecific
  }

  return envValue(...baseKeys)
}

function tenantExpectedProvisioningEnv(tenantKey: string) {
  const prefix = tenantEnvPrefix(tenantKey)
  if (prefix && prefix !== "DEFAULT") {
    return `${prefix}_MS_TENANT_ID / ${prefix}_MS_CLIENT_ID / ${prefix}_MS_CLIENT_SECRET`
  }
  return "MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET"
}

function tenantEnvPrefix(tenantKey: string) {
  return tenantKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, "_")
}

function cleanText(value: unknown) {
  return String(value || "").trim()
}

function resolvedTenantKey(client: AutomationRequest["client"], automationRequest: AutomationRequest["request"]) {
  const rawTenantKey = cleanText(client?.m365TenantKey || "")
  const clientId = cleanText(automationRequest?.clientId || "")
  const clientName = cleanText(client?.name || "")

  if (!rawTenantKey || rawTenantKey === "default") {
    if (clientId === "client_moxie" || /moxie/i.test(clientName)) return "moxie"
  }

  return rawTenantKey || "default"
}

function normalize(value: string) {
  return cleanText(value)
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/new commerce experience|nce|microsoft|office|365|business|online|plan|no teams|\(|\)|-/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function compact(value: string) {
  return normalize(value).replace(/\s+/g, "")
}

function licenseTokens(value: string) {
  const normalized = normalize(value)
  const tokens = new Set<string>([compact(value)])
  if (/exchange/.test(normalized) && /\b1\b/.test(normalized)) tokens.add("exchange1")
  if (/exchange/.test(normalized) && /\b2\b/.test(normalized)) tokens.add("exchange2")
  if (/\bbasic\b/.test(normalized)) tokens.add("basic")
  if (/\bstandard\b/.test(normalized)) tokens.add("standard")
  if (/\bpremium\b/.test(normalized)) tokens.add("premium")
  return [...tokens].filter(Boolean)
}

function licenseMatches(left: string, right: string) {
  const leftTokens = licenseTokens(left)
  const rightTokens = licenseTokens(right)
  return leftTokens.some((leftToken) =>
    rightTokens.some(
      (rightToken) =>
        leftToken === rightToken ||
        leftToken.includes(rightToken) ||
        rightToken.includes(leftToken),
    ),
  )
}

function friendlySkuName(skuPartNumber = "") {
  const names: Record<string, string> = {
    EXCHANGESTANDARD: "Exchange Online Plan 1",
    EXCHANGE_S_STANDARD: "Exchange Online Plan 1",
    EXCHANGE_S_ENTERPRISE: "Exchange Online Plan 2",
    O365_BUSINESS_ESSENTIALS: "Microsoft 365 Business Basic",
    O365_BUSINESS_PREMIUM: "Microsoft 365 Business Standard",
    SPB: "Microsoft 365 Business Premium",
    SPE_E3: "Microsoft 365 E3",
    SPE_E5: "Microsoft 365 E5",
    M365_COPILOT: "Microsoft 365 Copilot",
  }
  return names[skuPartNumber] || skuPartNumber
}

function aliasFromUpn(userPrincipalName: string) {
  return userPrincipalName.split("@")[0]?.replace(/[^A-Za-z0-9._-]/g, "") || ""
}

function generatedPassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%*-_+"
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function requirePortalSession() {
  const cookieStore = await cookies()
  return verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)
}

async function graphToken(tenantKey = "default") {
  const tenantId = graphProvisioningEnvValue(tenantKey, "TENANT_ID")
  const clientId = graphProvisioningEnvValue(tenantKey, "CLIENT_ID")
  const clientSecret = graphProvisioningEnvValue(tenantKey, "CLIENT_SECRET")

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      `Missing Microsoft Graph provisioning credentials for tenant key "${tenantKey}". Add ${tenantExpectedProvisioningEnv(tenantKey)}.`,
    )
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    },
  )
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Microsoft Graph auth failed.")
  }
  return String(data.access_token)
}

function graphTokenDetails(accessToken: string) {
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1] || "", "base64url").toString())
    return {
      appId: String(payload.appid || payload.azp || ""),
      tenantId: String(payload.tid || ""),
      roles: Array.isArray(payload.roles) ? payload.roles.map(String) : [],
    }
  } catch {
    return { appId: "", tenantId: "", roles: [] }
  }
}

function requireProvisioningGraphRoles(accessToken: string) {
  const details = graphTokenDetails(accessToken)
  const roles = new Set(details.roles)
  const hasUserWrite = roles.has("User.ReadWrite.All") || roles.has("Directory.ReadWrite.All")
  const hasLicenseWrite =
    roles.has("LicenseAssignment.ReadWrite.All") || roles.has("Directory.ReadWrite.All")

  if (!hasUserWrite || !hasLicenseWrite) {
    const roleList = details.roles.length ? details.roles.join(", ") : "no application roles"
    throw new Error(
      `The Microsoft app selected for user creation cannot manage users and licenses yet. It currently has ${roleList}. It needs User.ReadWrite.All, Directory.ReadWrite.All, and LicenseAssignment.ReadWrite.All application permissions with admin consent. Pax8 was not changed.`,
    )
  }
}

async function billingGraphToken() {
  const tenantId = envValue(
    "BILLING_MS_TENANT_ID",
    "BILLING_MICROSOFT_TENANT_ID",
    "MS_TENANT_ID",
    "MICROSOFT_TENANT_ID",
    "AZURE_TENANT_ID",
  )
  const clientId = envValue(
    "BILLING_MS_CLIENT_ID",
    "BILLING_MICROSOFT_CLIENT_ID",
    "MS_CLIENT_ID",
    "MICROSOFT_CLIENT_ID",
    "AZURE_CLIENT_ID",
  )
  const clientSecret = envValue(
    "BILLING_MS_CLIENT_SECRET",
    "BILLING_MICROSOFT_CLIENT_SECRET",
    "MS_CLIENT_SECRET",
    "MICROSOFT_CLIENT_SECRET",
    "AZURE_CLIENT_SECRET",
  )

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing GSV Outlook Graph credentials for setup email drafts.")
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    },
  )
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "GSV Outlook Graph auth failed.")
  }
  return String(data.access_token)
}

async function graphRequest<T>(
  accessToken: string,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${GRAPH_ROOT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(graphErrorMessage(response, data, `${init.method || "GET"} ${path}`, accessToken))
  }
  return data as T
}

function graphErrorMessage(
  response: Response,
  data: any,
  operation: string,
  accessToken?: string,
) {
  const code = data?.error?.code || data?.code || "unknown_error"
  const message =
    data?.error?.message ||
    data?.message ||
    response.statusText ||
    "Microsoft Graph request failed."
  const requestId =
    data?.error?.innerError?.["request-id"] ||
    data?.error?.innerError?.requestId ||
    data?.error?.innerError?.clientRequestId ||
    ""
  const details = accessToken ? graphTokenDetails(accessToken) : null
  const roles = details?.roles?.length ? details.roles.join(", ") : ""
  return [
    `Microsoft Graph ${operation} failed.`,
    `Status ${response.status}.`,
    `Code: ${code}.`,
    message,
    details?.tenantId ? `Token tenant: ${details.tenantId}.` : "",
    roles ? `Token app roles: ${roles}.` : "Token app roles: none.",
    response.status === 403
      ? "For user creation and license assignment, the app needs application permissions such as User.ReadWrite.All, Directory.ReadWrite.All, and LicenseAssignment.ReadWrite.All with admin consent."
      : "",
    requestId ? `Request ID: ${requestId}.` : "",
  ]
    .filter(Boolean)
    .join(" ")
}

async function graphOptionalUser(accessToken: string, userPrincipalName: string) {
  const response = await fetch(
    `${GRAPH_ROOT}/users/${encodeURIComponent(userPrincipalName)}?$select=id,displayName,userPrincipalName,assignedLicenses`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  )
  if (response.status === 404) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      graphErrorMessage(
        response,
        data,
        `GET /users/${userPrincipalName}`,
        accessToken,
      ),
    )
  }
  return data as GraphUser
}

function userHasSku(user: GraphUser | null, skuId?: string) {
  if (!user || !skuId) return false
  return (user.assignedLicenses || []).some(
    (license) => String(license.skuId || "").toLowerCase() === skuId.toLowerCase(),
  )
}

async function graphGetAll<T>(accessToken: string, path: string) {
  let url = `${GRAPH_ROOT}${path}`
  const rows: T[] = []
  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(graphErrorMessage(response, data, `GET ${path}`, accessToken))
    }
    rows.push(...(Array.isArray(data.value) ? data.value : []))
    url = data["@odata.nextLink"] || ""
  }
  return rows
}

function matchSku(skus: GraphSku[], requestedLicense: string) {
  if (!compact(requestedLicense)) return null
  const matches = skus
    .map((sku, index) => {
      const parts = [
        sku.skuPartNumber || "",
        friendlySkuName(sku.skuPartNumber || ""),
      ]
      const matched = parts.some((part) => licenseMatches(part, requestedLicense))
      const enabled = Number(sku.prepaidUnits?.enabled || 0)
      const consumed = Number(sku.consumedUnits || 0)
      return {
        sku,
        index,
        matched,
        available: enabled - consumed,
        enabled,
      }
    })
    .filter((entry) => entry.matched)

  matches.sort((a, b) => {
    const aHasSeat = a.available > 0
    const bHasSeat = b.available > 0
    if (aHasSeat !== bHasSeat) return bHasSeat ? 1 : -1
    if (a.available !== b.available) return b.available - a.available
    if (a.enabled !== b.enabled) return b.enabled - a.enabled
    return a.index - b.index
  })

  return matches[0]?.sku || null
}

async function graphLicenseAvailability(
  accessToken: string,
  requestedLicense: string,
) {
  const skus = await graphGetAll<GraphSku>(
    accessToken,
    "/subscribedSkus?$select=skuId,skuPartNumber,consumedUnits,prepaidUnits",
  )
  const sku = matchSku(skus, requestedLicense)
  if (!sku?.skuId) return null
  return {
    sku,
    available: Number(sku.prepaidUnits?.enabled || 0) - Number(sku.consumedUnits || 0),
  } satisfies LicenseAvailability
}

function licenseAvailabilityPayload(
  availability: LicenseAvailability | { sku?: GraphSku | null; available?: number } | null,
  fallbackSku?: GraphSku | null,
) {
  const sku = availability?.sku || fallbackSku || null
  const availabilityDetails = availability as
    | (LicenseAvailability & {
        pax8Quantity?: number
        pax8Available?: number
        effectiveAvailable?: number
      })
    | null
  const enabled = Number(sku?.prepaidUnits?.enabled || 0)
  const consumed = Number(sku?.consumedUnits || 0)
  const available = Number(availability?.available ?? (enabled - consumed))
  const pax8Quantity =
    "pax8Quantity" in (availabilityDetails || {}) ? Number(availabilityDetails?.pax8Quantity ?? 0) : null
  const pax8Available =
    "pax8Available" in (availabilityDetails || {}) ? Number(availabilityDetails?.pax8Available ?? 0) : null
  const effectiveAvailable =
    "effectiveAvailable" in (availabilityDetails || {})
      ? Number(availabilityDetails?.effectiveAvailable ?? available)
      : available
  return {
    skuId: sku?.skuId || "",
    skuPartNumber: sku?.skuPartNumber || "",
    name: friendlySkuName(sku?.skuPartNumber || "") || sku?.skuPartNumber || "",
    enabled,
    consumed,
    available,
    effectiveAvailable,
    pax8Quantity,
    pax8Available,
  }
}

async function waitForLicenseAvailability(
  accessToken: string,
  requestedLicense: string,
  minEnabled = 0,
) {
  const attempts = Math.max(1, Number(envValue("M365_LICENSE_WAIT_ATTEMPTS") || 2))
  const intervalMs = Math.max(1000, Number(envValue("M365_LICENSE_WAIT_INTERVAL_MS") || 5000))
  let latest: LicenseAvailability | null = null

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    latest = await graphLicenseAvailability(accessToken, requestedLicense)
    const enabled = Number(latest?.sku?.prepaidUnits?.enabled || 0)
    if (latest?.available && latest.available > 0 && (!minEnabled || enabled >= minEnabled)) {
      return {
        ...latest,
        attempts: attempt,
        waitedMs: attempt === 1 ? 0 : (attempt - 1) * intervalMs,
        timedOut: false,
      }
    }
    if (attempt < attempts) await sleep(intervalMs)
  }

  return {
    sku: latest?.sku || null,
    available: latest?.available ?? 0,
    attempts,
    waitedMs: Math.max(0, attempts - 1) * intervalMs,
    timedOut: true,
  }
}

async function pax8Token() {
  const clientId = envValue("PAX8_CLIENT_ID")
  const clientSecret = envValue("PAX8_CLIENT_SECRET")
  if (!clientId || !clientSecret) {
    throw new Error("Missing Pax8 API credentials.")
  }
  const response = await fetch(`${PAX8_API_ROOT}/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: "https://api.pax8.com",
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Pax8 authentication failed.")
  }
  return String(data.access_token)
}

async function pax8Request<T>(
  accessToken: string,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${PAX8_API_ROOT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || data.error || `Pax8 failed with ${response.status}.`)
  }
  return data as T
}

async function pax8GetAll<T>(accessToken: string, path: string) {
  const rows: T[] = []
  let page = 0
  const separator = path.includes("?") ? "&" : "?"
  while (page < 25) {
    const data = await pax8Request<Pax8Page<T>>(
      accessToken,
      `${path}${separator}page=${page}&size=200`,
    )
    rows.push(...(Array.isArray(data.content) ? data.content : []))
    page += 1
    if (page >= Number(data.page?.totalPages || 1)) break
  }
  return rows
}

function matchPax8Subscription(
  subscriptions: Pax8Subscription[],
  companyId: string,
  requestedLicense: string,
) {
  return (
    subscriptions
      .filter((subscription) => {
        if (String(subscription.companyId || "").toLowerCase() !== companyId.toLowerCase()) return false
        if (/cancel|delete/i.test(subscription.status || "")) return false
        return licenseMatches(subscription.productName || "", requestedLicense)
      })
      .sort((a, b) => String(a.productName || "").localeCompare(String(b.productName || "")))[0] || null
  )
}

async function postNinjaOnePrivateNote(ticketId: string, note: string) {
  if (!ticketId || !note) return null

  const noteForm = () => {
    const form = new FormData()
    form.append(
      "comment",
      new Blob([JSON.stringify({ public: false, body: note })], {
        type: "application/json",
      }),
    )
    return form
  }

  let userAuthError = ""
  let serviceAuthError = ""
  const tokenAttempts: Array<() => Promise<string>> = [
    async () => {
      try {
        return await ninjaOneUserAccessToken()
      } catch (error) {
        userAuthError = error instanceof Error ? error.message : "NinjaOne user authentication failed."
        throw error
      }
    },
    async () => {
      try {
        return await ninjaOneServiceAccessToken("monitoring management control")
      } catch (error) {
        serviceAuthError =
          error instanceof Error ? error.message : "NinjaOne service authentication failed."
        throw error
      }
    },
  ]

  for (const getAccessToken of tokenAttempts) {
    let accessToken = ""
    try {
      accessToken = await getAccessToken()
    } catch {
      continue
    }

    const response = await fetch(
      `${NINJAONE_API_ROOT}/v2/ticketing/ticket/${encodeURIComponent(ticketId)}/comment`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: noteForm(),
        cache: "no-store",
      },
    )
    const data = await response.json().catch(() => ({}))
    if (response.ok) return data

    const errorText = String(data.errorMessage || data.message || data.error || "")
    if (response.status === 401 || /invalid[_\s-]?token|not_authenticated/i.test(errorText)) {
      continue
    }
    if (/user_context_required/i.test(errorText)) {
      throw new Error(
        "NinjaOne ticket note requires a connected NinjaOne user. Reconnect NinjaOne OAuth, then retry the ticket note.",
      )
    }
    throw new Error(
      data.errorMessage || data.message || data.error || "NinjaOne ticket note failed.",
    )
  }

  const detail = userAuthError || serviceAuthError
  throw new Error(
    detail && /invalid[_\s-]?token|not_authenticated/i.test(detail)
      ? "NinjaOne authentication expired. Reconnect NinjaOne OAuth, then retry the ticket note."
      : detail || "NinjaOne ticket note failed because NinjaOne authentication is unavailable.",
  )
}

function completionNote(request: NonNullable<AutomationRequest["request"]>, password: string) {
  return [
    `Microsoft 365 user created for ${request.displayName}.`,
    `Username: ${request.userPrincipalName}`,
    `License: ${request.license}`,
    `Temporary password: ${password}`,
    "User must change password at first sign-in.",
  ].join("\n")
}

function recoveryCompletionNote(request: NonNullable<AutomationRequest["request"]>) {
  return [
    "Microsoft 365 automation recovery completed.",
    `User: ${request.displayName || request.userPrincipalName}`,
    `Username: ${request.userPrincipalName}`,
    `License verified: ${request.license}`,
    "The mailbox/user already existed, so no duplicate user was created.",
  ].join("\n")
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function firstNameFromRequest(request: NonNullable<AutomationRequest["request"]>) {
  return cleanText(request.firstName) || cleanText(request.displayName).split(/\s+/)[0] || "there"
}

function setupEmailHtml(
  request: NonNullable<AutomationRequest["request"]>,
  clientName: string,
  password: string,
) {
  const firstName = escapeHtml(firstNameFromRequest(request))
  const companyName = escapeHtml(clientName || "your")
  const userPrincipalName = escapeHtml(request.userPrincipalName || "")
  const safePassword = escapeHtml(password)
  return [
    `<p>Hi ${firstName},</p>`,
    `<p>Your ${companyName} email account has been created. Please use the information below to sign in and set up your email.</p>`,
    `<p><strong>Email address:</strong> ${userPrincipalName}<br><strong>Temporary password:</strong> ${safePassword}</p>`,
    `<p>Please sign in as soon as possible and update your password when prompted.</p>`,
    `<hr>`,
    `<h2>Important: Microsoft MFA Required</h2>`,
    `<p>For security, your account requires Microsoft multi-factor authentication, also known as MFA.</p>`,
    `<p>When you first sign in, Microsoft may ask you to set up an additional verification method, such as:</p>`,
    `<ul><li>Microsoft Authenticator app</li><li>Text message verification</li><li>Phone call verification</li></ul>`,
    `<p>Please follow the on-screen prompts to complete MFA setup. This extra step helps protect your email account from unauthorized access.</p>`,
    `<hr>`,
    `<h2>Recommended Access: Webmail</h2>`,
    `<p>You can access your email from any browser by going to:</p>`,
    `<p><a href="https://outlook.office.com/">https://outlook.office.com</a></p>`,
    `<p>Sign in using your ${companyName} email address and the temporary password listed above.</p>`,
    `<hr>`,
    `<h2>Recommended Mobile Setup: iPhone or iPad</h2>`,
    `<p>The recommended mobile app is Microsoft Outlook.</p>`,
    `<ol><li>Download Microsoft Outlook from the App Store.</li><li>Open Outlook.</li><li>Tap Add Account.</li><li>Enter your ${companyName} email address.</li><li>Sign in with your temporary password.</li><li>Complete the Microsoft MFA/security prompts.</li><li>Allow notifications if you want to receive email alerts.</li></ol>`,
    `<hr>`,
    `<h2>Recommended Mobile Setup: Android</h2>`,
    `<p>The recommended mobile app is Microsoft Outlook.</p>`,
    `<ol><li>Download Microsoft Outlook from the Google Play Store.</li><li>Open Outlook.</li><li>Tap Add Account.</li><li>Enter your ${companyName} email address.</li><li>Sign in with your temporary password.</li><li>Complete the Microsoft MFA/security prompts.</li><li>Allow notifications if you want to receive email alerts.</li></ol>`,
    `<hr>`,
    `<h2>Password and Security Notes</h2>`,
    `<p>Please do not share your password with anyone.</p>`,
    `<p>If you are prompted to create a new password, choose something secure that you do not use for other accounts.</p>`,
    `<p>If you have trouble signing in or setting up your email, please reply to this email or contact us for support.</p>`,
    `<p>Thank you,</p>`,
  ].join("")
}

async function createSetupEmailDraft(
  request: NonNullable<AutomationRequest["request"]>,
  clientName: string,
  password: string,
) {
  const setupEmail = cleanText(request.setupEmail || request.sourceEmail)
  if (!setupEmail || !setupEmail.includes("@")) return null
  const ccAddresses = [
    request.sourceEmail && request.sourceEmail !== setupEmail
      ? {
          address: request.sourceEmail,
          name: request.requester || request.sourceEmail,
        }
      : null,
    request.userPrincipalName && request.userPrincipalName !== setupEmail
      ? {
          address: request.userPrincipalName,
          name: cleanText(request.displayName) || request.userPrincipalName,
        }
      : null,
  ].filter((recipient): recipient is { address: string; name: string } =>
    Boolean(recipient?.address && recipient.address.includes("@")),
  )
  const uniqueCcRecipients = Array.from(
    new Map(ccAddresses.map((recipient) => [recipient.address.toLowerCase(), recipient])).values(),
  )
  const fromMailbox =
    envValue(
      "M365_USER_INSTRUCTIONS_SEND_FROM",
      "SUPPORT_SEND_FROM",
      "BILLING_SUPPORT_SEND_FROM",
      "BILLING_SEND_FROM",
      "MS_SEND_FROM",
      "MICROSOFT_SEND_FROM",
    ) || "cory@gsvisions.com"
  const accessToken = await billingGraphToken()
  const response = await fetch(`${GRAPH_ROOT}/users/${encodeURIComponent(fromMailbox)}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: `New ${clientName || "Microsoft 365"} Email`,
      body: {
        contentType: "HTML",
        content: setupEmailHtml(request, clientName, password),
      },
      toRecipients: [
        {
          emailAddress: {
            address: setupEmail,
            name: cleanText(request.displayName) || setupEmail,
          },
        },
      ],
      ccRecipients: uniqueCcRecipients.map((recipient) => ({
        emailAddress: {
          address: recipient.address,
          name: recipient.name,
        },
      })),
      bccRecipients: [{ emailAddress: { address: "cory@gsvisions.com", name: "Cory" } }],
      replyTo: [{ emailAddress: { address: fromMailbox, name: "Golden State Visions" } }],
    }),
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error?.message || `Setup email draft failed with ${response.status}.`)
  }
  return {
    id: data.id || "",
    webLink: data.webLink || "",
    fromMailbox,
    to: setupEmail,
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requirePortalSession())) {
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as AutomationRequest
    const mode = body.mode === "run" ? "run" : "preview"
    const automationRequest = body.request || {}
    const client = body.client || {}
    const tenantKey = resolvedTenantKey(client, automationRequest)
    const pax8CompanyId = cleanText(client.pax8CompanyId || "")
    const userPrincipalName = cleanText(automationRequest.userPrincipalName).toLowerCase()
    const displayName = cleanText(automationRequest.displayName)
    const license = cleanText(automationRequest.license)
    const pax8AlreadyIncreased = automationRequest.pax8AlreadyIncreased === true
    const savedPax8SubscriptionId = cleanText(automationRequest.pax8SubscriptionId || "")

    if (!displayName) throw new Error("Missing new user's display name.")
    if (!userPrincipalName || !userPrincipalName.includes("@")) {
      throw new Error("Missing valid Microsoft 365 username.")
    }
    if (!license) throw new Error("Missing requested Microsoft 365 license.")

    const graphAccessToken = await graphToken(tenantKey)
    requireProvisioningGraphRoles(graphAccessToken)
    const [skus, existingUser] = await Promise.all([
      graphGetAll<GraphSku>(
        graphAccessToken,
        "/subscribedSkus?$select=skuId,skuPartNumber,consumedUnits,prepaidUnits",
      ),
      graphOptionalUser(graphAccessToken, userPrincipalName),
    ])
    const sku = matchSku(skus, license)
    if (!sku?.skuId) {
      throw new Error(`Could not match "${license}" to a Microsoft 365 SKU in ${client.name || tenantKey}.`)
    }

    const graphAvailableLicenses =
      Number(sku.prepaidUnits?.enabled || 0) - Number(sku.consumedUnits || 0)
    const consumedLicenses = Number(sku.consumedUnits || 0)
    const enabledLicenses = Number(sku.prepaidUnits?.enabled || 0)
    let pax8Match: Pax8Subscription | null = null
    if (pax8CompanyId) {
      const pax8AccessToken = await pax8Token()
      const subscriptions = await pax8GetAll<Pax8Subscription>(
        pax8AccessToken,
        "/v1/subscriptions",
      )
      pax8Match = matchPax8Subscription(subscriptions, pax8CompanyId, license)
    }

    const pax8Quantity = Number(pax8Match?.quantity || 0)
    const pax8BackedLicense = Boolean(pax8Match?.id)
    const pax8AvailableLicenses = pax8BackedLicense
      ? Math.max(0, pax8Quantity - consumedLicenses)
      : 0
    const effectiveAvailableLicenses = pax8BackedLicense
      ? pax8AvailableLicenses
      : graphAvailableLicenses
    const pax8AlreadyHandled = pax8AlreadyIncreased
    const needsPax8Increase =
      effectiveAvailableLicenses < 1 && pax8BackedLicense && !pax8AlreadyHandled
    const waitingForPreviousPax8 =
      effectiveAvailableLicenses < 1 && pax8BackedLicense && pax8AlreadyHandled
    const licenseAvailability = licenseAvailabilityPayload({
      sku,
      available: graphAvailableLicenses,
      effectiveAvailable: effectiveAvailableLicenses,
      pax8Available: pax8AvailableLicenses,
      pax8Quantity: pax8BackedLicense ? pax8Quantity : undefined,
    })
    const preview = {
      tenantKey,
      userExists: Boolean(existingUser),
      userPrincipalName,
      setupEmail: automationRequest.setupEmail,
      sourceEmail: automationRequest.sourceEmail,
      ninjaTicketId: automationRequest.ninjaTicketId,
      sku: licenseAvailability,
      licenseAvailability,
      pax8BackedLicense,
      pax8AlreadyHandled,
      needsPax8Increase,
      waitingForPreviousPax8,
      checkedAt: new Date().toISOString(),
      pax8: pax8Match
        ? {
            subscriptionId: pax8Match.id,
            productName: pax8Match.productName,
            currentQuantity: pax8Quantity,
            nextQuantity: pax8Quantity + (needsPax8Increase ? 1 : 0),
            availableQuantity: pax8AvailableLicenses,
          }
        : null,
      steps: [
        existingUser ? "Stop: Microsoft 365 user already exists." : "Create Microsoft 365 user.",
        needsPax8Increase
          ? pax8Match
            ? "Increase Pax8 subscription quantity by 1, then wait for Microsoft 365 to show the new seat."
            : "Pax8 license is needed, but no matching Pax8 subscription was found."
          : waitingForPreviousPax8
            ? "Wait for Microsoft 365 to show the license Pax8 already added."
          : pax8BackedLicense && effectiveAvailableLicenses > 0
            ? "Use the matching active Pax8 subscription capacity for Microsoft 365 license assignment."
            : "Use existing available Microsoft 365 license.",
        "Assign Microsoft 365 license.",
        automationRequest.setupEmail || automationRequest.sourceEmail
          ? "Create setup-instructions email draft for the contact address."
          : "No setup-instructions email draft will be created.",
        automationRequest.ninjaTicketId ? "Post completion note to NinjaOne ticket." : "No NinjaOne ticket note will be posted.",
      ],
    }

    if (mode === "preview") {
      return NextResponse.json({ source: "GSV Portal", preview })
    }

    if (existingUser && userHasSku(existingUser, sku.skuId)) {
      const note = recoveryCompletionNote({
        ...automationRequest,
        displayName: existingUser.displayName || displayName,
        userPrincipalName,
        license: friendlySkuName(sku.skuPartNumber || "") || license,
      })
      let ninjaTicketUpdated = false
      let ninjaTicketError = ""
      if (automationRequest.ninjaTicketId) {
        try {
          await postNinjaOnePrivateNote(automationRequest.ninjaTicketId, note)
          ninjaTicketUpdated = true
        } catch (error) {
          ninjaTicketError =
            error instanceof Error ? error.message : "NinjaOne ticket note failed."
        }
      }
      return NextResponse.json({
        source: "GSV Portal",
        result: {
          status: "already_complete",
          userAlreadyExisted: true,
          userPrincipalName,
          displayName: existingUser.displayName || displayName,
          license: friendlySkuName(sku.skuPartNumber || "") || license,
          licenseAvailability,
          temporaryPassword: "",
          pax8Changed: false,
          licenseWait: null,
          pax8Quantity: pax8Match ? pax8Quantity : null,
          setupEmailDraft: null,
          setupEmailError: "",
          ninjaTicketUpdated,
          ninjaTicketError,
          note,
        },
      })
    }
    if (existingUser) {
      throw new Error(`Microsoft 365 user ${userPrincipalName} already exists.`)
    }
    if (effectiveAvailableLicenses < 1 && !pax8BackedLicense && !pax8Match?.id && !pax8AlreadyHandled) {
      throw new Error(`No matching Pax8 subscription found for "${license}".`)
    }

    const pax8Changed = Boolean(needsPax8Increase && pax8Match?.id)
    let assignableSku = sku
    let latestLicenseAvailabilityForResult = licenseAvailabilityPayload({
      sku,
      available: graphAvailableLicenses,
      effectiveAvailable: effectiveAvailableLicenses,
      pax8Available: pax8AvailableLicenses,
      pax8Quantity: pax8BackedLicense ? pax8Quantity : undefined,
    })
    let licenseWait:
      | {
          attempts: number
          waitedMs: number
          timedOut: boolean
          available: number
        }
      | null = null

    if (effectiveAvailableLicenses < 1 && pax8BackedLicense) {
      if (pax8Changed && pax8Match?.id) {
        const pax8AccessToken = await pax8Token()
        await pax8Request(
          pax8AccessToken,
          `/v1/subscriptions/${encodeURIComponent(pax8Match.id || "")}`,
          {
            method: "PUT",
            body: JSON.stringify({
              quantity: Number(pax8Match.quantity || 0) + 1,
            }),
          },
        )
      }

      const minEnabled = pax8Changed ? enabledLicenses + 1 : 0
      const availability = await waitForLicenseAvailability(graphAccessToken, license, minEnabled)
      const expectedPax8Quantity = pax8Match
        ? Number(pax8Match.quantity || 0) + (pax8Changed ? 1 : 0)
        : 0
      const latestConsumed = Number(availability.sku?.consumedUnits || consumedLicenses)
      const latestPax8Available = Math.max(0, expectedPax8Quantity - latestConsumed)
      latestLicenseAvailabilityForResult = licenseAvailabilityPayload(
        {
          ...availability,
          effectiveAvailable: latestPax8Available,
          pax8Available: latestPax8Available,
          pax8Quantity: expectedPax8Quantity,
        },
        availability.sku || sku,
      )
      licenseWait = {
        attempts: availability.attempts,
        waitedMs: availability.waitedMs,
        timedOut: availability.timedOut,
        available: latestPax8Available,
      }
      if (!availability.sku?.skuId || latestPax8Available < 1) {
        return NextResponse.json({
          source: "GSV Portal",
          result: {
            status: "waiting_for_microsoft_license",
            userPrincipalName,
            displayName,
            license: friendlySkuName(sku.skuPartNumber || "") || license,
            pax8Changed,
            pax8AlreadyIncreased: true,
            pax8SubscriptionId:
              pax8Match?.id || savedPax8SubscriptionId || "",
            pax8Quantity: pax8Match
              ? Number(pax8Match.quantity || 0) + (pax8Changed ? 1 : 0)
              : null,
            licenseWait,
            licenseAvailability: latestLicenseAvailabilityForResult,
            lastCheckedAt: new Date().toISOString(),
            pax8AlreadyHandled: true,
            retryAfterMs: Math.max(
              10000,
              Number(envValue("M365_AUTO_RETRY_AFTER_MS") || 30000),
            ),
            message:
              "Microsoft 365 is still making the license available. The portal will keep checking automatically and will not update Pax8 again.",
          },
        })
      }
      assignableSku = availability.sku
    }

    const password = cleanText(automationRequest.temporaryPassword) || generatedPassword()
    const createdUser = await graphRequest<{ id?: string }>(graphAccessToken, "/users", {
      method: "POST",
      body: JSON.stringify({
        accountEnabled: true,
        displayName,
        givenName: cleanText(automationRequest.firstName) || undefined,
        surname: cleanText(automationRequest.lastName) || undefined,
        mailNickname: aliasFromUpn(userPrincipalName),
        userPrincipalName,
        usageLocation: "US",
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password,
        },
      }),
    })

    await graphRequest(
      graphAccessToken,
      `/users/${encodeURIComponent(createdUser.id || userPrincipalName)}/assignLicense`,
      {
        method: "POST",
        body: JSON.stringify({
          addLicenses: [{ skuId: assignableSku.skuId, disabledPlans: [] }],
          removeLicenses: [],
        }),
      },
    )

    let setupEmailDraft: Awaited<ReturnType<typeof createSetupEmailDraft>> = null
    let setupEmailError = ""
    try {
      setupEmailDraft = await createSetupEmailDraft(
        automationRequest,
        client.name || tenantKey,
        password,
      )
    } catch (error) {
      setupEmailError =
        error instanceof Error
          ? error.message
          : "Setup email draft could not be created."
    }

    const note = [
      completionNote(automationRequest, password),
      setupEmailDraft
        ? `Setup instructions email draft created for ${setupEmailDraft.to} from ${setupEmailDraft.fromMailbox}.`
        : setupEmailError
          ? `Setup instructions email draft failed: ${setupEmailError}`
          : "No setup instructions contact email was provided.",
    ].join("\n")
    let ninjaTicketUpdated = false
    let ninjaTicketError = ""
    if (automationRequest.ninjaTicketId) {
      try {
        await postNinjaOnePrivateNote(automationRequest.ninjaTicketId, note)
        ninjaTicketUpdated = true
      } catch (error) {
        ninjaTicketError =
          error instanceof Error ? error.message : "NinjaOne ticket note failed."
      }
    }

    return NextResponse.json({
      source: "GSV Portal",
      result: {
        userPrincipalName,
        displayName,
        license: friendlySkuName(assignableSku.skuPartNumber || "") || license,
        licenseAvailability: latestLicenseAvailabilityForResult,
        temporaryPassword: password,
        pax8Changed,
        licenseWait,
        pax8Quantity: pax8Match
          ? Number(pax8Match.quantity || 0) + (pax8Changed ? 1 : 0)
          : null,
        setupEmailDraft,
        setupEmailError,
        ninjaTicketUpdated,
        ninjaTicketError,
        note,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Microsoft 365 user automation failed.",
      },
      { status: 500 },
    )
  }
}
