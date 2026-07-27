import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import TechnologyPartnersSection from "@/app/components/TechnologyPartnersSection";
import { smartHomeStructuredData } from "@/app/data/structuredData";
import Link from "next/link";
import type { Metadata } from "next";
import ServiceExplorer from "../managed-it/ServiceExplorer";
import styles from "../managed-it/managed-it.module.css";

export const metadata: Metadata = {
  title: "Smart Home Automation, Lighting & AV | Golden State Visions",
  description:
    "Detailed smart home planning, Lutron lighting and shades, whole-home control, UniFi networking, audio, video, surveillance, and support for Northern California homes.",
  alternates: {
    canonical: "/smart-home-automation",
  },
  openGraph: {
    title: "Smart Home Automation, Lighting & AV | Golden State Visions",
    description:
      "A clear guide to smart home planning, Lutron lighting and shades, whole-home automation, networking, audio, video, surveillance, and ongoing support.",
    url: "/smart-home-automation",
    siteName: "Golden State Visions",
    type: "website",
    images: [
      {
        url: "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png",
        width: 1655,
        height: 797,
        alt: "Connected lighting, networking, automation, security, audio, and video systems designed by Golden State Visions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Home Automation, Lighting & AV | Golden State Visions",
    description:
      "Detailed smart home planning, Lutron lighting and shades, whole-home control, UniFi networking, audio, video, surveillance, and support.",
    images: [
      "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png",
    ],
  },
};

const homeAutomationServices = [
  {
    number: "01",
    category: "Planning & Design",
    title: "New Build & Remodel Planning",
    description:
      "Technology planning that begins before the walls close, so lighting, shades, networking, control, audio, video, and surveillance share one coordinated infrastructure.",
    items: [
      "Lutron HomeWorks lighting, Palladiom keypad, and scene planning",
      "Motorized shade wiring, pocket, power, and daylight coordination",
      "UniFi network, camera, equipment rack, and Wi-Fi design",
      "Control4, Savant, or Crestron control and AV coordination",
    ],
    bestFor:
      "New construction, major remodels, additions, and homeowners who want technology decisions documented before electrical and finish work begins.",
    platforms: [
      "Lutron HomeWorks",
      "Lutron Palladiom",
      "Lutron Shades",
      "UniFi",
      "Control4",
      "Savant",
      "Crestron",
    ],
    outcome:
      "A documented low-voltage and controls plan that gives every trade clear requirements and leaves the finished home easier to use and support.",
  },
  {
    number: "02",
    category: "Lighting & Shading",
    title: "Lighting Control & Motorized Shades",
    description:
      "Architectural lighting and daylight control designed around rooms, routines, entertaining, and the way the home feels throughout the day.",
    items: [
      "Lutron HomeWorks system design, programming, and scene development",
      "RadioRA 3 lighting control for appropriately sized projects",
      "Palladiom and custom keypad layout, engraving, and homeowner handoff",
      "Motorized shades and drapery coordinated with windows, finishes, and daylight",
    ],
    bestFor:
      "Homes where lighting quality, quiet shade movement, clean wall controls, and intuitive everyday scenes are central to the design.",
    platforms: [
      "Lutron HomeWorks",
      "RadioRA 3",
      "Palladiom",
      "Lutron Shades",
      "Drapery",
      "Daylight scenes",
    ],
    outcome:
      "Consistent scenes, quieter rooms, reduced wall clutter, and controls that remain understandable long after installation.",
  },
  {
    number: "03",
    category: "Automation & Control",
    title: "Whole-Home Control & Automation",
    description:
      "Lighting, climate, audio, video, cameras, access, and daily routines unified through a clear control experience instead of disconnected apps.",
    items: [
      "Control4, Savant, or Crestron programming and interface design",
      "Home Assistant deployment for advanced, local-first automation",
      "Apple Home, Google Home, and Alexa bridge coordination where appropriate",
      "Touchscreen, mobile, keypad, and voice-control scene development",
    ],
    bestFor:
      "Homes with several connected systems that need one predictable interface, documented logic, and a practical support path.",
    platforms: [
      "Control4",
      "Savant",
      "Crestron",
      "Home Assistant",
      "Apple Home",
      "Google Home",
      "Alexa",
    ],
    outcome:
      "A simpler daily experience with coordinated scenes, fewer app handoffs, and automation logic that can be maintained over time.",
  },
  {
    number: "04",
    category: "Network & Infrastructure",
    title: "Whole-Home Network & Surveillance",
    description:
      "A serviceable UniFi network built as the foundation for streaming, work, cameras, smart-home devices, guests, and remote support.",
    items: [
      "UniFi gateway, managed switching, access point, and coverage design",
      "Wired backhaul, PoE, equipment rack, and battery-backup planning",
      "Separate networks for cameras, smart devices, guests, and work systems",
      "UniFi Protect cameras, local recording, remote visibility, and access control",
    ],
    bestFor:
      "Connected homes that need reliable coverage, local camera storage, clean infrastructure, and visibility beyond consumer mesh Wi-Fi.",
    platforms: [
      "UniFi Network",
      "UniFi Protect",
      "UniFi Access",
      "Wi-Fi 6 & 7",
      "PoE",
      "VLANs",
      "Local NVR",
    ],
    outcome:
      "Reliable wired and wireless coverage, private local recording, and a documented network that is easier to monitor and expand.",
  },
  {
    number: "05",
    category: "Audio & Video",
    title: "Whole-Home Audio, Video & Media Rooms",
    description:
      "Distributed music, theaters, displays, and source equipment designed together so entertainment feels polished without becoming complicated.",
    items: [
      "Sonos or Russound audio with Sonance architectural speakers",
      "Marantz and AudioControl media room and home theater design",
      "Centralized source, display, matrix video, and equipment rack planning",
      "Lighting, audio, video, and control scenes coordinated for daily use",
    ],
    bestFor:
      "Homeowners planning architectural audio, dedicated media rooms, outdoor entertainment, or clean multi-room video distribution.",
    platforms: [
      "Sonos",
      "Russound",
      "Sonance",
      "Marantz",
      "AudioControl",
      "Control4",
      "Savant",
    ],
    outcome:
      "Clear sound, clean equipment placement, consistent control, and entertainment systems the household can use without instruction.",
  },
  {
    number: "06",
    category: "Assessment & Support",
    title: "Existing Smart Home Assessment & Support",
    description:
      "A practical review of the technology already in the home, preserving what works while documenting repairs, reprogramming, and phased upgrades.",
    items: [
      "Lutron lighting, keypad, processor, and motorized shade assessment",
      "Control4, Savant, Crestron, or Home Assistant troubleshooting",
      "UniFi network, camera, rack, and connected-device documentation",
      "Phased repair, reprogramming, lifecycle, and upgrade roadmap",
    ],
    bestFor:
      "Existing homes with inherited, unreliable, undocumented, or partially working systems that need a clear path forward.",
    platforms: [
      "Lutron",
      "Control4",
      "Savant",
      "Crestron",
      "Home Assistant",
      "UniFi",
      "Sonos",
    ],
    outcome:
      "A prioritized support plan that restores dependable daily use without replacing equipment that can still serve the home well.",
  },
] as const;

const residentialServiceRegions = [
  {
    number: "01",
    name: "Placer County & Greater Sacramento",
    description:
      "Smart home planning, lighting, networking, and onsite support for primary residences, remodels, and new construction.",
    locations: [
      ["Lincoln", "/home-network-security-lincoln-ca"],
      ["Roseville", "/home-network-security-roseville-ca"],
      ["Granite Bay", "/home-network-security-granite-bay-ca"],
      ["Folsom", "/home-network-security-folsom-ca"],
    ],
  },
  {
    number: "02",
    name: "Tahoe & Northern Sierra",
    description:
      "Connected-home design and scheduled onsite service for mountain properties, vacation homes, and remote residences.",
    locations: [
      ["Truckee", "/home-network-security-truckee-ca"],
      ["North Lake Tahoe", "/home-network-security-tahoe-ca"],
      ["South Lake Tahoe", "/home-network-security-south-lake-tahoe-ca"],
      ["Sugar Bowl", "/home-network-security-sugar-bowl-ca"],
    ],
  },
  {
    number: "03",
    name: "South Bay & Peninsula",
    description:
      "Residential automation, lighting, AV, and infrastructure support for discerning homeowners throughout Silicon Valley.",
    locations: [
      ["Palo Alto", "/home-network-security-palo-alto-ca"],
      ["Los Altos", "/home-network-security-los-altos-ca"],
      ["Cupertino", "/home-network-security-cupertino-ca"],
      ["San Jose", "/home-network-security-san-jose-ca"],
    ],
  },
] as const;

export default function SmartHomeAutomationPage() {
  return (
    <main id="top" className={`gsv-redesign-page ${styles.page}`}>
      <JsonLd data={smartHomeStructuredData()} />
      <SiteHeader />

      <section
        className={styles.detailSection}
        id="home-automation-details"
        aria-labelledby="home-automation-title"
      >
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Home Technology Services</p>
          <h1 id="home-automation-title">
            Lighting, automation, networking, and entertainment for connected
            homes.
          </h1>
          <p>
            Thoughtful planning, Lutron lighting and shades, whole-home
            control, UniFi infrastructure, audio, video, surveillance, and
            support, organized around one accountable partner.
          </p>
        </div>

        <ServiceExplorer services={homeAutomationServices} />
      </section>

      <TechnologyPartnersSection />

      <section
        className={styles.serviceArea}
        aria-labelledby="residential-service-area-title"
      >
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Local &amp; Onsite</p>
          <h2 id="residential-service-area-title">
            Smart home support across Northern California.
          </h2>
          <p>
            Design and remote support backed by scheduled onsite service
            throughout Placer County, Greater Sacramento, Tahoe, and the Bay
            Area.
          </p>
        </div>

        <div className={styles.serviceAreaGrid}>
          {residentialServiceRegions.map((region) => (
            <article className={styles.serviceRegion} key={region.name}>
              <span className={styles.cardNumber}>{region.number}</span>
              <h3>{region.name}</h3>
              <p>{region.description}</p>
              <div
                className={styles.locationLinks}
                aria-label={`${region.name} locations`}
              >
                {region.locations.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.serviceAreaFooter}>
          <p>
            Planning a project nearby? We&apos;ll confirm design and onsite
            availability during your consultation.
          </p>
          <a href="#site-service-areas">
            View all service areas <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p className={styles.eyebrow}>Next Step</p>
          <h2>We&apos;ll help map the right technology path.</h2>
          <p>
            Tell us what you are building, remodeling, repairing, or improving.
            We will review the fit and recommend the practical next step.
          </p>
        </div>

        <div className={styles.finalActions}>
          <Link href="/book-consult" className={styles.primaryButton}>
            Book a Consultation <span aria-hidden="true">→</span>
          </Link>
          <a href="tel:+19169090500" className={styles.secondaryButton}>
            (916) 909-0500
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
