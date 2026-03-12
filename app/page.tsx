import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  CheckCircle,
  Clock,
  Star,
  Heart,
  MessageCircle,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { HomepageHero } from "./components/domain/homepage-hero";
import { ProfileCard } from "./components/domain/profile-card";
import { FAQ } from "./components/domain/faq";
import { CTASection } from "./components/domain/cta-section";
import { PageWrapper, Section, Container, Grid } from "./components/ui/page-wrapper";
import { GradientTitle } from "./components/ui/gradient-title";
import { ServiceCard } from "./components/domain/service-card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./components/ui/scroll-reveal";
import { getProfiles, profileToCardProps, getProfileImageUrl } from "@/lib/api";
import { homeFaqs, topCities } from "@/lib/data/mock-data";

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

export default async function Home() {
  // Fetch real profiles from Strapi
  const allProfiles = await getProfiles();
  const availableProfilesCount = allProfiles.filter((p) => p.isAvailable).length;
  
  // Map profiles for hero section (available profiles with images)
  const heroProfiles = allProfiles
    .filter((p) => p.isAvailable && p.photos.length > 0)
    .slice(0, 9)
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      imageUrl: getProfileImageUrl(p.photos, "medium"),
      tagline: p.shortBio,
      isVerified: p.verified,
      isAvailable: p.isAvailable,
      rankScore: p.sortOrder ? 100 - p.sortOrder : 50,
    }));

  // Map profiles for grid section (top 8)
  const gridProfiles = allProfiles
    .filter((p) => p.isAvailable)
    .slice(0, 8);
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
      icon: <MapPin className="h-4 w-4" />,
      title: "Heel Nederland",
    },
    {
      icon: <Star className="h-4 w-4" />,
      title: "Scherpe Tarieven",
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      title: "20 Jaar Ervaring",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Snelle Service",
    },
  ];

  const bookingSteps = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "1. Deel je wensen",
      description:
        "Vertel ons via chat of telefoon wat je zoekt: locatie, tijdstip en voorkeuren.",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "2. Kies je match",
      description:
        "Je ontvangt direct passende, geverifieerde profielen met actuele beschikbaarheid.",
    },
    {
      icon: <PhoneCall className="w-5 h-5" />,
      title: "3. Boek discreet",
      description:
        "We bevestigen snel en zorgen voor een duidelijke, discrete afhandeling.",
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
        <ScrollReveal animation="fade" duration={0.7}>
          <HomepageHero
            profiles={heroProfiles}
            availableCount={availableProfilesCount}
            usps={usps}
          />
        </ScrollReveal>
      </div>

      {/* 2. Escort Preview Grid */}
      <Section
        size="sm"
        className="bg-surface/5"
      >
        <Container size="2xl">
          <ScrollReveal delay={0.05}>
            <div className="rounded-luxury border border-white/10 bg-surface/25 shadow-[0_12px_28px_rgba(0,0,0,0.18)] p-4 md:p-6">
            <div className="mb-6">
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
                SELECTIE VAN
              </span>
              <GradientTitle as="h2" size="lg">
                {availableProfilesCount} Beschikbare Escorts
              </GradientTitle>
            </div>

            <StaggerContainer className="mb-8">
              <Grid cols={4}>
                {gridProfiles.map((profile) => (
                  <StaggerItem key={profile.slug}>
                    <ProfileCard {...profileToCardProps(profile)} />
                  </StaggerItem>
                ))}
              </Grid>
            </StaggerContainer>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/escorts"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-luxury font-bold text-background transition-all hover:scale-105"
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
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 3. Intro / Context Block */}
      <Section size="md">
        <Container size="2xl">
          <ScrollReveal delay={0.06}>
            <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
                Escort Service Nederland
              </span>
              <GradientTitle as="h2" size="lg" className="mb-4">
                Persoonlijke service met echte aandacht
              </GradientTitle>
              <p className="text-foreground/70 mb-4">
                Desire Escorts is actief door heel Nederland en helpt je snel aan een
                passende match. Of je nu zoekt naar gezelschap voor een avond uit,
                een hotelafspraak of een rustige privé-setting: we werken discreet,
                duidelijk en zonder onnodige stappen.
              </p>
              <p className="text-foreground/70">
                Ook voor zoekopdrachten zoals{" "}
                <Link href="/escort-amsterdam" className="text-primary hover:underline">
                  escort Amsterdam
                </Link>{" "}
                bieden we een duidelijke route. Ook bezoekers die zoeken op escorts
                amsterdam of amsterdam escorts kunnen direct profielen bekijken, snel
                contact leggen en gericht boeken op basis van beschikbaarheid.
              </p>
            </div>
            <div className="rounded-luxury border border-white/10 bg-surface/40 p-6 md:p-8">
              <h3 className="font-heading text-2xl font-bold mb-4">
                Waarom bezoekers ons vertrouwen
              </h3>
              <p className="mb-4 text-foreground/70">
                Vanaf het eerste contact houden we het helder en discreet. Je ziet direct
                wie beschikbaar is, krijgt snel bevestiging en weet vooraf waar je aan toe bent.
              </p>
              <ul className="space-y-3 text-foreground/75">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Live overzicht van geverifieerde profielen en actuele beschikbaarheid</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Discreet contact en duidelijke afhandeling, zonder onnodige stappen</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Snelle opvolging in heel Nederland, met focus op Randstad en grote steden</span>
                </li>
              </ul>
            </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 4. Services Overview */}
      <Section size="lg">
        <Container size="2xl">
          <ScrollReveal delay={0.08}>
            <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Diensten
            </span>
            <GradientTitle as="h2" size="lg" className="mb-4">
              Onze Escort Services
            </GradientTitle>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Van ontspannende massages, escort massage en massage escort tot een complete Girlfriend Experience.
              Ontdek onze veelzijdige services.
            </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            <StaggerItem>
              <ServiceCard 
                title="Girlfriend Experience" 
                description="De ultieme date-ervaring met warmte, intimiteit en oprechte connectie, net als met een echte vriendin."
                href="/services/gfe-escorts"
                icon={<Heart className="w-6 h-6" />}
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard 
                title="Erotische Massage" 
                description="Laat je verwennen met een sensuele massage. Ontspanning en opwinding komen samen."
                href="/services/erotische-massage"
                icon={<Star className="w-6 h-6" />}
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard 
                title="Hotel Service" 
                description="Discreet bezoek aan jouw hotelkamer. Wij komen naar alle hotels in Nederland."
                href="/services/hotel-escort"
                icon={<MapPin className="w-6 h-6" />}
              />
            </StaggerItem>
          </StaggerContainer>
          
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

      {/* 5. Hoe Werkt Boeken */}
      <Section size="md">
        <Container size="2xl">
          <ScrollReveal delay={0.08}>
            <div className="mb-8 text-center">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
              Snel geregeld
            </span>
            <GradientTitle as="h2" size="lg">
              Hoe werkt boeken?
            </GradientTitle>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid gap-4 md:grid-cols-3" staggerDelay={0.08}>
            {bookingSteps.map((step) => (
              <StaggerItem key={step.title}>
                <div className="rounded-luxury border border-white/10 bg-surface/40 p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-foreground/70">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* 6. Direct Contact CTA */}
      <Section size="lg">
        <Container size="2xl">
          <ScrollReveal delay={0.1}>
            <CTASection />
          </ScrollReveal>
        </Container>
      </Section>

      {/* 7. Service Areas / Locaties */}
      <Section size="lg" className="bg-surface/10">
        <Container size="2xl">
          <ScrollReveal delay={0.08}>
            <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              Locaties
            </span>
            <GradientTitle as="h2" size="lg" className="mb-4">
              Actief in heel Nederland
            </GradientTitle>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              We werken landelijk: niet per stad met vaste bezetting, maar met
              flexibele beschikbaarheid door heel Nederland. Voor escort Amsterdam
              en andere grote steden zijn responstijden vaak het snelst.
            </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.06}>
            {topCities.slice(0, 6).map((city) => (
              <StaggerItem key={city.name}>
                <Link 
                  href={city.href}
                  className="group card-interactive rounded-luxury p-6 flex flex-col items-center justify-center transition-shadow duration-300 hover:shadow-glow"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {city.name}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.1}>
            <div className="mt-8 text-center">
              <p className="text-sm text-foreground/60">
                Zoek je een specifieke plaats? Bekijk dan alle gebieden op de{" "}
                <Link href="/escort-in-nederland" className="text-primary hover:underline">
                  locatie-overzichtspagina
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 8. Vertrouwen & Discretie */}
      <Section size="md">
        <Container size="2xl">
          <ScrollReveal delay={0.09}>
            <div className="rounded-luxury border border-white/10 bg-surface/30 p-6 md:p-10">
              <div className="mb-6">
                <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
                  Vertrouwen
                </span>
                <GradientTitle as="h2" size="lg">
                  Discreet, duidelijk en professioneel
                </GradientTitle>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-foreground/70 mb-4">
                    Bij Desire Escorts staat privacy centraal. We delen geen onnodige
                    gegevens, communiceren helder over het proces en houden afspraken
                    strak en professioneel.
                  </p>
                  <p className="text-foreground/70">
                    Voor zowel nieuwe als terugkerende bezoekers betekent dit: minder
                    onzekerheid, sneller schakelen en een betrouwbare ervaring van
                    aanvraag tot bevestiging.
                  </p>
                </div>
                <ul className="space-y-3 text-foreground/75">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>Duidelijke intake en begeleiding bij elke aanvraag</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>Discreet contact via chat en telefoon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>Heldere prijscommunicatie en verwachtingen vooraf</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>Nationwide service met snelle opvolging</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 9. FAQ */}
      <Section className="border-t border-white/5">
        <Container size="2xl">
          <ScrollReveal delay={0.11}>
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
          </ScrollReveal>
        </Container>
      </Section>

      {/* 10. Kennisbank Links */}
      <Section size="sm">
        <Container size="2xl">
          <ScrollReveal delay={0.1}>
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">
                Lees verder
              </span>
              <GradientTitle as="h2" size="md">
                Meer informatie voor een goede voorbereiding
              </GradientTitle>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid gap-3 md:grid-cols-3" staggerDelay={0.08}>
            <StaggerItem>
              <Link
                href="/kennisbank/boeken-reserveringen/"
                className="card-interactive block h-full rounded-luxury p-5 text-left transition-shadow duration-300 hover:shadow-glow"
              >
                <p className="font-heading font-semibold mb-1">Boeken & reserveren</p>
                <p className="text-sm text-foreground/65">Alles over beschikbaarheid, timing en aanvraagproces.</p>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link
                href="/kennisbank/discretie-privacy/"
                className="card-interactive block h-full rounded-luxury p-5 text-left transition-shadow duration-300 hover:shadow-glow"
              >
                <p className="font-heading font-semibold mb-1">Discretie & privacy</p>
                <p className="text-sm text-foreground/65">Hoe wij omgaan met vertrouwelijkheid en gegevensbescherming.</p>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link
                href="/blog"
                className="card-interactive block h-full rounded-luxury p-5 text-left transition-shadow duration-300 hover:shadow-glow"
              >
                <p className="font-heading font-semibold mb-1">Nieuws & inzichten</p>
                <p className="text-sm text-foreground/65">Praktische tips en updates uit onze kennisbank en blog.</p>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </Section>
    </PageWrapper>
  );
}
