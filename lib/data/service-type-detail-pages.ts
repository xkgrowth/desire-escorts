import { allServices, allTypes, type ServiceItem, type TypeItem } from "./services-types";
import wpPages from "../../data/wordpress/nl/pages.json";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Service and Type Detail Page Data
 * 
 * Unified data structure for both /[service-slug] and /[type-slug] pages.
 * Content follows CONTENT_SPECIFICATIONS.mdc guidelines:
 * - Services: 600-1000 words
 * - Types: 500-800 words
 * 
 * Content Source Mix:
 * - 40-60% legacy high-performing content
 * - 20-30% current ranking query alignment
 * - 20-30% growth keyword opportunities
 */

export type FAQItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  slug: string;
  label: string;
  labelEn?: string;
};

export type Step = {
  title: string;
  description: string;
};

export type BenefitItem = {
  title: string;
  description: string;
};

export type ServiceTypeDetailPageData = {
  slug: string;
  pageType: "service" | "type";

  // SEO-optimized title (for <title> tag, different from H1)
  seoTitle?: string;
  seoTitleEn?: string;

  // H1 title
  title: string;
  titleEn: string;
  metaDescription: string;
  metaDescriptionEn: string;

  heroIntro: string;
  heroIntroEn: string;
  usps: string[];
  uspsEn: string[];

  priceFrom: string;
  minDuration: string;
  responseTime: string;

  coreContentTitle: string;
  coreContentTitleEn: string;
  coreContent: string;
  coreContentEn: string;

  // Benefits section (numbered list)
  benefitsTitle?: string;
  benefitsTitleEn?: string;
  benefits?: BenefitItem[];
  benefitsEn?: BenefitItem[];

  // Pricing section
  pricingTitle?: string;
  pricingTitleEn?: string;
  pricingContent?: string;
  pricingContentEn?: string;

  targetAudienceTitle?: string;
  targetAudienceTitleEn?: string;
  targetAudience?: string;
  targetAudienceEn?: string;

  steps?: Step[];
  stepsEn?: Step[];
  stepsEyebrow?: string;
  stepsEyebrowEn?: string;
  stepsTitle?: string;
  stepsTitleEn?: string;

  faqs: FAQItem[];
  faqsEn: FAQItem[];

  relatedServices: RelatedLink[];
  relatedTypes: RelatedLink[];
  relatedLocations: RelatedLink[];

  primaryImageUrl: string;
  primaryImageAlt: string;
  primaryImageAltEn: string;
  ogImageUrl?: string;

  quotePool: string[];

  // Trust signals
  trustBadges?: string[];
  trustBadgesEn?: string[];
};

type WpPage = {
  slug: string;
  content?: {
    rendered?: string;
  };
};

type FirecrawlRenderedPage = {
  markdown?: string;
  metadata?: Record<string, unknown>;
};

type LegacyPageSnapshot = {
  seoTitle?: string;
  heroIntro?: string;
  coreContent?: string;
  benefits?: BenefitItem[];
  pricingTitle?: string;
  pricingContent?: string;
  targetAudience?: string;
  faqs?: FAQItem[];
  imageUrl?: string;
  metaDescription?: string;
};

const defaultServiceImage =
  "https://desire-escorts.nl/wp-content/uploads/hotel-escort-service.jpg";
const defaultTypeImage =
  "https://desire-escorts.nl/wp-content/uploads/aziatische-escort.jpg";

const relatedLocationsDefault: RelatedLink[] = [
  { slug: "escort-amsterdam", label: "Amsterdam" },
  { slug: "escort-rotterdam", label: "Rotterdam" },
  { slug: "escort-den-haag", label: "Den Haag" },
  { slug: "escort-utrecht", label: "Utrecht" },
];

function extractFirstImageUrlFromHtml(contentHtml: string): string | undefined {
  const imageMatch = contentHtml.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
  return imageMatch?.[1];
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&euro;/g, "EUR")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function toParagraphsFromMarkdown(markdown: string): string[] {
  return markdown
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .filter((part) => !part.startsWith("#"))
    .filter((part) => !part.startsWith("![")) // image-only blocks
    .filter((part) => !part.startsWith("[![")) // linked image blocks
    .filter((part) => !/^\[[^\]]+\]\(https?:\/\/[^\)]+\)$/.test(part)) // link-only blocks
    .map((part) => part.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/\*\*/g, "").trim())
    .filter((part) => part.length > 55);
}

function scoreImageCandidate(url: string, slug: string, title: string): number {
  const lowerUrl = url.toLowerCase();
  const slugTokens = slug.toLowerCase().split("-").filter((token) => token.length > 2);
  const titleTokens = title.toLowerCase().split(/\s+/).filter((token) => token.length > 3);

  let score = 0;
  if (lowerUrl.startsWith("https://desire-escorts.nl/wp-content/uploads/")) {
    score += 2;
  }
  if (!/(?:-\d{2,4}x\d{2,4}|\/\d+x\d+|300x|150x)/.test(lowerUrl)) {
    score += 2;
  }
  for (const token of slugTokens) {
    if (lowerUrl.includes(token)) {
      score += 4;
    }
  }
  for (const token of titleTokens) {
    if (lowerUrl.includes(token)) {
      score += 2;
    }
  }
  // Prefer page visuals over profile/gallery thumbnails.
  if (
    /(whatsapp-image|escorts\/|\/blog-|featured-image-158|favicon|logo|avatar|lunnie|brianna|bianca|alexandra|roanna|lavinia)/.test(
      lowerUrl
    )
  ) {
    score -= 4;
  }

  return score;
}

function extractBestImageUrlFromHtml(contentHtml: string, slug: string, title: string): string | undefined {
  const matches = Array.from(contentHtml.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/gi));
  const imageUrls = matches.map((match) => match[1]).filter(Boolean);
  if (imageUrls.length === 0) {
    return undefined;
  }
  const scored = imageUrls
    .map((url) => ({ url, score: scoreImageCandidate(url, slug, title) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.url;
}

function extractBestImageUrlFromMarkdown(
  markdown: string,
  slug: string,
  title: string
): string | undefined {
  const matches = Array.from(markdown.matchAll(/!\[[^\]]*]\((https?:\/\/[^)\s]+)\)/g));
  const imageUrls = matches.map((match) => match[1]).filter(Boolean);
  if (imageUrls.length === 0) {
    return undefined;
  }
  const scored = imageUrls
    .map((url) => ({ url, score: scoreImageCandidate(url, slug, title) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.url;
}

function normalizeTextBlock(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function extractFaqsFromMarkdown(markdown: string): FAQItem[] {
  const faqAnchor = markdown.search(/veelgestelde vragen/i);
  if (faqAnchor === -1) {
    return [];
  }
  const faqSection = markdown.slice(faqAnchor);
  const questionBlocks = Array.from(
    faqSection.matchAll(/###\s+([^\n]+)\n+([\s\S]*?)(?=\n###\s+|\n##\s+|$)/g)
  );
  return questionBlocks
    .map((match) => ({
      question: normalizeTextBlock(match[1] ?? ""),
      answer: normalizeTextBlock(
        (match[2] ?? "")
          .split(/\n{2,}/)
          .map((part) => part.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
          .find((part) => part.length > 35) ?? ""
      ),
    }))
    .filter((item) => item.question.length > 8 && item.answer.length > 30)
    .slice(0, 5);
}

function extractSectionFromMarkdown(markdown: string, headingPattern: RegExp): string | undefined {
  const sections = Array.from(markdown.matchAll(/##\s+([^\n]+)\n+([\s\S]*?)(?=\n##\s+|$)/g));
  const section = sections.find((entry) => headingPattern.test(entry[1] ?? ""));
  if (!section) {
    return undefined;
  }
  const paragraphs = toParagraphsFromMarkdown(section[2] ?? "");
  if (paragraphs.length === 0) {
    return undefined;
  }
  return paragraphs.slice(0, 3).map(normalizeTextBlock).join("\n\n");
}

function extractBenefitsFromMarkdown(markdown: string): BenefitItem[] | undefined {
  const benefitSection = extractSectionFromMarkdown(
    markdown,
    /voordelen|wat .* speciaal|wat maakt .* bijzonder/i
  );
  if (!benefitSection) {
    return undefined;
  }

  const bulletLines = benefitSection
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => normalizeTextBlock(line.replace(/^-+\s*/, "")))
    .filter((line) => line.length > 20);

  if (bulletLines.length > 0) {
    return bulletLines.slice(0, 4).map((line) => {
      const [title, ...rest] = line.split(/[.:]\s+/);
      return {
        title: title?.trim() || "Voordeel",
        description: rest.join(". ").trim() || line,
      };
    });
  }

  const paragraphs = benefitSection
    .split(/\n{2,}/)
    .map(normalizeTextBlock)
    .filter((line) => line.length > 45);

  if (paragraphs.length === 0) {
    return undefined;
  }

  return paragraphs.slice(0, 4).map((line, index) => ({
    title: `Voordeel ${index + 1}`,
    description: line,
  }));
}

function extractPricingFromMarkdown(
  markdown: string
): { pricingTitle?: string; pricingContent?: string } {
  const pricingBlock = extractSectionFromMarkdown(markdown, /prijs|tarief|kosten/i);
  if (!pricingBlock) {
    return {};
  }

  const pricingParagraphs = pricingBlock
    .split(/\n{2,}/)
    .map(normalizeTextBlock)
    .filter((line) => line.length > 35);

  const pricingContent =
    pricingParagraphs.find((line) => /€|eur|prijs|tarief|kosten/i.test(line)) ??
    pricingParagraphs[0];

  if (!pricingContent) {
    return {};
  }

  return {
    pricingTitle: "Tarieven en Verwachting",
    pricingContent,
  };
}

function getFirecrawlRenderedPage(slug: string): FirecrawlRenderedPage | undefined {
  const candidates = [slug];
  if (slug.endsWith("-escort")) {
    candidates.push(`${slug}s`);
  }
  if (slug.endsWith("-escorts")) {
    candidates.push(slug.replace(/-escorts$/, "-escort"));
  }

  for (const candidate of candidates) {
    const filePath = path.join(
      process.cwd(),
      ".firecrawl",
      "rendered",
      "full",
      `desire-escorts.nl__${candidate}.json`
    );
    if (!existsSync(filePath)) {
      continue;
    }
    try {
      return JSON.parse(readFileSync(filePath, "utf-8")) as FirecrawlRenderedPage;
    } catch {
      continue;
    }
  }

  return undefined;
}

function getLegacyPageSnapshot(slug: string, title: string): LegacyPageSnapshot | undefined {
  const firecrawlPage = getFirecrawlRenderedPage(slug);
  const markdown = firecrawlPage?.markdown;
  if (markdown) {
    const allParagraphs = toParagraphsFromMarkdown(markdown);
    const heroIntro = allParagraphs.slice(0, 2).map(normalizeTextBlock).join("\n\n");
    const coreContent =
      extractSectionFromMarkdown(markdown, /wat houdt|wat maakt|de voordelen|wat is/i) ??
      allParagraphs.slice(2, 6).map(normalizeTextBlock).join("\n\n");
    const targetAudience =
      extractSectionFromMarkdown(markdown, /voor wie|hoe contact|hoe boek|waarom kiezen/i) ??
      allParagraphs.slice(6, 8).map(normalizeTextBlock).join("\n\n");
    const faqs = extractFaqsFromMarkdown(markdown);
    const metadataDescription = firecrawlPage?.metadata?.description;
    const metadataTitle = firecrawlPage?.metadata?.title;
    const metaDescription =
      typeof metadataDescription === "string" && metadataDescription.length > 80
        ? normalizeTextBlock(metadataDescription)
        : undefined;
    const seoTitle =
      typeof metadataTitle === "string" && metadataTitle.length > 20
        ? normalizeTextBlock(metadataTitle)
        : undefined;
    const benefits = extractBenefitsFromMarkdown(markdown);
    const pricing = extractPricingFromMarkdown(markdown);
    const imageUrl =
      extractBestImageUrlFromMarkdown(markdown, slug, title) ||
      (typeof firecrawlPage?.metadata?.["og:image"] === "string"
        ? firecrawlPage.metadata["og:image"]
        : undefined);

    return {
      seoTitle,
      heroIntro: heroIntro || undefined,
      coreContent: coreContent || undefined,
      benefits,
      pricingTitle: pricing.pricingTitle,
      pricingContent: pricing.pricingContent,
      targetAudience: targetAudience || undefined,
      faqs: faqs.length > 0 ? faqs : undefined,
      imageUrl,
      metaDescription,
    };
  }

  const wpPage = (wpPages as WpPage[]).find((page) => page.slug === slug);
  const renderedHtml = wpPage?.content?.rendered;
  if (!renderedHtml) {
    return undefined;
  }

  const paragraphMatches = Array.from(renderedHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi));
  const paragraphText = paragraphMatches
    .map((match) => stripHtml(match[1] ?? ""))
    .filter((value) => value.length > 60);

  return {
    heroIntro: paragraphText.slice(0, 2).join("\n\n") || undefined,
    coreContent: paragraphText.slice(2, 5).join("\n\n") || undefined,
    targetAudience: paragraphText.slice(5, 7).join("\n\n") || undefined,
    imageUrl: extractBestImageUrlFromHtml(renderedHtml, slug, title) ?? extractFirstImageUrlFromHtml(renderedHtml),
  };
}

function getLivePageImageBySlug(slug: string): string | undefined {
  const page = (wpPages as WpPage[]).find((item) => item.slug === slug);
  const renderedHtml = page?.content?.rendered;
  if (!renderedHtml) {
    return undefined;
  }
  return extractFirstImageUrlFromHtml(renderedHtml);
}

function buildDefaultFaqs(itemLabel: string, pageType: "service" | "type"): FAQItem[] {
  if (pageType === "service") {
    return [
      {
        question: `Wat houdt ${itemLabel} precies in?`,
        answer: `${itemLabel} wordt volledig op jouw wensen afgestemd, met duidelijke afspraken vooraf en een discrete uitvoering.`,
      },
      {
        question: `Kan ik ${itemLabel} op korte termijn boeken?`,
        answer:
          "Ja, in veel gevallen is last-minute boeken mogelijk. Neem direct contact op voor actuele beschikbaarheid.",
      },
      {
        question: `In welke steden bieden jullie ${itemLabel} aan?`,
        answer:
          "Deze service is beschikbaar in de Randstad en veel andere steden in Nederland, afhankelijk van planning en beschikbaarheid.",
      },
    ];
  }

  return [
    {
      question: `Wat maakt ${itemLabel} bijzonder?`,
      answer: `${itemLabel} is populair door de unieke uitstraling en sfeer. Elk profiel heeft een eigen karakter en stijl.`,
    },
    {
      question: `Kan ik gericht filteren op ${itemLabel}?`,
      answer:
        "Ja, je kunt op deze pagina direct relevante profielen bekijken en vervolgens kiezen op beschikbaarheid en voorkeur.",
    },
    {
      question: `Is ${itemLabel} beschikbaar voor dinner dates of hotelbezoek?`,
      answer:
        "In veel gevallen wel. Bekijk het profiel of neem contact op om je voorkeur en setting vooraf af te stemmen.",
    },
  ];
}

function buildGenericServiceData(service: ServiceItem): ServiceTypeDetailPageData {
  const legacySnapshot = getLegacyPageSnapshot(service.slug, service.label);
  const serviceImage =
    legacySnapshot?.imageUrl || getLivePageImageBySlug(service.slug) || defaultServiceImage;
  const relatedServices = allServices
    .filter((item) => item.slug !== service.slug)
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, label: item.label, labelEn: item.labelEn }));
  const relatedTypes = allTypes
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, label: item.label, labelEn: item.labelEn }));
  const faqs = buildDefaultFaqs(service.label, "service");

  return buildBaseData({
    slug: service.slug,
    pageType: "service",
    title: service.label,
    titleEn: service.labelEn,
    seoTitleOverride: legacySnapshot?.seoTitle,
    shortDescription: service.description,
    shortDescriptionEn: service.descriptionEn,
    imageUrl: serviceImage,
    faqs: legacySnapshot?.faqs?.length ? legacySnapshot.faqs : faqs,
    relatedServices,
    relatedTypes,
    benefitsOverride: legacySnapshot?.benefits,
    pricingTitleOverride: legacySnapshot?.pricingTitle,
    pricingContentOverride: legacySnapshot?.pricingContent,
    trustBadgesOverride: ["Gelicentieerd escortbureau", "24/7 klantenservice", "Veilig en discreet"],
    heroIntroOverride: legacySnapshot?.heroIntro,
    coreContentOverride: legacySnapshot?.coreContent,
    targetAudienceOverride: legacySnapshot?.targetAudience,
    metaDescriptionOverride: legacySnapshot?.metaDescription,
  });
}

function buildGenericTypeData(type: TypeItem): ServiceTypeDetailPageData {
  const legacySnapshot = getLegacyPageSnapshot(type.slug, type.label);
  const typeImage = legacySnapshot?.imageUrl || getLivePageImageBySlug(type.slug) || defaultTypeImage;
  const relatedServices = allServices
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, label: item.label, labelEn: item.labelEn }));
  const relatedTypes = allTypes
    .filter((item) => item.slug !== type.slug)
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, label: item.label, labelEn: item.labelEn }));
  const faqs = buildDefaultFaqs(type.label, "type");

  return buildBaseData({
    slug: type.slug,
    pageType: "type",
    title: type.label,
    titleEn: type.labelEn,
    seoTitleOverride: legacySnapshot?.seoTitle,
    shortDescription: type.description,
    shortDescriptionEn: type.descriptionEn,
    imageUrl: typeImage,
    faqs: legacySnapshot?.faqs?.length ? legacySnapshot.faqs : faqs,
    relatedServices,
    relatedTypes,
    benefitsOverride: legacySnapshot?.benefits,
    pricingTitleOverride: legacySnapshot?.pricingTitle,
    pricingContentOverride: legacySnapshot?.pricingContent,
    trustBadgesOverride: ["Gelicentieerd escortbureau", "21+ geverifieerde profielen", "Discreet in heel Nederland"],
    heroIntroOverride: legacySnapshot?.heroIntro,
    coreContentOverride: legacySnapshot?.coreContent,
    targetAudienceOverride: legacySnapshot?.targetAudience,
    metaDescriptionOverride: legacySnapshot?.metaDescription,
  });
}

type BuildBaseInput = {
  slug: string;
  pageType: "service" | "type";
  title: string;
  titleEn: string;
  seoTitleOverride?: string;
  shortDescription: string;
  shortDescriptionEn: string;
  imageUrl: string;
  faqs: FAQItem[];
  relatedServices: RelatedLink[];
  relatedTypes: RelatedLink[];
  benefitsOverride?: BenefitItem[];
  pricingTitleOverride?: string;
  pricingContentOverride?: string;
  trustBadgesOverride?: string[];
  heroIntroOverride?: string;
  coreContentOverride?: string;
  targetAudienceOverride?: string;
  metaDescriptionOverride?: string;
};

function buildBaseData(input: BuildBaseInput): ServiceTypeDetailPageData {
  const isService = input.pageType === "service";
  const defaultSeoTitle = isService
    ? `${input.title} | Vanaf €160 | 24/7 Discreet`
    : `${input.title} Dames | Vanaf €160 | 24/7 Beschikbaar`;
  const defaultTrustBadges = ["Gelicentieerd escortbureau", "21+ geverifieerde profielen", "Veilig en discreet"];

  return {
    slug: input.slug,
    pageType: input.pageType,
    seoTitle: input.seoTitleOverride ?? defaultSeoTitle,
    title: input.title,
    titleEn: input.titleEn,
    metaDescription:
      input.metaDescriptionOverride ??
      `${input.title} bij Desire Escorts. ${input.shortDescription} Vanaf EUR 160 en 24/7 discreet contact.`,
    metaDescriptionEn: `${input.titleEn} at Desire Escorts. ${input.shortDescriptionEn} From EUR 160 and 24/7 discreet contact.`,
    heroIntro:
      input.heroIntroOverride ??
      `${input.shortDescription} Deze pagina helpt je snel de juiste match te vinden en direct te boeken op basis van beschikbaarheid.`,
    heroIntroEn: `${input.shortDescriptionEn} This page helps you quickly find the right match and book directly based on availability.`,
    usps: ["Vanaf EUR 160 per uur", "24/7 bereikbaar", "Discreet en professioneel"],
    uspsEn: ["From EUR 160 per hour", "Available 24/7", "Discreet and professional"],
    priceFrom: "EUR 160",
    minDuration: "1 uur",
    responseTime: "90 min",
    coreContentTitle: `Waarom ${input.title}?`,
    coreContentTitleEn: `Why ${input.titleEn}?`,
    coreContent:
      input.coreContentOverride ??
      `${input.shortDescription} We werken met duidelijke communicatie, snelle opvolging en een discrete aanpak.`,
    coreContentEn: `${input.shortDescriptionEn} We work with clear communication, fast follow-up and a discreet approach.`,
    benefitsTitle: input.benefitsOverride?.length ? `Voordelen van ${input.title}` : undefined,
    benefitsTitleEn: input.benefitsOverride?.length ? `Benefits of ${input.titleEn}` : undefined,
    benefits: input.benefitsOverride,
    benefitsEn: input.benefitsOverride,
    pricingTitle: input.pricingContentOverride ? input.pricingTitleOverride ?? "Tarieven en Verwachting" : undefined,
    pricingTitleEn: input.pricingContentOverride
      ? input.pricingTitleOverride ?? "Rates and Expectations"
      : undefined,
    pricingContent: input.pricingContentOverride,
    pricingContentEn: input.pricingContentOverride,
    targetAudienceTitle: isService ? `Voor wie is ${input.title}?` : undefined,
    targetAudienceTitleEn: isService ? `Who is ${input.titleEn} for?` : undefined,
    targetAudience: isService
      ? input.targetAudienceOverride ??
        `${input.title} is geschikt voor gasten die comfort, discretie en duidelijke afspraken belangrijk vinden.`
      : undefined,
    targetAudienceEn: isService
      ? `${input.titleEn} is ideal for guests who value comfort, discretion and clear arrangements.`
      : undefined,
    steps: isService
      ? [
          { title: "Deel je voorkeur", description: "Geef locatie, tijd en wensen door." },
          { title: "Kies je match", description: "We sturen passende beschikbare opties." },
          { title: "Boek discreet", description: "Je ontvangt bevestiging en duidelijke afspraken." },
        ]
      : undefined,
    stepsEn: isService
      ? [
          { title: "Share your preference", description: "Send location, timing and wishes." },
          { title: "Choose your match", description: "We send suitable available options." },
          { title: "Book discreetly", description: "You receive confirmation and clear arrangements." },
        ]
      : undefined,
    stepsEyebrow: isService ? "Zo werkt het" : undefined,
    stepsEyebrowEn: isService ? "How it works" : undefined,
    stepsTitle: isService ? `${input.title} boeken in 3 stappen` : undefined,
    stepsTitleEn: isService ? `Book ${input.titleEn} in 3 steps` : undefined,
    faqs: input.faqs,
    faqsEn: input.faqs,
    relatedServices: input.relatedServices,
    relatedTypes: input.relatedTypes,
    relatedLocations: relatedLocationsDefault,
    primaryImageUrl: input.imageUrl,
    primaryImageAlt: `${input.title} - Desire Escorts`,
    primaryImageAltEn: `${input.titleEn} - Desire Escorts`,
    ogImageUrl: input.imageUrl,
    quotePool: [
      "Snelle reactie, duidelijke communicatie en alles netjes geregeld.",
      "Professioneel contact en een prettige ervaring van begin tot eind.",
      "Discreet en betrouwbaar, precies zoals afgesproken.",
    ],
    trustBadges: input.trustBadgesOverride ?? defaultTrustBadges,
    trustBadgesEn: ["Licensed escort agency", "21+ verified profiles", "Safe and discreet"],
  };
}

