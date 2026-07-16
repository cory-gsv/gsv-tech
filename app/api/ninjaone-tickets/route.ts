import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBillingSession } from "../../billing/billingAuth"
import {
  ninjaOneEnvValue,
  ninjaOneServiceAccessToken,
  ninjaOneUserAccessToken,
} from "../ninjaoneAuth"

const NINJAONE_API_ROOT =
  process.env.NINJAONE_API_ROOT?.trim() || "https://us2.ninjarmm.com"

type NinjaOneTicketForm = {
  id?: number
  name?: string
  active?: boolean
}

type PortalTicketRequest = {
  ticketId?: string
  clientId?: number
  requesterUid?: string
  requester?: string
  subject?: string
  description?: string
  internalNotes?: string
  category?: string
  priority?: string
  type?: string
  form?: string
  ticketFormId?: number
  version?: number
  status?: string
  statusId?: number | string
  comment?: string
  publicComment?: boolean
  commentOnly?: boolean
  severity?: string
  tags?: string[]
  ccEmails?: string[]
  followupTime?: number | null
}

type NinjaOneTicket = {
  id?: number
  clientId?: number
  requesterUid?: string
  subject?: string
  version?: number
  ticketFormId?: number
  deleted?: boolean
  missing?: boolean
  source?: string
  type?: string
  status?: {
    name?: string
    displayName?: string
    statusId?: number
  } | string
  priority?: string
  severity?: string
  tags?: string[]
  ccList?: {
    uids?: string[]
    emails?: string[]
  }
  followupTime?: number
  assignedAppUserId?: number
  additionalAssignedTechnicianIds?: number[]
  updateTime?: number
  createTime?: number
}

type NinjaOneTicketLogEntry = {
  type?: string
  body?: string
  htmlBody?: string
  fullEmailBody?: string
  publicEntry?: boolean
  createTime?: number
}

type NinjaOneContact = {
  uid?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  organizationId?: number
}

type NinjaOneBoard = {
  id?: number
  name?: string
  ticketCount?: number
}

type NinjaOneBoardRun = {
  data?: Array<Record<string, unknown>>
  metadata?: {
    lastCursorId?: number
  }
}

async function requirePortalSession() {
  const cookieStore = await cookies()
  return verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)
}

async function ninjaOneToken() {
  return ninjaOneUserAccessToken()
}

async function ninjaOneReadToken() {
  try {
    return await ninjaOneServiceAccessToken("monitoring management control")
  } catch {
    return ninjaOneUserAccessToken()
  }
}

