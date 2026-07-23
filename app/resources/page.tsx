import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "../components/JsonLd";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { resourceFaqItems, resourceGuideCards } from "../data/resources";
import { resourcesPageStructuredData } from "../data/structuredData";

export const metadata: Metadata = {
  title: "Resources & FAQ | Golden State Visions",
  description:
    "Answers about managed IT, cybersecurity, business networks, smart home automation, audio/video, cameras, service areas, and getting started with Golden State Visions.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Resources & FAQ | Golden State Visions",
    description:
      "Answers about managed IT, cybersecurity, business networks, smart home automation, audio/video, cameras, service areas, and getting started.",
    url: "/resources",
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
    title: "Resources & FAQ | Golden State Visions",
    description:
      "Answers about managed IT, cybersecurity, business networks, smart home automation, audio/video, cameras, service areas, and getting started.",
    images: ["/assets/images/gsv-bridge-mark.png"],
  },
};

export default function ResourcesPage() {
  return (
    <main className="gsv-page">
      <JsonLd data={resourcesPageStructuredData()} />
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-section gsv-page-hero-section">
          <div className="gsv-section-head">
            <p className="gsv-eyebrow">Resources & FAQ</p>
            <h1>Answers before the first call.</h1>
            <p>
              Use these notes to understand what Golden State Visions supports,
              what to ask before a technology project, and when it makes sense
              to book a consultation.
            </p>
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-resource-grid">
            {resourceGuideCards.map((card) => (
              <article className="gsv-card gsv-resource-card" key={card.title}>
                <p className="gsv-card-eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-section-head">
            <p className="gsv-eyebrow">Common Questions</p>
            <h2>Practical answers for businesses and homes.</h2>
            <p>
              These are general planning notes, not legal or compliance advice.
              Specific requirements depend on the systems, vendors, and
              ownership model involved.
            </p>
          </div>

          <div className="gsv-faq-list">
            {resourceFaqItems.map((item) => (
              <details className="gsv-faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="gsv-section gsv-page-cta">
          <div>
            <p className="gsv-eyebrow">Getting Started</p>
            <h2>Need a project-specific answer?</h2>
            <p>
              Book a consultation and Golden State Visions can review your
              location, devices, services, and next step.
            </p>
          </div>
          <Link href="/book-consult" className="gsv-button gsv-button-primary">
            Book a Consult
          </Link>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
