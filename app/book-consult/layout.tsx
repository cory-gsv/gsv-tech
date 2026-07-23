import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book a Consult | Golden State Visions",
  description:
    "Book a 30-minute consultation with Golden State Visions for managed IT, networking, smart home automation, or audio/video systems.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Consult | Golden State Visions",
    description:
      "Book a 30-minute consultation with Golden State Visions for managed IT, networking, smart home automation, or audio/video systems.",
  },
};

export default function BookConsultLayout({ children }: { children: ReactNode }) {
  return children;
}

