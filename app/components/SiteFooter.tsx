import Image from "next/image";
import Link from "next/link";
import { socialProfiles } from "@/app/config/socialProfiles";

const footerLocations = [
  ["Lincoln, CA", "/locations/lincoln-ca"],
  ["Roseville, CA", "/locations/roseville-ca"],
  ["Sugar Bowl, CA", "/locations/sugar-bowl-ca"],
  ["Santa Clara, CA", "/locations/santa-clara-ca"],
  ["Folsom, CA", "/locations/folsom-ca"],
  ["El Dorado Hills, CA", "/locations/el-dorado-hills-ca"],
  ["Sacramento, CA", "/locations/sacramento-ca"],
  ["Truckee, CA", "/locations/truckee-ca"],
  ["Sunnyvale, CA", "/locations/sunnyvale-ca"],
  ["Cupertino, CA", "/locations/cupertino-ca"],
  ["Rocklin, CA", "/locations/rocklin-ca"],
  ["Granite Bay, CA", "/locations/granite-bay-ca"],
  ["Mountain View, CA", "/locations/mountain-view-ca"],
  ["Los Altos, CA", "/locations/los-altos-ca"],
  ["Auburn, CA", "/locations/auburn-ca"],
  ["North Lake Tahoe, CA", "/locations/tahoe-ca"],
  ["South Lake Tahoe, CA", "/locations/south-lake-tahoe-ca"],
  ["Palo Alto, CA", "/locations/palo-alto-ca"],
  ["San Jose, CA", "/locations/san-jose-ca"],
];

