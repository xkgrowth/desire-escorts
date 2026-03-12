import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeEuro,
  Clock3,
  Sparkles,
  Users,
} from "lucide-react";
import { CTASection } from "../components/domain/cta-section";
import { FAQ } from "../components/domain/faq";
import { HowToSteps } from "../components/domain/how-to-steps";
import { ProfileCard } from "../components/domain/profile-card";
import { ServiceCard } from "../components/domain/service-card";
import { TemplateHeroGlass } from "../components/domain/template-hero-glass";
import { PageLayout, PageSection } from "../components/layout/page-layout";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../components/ui/scroll-reveal";
import { getProfiles, profileToCardProps } from "@/lib/api";
import {
  allServices,
  allTypes,
  featuredService,
  servicesFaq,
} from "@/lib/data/services-types";

export const metadata: Metadata = {
  title: "Escort Services & Types | Vanaf €160 | Desire Escorts",
  description:
    "Ontdek ons complete aanbod escort services en types. Van hotel escort tot erotische massage, van blonde tot Aziatische escorts. Vanaf €160, 24/7 beschikbaar.",
  alternates: {
    canonical: "https://desire-escorts.nl/services",
    languages: {
      "nl-NL": "https://desire-escorts.nl/services",
      "en-US": "https://desire-escorts.nl/en/services",
    },
  },
};

const bookingSteps = [
  {
    title: "Kies een service of type",
    description:
      "Bekijk ons aanbod en bepaal wat je zoekt: een specifieke service zoals massage of GFE, of een bepaald type escort.",
  },
  {
    title: "Selecteer een escort",
    description:
      "Filter op beschikbaarheid en voorkeuren. Bekijk profielen met echte foto's en kies jouw match.",
  },
  {
    title: "Boek je afspraak",
    description:
      "Neem contact op via WhatsApp, chat of telefoon. We bevestigen binnen minuten en regelen de rest.",
  },
];

