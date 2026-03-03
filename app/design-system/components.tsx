"use client";

import { useState } from "react";
import { Reveal } from "../components/ui/reveal";
import { StaggerContainer, StaggerItem } from "../components/ui/stagger-container";
import { HoverCardEffect } from "../components/ui/hover-card-effect";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { ProfileCard, ProfileCardCompact } from "../components/domain/profile-card";
import { TextWithImage } from "../components/domain/text-with-image";
import { TabbedContent } from "../components/domain/tabbed-content";
import { ProfileHero } from "../components/domain/profile-hero";
import { Mail, Search, User } from "lucide-react";

export function PageGradientShowcase() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-48 rounded-luxury overflow-hidden border border-white/10">
          <div className="absolute inset-0 hero-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-foreground/60 bg-background/80 px-3 py-1 rounded">
              hero-glow
            </span>
          </div>
        </div>
        <div className="relative h-48 rounded-luxury overflow-hidden border border-white/10">
          <div className="absolute inset-0 mid-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-foreground/60 bg-background/80 px-3 py-1 rounded">
              mid-glow
            </span>
          </div>
        </div>
        <div className="relative h-48 rounded-luxury overflow-hidden border border-white/10">
          <div className="absolute inset-0 bottom-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-foreground/60 bg-background/80 px-3 py-1 rounded">
              bottom-glow
            </span>
          </div>
        </div>
        <div className="relative h-48 rounded-luxury overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-ambient-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-foreground/60 bg-background/80 px-3 py-1 rounded">
              bg-ambient-glow
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground/60">
        The entire page uses <code className="text-primary">page-gradient</code> class which adds 
        warm amber gradient washes at top and bottom. Individual sections can use glow variants.
      </p>
    </div>
  );
}

export function GridShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-foreground/60 mb-4">12-column grid with responsive behavior</p>
        <div className="grid-container bg-surface/30 rounded-lg p-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="col-span-1 h-12 bg-primary/20 rounded flex items-center justify-center text-xs text-primary"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-foreground/60 mb-4">Common layouts: 6+6, 4+4+4, 3+3+3+3</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-6
            </div>
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-6
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-4
            </div>
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-4
            </div>
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-4
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-3
            </div>
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-3
            </div>
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-3
            </div>
            <div className="h-24 bg-surface rounded-lg flex items-center justify-center text-sm text-foreground/60">
              col-span-3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimatedShowcase() {
  return (
    <div className="space-y-16">
      <div>
        <h4 className="text-lg font-heading font-bold text-foreground mb-6">
          Single Item Reveal
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal variant="fade" delay={0}>
            <div className="card-surface p-6 rounded-luxury">
              <h5 className="font-bold text-foreground mb-2">Fade In</h5>
              <p className="text-sm text-foreground/60">Simple opacity transition</p>
            </div>
          </Reveal>
          <Reveal variant="slideUp" delay={0.1}>
            <div className="card-surface p-6 rounded-luxury">
              <h5 className="font-bold text-foreground mb-2">Slide Up</h5>
              <p className="text-sm text-foreground/60">Upward motion with fade</p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={0.2}>
            <div className="card-surface p-6 rounded-luxury">
              <h5 className="font-bold text-foreground mb-2">Scale</h5>
              <p className="text-sm text-foreground/60">Grow from 90% with fade</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-heading font-bold text-foreground mb-6">
          Stagger Animation
        </h4>
        <StaggerContainer staggerDelay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <StaggerItem key={i} variant="slideUp">
                <div className="card-elevated p-6 rounded-luxury text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{i}</div>
                  <p className="text-xs text-foreground/60">Card {i}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>

      <div>
        <h4 className="text-lg font-heading font-bold text-foreground mb-6">
          Direction Variants
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal variant="slideLeft">
            <div className="card-surface p-6 rounded-luxury">
              <h5 className="font-bold text-foreground mb-2">Slide Left</h5>
              <p className="text-sm text-foreground/60">Enters from the right</p>
            </div>
          </Reveal>
          <Reveal variant="slideRight">
            <div className="card-surface p-6 rounded-luxury">
              <h5 className="font-bold text-foreground mb-2">Slide Right</h5>
              <p className="text-sm text-foreground/60">Enters from the left</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-heading font-bold text-foreground mb-6">
          Blur Reveal
        </h4>
        <Reveal variant="blur">
          <div className="card-elevated p-8 rounded-luxury text-center">
            <h5 className="font-bold text-xl text-foreground mb-2">Blur Effect</h5>
            <p className="text-foreground/60">Content reveals with blur-to-clear transition</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function CardShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <HoverCardEffect>
        <div className="card-surface p-6 rounded-luxury h-full">
          <h5 className="font-bold text-foreground mb-2">Hover Card</h5>
          <p className="text-sm text-foreground/60">
            Lifts on hover with subtle shadow glow effect.
          </p>
        </div>
      </HoverCardEffect>
      <HoverCardEffect hoverScale={1.03} hoverY={-6}>
        <div className="card-elevated p-6 rounded-luxury h-full">
          <h5 className="font-bold text-foreground mb-2">Enhanced Hover</h5>
          <p className="text-sm text-foreground/60">
            Larger scale and lift for emphasis.
          </p>
        </div>
      </HoverCardEffect>
      <HoverCardEffect glowOnHover={false} hoverScale={1.01}>
        <div className="card-surface p-6 rounded-luxury h-full">
          <h5 className="font-bold text-foreground mb-2">Subtle Hover</h5>
          <p className="text-sm text-foreground/60">
            Minimal effect without glow, for quieter interactions.
          </p>
        </div>
      </HoverCardEffect>
    </div>
  );
}