async function ninjaOneRequest<T>(
  accessToken: string,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${NINJAONE_API_ROOT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
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
    if (data.error === "user_context_required") {
      throw new Error(
        "NinjaOne ticket creation requires a user-authorized OAuth token. Connect a NinjaOne user or set NINJAONE_REFRESH_TOKEN.",
      )
    }
    if (data.error === "insufficient_privileges") {
      throw new Error(
        "NinjaOne rejected the ticket create request for insufficient privileges. The connected NinjaOne user or API app needs ticketing/create-ticket permission.",
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

async function ninjaOneOptionalTicket(accessToken: string, ticketId: string) {
  const response = await fetch(
    `${NINJAONE_API_ROOT}/v2/ticketing/ticket/${encodeURIComponent(ticketId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  )
  const data = await response.json().catch(() => ({}))

  const errorText = String(
    data.errorMessage || data.message || data.error || "",
  )
  if (
    response.status === 404 ||
    response.status === 410 ||
    /404|not found|missing|deleted|does not exist/i.test(errorText)
  ) {
    return {
      id: ticketId,
      deleted: true,
      missing: true,
      lookupMessage: errorText,
    }
  }
  if (!response.ok) {
    throw new Error(
      errorText || `NinjaOne ticket lookup failed with ${response.status}.`,
    )
  }

  const ticket = data as NinjaOneTicket
  const status =
    typeof ticket.status === "string"
      ? { name: ticket.status, displayName: ticket.status }
      : ticket.status
  const logEntries = await ninjaOneRequest<NinjaOneTicketLogEntry[]>(
    accessToken,
    `/v2/ticketing/ticket/${encodeURIComponent(ticketId)}/log-entry`,
  ).catch(() => [])
  const descriptionEntry =
    logEntries.find((entry) => entry.type === "DESCRIPTION") || logEntries[0]
  const description =
    descriptionEntry?.fullEmailBody ||
    descriptionEntry?.body ||
    descriptionEntry?.htmlBody ||
    ""
  return {
    id: String(ticket.id || ticketId),
    clientId: ticket.clientId,
    requesterUid: ticket.requesterUid || "",
    subject: ticket.subject || "",
    description,
    version: ticket.version || 0,
    ticketFormId: ticket.ticketFormId || 0,
    source: ticket.source || "",
    type: ticket.type || "",
    statusName: status?.name || "",
    statusDisplayName: status?.displayName || "",
    statusId: status?.statusId,
    priority: ticket.priority || "",
    severity: ticket.severity || "",
    tags: ticket.tags || [],
    ccEmails: ticket.ccList?.emails || [],
    followupTime: ticket.followupTime || null,
    assignedAppUserId: ticket.assignedAppUserId || null,
    additionalAssignedTechnicianIds: ticket.additionalAssignedTechnicianIds || [],
    deleted: Boolean(ticket.deleted || ticket.missing),
    missing: Boolean(ticket.missing),
    updateTime: ticket.updateTime || 0,
    createTime: ticket.createTime || 0,
  }
}

function primitive(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>
    return primitive(record.value) || primitive(record.name) || primitive(record.displayName) || primitive(record.label)
  }
  return ""
}

function boardTicketId(row: Record<string, unknown>) {
  const candidates = [
    row.id,
    row.ticketId,
    row.ticketNumber,
    row.number,
    row["ID"],
    row["Ticket ID"],
  ]
  for (const candidate of candidates) {
    const value = primitive(candidate).replace(/^#/, "").trim()
    if (/^\d+$/.test(value)) return value
  }
  return ""
}

async function ninjaOneBoardTickets(accessToken: string) {
  const boards = await ninjaOneRequest<NinjaOneBoard[]>(
    accessToken,
    "/v2/ticketing/trigger/boards",
  )
  const candidateBoards = boards
    .filter((board) => board.id)
    .sort((a, b) => {
      const aName = String(a.name || "").toLowerCase()
      const bName = String(b.name || "").toLowerCase()
      const score = (name: string) =>
        /all/.test(name) ? 0 : /open|unassigned|my|deleted|pending/.test(name) ? 1 : 2
      return score(aName) - score(bName)
    })
    .slice(0, 8)

  const ticketIds = new Set<string>()
  for (const board of candidateBoards) {
    const data = await ninjaOneRequest<NinjaOneBoardRun>(
      accessToken,
      `/v2/ticketing/trigger/board/${encodeURIComponent(String(board.id))}/run`,
      {
        method: "POST",
        body: JSON.stringify({
          pageSize: 100,
          sortBy: [{ field: "id", direction: "DESC" }],
        }),
      },
    )
    for (const row of data.data || []) {
      const id = boardTicketId(row)
      if (id) ticketIds.add(id)
    }
  }

  const [tickets, contacts] = await Promise.all([
    Promise.all(
      Array.from(ticketIds)
        .slice(0, 100)
        .map((ticketId) => ninjaOneOptionalTicket(accessToken, ticketId)),
    ),
    ninjaOneRequest<NinjaOneContact[]>(accessToken, "/v2/contacts").catch(() => []),
  ])
  const contactsByUid = new Map(
    contacts
      .filter((contact) => contact.uid)
      .map((contact) => [String(contact.uid), contact]),
  )
  return tickets.map((ticket) => {
    const contact = contactsByUid.get(String(ticket.requesterUid || ""))
    if (!contact) return ticket
    return {
      ...ticket,
      requesterFirstName: contact.firstName || "",
      requesterLastName: contact.lastName || "",
      requesterEmail: contact.email || "",
      requesterPhone: contact.phone || "",
      requesterName:
        `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
        contact.email ||
        "",
    }
  })
}

function priorityToNinjaOne(priority = "normal") {
  const normalized = String(priority || "").toLowerCase()
  return {
    urgent: "HIGH",
    high: "HIGH",
    normal: "MEDIUM",
    low: "LOW",
    medium: "MEDIUM",
    none: "NONE",
  }[normalized] || "MEDIUM"
}

function severityToNinjaOne(priority = "normal") {
  return priority === "urgent" ? "MAJOR" : "NONE"
}

function requestedSeverityToNinjaOne(severity = "none", priority = "normal") {
  const normalized = String(severity || "").toLowerCase()
  return (
    {
      critical: "CRITICAL",
      major: "MAJOR",
      moderate: "MODERATE",
      minor: "MINOR",
      none: "NONE",
    }[normalized] || severityToNinjaOne(priority)
  )
}

function typeToNinjaOne(type = "service_request") {
  const normalized = String(type || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
  return (
    {
      service_request: "SERVICE_REQUEST",
      problem: "PROBLEM",
      incident: "INCIDENT",
      question: "QUESTION",
      task: "TASK",
    }[normalized] || "SERVICE_REQUEST"
  )
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : []
}

function portalStatusPattern(status = "") {
  if (status === "resolved") return /resolved|closed|completed|complete/i
  if (status === "waiting") return /waiting|pending|hold/i
  if (status === "in_progress") return /progress|assigned|working/i
  return /new|open/i
}

async function ninjaOneStatusId(
  accessToken: string,
  status = "new",
  fallback?: string | number,
) {
  if (fallback) return String(fallback)
  const statuses = await ninjaOneRequest<Array<Record<string, unknown>>>(
    accessToken,
    "/v2/ticketing/statuses",
  )
  const pattern = portalStatusPattern(status)
  const match = statuses.find((item) => {
    const text = `${item.name || ""} ${item.displayName || ""}`
    return pattern.test(text)
  })
  return String(match?.statusId || match?.id || ninjaOneEnvValue("NINJAONE_TICKET_STATUS") || "1000")
}

async function defaultTicketFormId(accessToken: string) {
  const configured = Number(ninjaOneEnvValue("NINJAONE_TICKET_FORM_ID") || 0)
  if (configured) return configured

  const forms = await ninjaOneRequest<NinjaOneTicketForm[]>(
    accessToken,
    "/v2/ticketing/ticket-form",
  )
  const activeForm = forms.find((form) => form.active !== false && form.id)
  if (!activeForm?.id) {
    throw new Error(
      "No active NinjaOne ticket form found. Set NINJAONE_TICKET_FORM_ID.",
    )
  }
  return activeForm.id
}

function ticketBody(ticket: PortalTicketRequest) {
  return [
    ticket.description,
    ticket.requester ? `Requester: ${ticket.requester}` : "",
    ticket.category ? `Category: ${ticket.category}` : "",
    ticket.internalNotes ? `Internal notes: ${ticket.internalNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
}

export async function GET(request: NextRequest) {
  try {
    if (!(await requirePortalSession())) {
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const accessToken = await ninjaOneReadToken()
    const ticketIds = new URL(request.url).searchParams
      .get("ids")
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean)

    if (ticketIds?.length) {
      const tickets = await Promise.all(
        ticketIds.slice(0, 50).map((ticketId) =>
          ninjaOneOptionalTicket(accessToken, ticketId),
        ),
      )
      return NextResponse.json({ source: "NinjaOne", tickets })
    }

    if (new URL(request.url).searchParams.get("import") === "1") {
      const tickets = await ninjaOneBoardTickets(accessToken)
      return NextResponse.json({ source: "NinjaOne", tickets })
    }

    const [forms, statuses] = await Promise.all([
      ninjaOneRequest<NinjaOneTicketForm[]>(
        accessToken,
        "/v2/ticketing/ticket-form",
      ),
      ninjaOneRequest(accessToken, "/v2/ticketing/statuses"),
    ])

    return NextResponse.json({ forms, statuses })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "NinjaOne ticket lookup failed.",
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

    const ticket = (await request.json().catch(() => ({}))) as PortalTicketRequest
    const clientId = Number(ticket.clientId || 0)
    const subject = String(ticket.subject || "").trim().slice(0, 200)

    if (!clientId) {
      throw new Error("Missing NinjaOne client/organization ID.")
    }
    if (!subject) {
      throw new Error("Ticket subject is required.")
    }

    const accessToken = await ninjaOneToken()
    const ticketFormId =
      Number(ticket.ticketFormId || 0) || (await defaultTicketFormId(accessToken))
    const status = String(
      ticket.status || ninjaOneEnvValue("NINJAONE_TICKET_STATUS") || "1000",
    )

    const created = await ninjaOneRequest<Record<string, unknown>>(
      accessToken,
      "/v2/ticketing/ticket",
      {
        method: "POST",
        body: JSON.stringify({
          clientId,
          ticketFormId,
          subject,
          status,
          type: typeToNinjaOne(ticket.type),
          requesterUid: ticket.requesterUid || undefined,
          priority: priorityToNinjaOne(ticket.priority),
          severity: severityToNinjaOne(ticket.priority),
          description: {
            public: true,
            body: ticketBody(ticket) || subject,
          },
        }),
      },
    )

    return NextResponse.json({
      source: "NinjaOne",
      ticket: created,
      ticketId: created.id,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "NinjaOne ticket creation failed.",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requirePortalSession())) {
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const ticket = (await request.json().catch(() => ({}))) as PortalTicketRequest
    const ticketId = String(ticket.ticketId || "").trim()
    if (!ticketId) throw new Error("Missing NinjaOne ticket ID.")

    const accessToken = await ninjaOneToken()
    const current = await ninjaOneRequest<NinjaOneTicket>(
      accessToken,
      `/v2/ticketing/ticket/${encodeURIComponent(ticketId)}`,
    )
    const currentStatus =
      typeof current.status === "string"
        ? { name: current.status, displayName: current.status }
        : current.status
    const commentBody = String(ticket.comment || "").trim()
    let comment: unknown = null
    if (commentBody) {
      const form = new FormData()
      form.append(
        "comment",
        new Blob(
          [
            JSON.stringify({
              public: ticket.publicComment !== false,
              body: commentBody,
            }),
          ],
          { type: "application/json" },
        ),
      )
      comment = await ninjaOneRequest<Record<string, unknown>>(
        accessToken,
        `/v2/ticketing/ticket/${encodeURIComponent(ticketId)}/comment`,
        {
          method: "POST",
          body: form,
          headers: {},
        },
      )
    }

    if (ticket.commentOnly) {
      return NextResponse.json({
        source: "NinjaOne",
        ticket: current,
        comment,
      })
    }

    const clientId = Number(ticket.clientId || current.clientId || 0)
    const requesterUid = String(ticket.requesterUid || current.requesterUid || "")
    const subject = String(ticket.subject || current.subject || "").trim().slice(0, 200)
    const ticketFormId =
      Number(ticket.ticketFormId || current.ticketFormId || 0) ||
      (await defaultTicketFormId(accessToken))
    const version = Number(ticket.version || current.version || 0)
    const tags = cleanStringArray(ticket.tags)
    const ccEmails = cleanStringArray(ticket.ccEmails)
    const followupTime =
      ticket.followupTime === null || ticket.followupTime === undefined
        ? undefined
        : Number(ticket.followupTime || 0) || undefined
    const status = await ninjaOneStatusId(
      accessToken,
      ticket.status || currentStatus?.name || "new",
      ticket.statusId || currentStatus?.statusId,
    )

    if (!clientId) throw new Error("Missing NinjaOne organization ID.")
    if (!requesterUid) throw new Error("Missing NinjaOne requester.")
    if (!subject) throw new Error("Ticket subject is required.")
    if (!version) throw new Error("NinjaOne ticket version was not returned.")

    const updated = await ninjaOneRequest<Record<string, unknown>>(
      accessToken,
      `/v2/ticketing/ticket/${encodeURIComponent(ticketId)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          version,
          clientId,
          ticketFormId,
          requesterUid,
          subject,
          status,
          type: typeToNinjaOne(ticket.type || current.type || "service_request"),
          priority: priorityToNinjaOne(ticket.priority || current.priority),
          severity: requestedSeverityToNinjaOne(ticket.severity || current.severity, ticket.priority || current.priority),
          ...(ticket.tags ? { tags } : {}),
          ...(ticket.ccEmails ? { cc: { emails: ccEmails } } : {}),
          ...(ticket.followupTime !== undefined ? { followupTime: followupTime ?? null } : {}),
        }),
      },
    )

    return NextResponse.json({
      source: "NinjaOne",
      ticket: updated,
      comment,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "NinjaOne ticket update failed.",
      },
      { status: 500 },
    )
  }
}
