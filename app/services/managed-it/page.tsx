import SiteFooter from "@/app/components/SiteFooter";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Managed IT Services & Workspace Support | Lincoln, CA",
 description:
  "Proactive enterprise-grade IT support, server architecture design, and cloud workforce provisioning. Scalable technology management engineered for modern offices.",
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

 <section id="managed-it-support" className="gsv-section">
  <div className="gsv-section-head">
  <div className="gsv-eyebrow">What We Manage</div>
  <h2>Practical IT support for small to medium size businesses.</h2>
  <p>
  Our managed IT services are built around dependable support, clean
  documentation, proactive monitoring, and scalable business infrastructure.
  </p>
  </div>

  <div className="gsv-card-grid">
  <div className="gsv-card">
  <div className="gsv-eyebrow">01</div>
  <h3>User & Endpoint Management</h3>
  <p>Day-to-day proactive support for your employees, optimizing hardware performance, and securing user devices.</p>
  <ul>
   <li>Proactive desktop and laptop monitoring, maintenance, and remote help desk support</li>
   <li>Streamlined user onboarding and offboarding directory configuration</li>
   <li>Automated cloud backups for individual client workstations and employee data protection</li>
   <li>Mobile device management (MDM) deployment to secure endpoints outside the office</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">02</div>
  <h3>Cloud Productivity & Identity</h3>
  <p>Secure, business-grade digital workspaces engineered for seamless communication and absolute access control.</p>
  <ul>
   <li>Microsoft 365 and Google Workspace tenant design, migration, and administration</li>
   <li>Centralized identity management, multi-factor authentication (MFA), and secure single sign-on</li>
   <li>Managed cloud storage layout, shared drive architecture, and permission governance</li>
   <li>Cloud-to-cloud backup architecture for email, shared drives, and collaboration data</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">03</div>
  <h3>Continuity & Infrastructure Support</h3>
  <p>Active monitoring and technical oversight engineered to shield your critical data assets from operational vulnerabilities.</p>
  <ul>
   <li>Security baseline deployment, advanced anti-malware, and endpoint threat detection</li>
   <li>Server infrastructure design, virtualization management, and active storage optimization</li>
   <li>Disaster recovery engineering, on-site server backups, and data restoration planning</li>
   <li>Continuous network health monitoring, compliance security audits, and lifecycle documentation</li>
  </ul>
  </div>
  </div>
 </section>

 <section className="gsv-local-banner gsv-managed-it-banner">
  <div>
   <div className="gsv-eyebrow">Infrastructure + Security</div>
   <h2>Where strategy meets engineering.</h2>
  </div>

  <p>
   <strong>We design, install, and support</strong> the underlying digital infrastructure
   that drives modern businesses. We combine proactive user management and secure cloud
   workspaces with optimized internal server systems, delivering a unified technology
   ecosystem that simplifies your workflows while maintaining absolute data privacy
   and threat protection.
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
    <h2>Optimize your business infrastructure.</h2>

    <p>
     Schedule a focused 30-minute technology consultation. We’ll review your
     current setup, identify immediate opportunities, and help map the right
     support path forward.
    </p>

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
