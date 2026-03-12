import type { Metadata } from "next";
import { PageWrapper, Section, Container } from "../components/ui/page-wrapper";
import { GradientTitle } from "../components/ui/gradient-title";
import { ArticleCard } from "../components/domain/article-card";
import { getBlogPosts } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog Desire Escorts: de laatste updates en nieuws",
  description:
    "Lees de laatste updates, inzichten en nieuwsberichten van Desire Escorts. Praktische artikelen over discretie, veiligheid, services en trends.",
  alternates: {
    canonical: "https://desire-escorts.nl/blog/",
    languages: {
      "nl-NL": "https://desire-escorts.nl/blog/",
      "en-US": "https://desire-escorts.nl/en/blog/",
    },
  },
};

export default function BlogOverviewPage() {
  const posts = getBlogPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <PageWrapper withGradient={true}>
      {featuredPost ? (
        <Section size="sm" className="blog-featured-section">
          <Container size="2xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
                  Blog
                </span>
                <GradientTitle as="h1" size="xl" className="mb-4">
                  Blog Desire Escorts
                </GradientTitle>
                <p className="text-foreground/70">
                  De laatste updates, nieuws en inzichten over onze services, discretie en
                  veiligheid.
                </p>
              </div>

              <div className="lg:col-span-2">
                <ArticleCard
                  variant="featured"
                  title={featuredPost.title}
                  slug={featuredPost.slug}
                  href={`/${featuredPost.slug}/`}
                  category="Laatste post"
                  excerpt={featuredPost.excerpt}
                  imageUrl={featuredPost.imageUrl}
                  author={{ name: featuredPost.author.name }}
                  publishedAt={featuredPost.publishedAtLabel}
                  readTime={featuredPost.readTimeLabel}
                />
              </div>
            </div>
          </Container>
        </Section>
      ) : (
        <Section size="sm" className="blog-featured-section">
          <Container size="2xl">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Blog
            </span>
            <GradientTitle as="h1" size="xl" className="mb-4">
              Blog Desire Escorts
            </GradientTitle>
            <p className="text-foreground/70 max-w-3xl">
              De laatste updates, nieuws en inzichten over onze services, discretie en
              veiligheid.
            </p>
          </Container>
        </Section>
      )}

      <Section size="md" className="blog-posts-section">
        <Container size="2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Alle posts
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <ArticleCard
                key={post.id}
                className="h-full"
                title={post.title}
                slug={post.slug}
                href={`/${post.slug}/`}
                excerpt={post.excerpt}
                imageUrl={post.imageUrl}
                author={{ name: post.author.name }}
                publishedAt={post.publishedAtLabel}
                readTime={post.readTimeLabel}
              />
            ))}
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
