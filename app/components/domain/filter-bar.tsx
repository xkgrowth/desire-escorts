"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Filter, X, ChevronDown, Check } from "lucide-react";

type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

type FilterConfig = {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
};

type FilterBarProps = {
  filters: FilterConfig[];
  basePath?: string;
  className?: string;
  onFilterChange?: (filters: Record<string, string[]>) => void;
};

export function FilterBar({
  filters,
  basePath,
  className,
  onFilterChange,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const getActiveFilters = useCallback(() => {
    const active: Record<string, string[]> = {};
    filters.forEach((filter) => {
      const values = searchParams.getAll(filter.id);
      if (values.length > 0) {
        active[filter.id] = values;
      }
    });
    return active;
  }, [filters, searchParams]);

  const activeFilters = getActiveFilters();
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const updateFilters = useCallback(
    (filterId: string, value: string, isMultiple: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(filterId);

      if (isMultiple) {
        if (currentValues.includes(value)) {
          params.delete(filterId);
          currentValues
            .filter((v) => v !== value)
            .forEach((v) => params.append(filterId, v));
        } else {
          params.append(filterId, value);
        }
      } else {
        params.delete(filterId);
        if (!currentValues.includes(value)) {
          params.set(filterId, value);
        }
      }

      const newPath = basePath
        ? `${basePath}?${params.toString()}`
        : `?${params.toString()}`;

      router.push(newPath, { scroll: false });

      if (onFilterChange) {
        const newFilters: Record<string, string[]> = {};
        filters.forEach((f) => {
          const values = params.getAll(f.id);
          if (values.length > 0) {
            newFilters[f.id] = values;
          }
        });
        onFilterChange(newFilters);
      }

      if (!isMultiple) {
        setOpenFilter(null);
      }
    },
    [basePath, filters, onFilterChange, router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    const newPath = basePath || window.location.pathname;
    router.push(newPath, { scroll: false });
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [basePath, onFilterChange, router]);

  const clearFilter = useCallback(
    (filterId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(filterId);
      const newPath = basePath
        ? `${basePath}?${params.toString()}`
        : `?${params.toString()}`;
      router.push(newPath, { scroll: false });

      if (onFilterChange) {
        const newFilters: Record<string, string[]> = {};
        filters.forEach((f) => {
          if (f.id !== filterId) {
            const values = params.getAll(f.id);
            if (values.length > 0) {
              newFilters[f.id] = values;
            }
          }
        });
        onFilterChange(newFilters);
      }
    },
    [basePath, filters, onFilterChange, router, searchParams]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-foreground/60">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        {filters.map((filter) => {
          const isOpen = openFilter === filter.id;
          const selectedValues = activeFilters[filter.id] || [];
          const hasSelection = selectedValues.length > 0;

          return (
            <div key={filter.id} className="relative">
              <button
                onClick={() => setOpenFilter(isOpen ? null : filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "bg-surface border border-border",
                  "hover:border-foreground/20",
                  hasSelection && "border-primary/30 bg-primary/5",
                  isOpen && "border-primary ring-2 ring-primary/20"
                )}
              >
                <span>{filter.label}</span>
                {hasSelection && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                    {selectedValues.length}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-foreground/40 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpenFilter(null)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-50 min-w-[200px] max-h-[300px] overflow-y-auto rounded-lg bg-surface border border-border shadow-lg">
                    <div className="p-2">
                      {filter.options.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              updateFilters(
                                filter.id,
                                option.value,
                                filter.multiple || false
                              )
                            }
                            className={cn(
                              "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors",
                              "hover:bg-surface-muted",
                              isSelected && "text-primary"
                            )}
                          >
                            <span className="flex-1">{option.label}</span>
                            {option.count !== undefined && (
                              <span className="text-foreground/40 text-xs">
                                {option.count}
                              </span>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-foreground/60"
          >
            <X className="w-4 h-4 mr-1" />
            Wis filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterId, values]) => {
            const filter = filters.find((f) => f.id === filterId);
            if (!filter) return null;

            return values.map((value) => {
              const option = filter.options.find((o) => o.value === value);
              return (
                <span
                  key={`${filterId}-${value}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  <span className="text-foreground/60 text-xs">
                    {filter.label}:
                  </span>
                  <span>{option?.label || value}</span>
                  <button
                    onClick={() =>
                      updateFilters(filterId, value, filter.multiple || false)
                    }
                    className="hover:text-primary-dark transition-colors"
                    aria-label={`Verwijder ${option?.label || value} filter`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            });
          })}
        </div>
      )}
    </div>
  );
}

type FilterBarCompactProps = {
  filters: FilterConfig[];
  basePath?: string;
  className?: string;
};

export function FilterBarCompact({
  filters,
  basePath,
  className,
}: FilterBarCompactProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (filterId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(filterId, value);
    } else {
      params.delete(filterId);
    }
    const newPath = basePath
      ? `${basePath}?${params.toString()}`
      : `?${params.toString()}`;
    router.push(newPath, { scroll: false });
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          <select
            value={searchParams.get(filter.id) || ""}
            onChange={(e) => handleChange(filter.id, e.target.value)}
            className={cn(
              "appearance-none px-4 py-2 pr-8 rounded-lg text-sm font-medium",
              "bg-surface border border-border text-foreground",
              "hover:border-foreground/20 cursor-pointer",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            )}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.count !== undefined && ` (${option.count})`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
