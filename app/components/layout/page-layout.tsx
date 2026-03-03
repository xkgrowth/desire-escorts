"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Breadcrumbs, BreadcrumbsCompact } from "../ui/breadcrumbs";
import { PageWrapper, Section, Container } from "../ui/page-wrapper";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageLayoutProps = {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  breadcrumbsVariant?: "full" | "compact" | "none";
  showBreadcrumbsOnMobile?: boolean;
  withGradient?: boolean;
  className?: string;
};

/**
 * PageLayout provides a consistent page structure with optional breadcrumbs.
 * Use this component to wrap page content for detail pages and nested routes.
 * 
 * @example
 * ```tsx
 * <PageLayout
 *   breadcrumbs={[
 *     { label: "Escorts", href: "/escorts" },
 *     { label: "Amsterdam", href: "/escorts/amsterdam" },
 *     { label: "Sophie" },
 *   ]}
 * >
 *   <YourPageContent />
 * </PageLayout>
 * ```
 */
export function PageLayout({
  children,
  breadcrumbs,
  breadcrumbsVariant = "full",
  showBreadcrumbsOnMobile = true,
  withGradient = true,
  className,
}: PageLayoutProps) {
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0 && breadcrumbsVariant !== "none";

  return (
    <PageWrapper withGradient={withGradient} className={className}>
      {hasBreadcrumbs && (
        <div className={cn(
          "border-b border-white/5",
          !showBreadcrumbsOnMobile && "hidden md:block"
        )}>
          <Container size="xl" className="py-3">
            {breadcrumbsVariant === "compact" ? (
              <BreadcrumbsCompact items={breadcrumbs} />
            ) : (
              <Breadcrumbs items={breadcrumbs} />
            )}
          </Container>
        </div>
      )}
      {children}
    </PageWrapper>
  );
}

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * PageHero provides a consistent hero section for pages.
 * Use inside PageLayout for detail pages, category pages, etc.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  size = "md",
  className,
}: PageHeroProps) {
  return (
    <Section glow="hero" size={size} className={className}>
      <Container size="xl">
        <div className={cn(
          "max-w-3xl",
          align === "center" && "mx-auto text-center"
        )}>
          {eyebrow && (
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 rounded-full">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-foreground/70 max-w-2xl">
              {description}
            </p>
          )}
          {children}
        </div>
      </Container>
    </Section>
  );
}

type PageSectionProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  glow?: "none" | "mid" | "bottom" | "ambient";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * PageSection provides consistent section styling within pages.
 */
export function PageSection({
  children,
  title,
  description,
  glow = "none",
  size = "md",
  className,
}: PageSectionProps) {
  return (
    <Section glow={glow} size={size} className={className}>
      <Container size="xl">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-foreground/70 max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </Section>
  );
}

/**
 * Helper to generate breadcrumbs from pathname.
 * This can be used for simple cases where breadcrumbs map directly to URL segments.
 */
export function generateBreadcrumbsFromPath(
  pathname: string,
  labelMap?: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];
  
  let currentPath = "";
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Skip locale segment
    if (segment === "en" && i === 0) {
      continue;
    }
    
    const label = labelMap?.[segment] || formatSegmentLabel(segment);
    const isLast = i === segments.length - 1;
    
    items.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  }
  
  return items;
}

function formatSegmentLabel(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
