import type { Metadata } from "next";
import Image from "next/image";
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

const localServiceImages: Record<
  string,
  { src: string; width: number; height: number; alt: string; className: string; wrapClassName: string }
> = {
  "managed-it": {
    src: "/assets/images/portfolio/managed-it-infrastructure-illustration-transparent-tight.png",
    width: 1460,
    height: 658,
    alt: "Managed IT infrastructure illustration showing cloud servers, security, support, automation, and always-on technology management by Golden State Visions",
    className: "gsv-managed-banner-image",
    wrapClassName: "gsv-managed-banner-image-wrap",
  },
  "networks-security-systems": {
    src: "/assets/images/portfolio/network-security-servers-transparent.png",
    width: 1643,
    height: 957,
    alt: "Golden network server corridor representing secure enterprise infrastructure and high-performance network systems",
    className: "gsv-network-banner-image gsv-network-banner-image-cropped",
    wrapClassName: "gsv-network-banner-image-wrap",
  },
  "smart-home-automation": {
    src: "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png",
    width: 1655,
    height: 797,
    alt: "Smart home automation circuit board illustration showing connected lighting, climate, security, audio, energy, and control systems",
    className: "gsv-smart-home-banner-image",
    wrapClassName: "gsv-smart-home-banner-image-wrap",
  },
  "audio-video-surveillance": {
    src: "/assets/images/portfolio/audio-video-surveillance-banner.png",
    width: 1847,
    height: 851,
    alt: "Audio video and surveillance smart home theater illustration with connected lighting, projection, speakers, control, and security systems",
    className: "gsv-av-banner-image",
    wrapClassName: "gsv-av-banner-image-wrap",
  },
};

function ServiceMenuHeader() {
  return (
    <header className="gsv-header">
      <Link href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
        <Image
          src="/images/gsv-logo.png"
          alt="Golden State Visions"
          width={1798}
          height={877}
          className="gsv-logo-img"
          priority
        />
      </Link>

      <nav className="gsv-nav gsv-nav-menu-only">
        <details className="gsv-services-menu">
          <summary>Menu</summary>

          <div className="gsv-services-mega">
            <div className="gsv-services-mega-inner">
              <div className="gsv-services-mega-head">
                <div className="gsv-services-mega-explore">
                  <span className="gsv-services-mega-label">Explore</span>

                  <div className="gsv-services-mega-toplinks">
                    <Link href="/#how-we-work">How We Work</Link>
                    <Link href="/#why-us">Why Choose Us</Link>
                    <Link href="/#contact">Contact</Link>
                  </div>
                </div>
              </div>

              <div className="gsv-services-mega-groups">
                <div className="gsv-services-mega-section">
                  <div className="gsv-services-mega-label">Business Solutions</div>

                  <div className="gsv-services-mega-grid">
                    <Link href="/services/managed-it" className="gsv-services-mega-card">
                      <span className="gsv-menu-icon gsv-menu-icon-managed" aria-hidden="true">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="#FFC72C"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="2" width="14" height="5" rx="1" />
                          <circle cx="5" cy="4.5" r="0.75" fill="#FFC72C" />
                          <circle cx="8" cy="4.5" r="0.75" fill="#FFC72C" />
                          <rect x="2" y="10" width="14" height="5" rx="1" />
                          <circle cx="5" cy="12.5" r="0.75" fill="#FFC72C" />
                          <circle cx="8" cy="12.5" r="0.75" fill="#FFC72C" />
                          <rect x="2" y="18" width="14" height="5" rx="1" />
                          <circle cx="5" cy="20.5" r="0.75" fill="#FFC72C" />
                          <circle cx="8" cy="20.5" r="0.75" fill="#FFC72C" />
                          <path d="M16 4.5h3v7h3" />
                          <path d="M16 20.5h3v-9" />
                          <circle cx="22" cy="11.5" r="1.5" />
                        </svg>
                      </span>
                      <span className="gsv-menu-title">Managed IT Services</span>
                    </Link>

                    <Link href="/services/networks-security-systems" className="gsv-services-mega-card">
                      <span className="gsv-menu-icon gsv-menu-icon-network-security" aria-hidden="true">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="#FFC72C"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <circle cx="12" cy="8" r="1.5" />
                          <circle cx="8" cy="13" r="1.5" />
                          <circle cx="16" cy="13" r="1.5" />
                          <path d="M12 9.5v5" />
                          <path d="M12 12l-2.5 1" />
                          <path d="M12 12l2.5 1" />
                        </svg>
                      </span>
                      <span className="gsv-menu-title">Networks & Security Systems</span>
                    </Link>
                  </div>
                </div>

                <div className="gsv-services-mega-section">
                  <div className="gsv-services-mega-label">Residential Solutions</div>

                  <div className="gsv-services-mega-grid">
                    <Link href="/services/smart-home-automation" className="gsv-services-mega-card">
                      <span className="gsv-menu-icon">🏠</span>
                      <span className="gsv-menu-title">Smart Home Automation</span>
                    </Link>

                    <Link href="/services/audio-video-surveillance" className="gsv-services-mega-card">
                      <span className="gsv-menu-icon gsv-menu-icon-av">🎥</span>
                      <span className="gsv-menu-title">Audio, Video & Surveillance</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="gsv-services-mega-footer">
                <Link href="/#services">View all services</Link>
                <Link href="/book-consult">Book a consult</Link>
              </div>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}

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

  const image = localServiceImages[service.slug] ?? localServiceImages["managed-it"];
  const title = `${service.seoTitle} | ${city.city}, ${city.state}`;
  const description = `${service.label} in ${city.city}, ${city.state}. ${service.intro} Serving ${city.region} and nearby Northern California communities.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}/${city.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/services/${service.slug}/${city.slug}`,
      siteName: "Golden State Visions",
      images: [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.src],
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

  const serviceAreaCities = localCities;
  const serviceImage = localServiceImages[service.slug];

  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <ServiceMenuHeader />

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

                {card.items?.length ? (
                  <ul>
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
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

          {serviceImage ? (
            <div className={serviceImage.wrapClassName}>
              <Image
                src={serviceImage.src}
                alt={serviceImage.alt}
                width={serviceImage.width}
                height={serviceImage.height}
                className={serviceImage.className}
                loading="lazy"
                unoptimized={service.slug === "audio-video-surveillance"}
              />
            </div>
          ) : null}
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
            {serviceAreaCities.map((serviceAreaCity) => (
              <li key={serviceAreaCity.slug}>
                <Link href={`/services/${service.slug}/${serviceAreaCity.slug}`}>
                  {serviceAreaCity.city}, {serviceAreaCity.state}
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
