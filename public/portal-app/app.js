const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const costMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();
const portalBuild = "portal-20260722-219";
const portalIsLocalHost = ["localhost", "127.0.0.1", ""].includes(location.hostname);
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
      id: "client_cory_beck",
      name: "Cory Beck / The 19th Hole",
      billTo: "Cory Beck\nThe 19th Hole\n757 Caber Drive\nLincoln, CA\ncory@gsvisions.co",
      email: "cory@gsvisions.co",
      phone: "",
      terms: "Internal",
      status: "active",
      m365TenantKey: "",
      pax8CompanyId: "",
      ninjaOneOrgId: 0,
      userAutomationEnabled: false,
      approvedRequesterEmails: "",
      defaultM365License: "",
      licenseRequestAliases: [],
      licenseAuditBilling: false,
      mspRates: { fullUser: 0, lightUser: 0, serviceAccount: 0, copilot: 0 },
      ninjaOnePricing: [],
      internalCosts: [],
      networkAtlasPath: "/portal/network-atlas/the-19th-hole/snapshot/2026-07-18T20-45-00Z",
      networkSnapshots: [
        {
          id: "2026-06-01T16-00-00Z",
          capturedAt: "2026-06-01T09:00:00-07:00",
          label: "As-built baseline",
          status: "baseline",
          changeSummary: "Initial documented network state before Wi-Fi tuning and retained config capture.",
          atlasPath: "/portal/network-atlas/the-19th-hole/snapshot/2026-06-01T16-00-00Z",
          configPath: "",
          details: {
            metrics: [
              ["Gateway", "UDM-SE", "UniFi Network 10.4.55"],
              ["Internet", "2.5 GbE", "Fidium primary - Starlink standby"],
              ["Access Points", "4", "Mixed automatic radio plan"],
              ["Clients", "73", "Initial as-built count"],
              ["Core Links", "10 GbE", "Switch uplink and NAS"],
            ],
            wifiPlan: [
              { name: "Garage", port: 17, clients: 8, uplink: "2.5 GbE", radios: [["2.4", "Auto", "20 MHz", "Auto", 61], ["5", "Auto", "80 MHz", "Auto", 42], ["6", "Auto", "160 MHz", "Auto", 4]] },
              { name: "Upstairs", port: 18, clients: 22, uplink: "2.5 GbE", radios: [["2.4", "Auto", "20 MHz", "Auto", 74], ["5", "Auto", "80 MHz", "Auto", 51], ["6", "Auto", "160 MHz", "Auto", 8]] },
              { name: "Patio", port: 19, clients: 6, uplink: "2.5 GbE", radios: [["2.4", "Auto", "20 MHz", "Auto", 68], ["5", "Auto", "80 MHz", "Auto", 29], ["6", "Auto", "160 MHz", "Auto", 2]] },
              { name: "Kitchen", port: 20, clients: 18, uplink: "2.5 GbE", radios: [["2.4", "Auto", "20 MHz", "Auto", 72], ["5", "Auto", "80 MHz", "Auto", 36], ["6", "Auto", "160 MHz", "Auto", 5]] },
            ],
            runbook: [
              ["Internet outage", "Check Fidium WAN 1 on UDM port 9 and Starlink WAN 2 on UDM port 8. Confirm both WAN links before changing failover policy."],
              ["Spotty WiFi", "Initial capture used automatic channels and power. Use this snapshot as the before state when comparing post-tuning changes."],
              ["IoT onboarding", "Use The 19th Hole IoT SSID and confirm VLAN 3 addressing before documenting exceptions."],
              ["Sonos rooms", "Confirm wired Sonos rooms before moving AP channels or changing SonosNet design."],
              ["Home Assistant", "Verify Synology at 192.168.1.10 and confirm IoT access rule before tightening segmentation."],
            ],
          }
        },
        {
          id: "2026-07-18T20-45-00Z",
          capturedAt: "2026-07-18T13:45:00-07:00",
          label: "Post-tuning baseline",
          status: "current",
          changeSummary: "Manual Wi-Fi channel and transmit-power tuning after initial as-built capture.",
          atlasPath: "/portal/network-atlas/the-19th-hole/snapshot/2026-07-18T20-45-00Z",
          configPath: "/portal/network-atlas/the-19th-hole/config/2026-07-18T20-45-00Z"
        }
      ],
      notes: "Residential managed network and smart-home infrastructure."
    },
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
      networkLocations: [
        { id: "loc_rocklin_hq", name: "Rocklin Headquarters", address: "4170 Citrus Ave.\nRocklin, CA 95677", hostId: "D8B3704F2253000000000783E57F000000000847F46F00000000657B40AD:2116178472", siteId: "default", hostEnvKey: "UNIFI_NETWORK_MOXIE_MAIN_OFFICE_HOST_ID", siteEnvKey: "UNIFI_NETWORK_MOXIE_SITE", envPrefix: "UNIFI_NETWORK_MOXIE" },
        { id: "loc_fulfillment", name: "Fulfillment Location (Planned)", address: "Address to be confirmed", hostId: "", siteId: "" }
      ],
      networkLinks: [
        { id: "link_rocklin_fulfillment", fromLocationId: "loc_rocklin_hq", toLocationId: "loc_fulfillment", type: "SD-WAN", status: "active", provider: "UniFi Site Magic", routedNetworksByLocation: { loc_rocklin_hq: ["Data VLAN1 (192.168.1.0/24)"], loc_fulfillment: ["Default (192.168.4.0/24)"] } }
      ],
      topologyEndpointLocations: [
        { endpointPattern: "michael kelley phone", locationPattern: "fulfillment", connectionType: "SD-WAN" }
      ],
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
  m365Requests: [],
  clientDashboardDismissals: {},
  vaultDocuments: []
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
let selectedClientDashboardTab = "dashboard";
let selectedNetworkAtlasClientId = "";
let selectedNetworkLocationId = "";
let selectedNetworkSnapshotId = "";
let selectedNetworkAtlasTab = "overview";
let selectedNetworkActionTab = "general";
let selectedNetworkAuditView = "risk";
let selectedNetworkRunbookKey = "internet";
let selectedVaultFolder = "Backups";
let selectedTicketId = "";
let selectedTicketResponseMode = "public";
let editingTicketM365RequestId = "";
let resolvingTicketId = "";
const pax8LicensePulls = new Set();
const pax8LicensePullAttempted = new Set();
const networkSnapshotPulls = new Set();
const networkSnapshotPullJobs = new Map();
const networkReportPulls = new Set();
const networkTopologyPulls = new Set();
const clientSnapshotBackupFileSyncs = new Set();
const networkSiteSyncAttempted = new Set();

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
        for (const field of ["m365TenantKey", "pax8CompanyId", "ninjaOneOrgId", "licenseAuditBilling", "internalCosts", "ninjaOnePricing", "ccEmail", "billingClientId", "userAutomationEnabled", "approvedRequesterEmails", "defaultM365License", "licenseRequestAliases", "networkAtlasPath", "networkLocations", "networkLinks", "networkSnapshots", "topologyEndpointLocations"]) {
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
      if (!Array.isArray(existing.networkLocations)) existing.networkLocations = [];
      const blankFallbackIndex = existing.networkLocations.findIndex(location =>
        location.id === "default" &&
        /primary location/i.test(location.name || "") &&
        !networkLocationAddress(location) &&
        !location.hostId &&
        !location.siteId
      );
      if (blankFallbackIndex >= 0) {
        existing.networkLocations.splice(blankFallbackIndex, 1);
        changed = true;
      }
      if (!existing.networkLocations.some(location => location.id === "loc_rocklin_hq" || /main office|rocklin/i.test(location.name || ""))) {
        const configuredMainOffice = record.networkLocations?.find(location => location.id === "loc_rocklin_hq");
        if (configuredMainOffice) {
          existing.networkLocations.unshift(structuredClone(configuredMainOffice));
          changed = true;
        }
      }
      const requiredAliases = defaultData.clients.find(client => client.id === "client_moxie")?.licenseRequestAliases || [];
      if (!Array.isArray(existing.licenseRequestAliases)) existing.licenseRequestAliases = [];
      requiredAliases.forEach(alias => {
        const exists = existing.licenseRequestAliases.some(row => normalizedLicensePhrase(row.phrase) === normalizedLicensePhrase(alias.phrase));
        if (!exists) {
          existing.licenseRequestAliases.push(structuredClone(alias));
          changed = true;
        }
      });
      const mainOffice = Array.isArray(existing.networkLocations)
        ? existing.networkLocations.find(location => location.id === "loc_rocklin_hq" || /main office|rocklin/i.test(location.name || ""))
        : null;
      if (mainOffice && !mainOffice.envPrefix) {
        mainOffice.envPrefix = "UNIFI_NETWORK_MOXIE";
        changed = true;
      }
      if (mainOffice && !mainOffice.hostId) {
        mainOffice.hostId = "D8B3704F2253000000000783E57F000000000847F46F00000000657B40AD:2116178472";
        changed = true;
      }
      if (mainOffice && !mainOffice.siteId) {
        mainOffice.siteId = "default";
        changed = true;
      }
      if (mainOffice && (!mainOffice.hostEnvKey || mainOffice.hostEnvKey === "UNIFI_NETWORK_MOXIE_HOST_ID")) {
        mainOffice.hostEnvKey = "UNIFI_NETWORK_MOXIE_MAIN_OFFICE_HOST_ID";
        changed = true;
      }
      if (mainOffice && !mainOffice.siteEnvKey) {
        mainOffice.siteEnvKey = "UNIFI_NETWORK_MOXIE_SITE";
        changed = true;
      }
      const moxieLocationsById = new Map(existing.networkLocations.map(location => [location.id, location]));
      const fulfillmentLink = Array.isArray(existing.networkLinks)
        ? existing.networkLinks.find(link => {
            const linkedLocations = [link.fromLocationId, link.toLocationId].map(id => moxieLocationsById.get(id));
            return linkedLocations.some(location => /main office|headquarters|rocklin/i.test(`${location?.name || ""} ${location?.id || ""}`)) &&
              linkedLocations.some(location => /fulfillment/i.test(`${location?.name || ""} ${location?.id || ""}`));
          })
        : null;
      if (fulfillmentLink) {
        const fulfillmentLocation = [fulfillmentLink.fromLocationId, fulfillmentLink.toLocationId]
          .map(id => moxieLocationsById.get(id))
          .find(location => /fulfillment/i.test(`${location?.name || ""} ${location?.id || ""}`));
        fulfillmentLink.routedNetworks = [];
        fulfillmentLink.routedNetworksByLocation = {
          [mainOffice?.id || "loc_rocklin_hq"]: ["Data VLAN1 (192.168.1.0/24)"],
          [fulfillmentLocation?.id || "loc_fulfillment"]: ["Default (192.168.4.0/24)"],
        };
        changed = true;
      }
    }
    if (Array.isArray(record.networkSnapshots)) {
      if (!Array.isArray(existing.networkSnapshots)) existing.networkSnapshots = [];
      record.networkSnapshots.forEach(snapshot => {
        const existingSnapshot = existing.networkSnapshots.find(row => row.id === snapshot.id);
        if (!existingSnapshot) {
          existing.networkSnapshots.push(structuredClone(snapshot));
          changed = true;
          return;
        }
        for (const field of ["label", "status", "changeSummary", "atlasPath", "configPath", "details"]) {
          if (existingSnapshot[field] === undefined && snapshot[field] !== undefined) {
            existingSnapshot[field] = structuredClone(snapshot[field]);
            changed = true;
          }
        }
      });
      const uniqueSnapshots = [];
      const seenSnapshotIds = new Set();
      existing.networkSnapshots.forEach(snapshot => {
        const snapshotKey = snapshot.id || snapshot.capturedAt || snapshot.atlasPath;
        if (!snapshotKey || seenSnapshotIds.has(snapshotKey)) {
          changed = true;
          return;
        }
        seenSnapshotIds.add(snapshotKey);
        uniqueSnapshots.push(snapshot);
      });
      existing.networkSnapshots = uniqueSnapshots;
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
  if (!state.clientDashboardDismissals || typeof state.clientDashboardDismissals !== "object" || Array.isArray(state.clientDashboardDismissals)) {
    state.clientDashboardDismissals = {};
    changed = true;
  }
  if (!Array.isArray(state.vaultDocuments)) {
    state.vaultDocuments = [];
    changed = true;
  }
  if (cleanupObsoleteGeneratedVaultArtifacts()) {
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

function cleanupObsoleteGeneratedVaultArtifacts() {
  if (!Array.isArray(state.vaultDocuments)) return false;
  let changed = false;
  const now = new Date().toISOString();
  state.vaultDocuments.forEach(document => {
    if (document.deletedAt) return;
    if (!isObsoleteGeneratedVaultDocument(document)) return;
    document.deletedAt = now;
    document.deletedReason = isObsoleteGeneratedHtmlReport(document) ? "obsolete-html-report" : "obsolete-markdown-runbook";
    changed = true;
  });
  return changed;
}

function isObsoleteGeneratedHtmlReport(document = {}) {
  const filename = String(document.filename || "");
  const reportKind = String(document.reportKind || "");
  const source = String(document.source || "");
  return (
    document.category === "Reports" &&
    (
      reportKind === "network-visual-report" ||
      reportKind === "network-pdf-summary" ||
      (source === "network-snapshot-report" && /\.html?$/i.test(filename))
    )
  );
}

function isObsoleteGeneratedMarkdownRunbook(document = {}) {
  const filename = String(document.filename || "");
  const artifactKind = String(document.artifactKind || "");
  const source = String(document.source || "");
  return (
    document.category === "Runbooks" &&
    (
      artifactKind === "network-runbook-markdown" ||
      (source === "network-snapshot-artifact" && /\.md$/i.test(filename))
    )
  );
}

function isObsoleteGeneratedVaultDocument(document = {}) {
  return isObsoleteGeneratedHtmlReport(document) || isObsoleteGeneratedMarkdownRunbook(document);
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

function clientQuotes(clientId) {
  return state.quotes.filter(quote => quote.clientId === clientId);
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

const portalLocationStorageKey = "gsvPortalLocation";
const portalRestorableViews = new Set(["dashboard", "tickets", "ticket-detail", "clients", "client-dashboard", "network-atlas", "vault", "audit365", "invoices", "quotes", "payments", "exports"]);
const networkRunbookKeys = ["internet", "wifi", "iot", "sonos", "homeassistant"];

function currentPortalLocationState() {
  return {
    view: activeView,
    clientId: selectedClientId,
    clientTab: selectedClientDashboardTab,
    networkClientId: selectedNetworkAtlasClientId,
    networkLocationId: selectedNetworkLocationId,
    networkSnapshotId: selectedNetworkSnapshotId,
    networkTab: selectedNetworkAtlasTab,
    runbookKey: selectedNetworkRunbookKey,
    ticketId: selectedTicketId,
  };
}

function portalStateFromHash() {
  const rawHash = location.hash || "";
  if (!rawHash.startsWith("#portal")) return null;
  const query = rawHash.startsWith("#portal?") ? rawHash.slice("#portal?".length) : rawHash.slice("#portal".length).replace(/^&/, "");
  const params = new URLSearchParams(query);
  return {
    view: params.get("view") || "",
    clientId: params.get("client") || "",
    clientTab: params.get("clientTab") || "",
    networkClientId: params.get("networkClient") || "",
    networkLocationId: params.get("location") || "",
    networkSnapshotId: params.get("snapshot") || "",
    networkTab: params.get("tab") || "",
    runbookKey: params.get("runbook") || "",
    ticketId: params.get("ticket") || "",
  };
}

function normalizePortalLocationState(saved = {}) {
  const view = portalRestorableViews.has(saved.view) ? saved.view : "dashboard";
  const clientId = saved.clientId && clientById(saved.clientId) ? saved.clientId : "";
  const clientTab = ["dashboard", "details", "users", "network", "files", "invoices", "quotes"].includes(saved.clientTab) ? saved.clientTab : "dashboard";
  const networkClientId = saved.networkClientId && clientById(saved.networkClientId) ? saved.networkClientId : clientId;
  const networkLocationId = saved.networkLocationId || "";
  const networkSnapshotId = saved.networkSnapshotId || "";
  const requestedNetworkTab = saved.networkTab === "action" ? "audit" : saved.networkTab;
  const networkTab = ["overview", "topology", "ports", "clients", "wifi", "security", "audit", "notes", "runbook"].includes(requestedNetworkTab) ? requestedNetworkTab : "overview";
  const runbookKey = networkRunbookKeys.includes(saved.runbookKey) ? saved.runbookKey : "internet";
  const ticketId = saved.ticketId && state.tickets.some(ticket => ticket.id === saved.ticketId) ? saved.ticketId : "";
  return {
    view: view === "client-dashboard" && !clientId ? "clients" : view === "network-atlas" && !networkClientId ? "clients" : view === "ticket-detail" && !ticketId ? "tickets" : view,
    clientId,
    clientTab,
    networkClientId,
    networkLocationId,
    networkSnapshotId,
    networkTab,
    runbookKey,
    ticketId,
  };
}

function readStoredPortalLocationState() {
  try {
    return JSON.parse(localStorage.getItem(portalLocationStorageKey) || "null");
  } catch {
    return null;
  }
}

function applyPortalLocationState(saved = {}) {
  const next = normalizePortalLocationState(saved);
  activeView = next.view;
  selectedClientId = next.clientId;
  selectedClientDashboardTab = next.clientTab;
  selectedNetworkAtlasClientId = next.networkClientId;
  selectedNetworkLocationId = next.networkLocationId;
  selectedNetworkSnapshotId = next.networkSnapshotId;
  selectedNetworkAtlasTab = next.networkTab;
  selectedNetworkRunbookKey = next.runbookKey;
  selectedTicketId = next.ticketId;
  return next.view;
}

function restorePortalLocationState() {
  const restored = portalStateFromHash() || readStoredPortalLocationState();
  if (!restored) return "dashboard";
  return applyPortalLocationState(restored);
}

function restorePortalLocationStateFromEvent(event) {
  const stateFromHistory = event?.state?.portalState;
  if (stateFromHistory) return applyPortalLocationState(stateFromHistory);
  return restorePortalLocationState();
}

function portalLocationUrl(saved = currentPortalLocationState()) {
  const params = new URLSearchParams();
  params.set("view", saved.view || "dashboard");
  if (saved.clientId) params.set("client", saved.clientId);
  if (saved.clientTab && saved.clientTab !== "dashboard") params.set("clientTab", saved.clientTab);
  if (saved.networkClientId) params.set("networkClient", saved.networkClientId);
  if (saved.networkLocationId) params.set("location", saved.networkLocationId);
  if (saved.networkSnapshotId) params.set("snapshot", saved.networkSnapshotId);
  if (saved.networkTab && saved.networkTab !== "overview") params.set("tab", saved.networkTab);
  if (saved.runbookKey && saved.runbookKey !== "internet") params.set("runbook", saved.runbookKey);
  if (saved.ticketId) params.set("ticket", saved.ticketId);
  return `${location.pathname}${location.search}#portal?${params.toString()}`;
}

function persistPortalLocationState(options = {}) {
  const saved = currentPortalLocationState();
  localStorage.setItem(portalLocationStorageKey, JSON.stringify(saved));
  const nextUrl = portalLocationUrl(saved);
  if (`${location.pathname}${location.search}${location.hash}` !== nextUrl) {
    const method = options.history === "push" ? "pushState" : "replaceState";
    history[method]({ portalState: saved }, "", nextUrl);
  } else if (!history.state?.portalState) {
    history.replaceState({ portalState: saved }, "", nextUrl);
  }
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

function setView(view, options = {}) {
  activeView = portalRestorableViews.has(view) ? view : "dashboard";
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === activeView));
  document.querySelectorAll(".nav-link, .nav-sub-link").forEach(el => {
    const navView = el.dataset.view;
    el.classList.toggle("active", navView === activeView || (["client-dashboard", "network-atlas"].includes(activeView) && navView === "clients"));
  });
  updateNavGroups(activeView);
  document.getElementById("view-title").textContent = {
    dashboard: "Dashboard",
    tickets: "Support Tickets",
    "ticket-detail": "Support Ticket",
    clients: "Clients",
    "client-dashboard": clientById(selectedClientId)?.name || "Client Dashboard",
    "network-atlas": `${clientById(selectedNetworkAtlasClientId || selectedClientId)?.name || "Client"} Network Atlas`,
    vault: "Client Vault",
    audit365: "Services Audit",
    invoices: "Invoices",
    quotes: "Quotes",
    payments: "Payments",
    exports: "Year-End Export"
  }[activeView] || "Dashboard";
  render();
  if (options.persist !== false) persistPortalLocationState({ history: options.history || "push" });
  if (["dashboard", "tickets", "ticket-detail"].includes(activeView)) requestNinjaOneTicketSync();
}

function updateNavGroups(view = activeView) {
  document.querySelectorAll("[data-nav-group]").forEach(group => {
    const name = group.dataset.navGroup;
    const shouldExpand =
      (name === "ticketing" && ["tickets", "ticket-detail"].includes(view)) ||
      (name === "billing" && ["invoices", "quotes", "payments", "exports"].includes(view));
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
  renderClientDashboard();
  renderNetworkAtlas();
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
  const newInvoices = state.invoices.filter(inv => invoiceMatchesQueue(inv, "new")).length;
  const sentInvoices = state.invoices.filter(inv => invoiceMatchesQueue(inv, "sent")).length;
  const paymentDueInvoices = state.invoices.filter(inv => invoiceMatchesQueue(inv, "payment_due")).length;
  const paidInvoices = state.invoices.filter(inv => invoiceMatchesQueue(inv, "paid")).length;
  const draftQuotes = state.quotes.filter(quote => quote.status === "draft").length;
  setText("nav-billing-total", openInvoices || "");
  setText("nav-invoice-action", openInvoices || "");
  setText("nav-invoice-new", newInvoices);
  setText("nav-invoice-sent", sentInvoices);
  setText("nav-invoice-due", paymentDueInvoices);
  setText("nav-invoice-paid", paidInvoices);
  setText("nav-invoice-all", state.invoices.length);
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

function restorePortalNavigationFromLocation(event) {
  if (handleTicketM365HashAction()) return;
  if (!location.hash.startsWith("#portal") && !event?.state?.portalState) return;
  restorePortalLocationStateFromEvent(event);
  setView(activeView, { persist: false });
}

window.addEventListener("hashchange", restorePortalNavigationFromLocation);
window.addEventListener("popstate", restorePortalNavigationFromLocation);

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
  const balance = invoiceRemainingBalance(inv);
  return !["paid", "void"].includes(status) && balance > 0.005;
}

function invoiceRemainingBalance(inv) {
  return invoiceTotal(inv) - paidAmount(inv.id);
}

function invoiceMatchesQueue(inv, queue) {
  const status = computedInvoiceStatus(inv);
  if (queue === "all") return true;
  if (queue === "new") return inv.date >= addDays(today, -30) && !["paid", "void"].includes(status);
  if (queue === "payment_due") return ["sent", "overdue"].includes(status) && invoiceRemainingBalance(inv) > 0.005;
  return status === queue;
}

function invoiceQueueSummary(queue) {
  const invoices = state.invoices.filter(inv => queue === "paid_ytd" ? invoicePaidThisYear(inv) : invoiceMatchesQueue(inv, queue));
  const total = invoices.reduce((sum, inv) => {
    if (queue === "paid" || queue === "paid_ytd") return sum + invoiceTotal(inv);
    return sum + Math.max(0, invoiceRemainingBalance(inv));
  }, 0);
  return { invoices, total };
}

function invoicePaidThisYear(inv) {
  if (computedInvoiceStatus(inv) !== "paid") return false;
  const currentYear = String(year);
  const invoiceDateIsThisYear = String(inv.date || "").startsWith(currentYear);
  const paymentDateIsThisYear = state.payments.some(payment =>
    payment.invoiceId === inv.id && String(payment.date || "").startsWith(currentYear)
  );
  return invoiceDateIsThisYear || paymentDateIsThisYear;
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
  const list = document.getElementById("client-list");
  if (!list) return;
  const search = document.getElementById("client-search");
  const query = String(search?.value || "").trim().toLowerCase();
  const visibleClients = state.clients.filter(client => {
    const locations = clientNetworkLocations(client);
    const searchable = [
      client.name,
      client.serviceAddress,
      ...locations.flatMap(location => [location.name, networkLocationAddress(location)])
    ].filter(Boolean).join(" ").toLowerCase();
    return !query || searchable.includes(query);
  });
  const count = document.getElementById("client-search-count");
  if (count) count.textContent = query
    ? `${visibleClients.length} of ${state.clients.length} clients`
    : `${state.clients.length} client${state.clients.length === 1 ? "" : "s"}`;
  list.innerHTML = visibleClients.map(client => {
    const invoices = clientInvoices(client.id);
    const openInvoiceCount = invoices.filter(invoice => !["paid", "void"].includes(computedInvoiceStatus(invoice))).length;
    const openTicketCount = state.tickets.filter(ticket => ticket.clientId === client.id && !["resolved", "deleted"].includes(ticket.status)).length;
    const locations = clientNetworkLocations(client);
    const networkLocations = locations.filter(location => networkSnapshotsForClient(client, location.id).length > 0);
    const networkLocationCount = networkLocations.length || (client.networkAtlasPath ? 1 : 0);
    const locationCount = locations.length;
    const locationSummary = locations
      .map(location => location.name === "Primary location" ? "" : location.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(" · ") || `${locationCount} location${locationCount === 1 ? "" : "s"}`;
    const initials = client.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    return `
      <article class="item client-card ${selectedClientId === client.id ? "selected" : ""}" data-client-dashboard-card="${client.id}">
        <div class="client-card-accent" aria-hidden="true"></div>
        <div class="client-card-body">
        <div class="client-card-title">
          <span class="client-card-avatar" aria-hidden="true">${escapeHtml(initials)}</span>
          <div class="client-card-heading">
            <strong>${escapeHtml(client.name)}</strong>
            <span class="client-card-location">${escapeHtml(locationSummary)}</span>
            ${networkLocationCount ? `<span class="client-network-online"><i aria-hidden="true"></i>${networkLocationCount === 1 ? "Site online" : `${networkLocationCount} sites online`}</span>` : ""}
          </div>
          <button type="button" class="drag-handle client-card-drag" draggable="true" data-client-card-drag="${client.id}" aria-label="Drag to reorder ${escapeHtml(client.name)}">☰</button>
        </div>
        <div class="client-card-metrics">
          <div><strong>${locationCount}</strong><span>${locationCount === 1 ? "Site" : "Sites"}</span></div>
          <div><strong>${openTicketCount}</strong><span>Open ${openTicketCount === 1 ? "ticket" : "tickets"}</span></div>
          <div><strong>${openInvoiceCount}</strong><span>Open ${openInvoiceCount === 1 ? "invoice" : "invoices"}</span></div>
        </div>
        </div>
        <div class="client-card-footer">
          <button type="button" data-open-client-vault="${escapeHtml(client.id)}">Open Client Vault <b aria-hidden="true">↗</b></button>
        </div>
      </article>
    `;
  }).join("");
  if (!visibleClients.length) list.innerHTML = `<div class="client-search-empty">No clients match “${escapeHtml(search?.value || "")}”.</div>`;
}

function openClientDashboard(clientId, tab = selectedClientDashboardTab || "dashboard") {
  const client = clientById(clientId);
  if (!client) return;
  selectedClientId = client.id;
  selectedClientDashboardTab = ["dashboard", "details", "users", "network", "files", "invoices", "quotes"].includes(tab) ? tab : "dashboard";
  setView("client-dashboard");
}

function renderClientDashboard({ syncSites = true } = {}) {
  const container = document.getElementById("client-dashboard-content");
  if (!container) return;
  const activeClient = clientById(selectedClientId);
  if (!activeClient) {
    container.innerHTML = `
      <section class="client-dashboard-empty">
        <div class="empty-cell">Select a client to open its dashboard.</div>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    ${clientDetailDashboard(activeClient)}
  `;
  if (syncSites) syncNetworkSitesFromServer(activeClient.id);
  if (selectedClientDashboardTab === "files") {
    (async () => {
      if (vaultStorageMode === "checking" || !remoteVaultDocuments.has(activeClient.id)) {
        await refreshClientVaultDocuments(activeClient.id);
      }
      await ensureClientSnapshotFiles(activeClient.id);
    })().catch(error => console.warn("Snapshot file repair failed", error));
  }
}

function renderNetworkSelectionWithoutJump() {
  const scrollTop = window.scrollY;
  if (activeView === "client-dashboard") renderClientDashboard({ syncSites: false });
  else renderNetworkAtlas();
  window.scrollTo(0, scrollTop);
  window.requestAnimationFrame(() => window.scrollTo(0, scrollTop));
}

function openNetworkAtlas(clientId = selectedClientId, tab = "overview", snapshotId = selectedNetworkSnapshotId) {
  const client = clientById(clientId);
  if (!client) return;
  selectedClientId = client.id;
  selectedNetworkAtlasClientId = client.id;
  selectedNetworkLocationId = selectedNetworkLocationForClient(client, selectedNetworkLocationId)?.id || "";
  selectedNetworkAtlasTab = tab || "overview";
  selectedNetworkSnapshotId = snapshotId || selectedNetworkSnapshotForClient(client)?.id || "";
  setView("network-atlas");
}

function clientNetworkLocations(client) {
  const configured = Array.isArray(client?.networkLocations) ? client.networkLocations.filter(location => location?.id && location?.name) : [];
  if (configured.length) {
    const groups = new Map();
    configured.forEach(location => groups.set(location.id, [...(groups.get(location.id) || []), location]));
    let repaired = false;
    groups.forEach(group => {
      if (group.length <= 1) return;
      const canonical = group.find(location => location.hostId && location.siteId) || group.find(location => /main office|headquarters|primary/i.test(location.name)) || group[0];
      group.forEach(location => {
        if (location === canonical) return;
        const oldId = location.id;
        location.id = stableNetworkLocationId(location, configured);
        (Array.isArray(client.networkSnapshots) ? client.networkSnapshots : []).forEach(snapshot => {
          if (snapshotNetworkLocationId(snapshot) !== oldId) return;
          const snapshotName = String(snapshot.locationName || snapshot?.details?.locationName || "").toLowerCase();
          if (snapshotName && snapshotName !== String(location.name || "").toLowerCase()) return;
          snapshot.locationId = location.id;
          if (snapshot.details && typeof snapshot.details === "object") snapshot.details.locationId = location.id;
        });
        repaired = true;
      });
    });
    configured.sort((left, right) => Number(left.sortOrder ?? 0) - Number(right.sortOrder ?? 0));
    if (repaired) saveState();
    return configured;
  }
  return [{
    id: "default",
    name: "Primary location",
    address: client?.serviceAddress || "",
    hostId: client?.networkSource?.hostId || "",
    siteId: client?.networkSource?.siteId || "",
  }];
}

function selectedNetworkLocationForClient(client, locationId = selectedNetworkLocationId) {
  const locations = clientNetworkLocations(client);
  return locations.find(location => location.id === locationId) || locations[0] || null;
}

function defaultNetworkLocationEnvPrefix(client, location = {}) {
  if (location.envPrefix) return location.envPrefix;
  const clientText = `${client?.id || ""} ${client?.name || ""}`.toLowerCase();
  const locationText = `${location.id || ""} ${location.name || ""}`.toLowerCase();
  if (clientText.includes("moxie") && /loc_rocklin_hq|main office|rocklin headquarters/.test(locationText)) return "UNIFI_NETWORK_MOXIE";
  if ((clientText.includes("nyssco") || clientText.includes("new york style sausage")) && /main|primary|default/.test(locationText)) return "UNIFI_NETWORK_NYSS_MAIN";
  return "";
}

function networkSiteIdentityMatch(left = {}, right = {}) {
  const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const leftAddress = normalize([left.streetAddress || left.address, left.addressLine2, left.city, left.region, left.postalCode].filter(Boolean).join(" "));
  const rightAddress = normalize([right.streetAddress || right.address, right.addressLine2, right.city, right.region, right.postalCode].filter(Boolean).join(" "));
  const leftHost = String(left.hostId || "").trim();
  const rightHost = String(right.hostId || "").trim();
  const leftSite = String(left.siteId || "").trim();
  const rightSite = String(right.siteId || "").trim();
  if (leftAddress && rightAddress) return leftAddress === rightAddress;
  return Boolean(leftHost && rightHost && leftHost === rightHost && (!leftSite || !rightSite || leftSite === rightSite));
}

function stableNetworkLocationId(location, locations = []) {
  const base = `loc_${String(location?.name || "site").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "site"}`;
  let id = base;
  let suffix = 2;
  const used = new Set(locations.map(item => item?.id).filter(Boolean));
  while (used.has(id)) id = `${base}_${suffix++}`;
  return id;
}

function migrateNetworkLocationIdentity(client, oldIds, canonicalId, canonicalName) {
  const ids = new Set(oldIds.filter(Boolean));
  (Array.isArray(client.networkSnapshots) ? client.networkSnapshots : []).forEach(snapshot => {
    if (!ids.has(snapshotNetworkLocationId(snapshot))) return;
    snapshot.locationId = canonicalId;
    snapshot.locationName = canonicalName;
    if (snapshot.details && typeof snapshot.details === "object") {
      snapshot.details.locationId = canonicalId;
      snapshot.details.locationName = canonicalName;
    }
  });
  (Array.isArray(state.vaultDocuments) ? state.vaultDocuments : []).forEach(document => {
    if (document.clientId !== client.id || !ids.has(document.locationId)) return;
    document.locationId = canonicalId;
    document.locationName = canonicalName;
  });
  if (ids.has(selectedNetworkLocationId)) selectedNetworkLocationId = canonicalId;
}

async function syncNetworkSitesFromServer(clientId) {
  const client = clientById(clientId);
  if (!client || networkSiteSyncAttempted.has(client.id)) return;
  networkSiteSyncAttempted.add(client.id);
  try {
    const response = await fetch(`/api/network-sites?clientId=${encodeURIComponent(client.id)}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json().catch(() => ({}));
    if (!Array.isArray(data.sites)) return;
    if (!data.sites.length) {
      for (const location of clientNetworkLocations(client)) {
        location.envPrefix = defaultNetworkLocationEnvPrefix(client, location);
        await syncNetworkSiteToServer(client, location);
      }
      return;
    }
    if (!Array.isArray(client.networkLocations)) client.networkLocations = [];
    const rekeyedSites = [];
    data.sites.forEach(site => {
      const duplicateIdLocations = client.networkLocations.filter(location => location.id === site.id);
      if (duplicateIdLocations.length <= 1) return;
      const canonical = duplicateIdLocations.find(location => networkSiteIdentityMatch(location, site)) || duplicateIdLocations[0];
      duplicateIdLocations.forEach(location => {
        if (location === canonical) return;
        const oldId = location.id;
        location.id = stableNetworkLocationId(location, client.networkLocations);
        (Array.isArray(client.networkSnapshots) ? client.networkSnapshots : []).forEach(snapshot => {
          if (snapshotNetworkLocationId(snapshot) !== oldId || String(snapshot.locationName || "") !== String(location.name || "")) return;
          snapshot.locationId = location.id;
          if (snapshot.details && typeof snapshot.details === "object") snapshot.details.locationId = location.id;
        });
        (Array.isArray(state.vaultDocuments) ? state.vaultDocuments : []).forEach(document => {
          if (document.clientId === client.id && document.locationId === oldId && document.locationName === location.name) document.locationId = location.id;
        });
        rekeyedSites.push(location);
      });
    });
    const sitesToRefresh = [];
    data.sites.forEach(site => {
      const exactIndex = client.networkLocations.findIndex(location => location.id === site.id);
      const identityIndex = client.networkLocations.findIndex((location, index) => index !== exactIndex && networkSiteIdentityMatch(location, site));
      if (identityIndex >= 0) {
        const localRename = client.networkLocations[identityIndex];
        const oldIds = [site.id, localRename.id];
        const reconciled = { ...site, ...localRename, id: site.id };
        // Local browser state can predate the server-backed site connection. Never let
        // empty legacy fields erase a valid connector configuration during reconciliation.
        for (const field of ["hostId", "siteId", "hostEnvKey", "siteEnvKey", "envPrefix"]) {
          if (!String(reconciled[field] || "").trim() && String(site[field] || "").trim()) reconciled[field] = site[field];
        }
        reconciled.address = networkLocationAddress(reconciled);
        client.networkLocations = client.networkLocations.filter((location, index) => index !== exactIndex && index !== identityIndex);
        client.networkLocations.push(reconciled);
        migrateNetworkLocationIdentity(client, oldIds, reconciled.id, reconciled.name);
        sitesToRefresh.push(reconciled);
      } else if (exactIndex >= 0) {
        client.networkLocations[exactIndex] = { ...client.networkLocations[exactIndex], ...site, address: networkLocationAddress(site) };
      } else {
        client.networkLocations.push({ ...site, address: networkLocationAddress(site) });
      }
    });
    client.networkLocations.sort((left, right) => Number(left.sortOrder ?? 0) - Number(right.sortOrder ?? 0));
    const normalizeLocationText = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    (Array.isArray(client.networkSnapshots) ? client.networkSnapshots : []).forEach(snapshot => {
      const snapshotName = normalizeLocationText(snapshot?.locationName || snapshot?.details?.locationName);
      const snapshotAddress = normalizeLocationText(snapshot?.locationAddress || snapshot?.details?.locationAddress);
      const matchedLocation = client.networkLocations.find(location => {
        const locationName = normalizeLocationText(location.name);
        const locationAddress = normalizeLocationText(networkLocationAddress(location));
        return Boolean((snapshotName && locationName === snapshotName) || (snapshotAddress && locationAddress === snapshotAddress));
      });
      if (!matchedLocation) return;
      snapshot.locationId = matchedLocation.id;
      snapshot.locationName = matchedLocation.name;
      if (snapshot.details && typeof snapshot.details === "object") {
        snapshot.details.locationId = matchedLocation.id;
        snapshot.details.locationName = matchedLocation.name;
      }
    });
    saveState();
    for (const site of rekeyedSites) await syncNetworkSiteToServer(client, site);
    for (const site of sitesToRefresh) await syncNetworkSiteToServer(client, site);
    if (selectedClientId === client.id) renderClientDashboard();
  } catch (error) {
    console.warn("Network site sync failed", error);
  }
}

async function syncNetworkSiteToServer(client, location) {
  try {
    const response = await fetch("/api/network-sites", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, ...location }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Site sync failed.");
    }
    const data = await response.json();
    if (data.site) Object.assign(location, data.site, { address: networkLocationAddress(data.site) });
    saveState();
    return true;
  } catch (error) {
    console.warn("Network site save sync failed", error);
    return false;
  }
}

async function persistNetworkLocationOrder(clientId, orderedIds = []) {
  const client = clientById(clientId);
  if (!client || !Array.isArray(client.networkLocations) || !orderedIds.length) return;
  const byId = new Map(client.networkLocations.map(location => [location.id, location]));
  const ordered = orderedIds.map(id => byId.get(id)).filter(Boolean);
  client.networkLocations.forEach(location => {
    if (!orderedIds.includes(location.id)) ordered.push(location);
  });
  ordered.forEach((location, index) => {
    location.sortOrder = index;
  });
  client.networkLocations = ordered;
  saveState();
  renderNetworkSelectionWithoutJump();
  const response = await fetch("/api/network-sites", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, orderedIds }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Site order could not be saved.");
  if (Array.isArray(data.sites)) {
    const serverOrder = new Map(data.sites.map(site => [site.id, Number(site.sortOrder || 0)]));
    client.networkLocations.forEach(location => {
      if (serverOrder.has(location.id)) location.sortOrder = serverOrder.get(location.id);
    });
    client.networkLocations.sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0));
    saveState();
  }
}

function finishNetworkLocationDrag(siteCard) {
  if (!siteCard || siteCard.dataset.networkLocationOrderCommitted === "true") return;
  siteCard.dataset.networkLocationOrderCommitted = "true";
  siteCard.classList.remove("dragging");
  const siteList = siteCard.closest(".network-multisite-sites");
  const clientId = siteCard.dataset.networkLocationOrderClient || "";
  const orderedIds = [...siteList.querySelectorAll(".network-multisite-site[data-network-location-order-id]")]
    .map(item => item.dataset.networkLocationOrderId)
    .filter(Boolean);
  persistNetworkLocationOrder(clientId, orderedIds).catch(error => {
    console.warn("Network site order save failed", error);
    window.alert(`The site order could not be saved: ${error.message || "Unknown error"}`);
  });
}

function snapshotNetworkLocationId(snapshot) {
  return snapshot?.locationId || "default";
}

function networkSnapshotsForClient(client, locationId = selectedNetworkLocationId) {
  const snapshots = Array.isArray(client?.networkSnapshots) ? client.networkSnapshots : [];
  const locations = clientNetworkLocations(client);
  const selectedLocation = selectedNetworkLocationForClient(client, locationId);
  const filterByLocation = locations.length > 1 || locations[0]?.id !== "default";
  const normalizeLocationText = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const selectedName = normalizeLocationText(selectedLocation?.name);
  const selectedAddress = normalizeLocationText(networkLocationAddress(selectedLocation || {}));
  const belongsToSelectedLocation = snapshot => {
    const snapshotName = normalizeLocationText(snapshot?.locationName || snapshot?.details?.locationName);
    const snapshotAddress = normalizeLocationText(snapshot?.locationAddress || snapshot?.details?.locationAddress);
    if (snapshotName && selectedName && snapshotName === selectedName) return true;
    if (snapshotAddress && selectedAddress && snapshotAddress === selectedAddress) return true;
    if (/rocklin headquarters/.test(snapshotName) && /main office/.test(selectedName) && /4170 citrus/.test(selectedAddress)) return true;
    return snapshotNetworkLocationId(snapshot) === selectedLocation?.id;
  };
  const uniqueSnapshots = [];
  const seenIds = new Set();
  snapshots.filter(snapshot => !filterByLocation || belongsToSelectedLocation(snapshot)).forEach(snapshot => {
    const snapshotKey = snapshot?.id || snapshot?.capturedAt || snapshot?.atlasPath;
    if (!snapshotKey || seenIds.has(snapshotKey)) return;
    seenIds.add(snapshotKey);
    uniqueSnapshots.push(snapshot);
  });
  const sorted = uniqueSnapshots
    .filter(snapshot => snapshot && (snapshot.id || snapshot.capturedAt || snapshot.atlasPath))
    .slice()
    .sort((a, b) => String(b.capturedAt || b.id || "").localeCompare(String(a.capturedAt || a.id || "")));
  if (sorted.length) return sorted;
  if (filterByLocation) return [];
  if (!client?.networkAtlasPath) return [];
  return [{
    id: client.networkAtlasPath,
    capturedAt: "",
    label: "Current atlas",
    status: "current",
    changeSummary: "Linked network atlas without retained snapshot metadata.",
    atlasPath: client.networkAtlasPath,
    configPath: "",
  }];
}

function selectNetworkLocation(clientId, locationId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return;
  selectedNetworkLocationId = selectedNetworkLocationForClient(client, locationId)?.id || "";
  selectedNetworkSnapshotId = networkSnapshotsForClient(client, selectedNetworkLocationId)[0]?.id || "";
  if (activeView === "client-dashboard") renderClientDashboard();
  else renderNetworkAtlas();
  persistPortalLocationState({ history: "push" });
}

function renameNetworkLocation(clientId, locationId) {
  openNetworkLocationModal(clientId, locationId);
}

function createNetworkLocation(clientId) {
  openNetworkLocationModal(clientId);
}

function networkLocationAddress(location = {}) {
  if (location.streetAddress || location.city || location.region || location.postalCode) {
    return [
      location.streetAddress,
      location.addressLine2,
      [location.city, location.region].filter(Boolean).join(", ") + (location.postalCode ? ` ${location.postalCode}` : ""),
    ].filter(Boolean).join("\n");
  }
  return location.address || "";
}

function networkLocationFormAddress(location = {}) {
  if (location.streetAddress || location.city || location.postalCode) return location;
  const lines = String(location.address || "").split(/\n/).map(line => line.trim()).filter(Boolean);
  const lastLine = lines.length > 1 ? lines.at(-1) : "";
  const match = lastLine.match(/^(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i);
  if (!match) return { ...location, streetAddress: lines.join(" ") };
  return { ...location, streetAddress: lines.slice(0, -1).join(" "), city: match[1], region: match[2].toUpperCase(), postalCode: match[3] };
}

function openNetworkLocationModal(clientId, locationId = "") {
  const client = clientById(clientId);
  if (!client) return;
  if (!Array.isArray(client.networkLocations) || !client.networkLocations.length) {
    client.networkLocations = clientNetworkLocations(client).map(location => ({ ...location }));
  }
  const location = networkLocationFormAddress(client.networkLocations.find(row => row.id === locationId) || {});
  const envPrefix = defaultNetworkLocationEnvPrefix(client, location);
  const keyClient = String(client.m365TenantKey || client.name || "CLIENT").toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  const keySite = String(location.name || "NEW_SITE").toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  const suggestedPrefix = envPrefix || `UNIFI_NETWORK_${keyClient}_${keySite}`;
  const hostEnvKey = location.hostEnvKey || `${suggestedPrefix}_HOST_ID`;
  const siteEnvKey = location.siteEnvKey || `${suggestedPrefix}_SITE`;
  document.getElementById("network-location-dialog")?.remove();
  const dialog = document.createElement("dialog");
  dialog.id = "network-location-dialog";
  dialog.className = "network-location-dialog";
  dialog.innerHTML = `
    <form id="network-location-form">
      <div class="modal-head"><div><p class="eyebrow">${location.id ? "Edit site" : "New site"}</p><h2>${location.id ? escapeHtml(location.name) : "Add Client Site"}</h2></div><button type="button" data-network-location-modal-close aria-label="Close">×</button></div>
      <input type="hidden" name="clientId" value="${escapeHtml(client.id)}">
      <input type="hidden" name="locationId" value="${escapeHtml(location.id || "")}">
      <input type="hidden" name="envPrefix" value="${escapeHtml(envPrefix)}">
      <input type="hidden" name="previousHostEnvKey" value="${escapeHtml(location.hostEnvKey || "")}">
      <input type="hidden" name="previousSiteEnvKey" value="${escapeHtml(location.siteEnvKey || "")}">
      <div class="network-location-form-grid">
        ${field("siteName", "Site Name", location.name || "", "text")}
        ${field("phone", "Phone Number", location.phone || "", "tel")}
        ${field("streetAddress", "Street Address", location.streetAddress || location.address || "")}
        ${field("addressLine2", "Suite / Unit / Address Line 2", location.addressLine2 || "")}
        ${field("city", "City", location.city || "")}
        ${field("region", "State", location.region || "CA")}
        ${field("postalCode", "ZIP Code", location.postalCode || "")}
        ${field("contactName", "Site Contact", location.contactName || "")}
        ${field("hostEnvKey", "Host ID Variable Name", hostEnvKey)}
        ${field("hostId", "Host ID Value", location.hostId || "")}
        ${field("siteEnvKey", "Site ID Variable Name", siteEnvKey)}
        ${field("siteId", "Site ID Value", location.siteId || "")}
        <p class="field-note full network-location-env-note">Saving creates or updates these name/value pairs in Vercel for Production, Preview, and Development.</p>
        ${textarea("notes", "Site Notes", location.notes || "", true)}
      </div>
      <div class="modal-actions">${location.id ? `<button type="button" class="danger network-location-delete" data-network-location-delete="${escapeHtml(location.id)}" data-network-location-client="${escapeHtml(client.id)}" data-network-location-name="${escapeHtml(location.name)}">Delete Site</button>` : ""}<button type="button" data-network-location-modal-close>Cancel</button><button type="submit" class="primary">${location.id ? "Save Site" : "Create Site"}</button></div>
    </form>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();
  dialog.querySelector('[name="siteName"]')?.focus();
}

async function saveNetworkLocation(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const client = clientById(data.clientId);
  const name = String(data.siteName || "").trim();
  if (!client || !name) return;
  if (!Array.isArray(client.networkLocations)) client.networkLocations = [];
  let location = client.networkLocations.find(row => row.id === data.locationId);
  const previousName = location?.name || "";
  const previousEnvironment = {
    hostEnvKey: String(location?.hostEnvKey || "").trim().toUpperCase(),
    hostId: String(location?.hostId || "").trim(),
    siteEnvKey: String(location?.siteEnvKey || "").trim().toUpperCase(),
    siteId: String(location?.siteId || "").trim(),
  };
  if (!location) {
    const baseId = `loc_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "site"}`;
    let locationId = baseId;
    let suffix = 2;
    while (client.networkLocations.some(row => row.id === locationId)) locationId = `${baseId}_${suffix++}`;
    location = { id: locationId, sortOrder: client.networkLocations.length };
    client.networkLocations.push(location);
  }
  Object.assign(location, {
    name,
    streetAddress: String(data.streetAddress || "").trim(),
    addressLine2: String(data.addressLine2 || "").trim(),
    city: String(data.city || "").trim(),
    region: String(data.region || "").trim(),
    postalCode: String(data.postalCode || "").trim(),
    phone: String(data.phone || "").trim(),
    contactName: String(data.contactName || "").trim(),
    hostId: String(data.hostId || "").trim(),
    siteId: String(data.siteId || "").trim(),
    hostEnvKey: String(data.hostEnvKey || "").trim().toUpperCase(),
    siteEnvKey: String(data.siteEnvKey || "").trim().toUpperCase(),
    envPrefix: String(data.envPrefix || "").trim(),
    notes: String(data.notes || "").trim(),
  });
  location.address = networkLocationAddress(location);
  if (previousName && previousName !== name) {
    (Array.isArray(client.networkSnapshots) ? client.networkSnapshots : []).forEach(snapshot => {
      if (snapshotNetworkLocationId(snapshot) === location.id) {
        snapshot.locationName = name;
        if (snapshot.details && typeof snapshot.details === "object") snapshot.details.locationName = name;
      }
    });
    (Array.isArray(state.vaultDocuments) ? state.vaultDocuments : []).forEach(document => {
      if (document.clientId === client.id && document.locationId === location.id) document.locationName = name;
    });
  }
  selectedNetworkLocationId = location.id;
  selectedNetworkSnapshotId = networkSnapshotsForClient(client, location.id)[0]?.id || "";
  saveState();
  await syncNetworkSiteToServer(client, location);
  const environmentChanged = previousEnvironment.hostEnvKey !== location.hostEnvKey ||
    previousEnvironment.hostId !== location.hostId ||
    previousEnvironment.siteEnvKey !== location.siteEnvKey ||
    previousEnvironment.siteId !== location.siteId;
  const envSync = environmentChanged
    ? await syncNetworkSiteEnvironmentToVercel(location, {
        previousHostEnvKey: String(data.previousHostEnvKey || "").trim().toUpperCase(),
        previousSiteEnvKey: String(data.previousSiteEnvKey || "").trim().toUpperCase(),
      })
    : { ok: true, skipped: true };
  document.getElementById("network-location-dialog")?.close();
  renderClientDashboard();
  persistPortalLocationState({ history: "push" });
  if (!envSync.ok) window.alert(`Site saved, but Vercel environment sync did not finish:\n\n${envSync.error}`);
}

async function deleteNetworkLocation(clientId, locationId, locationName) {
  const client = clientById(clientId);
  const locations = Array.isArray(client?.networkLocations) ? client.networkLocations : [];
  if (!client || !locations.some(location => location.id === locationId)) return;
  if (locations.length <= 1) {
    window.alert("A client must retain at least one site. Create another site before deleting this one.");
    return;
  }
  const confirmation = window.prompt(`Delete ${locationName}?\n\nType the site name exactly to confirm. Files and retained snapshots will not be deleted.`);
  if (confirmation === null) return;
  if (confirmation.trim() !== locationName) {
    window.alert("The site name did not match. Nothing was deleted.");
    return;
  }
  const button = document.querySelector(`[data-network-location-delete="${CSS.escape(locationId)}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "Deleting...";
  }
  try {
    // Older portal sessions may contain additional local sites that were never
    // synchronized after the first server record was created. Persist every
    // site that will remain so the API can enforce its final-site guard using
    // the same site set visible in the portal.
    await Promise.all(locations
      .filter(location => location.id !== locationId)
      .map(location => syncNetworkSiteToServer(client, location)));
    const response = await fetch("/api/network-sites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, id: locationId }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Site delete failed.");
    client.networkLocations = locations.filter(location => location.id !== locationId);
    if (selectedNetworkLocationId === locationId) {
      selectedNetworkLocationId = client.networkLocations[0]?.id || "";
      selectedNetworkSnapshotId = networkSnapshotsForClient(client, selectedNetworkLocationId)[0]?.id || "";
    }
    saveState();
    document.getElementById("network-location-dialog")?.close();
    renderClientDashboard();
    persistPortalLocationState({ history: "replace" });
  } catch (error) {
    if (button) {
      button.disabled = false;
      button.textContent = "Delete Site";
    }
    window.alert(`Site delete failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function syncNetworkSiteEnvironmentToVercel(location, previous = {}) {
  const variables = [
    { key: location.hostEnvKey, value: location.hostId },
    { key: location.siteEnvKey, value: location.siteId },
  ].filter(variable => variable.key && variable.value);
  if (!variables.length) return { ok: true };
  try {
    const response = await fetch("/api/vercel-environment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variables,
        removeKeys: [
          previous.previousHostEnvKey && previous.previousHostEnvKey !== location.hostEnvKey ? previous.previousHostEnvKey : "",
          previous.previousSiteEnvKey && previous.previousSiteEnvKey !== location.siteEnvKey ? previous.previousSiteEnvKey : "",
        ].filter(Boolean),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Vercel environment sync failed.");
    return { ok: true, redeployRequired: data.redeployRequired === true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Vercel environment sync failed." };
  }
}

function selectedNetworkSnapshotForClient(client, snapshotId = selectedNetworkSnapshotId) {
  const snapshots = networkSnapshotsForClient(client);
  if (snapshotId) {
    const exactSnapshot = snapshots.find(snapshot => snapshot.id === snapshotId);
    if (exactSnapshot) return exactSnapshot;
  }
  if (!snapshots.length) return null;
  return snapshots.find(snapshot => snapshot.id === snapshotId) || snapshots[0];
}

function refreshNetworkSnapshotViews(clientId) {
  if (!clientId) return;
  if (activeView === "client-dashboard" && selectedClientId === clientId) {
    renderClientDashboard();
    return;
  }
  if (activeView === "network-atlas" && (selectedNetworkAtlasClientId === clientId || selectedClientId === clientId)) {
    renderNetworkAtlas();
  }
}

function networkSnapshotCapturedLabel(snapshot) {
  if (!snapshot?.capturedAt) return "No capture date";
  return new Date(snapshot.capturedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function networkSnapshotStatusLabel(snapshot, isSelected = false) {
  if (isSelected) return "Viewing";
  const status = String(snapshot?.status || "snapshot").toLowerCase();
  if (status === "current") return "Current";
  if (status === "baseline") return "Baseline";
  if (status === "draft") return "Draft";
  if (status === "archived") return "Archived";
  return "Snapshot";
}

function networkSnapshotStatusClass(snapshot, isSelected = false) {
  if (isSelected) return "active";
  const status = String(snapshot?.status || "snapshot").toLowerCase();
  return ["current", "baseline", "draft", "archived"].includes(status) ? status : "normal";
}

function formatGatewayModelName(value) {
  const raw = String(value || "").trim();
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact === "UDMPRO" || compact === "UDMP") return "UDM Pro";
  if (compact === "UDMSE") return "UDM-SE";
  if (compact === "UDR") return "UDR";
  return raw || "Not detected";
}

function formatDeviceModelName(value) {
  const raw = String(value || "").trim();
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact === "UDMPRO" || compact === "UDMP") return "UDM Pro";
  if (compact === "UDMSE") return "UDM-SE";
  if (compact === "US48PRO") return "USW Pro 48 PoE";
  if (compact === "USLP8P") return "USW Pro 8 PoE";
  if (compact === "UAPA6AE") return "U7 Pro XG";
  return raw || "";
}

function detailRowValue(node = {}, label) {
  const row = Array.isArray(node.rows) ? node.rows.find(item => String(item?.[0] || "").toLowerCase() === label.toLowerCase()) : null;
  return row ? String(row[1] || "").trim() : "";
}

function formatOverviewSpeed(value) {
  const raw = String(value || "").trim();
  if (!raw || raw === "-") return "";
  if (/^0+(?:\.0+)?\s*(?:mbe|gbe)$/i.test(raw)) return "";
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) return numeric > 0 ? (numeric >= 1000 ? `${numeric / 1000} GbE` : `${numeric} MbE`) : "";
  return raw;
}

function overviewSpeedMbps(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*(GbE|MbE|Gbps|Mbps)/i);
  if (!match) {
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : 0;
  }
  const number = Number(match[1]);
  if (!Number.isFinite(number)) return 0;
  return /^g/i.test(match[2]) ? number * 1000 : number;
}

function highestOverviewSpeed(values = []) {
  const speeds = values
    .map(formatOverviewSpeed)
    .filter(Boolean)
    .sort((a, b) => overviewSpeedMbps(b) - overviewSpeedMbps(a));
  return speeds.find(speed => overviewSpeedMbps(speed) > 0) || "";
}

function mostCommonValue(values = []) {
  const counts = new Map();
  values.filter(Boolean).forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || null;
}

function uniqueSummary(values = [], maxItems = 2) {
  const unique = [...new Set(values.map(value => String(value || "").trim()).filter(Boolean))];
  if (unique.length <= maxItems) return unique.join(" + ");
  return `${unique.slice(0, maxItems).join(" + ")} +${unique.length - maxItems} more`;
}

function nodeNeedsUpdate(node = {}) {
  const text = `${node.status || ""} ${detailRowValue(node, "Firmware")} ${detailRowValue(node, "Version")}`.toLowerCase();
  return /update|upgrade|available|outdated|stale/.test(text) && !/up.to.date/.test(text);
}

function wanProviderName(value = "") {
  const raw = String(value || "").trim();
  const withoutSpeed = raw.replace(/\b\d+(?:\.\d+)?\s*(?:g|m)(?:b|bit|bps|be)?\b/ig, "").replace(/\s+/g, " ").trim();
  return withoutSpeed || raw || "WAN";
}

function wanServiceSpeed(value = "") {
  const match = String(value || "").match(/\b(\d+(?:\.\d+)?)\s*(g|m)(?:b|bit|bps|be)?\b/i);
  if (!match) return "";
  return `${match[1]} ${match[2].toUpperCase() === "G" ? "Gb" : "Mb"}${/fiber/i.test(value) ? " Fiber" : ""}`;
}

function topologyNodesById(details = {}) {
  const nodes = Array.isArray(details.topologyPlan?.nodes) ? details.topologyPlan.nodes : [];
  return new Map(nodes.map(node => [String(node.id || ""), node]).filter(([id]) => id));
}

function topologyWanNode(details = {}) {
  const nodes = Array.isArray(details.topologyPlan?.nodes) ? details.topologyPlan.nodes : [];
  return nodes.find(node => String(node.tone || "").toLowerCase() === "wan" || /wan/i.test(`${node.type || ""} ${node.subtitle || ""}`));
}

function topologyCoreLinkDetails(details = {}) {
  const nodesById = topologyNodesById(details);
  return (Array.isArray(details.topologyPlan?.links) ? details.topologyPlan.links : [])
    .map(link => {
      const from = nodesById.get(String(link.from || ""));
      const to = nodesById.get(String(link.to || ""));
      if (!from || !to) return "";
      const fromText = `${from.type || ""} ${from.tone || ""} ${from.title || ""}`.toLowerCase();
      const toText = `${to.type || ""} ${to.tone || ""} ${to.title || ""}`.toLowerCase();
      const isInfrastructure = /(gateway|switch|core)/.test(fromText) && /(switch|core)/.test(toText);
      if (!isInfrastructure) return "";
      const speed = formatOverviewSpeed(link.detail || "");
      const label = [link.label, speed].filter(Boolean).join(" - ");
      return `${from.title || from.type || "Upstream"} -> ${to.title || to.type || "Downstream"}${label ? `: ${label}` : ""}`;
    })
    .filter(Boolean);
}

function normalizedNetworkOverviewMetrics(details = {}) {
  const nodes = Array.isArray(details.nodes) ? details.nodes : [];
  const gateway = nodes.find(node => String(node.type || "").toLowerCase() === "gateway");
  const switches = nodes.filter(node => String(node.type || "").toLowerCase() === "switch");
  const aps = nodes.filter(node => String(node.type || "").toLowerCase() === "access point");
  const rawClients = Array.isArray(details.clients) ? details.clients.length : "";
  const metrics = Array.isArray(details.metrics) ? details.metrics : [];
  const metricValue = label => metrics.find(metric => String(metric?.[0] || "").toLowerCase() === label.toLowerCase())?.[1] || "";
  const clientCount = rawClients || metricValue("Clients") || "0";
  const gatewayModel = formatGatewayModelName(detailRowValue(gateway, "Model") || gateway?.title || metricValue("Gateway"));
  const gatewayVersion = detailRowValue(gateway, "Version");
  const gatewayDetail = [
    gatewayModel ? `Model: ${gatewayModel}` : "",
    gatewayVersion && gatewayVersion !== "-" ? `UniFi OS ${gatewayVersion.split(".").slice(0, 3).join(".")}` : "",
  ].filter(Boolean).join(" | ") || (gateway?.status || "Network API pull");
  const wifiPlan = Array.isArray(details.wifiPlan) ? details.wifiPlan : [];
  const apSpeeds = wifiPlan.map(ap => String(ap.uplink || "").trim()).filter(Boolean);
  const commonApSpeed = mostCommonValue(apSpeeds);
  const apModels = aps.map(ap => formatDeviceModelName(detailRowValue(ap, "Model"))).filter(Boolean);
  const commonApModel = mostCommonValue(apModels);
  const apModelText = commonApModel ? `Model: ${commonApModel[1] === (aps.length || wifiPlan.length) ? "All" : commonApModel[1]} ${commonApModel[0]}` : "";
  const apSpeedText = commonApSpeed ? `Uplink: ${commonApSpeed[1] === wifiPlan.length ? `All at ${commonApSpeed[0]}` : `${commonApSpeed[1]} at ${commonApSpeed[0]}`}` : "";
  const apDetail = [apModelText, apSpeedText].filter(Boolean).join(" | ") || "Adopted infrastructure";
  const portRows = Array.isArray(details.ports) ? details.ports : [];
  const coreLinkDetails = topologyCoreLinkDetails(details);
  const coreSpeeds = portRows
    .filter(row => /downlink|uplink|switch|sfp/i.test(`${row?.[3] || ""} ${row?.[0] || ""}`))
    .map(row => formatOverviewSpeed(row?.[2]))
    .filter(speed => overviewSpeedMbps(speed) > 0);
  const topologyCoreSpeeds = coreLinkDetails.map(detail => formatOverviewSpeed(detail.match(/([0-9]+(?:\.[0-9]+)?\s*(?:GbE|MbE|Gbps|Mbps))/i)?.[1] || "")).filter(Boolean);
  const fallbackCoreSpeed = formatOverviewSpeed(metricValue("Core Links"));
  const distinctCoreSpeeds = [...new Set([...topologyCoreSpeeds, ...coreSpeeds].filter(speed => overviewSpeedMbps(speed) > 0))].sort((a, b) => overviewSpeedMbps(b) - overviewSpeedMbps(a));
  const coreSpeed = distinctCoreSpeeds.length > 1 ? distinctCoreSpeeds.slice(0, 2).join(" + ") : distinctCoreSpeeds[0] || (overviewSpeedMbps(fallbackCoreSpeed) > 0 ? fallbackCoreSpeed : "") || "Not detected";
  const switchModels = switches.map(sw => formatDeviceModelName(detailRowValue(sw, "Model"))).filter(Boolean);
  const switchModelText = uniqueSummary(switchModels);
  const switchCount = switches.length || metricValue("Switches") || "0";
  const switchDetail = switchModelText || metrics.find(metric => String(metric?.[0] || "").toLowerCase() === "switches")?.[2] || "Switch model data not exposed";
  const wanNode = topologyWanNode(details);
  const wanNodeTitle = String(wanNode?.title || "");
  const wanMetric = metricValue("Internet");
  const internetRawDetail = metrics.find(metric => String(metric?.[0] || "").toLowerCase() === "internet")?.[2] || "";
  const ethernetLink = formatOverviewSpeed(internetRawDetail.match(/(?:link|ethernet)[^0-9]*([0-9]+(?:\.[0-9]+)?\s*(?:GbE|MbE|Gbps|Mbps))/i)?.[1] || wanMetric);
  const providerSource = wanNodeTitle || (!/^\d+(?:\.\d+)?\s*GbE$/i.test(wanMetric) && !/^link\b/i.test(wanMetric) ? wanMetric : "");
  const providerName = wanProviderName(providerSource);
  const serviceSpeed = wanServiceSpeed(providerSource);
  const internetTitle = serviceSpeed || providerName;
  const internetDetail = [
    providerName && providerName !== "WAN" ? `Provider: ${providerName}` : "",
    ethernetLink && !serviceSpeed.includes(ethernetLink.replace("E", "")) ? `Ethernet link: ${ethernetLink}` : "",
    internetRawDetail.match(/\b\d+\s*ms\b/i)?.[0] || "",
  ].filter(Boolean).join(" | ") || metrics.find(metric => String(metric?.[0] || "").toLowerCase() === "internet")?.[2] || "Primary WAN";
  const fallbackInternet = metrics.find(metric => String(metric?.[0] || "").toLowerCase() === "gateway")?.[2] || "";
  return [
    ["Gateway", gatewayModel, gatewayDetail, gateway && nodeNeedsUpdate(gateway) ? "warn" : ""],
    ["Internet", internetTitle, internetDetail === "Primary WAN" && fallbackInternet ? fallbackInternet : internetDetail],
    ["Switches", String(switchCount), switchDetail, switches.some(nodeNeedsUpdate) ? "warn" : ""],
    ["Access Points", String(aps.length || wifiPlan.length || metricValue("Access Points") || "0"), apDetail, aps.some(nodeNeedsUpdate) ? "warn" : ""],
    ["Clients", String(clientCount), "Connected client inventory"],
    ["Core Links", coreSpeed, coreSpeed === "Not detected" ? "Core link data not exposed" : (coreLinkDetails.length ? uniqueSummary(coreLinkDetails, 3) : [switchModelText, "Gateway to core switching"].filter(Boolean).join(" | "))],
  ];
}

function metricDetailMarkup(detail) {
  const parts = String(detail || "")
    .split(/\s+\|\s+|\n/)
    .map(part => part.trim())
    .filter(Boolean);
  if (!parts.length) return `<small></small>`;
  return parts.map(part => `<small>${escapeHtml(part)}</small>`).join("");
}

function metricCardMarkup(metric = []) {
  const tone = String(metric[3] || "").toLowerCase();
  const autoWarn = /update|upgrade available|outdated|stale/i.test(`${metric[1] || ""} ${metric[2] || ""}`);
  const className = ["metric", tone === "warn" || autoWarn ? "warn" : ""].filter(Boolean).join(" ");
  return `
    <article class="${className}">
      <span>${escapeHtml(metric[0])}</span>
      <strong>${escapeHtml(metric[1])}</strong>
      ${metricDetailMarkup(metric[2])}
      ${tone === "warn" || autoWarn ? `<em>Update available</em>` : ""}
    </article>
  `;
}

function networkOverviewReportHeader(client, details = {}) {
  const savedReports = snapshotReportDocuments(client.id, details.snapshotId);
  const visualReport = savedReports.find(document => document.reportKind === "network-visual-pdf") ||
    savedReports.find(document => /\.pdf$/i.test(document.filename) && document.source === "network-snapshot-report");
  return `
    <div class="network-overview-head">
      <div>
        <h2>Snapshot Overview</h2>
        <p>${escapeHtml(details.snapshotLabel || "Network snapshot")}${details.snapshotCapturedAt ? ` - ${escapeHtml(networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }))}` : ""}</p>
      </div>
      <div class="toolbar">
        ${visualReport ? `<button type="button" data-vault-view="${escapeHtml(visualReport.id)}">View Saved Report</button>` : ""}
        ${visualReport ? `<button type="button" data-vault-download="${escapeHtml(visualReport.id)}">Download Report</button>` : ""}
        <button type="button" class="primary" data-network-report-download="${escapeHtml(client.id)}">Generate Report</button>
      </div>
    </div>
  `;
}

function shouldNormalizeNetworkMetrics(details = {}) {
  if (!Array.isArray(details.metrics)) return false;
  const labels = details.metrics.map(metric => String(metric?.[0] || ""));
  return (
    labels.includes("Switches") ||
    labels.includes("Networks") ||
    labels.includes("Devices Online") ||
    labels.includes("Internet") ||
    labels.includes("Core Links")
  );
}

function applyNetworkSnapshotOverrides(details, snapshot) {
  const overrides = snapshot?.details && typeof snapshot.details === "object" && !Array.isArray(snapshot.details)
    ? snapshot.details
    : {};
  const merged = {
    ...details,
    ...structuredClone(overrides),
    snapshotId: snapshot?.id || details.snapshotId || "",
    snapshotLabel: snapshot?.label || details.snapshotLabel || "Network snapshot",
    snapshotStatus: snapshot?.status || details.snapshotStatus || "snapshot",
    snapshotChangeSummary: snapshot?.changeSummary || details.snapshotChangeSummary || "",
    snapshotCapturedAt: snapshot?.capturedAt || details.snapshotCapturedAt || "",
    snapshotNotes: Array.isArray(snapshot?.notes) ? snapshot.notes : Array.isArray(details.snapshotNotes) ? details.snapshotNotes : [],
    drBackup: snapshot?.drBackup || details.drBackup || null,
    captureDate: snapshot?.capturedAt ? networkSnapshotCapturedLabel(snapshot) : details.captureDate,
  };
  if (shouldNormalizeNetworkMetrics(merged)) merged.metrics = normalizedNetworkOverviewMetrics(merged);
  return merged;
}

function clientNetworkLocationSelector(client) {
  const locations = clientNetworkLocations(client);
  const selectedLocation = selectedNetworkLocationForClient(client);
  return `
    <div class="network-multisite-topology client-network-location-selector" aria-label="Select the site used by all network documentation tabs">
      <div class="network-multisite-sites">
        ${locations.map(location => `<div class="network-multisite-site ${location === selectedLocation ? "active" : ""}" data-network-location-order-id="${escapeHtml(location.id)}" data-network-location-order-client="${escapeHtml(client.id)}">
          <button type="button" class="network-site-drag-handle" draggable="true" data-network-location-drag="${escapeHtml(location.id)}" aria-label="Drag ${escapeHtml(location.name)} to change site order" title="Drag to reorder">☰</button>
          <button type="button" class="network-multisite-select" data-network-location-button="${escapeHtml(location.id)}" data-network-location-client="${escapeHtml(client.id)}" aria-pressed="${location === selectedLocation ? "true" : "false"}" aria-label="Use ${escapeHtml(location.name)} for network documentation">
            <span>${escapeHtml(location.name)}</span><small>${escapeHtml(location.address || "Address not set")}</small>
          </button>
          <button type="button" class="network-location-rename" data-network-location-rename="${escapeHtml(location.id)}" data-network-location-client="${escapeHtml(client.id)}">Edit</button>
        </div>`).join("")}
      </div>
      <button type="button" class="network-location-create" data-network-location-create="${escapeHtml(client.id)}">
        <strong>+ New Site</strong><small>Create another client location</small>
      </button>
    </div>
  `;
}

function networkSnapshotWorkspace(client, selectedSnapshot, snapshots) {
  const selectedId = selectedSnapshot?.id || "";
  const selectedLocation = selectedNetworkLocationForClient(client);
  const pullKey = `${client.id}:${selectedLocation?.id || "default"}`;
  const isPulling = networkSnapshotPulls.has(pullKey);
  return `
    <section class="network-snapshot-workspace">
      <div class="network-snapshot-head">
        <div class="network-snapshot-primary">
          <span class="eyebrow">Network snapshot</span>
          ${snapshots.length ? `
            <label>
              <select class="network-snapshot-select" data-network-snapshot-select="${escapeHtml(client.id)}">
                ${snapshots.map(snapshot => `<option value="${escapeHtml(snapshot.id)}" ${snapshot.id === selectedId ? "selected" : ""}>${escapeHtml(snapshot.label || "Network snapshot")} - ${escapeHtml(networkSnapshotCapturedLabel(snapshot))}</option>`).join("")}
              </select>
            </label>
          ` : `<strong>No snapshots retained yet.</strong>`}
          <p>${escapeHtml(selectedSnapshot?.changeSummary || "Pull a UniFi snapshot to create the first retained Network Atlas capture for this client.")}</p>
        </div>
        <div class="network-snapshot-actions">
          <button type="button" class="primary" data-network-pull-snapshot="${escapeHtml(client.id)}" data-network-pull-location="${escapeHtml(selectedLocation?.id || "default")}" ${isPulling ? "disabled" : ""}>${isPulling ? "Pulling snapshot…" : "Pull Snapshot"}</button>
          ${selectedSnapshot?.drBackup ? `<button type="button" data-network-dr-backup="${escapeHtml(client.id)}">DR Backup</button>` : ""}
          <button type="button" data-network-snapshot-compare="${escapeHtml(client.id)}">Compare</button>
          <button type="button" data-network-snapshot-export="${escapeHtml(client.id)}">Export</button>
        </div>
      </div>
      <div class="network-snapshot-history" aria-label="Network snapshot history">
        ${snapshots.length ? snapshots.map(snapshot => {
          const isSelected = snapshot.id === selectedId;
          return `
            <div class="network-snapshot-history-row ${isSelected ? "active" : ""}">
              <button type="button" class="network-snapshot-history-select" data-network-snapshot-id="${escapeHtml(snapshot.id)}" data-network-snapshot-client="${escapeHtml(client.id)}">
                <span>
                  <strong>${escapeHtml(snapshot.label || "Network snapshot")}</strong>
                  <small>${escapeHtml(networkSnapshotCapturedLabel(snapshot))}</small>
                </span>
              </button>
              <span class="network-snapshot-status ${networkSnapshotStatusClass(snapshot, isSelected)}">${escapeHtml(networkSnapshotStatusLabel(snapshot, isSelected))}</span>
              <button type="button" class="network-snapshot-delete" data-network-delete-snapshot="${escapeHtml(snapshot.id)}" data-network-delete-client="${escapeHtml(client.id)}" aria-label="Delete ${escapeHtml(snapshot.label || "network snapshot")}">Delete</button>
            </div>
          `;
        }).join("") : `<div class="network-snapshot-empty">No snapshot history yet. Use Pull Snapshot to create the first capture.</div>`}
      </div>
    </section>
  `;
}

function selectNetworkSnapshot(clientId, snapshotId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return;
  const snapshot = selectedNetworkSnapshotForClient(client, snapshotId);
  selectedClientId = client.id;
  selectedNetworkAtlasClientId = client.id;
  selectedNetworkSnapshotId = snapshot?.id || "";
  if (activeView === "client-dashboard") renderClientDashboard();
  else renderNetworkAtlas();
  persistPortalLocationState({ history: "push" });
}

function selectedNetworkSnapshotRecord(clientId = selectedNetworkAtlasClientId || selectedClientId) {
  const client = clientById(clientId);
  if (!client || !Array.isArray(client.networkSnapshots)) return null;
  const selected = selectedNetworkSnapshotForClient(client);
  if (!selected?.id) return null;
  return client.networkSnapshots.find(snapshot => snapshot.id === selected.id) || null;
}

function networkSnapshotNotesPanel(client, details = {}) {
  const notes = Array.isArray(details.snapshotNotes) ? details.snapshotNotes.slice() : [];
  notes.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const snapshotId = details.snapshotId || selectedNetworkSnapshotId || "";
  const disabled = !snapshotId;
  return `
    <section class="atlas-data-section snapshot-notes-section">
      <div class="action-plan-head">
        <div>
          <h2>Snapshot Notes</h2>
          <p>Notes are saved on the selected snapshot, so they stay tied to this exact pull and comparison baseline.</p>
        </div>
      </div>
      <form id="network-snapshot-note-form" class="snapshot-note-form">
        <input type="hidden" name="clientId" value="${escapeHtml(client.id)}">
        <input type="hidden" name="snapshotId" value="${escapeHtml(snapshotId)}">
        <label>
          <span>New note</span>
          <textarea name="note" rows="4" placeholder="${disabled ? "Select or pull a snapshot before adding notes." : "Record changes, findings, client context, or follow-up work for this snapshot."}" ${disabled ? "disabled" : ""}></textarea>
        </label>
        <div class="form-actions">
          <button type="submit" class="primary" ${disabled ? "disabled" : ""}>Add Note</button>
        </div>
      </form>
      <div class="snapshot-note-list">
        ${notes.length ? notes.map(note => `
          <article class="snapshot-note-card">
            <div>
              <strong>${escapeHtml(note.author || portalNoteAuthorName || "GSV")}</strong>
              <span>${escapeHtml(note.createdAt ? new Date(note.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "No timestamp")}</span>
            </div>
            <p>${lines(note.text || "")}</p>
            <button type="button" class="link-danger" data-network-note-delete="${escapeHtml(note.id)}" data-network-note-client="${escapeHtml(client.id)}" data-network-note-snapshot="${escapeHtml(snapshotId)}">Delete</button>
          </article>
        `).join("") : `<div class="client-doc-row"><div><strong>No notes for this snapshot yet.</strong><span>Add notes for findings, change windows, or follow-up items.</span></div><span class="badge normal">Notes</span></div>`}
      </div>
    </section>
  `;
}

function addNetworkSnapshotNote(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const client = clientById(data.clientId || selectedNetworkAtlasClientId || selectedClientId);
  const snapshot = selectedNetworkSnapshotRecord(client?.id);
  const text = String(data.note || "").trim();
  if (!client || !snapshot || !text) return;
  if (!Array.isArray(snapshot.notes)) snapshot.notes = [];
  snapshot.notes.push({
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text,
    author: portalNoteAuthorName || "GSV",
    createdAt: new Date().toISOString(),
  });
  saveState();
  if (activeView === "client-dashboard") renderClientDashboard();
  else renderNetworkAtlas();
}

function deleteNetworkSnapshotNote(clientId, noteId) {
  const snapshot = selectedNetworkSnapshotRecord(clientId);
  if (!snapshot || !Array.isArray(snapshot.notes)) return;
  const note = snapshot.notes.find(row => row.id === noteId);
  if (!note) return;
  if (!window.confirm("Delete this snapshot note?")) return;
  snapshot.notes = snapshot.notes.filter(row => row.id !== noteId);
  saveState();
  if (activeView === "client-dashboard") renderClientDashboard();
  else renderNetworkAtlas();
}

function createNetworkSnapshot(clientId) {
  const client = clientById(clientId || selectedClientId);
  if (!client) return;
  const current = selectedNetworkSnapshotForClient(client);
  const label = window.prompt("Snapshot label", "New network snapshot");
  if (!label?.trim()) return;
  const capturedAt = new Date().toISOString();
  const snapshot = {
    ...(current ? structuredClone(current) : {}),
    id: capturedAt,
    capturedAt,
    label: label.trim(),
    status: "draft",
    changeSummary: "Draft snapshot cloned from the selected capture. Update after importing a fresh config/export.",
    atlasPath: current?.atlasPath || client.networkAtlasPath || "",
    configPath: "",
  };
  if (!Array.isArray(client.networkSnapshots)) client.networkSnapshots = [];
  client.networkSnapshots.push(snapshot);
  saveState();
  selectNetworkSnapshot(client.id, snapshot.id);
}

function snapshotAssociatedVaultDocuments(clientId, snapshot = {}) {
  if (!clientId || !snapshot?.id) return [];
  const linkedIds = new Set([
    snapshot.drBackup?.portalFile?.vaultDocumentId,
    snapshot.drBackup?.nativeUnf?.vaultDocumentId,
    snapshot.reportFiles?.pdfVaultDocumentId,
    snapshot.reportFiles?.visualVaultDocumentId,
    snapshot.generatedArtifacts?.topologyVaultDocumentId,
    snapshot.generatedArtifacts?.configVaultDocumentId,
    snapshot.generatedArtifacts?.runbookVaultDocumentId,
  ].filter(Boolean));
  return (Array.isArray(state.vaultDocuments) ? state.vaultDocuments : [])
    .filter(document =>
      document.clientId === clientId &&
      !document.deletedAt &&
      (document.snapshotId === snapshot.id || linkedIds.has(document.id))
    );
}

function snapshotReportDocuments(clientId, snapshotId) {
  if (!clientId || !snapshotId) return [];
  return clientVaultDocuments(clientId)
    .filter(document =>
      document.snapshotId === snapshotId &&
      document.category === "Reports" &&
      (
        document.reportKind === "network-visual-pdf" ||
        (/\.pdf$/i.test(String(document.filename || "")) && document.source === "network-snapshot-report")
      )
    )
    .sort((a, b) => {
      const aVisual = a.reportKind === "network-visual-pdf" || /\.pdf$/i.test(String(a.filename || ""));
      const bVisual = b.reportKind === "network-visual-pdf" || /\.pdf$/i.test(String(b.filename || ""));
      if (aVisual !== bVisual) return aVisual ? -1 : 1;
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
}

function snapshotArtifactDocument(clientId, snapshotId, artifactKind) {
  if (!clientId || !snapshotId || !artifactKind) return null;
  return clientVaultDocuments(clientId).find(document => document.snapshotId === snapshotId && document.artifactKind === artifactKind) || null;
}

async function deleteSnapshotAssociatedVaultFiles(clientId, snapshot = {}) {
  const client = clientById(clientId);
  const documents = snapshotAssociatedVaultDocuments(clientId, snapshot);
  const linkedIds = [
    snapshot.drBackup?.portalFile?.vaultDocumentId,
    snapshot.drBackup?.nativeUnf?.vaultDocumentId,
    snapshot.reportFiles?.pdfVaultDocumentId,
    snapshot.reportFiles?.visualVaultDocumentId,
    snapshot.generatedArtifacts?.topologyVaultDocumentId,
    snapshot.generatedArtifacts?.configVaultDocumentId,
    snapshot.generatedArtifacts?.runbookVaultDocumentId,
  ].filter(Boolean);
  const artifactBaseName = client
    ? `${safeDownloadName(client.name)}${siteFilenameToken(snapshot.locationName, snapshot.locationId)}-network-snapshot-${safeDownloadName(snapshot.id)}`
    : "";
  const generatedFilenames = [
    snapshot.drBackup?.portalFile?.filename,
    snapshot.drBackup?.nativeUnf?.filename,
    snapshot.reportFiles?.pdfFilename,
    snapshot.reportFiles?.visualFilename,
    artifactBaseName ? `${artifactBaseName}-topology.html` : "",
    artifactBaseName ? `${artifactBaseName}-config-capture.json` : "",
    artifactBaseName ? `${artifactBaseName}-runbook.txt` : "",
  ].filter(Boolean);
  const failures = [];
  if (vaultStorageMode !== "local-browser") {
    try {
      const response = await fetch("/api/vault/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, snapshotId: snapshot.id, documentIds: linkedIds, generatedFilenames }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Snapshot file cleanup returned ${response.status}.`);
      const deletedIds = new Set(payload.deletedIds || []);
      remoteVaultDocuments.set(clientId, (remoteVaultDocuments.get(clientId) || []).filter(row => !deletedIds.has(row.id)));
      return { deleted: Number(payload.deleted || 0), failures: [] };
    } catch (error) {
      failures.push(error?.message || "snapshot file cleanup failed");
      return { deleted: 0, failures };
    }
  }
  for (const document of documents) {
    try {
      if (document.storage === "private-cloud") {
        const response = await fetch(`/api/vault/documents/${encodeURIComponent(document.id)}`, { method: "DELETE" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `Vault delete returned ${response.status}.`);
        remoteVaultDocuments.set(clientId, (remoteVaultDocuments.get(clientId) || []).filter(row => row.id !== document.id));
      } else {
        await removeVaultFile(document.id);
        document.deletedAt = new Date().toISOString();
        document.deletedReason = "snapshot-deleted";
      }
    } catch (error) {
      failures.push(`${document.filename}: ${error?.message || "file delete failed"}`);
    }
  }
  return { deleted: documents.length - failures.length, failures };
}

async function deleteNetworkSnapshot(clientId, snapshotId) {
  const client = clientById(clientId || selectedClientId);
  if (!client || !snapshotId || !Array.isArray(client.networkSnapshots)) return;
  const snapshot = client.networkSnapshots.find(row => row.id === snapshotId);
  if (!snapshot) return;
  const label = snapshot.label || "this network snapshot";
  const captured = snapshot.capturedAt ? ` from ${networkSnapshotCapturedLabel(snapshot)}` : "";
  const associatedFiles = snapshotAssociatedVaultDocuments(client.id, snapshot);
  const fileWarning = associatedFiles.length
    ? `\n\nThis will also delete ${associatedFiles.length} associated file${associatedFiles.length === 1 ? "" : "s"} from the Files tab, including generated reports and backups for this snapshot.`
    : "";
  if (!window.confirm(`Delete ${label}${captured}? This removes it from this browser's retained portal data.${fileWarning}`)) return;

  const cleanup = await deleteSnapshotAssociatedVaultFiles(client.id, snapshot);
  if (cleanup.failures.length) {
    window.alert(`Snapshot was not deleted because its associated files could not all be removed:\n\n${cleanup.failures.join("\n")}`);
    return;
  }
  client.networkSnapshots = client.networkSnapshots.filter(row => row.id !== snapshotId);
  if (client.networkAtlasPath === snapshot.atlasPath) {
    const latestWithPath = networkSnapshotsForClient(client).find(row => row.atlasPath);
    client.networkAtlasPath = latestWithPath?.atlasPath || "";
  }
  const nextSnapshot = selectedNetworkSnapshotForClient(client, selectedNetworkSnapshotId === snapshotId ? "" : selectedNetworkSnapshotId);
  selectedNetworkSnapshotId = nextSnapshot?.id || "";
  saveState();
  if (activeView === "client-dashboard") renderClientDashboard();
  else renderNetworkAtlas();
  persistPortalLocationState({ history: "push" });
}

function savePulledNetworkSnapshot(client, snapshot, options = {}) {
  if (!client || !snapshot?.id) return;
  if (!Array.isArray(client.networkSnapshots)) client.networkSnapshots = [];
  if (snapshot.status === "current") {
    client.networkSnapshots.forEach(existing => {
      if (existing.id !== snapshot.id && existing.status === "current" && snapshotNetworkLocationId(existing) === snapshotNetworkLocationId(snapshot)) existing.status = "archived";
    });
  }
  const existingIndex = client.networkSnapshots.findIndex(existing => existing.id === snapshot.id);
  if (existingIndex >= 0) client.networkSnapshots[existingIndex] = snapshot;
  else client.networkSnapshots.push(snapshot);
  client.networkAtlasPath = snapshot.atlasPath || client.networkAtlasPath || "";
  saveState();
  if (options.select !== false) selectNetworkSnapshot(client.id, snapshot.id);
  return client.networkSnapshots.find(existing => existing.id === snapshot.id) || snapshot;
}

async function pullNetworkAtlasSnapshot(clientId, locationId = selectedNetworkLocationId) {
  const client = clientById(clientId || selectedClientId);
  if (!client) return;
  const location = selectedNetworkLocationForClient(client, locationId);
  const pullKey = `${client.id}:${location?.id || "default"}`;
  if (networkSnapshotPullJobs.has(pullKey)) return networkSnapshotPullJobs.get(pullKey);
  const job = runNetworkAtlasSnapshotPull(client.id, location?.id).finally(() => {
    networkSnapshotPullJobs.delete(pullKey);
  });
  networkSnapshotPullJobs.set(pullKey, job);
  return job;
}

async function runNetworkAtlasSnapshotPull(clientId, locationId) {
  const client = clientById(clientId);
  const networkLocation = selectedNetworkLocationForClient(client, locationId);
  const pullKey = `${client?.id || clientId}:${networkLocation?.id || "default"}`;
  if (!client || networkSnapshotPulls.has(pullKey)) return;
  networkSnapshotPulls.add(pullKey);
  refreshNetworkSnapshotViews(client.id);

  try {
    const response = await fetch("/api/network-atlas-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.id,
        clientName: client.name,
        ninjaOneOrgId: Number(client.ninjaOneOrgId || 0),
        hostId: networkLocation?.hostId || client.networkSource?.hostId || "",
        siteId: networkLocation?.siteId || client.networkSource?.siteId || "",
        locationId: networkLocation?.id || "default",
        locationName: networkLocation?.name || "Primary location",
        locationAddress: networkLocation?.address || "",
        label: `Pulled snapshot - ${new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`,
        enrichWithOpenAI: true,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Network Atlas pull failed.");
    if (!data.snapshot?.id) throw new Error("The Network Atlas API did not return a snapshot.");
    data.snapshot.locationId = networkLocation?.id || "default";
    data.snapshot.locationName = networkLocation?.name || "Primary location";
    data.snapshot.details = {
      ...(data.snapshot.details || {}),
      locationId: data.snapshot.locationId,
      locationName: data.snapshot.locationName,
      locationAddress: networkLocation?.address || "",
      interSiteLinks: (Array.isArray(client.networkLinks) ? client.networkLinks : []).filter(link =>
        link.fromLocationId === data.snapshot.locationId || link.toLocationId === data.snapshot.locationId
      ),
    };
    let savedSnapshot = savePulledNetworkSnapshot(client, data.snapshot, { select: false });
    const shouldSelectPulledSnapshot = selectedClientId === client.id || selectedNetworkAtlasClientId === client.id;
    if (shouldSelectPulledSnapshot) {
      selectedClientId = client.id;
      selectedNetworkAtlasClientId = client.id;
      selectedNetworkLocationId = savedSnapshot.locationId;
      selectedNetworkSnapshotId = savedSnapshot.id;
      persistPortalLocationState();
    }
    refreshNetworkSnapshotViews(client.id);
    if (savedSnapshot.openAiAuditResponseId && savedSnapshot.openAiAuditStatus !== "completed") {
      const auditStartedAt = Date.now();
      while (savedSnapshot.openAiAuditStatus === "queued" || savedSnapshot.openAiAuditStatus === "in_progress") {
        if (Date.now() - auditStartedAt > 10 * 60 * 1000) {
          throw new Error("The AI audit is still processing after 10 minutes. The collected snapshot was retained; run the audit again to finish its files.");
        }
        await new Promise(resolve => window.setTimeout(resolve, 2500));
        const pollResponse = await fetch("/api/network-atlas-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "poll-audit",
            auditResponseId: savedSnapshot.openAiAuditResponseId,
            snapshot: savedSnapshot,
          }),
        });
        const pollData = await pollResponse.json().catch(() => ({}));
        if (!pollResponse.ok) throw new Error(pollData.error || "AI audit status check failed.");
        if (!pollData.snapshot?.id) throw new Error("AI audit did not return the retained snapshot.");
        savedSnapshot = savePulledNetworkSnapshot(client, pollData.snapshot, { select: false });
        refreshNetworkSnapshotViews(client.id);
      }
      if (!savedSnapshot.openAiEnriched || savedSnapshot.openAiAuditStatus !== "completed") {
        throw new Error("The AI audit did not complete. The collected snapshot was retained, but final files were not generated.");
      }
    }
    const postPullFailures = [];
    let nativeBackupCaptured = false;
    let nativeBackupErrorMessage = "";
    try {
      await autoSaveNativeUnifiBackupFile(client.id, savedSnapshot, networkLocation);
      nativeBackupCaptured = true;
    } catch (nativeBackupError) {
      markNativeUnifiBackupFailure(client.id, savedSnapshot, nativeBackupError);
      nativeBackupErrorMessage = nativeBackupError instanceof Error ? nativeBackupError.message : "Controller did not provide a native backup.";
      console.warn("Optional native UniFi backup was unavailable", nativeBackupError);
    }
    try {
      await autoSaveNetworkDrBackupFile(client.id, savedSnapshot);
    } catch (drBackupFileError) {
      console.warn("Network DR backup auto-save failed", drBackupFileError);
      postPullFailures.push(`DR backup JSON: ${drBackupFileError instanceof Error ? drBackupFileError.message : "Unknown backup save error."}`);
    }
    try {
      await autoSaveNetworkSnapshotReportFiles(client.id, savedSnapshot.id);
    } catch (reportError) {
      console.warn("Network report auto-save failed", reportError);
      postPullFailures.push(`PDF report: ${reportError instanceof Error ? reportError.message : "Unknown report save error."}`);
    }
    try {
      await autoSaveNetworkSnapshotArtifactFiles(client.id, savedSnapshot.id);
    } catch (artifactError) {
      console.warn("Network snapshot artifact auto-save failed", artifactError);
      postPullFailures.push(`Topology/config/runbook files: ${artifactError instanceof Error ? artifactError.message : "Unknown artifact save error."}`);
    }
    try {
      await pruneRemoteBackupFiles(client.id);
    } catch (retentionError) {
      console.warn("Backup retention cleanup failed", retentionError);
      postPullFailures.push(`Backup retention: ${retentionError instanceof Error ? retentionError.message : "Unknown cleanup error."}`);
    }
    refreshNetworkSnapshotViews(client.id);
    if (data.warning || data.ninjaServerWarning || data.snapshot.enrichmentWarning) {
      window.alert([data.warning, data.ninjaServerWarning, data.snapshot.enrichmentWarning].filter(Boolean).join("\n"));
    }
    if (postPullFailures.length && (selectedClientId === client.id || selectedNetworkAtlasClientId === client.id)) {
      window.alert(`Snapshot pulled, but some associated files did not finish:\n\n${postPullFailures.join("\n")}`);
    }
    return { snapshot: savedSnapshot, nativeBackupCaptured, nativeBackupError: nativeBackupErrorMessage, postPullFailures };
  } catch (error) {
    refreshNetworkSnapshotViews(client.id);
    window.alert(error instanceof Error ? error.message : "Network Atlas pull failed.");
    return null;
  } finally {
    networkSnapshotPulls.delete(pullKey);
    refreshNetworkSnapshotViews(client.id);
  }
}

function networkAtlasDetails(client, snapshot = selectedNetworkSnapshotForClient(client)) {
  const snapshots = networkSnapshotsForClient(client);
  const selectedSnapshot = snapshot || selectedNetworkSnapshotForClient(client);
  const captureDate = selectedSnapshot?.capturedAt
    ? networkSnapshotCapturedLabel(selectedSnapshot)
    : "";
  const atlasSignals = [
    client.id,
    client.name,
    client.billTo,
    client.networkAtlasPath,
    ...snapshots.flatMap(snapshot => [snapshot.id, snapshot.label, snapshot.atlasPath, snapshot.configPath]),
  ].join(" ").toLowerCase();
  const isThe19thHoleAtlas =
    atlasSignals.includes("client_home") ||
    atlasSignals.includes("client_cory_beck") ||
    atlasSignals.includes("the 19th hole") ||
    atlasSignals.includes("the-19th-hole") ||
    atlasSignals.includes("757 caber");

  if (isThe19thHoleAtlas) {
    return applyNetworkSnapshotOverrides({
      subtitle: "757 Caber Drive - Lincoln",
      summary: "Residential managed network and smart-home infrastructure.",
      captureDate,
      snapshotId: selectedSnapshot?.id || "",
      snapshotLabel: selectedSnapshot?.label || "Network snapshot",
      snapshotStatus: selectedSnapshot?.status || "snapshot",
      snapshotChangeSummary: selectedSnapshot?.changeSummary || "",
      snapshotCapturedAt: selectedSnapshot?.capturedAt || "",
      controller: "UDM-SE",
      controllerUrl: "https://192.168.1.1",
      metrics: [
        ["Gateway", "UDM-SE", "UniFi Network 10.4.57"],
        ["Internet", "2.5 GbE", "Fidium primary - 9 ms"],
        ["Access Points", "4", "All at 2.5 GbE"],
        ["Clients", "88", "Snapshot count"],
        ["Core Links", "10 GbE", "Switch uplink and NAS"],
      ],
      nodes: [
        { key: "fidium", type: "Primary WAN", title: "Fidium Fiber", status: "Active - 100% available", rows: [["UDM port", "9"], ["Link", "2.5 GbE full duplex"], ["Addressing", "DHCP"], ["Latency", "9 ms snapshot"], ["Smart Queues", "Disabled"]] },
        { key: "starlink", type: "Standby WAN", title: "Starlink", status: "Linked - standby plan", rows: [["UDM port", "8"], ["Link", "1 GbE full duplex"], ["Priority", "WAN 2 - failover only"], ["Gateway", "192.168.4.1"], ["Lease", "192.168.4.227"]] },
        { key: "udm", type: "Gateway", title: "UDM-SE - The Beck's", status: "Online - healthy", rows: [["Controller", "192.168.1.1"], ["Network", "10.4.57"], ["Firmware", "5.1.19.33549"], ["WAN 1", "Fidium - port 9"], ["WAN 2", "Starlink - port 8"]] },
        { key: "switch", type: "Core switching", title: "Main Switch 1", status: "Online - RSTP root", rows: [["Address", "192.168.1.200"], ["Model", "Pro Max 24 PoE"], ["Firmware", "7.4.1.16850"], ["RSTP", "Priority 4096"], ["Uplink", "Port 25 - 10 GbE"]] },
        { key: "garage", type: "Access point", title: "Garage AP", status: "Online - 11 clients", rows: [["Switch port", "17"], ["Uplink", "2.5 GbE"], ["2.4 GHz", "Ch 1 - 20 MHz - 18 dBm"], ["5 GHz", "Ch 157 - 40 MHz - 20 dBm"], ["6 GHz", "Ch 69 - 160 MHz"]] },
        { key: "upstairs", type: "Access point", title: "Upstairs AP", status: "Online - 24 clients", rows: [["Switch port", "18"], ["Uplink", "2.5 GbE"], ["2.4 GHz", "Ch 11 - 20 MHz - 18 dBm"], ["5 GHz", "Ch 36 - 40 MHz - 22 dBm"], ["6 GHz", "Ch 133 - 160 MHz"]] },
        { key: "patio", type: "Access point", title: "Patio AP", status: "Online - 5 clients", rows: [["Switch port", "19"], ["Uplink", "2.5 GbE"], ["2.4 GHz", "Ch 11 - 20 MHz - 16 dBm"], ["5 GHz", "Ch 149 - 40 MHz - 18 dBm"], ["6 GHz", "Ch 101 - 160 MHz"]] },
        { key: "kitchen", type: "Access point", title: "Kitchen AP", status: "Online - 22 clients", rows: [["Switch port", "20"], ["Uplink", "2.5 GbE"], ["2.4 GHz", "Ch 1 - 20 MHz - 15 dBm"], ["5 GHz", "Ch 44 - 40 MHz - 20 dBm"], ["6 GHz", "Ch 37 - 160 MHz"]] },
        { key: "synology", type: "Core service", title: "Synology + Home Assistant", status: "Reachable - 10 GbE", rows: [["Address", "192.168.1.10"], ["Switch port", "26 - SFP+"], ["Network", "Default"], ["IoT access", "Allowed by rule 40000"], ["Role", "NAS and Home Assistant"]] },
        { key: "sonos", type: "Audio system", title: "Sonos", status: "7 network-visible zones", rows: [["Garage Workshop", "Port 1 - WiFi off"], ["Patio", "Port 2 - SonosNet bridge"], ["Family Room", "Port 3"], ["SonosNet", "Channel 6"], ["Network", "Default LAN"]] },
        { key: "protect", type: "Video security", title: "UniFi Protect", status: "8 cameras online", rows: [["Doorbell", "Port 6"], ["Cameras", "Ports 7, 8, 10-13, 23"], ["Network", "Default"], ["Power", "PoE"], ["Recorder", "UDM-SE"]] },
        { key: "networks", type: "Logical networks", title: "VLAN and SSID Design", status: "Policy active", rows: [["Default", "192.168.1.0/24"], ["IoT", "VLAN 3 - 192.168.3.0/24"], ["VPN", "192.168.8.0/24"], ["DNS", "1.1.1.1 - 8.8.8.8"], ["mDNS", "Enabled on Default and IoT"]] },
      ],
      ports: [
        [1, "Active", "100 MbE", "Sonos Garage Workshop", "192.168.1.155", "-"],
        [2, "Active", "100 MbE", "Sonos Patio", "192.168.1.87", "-"],
        [3, "Active", "100 MbE", "Sonos Family Room", "192.168.1.233", "-"],
        [4, "Active", "100 MbE", "Lutron bridge", "192.168.1.245", "-"],
        [5, "Down", "-", "Unused", "-", "-"],
        [6, "Active", "1 GbE", "Doorbell", "192.168.1.160", "PoE"],
        [7, "Active", "1 GbE", "Driveway camera", "192.168.1.154", "PoE"],
        [8, "Active", "1 GbE", "Side camera", "192.168.1.209", "PoE"],
        [9, "Down", "-", "Unused", "-", "-"],
        [10, "Active", "100 MbE", "Front PTZ", "192.168.1.136", "PoE"],
        [11, "Active", "100 MbE", "Garage camera", "192.168.1.92", "PoE"],
        [12, "Active", "1 GbE", "Side Entrance camera", "192.168.1.93", "PoE"],
        [13, "Active", "1 GbE", "Backyard camera", "192.168.1.14", "PoE"],
        [14, "Down", "-", "Unused", "-", "-"],
        [15, "Disabled", "-", "Unknown former run", "-", "PoE off"],
        [16, "Down", "-", "Unused", "-", "-"],
        [17, "Active", "2.5 GbE", "Garage AP", "-", "PoE"],
        [18, "Active", "2.5 GbE", "Upstairs AP", "-", "PoE"],
        [19, "Active", "2.5 GbE", "Patio AP", "-", "PoE"],
        [20, "Active", "2.5 GbE", "Kitchen AP", "-", "PoE"],
        [21, "Active", "2.5 GbE", "Steve's PC", "192.168.1.26", "-"],
        [22, "Down", "-", "Unused", "-", "-"],
        [23, "Active", "100 MbE", "Patio camera", "192.168.1.82", "PoE"],
        [24, "Down", "-", "Unused", "-", "PoE off"],
        [25, "Active", "10 GbE", "UDM-SE uplink", "Core", "-"],
        [26, "Active", "10 GbE", "Synology NAS + Home Assistant", "192.168.1.10", "-"],
      ],
      wifi: [
        ["Garage AP", "Port 17", "11 clients", "2.4 GHz ch 1 / 20 MHz / 18 dBm", "5 GHz ch 157 / 40 MHz / 20 dBm", "6 GHz ch 69 / 160 MHz / 21 dBm"],
        ["Upstairs AP", "Port 18", "24 clients", "2.4 GHz ch 11 / 20 MHz / 18 dBm", "5 GHz ch 36 / 40 MHz / 22 dBm", "6 GHz ch 133 / 160 MHz / 21 dBm"],
        ["Patio AP", "Port 19", "5 clients", "2.4 GHz ch 11 / 20 MHz / 16 dBm", "5 GHz ch 149 / 40 MHz / 18 dBm", "6 GHz ch 101 / 160 MHz / 21 dBm"],
        ["Kitchen AP", "Port 20", "22 clients", "2.4 GHz ch 1 / 20 MHz / 15 dBm", "5 GHz ch 44 / 40 MHz / 20 dBm", "6 GHz ch 37 / 160 MHz / 21 dBm"],
      ],
      wifiPlan: [
        { name: "Garage", port: 17, clients: 11, uplink: "2.5 GbE", radios: [["2.4", "1", "20 MHz", "18 dBm", 37], ["5", "157", "40 MHz", "20 dBm", 27], ["6", "69", "160 MHz", "21 dBm", 1]] },
        { name: "Upstairs", port: 18, clients: 24, uplink: "2.5 GbE", radios: [["2.4", "11", "20 MHz", "18 dBm", 67], ["5", "36", "40 MHz", "22 dBm", 8], ["6", "133", "160 MHz", "21 dBm", 2]] },
        { name: "Patio", port: 19, clients: 5, uplink: "2.5 GbE", radios: [["2.4", "11", "20 MHz", "16 dBm", 58], ["5", "149", "40 MHz", "18 dBm", 17], ["6", "101", "160 MHz", "21 dBm", 1]] },
        { name: "Kitchen", port: 20, clients: 22, uplink: "2.5 GbE", radios: [["2.4", "1", "20 MHz", "15 dBm", 59], ["5", "44", "40 MHz", "20 dBm", 3], ["6", "37", "160 MHz", "21 dBm", 6]] },
      ],
      security: [
        ["Default LAN", "192.168.1.0/24 - trusted clients and services"],
        ["The 19th Hole IoT", "VLAN 3 - 192.168.3.0/24 - mDNS enabled"],
        ["Stateful return traffic", "Established and related traffic is allowed by UniFi predefined state handling."],
        ["Rule 40000", "IoT to Home Assistant exception: 192.168.3.0/24 can reach 192.168.1.10."],
        ["Rule 40001", "IoT to Default LAN: blocks new IoT-initiated sessions to 192.168.1.0/24."],
      ],
      securityPlan: {
        trusted: { title: "Default LAN", subtitle: "192.168.1.0/24 - trusted clients and services" },
        iot: { title: "The 19th Hole IoT", subtitle: "VLAN 3 - 192.168.3.0/24 - mDNS enabled" },
        rules: [
          { id: "System", name: "Established and related", note: "UniFi predefined state handling", source: "All managed networks", destination: "Return traffic", action: "Allow" },
          { id: "40000", name: "IoT to Home Assistant", note: "Explicit compatibility exception", source: "192.168.3.0/24", destination: "192.168.1.10", action: "Allow" },
          { id: "40001", name: "IoT to Default LAN", note: "Blocks new IoT-initiated sessions", source: "192.168.3.0/24", destination: "192.168.1.0/24", action: "Drop" },
        ],
      },
      runbook: [
        ["Internet outage", "Check Fidium WAN 1 on UDM port 9 for 2.5 GbE link and DHCP lease. Confirm DNS to 1.1.1.1 and 8.8.8.8. Inspect Starlink WAN 2 on UDM port 8. Activate standby service if required."],
        ["Spotty WiFi", "Identify the serving AP and band. Check signal and retries together. Verify fixed channel plan: 2.4 GHz on 1/11, 5 GHz on 36/44/149/157, 6 GHz on four distinct 160 MHz channels."],
        ["IoT onboarding", "Use The 19th Hole IoT SSID. Device should receive 192.168.3.x with gateway 192.168.3.1. Temporarily join phone to IoT SSID when same-network discovery is required."],
        ["Sonos rooms", "Keep Sonos on Default LAN. Garage Workshop is port 1, Patio is port 2 and intended SonosNet bridge on channel 6, Family Room is port 3."],
        ["Home Assistant", "Check Synology path at 192.168.1.10 on switch port 26 at 10 GbE. Verify rule 40000 allows VLAN 3 to initiate traffic to Home Assistant."],
      ],
      runbookDetails: [
        { key: "internet", title: "Internet outage", steps: [["Check Fidium WAN 1", "UDM port 9 should negotiate at 2.5 GbE and hold a DHCP lease."], ["Confirm gateway DNS", "Default and IoT clients should receive 1.1.1.1 and 8.8.8.8."], ["Inspect Starlink WAN 2", "UDM port 8 should remain linked at 1 GbE, even while the Starlink plan is in standby."], ["Activate standby service if required", "Failover routing cannot create paid Starlink service when the account is not active."]] },
        { key: "wifi", title: "Spotty WiFi", steps: [["Identify the serving AP and band", "Do not judge coverage from the nearest ceiling AP alone; verify the actual association."], ["Check signal and retries together", "A strong signal with high retries suggests contention; a weak signal with low retries suggests coverage."], ["Verify the fixed channel plan", "2.4 GHz uses channels 1 and 11, 5 GHz uses 36/44/149/157, and 6 GHz uses four distinct 160 MHz channels."], ["Change power one AP at a time", "Observe roaming for at least a day before making another adjustment."]] },
        { key: "iot", title: "IoT onboarding", steps: [["Use The 19th Hole IoT", "The compatibility SSID is WPA2, 2.4 GHz, PMF disabled and mapped to VLAN 3."], ["Confirm the address", "The device should receive 192.168.3.x, gateway 192.168.3.1."], ["Keep the phone close to the target device", "Temporarily join the phone to the IoT SSID when an onboarding app requires same-network discovery."], ["Verify cloud and local control", "Test the vendor app from the trusted SSID after setup, then confirm the Home Assistant entity remains available."]] },
        { key: "sonos", title: "Sonos rooms", steps: [["Keep Sonos on Default LAN", "Do not move Sonos to VLAN 3; the phone app, AirPlay, TV audio and Home Assistant depend on trusted-LAN discovery."], ["Check the three wired zones", "Garage Workshop is port 1, Patio is port 2, and Family Room is port 3."], ["Preserve the bridge design", "Patio is the intended SonosNet bridge on channel 6. Garage Workshop is wired with WiFi disabled."], ["Test before rewiring", "Confirm room visibility, grouping and TV playback before changing Ethernet connections."]] },
        { key: "homeassistant", title: "Home Assistant", steps: [["Check the Synology path", "192.168.1.10 connects to switch port 26 at 10 GbE."], ["Verify the explicit IoT exception", "Firewall rule 40000 allows VLAN 3 to initiate traffic to the Home Assistant host."], ["Confirm discovery method", "mDNS is enabled on Default and IoT. SSDP-based integrations may still require integration-specific handling."], ["Do not tighten ports blindly", "Record active integrations and webhooks before narrowing the broad Home Assistant exception."]] },
      ],
    }, selectedSnapshot);
  }

  return applyNetworkSnapshotOverrides({
    subtitle: client.billTo?.split("\n")?.[0] || client.email || "Client network",
    summary: client.notes || "Network documentation for this client.",
    captureDate,
    snapshotId: selectedSnapshot?.id || "",
    snapshotLabel: selectedSnapshot?.label || "Network snapshot",
    snapshotStatus: selectedSnapshot?.status || "snapshot",
    snapshotChangeSummary: selectedSnapshot?.changeSummary || "",
    snapshotCapturedAt: selectedSnapshot?.capturedAt || "",
    controller: client.ninjaOneOrgId ? "Managed network" : "Not specified",
    controllerUrl: "",
    metrics: [
      ["Atlas", client.networkAtlasPath ? "Linked" : "Missing", "Protected portal documentation"],
      ["Snapshots", String(snapshots.length), "Retained topology captures"],
      ["Config", snapshots.some(snapshot => snapshot.configPath) ? "Available" : "Missing", "Sanitized export when present"],
    ],
    nodes: [],
    ports: [],
    wifi: [],
    security: [],
    runbook: [],
  }, selectedSnapshot);
}

function networkAtlasTabButton(tab, label) {
  return `<button type="button" class="${selectedNetworkAtlasTab === tab ? "active" : ""}" data-network-atlas-tab="${tab}">${label}</button>`;
}

function networkAtlasTable(headers, rows) {
  return `
    <div class="table-card">
      <table>
        <thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="empty-cell">No records documented yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function networkCombinedDevicesTable(details = {}) {
  const ipv4From = value => {
    const matches = String(value || "").match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
    return matches.find(address => address.split(".").every(part => Number(part) >= 0 && Number(part) <= 255)) || "";
  };
  const looksLikeMac = value => /^(?:[0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.test(String(value || "").trim());
  const clientEvidence = Array.isArray(details.clientInventory) ? details.clientInventory : [];
  const portalSiteName = String(details.locationName || details.subtitle || "Current site");
  const ipv4Subnet24 = value => {
    const address = ipv4From(value);
    return address ? address.split(".").slice(0, 3).join(".") : "";
  };
  const evidenceForClient = (name, address) => clientEvidence.find(item =>
    (ipv4From(item?.address) && ipv4From(item?.address) === ipv4From(address)) ||
    (String(item?.name || "").trim().toLowerCase() === String(name || "").trim().toLowerCase())
  ) || {};
  const ouiVendor = mac => {
    const prefix = String(mac || "").toLowerCase().replaceAll("-", ":").slice(0, 8);
    const known = {
      "00:20:6b": "Konica Minolta",
    };
    return known[prefix] || "";
  };
  const friendlyDeviceType = device => {
    const rawType = String(device?.type || "").trim();
    const evidence = `${device?.name || ""} ${rawType} ${device?.manufacturer || ""} ${device?.model || ""} ${device?.category || ""}`.toLowerCase();
    if (device.infrastructure && /gateway|udm|security gateway/.test(evidence)) return "Gateway";
    if (device.infrastructure && /access point|\bwap\b|\bu[67][ -]?(pro|lite|lr|enterprise)?\b/.test(evidence)) return "Access Point";
    if (device.infrastructure && /switch|\busw\b/.test(evidence)) return "Network Switch";
    if (device.infrastructure && /firewall/.test(evidence)) return "Firewall";
    if (/vmm?_host|vmware_vm_host|hyperv.*host|hypervisor/.test(evidence)) return "Virtualization Host";
    if (/vm_guest|virtual_machine|virtual machine/.test(evidence)) return "Virtual Machine";
    if (/windows_server|linux_server|mac_server|\bserver\b/.test(evidence)) return "Server";
    if (/windows_workstation/.test(evidence)) return /laptop|notebook|surface/.test(evidence) ? "Windows Laptop" : "Windows Workstation";
    if (/\bmac\b|macbook|imac|mac mini|macmini/.test(evidence)) return /macbook/.test(evidence) ? "Mac Laptop" : "Mac Workstation";
    if (/iphone|android|pixel|galaxy|mobile|smartphone|cell phone|samsung.*phone/.test(evidence)) return "Mobile Phone";
    if (/samsung/.test(evidence) && /wireless/i.test(String(device?.association || device?.status || ""))) return "Samsung Mobile / Consumer Device";
    if (/ipad|tablet|kindle/.test(evidence)) return "Tablet";
    if (/\butp[-_ ]?g\d+\b|unifi talk|ui talk/.test(evidence)) return "UniFi Talk Phone";
    if (/yealink|polycom|grandstream|audiocodes|voip|desk phone|ip phone|sip[-_ ]?(?:t?\d|phone)|\bmp20[12]\b/.test(evidence)) return "Desk Phone / VoIP Device";
    if (/\bphone\b/.test(evidence)) return "Desk Phone";
    if (/printer|laserjet|officejet|deskjet|brother|xerox|canon|epson|ricoh|konica|minolta|bizhub/.test(evidence)) return "Printer";
    if (/camera|protect|doorbell|g3-|g4-|g5-|ai bullet|ai pro/.test(evidence)) return "Camera";
    if (/sonos|zoneplayer|denon|soundbar|speaker|receiver|amplifier|\bamp\b|apple tv|chromecast|roku|smart tv|television/.test(evidence)) return "AV Device";
    if (/thermostat|ecobee|nest|sensor|relay|controller|home assistant|alarm|lock|lighting|smart plug|iot/.test(evidence)) return "IoT Device";
    if (/laptop|notebook/.test(evidence)) return "Laptop";
    if (/desktop|workstation|\bpc\b|all[ -]?in[ -]?one|\baio[-_ ]?\d/.test(evidence)) return "Workstation";
    return rawType && !/network client|managed-device/i.test(rawType) ? rawType.replaceAll("_", " ") : "Unclassified Client";
  };
  const valueFromRows = (rows, label) => {
    const match = (Array.isArray(rows) ? rows : []).find(row => String(row?.[0] || "").toLowerCase() === label.toLowerCase());
    return String(match?.[1] || "");
  };
  const unifiInfrastructure = (Array.isArray(details.nodes) ? details.nodes : []).map(device => ({
    name: String(device?.title || device?.name || "UniFi device"),
    type: String(device?.type || "Infrastructure"),
    address: valueFromRows(device?.rows, "IP"),
    association: valueFromRows(device?.rows, "Uplink"),
    site: portalSiteName,
    status: String(device?.status || "Unknown"),
    source: "UniFi",
    manufacturer: "Ubiquiti",
    infrastructure: true,
  }));
  const activeUnifiClients = (Array.isArray(details.clients) ? details.clients : []).map(row => ({
    ...(() => {
      const evidence = evidenceForClient(row?.[0], row?.[1]);
      const mac = String(evidence?.mac || (looksLikeMac(row?.[0]) ? row?.[0] : ""));
      return {
        mac,
        manufacturer: String(evidence?.manufacturer || ouiVendor(mac) || (/^utp[-_]/i.test(String(row?.[0] || "")) ? "Ubiquiti" : "")),
        model: String(evidence?.model || ""),
        category: String(evidence?.category || ""),
      };
    })(),
    name: String(row?.[0] || "UniFi client"),
    type: "Network client",
    address: String(row?.[1] || ""),
    association: String(row?.[2] || ""),
    site: portalSiteName,
    status: String(row?.[3] || row?.[2] || "Observed"),
    source: "UniFi",
    infrastructure: false,
  }));
  const retainedUnifiClients = clientEvidence.filter(evidence => evidence?.retained).map(evidence => ({
    mac: String(evidence?.mac || ""),
    manufacturer: String(evidence?.manufacturer || ouiVendor(evidence?.mac) || (/^utp[-_]/i.test(String(evidence?.name || "")) ? "Ubiquiti" : "")),
    model: String(evidence?.model || ""),
    category: String(evidence?.category || ""),
    name: String(evidence?.name || evidence?.mac || "Retained UniFi client"),
    type: "Network client",
    address: String(evidence?.address || ""),
    association: String(evidence?.association || ""),
    site: portalSiteName,
    status: String(evidence?.status || "Last seen"),
    source: "UniFi",
    infrastructure: false,
  }));
  const unifiClients = [...activeUnifiClients, ...retainedUnifiClients];
  const observedPortalSubnets = new Set(
    [...unifiInfrastructure, ...unifiClients]
      .map(device => ipv4Subnet24(device.address))
      .filter(Boolean)
  );
  const ninjaDevices = (Array.isArray(details.managedDeviceInventory) ? details.managedDeviceInventory : []).map(device => {
    const address = ipv4From(Array.isArray(device?.addresses) ? device.addresses.join(" ") : "");
    const retainedEvidence = evidenceForClient(device?.name, address);
    const sharesObservedPortalLan = observedPortalSubnets.has(ipv4Subnet24(address));
    const mappingScopedToPortalSite = ["matched", "single-location"].includes(String(details.ninjaOneLocationMapping || ""));
    return {
      name: String(device?.name || "Managed device"),
      type: String(device?.nodeClass || device?.category || "Managed device"),
      address,
      association: String(retainedEvidence?.association || ""),
      site: sharesObservedPortalLan || mappingScopedToPortalSite
        ? portalSiteName
        : String(device?.locationName || "NinjaOne location not mapped"),
      ninjaOneLocationName: String(device?.locationName || ""),
      status: device?.offline ? "Offline" : "Online",
      source: "NinjaOne",
      manufacturer: String(device?.manufacturer || retainedEvidence?.manufacturer || ouiVendor(retainedEvidence?.mac) || ""),
      model: String(device?.model || retainedEvidence?.model || ""),
      category: String(retainedEvidence?.category || ""),
      infrastructure: /SERVER|VM_HOST|VM_GUEST|VIRTUAL_MACHINE/i.test(String(device?.nodeClass || "")),
    };
  });
  const combined = [];
  const byIpv4 = new Map();
  const byName = new Map();
  [...unifiInfrastructure, ...unifiClients, ...ninjaDevices].forEach(device => {
    device.address = ipv4From(device.address) || String(device.address || "").trim();
    const ipKey = ipv4From(device.address);
    const nameKey = String(device.name || "").trim().toLowerCase();
    const existing = (ipKey && byIpv4.get(ipKey)) || (nameKey && !looksLikeMac(nameKey) && byName.get(nameKey));
    if (existing) {
      if (!existing.source.includes(device.source)) existing.source = `${existing.source} + ${device.source}`;
      if (looksLikeMac(existing.name) && !looksLikeMac(device.name)) existing.name = device.name;
      if (/network client/i.test(existing.type) && !/network client/i.test(device.type)) existing.type = device.type;
      if (!existing.manufacturer && device.manufacturer) existing.manufacturer = device.manufacturer;
      if (!existing.model && device.model) existing.model = device.model;
      if (!existing.category && device.category) existing.category = device.category;
      if (!existing.association && device.association) existing.association = device.association;
      if (device.source === "NinjaOne" && existing.status !== device.status) existing.status = `UniFi: ${existing.status} · NinjaOne: ${device.status}`;
      else if (existing.status === "Unknown") existing.status = device.status;
      if (ipKey) byIpv4.set(ipKey, existing);
      if (nameKey && !looksLikeMac(nameKey)) byName.set(nameKey, existing);
      return;
    }
    combined.push(device);
    if (ipKey) byIpv4.set(ipKey, device);
    if (nameKey && !looksLikeMac(nameKey)) byName.set(nameKey, device);
  });
  const deviceRank = device => {
    const type = String(device.type || "").toLowerCase();
    const name = String(device.name || "").toLowerCase();
    if (/gateway/.test(type)) return 0;
    if (/switch/.test(type) && /core|distribution|aggregation/.test(name)) return 1;
    if (/switch/.test(type)) return 2;
    if (/access point|wireless|router|firewall/.test(type)) return 3;
    if (/server|vm_host|vmm_host/.test(type)) return 4;
    if (/vm_guest|virtual_machine|virtual machine/.test(type)) return 5;
    if (device.infrastructure) return 6;
    return 10;
  };
  const rows = combined
    .sort((a, b) => deviceRank(a) - deviceRank(b) || a.site.localeCompare(b.site) || a.name.localeCompare(b.name))
    .map(device => [device.name, friendlyDeviceType(device), device.manufacturer || "-", device.address || "-", device.association || "-", device.site, device.status, device.source]);
  return `
    ${networkAtlasSectionHeading("Infrastructure and Clients", "Gateway and core infrastructure first, followed by remaining infrastructure, servers, virtual machines, and endpoint clients from UniFi and NinjaOne.")}
    ${details.ninjaOneLocationMapping === "organization-wide" ? `<div class="notice warning">NinjaOne locations did not match this portal site by name or address. Organization-wide devices are shown with their NinjaOne location so they can be mapped correctly.</div>` : ""}
    ${networkAtlasTable(["Device", "Type", "Manufacturer", "Address", "Association", "Site", "Status", "Source"], rows)}
  `;
}

function networkAtlasPanel(title, rows) {
  return `
    <div class="stack">
      ${rows.length ? rows.map(row => `
        <div class="item">
          <div class="item-line"><strong>${escapeHtml(row[0])}</strong></div>
          <div class="subtle">${escapeHtml(row[1])}</div>
        </div>
      `).join("") : `<div class="item"><strong>No records documented yet.</strong></div>`}
    </div>
  `;
}

function networkAtlasSectionHeading(title, subtitle) {
  return `
    <div class="atlas-data-heading">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
    </div>
  `;
}

function networkAtlasInlineText(value) {
  return escapeHtml(value).replace(/\b(\d{1,3}(?:\.\d{1,3}){3}(?:\/\d{1,2})?|\d{5})\b/g, "<code>$1</code>");
}

function cleanTopologyDetail(value) {
  const text = String(value || "").trim();
  if (text === "1") return "ONLINE";
  if (text === "0") return "OFFLINE";
  return text.replace(/^1\s*-\s*/i, "ONLINE - ").replace(/^0\s*-\s*/i, "OFFLINE - ");
}

function cleanTopologyNodeDetail(node = {}) {
  const detail = cleanTopologyDetail(node.detail || "");
  const kind = reportTopologyNodeKind(node);
  if (kind === "gateway") {
    return detail.replace(/\s*-\s*\d+\s+(?:connected\s+)?clients?\s*$/i, "").trim();
  }
  return detail;
}

function dedupeTopologyLinks(rawLinks = [], nodesById = {}) {
  const hierarchyRank = node => {
    const kind = reportTopologyNodeKind(node || {});
    return { wan: 0, gateway: 1, switch: 2, ap: 3, device: 4 }[kind] ?? 5;
  };
  const unique = new Map();
  rawLinks.forEach(rawLink => {
    let from = String(rawLink?.from || "");
    let to = String(rawLink?.to || "");
    if (!from || !to || from === to || !nodesById[from] || !nodesById[to]) return;
    const fromKind = reportTopologyNodeKind(nodesById[from]);
    const toKind = reportTopologyNodeKind(nodesById[to]);
    if (hierarchyRank(nodesById[from]) > hierarchyRank(nodesById[to])) [from, to] = [to, from];
    if (fromKind === "switch" && toKind === "switch") {
      const endpointCount = node => Number(String(node?.detail || "").match(/(\d+)\s+(?:directly associated )?wired endpoint/i)?.[1] || 0);
      if (endpointCount(nodesById[from]) < endpointCount(nodesById[to])) [from, to] = [to, from];
    }
    const key = [from, to].sort().join("::");
    const candidate = { ...rawLink, from, to };
    const current = unique.get(key);
    const evidenceScore = link => [link?.label, link?.detail].filter(Boolean).join(" ").length;
    if (!current || evidenceScore(candidate) > evidenceScore(current)) unique.set(key, candidate);
  });
  const deduped = [...unique.values()];
  const downstreamSwitchIds = new Set(
    deduped
      .filter(link => reportTopologyNodeKind(nodesById[link.from]) === "switch" && reportTopologyNodeKind(nodesById[link.to]) === "switch")
      .map(link => link.to)
  );
  const hasDownstreamSwitching = Object.values(nodesById).some(node => reportTopologyNodeKind(node) === "switch");
  return deduped.filter(link => {
    const fromKind = reportTopologyNodeKind(nodesById[link.from]);
    const toKind = reportTopologyNodeKind(nodesById[link.to]);
    if (fromKind === "gateway" && toKind === "switch" && downstreamSwitchIds.has(link.to)) return false;
    // Endpoint inventories can report the console as their last association even
    // when the physical cable terminates on a downstream switch. Do not turn that
    // ambiguous controller association into a false gateway-to-phone cable.
    if (hasDownstreamSwitching && fromKind === "gateway" && topologyPhoneKind(nodesById[link.to])) return false;
    return true;
  });
}

function cleanTopologySubtitle(value) {
  return String(value || "")
    .replace(/\bUDMPRO\b/g, "UDM Pro")
    .replace(/\bUS48PRO\b/g, "USW Pro 48 PoE")
    .replace(/\bUSLP8P\b/g, "USW Pro 8 PoE")
    .replace(/\bUAPA6AE\b/g, "U7 Pro XG");
}

function isPlaceholderWanNode(node = {}) {
  const text = `${node.title || ""} ${node.subtitle || ""} ${node.detail || ""}`.toLowerCase();
  return String(node.id || "") === "wan-1" && /internet\s*2|backup|alternate|wan interface/.test(text);
}

function topologyPhoneKind(record = {}) {
  const evidence = [
    record.title, record.name, record.displayName, record.hostname,
    record.type, record.category, record.nodeClass,
    record.manufacturer, record.vendor, record.model, record.deviceModel, record.product,
  ].filter(Boolean).join(" ").toLowerCase();
  if (/iphone|android|pixel|galaxy|mobile phone|smartphone|cell phone/.test(evidence)) return "Mobile Phone";
  if (/unifi talk|ui talk|\butp[-_ ]?g\d+\b/.test(evidence)) return "UniFi Talk Phone";
  if (/yealink|polycom|grandstream|audiocodes|cisco.*phone|avaya|mitel|fanvil|snom|obihai|voip|desk phone|ip phone|telephone|sip[-_ ]?(?:t?\d|phone)|\bmp20[12]\b|\bphone\b/.test(evidence)) return "Desk Phone / VoIP";
  return "";
}

function isHardwiredTopologyPhone(record = {}) {
  const kind = topologyPhoneKind(record);
  if (!kind || kind === "Mobile Phone") return false;
  const association = String(record.association || record.lastAssociation || record.uplinkName || record.connectedDeviceName || "");
  const evidence = `${association} ${record.status || ""} ${record.connectionType || ""} ${record.networkConnectionType || ""}`.toLowerCase();
  if (record.is_wired === false || /wireless|wi-?fi|access point|\bap[-_ ]/.test(evidence)) return false;
  return kind === "UniFi Talk Phone" || record.is_wired === true || /wired|switch|\bport\s*\d+/.test(evidence);
}

function wifiPowerOverrideKey(apName, band) {
  return `${String(apName || "").trim()}::${String(band || "").trim()}`;
}

function wifiRadioPowerDisplay(details, ap, radio) {
  const band = radio?.[0] || "";
  const apiPower = String(radio?.[3] || "").trim();
  const overrides = details?.wifiPowerOverrides && typeof details.wifiPowerOverrides === "object" ? details.wifiPowerOverrides : {};
  const override = String(overrides[wifiPowerOverrideKey(ap?.name, band)] || "").trim();
  const hasActualApiPower = apiPower && !/not exposed|capability/i.test(apiPower);
  return {
    value: override || (hasActualApiPower ? apiPower : ""),
    apiPower,
    placeholder: hasActualApiPower ? "" : "Set dBm",
  };
}

function updateNetworkWifiPowerOverride(clientId, snapshotId, apName, band, value) {
  const client = clientById(clientId);
  const snapshot = networkSnapshotsForClient(client).find(row => row.id === snapshotId);
  if (!client || !snapshot) return;
  if (!snapshot.details || typeof snapshot.details !== "object" || Array.isArray(snapshot.details)) snapshot.details = {};
  if (!snapshot.details.wifiPowerOverrides || typeof snapshot.details.wifiPowerOverrides !== "object" || Array.isArray(snapshot.details.wifiPowerOverrides)) {
    snapshot.details.wifiPowerOverrides = {};
  }
  const key = wifiPowerOverrideKey(apName, band);
  const cleanValue = String(value || "").trim();
  if (cleanValue) snapshot.details.wifiPowerOverrides[key] = cleanValue;
  else delete snapshot.details.wifiPowerOverrides[key];
  saveState();
  if (activeView === "client-dashboard") renderClientDashboard();
  else renderNetworkAtlas();
}

function normalizeNetworkLabel(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function betterRadioRow(existing = [], candidate = []) {
  if (!existing.length) return candidate;
  const existingChannel = String(existing[1] || "").toLowerCase();
  const candidateChannel = String(candidate[1] || "").toLowerCase();
  if (existingChannel === "auto" && candidateChannel && candidateChannel !== "auto") return candidate;
  if ((!existing[2] || existing[2] === "-") && candidate[2] && candidate[2] !== "-") return candidate;
  return existing;
}

function normalizedWifiPlan(details = {}) {
  const clientRows = Array.isArray(details.clients) ? details.clients : [];
  const wirelessClientCounts = new Map();
  clientRows.forEach(row => {
    const association = normalizeNetworkLabel(row?.[2]);
    const status = normalizeNetworkLabel(row?.[3]);
    if (!association || (status && !status.includes("wireless"))) return;
    (details.wifiPlan || []).forEach(ap => {
      const apKey = normalizeNetworkLabel(ap?.name);
      if (apKey && association.includes(apKey)) wirelessClientCounts.set(apKey, (wirelessClientCounts.get(apKey) || 0) + 1);
    });
  });

  return (Array.isArray(details.wifiPlan) ? details.wifiPlan : []).map(ap => {
    const radiosByBand = new Map();
    (Array.isArray(ap.radios) ? ap.radios : []).forEach(radio => {
      const band = String(radio?.[0] || "").replace(/ghz/i, "").trim();
      if (!band) return;
      const existing = radiosByBand.get(band) || [];
      radiosByBand.set(band, betterRadioRow(existing, radio));
    });
    const apKey = normalizeNetworkLabel(ap.name);
    return {
      ...ap,
      clients: wirelessClientCounts.get(apKey) ?? ap.clients ?? 0,
      radios: [...radiosByBand.entries()]
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, radio]) => {
          const apiPower = String(radio[3] || "").trim();
          return [
            radio[0],
            radio[1],
            radio[2],
            /capability/i.test(apiPower) ? "Not exposed" : apiPower,
            radio[4],
          ];
        }),
    };
  });
}

function parsedSecurityRule(row = [], index = 0) {
  const title = String(row?.[0] || "Security item").trim();
  const detail = String(row?.[1] || "").trim();
  const [, prefix = "", name = title] = title.match(/^(Policy|ACL|Zone|Rule):\s*(.+)$/i) || [];
  const actionMatch = detail.match(/\b(allow|accept|drop|deny|reject|block|disabled|enabled)\b/i);
  const sourceMatch = detail.match(/From\s+(.+?)(?:\s+To\s+|$)/i);
  const destinationMatch = detail.match(/To\s+(.+?)(?:,\s*|\s+-\s+|$)/i);
  const isPolicy = Boolean(prefix) || /\b(from|to|allow|drop|deny|reject|block)\b/i.test(detail);
  return {
    id: prefix ? prefix : isPolicy ? `Rule ${index + 1}` : "Network",
    name,
    note: detail || "Documented in snapshot",
    source: sourceMatch?.[1] || (isPolicy ? "Any / defined source" : "-"),
    destination: destinationMatch?.[1] || (isPolicy ? "Defined destination" : detail || "-"),
    action: actionMatch ? actionMatch[1].replace(/^accept$/i, "Allow").replace(/^deny$|^reject$|^block$/i, "Drop") : (isPolicy ? "Review" : "Documented"),
  };
}

function derivedSecurityPlan(details = {}) {
  const rows = Array.isArray(details.security) ? details.security : [];
  if (!rows.length) return null;
  const networkRows = rows.filter(row => !/^(Policy|ACL|Zone|Rule):/i.test(String(row?.[0] || "")));
  const ruleRows = rows.filter(row => /^(Policy|ACL|Rule):/i.test(String(row?.[0] || "")) || /\b(from|to|allow|drop|deny|reject|block)\b/i.test(String(row?.[1] || "")));
  const trustedRow = networkRows[0] || rows[0] || ["Primary network", "Documented network"];
  const secondaryRow = networkRows[1] || ["Additional networks", `${Math.max(0, networkRows.length - 1)} additional documented network${networkRows.length === 2 ? "" : "s"}`];
  const rules = (ruleRows.length ? ruleRows : rows).map(parsedSecurityRule);
  const recommendations = [];
  if (networkRows.length <= 1) {
    recommendations.push({
      severity: "medium",
      title: "Confirm segmentation scope",
      evidence: "The snapshot exposes one primary network or incomplete VLAN details.",
      recommendation: "Confirm whether servers, guest Wi-Fi, IoT, cameras, and payment/office endpoints should be separated into distinct VLANs before documenting this as acceptable.",
    });
  }
  if (!ruleRows.length) {
    recommendations.push({
      severity: "info",
      title: "Pull full firewall policy export",
      evidence: "No detailed firewall policy rows were available in this retained snapshot.",
      recommendation: "Use the UniFi policy export/API fields for ordered rules, match criteria, logging, source, destination, and ports before making security conclusions.",
    });
  }
  return {
    title: "Network Security",
    subtitle: "Retained networks, zones, and access policies from this snapshot.",
    trusted: { title: trustedRow[0] || "Primary network", subtitle: trustedRow[1] || "Documented network" },
    iot: { title: secondaryRow[0] || "Additional networks", subtitle: secondaryRow[1] || "Documented network" },
    rules,
    recommendations,
  };
}

function intrusionProtectionDetails(details = {}) {
  const direct = details.intrusionProtection && typeof details.intrusionProtection === "object" ? details.intrusionProtection : null;
  const rows = Array.isArray(details.security) ? details.security : [];
  const statusRow = rows.find(row => /intrusion protection|ids|ips|threat management/i.test(String(row?.[0] || "")));
  const eventsRow = rows.find(row => /intrusion events|ids\/ips event|threat events/i.test(String(row?.[0] || "")));
  const status = String(direct?.status || statusRow?.[1] || "Not exposed").trim() || "Not exposed";
  const recentEvents = Number(direct?.recentEvents ?? "");
  return {
    status,
    mode: String(direct?.mode || "").trim(),
    sensitivity: String(direct?.sensitivity || "").trim(),
    signatureVersion: String(direct?.signatureVersion || "").trim(),
    categories: String(direct?.categories || "").trim(),
    recentEvents: Number.isFinite(recentEvents) ? recentEvents : 0,
    eventTypes: Array.isArray(direct?.eventTypes) ? direct.eventTypes : [],
    evidence: String(direct?.evidence || "").trim(),
    statusDetail: String(statusRow?.[1] || "").trim(),
    eventsDetail: String(eventsRow?.[1] || "").trim(),
  };
}

function intrusionProtectionNeedsAction(intrusion = {}) {
  const text = `${intrusion.status || ""} ${intrusion.evidence || ""} ${intrusion.statusDetail || ""}`.toLowerCase();
  return !text.trim() || /not exposed|unclear|disabled|not clearly|missing|no retained|not enabled/.test(text);
}

function intrusionProtectionPanel(details = {}) {
  const intrusion = intrusionProtectionDetails(details);
  const needsAction = intrusionProtectionNeedsAction(intrusion);
  const modeText = [intrusion.mode, intrusion.sensitivity ? `Sensitivity ${intrusion.sensitivity}` : ""].filter(Boolean).join(" / ") || "Not documented";
  const signatureText = intrusion.signatureVersion || intrusion.categories || "Not documented";
  const eventsText = intrusion.eventsDetail || `${intrusion.recentEvents} retained IDS/IPS event${intrusion.recentEvents === 1 ? "" : "s"}`;
  return `
    <div class="intrusion-panel ${needsAction ? "warn" : "good"}">
      <div class="intrusion-panel-head">
        <div>
          <span>Intrusion Protection</span>
          <strong>${escapeHtml(intrusion.status)}</strong>
        </div>
        <span class="badge ${needsAction ? "warn" : "good"}">${needsAction ? "Review" : "Captured"}</span>
      </div>
      <div class="intrusion-evidence-grid">
        <article><span>Mode</span><strong>${escapeHtml(modeText)}</strong></article>
        <article><span>Signatures / Rules</span><strong>${escapeHtml(signatureText)}</strong></article>
        <article><span>Recent Events</span><strong>${escapeHtml(eventsText)}</strong></article>
      </div>
      ${needsAction ? `<p>Confirm IDS/IPS or Threat Management enabled state, detect versus prevent mode, protected networks, ruleset currency, logging, exclusions, and gateway performance impact.</p>` : ""}
    </div>
  `;
}

function securityEvidenceGroups(details = {}) {
  const rows = Array.isArray(details.security) ? details.security : [];
  const intrusionRows = [];
  const networkRows = [];
  const policyRows = [];
  const zoneRows = [];
  const aclRows = [];
  const otherRows = [];
  rows.forEach(row => {
    const label = String(row?.[0] || "");
    if (/intrusion|ids|ips|threat/i.test(label)) intrusionRows.push(row);
    else if (/^zone:/i.test(label)) zoneRows.push(row);
    else if (/^policy:/i.test(label)) policyRows.push(row);
    else if (/^acl:/i.test(label)) aclRows.push(row);
    else if (/source|detailed policy|demo/i.test(label)) otherRows.push(row);
    else networkRows.push(row);
  });
  return { intrusionRows, networkRows, zoneRows, policyRows, aclRows, otherRows };
}

function securityEvidenceTable(title, rows = [], emptyText = "No retained evidence in this category.") {
  return `
    <section class="security-evidence-card">
      <div class="security-evidence-head">
        <h3>${escapeHtml(title)}</h3>
        <span>${rows.length}</span>
      </div>
      <div class="security-evidence-list">
        ${rows.length ? rows.map(row => `
          <article>
            <strong>${escapeHtml(String(row?.[0] || "-").replace(/^(Policy|ACL|Zone):\s*/i, ""))}</strong>
            <span>${escapeHtml(row?.[1] || "-")}</span>
          </article>
        `).join("") : `<article><strong>${escapeHtml(emptyText)}</strong><span>Pull a newer snapshot or use the local collector if this data is required.</span></article>`}
      </div>
    </section>
  `;
}

function securityPostureSummary(details = {}) {
  const groups = securityEvidenceGroups(details);
  const intrusion = intrusionProtectionDetails(details);
  const policies = groups.policyRows.length + groups.aclRows.length;
  return `
    <div class="security-posture-summary">
      <article>
        <span>Networks</span>
        <strong>${groups.networkRows.length}</strong>
        <small>Retained network/VLAN records</small>
      </article>
      <article>
        <span>Zones</span>
        <strong>${groups.zoneRows.length}</strong>
        <small>Firewall zone records</small>
      </article>
      <article>
        <span>Policies</span>
        <strong>${policies}</strong>
        <small>Firewall/ACL evidence rows</small>
      </article>
      <article>
        <span>IDS/IPS</span>
        <strong>${escapeHtml(intrusion.status || "Not exposed")}</strong>
        <small>${escapeHtml(intrusion.mode || intrusion.eventsDetail || "Snapshot evidence")}</small>
      </article>
    </div>
  `;
}

function networkAtlasWifiPlan(details) {
  const aps = normalizedWifiPlan(details);
  if (!aps.length) {
    return networkAtlasTable(["Access Point", "Switch Port", "Clients", "2.4 GHz", "5 GHz", "6 GHz"], details.wifi || []);
  }
  const clientId = selectedNetworkAtlasClientId || selectedClientId;
  const snapshotId = details.snapshotId || selectedNetworkSnapshotId || "";

  return `
    <section class="atlas-data-section">
      ${networkAtlasSectionHeading("WiFi Radio Plan", `Channel and width snapshot across ${aps.length} AP${aps.length === 1 ? "" : "s"}. Transmit power can be recorded manually when UniFi does not expose the configured value.`)}
      <div class="wifi-grid">
        ${aps.map(ap => `
          <article class="ap-panel">
            <div class="ap-head">
              <div>
                <div class="ap-title">${escapeHtml(ap.name)}</div>
                <div class="panel-sub">${escapeHtml(ap.clients)} clients - switch port ${escapeHtml(ap.port)}</div>
              </div>
              <div class="ap-uplink">${escapeHtml(ap.uplink || "2.5 GbE")}</div>
            </div>
            <div class="radio-table">
              ${(ap.radios || []).map(radio => {
                const utilization = Number(radio[4] || 0);
                const power = wifiRadioPowerDisplay(details, ap, radio);
                return `
                  <div class="radio-row">
                    <div class="band-label">${escapeHtml(radio[0])} GHz</div>
                    <div class="radio-value"><strong>Ch ${escapeHtml(radio[1])}</strong><span>Channel</span></div>
                    <div class="radio-value"><strong>${escapeHtml(radio[2])}</strong><span>Width</span></div>
                    <div class="radio-value">
                      <label class="radio-power-field">
                        <input
                          type="text"
                          value="${escapeHtml(power.value)}"
                          placeholder="${escapeHtml(power.placeholder)}"
                          data-network-wifi-power-client="${escapeHtml(clientId)}"
                          data-network-wifi-power-snapshot="${escapeHtml(snapshotId)}"
                          data-network-wifi-power-ap="${escapeHtml(ap.name)}"
                          data-network-wifi-power-band="${escapeHtml(radio[0])}"
                          aria-label="${escapeHtml(`${ap.name} ${radio[0]} GHz transmit power`)}"
                        >
                        <span>Transmit power</span>
                      </label>
                      ${power.apiPower && power.apiPower !== power.value ? `<small class="radio-api-power">API: ${escapeHtml(power.apiPower)}</small>` : ""}
                      <div class="util-meter ${utilization > 60 ? "high" : ""}"><span style="width:${Math.max(0, Math.min(100, utilization))}%"></span></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function networkAtlasSecurityPlan(details) {
  const groups = securityEvidenceGroups(details);
  const hasEvidence = Object.values(groups).some(rows => rows.length);
  if (!hasEvidence) return networkAtlasPanel("Security", details.security || []);

  return `
    <section class="atlas-data-section">
      ${networkAtlasSectionHeading("Security Posture", "Observed intrusion-protection, segmentation, zone, firewall, and ACL evidence from the selected snapshot. Recommendations are tracked in Action Plan.")}
      ${intrusionProtectionPanel(details)}
      ${securityPostureSummary(details)}
      <div class="security-evidence-grid">
        ${securityEvidenceTable("Networks", groups.networkRows, "No network/VLAN rows retained.")}
        ${securityEvidenceTable("Firewall Zones", groups.zoneRows, "No firewall zone rows retained.")}
        ${securityEvidenceTable("Firewall Policies", groups.policyRows, "No firewall policy rows retained.")}
        ${securityEvidenceTable("ACL Rules", groups.aclRows, "No ACL rows retained.")}
        ${groups.otherRows.length ? securityEvidenceTable("Connector Notes", groups.otherRows) : ""}
      </div>
    </section>
  `;
}

function actionPlanSourceItems(details = {}) {
  const auditFindings = Array.isArray(details.auditFindings) ? details.auditFindings : [];
  const auditActions = Array.isArray(details.auditActions) ? details.auditActions : [];
  if (auditFindings.length || auditActions.length) {
    const findingsById = new Map(auditFindings.map(finding => [String(finding.id || ""), finding]));
    const severityRank = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
    const actionItems = auditActions.map((action, index) => {
      const related = (Array.isArray(action.findingIds) ? action.findingIds : []).map(id => findingsById.get(String(id))).filter(Boolean);
      const highest = related.slice().sort((a, b) => (severityRank[String(b.severity || "info").toLowerCase()] || 0) - (severityRank[String(a.severity || "info").toLowerCase()] || 0))[0];
      const evidenceItems = related.flatMap(finding => Array.isArray(finding.evidence) ? finding.evidence : [finding.evidence]).filter(Boolean).slice(0, 3);
      return {
        id: action.id || `audit-action-${index + 1}`,
        severity: String(highest?.severity || (action.priority === "immediate" ? "high" : "medium")).toUpperCase(),
        title: action.title || "Audit remediation",
        evidence: evidenceItems.join("; ") || "Action produced from the retained audit evidence.",
        evidenceItems,
        steps: Array.isArray(action.steps) ? action.steps.slice(0, 5) : [],
        verification: action.verification || "",
        rollback: action.rollback || "",
        priority: action.priority || "planned",
        changeRisk: action.changeRisk || "unknown",
        recommendation: (Array.isArray(action.steps) ? action.steps[0] : "") || highest?.recommendation || "Review and remediate this finding.",
        source: `OpenAI network audit · ${action.priority || "planned"} · ${action.changeRisk || "unknown"} change risk`,
        category: highest?.category || "general",
      };
    });
    const actionFindingIds = new Set(auditActions.flatMap(action => Array.isArray(action.findingIds) ? action.findingIds.map(String) : []));
    const standaloneFindings = auditFindings.filter(finding => !actionFindingIds.has(String(finding.id || ""))).map((finding, index) => ({
      id: finding.id || `audit-finding-${index + 1}`,
      severity: String(finding.severity || "info").toUpperCase(),
      title: finding.title || "Audit finding",
      evidence: (Array.isArray(finding.evidence) ? finding.evidence : [finding.evidence]).filter(Boolean).join("; "),
      evidenceItems: (Array.isArray(finding.evidence) ? finding.evidence : [finding.evidence]).filter(Boolean).slice(0, 3),
      recommendation: [finding.recommendation, finding.verification ? `Verify: ${finding.verification}` : ""].filter(Boolean).join(" "),
      source: `OpenAI network audit · ${finding.confidence || "unknown"} confidence`,
      category: finding.category || "general",
    }));
    return [...actionItems, ...standaloneFindings];
  }
  const plan = details.securityPlan || {};
  const recommendations = Array.isArray(details.securityRecommendations) && details.securityRecommendations.length
    ? details.securityRecommendations
    : Array.isArray(plan.recommendations) ? plan.recommendations : [];
  const recommendationItems = recommendations.map((item, index) => ({
    id: `ai-${index + 1}`,
    severity: String(item.severity || "info").toUpperCase(),
    title: item.title || "Recommended review",
    evidence: item.evidence || "",
    recommendation: item.recommendation || "",
    source: "AI snapshot review",
  }));
  const ruleItems = Array.isArray(plan.rules) && /recommend|proposed|segmentation|policy plan/i.test(`${plan.title || ""} ${plan.subtitle || ""}`)
    ? plan.rules.map((rule, index) => ({
        id: `ai-rule-${index + 1}`,
        severity: "MEDIUM",
        title: rule.name || rule.title || "Recommended security change",
        evidence: rule.note || rule.source || "",
        recommendation: [rule.action, rule.destination].filter(Boolean).join(" - ") || "Review and validate this proposed security policy before implementation.",
        source: "AI security plan",
      }))
    : [];
  return [...recommendationItems, ...ruleItems];
}

function networkAuditOverview(details = {}) {
  let summary = details.auditSummary && typeof details.auditSummary === "object" ? details.auditSummary : null;
  let findings = Array.isArray(details.auditFindings) ? details.auditFindings : [];
  let coverageGaps = Array.isArray(details.auditCoverageGaps) ? details.auditCoverageGaps : [];
  let preliminary = false;
  if (!summary && !findings.length) {
    preliminary = true;
    const derived = generatedActionPlanItems(details).filter(item => /critical|high|medium/i.test(item.severity || ""));
    findings = derived.slice(0, 8).map((item, index) => ({
      id: item.id || `derived-${index + 1}`,
      severity: String(item.severity || "medium").toLowerCase(),
      category: item.category || "visibility-gap",
      confidence: "preliminary",
      title: item.title,
      evidence: [item.evidence].filter(Boolean),
    }));
    coverageGaps = ["A complete AI evidence review was not retained with this snapshot. Pull a new snapshot to replace this preliminary assessment."];
    const high = findings.filter(item => /critical|high/i.test(item.severity || "")).length;
    const medium = findings.filter(item => /medium/i.test(item.severity || "")).length;
    summary = {
      posture: "preliminary assessment",
      riskScore: Math.min(100, 20 + high * 15 + medium * 8),
      confidence: "preliminary",
      executiveSummary: "This score is derived from retained configuration and visibility signals. A new audited snapshot will replace it with the full evidence-based assessment.",
    };
  }
  const ordered = findings.slice().sort((a, b) => ({ critical: 5, high: 4, medium: 3, low: 2, info: 1 }[String(b.severity || "info").toLowerCase()] || 0) - ({ critical: 5, high: 4, medium: 3, low: 2, info: 1 }[String(a.severity || "info").toLowerCase()] || 0));
  return `
    <section class="network-audit-overview">
      <div class="network-audit-head">
        <div><span class="eyebrow">Evidence-based network audit</span><h2>${escapeHtml(summary?.posture ? String(summary.posture).replace(/-/g, " ") : "Audit findings")}</h2></div>
        <div class="network-risk-score"><strong>${escapeHtml(summary?.riskScore ?? "–")}</strong><span>${preliminary ? "Preliminary risk" : "Risk"} / 100</span></div>
      </div>
      ${summary?.executiveSummary ? `<p class="network-audit-summary">${escapeHtml(summary.executiveSummary)}</p>` : ""}
      <div class="network-audit-meta">
        <span>Confidence: <strong>${escapeHtml(summary?.confidence || "not stated")}</strong></span>
        <span>${findings.length} finding${findings.length === 1 ? "" : "s"}</span>
        <span>${coverageGaps.length} evidence gap${coverageGaps.length === 1 ? "" : "s"}</span>
      </div>
      <div class="network-audit-finding-grid">
        ${ordered.slice(0, 6).map(finding => `
          <article class="network-audit-finding ${escapeHtml(String(finding.severity || "info").toLowerCase())}">
            <div><span>${escapeHtml(finding.category || "audit")}</span><span>${escapeHtml(finding.confidence || "unknown")} confidence</span></div>
            <h3>${escapeHtml(finding.title || "Audit finding")}</h3>
            <p>${escapeHtml((Array.isArray(finding.evidence) ? finding.evidence : [finding.evidence]).filter(Boolean).join("; ") || "No evidence statement returned.")}</p>
            <strong>${escapeHtml(String(finding.severity || "info").toUpperCase())}</strong>
          </article>`).join("")}
      </div>
      ${coverageGaps.length ? `<details class="network-audit-gaps"><summary>Audit evidence gaps</summary><ul>${coverageGaps.map(gap => `<li>${escapeHtml(gap)}</li>`).join("")}</ul></details>` : ""}
    </section>`;
}

function networkAuditWorkspace(client, details = {}) {
  const riskActive = selectedNetworkAuditView === "risk";
  return `
    <section class="network-audit-workspace">
      <header class="network-audit-workspace-head">
        <div><span class="eyebrow">Audit</span><h2>Network Risk &amp; Remediation</h2><p>Evidence-based findings and the work required to reduce risk.</p></div>
      </header>
      <nav class="network-audit-view-tabs" aria-label="Audit sections">
        <button type="button" class="${riskActive ? "active" : ""}" data-network-audit-view="risk" aria-selected="${riskActive}">
          <span>01</span><div><strong>Risk Assessment</strong><small>Findings, confidence, and evidence gaps</small></div>
        </button>
        <button type="button" class="${riskActive ? "" : "active"}" data-network-audit-view="remediation" aria-selected="${!riskActive}">
          <span>02</span><div><strong>Remediation Plan</strong><small>Prioritized actions and validation steps</small></div>
        </button>
      </nav>
      <div class="network-audit-view-panel">
        ${riskActive ? networkAuditOverview(details) : networkActionPlan(client, details)}
      </div>
    </section>`;
}

function actionPlanCategory(item = {}) {
  const explicit = String(item.category || "").toLowerCase();
  if (["general", "wifi", "sonos", "security", "performance"].includes(explicit)) return explicit;
  if (["reliability", "configuration", "visibility-gap"].includes(explicit)) return "general";
  const text = `${item.title || ""} ${item.evidence || ""} ${item.recommendation || ""}`.toLowerCase();
  if (/sonos|zoneplayer|sonosnet|sonos.*port|port.*sonos|sonos amp|ssdp.*sonos|sonos.*ssdp|speaker discovery|airplay/.test(`${item.title || ""} ${item.recommendation || ""}`.toLowerCase())) return "sonos";
  if (/wi-?fi|wireless|ssid|radio|channel|ap\b|access point|wpa|client steering|roam/.test(text)) return "wifi";
  if (/security|policy|firewall|vpn|gateway exposure|credential|least.?privilege|segment|zone|vlan|allow|deny|block|intrusion|ids|ips|threat|detection|protection/.test(text)) return "security";
  if (/performance|wan|latency|100\s*mb|1\s*gb|10\s*gb|uplink|throughput|capacity|speed|firmware|version/.test(text)) return "performance";
  return "general";
}

function sonosCandidateRows(details = {}) {
  const clients = Array.isArray(details.clients) ? details.clients : [];
  const ports = Array.isArray(details.ports) ? details.ports : [];
  const clientRows = clients
    .filter(row => /sonos|zoneplayer|play:|connect:|sonos.*port|port.*sonos|amp\b|arc\b|beam\b|sub\b/i.test(row.map(cell => String(cell || "")).join(" ")))
    .map(row => ({
      name: row[0] || "Sonos endpoint",
      address: row[1] || "-",
      association: row[2] || "-",
      status: row[3] || "-",
    }));
  const portRows = ports
    .filter(row => /sonos|zoneplayer|play:|connect:|sonos.*port|port.*sonos|amp\b|arc\b|beam\b|sub\b/i.test(row.map(cell => String(cell || "")).join(" ")))
    .map(row => ({
      port: row[0] || "-",
      state: row[1] || "-",
      speed: row[2] || "-",
      purpose: row[3] || "-",
    }));
  return { clients: clientRows, ports: portRows };
}

function generatedActionPlanItems(details = {}) {
  const items = [];
  const ports = Array.isArray(details.ports) ? details.ports : [];
  const wifiPlan = Array.isArray(details.wifiPlan) ? details.wifiPlan : [];
  const clients = Array.isArray(details.clients) ? details.clients : [];
  const sonos = sonosCandidateRows(details);
  const intrusionProtection = intrusionProtectionDetails(details);
  const unknownPorts = ports.filter(row => ["", "-", "unknown"].includes(String(row?.[3] || "").trim().toLowerCase())).length;
  const hundredMegPorts = ports.filter(row => /100\s*MbE/i.test(String(row?.[2] || ""))).length;

  items.push({
    id: "general-baseline",
    severity: "MEDIUM",
    title: "Keep a before-and-after change record",
    evidence: details.snapshotCapturedAt ? `Current snapshot: ${networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt })}.` : "No current snapshot timestamp is available.",
    recommendation: "Before applying fixes, retain the current snapshot as the baseline, then pull a new snapshot after each change window so topology, ports, clients, Wi-Fi, and security findings can be compared.",
    source: "Portal best practice",
    category: "general",
  });

  if (unknownPorts) {
    items.push({
      id: "general-port-labels",
      severity: "MEDIUM",
      title: "Label unclear switch ports and endpoints",
      evidence: `${unknownPorts} port row${unknownPorts === 1 ? "" : "s"} do not have a clear connected device or purpose.`,
      recommendation: "Trace those ports, assign device names or approved port profiles, and document unmanaged switches or pass-through devices before treating the inventory as complete.",
      source: "Portal derived check",
      category: "general",
    });
  }

  if (wifiPlan.length) {
    const channelFindings = Array.isArray(details.wifiChannelFindings) ? details.wifiChannelFindings : [];
    channelFindings.forEach((finding, index) => {
      items.push({
        id: `wifi-channel-${index + 1}`,
        severity: String(finding.severity || "MEDIUM").toUpperCase(),
        title: finding.title || "Review Wi-Fi channel plan",
        evidence: finding.evidence || "The retained AP radio plan indicates possible channel overlap or incomplete radio evidence.",
        recommendation: finding.recommendation || "Validate channel, width, and power in UniFi, then tune one AP at a time and pull a new snapshot after changes.",
        source: "Portal derived Wi-Fi channel analysis",
        category: "wifi",
      });
    });
    items.push({
      id: "wifi-balance",
      severity: "LOW",
      title: "Validate wireless client distribution",
      evidence: `${wifiPlan.length} AP${wifiPlan.length === 1 ? "" : "s"} are present in the retained radio plan, with ${clients.length} retained client${clients.length === 1 ? "" : "s"}.`,
      recommendation: "Review each AP client count, channel width, and manual transmit-power override after business hours. Tune one AP at a time and verify roaming before changing the next AP.",
      source: "Portal derived check",
      category: "wifi",
    });
  }

  if (sonos.clients.length || sonos.ports.length) {
    const wiredCount = sonos.clients.filter(row => /wired|switch|port/i.test(`${row.association} ${row.status}`)).length || sonos.ports.length;
    const wirelessCount = sonos.clients.filter(row => /wireless|wi-?fi|ap-|ssid/i.test(`${row.association} ${row.status}`)).length;
    items.push({
      id: "sonos-review",
      severity: "MEDIUM",
      title: "Review Sonos Amp discovery and loop risk",
      evidence: `Detected ${sonos.clients.length || sonos.ports.length} Sonos-like endpoint${(sonos.clients.length || sonos.ports.length) === 1 ? "" : "s"}${wiredCount || wirelessCount ? ` (${wiredCount} wired/reference-port, ${wirelessCount} wireless-like).` : "."}`,
      recommendation: "Confirm Sonos Amps and controllers are on the intended network, document which units are wired, verify mDNS/SSDP and phone-app discovery paths, and check switch/STP behavior before mixing wired Sonos with wireless SonosNet. If any Amp is wired, avoid unmanaged switch loops and confirm only intended Sonos radios participate.",
      source: "Portal derived Sonos check",
      category: "sonos",
    });
  }

  if (hundredMegPorts) {
    items.push({
      id: "performance-100m",
      severity: "LOW",
      title: "Review active 100 MbE links",
      evidence: `${hundredMegPorts} active or retained port row${hundredMegPorts === 1 ? "" : "s"} show 100 MbE.`,
      recommendation: "Treat 100 MbE as acceptable for known low-speed devices only. For uplinks, APs, cameras, workstations, and downstream switches, inspect cabling, termination, port negotiation, and device capability.",
      source: "Portal derived check",
      category: "performance",
    });
  }

  const sourceAlreadyCoversIntrusion = actionPlanSourceItems(details).some(item => /intrusion|ids|ips|threat management|threat protection/i.test(`${item.title || ""} ${item.evidence || ""} ${item.recommendation || ""}`));
  const intrusionStatus = String(intrusionProtection.status || "").trim();
  if (!sourceAlreadyCoversIntrusion && intrusionProtectionNeedsAction(intrusionProtection)) {
    items.push({
      id: "security-intrusion-protection",
      severity: /disabled/i.test(intrusionStatus) ? "HIGH" : "MEDIUM",
      title: "Verify UniFi intrusion protection coverage",
      evidence: `IDS/IPS snapshot evidence: ${intrusionProtection.evidence || intrusionProtection.statusDetail || intrusionStatus || "not clear"}. ${intrusionProtection.eventsDetail || ""}`.trim(),
      recommendation: "Confirm whether UniFi Intrusion Detection/Prevention or Threat Management is enabled, document detect versus prevent mode, protected networks, sensitivity, signature/ruleset update state, logging, exclusions, recent events, and gateway performance impact. Pull a new snapshot after the connector or local collector exposes those fields.",
      source: "Portal derived intrusion-protection check",
      category: "security",
    });
  } else if (!sourceAlreadyCoversIntrusion) {
    items.push({
      id: "security-intrusion-review",
      severity: "LOW",
      title: "Review IDS/IPS event history and exclusions",
      evidence: `IDS/IPS status: ${intrusionProtection.evidence || intrusionStatus}. ${intrusionProtection.eventsDetail || `${intrusionProtection.recentEvents} retained event${intrusionProtection.recentEvents === 1 ? "" : "s"}.`}`,
      recommendation: "Review recent threat events, suppression/exclusion rules, protected networks, and alert logging before closing the network security audit.",
      source: "Portal derived intrusion-protection check",
      category: "security",
    });
  }

  if (!actionPlanSourceItems(details).some(item => actionPlanCategory(item) === "security")) {
    items.push({
      id: "security-export",
      severity: "MEDIUM",
      title: "Export policy details before making firewall changes",
      evidence: "The snapshot view can summarize network policy state, but detailed rule order, match criteria, logging, and object membership may require a full controller export.",
      recommendation: "Pull the ordered firewall policy export, confirm business dependencies, then convert broad access into least-privilege rules in a staged change window.",
      source: "Portal best practice",
      category: "security",
    });
  }

  return items;
}

function networkActionPlanCategories(details = {}) {
  const sonos = sonosCandidateRows(details);
  const hasSonos = Boolean(sonos.clients.length || sonos.ports.length);
  const categories = {
    general: [],
    wifi: [],
    security: [],
    performance: [],
  };
  if (hasSonos) categories.sonos = [];
  actionPlanSourceItems(details).forEach(item => {
    const category = item.category ? actionPlanCategory({ category: item.category }) : actionPlanCategory(item);
    categories[category === "sonos" && !hasSonos ? "general" : category].push(item);
  });
  generatedActionPlanItems(details).forEach(item => {
    const category = item.category || actionPlanCategory(item);
    if (!categories[category]) categories.general.push(item);
    else categories[category].push(item);
  });
  return categories;
}

function networkActionPlanTabs(categories) {
  const tabOrder = [
    ["general", "General"],
    ["wifi", "Wi-Fi"],
    ["security", "Security"],
    ["performance", "Performance"],
  ];
  if (categories.sonos) tabOrder.splice(2, 0, ["sonos", "Sonos"]);
  return tabOrder.map(([key, label]) => `
    <button type="button" class="${selectedNetworkActionTab === key ? "active" : ""}" data-network-action-tab="${key}">
      ${label}<span>${(categories[key] || []).length}</span>
    </button>
  `).join("");
}

function networkActionPlanMarkdown(client, details = {}) {
  const categories = networkActionPlanCategories(details);
  const snapshotLabel = details.snapshotLabel || "Network snapshot";
  const captured = details.snapshotCapturedAt ? networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }) : "Not captured";
  const lines = [
    `# ${client?.name || "Client"} Network Action Plan`,
    "",
    `Snapshot: ${snapshotLabel}`,
    `Captured: ${captured}`,
    ...(details.controllerUrl ? [`UniFi Network: ${details.controllerUrl}`] : []),
    "",
    "Use this as the working brief for reviewing, prioritizing, and resolving network findings. Validate all changes against the live controller before implementation.",
    "",
  ];

  const markdownSections = {
    general: "General",
    wifi: "Wi-Fi",
    security: "Security",
    performance: "Performance",
  };
  if (categories.sonos) markdownSections.sonos = "Sonos";
  Object.entries(markdownSections).forEach(([key, label]) => {
    lines.push(`## ${label}`, "");
    const items = categories[key] || [];
    if (!items.length) {
      lines.push("- No open recommendations in this category.", "");
      return;
    }
    items.forEach((item, index) => {
      lines.push(`${index + 1}. [${item.severity || "INFO"}] ${item.title || "Recommended review"}`);
      if (item.evidence) lines.push(`   Evidence: ${item.evidence}`);
      if (item.recommendation) lines.push(`   Recommendation: ${item.recommendation}`);
      if (item.source) lines.push(`   Source: ${item.source}`);
      lines.push("");
    });
  });

  return lines.join("\n");
}

function markdownText(value = "") {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function markdownTableCell(value = "") {
  return markdownText(value)
    .replace(/\n+/g, "<br>")
    .replace(/\|/g, "\\|") || "-";
}

function markdownTable(headers = [], rows = []) {
  if (!rows.length) return "_No retained rows._\n";
  const headerRow = `| ${headers.map(markdownTableCell).join(" |")} |`;
  const divider = `| ${headers.map(() => "---").join(" |")} |`;
  const bodyRows = rows.map(row => `| ${headers.map((_, index) => markdownTableCell(Array.isArray(row) ? row[index] : "")).join(" |")} |`);
  return [headerRow, divider, ...bodyRows].join("\n");
}

function rowsFromNode(node = {}) {
  return (Array.isArray(node.rows) ? node.rows : []).map(row => `  - ${markdownText(row?.[0] || "Field")}: ${markdownText(row?.[1] || "-")}`);
}

function networkSnapshotCodexBriefMarkdown(client, details = {}) {
  const categories = networkActionPlanCategories(details);
  const groups = securityEvidenceGroups(details);
  const intrusion = intrusionProtectionDetails(details);
  const topology = details.topologyPlan && typeof details.topologyPlan === "object" ? details.topologyPlan : {};
  const drBackup = details.drBackup && typeof details.drBackup === "object" ? details.drBackup : null;
  const notes = Array.isArray(details.snapshotNotes) ? details.snapshotNotes : [];
  const lines = [
    `# ${client?.name || "Client"} Complete Network Snapshot Brief`,
    "",
    "Use this brief in a Codex chat to review, fix, improve, or document this client network. Treat observed snapshot data as evidence. Treat Action Plan items as recommendations requiring live-controller validation before implementation.",
    "",
    "## Snapshot Metadata",
    "",
    `- Client: ${client?.name || "-"}`,
    `- Snapshot: ${details.snapshotLabel || "Network snapshot"}`,
    `- Captured: ${details.snapshotCapturedAt ? networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }) : "No timestamp"}`,
    `- Status: ${details.snapshotStatus || "-"}`,
    `- Source: ${details.source || "Portal retained snapshot"}`,
    ...(details.controllerUrl ? [`- UniFi Network: ${details.controllerUrl}`] : []),
    ...(details.snapshotChangeSummary ? [`- Change summary: ${details.snapshotChangeSummary}`] : []),
    "",
    "## Overview Metrics",
    "",
    markdownTable(["Metric", "Value", "Detail"], Array.isArray(details.metrics) ? details.metrics.map(row => [row?.[0], row?.[1], row?.[2]]) : []),
    "",
    "## Topology Summary",
    "",
  ];

  if (topology.summary) {
    lines.push(`- Site / logical group: ${topology.summary.title || "-"}`);
    (Array.isArray(topology.summary.lines) ? topology.summary.lines : []).forEach(line => lines.push(`- ${line}`));
  } else {
    lines.push(details.summary || "_No topology summary retained._");
  }
  lines.push("");

  lines.push("### Topology Nodes", "");
  const topologyNodes = Array.isArray(topology.nodes) ? topology.nodes : [];
  if (topologyNodes.length) {
    topologyNodes.forEach(node => {
      lines.push(`- ${node.type || node.tone || "Node"}: ${node.title || node.id || "-"}`);
      if (node.subtitle) lines.push(`  - Detail: ${node.subtitle}`);
      if (node.detail) lines.push(`  - Additional: ${node.detail}`);
    });
  } else {
    lines.push("_No topology nodes retained._");
  }
  lines.push("");

  lines.push("### Topology Links", "");
  const topologyLinks = Array.isArray(topology.links) ? topology.links : [];
  if (topologyLinks.length) {
    topologyLinks.forEach(link => {
      lines.push(`- ${link.from || "-"} -> ${link.to || "-"}${link.label ? ` | ${link.label}` : ""}${link.detail ? ` | ${link.detail}` : ""}${link.tone ? ` | ${link.tone}` : ""}`);
    });
  } else {
    lines.push("_No topology links retained._");
  }
  lines.push("");

  lines.push("## Infrastructure Devices", "");
  const nodes = Array.isArray(details.nodes) ? details.nodes : [];
  if (nodes.length) {
    nodes.forEach(node => {
      lines.push(`### ${node.type || "Device"} - ${node.title || "UniFi device"}`);
      lines.push("");
      if (node.status) lines.push(`- Status: ${node.status}`);
      lines.push(...rowsFromNode(node));
      lines.push("");
    });
  } else {
    lines.push("_No infrastructure device rows retained._", "");
  }

  lines.push("## Port Map", "");
  lines.push(markdownTable(["Device / Port", "State", "Speed", "Device / Purpose", "Address", "Power"], Array.isArray(details.ports) ? details.ports : []), "");

  lines.push("## Clients", "");
  lines.push(markdownTable(["Client", "Address", "Association", "Status"], Array.isArray(details.clients) ? details.clients : []), "");

  lines.push("## Wi-Fi Broadcasts", "");
  lines.push(markdownTable(["SSID", "Network", "Enabled", "Security", "Bands", "VLAN"], Array.isArray(details.wifi) ? details.wifi : []), "");

  lines.push("## Wi-Fi Radio Plan", "");
  const wifiPlan = normalizedWifiPlan(details);
  if (wifiPlan.length) {
    wifiPlan.forEach(ap => {
      lines.push(`### ${ap.name || "Access Point"}`, "");
      lines.push(`- Clients: ${ap.clients ?? 0}`);
      lines.push(`- Switch port: ${ap.port || "-"}`);
      lines.push(`- Uplink: ${ap.uplink || "-"}`);
      lines.push(markdownTable(["Band", "Channel", "Width", "Power", "Utilization"], Array.isArray(ap.radios) ? ap.radios : []), "");
    });
  } else {
    lines.push("_No Wi-Fi radio plan retained._", "");
  }

  lines.push("## Wi-Fi Channel Findings", "");
  const channelFindings = Array.isArray(details.wifiChannelFindings) ? details.wifiChannelFindings : [];
  if (channelFindings.length) {
    channelFindings.forEach((finding, index) => {
      lines.push(`${index + 1}. [${finding.severity || "INFO"}] ${finding.title || "Wi-Fi finding"}`);
      if (finding.evidence) lines.push(`   - Evidence: ${finding.evidence}`);
      if (finding.recommendation) lines.push(`   - Recommendation: ${finding.recommendation}`);
    });
  } else {
    lines.push("_No deterministic Wi-Fi channel findings retained._");
  }
  lines.push("");

  lines.push("## Security Evidence", "");
  lines.push("### Intrusion Protection / IDS / IPS", "");
  lines.push(`- Status: ${intrusion.status || "Not exposed"}`);
  lines.push(`- Mode: ${intrusion.mode || "Not documented"}`);
  lines.push(`- Sensitivity: ${intrusion.sensitivity || "Not documented"}`);
  lines.push(`- Signatures / rules: ${intrusion.signatureVersion || intrusion.categories || "Not documented"}`);
  lines.push(`- Events: ${intrusion.eventsDetail || `${intrusion.recentEvents || 0} retained event(s)`}`);
  if (intrusion.evidence) lines.push(`- Evidence: ${intrusion.evidence}`);
  lines.push("");
  lines.push("### Networks", "");
  lines.push(markdownTable(["Name", "Detail"], groups.networkRows), "");
  lines.push("### Firewall Zones", "");
  lines.push(markdownTable(["Zone", "Detail"], groups.zoneRows), "");
  lines.push("### Firewall Policies", "");
  lines.push(markdownTable(["Policy", "Detail"], groups.policyRows), "");
  lines.push("### ACL Rules", "");
  lines.push(markdownTable(["ACL", "Detail"], groups.aclRows), "");

  lines.push("## Runbook", "");
  const runbookDetails = Array.isArray(details.runbookDetails) ? details.runbookDetails : [];
  if (runbookDetails.length) {
    runbookDetails.forEach(topic => {
      lines.push(`### ${topic.title || topic.key || "Runbook topic"}`, "");
      (Array.isArray(topic.steps) ? topic.steps : []).forEach((step, index) => {
        lines.push(`${index + 1}. ${step?.[0] || "Step"}: ${step?.[1] || ""}`);
      });
      lines.push("");
    });
  } else {
    lines.push(markdownTable(["Topic", "Detail"], Array.isArray(details.runbook) ? details.runbook : []), "");
  }

  lines.push("## Snapshot Notes", "");
  if (notes.length) {
    notes.forEach(note => {
      lines.push(`- ${note.createdAt ? new Date(note.createdAt).toLocaleString() : "No timestamp"} - ${note.author || "GSV"}: ${markdownText(note.text || "")}`);
    });
  } else {
    lines.push("_No notes retained on this snapshot._");
  }
  lines.push("");

  lines.push("## Action Plan", "");
  Object.entries(categories).forEach(([key, items]) => {
    lines.push(`### ${key.toUpperCase()}`, "");
    if (!items.length) {
      lines.push("- No open recommendations in this category.", "");
      return;
    }
    items.forEach((item, index) => {
      lines.push(`${index + 1}. [${item.severity || "INFO"}] ${item.title || "Recommended review"}`);
      if (item.evidence) lines.push(`   - Evidence: ${item.evidence}`);
      if (item.recommendation) lines.push(`   - Recommendation: ${item.recommendation}`);
      if (item.source) lines.push(`   - Source: ${item.source}`);
    });
    lines.push("");
  });

  lines.push("## Raw Counts / Backup Evidence", "");
  if (details.rawCounts && typeof details.rawCounts === "object") {
    Object.entries(details.rawCounts).forEach(([key, value]) => lines.push(`- ${key}: ${value}`));
  } else {
    lines.push("- Raw counts not retained in this snapshot details.");
  }
  if (drBackup) {
    lines.push(`- DR backup status: ${details.drBackupStatus || drBackup.kind || "Attached"}`);
    lines.push(`- DR backup generated: ${drBackup.generatedAt || "-"}`);
    const endpoints = Array.isArray(drBackup.endpoints) ? drBackup.endpoints : [];
    lines.push(`- DR backup endpoints: ${endpoints.length}`);
    endpoints.forEach(endpoint => lines.push(`  - ${endpoint.status || "-"} | ${endpoint.path || "-"} | count ${endpoint.count ?? "-"}${endpoint.error ? ` | ${endpoint.error}` : ""}`));
  } else {
    lines.push("- DR backup not attached to this selected snapshot.");
  }

  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function actionPlanItemMarkup(item = {}) {
  const evidenceItems = Array.isArray(item.evidenceItems) && item.evidenceItems.length
    ? item.evidenceItems
    : item.evidence ? [item.evidence] : [];
  const steps = Array.isArray(item.steps) ? item.steps : [];
  return `
    <article class="security-recommendation action-plan-item ${escapeHtml(String(item.severity || "info").toLowerCase())}">
      <div class="action-plan-item-head">
        <span>${escapeHtml(item.severity || "info")}</span>
        ${item.priority ? `<small>${escapeHtml(String(item.priority).replace(/-/g, " "))}</small>` : ""}
      </div>
      <strong>${escapeHtml(item.title || "Recommended review")}</strong>
      ${evidenceItems.length ? `<div class="action-plan-evidence"><b>Evidence</b><ul>${evidenceItems.map(evidence => `<li>${escapeHtml(evidence)}</li>`).join("")}</ul></div>` : ""}
      ${steps.length ? `<div class="action-plan-steps"><b>Next steps</b><ol>${steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>` : item.recommendation ? `<p><b>Recommendation:</b> ${escapeHtml(item.recommendation)}</p>` : ""}
      ${(item.verification || item.rollback) ? `<details class="action-plan-validation"><summary>Verification &amp; rollback</summary>${item.verification ? `<p><b>Verify:</b> ${escapeHtml(item.verification)}</p>` : ""}${item.rollback ? `<p><b>Rollback:</b> ${escapeHtml(item.rollback)}</p>` : ""}</details>` : ""}
      ${item.source ? `<small class="action-plan-source">${escapeHtml(item.source)}</small>` : ""}
    </article>`;
}

function networkActionPlan(client, details = {}) {
  const categories = networkActionPlanCategories(details);
  if (!categories[selectedNetworkActionTab]) selectedNetworkActionTab = "general";
  const activeItems = categories[selectedNetworkActionTab] || [];
  const total = Object.values(categories).reduce((sum, items) => sum + items.length, 0);
  return `
    <section class="atlas-data-section action-plan-section">
      <div class="action-plan-head">
        <div>
          <h2>Remediation Plan</h2>
          <p>Prioritized changes, validation steps, and performance opportunities from the selected snapshot.</p>
        </div>
        <div class="toolbar">
          <button type="button" data-network-action-copy="${escapeHtml(client.id)}">Copy Snapshot Brief</button>
          <button type="button" data-network-snapshot-brief-export="${escapeHtml(client.id)}">Export Snapshot Brief</button>
          <button type="button" class="primary" data-network-action-export="${escapeHtml(client.id)}">Export Action Plan</button>
        </div>
      </div>
      <div class="action-plan-summary">
        <article><span>Total items</span><strong>${total}</strong><small>Across snapshot categories</small></article>
        <article><span>High priority</span><strong>${Object.values(categories).flat().filter(item => /critical|high/i.test(item.severity || "")).length}</strong><small>Review first</small></article>
        <article><span>Snapshot</span><strong>${escapeHtml(details.snapshotLabel || "Current")}</strong><small>${escapeHtml(details.snapshotCapturedAt ? networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }) : "No timestamp")}</small></article>
      </div>
      <div class="action-plan-tabs">
        ${networkActionPlanTabs(categories)}
      </div>
      <div class="security-recommendation-grid action-plan-grid">
        ${activeItems.length ? activeItems.map(actionPlanItemMarkup).join("") : `<div class="item"><strong>No recommendations in this category.</strong><span>Use the other tabs or pull a newer snapshot.</span></div>`}
      </div>
    </section>
  `;
}

function networkAtlasRunbook(details) {
  const runbook = Array.isArray(details.runbookDetails) ? details.runbookDetails : [];
  if (!runbook.length) return networkAtlasPanel("Runbook", details.runbook || []);
  if (!runbook.some(topic => topic.key === selectedNetworkRunbookKey)) selectedNetworkRunbookKey = runbook[0].key;

  return `
    <section class="atlas-data-section">
      ${networkAtlasSectionHeading("Operations Runbook", "Focused checks for the most common failure modes.")}
      <div class="runbook">
        <div class="runbook-index">
          ${runbook.map(topic => `
            <button class="runbook-link ${topic.key === selectedNetworkRunbookKey ? "active" : ""}" type="button" data-network-runbook-topic="${escapeHtml(topic.key)}">${escapeHtml(topic.title)}</button>
          `).join("")}
        </div>
        <div class="runbook-content">
          ${runbook.map(topic => `
            <div class="runbook-pane ${topic.key === selectedNetworkRunbookKey ? "active" : ""}">
              <h3>${escapeHtml(topic.title)}</h3>
              <ol class="steps">
                ${(topic.steps || []).map(step => `
                  <li>
                    <strong>${escapeHtml(step[0])}</strong>
                    <span>${networkAtlasInlineText(step[1])}</span>
                  </li>
                `).join("")}
              </ol>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function isHomeNetworkAtlasClient(client, details = {}) {
  const signals = [
    client?.id,
    client?.name,
    client?.billTo,
    client?.networkAtlasPath,
    details.subtitle,
    details.controller,
  ].join(" ").toLowerCase();
  return (
    signals.includes("client_cory_beck") ||
    signals.includes("the 19th hole") ||
    signals.includes("757 caber") ||
    signals.includes("beck")
  );
}

function clientTopologyEndpointLocations(client = {}) {
  const configured = Array.isArray(client.topologyEndpointLocations) ? client.topologyEndpointLocations : [];
  if (configured.length) return configured;
  if (client.id === "client_moxie") {
    return [{ endpointPattern: "michael kelley phone", locationPattern: "fulfillment", connectionType: "SD-WAN" }];
  }
  return [];
}

function topologyLocationForPattern(client = {}, pattern = "") {
  const needle = String(pattern || "").toLowerCase();
  return (Array.isArray(client.networkLocations) ? client.networkLocations : [])
    .filter(location => String(location.name || "").toLowerCase().includes(needle))
    .sort((left, right) => {
      const leftScore = (left.hostId ? 4 : 0) + (!/planned/i.test(left.name || "") ? 2 : 0) + (left.address && !/confirm/i.test(left.address) ? 1 : 0);
      const rightScore = (right.hostId ? 4 : 0) + (!/planned/i.test(right.name || "") ? 2 : 0) + (right.address && !/confirm/i.test(right.address) ? 1 : 0);
      return rightScore - leftScore;
    })[0] || null;
}

function topologyRemoteSiteFacts(client = {}, location = {}) {
  const snapshot = networkSnapshotsForClient(client, location.id)[0] || null;
  const details = snapshot?.details && typeof snapshot.details === "object" ? snapshot.details : {};
  const internetMetric = (Array.isArray(details.metrics) ? details.metrics : [])
    .find(metric => String(metric?.[0] || "").toLowerCase() === "internet") || [];
  const internetText = `${internetMetric[1] || ""} ${internetMetric[2] || ""}`;
  const provider = internetText.match(/Provider:\s*([^|]+)/i)?.[1]?.trim()
    || (!/^(?:internet\s*\d*|wan)$/i.test(String(internetMetric[1] || "").trim()) ? String(internetMetric[1] || "").trim() : "");
  const measured = internetText.match(/Measured:\s*([^|]+)/i)?.[1]?.trim() || "";
  let networks = Array.isArray(details.networkInventory)
    ? details.networkInventory.map(network => [network?.name, network?.vlanId ? `VLAN ${network.vlanId}` : ""].filter(Boolean).join(" "))
    : [];
  if (!networks.length) {
    networks = (Array.isArray(details.security) ? details.security : [])
      .filter(row => !/^(Intrusion|Zone:|Policy:|ACL:)/i.test(String(row?.[0] || "")))
      .map(row => [row?.[0], /VLAN\s+\d+/i.test(String(row?.[1] || "")) ? String(row[1]).match(/VLAN\s+\d+/i)?.[0] : ""].filter(Boolean).join(" "));
  }
  return {
    provider,
    measured,
    networks: [...new Set(networks.filter(Boolean))].slice(0, 3),
  };
}

function applyClientTopologyIntelligence(client = {}, details = {}) {
  const plan = details.topologyPlan && typeof details.topologyPlan === "object" ? details.topologyPlan : null;
  if (!plan || !Array.isArray(plan.nodes)) return details;
  const overrides = clientTopologyEndpointLocations(client);
  if (!overrides.length) return details;
  const currentLocation = (Array.isArray(client.networkLocations) ? client.networkLocations : [])
    .find(location => location.id === selectedNetworkLocationId) || null;
  const nodes = plan.nodes.map(node => ({ ...node }));
  let links = (Array.isArray(plan.links) ? plan.links : []).map(link => ({ ...link }));
  const labels = (Array.isArray(plan.labels) ? plan.labels : []).map(label => ({ ...label }));
  const summary = plan.summary && typeof plan.summary === "object"
    ? { ...plan.summary, lines: Array.isArray(plan.summary.lines) ? [...plan.summary.lines] : [] }
    : null;
  const gateway = nodes.find(node => String(node.type || "").toLowerCase() === "gateway");
  let remoteIndex = 0;
  const normalizeEndpointName = value => String(value || "")
    .toLowerCase()
    .replace(/\bmicheal\b/g, "michael")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  overrides.forEach(override => {
    const endpointNeedle = normalizeEndpointName(override.endpointPattern);
    const branchLocation = topologyLocationForPattern(client, override.locationPattern);
    if (!endpointNeedle || !branchLocation) return;
    const viewingBranch = Boolean(currentLocation && currentLocation.id === branchLocation.id);
    const primaryLocation = (Array.isArray(client.networkLocations) ? client.networkLocations : [])
      .find(location => location.id !== branchLocation.id && /main office|headquarters|rocklin/i.test(`${location.name || ""} ${location.id || ""}`))
      || (Array.isArray(client.networkLocations) ? client.networkLocations : []).find(location => location.id !== branchLocation.id)
      || null;
    const remoteLocation = viewingBranch ? primaryLocation : branchLocation;
    if (!remoteLocation) return;
    const connectionType = String(override.connectionType || "SD-WAN");
    const interSiteLink = (Array.isArray(client.networkLinks) ? client.networkLinks : []).find(link =>
      [link.fromLocationId, link.toLocationId].includes(currentLocation?.id) &&
      [link.fromLocationId, link.toLocationId].includes(remoteLocation.id)
    ) || null;
    const routedByLocation = interSiteLink?.routedNetworksByLocation && typeof interSiteLink.routedNetworksByLocation === "object"
      ? interSiteLink.routedNetworksByLocation
      : {};
    const routedNetworks = Array.isArray(routedByLocation[remoteLocation.id])
      ? [...new Set(routedByLocation[remoteLocation.id].map(value => String(value || "").trim()).filter(Boolean))]
      : Array.isArray(interSiteLink?.routedNetworks)
        ? [...new Set(interSiteLink.routedNetworks.map(value => String(value || "").trim()).filter(Boolean))]
        : [];
    if (!routedNetworks.length && client.id === "client_moxie") {
      routedNetworks.push(/fulfillment/i.test(`${remoteLocation.name || ""} ${remoteLocation.id || ""}`)
        ? "Default (192.168.4.0/24)"
        : "Data VLAN1 (192.168.1.0/24)");
    }
    const remoteFacts = topologyRemoteSiteFacts(client, remoteLocation);
    const role = viewingBranch ? "Hub / Primary Site" : "Branch Site";
    const ispDetail = remoteFacts.provider
      ? `ISP ${remoteFacts.provider}${remoteFacts.measured ? ` · ${remoteFacts.measured}` : ""}`
      : "ISP not retained";
    const networkDetail = routedNetworks.length
      ? `Routed over ${connectionType}: ${routedNetworks.join(", ")}`
      : remoteFacts.networks.length
        ? `Site networks: ${remoteFacts.networks.join(", ")} · Routed VLAN scope not captured`
        : "Routed networks/VLANs not captured";
    const remoteId = `remote-site-${String(remoteLocation.id || remoteLocation.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    let remoteNode = nodes.find(node => String(node.id || "") === remoteId);
    if (!remoteNode) {
      remoteNode = {
        id: remoteId,
        type: "SD-WAN Remote Site",
        title: remoteLocation.name || "Remote site",
        subtitle: `${connectionType} ${role} · ${ispDetail}`,
        detail: networkDetail,
        tone: "core",
        x: 1030 + remoteIndex * 375,
        y: 205,
        width: 340,
        height: 100,
      };
      nodes.push(remoteNode);
      remoteIndex += 1;
      if (gateway?.id) links.push({ from: gateway.id, to: remoteId, tone: "standby", label: connectionType, detail: "Inter-site tunnel" });
      if (summary && !summary.lines.some(line => String(line).includes(remoteLocation.name || "Remote site"))) {
        summary.lines.push(`${connectionType}: ${remoteLocation.name || "Remote site"}`);
      }
    }
    // On the branch topology the endpoint is local, so leave its physical
    // attachment intact. On the hub topology, place it beneath the branch card.
    if (viewingBranch) return;
    const endpoint = nodes.find(node => normalizeEndpointName(node.title).includes(endpointNeedle));
    // The inter-site tunnel is real infrastructure and must remain visible even
    // when an endpoint name changes or is misspelled in UniFi inventory.
    if (!endpoint) return;
    links = links.filter(link => String(link.to || "") !== String(endpoint.id || "") && String(link.from || "") !== String(endpoint.id || ""));
    endpoint.x = Number(remoteNode.x || 1030) + 5;
    endpoint.y = Number(remoteNode.y || 205) + 132;
    endpoint.width = Math.max(225, Number(endpoint.width || 0));
    endpoint.detail = `${remoteLocation.name} · Connected via ${connectionType}`;
    links.push({ from: remoteId, to: endpoint.id, tone: "primary", label: "Remote endpoint" });
  });

  if (nodes.some(node => String(node.type || "") === "SD-WAN Remote Site") && !labels.some(label => /sd-wan|remote site/i.test(String(label.text || "")))) {
    labels.push({ text: "SD-WAN INTER-SITE", x: 1030, y: 178 });
  }
  return { ...details, topologyPlan: { ...plan, nodes, links, labels, ...(summary ? { summary } : {}) } };
}

function networkAtlasTopologyPlan(client, sourceDetails) {
  const details = applyClientTopologyIntelligence(client, sourceDetails);
  let mapViewBoxWidth = 1320;
  let mapViewBoxHeight = 760;
  const plan = details.topologyPlan && typeof details.topologyPlan === "object" ? details.topologyPlan : null;
  const rawNodes = Array.isArray(plan?.nodes)
    ? plan.nodes
      .filter(node => topologyPhoneKind(node) !== "Mobile Phone")
      .map(node => ({ ...node }))
    : [];
  const supplementalLinks = [];
  const phoneCandidates = [
    ...(Array.isArray(details.clientInventory) ? details.clientInventory : []),
    ...(Array.isArray(details.managedDeviceInventory) ? details.managedDeviceInventory : []),
  ].filter(isHardwiredTopologyPhone);
  const normalized = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const ipv4 = value => (String(value || "").match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/) || [""])[0];
  const phoneKeys = new Set();
  rawNodes.filter(node => topologyPhoneKind(node) || /phone/i.test(String(node.type || ""))).forEach(node => {
    if (normalized(node.title)) phoneKeys.add(`name:${normalized(node.title)}`);
    if (ipv4(node.subtitle)) phoneKeys.add(`ip:${ipv4(node.subtitle)}`);
  });
  phoneCandidates.forEach(record => {
    const kind = topologyPhoneKind(record);
    const name = String(record.name || record.displayName || record.hostname || kind);
    const address = ipv4(record.address || record.ipAddress || record.ip || (Array.isArray(record.addresses) ? record.addresses.join(" ") : ""));
    const nameKey = normalized(name);
    const duplicate = (nameKey && phoneKeys.has(`name:${nameKey}`)) || (address && phoneKeys.has(`ip:${address}`));
    if (duplicate) return;
    const association = String(record.association || record.lastAssociation || record.uplinkName || "");
    const associationKey = normalized(association);
    const phoneIndex = rawNodes.filter(node => topologyPhoneKind(node) || /phone/i.test(String(node.type || ""))).length;
    const id = `phone-render-${String(record.mac || name || phoneIndex).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    rawNodes.push({
      id,
      type: kind,
      title: name,
      subtitle: [record.manufacturer, record.model, address].filter(Boolean).join(" - ") || kind,
      detail: association || (record.offline === true ? "Offline" : record.status || "Detected phone"),
      tone: record.offline === true ? "warning" : "service",
      x: 55 + (phoneIndex % 6) * 205,
      y: 670 + Math.floor(phoneIndex / 6) * 92,
      width: 180,
      height: 72,
    });
    if (nameKey) phoneKeys.add(`name:${nameKey}`);
    if (address) phoneKeys.add(`ip:${address}`);
    const parent = rawNodes
      .filter(node => /switch|access point|wireless/i.test(String(node.type || "")))
      .filter(node => normalized(node.title) && associationKey.includes(normalized(node.title)))
      .sort((left, right) => normalized(right.title).length - normalized(left.title).length)[0];
    if (parent?.id) supplementalLinks.push({ from: parent.id, to: id, label: association.match(/port\s+\d+/i)?.[0] || "Phone", tone: "primary" });
  });
  let nodes = rawNodes
    .filter(node => String(node.id || "") !== "services-summary" && String(node.type || "") !== "Services & Networks" && !isPlaceholderWanNode(node))
    .map(node => ({
      ...node,
      subtitle: cleanTopologySubtitle(node.subtitle || node.type || ""),
      detail: cleanTopologyNodeDetail(node),
    }));
  const hardwiredPhoneNodes = nodes.filter(node => {
    const kind = topologyPhoneKind(node);
    return kind && kind !== "Mobile Phone";
  });
  hardwiredPhoneNodes.forEach((node, index) => {
    node.x = 70 + (index % 5) * 245;
    node.y = 680 + Math.floor(index / 5) * 150;
    node.width = Math.max(225, Number(node.width || 0));
    node.height = Math.max(122, Number(node.height || 0));
  });
  nodes.forEach(node => {
    const id = String(node.id || "");
    const type = String(node.type || "").toLowerCase();
    if ((id.startsWith("wan-") || type.includes("wan")) && Number(node.x || 0) < 110) node.x = 110;
  });
  mapViewBoxHeight = Math.max(760, nodes.reduce((max, node) => Math.max(max, Number(node.y || 0) + Number(node.height || 78) + 40), 0));
  const switchNodes = nodes
    .filter(node => String(node.type || "").toLowerCase() === "switch")
    .sort((a, b) => Number(a.x || 0) - Number(b.x || 0));
  switchNodes.forEach((node, index) => {
    if (!index) return;
    const previous = switchNodes[index - 1];
    const minX = Number(previous.x || 0) + Number(previous.width || 210) + 130;
    if (Number(node.x || 0) < minX) node.x = minX;
  });
  const nodeIds = new Set(nodes.map(node => String(node.id || "")));
  if (!nodes.length) return "";
  const byId = Object.fromEntries(nodes.map(node => [String(node.id || ""), node]).filter(([id]) => id));
  const links = dedupeTopologyLinks([...(Array.isArray(plan?.links) ? plan.links : []), ...supplementalLinks], byId)
    .filter(link => nodeIds.has(String(link.from || "")) && nodeIds.has(String(link.to || "")));
  const center = (node = {}) => ({
    x: Number(node.x || 0) + Number(node.width || 210) / 2,
    y: Number(node.y || 0) + Number(node.height || 78) / 2,
  });
  const bottomCenter = (node = {}) => ({
    x: Number(node.x || 0) + Number(node.width || 210) / 2,
    y: Number(node.y || 0) + Number(node.height || 78),
  });
  const topCenter = (node = {}) => ({
    x: Number(node.x || 0) + Number(node.width || 210) / 2,
    y: Number(node.y || 0),
  });
  const leftCenter = (node = {}) => ({
    x: Number(node.x || 0),
    y: Number(node.y || 0) + Number(node.height || 78) / 2,
  });
  const rightCenter = (node = {}) => ({
    x: Number(node.x || 0) + Number(node.width || 210),
    y: Number(node.y || 0) + Number(node.height || 78) / 2,
  });
  const linkLabelMarkup = (label, x, y, width = 150) => {
    if (!label) return "";
    const safeWidth = Math.max(84, Math.min(220, width));
    return `
      <foreignObject x="${Math.round(x - safeWidth / 2)}" y="${Math.round(y - 13)}" width="${safeWidth}" height="28" class="map-link-label-object">
        <div xmlns="http://www.w3.org/1999/xhtml" class="map-link-label-badge">${escapeHtml(label)}</div>
      </foreignObject>
    `;
  };
  const linkMarkup = links.map(link => {
    const from = byId[String(link.from || "")];
    const to = byId[String(link.to || "")];
    if (!from || !to) return "";
    const isVerticalDown = Number(to.y || 0) > Number(from.y || 0) + Number(from.height || 78) / 2;
    const isLeftToRight = Number(to.x || 0) > Number(from.x || 0) + Number(from.width || 210) / 2;
    const isRightToLeft = Number(from.x || 0) > Number(to.x || 0) + Number(to.width || 210) / 2;
    const a = isVerticalDown ? bottomCenter(from) : isLeftToRight ? rightCenter(from) : isRightToLeft ? leftCenter(from) : center(from);
    const b = isVerticalDown ? topCenter(to) : isLeftToRight ? leftCenter(to) : isRightToLeft ? rightCenter(to) : center(to);
    const midX = Math.round((a.x + b.x) / 2);
    const midY = Math.round((a.y + b.y) / 2);
    const tone = ["primary", "standby", "wireless", "blocked"].includes(String(link.tone || "")) ? link.tone : "";
    const isPhoneLink = Boolean(topologyPhoneKind(to));
    const label = isPhoneLink ? "" : [link.label, link.detail].filter(Boolean).join(" - ");
    const isShortHorizontal = !isVerticalDown && Math.abs(b.x - a.x) < 190;
    const path = isVerticalDown
      ? `M${Math.round(a.x)} ${Math.round(a.y)} C${midX} ${Math.round(a.y + 34)}, ${midX} ${Math.round(b.y - 34)}, ${Math.round(b.x)} ${Math.round(b.y)}`
      : `M${Math.round(a.x)} ${Math.round(a.y)} L${Math.round(b.x)} ${Math.round(b.y)}`;
    const labelX = isShortHorizontal ? midX : isVerticalDown ? Math.round(midX - 18) : midX;
    const labelY = isShortHorizontal ? Math.round(midY - 30) : isVerticalDown ? Math.round(midY - 12) : Math.round(midY - 16);
    const labelWidth = isShortHorizontal ? 138 : 165;
    return `
      <path class="map-link ${escapeHtml(tone)}${isPhoneLink ? " endpoint" : ""}" d="${path}"></path>
      ${linkLabelMarkup(label, labelX, labelY, labelWidth)}
    `;
  }).join("");
  const summary = plan?.summary && typeof plan.summary === "object"
    ? plan.summary
    : {
      title: details.subtitle || "Network inventory",
      lines: [
        Array.isArray(details.clients) ? `${details.clients.length} connected clients` : "",
        Array.isArray(details.security) ? `${details.security.filter(row => !/^(Policy|ACL|Rule):/i.test(String(row?.[0] || ""))).length} network records` : "",
        Array.isArray(details.wifi) ? `${details.wifi.length} Wi-Fi broadcasts` : "",
      ].filter(Boolean),
    };
  const summaryLines = Array.isArray(summary.lines)
    ? summary.lines.map(line => String(line || "")).filter(Boolean).filter(line => !/phone endpoint/i.test(line))
    : [];
  if (hardwiredPhoneNodes.length) summaryLines.push(`${hardwiredPhoneNodes.length} hardwired phone endpoint${hardwiredPhoneNodes.length === 1 ? "" : "s"}`);
  const displaySummaryLines = summaryLines.some(line => /logical/i.test(line)) ? summaryLines : [...summaryLines, "Logical inventory"];
  const summaryHeight = Math.max(112, Math.min(190, 58 + displaySummaryLines.length * 17));
  const summaryBodyHeight = Math.max(84, summaryHeight - 28);
  const summaryWidth = 250;
  const summaryPadding = 15;
  const nodeRightEdge = nodes.reduce((max, node) => Math.max(max, Number(node.x || 0) + Number(node.width || 210)), 0);
  const preferredSummaryX = Math.max(980, nodeRightEdge + 95);
  mapViewBoxWidth = Math.max(mapViewBoxWidth, preferredSummaryX + summaryWidth + 30);
  const summaryX = preferredSummaryX;
  const summaryY = 215;
  const summaryLabelY = Math.max(28, summaryY - 37);
  const labels = Array.isArray(plan?.labels) && plan.labels.length
    ? plan.labels
      .filter(label => !/services/i.test(String(label.text || "")))
      .map(label => ({
        ...label,
        text: /networks\s*&\s*clients/i.test(String(label.text || "")) ? "LOGICAL NETWORKS" : label.text,
        x: /logical networks|networks\s*&\s*clients/i.test(String(label.text || "")) ? summaryX : label.x,
        y: /logical networks|networks\s*&\s*clients/i.test(String(label.text || "")) ? summaryLabelY : label.y,
      }))
    : [
      { text: "WAN EDGE", x: 32, y: 28 },
      { text: "CORE", x: 32, y: 178 },
      { text: "ACCESS", x: 32, y: 350 },
      { text: "LOGICAL NETWORKS", x: summaryX, y: summaryLabelY },
    ];
  return `
    <section class="network-map-panel">
      <div class="network-map-stage">
        <svg class="portal-network-map" viewBox="0 0 ${mapViewBoxWidth} ${mapViewBoxHeight}" style="min-width: ${mapViewBoxWidth}px;" role="img" aria-label="Generated network topology">
          ${labels.map(label => `<text x="${Number(label.x || 0)}" y="${Number(label.y || 0)}" class="map-label">${escapeHtml(label.text || "")}</text>`).join("")}
          ${linkMarkup}
          ${summary ? `
            <g class="map-summary">
              <rect x="${summaryX}" y="${summaryY}" width="${summaryWidth}" height="${summaryHeight}" rx="7"></rect>
              <foreignObject x="${summaryX + summaryPadding}" y="${summaryY + 13}" width="${summaryWidth - summaryPadding * 2}" height="${summaryBodyHeight}">
                <div xmlns="http://www.w3.org/1999/xhtml" class="map-summary-body">
                  <strong>${escapeHtml(summary.title || "Network inventory")}</strong>
                  ${displaySummaryLines.map(line => `<span>${escapeHtml(line)}</span>`).join("")}
                </div>
              </foreignObject>
            </g>
          ` : ""}
          ${nodes.map(node => {
            const tone = ["wan", "warning", "core", "wifi", "service", "vlan"].includes(String(node.tone || "")) ? node.tone : "service";
            const width = Number(node.width || 210);
            const height = Number(node.height || 78);
            const x = Number(node.x || 0);
            const y = Number(node.y || 0);
            return `
              <g class="map-node ${escapeHtml(tone)}">
                <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="7"></rect>
                <foreignObject x="${x + 10}" y="${y + 10}" width="${Math.max(10, width - 20)}" height="${Math.max(10, height - 20)}">
                  <div xmlns="http://www.w3.org/1999/xhtml" class="map-node-body">
                    <strong>${escapeHtml(node.title || node.type || "Network device")}</strong>
                    <span>${escapeHtml(node.subtitle || node.type || "")}</span>
                    ${node.detail ? `<small>${escapeHtml(node.detail)}</small>` : ""}
                  </div>
                </foreignObject>
              </g>
            `;
          }).join("")}
        </svg>
      </div>
    </section>
  `;
}

function networkAtlasTopology(client, details) {
  const planMarkup = networkAtlasTopologyPlan(client, details);
  if (planMarkup) {
    return `
      ${planMarkup}
      <div class="network-node-grid">${(details.nodes || []).map(node => `
        <article class="network-node-card">
          <div>
            <span>${escapeHtml(node.type || "Device")}</span>
            <strong>${escapeHtml(node.title || "UniFi device")}</strong>
            <small>${escapeHtml(node.status || "Unknown")}</small>
          </div>
          <dl>
            ${(node.rows || []).map(row => `<div><dt>${escapeHtml(row[0])}</dt><dd>${escapeHtml(row[1])}</dd></div>`).join("")}
          </dl>
        </article>
      `).join("")}</div>
    `;
  }

  const pulledNodes = Array.isArray(details.topologyNodes) ? details.topologyNodes : [];
  if (pulledNodes.length) {
    const groups = ["Gateway", "Switch", "Access Point", "Camera", "Device"].map(type => ({
      type,
      nodes: pulledNodes.filter(node => (node.type || "Device") === type),
    })).filter(group => group.nodes.length);
    return `
      <section class="pulled-topology-panel">
        <div class="pulled-topology-lane">
          ${groups.map((group, groupIndex) => `
            <div class="pulled-topology-group">
              <div class="pulled-topology-label">${escapeHtml(group.type)}</div>
              <div class="pulled-topology-stack">
                ${group.nodes.map(node => `
                  <article class="pulled-topology-node ${group.type.toLowerCase().replaceAll(" ", "-")}">
                    <span>${escapeHtml(node.type || "Device")}</span>
                    <strong>${escapeHtml(node.title || "UniFi device")}</strong>
                    <small>${escapeHtml(node.status || "Unknown")}</small>
                  </article>
                `).join("")}
              </div>
            </div>
            ${groupIndex < groups.length - 1 ? `<div class="pulled-topology-connector" aria-hidden="true"></div>` : ""}
          `).join("")}
        </div>
      </section>
      <div class="network-node-grid">${(details.nodes || pulledNodes).map(node => `
        <article class="network-node-card">
          <div>
            <span>${escapeHtml(node.type || "Device")}</span>
            <strong>${escapeHtml(node.title || "UniFi device")}</strong>
            <small>${escapeHtml(node.status || "Unknown")}</small>
          </div>
          <dl>
            ${(node.rows || []).map(row => `<div><dt>${escapeHtml(row[0])}</dt><dd>${escapeHtml(row[1])}</dd></div>`).join("")}
          </dl>
        </article>
      `).join("")}</div>
    `;
  }

  const nodeCards = (details.nodes || []).map(node => `
    <article class="network-node-card">
      <div>
        <span>${escapeHtml(node.type)}</span>
        <strong>${escapeHtml(node.title)}</strong>
        <small>${escapeHtml(node.status)}</small>
      </div>
      <dl>
        ${node.rows.map(row => `<div><dt>${escapeHtml(row[0])}</dt><dd>${escapeHtml(row[1])}</dd></div>`).join("")}
      </dl>
    </article>
  `).join("");

  if (!isHomeNetworkAtlasClient(client, details)) {
    return `
      <section class="atlas-data-section">
        ${networkAtlasSectionHeading("Topology", details.snapshotCapturedAt ? "Topology will render from the selected client snapshot." : "Pull a snapshot to build this client's topology map.")}
        ${nodeCards ? `
          <div class="network-node-grid">${nodeCards}</div>
        ` : `
          <div class="client-doc-row">
            <div>
              <strong>No topology nodes documented yet.</strong>
              <span>Use Pull Snapshot to create this client's first retained Network Atlas capture.</span>
            </div>
            <span class="badge warn">Missing</span>
          </div>
        `}
      </section>
    `;
  }

  return `
    <section class="network-map-panel">
      <div class="network-map-stage">
        <svg class="portal-network-map" viewBox="0 0 1320 760" role="img" aria-label="${escapeHtml(client.name)} topology">
          <defs>
            <marker id="map-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z"></path>
            </marker>
            <marker id="map-arrow-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z"></path>
            </marker>
          </defs>
          <text x="32" y="28" class="map-label">WAN EDGE</text>
          <text x="32" y="178" class="map-label">CORE</text>
          <text x="32" y="350" class="map-label">ACCESS</text>
          <text x="980" y="178" class="map-label">SERVICES & NETWORKS</text>

          <path class="map-link primary" d="M155 118 C155 155 470 130 560 202"></path>
          <path class="map-link standby" d="M380 118 C380 155 555 150 625 202"></path>
          <path class="map-link primary" d="M650 296 L650 370"></path>
          <path class="map-link" d="M566 452 C520 488 180 470 150 542"></path>
          <path class="map-link" d="M610 452 C590 495 420 485 410 542"></path>
          <path class="map-link" d="M685 452 C700 495 670 510 670 542"></path>
          <path class="map-link" d="M735 452 C790 485 915 490 930 542"></path>
          <path class="map-link primary" d="M770 416 C875 416 970 260 1010 260"></path>
          <path class="map-link" d="M770 430 C900 455 1010 415 1040 415"></path>
          <path class="map-link" d="M770 445 C915 500 1040 555 1070 555"></path>
          <path class="map-link wireless" d="M150 616 C230 700 865 688 1010 650"></path>
          <path class="map-link wireless" d="M410 616 C520 670 910 665 1010 650"></path>
          <path class="map-link wireless" d="M670 616 C785 645 930 652 1010 650"></path>
          <path class="map-link wireless" d="M930 616 C970 625 990 638 1010 650"></path>
          <path class="map-link blocked" d="M1180 690 C1260 660 1270 505 1195 472"></path>

          <g class="map-node wan"><rect x="65" y="50" width="180" height="68" rx="7"></rect><text x="155" y="82">Fidium Fiber</text><text x="155" y="103">WAN 1 - Primary</text></g>
          <g class="map-node warning"><rect x="290" y="50" width="180" height="68" rx="7"></rect><text x="380" y="82">Starlink</text><text x="380" y="103">WAN 2 - Standby</text></g>
          <g class="map-node core"><rect x="540" y="202" width="220" height="94" rx="7"></rect><text x="650" y="234">UDM-SE - The Beck's</text><text x="650" y="256">Gateway - Network 10.4.57</text><text x="650" y="276">Fidium active - Starlink ready</text></g>
          <g class="map-node core"><rect x="530" y="370" width="240" height="82" rx="7"></rect><text x="650" y="401">Main Switch 1</text><text x="650" y="422">Pro Max 24 PoE - 192.168.1.200</text><text x="650" y="440">RSTP root - priority 4096</text></g>
          <g class="map-node wifi"><rect x="55" y="542" width="190" height="74" rx="7"></rect><text x="150" y="573">Garage AP</text><text x="150" y="594">Port 17 - 2.5 GbE</text><text x="150" y="611">11 clients</text></g>
          <g class="map-node wifi"><rect x="315" y="542" width="190" height="74" rx="7"></rect><text x="410" y="573">Upstairs AP</text><text x="410" y="594">Port 18 - 2.5 GbE</text><text x="410" y="611">24 clients</text></g>
          <g class="map-node wifi"><rect x="575" y="542" width="190" height="74" rx="7"></rect><text x="670" y="573">Patio AP</text><text x="670" y="594">Port 19 - 2.5 GbE</text><text x="670" y="611">5 clients</text></g>
          <g class="map-node wifi"><rect x="835" y="542" width="190" height="74" rx="7"></rect><text x="930" y="573">Kitchen AP</text><text x="930" y="594">Port 20 - 2.5 GbE</text><text x="930" y="611">22 clients</text></g>
          <g class="map-node service"><rect x="1010" y="210" width="245" height="118" rx="7"></rect><text x="1132" y="242">Synology NAS</text><text x="1132" y="263">192.168.1.10 - port 26</text><text x="1132" y="282">10 GbE</text><text x="1132" y="307">Home Assistant</text></g>
          <g class="map-node service"><rect x="1040" y="372" width="215" height="100" rx="7"></rect><text x="1147" y="404">Wired Sonos</text><text x="1147" y="424">Garage - port 1</text><text x="1147" y="442">Patio - port 2</text><text x="1147" y="460">Family Room - port 3</text></g>
          <g class="map-node service"><rect x="1070" y="512" width="185" height="86" rx="7"></rect><text x="1162" y="544">UniFi Protect</text><text x="1162" y="564">8 cameras online</text><text x="1162" y="582">PoE access layer</text></g>
          <g class="map-node vlan"><rect x="1010" y="630" width="245" height="92" rx="7"></rect><text x="1132" y="662">Logical Networks</text><text x="1132" y="683">Default - 192.168.1.0/24</text><text x="1132" y="701">IoT VLAN 3 - 192.168.3.0/24</text></g>
        </svg>
      </div>
    </section>
    <div class="network-node-grid">${nodeCards}</div>
  `;
}

function renderNetworkAtlas() {
  const container = document.getElementById("network-atlas-content");
  if (!container) return;
  const client = clientById(selectedNetworkAtlasClientId || selectedClientId);
  if (!client) {
    container.innerHTML = `
      <section class="client-dashboard-empty">
        <div class="empty-cell">Select a client to open network topology.</div>
      </section>
    `;
    return;
  }

  const snapshots = networkSnapshotsForClient(client);
  const selectedSnapshot = selectedNetworkSnapshotForClient(client);
  const details = networkAtlasDetails(client, selectedSnapshot);
  const tabMarkup = {
    overview: `
      ${networkOverviewReportHeader(client, details)}
      <div class="metric-grid client-metrics">
        ${details.metrics.map(metricCardMarkup).join("")}
      </div>
      <section>
        <div class="section-head"><h2>Snapshot History</h2></div>
        <div class="network-snapshot-list">
          ${snapshots.length ? snapshots.map(snapshot => `
            <article class="network-snapshot-row ${snapshot.id === selectedSnapshot?.id ? "active" : ""}">
              <div>
                <strong>${escapeHtml(snapshot.label || "Network snapshot")}</strong>
                <span>${escapeHtml(networkSnapshotCapturedLabel(snapshot))}</span>
              </div>
              <div class="row-actions">
                ${snapshot.configPath ? `<button data-network-config="${escapeHtml(snapshot.configPath)}">Download Config</button>` : ""}
              </div>
            </article>
          `).join("") : `<div class="item"><strong>No snapshots retained yet.</strong></div>`}
        </div>
      </section>
    `,
    topology: networkAtlasTopology(client, details),
    ports: networkAtlasTable(["Device / Port", "State", "Speed", "Device / Purpose", "Address", "Power"], details.ports),
    clients: networkCombinedDevicesTable(details),
    wifi: networkAtlasWifiPlan(details),
    security: networkAtlasSecurityPlan(details),
    notes: networkSnapshotNotesPanel(client, details),
    audit: networkAuditWorkspace(client, details),
    runbook: networkAtlasRunbook(details),
  };

  container.innerHTML = `
    <div class="detail-breadcrumb">
      <button data-back-to-client-dashboard="${escapeHtml(client.id)}" type="button">Back to ${escapeHtml(client.name)}</button>
    </div>
    <section class="network-atlas-shell">
      <div class="section-head">
        <div>
          <p class="eyebrow">Network Atlas</p>
          <h2>${escapeHtml(client.name)}</h2>
          <p class="subtle">${escapeHtml(details.subtitle)}${details.captureDate ? ` - Viewing ${escapeHtml(details.snapshotLabel || "snapshot")} from ${escapeHtml(details.captureDate)}` : ""}</p>
        </div>
        ${details.controllerUrl ? `<div class="toolbar"><a class="button-link" href="${escapeHtml(details.controllerUrl)}" target="_blank" rel="noreferrer">Open UniFi Network</a></div>` : ""}
      </div>
      ${networkSnapshotWorkspace(client, selectedSnapshot, snapshots)}
      <div class="ticket-detail-tabs network-atlas-tabs">
        ${networkAtlasTabButton("overview", "Overview")}
        ${networkAtlasTabButton("topology", "Topology")}
        ${networkAtlasTabButton("ports", "Port Map")}
        ${networkAtlasTabButton("clients", "Clients")}
        ${networkAtlasTabButton("wifi", "Wi-Fi")}
        ${networkAtlasTabButton("security", "Security")}
        ${networkAtlasTabButton("audit", "Audit")}
        ${networkAtlasTabButton("runbook", "Runbook")}
        ${networkAtlasTabButton("notes", "Notes")}
      </div>
      <div class="network-atlas-body">
        ${tabMarkup[selectedNetworkAtlasTab] || tabMarkup.overview}
      </div>
    </section>
  `;
}

function clientDashboardTabButton(tab, label) {
  return `<button type="button" class="${selectedClientDashboardTab === tab ? "active" : ""}" data-client-dashboard-tab="${tab}">${escapeHtml(label)}</button>`;
}

function dismissedClientActionIds(clientId) {
  const ids = state.clientDashboardDismissals?.[clientId];
  return Array.isArray(ids) ? new Set(ids) : new Set();
}

function dismissClientAction(clientId, actionId) {
  if (!state.clientDashboardDismissals || typeof state.clientDashboardDismissals !== "object") state.clientDashboardDismissals = {};
  const existing = Array.isArray(state.clientDashboardDismissals[clientId]) ? state.clientDashboardDismissals[clientId] : [];
  if (!existing.includes(actionId)) state.clientDashboardDismissals[clientId] = [...existing, actionId];
  saveState();
  renderClientDashboard();
}

function clientAddressCards(client) {
  const cards = [
    ["Bill to", client.billTo || client.name || "Not set"],
    ["Ship to", client.shipTo || client.billTo || client.name || "Same as billing address"],
  ];
  if (client.serviceAddress && client.serviceAddress !== client.billTo && client.serviceAddress !== client.shipTo) {
    cards.push(["Service address", client.serviceAddress]);
  }
  if (Array.isArray(client.addresses)) {
    client.addresses.forEach(address => {
      const label = address.label || address.type || "Additional address";
      const value = address.value || address.address || "";
      if (value) cards.push([label, value]);
    });
  }
  return cards;
}

function parseClientAddress(value = "") {
  const rows = String(value || "").split(/\n/).map(row => row.trim()).filter(Boolean);
  const address = { attention: "", company: "", street: "", line2: "", city: "", region: "", postalCode: "", phone: "", email: "" };
  const emailIndex = rows.findIndex(row => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row));
  if (emailIndex >= 0) address.email = rows.splice(emailIndex, 1)[0];
  const phoneIndex = rows.findIndex(row => /^(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(row));
  if (phoneIndex >= 0) address.phone = rows.splice(phoneIndex, 1)[0];
  const locationIndex = rows.findIndex(row => /,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?$/i.test(row));
  if (locationIndex >= 0) {
    const locationRow = rows[locationIndex];
    const match = locationRow.match(/^(.*?(?:Ave\.?|Avenue|St\.?|Street|Rd\.?|Road|Dr\.?|Drive|Ln\.?|Lane|Blvd\.?|Boulevard|Way|Ct\.?|Court|Hwy\.?|Highway))\s+(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i)
      || locationRow.match(/^(.+?)\n?(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i);
    if (match) {
      address.street = match[1];
      address.city = match[2];
      address.region = match[3].toUpperCase();
      address.postalCode = match[4];
      rows.splice(locationIndex, 1);
    }
  }
  if (!address.street) {
    const cityIndex = rows.findIndex(row => /^(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i.test(row));
    if (cityIndex >= 0) {
      const match = rows[cityIndex].match(/^(.+?),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i);
      address.city = match[1];
      address.region = match[2].toUpperCase();
      address.postalCode = match[3];
      rows.splice(cityIndex, 1);
    }
  }
  if (!address.street && rows.length > 2) address.street = rows.splice(2, 1)[0];
  if (rows.length) address.attention = rows.shift();
  if (rows.length) address.company = rows.shift();
  if (!address.street && rows.length) address.street = rows.shift();
  if (rows.length) address.line2 = rows.join(", ");
  return address;
}

function structuredClientAddress(client, kind) {
  const property = kind === "shipping" ? "shippingAddress" : "billingAddress";
  const legacy = kind === "shipping" ? client.shipTo : client.billTo;
  return { ...parseClientAddress(legacy || ""), ...(client[property] || {}) };
}

function formatClientAddress(address = {}) {
  const cityLine = [address.city, address.region].filter(Boolean).join(", ") + (address.postalCode ? ` ${address.postalCode}` : "");
  return [address.attention, address.company, address.street, address.line2, cityLine, address.phone, address.email]
    .map(value => String(value || "").trim()).filter(Boolean).join("\n");
}

function clientAddressEditorFields(prefix, title, address = {}) {
  return `
    <div class="field full client-address-editor">
      <div class="client-address-editor-head"><h3>${escapeHtml(title)}</h3><span>Structured mailing address</span></div>
      <div class="client-address-editor-grid">
        ${field(`${prefix}Attention`, "Attention / Recipient", address.attention || "")}
        ${field(`${prefix}Company`, "Company", address.company || "")}
        ${field(`${prefix}Street`, "Street Address", address.street || "")}
        ${field(`${prefix}Line2`, "Suite / Unit / Address Line 2", address.line2 || "")}
        ${field(`${prefix}City`, "City", address.city || "")}
        ${field(`${prefix}Region`, "State", address.region || "")}
        ${field(`${prefix}PostalCode`, "ZIP Code", address.postalCode || "")}
        ${field(`${prefix}Phone`, "Phone", address.phone || "")}
        ${field(`${prefix}Email`, "Email", address.email || "", "email")}
      </div>
    </div>`;
}

function clientSiteManagementPanel(client) {
  const locations = clientNetworkLocations(client);
  const selectedLocation = selectedNetworkLocationForClient(client);
  return `
    <section class="client-dashboard-card client-location-management">
      <div class="card-head">
        <div><h3>Site Locations</h3><p class="subtle">Physical locations and their network documentation connections.</p></div>
      </div>
      <div class="client-location-management-grid">
        ${locations.map(location => `
          <article class="client-location-record ${location.id === selectedLocation?.id ? "active" : ""}">
            <button type="button" class="client-location-record-select" data-network-location-button="${escapeHtml(location.id)}" data-network-location-client="${escapeHtml(client.id)}">
              <strong>${escapeHtml(location.name || "Site")}</strong>
              <span>${lines(networkLocationAddress(location) || "Address not set")}</span>
              ${location.phone || location.siteContact ? `<small>${escapeHtml([location.siteContact, location.phone].filter(Boolean).join(" · "))}</small>` : ""}
            </button>
            <button type="button" data-network-location-rename="${escapeHtml(location.id)}" data-network-location-client="${escapeHtml(client.id)}">Edit Site</button>
          </article>`).join("")}
        <button type="button" class="client-location-record-create" data-network-location-create="${escapeHtml(client.id)}">
          <strong>+ New Site</strong><span>Add an address, contact, and UniFi connection</span>
        </button>
      </div>
    </section>`;
}

function clientDashboardTabSummary(tab, label) {
  return `<div class="client-tab ${selectedClientDashboardTab === tab ? "active" : ""}" data-client-dashboard-tab="${tab}">${escapeHtml(label)}</div>`;
}

const vaultFileCategories = ["Backups", "Reports", "Network Topology", "Pictures", "Site Notes", "Config Captures", "Runbooks", "Exports / Handoff"];
const remoteVaultDocuments = new Map();
const remoteVaultPasswordCounts = new Map();
let vaultStorageMode = "checking";

function vaultDocumentFolder(document = {}) {
  if (document.category !== "Pictures and Site Notes") return document.category;
  const mimeType = String(document.mimeType || "").toLowerCase();
  const filename = String(document.filename || "").toLowerCase();
  return mimeType.startsWith("image/") || /\.(?:avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i.test(filename)
    ? "Pictures"
    : "Site Notes";
}

function remoteVaultDocument(row = {}) {
  return {
    id: row.id,
    clientId: row.external_client_id,
    filename: row.filename,
    category: row.folder || "General",
    sensitivity: row.sensitivity || "confidential",
    mimeType: row.mime_type || "application/octet-stream",
    byteSize: Number(row.byte_size || 0),
    createdAt: row.created_at,
    checksum: row.checksum_sha256 || "",
    title: row.title || "",
    description: row.description || "",
    source: row.source || "",
    snapshotId: row.snapshot_id || "",
    locationId: row.location_id || "",
    locationName: row.location_name || "",
    artifactKind: row.artifact_kind || "",
    reportKind: row.report_kind || "",
    backupKind: row.backup_kind || "",
    storage: "private-cloud",
  };
}

function clientVaultDocuments(clientId) {
  if (remoteVaultDocuments.has(clientId)) return remoteVaultDocuments.get(clientId);
  return (Array.isArray(state.vaultDocuments) ? state.vaultDocuments : [])
    .filter(document => document.clientId === clientId && !document.deletedAt && !isObsoleteGeneratedVaultDocument(document))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function refreshClientVaultDocuments(clientId = selectedClientId) {
  if (!clientId) return;
  try {
    const response = await fetch(`/api/vault/documents?clientId=${encodeURIComponent(clientId)}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Vault returned ${response.status}.`);
    remoteVaultDocuments.set(clientId, (payload.documents || []).map(remoteVaultDocument));
    remoteVaultPasswordCounts.set(clientId, Number(payload.passwordCount || 0));
    vaultStorageMode = "private-cloud";
  } catch (error) {
    vaultStorageMode = "local-browser";
    console.info("Private vault storage is unavailable; using browser-local storage.", error);
  }
  if (activeView === "client-dashboard" && selectedClientDashboardTab === "files" && selectedClientId === clientId) renderClientDashboard();
}

async function uploadRemoteVaultFile({ clientId, file, category, sensitivity, title = "", description = "", source = "", snapshotId = "", locationId = "", locationName = "", artifactKind = "", reportKind = "", backupKind = "" }) {
  const form = new FormData();
  form.set("clientId", clientId);
  form.set("clientName", clientById(clientId)?.name || clientId);
  form.set("category", category);
  form.set("sensitivity", sensitivity);
  form.set("title", title);
  form.set("description", description);
  form.set("source", source);
  form.set("snapshotId", snapshotId);
  form.set("locationId", locationId);
  form.set("locationName", locationName);
  form.set("artifactKind", artifactKind);
  form.set("reportKind", reportKind);
  form.set("backupKind", backupKind);
  form.set("file", file);
  const response = await fetch("/api/vault/documents", { method: "POST", body: form });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Upload returned ${response.status}.`);
  return remoteVaultDocument(payload.document);
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatVaultDocumentTimestamp(value) {
  if (!value) return "No timestamp";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString([], { dateStyle: "short", timeStyle: "short" });
}

function openVaultFileDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("gsvClientVaultFiles", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeVaultFile(documentId, file) {
  const database = await openVaultFileDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readwrite");
    transaction.objectStore("files").put(file, documentId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function addGeneratedClientVaultFile({ clientId, filename, category = "Reports", sensitivity = "confidential", mimeType = "application/octet-stream", blob, source = "generated", snapshotId = "", locationId = "", locationName = "", artifactKind = "", reportKind = "", backupKind = "" }) {
  if (!clientId || !filename || !blob) return null;
  if (vaultStorageMode === "private-cloud") {
    const document = await uploadRemoteVaultFile({ clientId, file: new File([blob], filename, { type: mimeType }), category, sensitivity, source, snapshotId, locationId, locationName, artifactKind, reportKind, backupKind });
    remoteVaultDocuments.set(clientId, [document, ...(remoteVaultDocuments.get(clientId) || [])]);
    return document;
  }
  const id = `vault_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const file = new File([blob], filename, { type: mimeType });
  await storeVaultFile(id, file);
  const document = {
    id,
    clientId,
    filename,
    category,
    sensitivity,
    mimeType: file.type || mimeType,
    byteSize: file.size,
    createdAt: new Date().toISOString(),
    source,
    snapshotId,
    locationId,
    locationName,
    artifactKind,
    reportKind,
    backupKind,
    storage: "local-browser",
  };
  if (!Array.isArray(state.vaultDocuments)) state.vaultDocuments = [];
  state.vaultDocuments.push(document);
  return document;
}

async function readVaultFile(documentId) {
  const database = await openVaultFileDatabase();
  const file = await new Promise((resolve, reject) => {
    const request = database.transaction("files").objectStore("files").get(documentId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return file;
}

async function removeVaultFile(documentId) {
  const database = await openVaultFileDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readwrite");
    transaction.objectStore("files").delete(documentId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function uploadClientVaultFiles(input) {
  const files = [...(input.files || [])];
  if (!files.length || !selectedClientId) return;
  const category = document.getElementById("vault-upload-category")?.value || "Runbooks";
  const sensitivity = document.getElementById("vault-upload-sensitivity")?.value || "standard";
  const titleInput = document.getElementById("vault-picture-title");
  const descriptionInput = document.getElementById("vault-picture-description");
  const title = String(titleInput?.value || "").trim();
  const description = String(descriptionInput?.value || "").trim();
  if (category === "Pictures" && !title) {
    input.value = "";
    titleInput?.focus();
    throw new Error("Add a title before choosing a picture.");
  }
  if (vaultStorageMode === "private-cloud") {
    for (const file of files) await uploadRemoteVaultFile({ clientId: selectedClientId, file, category, sensitivity, title, description });
    input.value = "";
    if (titleInput) titleInput.value = "";
    if (descriptionInput) descriptionInput.value = "";
    await refreshClientVaultDocuments(selectedClientId);
    return;
  }
  const added = [];
  for (const file of files) {
    const id = `vault_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await storeVaultFile(id, file);
    added.push({
      id,
      clientId: selectedClientId,
      filename: file.name,
      category,
      sensitivity,
      mimeType: file.type || "application/octet-stream",
      byteSize: file.size,
      createdAt: new Date().toISOString(),
      title,
      description,
      storage: "local-browser",
    });
  }
  if (!Array.isArray(state.vaultDocuments)) state.vaultDocuments = [];
  state.vaultDocuments.push(...added);
  saveState();
  renderClientDashboard();
}

async function downloadClientVaultFile(documentId) {
  const metadata = clientVaultDocuments(selectedClientId).find(document => document.id === documentId);
  if (!metadata) return;
  if (["highly_sensitive", "break_glass"].includes(metadata.sensitivity) && !window.confirm(`Sensitive file: ${metadata.filename}\n\nConfirm this download for the local access record.`)) return;
  if (metadata.storage === "private-cloud") {
    window.location.assign(`/api/vault/documents/${encodeURIComponent(documentId)}/download`);
    return;
  }
  const file = await readVaultFile(documentId);
  if (!file) return window.alert("The local file content is unavailable. Its metadata is still present.");
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = metadata.filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function canViewVaultDocument(document = {}) {
  const mimeType = String(document.mimeType || "");
  if (/\.json$/i.test(String(document.filename || "")) || /^application\/json/i.test(mimeType)) return false;
  return (
    document.category === "Reports" ||
    /^(text\/html|text\/markdown|text\/plain|application\/pdf)/i.test(mimeType)
  );
}

function vaultFileRow(document) {
  const isPicture = vaultDocumentFolder(document) === "Pictures";
  const heading = isPicture && document.title ? document.title : document.filename;
  const filename = isPicture && document.title ? `<span class="vault-picture-filename">${escapeHtml(document.filename)}</span>` : "";
  const description = isPicture && document.description ? `<p class="vault-picture-description">${escapeHtml(document.description)}</p>` : "";
  const sensitivityLabel = document.sensitivity === "standard" ? "Normal" : "Sensitive";
  const siteLabel = document.locationName ? ` · Site: ${escapeHtml(document.locationName)}` : "";
  return `<div class="client-doc-row vault-file-row"><div><strong>${escapeHtml(heading)}</strong>${filename}${description}<span>${formatFileSize(document.byteSize)} · ${sensitivityLabel} · ${formatVaultDocumentTimestamp(document.createdAt)}${siteLabel}</span></div><div class="row-actions">${canViewVaultDocument(document) ? `<button type="button" data-vault-view="${escapeHtml(document.id)}">View</button>` : ""}<button type="button" data-vault-download="${escapeHtml(document.id)}">Download</button><button type="button" class="danger" data-vault-delete="${escapeHtml(document.id)}">Delete</button></div></div>`;
}

function openClientVault(clientId) {
  const frame = document.querySelector("#vault iframe");
  const vaultUrl = `/portal/vault?embedded=1&clientId=${encodeURIComponent(clientId || "")}`;
  if (frame) {
    try {
      frame.contentWindow.location.replace(vaultUrl);
    } catch {
      frame.src = vaultUrl;
    }
  }
  setView("vault");
}

async function viewClientVaultFile(documentId) {
  const metadata = clientVaultDocuments(selectedClientId).find(document => document.id === documentId);
  if (!metadata) return;
  if (!canViewVaultDocument(metadata)) return downloadClientVaultFile(documentId);
  if (["highly_sensitive", "break_glass"].includes(metadata.sensitivity) && !window.confirm(`Sensitive report: ${metadata.filename}\n\nConfirm opening this report.`)) return;
  if (metadata.storage === "private-cloud") {
    window.open(`/api/vault/documents/${encodeURIComponent(documentId)}/download`, "_blank", "noopener");
    return;
  }

  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    window.alert("Allow pop-ups for this portal to view reports in a new tab.");
    return;
  }
  reportWindow.document.write(`<title>${escapeHtml(metadata.filename)}</title><p style="font-family: system-ui, sans-serif;">Loading report...</p>`);
  const file = await readVaultFile(documentId);
  if (!file) {
    reportWindow.close();
    window.alert("The local report content is unavailable. Its metadata is still present.");
    return;
  }
  const url = URL.createObjectURL(file);
  reportWindow.location.href = url;
  setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
}

async function deleteClientVaultFile(documentId) {
  const metadata = clientVaultDocuments(selectedClientId).find(document => document.id === documentId);
  if (!metadata || !window.confirm(`Permanently delete ${metadata.filename}?\n\nThis removes the stored file and cannot be undone.`)) return;
  if (metadata.storage === "private-cloud") {
    const response = await fetch(`/api/vault/documents/${encodeURIComponent(documentId)}`, { method: "DELETE" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return window.alert(payload.error || `Delete returned ${response.status}.`);
    await refreshClientVaultDocuments(selectedClientId);
    return;
  }
  metadata.deletedAt = new Date().toISOString();
  await removeVaultFile(documentId);
  saveState();
  renderClientDashboard();
}

async function cleanDuplicateBackupFiles(clientId, keepPerType) {
  const client = clientById(clientId || selectedClientId);
  const backups = clientVaultDocuments(client?.id).filter(document => document.category === "Backups");
  const jsonCount = backups.filter(document => !/\.unf$/i.test(document.filename)).length;
  const nativeCount = backups.filter(document => /\.unf$/i.test(document.filename)).length;
  const removeCount = Math.max(0, jsonCount - keepPerType) + Math.max(0, nativeCount - keepPerType);
  if (!client || !removeCount) return;
  if (!window.confirm(`Delete ${removeCount} older backup file${removeCount === 1 ? "" : "s"}?\n\nThe newest DR JSON and newest native .unf backup will be kept when available. This cannot be undone.`)) return;
  const response = await fetch("/api/vault/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId: client.id, folder: "Backups", keepPerType }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return window.alert(payload.error || `Cleanup returned ${response.status}.`);
  await refreshClientVaultDocuments(client.id);
  window.alert(`${payload.deleted || 0} duplicate backup file${payload.deleted === 1 ? "" : "s"} deleted.`);
}

async function pruneRemoteBackupFiles(clientId) {
  if (vaultStorageMode !== "private-cloud") return 0;
  const response = await fetch("/api/vault/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, folder: "Backups", keepPerType: 1 }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Backup retention returned ${response.status}.`);
  return Number(payload.deleted || 0);
}

async function pullBackupFromFiles(clientId) {
  const client = clientById(clientId || selectedClientId);
  const location = selectedNetworkLocationForClient(client);
  if (!client || !location) return;
  if (!location.hostId || !location.siteId) {
    window.alert(`Configure the UniFi Host ID and Site ID for ${location.name || "this site"} before pulling a backup.`);
    return;
  }
  const result = await pullNetworkAtlasSnapshot(client.id, location.id);
  if (!result?.snapshot) return;
  await refreshClientVaultDocuments(client.id);
  const nativeMessage = result.nativeBackupCaptured
    ? "Native UniFi Network .unf backup captured."
    : `Native Network .unf was unavailable${result.nativeBackupError ? `: ${result.nativeBackupError}` : "."}`;
  window.alert(`Site backup pull complete for ${location.name}.\n\nNetwork DR JSON saved.\n${nativeMessage}\n\nThe JSON includes console/site inventory and records application coverage. UniFi System Config Backups remain the authoritative all-application restore file.`);
}

async function pullReportFromFiles(clientId) {
  const client = clientById(clientId || selectedClientId);
  const snapshot = selectedNetworkSnapshotForClient(client) || networkSnapshotsForClient(client)[0];
  if (!client || !snapshot?.id) {
    window.alert("Pull a site backup first so the report has a retained network snapshot to document.");
    return;
  }
  const pullKey = `${client.id}:${snapshot.id}`;
  if (networkReportPulls.has(pullKey)) return;
  networkReportPulls.add(pullKey);
  renderClientDashboard({ syncSites: false });
  try {
    const reports = await autoSaveNetworkSnapshotReportFiles(client.id, snapshot.id);
    if (!reports.length) throw new Error("The report generator did not return a PDF file.");
    await refreshClientVaultDocuments(client.id);
    window.alert(`Network report saved for ${snapshot.locationName || "the selected site"}.`);
  } finally {
    networkReportPulls.delete(pullKey);
    if (activeView === "client-dashboard" && selectedClientId === client.id) renderClientDashboard({ syncSites: false });
  }
}

async function pullTopologyFromFiles(clientId) {
  const client = clientById(clientId || selectedClientId);
  const location = selectedNetworkLocationForClient(client);
  if (!client || !location) return;
  const locationSnapshots = networkSnapshotsForClient(client, location.id);
  const snapshot = locationSnapshots.find(row => row.id === selectedNetworkSnapshotId) || locationSnapshots[0];
  if (!snapshot?.id) {
    window.alert(`Pull a site snapshot for ${location.name || "this site"} before generating its topology.`);
    return;
  }
  const pullKey = `${client.id}:${snapshot.id}`;
  if (networkTopologyPulls.has(pullKey)) return;
  networkTopologyPulls.add(pullKey);
  renderClientDashboard({ syncSites: false });
  try {
    const artifacts = await autoSaveNetworkSnapshotArtifactFiles(client.id, snapshot.id, { replaceTopology: true });
    const topologyFile = artifacts.find(document =>
      document?.artifactKind === "network-topology-html" || document?.category === "Network Topology"
    );
    if (!topologyFile) throw new Error("The topology generator did not return a topology file.");
    await refreshClientVaultDocuments(client.id);
    window.alert(`Network topology generated from the selected ${location.name} snapshot and saved to Files.`);
  } finally {
    networkTopologyPulls.delete(pullKey);
    if (activeView === "client-dashboard" && selectedClientId === client.id) renderClientDashboard({ syncSites: false });
  }
}

async function deleteAllClientVaultFiles(clientId) {
  if (!portalIsLocalHost) {
    window.alert("Bulk file deletion is only available on the local development portal.");
    return;
  }
  const client = clientById(clientId || selectedClientId);
  if (!client) return;
  const documents = clientVaultDocuments(client.id);
  if (!documents.length) {
    window.alert(`No files found for ${client.name}.`);
    return;
  }
  const confirmed = window.confirm(`Delete all ${documents.length} file${documents.length === 1 ? "" : "s"} for ${client.name}?\n\nThis removes file contents from this browser and hides the records from the Files tab.`);
  if (!confirmed) return;

  const deletedAt = new Date().toISOString();
  const failures = [];
  for (const document of documents) {
    try {
      await removeVaultFile(document.id);
      document.deletedAt = deletedAt;
      document.deletedReason = "client-files-cleared";
    } catch (error) {
      failures.push(`${document.filename}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  saveState();
  renderClientDashboard();

  const deletedCount = documents.length - failures.length;
  if (failures.length) {
    window.alert(`Deleted ${deletedCount} of ${documents.length} file${documents.length === 1 ? "" : "s"} for ${client.name}.\n\nFailed:\n${failures.join("\n")}`);
  } else {
    window.alert(`Deleted ${deletedCount} file${deletedCount === 1 ? "" : "s"} for ${client.name}.`);
  }
}

function microsoftUserNameParts(row = {}) {
  if (row.firstName || row.lastName) return { firstName: row.firstName || "", lastName: row.lastName || "" };
  const parts = String(row.displayName || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || "",
    lastName: parts.join(" "),
  };
}

function microsoftUserIsDealer(row = {}) {
  return /^(dealer|dealers|dealership)$/i.test(String(row.employeeType || "").trim())
    || /\bdealers?\b/i.test(String(row.department || ""));
}

function clientMicrosoftUsersPanel(client, audit) {
  const users = Array.isArray(audit?.rows) ? audit.rows : [];
  const dealers = users.filter(microsoftUserIsDealer).length;
  const enabled = users.filter(row => row.accountEnabled !== false && row.status !== "Excluded").length;
  return `
    <div class="client-tab-head">
      <div><h3>Microsoft 365 Users</h3><p class="subtle">Identity, email, licensing, and workforce classification from Microsoft Entra.</p></div>
      <button type="button" class="primary" data-client-users-refresh="${escapeHtml(client.id)}">Pull from Microsoft 365</button>
    </div>
    <div class="client-health-line m365-user-metrics">
      <article class="client-health-item"><span>Total users</span><strong>${users.length}</strong><small>${audit?.pulledAt ? `Updated ${escapeHtml(new Date(audit.pulledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }))}` : "Not pulled yet"}</small></article>
      <article class="client-health-item"><span>Enabled &amp; licensed</span><strong>${enabled}</strong><small>Active billable identities</small></article>
      <article class="client-health-item"><span>Dealers</span><strong>${dealers}</strong><small>Employee type or department = Dealer</small></article>
    </div>
    <section class="client-dashboard-card">
      <div class="card-head"><div><h3>User Directory</h3><p class="subtle">To identify a Moxie dealer in 365, set the Entra user property <strong>Employee type</strong> to <strong>Dealer</strong>.</p></div></div>
      <div class="client-users-toolbar">
        <label class="client-users-search"><span>Search users</span><input type="search" placeholder="Name, username, email, or license" data-client-users-search></label>
        <label><span>Type</span><select data-client-users-type><option value="all">All types</option><option value="employee">Employees</option><option value="dealer">Dealers</option></select></label>
        <span class="client-users-result-count" data-client-users-result-count>${users.length} user${users.length === 1 ? "" : "s"}</span>
      </div>
      <div class="client-users-table-wrap">
        <table class="client-users-table">
          <thead><tr><th>First name</th><th>Last name</th><th>Username</th><th>Email address</th><th>License</th><th>Type</th></tr></thead>
          <tbody>
            ${users.length ? users.map(row => {
              const names = microsoftUserNameParts(row);
              const dealer = microsoftUserIsDealer(row);
              const searchText = [names.firstName, names.lastName, row.displayName, row.upn, row.email, row.licenses, dealer ? "dealer" : "employee"].filter(Boolean).join(" ").toLowerCase();
              return `<tr data-client-user-row data-user-type="${dealer ? "dealer" : "employee"}" data-user-search="${escapeHtml(searchText)}">
                <td>${escapeHtml(names.firstName || "—")}</td>
                <td>${escapeHtml(names.lastName || "—")}</td>
                <td>${escapeHtml(row.upn || "—")}</td>
                <td>${escapeHtml(row.email || row.upn || "—")}</td>
                <td>${escapeHtml(row.licenses || "Unlicensed")}</td>
                <td><span class="badge ${dealer ? "warn" : "normal"}">${dealer ? "Dealer" : "Employee"}</span></td>
              </tr>`;
            }).join("") : `<tr><td colspan="6">No Microsoft 365 users have been pulled for this client. Use Pull from Microsoft 365.</td></tr>`}
            ${users.length ? `<tr data-client-users-empty hidden><td colspan="6">No users match the current search and Type filter.</td></tr>` : ""}
          </tbody>
        </table>
      </div>
    </section>`;
}

function filterClientMicrosoftUsers() {
  const search = String(document.querySelector("[data-client-users-search]")?.value || "").trim().toLowerCase();
  const type = document.querySelector("[data-client-users-type]")?.value || "all";
  const rows = [...document.querySelectorAll("[data-client-user-row]")];
  let visible = 0;
  rows.forEach(row => {
    const matchesSearch = !search || String(row.dataset.userSearch || "").includes(search);
    const matchesType = type === "all" || row.dataset.userType === type;
    row.hidden = !(matchesSearch && matchesType);
    if (!row.hidden) visible += 1;
  });
  const count = document.querySelector("[data-client-users-result-count]");
  if (count) count.textContent = `${visible} user${visible === 1 ? "" : "s"}`;
  const empty = document.querySelector("[data-client-users-empty]");
  if (empty) empty.hidden = visible !== 0;
}

async function refreshClientMicrosoftUsers(clientId) {
  const client = clientById(clientId);
  if (!client?.m365TenantKey) {
    window.alert(`${client?.name || "This client"} does not have a Microsoft 365 tenant key configured.`);
    return;
  }
  const button = document.querySelector(`[data-client-users-refresh="${CSS.escape(clientId)}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "Pulling users…";
  }
  try {
    await pullMicrosoft365AuditForClient(clientId, today.slice(0, 7));
    saveState();
    renderClientDashboard({ syncSites: false });
  } catch (error) {
    if (button) {
      button.disabled = false;
      button.textContent = "Pull from Microsoft 365";
    }
    window.alert(error instanceof Error ? error.message : "Microsoft 365 user pull failed.");
  }
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
  const monthlyTotal = hasBillingChildren ? rollupBillingTotal(client.id) : currentBillingTotal(client.id);
  const microsoftCostTotal = hasBillingChildren ? rollupPax8CostTotal(client.id) : pax8CostTotal(client.id);
  const microsoftCostLabel = hasBillingChildren ? costMoney.format(microsoftCostTotal) : pax8CostLabel(client.id, month);
  const ninjaOneTotal = hasBillingChildren ? rollupNinjaOneCostTotal(client.id) : ninjaOneCostTotal(client.id);
  const otherCostTotal = hasBillingChildren ? rollupOtherManualCostTotal(client.id) : otherManualCostTotal(client.id);
  const marginTotal = hasBillingChildren ? rollupCostMargin(client.id) : costMargin(client.id);
  const networkSnapshots = networkSnapshotsForClient(client);
  const filesNetworkLocation = selectedNetworkLocationForClient(client);
  const filesBackupPulling = networkSnapshotPulls.has(`${client.id}:${filesNetworkLocation?.id || "default"}`);
  const filesReportSnapshot = selectedNetworkSnapshotForClient(client) || networkSnapshots[0];
  const filesReportPulling = filesReportSnapshot?.id && networkReportPulls.has(`${client.id}:${filesReportSnapshot.id}`);
  const filesTopologySnapshot = networkSnapshotsForClient(client, filesNetworkLocation?.id).find(row => row.id === selectedNetworkSnapshotId) || networkSnapshotsForClient(client, filesNetworkLocation?.id)[0];
  const filesTopologyPulling = filesTopologySnapshot?.id && networkTopologyPulls.has(`${client.id}:${filesTopologySnapshot.id}`);
  const latestNetworkSnapshot = networkSnapshots[0];
  const selectedNetworkSnapshot = selectedNetworkSnapshotForClient(client);
  const primaryAtlasPath = latestNetworkSnapshot?.atlasPath || client.networkAtlasPath || "";
  const networkStatus = networkSnapshots.length ? "Captured" : primaryAtlasPath ? "Available" : "Not documented";
  const latestNetworkDate = latestNetworkSnapshot?.capturedAt
    ? new Date(latestNetworkSnapshot.capturedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "";
  const openInvoices = clientInvoices(client.id).filter(inv => computedInvoiceStatus(inv) !== "paid");
  const draftInvoices = clientInvoices(client.id).filter(inv => computedInvoiceStatus(inv) === "draft");
  const recentQuotes = clientQuotes(client.id).slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 5);
  const openQuotes = clientQuotes(client.id).filter(quote => !["accepted", "approved", "converted", "declined"].includes(String(quote.status || "").toLowerCase()));
  const quotePipelineTotal = openQuotes.reduce((sum, quote) => sum + invoiceTotal(quote), 0);
  const vaultDocuments = clientVaultDocuments(client.id);
  const vaultPasswordCount = remoteVaultPasswordCounts.get(client.id) || 0;
  const sensitiveVaultDocuments = vaultDocuments.filter(document => document.sensitivity !== "standard");
  const serviceStatus = [
    ["Microsoft 365 users", audit ? `${audit.rows.length} rows` : "Not pulled", audit ? "good" : "warn"],
    ["Pax8 subscriptions", pax8 ? `${(pax8.rows || []).length} rows` : "Not pulled", pax8 ? "good" : "warn"],
    ["NinjaOne devices", ninjaOne ? `${ninjaOne.totals?.devices || 0} found` : client.ninjaOneOrgId ? "Not pulled" : "Add org ID", ninjaOne ? "good" : "warn"],
  ];
  const billingAddress = structuredClientAddress(client, "billing");
  const shippingAddress = structuredClientAddress(client, "shipping");
  const detailsFields = [
    ["Client name", client.name || "Not set"],
    ["Status", client.status || "active"],
    ["Primary contact", client.contactName || "Not set"],
    ["Email", client.email || "Not set"],
    ["Phone", client.phone || "Not set"],
    ["CC email", client.ccEmail || "Not set"],
    ["Approved requesters", client.approvedRequesterEmails || "No client requesters configured"],
  ];
  const serviceIdRows = [
    ["Microsoft tenant key", client.m365TenantKey || "Not set", client.m365TenantKey ? "good" : "warn"],
    ["Pax8 company ID", client.pax8CompanyId || "Not set", client.pax8CompanyId ? "good" : "warn"],
    ["NinjaOne organization ID", client.ninjaOneOrgId || "Not set", client.ninjaOneOrgId ? "good" : "warn"],
  ].filter(Boolean);
  const activityItems = [
    latestNetworkSnapshot ? ["Network snapshot captured", `${latestNetworkSnapshot.label || "Network snapshot"} - ${latestNetworkDate}`, "Done", "good"] : ["Network topology", "No retained topology snapshots.", "Open", "warn"],
    audit || pax8 || ninjaOne ? ["Services audit", "At least one service source has current data.", "Partial", "good"] : ["Services audit", "Microsoft 365, Pax8, and NinjaOne have not been pulled this month.", "Open", "warn"],
    draftInvoices.length ? ["Invoice queue", `${draftInvoices.length} draft invoice${draftInvoices.length === 1 ? "" : "s"} waiting for review.`, "Review", "warn"] : ["Invoice queue", "No draft invoices.", "Clear", ""],
  ];
  const networkDetails = networkAtlasDetails(client, selectedNetworkSnapshot);
  const networkTabMarkup = {
    overview: `
      ${networkOverviewReportHeader(client, networkDetails)}
      <div class="metric-grid client-metrics">
        ${networkDetails.metrics.map(metricCardMarkup).join("")}
      </div>
      <section>
        <div class="section-head"><h2>Snapshot History</h2></div>
        <div class="network-snapshot-list">
          ${networkSnapshots.length ? networkSnapshots.map(snapshot => `
            <article class="network-snapshot-row ${snapshot.id === selectedNetworkSnapshot?.id ? "active" : ""}">
              <div>
                <strong>${escapeHtml(snapshot.label || "Network snapshot")}</strong>
                <span>${escapeHtml(networkSnapshotCapturedLabel(snapshot))}</span>
              </div>
              <div class="row-actions">
                ${snapshot.configPath ? `<button data-network-config="${escapeHtml(snapshot.configPath)}">Download Config</button>` : ""}
              </div>
            </article>
          `).join("") : `<div class="item"><strong>No snapshots retained yet.</strong></div>`}
        </div>
      </section>
    `,
    topology: networkAtlasTopology(client, networkDetails),
    ports: networkAtlasTable(["Device / Port", "State", "Speed", "Device / Purpose", "Address", "Power"], networkDetails.ports),
    clients: networkCombinedDevicesTable(networkDetails),
    wifi: networkAtlasWifiPlan(networkDetails),
    security: networkAtlasSecurityPlan(networkDetails),
    notes: networkSnapshotNotesPanel(client, networkDetails),
    audit: networkAuditWorkspace(client, networkDetails),
    runbook: networkAtlasRunbook(networkDetails),
  };
  const tabContent = {
    dashboard: `
      <div class="client-health-line">
        <article class="client-health-item"><span>${hasBillingChildren ? "Monthly billing rollup" : "Monthly billing"}</span><strong>${money.format(monthlyTotal)}</strong><small>${hasBillingChildren ? "Across billing children" : "Current recurring billing and Microsoft 365"}</small></article>
        <article class="client-health-item"><span>Estimated margin</span><strong>${costMoney.format(marginTotal)}</strong><small>${openInvoices.length ? `${openInvoices.length} open invoice${openInvoices.length === 1 ? "" : "s"}` : "No open balance"}</small></article>
        <article class="client-health-item"><span>Network</span><strong>${networkSnapshots.length ? "Captured" : primaryAtlasPath ? "Published" : "Missing"}</strong><small>${networkSnapshots.length} snapshot${networkSnapshots.length === 1 ? "" : "s"}</small></article>
      </div>
      <div class="client-module-grid">
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Billing Snapshot</h3></div>
          <div class="client-doc-row-list">
            <article class="client-doc-row"><div><strong>Recent invoices</strong><span>${recentInvoices[0] ? `${recentInvoices[0].number} - ${formatDate(recentInvoices[0].date)}` : "No invoices yet"}</span></div><strong>${money.format(recentInvoices[0] ? invoiceTotal(recentInvoices[0]) : 0)}</strong></article>
            <article class="client-doc-row"><div><strong>Recent quotes</strong><span>${recentQuotes[0] ? `${recentQuotes[0].number} - ${formatDate(recentQuotes[0].date)}` : "No open quotes or accepted proposals"}</span></div><strong>${money.format(recentQuotes[0] ? invoiceTotal(recentQuotes[0]) : 0)}</strong></article>
            <article class="client-doc-row"><div><strong>Quote pipeline</strong><span>${openQuotes.length} open quote${openQuotes.length === 1 ? "" : "s"}</span></div><strong>${money.format(quotePipelineTotal)}</strong></article>
          </div>
        </section>
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Recent Activity</h3></div>
          <div class="client-timeline-list">
            ${activityItems.map(item => `<article class="client-timeline-row"><div><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></div><span class="badge ${item[3] || "normal"}">${escapeHtml(item[2])}</span></article>`).join("")}
          </div>
        </section>
      </div>
      <div class="client-module-grid single">
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Quick Actions</h3></div>
          <div class="client-quick-grid compact">
            <button class="client-quick-action" type="button" data-client-dashboard-tab="network"><strong>Network</strong><span>Open atlas tab</span></button>
            <button class="client-quick-action" type="button" data-client-dashboard-tab="files"><strong>Files</strong><span>Open client repository</span></button>
            <button class="client-quick-action" type="button" data-client-dashboard-tab="invoices"><strong>Invoices</strong><span>Review billing</span></button>
            <button class="client-quick-action" type="button" data-client-dashboard-tab="quotes"><strong>Quotes</strong><span>Open pipeline</span></button>
          </div>
        </section>
      </div>
    `,
    details: `
      <div class="client-tab-head">
        <div><h3>Client Details</h3><p class="subtle">Company contacts, billing setup, physical sites, and connected services.</p></div>
        <button data-edit-client="${escapeHtml(client.id)}" class="primary">Edit Client</button>
      </div>
      <div class="client-module-grid client-details-primary-grid">
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Company &amp; Contact</h3></div>
          <div class="client-detail-field-grid">
            ${detailsFields.map(field => `<div class="client-detail-field ${field[0] === "Approved requesters" ? "span" : ""}"><span>${escapeHtml(field[0])}</span><strong>${escapeHtml(field[1])}</strong></div>`).join("")}
          </div>
        </section>
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Billing Profile</h3></div>
          <div class="client-billing-summary">
            <div class="client-billing-meta">
              <div><span>Payment terms</span><strong>${escapeHtml(client.terms || "Not set")}</strong></div>
              <div><span>Bills to</span><strong>${escapeHtml(client.billingClientId ? clientName(client.billingClientId) : client.name)}</strong></div>
            </div>
            <div class="client-address-grid compact">
              <article class="client-address-card"><span>Billing address</span><strong>${lines(formatClientAddress(billingAddress) || "Not set")}</strong></article>
              <article class="client-address-card"><span>Shipping address</span><strong>${lines(formatClientAddress(shippingAddress) || "Same as billing address")}</strong></article>
            </div>
          </div>
        </section>
      </div>
      <div class="client-module-grid single">
        ${clientSiteManagementPanel(client)}
      </div>
      <div class="client-module-grid">
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Service Connections</h3></div>
          <div class="client-doc-row-list">
            ${serviceIdRows.map(row => `<article class="client-doc-row"><div><strong>${escapeHtml(row[0])}</strong><span>${escapeHtml(row[1])}</span></div><span class="badge ${row[2]}">${row[2] === "good" ? "Set" : "Missing"}</span></article>`).join("")}
          </div>
        </section>
        <section class="client-dashboard-card">
          <div class="card-head"><h3>Billing Rules</h3></div>
          <div class="client-doc-row-list">
            <article class="client-doc-row"><div><strong>Monthly MSP rates</strong><span>Full user, light user, service account, Copilot</span></div><span class="badge normal">Edit form</span></article>
            <article class="client-doc-row"><div><strong>Internal costs</strong><span>${costs.length ? `${costs.length} active cost${costs.length === 1 ? "" : "s"}` : "No internal costs tracked"}</span></div><span class="badge normal">Client-level</span></article>
          </div>
        </section>
      </div>
    `,
    users: clientMicrosoftUsersPanel(client, audit),
    network: `
      <div class="ticket-detail-tabs network-atlas-tabs client-network-tabs">
        ${networkAtlasTabButton("overview", "Overview")}
        ${networkAtlasTabButton("topology", "Topology")}
        ${networkAtlasTabButton("ports", "Port Map")}
        ${networkAtlasTabButton("clients", "Clients")}
        ${networkAtlasTabButton("wifi", "Wi-Fi")}
        ${networkAtlasTabButton("security", "Security")}
        ${networkAtlasTabButton("audit", "Audit")}
        ${networkAtlasTabButton("runbook", "Runbook")}
        ${networkAtlasTabButton("notes", "Notes")}
      </div>
      ${networkSnapshotWorkspace(client, selectedNetworkSnapshot, networkSnapshots)}
      <div class="network-atlas-body">${networkTabMarkup[selectedNetworkAtlasTab] || networkTabMarkup.overview}</div>
    `,
    files: `
      <div class="client-health-line vault-health-line">
        <article class="client-health-item"><span>Total files</span><strong>${vaultDocuments.length}</strong><small>Shared across all ${escapeHtml(client.name)} sites</small></article>
        <article class="client-health-item"><span>Sensitive</span><strong>${sensitiveVaultDocuments.length}</strong><small>Confirmation required</small></article>
        <button type="button" class="client-health-item vault-password-summary" data-open-client-vault="${escapeHtml(client.id)}"><span>Passwords</span><strong>${vaultPasswordCount}</strong><small>Open secure client Vault</small></button>
        <article class="client-health-item vault-storage-status ${vaultStorageMode === "private-cloud" ? "connected" : ""}"><span>Cloud connection</span><strong>${vaultStorageMode === "private-cloud" ? "Connected" : vaultStorageMode === "checking" ? "Checking" : "Local fallback"}</strong><small>${vaultStorageMode === "private-cloud" ? "Private Vercel Blob repository" : vaultStorageMode === "checking" ? "Testing secure backend" : "Cloud backend not connected"}</small></article>
      </div>
      <section class="client-dashboard-card">
        <div class="card-head"><div><h3>Client Repository</h3><p class="subtle">One private repository shared across every client site. Generated filenames include the site code.</p></div><span class="subtle">${vaultDocuments.length} file${vaultDocuments.length === 1 ? "" : "s"}</span></div>
        <div class="vault-repository-layout">
          <nav class="vault-folder-nav" aria-label="Repository folders">
            ${vaultFileCategories.map(folder => {
              const count = vaultDocuments.filter(document => vaultDocumentFolder(document) === folder).length;
              return `<button type="button" class="vault-folder-button ${selectedVaultFolder === folder ? "active" : ""}" data-vault-folder="${escapeHtml(folder)}"><span>${escapeHtml(folder)}</span><small>${count} file${count === 1 ? "" : "s"}</small></button>`;
            }).join("")}
          </nav>
          <div class="vault-folder-workspace">
            ${(() => {
              const folder = vaultFileCategories.includes(selectedVaultFolder) ? selectedVaultFolder : "Backups";
              const categoryDocuments = vaultDocuments.filter(document => vaultDocumentFolder(document) === folder);
              const visibleDocuments = categoryDocuments.slice(0, 8);
              const overflowDocuments = categoryDocuments.slice(8);
              const retainedBackupCount = 1;
              const duplicateBackups = folder === "Backups" && (
                categoryDocuments.filter(document => !/\.unf$/i.test(document.filename)).length > retainedBackupCount ||
                categoryDocuments.filter(document => /\.unf$/i.test(document.filename)).length > retainedBackupCount
              );
              return `<div class="vault-folder-head"><div><h3>${escapeHtml(folder)}</h3><p>${categoryDocuments.length} file${categoryDocuments.length === 1 ? "" : "s"}${["Backups", "Network Topology"].includes(folder) && filesNetworkLocation ? ` · ${escapeHtml(filesNetworkLocation.name)}` : ""}</p></div><div class="toolbar">${duplicateBackups ? `<button type="button" class="danger" data-vault-clean-backups="${escapeHtml(client.id)}" data-vault-keep-backups="${retainedBackupCount}">Clean duplicates</button>` : ""}${folder === "Backups" ? `<button type="button" class="primary" data-vault-pull-backup="${escapeHtml(client.id)}" ${filesBackupPulling ? "disabled" : ""}>${filesBackupPulling ? "Pulling backup…" : "Pull Site Backup"}</button>` : ""}${folder === "Reports" ? `<button type="button" class="primary" data-vault-pull-report="${escapeHtml(client.id)}" ${filesReportPulling ? "disabled" : ""}>${filesReportPulling ? "Generating report…" : "Generate Report"}</button>` : ""}${folder === "Network Topology" ? `<button type="button" class="primary" data-vault-pull-topology="${escapeHtml(client.id)}" ${filesTopologyPulling ? "disabled" : ""}>${filesTopologyPulling ? "Building topology…" : "Generate Topology"}</button>` : ""}</div></div>${folder === "Backups" ? `<p class="vault-backup-coverage">Captures Network DR JSON and attempts the native Network .unf file. Retain the console’s System Config Backup for an all-application restore.</p>` : ""}<div class="vault-folder-upload ${folder === "Pictures" ? "vault-picture-upload" : ""}"><input id="vault-upload-category" type="hidden" value="${escapeHtml(folder)}">${folder === "Pictures" ? `<label><span>Picture title</span><input id="vault-picture-title" type="text" maxlength="160" placeholder="Required title" required></label><label><span>Description</span><input id="vault-picture-description" type="text" maxlength="1000" placeholder="What this picture documents"></label>` : ""}<label><span>Sensitivity</span><select id="vault-upload-sensitivity"><option value="standard" selected>Normal</option><option value="confidential">Sensitive</option></select></label><label class="primary vault-file-picker">${folder === "Pictures" ? "Choose picture" : "Upload files"}<input id="vault-file-upload" type="file" ${folder === "Pictures" ? `accept="image/*"` : "multiple"}></label></div><div class="client-doc-row-list">${visibleDocuments.map(vaultFileRow).join("") || `<div class="vault-empty">This folder is empty.</div>`}${overflowDocuments.length ? `<details class="vault-file-overflow"><summary>Show ${overflowDocuments.length} older file${overflowDocuments.length === 1 ? "" : "s"}</summary>${overflowDocuments.map(vaultFileRow).join("")}</details>` : ""}</div>`;
            })()}
          </div>
        </div>
      </section>
    `,
    invoices: `
      <div class="client-tab-head">
        <div><h3>Invoices</h3><p class="subtle">Open AR, drafts, recent invoices, and billing inputs for this client.</p></div>
        <div class="toolbar">
          <button data-client-billing-view="invoices" data-client-billing-id="${escapeHtml(client.id)}">View All Invoices</button>
          <button data-client-invoice="${escapeHtml(client.id)}" class="primary">New Invoice</button>
        </div>
      </div>
      <div class="client-health-line">
        <article class="client-health-item"><span>Open AR</span><strong>${money.format(openInvoices.reduce((sum, inv) => sum + invoiceRemainingBalance(inv), 0))}</strong><small>${openInvoices.length} unpaid invoice${openInvoices.length === 1 ? "" : "s"}</small></article>
        <article class="client-health-item"><span>Draft invoices</span><strong>${draftInvoices.length}</strong><small>Waiting for review</small></article>
        <article class="client-health-item"><span>Monthly billing</span><strong>${money.format(monthlyTotal)}</strong><small>Current profile</small></article>
        <article class="client-health-item"><span>Last invoice</span><strong>${recentInvoices[0]?.number || "None"}</strong><small>${recentInvoices[0] ? formatDate(recentInvoices[0].date) : "No invoices yet"}</small></article>
      </div>
      <section class="client-quote-table-card client-invoice-table-card">
        <div class="client-quote-table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Date</th><th>Due</th><th>Status</th><th class="num">Total</th><th class="num">Paid</th><th>Actions</th></tr></thead>
            <tbody>
              ${clientInvoices(client.id).slice().sort((a, b) => b.date.localeCompare(a.date)).map(inv => {
                const status = computedInvoiceStatus(inv);
                const needsAction = invoiceNeedsAction(inv);
                return `<tr class="clickable-row ${needsAction ? "invoice-action-needed" : ""}" data-open-customer-preview-invoice="${inv.id}" tabindex="0">
                  <td><strong>${escapeHtml(inv.number)}</strong><br><span class="subtle">${escapeHtml(inv.type || "")}</span>${needsAction ? `<br><span class="action-needed-pill">${escapeHtml(invoiceActionLabel(inv))}</span>` : ""}</td>
                  <td>${formatDate(inv.date)}</td>
                  <td>${formatDate(inv.dueDate)}</td>
                  <td><span class="badge ${status}">${status}</span></td>
                  <td class="num">${money.format(invoiceTotal(inv))}</td>
                  <td class="num">${money.format(paidAmount(inv.id))}</td>
                  <td>${invoiceActionButtons(inv)}</td>
                </tr>`;
              }).join("") || `<tr><td colspan="7" class="client-quote-empty"><strong>No invoices yet.</strong><span>Create the first invoice for ${escapeHtml(client.name)}.</span></td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `,
    quotes: `
      <div class="client-tab-head">
        <div><h3>Quotes</h3><p class="subtle">Review, send, edit, preview, and convert this client's quotes.</p></div>
        <div class="toolbar">
          <button data-client-billing-view="quotes" data-client-billing-id="${escapeHtml(client.id)}">View All Quotes</button>
          <button data-client-quote="${escapeHtml(client.id)}" class="primary">New Quote</button>
        </div>
      </div>
      <div class="client-health-line">
        <article class="client-health-item"><span>Open quotes</span><strong>${openQuotes.length}</strong><small>Active proposals</small></article>
        <article class="client-health-item"><span>Pipeline value</span><strong>${money.format(quotePipelineTotal)}</strong><small>Open quoted work</small></article>
        <article class="client-health-item"><span>Converted quotes</span><strong>${clientQuotes(client.id).filter(quote => quote.status === "converted").length}</strong><small>Accepted and invoiced</small></article>
        <article class="client-health-item"><span>Last quote</span><strong>${recentQuotes[0]?.number || "None"}</strong><small>${recentQuotes[0] ? formatDate(recentQuotes[0].date) : "No quote history"}</small></article>
      </div>
      <section class="client-quote-table-card">
        <div class="client-quote-table-wrap">
          <table>
            <thead><tr><th>Quote</th><th>Date</th><th>Status</th><th class="num">Total</th><th class="num">Margin</th><th>Actions</th></tr></thead>
            <tbody>
              ${clientQuotes(client.id).sort((a, b) => b.date.localeCompare(a.date)).map(quote => `
                <tr class="clickable-row" data-open-customer-preview-quote="${quote.id}" tabindex="0">
                  <td><strong>${escapeHtml(quote.number)}</strong><br><span class="subtle">${escapeHtml(quote.title || "")}</span></td>
                  <td>${formatDate(quote.date)}</td>
                  <td><span class="badge ${quote.status}">${escapeHtml(quote.status || "draft")}</span></td>
                  <td class="num">${money.format(invoiceTotal(quote))}</td>
                  <td class="num">${money.format(quoteMargin(quote))}</td>
                  <td><div class="row-actions">
                    <button data-preview-quote="${quote.id}">Admin Preview</button>
                    <button data-customer-preview-quote="${quote.id}">Customer Preview</button>
                    <button data-edit-quote="${quote.id}">Edit</button>
                    ${quote.status !== "converted" && quote.status !== "declined" ? `<button data-send-quote="${quote.id}">Send</button>` : ""}
                    ${quote.status !== "converted" && quote.status !== "declined" ? `<button data-convert-quote="${quote.id}" class="primary">Create Invoice</button>` : ""}
                  </div></td>
                </tr>
              `).join("") || `<tr><td colspan="6" class="client-quote-empty"><strong>No quotes yet.</strong><span>Create the first quote for ${escapeHtml(client.name)}.</span></td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `,
  };
  return `
    <section class="client-dashboard">
      <div class="section-head client-dashboard-main-head">
        <div>
          <p class="eyebrow">Client dashboard</p>
          <h2>${escapeHtml(client.name)}</h2>
          ${billingLabel ? `<p class="subtle">${escapeHtml(billingLabel)}</p>` : ""}
        </div>
      </div>

      ${clientNetworkLocationSelector(client)}
      <div class="client-dashboard-tabs">
        ${clientDashboardTabButton("dashboard", "Dashboard")}
        ${clientDashboardTabButton("details", "Client Details")}
        ${clientDashboardTabButton("users", "Users")}
        ${clientDashboardTabButton("network", "Infrastructure")}
        ${clientDashboardTabButton("files", "Files")}
        ${clientDashboardTabButton("invoices", "Invoices")}
        ${clientDashboardTabButton("quotes", "Quotes")}
        <div class="client-dashboard-tab-actions">
          <button data-audit-services="${client.id}" type="button">Audit Services</button>
          <button data-client-invoice="${client.id}" type="button">Auto Generate Invoice</button>
        </div>
      </div>
      <div class="client-tab-body">
        ${tabContent[selectedClientDashboardTab] || tabContent.dashboard}
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
    firstName: raw["First Name"] || raw.givenName || "",
    lastName: raw["Last Name"] || raw.surname || "",
    upn,
    email: raw["Email Address"] || raw.mail || upn,
    licenses,
    department: raw.Department || raw.department || "",
    employeeType: raw["Employee Type"] || raw.employeeType || "",
    jobTitle: raw["Job Title"] || raw.jobTitle || "",
    userType: raw["User Type"] || raw.userType || "",
    accountEnabled: enabled,
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
  renderInvoiceDashboard();
  updateNavInvoiceQueueActive(filter);
  const rows = state.invoices
    .filter(inv => invoiceMatchesQueue(inv, filter))
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

function renderInvoiceDashboard() {
  const dashboard = document.getElementById("invoice-dashboard");
  if (!dashboard) return;
  const cards = [
    { queue: "new", label: "New", detail: "Last 30 days, unpaid", tone: "new" },
    { queue: "payment_due", label: "Payment due", detail: "Sent or overdue balance", tone: "due" },
    { queue: "paid", summaryQueue: "paid_ytd", label: "Paid YTD", detail: "Completed invoices this year", tone: "paid" }
  ];
  dashboard.innerHTML = cards.map(card => {
    const summary = invoiceQueueSummary(card.summaryQueue || card.queue);
    const preview = summary.invoices
      .slice()
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 3)
      .map(inv => `<span>${escapeHtml(inv.number)} <strong>${money.format(card.summaryQueue === "paid_ytd" ? invoiceTotal(inv) : Math.max(0, invoiceRemainingBalance(inv)))}</strong></span>`)
      .join("");
    return `
      <button class="invoice-dashboard-card ${card.tone}" type="button" data-invoice-filter-set="${card.queue}">
        <span>${escapeHtml(card.detail)}</span>
        <strong>${escapeHtml(card.label)}</strong>
        <b>${summary.invoices.length}</b>
        <em>${money.format(summary.total)}</em>
        <small>${preview || "No invoices"}</small>
      </button>
    `;
  }).join("");
}

function updateNavInvoiceQueueActive(filter) {
  document.querySelectorAll("[data-invoice-parent]").forEach(button => {
    button.classList.toggle("active", activeView === "invoices");
  });
  document.querySelectorAll("[data-invoice-filter-set]").forEach(button => {
    button.classList.toggle("active", activeView === "invoices" && button.dataset.invoiceFilterSet === filter);
  });
}

function setInvoiceNavExpanded(expanded) {
  const parent = document.querySelector("[data-invoice-parent]");
  if (!parent) return;
  parent.classList.toggle("expanded", expanded);
  parent.setAttribute("aria-expanded", expanded ? "true" : "false");
  const chevron = parent.querySelector("[data-invoice-chevron]");
  if (chevron) chevron.textContent = expanded ? "⌃" : "⌄";
}

function openClientBillingView(kind, clientId) {
  selectedClientId = clientId || selectedClientId;
  if (kind === "quotes") {
    setView("quotes");
    renderQuoteClientFilter(clientId || "");
    const quoteClientFilter = document.getElementById("quote-client-filter");
    if (quoteClientFilter) quoteClientFilter.value = clientId || "";
    renderQuotes();
    return;
  }

  setInvoiceNavExpanded(true);
  setView("invoices");
  renderInvoiceClientFilter(clientId || "");
  const invoiceClientFilter = document.getElementById("invoice-client-filter");
  const invoiceFilter = document.getElementById("invoice-filter");
  const invoiceDateFrom = document.getElementById("invoice-date-from");
  const invoiceDateTo = document.getElementById("invoice-date-to");
  const invoiceSearch = document.getElementById("invoice-search");
  if (invoiceClientFilter) invoiceClientFilter.value = clientId || "";
  if (invoiceFilter) invoiceFilter.value = "all";
  if (invoiceDateFrom) invoiceDateFrom.value = "";
  if (invoiceDateTo) invoiceDateTo.value = "";
  if (invoiceSearch) invoiceSearch.value = "";
  renderInvoices();
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

function renderQuoteClientFilter(selected = "") {
  const selectNode = document.getElementById("quote-client-filter");
  if (!selectNode) return;
  const options = [
    `<option value="">All companies</option>`,
    ...state.clients.map(client => `<option value="${client.id}" ${selected === client.id ? "selected" : ""}>${escapeHtml(client.name)}</option>`)
  ].join("");
  if (selectNode.innerHTML !== options) selectNode.innerHTML = options;
  selectNode.value = selected;
}

function renderQuotes() {
  const clientFilter = document.getElementById("quote-client-filter")?.value || "";
  renderQuoteClientFilter(clientFilter);
  const rows = state.quotes
    .filter(quote => !clientFilter || quote.clientId === clientFilter)
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
            ${quote.status !== "converted" && quote.status !== "declined" ? `<button data-convert-quote="${quote.id}" class="primary">Create Invoice</button>` : ""}
          </div>
        </td>
      </tr>
    `).join("");
  document.getElementById("quote-list").innerHTML = `
    <table>
      <thead><tr><th>Quote</th><th>Client</th><th>Date</th><th>Status</th><th class="num">Total</th><th class="num">Margin</th><th>Actions</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7">No quotes found.</td></tr>`}</tbody>
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
  createInvoiceButton.hidden = !(mode === "quote" && existing.id && existing.status !== "converted" && existing.status !== "declined");
  pdfButton.hidden = mode !== "invoice";
  sendButton.hidden = !((mode === "invoice" || mode === "quote") && existing.id);
  setEditorError("");
  dialog.showModal();
  updateEditorTotal();
}

function openBlankQuote(clientId = "") {
  const currentClientId = clientId || (activeView === "client-dashboard" ? selectedClientId : "");
  openEditor("quote", {
    clientId: currentClientId,
    date: today,
    status: "draft",
    title: "",
    subject: "",
    items: [],
    showShipTo: false,
    shipTo: "",
    notes: ""
  });
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

function clientAddressesToText(addresses = []) {
  return (Array.isArray(addresses) ? addresses : [])
    .map(address => {
      const label = String(address.label || address.type || "Additional address").trim();
      const value = String(address.value || address.address || "").trim();
      return [label, value].filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n---\n");
}

function textToClientAddresses(text = "") {
  const raw = String(text || "").trim();
  if (!raw) return [];
  return raw
    .split(/\n\s*---\s*\n/g)
    .map(block => {
      const rows = block.split(/\n/).map(row => row.trim()).filter(Boolean);
      if (!rows.length) return null;
      if (rows.length === 1 && rows[0].includes("|")) {
        const [label, ...rest] = rows[0].split("|");
        return { id: id("addr"), label: label.trim() || "Additional address", value: rest.join("|").trim() };
      }
      const label = rows.shift() || "Additional address";
      return { id: id("addr"), label, value: rows.join("\n") };
    })
    .filter(address => address && address.value);
}

function clientNetworkLocationsToText(locations = []) {
  return (Array.isArray(locations) ? locations : []).map(location => [
    location.name || "Location",
    location.address || "",
    location.hostId ? `Host ID: ${location.hostId}` : "",
    location.siteId ? `Site ID: ${location.siteId}` : "",
  ].filter(Boolean).join("\n")).join("\n---\n");
}

function textToClientNetworkLocations(text = "", existingLocations = []) {
  const existingByName = new Map((Array.isArray(existingLocations) ? existingLocations : []).map(location => [String(location.name || "").toLowerCase(), location]));
  return String(text || "").trim().split(/\n\s*---\s*\n/g).map(block => {
    const rows = block.split(/\n/).map(row => row.trim()).filter(Boolean);
    if (!rows.length) return null;
    const name = rows.shift();
    const existing = existingByName.get(name.toLowerCase());
    const hostRow = rows.find(row => /^host id\s*:/i.test(row));
    const siteRow = rows.find(row => /^site id\s*:/i.test(row));
    return {
      ...(existing || {}),
      id: existing?.id || `loc_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || Date.now()}`,
      name,
      address: rows.filter(row => !/^(host|site) id\s*:/i.test(row)).join("\n"),
      hostId: hostRow?.replace(/^host id\s*:\s*/i, "") || "",
      siteId: siteRow?.replace(/^site id\s*:\s*/i, "") || "",
    };
  }).filter(Boolean);
}

function clientNetworkLinksToText(links = [], locations = []) {
  const names = new Map((Array.isArray(locations) ? locations : []).map(location => [location.id, location.name]));
  return (Array.isArray(links) ? links : []).map(link => [
    names.get(link.fromLocationId) || link.fromLocationId,
    names.get(link.toLocationId) || link.toLocationId,
    link.type || "SD-WAN",
    link.status || "active",
    link.provider || "",
    Array.isArray(link.routedNetworks) ? link.routedNetworks.join(", ") : "",
  ].join(" | ")).join("\n");
}

function textToClientNetworkLinks(text = "", locations = []) {
  const locationByName = new Map((Array.isArray(locations) ? locations : []).map(location => [location.name.toLowerCase(), location]));
  return String(text || "").split(/\n/).map(row => row.trim()).filter(Boolean).map((row, index) => {
    const [fromName, toName, type = "SD-WAN", status = "active", provider = "", routedNetworks = ""] = row.split("|").map(value => value.trim());
    const from = locationByName.get(String(fromName || "").toLowerCase());
    const to = locationByName.get(String(toName || "").toLowerCase());
    if (!from || !to) return null;
    return { id: `link_${from.id}_${to.id}_${index}`, fromLocationId: from.id, toLocationId: to.id, type, status, provider, routedNetworks: routedNetworks.split(",").map(value => value.trim()).filter(Boolean) };
  }).filter(Boolean);
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
    const billingAddress = structuredClientAddress(item, "billing");
    const shippingAddress = structuredClientAddress(item, "shipping");
    return `
      <div class="field full client-editor-section">
        <h3>Company &amp; Primary Contact</h3>
      </div>
      ${field("name", "Client Name", item.name || "")}
      ${field("status", "Status", item.status || "active")}
      ${field("contactName", "Primary Contact Name", item.contactName || "")}
      ${field("email", "Primary Email", item.email || "")}
      ${field("phone", "Primary Phone", item.phone || "")}
      ${field("ccEmail", "Invoice CC Email(s)", item.ccEmail || "")}
      ${field("terms", "Terms", item.terms || "Net 15")}
      ${select("billingClientId", "Bills To Client", billingClientOptions(item.billingClientId || "", item.id), false)}
      <div class="field full client-editor-section">
        <h3>Billing &amp; Shipping</h3>
        <p class="subtle">These addresses are used on invoices and quotes. Physical service locations are managed separately as sites.</p>
      </div>
      ${clientAddressEditorFields("billing", "Billing Address", billingAddress)}
      ${clientAddressEditorFields("shipping", "Shipping Address", shippingAddress)}
      <div class="field full client-editor-section">
        <h3>Service Connections</h3>
        <p class="subtle">Manage site-specific UniFi Host and Site IDs from each location's Edit Site modal.</p>
      </div>
      ${field("m365TenantKey", "Microsoft 365 Tenant Key", item.m365TenantKey || "")}
      <p class="field-note full">Use a short key like nyssco, giorgios, mike_d_sells, or sausage_sams. Leave blank if this client does not have its own Microsoft 365 tenant yet.</p>
      ${field("pax8CompanyId", "Pax8 Company ID", item.pax8CompanyId || "")}
      ${field("ninjaOneOrgId", "NinjaOne Organization ID", item.ninjaOneOrgId || "", "number")}
      ${field("networkAtlasPath", "Network Atlas Path", item.networkAtlasPath || "")}
      <p class="field-note full">Optional protected portal path, for example /portal/network-atlas/the-19th-hole.</p>
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
  const values = mode === "quote" ? ["draft", "sent", "declined", "converted"] : ["draft", "ready", "sent", "paid", "void"];
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
    const existingClient = clientById(editing.id) || {};
    const billingAddress = {
      attention: data.billingAttention || "", company: data.billingCompany || "", street: data.billingStreet || "",
      line2: data.billingLine2 || "", city: data.billingCity || "", region: data.billingRegion || "",
      postalCode: data.billingPostalCode || "", phone: data.billingPhone || "", email: data.billingEmail || "",
    };
    const shippingAddress = {
      attention: data.shippingAttention || "", company: data.shippingCompany || "", street: data.shippingStreet || "",
      line2: data.shippingLine2 || "", city: data.shippingCity || "", region: data.shippingRegion || "",
      postalCode: data.shippingPostalCode || "", phone: data.shippingPhone || "", email: data.shippingEmail || "",
    };
    const client = {
      ...existingClient,
      id: editing.id || id("client"),
      name: data.name,
      status: data.status || "active",
      contactName: data.contactName || "",
      email: data.email,
      ccEmail: data.ccEmail,
      phone: data.phone,
      terms: data.terms,
      billingClientId: data.billingClientId || "",
      m365TenantKey: String(data.m365TenantKey || "").trim(),
      pax8CompanyId: data.pax8CompanyId || "",
      ninjaOneOrgId: Number(data.ninjaOneOrgId || 0),
      networkAtlasPath: String(data.networkAtlasPath || "").trim(),
      networkLocations: Array.isArray(existingClient.networkLocations) ? structuredClone(existingClient.networkLocations) : [],
      networkSnapshots: Array.isArray(existingClient.networkSnapshots)
        ? structuredClone(existingClient.networkSnapshots)
        : [],
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
      billingAddress,
      shippingAddress,
      billTo: formatClientAddress(billingAddress),
      shipTo: formatClientAddress(shippingAddress),
      serviceAddress: existingClient.serviceAddress || "",
      addresses: Array.isArray(existingClient.addresses) ? structuredClone(existingClient.addresses) : [],
      notes: data.notes
    };
    client.networkLinks = Array.isArray(existingClient.networkLinks) ? structuredClone(existingClient.networkLinks) : [];
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

function closeDocumentPreview() {
  const preview = document.getElementById("document-preview");
  if (preview?.open) preview.close();
}

function focusNextControl(container, current) {
  const controls = [...container.querySelectorAll("input, select, textarea, button, [tabindex]")]
    .filter(control =>
      !control.disabled &&
      control.type !== "hidden" &&
      control.offsetParent !== null &&
      control.tabIndex !== -1
    );
  const currentIndex = controls.indexOf(current);
  const nextControl = controls[currentIndex + 1] || controls[0];
  if (nextControl) {
    nextControl.focus();
    if (nextControl.select) nextControl.select();
  }
}

function updatePreviewActions(type, doc, customerMode) {
  const invoiceStatus = type === "invoice" ? computedInvoiceStatus(doc) : "";
  const canSend = type === "invoice"
    ? invoiceStatus !== "paid" && invoiceStatus !== "void"
    : doc.status !== "converted" && doc.status !== "declined";
  document.getElementById("admin-preview-document").hidden = !customerMode;
  document.getElementById("customer-preview-document").hidden = customerMode;
  document.getElementById("create-customer-preview-document").hidden = type !== "quote" || Boolean(doc.clientId) || !quoteOneTimeClient(doc);
  document.getElementById("create-invoice-preview-document").hidden = type !== "quote" || doc.status === "converted" || doc.status === "declined";
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

function safeDownloadName(value = "export") {
  return String(value || "export").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "export";
}

function siteFilenameToken(locationName = "", locationId = "") {
  const words = String(locationName || "").match(/[a-z0-9]+/gi) || [];
  let abbreviation = words.length > 1
    ? words.map(word => word[0]).join("")
    : String(words[0] || locationId || "site").slice(0, 3);
  abbreviation = abbreviation.toUpperCase().replace(/[^A-Z0-9]/g, "") || "SITE";
  return `-${abbreviation}`;
}

function exportTextFile(name, text, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function pdfSafeText(value = "") {
  return String(value || "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pdfEscape(value = "") {
  return pdfSafeText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapReportLine(value = "", maxChars = 92) {
  const text = pdfSafeText(value);
  if (!text) return [""];
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  words.forEach(word => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function makeNetworkReportLines(client, details = {}) {
  const lines = [];
  const add = value => lines.push(value || "");
  const section = title => {
    add("");
    add(title.toUpperCase());
    add("-".repeat(Math.min(72, title.length + 12)));
  };
  const snapshotDate = details.snapshotCapturedAt ? networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }) : "Not captured";

  add(`${client?.name || "Client"} - Network Snapshot Report`);
  add(`Generated: ${new Date().toLocaleString()}`);
  add(`Snapshot: ${details.snapshotLabel || "Network snapshot"}`);
  add(`Captured: ${snapshotDate}`);
  if (details.controllerUrl) add(`UniFi Network: ${details.controllerUrl}`);

  section("Overview");
  (details.metrics || []).forEach(metric => {
    const detail = String(metric?.[2] || "").replace(/\s+\|\s+/g, "; ");
    add(`${metric?.[0] || "Metric"}: ${metric?.[1] || "-"}${detail ? ` - ${detail}` : ""}`);
  });

  section("Topology Summary");
  const summary = details.topologyPlan?.summary;
  if (summary?.title) add(`Site: ${summary.title}`);
  (Array.isArray(summary?.lines) ? summary.lines : []).forEach(line => add(`- ${line}`));
  if (!summary && details.summary) add(details.summary);

  section("Infrastructure Devices");
  const nodes = Array.isArray(details.nodes) ? details.nodes : [];
  if (!nodes.length) add("No infrastructure devices retained in this snapshot.");
  nodes.slice(0, 40).forEach(node => {
    add(`${node.type || "Device"}: ${node.title || "UniFi device"} (${node.status || "unknown"})`);
    (node.rows || []).slice(0, 5).forEach(row => add(`  ${row[0]}: ${row[1]}`));
  });

  section("Ports");
  const ports = Array.isArray(details.ports) ? details.ports : [];
  if (!ports.length) add("No port records retained in this snapshot.");
  ports.slice(0, 35).forEach(row => add(`${row[0] || "-"} | ${row[1] || "-"} | ${row[2] || "-"} | ${row[3] || "-"}`));
  if (ports.length > 35) add(`... ${ports.length - 35} additional port rows omitted from this summary report.`);

  section("Wi-Fi");
  const wifiPlan = Array.isArray(details.wifiPlan) ? details.wifiPlan : [];
  if (wifiPlan.length) {
    wifiPlan.forEach(ap => {
      add(`${ap.name || "AP"}: ${ap.clients ?? 0} clients, port ${ap.port || "-"}, uplink ${ap.uplink || "-"}`);
      (ap.radios || []).forEach(radio => add(`  ${radio[0]} GHz: Ch ${radio[1]}, ${radio[2]}, power ${radio[3] || "-"}`));
    });
  } else {
    const wifi = Array.isArray(details.wifi) ? details.wifi : [];
    if (!wifi.length) add("No Wi-Fi records retained in this snapshot.");
    wifi.slice(0, 20).forEach(row => add(row.join(" | ")));
  }

  section("Security");
  const securityPlan = details.securityPlan || derivedSecurityPlan(details);
  if (securityPlan) {
    add(securityPlan.title || "Security plan");
    add(securityPlan.subtitle || "");
    (securityPlan.rules || []).slice(0, 12).forEach(rule => add(`${rule.id}: ${rule.name} - ${rule.action} (${rule.source} -> ${rule.destination})`));
  } else {
    (details.security || []).slice(0, 20).forEach(row => add(row.join(" | ")));
  }

  section("Action Plan");
  const categories = networkActionPlanCategories(details);
  Object.entries(categories).forEach(([key, items]) => {
    if (!items.length) return;
    add(`${key.toUpperCase()}:`);
    items.slice(0, 10).forEach(item => {
      add(`- [${item.severity || "INFO"}] ${item.title || "Recommended review"}`);
      if (item.evidence) add(`  Evidence: ${item.evidence}`);
      if (item.recommendation) add(`  Recommendation: ${item.recommendation}`);
    });
  });

  return lines;
}

function buildTextPdfBlob(title, rawLines) {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 54;
  const topY = 736;
  const bottomY = 54;
  const lineHeight = 14;
  const lines = rawLines.flatMap(line => wrapReportLine(line, 92));
  const pages = [];
  let page = [];
  let y = topY;
  lines.forEach(line => {
    if (y < bottomY) {
      pages.push(page);
      page = [];
      y = topY;
    }
    page.push(line);
    y -= lineHeight;
  });
  if (page.length) pages.push(page);

  const objects = [];
  const addObject = body => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];

  pages.forEach((pageLines, pageIndex) => {
    const stream = [
      "BT",
      `/F1 ${pageIndex === 0 ? 14 : 10} Tf`,
      `${marginX} ${topY} Td`,
      `(${pdfEscape(pageIndex === 0 ? title : `${title} (continued)`)}) Tj`,
      `0 -${lineHeight + 8} Td`,
      "/F1 10 Tf",
      ...pageLines.map(line => `(${pdfEscape(line)}) Tj 0 -${lineHeight} Td`),
      "ET",
    ].join("\n");
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

function currentNetworkActionPlanMarkdown(clientId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return "";
  const snapshot = selectedNetworkSnapshotForClient(client);
  const details = networkAtlasDetails(client, snapshot);
  return networkActionPlanMarkdown(client, details);
}

function currentNetworkSnapshotCodexBriefMarkdown(clientId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return "";
  const snapshot = selectedNetworkSnapshotForClient(client);
  const details = networkAtlasDetails(client, snapshot);
  return networkSnapshotCodexBriefMarkdown(client, details);
}

function networkReportPage(title, subtitle, body, className = "") {
  return `
    <section class="report-page ${escapeHtml(className)}">
      <div class="report-page-head">
        <div>
          <span>Network Atlas</span>
          <h2>${escapeHtml(title)}</h2>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
        </div>
      </div>
      ${body}
    </section>
  `;
}

function networkReportRowsTable(headers, rows, emptyText = "No records documented yet.") {
  return `
    <div class="table-card report-table-card">
      <table>
        <thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(reportCellText(cell))}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="empty-cell">${escapeHtml(emptyText)}</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function reportCellText(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) return value.map(reportCellText).filter(part => part && part !== "-").join(", ") || "-";
  if (typeof value === "object") {
    const preferred = value.label || value.name || value.value || value.status || value.text || value.description;
    if (preferred) return reportCellText(preferred);
    return Object.entries(value)
      .filter(([, entryValue]) => entryValue !== null && entryValue !== undefined && entryValue !== "")
      .map(([key, entryValue]) => `${key}: ${reportCellText(entryValue)}`)
      .join(", ") || "-";
  }
  return String(value);
}

function reportMetricCards(details = {}) {
  return (details.metrics || []).filter(metric => {
    const label = String(metric?.[0] || "").toLowerCase();
    return !["atlas", "config"].includes(label);
  });
}

function reportMeaningfulPortRows(details = {}) {
  const rows = Array.isArray(details.ports) ? details.ports : [];
  return rows.filter(row => {
    const cells = row.map(reportCellText);
    const state = cells[1] || "";
    const speed = cells[2] || "";
    const purpose = cells[3] || "";
    const address = cells[4] || "";
    const power = cells[5] || "";
    const hasSignal = /up|active|connected|enabled/i.test(state) || /\d/.test(speed);
    const hasPurposeOrAddress = [purpose, address].some(value => value && !/^[-\s]*(unused|unknown)?[-\s]*$/i.test(value));
    const hasUsefulPower = hasSignal && power && !/^[-\s]*(off|disabled|none)?[-\s]*$/i.test(power);
    return hasSignal || hasPurposeOrAddress || hasUsefulPower;
  });
}

function reportPortSummary(details = {}) {
  const rows = Array.isArray(details.ports) ? details.ports : [];
  const meaningful = reportMeaningfulPortRows(details);
  const active = rows.filter(row => /up|active|connected|enabled/i.test(reportCellText(row[1]))).length;
  const slow = meaningful.filter(row => /100\s*mb/i.test(reportCellText(row[2]))).length;
  const unlabeledActive = meaningful.filter(row => {
    const state = reportCellText(row[1]);
    const purpose = reportCellText(row[3]);
    return /up|active|connected|enabled/i.test(state) && /^[-\s]*$|unknown|switch$/i.test(purpose);
  }).length;
  return { total: rows.length, included: meaningful.length, active, slow, unlabeledActive };
}

function reportTopologyNodeKind(node = {}) {
  const text = `${node.id || ""} ${node.type || ""} ${node.title || ""} ${node.subtitle || ""} ${node.tone || ""}`.toLowerCase();
  if (/wan|internet|fiber|isp/.test(text)) return "wan";
  if (/access point|\bap\b|u7|u6|wifi|wi-fi/.test(text)) return "ap";
  if (/switch|usw|us-/.test(text)) return "switch";
  if (/gateway|router|udm|dream machine|firewall/.test(text)) return "gateway";
  return "device";
}

function reportTopologyNodeTone(kind, node = {}) {
  if (kind === "wan") return "wan";
  if (kind === "ap") return "wifi";
  if (kind === "gateway" || kind === "switch") return "core";
  const tone = String(node.tone || "").toLowerCase();
  return ["wan", "warning", "core", "wifi", "service", "vlan"].includes(tone) ? tone : "service";
}

function reportSvgText(value, x, y, options = {}) {
  const max = options.max || 26;
  const lines = wrapReportLine(reportCellText(value), max).slice(0, options.lines || 3);
  const anchor = options.anchor || "middle";
  const className = options.className || "";
  const lineHeight = options.lineHeight || 17;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${escapeHtml(className)}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${escapeHtml(line)}</tspan>`).join("")}</text>`;
}

function reportTopologyNodeSvg(node = {}) {
  const tone = reportTopologyNodeTone(node.kind, node.raw);
  const x = Number(node.x || 0);
  const y = Number(node.y || 0);
  const width = Number(node.width || 210);
  const height = Number(node.height || 78);
  const isPhone = Boolean(topologyPhoneKind(node));
  const titleMax = width < 190 ? 18 : 24;
  if (isPhone) {
    return `
      <g class="report-map-node ${escapeHtml(tone)}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8"></rect>
        ${reportSvgText(node.title, x + width / 2, y + 25, { className: "report-map-node-title", max: 26, lines: 2, lineHeight: 18 })}
        ${reportSvgText(node.subtitle, x + width / 2, y + 68, { className: "report-map-node-subtitle", max: 31, lines: 2, lineHeight: 15 })}
        ${node.detail ? reportSvgText(node.detail, x + width / 2, y + height - 14, { className: "report-map-node-detail", max: 32, lines: 1 }) : ""}
      </g>
    `;
  }
  return `
    <g class="report-map-node ${escapeHtml(tone)}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8"></rect>
      ${reportSvgText(node.title, x + width / 2, y + 24, { className: "report-map-node-title", max: titleMax, lines: 2, lineHeight: 18 })}
      ${reportSvgText(node.subtitle, x + width / 2, y + 65, { className: "report-map-node-subtitle", max: titleMax + 8, lines: 1 })}
      ${node.detail ? reportSvgText(node.detail, x + width / 2, y + 83, { className: "report-map-node-detail", max: titleMax + 8, lines: 1 }) : ""}
    </g>
  `;
}

function reportTopologyLinkSvg(from, to, label = "", tone = "") {
  if (!from || !to) return "";
  const fromX = from.x + from.width / 2;
  const fromY = from.y + from.height;
  const toX = to.x + to.width / 2;
  const toY = to.y;
  const horizontal = Math.abs((from.y + from.height / 2) - (to.y + to.height / 2)) < 40;
  const start = horizontal ? { x: from.x + from.width, y: from.y + from.height / 2 } : { x: fromX, y: fromY };
  const end = horizontal ? { x: to.x, y: to.y + to.height / 2 } : { x: toX, y: toY };
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const path = horizontal
    ? `M${start.x} ${start.y} L${end.x} ${end.y}`
    : `M${start.x} ${start.y} C${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  const isWireless = String(tone || "").toLowerCase() === "wireless";
  const isPhoneLink = Boolean(topologyPhoneKind(to));
  const cleanLabel = isWireless || isPhoneLink ? "" : reportCellText(label).replace(/^-\s*$/, "");
  const labelWidth = Math.min(170, Math.max(86, cleanLabel.length * 7 + 24));
  const labelY = horizontal ? midY - 20 : midY - 10;
  return `
    <path class="report-map-link ${escapeHtml(tone || "")}${isPhoneLink ? " endpoint" : ""}" d="${path}"></path>
    ${cleanLabel ? `
      <rect class="report-map-link-badge" x="${midX - labelWidth / 2}" y="${labelY - 14}" width="${labelWidth}" height="24" rx="12"></rect>
      ${reportSvgText(cleanLabel, midX, labelY + 3, { className: "report-map-link-label", max: 22, lines: 1 })}
    ` : ""}
  `;
}

function networkReportTopology(client, sourceDetails = {}) {
  const details = applyClientTopologyIntelligence(client, sourceDetails);
  const plan = details.topologyPlan && typeof details.topologyPlan === "object" ? details.topologyPlan : null;
  const rawNodes = (Array.isArray(plan?.nodes) ? plan.nodes : [])
    .filter(node => String(node.id || "") !== "services-summary" && String(node.type || "") !== "Services & Networks" && !isPlaceholderWanNode(node))
    .filter(node => topologyPhoneKind(node) !== "Mobile Phone")
    .map(node => ({
      ...node,
      id: String(node.id || node.key || node.title || Math.random()),
      title: node.title || node.type || "Network device",
      subtitle: cleanTopologySubtitle(node.subtitle || node.type || ""),
      detail: cleanTopologyNodeDetail(node),
      kind: reportTopologyNodeKind(node),
    }));
  if (!rawNodes.length) return `<div class="item"><strong>No topology nodes were retained for this snapshot.</strong></div>`;

  const groups = {
    wan: rawNodes.filter(node => node.kind === "wan"),
    gateway: rawNodes.filter(node => node.kind === "gateway"),
    switch: rawNodes.filter(node => node.kind === "switch"),
    ap: rawNodes.filter(node => node.kind === "ap"),
    device: rawNodes.filter(node => node.kind === "device"),
  };
  if (!groups.gateway.length) {
    const fallbackGateway = rawNodes.find(node => /udm|gateway|router/i.test(`${node.title} ${node.subtitle}`));
    if (fallbackGateway) {
      Object.values(groups).forEach(group => {
        const index = group.indexOf(fallbackGateway);
        if (index >= 0) group.splice(index, 1);
      });
      fallbackGateway.kind = "gateway";
      groups.gateway.push(fallbackGateway);
    }
  }

  const deviceColumns = Math.min(5, Math.max(1, groups.device.length));
  const deviceRows = Math.max(1, Math.ceil(groups.device.length / deviceColumns));
  const maxRowCount = Math.max(groups.wan.length, groups.switch.length, groups.ap.length, deviceColumns, 2);
  const viewWidth = Math.max(1380, 880 + maxRowCount * 190);
  const viewHeight = groups.device.length ? 735 + deviceRows * 146 : 700;
  const logicalWidth = 255;
  const logicalX = viewWidth - logicalWidth - 60;
  const hardwareRight = logicalX - 70;
  const rowStart = 70;
  const rowEnd = Math.max(rowStart + 260, hardwareRight);
  const nodeWidth = 220;
  const nodeHeight = 96;
  const endpointWidth = 250;
  const endpointHeight = 116;
  const spread = (items, y, preferredCenter = null) => {
    if (!items.length) return [];
    if (items.length === 1) {
      const center = preferredCenter || (rowStart + rowEnd) / 2;
      return [{ ...items[0], x: Math.max(rowStart, Math.min(rowEnd - nodeWidth, center - nodeWidth / 2)), y, width: nodeWidth, height: nodeHeight }];
    }
    const usable = rowEnd - rowStart - nodeWidth;
    const step = usable / Math.max(1, items.length - 1);
    return items.map((item, index) => ({ ...item, x: rowStart + step * index, y, width: nodeWidth, height: nodeHeight }));
  };

  const gatewayCenter = Math.min(Math.max(rowStart + 430, rowEnd * 0.55), rowEnd - 130);
  const deviceLayout = groups.device.flatMap((item, index) => {
    const row = Math.floor(index / deviceColumns);
    const column = index % deviceColumns;
    const itemsInRow = Math.min(deviceColumns, groups.device.length - row * deviceColumns);
    const usable = rowEnd - rowStart - endpointWidth;
    const step = itemsInRow > 1 ? usable / (itemsInRow - 1) : 0;
    return [{
      ...item,
      x: itemsInRow === 1 ? Math.max(rowStart, gatewayCenter - endpointWidth / 2) : rowStart + step * column,
      y: 700 + row * 146,
      width: endpointWidth,
      height: endpointHeight,
    }];
  });
  const layoutNodes = [
    ...spread(groups.wan, 75, rowStart + 230),
    ...spread(groups.gateway, 240, gatewayCenter),
    ...spread(groups.switch, 390, gatewayCenter),
    ...spread(groups.ap, 570, gatewayCenter),
    ...deviceLayout,
  ];
  const byId = Object.fromEntries(layoutNodes.map(node => [node.id, node]));
  const links = dedupeTopologyLinks(Array.isArray(plan?.links) ? plan.links : [], byId)
    .map(link => ({
      from: byId[String(link.from || "")],
      to: byId[String(link.to || "")],
      label: topologyPhoneKind(byId[String(link.to || "")] || {}) ? "" : [link.label, link.detail].filter(Boolean).join(" - "),
      tone: link.tone || "",
    }))
    .filter(link => link.from && link.to);

  const fallbackLinks = [];
  const gateway = layoutNodes.find(node => node.kind === "gateway");
  const switches = layoutNodes.filter(node => node.kind === "switch");
  const aps = layoutNodes.filter(node => node.kind === "ap");
  if (!links.length && gateway) {
    layoutNodes.filter(node => node.kind === "wan").forEach(wan => fallbackLinks.push({ from: wan, to: gateway, label: "", tone: "primary" }));
    switches.forEach(sw => fallbackLinks.push({ from: gateway, to: sw, label: "", tone: "primary" }));
    aps.forEach(ap => fallbackLinks.push({ from: switches[0] || gateway, to: ap, label: "", tone: "wireless" }));
  }

  const topologyLinks = links.length ? links : fallbackLinks;
  const summary = plan?.summary && typeof plan.summary === "object" ? plan.summary : null;
  const summaryLines = (Array.isArray(summary?.lines) ? summary.lines : [
    Array.isArray(details.clients) ? `${details.clients.length} connected clients` : "",
    Array.isArray(details.security) ? `${details.security.length} security records` : "",
    Array.isArray(details.wifi) ? `${details.wifi.length} Wi-Fi broadcasts` : "",
  ]).filter(Boolean);
  const summaryNode = {
    title: summary?.title || "Logical networks",
    subtitle: summaryLines.slice(0, 2).join(" | "),
    detail: summaryLines.slice(2).join(" | ") || "Logical inventory",
    x: logicalX,
    y: 260,
    width: logicalWidth,
    height: Math.max(112, Math.min(170, 60 + summaryLines.length * 15)),
    kind: "device",
    raw: { tone: "vlan" },
  };

  return `
    <section class="report-map-panel">
      <svg class="report-network-map" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${escapeHtml(client?.name || "Client")} network topology">
        <text x="70" y="42" class="report-map-label">WAN EDGE</text>
        <text x="70" y="205" class="report-map-label">CORE</text>
        <text x="70" y="355" class="report-map-label">SWITCHING</text>
        <text x="70" y="530" class="report-map-label">ACCESS</text>
        ${groups.device.length ? `<text x="70" y="670" class="report-map-label">${groups.device.every(node => isHardwiredTopologyPhone({ ...node, association: node.detail })) ? "DESK PHONES" : "ENDPOINTS"}</text>` : ""}
        <text x="${logicalX}" y="225" class="report-map-label">LOGICAL NETWORKS</text>
        ${topologyLinks.map(link => reportTopologyLinkSvg(link.from, link.to, link.label, link.tone)).join("")}
        ${layoutNodes.map(reportTopologyNodeSvg).join("")}
        ${reportTopologyNodeSvg(summaryNode)}
      </svg>
    </section>
  `;
}

function networkReportWifiPlan(details = {}) {
  const aps = normalizedWifiPlan(details);
  if (!aps.length) {
    return networkReportRowsTable(["Access Point", "Switch Port", "Clients", "2.4 GHz", "5 GHz", "6 GHz"], details.wifi || []);
  }

  return `
    <div class="wifi-grid report-wifi-grid">
      ${aps.map(ap => `
        <article class="ap-panel">
          <div class="ap-head">
            <div>
              <div class="ap-title">${escapeHtml(ap.name)}</div>
              <div class="panel-sub">${escapeHtml(ap.clients)} clients - switch port ${escapeHtml(ap.port)}</div>
            </div>
            <div class="ap-uplink">${escapeHtml(ap.uplink || "Uplink not exposed")}</div>
          </div>
          <div class="radio-table">
            ${(ap.radios || []).map(radio => {
              const utilization = Number(radio[4] || 0);
              const power = wifiRadioPowerDisplay(details, ap, radio);
              return `
                <div class="radio-row">
                  <div class="band-label">${escapeHtml(radio[0])} GHz</div>
                  <div class="radio-value"><strong>Ch ${escapeHtml(radio[1])}</strong><span>Channel</span></div>
                  <div class="radio-value"><strong>${escapeHtml(radio[2])}</strong><span>Width</span></div>
                  <div class="radio-value">
                    <strong>${escapeHtml(power.value || power.apiPower || "Not exposed")}</strong>
                    <span>Transmit power</span>
                    <div class="util-meter ${utilization > 60 ? "high" : ""}"><span style="width:${Math.max(0, Math.min(100, utilization))}%"></span></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function networkReportRunbook(details = {}) {
  const runbook = Array.isArray(details.runbookDetails) ? details.runbookDetails : [];
  if (!runbook.length) {
    const rows = Array.isArray(details.runbook) ? details.runbook : [];
    return rows.length
      ? `<div class="report-card-grid">${rows.map(row => `<article class="report-card"><strong>${escapeHtml(row[0])}</strong><p>${escapeHtml(row[1])}</p></article>`).join("")}</div>`
      : `<div class="item"><strong>No runbook records documented yet.</strong></div>`;
  }

  return `
    <div class="report-runbook-grid">
      ${runbook.map(topic => `
        <article class="report-runbook-topic">
          <h3>${escapeHtml(topic.title)}</h3>
          <ol class="steps">
            ${(topic.steps || []).map(step => `
              <li>
                <strong>${escapeHtml(step[0])}</strong>
                <span>${networkAtlasInlineText(step[1])}</span>
              </li>
            `).join("")}
          </ol>
        </article>
      `).join("")}
    </div>
  `;
}

function networkReportSnapshotNotes(details = {}) {
  const notes = Array.isArray(details.snapshotNotes) ? details.snapshotNotes.slice() : [];
  notes.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  if (!notes.length) return `<div class="item"><strong>No notes were recorded for this snapshot.</strong></div>`;
  return `
    <div class="snapshot-note-list report-note-list">
      ${notes.map(note => `
        <article class="snapshot-note-card">
          <div>
            <strong>${escapeHtml(note.author || portalNoteAuthorName || "GSV")}</strong>
            <span>${escapeHtml(note.createdAt ? new Date(note.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "No timestamp")}</span>
          </div>
          <p>${lines(note.text || "")}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function networkReportDrBackup(details = {}) {
  const backup = details.drBackup && typeof details.drBackup === "object" ? details.drBackup : null;
  if (!backup) return `<div class="item"><strong>No DR backup was attached to this snapshot.</strong><span>Pull a new snapshot to capture the full raw API backup payload.</span></div>`;
  const endpoints = Array.isArray(backup.endpoints) ? backup.endpoints : [];
  const restoreNotes = Array.isArray(backup.restoreNotes) ? backup.restoreNotes : [];
  const nativeUnf = backup.nativeUnf && typeof backup.nativeUnf === "object" ? backup.nativeUnf : null;
  const successful = endpoints.filter(endpoint => /ok|success|captured|complete/i.test(String(endpoint.status || "")) && !endpoint.error).length;
  const failed = endpoints.filter(endpoint => endpoint.error || /fail|error|unauthorized/i.test(String(endpoint.status || ""))).length;
  const retained = endpoints.reduce((sum, endpoint) => sum + (Number(endpoint.count) || 0), 0);
  return `
    <div class="report-card-grid">
      <article class="report-card"><strong>Backup type</strong><p>${escapeHtml(backup.kind || "Network DR backup")}</p></article>
      <article class="report-card"><strong>Generated</strong><p>${escapeHtml(backup.generatedAt ? new Date(backup.generatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "No timestamp")}</p></article>
      <article class="report-card"><strong>API evidence</strong><p>${escapeHtml(`${successful}/${endpoints.length} endpoints captured`)}</p><small>${escapeHtml(`${retained} retained records${failed ? `, ${failed} failed endpoints` : ""}`)}</small></article>
      <article class="report-card"><strong>Native .unf</strong><p>${nativeUnf ? `${escapeHtml(nativeUnf.status || "unknown")}${nativeUnf.filename ? ` - ${escapeHtml(nativeUnf.filename)}` : ""}` : "Not captured"}</p></article>
    </div>
    ${nativeUnf?.error ? `<div class="report-card"><strong>Native .unf backup issue</strong><p>${escapeHtml(nativeUnf.error)}</p></div>` : ""}
    ${restoreNotes.length ? `<div class="report-card report-restore-notes"><strong>Restore notes</strong>${restoreNotes.slice(0, 4).map(note => `<p>${escapeHtml(note)}</p>`).join("")}</div>` : ""}
    <div class="report-card"><strong>Full backup detail</strong><p>The full endpoint payload is retained in the generated DR backup file. It is intentionally not printed in this visual report because the raw endpoint list is long and difficult to review on paper.</p></div>
  `;
}

function networkReportActionPlan(details = {}) {
  const categories = networkActionPlanCategories(details);
  const labels = {
    general: "General",
    wifi: "Wi-Fi",
    sonos: "Sonos",
    security: "Security",
    performance: "Performance",
  };
  return `
    <div class="report-action-grid">
      ${Object.entries(labels).map(([key, label]) => {
        const items = categories[key] || [];
        if (!items.length) return "";
        return `
          <section class="report-action-category">
            <h3>${escapeHtml(label)} <span>${items.length}</span></h3>
            <div class="security-recommendation-grid action-plan-grid">
              ${items.map(actionPlanItemMarkup).join("")}
            </div>
          </section>
        `;
      }).join("") || `<div class="item"><strong>No recommendations generated for this snapshot.</strong></div>`}
    </div>
  `;
}

function networkReportSnapshotSummary(details = {}) {
  const portSummary = reportPortSummary(details);
  const drBackup = details.drBackup && typeof details.drBackup === "object" ? details.drBackup : null;
  const intrusion = intrusionProtectionDetails(details) || details.intrusionProtection || null;
  const intrusionNeedsReview = intrusionProtectionNeedsAction(intrusion);
  const dataQuality = [
    details.snapshotChangeSummary || details.summary || "No change summary recorded for this snapshot.",
    portSummary.unlabeledActive ? `${portSummary.unlabeledActive} active ports need labeling or verification.` : "",
    portSummary.slow ? `${portSummary.slow} active links are negotiating at 100 MbE and should be checked against device capability.` : "",
    intrusion && !intrusionNeedsReview ? `Intrusion protection evidence retained: ${reportCellText(intrusion.status || intrusion.mode || intrusion.enabled || "captured")}.` : "Intrusion protection evidence was not exposed or needs verification in this snapshot.",
    drBackup ? "DR backup payload is attached to this snapshot." : "No DR backup payload is attached to this snapshot.",
  ].filter(Boolean);
  return `
    <div class="report-card-grid">
      <article class="report-card"><strong>Controller</strong><p>${escapeHtml(details.controller || "Not specified")}</p></article>
      <article class="report-card"><strong>Snapshot status</strong><p>${escapeHtml(details.snapshotStatus || "snapshot")}</p></article>
      <article class="report-card"><strong>Port evidence</strong><p>${escapeHtml(`${portSummary.included}/${portSummary.total} rows shown`)}</p><small>${escapeHtml(`${portSummary.active} active links retained`)}</small></article>
    </div>
    <div class="report-card report-summary-notes">
      <strong>Review notes</strong>
      ${dataQuality.map(note => `<p>${escapeHtml(note)}</p>`).join("")}
    </div>
  `;
}

function networkReportAudit(details = {}) {
  const summary = details.auditSummary && typeof details.auditSummary === "object" ? details.auditSummary : null;
  const findings = Array.isArray(details.auditFindings) ? details.auditFindings.slice() : [];
  const coverageGaps = Array.isArray(details.auditCoverageGaps) ? details.auditCoverageGaps : [];
  if (!summary && !findings.length) {
    return `<div class="report-card"><strong>No evidence-based audit retained</strong><p>Pull a new enriched snapshot to generate the risk assessment and ranked findings.</p></div>`;
  }
  const rank = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
  findings.sort((a, b) => (rank[String(b.severity || "info").toLowerCase()] || 0) - (rank[String(a.severity || "info").toLowerCase()] || 0));
  return `
    <section class="report-audit-summary">
      <div>
        <span class="eyebrow">Evidence-based network audit</span>
        <h2>${escapeHtml(summary?.posture ? String(summary.posture).replace(/-/g, " ") : "Audit findings")}</h2>
      </div>
      <div class="report-risk-score"><strong>${escapeHtml(summary?.riskScore ?? "–")}</strong><span>Risk / 100</span></div>
    </section>
    ${summary?.executiveSummary ? `<p class="report-audit-executive">${escapeHtml(summary.executiveSummary)}</p>` : ""}
    <div class="report-audit-meta">
      <span>Confidence: <strong>${escapeHtml(summary?.confidence || "not stated")}</strong></span>
      <span>${findings.length} finding${findings.length === 1 ? "" : "s"}</span>
      <span>${coverageGaps.length} evidence gap${coverageGaps.length === 1 ? "" : "s"}</span>
    </div>
    ${Array.isArray(summary?.strengths) && summary.strengths.length ? `<div class="report-audit-strengths"><strong>Observed strengths</strong><ul>${summary.strengths.map(strength => `<li>${escapeHtml(strength)}</li>`).join("")}</ul></div>` : ""}
    <div class="report-audit-findings">
      ${findings.map(finding => `
        <article class="report-audit-finding ${escapeHtml(String(finding.severity || "info").toLowerCase())}">
          <div><span>${escapeHtml(finding.category || "audit")}</span><span>${escapeHtml(finding.confidence || "unknown")} confidence</span></div>
          <h3>${escapeHtml(finding.title || "Audit finding")}</h3>
          <ul>${(Array.isArray(finding.evidence) ? finding.evidence : [finding.evidence]).filter(Boolean).slice(0, 3).map(evidence => `<li>${escapeHtml(evidence)}</li>`).join("")}</ul>
          ${finding.impact ? `<p><strong>Impact:</strong> ${escapeHtml(finding.impact)}</p>` : ""}
          <b>${escapeHtml(String(finding.severity || "info").toUpperCase())}</b>
        </article>`).join("")}
    </div>
    ${coverageGaps.length ? `<section class="report-audit-gaps"><h3>Audit evidence gaps</h3><ul>${coverageGaps.map(gap => `<li>${escapeHtml(gap)}</li>`).join("")}</ul></section>` : ""}
  `;
}

function networkReportStyles() {
  return `
    :root {
      --ink: #1f2933;
      --muted: #66758b;
      --line: #d7e0ea;
      --bg: #f4f7fb;
      --panel: #ffffff;
      --nav: #202528;
      --yellow: #ffc42d;
      --blue: #1f73bc;
      --green: #16845b;
      --orange: #b66a0b;
      --red: #b42318;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); font-size: 14px; line-height: 1.35; }
    .report-shell { width: 8.5in; max-width: 100%; margin: 0 auto; padding: 24px; }
    .report-cover, .report-page {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
      margin: 0 0 22px;
      page-break-after: always;
      break-after: page;
    }
    .report-cover { min-height: 9.2in; display: flex; flex-direction: column; gap: 24px; justify-content: space-between; }
    .report-cover-brand { display: flex; align-items: center; gap: 18px; }
    .report-cover-logo { width: 150px; height: auto; display: block; }
    .report-cover-title { display: grid; gap: 10px; }
    .report-cover-title p { font-size: 18px; max-width: 560px; }
    .report-generated-line { color: var(--muted); font-size: 16px; font-weight: 750; }
    .report-kicker, .report-page-head span, .eyebrow {
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: .12em;
      font-size: 12px;
      font-weight: 800;
    }
    h1, h2, h3, p { margin-top: 0; }
    h1 { font-size: 40px; line-height: 1.05; margin-bottom: 10px; }
    h2 { font-size: 26px; margin-bottom: 6px; }
    h3 { font-size: 18px; margin-bottom: 10px; }
    p, .subtle, .panel-sub, small { color: var(--muted); }
    .report-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    .report-meta div { padding: 14px 16px; border-right: 1px solid var(--line); }
    .report-meta div:last-child { border-right: 0; }
    .report-meta span, .metric span { display: block; color: var(--muted); font-weight: 700; margin-bottom: 8px; }
    .report-meta strong { display: block; font-size: 20px; }
    .metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 16px 0 24px; }
    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      min-height: 120px;
      background: #fff;
    }
    .metric strong { display: block; font-size: 28px; line-height: 1.15; margin-bottom: 8px; }
    .metric small { display: block; font-size: 13px; }
    .metric.warn { border-left: 4px solid var(--orange); background: #fffaf0; }
    .metric em { display: inline-block; margin-top: 10px; color: var(--orange); font-style: normal; font-weight: 800; font-size: 12px; }
    .report-page-head { display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--line); padding-bottom: 14px; margin-bottom: 18px; }
    .network-map-panel, .atlas-data-section, .table-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      padding: 16px;
    }
    .report-map-panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background-color: #fbfdff;
      background-image: linear-gradient(#e9eef5 1px, transparent 1px), linear-gradient(90deg, #e9eef5 1px, transparent 1px);
      background-size: 28px 28px;
      padding: 0;
      overflow: hidden;
      break-inside: avoid;
    }
    .report-network-map { display: block; width: 100%; height: auto; min-height: 0; }
    .report-map-label {
      fill: #66758b;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: .12em;
    }
    .report-map-link {
      fill: none;
      stroke: var(--blue);
      stroke-width: 3;
      stroke-linecap: round;
    }
    .report-map-link.wireless {
      stroke: var(--orange);
      stroke-dasharray: 6 8;
    }
    .report-map-link.standby {
      stroke: var(--orange);
      stroke-dasharray: 8 8;
    }
    .report-map-link.endpoint {
      stroke-width: 2;
      opacity: .48;
    }
    .report-map-link-badge {
      fill: rgba(255, 255, 255, .96);
      stroke: var(--line);
      stroke-width: 1;
    }
    .report-map-link-label {
      fill: #66758b;
      font-size: 12px;
      font-weight: 900;
    }
    .report-map-node rect {
      fill: #eaf3fd;
      stroke: var(--blue);
      stroke-width: 2;
    }
    .report-map-node.wan rect { fill: #eaf8ef; stroke: var(--green); }
    .report-map-node.warning rect { fill: #fff6df; stroke: var(--orange); }
    .report-map-node.wifi rect { fill: #fff8dc; stroke: var(--yellow); }
    .report-map-node.vlan rect { fill: #eaf8f5; stroke: #168c87; }
    .report-map-node-title {
      fill: var(--ink);
      font-size: 15px;
      font-weight: 900;
    }
    .report-map-node-subtitle,
    .report-map-node-detail {
      fill: #66758b;
      font-size: 11px;
      font-weight: 850;
    }
    .network-map-stage {
      background-color: #fbfdff;
      background-image: linear-gradient(#e9eef5 1px, transparent 1px), linear-gradient(90deg, #e9eef5 1px, transparent 1px);
      background-size: 28px 28px;
      min-height: 620px;
      overflow: hidden;
    }
    .portal-network-map { width: 100%; height: auto; display: block; min-height: 620px; }
    .map-label { fill: #66758b; font-size: 16px; font-weight: 800; letter-spacing: .12em; }
    .map-link { fill: none; stroke: #b86b0b; stroke-width: 3; stroke-dasharray: 5 8; stroke-linecap: round; }
    .map-link.primary { stroke: var(--blue); stroke-dasharray: none; }
    .map-link.standby { stroke: var(--orange); }
    .map-link.wireless { stroke: var(--orange); }
    .map-link.blocked { stroke: var(--red); }
    .map-link.endpoint { stroke-width: 2; opacity: .48; }
    .map-link-label-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      background: rgba(255,255,255,.95);
      color: #66758b;
      font-size: 12px;
      font-weight: 800;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .map-node rect, .map-summary rect { fill: #eaf3fd; stroke: var(--blue); stroke-width: 2; }
    .map-node.wan rect { fill: #eaf8ef; stroke: var(--green); }
    .map-node.warning rect { fill: #fff6df; stroke: var(--orange); }
    .map-node.wifi rect { fill: #fff8dc; stroke: var(--yellow); }
    .map-node.vlan rect, .map-summary rect { fill: #eaf8f5; stroke: #168c87; }
    .map-node-body, .map-summary-body {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow-wrap: anywhere;
    }
    .map-node-body strong, .map-summary-body strong { font-size: 16px; font-weight: 900; color: var(--ink); }
    .map-node-body span, .map-node-body small, .map-summary-body span { color: var(--muted); font-size: 12px; font-weight: 800; }
    .network-node-grid, .report-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
    .network-node-card, .report-card, .report-runbook-topic, .security-recommendation {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      background: #fff;
      break-inside: avoid;
    }
    .network-node-card span { color: var(--muted); display: block; font-weight: 700; }
    .network-node-card strong { display: block; font-size: 16px; margin: 3px 0; }
    dl { margin: 12px 0 0; }
    .network-node-card dl div { display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid var(--line); padding: 7px 0; }
    dt { color: var(--muted); }
    dd { margin: 0; font-weight: 800; text-align: right; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border-bottom: 1px solid var(--line); padding: 9px 10px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
    th { background: #e8eef6; color: var(--ink); font-size: 12px; }
    .wifi-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .ap-panel { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; break-inside: avoid; background: #fff; }
    .ap-head { display: flex; justify-content: space-between; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
    .ap-title { font-weight: 900; font-size: 18px; }
    .ap-uplink { color: var(--green); font-weight: 900; }
    .radio-row { display: grid; grid-template-columns: 90px 1fr 1fr 1.35fr; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #edf1f5; align-items: start; }
    .radio-row:last-child { border-bottom: 0; }
    .band-label, .radio-value strong { font-weight: 900; }
    .radio-value span { display: block; color: var(--muted); }
    .util-meter { height: 6px; background: #e8edf2; border-radius: 999px; margin-top: 8px; overflow: hidden; }
    .util-meter span { display: block; height: 100%; background: #63b391; }
    .util-meter.high span { background: #d98a2b; }
    .security-flow { display: grid; grid-template-columns: 1fr 120px 1fr; align-items: center; gap: 18px; margin-bottom: 16px; }
    .zone-block { border: 1px solid var(--line); border-left: 4px solid var(--green); border-radius: 8px; padding: 24px; min-height: 110px; }
    .zone-block.iot { border-left-color: #7653b8; }
    .zone-name { font-weight: 900; font-size: 20px; }
    .zone-sub { color: var(--muted); margin-top: 8px; }
    .flow-arrows { display: grid; gap: 12px; justify-items: center; }
    .flow-arrow { text-align: center; font-weight: 900; color: var(--green); }
    .flow-arrow svg { width: 26px; height: 26px; fill: none; stroke: currentColor; stroke-width: 2; }
    .flow-arrow.blocked { color: var(--red); }
    .rule-list { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    .rule-row { display: grid; grid-template-columns: 110px 1.5fr 1fr 1fr 120px; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
    .rule-row:last-child { border-bottom: 0; }
    .rule-row span { display: block; color: var(--muted); }
    .rule-id, .rule-action { font-weight: 900; }
    .rule-action.allow, .rule-action.enabled { color: var(--green); }
    .rule-action.drop, .rule-action.deny, .rule-action.block { color: var(--red); }
    .report-runbook-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .steps { margin: 0; padding-left: 34px; }
    .steps li { margin-bottom: 12px; }
    .steps strong, .steps span { display: block; }
    code { background: #eef2f5; border-radius: 4px; padding: 1px 4px; }
    .snapshot-note-list { display: grid; gap: 12px; }
    .snapshot-note-card {
      display: grid;
      gap: 10px;
      padding: 16px;
      border: 1px solid var(--line);
      border-left: 4px solid var(--yellow);
      border-radius: 8px;
      background: #fff;
      break-inside: avoid;
    }
    .snapshot-note-card > div { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; }
    .snapshot-note-card strong, .snapshot-note-card span { display: block; }
    .snapshot-note-card span { color: var(--muted); font-size: 12px; font-weight: 750; }
    .snapshot-note-card p { margin: 0; color: var(--ink); }
    .report-action-category { margin-bottom: 18px; break-inside: avoid; }
    .report-action-category h3 span { color: var(--muted); font-size: 14px; }
    .security-recommendation-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .security-recommendation { border-left: 4px solid var(--blue); }
    .security-recommendation.high, .security-recommendation.critical { border-left-color: var(--red); }
    .security-recommendation.medium { border-left-color: var(--orange); }
    .security-recommendation.low { border-left-color: var(--blue); }
    .security-recommendation > span { display: block; color: var(--muted); text-transform: uppercase; font-weight: 900; font-size: 11px; letter-spacing: .12em; }
    .security-recommendation strong { display: block; margin: 6px 0; }
    .security-recommendation p { margin-bottom: 8px; }
    .report-audit-summary { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding-top: 14px; border-top: 4px solid var(--yellow); }
    .report-audit-summary h2 { margin: 5px 0 0; text-transform: capitalize; }
    .report-risk-score { display: grid; justify-items: end; }
    .report-risk-score strong { font-size: 38px; line-height: 1; }
    .report-risk-score span, .report-audit-meta { color: var(--muted); }
    .report-audit-executive { font-size: 16px; line-height: 1.5; }
    .report-audit-meta { display: flex; gap: 18px; padding: 12px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .report-audit-strengths, .report-audit-gaps { margin-top: 16px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 8px; background: #fbfcfd; }
    .report-audit-strengths ul, .report-audit-gaps ul { margin-bottom: 0; }
    .report-audit-findings { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
    .report-audit-finding { padding: 14px 16px; border: 1px solid var(--line); border-left: 5px solid var(--blue); border-radius: 8px; background: #fff; break-inside: avoid; }
    .report-audit-finding.critical, .report-audit-finding.high { border-left-color: var(--red); }
    .report-audit-finding.medium { border-left-color: var(--orange); }
    .report-audit-finding > div { display: flex; justify-content: space-between; gap: 10px; color: var(--muted); font-size: 11px; text-transform: capitalize; }
    .report-audit-finding h3 { margin: 9px 0; }
    .report-audit-finding ul { margin: 0; padding-left: 19px; color: var(--muted); }
    .report-audit-finding li { margin-top: 5px; }
    .report-audit-finding p { margin-bottom: 8px; }
    .report-audit-finding > b { font-size: 11px; }
    @page { size: letter portrait; margin: .35in; }
    @media print {
      body { background: #fff; }
      .report-shell { width: auto; max-width: none; padding: 0; }
      .report-cover, .report-page {
        border: 0;
        border-radius: 0;
        margin: 0;
        padding: 0;
        break-inside: auto;
        page-break-inside: auto;
      }
      .report-cover {
        min-height: auto;
        justify-content: flex-start;
      }
      .report-cover-logo { width: 120px; }
      .report-cover-title p { font-size: 13px; }
      .report-page:last-child { page-break-after: auto; break-after: auto; }
      .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
      .network-node-grid, .report-card-grid, .wifi-grid, .report-runbook-grid, .security-recommendation-grid {
        grid-template-columns: 1fr;
      }
      .network-map-stage {
        min-height: 0;
        aspect-ratio: 1320 / 760;
      }
      .portal-network-map {
        min-height: 0;
        height: auto;
      }
    }
  `;
}

let cachedNetworkReportLogoDataUrl = "";

async function networkReportLogoDataUrl() {
  if (cachedNetworkReportLogoDataUrl) return cachedNetworkReportLogoDataUrl;
  try {
    const response = await fetch("/portal-app/assets/gsv-logo.png", { cache: "force-cache" });
    if (!response.ok) throw new Error(`Logo request failed: ${response.status}`);
    const blob = await response.blob();
    cachedNetworkReportLogoDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Network report logo could not be embedded", error);
    cachedNetworkReportLogoDataUrl = "/portal-app/assets/gsv-logo.png";
  }
  return cachedNetworkReportLogoDataUrl;
}

function networkVisualReportHtml(client, details = {}, options = {}) {
  const captured = details.snapshotCapturedAt ? networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }) : "Not captured";
  const title = `${client?.name || "Client"} Network Report`;
  const metrics = reportMetricCards(details);
  const topologyMarkup = networkReportTopology(client, details);
  const securityMarkup = networkAtlasSecurityPlan(details);
  const generatedAt = new Date().toLocaleString();
  const portRows = reportMeaningfulPortRows(details);
  const clientRows = Array.isArray(details.clients) ? details.clients : [];
  const logoSrc = options.logoDataUrl || "/portal-app/assets/gsv-logo.png";
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(title)}</title>
        <style>${networkReportStyles()}</style>
      </head>
      <body>
        <main class="report-shell">
          <section class="report-cover">
            <div class="report-cover-brand">
              <img class="report-cover-logo" src="${escapeHtml(logoSrc)}" alt="Golden State Visions">
              <div>
                <div class="report-kicker">Golden State Visions</div>
                <strong>Managed IT Services and Cybersecurity</strong>
              </div>
            </div>
            <div class="report-cover-title">
              <h1>${escapeHtml(title)}</h1>
              <p class="report-generated-line">Generated by Golden State Visions for ${escapeHtml(client?.name || "Client")} on ${escapeHtml(generatedAt)}.</p>
              <p>${escapeHtml(details.subtitle || "Client network documentation")}</p>
            </div>
            <div class="report-meta">
              <div><span>Snapshot</span><strong>${escapeHtml(details.snapshotLabel || "Network snapshot")}</strong></div>
              <div><span>Captured</span><strong>${escapeHtml(captured)}</strong></div>
              <div><span>Generated</span><strong>${escapeHtml(generatedAt)}</strong></div>
            </div>
            <div class="metric-grid">${metrics.map(metricCardMarkup).join("")}</div>
          </section>
          ${networkReportPage("Snapshot Summary", "Capture scope, data-quality notes, and retained evidence summary.", networkReportSnapshotSummary(details))}
          ${networkReportPage("Network Audit", "Risk posture, ranked findings, supporting evidence, and audit coverage gaps.", networkReportAudit(details), "report-audit-page")}
          ${networkReportPage("DR Backup", "Disaster-recovery backup status captured with this snapshot.", networkReportDrBackup(details))}
          ${networkReportPage("Topology", "Rendered topology map from the selected snapshot.", topologyMarkup, "report-topology-page")}
          ${networkReportPage("Port Map", "Active, labeled, or otherwise meaningful port records from the selected snapshot.", networkReportRowsTable(["Device / Port", "State", "Speed", "Device / Purpose", "Address", "Power"], portRows))}
          ${networkReportPage("Clients", "Retained connected client inventory from the selected snapshot.", networkReportRowsTable(["Client", "Address", "Association", "Status"], clientRows))}
          ${networkReportPage("Wi-Fi", "Radio channel, width, client count, uplink, and transmit-power evidence.", networkReportWifiPlan(details))}
          ${networkReportPage("Security", "Network zones, policy evidence, and segmentation notes.", securityMarkup)}
          ${networkReportPage("Notes", "Snapshot-specific notes recorded in the portal.", networkReportSnapshotNotes(details))}
          ${networkReportPage("Runbook", "Operational checks retained for this network.", networkReportRunbook(details))}
          ${networkReportPage("Action Plan", "AI and portal-derived recommendations grouped by work area.", networkReportActionPlan(details), "report-action-page")}
        </main>
      </body>
    </html>`;
}

async function networkVisualReportPdfBlob(client, details = {}, options = {}) {
  const html = networkVisualReportHtml(client, details, options);
  const response = await fetch("/api/network-report-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      title: `${client?.name || "Client"} Network Report`,
    }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `PDF render failed with status ${response.status}.`);
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error("PDF render returned an empty file.");
  return blob;
}

function networkTopologyArtifactHtml(client, details = {}) {
  const generatedAt = new Date().toLocaleString();
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(client?.name || "Client")} Network Topology</title>
        <style>
          ${networkReportStyles()}
          body.topology-viewer { overflow: auto; }
          body.topology-viewer .report-shell {
            width: min(1800px, calc(100vw - 24px));
            max-width: none;
            min-width: min(100%, 1040px);
            padding: 12px;
          }
          body.topology-viewer .report-page {
            min-height: calc(100vh - 24px);
            margin: 0;
            padding: 18px;
          }
          body.topology-viewer .report-page-head {
            margin-bottom: 12px;
            padding-bottom: 12px;
          }
          body.topology-viewer .report-map-panel {
            min-height: clamp(680px, calc(100vh - 160px), 1180px);
            display: flex;
            align-items: stretch;
          }
          body.topology-viewer .report-network-map {
            width: 100%;
            height: auto;
            min-height: clamp(680px, calc(100vh - 160px), 1180px);
          }
          @media (min-width: 1500px) {
            body.topology-viewer .report-shell { width: calc(100vw - 32px); }
          }
        </style>
      </head>
      <body class="topology-viewer">
        <main class="report-shell">
          ${networkReportPage(
            "Network Topology",
            `Generated by Golden State Visions for ${client?.name || "Client"} on ${generatedAt}.`,
            networkReportTopology(client, details),
            "report-topology-page"
          )}
        </main>
      </body>
    </html>`;
}

function networkConfigCapturePayload(client, snapshot, details = {}) {
  return {
    generatedAt: new Date().toISOString(),
    generatedBy: "Golden State Visions",
    artifact: "network-config-capture",
    client: {
      id: client?.id || "",
      name: client?.name || "",
    },
    snapshot: structuredClone(snapshot || {}),
    details: structuredClone(details || {}),
  };
}

function networkRunbookArtifactMarkdown(client, details = {}) {
  const lines = [
    `# ${client?.name || "Client"} Network Runbook`,
    "",
    `Snapshot: ${details.snapshotLabel || "Network snapshot"}`,
    `Captured: ${details.snapshotCapturedAt ? networkSnapshotCapturedLabel({ capturedAt: details.snapshotCapturedAt }) : "No timestamp"}`,
    "",
  ];
  const runbookDetails = Array.isArray(details.runbookDetails) ? details.runbookDetails : [];
  if (runbookDetails.length) {
    runbookDetails.forEach(topic => {
      lines.push(`## ${topic.title || topic.key || "Runbook Topic"}`, "");
      const steps = Array.isArray(topic.steps) ? topic.steps : [];
      if (!steps.length) {
        lines.push("- No steps retained.", "");
        return;
      }
      steps.forEach((step, index) => {
        lines.push(`${index + 1}. ${markdownText(step?.[0] || "Step")}`);
        if (step?.[1]) lines.push(`   - ${markdownText(step[1])}`);
      });
      lines.push("");
    });
    return lines.join("\n");
  }
  const rows = Array.isArray(details.runbook) ? details.runbook : [];
  if (rows.length) {
    lines.push(markdownTable(["Topic", "Detail"], rows), "");
  } else {
    lines.push("_No runbook records were retained for this snapshot._", "");
  }
  return lines.join("\n");
}

function exportNetworkSnapshotJson(clientId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return;
  const snapshot = selectedNetworkSnapshotForClient(client);
  if (!snapshot) return;
  exportTextFile(
    `${safeDownloadName(client.name)}-network-snapshot-${safeDownloadName(snapshot.label || snapshot.id || today)}.json`,
    JSON.stringify(snapshot, null, 2),
    "application/json;charset=utf-8"
  );
}

function downloadNetworkDrBackup(clientId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return;
  const snapshot = selectedNetworkSnapshotForClient(client);
  const backup = snapshot?.drBackup;
  if (!backup) {
    window.alert("This snapshot does not have a DR backup attached. Pull a new snapshot to capture the full raw API backup payload.");
    return;
  }
  exportTextFile(
    `${safeDownloadName(client.name)}-unifi-dr-backup-${safeDownloadName(snapshot.label || snapshot.id || today)}.json`,
    JSON.stringify(backup, null, 2),
    "application/json;charset=utf-8"
  );
}

function ensureSnapshotDrBackup(snapshot) {
  if (!snapshot.drBackup || typeof snapshot.drBackup !== "object") {
    snapshot.drBackup = {
      version: 1,
      kind: "unifi-network-dr-backup",
      generatedAt: new Date().toISOString(),
      restoreNotes: [],
      endpoints: [],
      payloads: {},
    };
  }
  return snapshot.drBackup;
}

async function autoSaveNetworkDrBackupFile(clientId, snapshot) {
  const client = clientById(clientId || selectedClientId || selectedNetworkAtlasClientId);
  if (!client || !snapshot?.id) return null;
  const backup = ensureSnapshotDrBackup(snapshot);
  const locationToken = siteFilenameToken(snapshot.locationName, snapshot.locationId);
  const filename = `${safeDownloadName(client.name)}${locationToken}-unifi-dr-backup-${safeDownloadName(snapshot.label || snapshot.id || today)}.json`;
  const backupBlob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  const document = await addGeneratedClientVaultFile({
    clientId: client.id,
    filename,
    category: "Backups",
    sensitivity: "break_glass",
    mimeType: "application/json;charset=utf-8",
    blob: backupBlob,
    source: "unifi-api-dr-backup",
    snapshotId: snapshot.id,
    locationId: snapshot.locationId || "default",
    locationName: snapshot.locationName || "Primary location",
    backupKind: "unifi-api-dr-backup",
  });
  if (document) {
    document.snapshotId = snapshot.id;
    document.locationId = snapshot.locationId || "default";
    document.locationName = snapshot.locationName || "Primary location";
    document.backupKind = "unifi-api-dr-backup";
  }
  backup.portalFile = {
    status: "captured",
    capturedAt: new Date().toISOString(),
    filename,
    byteSize: backupBlob.size,
    vaultDocumentId: document?.id || "",
    storage: "client-files",
  };
  const details = snapshot.details && typeof snapshot.details === "object" ? snapshot.details : {};
  snapshot.details = {
    ...details,
    drBackupStatus: "Captured",
    drBackupFilename: filename,
    drBackupByteSize: backupBlob.size,
  };
  saveState();
  return document;
}

async function ensureClientSnapshotFiles(clientId) {
  const client = clientById(clientId || selectedClientId);
  if (!client || clientSnapshotBackupFileSyncs.has(client.id)) return;
  if ([...networkSnapshotPulls].some(key => key.startsWith(`${client.id}:`))) return;
  clientSnapshotBackupFileSyncs.add(client.id);
  try {
    await reconcileClientSnapshotFiles(client);
    const snapshots = Array.isArray(client.networkSnapshots) ? client.networkSnapshots : [];
    const documents = clientVaultDocuments(client.id);
    const snapshotsNeedingFiles = snapshots.filter(snapshot => {
      if (!snapshot?.id) return false;
      const locationToken = siteFilenameToken(snapshot.locationName, snapshot.locationId);
      const expectedFilename = `${safeDownloadName(client.name)}${locationToken}-unifi-dr-backup-${safeDownloadName(snapshot.label || snapshot.id || today)}.json`;
      const hasBackup = !snapshot.drBackup || documents.some(document =>
        (document.snapshotId === snapshot.id && document.backupKind === "unifi-api-dr-backup") ||
        document.filename === expectedFilename
      );
      const hasReport = documents.some(document =>
        document.snapshotId === snapshot.id &&
        (document.reportKind === "network-visual-pdf" || (document.source === "network-snapshot-report" && /\.pdf$/i.test(document.filename)))
      );
      const artifactKinds = new Set(documents.filter(document => document.snapshotId === snapshot.id).map(document => document.artifactKind));
      return !hasBackup || !hasReport || !["network-topology-html", "network-config-capture-json", "network-runbook-text"].every(kind => artifactKinds.has(kind));
    });
    for (const snapshot of snapshotsNeedingFiles) {
      try {
        const snapshotDocuments = clientVaultDocuments(client.id).filter(document => document.snapshotId === snapshot.id);
        if (snapshot.drBackup && !snapshotDocuments.some(document => document.backupKind === "unifi-api-dr-backup")) {
          await autoSaveNetworkDrBackupFile(client.id, snapshot);
        }
        await autoSaveNetworkSnapshotReportFiles(client.id, snapshot.id);
        await autoSaveNetworkSnapshotArtifactFiles(client.id, snapshot.id);
      } catch (error) {
        console.warn(`Unable to repair generated files for snapshot ${snapshot.id}`, error);
      }
    }
    if (vaultStorageMode === "private-cloud") await refreshClientVaultDocuments(client.id);
    if (selectedClientId === client.id && selectedClientDashboardTab === "files") renderClientDashboard();
  } finally {
    clientSnapshotBackupFileSyncs.delete(client.id);
  }
}

async function reconcileClientSnapshotFiles(client) {
  const snapshots = Array.isArray(client.networkSnapshots) ? client.networkSnapshots : [];
  const documents = clientVaultDocuments(client.id);
  const retainedIds = new Set(snapshots.map(snapshot => snapshot?.id).filter(Boolean));
  const generated = documents.filter(document => document.snapshotId && (document.source || document.backupKind || document.reportKind || document.artifactKind));
  const seen = new Set();
  const remove = [];
  generated.forEach(document => {
    const kind = document.backupKind || document.reportKind || document.artifactKind || document.filename;
    const key = `${document.snapshotId}|${kind}|${document.filename}`;
    if (!retainedIds.has(document.snapshotId) || seen.has(key)) remove.push(document);
    else seen.add(key);
  });
  for (const document of remove) {
    try {
      if (document.storage === "private-cloud") {
        const response = await fetch(`/api/vault/documents/${encodeURIComponent(document.id)}`, { method: "DELETE" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `Vault cleanup returned ${response.status}.`);
        remoteVaultDocuments.set(client.id, (remoteVaultDocuments.get(client.id) || []).filter(row => row.id !== document.id));
      } else {
        await removeVaultFile(document.id);
        document.deletedAt = new Date().toISOString();
        document.deletedReason = retainedIds.has(document.snapshotId) ? "duplicate-generated-file" : "orphaned-snapshot-file";
      }
    } catch (error) {
      console.warn(`Unable to remove stale generated file ${document.filename}`, error);
    }
  }
  if (remove.length && vaultStorageMode !== "private-cloud") saveState();
}

function markNativeUnifiBackupFailure(clientId, snapshot, error) {
  if (!snapshot) return;
  const backup = ensureSnapshotDrBackup(snapshot);
  backup.nativeUnf = {
    status: "failed",
    capturedAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : "Native UniFi .unf backup failed.",
  };
  const details = snapshot.details && typeof snapshot.details === "object" ? snapshot.details : {};
  snapshot.details = {
    ...details,
    nativeUnfStatus: "Failed",
    nativeUnfError: backup.nativeUnf.error,
  };
  saveState();
  refreshNetworkSnapshotViews(clientId);
}

async function autoSaveNativeUnifiBackupFile(clientId, snapshot, networkLocation = null) {
  const client = clientById(clientId || selectedClientId || selectedNetworkAtlasClientId);
  if (!client || !snapshot?.id) return null;
  const response = await fetch("/api/network-atlas-native-backup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: client.id,
      clientName: client.name,
      hostId: networkLocation?.hostId || client.networkSource?.hostId || "",
      siteId: networkLocation?.siteId || client.networkSource?.siteId || "",
      locationId: networkLocation?.id || snapshot.locationId || "default",
      locationName: networkLocation?.name || snapshot.locationName || "Primary location",
    }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Native UniFi .unf backup failed.");
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error("Native UniFi .unf backup returned an empty file.");
  const filename = `${safeDownloadName(client.name)}${siteFilenameToken(networkLocation?.name || snapshot.locationName, networkLocation?.id || snapshot.locationId)}-unifi-native-backup-${safeDownloadName(snapshot.id)}.unf`;
  const document = await addGeneratedClientVaultFile({
    clientId: client.id,
    filename,
    category: "Backups",
    sensitivity: "break_glass",
    mimeType: blob.type || "application/octet-stream",
    blob,
    source: "unifi-native-unf-backup",
    snapshotId: snapshot.id,
    locationId: networkLocation?.id || snapshot.locationId || "default",
    locationName: networkLocation?.name || snapshot.locationName || "Primary location",
    backupKind: "unifi-native-unf-backup",
  });
  if (document) {
    document.snapshotId = snapshot.id;
    document.backupKind = "unifi-native-unf-backup";
  }
  const backup = ensureSnapshotDrBackup(snapshot);
  backup.nativeUnf = {
    status: "captured",
    capturedAt: new Date().toISOString(),
    filename,
    byteSize: blob.size,
    vaultDocumentId: document?.id || "",
    commandPath: response.headers.get("X-Unifi-Backup-Command-Path") || "",
    downloadPath: response.headers.get("X-Unifi-Backup-Download-Path") || "",
    siteReference: response.headers.get("X-Unifi-Site-Reference") || "",
    storage: "client-files",
  };
  const details = snapshot.details && typeof snapshot.details === "object" ? snapshot.details : {};
  snapshot.details = {
    ...details,
    nativeUnfStatus: "Captured",
    nativeUnfFilename: filename,
    nativeUnfByteSize: blob.size,
  };
  saveState();
  return document;
}

async function autoSaveNetworkSnapshotReportFiles(clientId, snapshotId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) throw new Error("Client record is unavailable.");
  const snapshot = selectedNetworkSnapshotForClient(client, snapshotId);
  if (!snapshot) throw new Error("Selected network snapshot is unavailable.");
  const existingReports = snapshotReportDocuments(client.id, snapshot.id);
  const existingPdf = existingReports.find(document => document.reportKind === "network-visual-pdf") ||
    existingReports.find(document => /\.pdf$/i.test(document.filename) && document.source === "network-snapshot-report" && document.reportKind !== "network-pdf-summary");
  const obsoleteReports = existingReports.filter(document =>
    document.reportKind === "network-pdf-summary" ||
    document.reportKind === "network-visual-report" ||
    (document.source === "network-snapshot-report" && /\.html?$/i.test(document.filename))
  );
  for (const document of obsoleteReports) {
    try {
      await removeVaultFile(document.id);
    } catch (error) {
      console.warn("Obsolete report cleanup failed", error);
    }
    document.deletedAt = document.deletedAt || new Date().toISOString();
    document.deletedReason = "obsolete-html-report";
  }
  if (existingPdf) {
    snapshot.reportFiles = {
      generatedAt: snapshot.reportFiles?.generatedAt || existingPdf.createdAt || new Date().toISOString(),
      pdfVaultDocumentId: existingPdf.id,
      visualVaultDocumentId: "",
      pdfFilename: existingPdf.filename,
      visualFilename: "",
      storage: "client-files",
    };
    saveState();
    return [existingPdf];
  }
  const details = networkAtlasDetails(client, snapshot);
  const fileToken = safeDownloadName(snapshot.id || snapshot.label || today);
  const locationToken = siteFilenameToken(snapshot.locationName, snapshot.locationId);
  const baseName = `${safeDownloadName(client.name)}${locationToken}-network-report-${fileToken}`;
  const logoDataUrl = await networkReportLogoDataUrl();
  const pdfBlob = await networkVisualReportPdfBlob(client, details, { logoDataUrl });
  const savedPdf = await addGeneratedClientVaultFile({
    clientId: client.id,
    filename: `${baseName}.pdf`,
    category: "Reports",
    sensitivity: "confidential",
    mimeType: "application/pdf",
    blob: pdfBlob,
    source: "network-snapshot-report",
    snapshotId: snapshot.id,
    locationId: snapshot.locationId || "default",
    locationName: snapshot.locationName || "Primary location",
    reportKind: "network-visual-pdf",
  });
  if (savedPdf) {
    savedPdf.snapshotId = snapshot.id;
    savedPdf.locationId = snapshot.locationId || "default";
    savedPdf.locationName = snapshot.locationName || "Primary location";
    savedPdf.reportKind = "network-visual-pdf";
  }
  snapshot.reportFiles = {
    generatedAt: new Date().toISOString(),
    pdfVaultDocumentId: savedPdf?.id || "",
    visualVaultDocumentId: "",
    pdfFilename: savedPdf?.filename || "",
    visualFilename: "",
    storage: "client-files",
  };
  saveState();
  const savedReports = [savedPdf].filter(Boolean);
  console.info("Network report auto-save completed", {
    clientId: client.id,
    snapshotId: snapshot.id,
    files: savedReports.map(document => ({ id: document.id, filename: document.filename, reportKind: document.reportKind })),
  });
  return savedReports;
}

async function autoSaveNetworkSnapshotArtifactFiles(clientId, snapshotId, options = {}) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) throw new Error("Client record is unavailable.");
  const snapshot = selectedNetworkSnapshotForClient(client, snapshotId);
  if (!snapshot) throw new Error("Selected network snapshot is unavailable.");
  const details = networkAtlasDetails(client, snapshot);
  const fileToken = safeDownloadName(snapshot.id || snapshot.label || today);
  const locationToken = siteFilenameToken(snapshot.locationName, snapshot.locationId);
  const baseName = `${safeDownloadName(client.name)}${locationToken}-network-snapshot-${fileToken}`;
  const previousTopology = snapshotArtifactDocument(client.id, snapshot.id, "network-topology-html");
  const existingTopology = options.replaceTopology ? null : previousTopology;
  const existingConfig = snapshotArtifactDocument(client.id, snapshot.id, "network-config-capture-json");
  const existingRunbook = snapshotArtifactDocument(client.id, snapshot.id, "network-runbook-text");
  const obsoleteRunbooks = clientVaultDocuments(client.id).filter(document =>
    document.snapshotId === snapshot.id &&
    document.artifactKind === "network-runbook-markdown" &&
    !document.deletedAt
  );
  for (const document of obsoleteRunbooks) {
    try {
      await removeVaultFile(document.id);
    } catch (error) {
      console.warn("Obsolete Markdown runbook cleanup failed", error);
    }
    document.deletedAt = document.deletedAt || new Date().toISOString();
    document.deletedReason = "obsolete-markdown-runbook";
  }
  const saved = [];

  const topology = existingTopology || await addGeneratedClientVaultFile({
    clientId: client.id,
    filename: `${baseName}-topology.html`,
    category: "Network Topology",
    sensitivity: "confidential",
    mimeType: "text/html;charset=utf-8",
    blob: new Blob([networkTopologyArtifactHtml(client, details)], { type: "text/html;charset=utf-8" }),
    source: "network-snapshot-artifact",
    snapshotId: snapshot.id,
    locationId: snapshot.locationId || "default",
    locationName: snapshot.locationName || "Primary location",
    artifactKind: "network-topology-html",
  });
  if (topology) {
    topology.snapshotId = snapshot.id;
    topology.artifactKind = "network-topology-html";
    saved.push(topology);
    if (options.replaceTopology && previousTopology?.id && previousTopology.id !== topology.id) {
      try {
        if (previousTopology.storage === "private-cloud") {
          const response = await fetch(`/api/vault/documents/${encodeURIComponent(previousTopology.id)}`, { method: "DELETE" });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.error || `Old topology cleanup returned ${response.status}.`);
        } else {
          await removeVaultFile(previousTopology.id);
          previousTopology.deletedAt = new Date().toISOString();
          previousTopology.deletedReason = "topology-regenerated";
        }
      } catch (error) {
        console.warn("Previous topology cleanup failed", error);
      }
    }
  }

  const config = existingConfig || await addGeneratedClientVaultFile({
    clientId: client.id,
    filename: `${baseName}-config-capture.json`,
    category: "Config Captures",
    sensitivity: "break_glass",
    mimeType: "application/json;charset=utf-8",
    blob: new Blob([JSON.stringify(networkConfigCapturePayload(client, snapshot, details), null, 2)], { type: "application/json;charset=utf-8" }),
    source: "network-snapshot-artifact",
    snapshotId: snapshot.id,
    locationId: snapshot.locationId || "default",
    locationName: snapshot.locationName || "Primary location",
    artifactKind: "network-config-capture-json",
  });
  if (config) {
    config.snapshotId = snapshot.id;
    config.artifactKind = "network-config-capture-json";
    saved.push(config);
  }

  const runbook = existingRunbook || await addGeneratedClientVaultFile({
    clientId: client.id,
    filename: `${baseName}-runbook.txt`,
    category: "Runbooks",
    sensitivity: "confidential",
    mimeType: "text/plain;charset=utf-8",
    blob: new Blob([networkRunbookArtifactMarkdown(client, details)], { type: "text/plain;charset=utf-8" }),
    source: "network-snapshot-artifact",
    snapshotId: snapshot.id,
    locationId: snapshot.locationId || "default",
    locationName: snapshot.locationName || "Primary location",
    artifactKind: "network-runbook-text",
  });
  if (runbook) {
    runbook.snapshotId = snapshot.id;
    runbook.artifactKind = "network-runbook-text";
    saved.push(runbook);
  }

  snapshot.generatedArtifacts = {
    generatedAt: new Date().toISOString(),
    topologyVaultDocumentId: topology?.id || "",
    configVaultDocumentId: config?.id || "",
    runbookVaultDocumentId: runbook?.id || "",
    storage: "client-files",
  };
  saveState();
  console.info("Network snapshot artifacts auto-save completed", {
    clientId: client.id,
    snapshotId: snapshot.id,
    files: saved.map(document => ({ id: document.id, filename: document.filename, category: document.category })),
  });
  return saved;
}

async function downloadNetworkSnapshotReport(clientId) {
  const client = clientById(clientId || selectedNetworkAtlasClientId || selectedClientId);
  if (!client) return;
  const snapshot = selectedNetworkSnapshotForClient(client);
  const savedReports = snapshot?.id ? snapshotReportDocuments(client.id, snapshot.id) : [];
  const existingPdf = savedReports.find(document => document.reportKind === "network-visual-pdf") || savedReports.find(document => /\.pdf$/i.test(document.filename) && document.source === "network-snapshot-report");
  const reportFiles = snapshot?.id && !existingPdf ? await autoSaveNetworkSnapshotReportFiles(client.id, snapshot.id) : savedReports;
  if (snapshot?.id) {
    await autoSaveNetworkSnapshotArtifactFiles(client.id, snapshot.id);
    if (activeView === "client-dashboard") renderClientDashboard();
    else renderNetworkAtlas();
  }
  const pdfReport = reportFiles.find(document => document.reportKind === "network-visual-pdf") || reportFiles.find(document => /\.pdf$/i.test(document.filename));
  if (pdfReport?.id) return viewClientVaultFile(pdfReport.id);
  window.alert("The PDF report could not be generated.");
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

function activateDashboardRow(rowAction) {
  if (!rowAction) return false;
  if (rowAction.dataset.rowNetworkAtlasClient) {
    openNetworkAtlas(rowAction.dataset.rowNetworkAtlasClient);
    return true;
  }
  if (rowAction.dataset.rowAuditServices) {
    auditServices(rowAction.dataset.rowAuditServices);
    return true;
  }
  if (rowAction.dataset.rowEditClient) {
    openEditor("client", clientById(rowAction.dataset.rowEditClient));
    return true;
  }
  if (rowAction.dataset.rowPortalHref) {
    window.location.assign(rowAction.dataset.rowPortalHref);
    return true;
  }
  return false;
}

document.addEventListener("click", handleTicketM365PanelClick, true);
document.addEventListener("pointerdown", handleTicketM365PanelClick, true);

// Site cards are adjacent to native drag handles. Select the site on the
// initial pointer press so focus/drag negotiation cannot swallow the first
// click. Keyboard activation continues through the normal click handler.
document.addEventListener("pointerdown", event => {
  if (event.button !== undefined && event.button !== 0) return;
  const eventTarget = event.target?.nodeType === Node.ELEMENT_NODE
    ? event.target
    : event.target?.parentElement;
  const siteButton = eventTarget?.closest?.("[data-network-location-button][data-network-location-client]");
  if (!siteButton) return;
  event.preventDefault();
  event.stopPropagation();
  selectNetworkLocation(siteButton.dataset.networkLocationClient, siteButton.dataset.networkLocationButton);
}, true);

document.addEventListener("click", event => {
  const eventTarget = event.target?.nodeType === Node.ELEMENT_NODE
    ? event.target
    : event.target?.parentElement;
  const target = eventTarget?.closest?.("button");
  const card = eventTarget?.closest?.(".client-card[data-client-dashboard-card]");
  if (!target && card) {
    openClientDashboard(card.dataset.clientDashboardCard);
    return;
  }
  if (!target) {
    const rowAction = eventTarget?.closest?.("[data-row-network-atlas-client], [data-row-audit-services], [data-row-edit-client], [data-row-portal-href]");
    if (activateDashboardRow(rowAction)) return;
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
  if (target.dataset.invoiceFilterSet) {
    const filter = target.dataset.invoiceFilterSet || "all";
    const invoiceFilter = document.getElementById("invoice-filter");
    if (invoiceFilter) invoiceFilter.value = filter;
    if (target.closest(".nav-nested-submenu")) setInvoiceNavExpanded(true);
    setView("invoices");
    renderInvoices();
    return;
  }
  if (target.dataset.invoiceParent) {
    setInvoiceNavExpanded(!target.classList.contains("expanded"));
    const invoiceFilter = document.getElementById("invoice-filter");
    if (invoiceFilter) invoiceFilter.value = "all";
    setView("invoices");
    renderInvoices();
    return;
  }
  if (target.dataset.clientBillingView) {
    openClientBillingView(target.dataset.clientBillingView, target.dataset.clientBillingId || selectedClientId);
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
  if (target.dataset.backToClients !== undefined) {
    setView("clients");
    return;
  }
  if (target.dataset.backToClientDashboard) {
    openClientDashboard(target.dataset.backToClientDashboard);
    return;
  }
  if (target.dataset.clientDashboardTab) {
    selectedClientDashboardTab = target.dataset.clientDashboardTab;
    renderClientDashboard();
    persistPortalLocationState({ history: "push" });
    return;
  }
  if (target.dataset.vaultDownload) {
    downloadClientVaultFile(target.dataset.vaultDownload);
    return;
  }
  if (target.dataset.vaultFolder) {
    selectedVaultFolder = target.dataset.vaultFolder;
    renderClientDashboard({ syncSites: false });
    return;
  }
  if (target.dataset.openClientVault) {
    openClientVault(target.dataset.openClientVault);
    return;
  }
  if (target.dataset.vaultView) {
    viewClientVaultFile(target.dataset.vaultView);
    return;
  }
  if (target.dataset.vaultDelete) {
    deleteClientVaultFile(target.dataset.vaultDelete);
    return;
  }
  if (target.dataset.vaultCleanBackups) {
    cleanDuplicateBackupFiles(target.dataset.vaultCleanBackups, Number(target.dataset.vaultKeepBackups) || 1)
      .catch(error => window.alert(`Backup cleanup failed: ${error instanceof Error ? error.message : "Unknown error"}`));
    return;
  }
  if (target.dataset.vaultPullBackup) {
    pullBackupFromFiles(target.dataset.vaultPullBackup)
      .catch(error => window.alert(`Site backup failed: ${error instanceof Error ? error.message : "Unknown error"}`));
    return;
  }
  if (target.dataset.vaultPullReport) {
    pullReportFromFiles(target.dataset.vaultPullReport)
      .catch(error => window.alert(`Report generation failed: ${error instanceof Error ? error.message : "Unknown error"}`));
    return;
  }
  if (target.dataset.vaultPullTopology) {
    pullTopologyFromFiles(target.dataset.vaultPullTopology)
      .catch(error => window.alert(`Topology generation failed: ${error instanceof Error ? error.message : "Unknown error"}`));
    return;
  }
  if (target.dataset.vaultDeleteAllClient) {
    deleteAllClientVaultFiles(target.dataset.vaultDeleteAllClient).catch(error => window.alert(`File cleanup failed: ${error instanceof Error ? error.message : "Unknown error"}`));
    return;
  }
  if (target.dataset.dismissClientAction && target.dataset.dismissClientId) {
    dismissClientAction(target.dataset.dismissClientId, target.dataset.dismissClientAction);
    persistPortalLocationState();
    return;
  }
  if (target.dataset.networkAtlasTab) {
    selectedNetworkAtlasTab = target.dataset.networkAtlasTab;
    if (activeView === "client-dashboard") renderClientDashboard();
    else renderNetworkAtlas();
    persistPortalLocationState({ history: "push" });
    return;
  }
  if (target.dataset.networkActionTab) {
    selectedNetworkActionTab = target.dataset.networkActionTab;
    renderNetworkSelectionWithoutJump();
    return;
  }
  if (target.dataset.networkAuditView) {
    selectedNetworkAuditView = target.dataset.networkAuditView;
    renderNetworkSelectionWithoutJump();
    return;
  }
  if (target.dataset.clientUsersRefresh) {
    refreshClientMicrosoftUsers(target.dataset.clientUsersRefresh);
    return;
  }
  if (target.dataset.networkSnapshotId && target.dataset.networkSnapshotClient) {
    selectNetworkSnapshot(target.dataset.networkSnapshotClient, target.dataset.networkSnapshotId);
    return;
  }
  if (target.dataset.networkLocationButton && target.dataset.networkLocationClient) {
    selectNetworkLocation(target.dataset.networkLocationClient, target.dataset.networkLocationButton);
    return;
  }
  if (target.dataset.networkLocationRename && target.dataset.networkLocationClient) {
    renameNetworkLocation(target.dataset.networkLocationClient, target.dataset.networkLocationRename);
    return;
  }
  if (target.dataset.networkLocationCreate) {
    createNetworkLocation(target.dataset.networkLocationCreate);
    return;
  }
  if (target.dataset.networkLocationDelete && target.dataset.networkLocationClient) {
    deleteNetworkLocation(target.dataset.networkLocationClient, target.dataset.networkLocationDelete, target.dataset.networkLocationName || "this site");
    return;
  }
  if (target.dataset.networkLocationModalClose !== undefined) {
    document.getElementById("network-location-dialog")?.close();
    return;
  }
  if (target.dataset.networkDeleteSnapshot && target.dataset.networkDeleteClient) {
    deleteNetworkSnapshot(target.dataset.networkDeleteClient, target.dataset.networkDeleteSnapshot)
      .catch(error => window.alert(`Snapshot delete failed: ${error?.message || "Unknown error"}`));
    return;
  }
  if (target.dataset.networkPullSnapshot) {
    pullNetworkAtlasSnapshot(target.dataset.networkPullSnapshot, target.dataset.networkPullLocation);
    return;
  }
  if (target.dataset.networkSnapshotCompare) {
    window.alert("Snapshot comparison will compare the selected capture against another retained capture. For this prototype, use the selector to inspect each capture.");
    return;
  }
  if (target.dataset.networkSnapshotExport) {
    exportNetworkSnapshotJson(target.dataset.networkSnapshotExport);
    return;
  }
  if (target.dataset.networkReportDownload) {
    downloadNetworkSnapshotReport(target.dataset.networkReportDownload)
      .catch(error => window.alert(`Report generation failed: ${error?.message || "Unknown error"}`));
    return;
  }
  if (target.dataset.networkDrBackup) {
    downloadNetworkDrBackup(target.dataset.networkDrBackup);
    return;
  }
  if (target.dataset.networkNoteDelete && target.dataset.networkNoteClient) {
    deleteNetworkSnapshotNote(target.dataset.networkNoteClient, target.dataset.networkNoteDelete);
    return;
  }
  if (target.dataset.networkActionExport) {
    const client = clientById(target.dataset.networkActionExport);
    const markdown = currentNetworkActionPlanMarkdown(target.dataset.networkActionExport);
    if (!client || !markdown) return;
    exportTextFile(`${safeDownloadName(client.name)}-network-action-plan-${today}.txt`, markdown, "text/plain;charset=utf-8");
    return;
  }
  if (target.dataset.networkSnapshotBriefExport) {
    const client = clientById(target.dataset.networkSnapshotBriefExport);
    const markdown = currentNetworkSnapshotCodexBriefMarkdown(target.dataset.networkSnapshotBriefExport);
    if (!client || !markdown) return;
    exportTextFile(`${safeDownloadName(client.name)}-complete-network-snapshot-${today}.txt`, markdown, "text/plain;charset=utf-8");
    return;
  }
  if (target.dataset.networkActionCopy) {
    const markdown = currentNetworkSnapshotCodexBriefMarkdown(target.dataset.networkActionCopy);
    if (!markdown) return;
    copyTextToClipboard(markdown)
      .then(() => window.alert("Copied the complete Network Snapshot brief for Codex."))
      .catch(() => window.alert("Could not copy automatically. Use Export Snapshot Brief instead."));
    return;
  }
  if (target.dataset.networkRunbookTopic) {
    selectedNetworkRunbookKey = target.dataset.networkRunbookTopic;
    if (activeView === "client-dashboard") renderClientDashboard();
    else renderNetworkAtlas();
    persistPortalLocationState({ history: "push" });
    return;
  }
  if (target.dataset.viewJump) {
    setView(target.dataset.viewJump);
    return;
  }
  if (target.id === "new-invoice") openEditor("invoice", { date: today, dueDate: addDays(today, 15), status: "draft", items: [] });
  if (target.id === "new-quote" || target.id === "add-quote") openBlankQuote();
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
  if (target.dataset.networkAtlasClient) {
    openNetworkAtlas(target.dataset.networkAtlasClient);
    return;
  }
  if (target.dataset.networkConfig) window.location.assign(target.dataset.networkConfig);
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
  if (target.id === "close-preview") closeDocumentPreview();
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
    openClientDashboard(target.dataset.clientDashboard);
    return;
  }
  if (target.dataset.clientInvoice) generateMonthlyInvoice(target.dataset.clientInvoice, { refreshAudit: true });
  if (target.dataset.clientQuote) openBlankQuote(target.dataset.clientQuote);
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
  if (event.target?.id === "network-location-form") {
    event.preventDefault();
    saveNetworkLocation(event.target);
    return;
  }
  if (event.target?.id === "resolve-ticket-form") {
    event.preventDefault();
    submitResolveTicketModal();
    return;
  }
  if (event.target?.id === "network-snapshot-note-form") {
    event.preventDefault();
    addNetworkSnapshotNote(event.target);
    return;
  }
  if (event.target?.id !== "editor-form") return;
  event.preventDefault();
  saveEditor();
});

document.addEventListener("keydown", event => {
  const rowAction = event.target?.closest?.("[data-row-network-atlas-client], [data-row-audit-services], [data-row-edit-client], [data-row-portal-href]");
  if (rowAction && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    activateDashboardRow(rowAction);
    return;
  }

  const previewDialog = document.getElementById("document-preview");
  if (event.key === "Enter" && previewDialog?.open && previewDialog.contains(event.target)) {
    event.preventDefault();
    focusNextControl(previewDialog, event.target);
    return;
  }

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
  }
});

document.getElementById("document-preview")?.addEventListener("click", event => {
  if (event.target === event.currentTarget) closeDocumentPreview();
});

document.addEventListener("input", event => {
  if (event.target.id === "client-search") {
    renderClients();
    return;
  }
  if (event.target.matches?.("[data-client-users-search]")) {
    filterClientMicrosoftUsers();
    return;
  }
  if (event.target.closest("#line-editor-rows") || event.target.id === "taxRate" || event.target.id === "shippingCost") updateEditorTotal(event.target);
});

document.addEventListener("change", event => {
  if (event.target.matches?.("[data-client-users-type]")) {
    filterClientMicrosoftUsers();
    return;
  }
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
    persistPortalLocationState();
  }
  if (event.target.dataset?.networkSnapshotSelect) {
    selectNetworkSnapshot(event.target.dataset.networkSnapshotSelect, event.target.value);
    return;
  }
  if (event.target.dataset?.networkLocationSelect) {
    selectNetworkLocation(event.target.dataset.networkLocationSelect, event.target.value);
    return;
  }
  if (event.target.dataset?.networkWifiPowerClient) {
    updateNetworkWifiPowerOverride(
      event.target.dataset.networkWifiPowerClient,
      event.target.dataset.networkWifiPowerSnapshot,
      event.target.dataset.networkWifiPowerAp,
      event.target.dataset.networkWifiPowerBand,
      event.target.value
    );
    return;
  }
  if (event.target.closest("#line-editor-rows") || event.target.id === "taxRate" || event.target.id === "shippingCost") updateEditorTotal(event.target);
});

document.addEventListener("dragstart", event => {
  const siteHandle = event.target.closest?.("[data-network-location-drag]");
  if (siteHandle) {
    const siteCard = siteHandle.closest(".network-multisite-site[data-network-location-order-id]");
    if (!siteCard) return;
    siteCard.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", siteCard.dataset.networkLocationOrderId || "");
    return;
  }

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
  const siteList = event.target.closest?.(".client-network-location-selector .network-multisite-sites");
  if (siteList) {
    const dragging = siteList.querySelector(".network-multisite-site.dragging");
    if (!dragging) return;
    event.preventDefault();
    const targetCard = event.target.closest(".network-multisite-site[data-network-location-order-id]");
    if (!targetCard || targetCard === dragging) return;
    const targetBox = targetCard.getBoundingClientRect();
    const pointerSameRow = event.clientY >= targetBox.top && event.clientY <= targetBox.bottom;
    const afterTarget = pointerSameRow
      ? event.clientX > targetBox.left + targetBox.width / 2
      : event.clientY > targetBox.top + targetBox.height / 2;
    siteList.insertBefore(dragging, afterTarget ? targetCard.nextSibling : targetCard);
    return;
  }

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

document.addEventListener("drop", event => {
  const siteList = event.target.closest?.(".client-network-location-selector .network-multisite-sites");
  if (!siteList) return;
  const siteCard = siteList.querySelector(".network-multisite-site.dragging");
  if (!siteCard) return;
  event.preventDefault();
  finishNetworkLocationDrag(siteCard);
});

document.addEventListener("dragend", event => {
  const siteCard = event.target.closest?.("[data-network-location-drag]")?.closest(".network-multisite-site[data-network-location-order-id]");
  if (siteCard) {
    finishNetworkLocationDrag(siteCard);
    return;
  }

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
document.getElementById("quote-client-filter")?.addEventListener("change", renderQuotes);
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
document.addEventListener("change", event => {
  if (event.target?.id !== "vault-file-upload") return;
  uploadClientVaultFiles(event.target).catch(error => window.alert(`File upload failed: ${error.message}`));
});

restorePortalLocationState();
setView(activeView, { persist: false });
persistPortalLocationState();
loadNinjaOneOrganizations();
loadNinjaOneContacts();
startNinjaOneLiveSync();
