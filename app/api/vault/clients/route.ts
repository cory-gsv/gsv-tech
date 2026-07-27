import { NextResponse } from "next/server"
import { auditVaultEvent, clientAccessForUser, requireVaultUser } from "../../../vault/access"
import { isVaultConfigured, vaultQuery } from "../../../vault/db"

export async function GET() {
  if (!isVaultConfigured()) {
    return NextResponse.json(
      { error: "Vault database is not configured." },
      { status: 503 }
    )
  }

  const auth = await requireVaultUser()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const clients = await clientAccessForUser(auth.user)
  return NextResponse.json({ clients, role: auth.user.role })
}

function clean(value: unknown) {
  return String(value ?? "").trim()
}

export async function POST(request: Request) {
  if (!isVaultConfigured()) {
    return NextResponse.json({ error: "Vault database is not configured." }, { status: 503 })
  }
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  if (auth.user.role !== "admin") return NextResponse.json({ error: "admin_required" }, { status: 403 })
  const body = await request.json().catch(() => ({})) as { clients?: Array<{ id?: unknown; name?: unknown; status?: unknown }> }
  const clients = Array.isArray(body.clients) ? body.clients.slice(0, 500) : []
  for (const client of clients) {
    const externalId = clean(client.id)
    const name = clean(client.name)
    if (!externalId || !name) continue
    const status = ["active", "offboarding", "inactive"].includes(clean(client.status)) ? clean(client.status) : "active"
    await vaultQuery(
      `insert into vault_clients (external_client_id, name, status)
       values ($1, $2, $3)
       on conflict (external_client_id) do update set name = excluded.name, status = excluded.status, updated_at = now()`,
      [externalId, name, status]
    )
  }
  await auditVaultEvent({ user: auth.user, targetType: "client_collection", eventType: "sync", reason: `${clients.length} portal clients submitted` })
  return NextResponse.json({ clients: await clientAccessForUser(auth.user), role: auth.user.role })
}
