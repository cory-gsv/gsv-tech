import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyBillingSession } from "../../billing/billingAuth";

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";

const FRIENDLY_SKU_NAMES: Record<string, string> = {
  EXCHANGESTANDARD: "Exchange Online (Plan 1)",
  EXCHANGE_S_STANDARD: "Exchange Online (Plan 1)",
  EXCHANGE_S_ENTERPRISE: "Exchange Online (Plan 2)",
  O365_BUSINESS_ESSENTIALS: "Microsoft 365 Business Basic",
  O365_BUSINESS_PREMIUM: "Microsoft 365 Business Standard",
  SPB: "Microsoft 365 Business Premium",
  SPE_E3: "Microsoft 365 E3",
  SPE_E5: "Microsoft 365 E5",
  M365_COPILOT: "Microsoft 365 Copilot",
  Microsoft_365_Copilot: "Microsoft 365 Copilot",
  MICROSOFT_365_COPILOT_FOR_BUSINESS: "Microsoft 365 Copilot",
  Microsoft_Teams_Exploratory_Dept: "Microsoft Teams Exploratory",
  FLOW_FREE: "Power Automate Free",
};

type GraphUser = {
  displayName?: string;
  userPrincipalName?: string;
  accountEnabled?: boolean;
  assignedLicenses?: Array<{ skuId?: string }>;
  department?: string;
  jobTitle?: string;
  userType?: string;
};

type GraphSku = {
  skuId?: string;
  skuPartNumber?: string;
};

function envValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return "";
}

function tenantEnvValue(tenantKey: string, ...keys: string[]) {
  const normalized = tenantKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, "_");
  if (normalized && normalized !== "DEFAULT") {
    const value = envValue(...keys.map(key => `${normalized}_${key}`));
    if (value) return value;
  }
  return envValue(...keys);
}

function tenantEnvPrefix(tenantKey: string) {
  return tenantKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, "_");
}

async function graphToken(tenantKey = "default") {
  const tenantId = tenantEnvValue(tenantKey, "MS_TENANT_ID", "MICROSOFT_TENANT_ID", "AZURE_TENANT_ID");
  const clientId = tenantEnvValue(tenantKey, "MS_CLIENT_ID", "MICROSOFT_CLIENT_ID", "AZURE_CLIENT_ID");
  const clientSecret = tenantEnvValue(tenantKey, "MS_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET", "AZURE_CLIENT_SECRET");

  if (!tenantId || !clientId || !clientSecret) {
    const prefix = tenantEnvPrefix(tenantKey);
    const expected = prefix && prefix !== "DEFAULT"
      ? `${prefix}_MS_TENANT_ID / ${prefix}_MS_CLIENT_ID / ${prefix}_MS_CLIENT_SECRET`
      : "MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET";
    throw new Error(`Missing Microsoft Graph app credentials for tenant key "${tenantKey}". Add ${expected} in Vercel.`);
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Microsoft Graph auth failed.");
  }

  return String(data.access_token);
}

async function graphGetAll<T>(accessToken: string, path: string) {
  let url = `${GRAPH_ROOT}${path}`;
  const rows: T[] = [];

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error?.message || `Microsoft Graph request failed with ${response.status}.`);
    }

    rows.push(...(Array.isArray(data.value) ? data.value : []));
    url = data["@odata.nextLink"] || "";
  }

  return rows;
}

function friendlySkuName(skuPartNumber: string) {
  return FRIENDLY_SKU_NAMES[skuPartNumber] || skuPartNumber;
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

    const tenantKey = new URL(request.url).searchParams.get("tenant") || "default";
    const accessToken = await graphToken(tenantKey);
    const skus = await graphGetAll<GraphSku>(
      accessToken,
      "/subscribedSkus?$select=skuId,skuPartNumber",
    );
    const skuLookup = new Map(
      skus
        .filter((sku) => sku.skuId)
        .map((sku) => [String(sku.skuId).toLowerCase(), sku.skuPartNumber || sku.skuId || ""]),
    );

    const select = [
      "displayName",
      "userPrincipalName",
      "accountEnabled",
      "assignedLicenses",
      "department",
      "jobTitle",
      "userType",
    ].join(",");

    const users = await graphGetAll<GraphUser>(
      accessToken,
      `/users?$select=${select}&$top=999`,
    );

    const rows = users
      .map((user) => {
        const skuParts = (user.assignedLicenses || [])
          .map((license) => skuLookup.get(String(license.skuId || "").toLowerCase()) || license.skuId || "")
          .filter(Boolean)
          .sort();
        const licenseNames = skuParts.map((part) => friendlySkuName(String(part)));

        return {
          "Display Name": user.displayName || "",
          "User Principal Name": user.userPrincipalName || "",
          "Account Enabled": user.accountEnabled ? "TRUE" : "FALSE",
          "License Names": licenseNames.join("; "),
          "Sku Part Numbers": skuParts.join("; "),
          Department: user.department || "",
          "Job Title": user.jobTitle || "",
          "User Type": user.userType || "",
          Notes: "",
        };
      })
      .sort((a, b) => a["User Principal Name"].localeCompare(b["User Principal Name"]));

    return NextResponse.json({
      source: "Microsoft Graph",
      pulledAt: new Date().toISOString(),
      rows,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Microsoft 365 audit pull failed.",
      },
      { status: 500 },
    );
  }
}
