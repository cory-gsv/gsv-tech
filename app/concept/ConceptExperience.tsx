"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AudiencePathButtons from "@/app/components/AudiencePathButtons";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import TechnologyPartnersSection from "@/app/components/TechnologyPartnersSection";
import WhyGoldenStateVisionsSection from "@/app/components/WhyGoldenStateVisionsSection";
import styles from "./concept.module.css";

type Audience = "business" | "home";
const FLAP_CHARS = "0123456789/%Kmin.d";
const TAB_ROTATION_MS = 10_000;

type ProfileIcon =
  | "office"
  | "warehouse"
  | "medical"
  | "restaurant"
  | "retail"
  | "support"
  | "location"
  | "security"
  | "remodel"
  | "wifi"
  | "automation";

type ServiceProfile = {
  key: string;
  label: string;
  icon: ProfileIcon;
  title: string;
  body: string;
  features: string[];
  stats: { value: string; label: string }[];
  href: string;
  cta: string;
  foot?: string;
};

const serviceProfiles: Record<Audience, ServiceProfile[]> = {
  business: [
    {
      key: "offices",
      label: "Professional Offices",
      icon: "office",
      title: "IT that runs quietly in the background.",
      body:
        "Managed support, secure networking, and Microsoft 365 or Google Workspace administration handled end to end, so your team calls one number instead of three vendors.",
      features: [
        "Unlimited remote helpdesk for the whole team",
        "Microsoft 365 and Google Workspace setup and administration",
        "Secure office networking and firewall management",
        "Hardware procurement, deployment, and lifecycle planning",
      ],
      stats: [
        { value: "32", label: "Workstations managed" },
        { value: "5", label: "Tickets resolved today" },
        { value: "34", label: "Endpoints protected" },
        { value: "12 min", label: "Avg. first response" },
      ],
      href: "/managed-it",
      cta: "Explore Managed IT Services",
      foot:
        "Example snapshot for a professional office, shown for planning context.",
    },
    {
      key: "warehouses",
      label: "Warehouses & Fulfillment",
      icon: "warehouse",
      title: "Coverage for scanners, docks, cameras, and inventory stations.",
      body:
        "Warehouse networks need to handle long aisles, handheld scanners, loading docks, cameras, shipping stations, and office workstations without leaving dead zones or mystery devices behind.",
      features: [
        "Warehouse Wi-Fi planning for aisles, racks, and dock doors",
        "Scanner, printer, workstation, and camera network segmentation",
        "Shipping station support for label printers and inventory systems",
        "Coverage planning for cameras, yard areas, and access points",
      ],
      stats: [
        { value: "14", label: "Access points online" },
        { value: "42", label: "Scanners and printers" },
        { value: "12", label: "Dock cameras watched" },
        { value: "15 min", label: "Avg. first response" },
      ],
      href: "/managed-it",
      cta: "Explore Managed IT Services",
      foot:
        "Example snapshot for a warehouse and fulfillment environment, shown for planning context.",
    },
    {
      key: "medical",
      label: "Medical Offices",
      icon: "medical",
      title: "Stable technology for patient-facing teams.",
      body:
        "Medical offices need reliable workstations, secure Wi-Fi, phones, printers, cameras, and cloud administration without disrupting the front desk or exam-room workflow.",
      features: [
        "Workstation, printer, and phone support for front desk and exam rooms",
        "Secure Wi-Fi and network segmentation to support HIPAA compliance",
        "Microsoft 365 or Google Workspace administration",
        "Vendor coordination for line-of-business medical platforms",
      ],
      stats: [
        { value: "18", label: "Exam-room devices" },
        { value: "9", label: "Tickets closed today" },
        { value: "22", label: "Mailboxes administered" },
        { value: "9 min", label: "Avg. first response" },
      ],
      href: "/managed-it",
      cta: "Explore Managed IT Services",
      foot:
        "Example snapshot for a medical office, shown for planning context. Compliance requirements vary by practice and system ownership.",
    },
    {
      key: "restaurants",
      label: "Restaurants & Cafes",
      icon: "restaurant",
      title: "Keep the line moving and the register open.",
      body:
        "From the POS at the counter to the printer in the kitchen, Golden State Visions keeps every device on the line talking to each other and keeps card payments running even when the internet hiccups.",
      features: [
        "Failover internet so payments do not stop at the register",
        "Guest Wi-Fi walled off from POS and cameras to support PCI compliance",
        "Kitchen display and printer network tuned for zero dropped tickets",
        "Camera coverage for the line, register, and back door",
      ],
      stats: [
        { value: "99.98%", label: "Checkout network uptime" },
        { value: "41", label: "Guest devices online today" },
        { value: "6", label: "Cameras monitoring the floor" },
        { value: "8 min", label: "Avg. first response" },
      ],
      href: "/managed-it",
      cta: "Explore Managed IT Services",
      foot:
        "Example snapshot for a restaurant or cafe environment, shown for planning context.",
    },
    {
      key: "retail",
      label: "Retail & Storefronts",
      icon: "retail",
      title: "Every register, every scanner, one network.",
      body:
        "Golden State Visions keeps point-of-sale, inventory scanners, and guest Wi-Fi separated and stable, so a busy Saturday does not mean a frozen register.",
      features: [
        "POS and inventory systems isolated from guest traffic to support PCI compliance",
        "Loss-prevention camera systems with off-site backup",
        "Guest Wi-Fi with basic foot-traffic insight",
        "Seasonal capacity planning ahead of the holiday rush",
      ],
      stats: [
        { value: "8", label: "Registers online" },
        { value: "214", label: "Guest Wi-Fi sessions today" },
        { value: "10", label: "Loss-prevention cameras" },
        { value: "10 min", label: "Avg. first response" },
      ],
      href: "/managed-it",
      cta: "Explore Managed IT Services",
      foot:
        "Example snapshot for a retail or storefront environment, shown for planning context.",
    },
  ],
  home: [
    {
      key: "new-build",
      label: "New Build or Remodel",
      icon: "remodel",
      title: "Plan lighting, networking, and control before the walls close.",
      body:
        "Lutron HomeWorks, motorized shades, UniFi networking, whole-home control, audio, video, and surveillance are coordinated early so every system has the right wiring and infrastructure.",
      features: [
        "Lutron HomeWorks lighting, Palladiom keypads, and scene programming",
        "Lutron motorized-shade wiring and daylight planning",
        "UniFi network, camera, equipment-rack, and Wi-Fi design",
        "Control4, Savant, or Crestron control and AV coordination",
      ],
      stats: [
        { value: "22", label: "Lutron zones planned" },
        { value: "14", label: "Scenes programmed" },
        { value: "8", label: "Network zones mapped" },
        { value: "1", label: "Accountable partner" },
      ],
      href: "/smart-home-automation",
      cta: "Explore Smart Home Services",
      foot:
        "Example planning snapshot for a Lutron HomeWorks new build or remodel.",
    },
    {
      key: "existing-system",
      label: "Existing Smart Home",
      icon: "wifi",
      title: "Make the smart home you already own dependable again.",
      body:
        "We assess existing Lutron HomeWorks, Control4, Savant, Crestron, Home Assistant, UniFi, and audio systems, then preserve what works and map a practical path forward.",
      features: [
        "Lutron lighting, keypad, processor, and shade assessment",
        "Control4, Savant, Crestron, or Home Assistant troubleshooting",
        "UniFi network, camera, and equipment documentation",
        "Phased repair, reprogramming, and upgrade roadmap",
      ],
      stats: [
        { value: "58", label: "Devices inventoried" },
        { value: "12", label: "Systems tested" },
        { value: "6", label: "Control points checked" },
        { value: "1", label: "Upgrade roadmap" },
      ],
      href: "/smart-home-automation",
      cta: "Explore Smart Home Services",
      foot:
        "Example assessment snapshot for an existing connected-home system.",
    },
    {
      key: "home-network",
      label: "Whole-Home Network",
      icon: "wifi",
      title: "A UniFi network built for every connected room.",
      body:
        "UniFi switching, Wi-Fi, cameras, local recording, smart-home devices, streaming, and guest traffic are designed as one serviceable network instead of a collection of consumer boxes.",
      features: [
        "UniFi gateway, switching, and access-point design",
        "Wired backhaul, PoE, rack, and battery-backup planning",
        "Separate networks for cameras, IoT, guests, and work",
        "Local recording, remote visibility, and ongoing support",
      ],
      stats: [
        { value: "8", label: "Access points mapped" },
        { value: "58", label: "Devices organized" },
        { value: "4", label: "Networks segmented" },
        { value: "30d", label: "Camera retention target" },
      ],
      href: "/smart-home-automation",
      cta: "Explore Smart Home Services",
      foot:
        "Example planning snapshot for a UniFi whole-home network and camera system.",
    },
    {
      key: "av-control",
      label: "Audio, Video & Control",
      icon: "automation",
      title: "Audio, video, and control that feel like one system.",
      body:
        "Distributed audio, theaters, displays, lighting scenes, cameras, and control interfaces are designed together so daily use stays simple long after installation day.",
      features: [
        "Sonos or Russound audio with Sonance architectural speakers",
        "Marantz, AudioControl, and dedicated home-theater design",
        "Control4, Crestron, or Savant scenes and interfaces",
        "Local camera recording, clean racks, and ongoing support",
      ],
      stats: [
        { value: "12", label: "Audio zones online" },
        { value: "8", label: "Displays controlled" },
        { value: "10", label: "Cameras visible" },
        { value: "1", label: "Simple interface" },
      ],
      href: "/smart-home-automation",
      cta: "Explore Smart Home Services",
      foot:
        "Example snapshot for an integrated whole-home audio, video, and control system.",
    },
  ],
};

