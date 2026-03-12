import {
  getLocationPricingEstimateBySlug,
  provincePricingGroups,
  type LocationPricingEstimate,
} from "./location-pricing";

export type LocationTier = 1 | 2 | 3;

export type LocationImageCandidates = {
  primary: string[];
  secondary: string[];
};

export type LocationRegistryEntry = {
  slug: string;
  city: string;
  province: string | null;
  tier: LocationTier;
  hasScrape: boolean;
  requiresFreshBuild: boolean;
  pricing: LocationPricingEstimate | null;
  imageCandidates: LocationImageCandidates;
};

const TIER_1_SLUGS = new Set([
  "escort-amsterdam",
  "escort-amsterdam-centrum",
  "escort-rotterdam",
  "escort-den-haag",
  "escort-utrecht",
]);

const TIER_2_SLUGS = new Set([
  "escort-eindhoven",
  "escort-groningen",
  "escort-breda",
  "escort-tilburg",
  "escort-almere",
  "escort-arnhem",
]);

const MISSING_SCRAPE_SLUGS = new Set(["escort-amsterdam"]);

// Authoritative scope from data/inventory/nl-location-slugs.txt (223 slugs).
export const NL_LOCATION_SCOPE_SLUGS = [
  "escort-aalsmeer",
  "escort-abcoude",
  "escort-aerdenhout",
  "escort-akersloot",
  "escort-alblasserdam",
  "escort-alkmaar",
  "escort-almelo",
  "escort-almere",
  "escort-alphen-aan-den-rijn",
  "escort-amersfoort",
  "escort-amstelveen",
  "escort-amsterdam",
  "escort-amsterdam-centrum",
  "escort-amsterdam-noord",
  "escort-amsterdam-oost",
  "escort-amsterdam-west",
  "escort-amsterdam-zuid",
  "escort-anna-paulowna",
  "escort-antwerpen",
  "escort-arnhem",
  "escort-assen",
  "escort-assendelft",
  "escort-avenhorn",
  "escort-baambrugge",
  "escort-baarn",
  "escort-badhoevendorp",
  "escort-barendrecht",
  "escort-beemster",
  "escort-bennebroek",
  "escort-bergambacht",
  "escort-bergen",
  "escort-bergschenhoek",
  "escort-berkel-en-rodenrijs",
  "escort-beverwijk",
  "escort-bilthoven",
  "escort-blaricum",
  "escort-bleiswijk",
  "escort-bloemendaal",
  "escort-bodegraven",
  "escort-bovenkarspel",
  "escort-breda",
  "escort-breukelen",
  "escort-brielle",
  "escort-broek-in-waterland",
  "escort-brussel",
  "escort-bunnik",
  "escort-bunschoten",
  "escort-bussum",
  "escort-callantsoog",
  "escort-capelle-aan-den-ijssel",
  "escort-castricum",
  "escort-culemborg",
  "escort-de-bilt",
  "escort-de-lier",
  "escort-delfgauw",
  "escort-delft",
  "escort-den-bosch",
  "escort-den-haag",
  "escort-den-helder",
  "escort-diemen",
  "escort-dordrecht",
  "escort-drenthe",
  "escort-driebergen-rijsenburg",
  "escort-duivendrecht",
  "escort-edam",
  "escort-eemnes",
  "escort-egmond",
  "escort-eindhoven",
  "escort-emmen",
  "escort-enkhuizen",
  "escort-enschede",
  "escort-flevoland",
  "escort-frankfurt",
  "escort-friesland",
  "escort-gelderland",
  "escort-gorinchem",
  "escort-gouda",
  "escort-groningen",
  "escort-grootebroek",
  "escort-haarlem",
  "escort-halfweg",
  "escort-harderwijk",
  "escort-harmelen",
  "escort-heemskerk",
  "escort-heemstede",
  "escort-heerenveen",
  "escort-heerhugowaard",
  "escort-heerlen",
  "escort-heiloo",
  "escort-hellevoetsluis",
  "escort-hillegom",
  "escort-hilversum",
  "escort-hoek-van-holland",
  "escort-honselersdijk",
  "escort-hoofddorp",
  "escort-hoogkarspel",
  "escort-hoorn",
  "escort-houten",
  "escort-huizen",
  "escort-ijmuiden",
  "escort-ijsselstein",
  "escort-julianadorp",
  "escort-katwijk",
  "escort-koog-aan-de-zaan",
  "escort-krimpen-aan-den-ijssel",
  "escort-kudelstaart",
  "escort-kwintsheul",
  "escort-landsmeer",
  "escort-laren",
  "escort-leerdam",
  "escort-leeuwarden",
  "escort-leiden",
  "escort-leiderdorp",
  "escort-leidschendam",
  "escort-lelystad",
  "escort-leusden",
  "escort-lijnden",
  "escort-limburg",
  "escort-limmen",
  "escort-linschoten",
  "escort-lisse",
  "escort-loosdrecht",
  "escort-lopik",
  "escort-maarssen",
  "escort-maartensdijk",
  "escort-maasdijk",
  "escort-maassluis",
  "escort-medemblik",
  "escort-middelburg",
  "escort-middelharnis",
  "escort-middenbeemster",
  "escort-mijdrecht",
  "escort-monnickendam",
  "escort-monster",
  "escort-montfoort",
  "escort-muiden",
  "escort-naaldwijk",
  "escort-naarden",
  "escort-nieuw-vennep",
  "escort-nieuwegein",
  "escort-nieuwerkerk-aan-den-ijssel",
  "escort-nieuwkoop",
  "escort-nijmegen",
  "escort-noord-holland",
  "escort-noordwijk",
  "escort-noordwijkerhout",
  "escort-obdam",
  "escort-oegstgeest",
  "escort-oosthuizen",
  "escort-oostzaan",
  "escort-opmeer",
  "escort-osdorp",
  "escort-oud-beijerland",
  "escort-ouderkerk-aan-de-amstel",
  "escort-oudewater",
  "escort-overijssel",
  "escort-papendrecht",
  "escort-petten",
  "escort-pijnacker",
  "escort-poeldijk",
  "escort-poortugaal",
  "escort-purmerend",
  "escort-rhenen",
  "escort-rhoon",
  "escort-ridderkerk",
  "escort-rijswijk",
  "escort-roelofarendsveen",
  "escort-rotterdam",
  "escort-s-gravenzande",
  "escort-schagen",
  "escort-scheveningen",
  "escort-schiedam",
  "escort-schiphol",
  "escort-schipluiden",
  "escort-schoonhoven",
  "escort-schoorl",
  "escort-service-zuid-holland",
  "escort-simonshaven",
  "escort-sliedrecht",
  "escort-sloterdijk",
  "escort-soest",
  "escort-spaarndam",
  "escort-spakenburg",
  "escort-spanbroek",
  "escort-spijkenisse",
  "escort-t-gooi",
  "escort-tilburg",
  "escort-tuitjenhorn",
  "escort-uitgeest",
  "escort-uithoorn",
  "escort-ursem",
  "escort-utrecht",
  "escort-veenendaal",
  "escort-velsen",
  "escort-venhuizen",
  "escort-venlo",
  "escort-vianen",
  "escort-vinkeveen",
  "escort-vlaardingen",
  "escort-vogelenzang",
  "escort-volendam",
  "escort-voorburg",
  "escort-voorschoten",
  "escort-wassenaar",
  "escort-wateringen",
  "escort-weesp",
  "escort-wieringerwerf",
  "escort-winkel",
  "escort-woerden",
  "escort-wormer",
  "escort-wormerveer",
  "escort-woudenberg",
  "escort-zaandam",
  "escort-zaandijk",
  "escort-zaanstad",
  "escort-zandvoort",
  "escort-zeeland",
  "escort-zeist",
  "escort-zoetermeer",
  "escort-zuiderwoude",
  "escort-zwaag",
  "escort-zwanenburg",
  "escort-zwolle",
] as const;

