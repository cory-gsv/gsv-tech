import { NextResponse } from "next/server"
import { auditVaultEvent, canAccessClient, requireVaultStepUp, requireVaultUser } from "../../../../../vault/access"
import { isVaultConfigured, vaultQuery } from "../../../../../vault/db"
import { downloadVaultObject, isVaultStorageConfigured } from "../../../../../vault/storage"

type DocumentRow = { id: string; client_id: string; filename: string; blob_path: string; mime_type: string; sensitivity: string; client_visible: boolean }

export async function GET(_request: Request, context: { params: Promise<{ documentId: string }> }) {
  if (!isVaultConfigured() || !isVaultStorageConfigured()) return NextResponse.json({ error: "Vault is not configured." }, { status: 503 })
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { documentId } = await context.params
  const rows = await vaultQuery<DocumentRow>(`select id, client_id, filename, blob_path, mime_type, sensitivity, client_visible from vault_documents where id = $1 and deleted_at is null limit 1`, [documentId])
  const document = rows[0]
  if (!document || !(await canAccessClient(auth.user, document.client_id)) || (auth.user.role !== "admin" && !document.client_visible)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  if (["highly_sensitive", "break_glass"].includes(document.sensitivity) && !(await requireVaultStepUp(auth.session))) {
    return NextResponse.json({ error: "mfa_required" }, { status: 403 })
  }
  const stored = await downloadVaultObject(document.blob_path)
  await auditVaultEvent({ user: auth.user, clientId: document.client_id, targetType: "document", targetId: document.id, eventType: "download" })
  return new NextResponse(stored.body, {
    headers: {
      "content-type": document.mime_type || "application/octet-stream",
      "content-length": stored.headers.get("content-length") || "",
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(document.filename)}`,
      "cache-control": "private, no-store, max-age=0",
      "x-content-type-options": "nosniff",
    },
  })
}
