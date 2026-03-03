"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { GradientTitle } from "../ui/gradient-title";

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
};

type FAQProps = {
  eyebrow?: string;
  title?: string;
  items: FAQItem[];
  variant?: "default" | "cards";
  className?: string;
};

export function FAQ({
  eyebrow,
  title,
  items,
  variant = "default",
  className,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={className}>
      {/* Header */}
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

      {/* FAQ Items */}
      <div
        className={cn(
          "space-y-3",
          variant === "cards" && "space-y-4"
        )}
      >
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "overflow-hidden transition-all duration-300",
                variant === "default" && "border-b border-white/10",
                variant === "cards" &&
                  "rounded-luxury bg-surface/50 border border-white/5"
              )}
            >
              <button
                onClick={() => toggleItem(index)}
                className={cn(
                  "w-full flex items-center justify-between gap-4 text-left transition-colors",
                  variant === "default" && "py-5",
                  variant === "cards" && "p-5",
                  isOpen ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                )}
                aria-expanded={isOpen}
              >
                <span className="font-heading font-bold text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 text-primary transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "text-foreground/70 leading-relaxed",
                      variant === "default" && "pb-5",
                      variant === "cards" && "px-5 pb-5"
                    )}
                  >
                    {typeof item.answer === "string" ? (
                      <p>{item.answer}</p>
                    ) : (
                      item.answer
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
