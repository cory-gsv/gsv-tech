import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/billing", request.url), {
    status: 303,
  })
  response.cookies.delete("gsv_billing_session")
  return response
}
