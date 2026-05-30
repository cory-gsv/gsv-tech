import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Home Theater Audio Video & AI Surveillance | Lincoln, CA",
  description:
    "Custom whole-home multi-room sound by Sonos, architectural theater engineering, and privacy-first local security networks with intelligent on-device AI tracking.",
};

export default function AudioVideoSurveillancePage() {
  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <header className="gsv-header">
          <a href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
            <img
              src="/images/gsv-logo.png"
              alt="Golden State Visions Audio Video Surveillance"
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

        <section id="managed-it-support" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Audio, Video & Surveillance</div>
            <h2>High-fidelity audio environments and intelligent surveillance ecosystems.</h2>
            <p>
              Golden State Visions designs, installs, and supports bespoke media
              architecture and smart security infrastructure. From custom home theaters
              to whole-home high-fidelity sound and local AI surveillance networks, we
              blend precision AV engineering with your home’s unique interior design
              across Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region.
            </p>
          </div>

          <div className="gsv-card-grid">
            <div className="gsv-card">
              <div className="gsv-eyebrow">01</div>
              <h3>Whole-Home Custom Audio Systems</h3>
              <p>
                Distributed high-fidelity sound engineered to deliver seamless acoustic
                performance throughout your property without visible equipment clutter.
              </p>
              <ul>
                <li><strong>Custom multi-room audio design</strong> from top manufacturers including Sonos, Leon, and Sonance</li>
                <li><strong>Precision architectural speaker installation</strong> utilizing flush, paintable, or entirely invisible in-wall drivers</li>
                <li><strong>Centralized hardware rack layout</strong> to eliminate clunky receivers from sitting in your living spaces</li>
                <li><strong>Intuitive streaming zone configuration</strong> for instant playback controls across your phones and tablets</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">02</div>
              <h3>Dedicated Movie Theater & Media Rooms</h3>
              <p>
                Private cinematic environments tailored with precise viewing angles,
                structural acoustic treatments, and high-performance projection systems.
              </p>
              <ul>
                <li><strong>Bespoke home theater layout planning</strong>, room scaling, and seating alignment engineering</li>
                <li><strong>High-definition 4K laser projection setups</strong> paired with acoustically transparent woven screens</li>
                <li><strong>Dolby Atmos spatial surround sound tuning</strong> for rich, studio-grade cinematic immersion</li>
                <li><strong>One-touch environment automation</strong> to lower screens, dim architectural lighting, and start the film</li>
              </ul>
            </div>

            <div className="gsv-card">
              <div className="gsv-eyebrow">03</div>
              <h3>Advanced AI Surveillance & Local Recordings</h3>
              <p>
                Secure, privacy-first camera grids built on local storage networks to
                remove monthly fees and protect your data from public cloud breaches.
              </p>
              <ul>
                <li><strong>High-definition security camera positioning</strong>, architectural mounting, and lens optimization</li>
                <li><strong>Continuous local network video recording (NVR)</strong> utilizing high-capacity secure storage arrays</li>
                <li><strong>Edge-AI processing</strong> featuring intelligent vehicle detection, license plate tracking, and facial recognition</li>
                <li><strong>Encrypted remote viewing client setups</strong> for private, real-time tracking on your personal devices</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gsv-local-banner">
          <div>
            <div className="gsv-eyebrow">Audio, Video & Surveillance</div>
            <h2>Where performance meets security.</h2>
          </div>

          <p>
            We <strong>design, install, and support</strong> your home’s entertainment
            and safety infrastructure. We combine premium audio architectures like
            Sonos with masterfully calibrated media rooms and smart surveillance networks.
            The result is a unified, intuitive ecosystem that delivers pristine
            audio-visual immersion while maintaining complete data privacy and physical
            perimeter security.
          </p>
        </section>

        <section className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Local Service Area</div>
            <h2>Supporting premium audio, video, and security systems across Northern California.</h2>
            <p>
              Golden State Visions is based in Lincoln, CA and supports residential
              AV and surveillance projects across Lincoln, Rocklin, Roseville,
              Granite Bay, Folsom, Auburn, Truckee, Tahoe, Sunnyvale, San Jose,
              Mountain View, and surrounding areas.
            </p>
          </div>

          <ul className="gsv-area-grid" aria-label="Audio video surveillance service areas">
            <li><a href="/locations/lincoln-ca/audio-video-surveillance">Lincoln, CA</a></li>
            <li><a href="/locations/rocklin-ca/audio-video-surveillance">Rocklin, CA</a></li>
            <li><a href="/locations/roseville-ca/audio-video-surveillance">Roseville, CA</a></li>
            <li><a href="/locations/granite-bay-ca/audio-video-surveillance">Granite Bay, CA</a></li>
            <li><a href="/locations/folsom-ca/audio-video-surveillance">Folsom, CA</a></li>
            <li><a href="/locations/auburn-ca/audio-video-surveillance">Auburn, CA</a></li>
            <li><a href="/locations/truckee-ca/audio-video-surveillance">Truckee, CA</a></li>
            <li><a href="/locations/tahoe-ca/audio-video-surveillance">Tahoe, CA</a></li>
            <li><a href="/locations/sunnyvale-ca/audio-video-surveillance">Sunnyvale, CA</a></li>
            <li><a href="/locations/san-jose-ca/audio-video-surveillance">San Jose, CA</a></li>
            <li><a href="/locations/mountain-view-ca/audio-video-surveillance">Mountain View, CA</a></li>
          </ul>
        </section>

        <section className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Next Step</div>
              <h2>Design your audio, video, and surveillance environment.</h2>
              <p>
                Schedule a focused 30-minute consultation. We’ll review your goals and map
                a clean path for whole-home audio, media rooms, video distribution,
                and local surveillance.
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

        <footer className="gsv-footer">
          <div className="gsv-footer-main">
            <div className="gsv-footer-brand">
              <a href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
                <img
                  src="/images/gsv-logo.png"
                  alt="Golden State Visions Audio Video Surveillance"
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
              <a href="/locations/lincoln-ca/audio-video-surveillance">Lincoln, CA</a>
              <a href="/locations/rocklin-ca/audio-video-surveillance">Rocklin, CA</a>
              <a href="/locations/roseville-ca/audio-video-surveillance">Roseville, CA</a>
              <a href="/locations/granite-bay-ca/audio-video-surveillance">Granite Bay, CA</a>
              <a href="/locations/folsom-ca/audio-video-surveillance">Folsom, CA</a>
              <a href="/locations/auburn-ca/audio-video-surveillance">Auburn, CA</a>
              <a href="/locations/truckee-ca/audio-video-surveillance">Truckee, CA</a>
              <a href="/locations/tahoe-ca/audio-video-surveillance">Tahoe, CA</a>
              <a href="/locations/sunnyvale-ca/audio-video-surveillance">Sunnyvale, CA</a>
              <a href="/locations/san-jose-ca/audio-video-surveillance">San Jose, CA</a>
              <a href="/locations/mountain-view-ca/audio-video-surveillance">Mountain View, CA</a>
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
