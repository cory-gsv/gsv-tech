export const socialProfiles = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/goldenstatevision",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@GoldenStateV",
  },
  {
    label: "Tumblr",
    url: "https://www.tumblr.com/gsvisions",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/tech.gsvisions",
  },
  {
    label: "X",
    url: "https://x.com/techgsvisions",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/gsvisions-tech",
  },
] as const;

export const socialProfileUrls = socialProfiles.map((profile) => profile.url);
