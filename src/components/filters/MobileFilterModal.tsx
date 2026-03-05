"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { FilterControls } from "@/src/components/filters/FilterControls";
import { useFilterData } from "@/src/hooks/useFilterData";

type MobileFilterModalProps = {
  data: ReturnType<typeof useFilterData>;
};

export function MobileFilterModal({ data }: MobileFilterModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Open filteropties"
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filter
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Sluit filters"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Verfijn je zoekopdracht</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterControls data={data} />

            <div className="sticky bottom-0 mt-4 grid grid-cols-2 gap-2 border-t border-white/10 bg-background pt-4">
              <Button variant="ghost" onClick={data.clearFilters}>
                Wissen
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Toon {data.filteredCount}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
