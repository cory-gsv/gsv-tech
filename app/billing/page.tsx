import { cookies } from "next/headers"
import "./billing.css"
import { verifyBillingSession } from "./billingAuth"

type BillingPageProps = {
  searchParams?: Promise<{ error?: string }>
}

function errorMessage(error?: string) {
  if (error === "missing") {
    return "The server cannot see the Billing Hub environment variables yet. Redeploy after saving the Vercel variables."
  }
  if (error === "wrong") {
    return "That username or password did not work."
  }
  if (error === "msmissing") {
    return "Microsoft login is missing its server settings."
  }
  if (error === "msdenied") {
    return "Microsoft login was cancelled or denied."
  }
  if (error === "msstate") {
    return "Microsoft login expired. Try again."
  }
  if (error === "mstoken") {
    return "Microsoft login could not be completed. Check the app redirect URI."
  }
  if (error === "msunauthorized") {
    return "That Microsoft account is not allowed into Billing Hub."
  }
  return ""
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(
    cookieStore.get("gsv_billing_session")?.value
  )

  if (!isAuthed) {
    const params = await searchParams
    const message = errorMessage(params?.error)
    return (
      <main className="gsv-billing-login">
        <section className="gsv-billing-login__card">
          <img src="/images/gsv-logo.png" alt="Golden State Visions" />
          <h1>Billing Hub</h1>
          <p>Private invoices, quotes, payments, and Microsoft 365 MSP billing.</p>
          <a className="gsv-billing-login__microsoft" href="/api/billing-microsoft-login">
            <span className="gsv-billing-login__microsoft-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              <strong>Sign in with Microsoft 365</strong>
              <small>Use your Golden State Visions account</small>
            </span>
          </a>
          <div className="gsv-billing-login__divider">Backup login</div>
          <form action="/api/billing-login" method="post">
            <label htmlFor="billing-username">Username</label>
            <input
              id="billing-username"
              name="username"
              type="text"
              autoComplete="username"
              required
            />
            <label htmlFor="billing-password">Password</label>
            <input
              id="billing-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            {message ? (
              <div className="gsv-billing-login__error">
                {message}
              </div>
            ) : null}
            <button type="submit">Log In</button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="gsv-billing-shell">
      <iframe
        className="gsv-billing-shell__frame"
        src="/billing-app/index.html"
        title="GSV Billing Hub"
      />
    </main>
  )
}
