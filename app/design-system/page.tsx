import { GradientTitle } from "../components/ui/gradient-title";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ShinyHeart, StaticHeart } from "../components/shiny-heart";
import { DesireLogoAnimated, DesireLogoStatic } from "../components/desire-logo";
import { PageWrapper, Section as PageSection, Container, Grid } from "../components/ui/page-wrapper";
import { AnimatedShowcase, CardShowcase, GridShowcase, PageGradientShowcase } from "./components";

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
          <GradientTitle as="h1" size="xl" className="mb-4">
            Design System
          </GradientTitle>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Component library and design tokens for Desire Escorts. Premium dark
            aesthetic with warm gold luminosity.
          </p>
        </Container>
      </PageSection>

      {/* Brand Assets */}
      <Section title="Brand Assets" subtitle="Logo and favicon variants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Logo - Animated">
            <div className="flex items-center justify-center p-8 bg-background rounded-lg">
              <DesireLogoAnimated size="lg" />
            </div>
          </Card>
          <Card title="Logo - Static">
            <div className="flex items-center justify-center p-8 bg-background rounded-lg">
              <DesireLogoStatic size="lg" />
            </div>
          </Card>
          <Card title="Heart Icon - Animated">
            <div className="flex items-center justify-center gap-8 p-8 bg-background rounded-lg">
              <ShinyHeart size={48} />
              <ShinyHeart size={32} />
              <ShinyHeart size={24} />
            </div>
          </Card>
          <Card title="Heart Icon - Static">
            <div className="flex items-center justify-center gap-8 p-8 bg-background rounded-lg">
              <StaticHeart size={48} />
              <StaticHeart size={32} />
              <StaticHeart size={24} />
            </div>
          </Card>
        </div>
      </Section>

      {/* Colors */}
      <Section title="Colors" subtitle="Brand and semantic color tokens">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch name="Royal Gold" color="#F7D063" token="--primary" />
          <ColorSwatch name="Vanilla Custard" color="#F2DE9B" token="--accent" />
          <ColorSwatch name="Carbon Black" color="#1A1B17" token="--background" />
          <ColorSwatch name="Dark Olive" color="#202216" token="--surface" />
          <ColorSwatch name="White Smoke" color="#F5F4F3" token="--foreground" />
        </div>

        <h4 className="text-lg font-heading font-bold text-foreground mt-12 mb-4">
          Gradients
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 rounded-luxury bg-gradient-to-b from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold">Gold Gradient</span>
          </div>
          <div className="h-24 rounded-luxury bg-ambient-glow border border-white/10 flex items-center justify-center">
            <span className="text-foreground/60">Ambient Glow</span>
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" subtitle="Gradient titles and text styles">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Muted Text</p>
            <p className="text-muted-foreground max-w-prose">
              Secondary text styling for less prominent content and descriptions.
            </p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons" subtitle="3D beveled buttons with glassy borders">
        <div className="space-y-10">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Primary (Gold) - Main CTAs</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="primary" size="xl">Book Now</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
              <Button variant="primary" size="md">Medium Primary</Button>
              <Button variant="primary" size="sm">Small Primary</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Premium (White) - Special CTAs</p>
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
              <Button variant="whatsapp" size="xl">Chat on WhatsApp</Button>
              <Button variant="whatsapp" size="lg">Large WhatsApp</Button>
              <Button variant="whatsapp" size="md">Medium WhatsApp</Button>
              <Button variant="whatsapp" size="sm">Small WhatsApp</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Disabled States</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="primary" size="lg" disabled>Disabled Primary</Button>
              <Button variant="premium" size="lg" disabled>Disabled Premium</Button>
              <Button variant="whatsapp" size="lg" disabled>Disabled WhatsApp</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Secondary</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg">Large Secondary</Button>
              <Button variant="secondary" size="md">Medium Secondary</Button>
              <Button variant="secondary" size="sm">Small Secondary</Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4">Ghost (Outline)</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="ghost" size="lg">Large Ghost</Button>
              <Button variant="ghost" size="md">Medium Ghost</Button>
              <Button variant="ghost" size="sm">Small Ghost</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges" subtitle="Status and service indicators">
        <div className="flex flex-wrap gap-4">
          <Badge variant="verified" />
          <Badge variant="vip" />
          <Badge variant="service">Erotische Massage</Badge>
          <Badge variant="service">GFE</Badge>
          <Badge variant="service">Hotel Service</Badge>
          <Badge variant="default">Available</Badge>
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards" subtitle="Surface and elevation styles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-surface p-6 rounded-luxury">
            <h4 className="font-heading font-bold text-foreground mb-2">
              Card Surface
            </h4>
            <p className="text-foreground/60 text-sm">
              Default card style with subtle border and shadow.
            </p>
          </div>
          <div className="card-elevated p-6 rounded-luxury">
            <h4 className="font-heading font-bold text-foreground mb-2">
              Card Elevated
            </h4>
            <p className="text-foreground/60 text-sm">
              Elevated card with gold-tinted border and deeper shadow.
            </p>
          </div>
        </div>
      </Section>

      {/* Spacing & Layout */}
      <Section title="Spacing & Layout" subtitle="Consistent spacing scale">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-primary rounded" />
            <span className="text-sm text-foreground/60">4px - gap-1</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded" />
            <span className="text-sm text-foreground/60">8px - gap-2</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-8 bg-primary rounded" />
            <span className="text-sm text-foreground/60">16px - gap-4</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-8 bg-primary rounded" />
            <span className="text-sm text-foreground/60">24px - gap-6</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-8 bg-primary rounded" />
            <span className="text-sm text-foreground/60">32px - gap-8</span>
          </div>
        </div>
      </Section>

      {/* Border Radius */}
      <Section title="Border Radius" subtitle="Rounded corner tokens">
        <div className="flex flex-wrap gap-6">
          <div className="w-20 h-20 bg-surface border border-border rounded-sm flex items-center justify-center">
            <span className="text-xs text-foreground/60">sm</span>
          </div>
          <div className="w-20 h-20 bg-surface border border-border rounded-md flex items-center justify-center">
            <span className="text-xs text-foreground/60">md</span>
          </div>
          <div className="w-20 h-20 bg-surface border border-border rounded-lg flex items-center justify-center">
            <span className="text-xs text-foreground/60">lg</span>
          </div>
          <div className="w-20 h-20 bg-surface border border-border rounded-luxury flex items-center justify-center">
            <span className="text-xs text-foreground/60">luxury</span>
          </div>
          <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center">
            <span className="text-xs text-foreground/60">full</span>
          </div>
        </div>
      </Section>

      {/* Page Gradients */}
      <Section title="Page Gradients" subtitle="Warm ambient glow backgrounds">
        <PageGradientShowcase />
      </Section>

      {/* Grid System */}
      <Section title="Grid System" subtitle="12-column responsive layout">
        <GridShowcase />
      </Section>

      {/* Animations */}
      <Section title="Scroll Animations" subtitle="Reveal and stagger effects (scroll to trigger)">
        <AnimatedShowcase />
      </Section>

      {/* Card Hover Effects */}
      <Section title="Card Hover Effects" subtitle="Interactive card animations">
        <CardShowcase />
      </Section>
    </PageWrapper>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-foreground/60">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface rounded-luxury overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ColorSwatch({
  name,
  color,
  token,
}: {
  name: string;
  color: string;
  token: string;
}) {
  return (
    <div className="card-surface rounded-luxury overflow-hidden">
      <div className="h-20" style={{ backgroundColor: color }} />
      <div className="p-3">
        <p className="font-medium text-sm text-foreground">{name}</p>
        <p className="text-xs text-foreground/50 font-mono">{color}</p>
        <p className="text-xs text-foreground/40 font-mono">{token}</p>
      </div>
    </div>
  );
}
