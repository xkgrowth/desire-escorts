import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonProps = {
  variant?: "primary" | "premium" | "whatsapp" | "secondary" | "ghost" | "action";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClasses = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
  xl: "px-10 py-4 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-heading font-bold transition-all rounded-luxury";

    const variantClasses = {
      primary: "btn-bevel text-primary-foreground",
      premium: "btn-bevel-premium text-background",
      whatsapp: "btn-bevel-whatsapp text-white",
      secondary:
        "bg-surface-interactive border-2 border-primary/30 text-foreground hover:border-primary/60 hover:bg-surface-interactive",
      ghost:
        "bg-transparent border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground hover:bg-surface/30",
      action:
        "bg-surface/50 border border-white/5 text-foreground/60 hover:text-primary hover:border-primary/20 hover:bg-surface font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
