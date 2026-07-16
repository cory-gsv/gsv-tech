import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBillingSession } from "../../billing/billingAuth"

const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

type NinjaOneOrganization = {
  id?: number
  name?: string
  description?: string
  nodeApprovalMode?: string
}

function envValue(key: string) {
  return process.env[key]?.trim() || ""
}

async function ninjaOneToken() {
  const clientId =
    envValue("NINJAONE_SERVICE_CLIENT_ID") || envValue("NINJAONE_CLIENT_ID")
  const clientSecret =
    envValue("NINJAONE_SERVICE_CLIENT_SECRET") ||
    envValue("NINJAONE_CLIENT_SECRET")

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
      scope: "monitoring management",
    }),
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "NinjaOne authentication failed.",
    )
  }

  return String(data.access_token)
}

async function ninjaOneGet<T>(accessToken: string, path: string) {
  const response = await fetch(`${NINJAONE_API_ROOT}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.errorMessage ||
        data.message ||
        data.error ||
        `NinjaOne request failed with ${response.status}.`,
    )
  }

  return data as T
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAuthed = await verifyBillingSession(
      cookieStore.get("gsv_billing_session")?.value,
    )

    if (!isAuthed) {
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const accessToken = await ninjaOneToken()
    const organizations = await ninjaOneGet<NinjaOneOrganization[]>(
      accessToken,
      "/v2/organizations",
    )

    return NextResponse.json({
      source: "NinjaOne",
      organizations: (Array.isArray(organizations) ? organizations : [])
        .map((organization) => ({
          id: Number(organization.id || 0),
          name: organization.name || `Organization ${organization.id || ""}`,
          description: organization.description || "",
          nodeApprovalMode: organization.nodeApprovalMode || "",
        }))
        .filter((organization) => organization.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "NinjaOne organization lookup failed.",
      },
      { status: 500 },
    )
  }
}
