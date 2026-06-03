const fallbackSiteUrl = "https://gsvstack.com";

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL || fallbackSiteUrl,
);
