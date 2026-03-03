import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type BadgeProps = {
  variant?: "default" | "verified" | "vip" | "service";
  children?: React.ReactNode;
  className?: string;
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  if (variant === "verified") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
          "bg-primary/20 text-primary",
          className
        )}
      >
        <CheckCircle className="w-3 h-3" />
        <span>Verified</span>
      </span>
    );
  }

  if (variant === "vip") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
          "bg-gradient-to-r from-primary to-accent text-primary-foreground",
          "shadow-glow",
          className
        )}
      >
        VIP Elite
      </span>
    );
  }

  if (variant === "service") {
    return (
      <span
        className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
          "bg-surface border border-border text-foreground/80",
          "hover:border-primary/30 transition-colors",
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        "bg-surface border border-border text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
