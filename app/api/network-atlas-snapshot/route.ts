import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createHash } from "crypto"
import { verifyBillingSession } from "../../billing/billingAuth"

export const maxDuration = 300

const UI_API_ROOT = "https://api.ui.com"
const NINJAONE_API_ROOT = "https://us2.ninjarmm.com"

type JsonRecord = Record<string, unknown>

type UiEnvelope<T> = {
  data?: T
  nextToken?: string
  message?: string
  error?: string
}

type UiHost = {
  id?: string
  hardwareId?: string
  type?: string
  ipAddress?: string
  owner?: boolean
  isBlocked?: boolean
  reportedState?: JsonRecord
  userData?: JsonRecord
}

type UiSite = {
  siteId?: string
  hostId?: string
  meta?: {
    desc?: string
    name?: string
    timezone?: string
    gatewayMac?: string
  }
  statistics?: JsonRecord
  permission?: string
  isOwner?: boolean
}

type UiDevice = {
  id?: string
  mac?: string
  name?: string
  model?: string
  shortname?: string
  ip?: string
  productLine?: string
  status?: string
  version?: string
  firmwareStatus?: string
  updateAvailable?: string
}

type UiDeviceGroup = {
  hostId?: string
  hostName?: string
  devices?: UiDevice[]
}

type NetworkEnvelope<T> = {
  data?: T
  count?: number
  limit?: number
  offset?: number
  totalCount?: number
  message?: string
  error?: string
}

type NetworkSite = {
  id?: string
  name?: string
  internalReference?: string
  timezone?: string
}

type SnapshotRequest = {
  action?: string
  auditResponseId?: string
  snapshot?: JsonRecord
  ninjaOneOrgId?: number
  clientId?: string
  clientName?: string
  locationId?: string
  locationName?: string
  hostId?: string
  siteId?: string
  label?: string
  enrichWithOpenAI?: boolean
}

type NinjaServerDevice = {
  id?: number
  organizationId?: number
  locationId?: number
  parentDeviceId?: number
  nodeClass?: string
  displayName?: string
  systemName?: string
  dnsName?: string
  offline?: boolean
  os?: { name?: string; fullName?: string }
  ipAddresses?: string[]
  references?: { location?: { id?: number; name?: string; address?: string } }
  manufacturer?: string
  model?: string
}

type NinjaLocation = { id?: number; name?: string; address?: string; description?: string }

function isNinjaServerClass(nodeClass: string) {
  return /SERVER|VMWARE_VM_HOST|VMWARE_VM_GUEST|HYPERV_VMM_HOST|HYPERV_VMM_GUEST|NMS_VM_HOST|NMS_VIRTUAL_MACHINE/i.test(nodeClass)
}

function isNinjaVmClass(nodeClass: string) {
  return /VM_GUEST|VIRTUAL_MACHINE/i.test(nodeClass)
}

async function pullNinjaDevicesForSite(request: SnapshotRequest) {
  const organizationId = Number(request.ninjaOneOrgId || 0)
  if (!organizationId) return { devices: [] as JsonRecord[], siteDevices: [] as JsonRecord[], locations: [] as NinjaLocation[], mapping: "not-configured" }
  const clientId = envValue("NINJAONE_SERVICE_CLIENT_ID") || envValue("NINJAONE_CLIENT_ID")
  const clientSecret = envValue("NINJAONE_SERVICE_CLIENT_SECRET") || envValue("NINJAONE_CLIENT_SECRET")
  if (!clientId || !clientSecret) throw new Error("NinjaOne API credentials are not configured.")
  const tokenResponse = await fetch(`${envValue("NINJAONE_API_ROOT") || NINJAONE_API_ROOT}/ws/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "monitoring",
    }),
    cache: "no-store",
  })
  const tokenData = await tokenResponse.json().catch(() => ({})) as { access_token?: string; error_description?: string; error?: string }
  if (!tokenResponse.ok || !tokenData.access_token) throw new Error(tokenData.error_description || tokenData.error || "NinjaOne authentication failed.")

  const apiRoot = envValue("NINJAONE_API_ROOT") || NINJAONE_API_ROOT
  const [devicesResponse, locationsResponse] = await Promise.all([
    fetch(`${apiRoot}/v2/devices-detailed?pageSize=500`, { headers: { Authorization: `Bearer ${tokenData.access_token}` }, cache: "no-store" }),
    fetch(`${apiRoot}/v2/organization/${organizationId}/locations`, { headers: { Authorization: `Bearer ${tokenData.access_token}` }, cache: "no-store" }),
  ])
  const devicesData = await devicesResponse.json().catch(() => ([])) as NinjaServerDevice[] | { message?: string; error?: string }
  if (!devicesResponse.ok) {
    const errorData = devicesData as { message?: string; error?: string }
    throw new Error(errorData.message || errorData.error || `NinjaOne device inventory failed with ${devicesResponse.status}.`)
  }
  const locationsData = await locationsResponse.json().catch(() => ([])) as NinjaLocation[]
  const locations = Array.isArray(locationsData) ? locationsData : []
  const normalize = (value: unknown) => cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  const portalLocation = normalize(`${request.locationName || ""} ${request.locationId || ""}`)
  const portalAddress = normalize((request as SnapshotRequest & { locationAddress?: string }).locationAddress)
  const matchedLocations = locations.filter((location) => {
    const ninjaLocation = normalize(location.name)
    const ninjaAddress = normalize(location.address)
    return Boolean(
      (portalLocation && ninjaLocation && (portalLocation.includes(ninjaLocation) || ninjaLocation.includes(portalLocation))) ||
      (portalAddress && ninjaAddress && (portalAddress.includes(ninjaAddress) || ninjaAddress.includes(portalAddress)))
    )
  })
  const selectedLocationIds = new Set((matchedLocations.length ? matchedLocations : locations.length === 1 ? locations : []).map((location) => Number(location.id || 0)))
  const mapping = matchedLocations.length ? "matched" : locations.length === 1 ? "single-location" : "organization-wide"
  const devices = (Array.isArray(devicesData) ? devicesData : [])
    .filter((device) => Number(device.organizationId) === organizationId)
    .map((device) => ({
      id: Number(device.id || 0),
      parentDeviceId: Number(device.parentDeviceId || 0),
      locationId: Number(device.locationId || 0),
      name: cleanText(device.displayName) || cleanText(device.systemName) || cleanText(device.dnsName) || `Server ${device.id || ""}`,
      nodeClass: cleanText(device.nodeClass) || "SERVER",
      kind: isNinjaVmClass(cleanText(device.nodeClass)) ? "virtual-machine" : "physical-host",
      category: isNinjaServerClass(cleanText(device.nodeClass)) ? "server" : "managed-device",
      offline: Boolean(device.offline),
      operatingSystem: cleanText(device.os?.fullName) || cleanText(device.os?.name),
      manufacturer: cleanText(device.manufacturer),
      model: cleanText(device.model),
      addresses: Array.isArray(device.ipAddresses) ? device.ipAddresses : [],
      locationName: cleanText(device.references?.location?.name) || cleanText(locations.find((location) => Number(location.id) === Number(device.locationId))?.name),
      source: "NinjaOne",
    }))
  const siteDevices = selectedLocationIds.size
    ? devices.filter((device) => selectedLocationIds.has(Number(device.locationId || 0)))
    : []
  return { devices, siteDevices, locations, mapping }
}

function addNinjaInventoryToSnapshot(snapshot: JsonRecord, inventory: { devices: JsonRecord[]; siteDevices: JsonRecord[]; mapping: string }) {
  if (!inventory.siteDevices.length) {
    const details = asRecord(snapshot.details)
    return {
      ...snapshot,
      details: {
        ...details,
        managedDeviceInventory: [],
        serverInventory: [],
        ninjaOneLocationMapping: inventory.mapping,
      },
    }
  }
  const details = asRecord(snapshot.details)
  const topologyPlan = asRecord(details.topologyPlan)
  const existingNodes = asArray(topologyPlan.nodes).map(asRecord)
  const existingLinks = asArray(topologyPlan.links).map(asRecord)
  const servers = inventory.siteDevices.filter((device) => cleanText(device.category) === "server")
  const hosts = servers.filter((server) => cleanText(server.kind) === "physical-host")
  const guests = servers.filter((server) => cleanText(server.kind) === "virtual-machine")
  const serverNodes = servers.map((server, index) => {
    const isVm = cleanText(server.kind) === "virtual-machine"
    const column = isVm ? 1 : 0
    const row = isVm ? guests.indexOf(server) : hosts.indexOf(server)
    return {
      id: `ninja-server-${Number(server.id)}`,
      type: isVm ? "Virtual Machine" : "Server",
      title: cleanText(server.name),
      subtitle: cleanText(server.operatingSystem) || cleanText(server.nodeClass),
      detail: `${server.offline ? "Offline" : "Online"} - NinjaOne`,
      tone: server.offline ? "warning" : "service",
      x: column ? 720 : 330,
      y: 760 + row * 105,
      width: 280,
      height: 82,
    }
  })
  const serverLinks = guests
    .filter((guest) => Number(guest.parentDeviceId || 0))
    .map((guest) => ({
      from: `ninja-server-${Number(guest.parentDeviceId)}`,
      to: `ninja-server-${Number(guest.id)}`,
      label: "hosts",
      tone: "primary",
    }))
  return {
    ...snapshot,
    changeSummary: `${cleanText(snapshot.changeSummary)} Added ${hosts.length} onsite server host${hosts.length === 1 ? "" : "s"} and ${guests.length} virtual machine${guests.length === 1 ? "" : "s"} from NinjaOne.`.trim(),
    details: {
      ...details,
      serverInventory: servers,
      managedDeviceInventory: inventory.siteDevices,
      ninjaOneLocationMapping: inventory.mapping,
      topologyPlan: {
        ...topologyPlan,
        nodes: [...existingNodes, ...serverNodes],
        links: [...existingLinks, ...serverLinks],
      },
    },
  }
}

function phoneInventoryKind(record: JsonRecord) {
  const evidence = compactList([
    firstText(record, ["name", "displayName", "hostname", "hostName"]),
    firstText(record, ["model", "deviceModel", "dev_id", "product"]),
    firstText(record, ["deviceCategory", "category", "dev_cat", "type", "nodeClass"]),
    firstText(record, ["manufacturer", "vendor", "oui", "dev_vendor", "deviceVendor"]),
  ]).toLowerCase()
  if (/iphone|android|pixel|galaxy|mobile phone|smartphone|cell phone/.test(evidence)) return "Mobile Phone"
  if (/unifi talk|ui talk|\butp[-_ ]?g\d+\b/.test(evidence)) return "UniFi Talk Phone"
  if (/yealink|polycom|grandstream|audiocodes|cisco.*phone|avaya|mitel|fanvil|snom|obihai|voip|desk phone|ip phone|telephone|sip[-_ ]?(?:t?\d|phone)|\bmp20[12]\b|\bphone\b/.test(evidence)) return "Desk Phone / VoIP"
  return ""
}

function isHardwiredTopologyPhone(record: JsonRecord) {
  const kind = phoneInventoryKind(record)
  if (!kind || kind === "Mobile Phone") return false
  const association = firstText(record, ["association", "lastAssociation", "uplinkName", "connectedDeviceName"])
  const evidence = compactList([
    association,
    firstText(record, ["status", "connectionType", "networkConnectionType"]),
  ]).toLowerCase()
  if (record.is_wired === false || /wireless|wi-?fi|access point|\bap[-_ ]/.test(evidence)) return false
  return kind === "UniFi Talk Phone" || record.is_wired === true || /wired|switch|\bport\s*\d+/.test(evidence)
}

function ensurePhoneInventoryInTopology(snapshot: JsonRecord) {
  const details = asRecord(snapshot.details)
  const topologyPlan = asRecord(details.topologyPlan)
  const nodes = asArray(topologyPlan.nodes)
    .map(asRecord)
    .filter((node) => phoneInventoryKind(node) !== "Mobile Phone")
  const links = asArray(topologyPlan.links).map(asRecord)
  const clientInventory = asArray(details.clientInventory).map(asRecord)
  const managedInventory = asArray(details.managedDeviceInventory).map(asRecord)
  const candidates = [...clientInventory, ...managedInventory].filter(isHardwiredTopologyPhone)

  const nodeIdentity = (node: JsonRecord) => normalizeText(firstText(node, ["title", "name"]))
  const nodeAddress = (node: JsonRecord) => cleanText(firstText(node, ["address", "ipAddress", "ip"])) ||
    cleanText(firstText(node, ["subtitle"]).match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)?.[0])
  // A console/gateway name in endpoint inventory is not proof of a physical
  // gateway port. Only attach supplemental phones to downstream infrastructure.
  const infrastructure = nodes.filter((node) => /switch|access point|wireless/i.test(firstText(node, ["type"])))
  const identityKeys = new Set<string>()
  const phoneNodes = nodes.filter((node) => {
    const kind = phoneInventoryKind(node)
    return kind && kind !== "Mobile Phone"
  })
  phoneNodes.forEach((node) => {
    const name = nodeIdentity(node)
    const address = nodeAddress(node)
    if (name) identityKeys.add(`name:${name}`)
    if (address) identityKeys.add(`ip:${address}`)
  })

  candidates.forEach((record) => {
    const kind = phoneInventoryKind(record)
    const name = firstText(record, ["name", "displayName", "hostname", "hostName"]) || kind
    const address = firstText(record, ["address", "ipAddress", "ip", "lastIpAddress"]) ||
      asArray(record.addresses).map(cleanText).find((value) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(value)) || ""
    const nameKey = normalizeText(name)
    const duplicate = (nameKey && identityKeys.has(`name:${nameKey}`)) || (address && identityKeys.has(`ip:${address}`))
    const association = firstText(record, ["association", "lastAssociation", "uplinkName"])
    const associationKey = normalizeText(association)
    const parent = infrastructure
      .filter((node) => {
        const title = nodeIdentity(node)
        return Boolean(title && associationKey && (associationKey.includes(title) || title.includes(associationKey)))
      })
      .sort((left, right) => nodeIdentity(right).length - nodeIdentity(left).length)[0]

    let phoneNode = nodes.find((node) => {
      const existingName = nodeIdentity(node)
      const existingAddress = nodeAddress(node)
      return Boolean((nameKey && existingName === nameKey) || (address && existingAddress === address))
    })
    if (!phoneNode && !duplicate) {
      const mac = normalizeMac(firstText(record, ["mac", "macAddress", "clientMac", "hwaddr"]))
      const idToken = mac || nameKey.replace(/[^a-z0-9]+/g, "-") || String(phoneNodes.length + 1)
      const index = phoneNodes.length
      phoneNode = {
        id: `phone-${idToken}`,
        type: kind,
        title: name,
        subtitle: compactList([
          firstText(record, ["manufacturer", "vendor"]),
          firstText(record, ["model", "deviceModel", "product"]),
          address,
        ]) || kind,
        detail: association || (record.offline === true ? "Offline" : firstText(record, ["status"]) || "Detected phone"),
        tone: record.offline === true ? "warning" : "service",
        x: 55 + (index % 6) * 205,
        y: 670 + Math.floor(index / 6) * 92,
        width: 180,
        height: 72,
      }
      nodes.push(phoneNode)
      phoneNodes.push(phoneNode)
      if (nameKey) identityKeys.add(`name:${nameKey}`)
      if (address) identityKeys.add(`ip:${address}`)
    }
    const phoneId = firstText(phoneNode || {}, ["id"])
    const parentId = firstText(parent || {}, ["id"])
    if (phoneId && parentId && !links.some((link) => firstText(link, ["from"]) === parentId && firstText(link, ["to"]) === phoneId)) {
      links.push({ from: parentId, to: phoneId, label: association.match(/port\s+\d+/i)?.[0] || "Phone", tone: "primary" })
    }
  })

  const phoneCount = nodes.filter((node) => {
    const kind = phoneInventoryKind(node)
    return kind && kind !== "Mobile Phone"
  }).length
  const summary = asRecord(topologyPlan.summary)
  const summaryLines = asArray(summary.lines).map(cleanText).filter(Boolean).filter((line) => !/phone endpoint/i.test(line))
  const labels = asArray(topologyPlan.labels).map(asRecord)
  if (phoneCount && !labels.some((label) => /phone/i.test(firstText(label, ["text"])))) labels.push({ text: "PHONES", x: 32, y: 650 })
  return {
    ...snapshot,
    details: {
      ...details,
      topologyPlan: {
        ...topologyPlan,
        summary: { ...summary, lines: [...summaryLines, `${phoneCount} phone endpoint${phoneCount === 1 ? "" : "s"}`] },
        labels,
        nodes,
        links,
      },
    },
  }
}

type DrBackupEndpoint = {
  path: string
  description: string
  count?: number
  status: "captured" | "failed" | "not_applicable"
  error?: string
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

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asRecordArray(value: unknown): JsonRecord[] {
  if (Array.isArray(value)) return value.map(asRecord).filter((record) => Object.keys(record).length)
  const record = asRecord(value)
  return Object.keys(record).length ? [record] : []
}

function firstText(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = cleanText(record[key])
    if (value) return value
  }
  return ""
}

function firstNumber(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = Number(record[key])
    if (Number.isFinite(value)) return value
  }
  return 0
}

function optionalNumber(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const raw = record[key]
    if (raw === undefined || raw === null || raw === "") continue
    const value = Number(raw)
    if (Number.isFinite(value)) return value
  }
  return null
}

function reportedAssociatedClientCount(device: JsonRecord) {
  // UniFi's legacy device inventory exposes the same live station total shown
  // in the console's device list as `num_sta`. Prefer that authoritative value
  // over reconstructing AP totals from client uplink fields, which vary across
  // Network API versions and may refer to an upstream switch instead of the AP.
  const count = optionalNumber(device, ["num_sta", "numSta", "connectedClients", "clientCount"])
  return count !== null && count >= 0 ? Math.trunc(count) : null
}

function boolLabel(value: unknown) {
  if (value === true) return "Yes"
  if (value === false) return "No"
  return cleanText(value) || "-"
}

function compactRows(rows: unknown[][]) {
  return rows
    .map((row) => row.map((cell) => cleanText(cell) || "-"))
    .filter((row) => row.some((cell) => cell !== "-"))
}

function compactList(values: unknown[]) {
  return values.map(cleanText).filter(Boolean).join(", ")
}

function findDeepValue(value: unknown, keys: string[], depth = 0): unknown {
  if (depth > 5 || !value || typeof value !== "object") return undefined
  const normalizedKeys = keys.map(normalizeText)
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDeepValue(item, keys, depth + 1)
      if (found !== undefined && cleanText(found)) return found
      if (found === true || found === false || typeof found === "number") return found
    }
    return undefined
  }

  const record = value as JsonRecord
  for (const [key, item] of Object.entries(record)) {
    if (normalizedKeys.includes(normalizeText(key))) return item
  }
  for (const item of Object.values(record)) {
    const found = findDeepValue(item, keys, depth + 1)
    if (found !== undefined && cleanText(found)) return found
    if (found === true || found === false || typeof found === "number") return found
  }
  return undefined
}

function firstDeepText(records: JsonRecord[], keys: string[]) {
  for (const record of records) {
    const value = findDeepValue(record, keys)
    const text = cleanText(value)
    if (text) return text
  }
  return ""
}

function firstDeepValue(records: JsonRecord[], keys: string[]) {
  for (const record of records) {
    const value = findDeepValue(record, keys)
    if (value === true || value === false || typeof value === "number" || cleanText(value)) return value
  }
  return undefined
}

function intrusionEnabledLabel(value: unknown) {
  if (value === true) return "Enabled"
  if (value === false) return "Disabled"
  const text = normalizeText(value)
  if (!text) return ""
  if (/\b(enabled|enable|on|active|ids|ips|detect|detection|prevent|prevention)\b/.test(text)) return "Enabled"
  if (/\b(disabled|disable|off|inactive)\b/.test(text)) return "Disabled"
  return cleanText(value)
}

function intrusionProtectionSummary(settings: JsonRecord[], events: JsonRecord[]) {
  const enabledRaw = firstDeepValue(settings, [
    "enabled",
    "idsEnabled",
    "ipsEnabled",
    "ids_enabled",
    "ips_enabled",
    "threatManagementEnabled",
    "threat_management_enabled",
    "suricataEnabled",
    "suspiciousActivityEnabled",
  ])
  const enabled = intrusionEnabledLabel(enabledRaw)
  const mode = firstDeepText(settings, [
    "mode",
    "idsMode",
    "ipsMode",
    "ids_mode",
    "ips_mode",
    "threatManagementMode",
    "threat_management_mode",
    "protectionMode",
    "detectionMode",
  ])
  const sensitivity = firstDeepText(settings, [
    "sensitivity",
    "level",
    "idsSensitivity",
    "ipsSensitivity",
    "threatManagementSensitivity",
  ])
  const signatureVersion = firstDeepText(settings, [
    "signatureVersion",
    "signature_version",
    "ruleVersion",
    "rulesetVersion",
    "ipsVersion",
    "idsVersion",
    "engineVersion",
  ])
  const categories = firstDeepText(settings, [
    "categories",
    "enabledCategories",
    "ipsCategories",
    "idsCategories",
  ])
  let status = "Not exposed"
  if (settings.length) {
    status = enabled || "Settings captured; enablement unclear"
  }
  const recentEvents = events.length
  const eventTypes = Array.from(new Set(events
    .slice(0, 20)
    .map((event) => firstDeepText([event], ["signature", "signatureName", "threat", "category", "classification", "msg", "message"]))
    .filter(Boolean)))
    .slice(0, 6)

  return {
    status,
    mode,
    sensitivity,
    signatureVersion,
    categories,
    recentEvents,
    eventTypes,
    evidence: compactList([
      status !== "Not exposed" ? `Status: ${status}` : "IDS/IPS settings not exposed",
      mode ? `Mode: ${mode}` : "",
      sensitivity ? `Sensitivity: ${sensitivity}` : "",
      signatureVersion ? `Signatures/rules: ${signatureVersion}` : "",
      `${recentEvents} retained intrusion event${recentEvents === 1 ? "" : "s"}`,
    ]),
  }
}

function productKind(device: JsonRecord | UiDevice) {
  const row = asRecord(device)
  const features = asRecord(row.features)
  const type = cleanText(row.type).toLowerCase()
  const productLine = cleanText(row.productLine).toLowerCase()
  const name = `${cleanText(row.name)} ${cleanText(row.model)} ${cleanText(row.shortname)}`.toLowerCase()
  if (type === "udm" || type === "ugw" || productLine.includes("gateway") || /\budm\b|dream machine|gateway|cloud gateway/.test(name)) return "Gateway"
  if (type === "usw" || features.switching || productLine.includes("switch") || /\bswitch\b|usw|us48|uslp|pro max|enterprise/.test(name)) return "Switch"
  if (type === "uap" || features.accessPoint || productLine.includes("access") || /\bap\b|u6|u7|access point|uapa/.test(name)) return "Access Point"
  if (productLine.includes("camera") || /camera|protect|g4|g5/.test(name)) return "Camera"
  return cleanText(productLine) || "Device"
}

function statusText(device: JsonRecord | UiDevice) {
  const row = asRecord(device)
  const rawStatus = row.status ?? row.state ?? row.stateName
  let status = cleanText(rawStatus) || "unknown"
  if (rawStatus === 1 || status === "1") status = "ONLINE"
  if (rawStatus === 0 || status === "0") status = "OFFLINE"
  if (rawStatus === true) status = "ONLINE"
  if (rawStatus === false) status = "OFFLINE"
  const firmware = cleanText(row.firmwareStatus)
  if (firmware && firmware.toLowerCase() !== "up-to-date") return `${status} - ${firmware}`
  return status
}

function clientEnvPrefix(request: SnapshotRequest) {
  const clientId = normalizeText(request.clientId)
  const clientName = normalizeText(request.clientName)
  const location = normalizeText(`${request.locationId || ""} ${request.locationName || ""}`)
  if ((clientId.includes("moxie") || clientName.includes("moxie")) && /fulfillment/.test(location)) return "UNIFI_NETWORK_MOXIE_FULFILLMENT_LOCATION"
  if ((clientId.includes("moxie") || clientName.includes("moxie")) && (!location || /loc rocklin hq|main office|rocklin headquarters/.test(location))) return "UNIFI_NETWORK_MOXIE"
  if (clientId.includes("nyssco") || clientName.includes("new york style sausage")) return "UNIFI_NETWORK_NYSS_MAIN"
  return ""
}

function connectorPath(hostId: string, path: string) {
  const normalizedPath = path.replace(/^\/+/, "")
  return `${UI_API_ROOT}/v1/connector/consoles/${encodeURIComponent(hostId)}/proxy/network/integration/v1/${normalizedPath}`
}

async function networkConnectorGet<T>(apiKey: string, hostId: string, path: string, logContext?: LogContext) {
  const url = connectorPath(hostId, path)
  logNetworkEvent(logContext, "unifi.connector.request", {
    method: "GET",
    path,
    hostTail: safeHostTail(hostId),
  })
  const response = await fetch(connectorPath(hostId, path), {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
    },
    cache: "no-store",
  })
  const text = await response.text()
  const data = parseJsonEnvelope<NetworkEnvelope<T>>(text)
  logNetworkEvent(logContext, "unifi.connector.response", {
    method: "GET",
    path,
    hostTail: safeHostTail(hostId),
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get("content-type") || "",
    responseSnippet: response.ok ? "" : bodySnippet(text),
    urlShape: new URL(url).pathname.replace(encodeURIComponent(hostId), "<host>"),
  })

  if (!response.ok) {
    throw new Error(data.message || data.error || `UniFi Network connector request failed with ${response.status} for ${path}.`)
  }

  return data
}

async function networkConnectorGetAll<T>(apiKey: string, hostId: string, path: string, logContext?: LogContext) {
  const rows: T[] = []
  const separator = path.includes("?") ? "&" : "?"

  for (let offset = 0, page = 0; page < 50; page += 1, offset += 200) {
    const data = await networkConnectorGet<T[]>(apiKey, hostId, `${path}${separator}offset=${offset}&limit=200`, logContext)
    const pageRows = Array.isArray(data.data) ? data.data : []
    rows.push(...pageRows)

    const totalCount = Number(data.totalCount ?? 0)
    if (!pageRows.length) break
    if (totalCount && rows.length >= totalCount) break
    if (pageRows.length < 200) break
  }

  return rows
}

async function networkProxyGet<T>(apiKey: string, hostId: string, path: string, logContext?: LogContext) {
  const url = `${UI_API_ROOT}/v1/connector/consoles/${encodeURIComponent(hostId)}/proxy/${path.replace(/^\/+/, "")}`
  logNetworkEvent(logContext, "unifi.proxy.request", {
    method: "GET",
    path,
    hostTail: safeHostTail(hostId),
  })
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
    },
    cache: "no-store",
  })
  const text = await response.text()
  const data = parseJsonEnvelope<UiEnvelope<T>>(text)
  logNetworkEvent(logContext, "unifi.proxy.response", {
    method: "GET",
    path,
    hostTail: safeHostTail(hostId),
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get("content-type") || "",
    responseSnippet: response.ok ? "" : bodySnippet(text),
    urlShape: new URL(url).pathname.replace(encodeURIComponent(hostId), "<host>"),
  })

  if (!response.ok) {
    throw new Error(data.message || data.error || `UniFi Network proxy request failed with ${response.status} for ${path}.`)
  }

  return data
}

async function uiGet<T>(apiKey: string, path: string, logContext?: LogContext) {
  const url = `${UI_API_ROOT}${path}`
  logNetworkEvent(logContext, "unifi.site_manager.request", {
    method: "GET",
    path,
  })
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
    },
    cache: "no-store",
  })
  const text = await response.text()
  const data = parseJsonEnvelope<UiEnvelope<T>>(text)
  logNetworkEvent(logContext, "unifi.site_manager.response", {
    method: "GET",
    path,
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get("content-type") || "",
    responseSnippet: response.ok ? "" : bodySnippet(text),
  })

  if (!response.ok) {
    throw new Error(data.message || data.error || `UniFi Site Manager request failed with ${response.status}.`)
  }

  return data
}

async function uiGetAll<T>(apiKey: string, path: string, logContext?: LogContext) {
  const rows: T[] = []
  let nextToken = ""

  for (let page = 0; page < 20; page += 1) {
    const separator = path.includes("?") ? "&" : "?"
    const data = await uiGet<T[]>(
      apiKey,
      `${path}${separator}pageSize=200${nextToken ? `&nextToken=${encodeURIComponent(nextToken)}` : ""}`,
      logContext,
    )
    rows.push(...(Array.isArray(data.data) ? data.data : []))
    if (!data.nextToken) break
    nextToken = data.nextToken
  }

  return rows
}

function pickSite(sites: UiSite[], request: SnapshotRequest) {
  if (request.siteId) {
    const explicit = sites.find((site) => site.siteId === request.siteId)
    if (explicit) return explicit
  }

  const clientName = normalizeText(request.clientName)
  if (!clientName) return sites[0] || null

  return (
    sites.find((site) => normalizeText(site.meta?.desc) === clientName) ||
    sites.find((site) => normalizeText(site.meta?.name) === clientName) ||
    sites.find((site) => normalizeText(site.meta?.desc).includes(clientName)) ||
    sites.find((site) => clientName.includes(normalizeText(site.meta?.desc))) ||
    sites[0] ||
    null
  )
}

function normalizedSiteReference(value: unknown) {
  const site = cleanText(value)
  return site.toLowerCase() === "defualt" ? "default" : site
}

function pickSiteForLocation(sites: UiSite[], request: SnapshotRequest, hostId = "") {
  const requestedSiteId = normalizedSiteReference(request.siteId)
  const locationName = normalizeText(request.locationName)
  const hostSites = hostId ? sites.filter((site) => cleanText(site.hostId) === hostId) : sites
  const candidates = hostSites.length ? hostSites : sites

  return (
    candidates.find((site) => cleanText(site.siteId) === requestedSiteId) ||
    candidates.find((site) => locationName && normalizeText(site.meta?.desc) === locationName) ||
    candidates.find((site) => locationName && normalizeText(site.meta?.name) === locationName) ||
    candidates.find((site) => locationName && normalizeText(site.meta?.desc).includes(locationName)) ||
    ((hostId || candidates.length === 1) ? candidates[0] : null) ||
    null
  )
}

async function resolveConnectorTarget(apiKey: string, body: SnapshotRequest, hostIdHint: string, logContext?: LogContext) {
  const [hosts, sites] = await Promise.all([
    uiGetAll<UiHost>(apiKey, "/v1/hosts", logContext),
    uiGetAll<UiSite>(apiKey, "/v1/sites", logContext),
  ])
  const suppliedHostId = cleanText(body.hostId) || cleanText(hostIdHint)
  const host = hosts.find((row) => cleanText(row.id) === suppliedHostId) ||
    hosts.find((row) => cleanText(row.hardwareId) === suppliedHostId) ||
    null
  const clientName = normalizeText(body.clientName)
  const clientMatches = clientName
    ? sites.filter((row) => normalizeText(row.meta?.desc) === clientName || normalizeText(row.meta?.name) === clientName)
    : []
  const site = pickSiteForLocation(sites, body, cleanText(host?.id)) ||
    (clientMatches.length === 1 ? clientMatches[0] : null)
  const resolvedHostId = cleanText(host?.id) || cleanText(site?.hostId) || suppliedHostId

  logNetworkEvent(logContext, "unifi.connector.target.resolved", {
    suppliedHostTail: safeHostTail(suppliedHostId),
    resolvedHostTail: safeHostTail(resolvedHostId),
    matchedHost: Boolean(host),
    matchedByHardwareId: Boolean(host && cleanText(host.hardwareId) === suppliedHostId),
    matchedSiteId: cleanText(site?.siteId),
    hostType: cleanText(host?.type),
    hostOwner: host?.owner === true,
    hostBlocked: host?.isBlocked === true,
    siteOwner: site?.isOwner === true,
    sitePermission: cleanText(site?.permission),
  })

  return { hostId: resolvedHostId, host, site, hosts, sites }
}

function pickNetworkSite(sites: NetworkSite[], request: SnapshotRequest) {
  const requestedSite = normalizedSiteReference(request.siteId) || "default"
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

function unifiNetworkUrl(hostId: string, site: NetworkSite | null) {
  const siteRef = cleanText(site?.internalReference) || cleanText(site?.id) || "default"
  return `https://unifi.ui.com/consoles/${encodeURIComponent(hostId)}/network/${encodeURIComponent(siteRef)}/dashboard`
}

function backupCount(value: unknown) {
  return Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value).length : 0
}

