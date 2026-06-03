import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata: Metadata = {
  title: "SMS Terms & Conditions | Golden State Visions",
  description:
    "SMS Terms & Conditions for Golden State Visions text message communications, including message types, frequency, opt-out, help, and privacy information.",
  alternates: {
    canonical: "/sms-terms",
  },
  openGraph: {
    title: "SMS Terms & Conditions | Golden State Visions",
    description:
      "Terms for conversational SMS/text message communications from Golden State Visions.",
    url: "/sms-terms",
    siteName: "Golden State Visions",
    type: "article",
  },
};

const sections = [
  {
    title: "Types of SMS Messages",
    body: (
      <>
        <p>Golden State Visions may send SMS messages related to:</p>
        <ul>
          <li>Customer inquiries</li>
          <li>Appointment scheduling</li>
          <li>Appointment confirmations</li>
          <li>Service coordination</li>
          <li>Project updates</li>
          <li>Support requests</li>
          <li>Follow-up conversations</li>
          <li>
            Real estate media, managed IT, networking, smart home, and related service
            communication
          </li>
        </ul>
        <p>
          Golden State Visions does not use this SMS campaign for marketing blasts, mass
          messaging, or automated promotional campaigns.
        </p>
      </>
    ),
  },
  {
    title: "Message Frequency",
    body: (
      <p>
        Message frequency varies based on your interaction with Golden State Visions.
        Messages are sent only as needed for customer communication, scheduling,
        service coordination, or support.
      </p>
    ),
  },
  {
    title: "Message and Data Rates",
    body: (
      <p>
        Message and data rates may apply depending on your mobile carrier and plan.
        Golden State Visions is not responsible for any charges from your mobile
        carrier.
      </p>
    ),
  },
  {
    title: "Opt-Out Instructions",
    body: (
      <p>
        You may opt out of SMS messages at any time by replying STOP to any message.
        After you reply STOP, you will receive a confirmation message and no further SMS
        messages will be sent from that number unless you opt in again.
      </p>
    ),
  },
  {
    title: "Help Instructions",
    body: (
      <>
        <p>
          For help, reply HELP to any message. You may also contact Golden State Visions
          directly:
        </p>
        <p>
          Phone: <a href="tel:+19164323373">(916) 432-3373</a>
          <br />
          Email: <a href="mailto:bookings@gsvisions.com">bookings@gsvisions.com</a>
        </p>
      </>
    ),
  },
  {
    title: "Privacy",
    body: (
      <>
        <p>
          Golden State Visions respects your privacy. Phone numbers and SMS opt-in
          information are not shared with third parties for marketing purposes.
        </p>
        <p>
          You can view our Privacy Policy here:{" "}
          <Link href="/privacy-policy">https://gsvisions.com/privacy-policy</Link>
        </p>
      </>
    ),
  },
  {
    title: "Eligibility",
    body: (
      <p>
        By opting in to receive SMS messages, you confirm that you are the account holder
        or authorized user of the mobile phone number provided.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    body: (
      <p>
        Golden State Visions may update these SMS Terms & Conditions from time to time.
        Updates will be posted on this page with a revised effective date.
      </p>
    ),
  },
];

export default function SmsTermsPage() {
  return (
    <main id="top" className="gsv-page">
      <style>{`
        .gsv-privacy-shell {
          width: min(calc(100% - 40px), 980px);
          margin: 0 auto;
          padding: 18px 0 88px;
        }

        .gsv-privacy-hero {
          background: linear-gradient(180deg, var(--dark-card), var(--dark-card-2));
          border: 1px solid var(--dark-line);
          border-radius: var(--radius-xl);
          color: #ffffff;
          padding: clamp(30px, 5vw, 54px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.16);
        }

        .gsv-privacy-hero h1 {
          margin: 0 0 16px;
          max-width: 760px;
          color: #ffffff;
          font-size: clamp(38px, 6vw, 64px);
          line-height: 1;
          font-weight: 900;
        }

        .gsv-privacy-hero p {
          margin: 0;
          max-width: 760px;
          color: #d6cec1;
          font-size: 18px;
          line-height: 1.65;
        }

        .gsv-privacy-date {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          margin-bottom: 18px;
          padding: 0 14px;
          border: 1px solid var(--gold-line);
          border-radius: 999px;
          background: var(--gold-soft);
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .gsv-privacy-content {
          margin-top: 28px;
          padding: clamp(26px, 5vw, 48px);
          border: 1px solid var(--line-light);
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 18px 38px rgba(17, 17, 17, 0.06);
        }

        .gsv-privacy-section + .gsv-privacy-section {
          margin-top: 34px;
          padding-top: 34px;
          border-top: 1px solid var(--line-light);
        }

        .gsv-privacy-section h2 {
          margin: 0 0 14px;
          color: #111111;
          font-size: clamp(22px, 3vw, 30px);
          line-height: 1.15;
          font-weight: 900;
        }

        .gsv-privacy-section p {
          margin: 0 0 14px;
          color: var(--muted-light);
          font-size: 16px;
          line-height: 1.75;
        }

        .gsv-privacy-section p:last-child {
          margin-bottom: 0;
        }

        .gsv-privacy-section ul {
          margin: 0 0 14px;
          padding-left: 22px;
          color: var(--muted-light);
          font-size: 16px;
          line-height: 1.75;
        }

        .gsv-privacy-section li + li {
          margin-top: 4px;
        }

        .gsv-privacy-section a,
        .gsv-privacy-contact a {
          color: #111111;
          font-weight: 800;
        }

        .gsv-privacy-section a:hover,
        .gsv-privacy-contact a:hover {
          color: var(--gold);
        }

        .gsv-privacy-contact {
          margin-top: 34px;
          padding: 24px;
          border-radius: 18px;
          background: var(--panel-light-2);
          border: 1px solid var(--line-light);
        }

        .gsv-privacy-contact p {
          margin: 0;
        }

      `}</style>

      <div className="gsv-shell">
        <header className="gsv-header">
          <Link href="/" className="gsv-brand gsv-logo-link" aria-label="Golden State Visions home">
            <Image
              src="/images/gsv-logo.png"
              alt="Golden State Visions Managed IT Services"
              width={1798}
              height={877}
              className="gsv-logo-img"
              priority
            />
          </Link>

          <nav className="gsv-nav gsv-nav-menu-only">
            <details className="gsv-services-menu">
              <summary>Menu</summary>

              <div className="gsv-services-mega">
                <div className="gsv-services-mega-inner">
                  <div className="gsv-services-mega-head">
                    <div className="gsv-services-mega-explore">
                      <span className="gsv-services-mega-label">Explore</span>

                      <div className="gsv-services-mega-toplinks">
                        <Link href="/#how-we-work">How We Work</Link>
                        <Link href="/#why-us">Why Choose Us</Link>
                        <Link href="/#contact">Contact</Link>
                      </div>
                    </div>
                  </div>

                  <div className="gsv-services-mega-groups">
                    <div className="gsv-services-mega-section">
                      <div className="gsv-services-mega-label">Business Solutions</div>

                      <div className="gsv-services-mega-grid">
                        <Link href="/services/managed-it" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon gsv-menu-icon-managed" aria-hidden="true">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="none"
                              stroke="#FFC72C"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="2" y="2" width="14" height="5" rx="1" />
                              <circle cx="5" cy="4.5" r="0.75" fill="#FFC72C" />
                              <circle cx="8" cy="4.5" r="0.75" fill="#FFC72C" />
                              <rect x="2" y="10" width="14" height="5" rx="1" />
                              <circle cx="5" cy="12.5" r="0.75" fill="#FFC72C" />
                              <circle cx="8" cy="12.5" r="0.75" fill="#FFC72C" />
                              <rect x="2" y="18" width="14" height="5" rx="1" />
                              <circle cx="5" cy="20.5" r="0.75" fill="#FFC72C" />
                              <circle cx="8" cy="20.5" r="0.75" fill="#FFC72C" />
                              <path d="M16 4.5h3v7h3" />
                              <path d="M16 20.5h3v-9" />
                              <circle cx="22" cy="11.5" r="1.5" />
                            </svg>
                          </span>
                          <span className="gsv-menu-title">Managed IT Services</span>
                        </Link>

                        <Link href="/services/networks-security-systems" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon gsv-menu-icon-network-security" aria-hidden="true">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              fill="none"
                              stroke="#FFC72C"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              <circle cx="12" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                              <circle cx="16" cy="13" r="1.5" />
                              <path d="M12 9.5v5" />
                              <path d="M12 12l-2.5 1" />
                              <path d="M12 12l2.5 1" />
                            </svg>
                          </span>
                          <span className="gsv-menu-title">Networks &amp; Security Systems</span>
                        </Link>
                      </div>
                    </div>

                    <div className="gsv-services-mega-section">
                      <div className="gsv-services-mega-label">Residential Solutions</div>

                      <div className="gsv-services-mega-grid">
                        <Link href="/services/smart-home-automation" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon">🏠</span>
                          <span className="gsv-menu-title">Smart Home Automation</span>
                        </Link>

                        <Link href="/services/audio-video-surveillance" className="gsv-services-mega-card">
                          <span className="gsv-menu-icon gsv-menu-icon-av">🎥</span>
                          <span className="gsv-menu-title">Audio, Video &amp; Surveillance</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="gsv-services-mega-footer">
                    <Link href="/#services">View all services</Link>
                    <Link href="/book-consult">Book a consult</Link>
                  </div>
                </div>
              </div>
            </details>
          </nav>
        </header>
      </div>

      <div className="gsv-privacy-shell">
        <section className="gsv-privacy-hero">
          <div className="gsv-privacy-date">Effective Date: June 3, 2026</div>
          <h1>SMS Terms &amp; Conditions</h1>
          <p>
            These SMS Terms & Conditions apply to text message communications sent by
            Golden State Visions.
          </p>
          <p>
            By providing your mobile phone number and opting in to receive SMS messages,
            you agree to receive conversational text messages from Golden State Visions
            at the phone number you provided.
          </p>
        </section>

        <div className="gsv-privacy-content">
          {sections.map((section) => (
            <section key={section.title} className="gsv-privacy-section">
              <h2>{section.title}</h2>
              {section.body}
            </section>
          ))}

          <section className="gsv-privacy-section">
            <h2>Contact</h2>
            <p>
              If you have questions about these SMS Terms & Conditions, please contact:
            </p>
            <div className="gsv-privacy-contact">
              <p>
                Golden State Visions
                <br />
                Phone: <a href="tel:+19164323373">(916) 432-3373</a>
                <br />
                Email: <a href="mailto:bookings@gsvisions.com">bookings@gsvisions.com</a>
                <br />
                Website: <a href="https://gsvisions.com">https://gsvisions.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
