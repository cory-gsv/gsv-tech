import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Managed IT Services in Lincoln, CA | Golden State Visions",
  description:
    "Managed IT services for businesses in Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region. Support for Microsoft 365, Google Workspace, endpoints, networks, cybersecurity, backups, and business technology infrastructure.",
};

export default function ManagedITServicesPage() {
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

          <nav className="gsv-nav gsv-nav-menu-only">
            <details className="gsv-services-menu">
              <summary>Menu</summary>

              <div className="gsv-services-mega">
                <div className="gsv-services-mega-inner">
                  <div className="gsv-services-mega-head">
                    <div className="gsv-services-mega-explore">
                      <span className="gsv-services-mega-label">Explore</span>

                      <div className="gsv-services-mega-toplinks">
                        <a href="/#how-we-work">How We Work</a>
                        <a href="/#why-us">Why Choose Us</a>
                        <a href="/#contact">Contact</a>
                      </div>
                    </div>
                  </div>

                  <div className="gsv-services-mega-groups">
                    <div className="gsv-services-mega-section">
                      <div className="gsv-services-mega-label">Business Solutions</div>

                      <div className="gsv-services-mega-grid">
                        <a href="/services/managed-it" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon">💼</span>
                          <span className="gsv-menu-title">Managed IT Services</span>
                        </a>

                        <a href="/services/networks-security-systems" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon">📹</span>
                          <span className="gsv-menu-title">Networks & Security Systems</span>
                        </a>
                      </div>
                    </div>

                    <div className="gsv-services-mega-section">
                      <div className="gsv-services-mega-label">Residential Solutions</div>

                      <div className="gsv-services-mega-grid">
                        <a href="/services/smart-home-automation" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon">🏠</span>
                          <span className="gsv-menu-title">Smart Home Automation</span>
                        </a>

                        <a href="/services/audio-video-surveillance" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon gsv-menu-icon-av">🎥</span>
                          <span className="gsv-menu-title">Audio, Video & Surveillance</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="gsv-services-mega-footer">
                    <a href="/#services">View all services</a>
                    <a href="/book-consult">Book a consult</a>
                  </div>
                </div>
              </div>
            </details>
          </nav>
        </header>

        <section className="gsv-local-hero">
          <div className="gsv-local-hero-copy">
            <div className="gsv-eyebrow">Managed IT Services • Lincoln, CA</div>

            <h1>Managed IT Services for Lincoln Businesses</h1>

            <p>
              Golden State Visions provides managed IT support for restaurants, retail
              teams, dental offices, medical offices, professional firms, warehouses,
              and growing businesses across Lincoln, Roseville, Rocklin, Granite Bay,
              and the greater Sacramento region.
            </p>

            <div className="gsv-hero-actions">
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>

              <a href="#managed-it-support" className="gsv-btn gsv-btn-secondary">
                View Support Areas
              </a>
            </div>
          </div>

          <div className="gsv-local-hero-panel">
            <div className="gsv-local-panel-card">
              <div className="gsv-eyebrow">Built For</div>
              <h2>Reliable daily operations</h2>
              <p>
                We help businesses reduce technology friction with organized user support,
                cloud administration, endpoint management, network coordination, backups,
                and long-term infrastructure planning.
              </p>
            </div>

            <div className="gsv-local-mini-grid">
              <div>
                <span>Platforms</span>
                <strong>Microsoft 365 & Google Workspace</strong>
              </div>
              <div>
                <span>Support</span>
                <strong>Users, devices, email & endpoints</strong>
              </div>
              <div>
                <span>Infrastructure</span>
                <strong>Networks, servers, backups & vendors</strong>
              </div>
              <div>
                <span>Coverage</span>
                <strong>Lincoln, Roseville, Rocklin & Granite Bay</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="managed-it-support" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">What We Manage</div>
            <h2>Practical IT support for small and medium-sized businesses.</h2>
            <p>
              Our managed IT services are built around dependable support, clean
              documentation, proactive monitoring, and scalable business infrastructure.
            </p>
          </div>

          <div className="gsv-card-grid">
            <div className="gsv-card">
              <div className="gsv-eyebrow">01</div>
              <h3>User & Endpoint Management</h3>
              <p>
                Day-to-day support for employees, workstations, laptops, email,
                identity, and business applications.
              </p>
              <ul>
                <li><strong>Desktop and laptop support</strong> for business users</li>
                <li><strong>User onboarding and offboarding</strong> workflows</li>
                <li><strong>Email and identity management</strong> for Microsoft 365 and Google Workspace</li>
                <li><strong>Endpoint deployment</strong>, patch planning, and support coordination</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">02</div>
              <h3>Network Infrastructure & Stability</h3>
              <p>
                Business-grade networks designed for secure connectivity, stable WiFi,
                cloud access, cameras, phones, printers, and connected systems.
              </p>
              <ul>
                <li><strong>Gateway and firewall planning</strong> for secure operations</li>
                <li><strong>Switching and WiFi support</strong> for offices and multi-device environments</li>
                <li><strong>Network segmentation</strong> for staff, guest, POS, cameras, and devices</li>
                <li><strong>Proactive network monitoring</strong> and vendor coordination</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">03</div>
              <h3>Continuity & Compliance Support</h3>
              <p>
                Long-term planning for backup, disaster recovery, cybersecurity hygiene,
                documentation, and lifecycle management.
              </p>
              <ul>
                <li><strong>Cloud backup planning</strong> and recovery coordination</li>
                <li><strong>Security software and endpoint protection</strong> support</li>
                <li><strong>Documentation and lifecycle planning</strong> for critical systems</li>
                <li><strong>Vendor coordination</strong> for internet, phones, printers, and software</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gsv-local-banner">
          <div>
            <div className="gsv-eyebrow">Infrastructure + Security</div>
            <h2>Seamless network architecture and security systems.</h2>
          </div>

          <p>
            Our managed IT work connects directly with your physical infrastructure.
            We architect, install, and support network cabling, rack hardware, secure
            WiFi, camera networks, AI-powered surveillance, vehicle recognition,
            and proactive security alerts.
          </p>
        </section>

        <section className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Local Service Area</div>
            <h2>Supporting businesses across Placer County and Northern California.</h2>
            <p>
              Golden State Visions is based in Lincoln, CA and supports businesses
              across Lincoln, Rocklin, Roseville, Granite Bay, Folsom, Auburn, Truckee,
              Tahoe, Sunnyvale, San Jose, Mountain View, and surrounding areas.
            </p>
          </div>

          <div className="gsv-area-grid">
            <span>Lincoln, CA</span>
            <span>Rocklin, CA</span>
            <span>Roseville, CA</span>
            <span>Granite Bay, CA</span>
            <span>Folsom, CA</span>
            <span>Auburn, CA</span>
            <span>Truckee, CA</span>
            <span>Tahoe, CA</span>
            <span>Sunnyvale, CA</span>
            <span>San Jose, CA</span>
            <span>Mountain View, CA</span>
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Next Step</div>
              <h2>Optimize your business infrastructure.</h2>
              <p>
                Schedule a focused 30-minute technology consultation. We’ll review your
                current setup, identify immediate opportunities, and help map the right
                support path forward.
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
                Business IT, secure networks, home camera systems, smart home integration,
                and technology procurement built for long-term reliability.
              </p>
            </div>

            <div className="gsv-footer-column">
              <h4>Services</h4>
              <a href="/services/managed-it">Managed IT Services</a>
              <a href="/services/networks-security-systems">Networks & Security Systems</a>
              <a href="/services/smart-home-automation">Smart Home Automation</a>
              <a href="/services/audio-video-surveillance">Audio, Video & Surveillance</a>
            </div>

            <div className="gsv-footer-column">
              <h4>Areas We Serve</h4>
              <a href="/#contact">Lincoln, CA</a>
              <a href="/#contact">Rocklin, CA</a>
              <a href="/#contact">Roseville, CA</a>
              <a href="/#contact">Granite Bay, CA</a>
              <a href="/#contact">Folsom, CA</a>
              <a href="/#contact">Auburn, CA</a>
              <a href="/#contact">Truckee, CA</a>
              <a href="/#contact">Tahoe, CA</a>
              <a href="/#contact">Sunnyvale, CA</a>
              <a href="/#contact">San Jose, CA</a>
              <a href="/#contact">Mountain View, CA</a>
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
EOFcd /Users/cory/projects/gsv-tech