function capturedEndpoint(path: string, description: string, value: unknown): DrBackupEndpoint {
  return {
    path,
    description,
    count: backupCount(value),
    status: "captured",
  }
}

function failedEndpoint(path: string, description: string, error: unknown): DrBackupEndpoint {
  return {
    path,
    description,
    status: "failed",
    error: error instanceof Error ? error.message : cleanText(error) || "Request failed",
  }
}

function buildNetworkDrBackup(args: {
  request: SnapshotRequest
  hostId: string
  site: NetworkSite
  networkSites: NetworkSite[]
  devices: JsonRecord[]
  deviceDetails: JsonRecord[]
  clients: JsonRecord[]
  legacyDevices: JsonRecord[]
  legacyClients: JsonRecord[]
  legacyAllUsers: JsonRecord[]
  applicationDevices: UiDevice[]
  networks: JsonRecord[]
  wifiBroadcasts: JsonRecord[]
  firewallZones: JsonRecord[]
  firewallPolicies: JsonRecord[]
  aclRules: JsonRecord[]
  wans: JsonRecord[]
  intrusionSettings: JsonRecord[]
  intrusionEvents: JsonRecord[]
  endpointErrors?: DrBackupEndpoint[]
}) {
  const siteRef = cleanText(args.site.internalReference) || "default"
  const siteId = cleanText(args.site.id)
  return {
    version: 1,
    kind: "unifi-network-dr-backup",
    generatedAt: new Date().toISOString(),
    generatedBy: "GSV Portal Network Atlas pull",
    client: {
      id: cleanText(args.request.clientId),
      name: cleanText(args.request.clientName),
    },
    console: {
      hostId: args.hostId,
      controllerUrl: unifiNetworkUrl(args.hostId, args.site),
    },
    site: {
      id: siteId,
      name: cleanText(args.site.name),
      internalReference: siteRef,
      timezone: cleanText(args.site.timezone),
    },
    applicationCoverage: [
      { application: "Network", status: "captured", contents: "API-readable configuration, devices, clients, VLANs, Wi-Fi, firewall, ACL, WAN, and security evidence." },
      { application: "Protect", status: "system_config_backup_required", contents: "Application and device configuration requires the UniFi System Config Backup; video recordings remain on-console." },
      { application: "Access", status: "system_config_backup_required", contents: "Application, device, user, and policy configuration requires the UniFi System Config Backup." },
      { application: "Talk", status: "system_config_backup_required", contents: "Application and device configuration requires the UniFi System Config Backup." },
      { application: "Connect", status: "system_config_backup_required", contents: "Application and device configuration requires the UniFi System Config Backup." },
      { application: "UID", status: "cloud_service", contents: "Cloud identity data is not exported by the Network connector." },
    ],
    restoreNotes: [
      "This is a complete API-readable DR evidence backup for the remote pull, not a vendor-native UniFi .unf restore file.",
      "Use it to rebuild inventory, VLAN/Wi-Fi/firewall documentation, compare future pulls, and support manual restoration if a native controller backup is unavailable.",
      "For bare-metal controller restore, also retain native UniFi OS / Network Application backups when the controller exposes them.",
    ],
    endpoints: [
      capturedEndpoint("integration/v1/sites", "Network application site list visible to this API key.", args.networkSites),
      capturedEndpoint(`integration/v1/sites/${siteId}/devices`, "Network application device inventory.", args.devices),
      capturedEndpoint(`integration/v1/sites/${siteId}/devices/{id}`, "Per-device detail payloads for infrastructure devices.", args.deviceDetails),
      capturedEndpoint(`integration/v1/sites/${siteId}/clients`, "Network application connected client inventory.", args.clients),
      capturedEndpoint(`integration/v1/sites/${siteId}/networks`, "Network/VLAN objects exposed by the connector.", args.networks),
      capturedEndpoint(`integration/v1/sites/${siteId}/wifi/broadcasts`, "Wi-Fi broadcast/SSID objects exposed by the connector.", args.wifiBroadcasts),
      capturedEndpoint(`integration/v1/sites/${siteId}/firewall/zones`, "Firewall zone objects exposed by the connector.", args.firewallZones),
      capturedEndpoint(`integration/v1/sites/${siteId}/firewall/policies`, "Firewall policy objects exposed by the connector.", args.firewallPolicies),
      capturedEndpoint(`integration/v1/sites/${siteId}/acl-rules`, "ACL rule objects exposed by the connector.", args.aclRules),
      capturedEndpoint(`integration/v1/sites/${siteId}/wans`, "WAN objects exposed by the connector.", args.wans),
      capturedEndpoint(`network/api/s/${siteRef}/stat/device`, "Legacy Network API raw device records.", args.legacyDevices),
      capturedEndpoint(`network/api/s/${siteRef}/stat/sta`, "Legacy Network API connected client records.", args.legacyClients),
      capturedEndpoint(`network/api/s/${siteRef}/stat/alluser`, "Legacy Network API retained client/user records.", args.legacyAllUsers),
      capturedEndpoint("/v1/devices", "Cross-application UniFi inventory used to associate Talk phone names with Network clients.", args.applicationDevices),
      capturedEndpoint(`network/api/s/${siteRef}/get/setting/ips`, "Legacy Network API intrusion detection/prevention settings.", args.intrusionSettings),
      capturedEndpoint(`network/api/s/${siteRef}/stat/ips/event`, "Legacy Network API retained IDS/IPS threat events.", args.intrusionEvents),
      ...(args.endpointErrors || []),
    ],
    payloads: {
      networkSites: args.networkSites,
      selectedSite: args.site,
      devices: args.devices,
      deviceDetails: args.deviceDetails,
      clients: args.clients,
      networks: args.networks,
      wifiBroadcasts: args.wifiBroadcasts,
      firewallZones: args.firewallZones,
      firewallPolicies: args.firewallPolicies,
      aclRules: args.aclRules,
      wans: args.wans,
      legacyDevices: args.legacyDevices,
      legacyClients: args.legacyClients,
      legacyAllUsers: args.legacyAllUsers,
      applicationDevices: args.applicationDevices,
      intrusionSettings: args.intrusionSettings,
      intrusionEvents: args.intrusionEvents,
    },
  }
}

