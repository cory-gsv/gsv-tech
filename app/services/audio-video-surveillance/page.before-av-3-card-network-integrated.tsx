import SiteFooter from "@/app/components/SiteFooter";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Audio, Video & Surveillance Systems | Golden State Visions",
 description: "Custom whole-home audio, dedicated media rooms, home theater systems, AI surveillance, local NVR recording, and secure residential AV infrastructure across Northern California.",
};

export default function AudioVideoSurveillancePage() {
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
  <div className="gsv-eyebrow">Audio, Video &amp; Surveillance</div>
  <h2>High-fidelity audio environments and intelligent surveillance ecosystems.</h2>
  <p>Golden State Visions designs, installs, and supports bespoke media architecture and smart security infrastructure. From custom home theaters to whole-home high-fidelity sound and local AI surveillance networks, we blend precision AV engineering with your home’s unique interior design across Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region.</p>
  </div>

  <div className="gsv-card-grid">
    <div className="gsv-card">
  <div className="gsv-eyebrow">01</div>
  <h3>Home Network &amp; Core Infrastructure</h3>
  <p>High-performance, enterprise-grade routing and wireless backbones engineered to seamlessly handle dense data traffic across all connected subsystems.</p>
  <ul>
   <li><strong>Proactive local routing engines</strong> featuring high-throughput processing to protect, inspect, and route data at maximum fiber-optic speeds</li>
   <li><strong>Next-generation wireless access points</strong> strategically mapped across the property to provide seamless, high-speed Wi-Fi coverage across interior spaces and outdoor living areas</li>
   <li><strong>Dedicated hardware isolation</strong> separating your core data network from smart appliances, audio matrix units, and video distribution systems to ensure zero interference</li>
   <li><strong>High-capacity Power over Ethernet (PoE+) architecture</strong> driving centralized power straight to ceiling access points, touch panels, and surveillance systems over a single cable</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">02</div>
  <h3>Whole-Home Custom Audio Systems</h3>
  <p>Distributed high-fidelity sound engineered to deliver seamless acoustic performance throughout your property without visible equipment clutter.</p>
  <ul>
   <li><strong>Premium multi-room distribution</strong> featuring high-performance architectures from Russound, Marantz, Leon, AudioControl, and McIntosh</li>
   <li><strong>High-resolution streaming arrays</strong> driven by Bluesound wireless zones, keeping Sonos environments seamlessly supported but fully optimized</li>
   <li><strong>Precision architectural speaker installation</strong> utilizing flush, paintable, or entirely invisible in-wall drivers from Bowers &amp; Wilkins and Focal</li>
   <li><strong>Centralized hardware rack layout</strong> to eliminate clunky receivers from sitting in your living spaces</li>
   <li><strong>Intuitive streaming zone configuration</strong> for instant playback controls across your phones and tablets</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">03</div>
  <h3>Dedicated Movie Theater &amp; Media Rooms</h3>
  <p>Private cinematic environments tailored with precise viewing angles, structural acoustic treatments, and high-performance projection systems.</p>
  <ul>
   <li><strong>Bespoke home theater layout planning</strong>, room scaling, and seating alignment engineering</li>
   <li><strong>High-definition 4K laser projection setups</strong> paired with acoustically transparent woven screens</li>
   <li><strong>Dolby Atmos spatial surround sound tuning</strong> for rich, studio-grade cinematic immersion</li>
   <li><strong>One-touch environment automation</strong> to lower screens, dim architectural lighting, and start the film</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">04</div>
  <h3>Advanced AI Surveillance &amp; Local Recordings</h3>
  <p>Secure, privacy-first camera grids built on local storage networks to remove monthly fees and protect your data from public cloud breaches.</p>
  <ul>
   <li><strong>High-definition security camera positioning</strong>, architectural mounting, and lens optimization</li>
   <li><strong>Continuous local network video recording (NVR)</strong> utilizing high-capacity secure storage arrays</li>
   <li><strong>Edge-AI processing</strong> featuring intelligent vehicle detection, license plate tracking, and facial recognition</li>
   <li><strong>Encrypted remote viewing client setups</strong> for private, real-time tracking on your personal devices</li>
  </ul>
  </div>
  </div>
 </section>

 <section className="gsv-local-banner gsv-managed-it-banner">
  <div>
   <div className="gsv-eyebrow">Audio, Video &amp; Surveillance</div>
   <h2>Where performance meets security.</h2>
  </div>

  <p>
   <strong>We design, install, and support</strong> your home's entertainment, network,
   and safety infrastructure. We combine high-performance local routing engines with
   premium audio architectures like Russound and Marantz, masterfully calibrated media
   rooms, and smart surveillance arrays. The result is a unified, secure ecosystem that
   delivers pristine audio-visual immersion over an ultra-stable, private network.
  </p>
 </section>

 <section className="gsv-section gsv-managed-service-area-section">
  <div className="gsv-section-head">
   <div className="gsv-eyebrow">Local Service Area</div>
   <h2>Supporting premium audio, video, and security systems across Northern California.</h2>
   <p>
    Golden State Visions is based in Lincoln, CA and supports businesses across Lincoln, Rocklin, Roseville, Granite Bay, Folsom, Auburn, Truckee, Tahoe, Sugar Bowl, Sunnyvale, Mountain View, Palo Alto, Santa Clara, Cupertino, Los Altos, San Jose, and surrounding areas.
   </p>
  </div>

  <ul className="gsv-area-grid gsv-managed-area-grid">
   <li><a href="/locations/lincoln-ca">Lincoln, CA</a></li>
   <li><a href="/locations/rocklin-ca">Rocklin, CA</a></li>
   <li><a href="/locations/roseville-ca">Roseville, CA</a></li>
   <li><a href="/locations/granite-bay-ca">Granite Bay, CA</a></li>
   <li><a href="/locations/folsom-ca">Folsom, CA</a></li>
   <li><a href="/locations/auburn-ca">Auburn, CA</a></li>
   <li><a href="/locations/truckee-ca">Truckee, CA</a></li>
   <li><a href="/locations/tahoe-ca">Tahoe, CA</a></li>
   <li><a href="/locations/sugar-bowl-ca">Sugar Bowl, CA</a></li>
   <li><a href="/locations/sunnyvale-ca">Sunnyvale, CA</a></li>
   <li><a href="/locations/mountain-view-ca">Mountain View, CA</a></li>
   <li><a href="/locations/palo-alto-ca">Palo Alto, CA</a></li>
   <li><a href="/locations/santa-clara-ca">Santa Clara, CA</a></li>
   <li><a href="/locations/cupertino-ca">Cupertino, CA</a></li>
   <li><a href="/locations/los-altos-ca">Los Altos, CA</a></li>
   <li><a href="/locations/san-jose-ca">San Jose, CA</a></li>
  </ul>
 </section>

 <section className="gsv-section gsv-managed-next-step-section">
  <div className="gsv-section-head gsv-managed-next-step-head">
   <div className="gsv-eyebrow">Next Step</div>
  </div>

  <div className="gsv-managed-next-step-card">
   <div className="gsv-managed-next-step-copy">
    <h2>Design your custom media and surveillance infrastructure.</h2>

    <p>Schedule a dedicated 30-minute residential technology consultation. We'll review your property layout, evaluate your entertainment preferences, evaluate your home network coverage, discuss security requirements, and map a clear structural path for enterprise routing, whole-home audio, dedicated theaters, and localized AI surveillance grids.</p>

    <div className="gsv-managed-next-step-utility">
     <span><strong>Hours:</strong> Mon – Fri: 8:00 AM – 6:00 PM</span>
     <span><strong>Call:</strong> (916) 432-3373</span>
    </div>
   </div>

   <div className="gsv-managed-next-step-action">
    <a href="/book-consult" className="gsv-btn gsv-btn-primary">
     Book a Consult
    </a>
   </div>
  </div>
 </section>
      <SiteFooter />
 </div>
 </main>
 );
}
