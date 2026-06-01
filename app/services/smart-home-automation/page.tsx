import SiteFooter from "@/app/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Smart Home Automation, Lighting & AV Systems | Golden State Visions",
 description: "Smart home automation, Lutron lighting and shades, Control4, Home Assistant, media rooms, whole-home audio, and local surveillance systems across Lincoln, Roseville, Rocklin, Granite Bay, and Northern California.",
 openGraph: {
  title: "Smart Home Automation, Lighting & AV Systems | Golden State Visions",
  description:
   "Smart home automation, Lutron lighting and shades, whole-home control, media rooms, audio, and local surveillance systems across Northern California.",
  url: "/services/smart-home-automation",
  siteName: "Golden State Visions",
  type: "website",
  images: [
   {
    url: "/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png",
    width: 1655,
    height: 797,
    alt: "Smart home automation circuit board illustration showing connected lighting, climate, security, audio, energy, and control systems",
   },
  ],
 },
 twitter: {
  card: "summary_large_image",
  title: "Smart Home Automation, Lighting & AV Systems | Golden State Visions",
  description:
   "Smart home automation, Lutron lighting and shades, whole-home control, audio, and local surveillance systems.",
  images: ["/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png"],
 },
};

export default function SmartHomeAutomationPage() {
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
  <div className="gsv-eyebrow">Smart Home &amp; Automation</div>
  <h2>Automation architecture and luxury home entertainment.</h2>
  <p>Golden State Visions designs, installs, and supports residential automation frameworks. Whether orchestrating a whole-house ecosystem or engineering advanced open-source deployments, we seamlessly blend architectural design with whole-home technology across Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region.</p>
  </div>

  <div className="gsv-card-grid">
  <div className="gsv-card">
  <div className="gsv-eyebrow">01</div>
  <h3>Intelligent Lighting &amp; Shade Systems</h3>
  <p>High-end environmental management control designed to enhance ambiance, emphasize architecture, maximize natural daylight, and reduce visual clutter.</p>
  <ul>
   <li><strong>Lutron HomeWorks</strong> systems designed for absolute reliability and enterprise-grade architectural control</li>
   <li><strong>Lutron Palladiux</strong> hardware tailored for modern, responsive, and ultra-quiet smart lighting</li>
   <li><strong>Motorized shades</strong>, drapes, and blind tracking synchronized with natural daylight cycles</li>
   <li><strong>Custom keypads</strong> and flush-mounted panels tailored to match your interior architectural design</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">02</div>
  <h3>Whole-Home Platform Orchestration</h3>
  <p>Seamless integration platforms built to unify complex independent systems into single, intuitive control interfaces.</p>
  <ul>
   <li><strong>Control4 ecosystem</strong> engineering for high-end luxury environments, climate, and safety</li>
   <li><strong>Home Assistant server</strong> deployments for advanced, customized automation and open-source versatility</li>
   <li><strong>Platform bridging</strong> to have Apple Home, Google Home, or Amazon Alexa working flawlessly together</li>
   <li><strong>Local-first automation</strong> architectures running entirely on your property to maintain data privacy and zero cloud dependence</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">03</div>
  <h3>Media Rooms, Audio &amp; Local Surveillance</h3>
  <p>High-fidelity residential entertainment spaces paired with zero-compromise, on-premises security arrays.</p>
  <ul>
   <li><strong>Multi-room architectural audio</strong> networks with discrete pixel-aligned architectural speaker arrays</li>
   <li><strong>Centralized matrix video</strong> distribution systems for zero-clutter media rooms and multi-zone display feeds</li>
   <li><strong>Smart residential camera</strong> layouts utilizing local edge AI processing and facial recognition</li>
   <li><strong>Privacy-first network video recording</strong> systems locked locally back securely to your property</li>
  </ul>
  </div>
  </div>
 </section>

 <section className="gsv-local-banner gsv-managed-it-banner">
  <div>
   <div className="gsv-eyebrow">Smart Home Intelligence</div>
   <h2>Where design meets technology.</h2>
  </div>

  <p>
   <strong>We design, install, and support</strong> the underlying intelligence of your home.
   We combine world-class platform orchestration like Control4 and Home Assistant with luxury
   Lutron environments and advanced surveillance. The result is a unified, intuitive ecosystem
   that simplifies your daily routines while maintaining complete network privacy and physical
   security.
  </p>

  <div className="gsv-smart-home-banner-image-wrap">
   <Image
    src="/assets/images/portfolio/smart-home-automation-ffc72c-transparent-v2.png"
    alt="Smart home automation circuit board illustration showing connected lighting, climate, security, audio, energy, and control systems"
    width={1655}
    height={797}
    className="gsv-smart-home-banner-image"
    loading="lazy"
   />
  </div>
 </section>

 <section className="gsv-section gsv-managed-service-area-section">
  <div className="gsv-section-head">
   <div className="gsv-eyebrow">Local Service Area</div>
   <h2>Supporting connected homes across Placer County and Northern California.</h2>
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
    <h2>Design your connected home infrastructure.</h2>

    <p>Schedule a focused 30-minute smart home consultation. We’ll review your current systems, discuss your goals, and help map a clean path for lighting, automation, networking, media, and surveillance.</p>

    <div className="gsv-managed-next-step-utility">
     <span><strong>Hours:</strong> Mon – Fri: 8:00 AM – 6:00 PM</span>
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
