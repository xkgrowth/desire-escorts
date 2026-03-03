import type { Profile } from "@/lib/types/profile";
import {
  cupSizeIndex,
  defaultFilterState,
  type FilterArrayKey,
  type FilterFacet,
  type FilterState,
} from "./filter-types";

function matchesNumberRange(
  value: number | undefined,
  min: number | undefined,
  max: number | undefined
): boolean {
  if (min === undefined && max === undefined) return true;
  if (value === undefined) return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

function matchesCupRange(profile: Profile, filters: FilterState): boolean {
  if (filters.cupSizeMin === undefined && filters.cupSizeMax === undefined) {
    return true;
  }

  const profileCupIndex = cupSizeIndex(profile.cupSize);
  if (profileCupIndex === -1) return false;

  if (filters.cupSizeMin !== undefined) {
    const minIndex = cupSizeIndex(filters.cupSizeMin);
    if (profileCupIndex < minIndex) return false;
  }

  if (filters.cupSizeMax !== undefined) {
    const maxIndex = cupSizeIndex(filters.cupSizeMax);
    if (profileCupIndex > maxIndex) return false;
  }

  return true;
}

function matchesMultiSelect<T extends string>(
  activeValues: T[],
  profileValue: T | undefined
): boolean {
  if (activeValues.length === 0) return true;
  if (!profileValue) return false;
  return activeValues.includes(profileValue);
}

export function profileMatchesFilters(profile: Profile, filters: FilterState): boolean {
  if (filters.availableOnly && !profile.isAvailable) {
    return false;
  }

  if (!matchesNumberRange(profile.age, filters.ageMin, filters.ageMax)) {
    return false;
  }

  if (!matchesNumberRange(profile.height, filters.heightMin, filters.heightMax)) {
    return false;
  }

  if (!matchesCupRange(profile, filters)) {
    return false;
  }

  if (!matchesMultiSelect(filters.buildTypes, profile.postuur)) {
    return false;
  }

  if (!matchesMultiSelect(filters.hairColors, profile.haarKleur)) {
    return false;
  }

  if (!matchesMultiSelect(filters.eyeColors, profile.oogKleur)) {
    return false;
  }

  if (!matchesMultiSelect(filters.orientations, profile.geaardheid)) {
    return false;
  }

  if (filters.services.length > 0) {
    const hasService = filters.services.some((service) => profile.services.includes(service));
    if (!hasService) return false;
  }

  return true;
}

export function filterProfiles(profiles: Profile[], filters: FilterState): Profile[] {
  return profiles.filter((profile) => profileMatchesFilters(profile, filters));
}

export function omitFacet(filters: FilterState, facet: FilterFacet): FilterState {
  const next: FilterState = {
    ...filters,
    services: [...filters.services],
    buildTypes: [...filters.buildTypes],
    hairColors: [...filters.hairColors],
    eyeColors: [...filters.eyeColors],
    orientations: [...filters.orientations],
  };

  if (facet === "availableOnly") {
    next.availableOnly = defaultFilterState.availableOnly;
    return next;
  }

  if (facet === "age") {
    next.ageMin = undefined;
    next.ageMax = undefined;
    return next;
  }

  if (facet === "height") {
    next.heightMin = undefined;
    next.heightMax = undefined;
    return next;
  }

  if (facet === "cupSize") {
    next.cupSizeMin = undefined;
    next.cupSizeMax = undefined;
    return next;
  }

  next[facet] = [];
  return next;
}

export function toggleArrayValue(
  filters: FilterState,
  key: FilterArrayKey,
  value: string
): FilterState {
  const current = filters[key] as string[];
  const alreadySelected = current.includes(value);
  const nextValues = alreadySelected
    ? current.filter((item) => item !== value)
    : [...current, value];

  return {
    ...filters,
    [key]: nextValues,
  };
}
