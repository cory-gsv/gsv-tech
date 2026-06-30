const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const costMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      m365TenantKey: "default",
      pax8CompanyId: "e1cda7ec-516c-4df1-b1cb-9baf660b4bda",
      mspRates: {
        fullUser: 70,
        lightUser: 20,
        serviceAccount: 10,
        copilot: 30
      },
      internalCosts: [],
      notes: "Pays by check."
    },
    {
      id: "client_nyssco",
      name: "New York Style Sausage Company",
      billTo: "Accounts Payable\nNew York Style Sausage Factory\n1228 Reamwood Ave\nSunnyvale, CA 94089\n408-745-7675\nap@newyorkstylesausage.com",
      email: "ap@newyorkstylesausage.com",
      phone: "408-745-7675",
      terms: "Net 15",
      status: "active",
      licenseAuditBilling: false,
      m365TenantKey: "nyssco",
      pax8CompanyId: "6e6399cf-8808-4c9c-bcce-19e6386e6589",
      mspRates: {
        fullUser: 0,
        lightUser: 0,
        serviceAccount: 0,
        copilot: 0
      },
      internalCosts: [
        { name: "NinjaOne endpoint management", source: "NinjaOne", qty: 0, unitCost: 0, active: true },
        { name: "Antivirus endpoint protection", source: "Security", qty: 0, unitCost: 0, active: true },
        { name: "NinjaOne data backup", source: "NinjaOne", qty: 0, unitCost: 0, active: true },
        { name: "Domain registration/service", source: "Domain", qty: 0, unitCost: 0, active: true }
      ],
      notes: "Microsoft 365 audit is visibility only for this client, not invoice generation. Ship/contact from June invoice: Pasquale Bitonti, pasquale@newyorkstylesausage.com."
    }
  ],
  serviceAgreements: [
    { id: "svc_moxie_full", clientId: "client_moxie", name: "Monthly IT (Full User)", qty: 7, rate: 70, active: true },
    { id: "svc_moxie_light", clientId: "client_moxie", name: "Monthly IT (Light User)", qty: 25, rate: 20, active: true },
    { id: "svc_moxie_service", clientId: "client_moxie", name: "Monthly IT (Service Account)", qty: 1, rate: 10, active: true },
    { id: "svc_moxie_copilot", clientId: "client_moxie", name: "Copilot Add-on license billing", qty: 2, rate: 30, active: true },
    { id: "svc_moxie_credit", clientId: "client_moxie", name: "Credit: Moxie-paid direct Microsoft licenses", qty: 1, rate: -164, active: true },
    { id: "svc_nyssco_monthly_it", clientId: "client_nyssco", name: "Monthly IT Support", qty: 1, rate: 2000, active: true },
    { id: "svc_nyssco_backup", clientId: "client_nyssco", name: "Managed offsite backup protection", qty: 1, rate: 175, active: true },
    { id: "svc_nyssco_o365", clientId: "client_nyssco", name: "Office 365", qty: 1, rate: 150, active: true },
    { id: "svc_nyssco_domain", clientId: "client_nyssco", name: "Domain Registration Service", qty: 1, rate: 85, active: false }
  ],
  invoices: [
    {
      id: "inv_moxie_2026_06",
      number: "GSV-MOXIE-2026-06",
      clientId: "client_moxie",
      date: "2026-06-25",
      dueDate: "2026-07-10",
      month: "2026-06",
      status: "ready",
      type: "Monthly MSP",
      items: [
        { description: "Monthly IT (Full User)", qty: 7, rate: 70 },
        { description: "Monthly IT (Light User)", qty: 25, rate: 20 },
        { description: "Monthly IT (Service Account)", qty: 1, rate: 10 },
        { description: "Copilot Add-on license billing", qty: 2, rate: 30 },
        { description: "Credit: Moxie-paid direct Microsoft licenses", qty: 1, rate: -164 }
      ],
      notes: ""
    },
    {
      id: "inv_nyssco_2026_06",
      number: "GSV-NYSSCO-2026-06",
      clientId: "client_nyssco",
      date: "2026-05-31",
      dueDate: "2026-06-15",
      month: "2026-06",
      subject: "Monthly IT Services Invoice (GSV-NYSSCO-2026-06)",
      status: "ready",
      type: "Monthly MSP",
      showShipTo: true,
      shipTo: "Pasquale Bitonti\nNew York Style Sausage Factory\n1228 Reamwood Ave\nSunnyvale, CA 94089\n408-745-7675\npasquale@newyorkstylesausage.com",
      items: [
        { description: "Monthly IT Support", qty: 1, rate: 2000 },
        { description: "Managed offsite backup protection", qty: 1, rate: 175 },
        { description: "Office 365", qty: 1, rate: 150 },
        { description: "Domain Registration Service", qty: 1, rate: 85 }
      ],
      notes: "Imported from NYSSCO Monthly IT Support - June invoice. 365 audit is visibility only for this client."
    }
  ],
  quotes: [],
  payments: [],
  audits365: [],
  pax8Costs: []
};

let state = loadState();
migrateDefaultRecords();
let activeView = "dashboard";
let editing = null;
let previewing = null;
let selectedClientId = "";

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

function migrateDefaultRecords() {
  let changed = false;
  for (const key of ["clients", "serviceAgreements", "invoices"]) {
    if (!Array.isArray(state[key])) state[key] = [];
    for (const record of defaultData[key]) {
      const existing = state[key].find(existing => existing.id === record.id);
      if (!existing) {
        state[key].push(structuredClone(record));
        changed = true;
      } else if (key === "clients") {
        for (const field of ["m365TenantKey", "pax8CompanyId", "licenseAuditBilling", "internalCosts"]) {
          if (existing[field] === undefined && record[field] !== undefined) {
            existing[field] = record[field];
            changed = true;
          }
        }
      }
    }
  }
  if (!Array.isArray(state.pax8Costs)) {
    state.pax8Costs = [];
    changed = true;
  }
  const pax8CompanyIdFixes = {
    "1933729": "e1cda7ec-516c-4df1-b1cb-9baf660b4bda",
    "1933703": "6e6399cf-8808-4c9c-bcce-19e6386e6589"
  };
  state.clients.forEach(client => {
    if (pax8CompanyIdFixes[client.pax8CompanyId]) {
      client.pax8CompanyId = pax8CompanyIdFixes[client.pax8CompanyId];
      changed = true;
    }
  });
  if (changed) saveState();
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

function clientMspRates(clientId) {
  const rates = clientById(clientId)?.mspRates || {};
  return {
    fullUser: Number(rates.fullUser ?? 70),
    lightUser: Number(rates.lightUser ?? 20),
    serviceAccount: Number(rates.serviceAccount ?? 10),
    copilot: Number(rates.copilot ?? 30)
  };
}

function invoiceTotal(invoice) {
  return invoice.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);
}

