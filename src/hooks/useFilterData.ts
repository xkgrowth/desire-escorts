"use client";

import { useMemo } from "react";
import type { Profile } from "@/lib/types/profile";
import { useFilterContext } from "@/src/contexts/FilterContext";
import { deriveDynamicFilterOptions, deriveFilterOptions } from "@/src/lib/filter-counts";
import { defaultFilterState } from "@/src/lib/filter-types";
import { filterProfiles } from "@/src/lib/filter-utils";

export function useFilterData(profiles: Profile[]) {
  const context = useFilterContext();
  const { hydrated, filters } = context;
  const activeFilters = hydrated ? filters : defaultFilterState;

  const baseOptions = useMemo(() => deriveFilterOptions(profiles), [profiles]);
  const options = useMemo(
    () => deriveDynamicFilterOptions(profiles, activeFilters, baseOptions),
    [activeFilters, baseOptions, profiles]
  );
  const filteredProfiles = useMemo(
    () => filterProfiles(profiles, activeFilters),
    [profiles, activeFilters]
  );

  return {
    ...context,
    filters: activeFilters,
    options,
    filteredProfiles,
    totalCount: profiles.length,
    filteredCount: filteredProfiles.length,
  };
}
