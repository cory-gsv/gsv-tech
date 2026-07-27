import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { resourceFaqItems, resourceGuideTopics } from "@/app/data/resources";
import { resourcesPageStructuredData } from "@/app/data/structuredData";
import Link from "next/link";
import type { Metadata } from "next";
import ServiceExplorer from "../managed-it/ServiceExplorer";
import detailStyles from "../managed-it/managed-it.module.css";
import ResourceFaqExplorer from "./ResourceFaqExplorer";

export const metadata: Metadata = {
  title: "Technology Resources & FAQ | Golden State Visions",
  description:
    "Practical planning guides and answers about managed IT, cybersecurity, HIPAA and PCI support, business networks, Lutron lighting and shades, smart home automation, audio/video, and surveillance.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Technology Resources & FAQ | Golden State Visions",
    description:
      "Planning guides and practical answers for managed business technology and connected homes.",
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
    title: "Technology Resources & FAQ | Golden State Visions",
    description:
      "Planning guides and practical answers for managed business technology and connected homes.",
    images: ["/assets/images/gsv-bridge-mark.png"],
  },
};

const resourceExplorerLabels = {
  bestFor: "When this helps",
  included: "What to review",
  platforms: "Related topics",
  outcome: "Planning takeaway",
  cta: "Ask about this topic",
};

export default function ResourcesPage() {
  return (
    <main
      id="top"
      className={`gsv-redesign-page ${detailStyles.page}`}
    >
      <JsonLd data={resourcesPageStructuredData()} />
      <SiteHeader />

      <section
        className={detailStyles.detailSection}
        aria-labelledby="technology-resources-title"
      >
        <div className={detailStyles.sectionHead}>
          <p className={detailStyles.eyebrow}>Technology Resources &amp; FAQ</p>
          <h1 id="technology-resources-title">
            Practical guidance for businesses and connected homes.
          </h1>
          <p>
            Use these planning guides to understand what to review, which
            questions to ask, and how managed IT, security, networking,
            lighting, automation, audio, video, and surveillance fit together.
          </p>
        </div>

        <ServiceExplorer
          services={resourceGuideTopics}
          labels={resourceExplorerLabels}
        />
      </section>

      <section
        className={detailStyles.detailSection}
        aria-labelledby="resource-faq-title"
      >
        <div className={detailStyles.sectionHead}>
          <p className={detailStyles.eyebrow}>Common Questions</p>
          <h2 id="resource-faq-title">
            Clear answers for planning, support, and upgrades.
          </h2>
          <p>
            These answers provide practical planning context. Requirements for
            security, compliance, construction, and system ownership vary by
            organization, property, vendor, and project.
          </p>
        </div>

        <ResourceFaqExplorer items={resourceFaqItems} />
      </section>

      <section className={detailStyles.finalCta} id="next-step">
        <div>
          <p className={detailStyles.eyebrow}>Next Step</p>
          <h2>We&apos;ll help turn the questions into a practical next step.</h2>
          <p>
            Tell us what you are supporting, building, repairing, or improving.
            We will review the fit and recommend the right service or planning
            path.
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
    </main>
  );
}
