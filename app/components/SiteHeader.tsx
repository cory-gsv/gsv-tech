import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  {
    href: "/services",
    label: "Services",
    icon: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.2" />
        <rect x="14" y="4" width="6" height="6" rx="1.2" />
        <rect x="4" y="14" width="6" height="6" rx="1.2" />
        <rect x="14" y="14" width="6" height="6" rx="1.2" />
      </>
    ),
  },
  {
    href: "/resources",
    label: "Resources",
    icon: (
      <>
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H8a3 3 0 0 0-3 3V5.5Z" />
        <path d="M5 18a3 3 0 0 1 3-3h11" />
        <path d="M9 7h6" />
        <path d="M9 10h4" />
      </>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6" />
        <path d="M12 7h.01" />
      </>
    ),
  },
];

export default function SiteHeader() {
  return (
    <header className="gsv-header gsv-shared-header">
      <div className="gsv-shared-header-inner">
        <div className="gsv-shared-primary">
          <Link href="/" className="gsv-shared-brand" aria-label="Golden State Visions home">
            <Image
              src="/assets/images/gsv-bridge-mark.png"
              alt=""
              width={210}
              height={88}
              className="gsv-shared-brand-logo"
              aria-hidden="true"
              priority
            />
            <span className="gsv-shared-brand-text">
              Golden State <span>Visions</span>
            </span>
          </Link>

          <Link href="/book-consult" className="gsv-shared-consult-cta">
            Book a Consult
          </Link>
        </div>

        <div className="gsv-shared-nav-stack">
          <a href="tel:+19164323373" className="gsv-shared-phone-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 4.8 9 4.2l2.2 5-1.4 1.1a11.4 11.4 0 0 0 4 4l1.1-1.4 5 2.2-.6 2.4c-.2.8-1 1.4-1.8 1.3C10.4 18.4 5.6 13.6 5.2 6.5c-.1-.8.5-1.5 1.4-1.7Z" />
            </svg>
            <span>(916) 432-3373</span>
          </a>

          <nav className="gsv-shared-nav" aria-label="Primary navigation">
            <details className="gsv-shared-menu">
              <summary className="gsv-shared-utility-link gsv-shared-menu-trigger">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 7h14" />
                  <path d="M5 12h14" />
                  <path d="M5 17h14" />
                </svg>
                <span>Menu</span>
              </summary>
              <div className="gsv-shared-menu-panel">
                {menuLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="gsv-shared-menu-link">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {item.icon}
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </details>
            <Link href="/billing" className="gsv-shared-utility-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span>Portal</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
