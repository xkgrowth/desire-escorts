/**
 * Profile filtering utilities for service/type detail pages.
 * 
 * Filters profiles based on page slug, with fallback to top profiles
 * when no matches exist or filtering isn't possible.
 */

import type { Profile } from "@/lib/types/profile";

type FilterResult = {
  profiles: Profile[];
  hasMatches: boolean;
  filterApplied: boolean;
};

type FilterConfig = {
  type: "service" | "hairColor" | "age" | "height" | "postuur" | "none";
  field?: string;
  value?: string | string[];
  minValue?: number;
  maxValue?: number;
};

/**
 * Mapping from page slugs to filter configurations.
 * 
 * Service pages: filter by profile.services array
 * Type pages: filter by profile attributes where data exists
 * Ethnicity pages: no filter (data not available), always fallback
 */
const SLUG_FILTER_MAP: Record<string, FilterConfig> = {
  // === SERVICE PAGES (filter by services array) ===
  // Page slug -> Strapi service slug mapping
  "bdsm-escorts": { type: "service", value: "bdsm" },
  "dinnerdate-escort": { type: "service", value: "dinner-date" },
  "erotische-massage": { type: "service", value: "erotic-massage" },
  "orale-seks": { type: "service", value: "oral-sex" },
  "overnight-escort": { type: "service", value: "overnight" },
  "rollenspel-escort": { type: "service", value: "sm-role-play" },
  "sm-escort": { type: "service", value: "sm-role-play" },
  "trio-escorts": { type: "service", value: ["threesome-with-man", "threesome-with-couple"] },
  "escort-voor-stellen": { type: "service", value: "threesome-with-couple" },
  "uitgaan-escort": { type: "service", value: "going-out" },
  // Services not in Strapi yet - keep for future or use none
  "anale-seks": { type: "service", value: "anale-seks" },
  "hotel-escort": { type: "service", value: "hotel-escort" },
  "24-uurs-escort": { type: "service", value: "24-uurs-escort" },
  "body-2-body-massage": { type: "service", value: "body-2-body-massage" },
  "bondage-escort": { type: "service", value: "bondage-escort" },
  "business-escort": { type: "service", value: "business-escort" },
  "cardate-escort": { type: "service", value: "cardate-escort" },
  "fetish-escort": { type: "service", value: "fetish-escort" },
  "first-time-experience": { type: "service", value: "first-time-experience" },
  "gfe-escorts": { type: "service", value: "gfe-escorts" },
  "nuru-massage": { type: "service", value: "nuru-massage" },
  "tantra-escort": { type: "service", value: "tantra-escort" },
  "voetfetish-escort": { type: "service", value: "voetfetish-escort" },
  "vrijgezellenfeest-escort": { type: "service", value: "vrijgezellenfeest-escort" },

  // === TYPE PAGES WITH FILTERABLE ATTRIBUTES ===
  "blonde-escort-dames": { type: "hairColor", value: "Blond" },
  "brunette-escort-dames": { type: "hairColor", value: ["Bruin", "Donkerblond"] },
  "mature-escort": { type: "age", minValue: 35 },
  "jonge-escort": { type: "age", minValue: 21, maxValue: 25 },
  "studenten-escort": { type: "age", minValue: 21, maxValue: 27 },
  "petite-escort": { type: "height", maxValue: 165 },

  // === TYPE PAGES WITHOUT FILTERABLE DATA (always fallback) ===
  "aziatische-escorts": { type: "none" },
  "europese-escort": { type: "none" },
  "gay-escort": { type: "none" },
  "goedkope-escorts": { type: "none" },
  "high-class-escort": { type: "none" },
  "japanse-escort": { type: "none" },
  "latina-escorts": { type: "none" },
  "marokkaanse-escort": { type: "none" },
  "nederlandse-escort": { type: "none" },
  "poolse-escort": { type: "none" },
  "roemeense-escort": { type: "none" },
  "shemale-escort": { type: "none" },
  "striptease-escort": { type: "none" },
  "turkse-escort": { type: "none" },
  "zwarte-escort": { type: "none" },
};

