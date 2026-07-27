import { NextRequest, NextResponse } from "next/server"
import {
  auditVaultEvent,
  canAccessClient,
  requireVaultStepUp,
  requireVaultUser,
} from "../../../vault/access"
import { decryptSecret } from "../../../vault/crypto"
import { isVaultConfigured, vaultQuery } from "../../../vault/db"

type ExportRow = {
  id: string
  client_id: string
  title: string
  category: string
  url: string
  username: string
  secret_ciphertext: string
  secret_iv: string
  client_notes: string
  mfa_method: string
  recovery_method: string
  last_verified_at: string | null
  last_rotated_at: string | null
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
  if (!(await requireVaultStepUp(auth.session))) {
    return NextResponse.json({ error: "mfa_required" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({})) as {
    clientId?: string
    reason?: string
  }
  const clientId = body.clientId || ""
  if (!clientId || !(await canAccessClient(auth.user, clientId, "export"))) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 })
  }

  const rows = await vaultQuery<ExportRow>(
    `select id,
            client_id,
            title,
            category,
            url,
            username,
            secret_ciphertext,
            secret_iv,
            client_notes,
            mfa_method,
            recovery_method,
            last_verified_at,
            last_rotated_at
       from vault_secret_records
      where client_id = $1
        and client_visible = true
        and exportable = true
        and deleted_at is null
      order by category, title`,
    [clientId]
  )

  const credentials = await Promise.all(
    rows.map(async (row) => ({
      title: row.title,
      category: row.category,
      url: row.url,
      username: row.username,
      password: await decryptSecret(row.secret_ciphertext, row.secret_iv),
      notes: row.client_notes,
      mfaMethod: row.mfa_method,
      recoveryMethod: row.recovery_method,
      lastVerifiedAt: row.last_verified_at,
      lastRotatedAt: row.last_rotated_at,
    }))
  )

  await auditVaultEvent({
    user: auth.user,
    clientId,
    targetType: "client_vault",
    eventType: "export",
    reason: body.reason || "Client credential export",
  })

  return new NextResponse(
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        clientId,
        exportedBy: auth.user.email,
        credentials,
      },
      null,
      2
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="gsv-client-vault-${clientId}.json"`,
        "cache-control": "no-store",
      },
    }
  )
}
