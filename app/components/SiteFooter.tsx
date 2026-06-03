import Image from "next/image";
import Link from "next/link";

const footerLocations = [
  ["Lincoln, CA", "/locations/lincoln-ca"],
  ["Roseville, CA", "/locations/roseville-ca"],
  ["Sugar Bowl, CA", "/locations/sugar-bowl-ca"],
  ["Santa Clara, CA", "/locations/santa-clara-ca"],
  ["Folsom, CA", "/locations/folsom-ca"],
  ["Truckee, CA", "/locations/truckee-ca"],
  ["Sunnyvale, CA", "/locations/sunnyvale-ca"],
  ["Cupertino, CA", "/locations/cupertino-ca"],
  ["Rocklin, CA", "/locations/rocklin-ca"],
  ["Granite Bay, CA", "/locations/granite-bay-ca"],
  ["Mountain View, CA", "/locations/mountain-view-ca"],
  ["Los Altos, CA", "/locations/los-altos-ca"],
  ["Auburn, CA", "/locations/auburn-ca"],
  ["Tahoe, CA", "/locations/tahoe-ca"],
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
          grid-template-columns: 260px 240px 340px 250px;
          column-gap: 36px;
          align-items: start;
          width: 100%;
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
          grid-template-columns: 150px 150px;
          column-gap: 28px;
          row-gap: 8px;
          width: 328px;
        }

        .gsvsf-city-grid a {
          display: block;
          white-space: nowrap;
        }

        .gsvsf-next p {
          max-width: 230px;
          margin: 0 0 24px;
        }

        .gsvsf-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
          min-height: 48px;
          padding: 0 24px;
          border-radius: 999px;
          background: #ffc72c;
          color: #111111 !important;
          font-size: 13px;
          line-height: 1;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
        }

        .gsvsf-bottom {
          width: 100%;
          max-width: 1240px;
          margin: 52px auto 0;
        }

        @media (max-width: 1220px) {
          .gsvsf-grid {
            grid-template-columns: minmax(240px, 1fr) minmax(220px, 1fr);
            column-gap: 56px;
            row-gap: 46px;
          }

          .gsvsf-brand-text {
            max-width: 320px;
          }

          .gsvsf-next p {
            max-width: 320px;
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
          .gsvsf-next p {
            max-width: none;
          }

          .gsvsf-city-grid {
            grid-template-columns: 1fr 1fr;
            width: 100%;
            max-width: 360px;
          }

          .gsvsf-bottom {
            margin-top: 42px;
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

          <div className="gsvsf-column">
            <h4>Services</h4>
            <Link href="/services/managed-it">Managed IT Services</Link>
            <Link href="/services/networks-security-systems">Networks &amp; Security Systems</Link>
            <Link href="/services/smart-home-automation">Smart Home Automation</Link>
            <Link href="/services/audio-video-surveillance">Audio, Video &amp; Surveillance</Link>
          </div>

          <div className="gsvsf-column">
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
            <h4>Next Step</h4>
            <p>Ready to review your systems or plan a new project?</p>
            <Link href="/book-consult" className="gsvsf-button">
              Book a Consult
            </Link>
          </div>
        </div>

        <div className="gsv-footer-bottom gsvsf-bottom">
          <span>© {new Date().getFullYear()} Golden State Visions. All rights reserved.</span>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/sms-terms">SMS Terms</Link>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
