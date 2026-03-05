import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileHero } from "../../components/domain/profile-hero";
import { CTASection } from "../../components/domain/cta-section";
import { ProfileCard } from "../../components/domain/profile-card";
import { FAQ } from "../../components/domain/faq";
import { PageLayout, PageSection } from "../../components/layout/page-layout";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../../components/ui/scroll-reveal";
import {
  getAllProfileSlugs,
  getProfileBySlug,
  getProfiles,
  getStrapiImageFormat,
  profilesToCardProps,
  formatCupSize,
  formatHeight,
} from "@/lib/api";
import { homeFaqs } from "@/lib/data/mock-data";
import type { Profile } from "@/lib/types/profile";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

function prettifyValue(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const serviceLabelNlMap: Record<string, string> = {
  "girlfriend-experience": "Girlfriend experience",
  "erotic-massage": "Erotische massage",
  "oral-sex": "Orale seks",
  "oral-sex-service": "Orale seks",
  overnight: "Overnachting",
  "overnight-escort": "Overnachting",
  "threesome-with-man": "Trio met man",
  "threesome-with-woman": "Trio met vrouw",
  "threesome-with-couple": "Trio met koppel",
  nightlife: "Uitgaan",
  "going-out": "Uitgaan",
  "dinner-date": "Dinnerdate",
  dinnerdate: "Dinnerdate",
  "hotel-service": "Hotelservice",
  "hotel-escort": "Hotelservice",
  "travel-companion": "Reisgezelschap",
  bdsm: "BDSM",
  "sm-role-play": "SM rollenspel",
  "sm-roleplay": "SM rollenspel",
  "golden-shower": "Gouden douche",
  kissing: "Zoenen",
  "escort-service": "Escortservice",
};

function normalizeServiceKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function serviceLabelToDutch(value: string): string {
  const key = normalizeServiceKey(value);
  return serviceLabelNlMap[key] || prettifyValue(value);
}

function mapProfileImages(profile: Profile): { url: string; alt: string }[] {
  return profile.photos.map((photo, index) => ({
    url: getStrapiImageFormat(photo, "large"),
    alt: photo.alternativeText || `${profile.name} foto ${index + 1}`,
  }));
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllProfileSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Escort Profiel Niet Gevonden | Desire Escorts",
    };
  }

  return {
    title:
      profile.seo?.metaTitle ||
      `${profile.name} | Escort Profiel Nederland | Desire Escorts`,
    description:
      profile.seo?.metaDescription ||
      `${profile.name} bekijken? Bekijk profiel, beschikbaarheid en services. Discreet boeken via Desire Escorts.`,
    alternates: {
      canonical: `https://desire-escorts.nl/escort/${profile.slug}`,
    },
  };
}

export default async function EscortDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const allProfiles = await getProfiles();
  const relatedProfiles = profilesToCardProps(
    allProfiles.filter((item) => item.slug !== profile.slug).slice(0, 4)
  );

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Escorts", href: "/escorts" },
        { label: profile.name },
      ]}
    >
      <PageSection size="sm">
        <ScrollReveal>
          <ProfileHero
            name={profile.name}
            tagline={profile.shortBio}
            description={profile.bio}
            images={mapProfileImages(profile)}
            isVerified={profile.verified}
            isAvailable={profile.isAvailable}
            age={profile.age}
            height={formatHeight(profile.height)}
            cupSize={formatCupSize(profile.cupSize)}
            posture={profile.postuur}
            eyeColor={profile.oogKleur}
            hairColor={profile.haarKleur}
            sexuality={profile.geaardheid}
            languages={profile.languages.map(prettifyValue)}
            services={profile.services.map(serviceLabelToDutch)}
            whatsapp={profile.contact?.whatsapp}
          />
        </ScrollReveal>
      </PageSection>

      <PageSection title="Vergelijkbare profielen">
        <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4" staggerDelay={0.07}>
          {relatedProfiles.map((item) => (
            <StaggerItem key={item.slug}>
              <ProfileCard {...item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.08}>
          <FAQ
            eyebrow="Veelgestelde vragen"
            title="Boeken & beschikbaarheid"
            items={homeFaqs.slice(0, 4)}
          />
        </ScrollReveal>
      </PageSection>

      <PageSection size="sm">
        <ScrollReveal delay={0.12}>
          <CTASection />
        </ScrollReveal>
      </PageSection>
    </PageLayout>
  );
}

