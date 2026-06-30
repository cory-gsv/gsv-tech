import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyBillingSession } from "../../billing/billingAuth";

const PAX8_API_ROOT = "https://api.pax8.com";

type Pax8Page<T> = {
  content?: T[];
  page?: {
    size?: number;
    totalElements?: number;
    totalPages?: number;
    number?: number;
  };
};

type Pax8Subscription = {
  id?: string;
  companyId?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  status?: string;
  currencyCode?: string;
  billingTerm?: string;
  commitment?: string;
  startDate?: string;
  billingStart?: string;
  price?: number;
  partnerCost?: number;
  vendorSubscriptionId?: string;
};

function envValue(key: string) {
  return process.env[key]?.trim() || "";
}

async function pax8Token() {
  const clientId = envValue("PAX8_CLIENT_ID");
  const clientSecret = envValue("PAX8_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Missing Pax8 API credentials. Set PAX8_CLIENT_ID and PAX8_CLIENT_SECRET.");
  }

  const response = await fetch(`${PAX8_API_ROOT}/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: "https://api.pax8.com",
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Pax8 authentication failed.");
  }

  return String(data.access_token);
}

async function pax8Get<T>(accessToken: string, path: string) {
  const response = await fetch(`${PAX8_API_ROOT}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Pax8 request failed with ${response.status}.`);
  }

  return data as T;
}

async function pax8GetAll<T>(accessToken: string, path: string) {
  const rows: T[] = [];
  let page = 0;
  const separator = path.includes("?") ? "&" : "?";

  while (page < 25) {
    const data = await pax8Get<Pax8Page<T>>(accessToken, `${path}${separator}page=${page}&size=200`);
    rows.push(...(Array.isArray(data.content) ? data.content : []));
    const totalPages = Number(data.page?.totalPages ?? 1);
    page += 1;
    if (page >= totalPages) break;
  }

  return rows;
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
    const companyId = params.get("companyId")?.trim();

    if (!companyId) {
      throw new Error("Missing Pax8 company ID for this client.");
    }

    const accessToken = await pax8Token();
    const subscriptions = await pax8GetAll<Pax8Subscription>(
      accessToken,
      `/v1/subscriptions?company_id=${encodeURIComponent(companyId)}`,
    );

    const rows = subscriptions
      .filter((subscription) => !subscription.status || !/cancel|delete/i.test(subscription.status))
      .map((subscription) => {
        const quantity = Number(subscription.quantity || 0);
        const partnerCost = Number(subscription.partnerCost || 0);
        const price = Number(subscription.price || 0);

        return {
          id: subscription.id || "",
          companyId: subscription.companyId || companyId,
          productId: subscription.productId || "",
          productName: subscription.productName || "Unknown product",
          quantity,
          status: subscription.status || "",
          currencyCode: subscription.currencyCode || "USD",
          billingTerm: subscription.billingTerm || "",
          commitment: subscription.commitment || "",
          startDate: subscription.startDate || "",
          billingStart: subscription.billingStart || "",
          unitPrice: price,
          unitPartnerCost: partnerCost,
          monthlyPrice: price * quantity,
          monthlyPartnerCost: partnerCost * quantity,
          vendorSubscriptionId: subscription.vendorSubscriptionId || "",
        };
      })
      .sort((a, b) => a.productName.localeCompare(b.productName));

    return NextResponse.json({
      source: "Pax8",
      pulledAt: new Date().toISOString(),
      companyId,
      rows,
      totals: {
        quantity: rows.reduce((sum, row) => sum + row.quantity, 0),
        monthlyPrice: rows.reduce((sum, row) => sum + row.monthlyPrice, 0),
        monthlyPartnerCost: rows.reduce((sum, row) => sum + row.monthlyPartnerCost, 0),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Pax8 subscription pull failed.",
      },
      { status: 500 },
    );
  }
}
