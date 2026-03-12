import type { Metadata } from "next";
import { PageWrapper, Section, Container } from "../components/ui/page-wrapper";
import { CTASection } from "../components/domain/cta-section";
import { getKnowledgeCategories } from "@/lib/data/knowledge-centre";
import { KnowledgeOverviewBrowser } from "../components/domain/knowledge-overview-browser";

export const metadata: Metadata = {
  title: "Kennisbank | Desire Escorts",
  description:
    "Voor al jouw vragen over boekingen, discretie, locaties en betalingen. Bekijk de volledige Desire Escorts kennisbank.",
  alternates: {
    canonical: "https://desire-escorts.nl/kennisbank/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/kennisbank/",
      "en-US": "https://desire-escorts.nl/en/kennisbank/",
    },
  },
};

export default function KnowledgeOverviewPage() {
  const categories = getKnowledgeCategories();
  const browserCategories = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    docs: category.docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      path: doc.path,
    })),
  }));

  return (
    <PageWrapper withGradient={true}>
      <Section size="sm" className="pt-10 md:pt-14">
        <Container size="2xl">
          <KnowledgeOverviewBrowser
            categories={browserCategories}
            eyebrow="Kennisbank"
            title="Kennisbank"
            description="Voor al jouw vragen over boekingen, discretie, prijzen, services en locaties. Vind direct het antwoord of open een artikel voor de volledige uitleg."
          />
        </Container>
      </Section>

      <Section size="sm" className="pt-2 pb-14">
        <Container size="2xl">
          <CTASection
            eyebrow="Hulp nodig?"
            title="Neem direct contact op"
            description="Staat jouw vraag niet in de kennisbank? Ons team helpt je snel en discreet verder via telefoon, chat of WhatsApp."
          />
        </Container>
      </Section>
    </PageWrapper>
  );
}