function buildSiteManagerDrBackup(args: {
  request: SnapshotRequest
  hosts: UiHost[]
  sites: UiSite[]
  selectedSite: UiSite | null
  selectedHost: UiHost | null
  devices: UiDevice[]
}) {
  return {
    version: 1,
    kind: "unifi-site-manager-dr-backup",
    generatedAt: new Date().toISOString(),
    generatedBy: "GSV Portal Network Atlas pull",
    client: {
      id: cleanText(args.request.clientId),
      name: cleanText(args.request.clientName),
    },
    console: {
      hostId: cleanText(args.selectedHost?.id || args.selectedSite?.hostId),
      controllerUrl: "https://unifi.ui.com",
    },
    site: args.selectedSite,
    applicationCoverage: [
      { application: "Network", status: "inventory_only", contents: "Site Manager inventory captured; detailed Network connector data was unavailable." },
      { application: "Protect", status: "system_config_backup_required", contents: "Application and device configuration requires the UniFi System Config Backup; video recordings remain on-console." },
      { application: "Access", status: "system_config_backup_required", contents: "Application, device, user, and policy configuration requires the UniFi System Config Backup." },
      { application: "Talk", status: "system_config_backup_required", contents: "Application and device configuration requires the UniFi System Config Backup." },
      { application: "Connect", status: "system_config_backup_required", contents: "Application and device configuration requires the UniFi System Config Backup." },
      { application: "UID", status: "cloud_service", contents: "Cloud identity data is not exported by Site Manager inventory." },
    ],
    restoreNotes: [
      "This fallback backup contains Site Manager inventory only because the detailed Network connector was unavailable.",
      "It is not sufficient for full Network Application DR. Fix connector access and pull again to capture VLAN, Wi-Fi, firewall, port, and client objects.",
      "For bare-metal controller restore, also retain native UniFi OS / Network Application backups when the controller exposes them.",
    ],
    endpoints: [
      capturedEndpoint("/v1/hosts", "UniFi Site Manager host list.", args.hosts),
      capturedEndpoint("/v1/sites", "UniFi Site Manager site list.", args.sites),
      capturedEndpoint("/v1/devices", "UniFi Site Manager device groups for the selected host.", args.devices),
    ],
    payloads: {
      hosts: args.hosts,
      sites: args.sites,
      selectedSite: args.selectedSite,
      selectedHost: args.selectedHost,
      devices: args.devices,
    },
  }
}

function deviceName(device: JsonRecord) {
  return (
    firstText(device, ["name", "displayName", "hostname", "model", "shortname"]) ||
    cleanText(device.macAddress || device.mac || device.id) ||
    "UniFi device"
  )
}

function deviceModel(device: JsonRecord) {
  return firstText(device, ["model", "modelName", "shortname", "productName", "type"]) || "Unknown"
}

function displayDeviceModel(value: unknown) {
  const raw = cleanText(value)
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (compact === "UDMPRO" || compact === "UDMP") return "UDM Pro"
  if (compact === "UDMSE") return "UDM-SE"
  if (compact === "US48PRO") return "USW Pro 48 PoE"
  if (compact === "USLP8P") return "USW Pro 8 PoE"
  if (compact === "UAPA6AE") return "U7 Pro XG"
  return raw || "Unknown"
}

function deviceIp(device: JsonRecord) {
  return firstText(device, ["ipAddress", "ip", "address", "managementIpAddress", "gatewayIp"]) || "-"
}

function deviceMac(device: JsonRecord) {
  return firstText(device, ["macAddress", "mac", "hardwareId"]) || "-"
}

function deviceVersion(device: JsonRecord) {
  return firstText(device, ["version", "firmwareVersion", "applicationVersion", "softwareVersion"]) || "-"
}

function portCollections(device: JsonRecord) {
  const interfaces = asRecord(device.interfaces)
  const detailsInterfaces = asRecord(asRecord(device.details).interfaces)
  const candidates = [
    device.ports,
    device.interfaces,
    interfaces.ports,
    device.networkPorts,
    device.switchPorts,
    device.ethernetPorts,
    asRecord(device.details).ports,
    detailsInterfaces.ports,
    asRecord(device.portTable).ports,
  ]
  return candidates.flatMap((candidate) => asArray(candidate).map(asRecord))
}

function formatPortNumber(port: JsonRecord) {
  return firstText(port, ["idx", "index", "port", "portNumber", "portIdx", "port_idx", "number", "name", "id"]) || "-"
}

function formatPortStatus(port: JsonRecord) {
  const enabled = port.enabled
  const up = port.up ?? port.connected ?? port.linkUp ?? port.isUp
  if (enabled === false) return "Disabled"
  if (up === true) return "Active"
  if (up === false) return "Down"
  return firstText(port, ["status", "state", "stateName", "linkState", "linkStateDescription"]) || "-"
}

function formatPortSpeed(port: JsonRecord) {
  const speed = firstText(port, ["speed", "linkSpeed", "speedMbps", "maxSpeed", "maxSpeedMbps", "negotiatedSpeed", "speedMegabitsPerSecond"])
  if (!speed) return "-"
  if (/^\d+$/.test(speed)) {
    const mbps = Number(speed)
    if (mbps <= 0) return "-"
    if (mbps >= 10000) return `${mbps / 1000} GbE`
    if (mbps >= 1000) return `${mbps / 1000} GbE`
    return `${mbps} MbE`
  }
  return speed
}

function speedLabel(value: unknown) {
  const speed = Number(value)
  if (!Number.isFinite(speed) || speed <= 0) return ""
  if (speed >= 1000) return `${speed / 1000} GbE`
  return `${speed} MbE`
}

function frequencySummary(values: string[]) {
  const counts = new Map<string, number>()
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1))
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || null
}

function uniqueSummary(values: string[], maxItems = 2) {
  const unique = [...new Set(values.map((value) => cleanText(value)).filter(Boolean))]
  if (unique.length <= maxItems) return unique.join(" + ")
  return `${unique.slice(0, maxItems).join(" + ")} +${unique.length - maxItems} more`
}

function deviceNeedsUpdate(device: JsonRecord) {
  const status = statusText(device).toLowerCase()
  const firmware = firstText(device, ["firmwareStatus", "upgradeState", "updateStatus", "state"])
  return /update|upgrade|available|outdated|stale/i.test(`${status} ${firmware}`) && !/up.to.date/i.test(`${status} ${firmware}`)
}

function wanProviderLabel(value: string) {
  return cleanText(value)
    .replace(/\b\d+(?:\.\d+)?\s*(?:g|m)(?:b|bit|bps|be)?\b/ig, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+fiber$/i, " Fiber") || cleanText(value)
}

function wanServiceSpeed(value: string) {
  const match = cleanText(value).match(/\b(\d+(?:\.\d+)?)\s*(g|m)(?:b|bit|bps|be)?\b/i)
  if (!match) return ""
  return `${match[1]} ${match[2].toUpperCase() === "G" ? "Gb" : "Mb"}`
}

function wanSpeedTest(device: JsonRecord) {
  const result = asRecord(device["speedtest-status"] || device.speedtestStatus)
  return {
    downloadMbps: firstNumber(result, ["xput_download", "downloadMbps", "download"]),
    uploadMbps: firstNumber(result, ["xput_upload", "uploadMbps", "upload"]),
    latencyMs: firstNumber(result, ["latency", "latencyMs"]),
    timestamp: firstText(result, ["timestamp", "rundate"]),
  }
}

async function registeredWanProvider(ipAddress: string) {
  const ip = cleanText(ipAddress)
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) return ""
  try {
    const response = await fetch(`https://rdap.arin.net/registry/ip/${encodeURIComponent(ip)}`, {
      headers: { Accept: "application/rdap+json, application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(4500),
    })
    if (!response.ok) return ""
    const record = asRecord(await response.json())
    const registrant = asArray(record.entities).map(asRecord).find((entity) =>
      asArray(entity.roles).some((role) => cleanText(role).toLowerCase() === "registrant"),
    )
    const vcard = asArray(registrant?.vcardArray)
    const properties = Array.isArray(vcard[1]) ? vcard[1] as unknown[] : []
    const registeredName = properties
      .map((property) => Array.isArray(property) ? property : [])
      .find((property) => cleanText(property[0]).toLowerCase() === "fn")?.[3]
    const raw = cleanText(registeredName) || firstText(record, ["name", "handle"])
    if (/wave broadband|astound/i.test(raw)) return "Astound Broadband"
    return raw
  } catch {
    return ""
  }
}

function portSpeedMbpsLabel(value: string) {
  const match = cleanText(value).match(/([0-9]+(?:\.[0-9]+)?)\s*(GbE|MbE|Gbps|Mbps)/i)
  if (!match) return ""
  return `${match[1]} ${/^g/i.test(match[2]) ? "GbE" : "MbE"}`
}

function formatPortPurpose(port: JsonRecord, devicesByMac: Map<string, JsonRecord>, clientsByMac: Map<string, JsonRecord>) {
  const direct = firstText(port, ["name", "label", "profileName", "nativeNetworkName", "operationMode", "purpose"])
  const mac = normalizeMac(firstText(port, ["connectedDeviceMac", "uplinkDeviceMac", "macAddress", "neighborMac", "lldpChassisId"]))
  const client = mac ? clientsByMac.get(mac) : null
  const device = mac ? devicesByMac.get(mac) : null
  return device ? deviceName(device) : client ? clientName(client) : direct || "-"
}

function formatPortAddress(port: JsonRecord) {
  return firstText(port, ["ipAddress", "connectedDeviceIp", "neighborIp", "address", "ip"]) || "-"
}

function formatPortPower(port: JsonRecord) {
  const poe = asRecord(port.poe)
  const portPoe = asRecord(port.port_poe)
  const poeMode = firstText(port, ["poeMode", "poeStatus", "poeState", "poe_mode", "poe_class"]) || firstText(poe, ["state", "standard"]) || firstText(portPoe, ["mode", "state", "poe_mode"])
  const power = firstText(port, ["poePower", "poePowerWatts", "poe_power", "power", "powerWatts"]) || firstText(portPoe, ["power", "poe_power"])
  const enabled = port.poe_enable ?? poe.enabled ?? portPoe.enabled
  if (poeMode && power) return `${poeMode} - ${power} W`
  if (enabled === true && poeMode) return `PoE ${poeMode}`
  if (enabled === true) return "PoE enabled"
  if (enabled === false) return "PoE off"
  return poeMode || (power ? `${power} W` : "-")
}

function deviceUplinkId(device: JsonRecord) {
  return firstText(asRecord(device.uplink), ["deviceId", "id"]) || firstText(device, ["uplinkDeviceId", "connectedDeviceId"])
}

function displayPortLabel(device: JsonRecord, port: JsonRecord) {
  const portNumber = formatPortNumber(port)
  return `${deviceName(device)} / ${portNumber}`
}

function normalizeMac(value: unknown) {
  return cleanText(value).toLowerCase().replace(/[^a-f0-9]/g, "")
}

function portKey(mac: unknown, port: unknown) {
  const normalizedMac = normalizeMac(mac)
  const portNumber = cleanText(port)
  return normalizedMac && portNumber ? `${normalizedMac}:${portNumber}` : ""
}

function clientName(client: JsonRecord) {
  return firstText(client, ["name", "displayName", "hostname", "hostName", "userName"]) || firstText(client, ["macAddress", "mac", "id"]) || "Client"
}

function clientAddress(client: JsonRecord) {
  return firstText(client, ["ipAddress", "ip", "address", "lastIpAddress"]) || "-"
}

function namedTalkApplicationDevices(devices: UiDevice[]) {
  return devices.filter((device) => {
    const productLine = cleanText(device.productLine).toLowerCase()
    const model = cleanText(device.model || device.shortname).toLowerCase()
    return productLine === "talk" || productLine.includes("unifi talk") || /\butp[-_ ]?g\d+\b/.test(model)
  })
}

function associateTalkNamesWithNetworkClients(clients: JsonRecord[], applicationDevices: UiDevice[]) {
  const talkDevices = namedTalkApplicationDevices(applicationDevices)
  if (!talkDevices.length || !clients.length) return clients
  const byMac = new Map<string, UiDevice>()
  const byIp = new Map<string, UiDevice>()
  talkDevices.forEach((device) => {
    const mac = normalizeMac(device.mac || device.id)
    const ip = cleanText(device.ip)
    if (mac) byMac.set(mac, device)
    if (ip) byIp.set(ip, device)
  })
  return clients.map((client) => {
    const mac = normalizeMac(firstText(client, ["macAddress", "mac", "clientMac", "hwaddr"]))
    const ip = clientAddress(client)
    const talkDevice = (mac ? byMac.get(mac) : undefined) || (ip !== "-" ? byIp.get(ip) : undefined)
    const talkName = cleanText(talkDevice?.name)
    if (!talkDevice || !talkName) return client
    return {
      ...client,
      name: talkName,
      displayName: talkName,
      hostname: talkName,
      talkDeviceName: talkName,
      productLine: cleanText(talkDevice.productLine) || "Talk",
      model: cleanText(talkDevice.model || talkDevice.shortname) || firstText(client, ["model", "deviceModel", "dev_id", "product"]),
      manufacturer: firstText(client, ["manufacturer", "vendor", "oui", "dev_vendor", "deviceVendor"]) || "Ubiquiti",
      deviceCategory: "UniFi Talk Phone",
      applicationSource: "UniFi Talk",
    }
  })
}

type ResolvedClientParent = {
  device: JsonRecord | null
  port: string
  remappedFromInfrastructureUplink: boolean
}

function downstreamDeviceOnPort(parent: JsonRecord, port: string, devicesByMac: Map<string, JsonRecord>) {
  if (!port) return null
  const downlink = asArray(parent.downlink_table).map(asRecord).find((row) => (
    firstText(row, ["port_idx", "portIdx", "port", "portNumber"]) === port
  ))
  if (!downlink) return null
  const childMac = normalizeMac(firstText(downlink, ["mac", "macAddress", "deviceMac"]))
  return childMac ? devicesByMac.get(childMac) || null : null
}

function resolveClientParent(client: JsonRecord, devicesById: Map<string, JsonRecord>, devicesByMac: Map<string, JsonRecord>): ResolvedClientParent {
  const port = firstText(client, ["sw_port", "last_uplink_remote_port", "switchPort"])
  const preferredMacs = [
    firstText(client, ["sw_mac"]),
    firstText(client, ["last_uplink_mac"]),
    firstText(client, ["switchMacAddress"]),
  ].map(normalizeMac).filter(Boolean)
  const fallbackMacs = [
    firstText(client, ["connectedDeviceMac"]),
    firstText(client, ["uplinkDeviceMac"]),
    firstText(client, ["apMacAddress"]),
  ].map(normalizeMac).filter(Boolean)
  const preferredIds = [
    firstText(client, ["switchDeviceId"]),
    firstText(client, ["apDeviceId"]),
    firstText(client, ["connectedDeviceId"]),
    firstText(client, ["uplinkDeviceId"]),
  ].filter(Boolean)
  const candidates = [
    ...preferredMacs.map((mac) => devicesByMac.get(mac)),
    ...preferredIds.map((id) => devicesById.get(id)),
    ...fallbackMacs.map((mac) => devicesByMac.get(mac)),
  ].filter((device): device is JsonRecord => Boolean(device))
  const physicalParent = candidates.find((device) => productKind(device) !== "Gateway") || candidates[0] || null
  if (!physicalParent) return { device: null, port, remappedFromInfrastructureUplink: false }

  // A gateway port whose downlink table points at a switch is an infrastructure
  // uplink. It cannot simultaneously be the endpoint's physical attachment.
  if (productKind(physicalParent) === "Gateway") {
    const downstream = downstreamDeviceOnPort(physicalParent, port, devicesByMac)
    if (downstream && productKind(downstream) !== "Gateway") {
      return { device: downstream, port: "", remappedFromInfrastructureUplink: true }
    }
  }

  return { device: physicalParent, port, remappedFromInfrastructureUplink: false }
}

function clientAssociation(client: JsonRecord, devicesById: Map<string, JsonRecord>, devicesByMac: Map<string, JsonRecord>) {
  const uplinkName = firstText(client, ["last_uplink_name"])
  const network = firstText(client, ["networkName", "ssid", "wifiName", "vlanName"])
  const parent = resolveClientParent(client, devicesById, devicesByMac)
  if (client.is_wired === true || parent.port) {
    return compactList([
      parent.device
        ? `${deviceName(parent.device)}${parent.port ? ` port ${parent.port}` : ""}`
        : uplinkName
          ? `${uplinkName}${parent.port ? ` port ${parent.port}` : ""}`
          : "",
      network,
    ]) || "-"
  }
  if (uplinkName) return compactList([uplinkName, network])
  return [parent.device ? deviceName(parent.device) : "", network].filter(Boolean).join(" - ") || "-"
}

function clientStatus(client: JsonRecord) {
  const rate = firstText(client, ["wired_rate_mbps"])
  const connection = client.is_wired === true ? "Wired" : client.is_wired === false ? "Wireless" : ""
  return compactList([
    firstText(client, ["state", "status", "connectionState"]) || (client.connected === true ? "Connected" : client.connected === false ? "Disconnected" : connection),
    rate ? `${rate} Mbps` : "",
  ]) || "-"
}

function currentConnectedClients(clients: JsonRecord[]) {
  const currentByIdentity = new Map<string, JsonRecord>()
  clients.forEach((client, index) => {
    const status = firstText(client, ["state", "status", "connectionState"]).toLowerCase()
    if (client.connected === false || /disconnected|offline|inactive/.test(status)) return

    const mac = normalizeMac(firstText(client, ["macAddress", "mac", "clientMac", "hwaddr"]))
    const address = clientAddress(client)
    const id = firstText(client, ["id", "_id"])
    const identity = mac
      ? `mac:${mac}`
      : id
        ? `id:${id}`
        : address && address !== "-"
          ? `ip:${address}`
          : `row:${index}`
    currentByIdentity.set(identity, client)
  })
  return [...currentByIdentity.values()]
}

function networkName(network: JsonRecord) {
  return firstText(network, ["name", "purpose", "id"]) || "Network"
}

function networkSubnet(network: JsonRecord) {
  const vlan = firstText(network, ["vlanId"])
  const management = firstText(network, ["management"])
  return firstText(network, ["subnet", "ipSubnet", "cidr", "dhcpRange", "gatewayIp"]) || compactList([
    vlan ? `VLAN ${vlan}` : "",
    management ? `Management ${management}` : "",
    network.enabled === false ? "Disabled" : "Enabled",
  ]) || "-"
}

