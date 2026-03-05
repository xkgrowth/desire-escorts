import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Building2, Clock3, CreditCard, MapPin } from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { LocationPricingEstimator } from "../components/domain/location-pricing-estimator";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import {
  formatEuro,
  formatHours,
  locationPricingEstimates,
} from "@/lib/data/location-pricing";
import { getDutchPlaces } from "@/lib/data/nl-places";
import { allProvincePricingGroups } from "@/lib/data/province-pricing";

const paymentMethods = ["Cash", "Mobiel pinnen", "Debitcard", "Creditcard", "Valuta op aanvraag"];

const ratesFaq = [
  {
    question: "Zijn tarieven inclusief vervoer?",
    answer:
      "Ja. De getoonde tarieven zijn inclusief vervoer naar de afgesproken locatie in de genoemde steden.",
  },
  {
    question: "Waarom verschillen minimale uren per stad?",
    answer:
      "De minimale boekduur verschilt per regio op basis van afstand, reistijd en beschikbaarheid van escorts op het gewenste moment.",
  },
  {
    question: "Is online betalen mogelijk?",
    answer:
      "Ja, online betalen is mogelijk. Volgens de legacy tarieveninformatie geldt daarvoor een toeslag van 10%.",
  },
  {
    question: "Wat gebeurt er bij een last-minute annulering?",
    answer:
      "Bij no-show of annulering op het moment van aankomst wordt in de legacy voorwaarden een reiskostenvergoeding van €50 genoemd.",
  },
];

export const metadata: Metadata = {
  title: "Prijzen Desire Escorts | Vanaf €160 | Desire Escorts",
  description:
    "Bekijk actuele escort prijzen per regio en stad. Duidelijke minimale boekduur, transparante prijsindicaties en directe booking via chat of WhatsApp.",
  alternates: {
    canonical: "https://desire-escorts.nl/prijzen",
    languages: {
      "nl-NL": "https://desire-escorts.nl/prijzen",
      "en-US": "https://desire-escorts.nl/en/rates",
    },
  },
};

function getProvinceLowestCombo(rows: { minPrice: number; minHours: number }[]): {
  provinceMinPrice: number;
  provinceMinHours: number;
} {
  if (rows.length === 0) {
    return { provinceMinPrice: 0, provinceMinHours: 0 };
  }

  const lowest = rows.reduce((acc, row) => {
    if (row.minPrice < acc.minPrice) return row;
    if (row.minPrice === acc.minPrice && row.minHours < acc.minHours) return row;
    return acc;
  }, rows[0]);

  return {
    provinceMinPrice: lowest.minPrice,
    provinceMinHours: lowest.minHours,
  };
}

