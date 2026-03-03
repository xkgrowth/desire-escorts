import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

type TestimonialCardProps = {
  quote: string;
  author?: string;
  role?: string;
  rating?: number;
  variant?: "default" | "featured" | "minimal";
  className?: string;
};

export function TestimonialCard({
  quote,
  author,
  role,
  rating,
  variant = "default",
  className,
}: TestimonialCardProps) {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < count ? "text-primary fill-primary" : "text-foreground/20"
        )}
      />
    ));
  };

  if (variant === "minimal") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {rating && <div className="flex gap-1">{renderStars(rating)}</div>}
        <p className="text-foreground/80 italic">&ldquo;{quote}&rdquo;</p>
        {author && (
          <p className="text-sm text-foreground/50">
            — {author}
            {role && <span className="text-foreground/30">, {role}</span>}
          </p>
        )}
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={cn(
          "relative p-8 lg:p-12 rounded-luxury",
          "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
          "border border-primary/20",
          className
        )}
      >
        <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20" />
        <div className="relative">
          {rating && (
            <div className="flex gap-1 mb-6">{renderStars(rating)}</div>
          )}
          <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mb-6">
            &ldquo;{quote}&rdquo;
          </blockquote>
          {author && (
            <div>
              <p className="font-heading font-bold text-foreground">{author}</p>
              {role && <p className="text-sm text-foreground/50">{role}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "card-surface rounded-luxury p-6",
        className
      )}
    >
      {rating && <div className="flex gap-1 mb-4">{renderStars(rating)}</div>}
      <Quote className="w-8 h-8 text-primary/30 mb-4" />
      <blockquote className="text-foreground/80 leading-relaxed mb-4">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {author && (
        <div className="pt-4 border-t border-white/10">
          <p className="font-heading font-bold text-foreground text-sm">
            {author}
          </p>
          {role && <p className="text-xs text-foreground/50">{role}</p>}
        </div>
      )}
    </div>
  );
}
