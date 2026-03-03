"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabbedContentProps = {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "underline" | "pills" | "boxed";
  className?: string;
};

export function TabbedContent({
  tabs,
  defaultTab,
  variant = "underline",
  className,
}: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          "flex",
          variant === "underline" && "border-b border-white/10 gap-8",
          variant === "pills" && "gap-2 flex-wrap",
          variant === "boxed" && "bg-surface/50 p-1 rounded-lg gap-1"
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "transition-all duration-200",
                variant === "underline" && [
                  "pb-3 text-sm font-medium border-b-2 -mb-px",
                  isActive
                    ? "text-foreground border-primary"
                    : "text-foreground/50 border-transparent hover:text-foreground/70",
                ],
                variant === "pills" && [
                  "px-4 py-2 text-sm font-medium rounded-full",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface/50 text-foreground/60 hover:text-foreground hover:bg-surface",
                ],
                variant === "boxed" && [
                  "px-4 py-2 text-sm font-medium rounded-md flex-1 text-center",
                  isActive
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-foreground/50 hover:text-foreground/70",
                ]
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={activeTab}
        className="pt-6"
      >
        {activeContent}
      </div>
    </div>
  );
}
