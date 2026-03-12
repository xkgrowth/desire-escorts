import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Clock3, ShieldCheck } from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { FaqAccordion } from "../components/domain/faq-accordion";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { getAllFaqCategories } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen (FAQ) | Desire Escorts",
  description:
    "Bekijk antwoorden over boekingen, discretie, betaling, services en beschikbaarheid. Vind snel je antwoord of neem direct contact op.",
  alternates: {
    canonical: "https://desire-escorts.nl/faq/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/faq/",
      "en-US": "https://desire-escorts.nl/en/faq/",
    },
  },
};

export default function FaqPage() {
  const categories = getAllFaqCategories();
  const allFaqItems = categories.flatMap((category) => category.faqs);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl/" },
      { "@type": "ListItem", position: 2, name: "FAQ", item: "https://desire-escorts.nl/faq/" },
    ],
  };

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

      <PageLayout>
        <PageSection size="sm" className="pb-0">
          <TemplateHeroGlass
            breadcrumbs={[{ label: "Veelgestelde Vragen" }]}
            title="Veelgestelde vragen over Desire Escorts"
            description="Een centrale FAQ met korte antwoorden over boekingen, prijzen, discretie en beschikbaarheid. Voor verdiepende uitleg kun je per onderwerp verder naar de kennisbank."
            uspItems={[
              { icon: <BookOpenCheck className="h-5 w-5" />, title: "Per onderwerp gebundeld" },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Duidelijke privacy-antwoorden" },
              { icon: <Clock3 className="h-5 w-5" />, title: "Snel antwoord, direct contact" },
            ]}
          />
        </PageSection>

        <PageSection size="sm" title="Veel gestelde vragen">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {categories.map((category) => (
              <section
                key={category.slug}
                className="rounded-luxury border border-white/10 bg-surface/35 p-5"
              >
                <h2 className="mb-4 text-xl font-heading font-bold text-foreground">{category.name}</h2>
                <FaqAccordion faqs={category.faqs} />
                <Link
                  href={`/kennisbank/${category.slug}/`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
                >
                  Bekijk kennisbank artikelen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            ))}
          </div>
        </PageSection>

        <PageSection size="sm">
          <CTASection
            eyebrow="Nog vragen?"
            title="Neem direct contact op met ons team"
            description="Staat jouw vraag niet in de FAQ of kennisbank? We helpen je discreet verder via chat, WhatsApp of telefoon."
          />
        </PageSection>
      </PageLayout>
    </>
  );
}
