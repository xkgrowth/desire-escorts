import type { Metadata } from "next";
import { ServiceTypeDetailTemplate } from "../components/domain/service-type-detail-template";
import { getServiceTypePageBySlug } from "@/lib/data/service-type-detail-pages";

const data = getServiceTypePageBySlug("hotel-escort")!;

export const metadata: Metadata = {
  title: `${data.title} | Vanaf €160, Discreet | Desire Escorts`,
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
        url: "/brand/preview-image-desirev2.png?v=2",
        width: 1200,
        height: 630,
        alt: "Desire Escorts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${data.title} | Desire Escorts`,
    description: data.metaDescription,
    images: ["/brand/preview-image-desirev2.png?v=2"],
  },
};

function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    description: data.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "Desire Escorts",
      url: "https://desire-escorts.nl",
      telephone: "+31642188911",
      priceRange: "€€€",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Amsterdam",
        addressCountry: "NL",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    serviceType: "Hotel Escort Service",
    offers: {
      "@type": "Offer",
      price: "160",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "160",
        priceCurrency: "EUR",
        unitText: "per hour",
      },
    },
  };
}

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
        name: "Services",
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

export default function HotelEscortPage() {
  const serviceSchema = generateServiceSchema();
  const faqSchema = generateFAQSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
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
