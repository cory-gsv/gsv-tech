import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalCity } from "@/app/data/localSeo";
import BusinessCityPage, { businessCityMeta } from "@/app/components/BusinessCityPage";

const CITY_SLUG = "truckee-ca";

export function generateMetadata(): Metadata {
  const city = getLocalCity(CITY_SLUG);
  if (!city) return {};
  return businessCityMeta(city);
}

export default function Page() {
  const city = getLocalCity(CITY_SLUG);
  if (!city) notFound();
  return <BusinessCityPage city={city} />;
}
