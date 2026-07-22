"use client";

import SiteFooter from "@/app/components/SiteFooter";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AudienceKey = "offices" | "restaurants" | "retail" | "home";

type AudiencePanel = {
  label: string;
  title: string;
  body: string;
  features: string[];
  stats: { value: string; label: string }[];
  foot: string;
  href: string;
  detailsLabel: string;
  icon: "office" | "restaurant" | "retail" | "home";
};

const audienceOrder: AudienceKey[] = ["offices", "restaurants", "retail", "home"];

const audiencePanels: Record<AudienceKey, AudiencePanel> = {
  offices: {
    label: "Professional Offices",
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
      { value: "34", label: "Workstations managed" },
      { value: "5", label: "Tickets closed today" },
      { value: "34", label: "Mailboxes administered" },
      { value: "12 min", label: "Avg. support response" },
    ],
    foot:
      "Sample figures for one 30-person professional office. A real client page would show their own device counts here.",
    href: "/services/managed-it",
    detailsLabel: "See full IT services details",
    icon: "office",
  },
  restaurants: {
    label: "Restaurants & Cafes",
    title: "Keep the line moving and the register open.",
    body:
      "From the POS at the counter to the printer in the kitchen, GSV keeps every device on the line talking to each other and keeps card payments running even when the internet hiccups.",
    features: [
      "Failover internet so payments do not stop at the register",
      "Guest Wi-Fi on its own network, walled off from POS and cameras",
      "Kitchen display and printer network tuned for zero dropped tickets",
      "Camera coverage for the line, register, and back door",
    ],
    stats: [
      { value: "99.98%", label: "Checkout network uptime" },
      { value: "41", label: "Guest devices online today" },
      { value: "6", label: "Cameras monitoring the floor" },
      { value: "12 min", label: "Avg. support response" },
    ],
    foot:
      "Sample figures for one Sacramento diner client, shown here to illustrate the kind of at-a-glance status board each client page could surface.",
    href: "/services/networks-security-systems",
    detailsLabel: "See restaurant and cafe details",
    icon: "restaurant",
  },
  retail: {
    label: "Retail & Storefront",
    title: "Every register, every scanner, one network.",
    body:
      "GSV keeps point-of-sale, inventory scanners, and guest Wi-Fi separated and stable, so a busy Saturday does not mean a frozen register.",
    features: [
      "POS and inventory systems isolated from guest traffic",
      "Loss-prevention camera systems with off-site backup",
      "Guest Wi-Fi with basic foot-traffic insight",
      "Seasonal capacity planning ahead of the holiday rush",
    ],
    stats: [
      { value: "8/8", label: "Registers online" },
      { value: "214", label: "Guest Wi-Fi sessions today" },
      { value: "10", label: "Loss-prevention cameras" },
      { value: "12 min", label: "Avg. support response" },
    ],
    foot:
      "Sample figures for one Placer County boutique client. A real client page would show their own device counts here.",
    href: "/services/audio-video-surveillance",
    detailsLabel: "See retail and storefront details",
    icon: "retail",
  },
  home: {
    label: "Smart Home",
    title: "A home network as reliable as the lighting.",
    body:
      "Whole-home connectivity, Lutron lighting control, and integrated video designed once, and supported for as long as you live there.",
    features: [
      "Lutron HomeWorks lighting design and programming",
      "Whole-home network planning for every device",
      "Integrated audio, video, and surveillance",
      "Ongoing support as the system grows",
    ],
    stats: [
      { value: "22", label: "Lighting zones programmed" },
      { value: "58", label: "Devices on the home network" },
      { value: "8", label: "Cameras monitoring the property" },
      { value: "12 min", label: "Avg. support response" },
    ],
    foot:
      "Sample figures for one Lincoln, CA smart-home client, shown here for illustration only.",
    href: "/services/smart-home-automation",
    detailsLabel: "See smart home details",
    icon: "home",
  },
};

function AudienceIcon({ icon }: { icon: AudiencePanel["icon"] }) {
  if (icon === "restaurant") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 2v8a2 2 0 0 0 2 2v10" />
        <path d="M7 2v6" />
        <path d="M4 2v6" />
        <path d="M4 8h3" />
        <path d="M17 2c-1.5 2-2 4-2 6.5S16 13 17 13v9" />
      </svg>
    );
  }

  if (icon === "retail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }

  if (icon === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <path d="M3 14h18" />
    </svg>
  );
}

