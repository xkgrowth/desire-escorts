"use client";

import { FilterControls } from "@/src/components/filters/FilterControls";
import { useFilterData } from "@/src/hooks/useFilterData";

type FilterPanelProps = {
  data: ReturnType<typeof useFilterData>;
};

export function FilterPanel({ data }: FilterPanelProps) {
  const countLabel = `${data.filteredCount} ${
    data.filteredCount === 1 ? "escort" : "escorts"
  } nu beschikbaar`;

  return (
    <aside className="hidden h-fit rounded-luxury border border-white/10 bg-surface/30 p-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="mb-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-surface/85 px-4 py-2 text-xs text-foreground/80">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          {countLabel}
        </span>
      </div>
      <FilterControls data={data} />
    </aside>
  );
}
