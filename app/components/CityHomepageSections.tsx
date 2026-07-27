"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TechnologyPartnersSection from "@/app/components/TechnologyPartnersSection";
import WhyGoldenStateVisionsSection from "@/app/components/WhyGoldenStateVisionsSection";
import type { LocalCity } from "@/app/data/localSeo";
import styles from "@/app/concept/concept.module.css";

type Audience = "business" | "home";
type ProfileIcon =
  | "office"
  | "warehouse"
  | "medical"
  | "restaurant"
  | "retail"
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
  foot: string;
};

type CityHomepageSectionsProps = {
  city: LocalCity;
  defaultAudience?: Audience;
  pageContext?: "overview" | "business" | "home";
};

const FLAP_CHARS = "0123456789/%Kmin.d";
const TAB_ROTATION_MS = 10_000;

function ProfileIconGraphic({ name }: { name: ProfileIcon }) {
  if (name === "office") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="9" width="18" height="12" rx="1" />
        <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 14h18" />
      </svg>
    );
  }

  if (name === "warehouse") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10 12 5l9 5v10H3ZM7 20v-7h10v7M9 15h6M9 18h6" />
      </svg>
    );
  }

  if (name === "medical") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 5V3h6v2M12 9v7M8.5 12.5h7" />
      </svg>
    );
  }

  if (name === "restaurant") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2v8a2 2 0 0 0 2 2v10M7 2v6M4 2v6M4 8h3M17 2c-1.5 2-2 4-2 6.5S16 13 17 13v9" />
      </svg>
    );
  }

  if (name === "retail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8ZM9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }

  if (name === "remodel") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9 20v-6h6v6M17 4l3 3" />
      </svg>
    );
  }

  if (name === "wifi") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9a14 14 0 0 1 18 0M6.5 12.5a9 9 0 0 1 11 0M9.5 16a4 4 0 0 1 5 0" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10v6H7zM5 20h14M9 10v4M15 10v4M7 14h10v6H7zM10 7h4M10 17h4" />
    </svg>
  );
}