function wifiBroadcastName(broadcast: JsonRecord) {
  return firstText(broadcast, ["name", "ssid", "wifiName"]) || "Wi-Fi broadcast"
}

function wifiBroadcastBands(broadcast: JsonRecord) {
  const bands = broadcast.bands || broadcast.radioBands || broadcast.radios || broadcast.broadcastingFrequenciesGHz
  if (Array.isArray(bands)) return compactList(bands)
  return firstText(broadcast, ["bands", "radioBands", "band"]) || "-"
}

function mergeDeviceInventories(primaryDevices: JsonRecord[], legacyDevices: JsonRecord[]) {
  if (!legacyDevices.length) return primaryDevices
  const mergedByMac = new Map<string, JsonRecord>()

  primaryDevices.forEach((device) => {
    const mac = normalizeMac(deviceMac(device))
    if (mac) mergedByMac.set(mac, { ...device })
  })

  legacyDevices.forEach((legacyDevice) => {
    const mac = normalizeMac(deviceMac(legacyDevice))
    if (!mac) return
    const primary = mergedByMac.get(mac) || {}
    mergedByMac.set(mac, { ...legacyDevice, ...primary, ...legacyDevice })
  })

  const primaryMacs = new Set(primaryDevices.map((device) => normalizeMac(deviceMac(device))).filter(Boolean))
  const merged = primaryDevices.map((device) => {
    const mac = normalizeMac(deviceMac(device))
    return mac ? mergedByMac.get(mac) || device : device
  })
  legacyDevices.forEach((legacyDevice) => {
    const mac = normalizeMac(deviceMac(legacyDevice))
    if (mac && !primaryMacs.has(mac)) merged.push(legacyDevice)
  })

  return merged
}

function buildLegacyPortMaps(legacyDevices: JsonRecord[], legacyClients: JsonRecord[]) {
  const devicesByMac = new Map<string, JsonRecord>()
  const clientsByPort = new Map<string, JsonRecord[]>()
  const downlinksByPort = new Map<string, JsonRecord>()

  legacyDevices.forEach((device) => {
    const mac = normalizeMac(deviceMac(device))
    if (mac) devicesByMac.set(mac, device)
  })

  legacyClients.forEach((client) => {
    const key = portKey(firstText(client, ["sw_mac", "last_uplink_mac"]), firstText(client, ["sw_port", "last_uplink_remote_port"]))
    if (!key) return
    clientsByPort.set(key, [...(clientsByPort.get(key) || []), client])
  })

  legacyDevices.forEach((device) => {
    const parentMac = deviceMac(device)
    asArray(device.downlink_table).map(asRecord).forEach((downlink) => {
      const key = portKey(parentMac, firstText(downlink, ["port_idx", "portIdx", "port"]))
      const downlinkMac = normalizeMac(firstText(downlink, ["mac", "macAddress"]))
      const downlinkDevice = downlinkMac ? devicesByMac.get(downlinkMac) : null
      if (key) downlinksByPort.set(key, downlinkDevice ? { ...downlink, ...downlinkDevice } : downlink)
    })
  })

  return { devicesByMac, clientsByPort, downlinksByPort }
}

function formatPortClientSummary(clients: JsonRecord[]) {
  if (!clients.length) return ""
  const names = clients.slice(0, 3).map(clientName).filter(Boolean)
  return `${names.join(", ")}${clients.length > names.length ? ` (+${clients.length - names.length} more)` : ""}`
}

function formatLegacyPortPurpose(device: JsonRecord, port: JsonRecord, maps: ReturnType<typeof buildLegacyPortMaps>) {
  const key = portKey(deviceMac(device), firstText(port, ["port_idx", "portIdx", "port", "portNumber"]))
  const downlink = key ? maps.downlinksByPort.get(key) : null
  if (downlink) return `Downlink: ${deviceName(downlink)}`
  const portClients = key ? maps.clientsByPort.get(key) || [] : []
  if (portClients.length) return formatPortClientSummary(portClients)
  return compactList([
    firstText(port, ["network_name", "native_network_name", "profileName"]),
    firstText(port, ["op_mode", "type"]),
  ]) || "-"
}

function formatLegacyPortAddress(device: JsonRecord, port: JsonRecord, maps: ReturnType<typeof buildLegacyPortMaps>) {
  const key = portKey(deviceMac(device), firstText(port, ["port_idx", "portIdx", "port", "portNumber"]))
  const downlink = key ? maps.downlinksByPort.get(key) : null
  if (downlink) return deviceIp(downlink) !== "-" ? deviceIp(downlink) : deviceMac(downlink)
  const portClients = key ? maps.clientsByPort.get(key) || [] : []
  if (portClients.length === 1) return clientAddress(portClients[0])
  if (portClients.length > 1) return `${portClients.length} clients`
  return formatPortAddress(port)
}

function legacyPortRows(legacyDevices: JsonRecord[], legacyClients: JsonRecord[]) {
  const maps = buildLegacyPortMaps(legacyDevices, legacyClients)
  return legacyDevices
    .filter((device) => ["Gateway", "Switch"].includes(productKind(device)) && asArray(device.port_table).length)
    .flatMap((device) => asArray(device.port_table).map(asRecord).map((port) => [
      `${deviceName(device)} / ${firstText(port, ["name"]) || `Port ${formatPortNumber(port)}`}`,
      formatPortStatus(port),
      formatPortSpeed(port),
      formatLegacyPortPurpose(device, port, maps),
      formatLegacyPortAddress(device, port, maps),
      formatPortPower(port),
    ]))
}

function networkOverviewMetrics(args: {
  gateways: Array<{ title?: string }>
  aps: Array<{ title?: string }>
  detailedDevices: JsonRecord[]
  effectiveClients: JsonRecord[]
  wans: JsonRecord[]
}) {
  const { gateways, aps, detailedDevices, effectiveClients, wans } = args
  const gatewayDevice = detailedDevices.find((device) => productKind(device) === "Gateway")
  const switches = detailedDevices.filter((device) => productKind(device) === "Switch")
  const accessPoints = detailedDevices.filter((device) => productKind(device) === "Access Point")
  const gatewayModel = deviceModel(gatewayDevice || {}) !== "Unknown" ? displayDeviceModel(deviceModel(gatewayDevice || {})) : gateways[0]?.title || "Not detected"
  const gatewayVersion = deviceVersion(gatewayDevice || {})
  const networkVersion = firstText(gatewayDevice || {}, ["networkVersion", "network_version", "networkApplicationVersion"])
  const gatewayDetail = [
    gatewayModel !== "Not detected" ? `Model: ${gatewayModel}` : "",
    networkVersion ? `UniFi Network ${networkVersion}` : "",
    gatewayVersion !== "-" ? `UniFi OS ${gatewayVersion.split(".").slice(0, 3).join(".")}` : "",
  ].filter(Boolean).join(" | ") || "Network API pull"

  const wan1 = asRecord((gatewayDevice || {}).wan1)
  const primaryWan = wans[0] || {}
  const providerRaw = firstText(gatewayDevice || {}, ["detectedIspName"]) || firstText(primaryWan, ["ispName", "provider"]) || firstText(wan1, ["ispName", "provider"]) || firstText(primaryWan, ["name"]) || "Internet"
  const provider = wanProviderLabel(providerRaw)
  const serviceSpeed = wanServiceSpeed(providerRaw) || firstText(primaryWan, ["serviceSpeed", "serviceSpeedMbps", "speedMbps", "planSpeed", "downloadSpeed"])
  const wanLinkSpeed = speedLabel(firstText(wan1, ["speed", "max_speed"])) || firstText(primaryWan, ["linkSpeed"])
  const speedTest = wanSpeedTest(gatewayDevice || {})
  const measuredSpeed = speedTest.downloadMbps
    ? `${Math.round(speedTest.downloadMbps)} Mbps down${speedTest.uploadMbps ? ` / ${Math.round(speedTest.uploadMbps)} Mbps up` : ""}`
    : ""
  const internetTitle = provider !== "Internet" ? provider : serviceSpeed || "WAN"
  const wanLatency = speedTest.latencyMs || firstText(wan1, ["latency"]) || firstText(primaryWan, ["latency", "avgLatency"])
  const internetDetail = [
    provider !== "Internet" ? `Provider: ${provider}` : "",
    serviceSpeed ? `Configured service: ${serviceSpeed}` : "",
    measuredSpeed ? `Measured: ${measuredSpeed}` : "",
    wanLinkSpeed ? `Ethernet link: ${wanLinkSpeed}` : "",
    wanLatency ? `${wanLatency} ms` : "",
  ].filter(Boolean).join(" | ") || "Primary WAN"

  const switchModels = switches
    .map((device) => displayDeviceModel(deviceModel(device)))
    .filter((model) => model && model !== "Unknown")
  const switchDetail = uniqueSummary(switchModels) || "Switch model data not exposed"

  const apUplinkSpeeds = accessPoints
    .map((device) => {
      const uplink = asRecord(device.uplink)
      return speedLabel(firstText(uplink, ["speed", "max_speed"])) || firstText(device, ["uplinkSpeed", "linkSpeed"])
    })
    .filter(Boolean)
  const commonApSpeed = frequencySummary(apUplinkSpeeds)
  const apModels = frequencySummary(accessPoints
    .map((device) => displayDeviceModel(deviceModel(device)))
    .filter((model) => model && model !== "Unknown"))
  const apModelDetail = apModels ? `Model: ${apModels[1] === aps.length ? "All" : apModels[1]} ${apModels[0]}` : ""
  const apSpeedDetail = commonApSpeed ? `Uplink: ${commonApSpeed[1] === aps.length ? `All at ${commonApSpeed[0]}` : `${commonApSpeed[1]} at ${commonApSpeed[0]}`}` : ""
  const apDetail = [apModelDetail, apSpeedDetail].filter(Boolean).join(" | ") || "Adopted infrastructure"

  const switchMacs = new Set(switches.map((device) => normalizeMac(deviceMac(device))).filter(Boolean))
  const coreLinkDetails: string[] = []
  const gatewayCoreSpeeds = gatewayDevice
    ? asArray((gatewayDevice as JsonRecord).downlink_table).map(asRecord).map((downlink) => {
      const childMac = normalizeMac(firstText(downlink, ["mac", "macAddress"]))
      if (!childMac || !switchMacs.has(childMac)) return ""
      const portNumber = firstText(downlink, ["port_idx", "portIdx", "port"])
      const port = asArray((gatewayDevice as JsonRecord).port_table).map(asRecord).find((row) => firstText(row, ["port_idx", "portIdx", "port"]) === portNumber)
      const childDevice = switches.find((device) => normalizeMac(deviceMac(device)) === childMac)
      const speed = speedLabel(firstNumber(port || {}, ["speed", "max_speed"]) || firstNumber(downlink, ["speed", "max_speed"]))
      if (speed) coreLinkDetails.push(`${gatewayModel} -> ${childDevice ? deviceName(childDevice) : "core switch"}: ${speed}`)
      return speed
    })
    : []
  const switchUplinkSpeeds = switches
    .map((device) => {
      const uplink = asRecord(device.uplink)
      const speed = speedLabel(firstText(uplink, ["speed", "max_speed"]))
      const parentName = firstText(device, ["uplinkDeviceName"]) || firstText(uplink, ["uplink_device_name", "deviceName", "name"])
      if (speed && parentName) coreLinkDetails.push(`${parentName} -> ${deviceName(device)}: ${speed}`)
      return speed
    })
    .filter(Boolean)
  const coreSpeedValues = [...gatewayCoreSpeeds, ...switchUplinkSpeeds].filter(Boolean)
  const coreSpeed = coreSpeedValues
    .sort((a, b) => {
      const toMbps = (value: string) => value.includes("GbE") ? Number(value.replace(/[^0-9.]/g, "")) * 1000 : Number(value.replace(/[^0-9.]/g, ""))
      return toMbps(b) - toMbps(a)
    })[0] || "Not detected"
  const coreDetail = coreSpeed !== "Not detected"
    ? (uniqueSummary(coreLinkDetails, 3) || [switchDetail, "Gateway to core switching"].filter(Boolean).join(" | "))
    : "Core link data not exposed"

  return [
    ["Gateway", gatewayModel, gatewayDetail, gatewayDevice && deviceNeedsUpdate(gatewayDevice) ? "warn" : ""],
    ["Internet", internetTitle, internetDetail],
    ["Switches", String(switches.length), switchDetail, switches.some(deviceNeedsUpdate) ? "warn" : ""],
    ["Access Points", String(aps.length), apDetail, accessPoints.some(deviceNeedsUpdate) ? "warn" : ""],
    ["Clients", String(effectiveClients.length), "Connected client inventory"],
    ["Core Links", coreSpeed, coreDetail],
  ]
}

function radioBandLabel(radio: JsonRecord) {
  const value = firstText(radio, ["frequencyGHz", "band", "radio"])
  const normalized = value.toLowerCase()
  if (normalized === "ng" || normalized.includes("2.4")) return "2.4"
  if (normalized === "na" || normalized.includes("5")) return "5"
  if (normalized === "6e" || normalized.includes("6")) return "6"
  return value || "-"
}

function preferredRadioRows(device: JsonRecord) {
  const interfaces = asRecord(device.interfaces)
  const detailsInterfaces = asRecord(asRecord(device.details).interfaces)
  const sourceRows = [
    device.radio_table,
    device.radios,
    device.radioTable,
    device.radioTableStats,
    interfaces.radios,
    asRecord(device.details).radios,
    detailsInterfaces.radios,
  ]
    .flatMap((source) => asArray(source).map(asRecord).filter((radio) => Object.keys(radio).length))
  const byBand = new Map<string, JsonRecord>()
  sourceRows.forEach((radio) => {
    const band = radioBandLabel(radio)
    if (!band) return
    const existing = byBand.get(band) || {}
    const existingChannel = firstText(existing, ["channel", "channelNumber"])
    const nextChannel = firstText(radio, ["channel", "channelNumber"])
    const shouldUseChannel = nextChannel && (!existingChannel || existingChannel.toLowerCase() === "auto" || nextChannel.toLowerCase() !== "auto")
    byBand.set(band, {
      ...existing,
      ...radio,
      channel: shouldUseChannel ? nextChannel : existingChannel || nextChannel,
      channelNumber: shouldUseChannel ? nextChannel : existingChannel || nextChannel,
      ht: firstText(existing, ["channelWidth", "width", "channelWidthMHz", "ht"]) || firstText(radio, ["channelWidth", "width", "channelWidthMHz", "ht"]),
    })
  })
  return [...byBand.entries()]
    .sort(([bandA], [bandB]) => Number(bandA) - Number(bandB))
    .map(([, radio]) => radio)
}

function buildWifiPlan(devices: JsonRecord[], clients: JsonRecord[]) {
  const clientsByApMac = new Map<string, number>()
  const clientsByUplinkId = new Map<string, number>()
  const clientsByUplinkName = new Map<string, number>()
  clients.forEach((client) => {
    if (client.is_wired === true) return
    const mac = normalizeMac(firstText(client, ["ap_mac", "apMacAddress", "last_uplink_mac", "uplinkDeviceMac", "connectedDeviceMac"]))
    if (mac) clientsByApMac.set(mac, (clientsByApMac.get(mac) || 0) + 1)
    const uplinkId = firstText(client, ["uplinkDeviceId", "connectedDeviceId", "apDeviceId", "switchDeviceId"])
    if (uplinkId) clientsByUplinkId.set(uplinkId, (clientsByUplinkId.get(uplinkId) || 0) + 1)
    const uplinkName = normalizeText(firstText(client, ["last_uplink_name", "uplinkDeviceName", "connectedDeviceName"]))
    if (uplinkName) clientsByUplinkName.set(uplinkName, (clientsByUplinkName.get(uplinkName) || 0) + 1)
  })

  return devices
    .filter((device) => productKind(device) === "Access Point")
    .map((device) => {
      const radioCandidate = preferredRadioRows(device)
      const radios = radioCandidate.length ? radioCandidate.map((radio) => {
        const band = radioBandLabel(radio)
        const channel = firstText(radio, ["channel", "channelNumber"]) || "-"
        const width = firstText(radio, ["channelWidth", "width", "channelWidthMHz", "ht"])
        const power = firstText(radio, ["txPower", "transmitPower", "power", "tx_power"]) || "Not exposed"
        const utilization = firstNumber(radio, ["utilization", "channelUtilization", "load"])
        return [band.replace(/ghz/i, "").trim() || band, channel, width ? `${width} MHz` : "-", power, utilization]
      }) : []
      const deviceId = firstText(device, ["id", "_id"])
      const uplink = asRecord(device.uplink)

      return {
        name: deviceName(device),
        port: firstText(device, ["uplinkPort", "switchPort", "port"]) || firstText(uplink, ["uplink_remote_port", "port_idx", "port"]) || "-",
        clients: reportedAssociatedClientCount(device) ?? clientsByUplinkId.get(deviceId) ?? clientsByApMac.get(normalizeMac(deviceMac(device))) ?? clientsByUplinkName.get(normalizeText(deviceName(device))) ?? 0,
        uplink: firstText(device, ["uplinkSpeed", "linkSpeed"]) || speedLabel(firstText(uplink, ["speed", "max_speed"])) || "-",
        radios,
      }
    })
    .filter((ap) => ap.radios.length)
}

function parseChannelNumber(value: unknown) {
  const text = cleanText(value).toLowerCase()
  if (!text || text === "-" || text === "auto") return 0
  const match = text.match(/\d+/)
  return match ? Number(match[0]) : 0
}

function parseWidthMhz(value: unknown) {
  const match = cleanText(value).match(/\d+/)
  return match ? Number(match[0]) : 0
}

