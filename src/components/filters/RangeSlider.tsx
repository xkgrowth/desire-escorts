"use client";

import { cn } from "@/lib/utils";

type RangeSliderProps = {
  label: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  onChange: (next: { min: number; max: number }) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function RangeSlider({
  label,
  min,
  max,
  valueMin,
  valueMax,
  step = 1,
  unit = "",
  formatValue,
  onChange,
}: RangeSliderProps) {
  const activeMin = clamp(valueMin, min, max);
  const activeMax = clamp(valueMax, min, max);
  const safeMin = Math.min(activeMin, activeMax);
  const safeMax = Math.max(activeMin, activeMax);

  const span = Math.max(max - min, 1);
  const startPct = ((safeMin - min) / span) * 100;
  const endPct = ((safeMax - min) / span) * 100;

  const renderValue = (value: number) => (formatValue ? formatValue(value) : `${value}${unit}`);

  return (
    <div className="space-y-2">
      <p className="text-xl font-medium text-foreground">{label}</p>
      <div className="relative h-9">
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/20" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/70"
          style={{
            left: `${startPct}%`,
            right: `${100 - endPct}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMin}
          onChange={(event) => {
            const nextMin = Math.min(Number(event.target.value), safeMax);
            onChange({ min: nextMin, max: safeMax });
          }}
          className={cn(
            "pointer-events-auto absolute inset-0 w-full appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/40 [&::-webkit-slider-thumb]:bg-white/90",
            "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/40 [&::-moz-range-thumb]:bg-white/90"
          )}
          aria-label={`${label} minimum`}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMax}
          onChange={(event) => {
            const nextMax = Math.max(Number(event.target.value), safeMin);
            onChange({ min: safeMin, max: nextMax });
          }}
          className={cn(
            "pointer-events-auto absolute inset-0 w-full appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/40 [&::-webkit-slider-thumb]:bg-white/90",
            "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/40 [&::-moz-range-thumb]:bg-white/90"
          )}
          aria-label={`${label} maximum`}
        />
      </div>
      <div className="flex items-center justify-between text-[22px] text-foreground/85">
        <span>{renderValue(safeMin)}</span>
        <span>{renderValue(safeMax)}</span>
      </div>
    </div>
  );
}
