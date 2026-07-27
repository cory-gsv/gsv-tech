function requiredKeyBytes() {
  const raw = process.env.VAULT_ENCRYPTION_KEY || ""
  if (!raw) {
    throw new Error("VAULT_ENCRYPTION_KEY is required for vault encryption.")
  }

  const decoded = Buffer.from(raw, "base64")
  if (decoded.length !== 32) {
    throw new Error("VAULT_ENCRYPTION_KEY must be a base64-encoded 32-byte key.")
  }
  return decoded
}

async function vaultCryptoKey() {
  return crypto.subtle.importKey(
    "raw",
    requiredKeyBytes(),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  )
}

export async function encryptSecret(secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await vaultCryptoKey(),
    new TextEncoder().encode(secret)
  )
  return {
    secret_ciphertext: Buffer.from(encrypted).toString("base64"),
    secret_iv: Buffer.from(iv).toString("base64"),
    secret_tag: "",
  }
}

export async function decryptSecret(ciphertext: string, iv: string) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: Buffer.from(iv, "base64") },
    await vaultCryptoKey(),
    Buffer.from(ciphertext, "base64")
  )
  return new TextDecoder().decode(decrypted)
}
