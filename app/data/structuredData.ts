import { siteUrl } from "@/app/config/site";
import type { LocalCity } from "@/app/data/localSeo";
import { resourceFaqItems } from "@/app/data/resources";

type SchemaNode = Record<string, unknown>;

type ServiceSummary = {
  name: string;
  description: string;
  path: string;
  serviceType: string;
};

const companyName = "Golden State Visions";
const companyPhone = "+19164323373";
const companyEmail = "info@gsvisions.com";
const logoPath = "/assets/images/gsv-bridge-mark.png";
const defaultImagePath =
  "/assets/images/portfolio/network-services-infographic-even.png";
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

const coreServices: ServiceSummary[] = [
  {
    name: "Managed IT Services",
    description:
      "Managed IT support, cybersecurity, cloud administration, endpoint protection, backup, and compliance support for small and medium-sized businesses.",
    path: "/services/managed-it",
    serviceType: "Managed IT Services",
  },
  {
    name: "Networks & Security Systems",
    description:
      "Secure network infrastructure, Wi-Fi, switching, VLANs, firewalls, failover internet, cameras, and physical security systems.",
    path: "/services/networks-security-systems",
    serviceType: "Network Infrastructure and Security Systems",
  },
  {
    name: "Smart Home Automation",
    description:
      "Residential smart-home automation, home networking, Lutron lighting control, touchscreens, cameras, and long-term system support.",
    path: "/services/smart-home-automation",
    serviceType: "Smart Home Automation",
  },
  {
    name: "Audio, Video & Surveillance",
    description:
      "Audio, video, home theater, distributed audio, commercial AV, camera, and surveillance systems for homes and businesses.",
    path: "/services/audio-video-surveillance",
    serviceType: "Audio Video and Surveillance Systems",
  },
];

const serviceAreaCities = [
  "Lincoln",
  "Rocklin",
  "Roseville",
  "Granite Bay",
  "Folsom",
  "Auburn",
  "Truckee",
  "Tahoe",
  "Sugar Bowl",
  "Sunnyvale",
  "Mountain View",
  "Palo Alto",
  "Santa Clara",
  "Cupertino",
  "Los Altos",
  "San Jose",
];

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

function graph(nodes: SchemaNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

function areaServed() {
  return serviceAreaCities.map((city) => ({
    "@type": "City",
    name: `${city}, CA`,
  }));
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    addressLocality: "Lincoln",
    addressRegion: "CA",
    addressCountry: "US",
  };
}

function offerCatalog(name: string, services: ServiceSummary[]) {
  return {
    "@type": "OfferCatalog",
    name,
    itemListElement: services.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service.name,
        serviceType: service.serviceType,
        description: service.description,
        url: absoluteUrl(service.path),
      },
    })),
  };
}

function organizationNode(): SchemaNode {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": organizationId,
    name: companyName,
    url: siteUrl,
    telephone: companyPhone,
    email: companyEmail,
    image: absoluteUrl(defaultImagePath),
    logo: absoluteUrl(logoPath),
    address: postalAddress(),
    areaServed: areaServed(),
    priceRange: "$$",
    hasOfferCatalog: offerCatalog("Golden State Visions services", coreServices),
  };
}

function websiteNode(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: companyName,
    url: siteUrl,
    publisher: {
      "@id": organizationId,
    },
  };
}

function webpageNode({
  path,
  title,
  description,
  aboutId,
  imagePath = defaultImagePath,
}: {
  path: string;
  title: string;
  description: string;
  aboutId?: string;
  imagePath?: string;
}): SchemaNode {
  const url = absoluteUrl(path);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: {
      "@id": websiteId,
    },
    publisher: {
      "@id": organizationId,
    },
    ...(aboutId
      ? {
          about: {
            "@id": aboutId,
          },
        }
      : {}),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(imagePath),
    },
  };
}

