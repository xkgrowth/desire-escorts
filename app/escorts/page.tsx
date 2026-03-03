import type { Metadata } from "next";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { getProfiles } from "@/lib/api";
import { homeFaqs } from "@/lib/data/mock-data";
import { OverviewContent } from "@/src/components/OverviewContent";
import { Award, Clock3, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Escorts Overzicht Nederland | Desire Escorts",
  description:
    "Bekijk geverifieerde escorts in Nederland met actuele beschikbaarheid. Filter op locatie en service, inclusief escort Amsterdam en andere grote steden.",
  alternates: {
    canonical: "https://desire-escorts.nl/escorts",
  },
};

export default async function EscortsOverviewPage() {
  const profiles = await getProfiles();

  return (
    <PageLayout>
      <PageSection size="sm" className="pb-0">
        <TemplateHeroGlass
          breadcrumbs={[{ label: "Escorts" }]}
          title="Escorts in Nederland"
          description="Vind snel een passende match met actuele beschikbaarheid. Van escort Amsterdam tot landelijke dekking: filter, vergelijk en boek discreet."
          uspItems={[
            {
              icon: <Shield className="h-5 w-5" />,
              title: "100% discreet",
            },
            {
              icon: <Clock3 className="h-5 w-5" />,
              title: "24/7 beschikbaar",
            },
            {
              icon: <Award className="h-5 w-5" />,
              title: "Geverifieerde profielen",
            },
          ]}
        />
      </PageSection>

      <PageSection
        title="Beschikbare Escorts"
        description={`${profiles.length} escorts beschikbaar — bekijk profielen voor details, voorkeuren en directe boekingsmogelijkheden.`}
      >
        <OverviewContent profiles={profiles} />
      </PageSection>

      <PageSection size="sm">
        <CTASection />
      </PageSection>

      <PageSection size="sm">
        <FAQ
          eyebrow="Veelgestelde vragen"
          title="Escorts boeken: kort uitgelegd"
          items={homeFaqs.slice(0, 4)}
        />
      </PageSection>
    </PageLayout>
  );
}
