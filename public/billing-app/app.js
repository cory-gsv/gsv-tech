const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();

const defaultData = {
  clients: [
    {
      id: "client_moxie",
      name: "Moxie International",
      billTo: "Accounts Payable\nMoxie International\n4170 Citrus Ave. Rocklin, CA 95677\n(916) 652-1300\nadmin@moxieinternational.com",
      email: "admin@moxieinternational.com",
      phone: "(916) 652-1300",
      terms: "Net 15",
      status: "active",
      notes: "Pays by check."
    }
  ],
  serviceAgreements: [
    { id: "svc_moxie_full", clientId: "client_moxie", name: "Monthly IT (Full User)", qty: 7, rate: 70, active: true },
    { id: "svc_moxie_light", clientId: "client_moxie", name: "Monthly IT (Light User)", qty: 25, rate: 20, active: true },
    { id: "svc_moxie_service", clientId: "client_moxie", name: "Monthly IT (Service Account)", qty: 1, rate: 10, active: true },
    { id: "svc_moxie_copilot", clientId: "client_moxie", name: "Copilot Add-on license billing", qty: 2, rate: 30, active: true },
    { id: "svc_moxie_credit", clientId: "client_moxie", name: "Credit: Moxie-paid direct Microsoft licenses", qty: 1, rate: -164, active: true }
  ],
  invoices: [
    {
      id: "inv_moxie_2026_06",
      number: "GSV-MOXIE-2026-06",
      clientId: "client_moxie",
      date: "2026-06-25",
      dueDate: "2026-07-10",
      month: "2026-06",
      status: "sent",
      type: "Monthly MSP",
      items: [
        { description: "Monthly IT (Full User)", qty: 7, rate: 70 },
        { description: "Monthly IT (Light User)", qty: 25, rate: 20 },
        { description: "Monthly IT (Service Account)", qty: 1, rate: 10 },
        { description: "Copilot Add-on license billing", qty: 2, rate: 30 },
        { description: "Credit: Moxie-paid direct Microsoft licenses", qty: 1, rate: -164 }
      ],
      notes: ""
    }
  ],
  quotes: [],
  payments: [],
  audits365: []
};

let state = loadState();
let activeView = "dashboard";
let editing = null;

function loadState() {
  const raw = localStorage.getItem("gsvBillingHub");
  if (!raw) return structuredClone(defaultData);
  try {
    return { ...structuredClone(defaultData), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultData);
  }
}

function saveState() {
  localStorage.setItem("gsvBillingHub", JSON.stringify(state, null, 2));
}

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clientName(clientId) {
  return state.clients.find(c => c.id === clientId)?.name || "Unknown client";
}

function clientById(clientId) {
  return state.clients.find(c => c.id === clientId);
}

function invoiceTotal(invoice) {
  return invoice.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);
}

function currentMspItems(clientId, month = today.slice(0, 7)) {
  const audit = latestAudit(clientId, month);
  if (audit) return auditInvoiceItems(audit);
  return state.serviceAgreements
    .filter(s => s.clientId === clientId && s.active)
    .map(s => ({ description: s.name, qty: Number(s.qty || 0), rate: Number(s.rate || 0) }));
}

function currentMspTotal(clientId, month = today.slice(0, 7)) {
  return currentMspItems(clientId, month).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);
}

function paidAmount(invoiceId) {
  return state.payments.filter(p => p.invoiceId === invoiceId).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function computedInvoiceStatus(invoice) {
  if (invoice.status === "paid") return "paid";
  if (paidAmount(invoice.id) >= invoiceTotal(invoice)) return "paid";
  if (invoice.status === "draft") return "draft";
  if (invoice.dueDate < today) return "overdue";
  return invoice.status || "sent";
}

function formatDate(value) {
  return value || "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[char]));
}

function lines(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === view));
  document.querySelectorAll(".nav-link").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  document.getElementById("view-title").textContent = {
    dashboard: "Dashboard",
    clients: "Clients",
    audit365: "365 Audit",
    invoices: "Invoices",
    quotes: "Quotes",
    payments: "Payments",
    exports: "Year-End Export"
  }[view];
  render();
}

function render() {
  renderDashboard();
  renderClients();
  renderAudit365();
  renderInvoices();
  renderQuotes();
  renderPayments();
  renderExports();
}