function TickerValue({ value }: { value: string }) {
  const [characters, setCharacters] = useState(() => value.split(""));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setCharacters(value.split(""));
      return;
    }

    const targetCharacters = value.split("");
    setCharacters(targetCharacters.map((character) => (character === " " ? " " : "")));
    const timers: Array<number | undefined> = [];

    targetCharacters.forEach((targetCharacter, index) => {
      if (targetCharacter === " ") return;

      const ticks = 5 + Math.floor(Math.random() * 4) + index;
      let count = 0;
      timers[index] = window.setInterval(() => {
        count += 1;
        setCharacters((currentCharacters) => {
          const nextCharacters = [...currentCharacters];
          nextCharacters[index] =
            count >= ticks
              ? targetCharacter
              : FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
          return nextCharacters;
        });

        if (count >= ticks && timers[index]) {
          window.clearInterval(timers[index]);
        }
      }, 45);
    });

    return () => {
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

function getServiceProfiles(
  city: LocalCity,
  pageContext: CityHomepageSectionsProps["pageContext"],
): Record<Audience, ServiceProfile[]> {
  const businessHref =
    pageContext === "business" ? "#business-services" : `/commercial-it-support-${city.slug}`;
  const homeHref =
    pageContext === "home" ? "#home-services" : `/home-network-security-${city.slug}`;

  return {
    business: [
      {
        key: "offices",
        label: "Professional Offices",
        icon: "office",
        title: `IT that runs quietly for offices in ${city.city}.`,
        body: `Professional teams in ${city.city} get managed support, secure networking, and Microsoft 365 or Google Workspace administration through one accountable local relationship.`,
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
        href: businessHref,
        cta: "See Managed IT Services Details",
        foot: `Illustrative planning snapshot for a professional office serving ${city.city} and ${city.region}.`,
      },
      {
        key: "warehouses",
        label: "Warehouses & Fulfillment",
        icon: "warehouse",
        title: "Coverage for scanners, docks, cameras, and inventory stations.",
        body: `Warehouse and fulfillment operations around ${city.city} need coverage across aisles, docks, yards, cameras, shipping stations, and office workstations without dead zones or mystery devices.`,
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
        href: businessHref,
        cta: "See Managed IT Services Details",
        foot: `Illustrative planning snapshot for a ${city.city} warehouse or fulfillment environment.`,
      },
      {
        key: "medical",
        label: "Medical Offices",
        icon: "medical",
        title: "Stable technology for patient-facing teams.",
        body: `Medical and dental practices in ${city.city} need reliable workstations, secure Wi-Fi, phones, printers, cameras, and cloud administration without disrupting front-desk or exam-room workflows.`,
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
        href: businessHref,
        cta: "See Managed IT Services Details",
        foot: `Illustrative ${city.city} medical-office snapshot. Compliance requirements vary by practice and system ownership.`,
      },
      {
        key: "restaurants",
        label: "Restaurants & Cafes",
        icon: "restaurant",
        title: "Keep the line moving and the register open.",
        body: `${city.city} restaurants and cafes depend on the POS, kitchen printers, guest Wi-Fi, cameras, and internet failover working together through the busiest service periods.`,
        features: [
          "Failover internet so payments do not stop at the register",
          "Guest Wi-Fi separated from POS and cameras to support PCI compliance",
          "Kitchen display and printer network tuned for fewer dropped tickets",
          "Camera coverage for the line, register, entrances, and back door",
        ],
        stats: [
          { value: "99.98%", label: "Checkout network uptime" },
          { value: "41", label: "Guest devices online today" },
          { value: "6", label: "Cameras monitoring the floor" },
          { value: "8 min", label: "Avg. first response" },
        ],
        href: businessHref,
        cta: "See Managed IT Services Details",
        foot: `Illustrative planning snapshot for a restaurant or cafe in the ${city.city} service area.`,
      },
      {
        key: "retail",
        label: "Retail & Storefronts",
        icon: "retail",
        title: "Every register, every scanner, one network.",
        body: `Retailers and showrooms serving ${city.city} need point-of-sale, inventory scanners, loss-prevention cameras, and guest Wi-Fi separated and stable through daily and seasonal demand.`,
        features: [
          "POS and inventory systems isolated from guest traffic for PCI support",
          "Loss-prevention camera systems with remote visibility",
          "Guest Wi-Fi with practical access and capacity planning",
          "Seasonal network and device planning ahead of peak periods",
        ],
        stats: [
          { value: "8", label: "Registers online" },
          { value: "214", label: "Guest Wi-Fi sessions today" },
          { value: "10", label: "Loss-prevention cameras" },
          { value: "10 min", label: "Avg. first response" },
        ],
        href: businessHref,
        cta: "See Managed IT Services Details",
        foot: `Illustrative planning snapshot for a retail or storefront environment in ${city.city}.`,
      },
    ],
    home: [
      {
        key: "new-build",
        label: "New Build or Remodel",
        icon: "remodel",
        title: "Plan the technology before the walls close.",
        body: `For ${city.city} new builds and remodels, Lutron HomeWorks, motorized shades, UniFi networking, whole-home control, AV, and surveillance are coordinated before finishes limit the options.`,
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
        href: homeHref,
        cta: "See Home Planning",
        foot: `Illustrative planning snapshot for a ${city.city} Lutron HomeWorks new build or remodel.`,
      },
      {
        key: "existing-system",
        label: "Existing Smart Home",
        icon: "wifi",
        title: "Make the smart home you already own dependable again.",
        body: `We assess existing systems in ${city.city} homes, preserve what works, document the environment, and map a practical path for Lutron, Control4, Savant, Crestron, Home Assistant, UniFi, and AV.`,
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
        href: homeHref,
        cta: "See Home Planning",
        foot: `Illustrative assessment snapshot for an existing connected-home system in ${city.city}.`,
      },
      {
        key: "home-network",
        label: "Whole-Home Network",
        icon: "wifi",
        title: "A UniFi network built for every connected space on the property.",
        body: `UniFi switching, Wi-Fi, cameras, local recording, smart-home devices, streaming, and guest traffic are planned around the walls, outdoor areas, and usage patterns common to ${city.city} properties.`,
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
        href: homeHref,
        cta: "See Home Planning",
        foot: `Illustrative planning snapshot for a ${city.city} UniFi whole-home network and camera system.`,
      },
      {
        key: "av-control",
        label: "Audio, Video & Control",
        icon: "automation",
        title: "Audio, video, and control that feel like one system.",
        body: `Distributed audio, theaters, displays, lighting scenes, cameras, and control interfaces are coordinated around how the ${city.city} residence is used every day and supported over time.`,
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
        href: homeHref,
        cta: "See Home Planning",
        foot: `Illustrative snapshot for an integrated ${city.city} whole-home audio, video, and control system.`,
      },
    ],
  };
}

export default function CityHomepageSections({
  city,
  defaultAudience = "business",
  pageContext = "overview",
}: CityHomepageSectionsProps) {
  const serviceProfiles = useMemo(
    () => getServiceProfiles(city, pageContext),
    [city, pageContext],
  );
  const [audience, setAudience] = useState<Audience>(defaultAudience);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const selectedProfile = serviceProfiles[audience][selectedIndex];

  useEffect(() => {
    if (!autoRotate) return;

    const rotationTimer = window.setTimeout(() => {
      setSelectedIndex(
        (currentIndex) => (currentIndex + 1) % serviceProfiles[audience].length,
      );
    }, TAB_ROTATION_MS);

    return () => window.clearTimeout(rotationTimer);
  }, [audience, selectedIndex, autoRotate, serviceProfiles]);

  useEffect(() => {
    function handleAudienceChoice(event: Event) {
      const nextAudience = (
        event as CustomEvent<{ audience?: Audience }>
      ).detail?.audience;

      if (nextAudience !== "business" && nextAudience !== "home") return;

      setAudience(nextAudience);
      setSelectedIndex(0);
      setAutoRotate(true);
    }

    window.addEventListener("gsv:choose-audience", handleAudienceChoice);
    return () =>
      window.removeEventListener("gsv:choose-audience", handleAudienceChoice);
  }, []);

  function chooseAudience(nextAudience: Audience) {
    setAudience(nextAudience);
    setSelectedIndex(0);
    setAutoRotate(true);
  }

  return (
    <div className={styles.page}>
      <section className={styles.problemSection} id="service-paths">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Choose Your Environment</p>
            <h2>
              {audience === "business"
                ? `Where does your ${city.city} team work?`
                : `What are you planning at your ${city.city} property?`}
            </h2>
            <p className={styles.sectionIntro}>
              Select the closest match for {city.city} and {city.region}. We’ll show what
              matters, what we manage, and the most relevant local next step.
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
          aria-label={`${city.city} service environments`}
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
                <ProfileIconGraphic name={profile.icon} />
              </span>
              {profile.label}
            </button>
          ))}
        </div>

        <div className={styles.profilePanel} role="tabpanel" aria-live="polite">
          <div className={styles.profileStory}>
            <span className={styles.selectedLabel}>{selectedProfile.label}</span>
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

          <aside
            className={styles.snapshot}
            aria-label={`${selectedProfile.label} example snapshot`}
          >
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
            <p>{selectedProfile.foot}</p>
          </aside>
        </div>
      </section>

      <WhyGoldenStateVisionsSection />

      <TechnologyPartnersSection />
    </div>
  );
}
