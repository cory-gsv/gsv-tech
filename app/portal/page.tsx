import { cookies } from "next/headers"
import "../billing/billing.css"
import { verifyBillingSession } from "../billing/billingAuth"

type PortalPageProps = {
  searchParams?: Promise<{ error?: string }>
}

function errorMessage(error?: string) {
  if (error === "missing") {
    return "The portal login settings are missing on this server. For local testing, restart the local server after saving .env.local. For the live site, redeploy after saving the Vercel variables."
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
    return "That Microsoft account is not allowed into the Client Portal."
  }
  return ""
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
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
          <h1>Client Portal</h1>
          <p>Private support, tickets, billing, and Microsoft 365 requests.</p>
          <a className="gsv-billing-login__microsoft" href="/api/billing-microsoft-login?next=/portal">
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
          <form action="/api/billing-login?next=/portal" method="post">
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
        src="/portal-app/index.html?v=portal-20260716-30"
        title="GSV Client Portal"
      />
    </main>
  )
}
