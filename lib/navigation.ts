/**
 * Centralized navigation configuration for header, footer, and sitemap generation.
 * This file is the single source of truth for site navigation structure.
 */

export type NavItem = {
  label: string;
  labelEn?: string;
  href: string;
  children?: NavItem[];
  description?: string;
};

export type FooterLinkSection = {
  title: string;
  titleEn?: string;
  links: NavItem[];
};

// Primary navigation items (header)
export const primaryNav: NavItem[] = [
  { 
    label: "Escorts", 
    labelEn: "Escorts",
    href: "/alle-escorts",
    description: "Bekijk onze selectie escorts"
  },
  {
    label: "Services",
    labelEn: "Services",
    href: "/services",
    description: "Onze escort diensten",
    children: [
      { label: "Hotel Escort", labelEn: "Hotel Escort", href: "/hotel-escort" },
      { label: "Erotische Massage", labelEn: "Erotic Massage", href: "/erotische-massage" },
      { label: "GFE Escorts", labelEn: "GFE Escorts", href: "/gfe-escorts" },
      { label: "BDSM Escorts", labelEn: "BDSM Escorts", href: "/bdsm-escorts" },
      { label: "Dinner Date", labelEn: "Dinner Date", href: "/dinnerdate-escort" },
      { label: "Alle Services", labelEn: "All Services", href: "/services" },
    ],
  },
  { 
    label: "Locaties", 
    labelEn: "Locations",
    href: "/escort-in-nederland",
    description: "Beschikbaar in heel Nederland",
    children: [
      { label: "Amsterdam", labelEn: "Amsterdam", href: "/escort-amsterdam" },
      { label: "Rotterdam", labelEn: "Rotterdam", href: "/escort-rotterdam" },
      { label: "Den Haag", labelEn: "The Hague", href: "/escort-den-haag" },
      { label: "Utrecht", labelEn: "Utrecht", href: "/escort-utrecht" },
      { label: "Alle Locaties", labelEn: "All Locations", href: "/escort-in-nederland" },
    ],
  },
  { 
    label: "Tarieven", 
    labelEn: "Rates",
    href: "/prijzen" 
  },
  { 
    label: "Contact", 
    labelEn: "Contact",
    href: "/contact" 
  },
];

// Footer link sections
export const footerLinks: Record<string, FooterLinkSection> = {
  services: {
    title: "Escort Services",
    titleEn: "Escort Services",
    links: [
      { label: "Hotel Escort", labelEn: "Hotel Escort", href: "/hotel-escort" },
      { label: "Erotische Massage", labelEn: "Erotic Massage", href: "/erotische-massage" },
      { label: "GFE Escorts", labelEn: "GFE Escorts", href: "/gfe-escorts" },
      { label: "Escort voor Stellen", labelEn: "Couples Escort", href: "/escort-voor-stellen" },
      { label: "SM Escorts", labelEn: "SM Escorts", href: "/sm-escort" },
      { label: "BDSM Escorts", labelEn: "BDSM Escorts", href: "/bdsm-escorts" },
      { label: "Bekijk Alle Services →", labelEn: "View All Services →", href: "/services" },
    ],
  },
  locations: {
    title: "Escort Locaties",
    titleEn: "Escort Locations",
    links: [
      { label: "Escort Amsterdam", labelEn: "Escort Amsterdam", href: "/escort-amsterdam" },
      { label: "Escort Rotterdam", labelEn: "Escort Rotterdam", href: "/escort-rotterdam" },
      { label: "Escort Den Haag", labelEn: "Escort The Hague", href: "/escort-den-haag" },
      { label: "Escort Utrecht", labelEn: "Escort Utrecht", href: "/escort-utrecht" },
      { label: "Escort Haarlem", labelEn: "Escort Haarlem", href: "/escort-haarlem" },
      { label: "Escort Eindhoven", labelEn: "Escort Eindhoven", href: "/escort-eindhoven" },
      { label: "Bekijk Alle Locaties →", labelEn: "View All Locations →", href: "/escort-in-nederland" },
    ],
  },
  types: {
    title: "Escort Types",
    titleEn: "Escort Types",
    links: [
      { label: "Blonde Escorts", labelEn: "Blonde Escorts", href: "/blonde-escort-dames" },
      { label: "Brunette Escorts", labelEn: "Brunette Escorts", href: "/brunette-escort-dames" },
      { label: "High Class Escorts", labelEn: "High Class Escorts", href: "/high-class-escort" },
      { label: "Nederlandse Escorts", labelEn: "Dutch Escorts", href: "/nederlandse-escort" },
      { label: "Turkse Escorts", labelEn: "Turkish Escorts", href: "/turkse-escort" },
      { label: "Aziatische Escorts", labelEn: "Asian Escorts", href: "/aziatische-escorts" },
      { label: "Mature Escorts", labelEn: "Mature Escorts", href: "/mature-escort" },
      { label: "Bekijk Alle Types →", labelEn: "View All Types →", href: "/services" },
    ],
  },
  info: {
    title: "Handige Links",
    titleEn: "Quick Links",
    links: [
      { label: "Over Ons", labelEn: "About Us", href: "/over-ons" },
      { label: "Blog", labelEn: "Blog", href: "/blog" },
      { label: "Kennisbank", labelEn: "Knowledge Centre", href: "/kennisbank" },
      { label: "Veelgestelde Vragen", labelEn: "FAQ", href: "/faq" },
      { label: "Werken als Escort", labelEn: "Work as Escort", href: "/werken-als-escort" },
      { label: "Contact", labelEn: "Contact", href: "/contact" },
    ],
  },
};

// Legal links for footer bottom bar
export const legalLinks: NavItem[] = [
  { label: "Algemene Voorwaarden", labelEn: "Terms & Conditions", href: "/algemene-voorwaarden" },
  { label: "Privacybeleid", labelEn: "Privacy Policy", href: "/privacybeleid" },
  { label: "Cookiebeleid", labelEn: "Cookie Policy", href: "/cookiebeleid" },
];

// Helper function to check if a path matches a nav item
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Helper function to check if any child of a nav item is active
export function isNavItemOrChildActive(pathname: string, item: NavItem): boolean {
  if (isNavItemActive(pathname, item.href)) {
    return true;
  }
  if (item.children) {
    return item.children.some(child => isNavItemActive(pathname, child.href));
  }
  return false;
}
