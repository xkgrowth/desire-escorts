import {
  getLocationPricingEstimateBySlug,
  provincePricingGroups,
  type ProvincePricingGroup,
  type ProvincePricingRow,
} from "./location-pricing";

type ProvinceSeed = {
  slug: string;
  label: string;
  fallbackCitySlugs: string[];
};

const PROVINCE_SEEDS: ProvinceSeed[] = [
  { slug: "noord-holland", label: "Noord-Holland", fallbackCitySlugs: [] },
  { slug: "zuid-holland", label: "Zuid-Holland", fallbackCitySlugs: [] },
  { slug: "flevoland", label: "Flevoland", fallbackCitySlugs: [] },
  { slug: "utrecht", label: "Utrecht", fallbackCitySlugs: [] },
  { slug: "gelderland", label: "Gelderland", fallbackCitySlugs: [] },
  { slug: "noord-brabant", label: "Noord-Brabant", fallbackCitySlugs: [] },
  { slug: "overijssel", label: "Overijssel", fallbackCitySlugs: [] },
  {
    slug: "drenthe",
    label: "Drenthe",
    fallbackCitySlugs: ["escort-assen", "escort-emmen", "escort-drenthe"],
  },
  {
    slug: "friesland",
    label: "Friesland",
    fallbackCitySlugs: ["escort-leeuwarden", "escort-heerenveen", "escort-friesland"],
  },
  {
    slug: "groningen",
    label: "Groningen",
    fallbackCitySlugs: ["escort-groningen"],
  },
  {
    slug: "zeeland",
    label: "Zeeland",
    fallbackCitySlugs: ["escort-middelburg", "escort-zeeland"],
  },
  {
    slug: "limburg",
    label: "Limburg",
    fallbackCitySlugs: ["escort-heerlen", "escort-venlo", "escort-limburg"],
  },
];

function normalizeProvinceKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function minPriceFromRows(rows: ProvincePricingRow[]): number {
  if (rows.length === 0) return 0;
  return rows.reduce((acc, row) => (row.minPrice < acc ? row.minPrice : acc), rows[0].minPrice);
}

const provinceGroupMap = new Map<string, ProvincePricingGroup>();
for (const group of provincePricingGroups) {
  provinceGroupMap.set(normalizeProvinceKey(group.province), group);
}

function buildRowsFromFallbackSlugs(slugs: string[]): ProvincePricingRow[] {
  return slugs
    .map((slug) => getLocationPricingEstimateBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      city: item.city,
      slug: item.slug,
      minPrice: item.minPrice,
      minHours: item.minHours,
    }));
}

export const allProvincePricingGroups: ProvincePricingGroup[] = PROVINCE_SEEDS.map((seed) => {
  const existing = provinceGroupMap.get(seed.slug);
  if (existing) {
    return {
      province: seed.label,
      provinceMinPrice: existing.provinceMinPrice,
      rows: existing.rows,
    };
  }

  const fallbackRows = buildRowsFromFallbackSlugs(seed.fallbackCitySlugs);
  return {
    province: seed.label,
    provinceMinPrice: minPriceFromRows(fallbackRows),
    rows: fallbackRows,
  };
});
