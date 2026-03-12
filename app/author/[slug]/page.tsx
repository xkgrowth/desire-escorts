import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout, PageSection } from "../../components/layout/page-layout";
import { GradientTitle } from "../../components/ui/gradient-title";
import { ArticleCard } from "../../components/domain/article-card";
import { getAuthorBySlug, getPostsByAuthorSlug } from "@/lib/data/blog-posts";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

const SUPPORTED_AUTHOR_SLUG = "julian-van-dijk";

export async function generateStaticParams() {
  return [{ slug: SUPPORTED_AUTHOR_SLUG }];
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug !== SUPPORTED_AUTHOR_SLUG) {
    return {
      title: "Auteur niet gevonden | Desire Escorts",
    };
  }

  const author = getAuthorBySlug(slug);

  return {
    title: `${author?.name || "Auteur"} - Desire Escorts`,
    description:
      author?.bio ||
      "Bekijk artikelen en inzichten van onze auteur op het blog van Desire Escorts.",
    alternates: {
      canonical: `https://desire-escorts.nl/author/${slug}/`,
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;

  if (slug !== SUPPORTED_AUTHOR_SLUG) {
    notFound();
  }

  const author = getAuthorBySlug(slug);
  const posts = getPostsByAuthorSlug(slug);

  if (!author) {
    notFound();
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Blog", href: "/blog" },
        { label: "Auteur", href: "/author/julian-van-dijk/" },
        { label: author.name },
      ]}
      breadcrumbsVariant="compact"
    >
      <PageSection size="sm">
        <div className="max-w-4xl">
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
            Auteur
          </span>
          <GradientTitle as="h1" size="xl" className="mb-4">
            {author.name}
          </GradientTitle>
          <p className="text-foreground/70 leading-relaxed">{author.bio}</p>
        </div>
      </PageSection>

      <PageSection size="sm" title={`Artikelen van ${author.name}`}>
        <div className="grid gap-5">
          {posts.map((post) => (
            <ArticleCard
              key={post.id}
              variant="horizontal"
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              imageUrl={post.imageUrl}
              publishedAt={post.publishedAtLabel}
              readTime={post.readTimeLabel}
              author={{ name: post.author.name }}
            />
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