/**
 * Hotel Escort Service Page Data
 * 
 * Content Mapping:
 * - Terms reinforced: "hotel escort amsterdam", "hotel escort", "escort hotel"
 * - Legacy blocks reused: Hero USPs, discretion messaging, how-it-works flow
 * - Growth terms: "discrete hotelkamer escort", "hotel escort service nederland"
 */
export const hotelEscortPageData: ServiceTypeDetailPageData = {
  slug: "hotel-escort",
  pageType: "service",

  title: "Hotel Escort Service Amsterdam",
  titleEn: "Hotel Escort Service Amsterdam",

  metaDescription:
    "Discrete hotel escort service in Amsterdam en heel Nederland. ✓ Binnen 90 min ✓ Vanaf €160 ✓ Direct naar je kamer. Bel of WhatsApp 24/7.",
  metaDescriptionEn:
    "Discreet hotel escort service in Amsterdam and all of Netherlands. ✓ Within 90 min ✓ From €160 ✓ Direct to your room. Call or WhatsApp 24/7.",

  heroIntro:
    "Op zoek naar een escort bij je hotel? Desire Escorts biedt discrete hotel escort service in Amsterdam en heel Nederland. Onze escorts komen direct naar jouw hotelkamer — zonder melding bij de receptie.",
  heroIntroEn:
    "Looking for an escort at your hotel? Desire Escorts offers discreet hotel escort service in Amsterdam and throughout the Netherlands. Our escorts come directly to your hotel room — without checking in at reception.",

  usps: [
    "Discreet naar jouw kamer",
    "Vanaf €160 per uur",
    "Binnen 90 minuten",
  ],
  uspsEn: [
    "Discreetly to your room",
    "From €160 per hour",
    "Within 90 minutes",
  ],

  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",

  coreContentTitle: "Wat Maakt Onze Hotel Escort Service Uniek?",
  coreContentTitleEn: "What Makes Our Hotel Escort Service Unique?",

  coreContent: `Bij Desire Escorts staat discretie voorop. Onze escorts verschijnen netjes gekleed op jouw hotelkamer zonder zich te melden bij de receptie. In de meeste hotels hebben zij toegang via keycards of toegangscodes, zodat jouw privacy volledig gewaarborgd blijft.

Of je nu verblijft in een vijfsterrenhotel in Amsterdam Centrum, een zakenhotel bij Schiphol, of elders in Nederland — wij regelen gezelschap dat past bij jouw verblijf. Onze dames zijn geselecteerd op discretie, uitstraling en professionaliteit.

Populaire hotels waar wij regelmatig komen zijn onder andere het Waldorf Astoria, Conservatorium Hotel, W Hotel, en diverse Marriott en Hilton locaties. Maar ook in kleinere boetiekhotels en resorts zijn wij welkom.`,

  coreContentEn: `At Desire Escorts, discretion comes first. Our escorts arrive well-dressed at your hotel room without checking in at reception. At most hotels, they have access via key cards or access codes, ensuring your privacy is fully protected.

Whether you're staying at a five-star hotel in Amsterdam Center, a business hotel near Schiphol, or elsewhere in the Netherlands — we arrange companionship that fits your stay. Our ladies are selected for discretion, appearance, and professionalism.

Popular hotels where we regularly visit include the Waldorf Astoria, Conservatorium Hotel, W Hotel, and various Marriott and Hilton locations. But we are also welcome at smaller boutique hotels and resorts.`,

  targetAudienceTitle: "Voor Wie Is Hotel Escort?",
  targetAudienceTitleEn: "Who Is Hotel Escort For?",

  targetAudience: `Onze hotel escort service is ideaal voor zakenreizigers die na een lange dag ontspanning zoeken, toeristen die Amsterdam of andere Nederlandse steden bezoeken, en gasten die de luxe van gezelschap op hun kamer waarderen zonder de deur uit te hoeven.

Of je nu een rustige avond wilt of gezelschap voor een langer verblijf — wij stemmen de ervaring af op jouw wensen.`,

  targetAudienceEn: `Our hotel escort service is ideal for business travelers seeking relaxation after a long day, tourists visiting Amsterdam or other Dutch cities, and guests who appreciate the luxury of companionship in their room without having to go out.

Whether you want a quiet evening or companionship for a longer stay — we tailor the experience to your wishes.`,

  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Hotel Escort Boeken in 4 Stappen",
  stepsTitleEn: "Book Hotel Escort in 4 Steps",

  steps: [
    {
      title: "Neem contact op",
      description:
        "Bel, WhatsApp of chat met ons team. Geef je voorkeuren door: type escort, tijdstip en duur.",
    },
    {
      title: "Deel je hotelgegevens",
      description:
        "Geef je hotelnaam, adres en kamernummer door. Dit blijft strikt vertrouwelijk.",
    },
    {
      title: "Bevestiging ontvangen",
      description:
        "Je ontvangt een bevestiging met de geschatte aankomsttijd. Gemiddeld binnen 90 minuten.",
    },
    {
      title: "Ontvang je escort",
      description:
        "Je escort arriveert discreet. Betaling vindt plaats bij aankomst, contant of pin.",
    },
  ],

  stepsEn: [
    {
      title: "Get in touch",
      description:
        "Call, WhatsApp or chat with our team. Share your preferences: escort type, time and duration.",
    },
    {
      title: "Share hotel details",
      description:
        "Provide your hotel name, address and room number. This remains strictly confidential.",
    },
    {
      title: "Receive confirmation",
      description:
        "You'll receive confirmation with estimated arrival time. Average within 90 minutes.",
    },
    {
      title: "Receive your escort",
      description:
        "Your escort arrives discreetly. Payment takes place upon arrival, cash or card.",
    },
  ],

  faqs: [
    {
      question: "Wat zijn de kosten voor een hotel escort?",
      answer:
        "Onze prijzen beginnen vanaf €160 per uur. Dit is inclusief standaard service en discrete bezorging naar je hotelkamer. Tarieven kunnen variëren per escort en locatie.",
    },
    {
      question: "Hoe snel kan een escort bij mijn hotel zijn?",
      answer:
        "In Amsterdam en omgeving gemiddeld binnen 60-90 minuten. Voor locaties buiten de Randstad kan dit iets langer duren. Bij spoed doen we ons best om sneller te regelen.",
    },
    {
      question: "Komen de escorts discreet aan?",
      answer:
        "Ja, onze escorts melden zich niet bij de receptie. Zij komen direct naar je kamer via lift of trap, vaak met toegang tot keycards. Je privacy is gegarandeerd.",
    },
    {
      question: "Welke hotels bedienen jullie?",
      answer:
        "We leveren in heel Nederland bij vrijwel alle hotels — van vijfsterrenhotels tot boetiekhotels en zakelijke accommodaties. Ook Schiphol Airport hotels bedienen we regelmatig.",
    },
    {
      question: "Kan ik de duur van het bezoek verlengen?",
      answer:
        "Ja, verlengen is mogelijk indien de escort beschikbaar is. Geef dit aan tijdens het bezoek, zodat we de planning kunnen aanpassen.",
    },
  ],

  faqsEn: [
    {
      question: "What are the costs for a hotel escort?",
      answer:
        "Our prices start from €160 per hour. This includes standard service and discreet delivery to your hotel room. Rates may vary per escort and location.",
    },
    {
      question: "How quickly can an escort arrive at my hotel?",
      answer:
        "In Amsterdam and surrounding areas, average within 60-90 minutes. Locations outside the Randstad may take slightly longer. For urgent requests, we do our best to arrange faster.",
    },
    {
      question: "Do the escorts arrive discreetly?",
      answer:
        "Yes, our escorts do not check in at reception. They come directly to your room via elevator or stairs, often with access to key cards. Your privacy is guaranteed.",
    },
    {
      question: "Which hotels do you serve?",
      answer:
        "We deliver throughout the Netherlands at virtually all hotels — from five-star hotels to boutique hotels and business accommodations. We also regularly serve Schiphol Airport hotels.",
    },
    {
      question: "Can I extend the duration of the visit?",
      answer:
        "Yes, extension is possible if the escort is available. Indicate this during the visit so we can adjust the planning.",
    },
  ],

  relatedServices: [
    { slug: "overnight-escort", label: "Overnight Escort", labelEn: "Overnight Escort" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "trio-escorts", label: "Duo Escort", labelEn: "Duo Escort" },
    { slug: "business-escort", label: "Business Escort", labelEn: "Business Escort" },
  ],

  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "high-class-escort", label: "High Class Escort", labelEn: "High Class Escort" },
  ],

  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-amsterdam-centrum", label: "Amsterdam Centrum" },
    { slug: "escort-schiphol", label: "Schiphol" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
    { slug: "escort-utrecht", label: "Utrecht" },
  ],

  primaryImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/hotel-escort-service.jpg",
  primaryImageAlt: "Hotel escort service Amsterdam - discrete escort service naar je hotelkamer",
  primaryImageAltEn: "Hotel escort service Amsterdam - discreet escort service to your hotel room",

  ogImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/featured-image-158.jpg",

  quotePool: [
    "Alles verliep precies zoals afgesproken. Discrete aankomst, geen gedoe.",
    "Perfect geregeld voor mijn verblijf in Amsterdam. Aanrader!",
    "Snelle service en de escort was precies zoals beschreven.",
    "Heel professioneel en discreet. Komt zeker terug.",
  ],
};

/**
 * Aziatische Escorts Type Page Data
 * 
 * Content Mapping:
 * - Terms reinforced: "aziatische escort", "asian escort amsterdam"
 * - Legacy blocks reused: Type description, elegance messaging
 * - Growth terms: "japanse escort", "thaise escort"
 */
export const aziatischeEscortsPageData: ServiceTypeDetailPageData = {
  slug: "aziatische-escorts",
  pageType: "type",

  title: "Aziatische Escorts",
  titleEn: "Asian Escorts",

  metaDescription:
    "Aziatische escorts bij Desire Escorts. Elegante dames met Aziatische achtergrond. ✓ Japans ✓ Thais ✓ Chinees. Vanaf €160, 24/7 beschikbaar.",
  metaDescriptionEn:
    "Asian escorts at Desire Escorts. Elegant ladies with Asian background. ✓ Japanese ✓ Thai ✓ Chinese. From €160, available 24/7.",

  heroIntro:
    "Op zoek naar een Aziatische escort? Ontdek onze selectie elegante escorts met Aziatische achtergrond. Van Japanse subtiliteit tot Thaise warmte — diverse achtergronden voor verschillende voorkeuren.",
  heroIntroEn:
    "Looking for an Asian escort? Discover our selection of elegant escorts with Asian backgrounds. From Japanese subtlety to Thai warmth — diverse backgrounds for different preferences.",

  usps: [
    "Diverse achtergronden",
    "Vanaf €160 per uur",
    "24/7 beschikbaar",
  ],
  uspsEn: [
    "Diverse backgrounds",
    "From €160 per hour",
    "Available 24/7",
  ],

  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",

  coreContentTitle: "Wat Maakt Onze Aziatische Escorts Bijzonder?",
  coreContentTitleEn: "What Makes Our Asian Escorts Special?",

  coreContent: `Onze Aziatische escorts combineren elegantie met warmte en zijn populair bij internationale zakenreizigers en gasten die verfijnd gezelschap zoeken. Elke escort heeft haar eigen unieke achtergrond en persoonlijkheid.

Van Japanse verfijning en aandacht voor detail tot Thaise hartelijkheid en gastvrijheid — onze Aziatische escorts bieden een diverse range aan persoonlijkheden en stijlen. Veel van onze dames spreken meerdere talen, waaronder Nederlands en Engels.

Of je nu op zoek bent naar een rustige avond of gezelschap voor een zakelijk diner, onze Aziatische escorts passen zich moeiteloos aan verschillende situaties aan.`,

  coreContentEn: `Our Asian escorts combine elegance with warmth and are popular among international business travelers and guests seeking refined companionship. Each escort has her own unique background and personality.

From Japanese refinement and attention to detail to Thai hospitality and warmth — our Asian escorts offer a diverse range of personalities and styles. Many of our ladies speak multiple languages, including Dutch and English.

Whether you're looking for a quiet evening or companionship for a business dinner, our Asian escorts adapt effortlessly to different situations.`,

  faqs: [
    {
      question: "Welke nationaliteiten hebben de Aziatische escorts?",
      answer:
        "Onze Aziatische escorts komen uit diverse landen, waaronder Japan, Thailand, China, Korea, Vietnam en de Filipijnen. Elk profiel vermeldt de achtergrond.",
    },
    {
      question: "Spreken de Aziatische escorts Nederlands?",
      answer:
        "Veel van onze Aziatische escorts spreken Nederlands, Engels of beide. Bekijk het profiel voor taalvaardigheden, of vraag ons team om een match op basis van taalvoorkeur.",
    },
    {
      question: "Kan ik een Aziatische escort boeken voor een diner?",
      answer:
        "Ja, onze Aziatische escorts zijn beschikbaar voor dinner dates en sociale gelegenheden. Zij zijn gewend aan diverse settings en passen zich elegant aan.",
    },
  ],

  faqsEn: [
    {
      question: "What nationalities do the Asian escorts have?",
      answer:
        "Our Asian escorts come from various countries, including Japan, Thailand, China, Korea, Vietnam and the Philippines. Each profile mentions the background.",
    },
    {
      question: "Do the Asian escorts speak Dutch?",
      answer:
        "Many of our Asian escorts speak Dutch, English or both. Check the profile for language skills, or ask our team for a match based on language preference.",
    },
    {
      question: "Can I book an Asian escort for dinner?",
      answer:
        "Yes, our Asian escorts are available for dinner dates and social occasions. They are used to various settings and adapt elegantly.",
    },
  ],

  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
  ],

  relatedTypes: [
    { slug: "japanse-escort", label: "Japanse Escort", labelEn: "Japanese Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
  ],

  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
    { slug: "escort-utrecht", label: "Utrecht" },
  ],

  primaryImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/aziatische-escort.jpg",
  primaryImageAlt: "Aziatische escort - elegante dame met Aziatische achtergrond",
  primaryImageAltEn: "Asian escort - elegant lady with Asian background",

  ogImageUrl:
    "https://desire-escorts.nl/wp-content/uploads/featured-image-158.jpg",

  quotePool: [
    "Heel elegante dame, precies wat ik zocht.",
    "Vriendelijk, warm en attent. Echt een fijne avond gehad.",
    "Perfecte match voor een zakelijk diner. Zeer tevreden.",
  ],
};

/**
 * Anale Seks Service Page Data
 *
 * Content Mapping (per CONTENT_SPECIFICATIONS.mdc):
 * - Primary term: "escort anaal" (235 clicks, pos 3.26)
 * - Supporting terms: "anaal escort", "anale escort"
 * - Legacy blocks reused: Benefits structure, pricing section, FAQs
 * - Growth terms: "anale escort service", "escort anaal boeken"
 *
 * Optimizations applied:
 * - SEO title front-loads primary keyword + price + trust signal
 * - Hero intro is rewritten (not copied) for concise value prop
 * - Core content optimized for AI extraction (direct answers)
 * - Benefits preserved but tightened
 * - FAQs are actual FAQs only (no blog/legal content)
 * - Pricing section added (was missing from template)
 */
export const analeSeksPageData: ServiceTypeDetailPageData = {
  slug: "anale-seks",
  pageType: "service",

  seoTitle: "Escort Anaal - Prijzen vanaf €160 | 24/7 Discreet",
  seoTitleEn: "Anal Escort - Prices from €160 | 24/7 Discreet",

  title: "Anale Escort Service",
  titleEn: "Anal Escort Service",

  metaDescription:
    "Boek een anale escort bij Desire Escorts. ✓ Ervaren dames ✓ Vanaf €160 ✓ Discreet en veilig ✓ 24/7 beschikbaar in heel Nederland. Neem direct contact op.",
  metaDescriptionEn:
    "Book an anal escort at Desire Escorts. ✓ Experienced ladies ✓ From €160 ✓ Discreet and safe ✓ Available 24/7 throughout the Netherlands. Contact us now.",

  heroIntro:
    "Op zoek naar een escort die openstaat voor anale seks? Bij Desire Escorts vind je ervaren dames die deze intieme service op een veilige en discrete manier aanbieden. Altijd met respect voor jouw wensen en grenzen.",
  heroIntroEn:
    "Looking for an escort open to anal sex? At Desire Escorts you'll find experienced ladies who offer this intimate service in a safe and discreet manner. Always respecting your wishes and boundaries.",

  usps: ["Ervaren & discreet", "Vanaf €160", "24/7 beschikbaar"],
  uspsEn: ["Experienced & discreet", "From €160", "Available 24/7"],

  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",

  coreContentTitle: "Wat houdt onze Anale Escort Service in?",
  coreContentTitleEn: "What does our Anal Escort Service include?",

  coreContent: `Bij Desire Escorts hebben we dames beschikbaar die openstaan voor anale seks. Dit is een gespecialiseerde service waarbij de focus ligt op anale stimulatie en seks, altijd in overleg met de escort.

Het is aan de dame om te beslissen of zij kiest voor anale seks. Onze escorts zijn ervaren in het bieden van deze intieme vorm van genot en zorgen voor een veilige, comfortabele ervaring waarbij jouw wensen en grenzen worden gerespecteerd.

Voor de veiligheid en hygiëne gebruiken onze dames altijd een condoom. De sessie wordt volledig afgestemd op jouw comfortniveau.`,

  coreContentEn: `At Desire Escorts we have ladies available who are open to anal sex. This is a specialized service focusing on anal stimulation and sex, always in consultation with the escort.

It is up to the lady to decide if she chooses anal sex. Our escorts are experienced in providing this intimate form of pleasure and ensure a safe, comfortable experience where your wishes and boundaries are respected.

For safety and hygiene, our ladies always use a condom. The session is fully tailored to your comfort level.`,

  benefitsTitle: "Voordelen van Anale Seks bij Desire Escorts",
  benefitsTitleEn: "Benefits of Anal Sex at Desire Escorts",

  benefits: [
    {
      title: "Professionele en ervaren dames",
      description:
        "Onze escorts zijn getraind en ervaren. Ze weten hoe ze je op een veilige en comfortabele manier kunnen verwennen.",
    },
    {
      title: "Persoonlijke aandacht",
      description:
        "Elke sessie wordt afgestemd op jouw wensen en grenzen. Onze dames luisteren en zorgen voor een unieke ervaring.",
    },
    {
      title: "Discretie en veiligheid",
      description:
        "Bij Desire Escorts staat discretie voorop. We gebruiken altijd condooms voor veiligheid en hygiëne.",
    },
    {
      title: "Flexibiliteit in locatie",
      description:
        "Kies voor een sessie in een hotel, bij je thuis of op een andere locatie. Wij regelen alles tot in de puntjes.",
    },
    {
      title: "Breed scala aan diensten",
      description:
        "Naast anale escort service bieden we ook andere services aan, zodat je altijd kunt kiezen wat bij je past.",
    },
  ],

  benefitsEn: [
    {
      title: "Professional and experienced ladies",
      description:
        "Our escorts are trained and experienced. They know how to pamper you in a safe and comfortable way.",
    },
    {
      title: "Personal attention",
      description:
        "Each session is tailored to your wishes and boundaries. Our ladies listen and ensure a unique experience.",
    },
    {
      title: "Discretion and safety",
      description:
        "At Desire Escorts, discretion comes first. We always use condoms for safety and hygiene.",
    },
    {
      title: "Flexibility in location",
      description:
        "Choose a session at a hotel, your home or another location. We arrange everything perfectly.",
    },
    {
      title: "Wide range of services",
      description:
        "Besides anal escort service, we offer other services so you can always choose what suits you.",
    },
  ],

  pricingTitle: "Tarieven Anale Escort",
  pricingTitleEn: "Anal Escort Rates",

  pricingContent:
    "Onze prijzen beginnen bij €160 per uur. De exacte prijs kan variëren afhankelijk van de duur en locatie. Bekijk onze prijslijst voor een compleet overzicht, zodat je precies weet wat je kunt verwachten.",
  pricingContentEn:
    "Our prices start at €160 per hour. The exact price may vary depending on duration and location. Check our price list for a complete overview, so you know exactly what to expect.",

  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Anale Escort Boeken in 3 Stappen",
  stepsTitleEn: "Book Anal Escort in 3 Steps",

  steps: [
    {
      title: "Neem contact op",
      description: "Bel, WhatsApp of mail ons met je voorkeuren: type escort, tijdstip en duur.",
    },
    {
      title: "Bespreek je wensen",
      description: "Communiceer duidelijk je grenzen. Onze dames respecteren altijd jouw comfort.",
    },
    {
      title: "Ontvang je escort",
      description: "Je escort arriveert discreet. Betaling bij aankomst, contant of pin.",
    },
  ],

  stepsEn: [
    {
      title: "Get in touch",
      description: "Call, WhatsApp or email us with your preferences: escort type, time and duration.",
    },
    {
      title: "Discuss your wishes",
      description: "Clearly communicate your boundaries. Our ladies always respect your comfort.",
    },
    {
      title: "Receive your escort",
      description: "Your escort arrives discreetly. Payment upon arrival, cash or card.",
    },
  ],

  faqs: [
    {
      question: "Hoe boek ik een anale escort bij Desire Escorts?",
      answer:
        "Kies de dame die bij je past en neem contact op via WhatsApp, telefoon of e-mail. Geef je voorkeuren door en wij regelen de rest discreet en snel.",
    },
    {
      question: "Is mijn privacy gewaarborgd?",
      answer:
        "Ja, discretie staat bij ons voorop. Alle communicatie en boekingen worden vertrouwelijk behandeld. Je kunt volledig ontspannen genieten van je ervaring.",
    },
    {
      question: "Hoe bereid ik me voor op de sessie?",
      answer:
        "We raden aan om schoon en ontspannen te zijn. Een warme douche vooraf helpt. Communiceer duidelijk je wensen en grenzen met de escort.",
    },
    {
      question: "Wat zijn de kosten?",
      answer:
        "Onze prijzen beginnen bij €160 per uur. De exacte prijs hangt af van duur en locatie. Bekijk onze prijslijst voor details.",
    },
    {
      question: "In welke steden is deze service beschikbaar?",
      answer:
        "Anale escort service is beschikbaar in heel Nederland, inclusief Amsterdam, Rotterdam, Den Haag, Utrecht en omgeving.",
    },
  ],

  faqsEn: [
    {
      question: "How do I book an anal escort at Desire Escorts?",
      answer:
        "Choose the lady that suits you and contact us via WhatsApp, phone or email. Share your preferences and we'll arrange everything discreetly and quickly.",
    },
    {
      question: "Is my privacy guaranteed?",
      answer:
        "Yes, discretion is our priority. All communication and bookings are treated confidentially. You can fully relax and enjoy your experience.",
    },
    {
      question: "How do I prepare for the session?",
      answer:
        "We recommend being clean and relaxed. A warm shower beforehand helps. Clearly communicate your wishes and boundaries with the escort.",
    },
    {
      question: "What are the costs?",
      answer:
        "Our prices start at €160 per hour. The exact price depends on duration and location. Check our price list for details.",
    },
    {
      question: "In which cities is this service available?",
      answer:
        "Anal escort service is available throughout the Netherlands, including Amsterdam, Rotterdam, The Hague, Utrecht and surrounding areas.",
    },
  ],

  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "overnight-escort", label: "Overnight Escort", labelEn: "Overnight Escort" },
    { slug: "bdsm-escorts", label: "BDSM Escorts", labelEn: "BDSM Escorts" },
  ],

  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
  ],

  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
    { slug: "escort-utrecht", label: "Utrecht" },
    { slug: "escort-eindhoven", label: "Eindhoven" },
  ],

  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/anale-seks-escort.jpg",
  primaryImageAlt: "Anale escort service - discrete en ervaren dames",
  primaryImageAltEn: "Anal escort service - discreet and experienced ladies",

  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/anale-seks-escort.jpg",

  quotePool: [
    "Professioneel en discreet, precies zoals beloofd.",
    "Prettige communicatie en een fijne ervaring.",
    "Alles was goed geregeld, zeker een aanrader.",
  ],

  trustBadges: [
    "Gelicentieerd escortbureau",
    "21+ geverifieerde dames",
    "Veilig en discreet",
  ],
  trustBadgesEn: [
    "Licensed escort agency",
    "21+ verified ladies",
    "Safe and discreet",
  ],
};

