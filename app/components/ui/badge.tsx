import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type BadgeProps = {
  variant?: "default" | "verified" | "service" | "available" | "unavailable";
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

  if (variant === "available") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          "bg-green-950/90 text-green-400 backdrop-blur-sm border border-green-500/30",
          className
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span>Beschikbaar</span>
      </span>
    );
  }

  if (variant === "unavailable") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          "bg-surface text-foreground/85 backdrop-blur-sm border border-white/20 shadow-sm",
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-white" />
        <span>Niet beschikbaar</span>
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
