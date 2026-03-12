"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type SidebarDoc = {
  id: number;
  slug: string;
  title: string;
  path: string;
};

type SidebarCategory = {
  id: number;
  slug: string;
  name: string;
  docs: SidebarDoc[];
};

type KnowledgeCategorySidebarProps = {
  categories: SidebarCategory[];
  activeCategorySlug: string;
  activeDocSlug?: string;
};

export function KnowledgeCategorySidebar({
  categories,
  activeCategorySlug,
  activeDocSlug,
}: KnowledgeCategorySidebarProps) {
  const [openCategorySlug, setOpenCategorySlug] = useState<string>(activeCategorySlug);

  function toggleCategory(categorySlug: string) {
    setOpenCategorySlug((previous) => (previous === categorySlug ? "" : categorySlug));
  }

  return (
    <nav aria-label="Kennisbank categorieen">
      <ul className="space-y-2">
        {categories.map((category) => {
          const isActiveCategory = category.slug === activeCategorySlug;
          const isOpen = category.slug === openCategorySlug;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => toggleCategory(category.slug)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isActiveCategory
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                }`}
                aria-expanded={isOpen}
              >
                <span className="text-left">{category.name}</span>
                <span className="ml-3 inline-flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-foreground/60">
                    {category.docs.length}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {isOpen && (
                <ul className="mt-2 space-y-1 border-l border-white/10 pl-3">
                  {category.docs.map((doc) => {
                    const isActiveDoc =
                      category.slug === activeCategorySlug && doc.slug === activeDocSlug;

                    return (
                      <li key={doc.id}>
                        <Link
                          href={doc.path}
                          className={`block rounded-md px-2 py-1.5 text-xs transition-colors ${
                            isActiveDoc
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                          }`}
                        >
                          {doc.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
