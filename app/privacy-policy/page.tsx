import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Golden State Visions",
  description:
    "Privacy Policy for Golden State Visions, including website, contact, booking, service request, email, phone, and SMS/text message communications.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Golden State Visions",
    description:
      "How Golden State Visions collects, uses, shares, and protects information provided through website, service, and SMS communications.",
    url: "/privacy-policy",
    siteName: "Golden State Visions",
    type: "article",
  },
};

const sections = [
  {
    title: "Information We Collect",
    body: (
      <>
        <p>
          We may collect the following information when you contact us, request services,
          book an appointment, or communicate with us:
        </p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Property or service address</li>
          <li>Company name, when applicable</li>
          <li>Appointment or project details</li>
          <li>Messages or support requests you send to us</li>
          <li>
            Information needed to provide real estate media, managed IT, networking,
            smart home, or related services
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    body: (
      <>
        <p>Golden State Visions uses your information to:</p>
        <ul>
          <li>Respond to inquiries and service requests</li>
          <li>Schedule, confirm, and coordinate appointments</li>
          <li>Provide project updates and customer support</li>
          <li>Communicate with you about requested services</li>
          <li>Process bookings, estimates, invoices, or service-related communications</li>
          <li>Improve our services and customer experience</li>
          <li>Comply with legal, regulatory, and business obligations</li>
        </ul>
      </>
    ),
  },
  {
    title: "SMS/Text Message Communications",
    body: (
      <>
        <p>
          Golden State Visions may use SMS/text messaging for low-volume, one-to-one
          customer communication related to inquiries, appointment scheduling,
          appointment confirmations, service coordination, support requests, and
          follow-up conversations.
        </p>
        <p>
          By providing your mobile number and opting in, you consent to receive
          conversational SMS messages from Golden State Visions. Message frequency
          varies. Message and data rates may apply. You may reply STOP to opt out at
          any time. You may reply HELP for help.
        </p>
        <p>
          Mobile opt-in information will not be shared with third parties for marketing
          purposes. Mobile information will not be shared with third parties or
          affiliates for marketing or promotional purposes. Text messaging originator
          opt-in data and consent will not be shared with any third parties.
        </p>
      </>
    ),
  },
  {
    title: "How We Share Information",
    body: (
      <>
        <p>We do not sell your personal information.</p>
        <p>
          We may share limited information only when necessary to operate our business
          and provide services, such as with:
        </p>
        <ul>
          <li>
            Service providers who help us operate our website, communications,
            scheduling, payment, or customer support systems
          </li>
          <li>
            Platform providers, phone carriers, or messaging vendors needed to deliver
            SMS/text messages
          </li>
          <li>Vendors or partners involved in completing a service you requested</li>
          <li>Legal, regulatory, or government authorities when required by law</li>
        </ul>
        <p>
          Any sharing is limited to the purpose of providing requested services,
          operating our business, or complying with applicable requirements.
        </p>
      </>
    ),
  },
  {
    title: "Data Security",
    body: (
      <p>
        We use reasonable administrative, technical, and physical safeguards to protect
        your information. However, no method of transmission or storage is completely
        secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    title: "Data Retention",
    body: (
      <p>
        We retain personal information only as long as reasonably necessary to provide
        services, maintain business records, comply with legal obligations, resolve
        disputes, and enforce agreements.
      </p>
    ),
  },
  {
    title: "Your Choices",
    body: (
      <>
        <p>
          You may contact us to request that we update, correct, or delete your
          information, subject to any legal or business recordkeeping requirements.
        </p>
        <p>
          For SMS/text messages, you may opt out at any time by replying STOP. You may
          request help by replying HELP.
        </p>
      </>
    ),
  },
  {
    title: "Links to Other Websites",
    body: (
      <p>
        Our website or messages may contain links to third-party websites. We are not
        responsible for the privacy practices, content, or security of third-party
        websites.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main id="top" className="gsv-page">
      <style>{`
        .gsv-privacy-header {
          width: min(calc(100% - 40px), var(--max));
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 22px 0 28px;
        }

        .gsv-privacy-logo {
          display: block;
          width: 220px;
          max-width: 100%;
          height: auto;
        }

        .gsv-privacy-nav {
          display: flex;
          align-items: center;
          gap: 22px;
          color: #28231d;
          font-size: 14px;
          font-weight: 700;
        }

        .gsv-privacy-nav a:hover {
          color: var(--gold);
        }

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
          margin: 0;
          padding-left: 22px;
          color: var(--muted-light);
          font-size: 16px;
          line-height: 1.75;
        }

        .gsv-privacy-section li + li {
          margin-top: 4px;
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

        .gsv-privacy-contact a {
          color: #111111;
          font-weight: 800;
        }

        .gsv-privacy-contact a:hover {
          color: var(--gold);
        }

        @media (max-width: 720px) {
          .gsv-privacy-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .gsv-privacy-logo {
            width: 200px;
          }

          .gsv-privacy-nav {
            flex-wrap: wrap;
            gap: 14px;
          }
        }
      `}</style>

      <header className="gsv-privacy-header">
        <Link href="/" aria-label="Golden State Visions home">
          <Image
            src="/images/gsv-logo.png"
            alt="Golden State Visions Managed IT Services"
            width={1798}
            height={877}
            className="gsv-privacy-logo"
            priority
          />
        </Link>

        <nav className="gsv-privacy-nav" aria-label="Privacy policy navigation">
          <Link href="/services">Services</Link>
          <Link href="/book-consult">Book a Consult</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </header>

      <div className="gsv-privacy-shell">
        <section className="gsv-privacy-hero">
          <div className="gsv-privacy-date">Effective Date: June 2, 2026</div>
          <h1>Privacy Policy</h1>
          <p>
            Golden State Visions respects your privacy. This Privacy Policy explains
            how we collect, use, and protect information you provide to us, including
            information submitted through our website, contact forms, booking forms,
            service requests, phone calls, emails, and SMS/text message communications.
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
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how your information
              is handled, please contact Golden State Visions:
            </p>
            <div className="gsv-privacy-contact">
              <p>
                Golden State Visions
                <br />
                Phone: <a href="tel:+19164323373">(916) 432-3373</a>
                <br />
                Email: <a href="mailto:info@gsvisions.com">info@gsvisions.com</a>
                <br />
                Website: <a href="https://gsvisions.com">gsvisions.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
