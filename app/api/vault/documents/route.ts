import { NextResponse } from "next/server"
import { auditVaultEvent, canAccessClient, requireVaultUser } from "../../../vault/access"
import { isVaultConfigured, vaultQuery } from "../../../vault/db"
import { deleteVaultObject, isVaultStorageConfigured, uploadVaultObject } from "../../../vault/storage"

const allowedSensitivities = new Set(["standard", "confidential", "highly_sensitive", "break_glass"])

type ClientRow = { id: string; external_client_id: string; name: string }
type DocumentRow = {
  id: string
  external_client_id: string
  folder: string
  filename: string
  mime_type: string
  byte_size: number
  sensitivity: string
  client_visible: boolean
  exportable: boolean
  created_at: string
  checksum_sha256: string
  blob_path: string
  title: string
  description: string
  source: string
  snapshot_id: string
  location_id: string
  location_name: string
  artifact_kind: string
  report_kind: string
  backup_kind: string
  deleted_at?: string | null
}

function clean(value: unknown) {
  return String(value ?? "").trim()
}

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "file"
}

async function findClient(externalClientId: string) {
  const rows = await vaultQuery<ClientRow>(
    `select id, external_client_id, name from vault_clients where external_client_id = $1 and status <> 'inactive' limit 1`,
    [externalClientId]
  )
  return rows[0] || null
}

async function ensureClient(externalClientId: string, name: string) {
  const rows = await vaultQuery<ClientRow>(
    `insert into vault_clients (external_client_id, name)
     values ($1, $2)
     on conflict (external_client_id) do update set name = excluded.name, updated_at = now()
     returning id, external_client_id, name`,
    [externalClientId, name || externalClientId]
  )
  return rows[0]
}

function unavailable() {
  return NextResponse.json({ error: "Vault database or private storage is not configured." }, { status: 503 })
}

export async function GET(request: Request) {
  if (!isVaultConfigured() || !isVaultStorageConfigured()) return unavailable()
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const externalClientId = clean(new URL(request.url).searchParams.get("clientId"))
  const client = await findClient(externalClientId)
  if (!client && auth.user.role === "admin") return NextResponse.json({ configured: true, documents: [] })
  if (!client || !(await canAccessClient(auth.user, client.id))) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 })
  }
  const visibility = auth.user.role === "admin" ? "" : "and d.client_visible = true"
  const documents = await vaultQuery<DocumentRow>(
    `select d.id, c.external_client_id, d.folder, d.filename, d.mime_type, d.byte_size,
            d.sensitivity, d.client_visible, d.exportable, d.created_at, d.checksum_sha256, d.blob_path,
            d.title, d.description, d.source, d.snapshot_id, d.location_id, d.location_name,
            d.artifact_kind, d.report_kind, d.backup_kind
       from vault_documents d join vault_clients c on c.id = d.client_id
      where d.client_id = $1 and d.deleted_at is null ${visibility}
      order by d.created_at desc`,
    [client.id]
  )
  const passwordCounts = await vaultQuery<{ password_count: string }>(
    `select count(*)::text as password_count from vault_secret_records where client_id = $1 and deleted_at is null`,
    [client.id]
  )
  return NextResponse.json({ configured: true, documents, passwordCount: Number(passwordCounts[0]?.password_count || 0) })
}