function renderDashboard() {
  const invoices = state.invoices;
  const open = invoices.filter(inv => computedInvoiceStatus(inv) !== "paid").reduce((sum, inv) => sum + invoiceTotal(inv) - paidAmount(inv.id), 0);
  const paid = state.payments.filter(p => String(p.date).startsWith(String(year))).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const msp = state.clients.filter(c => c.status === "active").reduce((sum, client) => sum + currentMspTotal(client.id), 0);
  const draftQuotes = state.quotes.filter(q => q.status === "draft").length;

  document.getElementById("metric-open").textContent = money.format(open);
  document.getElementById("metric-paid").textContent = money.format(paid);
  document.getElementById("metric-msp").textContent = money.format(msp);
  document.getElementById("metric-quotes").textContent = draftQuotes;

  document.getElementById("dashboard-invoices").innerHTML = invoices
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(inv => `
      <div class="item">
        <div class="item-line">
          <strong>${escapeHtml(inv.number)}</strong>
          <span class="badge ${computedInvoiceStatus(inv)}">${computedInvoiceStatus(inv)}</span>
        </div>
        <div class="item-line subtle">
          <span>${escapeHtml(clientName(inv.clientId))}</span>
          <span>${money.format(invoiceTotal(inv))}</span>
        </div>
      </div>
    `).join("") || `<p class="subtle">No invoices yet.</p>`;

  const activity = [
    ...state.payments.map(p => ({ date: p.date, text: `Payment ${money.format(Number(p.amount || 0))} for ${invoiceNumber(p.invoiceId)}` })),
    ...state.quotes.map(q => ({ date: q.date, text: `Quote ${q.number} ${q.status}` }))
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  document.getElementById("dashboard-activity").innerHTML = activity.map(item => `
    <div class="item">
      <strong>${escapeHtml(item.text)}</strong>
      <div class="subtle">${formatDate(item.date)}</div>
    </div>
  `).join("") || `<p class="subtle">No activity yet.</p>`;
}

function invoiceNumber(invoiceId) {
  return state.invoices.find(inv => inv.id === invoiceId)?.number || "unlinked invoice";
}

function renderClients() {
  document.getElementById("client-list").innerHTML = state.clients.map(client => {
    const audit = latestAudit(client.id, today.slice(0, 7));
    const monthly = currentMspTotal(client.id);
    return `
      <article class="item">
        <div class="item-line">
          <strong>${escapeHtml(client.name)}</strong>
          <span class="badge ${client.status}">${escapeHtml(client.status)}</span>
        </div>
        <p class="subtle">${lines(client.billTo)}</p>
        <div class="item-line">
          <span>${audit ? "Current audit MSP" : "Baseline MSP"}</span>
          <strong>${money.format(monthly)}</strong>
        </div>
        <div class="row-actions">
          <button data-edit-client="${client.id}">Edit</button>
          <button data-client-invoice="${client.id}">Invoice</button>
          <button data-client-quote="${client.id}">Quote</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderAudit365() {
  const clientSelect = document.getElementById("audit-client");
  if (!clientSelect) return;
  const selectedClient = clientSelect.value || state.clients[0]?.id || "";
  clientSelect.innerHTML = state.clients.map(c => `<option value="${c.id}" ${selectedClient === c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("");
  if (!document.getElementById("audit-month").value) document.getElementById("audit-month").value = today.slice(0, 7);

  const selectedMonth = document.getElementById("audit-month").value || today.slice(0, 7);
  const audit = latestAudit(selectedClient, selectedMonth);
  const counts = audit?.counts || {};
  const total = audit ? auditInvoiceItems(audit).reduce((sum, item) => sum + item.qty * item.rate, 0) : 0;
  document.getElementById("audit-full").textContent = counts["Full Suite"] || 0;
  document.getElementById("audit-light").textContent = counts["Email User"] || 0;
  document.getElementById("audit-service").textContent = counts["Service Account"] || 0;
  document.getElementById("audit-total").textContent = money.format(total);
  const auditStatus = document.getElementById("audit-status");
  if (auditStatus) {
    auditStatus.className = "audit-status";
    if (!audit) {
      auditStatus.textContent = "No audit imported for this client/month yet.";
    } else if (audit.reviewCount) {
      auditStatus.classList.add("review");
      auditStatus.textContent = `${audit.reviewCount} row${audit.reviewCount === 1 ? "" : "s"} need review before invoicing.`;
    } else {
      auditStatus.classList.add("ready");
      auditStatus.textContent = `${audit.rows.length} rows imported. Ready to create invoice.`;
    }
  }

  document.getElementById("audit-summary").innerHTML = audit ? `
    <div class="item">
      <div class="item-line"><strong>${escapeHtml(clientName(audit.clientId))} ${escapeHtml(audit.month)}</strong><span class="badge">${audit.rows.length} rows</span></div>
      <div class="item-line"><span>Ready billable users</span><strong>${audit.readyCount}</strong></div>
      <div class="item-line"><span>Needs review</span><strong>${audit.reviewCount}</strong></div>
      <div class="item-line"><span>Excluded / not billable</span><strong>${audit.excludedCount}</strong></div>
      <div class="item-line"><span>Copilot add-ons</span><strong>${counts["Copilot Add-on"] || 0}</strong></div>
    </div>
    ${audit.invoiceId ? `<div class="item"><strong>Invoice created</strong><div class="subtle">${escapeHtml(invoiceNumber(audit.invoiceId))}</div></div>` : ""}
  ` : `<div class="item"><strong>No audit imported yet.</strong><div class="subtle">Import the Microsoft 365 license CSV from the admin export or Graph pull.</div></div>`;

  const reviewRows = audit?.rows.filter(row => row.status === "Review") || [];
  document.getElementById("audit-review").innerHTML = reviewRows.length ? reviewRows.map(row => `
    <div class="item">
      <strong>${escapeHtml(row.displayName || row.upn)}</strong>
      <div class="subtle">${escapeHtml(row.upn)}</div>
      <div>${escapeHtml(row.reason)}</div>
    </div>
  `).join("") : `<div class="item"><strong>No review rows.</strong><div class="subtle">The imported audit is ready to invoice.</div></div>`;

  const rows = audit?.rows || [];
  document.getElementById("audit-users").innerHTML = `
    <table>
      <thead><tr><th>User</th><th>UPN</th><th>Licenses</th><th>Tier</th><th>Copilot</th><th>Status</th><th class="num">Amount</th></tr></thead>
      <tbody>${rows.map(row => `
        <tr>
          <td>${escapeHtml(row.displayName)}</td>
          <td>${escapeHtml(row.upn)}</td>
          <td>${escapeHtml(row.licenses)}</td>
          <td>${escapeHtml(row.tier)}</td>
          <td>${row.hasCopilot ? "Yes" : "No"}</td>
          <td><span class="badge ${row.status.toLowerCase()}">${escapeHtml(row.status)}</span></td>
          <td class="num">${money.format(row.amount)}</td>
        </tr>
      `).join("") || `<tr><td colspan="7">Import a CSV to classify Microsoft 365 users.</td></tr>`}</tbody>
    </table>
  `;
}

function latestAudit(clientId, month = "") {
  return state.audits365
    .filter(audit => (!clientId || audit.clientId === clientId) && (!month || audit.month === month))
    .slice()
    .sort((a, b) => `${b.month}-${b.createdAt}`.localeCompare(`${a.month}-${a.createdAt}`))[0];
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some(value => value.trim())) rows.push(row);
  const headers = rows.shift()?.map(header => header.trim()) || [];
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function classify365Row(raw) {
  const displayName = raw["Display Name"] || raw.displayName || raw.name || "";
  const upn = raw["User Principal Name"] || raw.userPrincipalName || raw.mail || "";
  const licenses = raw["License Names"] || raw.licenses || raw.assignedLicenses || "";
  const enabledText = raw["Account Enabled"] || raw.accountEnabled || "TRUE";
  const enabled = !["false", "no", "0", "disabled"].includes(String(enabledText).toLowerCase());
  const search = `${displayName} ${upn} ${licenses} ${raw["Job Title"] || ""} ${raw.Notes || ""}`.toLowerCase();
  let tier = "Needs Review";
  let status = "Ready";
  let reason = "Billable";

  if (!enabled || !licenses || upn.toLowerCase().includes("#ext#")) {
    tier = "Not Billable";
    status = "Excluded";
    reason = !enabled ? "Disabled account" : "External or unlicensed account";
  } else if (["service", "scanner", "scan", "copier", "printer", "shared", "no-reply", "noreply", "relay", "info@"].some(marker => search.includes(marker))) {
    tier = "Service Account";
  } else if (/(Business|E3|E5|O365_BUSINESS|STANDARDPACK)/i.test(licenses)) {
    tier = "Full Suite";
  } else if (/Exchange/i.test(licenses)) {
    tier = "Email User";
  } else {
    status = "Review";
    reason = "License not recognized";
  }

  const hasCopilot = /Copilot/i.test(licenses);
  const baseRate = status === "Ready" ? ({ "Service Account": 10, "Email User": 20, "Full Suite": 70 }[tier] || 0) : 0;
  const copilotRate = status === "Ready" && hasCopilot ? 30 : 0;
  return {
    displayName,
    upn,
    licenses,
    tier,
    hasCopilot,
    status,
    reason,
    amount: baseRate + copilotRate
  };
}

function buildAudit(clientId, month, rows) {
  const classified = rows.filter(row => row["User Principal Name"] || row.userPrincipalName || row.mail).map(classify365Row);
  const counts = {};
  for (const row of classified) {
    if (row.status === "Ready") {
      counts[row.tier] = (counts[row.tier] || 0) + 1;
      if (row.hasCopilot) counts["Copilot Add-on"] = (counts["Copilot Add-on"] || 0) + 1;
    }
  }
  return {
    id: id("audit365"),
    clientId,
    month,
    createdAt: new Date().toISOString(),
    source: "CSV import",
    rows: classified,
    counts,
    readyCount: classified.filter(row => row.status === "Ready").length,
    reviewCount: classified.filter(row => row.status === "Review").length,
    excludedCount: classified.filter(row => row.status === "Excluded").length
  };
}

function auditInvoiceItems(audit) {
  const counts = audit.counts || {};
  const recurringCredits = state.serviceAgreements
    .filter(service => service.clientId === audit.clientId && service.active && Number(service.rate || 0) < 0)
    .map(service => ({ description: service.name, qty: Number(service.qty || 1), rate: Number(service.rate || 0) }));
  return [
    { description: "Monthly IT (Full User)", qty: counts["Full Suite"] || 0, rate: 70 },
    { description: "Monthly IT (Light User)", qty: counts["Email User"] || 0, rate: 20 },
    { description: "Monthly IT (Service Account)", qty: counts["Service Account"] || 0, rate: 10 },
    { description: "Copilot Add-on license billing", qty: counts["Copilot Add-on"] || 0, rate: 30 },
    ...recurringCredits
  ].filter(item => item.qty || item.rate < 0);
}

function createInvoiceFromAudit() {
  const clientId = document.getElementById("audit-client").value;
  const month = document.getElementById("audit-month").value || today.slice(0, 7);
  const audit = latestAudit(clientId, month);
  if (!audit) return;
  const client = clientById(audit.clientId);
  const slug = (client?.name || "CLIENT").split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
  const invoice = {
    id: id("inv"),
    number: `GSV-${slug}-${audit.month}`,
    clientId: audit.clientId,
    date: today,
    dueDate: addDays(today, 15),
    month: audit.month,
    status: audit.reviewCount ? "draft" : "sent",
    type: "Monthly MSP",
    items: auditInvoiceItems(audit),
    notes: audit.reviewCount ? `${audit.reviewCount} Microsoft 365 audit rows need review before sending.` : ""
  };
  state.invoices.push(invoice);
  audit.invoiceId = invoice.id;
  saveState();
  setView("invoices");
}

function renderInvoices() {
  const filter = document.getElementById("invoice-filter").value;
  const rows = state.invoices
    .filter(inv => filter === "all" || computedInvoiceStatus(inv) === filter)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(inv => {
      const status = computedInvoiceStatus(inv);
      const total = invoiceTotal(inv);
      const paid = paidAmount(inv.id);
      return `
        <tr>
          <td><strong>${escapeHtml(inv.number)}</strong><br><span class="subtle">${escapeHtml(inv.type || "")}</span></td>
          <td>${escapeHtml(clientName(inv.clientId))}</td>
          <td>${formatDate(inv.date)}</td>
          <td>${formatDate(inv.dueDate)}</td>
          <td><span class="badge ${status}">${status}</span></td>
          <td class="num">${money.format(total)}</td>
          <td class="num">${money.format(paid)}</td>
          <td>
            <div class="row-actions">
              <button data-preview-invoice="${inv.id}">Preview</button>
              <button data-edit-invoice="${inv.id}">Edit</button>
              <button data-pay-invoice="${inv.id}">Pay</button>
              <button class="danger ghost" data-delete-invoice="${inv.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  document.getElementById("invoice-list").innerHTML = `
    <table>
      <thead><tr><th>Invoice</th><th>Client</th><th>Date</th><th>Due</th><th>Status</th><th class="num">Total</th><th class="num">Paid</th><th>Actions</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="8">No invoices found.</td></tr>`}</tbody>
    </table>
  `;
}

function renderQuotes() {
  const rows = state.quotes
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(quote => `
      <tr>
        <td><strong>${escapeHtml(quote.number)}</strong><br><span class="subtle">${escapeHtml(quote.title || "")}</span></td>
        <td>${escapeHtml(clientName(quote.clientId))}</td>
        <td>${formatDate(quote.date)}</td>
        <td><span class="badge ${quote.status}">${escapeHtml(quote.status)}</span></td>
        <td class="num">${money.format(invoiceTotal(quote))}</td>
        <td>
          <div class="row-actions">
            <button data-preview-quote="${quote.id}">Preview</button>
            <button data-edit-quote="${quote.id}">Edit</button>
            <button data-convert-quote="${quote.id}">Convert</button>
          </div>
        </td>
      </tr>
    `).join("");
  document.getElementById("quote-list").innerHTML = `
    <table>
      <thead><tr><th>Quote</th><th>Client</th><th>Date</th><th>Status</th><th class="num">Total</th><th>Actions</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="6">No quotes yet.</td></tr>`}</tbody>
    </table>
  `;
}

function renderPayments() {
  const rows = state.payments
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(payment => `
      <tr>
        <td>${formatDate(payment.date)}</td>
        <td>${escapeHtml(invoiceNumber(payment.invoiceId))}</td>
        <td>${escapeHtml(clientName(state.invoices.find(inv => inv.id === payment.invoiceId)?.clientId))}</td>
        <td>${escapeHtml(payment.method)}</td>
        <td>${escapeHtml(payment.reference || "")}</td>
        <td class="num">${money.format(Number(payment.amount || 0))}</td>
        <td>${escapeHtml(payment.notes || "")}</td>
      </tr>
    `).join("");
  document.getElementById("payment-list").innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Invoice</th><th>Client</th><th>Method</th><th>Check #</th><th class="num">Amount</th><th>Notes</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7">No payments recorded.</td></tr>`}</tbody>
    </table>
  `;
}

function renderExports() {
  const rows = state.invoices.map(inv => `
    <tr>
      <td>${escapeHtml(inv.number)}</td>
      <td>${escapeHtml(clientName(inv.clientId))}</td>
      <td>${formatDate(inv.date)}</td>
      <td>${computedInvoiceStatus(inv)}</td>
      <td class="num">${money.format(invoiceTotal(inv))}</td>
      <td class="num">${money.format(paidAmount(inv.id))}</td>
    </tr>
  `).join("");
  document.getElementById("export-preview").innerHTML = `
    <table>
      <thead><tr><th>Invoice #</th><th>Client</th><th>Date</th><th>Status</th><th class="num">Invoice Total</th><th class="num">Paid</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function openEditor(mode, existing = {}) {
  editing = { mode, id: existing.id };
  const dialog = document.getElementById("editor");
  const fields = document.getElementById("editor-fields");
  const deleteButton = document.getElementById("editor-delete");
  document.getElementById("editor-title").textContent = editorTitle(mode);
  fields.className = mode === "invoice" || mode === "quote" ? "form-grid invoice-editor" : "form-grid";
  fields.innerHTML = editorFields(mode, existing);
  deleteButton.hidden = !(mode === "invoice" && existing.id);
  dialog.showModal();
  updateEditorTotal();
}

function editorTitle(mode) {
  return {
    client: "Client",
    invoice: "Invoice",
    quote: "Quote",
    payment: "Payment"
  }[mode] || "Edit";
}

function clientOptions(selected) {
  return state.clients.map(c => `<option value="${c.id}" ${selected === c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("");
}

function invoiceOptions(selected) {
  return state.invoices.map(inv => `<option value="${inv.id}" ${selected === inv.id ? "selected" : ""}>${escapeHtml(inv.number)} - ${escapeHtml(clientName(inv.clientId))}</option>`).join("");
}

function editorFields(mode, item) {
  if (mode === "client") {
    return `
      ${field("name", "Client Name", item.name || "")}
      ${field("status", "Status", item.status || "active")}
      ${field("email", "Email", item.email || "")}
      ${field("phone", "Phone", item.phone || "")}
      ${field("terms", "Terms", item.terms || "Net 15")}
      ${textarea("billTo", "Bill To", item.billTo || "", true)}
      ${textarea("notes", "Notes", item.notes || "", true)}
    `;
  }
  if (mode === "invoice" || mode === "quote") {
    const numberPrefix = mode === "invoice" ? "GSV-INV" : "GSV-Q";
    const title = typeLabel(mode);
    return `
      <div class="invoice-edit-head full">
        <div>
          <img class="invoice-edit-logo" src="assets/gsv-logo.png" alt="Golden State Visions">
          <div class="invoice-edit-contact">
            <p>info@gsvisions.com</p>
            <p>(916) 432-3373</p>
          </div>
        </div>
        <div class="invoice-edit-meta">
          <h3>${title}</h3>
          ${field("number", mode === "invoice" ? "Invoice #" : "Quote #", item.number || `${numberPrefix}-${String(Date.now()).slice(-6)}`)}
          ${field("date", "Date", item.date || today, "date")}
          ${mode === "invoice" ? field("dueDate", "Due Date", item.dueDate || addDays(today, 15), "date") : field("title", "Project / Quote Title", item.title || "")}
          ${select("status", "Status", statusOptions(mode, item.status), false)}
        </div>
      </div>
      <div class="invoice-edit-bill full">
        ${select("clientId", "Bill To", clientOptions(item.clientId), false)}
        <div class="invoice-edit-address">${lines(clientById(item.clientId)?.billTo || clientById(item.clientId)?.name || "Select a client")}</div>
      </div>
      <div class="invoice-edit-section full">
        <h3>${mode === "quote" ? escapeHtml(item.title || "Project Quote") : "Monthly IT Services"}</h3>
        <div class="line-editor" id="line-editor">
          <div class="line-editor-head"><span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span><span></span></div>
          <div id="line-editor-rows">
            ${lineEditorRows(item.items || [])}
          </div>
        </div>
        <div class="line-editor-tools">
          <button id="add-line-item" type="button">Add Row</button>
        </div>
        <div class="invoice-edit-total"><span>Total Due</span><strong id="editor-total">$0</strong></div>
      </div>
      ${textarea("notes", "Notes", item.notes || "", true)}
    `;
  }
  if (mode === "payment") {
    return `
      ${select("invoiceId", "Invoice", invoiceOptions(item.invoiceId), false)}
      ${field("date", "Payment Date", item.date || today, "date")}
      ${field("amount", "Amount", item.amount || "", "number")}
      ${field("method", "Method", item.method || "Check")}
      ${field("reference", "Check # / Reference", item.reference || "")}
      ${textarea("notes", "Notes", item.notes || "", true)}
    `;
  }
  return "";
}

function statusOptions(mode, selected) {
  const values = mode === "quote" ? ["draft", "sent", "approved", "declined", "converted"] : ["draft", "sent", "paid"];
  return values.map(v => `<option value="${v}" ${selected === v ? "selected" : ""}>${v}</option>`).join("");
}

function typeLabel(mode) {
  return mode === "quote" ? "QUOTE" : "INVOICE";
}

function field(name, label, value, type = "text") {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}"></div>`;
}

function textarea(name, label, value, full = false) {
  return `<div class="field ${full ? "full" : ""}"><label for="${name}">${label}</label><textarea id="${name}" name="${name}">${escapeHtml(value)}</textarea></div>`;
}

function select(name, label, options, full = false) {
  return `<div class="field ${full ? "full" : ""}"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options}</select></div>`;
}

function lineEditorRows(items) {
  const source = items.length ? items : [{ description: "", qty: 1, rate: 0 }];
  return source.map(item => lineEditorRow(item)).join("");
}

function lineEditorRow(item = {}) {
  return `
    <div class="line-editor-row">
      <input name="itemDescription" aria-label="Description" value="${escapeHtml(item.description || "")}">
      <input name="itemQty" aria-label="Quantity" type="number" step="0.01" min="0" value="${escapeHtml(item.qty ?? 1)}">
      <input name="itemRate" aria-label="Rate" type="number" step="0.01" value="${escapeHtml(item.rate ?? 0)}">
      <output class="line-amount">${money.format(Number(item.qty || 0) * Number(item.rate || 0))}</output>
      <button type="button" class="icon danger" data-remove-line aria-label="Remove line item">×</button>
    </div>
  `;
}

function editorLineItems() {
  return [...document.querySelectorAll("#line-editor-rows .line-editor-row")]
    .map(row => ({
      description: row.querySelector('[name="itemDescription"]').value.trim(),
      qty: Number(row.querySelector('[name="itemQty"]').value || 0),
      rate: Number(row.querySelector('[name="itemRate"]').value || 0)
    }))
    .filter(item => item.description || item.qty || item.rate);
}

function updateEditorTotal() {
  const totalNode = document.getElementById("editor-total");
  if (!totalNode) return;
  let total = 0;
  document.querySelectorAll("#line-editor-rows .line-editor-row").forEach(row => {
    const qty = Number(row.querySelector('[name="itemQty"]').value || 0);
    const rate = Number(row.querySelector('[name="itemRate"]').value || 0);
    const amount = qty * rate;
    row.querySelector(".line-amount").textContent = money.format(amount);
    total += amount;
  });
  totalNode.textContent = money.format(total);
}

function itemsToText(items) {
  return items.map(item => `${item.description} | ${item.qty} | ${item.rate}`).join("\n");
}

function textToItems(text) {
  return text.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const [description, qty, rate] = line.split("|").map(part => part.trim());
    return { description, qty: Number(qty || 1), rate: Number(rate || 0) };
  });
}

function addDays(dateText, days) {
  const d = new Date(`${dateText}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function saveEditor() {
  const form = document.getElementById("editor-form");
  const data = Object.fromEntries(new FormData(form).entries());
  if (editing.mode === "client") {
    const client = {
      id: editing.id || id("client"),
      name: data.name,
      status: data.status || "active",
      email: data.email,
      phone: data.phone,
      terms: data.terms,
      billTo: data.billTo,
      notes: data.notes
    };
    upsert(state.clients, client);
  }
  if (editing.mode === "invoice") {
    const invoice = {
      id: editing.id || id("inv"),
      number: data.number,
      clientId: data.clientId,
      date: data.date,
      dueDate: data.dueDate,
      month: data.date?.slice(0, 7),
      status: data.status,
      type: "Manual",
      items: editorLineItems(),
      notes: data.notes
    };
    upsert(state.invoices, invoice);
  }
  if (editing.mode === "quote") {
    const quote = {
      id: editing.id || id("quote"),
      number: data.number,
      clientId: data.clientId,
      date: data.date,
      title: data.title,
      status: data.status,
      items: editorLineItems(),
      notes: data.notes
    };
    upsert(state.quotes, quote);
  }
  if (editing.mode === "payment") {
    const payment = {
      id: editing.id || id("pay"),
      invoiceId: data.invoiceId,
      date: data.date,
      amount: Number(data.amount || 0),
      method: data.method || "Check",
      reference: data.reference,
      notes: data.notes
    };
    upsert(state.payments, payment);
    const invoice = state.invoices.find(inv => inv.id === payment.invoiceId);
    if (invoice && paidAmount(invoice.id) >= invoiceTotal(invoice)) invoice.status = "paid";
  }
  saveState();
  document.getElementById("editor").close();
  render();
}

function upsert(collection, item) {
  const index = collection.findIndex(existing => existing.id === item.id);
  if (index >= 0) collection[index] = item;
  else collection.push(item);
}

function deleteInvoice(invoiceId) {
  const invoice = state.invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return;
  const ok = window.confirm(`Delete invoice ${invoice.number}? This will also remove payments linked to this invoice.`);
  if (!ok) return;
  state.invoices = state.invoices.filter(inv => inv.id !== invoiceId);
  state.payments = state.payments.filter(payment => payment.invoiceId !== invoiceId);
  state.audits365.forEach(audit => {
    if (audit.invoiceId === invoiceId) audit.invoiceId = "";
  });
  saveState();
  const editor = document.getElementById("editor");
  if (editor.open) editor.close();
  render();
}

function generateMonthlyInvoice() {
  const client = state.clients.find(c => c.status === "active") || state.clients[0];
  if (!client) return;
  const month = new Date().toISOString().slice(0, 7);
  const audit = latestAudit(client.id, month);
  if (!audit) {
    setView("audit365");
    document.getElementById("audit-client").value = client.id;
    document.getElementById("audit-month").value = month;
    renderAudit365();
    window.alert("Import this month's Microsoft 365 audit before generating the monthly MSP invoice.");
    return;
  }
  const invoice = {
    id: id("inv"),
    number: `GSV-${client.name.split(/\s+/)[0].toUpperCase()}-${month}`,
    clientId: client.id,
    date: today,
    dueDate: addDays(today, 15),
    month,
    status: audit.reviewCount ? "draft" : "sent",
    type: "Monthly MSP",
    items: auditInvoiceItems(audit),
    notes: audit.reviewCount ? `${audit.reviewCount} Microsoft 365 audit rows need review before sending.` : ""
  };
  state.invoices.push(invoice);
  audit.invoiceId = invoice.id;
  saveState();
  setView("invoices");
}

function convertQuote(quoteId) {
  const quote = state.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  const invoice = {
    id: id("inv"),
    number: quote.number.replace("GSV-Q", "GSV-INV"),
    clientId: quote.clientId,
    date: today,
    dueDate: addDays(today, 15),
    month: today.slice(0, 7),
    status: "draft",
    type: "Project",
    items: structuredClone(quote.items),
    notes: quote.notes
  };
  quote.status = "converted";
  state.invoices.push(invoice);
  saveState();
  setView("invoices");
}

function previewDocument(type, idValue) {
  const doc = type === "quote" ? state.quotes.find(q => q.id === idValue) : state.invoices.find(inv => inv.id === idValue);
  if (!doc) return;
  const client = clientById(doc.clientId);
  document.getElementById("document-title").textContent = type === "quote" ? "Quote" : "Invoice";
  document.getElementById("document-body").innerHTML = renderDocument(type, doc, client);
  document.getElementById("document-preview").showModal();
}

function renderDocument(type, doc, client) {
  const title = type === "quote" ? "QUOTE" : "INVOICE";
  return `
    <div class="doc">
      <div class="doc-head">
        <div>
          <img class="doc-logo" src="assets/gsv-logo.png" alt="Golden State Visions">
          <div class="doc-contact">
            <p>info@gsvisions.com</p>
            <p>(916) 432-3373</p>
          </div>
        </div>
        <div class="doc-title">
          <h2>${title}</h2>
          <div class="doc-meta">
            <strong>${title === "QUOTE" ? "Quote #" : "Invoice #"}</strong><span>${escapeHtml(doc.number)}</span>
            <strong>Date</strong><span>${escapeHtml(doc.date)}</span>
            ${type === "invoice" ? `<strong>Due Date</strong><span>${escapeHtml(doc.dueDate)}</span><strong>Invoice Month</strong><span>${escapeHtml(doc.month || "")}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="doc-block">
        <table class="doc-table">
          <thead><tr><th colspan="4">Bill To</th></tr></thead>
          <tbody><tr><td colspan="4">${lines(client?.billTo || client?.name || "")}</td></tr></tbody>
        </table>
      </div>
      <div class="doc-block">
        <h2>${type === "quote" ? escapeHtml(doc.title || "Project Quote") : "Monthly IT Services"}</h2>
        <table class="doc-table">
          <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            ${doc.items.map(item => `
              <tr>
                <td>${escapeHtml(item.description)}</td>
                <td class="center">${item.qty || ""}</td>
                <td class="center">${money.format(Number(item.rate || 0))}</td>
                <td class="center">${money.format(Number(item.qty || 0) * Number(item.rate || 0))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="doc-total"><span>Total Due</span><strong>${money.format(invoiceTotal(doc))}</strong></div>
      </div>
    </div>
  `;
}

function exportCsv(name, rows) {
  const csv = rows.map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function exportInvoices() {
  exportCsv(`gsv-invoices-${year}.csv`, [
    ["Invoice Date", "Invoice #", "Client", "Type", "Status", "Due Date", "Total", "Paid", "Balance"],
    ...state.invoices.map(inv => {
      const total = invoiceTotal(inv);
      const paid = paidAmount(inv.id);
      return [inv.date, inv.number, clientName(inv.clientId), inv.type, computedInvoiceStatus(inv), inv.dueDate, total, paid, total - paid];
    })
  ]);
}

function exportPayments() {
  exportCsv(`gsv-payments-${year}.csv`, [
    ["Payment Date", "Invoice #", "Client", "Method", "Check #", "Amount", "Notes"],
    ...state.payments.map(p => {
      const inv = state.invoices.find(invoice => invoice.id === p.invoiceId);
      return [p.date, inv?.number || "", inv ? clientName(inv.clientId) : "", p.method, p.reference, p.amount, p.notes];
    })
  ]);
}

function exportSummary() {
  const byClient = new Map();
  state.invoices.forEach(inv => {
    const name = clientName(inv.clientId);
    byClient.set(name, (byClient.get(name) || 0) + invoiceTotal(inv));
  });
  exportCsv(`gsv-revenue-summary-${year}.csv`, [
    ["Client", "Invoice Total"],
    ...Array.from(byClient.entries())
  ]);
}

function snapshot() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gsv-billing-hub-backup-${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function restore(file) {
  const reader = new FileReader();
  reader.onload = () => {
    state = JSON.parse(reader.result);
    saveState();
    render();
  };
  reader.readAsText(file);
}

async function pullMicrosoft365Audit() {
  const clientId = document.getElementById("audit-client").value || state.clients[0]?.id;
  const month = document.getElementById("audit-month").value || today.slice(0, 7);
  const status = document.getElementById("audit-status");
  const button = document.getElementById("audit-pull-graph");

  if (status) {
    status.className = "audit-status";
    status.textContent = "Pulling current Microsoft 365 license data...";
  }
  if (button) {
    button.disabled = true;
    button.textContent = "Pulling...";
  }

  try {
    const response = await fetch("/api/m365-audit", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Microsoft 365 pull failed.");

    const audit = buildAudit(clientId, month, data.rows || []);
    audit.source = data.source || "Microsoft Graph";
    audit.pulledAt = data.pulledAt || new Date().toISOString();
    state.audits365.push(audit);
    saveState();
    renderAudit365();
  } catch (error) {
    if (status) {
      status.className = "audit-status review";
      status.textContent = error instanceof Error ? error.message : "Microsoft 365 pull failed.";
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Pull from Microsoft 365";
    }
  }
}

function importAuditCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const clientId = document.getElementById("audit-client").value || state.clients[0]?.id;
    const month = document.getElementById("audit-month").value || today.slice(0, 7);
    const rows = parseCsv(String(reader.result || ""));
    const audit = buildAudit(clientId, month, rows);
    state.audits365.push(audit);
    saveState();
    renderAudit365();
  };
  reader.readAsText(file);
}

document.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.view) setView(target.dataset.view);
  if (target.dataset.viewJump) setView(target.dataset.viewJump);
  if (target.id === "new-invoice") openEditor("invoice", { date: today, dueDate: addDays(today, 15), status: "draft", items: [] });
  if (target.id === "new-quote" || target.id === "add-quote") openEditor("quote", { date: today, status: "draft", items: [] });
  if (target.id === "add-client") openEditor("client", { status: "active", terms: "Net 15" });
  if (target.id === "record-payment") openEditor("payment", { date: today, method: "Check" });
  if (target.id === "generate-monthly") generateMonthlyInvoice();
  if (target.id === "audit-create-invoice") createInvoiceFromAudit();
  if (target.id === "audit-pull-graph") pullMicrosoft365Audit();
  if (target.id === "add-line-item") {
    document.getElementById("line-editor-rows")?.insertAdjacentHTML("beforeend", lineEditorRow());
    updateEditorTotal();
  }
  if (target.dataset.removeLine !== undefined) {
    const rows = document.querySelectorAll("#line-editor-rows .line-editor-row");
    if (rows.length > 1) target.closest(".line-editor-row")?.remove();
    else target.closest(".line-editor-row")?.querySelectorAll("input").forEach(input => input.value = input.name === "itemQty" ? "1" : "");
    updateEditorTotal();
  }
  if (target.id === "editor-delete" && editing.mode === "invoice" && editing.id) deleteInvoice(editing.id);
  if (target.id === "editor-save") saveEditor();
  if (target.id === "close-preview") document.getElementById("document-preview").close();
  if (target.id === "print-document") window.print();
  if (target.id === "save-snapshot") snapshot();
  if (target.id === "export-invoices") exportInvoices();
  if (target.id === "export-payments") exportPayments();
  if (target.id === "export-summary") exportSummary();
  if (target.dataset.editClient) openEditor("client", state.clients.find(c => c.id === target.dataset.editClient));
  if (target.dataset.clientInvoice) openEditor("invoice", { clientId: target.dataset.clientInvoice, date: today, dueDate: addDays(today, 15), status: "draft", items: [] });
  if (target.dataset.clientQuote) openEditor("quote", { clientId: target.dataset.clientQuote, date: today, status: "draft", items: [] });
  if (target.dataset.editInvoice) openEditor("invoice", state.invoices.find(inv => inv.id === target.dataset.editInvoice));
  if (target.dataset.deleteInvoice) deleteInvoice(target.dataset.deleteInvoice);
  if (target.dataset.editQuote) openEditor("quote", state.quotes.find(q => q.id === target.dataset.editQuote));
  if (target.dataset.payInvoice) {
    const inv = state.invoices.find(invoice => invoice.id === target.dataset.payInvoice);
    openEditor("payment", { invoiceId: inv.id, date: today, method: "Check", amount: invoiceTotal(inv) - paidAmount(inv.id) });
  }
  if (target.dataset.previewInvoice) previewDocument("invoice", target.dataset.previewInvoice);
  if (target.dataset.previewQuote) previewDocument("quote", target.dataset.previewQuote);
  if (target.dataset.convertQuote) convertQuote(target.dataset.convertQuote);
});

document.addEventListener("input", event => {
  if (event.target.closest("#line-editor-rows")) updateEditorTotal();
});

document.addEventListener("change", event => {
  if (event.target.id === "clientId") {
    const address = document.querySelector(".invoice-edit-address");
    const client = clientById(event.target.value);
    if (address) address.innerHTML = lines(client?.billTo || client?.name || "Select a client");
  }
  if (event.target.closest("#line-editor-rows")) updateEditorTotal();
});

document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.getElementById("invoice-filter").addEventListener("change", renderInvoices);
document.getElementById("audit-client").addEventListener("change", renderAudit365);
document.getElementById("audit-month").value = today.slice(0, 7);
document.getElementById("audit-csv").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (file) importAuditCsv(file);
  event.target.value = "";
});
document.getElementById("restore-snapshot").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (file) restore(file);
});

render();
