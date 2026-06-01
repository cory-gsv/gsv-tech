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
  items?: string[];
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
    bannerBody: "We design, install, and support the underlying digital infrastructure that drives modern businesses. We combine proactive user management and secure cloud workspaces with optimized internal server systems, delivering a unified technology ecosystem that simplifies your workflows while maintaining absolute data privacy and threat protection.",
    ctaTitle: "Stabilize your business technology.",
    ctaBody: "Schedule a focused 30-minute technology consultation. We’ll review your current setup, identify immediate opportunities, and help map the right support path forward.",
    cards: [
      {
        eyebrow: "01",
        title: "User & Endpoint Management",
        body: "Day-to-day proactive support for your employees, optimizing hardware performance, and securing user devices.",
        items: [
          "Proactive desktop and laptop monitoring, maintenance, and remote help desk support",
          "Streamlined user onboarding and offboarding directory configuration",
          "Automated cloud backups for individual client workstations and employee data protection",
          "Mobile device management deployment to secure endpoints outside the office",
        ],
      },
      {
        eyebrow: "02",
        title: "Cloud Productivity & Identity",
        body: "Secure, business-grade digital workspaces engineered for seamless communication and absolute access control.",
        items: [
          "Microsoft 365 and Google Workspace tenant design, migration, and administration",
          "Centralized identity management, multi-factor authentication, and secure single sign-on",
          "Managed cloud storage layout, shared drive architecture, and permission governance",
          "Cloud-to-cloud backup architecture for email, shared drives, and collaboration data",
        ],
      },
      {
        eyebrow: "03",
        title: "Continuity & Infrastructure Support",
        body: "Active monitoring and technical oversight engineered to shield your critical data assets from operational vulnerabilities.",
        items: [
          "Security baseline deployment, advanced anti-malware, and endpoint threat detection",
          "Server infrastructure design, virtualization management, and active storage optimization",
          "Disaster recovery engineering, on-site server backups, and data restoration planning",
          "Continuous network health monitoring, compliance security audits, and lifecycle documentation",
        ],
      },
    ],
  },
  {
    slug: "networks-security-systems",
    label: "Networks & Security Systems",
    seoTitle: "Network Infrastructure & Security Systems",
    h1: "Clean network infrastructure and security systems",
    intro: "Golden State Visions designs structured cabling, secure wireless networks, access control systems, business surveillance, and local recording infrastructure for professional environments.",
    bannerEyebrow: "Infrastructure + Security",
    bannerTitle: "Where architecture meets engineering.",
    bannerBody: "We design, install, and support robust physical layer networks from structured cabling to precision server racks. By unifying your core networking components with advanced surveillance hardware, we deliver high-performance ecosystems engineered for speed, security, and long-term uptime.",
    ctaTitle: "Plan your network and security infrastructure.",
    ctaBody: "Schedule a focused 30-minute consultation. We’ll review your cabling, wireless coverage, camera goals, access control needs, and the best path for a clean infrastructure deployment.",
    cards: [
      {
        eyebrow: "01",
        title: "Structured Cabling & Architecture",
        body: "Clean, physical-layer engineering built for neat rack layouts, reliable data paths, and seamless hardware growth.",
        items: [
          "Cat6 and fiber optic structured cabling design and implementation",
          "Precision server rack builds, vertical patch management, and clean cable tracing",
          "Demarcation extensions, clean pathway planning, and physical device positioning",
          "Certified cable testing, path labeling, and lifecycle infrastructure documentation",
        ],
      },
      {
        eyebrow: "02",
        title: "Business Security & IP Surveillance",
        body: "High-performance security ecosystems built around local storage networks to protect your data privacy and eliminate cloud subscription fees.",
        items: [
          "High-definition IP security camera layout, clean mounting, and lens optimization",
          "Continuous network video recorder installation and high-capacity storage setups",
          "AI-powered smart surveillance featuring vehicle recognition and instant perimeter alerts",
          "Secure remote viewing configurations for real-time monitoring across your phones and desktops",
        ],
      },
      {
        eyebrow: "03",
        title: "Secure Wireless & Access Control",
        body: "Intelligent wireless coverage and electronic physical barriers designed to separate public access from your critical internal systems.",
        items: [
          "High-density business Wi-Fi deployment, predictive RF mapping, and wireless heatmaps",
          "Smart access control, keyless door entry setups, and video intercom implementation",
          "Network segmentation dividing internal operations, guest access, and smart devices",
          "Gateway deployment, hardware firewall provisioning, and active network threat mitigation",
        ],
      },
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
    bannerBody: "We design, install, and support the underlying intelligence of your home. We combine world-class platform orchestration like Control4 and Home Assistant with luxury Lutron environments and advanced surveillance. The result is a unified, intuitive ecosystem that simplifies your daily routines while maintaining complete network privacy and physical security.",
    ctaTitle: "Design your connected home infrastructure.",
    ctaBody: "Schedule a focused residential technology consultation. We’ll review your property layout, automation goals, lighting needs, privacy expectations, and the best path for a clean connected home system.",
    cards: [
      {
        eyebrow: "01",
        title: "Intelligent Lighting & Shade Systems",
        body: "High-end environmental management control designed to enhance ambiance, emphasize architecture, maximize natural daylight, and reduce visual clutter.",
        items: [
          "Lutron HomeWorks systems designed for absolute reliability and enterprise-grade architectural control",
          "Lutron Palladiux hardware tailored for modern, responsive, and ultra-quiet smart lighting",
          "Motorized shades, drapes, and blind tracking synchronized with natural daylight cycles",
          "Custom keypads and flush-mounted panels tailored to match your interior architectural design",
        ],
      },
      {
        eyebrow: "02",
        title: "Whole-Home Platform Orchestration",
        body: "Seamless integration platforms built to unify complex independent systems into single, intuitive control interfaces.",
        items: [
          "Control4 ecosystem engineering for high-end luxury environments, climate, and safety",
          "Home Assistant server deployments for advanced, customized automation and open-source versatility",
          "Platform bridging to have Apple Home, Google Home, or Amazon Alexa working flawlessly together",
          "Local-first automation architectures running entirely on your property to maintain data privacy",
        ],
      },
      {
        eyebrow: "03",
        title: "Media Rooms, Audio & Local Surveillance",
        body: "High-fidelity residential entertainment spaces paired with zero-compromise, on-premises security arrays.",
        items: [
          "Multi-room architectural audio networks with discrete pixel-aligned architectural speaker arrays",
          "Centralized matrix video distribution systems for zero-clutter media rooms and multi-zone display feeds",
          "Smart residential camera layouts utilizing local edge AI processing and facial recognition",
          "Privacy-first network video recording systems locked locally back securely to your property",
        ],
      },
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
    bannerBody: "We design, install, and support your home's entertainment, network, and safety infrastructure. We combine high-performance local routing engines with premium audio architectures like Russound and Marantz, masterfully calibrated media rooms, and isolated smart surveillance arrays. The result is a unified, secure ecosystem that delivers pristine audio-visual immersion over an ultra-stable, private network.",
    ctaTitle: "Design your media and surveillance infrastructure.",
    ctaBody: "Schedule a dedicated 30-minute residential technology consultation. We’ll review your property layout, entertainment preferences, home network coverage, security requirements, and the right path for whole-home audio, theaters, and localized AI surveillance.",
    cards: [
      {
        eyebrow: "01",
        title: "Intelligent Network & Custom Audio Systems",
        body: "High-throughput network routing and distributed high-fidelity sound engineered to deliver seamless, zero-latency acoustic performance across your entire property.",
        items: [
          "Proactive local routing engines featuring high-throughput traffic management for high-resolution streaming audio",
          "Next-generation wireless access points mapped across interior and outdoor living spaces",
          "Premium multi-room distribution with hardware architectures from Russound, Marantz, Leon, and AudioControl",
          "High-capacity Power over Ethernet to drive access points, architectural audio zones, and in-wall touch panels",
          "High-resolution streaming arrays driven by Bluesound wireless zones with optimized Sonos environments",
        ],
      },
      {
        eyebrow: "02",
        title: "Dedicated Movie Theater & Media Rooms",
        body: "Private cinematic environments tailored with precise viewing angles, structural acoustic treatments, and high-performance, network-optimized projection systems.",
        items: [
          "Bespoke home theater layout planning, room scaling, acoustic treatment orchestration, and seating alignment",
          "High-definition 4K laser projection setups paired with acoustically transparent woven micro-perforated screens",
          "Dedicated high-bandwidth network pipelines for centralized media matrices without buffering or lag",
          "Dolby Atmos spatial surround sound tuning for rich, studio-grade cinematic immersion",
          "One-touch environment automation for projection screens, architectural lighting scenes, and audio-visual feeds",
        ],
      },
      {
        eyebrow: "03",
        title: "Advanced AI Surveillance & Private Recording",
        body: "Secure, privacy-first camera grids built on dedicated, isolated local networks to remove monthly subscription fees and protect your data.",
        items: [
          "Dedicated network hardware isolation separating your security grid from main property Wi-Fi",
          "High-definition security camera positioning, weatherproof architectural mounting, and lens optimization",
          "Continuous local network video recording with high-capacity secure storage arrays running on-premises",
          "Edge-AI processing for intelligent vehicle detection, license plate tracking, and facial recognition",
          "Encrypted local remote-access clients for secure real-time viewing on personal mobile devices",
        ],
      },
    ],
  },
];

export function getLocalCity(slug: string) {
  return localCities.find((city) => city.slug === slug);
}

export function getLocalService(slug: string) {
  return localServices.find((service) => service.slug === slug);
}
