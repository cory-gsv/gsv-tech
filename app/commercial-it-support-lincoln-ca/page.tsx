import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial IT Support & Network Infrastructure | Lincoln, CA",
  description:
    "Golden State Visions provides commercial IT support, managed networks, Microsoft 365, Google Workspace, WiFi, security cameras, and infrastructure support for restaurants, retail, dental offices, medical offices, and small businesses across Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region.",
};

export default function CommercialITPage() {
  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <header className="gsv-header">
          <a href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
            <img
              src="/images/gsv-logo.png"
              alt="Golden State Visions Managed IT Services"
              className="gsv-logo-img"
            />
          </a>

          <nav className="gsv-nav">
            <div className="gsv-nav-dropdown">
              <a href="/#services" className="gsv-nav-dropdown-trigger">Services</a>
              <div className="gsv-nav-dropdown-menu">
                <a href="/commercial-it-support-lincoln-ca">Commercial IT Support</a>
                <a href="/home-network-security-lincoln-ca">Home Networking & Cameras</a>
                <a href="/#services">All Services</a>
              </div>
            </div>
            <a href="/#how-we-work">How We Work</a>
            <a href="/#why-us">Why Choose Us</a>
            <a href="/#contact">Contact</a>
          </nav>
        </header>

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">Commercial IT Support • Lincoln, CA</div>

            <h1>Reliable IT and network support for local businesses.</h1>

            <p>
              Golden State Visions supports restaurants, retail shops, dental offices,
              medical offices, professional service firms, warehouses, small offices,
              and growing businesses across Lincoln, Roseville, Rocklin, Granite Bay,
              and the greater Sacramento region.
            </p>

            <div className="gsv-hero-actions">
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>

              <a className="gsv-btn gsv-btn-secondary" href="#business-services">
                View Services
              </a>
            </div>
          </div>

          <div className="gsv-hero-panel gsv-hero-capabilities">
            <div className="gsv-status-card gsv-capability-lead">
              <div className="gsv-status-label">Built for real-world business operations</div>
              <div className="gsv-status-value">Support, Security, WiFi, Cloud, and Infrastructure</div>
              <p>
                From daily user support to network buildouts, camera systems, cloud platforms,
                and vendor coordination, we help keep business technology dependable and organized.
              </p>
            </div>

            <div className="gsv-status-grid gsv-capability-grid">
              <div className="gsv-mini-stat gsv-capability-card">
                <span>Business Types</span>
                <strong>Restaurants, retail, dental, medical, and office environments</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Platforms</span>
                <strong>Microsoft 365, Google Workspace, email, users, and devices</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Infrastructure</span>
                <strong>Gateways, firewalls, switches, WiFi, cabling, and segmentation</strong>
              </div>

              <div className="gsv-mini-stat gsv-capability-card">
                <span>Security</span>
                <strong>Camera systems, access planning, monitoring, and vendor coordination</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="business-services" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Business IT Services</div>
            <h2>Practical technology support for businesses that depend on uptime.</h2>
            <p>
              We work with small and medium-sized businesses that need dependable systems,
              clean infrastructure, secure networks, and responsive support without juggling
              multiple vendors.
            </p>
          </div>

          <div className="gsv-card-grid">
            <div className="gsv-card">
              <div className="gsv-eyebrow">01</div>
              <h3>Managed IT & User Support</h3>
              <p>
                Day-to-day support for users, workstations, email, cloud platforms, and
                business-critical systems.
              </p>
              <ul>
                <li><strong>Microsoft 365</strong> and Google Workspace administration</li>
                <li><strong>User onboarding</strong>, device setup, and email support</li>
                <li><strong>Remote and onsite support</strong> for common business issues</li>
                <li><strong>Vendor coordination</strong> for internet, phones, printers, and software</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">02</div>
              <h3>Network Infrastructure</h3>
              <p>
                Business-grade network design and deployment for offices, retail spaces,
                restaurants, medical suites, and multi-device environments.
              </p>
              <ul>
                <li><strong>Gateways and firewalls</strong> configured for security and reliability</li>
                <li><strong>Switches and WiFi</strong> designed for coverage and performance</li>
                <li><strong>Structured cabling</strong>, racks, patch panels, and cleanup</li>
                <li><strong>Network segmentation</strong> for staff, guest, POS, cameras, and devices</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">03</div>
              <h3>Security Cameras & Site Systems</h3>
              <p>
                Camera and network planning for businesses that need visibility, reliability,
                and clean system organization.
              </p>
              <ul>
                <li><strong>Camera system planning</strong> for entrances, registers, parking, and work areas</li>
                <li><strong>Network video infrastructure</strong> with proper switching and power planning</li>
                <li><strong>Remote access</strong> and user permission planning</li>
                <li><strong>Ongoing support</strong> for cameras, networking, and connected systems</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Industries We Support</div>
            <h2>Technology support for service businesses, offices, and operational teams.</h2>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Restaurants & Hospitality</h3>
              <p>
                Support for guest WiFi, POS networks, cameras, office computers, printers,
                internet failover planning, and vendor coordination.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Retail & Showrooms</h3>
              <p>
                Reliable WiFi, secure networks, camera visibility, workstation setup,
                payment-device segmentation, and clean equipment organization.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Dental & Medical Offices</h3>
              <p>
                Structured network support, secure access planning, workstation deployment,
                WiFi coverage, printer support, and technology coordination.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Professional Offices</h3>
              <p>
                Email, cloud platforms, document access, device support, conference-room
                connectivity, and dependable day-to-day IT management.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Warehouses & Light Industrial</h3>
              <p>
                WiFi coverage planning, cameras, network expansion, device connectivity,
                cabling, and support for operational systems.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Multi-Site Businesses</h3>
              <p>
                Secure site-to-site connectivity, standardized network design, remote access,
                device management, and consistent support across locations.
              </p>
            </div>
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Start Here</div>
              <h2>Need better IT support or a cleaner business network?</h2>
              <p>
                Schedule a consultation and we’ll review your current setup, identify
                immediate issues, and help map out the right next steps.
              </p>

              <div className="gsv-contact-meta">
                <span>📍 Serving Lincoln, Roseville, Rocklin, Granite Bay, and surrounding areas</span>
                <span>☎️ (916) 432-3373</span>
                <span>🕒 Mon – Fri: 8:00 AM – 6:00 PM</span>
              </div>
            </div>

            <div>
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>
            </div>
          </div>
        </section>

        <footer className="gsv-footer">
          <div className="gsv-footer-main">
            <div className="gsv-footer-brand">
              <a href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
                <img
                  src="/images/gsv-logo.png"
                  alt="Golden State Visions Managed IT Services"
                  className="gsv-logo-img"
                />
              </a>

              <p>
                Managed IT services, secure networks, smart home integration, and
                technology procurement for Lincoln, Roseville, Rocklin, Granite Bay,
                and the greater Sacramento region.
              </p>
            </div>

            <div className="gsv-footer-column">
              <h4>Explore</h4>
              <a href="/">Home</a>
              <a href="/#services">Services</a>
              <a href="/#why-us">Why Choose Us</a>
              <a href="/#contact">Contact</a>
            </div>

            <div className="gsv-footer-column">
              <h4>Services</h4>
              <a href="/commercial-it-support-lincoln-ca">Commercial IT Support</a>
              <a href="/commercial-it-support-lincoln-ca">Network Infrastructure</a>
              <a href="/home-network-security-lincoln-ca">Home Networking & Cameras</a>
              <a href="/home-network-security-lincoln-ca">Smart Home Integration</a>
            </div>

            <div className="gsv-footer-column">
              <h4>Location</h4>
              <p>
                Golden State Visions<br />
                Lincoln, CA<br />
                (916) 432-3373<br />
                Serving Roseville, Rocklin, Loomis, Auburn, Granite Bay, Folsom,
                El Dorado Hills, and the greater Sacramento region.
              </p>
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
