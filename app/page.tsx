import Link from "next/link";

function ServiceCard({
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
    <div className="gsv-card">
      <div className="gsv-eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="gsv-page">
      <div className="gsv-shell">
        <header className="gsv-header">
          <div className="gsv-brand">
            <div className="gsv-brand-mark">GSV</div>
            <div>
              <div className="gsv-brand-name">GSV Tech</div>
              <div className="gsv-brand-sub">A division of Golden State Visions</div>
            </div>
          </div>

          <nav className="gsv-nav">
            <Link href="/services">Services</Link>
            <a href="#why-us">Why Us</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">Business IT • Networking • Smart Home</div>
            <h1>Technology systems built for modern businesses and connected homes.</h1>
            <p>
              GSV Tech provides small and medium-sized business IT support, network
              infrastructure, UniFi deployments, and premium smart home solutions
              including Lutron HomeWorks.
            </p>

            <div className="gsv-hero-actions">
              {/* ✅ FIXED BUTTON */}
              <Link href="/book-consult" className="gsv-btn gsv-btn-primary">
                Book a Consult
              </Link>

              <Link className="gsv-btn gsv-btn-secondary" href="/services">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="gsv-hero-panel">
            <div className="gsv-status-card">
              <div className="gsv-status-label">Focused on</div>
              <div className="gsv-status-value">Reliable systems</div>
            </div>

            <div className="gsv-status-grid">
              <div className="gsv-mini-stat">
                <span>Business IT</span>
                <strong>Support & buildouts</strong>
              </div>
              <div className="gsv-mini-stat">
                <span>Networking</span>
                <strong>WiFi, routing, security</strong>
              </div>
              <div className="gsv-mini-stat">
                <span>Smart Home</span>
                <strong>Lutron HomeWorks</strong>
              </div>
              <div className="gsv-mini-stat">
                <span>Client Experience</span>
                <strong>Portal & appointment flow</strong>
              </div>
            </div>
          </div>
        </section>

        {/* REST OF YOUR FILE UNCHANGED */}
        {/* (kept identical to your original) */}

        <section id="services" className="gsv-section">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Services</div>
            <h2>Built to support both business operations and high-end residential technology.</h2>
            <p>
              We bridge the gap between traditional IT support and modern system
              integration, giving clients one trusted partner for infrastructure,
              support, and automation.
            </p>
          </div>

          <div className="gsv-card-grid">
            <ServiceCard
              eyebrow="01"
              title="Business IT & Support"
              text="Reliable support and system management for small and medium-sized businesses."
              items={[
                "Microsoft 365 & Google Workspace",
                "User onboarding and device setup",
                "Remote support and troubleshooting",
                "Managed service plans",
              ]}
            />

            <ServiceCard
              eyebrow="02"
              title="Networks & Infrastructure"
              text="Clean, scalable network deployments for offices, job sites, and larger properties."
              items={[
                "UniFi network design and deployment",
                "WiFi optimization and coverage planning",
                "Structured wiring and rack organization",
                "Firewall, VLAN, and site-to-site setup",
              ]}
            />

            <ServiceCard
              eyebrow="03"
              title="Smart Home Systems"
              text="Premium residential technology design and integration for modern living."
              items={[
                "Lutron HomeWorks system design",
                "Lighting control and automation",
                "Whole-home network infrastructure",
                "Connected home technology consulting",
              ]}
            />
          </div>
        </section>

        <section id="why-us" className="gsv-section gsv-section-alt">
          <div className="gsv-section-head">
            <div className="gsv-eyebrow">Why GSV Tech</div>
            <h2>One partner for support, infrastructure, and automation.</h2>
          </div>

          <div className="gsv-feature-grid">
            <div className="gsv-feature">
              <h3>Business-first mindset</h3>
              <p>
                We help businesses stay productive with reliable systems, practical
                support, and thoughtful long-term planning.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Premium system design</h3>
              <p>
                From office networks to smart homes, we focus on clean installs,
                stable performance, and a polished end-user experience.
              </p>
            </div>

            <div className="gsv-feature">
              <h3>Scalable client experience</h3>
              <p>
                Our long-term vision includes a client portal for service tracking,
                appointments, system visibility, and account management.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="gsv-section">
          <div className="gsv-contact">
            <div className="gsv-contact-copy">
              <div className="gsv-eyebrow">Contact</div>
              <h2>Let’s talk about your business or home technology needs.</h2>
              <p>
                Whether you need IT support, a new network buildout, or a premium
                smart home system, GSV Tech is ready to help.
              </p>
            </div>

            <form className="gsv-contact-form">
              <input type="text" placeholder="Your name" />
              <input type="email" placeholder="Email address" />
              <input type="text" placeholder="Company or project name" />
              <textarea placeholder="Tell us what you need" rows={5} />
              <button type="submit" className="gsv-btn gsv-btn-primary">
                Send Inquiry
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}