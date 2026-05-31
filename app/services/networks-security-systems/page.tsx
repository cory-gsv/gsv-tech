import SiteFooter from "@/app/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Networks & Security Systems | Golden State Visions",
 description: "Structured cabling, secure business networks, IP surveillance, NVR systems, wireless coverage, and access control planning for businesses and properties in Northern California.",
};

export default function NetworksSecuritySystemsPage() {
 return (
 <main id="top" className="gsv-page">
 <div className="gsv-shell">
 <header className="gsv-header">
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

 <section id="managed-it-support" className="gsv-section">
 <div className="gsv-section-head">
 <div className="gsv-eyebrow">What We Manage</div>
 <h2>Secure network infrastructure for modern businesses and properties.</h2>
 <p>Our infrastructure deployments are engineered for dependable performance, clean physical organization, and long-term stability.</p>
 </div>

 <div className="gsv-card-grid">
 <div className="gsv-card">
 <div className="gsv-eyebrow">01</div>
 <h3>Structured Cabling & Architecture</h3>
 <p>Clean, physical-layer engineering built for neat rack layouts, reliable data paths, and seamless hardware growth.</p>
 <ul>
  <li>Cat6 and fiber optic structured cabling design and implementation</li>
  <li>Precision server rack builds, vertical patch management, and clean cable tracing</li>
  <li>Demarcation extensions, clean pathway planning, and physical device positioning</li>
  <li>Certified cable testing, path labeling, and lifecycle infrastructure documentation</li>
 </ul>
 </div>

 <div className="gsv-card">
 <div className="gsv-eyebrow">02</div>
 <h3>Business Security & IP Surveillance</h3>
 <p>High-performance security ecosystems built around local storage networks to protect your data privacy and eliminate cloud subscription fees.</p>
 <ul>
  <li>High-definition IP security camera layout, clean mounting, and lens optimization</li>
  <li>Continuous network video recorder (NVR) installation and high-capacity storage setups</li>
  <li>AI-powered smart surveillance featuring vehicle recognition and instant perimeter alerts</li>
  <li>Secure remote viewing configurations for real-time monitoring across your phones and desktops</li>
 </ul>
 </div>

 <div className="gsv-card">
 <div className="gsv-eyebrow">03</div>
 <h3>Secure Wireless & Access Control Planning</h3>
 <p>Intelligent wireless coverage and electronic physical barriers designed to separate public access from your critical internal systems.</p>
 <ul>
  <li>High-density business Wi-Fi deployment, predictive RF mapping, and wireless heatmaps</li>
  <li>Smart access control, keyless door entry setups, and video intercom implementation</li>
  <li>Network segmentation dividing internal operations, guest access, and smart devices</li>
  <li>Gateway deployment, hardware firewall provisioning, and active network threat mitigation</li>
 </ul>
 </div>
 </div>
 </section>

 <section className="gsv-local-banner gsv-managed-it-banner">
 <div>
  <div className="gsv-eyebrow">Infrastructure + Security</div>
  <h2>Where architecture meets engineering.</h2>
 </div>

 <p>
  <strong>We design, install, and support</strong> robust physical layer networks, from
  high-density structured cabling to precision enterprise server racks. By unifying
  your core networking components with advanced surveillance hardware, we deliver
  high-performance ecosystems engineered for maximum speed, security, and long-term
  operational uptime.
 </p>
 </section>

 <section className="gsv-section gsv-managed-service-area-section">
 <div className="gsv-section-head">
  <div className="gsv-eyebrow">Local Service Area</div>
  <h2>Supporting businesses across Placer County and Northern California.</h2>
  <p>
  Golden State Visions is based in Lincoln, CA and supports businesses across Lincoln, Rocklin, Roseville, Granite Bay, Folsom, Auburn, Truckee, Tahoe, Sugar Bowl, Sunnyvale, Mountain View, Palo Alto, Santa Clara, Cupertino, Los Altos, San Jose, and surrounding areas.
  </p>
 </div>

 <ul className="gsv-area-grid gsv-managed-area-grid">
  <li><Link href="/locations/lincoln-ca">Lincoln, CA</Link></li>
  <li><Link href="/locations/rocklin-ca">Rocklin, CA</Link></li>
  <li><Link href="/locations/roseville-ca">Roseville, CA</Link></li>
  <li><Link href="/locations/granite-bay-ca">Granite Bay, CA</Link></li>
  <li><Link href="/locations/folsom-ca">Folsom, CA</Link></li>
  <li><Link href="/locations/auburn-ca">Auburn, CA</Link></li>
  <li><Link href="/locations/truckee-ca">Truckee, CA</Link></li>
  <li><Link href="/locations/tahoe-ca">Tahoe, CA</Link></li>
  <li><Link href="/locations/sugar-bowl-ca">Sugar Bowl, CA</Link></li>
  <li><Link href="/locations/sunnyvale-ca">Sunnyvale, CA</Link></li>
  <li><Link href="/locations/mountain-view-ca">Mountain View, CA</Link></li>
  <li><Link href="/locations/palo-alto-ca">Palo Alto, CA</Link></li>
  <li><Link href="/locations/santa-clara-ca">Santa Clara, CA</Link></li>
  <li><Link href="/locations/cupertino-ca">Cupertino, CA</Link></li>
  <li><Link href="/locations/los-altos-ca">Los Altos, CA</Link></li>
  <li><Link href="/locations/san-jose-ca">San Jose, CA</Link></li>
 </ul>
 </section>

 <section className="gsv-section gsv-managed-next-step-section">
 <div className="gsv-section-head gsv-managed-next-step-head">
  <div className="gsv-eyebrow">Next Step</div>
 </div>

 <div className="gsv-managed-next-step-card">
  <div className="gsv-managed-next-step-copy">
  <h2>Optimize your business infrastructure.</h2>

  <p>
   Schedule a focused 30-minute technology consultation. We’ll review your
   current setup, identify immediate opportunities, and help map the right
   support path forward.
  </p>

  <div className="gsv-managed-next-step-utility">
   <span><strong>Hours:</strong> Mon - Fri: 8:00 AM - 6:00 PM</span>
   <span><strong>Call:</strong> (916) 432-3373</span>
  </div>
  </div>

  <div className="gsv-managed-next-step-action">
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
