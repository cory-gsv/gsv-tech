import { NextRequest, NextResponse } from "next/server"
import { verifyBillingSession } from "./app/billing/billingAuth"

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("gsv_billing_session")?.value

  if (await verifyBillingSession(token)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/billing", request.url))
}

export const config = {
  matcher: ["/billing-app/:path*"],
}
