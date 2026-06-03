const fallbackSiteUrl = "https://gsvisions.com";

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL || fallbackSiteUrl,
);
