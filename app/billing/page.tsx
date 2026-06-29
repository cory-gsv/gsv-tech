import { cookies } from "next/headers"
import "./billing.css"
import { verifyBillingSession } from "./billingAuth"

type BillingPageProps = {
  searchParams?: Promise<{ error?: string }>
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const cookieStore = await cookies()
  const isAuthed = await verifyBillingSession(
    cookieStore.get("gsv_billing_session")?.value
  )

  if (!isAuthed) {
    const params = await searchParams
    return (
      <main className="gsv-billing-login">
        <section className="gsv-billing-login__card">
          <img src="/images/gsv-logo.png" alt="Golden State Visions" />
          <h1>Billing Hub</h1>
          <p>Private invoices, quotes, payments, and Microsoft 365 MSP billing.</p>
          <form action="/api/billing-login" method="post">
            <label htmlFor="billing-password">Password</label>
            <input
              id="billing-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            {params?.error ? (
              <div className="gsv-billing-login__error">
                That password did not work.
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
      <header className="gsv-billing-shell__bar">
        <div>
          <strong>GSV Billing Hub</strong>
          <span>Invoices, quotes, payments, and monthly MSP audits</span>
        </div>
        <form action="/api/billing-logout" method="post">
          <button className="gsv-billing-shell__logout" type="submit">
            Log Out
          </button>
        </form>
      </header>
      <iframe
        className="gsv-billing-shell__frame"
        src="/billing-app/index.html"
        title="GSV Billing Hub"
      />
    </main>
  )
}
