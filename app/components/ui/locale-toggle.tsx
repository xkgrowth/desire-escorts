"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

type LocaleToggleProps = {
  currentLocale?: "nl" | "en";
  variant?: "button" | "text" | "dropdown";
  className?: string;
};

export function LocaleToggle({
  currentLocale = "nl",
  variant = "button",
  className,
}: LocaleToggleProps) {
  const pathname = usePathname();

  const getAlternateUrl = () => {
    if (currentLocale === "nl") {
      return `/en${pathname}`;
    }
    return pathname.replace(/^\/en/, "") || "/";
  };

  const alternateLocale = currentLocale === "nl" ? "en" : "nl";
  const alternateLabel = currentLocale === "nl" ? "English" : "Nederlands";

  if (variant === "text") {
    return (
      <Link
        href={getAlternateUrl()}
        className={cn(
          "text-sm text-foreground/60 hover:text-foreground transition-colors",
          className
        )}
      >
        {alternateLabel}
      </Link>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={cn("relative group", className)}>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-surface/50 transition-colors">
          <Globe className="w-4 h-4" />
          <span className="uppercase">{currentLocale}</span>
        </button>
        <div className="absolute top-full right-0 mt-1 py-1 bg-surface border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <Link
            href={getAlternateUrl()}
            className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-surface-muted transition-colors whitespace-nowrap"
          >
            {alternateLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={getAlternateUrl()}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-surface/50 border border-white/10",
        "text-sm text-foreground/70 hover:text-foreground hover:border-primary/30",
        "transition-colors",
        className
      )}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{alternateLocale}</span>
    </Link>
  );
}
