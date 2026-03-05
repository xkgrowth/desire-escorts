import type { Metadata } from "next";
import { LocationDetailTemplate } from "../components/domain/location-detail-template";
import { locationDetailPages } from "@/lib/data/location-detail-pages";

const pageData = locationDetailPages["escort-amstelveen"];

export const metadata: Metadata = {
  title: pageData.metaTitle,
  description: pageData.metaDescription,
  alternates: {
    canonical: "https://desire-escorts.nl/escort-amstelveen",
    languages: {
      "nl-NL": "https://desire-escorts.nl/escort-amstelveen",
      "en-US": "https://desire-escorts.nl/en/escort-amstelveen",
    },
  },
};

export default function EscortAmstelveenPage() {
  return <LocationDetailTemplate data={pageData} />;
}

