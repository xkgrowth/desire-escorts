"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { GradientTitle } from "../ui/gradient-title";

type Step = {
  title: string;
  description: string | React.ReactNode;
  icon?: React.ReactNode;
};

type HowToStepsProps = {
  eyebrow?: string;
  title?: string;
  steps: Step[];
  variant?: "accordion" | "numbered" | "timeline";
  className?: string;
};

export function HowToSteps({
  eyebrow,
  title,
  steps,
  variant = "accordion",
  className,
}: HowToStepsProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleStep = (index: number) => {
    setOpenIndex(index);
  };

  if (variant === "numbered") {
    const gridCols = steps.length === 4 
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
      : steps.length === 3 
        ? "grid-cols-1 md:grid-cols-3" 
        : "grid-cols-1 sm:grid-cols-2";
    
    return (
      <div className={className}>
        {(eyebrow || title) && (
          <div className="text-center mb-10">
            {eyebrow && (
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
                {eyebrow}
              </span>
            )}
            {title && (
              <GradientTitle as="h2" size="lg">
                {title}
              </GradientTitle>
            )}
          </div>
        )}
        <div className={cn("grid gap-6", gridCols)}>
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-foreground/60 text-sm">
                {typeof step.description === "string"
                  ? step.description
                  : step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className={className}>
        {(eyebrow || title) && (
          <div className="mb-10">
            {eyebrow && (
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
                {eyebrow}
              </span>
            )}
            {title && (
              <GradientTitle as="h2" size="lg">
                {title}
              </GradientTitle>
            )}
          </div>
        )}
        <div className="relative pl-8 space-y-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Dot */}
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-primary bg-background shadow-[0_0_0_2px_rgba(0,0,0,0.35)] flex items-center justify-center">
                {step.icon || (
                  <span className="text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <div className="text-foreground/60">
                {typeof step.description === "string" ? (
                  <p>{step.description}</p>
                ) : (
                  step.description
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Accordion variant (default)
  return (
    <div className={className}>
      {(eyebrow || title) && (
        <div className="mb-10">
          {eyebrow && (
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              {eyebrow}
            </span>
          )}
          {title && (
            <GradientTitle as="h2" size="lg">
              {title}
            </GradientTitle>
          )}
        </div>
      )}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isOpen = openIndex === index;
          const isCompleted = index < openIndex;

          return (
            <div
              key={index}
              className={cn(
                "rounded-luxury overflow-hidden transition-all duration-300",
                isOpen
                  ? "bg-surface/80 border border-primary/30"
                  : "bg-surface/50 border border-white/5"
              )}
            >
              <button
                onClick={() => toggleStep(index)}
                className="w-full flex items-center gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                {/* Step Number / Check */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    isOpen
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-surface-muted text-foreground/40"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Title */}
                <span
                  className={cn(
                    "flex-1 font-heading font-bold transition-colors",
                    isOpen ? "text-foreground" : "text-foreground/70"
                  )}
                >
                  {step.title}
                </span>

                {/* Chevron */}
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 text-foreground/40 transition-transform duration-300",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>

              {/* Content */}
              <div
                className={cn(
                  "grid transition-all duration-300",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pl-[4.5rem] text-foreground/70 leading-relaxed">
                    {typeof step.description === "string" ? (
                      <p>{step.description}</p>
                    ) : (
                      step.description
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
