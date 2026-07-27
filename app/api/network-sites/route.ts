import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBillingSession } from "../../billing/billingAuth"
import { isVaultConfigured, vaultQuery } from "../../vault/db"

type NetworkSiteRow = {
  id: string
  external_client_id: string
  name: string
  street_address: string
  address_line_2: string
  city: string
  region: string
  postal_code: string
  phone: string
  contact_name: string
  host_id: string
  site_id: string
  host_env_key: string
  site_env_key: string
  env_prefix: string
  notes: string
  sort_order: number
}

function clean(value: unknown) {
  return String(value ?? "").trim()
}

function sitePayload(row: NetworkSiteRow) {
  const envPrefix = clean(row.env_prefix)
  const storedHostEnvKey = clean(row.host_env_key)
  const hostEnvKey = envPrefix === "UNIFI_NETWORK_MOXIE" && (!storedHostEnvKey || storedHostEnvKey === "UNIFI_NETWORK_MOXIE_HOST_ID")
    ? "UNIFI_NETWORK_MOXIE_MAIN_OFFICE_HOST_ID"
    : storedHostEnvKey || (envPrefix ? `${envPrefix}_HOST_ID` : "")
  const siteEnvKey = clean(row.site_env_key) || (envPrefix ? `${envPrefix}_SITE` : "")
  const envHostId = hostEnvKey ? clean(process.env[hostEnvKey]) : ""
  const envSiteId = siteEnvKey ? clean(process.env[siteEnvKey]) : ""
  // Deployment configuration is authoritative for managed connectors. A stale
  // database value must not silently route a client site to another console.
  const hostId = envHostId || clean(row.host_id)
  const siteId = envSiteId || clean(row.site_id)
  return {
    id: row.id,
    name: row.name,
    streetAddress: row.street_address,
    addressLine2: row.address_line_2,
    city: row.city,
    region: row.region,
    postalCode: row.postal_code,
    phone: row.phone,
    contactName: row.contact_name,
    hostId,
    siteId,
    hostEnvKey,
    siteEnvKey,
    envPrefix,
    connectionSource: envPrefix ? "vercel-env" : row.host_id || row.site_id ? "site-record" : "unconfigured",
    connectionConfigured: Boolean(hostId && siteId),
    notes: row.notes,
    sortOrder: Number(row.sort_order || 0),
  }
}

async function requireAdmin() {
  if (!isVaultConfigured()) return { error: "Network site database is not configured.", status: 503 as const }
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)
  if (!isAuthed) return { error: "Portal login required.", status: 401 as const }
  return { ok: true as const }
}

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const clientId = clean(new URL(request.url).searchParams.get("clientId"))
  if (!clientId) return NextResponse.json({ error: "clientId is required." }, { status: 400 })
  const rows = await vaultQuery<NetworkSiteRow>(
    `select id, external_client_id, name, street_address, address_line_2, city, region,
            postal_code, phone, contact_name, host_id, site_id, host_env_key, site_env_key, env_prefix, notes, sort_order
       from portal_network_sites
      where external_client_id = $1
      order by sort_order, created_at, name`,
    [clientId]
  )
  return NextResponse.json({ sites: rows.map(sitePayload) })
}