function currentMspItems(clientId, month = today.slice(0, 7)) {
  const audit = latestAudit(clientId, month);
  if (audit && clientById(clientId)?.licenseAuditBilling !== false) return auditInvoiceItems(audit);
  return state.serviceAgreements
    .filter(s => s.clientId === clientId && s.active)
    .map(s => ({ description: s.name, qty: Number(s.qty || 0), rate: Number(s.rate || 0) }));
}

function currentMspTotal(clientId, month = today.slice(0, 7)) {
  return currentMspItems(clientId, month).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);
}

function clientInvoices(clientId) {
  return state.invoices.filter(inv => inv.clientId === clientId);
}

function clientInvoiceTotal(clientId) {
  return clientInvoices(clientId).reduce((sum, inv) => sum + invoiceTotal(inv), 0);
}

function activeClientCosts(clientId) {
  return (clientById(clientId)?.internalCosts || [])
    .filter(cost => cost.active !== false)
    .map(cost => ({
      name: cost.name || "Internal cost",
      source: cost.source || "Manual",
      qty: Number(cost.qty || 0),
      unitCost: Number(cost.unitCost || 0),
      amount: Number(cost.qty || 0) * Number(cost.unitCost || 0)
    }));
}

function manualCostTotal(clientId) {
  return activeClientCosts(clientId).reduce((sum, cost) => sum + cost.amount, 0);
}

function ninjaOneCostTotal(clientId) {
  return activeClientCosts(clientId)
    .filter(cost => /ninja/i.test(`${cost.source} ${cost.name}`))
    .reduce((sum, cost) => sum + cost.amount, 0);
}

function otherManualCostTotal(clientId) {
  return manualCostTotal(clientId) - ninjaOneCostTotal(clientId);
}

function pax8CostTotal(clientId, month = today.slice(0, 7)) {
  return Number(latestPax8Costs(clientId, month)?.totals?.monthlyPartnerCost || 0);
}

function clientCostTotal(clientId, month = today.slice(0, 7)) {
  return pax8CostTotal(clientId, month) + manualCostTotal(clientId);
}

function costMargin(clientId, month = today.slice(0, 7)) {
  return currentMspTotal(clientId, month) - clientCostTotal(clientId, month);
}

function activeClientIds(clientId = "") {
  return clientId ? [clientId] : state.clients.filter(client => client.status === "active").map(client => client.id);
}

