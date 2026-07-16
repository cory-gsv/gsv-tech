import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBillingSession } from "../../billing/billingAuth"
import { ninjaOneServiceAccessToken, ninjaOneUserAccessToken } from "../ninjaoneAuth"

const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

type NinjaOneContact = {
  id?: number
  organizationId?: number
  uid?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  jobTitle?: string
}

type ContactRequest = {
  organizationId?: number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  jobTitle?: string
}

async function requirePortalSession() {
  const cookieStore = await cookies()
  return verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)
}

async function accessToken() {
  try {
    return await ninjaOneServiceAccessToken("monitoring management control")
  } catch {
    return ninjaOneUserAccessToken()
  }
}

async function ninjaOneRequest<T>(
  token: string,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${NINJAONE_API_ROOT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (data.error === "not_authenticated") {
      throw new Error(
        "NinjaOne needs to be reconnected. Open /api/ninjaone-oauth-login, authorize GSV Portal, save the new refresh token, then restart the local server.",
      )
    }
    throw new Error(
      data.errorMessage ||
        data.message ||
        data.error ||
        `NinjaOne request failed with ${response.status}.`,
    )
  }

  return data as T
}

function normalizeContact(contact: NinjaOneContact) {
  return {
    id: Number(contact.id || 0),
    organizationId: Number(contact.organizationId || 0),
    uid: contact.uid || "",
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    displayName:
      `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
      contact.email ||
      `Contact ${contact.id || ""}`,
    email: contact.email || "",
    phone: contact.phone || "",
    jobTitle: contact.jobTitle || "",
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await requirePortalSession())) {
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const organizationId = Number(
      new URL(request.url).searchParams.get("organizationId") || 0,
    )
    const token = await accessToken()
    const contacts = await ninjaOneRequest<NinjaOneContact[]>(token, "/v2/contacts")
    const normalized = (Array.isArray(contacts) ? contacts : [])
      .map(normalizeContact)
      .filter((contact) => contact.id && contact.uid)
      .filter((contact) => !organizationId || contact.organizationId === organizationId)
      .sort((a, b) => a.displayName.localeCompare(b.displayName))

    return NextResponse.json({ source: "NinjaOne", contacts: normalized })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "NinjaOne contact lookup failed.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requirePortalSession())) {
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as ContactRequest
    const organizationId = Number(body.organizationId || 0)
    const firstName = String(body.firstName || "").trim()
    const lastName = String(body.lastName || "").trim()
    const email = String(body.email || "").trim()

    if (!organizationId) throw new Error("Select a NinjaOne organization first.")
    if (!firstName || !lastName) {
      throw new Error("Contact first and last name are required.")
    }
    if (!email) throw new Error("Contact email is required.")

    const token = await accessToken()
    const created = await ninjaOneRequest<NinjaOneContact>(token, "/v2/contacts", {
      method: "POST",
      body: JSON.stringify({
        organizationId,
        firstName,
        lastName,
        email,
        phone: String(body.phone || "").trim(),
        jobTitle: String(body.jobTitle || "").trim(),
      }),
    })

    return NextResponse.json({
      source: "NinjaOne",
      contact: normalizeContact(created),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "NinjaOne contact creation failed.",
      },
      { status: 500 },
    )
  }
}
