import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Audio, Video & Surveillance Systems | Golden State Visions",
 description: "Custom whole-home audio, dedicated media rooms, home theater systems, AI surveillance, local NVR recording, and secure residential AV infrastructure across Northern California.",
 openGraph: {
  title: "Audio, Video & Surveillance Systems | Golden State Visions",
  description:
   "Custom whole-home audio, dedicated media rooms, home theater systems, AI surveillance, local NVR recording, and secure residential AV infrastructure.",
  url: "/services/audio-video-surveillance",
  siteName: "Golden State Visions",
  type: "website",
  images: [
   {
    url: "/assets/images/portfolio/audio-video-surveillance-banner.png",
    width: 1847,
    height: 851,
    alt: "Audio video and surveillance smart home theater illustration with connected lighting, projection, speakers, control, and security systems",
   },
  ],
 },
 twitter: {
  card: "summary_large_image",
  title: "Audio, Video & Surveillance Systems | Golden State Visions",
  description:
   "Whole-home audio, media rooms, home theater systems, AI surveillance, local NVR recording, and secure residential AV infrastructure.",
  images: ["/assets/images/portfolio/audio-video-surveillance-banner.png"],
 },
};

export default function AudioVideoSurveillancePage() {
 return (
  <main id="top" className="gsv-page">
   <div className="gsv-shell">
 <SiteHeader />

 <section id="managed-it-support" className="gsv-section">
  <div className="gsv-section-head">
  <div className="gsv-eyebrow">Audio, Video &amp; Surveillance</div>
  <h2>High-fidelity audio environments and intelligent surveillance ecosystems.</h2>
  <p>Golden State Visions designs, installs, and supports bespoke media architecture and smart security infrastructure. From custom home theaters to whole-home high-fidelity sound and local AI surveillance networks, we blend precision AV engineering with your home’s unique interior design across Lincoln, Roseville, Rocklin, Granite Bay, and the greater Sacramento region.</p>
  </div>

  <div className="gsv-card-grid gsv-av-card-grid">
      <div className="gsv-card">
  <div className="gsv-eyebrow">01</div>
  <h3>Intelligent Network &amp; Custom Audio Systems</h3>
  <p>High-throughput network routing and distributed high-fidelity sound engineered to deliver seamless, zero-latency acoustic performance across your entire property.</p>
  <ul>
   <li><strong>Proactive local routing engines</strong> featuring high-throughput traffic management to drive high-resolution streaming audio across the property without dropping frames</li>
   <li><strong>Next-generation wireless access points</strong> strategically mapped across interior and outdoor living spaces to handle dense smart home data demands</li>
   <li><strong>Premium multi-room distribution</strong> featuring high-performance hardware architectures from Russound, Marantz, Leon, and AudioControl</li>
   <li><strong>High-capacity Power over Ethernet (PoE+)</strong> to drive centralized power straight to ceiling-mounted access points, architectural audio zones, and in-wall touch panels</li>
   <li><strong>High-resolution streaming arrays</strong> driven by Bluesound wireless zones, keeping Sonos environments completely optimized and supported</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">02</div>
  <h3>Dedicated Movie Theater &amp; Media Rooms</h3>
  <p>Private cinematic environments tailored with precise viewing angles, structural acoustic treatments, and high-performance, network-optimized projection systems.</p>
  <ul>
   <li><strong>Bespoke home theater layout planning</strong>, room scaling, acoustic treatment orchestration, and seating alignment engineering</li>
   <li><strong>High-definition 4K laser projection setups</strong> paired with acoustically transparent woven micro-perforated screens</li>
   <li><strong>Dedicated high-bandwidth network pipelines</strong> to seamlessly feed uncompressed 4K video streams to centralized media matrices without buffering or lag</li>
   <li><strong>Dolby Atmos spatial surround sound tuning</strong> for rich, studio-grade cinematic immersion and object-based audio tracking</li>
   <li><strong>One-touch environment automation</strong> to lower projection screens, dim architectural lighting scenes, and activate audio-visual feeds instantly</li>
  </ul>
  </div>

  <div className="gsv-card">
  <div className="gsv-eyebrow">03</div>
  <h3>Advanced AI Surveillance &amp; Private Recording</h3>
  <p>Secure, privacy-first camera grids built on dedicated, isolated local networks to remove monthly subscription fees and protect your data.</p>
  <ul>
   <li><strong>Dedicated network hardware isolation</strong> separating your security grid from main property Wi-Fi to guarantee 100% uptime and zero cross-device interference</li>
   <li><strong>High-definition security camera positioning</strong>, weatherproof architectural mounting, and lens field-of-view optimization</li>
   <li><strong>Continuous local network video recording (NVR)</strong> utilizing high-capacity secure storage arrays running entirely on-premises</li>
   <li><strong>Edge-AI processing</strong> featuring intelligent vehicle detection, license plate tracking, and facial recognition without relying on vulnerable cloud servers</li>
   <li><strong>Encrypted local remote-access clients</strong> for secure, real-time tracking on your personal mobile devices from anywhere in the world</li>
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
   <strong>We design, install, and support</strong> your home&apos;s entertainment, network,
   and safety infrastructure. We combine high-performance local routing engines with
   premium audio architectures like Russound and Marantz, masterfully calibrated media
   rooms, and isolated smart surveillance arrays. The result is a unified, secure
   ecosystem that delivers pristine audio-visual immersion over an ultra-stable,
   private network.
  </p>

  <div className="gsv-av-banner-image-wrap">
   <Image
    src="/assets/images/portfolio/audio-video-surveillance-banner.png"
    alt="Audio video and surveillance smart home theater illustration with connected lighting, projection, speakers, control, and security systems"
    width={1847}
    height={851}
    className="gsv-av-banner-image"
    loading="lazy"
    unoptimized
   />
  </div>
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
    <h2>Design your custom media and surveillance infrastructure.</h2>

    <p>Schedule a dedicated 30-minute residential technology consultation. We&apos;ll review your property layout, evaluate your entertainment preferences, audit your home network coverage, discuss security requirements, and map a clear structural path for enterprise routing, whole-home audio, dedicated theaters, and localized AI surveillance grids.</p>

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
