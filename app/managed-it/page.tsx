import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import TechnologyPartnersSection from "@/app/components/TechnologyPartnersSection";
import {
  managedItStructuredData,
  networksSecurityStructuredData,
} from "@/app/data/structuredData";
import Link from "next/link";
import type { Metadata } from "next";
import ServiceExplorer from "./ServiceExplorer";
import styles from "./managed-it.module.css";

export const metadata: Metadata = {
  title: "Managed IT, Networks & Security | Golden State Visions",
  description:
    "Detailed managed IT, cloud, endpoint, continuity, network infrastructure, surveillance, wireless, and access control services for Northern California businesses.",
  alternates: {
    canonical: "/managed-it",
  },
  openGraph: {
    title: "Managed IT, Networks & Security | Golden State Visions",
    description:
      "A clear guide to managed IT, cloud administration, endpoint support, network infrastructure, surveillance, wireless, and access control services.",
    url: "/managed-it",
    siteName: "Golden State Visions",
    type: "website",
    images: [
      {
        url: "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png",
        width: 1460,
        height: 658,
        alt: "Managed IT, network, and security infrastructure supported by Golden State Visions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed IT, Networks & Security | Golden State Visions",
    description:
      "Detailed managed IT, cloud, endpoint, network, surveillance, wireless, and access control services.",
    images: [
      "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png",
    ],
  },
};

const managedItServices = [
  {
    number: "01",
    category: "Managed IT",
    title: "User & Endpoint Management",
    description:
      "Day-to-day proactive support for your employees, optimizing hardware performance, and securing user devices.",
    items: [
      "Proactive desktop and laptop monitoring, maintenance, and remote help desk support",
      "Streamlined user onboarding and offboarding directory configuration",
      "Automated cloud backups for individual client workstations and employee data protection",
      "Mobile device management (MDM) deployment to secure endpoints outside the office",
    ],
    bestFor:
      "Growing teams that need dependable day-to-day support, consistent device standards, and a documented onboarding process.",
    platforms: [
      "Windows & macOS",
      "Microsoft Entra ID",
      "Microsoft Intune",
      "NinjaOne",
      "Bitdefender",
      "SentinelOne",
    ],
    outcome:
      "Faster support, clearer device ownership, and a secure endpoint environment that is easier to maintain.",
  },
  {
    number: "02",
    category: "Managed IT",
    title: "Cloud Productivity & Identity",
    description:
      "Secure, business-grade digital workspaces engineered for seamless communication and absolute access control.",
    items: [
      "Microsoft 365 and Google Workspace tenant design, migration, and administration",
      "Centralized identity management, multi-factor authentication (MFA), and secure single sign-on",
      "Managed cloud storage layout, shared drive architecture, and permission governance",
      "Cloud-to-cloud backup architecture for email, shared drives, and collaboration data",
    ],
    bestFor:
      "Organizations that need one team to manage email, files, identities, permissions, and collaboration across the business.",
    platforms: [
      "Microsoft 365",
      "Google Workspace",
      "SharePoint",
      "OneDrive",
      "Google Drive",
      "MFA & SSO",
    ],
    outcome:
      "A cleaner digital workspace with controlled access, recoverable data, and fewer administrative gaps.",
  },
  {
    number: "03",
    category: "Managed IT",
    title: "Continuity & Infrastructure Support",
    description:
      "Active monitoring and technical oversight engineered to shield your critical data assets from operational vulnerabilities.",
    items: [
      "Security baseline deployment, advanced anti-malware, and endpoint threat detection",
      "Server infrastructure design, virtualization management, and active storage optimization",
      "Disaster recovery engineering, on-site server backups, and data restoration planning",
      "Continuous network health monitoring, compliance security audits, and lifecycle documentation",
    ],
    bestFor:
      "Businesses with critical data, local servers, compliance obligations, or limited tolerance for operational downtime.",
    platforms: [
      "NinjaOne",
      "Bitdefender",
      "Cloud backup",
      "NAS & servers",
      "Virtualization",
      "Recovery planning",
    ],
    outcome:
      "Better operational resilience, documented recovery paths, and fewer surprises when systems or vendors fail.",
  },
];

const networkSecurityServices = [
  {
    number: "04",
    category: "Networks & Security",
    title: "Structured Cabling & Architecture",
    description:
      "Clean, physical-layer engineering built for neat rack layouts, reliable data paths, and seamless hardware growth.",
    items: [
      "Cat6 and fiber optic structured cabling design and implementation",
      "Precision server rack builds, vertical patch management, and clean cable tracing",
      "Demarcation extensions, clean pathway planning, and physical device positioning",
      "Certified cable testing, path labeling, and lifecycle infrastructure documentation",
    ],
    bestFor:
      "New locations, remodels, expansions, or existing facilities with unreliable cabling and undocumented infrastructure.",
    platforms: [
      "Cat6 & fiber",
      "Patch panels",
      "Network racks",
      "Managed switching",
      "Cable testing",
      "Infrastructure maps",
    ],
    outcome:
      "A clean, labeled physical foundation that supports reliable systems and simplifies future troubleshooting.",
  },
  {
    number: "05",
    category: "Networks & Security",
    title: "Business Security & IP Surveillance",
    description:
      "High-performance security ecosystems built around local storage networks to protect your data privacy and eliminate cloud subscription fees.",
    items: [
      "High-definition IP security camera layout, clean mounting, and lens optimization",
      "Continuous network video recorder (NVR) installation and high-capacity storage setups",
      "AI-powered smart surveillance featuring vehicle recognition and instant perimeter alerts",
      "Secure remote viewing configurations for real-time monitoring across your phones and desktops",
      "HIPAA and PCI compliance support through segmentation, access controls, security baselines, and documentation",
    ],
    bestFor:
      "Medical offices, retail, hospitality, warehouses, and other environments that need local video retention and practical compliance support.",
    platforms: [
      "UniFi Protect",
      "IP cameras",
      "Local NVR storage",
      "Remote viewing",
      "HIPAA support",
      "PCI support",
    ],
    outcome:
      "Useful camera coverage, controlled access to recordings, and security architecture aligned with operational requirements.",
  },
  {
    number: "06",
    category: "Networks & Security",
    title: "Secure Wireless & Access Control",
    description:
      "Intelligent wireless coverage and electronic physical barriers designed to separate public access from your critical internal systems.",
    items: [
      "High-density business Wi-Fi deployment, predictive RF mapping, and wireless heatmaps",
      "Smart access control, keyless door entry setups, and video intercom implementation",
      "Network segmentation dividing internal operations, guest access, and smart devices",
      "Gateway deployment, hardware firewall provisioning, and active network threat mitigation",
    ],
    bestFor:
      "Physical locations where reliable coverage, guest access, payment systems, cameras, and secured doors must work together.",
    platforms: [
      "UniFi Network",
      "UniFi Access",
      "Wi-Fi 6 & 7",
      "VLAN segmentation",
      "Firewalls",
      "RF heatmaps",
    ],
    outcome:
      "Reliable wireless coverage with separated traffic, stronger perimeter controls, and clearer network visibility.",
  },
];

const businessTechnologyServices = [
  ...managedItServices,
  ...networkSecurityServices,
] as const;

const serviceRegions = [
  {
    number: "01",
    name: "Greater Sacramento & Foothills",
    description:
      "Onsite support for growing offices and multi-site businesses across Placer, Sacramento, and El Dorado counties.",
    locations: [
      ["Roseville", "/commercial-it-support-roseville-ca"],
      ["El Dorado Hills", "/commercial-it-support-el-dorado-hills-ca"],
      ["Folsom", "/commercial-it-support-folsom-ca"],
      ["Sacramento", "/commercial-it-support-sacramento-ca"],
    ],
  },
  {
    number: "02",
    name: "South Bay & Peninsula",
    description:
      "Managed technology and project support for Peninsula and South Bay businesses that need one accountable local partner.",
    locations: [
      ["San Jose", "/commercial-it-support-san-jose-ca"],
      ["Santa Clara", "/commercial-it-support-santa-clara-ca"],
      ["Cupertino", "/commercial-it-support-cupertino-ca"],
      ["Palo Alto", "/commercial-it-support-palo-alto-ca"],
    ],
  },
  {
    number: "03",
    name: "Tahoe & Northern Sierra",
    description:
      "Remote and scheduled onsite support for mountain businesses, hospitality environments, and second-location operations.",
    locations: [
      ["Truckee", "/commercial-it-support-truckee-ca"],
      ["North Lake Tahoe", "/commercial-it-support-tahoe-ca"],
      ["South Lake Tahoe", "/commercial-it-support-south-lake-tahoe-ca"],
      ["Sugar Bowl", "/commercial-it-support-sugar-bowl-ca"],
    ],
  },
] as const;

export default function ManagedITServicesPage() {
  return (
    <main id="top" className={`gsv-redesign-page ${styles.page}`}>
      <JsonLd data={managedItStructuredData()} />
      <JsonLd data={networksSecurityStructuredData()} />
      <SiteHeader />

      <section
        className={styles.detailSection}
        id="business-technology-details"
        aria-labelledby="business-technology-title"
      >
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Business Technology Services</p>
          <h1 id="business-technology-title">
            Managed IT, network, and security services for modern businesses.
          </h1>
          <p>
            Dependable support, cloud administration, proactive monitoring,
            business infrastructure, surveillance, wireless, and access
            control, organized around one accountable partner.
          </p>
        </div>

        <ServiceExplorer services={businessTechnologyServices} />
      </section>

      <TechnologyPartnersSection />

      <section
        className={styles.serviceArea}
        aria-labelledby="service-area-title"
      >
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Local &amp; Onsite</p>
          <h2 id="service-area-title">
            Managed IT support across Northern California.
          </h2>
          <p>
            Remote support backed by onsite service throughout Placer County,
            Greater Sacramento, the Bay Area, and nearby mountain communities.
          </p>
        </div>

        <div className={styles.serviceAreaGrid}>
          {serviceRegions.map((region) => (
            <article className={styles.serviceRegion} key={region.name}>
              <span className={styles.cardNumber}>{region.number}</span>
              <h3>{region.name}</h3>
              <p>{region.description}</p>
              <div
                className={styles.locationLinks}
                aria-label={`${region.name} locations`}
              >
                {region.locations.map(([label, href]) =>
                  href ? (
                    <Link href={href} key={href}>
                      {label}
                    </Link>
                  ) : (
                    <span key={label}>{label}</span>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.serviceAreaFooter}>
          <p>
            Need service somewhere nearby? We&apos;ll confirm onsite
            availability during your consultation.
          </p>
          <a href="#site-service-areas">
            View all service areas <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p className={styles.eyebrow}>Next Step</p>
          <h2>We&apos;ll help map the right service path.</h2>
          <p>
            Tell us what is happening, what needs to improve, or what you are
            planning. We will review the fit and recommend the practical next
            step.
          </p>
        </div>

        <div className={styles.finalActions}>
          <Link href="/book-consult" className={styles.primaryButton}>
            Book a Consultation <span aria-hidden="true">→</span>
          </Link>
          <a href="tel:+19169090500" className={styles.secondaryButton}>
            (916) 909-0500
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
