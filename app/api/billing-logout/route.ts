import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const requestedNext = request.nextUrl.searchParams.get("next")
  const nextPath = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/billing"
  const response = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303,
  })
  response.cookies.delete("gsv_billing_session")
  return response
}
