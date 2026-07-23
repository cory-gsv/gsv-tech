import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import type { LocalCity } from "@/app/data/localSeo";
import { residentialCityStructuredData } from "@/app/data/structuredData";

const residentialCitySocialImage =
  "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png";

export function residentialCityMeta(city: LocalCity): Metadata {
  const title = `Home Networking & Security Camera Systems | ${city.city}, ${city.state}`;
  const description = city.residential.intro;
  const path = `/home-network-security-${city.slug}`;

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
          url: residentialCitySocialImage,
          width: 1655,
          height: 797,
          alt: "Smart home automation illustration for Golden State Visions residential technology systems",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [residentialCitySocialImage],
    },
  };
}

export default function ResidentialCityPage({ city }: { city: LocalCity }) {
  const servingLine = `Serving ${city.city}, ${city.state} and the greater ${city.region} area`;

  return (
    <main id="top" className="gsv-page">
      <JsonLd data={residentialCityStructuredData(city)} />
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">Home Networking • Security Cameras • Smart Systems</div>

            <h1>{city.residential.h1}</h1>

            <p>{city.residential.intro}</p>

            <div className="gsv-hero-actions">
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>

              <a className="gsv-btn gsv-btn-secondary" href="#home-services">
                View Services
              </a>
            </div>
          </div>

          <div className="gsv-hero-panel gsv-hero-capabilities">
            <div className="gsv-status-card gsv-capability-lead">
              <div className="gsv-status-label">Residential Technology</div>
              <div className="gsv-status-value">WiFi, Cameras, Smart Home, and Network Design</div>
              <p>{city.residential.servicesIntro}</p>
            </div>

            <div className="gsv-status-grid gsv-capability-grid">
              <div className="gsv-mini-stat gsv-capability-card">
                <span>Networking</span>
                <strong>{city.residential.propertyTypes}</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Security</span>
                <strong>Home camera systems, remote access, and monitoring design</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Smart Home</span>
                <strong>Lutron HomeWorks, lighting control, and connected systems</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Support</span>
                <strong>Long-term support, upgrades, troubleshooting, and planning</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="home-services" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Residential Services</div>
            <h2>Home technology systems designed for coverage, security, and simplicity.</h2>
            <p>{city.residential.servicesIntro}</p>
          </div>

          <div className="gsv-card-grid">
            <div className="gsv-card">
              <div className="gsv-eyebrow">01</div>
              <h3>Home Networking & WiFi</h3>
              <p>
                Reliable network design for large homes, multi-floor layouts, outdoor areas,
                offices, media rooms, and connected devices.
              </p>
              <ul>
                <li><strong>Whole-home WiFi</strong> coverage planning and access point placement</li>
                <li><strong>Network gateways and switches</strong> sized for performance</li>
                <li><strong>Outdoor coverage</strong> for patios, shops, gates, and detached spaces</li>
                <li><strong>Device segmentation</strong> for smart home, guest, cameras, and work devices</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">02</div>
              <h3>Home Security Camera Systems</h3>
              <p>
                Camera planning and network infrastructure for entrances, driveways,
                gates, yards, garages, shops, and detached buildings.
              </p>
              <ul>
                <li><strong>Camera placement</strong> for useful coverage, not wasted angles</li>
                <li><strong>PoE switching</strong> and power planning for reliable installs</li>
                <li><strong>Remote viewing</strong> and user access planning</li>
                <li><strong>Network video systems</strong> designed around your home layout</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">03</div>
              <h3>Smart Home Integration</h3>
              <p>
                Connected home systems that are designed around real usability, long-term
                support, and clean coordination between technologies.
              </p>
              <ul>
                <li><strong>Lutron HomeWorks</strong> system design and integration</li>
                <li><strong>Lighting control</strong>, scenes, and keypad planning</li>
                <li><strong>Smart home coordination</strong> with networks, cameras, and connected systems</li>
                <li><strong>Upgrade planning</strong> for existing homes and new projects</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Start Here</div>
              <h2>Need better home WiFi, cameras, or smart home planning?</h2>
              <p>
                Schedule a consultation and we’ll help review your layout, coverage needs,
                current equipment, and the right path forward.
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
