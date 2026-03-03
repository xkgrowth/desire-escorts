/**
 * Pure filter utilities for profile filtering.
 * No side effects — can be used in both server and client contexts.
 */

import type { Profile } from "@/lib/types/profile";
import type { FilterState } from "./filter-state";
import { cupSizeIndex } from "./filter-state";

/**
 * Check if a profile matches the given filter state.
 */
export function profileMatchesFilters(
  profile: Profile,
  filters: FilterState
): boolean {
  // Availability filter
  if (filters.availableOnly && !profile.isAvailable) {
    return false;
  }

  // Age range
  if (filters.ageMin !== undefined && profile.age !== undefined) {
    if (profile.age < filters.ageMin) return false;
  }
  if (filters.ageMax !== undefined && profile.age !== undefined) {
    if (profile.age > filters.ageMax) return false;
  }

  // Height range
  if (filters.heightMin !== undefined && profile.height !== undefined) {
    if (profile.height < filters.heightMin) return false;
  }
  if (filters.heightMax !== undefined && profile.height !== undefined) {
    if (profile.height > filters.heightMax) return false;
  }

  // Cup size range
  if (filters.cupSizeMin !== undefined && profile.cupSize !== undefined) {
    const profileIndex = cupSizeIndex(profile.cupSize);
    const minIndex = cupSizeIndex(filters.cupSizeMin);
    if (profileIndex < minIndex) return false;
  }
  if (filters.cupSizeMax !== undefined && profile.cupSize !== undefined) {
    const profileIndex = cupSizeIndex(profile.cupSize);
    const maxIndex = cupSizeIndex(filters.cupSizeMax);
    if (profileIndex > maxIndex) return false;
  }

  // Postuur (body type)
  if (filters.postuur && filters.postuur.length > 0 && profile.postuur) {
    if (!filters.postuur.includes(profile.postuur)) return false;
  }

  // Hair color
  if (filters.haarKleur && filters.haarKleur.length > 0 && profile.haarKleur) {
    if (!filters.haarKleur.includes(profile.haarKleur)) return false;
  }

  // Eye color
  if (filters.oogKleur && filters.oogKleur.length > 0 && profile.oogKleur) {
    if (!filters.oogKleur.includes(profile.oogKleur)) return false;
  }

  // Sexual orientation
  if (filters.geaardheid && filters.geaardheid.length > 0 && profile.geaardheid) {
    if (!filters.geaardheid.includes(profile.geaardheid)) return false;
  }

  // Services (OR match — profile must have at least one selected service)
  if (filters.services && filters.services.length > 0) {
    const hasMatchingService = filters.services.some((service) =>
      profile.services.includes(service)
    );
    if (!hasMatchingService) return false;
  }

  return true;
}

/**
 * Filter profiles by the given filter state.
 */
export function filterProfiles(
  profiles: Profile[],
  filters: FilterState
): Profile[] {
  return profiles.filter((profile) => profileMatchesFilters(profile, filters));
}

/**
 * Derive filter options and counts from available profiles.
 * Returns the unique values and counts for each filterable field.
 */
export function deriveFilterOptions(profiles: Profile[]) {
  const ages = profiles.map((p) => p.age).filter((a): a is number => a !== undefined);
  const heights = profiles.map((p) => p.height).filter((h): h is number => h !== undefined);

  const servicesCounts = new Map<string, number>();
  const postuurCounts = new Map<string, number>();
  const haarKleurCounts = new Map<string, number>();
  const oogKleurCounts = new Map<string, number>();
  const cupSizeCounts = new Map<string, number>();

  for (const profile of profiles) {
    // Services
    for (const service of profile.services) {
      servicesCounts.set(service, (servicesCounts.get(service) || 0) + 1);
    }

    // Postuur
    if (profile.postuur) {
      postuurCounts.set(profile.postuur, (postuurCounts.get(profile.postuur) || 0) + 1);
    }

    // Hair color
    if (profile.haarKleur) {
      haarKleurCounts.set(profile.haarKleur, (haarKleurCounts.get(profile.haarKleur) || 0) + 1);
    }

    // Eye color
    if (profile.oogKleur) {
      oogKleurCounts.set(profile.oogKleur, (oogKleurCounts.get(profile.oogKleur) || 0) + 1);
    }

    // Cup size
    if (profile.cupSize) {
      cupSizeCounts.set(profile.cupSize, (cupSizeCounts.get(profile.cupSize) || 0) + 1);
    }
  }

  return {
    ageRange: {
      min: ages.length > 0 ? Math.min(...ages) : 18,
      max: ages.length > 0 ? Math.max(...ages) : 50,
    },
    heightRange: {
      min: heights.length > 0 ? Math.min(...heights) : 150,
      max: heights.length > 0 ? Math.max(...heights) : 190,
    },
    services: Array.from(servicesCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
    postuur: Array.from(postuurCounts.entries())
      .map(([value, count]) => ({ value, count })),
    haarKleur: Array.from(haarKleurCounts.entries())
      .map(([value, count]) => ({ value, count })),
    oogKleur: Array.from(oogKleurCounts.entries())
      .map(([value, count]) => ({ value, count })),
    cupSize: Array.from(cupSizeCounts.entries())
      .map(([value, count]) => ({ value, count })),
    totalCount: profiles.length,
    availableCount: profiles.filter((p) => p.isAvailable).length,
  };
}

/**
 * Check if any filters are active (non-default).
 */
export function hasActiveFilters(filters: FilterState): boolean {
  if (filters.availableOnly) return true;
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) return true;
  if (filters.heightMin !== undefined || filters.heightMax !== undefined) return true;
  if (filters.cupSizeMin !== undefined || filters.cupSizeMax !== undefined) return true;
  if (filters.postuur && filters.postuur.length > 0) return true;
  if (filters.haarKleur && filters.haarKleur.length > 0) return true;
  if (filters.oogKleur && filters.oogKleur.length > 0) return true;
  if (filters.geaardheid && filters.geaardheid.length > 0) return true;
  if (filters.services && filters.services.length > 0) return true;
  return false;
}
