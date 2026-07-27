import Link from "next/link";
import type { Metadata } from "next";
import AudiencePathButtons from "@/app/components/AudiencePathButtons";
import CityHeroTitle from "@/app/components/CityHeroTitle";
import JsonLd from "@/app/components/JsonLd";
import CityHomepageSections from "@/app/components/CityHomepageSections";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import type { BusinessIndustryKey, LocalCity } from "@/app/data/localSeo";
import { commercialCityStructuredData } from "@/app/data/structuredData";
import styles from "./city-page.module.css";

const businessCitySocialImage =
  "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png";

export function businessCityMeta(city: LocalCity): Metadata {
  const title = `Managed IT Services in ${city.city}, ${city.state} | Golden State Visions`;
  const description = `Local managed IT support, cybersecurity, business Wi-Fi, Microsoft 365, Google Workspace, and camera systems for ${city.city}, ${city.state} organizations.`;
  const path = `/commercial-it-support-${city.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Golden State Visions",
      type: "website",
      images: [
        {
          url: businessCitySocialImage,
          width: 1460,
          height: 658,
          alt: "Managed IT infrastructure illustration for Golden State Visions business technology support",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [businessCitySocialImage],
    },
  };
}

type BusinessIndustryCard = {
  key: BusinessIndustryKey;
  title: string;
  body: string;
};

const businessIndustryCards: BusinessIndustryCard[] = [
  {
    key: "restaurants",
    title: "Restaurants & Hospitality",
    body:
      "Support for guest WiFi, POS network segmentation to support PCI compliance, cameras, office computers, printers, internet failover planning, and vendor coordination.",
  },
  {
    key: "retail",
    title: "Retail & Showrooms",
    body:
      "Reliable WiFi, secure networks, camera visibility, workstation setup, payment-device segmentation to support PCI compliance, and clean equipment organization.",
  },
  {
    key: "medical",
    title: "Dental & Medical Offices",
    body:
      "Structured network support, secure access planning and network segmentation to support HIPAA compliance, workstation deployment, WiFi coverage, printer support, and technology coordination.",
  },
  {
    key: "professional",
    title: "Professional Offices",
    body:
      "Email, cloud platforms, document access, device support, conference-room connectivity, and dependable day-to-day IT management.",
  },
  {
    key: "warehouse",
    title: "Warehouses & Light Industrial",
    body:
      "WiFi coverage planning, cameras, network expansion, device connectivity, cabling, and support for operational systems.",
  },
  {
    key: "multiSite",
    title: "Multi-Site Businesses",
    body:
      "Secure site-to-site connectivity, standardized network design, remote access, device management, and consistent support across locations.",
  },
];

function getOrderedBusinessIndustryCards(order: BusinessIndustryKey[]) {
  const byKey = new Map(businessIndustryCards.map((card) => [card.key, card]));

  return order
    .map((key) => byKey.get(key))
    .filter((card): card is BusinessIndustryCard => Boolean(card));
}

export default function BusinessCityPage({ city }: { city: LocalCity }) {
  const servingLine = `Serving ${city.city}, ${city.state} and the greater ${city.region} area`;
  const industryCards = getOrderedBusinessIndustryCards(city.commercial.industryOrder);

  return (
    <main id="top" className={`gsv-redesign-page ${styles.page}`}>
      <JsonLd data={commercialCityStructuredData(city)} />
      <SiteHeader />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.darkEyebrow}>
            Managed IT Services · {city.city}, {city.state}
          </p>
          <CityHeroTitle title={city.commercial.h1} />
          <p>{city.commercial.intro}</p>
          <AudiencePathButtons
            defaultAudience="business"
            targetId="service-paths"
          />
        </div>

        <aside className={styles.heroPanel}>
          <p className={styles.heroPanelLabel}>One accountable local partner</p>
          <h2>Business technology planned around the way {city.city} teams work.</h2>
          <ul>
            <li>Remote and scheduled onsite support</li>
            <li>Microsoft 365, Google Workspace, users, and devices</li>
            <li>Networks, Wi-Fi, cabling, cameras, and access control</li>
            <li>HIPAA and PCI compliance support where applicable</li>
          </ul>
        </aside>
      </section>

      <CityHomepageSections
        city={city}
        defaultAudience="business"
        pageContext="business"
      />

      <section id="business-services" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Business Technology Services</p>
          <h2>Practical support for businesses that depend on uptime.</h2>
          <p>{city.commercial.servicesIntro}</p>
        </div>

        <div className={styles.cardGrid}>
          <article className={styles.serviceCard}>
            <span className={styles.cardNumber}>01</span>
            <h3>Managed IT &amp; User Support</h3>
            <p>
              Day-to-day support for users, workstations, email, cloud platforms, and
              business-critical systems.
            </p>
            <ul>
              <li><strong>Microsoft 365</strong> and Google Workspace administration</li>
              <li><strong>User onboarding</strong>, device setup, and email support</li>
              <li><strong>Remote and onsite support</strong> for common business issues</li>
              <li><strong>Vendor coordination</strong> for internet, phones, printers, and software</li>
            </ul>
          </article>

          <article className={styles.serviceCard}>
            <span className={styles.cardNumber}>02</span>
            <h3>Network Infrastructure</h3>
            <p>
              Business-grade network design and deployment for offices, retail spaces,
              restaurants, medical suites, and multi-device environments.
            </p>
            <ul>
              <li><strong>Gateways and firewalls</strong> configured for security and reliability</li>
              <li><strong>Switches and Wi-Fi</strong> designed for coverage and performance</li>
              <li><strong>Structured cabling</strong>, racks, patch panels, and cleanup</li>
              <li><strong>Network segmentation</strong> for staff, guest, POS, cameras, and devices</li>
            </ul>
          </article>

          <article className={styles.serviceCard}>
            <span className={styles.cardNumber}>03</span>
            <h3>Security Cameras &amp; Site Systems</h3>
            <p>
              Camera and network planning for businesses that need visibility, reliability,
              and clean system organization.
            </p>
            <ul>
              <li><strong>Camera planning</strong> for entrances, registers, parking, and work areas</li>
              <li><strong>Network video infrastructure</strong> with proper switching and power planning</li>
              <li><strong>Remote access</strong> and user permission planning</li>
              <li><strong>Compliance support</strong> through segmentation, controls, and documentation</li>
            </ul>
          </article>
        </div>

        <div className={styles.localBand}>
          <p>
            <strong>Local availability:</strong> {servingLine}. Remote support and scheduled
            onsite service are matched to the environment and project.
          </p>
          <Link href={`/locations/${city.slug}`}>View the {city.city} service overview →</Link>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Industries We Support</p>
          <h2>Built for offices, service businesses, and operational teams.</h2>
          <p>{city.commercial.industriesIntro}</p>
        </div>

        <div className={styles.featureGrid}>
          {industryCards.map((card) => (
            <article key={card.key} className={styles.featureCard}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p className={styles.sectionEyebrow}>Next Step</p>
          <h2>Need better IT support in {city.city}?</h2>
          <p>
            Start with a consultation. We’ll review the site, current systems, immediate
            issues, and the practical path forward.
          </p>
        </div>
        <div className={styles.finalActions}>
          <Link href="/book-consult" className={styles.primaryButton}>
            Book a Consultation →
          </Link>
          <a href="tel:+19169090500" className={styles.secondaryButton}>
            (916) 909-0500
          </a>
        </div>
      </section>

      <SiteFooter locationPath={`/commercial-it-support-${city.slug}`} />
    </main>
  );
}
