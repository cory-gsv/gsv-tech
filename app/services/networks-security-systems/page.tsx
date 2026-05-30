import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Infrastructure & Business Security Systems | Lincoln, CA",
  description:
    "Precision physical layer engineering, custom server rack deployments, and certified Cat6 cabling. Integrated with on-device AI edge surveillance networks.",
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

  <section id="managed-it-" className="gsv-section">
   <div className="gsv-section-head">
   <div className="gsv-eyebrow">Network + Security Systems</div>
   <h2>Precision infrastructure for business networks, surveillance, and access control.</h2>
   <p>
    Our managed IT services are built around dependable , clean
    documentation, proactive monitoring, and scalable business infrastructure.
   </p>
   </div>

   <div className="gsv-card-grid">
   <div className="gsv-card">
    <div className="gsv-eyebrow">01</div>
    <h3>Structured Cabling & Architecture</h3>
    <p>
                Clean, physical-layer engineering built for neat rack layouts, reliable data paths, and seamless hardware growth.
              </p>
    <ul>
    <li><strong>Cat6 and fiber optic structured cabling design and implementation</strong></li>
    <li><strong>Precision server rack builds, vertical patch management, and clean cable tracing</strong></li>
    <li><strong>Demarcation extensions, infrastructure labeling, and architectural pathway planning</strong></li>
    <li><strong>Fluke testing, certification, and hardware lifecycle deployment documentation</strong>, </li>
    </ul>
   </div>

   <div className="gsv-card">
    <div className="gsv-eyebrow">02</div>
    <h3>Business Security & IP Surveillance</h3>
    <p>
                High-performance security ecosystems built around local storage networks to protect your data privacy and eliminate cloud subscription fees.
              </p>
    <ul>
    <li><strong>High-definition IP security camera positioning, mounting, and lens optimization</strong></li>
    <li><strong>Continuous network video recorder (NVR) installation and local storage array building</strong></li>
    <li><strong>AI-powered smart surveillance featuring vehicle recognition and real-time perimeter alerts</strong> </li>
    <li><strong>Secure remote viewing configuration via encrypted mobile and desktop client interfaces</strong> </li>
    </ul>
   </div>

   <div className="gsv-card">
    <div className="gsv-eyebrow">03</div>
    <h3>Secure Wireless & Access Control</h3>
    <p>
                Intelligent wireless coverage and electronic physical barriers designed to separate public access from your critical internal systems.
              </p>
    <ul>
    <li><strong>High-density business Wi-Fi planning, predictive RF mapping, and wireless coverage heatmaps</strong></li>
    <li><strong>Smart access control, keyless door entry systems, and IP intercom implementation</strong></li>
    <li><strong>Network segmentation dividing staff operations, guest access, point-of-sale systems, and IoT devices</strong> </li>
    <li><strong>Gateway management, hardware firewall provisioning, and active network threat mitigation</strong> </li>
    </ul>
   </div>
   </div>
  </section>

  <section className="gsv-local-banner">
   <div>
   <div className="gsv-eyebrow">Infrastructure + Security</div>
   <h2>Where architecture meets engineering.</h2>
   </div>

        <p>
      We <strong>design, install, and </strong> the physical backbone of your
      technology—from precision structured cabling to enterprise network racks [1].
      Your infrastructure is then paired with intelligent surveillance networks,
      using on-device AI for vehicle recognition, license plate tracking, and
      proactive security alerts that keep you ahead of threats.
     </p>
  </section>

  <section className="gsv-section">
   <div className="gsv-section-head">
   <div className="gsv-eyebrow">Local Service Area</div>
   <h2>Supporting businesses across Placer County and Northern California.</h2>
   <p>
    Golden State Visions is based in Lincoln, CA and s businesses
    across Lincoln, Rocklin, Roseville, Granite Bay, Folsom, Auburn, Truckee,
    Tahoe, Sunnyvale, San Jose, Mountain View, and surrounding areas.
   </p>
   </div>

   <ul className="gsv-area-grid" aria-label="Managed IT service areas">
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
    <h2>Optimize your business infrastructure.</h2>
    <p>
    Schedule a focused 30-minute technology consultation. We’ll review your
    current setup, identify immediate opportunities, and help map the right
     path forward.
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
