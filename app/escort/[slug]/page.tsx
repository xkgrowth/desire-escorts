import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "../../components/ui/badge";
import { CTASection } from "../../components/domain/cta-section";
import { ProfileCard } from "../../components/domain/profile-card";
import { FAQ } from "../../components/domain/faq";
import { PageLayout, PageSection } from "../../components/layout/page-layout";
import { mockEscortGrid, homeFaqs } from "@/lib/data/mock-data";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

function getProfileBySlug(slug: string) {
  return mockEscortGrid.find((profile) => profile.slug === slug);
}

export async function generateStaticParams() {
  return mockEscortGrid.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Escort Profiel Niet Gevonden | Desire Escorts",
    };
  }

  return {
    title: `${profile.name} | Escort Profiel Nederland | Desire Escorts`,
    description: `${profile.name} bekijken? Bekijk profiel, beschikbaarheid en services. Discreet boeken via Desire Escorts.`,
    alternates: {
      canonical: `https://desire-escorts.nl/escort/${profile.slug}`,
    },
  };
}

export default async function EscortDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const relatedProfiles = mockEscortGrid
    .filter((item) => item.slug !== profile.slug)
    .slice(0, 4);

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Escorts", href: "/escorts" },
        { label: profile.name },
      ]}
    >
      <PageSection size="sm">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="relative overflow-hidden rounded-luxury border border-white/10 bg-surface/30">
            {profile.imageUrl ? (
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                width={420}
                height={620}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-[620px] items-center justify-center text-foreground/40">
                Geen afbeelding beschikbaar
              </div>
            )}
          </div>

          <div className="rounded-luxury border border-white/10 bg-surface/30 p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {profile.isVerified && <Badge variant="verified" />}
              <Badge variant={profile.isAvailable ? "available" : "unavailable"} />
            </div>

            <h1 className="mb-3 text-3xl font-heading font-bold text-gradient-gold md:text-4xl">
              {profile.name}
            </h1>

            {profile.tagline && (
              <p className="mb-6 text-lg text-foreground/70">{profile.tagline}</p>
            )}

            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="card-surface rounded-luxury p-3 text-center">
                <p className="text-xs uppercase tracking-wide text-foreground/50">Leeftijd</p>
                <p className="text-lg font-heading font-bold">{profile.age ?? "-"}</p>
              </div>
              <div className="card-surface rounded-luxury p-3 text-center">
                <p className="text-xs uppercase tracking-wide text-foreground/50">Lengte</p>
                <p className="text-lg font-heading font-bold">{profile.height ?? "-"}</p>
              </div>
              <div className="card-surface rounded-luxury p-3 text-center">
                <p className="text-xs uppercase tracking-wide text-foreground/50">Cup</p>
                <p className="text-lg font-heading font-bold">{profile.cupSize ?? "-"}</p>
              </div>
            </div>

            {profile.services?.length ? (
              <div className="mb-6">
                <p className="mb-2 text-sm uppercase tracking-wide text-foreground/50">
                  Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service) => (
                    <span
                      key={service}
                      className="card-surface rounded-full px-3 py-1.5 text-sm text-foreground/80"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary rounded-luxury px-6 py-3 font-bold text-background">
                Direct Contact
              </Link>
              <Link
                href="/escorts"
                className="inline-flex items-center rounded-luxury border border-white/20 bg-surface/40 px-5 py-3 text-foreground/90 transition hover:border-primary/40"
              >
                Terug naar overzicht
              </Link>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        title={`Over ${profile.name}`}
        description="Dit profiel is onderdeel van onze landelijke selectie. Zoek je specifiek op escort amsterdam of escort service amsterdam? Gebruik het overzicht en filters om direct passende profielen te vinden."
      >
        <p className="max-w-3xl text-foreground/70">
          We werken met duidelijke communicatie, actuele beschikbaarheid en discreet contact.
          Voor elke aanvraag kijken we naar jouw voorkeuren, timing en locatie zodat je snel
          een passende match krijgt. Dit profiel kan in meerdere regio&apos;s geboekt worden,
          afhankelijk van beschikbaarheid en planning.
        </p>
      </PageSection>

      <PageSection title="Vergelijkbare profielen">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {relatedProfiles.map((item) => (
            <ProfileCard key={item.slug} {...item} />
          ))}
        </div>
      </PageSection>

      <PageSection size="sm">
        <FAQ
          eyebrow="Veelgestelde vragen"
          title="Boeken & beschikbaarheid"
          items={homeFaqs.slice(0, 4)}
        />
      </PageSection>

      <PageSection size="sm">
        <CTASection />
      </PageSection>
    </PageLayout>
  );
}

