import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createHash } from "crypto"
import { verifyBillingSession } from "../../billing/billingAuth"

const UI_API_ROOT = "https://api.ui.com"

type JsonRecord = Record<string, unknown>

type NetworkEnvelope<T> = {
  data?: T
  message?: string
  error?: string
}

type NetworkSite = {
  id?: string
  name?: string
  internalReference?: string
}

type NativeBackupRequest = {
  clientId?: string
  clientName?: string
  locationId?: string
  locationName?: string
  hostId?: string
  siteId?: string
}

type LogContext = {
  requestId: string
  route: string
  clientId: string
  clientName: string
  envPrefix: string
}

function envValue(key: string) {
  const value = process.env[key]?.trim() || ""
  return value.replace(/^["']|["']$/g, "").trim()
}

function cleanText(value: unknown) {
  if (value && typeof value === "object") return ""
  return String(value ?? "").trim()
}

function normalizeText(value: unknown) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function requestId() {
  return globalThis.crypto?.randomUUID?.() || `req_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function safeHostTail(hostId: string) {
  const value = cleanText(hostId)
  return value ? value.slice(-12) : ""
}

function valueFingerprint(value: string) {
  return value ? createHash("sha256").update(value).digest("hex").slice(0, 16) : ""
}

function bodySnippet(text: string) {
  return cleanText(text).replace(/\s+/g, " ").slice(0, 500)
}

function parseJsonEnvelope<T>(text: string): T {
  try {
    return JSON.parse(text || "{}") as T
  } catch {
    return {} as T
  }
}

function logNetworkEvent(context: LogContext | undefined, event: string, data: JsonRecord = {}) {
  if (!context) return
  console.info(JSON.stringify({
    event,
    requestId: context.requestId,
    route: context.route,
    clientId: context.clientId,
    clientName: context.clientName,
    envPrefix: context.envPrefix,
    ...data,
  }))
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {}
}

function clientEnvPrefix(request: NativeBackupRequest) {
  const clientId = normalizeText(request.clientId)
  const clientName = normalizeText(request.clientName)
  const location = normalizeText(`${request.locationId || ""} ${request.locationName || ""}`)
  if ((clientId.includes("moxie") || clientName.includes("moxie")) && /fulfillment/.test(location)) return "UNIFI_NETWORK_MOXIE_FULFILLMENT_LOCATION"
  if ((clientId.includes("moxie") || clientName.includes("moxie")) && (!location || /loc rocklin hq|main office|rocklin headquarters/.test(location))) return "UNIFI_NETWORK_MOXIE"
  if (clientId.includes("nyssco") || clientName.includes("new york style sausage")) return "UNIFI_NETWORK_NYSS_MAIN"
  return ""
}

function connectorProxyUrl(hostId: string, path: string) {
  return `${UI_API_ROOT}/v1/connector/consoles/${encodeURIComponent(hostId)}/proxy/${path.replace(/^\/+/, "")}`
}

function connectorIntegrationUrl(hostId: string, path: string) {
  return `${UI_API_ROOT}/v1/connector/consoles/${encodeURIComponent(hostId)}/proxy/network/integration/v1/${path.replace(/^\/+/, "")}`
}

async function connectorIntegrationGet<T>(apiKey: string, hostId: string, path: string, logContext?: LogContext) {
  logNetworkEvent(logContext, "unifi.native_backup.connector.request", {
    method: "GET",
    path,
    hostTail: safeHostTail(hostId),
  })
  const response = await fetch(connectorIntegrationUrl(hostId, path), {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
    },
    cache: "no-store",
  })
  const text = await response.text()
  const data = parseJsonEnvelope<NetworkEnvelope<T>>(text)
  logNetworkEvent(logContext, "unifi.native_backup.connector.response", {
    method: "GET",
    path,
    hostTail: safeHostTail(hostId),
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get("content-type") || "",
    responseSnippet: response.ok ? "" : bodySnippet(text),
  })
  if (!response.ok) {
    throw new Error(data.message || data.error || `UniFi connector request failed with ${response.status} for ${path}.`)
  }
  return data
}

async function pickNetworkSite(apiKey: string, hostId: string, request: NativeBackupRequest, logContext?: LogContext) {
  const sitesEnvelope = await connectorIntegrationGet<NetworkSite[]>(apiKey, hostId, "sites?offset=0&limit=200", logContext)
  const sites = Array.isArray(sitesEnvelope.data) ? sitesEnvelope.data : []
  const requestedSite = cleanText(request.siteId) || "default"
  if (requestedSite) {
    const normalizedRequested = normalizeText(requestedSite)
    const explicit = sites.find((site) =>
      cleanText(site.id) === requestedSite ||
      cleanText(site.internalReference) === requestedSite ||
      normalizeText(site.name) === normalizedRequested ||
      normalizeText(site.internalReference) === normalizedRequested,
    )
    if (explicit) return explicit
  }

  return (
    sites.find((site) => cleanText(site.internalReference) === "default") ||
    sites.find((site) => normalizeText(site.name) === "default") ||
    sites[0] ||
    null
  )
}

function extractBackupDownloadPath(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") {
    const text = value.trim()
    const match = text.match(/(?:https?:\/\/[^"'\s]+)?(?:\/proxy\/network)?\/dl\/[^"'\s]+?\.unf(?:\?[^"'\s]*)?/i)
    return match?.[0] || ""
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractBackupDownloadPath(item)
      if (found) return found
    }
    return ""
  }
  if (typeof value === "object") {
    for (const item of Object.values(value as JsonRecord)) {
      const found = extractBackupDownloadPath(item)
      if (found) return found
    }
  }
  return ""
}

function downloadProxyCandidates(rawPath: string) {
  let path = rawPath
  try {
    if (/^https?:\/\//i.test(path)) {
      const url = new URL(path)
      path = `${url.pathname}${url.search}`
    }
  } catch {
    // Keep the raw path when URL parsing fails.
  }
  path = path.replace(/^\/+/, "")
  const candidates = new Set<string>()
  if (path.startsWith("proxy/network/")) candidates.add(path.replace(/^proxy\//, ""))
  if (path.startsWith("network/")) candidates.add(path)
  if (path.startsWith("dl/")) candidates.add(`network/${path}`)
  candidates.add(path)
  return [...candidates]
}

function filenameFromPath(path: string, clientName: string) {
  const fallback = `${clientName || "unifi-network"}-native-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.unf`
  try {
    const url = /^https?:\/\//i.test(path) ? new URL(path) : new URL(`https://local/${path.replace(/^\/+/, "")}`)
    const last = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "")
    return /\.unf$/i.test(last) ? last : fallback
  } catch {
    const last = decodeURIComponent(path.split("?")[0].split("/").filter(Boolean).pop() || "")
    return /\.unf$/i.test(last) ? last : fallback
  }
}

