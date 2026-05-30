import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalCity, localCities } from "@/app/data/localSeo";
import LocationPageClient from "./LocationPageClient";

type LocationPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export function generateStaticParams() {
  return localCities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getLocalCity(citySlug);

  if (!city) return {};

  const title = `Managed IT, Networks, Smart Home & AV Services | ${city.city}, ${city.state}`;
  const description = `Golden State Visions provides managed IT, network infrastructure, smart home automation, audio/video, and surveillance services in ${city.city}, ${city.state} and the surrounding ${city.region} area.`;
  const imageUrl = "/assets/images/portfolio/infrastructure-cable-matrix.webp";
  const imageAlt = `Structured network cabling and rack infrastructure for ${city.city}, ${city.state} technology projects by Golden State Visions`;

  return {
    title,
    description,
    alternates: {
      canonical: `/locations/${city.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/locations/${city.slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1600,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { city: citySlug } = await params;
  const city = getLocalCity(citySlug);

  if (!city) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Golden State Visions - ${city.city} Technology Services`,
    image: "/assets/images/portfolio/infrastructure-cable-matrix.webp",
    telephone: "(916) 432-3373",
    areaServed: {
      "@type": "City",
      name: `${city.city}, ${city.state}`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.state,
      addressCountry: "US",
    },
    url: `/locations/${city.slug}`,
    description: `Managed IT, network infrastructure, smart home automation, audio/video, and surveillance services in ${city.city}, ${city.state}.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationPageClient city={city} />
    </>
  );
}
