import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/config/site";
import { blogPosts } from "@/app/data/blog";
import { localCities } from "@/app/data/localSeo";

// Keep these dates aligned with the last substantive update to the shared site
// content and the local SEO data respectively.
const siteContentLastModified = "2026-07-26";
const localSeoContentLastModified = "2026-07-26";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { route: "", changeFrequency: "weekly" as const, priority: 1 },
    { route: "/managed-it", changeFrequency: "monthly" as const, priority: 0.9 },
    {
      route: "/smart-home-automation",
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    { route: "/resources", changeFrequency: "monthly" as const, priority: 0.7 },
    { route: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { route: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { route: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { route: "/book-consult", changeFrequency: "monthly" as const, priority: 0.6 },
    { route: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.2 },
    { route: "/sms-terms", changeFrequency: "yearly" as const, priority: 0.2 },
  ].map(({ route, changeFrequency, priority }) => ({
    url: `${siteUrl}${route}`,
    lastModified: siteContentLastModified,
    changeFrequency,
    priority,
  }));

  // Search-facing business vs. residential landing pages, one pair per city.
  // The /locations/[city] chooser pages remain crawlable for navigation, but
  // are intentionally noindex so they do not compete with these intent pages.
  const cityAudienceRoutes = localCities.flatMap((city) => [
    {
      url: `${siteUrl}/commercial-it-support-${city.slug}`,
      lastModified: localSeoContentLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/home-network-security-${city.slug}`,
      lastModified: localSeoContentLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...cityAudienceRoutes];
}
