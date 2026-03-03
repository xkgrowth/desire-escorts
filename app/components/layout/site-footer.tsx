"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { footerLinks, legalLinks } from "@/lib/navigation";
import { DesireLogoStatic } from "../desire-logo";
import { Button } from "../ui/button";
import { StaticHeart } from "../shiny-heart";

const paymentMethods = [
  { name: "Contant", label: "💵" },
  { name: "PIN", label: "💳" },
  { name: "iDEAL", label: "🏦" },
  { name: "Creditcard", label: "💳" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const currentYear = new Date().getFullYear();
  
  const switchToLocale = (locale: "nl" | "en") => {
    if (locale === "en" && !isEnglish) {
      return `/en${pathname}`;
    }
    if (locale === "nl" && isEnglish) {
      return pathname.replace(/^\/en/, "") || "/";
    }
    return pathname;
  };

  return (
    <footer className="border-t border-white/10 bg-surface/30">
      {/* Contact CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Direct Contact */}
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                {isEnglish ? "Book Now" : "Direct Bestellen"}
              </h3>
              <div className="flex flex-col gap-3">
                <a 
                  href="tel:+31642188911"
                  className="inline-flex items-center justify-start gap-3 px-6 py-2.5 text-base font-heading font-bold rounded-luxury bg-transparent border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground hover:bg-surface/30 transition-all"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+31 6 42188911</span>
                </a>
                <Button variant="premium" size="md" className="justify-start gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Live Chat</span>
                </Button>
                <a 
                  href="https://wa.me/31642188911" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-start gap-3 px-6 py-2.5 text-base font-heading font-bold rounded-luxury bg-transparent border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground hover:bg-surface/30 transition-all"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                {isEnglish ? "Payment Methods" : "Betaalmethoden"}
              </h3>
              <p className="text-sm text-foreground/60 mb-4">
                {isEnglish 
                  ? "Multiple payment options available for your convenience"
                  : "Betaalgemak op zijn best! Kies uit een van de vele opties"
                }
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((payment) => (
                  <span
                    key={payment.name}
                    className="px-3 py-2 bg-surface rounded-lg text-sm border border-white/10 flex items-center gap-2"
                    title={payment.name}
                  >
                    <span>{payment.label}</span>
                    <span className="text-foreground/60 text-xs">{payment.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                {isEnglish ? "Verified Bureau" : "Keurmerk"}
              </h3>
              <p className="text-sm text-foreground/60 mb-4">
                {isEnglish 
                  ? "Desire is recognized as a trusted bureau by the Escort Quality Mark"
                  : "Desire is als betrouwbaar bureau erkend door het Escortkeurmerk"
                }
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-surface rounded-luxury border border-primary/20">
                <StaticHeart size={24} />
                <span className="text-sm font-medium text-foreground">
                  {isEnglish ? "Verified Bureau" : "Geverifieerd Bureau"}
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
                {isEnglish && section.titleEn ? section.titleEn : section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => {
                  const label = isEnglish && link.labelEn ? link.labelEn : link.label;
                  const isViewAll = label.includes("→");
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm transition-colors",
                          isViewAll 
                            ? "text-primary hover:text-accent font-medium" 
                            : "text-foreground/60 hover:text-foreground"
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
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
              <Link href="/" aria-label={isEnglish ? "Go to homepage" : "Ga naar homepage"}>
                <DesireLogoStatic size="sm" />
              </Link>
              <span className="text-sm text-foreground/40">
                © {currentYear} Desire Escorts
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-foreground/40">
              {legalLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {isEnglish && link.labelEn ? link.labelEn : link.label}
                </Link>
              ))}
              <span className="hidden md:inline">|</span>
              <span>{isEnglish ? "License" : "Licentie"}: 018 001006</span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 text-sm">
              <Link
                href={switchToLocale("nl")}
                className={cn(
                  "px-2 py-1 rounded transition-colors",
                  !isEnglish 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "text-foreground/40 hover:text-foreground"
                )}
                hrefLang="nl"
              >
                🇳🇱 NL
              </Link>
              <Link
                href={switchToLocale("en")}
                className={cn(
                  "px-2 py-1 rounded transition-colors",
                  isEnglish 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "text-foreground/40 hover:text-foreground"
                )}
                hrefLang="en"
              >
                🇬🇧 EN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
