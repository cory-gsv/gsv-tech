import JsonLd from "@/app/components/JsonLd";
import ConceptExperience from "@/app/concept/ConceptExperience";
import { homePageStructuredData } from "@/app/data/structuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Managed IT & Smart Home Services | Golden State Visions",
  description:
    "Managed IT, secure networks, smart-home automation, lighting, audio, video, and surveillance for Northern California businesses and homeowners.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Managed IT & Smart Home Services | Golden State Visions",
    description:
      "One local technology partner for managed IT, secure networks, smart-home automation, lighting, audio, video, and surveillance.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Golden State Visions managed IT, network, smart home, and audio video services",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homePageStructuredData()} />
      <ConceptExperience />
    </>
  );
}