function analyzeWifiChannelPlan(wifiPlan: ReturnType<typeof buildWifiPlan>) {
  const radioRows = wifiPlan.flatMap((ap) => ap.radios.map((radio) => ({
    apName: cleanText(ap.name) || "Access Point",
    band: cleanText(radio[0]),
    channelText: cleanText(radio[1]) || "-",
    channel: parseChannelNumber(radio[1]),
    widthText: cleanText(radio[2]) || "-",
    widthMhz: parseWidthMhz(radio[2]),
    power: cleanText(radio[3]) || "-",
    clients: Number(ap.clients || 0),
  })))
  const findings: JsonRecord[] = []
  const radiosByBand = new Map<string, typeof radioRows>()
  radioRows.forEach((radio) => {
    const band = radio.band.replace(/ghz/i, "").trim()
    if (!band) return
    const rows = radiosByBand.get(band) || []
    rows.push(radio)
    radiosByBand.set(band, rows)
  })

  for (const [band, radios] of radiosByBand.entries()) {
    const configuredRadios = radios.filter((radio) => radio.channel)
    const autoRadios = radios.filter((radio) => !radio.channel && /auto/i.test(radio.channelText))
    const byChannel = new Map<number, typeof radioRows>()
    configuredRadios.forEach((radio) => {
      const rows = byChannel.get(radio.channel) || []
      rows.push(radio)
      byChannel.set(radio.channel, rows)
    })

    for (const [channel, channelRows] of byChannel.entries()) {
      if (channelRows.length < 2) continue
      findings.push({
        severity: band === "2.4" ? "medium" : "low",
        title: `${band} GHz channel reuse detected`,
        evidence: `${channelRows.map((row) => row.apName).join(", ")} are all on channel ${channel}.`,
        recommendation: band === "2.4"
          ? "Confirm physical separation or move nearby APs to a non-overlapping 2.4 GHz plan such as 1/6/11. Prefer lowering 2.4 GHz power before widening coverage cells."
          : "Confirm these APs are far enough apart for intentional channel reuse. If they overlap physically, separate channels or reduce power before increasing width.",
        category: "wifi",
      })
    }

    if (band === "2.4") {
      const nonStandard = configuredRadios.filter((radio) => ![1, 6, 11].includes(radio.channel))
      if (nonStandard.length) {
        findings.push({
          severity: "medium",
          title: "2.4 GHz adjacent-channel risk",
          evidence: `${nonStandard.map((row) => `${row.apName} on channel ${row.channel}`).join("; ")}. Recommended 2.4 GHz channels are normally 1, 6, and 11.`,
          recommendation: "Move 2.4 GHz radios to non-overlapping channels and keep width at 20 MHz unless there is a documented reason not to.",
          category: "wifi",
        })
      }
      const wide24 = configuredRadios.filter((radio) => radio.widthMhz > 20)
      if (wide24.length) {
        findings.push({
          severity: "medium",
          title: "2.4 GHz channel width is wider than 20 MHz",
          evidence: `${wide24.map((row) => `${row.apName} is ${row.widthText}`).join("; ")}.`,
          recommendation: "Use 20 MHz on 2.4 GHz to reduce overlap and airtime contention.",
          category: "wifi",
        })
      }
    }

    if ((band === "5" || band === "6") && autoRadios.length) {
      findings.push({
        severity: "low",
        title: `${band} GHz channel is set to auto or not exposed`,
        evidence: `${autoRadios.map((row) => row.apName).join(", ")} do not expose a fixed ${band} GHz channel in the retained pull.`,
        recommendation: "Verify the live UniFi radio plan before assuming there is no overlap. For stable MSP documentation, record final channel, width, and power after tuning.",
        category: "wifi",
      })
    }
  }

  return {
    radios: radioRows,
    findings,
  }
}

function describeNetworkRef(value: unknown, maps: { networksById: Map<string, JsonRecord>, zonesById: Map<string, JsonRecord> }) {
  const row = asRecord(value)
  const direct = cleanText(value)
  if (!Object.keys(row).length) return direct || "-"
  const networkId = firstText(row, ["networkId", "id"])
  const zoneId = firstText(row, ["zoneId"])
  if (networkId && maps.networksById.has(networkId)) return networkName(maps.networksById.get(networkId) || {})
  if (zoneId && maps.zonesById.has(zoneId)) return firstText(maps.zonesById.get(zoneId) || {}, ["name", "id"])
  return compactList([
    firstText(row, ["name", "type", "address", "ipAddress", "port", "macAddress"]),
    networkId ? `Network ${networkId}` : "",
    zoneId ? `Zone ${zoneId}` : "",
  ]) || "-"
}

function topologyTone(type: string) {
  if (type === "Gateway") return "core"
  if (type === "Switch") return "core"
  if (type === "Access Point") return "wifi"
  if (type === "Camera") return "service"
  return "service"
}

function topologyDeviceId(device: JsonRecord) {
  return firstText(device, ["id", "_id"]) || normalizeMac(deviceMac(device)) || deviceName(device)
}

function gatewayWanRows(gateway: JsonRecord | undefined, wans: JsonRecord[]) {
  const rows = wans.length ? wans : [asRecord(gateway?.wan1), asRecord(gateway?.wan2)]
  return rows
    .map(asRecord)
    .filter((wan) => Object.keys(wan).length)
    .filter((wan, index) => {
      if (wan.up === false || wan.is_uplink === false || wan.enabled === false || wan.enable === false) return false
      if (index > 0 && !firstText(wan, ["ip", "ipAddress", "address"]) && !/up|online|active|connected/i.test(firstText(wan, ["status", "state"]))) return false
      return true
    })
}

function buildTopologyPlan(args: {
  siteName: string
  devices: JsonRecord[]
  clients: JsonRecord[]
  networks: JsonRecord[]
  wifiBroadcasts: JsonRecord[]
  wans: JsonRecord[]
}) {
  const { siteName, devices, clients, networks, wifiBroadcasts, wans } = args
  const ssidNames = [...new Set(wifiBroadcasts.map(wifiBroadcastName).map(cleanText).filter(Boolean))]
  const infrastructure = devices.filter((device) => ["Gateway", "Switch", "Access Point", "Camera"].includes(productKind(device)))
  const gateways = infrastructure.filter((device) => productKind(device) === "Gateway")
  const switches = infrastructure.filter((device) => productKind(device) === "Switch")
  const aps = infrastructure.filter((device) => productKind(device) === "Access Point")
  const gateway = gateways[0] || infrastructure.find((device) => /udm|gateway/i.test(`${deviceName(device)} ${deviceModel(device)}`))
  const devicesByMac = new Map<string, JsonRecord>()
  const devicesById = new Map<string, JsonRecord>()
  const devicesByName = new Map<string, JsonRecord>()
  infrastructure.forEach((device) => {
    const mac = normalizeMac(deviceMac(device))
    const id = firstText(device, ["id", "_id"])
    const name = normalizeText(deviceName(device))
    if (mac) devicesByMac.set(mac, device)
    if (id) devicesById.set(id, device)
    if (name) devicesByName.set(name, device)
  })
  const clientsByUplink = new Map<string, { wired: number; wireless: number }>()
  clients.forEach((client) => {
    const expectedKind = client.is_wired === false ? "Access Point" : client.is_wired === true ? "Switch" : ""
    if (!expectedKind) return

    // Resolve one physical parent only. AP-specific identifiers are checked
    // before generic uplink fields so a wireless station cannot be credited to
    // every AP or to the switch upstream of its AP.
    const idKeys = expectedKind === "Access Point"
      ? ["apDeviceId", "connectedDeviceId", "uplinkDeviceId"]
      : ["switchDeviceId", "connectedDeviceId", "uplinkDeviceId"]
    const macKeys = expectedKind === "Access Point"
      ? ["ap_mac", "apMacAddress", "last_uplink_mac", "connectedDeviceMac", "uplinkDeviceMac"]
      : ["sw_mac", "switchMacAddress", "last_uplink_mac", "connectedDeviceMac", "uplinkDeviceMac"]
    const nameKeys = expectedKind === "Access Point"
      ? ["apName", "last_uplink_name", "connectedDeviceName", "uplinkDeviceName"]
      : ["switchName", "last_uplink_name", "connectedDeviceName", "uplinkDeviceName"]
    const candidates = [
      ...idKeys.map((key) => devicesById.get(cleanText(client[key]))),
      ...macKeys.map((key) => devicesByMac.get(normalizeMac(cleanText(client[key])))),
      ...nameKeys.map((key) => devicesByName.get(normalizeText(cleanText(client[key])))),
    ].filter((device): device is JsonRecord => Boolean(device))
    const parent = candidates.find((device) => productKind(device) === expectedKind)
    if (!parent) return

    const parentId = topologyDeviceId(parent)
    const counts = clientsByUplink.get(parentId) || { wired: 0, wireless: 0 }
    if (client.is_wired === true) counts.wired += 1
    else counts.wireless += 1
    clientsByUplink.set(parentId, counts)
  })
  const nodes: JsonRecord[] = []
  const links: JsonRecord[] = []
  const infrastructureLinkKeys = new Set<string>()
  const nodeIds = new Set<string>()
  const addNode = (node: JsonRecord) => {
    const id = firstText(node, ["id"])
    if (!id || nodeIds.has(id)) return
    nodeIds.add(id)
    nodes.push(node)
  }
  const addInfrastructureLink = (link: JsonRecord) => {
    const from = firstText(link, ["from"])
    const to = firstText(link, ["to"])
    if (!from || !to || from === to) return
    const key = [from, to].sort().join("::")
    if (infrastructureLinkKeys.has(key)) return
    infrastructureLinkKeys.add(key)
    links.push(link)
  }
  const deviceNode = (device: JsonRecord, x: number, y: number, width = 220, height = 86) => {
    const id = topologyDeviceId(device)
    const type = productKind(device)
    const associationCounts = clientsByUplink.get(id) || { wired: 0, wireless: 0 }
    const reportedWirelessCount = type === "Access Point" ? reportedAssociatedClientCount(device) : null
    const wirelessCount = reportedWirelessCount ?? associationCounts.wireless
    const associationDetail = type === "Access Point" && wirelessCount
      ? `${wirelessCount} associated wireless client${wirelessCount === 1 ? "" : "s"}`
      : type === "Switch" && associationCounts.wired
        ? `${associationCounts.wired} directly associated wired endpoint${associationCounts.wired === 1 ? "" : "s"}`
        : ""
    addNode({
      id,
      type,
      title: deviceName(device),
      subtitle: `${displayDeviceModel(deviceModel(device))}${deviceIp(device) !== "-" ? ` - ${deviceIp(device)}` : ""}`,
      // A gateway can appear as a client's last uplink without that client being
      // physically attached to the gateway. Never present that ambiguous value
      // as a gateway connection count.
      detail: `${statusText(device)}${associationDetail ? ` - ${associationDetail}` : ""}`,
      tone: topologyTone(type),
      x,
      y,
      width,
      height,
    })
  }

  gatewayWanRows(gateway, wans).slice(0, 2).forEach((wan, index) => {
    const id = `wan-${index}`
    const speedTest = index === 0 ? wanSpeedTest(gateway || {}) : { downloadMbps: 0, uploadMbps: 0, latencyMs: 0, timestamp: "" }
    const provider = index === 0 ? firstText(gateway || {}, ["detectedIspName"]) : ""
    const measured = speedTest.downloadMbps
      ? `${Math.round(speedTest.downloadMbps)} Mbps down${speedTest.uploadMbps ? ` / ${Math.round(speedTest.uploadMbps)} Mbps up` : ""}`
      : ""
    addNode({
      id,
      type: index === 0 ? "Primary WAN" : "Secondary WAN",
      title: provider || firstText(wan, ["name", "id", "interface"]) || `WAN ${index + 1}`,
      subtitle: measured || firstText(wan, ["status", "state", "ipAddress", "address"]) || "WAN interface",
      detail: index === 0 ? ["Primary WAN", speedTest.latencyMs ? `${speedTest.latencyMs} ms` : ""].filter(Boolean).join(" · ") : "Backup/alternate WAN",
      tone: index === 0 ? "wan" : "warning",
      x: index === 0 ? 110 : 980,
      y: 52,
      width: 185,
      height: 70,
    })
    if (gateway) links.push({ from: id, to: topologyDeviceId(gateway), tone: index === 0 ? "primary" : "standby" })
  })

  if (gateway) deviceNode(gateway, 540, 202, 240, 96)
  switches.forEach((device, index) => deviceNode(device, 360 + (index % 2) * 410, 370 + Math.floor(index / 2) * 110, 250, 86))
  aps.forEach((device, index) => deviceNode(device, 65 + index * 260, 552, 210, 78))

  const phoneClients = clients.filter(isHardwiredTopologyPhone)
  phoneClients.forEach((client, index) => {
    const mac = normalizeMac(firstText(client, ["macAddress", "mac", "clientMac", "hwaddr"]))
    const id = `phone-${mac || normalizeText(clientName(client)).replace(/[^a-z0-9]+/g, "-") || index}`
    const association = clientAssociation(client, devicesById, devicesByMac)
    addNode({
      id,
      type: phoneInventoryKind(client) || "Phone",
      title: clientName(client),
      subtitle: compactList([phoneInventoryKind(client), clientAddress(client) !== "-" ? clientAddress(client) : ""]),
      detail: association !== "-" ? association : clientStatus(client),
      tone: "service",
      x: 55 + (index % 6) * 205,
      y: 670 + Math.floor(index / 6) * 92,
      width: 180,
      height: 72,
    })
    const parent = resolveClientParent(client, devicesById, devicesByMac)
    const parentId = parent.device ? topologyDeviceId(parent.device) : ""
    if (parentId && nodeIds.has(parentId)) {
      links.push({
        from: parentId,
        to: id,
        tone: "primary",
      })
    }
  })

  let usedExplicitDownlinks = false
  infrastructure.forEach((device) => {
    const parentId = topologyDeviceId(device)
    asArray(device.downlink_table).map(asRecord).forEach((downlink) => {
      const childMac = normalizeMac(firstText(downlink, ["mac", "macAddress"]))
      const childDevice = childMac ? devicesByMac.get(childMac) : null
      const childId = childDevice ? topologyDeviceId(childDevice) : ""
      if (!parentId || !childId || !nodeIds.has(parentId) || !nodeIds.has(childId)) return
      const portNumber = firstText(downlink, ["port_idx", "portIdx", "port"])
      const port = asArray(device.port_table).map(asRecord).find((row) => firstText(row, ["port_idx", "portIdx", "port"]) === portNumber)
      addInfrastructureLink({
        from: parentId,
        to: childId,
        tone: childDevice && productKind(childDevice) === "Access Point" ? "wireless" : "primary",
        label: firstText(port || {}, ["name"]) || (portNumber ? `Port ${portNumber}` : ""),
        detail: formatPortSpeed(port || downlink),
      })
      usedExplicitDownlinks = true
    })
  })

  infrastructure.forEach((device) => {
    const id = topologyDeviceId(device)
    const uplinkId = deviceUplinkId(device)
    if (!usedExplicitDownlinks && id && uplinkId && nodeIds.has(id) && nodeIds.has(uplinkId)) {
      addInfrastructureLink({ from: uplinkId, to: id, tone: productKind(device) === "Access Point" ? "wireless" : "primary" })
    } else if (!usedExplicitDownlinks && id && gateway && productKind(device) === "Switch" && id !== topologyDeviceId(gateway)) {
      addInfrastructureLink({ from: topologyDeviceId(gateway), to: id, tone: "primary" })
    }
  })

  const topologyNodeTypes = new Map(nodes.map((node) => [firstText(node, ["id"]), firstText(node, ["type"])]))
  const topologyNodesById = new Map(nodes.map((node) => [firstText(node, ["id"]), node]))
  const hasDownstreamSwitching = nodes.some((node) => firstText(node, ["type"]) === "Switch")
  const downstreamSwitchIds = new Set(
    links
      .filter((link) => topologyNodeTypes.get(firstText(link, ["from"])) === "Switch" && topologyNodeTypes.get(firstText(link, ["to"])) === "Switch")
      .map((link) => firstText(link, ["to"]))
      .filter(Boolean)
  )
  const normalizedLinks = links.filter((link) => {
    const fromType = topologyNodeTypes.get(firstText(link, ["from"]))
    const toType = topologyNodeTypes.get(firstText(link, ["to"]))
    if (fromType === "Gateway" && toType === "Switch" && downstreamSwitchIds.has(firstText(link, ["to"]))) return false
    if (hasDownstreamSwitching && fromType === "Gateway" && phoneInventoryKind(topologyNodesById.get(firstText(link, ["to"])) || {})) return false
    return true
  })

  return {
    generatedBy: "snapshot-builder",
    style: "home-atlas",
    summary: {
      title: siteName,
      lines: [
        `${clients.length} connected client${clients.length === 1 ? "" : "s"}`,
        `${networks.length} network${networks.length === 1 ? "" : "s"}`,
        `${wifiBroadcasts.length} Wi-Fi broadcast${wifiBroadcasts.length === 1 ? "" : "s"}`,
        ...ssidNames.slice(0, 4).map((ssid) => `SSID: ${ssid}`),
        ssidNames.length > 4 ? `+ ${ssidNames.length - 4} more SSID${ssidNames.length - 4 === 1 ? "" : "s"}` : "",
        "Logical inventory",
      ].filter(Boolean),
    },
    labels: [
      { text: "WAN EDGE", x: 32, y: 28 },
      { text: "CORE", x: 32, y: 178 },
      { text: "ACCESS", x: 32, y: 350 },
      { text: "PHONES", x: 32, y: 650 },
      { text: "LOGICAL NETWORKS", x: 980, y: 178 },
    ],
    nodes,
    links: normalizedLinks,
  }
}

