import { cookies } from "next/headers"
import "../../billing/billing.css"
import { getBillingSession, sessionHasVaultStepUp, VAULT_STEP_UP_MAX_AGE_MS, verifyBillingSession } from "../../billing/billingAuth"
import { isVaultConfigured } from "../../vault/db"
import { isVaultStorageConfigured } from "../../vault/storage"
import VaultClient from "./VaultClient"
import "./vault.css"

type VaultPageProps = { searchParams?: Promise<{ embedded?: string; clientId?: string }> }

export default async function VaultPage({ searchParams }: VaultPageProps) {
  const params = await searchParams
  const embedded = params?.embedded === "1"
  const cookieStore = await cookies()
  const token = cookieStore.get("gsv_billing_session")?.value
  const isAuthed = await verifyBillingSession(token)
  const session = await getBillingSession(token)

  if (!isAuthed) {
    return (
      <main className="gsv-billing-login">
        <section className="gsv-billing-login__card">
          <img src="/images/gsv-logo.png" alt="Golden State Visions" />
          <h1>Client Vault</h1>
          <p>Sign in to access releasable credentials and client documents.</p>
          <a className="gsv-billing-login__microsoft" href="/api/billing-microsoft-login?next=/portal/vault">
            <span className="gsv-billing-login__microsoft-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              <strong>Sign in with Microsoft 365</strong>
            </span>
          </a>
        </section>
      </main>
    )
  }

  return (
    <main className={`vault-page${embedded ? " embedded" : ""}`}>
      <div className="vault-shell">
        {!embedded ? <div className="vault-top">
          <div>
            <p style={{ color: "#64748b", margin: 0 }}>Golden State Visions</p>
            <h1 style={{ margin: "4px 0 8px" }}>Client Vault</h1>
            <p style={{ color: "#475569", margin: 0 }}>
              Credential records are revealed one at a time and every reveal or export is audited.
            </p>
          </div>
          <a href="/portal">Back to portal</a>
        </div> : null}

        {!isVaultConfigured() || !isVaultStorageConfigured() ? (
          <section style={{ marginTop: "24px", padding: "18px", border: "1px solid #f59e0b", borderRadius: "8px", background: "#fffbeb" }}>
            <strong>Private vault backend needs configuration.</strong>
            <p style={{ marginBottom: 0 }}>
              Add the Neon `DATABASE_URL`, connect the private Vercel Blob store, and run
              `database/001_client_vault.sql` before enabling the vault.
            </p>
          </section>
        ) : null}

        {session?.authProvider !== "microsoft" ? (
          <section style={{ marginTop: "24px", padding: "18px", border: "1px solid #ef4444", borderRadius: "8px", background: "#fef2f2" }}>
            <strong>Microsoft sign-in required for vault access.</strong>
            <p style={{ marginBottom: 0 }}>
              Backup password sessions can open the legacy portal, but credential reveal/export requires a named Microsoft user.
            </p>
          </section>
        ) : !sessionHasVaultStepUp(session) ? (
          <section className="vault-reauth">
            <strong>Fresh Microsoft MFA verification required.</strong>
            <p>Vault access expires one hour after your last verified Microsoft authentication.</p>
            <a target="_top" href="/api/billing-microsoft-login?vault=1&next=/portal">Verify identity with Microsoft 365</a>
          </section>
        ) : (
          <VaultClient email={session?.email || ""} stepUpExpiresAt={session.authenticatedAt + VAULT_STEP_UP_MAX_AGE_MS} initialClientId={params?.clientId || ""} />
        )}
      </div>
    </main>
  )
}
