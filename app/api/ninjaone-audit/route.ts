import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyBillingSession } from "../../billing/billingAuth";

const NINJAONE_API_ROOT = "https://us2.ninjarmm.com";

type NinjaOneDevice = {
  id?: number;
  organizationId?: number;
  locationId?: number;
  nodeClass?: string;
  rolePolicyId?: number;
  nodeRoleId?: number;
  displayName?: string;
  systemName?: string;
  dnsName?: string;
  offline?: boolean;
};

type NinjaOnePolicy = {
  id?: number;
  name?: string;
};

function envValue(key: string) {
  return process.env[key]?.trim() || "";
}

async function ninjaOneToken() {
  const clientId = envValue("NINJAONE_SERVICE_CLIENT_ID") || envValue("NINJAONE_CLIENT_ID");
  const clientSecret = envValue("NINJAONE_SERVICE_CLIENT_SECRET") || envValue("NINJAONE_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Missing NinjaOne API credentials. Set NINJAONE_CLIENT_ID and NINJAONE_CLIENT_SECRET.");
  }

  const response = await fetch(`${NINJAONE_API_ROOT}/ws/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "monitoring",
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "NinjaOne authentication failed.");
  }

  return String(data.access_token);
}

async function ninjaOneGet<T>(accessToken: string, path: string) {
  const response = await fetch(`${NINJAONE_API_ROOT}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.errorMessage || data.message || data.error || `NinjaOne request failed with ${response.status}.`);
  }

  return data as T;
}

async function ninjaOneGetAll<T>(accessToken: string, path: string) {
  const rows: T[] = [];
  let after = "";

  for (let page = 0; page < 25; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const data = await ninjaOneGet<T[]>(
      accessToken,
      `${path}${separator}pageSize=500${after ? `&after=${encodeURIComponent(after)}` : ""}`,
    );
    const pageRows = Array.isArray(data) ? data : [];
    rows.push(...pageRows);
    if (pageRows.length < 500) break;
    const last = pageRows[pageRows.length - 1] as { id?: number };
    if (!last?.id) break;
    after = String(last.id);
  }

  return rows;
}

function isEndpointDevice(device: NinjaOneDevice) {
  return ["WINDOWS_WORKSTATION", "LINUX_WORKSTATION", "MAC"].includes(device.nodeClass || "");
}

function isServerDevice(device: NinjaOneDevice) {
  return /SERVER|VMM_HOST|VMM_GUEST|VM_HOST|VM_GUEST/.test(device.nodeClass || "");
}

function countBy<T>(rows: T[], keyFn: (row: T) => string) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const key = keyFn(row) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthed = await verifyBillingSession(
      cookieStore.get("gsv_billing_session")?.value,
    );

    if (!isAuthed) {
      return NextResponse.json({ error: "Billing Hub login required." }, { status: 401 });
    }

    const params = new URL(request.url).searchParams;
    const organizationId = Number(params.get("organizationId") || 0);

    if (!organizationId) {
      throw new Error("Missing NinjaOne organization ID for this client.");
    }

    const accessToken = await ninjaOneToken();
    const [allDevices, policies] = await Promise.all([
      ninjaOneGetAll<NinjaOneDevice>(accessToken, "/v2/devices"),
      ninjaOneGet<NinjaOnePolicy[]>(accessToken, "/v2/policies").catch(() => []),
    ]);
    const policyNames = new Map((Array.isArray(policies) ? policies : []).map((policy) => [policy.id, policy.name || ""]));

    const basicDevices = allDevices.filter((device) => Number(device.organizationId) === organizationId);
    const devices = await Promise.all(
      basicDevices.map(async (device) => {
        if (!device.id) return device;
        return ninjaOneGet<NinjaOneDevice>(accessToken, `/v2/device/${device.id}`).catch(() => device);
      }),
    );

    const rows = devices.map((device) => ({
      id: device.id || 0,
      name: device.displayName || device.systemName || device.dnsName || `Device ${device.id || ""}`,
      nodeClass: device.nodeClass || "Unknown",
      rolePolicyId: device.rolePolicyId || 0,
      policyName: policyNames.get(device.rolePolicyId) || "",
      locationId: device.locationId || 0,
      offline: Boolean(device.offline),
      category: isServerDevice(device) ? "server" : isEndpointDevice(device) ? "endpoint" : "other",
    }));

    return NextResponse.json({
      source: "NinjaOne",
      pulledAt: new Date().toISOString(),
      organizationId,
      rows,
      totals: {
        devices: rows.length,
        endpoints: rows.filter((row) => row.category === "endpoint").length,
        servers: rows.filter((row) => row.category === "server").length,
        other: rows.filter((row) => row.category === "other").length,
        offline: rows.filter((row) => row.offline).length,
        byClass: countBy(rows, (row) => row.nodeClass),
        byPolicy: countBy(rows, (row) => row.policyName || String(row.rolePolicyId || "No policy")),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "NinjaOne service audit failed.",
      },
      { status: 500 },
    );
  }
}
