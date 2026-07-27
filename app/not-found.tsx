import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | Golden State Visions",
  description:
    "The requested page could not be found. Explore Golden State Visions services, resources, and service areas.",
};

export default function NotFound() {
  return (
    <main className={`gsv-redesign-page ${styles.page}`}>
      <SiteHeader />

      <section className={styles.content} aria-labelledby="not-found-title">
        <div className={styles.panel}>
          <span className={styles.code} aria-hidden="true">
            404
          </span>
          <p className={styles.eyebrow}>Page not found</p>
          <h1 id="not-found-title">This page is no longer on the map.</h1>
          <p className={styles.intro}>
            The address may have changed, or the page may no longer exist. Head
            back home or choose the service path that best matches what you
            need.
          </p>

          <div className={styles.actions}>
            <Link href="/" className={styles.primary}>
              Return Home
            </Link>
            <Link href="/contact" className={styles.secondary}>
              Contact GSV
            </Link>
          </div>

          <nav className={styles.helpfulLinks} aria-label="Helpful pages">
            <p>Popular destinations</p>
            <div className={styles.linkList}>
              <Link href="/managed-it">Managed IT &amp; Security</Link>
              <Link href="/smart-home-automation">
                Smart Home &amp; Audio/Video
              </Link>
              <Link href="/resources">Resources</Link>
              <Link href="/locations/lincoln-ca">Service Areas</Link>
            </div>
          </nav>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
