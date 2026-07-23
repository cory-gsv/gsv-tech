export type LocalCity = {
  slug: string;
  city: string;
  state: string;
  region: string;
  commercial: LocalCommercialSeo;
  residential: LocalResidentialSeo;
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

export type BusinessIndustryKey =
  | "restaurants"
  | "retail"
  | "medical"
  | "professional"
  | "warehouse"
  | "multiSite";

export type LocalCommercialSeo = {
  h1: string;
  intro: string;
  businessTypes: string;
  servicesIntro: string;
  industriesIntro: string;
  industryOrder: BusinessIndustryKey[];
};

export type LocalResidentialSeo = {
  h1: string;
  intro: string;
  propertyTypes: string;
  servicesIntro: string;
};

const baseLocalCities = [
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
] as const;

const localCityProfiles: Record<
  (typeof baseLocalCities)[number]["slug"],
  { commercial: LocalCommercialSeo; residential: LocalResidentialSeo }
> = {
  "lincoln-ca": {
    commercial: {
      h1: "Commercial IT support for Lincoln businesses that are growing fast.",
      intro:
        "Golden State Visions supports Lincoln businesses from Downtown and Lincoln Crossing to the Twelve Bridges corridor and nearby warehouse spaces. We focus on managed IT, secure networks, cameras, Microsoft 365, Google Workspace, and onsite support for teams that need one accountable local partner.",
      businessTypes:
        "Professional offices, medical and dental practices, restaurants, retail storefronts, light industrial spaces, and local service teams",
      servicesIntro:
        "Lincoln businesses often need practical support that can cover front offices, back rooms, Wi-Fi, cameras, and cloud accounts without sending every issue through a distant call center.",
      industriesIntro:
        "For Lincoln, we put extra emphasis on professional offices, medical suites, restaurants, and warehouse operations where network uptime, camera coverage, and onsite response matter.",
      industryOrder: ["professional", "medical", "restaurants", "retail", "warehouse", "multiSite"],
    },
    residential: {
      h1: "Home networking and camera planning for Lincoln homes.",
      intro:
        "Golden State Visions designs residential Wi-Fi, cameras, Lutron lighting, and smart-home infrastructure for Lincoln homeowners in established neighborhoods, newer Twelve Bridges homes, rural-edge properties, and home offices that need dependable coverage inside and outside.",
      propertyTypes:
        "Newer subdivision homes, larger lots, home offices, garages, patios, gates, and detached shops",
      servicesIntro:
        "Lincoln homes often combine newer construction, outdoor living areas, and work-from-home demands, so we plan networks and camera systems around the whole property instead of only the main rooms.",
    },
  },
  "rocklin-ca": {
    commercial: {
      h1: "IT support for Rocklin offices, retail teams, and growing operations.",
      intro:
        "Golden State Visions supports Rocklin businesses around Stanford Ranch, Whitney Ranch, the Quarry District, and the Sunset Boulevard corridor. We help local offices, storefronts, restaurants, and operational spaces keep users, Wi-Fi, cameras, and cloud platforms organized under one support relationship.",
      businessTypes:
        "Office teams, retail suites, medical practices, restaurants, service businesses, and warehouse or operations teams",
      servicesIntro:
        "Rocklin companies tend to run a mix of office technology, client-facing Wi-Fi, cameras, and vendor-managed systems, so support works best when one local team understands the full environment.",
      industriesIntro:
        "For Rocklin, we emphasize professional offices, retail locations, warehouse teams, and medical practices that need dependable networks and coordinated vendor support.",
      industryOrder: ["professional", "retail", "warehouse", "medical", "restaurants", "multiSite"],
    },
    residential: {
      h1: "Whole-home Wi-Fi and camera systems for Rocklin properties.",
      intro:
        "Golden State Visions helps Rocklin homeowners in Stanford Ranch, Whitney Ranch, and hillside neighborhoods build stronger Wi-Fi, cleaner camera coverage, and smart-home systems that stay usable after the installation is complete.",
      propertyTypes:
        "Multi-level homes, hillside lots, outdoor spaces, home offices, media rooms, gates, and garages",
      servicesIntro:
        "Rocklin homes can be tricky for wireless coverage because of floor plans, elevation changes, patios, and detached areas, so we design systems around measured coverage and real daily use.",
    },
  },
  "roseville-ca": {
    commercial: {
      h1: "Managed IT and network support for Roseville business corridors.",
      intro:
        "Golden State Visions supports Roseville businesses near Douglas Boulevard, Vernon Street, Creekside, the Galleria area, medical offices, and the Automall corridor. We help teams keep point-of-sale systems, cloud accounts, Wi-Fi, cameras, and workstations running without vendor runaround.",
      businessTypes:
        "Retail and showroom teams, medical offices, restaurants, professional offices, multi-site operators, and light industrial spaces",
      servicesIntro:
        "Roseville has a high mix of public-facing retail, medical, restaurants, and office environments, so we plan support around both customer-facing uptime and day-to-day staff productivity.",
      industriesIntro:
        "For Roseville, we lead with retail, medical, restaurant, and professional office environments where payment systems, patient workflows, and guest Wi-Fi all need to stay separated and stable.",
      industryOrder: ["retail", "medical", "restaurants", "professional", "multiSite", "warehouse"],
    },
    residential: {
      h1: "Residential Wi-Fi, cameras, and smart-home support for Roseville.",
      intro:
        "Golden State Visions designs home networks, cameras, smart controls, and Lutron lighting for Roseville homeowners across established neighborhoods, newer developments, home offices, and outdoor living spaces that need reliable coverage.",
      propertyTypes:
        "Family homes, larger lots, home offices, patios, pool areas, media rooms, garages, and camera zones",
      servicesIntro:
        "Roseville homeowners often need Wi-Fi and camera systems that cover busy homes, outdoor spaces, and home offices without turning every device into another disconnected app.",
    },
  },
  "granite-bay-ca": {
    commercial: {
      h1: "Technology support for Granite Bay offices and client-facing teams.",
      intro:
        "Golden State Visions supports Granite Bay professional offices, medical and dental practices, boutique retail, and service businesses around Douglas Boulevard, Auburn Folsom Road, and nearby Placer County corridors. We focus on clean infrastructure, secure Wi-Fi, cloud administration, cameras, and responsive local support.",
      businessTypes:
        "Professional services, medical and dental offices, boutique retail, restaurants, private offices, and multi-location teams",
      servicesIntro:
        "Granite Bay businesses often need polished client-facing technology with the same reliability as a larger office, especially when phones, Wi-Fi, cameras, and cloud systems all affect the customer experience.",
      industriesIntro:
        "For Granite Bay, we emphasize professional offices, retail, medical practices, and restaurants that need quiet support, clean installs, and accountable vendor coordination.",
      industryOrder: ["professional", "retail", "medical", "restaurants", "multiSite", "warehouse"],
    },
    residential: {
      h1: "Smart-home infrastructure for Granite Bay estates and family homes.",
      intro:
        "Golden State Visions designs premium home networks, cameras, Lutron lighting, and smart-home control for Granite Bay homes with larger floor plans, outdoor living areas, gates, detached buildings, and privacy-sensitive systems.",
      propertyTypes:
        "Estate homes, gated entries, detached spaces, patios, pool areas, theaters, home offices, and camera systems",
      servicesIntro:
        "Granite Bay projects often need more than a simple router swap; we plan network coverage, camera locations, lighting control, and support access around the full property.",
    },
  },
  "folsom-ca": {
    commercial: {
      h1: "Local IT support for Folsom offices, clinics, restaurants, and storefronts.",
      intro:
        "Golden State Visions supports Folsom businesses near Historic Folsom, East Bidwell, Broadstone, Folsom Ranch, and local office parks. We help professional teams, clinics, restaurants, and retail locations keep networks, cloud accounts, cameras, and devices reliable as they grow.",
      businessTypes:
        "Professional offices, clinics, retail teams, restaurants, multi-site businesses, and operations spaces",
      servicesIntro:
        "Folsom businesses frequently mix office productivity, customer Wi-Fi, payment systems, phones, and cameras, so we keep the infrastructure documented and supportable from the start.",
      industriesIntro:
        "For Folsom, we emphasize professional offices, medical practices, retail, and restaurants that need stable systems across staff, guest, payment, and camera networks.",
      industryOrder: ["professional", "medical", "retail", "restaurants", "multiSite", "warehouse"],
    },
    residential: {
      h1: "Connected-home planning for Folsom homes and home offices.",
      intro:
        "Golden State Visions designs residential Wi-Fi, security cameras, lighting control, and smart-home infrastructure for Folsom homeowners in established neighborhoods, newer Folsom Ranch homes, media rooms, and outdoor living spaces.",
      propertyTypes:
        "New builds, established homes, home offices, media rooms, outdoor areas, garages, gates, and camera zones",
      servicesIntro:
        "Folsom homes often need coverage across multiple floors, patios, offices, and connected devices, so we design the network before layering cameras, lighting, and automation on top.",
    },
  },
  "auburn-ca": {
    commercial: {
      h1: "IT and network support for Auburn businesses with real onsite needs.",
      intro:
        "Golden State Visions supports Auburn businesses around Old Town, Downtown, Highway 49, and the I-80 corridor. We help medical offices, retail shops, restaurants, professional teams, and light industrial spaces keep networks, Wi-Fi, cameras, cloud tools, and user support coordinated.",
      businessTypes:
        "Medical offices, retail shops, restaurants, service businesses, light industrial teams, professional offices, and multi-site operators",
      servicesIntro:
        "Auburn businesses often need practical onsite support because networks, cameras, printers, phones, and software vendors all meet in the same physical workspace.",
      industriesIntro:
        "For Auburn, we emphasize medical offices, retail, restaurants, and light industrial spaces where dependable connectivity and fast local coordination matter.",
      industryOrder: ["medical", "retail", "restaurants", "warehouse", "professional", "multiSite"],
    },
    residential: {
      h1: "Home Wi-Fi and camera systems for Auburn properties.",
      intro:
        "Golden State Visions designs residential networks, cameras, outdoor coverage, and smart-home systems for Auburn homes with hillsides, larger lots, detached garages, home offices, gates, and rural-edge connectivity challenges.",
      propertyTypes:
        "Hillside homes, larger lots, detached buildings, gates, workshops, home offices, patios, and camera systems",
      servicesIntro:
        "Auburn properties can stretch well beyond the main living area, so we plan Wi-Fi, camera coverage, and remote access around driveways, detached spaces, and outdoor zones.",
    },
  },
  "truckee-ca": {
    commercial: {
      h1: "Technology support for Truckee businesses, hospitality teams, and property operators.",
      intro:
        "Golden State Visions supports Truckee businesses around Downtown, Donner Pass Road, hospitality corridors, retail spaces, property management offices, and mountain operations. We focus on Wi-Fi, cameras, cloud administration, failover planning, and support that accounts for seasonal traffic and weather.",
      businessTypes:
        "Hospitality teams, restaurants, retail shops, property managers, multi-site operators, office teams, and operations spaces",
      servicesIntro:
        "Truckee teams often need technology that can handle seasonal demand, remote access, guest Wi-Fi, cameras, and quick coordination when weather or internet issues get in the way.",
      industriesIntro:
        "For Truckee, we emphasize hospitality, restaurants, retail, property management, and multi-site operations where guest access and resilient connectivity are part of the job.",
      industryOrder: ["restaurants", "retail", "multiSite", "warehouse", "professional", "medical"],
    },
    residential: {
      h1: "Mountain-home networks, cameras, and smart systems for Truckee.",
      intro:
        "Golden State Visions designs Wi-Fi, cameras, smart-home controls, and remote access for Truckee homes, vacation properties, cabins, home offices, and outdoor spaces that need dependable systems through seasonal use and winter conditions.",
      propertyTypes:
        "Cabins, vacation homes, rental properties, home offices, detached garages, driveways, decks, and cameras",
      servicesIntro:
        "Truckee homes often need owners and guests to reach the same systems from different places, so we prioritize stable Wi-Fi, secure camera access, and clean homeowner handoff.",
    },
  },
  "tahoe-ca": {
    commercial: {
      h1: "IT, Wi-Fi, and camera support for Tahoe-area businesses and operators.",
      intro:
        "Golden State Visions supports Tahoe-area businesses, hospitality teams, restaurants, retail spaces, property managers, and service operators that depend on guest Wi-Fi, cameras, cloud tools, and resilient internet in a mountain environment.",
      businessTypes:
        "Hospitality teams, restaurants, retail shops, property managers, service businesses, offices, and multi-location operators",
      servicesIntro:
        "Tahoe-area businesses need networks that can support guests, staff, cameras, reservations, payments, and remote management without collapsing under seasonal swings.",
      industriesIntro:
        "For Tahoe, we emphasize hospitality, restaurants, retail, property management, and professional operators with guest-facing systems and remote support needs.",
      industryOrder: ["restaurants", "retail", "multiSite", "professional", "warehouse", "medical"],
    },
    residential: {
      h1: "Connected-home support for Tahoe properties and second homes.",
      intro:
        "Golden State Visions designs residential Wi-Fi, cameras, smart-home systems, and remote access for Tahoe homes, vacation properties, lake-area residences, cabins, and rental-ready spaces that need dependable control when owners are away.",
      propertyTypes:
        "Vacation homes, lake-area residences, cabins, rental properties, outdoor areas, driveways, garages, and cameras",
      servicesIntro:
        "Tahoe properties often need remote visibility and simple guest-friendly controls, so we design networks, cameras, and automation around ownership from both on-site and away.",
    },
  },
  "sugar-bowl-ca": {
    commercial: {
      h1: "Network and camera support for Sugar Bowl and Donner Summit properties.",
      intro:
        "Golden State Visions supports Sugar Bowl and Donner Summit resort-area operators, vacation-property managers, lodges, home offices, cameras, Wi-Fi, and connected systems that need stable remote access in a mountain environment.",
      businessTypes:
        "Vacation-property operators, resort-area businesses, lodges, remote offices, service teams, and managed residential properties",
      servicesIntro:
        "Sugar Bowl-area technology has to work around weather, distance, seasonal occupancy, and remote management, so we focus on resilient networks, clear documentation, and supportable camera access.",
      industriesIntro:
        "For Sugar Bowl, we emphasize property operations, multi-site support, remote offices, camera coverage, and hospitality-adjacent spaces more than standard office-only IT.",
      industryOrder: ["multiSite", "warehouse", "retail", "restaurants", "professional", "medical"],
    },
    residential: {
      h1: "Mountain-property Wi-Fi and camera systems for Sugar Bowl homes.",
      intro:
        "Golden State Visions designs Wi-Fi, cameras, smart-home controls, and remote monitoring for Sugar Bowl and Donner Summit homes, cabins, vacation properties, and owner-managed spaces that need dependable access through seasonal conditions.",
      propertyTypes:
        "Mountain cabins, vacation homes, owner-managed properties, driveways, garages, outdoor cameras, and remote access systems",
      servicesIntro:
        "Sugar Bowl homes need systems that owners can trust when they are not on site, so we plan secure remote access, camera coverage, and simple controls from the beginning.",
    },
  },
  "sunnyvale-ca": {
    commercial: {
      h1: "IT support for Sunnyvale offices, startups, and operational teams.",
      intro:
        "Golden State Visions supports Sunnyvale businesses around Downtown, Mathilda Avenue, Moffett Park, office corridors, labs, and professional suites. We help teams keep cloud platforms, endpoints, Wi-Fi, cameras, and secure networks managed without adding another disconnected vendor.",
      businessTypes:
        "Professional offices, startups, technical teams, clinics, multi-site businesses, labs, retail spaces, and operations teams",
      servicesIntro:
        "Sunnyvale teams often run cloud-first workflows alongside physical offices, meeting rooms, cameras, and networks, so we support both the digital workspace and the site infrastructure.",
      industriesIntro:
        "For Sunnyvale, we emphasize professional offices, multi-site teams, light operations, medical suites, and retail locations with cloud-heavy workflows and security expectations.",
      industryOrder: ["professional", "multiSite", "warehouse", "medical", "retail", "restaurants"],
    },
    residential: {
      h1: "Home network and smart-system support for Sunnyvale homes.",
      intro:
        "Golden State Visions designs residential Wi-Fi, cameras, smart controls, and home-office networks for Sunnyvale homes, remodels, ADUs, outdoor spaces, and connected households that need reliable coverage without complexity.",
      propertyTypes:
        "Home offices, remodels, ADUs, townhomes, family homes, patios, cameras, and media areas",
      servicesIntro:
        "Sunnyvale homes often combine work-from-home needs with dense connected devices, so we plan networks and cameras around coverage, privacy, and everyday usability.",
    },
  },
  "mountain-view-ca": {
    commercial: {
      h1: "Managed IT and network support for Mountain View workplaces.",
      intro:
        "Golden State Visions supports Mountain View businesses near Castro Street, Shoreline, North Bayshore, and local office corridors. We help offices, startups, clinics, restaurants, and retail teams coordinate cloud tools, endpoints, Wi-Fi, cameras, and secure networks.",
      businessTypes:
        "Office teams, startups, professional services, clinics, restaurants, retail storefronts, and multi-site operators",
      servicesIntro:
        "Mountain View organizations often need support that understands cloud platforms and real office infrastructure at the same time, from identity and email to Wi-Fi and cameras.",
      industriesIntro:
        "For Mountain View, we emphasize professional offices, multi-site teams, retail, medical suites, and restaurants where cloud productivity and site reliability meet.",
      industryOrder: ["professional", "multiSite", "retail", "medical", "restaurants", "warehouse"],
    },
    residential: {
      h1: "Residential Wi-Fi, cameras, and smart-home systems for Mountain View.",
      intro:
        "Golden State Visions designs home networks, cameras, lighting control, and smart-home infrastructure for Mountain View homes, remodels, home offices, outdoor areas, and connected living spaces.",
      propertyTypes:
        "Home offices, remodels, townhomes, outdoor areas, media rooms, cameras, and connected-home systems",
      servicesIntro:
        "Mountain View homeowners often need strong work-from-home reliability plus simple control for cameras, lighting, and entertainment, so we build around daily habits rather than device lists.",
    },
  },
  "palo-alto-ca": {
    commercial: {
      h1: "High-touch IT support for Palo Alto offices, clinics, and professional teams.",
      intro:
        "Golden State Visions supports Palo Alto businesses near University Avenue, California Avenue, Stanford Research Park, medical offices, professional suites, and client-facing teams that expect responsive support, clean documentation, and secure networks.",
      businessTypes:
        "Medical offices, professional firms, startups, private offices, retail teams, restaurants, and multi-site operators",
      servicesIntro:
        "Palo Alto teams often need a higher-touch support model where identity, devices, networks, cameras, and vendor coordination are handled with clear ownership.",
      industriesIntro:
        "For Palo Alto, we emphasize medical offices, professional firms, retail, and restaurants where security, uptime, and polished client experience matter.",
      industryOrder: ["medical", "professional", "retail", "restaurants", "multiSite", "warehouse"],
    },
    residential: {
      h1: "Premium home network and smart-system design for Palo Alto.",
      intro:
        "Golden State Visions designs residential Wi-Fi, cameras, Lutron lighting, smart-home controls, and home-office infrastructure for Palo Alto residences, remodels, estate properties, and privacy-conscious households.",
      propertyTypes:
        "Estate homes, remodels, home offices, outdoor living areas, camera systems, theaters, and lighting control",
      servicesIntro:
        "Palo Alto homes often need secure home-office networking and premium controls to coexist cleanly, so we design the foundation before adding cameras, lighting, and AV.",
    },
  },
  "santa-clara-ca": {
    commercial: {
      h1: "Network and managed IT support for Santa Clara business environments.",
      intro:
        "Golden State Visions supports Santa Clara businesses around El Camino Real, Great America, Mission College, industrial corridors, office parks, and retail spaces. We help teams manage secure Wi-Fi, firewalls, endpoints, cameras, cloud tools, and site infrastructure.",
      businessTypes:
        "Operations teams, professional offices, retail locations, medical suites, restaurants, warehouses, and multi-site businesses",
      servicesIntro:
        "Santa Clara businesses often combine office, warehouse, retail, and technical environments, so we keep network infrastructure, security, and user support coordinated under one plan.",
      industriesIntro:
        "For Santa Clara, we emphasize operations spaces, professional offices, retail, multi-site teams, and medical suites that need clean networks and predictable support.",
      industryOrder: ["warehouse", "professional", "retail", "multiSite", "medical", "restaurants"],
    },
    residential: {
      h1: "Smart-home and home-network support for Santa Clara properties.",
      intro:
        "Golden State Visions designs residential Wi-Fi, cameras, smart controls, Lutron lighting, and home-office networks for Santa Clara homes, townhomes, remodels, outdoor areas, and connected households.",
      propertyTypes:
        "Townhomes, remodels, family homes, home offices, patios, camera zones, media rooms, and lighting systems",
      servicesIntro:
        "Santa Clara homes often need reliable work-from-home connectivity alongside smart-home devices, so we separate, document, and support the network from the start.",
    },
  },
  "cupertino-ca": {
    commercial: {
      h1: "Managed IT and secure networks for Cupertino offices and service businesses.",
      intro:
        "Golden State Visions supports Cupertino businesses around De Anza Boulevard, Stevens Creek, professional suites, medical offices, retail corridors, and restaurants. We help teams keep cloud accounts, endpoints, Wi-Fi, cameras, and network security working as one environment.",
      businessTypes:
        "Professional offices, medical and dental practices, retail storefronts, restaurants, multi-site teams, and service businesses",
      servicesIntro:
        "Cupertino businesses often need clean cloud administration and secure physical networks together, especially where staff, guests, payments, and cameras share the same building.",
      industriesIntro:
        "For Cupertino, we emphasize professional offices, medical practices, retail, and restaurants where cloud tools and customer-facing systems need stable support.",
      industryOrder: ["professional", "medical", "retail", "restaurants", "multiSite", "warehouse"],
    },
    residential: {
      h1: "Home networking, cameras, and lighting control for Cupertino homes.",
      intro:
        "Golden State Visions designs residential Wi-Fi, cameras, Lutron lighting, smart-home systems, and home-office infrastructure for Cupertino homes, remodels, outdoor spaces, and privacy-conscious households.",
      propertyTypes:
        "Home offices, remodels, premium homes, outdoor spaces, cameras, media rooms, and lighting control",
      servicesIntro:
        "Cupertino homes often need work-grade reliability and simple family controls, so we design coverage, segmentation, and smart-home access around how the home is actually used.",
    },
  },
  "los-altos-ca": {
    commercial: {
      h1: "Business IT support for Los Altos professional teams and storefronts.",
      intro:
        "Golden State Visions supports Los Altos businesses around the Village, Foothill Expressway, professional offices, boutique retail, medical suites, and local service teams that need reliable cloud administration, Wi-Fi, cameras, and hands-on support.",
      businessTypes:
        "Professional offices, boutique retail, medical practices, restaurants, private offices, and multi-site service teams",
      servicesIntro:
        "Los Altos businesses often care about quiet, polished support as much as technical depth, especially when client-facing offices, Wi-Fi, phones, and cameras all affect trust.",
      industriesIntro:
        "For Los Altos, we emphasize professional services, retail, medical suites, and restaurants where clean systems and responsive local ownership matter.",
      industryOrder: ["professional", "retail", "medical", "restaurants", "multiSite", "warehouse"],
    },
    residential: {
      h1: "Premium home technology planning for Los Altos residences.",
      intro:
        "Golden State Visions designs home networks, camera systems, Lutron lighting, smart controls, and AV foundations for Los Altos homes, remodels, estate properties, detached spaces, and privacy-focused households.",
      propertyTypes:
        "Estate homes, remodels, detached offices, outdoor living areas, gates, cameras, theaters, and lighting systems",
      servicesIntro:
        "Los Altos projects often need technology that disappears into the home, so we plan Wi-Fi, cameras, lighting, and control interfaces around both performance and daily simplicity.",
    },
  },
  "san-jose-ca": {
    commercial: {
      h1: "Managed IT and secure network support for San Jose businesses.",
      intro:
        "Golden State Visions supports San Jose businesses across Downtown, North San Jose, Willow Glen, Santana Row, Almaden, retail corridors, warehouses, restaurants, clinics, and office environments that need dependable managed IT, Wi-Fi, cameras, and cloud support.",
      businessTypes:
        "Warehouse and operations teams, retail spaces, restaurants, medical offices, professional offices, and multi-site businesses",
      servicesIntro:
        "San Jose businesses vary widely by neighborhood and building type, so we support everything from office users and cloud platforms to warehouse Wi-Fi, cameras, POS networks, and failover planning.",
      industriesIntro:
        "For San Jose, we emphasize warehouses, retail, restaurants, medical offices, and professional teams because local technology needs can change dramatically from one site to the next.",
      industryOrder: ["warehouse", "retail", "restaurants", "medical", "professional", "multiSite"],
    },
    residential: {
      h1: "Home Wi-Fi, cameras, AV, and smart systems for San Jose homes.",
      intro:
        "Golden State Visions designs residential networks, camera systems, smart-home controls, Lutron lighting, and AV infrastructure for San Jose homes, remodels, townhomes, larger properties, outdoor spaces, and home offices.",
      propertyTypes:
        "Home offices, townhomes, remodels, larger lots, outdoor living areas, camera systems, media rooms, and lighting control",
      servicesIntro:
        "San Jose homes range from compact layouts to larger properties, so we tailor Wi-Fi, camera coverage, and smart-home support to the actual floor plan and outdoor spaces.",
    },
  },
};

export const localCities: LocalCity[] = baseLocalCities.map((city) => ({
  ...city,
  ...localCityProfiles[city.slug],
}));

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
