import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  variant?: "default" | "featured" | "compact";
  className?: string;
};

export function ServiceCard({
  title,
  description,
  href,
  imageUrl,
  icon,
  variant = "default",
  className,
}: ServiceCardProps) {
  if (variant === "compact") {
    return (
      <Link href={href} className={cn("group block", className)}>
        <div className="flex items-center gap-4 p-4 rounded-luxury bg-surface/50 border border-white/5 hover:border-primary/20 transition-all duration-300">
          {icon && (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-foreground/60 line-clamp-1">{description}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className={cn("group block", className)}>
        <div className="relative h-80 rounded-luxury overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-foreground/70 line-clamp-2">{description}</p>
            <div className="flex items-center gap-2 mt-4 text-primary">
              <span className="text-sm font-medium">Meer informatie</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <div className="card-surface rounded-luxury overflow-hidden hover:shadow-glow transition-shadow duration-300 h-full flex flex-col">
        {imageUrl && (
          <div className="relative h-48">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex h-full flex-col">
          {icon && !imageUrl && (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-foreground/60 line-clamp-3 mb-4">
            {description}
          </p>
          <div className="mt-auto flex items-center gap-2 text-primary text-sm font-medium">
            <span>Bekijk service</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
