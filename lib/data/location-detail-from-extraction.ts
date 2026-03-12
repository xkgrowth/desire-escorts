/**
 * Build LocationDetailPageData from registry + image manifest + extracted Firecrawl content.
 * Used for dynamic location pages (e.g. [slug]) when no static batch entry exists.
 *
 * Requires:
 * - data/firecrawl/location-extracted-content.json (from npm run location:extract-content)
 * - data/inventory/location-image-manifest.json
 */

import fs from "node:fs";
import path from "node:path";
import { getLocationRegistryEntry } from "./location-registry";
import { TIER_3_FIRST_100_SLUGS } from "./location-batches";
import { locationDetailPagesBatch, batchOverrides } from "./location-detail-pages-batch";
import {
  getLocationPricingEstimateBySlug,
  formatEuro,
  formatHours,
} from "./location-pricing";
import {
  type LocationDetailPageData,
  type LocationFaqItem,
  type LocationHotel,
  type LocationLinkItem,
  type LocationBlogPost,
} from "./location-detail-pages";
import { getNearestNearbyLocations } from "./location-proximity";

const DEFAULT_USPS = [
  "Alle foto's van escorts zijn echt, geen AI-profielen",
  "Al 20 jaar een legaal bedrijf met vergunning",
  "De beste escort service in Noord-Holland",
];

const DEFAULT_SERVICES: LocationLinkItem[] = [
  { label: "Hotel Escort", href: "/hotel-escort" },
  { label: "Erotische Massage", href: "/erotische-massage" },
  { label: "Girlfriend Experience", href: "/gfe-escorts" },
  { label: "24-uurs Escort", href: "/24-uurs-escort" },
];

const DEFAULT_BLOG_POSTS: LocationBlogPost[] = [
  {
    title: "Verrijk Je ADE Ervaring: Luxe, Discretie & De Uitgaan Escort Service",
    href: "/verrijk-je-ade-ervaring-luxe-discretie-de-uitgaan-escort-service",
    dateLabel: "oktober 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Online Sekswerkers onder de Loep: Wat We Kunnen Leren van de Webcamindustrie",
    href: "/online-sekswerkers-onder-de-loep-wat-we-kunnen-leren-van-de-webcamindustrie",
    dateLabel: "september 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "SAIL Amsterdam & de Nautische Roots van de Escortbranche",
    href: "/sail-amsterdam-de-nautische-roots-van-de-escortbranche",
    dateLabel: "augustus 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1473973266408-ed4e2719b65c?auto=format&fit=crop&w=1200&q=80",
  },
];

const DEFAULT_QUOTE_POOL = [
  "Snel geregeld en prettig contact van begin tot eind.",
  "Duidelijke communicatie en discrete afhandeling.",
  "Professioneel en discreet geregeld.",
];

type ExtractedBySlug = Record<
  string,
  {
    slug: string;
    heroIntro?: string;
    locationNarrative?: string | null;
    faqs?: LocationFaqItem[] | null;
    hotels?: LocationHotel[] | null;
    speedSummary?: string;
    pricingSummary?: string;
    metaTitle?: string;
    metaDescription?: string;
  }
>;

type ImageManifestEntry = {
  slug: string;
  primary: { file: string; alt: string };
  secondary: { file: string; alt: string };
};

let cachedExtracted: ExtractedBySlug | null = null;
let cachedImageManifest: Map<string, ImageManifestEntry> | null = null;

function getDataRoot(): string {
  return path.join(process.cwd(), "data");
}

/** Parse JSON; if "after JSON at position" error, parse only the first complete object (handles trailing content or leading null/prefix). */
function parseJsonSafe(content: string, filePath: string): unknown {
  const trimmed = content.replace(/^\uFEFF/, "").trim(); // strip BOM
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("after JSON") && !msg.includes("position")) {
      if (!trimmed.startsWith("{")) {
        throw new Error(
          `Expected JSON object in ${filePath}, got start: ${trimmed.slice(0, 100)}`
        );
      }
      throw err;
    }
    // Extract first complete {...} and retry (handles e.g. null{"bySlug":...} or {...}trailing)
    const start = trimmed.indexOf("{");
    if (start === -1) throw err;
    let depth = 0;
    let inString = false;
    let escape = false;
    let quote = "";
    for (let i = start; i < trimmed.length; i++) {
      const c = trimmed[i];
      if (inString) {
        if (escape) {
          escape = false;
          continue;
        }
        if (c === "\\") {
          escape = true;
          continue;
        }
        if (c === quote) {
          inString = false;
          continue;
        }
        continue;
      }
      if (c === '"' || c === "'") {
        inString = true;
        quote = c;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(trimmed.slice(start, i + 1));
          } catch {
            throw err;
          }
        }
      }
    }
    throw err;
  }
}

