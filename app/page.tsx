"use client";

import SiteFooter from "@/app/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import MenuInteractions from "./components/MenuInteractions";

function BrandLogo() {
  return (
    <Link href="/" className="gsv-brand" aria-label="GSV Stack home">
      <div className="gsv-brand-mark">GSV</div>
      <div>
        <div className="gsv-brand-name">GSV Stack</div>
        <div className="gsv-brand-sub">Business IT Engine</div>
      </div>
    </Link>
  );
}

function ServiceCard({
  eyebrow,
  title,
  text,
  items,
}: {
  eyebrow: string;
  title: string;
  text: string;
  items: ReactNode[];
}) {
  return (
    <div className="gsv-card">
      <div className="gsv-eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function HomePage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalTitle, setContactModalTitle] = useState("Inquiry received.");
  const [contactModalMessage, setContactModalMessage] = useState(
    "Thanks for reaching out. GSV Stack will follow up as soon as possible.",
  );
  const [contactSubmitting, setContactSubmitting] = useState(false);

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      setContactSubmitting(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Inquiry could not be sent.");
      }

      form.reset();

      setContactModalTitle("Inquiry received.");
      setContactModalMessage("Thanks for reaching out. GSV Stack will follow up as soon as possible.");
      setContactModalOpen(true);
    } catch (error) {
      setContactModalTitle("Inquiry not sent.");
      setContactModalMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your inquiry.",
      );
      setContactModalOpen(true);
    } finally {
      setContactSubmitting(false);
    }
  }

  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <MenuInteractions />
        <header className="gsv-header">
          <BrandLogo />

          <nav className="gsv-nav gsv-nav-menu-only">
            <details className="gsv-services-menu">
              <summary>Menu</summary>

              <div className="gsv-services-mega">
                <div className="gsv-services-mega-inner">
                  <div className="gsv-services-mega-head">
                    <div className="gsv-services-mega-explore">
                      <span className="gsv-services-mega-label">Explore</span>

                      <div className="gsv-services-mega-toplinks">
                        <Link href="/#services">Services</Link>
                        <Link href="/#architecture">Architecture</Link>
                        <Link href="/#contact">Contact</Link>
                      </div>
                    </div>
                  </div>

                  <div className="gsv-services-mega-groups">
                    <div className="gsv-services-mega-section">
                      <div className="gsv-services-mega-label">Business Systems</div>

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
                          <span className="gsv-menu-title">Managed IT</span>
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
                          <span className="gsv-menu-title">Networks & Security</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="gsv-services-mega-footer">
                    <Link href="/#services">View services</Link>
                    <Link href="/book-consult">Book a consult</Link>
                  </div>
                </div>
              </div>
            </details>
          </nav>
        </header>

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">
              Managed IT • Secure Networks • Cloud Workspaces • Business Automation
            </div>

            <h1>GSV Stack builds the technology backbone for serious small businesses.</h1>

            <p>
              GSV Stack is the business IT engine under Golden State Visions: managed
              workstations, secure networks, cloud identity, email, endpoint protection,
              vendor coordination, and practical automation for teams that need stable
              systems without enterprise bloat.
            </p>

            <div className="gsv-hero-actions">
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>

              <a className="gsv-btn gsv-btn-secondary" href="#services">
                Explore Services
              </a>
            </div>
          </div>

          <div className="gsv-hero-panel gsv-hero-capabilities">
            <a href="#architecture" className="gsv-status-card gsv-capability-lead">
              <div className="gsv-status-label">Operating Model</div>
              <div className="gsv-status-value">
                One Stack for Support, Security, and Systems
              </div>
              <p>
                A structured service layer for local businesses: help desk workflows,
                cloud administration, network reliability, procurement, and documented
                infrastructure.
              </p>
            </a>

            <div className="gsv-hero-rack-image-wrap" style={{ marginTop: "-8px" }}>
              <Image
                src="/assets/images/portfolio/network-services-infographic-even.png"
                alt="GSV Stack business network, support, security, cloud, backup, procurement, and operations architecture"
                width={1178}
                height={1425}
                className="gsv-hero-rack-image"
                priority
              />
            </div>

            <div className="gsv-status-card">
              <div className="gsv-status-label">Best Fit</div>
              <div className="gsv-status-value">Law, medical, corporate, retail, and field teams</div>
            </div>

            <div className="gsv-status-card">
              <div className="gsv-status-label">Primary Domain</div>
              <div className="gsv-status-value">gsvstack.com</div>
            </div>
          </div>
        </section>

        <section id="services" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Services</div>
            <h2>Managed business systems without the handoff mess.</h2>
            <p>
              The service model is built around the tools small teams actually depend
              on every day: accounts, devices, WiFi, phones, email, security, backups,
              vendors, and the workflows connecting them.
            </p>
          </div>

          <div className="gsv-card-grid">
            <ServiceCard
              eyebrow="01"
              title="Managed IT & Help Desk"
              text="Day-to-day business IT support for teams that need fast answers, clean documentation, and reliable escalation."
              items={[
                <>
                  <strong>User onboarding</strong>, offboarding, permissions, and device setup
                </>,
                <>
                  <strong>Remote support</strong>, workstation troubleshooting, and vendor coordination
                </>,
                <>
                  <strong>Microsoft 365 and Google Workspace</strong> administration
                </>,
                <>
                  <strong>Ticketing and client portal workflows</strong> as the platform expands
                </>,
              ]}
            />

            <ServiceCard
              eyebrow="02"
              title="Networks & Security"
              text="Office networks designed for stable operations, clear segmentation, and practical cybersecurity."
              items={[
                <>
                  <strong>Firewall, gateway, switching, and WiFi</strong> implementation
                </>,
                <>
                  <strong>Structured cabling and rack cleanup</strong> for professional spaces
                </>,
                <>
                  <strong>Endpoint protection</strong>, DNS filtering, and secure remote access
                </>,
                <>
                  <strong>Monitoring, backups, and documentation</strong> for long-term support
                </>,
              ]}
            />

            <ServiceCard
              eyebrow="03"
              title="Business Automation & Procurement"
              text="Operational systems that reduce manual follow-up, simplify buying, and keep technology decisions aligned."
              items={[
                <>
                  <strong>Hardware, licensing, and renewal planning</strong> through a centralized process
                </>,
                <>
                  <strong>Email authentication</strong>, domain records, and deliverability hygiene
                </>,
                <>
                  <strong>Forms, notifications, and workflow automation</strong> for recurring tasks
                </>,
                <>
                  <strong>Roadmaps and lifecycle planning</strong> for upgrades and replacements
                </>,
              ]}
            />
          </div>
        </section>

        <section id="architecture" className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Architecture</div>
            <h2>The commercial IT layer in the Golden State Visions ecosystem.</h2>
            <p>
              GSV Stack is intentionally separated from luxury residential automation
              and real estate media so each audience lands on the right promise, while
              operations remain centralized behind the scenes.
            </p>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Corporate IT front door</h3>
              <p>
                Local businesses, law offices, medical practices, and corporate teams
                are routed to <strong>gsvstack.com</strong> for business support and
                infrastructure.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Client portal ready</h3>
              <p>
                The operating plan leaves room for <strong>portal.gsvstack.com</strong>{" "}
                as the support hub for tickets, contracts, device notes, and service
                history.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Central operations</h3>
              <p>
                Accounting, payments, procurement, and internal workflows stay under
                <strong> Golden State Visions, LLC</strong> while the customer-facing
                brand stays focused.
              </p>
            </div>
          </div>
        </section>

        <section id="why-us" className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Why GSV Stack</div>
            <h2>A practical MSP model for teams that need ownership, not noise.</h2>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Business-first support</h3>
              <p>
                Support starts with how the company works, then maps the right devices,
                accounts, networks, and tools around that reality.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Security by default</h3>
              <p>
                Identity, email, endpoints, DNS, remote access, backups, and network
                segmentation are treated as core infrastructure, not afterthoughts.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Clean documentation</h3>
              <p>
                Systems are easier to support when the network, vendors, users, assets,
                and recurring renewals are documented from the start.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Contact</div>
              <h2>Let’s map the stack your business actually needs.</h2>
              <p>
                Tell us where the pressure is showing up: support, network reliability,
                account sprawl, email, devices, security, vendors, or a system that has
                outgrown its original setup.
              </p>
            </div>

            <form className="gsv-contact-form" onSubmit={handleContactSubmit}>
              <input name="name" type="text" placeholder="Your name" required />
              <input name="email" type="email" placeholder="Email address" required />
              <input name="company" type="text" placeholder="Company name" />
              <textarea name="message" placeholder="Tell us what your business needs" rows={5} required />
              <button type="submit" className="gsv-btn gsv-btn-primary" disabled={contactSubmitting}>
                {contactSubmitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>
        </section>

        {contactModalOpen ? (
          <div
            className="gsv-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div className="gsv-modal-card">
              <button
                type="button"
                className="gsv-modal-close"
                aria-label="Close confirmation modal"
                onClick={() => setContactModalOpen(false)}
              >
                ×
              </button>

              <div className="gsv-modal-icon">
                {contactModalTitle === "Inquiry received." ? "✓" : "!"}
              </div>

              <h2 id="contact-modal-title">{contactModalTitle}</h2>
              <p>{contactModalMessage}</p>

              <button
                type="button"
                className="gsv-btn gsv-btn-primary"
                onClick={() => setContactModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
        <SiteFooter />
      </div>
    </main>
  );
}
