import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/app/components/SiteFooter";
import {
  getLocalCity,
  getLocalService,
  localCities,
  localServices,
} from "@/app/data/localSeo";

type LocalServicePageProps = {
  params: Promise<{
    service: string;
    city: string;
  }>;
};

export function generateStaticParams() {
  return localServices.flatMap((service) =>
    localCities.map((city) => ({
      service: service.slug,
      city: city.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: LocalServicePageProps): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getLocalService(serviceSlug);
  const city = getLocalCity(citySlug);

  if (!service || !city) return {};

  return {
    title: `${service.seoTitle} | ${city.city}, ${city.state}`,
    description: `${service.label} in ${city.city}, ${city.state}. ${service.intro} Serving ${city.region} and nearby Northern California communities.`,
    alternates: {
      canonical: `/services/${service.slug}/${city.slug}`,
    },
  };
}

export default async function LocalServicePage({
  params,
}: LocalServicePageProps) {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getLocalService(serviceSlug);
  const city = getLocalCity(citySlug);

  if (!service || !city) notFound();

  const nearbyCities = localCities.filter((item) => item.slug !== city.slug).slice(0, 8);

  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <header className="gsv-header">
          <Link href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
            <img src="/images/gsv-logo.png" alt="Golden State Visions" className="gsv-logo-img" />
          </Link>
        </header>

        <section className="gsv-section gsv-local-service-hero">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">{service.label}</div>

            <h1>
              {service.h1} in {city.city}, {city.state}.
            </h1>

            <p>
              {service.intro} We support clients in {city.city}, {city.region}, and nearby
              Northern California communities with clean planning, reliable implementation,
              and long-term support.
            </p>
          </div>

          <div className="gsv-card-grid">
            {service.cards.map((card) => (
              <div className="gsv-card" key={card.title}>
                <div className="gsv-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gsv-local-banner gsv-managed-it-banner">
          <div>
            <div className="gsv-eyebrow">{service.bannerEyebrow}</div>
            <h2>{service.bannerTitle}</h2>
          </div>

          <p>
            {service.bannerBody} For clients in {city.city}, {city.state}, we focus on
            clean execution, documented systems, responsive communication, and practical
            support after installation.
          </p>
        </section>

        <section className="gsv-section gsv-managed-service-area-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Local Service Area</div>
            <h2>
              Supporting {service.label.toLowerCase()} projects in {city.city} and across {city.region}.
            </h2>
            <p>
              Golden State Visions is based in Lincoln, CA and supports clients across
              Lincoln, Rocklin, Roseville, Granite Bay, Folsom, Auburn, Truckee, Tahoe,
              Sugar Bowl, Sunnyvale, Mountain View, Palo Alto, Santa Clara, Cupertino,
              Los Altos, San Jose, and surrounding areas.
            </p>
          </div>

          <ul className="gsv-area-grid gsv-managed-area-grid">
            {nearbyCities.map((nearbyCity) => (
              <li key={nearbyCity.slug}>
                <Link href={`/services/${service.slug}/${nearbyCity.slug}`}>
                  {nearbyCity.city}, {nearbyCity.state}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="gsv-section gsv-managed-next-step-section">
          <div className="gsv-managed-next-step-card">
            <div className="gsv-managed-next-step-copy">
              <div className="gsv-eyebrow">Next Step</div>
              <h2>{service.ctaTitle}</h2>
              <p>{service.ctaBody}</p>

              <div className="gsv-managed-next-step-utility">
                <span><strong>Hours:</strong> Mon – Fri: 8:00 AM – 6:00 PM</span>
                <span><strong>Call:</strong> (916) 432-3373</span>
              </div>
            </div>

            <div className="gsv-managed-next-step-action">
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
