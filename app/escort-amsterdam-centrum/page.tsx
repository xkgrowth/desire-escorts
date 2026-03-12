import type { Metadata } from "next";
import { LocationDetailTemplate } from "../components/domain/location-detail-template";
import { locationDetailPagesBatch } from "@/lib/data/location-detail-pages-batch";

const pageData = locationDetailPagesBatch["escort-amsterdam-centrum"];

export const metadata: Metadata = {
  title: pageData.metaTitle,
  description: pageData.metaDescription,
  alternates: {
    canonical: "https://desire-escorts.nl/escort-amsterdam-centrum",
    languages: {
      "nl-NL": "https://desire-escorts.nl/escort-amsterdam-centrum",
      "en-US": "https://desire-escorts.nl/en/escort-amsterdam-city-centre",
    },
  },
};

export default function EscortAmsterdamCentrumPage() {
  return <LocationDetailTemplate data={pageData} />;
}
