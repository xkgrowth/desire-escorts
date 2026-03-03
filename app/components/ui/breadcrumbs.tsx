import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
};

export function Breadcrumbs({
  items,
  showHome = true,
  className,
}: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center flex-wrap gap-1.5 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0 && showHome;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-foreground/30 flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-foreground/50 truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
                >
                  {isHome && <Home className="w-4 h-4" />}
                  {!isHome && item.label}
                </Link>
              ) : (
                <span className="text-foreground/70 flex items-center gap-1">
                  {isHome && <Home className="w-4 h-4" />}
                  {!isHome && item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
