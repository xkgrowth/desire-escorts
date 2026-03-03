import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle, Clock, Star, Heart } from "lucide-react";
import { HomepageHero } from "./components/domain/homepage-hero";
import { ProfileCard } from "./components/domain/profile-card";
import { USPBar } from "./components/domain/usp-bar";
import { FAQ } from "./components/domain/faq";
import { CTASection } from "./components/domain/cta-section";
import { PageWrapper, Section, Container, Grid } from "./components/ui/page-wrapper";
import { GradientTitle } from "./components/ui/gradient-title";
import { ServiceCard } from "./components/domain/service-card";
import { mockHeroProfiles, mockEscortGrid, homeFaqs, topCities } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "Escort Service Nederland | Desire Escorts",
  description: "Escort service in Nederland. Ontdek geverifieerde profielen, live beschikbaarheid en boek discreet. Actief in Amsterdam, Rotterdam, Den Haag en meer.",
  alternates: {
    canonical: "https://desire-escorts.nl",
    languages: {
      "nl-NL": "https://desire-escorts.nl",
      "en-US": "https://desire-escorts.nl/en",
    },
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AdultEntertainment",
    "name": "Desire Escorts",
    "url": "https://desire-escorts.nl",
    "logo": "https://desire-escorts.nl/brand/logo.svg",
    "description": "Escort service in Nederland met geverifieerde dames",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 52.3676,
        "longitude": 4.9041
      },
      "geoRadius": 150000
    },
    "priceRange": "€€€"
  };

  const usps = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Heel Nederland",
      description: "Service in elke regio",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Scherpe Tarieven",
      description: "Vanaf €160 all-in",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "20 Jaar Ervaring",
      description: "Betrouwbaar & discreet",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Snelle Service",
      description: "Binnen 1 uur mogelijk",
    },
  ];

  return (
    <PageWrapper withGradient={true}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section (Full Bleed) */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <HomepageHero profiles={mockHeroProfiles} />
      </div>

      {/* 2. Escort Preview Grid */}
      <Section size="md">
        <Container>
          <div className="mb-6">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
              Selectie
            </span>
            <GradientTitle as="h2" size="lg">
              Beschikbare Escorts
            </GradientTitle>
          </div>

          <Grid cols={4} className="mb-8">
            {mockEscortGrid.map((profile) => (
              <ProfileCard key={profile.slug} {...profile} />
            ))}
          </Grid>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/escorts"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-background transition-all hover:scale-105"
            >
              Bekijk Alle Escorts
            </Link>
            <Link 
              href="/escorts" 
              className="group flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-medium text-sm"
            >
              Bekijk alle profielen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* 3. Why Choose Us (Condensed) */}
      <Section glow="mid" className="bg-surface/30 border-y border-white/5">
        <Container>
          <USPBar 
            eyebrow="Waarom Desire"
            title="Betrouwbaar & Discreet"
            items={usps}
            variant="horizontal"
          />
        </Container>
      </Section>

      {/* 4. Services Overview */}
      <Section size="lg">
        <Container>
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Diensten
            </span>
            <GradientTitle as="h2" size="lg" className="mb-4">
              Onze Escort Services
            </GradientTitle>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Van ontspannende massages tot een complete Girlfriend Experience.
              Ontdek onze veelzijdige services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              title="Girlfriend Experience" 
              description="De ultieme date-ervaring met warmte, intimiteit en oprechte connectie, net als met een echte vriendin."
              href="/services/gfe-escorts"
              icon={<Heart className="w-6 h-6" />}
            />
            <ServiceCard 
              title="Erotische Massage" 
              description="Laat je verwennen met een sensuele massage. Ontspanning en opwinding komen samen."
              href="/services/erotische-massage"
              icon={<Star className="w-6 h-6" />}
            />
            <ServiceCard 
              title="Hotel Service" 
              description="Discreet bezoek aan jouw hotelkamer. Wij komen naar alle hotels in Nederland."
              href="/services/hotel-escort"
              icon={<MapPin className="w-6 h-6" />}
            />
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/services" 
              className="text-sm text-foreground/60 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
            >
              Bekijk alle services →
            </Link>
          </div>
        </Container>
      </Section>

      {/* 5. Direct Contact CTA */}
      <Section size="lg">
        <Container>
          <CTASection />
        </Container>
      </Section>

      {/* 6. Service Areas / Locaties */}
      <Section size="lg" className="bg-surface/10">
        <Container>
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Locaties
            </span>
            <GradientTitle as="h2" size="lg" className="mb-4">
              Actief in heel Nederland
            </GradientTitle>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Onze escorts zijn beschikbaar in alle grote steden en regio&apos;s.
              Met snelle responstijden in de Randstad.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCities.map((city) => (
              <Link 
                key={city.name} 
                href={city.href}
                className="group flex flex-col items-center justify-center p-6 rounded-luxury bg-surface/50 border border-white/5 hover:border-primary/30 hover:bg-surface transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 7. FAQ */}
      <Section className="border-t border-white/5">
        <Container size="sm">
          <FAQ 
            eyebrow="Veelgestelde Vragen"
            title="Goed om te weten"
            items={homeFaqs}
            variant="default"
          />
          <div className="mt-8 text-center">
            <Link 
              href="/faq" 
              className="text-sm text-foreground/60 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
            >
              Bekijk alle veelgestelde vragen →
            </Link>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
