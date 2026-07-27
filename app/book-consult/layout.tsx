import type { Metadata } from "next";
import type { ReactNode } from "react";

const socialImage = "/images/gsv-logo.png";

export const metadata: Metadata = {
  title: "Book a Consult | Golden State Visions",
  description:
    "Book a 30-minute consultation for managed IT, secure networks, smart home automation, audio/video, or surveillance with Golden State Visions.",
  alternates: {
    canonical: "/book-consult",
  },
  openGraph: {
    title: "Book a Consult | Golden State Visions",
    description:
      "Book a 30-minute consultation with Golden State Visions for managed IT, networking, smart home automation, or audio/video systems.",
    url: "/book-consult",
    siteName: "Golden State Visions",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1798,
        height: 877,
        alt: "Golden State Visions managed IT, network, smart home, and audio video services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Consult | Golden State Visions",
    description:
      "Book a 30-minute consultation with Golden State Visions for managed IT, networking, smart home automation, or audio/video systems.",
    images: [socialImage],
  },
};

export default function BookConsultLayout({ children }: { children: ReactNode }) {
  return children;
}