const provinceBySlug = new Map<string, string>();
for (const group of provincePricingGroups) {
  for (const row of group.rows) {
    provinceBySlug.set(row.slug, group.province);
  }
}

function inferCityFromSlug(slug: string): string {
  return slug
    .replace(/^escort-/, "")
    .split("-")
    .map((part) => (part.length > 2 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function getLocationTier(slug: string): LocationTier {
  if (TIER_1_SLUGS.has(slug)) return 1;
  if (TIER_2_SLUGS.has(slug)) return 2;
  return 3;
}

function buildImageCandidates(slug: string): LocationImageCandidates {
  const suffix = slug.replace(/^escort-/, "");
  const base = "https://desire-escorts.nl/wp-content/uploads";
  return {
    primary: [
      `${base}/escort-dames-in-${suffix}-scaled.webp`,
      `${base}/escort-dames-in-${suffix}-scaled.jpg`,
      `${base}/escort-${suffix}-scaled.jpg`,
      `${base}/escort-${suffix}-scaled.webp`,
    ],
    secondary: [
      `${base}/escort-${suffix}-hotels-scaled.jpg`,
      `${base}/escort-${suffix}-hotels-1-scaled.jpg`,
    ],
  };
}

export const locationRegistry: LocationRegistryEntry[] = NL_LOCATION_SCOPE_SLUGS.map((slug) => {
  const pricing = getLocationPricingEstimateBySlug(slug);
  return {
    slug,
    city: pricing?.city ?? inferCityFromSlug(slug),
    province: provinceBySlug.get(slug) ?? null,
    tier: getLocationTier(slug),
    hasScrape: !MISSING_SCRAPE_SLUGS.has(slug),
    requiresFreshBuild: slug === "escort-amsterdam",
    pricing,
    imageCandidates: buildImageCandidates(slug),
  };
});

const locationRegistryMap = new Map(locationRegistry.map((entry) => [entry.slug, entry]));

export function getLocationRegistryEntry(slug: string): LocationRegistryEntry | null {
  return locationRegistryMap.get(slug) ?? null;
}

export const locationRegistryDiagnostics = {
  total: locationRegistry.length,
  scrapeMissing: locationRegistry.filter((entry) => !entry.hasScrape).map((entry) => entry.slug),
  pricingMissing: locationRegistry.filter((entry) => !entry.pricing).map((entry) => entry.slug),
  provinceMissing: locationRegistry.filter((entry) => !entry.province).map((entry) => entry.slug),
};
