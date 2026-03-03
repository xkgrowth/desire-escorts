import { cn } from "@/lib/utils";
import { GradientTitle } from "../ui/gradient-title";

type TextBlockProps = {
  eyebrow?: string;
  title?: string;
  titleVariant?: "gold" | "light";
  content: string | React.ReactNode;
  align?: "left" | "center" | "right";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
};

const maxWidthClasses = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  full: "max-w-none",
};

export function TextBlock({
  eyebrow,
  title,
  titleVariant = "gold",
  content,
  align = "left",
  maxWidth = "lg",
  className,
}: TextBlockProps) {
  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        align === "center" && "mx-auto text-center",
        align === "right" && "ml-auto text-right",
        className
      )}
    >
      {eyebrow && (
        <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
          {eyebrow}
        </span>
      )}
      {title && (
        <GradientTitle as="h2" size="lg" variant={titleVariant} className="mb-6">
          {title}
        </GradientTitle>
      )}
      {typeof content === "string" ? (
        <div
          className="text-foreground/70 leading-relaxed space-y-4 prose prose-invert prose-gold max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="text-foreground/70 leading-relaxed space-y-4">
          {content}
        </div>
      )}
    </div>
  );
}