function loadExtractedContent(): ExtractedBySlug {
  if (cachedExtracted) return cachedExtracted;
  const filePath = path.join(getDataRoot(), "firecrawl", "location-extracted-content.json");
  if (!fs.existsSync(filePath)) {
    cachedExtracted = {};
    return cachedExtracted;
  }
  const content = fs.readFileSync(filePath, "utf8");
  const raw = parseJsonSafe(content, filePath);
  cachedExtracted = (raw && typeof raw === "object" && "bySlug" in raw ? (raw as { bySlug?: ExtractedBySlug }).bySlug : raw) as ExtractedBySlug;
  if (!cachedExtracted || typeof cachedExtracted !== "object") cachedExtracted = {};
  return cachedExtracted;
}

function loadImageManifest(): Map<string, ImageManifestEntry> {
  if (cachedImageManifest) return cachedImageManifest;
  const filePath = path.join(getDataRoot(), "inventory", "location-image-manifest.json");
  if (!fs.existsSync(filePath)) {
    cachedImageManifest = new Map();
    return cachedImageManifest;
  }
  const content = fs.readFileSync(filePath, "utf8");
  const raw = parseJsonSafe(content, filePath);
  const entries =
    raw && typeof raw === "object" && Array.isArray((raw as { entries?: unknown[] }).entries)
      ? (raw as { entries: unknown[] }).entries
      : [];
  cachedImageManifest = new Map(
    entries.map((e: { slug: string; primary?: { file: string; alt?: string }; secondary?: { file: string; alt?: string } }) => [
      e.slug,
      {
        slug: e.slug,
        primary: {
          file: e.primary?.file ?? `${e.slug}-primary.jpg`,
          alt: e.primary?.alt ?? `Escort in ${e.slug.replace(/^escort-/, "")}`,
        },
        secondary: {
          file: e.secondary?.file ?? `${e.slug}-secondary.jpg`,
          alt: e.secondary?.alt ?? `Escort in ${e.slug.replace(/^escort-/, "")}`,
        },
      },
    ])
  );
  return cachedImageManifest;
}

const IMAGE_BASE = "/images/location";

/**
 * Use the alt text already set on the images (from the location image manifest) whenever possible.
 * Only skips manifest alt when that image slot was explicitly overridden with a different image,
 * so we don't pair the wrong alt with a different asset.
 */
function applyManifestAlt(
  slug: string,
  data: LocationDetailPageData,
  overrides?: Partial<LocationDetailPageData>
): LocationDetailPageData {
  const manifest = loadImageManifest();
  const entry = manifest.get(slug);
  if (!entry) return data;

  const primaryOverridden = overrides && "locationImagePrimaryUrl" in overrides;
  const secondaryOverridden = overrides && "locationImageSecondaryUrl" in overrides;

  return {
    ...data,
    ...(!primaryOverridden && { locationImagePrimaryAlt: entry.primary.alt }),
    ...(!secondaryOverridden && { locationImageSecondaryAlt: entry.secondary.alt }),
  };
}

/**
 * Build full LocationDetailPageData for a slug using registry, image manifest, and extracted content.
 * Returns null if the slug is not in the registry (e.g. not in NL scope).
 */
