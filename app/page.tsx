"use client";

import SiteFooter from "@/app/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import MenuInteractions from "./components/MenuInteractions";

function BrandLogo() {
  return (
    <a href="#top" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
      <Image
        src="/images/gsv-logo.png"
        alt="Golden State Visions Managed IT Services"
        width={1798}
        height={877}
        className="gsv-logo-img"
        priority
      />
    </a>
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
    "Thanks for reaching out. Your message has been sent to Golden State Visions.",
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
      setContactModalMessage(
        "Thanks for reaching out. Golden State Visions will follow up as soon as possible.",
      );
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

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">
              Managed Business IT • Network Infrastructure • Smart Home Systems
            </div>

            <h1>Full-Stack Technology for Modern Workplaces and Connected Homes</h1>

            <p>
              Get reliable infrastructure engineered for both business efficiency and
              premium residential living. Golden State Visions delivers comprehensive
              IT support for small and medium-sized businesses, secure network
              deployments, and cloud platform administration alongside fully integrated
              smart home systems designed for long-term usability.
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
            <a href="#services" className="gsv-status-card gsv-capability-lead">
              <div className="gsv-status-label">Explore Our Approach</div>
              <div className="gsv-status-value">
                Technology Designed, Deployed, and Supported
              </div>
              <p>
                From business IT and secure networks to smart homes and procurement,
                we build reliable systems optimized for long-term usability and
                ongoing support.
              </p>
            </a>

            <div className="gsv-hero-rack-image-wrap" style={{ marginTop: "-8px" }}>
              <Image
                src="/assets/images/portfolio/network-services-infographic-even.png"
                alt="Golden State Visions network services infographic connecting home networks, office networks, surveillance, cloud backup, security hubs, and procurement"
                width={1178}
                height={1425}
                className="gsv-hero-rack-image"
                priority
              />
            </div>
          </div>
        </section>

        <section id="services" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Services</div>
            <h2>Comprehensive IT, networking, and smart home solutions.</h2>
            <p>
              Golden State Visions supports small and medium-sized businesses with
              buildouts, ongoing support, scalable infrastructure, and cloud platform
              administration alongside fully integrated smart home systems designed
              for long-term usability.
            </p>
          </div>

          <div className="gsv-card-grid">
            <ServiceCard
              eyebrow="01"
              title="Business IT & Support"
              text="Business technology planning, cloud platform administration, and day-to-day IT support for growing organizations."
              items={[
                <>
                  <strong>Managed IT services</strong>, remote support, and vendor coordination
                </>,
                <>
                  <strong>Microsoft 365 and Google Workspace</strong> design, administration,
                  and migration
                </>,
                <>
                  <strong>Email, user, and workstation</strong> deployment
                </>,
                <>
                  <strong>Business IT architecture</strong>, server infrastructure, and
                  system implementation
                </>,
              ]}
            />

            <ServiceCard
              eyebrow="02"
              title="Networks & Infrastructure"
              text="Reliable network infrastructure for small to medium sized offices, custom homes, and multi-device environments."
              items={[
                <>
                  <strong>Network architecture</strong>, gateway, and firewall implementation
                </>,
                <>
                  <strong>Switching, WiFi design</strong>, coverage planning, and performance
                  optimization
                </>,
                <>
                  <strong>Structured cabling</strong>, rack design, and infrastructure
                  organization
                </>,
                <>
                  <strong>Network segmentation</strong>, access control, and secure
                  site-to-site connectivity
                </>,
              ]}
            />

            <ServiceCard
              eyebrow="03"
              title="Smart Home Systems"
              text="High-end residential technology systems built for performance, simplicity, and long-term usability."
              items={[
                <>
                  <strong>Lutron HomeWorks</strong> system design and integration
                </>,
                <>
                  <strong>Lighting control</strong> and scene programming
                </>,
                <>
                  <strong>Whole-home network</strong> planning
                </>,
                <>
                  <strong>Connected home consulting</strong> and system coordination
                </>,
              ]}
            />
          </div>
        </section>

        <section id="how-we-work" className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">How We Work</div>
            <h2>A single technology partner across business and residential environments.</h2>
            <p>
              We combine support, infrastructure, and automation into one cohesive
              service experience, reducing handoffs and giving clients a cleaner,
              more reliable path forward.
            </p>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Consult & plan</h3>
              <p>
                We start with the <strong>environment, goals, and future needs</strong> so the
                solution is sized correctly from day one.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Build & deploy</h3>
              <p>
                We <strong>implement cleanly and document clearly</strong>, focusing on
                dependable performance over flashy complexity.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Support & evolve</h3>
              <p>
                As systems grow, we <strong>support, refine, and expand</strong> them with a
                long-term service mindset.
              </p>
            </div>
          </div>
        </section>

        <section id="why-us" className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Why Golden State Visions</div>
            <h2>One partner for support, infrastructure, automation, and technology procurement.</h2>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Business-first mindset</h3>
              <p>
                We help businesses stay productive with <strong>reliable systems</strong>,{" "}
                <strong>practical support</strong>, and{" "}
                <strong>thoughtful long-term planning</strong>.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Premium system design</h3>
              <p>
                From office networks to smart homes, we focus on{" "}
                <strong>clean installs</strong>, <strong>stable performance</strong>, and a{" "}
                <strong>polished end-user experience</strong>.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Scalable client experience</h3>
              <p>
                Our long-term vision includes a client portal for{" "}
                <strong>service tracking</strong>, <strong>appointments</strong>,{" "}
                <strong>system visibility</strong>, and <strong>account management</strong>.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Microsoft & Google platforms</h3>
              <p>
                Support for <strong>Microsoft 365</strong>,{" "}
                <strong>Google Workspace</strong>, <strong>email</strong>, identity, licensing,
                administration, and ongoing platform management.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Business technology procurement</h3>
              <p>
                Access to <strong>business hardware</strong>,{" "}
                <strong>networking equipment</strong>, <strong>workstations</strong>, servers,
                software licensing, and infrastructure products through established technology
                channels.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Planning through support</h3>
              <p>
                Help with <strong>product selection</strong>,{" "}
                <strong>implementation planning</strong>, renewals, upgrades, lifecycle
                management, and vendor coordination.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Contact</div>
              <h2>Let’s talk about your business or home technology needs.</h2>
              <p>
                Whether you need IT support, a new network buildout, or a premium smart
                home system, Golden State Visions is ready to help.
              </p>
            </div>

            <form className="gsv-contact-form" onSubmit={handleContactSubmit}>
              <input name="name" type="text" placeholder="Your name" required />
              <input name="email" type="email" placeholder="Email address" required />
              <input name="company" type="text" placeholder="Company or project name" />
              <textarea name="message" placeholder="Tell us what you need" rows={5} required />
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
