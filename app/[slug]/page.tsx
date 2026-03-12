import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { getBlogPostBySlug, getBlogPostSlugs, getRelatedBlogPosts } from "@/lib/data/blog-posts";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Pagina niet gevonden | Desire Escorts",
    };
  }

  return {
    title: `${post.title} | Desire Escorts`,
    description: post.excerpt,
    alternates: {
      canonical: `https://desire-escorts.nl/${post.slug}/`,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const sidebarPosts = getRelatedBlogPosts(post.slug, 12);
  const authorHref =
    post.author.slug === "julian-van-dijk" ? `/author/${post.author.slug}/` : null;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Blog", href: "/blog" },
        { label: post.title },
      ]}
      breadcrumbsVariant="compact"
    >
      <PageSection size="sm">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <header className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-foreground md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/65">
                {authorHref ? (
                  <Link
                    href={authorHref}
                    className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </span>
                )}
                <div className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>{post.publishedAtLabel}</time>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTimeLabel}</span>
                </div>
              </div>
            </header>

            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </article>

          <aside className="lg:sticky lg:top-24 h-fit rounded-luxury border border-white/10 bg-surface/35 p-5">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Laatste berichten
            </h2>
            <nav aria-label="Andere blogberichten">
              <ul className="space-y-4">
                {sidebarPosts.map((item) => (
                  <li key={item.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <Link
                      href={`/${item.slug}/`}
                      className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-foreground/50">{item.publishedAtLabel}</p>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </PageSection>
    </PageLayout>
  );
}
