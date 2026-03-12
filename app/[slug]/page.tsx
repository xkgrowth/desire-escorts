import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import { GradientTitle } from "../components/ui/gradient-title";
import { FAQ } from "../components/domain/faq";
import { ServiceTypeDetailTemplate } from "../components/domain/service-type-detail-template";
import { LocationDetailTemplate } from "../components/domain/location-detail-template";
import { getBlogPostBySlug, getBlogPostSlugs, getRelatedBlogPosts } from "@/lib/data/blog-posts";
import {
  allServiceTypeDetailPages,
  getServiceTypePageBySlug,
} from "@/lib/data/service-type-detail-pages";
import { NL_LOCATION_SCOPE_SLUGS } from "@/lib/data/location-registry";
import { getLocationDetailDataForSlug } from "@/lib/data/location-detail-from-extraction";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const reservedRootSlugs = new Set([
  "blog",
  "author",
  "services",
  "prijzen",
  "tarieven",
  "faq",
  "algemene-voorwaarden",
  "privacybeleid",
  "licentie",
  "cookiebeleid",
  "escorts",
  "design-system",
  "escort-in-nederland",
  "escort-haarlem",
  "escort-amstelveen",
  "escort-amsterdam",
  "escort-amsterdam-centrum",
  "escort-amsterdam-noord",
  "escort-amsterdam-oost",
  "escort-amsterdam-west",
  "escort-amsterdam-zuid",
  // Keep explicit handcrafted routes owning these paths.
  "hotel-escort",
  "aziatische-escorts",
]);

export async function generateStaticParams() {
  const blogSlugs = getBlogPostSlugs().filter((slug) => !reservedRootSlugs.has(slug));
  const serviceTypeSlugs = allServiceTypeDetailPages
    .map((page) => page.slug)
    .filter((slug) => !reservedRootSlugs.has(slug));
  const locationSlugs = NL_LOCATION_SCOPE_SLUGS.filter((slug) => !reservedRootSlugs.has(slug));

  const uniqueSlugs = Array.from(
    new Set([...blogSlugs, ...serviceTypeSlugs, ...locationSlugs])
  );
  return uniqueSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const serviceTypePage = getServiceTypePageBySlug(slug);
  if (serviceTypePage) {
    // service type metadata
    const seoTitle =
      serviceTypePage.seoTitle ?? `${serviceTypePage.title} | Vanaf €160 | Desire Escorts`;
    const ogImage = serviceTypePage.ogImageUrl ?? serviceTypePage.primaryImageUrl;

    return {
      title: seoTitle,
      description: serviceTypePage.metaDescription,
      alternates: {
        canonical: `https://desire-escorts.nl/${serviceTypePage.slug}/`,
        languages: {
          "nl-NL": `https://desire-escorts.nl/${serviceTypePage.slug}/`,
          "en-US": `https://desire-escorts.nl/en/${serviceTypePage.slug}/`,
        },
      },
      openGraph: {
        title: seoTitle,
        description: serviceTypePage.metaDescription,
        url: `https://desire-escorts.nl/${serviceTypePage.slug}/`,
        siteName: "Desire Escorts",
        locale: "nl_NL",
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: serviceTypePage.primaryImageAlt,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: serviceTypePage.metaDescription,
        images: [ogImage],
      },
    };
  }

  const locationData = !reservedRootSlugs.has(slug)
    ? getLocationDetailDataForSlug(slug)
    : null;
  if (locationData) {
    return {
      title: locationData.metaTitle,
      description: locationData.metaDescription,
      alternates: {
        canonical: `https://desire-escorts.nl/${locationData.slug}`,
        languages: {
          "nl-NL": `https://desire-escorts.nl/${locationData.slug}`,
          "en-US": `https://desire-escorts.nl/en/${locationData.slug}`,
        },
      },
    };
  }

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
  const serviceTypePage = getServiceTypePageBySlug(slug);
  if (serviceTypePage) {
    // service type page
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: serviceTypePage.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl" },
        {
          "@type": "ListItem",
          position: 2,
          name: serviceTypePage.pageType === "service" ? "Services" : "Escort Types",
          item: "https://desire-escorts.nl/services",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: serviceTypePage.title,
          item: `https://desire-escorts.nl/${serviceTypePage.slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ServiceTypeDetailTemplate data={serviceTypePage} locale="nl" />
      </>
    );
  }

  const locationData = !reservedRootSlugs.has(slug)
    ? getLocationDetailDataForSlug(slug)
    : null;
  if (locationData) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: locationData.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `Desire Escorts ${locationData.city}`,
      description: locationData.metaDescription,
      areaServed: { "@type": "City", name: locationData.city },
      priceRange: locationData.priceFromValue,
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <LocationDetailTemplate data={locationData} />
      </>
    );
  }

  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const sidebarPosts = getRelatedBlogPosts(post.slug, 5);
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
              <GradientTitle as="h1" size="xl" className="mb-2">
                {post.title}
              </GradientTitle>

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
              dangerouslySetInnerHTML={{ __html: post.contentHtmlMain }}
            />

            {post.faqItems.length > 0 && (
              <div className="mt-10">
                <FAQ
                  title="FAQ"
                  items={post.faqItems.map((item) => ({
                    question: item.question,
                    answer: item.answer,
                  }))}
                  variant="default"
                />
              </div>
            )}
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
            <div className="mt-5 pt-4 border-t border-white/10">
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:text-accent transition-colors"
              >
                Terug naar blogoverzicht
              </Link>
            </div>
          </aside>
        </div>
      </PageSection>
    </PageLayout>
  );
}
