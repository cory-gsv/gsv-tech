import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

type City = { slug: string; city: string; state: string; region: string };

export default function LocationPageClient({ city }: { city: City }) {
  return (
    <main id="top" className="gsv-page">
      <div className="gsv-shell">
        <SiteHeader />

        <section className="gsv-hero">
          <div className="gsv-hero-copy">
            <div className="gsv-eyebrow">
              {city.city}, {city.state} • {city.region}
            </div>

            <h1>Golden State Visions in {city.city}, {city.state}</h1>

            <p>
              We support both businesses and homeowners in {city.city} and the greater{" "}
              {city.region} area. Choose the option below that matches what you need.
            </p>
          </div>
        </section>

        <section className="gsv-section">
          <div className="gsv-card-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            <Link href={`/commercial-it-support-${city.slug}`} className="gsv-card">
              <div className="gsv-eyebrow">For Your Business</div>
              <h3>Commercial IT Support & Networks</h3>
              <p>
                Managed IT, network infrastructure, and security camera systems for
                restaurants, retail, medical, and professional offices in {city.city}.
              </p>
            </Link>

            <Link href={`/home-network-security-${city.slug}`} className="gsv-card">
              <div className="gsv-eyebrow">For Your Home</div>
              <h3>Home Networking & Smart Home Systems</h3>
              <p>
                Home networking, security cameras, and Lutron smart home integration for
                homeowners in {city.city}.
              </p>
            </Link>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
