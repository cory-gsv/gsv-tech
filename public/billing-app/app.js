const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      ninjaOneOrgId: 3,
      mspRates: {
        fullUser: 70,
        lightUser: 20,
        serviceAccount: 10,
        copilot: 30
      },
      ninjaOnePricing: [
        { name: "Ninja MSP Pro with Bitdefender GravityZone", qtySource: "api:endpoints", qty: 0, unitCost: 4.6, active: true }
      ],
      internalCosts: [],
      notes: "Pays by check."
    },
    {
      id: "client_nyssco",
      name: "New York Style Sausage Company",
      billTo: "Accounts Payable\nNew York Style Sausage Factory\n1228 Reamwood Ave\nSunnyvale, CA 94089\n408-745-7675\nap@newyorkstylesausage.com",
      email: "ap@newyorkstylesausage.com",
      ccEmail: "pasquale@newyorkstylesausage.com",
      phone: "408-745-7675",
      terms: "Net 15",
      status: "active",
      licenseAuditBilling: false,
      m365TenantKey: "nyssco",
      pax8CompanyId: "6e6399cf-8808-4c9c-bcce-19e6386e6589",
      ninjaOneOrgId: 2,
      mspRates: {
        fullUser: 0,
        lightUser: 0,
        serviceAccount: 0,
        copilot: 0
      },
      ninjaOnePricing: [
        { name: "Ninja MSP Pro with Bitdefender GravityZone", qtySource: "api:endpoints", qty: 0, unitCost: 4.6, active: true },
        { name: "Ninja Data Protection Server", qtySource: "fixed", qty: 3, unitCost: 20, active: true },
        { name: "Storage 1TB", qtySource: "fixed", qty: 3, unitCost: 15, active: true },
        { name: "Ninja PSA", qtySource: "fixed", qty: 3, unitCost: 0, active: true }
      ],
      internalCosts: [
        { name: "Domain registration/service", source: "Domain", qty: 0, unitCost: 0, active: true }
      ],
      notes: "Microsoft 365 audit is visibility only for this client, not invoice generation. Ship/contact from June invoice: Pasquale Bitonti, pasquale@newyorkstylesausage.com."
    },
    {
      id: "client_giorgios",
      name: "Giorgios Italian Food",
      billTo: "Giorgios Italian Food",
      email: "",
      phone: "",
      terms: "Net 15",
      status: "active",
      billingClientId: "client_nyssco",
      m365TenantKey: "giorgios",
      pax8CompanyId: "e90f1be4-c060-4fe9-aee1-c243e0b246ac",
      ninjaOneOrgId: 4,
      licenseAuditBilling: false,
      mspRates: { fullUser: 0, lightUser: 0, serviceAccount: 0, copilot: 0 },
      ninjaOnePricing: [
        { name: "Ninja MSP Pro with Bitdefender GravityZone", qtySource: "api:endpoints", qty: 0, unitCost: 4.6, active: true }
      ],
      internalCosts: [],
      notes: "Service/client profile only. Invoices roll up to New York Style Sausage Company."
    },
    {
      id: "client_mike_d_sells",
      name: "Mike D Sells",
      billTo: "Mike D Sells",
      email: "",
      phone: "",
      terms: "Net 15",
      status: "active",
      billingClientId: "client_nyssco",
      m365TenantKey: "mike_d_sells",
      pax8CompanyId: "a91818ab-d8c2-42dc-93f6-0c9d07b4ad06",
      licenseAuditBilling: false,
      mspRates: { fullUser: 0, lightUser: 0, serviceAccount: 0, copilot: 0 },
      ninjaOnePricing: [],
      internalCosts: [],
      notes: "Service/client profile only. Invoices roll up to New York Style Sausage Company."
    },
    {
      id: "client_sausage_sams",
      name: "Sausage Sams",
      billTo: "Sausage Sams",
      email: "",
      phone: "",
      terms: "Net 15",
      status: "active",
      billingClientId: "client_nyssco",
      m365TenantKey: "sausage_sams",
      pax8CompanyId: "d521e3c6-8f4d-4d54-8d7c-b399d64b8bd2",
      licenseAuditBilling: false,
      mspRates: { fullUser: 0, lightUser: 0, serviceAccount: 0, copilot: 0 },
      ninjaOnePricing: [],
      internalCosts: [],
      notes: "Service/client profile only. Invoices roll up to New York Style Sausage Company."
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
  pax8Costs: [],
  ninjaOneAudits: []
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
  for (const key of ["clients", "serviceAgreements"]) {
    if (!Array.isArray(state[key])) state[key] = [];
    for (const record of defaultData[key]) {
      const existing = state[key].find(existing => existing.id === record.id);
      if (!existing) {
        state[key].push(structuredClone(record));
        changed = true;
      } else if (key === "clients") {
        for (const field of ["m365TenantKey", "pax8CompanyId", "ninjaOneOrgId", "licenseAuditBilling", "internalCosts", "ninjaOnePricing", "ccEmail", "billingClientId"]) {
          if (existing[field] === undefined && record[field] !== undefined) {
            existing[field] = structuredClone(record[field]);
            changed = true;
          }
        }
        if (!existing.m365TenantKey && record.m365TenantKey) {
          existing.m365TenantKey = record.m365TenantKey;
          changed = true;
        }
      }
    }
  }
  if (!Array.isArray(state.pax8Costs)) {
    state.pax8Costs = [];
    changed = true;
  }
  if (!Array.isArray(state.ninjaOneAudits)) {
    state.ninjaOneAudits = [];
    changed = true;
  }
  const pax8CompanyIdFixes = {
    "1933729": "e1cda7ec-516c-4df1-b1cb-9baf660b4bda",
    "1933703": "6e6399cf-8808-4c9c-bcce-19e6386e6589",
    client_giorgios: "e90f1be4-c060-4fe9-aee1-c243e0b246ac",
    client_mike_d_sells: "a91818ab-d8c2-42dc-93f6-0c9d07b4ad06",
    client_sausage_sams: "d521e3c6-8f4d-4d54-8d7c-b399d64b8bd2"
  };
  state.clients.forEach(client => {
    if (pax8CompanyIdFixes[client.pax8CompanyId]) {
      client.pax8CompanyId = pax8CompanyIdFixes[client.pax8CompanyId];
      changed = true;
    }
    if (pax8CompanyIdFixes[client.id] && !client.pax8CompanyId) {
      client.pax8CompanyId = pax8CompanyIdFixes[client.id];
      changed = true;
    }
    const defaults = defaultData.clients.find(defaultClient => defaultClient.id === client.id);
    if (defaults?.ninjaOnePricing && (!Array.isArray(client.ninjaOnePricing) || !client.ninjaOnePricing.length)) {
      client.ninjaOnePricing = structuredClone(defaults.ninjaOnePricing);
      changed = true;
    } else if (defaults?.ninjaOnePricing && Array.isArray(client.ninjaOnePricing)) {
      defaults.ninjaOnePricing.forEach(rule => {
        const exists = client.ninjaOnePricing.some(existing => existing.name === rule.name);
        if (!exists) {
          client.ninjaOnePricing.push(structuredClone(rule));
          changed = true;
        }
      });
    }
    if (defaults?.ninjaOneOrgId && !client.ninjaOneOrgId) {
      client.ninjaOneOrgId = defaults.ninjaOneOrgId;
      changed = true;
    }
    if (Array.isArray(client.internalCosts)) {
      const filteredCosts = client.internalCosts.filter(cost => {
        const label = `${cost.source || ""} ${cost.name || ""}`;
        const amount = Number(cost.qty || 0) * Number(cost.unitCost || 0);
        return !(amount === 0 && /antivirus endpoint protection|ninjaone endpoint management|ninjaone data backup/i.test(label));
      });
      if (filteredCosts.length !== client.internalCosts.length) {
        client.internalCosts = filteredCosts;
        changed = true;
      }
    }
  });
  const nyss = state.clients.find(client => client.id === "client_nyssco");
  const giorgios = state.clients.find(client => client.id === "client_giorgios");
  const nyssDefaults = defaultData.clients.find(client => client.id === "client_nyssco");
  const giorgiosDefaults = defaultData.clients.find(client => client.id === "client_giorgios");
  if (nyss && nyssDefaults) {
    if (!nyss.ninjaOneOrgId || nyss.ninjaOneOrgId !== nyssDefaults.ninjaOneOrgId) {
      nyss.ninjaOneOrgId = nyssDefaults.ninjaOneOrgId;
      changed = true;
    }
    const nyssRuleNames = new Set(nyssDefaults.ninjaOnePricing.map(rule => rule.name));
    const currentRules = Array.isArray(nyss.ninjaOnePricing) ? nyss.ninjaOnePricing : [];
    const cleanedRules = currentRules.filter(rule => nyssRuleNames.has(rule.name));
    nyssDefaults.ninjaOnePricing.forEach(rule => {
      if (!cleanedRules.some(existing => existing.name === rule.name)) {
        cleanedRules.push(structuredClone(rule));
      }
    });
    if (JSON.stringify(currentRules) !== JSON.stringify(cleanedRules)) {
      nyss.ninjaOnePricing = cleanedRules;
      changed = true;
    }
  }
  if (giorgios && giorgiosDefaults) {
    if (!giorgios.pax8CompanyId) {
      giorgios.pax8CompanyId = giorgiosDefaults.pax8CompanyId;
      changed = true;
    }
    if (!giorgios.ninjaOneOrgId || giorgios.ninjaOneOrgId === 2) {
      giorgios.ninjaOneOrgId = giorgiosDefaults.ninjaOneOrgId;
      changed = true;
    }
    const giorgiosRuleNames = new Set(giorgiosDefaults.ninjaOnePricing.map(rule => rule.name));
    const currentRules = Array.isArray(giorgios.ninjaOnePricing) ? giorgios.ninjaOnePricing : [];
    const cleanedRules = currentRules.filter(rule => giorgiosRuleNames.has(rule.name));
    giorgiosDefaults.ninjaOnePricing.forEach(rule => {
      if (!cleanedRules.some(existing => existing.name === rule.name)) {
        cleanedRules.push(structuredClone(rule));
      }
    });
    if (JSON.stringify(currentRules) !== JSON.stringify(cleanedRules)) {
      giorgios.ninjaOnePricing = cleanedRules;
      changed = true;
    }
  }
  if (Array.isArray(state.ninjaOneAudits)) {
    state.ninjaOneAudits.forEach(audit => {
      if (audit.clientId === "client_giorgios" && Number(audit.organizationId || 0) === 2) {
        audit.clientId = "client_nyssco";
        audit.organizationId = nyssDefaults?.ninjaOneOrgId || 2;
        changed = true;
      }
    });
  }
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

function billingClientFor(clientId) {
  const client = clientById(clientId);
  return clientById(client?.billingClientId) || client;
}

function childClientsForBilling(clientId) {
  return state.clients.filter(client => client.billingClientId === clientId);
}

function billingGroupClientIds(clientId) {
  return [clientId, ...childClientsForBilling(clientId).map(client => client.id)];
}

function billingGroupLabel(clientId) {
  const children = childClientsForBilling(clientId);
  if (children.length) return `${children.length} company${children.length === 1 ? "" : "ies"} billed here`;
  const payer = billingClientFor(clientId);
  if (payer?.id && payer.id !== clientId) return `Bills to ${payer.name}`;
  return "";
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

function lineItemAmount(item) {
  return Number(item.qty || 0) * Number(item.rate || 0);
}

function quoteLineType(item = {}) {
  return item.type || "line";
}

function quoteHasTitleLines(items = []) {
  return items.some(item => quoteLineType(item) === "title");
}

function quoteTitleLineAmount(items = [], titleIndex = 0) {
  let total = lineItemAmount(items[titleIndex] || {});
  for (let index = titleIndex + 1; index < items.length; index += 1) {
    if (quoteLineType(items[index]) === "title") break;
    total += lineItemAmount(items[index]);
  }
  return total;
}

function documentSubtotal(doc) {
  return (doc.items || []).reduce((sum, item) => sum + lineItemAmount(item), 0);
}

function documentTaxTotal(doc) {
  const taxRate = Number(doc.taxRate || 0);
  if (!taxRate) return 0;
  const taxableSubtotal = (doc.items || [])
    .filter(item => item.taxable)
    .reduce((sum, item) => sum + lineItemAmount(item), 0);
  return Math.round(taxableSubtotal * (taxRate / 100) * 100) / 100;
}

function invoiceTotal(invoice) {
  return documentSubtotal(invoice) + documentTaxTotal(invoice);
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

function currentMspRollupTotal(clientId, month = today.slice(0, 7)) {
  return billingGroupClientIds(clientId).reduce((sum, id) => sum + currentMspTotal(id, month), 0);
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

function ninjaOneAuditRows(clientId, month = today.slice(0, 7)) {
  const client = clientById(clientId);
  const audit = latestNinjaOneAudit(clientId, month);
  if (audit && Array.isArray(client?.ninjaOnePricing)) return priceNinjaOneRows(client, audit);
  return activeClientCosts(clientId).filter(cost => /ninja/i.test(`${cost.source} ${cost.name}`));
}

function ninjaOneCostTotal(clientId, month = today.slice(0, 7)) {
  return ninjaOneAuditRows(clientId, month).reduce((sum, row) => sum + Number(row.amount || 0), 0);
}

function otherManualCostTotal(clientId) {
  return activeClientCosts(clientId)
    .filter(cost => !/ninja/i.test(`${cost.source} ${cost.name}`))
    .reduce((sum, cost) => sum + cost.amount, 0);
}

function pax8CostTotal(clientId, month = today.slice(0, 7)) {
  return Number(latestPax8Costs(clientId, month)?.totals?.monthlyPartnerCost || 0);
}

function markedUpMicrosoft365Amount(amount) {
  return Math.round(Number(amount || 0) * 1.5 * 100) / 100;
}

function pax8CustomerTotal(clientId, month = today.slice(0, 7)) {
  return Number(latestPax8Costs(clientId, month)?.totals?.monthlyPrice || 0);
}

function microsoft365BillingTotal(clientId, month = today.slice(0, 7)) {
  return markedUpMicrosoft365Amount(pax8CostTotal(clientId, month));
}

function currentBillingTotal(clientId, month = today.slice(0, 7)) {
  const serviceItemsTotal = currentMspItems(clientId, month)
    .filter(item => !isGeneric365ServiceItem(item))
    .reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);
  return serviceItemsTotal + microsoft365BillingTotal(clientId, month);
}

function rollupBillingTotal(clientId, month = today.slice(0, 7)) {
  return billingGroupClientIds(clientId).reduce((sum, id) => sum + currentBillingTotal(id, month), 0);
}

function pax8CostLabel(clientId, month = today.slice(0, 7)) {
  const client = clientById(clientId);
  if (!client?.pax8CompanyId) return "No Pax8 link";
  if (!latestPax8Costs(clientId, month)) return "Not pulled";
  return costMoney.format(pax8CostTotal(clientId, month));
}

function clientCostTotal(clientId, month = today.slice(0, 7)) {
  return pax8CostTotal(clientId, month) + manualCostTotal(clientId);
}

function costMargin(clientId, month = today.slice(0, 7)) {
  return currentBillingTotal(clientId, month) - clientCostTotal(clientId, month);
}

function rollupPax8CostTotal(clientId, month = today.slice(0, 7)) {
  return billingGroupClientIds(clientId).reduce((sum, id) => sum + pax8CostTotal(id, month), 0);
}

function rollupNinjaOneCostTotal(clientId, month = today.slice(0, 7)) {
  return billingGroupClientIds(clientId).reduce((sum, id) => sum + ninjaOneCostTotal(id, month), 0);
}

function rollupOtherManualCostTotal(clientId) {
  return billingGroupClientIds(clientId).reduce((sum, id) => sum + otherManualCostTotal(id), 0);
}

function rollupCostMargin(clientId, month = today.slice(0, 7)) {
  return rollupBillingTotal(clientId, month) - rollupPax8CostTotal(clientId, month) - rollupNinjaOneCostTotal(clientId, month) - rollupOtherManualCostTotal(clientId);
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
  const margin = msp - pax8 - ninjaOne - vendorCosts;
  const draftQuotes = state.quotes.filter(q => q.status === "draft").length;

  document.getElementById("metric-open").textContent = money.format(open);
  document.getElementById("metric-paid").textContent = money.format(paid);
  document.getElementById("metric-msp").textContent = money.format(msp);
  document.getElementById("metric-pax8").textContent = costMoney.format(pax8);
  document.getElementById("metric-ninjaone").textContent = costMoney.format(ninjaOne);
  document.getElementById("metric-vendor-costs").textContent = costMoney.format(vendorCosts);
  document.getElementById("metric-margin").textContent = costMoney.format(margin);
  document.getElementById("metric-quotes").textContent = draftQuotes;

  document.getElementById("dashboard-invoices").innerHTML = invoices
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(inv => {
      const status = computedInvoiceStatus(inv);
      return `
      <div class="item dashboard-invoice-item">
        <div class="item-line dashboard-invoice-main">
          <strong>${escapeHtml(inv.number)}</strong>
          <span class="badge ${status}">${status}</span>
        </div>
        <div class="item-line subtle">
          <span>${escapeHtml(clientName(inv.clientId))}</span>
          <strong>${money.format(invoiceTotal(inv))}</strong>
        </div>
        ${invoiceActionButtons(inv)}
      </div>
    `;
    }).join("") || `<p class="subtle">No invoices yet.</p>`;

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

function invoiceActionButtons(inv) {
  const status = computedInvoiceStatus(inv);
  return `
    <div class="row-actions invoice-actions">
      <button data-preview-invoice="${inv.id}">Preview</button>
      <button data-pdf-invoice="${inv.id}">PDF</button>
      <button data-edit-invoice="${inv.id}">Edit</button>
      ${status !== "paid" && status !== "void" ? `<button data-send-invoice="${inv.id}">Send</button>` : ""}
      <button data-pay-invoice="${inv.id}">Pay</button>
      <button class="danger ghost" data-delete-invoice="${inv.id}">Delete</button>
    </div>
  `;
}

function renderClients() {
  const detail = document.getElementById("client-detail");
  const activeClient = clientById(selectedClientId);
  detail.innerHTML = activeClient ? clientDetailDashboard(activeClient) : "";
  document.getElementById("client-list").innerHTML = state.clients.map(client => {
    const audit = latestAudit(client.id, today.slice(0, 7));
    const monthly = currentMspTotal(client.id);
    const pax8 = pax8CostLabel(client.id);
    const ninjaOne = ninjaOneCostTotal(client.id);
    const manual = otherManualCostTotal(client.id);
    const margin = costMargin(client.id);
    const invoices = clientInvoices(client.id);
    const open = invoices.filter(inv => computedInvoiceStatus(inv) !== "paid").reduce((sum, inv) => sum + invoiceTotal(inv) - paidAmount(inv.id), 0);
    const billingLabel = billingGroupLabel(client.id);
    return `
      <article class="item client-card ${selectedClientId === client.id ? "selected" : ""}" data-client-dashboard-card="${client.id}">
        <div class="item-line client-card-title">
          <div class="client-card-heading">
            <button type="button" class="drag-handle client-card-drag" draggable="true" data-client-card-drag="${client.id}" aria-label="Drag to reorder client">☰</button>
            <strong>${escapeHtml(client.name)}</strong>
          </div>
          <span class="badge ${client.status}">${escapeHtml(client.status)}</span>
        </div>
        ${billingLabel ? `<div class="subtle client-billing-label">${escapeHtml(billingLabel)}</div>` : ""}
        <div class="client-card-metrics">
          <div><span>Monthly billing</span><strong>${money.format(monthly)}</strong></div>
          <div><span>365 cost</span><strong>${escapeHtml(pax8)}</strong></div>
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
          <button data-client-invoice="${client.id}">Auto Generate Invoice</button>
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
  const ninjaOne = latestNinjaOneAudit(client.id, month);
  const costs = activeClientCosts(client.id);
  const recentInvoices = clientInvoices(client.id).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const billingLabel = billingGroupLabel(client.id);
  const hasBillingChildren = childClientsForBilling(client.id).length > 0;
  const monthlyTotal = hasBillingChildren ? currentMspRollupTotal(client.id) : currentMspTotal(client.id);
  const microsoftCostTotal = hasBillingChildren ? rollupPax8CostTotal(client.id) : pax8CostTotal(client.id);
  const microsoftCostLabel = hasBillingChildren ? costMoney.format(microsoftCostTotal) : pax8CostLabel(client.id, month);
  const ninjaOneTotal = hasBillingChildren ? rollupNinjaOneCostTotal(client.id) : ninjaOneCostTotal(client.id);
  const otherCostTotal = hasBillingChildren ? rollupOtherManualCostTotal(client.id) : otherManualCostTotal(client.id);
  const marginTotal = hasBillingChildren ? rollupCostMargin(client.id) : costMargin(client.id);
  return `
    <section class="client-dashboard">
      <div class="section-head">
        <div>
          <p class="eyebrow">Client dashboard</p>
          <h2>${escapeHtml(client.name)}</h2>
          ${billingLabel ? `<p class="subtle">${escapeHtml(billingLabel)}</p>` : ""}
        </div>
        <div class="toolbar">
          <button data-audit-services="${client.id}" class="primary">Audit Services</button>
          <button data-client-invoice="${client.id}" class="primary">Auto Generate Invoice</button>
          <button data-edit-client="${client.id}">Edit Client</button>
        </div>
      </div>
      <div class="metric-grid client-metrics">
        <article class="metric"><span>${hasBillingChildren ? "Monthly Billing Rollup" : "Monthly Billing"}</span><strong>${money.format(monthlyTotal)}</strong></article>
        <article class="metric"><span>${hasBillingChildren ? "Microsoft 365 Cost Rollup" : "Microsoft 365 Cost"}</span><strong>${escapeHtml(microsoftCostLabel)}</strong></article>
        <article class="metric"><span>365 Source</span><strong>${client.pax8CompanyId || hasBillingChildren ? "Pax8" : "Not linked"}</strong></article>
        <article class="metric"><span>${hasBillingChildren ? "NinjaOne Cost Rollup" : "NinjaOne Cost"}</span><strong>${costMoney.format(ninjaOneTotal)}</strong></article>
        <article class="metric"><span>${hasBillingChildren ? "Other Vendor Costs Rollup" : "Other Vendor Costs"}</span><strong>${costMoney.format(otherCostTotal)}</strong></article>
        <article class="metric"><span>${hasBillingChildren ? "Estimated Margin Rollup" : "Estimated Margin"}</span><strong>${costMoney.format(marginTotal)}</strong></article>
      </div>
      <div class="split">
        <section>
          <div class="section-head"><h2>Services Audit</h2></div>
          <div class="stack">
            <div class="item"><div class="item-line"><span>Microsoft 365 users</span><strong>${audit ? audit.rows.length : "Not pulled"}</strong></div></div>
            <div class="item"><div class="item-line"><span>Pax8 subscriptions</span><strong>${pax8 ? (pax8.rows || []).length : "Not pulled"}</strong></div></div>
            <div class="item"><div class="item-line"><span>NinjaOne devices</span><strong>${ninjaOne ? `${ninjaOne.totals.devices} found` : client.ninjaOneOrgId ? "Not pulled" : "Add org ID"}</strong></div></div>
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
      ${ninjaOne ? `
        <div class="section-head table-heading"><h2>NinjaOne Audit Summary</h2></div>
        <div class="metric-grid client-metrics">
          <article class="metric"><span>Total Devices Seen</span><strong>${ninjaOne.totals?.devices || 0}</strong></article>
          <article class="metric"><span>Endpoint Devices</span><strong>${ninjaOne.totals?.endpoints || 0}</strong></article>
          <article class="metric"><span>Server / VM Devices</span><strong>${ninjaOne.totals?.servers || 0}</strong></article>
          <article class="metric"><span>Other Devices</span><strong>${ninjaOne.totals?.other || 0}</strong></article>
          <article class="metric"><span>Offline</span><strong>${ninjaOne.totals?.offline || 0}</strong></article>
        </div>
      ` : ""}
      <div class="section-head table-heading">
        <div>
          <h2>Tracked Vendor Costs</h2>
          <p class="subtle">Pax8 is pulled from Pax8. NinjaOne costs below are pricing rules matched to the latest device audit. The device table shows what NinjaOne actually returned.</p>
        </div>
      </div>
      <div class="table-card">
        <table>
          <thead><tr><th>Service</th><th>Source</th><th class="num">Qty</th><th class="num">Unit Cost</th><th class="num">Monthly Cost</th></tr></thead>
          <tbody>
            ${(pax8?.rows || []).slice(0, 8).map(row => `
              <tr><td>${escapeHtml(row.productName)}</td><td>Pax8</td><td class="num">${row.quantity}</td><td class="num">${costMoney.format(row.unitPartnerCost || 0)}</td><td class="num">${costMoney.format(row.monthlyPartnerCost || 0)}</td></tr>
            `).join("")}
            ${ninjaOneAuditRows(client.id, month).map(row => `
              <tr><td>${escapeHtml(row.name)}</td><td>${row.qtySource === "fixed" ? "NinjaOne pricing rule" : "NinjaOne audit count"}</td><td class="num">${row.qty}</td><td class="num">${costMoney.format(row.unitCost)}</td><td class="num">${costMoney.format(row.amount)}</td></tr>
            `).join("")}
            ${costs.filter(cost => !/ninja/i.test(`${cost.source} ${cost.name}`)).map(cost => `
              <tr><td>${escapeHtml(cost.name)}</td><td>${escapeHtml(cost.source)}</td><td class="num">${cost.qty}</td><td class="num">${costMoney.format(cost.unitCost)}</td><td class="num">${costMoney.format(cost.amount)}</td></tr>
            `).join("")}
            ${!(pax8?.rows || []).length && !costs.length ? `<tr><td colspan="5">No costs tracked yet. Edit the client to add NinjaOne, antivirus, backup, or domain costs.</td></tr>` : ""}
          </tbody>
        </table>
      </div>
      ${ninjaOne ? `
        <div class="section-head table-heading"><h2>NinjaOne Devices Found</h2></div>
        <div class="table-card">
          <table>
            <thead><tr><th>Device</th><th>Class</th><th>Policy</th><th>Category</th><th>Status</th></tr></thead>
            <tbody>
              ${(ninjaOne.rows || []).map(row => `
                <tr>
                  <td>${escapeHtml(row.name)}</td>
                  <td>${escapeHtml(row.nodeClass)}</td>
                  <td>${escapeHtml(row.policyName || row.rolePolicyId || "")}</td>
                  <td>${escapeHtml(row.category)}</td>
                  <td>${row.offline ? "Offline" : "Online"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      ` : ""}
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

function latestNinjaOneAudit(clientId, month = "") {
  return (state.ninjaOneAudits || [])
    .filter(audit => (!clientId || audit.clientId === clientId) && (!month || audit.month === month))
    .slice()
    .sort((a, b) => `${b.month}-${b.createdAt}`.localeCompare(`${a.month}-${a.createdAt}`))[0];
}

function ninjaOneQtyForRule(rule, audit) {
  const source = rule.qtySource || "fixed";
  if (source === "api:endpoints") return Number(audit?.totals?.endpoints || 0);
  if (source === "api:servers") return Number(audit?.totals?.servers || 0);
  if (source === "api:devices") return Number(audit?.totals?.devices || 0);
  if (source === "api:other") return Number(audit?.totals?.other || 0);
  return Number(rule.qty || 0);
}

function priceNinjaOneRows(client, audit) {
  return (client?.ninjaOnePricing || [])
    .filter(rule => rule.active !== false)
    .map(rule => {
      const qty = ninjaOneQtyForRule(rule, audit);
      const unitCost = Number(rule.unitCost || 0);
      return {
        name: rule.name || "NinjaOne service",
        source: "NinjaOne",
        qty,
        qtySource: rule.qtySource || "fixed",
        unitCost,
        amount: qty * unitCost
      };
    });
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
            ${invoiceActionButtons(inv)}
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
            ${quote.status !== "converted" && quote.status !== "declined" ? `<button data-send-quote="${quote.id}">Send</button>` : ""}
            ${quote.status !== "converted" ? `<button data-convert-quote="${quote.id}">Create Invoice</button>` : ""}
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
  const createInvoiceButton = document.getElementById("editor-create-invoice");
  const pdfButton = document.getElementById("editor-pdf");
  const sendButton = document.getElementById("editor-send");
  document.getElementById("editor-title").textContent = editorTitle(mode);
  fields.className = mode === "invoice" || mode === "quote" ? "form-grid invoice-editor" : "form-grid";
  fields.innerHTML = editorFields(mode, existing);
  deleteButton.hidden = !(mode === "invoice" && existing.id);
  createInvoiceButton.hidden = !(mode === "quote" && existing.id && existing.status !== "converted");
  pdfButton.hidden = mode !== "invoice";
  sendButton.hidden = !((mode === "invoice" || mode === "quote") && existing.id);
  setEditorError("");
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
  return [
    `<option value="" ${!selected ? "selected" : ""}>Select a client</option>`,
    ...state.clients.map(c => `<option value="${c.id}" ${selected === c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`)
  ].join("");
}

function billingClientOptions(selected, currentClientId = "") {
  return [
    `<option value="" ${!selected ? "selected" : ""}>Bills to itself</option>`,
    ...state.clients
      .filter(client => client.id !== currentClientId && !client.billingClientId)
      .map(client => `<option value="${client.id}" ${selected === client.id ? "selected" : ""}>${escapeHtml(client.name)}</option>`)
  ].join("");
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
      ${field("ccEmail", "Invoice CC Email(s)", item.ccEmail || "")}
      ${field("phone", "Phone", item.phone || "")}
      ${field("terms", "Terms", item.terms || "Net 15")}
      ${select("billingClientId", "Bills To Client", billingClientOptions(item.billingClientId || "", item.id), false)}
      ${field("m365TenantKey", "Microsoft 365 Tenant Key", item.m365TenantKey || "")}
      <p class="field-note full">Use a short key like nyssco, giorgios, mike_d_sells, or sausage_sams. Leave blank if this client does not have its own Microsoft 365 tenant yet.</p>
      ${field("pax8CompanyId", "Pax8 Company ID", item.pax8CompanyId || "")}
      ${field("ninjaOneOrgId", "NinjaOne Organization ID", item.ninjaOneOrgId || "", "number")}
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
        <h3>NinjaOne Internal Cost Pricing</h3>
        <p class="subtle">This tracks what GSV pays per customer. It does not bill the customer. One row per service: name | quantity source | quantity | unit cost. Quantity source can be fixed, api:endpoints, api:servers, api:devices, or api:other.</p>
        <textarea id="ninjaOnePricingText" name="ninjaOnePricingText">${escapeHtml(ninjaOnePricingToText(item.ninjaOnePricing || []))}</textarea>
      </div>
      <div class="field full pricing-editor">
        <h3>Internal Vendor Costs</h3>
        <p class="subtle">One row per service: name | source | qty | unit cost. Use this for domains and other non-Pax8, non-NinjaOne costs.</p>
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
          ${mode === "quote" ? field("taxRate", "Tax Rate %", item.taxRate ?? 0, "number") : ""}
          ${field("subject", "Email Subject", item.subject || defaultDocumentSubject(mode, { ...item, number: documentNumber }))}
          ${select("status", "Status", statusOptions(mode, item.status), false)}
        </div>
      </div>
      <div class="invoice-edit-bill full">
        <div class="invoice-edit-address-grid">
          <div>
            <div class="select-with-action">
              ${select("clientId", "Bill To", clientOptions(item.clientId), false)}
              ${mode === "quote" ? `<button id="quick-add-client" type="button">Add Client</button>` : ""}
            </div>
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
        <div class="line-editor ${mode === "quote" ? "quote-line-editor" : ""}" id="line-editor" data-mode="${mode}">
          <div class="line-editor-head">
            ${mode === "quote"
              ? "<span></span><span>Type</span><span>Description</span><span>Qty</span><span>Unit Cost</span><span>Mark Up %</span><span>Unit Price</span><span>Taxable</span><span>Total</span><span></span>"
              : "<span></span><span>Description</span><span>Qty</span><span>Unit Price</span><span>Amount</span><span></span>"}
          </div>
          <div id="line-editor-rows">
            ${lineEditorRows(item.items || [], mode)}
          </div>
        </div>
        <div class="line-editor-tools">
          ${mode === "quote" ? `<button id="add-title-line" type="button">Add Title Line</button>` : ""}
          <button id="add-line-item" type="button">Add Row</button>
        </div>
        <div class="invoice-edit-total"><span>${mode === "quote" ? "Total" : "Total Due"}</span><strong id="editor-total">$0</strong></div>
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
  const numberAttrs = type === "number" ? ' step="any"' : "";
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}"${numberAttrs} value="${escapeHtml(value)}"></div>`;
}

function checkbox(name, label, checked = false) {
  return `<label class="check-field"><input id="${name}" name="${name}" type="checkbox" ${checked ? "checked" : ""}> <span>${label}</span></label>`;
}

function clientEmail(client) {
  if (client?.email) return client.email;
  return (client?.billTo || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function clientCcEmails(client) {
  return String(client?.ccEmail || "")
    .split(/[,\n;]/)
    .map(email => email.trim())
    .filter(Boolean);
}

function textarea(name, label, value, full = false) {
  return `<div class="field ${full ? "full" : ""}"><label for="${name}">${label}</label><textarea id="${name}" name="${name}">${escapeHtml(value)}</textarea></div>`;
}

function select(name, label, options, full = false) {
  return `<div class="field ${full ? "full" : ""}"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options}</select></div>`;
}

function quickAddClientFromDocument() {
  const name = window.prompt("Client name");
  if (!name?.trim()) return;
  const newClient = {
    id: id("client"),
    name: name.trim(),
    status: "active",
    terms: "Net 15",
    billTo: name.trim(),
    shipTo: "",
    email: "",
    ccEmail: "",
    phone: "",
    internalCosts: [],
    mspRates: { fullUser: 70, lightUser: 20, serviceAccount: 10, copilot: 30 },
    licenseAuditBilling: true
  };
  state.clients.push(newClient);
  saveState();
  const clientSelect = document.getElementById("clientId");
  if (clientSelect) {
    clientSelect.innerHTML = clientOptions(newClient.id);
    clientSelect.value = newClient.id;
  }
  const address = document.querySelector(".invoice-edit-address");
  if (address) address.innerHTML = lines(newClient.billTo);
  const shipTo = document.getElementById("shipTo");
  if (shipTo && !shipTo.value.trim()) shipTo.value = newClient.billTo;
}

function lineEditorRows(items, mode = editing.mode) {
  const source = items.length ? items : [{ description: "", qty: 1, rate: 0 }];
  return source.map(item => lineEditorRow(item, mode)).join("");
}

function quoteLineRate(item) {
  const unitCost = Number(item.unitCost || 0);
  const markup = Number(item.markupPercent ?? item.markup ?? 0);
  if ((item.rate === undefined || item.rate === "") && unitCost) return Math.round(unitCost * (1 + markup / 100) * 100) / 100;
  return Number(item.rate || 0);
}

function lineEditorRow(item = {}, mode = editing.mode) {
  const rate = mode === "quote" ? quoteLineRate(item) : Number(item.rate || 0);
  if (mode === "quote") {
    const type = quoteLineType(item);
    return `
      <div class="line-editor-row quote-line-row" draggable="true">
        <button type="button" class="drag-handle" aria-label="Drag to reorder line item">☰</button>
        <select name="itemType" aria-label="Line Type">
          <option value="line" ${type === "line" ? "selected" : ""}>Line</option>
          <option value="title" ${type === "title" ? "selected" : ""}>Title</option>
          <option value="detail" ${type === "detail" ? "selected" : ""}>Sub line</option>
        </select>
        <input name="itemDescription" aria-label="Description" value="${escapeHtml(item.description || "")}">
        <input name="itemQty" aria-label="Quantity" type="number" step="1" min="0" value="${escapeHtml(item.qty ?? 1)}">
        <input name="itemUnitCost" aria-label="Unit Cost" type="number" step="0.01" value="${escapeHtml(item.unitCost ?? "")}">
        <input name="itemMarkup" aria-label="Mark Up Percent" type="number" step="0.01" value="${escapeHtml(item.markupPercent ?? item.markup ?? "")}">
        <input name="itemRate" aria-label="Unit Price" type="number" step="0.01" value="${escapeHtml(rate)}">
        <label class="line-taxable"><input name="itemTaxable" aria-label="Taxable" type="checkbox" ${item.taxable ? "checked" : ""}></label>
        <output class="line-amount">${money.format(Number(item.qty || 0) * rate)}</output>
        <button type="button" class="icon danger" data-remove-line aria-label="Remove line item">×</button>
      </div>
    `;
  }
  return `
    <div class="line-editor-row" draggable="true">
      <button type="button" class="drag-handle" aria-label="Drag to reorder line item">☰</button>
      <input name="itemDescription" aria-label="Description" value="${escapeHtml(item.description || "")}">
      <input name="itemQty" aria-label="Quantity" type="number" step="1" min="0" value="${escapeHtml(item.qty ?? 1)}">
      <input name="itemRate" aria-label="Unit Price" type="number" step="0.01" value="${escapeHtml(item.rate ?? 0)}">
      <output class="line-amount">${money.format(Number(item.qty || 0) * Number(item.rate || 0))}</output>
      <button type="button" class="icon danger" data-remove-line aria-label="Remove line item">×</button>
    </div>
  `;
}

function editorLineItems() {
  return [...document.querySelectorAll("#line-editor-rows .line-editor-row")]
    .map(row => {
      const item = {
        description: row.querySelector('[name="itemDescription"]').value.trim(),
        qty: Number(row.querySelector('[name="itemQty"]').value || 0),
        rate: Number(row.querySelector('[name="itemRate"]').value || 0)
      };
      const type = row.querySelector('[name="itemType"]');
      const unitCost = row.querySelector('[name="itemUnitCost"]');
      const markup = row.querySelector('[name="itemMarkup"]');
      const taxable = row.querySelector('[name="itemTaxable"]');
      if (type) item.type = type.value || "line";
      if (unitCost) item.unitCost = Number(unitCost.value || 0);
      if (markup) item.markupPercent = Number(markup.value || 0);
      if (taxable) item.taxable = taxable.checked;
      return item;
    })
    .filter(item => item.description || item.qty || item.rate || item.unitCost || item.markupPercent);
}

function syncQuoteLineMarkup(row, changedInput) {
  if (!row.classList.contains("quote-line-row")) return;
  const unitCostInput = row.querySelector('[name="itemUnitCost"]');
  const markupInput = row.querySelector('[name="itemMarkup"]');
  const rateInput = row.querySelector('[name="itemRate"]');
  const unitCost = Number(unitCostInput?.value || 0);
  if (!unitCostInput || !markupInput || !rateInput || !unitCost) return;
  if (changedInput?.name === "itemUnitCost" || changedInput?.name === "itemMarkup") {
    const markup = Number(markupInput.value || 0);
    rateInput.value = (Math.round(unitCost * (1 + markup / 100) * 100) / 100).toFixed(2);
  }
  if (changedInput?.name === "itemRate") {
    const rate = Number(rateInput.value || 0);
    markupInput.value = (Math.round(((rate / unitCost) - 1) * 10000) / 100).toFixed(2);
  }
}

function updateEditorTotal(changedInput) {
  const totalNode = document.getElementById("editor-total");
  if (!totalNode) return;
  let subtotal = 0;
  let taxableSubtotal = 0;
  document.querySelectorAll("#line-editor-rows .line-editor-row").forEach(row => {
    syncQuoteLineMarkup(row, changedInput && row.contains(changedInput) ? changedInput : null);
    const qty = Number(row.querySelector('[name="itemQty"]').value || 0);
    const rate = Number(row.querySelector('[name="itemRate"]').value || 0);
    const amount = qty * rate;
    row.querySelector(".line-amount").textContent = money.format(amount);
    subtotal += amount;
    if (row.querySelector('[name="itemTaxable"]')?.checked) taxableSubtotal += amount;
  });
  const taxRate = Number(document.getElementById("taxRate")?.value || 0);
  const tax = Math.round(taxableSubtotal * (taxRate / 100) * 100) / 100;
  totalNode.textContent = money.format(subtotal + tax);
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

function ninjaOnePricingToText(rows) {
  return (rows || []).map(row => `${row.name || ""} | ${row.qtySource || "fixed"} | ${row.qty ?? 0} | ${row.unitCost ?? 0}`).join("\n");
}

function textToNinjaOnePricing(text) {
  return text.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const [name, qtySource, qty, unitCost] = line.split("|").map(part => part.trim());
    return {
      name,
      qtySource: qtySource || "fixed",
      qty: Number(qty || 0),
      unitCost: Number(unitCost || 0),
      active: true
    };
  });
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

function setEditorError(message = "", fieldName = "") {
  const error = document.getElementById("editor-error");
  if (!error) return;
  error.textContent = message;
  error.hidden = !message;
  if (message && fieldName) {
    const field = document.querySelector(`#editor-form [name="${fieldName}"]`);
    field?.focus();
  }
}

function saveEditor() {
  const form = document.getElementById("editor-form");
  const data = Object.fromEntries(new FormData(form).entries());
  setEditorError("");
  if ((editing.mode === "invoice" || editing.mode === "quote") && !data.clientId) {
    setEditorError("Select or add a client before saving.", "clientId");
    return false;
  }
  if (editing.mode === "client") {
      const client = {
      id: editing.id || id("client"),
      name: data.name,
      status: data.status || "active",
      email: data.email,
      ccEmail: data.ccEmail,
      phone: data.phone,
      terms: data.terms,
      billingClientId: data.billingClientId || "",
      m365TenantKey: String(data.m365TenantKey || "").trim(),
      pax8CompanyId: data.pax8CompanyId || "",
      ninjaOneOrgId: Number(data.ninjaOneOrgId || 0),
      licenseAuditBilling: data.licenseAuditBilling === "on",
      mspRates: {
        fullUser: Number(data.rateFullUser || 0),
        lightUser: Number(data.rateLightUser || 0),
        serviceAccount: Number(data.rateServiceAccount || 0),
        copilot: Number(data.rateCopilot || 0)
      },
      ninjaOnePricing: textToNinjaOnePricing(data.ninjaOnePricingText || ""),
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
      taxRate: Number(existingInvoice?.taxRate || 0),
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
      taxRate: Number(data.taxRate || 0),
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
  return true;
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

function setDocumentSending(type, documentId, isSending) {
  const dataAttr = type === "quote" ? "data-send-quote" : "data-send-invoice";
  document.querySelectorAll(`[${dataAttr}="${documentId}"], #editor-send, #send-preview-document`).forEach(button => {
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

function setInvoiceSending(invoiceId, isSending) {
  setDocumentSending("invoice", invoiceId, isSending);
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
          ccEmails: clientCcEmails(client),
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

async function sendQuote(quoteId, quoteOverride = null) {
  const quote = quoteOverride || state.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  const client = clientById(quote.clientId);

  if (!clientEmail(client)) {
    window.alert("This client does not have an email address saved.");
    return;
  }

  setDocumentSending("quote", quoteId, true);
  try {
    const response = await fetch("/api/billing-invoice-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentType: "quote",
        invoice: {
          number: quote.number,
          date: quote.date,
          dueDate: "",
          month: quote.date?.slice(0, 7),
          subject: quote.subject,
          title: quote.title,
          items: quote.items,
          taxRate: Number(quote.taxRate || 0),
          showShipTo: quote.showShipTo,
          shipTo: quote.shipTo,
          total: invoiceTotal(quote)
        },
        client: {
          name: client?.name || "",
          email: clientEmail(client),
          ccEmails: clientCcEmails(client),
          billTo: client?.billTo || ""
        }
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Outlook draft creation failed.");
    quote.status = "sent";
    quote.sentAt = new Date().toISOString();
    upsert(state.quotes, quote);
    saveState();
    setDocumentSending("quote", quoteId, false);
    window.alert("Email draft created in cory@gsvisions.com Drafts with the quote PDF attached.");
    render();
  } catch (error) {
    setDocumentSending("quote", quoteId, false);
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
    taxRate: Number(existingInvoice?.taxRate || 0),
    showShipTo: data.showShipTo === "on",
    shipTo: data.shipTo,
    notes: data.notes,
    sentAt: existingInvoice?.sentAt || ""
  };
}

function quoteFromEditor() {
  const form = document.getElementById("editor-form");
  const data = Object.fromEntries(new FormData(form).entries());
  const existingQuote = state.quotes.find(quote => quote.id === editing.id);
  return {
    id: editing.id || id("preview"),
    number: data.number,
    clientId: data.clientId,
    date: data.date,
    title: data.title,
    taxRate: Number(data.taxRate || 0),
    subject: data.subject || defaultDocumentSubject("quote", data),
    status: data.status,
    items: editorLineItems(),
    showShipTo: data.showShipTo === "on",
    shipTo: data.shipTo,
    notes: data.notes,
    sentAt: existingQuote?.sentAt || ""
  };
}

function monthlyInvoiceNumber(client, month) {
  const slug = (client?.name || "CLIENT").split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `GSV-${slug}-${month}`;
}

function quoteNumber(client, month) {
  const slug = (client?.name || "CLIENT").split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `GSV-Q-${slug}-${month}`;
}

function isGeneric365ServiceItem(item) {
  return /office\s*365|microsoft\s*365/i.test(item?.description || "");
}

function monthlyServiceQuoteItemsForBillingClient(client, month) {
  const billingClient = billingClientFor(client.id);
  const sourceIds = billingGroupClientIds(billingClient.id);
  return sourceIds.flatMap(sourceId => {
    const sourceClient = clientById(sourceId);
    const items = currentMspItems(sourceId, month).filter(item => !isGeneric365ServiceItem(item));
    if (sourceId === billingClient.id || !items.length) return items;
    return items.map(item => ({
      ...item,
      description: `${sourceClient.name}: ${item.description}`
    }));
  });
}

function microsoft365BillingItemsForBillingClient(client, month) {
  const billingClient = billingClientFor(client.id);
  return billingGroupClientIds(billingClient.id).flatMap(sourceId => {
    const sourceClient = clientById(sourceId);
    const pax8 = latestPax8Costs(sourceId, month);
    const microsoft365Total = (pax8?.rows || [])
      .filter(row => Number(row.quantity || 0) > 0)
      .reduce((sum, row) => sum + Number(row.monthlyPartnerCost || 0), 0);
    if (!microsoft365Total) return [];
    const rate = markedUpMicrosoft365Amount(microsoft365Total);
    return [{
      description: `Microsoft 365 licensing (${sourceClient.name})`,
      qty: 1,
      unitCost: microsoft365Total,
      markupPercent: 50,
      rate
    }];
  });
}

function servicesQuoteNeedsPax8(client, month) {
  const billingClient = billingClientFor(client.id);
  return billingGroupClientIds(billingClient.id)
    .some(sourceId => clientById(sourceId)?.pax8CompanyId && !latestPax8Costs(sourceId, month));
}

function createServicesQuoteForClient(client, month) {
  if (!client) return;
  const billingClient = billingClientFor(client.id);
  if (servicesQuoteNeedsPax8(client, month)) {
    selectedClientId = client.id;
    setView("clients");
    window.alert("Run Audit Services first so the quote can use current Pax8/MSRP Microsoft 365 prices.");
    return;
  }
  const items = [
    ...monthlyServiceQuoteItemsForBillingClient(client, month),
    ...microsoft365BillingItemsForBillingClient(client, month)
  ];
  const number = quoteNumber(billingClient, month);
  const quote = {
    id: id("quote"),
    number,
    clientId: billingClient.id,
    date: today,
    title: "Monthly IT Services",
    subject: `Monthly IT Services Quote (${number})`,
    status: "draft",
    items,
    showShipTo: false,
    shipTo: "",
    notes: "Microsoft 365 line items use Pax8 customer/MSRP pricing from the latest services audit."
  };
  state.quotes.push(quote);
  saveState();
  openEditor("quote", quote);
}

function monthlyInvoiceItemsForBillingClient(client, month) {
  const billingClient = billingClientFor(client.id);
  const sourceIds = billingGroupClientIds(billingClient.id);
  const serviceItems = sourceIds.flatMap(sourceId => {
    const sourceClient = clientById(sourceId);
    const items = currentMspItems(sourceId, month).filter(item => !isGeneric365ServiceItem(item));
    if (sourceId === billingClient.id || !items.length) return items;
    return items.map(item => ({
      ...item,
      description: `${sourceClient.name}: ${item.description}`
    }));
  });
  return [
    ...serviceItems,
    ...microsoft365BillingItemsForBillingClient(client, month)
  ];
}

function monthlyInvoiceNeedsAudit(client, month) {
  const sourceIds = billingGroupClientIds(billingClientFor(client.id).id);
  return sourceIds.some(sourceId => clientById(sourceId)?.licenseAuditBilling !== false && !latestAudit(sourceId, month));
}

function monthlyInvoiceReviewCount(client, month) {
  const sourceIds = billingGroupClientIds(billingClientFor(client.id).id);
  return sourceIds.reduce((sum, sourceId) => sum + Number(latestAudit(sourceId, month)?.reviewCount || 0), 0);
}

function createMonthlyInvoiceForClient(client, month) {
  if (!client) return;
  const billingClient = billingClientFor(client.id);
  if (monthlyInvoiceNeedsAudit(client, month)) {
    selectedClientId = client.id;
    setView("clients");
    window.alert("Run Audit Services for this client before generating the monthly MSP invoice.");
    return;
  }
  const items = monthlyInvoiceItemsForBillingClient(client, month);
  const reviewCount = monthlyInvoiceReviewCount(client, month);
  const number = monthlyInvoiceNumber(billingClient, month);
  const existingInvoice = state.invoices
    .filter(inv => inv.clientId === billingClient.id && inv.month === month && inv.type === "Monthly MSP")
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))[0];
  const invoice = {
    ...existingInvoice,
    id: existingInvoice?.id || id("inv"),
    number: existingInvoice?.number || number,
    clientId: billingClient.id,
    date: today,
    dueDate: addDays(today, 15),
    month,
    status: reviewCount ? "draft" : "ready",
    type: "Monthly MSP",
    subject: existingInvoice?.subject || defaultDocumentSubject("invoice", { number }),
    items,
    notes: reviewCount ? `${reviewCount} Microsoft 365 audit rows need review before sending.` : ""
  };
  if (existingInvoice) upsert(state.invoices, invoice);
  else state.invoices.push(invoice);
  billingGroupClientIds(billingClient.id).forEach(sourceId => {
    const audit = latestAudit(sourceId, month);
    if (audit && clientById(sourceId)?.licenseAuditBilling !== false) audit.invoiceId = invoice.id;
  });
  saveState();
  setView("invoices");
}

async function generateMonthlyInvoice(clientId = "", options = {}) {
  const client = (clientId && clientById(clientId)) || (selectedClientId && clientById(selectedClientId)) || state.clients.find(c => c.status === "active") || state.clients[0];
  if (!client) return;
  const month = new Date().toISOString().slice(0, 7);
  const button = clientId ? document.querySelector(`[data-client-invoice="${clientId}"]`) : document.getElementById("generate-monthly");
  const auditClientIds = billingGroupClientIds(billingClientFor(client.id).id);
  if (options.refreshAudit) {
    if (button) {
      button.disabled = true;
      button.classList.add("is-loading");
      button.textContent = "Auditing...";
    }
    const errors = await runServicesAudit(auditClientIds, month);
    if (errors.length) {
      if (button) {
        button.disabled = false;
        button.classList.remove("is-loading");
        button.textContent = "Auto Generate Invoice";
      }
      saveState();
      render();
      window.alert(`Invoice was not created because the services audit had ${errors.length} issue${errors.length === 1 ? "" : "s"}:\n\n${errors.join("\n")}`);
      return;
    }
  }
  createMonthlyInvoiceForClient(client, month);
}

async function generateServicesQuote(clientId = "", options = {}) {
  const client = (clientId && clientById(clientId)) || (selectedClientId && clientById(selectedClientId)) || state.clients.find(c => c.status === "active") || state.clients[0];
  if (!client) return;
  const month = new Date().toISOString().slice(0, 7);
  const button = clientId ? document.querySelector(`[data-client-quote="${clientId}"]`) : null;
  const auditClientIds = billingGroupClientIds(billingClientFor(client.id).id);
  if (options.refreshAudit) {
    if (button) {
      button.disabled = true;
      button.classList.add("is-loading");
      button.textContent = "Auditing...";
    }
    const errors = await runServicesAudit(auditClientIds, month);
    if (button) {
      button.disabled = false;
      button.classList.remove("is-loading");
      button.textContent = "Quote";
    }
    if (errors.length) {
      saveState();
      render();
      window.alert(`Quote was not created because the services audit had ${errors.length} issue${errors.length === 1 ? "" : "s"}:\n\n${errors.join("\n")}`);
      return;
    }
  }
  createServicesQuoteForClient(client, month);
}

function convertQuote(quoteId) {
  const quote = state.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  if (quote.status === "converted") {
    window.alert("This quote has already been converted to an invoice.");
    return;
  }
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
    taxRate: Number(quote.taxRate || 0),
    showShipTo: quote.showShipTo,
    shipTo: quote.shipTo,
    notes: quote.notes
  };
  quote.status = "converted";
  state.invoices.push(invoice);
  saveState();
  const preview = document.getElementById("document-preview");
  if (preview?.open) preview.close();
  const editor = document.getElementById("editor");
  if (editor?.open) editor.close();
  setView("invoices");
  window.alert(`Invoice ${invoice.number} was created from quote ${quote.number}.`);
}

function createInvoiceFromEditorQuote() {
  if (editing.mode !== "quote" || !editing.id) return;
  const form = document.getElementById("editor-form");
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.clientId) {
    setEditorError("Select or add a client before creating the invoice.", "clientId");
    return;
  }
  const quote = {
    id: editing.id,
    number: data.number,
    clientId: data.clientId,
    date: data.date,
    title: data.title,
    taxRate: Number(data.taxRate || 0),
    subject: data.subject || defaultDocumentSubject("quote", data),
    status: data.status,
    items: editorLineItems(),
    showShipTo: data.showShipTo === "on",
    shipTo: data.shipTo,
    notes: data.notes
  };
  upsert(state.quotes, quote);
  saveState();
  convertQuote(quote.id);
}

function previewDocument(type, idValue) {
  const doc = type === "quote" ? state.quotes.find(q => q.id === idValue) : state.invoices.find(inv => inv.id === idValue);
  if (!doc) return;
  previewing = { type, id: idValue };
  const client = clientById(doc.clientId);
  document.getElementById("document-title").textContent = type === "quote" ? "Quote" : "Invoice";
  document.getElementById("document-body").innerHTML = renderDocument(type, doc, client);
  document.getElementById("create-invoice-preview-document").hidden = type !== "quote" || doc.status === "converted";
  document.getElementById("send-preview-document").hidden =
    type === "invoice"
      ? computedInvoiceStatus(doc) === "paid" || computedInvoiceStatus(doc) === "void"
      : doc.status === "converted" || doc.status === "declined";
  document.getElementById("document-preview").showModal();
}

function exportDocumentPdf(type, doc) {
  if (!doc) return;
  previewing = { type, id: doc.id };
  const client = clientById(doc.clientId);
  document.getElementById("document-title").textContent = type === "quote" ? "Quote" : "Invoice";
  document.getElementById("document-body").innerHTML = renderDocument(type, doc, client);
  document.getElementById("create-invoice-preview-document").hidden = type !== "quote" || doc.status === "converted";
  document.getElementById("send-preview-document").hidden =
    type === "invoice"
      ? computedInvoiceStatus(doc) === "paid" || computedInvoiceStatus(doc) === "void"
      : doc.status === "converted" || doc.status === "declined";
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
  if (!previewing) return;
  if (previewing.type === "quote") sendQuote(previewing.id);
  else sendInvoice(previewing.id);
}

function createInvoiceFromPreviewQuote() {
  if (!previewing || previewing.type !== "quote") return;
  convertQuote(previewing.id);
}

function renderDocument(type, doc, client) {
  const title = type === "quote" ? "QUOTE" : "INVOICE";
  const contactEmail = type === "invoice" ? "billing@gsvisions.com" : "cory@gsvisions.com";
  const subtotal = documentSubtotal(doc);
  const tax = documentTaxTotal(doc);
  const total = invoiceTotal(doc);
  const taxRate = Number(doc.taxRate || 0);
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
        <table class="doc-table doc-items">
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
        ${renderDocumentItemTable(type, doc.items || [])}
        ${tax ? `
          <div class="doc-summary">
            <div><span>Subtotal</span><strong>${money.format(subtotal)}</strong></div>
            <div><span>Tax (${taxRate.toFixed(2)}%)</span><strong>${money.format(tax)}</strong></div>
            <div class="doc-total"><span>${type === "quote" ? "Total" : "Total Due"}</span><strong>${money.format(total)}</strong></div>
          </div>
        ` : `<div class="doc-total"><span>${type === "quote" ? "Total" : "Total Due"}</span><strong>${money.format(total)}</strong></div>`}
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

function renderDocumentItemTable(type, items = []) {
  if (type === "quote" && quoteHasTitleLines(items)) {
    let inSection = false;
    return `
      <table class="doc-table doc-quote-sections">
        <thead><tr><th>Description</th><th>Total</th></tr></thead>
        <tbody>
          ${items.map((item, index) => {
            const rowType = quoteLineType(item);
            if (rowType === "title") {
              inSection = true;
              return `
                <tr class="doc-section-row">
                  <td>${escapeHtml(item.description || "Project Section")}</td>
                  <td class="center">${money.format(quoteTitleLineAmount(items, index))}</td>
                </tr>
              `;
            }
            if (inSection || rowType === "detail") {
              return `<tr class="doc-detail-row"><td colspan="2">${escapeHtml(item.description || "")}</td></tr>`;
            }
            return `
              <tr>
                <td>${escapeHtml(item.description || "")}</td>
                <td class="center">${money.format(lineItemAmount(item))}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  }

  return `
    <table class="doc-table doc-items">
      <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${escapeHtml(item.description)}</td>
            <td class="center">${item.qty || ""}</td>
            <td class="center">${money.format(Number(item.rate || 0))}</td>
            <td class="center">${money.format(lineItemAmount(item))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
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
    if (!client?.m365TenantKey) throw new Error(`${client?.name || "This client"} does not have a Microsoft 365 tenant key yet.`);
    const tenant = encodeURIComponent(client.m365TenantKey);
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
  if (!client?.m365TenantKey) return null;
  const tenant = encodeURIComponent(client.m365TenantKey);
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

async function pullNinjaOneAuditForClient(clientId, month) {
  const client = clientById(clientId);
  if (!client?.ninjaOneOrgId) return null;
  const response = await fetch(`/api/ninjaone-audit?organizationId=${encodeURIComponent(client.ninjaOneOrgId)}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(`${client?.name || "Client"} NinjaOne: ${data.error || "pull failed"}`);

  const auditDraft = {
    clientId,
    month,
    organizationId: data.organizationId,
    rows: data.rows || [],
    totals: data.totals || {}
  };
  const pricingRows = priceNinjaOneRows(client, auditDraft);
  const audit = {
    id: id("ninja"),
    clientId,
    month,
    organizationId: data.organizationId,
    source: data.source || "NinjaOne",
    pulledAt: data.pulledAt || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    rows: data.rows || [],
    totals: data.totals || {},
    pricingRows
  };
  state.ninjaOneAudits = (state.ninjaOneAudits || []).filter(existing => !(existing.clientId === clientId && existing.month === month));
  state.ninjaOneAudits.push(audit);
  return audit;
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

async function runServicesAudit(clientIds, month) {
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

    try {
      await pullNinjaOneAuditForClient(idValue, month);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `${clientName(idValue)} NinjaOne pull failed.`);
    }
  }
  return errors;
}

async function auditServices(clientId = "") {
  const month = today.slice(0, 7);
  const client = clientById(clientId);
  const clientIds = clientId && client ? billingGroupClientIds(billingClientFor(client.id).id) : activeClientIds(clientId);
  const buttons = document.querySelectorAll(clientId ? `[data-audit-services="${clientId}"]` : `[data-audit-services], #audit-services-all`);
  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add("is-loading");
    button.textContent = "Auditing...";
  });

  const errors = await runServicesAudit(clientIds, month);

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
  if (target.id === "quick-add-client") quickAddClientFromDocument();
  if (target.id === "record-payment") openEditor("payment", { date: today, method: "Check" });
  if (target.id === "generate-monthly") generateMonthlyInvoice("", { refreshAudit: true });
  if (target.id === "audit-create-invoice") createInvoiceFromAudit();
  if (target.id === "audit-pull-graph") pullMicrosoft365Audit();
  if (target.id === "audit-pull-pax8") pullPax8Costs();
  if (target.id === "audit-services-all") auditServices();
  if (target.dataset.auditServices) auditServices(target.dataset.auditServices);
  if (target.id === "add-title-line") {
    document.getElementById("line-editor-rows")?.insertAdjacentHTML(
      "beforeend",
      lineEditorRow({ type: "title", description: "New Section", qty: 1, rate: 0 }, "quote")
    );
    updateEditorTotal();
  }
  if (target.id === "add-line-item") {
    const mode = document.getElementById("line-editor")?.dataset.mode || editing.mode;
    const item = mode === "quote" ? { type: "detail", description: "", qty: 1, rate: 0 } : {};
    document.getElementById("line-editor-rows")?.insertAdjacentHTML("beforeend", lineEditorRow(item, mode));
    updateEditorTotal();
  }
  if (target.dataset.removeLine !== undefined) {
    const rows = document.querySelectorAll("#line-editor-rows .line-editor-row");
    if (rows.length > 1) target.closest(".line-editor-row")?.remove();
    else target.closest(".line-editor-row")?.querySelectorAll("input").forEach(input => input.value = input.name === "itemQty" ? "1" : "");
    updateEditorTotal();
  }
  if (target.id === "editor-delete" && editing.mode === "invoice" && editing.id) deleteInvoice(editing.id);
  if (target.id === "editor-create-invoice" && editing.mode === "quote" && editing.id) createInvoiceFromEditorQuote();
  if (target.id === "editor-pdf" && editing.mode === "invoice") exportDocumentPdf("invoice", invoiceFromEditor());
  if (target.id === "editor-send" && editing.mode === "invoice" && editing.id) sendInvoice(editing.id, invoiceFromEditor());
  if (target.id === "editor-send" && editing.mode === "quote" && editing.id) sendQuote(editing.id, quoteFromEditor());
  if (target.id === "editor-close" || target.id === "editor-cancel") document.getElementById("editor").close();
  if (target.id === "close-preview") document.getElementById("document-preview").close();
  if (target.id === "edit-preview-document") editPreviewDocument();
  if (target.id === "create-invoice-preview-document") createInvoiceFromPreviewQuote();
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
  if (target.dataset.clientInvoice) generateMonthlyInvoice(target.dataset.clientInvoice, { refreshAudit: true });
  if (target.dataset.clientQuote) generateServicesQuote(target.dataset.clientQuote, { refreshAudit: true });
  if (target.dataset.editInvoice) openEditor("invoice", state.invoices.find(inv => inv.id === target.dataset.editInvoice));
  if (target.dataset.deleteInvoice) deleteInvoice(target.dataset.deleteInvoice);
  if (target.dataset.sendInvoice) sendInvoice(target.dataset.sendInvoice);
  if (target.dataset.sendQuote) sendQuote(target.dataset.sendQuote);
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

document.addEventListener("submit", event => {
  if (event.target?.id !== "editor-form") return;
  event.preventDefault();
  saveEditor();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const form = event.target.closest?.("#editor-form");
  if (!form) return;
  const tagName = event.target.tagName;
  if (tagName === "TEXTAREA") return;
  if (tagName === "BUTTON" && !["editor-save", "editor-cancel", "editor-close"].includes(event.target.id)) return;

  event.preventDefault();
  if (event.target.id === "editor-save" || event.metaKey || event.ctrlKey) {
    saveEditor();
    return;
  }
  if (event.target.id === "editor-cancel" || event.target.id === "editor-close") {
    document.getElementById("editor").close();
    return;
  }

  const controls = [...form.querySelectorAll("input, select, textarea, button")]
    .filter(control => !control.disabled && control.type !== "hidden" && control.offsetParent !== null);
  const currentIndex = controls.indexOf(event.target);
  const nextControl = controls[currentIndex + 1];
  if (nextControl && nextControl.id !== "editor-cancel") {
    nextControl.focus();
    if (nextControl.select) nextControl.select();
    return;
  }
  saveEditor();
});

document.addEventListener("input", event => {
  if (event.target.closest("#line-editor-rows") || event.target.id === "taxRate") updateEditorTotal(event.target);
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
  if (event.target.closest("#line-editor-rows") || event.target.id === "taxRate") updateEditorTotal(event.target);
});

document.addEventListener("dragstart", event => {
  const clientHandle = event.target.closest?.("[data-client-card-drag]");
  if (clientHandle) {
    const card = clientHandle.closest(".client-card[data-client-dashboard-card]");
    if (!card) return;
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.dataset.clientDashboardCard || "");
    return;
  }

  const row = event.target.closest?.(".line-editor-row");
  if (!row) return;
  row.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", "");
});

document.addEventListener("dragover", event => {
  const clientList = event.target.closest?.("#client-list");
  if (clientList) {
    const dragging = clientList.querySelector(".client-card.dragging");
    if (!dragging) return;
    event.preventDefault();
    const targetCard = event.target.closest(".client-card[data-client-dashboard-card]");
    if (!targetCard || targetCard === dragging) return;
    const targetBox = targetCard.getBoundingClientRect();
    const pointerSameRow = event.clientY >= targetBox.top && event.clientY <= targetBox.bottom;
    const afterTarget = pointerSameRow
      ? event.clientX > targetBox.left + targetBox.width / 2
      : event.clientY > targetBox.top + targetBox.height / 2;
    clientList.insertBefore(dragging, afterTarget ? targetCard.nextSibling : targetCard);
    return;
  }

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
  const card = event.target.closest?.("[data-client-card-drag]")?.closest(".client-card[data-client-dashboard-card]");
  if (card) {
    card.classList.remove("dragging");
    const clientList = document.getElementById("client-list");
    const orderedIds = [...clientList.querySelectorAll(".client-card[data-client-dashboard-card]")]
      .map(item => item.dataset.clientDashboardCard)
      .filter(Boolean);
    if (orderedIds.length) {
      const byId = new Map(state.clients.map(client => [client.id, client]));
      state.clients = orderedIds.map(idValue => byId.get(idValue)).filter(Boolean);
      byId.forEach((client, idValue) => {
        if (!orderedIds.includes(idValue)) state.clients.push(client);
      });
      saveState();
      renderClients();
    }
    return;
  }

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
