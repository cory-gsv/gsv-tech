import type { Metadata } from "next";
import type { ReactNode } from "react";

const socialImage = "/images/gsv-logo.png";

export const metadata: Metadata = {
  title: "Contact Golden State Visions | IT & Technology Support",
  description:
    "Contact Golden State Visions for managed IT, secure networks, smart home automation, audio/video, surveillance, or general technology questions.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Golden State Visions | IT & Technology Support",
    description:
      "Ask a question or request a callback from Golden State Visions for business IT, networking, smart home, audio/video, or surveillance needs.",
    url: "/contact",
    siteName: "Golden State Visions",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1798,
        height: 877,
        alt: "Golden State Visions managed IT and technology services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Golden State Visions | IT & Technology Support",
    description:
      "Ask a question or request a callback for business IT, networking, smart home, audio/video, or surveillance needs.",
    images: [socialImage],
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