function breadcrumbNode(items: { name: string; path: string }[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function serviceNode({
  id,
  name,
  description,
  path,
  serviceType,
  services,
  city,
}: {
  id: string;
  name: string;
  description: string;
  path: string;
  serviceType: string;
  services?: ServiceSummary[];
  city?: LocalCity;
}): SchemaNode {
  return {
    "@type": "Service",
    "@id": id,
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: {
      "@id": organizationId,
    },
    areaServed: city
      ? {
          "@type": "City",
          name: `${city.city}, ${city.state}`,
        }
      : areaServed(),
    ...(services
      ? {
          hasOfferCatalog: offerCatalog(`${name} services`, services),
        }
      : {}),
  };
}

function pageServiceSchema({
  path,
  title,
  description,
  serviceType,
  imagePath,
  services,
}: {
  path: string;
  title: string;
  description: string;
  serviceType: string;
  imagePath?: string;
  services?: ServiceSummary[];
}) {
  const serviceId = `${absoluteUrl(path)}#service`;

  return graph([
    webpageNode({
      path,
      title,
      description,
      aboutId: serviceId,
      imagePath,
    }),
    serviceNode({
      id: serviceId,
      name: title.replace(" | Golden State Visions", ""),
      description,
      path,
      serviceType,
      services,
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: title.replace(" | Golden State Visions", ""), path },
    ]),
  ]);
}

export function globalStructuredData() {
  return graph([organizationNode(), websiteNode()]);
}

export function homePageStructuredData() {
  const path = "/";
  const title = "Managed IT Services & Smart Home Automation | Golden State Visions";
  const description =
    "Golden State Visions delivers managed IT support, secure business networks, smart home automation, audio video systems, and surveillance solutions for businesses and homes in Northern California.";

  return graph([
    webpageNode({ path, title, description }),
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#primary-services`,
      name: "Golden State Visions primary services",
      itemListElement: coreServices.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.name,
        url: absoluteUrl(service.path),
      })),
    },
  ]);
}

export function servicesPageStructuredData() {
  const path = "/services";
  const title = "Services | Golden State Visions";
  const description =
    "Explore managed IT, cybersecurity, network infrastructure, smart home automation, and audio/video services from Golden State Visions.";
  const serviceId = `${absoluteUrl(path)}#service-catalog`;

  return graph([
    webpageNode({ path, title, description, aboutId: serviceId }),
    serviceNode({
      id: serviceId,
      name: "Golden State Visions Services",
      description,
      path,
      serviceType: "Managed IT, Networking, Smart Home Automation, and Audio Video Services",
      services: coreServices,
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Services", path },
    ]),
  ]);
}

export function aboutPageStructuredData() {
  const path = "/about";
  const title = "About Golden State Visions | Local IT & Smart Home Technology Team";
  const description =
    "Learn about Golden State Visions, a Lincoln, CA technology team providing managed IT, networks, smart home automation, audio/video, and surveillance support.";

  return graph([
    webpageNode({
      path,
      title,
      description,
      aboutId: organizationId,
      imagePath: logoPath,
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "About", path },
    ]),
  ]);
}

export function resourcesPageStructuredData() {
  const path = "/resources";
  const title = "Resources & FAQ | Golden State Visions";
  const description =
    "Answers about managed IT, cybersecurity, business networks, smart home automation, audio/video, cameras, service areas, and getting started with Golden State Visions.";

  return graph([
    webpageNode({
      path,
      title,
      description,
      aboutId: organizationId,
      imagePath: logoPath,
    }),
    {
      "@type": "FAQPage",
      "@id": `${absoluteUrl(path)}#faq`,
      url: absoluteUrl(path),
      name: "Golden State Visions Resources & FAQ",
      isPartOf: {
        "@id": websiteId,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntity: resourceFaqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Resources & FAQ", path },
    ]),
  ]);
}