function buildSnapshotFromNetworkApi(args: {
  request: SnapshotRequest
  hostId: string
  site: NetworkSite
  devices: JsonRecord[]
  deviceDetails: JsonRecord[]
  clients: JsonRecord[]
  legacyDevices?: JsonRecord[]
  legacyClients?: JsonRecord[]
  legacyAllUsers?: JsonRecord[]
  networks: JsonRecord[]
  wifiBroadcasts: JsonRecord[]
  firewallZones: JsonRecord[]
  firewallPolicies: JsonRecord[]
  aclRules: JsonRecord[]
  wans: JsonRecord[]
  intrusionSettings?: JsonRecord[]
  intrusionEvents?: JsonRecord[]
}) {
  const { request, hostId, site, devices, deviceDetails, clients, legacyDevices = [], legacyClients = [], legacyAllUsers = [], networks, wifiBroadcasts, firewallZones, firewallPolicies, aclRules, wans, intrusionSettings = [], intrusionEvents = [] } = args
  const capturedAt = new Date().toISOString()
  const detailedDevices = mergeDeviceInventories(deviceDetails.length ? deviceDetails : devices, legacyDevices)
  // `stat/sta` and the connector client endpoint represent the current station
  // inventory. Keep `stat/alluser` strictly for historical inventory: feeding it
  // into topology counts makes every client that ever used an AP look connected.
  const effectiveClients = currentConnectedClients(legacyClients.length ? legacyClients : clients)
  const siteName = cleanText(site.name) || cleanText(site.internalReference) || request.clientName || "UniFi Network site"
  const devicesById = new Map<string, JsonRecord>()
  const devicesByMac = new Map<string, JsonRecord>()
  const clientsByMac = new Map<string, JsonRecord>()
  const networksById = new Map<string, JsonRecord>()
  const zonesById = new Map<string, JsonRecord>()
  detailedDevices.forEach((device) => {
    const id = firstText(device, ["id", "_id"])
    const mac = normalizeMac(deviceMac(device))
    if (id) devicesById.set(id, device)
    if (mac) devicesByMac.set(mac, device)
  })
  effectiveClients.forEach((client) => {
    const mac = normalizeMac(firstText(client, ["macAddress", "mac"]))
    if (mac) clientsByMac.set(mac, client)
  })
  networks.forEach((network) => {
    const id = firstText(network, ["id"])
    if (id) networksById.set(id, network)
  })
  firewallZones.forEach((zone) => {
    const id = firstText(zone, ["id"])
    if (id) zonesById.set(id, zone)
  })
  const deviceRows = detailedDevices.map((device) => ({
    id: firstText(device, ["id", "_id"]) || deviceMac(device) || deviceName(device),
    type: productKind(device),
    title: deviceName(device),
    status: statusText(device),
    rows: compactRows([
      ["Model", deviceModel(device)],
      ["MAC", deviceMac(device)],
      ["IP", deviceIp(device)],
      ["Version", deviceVersion(device)],
      ["Firmware", firstText(device, ["firmwareStatus", "firmwareVersion", "version"]) || "-"],
      ["Uplink", firstText(device, ["uplinkDeviceName", "uplinkDeviceId", "uplinkPort"]) || "-"],
    ]),
  }))
  const gateways = deviceRows.filter((row) => row.type === "Gateway")
  const aps = deviceRows.filter((row) => row.type === "Access Point")
  const clientsByUplink = new Map<string, JsonRecord[]>()
  effectiveClients.forEach((client) => {
    const uplink = firstText(client, ["uplinkDeviceId", "connectedDeviceId", "apDeviceId", "switchDeviceId"])
    if (!uplink) return
    clientsByUplink.set(uplink, [...(clientsByUplink.get(uplink) || []), client])
  })
  const legacyPorts = legacyPortRows(legacyDevices, legacyClients)
  const ports = (legacyPorts.length ? legacyPorts : detailedDevices
    .flatMap((device) => portCollections(device).map((port) => ({ port, device })))
    .map(({ port, device }) => [
      displayPortLabel(device, port),
      formatPortStatus(port),
      formatPortSpeed(port),
      formatPortPurpose(port, devicesByMac, clientsByMac) !== "-"
        ? formatPortPurpose(port, devicesByMac, clientsByMac)
        : `${deviceName(device)} port ${formatPortNumber(port)}${clientsByUplink.get(firstText(device, ["id", "_id"]))?.length ? ` - ${clientsByUplink.get(firstText(device, ["id", "_id"]))?.length} clients on device, port not exposed` : ""}`,
      formatPortAddress(port),
      formatPortPower(port),
    ])
    .filter((row) => row[0] !== "-"))
  const clientRows = effectiveClients.map((client) => [
    clientName(client),
    clientAddress(client),
    clientAssociation(client, devicesById, devicesByMac),
    clientStatus(client),
  ])
  const retainedClientsByIdentity = new Map<string, JsonRecord>()
  ;[...legacyAllUsers, ...effectiveClients].forEach((client) => {
    const mac = normalizeMac(firstText(client, ["macAddress", "mac", "clientMac", "hwaddr"]))
    const address = clientAddress(client)
    const name = normalizeText(clientName(client))
    const identity = mac ? `mac:${mac}` : address && address !== "-" ? `ip:${address}` : name ? `name:${name}` : ""
    if (identity) retainedClientsByIdentity.set(identity, client)
  })
  const retainedClients = [...retainedClientsByIdentity.values()]
  const clientInventory = retainedClients.map((client) => ({
    name: clientName(client),
    address: clientAddress(client),
    mac: firstText(client, ["macAddress", "mac", "clientMac", "hwaddr"]),
    manufacturer: firstText(client, ["manufacturer", "vendor", "oui", "dev_vendor", "deviceVendor"]),
    model: firstText(client, ["model", "deviceModel", "dev_id", "product"]),
    category: firstText(client, ["deviceCategory", "category", "dev_cat", "type"]),
    association: clientAssociation(client, devicesById, devicesByMac),
    status: clientStatus(client),
    retained: !effectiveClients.includes(client),
  }))
  const wifiRows = wifiBroadcasts.map((broadcast) => [
    wifiBroadcastName(broadcast),
    describeNetworkRef(broadcast.network, { networksById, zonesById }),
    boolLabel(broadcast.enabled ?? broadcast.isEnabled),
    firstText(asRecord(broadcast.securityConfiguration), ["type"]) || firstText(broadcast, ["security", "securityProtocol", "authMode"]) || "-",
    wifiBroadcastBands(broadcast),
    firstText(networksById.get(firstText(asRecord(broadcast.network), ["networkId", "id"])) || {}, ["vlanId"]) || firstText(broadcast, ["vlanId", "networkId", "nativeNetworkId"]) || "-",
  ])
  const wifiPlan = buildWifiPlan(detailedDevices, effectiveClients)
  const wifiChannelAnalysis = analyzeWifiChannelPlan(wifiPlan)
  const intrusionProtection = intrusionProtectionSummary(intrusionSettings, intrusionEvents)
  const topologyPlan = buildTopologyPlan({
    siteName,
    devices: detailedDevices,
    clients: effectiveClients,
    networks,
    wifiBroadcasts,
    wans,
  })
  const securityRows = [
    [
      "Intrusion protection",
      intrusionProtection.status === "Not exposed"
        ? "Not exposed by this snapshot; verify IDS/IPS / Threat Management directly in UniFi."
        : compactList([
            intrusionProtection.status,
            intrusionProtection.mode ? `Mode ${intrusionProtection.mode}` : "",
            intrusionProtection.sensitivity ? `Sensitivity ${intrusionProtection.sensitivity}` : "",
          ]) || intrusionProtection.status,
    ],
    [
      "Intrusion events",
      intrusionProtection.status === "Not exposed"
        ? "No retained IDS/IPS event feed exposed."
        : `${intrusionProtection.recentEvents} retained IDS/IPS event${intrusionProtection.recentEvents === 1 ? "" : "s"}${intrusionProtection.eventTypes.length ? `: ${intrusionProtection.eventTypes.join(", ")}` : ""}`,
    ],
    ...networks.map((network) => [networkName(network), networkSubnet(network)]),
    ...firewallZones.map((zone) => [`Zone: ${firstText(zone, ["name", "id"]) || "Firewall zone"}`, firstText(zone, ["description", "type"]) || "-"]),
    ...firewallPolicies.map((policy) => [
      `Policy: ${firstText(policy, ["name", "id"]) || "Firewall policy"}`,
      compactList([
        firstText(policy, ["action"]),
        `From ${describeNetworkRef(policy.source, { networksById, zonesById })}`,
        `To ${describeNetworkRef(policy.destination, { networksById, zonesById })}`,
        policy.enabled === false ? "Disabled" : "Enabled",
      ]) || "-",
    ]),
    ...aclRules.map((rule) => [
      `ACL: ${firstText(rule, ["name", "id"]) || "ACL rule"}`,
      compactList([firstText(rule, ["action"]), firstText(rule, ["source"]), firstText(rule, ["destination"])]) || "-",
    ]),
  ]
  return {
    id: capturedAt,
    capturedAt,
    label: cleanText(request.label) || "Pulled UniFi Network snapshot",
    status: "current",
    changeSummary: `Pulled ${detailedDevices.length} infrastructure device${detailedDevices.length === 1 ? "" : "s"}, ${effectiveClients.length} client${effectiveClients.length === 1 ? "" : "s"}, ${networks.length} network${networks.length === 1 ? "" : "s"}, and ${wifiBroadcasts.length} Wi-Fi broadcast${wifiBroadcasts.length === 1 ? "" : "s"} from ${siteName}.`,
    atlasPath: "",
    configPath: "",
    source: "UniFi Network API via Site Manager connector",
    details: {
      subtitle: siteName,
      summary: `Live remote pull through UniFi Site Manager connector for console ${hostId}.`,
      topologyMode: "pulled",
      controller: gateways[0]?.title || "UniFi Network",
      controllerUrl: unifiNetworkUrl(hostId, site),
      metrics: networkOverviewMetrics({ gateways, aps, detailedDevices, effectiveClients, wans }),
      nodes: deviceRows,
      topologyNodes: deviceRows,
      topologyPlan,
      ports,
      clients: clientRows,
      clientInventory,
      wifi: wifiRows,
      networkInventory: networks.map((network) => ({
        name: networkName(network),
        vlanId: firstText(network, ["vlanId", "vlan"]),
        subnet: networkSubnet(network),
      })),
      wifiPlan,
      wifiChannelAnalysis,
      wifiChannelFindings: wifiChannelAnalysis.findings,
      intrusionProtection,
      security: securityRows,
      runbook: [
        ["Snapshot pull", "If this fails, verify the Site Manager API key, console host ID, Network application version, and that remote access is enabled."],
        ["Client inventory", "Use the Clients tab for currently connected endpoints captured at this snapshot time."],
        ["Port map", ports.length ? "Review active switch ports and PoE details from the retained snapshot." : "Port details were not exposed in this API response; use device detail payloads or exported config if needed."],
        ["Wi-Fi changes", wifiRows.length ? "Compare Wi-Fi broadcasts and AP radio details between snapshots before changing channels or power." : "Wi-Fi broadcast details were not exposed in this API response."],
      ],
      runbookDetails: [
        {
          key: "snapshot-pull",
          title: "Snapshot pull",
          steps: [
            ["Confirm cloud access", "Open UniFi Site Manager and verify this console is online under the same API key owner or organization."],
            ["Confirm Network API", "Open UniFi Network > Integrations on the controller and verify the Network API is available for this application version."],
            ["Retry without enrichment", "If OpenAI enrichment fails, retain the raw network snapshot and regenerate notes later."],
          ],
        },
      ],
      rawCounts: {
        devices: detailedDevices.length,
        clients: effectiveClients.length,
        legacyDevices: legacyDevices.length,
        legacyClients: legacyClients.length,
        legacyAllUsers: legacyAllUsers.length,
        networks: networks.length,
        wifiBroadcasts: wifiBroadcasts.length,
        firewallZones: firewallZones.length,
        firewallPolicies: firewallPolicies.length,
        aclRules: aclRules.length,
        wans: wans.length,
        intrusionSettings: intrusionSettings.length,
        intrusionEvents: intrusionEvents.length,
      },
    },
  }
}

function buildSnapshotFromUniFi(args: {
  request: SnapshotRequest
  site: UiSite | null
  host: UiHost | null
  devices: UiDevice[]
}) {
  const { request, site, host, devices } = args
  const capturedAt = new Date().toISOString()
  const siteName = site?.meta?.desc || site?.meta?.name || request.clientName || "UniFi site"
  const deviceRows = devices.map((device) => {
    const kind = productKind(device)
    return {
      id: device.id || device.mac || device.name || "",
      type: kind,
      title: cleanText(device.name) || cleanText(device.model) || cleanText(device.shortname) || cleanText(device.mac) || "UniFi device",
      status: statusText(device),
      rows: compactRows([
        ["Model", cleanText(device.model) || cleanText(device.shortname) || "Unknown"],
        ["MAC", cleanText(device.mac) || "-"],
        ["IP", cleanText(device.ip) || "-"],
        ["Version", cleanText(device.version) || "-"],
        ["Firmware", cleanText(device.firmwareStatus) || "Unknown"],
      ]),
    }
  })
  const gateways = deviceRows.filter((row) => row.type === "Gateway")
  const switches = deviceRows.filter((row) => row.type === "Switch")
  const aps = deviceRows.filter((row) => row.type === "Access Point")
  const onlineCount = devices.filter((device) => /online|active|connected/i.test(cleanText(device.status))).length

  return {
    id: capturedAt,
    capturedAt,
    label: cleanText(request.label) || "Pulled UniFi snapshot",
    status: "current",
    changeSummary: `Pulled ${devices.length} UniFi infrastructure device${devices.length === 1 ? "" : "s"} from ${siteName}.`,
    atlasPath: "",
    configPath: "",
    source: "UniFi Site Manager",
    sourceLimitations: [
      "Site Manager provides remote host/site/device visibility without detailed Network Application objects.",
      "The Network Application cloud connector should be used for clients, port map, Wi-Fi, VLAN, and firewall policy data.",
    ],
    details: {
      subtitle: siteName,
      summary: `Snapshot pulled from UniFi Site Manager${host?.id ? ` host ${host.id}` : ""}.`,
      topologyMode: "pulled",
      controller: host?.type || "UniFi Site Manager",
      controllerUrl: "https://unifi.ui.com",
      metrics: [
        ["Gateway", gateways[0]?.title || "Not detected", host?.ipAddress || "Remote Site Manager"],
        ["Switches", String(switches.length), "UniFi infrastructure"],
        ["Access Points", String(aps.length), "UniFi infrastructure"],
        ["Clients", "Needs Network connector", "Live client inventory was not pulled"],
        ["Devices Online", `${onlineCount}/${devices.length}`, "Site Manager status"],
      ],
      nodes: deviceRows,
      topologyNodes: deviceRows,
      ports: [],
      clients: [],
      wifi: aps.map((ap) => [ap.title, "-", "-", "Needs Network connector", "Needs Network connector", "Needs Network connector"]),
      wifiPlan: [],
      security: [
        ["Source", "UniFi Site Manager inventory pull"],
        ["Detailed policy data", "Use the Network Application connector for VLAN, firewall and ACL rules."],
      ],
      runbook: [
        ["Remote pull failed", "Confirm the UniFi Site Manager API key is valid and the console is visible under the UI account."],
        ["Missing client list", "Use Network Application connector access for detailed live client inventory."],
        ["Missing port map", "Use Network Application connector access for switch port topology and PoE data."],
      ],
      runbookDetails: [
        {
          key: "internet",
          title: "Remote pull failed",
          steps: [
            ["Confirm cloud visibility", "Open unifi.ui.com and verify the site is online for the API key owner."],
            ["Check API key scope", "Create or rotate the Site Manager API key if the request returns unauthorized."],
            ["Check console mapping", "Set the per-client console host ID from the unifi.ui.com console URL."],
          ],
        },
      ],
      sourceLimitations: [
        "Live clients, per-port switch data, Wi-Fi channel plan, VLANs, and firewall policy need the Network Application connector.",
        "This Site Manager snapshot is still useful as a remote infrastructure inventory baseline.",
      ],
    },
  }
}

function responseText(data: JsonRecord) {
  const direct = cleanText(data.output_text)
  if (direct) return direct
  const output = Array.isArray(data.output) ? data.output : []
  return output
    .flatMap((item) => {
      const content = item && typeof item === "object" && Array.isArray((item as { content?: unknown[] }).content)
        ? (item as { content: unknown[] }).content
        : []
      return content.map((part) => {
        if (!part || typeof part !== "object") return ""
        const text = (part as { text?: unknown }).text
        return cleanText(text)
      })
    })
    .filter(Boolean)
    .join("\n")
}

