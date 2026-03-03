import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonProps = {
  variant?: "primary" | "premium" | "whatsapp" | "secondary" | "ghost";
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
      "inline-flex items-center justify-center font-heading font-bold rounded-full transition-all";

    const variantClasses = {
      primary: "btn-bevel text-primary-foreground",
      premium: "btn-bevel-premium text-background",
      whatsapp: "btn-bevel-whatsapp text-white",
      secondary:
        "bg-surface border border-border text-foreground hover:border-primary/50 hover:bg-surface-muted",
      ghost: "btn-ghost",
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
