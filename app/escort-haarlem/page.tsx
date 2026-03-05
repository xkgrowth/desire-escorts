import type { Metadata } from "next";
import { LocationDetailTemplate } from "../components/domain/location-detail-template";
import { locationDetailPages } from "@/lib/data/location-detail-pages";

const pageData = locationDetailPages["escort-haarlem"];

export const metadata: Metadata = {
  title: pageData.metaTitle,
  description: pageData.metaDescription,
  alternates: {
    canonical: "https://desire-escorts.nl/escort-haarlem",
    languages: {
      "nl-NL": "https://desire-escorts.nl/escort-haarlem",
      "en-US": "https://desire-escorts.nl/en/escort-haarlem",
    },
  },
};

export default function EscortHaarlemPage() {
  return <LocationDetailTemplate data={pageData} />;
}

