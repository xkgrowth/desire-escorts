"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  label?: string | React.ReactNode;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-start gap-3 cursor-pointer group",
            props.disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "w-5 h-5 rounded border-2 border-border bg-surface",
                "transition-all duration-200",
                "group-hover:border-foreground/30",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30",
                "peer-checked:bg-primary peer-checked:border-primary",
                error && "border-red-500",
                className
              )}
            />
            <Check
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 text-primary-foreground",
                "opacity-0 scale-50 transition-all duration-200",
                "peer-checked:opacity-100 peer-checked:scale-100"
              )}
              strokeWidth={3}
            />
          </div>
          {label && (
            <span className="text-sm text-foreground/80 select-none">
              {label}
            </span>
          )}
        </label>
        {error && <p className="text-sm text-red-500 ml-8">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
