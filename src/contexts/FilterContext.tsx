"use client";

import React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  defaultFilterState,
  hasActiveFilters,
  sanitizeFilterState,
  type FilterArrayKey,
  type FilterState,
} from "@/src/lib/filter-types";
import { toggleArrayValue } from "@/src/lib/filter-utils";

const DEFAULT_STORAGE_KEY = "desire-escorts:overview-filters";

type FilterContextValue = {
  filters: FilterState;
  hydrated: boolean;
  setFilters: (nextState: FilterState) => void;
  clearFilters: () => void;
  setAvailableOnly: (value: boolean) => void;
  setNumberRange: (
    key: "ageMin" | "ageMax" | "heightMin" | "heightMax",
    value?: number
  ) => void;
  setCupRange: (key: "cupSizeMin" | "cupSizeMax", value?: FilterState["cupSizeMin"]) => void;
  toggleValue: (key: FilterArrayKey, value: string) => void;
  hasActiveFilters: boolean;
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
}: PropsWithChildren<{ storageKey?: string }>) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilterState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    try {
      const rawValue = window.localStorage.getItem(storageKey);
      if (!rawValue) return;
      const parsed = JSON.parse(rawValue) as unknown;
      setFiltersState(sanitizeFilterState(parsed));
    } catch {
      setFiltersState(defaultFilterState);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(filters));
  }, [filters, hydrated, storageKey]);

  const setFilters = useCallback((nextState: FilterState) => {
    setFiltersState(sanitizeFilterState(nextState));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilterState);
  }, []);

  const setAvailableOnly = useCallback((value: boolean) => {
    setFiltersState((current) => ({
      ...current,
      availableOnly: value,
    }));
  }, []);

  const setNumberRange = useCallback(
    (key: "ageMin" | "ageMax" | "heightMin" | "heightMax", value?: number) => {
      setFiltersState((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const setCupRange = useCallback((key: "cupSizeMin" | "cupSizeMax", value?: FilterState["cupSizeMin"]) => {
    setFiltersState((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const toggleValue = useCallback((key: FilterArrayKey, value: string) => {
    setFiltersState((current) => toggleArrayValue(current, key, value));
  }, []);

  const contextValue = useMemo<FilterContextValue>(
    () => ({
      filters,
      hydrated,
      setFilters,
      clearFilters,
      setAvailableOnly,
      setNumberRange,
      setCupRange,
      toggleValue,
      hasActiveFilters: hasActiveFilters(filters),
    }),
    [
      clearFilters,
      filters,
      hydrated,
      setAvailableOnly,
      setCupRange,
      setFilters,
      setNumberRange,
      toggleValue,
    ]
  );

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
}

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used inside FilterProvider");
  }
  return context;
}
