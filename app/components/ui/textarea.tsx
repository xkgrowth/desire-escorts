"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = {
  label?: string;
  error?: string;
  hint?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-foreground/80"
          >
            {label}
            {props.required && <span className="text-primary ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg bg-surface border border-border px-4 py-3",
            "text-foreground placeholder:text-foreground/40",
            "transition-all duration-200",
            "hover:border-foreground/20",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "resize-y min-h-[120px]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && (
          <p className="text-sm text-foreground/50">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
