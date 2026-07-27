import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "../components/JsonLd";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import conceptStyles from "../concept/concept.module.css";
import { aboutPageStructuredData } from "../data/structuredData";
import detailStyles from "../managed-it/managed-it.module.css";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Golden State Visions | IT & Smart Home Team",
  description:
    "Meet Golden State Visions, a Northern California team providing managed IT, secure networks, smart home automation, audio/video, and surveillance.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Golden State Visions | IT & Smart Home Team",
    description:
      "A local technology team serving Northern California businesses and homes with practical IT, networking, automation, audio/video, and camera support.",
    url: "/about",
    siteName: "Golden State Visions",
    images: [
      {
        url: "/assets/images/gsv-bridge-mark.png",
        width: 1200,
        height: 630,
        alt: "Golden State Visions bridge logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Golden State Visions | IT & Smart Home Team",
    description:
      "A local technology team serving Northern California businesses and homes with practical IT, networking, automation, audio/video, and camera support.",
    images: ["/assets/images/gsv-bridge-mark.png"],
  },
};

const trustCards = [
  {
    title: "Based in Lincoln, CA",
    body:
      "Golden State Visions supports businesses and homeowners across Placer County, the Sacramento region, Tahoe-area communities, and the Bay Area.",
  },
  {
    title: "Business and residential fluency",
    body:
      "The same team can support office IT, secure networks, smart homes, audio/video systems, and camera infrastructure.",
  },
  {
    title: "Vendor coordination",
    body:
      "We help coordinate internet providers, cloud platforms, software vendors, security tools, and technology hardware.",
  },
  {
    title: "Privacy-minded service",
    body:
      "Client systems, accounts, devices, and data are handled with clear access control, documentation, and practical security habits.",
  },
];

const certifications = [
  {
    issuer: "Lutron",
    name: "HomeWorks Certified",
    detail: "Dealer / Installer",
  },
  {
    issuer: "Lutron",
    name: "RadioRA 3 Certified",
  },
  {
    issuer: "Lutron",
    name: "Shading Solutions Certified",
  },
  {
    issuer: "Microsoft",
    name: "Microsoft 365",
    detail: "Administrator Expert",
  },
  {
    issuer: "Google",
    name: "Associate Google Workspace",
    detail: "Administrator",
  },
  {
    issuer: "Control4",
    name: "Automation Programmer",
    detail: "Authorized Integrator",
  },
  {
    issuer: "Ubiquiti",
    name: "UWA · URSCA · UFSP",
    detail: "UniFi Academy Credentials",
  },
  {
    issuer: "Cisco",
    name: "CCNA",
    detail: "Certified Network Associate",
  },
];

