import type { Metadata } from "next";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { ScrollReveal } from "../components/ui/scroll-reveal";
import { getProfiles } from "@/lib/api";
import { homeFaqs } from "@/lib/data/mock-data";
import { OverviewContent } from "@/src/components/OverviewContent";
import { Award, BadgeEuro, Clock3, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Escorts Overzicht Nederland | Desire Escorts",
  description:
    "Bekijk geverifieerde escorts in Nederland met actuele beschikbaarheid. Filter op locatie en service, met duidelijke prijsindicatie vanaf €160 en minimale boekduur per stad.",
  alternates: {
    canonical: "https://desire-escorts.nl/alle-escorts",
  },
};

export default async function EscortsOverviewPage() {
  const profiles = await getProfiles();

  return (
    <PageLayout>
      <PageSection size="sm" className="pb-0">
        <ScrollReveal>
          <TemplateHeroGlass
            breadcrumbs={[{ label: "Escorts" }]}
            title="Escorts in Nederland"
            description="Vind snel een passende match met actuele beschikbaarheid. Filter op locatie en service, vergelijk profielen en boek discreet met duidelijke prijsverwachting vooraf."
            uspItems={[
              {
                icon: <Shield className="h-5 w-5" />,
                title: "100% discreet",
              },
              {
                icon: <Clock3 className="h-5 w-5" />,
                title: "Live beschikbaarheid",
              },
              {
                icon: <Award className="h-5 w-5" />,
                title: "Geverifieerde profielen",
              },
              {
                icon: <BadgeEuro className="h-5 w-5" />,
                title: "Vanaf €160, boekduur per stad",
              },
            ]}
          />
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm" className="pt-4 md:pt-6 lg:pt-8">
        <OverviewContent profiles={profiles} />
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.08}>
          <CTASection />
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.1}>
          <FAQ
            eyebrow="Veelgestelde vragen"
            title="Escorts boeken: kort uitgelegd"
            items={homeFaqs.slice(0, 4)}
          />
        </ScrollReveal>
      </PageSection>
    </PageLayout>
  );
}
