import { NextResponse } from "next/server"
import { auditVaultEvent, canAccessClient, requireVaultUser } from "../../../../vault/access"
import { isVaultConfigured, vaultQuery } from "../../../../vault/db"
import { deleteVaultObject, isVaultStorageConfigured } from "../../../../vault/storage"

type DocumentRow = { id: string; client_id: string; blob_path: string; client_visible: boolean }

export async function DELETE(_request: Request, context: { params: Promise<{ documentId: string }> }) {
  if (!isVaultConfigured() || !isVaultStorageConfigured()) return NextResponse.json({ error: "Vault is not configured." }, { status: 503 })
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  if (auth.user.role !== "admin") return NextResponse.json({ error: "admin_required" }, { status: 403 })
  const { documentId } = await context.params
  const rows = await vaultQuery<DocumentRow>(`select id, client_id, blob_path, client_visible from vault_documents where id = $1 and deleted_at is null limit 1`, [documentId])
  const document = rows[0]
  if (!document || !(await canAccessClient(auth.user, document.client_id))) return NextResponse.json({ error: "not_found" }, { status: 404 })
  await vaultQuery(`update vault_documents set deleted_at = now() where id = $1`, [document.id])
  await deleteVaultObject(document.blob_path)
  await auditVaultEvent({ user: auth.user, clientId: document.client_id, targetType: "document", targetId: document.id, eventType: "delete" })
  return NextResponse.json({ deleted: true })
}