export function managedItStructuredData() {
  return pageServiceSchema({
    path: "/services/managed-it",
    title: "Managed IT Services & Workspace Support | Golden State Visions",
    description:
      "Managed IT support, secure cloud workspaces, endpoint protection, backup, compliance support, and business infrastructure support for Northern California organizations.",
    serviceType: "Managed IT Services",
    imagePath:
      "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png",
    services: [
      {
        name: "Managed IT Services",
        description: "Remote and onsite support, monitoring, maintenance, and vendor coordination.",
        path: "/services/managed-it",
        serviceType: "Managed IT Services",
      },
      {
        name: "Endpoint Protection & Threat Detection",
        description: "Endpoint security controls, EDR planning, and threat detection support.",
        path: "/services/managed-it",
        serviceType: "Endpoint Security",
      },
      {
        name: "Backup & Disaster Recovery",
        description: "Backup planning, recovery support, and business continuity infrastructure.",
        path: "/services/managed-it",
        serviceType: "Backup and Disaster Recovery",
      },
      {
        name: "HIPAA & PCI Compliance Support",
        description: "Network segmentation, documentation, and support planning for regulated environments.",
        path: "/services/managed-it",
        serviceType: "Compliance Support",
      },
    ],
  });
}

export function networksSecurityStructuredData() {
  return pageServiceSchema({
    path: "/services/networks-security-systems",
    title: "Networks & Security Systems | Golden State Visions",
    description:
      "Structured cabling, secure business networks, Wi-Fi, firewalls, IP surveillance, failover internet, and access control systems for Northern California properties.",
    serviceType: "Network Infrastructure and Security Systems",
    imagePath: "/assets/images/portfolio/network-security-servers-transparent.png",
    services: [
      {
        name: "Switching and VLAN Design",
        description: "Switching, VLAN, PoE, rack, and port documentation planning.",
        path: "/services/networks-security-systems",
        serviceType: "Network Switching",
      },
      {
        name: "Business Wi-Fi",
        description: "Wi-Fi coverage planning, access point placement, and performance optimization.",
        path: "/services/networks-security-systems",
        serviceType: "Wireless Networking",
      },
      {
        name: "Security Systems",
        description: "Camera planning, recorder setup, remote access, and surveillance network segmentation.",
        path: "/services/networks-security-systems",
        serviceType: "Security Systems",
      },
      {
        name: "Failover Internet",
        description: "Failover connectivity planning for critical business systems.",
        path: "/services/networks-security-systems",
        serviceType: "Failover Internet",
      },
    ],
  });
}

export function smartHomeStructuredData() {
  return pageServiceSchema({
    path: "/services/smart-home-automation",
    title: "Smart Home Automation, Lighting & AV Systems | Golden State Visions",
    description:
      "Smart home automation, Lutron lighting control, whole-home networking, touchscreens, cameras, and residential technology support across Northern California.",
    serviceType: "Smart Home Automation",
    imagePath: "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png",
    services: [
      {
        name: "Home Networking",
        description: "Whole-home Wi-Fi, wired network design, device segmentation, and support readiness.",
        path: "/services/smart-home-automation",
        serviceType: "Home Networking",
      },
      {
        name: "Lighting Control",
        description: "Lutron HomeWorks lighting design, scene planning, keypad labeling, and programming.",
        path: "/services/smart-home-automation",
        serviceType: "Lighting Control",
      },
      {
        name: "Touchscreens",
        description: "Wall-mounted control interfaces, mobile access, and clean user handoff.",
        path: "/services/smart-home-automation",
        serviceType: "Control Interfaces",
      },
      {
        name: "Home Cameras",
        description: "Residential camera coverage, recorder planning, secure access, and support.",
        path: "/services/smart-home-automation",
        serviceType: "Home Security Cameras",
      },
    ],
  });
}

export function audioVideoStructuredData() {
  return pageServiceSchema({
    path: "/services/audio-video-surveillance",
    title: "Audio, Video & Surveillance Systems | Golden State Visions",
    description:
      "Whole-home audio, media rooms, home theater systems, commercial AV, surveillance, local NVR recording, and secure AV infrastructure across Northern California.",
    serviceType: "Audio Video and Surveillance Systems",
    imagePath: "/assets/images/portfolio/audio-video-surveillance-banner.png",
    services: [
      {
        name: "Home Theater",
        description: "Home theater design, media rooms, projector systems, displays, and controls.",
        path: "/services/audio-video-surveillance",
        serviceType: "Home Theater",
      },
      {
        name: "Distributed Audio",
        description: "Whole-home audio, outdoor audio, music zones, and everyday music control.",
        path: "/services/audio-video-surveillance",
        serviceType: "Distributed Audio",
      },
      {
        name: "Commercial AV",
        description: "Conference room AV, displays, microphones, speakers, and room controls.",
        path: "/services/audio-video-surveillance",
        serviceType: "Commercial AV",
      },
      {
        name: "Surveillance",
        description: "Camera systems, storage, remote access, and surveillance network planning.",
        path: "/services/audio-video-surveillance",
        serviceType: "Surveillance Systems",
      },
    ],
  });
}

