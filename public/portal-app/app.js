const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const costMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();
const portalBuild = "portal-20260716-46";
const portalNoteAuthorName = "Cory";
const m365AutomationRetryTimers = new Map();
const m365AutomationActiveRuns = new Set();

function showPortalRuntimeError(message = "") {
  const text = String(message || "Portal interaction failed.").slice(0, 300);
  const renderError = () => {
    let node = document.getElementById("portal-runtime-error");
    if (!node) {
      node = document.createElement("div");
      node.id = "portal-runtime-error";
      node.className = "portal-runtime-error";
      document.body.prepend(node);
    }
    node.textContent = `${portalBuild}: ${text}`;
  };
  if (document.body) renderError();
  else window.addEventListener("DOMContentLoaded", renderError, { once: true });
}

window.addEventListener("error", event => {
  showPortalRuntimeError(event.message || "Unexpected portal script error.");
});

window.addEventListener("unhandledrejection", event => {
  const reason = event.reason;
  showPortalRuntimeError(reason instanceof Error ? reason.message : reason || "Unexpected portal promise error.");
});

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
      m365TenantKey: "moxie",
      pax8CompanyId: "e1cda7ec-516c-4df1-b1cb-9baf660b4bda",
      ninjaOneOrgId: 3,
      userAutomationEnabled: false,
      approvedRequesterEmails: "",
      defaultM365License: "Exchange Online Plan 1",
      licenseRequestAliases: [
        { phrase: "moxie email", license: "Exchange Online Plan 1" },
        { phrase: "email only", license: "Exchange Online Plan 1" },
        { phrase: "mailbox", license: "Exchange Online Plan 1" }
      ],
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
      userAutomationEnabled: false,
      approvedRequesterEmails: "",
      defaultM365License: "Microsoft 365 Business Standard",
      licenseRequestAliases: [],
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
      userAutomationEnabled: false,
      approvedRequesterEmails: "",
      defaultM365License: "Microsoft 365 Business Standard",
      licenseRequestAliases: [],
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
      userAutomationEnabled: false,
      approvedRequesterEmails: "",
      defaultM365License: "Microsoft 365 Business Standard",
      licenseRequestAliases: [],
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
      userAutomationEnabled: false,
      approvedRequesterEmails: "",
      defaultM365License: "Microsoft 365 Business Standard",
      licenseRequestAliases: [],
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
  ninjaOneAudits: [],
  ninjaOneOrganizations: [],
  ninjaOneContacts: [],
  ninjaOneAssignees: [],
  ninjaOneDefaultAssigneeId: "",
  tickets: [],
  m365Requests: []
};

let state = loadState();
migrateDefaultRecords();
let activeView = "dashboard";
let ticketSyncInFlight = null;
const TICKET_SYNC_INTERVAL_MS = 15000;
let ticketSyncTimer = null;
let ticketLastSyncedAt = "";
let editing = null;
let previewing = null;
let selectedClientId = "";
let selectedTicketId = "";
let selectedTicketResponseMode = "public";
let editingTicketM365RequestId = "";
let resolvingTicketId = "";
const pax8LicensePulls = new Set();
const pax8LicensePullAttempted = new Set();

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
        for (const field of ["m365TenantKey", "pax8CompanyId", "ninjaOneOrgId", "licenseAuditBilling", "internalCosts", "ninjaOnePricing", "ccEmail", "billingClientId", "userAutomationEnabled", "approvedRequesterEmails", "defaultM365License", "licenseRequestAliases"]) {
          if (existing[field] === undefined && record[field] !== undefined) {
            existing[field] = structuredClone(record[field]);
            changed = true;
          }
        }
        if (!existing.m365TenantKey && record.m365TenantKey) {
          existing.m365TenantKey = record.m365TenantKey;
          changed = true;
        }
    if (existing.id === "client_moxie" && (!existing.m365TenantKey || existing.m365TenantKey === "default")) {
      existing.m365TenantKey = "moxie";
      changed = true;
    }
    if (existing.id === "client_moxie" && normalizedLicensePhrase(existing.defaultM365License) === normalizedLicensePhrase("Microsoft 365 Business Standard")) {
      existing.defaultM365License = "Exchange Online Plan 1";
      changed = true;
    }
    if (existing.id === "client_moxie") {
      const requiredAliases = defaultData.clients.find(client => client.id === "client_moxie")?.licenseRequestAliases || [];
      if (!Array.isArray(existing.licenseRequestAliases)) existing.licenseRequestAliases = [];
      requiredAliases.forEach(alias => {
        const exists = existing.licenseRequestAliases.some(row => normalizedLicensePhrase(row.phrase) === normalizedLicensePhrase(alias.phrase));
        if (!exists) {
          existing.licenseRequestAliases.push(structuredClone(alias));
          changed = true;
        }
      });
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
  if (!Array.isArray(state.ninjaOneOrganizations)) {
    state.ninjaOneOrganizations = [];
    changed = true;
  }
  if (!Array.isArray(state.ninjaOneContacts)) {
    state.ninjaOneContacts = [];
    changed = true;
  }
  if (!Array.isArray(state.tickets)) {
    state.tickets = [];
    changed = true;
  }
  if (!Array.isArray(state.m365Requests)) {
    state.m365Requests = [];
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

function clientByNinjaOneOrgId(organizationId) {
  return state.clients.find(c => String(c.ninjaOneOrgId || "") === String(organizationId || ""));
}

function quoteOneTimeClient(quote = {}) {
  const contact = quote.oneTimeClient || {};
  const name = String(contact.name || quote.oneTimeName || "").trim();
  if (!name) return null;
  const email = String(contact.email || "").trim();
  const phone = String(contact.phone || "").trim();
  const billTo = String(contact.billTo || "").trim() || [name, phone, email].filter(Boolean).join("\n");
  return {
    name,
    email,
    ccEmail: String(contact.ccEmail || "").trim(),
    phone,
    billTo,
    shipTo: String(contact.shipTo || quote.shipTo || "").trim()
  };
}

function documentClient(doc = {}) {
  return clientById(doc.clientId) || quoteOneTimeClient(doc);
}

function quoteClientName(quote = {}) {
  return clientById(quote.clientId)?.name || quoteOneTimeClient(quote)?.name || "One-time quote";
}

function quoteOneTimeClientFromForm(data = {}) {
  const name = String(data.oneTimeName || "").trim();
  const email = String(data.oneTimeEmail || "").trim();
  const phone = String(data.oneTimePhone || "").trim();
  const billTo = String(data.oneTimeBillTo || "").trim();
  const ccEmail = String(data.oneTimeCcEmail || "").trim();
  if (!name && !email && !phone && !billTo && !ccEmail) return null;
  const resolvedName = name || billTo.split("\n").find(Boolean)?.trim() || email;
  if (!resolvedName) return null;
  return {
    name: resolvedName,
    email,
    phone,
    ccEmail,
    billTo: billTo || [resolvedName, phone, email].filter(Boolean).join("\n")
  };
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
  const rawType = String(item.type || "line").toLowerCase().replace(/[\s_-]+/g, "");
  if (["title", "section", "header", "titleline", "master"].includes(rawType)) return "title";
  if (["detail", "sub", "subline", "child"].includes(rawType)) return "detail";
  return "line";
}

function quoteHasTitleLines(items = []) {
  return items.some((item, index) => quoteDisplayLineType(items, item, index) === "title");
}

function quoteDisplayLineType(items = [], item = {}, index = 0) {
  const explicitType = quoteLineType(item);
  if (explicitType !== "line") return explicitType;
  const hasExplicitTitle = items.some(row => quoteLineType(row) === "title");
  const hasFollowingLine = items.slice(index + 1).some(row => (row.description || "").trim());
  if (!hasExplicitTitle && lineItemAmount(item) === 0 && hasFollowingLine) return "title";
  return "line";
}

function quoteTitleLineAmount(items = [], titleIndex = 0) {
  let total = 0;
  for (let index = titleIndex + 1; index < items.length; index += 1) {
    if (quoteDisplayLineType(items, items[index], index) === "title") break;
    total += lineItemAmount(items[index]);
  }
  return total;
}

function isProjectDocument(type, doc = {}) {
  return type === "quote" || doc.type === "Project";
}

function sourceQuoteForInvoice(doc = {}) {
  const quoteNumber = String(doc.number || "").replace("GSV-INV", "GSV-Q");
  return state.quotes.find(quote => quote.id === doc.sourceQuoteId || quote.number === quoteNumber);
}

function projectDocumentTitle(type, doc = {}) {
  if (type === "quote") return doc.title || "Project Quote";
  const sourceQuote = sourceQuoteForInvoice(doc);
  return doc.title || sourceQuote?.title || "Project Quote";
}

function documentSubtotal(doc) {
  const items = doc.items || [];
  return items.reduce((sum, item, index) => {
    if (quoteHasTitleLines(items) && quoteDisplayLineType(items, item, index) === "title") return sum;
    return sum + lineItemAmount(item);
  }, 0);
}

function documentTaxTotal(doc) {
  const taxRate = Number(doc.taxRate || 0);
  if (!taxRate) return 0;
  const items = doc.items || [];
  const taxableSubtotal = items.reduce((sum, item, index) => {
    if (!item.taxable) return sum;
    if (quoteHasTitleLines(items) && quoteDisplayLineType(items, item, index) === "title") return sum;
    return sum + lineItemAmount(item);
  }, 0);
  return Math.round(taxableSubtotal * (taxRate / 100) * 100) / 100;
}

function documentShippingTotal(doc) {
  return Math.max(0, Number(doc.shippingCost || 0));
}

function invoiceTotal(invoice) {
  return documentSubtotal(invoice) + documentTaxTotal(invoice) + documentShippingTotal(invoice);
}

function quoteMargin(quote = {}) {
  const items = quote.items || [];
  const hasSections = quoteHasTitleLines(items);
  return items.reduce((sum, item, index) => {
    if (hasSections && quoteDisplayLineType(items, item, index) === "title") return sum;
    const amount = lineItemAmount(item);
    const detail = String(item.detail || item.itemDetail || "");
    if (/labor/i.test(detail)) return sum + amount;
    const unitCost = Number(item.unitCost || 0);
    if (!unitCost) return sum;
    return sum + Number(item.qty || 0) * (Number(item.rate || 0) - unitCost);
  }, 0);
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

function automationStepLogHtml(steps = []) {
  if (!Array.isArray(steps) || !steps.length) return "";
  return `
    <ol class="automation-run-log" aria-live="polite">
      ${steps.map(step => `
        <li class="${escapeHtml(step.status || "pending")}">
          <span class="automation-step-dot"></span>
          <span>
            <strong>${escapeHtml(step.label || "")}</strong>
            ${step.detail ? `<small>${escapeHtml(step.detail)}</small>` : ""}
          </span>
        </li>
      `).join("")}
    </ol>
  `;
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === view));
  document.querySelectorAll(".nav-link, .nav-sub-link").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  updateNavGroups(view);
  document.getElementById("view-title").textContent = {
    dashboard: "Dashboard",
    tickets: "Support Tickets",
    "ticket-detail": "Support Ticket",
    clients: "Clients",
    audit365: "Services Audit",
    invoices: "Invoices",
    quotes: "Quotes",
    payments: "Payments",
    exports: "Year-End Export"
  }[view];
  render();
  if (["dashboard", "tickets", "ticket-detail"].includes(view)) requestNinjaOneTicketSync();
}

function updateNavGroups(view = activeView) {
  document.querySelectorAll("[data-nav-group]").forEach(group => {
    const name = group.dataset.navGroup;
    const shouldExpand =
      (name === "ticketing" && ["tickets", "ticket-detail"].includes(view)) ||
      (name === "billing" && ["invoices", "quotes", "payments", "exports"].includes(view)) ||
      (name === "clients" && ["clients", "audit365"].includes(view));
    group.classList.toggle("expanded", shouldExpand || group.dataset.userExpanded === "true");
    const chevron = group.querySelector(".nav-chevron");
    if (chevron) chevron.textContent = group.classList.contains("expanded") ? "⌃" : "⌄";
  });
}

function toggleNavGroup(groupName) {
  const group = document.querySelector(`[data-nav-group="${groupName}"]`);
  if (!group) return;
  const nextExpanded = !group.classList.contains("expanded");
  group.dataset.userExpanded = nextExpanded ? "true" : "false";
  updateNavGroups();
}

function render() {
  renderDashboard();
  renderTickets();
  renderTicketDetail();
  renderM365Requests();
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
  const openTickets = state.tickets.filter(ticket => ticket.ninjaTicketId && !["resolved", "deleted"].includes(ticket.status)).length;

  document.getElementById("metric-open").textContent = money.format(open);
  document.getElementById("metric-paid").textContent = money.format(paid);
  document.getElementById("metric-msp").textContent = money.format(msp);
  document.getElementById("metric-pax8").textContent = costMoney.format(pax8);
  document.getElementById("metric-ninjaone").textContent = costMoney.format(ninjaOne);
  document.getElementById("metric-vendor-costs").textContent = costMoney.format(vendorCosts);
  document.getElementById("metric-margin").textContent = costMoney.format(margin);
  document.getElementById("metric-quotes").textContent = draftQuotes;
  const ticketMetric = document.getElementById("metric-tickets");
  if (ticketMetric) ticketMetric.textContent = openTickets;

  document.getElementById("dashboard-invoices").innerHTML = invoices
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(inv => {
      const status = computedInvoiceStatus(inv);
      const needsAction = invoiceNeedsAction(inv);
      return `
      <div class="item dashboard-invoice-item clickable-card ${needsAction ? "invoice-action-needed" : ""}" data-open-customer-preview-invoice="${inv.id}" role="button" tabindex="0">
        <div class="item-line dashboard-invoice-main">
          <strong>${escapeHtml(inv.number)}</strong>
          <span class="dashboard-invoice-badges">
            ${needsAction ? `<span class="action-needed-pill">${escapeHtml(invoiceActionLabel(inv))}</span>` : ""}
            <span class="badge ${status}">${status}</span>
          </span>
        </div>
        <div class="item-line subtle">
          <span>${escapeHtml(clientName(inv.clientId))}</span>
          <strong>${money.format(invoiceTotal(inv))}</strong>
        </div>
        ${invoiceActionButtons(inv)}
      </div>
    `;
    }).join("") || `<p class="subtle">No invoices yet.</p>`;

  const recentTickets = (state.tickets || [])
    .filter(ticket => ticket.ninjaTicketId && isActiveTicket(ticket))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 6);
  document.getElementById("dashboard-tickets").innerHTML = recentTickets.map(ticket => `
    <button class="item dashboard-ticket-item dashboard-card-button" type="button" data-view-ticket="${ticket.id}">
      <div class="item-line">
        <span class="ticket-title-link">
          ${escapeHtml(ticket.title || "Support request")}
        </span>
        <span class="badge ${ticket.status || "new"}">${ticketStatusLabel(ticket.status)}</span>
      </div>
      <div class="item-line subtle">
        <span>${escapeHtml(ticket.ninjaOneOrgName || ninjaOneOrganizationName(ticket.ninjaOneOrgId) || clientName(ticket.clientId))}</span>
        <strong>${escapeHtml(formatDate(ticket.createdAt))}</strong>
      </div>
    </button>
  `).join("") || `<p class="subtle">No recent tickets.</p>`;

  const activity = [
    ...state.payments.map(p => ({ date: p.date, text: `Payment ${money.format(Number(p.amount || 0))} for ${invoiceNumber(p.invoiceId)}` })),
    ...state.quotes.map(q => ({ date: q.date, text: `Quote ${q.number} ${q.status}` }))
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 6);
  document.getElementById("dashboard-activity").innerHTML = activity.map(item => `
    <div class="item">
      <strong>${escapeHtml(item.text)}</strong>
      <div class="subtle">${formatDate(item.date)}</div>
    </div>
  `).join("") || `<p class="subtle">No recent activity.</p>`;
  updateNavBillingCounts();
}

function renderTickets() {
  const list = document.getElementById("ticket-list");
  if (!list) return;
  const tickets = (state.tickets || []).filter(ticket => ticket.ninjaTicketId);
  const filter = document.getElementById("ticket-filter")?.value || "unassigned";
  const visible = tickets
    .filter(ticket => {
      if (filter === "unassigned") return isActiveTicket(ticket) && !ticket.assignedAppUserId;
      if (filter === "all") return ticket.status !== "deleted";
      if (filter === "assigned") return ticket.status !== "deleted" && isTicketAssignedToMe(ticket);
      if (filter === "open") return isActiveTicket(ticket);
      if (filter === "pending") return ticket.source === "email" && ticket.status === "pending";
      return ticket.status === filter;
    })
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  setText("tickets-new", tickets.filter(ticket => ticket.status === "new").length);
  setText("tickets-progress", tickets.filter(ticket => ticket.status === "in_progress").length);
  setText("tickets-waiting", tickets.filter(ticket => ticket.status === "waiting").length);
  setText("tickets-urgent", tickets.filter(ticket => ticket.priority === "urgent" && isActiveTicket(ticket)).length);
  updateNavTicketCounts();

  list.innerHTML = `
    <table>
      <thead>
        <tr><th>Ticket</th><th>Client</th><th>Requester</th><th>Priority</th><th>Status</th><th>NinjaOne</th><th></th></tr>
      </thead>
      <tbody>
        ${visible.map(ticket => `
          <tr>
            <td>
              <button class="link-button ticket-title-link" data-view-ticket="${ticket.id}">
                ${escapeHtml(ticket.title || "Support request")}
              </button>
              <br><span class="subtle">${escapeHtml(ticket.category || "General")} · ${formatDate(ticket.createdAt)}</span>
            </td>
            <td>${escapeHtml(ticket.ninjaOneOrgName || ninjaOneOrganizationName(ticket.ninjaOneOrgId) || clientName(ticket.clientId))}</td>
            <td>${escapeHtml(ticket.requester || "")}</td>
            <td><span class="badge ${ticket.priority || "normal"}">${ticketPriorityLabel(ticket.priority)}</span></td>
            <td><span class="badge ${ticket.status || "new"}">${ticketStatusLabel(ticket.status)}</span></td>
            <td>${ticket.ninjaTicketId ? escapeHtml(ticket.ninjaTicketId) : ticket.syncError ? `<span class="badge sync_failed">Sync failed</span><br><span class="subtle">${escapeHtml(ticket.syncError)}</span>` : "<span class=\"subtle\">Syncing...</span>"}</td>
            <td class="row-actions">
              <button data-view-ticket="${ticket.id}">View</button>
              <button data-ticket-waiting="${ticket.id}">Waiting</button>
              <button data-ticket-resolved="${ticket.id}">Resolve</button>
            </td>
          </tr>
        `).join("") || `<tr><td colspan="7" class="empty-cell">No tickets in this view.</td></tr>`}
      </tbody>
    </table>
  `;
}

function openTicketDetail(ticketId) {
  const ticket = state.tickets.find(item => item.id === ticketId && item.ninjaTicketId);
  if (!ticket) return;
  selectedTicketId = ticket.id;
  selectedTicketResponseMode = "public";
  setView("ticket-detail");
}

