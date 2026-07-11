import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/config/site";
import { localCities } from "@/app/data/localSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/services/managed-it",
    "/services/networks-security-systems",
    "/services/smart-home-automation",
    "/services/audio-video-surveillance",
    "/book-consult",
    "/privacy-policy",
    "/sms-terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Lightweight per-city hub page (links out to the business/residential pages below).
  const locationRoutes = localCities.map((city) => ({
    url: `${siteUrl}/locations/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Consolidated business vs. residential landing pages, one pair per city.
  const cityAudienceRoutes = localCities.flatMap((city) => [
    {
      url: `${siteUrl}/commercial-it-support-${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/home-network-security-${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  return [...staticRoutes, ...locationRoutes, ...cityAudienceRoutes];
}
