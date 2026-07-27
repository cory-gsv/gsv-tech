import { del, get, put } from "@vercel/blob"

export function isVaultStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN)
}

export async function uploadVaultObject(path: string, body: ArrayBuffer, mimeType: string) {
  if (!isVaultStorageConfigured()) throw new Error("Private vault storage is not configured.")
  await put(path, Buffer.from(body), {
    access: "private",
    contentType: mimeType || "application/octet-stream",
    addRandomSuffix: false,
    allowOverwrite: false,
  })
}

export async function downloadVaultObject(path: string) {
  if (!isVaultStorageConfigured()) throw new Error("Private vault storage is not configured.")
  const result = await get(path, { access: "private", useCache: false })
  if (!result || result.statusCode !== 200) throw new Error("Private vault file was not found.")
  return new Response(result.stream, {
    headers: {
      "content-type": result.blob.contentType || "application/octet-stream",
      "content-length": String(result.blob.size),
      etag: result.blob.etag,
    },
  })
}

export async function deleteVaultObject(path: string) {
  if (!isVaultStorageConfigured()) throw new Error("Private vault storage is not configured.")
  await del(path)
}