function ticketTypeLabel(ticket = {}) {
  const value = typeof ticket === "string" ? ticket : ticket.type;
  return {
    service_request: "Service Request",
    SERVICE_REQUEST: "Service Request",
    problem: "Problem",
    PROBLEM: "Problem",
    incident: "Incident",
    INCIDENT: "Incident",
    question: "Question",
    QUESTION: "Question",
    task: "Task",
    TASK: "Task"
  }[String(value || "service_request")] || String(value || "Service Request").replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function ticketFormLabel(ticket = {}) {
  return ticket.form || "Default";
}

function ticketTypeValue(ticket = {}) {
  const raw = typeof ticket === "string" ? ticket : ticket.type;
  const normalized = String(raw || "service_request").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return {
    service: "service_request",
    service_request: "service_request",
    problem: "problem",
    incident: "incident",
    question: "question",
    task: "task"
  }[normalized] || "service_request";
}

function ticketTypeOptions(selected = "service_request") {
  const current = ticketTypeValue(selected);
  return [
    ["service_request", "Service Request"],
    ["problem", "Problem"],
    ["incident", "Incident"],
    ["question", "Question"],
    ["task", "Task"]
  ].map(([value, label]) => `<option value="${value}" ${current === value ? "selected" : ""}>${label}</option>`).join("");
}

function ticketFormOptions(selected = "Default") {
  const current = String(selected || "Default");
  const forms = ["Default", ...new Set((state.tickets || []).map(ticket => ticket.form).filter(Boolean))];
  return forms.map(form => `<option value="${escapeHtml(form)}" ${String(form) === current ? "selected" : ""}>${escapeHtml(form)}</option>`).join("");
}

function defaultNinjaOneAssigneeId() {
  const configured = String(state.ninjaOneDefaultAssigneeId || "").trim();
  if (configured) return configured;
  const cory = (state.ninjaOneAssignees || []).find(user =>
    /cory/i.test(`${user.name || ""} ${user.email || ""}`)
  );
  return cory?.id ? String(cory.id) : "";
}

function ticketAssignedAppUserId(ticket = {}) {
  return String(ticket.assignedAppUserId || defaultNinjaOneAssigneeId() || "");
}

function isActiveTicket(ticket = {}) {
  return !["resolved", "deleted"].includes(ticket.status);
}

function isTicketAssignedToMe(ticket = {}) {
  const assigned = String(ticket.assignedAppUserId || "");
  const mine = String(defaultNinjaOneAssigneeId() || "");
  return Boolean(assigned && mine && assigned === mine);
}

function ninjaOneAssigneeOptions(selected = "") {
  const current = String(selected || "");
  const assignees = state.ninjaOneAssignees || [];
  const options = assignees.map(user => {
    const value = String(user.id || "");
    const label = user.email ? `${user.name || user.email} (${user.email})` : user.name || value;
    return `<option value="${escapeHtml(value)}" ${value === current ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
  return `<option value="" ${!current ? "selected" : ""}>Unassigned</option>${options}`;
}

function ticketSeverityLabel(severity = "none") {
  return {
    none: "None",
    minor: "Minor",
    moderate: "Moderate",
    major: "Major",
    critical: "Critical"
  }[String(severity || "none").toLowerCase()] || "None";
}

function ticketSeverityOptions(selected = "none") {
  return ["none", "minor", "moderate", "major", "critical"]
    .map(value => `<option value="${value}" ${value === String(selected || "none").toLowerCase() ? "selected" : ""}>${ticketSeverityLabel(value)}</option>`)
    .join("");
}

function csvToList(value = "") {
  return String(value || "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function listToCsv(value = []) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
}

function followupInputValue(epochSeconds) {
  if (!epochSeconds) return "";
  const date = new Date(Number(epochSeconds) * 1000);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function followupEpochValue(value = "") {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor(date.getTime() / 1000);
}

function ticketRequesterName(ticket = {}) {
  return ticket.requester || [ticket.requesterFirstName, ticket.requesterLastName].filter(Boolean).join(" ") || "Requester";
}

function ticketClientName(ticket = {}) {
  return ticket.ninjaOneOrgName || ninjaOneOrganizationName(ticket.ninjaOneOrgId) || clientName(ticket.clientId);
}

function ticketCreatedLine(ticket = {}) {
  const dateText = ticket.createdAt ? formatDate(ticket.createdAt) : "unknown date";
  return `Created by Technician on ${dateText}`;
}

function decodeHtmlEntities(value = "") {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(value || "");
  return textarea.value;
}

function plainEmailText(value = "") {
  let text = String(value || "");
  if (!/[<][a-z!/][\s\S]*[>]/i.test(text)) return decodeHtmlEntities(text).trim();
  text = text
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|table|tbody|h[1-6]|li|ol|ul)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ");
  return decodeHtmlEntities(text)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function sanitizeEmailHtml(value = "") {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  template.content.querySelectorAll("script, style, iframe, object, embed, form, input, button, meta, link").forEach(node => node.remove());
  template.content.querySelectorAll("*").forEach(node => {
    [...node.attributes].forEach(attribute => {
      const name = attribute.name.toLowerCase();
      const val = attribute.value || "";
      if (name.startsWith("on")) node.removeAttribute(attribute.name);
      if ((name === "href" || name === "src") && /^\s*javascript:/i.test(val)) node.removeAttribute(attribute.name);
      if (name === "target") node.setAttribute("rel", "noopener noreferrer");
    });
  });
  return template.innerHTML;
}

function emailPreviewHtml(value = "") {
  const raw = String(value || "");
  if (!/[<][a-z!/][\s\S]*[>]/i.test(raw)) {
    return `<div class="ticket-email-plain">${lines(raw)}</div>`;
  }
  const html = sanitizeEmailHtml(raw);
  return `<div class="ticket-email-rendered">${html}</div>`;
}

function recentTicketsFor(ticket = {}) {
  return (state.tickets || [])
    .filter(item => item.ninjaTicketId && item.id !== ticket.id && String(item.ninjaOneOrgId || item.clientId) === String(ticket.ninjaOneOrgId || ticket.clientId))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 5);
}

function embeddedPortalNotesFromInternalNotes(value = "") {
  const text = String(value || "");
  const matches = [...text.matchAll(/(?:^|\n)Portal (public response|private note|note) ([0-9-]+): ([\s\S]*?)(?=\nPortal (?:public response|private note|note) [0-9-]+:|$)/g)];
  return matches.map((match, index) => ({
    id: `embedded_${match[2]}_${index}`,
    type: match[1] === "private note" ? "private" : "public",
    body: String(match[3] || "").trim(),
    createdAt: match[2],
    authorName: portalNoteAuthorName,
  })).filter(note => note.body);
}

function internalNotesWithoutPortalNotes(value = "") {
  return String(value || "")
    .replace(/(?:^|\n)Portal (?:public response|private note|note) [0-9-]+: [\s\S]*?(?=\nPortal (?:public response|private note|note) [0-9-]+:|$)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ticketPortalNotes(ticket = {}) {
  const storedNotes = Array.isArray(ticket.portalNotes) ? ticket.portalNotes : [];
  const notes = [...storedNotes, ...embeddedPortalNotesFromInternalNotes(ticket.internalNotes)];
  const seen = new Set();
  return notes
    .filter(note => {
      const key = `${note.type || "public"}|${note.createdAt || ""}|${note.body || ""}`;
      if (!note.body || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function addPortalTicketActivity(ticket, note, publicComment = true) {
  if (!ticket || !note) return;
  const entry = {
    id: id("portal_note"),
    type: publicComment ? "public" : "private",
    body: note,
    createdAt: new Date().toISOString(),
    authorName: portalNoteAuthorName,
  };
  ticket.portalNotes = [entry, ...(Array.isArray(ticket.portalNotes) ? ticket.portalNotes : [])];
}

function latestPortalResolutionNote(ticket = {}) {
  return ticketPortalNotes(ticket).find(note => note.type !== "private" && String(note.body || "").trim()) || null;
}

function hasPortalResolutionOverride(ticket = {}) {
  if (ticket.portalStatusOverride === "resolved") return true;
  return ticketPortalNotes(ticket).some(note => {
    if (note.type === "private") return false;
    return /\b(completed|complete|resolved|done|closed)\b/i.test(String(note.body || ""));
  });
}

function hasMatchingPortalNote(ticket = {}, noteBody = "", publicComment = true) {
  const cleanBody = String(noteBody || "").trim();
  if (!cleanBody) return false;
  const expectedType = publicComment ? "public" : "private";
  return ticketPortalNotes(ticket).some(note =>
    note.type === expectedType && String(note.body || "").trim() === cleanBody
  );
}

function deletePortalTicketActivity(ticketId, noteId) {
  const ticket = state.tickets.find(item => item.id === ticketId);
  if (!ticket || !Array.isArray(ticket.portalNotes)) return;
  const before = ticket.portalNotes.length;
  ticket.portalNotes = ticket.portalNotes.filter(note => String(note.id || "") !== String(noteId || ""));
  if (ticket.portalNotes.length === before) return;
  ticket.updatedAt = today;
  saveState();
  renderTicketDetail();
}

function ticketActivityEntries(ticket = {}) {
  const requester = ticketRequesterName(ticket);
  const entries = ticketPortalNotes(ticket).map(note => {
    const authorName = note.authorName || portalNoteAuthorName || "GSV Portal";
    const initials = authorName.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "GS";
    const canDelete = Array.isArray(ticket.portalNotes)
      && ticket.portalNotes.some(item => String(item.id || "") === String(note.id || ""));
    return `
      <div class="ticket-activity-entry">
        <span class="avatar-initials">${escapeHtml(initials)}</span>
        <div>
          <p class="ticket-activity-title-row">
            <span><strong>${escapeHtml(authorName)}</strong> <span class="ticket-activity-label">${note.type === "private" ? "Portal private note" : "Portal public response"}</span> <span class="subtle">${escapeHtml(formatDate(note.createdAt))}</span></span>
            ${canDelete ? `<button class="link-button ticket-note-delete" type="button" data-delete-portal-note="${escapeHtml(note.id || "")}" data-ticket-id="${escapeHtml(ticket.id || "")}">Delete</button>` : ""}
          </p>
          <div class="ticket-note-body">${lines(note.body)}</div>
        </div>
      </div>
    `;
  });
  if (ticket.description) {
    entries.push(`
      <div class="ticket-activity-entry">
        <span class="avatar-initials">${escapeHtml(requester.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "GS")}</span>
        <div>
          <p><strong>${escapeHtml(requester)}</strong> <span class="subtle">${escapeHtml(formatDate(ticket.createdAt))}</span></p>
      <p class="ticket-activity-label">Ticket description:</p>
      ${emailPreviewHtml(ticket.description)}
        </div>
      </div>
    `);
  }
  const remainingInternalNotes = internalNotesWithoutPortalNotes(ticket.internalNotes);
  if (remainingInternalNotes) {
    entries.push(`
      <div class="ticket-activity-entry ticket-internal-entry">
        <span class="avatar-initials">IN</span>
        <div>
          <p><strong>Internal notes</strong></p>
          <div class="ticket-note-body">${lines(remainingInternalNotes)}</div>
        </div>
      </div>
    `);
  }
  entries.push(`
    <div class="ticket-activity-meta">
      <p><span class="ticket-activity-label">Requester:</span> ${escapeHtml(requester)}</p>
      <p><span class="ticket-activity-label">Category:</span> ${escapeHtml(ticket.category || "General")}</p>
    </div>
  `);
  return entries;
}

function m365RequestForTicket(ticket = {}) {
  if (!ticket.ninjaTicketId) return null;
  return (state.m365Requests || []).find(request => String(request.ninjaTicketId || "") === String(ticket.ninjaTicketId)) || null;
}

function findM365Request(requestId = "") {
  const direct = (state.m365Requests || []).find(request => request.id === requestId);
  if (direct) return direct;
  const ticket = (state.tickets || []).find(item => item.id === selectedTicketId);
  return ticket ? m365RequestForTicket(ticket) : null;
}

function ensureM365RequestForTicket(ticket = {}) {
  if (!ticket?.ninjaTicketId || ticket.status === "deleted" || !isNewUserTicket(ticket)) return null;
  const existing = m365RequestForTicket(ticket);
  if (existing) {
    if (!existing.ninjaTicketId && ticket.ninjaTicketId) {
      existing.ninjaTicketId = ticket.ninjaTicketId;
      existing.updatedAt = today;
      saveState();
    }
    return existing;
  }
  const parsed = parseM365RequestFromTicket(ticket);
  if (!parsed.client?.userAutomationEnabled && !parsed.missing.includes("client mapping")) {
    parsed.request.status = "needs_review";
    parsed.request.automationError = "Needs review: new-user automation is not enabled for this client.";
  }
  state.m365Requests.push(parsed.request);
  saveState();
  return parsed.request;
}

function m365LicenseChoices(request = {}, ticket = {}) {
  const clientId = request.clientId || ticket.clientId;
  const pax8 = latestPax8Costs(clientId) || latestPax8Costs(clientId, today.slice(0, 7));
  const values = (pax8?.rows || [])
    .filter(row => !row.status || !/cancel|delete/i.test(row.status))
    .map(row => row.productName)
    .filter(name => /\b(microsoft|exchange|office|365|copilot)\b/i.test(String(name || "")));
  return [...new Set(values.map(value => String(value || "").trim()).filter(Boolean))];
}

function ticketM365ActionHref(action, requestId = "") {
  return `#ticket-m365-${encodeURIComponent(action)}=${encodeURIComponent(requestId || "")}`;
}

function requestPurchasedLicensesForClient(clientId = "") {
  const client = clientById(clientId);
  if (!client?.pax8CompanyId || pax8LicensePulls.has(clientId) || pax8LicensePullAttempted.has(clientId)) return;
  pax8LicensePullAttempted.add(clientId);
  pax8LicensePulls.add(clientId);
  pullPax8CostsForClient(clientId, today.slice(0, 7))
    .then(() => {
      saveState();
      renderTicketDetail();
      renderM365Requests();
    })
    .catch(error => {
      console.error("Pax8 license pull failed", error);
      const ticket = (state.tickets || []).find(item => item.id === selectedTicketId);
      const request = ticket ? m365RequestForTicket(ticket) : null;
      if (request && String(request.clientId || "") === String(clientId)) {
        request.pax8LicenseError = error instanceof Error ? error.message : "Pax8 license pull failed.";
        request.updatedAt = today;
        saveState();
      }
    })
    .finally(() => {
      pax8LicensePulls.delete(clientId);
      renderTicketDetail();
    });
}

function m365LicenseSelectHtml(request = {}, ticket = {}) {
  const clientId = request.clientId || ticket.clientId;
  const client = clientById(clientId);
  const choices = m365LicenseChoices(request, ticket);
  const current = String(request.license || "").trim();
  if (!choices.length) {
    const isLoading = clientId && pax8LicensePulls.has(clientId);
    const message = request.pax8LicenseError
      ? `Pax8 load failed: ${request.pax8LicenseError}`
      : isLoading
        ? "Loading purchased Microsoft licenses from Pax8..."
        : client?.pax8CompanyId
          ? "No purchased Microsoft licenses are loaded for this client yet."
          : "Add this client's Pax8 Company ID to choose purchased licenses.";
    return `
      <a class="inline-field inline-field-button" href="${ticketM365ActionHref("edit", request.id || "")}" data-edit-365-request="${escapeHtml(request.id || "")}">
        <small>License</small>
        <strong>${escapeHtml(current || "No purchased licenses pulled")}</strong>
        <em>${escapeHtml(message)}</em>
      </a>
    `;
  }
  const selected = matchingM365LicenseChoice(current, choices) || choices[0] || current;
  return `
    <label class="inline-field inline-field-select">
      <small>License</small>
      <select data-ticket-365-license="${request.id}" aria-label="Microsoft 365 license">
        ${choices.map(choice => `<option value="${escapeHtml(choice)}" ${choice === selected ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}
      </select>
    </label>
  `;
}

function m365InlineFieldHtml(name, label, value = "", type = "text") {
  return `
    <label class="m365-inline-field">
      <small>${escapeHtml(label)}</small>
      <input data-m365-inline-field="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value || "")}">
    </label>
  `;
}

function m365InlineLicenseHtml(request = {}, ticket = {}) {
  const choices = m365LicenseChoices(request, ticket);
  const current = String(request.license || "").trim();
  if (!choices.length) {
    return m365InlineFieldHtml("license", "License", current || "Exchange Online (Plan 1) [New Commerce Experience]");
  }
  const selected = matchingM365LicenseChoice(current, choices) || choices[0] || current;
  return `
    <label class="m365-inline-field">
      <small>License</small>
      <select data-m365-inline-field="license">
        ${choices.map(choice => `<option value="${escapeHtml(choice)}" ${choice === selected ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}
      </select>
    </label>
  `;
}

function ticketM365InlineEditorHtml(request = {}, ticket = {}) {
  const displayName = request.displayName || `${request.firstName || ""} ${request.lastName || ""}`.trim();
  return `
    <div class="m365-inline-editor">
      ${m365InlineFieldHtml("firstName", "First Name", request.firstName || "")}
      ${m365InlineFieldHtml("lastName", "Last Name", request.lastName || "")}
      ${m365InlineFieldHtml("displayName", "Display Name", displayName)}
      ${m365InlineFieldHtml("userPrincipalName", "New Mailbox", request.userPrincipalName || "", "email")}
      ${m365InlineFieldHtml("setupEmail", "Communication Email", request.setupEmail || request.sourceEmail || "", "email")}
      ${m365InlineFieldHtml("sourceEmail", "Requester Email", request.sourceEmail || ticket.requesterEmail || "", "email")}
      ${m365InlineLicenseHtml(request, ticket)}
      <label class="m365-inline-field m365-inline-notes">
        <small>Notes / License Code Words</small>
        <textarea data-m365-inline-field="notes" rows="4">${escapeHtml(request.notes || "")}</textarea>
      </label>
      <div class="row-actions m365-inline-actions">
        <a href="${ticketM365ActionHref("save", request.id)}" data-save-365-inline="${request.id}" class="button-link primary">Save Request</a>
        <a href="${ticketM365ActionHref("cancel", request.id)}" data-cancel-365-inline="${request.id}" class="button-link">Cancel</a>
      </div>
    </div>
  `;
}

function scheduleM365AutomationRetry(requestId, delayMs = 30000) {
  if (!requestId || m365AutomationRetryTimers.has(requestId)) return;
  const timer = window.setTimeout(() => {
    m365AutomationRetryTimers.delete(requestId);
    const request = findM365Request(requestId);
    if (!request || request.status === "complete" || request.automationStarted === false) return;
    runM365Automation(requestId, { autoResume: true });
  }, Math.max(10000, Number(delayMs) || 30000));
  m365AutomationRetryTimers.set(requestId, timer);
}

function cancelM365AutomationRetry(requestId) {
  const timer = m365AutomationRetryTimers.get(requestId);
  if (!timer) return;
  window.clearTimeout(timer);
  m365AutomationRetryTimers.delete(requestId);
}

function effectiveM365Status(request = {}) {
  const status = request.status || "requested";
  const automationStarted = request.automationStarted === true;
  if (status === "waiting_for_license" && !automationStarted) {
    return request.licenseAvailability ? "pax8_needed" : "needs_review";
  }
  const hasWaitingStep = Array.isArray(request.automationRunLog)
    && request.automationRunLog.some(step => step?.status === "waiting");
  if (
    automationStarted
    && (
      status === "waiting_for_license"
      || hasWaitingStep
      || ((request.pax8AlreadyIncreased || request.pax8SubscriptionId) && ["running", "pax8_needed"].includes(status))
    )
  ) {
    return "waiting_for_license";
  }
  return status;
}

function repairM365AutomationRunLog(request = {}, ticket = {}) {
  if (!request || typeof request !== "object" || !Array.isArray(request.automationRunLog)) return false;
  const ninjaTicketId = request.ninjaTicketId || ticket.ninjaTicketId || "";
  const setupEmail = request.setupEmail || request.sourceEmail || ticket.requesterEmail || "";
  let changed = false;
  request.automationRunLog = request.automationRunLog.map(step => {
    const label = String(step?.label || "");
    if (ninjaTicketId && /No NinjaOne ticket was linked/i.test(label)) {
      changed = true;
      return {
        ...step,
        status: "done",
        label: `Linked to NinjaOne ticket #${ninjaTicketId}. No new ticket note was posted for this recovery check.`
      };
    }
    if (setupEmail && /No setup email contact was provided/i.test(label)) {
      changed = true;
      return {
        ...step,
        status: "done",
        label: `Setup email draft was already handled for ${setupEmail}.`
      };
    }
    return step;
  });
  if (!request.ninjaTicketId && ninjaTicketId) {
    request.ninjaTicketId = ninjaTicketId;
    changed = true;
  }
  return changed;
}

function normalizeM365AutomationState(request = {}, ticket = {}) {
  if (!request || typeof request !== "object") return request;
  const repaired = repairM365AutomationRunLog(request, ticket);
  if (request.status === "waiting_for_license" && request.automationStarted !== true) {
    const previewSubscriptionId = request.pax8PreviewSubscriptionId || request.pax8SubscriptionId || "";
    if (previewSubscriptionId) request.pax8PreviewSubscriptionId = previewSubscriptionId;
    request.pax8SubscriptionId = "";
    request.status = request.licenseAvailability ? "pax8_needed" : "needs_review";
    request.pax8AlreadyIncreased = false;
    request.automationRunLog = [];
    request.automationPreview = m365PreviewText({
      licenseAvailability: request.licenseAvailability,
      pax8BackedLicense: Boolean(previewSubscriptionId),
      needsPax8Increase: Boolean(previewSubscriptionId),
      pax8: {
        subscriptionId: previewSubscriptionId,
        currentQuantity: request.pax8Quantity,
        nextQuantity: Number(request.pax8Quantity || 0) + (previewSubscriptionId ? 1 : 0),
        availableQuantity: request.licenseAvailability?.pax8Available ?? 0,
      },
    }, request);
    request.automationError = "";
  }
  const savedAvailable = Number(request.licenseAvailability?.available ?? NaN);
  if (
    Number.isFinite(savedAvailable)
    && savedAvailable > 0
    && effectiveM365Status(request) === "waiting_for_license"
  ) {
    request.status = "ready_to_provision";
    request.pax8AlreadyIncreased = false;
    request.pax8SubscriptionId = "";
    request.pax8Quantity = "";
    request.automationRunLog = [];
    request.automationPreview = m365PreviewText({ licenseAvailability: request.licenseAvailability }, request);
    request.automationError = "";
  }
  if (effectiveM365Status(request) === "waiting_for_license") {
    request.status = "waiting_for_license";
  }
  if (request.status === "waiting_for_license") {
    const hasStaleFetchError = Array.isArray(request.automationRunLog)
      && request.automationRunLog.some(step => /failed to fetch/i.test(`${step?.label || ""} ${step?.detail || ""}`));
    const hasWaitingStep = Array.isArray(request.automationRunLog)
      && request.automationRunLog.some(step => step?.status === "waiting");
    if (!hasWaitingStep || hasStaleFetchError) {
      request.automationRunLog = m365WaitingSteps(request, {
        license: request.license,
        pax8Changed: false,
        pax8Quantity: request.pax8Quantity,
        lastCheckedAt: request.lastLicenseCheckAt,
        licenseAvailability: request.licenseAvailability
      });
    }
    request.automationPreview = "";
    request.automationError = "";
  }
  if (repaired) {
    request.updatedAt = today;
    saveState();
  }
  return request;
}

function ticketM365AutomationCard(ticket = {}) {
  const request = ensureM365RequestForTicket(ticket);
  if (!request) return "";
  normalizeM365AutomationState(request, ticket);
  if (request.clientId) requestPurchasedLicensesForClient(request.clientId);
  const displayStatus = effectiveM365Status(request);
  if (displayStatus === "waiting_for_license" && request.automationStarted === true) {
    scheduleM365AutomationRetry(request.id);
  }
  const displayName = request.displayName || `${request.firstName || ""} ${request.lastName || ""}`.trim() || "New user";
  const requesterEmail = request.sourceEmail || ticket.requesterEmail || request.requester || "";
  const isEditing = editingTicketM365RequestId === request.id;
  const runButton = displayStatus === "waiting_for_license"
    ? `<span class="button-link disabled">Auto-checking Microsoft 365</span>`
    : displayStatus === "running"
      ? `<span class="button-link disabled">Running...</span>`
      : displayStatus === "complete"
        ? `<span class="button-link disabled">Mailbox Created</span>`
      : `<a href="${ticketM365ActionHref("run", request.id)}" data-run-365-automation="${request.id}" class="button-link primary">Create 365 Mailbox</a>`;
  return `
    <article class="ticket-card ticket-m365-card">
      <div class="ticket-card-head">
        <h3>Microsoft 365 Automation</h3>
        <span class="badge ${displayStatus}">${requestStatusLabel(displayStatus)}</span>
      </div>
      ${isEditing ? ticketM365InlineEditorHtml(request, ticket) : `
        <div class="request-detail-grid ticket-request-detail-grid">
          <span><small>User</small>${escapeHtml(displayName)}</span>
          <span><small>New Mailbox</small>${escapeHtml(request.userPrincipalName || "")}</span>
          <span><small>Communication Email</small>${escapeHtml(request.setupEmail || request.sourceEmail || "")}</span>
          <span class="request-license-cell">${m365LicenseSelectHtml(request, ticket)}</span>
          <span><small>Requester</small>${escapeHtml(requesterEmail)}</span>
          <span><small>Client</small>${escapeHtml(clientName(request.clientId))}</span>
        </div>
      `}
      ${automationStepLogHtml(request.automationRunLog)}
      ${request.automationPreview ? `<div class="portal-reply">${lines(request.automationPreview)}</div>` : ""}
      ${request.automationError ? `<p class="sync-error">${escapeHtml(request.automationError)}</p>` : ""}
      <p id="m365-action-status" class="action-status" aria-live="polite"></p>
      ${isEditing ? "" : `
        <div class="row-actions">
          <a href="${ticketM365ActionHref("edit", request.id)}" data-edit-365-request="${request.id}" class="button-link">Edit Request</a>
          <a href="${ticketM365ActionHref("preview", request.id)}" data-preview-365-automation="${request.id}" class="button-link">Preview</a>
          ${runButton}
        </div>
      `}
    </article>
  `;
}

function bindTicketM365Controls(container) {
  const card = container.querySelector(".ticket-m365-card");
  if (!card) return;

  const bindPointerAndClick = (button, handler) => {
    const wrapped = event => {
      event.preventDefault();
      event.stopPropagation();
      handler();
    };
    button.addEventListener("pointerdown", wrapped);
    button.addEventListener("click", wrapped);
  };

  card.querySelectorAll("[data-edit-365-request]").forEach(button => {
    bindPointerAndClick(button, () => {
      const request = findM365Request(button.dataset.edit365Request);
      if (!request) {
        setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket yet.", true);
        return;
      }
      editingTicketM365RequestId = request.id;
      renderTicketDetail();
      setM365ActionStatus("Editing this Microsoft 365 request on the ticket.");
    });
  });

  card.querySelectorAll("[data-cancel-365-inline]").forEach(button => {
    bindPointerAndClick(button, () => {
      editingTicketM365RequestId = "";
      renderTicketDetail();
      setM365ActionStatus("Edit cancelled.");
    });
  });

  card.querySelectorAll("[data-save-365-inline]").forEach(button => {
    bindPointerAndClick(button, () => {
      saveTicketM365InlineRequest(button.dataset.save365Inline);
    });
  });

  card.querySelectorAll("[data-preview-365-automation]").forEach(button => {
    bindPointerAndClick(button, () => {
      setM365ActionStatus("Building setup email preview...");
      previewM365Automation(button.dataset.preview365Automation);
    });
  });

  card.querySelectorAll("[data-run-365-automation]").forEach(button => {
    bindPointerAndClick(button, () => {
      setM365ActionStatus("Starting Microsoft 365 mailbox automation...");
      runM365Automation(button.dataset.run365Automation);
    });
  });
}

function renderTicketDetail() {
  const container = document.getElementById("ticket-detail-content");
  if (!container) return;
  const ticket = state.tickets.find(item => item.id === selectedTicketId && item.ninjaTicketId);
  if (!ticket) {
    container.innerHTML = `
      <div class="ticket-detail-empty">
        <p class="subtle">Select a NinjaOne ticket from the queue.</p>
        <button data-back-to-tickets>Back to tickets</button>
      </div>
    `;
    return;
  }

  const recentTickets = recentTicketsFor(ticket);
  const responseMode = selectedTicketResponseMode === "private" ? "private" : "public";
  const activityEntries = ticketActivityEntries(ticket);
  container.innerHTML = `
    <div class="ticket-breadcrumb">Home › Ticketing › ${escapeHtml(ticketStatusLabel(ticket.status))} tickets › #${escapeHtml(ticket.ninjaTicketId)}</div>
    <div class="ticket-detail-head">
      <div>
        <h2><span class="ticket-icon">▭</span>${escapeHtml(ticket.title || "Support request")}</h2>
        <div class="ticket-detail-tabs">
          <button class="active" type="button">Overview</button>
          <button type="button">Related tickets</button>
        </div>
      </div>
      <div class="ticket-detail-actions">
        <button data-back-to-tickets>Back</button>
        <button data-update-ticket-modal="${ticket.id}">Update Details</button>
        <button data-ticket-waiting="${ticket.id}">Waiting</button>
        <button data-ticket-resolved="${ticket.id}" class="primary">Resolve</button>
      </div>
    </div>

    <div class="ticket-control-row">
      <label class="ticket-inline-field ticket-status-field">
        <span>Status</span>
        <select id="ticket-detail-status">${ticketStatusOptions(ticket.status || "new")}</select>
      </label>
      <label class="ticket-inline-field ticket-type-field">
        <span>Type</span>
        <select id="ticket-detail-type">${ticketTypeOptions(ticketTypeValue(ticket))}</select>
      </label>
      <label class="ticket-inline-field ticket-form-field">
        <span>Form</span>
        <select id="ticket-detail-form">${ticketFormOptions(ticketFormLabel(ticket))}</select>
      </label>
      <p class="ticket-created-line">${escapeHtml(ticketCreatedLine(ticket))}</p>
    </div>

    <div class="ticket-detail-layout">
      <aside class="ticket-side-stack">
        <article class="ticket-card">
          <div class="ticket-card-head">
            <h3>Requester</h3>
            <button data-update-ticket-modal="${ticket.id}" class="link-button">Update</button>
          </div>
          <div class="ticket-requester-lines">
            <p><span>⌘</span><strong>${escapeHtml(ticketClientName(ticket))}</strong></p>
            <p><span>⌖</span>${escapeHtml(ticket.location || "No location selected")}</p>
            <p><span>♙</span><strong>${escapeHtml(ticketRequesterName(ticket))}</strong></p>
            <p><span>▭</span>${escapeHtml(ticket.device || "No device selected")}</p>
          </div>
        </article>

        <article class="ticket-card">
          <h3>Details</h3>
          <div class="ticket-detail-fields">
            <label>Primary assignee</label>
            <select id="ticket-detail-assignee" class="readonly-select">${ninjaOneAssigneeOptions(ticketAssignedAppUserId(ticket))}</select>
            <label>Additional assignees</label>
            <div class="readonly-select disabled-field" title="Additional assignees need the NinjaOne technician list mapped next.">Manage in NinjaOne<span>⌄</span></div>
            <label>Priority</label>
            <select id="ticket-detail-priority" class="readonly-select">${ticketPriorityOptions(ticket.priority || "normal")}</select>
            <label>Severity</label>
            <select id="ticket-detail-severity" class="readonly-select">${ticketSeverityOptions(ticket.severity || "none")}</select>
            <label>Tags</label>
            <input id="ticket-detail-tags" class="readonly-select" value="${escapeHtml(listToCsv(ticket.tags || []))}" placeholder="tag1, tag2">
            <label>CC</label>
            <input id="ticket-detail-cc" class="readonly-select" value="${escapeHtml(listToCsv(ticket.ccEmails || []))}" placeholder="email@example.com, another@example.com">
            <label>Follow-up time</label>
            <input id="ticket-detail-followup" class="readonly-select" type="datetime-local" value="${escapeHtml(followupInputValue(ticket.followupTime))}">
          </div>
        </article>
      </aside>

      <main class="ticket-main-stack">
        ${ticketM365AutomationCard(ticket)}

        <article class="ticket-card ticket-response-card">
          <div class="ticket-detail-tabs inline-tabs">
            <button class="${responseMode === "public" ? "active" : ""}" data-ticket-response-mode="public" type="button">Public Response</button>
            <button class="${responseMode === "private" ? "active" : ""}" data-ticket-response-mode="private" type="button">Private Note</button>
          </div>
          <textarea id="ticket-response-text" placeholder="${responseMode === "private" ? "Add a private internal note..." : "Add a public response..."}"></textarea>
          <p id="ticket-action-status" class="action-status" aria-live="polite">${ticket.syncError ? escapeHtml(ticket.syncError) : ""}</p>
          <div class="ticket-response-tools">
            <button data-save-ticket-update="${ticket.id}" class="primary">Update Ticket</button>
          </div>
        </article>

        <article class="ticket-card ticket-activity-card">
          <div class="ticket-card-head">
            <h3>Ticket activity (${activityEntries.length})</h3>
            <div class="toolbar compact-toolbar">
              <button>Type <span class="badge">2</span>⌄</button>
              <button>Sort by: Newest ⌄</button>
            </div>
          </div>
          ${activityEntries.join("")}
        </article>
      </main>

      <aside class="ticket-right-stack">
        <article class="ticket-card recent-ticket-card">
          <h3>Recent tickets</h3>
          <label>Recent tickets for</label>
          <div class="readonly-select">${escapeHtml(ticketClientName(ticket))}<span>⌄</span></div>
          <div class="recent-ticket-list">
            ${recentTickets.map(item => `
              <button class="recent-ticket-item" data-view-ticket="${item.id}">
                <strong>#${escapeHtml(item.ninjaTicketId)} ${escapeHtml(item.title || "Support request")}</strong>
                <span>${escapeHtml(ticketStatusLabel(item.status))} · ${escapeHtml(formatDate(item.createdAt))}</span>
              </button>
            `).join("") || `<p class="empty-recent">No recent tickets</p>`}
          </div>
        </article>
      </aside>
    </div>
  `;
  bindTicketM365Controls(container);
}

function updateNavTicketCounts() {
  const tickets = (state.tickets || []).filter(ticket => ticket.ninjaTicketId);
  const activeTickets = tickets.filter(isActiveTicket);
  const nonDeletedTickets = tickets.filter(ticket => ticket.status !== "deleted");
  setText("nav-ticket-total", activeTickets.length || "");
  setText("nav-ticket-unassigned", activeTickets.filter(ticket => !ticket.assignedAppUserId).length);
  setText("nav-ticket-all", nonDeletedTickets.length);
  setText("nav-ticket-assigned", nonDeletedTickets.filter(isTicketAssignedToMe).length);
  setText("nav-ticket-open", activeTickets.length);
  setText("nav-ticket-deleted", tickets.filter(ticket => ticket.status === "deleted").length);
  setText("nav-ticket-pending", tickets.filter(ticket => ticket.source === "email" && ticket.status === "pending").length);

  const filter = document.getElementById("ticket-filter")?.value || "unassigned";
  document.querySelectorAll("[data-ticket-filter-set]").forEach(button => {
    button.classList.toggle("active", activeView === "tickets" && button.dataset.ticketFilterSet === filter);
  });
}

function updateNavBillingCounts() {
  const openInvoices = state.invoices.filter(invoiceNeedsAction).length;
  const draftQuotes = state.quotes.filter(quote => quote.status === "draft").length;
  setText("nav-billing-total", openInvoices || "");
  setText("nav-invoice-open", openInvoices);
  setText("nav-quote-draft", draftQuotes);
}

function portalStatusFromNinja(ticket = {}) {
  const text = `${ticket.statusName || ""} ${ticket.statusDisplayName || ""}`.toLowerCase();
  if (ticket.deleted || ticket.missing) return "deleted";
  if (/deleted|removed|trash/.test(text)) return "deleted";
  if (/resolved|closed|completed|complete/.test(text)) return "resolved";
  if (/waiting|pending|hold/.test(text)) return "waiting";
  if (/new|open/.test(text)) return "new";
  return "in_progress";
}

function portalPriorityFromNinja(priority = "") {
  const text = String(priority || "").toLowerCase();
  if (text === "high") return "high";
  if (text === "low" || text === "none") return "low";
  return "normal";
}

function dateFromNinjaEpoch(epochSeconds) {
  const seconds = Number(epochSeconds || 0);
  if (!seconds) return today;
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return today;
  return date.toISOString().slice(0, 10);
}

function ticketIdentityText(ticket = {}) {
  return [
    ticket.title,
    plainEmailText(ticket.description || ""),
    plainEmailText(ticket.internalNotes || ""),
    ticket.requesterEmail,
    ticket.requester
  ].filter(Boolean).join("\n").toLowerCase();
}

function scoreClientForTicket(client = {}, ticket = {}) {
  const text = ticketIdentityText(ticket);
  if (!text) return 0;
  let score = 0;
  clientEmailDomains(client).forEach(domain => {
    if (domain && text.includes(domain)) score += 10;
  });
  approvedRequesterEmails(client).forEach(email => {
    if (email && text.includes(email)) score += 12;
  });
  const nameWords = String(client.name || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2);
  nameWords.forEach(word => {
    if (text.includes(word)) score += 2;
  });
  return score;
}

function inferClientFromTicket(ticket = {}) {
  const ranked = (state.clients || [])
    .map(client => ({ client, score: scoreClientForTicket(client, ticket) }))
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score >= 8 ? ranked[0].client : null;
}

function approvedRequesterFromTicket(ticket = {}, client = null) {
  const text = ticketIdentityText(ticket);
  const clients = client ? [client] : (state.clients || []);
  for (const item of clients) {
    const match = approvedRequesterEmails(item).find(email => email && text.includes(email));
    if (match) return match;
  }
  return "";
}

function upsertNinjaOneTicket(ninjaTicket = {}) {
  const ninjaTicketId = String(ninjaTicket.id || "").trim();
  if (!ninjaTicketId) return false;
  const existing = (state.tickets || []).find(ticket => String(ticket.ninjaTicketId) === ninjaTicketId);
  const ninjaClient = clientByNinjaOneOrgId(ninjaTicket.clientId);
  const next = existing || {
    id: id("ticket"),
    source: String(ninjaTicket.source || "").toLowerCase() || "ninjaone",
    category: "General",
    description: "",
    internalNotes: "",
    requester: "NinjaOne requester",
    createdAt: dateFromNinjaEpoch(ninjaTicket.createTime)
  };
  const before = JSON.stringify(next);
  next.ninjaTicketId = ninjaTicketId;
  next.clientId = next.clientId || ninjaClient?.id || "";
  next.ninjaOneOrgId = Number(ninjaTicket.clientId || next.ninjaOneOrgId || ninjaClient?.ninjaOneOrgId || 0);
  next.ninjaOneOrgName = ninjaOneOrganizationName(next.ninjaOneOrgId) || ninjaClient?.name || next.ninjaOneOrgName || "";
  next.requesterUid = ninjaTicket.requesterUid || next.requesterUid || "";
  next.ninjaOneRequester = ninjaTicket.requesterName || next.ninjaOneRequester || "";
  next.ninjaOneRequesterEmail = ninjaTicket.requesterEmail || next.ninjaOneRequesterEmail || "";
  next.requester = ninjaTicket.requesterName || next.requester || "NinjaOne requester";
  next.requesterFirstName = ninjaTicket.requesterFirstName || next.requesterFirstName || "";
  next.requesterLastName = ninjaTicket.requesterLastName || next.requesterLastName || "";
  next.requesterEmail = ninjaTicket.requesterEmail || next.requesterEmail || "";
  next.requesterPhone = ninjaTicket.requesterPhone || next.requesterPhone || "";
  next.title = ninjaTicket.subject || next.title || "Support request";
  next.description = ninjaTicket.description || next.description || "";
  next.type = ninjaTicket.type ? ticketTypeLabel({ type: String(ninjaTicket.type).replaceAll("_", " ").toLowerCase() }) : next.type;
  next.source = String(ninjaTicket.source || next.source || "ninjaone").toLowerCase();
  const inferredClient = inferClientFromTicket(next);
  if (inferredClient?.id && inferredClient.id !== next.clientId) {
    next.clientId = inferredClient.id;
    next.ninjaOneOrgId = Number(inferredClient.ninjaOneOrgId || next.ninjaOneOrgId || 0);
    next.ninjaOneOrgName = inferredClient.name;
    next.clientMappingNote = `Portal mapped this ticket to ${inferredClient.name} from forwarded email content. NinjaOne organization was ${ninjaClient?.name || ninjaTicket.clientId || "unknown"}.`;
  }
  const mappedClient = inferredClient || clientById(next.clientId) || ninjaClient;
  const forwardedRequesterEmail =
    approvedRequesterFromTicket(next, mappedClient) ||
    extractForwardedRequesterEmail(ticketIdentityText(next), next.requesterEmail || "");
  if (forwardedRequesterEmail) {
    next.requesterEmail = forwardedRequesterEmail;
    next.requester = forwardedRequesterEmail;
    next.requesterFirstName = "";
    next.requesterLastName = "";
    next.requesterMappingNote = `Portal set requester from forwarded email content. NinjaOne requester was ${next.ninjaOneRequester || next.ninjaOneRequesterEmail || "unknown"}.`;
  }
  const ninjaStatus = portalStatusFromNinja(ninjaTicket);
  next.status = hasPortalResolutionOverride(next) ? "resolved" : ninjaStatus;
  next.priority = portalPriorityFromNinja(ninjaTicket.priority || next.priority);
  next.severity = String(ninjaTicket.severity || next.severity || "none").toLowerCase();
  next.tags = Array.isArray(ninjaTicket.tags) ? ninjaTicket.tags : next.tags || [];
  next.ccEmails = Array.isArray(ninjaTicket.ccEmails) ? ninjaTicket.ccEmails : next.ccEmails || [];
  next.followupTime = ninjaTicket.followupTime || next.followupTime || null;
  next.assignedAppUserId = ninjaTicket.assignedAppUserId || next.assignedAppUserId || defaultNinjaOneAssigneeId() || "";
  next.additionalAssignedTechnicianIds = Array.isArray(ninjaTicket.additionalAssignedTechnicianIds) ? ninjaTicket.additionalAssignedTechnicianIds : next.additionalAssignedTechnicianIds || [];
  next.ninjaVersion = ninjaTicket.version || next.ninjaVersion || "";
  next.ninjaTicketFormId = ninjaTicket.ticketFormId || next.ninjaTicketFormId || "";
  next.ninjaStatusId = ninjaTicket.statusId || next.ninjaStatusId || "";
  next.updatedAt = today;
  if (!existing) state.tickets.push(next);
  return before !== JSON.stringify(next);
}

function mergeNinjaOneTickets(ninjaTickets = []) {
  let changed = false;
  ninjaTickets.forEach(ticket => {
    if (upsertNinjaOneTicket(ticket)) changed = true;
  });
  return changed;
}

function updateTicketSyncStatus(status = "idle", message = "") {
  const el = document.getElementById("ticket-sync-status");
  if (!el) return;
  el.className = `sync-status ${status}`;
  const lastSynced = ticketLastSyncedAt
    ? `Last sync ${new Date(ticketLastSyncedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}`
    : "Live sync on";
  el.textContent = message || lastSynced;
}

async function syncNinjaOneTickets() {
  try {
    updateTicketSyncStatus("syncing", "Syncing NinjaOne...");
    const metadataResponse = await fetch("/api/ninjaone-tickets", { cache: "no-store" });
    const metadata = await metadataResponse.json().catch(() => ({}));
    if (metadataResponse.ok) {
      if (Array.isArray(metadata.assignees)) state.ninjaOneAssignees = metadata.assignees;
      if (metadata.defaultAssignedAppUserId) state.ninjaOneDefaultAssigneeId = String(metadata.defaultAssignedAppUserId);
    }
    const importResponse = await fetch("/api/ninjaone-tickets?import=1", { cache: "no-store" });
    const importData = await importResponse.json().catch(() => ({}));
    let importedChanged = false;
    if (importResponse.ok && Array.isArray(importData.tickets)) {
      importedChanged = mergeNinjaOneTickets(importData.tickets);
      if (reconcileM365RequestsFromTickets()) importedChanged = true;
    }
    if (importedChanged) {
      saveState();
    }
    const refreshedLinkedTickets = (state.tickets || []).filter(ticket => ticket.ninjaTicketId);
    if (!refreshedLinkedTickets.length) {
      renderTickets();
      renderDashboard();
      renderM365Requests();
      ticketLastSyncedAt = new Date().toISOString();
      updateTicketSyncStatus("ready");
      return;
    }
    const ids = refreshedLinkedTickets.map(ticket => ticket.ninjaTicketId).join(",");
    if (!ids) {
      ticketLastSyncedAt = new Date().toISOString();
      updateTicketSyncStatus("ready");
      return;
    }
    const response = await fetch(`/api/ninjaone-tickets?ids=${encodeURIComponent(ids)}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(data.tickets)) {
      updateTicketSyncStatus("error", data.error || "NinjaOne sync needs attention");
      return;
    }

    let changed = false;
    const byId = new Map(data.tickets.map(ticket => [String(ticket.id), ticket]));
    (state.tickets || []).forEach(ticket => {
      if (!ticket.ninjaTicketId) return true;
      const ninjaTicket = byId.get(String(ticket.ninjaTicketId));
      if (!ninjaTicket) return true;
      const nextStatus = portalStatusFromNinja(ninjaTicket);
      if (nextStatus && nextStatus !== ticket.status) {
        ticket.status = nextStatus;
        ticket.updatedAt = today;
        changed = true;
      }
      if (ninjaTicket.subject && ninjaTicket.subject !== ticket.title) {
        ticket.title = ninjaTicket.subject;
        changed = true;
      }
      if (ninjaTicket.version && ninjaTicket.version !== ticket.ninjaVersion) {
        ticket.ninjaVersion = ninjaTicket.version;
        changed = true;
      }
      if (ninjaTicket.ticketFormId && ninjaTicket.ticketFormId !== ticket.ninjaTicketFormId) {
        ticket.ninjaTicketFormId = ninjaTicket.ticketFormId;
        changed = true;
      }
      if (ninjaTicket.statusId && ninjaTicket.statusId !== ticket.ninjaStatusId) {
        ticket.ninjaStatusId = ninjaTicket.statusId;
        changed = true;
      }
      if (ninjaTicket.requesterUid && ninjaTicket.requesterUid !== ticket.requesterUid) {
        ticket.requesterUid = ninjaTicket.requesterUid;
        changed = true;
      }
      if (ninjaTicket.assignedAppUserId && String(ninjaTicket.assignedAppUserId) !== String(ticket.assignedAppUserId || "")) {
        ticket.assignedAppUserId = ninjaTicket.assignedAppUserId;
        changed = true;
      }
      if (Array.isArray(ninjaTicket.additionalAssignedTechnicianIds)) {
        ticket.additionalAssignedTechnicianIds = ninjaTicket.additionalAssignedTechnicianIds;
      }
      const ninjaPriority = String(ninjaTicket.priority || "").toLowerCase();
      const nextPriority = ninjaPriority === "high" ? "high" : ninjaPriority === "low" ? "low" : ninjaPriority === "none" ? "low" : "normal";
      if (ninjaTicket.priority && nextPriority !== ticket.priority) {
        ticket.priority = nextPriority;
        changed = true;
      }
      const ninjaSeverity = String(ninjaTicket.severity || "").toLowerCase();
      if (ninjaTicket.severity && ninjaSeverity !== String(ticket.severity || "none").toLowerCase()) {
        ticket.severity = ninjaSeverity;
        changed = true;
      }
      if (Array.isArray(ninjaTicket.tags) && JSON.stringify(ninjaTicket.tags) !== JSON.stringify(ticket.tags || [])) {
        ticket.tags = ninjaTicket.tags;
        changed = true;
      }
      if (Array.isArray(ninjaTicket.ccEmails) && JSON.stringify(ninjaTicket.ccEmails) !== JSON.stringify(ticket.ccEmails || [])) {
        ticket.ccEmails = ninjaTicket.ccEmails;
        changed = true;
      }
      if ((ninjaTicket.followupTime || null) !== (ticket.followupTime || null)) {
        ticket.followupTime = ninjaTicket.followupTime || null;
        changed = true;
      }
      return true;
    });

    if (reconcileM365RequestsFromTickets()) changed = true;
    if (changed) saveState();
    renderTickets();
    renderDashboard();
    renderM365Requests();
    ticketLastSyncedAt = new Date().toISOString();
    updateTicketSyncStatus("ready");
  } catch (error) {
    updateTicketSyncStatus(
      "error",
      error instanceof Error ? friendlyNinjaOneError(error.message) : "NinjaOne sync needs attention",
    );
    // Keep local intake usable if NinjaOne sync is temporarily unavailable.
  }
}

function requestNinjaOneTicketSync() {
  if (ticketSyncInFlight) return ticketSyncInFlight;
  ticketSyncInFlight = syncNinjaOneTickets().finally(() => {
    ticketSyncInFlight = null;
  });
  return ticketSyncInFlight;
}

function startNinjaOneLiveSync() {
  if (ticketSyncTimer) clearInterval(ticketSyncTimer);
  requestNinjaOneTicketSync();
  ticketSyncTimer = setInterval(() => {
    if (document.hidden) return;
    requestNinjaOneTicketSync();
  }, TICKET_SYNC_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestNinjaOneTicketSync();
  });
  window.addEventListener("focus", () => {
    requestNinjaOneTicketSync();
  });
  window.addEventListener("online", () => {
    requestNinjaOneTicketSync();
  });
}

function reconnectNinjaOne() {
  window.open("/api/ninjaone-oauth-login", "_blank", "noopener,noreferrer");
}

function friendlyNinjaOneError(message = "") {
  if (/not_authenticated|reconnect|oauth|token/i.test(message)) {
    return "NinjaOne needs attention. Open /api/ninjaone-oauth-login once, authorize GSV Portal, then come back and try again.";
  }
  return message || "NinjaOne request failed.";
}

function renderM365Requests() {
  const list = document.getElementById("requests365-list");
  if (!list) return;
  const requests = (state.m365Requests || []).slice().sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  setText("requests-requested", requests.filter(request => ["requested", "needs_review"].includes(request.status)).length);
  setText("requests-pax8", requests.filter(request => ["ready_to_run", "ready_to_provision"].includes(request.status)).length);
  setText("requests-provision", requests.filter(request => request.status === "pax8_needed").length);
  setText("requests-complete", requests.filter(request => request.status === "complete").length);

  list.innerHTML = requests.map(request => `
    <article class="item request-card">
      <div class="item-line">
        <strong>${escapeHtml(request.displayName || `${request.firstName || ""} ${request.lastName || ""}`.trim() || "New user")}</strong>
        <span class="badge ${request.status || "requested"}">${requestStatusLabel(request.status)}</span>
      </div>
      <div class="request-detail-grid">
        <span><small>Client</small>${escapeHtml(clientName(request.clientId))}</span>
        <span><small>Email</small>${escapeHtml(request.userPrincipalName || "")}</span>
        <span><small>Communication Email</small>${escapeHtml(request.setupEmail || request.sourceEmail || "")}</span>
        <span><small>License</small>${escapeHtml(request.license || "")}</span>
        <span><small>Requester</small>${escapeHtml(request.requester || "")}</span>
        <span><small>NinjaOne</small>${escapeHtml(request.ninjaTicketId ? `#${request.ninjaTicketId}` : "Not linked")}</span>
      </div>
      ${request.automationPreview ? `<div class="portal-reply">${lines(request.automationPreview)}</div>` : ""}
      ${request.automationError ? `<p class="sync-error">${escapeHtml(request.automationError)}</p>` : ""}
      ${request.notes ? `<p class="subtle">${lines(request.notes)}</p>` : ""}
      <div class="portal-reply">${lines(buildM365Reply(request))}</div>
      <div class="row-actions">
        <button data-edit-365-request="${request.id}">Edit</button>
        <button data-preview-365-automation="${request.id}">Preview Automation</button>
        <button data-run-365-automation="${request.id}" class="primary">Run Automation</button>
        <button data-complete-365-request="${request.id}" class="primary">Complete</button>
      </div>
    </article>
  `).join("") || `<p class="subtle">No Microsoft 365 requests yet.</p>`;
}

function setText(idValue, value) {
  const node = document.getElementById(idValue);
  if (node) node.textContent = value;
}

async function loadNinjaOneOrganizations() {
  try {
    const response = await fetch("/api/ninjaone-organizations", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(data.organizations)) return;
    state.ninjaOneOrganizations = data.organizations;
    saveState();
    renderTickets();
  } catch {
    // Keep the portal usable offline; client-level org IDs still work.
  }
}

async function loadNinjaOneContacts(organizationId = "") {
  try {
    const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
    const response = await fetch(`/api/ninjaone-contacts${query}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(data.contacts)) return;
    const incoming = data.contacts;
    const otherContacts = (state.ninjaOneContacts || []).filter(contact =>
      organizationId && String(contact.organizationId) !== String(organizationId)
    );
    state.ninjaOneContacts = organizationId ? [...otherContacts, ...incoming] : incoming;
    saveState();
    const requesterSelect = document.getElementById("requesterUid");
    const ninjaOrgSelect = document.getElementById("ninjaOneOrgId");
    if (requesterSelect) {
      requesterSelect.innerHTML = ninjaOneContactOptions(
        requesterSelect.value,
        ninjaOrgSelect?.value || organizationId
      );
    }
  } catch {
    // Keep manual requester entry available if NinjaOne contact sync is unavailable.
  }
}

function ticketStatusLabel(status = "new") {
  return {
    new: "New",
    in_progress: "In Progress",
    waiting: "Waiting",
    resolved: "Resolved"
  }[status] || status;
}

function ticketPriorityLabel(priority = "normal") {
  return {
    urgent: "Urgent",
    high: "High",
    normal: "Normal",
    low: "Low"
  }[priority] || priority;
}

function requestStatusLabel(status = "requested") {
  return {
    requested: "Requested",
    needs_review: "Needs Review",
    ready_to_run: "Ready to Run",
    pax8_needed: "License Needed",
    ready_to_provision: "Ready to Provision",
    running: "Running",
    waiting_for_license: "Waiting on Microsoft 365",
    provisioned: "Provisioned",
    complete: "Complete"
  }[status] || status;
}

function normalizedEmail(value = "") {
  return String(value || "").trim().toLowerCase();
}

function splitConfiguredList(value = "") {
  return String(value || "")
    .split(/[,\n;]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function approvedRequesterEmails(client = {}) {
  return splitConfiguredList(client.approvedRequesterEmails).map(normalizedEmail);
}

function isApprovedRequester(client = {}, email = "") {
  const approved = approvedRequesterEmails(client);
  return approved.length > 0 && approved.includes(normalizedEmail(email));
}

function isNewUserTicket(ticket = {}) {
  const text = `${ticket.title || ""}\n${plainEmailText(ticket.description || "")}\n${plainEmailText(ticket.internalNotes || "")}`.toLowerCase();
  if (!text.trim()) return false;
  return [
    /new\s+(user|employee|email|mailbox|account)/,
    /create\s+(a\s+)?(user|email|mailbox|account)/,
    /add\s+(a\s+)?(user|employee|email|mailbox|account)/,
    /onboard(ing)?\s+(user|employee)?/,
    /set\s+.+?\s+up\s+with\s+(his|her|their|a|an)?.*?(email|mailbox|account)/,
    /setup\s+(a\s+)?(user|email|mailbox|account)/
  ].some(pattern => pattern.test(text));
}

function extractNamedValue(text = "", labels = []) {
  for (const label of labels) {
    const pattern = new RegExp(`(?:^|\\n)\\s*${label}\\s*[:\\-]\\s*([^\\n]+)`, "i");
    const match = String(text || "").match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function extractEmail(value = "") {
  return String(value || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function extractEmails(value = "") {
  const matches = String(value || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return [...new Set(matches.map(email => email.toLowerCase()))];
}

function emailDomain(email = "") {
  return String(email || "").toLowerCase().split("@")[1] || "";
}

function clientEmailDomains(client = {}) {
  return extractEmails([
    client.email,
    client.billTo,
    client.approvedRequesterEmails,
    client.notes
  ].filter(Boolean).join("\n")).map(emailDomain).filter(Boolean);
}

function nameMatchesEmail(name = {}, email = "") {
  const local = String(email || "").split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
  const first = String(name.firstName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const last = String(name.lastName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!first || !last || !local) return false;
  return [
    `${first}${last}`,
    `${first[0]}${last}`,
    `${first}.${last}`.replace(/[^a-z0-9]/g, ""),
    `${first}_${last}`.replace(/[^a-z0-9]/g, ""),
    `${first}-${last}`.replace(/[^a-z0-9]/g, "")
  ].includes(local) || local.includes(last);
}

function knownM365Licenses() {
  const configured = state.clients.flatMap(client => splitConfiguredList(client.defaultM365License || ""));
  return [
    ...configured,
    "Microsoft 365 Business Basic",
    "Microsoft 365 Business Standard",
    "Microsoft 365 Business Premium",
    "Microsoft 365 E3",
    "Microsoft 365 E5",
    "Exchange Online Plan 1",
    "Exchange Online Plan 2"
  ].filter(Boolean);
}

function normalizedLicensePhrase(value = "") {
  return normalizedProductName(value).replace(/\s+/g, " ").trim();
}

function licenseTextHasCodeWord(text = "", codeWord = "") {
  const normalizedText = ` ${normalizedLicensePhrase(text)} `;
  const normalizedCode = normalizedLicensePhrase(codeWord);
  return Boolean(normalizedCode && normalizedText.includes(` ${normalizedCode} `));
}

function licenseAliases(client = {}) {
  return Array.isArray(client.licenseRequestAliases) ? client.licenseRequestAliases : [];
}

function licenseRequestAliasesToText(rows = []) {
  return rows.map(row => `${row.phrase || ""} | ${row.license || ""}`).join("\n");
}

function textToLicenseRequestAliases(text = "") {
  return String(text || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [phrase, license] = line.split("|").map(part => part.trim());
      return { phrase, license };
    })
    .filter(row => row.phrase && row.license);
}

function ticketMentionsLicense(text = "") {
  return /\b(license|licence|basic|standard|premium|e3|e5|exchange|email only|mailbox|apps?|office|microsoft 365|m365)\b/i.test(String(text || ""));
}

function licenseFromTicket(text = "", client = {}) {
  const explicit = extractNamedValue(text, ["license", "licence", "m365 license", "microsoft 365 license"]);
  if (explicit) return { license: explicit, source: "explicit" };
  const normalizedText = normalizedLicensePhrase(text);
  const alias = licenseAliases(client).find(row => {
    return licenseTextHasCodeWord(normalizedText, row.phrase);
  });
  if (alias?.license) return { license: alias.license, source: "alias" };
  const known = knownM365Licenses();
  const matched = known.find(license => {
    const phrase = normalizedLicensePhrase(license);
    return phrase && normalizedText.includes(phrase);
  });
  if (matched) return { license: matched, source: "exact" };
  if (ticketMentionsLicense(text)) return { license: "", source: "unclear" };
  return { license: client.defaultM365License || "", source: "default" };
}

function parseNameParts(value = "") {
  const clean = String(value || "").replace(/[<({\[].*$/, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "", displayName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "", displayName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
    displayName: parts.join(" ")
  };
}

function extractNaturalNewUserName(text = "") {
  const patterns = [
    /\bset\s+([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){1,3})\s+up\s+with\b/,
    /\bcreate\s+(?:a\s+)?(?:new\s+)?(?:email|mailbox|account|user)\s+(?:for\s+)?([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){1,3})\b/,
    /\b(?:email|mailbox|account)\s+for\s+([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){1,3})\b/
  ];
  for (const pattern of patterns) {
    const match = String(text || "").match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function extractForwardedRequesterEmail(text = "", fallback = "") {
  const fromMatch = String(text || "").match(/(?:^|\n)\s*From:\s*.*?<([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})>/i);
  if (fromMatch?.[1]) return fromMatch[1].toLowerCase();
  const senderMatch = String(text || "").match(/(?:^|\n)\s*(?:e|email):\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
  if (senderMatch?.[1]) return senderMatch[1].toLowerCase();
  return String(fallback || "").toLowerCase();
}

function extractHeaderEmails(text = "", headerName = "") {
  if (!headerName) return [];
  const pattern = new RegExp(`(?:^|\\n)\\s*${headerName}:\\s*([^\\n]+)`, "i");
  const match = String(text || "").match(pattern);
  return match?.[1] ? extractEmails(match[1]) : [];
}

function selectM365UserEmail(text = "", client = {}, name = {}) {
  const explicit = extractNamedValue(text, ["email", "email address", "username", "user principal name", "upn"]);
  if (explicit) return extractEmail(explicit) || explicit.trim();
  const emails = extractEmails(text);
  if (!emails.length) return "";
  const byName = emails.find(email => nameMatchesEmail(name, email));
  if (byName) return byName;
  const domains = clientEmailDomains(client);
  const clientDomainEmail = emails.find(email => domains.includes(emailDomain(email)));
  return clientDomainEmail || emails[0];
}

function selectSetupEmail(text = "", ticket = {}, userEmail = "", requesterEmail = "", client = {}) {
  const explicit =
    extractNamedValue(text, ["contact email", "personal email", "alternate email", "setup email", "send directions to", "send instructions to"]) ||
    "";
  if (explicit) return extractEmail(explicit) || explicit.trim();
  const emails = extractEmails(text);
  const domains = clientEmailDomains(client);
  const ignoredDomains = new Set([...domains, "gsvisions.com", "gsv.rmmservices.net", "rmmservices.net"]);
  const ignoredEmails = new Set([
    String(userEmail || "").toLowerCase(),
    String(requesterEmail || "").toLowerCase(),
    String(ticket.requesterEmail || "").toLowerCase()
  ].filter(Boolean));
  const usableCommunicationEmail = email =>
    email &&
    !ignoredEmails.has(String(email || "").toLowerCase()) &&
    !ignoredDomains.has(emailDomain(email));
  const forwardedToEmail = extractHeaderEmails(text, "To").find(usableCommunicationEmail);
  if (forwardedToEmail) return forwardedToEmail;
  const userIndex = userEmail ? String(text || "").toLowerCase().indexOf(String(userEmail).toLowerCase()) : -1;
  const afterUserText = userIndex >= 0 ? String(text || "").slice(userIndex + String(userEmail).length) : "";
  const afterUserEmail = extractEmails(afterUserText).find(usableCommunicationEmail);
  if (afterUserEmail) return afterUserEmail;
  const outsideEmail = emails.find(usableCommunicationEmail);
  return outsideEmail || requesterEmail || ticket.requesterEmail || "";
}

function parseM365RequestFromTicket(ticket = {}) {
  const client = inferClientFromTicket(ticket) || clientById(ticket.clientId) || clientByNinjaOneOrgId(ticket.ninjaOneOrgId) || {};
  const body = `${ticket.title || ""}\n${plainEmailText(ticket.description || "")}\n${plainEmailText(ticket.internalNotes || "")}`;
  const requesterEmail =
    approvedRequesterFromTicket(ticket, client) ||
    extractForwardedRequesterEmail(body, ticket.requesterEmail || "");
  const namedUser =
    extractNamedValue(body, ["new user", "user", "employee", "name", "display name", "full name"]) ||
    extractNaturalNewUserName(body) ||
    "";
  const name = parseNameParts(namedUser);
  const email = selectM365UserEmail(body, client, name);
  const setupEmail = selectSetupEmail(body, ticket, email, requesterEmail, client);
  const nameFromEmail = email ? email.split("@")[0].replace(/[._-]+/g, " ") : "";
  const finalName = name.displayName ? name : parseNameParts(nameFromEmail);
  const licenseDecision = licenseFromTicket(body, client);
  const license = licenseDecision.license;
  const approved = isApprovedRequester(client, requesterEmail);
  const missing = [];
  if (!client.id) missing.push("client mapping");
  if (!requesterEmail) missing.push("requester email");
  if (client.id && !approved) missing.push("approved requester");
  if (!finalName.firstName || !finalName.lastName) missing.push("first and last name");
  if (!email) missing.push("Microsoft 365 username/email");
  if (!license) missing.push(licenseDecision.source === "unclear" ? "license clarification" : "license");
  return {
    client,
    approved,
    missing,
    request: {
      id: id("m365"),
      clientId: client.id || ticket.clientId || "",
      requester: requesterEmail || ticket.requester || ticket.requesterEmail || "",
      sourceEmail: requesterEmail || "",
      setupEmail,
      ninjaTicketId: ticket.ninjaTicketId || "",
      status: missing.length ? "needs_review" : "ready_to_run",
      firstName: finalName.firstName,
      lastName: finalName.lastName,
      displayName: finalName.displayName,
      userPrincipalName: email,
      license,
      licenseSource: licenseDecision.source,
      pax8Action: "Use available license, otherwise increase Pax8 quantity",
      temporaryPassword: "",
      automationPreview: "",
      automationError: missing.length ? `Needs review: missing ${missing.join(", ")}.` : "",
      notes: [
        `Created from NinjaOne ticket #${ticket.ninjaTicketId}.`,
        approved ? "Requester is approved for this client." : "Requester is not approved yet.",
        licenseDecision.source === "alias" ? `License matched from client alias: ${license}.` : "",
        licenseDecision.source === "default" ? `License defaulted from client policy: ${license}.` : "",
        licenseDecision.source === "unclear" ? "Ticket mentions licensing, but does not match a configured alias or exact license. Edit this request and choose the exact license before running automation." : "",
        ticket.description ? `Ticket body:\n${ticket.description}` : ""
      ].filter(Boolean).join("\n\n"),
      createdAt: today,
      updatedAt: today
    }
  };
}

function reconcileM365RequestsFromTickets() {
  let changed = false;
  for (const ticket of state.tickets || []) {
    if (!ticket.ninjaTicketId || ticket.status === "deleted" || !isNewUserTicket(ticket)) continue;
    const existing = (state.m365Requests || []).find(request => String(request.ninjaTicketId || "") === String(ticket.ninjaTicketId));
    const parsed = parseM365RequestFromTicket(ticket);
    if (existing) {
      const parsedRequest = parsed.request || {};
      const nextLicense = String(parsedRequest.license || "").trim();
      const currentLicense = String(existing.license || "").trim();
      const staleMoxieSeedLicense =
        existing.clientId === "client_moxie" &&
        parsedRequest.licenseSource === "default" &&
        normalizedLicensePhrase(currentLicense) === normalizedLicensePhrase("Microsoft 365 Business Standard") &&
        normalizedLicensePhrase(nextLicense) === normalizedLicensePhrase("Exchange Online Plan 1");
      const manualLicense = existing.licenseSource === "manual" && !staleMoxieSeedLicense;
      const defaultOrParsedLicenseChanged = nextLicense && !manualLicense && nextLicense !== currentLicense;
      const sourceEmailChanged = parsedRequest.sourceEmail && parsedRequest.sourceEmail !== existing.sourceEmail;
      const setupEmailChanged =
        parsedRequest.setupEmail &&
        parsedRequest.setupEmail !== existing.setupEmail &&
        (/gsvisions\.com$/i.test(String(existing.setupEmail || "")) || !existing.setupEmail);
      const requesterChanged = parsedRequest.requester && parsedRequest.requester !== existing.requester;
      const clientChanged = parsedRequest.clientId && parsedRequest.clientId !== existing.clientId;
      if (defaultOrParsedLicenseChanged || sourceEmailChanged || setupEmailChanged || requesterChanged || clientChanged) {
        if (defaultOrParsedLicenseChanged) {
          existing.license = nextLicense;
          existing.licenseSource = parsedRequest.licenseSource || "parsed";
          existing.automationPreview = "";
          existing.automationError = "";
        }
        if (sourceEmailChanged) existing.sourceEmail = parsedRequest.sourceEmail;
        if (setupEmailChanged) existing.setupEmail = parsedRequest.setupEmail;
        if (requesterChanged) existing.requester = parsedRequest.requester;
        if (clientChanged) existing.clientId = parsedRequest.clientId;
        existing.updatedAt = today;
        changed = true;
      }
      continue;
    }
    if (!parsed.client?.userAutomationEnabled && !parsed.missing.includes("client mapping")) {
      parsed.request.status = "needs_review";
      parsed.request.automationError = "Needs review: new-user automation is not enabled for this client.";
    }
    state.m365Requests.push(parsed.request);
    changed = true;
  }
  return changed;
}

function buildM365Reply(request = {}) {
  if (request.status !== "complete") return "Reply draft appears here when the request is complete.";
  const passwordLine = request.temporaryPassword ? `Temporary password: ${request.temporaryPassword}` : "Temporary password: send through the approved secure channel.";
  return [
    `The Microsoft 365 user for ${request.displayName || `${request.firstName || ""} ${request.lastName || ""}`.trim()} has been created.`,
    `Username: ${request.userPrincipalName || ""}`,
    `License: ${request.license || ""}`,
    passwordLine
  ].filter(Boolean).join("\n");
}

function m365AutomationPayload(request) {
  const client = clientById(request.clientId) || {};
  const selectedTicket = (state.tickets || []).find(ticket => ticket.id === selectedTicketId);
  const ninjaTicketId = request.ninjaTicketId || selectedTicket?.ninjaTicketId || "";
  if (!request.ninjaTicketId && ninjaTicketId) {
    request.ninjaTicketId = ninjaTicketId;
    request.updatedAt = today;
    saveState();
  }
  return {
    request: {
      id: request.id,
      clientId: request.clientId,
      firstName: request.firstName,
      lastName: request.lastName,
      displayName: request.displayName || `${request.firstName || ""} ${request.lastName || ""}`.trim(),
      userPrincipalName: request.userPrincipalName,
      license: request.license,
      requester: request.requester,
      sourceEmail: request.sourceEmail,
      setupEmail: request.setupEmail,
      ninjaTicketId,
      temporaryPassword: request.temporaryPassword,
      notes: request.notes,
      pax8AlreadyIncreased: request.pax8AlreadyIncreased === true,
      pax8SubscriptionId: request.pax8SubscriptionId || ""
    },
    client: {
      name: client.name,
      m365TenantKey: client.m365TenantKey,
      pax8CompanyId: client.pax8CompanyId
    }
  };
}

function m365PreviewText(preview = {}, request = {}) {
  const sku = preview.licenseAvailability || preview.sku || request.licenseAvailability || {};
  const pax8 = preview.pax8 || {};
  const available = Number(sku.available ?? 0);
  const licenseName = sku.name || sku.skuPartNumber || "the selected license";
  const pax8AlreadyHandled = preview.pax8AlreadyHandled || preview.waitingForPreviousPax8 || request.pax8AlreadyIncreased;
  const pax8Current = Number(pax8.currentQuantity ?? request.pax8Quantity ?? 0);
  const pax8Next = Number(pax8.nextQuantity ?? pax8Current);
  const pax8Available = Number(pax8.availableQuantity ?? sku.pax8Available ?? Math.max(0, pax8Current - Number(sku.consumed ?? 0)));
  const pax8BackedLicense = preview.pax8BackedLicense || Boolean(pax8?.subscriptionId);
  const effectiveAvailable = Number(sku.effectiveAvailable ?? (pax8BackedLicense ? pax8Available : available));
  const lines = [
    `License: ${licenseName}`,
    pax8BackedLicense
      ? `Pax8 shows ${pax8Current} purchased seat${pax8Current === 1 ? "" : "s"} and ${pax8Available} Pax8-backed available seat${pax8Available === 1 ? "" : "s"}. Microsoft Graph's tenant-wide available count is ${available}, but expired/non-Pax8 licenses are ignored.`
      : available > 0
        ? `Microsoft 365 currently shows ${available} unused license${available === 1 ? "" : "s"} available.`
        : "Microsoft 365 currently does not show an unused license available.",
    preview.userExists
      ? `A user already exists for ${preview.userPrincipalName || "this mailbox"}.`
      : effectiveAvailable > 0
        ? "The mailbox is available and can be created."
        : "The mailbox address is available, but licensing must be handled before it is created."
  ];

  if (effectiveAvailable < 1) {
    if (pax8AlreadyHandled) {
      lines.push("Pax8 was already increased for this request. The portal will wait for the Pax8-backed seat to become available before assigning the license.");
    } else if (pax8?.subscriptionId && pax8Next > pax8Current) {
      lines.push(`Pax8 has the matching subscription. The portal will increase it from ${pax8Current} to ${pax8Next}.`);
    } else {
      lines.push("Pax8 needs attention because the portal could not find a matching subscription to update.");
    }
  } else {
    lines.push(pax8BackedLicense ? "Pax8 has available capacity, so the portal will not change Pax8." : "Pax8 does not need to be changed.");
  }

  const setupTarget = preview.setupEmail || preview.sourceEmail;
  const followupSteps = [
    setupTarget
      ? `Prepare the setup email for ${setupTarget}.`
      : "Skip the setup email because no contact email was found.",
    preview.ninjaTicketId ? "Add a completion note to the NinjaOne ticket." : "Skip the NinjaOne ticket note."
  ];

  if (preview.userExists) {
    lines.push("Then the portal will:", "Stop before creating a duplicate user.", ...followupSteps);
  } else if (effectiveAvailable > 0) {
    lines.push(
      "Then the portal will:",
      "Create the Microsoft 365 user.",
      "Assign the license.",
      ...followupSteps
    );
  } else if (pax8?.subscriptionId && pax8Next > pax8Current && !pax8AlreadyHandled) {
    lines.push(
      "Then the portal will:",
      `Increase Pax8 from ${pax8Current} to ${pax8Next}.`,
      "Wait for Microsoft 365 to show the Pax8-backed seat.",
      "Create the Microsoft 365 user.",
      "Assign the license.",
      ...followupSteps
    );
  } else {
    lines.push(
      "Then the portal will:",
      "Wait for the Pax8-backed seat before creating the Microsoft 365 user.",
      "Assign the license after the seat is available.",
      ...followupSteps
    );
  }

  return lines.join("\n");
}

async function previewM365Automation(requestId) {
  const request = findM365Request(requestId);
  if (!request) return;
  request.automationError = "";
  request.automationPreview = "Checking Microsoft 365 and Pax8...";
  saveState();
  renderM365Requests();
  renderTicketDetail();

  try {
    const response = await fetch("/api/m365-user-automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...m365AutomationPayload(request), mode: "preview" })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Automation preview failed.");
    const preview = data.preview || {};
    const availability = preview.licenseAvailability || preview.sku || {};
    const available = Number(availability.available ?? 0);
    const effectiveAvailable = Number(availability.effectiveAvailable ?? available);
    request.licenseAvailability = availability;
    request.pax8PreviewSubscriptionId = preview.pax8?.subscriptionId || "";
    request.pax8Quantity = preview.pax8?.currentQuantity ?? request.pax8Quantity ?? "";
    request.lastLicenseCheckAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    request.automationStarted = false;
    if (effectiveAvailable > 0) {
      request.status = "ready_to_provision";
      request.pax8AlreadyIncreased = false;
      request.automationRunLog = [];
      request.automationPreview = m365PreviewText(preview, request);
    } else {
      request.status = preview.needsPax8Increase || preview.pax8?.subscriptionId ? "pax8_needed" : "needs_review";
      request.pax8AlreadyIncreased = false;
      request.automationRunLog = [];
      request.automationPreview = m365PreviewText(preview, request);
      request.automationError = "";
    }
  } catch (error) {
    request.automationError = error instanceof Error ? error.message : "Automation preview failed.";
  }
  request.updatedAt = today;
  saveState();
  renderM365Requests();
  renderTicketDetail();
}

function m365StartingSteps(request = {}, autoResume = false) {
  if (autoResume || request.pax8AlreadyIncreased) {
    return [
      { status: "done", label: "Pax8 is already handled for this request.", detail: "The portal will not change Pax8 again." },
      { status: "running", label: "Checking Microsoft 365 for the license.", detail: "Waiting for Microsoft to report the license as available." },
      { status: "pending", label: "Create the new Microsoft 365 mailbox." },
      { status: "pending", label: "Assign the license." },
      { status: "pending", label: "Prepare the setup email and update the ticket." }
    ];
  }
  return [
    { status: "running", label: "Checking Microsoft 365 and Pax8." },
    { status: "pending", label: "Update Pax8 if this client needs another license." },
    { status: "pending", label: "Wait for Microsoft 365 to show the license." },
    { status: "pending", label: "Create the new Microsoft 365 mailbox." },
    { status: "pending", label: "Assign the license." },
    { status: "pending", label: "Prepare the setup email and update the ticket." }
  ];
}

function m365WaitingSteps(request = {}, result = {}) {
  const licenseName = result.license || request.license || "the selected license";
  const checkedAt = result.lastCheckedAt || request.lastLicenseCheckAt || "";
  const availability = result.licenseAvailability || result.sku || request.licenseAvailability || {};
  const hasAvailability =
    availability
    && (
      availability.available !== undefined
      || availability.enabled !== undefined
      || availability.consumed !== undefined
    );
  const available = Number(availability.available ?? 0);
  const effectiveAvailable = Number(availability.effectiveAvailable ?? available);
  const pax8Available = availability.pax8Available;
  const enabled = Number(availability.enabled ?? 0);
  const consumed = Number(availability.consumed ?? 0);
  const countDetail = hasAvailability
    ? pax8Available !== null && pax8Available !== undefined
      ? `Microsoft currently shows ${enabled} total, ${consumed} assigned, and ${available} tenant-wide available. Pax8-backed available: ${effectiveAvailable}.${checkedAt ? ` Last checked: ${checkedAt}.` : ""}`
      : `Microsoft currently shows ${enabled} total, ${consumed} assigned, and ${available} available.${checkedAt ? ` Last checked: ${checkedAt}.` : ""}`
    : `${checkedAt ? `Last checked: ${checkedAt}. ` : ""}Waiting for Microsoft 365 to report the license as available.`;
  return [
    {
      status: "done",
      label: result.pax8Changed
        ? "Pax8 license count was increased."
        : "Pax8 is already handled for this request.",
      detail: result.pax8Quantity
        ? `Current Pax8 quantity: ${result.pax8Quantity}. The portal will not change Pax8 again.`
        : "The portal will not change Pax8 again."
    },
    {
      status: "waiting",
      label: `Checking Microsoft 365 for ${licenseName}.`,
      detail: `${countDetail} The portal will keep checking automatically.`
    },
    { status: "pending", label: "Create the new Microsoft 365 mailbox." },
    { status: "pending", label: "Assign the license." },
    { status: "pending", label: "Prepare the setup email and update the ticket." }
  ];
}

function friendlyM365AutomationError(error) {
  const raw = error instanceof Error ? error.message : String(error || "");
  const message = raw.trim() || "Automation run failed.";
  if (/invalid[_\s-]?token/i.test(message)) {
    return "Microsoft 365 authentication returned invalid_token while checking for the new Pax8-backed license. Pax8 may already be updated; refresh/re-authenticate the portal if needed, then retry the mailbox automation.";
  }
  if (/Subscription being modified has executing provisioning actions|allow a few minutes for status sync|provisioning actions/i.test(message)) {
    return "Pax8 is still processing the subscription change. The portal will wait a few minutes, then check Microsoft 365 again.";
  }
  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return "The portal could not reach the automation service. Refresh the page and try again. Pax8 was not changed by this failed check.";
  }
  return message;
}

function shouldRetryM365AutomationError(errorMessage) {
  const message = String(errorMessage || "");
  return /invalid[_\s-]?token|Microsoft 365 authentication returned invalid_token|Pax8 is still processing|Subscription being modified has executing provisioning actions|allow a few minutes for status sync|provisioning actions|could not reach the automation service|failed to fetch|networkerror|load failed/i.test(message);
}

function friendlyNinjaOneTicketError(errorMessage) {
  const message = String(errorMessage || "").trim();
  if (/invalid[_\s-]?token|not_authenticated/i.test(message)) {
    return "NinjaOne authentication expired. Reconnect NinjaOne OAuth, then retry the ticket note.";
  }
  return message || "NinjaOne ticket note failed.";
}

function m365CompleteSteps(request = {}, result = {}) {
  return [
    {
      status: "done",
      label: result.pax8Changed
        ? "Pax8 license count was increased."
        : request.pax8AlreadyIncreased
          ? "Pax8 license count was already updated."
          : "Pax8 did not need to change."
    },
    {
      status: "done",
      label: "Microsoft 365 license is available.",
      detail: result.licenseWait
        ? `Microsoft showed the license after ${Math.round((result.licenseWait.waitedMs || 0) / 1000)} seconds.`
        : ""
    },
    {
      status: "done",
      label: result.userAlreadyExisted
        ? `${result.userPrincipalName || request.userPrincipalName || "The mailbox"} already exists.`
        : `Created ${result.userPrincipalName || request.userPrincipalName || "the mailbox"}.`
    },
    { status: "done", label: "Assigned the license." },
    {
      status: result.setupEmailError ? "warning" : "done",
      label: result.setupEmailDraft?.to
        ? `Prepared the setup email for ${result.setupEmailDraft.to}.`
        : result.setupEmailError
          ? `Setup email needs attention: ${result.setupEmailError}`
          : result.userAlreadyExisted
            ? "Setup email draft was already handled before this recovery check."
          : "No setup email contact was provided."
    },
    {
      status: result.ninjaTicketUpdated ? "done" : result.ninjaTicketError ? "warning" : request.ninjaTicketId ? "warning" : "warning",
      label: result.ninjaTicketUpdated
        ? "Updated the NinjaOne ticket."
        : result.ninjaTicketError
          ? `NinjaOne ticket note needs attention: ${friendlyNinjaOneTicketError(result.ninjaTicketError)}`
        : request.ninjaTicketId
          ? `Linked to NinjaOne ticket #${request.ninjaTicketId}, but no ticket note was posted.`
          : "No NinjaOne ticket was linked."
    }
  ];
}

async function runM365Automation(requestId, options = {}) {
  const request = findM365Request(requestId);
  if (!request) return;
  normalizeM365AutomationState(request);
  const autoResume = options.autoResume === true;
  const currentStatus = effectiveM365Status(request);
  if (m365AutomationActiveRuns.has(request.id)) {
    request.automationRunLog = Array.isArray(request.automationRunLog) && request.automationRunLog.length
      ? request.automationRunLog
      : m365StartingSteps(request, autoResume);
    request.automationError = "";
    saveState();
    render();
    return;
  }
  const isWaitingCheck = currentStatus === "waiting_for_license";
  if (!autoResume && !isWaitingCheck) {
    const ok = window.confirm(`Create ${request.userPrincipalName || "this Microsoft 365 user"} and adjust Pax8 if needed?`);
    if (!ok) return;
    await markM365TicketInProgress(request);
  }
  m365AutomationActiveRuns.add(request.id);
  request.automationError = "";
  request.automationPreview = "";
  request.automationRunLog = m365StartingSteps(request, autoResume);
  request.automationStarted = true;
  request.status = autoResume || isWaitingCheck ? "waiting_for_license" : "running";
  request.lastLicenseCheckAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  saveState();
  renderM365Requests();
  renderTicketDetail();

  try {
    const response = await fetch("/api/m365-user-automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...m365AutomationPayload(request), mode: "run" })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Automation run failed.");
    if (data.result?.status === "waiting_for_microsoft_license") {
      const availableNow = Number(data.result?.licenseAvailability?.effectiveAvailable ?? data.result?.licenseAvailability?.available ?? 0);
      if (availableNow > 0) {
        request.licenseAvailability = data.result.licenseAvailability || request.licenseAvailability || {};
        request.lastLicenseCheckAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        request.automationRunLog = [
          {
            status: "done",
            label: `${request.license || "The selected license"} is available now.`,
            detail: `The portal sees ${availableNow} usable Pax8-backed license${availableNow === 1 ? "" : "s"}. It is continuing automatically.`
          },
          ...m365StartingSteps(request, true).slice(2)
        ];
        request.automationPreview = "";
        request.automationError = "";
        request.updatedAt = today;
        saveState();
        render();
        scheduleM365AutomationRetry(request.id, 1000);
        m365AutomationActiveRuns.delete(request.id);
        return;
      }
      request.status = "waiting_for_license";
      request.automationStarted = true;
      request.pax8AlreadyIncreased = true;
    request.pax8SubscriptionId = data.result.pax8SubscriptionId || request.pax8SubscriptionId || "";
      request.pax8PreviewSubscriptionId = "";
      request.pax8Quantity = data.result.pax8Quantity || request.pax8Quantity || "";
      request.licenseAvailability = data.result.licenseAvailability || request.licenseAvailability || {};
      request.lastLicenseCheckAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      request.automationRunLog = m365WaitingSteps(request, data.result || {});
      request.automationPreview = "";
      request.automationError = "";
      request.updatedAt = today;
      saveState();
      render();
      scheduleM365AutomationRetry(request.id, data.result?.retryAfterMs || 30000);
      m365AutomationActiveRuns.delete(request.id);
      return;
    }
    request.status = "complete";
    cancelM365AutomationRetry(request.id);
    request.automationStarted = false;
    request.pax8AlreadyIncreased = false;
    request.pax8SubscriptionId = "";
    request.pax8PreviewSubscriptionId = "";
    request.pax8Quantity = "";
    request.licenseAvailability = data.result?.licenseAvailability || {};
    request.temporaryPassword = data.result?.temporaryPassword || request.temporaryPassword || "";
    request.automationRunLog = m365CompleteSteps(request, data.result || {});
    request.automationPreview = "Automation complete.";
    request.notes = [
      request.notes,
      `Automation completed ${today}. ${data.result?.note || ""}`
    ].filter(Boolean).join("\n\n");
  } catch (error) {
    const message = friendlyM365AutomationError(error);
    const canRetry = shouldRetryM365AutomationError(message);
    const shouldKeepWaiting =
      effectiveM365Status(request) === "waiting_for_license"
      || request.automationStarted === true
      || request.pax8AlreadyIncreased
      || request.pax8SubscriptionId;
    if (canRetry && shouldKeepWaiting) {
      request.status = "waiting_for_license";
      request.automationStarted = true;
      request.automationPreview = "";
      request.automationError = message;
      const waitingSteps = m365WaitingSteps(request, {
        license: request.license,
        pax8Changed: false,
        pax8Quantity: request.pax8Quantity,
        lastCheckedAt: request.lastLicenseCheckAt,
        licenseAvailability: request.licenseAvailability
      });
      request.automationRunLog = [
        ...waitingSteps,
        {
          status: "warning",
          label: /invalid_token/i.test(message)
            ? "Microsoft 365 authentication needs a fresh check."
            : /Pax8 is still processing/i.test(message)
              ? "Pax8 is still processing the subscription change."
            : "This automatic check could not reach the automation service.",
          detail: `${message} The portal will try again automatically.`
        }
      ];
      scheduleM365AutomationRetry(request.id, 30000);
    } else {
      request.automationError = message;
      request.status = "needs_review";
      request.automationStarted = false;
      request.automationRunLog = [
        ...(Array.isArray(request.automationRunLog) && request.automationRunLog.length
          ? request.automationRunLog
          : m365StartingSteps(request, autoResume)),
        {
          status: "error",
          label: "Automation stopped.",
          detail: message
        }
      ];
    }
  }
  m365AutomationActiveRuns.delete(request.id);
  request.updatedAt = today;
  saveState();
  render();
}

function updateTicketM365License(requestId, license) {
  const request = findM365Request(requestId);
  if (!request) return;
  const nextLicense = String(license || "").trim();
  const licenseChanged = nextLicense !== String(request.license || "").trim();
  request.license = nextLicense;
  request.licenseSource = "manual";
  request.automationPreview = "";
  request.automationError = "";
  if (licenseChanged) {
    request.pax8AlreadyIncreased = false;
    request.pax8SubscriptionId = "";
    request.pax8PreviewSubscriptionId = "";
    request.pax8Quantity = "";
    request.licenseAvailability = null;
    request.automationRunLog = [];
    request.automationStarted = false;
  }
  request.updatedAt = today;
  if (licenseChanged || ["pax8_needed", "ready_to_provision", "ready_to_run"].includes(request.status)) {
    request.status = "needs_review";
  }
  saveState();
  renderM365Requests();
  renderTicketDetail();
}

function saveTicketM365InlineRequest(requestId) {
  const request = findM365Request(requestId);
  if (!request) {
    setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket.", true);
    return;
  }
  const fields = {};
  document.querySelectorAll("[data-m365-inline-field]").forEach(field => {
    fields[field.dataset.m365InlineField] = field.value;
  });
  const firstName = String(fields.firstName || "").trim();
  const lastName = String(fields.lastName || "").trim();
  const displayName = String(fields.displayName || "").trim() || `${firstName} ${lastName}`.trim();
  request.firstName = firstName;
  request.lastName = lastName;
  request.displayName = displayName;
  request.userPrincipalName = String(fields.userPrincipalName || "").trim();
  request.setupEmail = String(fields.setupEmail || "").trim();
  request.sourceEmail = String(fields.sourceEmail || "").trim();
  const nextLicense = String(fields.license || "").trim();
  const licenseChanged = nextLicense && nextLicense !== String(request.license || "").trim();
  if (licenseChanged) request.licenseSource = "manual";
  request.license = nextLicense;
  request.notes = String(fields.notes || "").trim();
  request.automationPreview = "";
  request.automationError = "";
  if (licenseChanged) {
    request.pax8AlreadyIncreased = false;
    request.pax8SubscriptionId = "";
    request.pax8Quantity = "";
    request.licenseAvailability = null;
    request.automationRunLog = [];
    request.status = "needs_review";
  }
  if (!request.status || request.status === "requested") request.status = "needs_review";
  request.updatedAt = today;
  editingTicketM365RequestId = "";
  saveState();
  renderM365Requests();
  renderTicketDetail();
  setM365ActionStatus("Saved this Microsoft 365 request on the ticket.");
}

window.ticketM365EditInline = function ticketM365EditInline(requestId) {
  const request = findM365Request(requestId);
  if (!request) {
    setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket yet.", true);
    return;
  }
  editingTicketM365RequestId = request.id;
  renderTicketDetail();
  setM365ActionStatus("Editing this Microsoft 365 request on the ticket.");
};

window.ticketM365CancelInline = function ticketM365CancelInline() {
  editingTicketM365RequestId = "";
  renderTicketDetail();
  setM365ActionStatus("Edit cancelled.");
};

window.ticketM365SaveInline = function ticketM365SaveInline(requestId) {
  saveTicketM365InlineRequest(requestId);
};

window.ticketM365Preview = function ticketM365Preview(requestId) {
  setM365ActionStatus("Building setup email preview...");
  previewM365Automation(requestId);
};

window.ticketM365Run = function ticketM365Run(requestId) {
  setM365ActionStatus("Starting Microsoft 365 mailbox automation...");
  runM365Automation(requestId);
};

function clearTicketM365Hash() {
  if (!location.hash.startsWith("#ticket-m365-")) return;
  history.replaceState(null, "", `${location.pathname}${location.search}`);
}

function handleTicketM365HashAction() {
  const hash = location.hash || "";
  const match = hash.match(/^#ticket-m365-([^=]+)=(.*)$/);
  if (!match) return false;
  const action = decodeURIComponent(match[1] || "");
  const requestId = decodeURIComponent(match[2] || "");
  clearTicketM365Hash();

  if (action === "edit") {
    const request = findM365Request(requestId);
    if (!request) {
      setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket yet.", true);
      return true;
    }
    editingTicketM365RequestId = request.id;
    renderTicketDetail();
    setM365ActionStatus("Editing this Microsoft 365 request on the ticket.");
    return true;
  }

  if (action === "cancel") {
    editingTicketM365RequestId = "";
    renderTicketDetail();
    setM365ActionStatus("Edit cancelled.");
    return true;
  }

  if (action === "save") {
    saveTicketM365InlineRequest(requestId);
    return true;
  }

  if (action === "preview") {
    setM365ActionStatus("Building setup email preview...");
    previewM365Automation(requestId);
    return true;
  }

  if (action === "run") {
    setM365ActionStatus("Starting Microsoft 365 mailbox automation...");
    runM365Automation(requestId);
    return true;
  }

  return false;
}

window.addEventListener("hashchange", handleTicketM365HashAction);
window.addEventListener("DOMContentLoaded", handleTicketM365HashAction);

function setM365ActionStatus(message = "", isError = false) {
  const node = document.getElementById("m365-action-status");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("error", isError);
}

function setTicketActionStatus(message = "", isError = false) {
  const node = document.getElementById("ticket-action-status");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("error", isError);
}

function ticketDetailFieldsChanged(ticket, status, type, form, priority, severity, tags, ccEmails, followupTime) {
  return (
    String(status || "") !== String(ticket.status || "") ||
    String(type || "") !== String(ticketTypeValue(ticket)) ||
    String(form || "") !== String(ticketFormLabel(ticket)) ||
    String(priority || "") !== String(ticket.priority || "") ||
    String(severity || "") !== String(ticket.severity || "none") ||
    JSON.stringify(tags || []) !== JSON.stringify(ticket.tags || []) ||
    JSON.stringify(ccEmails || []) !== JSON.stringify(ticket.ccEmails || []) ||
    String(followupTime || "") !== String(ticket.followupTime || "")
  );
}

function invoiceNumber(invoiceId) {
  return state.invoices.find(inv => inv.id === invoiceId)?.number || "unlinked invoice";
}

function invoiceNeedsAction(inv) {
  const status = computedInvoiceStatus(inv);
  const balance = invoiceTotal(inv) - paidAmount(inv.id);
  return !["paid", "void"].includes(status) && balance > 0.005;
}

function invoiceActionLabel(inv) {
  const status = computedInvoiceStatus(inv);
  if (status === "draft") return "Review draft";
  if (status === "ready") return "Ready to send";
  if (status === "overdue") return "Overdue";
  if (status === "sent") return "Payment due";
  return "Action needed";
}

function invoiceActionButtons(inv) {
  const status = computedInvoiceStatus(inv);
  return `
    <div class="row-actions invoice-actions">
      <button data-preview-invoice="${inv.id}">Admin Preview</button>
      <button data-customer-preview-invoice="${inv.id}">Customer Preview</button>
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
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/new commerce experience|nce|microsoft|office|365|business|online|plan|no teams|\\(|\\)|-/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactLicenseName(value = "") {
  return normalizedLicensePhrase(value).replace(/\s+/g, "");
}

function m365LicenseTokens(value = "") {
  const normalized = normalizedLicensePhrase(value);
  const compacted = compactLicenseName(value);
  const tokens = new Set([compacted]);
  if (/exchange/.test(normalized) && /\b1\b/.test(normalized)) tokens.add("exchange1");
  if (/exchange/.test(normalized) && /\b2\b/.test(normalized)) tokens.add("exchange2");
  if (/basic/.test(normalized)) tokens.add("basic");
  if (/standard/.test(normalized)) tokens.add("standard");
  if (/premium/.test(normalized)) tokens.add("premium");
  return [...tokens].filter(Boolean);
}

function m365LicenseEquivalent(a = "", b = "") {
  const left = m365LicenseTokens(a);
  const right = m365LicenseTokens(b);
  return left.some(leftToken => right.some(rightToken => leftToken === rightToken || leftToken.includes(rightToken) || rightToken.includes(leftToken)));
}

function matchingM365LicenseChoice(current = "", choices = []) {
  return choices.find(choice => choice === current) || choices.find(choice => m365LicenseEquivalent(choice, current)) || "";
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
      const needsAction = invoiceNeedsAction(inv);
      return `
        <tr class="clickable-row ${needsAction ? "invoice-action-needed" : ""}" data-open-customer-preview-invoice="${inv.id}" tabindex="0">
          <td><strong>${escapeHtml(inv.number)}</strong><br><span class="subtle">${escapeHtml(inv.type || "")}</span>${needsAction ? `<br><span class="action-needed-pill">${escapeHtml(invoiceActionLabel(inv))}</span>` : ""}</td>
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
      <tr class="clickable-row" data-open-customer-preview-quote="${quote.id}" tabindex="0">
        <td><strong>${escapeHtml(quote.number)}</strong><br><span class="subtle">${escapeHtml(quote.title || "")}</span></td>
        <td>${escapeHtml(quoteClientName(quote))}</td>
        <td>${formatDate(quote.date)}</td>
        <td><span class="badge ${quote.status}">${escapeHtml(quote.status)}</span></td>
        <td class="num">${money.format(invoiceTotal(quote))}</td>
        <td class="num">${money.format(quoteMargin(quote))}</td>
        <td>
          <div class="row-actions">
            <button data-preview-quote="${quote.id}">Admin Preview</button>
            <button data-customer-preview-quote="${quote.id}">Customer Preview</button>
            <button data-edit-quote="${quote.id}">Edit</button>
            ${!quote.clientId && quoteOneTimeClient(quote) ? `<button data-create-client-from-quote="${quote.id}">Create Customer</button>` : ""}
            ${quote.status !== "converted" && quote.status !== "declined" ? `<button data-send-quote="${quote.id}">Send</button>` : ""}
            ${quote.status !== "converted" ? `<button data-convert-quote="${quote.id}">Create Invoice</button>` : ""}
          </div>
        </td>
      </tr>
    `).join("");
  document.getElementById("quote-list").innerHTML = `
    <table>
      <thead><tr><th>Quote</th><th>Client</th><th>Date</th><th>Status</th><th class="num">Total</th><th class="num">Margin</th><th>Actions</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7">No quotes yet.</td></tr>`}</tbody>
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
  deleteButton.hidden = !((mode === "invoice" || mode === "quote") && existing.id);
  deleteButton.textContent = mode === "quote" ? "Delete Quote" : "Delete Invoice";
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
    ticket: "Support Ticket",
    m365Request: "Microsoft 365 Request",
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

function ninjaOneOrganizationOptions(selected, clientId = "") {
  const client = clientById(clientId);
  const fallbackOrgId = Number(client?.ninjaOneOrgId || 0);
  return [
    `<option value="" ${!selected ? "selected" : ""}>${fallbackOrgId ? `Use ${escapeHtml(client.name)} org ID (${fallbackOrgId})` : "Select a NinjaOne organization"}</option>`,
    ...(state.ninjaOneOrganizations || []).map(organization => {
      const selectedText = String(selected || "") === String(organization.id) ? "selected" : "";
      return `<option value="${organization.id}" ${selectedText}>${escapeHtml(organization.name)} (${organization.id})</option>`;
    })
  ].join("");
}

function ninjaOneOrganizationName(organizationId) {
  if (!organizationId) return "";
  const organization = (state.ninjaOneOrganizations || []).find(item => String(item.id) === String(organizationId));
  return organization?.name || "";
}

function ninjaOneContactsForOrg(organizationId) {
  return (state.ninjaOneContacts || [])
    .filter(contact => !organizationId || String(contact.organizationId) === String(organizationId))
    .sort((a, b) => (a.displayName || a.email || "").localeCompare(b.displayName || b.email || ""));
}

function ninjaOneContactOptions(selected, organizationId = "") {
  const contacts = ninjaOneContactsForOrg(organizationId);
  return [
    `<option value="" ${!selected ? "selected" : ""}>Create/select requester</option>`,
    ...contacts.map(contact => {
      const label = `${contact.displayName || contact.email}${contact.email ? ` - ${contact.email}` : ""}`;
      const selectedText = String(selected || "") === String(contact.uid) ? "selected" : "";
      return `<option value="${escapeHtml(contact.uid)}" ${selectedText}>${escapeHtml(label)}</option>`;
    })
  ].join("");
}

function ninjaOneContactByUid(uid) {
  return (state.ninjaOneContacts || []).find(contact => String(contact.uid) === String(uid));
}

function splitContactName(name = "") {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "Unknown" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) };
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
      <div class="field full pricing-editor">
        <h3>New User Automation</h3>
        ${checkbox("userAutomationEnabled", "Allow approved requester tickets to create Microsoft 365 users", item.userAutomationEnabled === true)}
        ${field("defaultM365License", "Default Microsoft 365 License", item.defaultM365License || "Microsoft 365 Business Standard")}
        <p class="field-note">A clear license in the ticket can override this value. Otherwise, the automation uses this default license.</p>
        ${textarea("licenseRequestAliasesText", "License Clarification Notes / Aliases", licenseRequestAliasesToText(item.licenseRequestAliases || []), true)}
        <p class="field-note">One row per code word: code | exact license. Examples: email | Exchange Online (Plan 1) [New Commerce Experience], basic | Microsoft 365 Business Basic [New Commerce Experience]</p>
        ${textarea("approvedRequesterEmails", "Approved Requester Emails", item.approvedRequesterEmails || "", true)}
        <p class="field-note">One email per line or comma-separated. Only these requesters can trigger automatic user creation for this client.</p>
      </div>
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
          ${mode === "quote" ? field("shippingCost", "Shipping Cost", item.shippingCost ?? 0, "number") : ""}
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
            <div class="invoice-edit-address">${lines(clientById(item.clientId)?.billTo || clientById(item.clientId)?.name || quoteOneTimeClient(item)?.billTo || "Select a client, or use one-time quote details below")}</div>
          </div>
          <div>
            ${checkbox("showShipTo", "Show Ship To", item.showShipTo)}
            ${textarea("shipTo", "Ship To", item.shipTo || clientById(item.clientId)?.billTo || quoteOneTimeClient(item)?.shipTo || "", false)}
          </div>
        </div>
        ${mode === "quote" ? oneTimeQuoteFields(item) : ""}
      </div>
      <div class="invoice-edit-section full">
        <h3>${mode === "quote" ? escapeHtml(item.title || "Project Quote") : "Monthly IT Services"}</h3>
        <div class="line-editor ${mode === "quote" ? "quote-line-editor" : ""}" id="line-editor" data-mode="${mode}">
          <div class="line-editor-head">
            ${mode === "quote"
              ? "<span></span><span>Type</span><span>Description</span><span>Item Detail</span><span>Qty</span><span>Unit Cost</span><span>Mark Up %</span><span>Unit Price</span><span>Taxable</span><span>Total</span><span></span>"
              : "<span></span><span>Description</span><span>Item Detail</span><span>Qty</span><span>Unit Price</span><span>Amount</span><span></span>"}
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
  if (mode === "ticket") {
    const orgId = item.ninjaOneOrgId || clientById(item.clientId)?.ninjaOneOrgId || "";
    const nameParts = splitContactName(item.requester || "");
    const selectedContact = ninjaOneContactByUid(item.requesterUid);
    return `
      ${select("clientId", "Client", clientOptions(item.clientId), false)}
      ${select("ninjaOneOrgId", "NinjaOne Organization", ninjaOneOrganizationOptions(item.ninjaOneOrgId || "", item.clientId), false)}
      ${select("requesterUid", "Requester (NinjaOne Contact)", ninjaOneContactOptions(item.requesterUid || "", orgId), false)}
      ${field("requesterFirstName", "Requester First Name", selectedContact?.firstName || nameParts.firstName || "")}
      ${field("requesterLastName", "Requester Last Name", selectedContact?.lastName || nameParts.lastName || "")}
      ${field("requesterEmail", "Requester Email", selectedContact?.email || item.requesterEmail || "", "email")}
      ${field("requesterPhone", "Requester Phone", selectedContact?.phone || item.requesterPhone || "")}
      ${field("title", "Issue / Request", item.title || "")}
      ${item.ninjaTicketId ? `<div class="field"><label>NinjaOne Ticket ID</label><div class="readonly-field">${escapeHtml(item.ninjaTicketId)}</div></div>` : ""}
      ${select("priority", "Priority", ticketPriorityOptions(item.priority || "normal"), false)}
      ${select("status", "Status", ticketStatusOptions(item.status || "new"), false)}
      ${field("category", "Category", item.category || "General")}
      ${field("automationKey", "Automation / Script Key", item.automationKey || "")}
      ${textarea("description", "Description", item.description || "", true)}
      ${textarea("internalNotes", "Internal Notes", item.internalNotes || "", true)}
    `;
  }
  if (mode === "m365Request") {
    return `
      ${select("clientId", "Client", clientOptions(item.clientId), false)}
      ${field("requester", "Requester", item.requester || "")}
      ${field("sourceEmail", "Source Email / Ticket", item.sourceEmail || "")}
      ${field("setupEmail", "Communication Email", item.setupEmail || item.sourceEmail || "", "email")}
      ${field("ninjaTicketId", "NinjaOne Ticket ID", item.ninjaTicketId || "")}
      ${select("status", "Status", requestStatusOptions(item.status || "requested"), false)}
      ${field("firstName", "First Name", item.firstName || "")}
      ${field("lastName", "Last Name", item.lastName || "")}
      ${field("displayName", "Display Name", item.displayName || "")}
      ${field("userPrincipalName", "Microsoft 365 Username", item.userPrincipalName || "", "email")}
      ${field("license", "License", item.license || "Microsoft 365 Business Standard")}
      ${field("pax8Action", "Pax8 Action", item.pax8Action || "Add one license")}
      ${field("temporaryPassword", "Temporary Password / Secure Link Note", item.temporaryPassword || "")}
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

function oneTimeQuoteFields(item = {}) {
  const contact = quoteOneTimeClient(item) || {};
  return `
    <div class="one-time-quote-fields">
      <p class="field-note full">Use these fields for a one-time quote when you do not want to create a customer yet.</p>
      ${field("oneTimeName", "One-Time Name", contact.name || "")}
      ${field("oneTimeEmail", "One-Time Email", contact.email || "")}
      ${field("oneTimePhone", "One-Time Phone", contact.phone || "")}
      ${field("oneTimeCcEmail", "One-Time CC Email(s)", contact.ccEmail || "")}
      ${textarea("oneTimeBillTo", "One-Time Bill To", contact.billTo || "", true)}
    </div>
  `;
}

function statusOptions(mode, selected) {
  const values = mode === "quote" ? ["draft", "sent", "approved", "declined", "converted"] : ["draft", "ready", "sent", "paid", "void"];
  return values.map(v => `<option value="${v}" ${selected === v ? "selected" : ""}>${v}</option>`).join("");
}

function ticketPriorityOptions(selected) {
  return ["urgent", "high", "normal", "low"]
    .map(value => `<option value="${value}" ${selected === value ? "selected" : ""}>${ticketPriorityLabel(value)}</option>`)
    .join("");
}

function ticketStatusOptions(selected) {
  return ["new", "in_progress", "waiting", "resolved"]
    .map(value => `<option value="${value}" ${selected === value ? "selected" : ""}>${ticketStatusLabel(value)}</option>`)
    .join("");
}

function requestStatusOptions(selected) {
  return ["requested", "needs_review", "ready_to_run", "pax8_needed", "ready_to_provision", "provisioned", "complete"]
    .map(value => `<option value="${value}" ${selected === value ? "selected" : ""}>${requestStatusLabel(value)}</option>`)
    .join("");
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
        <input name="itemDetail" aria-label="Item Detail" value="${escapeHtml(item.detail || item.itemDetail || "")}" placeholder="Model, SKU, license, or ordering note">
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
      <input name="itemDetail" aria-label="Item Detail" value="${escapeHtml(item.detail || item.itemDetail || "")}" placeholder="Model, SKU, license, or ordering note">
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
        detail: row.querySelector('[name="itemDetail"]')?.value.trim() || "",
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
    .filter(item => item.description || item.detail || item.qty || item.rate || item.unitCost || item.markupPercent);
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
  const shipping = Math.max(0, Number(document.getElementById("shippingCost")?.value || 0));
  const tax = Math.round(taxableSubtotal * (taxRate / 100) * 100) / 100;
  totalNode.textContent = money.format(subtotal + tax + shipping);
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
  let autoCreateNinjaTicketId = "";
  setEditorError("");
  const oneTimeClient = editing.mode === "quote" ? quoteOneTimeClientFromForm(data) : null;
  if (editing.mode === "invoice" && !data.clientId) {
    setEditorError("Select or add a client before saving.", "clientId");
    return false;
  }
  if (editing.mode === "quote" && !data.clientId && !oneTimeClient) {
    setEditorError("Select a client, or enter a one-time quote name.", "oneTimeName");
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
      userAutomationEnabled: data.userAutomationEnabled === "on",
      approvedRequesterEmails: data.approvedRequesterEmails || "",
      defaultM365License: data.defaultM365License || "Microsoft 365 Business Standard",
      licenseRequestAliases: textToLicenseRequestAliases(data.licenseRequestAliasesText || ""),
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
      title: existingInvoice?.title || "",
      sourceQuoteId: existingInvoice?.sourceQuoteId || "",
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
      oneTimeClient,
      date: data.date,
      title: data.title,
      taxRate: Number(data.taxRate || 0),
      shippingCost: Math.max(0, Number(data.shippingCost || 0)),
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
  if (editing.mode === "ticket") {
    if (!data.clientId) {
      setEditorError("Select a client before saving.", "clientId");
      return false;
    }
    const selectedContact = ninjaOneContactByUid(data.requesterUid);
    const requesterName = selectedContact?.displayName || `${data.requesterFirstName || ""} ${data.requesterLastName || ""}`.trim();
    if (!data.requesterUid && (!data.requesterFirstName || !data.requesterLastName || !data.requesterEmail)) {
      setEditorError("Select a requester, or enter first name, last name, and email to create one in NinjaOne.", "requesterUid");
      return false;
    }
    const existingTicket = state.tickets.find(ticket => ticket.id === editing.id);
    const ticket = {
      id: editing.id || id("ticket"),
      clientId: data.clientId,
      ninjaOneOrgId: Number(data.ninjaOneOrgId || 0),
      ninjaOneOrgName: ninjaOneOrganizationName(data.ninjaOneOrgId),
      requesterUid: data.requesterUid || "",
      requester: requesterName,
      requesterFirstName: selectedContact?.firstName || data.requesterFirstName || "",
      requesterLastName: selectedContact?.lastName || data.requesterLastName || "",
      requesterEmail: selectedContact?.email || data.requesterEmail || "",
      requesterPhone: selectedContact?.phone || data.requesterPhone || "",
      title: data.title || "Support request",
      ninjaTicketId: existingTicket?.ninjaTicketId || "",
      priority: data.priority || "normal",
      status: data.status || "new",
      severity: existingTicket?.severity || "none",
      tags: existingTicket?.tags || [],
      ccEmails: existingTicket?.ccEmails || [],
      followupTime: existingTicket?.followupTime || null,
      ninjaVersion: existingTicket?.ninjaVersion || "",
      ninjaTicketFormId: existingTicket?.ninjaTicketFormId || "",
      ninjaStatusId: existingTicket?.ninjaStatusId || "",
      category: data.category || "General",
      automationKey: data.automationKey,
      description: data.description,
      internalNotes: data.internalNotes,
      createdAt: existingTicket?.createdAt || today,
      updatedAt: today
    };
    upsert(state.tickets, ticket);
    if (!ticket.ninjaTicketId) autoCreateNinjaTicketId = ticket.id;
  }
  if (editing.mode === "m365Request") {
    if (!data.clientId) {
      setEditorError("Select a client before saving.", "clientId");
      return false;
    }
    const existingRequest = state.m365Requests.find(request => request.id === editing.id);
    const displayName = data.displayName || `${data.firstName || ""} ${data.lastName || ""}`.trim();
    const request = {
      id: editing.id || id("m365"),
      clientId: data.clientId,
      requester: data.requester,
      sourceEmail: data.sourceEmail,
      setupEmail: data.setupEmail,
      ninjaTicketId: String(data.ninjaTicketId || "").trim(),
      status: data.status || "requested",
      firstName: data.firstName,
      lastName: data.lastName,
      displayName,
      userPrincipalName: data.userPrincipalName,
      license: data.license,
      pax8Action: data.pax8Action,
      temporaryPassword: data.temporaryPassword,
      automationPreview: existingRequest?.automationPreview || "",
      automationError: existingRequest?.automationError || "",
      notes: data.notes,
      createdAt: existingRequest?.createdAt || today,
      updatedAt: today
    };
    upsert(state.m365Requests, request);
  }
  saveState();
  document.getElementById("editor").close();
  render();
  if (autoCreateNinjaTicketId) createNinjaOneTicket(autoCreateNinjaTicketId);
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

function deleteQuote(quoteId) {
  const quote = state.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  const ok = window.confirm(`Delete quote ${quote.number}? This cannot be undone.`);
  if (!ok) return;
  state.quotes = state.quotes.filter(q => q.id !== quoteId);
  saveState();
  const editor = document.getElementById("editor");
  if (editor.open) editor.close();
  const preview = document.getElementById("document-preview");
  if (preview?.open) preview.close();
  render();
}

async function updateTicketStatus(ticketId, status) {
  const ticket = state.tickets.find(item => item.id === ticketId);
  if (!ticket) return;
  if (ticket.ninjaTicketId) {
    await saveTicketUpdate(ticketId, { status, skipDom: true });
    return;
  }
  ticket.status = status;
  ticket.updatedAt = today;
  saveState();
  render();
}

function openResolveTicketModal(ticketId) {
  const ticket = state.tickets.find(item => item.id === ticketId);
  if (!ticket) return;
  resolvingTicketId = ticketId;
  const dialog = document.getElementById("resolve-ticket-dialog");
  const title = document.getElementById("resolve-ticket-title");
  const summary = document.getElementById("resolve-ticket-summary");
  const noteInput = document.getElementById("resolve-ticket-note");
  const error = document.getElementById("resolve-ticket-error");
  const existingNote = document.getElementById("ticket-response-text")?.value.trim() || "";
  const lastResolutionNote = latestPortalResolutionNote(ticket);
  if (title) title.textContent = `Resolve #${ticket.ninjaTicketId || ticket.id}`;
  if (summary) {
    summary.textContent = lastResolutionNote
      ? "This ticket already has a portal response. Leave this blank to resolve without posting another note."
      : "This note will be posted as a public response before the ticket is marked resolved.";
  }
  if (noteInput) noteInput.value = existingNote;
  if (error) {
    error.hidden = true;
    error.textContent = "";
  }
  dialog?.showModal();
  setTimeout(() => noteInput?.focus(), 0);
}

function closeResolveTicketModal() {
  resolvingTicketId = "";
  const dialog = document.getElementById("resolve-ticket-dialog");
  dialog?.close();
}

async function submitResolveTicketModal() {
  const ticketId = resolvingTicketId;
  const ticket = state.tickets.find(item => item.id === ticketId);
  const noteInput = document.getElementById("resolve-ticket-note");
  const error = document.getElementById("resolve-ticket-error");
  const submitButton = document.getElementById("resolve-ticket-submit");
  const cleanNote = (noteInput?.value || "").trim();
  const existingResolutionNote = ticket ? latestPortalResolutionNote(ticket) : null;
  if (!cleanNote && !existingResolutionNote) {
    if (error) {
      error.textContent = "Add a resolution note before resolving this ticket.";
      error.hidden = false;
    }
    noteInput?.focus();
    return;
  }
  if (!ticketId) return;
  const commentToPost = ticket && cleanNote && !hasMatchingPortalNote(ticket, cleanNote, true)
    ? cleanNote
    : "";
  if (error) {
    error.hidden = true;
    error.textContent = "";
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Resolving...";
  }
  const saved = await saveTicketUpdate(ticketId, {
    status: "resolved",
    comment: commentToPost,
    publicComment: true,
    skipDom: true
  });
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "Resolve Ticket";
  }
  if (saved !== false) closeResolveTicketModal();
}

async function markM365TicketInProgress(request = {}) {
  const ticket = (state.tickets || []).find(item =>
    (request.ninjaTicketId && String(item.ninjaTicketId || "") === String(request.ninjaTicketId))
    || (selectedTicketId && item.id === selectedTicketId)
  );
  if (!ticket || ticket.status !== "new") return;
  await updateTicketStatus(ticket.id, "in_progress");
}

function addTicketNote(ticketId) {
  const ticket = state.tickets.find(item => item.id === ticketId);
  const note = document.getElementById("ticket-response-text")?.value.trim();
  if (!ticket || !note) return;
  addPortalTicketActivity(ticket, note, selectedTicketResponseMode !== "private");
  ticket.updatedAt = today;
  saveState();
  renderTicketDetail();
}

async function saveTicketUpdate(ticketId, options = {}) {
  const ticket = state.tickets.find(item => item.id === ticketId);
  if (!ticket) return;
  setTicketActionStatus("Saving ticket update...");
  const useDom = !options.skipDom;
  const status = options.status || (useDom ? document.getElementById("ticket-detail-status")?.value : "") || ticket.status;
  const type = options.type || (useDom ? document.getElementById("ticket-detail-type")?.value : "") || ticketTypeValue(ticket);
  const form = options.form || (useDom ? document.getElementById("ticket-detail-form")?.value : "") || ticketFormLabel(ticket);
  const priority = options.priority || (useDom ? document.getElementById("ticket-detail-priority")?.value : "") || ticket.priority;
  const severity = options.severity || (useDom ? document.getElementById("ticket-detail-severity")?.value : "") || ticket.severity || "none";
  const note = (options.comment ?? (useDom ? document.getElementById("ticket-response-text")?.value.trim() : "")) || "";
  const tags = options.tags || (useDom ? csvToList(document.getElementById("ticket-detail-tags")?.value || "") : ticket.tags || []);
  const ccEmails = options.ccEmails || (useDom ? csvToList(document.getElementById("ticket-detail-cc")?.value || "") : ticket.ccEmails || []);
  const followupTime = options.followupTime !== undefined
    ? options.followupTime
    : (useDom ? followupEpochValue(document.getElementById("ticket-detail-followup")?.value || "") : ticket.followupTime || null);
  const assignedAppUserId = options.assignedAppUserId !== undefined
    ? options.assignedAppUserId
    : (useDom ? document.getElementById("ticket-detail-assignee")?.value : ticket.assignedAppUserId || defaultNinjaOneAssigneeId());
  const publicComment = options.publicComment ?? (selectedTicketResponseMode !== "private");
  const detailsChanged =
    ticketDetailFieldsChanged(ticket, status, type, form, priority, severity, tags, ccEmails, followupTime)
    || String(assignedAppUserId || "") !== String(ticket.assignedAppUserId || "");
  let ninjaResponse = null;

  try {
    const response = await fetch("/api/ninjaone-tickets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: ticket.ninjaTicketId,
        clientId: ticket.ninjaOneOrgId || clientById(ticket.clientId)?.ninjaOneOrgId,
        requesterUid: ticket.requesterUid,
        subject: ticket.title,
        status,
        statusId: status === ticket.status ? ticket.ninjaStatusId : "",
        type,
        form,
        priority,
        severity,
        tags,
        ccEmails,
        followupTime,
        assignedAppUserId,
        ticketFormId: ticket.ninjaTicketFormId,
        version: ticket.ninjaVersion,
        comment: note,
        publicComment,
        commentOnly: Boolean(note && !detailsChanged)
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "NinjaOne ticket update failed.");
    ninjaResponse = data.ticket || null;
    ticket.syncError = "";
  } catch (error) {
    ticket.syncError = friendlyNinjaOneError(error instanceof Error ? error.message : "NinjaOne ticket update failed.");
    ticket.updatedAt = today;
    saveState();
    render();
    setTicketActionStatus(ticket.syncError, true);
    return false;
  }

  ticket.status = status;
  if (status === "resolved") ticket.portalStatusOverride = "resolved";
  else if (ticket.portalStatusOverride === "resolved") ticket.portalStatusOverride = "";
  ticket.type = type;
  ticket.form = form;
  ticket.priority = priority;
  ticket.severity = severity;
  ticket.tags = tags;
  ticket.ccEmails = ccEmails;
  ticket.followupTime = followupTime;
  ticket.assignedAppUserId = assignedAppUserId || "";
  if (ninjaResponse?.version) ticket.ninjaVersion = ninjaResponse.version;
  if (ninjaResponse?.ticketFormId) ticket.ninjaTicketFormId = ninjaResponse.ticketFormId;
  if (ninjaResponse?.status?.statusId) ticket.ninjaStatusId = ninjaResponse.status.statusId;
  if (note) {
    addPortalTicketActivity(ticket, note, publicComment);
  }
  ticket.updatedAt = today;
  saveState();
  render();
  setTicketActionStatus(note ? "Ticket update saved and note posted." : "Ticket details saved.");
  requestNinjaOneTicketSync();
  return true;
}

async function ensureNinjaOneRequester(ticket, ninjaOneOrgId) {
  if (ticket.requesterUid) return ticket.requesterUid;
  if (!ticket.requesterEmail || !ticket.requesterFirstName || !ticket.requesterLastName) return "";

  const response = await fetch("/api/ninjaone-contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organizationId: ninjaOneOrgId,
      firstName: ticket.requesterFirstName,
      lastName: ticket.requesterLastName,
      email: ticket.requesterEmail,
      phone: ticket.requesterPhone || ""
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "NinjaOne contact creation failed.");
  const contact = data.contact;
  if (!contact?.uid) throw new Error("NinjaOne contact was created without a requester UID.");

  state.ninjaOneContacts = [
    ...(state.ninjaOneContacts || []).filter(existing => String(existing.uid) !== String(contact.uid)),
    contact
  ];
  ticket.requesterUid = contact.uid;
  ticket.requester = contact.displayName || ticket.requester;
  ticket.requesterFirstName = contact.firstName || ticket.requesterFirstName;
  ticket.requesterLastName = contact.lastName || ticket.requesterLastName;
  ticket.requesterEmail = contact.email || ticket.requesterEmail;
  ticket.requesterPhone = contact.phone || ticket.requesterPhone;
  return contact.uid;
}

async function createNinjaOneTicket(ticketId) {
  const ticket = state.tickets.find(item => item.id === ticketId);
  if (!ticket) return;
  const client = clientById(ticket.clientId);
  const ninjaOneOrgId = Number(ticket.ninjaOneOrgId || client?.ninjaOneOrgId || 0);
  if (!ninjaOneOrgId) {
    ticket.syncError = "Select a NinjaOne organization before creating the ticket.";
    ticket.updatedAt = today;
    saveState();
    render();
    window.alert(ticket.syncError);
    return;
  }

  let requesterUid = "";
  try {
    requesterUid = await ensureNinjaOneRequester(ticket, ninjaOneOrgId);
  } catch (error) {
    ticket.syncError = friendlyNinjaOneError(error instanceof Error ? error.message : "NinjaOne requester sync failed.");
    ticket.updatedAt = today;
    saveState();
    render();
    window.alert(ticket.syncError);
    return;
  }

  let data = {};
  try {
    const response = await fetch("/api/ninjaone-tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: ninjaOneOrgId,
        requesterUid,
        requester: ticket.requester,
        subject: ticket.title,
        description: ticket.description,
        internalNotes: ticket.internalNotes,
        category: ticket.category,
        assignedAppUserId: ticket.assignedAppUserId || defaultNinjaOneAssigneeId(),
        priority: ticket.priority
      })
    });
    data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "NinjaOne ticket creation failed.");
    }
  } catch (error) {
    ticket.syncError = friendlyNinjaOneError(error instanceof Error ? error.message : "NinjaOne ticket creation failed.");
    ticket.updatedAt = today;
    saveState();
    render();
    window.alert(ticket.syncError);
    return;
  }

  ticket.ninjaTicketId = String(data.ticketId || data.ticket?.id || "");
  ticket.assignedAppUserId = data.ticket?.assignedAppUserId || ticket.assignedAppUserId || defaultNinjaOneAssigneeId() || "";
  if (!ticket.ninjaTicketId) {
    ticket.syncError = "NinjaOne created the ticket but did not return a ticket ID.";
    ticket.updatedAt = today;
    saveState();
    render();
    window.alert(ticket.syncError);
    return;
  }
  ticket.syncError = "";
  ticket.ninjaOneOrgId = ninjaOneOrgId;
  ticket.ninjaOneOrgName = ticket.ninjaOneOrgName || ninjaOneOrganizationName(ninjaOneOrgId);
  ticket.ninjaVersion = data.ticket?.version || ticket.ninjaVersion || "";
  ticket.ninjaTicketFormId = data.ticket?.ticketFormId || ticket.ninjaTicketFormId || "";
  ticket.ninjaStatusId = data.ticket?.status?.statusId || ticket.ninjaStatusId || "";
  ticket.status = ticket.status === "new" ? "in_progress" : ticket.status;
  ticket.updatedAt = today;
  ticket.internalNotes = [
    ticket.internalNotes,
    `Created in NinjaOne as ticket ${ticket.ninjaTicketId || "unknown"}.`
  ].filter(Boolean).join("\n");
  saveState();
  render();
  window.alert(`Created NinjaOne ticket ${ticket.ninjaTicketId}.`);
}

function updateM365RequestStatus(requestId, status) {
  const request = state.m365Requests.find(item => item.id === requestId);
  if (!request) return;
  request.status = status;
  request.updatedAt = today;
  saveState();
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
  const client = documentClient(quote);

  if (!clientEmail(client)) {
    window.alert("This quote does not have an email address saved.");
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
          shippingCost: documentShippingTotal(quote),
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
    title: existingInvoice?.title || "",
    sourceQuoteId: existingInvoice?.sourceQuoteId || "",
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
  const oneTimeClient = quoteOneTimeClientFromForm(data);
  return {
    id: editing.id || id("preview"),
    number: data.number,
    clientId: data.clientId,
    oneTimeClient,
    date: data.date,
    title: data.title,
    taxRate: Number(data.taxRate || 0),
    shippingCost: Math.max(0, Number(data.shippingCost || 0)),
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

function createCustomerFromQuote(quoteId, options = {}) {
  const quote = state.quotes.find(q => q.id === quoteId);
  if (!quote) return null;
  const existingClient = clientById(quote.clientId);
  if (existingClient) {
    if (!options.silent) window.alert(`Quote ${quote.number} is already linked to ${existingClient.name}.`);
    return existingClient;
  }
  const contact = quoteOneTimeClient(quote);
  if (!contact?.name) {
    if (!options.silent) window.alert("This quote does not have one-time customer details to create from.");
    return null;
  }
  if (!options.silent) {
    const ok = window.confirm(`Create customer ${contact.name} from quote ${quote.number}?`);
    if (!ok) return null;
  }
  const newClient = {
    id: id("client"),
    name: contact.name,
    status: "active",
    terms: "Net 15",
    billTo: contact.billTo || contact.name,
    shipTo: contact.shipTo || "",
    email: contact.email || "",
    ccEmail: contact.ccEmail || "",
    phone: contact.phone || "",
    internalCosts: [],
    mspRates: { fullUser: 70, lightUser: 20, serviceAccount: 10, copilot: 30 },
    licenseAuditBilling: true
  };
  state.clients.push(newClient);
  quote.clientId = newClient.id;
  saveState();
  render();
  if (!options.silent) window.alert(`Customer ${newClient.name} was created from quote ${quote.number}.`);
  return newClient;
}

function convertQuote(quoteId) {
  const quote = state.quotes.find(q => q.id === quoteId);
  if (!quote) return;
  if (quote.status === "converted") {
    window.alert("This quote has already been converted to an invoice.");
    return;
  }
  let client = clientById(quote.clientId);
  if (!client) {
    const contact = quoteOneTimeClient(quote);
    if (!contact) {
      window.alert("Add customer details before creating an invoice from this quote.");
      return;
    }
    const ok = window.confirm(`Create customer ${contact.name} from this quote and then create the invoice?`);
    if (!ok) return;
    client = createCustomerFromQuote(quote.id, { silent: true });
    if (!client) return;
  }
  const invoiceNumber = quote.number.replace("GSV-Q", "GSV-INV");
  const invoice = {
    id: id("inv"),
    number: invoiceNumber,
    clientId: client.id,
    date: today,
    dueDate: addDays(today, 15),
    month: today.slice(0, 7),
    status: "draft",
    type: "Project",
    title: quote.title,
    sourceQuoteId: quote.id,
    subject: defaultDocumentSubject("invoice", { ...quote, number: invoiceNumber }),
    items: structuredClone(quote.items),
    taxRate: Number(quote.taxRate || 0),
    shippingCost: documentShippingTotal(quote),
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
  const oneTimeClient = quoteOneTimeClientFromForm(data);
  if (!data.clientId && !oneTimeClient) {
    setEditorError("Select a client, or enter a one-time quote name before creating the invoice.", "oneTimeName");
    return;
  }
  const quote = {
    id: editing.id,
    number: data.number,
    clientId: data.clientId,
    oneTimeClient,
    date: data.date,
    title: data.title,
    taxRate: Number(data.taxRate || 0),
    shippingCost: Math.max(0, Number(data.shippingCost || 0)),
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

function previewDocument(type, idValue, previewMode = "admin") {
  const doc = type === "quote" ? state.quotes.find(q => q.id === idValue) : state.invoices.find(inv => inv.id === idValue);
  if (!doc) return;
  const customerMode = previewMode === "customer";
  previewing = { type, id: idValue, mode: customerMode ? "customer" : "admin" };
  const client = documentClient(doc);
  document.getElementById("document-title").textContent = customerMode
    ? (type === "quote" ? "Customer Quote Preview" : "Invoice")
    : (type === "quote" ? "Admin Quote Preview" : "Admin Invoice Preview");
  document.getElementById("document-body").innerHTML = customerMode
    ? renderDocument(type, doc, client)
    : renderAdminQuotePreview(doc, client);
  updatePreviewActions(type, doc, customerMode);
  const preview = document.getElementById("document-preview");
  preview.classList.toggle("is-admin-preview", !customerMode);
  preview.showModal();
}

function updatePreviewActions(type, doc, customerMode) {
  const invoiceStatus = type === "invoice" ? computedInvoiceStatus(doc) : "";
  const canSend = type === "invoice"
    ? invoiceStatus !== "paid" && invoiceStatus !== "void"
    : doc.status !== "converted" && doc.status !== "declined";
  document.getElementById("admin-preview-document").hidden = !customerMode;
  document.getElementById("customer-preview-document").hidden = customerMode;
  document.getElementById("create-customer-preview-document").hidden = type !== "quote" || Boolean(doc.clientId) || !quoteOneTimeClient(doc);
  document.getElementById("create-invoice-preview-document").hidden = type !== "quote" || doc.status === "converted";
  document.getElementById("send-preview-document").hidden = !canSend;
  document.getElementById("pay-preview-invoice").hidden = type !== "invoice" || invoiceStatus === "paid" || invoiceStatus === "void";
  document.getElementById("delete-preview-document").hidden = false;
  document.getElementById("print-document").hidden = false;
}

function exportDocumentPdf(type, doc) {
  if (!doc) return;
  previewing = { type, id: doc.id };
  const client = documentClient(doc);
  document.getElementById("document-title").textContent = type === "quote" ? "Quote" : "Invoice";
  document.getElementById("document-body").innerHTML = renderDocument(type, doc, client);
  updatePreviewActions(type, doc, true);
  const preview = document.getElementById("document-preview");
  preview.classList.remove("is-admin-preview");
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

function switchPreviewDocumentMode(mode) {
  if (!previewing) return;
  previewDocument(previewing.type, previewing.id, mode);
}

function sendPreviewDocument() {
  if (!previewing) return;
  if (previewing.type === "quote") sendQuote(previewing.id);
  else sendInvoice(previewing.id);
}

function payPreviewInvoice() {
  if (!previewing || previewing.type !== "invoice") return;
  const inv = state.invoices.find(invoice => invoice.id === previewing.id);
  if (!inv) return;
  const preview = document.getElementById("document-preview");
  if (preview.open) preview.close();
  openEditor("payment", { invoiceId: inv.id, date: today, method: "Check", amount: invoiceTotal(inv) - paidAmount(inv.id) });
}

function deletePreviewDocument() {
  if (!previewing) return;
  const current = { ...previewing };
  if (current.type === "quote") deleteQuote(current.id);
  else deleteInvoice(current.id);
  const stillExists = current.type === "quote"
    ? state.quotes.some(quote => quote.id === current.id)
    : state.invoices.some(invoice => invoice.id === current.id);
  const preview = document.getElementById("document-preview");
  if (!stillExists && preview.open) preview.close();
}

function createInvoiceFromPreviewQuote() {
  if (!previewing || previewing.type !== "quote") return;
  convertQuote(previewing.id);
}

function createCustomerFromPreviewQuote() {
  if (!previewing || previewing.type !== "quote") return;
  createCustomerFromQuote(previewing.id);
  const preview = document.getElementById("document-preview");
  if (preview?.open) preview.close();
}

function rowMarginAmount(item) {
  const qty = Number(item.qty || 0);
  const unitCost = Number(item.unitCost || 0);
  const rate = Number(item.rate || 0);
  const detail = String(item.detail || item.itemDetail || "");
  if (/labor/i.test(detail)) return qty * rate;
  return qty * (rate - unitCost);
}

function renderAdminQuotePreview(doc, client) {
  const isInvoice = state.invoices.some(invoice => invoice.id === doc.id);
  const subtotal = documentSubtotal(doc);
  const tax = documentTaxTotal(doc);
  const shipping = documentShippingTotal(doc);
  const total = invoiceTotal(doc);
  const taxRate = Number(doc.taxRate || 0);
  const margin = quoteMargin(doc);
  const items = doc.items || [];
  return `
    <div class="admin-preview">
      <div class="admin-preview-summary">
        <div><span>${isInvoice ? "Invoice #" : "Quote #"}</span><strong>${escapeHtml(doc.number || "")}</strong></div>
        <div><span>Client</span><strong>${escapeHtml(client?.name || "")}</strong></div>
        <div><span>Date</span><strong>${escapeHtml(doc.date || "")}</strong></div>
        ${isInvoice ? `<div><span>Due Date</span><strong>${escapeHtml(doc.dueDate || "")}</strong></div>` : ""}
        <div><span>Status</span><strong>${escapeHtml(doc.status || "")}</strong></div>
        <div><span>Project / Title</span><strong>${escapeHtml(projectDocumentTitle(isInvoice ? "invoice" : "quote", doc))}</strong></div>
        <div><span>Email Subject</span><strong>${escapeHtml(doc.subject || "")}</strong></div>
        <div><span>Tax Rate</span><strong>${taxRate.toFixed(2)}%</strong></div>
        <div><span>Margin</span><strong>${money.format(margin)}</strong></div>
        <div><span>Subtotal</span><strong>${money.format(subtotal)}</strong></div>
        <div><span>Tax</span><strong>${money.format(tax)}</strong></div>
        <div><span>Shipping</span><strong>${money.format(shipping)}</strong></div>
        <div><span>Total</span><strong>${money.format(total)}</strong></div>
      </div>
      <table class="admin-preview-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Item Detail</th>
            <th>Qty</th>
            <th>Unit Cost</th>
            <th>Mark Up %</th>
            <th>Unit Price</th>
            <th>Taxable</th>
            <th>Total</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => {
            const rowType = quoteDisplayLineType(items, item, index);
            const typeLabel = rowType === "title" ? "Section" : rowType === "detail" ? "Detail" : "Line";
            return `
              <tr class="${rowType === "title" ? "admin-section-row" : ""}">
                <td>${typeLabel}</td>
                <td>${escapeHtml(item.description || "")}</td>
                <td>${escapeHtml(item.detail || item.itemDetail || "")}</td>
                <td class="num">${item.qty ?? ""}</td>
                <td class="num">${money.format(Number(item.unitCost || 0))}</td>
                <td class="num">${Number(item.markupPercent || 0)}</td>
                <td class="num">${money.format(Number(item.rate || 0))}</td>
                <td class="center">${item.taxable ? "Yes" : "No"}</td>
                <td class="num">${money.format(lineItemAmount(item))}</td>
                <td class="num">${money.format(rowMarginAmount(item))}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
      ${doc.notes ? `<div class="admin-preview-notes"><strong>Notes</strong>${lines(doc.notes)}</div>` : ""}
    </div>
  `;
}

function renderDocument(type, doc, client) {
  const title = type === "quote" ? "QUOTE" : "INVOICE";
  const contactEmail = type === "invoice" ? "billing@gsvisions.com" : "cory@gsvisions.com";
  const projectDocument = isProjectDocument(type, doc);
  const subtotal = documentSubtotal(doc);
  const tax = documentTaxTotal(doc);
  const shipping = documentShippingTotal(doc);
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
        <h2>${projectDocument ? escapeHtml(projectDocumentTitle(type, doc)) : "Monthly IT Services"}</h2>
        ${renderDocumentItemTable(projectDocument ? "quote" : type, doc.items || [])}
        ${(tax || shipping) ? `
          <div class="doc-summary">
            <div><span>Subtotal</span><strong>${money.format(subtotal)}</strong></div>
            ${tax ? `<div><span>Tax (${taxRate.toFixed(2)}%)</span><strong>${money.format(tax)}</strong></div>` : ""}
            ${shipping ? `<div><span>Shipping</span><strong>${money.format(shipping)}</strong></div>` : ""}
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
            const rowType = quoteDisplayLineType(items, item, index);
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
              return `<tr class="doc-detail-row ${(item.description || "").trim() ? "" : "is-empty-detail"}"><td>${escapeHtml(item.description || "")}</td><td class="center"></td></tr>`;
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

function handleTicketM365PanelClick(event) {
  const eventTarget = event.target?.nodeType === Node.ELEMENT_NODE
    ? event.target
    : event.target?.parentElement;
  const trigger = eventTarget?.closest?.(
    "[data-edit-365-request], [data-cancel-365-inline], [data-save-365-inline], [data-preview-365-automation], [data-run-365-automation]"
  );
  if (!trigger || !trigger.closest(".ticket-m365-card")) return false;
  if (trigger.tagName === "A") return false;

  event.preventDefault();
  event.stopPropagation();

  if (trigger.dataset.edit365Request) {
    const request = findM365Request(trigger.dataset.edit365Request);
    if (!request) {
      setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket yet.", true);
      return true;
    }
    editingTicketM365RequestId = request.id;
    renderTicketDetail();
    setM365ActionStatus("Editing this Microsoft 365 request on the ticket.");
    return true;
  }

  if (trigger.dataset.cancel365Inline) {
    editingTicketM365RequestId = "";
    renderTicketDetail();
    setM365ActionStatus("Edit cancelled.");
    return true;
  }

  if (trigger.dataset.save365Inline) {
    saveTicketM365InlineRequest(trigger.dataset.save365Inline);
    return true;
  }

  if (trigger.dataset.preview365Automation) {
    trigger.disabled = true;
    setM365ActionStatus("Building setup email preview...");
    previewM365Automation(trigger.dataset.preview365Automation);
    return true;
  }

  if (trigger.dataset.run365Automation) {
    setM365ActionStatus("Starting Microsoft 365 mailbox automation...");
    runM365Automation(trigger.dataset.run365Automation);
    return true;
  }

  return false;
}

function handleTicketM365Button(target) {
  if (!target) return false;

  if (target.dataset.edit365Request) {
    const request = findM365Request(target.dataset.edit365Request);
    if (!request) {
      setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket yet.", true);
      return true;
    }
    editingTicketM365RequestId = request.id;
    renderTicketDetail();
    setM365ActionStatus("Editing this Microsoft 365 request on the ticket.");
    return true;
  }

  if (target.dataset.cancel365Inline) {
    editingTicketM365RequestId = "";
    renderTicketDetail();
    setM365ActionStatus("Edit cancelled.");
    return true;
  }

  if (target.dataset.save365Inline) {
    saveTicketM365InlineRequest(target.dataset.save365Inline);
    return true;
  }

  if (target.dataset.preview365Automation) {
    setM365ActionStatus("Building setup email preview...");
    previewM365Automation(target.dataset.preview365Automation);
    return true;
  }

  if (target.dataset.run365Automation) {
    setM365ActionStatus("Starting Microsoft 365 mailbox automation...");
    runM365Automation(target.dataset.run365Automation);
    return true;
  }

  return false;
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

document.addEventListener("click", handleTicketM365PanelClick, true);
document.addEventListener("pointerdown", handleTicketM365PanelClick, true);

document.addEventListener("click", event => {
  const eventTarget = event.target?.nodeType === Node.ELEMENT_NODE
    ? event.target
    : event.target?.parentElement;
  const target = eventTarget?.closest?.("button");
  const card = eventTarget?.closest?.(".client-card[data-client-dashboard-card]");
  if (!target && card) {
    selectedClientId = card.dataset.clientDashboardCard;
    setView("clients");
    return;
  }
  if (!target) {
    const invoicePreviewCard = eventTarget?.closest?.("[data-open-customer-preview-invoice]");
    if (invoicePreviewCard?.dataset.openCustomerPreviewInvoice) {
      previewDocument("invoice", invoicePreviewCard.dataset.openCustomerPreviewInvoice, "customer");
      return;
    }
    const quotePreviewRow = eventTarget?.closest?.("[data-open-customer-preview-quote]");
    if (quotePreviewRow?.dataset.openCustomerPreviewQuote) {
      previewDocument("quote", quotePreviewRow.dataset.openCustomerPreviewQuote, "customer");
      return;
    }
  }
  if (!target) return;
  if (handleTicketM365Button(target)) {
    event.preventDefault();
    return;
  }
  if (target.dataset.navToggle) {
    toggleNavGroup(target.dataset.navToggle);
    return;
  }
  if (target.dataset.ticketFilterSet) {
    const filter = target.dataset.ticketFilterSet || "unassigned";
    const ticketFilter = document.getElementById("ticket-filter");
    if (ticketFilter) ticketFilter.value = filter;
    setView("tickets");
    renderTickets();
    requestNinjaOneTicketSync();
    return;
  }
  if (target.dataset.view) {
    setView(target.dataset.view);
    return;
  }
  if (target.dataset.viewTicket) {
    openTicketDetail(target.dataset.viewTicket);
    return;
  }
  if (target.dataset.backToTickets !== undefined) {
    setView("tickets");
    return;
  }
  if (target.dataset.viewJump) setView(target.dataset.viewJump);
  if (target.id === "new-invoice") openEditor("invoice", { date: today, dueDate: addDays(today, 15), status: "draft", items: [] });
  if (target.id === "new-quote" || target.id === "add-quote") openEditor("quote", { date: today, status: "draft", items: [] });
  if (target.id === "new-ticket" || target.id === "add-ticket") openEditor("ticket", { status: "new", priority: "normal", createdAt: today });
  if (target.id === "connect-ninjaone" || target.id === "connect-ninjaone-tickets") reconnectNinjaOne();
  if (target.id === "add-365-request") openEditor("m365Request", { status: "requested", createdAt: today });
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
  if (target.id === "editor-delete" && editing.mode === "quote" && editing.id) deleteQuote(editing.id);
  if (target.id === "editor-create-invoice" && editing.mode === "quote" && editing.id) createInvoiceFromEditorQuote();
  if (target.id === "editor-pdf" && editing.mode === "invoice") exportDocumentPdf("invoice", invoiceFromEditor());
  if (target.id === "editor-send" && editing.mode === "invoice" && editing.id) sendInvoice(editing.id, invoiceFromEditor());
  if (target.id === "editor-send" && editing.mode === "quote" && editing.id) sendQuote(editing.id, quoteFromEditor());
  if (target.id === "editor-close" || target.id === "editor-cancel") document.getElementById("editor").close();
  if (target.id === "close-preview") document.getElementById("document-preview").close();
  if (target.id === "resolve-ticket-close" || target.id === "resolve-ticket-cancel") closeResolveTicketModal();
  if (target.id === "admin-preview-document") switchPreviewDocumentMode("admin");
  if (target.id === "customer-preview-document") switchPreviewDocumentMode("customer");
  if (target.id === "edit-preview-document") editPreviewDocument();
  if (target.id === "create-customer-preview-document") createCustomerFromPreviewQuote();
  if (target.id === "create-invoice-preview-document") createInvoiceFromPreviewQuote();
  if (target.id === "send-preview-document") sendPreviewDocument();
  if (target.id === "pay-preview-invoice") payPreviewInvoice();
  if (target.id === "delete-preview-document") deletePreviewDocument();
  if (target.id === "print-document") window.print();
  if (target.id === "save-snapshot") snapshot();
  if (target.id === "export-invoices") exportInvoices();
  if (target.id === "export-payments") exportPayments();
  if (target.id === "export-summary") exportSummary();
  if (target.dataset.editClient) openEditor("client", state.clients.find(c => c.id === target.dataset.editClient));
  if (target.dataset.editTicket) openEditor("ticket", state.tickets.find(ticket => ticket.id === target.dataset.editTicket));
  if (target.dataset.updateTicketModal) openEditor("ticket", state.tickets.find(ticket => ticket.id === target.dataset.updateTicketModal));
  if (target.dataset.ticketWaiting) updateTicketStatus(target.dataset.ticketWaiting, "waiting");
  if (target.dataset.ticketResolved) openResolveTicketModal(target.dataset.ticketResolved);
  if (target.dataset.ticketResponseMode) {
    selectedTicketResponseMode = target.dataset.ticketResponseMode === "private" ? "private" : "public";
    renderTicketDetail();
    return;
  }
  if (target.dataset.deletePortalNote) {
    deletePortalTicketActivity(target.dataset.ticketId || selectedTicketId, target.dataset.deletePortalNote);
    return;
  }
  if (target.dataset.saveTicketNote) addTicketNote(target.dataset.saveTicketNote);
  if (target.dataset.saveTicketUpdate) saveTicketUpdate(target.dataset.saveTicketUpdate);
  if (target.dataset.edit365Request) {
    const request = findM365Request(target.dataset.edit365Request);
    if (request) {
      editingTicketM365RequestId = request.id;
      renderTicketDetail();
      setM365ActionStatus("Editing this Microsoft 365 request on the ticket.");
    } else {
      setM365ActionStatus("I could not find the Microsoft 365 request linked to this ticket yet.", true);
    }
    return;
  }
  if (target.dataset.cancel365Inline) {
    editingTicketM365RequestId = "";
    renderTicketDetail();
    setM365ActionStatus("Edit cancelled.");
    return;
  }
  if (target.dataset.save365Inline) {
    saveTicketM365InlineRequest(target.dataset.save365Inline);
    return;
  }
  if (target.dataset.preview365Automation) {
    target.disabled = true;
    setM365ActionStatus("Building setup email preview...");
    previewM365Automation(target.dataset.preview365Automation);
    return;
  }
  if (target.dataset.run365Automation) {
    setM365ActionStatus("Starting Microsoft 365 mailbox automation...");
    runM365Automation(target.dataset.run365Automation);
    return;
  }
  if (target.dataset.pax8365Request) updateM365RequestStatus(target.dataset.pax8365Request, "ready_to_provision");
  if (target.dataset.provision365Request) updateM365RequestStatus(target.dataset.provision365Request, "provisioned");
  if (target.dataset.complete365Request) updateM365RequestStatus(target.dataset.complete365Request, "complete");
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
  if (target.dataset.customerPreviewInvoice) previewDocument("invoice", target.dataset.customerPreviewInvoice, "customer");
  if (target.dataset.pdfInvoice) exportDocumentPdf("invoice", state.invoices.find(inv => inv.id === target.dataset.pdfInvoice));
  if (target.dataset.previewQuote) previewDocument("quote", target.dataset.previewQuote, "admin");
  if (target.dataset.customerPreviewQuote) previewDocument("quote", target.dataset.customerPreviewQuote, "customer");
  if (target.dataset.createClientFromQuote) createCustomerFromQuote(target.dataset.createClientFromQuote);
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
  if (event.target?.id === "resolve-ticket-form") {
    event.preventDefault();
    submitResolveTicketModal();
    return;
  }
  if (event.target?.id !== "editor-form") return;
  event.preventDefault();
  saveEditor();
});

document.addEventListener("keydown", event => {
  const previewCard = event.target?.closest?.("[data-open-customer-preview-invoice], [data-open-customer-preview-quote]");
  if (previewCard && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    if (previewCard.dataset.openCustomerPreviewInvoice) {
      previewDocument("invoice", previewCard.dataset.openCustomerPreviewInvoice, "customer");
      return;
    }
    if (previewCard.dataset.openCustomerPreviewQuote) {
      previewDocument("quote", previewCard.dataset.openCustomerPreviewQuote, "customer");
      return;
    }
  }
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
  if (event.target.closest("#line-editor-rows") || event.target.id === "taxRate" || event.target.id === "shippingCost") updateEditorTotal(event.target);
});

document.addEventListener("change", event => {
  if (event.target.dataset?.ticket365License) {
    updateTicketM365License(event.target.dataset.ticket365License, event.target.value);
    return;
  }
  if (["ticket-detail-status", "ticket-detail-type", "ticket-detail-form", "ticket-detail-assignee"].includes(event.target.id)) {
    if (selectedTicketId) saveTicketUpdate(selectedTicketId, { comment: "" });
    return;
  }
  if (event.target.id === "clientId") {
    const address = document.querySelector(".invoice-edit-address");
    const shipTo = document.getElementById("shipTo");
    const client = clientById(event.target.value);
    if (address) address.innerHTML = lines(client?.billTo || client?.name || "Select a client");
    if (shipTo && !shipTo.value.trim()) shipTo.value = client?.billTo || client?.name || "";
    const ninjaOrg = document.getElementById("ninjaOneOrgId");
    if (ninjaOrg) {
      ninjaOrg.innerHTML = ninjaOneOrganizationOptions(ninjaOrg.value, event.target.value);
      if (!ninjaOrg.value && client?.ninjaOneOrgId) ninjaOrg.value = String(client.ninjaOneOrgId);
      loadNinjaOneContacts(ninjaOrg.value);
    }
  }
  if (event.target.id === "ninjaOneOrgId") {
    const requesterSelect = document.getElementById("requesterUid");
    if (requesterSelect) {
      requesterSelect.value = "";
      requesterSelect.innerHTML = ninjaOneContactOptions("", event.target.value);
    }
    loadNinjaOneContacts(event.target.value);
  }
  if (event.target.id === "requesterUid") {
    const contact = ninjaOneContactByUid(event.target.value);
    if (contact) {
      const firstName = document.getElementById("requesterFirstName");
      const lastName = document.getElementById("requesterLastName");
      const email = document.getElementById("requesterEmail");
      const phone = document.getElementById("requesterPhone");
      if (firstName) firstName.value = contact.firstName || "";
      if (lastName) lastName.value = contact.lastName || "";
      if (email) email.value = contact.email || "";
      if (phone) phone.value = contact.phone || "";
    }
  }
  if (event.target.id === "audit-client") {
    selectedClientId = event.target.value;
    renderAudit365();
    renderClients();
  }
  if (event.target.closest("#line-editor-rows") || event.target.id === "taxRate" || event.target.id === "shippingCost") updateEditorTotal(event.target);
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

["invoice-filter", "invoice-client-filter", "invoice-date-from", "invoice-date-to"].forEach(idValue => {
  document.getElementById(idValue).addEventListener("change", renderInvoices);
});
document.getElementById("ticket-filter")?.addEventListener("change", () => {
  renderTickets();
  requestNinjaOneTicketSync();
});
document.getElementById("sync-tickets")?.addEventListener("click", requestNinjaOneTicketSync);
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
loadNinjaOneOrganizations();
loadNinjaOneContacts();
startNinjaOneLiveSync();
