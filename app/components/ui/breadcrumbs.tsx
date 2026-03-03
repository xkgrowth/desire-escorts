import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  homeLabel?: string;
  className?: string;
};

export function Breadcrumbs({
  items,
  showHome = true,
  homeHref = "/",
  homeLabel = "Home",
  className,
}: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center", className)}
    >
      <ol
        className="flex items-center gap-1.5 text-sm"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0 && showHome;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 text-foreground/30 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast || !item.href ? (
                <span
                  className={cn(
                    "text-foreground/60",
                    isLast && "text-foreground font-medium"
                  )}
                  itemProp="name"
                  aria-current={isLast ? "page" : undefined}
                >
                  {isFirst ? (
                    <span className="flex items-center gap-1.5">
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-foreground/60 hover:text-primary transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">
                    {isFirst ? (
                      <span className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type BreadcrumbsCompactProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function BreadcrumbsCompact({ items, className }: BreadcrumbsCompactProps) {
  if (items.length === 0) return null;

  const lastWithHref = [...items].reverse().find((item) => item.href);
  const current = items[items.length - 1];

  if (!lastWithHref) {
    return (
      <span className={cn("text-sm text-foreground/60", className)}>
        {current.label}
      </span>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm", className)}>
      <Link
        href={lastWithHref.href!}
        className="text-foreground/60 hover:text-primary transition-colors flex items-center gap-1"
      >
        <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
        <span>{lastWithHref.label}</span>
      </Link>
    </nav>
  );
}
