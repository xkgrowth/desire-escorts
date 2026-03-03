"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesireLogoAnimated } from "../desire-logo";
import { Button } from "../ui/button";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Escorts", href: "/escorts" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Erotische Massage", href: "/services/erotische-massage" },
      { label: "GFE Escorts", href: "/services/gfe-escorts" },
      { label: "Hotel Escorts", href: "/services/hotel-escorts" },
      { label: "BDSM Escorts", href: "/services/bdsm-escorts" },
    ],
  },
  { label: "Hoe Het Werkt", href: "/hoe-het-werkt" },
  { label: "Prijzen", href: "/prijzen" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage" className="shrink-0">
          <DesireLogoAnimated size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 rounded-lg",
                  "hover:text-foreground hover:bg-white/5 transition-colors"
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="w-4 h-4" />}
              </Link>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="card-surface rounded-luxury p-2 min-w-[200px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-foreground/80 rounded-lg hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="sm" className="gap-2">
            <Phone className="w-4 h-4" />
            <span>Bel Ons</span>
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Start Live Chat</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-white/5 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          navItems={navItems}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

function LanguageToggle() {
  const [locale, setLocale] = useState<"nl" | "en">("nl");

  return (
    <button
      onClick={() => setLocale(locale === "nl" ? "en" : "nl")}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
    >
      <span className="w-5 h-4 rounded overflow-hidden">
        {locale === "nl" ? "🇳🇱" : "🇬🇧"}
      </span>
      <span className="uppercase">{locale}</span>
      <ChevronDown className="w-3 h-3" />
    </button>
  );
}

type MobileMenuProps = {
  navItems: NavItem[];
  onClose: () => void;
};

function MobileMenu({ navItems, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-white/10">
      <nav className="flex flex-col p-4">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() =>
                    setExpandedItem(
                      expandedItem === item.label ? null : item.label
                    )
                  }
                  className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform",
                      expandedItem === item.label && "rotate-180"
                    )}
                  />
                </button>
                {expandedItem === item.label && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className="block px-4 py-2.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}

        {/* Mobile CTAs */}
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
          <Button variant="ghost" size="md" className="w-full gap-2">
            <Phone className="w-5 h-5" />
            <span>Bel Ons</span>
          </Button>
          <Button variant="primary" size="md" className="w-full gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Start Live Chat</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