export default function SiteFooter() {
  return (
    <footer className="gsv-footer">
      <style>{`
        .gsvsf-inner {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
        }

        .gsvsf-grid {
          display: grid;
          grid-template-columns: 220px 120px 285px 285px 160px;
          column-gap: 24px;
          align-items: start;
          width: 100%;
        }

        .gsvsf-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          text-align: center;
        }

        .gsvsf-logo {
          display: block;
          width: 220px;
          max-width: 100%;
          height: auto;
          margin: 0 0 26px;
        }

        .gsvsf-brand-text,
        .gsvsf-column p,
        .gsvsf-column a,
        .gsvsf-city-grid a {
          color: rgba(255, 255, 255, 0.66);
          font-size: 13px;
          line-height: 1.45;
          font-weight: 500;
          text-decoration: none;
        }

        .gsvsf-brand-text {
          max-width: 250px;
          margin: 0;
          text-align: center;
        }

        .gsvsf-social-links {
          display: grid;
          gap: 13px;
        }

        .gsvsf-social-links a {
          color: rgba(255, 255, 255, 0.66);
          font-size: 12px;
          line-height: 1.3;
          font-weight: 650;
          text-decoration: none;
        }

        .gsvsf-social-links a:hover {
          color: #ffffff;
        }

        .gsvsf-column h4 {
          margin: 0 0 24px;
          color: #ffc72c;
          font-size: 13px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .gsvsf-column > a {
          display: block;
          margin-bottom: 13px;
          font-weight: 600;
        }

        .gsvsf-column > a:hover,
        .gsvsf-city-grid a:hover {
          color: #ffffff;
        }

        .gsvsf-city-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 12px;
          row-gap: 8px;
          width: 100%;
        }

        .gsvsf-city-grid a {
          display: block;
          white-space: nowrap;
        }

        .gsvsf-next-links {
          display: grid;
          gap: 13px;
        }

        .gsvsf-next-links a {
          color: rgba(255, 255, 255, 0.66);
          font-size: 13px;
          line-height: 1.25;
          font-weight: 650;
          text-decoration: none;
        }

        .gsvsf-next-links a:hover {
          color: #ffffff;
        }

        .gsvsf-bottom {
          width: 100%;
          max-width: 1240px;
          margin: 18px auto 0;
        }

        @media (max-width: 1220px) {
          .gsvsf-grid {
            grid-template-columns:
              minmax(165px, 1fr)
              minmax(85px, 0.5fr)
              minmax(205px, 1.25fr)
              minmax(225px, 1.35fr)
              minmax(125px, 0.75fr);
            column-gap: 16px;
          }

          .gsvsf-brand-text {
            max-width: 320px;
          }

        }

        @media (max-width: 900px) {
          .gsvsf-grid {
            grid-template-columns: minmax(240px, 1fr) minmax(220px, 1fr);
            column-gap: 44px;
            row-gap: 40px;
          }
        }

        @media (max-width: 760px) {
          .gsvsf-grid {
            grid-template-columns: 1fr;
            row-gap: 40px;
          }

          .gsvsf-logo {
            width: 200px;
          }

          .gsvsf-brand-text,
          .gsvsf-column p {
            max-width: none;
          }

          .gsvsf-city-grid {
            grid-template-columns: 1fr 1fr;
            width: 100%;
            max-width: 360px;
          }

          .gsvsf-bottom {
            margin-top: 24px;
          }
        }

        @media (max-width: 520px) {
          .gsvsf-city-grid {
            grid-template-columns: 1fr;
            max-width: none;
          }

          .gsvsf-bottom {
            display: grid;
            gap: 16px;
          }
        }
      `}</style>

      <div className="gsvsf-inner">
        <div className="gsvsf-grid">
          <div className="gsvsf-brand">
            <Link href="/" aria-label="Golden State Visions home">
              <Image
                src="/images/gsv-logo.png"
                alt="Golden State Visions Managed IT Services"
                width={1798}
                height={877}
                className="gsvsf-logo"
              />
            </Link>

            <p className="gsvsf-brand-text">
              Business IT, secure networks, home camera systems, smart home integration,
              and technology procurement built for long-term reliability.
            </p>
          </div>

          <div className="gsvsf-column gsvsf-follow">
            <h4>Follow</h4>
            <div className="gsvsf-social-links" aria-label="Golden State Visions social media">
              {socialProfiles.map((profile) => (
                <a
                  key={profile.url}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.label}
                </a>
              ))}
            </div>
          </div>

          <div className="gsvsf-column">
            <h4>Services</h4>
            <a href="/managed-it?service=01">
              Managed IT Services (Monitoring, Patching &amp; Maintenance)
            </a>
            <a href="/managed-it?service=01">
              Endpoint Protection &amp; Threat Detection (EDR)
            </a>
            <a href="/managed-it?service=03">
              Backup &amp; Disaster Recovery
            </a>
            <a href="/managed-it?service=05">
              HIPAA &amp; PCI Compliance Support
            </a>
            <a href="/managed-it?service=06">
              Networks &amp; Security Systems
            </a>
            <a href="/smart-home-automation?service=03">
              Smart Home Automation
            </a>
            <a href="/smart-home-automation?service=05">
              Audio, Video &amp; Surveillance
            </a>
          </div>

          <div className="gsvsf-column" id="site-service-areas">
            <h4>Areas We Serve</h4>

            <div className="gsvsf-city-grid">
              {footerLocations.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="gsvsf-column gsvsf-next">
            <h4>Quick Links</h4>
            <div className="gsvsf-next-links" aria-label="Company links">
              <Link href="/book-consult">Book a Consult</Link>
              <Link href="/managed-it">Managed IT, Networks &amp; Security</Link>
              <Link href="/smart-home-automation">
                Smart Home Automation, Lighting &amp; AV
              </Link>
              <Link href="/portal">Portal</Link>
              <Link href="/about">About Golden State Visions</Link>
              <Link href="/resources">Resources &amp; FAQ</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

        </div>

        <div className="gsv-footer-bottom gsvsf-bottom">
          <span>© {new Date().getFullYear()} Golden State Visions. All rights reserved.</span>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/sms-terms">SMS Terms</Link>
          <a href="#site-top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
