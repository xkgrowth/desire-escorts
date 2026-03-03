import { GradientTitle } from "../components/ui/gradient-title";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { WhatsAppIcon } from "../components/ui/whatsapp-icon";
import { ShinyHeart, StaticHeart } from "../components/shiny-heart";
import { DesireLogoAnimated, DesireLogoStatic } from "../components/desire-logo";
import { PageWrapper, Section as PageSection, Container } from "../components/ui/page-wrapper";
import { Card as UICard, CardHeader, CardContent } from "../components/ui/card";
import { USPBar, TrustBadges, StatsRow } from "../components/domain/usp-bar";
import { CTASection, CTABanner } from "../components/domain/cta-section";
import { TextBlock } from "../components/domain/text-block";
import { ServiceCard } from "../components/domain/service-card";
import { TestimonialCard } from "../components/domain/testimonial-card";
import { FAQ } from "../components/domain/faq";
import { HowToSteps } from "../components/domain/how-to-steps";
import { Footer } from "../components/layout/footer";
import { Separator, GoldSeparator } from "../components/ui/separator";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { Suspense } from "react";
import { LocaleToggle } from "../components/ui/locale-toggle";
import { 
  AnimatedShowcase, 
  CardShowcase, 
  GridShowcase, 
  PageGradientShowcase,
  FormControlsShowcase,
  ProfileCardShowcase,
  TextWithImageShowcase,
  TabbedContentShowcase,
  ProfileHeroShowcase,
  HomepageHeroShowcase,
  BreadcrumbsShowcase,
  FilterBarShowcase,
  PricingTableShowcase,
  ArticleCardShowcase,
  LegalSectionShowcase,
} from "./components";
import {
  AnimatedSection,
  AnimatedSectionDivider,
  AnimatedCard,
  AnimatedColorSwatch,
  AnimatedNavPill,
  AnimatedGrid,
  AnimatedGridItem,
  AnimatedHero,
} from "./animated-sections";
import { Heart, Sparkles, Clock, Shield } from "lucide-react";

export const metadata = {
  title: "Design System | Desire Escorts",
  description: "Design system components and guidelines for Desire Escorts",
  robots: "noindex, nofollow",
};

