import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalCity } from "@/app/data/localSeo";
import ResidentialCityPage, { residentialCityMeta } from "@/app/components/ResidentialCityPage";

const CITY_SLUG = "granite-bay-ca";

export function generateMetadata(): Metadata {
  const city = getLocalCity(CITY_SLUG);
  if (!city) return {};
  return residentialCityMeta(city);
}

export default function Page() {
  const city = getLocalCity(CITY_SLUG);
  if (!city) notFound();
  return <ResidentialCityPage city={city} />;
}
