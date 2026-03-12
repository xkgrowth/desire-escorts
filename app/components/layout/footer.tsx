"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DesireLogoStatic } from "../desire-logo";
import { PaymentIcons } from "../ui/payment-icons";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { WhatsAppIcon } from "../ui/whatsapp-icon";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type FooterProps = {
  columns?: FooterColumn[];
  showKeurmerk?: boolean;
  showPaymentIcons?: boolean;
  className?: string;
};

const defaultColumns: FooterColumn[] = [
  {
    title: "Escort Services",
    links: [
      { label: "Erotische massage", href: "/services/erotische-massage" },
      { label: "Escort voor stellen", href: "/services/escort-voor-stellen" },
      { label: "GFE escorts", href: "/services/gfe-escorts" },
      { label: "Goedkope escorts", href: "/services/goedkope-escorts" },
      { label: "SM Escorts", href: "/services/sm-escorts" },
      { label: "Hotel escorts", href: "/services/hotel-escorts" },
      { label: "BDSM Escorts", href: "/services/bdsm-escorts" },
      { label: "Alle escort services →", href: "/services" },
    ],
  },
  {
    title: "Escort Locaties",
    links: [
      { label: "Escort Amsterdam", href: "/escort-amsterdam" },
      { label: "Escort Haarlem", href: "/escort-haarlem" },
      { label: "Escort Alkmaar", href: "/escort-alkmaar" },
      { label: "Escort Schiphol", href: "/escort-schiphol" },
      { label: "Escort Zaandam", href: "/escort-zaandam" },
      { label: "Escort Hoofddorp", href: "/escort-hoofddorp" },
      { label: "Escort Amstelveen", href: "/escort-amstelveen" },
      { label: "Escort Almere", href: "/escort-almere" },
      { label: "Escort Utrecht", href: "/escort-utrecht" },
      { label: "Escort Diemen", href: "/escort-diemen" },
      { label: "Alle Locaties →", href: "/escort-in-nederland" },
    ],
  },
  {
    title: "Escort Types",
    links: [
      { label: "Blonde Escorts", href: "/escorts/blonde" },
      { label: "Brunette Escorts", href: "/escorts/brunette" },
      { label: "Ervaren Escorts", href: "/escorts/ervaren" },
      { label: "Nederlandse Escorts", href: "/escorts/nederlandse" },
      { label: "Turkse Escorts", href: "/escorts/turkse" },
      { label: "Alle escort types →", href: "/escorts" },
    ],
  },
  {
    title: "Handige Links",
    links: [
      { label: "Over Ons", href: "/over-ons" },
      { label: "Blog", href: "/blog" },
      { label: "Nieuwsbrief", href: "/nieuwsbrief" },
      { label: "Contact", href: "/contact" },
      { label: "Kennisbank", href: "/kennisbank" },
      { label: "Veelgestelde Vragen", href: "/veelgestelde-vragen" },
      { label: "Werken als Escort", href: "/werken-als-escort" },
      { label: "Waarom Desire Escorts?", href: "/waarom-desire-escorts" },
    ],
  },
];

export function Footer({
  columns = defaultColumns,
  showKeurmerk = true,
  showPaymentIcons = true,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-white/5 bg-grain",
        className
      )}
    >
      {/* Main Footer Content */}
      <div className="w-full px-6 py-12 lg:px-10 lg:py-16 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <DesireLogoStatic size="md" className="mb-6" />
            <p className="text-foreground/60 text-sm mb-6 max-w-xs">
              Al meer dan 20 jaar de meest betrouwbare escort service van Nederland. 
              Discrete, professioneel en altijd beschikbaar.
            </p>
            
            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="https://steadfast-art-a1f81485c3.strapiapp.com" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="md" className="gap-2">
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </Button>
              </a>
              <a href="#">
                <Button variant="primary" size="md" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </Button>
              </a>
            </div>

            {/* Keurmerk */}
            {showKeurmerk && (
              <a
                href="https://escortkeurmerk.nl/desire-escorts/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-luxury bg-surface border border-white/10 hover:border-primary/20 transition-colors group"
              >
                <Image
                  src="/brand/keurmerk.png"
                  alt="Escort Keurmerk"
                  width={40}
                  height={40}
                  className="flex-shrink-0"
                />
                <p className="text-xs text-foreground/70 leading-relaxed">
                  Desire is als betrouwbaar bureau erkent door het{" "}
                  <span className="text-primary group-hover:underline">
                    Escortkeurmerk
                  </span>
                </p>
              </a>
            )}
          </div>

          {/* Navigation Columns */}
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="font-heading font-bold text-foreground text-sm mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-xs transition-colors",
                        link.label.includes("→")
                          ? "text-primary hover:text-accent"
                          : "text-foreground/60 hover:text-primary"
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
      <div className="border-t border-white/5">
        <div className="w-full px-6 py-6 lg:px-10 xl:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Payment Icons */}
            {showPaymentIcons && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-xs text-foreground/40">Betaalmethoden:</span>
                <PaymentIcons iconSize="sm" />
              </div>
            )}

            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-foreground/40">
              <span>© 2026 Desire Escorts. Alle rechten voorbehouden.</span>
              <span className="hidden sm:inline">•</span>
              <Link href="/algemene-voorwaarden" className="hover:text-foreground/60 transition-colors">
                Algemene Voorwaarden
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/privacybeleid" className="hover:text-foreground/60 transition-colors">
                Privacybeleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
