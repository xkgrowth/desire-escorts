import type { Metadata } from "next";
import { ServiceTypeDetailTemplate } from "../components/domain/service-type-detail-template";
import { aziatischeEscortsPageData } from "@/lib/data/service-type-detail-pages";

const data = aziatischeEscortsPageData;

export const metadata: Metadata = {
  title: `${data.title} | Vanaf €160 | Desire Escorts`,
  description: data.metaDescription,
  alternates: {
    canonical: `https://desire-escorts.nl/${data.slug}`,
    languages: {
      "nl-NL": `https://desire-escorts.nl/${data.slug}`,
      "en-US": `https://desire-escorts.nl/en/${data.slug}`,
    },
  },
  openGraph: {
    title: `${data.title} | Desire Escorts`,
    description: data.metaDescription,
    url: `https://desire-escorts.nl/${data.slug}`,
    siteName: "Desire Escorts",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: data.ogImageUrl ?? data.primaryImageUrl,
        width: 1200,
        height: 630,
        alt: data.primaryImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${data.title} | Desire Escorts`,
    description: data.metaDescription,
    images: [data.ogImageUrl ?? data.primaryImageUrl],
  },
};

function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function generateBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://desire-escorts.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Escort Types",
        item: "https://desire-escorts.nl/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.title,
        item: `https://desire-escorts.nl/${data.slug}`,
      },
    ],
  };
}

export default function AziatischeEscortsPage() {
  const faqSchema = generateFAQSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServiceTypeDetailTemplate data={data} locale="nl" />
    </>
  );
}
