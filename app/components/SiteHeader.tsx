import Image from "next/image";
import Link from "next/link";
import MenuInteractions from "@/app/components/MenuInteractions";

export default function SiteHeader() {
  return (
    <header className="gsv-header">
      <MenuInteractions />

      <Link href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
        <Image
          src="/images/gsv-logo.png"
          alt="Golden State Visions Managed IT Services"
          width={1798}
          height={877}
          className="gsv-logo-img"
          priority
        />
      </Link>

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
                      <span className="gsv-menu-title">Networks &amp; Security Systems</span>
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
                      <span className="gsv-menu-title">Audio, Video &amp; Surveillance</span>
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
  );
}
