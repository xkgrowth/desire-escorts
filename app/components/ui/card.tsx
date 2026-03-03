import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  variant?: "surface" | "elevated" | "interactive" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "surface",
  padding = "md",
  hover = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-luxury",
        variant === "surface" && "card-surface",
        variant === "elevated" && "card-elevated",
        variant === "interactive" && "card-interactive",
        variant === "glass" &&
          "bg-surface/50 backdrop-blur-sm border border-white/10",
        paddingClasses[padding],
        hover &&
          "transition-all duration-300 hover:shadow-glow hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("border-b border-white/10 px-6 py-4", className)}>
      {children}
    </div>
  );
}

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("border-t border-white/10 px-6 py-4", className)}>
      {children}
    </div>
  );
}
