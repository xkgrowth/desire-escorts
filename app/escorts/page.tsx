import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FilterBar } from "../components/domain/filter-bar";
import { ProfileCard } from "../components/domain/profile-card";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { PageLayout, PageHero, PageSection } from "../components/layout/page-layout";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { getProfiles, profileToCardProps } from "@/lib/api";
import { deriveFilterOptions } from "@/lib/filters/filter-utils";
import { homeFaqs } from "@/lib/data/mock-data";

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
  const filterOptions = deriveFilterOptions(profiles);

  // Build dynamic filter config from actual data
  const filters = [
    {
      id: "service",
      label: "Service",
      options: filterOptions.services.slice(0, 8).map((s) => ({
        value: s.value,
        label: s.value.charAt(0).toUpperCase() + s.value.slice(1).replace(/-/g, " "),
      })),
      multiple: true,
    },
    {
      id: "availability",
      label: "Beschikbaarheid",
      options: [
        { value: "nu", label: "Nu beschikbaar" },
      ],
    },
  ];

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
        description={`${profiles.length} escorts beschikbaar — bekijk profielen voor details, voorkeuren en directe boekingsmogelijkheden.`}
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.slug} {...profileToCardProps(profile)} />
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