export default function DesignSystemPage() {
  return (
    <PageWrapper withGradient={true}>
      {/* Hero */}
      <PageSection glow="hero" size="md">
        <Container>
          <AnimatedHero>
            <GradientTitle as="h1" size="xl" className="mb-4">
              Design System
            </GradientTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mb-8">
              Component library and design tokens for Desire Escorts. Premium dark
              aesthetic with warm gold luminosity.
            </p>
            
            {/* Quick Navigation */}
            <nav className="flex flex-wrap gap-3">
              <AnimatedNavPill href="#tokens" delay={0.1}>Tokens</AnimatedNavPill>
              <AnimatedNavPill href="#components" delay={0.15}>Components</AnimatedNavPill>
              <AnimatedNavPill href="#content-blocks" delay={0.2}>Content Blocks</AnimatedNavPill>
              <AnimatedNavPill href="#templates" delay={0.25}>Page Templates</AnimatedNavPill>
            </nav>
          </AnimatedHero>
        </Container>
      </PageSection>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: TOKENS
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatedSectionDivider id="tokens" title="1. Design Tokens" description="Core visual primitives that define the brand" />

      {/* Brand Assets */}
      <AnimatedSection title="Brand Assets" subtitle="Logo and favicon variants">
        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.1}>
          <AnimatedGridItem>
            <AnimatedCard title="Logo - Animated">
              <div className="flex items-center justify-center p-8 bg-background rounded-lg">
                <DesireLogoAnimated size="lg" />
              </div>
            </AnimatedCard>
          </AnimatedGridItem>
          <AnimatedGridItem>
            <AnimatedCard title="Logo - Static">
              <div className="flex items-center justify-center p-8 bg-background rounded-lg">
                <DesireLogoStatic size="lg" />
              </div>
            </AnimatedCard>
          </AnimatedGridItem>
          <AnimatedGridItem>
            <AnimatedCard title="Heart Icon - Animated">
              <div className="flex items-center justify-center gap-8 p-8 bg-background rounded-lg">
                <ShinyHeart size={48} />
                <ShinyHeart size={32} />
                <ShinyHeart size={24} />
              </div>
            </AnimatedCard>
          </AnimatedGridItem>
          <AnimatedGridItem>
            <AnimatedCard title="Heart Icon - Static">
              <div className="flex items-center justify-center gap-8 p-8 bg-background rounded-lg">
                <StaticHeart size={48} />
                <StaticHeart size={32} />
                <StaticHeart size={24} />
              </div>
            </AnimatedCard>
          </AnimatedGridItem>
        </AnimatedGrid>
      </AnimatedSection>

      {/* Colors */}
      <AnimatedSection title="Colors" subtitle="Brand and semantic color tokens">
        <AnimatedGrid className="grid grid-cols-2 md:grid-cols-5 gap-4" staggerDelay={0.05}>
          <AnimatedGridItem><AnimatedColorSwatch name="Royal Gold" color="#F7D063" token="--primary" /></AnimatedGridItem>
          <AnimatedGridItem><AnimatedColorSwatch name="Vanilla Custard" color="#F2DE9B" token="--accent" /></AnimatedGridItem>
          <AnimatedGridItem><AnimatedColorSwatch name="Carbon Black" color="#161E21" token="--background" /></AnimatedGridItem>
          <AnimatedGridItem><AnimatedColorSwatch name="Dark Olive" color="#161E21" token="--surface" /></AnimatedGridItem>
          <AnimatedGridItem><AnimatedColorSwatch name="White Smoke" color="#F5F4F3" token="--foreground" /></AnimatedGridItem>
        </AnimatedGrid>

        <h4 className="text-lg font-heading font-bold text-foreground mt-12 mb-4">
          Semantic Surface Tokens
        </h4>
        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.08}>
          <AnimatedGridItem>
            <AnimatedColorSwatch name="Interactive Surface" color="#141A1B" token="--surface-interactive" />
          </AnimatedGridItem>
          <AnimatedGridItem>
            <AnimatedColorSwatch name="Surface Muted" color="#141A1B" token="--surface-muted" />
          </AnimatedGridItem>
        </AnimatedGrid>

        <h4 className="text-lg font-heading font-bold text-foreground mt-12 mb-4">
          Gradients
        </h4>
        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
          <AnimatedGridItem>
            <div className="h-24 rounded-luxury bg-gradient-to-b from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold">Gold Gradient</span>
            </div>
          </AnimatedGridItem>
          <AnimatedGridItem>
            <div className="h-24 rounded-luxury bg-ambient-glow border border-white/10 flex items-center justify-center">
              <span className="text-foreground/60">Ambient Glow</span>
            </div>
          </AnimatedGridItem>
        </AnimatedGrid>
      </AnimatedSection>

      {/* Typography */}
      <AnimatedSection title="Typography" subtitle="Gradient titles and text styles">
        <div className="space-y-8">
          <div>
            <p className="text-sm text-muted-foreground mb-2">H1 - XL Gold</p>
            <GradientTitle as="h1" size="xl" variant="gold">
              Desire Escorts Amsterdam
            </GradientTitle>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">H2 - LG Gold</p>
            <GradientTitle as="h2" size="lg" variant="gold">
              Premium Escort Service
            </GradientTitle>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">H2 - LG Light</p>
            <GradientTitle as="h2" size="lg" variant="light">
              Premium Escort Service
            </GradientTitle>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">H3 - MD Gold</p>
            <GradientTitle as="h3" size="md" variant="gold">
              Our Services
            </GradientTitle>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Body Text</p>
            <p className="text-foreground/80 max-w-prose">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Muted Text</p>
            <p className="text-muted-foreground max-w-prose">
              Secondary text styling for less prominent content and descriptions.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Spacing & Radii */}
      <AnimatedSection title="Spacing & Radii" subtitle="Consistent spatial scale">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm font-medium text-foreground/60 uppercase tracking-wider mb-4">Spacing</h4>
            <div className="space-y-4">
              {[
                { size: "w-4 h-4", label: "4px - gap-1" },
                { size: "w-8 h-8", label: "8px - gap-2" },
                { size: "w-16 h-8", label: "16px - gap-4" },
                { size: "w-24 h-8", label: "24px - gap-6" },
                { size: "w-32 h-8", label: "32px - gap-8" },
              ].map(({ size, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`${size} bg-primary rounded`} />
                  <span className="text-sm text-foreground/60">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground/60 uppercase tracking-wider mb-4">Border Radius</h4>
            <div className="flex flex-wrap gap-4">
              {["sm", "md", "lg", "luxury", "full"].map((r) => (
                <div 
                  key={r}
                  className={`w-16 h-16 bg-surface border border-border rounded-${r} flex items-center justify-center`}
                >
                  <span className="text-xs text-foreground/60">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Page Gradients */}
      <AnimatedSection title="Page Gradients" subtitle="Warm ambient glow backgrounds">
        <PageGradientShowcase />
      </AnimatedSection>

      {/* Grid System */}
      <AnimatedSection title="Grid System" subtitle="12-column responsive layout">
        <GridShowcase />
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: COMPONENTS
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatedSectionDivider id="components" title="2. UI Components" description="Reusable interface building blocks" />

      {/* Buttons */}
      <AnimatedSection title="Buttons" subtitle="3D beveled buttons with glassy borders">
        <div className="space-y-10">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Primary (White) - Main CTAs</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="primary" size="xl">Book Now</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
              <Button variant="primary" size="md">Medium Primary</Button>
              <Button variant="primary" size="sm">Small Primary</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Premium (Gold) - Special CTAs</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="premium" size="xl">Work With Us</Button>
              <Button variant="premium" size="lg">Large Premium</Button>
              <Button variant="premium" size="md">Medium Premium</Button>
              <Button variant="premium" size="sm">Small Premium</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">WhatsApp (Green) - Contact CTAs</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="whatsapp" size="xl" className="gap-2">
                <WhatsAppIcon size={24} />
                Chat on WhatsApp
              </Button>
              <Button variant="whatsapp" size="lg" className="gap-2">
                <WhatsAppIcon size={20} />
                Large WhatsApp
              </Button>
              <Button variant="whatsapp" size="md" className="gap-2">
                <WhatsAppIcon size={16} />
                Medium WhatsApp
              </Button>
              <Button variant="whatsapp" size="sm" className="gap-2">
                <WhatsAppIcon size={14} />
                Small WhatsApp
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Secondary - Alternative CTAs</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="secondary" size="xl">XL Secondary</Button>
              <Button variant="secondary" size="lg">Large Secondary</Button>
              <Button variant="secondary" size="md">Medium Secondary</Button>
              <Button variant="secondary" size="sm">Small Secondary</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Ghost - Subtle actions</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="ghost" size="xl">XL Ghost</Button>
              <Button variant="ghost" size="lg">Large Ghost</Button>
              <Button variant="ghost" size="md">Medium Ghost</Button>
              <Button variant="ghost" size="sm">Small Ghost</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Action - Inline utilities (Favoriet, Delen)</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="action" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Favoriet
              </Button>
              <Button variant="action" size="md">
                <Sparkles className="w-4 h-4 mr-2" />
                Delen
              </Button>
              <Button variant="action" size="sm">Small Action</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Disabled States</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="primary" size="lg" disabled>Disabled Primary</Button>
              <Button variant="premium" size="lg" disabled>Disabled Premium</Button>
              <Button variant="whatsapp" size="lg" disabled className="gap-2">
                <WhatsAppIcon size={20} />
                Disabled WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Badges */}
      <AnimatedSection title="Badges" subtitle="Status and service indicators">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Status Badges</p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="verified" />
              <Badge variant="available" />
              <Badge variant="unavailable" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Service Badges</p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="service">Erotische Massage</Badge>
              <Badge variant="service">GFE</Badge>
              <Badge variant="service">Hotel Service</Badge>
              <Badge variant="default">Custom</Badge>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Cards */}
      <AnimatedSection title="Cards" subtitle="Surface and elevation styles">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UICard variant="interactive" hover>
            <CardHeader>
              <h4 className="font-heading font-bold text-foreground">Interactive Card</h4>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/60">
                Clickable card styling with dedicated interactive surface color.
              </p>
            </CardContent>
          </UICard>
          <UICard variant="elevated">
            <CardHeader>
              <h4 className="font-heading font-bold text-foreground">Elevated Card</h4>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/60">
                Elevated variant with gold-tinted border.
              </p>
            </CardContent>
          </UICard>
          <UICard variant="glass">
            <CardHeader>
              <h4 className="font-heading font-bold text-foreground">Glass Card</h4>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/60">
                Translucent glass effect with backdrop blur.
              </p>
            </CardContent>
          </UICard>
        </div>
      </AnimatedSection>

      {/* Form Controls */}
      <AnimatedSection title="Form Controls" subtitle="Input, Select, Textarea, Checkbox">
        <FormControlsShowcase />
      </AnimatedSection>

      {/* Animations */}
      <AnimatedSection title="Scroll Animations" subtitle="Reveal and stagger effects (scroll to trigger)">
        <AnimatedShowcase />
      </AnimatedSection>

      {/* Card Hover Effects */}
      <AnimatedSection title="Card Hover Effects" subtitle="Interactive card animations">
        <CardShowcase />
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: CONTENT BLOCKS
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatedSectionDivider id="content-blocks" title="3. Content Blocks" description="Domain-specific components for page composition" />

      {/* Breadcrumbs & Navigation */}
      <AnimatedSection title="Breadcrumbs" subtitle="Navigation hierarchy indicators">
        <BreadcrumbsShowcase />
      </AnimatedSection>

      {/* Locale Toggle */}
      <AnimatedSection title="Locale Toggle" subtitle="Language switching controls">
        <div className="flex items-center gap-6">
          <LocaleToggle variant="button" />
          <LocaleToggle variant="text" />
          <LocaleToggle variant="dropdown" />
        </div>
      </AnimatedSection>

      {/* Filter Bar */}
      <AnimatedSection title="Filter Bar" subtitle="Listing page filters">
        <Suspense fallback={<div className="h-20 bg-surface/30 rounded-lg animate-pulse" />}>
          <FilterBarShowcase />
        </Suspense>
      </AnimatedSection>

      {/* Separators */}
      <AnimatedSection title="Separators" subtitle="Visual dividers">
        <div className="space-y-8">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Standard Separator</p>
            <Separator />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Gold Separator (Decorative)</p>
            <GoldSeparator />
          </div>
        </div>
      </AnimatedSection>

      {/* Text Block */}
      <AnimatedSection title="Text Block" subtitle="Rich text content areas">
        <div className="space-y-12">
          <TextBlock
            eyebrow="Over Ons"
            title="Premium Escort Service sinds 2008"
            content="<p>Desire Escorts is al meer dan 15 jaar toonaangevend in de Nederlandse escort industrie. Wij bieden exclusieve, discretie begeleiding door zorgvuldig geselecteerde escorts.</p><p>Onze dames zijn niet alleen buitengewoon aantrekkelijk, maar ook intelligent, gecultiveerd en volledig toegewijd aan uw tevredenheid.</p>"
            align="left"
            maxWidth="lg"
          />
          <TextBlock
            title="Centered Text Block"
            content="<p>This is a centered text block example for hero sections or important announcements.</p>"
            align="center"
            titleVariant="light"
          />
        </div>
      </AnimatedSection>

      {/* Text with Image */}
      <AnimatedSection title="Text with Image" subtitle="Side-by-side content layout">
        <TextWithImageShowcase />
      </AnimatedSection>

      {/* Tabbed Content */}
      <AnimatedSection title="Tabbed Content" subtitle="Organized content in tabs">
        <TabbedContentShowcase />
      </AnimatedSection>

      {/* Profile Cards */}
      <AnimatedSection title="Profile Cards" subtitle="Escort listing card variants">
        <ProfileCardShowcase />
      </AnimatedSection>

      {/* Profile Hero */}
      <AnimatedSection title="Profile Hero" subtitle="Profile detail page header with gallery">
        <ProfileHeroShowcase />
      </AnimatedSection>

      {/* Homepage Hero */}
      <AnimatedSection
        title="Homepage Hero (Full Bleed)"
        subtitle="Hero layout with live-availability avatars and top-profile fold cards"
      >
        <HomepageHeroShowcase />
      </AnimatedSection>

      {/* Service Cards */}
      <AnimatedSection title="Service Cards" subtitle="Service offering displays">
        <div className="space-y-12">
          <div>
            <p className="text-sm text-muted-foreground mb-6">Default Variant</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard
                title="Erotische Massage"
                description="Ontspan en geniet van een sensuele massage door onze ervaren escorts."
                href="/services/massage"
                icon={<Sparkles className="w-6 h-6" />}
              />
              <ServiceCard
                title="Girlfriend Experience"
                description="De ultieme date-ervaring met warmte, intimiteit en oprechte connectie."
                href="/services/gfe"
                icon={<Heart className="w-6 h-6" />}
              />
              <ServiceCard
                title="24/7 Beschikbaar"
                description="Boek op elk moment van de dag of nacht, wij zijn altijd bereikbaar."
                href="/services"
                icon={<Clock className="w-6 h-6" />}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Compact Variant</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ServiceCard
                title="Duo Service"
                description="Twee escorts voor een onvergetelijke ervaring"
                href="/services/duo"
                icon={<Heart className="w-5 h-5" />}
                variant="compact"
              />
              <ServiceCard
                title="Hotel Service"
                description="Discreet bezoek aan uw hotelkamer"
                href="/services/hotel"
                icon={<Shield className="w-5 h-5" />}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonial Cards */}
      <AnimatedSection title="Testimonial Cards" subtitle="Customer reviews and quotes">
        <div className="space-y-12">
          <div>
            <p className="text-sm text-muted-foreground mb-6">Featured Testimonial</p>
            <TestimonialCard
              quote="Een uitzonderlijke ervaring van begin tot eind. Professioneel, discreet en onvergetelijk. Desire Escorts overtreft alle verwachtingen."
              author="Tevreden Klant"
              role="Amsterdam"
              rating={5}
              variant="featured"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Default Cards</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Perfecte service, zeer discreet en professioneel. Zeker voor herhaling vatbaar."
                author="John"
                rating={5}
              />
              <TestimonialCard
                quote="De communicatie was uitstekend en de date was precies wat ik zocht."
                author="Anonymous"
                rating={5}
              />
              <TestimonialCard
                quote="Top kwaliteit escorts en fantastische klantenservice."
                author="Verified Client"
                rating={4}
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* USP Bar */}
      <AnimatedSection title="USP Bar" subtitle="Unique selling proposition blocks">
        <div className="space-y-12">
          <div>
            <p className="text-sm text-muted-foreground mb-6">Cards Variant</p>
            <USPBar variant="cards" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Horizontal Variant (Compact)</p>
            <USPBar variant="horizontal" />
          </div>
        </div>
      </AnimatedSection>

      {/* Trust Badges & Stats */}
      <AnimatedSection title="Trust Badges & Stats" subtitle="Social proof elements">
        <div className="space-y-12">
          <div>
            <p className="text-sm text-muted-foreground mb-6">Trust Badges</p>
            <TrustBadges />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Stats Row</p>
            <StatsRow 
              stats={[
                { value: "500+", label: "Tevreden Klanten" },
                { value: "50+", label: "Premium Escorts" },
                { value: "24/7", label: "Beschikbaar" },
                { value: "15+", label: "Jaar Ervaring" },
              ]} 
            />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection title="CTA Section" subtitle="Call-to-action blocks">
        <div className="space-y-12">
          <CTASection />
          <div>
            <p className="text-sm text-muted-foreground mb-6">CTA Banner (Compact - Live Chat Focused)</p>
            <CTABanner />
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection title="FAQ" subtitle="Frequently asked questions accordion">
        <div className="space-y-12">
          <div>
            <p className="text-sm text-muted-foreground mb-6">Default Variant</p>
            <FAQ
              eyebrow="Veelgestelde Vragen"
              title="Alles wat je wilt weten"
              items={[
                {
                  question: "Hoe boek ik een escort?",
                  answer: "Je kunt een escort boeken via onze Live Chat, telefonisch of via WhatsApp. Onze medewerkers helpen je graag bij het maken van de perfecte keuze en beantwoorden al je vragen.",
                },
                {
                  question: "Wat zijn de betaalmethoden?",
                  answer: "Wij accepteren contant geld, iDEAL, creditcard (Visa & MasterCard), en PIN-betaling bij aankomst.",
                },
                {
                  question: "Is discretie gegarandeerd?",
                  answer: "Absoluut. Discretie is onze hoogste prioriteit. Onze chauffeurs parkeren nooit direct voor uw deur en alle communicatie verloopt vertrouwelijk.",
                },
                {
                  question: "Binnen welk gebied zijn jullie actief?",
                  answer: "Wij zijn actief in heel Nederland, met focus op de Randstad. Van Amsterdam tot Rotterdam, Den Haag tot Utrecht - wij komen naar jou toe.",
                },
              ]}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Cards Variant</p>
            <FAQ
              title="FAQ met kaarten"
              variant="cards"
              items={[
                {
                  question: "Hoeveel kost een escort?",
                  answer: "Onze tarieven starten vanaf €160 per uur. Bekijk onze prijspagina voor een volledig overzicht van alle tarieven en services.",
                },
                {
                  question: "Kan ik een specifieke escort aanvragen?",
                  answer: "Ja, je kunt een specifieke escort aanvragen. Check de beschikbaarheid op haar profielpagina of neem contact met ons op.",
                },
              ]}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* How-To Steps */}
      <AnimatedSection title="How-To Steps" subtitle="Step-by-step instruction blocks">
        <div className="space-y-12">
          <div>
            <p className="text-sm text-muted-foreground mb-6">Accordion Variant (Interactive)</p>
            <HowToSteps
              eyebrow="Hoe het werkt"
              title="Boek in 4 simpele stappen"
              variant="accordion"
              steps={[
                {
                  title: "Kies je escort",
                  description: "Bekijk onze selectie van prachtige escorts en kies degene die het beste bij je past. Filter op type, services of locatie.",
                },
                {
                  title: "Neem contact op",
                  description: "Start een Live Chat, bel ons of stuur een WhatsApp bericht. Wij zijn 24/7 bereikbaar om je te helpen.",
                },
                {
                  title: "Bevestig je boeking",
                  description: "Kies de gewenste datum, tijd en locatie. Wij bevestigen de boeking en regelen de details.",
                },
                {
                  title: "Geniet van je date",
                  description: "Je escort arriveert discreet op de afgesproken locatie. Ontspan en geniet van een onvergetelijke ervaring.",
                },
              ]}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Numbered Variant (Grid)</p>
            <HowToSteps
              title="Zo werkt het"
              variant="numbered"
              steps={[
                {
                  title: "Kies",
                  description: "Bekijk profielen en selecteer je favoriete escort.",
                },
                {
                  title: "Boek",
                  description: "Neem contact op via chat, telefoon of WhatsApp.",
                },
                {
                  title: "Geniet",
                  description: "Ontvang je escort op de gewenste locatie.",
                },
              ]}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-6">Timeline Variant</p>
            <HowToSteps
              title="Je reis met ons"
              variant="timeline"
              steps={[
                {
                  title: "Eerste contact",
                  description: "Je neemt contact met ons op en deelt je wensen.",
                },
                {
                  title: "Selectie & advies",
                  description: "Wij helpen je bij het kiezen van de perfecte escort.",
                },
                {
                  title: "Boeking bevestigd",
                  description: "Alles is geregeld - datum, tijd en locatie zijn vastgelegd.",
                },
                {
                  title: "Onvergetelijke ervaring",
                  description: "Je escort arriveert en jullie date begint.",
                },
              ]}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Table */}
      <AnimatedSection title="Pricing Table" subtitle="Rate display and pricing components">
        <PricingTableShowcase />
      </AnimatedSection>

      {/* Article Cards */}
      <AnimatedSection title="Article Cards" subtitle="Blog and knowledge centre cards">
        <ArticleCardShowcase />
      </AnimatedSection>

      {/* Legal Sections */}
      <AnimatedSection title="Legal Sections" subtitle="Terms, privacy, and legal document components">
        <LegalSectionShowcase />
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: PAGE TEMPLATES
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatedSectionDivider id="templates" title="4. Page Templates" description="Full page layouts (coming soon)" />

      <AnimatedSection title="Template Inventory" subtitle="Pages to be built">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Home", status: "pending" },
            { name: "Escort Listing", status: "pending" },
            { name: "Escort Profile", status: "pending" },
            { name: "Services", status: "pending" },
            { name: "Pricing", status: "pending" },
            { name: "Contact", status: "pending" },
            { name: "Blog Index", status: "pending" },
            { name: "Blog Post", status: "pending" },
            { name: "About", status: "pending" },
            { name: "Legal Pages", status: "pending" },
          ].map((template) => (
            <div 
              key={template.name} 
              className="p-4 rounded-lg bg-surface/50 border border-white/5 flex items-center justify-between"
            >
              <span className="text-foreground">{template.name}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 text-foreground/50">
                {template.status}
              </span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <div className="m-3 mt-6 rounded-luxury overflow-hidden border border-white/10">
        <Footer className="bottom-glow" />
      </div>
    </PageWrapper>
  );
}

