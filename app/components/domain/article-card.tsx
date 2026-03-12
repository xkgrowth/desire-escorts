import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

type ArticleCardProps = {
  title: string;
  slug: string;
  href?: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  categoryHref?: string;
  author?: {
    name: string;
    imageUrl?: string;
  };
  publishedAt?: string;
  readTime?: string;
  variant?: "default" | "featured" | "compact" | "horizontal";
  className?: string;
};

export function ArticleCard({
  title,
  slug,
  href,
  excerpt,
  imageUrl,
  category,
  categoryHref,
  author,
  publishedAt,
  readTime,
  variant = "default",
  className,
}: ArticleCardProps) {
  const articleHref = href || `/blog/${slug}/`;

  if (variant === "featured") {
    return (
      <article className={cn("group relative", className)}>
        <Link href={articleHref} className="block">
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-luxury overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-muted to-surface" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
              {category && (
                <span className="inline-block px-4 py-1.5 rounded-full border border-primary/70 bg-primary/15 text-primary text-sm font-semibold tracking-wide mb-4">
                  {category}
                </span>
              )}

              <h2 className="text-2xl lg:text-4xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h2>

              {excerpt && (
                <p className="text-foreground/70 line-clamp-2 mb-4 max-w-2xl">
                  {excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-foreground/60">
                {author && (
                  <div className="flex items-center gap-2">
                    {author.imageUrl ? (
                      <Image
                        src={author.imageUrl}
                        alt={author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>{author.name}</span>
                  </div>
                )}
                {publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{publishedAt}</span>
                  </div>
                )}
                {readTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{readTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className={cn("group", className)}>
        <Link href={articleHref} className="flex gap-4 lg:gap-6">
          <div className="relative w-32 lg:w-48 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 128px, 192px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-muted to-surface" />
            )}
          </div>

          <div className="flex-1 min-w-0 py-1">
            {category && (
              <span className="text-xs text-primary font-medium">{category}</span>
            )}

            <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1 mb-2">
              {title}
            </h3>

            {excerpt && (
              <p className="text-sm text-foreground/60 line-clamp-2 mb-3 hidden sm:block">
                {excerpt}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-foreground/50">
              {publishedAt && <span>{publishedAt}</span>}
              {readTime && <span>{readTime}</span>}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        <Link
          href={articleHref}
          className="flex items-start gap-4 p-4 rounded-lg card-interactive transition-all hover:border-primary/20"
        >
          <div className="flex-1 min-w-0">
            {category && (
              <span className="text-xs text-primary font-medium">{category}</span>
            )}
            <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1">
              {title}
            </h3>
            {publishedAt && (
              <span className="text-xs text-foreground/50 mt-2 block">
                {publishedAt}
              </span>
            )}
          </div>
          <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group", className)}>
      <Link href={articleHref} className="block h-full">
        <div className="card-interactive rounded-luxury overflow-hidden hover:shadow-glow transition-shadow duration-300 h-full flex flex-col">
          <div className="relative aspect-[16/9]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-muted to-surface" />
            )}
            {category && (
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                  {category}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-1 flex-col">
            <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {title}
            </h3>

            {excerpt && (
              <p className="text-sm text-foreground/60 line-clamp-2 mb-4 min-h-[2.75rem]">
                {excerpt}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between text-xs text-foreground/50">
              <div className="flex items-center gap-3">
                {publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{publishedAt}</span>
                  </div>
                )}
                {readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readTime}</span>
                  </div>
                )}
              </div>

              <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

type ArticleCategoryCardProps = {
  title: string;
  href: string;
  description?: string;
  articleCount?: number;
  icon?: React.ReactNode;
  className?: string;
};

export function ArticleCategoryCard({
  title,
  href,
  description,
  articleCount,
  icon,
  className,
}: ArticleCategoryCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="flex items-center gap-4 p-5 rounded-luxury card-interactive transition-all hover:border-primary/20">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-foreground/60 line-clamp-1 mt-0.5">
              {description}
            </p>
          )}
          {articleCount !== undefined && (
            <span className="text-xs text-foreground/40 mt-1 block">
              {articleCount} {articleCount === 1 ? "artikel" : "artikelen"}
            </span>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}
