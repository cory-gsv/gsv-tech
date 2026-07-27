import { readFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyBillingSession } from "../../../../../billing/billingAuth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type SnapshotRouteProps = {
  params: Promise<{ snapshotId: string }>
}

function validSnapshotId(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z$/.test(value)
}

export async function GET(request: Request, { params }: SnapshotRouteProps) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(
    cookieStore.get("gsv_billing_session")?.value
  )

  if (!isAuthed) {
    return NextResponse.redirect(new URL("/portal", request.url))
  }

  const { snapshotId } = await params
  if (!validSnapshotId(snapshotId)) {
    return new NextResponse("Snapshot not found", { status: 404 })
  }

  try {
    const atlas = await readFile(
      path.join(
        process.cwd(),
        "app",
        "portal",
        "network-atlas",
        "the-19th-hole",
        `atlas-${snapshotId}.html`
      ),
      "utf8"
    )

    return new NextResponse(atlas, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    })
  } catch {
    return new NextResponse("Snapshot not found", { status: 404 })
  }
}
