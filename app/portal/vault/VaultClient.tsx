"use client"

import { FormEvent, useEffect, useState } from "react"

type ClientAccess = {
  client_id: string
  external_client_id: string
  client_name: string
  can_export: boolean
}

type SecretRecord = {
  id: string
  title: string
  category: string
  url: string
  username: string
  client_notes: string
  internal_notes: string
  mfa_method: string
  recovery_method: string
  has_recovery_value: boolean
  sensitivity: string
  client_visible: boolean
  exportable: boolean
  updated_at: string
}

function messageFromResponse(payload: { error?: string }, fallback: string) {
  const messages: Record<string, string> = {
    microsoft_required: "Microsoft 365 sign-in is required.",
    mfa_required: "Microsoft MFA verification is required for this action.",
    not_allowed: "You do not have access to this client vault.",
  }
  return messages[payload.error || ""] || payload.error || fallback
}

export default function VaultClient({ email, stepUpExpiresAt, initialClientId = "" }: { email: string; stepUpExpiresAt: number; initialClientId?: string }) {
  const [clients, setClients] = useState<ClientAccess[]>([])
  const [clientId, setClientId] = useState("")
  const [secrets, setSecrets] = useState<SecretRecord[]>([])
  const [revealed, setRevealed] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [savedSecretId, setSavedSecretId] = useState("")
  const [copiedSecretId, setCopiedSecretId] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [editingSecret, setEditingSecret] = useState<SecretRecord | null>(null)
  const [clientSearch, setClientSearch] = useState("")
  const [recordSearch, setRecordSearch] = useState("")
  const [stepUpExpired, setStepUpExpired] = useState(Date.now() >= stepUpExpiresAt)

  async function loadClients() {
    setLoading(true)
    setError("")
    const response = await fetch("/api/vault/clients", { cache: "no-store" })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(messageFromResponse(payload, "Unable to load vault clients."))
      setLoading(false)
      return
    }
    const nextClients = payload.clients || []
    setClients(nextClients)
    setClientId((current) => current && nextClients.some((client: ClientAccess) => client.client_id === current) ? current : nextClients.find((client: ClientAccess) => client.client_id === initialClientId || client.external_client_id === initialClientId)?.client_id || "")
    setLoading(false)
  }

  async function syncPortalClients() {
    try {
      const portalState = JSON.parse(localStorage.getItem("gsvBillingHub") || "{}")
      const portalClients = Array.isArray(portalState.clients) ? portalState.clients : []
      if (!portalClients.length) return loadClients()
      setLoading(true)
      const response = await fetch("/api/vault/clients", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clients: portalClients.map((client: { id?: string; name?: string; status?: string }) => ({ id: client.id, name: client.name, status: client.status })) }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(messageFromResponse(payload, "Unable to sync portal clients."))
      const nextClients = payload.clients || []
      setClients(nextClients)
      setClientId((current) => current && nextClients.some((client: ClientAccess) => client.client_id === current) ? current : nextClients.find((client: ClientAccess) => client.client_id === initialClientId || client.external_client_id === initialClientId)?.client_id || "")
      setLoading(false)
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Unable to sync portal clients.")
      await loadClients()
    }
  }

  async function loadSecrets(nextClientId: string) {
    if (!nextClientId) {
      setSecrets([])
      return
    }
    setError("")
    const response = await fetch(`/api/vault/secrets?clientId=${encodeURIComponent(nextClientId)}`, { cache: "no-store" })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(messageFromResponse(payload, "Unable to load credentials."))
      return
    }
    setSecrets(payload.secrets || [])
    setRevealed({})
  }

  useEffect(() => { void syncPortalClients() }, [])
  useEffect(() => {
    const remaining = Math.max(0, stepUpExpiresAt - Date.now())
    const timer = window.setTimeout(() => { setRevealed({}); setStepUpExpired(true) }, remaining)
    return () => window.clearTimeout(timer)
  }, [stepUpExpiresAt])
  useEffect(() => {
    setShowCreate(false)
    setEditingSecret(null)
    void loadSecrets(clientId)
  }, [clientId])

  async function createSecret(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!clientId) return
    const formElement = event.currentTarget
    setSaving(true)
    setError("")
    setSuccess("")
    setSavedSecretId("")
    const form = new FormData(formElement)
    const body = {
      id: editingSecret?.id,
      clientId,
      title: form.get("title"),
      category: form.get("category"),
      url: form.get("url"),
      username: form.get("username"),
      secret: form.get("secret"),
      mfaMethod: form.get("mfaMethod"),
      recoveryMethod: form.get("recoveryMethod"),
      recoveryValue: form.get("recoveryValue"),
      clientNotes: form.get("clientNotes"),
      internalNotes: form.get("internalNotes"),
      sensitivity: form.get("sensitivity"),
      clientVisible: form.get("clientVisible") === "on",
      exportable: form.get("exportable") === "on",
    }
    const response = await fetch("/api/vault/secrets", {
      method: editingSecret ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
    const payload = await response.json().catch(() => ({}))
    setSaving(false)
    if (!response.ok) {
      setError(messageFromResponse(payload, "Unable to save credential."))
      return
    }
    formElement.reset()
    setShowCreate(false)
    const wasEditing = Boolean(editingSecret)
    setEditingSecret(null)
    setRecordSearch("")
    await loadSecrets(clientId)
    setSavedSecretId(payload.id || "")
    setSuccess(`Credential “${String(body.title)}” was ${wasEditing ? "updated" : "encrypted and saved"} successfully.`)
  }

  async function revealSecret(secretId: string) {
    if (revealed[secretId]) {
      setRevealed((current) => ({ ...current, [secretId]: "" }))
      return
    }
    setError("")
    const response = await fetch(`/api/vault/secrets/${encodeURIComponent(secretId)}/reveal`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: "Interactive portal reveal" }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(messageFromResponse(payload, "Unable to reveal credential."))
      return
    }
    setRevealed((current) => ({ ...current, [secretId]: payload.secret }))
  }

  async function copySecret(secretId: string) {
    setError("")
    let value = revealed[secretId]
    if (!value) {
      const response = await fetch(`/api/vault/secrets/${encodeURIComponent(secretId)}/reveal`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason: "Copy hidden credential from portal" }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(messageFromResponse(payload, "Unable to copy credential."))
        return
      }
      value = payload.secret
    }
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      setError("The browser blocked clipboard access. Allow clipboard permission and try again.")
      return
    }
    setCopiedSecretId(secretId)
    window.setTimeout(() => setCopiedSecretId((current) => current === secretId ? "" : current), 1800)
  }

  async function copyRecoveryValue(secretId: string) {
    setError("")
    const response = await fetch(`/api/vault/secrets/${encodeURIComponent(secretId)}/reveal`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: "Copy hidden recovery value from portal", field: "recovery_value" }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || !payload.secret) {
      setError(messageFromResponse(payload, "Unable to copy recovery value."))
      return
    }
    try { await navigator.clipboard.writeText(payload.secret) } catch {
      setError("The browser blocked clipboard access. Allow clipboard permission and try again.")
      return
    }
    setCopiedSecretId(`${secretId}:recovery`)
    window.setTimeout(() => setCopiedSecretId((current) => current === `${secretId}:recovery` ? "" : current), 1800)
  }

  async function exportClient() {
    if (!clientId) return
    const response = await fetch("/api/vault/exports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clientId, reason: "Interactive client handoff export" }),
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      setError(messageFromResponse(payload, "Unable to export credentials."))
      return
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `gsv-client-vault-${clientId}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const selectedClient = clients.find((client) => client.client_id === clientId)
  const normalizedClientSearch = clientSearch.trim().toLowerCase()
  const filteredClients = clients.filter((client) => !normalizedClientSearch || client.client_name.toLowerCase().includes(normalizedClientSearch))
  const normalizedRecordSearch = recordSearch.trim().toLowerCase()
  const filteredSecrets = secrets.filter((secret) => !normalizedRecordSearch || [secret.title, secret.category, secret.username, secret.url, secret.client_notes, secret.internal_notes].some((value) => String(value || "").toLowerCase().includes(normalizedRecordSearch)))

  if (stepUpExpired) return <section className="vault-reauth"><strong>Vault session expired.</strong><p>Verify your identity again to continue. Any revealed values have been cleared.</p><a target="_top" href="/api/billing-microsoft-login?vault=1&next=/portal">Verify identity with Microsoft 365</a></section>

  return (
    <div className="vault-app">
      <nav className="vault-client-nav" aria-label="Vault client collections">
        <div className="vault-sidebar-head">
          <span>Client</span>
          <strong>{clients.length} total</strong>
        </div>
        <div className="vault-search vault-client-search">
          <label><span className="sr-only">Search clients</span><input value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} placeholder="Search and switch clients…" /></label>
          {normalizedClientSearch ? <div className="vault-client-search-results">
            {filteredClients.map((client) => <button type="button" key={client.client_id} onClick={() => { setClientId(client.client_id); setClientSearch("") }}>
              <strong>{client.client_name}</strong>
              {client.client_id === clientId ? <span>Current client</span> : <span>Open vault</span>}
            </button>)}
            {!filteredClients.length ? <p>No clients match “{clientSearch}”.</p> : null}
          </div> : null}
        </div>
        {loading ? <p className="vault-muted">Loading clients…</p> : null}
        <label className="vault-client-select">
          <span className="sr-only">Select vault client</span>
          <select value={clientId} onChange={(event) => { setClientId(event.target.value); setClientSearch("") }} disabled={loading || !clients.length}>
            <option value="">Select a client…</option>
            {clients.map((client) => <option key={client.client_id} value={client.client_id}>{client.client_name}</option>)}
          </select>
        </label>
        <span className="vault-client-results">{filteredClients.length} matching</span>
        {!loading && !filteredClients.length ? <p className="vault-muted">No clients match that search.</p> : null}
      </nav>

      <section className="vault-workspace">
        <div className="vault-workspace-head">
          <div>
            <span className="vault-eyebrow">Secure records</span>
            <h2>{selectedClient?.client_name || "Select a client"}</h2>
            <p>Signed in as {email}</p>
          </div>
          <div className="vault-actions">
            {selectedClient?.can_export ? <button onClick={() => void exportClient()}>Export releasable</button> : null}
            <button className="primary" disabled={!clientId} onClick={() => { setShowCreate((value) => !value); setEditingSecret(null); setSuccess("") }}>{showCreate ? "Cancel" : "New credential"}</button>
          </div>
        </div>

        {error ? <div className="vault-error">{error}</div> : null}
        {success ? <div className="vault-success" role="status"><span><strong>Saved.</strong> {success}</span><button type="button" onClick={() => setSuccess("")} aria-label="Dismiss confirmation">×</button></div> : null}

        {showCreate ? (
          <form key={editingSecret?.id || "new"} className="vault-create" onSubmit={(event) => void createSecret(event)}>
            <div className="vault-form-head"><h3>{editingSecret ? "Edit credential" : "Add credential"}</h3><span>{editingSecret ? "Leave the password blank to keep the current password." : "Secret values are encrypted before database storage."}</span></div>
            <label><span>Title</span><input name="title" required defaultValue={editingSecret?.title} placeholder="Microsoft 365 Global Admin" /></label>
            <label><span>Category</span><input name="category" defaultValue={editingSecret?.category || "General"} /></label>
            <label><span>Username</span><input name="username" defaultValue={editingSecret?.username} autoComplete="off" /></label>
            <label><span>{editingSecret ? "New password / secret" : "Password / secret"}</span><input name="secret" type="password" required={!editingSecret} autoComplete="new-password" placeholder={editingSecret ? "Leave blank to keep current password" : ""} /></label>
            <label className="wide"><span>URL</span><input name="url" type="url" defaultValue={editingSecret?.url} placeholder="https://" /></label>
            <label><span>MFA method</span><select name="mfaMethod" defaultValue={editingSecret?.mfa_method || ""}><option value="">Not documented</option><option value="email">Email</option><option value="phone">Phone</option><option value="code">Code</option></select></label>
            <label><span>Recovery method</span><select name="recoveryMethod" defaultValue={editingSecret?.recovery_method || ""}><option value="">Not documented</option><option value="email">Email</option><option value="phone">Phone</option><option value="code">Code</option></select></label>
            <label className="wide"><span>Recovery value</span><input name="recoveryValue" type="password" autoComplete="off" placeholder={editingSecret?.has_recovery_value ? "Leave blank to keep current value" : "Email address, phone number, or recovery code"} /></label>
            <label><span>Sensitivity</span><select name="sensitivity" defaultValue={editingSecret?.sensitivity || "highly_sensitive"}><option value="standard">Standard</option><option value="confidential">Confidential</option><option value="highly_sensitive">Highly sensitive</option><option value="break_glass">Break glass</option></select></label>
            <label className="wide"><span>Client notes</span><textarea name="clientNotes" defaultValue={editingSecret?.client_notes} rows={2} /></label>
            <label className="wide"><span>Internal notes</span><textarea name="internalNotes" defaultValue={editingSecret?.internal_notes} rows={2} /></label>
            <label className="vault-check"><input name="clientVisible" type="checkbox" defaultChecked={editingSecret ? editingSecret.client_visible : true} /><span>Client visible</span></label>
            <label className="vault-check"><input name="exportable" type="checkbox" defaultChecked={editingSecret ? editingSecret.exportable : true} /><span>Include in controlled export</span></label>
            <div className="vault-form-actions"><button type="button" onClick={() => { setShowCreate(false); setEditingSecret(null) }}>Cancel</button><button className="primary" disabled={saving}>{saving ? "Encrypting and saving…" : editingSecret ? "Save changes" : "Save credential"}</button></div>
          </form>
        ) : null}

        <div className="vault-summary">
          <article><span>Total records</span><strong>{secrets.length}</strong></article>
          <article><span>Client visible</span><strong>{secrets.filter((secret) => secret.client_visible).length}</strong></article>
          <article><span>Exportable</span><strong>{secrets.filter((secret) => secret.exportable).length}</strong></article>
        </div>

        <div className="vault-record-toolbar">
          <label className="vault-search"><span className="sr-only">Search credentials</span><input value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} placeholder="Search title, username, category, URL, or notes…" /></label>
          <span>{filteredSecrets.length} of {secrets.length} records</span>
        </div>

        <div className="vault-records">
          {filteredSecrets.map((secret) => (
            <article key={secret.id} className={`vault-record${secret.id === savedSecretId ? " newly-saved" : ""}`}>
              <div className="vault-record-main">
                <div><span className="vault-category">{secret.category}</span><h3>{secret.title}</h3></div>
                <span className={`vault-sensitivity ${secret.sensitivity}`}>{secret.sensitivity.replaceAll("_", " ")}</span>
              </div>
              <div className="vault-record-details">
                <div><span>Username</span><strong>{secret.username || "Not set"}</strong></div>
                <div><span>Secret</span><button type="button" className={`vault-secret vault-secret-copy${copiedSecretId === secret.id ? " copied" : ""}`} onClick={() => void copySecret(secret.id)} title="Copy password" aria-label={`Copy password for ${secret.title}`}>{copiedSecretId === secret.id ? "Copied!" : revealed[secret.id] || "••••••••••••"}</button></div>
                <div><span>MFA</span><strong>{secret.mfa_method || "Not documented"}</strong></div>
              </div>
              {secret.url || secret.client_notes || secret.internal_notes ? <p>{[secret.url, secret.client_notes, secret.internal_notes].filter(Boolean).join(" · ")}</p> : null}
              <div className="vault-record-actions">
                <button onClick={() => { setEditingSecret(secret); setShowCreate(true); setSuccess(""); window.scrollTo({ top: 0, behavior: "smooth" }) }}>Edit</button>
                <button onClick={() => void revealSecret(secret.id)}>{revealed[secret.id] ? "Hide" : "Reveal"}</button>
                {revealed[secret.id] ? <button onClick={() => void copySecret(secret.id)}>Copy</button> : null}
                {secret.has_recovery_value ? <button onClick={() => void copyRecoveryValue(secret.id)}>{copiedSecretId === `${secret.id}:recovery` ? "Recovery copied!" : `Copy ${secret.recovery_method || "recovery"}`}</button> : null}
                <span>{secret.client_visible ? "Client visible" : "Internal only"}</span>
              </div>
            </article>
          ))}
          {clientId && !filteredSecrets.length ? <div className="vault-empty-state"><strong>{secrets.length ? "No matching credentials." : "No credential records yet."}</strong><span>{secrets.length ? "Try a different search." : "Create the first structured secret for this client."}</span></div> : null}
        </div>
      </section>
    </div>
  )
}