export default function AboutPage() {
  return (
    <main
      className={`gsv-page ${detailStyles.page} ${conceptStyles.page} ${styles.page}`}
    >
      <JsonLd data={aboutPageStructuredData()} />
      <div className="gsv-shell">
        <SiteHeader />

        <section
          className={`gsv-section gsv-page-hero-section ${styles.intro}`}
        >
          <div className="gsv-section-head">
            <p className="gsv-eyebrow">About Golden State Visions</p>
            <h1>Local technology support with one accountable team.</h1>
            <p>
              Golden State Visions is a Lincoln, CA technology company serving
              businesses and homeowners that need practical support, reliable
              infrastructure, and systems that remain usable after the install
              is complete.
            </p>
          </div>
        </section>

        <section
          className={`${conceptStyles.whySection} ${styles.whySection}`}
          id="why-us"
        >
          <div className={conceptStyles.whyIntro}>
            <p className={conceptStyles.eyebrow}>Why Golden State Visions</p>
            <h2>
              One partner for support, infrastructure, automation, and
              technology procurement.
            </h2>
            <p>
              Golden State Visions is built on more than 18 years of hands-on IT
              and infrastructure experience, including over a decade supporting
              one of the world&apos;s top 10 technology companies. That
              experience includes leading infrastructure operations and
              delivering the technology required to open hundreds of service
              centers, showrooms, warehouses, and major manufacturing facilities
              worldwide. Today, Golden State Visions brings that same level of
              planning, documentation, security, and operational discipline to
              local businesses and residential technology projects.
            </p>
          </div>

          <div className={conceptStyles.whyGrid}>
            <article>
              <span>01</span>
              <h3>Business-first mindset</h3>
              <p>
                We help businesses stay productive with{" "}
                <strong>reliable systems</strong>,{" "}
                <strong>practical support</strong>, and{" "}
                <strong>thoughtful long term planning</strong>.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Built for physical locations</h3>
              <p>
                Networks, cameras, Wi-Fi, workstations, displays, and smart
                systems are planned around{" "}
                <strong>the real rooms they live in</strong>, with{" "}
                <strong>onsite details handled</strong> before they become
                support issues.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Scalable client experience</h3>
              <p>
                Our client portal supports{" "}
                <strong>billing and account access</strong> today, with a
                roadmap for <strong>service tracking</strong>,{" "}
                <strong>appointments</strong>,{" "}
                <strong>system visibility</strong>, and{" "}
                <strong>account management</strong>.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Microsoft &amp; Google platforms</h3>
              <p>
                Support for <strong>Microsoft 365</strong>,{" "}
                <strong>Google Workspace</strong>, <strong>email</strong>,
                identity, licensing, administration, and ongoing platform
                management.
              </p>
            </article>
            <article>
              <span>05</span>
              <h3>Business technology procurement</h3>
              <p>
                Access to <strong>business hardware</strong>,{" "}
                <strong>networking equipment</strong>,{" "}
                <strong>workstations</strong>, servers, software licensing, and
                infrastructure products through established technology
                channels.
              </p>
            </article>
            <article>
              <span>06</span>
              <h3>Planning through support</h3>
              <p>
                Help with <strong>product selection</strong>,{" "}
                <strong>implementation planning</strong>, renewals, upgrades,
                lifecycle management, and vendor coordination.
              </p>
            </article>
          </div>

          <div className={conceptStyles.certificationRail}>
            <div className={conceptStyles.certificationIntro}>
              <span>Verified expertise</span>
              <h3>Certified for the systems behind the project.</h3>
              <p>
                Platform-specific training from design through long-term
                support.
              </p>
            </div>

            <div
              className={conceptStyles.certificationList}
              aria-label="Golden State Visions professional certifications"
            >
              {certifications.map((certification) => (
                <div
                  className={conceptStyles.certificationItem}
                  key={`${certification.issuer}-${certification.name}`}
                >
                  <span
                    className={conceptStyles.certificationSeal}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8.2 12.2 2.4 2.4 5.4-5.5" />
                    </svg>
                  </span>
                  <span className={conceptStyles.certificationCopy}>
                    <small>{certification.issuer}</small>
                    <strong>{certification.name}</strong>
                    {certification.detail ? (
                      <span>{certification.detail}</span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`gsv-section ${styles.howWeWork}`}>
          <div className="gsv-section-head">
            <p className="gsv-eyebrow">How We Work</p>
            <h2>Support that starts with how the space actually runs.</h2>
            <p>
              We work across managed IT, cybersecurity, networking, automation,
              audio/video, and camera systems so clients have fewer handoffs and
              clearer ownership.
            </p>
          </div>

          <div className={`gsv-card-grid ${styles.trustGrid}`}>
            {trustCards.map((card) => (
              <article className="gsv-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={`${detailStyles.finalCta} ${styles.nextStep}`}
          id="next-step"
        >
          <div>
            <p className={detailStyles.eyebrow}>Next Step</p>
            <h2>Want to see if Golden State Visions is a fit?</h2>
            <p>
              Book a consultation and we will review your business, home,
              current systems, and the practical next step.
            </p>
          </div>

          <div className={detailStyles.finalActions}>
            <Link
              href="/book-consult"
              className={detailStyles.primaryButton}
            >
              Book a Consultation <span aria-hidden="true">→</span>
            </Link>
            <a
              href="tel:+19169090500"
              className={detailStyles.secondaryButton}
            >
              (916) 909-0500
            </a>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
