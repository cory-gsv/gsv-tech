export type LocalCity = {
  slug: string;
  city: string;
  state: string;
  region: string;
};

export type LocalServiceCard = {
  eyebrow: string;
  title: string;
  body: string;
};

export type LocalService = {
  slug: string;
  label: string;
  seoTitle: string;
  h1: string;
  intro: string;
  bannerEyebrow: string;
  bannerTitle: string;
  bannerBody: string;
  ctaTitle: string;
  ctaBody: string;
  cards: LocalServiceCard[];
};

export const localCities: LocalCity[] = [
  { slug: "lincoln-ca", city: "Lincoln", state: "CA", region: "Placer County" },
  { slug: "rocklin-ca", city: "Rocklin", state: "CA", region: "Placer County" },
  { slug: "roseville-ca", city: "Roseville", state: "CA", region: "Placer County" },
  { slug: "granite-bay-ca", city: "Granite Bay", state: "CA", region: "Placer County" },
  { slug: "folsom-ca", city: "Folsom", state: "CA", region: "Sacramento County" },
  { slug: "auburn-ca", city: "Auburn", state: "CA", region: "Placer County" },
  { slug: "truckee-ca", city: "Truckee", state: "CA", region: "Northern California" },
  { slug: "tahoe-ca", city: "Tahoe", state: "CA", region: "Northern California" },
  { slug: "sugar-bowl-ca", city: "Sugar Bowl", state: "CA", region: "Northern California" },
  { slug: "sunnyvale-ca", city: "Sunnyvale", state: "CA", region: "Silicon Valley" },
  { slug: "mountain-view-ca", city: "Mountain View", state: "CA", region: "Silicon Valley" },
  { slug: "palo-alto-ca", city: "Palo Alto", state: "CA", region: "Silicon Valley" },
  { slug: "santa-clara-ca", city: "Santa Clara", state: "CA", region: "Silicon Valley" },
  { slug: "cupertino-ca", city: "Cupertino", state: "CA", region: "Silicon Valley" },
  { slug: "los-altos-ca", city: "Los Altos", state: "CA", region: "Silicon Valley" },
  { slug: "san-jose-ca", city: "San Jose", state: "CA", region: "Silicon Valley" },
];

