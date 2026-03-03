import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../ui/breadcrumbs";
import { USPBar } from "./usp-bar";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type HeroUSPItem = {
  icon: React.ReactNode;
  title: string;
  description?: string;
};

type TemplateHeroGlassProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  uspItems: HeroUSPItem[];
  className?: string;
};

/**
 * Compact, reusable page hero for non-home templates.
 * Uses layered cards + glass effect to keep premium styling without image dependency.
 */
export function TemplateHeroGlass({
  breadcrumbs,
  title,
  description,
  uspItems,
  className,
}: TemplateHeroGlassProps) {
  return (
    <div className={cn("relative isolate", className)}>
      <div
        className="pointer-events-none absolute left-1/2 top-[-110px] z-0 h-[320px] w-[130%] -translate-x-1/2 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(180,100,50,0.3) 0%, rgba(247,208,99,0.14) 35%, rgba(247,208,99,0.03) 60%, transparent 78%)",
        }}
      />

      <div
        className={cn(
          "relative z-10 rounded-luxury border border-white/10 bg-white/[0.03] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="rounded-[16px] border border-white/15 bg-surface/55 px-5 py-5 backdrop-blur-md md:px-8 md:py-7">
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-4 border-b border-white/10 pb-3"
          />

          <div className="max-w-3xl">
            <h1 className="text-3xl font-heading font-bold text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-foreground/75 md:text-lg">{description}</p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <USPBar
              variant="horizontal"
              horizontalAlign="start"
              items={uspItems.map((item) => ({
                icon: item.icon,
                title: item.title,
                description: item.description ?? "",
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