export function FormControlsShowcase() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
    terms: false,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Name"
            placeholder="Enter your name"
            leftIcon={<User className="w-4 h-4" />}
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={formValues.email}
            onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          />
          <Input
            label="Search"
            placeholder="Search escorts..."
            leftIcon={<Search className="w-4 h-4" />}
            hint="Try searching by name or service"
          />
          <Input
            label="With Error"
            placeholder="Invalid input"
            error="This field is required"
            defaultValue="Bad input"
          />
        </div>
        <div className="space-y-6">
          <Select
            label="Service"
            placeholder="Select a service"
            options={[
              { value: "massage", label: "Erotische Massage" },
              { value: "gfe", label: "Girlfriend Experience" },
              { value: "dinner", label: "Dinner Date" },
              { value: "hotel", label: "Hotel Service" },
            ]}
            value={formValues.service}
            onChange={(e) => setFormValues({ ...formValues, service: e.target.value })}
          />
          <Textarea
            label="Message"
            placeholder="Tell us about your preferences..."
            value={formValues.message}
            onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
          />
          <Checkbox
            label="I agree to the terms and conditions"
            checked={formValues.terms}
            onChange={(e) => setFormValues({ ...formValues, terms: e.target.checked })}
          />
          <Checkbox
            label={
              <span>
                Subscribe to our newsletter for{" "}
                <span className="text-primary">exclusive offers</span>
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

export function ProfileCardShowcase() {
  const mockProfiles = [
    {
      name: "Sophie",
      slug: "sophie",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=640&fit=crop",
      tagline: "Elegante brunette met een passie voor intieme momenten",
      isVerified: true,
      isAvailable: true,
      age: 24,
      height: "175cm",
      cupSize: "C",
      services: ["GFE", "Massage", "Dinner Date"],
    },
    {
      name: "Emma",
      slug: "emma",
      imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=640&fit=crop",
      tagline: "Speelse blondine voor onvergetelijke avonturen",
      isVerified: true,
      isAvailable: true,
      age: 22,
      height: "168cm",
      cupSize: "B",
      services: ["Erotische Massage", "Hotel Service"],
    },
    {
      name: "Isabella",
      slug: "isabella",
      imageUrl: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&h=640&fit=crop",
      tagline: "Exotische schoonheid uit Zuid-Amerika",
      isVerified: true,
      isAvailable: false,
      age: 26,
      height: "170cm",
      cupSize: "D",
      services: ["Duo", "BDSM Light"],
    },
    {
      name: "New Escort",
      slug: "new-escort",
      tagline: "Binnenkort beschikbaar - Placeholder voorbeeld",
      isVerified: false,
      isAvailable: false,
      age: 23,
      height: "165cm",
      cupSize: "B",
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <p className="text-sm text-muted-foreground mb-6">Grid Layout (Standard)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {mockProfiles.map((profile) => (
            <ProfileCard key={profile.slug} {...profile} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-6">Compact List Layout</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockProfiles.map((profile) => (
            <ProfileCardCompact
              key={profile.slug}
              name={profile.name}
              slug={profile.slug}
              imageUrl={profile.imageUrl}
              isVerified={profile.isVerified}
              isAvailable={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TextWithImageShowcase() {
  return (
    <div className="space-y-16">
      <TextWithImage
        eyebrow="Waarom Desire Escorts"
        title="Exclusieve Begeleiding op Maat"
        content="<p>Bij Desire Escorts draait alles om kwaliteit en discretie. Onze zorgvuldig geselecteerde escorts bieden een onvergetelijke ervaring, afgestemd op uw persoonlijke wensen.</p><p>Of het nu gaat om een zakendiner, een sociale gelegenheid, of een intiem moment - wij zorgen voor perfecte begeleiding.</p>"
        imageUrl="https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=600&fit=crop"
        imageAlt="Luxe interieur"
        imagePosition="right"
        ctaText="Ontdek Meer"
        ctaHref="/services"
      />
      <TextWithImage
        title="Image on Left Example"
        content="<p>This demonstrates the layout with the image positioned on the left side instead of the right.</p>"
        imageUrl="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop"
        imageAlt="Hotel lobby"
        imagePosition="left"
        titleVariant="light"
      />
    </div>
  );
}

export function TabbedContentShowcase() {
  const tabs = [
    {
      id: "services",
      label: "Services",
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70">Onze escorts bieden een breed scala aan diensten:</p>
          <ul className="list-disc list-inside text-foreground/60 space-y-2">
            <li>Girlfriend Experience (GFE)</li>
            <li>Erotische Massage</li>
            <li>Dinner Date begeleiding</li>
            <li>Hotel & Home Visits</li>
          </ul>
        </div>
      ),
    },
    {
      id: "tarieven",
      label: "Tarieven",
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70">Onze tarieven zijn transparant en all-inclusive:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface/50">
              <span className="text-2xl font-bold text-primary">€250</span>
              <span className="text-foreground/50 text-sm block">per uur</span>
            </div>
            <div className="p-4 rounded-lg bg-surface/50">
              <span className="text-2xl font-bold text-primary">€1500</span>
              <span className="text-foreground/50 text-sm block">overnight</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "beschikbaarheid",
      label: "Beschikbaarheid",
      content: (
        <p className="text-foreground/70">
          Wij zijn 24 uur per dag, 7 dagen per week beschikbaar. Boekingen kunnen 
          telefonisch of via WhatsApp worden gemaakt. Last-minute afspraken zijn 
          mogelijk onder voorbehoud van beschikbaarheid.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <p className="text-sm text-muted-foreground mb-6">Underline Variant (Default)</p>
        <TabbedContent tabs={tabs} variant="underline" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-6">Pills Variant</p>
        <TabbedContent tabs={tabs} variant="pills" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-6">Boxed Variant</p>
        <TabbedContent tabs={tabs} variant="boxed" />
      </div>
    </div>
  );
}

export function ProfileHeroShowcase() {
  return (
    <ProfileHero
      name="Brianna"
      tagline="Hoi! Ik ben Brianna, 26 jaar en 173 cm lang. Met mijn bruine ogen en bruin-zwart haar hou ik wel van een beetje mysterie. Mijn D cup past perfect bij mijn normale postuur, vind ik zelf!"
      description="Hoi! Ik ben Brianna, 26 jaar en 173 cm lang. Met mijn bruine ogen en bruin-zwart haar hou ik wel van een beetje mysterie. Mijn D cup past perfect bij mijn normale postuur, vind ik zelf! Ik ben een sophisticated dinner date escort with effortless elegance and warm conversational depth."
      images={[
        { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop", alt: "Brianna - foto 1" },
        { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop", alt: "Brianna - foto 2" },
        { url: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=800&h=1000&fit=crop", alt: "Brianna - foto 3" },
        { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop", alt: "Brianna - foto 4" },
        { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop", alt: "Brianna - foto 5" },
        { url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop", alt: "Brianna - foto 6" },
      ]}
      isVerified={true}
      isAvailable={true}
      age={26}
      height="173 cm"
      weight="58kg"
      cupSize="D"
      posture="Normaal"
      eyeColor="Bruin"
      hairColor="Bruin, Zwart"
      sexuality="Heteroseksueel"
      languages={["Engels", "Nederlands"]}
      services={[
        "Girlfriend Experience",
        "Erotische Massage",
        "Orale seks",
        "Overnachting",
        "Trio met man",
        "Uitgaan",
        "Dinnerdate",
      ]}
      whatsapp="+31642188911"
    />
  );
}
