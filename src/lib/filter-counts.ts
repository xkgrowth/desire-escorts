import type {
  Geaardheid,
  HaarKleur,
  OogKleur,
  Postuur,
  Profile,
} from "@/lib/types/profile";
import {
  BUILD_TYPE_ORDER,
  CUP_SIZE_ORDER,
  EYE_COLOR_ORDER,
  HAIR_COLOR_ORDER,
  ORIENTATION_ORDER,
  profileRangeBounds,
  type FilterOption,
  type FilterOptionSet,
  type FilterState,
} from "./filter-types";
import { filterProfiles, omitFacet } from "./filter-utils";

function prettifyServiceLabel(value: string): string {
  return value
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function toOptions<T extends string>(
  order: readonly T[],
  counts: Map<T, number>
): FilterOption[] {
  return order
    .filter((value) => counts.has(value))
    .map((value) => ({
      value,
      label: value,
      count: counts.get(value) || 0,
    }));
}

function countValues<T extends string>(profiles: Profile[], getter: (profile: Profile) => T | undefined) {
  const counts = new Map<T, number>();

  for (const profile of profiles) {
    const value = getter(profile);
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return counts;
}

function countServices(profiles: Profile[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const profile of profiles) {
    for (const service of profile.services) {
      counts.set(service, (counts.get(service) || 0) + 1);
    }
  }

  return counts;
}

function serviceOptionsFromCounts(counts: Map<string, number>): FilterOption[] {
  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: prettifyServiceLabel(value),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function withSelectedFallback(
  options: FilterOption[],
  selectedValues: string[]
): FilterOption[] {
  if (selectedValues.length === 0) return options;

  const optionMap = new Map(options.map((option) => [option.value, option]));
  for (const selectedValue of selectedValues) {
    if (optionMap.has(selectedValue)) continue;
    optionMap.set(selectedValue, {
      value: selectedValue,
      label: prettifyServiceLabel(selectedValue),
      count: 0,
    });
  }

  return Array.from(optionMap.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function deriveFilterOptions(profiles: Profile[]): FilterOptionSet {
  const serviceCounts = countServices(profiles);
  const buildTypeCounts = countValues<Postuur>(profiles, (profile) => profile.postuur);
  const hairColorCounts = countValues<HaarKleur>(profiles, (profile) => profile.haarKleur);
  const eyeColorCounts = countValues<OogKleur>(profiles, (profile) => profile.oogKleur);
  const orientationCounts = countValues<Geaardheid>(profiles, (profile) => profile.geaardheid);
  const cupSizeCounts = countValues(profiles, (profile) => profile.cupSize);

  return {
    services: serviceOptionsFromCounts(serviceCounts),
    buildTypes: toOptions(BUILD_TYPE_ORDER, buildTypeCounts),
    hairColors: toOptions(HAIR_COLOR_ORDER, hairColorCounts),
    eyeColors: toOptions(EYE_COLOR_ORDER, eyeColorCounts),
    orientations: toOptions(ORIENTATION_ORDER, orientationCounts),
    cupSizes: toOptions(CUP_SIZE_ORDER, cupSizeCounts),
    ageRange: profileRangeBounds(profiles, "age", { min: 18, max: 50 }),
    heightRange: profileRangeBounds(profiles, "height", { min: 150, max: 190 }),
    totalCount: profiles.length,
    availableCount: profiles.filter((profile) => profile.isAvailable).length,
  };
}

export function deriveDynamicFilterOptions(
  profiles: Profile[],
  filters: FilterState,
  baseOptions?: FilterOptionSet
): FilterOptionSet {
  const fallback = baseOptions || deriveFilterOptions(profiles);

  const servicesPool = filterProfiles(profiles, omitFacet(filters, "services"));
  const buildTypePool = filterProfiles(profiles, omitFacet(filters, "buildTypes"));
  const hairPool = filterProfiles(profiles, omitFacet(filters, "hairColors"));
  const eyePool = filterProfiles(profiles, omitFacet(filters, "eyeColors"));
  const orientationPool = filterProfiles(profiles, omitFacet(filters, "orientations"));
  const cupSizePool = filterProfiles(profiles, omitFacet(filters, "cupSize"));
  const fullResultSet = filterProfiles(profiles, filters);

  const serviceOptions = withSelectedFallback(
    serviceOptionsFromCounts(countServices(servicesPool)),
    filters.services
  );
  const buildTypes = toOptions(BUILD_TYPE_ORDER, countValues(buildTypePool, (profile) => profile.postuur));
  const hairColors = toOptions(HAIR_COLOR_ORDER, countValues(hairPool, (profile) => profile.haarKleur));
  const eyeColors = toOptions(EYE_COLOR_ORDER, countValues(eyePool, (profile) => profile.oogKleur));
  const orientations = toOptions(
    ORIENTATION_ORDER,
    countValues(orientationPool, (profile) => profile.geaardheid)
  );
  const cupSizes = toOptions(CUP_SIZE_ORDER, countValues(cupSizePool, (profile) => profile.cupSize));

  return {
    ...fallback,
    services: serviceOptions,
    buildTypes,
    hairColors,
    eyeColors,
    orientations,
    cupSizes,
    totalCount: fallback.totalCount,
    availableCount: fullResultSet.filter((profile) => profile.isAvailable).length,
  };
}