export default function HomePage() {
  const [activeKey, setActiveKey] = useState<AudienceKey>("offices");
  const activePanel = audiencePanels[activeKey];

  const activeIndex = useMemo(() => audienceOrder.indexOf(activeKey), [activeKey]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setTimeout(() => {
      setActiveKey(audienceOrder[(activeIndex + 1) % audienceOrder.length]);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  return (
    <main id="top" className="gsv-redesign-page">
      <div className="gsv-redesign-sample-note">
        Staging design direction sample
      </div>

      <header className="gsv-redesign-awning">
        <div className="gsv-redesign-awning-inner">
          <Link href="/" className="gsv-redesign-brand" aria-label="Golden State Visions home">
            Golden State <span>Visions</span>
          </Link>

          <nav className="gsv-redesign-nav" aria-label="Primary navigation">
            <Link href="/services">Services</Link>
            <Link href="/#how-we-work">How We Work</Link>
            <Link href="/#why-us">Why Choose Us</Link>
            <Link href="/book-consult">Book a Consult</Link>
          </nav>

          <div className="gsv-redesign-awning-tag">
            Managed IT / Storefront Networks / Smart Systems
          </div>
        </div>
      </header>

      <section className="gsv-redesign-hero">
        <p className="gsv-redesign-eyebrow">Built for the businesses on Main Street</p>
        <h1>The IT department your storefront never had.</h1>
        <p>
          One team for the network behind the counter and the office upstairs:
          POS, guest Wi-Fi, cameras, helpdesk. Pick your kind of business below.
        </p>
      </section>

      <section className="gsv-redesign-tabs-wrap" aria-label="Business type examples">
        <div className="gsv-redesign-tabs" role="tablist" aria-label="Business type">
          {audienceOrder.map((key) => {
            const panel = audiencePanels[key];
            const selected = key === activeKey;

            return (
              <button
                key={key}
                type="button"
                className={`gsv-redesign-tab${selected ? " is-active" : ""}`}
                role="tab"
                aria-selected={selected}
                aria-controls="gsv-redesign-active-panel"
                onClick={() => setActiveKey(key)}
              >
                <AudienceIcon icon={panel.icon} />
                {panel.label}
                {selected ? <span className="gsv-redesign-tab-progress" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="gsv-redesign-panel" id="gsv-redesign-active-panel">
        <div className="gsv-redesign-board">
          <div className="gsv-redesign-board-head">
            <span>System status</span>
            <span className="gsv-redesign-board-live">Illustrative sample</span>
          </div>

          <div className="gsv-redesign-board-grid">
            {activePanel.stats.map((stat) => (
              <div className="gsv-redesign-stat" key={`${activeKey}-${stat.label}`}>
                <div className="gsv-redesign-stat-value">{stat.value}</div>
                <div className="gsv-redesign-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="gsv-redesign-board-foot">{activePanel.foot}</div>
        </div>

        <div className="gsv-redesign-copy">
          <h2>{activePanel.title}</h2>
          <p className="gsv-redesign-copy-body">{activePanel.body}</p>

          <ul className="gsv-redesign-feature-list">
            {activePanel.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="gsv-redesign-copy-actions">
            <Link href="/book-consult" className="gsv-redesign-cta">
              Book a walkthrough
            </Link>
            <Link href={activePanel.href} className="gsv-redesign-cta-secondary">
              {activePanel.detailsLabel} →
            </Link>
          </div>
        </div>
      </section>

      <section className="gsv-redesign-foot-strip" aria-label="Service promises">
        <div>
          <h3>One number to call</h3>
          <p>
            Support, billing, and project work all route through the same small team,
            with no ticket queue into a call center.
          </p>
        </div>

        <div>
          <h3>Built for physical locations</h3>
          <p>
            Guest Wi-Fi, POS, and camera systems are common ground across every client.
            We design for that from day one.
          </p>
        </div>

        <div>
          <h3>Priced like a utility</h3>
          <p>
            Flat monthly plans sized to your device count, not a surprise invoice after
            every visit.
          </p>
        </div>
      </section>

      <section id="how-we-work" className="gsv-redesign-detail-section">
        <div className="gsv-redesign-section-head">
          <p className="gsv-redesign-eyebrow">How We Work</p>
          <h2>Design, deploy, and support under one roof.</h2>
        </div>

        <div className="gsv-redesign-detail-grid">
          <div>
            <h3>Consult & plan</h3>
            <p>We start with the environment, goals, and future needs so the solution is sized correctly from day one.</p>
          </div>
          <div>
            <h3>Build & deploy</h3>
            <p>Clean implementation, clear documentation, and stable performance matter more than flashy complexity.</p>
          </div>
          <div>
            <h3>Support & evolve</h3>
            <p>As systems grow, we support, refine, and expand them with a long-term service mindset.</p>
          </div>
        </div>
      </section>

      <section id="why-us" className="gsv-redesign-detail-section">
        <div className="gsv-redesign-section-head">
          <p className="gsv-redesign-eyebrow">Why Golden State Visions</p>
          <h2>One partner for support, infrastructure, automation, and procurement.</h2>
        </div>

        <div className="gsv-redesign-detail-grid">
          <div>
            <h3>Business-first support</h3>
            <p>Practical helpdesk support, vendor coordination, and planning for growing teams.</p>
          </div>
          <div>
            <h3>Physical systems fluency</h3>
            <p>Networks, cameras, smart homes, cabling, and cloud platforms handled as one system.</p>
          </div>
          <div>
            <h3>Long-term ownership</h3>
            <p>Procurement, renewals, upgrades, and lifecycle planning stay connected to the support relationship.</p>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style jsx>{`
        .gsv-redesign-page {
          --ink: #1b1611;
          --ink-soft: #4a4033;
          --paper: #faf8f3;
          --paper-raised: #ffffff;
          --line: rgba(27, 22, 17, 0.13);
          --muted: #6b6152;
          --gold: #ffc72c;
          --gold-ink: #2a1e00;
          --gold-deep: #8a5a00;
          --secondary: #d9d4c6;
          --signal: #1c7a63;
          --focus: #1c7a63;
          --shadow: rgba(27, 22, 17, 0.18);
          --dusk: #1b1611;
          --dusk-fg: #f2ede1;
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          font-family: Arial, Helvetica, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .gsv-redesign-page :global(.gsv-footer) {
          max-width: 1180px;
          margin: 40px auto 28px;
        }

        .gsv-redesign-page h1,
        .gsv-redesign-page h2,
        .gsv-redesign-page h3,
        .gsv-redesign-page p {
          margin: 0;
        }

        .gsv-redesign-page h1,
        .gsv-redesign-page h2,
        .gsv-redesign-page h3 {
          text-wrap: balance;
        }

        .gsv-redesign-sample-note {
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 10px 20px;
          border-bottom: 1px solid var(--line);
        }

        .gsv-redesign-awning {
          background: var(--dusk);
          color: var(--dusk-fg);
          border-bottom: 6px solid var(--gold);
        }

        .gsv-redesign-awning-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .gsv-redesign-brand {
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .gsv-redesign-brand span {
          color: var(--gold);
        }

        .gsv-redesign-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          color: rgba(242, 237, 225, 0.78);
          font-size: 13px;
          font-weight: 700;
        }

        .gsv-redesign-nav a:hover {
          color: var(--gold);
        }

        .gsv-redesign-awning-tag {
          font-size: 11px;
          letter-spacing: 0.05em;
          color: rgba(242, 237, 225, 0.65);
          text-transform: uppercase;
        }

        .gsv-redesign-hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 72px 28px 40px;
        }

        .gsv-redesign-eyebrow {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .gsv-redesign-eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: var(--muted);
          display: inline-block;
          flex: none;
        }

        .gsv-redesign-hero h1 {
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: 0;
          max-width: 14ch;
        }

        .gsv-redesign-hero > p:last-child {
          margin-top: 24px;
          max-width: 58ch;
          font-size: 17px;
          line-height: 1.55;
          color: var(--ink-soft);
        }

        .gsv-redesign-tabs-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .gsv-redesign-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .gsv-redesign-tab {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 50px;
          background: #f5f3ee;
          border: 1px solid rgba(9, 8, 6, 0.16);
          color: #6b6152;
          font-size: 15px;
          padding: 12px 20px;
          border-radius: 999px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        .gsv-redesign-tab :global(svg) {
          width: 18px;
          height: 18px;
          flex: none;
        }

        .gsv-redesign-tab.is-active {
          color: var(--gold-deep);
          background: #fff4d6;
          border-color: rgba(255, 199, 44, 0.6);
          font-weight: 700;
        }

        .gsv-redesign-tab:focus-visible,
        .gsv-redesign-cta:focus-visible {
          outline: 2px solid var(--focus);
          outline-offset: 3px;
        }

        .gsv-redesign-tab-progress {
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(255, 199, 44, 0.2), transparent);
          transform-origin: left center;
          animation: gsv-redesign-tab-fill 8000ms linear forwards;
        }

        .gsv-redesign-panel {
          max-width: 1180px;
          margin: 0 auto;
          padding: 40px 28px 88px;
          display: grid;
          grid-template-columns: minmax(0, 0.86fr) minmax(0, 1fr);
          gap: 28px;
          align-items: stretch;
        }

        .gsv-redesign-board {
          background: var(--dusk);
          color: var(--dusk-fg);
          border-radius: 20px;
          padding: 26px 24px;
          box-shadow: 0 18px 40px -20px var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .gsv-redesign-board-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(242, 237, 225, 0.55);
          border-bottom: 1px solid rgba(242, 237, 225, 0.14);
          padding-bottom: 14px;
        }

        .gsv-redesign-board-live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--gold);
          white-space: nowrap;
        }

        .gsv-redesign-board-live::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 0 3px rgba(255, 199, 44, 0.22);
        }

        .gsv-redesign-board-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .gsv-redesign-stat-value {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
          font-weight: 700;
          font-size: clamp(22px, 3.4vw, 30px);
          letter-spacing: 0.01em;
          color: var(--gold);
          font-variant-numeric: tabular-nums;
        }

        .gsv-redesign-stat-label {
          margin-top: 6px;
          font-size: 12.5px;
          line-height: 1.4;
          color: rgba(242, 237, 225, 0.7);
          max-width: 20ch;
        }

        .gsv-redesign-board-foot {
          font-size: 12px;
          color: rgba(242, 237, 225, 0.45);
          border-top: 1px solid rgba(242, 237, 225, 0.14);
          padding-top: 14px;
          line-height: 1.5;
        }

        .gsv-redesign-copy {
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 34px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .gsv-redesign-copy h2 {
          font-size: clamp(24px, 2.6vw, 30px);
          font-weight: 800;
          line-height: 1.12;
        }

        .gsv-redesign-copy-body {
          font-size: 16px;
          line-height: 1.6;
          color: var(--ink-soft);
          max-width: 52ch;
        }

        .gsv-redesign-feature-list {
          list-style: none;
          margin: 4px 0 0;
          padding: 0;
          display: grid;
          gap: 12px;
        }

        .gsv-redesign-feature-list li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 15px;
          line-height: 1.5;
          color: var(--ink);
        }

        .gsv-redesign-feature-list li::before {
          content: "";
          flex: none;
          width: 7px;
          height: 7px;
          margin-top: 7px;
          border-radius: 1.5px;
          background: var(--gold-deep);
          transform: rotate(45deg);
        }

        .gsv-redesign-copy-actions {
          margin-top: 8px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .gsv-redesign-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--secondary);
          color: var(--gold-ink);
          font-weight: 700;
          font-size: 15px;
          padding: 13px 22px;
          border-radius: 999px;
          transition: transform 0.18s ease;
        }

        .gsv-redesign-cta:hover {
          transform: translateY(-1px);
        }

        .gsv-redesign-cta-secondary {
          font-size: 14px;
          font-weight: 700;
          color: var(--signal);
          border-bottom: 1px solid transparent;
        }

        .gsv-redesign-cta-secondary:hover {
          border-bottom-color: var(--signal);
        }

        .gsv-redesign-foot-strip,
        .gsv-redesign-detail-section {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px 80px;
        }

        .gsv-redesign-foot-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .gsv-redesign-foot-strip > div,
        .gsv-redesign-detail-grid > div {
          border-top: 2px solid var(--ink);
          padding-top: 14px;
        }

        .gsv-redesign-foot-strip h3,
        .gsv-redesign-detail-grid h3 {
          font-size: 15px;
          font-weight: 800;
        }

        .gsv-redesign-foot-strip p,
        .gsv-redesign-detail-grid p {
          margin-top: 8px;
          font-size: 14px;
          line-height: 1.55;
          color: var(--muted);
        }

        .gsv-redesign-section-head {
          max-width: 720px;
          margin-bottom: 28px;
        }

        .gsv-redesign-section-head h2 {
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.08;
        }

        .gsv-redesign-detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @keyframes gsv-redesign-tab-fill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @media (max-width: 900px) {
          .gsv-redesign-nav {
            order: 3;
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
          }

          .gsv-redesign-panel,
          .gsv-redesign-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .gsv-redesign-foot-strip {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .gsv-redesign-sample-note {
            display: none;
          }

          .gsv-redesign-awning-inner,
          .gsv-redesign-hero,
          .gsv-redesign-tabs-wrap,
          .gsv-redesign-panel,
          .gsv-redesign-foot-strip,
          .gsv-redesign-detail-section {
            padding-left: 20px;
            padding-right: 20px;
          }

          .gsv-redesign-hero {
            padding-top: 52px;
          }

          .gsv-redesign-tabs {
            display: grid;
          }

          .gsv-redesign-tab {
            justify-content: flex-start;
            width: 100%;
          }

          .gsv-redesign-board-grid {
            grid-template-columns: 1fr;
          }

          .gsv-redesign-board-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .gsv-redesign-copy {
            padding: 28px 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gsv-redesign-tab,
          .gsv-redesign-cta {
            transition: none;
          }

          .gsv-redesign-tab-progress {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
