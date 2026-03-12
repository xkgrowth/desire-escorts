import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { PageLayout, PageSection } from "@/app/components/layout/page-layout";
import { GradientTitle } from "@/app/components/ui/gradient-title";
import {
  getKnowledgeCategories,
  getKnowledgeCategoryBySlug,
} from "@/lib/data/knowledge-centre";

type KnowledgeCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getKnowledgeCategories().map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: KnowledgeCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getKnowledgeCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: "Pagina niet gevonden | Desire Escorts",
    };
  }

  const canonical = `https://desire-escorts.nl/kennisbank/${categoryData.slug}/`;
  return {
    title: `${categoryData.name} | Kennisbank | Desire Escorts`,
    description: `Bekijk alle kennisbank artikelen binnen ${categoryData.name.toLowerCase()} op Desire Escorts.`,
    alternates: {
      canonical,
      languages: {
        "nl-NL": canonical,
        "en-US": `https://desire-escorts.nl/en/kennisbank/${categoryData.slug}/`,
      },
    },
  };
}

function formatDate(dateValue: string): string {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default async function KnowledgeCategoryPage({ params }: KnowledgeCategoryPageProps) {
  const { category } = await params;
  const categoryData = getKnowledgeCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const allCategories = getKnowledgeCategories();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryData.name} artikelen`,
    itemListElement: categoryData.docs.map((doc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://desire-escorts.nl${doc.path}`,
      name: doc.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageLayout
        breadcrumbs={[
          { label: "Kennisbank", href: "/kennisbank/" },
          { label: categoryData.name },
        ]}
        breadcrumbsVariant="compact"
      >
        <PageSection size="sm" className="pt-6">
          <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="h-fit rounded-luxury border border-white/10 bg-surface/35 p-4 xl:sticky xl:top-24">
              <nav aria-label="Kennisbank categorieen">
                <ul className="space-y-2">
                  {allCategories.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/kennisbank/${item.slug}/`}
                        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                          item.slug === categoryData.slug
                            ? "bg-primary/15 text-primary"
                            : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-foreground/60">
                          {item.docs.length}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div>
              <header className="mb-6 rounded-luxury border border-white/10 bg-surface/35 p-6">
                <GradientTitle as="h1" size="lg" className="mb-2">
                  {categoryData.name}
                </GradientTitle>
                <p className="text-sm text-foreground/65">{categoryData.docs.length} Docs</p>
              </header>

              <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {categoryData.docs.map((doc) => (
                  <article
                    key={doc.id}
                    className="rounded-luxury border border-white/10 bg-surface/40 p-5 transition-colors hover:border-primary/30"
                  >
                    <p className="mb-3 inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-foreground/60">
                      Laatst geupdatet: {formatDate(doc.modifiedDate || doc.date)}
                    </p>
                    <h2 className="text-2xl font-heading font-bold text-foreground">
                      <Link href={doc.path} className="transition-colors hover:text-primary">
                        {doc.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm text-foreground/65">{doc.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-foreground/55">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {doc.readTimeLabel}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(doc.date)}
                      </span>
                    </div>
                  </article>
                ))}
              </section>
            </div>
          </div>
        </PageSection>
      </PageLayout>
    </>
  );
}
