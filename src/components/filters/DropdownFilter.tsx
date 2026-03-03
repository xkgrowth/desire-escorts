"use client";

import { ChevronDown } from "lucide-react";
import type { FilterOption } from "@/src/lib/filter-types";

type DropdownFilterProps = {
  title: string;
  options: FilterOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
};

export function DropdownFilter({ title, options, selectedValue, onChange }: DropdownFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-medium text-foreground">{title}</p>
      <div className="relative">
        <select
          value={selectedValue ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-3xl border border-white/15 bg-white/[0.08] px-5 py-4 pr-12 text-lg text-foreground/95 outline-none transition-colors focus:border-white/35"
        >
          <option value="">All</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.count})
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/70"
        />
      </div>
    </div>
  );
}
