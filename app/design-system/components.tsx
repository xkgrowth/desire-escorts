"use client";

import { Reveal } from "../components/ui/reveal";
import { StaggerContainer, StaggerItem } from "../components/ui/stagger-container";
import { HoverCardEffect } from "../components/ui/hover-card-effect";

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