export async function PUT(request: Request) {
  const auth = await requireAdmin()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({}))
  const clientId = clean(body.clientId)
  const id = clean(body.id)
  const name = clean(body.name)
  if (!clientId || !id || !name) return NextResponse.json({ error: "clientId, id, and name are required." }, { status: 400 })
  const existingRows = await vaultQuery<NetworkSiteRow>(
    `select id, external_client_id, name, street_address, address_line_2, city, region,
            postal_code, phone, contact_name, host_id, site_id, host_env_key, site_env_key, env_prefix, notes, sort_order
       from portal_network_sites
      where id = $1 and external_client_id = $2
      limit 1`,
    [id, clientId]
  )
  const existing = existingRows[0]
  const incomingHostId = clean(body.hostId)
  const incomingSiteId = clean(body.siteId)
  const incomingHostEnvKey = clean(body.hostEnvKey)
  const incomingSiteEnvKey = clean(body.siteEnvKey)
  const incomingEnvPrefix = clean(body.envPrefix)
  const rows = await vaultQuery<NetworkSiteRow>(
    `insert into portal_network_sites (
       id, external_client_id, name, street_address, address_line_2, city, region,
       postal_code, phone, contact_name, host_id, site_id, host_env_key, site_env_key, env_prefix, notes, sort_order, updated_at
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,now())
     on conflict (id) do update set
       external_client_id = excluded.external_client_id,
       name = excluded.name,
       street_address = excluded.street_address,
       address_line_2 = excluded.address_line_2,
       city = excluded.city,
       region = excluded.region,
       postal_code = excluded.postal_code,
       phone = excluded.phone,
       contact_name = excluded.contact_name,
       host_id = excluded.host_id,
       site_id = excluded.site_id,
       host_env_key = excluded.host_env_key,
       site_env_key = excluded.site_env_key,
       env_prefix = excluded.env_prefix,
       notes = excluded.notes,
       sort_order = excluded.sort_order,
       updated_at = now()
     returning id, external_client_id, name, street_address, address_line_2, city, region,
               postal_code, phone, contact_name, host_id, site_id, host_env_key, site_env_key, env_prefix, notes, sort_order`,
    [clientId, id, name, clean(body.streetAddress), clean(body.addressLine2), clean(body.city),
      clean(body.region), clean(body.postalCode), clean(body.phone), clean(body.contactName),
      incomingHostId || clean(existing?.host_id), incomingSiteId || clean(existing?.site_id),
      incomingHostEnvKey || clean(existing?.host_env_key), incomingSiteEnvKey || clean(existing?.site_env_key),
      incomingEnvPrefix || clean(existing?.env_prefix), clean(body.notes),
      Number.isFinite(Number(body.sortOrder)) ? Math.max(0, Math.trunc(Number(body.sortOrder))) : 0]
  )
  return NextResponse.json({ site: sitePayload(rows[0]) })
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({}))
  const clientId = clean(body.clientId)
  const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds.map(clean).filter(Boolean) : []
  if (!clientId || !orderedIds.length) return NextResponse.json({ error: "clientId and orderedIds are required." }, { status: 400 })
  if (new Set(orderedIds).size !== orderedIds.length) return NextResponse.json({ error: "Site order contains duplicate IDs." }, { status: 400 })

  await vaultQuery(
    `update portal_network_sites as site
        set sort_order = ordered.position - 1,
            updated_at = now()
       from jsonb_array_elements_text($2::jsonb) with ordinality as ordered(id, position)
      where site.external_client_id = $1
        and site.id = ordered.id`,
    [clientId, JSON.stringify(orderedIds)]
  )
  const rows = await vaultQuery<NetworkSiteRow>(
    `select id, external_client_id, name, street_address, address_line_2, city, region,
            postal_code, phone, contact_name, host_id, site_id, host_env_key, site_env_key, env_prefix, notes, sort_order
       from portal_network_sites
      where external_client_id = $1
      order by sort_order, created_at, name`,
    [clientId]
  )
  return NextResponse.json({ sites: rows.map(sitePayload) })
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({}))
  const clientId = clean(body.clientId)
  const id = clean(body.id)
  if (!clientId || !id) return NextResponse.json({ error: "clientId and id are required." }, { status: 400 })

  const targetRows = await vaultQuery<{ id: string }>(
    `select id from portal_network_sites where external_client_id = $1 and id = $2 limit 1`,
    [clientId, id]
  )
  // A site can exist in older browser-local portal data without ever having
  // reached Neon. Removing that orphan does not affect the persisted final site.
  if (!targetRows.length) return NextResponse.json({ deleted: true, id, orphaned: true })

  const countRows = await vaultQuery<{ site_count: string }>(
    `select count(*)::text as site_count
       from portal_network_sites
      where external_client_id = $1`,
    [clientId]
  )
  if (Number(countRows[0]?.site_count || 0) <= 1) {
    return NextResponse.json({ error: "A client must retain at least one site." }, { status: 409 })
  }

  const deleted = await vaultQuery<{ id: string }>(
    `delete from portal_network_sites
      where external_client_id = $1 and id = $2
      returning id`,
    [clientId, id]
  )
  if (!deleted.length) return NextResponse.json({ error: "Site not found." }, { status: 404 })
  return NextResponse.json({ deleted: true, id: deleted[0].id })
}
