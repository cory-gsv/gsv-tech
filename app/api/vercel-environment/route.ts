import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"
import { verifyBillingSession } from "../../billing/billingAuth"

function clean(value: unknown) {
  return String(value ?? "").trim()
}

function validEnvironmentKey(value: string) {
  return /^UNIFI_NETWORK_[A-Z0-9_]+$/.test(value)
}

async function vercelAccessToken() {
  const configured = clean(process.env.VERCEL_API_TOKEN || process.env.VERCEL_TOKEN)
  if (configured) return configured
  if (process.env.NODE_ENV === "production") return ""
  const candidates = [
    join(homedir(), "Library", "Application Support", "com.vercel.cli", "auth.json"),
    join(homedir(), ".local", "share", "com.vercel.cli", "auth.json"),
    join(homedir(), ".vercel", "auth.json"),
  ]
  for (const path of candidates) {
    try {
      const auth = JSON.parse(await readFile(path, "utf8")) as { token?: unknown }
      const token = clean(auth.token)
      if (token) return token
    } catch {
      // Try the next standard Vercel CLI credential location.
    }
  }
  return ""
}

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)
  if (!isAuthed) return NextResponse.json({ error: "Portal login required." }, { status: 401 })

  const token = await vercelAccessToken()
  const projectId = clean(process.env.VERCEL_PROJECT_ID) || "prj_4LBmyTnmSIk1gq9lxxT0rkOsOX6T"
  const teamId = clean(process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID) || "team_mzoZw7wurNQ7v1RpyXYTZQND"
  if (!token) return NextResponse.json({ error: "VERCEL_API_TOKEN is not configured for environment-variable management." }, { status: 503 })

  const body = await request.json().catch(() => ({}))
  const variables = Array.isArray(body.variables) ? body.variables.map((item: unknown) => {
    const row = item && typeof item === "object" ? item as Record<string, unknown> : {}
    return { key: clean(row.key).toUpperCase(), value: clean(row.value) }
  }).filter((item: { key: string; value: string }) => item.key && item.value) : []
  if (!variables.length) return NextResponse.json({ error: "At least one environment variable name and value is required." }, { status: 400 })
  const invalid = variables.find((item: { key: string }) => !validEnvironmentKey(item.key))
  if (invalid) return NextResponse.json({ error: `${invalid.key} must be a UNIFI_NETWORK_* environment-variable name.` }, { status: 400 })
  const removeKeys: string[] = Array.isArray(body.removeKeys)
    ? [...new Set<string>(body.removeKeys.map((key: unknown) => clean(key).toUpperCase()).filter(Boolean) as string[])]
    : []
  const invalidRemoveKey = removeKeys.find((key) => !validEnvironmentKey(key))
  if (invalidRemoveKey) return NextResponse.json({ error: `${invalidRemoveKey} must be a UNIFI_NETWORK_* environment-variable name.` }, { status: 400 })

  const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/env`)
  url.searchParams.set("upsert", "true")
  if (teamId) url.searchParams.set("teamId", teamId)
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(variables.map((item: { key: string; value: string }) => ({
      key: item.key,
      value: item.value,
      type: "encrypted",
      target: ["production", "preview", "development"],
    }))),
    cache: "no-store",
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = clean(data?.error?.message || data?.message || data?.error) || `Vercel returned ${response.status}.`
    return NextResponse.json({ error: message }, { status: response.status })
  }
  const removed: string[] = []
  for (const key of removeKeys) {
    if (variables.some((item: { key: string }) => item.key === key)) continue
    const deleteUrl = new URL(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/env/${encodeURIComponent(key)}`)
    if (teamId) deleteUrl.searchParams.set("teamId", teamId)
    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      const deleteData = await deleteResponse.json().catch(() => ({}))
      const message = clean(deleteData?.error?.message || deleteData?.message || deleteData?.error) || `Vercel could not remove ${key}.`
      return NextResponse.json({ error: message, saved: variables.map((item: { key: string }) => item.key) }, { status: deleteResponse.status })
    }
    removed.push(key)
  }
  return NextResponse.json({ saved: variables.map((item: { key: string }) => item.key), removed, redeployRequired: true })
}
