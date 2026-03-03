import { cn } from "@/lib/utils";

type GradientTitleProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  variant?: "gold" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-4xl md:text-5xl lg:text-6xl",
};

export function GradientTitle({
  children,
  as: Tag = "h2",
  variant = "gold",
  size = "lg",
  className,
}: GradientTitleProps) {
  return (
    <Tag
      className={cn(
        "font-heading font-extrabold leading-tight tracking-tight",
        variant === "gold" ? "text-gradient-gold" : "text-gradient-light",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
