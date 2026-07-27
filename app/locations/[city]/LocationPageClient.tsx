import Link from "next/link";
import AudiencePathButtons from "@/app/components/AudiencePathButtons";
import CityHomepageSections from "@/app/components/CityHomepageSections";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import type { LocalCity } from "@/app/data/localSeo";
import styles from "@/app/components/city-page.module.css";

export default function LocationPageClient({ city }: { city: LocalCity }) {
  const servingLine = `Serving ${city.city}, ${city.state} and the greater ${city.region} area`;

  return (
    <main id="top" className={`gsv-redesign-page ${styles.page}`}>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.darkEyebrow}>
            {city.city}, {city.state} · {city.region}
          </p>
          <h1>Technology support for {city.city} businesses and homes.</h1>
          <p>
            Local planning for workplaces, homes, network coverage, security, lighting,
            automation, and connected systems. One accountable team coordinates the
            environment.
          </p>
          <AudiencePathButtons targetId="service-paths" />
        </div>

        <aside className={styles.heroPanel}>
          <p className={styles.heroPanelLabel}>Local technology profile</p>
          <h2>Planning informed by how {city.city} properties actually operate.</h2>
          <ul>
            <li>Managed IT, cloud, endpoints, and business support</li>
            <li>Networks, Wi-Fi, cameras, cabling, and access control</li>
            <li>Smart-home lighting, automation, shades, and AV</li>
            <li>{servingLine}</li>
          </ul>
        </aside>
      </section>

      <CityHomepageSections city={city} />

      <section className={styles.finalCta}>
        <div>
          <p className={styles.sectionEyebrow}>Next Step</p>
          <h2>Plan a technology consultation for your {city.city} property.</h2>
          <p>
            We’ll review the site, current systems, coverage requirements, project goals,
            and whether remote or scheduled onsite service is the right fit.
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

      <SiteFooter locationPath={`/locations/${city.slug}`} />
    </main>
  );
}