export default async function PricesPage() {
  const dutchPlaces = await getDutchPlaces();

  const slugToProvince = new Map<string, string>();
  for (const group of allProvincePricingGroups) {
    for (const row of group.rows) {
      slugToProvince.set(row.slug, group.province);
    }
  }

  const knownByCity = new Map<string, (typeof locationPricingEstimates)[number] & { province: string }>();
  for (const item of locationPricingEstimates) {
    const province = slugToProvince.get(item.slug);
    if (!province) continue;
    const cityKey = item.city.toLowerCase();
    const existing = knownByCity.get(cityKey);
    if (!existing) {
      knownByCity.set(cityKey, { ...item, province });
      continue;
    }
    if (item.minPrice < existing.minPrice) {
      knownByCity.set(cityKey, { ...item, province });
      continue;
    }
    if (item.minPrice === existing.minPrice && item.minHours < existing.minHours) {
      knownByCity.set(cityKey, { ...item, province });
    }
  }

  const knownLocationEstimates = Array.from(knownByCity.values()).map((item) => ({
    city: item.city,
    slug: item.slug,
    province: item.province,
    minPrice: item.minPrice,
    minHours: item.minHours,
  }));

  const provinceSummary = allProvincePricingGroups.map((group) => ({
    province: group.province,
    ...getProvinceLowestCombo(group.rows),
  }));

  return (
    <PageLayout>
      <PageSection size="sm" className="pb-0">
        <TemplateHeroGlass
          breadcrumbs={[{ label: "Prijzen" }]}
          title="Escort Prijzen per Regio"
          description="Transparante prijsindicaties op basis van live prijzeninformatie en bestaande locatiepagina's. Gebruik deze bedragen als richtlijn; definitieve prijs en boekduur worden bevestigd bij je aanvraag."
          uspItems={[
            { icon: <BadgeEuro className="h-5 w-5" />, title: "Vanaf €160 voor 1 uur" },
            { icon: <Clock3 className="h-5 w-5" />, title: "Minimale boekduur per stad" },
            { icon: <MapPin className="h-5 w-5" />, title: "Landelijke dekking" },
          ]}
        />
      </PageSection>

      <PageSection size="sm">
        <LocationPricingEstimator
          knownLocationEstimates={knownLocationEstimates}
          provinceEstimates={provinceSummary}
          dutchPlaces={dutchPlaces}
        />
      </PageSection>

      <PageSection size="sm" title="Prijzen per stad">
        <div className="space-y-8">
          {allProvincePricingGroups.map((group) => (
            <section
              key={group.province}
              className="overflow-hidden rounded-luxury border border-white/10 bg-surface/30"
            >
              <header className="border-b border-white/10 px-5 py-4 md:px-6">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {group.province}{" "}
                  <span className="text-foreground/60">
                    (vanaf {group.provinceMinPrice > 0 ? formatEuro(group.provinceMinPrice) : "op aanvraag"})
                  </span>
                </h2>
              </header>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] table-fixed">
                  <colgroup>
                    <col className="w-[36%]" />
                    <col className="w-[18%]" />
                    <col className="w-[22%]" />
                    <col className="w-[24%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-5 py-3 text-sm font-medium text-foreground/60 md:px-6">Stad</th>
                      <th className="px-5 py-3 text-sm font-medium text-foreground/60">Vanaf</th>
                      <th className="px-5 py-3 text-sm font-medium text-foreground/60">Min. boekduur</th>
                      <th className="px-5 py-3 text-sm font-medium text-foreground/60">Locatiepagina</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.length === 0 ? (
                      <tr className="border-b border-white/5">
                        <td className="px-5 py-5 text-foreground/70 md:px-6" colSpan={4}>
                          Nog geen tariefregels gekoppeld op basis van bestaande locatiepagina&apos;s.
                        </td>
                      </tr>
                    ) : (
                      group.rows.map((row) => (
                      <tr key={`${group.province}-${row.slug}`} className="border-b border-white/5">
                        <td className="px-5 py-3 text-foreground md:px-6">{row.city}</td>
                        <td className="px-5 py-3 font-semibold text-primary">
                          {formatEuro(row.minPrice)}
                        </td>
                        <td className="px-5 py-3 text-foreground/80">{formatHours(row.minHours)}</td>
                        <td className="px-5 py-3">
                          <Link
                            href={`/${row.slug}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            Bekijk pagina
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </PageSection>

      <PageSection size="sm" title="Betalen en voorwaarden">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-luxury border border-white/10 bg-surface/35 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <CreditCard className="h-5 w-5 text-primary" />
              Betaalmethoden
            </h3>
            <ul className="space-y-2 text-foreground/80">
              {paymentMethods.map((method) => (
                <li key={method}>- {method}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-foreground/65">
              Voor online betalingen geldt volgens de legacy prijzeninformatie een toeslag van 10%.
            </p>
          </div>

          <div className="rounded-luxury border border-white/10 bg-surface/35 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Afspraken en annulering
            </h3>
            <p className="text-foreground/80">
              Bij no-show of last-minute annulering op moment van aankomst wordt in de legacy
              voorwaarden een reiskostenvergoeding van €50 genoemd.
            </p>
            <p className="mt-3 text-foreground/65">
              Waar een provincie nog beperkte tariefregels heeft, tonen we de best beschikbare
              indicaties op basis van bestaande locatiepagina&apos;s. Definitieve prijs blijft altijd op
              aanvraag.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection size="sm">
        <FAQ eyebrow="Veelgestelde vragen" title="Over prijzen" items={ratesFaq} />
      </PageSection>

      <PageSection size="sm">
        <CTASection
          eyebrow="Direct een prijscheck"
          title="Vraag direct je exacte prijsindicatie op"
          description="De tabel is een richtlijn. Deel je stad, tijd en voorkeuren voor een exacte bevestiging inclusief beschikbaarheid."
        />
      </PageSection>
    </PageLayout>
  );
}