function paidAmount(invoiceId) {
  return state.payments.filter(p => p.invoiceId === invoiceId).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function computedInvoiceStatus(invoice) {
  if (invoice.status === "paid") return "paid";
  if (invoice.status === "void") return "void";
  if (invoice.status === "sent" && !invoice.sentAt) return "ready";
  if (paidAmount(invoice.id) >= invoiceTotal(invoice)) return "paid";
  if (invoice.status === "draft") return "draft";
  if (invoice.dueDate < today && invoice.status !== "draft") return "overdue";
  return invoice.status || "draft";
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
    audit365: "Services Audit",
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
  const pax8 = state.clients.filter(c => c.status === "active").reduce((sum, client) => sum + pax8CostTotal(client.id), 0);
  const ninjaOne = state.clients.filter(c => c.status === "active").reduce((sum, client) => sum + ninjaOneCostTotal(client.id), 0);
  const vendorCosts = state.clients.filter(c => c.status === "active").reduce((sum, client) => sum + otherManualCostTotal(client.id), 0);
  const draftQuotes = state.quotes.filter(q => q.status === "draft").length;

  document.getElementById("metric-open").textContent = money.format(open);
  document.getElementById("metric-paid").textContent = money.format(paid);
  document.getElementById("metric-msp").textContent = money.format(msp);
  document.getElementById("metric-pax8").textContent = costMoney.format(pax8);
  document.getElementById("metric-vendor-costs").textContent = costMoney.format(ninjaOne + vendorCosts);
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
  const detail = document.getElementById("client-detail");
  const activeClient = clientById(selectedClientId);
  detail.innerHTML = activeClient ? clientDetailDashboard(activeClient) : "";
  document.getElementById("client-list").innerHTML = state.clients.map(client => {
    const audit = latestAudit(client.id, today.slice(0, 7));
    const monthly = currentMspTotal(client.id);
    const pax8 = pax8CostTotal(client.id);
    const ninjaOne = ninjaOneCostTotal(client.id);
    const manual = otherManualCostTotal(client.id);
    const margin = costMargin(client.id);
    const invoices = clientInvoices(client.id);
    const open = invoices.filter(inv => computedInvoiceStatus(inv) !== "paid").reduce((sum, inv) => sum + invoiceTotal(inv) - paidAmount(inv.id), 0);
    return `
      <article class="item client-card ${selectedClientId === client.id ? "selected" : ""}" data-client-dashboard-card="${client.id}">
        <div class="item-line">
          <strong>${escapeHtml(client.name)}</strong>
          <span class="badge ${client.status}">${escapeHtml(client.status)}</span>
        </div>
        <div class="client-card-metrics">
          <div><span>Monthly billing</span><strong>${money.format(monthly)}</strong></div>
          <div><span>Pax8</span><strong>${costMoney.format(pax8)}</strong></div>
          <div><span>NinjaOne</span><strong>${costMoney.format(ninjaOne)}</strong></div>
          <div><span>Other costs</span><strong>${costMoney.format(manual)}</strong></div>
          <div><span>Est. margin</span><strong>${costMoney.format(margin)}</strong></div>
        </div>
        <div class="item-line subtle">
          <span>${audit ? `${audit.rows.length} Microsoft 365 rows` : "No current 365 audit"}</span>
          <span>${money.format(open)} open</span>
        </div>
        <div class="row-actions">
          <button data-client-dashboard="${client.id}">Dashboard</button>
          <button data-edit-client="${client.id}">Edit</button>
          <button data-audit-services="${client.id}">Audit Services</button>
          <button data-client-invoice="${client.id}">Invoice</button>
          <button data-client-quote="${client.id}">Quote</button>
        </div>
      </article>
    `;
  }).join("");
}

function clientDetailDashboard(client) {
  const month = today.slice(0, 7);
  const audit = latestAudit(client.id, month);
  const pax8 = latestPax8Costs(client.id, month);
  const costs = activeClientCosts(client.id);
  const recentInvoices = clientInvoices(client.id).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return `
    <section class="client-dashboard">
      <div class="section-head">
        <div>
          <p class="eyebrow">Client dashboard</p>
          <h2>${escapeHtml(client.name)}</h2>
        </div>
        <div class="toolbar">
          <button data-audit-services="${client.id}" class="primary">Audit Services</button>
          <button data-edit-client="${client.id}">Edit Client</button>
        </div>
      </div>
      <div class="metric-grid client-metrics">
        <article class="metric"><span>Monthly Billing</span><strong>${money.format(currentMspTotal(client.id))}</strong></article>
        <article class="metric"><span>Pax8 Cost</span><strong>${costMoney.format(pax8CostTotal(client.id))}</strong></article>
        <article class="metric"><span>NinjaOne Cost</span><strong>${costMoney.format(ninjaOneCostTotal(client.id))}</strong></article>
        <article class="metric"><span>Other Vendor Costs</span><strong>${costMoney.format(otherManualCostTotal(client.id))}</strong></article>
        <article class="metric"><span>Estimated Margin</span><strong>${costMoney.format(costMargin(client.id))}</strong></article>
      </div>
      <div class="split">
        <section>
          <div class="section-head"><h2>Services Audit</h2></div>
          <div class="stack">
            <div class="item"><div class="item-line"><span>Microsoft 365 users</span><strong>${audit ? audit.rows.length : "Not pulled"}</strong></div></div>
            <div class="item"><div class="item-line"><span>Pax8 subscriptions</span><strong>${pax8 ? (pax8.rows || []).length : "Not pulled"}</strong></div></div>
            <div class="item"><div class="item-line"><span>NinjaOne</span><strong>${costs.some(cost => /ninja/i.test(cost.source + cost.name)) ? "Tracked manually" : "Ready to add"}</strong></div></div>
          </div>
        </section>
        <section>
          <div class="section-head"><h2>Recent Invoices</h2></div>
          <div class="stack">
            ${recentInvoices.map(inv => `
              <div class="item">
                <div class="item-line"><strong>${escapeHtml(inv.number)}</strong><span>${money.format(invoiceTotal(inv))}</span></div>
                <div class="item-line subtle"><span>${formatDate(inv.date)}</span><span>${computedInvoiceStatus(inv)}</span></div>
              </div>
            `).join("") || `<div class="item"><strong>No invoices yet.</strong></div>`}
          </div>
        </section>
      </div>
      <div class="section-head table-heading"><h2>Tracked Vendor Costs</h2></div>
      <div class="table-card">
        <table>
          <thead><tr><th>Service</th><th>Source</th><th class="num">Qty</th><th class="num">Unit Cost</th><th class="num">Monthly Cost</th></tr></thead>
          <tbody>
            ${(pax8?.rows || []).slice(0, 8).map(row => `
              <tr><td>${escapeHtml(row.productName)}</td><td>Pax8</td><td class="num">${row.quantity}</td><td class="num">${costMoney.format(row.unitPartnerCost || 0)}</td><td class="num">${costMoney.format(row.monthlyPartnerCost || 0)}</td></tr>
            `).join("")}
            ${costs.map(cost => `
              <tr><td>${escapeHtml(cost.name)}</td><td>${escapeHtml(cost.source)}</td><td class="num">${cost.qty}</td><td class="num">${costMoney.format(cost.unitCost)}</td><td class="num">${costMoney.format(cost.amount)}</td></tr>
            `).join("")}
            ${!(pax8?.rows || []).length && !costs.length ? `<tr><td colspan="5">No costs tracked yet. Edit the client to add NinjaOne, antivirus, backup, or domain costs.</td></tr>` : ""}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAudit365() {
  const clientSelect = document.getElementById("audit-client");
  if (!clientSelect) return;
  const selectedClient = selectedClientId || clientSelect.value || state.clients[0]?.id || "";
  clientSelect.innerHTML = state.clients.map(c => `<option value="${c.id}" ${selectedClient === c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("");
  if (!document.getElementById("audit-month").value) document.getElementById("audit-month").value = today.slice(0, 7);

  const selectedMonth = document.getElementById("audit-month").value || today.slice(0, 7);
  const audit = latestAudit(selectedClient, selectedMonth);
  const pax8Cost = latestPax8Costs(selectedClient, selectedMonth);
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
  renderPax8Costs(pax8Cost, audit, selectedClient);
  renderManualServiceCosts(selectedClient);
}

function latestAudit(clientId, month = "") {
  return state.audits365
    .filter(audit => (!clientId || audit.clientId === clientId) && (!month || audit.month === month))
    .slice()
    .sort((a, b) => `${b.month}-${b.createdAt}`.localeCompare(`${a.month}-${a.createdAt}`))[0];
}

function latestPax8Costs(clientId, month = "") {
  return (state.pax8Costs || [])
    .filter(cost => (!clientId || cost.clientId === clientId) && (!month || cost.month === month))
    .slice()
    .sort((a, b) => `${b.month}-${b.createdAt}`.localeCompare(`${a.month}-${a.createdAt}`))[0];
}

function normalizedProductName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/microsoft|office|365|business|online|plan|no teams|\\(|\\)|-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assignedCountForProduct(audit, productName) {
  if (!audit) return null;
  const product = normalizedProductName(productName);
  if (!product) return null;
  const productWords = product.split(" ").filter(word => word.length > 2);
  if (!productWords.length) return null;
  return audit.rows.filter(row => {
    const license = normalizedProductName(row.licenses);
    return productWords.every(word => license.includes(word)) || license.includes(product) || product.includes(license);
  }).length;
}

function renderPax8Costs(pax8Cost, audit, clientId) {
  const container = document.getElementById("audit-pax8-costs");
  if (!container) return;
  const client = clientById(clientId);
  if (!client?.pax8CompanyId) {
    container.innerHTML = `<div class="empty-state">Add this client's Pax8 Company ID, then pull Pax8 costs.</div>`;
    return;
  }
  if (!pax8Cost) {
    container.innerHTML = `<div class="empty-state">No Pax8 costs pulled for this client/month yet.</div>`;
    return;
  }
  const rows = pax8Cost.rows || [];
  container.innerHTML = `
    <div class="cost-summary">
      <div><span>Pax8 subscriptions</span><strong>${rows.length}</strong></div>
      <div><span>Total quantity</span><strong>${pax8Cost.totals?.quantity || 0}</strong></div>
      <div><span>Monthly partner cost</span><strong>${costMoney.format(pax8Cost.totals?.monthlyPartnerCost || 0)}</strong></div>
      <div><span>Pulled</span><strong>${formatDate(String(pax8Cost.pulledAt || pax8Cost.createdAt || today).slice(0, 10))}</strong></div>
    </div>
    <table>
      <thead><tr><th>Product</th><th class="num">Pax8 Qty</th><th class="num">365 Assigned</th><th class="num">Unit Cost</th><th class="num">Monthly Cost</th><th>Status</th></tr></thead>
      <tbody>${rows.map(row => {
        const assigned = assignedCountForProduct(audit, row.productName);
        return `
          <tr>
            <td>${escapeHtml(row.productName)}</td>
            <td class="num">${Number(row.quantity || 0)}</td>
            <td class="num">${assigned === null ? "n/a" : assigned}</td>
            <td class="num">${costMoney.format(row.unitPartnerCost || 0)}</td>
            <td class="num">${costMoney.format(row.monthlyPartnerCost || 0)}</td>
            <td><span class="badge ${String(row.status || "").toLowerCase()}">${escapeHtml(row.status || "active")}</span></td>
          </tr>
        `;
      }).join("") || `<tr><td colspan="6">No active Pax8 subscriptions found.</td></tr>`}</tbody>
    </table>
  `;
}

function renderManualServiceCosts(clientId) {
  const container = document.getElementById("audit-manual-costs");
  if (!container) return;
  const costs = activeClientCosts(clientId);
  container.innerHTML = `
    <table>
      <thead><tr><th>Service</th><th>Source</th><th class="num">Qty</th><th class="num">Unit Cost</th><th class="num">Monthly Cost</th><th>Status</th></tr></thead>
      <tbody>${costs.map(cost => `
        <tr>
          <td>${escapeHtml(cost.name)}</td>
          <td>${escapeHtml(cost.source)}</td>
          <td class="num">${cost.qty}</td>
          <td class="num">${costMoney.format(cost.unitCost)}</td>
          <td class="num">${costMoney.format(cost.amount)}</td>
          <td><span class="badge ready">Tracked</span></td>
        </tr>
      `).join("") || `<tr><td colspan="6">No NinjaOne/manual service costs yet. Edit the client to add NinjaOne, antivirus, backup, domain, or other vendor costs.</td></tr>`}</tbody>
    </table>
  `;
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

function classify365Row(raw, clientId) {
  const rates = clientMspRates(clientId);
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
  const baseRate = status === "Ready" ? ({ "Service Account": rates.serviceAccount, "Email User": rates.lightUser, "Full Suite": rates.fullUser }[tier] || 0) : 0;
  const copilotRate = status === "Ready" && hasCopilot ? rates.copilot : 0;
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
  const classified = rows.filter(row => row["User Principal Name"] || row.userPrincipalName || row.mail).map(row => classify365Row(row, clientId));
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
  const rates = clientMspRates(audit.clientId);
  const recurringCredits = state.serviceAgreements
    .filter(service => service.clientId === audit.clientId && service.active && Number(service.rate || 0) < 0)
    .map(service => ({ description: service.name, qty: Number(service.qty || 1), rate: Number(service.rate || 0) }));
  return [
    { description: "Monthly IT (Full User)", qty: counts["Full Suite"] || 0, rate: rates.fullUser },
    { description: "Monthly IT (Light User)", qty: counts["Email User"] || 0, rate: rates.lightUser },
    { description: "Monthly IT (Service Account)", qty: counts["Service Account"] || 0, rate: rates.serviceAccount },
    { description: "Copilot Add-on license billing", qty: counts["Copilot Add-on"] || 0, rate: rates.copilot },
    ...recurringCredits
  ].filter(item => item.qty || item.rate < 0);
}

function createInvoiceFromAudit() {
  const clientId = document.getElementById("audit-client").value;
  const month = document.getElementById("audit-month").value || today.slice(0, 7);
  const audit = latestAudit(clientId, month);
  if (!audit) return;
  const client = clientById(audit.clientId);
  if (client?.licenseAuditBilling === false) {
    window.alert("This client's Microsoft 365 audit is visibility only. Create the monthly invoice from the client's recurring services instead.");
    return;
  }
  const slug = (client?.name || "CLIENT").split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
  const invoice = {
    id: id("inv"),
    number: `GSV-${slug}-${audit.month}`,
    clientId: audit.clientId,
    date: today,
    dueDate: addDays(today, 15),
    month: audit.month,
    status: audit.reviewCount ? "draft" : "ready",
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
  const clientFilter = document.getElementById("invoice-client-filter").value;
  const dateFrom = document.getElementById("invoice-date-from").value;
  const dateTo = document.getElementById("invoice-date-to").value;
  const search = document.getElementById("invoice-search").value.trim().toLowerCase();
  renderInvoiceClientFilter(clientFilter);
  const rows = state.invoices
    .filter(inv => filter === "all" || computedInvoiceStatus(inv) === filter)
    .filter(inv => !clientFilter || inv.clientId === clientFilter)
    .filter(inv => !dateFrom || inv.date >= dateFrom)
    .filter(inv => !dateTo || inv.date <= dateTo)
    .filter(inv => {
      if (!search) return true;
      return [inv.number, inv.type, clientName(inv.clientId), inv.status]
        .some(value => String(value || "").toLowerCase().includes(search));
    })
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
              <button data-pdf-invoice="${inv.id}">PDF</button>
              <button data-edit-invoice="${inv.id}">Edit</button>
              ${status !== "paid" && status !== "void" ? `<button data-send-invoice="${inv.id}">Send</button>` : ""}
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

function renderInvoiceClientFilter(selected = "") {
  const selectNode = document.getElementById("invoice-client-filter");
  if (!selectNode) return;
  const options = [
    `<option value="">All companies</option>`,
    ...state.clients.map(client => `<option value="${client.id}" ${selected === client.id ? "selected" : ""}>${escapeHtml(client.name)}</option>`)
  ].join("");
  if (selectNode.innerHTML !== options) selectNode.innerHTML = options;
  selectNode.value = selected;
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
  const pdfButton = document.getElementById("editor-pdf");
  const sendButton = document.getElementById("editor-send");
  document.getElementById("editor-title").textContent = editorTitle(mode);
  fields.className = mode === "invoice" || mode === "quote" ? "form-grid invoice-editor" : "form-grid";
  fields.innerHTML = editorFields(mode, existing);
  deleteButton.hidden = !(mode === "invoice" && existing.id);
  pdfButton.hidden = mode !== "invoice";
  sendButton.hidden = !(mode === "invoice" && existing.id);
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
    const rates = {
      ...clientMspRates(item.id),
      ...(item.mspRates || {})
    };
    return `
      ${field("name", "Client Name", item.name || "")}
      ${field("status", "Status", item.status || "active")}
      ${field("email", "Email", item.email || "")}
      ${field("phone", "Phone", item.phone || "")}
      ${field("terms", "Terms", item.terms || "Net 15")}
      ${field("m365TenantKey", "Microsoft 365 Tenant Key", item.m365TenantKey || "default")}
      ${field("pax8CompanyId", "Pax8 Company ID", item.pax8CompanyId || "")}
      ${checkbox("licenseAuditBilling", "Use Microsoft 365 audit to generate monthly invoice", item.licenseAuditBilling !== false)}
      <div class="field full pricing-editor">
        <h3>Monthly MSP License Pricing</h3>
        <div class="pricing-grid">
          ${field("rateFullUser", "Full User", rates.fullUser, "number")}
          ${field("rateLightUser", "Light User", rates.lightUser, "number")}
          ${field("rateServiceAccount", "Service Account", rates.serviceAccount, "number")}
          ${field("rateCopilot", "Copilot Add-on", rates.copilot, "number")}
        </div>
        <p class="subtle">New 365 audits and generated invoices use these rates. Existing invoices keep their saved line-item prices.</p>
      </div>
      <div class="field full pricing-editor">
        <h3>Internal Vendor Costs</h3>
        <p class="subtle">One row per service: name | source | qty | unit cost. Use this for NinjaOne, antivirus, backup, domains, and other non-Pax8 costs until an API is connected.</p>
        <textarea id="internalCostsText" name="internalCostsText">${escapeHtml(costsToText(item.internalCosts || []))}</textarea>
      </div>
      ${textarea("billTo", "Bill To", item.billTo || "", true)}
      ${textarea("notes", "Notes", item.notes || "", true)}
    `;
  }
  if (mode === "invoice" || mode === "quote") {
    const numberPrefix = mode === "invoice" ? "GSV-INV" : "GSV-Q";
    const documentNumber = item.number || `${numberPrefix}-${String(Date.now()).slice(-6)}`;
    const title = typeLabel(mode);
    const contactEmail = mode === "invoice" ? "billing@gsvisions.com" : "info@gsvisions.com";
    return `
      <div class="invoice-edit-head full">
        <div>
          <img class="invoice-edit-logo" src="assets/gsv-logo.png" alt="Golden State Visions">
          <div class="invoice-edit-contact">
            <p>${contactEmail}</p>
            <p>(916) 432-3373</p>
          </div>
        </div>
        <div class="invoice-edit-meta">
          <h3>${title}</h3>
          ${field("number", mode === "invoice" ? "Invoice #" : "Quote #", documentNumber)}
          ${field("date", "Date", item.date || today, "date")}
          ${mode === "invoice" ? field("dueDate", "Due Date", item.dueDate || addDays(today, 15), "date") : field("title", "Project / Quote Title", item.title || "")}
          ${field("subject", "Email Subject", item.subject || defaultDocumentSubject(mode, { ...item, number: documentNumber }))}
          ${select("status", "Status", statusOptions(mode, item.status), false)}
        </div>
      </div>
      <div class="invoice-edit-bill full">
        <div class="invoice-edit-address-grid">
          <div>
            ${select("clientId", "Bill To", clientOptions(item.clientId), false)}
            <div class="invoice-edit-address">${lines(clientById(item.clientId)?.billTo || clientById(item.clientId)?.name || "Select a client")}</div>
          </div>
          <div>
            ${checkbox("showShipTo", "Show Ship To", item.showShipTo)}
            ${textarea("shipTo", "Ship To", item.shipTo || clientById(item.clientId)?.billTo || "", false)}
          </div>
        </div>
      </div>
      <div class="invoice-edit-section full">
        <h3>${mode === "quote" ? escapeHtml(item.title || "Project Quote") : "Monthly IT Services"}</h3>
        <div class="line-editor" id="line-editor">
          <div class="line-editor-head"><span></span><span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span><span></span></div>
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
  const values = mode === "quote" ? ["draft", "sent", "approved", "declined", "converted"] : ["draft", "ready", "sent", "paid", "void"];
  return values.map(v => `<option value="${v}" ${selected === v ? "selected" : ""}>${v}</option>`).join("");
}

function typeLabel(mode) {
  return mode === "quote" ? "QUOTE" : "INVOICE";
}

function defaultDocumentSubject(mode, item = {}) {
  const number = item.number || (mode === "quote" ? "Quote #" : "Invoice #");
  if (mode === "quote") {
    const title = String(item.title || "").trim();
    return `${title || "Project Quote"} (${number})`;
  }
  const title = String(item.title || "").trim();
  if (title) return `${title} Invoice (${number})`;
  return `Monthly IT Services Invoice (${number})`;
}

function field(name, label, value, type = "text") {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}"></div>`;
}

function checkbox(name, label, checked = false) {
  return `<label class="check-field"><input id="${name}" name="${name}" type="checkbox" ${checked ? "checked" : ""}> <span>${label}</span></label>`;
}

function clientEmail(client) {
  if (client?.email) return client.email;
  return (client?.billTo || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
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
    <div class="line-editor-row" draggable="true">
      <button type="button" class="drag-handle" aria-label="Drag to reorder line item">☰</button>
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

function costsToText(costs) {
  return (costs || []).map(cost => `${cost.name || ""} | ${cost.source || ""} | ${cost.qty ?? 1} | ${cost.unitCost ?? 0}`).join("\n");
}

function textToCosts(text) {
  return text.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const [name, source, qty, unitCost] = line.split("|").map(part => part.trim());
    return {
      name,
      source: source || "Manual",
      qty: Number(qty || 1),
      unitCost: Number(unitCost || 0),
      active: true
    };
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
      m365TenantKey: data.m365TenantKey || "default",
      pax8CompanyId: data.pax8CompanyId || "",
      licenseAuditBilling: data.licenseAuditBilling === "on",
      mspRates: {
        fullUser: Number(data.rateFullUser || 0),
        lightUser: Number(data.rateLightUser || 0),
        serviceAccount: Number(data.rateServiceAccount || 0),
        copilot: Number(data.rateCopilot || 0)
      },
      internalCosts: textToCosts(data.internalCostsText || ""),
      billTo: data.billTo,
      notes: data.notes
    };
    upsert(state.clients, client);
  }
  if (editing.mode === "invoice") {
    const existingInvoice = state.invoices.find(inv => inv.id === editing.id);
    const invoice = {
      id: editing.id || id("inv"),
      number: data.number,
      clientId: data.clientId,
      date: data.date,
      dueDate: data.dueDate,
      month: existingInvoice?.month || data.date?.slice(0, 7),
      subject: data.subject || defaultDocumentSubject("invoice", data),
      status: data.status,
      type: existingInvoice?.type || "Manual",
      items: editorLineItems(),
      showShipTo: data.showShipTo === "on",
      shipTo: data.shipTo,
      notes: data.notes,
      sentAt: data.status === "sent" ? (existingInvoice?.sentAt || new Date().toISOString()) : ""
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
      subject: data.subject || defaultDocumentSubject("quote", data),
      status: data.status,
      items: editorLineItems(),
      showShipTo: data.showShipTo === "on",
      shipTo: data.shipTo,
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

function markInvoiceSent(invoiceId) {
  const invoice = state.invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return;
  invoice.status = "sent";
  invoice.sentAt = new Date().toISOString();
  saveState();
  render();
}

function setInvoiceSending(invoiceId, isSending) {
  document.querySelectorAll(`[data-send-invoice="${invoiceId}"], #editor-send, #send-preview-document`).forEach(button => {
    button.disabled = isSending;
    button.classList.toggle("is-loading", isSending);
    if (isSending) {
      button.dataset.readyText = button.textContent;
      button.textContent = "Creating draft...";
    } else if (button.dataset.readyText) {
      button.textContent = button.dataset.readyText;
      delete button.dataset.readyText;
    }
  });
}

async function sendInvoice(invoiceId, invoiceOverride = null) {
  const invoice = invoiceOverride || state.invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return;
  const client = clientById(invoice.clientId);

  if (!clientEmail(client)) {
    window.alert("This client does not have an email address saved.");
    return;
  }

  setInvoiceSending(invoiceId, true);
  try {
    const response = await fetch("/api/billing-invoice-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoice: {
          number: invoice.number,
          date: invoice.date,
          dueDate: invoice.dueDate,
          month: invoice.month,
          subject: invoice.subject,
          items: invoice.items,
          showShipTo: invoice.showShipTo,
          shipTo: invoice.shipTo,
          total: invoiceTotal(invoice)
        },
        client: {
          name: client?.name || "",
          email: clientEmail(client),
          billTo: client?.billTo || ""
        }
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Outlook draft creation failed.");
    invoice.status = "sent";
    invoice.sentAt = new Date().toISOString();
    upsert(state.invoices, invoice);
    saveState();
    setInvoiceSending(invoiceId, false);
    window.alert("Email draft created in billing@gsvisions.com Drafts with the invoice PDF attached.");
    render();
  } catch (error) {
    setInvoiceSending(invoiceId, false);
    window.alert(error instanceof Error ? error.message : "Outlook draft creation failed.");
  }
}

function invoiceFromEditor() {
  const form = document.getElementById("editor-form");
  const data = Object.fromEntries(new FormData(form).entries());
  const existingInvoice = state.invoices.find(inv => inv.id === editing.id);
  return {
    id: editing.id || id("preview"),
    number: data.number,
    clientId: data.clientId,
    date: data.date,
    dueDate: data.dueDate,
    month: existingInvoice?.month || data.date?.slice(0, 7),
    subject: data.subject || defaultDocumentSubject("invoice", data),
    status: data.status,
    type: existingInvoice?.type || "Manual",
    items: editorLineItems(),
    showShipTo: data.showShipTo === "on",
    shipTo: data.shipTo,
    notes: data.notes,
    sentAt: existingInvoice?.sentAt || ""
  };
}

function generateMonthlyInvoice() {
  const client = state.clients.find(c => c.status === "active") || state.clients[0];
  if (!client) return;
  const month = new Date().toISOString().slice(0, 7);
  const useAuditBilling = client.licenseAuditBilling !== false;
  const audit = latestAudit(client.id, month);
  if (useAuditBilling && !audit) {
    selectedClientId = client.id;
    setView("clients");
    window.alert("Run Audit Services for this client before generating the monthly MSP invoice.");
    return;
  }
  const items = useAuditBilling && audit ? auditInvoiceItems(audit) : currentMspItems(client.id, month);
  const invoice = {
    id: id("inv"),
    number: `GSV-${client.name.split(/\s+/)[0].toUpperCase()}-${month}`,
    clientId: client.id,
    date: today,
    dueDate: addDays(today, 15),
    month,
    status: audit?.reviewCount ? "draft" : "ready",
    type: "Monthly MSP",
    subject: defaultDocumentSubject("invoice", { number: `GSV-${client.name.split(/\s+/)[0].toUpperCase()}-${month}` }),
    items,
    notes: audit?.reviewCount ? `${audit.reviewCount} Microsoft 365 audit rows need review before sending.` : ""
  };
  state.invoices.push(invoice);
  if (audit && useAuditBilling) audit.invoiceId = invoice.id;
  saveState();
  setView("invoices");
}

function convertQuote(quoteId) {
  const quote = state.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  const invoiceNumber = quote.number.replace("GSV-Q", "GSV-INV");
  const invoice = {
    id: id("inv"),
    number: invoiceNumber,
    clientId: quote.clientId,
    date: today,
    dueDate: addDays(today, 15),
    month: today.slice(0, 7),
    status: "draft",
    type: "Project",
    subject: defaultDocumentSubject("invoice", { ...quote, number: invoiceNumber }),
    items: structuredClone(quote.items),
    showShipTo: quote.showShipTo,
    shipTo: quote.shipTo,
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
  previewing = { type, id: idValue };
  const client = clientById(doc.clientId);
  document.getElementById("document-title").textContent = type === "quote" ? "Quote" : "Invoice";
  document.getElementById("document-body").innerHTML = renderDocument(type, doc, client);
  document.getElementById("send-preview-document").hidden = type !== "invoice" || computedInvoiceStatus(doc) === "paid" || computedInvoiceStatus(doc) === "void";
  document.getElementById("document-preview").showModal();
}

function exportDocumentPdf(type, doc) {
  if (!doc) return;
  previewing = { type, id: doc.id };
  const client = clientById(doc.clientId);
  document.getElementById("document-title").textContent = type === "quote" ? "Quote" : "Invoice";
  document.getElementById("document-body").innerHTML = renderDocument(type, doc, client);
  document.getElementById("send-preview-document").hidden = type !== "invoice" || computedInvoiceStatus(doc) === "paid" || computedInvoiceStatus(doc) === "void";
  const preview = document.getElementById("document-preview");
  if (!preview.open) preview.showModal();
  window.setTimeout(() => window.print(), 150);
}

function editPreviewDocument() {
  if (!previewing) return;
  const preview = document.getElementById("document-preview");
  if (preview.open) preview.close();
  if (previewing.type === "quote") {
    openEditor("quote", state.quotes.find(quote => quote.id === previewing.id));
    return;
  }
  openEditor("invoice", state.invoices.find(invoice => invoice.id === previewing.id));
}

function sendPreviewDocument() {
  if (!previewing || previewing.type !== "invoice") return;
  sendInvoice(previewing.id);
}

function renderDocument(type, doc, client) {
  const title = type === "quote" ? "QUOTE" : "INVOICE";
  const contactEmail = type === "invoice" ? "billing@gsvisions.com" : "info@gsvisions.com";
  return `
    <div class="doc">
      <div class="doc-head">
        <div>
          <img class="doc-logo" src="assets/gsv-logo.png" alt="Golden State Visions">
          <div class="doc-contact">
            <p>${contactEmail}</p>
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
      <div class="doc-block doc-address-grid">
        <table class="doc-table">
          <thead><tr><th>Bill To</th></tr></thead>
          <tbody><tr><td>${lines(client?.billTo || client?.name || "")}</td></tr></tbody>
        </table>
        ${doc.showShipTo ? `
          <table class="doc-table">
            <thead><tr><th>Ship To</th></tr></thead>
            <tbody><tr><td>${lines(doc.shipTo || client?.billTo || client?.name || "")}</td></tr></tbody>
          </table>
        ` : ""}
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
      ${doc.notes ? `
        <div class="doc-block">
          <table class="doc-table">
            <thead><tr><th>Notes</th></tr></thead>
            <tbody><tr><td>${lines(doc.notes)}</td></tr></tbody>
          </table>
        </div>
      ` : ""}
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
    const client = clientById(clientId);
    const tenant = encodeURIComponent(client?.m365TenantKey || "default");
    const response = await fetch(`/api/m365-audit?tenant=${tenant}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Microsoft 365 pull failed.");

    const audit = buildAudit(clientId, month, data.rows || []);
    audit.source = data.source || "Microsoft Graph";
    audit.pulledAt = data.pulledAt || new Date().toISOString();
    state.audits365 = state.audits365.filter(existing => !(existing.clientId === clientId && existing.month === month));
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

async function pullMicrosoft365AuditForClient(clientId, month) {
  const client = clientById(clientId);
  const tenant = encodeURIComponent(client?.m365TenantKey || "default");
  const response = await fetch(`/api/m365-audit?tenant=${tenant}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(`${client?.name || "Client"} Microsoft 365: ${data.error || "pull failed"}`);

  const audit = buildAudit(clientId, month, data.rows || []);
  audit.source = data.source || "Microsoft Graph";
  audit.pulledAt = data.pulledAt || new Date().toISOString();
  state.audits365 = state.audits365.filter(existing => !(existing.clientId === clientId && existing.month === month));
  state.audits365.push(audit);
  return audit;
}

async function pullPax8CostsForClient(clientId, month) {
  const client = clientById(clientId);
  if (!client?.pax8CompanyId) return null;
  const response = await fetch(`/api/pax8-subscriptions?companyId=${encodeURIComponent(client.pax8CompanyId)}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(`${client?.name || "Client"} Pax8: ${data.error || "pull failed"}`);

  state.pax8Costs = (state.pax8Costs || []).filter(cost => !(cost.clientId === clientId && cost.month === month));
  const cost = {
    id: id("pax8"),
    clientId,
    month,
    companyId: data.companyId,
    source: data.source || "Pax8",
    pulledAt: data.pulledAt || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    rows: data.rows || [],
    totals: data.totals || {}
  };
  state.pax8Costs.push(cost);
  return cost;
}

async function pullPax8Costs() {
  const clientId = document.getElementById("audit-client").value || state.clients[0]?.id;
  const month = document.getElementById("audit-month").value || today.slice(0, 7);
  const status = document.getElementById("audit-status");
  const button = document.getElementById("audit-pull-pax8");
  const client = clientById(clientId);

  if (!client?.pax8CompanyId) {
    if (status) {
      status.className = "audit-status review";
      status.textContent = "Add the Pax8 Company ID to this client before pulling Pax8 costs.";
    }
    return;
  }

  if (status) {
    status.className = "audit-status";
    status.textContent = "Pulling Pax8 subscription costs...";
  }
  if (button) {
    button.disabled = true;
    button.textContent = "Pulling...";
  }

  try {
    const response = await fetch(`/api/pax8-subscriptions?companyId=${encodeURIComponent(client.pax8CompanyId)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Pax8 pull failed.");

    state.pax8Costs = (state.pax8Costs || []).filter(cost => !(cost.clientId === clientId && cost.month === month));
    state.pax8Costs.push({
      id: id("pax8"),
      clientId,
      month,
      companyId: data.companyId,
      source: data.source || "Pax8",
      pulledAt: data.pulledAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      rows: data.rows || [],
      totals: data.totals || {}
    });
    saveState();
    renderAudit365();
    if (status) {
      status.className = "audit-status ready";
      status.textContent = `Pax8 costs pulled for ${client.name}.`;
    }
  } catch (error) {
    if (status) {
      status.className = "audit-status review";
      status.textContent = error instanceof Error ? error.message : "Pax8 pull failed.";
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Pull Pax8 Costs";
    }
  }
}

async function auditServices(clientId = "") {
  const month = today.slice(0, 7);
  const clientIds = activeClientIds(clientId);
  const buttons = document.querySelectorAll(clientId ? `[data-audit-services="${clientId}"]` : `[data-audit-services], #audit-services-all`);
  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add("is-loading");
    button.textContent = "Auditing...";
  });

  const errors = [];
  for (const idValue of clientIds) {
    try {
      await pullMicrosoft365AuditForClient(idValue, month);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `${clientName(idValue)} Microsoft 365 pull failed.`);
    }

    try {
      await pullPax8CostsForClient(idValue, month);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `${clientName(idValue)} Pax8 pull failed.`);
    }
  }

  saveState();
  render();
  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove("is-loading");
    button.textContent = "Audit Services";
  });

  if (errors.length) {
    window.alert(`Services audit finished with ${errors.length} issue${errors.length === 1 ? "" : "s"}:\n\n${errors.join("\n")}`);
  }
}

function importAuditCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const clientId = document.getElementById("audit-client").value || state.clients[0]?.id;
    const month = document.getElementById("audit-month").value || today.slice(0, 7);
    const rows = parseCsv(String(reader.result || ""));
    const audit = buildAudit(clientId, month, rows);
    state.audits365 = state.audits365.filter(existing => !(existing.clientId === clientId && existing.month === month));
    state.audits365.push(audit);
    saveState();
    renderAudit365();
  };
  reader.readAsText(file);
}

document.addEventListener("click", event => {
  const target = event.target.closest("button");
  const card = event.target.closest(".client-card[data-client-dashboard-card]");
  if (!target && card) {
    selectedClientId = card.dataset.clientDashboardCard;
    setView("clients");
    return;
  }
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
  if (target.id === "audit-pull-pax8") pullPax8Costs();
  if (target.id === "audit-services-all") auditServices();
  if (target.dataset.auditServices) auditServices(target.dataset.auditServices);
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
  if (target.id === "editor-pdf" && editing.mode === "invoice") exportDocumentPdf("invoice", invoiceFromEditor());
  if (target.id === "editor-send" && editing.mode === "invoice" && editing.id) sendInvoice(editing.id, invoiceFromEditor());
  if (target.id === "editor-save") saveEditor();
  if (target.id === "close-preview") document.getElementById("document-preview").close();
  if (target.id === "edit-preview-document") editPreviewDocument();
  if (target.id === "send-preview-document") sendPreviewDocument();
  if (target.id === "print-document") window.print();
  if (target.id === "save-snapshot") snapshot();
  if (target.id === "export-invoices") exportInvoices();
  if (target.id === "export-payments") exportPayments();
  if (target.id === "export-summary") exportSummary();
  if (target.dataset.editClient) openEditor("client", state.clients.find(c => c.id === target.dataset.editClient));
  if (target.dataset.clientDashboard) {
    selectedClientId = target.dataset.clientDashboard;
    setView("clients");
  }
  if (target.dataset.clientInvoice) openEditor("invoice", { clientId: target.dataset.clientInvoice, date: today, dueDate: addDays(today, 15), status: "draft", items: [] });
  if (target.dataset.clientQuote) openEditor("quote", { clientId: target.dataset.clientQuote, date: today, status: "draft", items: [] });
  if (target.dataset.editInvoice) openEditor("invoice", state.invoices.find(inv => inv.id === target.dataset.editInvoice));
  if (target.dataset.deleteInvoice) deleteInvoice(target.dataset.deleteInvoice);
  if (target.dataset.sendInvoice) sendInvoice(target.dataset.sendInvoice);
  if (target.dataset.editQuote) openEditor("quote", state.quotes.find(q => q.id === target.dataset.editQuote));
  if (target.dataset.payInvoice) {
    const inv = state.invoices.find(invoice => invoice.id === target.dataset.payInvoice);
    openEditor("payment", { invoiceId: inv.id, date: today, method: "Check", amount: invoiceTotal(inv) - paidAmount(inv.id) });
  }
  if (target.dataset.previewInvoice) previewDocument("invoice", target.dataset.previewInvoice);
  if (target.dataset.pdfInvoice) exportDocumentPdf("invoice", state.invoices.find(inv => inv.id === target.dataset.pdfInvoice));
  if (target.dataset.previewQuote) previewDocument("quote", target.dataset.previewQuote);
  if (target.dataset.convertQuote) convertQuote(target.dataset.convertQuote);
  if (target.id === "invoice-clear-filters") {
    document.getElementById("invoice-client-filter").value = "";
    document.getElementById("invoice-filter").value = "all";
    document.getElementById("invoice-date-from").value = "";
    document.getElementById("invoice-date-to").value = "";
    document.getElementById("invoice-search").value = "";
    renderInvoices();
  }
});

document.addEventListener("input", event => {
  if (event.target.closest("#line-editor-rows")) updateEditorTotal();
});

document.addEventListener("change", event => {
  if (event.target.id === "clientId") {
    const address = document.querySelector(".invoice-edit-address");
    const shipTo = document.getElementById("shipTo");
    const client = clientById(event.target.value);
    if (address) address.innerHTML = lines(client?.billTo || client?.name || "Select a client");
    if (shipTo && !shipTo.value.trim()) shipTo.value = client?.billTo || client?.name || "";
  }
  if (event.target.id === "audit-client") {
    selectedClientId = event.target.value;
    renderAudit365();
    renderClients();
  }
  if (event.target.closest("#line-editor-rows")) updateEditorTotal();
});

document.addEventListener("dragstart", event => {
  const row = event.target.closest?.(".line-editor-row");
  if (!row) return;
  row.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", "");
});

document.addEventListener("dragover", event => {
  const rowsContainer = event.target.closest?.("#line-editor-rows");
  if (!rowsContainer) return;
  event.preventDefault();
  const dragging = rowsContainer.querySelector(".dragging");
  const targetRow = event.target.closest(".line-editor-row");
  if (!dragging || !targetRow || dragging === targetRow) return;
  const targetBox = targetRow.getBoundingClientRect();
  const afterTarget = event.clientY > targetBox.top + targetBox.height / 2;
  rowsContainer.insertBefore(dragging, afterTarget ? targetRow.nextSibling : targetRow);
});

document.addEventListener("dragend", event => {
  const row = event.target.closest?.(".line-editor-row");
  if (row) row.classList.remove("dragging");
});

document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
["invoice-filter", "invoice-client-filter", "invoice-date-from", "invoice-date-to"].forEach(idValue => {
  document.getElementById(idValue).addEventListener("change", renderInvoices);
});
document.getElementById("invoice-search").addEventListener("input", renderInvoices);
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