async function enrichSnapshotWithOpenAI(snapshot: JsonRecord, rawContext: JsonRecord) {
  const apiKey = envValue("OPENAI_API_KEY")
  if (!apiKey || process.env.OPENAI_NETWORK_ENRICHMENT === "off") return snapshot
  const snapshotForReview = { ...snapshot }
  delete snapshotForReview.drBackup

  const model = envValue("OPENAI_NETWORK_MODEL") || "gpt-5.6-sol"
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["changeSummary", "summary", "auditSummary", "findings", "actions", "wifiAnalysis", "coverageGaps", "security", "securityPlan", "securityRecommendations", "runbook", "runbookDetails", "notes"],
    properties: {
      changeSummary: { type: "string" },
      summary: { type: "string" },
      notes: { type: "string" },
      auditSummary: {
        type: "object",
        additionalProperties: false,
        required: ["posture", "riskScore", "confidence", "executiveSummary", "strengths"],
        properties: {
          posture: { type: "string", enum: ["critical", "high-risk", "needs-improvement", "generally-sound", "insufficient-evidence"] },
          riskScore: { type: "integer", minimum: 0, maximum: 100 },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          executiveSummary: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
        },
      },
      findings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "category", "severity", "confidence", "title", "affectedAssets", "evidence", "impact", "recommendation", "verification"],
          properties: {
            id: { type: "string" },
            category: { type: "string", enum: ["security", "wifi", "performance", "reliability", "configuration", "visibility-gap"] },
            severity: { type: "string", enum: ["critical", "high", "medium", "low", "info"] },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
            title: { type: "string" },
            affectedAssets: { type: "array", maxItems: 8, items: { type: "string", maxLength: 160 } },
            evidence: { type: "array", minItems: 1, maxItems: 3, items: { type: "string", maxLength: 320 } },
            impact: { type: "string" },
            recommendation: { type: "string" },
            verification: { type: "string" },
          },
        },
      },
      actions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "priority", "title", "findingIds", "changeRisk", "steps", "verification", "rollback"],
          properties: {
            id: { type: "string" },
            priority: { type: "string", enum: ["immediate", "next-maintenance-window", "planned", "monitor"] },
            title: { type: "string" },
            findingIds: { type: "array", minItems: 1, maxItems: 2, items: { type: "string" } },
            changeRisk: { type: "string", enum: ["high", "medium", "low"] },
            steps: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", maxLength: 240 } },
            verification: { type: "string" },
            rollback: { type: "string" },
          },
        },
      },
      wifiAnalysis: {
        type: "object",
        additionalProperties: false,
        required: ["assessment", "clientHealth", "radioHealth", "limitations"],
        properties: {
          assessment: { type: "string" },
          clientHealth: { type: "string" },
          radioHealth: { type: "string" },
          limitations: { type: "array", items: { type: "string" } },
        },
      },
      coverageGaps: { type: "array", items: { type: "string" } },
      securityPlan: {
        type: "object",
        additionalProperties: false,
        required: ["title", "subtitle", "trusted", "iot", "rules"],
        properties: {
          title: { type: "string" },
          subtitle: { type: "string" },
          trusted: {
            type: "object",
            additionalProperties: false,
            required: ["title", "subtitle"],
            properties: {
              title: { type: "string" },
              subtitle: { type: "string" },
            },
          },
          iot: {
            type: "object",
            additionalProperties: false,
            required: ["title", "subtitle"],
            properties: {
              title: { type: "string" },
              subtitle: { type: "string" },
            },
          },
          rules: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "name", "note", "source", "destination", "action"],
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                note: { type: "string" },
                source: { type: "string" },
                destination: { type: "string" },
                action: { type: "string" },
              },
            },
          },
        },
      },
      securityRecommendations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["severity", "title", "evidence", "recommendation"],
          properties: {
            severity: { type: "string", enum: ["critical", "high", "medium", "low", "info"] },
            title: { type: "string" },
            evidence: { type: "string" },
            recommendation: { type: "string" },
          },
        },
      },
      security: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
          },
        },
      },
      runbook: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "detail"],
          properties: {
            title: { type: "string" },
            detail: { type: "string" },
          },
        },
      },
      runbookDetails: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["key", "title", "steps"],
          properties: {
            key: { type: "string" },
            title: { type: "string" },
            steps: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["title", "detail"],
                properties: {
                  title: { type: "string" },
                  detail: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  }

  const auditResponseId = cleanText(rawContext.auditResponseId)
  const response = await fetch(auditResponseId
    ? `https://api.openai.com/v1/responses/${encodeURIComponent(auditResponseId)}`
    : "https://api.openai.com/v1/responses", {
    method: auditResponseId ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: auditResponseId ? undefined : JSON.stringify({
      model,
      store: false,
      background: true,
      reasoning: { effort: "medium" },
      input: [
        {
          role: "developer",
          content:
            "Role: You are a senior MSP network and security auditor reviewing a point-in-time UniFi evidence package. Goal: produce a defensible technical audit and a prioritized remediation plan, not a narrative summary. Use only supplied evidence as facts. Never invent configuration, relationships, measurements, vulnerabilities, CVEs, exposure, business priorities, or migration targets. Every finding must cite one to three concise, concrete observed facts or be categorized as a visibility-gap. Do not paste inventory lists into findings. Correlate configuration with client and radio performance when those metrics exist. Distinguish a confirmed issue from a heuristic risk and from missing evidence. Security review must cover device/update posture, WAN exposure evidence, segmentation/VLANs, guest and IoT isolation, SSID authentication, firewall/ACL scope and logging, IDS/IPS mode and events, management-plane exposure, and unknown/unmanaged devices. Wi-Fi review must cover per-AP channel reuse, 2.4 GHz 1/6/11 and 20 MHz practice, 5/6 GHz width and reuse, transmit power, utilization, noise, client RSSI/signal, satisfaction, PHY rates, retries, latency, roaming, band distribution, and overloaded APs when exposed. Treat RSSI at or below -75 dBm, satisfaction below 70, retry rate above 20%, and channel utilization above 60% as investigation thresholds, not universal proof of failure. Sonos-specific findings must address Sonos behavior directly; merely mentioning a Sonos client inside broader segmentation evidence does not make the finding Sonos-related. Keep voice/VoIP, printers, cameras, and ordinary IoT out of Sonos-specific actions unless their configuration directly affects Sonos discovery, multicast, STP, or loop behavior. Do not nominate voice, a department, or any device class as a migration pilot unless supplied evidence establishes the business requirement and dependency validation. Each action must address one cohesive objective and at most two closely related finding IDs. Never combine firmware, administrator access, backups, asset inventory, endpoint patching, and switch-port cleanup into one action. Prefer several focused cards over one comprehensive card. Actions must use short imperative steps, safe sequencing, verification, change risk, and rollback. Recommend changes only when evidence supports them; otherwise prescribe the exact validation needed. A risk score measures observed risk plus material visibility gaps; explain uncertainty through confidence and coverage gaps.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Audit this network snapshot. Identify security vulnerabilities or material weaknesses supported by the evidence; Wi-Fi and client-performance problems; reliability and configuration risks; and important audit blind spots. Rank the findings, then produce implementable actions tied back to finding IDs. Preserve useful current-state documentation and runbook items for the portal.",
            snapshot: snapshotForReview,
            rawContext,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "network_snapshot_enrichment",
          strict: true,
          schema,
        },
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(auditResponseId ? 30_000 : 240_000),
  })
  const data = (await response.json().catch(() => ({}))) as JsonRecord

  if (!response.ok) {
    const error = data.error && typeof data.error === "object" ? data.error as { message?: unknown } : null
    throw new Error(cleanText(error?.message) || cleanText(data.error) || "OpenAI enrichment failed.")
  }

  const responseStatus = cleanText(data.status)
  const responseId = cleanText(data.id) || auditResponseId
  if (responseStatus === "queued" || responseStatus === "in_progress") {
    return {
      ...snapshot,
      openAiAuditResponseId: responseId,
      openAiAuditStatus: responseStatus,
      openAiModel: model,
    }
  }
  if (responseStatus && responseStatus !== "completed") {
    const responseError = data.error && typeof data.error === "object" ? data.error as { message?: unknown } : null
    throw new Error(cleanText(responseError?.message) || `OpenAI audit ended with status ${responseStatus}.`)
  }

  const parsed = JSON.parse(responseText(data) || "{}") as {
    changeSummary?: string
    summary?: string
    notes?: string
    auditSummary?: { posture: string; riskScore: number; confidence: string; executiveSummary: string; strengths: string[] }
    findings?: { id: string; category: string; severity: string; confidence: string; title: string; affectedAssets: string[]; evidence: string[]; impact: string; recommendation: string; verification: string }[]
    actions?: { id: string; priority: string; title: string; findingIds: string[]; changeRisk: string; steps: string[]; verification: string; rollback: string }[]
    wifiAnalysis?: { assessment: string; clientHealth: string; radioHealth: string; limitations: string[] }
    coverageGaps?: string[]
    securityPlan?: {
      title: string
      subtitle: string
      trusted: { title: string; subtitle: string }
      iot: { title: string; subtitle: string }
      rules: { id: string; name: string; note: string; source: string; destination: string; action: string }[]
    }
    securityRecommendations?: { severity: string; title: string; evidence: string; recommendation: string }[]
    security?: { title: string; detail: string }[]
    runbook?: { title: string; detail: string }[]
    runbookDetails?: { key: string; title: string; steps: { title: string; detail: string }[] }[]
  }
  const details = snapshot.details && typeof snapshot.details === "object" ? snapshot.details as JsonRecord : {}

  return {
    ...snapshot,
    changeSummary: parsed.changeSummary || snapshot.changeSummary,
    openAiEnriched: true,
    openAiAuditResponseId: responseId,
    openAiAuditStatus: "completed",
    openAiModel: model,
    details: {
      ...details,
      summary: parsed.summary || details.summary,
      openAiNotes: parsed.notes || "",
      auditSummary: parsed.auditSummary || null,
      auditFindings: Array.isArray(parsed.findings) ? parsed.findings : [],
      auditActions: Array.isArray(parsed.actions) ? parsed.actions : [],
      wifiAnalysis: parsed.wifiAnalysis || null,
      auditCoverageGaps: Array.isArray(parsed.coverageGaps) ? parsed.coverageGaps : [],
      securityPlan: parsed.securityPlan || details.securityPlan,
      securityRecommendations: Array.isArray(parsed.securityRecommendations) ? parsed.securityRecommendations : details.securityRecommendations,
      security: Array.isArray(parsed.security) && parsed.security.length
        ? parsed.security.map((row) => [row.title, row.detail])
        : details.security,
      runbook: Array.isArray(parsed.runbook) && parsed.runbook.length
        ? parsed.runbook.map((row) => [row.title, row.detail])
        : details.runbook,
      runbookDetails: Array.isArray(parsed.runbookDetails) && parsed.runbookDetails.length
        ? parsed.runbookDetails.map((topic) => ({
            key: topic.key || normalizeText(topic.title).replace(/\s+/g, "-") || "notes",
            title: topic.title,
            steps: topic.steps.map((step) => [step.title, step.detail]),
          }))
        : details.runbookDetails,
    },
  }
}

function demoSnapshot(request: SnapshotRequest) {
  const capturedAt = new Date().toISOString()
  return {
    id: capturedAt,
    capturedAt,
    label: cleanText(request.label) || "Pulled demo snapshot",
    status: "draft",
    changeSummary: "Demo pull generated locally. Set UNIFI_SITE_MANAGER_API_KEY to pull live remote sites.",
    atlasPath: "",
    configPath: "",
    source: "Demo UniFi pull",
    drBackup: {
      version: 1,
      kind: "demo-network-dr-backup",
      generatedAt: capturedAt,
      generatedBy: "GSV Portal Network Atlas pull",
      client: {
        id: cleanText(request.clientId),
        name: cleanText(request.clientName),
      },
      restoreNotes: [
        "Demo backup only. Configure UniFi API credentials and pull a live snapshot before relying on this for disaster recovery.",
      ],
      endpoints: [
        {
          path: "demo",
          description: "Local demo payload.",
          count: 1,
          status: "captured",
        },
      ],
      payloads: {
        demo: true,
      },
    },
    details: {
      subtitle: request.clientName || "Demo remote site",
      summary: "Local development snapshot showing the pull workflow before credentials are configured.",
      topologyMode: "pulled",
      drBackupStatus: "Demo only",
      drBackupEndpointCount: 1,
      controller: "UniFi Site Manager",
      controllerUrl: "https://unifi.ui.com",
      metrics: [
        ["Gateway", "UDM-SE", "Demo remote console"],
        ["Switches", "1", "Pulled inventory"],
        ["Access Points", "3", "Pulled inventory"],
        ["Clients", "Needs Network connector", "Live clients require Network Application connector access"],
        ["Devices Online", "5/5", "Demo status"],
      ],
      nodes: [
        { id: "demo-gateway", type: "Gateway", title: "UDM-SE", status: "online", rows: [["Model", "UDM-SE"], ["MAC", "demo"], ["IP", "10.0.0.1"], ["Version", "demo"], ["Firmware", "Up-to-date"]] },
        { id: "demo-switch", type: "Switch", title: "Core Switch", status: "online", rows: [["Model", "USW-Pro-Max"], ["MAC", "demo"], ["IP", "10.0.0.2"], ["Version", "demo"], ["Firmware", "Up-to-date"]] },
        { id: "demo-ap-1", type: "Access Point", title: "Lobby AP", status: "online", rows: [["Model", "U7 Pro"], ["MAC", "demo"], ["IP", "10.0.0.21"], ["Version", "demo"], ["Firmware", "Up-to-date"]] },
      ],
      topologyNodes: [],
      ports: [],
      clients: [["Needs Network connector", "Remote connector", "Live client inventory", "Not pulled"]],
      wifi: [],
      wifiPlan: [],
      security: [
        ["Demo source", "Set UNIFI_SITE_MANAGER_API_KEY for live Site Manager data."],
        ["Detailed config", "Use Network Application connector for VLAN, firewall and port data."],
      ],
      runbook: [
        ["Configure Site Manager API", "Create a UniFi Site Manager API key and set UNIFI_SITE_MANAGER_API_KEY."],
        ["Map client to console", "Set the per-client console host ID from the unifi.ui.com console URL."],
      ],
      runbookDetails: [
        {
          key: "internet",
          title: "Configure remote pull",
          steps: [
            ["Create the API key", "Create a UniFi Site Manager API key for the UI account that can see the client site."],
            ["Set the env vars", "Set UNIFI_SITE_MANAGER_API_KEY, the client console host ID, and the Network site reference."],
            ["Pull the snapshot", "Use Pull Snapshot from the Network tab to save a retained capture."],
          ],
        },
      ],
    },
  }
}

async function pullNetworkConnectorSnapshot(apiKey: string, hostId: string, body: SnapshotRequest, logContext?: LogContext) {
  logNetworkEvent(logContext, "unifi.connector.pull.start", {
    hostTail: safeHostTail(hostId),
    requestedSiteId: cleanText(body.siteId) || "default",
  })
  const networkSites = await networkConnectorGetAll<NetworkSite>(apiKey, hostId, "sites", logContext)
  const networkSite = pickNetworkSite(networkSites, body)
  const networkSiteId = cleanText(networkSite?.id)
  const endpointErrors: DrBackupEndpoint[] = []
  logNetworkEvent(logContext, "unifi.connector.site.selected", {
    hostTail: safeHostTail(hostId),
    siteCount: networkSites.length,
    siteIdPresent: Boolean(networkSiteId),
    siteInternalReference: cleanText(networkSite?.internalReference),
    siteName: cleanText(networkSite?.name),
  })

  if (!networkSite || !networkSiteId) {
    throw new Error("The UniFi Network connector responded, but no Network site ID was returned.")
  }

  const [
    devices,
    clients,
    networks,
    wifiBroadcasts,
    firewallZones,
    firewallPolicies,
    aclRules,
    wans,
  ] = await Promise.all([
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/devices`, logContext),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/clients`, logContext),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/networks`, logContext),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/wifi/broadcasts`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`integration/v1/sites/${networkSiteId}/wifi/broadcasts`, "Wi-Fi broadcast/SSID objects exposed by the connector.", error))
      return []
    }),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/firewall/zones`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`integration/v1/sites/${networkSiteId}/firewall/zones`, "Firewall zone objects exposed by the connector.", error))
      return []
    }),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/firewall/policies`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`integration/v1/sites/${networkSiteId}/firewall/policies`, "Firewall policy objects exposed by the connector.", error))
      return []
    }),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/acl-rules`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`integration/v1/sites/${networkSiteId}/acl-rules`, "ACL rule objects exposed by the connector.", error))
      return []
    }),
    networkConnectorGetAll<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/wans`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`integration/v1/sites/${networkSiteId}/wans`, "WAN objects exposed by the connector.", error))
      return []
    }),
  ])
  const detailTargets = devices
  const detailResults = await Promise.allSettled(
    detailTargets.map((device) => {
      const deviceId = firstText(device, ["id", "_id"])
      if (!deviceId) return Promise.resolve({ data: device } as NetworkEnvelope<JsonRecord>)
      return networkConnectorGet<JsonRecord>(apiKey, hostId, `sites/${encodeURIComponent(networkSiteId)}/devices/${encodeURIComponent(deviceId)}`, logContext)
    }),
  )
  const deviceDetails = detailResults.flatMap((result, index) => {
    if (result.status !== "fulfilled") {
      const deviceId = firstText(detailTargets[index], ["id", "_id"]) || deviceName(detailTargets[index])
      endpointErrors.push(failedEndpoint(`integration/v1/sites/${networkSiteId}/devices/${deviceId}`, "Per-device detail payload.", result.reason))
      return [detailTargets[index]]
    }
    const detailFromData = result.value.data !== undefined ? asRecord(result.value.data) : {}
    const detailFromRoot = asRecord(result.value)
    const detail = Object.keys(detailFromData).length ? detailFromData : detailFromRoot
    return [Object.keys(detail).length ? detail : detailTargets[index]]
  })
  const siteRef = networkSite.internalReference || "default"
  const [
    legacyDevicesEnvelope,
    legacyClientsEnvelope,
    legacyAllUsersEnvelope,
    intrusionSettingsEnvelope,
    intrusionEventsEnvelope,
  ] = await Promise.all([
    networkProxyGet<JsonRecord[]>(apiKey, hostId, `network/api/s/${encodeURIComponent(siteRef)}/stat/device`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`network/api/s/${siteRef}/stat/device`, "Legacy Network API raw device records.", error))
      return { data: [] as JsonRecord[] }
    }),
    networkProxyGet<JsonRecord[]>(apiKey, hostId, `network/api/s/${encodeURIComponent(siteRef)}/stat/sta`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`network/api/s/${siteRef}/stat/sta`, "Legacy Network API connected client records.", error))
      return { data: [] as JsonRecord[] }
    }),
    networkProxyGet<JsonRecord[]>(apiKey, hostId, `network/api/s/${encodeURIComponent(siteRef)}/stat/alluser`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`network/api/s/${siteRef}/stat/alluser`, "Legacy Network API retained client/user records.", error))
      return { data: [] as JsonRecord[] }
    }),
    networkProxyGet<JsonRecord[]>(apiKey, hostId, `network/api/s/${encodeURIComponent(siteRef)}/get/setting/ips`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`network/api/s/${siteRef}/get/setting/ips`, "Legacy Network API intrusion detection/prevention settings.", error))
      return { data: [] as JsonRecord[] }
    }),
    networkProxyGet<JsonRecord[]>(apiKey, hostId, `network/api/s/${encodeURIComponent(siteRef)}/stat/ips/event`, logContext).catch((error) => {
      endpointErrors.push(failedEndpoint(`network/api/s/${siteRef}/stat/ips/event`, "Legacy Network API retained IDS/IPS threat events.", error))
      return { data: [] as JsonRecord[] }
    }),
  ])
  const legacyDevices = Array.isArray(legacyDevicesEnvelope.data) ? legacyDevicesEnvelope.data : []
  const legacyClients = Array.isArray(legacyClientsEnvelope.data) ? legacyClientsEnvelope.data : []
  const legacyAllUsers = Array.isArray(legacyAllUsersEnvelope.data) ? legacyAllUsersEnvelope.data : []
  const intrusionSettings = asRecordArray(intrusionSettingsEnvelope.data)
  const intrusionEvents = asRecordArray(intrusionEventsEnvelope.data)
  const legacyGateway = legacyDevices.find((device) => productKind(device) === "Gateway" || Object.keys(asRecord(device.wan1)).length)
  if (legacyGateway) {
    const wanIp = firstText(asRecord(legacyGateway.wan1), ["ip", "ipAddress", "address"]) || firstText(legacyGateway, ["last_wan_ip"])
    const provider = await registeredWanProvider(wanIp)
    if (provider) legacyGateway.detectedIspName = provider
  }
  const applicationDeviceGroups = await uiGetAll<UiDeviceGroup>(
    apiKey,
    `/v1/devices?hostIds[]=${encodeURIComponent(hostId)}`,
    logContext,
  ).catch((error) => {
    endpointErrors.push(failedEndpoint("/v1/devices", "Cross-application UniFi inventory used to associate Talk phone names with Network clients.", error))
    return []
  })
  const applicationDevices = applicationDeviceGroups
    .filter((group) => !hostId || cleanText(group.hostId) === hostId)
    .flatMap((group) => Array.isArray(group.devices) ? group.devices : [])
  const namedClients = associateTalkNamesWithNetworkClients(clients, applicationDevices)
  const namedLegacyClients = associateTalkNamesWithNetworkClients(legacyClients, applicationDevices)
  const namedLegacyAllUsers = associateTalkNamesWithNetworkClients(legacyAllUsers, applicationDevices)
  const rawNetworksById = new Map<string, JsonRecord>()
  const rawZonesById = new Map<string, JsonRecord>()
  networks.forEach((network) => {
    const id = firstText(network, ["id"])
    if (id) rawNetworksById.set(id, network)
  })
  firewallZones.forEach((zone) => {
    const id = firstText(zone, ["id"])
    if (id) rawZonesById.set(id, zone)
  })

  const snapshot = buildSnapshotFromNetworkApi({
    request: body,
    hostId,
    site: networkSite,
    devices,
    deviceDetails,
    clients: namedClients,
    legacyDevices,
    legacyClients: namedLegacyClients,
    legacyAllUsers: namedLegacyAllUsers,
    networks,
    wifiBroadcasts,
    firewallZones,
    firewallPolicies,
    aclRules,
    wans,
    intrusionSettings,
    intrusionEvents,
  }) as JsonRecord
  snapshot.drBackup = buildNetworkDrBackup({
    request: body,
    hostId,
    site: networkSite,
    networkSites,
    devices,
    deviceDetails,
    clients: namedClients,
    legacyDevices,
    legacyClients: namedLegacyClients,
    legacyAllUsers: namedLegacyAllUsers,
    applicationDevices,
    networks,
    wifiBroadcasts,
    firewallZones,
    firewallPolicies,
    aclRules,
    wans,
    intrusionSettings,
    intrusionEvents,
    endpointErrors,
  })
  const details = snapshot.details && typeof snapshot.details === "object" ? snapshot.details as JsonRecord : {}
  snapshot.details = {
    ...details,
    drBackupStatus: endpointErrors.length ? "Captured with endpoint warnings" : "Captured",
    drBackupEndpointCount: (snapshot.drBackup as { endpoints?: unknown[] }).endpoints?.length || 0,
  }
  logNetworkEvent(logContext, "unifi.connector.pull.success", {
    hostTail: safeHostTail(hostId),
    siteId: networkSiteId,
    devices: devices.length,
    clients: clients.length,
    talkApplicationDevices: namedTalkApplicationDevices(applicationDevices).length,
    networks: networks.length,
    wifiBroadcasts: wifiBroadcasts.length,
    firewallPolicies: firewallPolicies.length,
    intrusionSettings: intrusionSettings.length,
    intrusionEvents: intrusionEvents.length,
    endpointWarnings: endpointErrors.length,
  })

  return {
    source: "UniFi Network API",
    pulledAt: new Date().toISOString(),
    site: {
      siteId: networkSiteId,
      name: networkSite.name || networkSite.internalReference || "",
      internalReference: networkSite.internalReference || "",
    },
    snapshot,
    rawContext: {
      site: networkSite,
      counts: {
        devices: devices.length,
        clients: clients.length,
        networks: networks.length,
        wifiBroadcasts: wifiBroadcasts.length,
        firewallZones: firewallZones.length,
        firewallPolicies: firewallPolicies.length,
        aclRules: aclRules.length,
        wans: wans.length,
        legacyDevices: legacyDevices.length,
        legacyClients: legacyClients.length,
        legacyAllUsers: legacyAllUsers.length,
        applicationDevices: applicationDevices.length,
        talkApplicationDevices: namedTalkApplicationDevices(applicationDevices).length,
        intrusionSettings: intrusionSettings.length,
        intrusionEvents: intrusionEvents.length,
      },
      devices: mergeDeviceInventories(devices, legacyDevices).slice(0, 80).map((device) => ({
        name: deviceName(device),
        model: deviceModel(device),
        type: productKind(device),
        status: statusText(device),
        ip: deviceIp(device),
        version: deviceVersion(device),
        firmwareStatus: firstText(device, ["firmwareStatus", "upgradeState", "updateAvailable"]),
        uptimeSeconds: optionalNumber(device, ["uptime", "uptimeSeconds"]),
        cpuUtilization: optionalNumber(device, ["cpu", "cpuUtilization", "systemStatsCpu"]),
        memoryUtilization: optionalNumber(device, ["mem", "memoryUtilization", "systemStatsMem"]),
      })),
      networks: networks.slice(0, 80).map((network) => ({
        name: networkName(network),
        subnet: networkSubnet(network),
        vlanId: firstText(network, ["vlanId", "vlan", "id"]),
        purpose: firstText(network, ["purpose", "type", "networkGroup"]),
        enabled: boolLabel(network.enabled ?? network.isEnabled),
        dhcpEnabled: boolLabel(network.dhcpEnabled ?? network.dhcpd_enabled),
      })),
      wifi: wifiBroadcasts.slice(0, 80).map((broadcast) => ({
        name: wifiBroadcastName(broadcast),
        bands: wifiBroadcastBands(broadcast),
        enabled: boolLabel(broadcast.enabled ?? broadcast.isEnabled),
        security: firstText(asRecord(broadcast.securityConfiguration), ["type", "security", "mode"]) || firstText(broadcast, ["security", "securityProtocol", "authMode"]),
        network: firstText(asRecord(broadcast.network), ["name", "networkId", "id"]) || firstText(broadcast, ["networkName", "networkId"]),
        guest: boolLabel(broadcast.guest ?? broadcast.isGuest),
        clientIsolation: boolLabel(broadcast.clientIsolation ?? broadcast.client_isolation),
        pmf: firstText(asRecord(broadcast.securityConfiguration), ["pmf", "pmfMode", "managementFrameProtection"]),
        wps: boolLabel(broadcast.wpsEnabled ?? broadcast.wps_enabled),
      })),
      firewallZones: firewallZones.slice(0, 120).map((zone) => ({
        id: firstText(zone, ["id"]),
        name: firstText(zone, ["name"]),
        type: firstText(zone, ["type"]),
        description: firstText(zone, ["description"]),
      })),
      wifiRadioPlan: asArray(asRecord(snapshot.details).wifiPlan).slice(0, 40),
      wifiChannelFindings: asArray(asRecord(snapshot.details).wifiChannelFindings).slice(0, 40),
      intrusionProtection: asRecord(asRecord(snapshot.details).intrusionProtection),
      applicationDevices: applicationDevices.slice(0, 160).map((device) => ({
        name: cleanText(device.name),
        mac: cleanText(device.mac),
        ip: cleanText(device.ip),
        model: cleanText(device.model || device.shortname),
        productLine: cleanText(device.productLine),
        status: cleanText(device.status),
      })),
      clients: namedLegacyClients.slice(0, 120).map((client) => ({
        name: clientName(client),
        ip: clientAddress(client),
        wired: client.is_wired === true ? "wired" : client.is_wired === false ? "wireless" : "unknown",
        network: firstText(client, ["network", "networkName", "last_connection_network_name", "essid"]),
        uplink: firstText(client, ["last_uplink_name", "sw_mac", "last_uplink_mac"]),
        port: firstText(client, ["sw_port", "last_uplink_remote_port"]),
        rateMbps: firstText(client, ["wired_rate_mbps"]),
        band: firstText(client, ["radio_name", "radio", "band"]),
        channel: firstText(client, ["channel"]),
        signalDbm: optionalNumber(client, ["signal", "rssi"]),
        noiseDbm: optionalNumber(client, ["noise"]),
        satisfaction: optionalNumber(client, ["satisfaction"]),
        txRateKbps: optionalNumber(client, ["tx_rate", "txRate"]),
        rxRateKbps: optionalNumber(client, ["rx_rate", "rxRate"]),
        txRetries: optionalNumber(client, ["tx_retries", "wifi_tx_retries"]),
        txAttempts: optionalNumber(client, ["wifi_tx_attempts", "tx_attempts"]),
        latencyMs: optionalNumber(client, ["latency", "latency_ms"]),
        roamCount: optionalNumber(client, ["roam_count", "roamCount"]),
        uptimeSeconds: optionalNumber(client, ["uptime", "uptimeSeconds"]),
        manufacturer: firstText(client, ["oui", "manufacturer", "vendor"]),
      })),
      sonosAudioCandidates: namedLegacyClients
        .filter((client) => /sonos|zoneplayer|play:|connect:|sonos.*port|port.*sonos|amp\b|arc\b|beam\b|sub\b/i.test(`${clientName(client)} ${firstText(client, ["oui", "manufacturer", "vendor", "hostname", "name", "dev_cat"])}`))
        .slice(0, 80)
        .map((client) => ({
          name: clientName(client),
          ip: clientAddress(client),
          wired: client.is_wired === true ? "wired" : client.is_wired === false ? "wireless" : "unknown",
          network: firstText(client, ["network", "networkName", "last_connection_network_name", "essid"]),
          uplink: firstText(client, ["last_uplink_name", "sw_mac", "last_uplink_mac"]),
          port: firstText(client, ["sw_port", "last_uplink_remote_port"]),
          rateMbps: firstText(client, ["wired_rate_mbps"]),
        })),
      ports: legacyPortRows(legacyDevices, namedLegacyClients).slice(0, 160).map((row) => ({
        port: row[0],
        state: row[1],
        speed: row[2],
        deviceOrPurpose: row[3],
        address: row[4],
        power: row[5],
      })),
      firewallPolicies: firewallPolicies.slice(0, 200).map((policy) => ({
        id: firstText(policy, ["id"]),
        name: firstText(policy, ["name", "id"]),
        action: firstText(policy, ["action"]),
        enabled: boolLabel(policy.enabled ?? policy.isEnabled),
        source: describeNetworkRef(policy.source, { networksById: rawNetworksById, zonesById: rawZonesById }),
        destination: describeNetworkRef(policy.destination, { networksById: rawNetworksById, zonesById: rawZonesById }),
        protocol: firstText(policy, ["protocol", "ipProtocol"]),
        sourcePort: firstText(policy, ["sourcePort", "source_port"]),
        destinationPort: firstText(policy, ["destinationPort", "destination_port", "port"]),
        logging: boolLabel(policy.logging ?? policy.loggingEnabled ?? policy.log),
        index: optionalNumber(policy, ["index", "order", "priority"]),
      })),
      aclRules: aclRules.slice(0, 200).map((rule) => ({
        id: firstText(rule, ["id"]),
        name: firstText(rule, ["name", "id"]),
        enabled: boolLabel(rule.enabled ?? rule.isEnabled),
        action: firstText(rule, ["action"]),
        source: firstText(rule, ["source"]),
        destination: firstText(rule, ["destination"]),
        protocol: firstText(rule, ["protocol"]),
        logging: boolLabel(rule.logging ?? rule.loggingEnabled ?? rule.log),
      })),
    },
  }
}

