import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { smartHomeStructuredData } from "@/app/data/structuredData";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Smart Home Automation, Lighting & AV Systems | Golden State Visions",
 description: "Smart home automation, Lutron lighting and shades, Control4, Home Assistant, media rooms, whole-home audio, and local surveillance systems across Lincoln, Roseville, Rocklin, Granite Bay, and Northern California.",
 alternates: {
  canonical: "/services/smart-home-automation",
 },
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
 <JsonLd data={smartHomeStructuredData()} />
 <div className="gsv-shell">
 <SiteHeader />

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
