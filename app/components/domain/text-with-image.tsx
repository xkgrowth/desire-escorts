import Image from "next/image";
import { cn } from "@/lib/utils";
import { GradientTitle } from "../ui/gradient-title";
import { Button } from "../ui/button";

type TextWithImageProps = {
  eyebrow?: string;
  title: string;
  titleVariant?: "gold" | "light";
  content: string | React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  ctaText?: string;
  ctaHref?: string;
  ctaVariant?: "primary" | "premium" | "secondary";
  className?: string;
};

export function TextWithImage({
  eyebrow,
  title,
  titleVariant = "gold",
  content,
  imageUrl,
  imageAlt,
  imagePosition = "right",
  ctaText,
  ctaHref,
  ctaVariant = "primary",
  className,
}: TextWithImageProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center",
        className
      )}
    >
      {/* Text Content */}
      <div className={cn(imagePosition === "left" && "lg:order-2")}>
        {eyebrow && (
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
            {eyebrow}
          </span>
        )}
        <GradientTitle as="h2" size="lg" variant={titleVariant} className="mb-6">
          {title}
        </GradientTitle>
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
        {ctaText && ctaHref && (
          <div className="mt-8">
            <Button variant={ctaVariant} size="lg">
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>

      {/* Image */}
      <div
        className={cn(
          "relative aspect-[4/3] rounded-luxury overflow-hidden",
          imagePosition === "left" && "lg:order-1"
        )}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 rounded-luxury ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
}
