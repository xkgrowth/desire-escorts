"use client";

import { cn } from "@/lib/utils";

type PageWrapperProps = {
  children: React.ReactNode;
  className?: string;
  withGradient?: boolean;
};

export function PageWrapper({
  children,
  className,
  withGradient = false,
}: PageWrapperProps) {
  return (
    <main className={cn(withGradient && "page-gradient", "min-h-screen", className)}>
      {children}
    </main>
  );
}

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glow?: "hero" | "mid" | "bottom" | "ambient" | "none";
  size?: "sm" | "md" | "lg";
};

export function Section({
  children,
  className,
  id,
  glow = "none",
  size = "md",
}: SectionProps) {
  const glowClasses = {
    hero: "hero-glow",
    mid: "mid-glow",
    bottom: "bottom-glow",
    ambient: "bg-ambient-glow",
    none: "",
  };

  const sizeClasses = {
    sm: "section-sm",
    md: "section",
    lg: "section",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative",
        sizeClasses[size],
        glowClasses[glow],
        className
      )}
    >
      {children}
    </section>
  );
}

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
};

export function Container({
  children,
  className,
  size = "2xl",
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto w-full px-4 lg:px-6", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

type GridProps = {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg";
};

export function Grid({
  children,
  className,
  cols = 12,
  gap = "md",
}: GridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-4 md:grid-cols-12",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}
