"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/data/faqs";

type FaqAccordionProps = {
  faqs: FaqItem[];
};

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleItem(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="divide-y divide-white/10">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="py-3 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="flex w-full items-start justify-between gap-3 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-foreground/90">{faq.question}</span>
              <ChevronDown
                className={`mt-0.5 h-4 w-4 shrink-0 text-foreground/50 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-foreground/65">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
