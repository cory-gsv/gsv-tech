import styles from "@/app/concept/concept.module.css";

const certifications = [
  {
    issuer: "Lutron",
    name: "HomeWorks Certified",
    detail: "Dealer / Installer",
  },
  {
    issuer: "Lutron",
    name: "RadioRA 3 Certified",
  },
  {
    issuer: "Lutron",
    name: "Shading Solutions Certified",
  },
  {
    issuer: "Microsoft",
    name: "Microsoft 365",
    detail: "Administrator Expert",
  },
  {
    issuer: "Google",
    name: "Associate Google Workspace",
    detail: "Administrator",
  },
  {
    issuer: "Control4",
    name: "Automation Programmer",
    detail: "Authorized Integrator",
  },
  {
    issuer: "Ubiquiti",
    name: "UWA · URSCA · UFSP",
    detail: "UniFi Academy Credentials",
  },
  {
    issuer: "Cisco",
    name: "CCNA",
    detail: "Certified Network Associate",
  },
];

export default function WhyGoldenStateVisionsSection() {
  return (
    <section className={styles.whySection} id="why-us">
      <div className={styles.whyIntro}>
        <p className={styles.eyebrow}>Why Golden State Visions</p>
        <h2>
          One partner for support, infrastructure, automation, and technology
          procurement.
        </h2>
        <p>
          Golden State Visions is built on more than 18 years of hands-on IT and
          infrastructure experience, including over a decade supporting one of
          the world&apos;s top 10 technology companies. That experience includes
          leading infrastructure operations and delivering the technology
          required to open hundreds of service centers, showrooms, warehouses,
          and major manufacturing facilities worldwide. Today, Golden State
          Visions brings that same level of planning, documentation, security,
          and operational discipline to local businesses and residential
          technology projects.
        </p>
      </div>

      <div className={styles.whyGrid}>
        <article>
          <span>01</span>
          <h3>Business-first mindset</h3>
          <p>
            We help businesses stay productive with{" "}
            <strong>reliable systems</strong>,{" "}
            <strong>practical support</strong>, and{" "}
            <strong>thoughtful long term planning</strong>.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Built for physical locations</h3>
          <p>
            Networks, cameras, Wi-Fi, workstations, displays, and smart systems
            are planned around <strong>the real rooms they live in</strong>,
            with <strong>onsite details handled</strong> before they become
            support issues.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Scalable client experience</h3>
          <p>
            Our client portal supports{" "}
            <strong>billing and account access</strong> today, with a roadmap
            for <strong>service tracking</strong>,{" "}
            <strong>appointments</strong>, <strong>system visibility</strong>,
            and <strong>account management</strong>.
          </p>
        </article>
        <article>
          <span>04</span>
          <h3>Microsoft &amp; Google platforms</h3>
          <p>
            Support for <strong>Microsoft 365</strong>,{" "}
            <strong>Google Workspace</strong>, <strong>email</strong>, identity,
            licensing, administration, and ongoing platform management.
          </p>
        </article>
        <article>
          <span>05</span>
          <h3>Business technology procurement</h3>
          <p>
            Access to <strong>business hardware</strong>,{" "}
            <strong>networking equipment</strong>,{" "}
            <strong>workstations</strong>, servers, software licensing, and
            infrastructure products through established technology channels.
          </p>
        </article>
        <article>
          <span>06</span>
          <h3>Planning through support</h3>
          <p>
            Help with <strong>product selection</strong>,{" "}
            <strong>implementation planning</strong>, renewals, upgrades,
            lifecycle management, and vendor coordination.
          </p>
        </article>
      </div>

      <div className={styles.certificationRail}>
        <div className={styles.certificationIntro}>
          <span>Verified expertise</span>
          <h3>Certified for the systems behind the project.</h3>
          <p>Platform-specific training from design through long-term support.</p>
        </div>

        <div
          className={styles.certificationList}
          aria-label="Golden State Visions professional certifications"
        >
          {certifications.map((certification) => (
            <div
              className={styles.certificationItem}
              key={`${certification.issuer}-${certification.name}`}
            >
              <span className={styles.certificationSeal} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.2 12.2 2.4 2.4 5.4-5.5" />
                </svg>
              </span>
              <span className={styles.certificationCopy}>
                <small>{certification.issuer}</small>
                <strong>{certification.name}</strong>
                {certification.detail ? (
                  <span>{certification.detail}</span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
