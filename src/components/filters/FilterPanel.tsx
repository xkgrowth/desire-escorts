"use client";

import { FilterControls } from "@/src/components/filters/FilterControls";
import { useFilterData } from "@/src/hooks/useFilterData";

type FilterPanelProps = {
  data: ReturnType<typeof useFilterData>;
};

export function FilterPanel({ data }: FilterPanelProps) {
  const countLabel = `${data.filteredCount} ${
    data.filteredCount === 1 ? "escort" : "escorts"
  } beschikbaar`;

  return (
    <aside className="hidden h-fit rounded-luxury border border-white/10 bg-surface/30 p-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="mb-4">
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {countLabel}
        </span>
      </div>
      <FilterControls data={data} />
    </aside>
  );
}