export const localServices: LocalService[] = [
  {
    slug: "managed-it",
    label: "Managed IT Services",
    seoTitle: "Managed IT Services & Business IT Support",
    h1: "Practical managed IT support for small to medium size businesses",
    intro: "Golden State Visions provides managed IT services, endpoint protection, cloud workspace support, identity management, and business infrastructure planning for local companies.",
    bannerEyebrow: "Managed IT Support",
    bannerTitle: "Where support meets stability.",
    bannerBody: "We design, install, and support dependable business technology systems built around proactive monitoring, secure access, clean documentation, and long-term operational reliability.",
    ctaTitle: "Stabilize your business technology.",
    ctaBody: "Schedule a focused 30-minute technology consultation. We’ll review your current setup, identify immediate opportunities, and help map the right support path forward.",
    cards: [
      { eyebrow: "01", title: "User & Endpoint Management", body: "Day-to-day proactive support for employee devices, secure access, onboarding, offboarding, and workstation reliability." },
      { eyebrow: "02", title: "Cloud Productivity & Identity", body: "Microsoft 365, Google Workspace, shared storage, permissions, MFA, and secure sign-in systems designed for smooth business operations." },
      { eyebrow: "03", title: "Continuity & Infrastructure Support", body: "Server oversight, backup planning, endpoint security, vendor coordination, and lifecycle documentation for critical business systems." },
    ],
  },
  {
    slug: "networks-security-systems",
    label: "Networks & Security Systems",
    seoTitle: "Network Infrastructure & Security Systems",
    h1: "Clean network infrastructure and security systems",
    intro: "Golden State Visions designs structured cabling, secure wireless networks, access control planning, business surveillance, and local recording infrastructure for professional environments.",
    bannerEyebrow: "Infrastructure + Security",
    bannerTitle: "Where architecture meets engineering.",
    bannerBody: "We design, install, and support robust physical layer networks from structured cabling to precision server racks. By unifying your core networking components with advanced surveillance hardware, we deliver high-performance ecosystems engineered for speed, security, and long-term uptime.",
    ctaTitle: "Plan your network and security infrastructure.",
    ctaBody: "Schedule a focused 30-minute consultation. We’ll review your cabling, wireless coverage, camera goals, access control needs, and the best path for a clean infrastructure deployment.",
    cards: [
      { eyebrow: "01", title: "Structured Cabling & Architecture", body: "Physical-layer engineering for clean rack layouts, reliable data paths, labeled cabling, fiber planning, and long-term hardware growth." },
      { eyebrow: "02", title: "Business Security & IP Surveillance", body: "High-definition camera layouts, NVR installation, local storage, smart alerts, remote viewing, and subscription-free recording systems." },
      { eyebrow: "03", title: "Secure Wireless & Access Control Planning", body: "Business-grade Wi-Fi, segmentation, access control, keyless entry planning, video intercoms, gateway deployment, and firewall provisioning." },
    ],
  },
  {
    slug: "smart-home-automation",
    label: "Smart Home Automation",
    seoTitle: "Smart Home Automation, Lighting & Control Systems",
    h1: "Automation architecture and luxury home technology",
    intro: "Golden State Visions designs smart home automation, Lutron lighting and shade systems, whole-home control platforms, privacy-focused home networks, and connected residential technology systems.",
    bannerEyebrow: "Smart Home Intelligence",
    bannerTitle: "Where design meets technology.",
    bannerBody: "We design, install, and support the underlying intelligence of your home. We combine platform orchestration, luxury lighting environments, and advanced surveillance into a unified ecosystem that simplifies daily routines while protecting privacy and security.",
    ctaTitle: "Design your connected home infrastructure.",
    ctaBody: "Schedule a focused residential technology consultation. We’ll review your property layout, automation goals, lighting needs, privacy expectations, and the best path for a clean connected home system.",
    cards: [
      { eyebrow: "01", title: "Intelligent Lighting & Shade Systems", body: "Lutron lighting, shade control, custom keypads, flush-mounted panels, daylight coordination, and quiet architectural control systems." },
      { eyebrow: "02", title: "Whole-Home Platform Orchestration", body: "Control4, Home Assistant, Apple Home, Google Home, Alexa integration, local-first automation, and unified control interfaces." },
      { eyebrow: "03", title: "Media Rooms, Audio & Local Surveillance", body: "Residential entertainment spaces, multi-room audio, local camera storage, smart surveillance, and private on-premises recording systems." },
    ],
  },
  {
    slug: "audio-video-surveillance",
    label: "Audio, Video & Surveillance",
    seoTitle: "Audio, Video & Surveillance Systems",
    h1: "High-fidelity audio environments and intelligent surveillance ecosystems",
    intro: "Golden State Visions designs whole-home audio, dedicated media rooms, residential network infrastructure, AI surveillance, local NVR recording, and secure remote viewing systems.",
    bannerEyebrow: "Audio, Video & Surveillance",
    bannerTitle: "Where performance meets security.",
    bannerBody: "We design, install, and support your home's entertainment, network, and safety infrastructure. We combine high-performance local routing engines with premium audio architecture, calibrated media rooms, and isolated smart surveillance arrays.",
    ctaTitle: "Design your media and surveillance infrastructure.",
    ctaBody: "Schedule a dedicated 30-minute residential technology consultation. We’ll review your property layout, entertainment preferences, home network coverage, security requirements, and the right path for whole-home audio, theaters, and localized AI surveillance.",
    cards: [
      { eyebrow: "01", title: "Intelligent Network & Custom Audio Systems", body: "Enterprise-grade local routing, wireless access points, PoE planning, multi-room distribution, streaming zones, and high-fidelity audio infrastructure." },
      { eyebrow: "02", title: "Dedicated Movie Theater & Media Rooms", body: "Private cinematic spaces with acoustic planning, projection systems, screen alignment, surround sound tuning, and one-touch environment automation." },
      { eyebrow: "03", title: "Advanced AI Surveillance & Private Recording", body: "Dedicated security networks, camera positioning, local NVR storage, edge-AI detection, encrypted remote access, and privacy-first recording." },
    ],
  },
];

export function getLocalCity(slug: string) {
  return localCities.find((city) => city.slug === slug);
}

export function getLocalService(slug: string) {
  return localServices.find((service) => service.slug === slug);
}
