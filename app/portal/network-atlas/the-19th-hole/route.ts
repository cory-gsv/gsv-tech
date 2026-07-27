import { readFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyBillingSession } from "../../../billing/billingAuth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(
    cookieStore.get("gsv_billing_session")?.value
  )

  if (!isAuthed) {
    return NextResponse.redirect(new URL("/portal", request.url))
  }

  const atlasPath = path.join(
    process.cwd(),
    "app",
    "portal",
    "network-atlas",
    "the-19th-hole",
    "atlas.html"
  )
  const atlas = await readFile(atlasPath, "utf8")

  return new NextResponse(atlas, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
    },
  })
}
