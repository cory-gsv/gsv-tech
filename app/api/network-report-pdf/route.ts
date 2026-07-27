import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { existsSync } from "node:fs"
import chromium from "@sparticuz/chromium"
import puppeteer from "puppeteer-core"
import { verifyBillingSession } from "../../billing/billingAuth"

export const runtime = "nodejs"
export const maxDuration = 60

type ReportPdfRequest = {
  html?: string
  title?: string
}

async function chromiumExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH
  if (process.platform === "darwin") {
    const localChromePaths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]
    const localChromePath = localChromePaths.find((path) => existsSync(path))
    if (localChromePath) return localChromePath
  }
  return chromium.executablePath()
}

function chromiumLaunchArgs() {
  if (process.platform === "darwin") {
    return ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  }
  return chromium.args
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(cookieStore.get("gsv_billing_session")?.value)
  if (!isAuthed) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: ReportPdfRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const html = String(body.html || "").trim()
  if (!html) {
    return NextResponse.json({ error: "Missing report HTML." }, { status: 400 })
  }
  if (html.length > 5_000_000) {
    return NextResponse.json({ error: "Report HTML is too large to render." }, { status: 413 })
  }

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined
  try {
    browser = await puppeteer.launch({
      args: chromiumLaunchArgs(),
      executablePath: await chromiumExecutablePath(),
      headless: true,
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 30_000 })
    await page.emulateMediaType("print")
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0.25in",
        right: "0.25in",
        bottom: "0.25in",
        left: "0.25in",
      },
    })

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
        "X-Network-Report-Title": String(body.title || "Network Report").slice(0, 120),
      },
    })
  } catch (error) {
    console.error("network-report-pdf render failed", {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF render failed." },
      { status: 500 },
    )
  } finally {
    await browser?.close().catch(() => undefined)
  }
}