export function buildLocationDetailPageData(slug: string): LocationDetailPageData | null {
  const registry = getLocationRegistryEntry(slug);
  if (!registry) return null;

  const pricing = getLocationPricingEstimateBySlug(slug);
  const extracted = loadExtractedContent()[slug];
  const imageManifest = loadImageManifest();
  const imageEntry = imageManifest.get(slug);

  const city = registry.city;
  const province = registry.province ?? "Nederland";
  const priceFromValue = pricing ? formatEuro(pricing.minPrice) : "€160";
  const minDurationValue = pricing ? formatHours(pricing.minHours) : "1 uur";

  const primaryFile = imageEntry?.primary?.file ?? `${slug.replace(/^escort-/, "")}-primary.jpg`;
  const secondaryFile = imageEntry?.secondary?.file ?? `${slug.replace(/^escort-/, "")}-secondary.jpg`;
  const locationImagePrimaryUrl = `${IMAGE_BASE}/${primaryFile}`;
  const locationImageSecondaryUrl = `${IMAGE_BASE}/${secondaryFile}`;
  const locationImagePrimaryAlt = imageEntry?.primary?.alt ?? `Escort service in ${city}`;
  const locationImageSecondaryAlt = imageEntry?.secondary?.alt ?? `Escort service in ${city}`;

  const title = `Escort Service in ${city}`;
  const metaTitle = extracted?.metaTitle ?? `Escort Service ${city} | Desire Escorts`;
  const metaDescription =
    extracted?.metaDescription ??
    `Escort service in ${city}. Snelle beschikbaarheid en discrete service. Bekijk beschikbare escorts.`;
  const serviceTimeValue = "60 min";
  const speedSummary = extracted?.speedSummary ?? `Snelle service in ${city}`;
  const pricingSummary = extracted?.pricingSummary ?? `Vanaf ${priceFromValue} voor minimaal ${minDurationValue}`;
  const heroIntro =
    extracted?.heroIntro ??
    `Escort service in ${city} met snelle beschikbaarheid en discrete afhandeling. Boek via live chat of WhatsApp.`;
  const locationNarrative =
    extracted?.locationNarrative ??
    `${city} is een populaire locatie voor escortafspraken. We leveren snelle, discrete service in de regio.`;

  const faqs: LocationFaqItem[] =
    (extracted?.faqs?.length ?? 0) > 0
      ? (extracted.faqs as LocationFaqItem[])
      : [
          {
            question: `Hoe boek ik een escort in ${city}?`,
            answer: "Boeken gaat snel via live chat of WhatsApp. We stemmen voorkeuren en tijdstip met je af.",
          },
          {
            question: `Wat kost een escort in ${city}?`,
            answer: `De startprijs in ${city} is ${priceFromValue} voor ${minDurationValue}. Voor langere afspraken ontvang je vooraf een prijsindicatie.`,
          },
          {
            question: "Hoe gaan jullie om met privacy?",
            answer: "We behandelen gegevens vertrouwelijk en communiceren discreet van aanvraag tot afspraak.",
          },
        ];

  const hotels: LocationHotel[] =
    (extracted?.hotels?.length ?? 0) > 0
      ? (extracted.hotels as LocationHotel[])
      : [{ name: "Hotel in de regio", description: `Discrete locatie in ${city} en omgeving.` }];

  const nearbyLocations = getNearestNearbyLocations(slug, [], 6);

  return {
    slug,
    city,
    province,
    title,
    metaTitle,
    metaDescription,
    serviceTimeValue,
    priceFromValue,
    minDurationValue,
    speedSummary,
    pricingSummary,
    heroIntro,
    usps: DEFAULT_USPS,
    locationImagePrimaryUrl,
    locationImagePrimaryAlt,
    locationImageSecondaryUrl,
    locationImageSecondaryAlt,
    locationNarrative,
    quotePool: DEFAULT_QUOTE_POOL,
    hotels,
    services: DEFAULT_SERVICES,
    nearbyLocations,
    blogPosts: DEFAULT_BLOG_POSTS,
    faqs,
  };
}

/**
 * Resolve location page data: prefer static batch (Batch 1 + Haarlem/Amstelveen), then build from extraction and apply Batch 2 overrides when present.
 * Image alt text is always taken from the location image manifest when we use the manifest image, so the alt on the page matches the actual image assets.
 */
const TIER_3_FIRST_100_SET = new Set(TIER_3_FIRST_100_SLUGS);

/**
 * For Tier 3 first 100: prefer extraction narrative and hotels when present,
 * so "Wat je kunt verwachten" and hotel list use scraped content instead of generic overrides.
 */
export function getLocationDetailDataForSlug(slug: string): LocationDetailPageData | null {
  const batch = locationDetailPagesBatch[slug];
  if (batch) {
    return applyManifestAlt(slug, batch);
  }
  const built = buildLocationDetailPageData(slug);
  if (!built) return null;
  const overrides = batchOverrides[slug];
  const merged = overrides ? { ...built, ...overrides } : built;
  if (overrides && TIER_3_FIRST_100_SET.has(slug)) {
    const extracted = loadExtractedContent()[slug];
    if (extracted?.locationNarrative?.trim()) {
      merged.locationNarrative = built.locationNarrative;
    }
    if (extracted?.hotels?.length) {
      merged.hotels = built.hotels;
    }
  }
  return applyManifestAlt(slug, merged, overrides);
}
