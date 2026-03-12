import type { Metadata } from "next";
import { LocationDetailTemplate } from "../components/domain/location-detail-template";
import { locationDetailPagesBatch } from "@/lib/data/location-detail-pages-batch";

const pageData = locationDetailPagesBatch["escort-amsterdam-noord"];

export const metadata: Metadata = {
  title: pageData.metaTitle,
  description: pageData.metaDescription,
  alternates: {
    canonical: "https://desire-escorts.nl/escort-amsterdam-noord",
    languages: {
      "nl-NL": "https://desire-escorts.nl/escort-amsterdam-noord",
      "en-US": "https://desire-escorts.nl/en/escort-amsterdam-north",
    },
  },
};

export default function EscortAmsterdamNoordPage() {
  return <LocationDetailTemplate data={pageData} />;
}
