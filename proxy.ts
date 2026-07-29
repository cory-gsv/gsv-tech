import { NextRequest, NextResponse } from "next/server"
import { verifyBillingSession } from "./app/billing/billingAuth"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // Styles/scripts/images may load without another session check, but the HTML
  // application entry point must remain protected. This lets authenticated
  // users run the portal as the top-level document instead of inside an iframe.
  const isStaticAppAsset =
    /\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/i.test(pathname)

  if (isStaticAppAsset) {
    return NextResponse.next()
  }

  const token = request.cookies.get("gsv_billing_session")?.value

  if (await verifyBillingSession(token)) {
    return NextResponse.next()
  }

  const loginPath = request.nextUrl.pathname.startsWith("/portal-app")
    ? "/portal"
    : "/billing"

  return NextResponse.redirect(new URL(loginPath, request.url))
}

export const config = {
  matcher: ["/billing-app/:path*", "/portal-app/:path*"],
}
