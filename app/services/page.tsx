import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

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
            <h2>Comprehensive IT, networking, and smart home solutions.</h2>
            <p>
              Golden State Visions supports small and medium-sized businesses with buildouts,
              ongoing support, and scalable infrastructure, while also delivering
              premium connected-home solutions including Lutron HomeWorks.
            </p>
          </div>

          <div className="gsv-card-grid">
            <ServiceBlock
            eyebrow="01"
            title="Business IT & Support"
            text="Business technology planning, cloud platform administration, and day-to-day IT support for growing organizations."
            items={[
              "Managed IT services, remote support, and vendor coordination",
              "Microsoft 365 and Google Workspace design, administration, and migration",
              "Email, user, and workstation deployment",
               "Business IT architecture, server infrastructure, and system implementation",
            ]}
          />

           <ServiceBlock
            eyebrow="02"
            title="Networks & Infrastructure"
            text="Reliable network infrastructure for small to medium sized offices, Custom Homes, and multi-device environments."
            items={[
            "Network architecture, gateway, and firewall implementation",
            "WiFi design, coverage planning, and performance optimization",
            "Structured cabling, rack design, and infrastructure organization",
            "VLAN segmentation, access control, and secure site-to-site connectivity",
    ]}
  />

            <ServiceBlock
              eyebrow="03"
              title="Smart Home Systems"
              text="High-end residential technology systems built for performance, simplicity, and long-term usability."
              items={[
                "Lutron HomeWorks system design and integration",
                "Lighting control and scene programming",
                "Whole-home network planning",
                "Connected home consulting and system coordination",
              ]}
            />
          </div>
        </section>

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
