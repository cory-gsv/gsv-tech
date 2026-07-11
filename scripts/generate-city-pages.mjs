#!/usr/bin/env node

/**
 * Generates the thin per-city route files for the consolidated
 * business ("/commercial-it-support-{city}") and residential
 * ("/home-network-security-{city}") landing pages.
 *
 * Single source of truth for which cities exist is the `localCities`
 * array in app/data/localSeo.ts. This script reads that file as text
 * (rather than importing it) so it needs no extra dependencies
 * (no ts-node/tsx) to run under plain Node.
 *
 * Usage:
 *   node scripts/generate-city-pages.mjs
 *
 * To add a new city: add one entry to localCities in
 * app/data/localSeo.ts, then re-run this script. Existing pages are
 * regenerated in place (safe to re-run any time); nothing is deleted
 * for cities that are removed from localSeo.ts, so remove those
 * folders by hand if a city is ever retired.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localSeoPath = path.join(projectRoot, "app/data/localSeo.ts");
const appDir = path.join(projectRoot, "app");

function extractCitySlugs(source) {
  const match = source.match(/export const localCities:[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!match) {
    throw new Error("Could not find `localCities` array in app/data/localSeo.ts");
  }

  const block = match[1];
  const slugs = [...block.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

  if (slugs.length === 0) {
    throw new Error("Found `localCities` array but no city slugs inside it.");
  }

  return slugs;
}

function businessPageSource(slug) {
  return `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalCity } from "@/app/data/localSeo";
import BusinessCityPage, { businessCityMeta } from "@/app/components/BusinessCityPage";

const CITY_SLUG = "${slug}";

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
`;
}

function residentialPageSource(slug) {
  return `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocalCity } from "@/app/data/localSeo";
import ResidentialCityPage, { residentialCityMeta } from "@/app/components/ResidentialCityPage";

const CITY_SLUG = "${slug}";

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
`;
}

function main() {
  const source = readFileSync(localSeoPath, "utf8");
  const slugs = extractCitySlugs(source);

  let written = 0;

  for (const slug of slugs) {
    const businessDir = path.join(appDir, `commercial-it-support-${slug}`);
    const residentialDir = path.join(appDir, `home-network-security-${slug}`);

    mkdirSync(businessDir, { recursive: true });
    mkdirSync(residentialDir, { recursive: true });

    writeFileSync(path.join(businessDir, "page.tsx"), businessPageSource(slug));
    writeFileSync(path.join(residentialDir, "page.tsx"), residentialPageSource(slug));

    written += 2;
  }

  console.log(`Generated ${written} page files for ${slugs.length} cities:`);
  for (const slug of slugs) {
    console.log(`  - ${slug}`);
  }
}

main();
