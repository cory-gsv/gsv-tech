import { readFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyBillingSession } from "../../../../../billing/billingAuth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ConfigRouteProps = {
  params: Promise<{ snapshotId: string }>
}

function validSnapshotId(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z$/.test(value)
}

export async function GET(request: Request, { params }: ConfigRouteProps) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(
    cookieStore.get("gsv_billing_session")?.value
  )

  if (!isAuthed) {
    return NextResponse.redirect(new URL("/portal", request.url))
  }

  const { snapshotId } = await params
  if (!validSnapshotId(snapshotId)) {
    return new NextResponse("Configuration snapshot not found", { status: 404 })
  }

  try {
    const config = await readFile(
      path.join(
        process.cwd(),
        "app",
        "portal",
        "network-atlas",
        "the-19th-hole",
        `config-${snapshotId}.json`
      ),
      "utf8"
    )

    return new NextResponse(config, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="the-19th-hole-unifi-${snapshotId}.json"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new NextResponse("Configuration snapshot not found", { status: 404 })
  }
}
