import { neon } from "@neondatabase/serverless"

export type QueryValue = string | number | boolean | Date | null

export function isVaultConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export async function vaultQuery<T = Record<string, unknown>>(
  text: string,
  values: QueryValue[] = []
) {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the client vault.")
  }
  const sql = neon(databaseUrl)
  return sql.query(text, values) as Promise<T[]>
}
