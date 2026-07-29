import { NextResponse } from "next/server";

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
const PAX8_ROOT = "https://api.pax8.com";
const MOXIE_PAX8_COMPANY_ID = "e1cda7ec-516c-4df1-b1cb-9baf660b4bda";

async function jsonResponse(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.error_description || data.message || data.error || `Request failed: ${response.status}`);
  return data;
}

export async function GET(request: Request) {
  if (request.headers.get("x-gsv-projection") !== "7c0cdbf36fb64bed99ce7ca04c72ff1e") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const graphToken = await jsonResponse(
      `https://login.microsoftonline.com/${process.env.MOXIE_MS_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.MOXIE_MS_CLIENT_ID || "",
          client_secret: process.env.MOXIE_MS_CLIENT_SECRET || "",
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
      },
    );
    const skuData = await jsonResponse(
      `${GRAPH_ROOT}/subscribedSkus?$select=skuId,skuPartNumber,capabilityStatus,consumedUnits,prepaidUnits`,
      { headers: { Authorization: `Bearer ${graphToken.access_token}` } },
    );

    const pax8Token = await jsonResponse(`${PAX8_ROOT}/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.PAX8_CLIENT_ID,
        client_secret: process.env.PAX8_CLIENT_SECRET,
        audience: PAX8_ROOT,
        grant_type: "client_credentials",
      }),
    });
    const pax8Rows: Record<string, unknown>[] = [];
    for (let page = 0; page < 25; page += 1) {
      const data = await jsonResponse(`${PAX8_ROOT}/v1/subscriptions?page=${page}&size=200`, {
        headers: { Authorization: `Bearer ${pax8Token.access_token}` },
      });
      pax8Rows.push(...(Array.isArray(data.content) ? data.content : []));
      if (page + 1 >= Number(data.page?.totalPages || 1)) break;
    }

    return NextResponse.json({
      microsoft: (skuData.value || []).map((sku: Record<string, any>) => ({
        sku: sku.skuPartNumber,
        status: sku.capabilityStatus,
        consumed: sku.consumedUnits,
        enabled: sku.prepaidUnits?.enabled,
        warning: sku.prepaidUnits?.warning,
        suspended: sku.prepaidUnits?.suspended,
      })),
      pax8: pax8Rows
        .filter((row) => String(row.companyId || "").toLowerCase() === MOXIE_PAX8_COMPANY_ID)
        .map((row) => ({
          product: row.productName,
          quantity: row.quantity,
          status: row.status,
          partnerCost: row.partnerCost,
          price: row.price,
          billingTerm: row.billingTerm,
          commitment: row.commitment,
        })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Projection pull failed." },
      { status: 500 },
    );
  }
}