export async function DELETE(request: Request) {
  if (!isVaultConfigured() || !isVaultStorageConfigured()) return unavailable()
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  if (auth.user.role !== "admin") return NextResponse.json({ error: "admin_required" }, { status: 403 })
  const body = await request.json().catch(() => ({}))
  const externalClientId = clean(body.clientId)
  const folder = clean(body.folder)
  const snapshotId = clean(body.snapshotId)
  const documentIds = Array.isArray(body.documentIds)
    ? body.documentIds.map(clean).filter(Boolean).slice(0, 20)
    : []
  const generatedFilenames = Array.isArray(body.generatedFilenames)
    ? body.generatedFilenames.map(clean).filter(Boolean).slice(0, 20)
    : []
  if (snapshotId) {
    const client = await findClient(externalClientId)
    if (!client || !(await canAccessClient(auth.user, client.id))) return NextResponse.json({ error: "not_allowed" }, { status: 403 })
    const rows = await vaultQuery<Pick<DocumentRow, "id" | "blob_path" | "filename">>(
      `select id, blob_path, filename
         from vault_documents
        where client_id = $1 and deleted_at is null
          and (snapshot_id = $2 or id::text = any($3::text[]) or filename = any($4::text[]))`,
      [client.id, snapshotId, documentIds, generatedFilenames]
    )
    const deletedIds: string[] = []
    const failures: string[] = []
    for (const document of rows) {
      try {
        await deleteVaultObject(document.blob_path)
        await vaultQuery(`update vault_documents set deleted_at = now() where id = $1`, [document.id])
        await auditVaultEvent({ user: auth.user, clientId: client.id, targetType: "document", targetId: document.id, eventType: "delete_snapshot_artifact" })
        deletedIds.push(document.id)
      } catch (error) {
        failures.push(`${document.filename}: ${error instanceof Error ? error.message : "delete failed"}`)
      }
    }
    if (failures.length) {
      return NextResponse.json(
        { error: `Unable to remove ${failures.length} associated snapshot file${failures.length === 1 ? "" : "s"}.`, deleted: deletedIds.length, deletedIds, failures },
        { status: 409 }
      )
    }
    return NextResponse.json({ deleted: deletedIds.length, deletedIds })
  }
  const keepPerType = Math.max(1, Math.min(100, Number(body.keepPerType) || 1))
  if (!externalClientId || folder !== "Backups") return NextResponse.json({ error: "A client and the Backups folder are required." }, { status: 400 })
  const client = await findClient(externalClientId)
  if (!client || !(await canAccessClient(auth.user, client.id))) return NextResponse.json({ error: "not_allowed" }, { status: 403 })
  const candidates = await vaultQuery<Pick<DocumentRow, "id" | "blob_path" | "filename">>(
    `select id, blob_path, filename
       from vault_documents
      where client_id = $1 and folder = $2 and deleted_at is null
      order by created_at desc`,
    [client.id, folder]
  )
  let jsonSeen = 0
  let nativeSeen = 0
  const rows = candidates.filter((document) => /\.unf$/i.test(document.filename) ? ++nativeSeen > keepPerType : ++jsonSeen > keepPerType)
  for (const document of rows) {
    await vaultQuery(`update vault_documents set deleted_at = now() where id = $1`, [document.id])
    await deleteVaultObject(document.blob_path).catch(() => undefined)
    await auditVaultEvent({ user: auth.user, clientId: client.id, targetType: "document", targetId: document.id, eventType: "delete_duplicate" })
  }
  return NextResponse.json({ deleted: rows.length, retainedPerType: keepPerType })
}