/**
 * Normalize string for fuzzy service matching.
 * Handles variations like "erotische-massage" vs "Erotische Massage" vs "erotischemassage"
 */
function normalizeServiceSlug(slug: string): string {
  return slug.toLowerCase().replace(/[-_\s]/g, "");
}

/**
 * Apply filter to profiles based on configuration.
 */
function applyFilter(profiles: Profile[], config: FilterConfig): Profile[] {
  switch (config.type) {
    case "service": {
      // Support both single service slug and array of slugs
      const serviceSlugs = Array.isArray(config.value) ? config.value : [config.value as string];
      const normalizedTargets = serviceSlugs.map(normalizeServiceSlug);
      
      return profiles.filter((p) =>
        p.services.some((s) =>
          serviceSlugs.some((slug, idx) =>
            s === slug ||
            normalizeServiceSlug(s) === normalizedTargets[idx] ||
            s.toLowerCase().includes(normalizedTargets[idx]) ||
            normalizedTargets[idx].includes(normalizeServiceSlug(s))
          )
        )
      );
    }

    case "hairColor": {
      const colors = Array.isArray(config.value) ? config.value : [config.value];
      return profiles.filter((p) => p.haarKleur && colors.includes(p.haarKleur));
    }

    case "age": {
      return profiles.filter((p) => {
        if (!p.age) return false;
        if (config.minValue && p.age < config.minValue) return false;
        if (config.maxValue && p.age > config.maxValue) return false;
        return true;
      });
    }

    case "height": {
      return profiles.filter((p) => {
        if (!p.height) return false;
        if (config.minValue && p.height < config.minValue) return false;
        if (config.maxValue && p.height > config.maxValue) return false;
        return true;
      });
    }

    case "postuur": {
      const postuurValue = config.value as string;
      return profiles.filter((p) => p.postuur === postuurValue);
    }

    case "none":
    default:
      return [];
  }
}

/**
 * Get filtered profiles for a service/type detail page.
 * 
 * @param allProfiles - All available profiles from Strapi
 * @param pageSlug - The page slug to filter for
 * @param minMatches - Minimum matches required before using fallback (default: 2)
 * @returns FilterResult with profiles, hasMatches flag, and filterApplied flag
 */
export function getFilteredProfiles(
  allProfiles: Profile[],
  pageSlug: string,
  minMatches: number = 2
): FilterResult {
  const config = SLUG_FILTER_MAP[pageSlug];

  // No filter config for this slug - use fallback
  if (!config || config.type === "none") {
    return {
      profiles: allProfiles,
      hasMatches: false,
      filterApplied: false,
    };
  }

  const filtered = applyFilter(allProfiles, config);

  // Use filtered profiles if we have enough matches for a meaningful display,
  // but always report hasMatches=true if there's at least one match (for title)
  const hasAnyMatches = filtered.length > 0;
  const useFilteredProfiles = filtered.length >= minMatches;

  return {
    profiles: useFilteredProfiles ? filtered : allProfiles,
    hasMatches: hasAnyMatches,
    filterApplied: true,
  };
}

/**
 * Get the appropriate section title based on filter results.
 */
export function getProfileSectionTitle(
  hasMatches: boolean,
  pageTitle: string,
  pageType: "service" | "type",
  locale: "nl" | "en" = "nl"
): string {
  if (hasMatches) {
    if (locale === "nl") {
      return pageType === "service"
        ? `Escorts voor ${pageTitle}`
        : `${pageTitle} Profielen`;
    }
    return pageType === "service"
      ? `Escorts for ${pageTitle}`
      : `${pageTitle} Profiles`;
  }

  // Fallback title
  return locale === "nl" ? "Beschikbare Escorts" : "Available Escorts";
}

/**
 * Check if a slug has a filter configured (even if it results in no matches).
 */
export function hasFilterConfig(pageSlug: string): boolean {
  const config = SLUG_FILTER_MAP[pageSlug];
  return !!config && config.type !== "none";
}
