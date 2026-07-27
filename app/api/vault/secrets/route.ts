import { NextRequest, NextResponse } from "next/server"
import {
  auditVaultEvent,
  canAccessClient,
  requireVaultStepUp,
  requireVaultUser,
} from "../../../vault/access"
import { encryptSecret } from "../../../vault/crypto"
import { isVaultConfigured, vaultQuery } from "../../../vault/db"

type SecretListRow = {
  id: string
  client_id: string
  title: string
  category: string
  url: string
  username: string
  client_notes: string
  internal_notes: string
  mfa_method: string
  recovery_method: string
  has_recovery_value: boolean
  sensitivity: string
  client_visible: boolean
  exportable: boolean
  last_verified_at: string | null
  last_rotated_at: string | null
  updated_at: string
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function GET(request: NextRequest) {
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

  const clientId = request.nextUrl.searchParams.get("clientId") || ""
  if (!clientId || !(await canAccessClient(auth.user, clientId))) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 })
  }

  const clientVisibilityClause =
    auth.user.role === "admin" ? "" : "and client_visible = true"
  const rows = await vaultQuery<SecretListRow>(
    `select id,
            client_id,
            title,
            category,
            url,
            username,
            client_notes,
            ${auth.user.role === "admin" ? "internal_notes" : "''"} as internal_notes,
            mfa_method,
            recovery_method,
            (recovery_value_ciphertext <> '') as has_recovery_value,
            sensitivity,
            client_visible,
            exportable,
            last_verified_at,
            last_rotated_at,
            updated_at
       from vault_secret_records
      where client_id = $1
        and deleted_at is null
        ${clientVisibilityClause}
      order by category, title`,
    [clientId]
  )

  await auditVaultEvent({
    user: auth.user,
    clientId,
    targetType: "secret_record",
    eventType: "list",
  })

  return NextResponse.json({ secrets: rows })
}

export async function POST(request: NextRequest) {
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
  if (auth.user.role !== "admin") {
    return NextResponse.json({ error: "admin_required" }, { status: 403 })
  }
  if (!(await requireVaultStepUp(auth.session))) return NextResponse.json({ error: "mfa_required" }, { status: 403 })

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const clientId = stringValue(body.clientId)
  const title = stringValue(body.title)
  const secret = stringValue(body.secret)
  if (!clientId || !title || !secret) {
    return NextResponse.json(
      { error: "clientId, title, and secret are required." },
      { status: 400 }
    )
  }

  const encrypted = await encryptSecret(secret)
  const recoveryValue = stringValue(body.recoveryValue)
  const encryptedRecovery = recoveryValue ? await encryptSecret(recoveryValue) : null
  const rows = await vaultQuery<{ id: string }>(
    `insert into vault_secret_records (
       client_id,
       title,
       category,
       url,
       username,
       secret_ciphertext,
       secret_iv,
       secret_tag,
       client_notes,
       internal_notes,
       mfa_method,
       recovery_method,
       recovery_value_ciphertext,
       recovery_value_iv,
       sensitivity,
       client_visible,
       exportable,
       created_by,
       updated_by
     ) values (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
       $11, $12, $13, $14, $15, $16, $17, $18, $18
     )
     returning id`,
    [
      clientId,
      title,
      stringValue(body.category) || "General",
      stringValue(body.url),
      stringValue(body.username),
      encrypted.secret_ciphertext,
      encrypted.secret_iv,
      encrypted.secret_tag,
      stringValue(body.clientNotes),
      stringValue(body.internalNotes),
      stringValue(body.mfaMethod),
      stringValue(body.recoveryMethod),
      encryptedRecovery?.secret_ciphertext || "",
      encryptedRecovery?.secret_iv || "",
      stringValue(body.sensitivity) || "highly_sensitive",
      Boolean(body.clientVisible),
      Boolean(body.exportable),
      auth.user.id || null,
    ]
  )

  await auditVaultEvent({
    user: auth.user,
    clientId,
    targetType: "secret_record",
    targetId: rows[0]?.id,
    eventType: "create",
  })

  return NextResponse.json({ id: rows[0]?.id }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!isVaultConfigured()) return NextResponse.json({ error: "Vault database is not configured." }, { status: 503 })
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  if (auth.user.role !== "admin") return NextResponse.json({ error: "admin_required" }, { status: 403 })
  if (!(await requireVaultStepUp(auth.session))) return NextResponse.json({ error: "mfa_required" }, { status: 403 })

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const id = stringValue(body.id)
  const clientId = stringValue(body.clientId)
  const title = stringValue(body.title)
  const secret = stringValue(body.secret)
  if (!id || !clientId || !title || !(await canAccessClient(auth.user, clientId))) {
    return NextResponse.json({ error: "id, clientId, and title are required." }, { status: 400 })
  }
  const encrypted = secret ? await encryptSecret(secret) : null
  const recoveryValue = stringValue(body.recoveryValue)
  const encryptedRecovery = recoveryValue ? await encryptSecret(recoveryValue) : null
  const rows = await vaultQuery<{ id: string }>(
    `update vault_secret_records set
       title = $3, category = $4, url = $5, username = $6,
       client_notes = $7, internal_notes = $8, mfa_method = $9,
       recovery_method = $10, sensitivity = $11, client_visible = $12,
       exportable = $13, updated_by = $14, updated_at = now(),
       secret_ciphertext = case when $15 then $16 else secret_ciphertext end,
       secret_iv = case when $15 then $17 else secret_iv end,
       secret_tag = case when $15 then $18 else secret_tag end,
       recovery_value_ciphertext = case when $19 then $20 else recovery_value_ciphertext end,
       recovery_value_iv = case when $19 then $21 else recovery_value_iv end,
       last_rotated_at = case when $15 then now() else last_rotated_at end
     where id = $1 and client_id = $2 and deleted_at is null
     returning id`,
    [id, clientId, title, stringValue(body.category) || "General", stringValue(body.url),
      stringValue(body.username), stringValue(body.clientNotes), stringValue(body.internalNotes),
      stringValue(body.mfaMethod), stringValue(body.recoveryMethod), stringValue(body.sensitivity) || "highly_sensitive",
      Boolean(body.clientVisible), Boolean(body.exportable), auth.user.id || null, Boolean(encrypted),
      encrypted?.secret_ciphertext || null, encrypted?.secret_iv || null, encrypted?.secret_tag || null,
      Boolean(encryptedRecovery), encryptedRecovery?.secret_ciphertext || null, encryptedRecovery?.secret_iv || null]
  )
  if (!rows[0]) return NextResponse.json({ error: "Credential not found." }, { status: 404 })
  await auditVaultEvent({ user: auth.user, clientId, targetType: "secret_record", targetId: id, eventType: "update" })
  return NextResponse.json({ id })
}