async function pullSiteManagerSnapshot(apiKey: string, body: SnapshotRequest, hostIdHint: string, logContext?: LogContext) {
  logNetworkEvent(logContext, "unifi.site_manager.pull.start", {
    hostHintTail: safeHostTail(hostIdHint),
  })
  const [hosts, sites] = await Promise.all([
    uiGetAll<UiHost>(apiKey, "/v1/hosts", logContext),
    uiGetAll<UiSite>(apiKey, "/v1/sites", logContext),
  ])
  const suppliedHostId = cleanText(body.hostId) || cleanText(hostIdHint)
  const suppliedHost = hosts.find((row) => cleanText(row.id) === suppliedHostId) ||
    hosts.find((row) => cleanText(row.hardwareId) === suppliedHostId) ||
    null
  const site = pickSiteForLocation(sites, body, cleanText(suppliedHost?.id)) || pickSite(sites, body)
  const hostId = cleanText(suppliedHost?.id) || cleanText(site?.hostId) || cleanText(hostIdHint) || cleanText(hosts[0]?.id)
  const host = hosts.find((row) => cleanText(row.id) === hostId) || null
  const deviceGroups = hostId
    ? await uiGetAll<UiDeviceGroup>(apiKey, `/v1/devices?hostIds[]=${encodeURIComponent(hostId)}`, logContext)
    : []
  const devices = deviceGroups
    .filter((group) => !hostId || group.hostId === hostId)
    .flatMap((group) => (Array.isArray(group.devices) ? group.devices : []))
  if (suppliedHostId && !host) {
    throw new Error("The configured UniFi Host ID does not match a console available to this API key.")
  }
  if (!devices.length) {
    throw new Error("UniFi returned no infrastructure devices for the selected site; no snapshot was saved.")
  }
  const snapshot = buildSnapshotFromUniFi({
    request: body,
    site,
    host,
    devices,
  }) as JsonRecord
  snapshot.drBackup = buildSiteManagerDrBackup({
    request: body,
    hosts,
    sites,
    selectedSite: site,
    selectedHost: host,
    devices,
  })
  const details = snapshot.details && typeof snapshot.details === "object" ? snapshot.details as JsonRecord : {}
  snapshot.details = {
    ...details,
    drBackupStatus: "Site Manager fallback captured",
    drBackupEndpointCount: (snapshot.drBackup as { endpoints?: unknown[] }).endpoints?.length || 0,
  }
  logNetworkEvent(logContext, "unifi.site_manager.pull.success", {
    hosts: hosts.length,
    sites: sites.length,
    selectedHostTail: safeHostTail(hostId),
    selectedSiteId: cleanText(site?.siteId),
    devices: devices.length,
  })

  return {
    source: "UniFi Site Manager",
    pulledAt: new Date().toISOString(),
    site: site
      ? {
          siteId: site.siteId || "",
          hostId: site.hostId || "",
          name: site.meta?.desc || site.meta?.name || "",
          permission: site.permission || "",
        }
      : null,
    host: host
      ? {
          id: host.id || "",
          type: host.type || "",
          ipAddress: host.ipAddress || "",
        }
      : null,
    snapshot,
    rawContext: {
      site,
      host,
      devices: devices.map((device) => ({
        name: device.name,
        model: device.model,
        shortname: device.shortname,
        productLine: device.productLine,
        status: device.status,
        firmwareStatus: device.firmwareStatus,
        version: device.version,
      })),
    },
  }
}

export async function POST(request: Request) {
  const id = requestId()
  let logContext: LogContext | undefined
  try {
    const cookieStore = await cookies()
    const isAuthed = await verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)

    if (!isAuthed) {
      console.info(JSON.stringify({
        event: "network_atlas_snapshot.auth.failed",
        requestId: id,
        route: "network-atlas-snapshot",
      }))
      return NextResponse.json({ error: "Portal login required." }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as SnapshotRequest
    if (body.action === "poll-audit") {
      if (!cleanText(body.auditResponseId) || !body.snapshot || typeof body.snapshot !== "object") {
        return NextResponse.json({ error: "Audit response ID and snapshot are required." }, { status: 400 })
      }
      const snapshot = await enrichSnapshotWithOpenAI(body.snapshot, {
        auditResponseId: body.auditResponseId,
      })
      return NextResponse.json({ snapshot })
    }
    const envPrefix = clientEnvPrefix(body)
    logContext = {
      requestId: id,
      route: "network-atlas-snapshot",
      clientId: cleanText(body.clientId),
      clientName: cleanText(body.clientName),
      envPrefix,
    }
    const clientApiKey = envPrefix ? envValue(`${envPrefix}_API_KEY`) : ""
    const globalApiKey = envValue("UNIFI_SITE_MANAGER_API_KEY")
    // api.ui.com (including its cloud connector) accepts the Site Manager key.
    // Console-local Network integration keys must never override this credential.
    const apiKey = globalApiKey
    const selectedApiKeyName = "UNIFI_SITE_MANAGER_API_KEY"
    const envHostId = envPrefix === "UNIFI_NETWORK_MOXIE"
      ? envValue("UNIFI_NETWORK_MOXIE_MAIN_OFFICE_HOST_ID") || envValue("UNIFI_NETWORK_MOXIE_HOST_ID")
      : envPrefix ? envValue(`${envPrefix}_HOST_ID`) : ""
    const envSiteId = envPrefix ? envValue(`${envPrefix}_SITE`) : ""
    let hostId = body.hostId || envHostId
    if (!body.siteId && envSiteId) body.siteId = envSiteId
    body.siteId = normalizedSiteReference(body.siteId)
    logNetworkEvent(logContext, "network_atlas_snapshot.request.start", {
      envApiKeyName: selectedApiKeyName,
      authMode: "site-manager-cloud-connector",
      hasApiKey: Boolean(apiKey),
      keyLength: apiKey.length,
      selectedKeyFingerprint: valueFingerprint(apiKey),
      clientKeyPresent: Boolean(clientApiKey),
      clientKeyLength: clientApiKey.length,
      clientKeyFingerprint: valueFingerprint(clientApiKey),
      clientKeyIgnoredForCloudConnector: Boolean(clientApiKey),
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
      enrichWithOpenAI: body.enrichWithOpenAI !== false,
    })

    if (!apiKey) {
      logNetworkEvent(logContext, "network_atlas_snapshot.config.missing_api_key", {
        envApiKeyName: "UNIFI_SITE_MANAGER_API_KEY",
      })
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Set UNIFI_SITE_MANAGER_API_KEY before pulling live UniFi remote-site data through api.ui.com." },
          { status: 503 },
        )
      }
      const snapshot = await enrichSnapshotWithOpenAI(demoSnapshot(body) as JsonRecord, {
        source: "demo",
        reason: "UNIFI_SITE_MANAGER_API_KEY missing",
      }).catch((error) => ({
        ...demoSnapshot(body),
        enrichmentWarning: error instanceof Error ? error.message : "OpenAI enrichment failed.",
      }))
      return NextResponse.json({
        source: "Demo",
        warning: "UNIFI_SITE_MANAGER_API_KEY is not configured. Returning a local demo snapshot.",
        snapshot,
      })
    }

    let pullResult: {
      source: string
      pulledAt: string
      site?: unknown
      host?: unknown
      snapshot: JsonRecord
      rawContext: JsonRecord
      warning?: string
    }

    const resolvedTarget = await resolveConnectorTarget(apiKey, body, hostId, logContext)
    hostId = resolvedTarget.hostId
    if (hostId) body.hostId = hostId
    if (hostId) {
      try {
        pullResult = await pullNetworkConnectorSnapshot(apiKey, hostId, body, logContext)
      } catch (error) {
        const connectorMessage = error instanceof Error ? error.message : "UniFi Network connector pull failed."
        logNetworkEvent(logContext, "unifi.connector.pull.failed", {
          error: connectorMessage,
          envApiKeyName: selectedApiKeyName,
          selectedKeyFingerprint: valueFingerprint(apiKey),
        })
        if (/not the owner of this host|access denied/i.test(connectorMessage)) {
          throw new Error(`UniFi denied detailed access to this console while the portal was using ${selectedApiKeyName}. Verify that this Vercel variable contains the Site Manager API key intended for this console. No fallback snapshot was saved.`)
        }
        let fallback: Awaited<ReturnType<typeof pullSiteManagerSnapshot>>
        try {
          fallback = await pullSiteManagerSnapshot(apiKey, body, hostId, logContext)
        } catch (fallbackError) {
          const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : "UniFi Site Manager fallback failed."
          logNetworkEvent(logContext, "unifi.site_manager.pull.failed", {
            error: fallbackMessage,
          })
          throw new Error(`Detailed UniFi Network connector pull failed: ${connectorMessage} Site Manager fallback also failed: ${fallbackMessage}`)
        }
        pullResult = {
          ...fallback,
          warning: `Detailed UniFi Network connector pull failed, so this snapshot fell back to high-level Site Manager inventory. Connector error: ${connectorMessage}`,
          snapshot: {
            ...fallback.snapshot,
            connectorWarning: connectorMessage,
          },
        }
      }
    } else {
      const fallback = await pullSiteManagerSnapshot(apiKey, body, "", logContext)
      pullResult = {
        ...fallback,
        warning: "No UniFi console host ID is configured for this client, so this snapshot used high-level Site Manager inventory.",
      }
    }

    let auditSnapshot = pullResult.snapshot
    let ninjaServerWarning = ""
    try {
      const ninjaInventory = await pullNinjaDevicesForSite(body)
      auditSnapshot = addNinjaInventoryToSnapshot(auditSnapshot, ninjaInventory)
      if (ninjaInventory.devices.length) {
        pullResult.rawContext.ninjaOneManagedDevices = ninjaInventory.devices
        pullResult.rawContext.ninjaOneSiteDevices = ninjaInventory.siteDevices
        pullResult.rawContext.ninjaOneLocationMapping = ninjaInventory.mapping
      }
    } catch (error) {
      ninjaServerWarning = error instanceof Error ? error.message : "NinjaOne server inventory failed."
    }
    auditSnapshot = ensurePhoneInventoryInTopology(auditSnapshot)

    const enrichedSnapshot = body.enrichWithOpenAI === false
      ? auditSnapshot
      : await enrichSnapshotWithOpenAI(auditSnapshot, pullResult.rawContext).catch((error) => ({
          ...auditSnapshot,
          enrichmentWarning: error instanceof Error ? error.message : "OpenAI enrichment failed.",
        }))
    const enrichedRecord = asRecord(enrichedSnapshot)
    logNetworkEvent(logContext, "network_atlas_snapshot.request.success", {
      source: pullResult.source,
      snapshotId: cleanText(enrichedRecord.id),
      warning: cleanText(pullResult.warning),
      enrichmentWarning: cleanText(enrichedRecord.enrichmentWarning),
    })

    return NextResponse.json({
      source: pullResult.source,
      pulledAt: pullResult.pulledAt,
      site: pullResult.site ?? null,
      host: pullResult.host ?? (hostId ? { id: hostId } : null),
      warning: pullResult.warning,
      ninjaServerWarning,
      snapshot: enrichedSnapshot,
    })
  } catch (error) {
    logNetworkEvent(logContext, "network_atlas_snapshot.request.failed", {
      error: error instanceof Error ? error.message : "Network Atlas pull failed.",
    })
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Network Atlas pull failed.",
      },
      { status: 500 },
    )
  }
}
