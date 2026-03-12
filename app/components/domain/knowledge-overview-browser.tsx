"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";

type KnowledgeOverviewDoc = {
  id: number;
  title: string;
  path: string;
};

type KnowledgeOverviewCategory = {
  id: number;
  slug: string;
  name: string;
  docs: KnowledgeOverviewDoc[];
};

type KnowledgeOverviewBrowserProps = {
  categories: KnowledgeOverviewCategory[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function KnowledgeOverviewBrowser({
  categories,
  eyebrow,
  title,
  description,
}: KnowledgeOverviewBrowserProps) {
  const [query, setQuery] = useState("");
  const [expandedByCategory, setExpandedByCategory] = useState<Record<number, boolean>>({});

  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => {
        const filteredDocs = hasQuery
          ? category.docs.filter((doc) => doc.title.toLowerCase().includes(normalizedQuery))
          : category.docs;

        return {
          ...category,
          docs: filteredDocs,
        };
      })
      .filter((category) => category.docs.length > 0);
  }, [categories, hasQuery, normalizedQuery]);

  function toggleExpanded(categoryId: number) {
    setExpandedByCategory((previous) => ({
      ...previous,
      [categoryId]: !previous[categoryId],
    }));
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {(eyebrow || title || description) && (
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <BookOpen className="h-4 w-4" />
                {eyebrow}
              </span>
            )}
            {title && <h1 className="mb-2 text-3xl font-heading font-bold text-foreground md:text-4xl">{title}</h1>}
            {description && <p className="text-foreground/70">{description}</p>}
          </div>
        )}

        <label className="relative w-full max-w-sm shrink-0">
          <span className="sr-only">Zoek in kennisbank artikelen</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zoek in artikelen..."
            className="w-full rounded-luxury border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition-colors focus:border-primary/45"
          />
        </label>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-luxury border border-white/10 bg-surface/35 p-5 text-sm text-foreground/65">
          Geen artikelen gevonden voor deze zoekterm.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => {
            const isExpanded = expandedByCategory[category.id] || false;
            const shouldTruncate = !hasQuery && !isExpanded && category.docs.length > 7;
            const visibleDocs = shouldTruncate ? category.docs.slice(0, 7) : category.docs;
            const hiddenCount = category.docs.length - visibleDocs.length;

            return (
              <section
                key={category.id}
                className="rounded-luxury border border-white/10 bg-surface/40 p-5"
                aria-labelledby={`kb-category-${category.slug}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2
                    id={`kb-category-${category.slug}`}
                    className="text-lg font-heading font-bold text-foreground"
                  >
                    <Link
                      href={`/kennisbank/${category.slug}/`}
                      className="transition-colors hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  </h2>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground/60">
                    {category.docs.length}
                  </span>
                </div>

                <ul className="space-y-2">
                  {visibleDocs.map((doc) => (
                    <li key={doc.id}>
                      <Link
                        href={doc.path}
                        className="group flex items-start gap-2 text-sm text-foreground/75 transition-colors hover:text-primary"
                      >
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground/35 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        <span>{doc.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {!hasQuery && hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(category.id)}
                    className="mt-4 text-xs text-primary transition-colors hover:text-accent"
                  >
                    +{hiddenCount} extra artikelen in deze categorie
                  </button>
                )}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
