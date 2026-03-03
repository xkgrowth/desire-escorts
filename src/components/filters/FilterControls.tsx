"use client";

import { DropdownFilter } from "@/src/components/filters/DropdownFilter";
import { RangeSlider } from "@/src/components/filters/RangeSlider";
import { useFilterData } from "@/src/hooks/useFilterData";
import { CUP_SIZE_ORDER } from "@/src/lib/filter-types";

type FilterControlsProps = {
  data: ReturnType<typeof useFilterData>;
};

export function FilterControls({ data }: FilterControlsProps) {
  const {
    filters,
    options,
    setFilters,
    setNumberRange,
    setCupRange,
    clearFilters,
  } = data;

  const ageMin = filters.ageMin ?? options.ageRange.min;
  const ageMax = filters.ageMax ?? options.ageRange.max;
  const heightMin = filters.heightMin ?? options.heightRange.min;
  const heightMax = filters.heightMax ?? options.heightRange.max;

  const availableCupSizes = options.cupSizes.length > 0
    ? options.cupSizes.map((item) => item.value)
    : CUP_SIZE_ORDER;
  const cupMinBound = 0;
  const cupMaxBound = Math.max(availableCupSizes.length - 1, 0);
  const cupMinIndex = Math.max(0, availableCupSizes.indexOf(filters.cupSizeMin ?? availableCupSizes[0]));
  const cupMaxIndex = Math.max(
    0,
    availableCupSizes.indexOf(
      filters.cupSizeMax ?? availableCupSizes[Math.max(availableCupSizes.length - 1, 0)]
    )
  );

  const setSingleSelect = (
    key: "services" | "buildTypes" | "hairColors" | "eyeColors",
    value: string
  ) => {
    setFilters({
      ...filters,
      [key]: value ? [value] : [],
    });
  };

  return (
    <div className="space-y-6">
      <RangeSlider
        label="Age"
        min={options.ageRange.min}
        max={options.ageRange.max}
        valueMin={ageMin}
        valueMax={ageMax}
        unit=" yrs"
        onChange={(next) => {
          setNumberRange(
            "ageMin",
            next.min === options.ageRange.min ? undefined : next.min
          );
          setNumberRange(
            "ageMax",
            next.max === options.ageRange.max ? undefined : next.max
          );
        }}
      />

      <RangeSlider
        label="Height"
        min={options.heightRange.min}
        max={options.heightRange.max}
        valueMin={heightMin}
        valueMax={heightMax}
        unit=" cm"
        onChange={(next) => {
          setNumberRange(
            "heightMin",
            next.min === options.heightRange.min ? undefined : next.min
          );
          setNumberRange(
            "heightMax",
            next.max === options.heightRange.max ? undefined : next.max
          );
        }}
      />

      <RangeSlider
        label="Cup Size"
        min={cupMinBound}
        max={cupMaxBound}
        valueMin={cupMinIndex}
        valueMax={cupMaxIndex}
        formatValue={(index) => availableCupSizes[index]?.replace(" cup", "") ?? ""}
        onChange={(next) => {
          const minValue = availableCupSizes[next.min];
          const maxValue = availableCupSizes[next.max];
          setCupRange(
            "cupSizeMin",
            next.min === cupMinBound ? undefined : (minValue as (typeof CUP_SIZE_ORDER)[number] | undefined)
          );
          setCupRange(
            "cupSizeMax",
            next.max === cupMaxBound ? undefined : (maxValue as (typeof CUP_SIZE_ORDER)[number] | undefined)
          );
        }}
      />

      <DropdownFilter
        title="Build Type"
        options={options.buildTypes}
        selectedValue={filters.buildTypes[0]}
        onChange={(value) => setSingleSelect("buildTypes", value)}
      />
      <DropdownFilter
        title="Services"
        options={options.services}
        selectedValue={filters.services[0]}
        onChange={(value) => setSingleSelect("services", value)}
      />
      <DropdownFilter
        title="Hair Color"
        options={options.hairColors}
        selectedValue={filters.hairColors[0]}
        onChange={(value) => setSingleSelect("hairColors", value)}
      />
      <DropdownFilter
        title="Eye Color"
        options={options.eyeColors}
        selectedValue={filters.eyeColors[0]}
        onChange={(value) => setSingleSelect("eyeColors", value)}
      />

      <div className="pt-2">
        <div className="mb-6 h-px w-full bg-white/15" />
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-3xl border border-white/20 bg-white/[0.08] px-5 py-4 text-center text-lg font-medium text-foreground/95 transition-colors hover:bg-white/[0.12]"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}
