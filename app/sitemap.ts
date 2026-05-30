import type { MetadataRoute } from "next";
import { localCities, localServices } from "@/app/data/localSeo";

const siteUrl = "https://tech.gsvisions.com";

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
    "/commercial-it-support-lincoln-ca",
    "/home-network-security-lincoln-ca",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const locationRoutes = localCities.map((city) => ({
    url: `${siteUrl}/locations/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const serviceCityRoutes = localServices.flatMap((service) =>
    localCities.map((city) => ({
      url: `${siteUrl}/services/${service.slug}/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...locationRoutes, ...serviceCityRoutes];
}
