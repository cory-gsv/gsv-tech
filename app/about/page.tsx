import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "../components/JsonLd";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { aboutPageStructuredData } from "../data/structuredData";

export const metadata: Metadata = {
  title: "About Golden State Visions | Local IT & Smart Home Technology Team",
  description:
    "Learn about Golden State Visions, a Lincoln, CA technology team providing managed IT, networks, smart home automation, audio/video, and surveillance support.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Golden State Visions | Local IT & Smart Home Technology Team",
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
    title: "About Golden State Visions | Local IT & Smart Home Technology Team",
    description:
      "A local technology team serving Northern California businesses and homes with practical IT, networking, automation, audio/video, and camera support.",
    images: ["/assets/images/gsv-bridge-mark.png"],
  },
};

const expectationCards = [
  {
    title: "One accountable team",
    body:
      "Support, projects, vendors, and planning stay connected through one team that understands the environment.",
  },
  {
    title: "Built for physical locations",
    body:
      "Networks, cameras, phones, displays, access points, and smart systems are planned around the rooms people actually use.",
  },
  {
    title: "Practical long term support",
    body:
      "The goal is not a flashy install. It is a system that remains documented, serviceable, and easy to own.",
  },
];

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

export default function AboutPage() {
  return (
    <main className="gsv-page">
      <JsonLd data={aboutPageStructuredData()} />
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-section gsv-page-hero-section">
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

        <section className="gsv-section">
          <div className="gsv-card-grid">
            {expectationCards.map((card) => (
              <article className="gsv-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-section-head">
            <p className="gsv-eyebrow">How We Work</p>
            <h2>Support that starts with how the space actually runs.</h2>
            <p>
              We work across managed IT, cybersecurity, networking, automation,
              audio/video, and camera systems so clients have fewer handoffs and
              clearer ownership.
            </p>
          </div>

          <div className="gsv-card-grid gsv-about-trust-grid">
            {trustCards.map((card) => (
              <article className="gsv-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gsv-section gsv-page-cta">
          <div>
            <p className="gsv-eyebrow">Next Step</p>
            <h2>Want to see if Golden State Visions is a fit?</h2>
            <p>
              Book a consultation and we will review your business, home,
              current systems, and the practical next step.
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
