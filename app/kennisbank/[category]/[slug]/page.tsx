import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { PageLayout, PageSection } from "@/app/components/layout/page-layout";
import { GradientTitle } from "@/app/components/ui/gradient-title";
import { KnowledgeCategorySidebar } from "@/app/components/domain/knowledge-category-sidebar";
import { KnowledgeToc } from "@/app/components/domain/knowledge-toc";
import { FaqAccordion } from "@/app/components/domain/faq-accordion";
import {
  getKnowledgeCategories,
  getKnowledgeDocByCategoryAndSlug,
  getKnowledgeDocPaths,
  getRelatedKnowledgeDocs,
} from "@/lib/data/knowledge-centre";
import { getFaqsByCategory } from "@/lib/data/faqs";

type KnowledgeDocPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export function generateStaticParams() {
  return getKnowledgeDocPaths();
}

export async function generateMetadata({ params }: KnowledgeDocPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const doc = getKnowledgeDocByCategoryAndSlug(category, slug);

  if (!doc) {
    return {
      title: "Pagina niet gevonden | Desire Escorts",
    };
  }

  const description = doc.excerpt || `${doc.title} - Kennisbank artikel van Desire Escorts.`;
  const canonical = `https://desire-escorts.nl${doc.path}`;

  return {
    title: `${doc.title} | Kennisbank | Desire Escorts`,
    description,
    alternates: {
      canonical,
      languages: {
        "nl-NL": canonical,
        "en-US": `https://desire-escorts.nl/en/kennisbank/${doc.categorySlug}/${doc.slug}/`,
      },
    },
  };
}

export default async function KnowledgeDocPage({ params }: KnowledgeDocPageProps) {
  const { category, slug } = await params;
  const doc = getKnowledgeDocByCategoryAndSlug(category, slug);

  if (!doc) {
    notFound();
  }

  const categories = getKnowledgeCategories();
  const relatedDocs = getRelatedKnowledgeDocs(category, slug, 8);
  const faqs = getFaqsByCategory(category);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://desire-escorts.nl/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kennisbank",
        item: "https://desire-escorts.nl/kennisbank/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: doc.categoryName,
        item: `https://desire-escorts.nl${doc.categoryPath}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: doc.title,
        item: `https://desire-escorts.nl${doc.path}`,
      },
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <PageLayout
        breadcrumbs={[
          { label: "Kennisbank", href: "/kennisbank/" },
          { label: doc.categoryName, href: doc.categoryPath },
          { label: doc.title },
        ]}
        breadcrumbsVariant="full"
      >
        <PageSection size="sm" className="pt-6">
          <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)_260px]">
            <aside className="h-fit rounded-luxury border border-white/10 bg-surface/35 p-4 xl:sticky xl:top-24">
              <KnowledgeCategorySidebar
                categories={categories.map((item) => ({
                  id: item.id,
                  slug: item.slug,
                  name: item.name,
                  docs: item.docs.map((entry) => ({
                    id: entry.id,
                    slug: entry.slug,
                    title: entry.title,
                    path: entry.path,
                  })),
                }))}
                activeCategorySlug={doc.categorySlug}
                activeDocSlug={doc.slug}
              />
            </aside>

            <article className="min-w-0">
              <header className="mb-6">
                <GradientTitle as="h1" size="xl" className="mb-3">
                  {doc.title}
                </GradientTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                  <div className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{doc.readTimeLabel}</span>
                  </div>
                  {doc.modifiedDate && (
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={doc.modifiedDate}>
                        Geupdatet:{" "}
                        {new Intl.DateTimeFormat("nl-NL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(doc.modifiedDate))}
                      </time>
                    </div>
                  )}
                </div>
              </header>

              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
              />

              {relatedDocs.length > 0 && (
                <section className="mt-10 rounded-luxury border border-white/10 bg-surface/30 p-5">
                  <h2 className="mb-4 text-lg font-heading font-bold text-foreground">
                    Gerelateerde artikelen
                  </h2>
                  <ul className="space-y-2">
                    {relatedDocs.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.path}
                          className="text-sm text-foreground/75 transition-colors hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {faqs.length > 0 && (
                <section className="mt-10 rounded-luxury border border-white/10 bg-surface/30 p-5">
                  <h2 className="mb-4 text-lg font-heading font-bold text-foreground">
                    Veelgestelde vragen over {doc.categoryName.toLowerCase()}
                  </h2>
                  <FaqAccordion faqs={faqs} />
                </section>
              )}
            </article>

            <aside className="h-fit rounded-luxury border border-white/10 bg-surface/35 p-4 xl:sticky xl:top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Inhoudsopgave
              </p>
              {doc.toc.length > 0 ? (
                <KnowledgeToc items={doc.toc} />
              ) : (
                <p className="text-sm text-foreground/55">
                  Deze pagina bevat geen afzonderlijke sectiekoppen.
                </p>
              )}
            </aside>
          </div>
        </PageSection>
      </PageLayout>
    </>
  );
}
