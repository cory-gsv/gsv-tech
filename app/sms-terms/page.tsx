import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

const socialImage = "/images/gsv-logo.png";

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
    images: [
      {
        url: socialImage,
        width: 1798,
        height: 877,
        alt: "Golden State Visions logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMS Terms & Conditions | Golden State Visions",
    description:
      "Terms for conversational SMS/text message communications from Golden State Visions.",
    images: [socialImage],
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
            Managed IT, networking, smart home, audio/video, and related service
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
          Email: <a href="mailto:support@gsvisions.com">support@gsvisions.com</a>
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
        <SiteHeader />
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
                Email: <a href="mailto:support@gsvisions.com">support@gsvisions.com</a>
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
