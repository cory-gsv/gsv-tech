import SiteFooter from "@/app/components/SiteFooter";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Smart Home Systems & Custom Automation | Lincoln, CA",
  description:
    "Bespoke home automation architecture integrating Lutron HomeWorks, Lutron Caséta, Control4, and Home Assistant. Localized processing for absolute estate privacy.",
};

export default function SmartHomeAutomationPage() {
  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <header className="gsv-header">
          <a href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
            <img
              src="/images/gsv-logo.png"
              alt="Golden State Visions Smart Home Automation"
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
   </a>

                        <a href="/services/networks-security-systems" className="gsv-services-mega-card">
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

        <section id="managed-it-support" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Smart Home & Automation</div>
            <h2>Bespoke automation architecture and luxury home entertainment.</h2>
            <p>
              Golden State Visions designs, installs, and supports world-class
              residential automation frameworks. Whether orchestrating elite dealer
              ecosystems or engineering advanced open-source deployments, we seamlessly
              blend architectural design with whole-home technology across Lincoln,
              Roseville, Rocklin, Granite Bay, and the greater Sacramento region.
            </p>
          </div>

          <div className="gsv-card-grid">
            <div className="gsv-card">
              <div className="gsv-eyebrow">01</div>
              <h3>Intelligent Lighting & Shade Systems</h3>
              <p>
                High-end architectural atmosphere control designed to eliminate wall
                clutter, automate natural daylight, and reduce visual noise.
              </p>
              <ul>
                <li><strong>Lutron HomeWorks systems</strong> designed for custom estates and enterprise-grade architectural control</li>
                <li><strong>Lutron Caséta infrastructure</strong> deployed for reliable, responsive, and seamless smart lighting</li>
                <li><strong>Motorized shades, drapes, and blind tracking</strong> synchronized with natural daylight cycles</li>
                <li><strong>Custom keypads and flush-mounted panels</strong> tailored to match your interior architectural design</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">02</div>
              <h3>Whole-Home Platform Orchestration</h3>
              <p>
                Seamless integration platforms built to unify independent subsystems
                into single, intuitive control interfaces.
              </p>
              <ul>
                <li><strong>Control4 ecosystem engineering</strong> for unified luxury entertainment, climate, and safety</li>
                <li><strong>Home Assistant server deployments</strong> for advanced, custom automation and open-source versatility</li>
                <li><strong>Platform bridging</strong> to keep Apple Home, Google Home, or Amazon Alexa working flawlessly together</li>
                <li><strong>Localized automation scripting</strong> running entirely on your property to maintain zero cloud dependence</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">03</div>
              <h3>Media Rooms, Audio & Local Surveillance</h3>
              <p>
                High-fidelity residential entertainment spaces paired with intelligent,
                privacy-first camera arrays.
              </p>
              <ul>
                <li><strong>Multi-room architectural audio networks</strong> and hidden structural speaker installations</li>
                <li><strong>Centralized matrix video distribution systems</strong> for zero-clutter media rooms and home theaters</li>
                <li><strong>Smart residential camera layout</strong> featuring local edge-AI processing and facial recognition</li>
                <li><strong>Privacy-first network video recording (NVR)</strong> storing your security data securely on-site</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gsv-local-banner">
          <div>
            <div className="gsv-eyebrow">Smart Home & Automation</div>
            <h2>Where design meets technology.</h2>
          </div>

          <p>
            We <strong>design, install, and support</strong> the underlying intelligence of
            your home. We combine world-class platform orchestration like Control4 and
            Home Assistant with luxury Lutron environments and advanced surveillance.
            The result is a unified, intuitive ecosystem that simplifies your daily
            routines while maintaining complete network privacy and physical security.
          </p>
        </section>

        <section className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Local Service Area</div>
            <h2>Supporting connected homes across Placer County and Northern California.</h2>
            <p>
              Golden State Visions is based in Lincoln, CA and supports residential
              technology projects across Lincoln, Rocklin, Roseville, Granite Bay,
              Folsom, Auburn, Truckee, Tahoe, Sunnyvale, San Jose, Mountain View,
              and surrounding areas.
            </p>
          </div>

          <ul className="gsv-area-grid" aria-label="Smart home automation service areas">
            <li><a href="/locations/lincoln-ca">Lincoln, CA</a></li>
            <li><a href="/locations/rocklin-ca">Rocklin, CA</a></li>
            <li><a href="/locations/roseville-ca">Roseville, CA</a></li>
            <li><a href="/locations/granite-bay-ca">Granite Bay, CA</a></li>
            <li><a href="/locations/folsom-ca">Folsom, CA</a></li>
            <li><a href="/locations/auburn-ca">Auburn, CA</a></li>
            <li><a href="/locations/truckee-ca">Truckee, CA</a></li>
            <li><a href="/locations/tahoe-ca">Tahoe, CA</a></li>
            <li><a href="/locations/sunnyvale-ca">Sunnyvale, CA</a></li>
            <li><a href="/locations/san-jose-ca">San Jose, CA</a></li>
            <li><a href="/locations/mountain-view-ca">Mountain View, CA</a></li>
          </ul>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Next Step</div>
              <h2>Design your connected home infrastructure.</h2>
              <p>
                Schedule a focused 30-minute smart home consultation. We’ll review your
                current systems, discuss your goals, and help map a clean path for lighting,
                automation, networking, media, and surveillance.
              </p>

              <div className="gsv-contact-utility" aria-label="Contact details">
                <span><strong>Hours:</strong> Mon – Fri: 8:00 AM – 6:00 PM</span>
                <span><strong>Call:</strong> (916) 432-3373</span>
              </div>
            </div>

            <div>
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>
            </div>
          </div>
        </section>
      <SiteFooter />
      </div>
    </main>
  );
}
