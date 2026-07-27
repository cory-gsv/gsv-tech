import Link from "next/link";
import type { Metadata } from "next";
import AudiencePathButtons from "@/app/components/AudiencePathButtons";
import JsonLd from "@/app/components/JsonLd";
import CityHomepageSections from "@/app/components/CityHomepageSections";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import type { LocalCity } from "@/app/data/localSeo";
import { residentialCityStructuredData } from "@/app/data/structuredData";
import styles from "./city-page.module.css";

const residentialCitySocialImage =
  "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png";

export function residentialCityMeta(city: LocalCity): Metadata {
  const title = `Home Wi-Fi & Security Cameras | ${city.city}, ${city.state}`;
  const description = `Home Wi-Fi, security cameras, smart home automation, lighting, and audio/video systems for homes and properties in ${city.city}, ${city.state} by Golden State Visions.`;
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
    <main id="top" className={`gsv-redesign-page ${styles.page}`}>
      <JsonLd data={residentialCityStructuredData(city)} />
      <SiteHeader />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.darkEyebrow}>
            Home Technology · {city.city}, {city.state}
          </p>
          <h1>{city.residential.h1}</h1>
          <p>{city.residential.intro}</p>
          <AudiencePathButtons
            defaultAudience="home"
            targetId="service-paths"
          />
        </div>

        <aside className={styles.heroPanel}>
          <p className={styles.heroPanelLabel}>One coordinated home technology team</p>
          <h2>Systems planned around the whole {city.city} property.</h2>
          <ul>
            <li>Whole-home and outdoor Wi-Fi coverage</li>
            <li>UniFi networking, cameras, and remote visibility</li>
            <li>Lutron HomeWorks, RadioRA 3, lighting, and shades</li>
            <li>Control4, audio/video, and long-term system support</li>
          </ul>
        </aside>
      </section>

      <CityHomepageSections city={city} defaultAudience="home" pageContext="home" />

      <section id="home-services" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Residential Technology Services</p>
          <h2>Coverage, security, lighting, and control designed together.</h2>
          <p>{city.residential.servicesIntro}</p>
        </div>

        <div className={styles.cardGrid}>
          <article className={styles.serviceCard}>
            <span className={styles.cardNumber}>01</span>
            <h3>Home Networking &amp; Wi-Fi</h3>
            <p>
              Reliable network design for large homes, multi-floor layouts, outdoor areas,
              offices, media rooms, and connected devices.
            </p>
            <ul>
              <li><strong>Whole-home Wi-Fi</strong> coverage planning and access point placement</li>
              <li><strong>UniFi gateways and switches</strong> sized for the property</li>
              <li><strong>Outdoor coverage</strong> for patios, shops, gates, and detached spaces</li>
              <li><strong>Network segmentation</strong> for smart home, guest, cameras, and work devices</li>
            </ul>
          </article>

          <article className={styles.serviceCard}>
            <span className={styles.cardNumber}>02</span>
            <h3>Home Security Camera Systems</h3>
            <p>
              Camera planning and network infrastructure for entrances, driveways, gates,
              yards, garages, shops, and detached buildings.
            </p>
            <ul>
              <li><strong>Camera placement</strong> for useful coverage, not wasted angles</li>
              <li><strong>PoE switching</strong> and power planning for reliable installs</li>
              <li><strong>Local recording</strong>, remote viewing, and user permissions</li>
              <li><strong>UniFi Protect</strong> coordination with the property network</li>
            </ul>
          </article>

          <article className={styles.serviceCard}>
            <span className={styles.cardNumber}>03</span>
            <h3>Lighting, Automation &amp; AV</h3>
            <p>
              Connected home systems designed around real usability, long-term support,
              and clean coordination between technologies.
            </p>
            <ul>
              <li><strong>Lutron HomeWorks and RadioRA 3</strong> design and integration</li>
              <li><strong>Lutron shades</strong>, scenes, keypads, and lighting control</li>
              <li><strong>Control4 and audio/video</strong> coordination across the home</li>
              <li><strong>Upgrade planning</strong> for existing homes, remodels, and new builds</li>
            </ul>
          </article>
        </div>

        <div className={styles.localBand}>
          <p>
            <strong>Local availability:</strong> {servingLine}. Projects are scoped around the
            home, existing infrastructure, ownership goals, and onsite requirements.
          </p>
          <Link href={`/locations/${city.slug}`}>View the {city.city} service overview →</Link>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Designed for the Property</p>
          <h2>Technology that fits how the home is built and used.</h2>
          <p>
            {city.city} projects are planned around the physical property, not a generic
            package or a pile of disconnected products.
          </p>
        </div>
        <div className={styles.profileGrid}>
          <article className={styles.featureCard}>
            <h3>Property profile</h3>
            <p>{city.residential.propertyTypes}.</p>
          </article>
          <article className={styles.featureCard}>
            <h3>Planning priorities</h3>
            <p>{city.residential.servicesIntro}</p>
          </article>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p className={styles.sectionEyebrow}>Next Step</p>
          <h2>Planning a home technology project in {city.city}?</h2>
          <p>
            Start with a consultation. We’ll review the layout, coverage requirements,
            current equipment, supported platforms, and the practical path forward.
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

      <SiteFooter locationPath={`/home-network-security-${city.slug}`} />
    </main>
  );
}
