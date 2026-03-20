import Link from "next/link";

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
    <main className="gsv-shell">
      <header className="gsv-header">
        <div className="gsv-brand">
          <div className="gsv-brand-mark">GSV</div>
          <div>
            <div className="gsv-brand-name">GSV Tech</div>
            <div className="gsv-brand-sub">A division of Golden State Visions</div>
          </div>
        </div>

        <nav className="gsv-nav">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/#why-us">Why Us</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </header>

      <section className="gsv-section">
        <div className="gsv-section-head gsv-section-head-dark">
          <div className="gsv-eyebrow">Services</div>
          <h2>Comprehensive IT, networking, and smart home solutions.</h2>
          <p>
            GSV Tech supports small and medium-sized businesses with buildouts,
            ongoing support, and scalable infrastructure, while also delivering
            premium connected-home solutions including Lutron HomeWorks.
          </p>
        </div>

        <div className="gsv-card-grid">
          <ServiceBlock
            eyebrow="01"
            title="Business IT & Support"
            text="Practical day-to-day support and long-term technology planning for growing businesses."
            items={[
              "Microsoft 365 and Google Workspace setup",
              "User onboarding and workstation deployment",
              "Remote troubleshooting and support",
              "Managed service plans and recurring support",
            ]}
          />

          <ServiceBlock
            eyebrow="02"
            title="Networks & Infrastructure"
            text="Clean, reliable infrastructure for offices, larger properties, and multi-device environments."
            items={[
              "UniFi network design and deployment",
              "WiFi planning and coverage improvement",
              "Structured wiring and rack organization",
              "Firewall rules, VLANs, and site-to-site connectivity",
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
    </main>
  );
}