async function postBackupCommand(apiKey: string, hostId: string, path: string, logContext?: LogContext) {
  logNetworkEvent(logContext, "unifi.native_backup.command.request", {
    method: "POST",
    path,
    hostTail: safeHostTail(hostId),
  })
  const response = await fetch(connectorProxyUrl(hostId, path), {
    method: "POST",
    headers: {
      Accept: "application/json, application/octet-stream",
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({ cmd: "backup", days: "-1" }),
    cache: "no-store",
  })

  const contentType = response.headers.get("content-type") || ""
  const arrayBuffer = await response.arrayBuffer()
  const body = Buffer.from(arrayBuffer)
  logNetworkEvent(logContext, "unifi.native_backup.command.response", {
    method: "POST",
    path,
    hostTail: safeHostTail(hostId),
    status: response.status,
    ok: response.ok,
    contentType,
    bytes: body.byteLength,
    responseSnippet: response.ok || !contentType.includes("json") ? "" : bodySnippet(body.toString("utf8")),
  })
  if (!response.ok) {
    let message = `UniFi native backup command failed with ${response.status} for ${path}.`
    if (contentType.includes("json")) {
      const json = JSON.parse(body.toString("utf8") || "{}") as JsonRecord
      message = cleanText(json.message) || cleanText(json.error) || message
    }
    throw new Error(message)
  }

  if (!contentType.includes("json") && body.byteLength > 0) {
    return { directBackup: body, commandResponse: null as JsonRecord | null, downloadPath: "" }
  }

  const json = JSON.parse(body.toString("utf8") || "{}") as JsonRecord
  return { directBackup: null as Buffer | null, commandResponse: json, downloadPath: extractBackupDownloadPath(json) }
}

async function downloadBackupFile(apiKey: string, hostId: string, rawPath: string, logContext?: LogContext) {
  const errors: string[] = []
  for (const candidate of downloadProxyCandidates(rawPath)) {
    logNetworkEvent(logContext, "unifi.native_backup.download.request", {
      method: "GET",
      path: candidate,
      hostTail: safeHostTail(hostId),
    })
    const response = await fetch(connectorProxyUrl(hostId, candidate), {
      headers: {
        Accept: "application/octet-stream, application/x-unifi-backup, */*",
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
    })
    const contentType = response.headers.get("content-type") || ""
    const arrayBuffer = await response.arrayBuffer()
    const body = Buffer.from(arrayBuffer)
    logNetworkEvent(logContext, "unifi.native_backup.download.response", {
      method: "GET",
      path: candidate,
      hostTail: safeHostTail(hostId),
      status: response.status,
      ok: response.ok,
      contentType,
      bytes: body.byteLength,
      responseSnippet: response.ok || !contentType.includes("json") ? "" : bodySnippet(body.toString("utf8")),
    })
    if (response.ok && body.byteLength && !contentType.includes("json")) {
      return { body, path: candidate, contentType: contentType || "application/octet-stream" }
    }
    let message = `${candidate}: HTTP ${response.status}`
    if (contentType.includes("json")) {
      const json = JSON.parse(body.toString("utf8") || "{}") as JsonRecord
      message = `${candidate}: ${cleanText(json.message) || cleanText(json.error) || `HTTP ${response.status}`}`
    }
    errors.push(message)
  }
  if (errors.some((message) => /insufficient permissions|HTTP 401|HTTP 403/i.test(message))) {
    throw new Error("The UniFi cloud connector created the native backup but does not permit downloading the .unf file. The portal DR backup is still retained.")
  }
  throw new Error(`Backup command returned a download path, but the file could not be downloaded. ${errors.join(" | ")}`)
}

async function createNativeBackup(apiKey: string, hostId: string, siteRef: string, logContext?: LogContext) {
  const commandPaths = [
    `network/api/s/${encodeURIComponent(siteRef)}/cmd/backup`,
    `network/api/s/${encodeURIComponent(siteRef)}/cmd/system`,
  ]
  const errors: string[] = []

  for (const commandPath of commandPaths) {
    try {
      const command = await postBackupCommand(apiKey, hostId, commandPath, logContext)
      if (command.directBackup) {
        return {
          body: command.directBackup,
          filename: `unifi-network-${siteRef}-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.unf`,
          commandPath,
          downloadPath: "",
          contentType: "application/octet-stream",
        }
      }
      if (!command.downloadPath) {
        throw new Error("Backup command succeeded but did not return a .unf download path.")
      }
      const downloaded = await downloadBackupFile(apiKey, hostId, command.downloadPath, logContext)
      return {
        body: downloaded.body,
        filename: filenameFromPath(command.downloadPath, `unifi-network-${siteRef}`),
        commandPath,
        downloadPath: downloaded.path,
        contentType: downloaded.contentType,
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Unknown backup command failure.")
    }
  }

  throw new Error(errors.join(" | "))
}

export async function POST(request: Request) {
  const id = requestId()
  let logContext: LogContext | undefined
  try {
    const cookieStore = await cookies()
    const isAuthed = await verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)

    if (!isAuthed) {
      console.info(JSON.stringify({
        event: "network_atlas_native_backup.auth.failed",
        requestId: id,
        route: "network-atlas-native-backup",
      }))
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as NativeBackupRequest
    const envPrefix = clientEnvPrefix(body)
    logContext = {
      requestId: id,
      route: "network-atlas-native-backup",
      clientId: cleanText(body.clientId),
      clientName: cleanText(body.clientName),
      envPrefix,
    }
    const clientApiKey = envPrefix ? envValue(`${envPrefix}_API_KEY`) : ""
    const globalApiKey = envValue("UNIFI_SITE_MANAGER_API_KEY")
    // Native backup requests also pass through api.ui.com and require the
    // Site Manager credential, not a console-local Network integration key.
    const apiKey = globalApiKey
    const envHostId = envPrefix === "UNIFI_NETWORK_MOXIE"
      ? envValue("UNIFI_NETWORK_MOXIE_MAIN_OFFICE_HOST_ID") || envValue("UNIFI_NETWORK_MOXIE_HOST_ID")
      : envPrefix ? envValue(`${envPrefix}_HOST_ID`) : ""
    const envSiteId = envPrefix ? envValue(`${envPrefix}_SITE`) : ""
    const hostId = cleanText(body.hostId) || envHostId
    if (!body.siteId && envSiteId) body.siteId = envSiteId
    logNetworkEvent(logContext, "network_atlas_native_backup.request.start", {
      envApiKeyName: "UNIFI_SITE_MANAGER_API_KEY",
      authMode: "site-manager-cloud-connector",
      hasApiKey: Boolean(apiKey),
      keyLength: apiKey.length,
      selectedKeyFingerprint: valueFingerprint(apiKey),
      clientKeyPresent: Boolean(clientApiKey),
      clientKeyLength: clientApiKey.length,
      clientKeyFingerprint: valueFingerprint(clientApiKey),
      clientKeyIgnoredForCloudConnector: false,
      globalKeyPresent: Boolean(globalApiKey),
      globalKeyLength: globalApiKey.length,
      globalKeyFingerprint: valueFingerprint(globalApiKey),
      hasBodyHostId: Boolean(cleanText(body.hostId)),
      hasEnvHostId: Boolean(envHostId),
      envHostIdLength: envHostId.length,
      envHostIdFingerprint: valueFingerprint(envHostId),
      hostSource: cleanText(body.hostId) ? "request-body" : envHostId ? "env" : "none",
      hostTail: safeHostTail(hostId),
      hostIdFingerprint: valueFingerprint(hostId),
      requestedSiteId: cleanText(body.siteId) || "default",
    })

    if (!apiKey) {
      logNetworkEvent(logContext, "network_atlas_native_backup.config.missing_api_key", {
        envApiKeyName: "UNIFI_SITE_MANAGER_API_KEY",
      })
      return NextResponse.json({ error: "Set UNIFI_SITE_MANAGER_API_KEY before creating native UniFi backups through api.ui.com." }, { status: 503 })
    }
    if (!hostId) {
      logNetworkEvent(logContext, "network_atlas_native_backup.config.missing_host_id")
      return NextResponse.json({ error: "No UniFi console host ID is configured for this client." }, { status: 400 })
    }

    const site = await pickNetworkSite(apiKey, hostId, body, logContext)
    const siteRef = cleanText(site?.internalReference) || cleanText(site?.id) || cleanText(body.siteId) || "default"
    logNetworkEvent(logContext, "network_atlas_native_backup.site.selected", {
      hostTail: safeHostTail(hostId),
      siteRef,
      siteId: cleanText(site?.id),
      siteName: cleanText(site?.name),
    })
    const backup = await createNativeBackup(apiKey, hostId, siteRef, logContext)

    const responseBody = backup.body.buffer.slice(
      backup.body.byteOffset,
      backup.body.byteOffset + backup.body.byteLength,
    ) as ArrayBuffer

    logNetworkEvent(logContext, "network_atlas_native_backup.request.success", {
      filename: backup.filename,
      bytes: backup.body.byteLength,
      commandPath: backup.commandPath,
      downloadPath: backup.downloadPath,
      siteRef,
    })

    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        "Content-Type": backup.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${backup.filename.replace(/"/g, "")}"`,
        "X-Unifi-Backup-Filename": backup.filename,
        "X-Unifi-Backup-Bytes": String(backup.body.byteLength),
        "X-Unifi-Backup-Command-Path": backup.commandPath,
        "X-Unifi-Backup-Download-Path": backup.downloadPath,
        "X-Unifi-Site-Reference": siteRef,
      },
    })
  } catch (error) {
    logNetworkEvent(logContext, "network_atlas_native_backup.request.failed", {
      error: error instanceof Error ? error.message : "Native UniFi backup failed.",
    })
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Native UniFi backup failed.",
      },
      { status: 502 },
    )
  }
}