function Icon({ name }: { name: ProfileIcon }) {
  if (name === "office") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="9" width="18" height="12" rx="1" />
        <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
        <path d="M3 14h18" />
      </svg>
    );
  }

  if (name === "warehouse") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10 12 5l9 5v10H3Z" />
        <path d="M7 20v-7h10v7" />
        <path d="M9 15h6M9 18h6" />
      </svg>
    );
  }

  if (name === "medical") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 5V3h6v2" />
        <path d="M12 9v7M8.5 12.5h7" />
      </svg>
    );
  }

  if (name === "restaurant") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2v8a2 2 0 0 0 2 2v10" />
        <path d="M7 2v6M4 2v6M4 8h3" />
        <path d="M17 2c-1.5 2-2 4-2 6.5S16 13 17 13v9" />
      </svg>
    );
  }

  if (name === "retail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }

  if (name === "support") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2Z" />
        <path d="M20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2Z" />
        <path d="M17 19c-.7 1.3-2.3 2-5 2" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M5 21V8l7-4 7 4v13" />
        <path d="M9 21v-5h6v5" />
        <path d="M8 10h2M14 10h2M8 13h2M14 13h2" />
      </svg>
    );
  }

  if (name === "security") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </svg>
    );
  }

  if (name === "remodel") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v10h13V10" />
        <path d="M9 20v-6h6v6" />
        <path d="m17 4 3 3" />
      </svg>
    );
  }

  if (name === "wifi") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9a14 14 0 0 1 18 0" />
        <path d="M6.5 12.5a9 9 0 0 1 11 0" />
        <path d="M9.5 16a4 4 0 0 1 5 0" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10v6H7z" />
      <path d="M5 20h14" />
      <path d="M9 10v4M15 10v4" />
      <path d="M7 14h10v6H7z" />
      <path d="M10 7h4M10 17h4" />
    </svg>
  );
}

