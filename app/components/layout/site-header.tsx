"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { primaryNav, isNavItemActive, isNavItemOrChildActive, type NavItem } from "@/lib/navigation";
import { DesireLogoAnimated } from "../desire-logo";
import { Button } from "../ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Full-width container with edge-to-edge padding */}
      <div className="flex w-full items-center justify-between px-6 py-3 lg:px-10 xl:px-16">
        {/* Logo - Far Left */}
        <Link href="/" aria-label="Ga naar homepage" className="shrink-0">
          <DesireLogoAnimated size="md" />
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2" aria-label="Hoofdnavigatie">
          {primaryNav.map((item) => {
            const isActive = isNavItemOrChildActive(pathname, item);
            
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-5 py-2.5 text-base font-medium rounded-lg transition-colors",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === item.label && "rotate-180"
                      )} 
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="card-surface rounded-luxury p-2 min-w-[220px] shadow-lg">
                      {item.children.map((child) => {
                        const isChildActive = isNavItemActive(pathname, child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2.5 text-sm rounded-lg transition-colors",
                              isChildActive
                                ? "text-primary bg-primary/10"
                                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
                            )}
                            aria-current={isChildActive ? "page" : undefined}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop Right Side - Language Toggle Far Right */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="premium" size="md" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Live Chat</span>
          </Button>
          <LanguageToggle />
        </div>

        {/* Mobile Right Side */}
        <div className="flex lg:hidden items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-white/5 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
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
          navItems={primaryNav}
          pathname={pathname}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

function LanguageToggle() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  
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
    <div className="flex h-[46px] items-stretch rounded-luxury border border-white/20 overflow-hidden text-base">
      <Link
        href={switchToLocale("nl")}
        className={cn(
          "px-4 h-full transition-colors flex items-center gap-2",
          !isEnglish 
            ? "bg-white/10 text-foreground font-medium" 
            : "text-foreground/60 hover:text-foreground hover:bg-white/5"
        )}
        aria-label="Nederlands"
        hrefLang="nl"
      >
        <span className="text-base">🇳🇱</span>
        <span>NL</span>
      </Link>
      <Link
        href={switchToLocale("en")}
        className={cn(
          "px-4 h-full transition-colors flex items-center gap-2",
          isEnglish 
            ? "bg-white/10 text-foreground font-medium" 
            : "text-foreground/60 hover:text-foreground hover:bg-white/5"
        )}
        aria-label="English"
        hrefLang="en"
      >
        <span className="text-base">🇬🇧</span>
        <span>EN</span>
      </Link>
    </div>
  );
}

type MobileMenuProps = {
  navItems: NavItem[];
  pathname: string;
  onClose: () => void;
};

function MobileMenu({ navItems, pathname, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div 
      id="mobile-menu"
      className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-white/10 shadow-lg"
    >
      <nav className="flex flex-col p-4" aria-label="Mobiele navigatie">
        {navItems.map((item) => {
          const isActive = isNavItemOrChildActive(pathname, item);
          
          return (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.label ? null : item.label
                      )
                    }
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 text-base font-medium transition-colors",
                      isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
                    )}
                    aria-expanded={expandedItem === item.label}
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
                      {item.children.map((child) => {
                        const isChildActive = isNavItemActive(pathname, child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors",
                              isChildActive
                                ? "text-primary"
                                : "text-foreground/60 hover:text-foreground"
                            )}
                            aria-current={isChildActive ? "page" : undefined}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block px-4 py-3 text-base font-medium transition-colors",
                    isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}

        {/* Mobile CTAs */}
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
          <a 
            href="tel:+31642188911"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-base font-heading font-bold rounded-luxury bg-transparent border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground hover:bg-surface/30 transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Bel +31 6 42188911</span>
          </a>
          <Button variant="premium" size="md" className="w-full gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Start Live Chat</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