export function locationHubStructuredData(city: LocalCity) {
  const path = `/locations/${city.slug}`;
  const title = `Managed IT, Networks, Smart Home & AV Services | ${city.city}, ${city.state}`;
  const description = `Golden State Visions provides managed IT, network infrastructure, smart home automation, audio/video, and surveillance services in ${city.city}, ${city.state} and the surrounding ${city.region} area.`;

  return graph([
    webpageNode({
      path,
      title,
      description,
      aboutId: organizationId,
    }),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl(path)}#location-services`,
      name: `Golden State Visions service pages for ${city.city}, ${city.state}`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: `Commercial IT Support in ${city.city}, ${city.state}`,
          url: absoluteUrl(`/commercial-it-support-${city.slug}`),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `Home Networking & Security Camera Systems in ${city.city}, ${city.state}`,
          url: absoluteUrl(`/home-network-security-${city.slug}`),
        },
      ],
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Locations", path },
    ]),
  ]);
}

export function commercialCityStructuredData(city: LocalCity) {
  const path = `/commercial-it-support-${city.slug}`;
  const title = `Commercial IT Support & Network Infrastructure | ${city.city}, ${city.state}`;
  const description = city.commercial.intro;
  const serviceId = `${absoluteUrl(path)}#service`;

  return graph([
    webpageNode({
      path,
      title,
      description,
      aboutId: serviceId,
      imagePath:
        "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png",
    }),
    serviceNode({
      id: serviceId,
      name: `Commercial IT Support in ${city.city}, ${city.state}`,
      description,
      path,
      serviceType: "Commercial IT Support and Network Infrastructure",
      city,
      services: [
        {
          name: "Managed IT & User Support",
          description:
            "User support, cloud administration, device setup, and vendor coordination.",
          path,
          serviceType: "Managed IT Services",
        },
        {
          name: "Network Infrastructure",
          description:
            "Gateways, firewalls, switches, Wi-Fi, cabling, and network segmentation.",
          path,
          serviceType: "Network Infrastructure",
        },
        {
          name: "Security Cameras & Site Systems",
          description:
            "Camera planning, remote access, network video infrastructure, and support.",
          path,
          serviceType: "Security Systems",
        },
      ],
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Locations", path: `/locations/${city.slug}` },
      { name: `Commercial IT Support in ${city.city}`, path },
    ]),
  ]);
}

export function residentialCityStructuredData(city: LocalCity) {
  const path = `/home-network-security-${city.slug}`;
  const title = `Home Networking & Security Camera Systems | ${city.city}, ${city.state}`;
  const description = city.residential.intro;
  const serviceId = `${absoluteUrl(path)}#service`;

  return graph([
    webpageNode({
      path,
      title,
      description,
      aboutId: serviceId,
      imagePath: "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png",
    }),
    serviceNode({
      id: serviceId,
      name: `Home Networking & Security Camera Systems in ${city.city}, ${city.state}`,
      description,
      path,
      serviceType: "Home Networking, Security Cameras, and Smart Home Systems",
      city,
      services: [
        {
          name: "Home Networking & Wi-Fi",
          description:
            "Whole-home Wi-Fi, switching, outdoor coverage, and device segmentation.",
          path,
          serviceType: "Home Networking",
        },
        {
          name: "Home Security Camera Systems",
          description:
            "Camera placement, PoE switching, recorder planning, and remote viewing.",
          path,
          serviceType: "Home Security Cameras",
        },
        {
          name: "Smart Home Integration",
          description:
            "Lutron HomeWorks, lighting control, scene planning, and connected-home coordination.",
          path,
          serviceType: "Smart Home Automation",
        },
      ],
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Locations", path: `/locations/${city.slug}` },
      { name: `Home Networking in ${city.city}`, path },
    ]),
  ]);
}
