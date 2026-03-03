import Link from "next/link";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesireLogoStatic } from "../desire-logo";
import { Button } from "../ui/button";
import { StaticHeart } from "../shiny-heart";

const footerLinks = {
  services: {
    title: "Escort Services",
    links: [
      { label: "Erotische Massage", href: "/services/erotische-massage" },
      { label: "Escort voor Stellen", href: "/services/escort-voor-stellen" },
      { label: "GFE Escorts", href: "/services/gfe-escorts" },
      { label: "SM Escorts", href: "/services/sm-escorts" },
      { label: "Hotel Escorts", href: "/services/hotel-escorts" },
      { label: "BDSM Escorts", href: "/services/bdsm-escorts" },
      { label: "Bekijk Alle Services →", href: "/services" },
    ],
  },
  locations: {
    title: "Escort Locaties",
    links: [
      { label: "Escort Amsterdam", href: "/locaties/amsterdam" },
      { label: "Escort Haarlem", href: "/locaties/haarlem" },
      { label: "Escort Almaar", href: "/locaties/alkmaar" },
      { label: "Escort Schiphol", href: "/locaties/schiphol" },
      { label: "Escort Zaandam", href: "/locaties/zaandam" },
      { label: "Escort Hoofddorp", href: "/locaties/hoofddorp" },
      { label: "Bekijk Alle Locaties →", href: "/locaties" },
    ],
  },
  types: {
    title: "Escort Types",
    links: [
      { label: "Blonde Escorts", href: "/types/blonde-escorts" },
      { label: "Brunette Escorts", href: "/types/brunette-escorts" },
      { label: "High Class Escorts", href: "/types/high-class-escorts" },
      { label: "Nederlandse Escorts", href: "/types/nederlandse-escorts" },
      { label: "Turkse Escorts", href: "/types/turkse-escorts" },
      { label: "Bekijk Alle Types →", href: "/types" },
    ],
  },
  info: {
    title: "Handige Links",
    links: [
      { label: "Over Ons", href: "/over-ons" },
      { label: "Blog", href: "/blog" },
      { label: "Nieuwsbrief", href: "/nieuwsbrief" },
      { label: "Contact", href: "/contact" },
      { label: "Kennisbank", href: "/kennisbank" },
      { label: "Veelgestelde Vragen", href: "/faq" },
      { label: "Werken als Escort", href: "/werken-als-escort" },
      { label: "Waarom Desire Escorts?", href: "/waarom-desire-escorts" },
    ],
  },
};

const paymentIcons = [
  { name: "Visa", icon: "💳" },
  { name: "Mastercard", icon: "💳" },
  { name: "iDEAL", icon: "🏦" },
  { name: "Apple Pay", icon: "📱" },
  { name: "Google Pay", icon: "📱" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-surface/30">
      {/* Contact CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Direct Contact */}
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                Direct Bestellen
              </h3>
              <div className="flex flex-col gap-3">
                <Button variant="ghost" size="md" className="justify-start gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Bel +31 6 42188911</span>
                </Button>
                <Button variant="primary" size="md" className="justify-start gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Live Chat</span>
                </Button>
                <Button variant="ghost" size="md" className="justify-start gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Chat via Telegram</span>
                </Button>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                Betaalmethoden
              </h3>
              <p className="text-sm text-foreground/60 mb-4">
                Betaalgemak op zijn best! Kies uit een van de vele opties
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentIcons.map((payment) => (
                  <span
                    key={payment.name}
                    className="px-3 py-2 bg-surface rounded-lg text-sm border border-white/10"
                    title={payment.name}
                  >
                    {payment.icon}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                Keurmerk
              </h3>
              <p className="text-sm text-foreground/60 mb-4">
                Desire is als betrouwbaar bureau erkend door het Escortkeurmerk
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-surface rounded-luxury border border-primary/20">
                <StaticHeart size={24} />
                <span className="text-sm font-medium text-foreground">
                  Verified Bureau
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-sm font-heading font-bold text-primary uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-foreground/60 hover:text-foreground transition-colors",
                        link.label.includes("→") && "text-primary hover:text-accent"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <DesireLogoStatic size="sm" />
              <span className="text-sm text-foreground/40">
                © 2025 Desire Escorts
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-foreground/40">
              <Link href="/algemene-voorwaarden" className="hover:text-foreground transition-colors">
                Algemene Voorwaarden
              </Link>
              <Link href="/privacybeleid" className="hover:text-foreground transition-colors">
                Privacybeleid
              </Link>
              <span>Licentie: 018 001006</span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <button className="px-2 py-1 rounded bg-primary/20 text-primary font-medium">
                🇳🇱 NL
              </button>
              <button className="px-2 py-1 rounded text-foreground/40 hover:text-foreground transition-colors">
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
