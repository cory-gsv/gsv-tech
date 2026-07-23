import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import TechnologyPartnersSection from "@/app/components/TechnologyPartnersSection";

function ServiceBlock({
  eyebrow,
  title,
  text,
  items,
}: {
  eyebrow: string;
  title: string;
  text: string;
  items: string[];
}) {
  return (
    <section className="gsv-card">
      <div className="gsv-eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-section">
          <div className="gsv-section-head gsv-section-head-dark">
            <div className="gsv-eyebrow">Services</div>
            <h2>Comprehensive IT, networking, smart home, and audio/video solutions.</h2>
            <p>
              Golden State Visions is a local team that supports small and
              medium-sized businesses with buildouts, ongoing support, and
              scalable infrastructure, while also delivering premium
              connected-home solutions including Lutron HomeWorks.
            </p>
          </div>

          <div className="gsv-card-grid gsv-services-card-grid">
            <ServiceBlock
              eyebrow="01"
              title="Managed IT Services"
              text="Business technology planning, cloud platform administration, cybersecurity, and day-to-day IT support for growing organizations."
              items={[
                "Managed IT services, remote support, and vendor coordination",
                "Endpoint protection and threat detection (EDR)",
                "Backup, disaster recovery, and business continuity planning",
                "HIPAA and PCI compliance support",
              ]}
            />

            <ServiceBlock
              eyebrow="02"
              title="Networks & Security Systems"
              text="Reliable, secure network infrastructure for small to medium-sized offices, custom homes, and multi-device environments."
              items={[
                "Network architecture, gateway, and firewall implementation",
                "Wi-Fi design, coverage planning, and performance optimization",
                "Structured cabling, rack design, and infrastructure organization",
                "VLAN segmentation, access control, and secure site-to-site connectivity",
              ]}
            />

            <ServiceBlock
              eyebrow="03"
              title="Smart Home Automation"
              text="High-end residential technology systems built for performance, simplicity, and long-term usability."
              items={[
                "Lutron HomeWorks system design and integration",
                "Lighting control and scene programming",
                "Whole-home network planning",
                "Connected home consulting and system coordination",
              ]}
            />

            <ServiceBlock
              eyebrow="04"
              title="Audio, Video & Surveillance"
              text="Integrated audio, video, and camera systems for businesses and homes, designed to work together instead of as a pile of separate devices."
              items={[
                "Home theater and distributed audio design",
                "Commercial AV for conference rooms and shared spaces",
                "Camera systems, storage, and remote access planning",
                "Surveillance network segmentation and support documentation",
              ]}
            />
          </div>
        </section>

        <TechnologyPartnersSection />

        <section className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">How We Work</div>
            <h2>A single technology partner across business and residential environments.</h2>
            <p>
              We combine support, infrastructure, and automation into one cohesive
              service experience, reducing handoffs and giving clients a cleaner,
              more reliable path forward.
            </p>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Consult & plan</h3>
              <p>
                We start with the environment, goals, and future needs so the
                solution is sized correctly from day one.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Build & deploy</h3>
              <p>
                We implement cleanly, document clearly, and focus on dependable
                performance over flashy complexity.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Support & evolve</h3>
              <p>
                As systems grow, we support, refine, and expand them with a
                long-term service mindset.
              </p>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
