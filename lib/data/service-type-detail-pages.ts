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

const manuallyCuratedSlugs = new Set([
  hotelEscortPageData.slug,
  aziatischeEscortsPageData.slug,
  analeSeksPageData.slug,
  trioEscortsPageData.slug,
  erotischeMassagePageData.slug,
  gfeEscortsPageData.slug,
  dinnerdateEscortPageData.slug,
  overnightEscortPageData.slug,
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
  ...generatedServiceTypePages,
];
