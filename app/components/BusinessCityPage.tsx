import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import type { BusinessIndustryKey, LocalCity } from "@/app/data/localSeo";
import { commercialCityStructuredData } from "@/app/data/structuredData";

const businessCitySocialImage =
  "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png";

export function businessCityMeta(city: LocalCity): Metadata {
  const title = `Commercial IT Support & Network Infrastructure | ${city.city}, ${city.state}`;
  const description = city.commercial.intro;
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
    <main id="top" className="gsv-page">
      <JsonLd data={commercialCityStructuredData(city)} />
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">Commercial IT Support • {city.city}, {city.state}</div>

            <h1>{city.commercial.h1}</h1>

            <p>{city.commercial.intro}</p>

            <div className="gsv-hero-actions">
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>

              <a className="gsv-btn gsv-btn-secondary" href="#business-services">
                View Services
              </a>
            </div>
          </div>

          <div className="gsv-hero-panel gsv-hero-capabilities">
            <div className="gsv-status-card gsv-capability-lead">
              <div className="gsv-status-label">Built for real-world business operations</div>
              <div className="gsv-status-value">Support, Security, WiFi, Cloud, and Infrastructure</div>
              <p>{city.commercial.servicesIntro}</p>
            </div>

            <div className="gsv-status-grid gsv-capability-grid">
              <div className="gsv-mini-stat gsv-capability-card">
                <span>Business Types</span>
                <strong>{city.commercial.businessTypes}</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Platforms</span>
                <strong>Microsoft 365, Google Workspace, email, users, and devices</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Infrastructure</span>
                <strong>Gateways, firewalls, switches, WiFi, cabling, and segmentation</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Security</span>
                <strong>Camera systems, access planning, monitoring, and vendor coordination</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="business-services" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Business IT Services</div>
            <h2>Practical technology support for businesses that depend on uptime.</h2>
            <p>{city.commercial.servicesIntro}</p>
          </div>

          <div className="gsv-card-grid">
            <div className="gsv-card">
              <div className="gsv-eyebrow">01</div>
              <h3>Managed IT & User Support</h3>
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
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">02</div>
              <h3>Network Infrastructure</h3>
              <p>
                Business-grade network design and deployment for offices, retail spaces,
                restaurants, medical suites, and multi-device environments.
              </p>
              <ul>
                <li><strong>Gateways and firewalls</strong> configured for security and reliability</li>
                <li><strong>Switches and WiFi</strong> designed for coverage and performance</li>
                <li><strong>Structured cabling</strong>, racks, patch panels, and cleanup</li>
                <li><strong>Network segmentation</strong> for staff, guest, POS, cameras, and devices</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">03</div>
              <h3>Security Cameras & Site Systems</h3>
              <p>
                Camera and network planning for businesses that need visibility, reliability,
                and clean system organization.
              </p>
              <ul>
                <li><strong>Camera system planning</strong> for entrances, registers, parking, and work areas</li>
                <li><strong>Network video infrastructure</strong> with proper switching and power planning</li>
                <li><strong>Remote access</strong> and user permission planning</li>
                <li><strong>Ongoing support</strong> for cameras, networking, and connected systems</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Industries We Support</div>
            <h2>Technology support for service businesses, offices, and operational teams.</h2>
            <p>{city.commercial.industriesIntro}</p>
          </div>

          <div className="gsv-feature-grid">
            {industryCards.map((card) => (
              <div key={card.key} className="gsv-feature">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Start Here</div>
              <h2>Need better IT support or a cleaner business network?</h2>
              <p>
                Schedule a consultation and we’ll review your current setup, identify
                immediate issues, and help map out the right next steps.
              </p>

              <div className="gsv-contact-meta">
                <span>📍 {servingLine}</span>
                <span>☎️ (916) 432-3373</span>
                <span>🕒 Mon – Fri: 8:00 AM – 6:00 PM</span>
              </div>
            </div>

            <div>
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