export async function POST(request: Request) {
  if (!isVaultConfigured() || !isVaultStorageConfigured()) return unavailable()
  const auth = await requireVaultUser()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })
  if (auth.user.role !== "admin") return NextResponse.json({ error: "admin_required" }, { status: 403 })

  const form = await request.formData()
  const externalClientId = clean(form.get("clientId"))
  if (!externalClientId) return NextResponse.json({ error: "clientId is required." }, { status: 400 })
  const client = await findClient(externalClientId) || await ensureClient(externalClientId, clean(form.get("clientName")))
  if (!client || !(await canAccessClient(auth.user, client.id))) {
    return NextResponse.json({ error: "not_allowed" }, { status: 403 })
  }
  const file = form.get("file")
  if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "A non-empty file is required." }, { status: 400 })
  const maxBytes = Number(process.env.VAULT_MAX_FILE_BYTES || 50 * 1024 * 1024)
  if (file.size > maxBytes) return NextResponse.json({ error: `File exceeds the ${Math.round(maxBytes / 1024 / 1024)} MB limit.` }, { status: 413 })
  const folder = clean(form.get("category")) || "General"
  const title = clean(form.get("title"))
  const description = clean(form.get("description"))
  const source = clean(form.get("source"))
  const snapshotId = clean(form.get("snapshotId"))
  const locationId = clean(form.get("locationId"))
  const locationName = clean(form.get("locationName"))
  const artifactKind = clean(form.get("artifactKind"))
  const reportKind = clean(form.get("reportKind"))
  const backupKind = clean(form.get("backupKind"))
  if (folder === "Pictures" && !title) return NextResponse.json({ error: "A picture title is required." }, { status: 400 })
  const requestedSensitivity = clean(form.get("sensitivity"))
  const sensitivity = allowedSensitivities.has(requestedSensitivity) ? requestedSensitivity : "confidential"
  const documentId = crypto.randomUUID()
  const blobPath = `${client.id}/${documentId}/${safeFilename(file.name)}`
  const bytes = await file.arrayBuffer()
  const checksum = Buffer.from(await crypto.subtle.digest("SHA-256", bytes)).toString("hex")

  const deduplicateGeneratedFile =
    (folder === "Backups" && /-unifi-(?:dr|native)-backup-/i.test(file.name)) ||
    (folder === "Reports" && /-network-report-.*\.pdf$/i.test(file.name))
  if (deduplicateGeneratedFile) {
    const existing = await vaultQuery<DocumentRow>(
      `select d.id, c.external_client_id, d.folder, d.filename, d.mime_type, d.byte_size,
              d.sensitivity, d.client_visible, d.exportable, d.created_at, d.checksum_sha256, d.blob_path,
              d.title, d.description, d.source, d.snapshot_id, d.location_id, d.location_name,
              d.artifact_kind, d.report_kind, d.backup_kind, d.deleted_at
         from vault_documents d join vault_clients c on c.id = d.client_id
        where d.client_id = $1 and d.folder = $2 and d.filename = $3
        order by d.created_at desc limit 1`,
      [client.id, folder, file.name]
    )
    if (existing[0]) {
      if (existing[0].deleted_at) {
        await auditVaultEvent({ user: auth.user, clientId: client.id, targetType: "document", targetId: existing[0].id, eventType: "upload_blocked_deleted" })
        return NextResponse.json(
          { error: "This generated file was previously deleted and will not be recreated. Pull a new snapshot to create a new backup." },
          { status: 409 }
        )
      }
      if (snapshotId && !existing[0].snapshot_id) {
        await vaultQuery(
          `update vault_documents
              set source = $2, snapshot_id = $3, location_id = $4, location_name = $5,
                  artifact_kind = $6, report_kind = $7, backup_kind = $8
            where id = $1`,
          [existing[0].id, source, snapshotId, locationId, locationName, artifactKind, reportKind, backupKind]
        )
        Object.assign(existing[0], {
          source,
          snapshot_id: snapshotId,
          location_id: locationId,
          location_name: locationName,
          artifact_kind: artifactKind,
          report_kind: reportKind,
          backup_kind: backupKind,
        })
      }
      await auditVaultEvent({ user: auth.user, clientId: client.id, targetType: "document", targetId: existing[0].id, eventType: "upload_deduplicated" })
      return NextResponse.json({ document: existing[0], deduplicated: true })
    }
  }

  await uploadVaultObject(blobPath, bytes, file.type || "application/octet-stream")
  try {
    const rows = await vaultQuery<{ id: string; created_at: string }>(
      `insert into vault_documents (
         id, client_id, folder, filename, blob_path, mime_type, byte_size, checksum_sha256,
         sensitivity, client_visible, exportable, created_by, title, description, source,
         snapshot_id, location_id, location_name, artifact_kind, report_kind, backup_kind
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       returning id, created_at`,
      [documentId, client.id, folder, file.name, blobPath, file.type || "application/octet-stream",
        file.size, checksum, sensitivity, form.get("clientVisible") === "true",
        form.get("exportable") === "true", auth.user.id || null, title, description, source,
        snapshotId, locationId, locationName, artifactKind, reportKind, backupKind]
    )
    await auditVaultEvent({ user: auth.user, clientId: client.id, targetType: "document", targetId: documentId, eventType: "upload" })
    return NextResponse.json({ document: {
      id: documentId, external_client_id: externalClientId, folder, filename: file.name,
      mime_type: file.type, byte_size: file.size, sensitivity, title, description, source,
      snapshot_id: snapshotId, location_id: locationId, location_name: locationName,
      artifact_kind: artifactKind, report_kind: reportKind, backup_kind: backupKind,
      created_at: rows[0]?.created_at,
    } }, { status: 201 })
  } catch (error) {
    const { deleteVaultObject } = await import("../../../vault/storage")
    await deleteVaultObject(blobPath).catch(() => undefined)
    throw error
  }
}
