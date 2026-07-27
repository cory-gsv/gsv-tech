import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="gsv-unified-header" id="site-top">
      <div className="gsv-unified-header-inner">
        <div className="gsv-unified-brand">
          <Link
            href="/"
            className="gsv-unified-brand-mark"
            aria-label="Golden State Visions home"
          >
            <Image
              src="/assets/images/gsv-bridge-mark.png"
              alt=""
              width={232}
              height={108}
              className="gsv-unified-brand-logo"
              aria-hidden="true"
              priority
            />
          </Link>

          <div className="gsv-unified-brand-copy">
            <Link href="/" className="gsv-unified-brand-primary">
              Golden State
            </Link>
            <Link href="/" className="gsv-unified-brand-accent">
              Visions
            </Link>
            <a href="tel:+19169090500" className="gsv-unified-brand-phone">
              (916) 909-0500
            </a>
          </div>
        </div>

        <nav className="gsv-unified-nav" aria-label="Primary navigation">
          <div className="gsv-unified-services-menu">
            <span
              className="gsv-unified-services-trigger"
              aria-haspopup="menu"
              tabIndex={0}
            >
              Services
            </span>

            <div className="gsv-unified-services-popover" role="menu">
              <Link href="/managed-it" role="menuitem">
                <span>Business</span>
                <strong>Managed IT &amp; Security</strong>
              </Link>
              <Link href="/smart-home-automation" role="menuitem">
                <span>Home</span>
                <strong>Automation &amp; AV</strong>
              </Link>
            </div>
          </div>

          <Link href="/portal">Portal</Link>

          <div className="gsv-unified-help-menu">
            <Link
              href="/book-consult"
              className="gsv-unified-help-trigger"
              aria-haspopup="menu"
            >
              Get help
            </Link>

            <div className="gsv-unified-help-popover" role="menu">
              <a href="tel:+19169090500" role="menuitem">
                <span>Call now</span>
                <strong>(916) 909-0500</strong>
              </a>
              <Link href="/book-consult" role="menuitem">
                <span>Choose a time</span>
                <strong>Schedule a call</strong>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
