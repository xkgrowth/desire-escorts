import { locationRegistry, type LocationRegistryEntry } from "./location-registry";

export type LocationBatchId =
  | "batch1-amsterdam-family"
  | "batch2-tier1-core"
  | "batch3-tier2-expansion"
  | "batch4-tier3-high-volume"
  | "batch5-tier3-medium-volume"
  | "batch6-tier3-remaining";

export type LocationBatch = {
  id: LocationBatchId;
  label: string;
  slugs: string[];
};

const BATCH_1_SLUGS = [
  "escort-amsterdam",
  "escort-amsterdam-centrum",
  "escort-amsterdam-noord",
  "escort-amsterdam-oost",
  "escort-amsterdam-west",
  "escort-amsterdam-zuid",
];

const BATCH_2_SLUGS = [
  "escort-rotterdam",
  "escort-den-haag",
  "escort-utrecht",
  "escort-eindhoven",
  "escort-groningen",
];

const BATCH_3_SLUGS = [
  "escort-breda",
  "escort-tilburg",
  "escort-almere",
  "escort-arnhem",
  "escort-haarlem",
  "escort-amstelveen",
  "escort-leiden",
  "escort-delft",
  "escort-zaandam",
  "escort-hilversum",
  "escort-hoofddorp",
  "escort-schiphol",
  "escort-scheveningen",
  "escort-gouda",
  "escort-amersfoort",
];

const reservedSlugs = new Set([...BATCH_1_SLUGS, ...BATCH_2_SLUGS, ...BATCH_3_SLUGS]);

const remainingTier3 = locationRegistry
  .filter((entry) => entry.tier === 3 && !reservedSlugs.has(entry.slug))
  .map((entry) => entry.slug)
  .sort((a, b) => a.localeCompare(b));

const BATCH_4_SIZE = 30;
const BATCH_5_SIZE = 50;

const BATCH_4_SLUGS = remainingTier3.slice(0, BATCH_4_SIZE);
const BATCH_5_SLUGS = remainingTier3.slice(BATCH_4_SIZE, BATCH_4_SIZE + BATCH_5_SIZE);
const BATCH_6_SLUGS = remainingTier3.slice(BATCH_4_SIZE + BATCH_5_SIZE);

export const locationBatches: LocationBatch[] = [
  {
    id: "batch1-amsterdam-family",
    label: "Batch 1 - Amsterdam city + districts",
    slugs: BATCH_1_SLUGS,
  },
  {
    id: "batch2-tier1-core",
    label: "Batch 2 - Core Tier 1 city pages",
    slugs: BATCH_2_SLUGS,
  },
  {
    id: "batch3-tier2-expansion",
    label: "Batch 3 - Tier 2 expansion",
    slugs: BATCH_3_SLUGS,
  },
  {
    id: "batch4-tier3-high-volume",
    label: "Batch 4 - Tier 3 high-volume set",
    slugs: BATCH_4_SLUGS,
  },
  {
    id: "batch5-tier3-medium-volume",
    label: "Batch 5 - Tier 3 medium-volume set",
    slugs: BATCH_5_SLUGS,
  },
  {
    id: "batch6-tier3-remaining",
    label: "Batch 6 - Tier 3 remaining set",
    slugs: BATCH_6_SLUGS,
  },
];

const locationBatchMap = new Map(locationBatches.map((batch) => [batch.id, batch]));

export function getLocationBatch(id: LocationBatchId): LocationBatch | null {
  return locationBatchMap.get(id) ?? null;
}

export function getLocationEntriesForBatch(id: LocationBatchId): LocationRegistryEntry[] {
  const batch = getLocationBatch(id);
  if (!batch) return [];
  const set = new Set(batch.slugs);
  return locationRegistry.filter((entry) => set.has(entry.slug));
}

export const locationBatchDiagnostics = {
  totalScoped: locationRegistry.length,
  totalAssigned: locationBatches.reduce((acc, batch) => acc + batch.slugs.length, 0),
  byBatch: locationBatches.map((batch) => ({
    id: batch.id,
    count: batch.slugs.length,
  })),
};
