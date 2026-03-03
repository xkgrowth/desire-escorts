import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FilterBar } from "../components/domain/filter-bar";
import { ProfileCard } from "../components/domain/profile-card";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { PageLayout, PageHero, PageSection } from "../components/layout/page-layout";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { mockEscortGrid, homeFaqs } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "Escorts Overzicht Nederland | Desire Escorts",
  description:
    "Bekijk geverifieerde escorts in Nederland met actuele beschikbaarheid. Filter op locatie en service, inclusief escort Amsterdam en andere grote steden.",
  alternates: {
    canonical: "https://desire-escorts.nl/escorts",
  },
};

const filters = [
  {
    id: "city",
    label: "Locatie",
    options: [
      { value: "amsterdam", label: "Amsterdam" },
      { value: "rotterdam", label: "Rotterdam" },
      { value: "den-haag", label: "Den Haag" },
      { value: "utrecht", label: "Utrecht" },
    ],
  },
  {
    id: "service",
    label: "Service",
    options: [
      { value: "gfe", label: "Girlfriend Experience" },
      { value: "massage", label: "Erotische Massage" },
      { value: "hotel", label: "Hotel Service" },
    ],
    multiple: true,
  },
  {
    id: "availability",
    label: "Beschikbaarheid",
    options: [
      { value: "nu", label: "Nu beschikbaar" },
      { value: "vandaag", label: "Vandaag beschikbaar" },
    ],
  },
];

export default function EscortsOverviewPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Overzicht"
        title="Escorts in Nederland"
        description="Vind snel een passende match met actuele beschikbaarheid. Van escort Amsterdam tot landelijke dekking: filter, vergelijk en boek discreet."
        breadcrumbs={<Breadcrumbs items={[{ label: "Escorts" }]} />}
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/escort-amsterdam"
            className="card-surface rounded-luxury px-4 py-2 text-sm text-foreground/85 transition-shadow hover:shadow-glow"
          >
            Escort Amsterdam
          </Link>
          <Link
            href="/services/erotische-massage"
            className="card-surface rounded-luxury px-4 py-2 text-sm text-foreground/85 transition-shadow hover:shadow-glow"
          >
            Escort Massage
          </Link>
        </div>
      </PageHero>

      <PageSection size="sm" className="border-y border-white/5 bg-surface/20">
        <Suspense fallback={<div className="h-14 rounded-luxury bg-surface/40 animate-pulse" />}>
          <FilterBar filters={filters} basePath="/escorts" />
        </Suspense>
      </PageSection>

      <PageSection
        title="Beschikbare Escorts"
        description="Bekijk de selectie hieronder en open een profiel voor details, voorkeuren en directe boekingsmogelijkheden."
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {mockEscortGrid.map((profile) => (
            <ProfileCard key={profile.slug} {...profile} />
          ))}
        </div>
      </PageSection>

      <PageSection size="sm">
        <FAQ
          eyebrow="Veelgestelde vragen"
          title="Escorts boeken: kort uitgelegd"
          items={homeFaqs.slice(0, 4)}
        />
      </PageSection>

      <PageSection size="sm">
        <CTASection />
      </PageSection>
    </PageLayout>
  );
}

