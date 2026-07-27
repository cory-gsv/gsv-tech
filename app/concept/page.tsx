import type { Metadata } from "next";
import ConceptExperience from "./ConceptExperience";

export const metadata: Metadata = {
  title: "Homepage Concept | Golden State Visions",
  description:
    "An interactive homepage concept for Golden State Visions organized around business and residential customer needs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConceptPage() {
  return <ConceptExperience />;
}
