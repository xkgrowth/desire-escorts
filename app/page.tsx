import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Euro,
  MapPin,
  CheckCircle,
  Clock,
  Heart,
  HandHeart,
  ShieldCheck,
} from "lucide-react";
import { HomepageHero } from "./components/domain/homepage-hero";
import { ProfileCard } from "./components/domain/profile-card";
import { FAQ } from "./components/domain/faq";
import { CTASection } from "./components/domain/cta-section";
import { HowToSteps } from "./components/domain/how-to-steps";
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Desire Escorts",
    url: "https://desire-escorts.nl",
    logo: "https://desire-escorts.nl/brand/logo.svg",
    description:
      "Escort service in Nederland met geverifieerde profielen en discrete booking.",
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Desire Escorts",
    url: "https://desire-escorts.nl",
    description: "High-class escort service in Nederland.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 52.3676,
        longitude: 4.9041,
      },
      geoRadius: 150000,
    },
    priceRange: "€€€",
  };

  const usps = [
    {
      icon: <MapPin className="h-4 w-4" />,
      title: "Service in heel Nederland",
    },
    {
      icon: <Euro className="h-4 w-4" />,
      title: "Tarieven vanaf €160",
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      title: "20 jaar ervaring",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Snelle service",
    },
    {
      icon: <Camera className="h-4 w-4" />,
      title: "Echte foto's",
    },
  ];

  const bookingSteps = [
    {
      title: "Kies jouw escort of service",
      description:
        "Bekijk beschikbare profielen en kies wat past bij je voorkeur: type escort, service en gewenste sfeer.",
    },
    {
      title: "Bepaal waar en wanneer",
      description:
        "Geef je stad, locatie en gewenste tijd door. We stemmen beschikbaarheid direct af en plannen een discreet tijdslot.",
    },
    {
      title: "Bevestig je aanvraag",
      description:
        "Neem contact op via live chat, WhatsApp of telefoon. Je krijgt snel duidelijkheid over mogelijkheden en totaalprijs vooraf.",
    },
    {
      title: "Discreet ontvangst op locatie",
      description:
        "Na bevestiging komt de escort op het afgesproken moment naar jouw locatie. Altijd met focus op privacy en rust.",
    },
    {
      title: "Betalen op een manier die bij je past",
      description:
        "Je rekent vooraf de service af via een passende betaalmethode. We bieden meerdere veilige en praktische opties.",
    },
    {
      title: "Ontspan en geniet",
      description:
        "Als alles geregeld is, kun je volledig ontspannen. Wij zorgen dat het traject van aanvraag tot afspraak duidelijk en professioneel blijft.",
    },
  ];

  const liveCityPages = new Set(["/escort-haarlem", "/escort-amstelveen"]);

  return (
    <PageWrapper withGradient={true}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* 1. Hero Section (Full Bleed) */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <ScrollReveal animation="fade" duration={0.7}>
          <HomepageHero
            profiles={heroProfiles}
            availableCount={availableProfilesCount}
          />
        </ScrollReveal>
      </div>

      {/* 2. Above-the-fold USP strip */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 border-y border-white/10 bg-surface/30">
        <Container size="2xl">
          <StaggerContainer
            className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:divide-y-0 lg:divide-x lg:divide-white/10"
            staggerDelay={0.08}
          >
            {usps.map((usp) => (
              <StaggerItem key={usp.title} animation="fade-up">
                <div className="flex min-h-[64px] items-center justify-center gap-2 px-3 py-3 text-center">
                  <span className="shrink-0 text-primary">{usp.icon}</span>
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground/85">
                    {usp.title}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </div>

      {/* 3. Escort Preview Grid */}
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
                href="/alle-escorts"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-luxury font-bold text-background transition-all hover:scale-105"
              >
                Bekijk Alle Escorts
              </Link>
              <Link
                href="/alle-escorts"
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

      {/* 4. Intro / Context Block */}
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

      {/* 5. Services Overview */}
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
                href="/gfe-escorts"
                icon={<Heart className="w-6 h-6" />}
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard 
                title="Erotische Massage" 
                description="Laat je verwennen met een sensuele massage. Ontspanning en opwinding komen samen."
                href="/erotische-massage"
                icon={<HandHeart className="w-6 h-6" />}
              />
            </StaggerItem>
            <StaggerItem>
              <ServiceCard 
                title="Hotel Service" 
                description="Discreet bezoek aan jouw hotelkamer. Wij komen naar alle hotels in Nederland."
                href="/hotel-escort"
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

      {/* 6. Hoe Werkt Boeken */}
      <Section size="md">
        <Container size="2xl">
          <ScrollReveal delay={0.08}>
            <HowToSteps
              eyebrow="Stap voor stap"
              title="In 6 stappen jouw afspraak geregeld"
              steps={bookingSteps}
              variant="responsive-timeline"
            />
            <div className="mt-8 flex items-center justify-center">
              <Link
                href="/escort-bestellen"
                className="inline-flex items-center gap-2 rounded-luxury bg-primary px-6 py-3 font-heading font-bold text-background transition-colors hover:bg-primary/90"
              >
                Hoe het Werkt
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 7. Direct Contact CTA */}
      <Section size="lg">
        <Container size="2xl">
          <ScrollReveal delay={0.1}>
            <CTASection />
          </ScrollReveal>
        </Container>
      </Section>

      {/* 8. Service Areas / Locaties */}
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
                  href={liveCityPages.has(city.href) ? city.href : "/escort-in-nederland"}
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

      {/* 9. Vertrouwen & Discretie */}
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

      {/* 10. FAQ */}
      <Section className="border-t border-white/5">
        <Container size="2xl">
          <ScrollReveal delay={0.11}>
            <FAQ 
              eyebrow="Veelgestelde Vragen"
              title="Goed om te weten"
              items={homeFaqs.slice(0, 4)}
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

      {/* 11. Kennisbank Links */}
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