function TickerValue({ value }: { value: string }) {
  const [characters, setCharacters] = useState(() => value.split(""));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        setCharacters(value.split(""));
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const targetCharacters = value.split("");
    const resetTimer = window.setTimeout(() => {
      setCharacters(
        targetCharacters.map((character) => (character === " " ? " " : "")),
      );
    }, 0);

    const timers = targetCharacters.map((targetCharacter, index) => {
      if (targetCharacter === " ") return undefined;

      const ticks = 5 + Math.floor(Math.random() * 4) + index;
      let count = 0;

      return window.setInterval(() => {
        count += 1;

        setCharacters((currentCharacters) => {
          const nextCharacters = [...currentCharacters];
          nextCharacters[index] =
            count >= ticks
              ? targetCharacter
              : FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
          return nextCharacters;
        });

        if (count >= ticks) {
          const timer = timers[index];
          if (timer) window.clearInterval(timer);
        }
      }, 45);
    });

    return () => {
      window.clearTimeout(resetTimer);
      timers.forEach((timer) => {
        if (timer) window.clearInterval(timer);
      });
    };
  }, [value]);

  return (
    <span className={styles.tickerValue} aria-label={value}>
      {characters.map((character, index) => (
        <span
          className={`${styles.tickerCharacter} ${
            character === " " ? styles.tickerSpace : ""
          }`}
          aria-hidden="true"
          key={`${value}-${index}`}
        >
          {character === "" ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
}

export default function ConceptExperience() {
  const [audience, setAudience] = useState<Audience>("business");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const selectedProfile = serviceProfiles[audience][selectedIndex];

  useEffect(() => {
    if (!autoRotate) return;

    const rotationTimer = window.setTimeout(() => {
      setSelectedIndex(
        (currentIndex) =>
          (currentIndex + 1) % serviceProfiles[audience].length,
      );
    }, TAB_ROTATION_MS);

    return () => window.clearTimeout(rotationTimer);
  }, [audience, selectedIndex, autoRotate]);

  function chooseAudience(nextAudience: Audience) {
    setAudience(nextAudience);
    setSelectedIndex(0);
    setAutoRotate(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const section = document.getElementById("concept-problems");
        if (!section) return;

        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY,
          behavior: "auto",
        });
      });
    });
  }

  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Northern California technology partner</p>
          <h1>
            Technology that
            <span>works together.</span>
          </h1>
          <p className={styles.heroLead}>
            Local managed IT and workplace technology for Northern California
            businesses, plus thoughtfully integrated networking, lighting,
            automation, and AV for homes.
          </p>
          <AudiencePathButtons
            audience={audience}
            onChoose={chooseAudience}
            targetId="concept-problems"
          />
        </div>

        <aside className={styles.proofPanel} aria-label="Why Golden State Visions">
          <div className={styles.proofItem}>
            <span className={styles.proofIcon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
            </span>
            <div>
              <strong>Local and onsite</strong>
              <span>Serving Northern California</span>
            </div>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofIcon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m7 12 3 3 7-7" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
            <div>
              <strong>18+ years of experience</strong>
              <span>Enterprise discipline, right-sized locally</span>
            </div>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofIcon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.6 4.8 9 4.2l2.2 5-1.4 1.1a11.4 11.4 0 0 0 4 4l1.1-1.4 5 2.2-.6 2.4c-.2.8-1 1.4-1.8 1.3C10.4 18.4 5.6 13.6 5.2 6.5c-.1-.8.5-1.5 1.4-1.7Z" />
              </svg>
            </span>
            <div>
              <strong>One accountable partner</strong>
              <span>No vendor runaround</span>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.problemSection} id="concept-problems">
        <div
          className={styles.sectionHeading}
          id="concept-problem-heading"
        >
          <div>
            <p className={styles.eyebrow}>Choose your environment</p>
            <h2>
              {audience === "business"
                ? "Where does your team work?"
                : "What are you planning at home?"}
            </h2>
            <p className={styles.sectionIntro}>
              Select the closest match. We’ll show what matters, what we manage,
              and the most relevant next step.
            </p>
          </div>

          <div className={styles.audienceSwitch} aria-label="Choose an audience">
            <button
              type="button"
              aria-pressed={audience === "business"}
              onClick={() => chooseAudience("business")}
            >
              Business
            </button>
            <button
              type="button"
              aria-pressed={audience === "home"}
              onClick={() => chooseAudience("home")}
            >
              Home
            </button>
          </div>
        </div>

        <div
          className={styles.profileTabs}
          role="tablist"
          aria-label="Service environments"
          data-auto-rotate={autoRotate}
          data-audience={audience}
        >
          {serviceProfiles[audience].map((profile, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
                setAutoRotate(false);
              }}
              key={profile.key}
            >
              <span className={styles.tabIcon}>
                <Icon name={profile.icon} />
              </span>
              {profile.label}
            </button>
          ))}
        </div>

        <div className={styles.profilePanel} role="tabpanel" aria-live="polite">
          <div className={styles.profileStory}>
            <span className={styles.selectedLabel}>
              {selectedProfile.label}
            </span>
            <h3>{selectedProfile.title}</h3>
            <div className={styles.profileMiddle}>
              <p>{selectedProfile.body}</p>
              <ul>
                {selectedProfile.features.map((feature) => (
                  <li key={feature}>
                    <span aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.profileActions}>
              <Link href={selectedProfile.href} className={styles.primaryButton}>
                {selectedProfile.cta}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/book-consult" className={styles.secondaryButton}>
                Book a Consultation
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <aside className={styles.snapshot} aria-label={`${selectedProfile.label} example snapshot`}>
            <div className={styles.snapshotHeading}>
              <div>
                <span>System status</span>
                <strong>Example snapshot</strong>
              </div>
              <span className={styles.statusDot}>All systems normal</span>
            </div>
            <div className={styles.statGrid}>
              {selectedProfile.stats.map((stat) => (
                <div key={stat.label}>
                  <strong>
                    <TickerValue value={stat.value} />
                  </strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <p>
              {selectedProfile.foot ??
                `Illustrative planning snapshot for a typical ${selectedProfile.label.toLowerCase()} environment.`}
            </p>
          </aside>
        </div>
      </section>

      <WhyGoldenStateVisionsSection />

      <TechnologyPartnersSection />

      <section className={styles.howSection} id="how-we-work">
        <div className={styles.whyIntro}>
          <p className={styles.eyebrow}>How We Work</p>
          <h2>A clear path from first conversation to long-term support.</h2>
          <p>
            You will know what happens next, who owns it, and what the finished
            system needs to accomplish.
          </p>
        </div>

        <div className={styles.howGrid}>
          <article>
            <span>01</span>
            <h3>Start with a consultation</h3>
            <p>
              We clarify your <strong>goals, environment, and urgency</strong>,
              then recommend the right next step without a sales runaround.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Assess the site and build the plan</h3>
            <p>
              We review the rooms, infrastructure, and existing systems, then
              provide a <strong>documented scope, recommendations, and pricing</strong>.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Deploy, document, and support</h3>
            <p>
              We coordinate implementation, document the finished system, and
              remain your <strong>accountable partner for ongoing support</strong>.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
