import { NextRequest, NextResponse } from "next/server"
import {
  auditVaultEvent,
  canAccessClient,
  requireVaultStepUp,
  requireVaultUser,
} from "../../../../../vault/access"
import { decryptSecret } from "../../../../../vault/crypto"
import { isVaultConfigured, vaultQuery } from "../../../../../vault/db"

type SecretRow = {
  id: string
  client_id: string
  title: string
  username: string
  secret_ciphertext: string
  secret_iv: string
  recovery_value_ciphertext: string
  recovery_value_iv: string
  client_visible: boolean
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ secretId: string }> }
) {
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

  const { secretId } = await context.params
  const rows = await vaultQuery<SecretRow>(
    `select id,
            client_id,
            title,
            username,
            secret_ciphertext,
            secret_iv,
            recovery_value_ciphertext,
            recovery_value_iv,
            client_visible
       from vault_secret_records
      where id = $1
        and deleted_at is null
      limit 1`,
    [secretId]
  )
  const secret = rows[0]
  if (!secret) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  if (
    !(await canAccessClient(auth.user, secret.client_id)) ||
    (auth.user.role !== "admin" && !secret.client_visible)
  ) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({})) as { reason?: string; field?: string }
  const isRecoveryValue = body.field === "recovery_value"
  await auditVaultEvent({
    user: auth.user,
    clientId: secret.client_id,
    targetType: "secret_record",
    targetId: secret.id,
    eventType: "reveal",
    reason: body.reason || "",
  })

  return NextResponse.json({
    id: secret.id,
    title: secret.title,
    username: secret.username,
    secret: isRecoveryValue
      ? (secret.recovery_value_ciphertext ? await decryptSecret(secret.recovery_value_ciphertext, secret.recovery_value_iv) : "")
      : await decryptSecret(secret.secret_ciphertext, secret.secret_iv),
  })
}
