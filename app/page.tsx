"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

function BrandLogo() {
  return (
    <a href="#top" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
      <img
        src="/images/gsv-logo.png"
        alt="Golden State Visions Managed IT Services"
        className="gsv-logo-img"
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
        <header className="gsv-header">
          <BrandLogo />

          <nav className="gsv-nav">
            <a href="#services">Services</a>
            <a href="#how-we-work">How We Work</a>
            <a href="#why-us">Why Choose Us</a>
            <a href="#contact">Contact</a>
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

            <div className="gsv-status-grid gsv-capability-grid">
              <a href="#services" className="gsv-mini-stat gsv-capability-card">
                <span>Business IT & Support</span>
                <strong>Tailored IT Support & Managed Cloud Systems</strong>
                <p>
                  Keep your business running smoothly. We support your users, devices,
                  servers, Microsoft 365, and Google Workspace with IT management built
                  around the way you work.
                </p>
              </a>

              <a href="#services" className="gsv-mini-stat gsv-capability-card">
                <span>Networks & Infrastructure</span>
                <strong>Secure Networks Built for Growth</strong>
                <p>
                  Keep your business connected and protected. We manage your gateways,
                  firewalls, switches, WiFi, and cabling with reliable infrastructure
                  optimized for performance.
                </p>
              </a>

              <a href="#how-we-work" className="gsv-mini-stat gsv-capability-card">
                <span>Strategic IT Process</span>
                <strong>Plan Build, Document, Support</strong>
                <p>
                  We audit your environment, implement clean solutions, document systems
                  clearly, and support your infrastructure as your business grows.
                </p>
              </a>

              <a href="#why-us" className="gsv-mini-stat gsv-capability-card">
                <span>Why Golden State Visions</span>
                <strong>One Partner for the Full Stack</strong>
                <p>
                  Streamline your technology with a single provider. We handle your
                  business IT, network infrastructure, procurement, smart home systems,
                  and long-term planning.
                </p>
              </a>
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

        <footer className="gsv-footer">
          <div className="gsv-footer-main">
            <div className="gsv-footer-brand">
              <BrandLogo />

              <p>
                Business IT, secure networks, smart home integration, and procurement
                built for long-term reliability.
              </p>
            </div>

            <div className="gsv-footer-column">
              <h4>Explore</h4>
              <a href="#services">Services</a>
              <a href="#how-we-work">How We Work</a>
              <a href="#why-us">Why Choose Us</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="gsv-footer-column">
              <h4>Services</h4>
              <a href="#services">Business IT & Support</a>
              <a href="#services">Networks & Infrastructure</a>
              <a href="#services">Smart Home Integration</a>
              <a href="#why-us">Procurement & Planning</a>
            </div>

            <div className="gsv-footer-column">
              <h4>Next Step</h4>
              <p>Ready to review your systems or plan a new project?</p>
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary gsv-footer-btn">
                Book a Consult
              </Link>
            </div>
          </div>

          <div className="gsv-footer-bottom">
            <span>© {new Date().getFullYear()} Golden State Visions. All rights reserved.</span>
            <a href="#top">Back to top</a>
          </div>
        </footer>
      </div>
    </main>
  );
}