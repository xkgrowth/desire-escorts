"use client";

import { Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { GradientTitle } from "../ui/gradient-title";

type ContactMethod = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  action?: "call" | "whatsapp" | "email";
};

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  contactMethods?: ContactMethod[];
  showForm?: boolean;
  className?: string;
};

const defaultContactMethods: ContactMethod[] = [
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Bel Direct",
    value: "+31 6 42188911",
    href: "tel:+31642188911",
    action: "call",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "WhatsApp",
    value: "Chat met ons",
    href: "https://wa.me/31642188911",
    action: "whatsapp",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "info@desire-escorts.nl",
    href: "mailto:info@desire-escorts.nl",
    action: "email",
  },
];

export function CTASection({
  eyebrow = "Direct Contact",
  title = "Maak Vandaag Nog Een Afspraak",
  description = "Ons team staat 24/7 voor u klaar. Neem contact op via telefoon, WhatsApp of e-mail.",
  contactMethods = defaultContactMethods,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-luxury",
        "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent",
        "border border-primary/20",
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Content */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {eyebrow && (
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
              {eyebrow}
            </span>
          )}

          <GradientTitle as="h2" size="lg" className="mb-4">
            {title}
          </GradientTitle>

          {description && (
            <p className="text-foreground/70 text-lg mb-8 max-w-md">
              {description}
            </p>
          )}

          {/* Contact methods */}
          <div className="flex flex-col gap-4">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {method.icon}
                </div>
                <div>
                  <span className="text-xs text-foreground/50 uppercase tracking-wide block">
                    {method.label}
                  </span>
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                    {method.value}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Availability badge */}
          <div className="flex items-center gap-2 mt-8 text-sm text-foreground/60">
            <Clock className="w-4 h-4" />
            <span>24/7 Beschikbaar</span>
          </div>
        </div>

        {/* Right: CTA buttons */}
        <div className="p-8 lg:p-12 bg-surface/30 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-primary uppercase tracking-wider mb-2 text-center">
            Plan Your Experience
          </h3>
          <p className="text-foreground/60 text-sm text-center mb-6">
            Share your preferred timing, area, and style, and our team will guide you discreetly. Rates are available upon request.
          </p>

          <div className="flex gap-3">
            <Button variant="premium" size="lg" className="flex-1 gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </Button>

            <Button variant="whatsapp" size="lg" className="flex-1 gap-2">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Button>
          </div>

          <p className="text-xs text-foreground/40 text-center mt-6">
            Discreet en vertrouwelijk. Uw privacy is gegarandeerd.
          </p>
        </div>
      </div>
    </section>
  );
}

type CTABannerProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
};

export function CTABanner({
  title = "Heeft u vragen? Start een gesprek met ons team",
  subtitle = "Wij helpen u graag bij het maken van de perfecte keuze",
  buttonText = "Start Live Chat",
  buttonHref = "#",
  className,
}: CTABannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-6 p-6 lg:p-8",
        "rounded-luxury bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
        "border border-primary/20",
        className
      )}
    >
      <div className="text-center sm:text-left">
        <p className="text-lg font-heading font-bold text-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>
        )}
      </div>
      <a href={buttonHref}>
        <Button variant="premium" size="lg" className="flex-shrink-0 gap-2">
          <MessageCircle className="w-5 h-5" />
          {buttonText}
        </Button>
      </a>
    </div>
  );
}
