import type { Profile } from "@/lib/types/profile";
import { describe, expect, it } from "vitest";
import { defaultFilterState, type FilterState } from "@/src/lib/filter-types";
import { filterProfiles, profileMatchesFilters } from "@/src/lib/filter-utils";

function buildProfile(overrides: Partial<Profile>): Profile {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? "Test Profile",
    slug: overrides.slug ?? `profile-${overrides.id ?? 1}`,
    verified: overrides.verified ?? true,
    featured: overrides.featured ?? false,
    isAvailable: overrides.isAvailable ?? true,
    isHidden: overrides.isHidden ?? false,
    sortOrder: overrides.sortOrder ?? 1,
    photos: overrides.photos ?? [],
    services: overrides.services ?? [],
    languages: overrides.languages ?? [],
    tags: overrides.tags ?? [],
    attributes: overrides.attributes ?? {},
    availability: overrides.availability ?? [],
    age: overrides.age,
    height: overrides.height,
    cupSize: overrides.cupSize,
    postuur: overrides.postuur,
    haarKleur: overrides.haarKleur,
    oogKleur: overrides.oogKleur,
    geaardheid: overrides.geaardheid,
    shortBio: overrides.shortBio,
    bio: overrides.bio,
    contact: overrides.contact,
    seo: overrides.seo,
    documentId: overrides.documentId,
  };
}

describe("profileMatchesFilters", () => {
  const profile = buildProfile({
    id: 10,
    age: 27,
    height: 170,
    cupSize: "C cup",
    postuur: "Normaal",
    haarKleur: "Blond",
    oogKleur: "Blauw",
    geaardheid: "Biseksueel",
    services: ["gfe", "dinner-date"],
    isAvailable: true,
  });

  it("matches default filter state", () => {
    expect(profileMatchesFilters(profile, defaultFilterState)).toBe(true);
  });

  it("filters by availability", () => {
    expect(
      profileMatchesFilters({ ...profile, isAvailable: false }, { ...defaultFilterState, availableOnly: true })
    ).toBe(false);
  });

  it("filters by age range", () => {
    expect(profileMatchesFilters(profile, { ...defaultFilterState, ageMin: 25, ageMax: 29 })).toBe(true);
    expect(profileMatchesFilters(profile, { ...defaultFilterState, ageMin: 30 })).toBe(false);
  });

  it("filters by height range", () => {
    expect(profileMatchesFilters(profile, { ...defaultFilterState, heightMin: 165, heightMax: 172 })).toBe(true);
    expect(profileMatchesFilters(profile, { ...defaultFilterState, heightMax: 165 })).toBe(false);
  });

  it("filters by cup size range", () => {
    expect(
      profileMatchesFilters(profile, {
        ...defaultFilterState,
        cupSizeMin: "B cup",
        cupSizeMax: "D cup",
      })
    ).toBe(true);

    expect(
      profileMatchesFilters(profile, {
        ...defaultFilterState,
        cupSizeMin: "DD cup",
      })
    ).toBe(false);
  });

  it("filters by trait arrays and services", () => {
    const filters: FilterState = {
      ...defaultFilterState,
      buildTypes: ["Normaal"],
      hairColors: ["Blond"],
      eyeColors: ["Blauw"],
      orientations: ["Biseksueel"],
      services: ["dinner-date"],
    };
    expect(profileMatchesFilters(profile, filters)).toBe(true);

    expect(profileMatchesFilters(profile, { ...filters, services: ["travel-companion"] })).toBe(false);
  });
});

describe("filterProfiles", () => {
  it("returns only profiles that match all active filters", () => {
    const profiles = [
      buildProfile({
        id: 1,
        slug: "one",
        age: 24,
        services: ["gfe"],
        postuur: "Slank",
      }),
      buildProfile({
        id: 2,
        slug: "two",
        age: 31,
        services: ["dinner-date"],
        postuur: "Vol",
      }),
      buildProfile({
        id: 3,
        slug: "three",
        age: 29,
        services: ["gfe", "dinner-date"],
        postuur: "Normaal",
      }),
    ];

    const result = filterProfiles(profiles, {
      ...defaultFilterState,
      ageMin: 25,
      services: ["dinner-date"],
    });

    expect(result.map((profile) => profile.id)).toEqual([2, 3]);
  });
});
