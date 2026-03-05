"use client";

import { Button } from "@/app/components/ui/button";
import { FilterControls } from "@/src/components/filters/FilterControls";
import { useFilterData } from "@/src/hooks/useFilterData";

type FilterPanelProps = {
  data: ReturnType<typeof useFilterData>;
};

export function FilterPanel({ data }: FilterPanelProps) {
  return (
    <aside className="hidden h-fit rounded-luxury border border-white/10 bg-surface/30 p-4 lg:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/75">
          Verfijn je zoekopdracht
        </h2>
        {data.hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={data.clearFilters}>
            Wissen
          </Button>
        )}
      </div>
      <FilterControls data={data} />
    </aside>
  );
}