/**
 * Trio Escorts Service Page
 * Search Console: ~1,271 combined clicks ("trio escort", "escort trio", "escort voor trio")
 */
export const trioEscortsPageData: ServiceTypeDetailPageData = {
  slug: "trio-escorts",
  pageType: "service",
  seoTitle: "Trio Escort - 2 Dames vanaf €320 | 24/7 Discreet",
  title: "Trio Escorts",
  titleEn: "Trio Escorts",
  metaDescription:
    "Boek een trio met twee escorts bij Desire Escorts. ✓ Vanaf €320 voor 2 dames ✓ Ook voor stellen ✓ Discreet en ervaren ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book a trio with two escorts at Desire Escorts. ✓ From €320 for 2 ladies ✓ Also for couples ✓ Discreet and experienced ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Fantaseer je over een trio? Bij Desire Escorts boek je twee escorts voor een onvergetelijke ervaring. Sommige dames werken als vast duo, andere zijn te combineren op aanvraag. Ook beschikbaar voor stellen die samen willen genieten.",
  heroIntroEn:
    "Fantasizing about a trio? At Desire Escorts you can book two escorts for an unforgettable experience. Some ladies work as a fixed duo, others can be combined on request. Also available for couples who want to enjoy together.",
  usps: ["2 dames vanaf €320", "Ook voor stellen", "24/7 beschikbaar"],
  uspsEn: ["2 ladies from €320", "Also for couples", "Available 24/7"],
  priceFrom: "€320",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Wat houdt een Trio Escort in?",
  coreContentTitleEn: "What does a Trio Escort include?",
  coreContent: `Bij een trio escort boek je twee dames die je samen verwennen. Dit kan op verschillende manieren: een sensuele vierhanden massage, intiem contact met beiden, of een show waarbij de dames elkaar en jou plezieren.

Sommige van onze escorts werken als vast duo en kennen elkaar goed. Andere dames zijn op aanvraag te combineren. Wij adviseren graag welke combinatie het beste bij jouw wensen past.

Een trio is ook mogelijk met je partner. Niet alle escorts zijn hiervoor beschikbaar — dit wordt vermeld op het profiel. Na overleg bevestigen wij de mogelijkheden.`,
  coreContentEn: `With a trio escort you book two ladies who pamper you together. This can be done in various ways: a sensual four-hand massage, intimate contact with both, or a show where the ladies pleasure each other and you.

Some of our escorts work as a fixed duo and know each other well. Other ladies can be combined on request. We are happy to advise which combination best suits your wishes.

A trio is also possible with your partner. Not all escorts are available for this — this is indicated on the profile. After consultation we confirm the possibilities.`,
  benefitsTitle: "Voordelen van een Trio bij Desire Escorts",
  benefitsTitleEn: "Benefits of a Trio at Desire Escorts",
  benefits: [
    { title: "Dubbel genot", description: "Twee dames die volledig op jou gericht zijn voor een intense ervaring." },
    { title: "Flexibele invulling", description: "Van sensuele massage tot intiem contact — jij bepaalt de sfeer." },
    { title: "Ook voor stellen", description: "Voeg samen een derde persoon toe aan jullie relatie." },
    { title: "Vaste duo's beschikbaar", description: "Dames die elkaar kennen zorgen voor natuurlijke chemie." },
  ],
  benefitsEn: [
    { title: "Double pleasure", description: "Two ladies fully focused on you for an intense experience." },
    { title: "Flexible arrangement", description: "From sensual massage to intimate contact — you set the mood." },
    { title: "Also for couples", description: "Add a third person to your relationship together." },
    { title: "Fixed duos available", description: "Ladies who know each other ensure natural chemistry." },
  ],
  pricingTitle: "Tarieven Trio Escort",
  pricingTitleEn: "Trio Escort Rates",
  pricingContent:
    "Een trio met twee escorts begint bij €320 per uur. Voor een trio samen met je partner starten de prijzen bij €160. De exacte prijs hangt af van de gekozen dames en duur.",
  pricingContentEn:
    "A trio with two escorts starts at €320 per hour. For a trio with your partner, prices start at €160. The exact price depends on the chosen ladies and duration.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Trio Boeken in 3 Stappen",
  stepsTitleEn: "Book a Trio in 3 Steps",
  steps: [
    { title: "Neem contact op", description: "Vertel ons je voorkeuren: type dames, tijdstip en of het met of zonder partner is." },
    { title: "Ontvang ons advies", description: "We stellen een passend duo samen of bevestigen beschikbaarheid voor stellen." },
    { title: "Geniet van je trio", description: "De dames arriveren samen en discreet. Betaling bij aankomst." },
  ],
  stepsEn: [
    { title: "Get in touch", description: "Tell us your preferences: type of ladies, timing and whether with or without partner." },
    { title: "Receive our advice", description: "We put together a suitable duo or confirm availability for couples." },
    { title: "Enjoy your trio", description: "The ladies arrive together and discreetly. Payment upon arrival." },
  ],
  faqs: [
    { question: "Hoe boek ik een trio met twee dames?", answer: "Neem contact op via WhatsApp of telefoon. We bespreken je voorkeuren en stellen een passend duo samen op basis van beschikbaarheid." },
    { question: "Kan ik zelf de dames kiezen?", answer: "Ja, je kunt je voorkeur aangeven. We laten weten welke dames beschikbaar zijn en als duo kunnen werken." },
    { question: "Is een trio ook mogelijk voor stellen?", answer: "Ja, sommige escorts zijn beschikbaar voor stellen. Dit staat vermeld op het profiel of je kunt het navragen." },
    { question: "Wat kost een trio?", answer: "Een trio met twee escorts begint bij €320 per uur. Met je eigen partner vanaf €160." },
    { question: "Hoe verloopt een trio qua activiteiten?", answer: "Dat bepaal je zelf in overleg met de dames. Van massage tot intiem contact, alles wordt vooraf afgestemd." },
  ],
  faqsEn: [
    { question: "How do I book a trio with two ladies?", answer: "Contact us via WhatsApp or phone. We discuss your preferences and put together a suitable duo based on availability." },
    { question: "Can I choose the ladies myself?", answer: "Yes, you can indicate your preference. We let you know which ladies are available and can work as a duo." },
    { question: "Is a trio also possible for couples?", answer: "Yes, some escorts are available for couples. This is indicated on the profile or you can inquire." },
    { question: "What does a trio cost?", answer: "A trio with two escorts starts at €320 per hour. With your own partner from €160." },
    { question: "How does a trio work in terms of activities?", answer: "You decide that yourself in consultation with the ladies. From massage to intimate contact, everything is coordinated in advance." },
  ],
  relatedServices: [
    { slug: "escort-voor-stellen", label: "Escort voor Stellen", labelEn: "Couples Escort" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "overnight-escort", label: "Overnight Escort", labelEn: "Overnight Escort" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
    { slug: "escort-utrecht", label: "Utrecht" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/trio-escorts.jpg",
  primaryImageAlt: "Trio escorts - twee dames voor een onvergetelijke ervaring",
  primaryImageAltEn: "Trio escorts - two ladies for an unforgettable experience",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/trio-escorts.jpg",
  quotePool: [
    "Perfect geregeld, beide dames waren geweldig samen.",
    "Een ervaring om nooit te vergeten. Zeker een aanrader.",
    "Professioneel en discreet, precies wat we zochten.",
  ],
  trustBadges: ["Gelicentieerd escortbureau", "Vaste duo's beschikbaar", "Discreet en veilig"],
  trustBadgesEn: ["Licensed escort agency", "Fixed duos available", "Discreet and safe"],
};

/**
 * Erotische Massage Service Page
 * Search Console: ~950 combined clicks ("erotische massage", "erotische massage escort")
 */
export const erotischeMassagePageData: ServiceTypeDetailPageData = {
  slug: "erotische-massage",
  pageType: "service",
  seoTitle: "Erotische Massage - Sensuele Verwennerij | Vanaf €160",
  title: "Erotische Massage",
  titleEn: "Erotic Massage",
  metaDescription:
    "Boek een erotische massage bij Desire Escorts. ✓ Sensuele verwennerij ✓ Ervaren masseuses ✓ Incall & outcall ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book an erotic massage at Desire Escorts. ✓ Sensual pampering ✓ Experienced masseuses ✓ Incall & outcall ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Laat je verwennen met een erotische massage door een van onze sensuele dames. Combineer ontspanning met opwinding in een sfeervolle setting. Beschikbaar als incall bij de dame of outcall bij jou thuis of in een hotel.",
  heroIntroEn:
    "Let yourself be pampered with an erotic massage by one of our sensual ladies. Combine relaxation with excitement in an atmospheric setting. Available as incall at the lady's place or outcall at your home or hotel.",
  usps: ["Sensuele verwennerij", "Incall & outcall", "Ervaren masseuses"],
  uspsEn: ["Sensual pampering", "Incall & outcall", "Experienced masseuses"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Wat is een Erotische Massage?",
  coreContentTitleEn: "What is an Erotic Massage?",
  coreContent: `Een erotische massage combineert professionele massagetechnieken met sensuele aanrakingen over het hele lichaam. Het draait om spanning, ontspanning en opbouwende spanning.

Onze masseuses zijn getraind in verschillende technieken. Van langzame, verleidelijke stroken tot intensere body-to-body momenten. De massage kan eindigen zoals jij dat wilt — van ontspannen happy ending tot verdere intimiteit.

De setting maakt het compleet: gedimde verlichting, warme olie en een rustige sfeer zorgen voor totale overgave.`,
  coreContentEn: `An erotic massage combines professional massage techniques with sensual touches across the entire body. It's about tension, relaxation and building tension.

Our masseuses are trained in various techniques. From slow, seductive strokes to more intense body-to-body moments. The massage can end however you like — from a relaxing happy ending to further intimacy.

The setting completes it: dimmed lighting, warm oil and a calm atmosphere ensure complete surrender.`,
  benefitsTitle: "Voordelen van Erotische Massage",
  benefitsTitleEn: "Benefits of Erotic Massage",
  benefits: [
    { title: "Totale ontspanning", description: "Los spanning kwijt terwijl je geniet van sensueel contact." },
    { title: "Ervaren handen", description: "Onze dames kennen de kunst van verleidelijke aanraking." },
    { title: "Flexibele locatie", description: "Bij de dame thuis, in jouw hotel of aan huis." },
    { title: "Naar wens af te ronden", description: "Van happy ending tot volledige intimiteit." },
  ],
  benefitsEn: [
    { title: "Total relaxation", description: "Release tension while enjoying sensual contact." },
    { title: "Experienced hands", description: "Our ladies know the art of seductive touch." },
    { title: "Flexible location", description: "At the lady's home, in your hotel or at home." },
    { title: "Finish as desired", description: "From happy ending to full intimacy." },
  ],
  pricingTitle: "Tarieven Erotische Massage",
  pricingTitleEn: "Erotic Massage Rates",
  pricingContent:
    "Een erotische massage begint bij €160 per uur. Langere sessies beschikbaar voor diepe ontspanning. De prijs is inclusief warme olie en sfeervolle setting.",
  pricingContentEn:
    "An erotic massage starts at €160 per hour. Longer sessions available for deep relaxation. The price includes warm oil and atmospheric setting.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Erotische Massage Boeken",
  stepsTitleEn: "Book Erotic Massage",
  steps: [
    { title: "Kies je masseuse", description: "Bekijk profielen en selecteer een dame die bij je past." },
    { title: "Plan je afspraak", description: "Kies incall of outcall, geef datum en tijd door." },
    { title: "Geniet van verwennerij", description: "Laat je volledig gaan in handen van een expert." },
  ],
  stepsEn: [
    { title: "Choose your masseuse", description: "Browse profiles and select a lady that suits you." },
    { title: "Plan your appointment", description: "Choose incall or outcall, provide date and time." },
    { title: "Enjoy pampering", description: "Let yourself go completely in the hands of an expert." },
  ],
  faqs: [
    { question: "Wat houdt een erotische massage in?", answer: "Een combinatie van massagetechnieken met sensuele aanrakingen. De intensiteit en afronding bepaal je zelf." },
    { question: "Is er een verschil met een happy ending massage?", answer: "Een happy ending is een vorm van afronding. Bij ons kun je zelf aangeven hoe je de massage wilt afsluiten." },
    { question: "Kan ik ook body-to-body massage boeken?", answer: "Ja, veel van onze dames bieden body-to-body als onderdeel van de erotische massage." },
    { question: "Waar vindt de massage plaats?", answer: "Incall bij de dame of outcall bij jou thuis/hotel. Bij outcall nemen we alles mee." },
  ],
  faqsEn: [
    { question: "What does an erotic massage include?", answer: "A combination of massage techniques with sensual touches. You determine the intensity and finish yourself." },
    { question: "Is there a difference with a happy ending massage?", answer: "A happy ending is a form of finish. With us you can indicate how you want to end the massage." },
    { question: "Can I also book a body-to-body massage?", answer: "Yes, many of our ladies offer body-to-body as part of the erotic massage." },
    { question: "Where does the massage take place?", answer: "Incall at the lady's or outcall at your home/hotel. For outcall we bring everything." },
  ],
  relatedServices: [
    { slug: "nuru-massage", label: "Nuru Massage", labelEn: "Nuru Massage" },
    { slug: "tantra-massage", label: "Tantra Massage", labelEn: "Tantra Massage" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/erotische-massage.jpg",
  primaryImageAlt: "Erotische massage - sensuele verwennerij",
  primaryImageAltEn: "Erotic massage - sensual pampering",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/erotische-massage.jpg",
  quotePool: [
    "Precies de ontspanning die ik nodig had.",
    "Geweldige handen, fantastische ervaring.",
    "Combinatie van massage en sensualiteit was perfect.",
  ],
  trustBadges: ["Ervaren masseuses", "Warme olie & sfeer", "Discreet en veilig"],
  trustBadgesEn: ["Experienced masseuses", "Warm oil & atmosphere", "Discreet and safe"],
};

/**
 * GFE Escorts Service Page (Girlfriend Experience)
 * Search Console: ~820 combined clicks ("gfe escort", "girlfriend experience escort")
 */
export const gfeEscortsPageData: ServiceTypeDetailPageData = {
  slug: "gfe-escorts",
  pageType: "service",
  seoTitle: "Girlfriend Experience (GFE) | Intieme Escort | Vanaf €160",
  title: "Girlfriend Experience",
  titleEn: "Girlfriend Experience",
  metaDescription:
    "Boek een Girlfriend Experience bij Desire Escorts. ✓ Intieme connectie ✓ Echte chemie ✓ Meer dan alleen fysiek ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book a Girlfriend Experience at Desire Escorts. ✓ Intimate connection ✓ Real chemistry ✓ More than just physical ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Verlang je naar meer dan alleen een fysieke ontmoeting? De Girlfriend Experience biedt intieme momenten met echte connectie. Verwacht zoenen, knuffelen, leuke gesprekken en oprechte aandacht — alsof je samen bent met een vriendin.",
  heroIntroEn:
    "Do you desire more than just a physical encounter? The Girlfriend Experience offers intimate moments with real connection. Expect kissing, cuddling, nice conversations and genuine attention — as if you're with a girlfriend.",
  usps: ["Intieme connectie", "Kussen & knuffelen", "Oprechte aandacht"],
  uspsEn: ["Intimate connection", "Kissing & cuddling", "Genuine attention"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Wat is de Girlfriend Experience?",
  coreContentTitleEn: "What is the Girlfriend Experience?",
  coreContent: `De Girlfriend Experience (GFE) gaat verder dan een standaard escortafspraak. Het draait om echte verbinding: intieme gesprekken, liefdevolle aanrakingen, zoenen en de warmte van een romantische relatie.

Onze GFE escorts zijn geselecteerd op hun vermogen om oprechte connectie te maken. Ze nemen de tijd, luisteren echt en zorgen dat je je speciaal voelt. Of het nu een romantisch diner is of een avond op de hotelkamer — het voelt authentiek.

GFE is ideaal voor wie de emotionele kant van intimiteit mist. Geen haast, geen zakelijke sfeer, maar warmte en genegenheid.`,
  coreContentEn: `The Girlfriend Experience (GFE) goes beyond a standard escort appointment. It's about real connection: intimate conversations, loving touches, kissing and the warmth of a romantic relationship.

Our GFE escorts are selected for their ability to make genuine connections. They take time, really listen and make sure you feel special. Whether it's a romantic dinner or an evening in the hotel room — it feels authentic.

GFE is ideal for those who miss the emotional side of intimacy. No rush, no businesslike atmosphere, but warmth and affection.`,
  benefitsTitle: "Wat maakt GFE anders?",
  benefitsTitleEn: "What makes GFE different?",
  benefits: [
    { title: "Echte chemie", description: "Onze GFE dames maken oprecht contact, geen act." },
    { title: "Intiem & romantisch", description: "Zoenen, knuffelen en liefdevolle momenten zijn standaard." },
    { title: "Geen tijdsdruk", description: "We raden minimaal 2 uur aan om echt te connecten." },
    { title: "Perfect voor alleengaanden", description: "Mis je de warmte van een relatie? GFE vult dat gat." },
  ],
  benefitsEn: [
    { title: "Real chemistry", description: "Our GFE ladies make genuine contact, no act." },
    { title: "Intimate & romantic", description: "Kissing, cuddling and loving moments are standard." },
    { title: "No time pressure", description: "We recommend at least 2 hours to really connect." },
    { title: "Perfect for singles", description: "Missing the warmth of a relationship? GFE fills that gap." },
  ],
  pricingTitle: "Tarieven Girlfriend Experience",
  pricingTitleEn: "Girlfriend Experience Rates",
  pricingContent:
    "GFE begint bij €160 per uur. We raden 2 uur of langer aan voor de volledige ervaring. Langere boekingen zoals dinner dates of overnachtingen zijn ideaal voor GFE.",
  pricingContentEn:
    "GFE starts at €160 per hour. We recommend 2 hours or longer for the full experience. Longer bookings like dinner dates or overnight stays are ideal for GFE.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "GFE Escort Boeken",
  stepsTitleEn: "Book GFE Escort",
  steps: [
    { title: "Kies je match", description: "Selecteer een dame waarvan je denkt dat de klik er kan zijn." },
    { title: "Plan je date", description: "GFE werkt het beste met langere afspraken. Kies 2 uur of meer." },
    { title: "Ervaar echte connectie", description: "Geniet van een date die voelt als een echte relatie." },
  ],
  stepsEn: [
    { title: "Choose your match", description: "Select a lady you think you could connect with." },
    { title: "Plan your date", description: "GFE works best with longer appointments. Choose 2 hours or more." },
    { title: "Experience real connection", description: "Enjoy a date that feels like a real relationship." },
  ],
  faqs: [
    { question: "Wat is het verschil tussen GFE en een normale escort?", answer: "GFE legt nadruk op emotionele connectie. Verwacht zoenen, knuffelen, gesprekken en romantische momenten — niet alleen fysieke intimiteit." },
    { question: "Bieden alle escorts GFE aan?", answer: "Nee, GFE vereist een bepaalde persoonlijkheid. Op profielen staat of een dame GFE aanbiedt." },
    { question: "Hoe lang duurt een GFE date?", answer: "We raden minimaal 2 uur aan. Langere boekingen zoals overnachtingen zijn ideaal voor de volledige ervaring." },
    { question: "Is zoenen inbegrepen bij GFE?", answer: "Ja, Frans zoenen is standaard onderdeel van de Girlfriend Experience bij onze escorts." },
  ],
  faqsEn: [
    { question: "What is the difference between GFE and a normal escort?", answer: "GFE emphasizes emotional connection. Expect kissing, cuddling, conversations and romantic moments — not just physical intimacy." },
    { question: "Do all escorts offer GFE?", answer: "No, GFE requires a certain personality. Profiles indicate whether a lady offers GFE." },
    { question: "How long does a GFE date last?", answer: "We recommend at least 2 hours. Longer bookings like overnight stays are ideal for the full experience." },
    { question: "Is kissing included in GFE?", answer: "Yes, French kissing is a standard part of the Girlfriend Experience with our escorts." },
  ],
  relatedServices: [
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "escort-voor-stellen", label: "Escort voor Stellen", labelEn: "Couples Escort" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/gfe-escort.jpg",
  primaryImageAlt: "Girlfriend Experience - intieme escort service",
  primaryImageAltEn: "Girlfriend Experience - intimate escort service",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/gfe-escort.jpg",
  quotePool: [
    "Het voelde echt als een date, niet als een transactie.",
    "Eindelijk iemand die luistert en oprecht geïnteresseerd is.",
    "De beste GFE ervaring die ik heb gehad.",
  ],
  trustBadges: ["Echte connectie", "Zoenen inbegrepen", "Discreet en veilig"],
  trustBadgesEn: ["Real connection", "Kissing included", "Discreet and safe"],
};

/**
 * Dinner Date Escort Service Page
 * Search Console: ~680 combined clicks ("dinner date escort", "escort dinner")
 */
export const dinnerdateEscortPageData: ServiceTypeDetailPageData = {
  slug: "dinnerdate-escort",
  pageType: "service",
  seoTitle: "Dinner Date Escort - Charmant Gezelschap | Vanaf €200",
  title: "Dinner Date Escort",
  titleEn: "Dinner Date Escort",
  metaDescription:
    "Boek een escort voor een dinner date. ✓ Charmant gezelschap ✓ Restaurant-etiquette ✓ Stijlvol en intelligent ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book an escort for a dinner date. ✓ Charming company ✓ Restaurant etiquette ✓ Stylish and intelligent ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Ga uit eten met een stijlvolle dame aan je zijde. Onze dinner date escorts zijn intelligent, goed gekleed en weten zich in elk restaurant te gedragen. Geniet van een heerlijke maaltijd met prikkelende gesprekken — en laat de avond eindigen zoals jij wilt.",
  heroIntroEn:
    "Go out to dinner with a stylish lady by your side. Our dinner date escorts are intelligent, well-dressed and know how to behave in any restaurant. Enjoy a delicious meal with stimulating conversations — and let the evening end however you wish.",
  usps: ["Charmant gezelschap", "Stijlvol & intelligent", "Inclusief intimiteit"],
  uspsEn: ["Charming company", "Stylish & intelligent", "Intimacy included"],
  priceFrom: "€200",
  minDuration: "2 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat is een Dinner Date?",
  coreContentTitleEn: "What is a Dinner Date?",
  coreContent: `Een dinner date escort is het beste van twee werelden: een gezellige avond uit met een aantrekkelijke vrouw, gevolgd door intieme momenten samen.

Onze dames zijn geselecteerd op sociale vaardigheden. Ze voeren interessante gesprekken, hebben algemene kennis en voelen zich op hun gemak in restaurants van casual tot Michelin-niveau. Je hoeft je niet af te vragen of je gezelschap 'past' — ze passen altijd.

De avond eindigt vaak in een hotel of bij jou thuis, waar de intieme kant van de date begint. De prijs is all-inclusive: diner én privétijd.`,
  coreContentEn: `A dinner date escort is the best of both worlds: a pleasant evening out with an attractive woman, followed by intimate moments together.

Our ladies are selected for social skills. They have interesting conversations, general knowledge and feel comfortable in restaurants from casual to Michelin level. You don't have to wonder if your company 'fits' — they always do.

The evening often ends in a hotel or at your place, where the intimate side of the date begins. The price is all-inclusive: dinner and private time.`,
  benefitsTitle: "Voordelen van een Dinner Date",
  benefitsTitleEn: "Benefits of a Dinner Date",
  benefits: [
    { title: "Geen ongemak", description: "Onze dames zijn ervaren in restaurants en sociale settings." },
    { title: "Echte gesprekken", description: "Intelligent gezelschap dat verder gaat dan small talk." },
    { title: "Inclusief intimiteit", description: "De avond eindigt privé — dat is inbegrepen." },
    { title: "Flexibele locatie", description: "Kies een restaurant naar wens, wij adviseren graag." },
  ],
  benefitsEn: [
    { title: "No awkwardness", description: "Our ladies are experienced in restaurants and social settings." },
    { title: "Real conversations", description: "Intelligent company that goes beyond small talk." },
    { title: "Intimacy included", description: "The evening ends privately — that's included." },
    { title: "Flexible location", description: "Choose a restaurant of your choice, we're happy to advise." },
  ],
  pricingTitle: "Tarieven Dinner Date",
  pricingTitleEn: "Dinner Date Rates",
  pricingContent:
    "Een dinner date begint bij €200 voor 2 uur (inclusief intimiteit). Rekening van het restaurant is voor eigen rekening. Langere avonden zoals 3-4 uur zijn ideaal.",
  pricingContentEn:
    "A dinner date starts at €200 for 2 hours (including intimacy). Restaurant bill is at your own expense. Longer evenings like 3-4 hours are ideal.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Dinner Date Boeken",
  stepsTitleEn: "Book Dinner Date",
  steps: [
    { title: "Kies je gezelschap", description: "Selecteer een dame die bij jouw avond past." },
    { title: "Plan het diner", description: "Geef datum, tijd en restaurant door. Wij adviseren graag." },
    { title: "Geniet van de avond", description: "Eet, drink, praat — en sluit de avond intiem af." },
  ],
  stepsEn: [
    { title: "Choose your company", description: "Select a lady who suits your evening." },
    { title: "Plan the dinner", description: "Provide date, time and restaurant. We're happy to advise." },
    { title: "Enjoy the evening", description: "Eat, drink, talk — and end the evening intimately." },
  ],
  faqs: [
    { question: "Is intimiteit inbegrepen bij een dinner date?", answer: "Ja, de prijs is all-inclusive. Na het diner volgt privétijd bij jou of in een hotel." },
    { question: "Wie betaalt het restaurant?", answer: "De rekening van het restaurant is voor jouw rekening. De escortservice is apart." },
    { question: "Hoe lang duurt een dinner date?", answer: "Minimaal 2 uur. We raden 3-4 uur aan voor een ontspannen avond inclusief intimiteit." },
    { question: "Kan de dame bij mij aansluiten in het restaurant?", answer: "Ja, ze kan je daar ontmoeten of je haalt haar ergens op. Beide opties zijn mogelijk." },
  ],
  faqsEn: [
    { question: "Is intimacy included in a dinner date?", answer: "Yes, the price is all-inclusive. After dinner follows private time at your place or in a hotel." },
    { question: "Who pays for the restaurant?", answer: "The restaurant bill is at your expense. The escort service is separate." },
    { question: "How long does a dinner date last?", answer: "Minimum 2 hours. We recommend 3-4 hours for a relaxed evening including intimacy." },
    { question: "Can the lady join me at the restaurant?", answer: "Yes, she can meet you there or you can pick her up somewhere. Both options are possible." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "escort-voor-zakelijke-evenementen", label: "Zakelijke Events", labelEn: "Business Events" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/dinner-date-escort.jpg",
  primaryImageAlt: "Dinner date escort - charmant gezelschap",
  primaryImageAltEn: "Dinner date escort - charming company",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/dinner-date-escort.jpg",
  quotePool: [
    "Perfecte date, voelde helemaal niet als 'geboekt'.",
    "Intelligente gesprekken en daarna een geweldige afsluiting.",
    "Ze paste perfect bij het restaurant en bij mij.",
  ],
  trustBadges: ["Sociale vaardigheden", "All-inclusive prijs", "Discreet en veilig"],
  trustBadgesEn: ["Social skills", "All-inclusive price", "Discreet and safe"],
};

/**
 * Overnight Escort Service Page
 * Search Console: ~520 combined clicks ("overnight escort", "escort overnachting")
 */
export const overnightEscortPageData: ServiceTypeDetailPageData = {
  slug: "overnight-escort",
  pageType: "service",
  seoTitle: "Overnight Escort - De Hele Nacht | Vanaf €800",
  title: "Overnight Escort",
  titleEn: "Overnight Escort",
  metaDescription:
    "Boek een escort voor de hele nacht. ✓ Tot 12 uur samen ✓ Intieme momenten & slapen ✓ Ontbijt samen ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book an escort for the whole night. ✓ Up to 12 hours together ✓ Intimate moments & sleeping ✓ Breakfast together ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Wil je de hele nacht samen doorbrengen? Een overnight escort biedt tot 12 uur gezelschap: van een intieme avond tot samen wakker worden. Ideaal voor zakenreizen, speciale gelegenheden of simpelweg een nacht waarin je niet alleen wilt zijn.",
  heroIntroEn:
    "Want to spend the whole night together? An overnight escort offers up to 12 hours of company: from an intimate evening to waking up together. Ideal for business trips, special occasions or simply a night when you don't want to be alone.",
  usps: ["Tot 12 uur samen", "Slapen & ontbijt", "Volledige GFE ervaring"],
  uspsEn: ["Up to 12 hours together", "Sleep & breakfast", "Full GFE experience"],
  priceFrom: "€800",
  minDuration: "8 uur",
  responseTime: "3 uur",
  coreContentTitle: "Wat houdt Overnight in?",
  coreContentTitleEn: "What does Overnight include?",
  coreContent: `Een overnight boeking is de ultieme vorm van intimiteit. Je brengt niet alleen intieme momenten samen door, maar ook de rustige momenten: samen in slaap vallen, 's nachts wakker worden, en samen opstaan.

De avond begint vaak met een diner of drankje. Daarna volgen intieme momenten. De nacht brengen jullie samen door — slapen, knuffelen, en als je 's nachts wakker wordt is ze er nog. De ochtend sluit je af met ontbijt samen.

Overnight vraagt om een klik. We adviseren een dame die GFE biedt. De ervaring voelt dan het meest natuurlijk en ontspannen.`,
  coreContentEn: `An overnight booking is the ultimate form of intimacy. You not only spend intimate moments together, but also the quiet moments: falling asleep together, waking up at night, and getting up together.

The evening often starts with dinner or drinks. Then follows intimate moments. You spend the night together — sleeping, cuddling, and if you wake up at night she's still there. The morning ends with breakfast together.

Overnight requires a connection. We advise a lady who offers GFE. The experience then feels most natural and relaxed.`,
  benefitsTitle: "Voordelen van Overnight",
  benefitsTitleEn: "Benefits of Overnight",
  benefits: [
    { title: "Geen haast", description: "Tot 12 uur samen geeft ruimte voor meerdere intieme momenten." },
    { title: "Echte connectie", description: "Slapen naast iemand creëert een unieke band." },
    { title: "Complete ervaring", description: "Diner, intimiteit, slapen, ontbijt — alles inbegrepen." },
    { title: "Ideaal voor zakelijk", description: "Perfect als je op reis bent en niet alleen wilt zijn." },
  ],
  benefitsEn: [
    { title: "No rush", description: "Up to 12 hours together gives room for multiple intimate moments." },
    { title: "Real connection", description: "Sleeping next to someone creates a unique bond." },
    { title: "Complete experience", description: "Dinner, intimacy, sleep, breakfast — all included." },
    { title: "Ideal for business", description: "Perfect when traveling and you don't want to be alone." },
  ],
  pricingTitle: "Tarieven Overnight",
  pricingTitleEn: "Overnight Rates",
  pricingContent:
    "Een overnight begint bij €800 voor 8-12 uur. De exacte prijs varieert per dame. Hotelkosten zijn voor eigen rekening, wij adviseren graag geschikte locaties.",
  pricingContentEn:
    "An overnight starts at €800 for 8-12 hours. The exact price varies per lady. Hotel costs are at your expense, we are happy to advise suitable locations.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Overnight Boeken",
  stepsTitleEn: "Book Overnight",
  steps: [
    { title: "Kies je gezelschap", description: "Selecteer een dame die GFE biedt voor de beste ervaring." },
    { title: "Regel de locatie", description: "Boek een hotel of gebruik je eigen accommodatie." },
    { title: "Geniet van de nacht", description: "Van avond tot ochtend samen — intiem en ontspannen." },
  ],
  stepsEn: [
    { title: "Choose your company", description: "Select a lady who offers GFE for the best experience." },
    { title: "Arrange the location", description: "Book a hotel or use your own accommodation." },
    { title: "Enjoy the night", description: "From evening to morning together — intimate and relaxed." },
  ],
  faqs: [
    { question: "Hoeveel uur is een overnight?", answer: "Standaard 8-12 uur, meestal van 's avonds tot de volgende ochtend na het ontbijt." },
    { question: "Waar vindt een overnight plaats?", answer: "In een hotel of bij jou thuis. Hotelkosten zijn voor eigen rekening. Wij adviseren graag." },
    { question: "Zijn er meerdere intieme momenten?", answer: "Ja, de lange duur biedt ruimte voor meerdere momenten. Timing is aan jullie samen." },
    { question: "Moet ik ontbijt regelen?", answer: "Dat kan via roomservice of je haalt iets. Het samen ontbijten maakt de ervaring compleet." },
  ],
  faqsEn: [
    { question: "How many hours is an overnight?", answer: "Standard 8-12 hours, usually from evening until the next morning after breakfast." },
    { question: "Where does an overnight take place?", answer: "In a hotel or at your place. Hotel costs are at your expense. We're happy to advise." },
    { question: "Are there multiple intimate moments?", answer: "Yes, the long duration offers room for multiple moments. Timing is up to both of you." },
    { question: "Do I need to arrange breakfast?", answer: "That can be via room service or you get something. Having breakfast together completes the experience." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "reisgezelschap", label: "Reisgezelschap", labelEn: "Travel Companion" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/overnight-escort.jpg",
  primaryImageAlt: "Overnight escort - de hele nacht samen",
  primaryImageAltEn: "Overnight escort - the whole night together",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/overnight-escort.jpg",
  quotePool: [
    "Wakker worden naast haar was het beste deel.",
    "Voelde als een mini-relatie in één nacht.",
    "Precies wat ik nodig had tijdens mijn zakenreis.",
  ],
  trustBadges: ["GFE aanbevolen", "8-12 uur samen", "Discreet en veilig"],
  trustBadgesEn: ["GFE recommended", "8-12 hours together", "Discreet and safe"],
};

/**
 * Nuru Massage Service Page
 * Search Console: ~480 clicks ("nuru massage escort", "nuru massage")
 */
export const nuruMassagePageData: ServiceTypeDetailPageData = {
  slug: "nuru-massage",
  pageType: "service",
  seoTitle: "Nuru Massage - Japanse Body-to-Body | Vanaf €160",
  title: "Nuru Massage",
  titleEn: "Nuru Massage",
  metaDescription:
    "Boek een Nuru massage bij Desire Escorts. ✓ Japanse body-to-body techniek ✓ Speciale Nuru gel ✓ Ultiem sensueel ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a Nuru massage at Desire Escorts. ✓ Japanese body-to-body technique ✓ Special Nuru gel ✓ Ultimately sensual ✓ Available 24/7.",
  heroIntro:
    "Nuru massage is de ultieme body-to-body ervaring uit Japan. Met speciale, gladde gel glijdt de masseuse met haar hele lichaam over het jouwe. Intens, sensueel en onvergetelijk.",
  heroIntroEn:
    "Nuru massage is the ultimate body-to-body experience from Japan. With special, slippery gel, the masseuse glides with her entire body over yours. Intense, sensual and unforgettable.",
  usps: ["Japanse techniek", "Speciale Nuru gel", "Volledige body-to-body"],
  uspsEn: ["Japanese technique", "Special Nuru gel", "Full body-to-body"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Wat is Nuru Massage?",
  coreContentTitleEn: "What is Nuru Massage?",
  coreContent: `Nuru komt uit Japan en betekent 'glad' of 'glibberig'. De massage gebruikt speciale Nuru gel gemaakt van zeewier, die extreem glad is en huidvriendelijk.

De masseuse brengt de gel aan op jullie beiden en gebruikt haar hele lichaam om je te masseren. Ze glijdt, draait en beweegt over je heen — een ervaring die je nergens anders vindt.

Nuru is intensiever dan reguliere erotische massage. De volledige huidcontact creëert een unieke sensatie die zowel ontspannend als opwindend is.`,
  coreContentEn: `Nuru comes from Japan and means 'smooth' or 'slippery'. The massage uses special Nuru gel made from seaweed, which is extremely smooth and skin-friendly.

The masseuse applies the gel to both of you and uses her entire body to massage you. She slides, turns and moves over you — an experience you won't find anywhere else.

Nuru is more intense than regular erotic massage. The full skin contact creates a unique sensation that is both relaxing and exciting.`,
  benefitsTitle: "Voordelen van Nuru Massage",
  benefitsTitleEn: "Benefits of Nuru Massage",
  benefits: [
    { title: "Unieke sensatie", description: "Niets voelt zoals volledig huidcontact met gladde gel." },
    { title: "Japanse traditie", description: "Authentieke techniek met speciale zeewier-gel." },
    { title: "Intens & ontspannend", description: "De combinatie van opwinding en ontspanning." },
    { title: "Huidverzorgend", description: "Nuru gel is goed voor je huid en hypoallergeen." },
  ],
  benefitsEn: [
    { title: "Unique sensation", description: "Nothing feels like full skin contact with smooth gel." },
    { title: "Japanese tradition", description: "Authentic technique with special seaweed gel." },
    { title: "Intense & relaxing", description: "The combination of excitement and relaxation." },
    { title: "Skin caring", description: "Nuru gel is good for your skin and hypoallergenic." },
  ],
  pricingTitle: "Tarieven Nuru Massage",
  pricingTitleEn: "Nuru Massage Rates",
  pricingContent:
    "Nuru massage begint bij €160 per uur. De speciale gel en voorbereidingen zijn inbegrepen. Langere sessies beschikbaar voor een volledige ervaring.",
  pricingContentEn:
    "Nuru massage starts at €160 per hour. The special gel and preparations are included. Longer sessions available for a full experience.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Nuru Massage Boeken",
  stepsTitleEn: "Book Nuru Massage",
  steps: [
    { title: "Kies je masseuse", description: "Selecteer een dame die Nuru massage aanbiedt." },
    { title: "Plan je sessie", description: "Incall of outcall, wij brengen de gel mee." },
    { title: "Ervaar Nuru", description: "Laat je onderdompelen in de Japanse body-to-body kunst." },
  ],
  stepsEn: [
    { title: "Choose your masseuse", description: "Select a lady who offers Nuru massage." },
    { title: "Plan your session", description: "Incall or outcall, we bring the gel." },
    { title: "Experience Nuru", description: "Let yourself be immersed in the Japanese body-to-body art." },
  ],
  faqs: [
    { question: "Wat is het verschil tussen Nuru en erotische massage?", answer: "Nuru gebruikt speciale gel en volledige body-to-body contact. Het is intensiever en meer 'glijdend' dan reguliere massage." },
    { question: "Is Nuru gel veilig?", answer: "Ja, Nuru gel is gemaakt van zeewier, is huidvriendelijk en hypoallergeen. Het spoelt makkelijk af." },
    { question: "Kan ik Nuru combineren met andere services?", answer: "Ja, Nuru massage is een perfecte prelude voor verdere intimiteit." },
    { question: "Waar kan Nuru massage plaatsvinden?", answer: "Incall bij de dame of outcall bij jou. Bij outcall beschermen we het bed met speciale lakens." },
  ],
  faqsEn: [
    { question: "What is the difference between Nuru and erotic massage?", answer: "Nuru uses special gel and full body-to-body contact. It's more intense and more 'sliding' than regular massage." },
    { question: "Is Nuru gel safe?", answer: "Yes, Nuru gel is made from seaweed, is skin-friendly and hypoallergenic. It rinses off easily." },
    { question: "Can I combine Nuru with other services?", answer: "Yes, Nuru massage is a perfect prelude to further intimacy." },
    { question: "Where can Nuru massage take place?", answer: "Incall at the lady's or outcall at yours. For outcall we protect the bed with special sheets." },
  ],
  relatedServices: [
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "tantra-massage", label: "Tantra Massage", labelEn: "Tantra Massage" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
  ],
  relatedTypes: [
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/nuru-massage.jpg",
  primaryImageAlt: "Nuru massage - Japanse body-to-body",
  primaryImageAltEn: "Nuru massage - Japanese body-to-body",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/nuru-massage.jpg",
  quotePool: [
    "De sensatie van Nuru is niet te beschrijven, moet je ervaren.",
    "Beste massage van mijn leven, zo intens.",
    "Die gel maakt het echt uniek.",
  ],
  trustBadges: ["Echte Nuru gel", "Ervaren masseuses", "Discreet en veilig"],
  trustBadgesEn: ["Real Nuru gel", "Experienced masseuses", "Discreet and safe"],
};

/**
 * Tantra Massage Service Page
 * Search Console: ~420 clicks ("tantra massage escort", "tantrische massage")
 */
export const tantraMassagePageData: ServiceTypeDetailPageData = {
  slug: "tantra-escort",
  pageType: "service",
  seoTitle: "Tantra Massage - Spirituele Sensualiteit | Vanaf €160",
  title: "Tantra Massage",
  titleEn: "Tantra Massage",
  metaDescription:
    "Boek een tantra massage bij Desire Escorts. ✓ Spirituele sensualiteit ✓ Energetische verbinding ✓ Diepe ontspanning ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a tantra massage at Desire Escorts. ✓ Spiritual sensuality ✓ Energetic connection ✓ Deep relaxation ✓ Available 24/7.",
  heroIntro:
    "Tantra massage combineert spiritualiteit met sensualiteit. Het draait om energie, adem en bewuste aanraking. Een ervaring die verder gaat dan het fysieke — een verbinding van lichaam en geest.",
  heroIntroEn:
    "Tantra massage combines spirituality with sensuality. It's about energy, breath and conscious touch. An experience that goes beyond the physical — a connection of body and mind.",
  usps: ["Spirituele benadering", "Energetische verbinding", "Diepe ontspanning"],
  uspsEn: ["Spiritual approach", "Energetic connection", "Deep relaxation"],
  priceFrom: "€160",
  minDuration: "1.5 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat is Tantra Massage?",
  coreContentTitleEn: "What is Tantra Massage?",
  coreContent: `Tantra massage komt uit oude Oosterse tradities en gaat over het verspreiden van seksuele energie door het hele lichaam. Het is langzaam, bewust en gericht op sensatie in plaats van doel.

De masseuse werkt met je energie, adem en chakra's. Aanrakingen zijn langzaam en doelbewust, waardoor spanning zich opbouwt en verspreidt. Het orgasme is niet het doel — de reis ernaar toe is.

Tantra is ideaal voor wie meer wil dan fysieke release. Het biedt een meditatieve staat van opwinding, waarbij je leert je energie te beheersen.`,
  coreContentEn: `Tantra massage comes from ancient Eastern traditions and is about spreading sexual energy throughout the body. It's slow, conscious and focused on sensation rather than goal.

The masseuse works with your energy, breath and chakras. Touches are slow and deliberate, allowing tension to build and spread. Orgasm is not the goal — the journey to it is.

Tantra is ideal for those who want more than physical release. It offers a meditative state of arousal, where you learn to control your energy.`,
  benefitsTitle: "Voordelen van Tantra",
  benefitsTitleEn: "Benefits of Tantra",
  benefits: [
    { title: "Mind-body verbinding", description: "Ervaar hoe energie door je hele lichaam kan stromen." },
    { title: "Langere opwinding", description: "Leer hoe je spanning kunt opbouwen en vasthouden." },
    { title: "Stress vermindering", description: "De meditatieve staat brengt diepe ontspanning." },
    { title: "Nieuwe sensaties", description: "Ontdek gevoelens die je met snelle intimiteit mist." },
  ],
  benefitsEn: [
    { title: "Mind-body connection", description: "Experience how energy can flow through your entire body." },
    { title: "Extended arousal", description: "Learn how to build and maintain tension." },
    { title: "Stress reduction", description: "The meditative state brings deep relaxation." },
    { title: "New sensations", description: "Discover feelings you miss with quick intimacy." },
  ],
  pricingTitle: "Tarieven Tantra Massage",
  pricingTitleEn: "Tantra Massage Rates",
  pricingContent:
    "Tantra massage begint bij €160 voor 1,5 uur. De langere duur is nodig voor een volledige ervaring. Sessies van 2 uur aanbevolen.",
  pricingContentEn:
    "Tantra massage starts at €160 for 1.5 hours. The longer duration is needed for a full experience. Sessions of 2 hours recommended.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Tantra Sessie Boeken",
  stepsTitleEn: "Book Tantra Session",
  steps: [
    { title: "Kies je gids", description: "Selecteer een dame die tantra massage aanbiedt." },
    { title: "Bereid je voor", description: "Tantra werkt het beste met een open, ontspannen mindset." },
    { title: "Ervaar de reis", description: "Laat je meevoeren op een spirituele, sensuele ervaring." },
  ],
  stepsEn: [
    { title: "Choose your guide", description: "Select a lady who offers tantra massage." },
    { title: "Prepare yourself", description: "Tantra works best with an open, relaxed mindset." },
    { title: "Experience the journey", description: "Let yourself be carried on a spiritual, sensual experience." },
  ],
  faqs: [
    { question: "Is tantra massage hetzelfde als erotische massage?", answer: "Nee, tantra is langzamer en meer gefocust op energie en adem. Het gaat om de reis, niet de eindbestemming." },
    { question: "Moet ik ervaring hebben met tantra?", answer: "Nee, onze dames begeleiden je door de ervaring. Openheid is belangrijker dan ervaring." },
    { question: "Hoe lang duurt een tantra sessie?", answer: "Minimaal 1,5 uur. We raden 2 uur aan voor de volledige ervaring." },
    { question: "Kan tantra gecombineerd worden met andere services?", answer: "Ja, maar tantra op zichzelf is al een complete ervaring. Het kan een mooie start zijn van een langere boeking." },
  ],
  faqsEn: [
    { question: "Is tantra massage the same as erotic massage?", answer: "No, tantra is slower and more focused on energy and breath. It's about the journey, not the destination." },
    { question: "Do I need experience with tantra?", answer: "No, our ladies guide you through the experience. Openness is more important than experience." },
    { question: "How long does a tantra session last?", answer: "Minimum 1.5 hours. We recommend 2 hours for the full experience." },
    { question: "Can tantra be combined with other services?", answer: "Yes, but tantra by itself is already a complete experience. It can be a beautiful start to a longer booking." },
  ],
  relatedServices: [
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "nuru-massage", label: "Nuru Massage", labelEn: "Nuru Massage" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
  ],
  relatedTypes: [
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/tantra-massage.jpg",
  primaryImageAlt: "Tantra massage - spirituele sensualiteit",
  primaryImageAltEn: "Tantra massage - spiritual sensuality",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/tantra-massage.jpg",
  quotePool: [
    "Nog nooit zo diep ontspannen geweest.",
    "Een compleet andere ervaring dan verwacht, veel intenser.",
    "De energie was voelbaar, heel bijzonder.",
  ],
  trustBadges: ["Authentieke techniek", "Ervaren masseuses", "Rustige sfeer"],
  trustBadgesEn: ["Authentic technique", "Experienced masseuses", "Calm atmosphere"],
};

/**
 * Rollenspel Escort Service Page
 * Search Console: ~380 clicks ("rollenspel escort", "roleplay escort")
 */
export const rollenspelEscortPageData: ServiceTypeDetailPageData = {
  slug: "rollenspel-escort",
  pageType: "service",
  seoTitle: "Rollenspel Escort - Fantasieën Uitspelen | Vanaf €160",
  title: "Rollenspel Escort",
  titleEn: "Roleplay Escort",
  metaDescription:
    "Boek een escort voor rollenspel. ✓ Speel je fantasieën uit ✓ Ervaren actrices ✓ Secretaresse tot verpleegster ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for roleplay. ✓ Act out your fantasies ✓ Experienced actresses ✓ Secretary to nurse ✓ Available 24/7 discreetly.",
  heroIntro:
    "Heb je een fantasie die je altijd al wilde uitspelen? Onze escorts zijn ervaren in rollenspel en leven graag mee in jouw scenario. Van secretaresse tot verpleegster, van onbekende in de bar tot de buurvrouw — jij schrijft het script.",
  heroIntroEn:
    "Do you have a fantasy you've always wanted to act out? Our escorts are experienced in roleplay and enjoy immersing themselves in your scenario. From secretary to nurse, from stranger at the bar to the neighbor — you write the script.",
  usps: ["Jouw scenario", "Ervaren actrices", "Costumes beschikbaar"],
  uspsEn: ["Your scenario", "Experienced actresses", "Costumes available"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat is Rollenspel met een Escort?",
  coreContentTitleEn: "What is Roleplay with an Escort?",
  coreContent: `Rollenspel voegt een extra dimensie toe aan intimiteit. Je speelt samen een scenario uit — een fantasie die je misschien nooit met iemand anders kunt delen.

Populaire scenario's zijn secretaresse/baas, verpleegster/patiënt, onbekenden die elkaar ontmoeten, of een klassieker als schoolmeisje. Maar je kunt ook iets unieks bedenken.

Onze dames zijn flexibel en creatief. Bespreek je idee vooraf en zij zorgen voor de juiste sfeer. Sommige dames hebben costumes beschikbaar of kunnen specifieke kleding dragen.`,
  coreContentEn: `Roleplay adds an extra dimension to intimacy. You act out a scenario together — a fantasy that you might never be able to share with anyone else.

Popular scenarios are secretary/boss, nurse/patient, strangers meeting, or a classic like schoolgirl. But you can also come up with something unique.

Our ladies are flexible and creative. Discuss your idea in advance and they will create the right atmosphere. Some ladies have costumes available or can wear specific clothing.`,
  benefitsTitle: "Voordelen van Rollenspel",
  benefitsTitleEn: "Benefits of Roleplay",
  benefits: [
    { title: "Fantasie wordt werkelijkheid", description: "Eindelijk dat scenario uitspelen dat je al jaren in je hoofd hebt." },
    { title: "Veilige omgeving", description: "Geen oordeel, alleen meespelen in jouw verhaal." },
    { title: "Unieke ervaring", description: "Elke sessie is anders, gebaseerd op jouw wensen." },
    { title: "Costumes mogelijk", description: "Vraag naar beschikbaarheid van specifieke outfits." },
  ],
  benefitsEn: [
    { title: "Fantasy becomes reality", description: "Finally act out that scenario you've had in your head for years." },
    { title: "Safe environment", description: "No judgment, just playing along with your story." },
    { title: "Unique experience", description: "Every session is different, based on your wishes." },
    { title: "Costumes possible", description: "Ask about availability of specific outfits." },
  ],
  pricingTitle: "Tarieven Rollenspel",
  pricingTitleEn: "Roleplay Rates",
  pricingContent:
    "Rollenspel begint bij €160 per uur. Complexere scenario's of specifieke costumes kunnen extra kosten met zich meebrengen. Bespreek je wensen vooraf.",
  pricingContentEn:
    "Roleplay starts at €160 per hour. More complex scenarios or specific costumes may incur additional costs. Discuss your wishes in advance.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Rollenspel Boeken",
  stepsTitleEn: "Book Roleplay",
  steps: [
    { title: "Deel je fantasie", description: "Vertel ons welk scenario je wilt uitspelen." },
    { title: "Match met de juiste dame", description: "We koppelen je aan een escort die bij je fantasie past." },
    { title: "Speel het uit", description: "Geniet van een unieke ervaring, precies zoals jij het wilt." },
  ],
  stepsEn: [
    { title: "Share your fantasy", description: "Tell us what scenario you want to act out." },
    { title: "Match with the right lady", description: "We match you with an escort who fits your fantasy." },
    { title: "Act it out", description: "Enjoy a unique experience, exactly as you want it." },
  ],
  faqs: [
    { question: "Welke rollenspellen zijn populair?", answer: "Secretaresse/baas, verpleegster, onbekenden, docent/student, buurvrouw. Maar je kunt ook iets unieks bedenken." },
    { question: "Kan ik specifieke kleding aanvragen?", answer: "Ja, bespreek dit vooraf. Sommige dames hebben costumes, anderen kunnen specifieke outfits aanschaffen." },
    { question: "Moet ik het hele scenario uitschrijven?", answer: "Nee, een globaal idee is genoeg. De dame improviseert mee. Hoe meer detail, hoe beter de ervaring." },
    { question: "Is rollenspel ook mogelijk bij kortere boekingen?", answer: "Ja, maar langere boekingen geven meer ruimte om het scenario echt tot leven te brengen." },
  ],
  faqsEn: [
    { question: "What roleplay scenarios are popular?", answer: "Secretary/boss, nurse, strangers, teacher/student, neighbor. But you can also come up with something unique." },
    { question: "Can I request specific clothing?", answer: "Yes, discuss this in advance. Some ladies have costumes, others can purchase specific outfits." },
    { question: "Do I need to write out the entire scenario?", answer: "No, a general idea is enough. The lady improvises along. The more detail, the better the experience." },
    { question: "Is roleplay also possible with shorter bookings?", answer: "Yes, but longer bookings give more room to really bring the scenario to life." },
  ],
  relatedServices: [
    { slug: "bdsm-escorts", label: "BDSM Escorts", labelEn: "BDSM Escorts" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "studenten-escort", label: "Studenten Escort", labelEn: "Student Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/rollenspel-escort.jpg",
  primaryImageAlt: "Rollenspel escort - fantasieën uitspelen",
  primaryImageAltEn: "Roleplay escort - act out fantasies",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/rollenspel-escort.jpg",
  quotePool: [
    "Eindelijk mijn fantasie kunnen uitspelen, ongelooflijk.",
    "Ze speelde de rol perfect, precies zoals ik het voor me zag.",
    "Creativiteit en meelevendheid maakten het speciaal.",
  ],
  trustBadges: ["Geen oordeel", "Creativiteit", "Discreet en veilig"],
  trustBadgesEn: ["No judgment", "Creativity", "Discreet and safe"],
};

/**
 * Escort voor Stellen Service Page
 * Search Console: ~350 clicks ("escort voor koppels", "escort voor stellen")
 */
export const escortVoorStellenPageData: ServiceTypeDetailPageData = {
  slug: "escort-voor-stellen",
  pageType: "service",
  seoTitle: "Escort voor Stellen - Samen Genieten | Vanaf €160",
  title: "Escort voor Stellen",
  titleEn: "Couples Escort",
  metaDescription:
    "Boek een escort voor jullie als stel. ✓ Voeg een derde persoon toe ✓ Voor hem, haar of beiden ✓ Discreet en ervaren ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book an escort for you as a couple. ✓ Add a third person ✓ For him, her or both ✓ Discreet and experienced ✓ Available 24/7.",
  heroIntro:
    "Willen jullie als stel iets nieuws proberen? Een escort kan jullie relatie verrijken met een onvergetelijke ervaring. Of de focus nu op hem, haar of beiden ligt — onze dames zijn ervaren met stellen en zorgen dat iedereen zich op z'n gemak voelt.",
  heroIntroEn:
    "Do you want to try something new as a couple? An escort can enrich your relationship with an unforgettable experience. Whether the focus is on him, her or both — our ladies are experienced with couples and make sure everyone feels comfortable.",
  usps: ["Beide partners genieten", "Ervaring met stellen", "Veilig & discreet"],
  uspsEn: ["Both partners enjoy", "Experience with couples", "Safe & discreet"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Hoe werkt Escort voor Stellen?",
  coreContentTitleEn: "How does Couples Escort work?",
  coreContent: `Een escort voor stellen voegt een derde persoon toe aan jullie intimiteit. Dit kan op verschillende manieren: gericht op de man terwijl de vrouw kijkt of meedoet, gericht op de vrouw, of volledige interactie met beiden.

Niet alle escorts zijn beschikbaar voor stellen. De dames die dit aanbieden hebben ervaring en weten hoe ze een comfortabele sfeer creëren. Communicatie vooraf is essentieel.

We raden aan om samen jullie wensen te bespreken vóór de boeking. Wat willen jullie bereiken? Waar liggen grenzen? Hoe meer duidelijkheid, hoe beter de ervaring.`,
  coreContentEn: `A couples escort adds a third person to your intimacy. This can be done in different ways: focused on the man while the woman watches or participates, focused on the woman, or full interaction with both.

Not all escorts are available for couples. The ladies who offer this have experience and know how to create a comfortable atmosphere. Communication beforehand is essential.

We recommend discussing your wishes together before booking. What do you want to achieve? Where are boundaries? The more clarity, the better the experience.`,
  benefitsTitle: "Voordelen voor Stellen",
  benefitsTitleEn: "Benefits for Couples",
  benefits: [
    { title: "Verrijkt jullie relatie", description: "Een nieuwe ervaring kan jullie band versterken." },
    { title: "Veilige verkenning", description: "Fantasieën verkennen met een professional, zonder complicaties." },
    { title: "Flexibele focus", description: "De escort past zich aan jullie wensen aan." },
    { title: "Ervaren dames", description: "Onze stellen-escorts weten hoe ze iedereen op gemak stellen." },
  ],
  benefitsEn: [
    { title: "Enriches your relationship", description: "A new experience can strengthen your bond." },
    { title: "Safe exploration", description: "Explore fantasies with a professional, without complications." },
    { title: "Flexible focus", description: "The escort adapts to your wishes." },
    { title: "Experienced ladies", description: "Our couples escorts know how to put everyone at ease." },
  ],
  pricingTitle: "Tarieven Escort voor Stellen",
  pricingTitleEn: "Couples Escort Rates",
  pricingContent:
    "Een escort voor stellen begint bij €160 per uur. De prijs is hetzelfde als reguliere boekingen. Langere sessies aanbevolen voor meer ontspanning en verbinding.",
  pricingContentEn:
    "A couples escort starts at €160 per hour. The price is the same as regular bookings. Longer sessions recommended for more relaxation and connection.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Als Stel Boeken",
  stepsTitleEn: "Book as a Couple",
  steps: [
    { title: "Bespreek samen jullie wensen", description: "Wat willen jullie beiden? Waar liggen grenzen?" },
    { title: "Neem contact op", description: "Deel jullie voorkeuren en we matchen met een geschikte dame." },
    { title: "Geniet samen", description: "De escort arriveert en jullie verkennen samen nieuwe grenzen." },
  ],
  stepsEn: [
    { title: "Discuss your wishes together", description: "What do you both want? Where are boundaries?" },
    { title: "Get in touch", description: "Share your preferences and we match with a suitable lady." },
    { title: "Enjoy together", description: "The escort arrives and you explore new boundaries together." },
  ],
  faqs: [
    { question: "Doen alle escorts aan stellen?", answer: "Nee, alleen dames die dit expliciet aanbieden. Het staat op hun profiel of je kunt het navragen." },
    { question: "Kan de escort ook alleen met mijn partner?", answer: "Ja, de focus kan liggen waar jullie willen. Sommige stellen vinden het opwindend om te kijken." },
    { question: "Hoe zorgen we dat iedereen zich op z'n gemak voelt?", answer: "Communiceer vooraf duidelijk. De escort neemt de tijd om te leren kennen en grenzen te respecteren." },
    { question: "Is de prijs anders voor stellen?", answer: "Nee, de prijs is hetzelfde als reguliere boekingen. Bij een trio met twee escorts gelden andere tarieven." },
  ],
  faqsEn: [
    { question: "Do all escorts do couples?", answer: "No, only ladies who explicitly offer this. It's on their profile or you can inquire." },
    { question: "Can the escort also be with my partner only?", answer: "Yes, the focus can be where you want it. Some couples find it exciting to watch." },
    { question: "How do we make sure everyone feels comfortable?", answer: "Communicate clearly beforehand. The escort takes time to get to know and respect boundaries." },
    { question: "Is the price different for couples?", answer: "No, the price is the same as regular bookings. Different rates apply for a trio with two escorts." },
  ],
  relatedServices: [
    { slug: "trio-escorts", label: "Trio Escorts", labelEn: "Trio Escorts" },
    { slug: "gfe-escorts", label: "Girlfriend Experience", labelEn: "Girlfriend Experience" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
  ],
  relatedTypes: [
    { slug: "biseksuele-escort", label: "Biseksuele Escort", labelEn: "Bisexual Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/escort-stellen.jpg",
  primaryImageAlt: "Escort voor stellen - samen genieten",
  primaryImageAltEn: "Couples escort - enjoy together",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/escort-stellen.jpg",
  quotePool: [
    "Dit heeft onze relatie echt verrijkt.",
    "Ze wist precies hoe ze ons beiden op gemak moest stellen.",
    "Eindelijk onze fantasie kunnen delen, samen.",
  ],
  trustBadges: ["Ervaring met stellen", "Discrete benadering", "Veilig en comfortabel"],
  trustBadgesEn: ["Experience with couples", "Discreet approach", "Safe and comfortable"],
};

/**
 * BDSM Escorts Service Page
 * Search Console: ~428 clicks ("bdsm escort", "dominatrix escort", "sm escort")
 */
export const bdsmEscortsPageData: ServiceTypeDetailPageData = {
  slug: "bdsm-escorts",
  pageType: "service",
  seoTitle: "BDSM Escorts - Dominant of Submissief | Vanaf €160",
  title: "BDSM Escorts",
  titleEn: "BDSM Escorts",
  metaDescription:
    "Boek een BDSM escort bij Desire Escorts. ✓ Dominant of submissief ✓ Ervaren in bondage & discipline ✓ Veilig en consensueel ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book a BDSM escort at Desire Escorts. ✓ Dominant or submissive ✓ Experienced in bondage & discipline ✓ Safe and consensual ✓ Available 24/7 discreetly.",
  heroIntro:
    "Ben je klaar om je donkere kant te verkennen? Onze BDSM escorts zijn ervaren in dominantie, submissie, bondage en meer. Of je nu wilt domineren of gedomineerd worden — alles gebeurt veilig, consensueel en op jouw tempo.",
  heroIntroEn:
    "Ready to explore your dark side? Our BDSM escorts are experienced in dominance, submission, bondage and more. Whether you want to dominate or be dominated — everything happens safely, consensually and at your pace.",
  usps: ["Dom of sub beschikbaar", "Ervaren in BDSM", "Veilig & consensueel"],
  uspsEn: ["Dom or sub available", "Experienced in BDSM", "Safe & consensual"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat bieden BDSM Escorts?",
  coreContentTitleEn: "What do BDSM Escorts offer?",
  coreContent: `BDSM staat voor Bondage, Discipline, Dominance, Submission, Sadism en Masochism. Het is een breed spectrum van activiteiten die draaien om macht, controle en sensatie.

Onze BDSM escorts kunnen dominant of submissief zijn, afhankelijk van jouw voorkeur. Dominante dames (dommes) nemen de controle over, terwijl submissieve dames jouw bevelen volgen.

Activiteiten kunnen variëren van licht (blinddoeken, zachte bondage) tot intensiever (impact play, stricter bondage). We bespreken altijd vooraf grenzen en een safeword.`,
  coreContentEn: `BDSM stands for Bondage, Discipline, Dominance, Submission, Sadism and Masochism. It's a broad spectrum of activities centered around power, control and sensation.

Our BDSM escorts can be dominant or submissive, depending on your preference. Dominant ladies (dommes) take control, while submissive ladies follow your commands.

Activities can range from light (blindfolds, soft bondage) to more intense (impact play, stricter bondage). We always discuss boundaries and a safeword beforehand.`,
  benefitsTitle: "Voordelen van BDSM met een Escort",
  benefitsTitleEn: "Benefits of BDSM with an Escort",
  benefits: [
    { title: "Geen oordeel", description: "Verken je fantasieën in een veilige, oordeelvrije omgeving." },
    { title: "Ervaren partners", description: "Onze dames kennen de technieken en veiligheidsprotocollen." },
    { title: "Flexibel niveau", description: "Van beginner tot ervaren — we passen aan jouw ervaring aan." },
    { title: "Discretie gegarandeerd", description: "Wat er gebeurt, blijft tussen jullie." },
  ],
  benefitsEn: [
    { title: "No judgment", description: "Explore your fantasies in a safe, judgment-free environment." },
    { title: "Experienced partners", description: "Our ladies know the techniques and safety protocols." },
    { title: "Flexible level", description: "From beginner to experienced — we adapt to your experience." },
    { title: "Discretion guaranteed", description: "What happens, stays between you." },
  ],
  pricingTitle: "Tarieven BDSM Escorts",
  pricingTitleEn: "BDSM Escort Rates",
  pricingContent:
    "BDSM sessies beginnen bij €160 per uur. Specifieke materialen of uitrusting kunnen extra kosten met zich meebrengen. Langere sessies aanbevolen voor diepgaande ervaringen.",
  pricingContentEn:
    "BDSM sessions start at €160 per hour. Specific materials or equipment may incur additional costs. Longer sessions recommended for in-depth experiences.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "BDSM Sessie Boeken",
  stepsTitleEn: "Book BDSM Session",
  steps: [
    { title: "Deel je interesses", description: "Vertel ons wat je wilt verkennen en je ervaringsniveau." },
    { title: "Bespreek grenzen", description: "We bepalen samen grenzen en een safeword." },
    { title: "Verken veilig", description: "Duik in de wereld van BDSM met een ervaren partner." },
  ],
  stepsEn: [
    { title: "Share your interests", description: "Tell us what you want to explore and your experience level." },
    { title: "Discuss boundaries", description: "We determine boundaries and a safeword together." },
    { title: "Explore safely", description: "Dive into the world of BDSM with an experienced partner." },
  ],
  faqs: [
    { question: "Zijn jullie escorts dominant of submissief?", answer: "Beide. Sommige dames zijn puur dominant, anderen submissief, en sommigen kunnen switchen. Vraag naar je voorkeur." },
    { question: "Ik ben nieuw met BDSM, is dat een probleem?", answer: "Nee, juist niet. Onze dames begeleiden beginners graag en beginnen rustig. Je hoeft nergens ervaring in te hebben." },
    { question: "Welke BDSM activiteiten bieden jullie aan?", answer: "Van bondage en blinddoeken tot spanking, dominantie en meer. Bespreek je specifieke interesses bij boeking." },
    { question: "Is er een safeword?", answer: "Altijd. We bepalen vooraf een safeword waarmee je direct kunt stoppen. Veiligheid staat voorop." },
  ],
  faqsEn: [
    { question: "Are your escorts dominant or submissive?", answer: "Both. Some ladies are purely dominant, others submissive, and some can switch. Ask about your preference." },
    { question: "I'm new to BDSM, is that a problem?", answer: "No, quite the opposite. Our ladies love guiding beginners and start slowly. You don't need experience in anything." },
    { question: "What BDSM activities do you offer?", answer: "From bondage and blindfolds to spanking, dominance and more. Discuss your specific interests when booking." },
    { question: "Is there a safeword?", answer: "Always. We determine a safeword beforehand so you can stop immediately. Safety comes first." },
  ],
  relatedServices: [
    { slug: "rollenspel-escort", label: "Rollenspel", labelEn: "Roleplay" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
  ],
  relatedTypes: [
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/bdsm-escort.jpg",
  primaryImageAlt: "BDSM escort - dominant of submissief",
  primaryImageAltEn: "BDSM escort - dominant or submissive",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/bdsm-escort.jpg",
  quotePool: [
    "Precies de dominantie die ik zocht, professioneel en veilig.",
    "Ze wist precies hoe ver ze kon gaan zonder te ver te gaan.",
    "Eindelijk mijn fantasieën kunnen verkennen zonder oordeel.",
  ],
  trustBadges: ["Veilig & consensueel", "Ervaren BDSM partners", "Discreet en oordeelvrij"],
  trustBadgesEn: ["Safe & consensual", "Experienced BDSM partners", "Discreet and judgment-free"],
};

/**
 * 24 uurs Escort Service Page
 */
export const twentyFourUursEscortPageData: ServiceTypeDetailPageData = {
  slug: "24-uurs-escort",
  pageType: "service",
  seoTitle: "24 Uurs Escort - Langere Boekingen | Vanaf €1600",
  title: "24 Uurs Escort",
  titleEn: "24h Escort",
  metaDescription:
    "Boek een escort voor 24 uur. ✓ Volledige dag samen ✓ Meerdere activiteiten ✓ Reisgezelschap ✓ Flexibel en discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for 24 hours. ✓ Full day together ✓ Multiple activities ✓ Travel companion ✓ Flexible and discreetly available.",
  heroIntro:
    "Wil je een volledige dag en nacht samen doorbrengen? Een 24 uurs escort biedt uitgebreid gezelschap voor meerdere activiteiten: van ontbijt tot diner, van dagactiviteiten tot intieme momenten.",
  heroIntroEn:
    "Want to spend a full day and night together? A 24h escort offers extended companionship for multiple activities: from breakfast to dinner, from daytime activities to intimate moments.",
  usps: ["Volledige 24 uur", "Meerdere activiteiten", "Flexibele invulling"],
  uspsEn: ["Full 24 hours", "Multiple activities", "Flexible arrangement"],
  priceFrom: "€1600",
  minDuration: "24 uur",
  responseTime: "4 uur",
  coreContentTitle: "Wat houdt een 24 Uurs Boeking in?",
  coreContentTitleEn: "What does a 24h Booking include?",
  coreContent: `Een 24 uurs escort is de ultieme vorm van uitgebreid gezelschap. Je hebt een volledige dag en nacht samen om te vullen zoals jij wilt.

Dit kan variëren van een dagje shoppen gevolgd door diner en overnachting, tot een reisdag naar een andere stad. De mogelijkheden zijn eindeloos: strandbezoek, musea, evenementen of gewoon ontspannen.

De intieme momenten bepaal je samen. Sommige gasten spreiden dit over de dag, anderen focussen op avond en nacht. Jij bepaalt het ritme.`,
  coreContentEn: `A 24h escort is the ultimate form of extended companionship. You have a full day and night together to fill however you want.

This can range from a day of shopping followed by dinner and overnight, to a travel day to another city. The possibilities are endless: beach visit, museums, events or just relaxing.

You determine the intimate moments together. Some guests spread this throughout the day, others focus on evening and night. You set the pace.`,
  benefitsTitle: "Voordelen van 24 Uurs Boeking",
  benefitsTitleEn: "Benefits of 24h Booking",
  benefits: [
    { title: "Geen tijdsdruk", description: "Een hele dag zonder haast of kijken op de klok." },
    { title: "Meerdere ervaringen", description: "Combineer dagactiviteiten met avond en nacht." },
    { title: "Echte connectie", description: "Langere tijd samen creëert een diepere band." },
    { title: "Flexibele planning", description: "Vul de dag in zoals jij wilt." },
  ],
  benefitsEn: [
    { title: "No time pressure", description: "A whole day without rush or watching the clock." },
    { title: "Multiple experiences", description: "Combine daytime activities with evening and night." },
    { title: "Real connection", description: "Longer time together creates a deeper bond." },
    { title: "Flexible planning", description: "Fill the day however you want." },
  ],
  pricingTitle: "Tarieven 24 Uurs Escort",
  pricingTitleEn: "24h Escort Rates",
  pricingContent:
    "Een 24 uurs boeking begint bij €1600. De exacte prijs varieert per dame. Reiskosten en activiteiten zijn voor eigen rekening.",
  pricingContentEn:
    "A 24h booking starts at €1600. The exact price varies per lady. Travel costs and activities are at your expense.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "24 Uurs Escort Boeken",
  stepsTitleEn: "Book 24h Escort",
  steps: [
    { title: "Plan je dag", description: "Bedenk welke activiteiten je wilt doen en deel dit met ons." },
    { title: "Match met de juiste dame", description: "We selecteren een escort die past bij jouw plannen." },
    { title: "Geniet van 24 uur samen", description: "Van ochtend tot ochtend, een onvergetelijke ervaring." },
  ],
  stepsEn: [
    { title: "Plan your day", description: "Think about what activities you want to do and share with us." },
    { title: "Match with the right lady", description: "We select an escort that fits your plans." },
    { title: "Enjoy 24 hours together", description: "From morning to morning, an unforgettable experience." },
  ],
  faqs: [
    { question: "Wat kan ik doen tijdens een 24 uurs boeking?", answer: "Alles wat je wilt: dagactiviteiten, diner, intimiteit, overnachting. Jij bepaalt de invulling." },
    { question: "Zijn maaltijden inbegrepen?", answer: "De escortservice is inbegrepen. Maaltijden en activiteiten zijn voor jouw rekening." },
    { question: "Kan ik ook reizen met de escort?", answer: "Ja, 24 uurs boekingen zijn ideaal voor dagtripjes naar andere steden." },
    { question: "Hoe zit het met slaaptijd?", answer: "De escort slaapt bij je, net als bij een overnight. Intieme momenten bepaal je samen." },
  ],
  faqsEn: [
    { question: "What can I do during a 24h booking?", answer: "Anything you want: daytime activities, dinner, intimacy, overnight. You determine the content." },
    { question: "Are meals included?", answer: "The escort service is included. Meals and activities are at your expense." },
    { question: "Can I also travel with the escort?", answer: "Yes, 24h bookings are ideal for day trips to other cities." },
    { question: "What about sleep time?", answer: "The escort sleeps with you, just like an overnight. Intimate moments are determined together." },
  ],
  relatedServices: [
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
    { slug: "reisgezelschap", label: "Reisgezelschap", labelEn: "Travel Companion" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/24-uurs-escort.jpg",
  primaryImageAlt: "24 uurs escort - een volledige dag samen",
  primaryImageAltEn: "24h escort - a full day together",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/24-uurs-escort.jpg",
  quotePool: [
    "Een complete dag zonder haast, precies wat ik nodig had.",
    "Van ontbijt tot ontbijt, onvergetelijk.",
    "De vrijheid om alles te doen wat we wilden.",
  ],
  trustBadges: ["Flexibele invulling", "GFE aanbevolen", "Discreet en veilig"],
  trustBadgesEn: ["Flexible arrangement", "GFE recommended", "Discreet and safe"],
};

/**
 * Body 2 Body Massage Service Page
 */
export const body2BodyMassagePageData: ServiceTypeDetailPageData = {
  slug: "body-2-body-massage",
  pageType: "service",
  seoTitle: "Body to Body Massage - Volledige Huidcontact | Vanaf €160",
  title: "Body 2 Body Massage",
  titleEn: "Body 2 Body Massage",
  metaDescription:
    "Boek een body to body massage bij Desire Escorts. ✓ Volledige huidcontact ✓ Sensuele ervaring ✓ Ervaren masseuses ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a body to body massage at Desire Escorts. ✓ Full skin contact ✓ Sensual experience ✓ Experienced masseuses ✓ Available 24/7.",
  heroIntro:
    "Bij een body to body massage gebruikt de masseuse haar hele lichaam om jou te masseren. Volledige huidcontact zorgt voor een intensere, sensuele ervaring dan reguliere massage.",
  heroIntroEn:
    "In a body to body massage, the masseuse uses her entire body to massage you. Full skin contact creates a more intense, sensual experience than regular massage.",
  usps: ["Volledig huidcontact", "Intensief & sensueel", "Warme olie"],
  uspsEn: ["Full skin contact", "Intensive & sensual", "Warm oil"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Wat is Body to Body Massage?",
  coreContentTitleEn: "What is Body to Body Massage?",
  coreContent: `Body to body massage gaat verder dan reguliere erotische massage. De masseuse gebruikt niet alleen haar handen, maar haar hele lichaam om over jou heen te glijden.

Met warme olie worden jullie beiden ingesmeerd. Daarna volgen langzame, sensuele bewegingen waarbij zij met haar torso, borsten en benen over je lichaam beweegt.

Het verschil met Nuru massage is dat B2B meestal met gewone massageolie werkt in plaats van speciale Nuru gel. Het is minder 'glijdend' maar even intiem.`,
  coreContentEn: `Body to body massage goes beyond regular erotic massage. The masseuse uses not only her hands, but her entire body to glide over you.

With warm oil, both of you are massaged. Then slow, sensual movements follow where she moves her torso, breasts and legs over your body.

The difference with Nuru massage is that B2B usually works with regular massage oil instead of special Nuru gel. It's less 'slippery' but equally intimate.`,
  benefitsTitle: "Voordelen van Body to Body",
  benefitsTitleEn: "Benefits of Body to Body",
  benefits: [
    { title: "Maximaal huidcontact", description: "Ervaar de sensatie van volledige lichaamsmassage." },
    { title: "Diepe ontspanning", description: "De warmte en druk van een ander lichaam ontspant." },
    { title: "Intieme connectie", description: "Fysieke nabijheid creëert een bijzondere band." },
    { title: "Natuurlijke olie", description: "Warme massageolie verzorgt je huid." },
  ],
  benefitsEn: [
    { title: "Maximum skin contact", description: "Experience the sensation of full body massage." },
    { title: "Deep relaxation", description: "The warmth and pressure of another body relaxes." },
    { title: "Intimate connection", description: "Physical closeness creates a special bond." },
    { title: "Natural oil", description: "Warm massage oil cares for your skin." },
  ],
  pricingTitle: "Tarieven Body to Body",
  pricingTitleEn: "Body to Body Rates",
  pricingContent:
    "Body to body massage begint bij €160 per uur. De warme olie en setting zijn inbegrepen.",
  pricingContentEn:
    "Body to body massage starts at €160 per hour. Warm oil and setting are included.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "B2B Massage Boeken",
  stepsTitleEn: "Book B2B Massage",
  steps: [
    { title: "Kies je masseuse", description: "Selecteer een dame die body to body massage aanbiedt." },
    { title: "Ontspan en geniet", description: "Laat je onderdompelen in warme olie en sensuele aanrakingen." },
    { title: "Sluit af naar wens", description: "De massage eindigt zoals jij dat wilt." },
  ],
  stepsEn: [
    { title: "Choose your masseuse", description: "Select a lady who offers body to body massage." },
    { title: "Relax and enjoy", description: "Let yourself be immersed in warm oil and sensual touches." },
    { title: "Finish as desired", description: "The massage ends however you want." },
  ],
  faqs: [
    { question: "Wat is het verschil met Nuru massage?", answer: "Nuru gebruikt speciale zeewier-gel die extreem glad is. B2B werkt met massageolie, wat een andere sensatie geeft." },
    { question: "Is body to body massage ook sensueel?", answer: "Ja, de volledige huidcontact maakt het zeer sensueel. Het kan eindigen naar wens." },
    { question: "Waar vindt de massage plaats?", answer: "Incall bij de dame of outcall bij jou. Bij outcall brengen we olie en lakens mee." },
  ],
  faqsEn: [
    { question: "What is the difference with Nuru massage?", answer: "Nuru uses special seaweed gel that is extremely smooth. B2B works with massage oil, which gives a different sensation." },
    { question: "Is body to body massage also sensual?", answer: "Yes, the full skin contact makes it very sensual. It can end as desired." },
    { question: "Where does the massage take place?", answer: "Incall at the lady's or outcall at yours. For outcall we bring oil and sheets." },
  ],
  relatedServices: [
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "nuru-massage", label: "Nuru Massage", labelEn: "Nuru Massage" },
    { slug: "tantra-massage", label: "Tantra Massage", labelEn: "Tantra Massage" },
  ],
  relatedTypes: [
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/body-to-body-massage.jpg",
  primaryImageAlt: "Body to body massage - volledige huidcontact",
  primaryImageAltEn: "Body to body massage - full skin contact",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/body-to-body-massage.jpg",
  quotePool: [
    "De sensatie van huid op huid is onbeschrijflijk.",
    "Intenser dan ik verwachtte, in positieve zin.",
    "Perfect voor diepe ontspanning.",
  ],
  trustBadges: ["Warme olie", "Ervaren masseuses", "Discreet en veilig"],
  trustBadgesEn: ["Warm oil", "Experienced masseuses", "Discreet and safe"],
};

/**
 * Bondage Escort Service Page
 */
export const bondageEscortPageData: ServiceTypeDetailPageData = {
  slug: "bondage-escort",
  pageType: "service",
  seoTitle: "Bondage Escort - Vastbinden & Overgave | Vanaf €160",
  title: "Bondage Escort",
  titleEn: "Bondage Escort",
  metaDescription:
    "Boek een escort voor bondage. ✓ Vastbinden of vastgebonden worden ✓ Zachte tot strakke bondage ✓ Veilig en ervaren ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for bondage. ✓ Tie up or be tied ✓ Soft to tight bondage ✓ Safe and experienced ✓ Available 24/7 discreetly.",
  heroIntro:
    "Bondage draait om controle, overgave en vertrouwen. Of je nu wilt vastbinden of vastgebonden worden — onze escorts zijn ervaren in de kunst van bondage, van zacht tot strak.",
  heroIntroEn:
    "Bondage is about control, surrender and trust. Whether you want to tie up or be tied — our escorts are experienced in the art of bondage, from soft to tight.",
  usps: ["Vastbinden of worden", "Zacht tot strak", "Ervaren & veilig"],
  uspsEn: ["Tie up or be tied", "Soft to tight", "Experienced & safe"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat is Bondage?",
  coreContentTitleEn: "What is Bondage?",
  coreContent: `Bondage is het vastbinden van een partner als vorm van erotisch spel. Het draait om machtsverhouding, vertrouwen en verhoogde sensatie door beperking van beweging.

Je kunt degene zijn die vastbindt (dominant) of vastgebonden wordt (submissief). De intensiteit varieert van zachte sjaals en blinddoeken tot touwen en manchetten.

Onze bondage escorts kennen de veiligheidsregels: goede knopen, communicatie en een duidelijk safeword. Vertrouwen staat voorop.`,
  coreContentEn: `Bondage is tying up a partner as a form of erotic play. It's about power dynamics, trust and heightened sensation through restriction of movement.

You can be the one who ties (dominant) or be tied (submissive). The intensity ranges from soft scarves and blindfolds to ropes and cuffs.

Our bondage escorts know the safety rules: proper knots, communication and a clear safeword. Trust comes first.`,
  benefitsTitle: "Voordelen van Bondage",
  benefitsTitleEn: "Benefits of Bondage",
  benefits: [
    { title: "Verhoogde sensatie", description: "Beperking van beweging maakt andere zintuigen intenser." },
    { title: "Overgave ervaren", description: "Laat de controle los en ervaar totale overgave." },
    { title: "Vertrouwen opbouwen", description: "Bondage vereist en versterkt vertrouwen." },
    { title: "Flexibel niveau", description: "Van zacht met blinddoek tot strakker met touwen." },
  ],
  benefitsEn: [
    { title: "Heightened sensation", description: "Restriction of movement makes other senses more intense." },
    { title: "Experience surrender", description: "Let go of control and experience total surrender." },
    { title: "Build trust", description: "Bondage requires and strengthens trust." },
    { title: "Flexible level", description: "From soft with blindfold to tighter with ropes." },
  ],
  pricingTitle: "Tarieven Bondage Escort",
  pricingTitleEn: "Bondage Escort Rates",
  pricingContent:
    "Bondage sessies beginnen bij €160 per uur. Specifieke materialen kunnen extra kosten. Bespreek je wensen vooraf.",
  pricingContentEn:
    "Bondage sessions start at €160 per hour. Specific materials may cost extra. Discuss your wishes in advance.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Bondage Sessie Boeken",
  stepsTitleEn: "Book Bondage Session",
  steps: [
    { title: "Deel je wensen", description: "Wil je vastbinden of vastgebonden worden? Hoe intens?" },
    { title: "Bepaal grenzen", description: "We bespreken grenzen en een safeword vooraf." },
    { title: "Ervaar bondage veilig", description: "Geniet van overgave of controle met een ervaren partner." },
  ],
  stepsEn: [
    { title: "Share your wishes", description: "Do you want to tie up or be tied? How intense?" },
    { title: "Determine boundaries", description: "We discuss boundaries and a safeword beforehand." },
    { title: "Experience bondage safely", description: "Enjoy surrender or control with an experienced partner." },
  ],
  faqs: [
    { question: "Wat is het verschil met BDSM?", answer: "Bondage is een onderdeel van BDSM. Het focust specifiek op vastbinden, zonder andere elementen zoals impact play." },
    { question: "Is bondage veilig?", answer: "Met de juiste technieken en communicatie wel. Onze escorts zijn ervaren en gebruiken altijd een safeword." },
    { question: "Kan ik ook de dame vastbinden?", answer: "Ja, sommige escorts bieden dit aan. Het hangt af van de dame en haar grenzen." },
    { question: "Welke materialen worden gebruikt?", answer: "Van zachte sjaals en blinddoeken tot touwen en manchetten. We bespreken vooraf wat je wilt." },
  ],
  faqsEn: [
    { question: "What is the difference with BDSM?", answer: "Bondage is part of BDSM. It focuses specifically on tying up, without other elements like impact play." },
    { question: "Is bondage safe?", answer: "With the right techniques and communication, yes. Our escorts are experienced and always use a safeword." },
    { question: "Can I also tie up the lady?", answer: "Yes, some escorts offer this. It depends on the lady and her boundaries." },
    { question: "What materials are used?", answer: "From soft scarves and blindfolds to ropes and cuffs. We discuss what you want beforehand." },
  ],
  relatedServices: [
    { slug: "bdsm-escorts", label: "BDSM Escorts", labelEn: "BDSM Escorts" },
    { slug: "rollenspel-escort", label: "Rollenspel", labelEn: "Roleplay" },
    { slug: "fetish-escort", label: "Fetish Escort", labelEn: "Fetish Escort" },
  ],
  relatedTypes: [
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/bondage-escort.jpg",
  primaryImageAlt: "Bondage escort - vastbinden en overgave",
  primaryImageAltEn: "Bondage escort - tying up and surrender",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/bondage-escort.jpg",
  quotePool: [
    "De overgave was intens, maar veilig.",
    "Precies de juiste balans tussen spanning en vertrouwen.",
    "Eindelijk mijn bondage fantasie kunnen uitproberen.",
  ],
  trustBadges: ["Safeword altijd", "Ervaren escorts", "Discreet en veilig"],
  trustBadgesEn: ["Safeword always", "Experienced escorts", "Discreet and safe"],
};

/**
 * Business Escort Service Page
 */
export const businessEscortPageData: ServiceTypeDetailPageData = {
  slug: "business-escort",
  pageType: "service",
  seoTitle: "Business Escort - Zakelijk Gezelschap | Vanaf €200",
  title: "Business Escort",
  titleEn: "Business Escort",
  metaDescription:
    "Boek een escort voor zakelijke gelegenheden. ✓ Representatief gezelschap ✓ Conferenties & diners ✓ Intelligent gesprek ✓ Discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for business occasions. ✓ Representable companionship ✓ Conferences & dinners ✓ Intelligent conversation ✓ Discreetly available.",
  heroIntro:
    "Heb je representatief gezelschap nodig voor een zakelijke gelegenheid? Onze business escorts zijn intelligent, goed gekleed en weten zich te gedragen in professionele settings.",
  heroIntroEn:
    "Need representable companionship for a business occasion? Our business escorts are intelligent, well-dressed and know how to behave in professional settings.",
  usps: ["Representatief", "Intelligent gesprek", "Zakelijke etiquette"],
  uspsEn: ["Representable", "Intelligent conversation", "Business etiquette"],
  priceFrom: "€200",
  minDuration: "2 uur",
  responseTime: "3 uur",
  coreContentTitle: "Wat is Business Escort?",
  coreContentTitleEn: "What is Business Escort?",
  coreContent: `Een business escort biedt professioneel gezelschap voor zakelijke settings: conferenties, diners met klanten, bedrijfsevenementen of netwerkborrels.

Onze dames zijn geselecteerd op intelligentie, presentatie en sociale vaardigheden. Ze kunnen gesprekken voeren over diverse onderwerpen en voelen zich op hun gemak in elke zakelijke omgeving.

De afspraak kan puur zakelijk zijn, of gecombineerd met privétijd na afloop. Dat bepaal je zelf bij boeking.`,
  coreContentEn: `A business escort offers professional companionship for business settings: conferences, dinners with clients, corporate events or networking drinks.

Our ladies are selected for intelligence, presentation and social skills. They can have conversations about various topics and feel comfortable in any business environment.

The appointment can be purely business, or combined with private time afterwards. You decide that when booking.`,
  benefitsTitle: "Voordelen van Business Escort",
  benefitsTitleEn: "Benefits of Business Escort",
  benefits: [
    { title: "Representatieve uitstraling", description: "Professioneel gekleed en verzorgd voor elke gelegenheid." },
    { title: "Intelligente gesprekken", description: "Kan meepraten over zakelijke en algemene onderwerpen." },
    { title: "Sociale vaardigheden", description: "Voelt zich thuis in netwerk- en zakelijke settings." },
    { title: "Flexibele invulling", description: "Puur zakelijk of gecombineerd met privétijd." },
  ],
  benefitsEn: [
    { title: "Representable appearance", description: "Professionally dressed and groomed for any occasion." },
    { title: "Intelligent conversations", description: "Can discuss business and general topics." },
    { title: "Social skills", description: "Feels at home in networking and business settings." },
    { title: "Flexible arrangement", description: "Purely business or combined with private time." },
  ],
  pricingTitle: "Tarieven Business Escort",
  pricingTitleEn: "Business Escort Rates",
  pricingContent:
    "Business escort begint bij €200 voor 2 uur. Langere evenementen op maat. Intimiteit na afloop is optioneel en apart te boeken.",
  pricingContentEn:
    "Business escort starts at €200 for 2 hours. Longer events custom priced. Intimacy afterwards is optional and can be booked separately.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Business Escort Boeken",
  stepsTitleEn: "Book Business Escort",
  steps: [
    { title: "Beschrijf de gelegenheid", description: "Vertel ons over het evenement, dresscode en verwachtingen." },
    { title: "Selectie op maat", description: "We matchen je met een dame die past bij de setting." },
    { title: "Professioneel gezelschap", description: "Je escort voegt waarde toe aan je zakelijke aanwezigheid." },
  ],
  stepsEn: [
    { title: "Describe the occasion", description: "Tell us about the event, dress code and expectations." },
    { title: "Custom selection", description: "We match you with a lady who fits the setting." },
    { title: "Professional companionship", description: "Your escort adds value to your business presence." },
  ],
  faqs: [
    { question: "Is intimiteit inbegrepen bij business escort?", answer: "Niet standaard. Business escort focust op zakelijk gezelschap. Privétijd kan apart worden geboekt." },
    { question: "Welke evenementen zijn geschikt?", answer: "Conferenties, zakelijke diners, awards, netwerkevenementen, beurzen — elke professionele setting." },
    { question: "Hoe weet ik dat ze zich kan gedragen?", answer: "Onze business escorts zijn specifiek geselecteerd op sociale vaardigheden en professionele uitstraling." },
    { question: "Kan ik een specifieke dresscode aanvragen?", answer: "Ja, geef dit door bij boeking. Van cocktailjurk tot zakelijke kleding — ze past zich aan." },
  ],
  faqsEn: [
    { question: "Is intimacy included in business escort?", answer: "Not by default. Business escort focuses on professional companionship. Private time can be booked separately." },
    { question: "What events are suitable?", answer: "Conferences, business dinners, awards, networking events, trade shows — any professional setting." },
    { question: "How do I know she can behave?", answer: "Our business escorts are specifically selected for social skills and professional appearance." },
    { question: "Can I request a specific dress code?", answer: "Yes, mention this when booking. From cocktail dress to business attire — she adapts." },
  ],
  relatedServices: [
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "escort-voor-zakelijke-evenementen", label: "Zakelijke Events", labelEn: "Business Events" },
    { slug: "reisgezelschap", label: "Reisgezelschap", labelEn: "Travel Companion" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/business-escort.jpg",
  primaryImageAlt: "Business escort - zakelijk gezelschap",
  primaryImageAltEn: "Business escort - professional companionship",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/business-escort.jpg",
  quotePool: [
    "Ze paste perfect in de zakelijke setting.",
    "Intelligente gesprekken, niemand had door dat het een escort was.",
    "Professioneel en charmant, precies wat ik nodig had.",
  ],
  trustBadges: ["Zakelijke etiquette", "Representatief", "Discreet"],
  trustBadgesEn: ["Business etiquette", "Representable", "Discreet"],
};

/**
 * Cardate Escort Service Page
 */
export const cardateEscortPageData: ServiceTypeDetailPageData = {
  slug: "cardate-escort",
  pageType: "service",
  seoTitle: "Cardate Escort - Discrete Auto-Afspraak | Vanaf €100",
  title: "Cardate Escort",
  titleEn: "Car Date Escort",
  metaDescription:
    "Boek een cardate bij Desire Escorts. ✓ Discrete afspraak in de auto ✓ Snelle service ✓ Geen hotelkosten ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a car date at Desire Escorts. ✓ Discreet appointment in the car ✓ Fast service ✓ No hotel costs ✓ Available 24/7.",
  heroIntro:
    "Snel en discreet, zonder hotelkosten. Een cardate is een intieme ontmoeting in de auto op een rustige locatie. Ideaal voor wie weinig tijd heeft of maximale discretie zoekt.",
  heroIntroEn:
    "Fast and discreet, without hotel costs. A car date is an intimate meeting in the car at a quiet location. Ideal for those with little time or seeking maximum discretion.",
  usps: ["Snel & discreet", "Geen hotelkosten", "Flexibele locatie"],
  uspsEn: ["Fast & discreet", "No hotel costs", "Flexible location"],
  priceFrom: "€100",
  minDuration: "30 min",
  responseTime: "45 min",
  coreContentTitle: "Hoe werkt een Cardate?",
  coreContentTitleEn: "How does a Car Date work?",
  coreContent: `Een cardate vindt plaats in jouw auto op een discrete, rustige locatie. We spreken een plek af waar privacy gegarandeerd is — vaak een parkeerplaats of rustige straat.

De escort komt naar de afgesproken locatie. Jullie ontmoeten elkaar in de auto voor een korte, intieme sessie. Achteraf vertrekt de escort weer.

Cardates zijn korter dan reguliere boekingen. Ideaal voor een snelle ontmoeting tijdens een pauze of onderweg.`,
  coreContentEn: `A car date takes place in your car at a discreet, quiet location. We agree on a place where privacy is guaranteed — often a parking lot or quiet street.

The escort comes to the agreed location. You meet each other in the car for a short, intimate session. Afterwards the escort leaves again.

Car dates are shorter than regular bookings. Ideal for a quick meeting during a break or on the go.`,
  benefitsTitle: "Voordelen van Cardate",
  benefitsTitleEn: "Benefits of Car Date",
  benefits: [
    { title: "Maximale discretie", description: "Geen hotel, geen sporen, volledig anoniem." },
    { title: "Kostenefficiënt", description: "Geen hotelkosten, lagere prijs." },
    { title: "Snel geregeld", description: "Van boeking tot ontmoeting vaak binnen een uur." },
    { title: "Flexibele locatie", description: "Jij kiest de plek, wij komen naar je toe." },
  ],
  benefitsEn: [
    { title: "Maximum discretion", description: "No hotel, no traces, completely anonymous." },
    { title: "Cost-efficient", description: "No hotel costs, lower price." },
    { title: "Quickly arranged", description: "From booking to meeting often within an hour." },
    { title: "Flexible location", description: "You choose the place, we come to you." },
  ],
  pricingTitle: "Tarieven Cardate",
  pricingTitleEn: "Car Date Rates",
  pricingContent:
    "Cardates beginnen bij €100 voor 30 minuten. Langere sessies beschikbaar. Snelle, betaalbare optie.",
  pricingContentEn:
    "Car dates start at €100 for 30 minutes. Longer sessions available. Fast, affordable option.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Cardate Boeken",
  stepsTitleEn: "Book Car Date",
  steps: [
    { title: "Geef je locatie door", description: "Vertel ons waar je bent of wilt afspreken." },
    { title: "Ontvang bevestiging", description: "We matchen een escort en bevestigen de plek." },
    { title: "Ontmoet discreet", description: "De escort komt naar je auto voor een snelle, intieme ontmoeting." },
  ],
  stepsEn: [
    { title: "Provide your location", description: "Tell us where you are or want to meet." },
    { title: "Receive confirmation", description: "We match an escort and confirm the location." },
    { title: "Meet discreetly", description: "The escort comes to your car for a quick, intimate meeting." },
  ],
  faqs: [
    { question: "Waar kan een cardate plaatsvinden?", answer: "Op elke rustige, discrete locatie. We adviseren parkeerplaatsen of rustige straten waar privacy gegarandeerd is." },
    { question: "Hoe lang duurt een cardate?", answer: "Standaard 30 minuten. Langere opties beschikbaar, bespreek dit bij boeking." },
    { question: "Is een cardate veilig?", answer: "Ja, we kiezen alleen locaties waar privacy en veiligheid gegarandeerd zijn." },
    { question: "Kan ik een specifieke dame kiezen?", answer: "Ja, afhankelijk van beschikbaarheid. Niet alle escorts doen cardates." },
  ],
  faqsEn: [
    { question: "Where can a car date take place?", answer: "At any quiet, discreet location. We advise parking lots or quiet streets where privacy is guaranteed." },
    { question: "How long does a car date last?", answer: "Standard 30 minutes. Longer options available, discuss when booking." },
    { question: "Is a car date safe?", answer: "Yes, we only choose locations where privacy and safety are guaranteed." },
    { question: "Can I choose a specific lady?", answer: "Yes, depending on availability. Not all escorts do car dates." },
  ],
  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "goedkope-escorts", label: "Goedkope Escort", labelEn: "Budget Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/cardate-escort.jpg",
  primaryImageAlt: "Cardate escort - discrete auto-afspraak",
  primaryImageAltEn: "Car date escort - discreet car appointment",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/cardate-escort.jpg",
  quotePool: [
    "Snel, discreet en precies wat ik nodig had.",
    "Geen gedoe met hotels, puur en simpel.",
    "Perfect voor een snelle pauze.",
  ],
  trustBadges: ["Maximale discretie", "Snel geregeld", "Geen hotelkosten"],
  trustBadgesEn: ["Maximum discretion", "Quickly arranged", "No hotel costs"],
};

/**
 * Fetish Escort Service Page
 */
export const fetishEscortPageData: ServiceTypeDetailPageData = {
  slug: "fetish-escort",
  pageType: "service",
  seoTitle: "Fetish Escort - Voor Bijzondere Voorkeuren | Vanaf €160",
  title: "Fetish Escort",
  titleEn: "Fetish Escort",
  metaDescription:
    "Boek een escort voor je fetisj. ✓ Diverse fetisjen welkom ✓ Geen oordeel ✓ Ervaren en open-minded ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for your fetish. ✓ Various fetishes welcome ✓ No judgment ✓ Experienced and open-minded ✓ Available 24/7 discreetly.",
  heroIntro:
    "Heb je een specifieke fetisj die je wilt verkennen? Onze fetish escorts zijn open-minded en ervaren met diverse voorkeuren. Van voetfetisj tot latex, van lingerie tot specifieke scenario's.",
  heroIntroEn:
    "Do you have a specific fetish you want to explore? Our fetish escorts are open-minded and experienced with various preferences. From foot fetish to latex, from lingerie to specific scenarios.",
  usps: ["Diverse fetisjen", "Geen oordeel", "Ervaren & open-minded"],
  uspsEn: ["Various fetishes", "No judgment", "Experienced & open-minded"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat bieden Fetish Escorts?",
  coreContentTitleEn: "What do Fetish Escorts offer?",
  coreContent: `Fetisjes zijn persoonlijk en gevarieerd. Onze escorts zijn opgeleid om zonder oordeel in te gaan op diverse voorkeuren die je misschien nergens anders kunt delen.

Populaire fetisjen zijn voetfetisj, lingerie, latex en leer, maar we staan open voor gesprek over jouw specifieke interesses. Bespreek vooraf wat je zoekt, dan matchen we je met de juiste dame.

Grenzen worden altijd gerespecteerd. Een fetish sessie draait om wederzijds plezier en comfort.`,
  coreContentEn: `Fetishes are personal and varied. Our escorts are trained to respond to various preferences without judgment that you might not be able to share anywhere else.

Popular fetishes are foot fetish, lingerie, latex and leather, but we are open to discussion about your specific interests. Discuss what you're looking for beforehand, then we match you with the right lady.

Boundaries are always respected. A fetish session is about mutual pleasure and comfort.`,
  benefitsTitle: "Voordelen van Fetish Escort",
  benefitsTitleEn: "Benefits of Fetish Escort",
  benefits: [
    { title: "Geen oordeel", description: "Verken je voorkeuren in een veilige, accepterende omgeving." },
    { title: "Ervaren dames", description: "Onze escorts weten hoe ze met fetisjen moeten omgaan." },
    { title: "Breed scala", description: "Van mild tot intenser — veel mogelijkheden." },
    { title: "Discretie verzekerd", description: "Je voorkeuren blijven privé." },
  ],
  benefitsEn: [
    { title: "No judgment", description: "Explore your preferences in a safe, accepting environment." },
    { title: "Experienced ladies", description: "Our escorts know how to handle fetishes." },
    { title: "Wide range", description: "From mild to more intense — many possibilities." },
    { title: "Discretion assured", description: "Your preferences remain private." },
  ],
  pricingTitle: "Tarieven Fetish Escort",
  pricingTitleEn: "Fetish Escort Rates",
  pricingContent:
    "Fetish sessies beginnen bij €160 per uur. Specifieke materialen of kleding kunnen extra kosten. Bespreek je wensen vooraf.",
  pricingContentEn:
    "Fetish sessions start at €160 per hour. Specific materials or clothing may cost extra. Discuss your wishes in advance.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Fetish Sessie Boeken",
  stepsTitleEn: "Book Fetish Session",
  steps: [
    { title: "Deel je voorkeuren", description: "Vertel ons welke fetisj je wilt verkennen, zonder schaamte." },
    { title: "Match met open-minded dame", description: "We selecteren een escort die ervaring heeft met jouw interesses." },
    { title: "Verken zonder oordeel", description: "Geniet van een sessie die draait om jouw plezier." },
  ],
  stepsEn: [
    { title: "Share your preferences", description: "Tell us what fetish you want to explore, without shame." },
    { title: "Match with open-minded lady", description: "We select an escort who has experience with your interests." },
    { title: "Explore without judgment", description: "Enjoy a session that revolves around your pleasure." },
  ],
  faqs: [
    { question: "Welke fetisjen bieden jullie aan?", answer: "Voetfetisj, lingerie, latex, leer, rollenspel en meer. Vraag naar specifieke interesses bij boeking." },
    { question: "Zijn alle escorts open voor fetisjen?", answer: "Nee, sommige dames specialiseren zich hierin. We matchen je met de juiste escort." },
    { question: "Moet ik materialen zelf meebrengen?", answer: "Dat kan, maar sommige escorts hebben eigen kleding en materialen. Bespreek dit vooraf." },
    { question: "Blijven mijn voorkeuren privé?", answer: "Absoluut. Discretie is gegarandeerd, je voorkeuren worden nooit gedeeld." },
  ],
  faqsEn: [
    { question: "What fetishes do you offer?", answer: "Foot fetish, lingerie, latex, leather, roleplay and more. Ask about specific interests when booking." },
    { question: "Are all escorts open to fetishes?", answer: "No, some ladies specialize in this. We match you with the right escort." },
    { question: "Do I need to bring materials myself?", answer: "You can, but some escorts have their own clothing and materials. Discuss this beforehand." },
    { question: "Do my preferences remain private?", answer: "Absolutely. Discretion is guaranteed, your preferences are never shared." },
  ],
  relatedServices: [
    { slug: "voetfetish-escort", label: "Voetfetish", labelEn: "Foot Fetish" },
    { slug: "bdsm-escorts", label: "BDSM", labelEn: "BDSM" },
    { slug: "rollenspel-escort", label: "Rollenspel", labelEn: "Roleplay" },
  ],
  relatedTypes: [
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/fetish-escort.jpg",
  primaryImageAlt: "Fetish escort - voor bijzondere voorkeuren",
  primaryImageAltEn: "Fetish escort - for special preferences",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/fetish-escort.jpg",
  quotePool: [
    "Eindelijk iemand die mijn voorkeur begrijpt.",
    "Geen oordeel, alleen acceptatie en plezier.",
    "Professioneel en open-minded, precies wat ik zocht.",
  ],
  trustBadges: ["Oordeelvrij", "Ervaren escorts", "Discreet"],
  trustBadgesEn: ["Judgment-free", "Experienced escorts", "Discreet"],
};

/**
 * First Time Experience Service Page
 */
export const firstTimeExperiencePageData: ServiceTypeDetailPageData = {
  slug: "first-time-experience",
  pageType: "service",
  seoTitle: "First Time Experience - Begeleiding voor Beginners | Vanaf €160",
  title: "First Time Experience",
  titleEn: "First Time Experience",
  metaDescription:
    "Je eerste escort ervaring bij Desire Escorts. ✓ Geduldige begeleiding ✓ Geen haast ✓ Comfortabele sfeer ✓ Perfect voor beginners.",
  metaDescriptionEn:
    "Your first escort experience at Desire Escorts. ✓ Patient guidance ✓ No rush ✓ Comfortable atmosphere ✓ Perfect for beginners.",
  heroIntro:
    "Is dit je eerste keer met een escort? Geen zorgen. Onze First Time Experience is speciaal voor beginners: geduldige dames die je op je gemak stellen en je begeleiden door de ervaring.",
  heroIntroEn:
    "Is this your first time with an escort? Don't worry. Our First Time Experience is specially for beginners: patient ladies who put you at ease and guide you through the experience.",
  usps: ["Voor beginners", "Geduldige begeleiding", "Geen haast"],
  uspsEn: ["For beginners", "Patient guidance", "No rush"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat is de First Time Experience?",
  coreContentTitleEn: "What is the First Time Experience?",
  coreContent: `De First Time Experience is ontworpen voor gasten die nog nooit een escort hebben geboekt. We begrijpen dat de eerste keer spannend kan zijn — wij nemen die spanning weg.

Onze geselecteerde dames zijn extra geduldig en begripvol. Ze nemen de tijd om je op je gemak te stellen, leggen uit wat je kunt verwachten, en laten je het tempo bepalen.

Er is geen druk om bepaalde dingen te doen. De sessie draait om jouw comfort en een positieve eerste ervaring.`,
  coreContentEn: `The First Time Experience is designed for guests who have never booked an escort before. We understand that the first time can be exciting — we take that tension away.

Our selected ladies are extra patient and understanding. They take time to put you at ease, explain what you can expect, and let you set the pace.

There's no pressure to do certain things. The session is about your comfort and a positive first experience.`,
  benefitsTitle: "Voordelen voor Beginners",
  benefitsTitleEn: "Benefits for Beginners",
  benefits: [
    { title: "Geen druk", description: "Jij bepaalt het tempo, er zijn geen verwachtingen." },
    { title: "Begripvolle dames", description: "Geselecteerd op geduld en empathie." },
    { title: "Uitleg en begeleiding", description: "De dame legt uit wat je kunt verwachten." },
    { title: "Positieve start", description: "Een goede eerste ervaring voor vertrouwen." },
  ],
  benefitsEn: [
    { title: "No pressure", description: "You set the pace, there are no expectations." },
    { title: "Understanding ladies", description: "Selected for patience and empathy." },
    { title: "Explanation and guidance", description: "The lady explains what to expect." },
    { title: "Positive start", description: "A good first experience for confidence." },
  ],
  pricingTitle: "Tarieven First Time Experience",
  pricingTitleEn: "First Time Experience Rates",
  pricingContent:
    "First Time Experience begint bij €160 per uur. We raden minstens 1,5 uur aan voor een ontspannen eerste keer.",
  pricingContentEn:
    "First Time Experience starts at €160 per hour. We recommend at least 1.5 hours for a relaxed first time.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Je Eerste Keer Boeken",
  stepsTitleEn: "Book Your First Time",
  steps: [
    { title: "Neem contact op", description: "Vertel ons dat het je eerste keer is, dat is alles." },
    { title: "Match met geduldige dame", description: "We selecteren een escort die ervaring heeft met beginners." },
    { title: "Ontspan en geniet", description: "Laat de dame je begeleiden naar een positieve ervaring." },
  ],
  stepsEn: [
    { title: "Get in touch", description: "Tell us it's your first time, that's all." },
    { title: "Match with patient lady", description: "We select an escort experienced with beginners." },
    { title: "Relax and enjoy", description: "Let the lady guide you to a positive experience." },
  ],
  faqs: [
    { question: "Ik schaam me dat het mijn eerste keer is", answer: "Dat hoeft niet. Iedereen heeft een eerste keer. Onze dames zijn discreet en begripvol." },
    { question: "Wat als ik nerveus ben?", answer: "Dat is normaal. De dame neemt de tijd om je op je gemak te stellen. Geen haast." },
    { question: "Moet ik weten wat ik wil?", answer: "Nee, de escort begeleidt je. Je kunt ontdekken wat je fijn vindt." },
    { question: "Is de prijs anders voor beginners?", answer: "Nee, de prijs is hetzelfde. We selecteren alleen zorgvuldig de juiste dame." },
  ],
  faqsEn: [
    { question: "I'm embarrassed it's my first time", answer: "No need. Everyone has a first time. Our ladies are discreet and understanding." },
    { question: "What if I'm nervous?", answer: "That's normal. The lady takes time to put you at ease. No rush." },
    { question: "Do I need to know what I want?", answer: "No, the escort guides you. You can discover what you like." },
    { question: "Is the price different for beginners?", answer: "No, the price is the same. We just carefully select the right lady." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/first-time-escort.jpg",
  primaryImageAlt: "First time experience - begeleiding voor beginners",
  primaryImageAltEn: "First time experience - guidance for beginners",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/first-time-escort.jpg",
  quotePool: [
    "Ze nam alle spanning weg, perfecte eerste ervaring.",
    "Geen druk, alleen geduld en warmte.",
    "Ik was nerveus maar voelde me direct op mijn gemak.",
  ],
  trustBadges: ["Geduldige begeleiding", "Geen oordeel", "Discreet"],
  trustBadgesEn: ["Patient guidance", "No judgment", "Discreet"],
};

/**
 * Orale Seks Service Page
 */
export const oraleSeksPageData: ServiceTypeDetailPageData = {
  slug: "orale-seks",
  pageType: "service",
  seoTitle: "Orale Seks Escort - Pijpen & Beffen | Vanaf €160",
  title: "Orale Seks",
  titleEn: "Oral Sex",
  metaDescription:
    "Boek een escort voor orale seks. ✓ Pijpen en beffen beschikbaar ✓ Ervaren dames ✓ Bespreek voorkeuren vooraf ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for oral sex. ✓ Oral services available ✓ Experienced ladies ✓ Discuss preferences beforehand ✓ Available 24/7 discreetly.",
  heroIntro:
    "Orale seks is voor veel gasten een essentieel onderdeel van de ervaring. Onze escorts bieden zowel actieve als passieve orale diensten aan — bespreek je voorkeuren bij boeking.",
  heroIntroEn:
    "Oral sex is an essential part of the experience for many guests. Our escorts offer both active and passive oral services — discuss your preferences when booking.",
  usps: ["Pijpen beschikbaar", "Beffen beschikbaar", "Bespreek voorkeuren"],
  uspsEn: ["Oral available", "Cunnilingus available", "Discuss preferences"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Orale Diensten",
  coreContentTitleEn: "Oral Services",
  coreContent: `Orale seks is onderdeel van de standaard escortervaring bij de meeste van onze dames. Dit omvat pijpen (voor de gast) en beffen (voor de dame), afhankelijk van wederzijdse voorkeuren.

Niet alle escorts bieden dezelfde diensten aan. Sommige dames doen alleen met condoom, anderen ook zonder (OWO). Dit staat op het profiel of kun je navragen.

Communiceer je voorkeuren vooraf. Zo matchen we je met de juiste dame en voorkom je verrassingen.`,
  coreContentEn: `Oral sex is part of the standard escort experience with most of our ladies. This includes oral (for the guest) and cunnilingus (for the lady), depending on mutual preferences.

Not all escorts offer the same services. Some ladies only do with condom, others also without (OWO). This is on the profile or you can inquire.

Communicate your preferences beforehand. This way we match you with the right lady and prevent surprises.`,
  benefitsTitle: "Wat wordt aangeboden",
  benefitsTitleEn: "What is offered",
  benefits: [
    { title: "Actief oraal", description: "Pijpen door de dame, met of zonder condoom afhankelijk van escort." },
    { title: "Passief oraal", description: "Beffen — veel dames waarderen dit als onderdeel van de sessie." },
    { title: "69 positie", description: "Wederzijds oraal tegelijkertijd, populaire optie." },
    { title: "Duidelijke communicatie", description: "Bespreek vooraf wat wel en niet kan." },
  ],
  benefitsEn: [
    { title: "Active oral", description: "Oral by the lady, with or without condom depending on escort." },
    { title: "Passive oral", description: "Cunnilingus — many ladies appreciate this as part of the session." },
    { title: "69 position", description: "Mutual oral simultaneously, popular option." },
    { title: "Clear communication", description: "Discuss beforehand what is and isn't possible." },
  ],
  pricingTitle: "Tarieven",
  pricingTitleEn: "Rates",
  pricingContent:
    "Orale seks is standaard onderdeel van de escortservice vanaf €160 per uur. Specifieke voorkeuren (zoals OWO) kunnen de prijs beïnvloeden.",
  pricingContentEn:
    "Oral sex is a standard part of the escort service from €160 per hour. Specific preferences (like OWO) may affect the price.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Boeken met Orale Voorkeuren",
  stepsTitleEn: "Book with Oral Preferences",
  steps: [
    { title: "Deel je voorkeuren", description: "Geef aan welke orale diensten je zoekt." },
    { title: "Ontvang bevestiging", description: "We matchen je met een escort die past." },
    { title: "Geniet zonder verrassingen", description: "Alles is vooraf besproken." },
  ],
  stepsEn: [
    { title: "Share your preferences", description: "Indicate what oral services you're looking for." },
    { title: "Receive confirmation", description: "We match you with an escort who fits." },
    { title: "Enjoy without surprises", description: "Everything is discussed beforehand." },
  ],
  faqs: [
    { question: "Bieden alle escorts orale seks aan?", answer: "De meesten wel, maar niet allemaal hetzelfde. Sommige doen alleen met condoom (OWC), anderen ook zonder (OWO)." },
    { question: "Wat is OWO en OWC?", answer: "OWO = Oraal Zonder (condoom), OWC = Oraal With Condoom. Dit verschilt per escort." },
    { question: "Kan ik de dame ook oraal verwennen?", answer: "Veel escorts waarderen beffen. Dit is wederzijds fijner voor de ervaring." },
    { question: "Moet ik apart betalen voor orale seks?", answer: "Nee, standaard orale diensten zijn inbegrepen in de uurprijs. Specifieke voorkeuren kunnen extra zijn." },
  ],
  faqsEn: [
    { question: "Do all escorts offer oral sex?", answer: "Most do, but not all the same. Some only do with condom (OWC), others also without (OWO)." },
    { question: "What is OWO and OWC?", answer: "OWO = Oral Without (condom), OWC = Oral With Condom. This differs per escort." },
    { question: "Can I also orally please the lady?", answer: "Many escorts appreciate cunnilingus. This makes the experience mutually more pleasant." },
    { question: "Do I have to pay extra for oral sex?", answer: "No, standard oral services are included in the hourly rate. Specific preferences may be extra." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "anale-seks", label: "Anale Seks", labelEn: "Anal Sex" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/orale-seks-escort.jpg",
  primaryImageAlt: "Orale seks escort",
  primaryImageAltEn: "Oral sex escort",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/orale-seks-escort.jpg",
  quotePool: [
    "Duidelijke communicatie vooraf, geen verrassingen.",
    "Ze wist precies wat ze deed.",
    "Wederzijds oraal maakte de ervaring compleet.",
  ],
  trustBadges: ["Diensten per escort", "Duidelijke communicatie", "Discreet"],
  trustBadgesEn: ["Services per escort", "Clear communication", "Discreet"],
};

/**
 * SM Escort Service Page
 */
export const smEscortPageData: ServiceTypeDetailPageData = {
  slug: "sm-escort",
  pageType: "service",
  seoTitle: "SM Escort - Sado-Masochisme | Vanaf €160",
  title: "SM Escort",
  titleEn: "SM Escort",
  metaDescription:
    "Boek een escort voor SM sessies. ✓ Sado-masochisme ervaring ✓ Pijn en plezier ✓ Ervaren en veilig ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for SM sessions. ✓ Sado-masochism experience ✓ Pain and pleasure ✓ Experienced and safe ✓ Available 24/7 discreetly.",
  heroIntro:
    "SM staat voor Sado-Masochisme: de kunst van pijn en plezier. Onze SM escorts zijn ervaren in het toedienen of ontvangen van pijn binnen veilige grenzen.",
  heroIntroEn:
    "SM stands for Sado-Masochism: the art of pain and pleasure. Our SM escorts are experienced in giving or receiving pain within safe boundaries.",
  usps: ["Pijn & plezier", "Sadistisch of masochistisch", "Veilig & consensueel"],
  uspsEn: ["Pain & pleasure", "Sadistic or masochistic", "Safe & consensual"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Wat is SM?",
  coreContentTitleEn: "What is SM?",
  coreContent: `Sado-Masochisme combineert het geven (sadisme) en ontvangen (masochisme) van pijn als bron van seksueel plezier. Het is een onderdeel van BDSM maar focust specifiek op de pijn-plezier dynamiek.

Onze SM escorts kunnen beide rollen vervullen, afhankelijk van jouw voorkeur. Van lichte spanking tot intensere impact play — het niveau pas je samen aan.

Veiligheid is essentieel. We werken altijd met safewords en bespreken grenzen vooraf. Pijn wordt gecontroleerd toegediend met respect voor limieten.`,
  coreContentEn: `Sado-Masochism combines giving (sadism) and receiving (masochism) pain as a source of sexual pleasure. It's part of BDSM but focuses specifically on the pain-pleasure dynamic.

Our SM escorts can fulfill both roles, depending on your preference. From light spanking to more intense impact play — you adjust the level together.

Safety is essential. We always work with safewords and discuss boundaries beforehand. Pain is administered in a controlled manner with respect for limits.`,
  benefitsTitle: "SM Ervaring",
  benefitsTitleEn: "SM Experience",
  benefits: [
    { title: "Gecontroleerde intensiteit", description: "Van licht tot intenser — jij bepaalt het niveau." },
    { title: "Beide rollen mogelijk", description: "Wil je pijn geven of ontvangen? Wij hebben beide." },
    { title: "Veilige omgeving", description: "Safewords en grenzen worden altijd gerespecteerd." },
    { title: "Ervaren partners", description: "Onze escorts kennen de technieken voor veilige SM." },
  ],
  benefitsEn: [
    { title: "Controlled intensity", description: "From light to more intense — you determine the level." },
    { title: "Both roles possible", description: "Want to give or receive pain? We have both." },
    { title: "Safe environment", description: "Safewords and boundaries are always respected." },
    { title: "Experienced partners", description: "Our escorts know the techniques for safe SM." },
  ],
  pricingTitle: "Tarieven SM Escort",
  pricingTitleEn: "SM Escort Rates",
  pricingContent:
    "SM sessies beginnen bij €160 per uur. Specifieke tools of intensiteit kunnen extra kosten. Langere sessies aanbevolen.",
  pricingContentEn:
    "SM sessions start at €160 per hour. Specific tools or intensity may cost extra. Longer sessions recommended.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "SM Sessie Boeken",
  stepsTitleEn: "Book SM Session",
  steps: [
    { title: "Deel je voorkeuren", description: "Wil je sadist of masochist zijn? Welk niveau?" },
    { title: "Bepaal grenzen samen", description: "We bespreken limieten en een safeword." },
    { title: "Ervaar SM veilig", description: "Geniet van pijn en plezier binnen veilige grenzen." },
  ],
  stepsEn: [
    { title: "Share your preferences", description: "Want to be sadist or masochist? What level?" },
    { title: "Determine boundaries together", description: "We discuss limits and a safeword." },
    { title: "Experience SM safely", description: "Enjoy pain and pleasure within safe boundaries." },
  ],
  faqs: [
    { question: "Wat is het verschil tussen SM en BDSM?", answer: "SM is het pijn-plezier aspect van BDSM. BDSM is breder en omvat ook bondage en dominantie zonder pijn." },
    { question: "Is SM niet gevaarlijk?", answer: "Met de juiste kennis, communicatie en safewords is SM veilig. Onze escorts zijn ervaren." },
    { question: "Kan ik ook de dominante rol hebben?", answer: "Ja, sommige escorts zijn masochistisch en ontvangen graag. Bespreek je rol bij boeking." },
    { question: "Hoe intens wordt SM?", answer: "Dat bepaal je zelf. Van lichte spanking tot intenser — altijd in overleg en met respect voor grenzen." },
  ],
  faqsEn: [
    { question: "What is the difference between SM and BDSM?", answer: "SM is the pain-pleasure aspect of BDSM. BDSM is broader and also includes bondage and dominance without pain." },
    { question: "Isn't SM dangerous?", answer: "With proper knowledge, communication and safewords, SM is safe. Our escorts are experienced." },
    { question: "Can I also have the dominant role?", answer: "Yes, some escorts are masochistic and enjoy receiving. Discuss your role when booking." },
    { question: "How intense does SM get?", answer: "You decide that yourself. From light spanking to more intense — always in consultation and with respect for boundaries." },
  ],
  relatedServices: [
    { slug: "bdsm-escorts", label: "BDSM", labelEn: "BDSM" },
    { slug: "bondage-escort", label: "Bondage", labelEn: "Bondage" },
    { slug: "fetish-escort", label: "Fetish", labelEn: "Fetish" },
  ],
  relatedTypes: [
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/sm-escort.jpg",
  primaryImageAlt: "SM escort - sado-masochisme",
  primaryImageAltEn: "SM escort - sado-masochism",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/sm-escort.jpg",
  quotePool: [
    "Precies de juiste balans tussen pijn en plezier.",
    "Ze wist precies hoe ver ze kon gaan.",
    "Eindelijk SM kunnen ervaren met een professional.",
  ],
  trustBadges: ["Safeword altijd", "Ervaren partners", "Discreet"],
  trustBadgesEn: ["Safeword always", "Experienced partners", "Discreet"],
};

/**
 * Uitgaan Escort Service Page
 */
export const uitgaanEscortPageData: ServiceTypeDetailPageData = {
  slug: "uitgaan-escort",
  pageType: "service",
  seoTitle: "Uitgaan Escort - Clubs & Feesten | Vanaf €200",
  title: "Uitgaan Escort",
  titleEn: "Going Out Escort",
  metaDescription:
    "Boek een escort voor een avondje uit. ✓ Clubs en feesten ✓ Stijlvol gezelschap ✓ Dans en plezier ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book an escort for a night out. ✓ Clubs and parties ✓ Stylish companionship ✓ Dancing and fun ✓ Available 24/7.",
  heroIntro:
    "Ga uit met een prachtige vrouw aan je zijde. Onze uitgaan escorts zijn perfect voor clubbezoek, feesten en evenementen. Geniet van dansen, drinken en flirten — en sluit de avond af zoals jij wilt.",
  heroIntroEn:
    "Go out with a beautiful woman by your side. Our going out escorts are perfect for club visits, parties and events. Enjoy dancing, drinking and flirting — and end the evening however you want.",
  usps: ["Clubs & feesten", "Stijlvol gezelschap", "Avond + intiem"],
  uspsEn: ["Clubs & parties", "Stylish companionship", "Night + intimate"],
  priceFrom: "€200",
  minDuration: "3 uur",
  responseTime: "3 uur",
  coreContentTitle: "Uitgaan met een Escort",
  coreContentTitleEn: "Going Out with an Escort",
  coreContent: `Een uitgaan escort is je perfecte metgezel voor het nachtleven. Of je nu naar een club gaat, een feest bezoekt of gewoon wilt borrelen in een bar — je hebt aantrekkelijk gezelschap aan je zijde.

Onze dames zijn geselecteerd op uitstraling, dansvaardigheid en sociale skills. Ze voelen zich thuis in het uitgaansleven en zorgen dat je een geweldige avond hebt.

De avond eindigt vaak intiem — in een hotel of bij jou thuis. De combinatie van uitgaan en privétijd maakt het een complete ervaring.`,
  coreContentEn: `A going out escort is your perfect companion for nightlife. Whether you're going to a club, visiting a party or just want drinks at a bar — you have attractive company by your side.

Our ladies are selected for appearance, dancing skills and social abilities. They feel at home in nightlife and ensure you have a great evening.

The evening often ends intimately — in a hotel or at your place. The combination of going out and private time makes it a complete experience.`,
  benefitsTitle: "Voordelen van Uitgaan Escort",
  benefitsTitleEn: "Benefits of Going Out Escort",
  benefits: [
    { title: "Altijd gezelschap", description: "Nooit meer alleen naar de club of een feest." },
    { title: "Indruk maken", description: "Arriveer met een prachtige vrouw aan je zijde." },
    { title: "Plezier gegarandeerd", description: "Dansen, drinken, flirten — geniet van de avond." },
    { title: "Intieme afsluiting", description: "De avond eindigt privé, als je dat wilt." },
  ],
  benefitsEn: [
    { title: "Always company", description: "Never go to the club or a party alone again." },
    { title: "Make an impression", description: "Arrive with a beautiful woman by your side." },
    { title: "Fun guaranteed", description: "Dancing, drinking, flirting — enjoy the evening." },
    { title: "Intimate finish", description: "The evening ends privately, if you want." },
  ],
  pricingTitle: "Tarieven Uitgaan Escort",
  pricingTitleEn: "Going Out Escort Rates",
  pricingContent:
    "Uitgaan escort begint bij €200 voor 3 uur. Langere avonden op maat. Entree en drankjes voor eigen rekening.",
  pricingContentEn:
    "Going out escort starts at €200 for 3 hours. Longer evenings custom priced. Entry and drinks at your expense.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Uitgaan Escort Boeken",
  stepsTitleEn: "Book Going Out Escort",
  steps: [
    { title: "Plan je avond", description: "Waar wil je naartoe? Club, bar, feest?" },
    { title: "Match met de juiste dame", description: "We selecteren een escort die past bij het uitgaansleven." },
    { title: "Geniet van de nacht", description: "Dans, drink, flirt — en sluit intiem af." },
  ],
  stepsEn: [
    { title: "Plan your evening", description: "Where do you want to go? Club, bar, party?" },
    { title: "Match with the right lady", description: "We select an escort who fits the nightlife." },
    { title: "Enjoy the night", description: "Dance, drink, flirt — and finish intimately." },
  ],
  faqs: [
    { question: "Kan de escort ook dansen?", answer: "Ja, onze uitgaan escorts zijn geselecteerd op uitstraling en dansvaardigheid." },
    { question: "Wie betaalt de entree en drankjes?", answer: "Die zijn voor jouw rekening. De escortservice is apart." },
    { question: "Is intimiteit inbegrepen?", answer: "Ja, de prijs is inclusief privétijd na het uitgaan." },
    { question: "Hoe lang duurt een uitgaan escort?", answer: "Minimaal 3 uur. Langere avonden op maat beschikbaar." },
  ],
  faqsEn: [
    { question: "Can the escort also dance?", answer: "Yes, our going out escorts are selected for appearance and dancing skills." },
    { question: "Who pays for entry and drinks?", answer: "Those are at your expense. The escort service is separate." },
    { question: "Is intimacy included?", answer: "Yes, the price includes private time after going out." },
    { question: "How long does a going out escort last?", answer: "Minimum 3 hours. Longer evenings available custom." },
  ],
  relatedServices: [
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "vrijgezellenfeest-escort", label: "Vrijgezellenfeest", labelEn: "Bachelor Party" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/uitgaan-escort.jpg",
  primaryImageAlt: "Uitgaan escort - clubs en feesten",
  primaryImageAltEn: "Going out escort - clubs and parties",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/uitgaan-escort.jpg",
  quotePool: [
    "De beste avond uit in tijden.",
    "Ze was de ster van de dansvloer.",
    "Van club tot hotel, perfecte nacht.",
  ],
  trustBadges: ["Uitgaan ervaring", "Stijlvol", "Discreet"],
  trustBadgesEn: ["Nightlife experience", "Stylish", "Discreet"],
};

/**
 * Voetfetish Escort Service Page
 */
export const voetfetishEscortPageData: ServiceTypeDetailPageData = {
  slug: "voetfetish-escort",
  pageType: "service",
  seoTitle: "Voetfetish Escort - Voetenaanbidding | Vanaf €160",
  title: "Voetfetish Escort",
  titleEn: "Foot Fetish Escort",
  metaDescription:
    "Boek een escort voor voetfetisj. ✓ Voetenaanbidding ✓ Verzorgde voeten ✓ Geen oordeel ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book an escort for foot fetish. ✓ Foot worship ✓ Well-groomed feet ✓ No judgment ✓ Available 24/7 discreetly.",
  heroIntro:
    "Voetfetisj is een van de meest voorkomende fetisjen. Onze escorts hebben verzorgde, mooie voeten en zijn open voor voetenaanbidding, massage en meer.",
  heroIntroEn:
    "Foot fetish is one of the most common fetishes. Our escorts have well-groomed, beautiful feet and are open to foot worship, massage and more.",
  usps: ["Verzorgde voeten", "Voetenaanbidding", "Geen oordeel"],
  uspsEn: ["Well-groomed feet", "Foot worship", "No judgment"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Voetfetisj bij Desire",
  coreContentTitleEn: "Foot Fetish at Desire",
  coreContent: `Voetfetisj draait om de aantrekkingskracht van voeten. Dit kan variëren van het bekijken van mooie voeten tot aanraken, masseren, kussen of likken.

Onze escorts zijn geselecteerd op verzorgde voeten en openheid voor voetfetisj. Ze begrijpen de aantrekkingskracht en oordelen niet.

Bespreek vooraf wat je zoekt: simpel kijken, voetmassage geven, voeten aanbidden of iets specifieks. We matchen je met de juiste dame.`,
  coreContentEn: `Foot fetish is about the attraction to feet. This can range from viewing beautiful feet to touching, massaging, kissing or licking.

Our escorts are selected for well-groomed feet and openness to foot fetish. They understand the attraction and don't judge.

Discuss beforehand what you're looking for: simply viewing, giving foot massage, worshipping feet or something specific. We match you with the right lady.`,
  benefitsTitle: "Voetfetisj Ervaring",
  benefitsTitleEn: "Foot Fetish Experience",
  benefits: [
    { title: "Verzorgde voeten", description: "Onze dames hebben mooie, goed verzorgde voeten." },
    { title: "Open houding", description: "Geen oordeel, alleen acceptatie en plezier." },
    { title: "Flexibele invulling", description: "Van kijken tot intensiever — jij bepaalt." },
    { title: "Combineerbaar", description: "Voetfetisj kan onderdeel zijn van een bredere sessie." },
  ],
  benefitsEn: [
    { title: "Well-groomed feet", description: "Our ladies have beautiful, well-cared-for feet." },
    { title: "Open attitude", description: "No judgment, only acceptance and pleasure." },
    { title: "Flexible arrangement", description: "From viewing to more intense — you decide." },
    { title: "Combinable", description: "Foot fetish can be part of a broader session." },
  ],
  pricingTitle: "Tarieven Voetfetish",
  pricingTitleEn: "Foot Fetish Rates",
  pricingContent:
    "Voetfetish sessies beginnen bij €160 per uur. Kan als focus van de sessie of als onderdeel van een bredere ervaring.",
  pricingContentEn:
    "Foot fetish sessions start at €160 per hour. Can be the focus of the session or part of a broader experience.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Voetfetish Sessie Boeken",
  stepsTitleEn: "Book Foot Fetish Session",
  steps: [
    { title: "Deel je voorkeur", description: "Wat zoek je in een voetfetish sessie?" },
    { title: "Match met passende dame", description: "We selecteren een escort met mooie voeten en openheid." },
    { title: "Geniet zonder oordeel", description: "Verken je fetisj in een veilige omgeving." },
  ],
  stepsEn: [
    { title: "Share your preference", description: "What are you looking for in a foot fetish session?" },
    { title: "Match with suitable lady", description: "We select an escort with beautiful feet and openness." },
    { title: "Enjoy without judgment", description: "Explore your fetish in a safe environment." },
  ],
  faqs: [
    { question: "Hebben alle escorts mooie voeten?", answer: "We selecteren specifiek escorts met verzorgde voeten voor voetfetisj verzoeken." },
    { question: "Kan ik schoenen of nagellak aanvragen?", answer: "Ja, bespreek specifieke voorkeuren zoals hakken of nagellak kleur bij boeking." },
    { question: "Is voetfetisj gek?", answer: "Nee, het is een van de meest voorkomende fetisjen. Helemaal normaal en geaccepteerd." },
    { question: "Kan voetfetisj gecombineerd worden met andere services?", answer: "Ja, voetfetisj kan onderdeel zijn van een bredere escortervaring." },
  ],
  faqsEn: [
    { question: "Do all escorts have beautiful feet?", answer: "We specifically select escorts with well-groomed feet for foot fetish requests." },
    { question: "Can I request shoes or nail polish?", answer: "Yes, discuss specific preferences like heels or nail polish color when booking." },
    { question: "Is foot fetish weird?", answer: "No, it's one of the most common fetishes. Completely normal and accepted." },
    { question: "Can foot fetish be combined with other services?", answer: "Yes, foot fetish can be part of a broader escort experience." },
  ],
  relatedServices: [
    { slug: "fetish-escort", label: "Fetish Escort", labelEn: "Fetish Escort" },
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
  ],
  relatedTypes: [
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/voetfetish-escort.jpg",
  primaryImageAlt: "Voetfetish escort - voetenaanbidding",
  primaryImageAltEn: "Foot fetish escort - foot worship",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/voetfetish-escort.jpg",
  quotePool: [
    "Eindelijk iemand die mijn voorkeur begrijpt.",
    "Prachtig verzorgde voeten, precies wat ik zocht.",
    "Geen oordeel, alleen acceptatie.",
  ],
  trustBadges: ["Verzorgde voeten", "Geen oordeel", "Discreet"],
  trustBadgesEn: ["Well-groomed feet", "No judgment", "Discreet"],
};

/**
 * Vrijgezellenfeest Escort Service Page
 */
export const vrijgezellenfeestEscortPageData: ServiceTypeDetailPageData = {
  slug: "vrijgezellenfeest-escort",
  pageType: "service",
  seoTitle: "Vrijgezellenfeest Escort - Entertainment | Vanaf €200",
  title: "Vrijgezellenfeest Escort",
  titleEn: "Bachelor Party Escort",
  metaDescription:
    "Boek een escort voor een vrijgezellenfeest. ✓ Entertainment voor de groep ✓ Striptease mogelijk ✓ Discreet en professioneel ✓ Beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book an escort for a bachelor party. ✓ Entertainment for the group ✓ Striptease possible ✓ Discreet and professional ✓ Available throughout the Netherlands.",
  heroIntro:
    "Maak het vrijgezellenfeest onvergetelijk met een escort. Onze dames bieden entertainment voor de groep: van striptease tot spellen, van gezelschap tot intiem moment met de vrijgezel.",
  heroIntroEn:
    "Make the bachelor party unforgettable with an escort. Our ladies offer entertainment for the group: from striptease to games, from companionship to intimate moment with the bachelor.",
  usps: ["Groepsentertainment", "Striptease mogelijk", "Voor de vrijgezel"],
  uspsEn: ["Group entertainment", "Striptease possible", "For the bachelor"],
  priceFrom: "€200",
  minDuration: "1 uur",
  responseTime: "4 uur",
  coreContentTitle: "Entertainment voor Vrijgezellenfeesten",
  coreContentTitleEn: "Entertainment for Bachelor Parties",
  coreContent: `Een vrijgezellenfeest escort voegt een onvergetelijk element toe aan het feest. De dame kan entertainment bieden voor de hele groep of een speciaal moment creëren voor de vrijgezel.

Opties variëren van een sexy striptease waar de groep van geniet, tot spelletjes en interactie, tot een privémoment voor de vrijgezel alleen.

Bespreek vooraf wat de wensen zijn. Is het puur entertainment of is er ruimte voor meer? Elke situatie is anders en we stemmen af op jullie verwachtingen.`,
  coreContentEn: `A bachelor party escort adds an unforgettable element to the party. The lady can provide entertainment for the whole group or create a special moment for the bachelor.

Options range from a sexy striptease for the group to enjoy, to games and interaction, to a private moment for the bachelor alone.

Discuss beforehand what the wishes are. Is it purely entertainment or is there room for more? Every situation is different and we coordinate with your expectations.`,
  benefitsTitle: "Voordelen voor Vrijgezellenfeesten",
  benefitsTitleEn: "Benefits for Bachelor Parties",
  benefits: [
    { title: "Onvergetelijk moment", description: "Maak het feest memorabel voor de vrijgezel." },
    { title: "Flexibel programma", description: "Van striptease tot privétijd — jullie bepalen." },
    { title: "Professionele dames", description: "Ervaren in groepssettings en entertainment." },
    { title: "Discrete afhandeling", description: "De vrijgezel hoeft niets te weten vooraf." },
  ],
  benefitsEn: [
    { title: "Unforgettable moment", description: "Make the party memorable for the bachelor." },
    { title: "Flexible program", description: "From striptease to private time — you decide." },
    { title: "Professional ladies", description: "Experienced in group settings and entertainment." },
    { title: "Discreet handling", description: "The bachelor doesn't need to know beforehand." },
  ],
  pricingTitle: "Tarieven Vrijgezellenfeest",
  pricingTitleEn: "Bachelor Party Rates",
  pricingContent:
    "Vrijgezellenfeest entertainment begint bij €200 per uur. Prijs afhankelijk van activiteiten en aantal escorts. Striptease vanaf €200, privétijd apart.",
  pricingContentEn:
    "Bachelor party entertainment starts at €200 per hour. Price depends on activities and number of escorts. Striptease from €200, private time separately.",
  stepsEyebrow: "Zo werkt het",
  stepsEyebrowEn: "How it works",
  stepsTitle: "Vrijgezellenfeest Boeken",
  stepsTitleEn: "Book Bachelor Party",
  steps: [
    { title: "Beschrijf het feest", description: "Locatie, aantal gasten, wat willen jullie?" },
    { title: "Ontvang een voorstel", description: "We stellen een passend programma samen." },
    { title: "Verras de vrijgezel", description: "De escort arriveert voor een onvergetelijk moment." },
  ],
  stepsEn: [
    { title: "Describe the party", description: "Location, number of guests, what do you want?" },
    { title: "Receive a proposal", description: "We put together a suitable program." },
    { title: "Surprise the bachelor", description: "The escort arrives for an unforgettable moment." },
  ],
  faqs: [
    { question: "Wat kan de escort doen op een vrijgezellenfeest?", answer: "Striptease, spelletjes, gezelschap voor de groep, of een privémoment met de vrijgezel. Alles in overleg." },
    { question: "Kan dit ook in een bar of club?", answer: "Ja, afhankelijk van de locatie. Sommige plekken staan dit toe, andere niet. Bespreek de locatie vooraf." },
    { question: "Hoeveel escorts kunnen er komen?", answer: "Eén of meerdere, afhankelijk van jullie wensen en budget." },
    { question: "Is de vrijgezel verplicht tot iets?", answer: "Nee, alles is optioneel. Het blijft een verrassing en de vrijgezel bepaalt zelf hoe ver hij wil gaan." },
  ],
  faqsEn: [
    { question: "What can the escort do at a bachelor party?", answer: "Striptease, games, companionship for the group, or a private moment with the bachelor. Everything in consultation." },
    { question: "Can this also be in a bar or club?", answer: "Yes, depending on the location. Some places allow this, others don't. Discuss the location beforehand." },
    { question: "How many escorts can come?", answer: "One or more, depending on your wishes and budget." },
    { question: "Is the bachelor obligated to anything?", answer: "No, everything is optional. It remains a surprise and the bachelor decides how far he wants to go." },
  ],
  relatedServices: [
    { slug: "uitgaan-escort", label: "Uitgaan Escort", labelEn: "Going Out Escort" },
    { slug: "trio-escorts", label: "Trio Escorts", labelEn: "Trio Escorts" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/vrijgezellenfeest-escort.jpg",
  primaryImageAlt: "Vrijgezellenfeest escort - entertainment",
  primaryImageAltEn: "Bachelor party escort - entertainment",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/vrijgezellenfeest-escort.jpg",
  quotePool: [
    "Het hoogtepunt van het feest.",
    "De vrijgezel had de avond van zijn leven.",
    "Professioneel geregeld, geweldige dame.",
  ],
  trustBadges: ["Groepservaring", "Professioneel", "Discreet"],
  trustBadgesEn: ["Group experience", "Professional", "Discreet"],
};

const manuallyCuratedSlugs = new Set([
  hotelEscortPageData.slug,
  aziatischeEscortsPageData.slug,
  analeSeksPageData.slug,
  trioEscortsPageData.slug,
  erotischeMassagePageData.slug,
  gfeEscortsPageData.slug,
  dinnerdateEscortPageData.slug,
  overnightEscortPageData.slug,
  nuruMassagePageData.slug,
  tantraMassagePageData.slug,
  rollenspelEscortPageData.slug,
  escortVoorStellenPageData.slug,
  bdsmEscortsPageData.slug,
  twentyFourUursEscortPageData.slug,
  body2BodyMassagePageData.slug,
  bondageEscortPageData.slug,
  businessEscortPageData.slug,
  cardateEscortPageData.slug,
  fetishEscortPageData.slug,
  firstTimeExperiencePageData.slug,
  oraleSeksPageData.slug,
  smEscortPageData.slug,
  uitgaanEscortPageData.slug,
  voetfetishEscortPageData.slug,
  vrijgezellenfeestEscortPageData.slug,
]);

const generatedServiceTypePages: ServiceTypeDetailPageData[] = [
  ...allServices
    .filter((service) => !manuallyCuratedSlugs.has(service.slug))
    .map((service) => buildGenericServiceData(service)),
  ...allTypes
    .filter((type) => !manuallyCuratedSlugs.has(type.slug))
    .map((type) => buildGenericTypeData(type)),
];

export function getServiceTypePageBySlug(
  slug: string
): ServiceTypeDetailPageData | undefined {
  return allServiceTypeDetailPages.find((page) => page.slug === slug);
}

export const allServiceTypeDetailPages: ServiceTypeDetailPageData[] = [
  hotelEscortPageData,
  aziatischeEscortsPageData,
  analeSeksPageData,
  trioEscortsPageData,
  erotischeMassagePageData,
  gfeEscortsPageData,
  dinnerdateEscortPageData,
  overnightEscortPageData,
  nuruMassagePageData,
  tantraMassagePageData,
  rollenspelEscortPageData,
  escortVoorStellenPageData,
  bdsmEscortsPageData,
  twentyFourUursEscortPageData,
  body2BodyMassagePageData,
  bondageEscortPageData,
  businessEscortPageData,
  cardateEscortPageData,
  fetishEscortPageData,
  firstTimeExperiencePageData,
  oraleSeksPageData,
  smEscortPageData,
  uitgaanEscortPageData,
  voetfetishEscortPageData,
  vrijgezellenfeestEscortPageData,
  ...generatedServiceTypePages,
];