export default async function ServicesOverviewPage() {
  const profiles = await getProfiles();
  const featuredProfiles = profiles.slice(0, 5);

  const servicesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Escort Services",
    numberOfItems: allServices.length,
    itemListElement: allServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.label,
        description: service.description,
        url: `https://desire-escorts.nl/${service.slug}`,
      },
    })),
  };

  const typesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Escort Types",
    numberOfItems: allTypes.length,
    itemListElement: allTypes.map((type, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: type.label,
        description: type.description,
        url: `https://desire-escorts.nl/${type.slug}`,
      },
    })),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(typesListSchema) }}
      />

      {/* Hero */}
      <PageSection size="sm" className="pb-0">
        <ScrollReveal>
          <TemplateHeroGlass
            breadcrumbs={[{ label: "Services & Types" }]}
            title="Escort Services & Types"
            description="Op zoek naar iets specifieks? Ontdek ons complete overzicht van services en escort types. Van intieme avonden tot zakelijk gezelschap, van blonde tot Aziatische escorts."
            uspItems={[
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Breed aanbod",
              },
              {
                icon: <BadgeEuro className="h-5 w-5" />,
                title: "Vanaf €160",
              },
              {
                icon: <Clock3 className="h-5 w-5" />,
                title: "24/7 beschikbaar",
              },
            ]}
          />
        </ScrollReveal>
      </PageSection>

      {/* All Services Grid */}
      <PageSection size="sm">
        <ScrollReveal delay={0.05}>
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Alle Escort Services
            </h2>
            <p className="mt-2 max-w-3xl text-foreground/70">
              Kies de service die past bij jouw wensen. Van een intieme avond tot
              gezelschap voor een diner of zakelijke gelegenheid — er is altijd
              iets dat aansluit.
            </p>
          </div>

          <StaggerContainer
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
            staggerDelay={0.03}
          >
            {allServices.map((service) => (
              <StaggerItem key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className="group flex h-full items-center gap-3 rounded-luxury border border-white/10 bg-surface/40 p-4 transition-all hover:border-primary/30 hover:bg-surface/60"
                >
                  <span className="flex-1 font-medium text-foreground group-hover:text-primary transition-colors">
                    {service.label}
                  </span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </PageSection>

      {/* Featured Service: Hotel Escort */}
      <PageSection size="sm">
        <ScrollReveal delay={0.08}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <span className="text-sm font-medium uppercase tracking-wider text-primary">
                Populair
              </span>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                Onze Hotel Escort Service
              </h2>
              <p className="mt-4 text-foreground/70">
                De hotel escort service van Desire Escorts is een van onze meest
                populaire diensten en dat is niet zonder reden. Met onze sexy en
                discrete escortdames beleven klanten een onvergetelijke avond vol
                plezier en sensatie, terwijl er altijd zorg wordt gedragen voor
                jouw privacy. Onze escorts verschijnen netjes op jouw hotelkamer
                zonder zich bij de receptie te hoeven melden, zodat je ervaring
                onopgemerkt blijft.
              </p>
              <p className="mt-3 text-foreground/70">
                Of je nu in Amsterdam bent of in een andere regio van Nederland,
                wij kunnen je gezelschap bieden. Onze prijzen zijn vriendelijk,
                beginnend vanaf €160.
              </p>
              <Link
                href={`/${featuredService.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-luxury bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90"
              >
                Meer over Hotel Escort
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-luxury">
                <Image
                  src="https://desire-escorts.nl/wp-content/uploads/home-hotel-escort-scaled.jpg.avif"
                  alt="Brunette escort in een hotel met roze lingerie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                  Discreet & direct naar jouw hotelkamer
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </PageSection>

      {/* All Types Grid */}
      <PageSection size="sm">
        <ScrollReveal delay={0.1}>
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Alle Types Escorts
            </h2>
            <p className="mt-2 max-w-3xl text-foreground/70">
              Of je nu op zoek bent naar een blonde, brunette, Aziatische of
              Nederlandse escort — ons uitgebreide aanbod zorgt ervoor dat er
              altijd iemand is die bij jou past.
            </p>
          </div>

          <StaggerContainer
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
            staggerDelay={0.03}
          >
            {allTypes.map((type) => (
              <StaggerItem key={type.slug}>
                <Link
                  href={`/${type.slug}`}
                  className="group flex h-full items-center gap-3 rounded-luxury border border-white/10 bg-surface/40 p-4 transition-all hover:border-primary/30 hover:bg-surface/60"
                >
                  <Users className="h-5 w-5 flex-shrink-0 text-primary/60" />
                  <span className="flex-1 font-medium text-foreground group-hover:text-primary transition-colors">
                    {type.label}
                  </span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </PageSection>

      {/* Escort Preview Grid */}
      <PageSection size="sm">
        <ScrollReveal delay={0.12}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Ontmoet Onze Escorts
              </h2>
              <p className="mt-2 text-foreground/70">
                Een selectie van onze beschikbare escorts. Klik voor meer details.
              </p>
            </div>
            <Link
              href="/escorts"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Bekijk alle escorts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <StaggerContainer
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-5"
            staggerDelay={0.05}
          >
            {featuredProfiles.map((profile) => (
              <StaggerItem key={profile.id}>
                <ProfileCard {...profileToCardProps(profile)} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </PageSection>

      {/* How Booking Works */}
      <PageSection size="sm">
        <ScrollReveal delay={0.14}>
          <HowToSteps
            eyebrow="Zo werkt het"
            title="In 3 stappen geboekt"
            steps={bookingSteps}
            variant="numbered"
          />
        </ScrollReveal>
      </PageSection>

      {/* CTA Section (moved above FAQ) */}
      <PageSection size="sm">
        <ScrollReveal delay={0.16}>
          <CTASection
            eyebrow="Iets speciaals in gedachten?"
            title="Neem contact op voor maatwerk"
            description="Staat jouw wens er niet tussen? Ons team denkt graag met je mee voor een op maat gemaakte ervaring."
          />
        </ScrollReveal>
      </PageSection>

      {/* FAQ Section */}
      <PageSection size="sm">
        <ScrollReveal delay={0.18}>
          <FAQ
            eyebrow="Veelgestelde vragen"
            title="Over services & types"
            items={servicesFaq}
          />
        </ScrollReveal>
      </PageSection>
    </PageLayout>
  );
}
