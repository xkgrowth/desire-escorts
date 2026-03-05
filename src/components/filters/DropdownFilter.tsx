"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { FilterOption } from "@/src/lib/filter-types";

type DropdownFilterProps = {
  title: string;
  options: FilterOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
};

export function DropdownFilter({ title, options, selectedValue, onChange }: DropdownFilterProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) {
        return;
      }

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedLabel = selectedOption
    ? `${selectedOption.label} (${selectedOption.count})`
    : "Alle";

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-foreground/85">{title}</p>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-sm text-foreground outline-none transition-all duration-200 hover:border-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-foreground/60 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
            <div className="max-h-56 overflow-y-auto py-1">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/10"
                role="option"
                aria-selected={!selectedValue}
              >
                <span>Alle</span>
                {!selectedValue && <Check className="h-4 w-4 text-primary" />}
              </button>

              {options.map((option) => {
                const isSelected = option.value === selectedValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/10"
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="truncate">
                      {option.label} ({option.count})
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
