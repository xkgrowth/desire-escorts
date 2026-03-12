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

/**
 * Top 5 services by Search Console clicks (data from General_Pages.csv)
 */
export const TOP_SERVICES_BY_CLICKS: RelatedLink[] = [
  { slug: "trio-escorts", label: "Trio Escort", labelEn: "Trio Escort" },
  { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
  { slug: "24-uurs-escort", label: "24-Uurs Escort", labelEn: "24-Hour Escort" },
  { slug: "anale-seks", label: "Anale Seks", labelEn: "Anal Escort" },
  { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
];

/**
 * Top 5 escort types by Search Console clicks
 */
export const TOP_TYPES_BY_CLICKS: RelatedLink[] = [
  { slug: "goedkope-escorts", label: "Goedkope Escorts", labelEn: "Budget Escorts" },
  { slug: "shemale-escorts", label: "Shemale Escorts", labelEn: "Shemale Escorts" },
  { slug: "aziatische-escorts", label: "Aziatische Escorts", labelEn: "Asian Escorts" },
  { slug: "turkse-escort", label: "Turkse Escorts", labelEn: "Turkish Escorts" },
  { slug: "studenten-escort", label: "Studenten Escorts", labelEn: "Student Escorts" },
];

/**
 * Standard location list for all service/type detail pages
 * Based on user specification and service coverage
 */
export const STANDARD_LOCATIONS: RelatedLink[] = [
  { slug: "escort-amsterdam", label: "Amsterdam" },
  { slug: "escort-haarlem", label: "Haarlem" },
  { slug: "escort-alkmaar", label: "Alkmaar" },
  { slug: "escort-schiphol", label: "Schiphol" },
  { slug: "escort-zaandam", label: "Zaandam" },
  { slug: "escort-hoofddorp", label: "Hoofddorp" },
  { slug: "escort-amstelveen", label: "Amstelveen" },
  { slug: "escort-almere", label: "Almere" },
  { slug: "escort-utrecht", label: "Utrecht" },
  { slug: "escort-diemen", label: "Diemen" },
];

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

const relatedLocationsDefault: RelatedLink[] = STANDARD_LOCATIONS;

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

  benefitsTitle: "Voordelen van Hotel Escort",
  benefitsTitleEn: "Benefits of Hotel Escort",
  benefits: [
    {
      title: "Maximale Discretie",
      description: "Escorts melden zich niet bij receptie, komen direct naar je kamer",
    },
    {
      title: "Flexibele Tijden",
      description: "24/7 beschikbaar, ook voor late aankomsten of vroege ochtenden",
    },
    {
      title: "Geen Reistijd",
      description: "Ontspan in je eigen kamer zonder naar buiten te hoeven",
    },
    {
      title: "Premium Hotels",
      description: "Ervaring bij vijfsterrenhotels tot zakelijke accommodaties",
    },
  ],
  benefitsEn: [
    {
      title: "Maximum Discretion",
      description: "Escorts don't check in at reception, come directly to your room",
    },
    {
      title: "Flexible Hours",
      description: "Available 24/7, including late arrivals or early mornings",
    },
    {
      title: "No Travel Time",
      description: "Relax in your own room without going outside",
    },
    {
      title: "Premium Hotels",
      description: "Experience at five-star hotels to business accommodations",
    },
  ],

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

/**
 * Blonde Escort Type Page
 * High search volume type
 */
export const blondeEscortPageData: ServiceTypeDetailPageData = {
  slug: "blonde-escort-dames",
  pageType: "type",
  seoTitle: "Blonde Escorts - Aantrekkelijke Blondines | Vanaf €160",
  title: "Blonde Escorts",
  titleEn: "Blonde Escorts",
  metaDescription:
    "Boek een blonde escort bij Desire Escorts. ✓ Natuurlijk of geverfd ✓ Diverse types blondines ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book a blonde escort at Desire Escorts. ✓ Natural or dyed ✓ Various types of blondes ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Blondines zijn tijdloos populair. Onze blonde escorts variëren van platinablond tot donkerblond, van Scandinavisch tot Oost-Europees. Vind de blondine die bij jouw voorkeur past.",
  heroIntroEn:
    "Blondes are timelessly popular. Our blonde escorts range from platinum blonde to dark blonde, from Scandinavian to Eastern European. Find the blonde that matches your preference.",
  usps: ["Diverse blondtinten", "Natuurlijk & geverfd", "Alle types"],
  uspsEn: ["Various blonde shades", "Natural & dyed", "All types"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Blonde Escorts bij Desire",
  coreContentTitleEn: "Blonde Escorts at Desire",
  coreContent: `Blonde escorts zijn een van de meest gevraagde types. Of je nu houdt van ijsblonde Scandinavische schoonheden, zonnige goudblonde dames of natuurlijke donkerblondes — wij hebben ze.

Onze selectie omvat zowel natuurlijk blonde escorts als dames die hun haar laten kleuren. De kwaliteit van het blond en de verzorging is altijd top.

Blondines hebben vaak een bepaalde uitstraling: fris, energiek en aantrekkelijk. Combineer met andere voorkeuren zoals leeftijd, lengte of services.`,
  coreContentEn: `Blonde escorts are one of the most requested types. Whether you like ice-blonde Scandinavian beauties, sunny golden blonde ladies or natural dark blondes — we have them.

Our selection includes both naturally blonde escorts and ladies who dye their hair. The quality of the blonde and grooming is always top.

Blondes often have a certain appearance: fresh, energetic and attractive. Combine with other preferences like age, height or services.`,
  benefitsTitle: "Onze Blonde Escorts",
  benefitsTitleEn: "Our Blonde Escorts",
  benefits: [
    { title: "Diverse tinten", description: "Van platina tot donkerblond, alle schakeringen." },
    { title: "Verschillende achtergronden", description: "Nederlandse, Poolse, Roemeense blondines en meer." },
    { title: "Alle leeftijden", description: "Jonge blondines tot mature blonde dames." },
    { title: "Combineerbaar", description: "Filter op blonde + andere voorkeuren." },
  ],
  benefitsEn: [
    { title: "Various shades", description: "From platinum to dark blonde, all variations." },
    { title: "Different backgrounds", description: "Dutch, Polish, Romanian blondes and more." },
    { title: "All ages", description: "Young blondes to mature blonde ladies." },
    { title: "Combinable", description: "Filter on blonde + other preferences." },
  ],
  pricingTitle: "Tarieven Blonde Escorts",
  pricingTitleEn: "Blonde Escort Rates",
  pricingContent:
    "Blonde escorts beginnen bij €160 per uur. De prijs hangt af van de specifieke dame, niet de haarkleur.",
  pricingContentEn:
    "Blonde escorts start at €160 per hour. The price depends on the specific lady, not the hair color.",
  faqs: [
    { question: "Zijn alle blonde escorts natuurlijk blond?", answer: "Niet allemaal. Sommige zijn natuurlijk blond, anderen verven. De kwaliteit is altijd hoog." },
    { question: "Kan ik een specifieke tint blond aanvragen?", answer: "Ja, geef je voorkeur door. We hebben platina, goudblond, donkerblond en meer." },
    { question: "Zijn er Nederlandse blondines?", answer: "Ja, we hebben Nederlandse blonde escorts evenals internationaal." },
    { question: "Kost een blonde escort meer?", answer: "Nee, de prijs is per dame, niet per haarkleur." },
  ],
  faqsEn: [
    { question: "Are all blonde escorts naturally blonde?", answer: "Not all. Some are naturally blonde, others dye. Quality is always high." },
    { question: "Can I request a specific shade of blonde?", answer: "Yes, share your preference. We have platinum, golden blonde, dark blonde and more." },
    { question: "Are there Dutch blondes?", answer: "Yes, we have Dutch blonde escorts as well as international." },
    { question: "Does a blonde escort cost more?", answer: "No, the price is per lady, not per hair color." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-den-haag", label: "Den Haag" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/blonde-escort.jpg",
  primaryImageAlt: "Blonde escorts - aantrekkelijke blondines",
  primaryImageAltEn: "Blonde escorts - attractive blondes",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/blonde-escort.jpg",
  quotePool: [
    "Precies de blondine die ik zocht.",
    "Natuurlijk blond en prachtig.",
    "Scandinavische schoonheid, geweldig.",
  ],
  trustBadges: ["Diverse blondtinten", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Various blonde shades", "21+ verified", "Discreet"],
};

/**
 * Brunette Escort Type Page
 */
export const brunetteEscortPageData: ServiceTypeDetailPageData = {
  slug: "brunette-escort-dames",
  pageType: "type",
  seoTitle: "Brunette Escorts - Donkerharige Schoonheden | Vanaf €160",
  title: "Brunette Escorts",
  titleEn: "Brunette Escorts",
  metaDescription:
    "Boek een brunette escort bij Desire Escorts. ✓ Donkerbruin tot lichtbruin ✓ Mysterieuze uitstraling ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book a brunette escort at Desire Escorts. ✓ Dark brown to light brown ✓ Mysterious appearance ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Brunettes hebben een klassieke, mysterieuze aantrekkingskracht. Van donkerbruin tot kastanjebruin, van Zuid-Europees tot Oost-Europees — onze brunette escorts bieden variatie en klasse.",
  heroIntroEn:
    "Brunettes have a classic, mysterious attraction. From dark brown to chestnut, from Southern European to Eastern European — our brunette escorts offer variety and class.",
  usps: ["Klassieke schoonheid", "Diverse bruintinten", "Mysterieuze uitstraling"],
  uspsEn: ["Classic beauty", "Various brown shades", "Mysterious appearance"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Brunette Escorts bij Desire",
  coreContentTitleEn: "Brunette Escorts at Desire",
  coreContent: `Brunettes staan bekend om hun tijdloze elegantie. Donker haar geeft vaak een mysterieuze, sensuele uitstraling die veel gasten aanspreekt.

Onze brunette escorts variëren van lichtbruin (bijna donkerblond) tot ravenzwart (donkerbruin). Je vindt hier Spaanse, Italiaanse, Poolse en Nederlandse brunettes.

Brunettes passen bij elke gelegenheid: van zakelijk diner tot intieme nacht. Hun klassieke look is nooit verkeerd.`,
  coreContentEn: `Brunettes are known for their timeless elegance. Dark hair often gives a mysterious, sensual appearance that appeals to many guests.

Our brunette escorts range from light brown (almost dark blonde) to raven black (dark brown). You'll find Spanish, Italian, Polish and Dutch brunettes here.

Brunettes suit any occasion: from business dinner to intimate night. Their classic look is never wrong.`,
  benefitsTitle: "Onze Brunette Escorts",
  benefitsTitleEn: "Our Brunette Escorts",
  benefits: [
    { title: "Tijdloze elegantie", description: "Brunettes hebben een klassieke aantrekkingskracht." },
    { title: "Diverse achtergronden", description: "Mediterraan, Oost-Europees, Nederlands en meer." },
    { title: "Alle types", description: "Van petite brunettes tot lange donkerharige dames." },
    { title: "Veelzijdig", description: "Past bij elke gelegenheid en setting." },
  ],
  benefitsEn: [
    { title: "Timeless elegance", description: "Brunettes have a classic attraction." },
    { title: "Various backgrounds", description: "Mediterranean, Eastern European, Dutch and more." },
    { title: "All types", description: "From petite brunettes to tall dark-haired ladies." },
    { title: "Versatile", description: "Suits any occasion and setting." },
  ],
  pricingTitle: "Tarieven Brunette Escorts",
  pricingTitleEn: "Brunette Escort Rates",
  pricingContent:
    "Brunette escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn:
    "Brunette escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Wat telt als brunette?", answer: "Van lichtbruin tot donkerbruin en kastanjebruin. Alles tussen blond en zwart." },
    { question: "Zijn er Zuid-Europese brunettes?", answer: "Ja, we hebben Spaanse, Italiaanse en andere Mediterrane brunettes." },
    { question: "Kan ik brunette combineren met andere voorkeuren?", answer: "Ja, filter op brunette + leeftijd, lengte, services etc." },
    { question: "Hebben brunettes een andere prijs?", answer: "Nee, prijs is per dame, niet per haarkleur." },
  ],
  faqsEn: [
    { question: "What counts as brunette?", answer: "From light brown to dark brown and chestnut. Everything between blonde and black." },
    { question: "Are there Southern European brunettes?", answer: "Yes, we have Spanish, Italian and other Mediterranean brunettes." },
    { question: "Can I combine brunette with other preferences?", answer: "Yes, filter on brunette + age, height, services etc." },
    { question: "Do brunettes have a different price?", answer: "No, price is per lady, not per hair color." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "mature-escort", label: "Mature Escort", labelEn: "Mature Escort" },
    { slug: "latina-escorts", label: "Latina Escort", labelEn: "Latina Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/brunette-escort.jpg",
  primaryImageAlt: "Brunette escorts - donkerharige schoonheden",
  primaryImageAltEn: "Brunette escorts - dark-haired beauties",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/brunette-escort.jpg",
  quotePool: [
    "Klassieke schoonheid, precies mijn type.",
    "Die donkere ogen, onweerstaanbaar.",
    "Mediterrane brunette, geweldig.",
  ],
  trustBadges: ["Klassieke elegantie", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Classic elegance", "21+ verified", "Discreet"],
};

/**
 * Shemale/Transgender Escort Type Page
 * High traffic type
 */
export const shemaleEscortPageData: ServiceTypeDetailPageData = {
  slug: "shemale-escort",
  pageType: "type",
  seoTitle: "Shemale Escort - Transgender Escorts | Vanaf €160",
  title: "Shemale Escorts",
  titleEn: "Shemale Escorts",
  metaDescription:
    "Boek een shemale/transgender escort bij Desire Escorts. ✓ Ervaren trans dames ✓ Actief en passief ✓ Discreet en veilig ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a shemale/transgender escort at Desire Escorts. ✓ Experienced trans ladies ✓ Active and passive ✓ Discreet and safe ✓ Available 24/7.",
  heroIntro:
    "Onze transgender escorts combineren het beste van twee werelden. Vrouwelijke schoonheid met mannelijke attributen voor een unieke ervaring. Zowel actieve als passieve rollen beschikbaar.",
  heroIntroEn:
    "Our transgender escorts combine the best of both worlds. Feminine beauty with male attributes for a unique experience. Both active and passive roles available.",
  usps: ["Actief & passief", "Unieke ervaring", "Discreet en veilig"],
  uspsEn: ["Active & passive", "Unique experience", "Discreet and safe"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Transgender Escorts bij Desire",
  coreContentTitleEn: "Transgender Escorts at Desire",
  coreContent: `Onze shemale escorts bieden een unieke ervaring die je nergens anders vindt. Ze zijn vrouwelijk, verzorgd en hebben mannelijke attributen.

De meeste van onze trans escorts zijn zowel actief als passief. Dit betekent dat je beide rollen kunt verkennen, afhankelijk van je voorkeur.

We benadrukken dat dit met wederzijds respect gebeurt. Onze trans escorts zijn professionals die discretie en waardigheid verwachten en bieden.`,
  coreContentEn: `Our shemale escorts offer a unique experience you won't find anywhere else. They are feminine, well-groomed and have male attributes.

Most of our trans escorts are both active and passive. This means you can explore both roles, depending on your preference.

We emphasize that this happens with mutual respect. Our trans escorts are professionals who expect and offer discretion and dignity.`,
  benefitsTitle: "Wat Bieden Trans Escorts",
  benefitsTitleEn: "What Trans Escorts Offer",
  benefits: [
    { title: "Het beste van beide", description: "Vrouwelijke schoonheid met mannelijke attributen." },
    { title: "Actief of passief", description: "Jij bepaalt de rol, beide opties beschikbaar." },
    { title: "Ervaren & professioneel", description: "Onze trans dames weten wat ze doen." },
    { title: "Volledige discretie", description: "Jouw privacy is gegarandeerd." },
  ],
  benefitsEn: [
    { title: "Best of both", description: "Feminine beauty with male attributes." },
    { title: "Active or passive", description: "You determine the role, both options available." },
    { title: "Experienced & professional", description: "Our trans ladies know what they're doing." },
    { title: "Full discretion", description: "Your privacy is guaranteed." },
  ],
  pricingTitle: "Tarieven Trans Escorts",
  pricingTitleEn: "Trans Escort Rates",
  pricingContent:
    "Transgender escorts beginnen bij €160 per uur. Prijs varieert per dame en gevraagde services.",
  pricingContentEn:
    "Transgender escorts start at €160 per hour. Price varies per lady and requested services.",
  faqs: [
    { question: "Wat is het verschil actief en passief?", answer: "Actief betekent dat de escort de penetrerende rol heeft. Passief betekent dat jij die rol hebt." },
    { question: "Zijn trans escorts ook vrouwelijk?", answer: "Ja, onze trans dames zijn vrouwelijk in uitstraling en verzorging, met mannelijke attributen." },
    { question: "Is dit voor gay mannen?", answer: "Niet per se. Trans escorts worden geboekt door mannen van alle geaardheden." },
    { question: "Hoe discreet is dit?", answer: "Volledig discreet. Wij delen nooit informatie over boekingen." },
  ],
  faqsEn: [
    { question: "What is the difference between active and passive?", answer: "Active means the escort has the penetrating role. Passive means you have that role." },
    { question: "Are trans escorts also feminine?", answer: "Yes, our trans ladies are feminine in appearance and grooming, with male attributes." },
    { question: "Is this for gay men?", answer: "Not necessarily. Trans escorts are booked by men of all orientations." },
    { question: "How discreet is this?", answer: "Completely discreet. We never share information about bookings." },
  ],
  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
  ],
  relatedTypes: [
    { slug: "gay-escort", label: "Gay Escort", labelEn: "Gay Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/shemale-escort.jpg",
  primaryImageAlt: "Shemale escort - transgender escorts",
  primaryImageAltEn: "Shemale escort - transgender escorts",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/shemale-escort.jpg",
  quotePool: [
    "Een unieke ervaring, precies wat ik zocht.",
    "Vrouwelijk en toch iets extras.",
    "Professioneel en discreet.",
  ],
  trustBadges: ["Actief & passief", "21+ geverifieerd", "Volledig discreet"],
  trustBadgesEn: ["Active & passive", "21+ verified", "Fully discreet"],
};

/**
 * Goedkope/Budget Escorts Type Page
 * High traffic type
 */
export const goedkopeEscortsPageData: ServiceTypeDetailPageData = {
  slug: "goedkope-escorts",
  pageType: "type",
  seoTitle: "Goedkope Escorts - Betaalbaar Vanaf €120 | Kwaliteit Behouden",
  title: "Goedkope Escorts",
  titleEn: "Budget Escorts",
  metaDescription:
    "Boek een betaalbare escort bij Desire Escorts. ✓ Vanaf €120 per uur ✓ Kwaliteit behouden ✓ Geen verborgen kosten ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book an affordable escort at Desire Escorts. ✓ From €120 per hour ✓ Quality maintained ✓ No hidden costs ✓ Available 24/7.",
  heroIntro:
    "Kwaliteit hoeft niet duur te zijn. Onze goedkopere escorts bieden dezelfde service-standaard tegen een lager tarief. Perfect voor wie vaker wil boeken of met een budget werkt.",
  heroIntroEn:
    "Quality doesn't have to be expensive. Our more affordable escorts offer the same service standard at a lower rate. Perfect for those who want to book more often or work with a budget.",
  usps: ["Vanaf €120/uur", "Kwaliteit behouden", "Geen verborgen kosten"],
  uspsEn: ["From €120/hour", "Quality maintained", "No hidden costs"],
  priceFrom: "€120",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Betaalbare Escorts zonder Concessies",
  coreContentTitleEn: "Affordable Escorts without Compromise",
  coreContent: `Onze goedkopere escorts zijn niet 'minder'. Het zijn dames die kiezen voor een lager tarief om meer boekingen te krijgen. De kwaliteit van service blijft hoog.

Waarom zijn sommige escorts goedkoper? Soms zijn het nieuwere dames die hun clientèle opbouwen. Soms zijn het dames die simpelweg meer volume prefereren boven hogere prijzen.

Je krijgt dezelfde discretie, dezelfde professionaliteit en dezelfde ervaring. Het enige verschil zit in de prijs.`,
  coreContentEn: `Our cheaper escorts are not 'less'. They are ladies who choose a lower rate to get more bookings. The quality of service remains high.

Why are some escorts cheaper? Sometimes they are newer ladies building their clientele. Sometimes they are ladies who simply prefer more volume over higher prices.

You get the same discretion, the same professionalism and the same experience. The only difference is in the price.`,
  benefitsTitle: "Voordelen Budget Escorts",
  benefitsTitleEn: "Benefits Budget Escorts",
  benefits: [
    { title: "Lagere prijs", description: "Vanaf €120 per uur, geen verborgen kosten." },
    { title: "Zelfde kwaliteit", description: "Onze standaard blijft hoog, ongeacht prijs." },
    { title: "Vaker boeken", description: "Met lager budget kun je vaker genieten." },
    { title: "Transparant", description: "Wat je ziet is wat je krijgt, geen surprises." },
  ],
  benefitsEn: [
    { title: "Lower price", description: "From €120 per hour, no hidden costs." },
    { title: "Same quality", description: "Our standard remains high, regardless of price." },
    { title: "Book more often", description: "With lower budget you can enjoy more often." },
    { title: "Transparent", description: "What you see is what you get, no surprises." },
  ],
  pricingTitle: "Tarieven Goedkope Escorts",
  pricingTitleEn: "Budget Escort Rates",
  pricingContent:
    "Onze goedkopere escorts beginnen bij €120 per uur. Langere boekingen vaak met korting. Altijd all-inclusive, geen verborgen kosten.",
  pricingContentEn:
    "Our more affordable escorts start at €120 per hour. Longer bookings often with discount. Always all-inclusive, no hidden costs.",
  faqs: [
    { question: "Waarom zijn sommige escorts goedkoper?", answer: "Verschillende redenen: nieuwer in het vak, voorkeur voor meer boekingen, of simpelweg persoonlijke keuze." },
    { question: "Is de service minder bij goedkopere escorts?", answer: "Nee, onze standaard is hetzelfde. Alle escorts doorlopen dezelfde selectie." },
    { question: "Zijn er verborgen kosten?", answer: "Nee, de prijs die je ziet is all-inclusive. Geen extra's achteraf." },
    { question: "Kan ik ook korting krijgen bij langere boekingen?", answer: "Vaak wel. Vraag naar de tarieven voor 2 uur of langer." },
  ],
  faqsEn: [
    { question: "Why are some escorts cheaper?", answer: "Various reasons: newer in the business, preference for more bookings, or simply personal choice." },
    { question: "Is the service less with cheaper escorts?", answer: "No, our standard is the same. All escorts go through the same selection." },
    { question: "Are there hidden costs?", answer: "No, the price you see is all-inclusive. No extras afterwards." },
    { question: "Can I also get a discount with longer bookings?", answer: "Often yes. Ask about rates for 2 hours or longer." },
  ],
  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "cardate-escort", label: "Car Date", labelEn: "Car Date" },
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "studenten-escort", label: "Studenten Escort", labelEn: "Student Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/goedkope-escort.jpg",
  primaryImageAlt: "Goedkope escorts - betaalbare kwaliteit",
  primaryImageAltEn: "Budget escorts - affordable quality",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/goedkope-escort.jpg",
  quotePool: [
    "Zelfde kwaliteit, betere prijs.",
    "Kon vaker boeken dankzij het lagere tarief.",
    "Geen concessies, gewoon betaalbaar.",
  ],
  trustBadges: ["Vanaf €120", "Geen verborgen kosten", "Zelfde kwaliteit"],
  trustBadgesEn: ["From €120", "No hidden costs", "Same quality"],
};

/**
 * Studenten Escort Type Page
 * High traffic type
 */
export const studentenEscortPageData: ServiceTypeDetailPageData = {
  slug: "studenten-escort",
  pageType: "type",
  seoTitle: "Studenten Escorts - Jonge Studentes (21+) | Vanaf €160",
  title: "Studenten Escorts",
  titleEn: "Student Escorts",
  metaDescription:
    "Boek een student escort bij Desire Escorts. ✓ Jonge studentes (21+) ✓ Fris en energiek ✓ Intelligente gesprekken ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a student escort at Desire Escorts. ✓ Young students (21+) ✓ Fresh and energetic ✓ Intelligent conversations ✓ Available 24/7.",
  heroIntro:
    "Studenten escorts zijn jong, fris en intelligent. Deze dames combineren hun studie met escortwerk en brengen een unieke energie mee. Alle studentes zijn 21+ en geverifieerd.",
  heroIntroEn:
    "Student escorts are young, fresh and intelligent. These ladies combine their studies with escort work and bring a unique energy. All students are 21+ and verified.",
  usps: ["21+ studentes", "Fris & energiek", "Intelligent gesprek"],
  uspsEn: ["21+ students", "Fresh & energetic", "Intelligent conversation"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Studenten Escorts bij Desire",
  coreContentTitleEn: "Student Escorts at Desire",
  coreContent: `Studenten escorts hebben een bijzondere aantrekkingskracht. Ze zijn jong, ambitieus en combineren hun studie met escortwerk voor extra inkomen.

Onze studentes komen van diverse opleidingen: van geneeskunde tot rechten, van kunstacademie tot bedrijfskunde. Dit maakt gesprekken interessant en gevarieerd.

Alle studenten escorts zijn minimaal 21 jaar en volledig geverifieerd. Jeugdige energie gecombineerd met volwassen professionaliteit.`,
  coreContentEn: `Student escorts have a special attraction. They are young, ambitious and combine their studies with escort work for extra income.

Our students come from various programs: from medicine to law, from art academy to business. This makes conversations interesting and varied.

All student escorts are at least 21 years old and fully verified. Youthful energy combined with adult professionalism.`,
  benefitsTitle: "Wat Studenten Escorts Bieden",
  benefitsTitleEn: "What Student Escorts Offer",
  benefits: [
    { title: "Jeugdige energie", description: "Fris, enthousiast en vol leven." },
    { title: "Intelligent gezelschap", description: "Studentes kunnen interessante gesprekken voeren." },
    { title: "Ambitieus", description: "Gedreven jonge vrouwen met doelen." },
    { title: "Flexibele beschikbaarheid", description: "Vaak beschikbaar rond hun rooster." },
  ],
  benefitsEn: [
    { title: "Youthful energy", description: "Fresh, enthusiastic and full of life." },
    { title: "Intelligent company", description: "Students can have interesting conversations." },
    { title: "Ambitious", description: "Driven young women with goals." },
    { title: "Flexible availability", description: "Often available around their schedule." },
  ],
  pricingTitle: "Tarieven Studenten Escorts",
  pricingTitleEn: "Student Escort Rates",
  pricingContent:
    "Studenten escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn:
    "Student escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Hoe oud zijn studenten escorts?", answer: "Minimaal 21 jaar. We verifiëren de leeftijd van alle escorts." },
    { question: "Zijn het echte studentes?", answer: "Ja, onze studenten escorts volgen daadwerkelijk een opleiding." },
    { question: "Welke studies hebben ze?", answer: "Variërend: van medisch tot creatief tot zakelijk. Vraag naar specifieke achtergrond." },
    { question: "Zijn studenten escorts goedkoper?", answer: "Niet per se. De prijs hangt af van de individuele dame." },
  ],
  faqsEn: [
    { question: "How old are student escorts?", answer: "At least 21 years. We verify the age of all escorts." },
    { question: "Are they real students?", answer: "Yes, our student escorts actually follow an education." },
    { question: "What studies do they have?", answer: "Varying: from medical to creative to business. Ask about specific background." },
    { question: "Are student escorts cheaper?", answer: "Not necessarily. The price depends on the individual lady." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "rollenspel-escort", label: "Rollenspel", labelEn: "Roleplay" },
  ],
  relatedTypes: [
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
    { slug: "goedkope-escorts", label: "Goedkope Escort", labelEn: "Budget Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
    { slug: "escort-utrecht", label: "Utrecht" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/studenten-escort.jpg",
  primaryImageAlt: "Studenten escorts - jonge studentes",
  primaryImageAltEn: "Student escorts - young students",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/studenten-escort.jpg",
  quotePool: [
    "Fris, intelligent en energiek.",
    "Interessante gesprekken over haar studie.",
    "Jonge energie, volwassen service.",
  ],
  trustBadges: ["21+ geverifieerd", "Echte studentes", "Discreet"],
  trustBadgesEn: ["21+ verified", "Real students", "Discreet"],
};

/**
 * Europese Escort Type Page
 */
export const europeseEscortPageData: ServiceTypeDetailPageData = {
  slug: "europese-escort",
  pageType: "type",
  seoTitle: "Europese Escorts - Internationale Schoonheden | Vanaf €160",
  title: "Europese Escorts",
  titleEn: "European Escorts",
  metaDescription:
    "Boek een Europese escort bij Desire Escorts. ✓ Poolse, Roemeense, Spaanse en meer ✓ Internationale schoonheid ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a European escort at Desire Escorts. ✓ Polish, Romanian, Spanish and more ✓ International beauty ✓ Available 24/7.",
  heroIntro:
    "Europa biedt een diversiteit aan schoonheid. Van Scandinavische blondines tot Mediterrane brunettes, van Oost-Europese elegantie tot West-Europese stijl.",
  heroIntroEn:
    "Europe offers a diversity of beauty. From Scandinavian blondes to Mediterranean brunettes, from Eastern European elegance to Western European style.",
  usps: ["Diverse achtergronden", "Oost & West Europa", "Internationale schoonheid"],
  uspsEn: ["Diverse backgrounds", "East & West Europe", "International beauty"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Europese Escorts bij Desire",
  coreContentTitleEn: "European Escorts at Desire",
  coreContent: `Onze Europese escorts komen uit landen door heel Europa. Van Polen en Roemenië in het oosten tot Spanje en Portugal in het zuiden. Van Duitsland en Nederland in het westen tot Scandinavië in het noorden.

Elke regio brengt eigen schoonheidskenmerken mee. Oost-Europese dames staan bekend om hun elegantie, Mediterrane vrouwen om hun temperament, Scandinavische schoonheden om hun frisse uitstraling.

Spreek je voorkeur uit voor een specifieke regio of nationaliteit, dan matchen we je met de juiste dame.`,
  coreContentEn: `Our European escorts come from countries throughout Europe. From Poland and Romania in the east to Spain and Portugal in the south. From Germany and the Netherlands in the west to Scandinavia in the north.

Each region brings its own beauty characteristics. Eastern European ladies are known for their elegance, Mediterranean women for their temperament, Scandinavian beauties for their fresh appearance.

Express your preference for a specific region or nationality, and we'll match you with the right lady.`,
  benefitsTitle: "Europese Variatie",
  benefitsTitleEn: "European Variety",
  benefits: [
    { title: "Oost-Europees", description: "Poolse, Roemeense, Russische elegantie." },
    { title: "Zuid-Europees", description: "Spaans, Italiaans, Portugees temperament." },
    { title: "West-Europees", description: "Nederlandse, Duitse, Belgische stijl." },
    { title: "Noord-Europees", description: "Scandinavische frisse schoonheid." },
  ],
  benefitsEn: [
    { title: "Eastern European", description: "Polish, Romanian, Russian elegance." },
    { title: "Southern European", description: "Spanish, Italian, Portuguese temperament." },
    { title: "Western European", description: "Dutch, German, Belgian style." },
    { title: "Northern European", description: "Scandinavian fresh beauty." },
  ],
  pricingTitle: "Tarieven Europese Escorts",
  pricingTitleEn: "European Escort Rates",
  pricingContent: "Europese escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn: "European escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Welke Europese landen zijn vertegenwoordigd?", answer: "Veel: Polen, Roemenië, Spanje, Italië, Nederland, Duitsland en meer." },
    { question: "Kan ik een specifieke nationaliteit vragen?", answer: "Ja, geef je voorkeur door. We matchen op nationaliteit indien beschikbaar." },
    { question: "Spreken Europese escorts Nederlands?", answer: "Veel wel, anders Engels. Communicatie is altijd mogelijk." },
  ],
  faqsEn: [
    { question: "Which European countries are represented?", answer: "Many: Poland, Romania, Spain, Italy, Netherlands, Germany and more." },
    { question: "Can I request a specific nationality?", answer: "Yes, share your preference. We match on nationality if available." },
    { question: "Do European escorts speak Dutch?", answer: "Many do, otherwise English. Communication is always possible." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "poolse-escort", label: "Poolse Escort", labelEn: "Polish Escort" },
    { slug: "roemeense-escort", label: "Roemeense Escort", labelEn: "Romanian Escort" },
    { slug: "nederlandse-escort", label: "Nederlandse Escort", labelEn: "Dutch Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/europese-escort.jpg",
  primaryImageAlt: "Europese escorts - internationale schoonheden",
  primaryImageAltEn: "European escorts - international beauties",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/europese-escort.jpg",
  quotePool: ["Internationale klasse.", "Oost-Europese elegantie is uniek.", "Mediterraans temperament."],
  trustBadges: ["Diverse nationaliteiten", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Diverse nationalities", "21+ verified", "Discreet"],
};

/**
 * Gay Escort Type Page
 */
export const gayEscortPageData: ServiceTypeDetailPageData = {
  slug: "gay-escort",
  pageType: "type",
  seoTitle: "Gay Escorts - Mannelijke Escorts voor Mannen | Vanaf €160",
  title: "Gay Escorts",
  titleEn: "Gay Escorts",
  metaDescription:
    "Boek een gay escort bij Desire Escorts. ✓ Mannelijke escorts ✓ Actief en passief ✓ Discreet en veilig ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a gay escort at Desire Escorts. ✓ Male escorts ✓ Active and passive ✓ Discreet and safe ✓ Available 24/7.",
  heroIntro:
    "Gay escorts voor mannen die gezelschap van een man zoeken. Onze mannelijke escorts zijn ervaren, discreet en beschikbaar in zowel actieve als passieve rollen.",
  heroIntroEn:
    "Gay escorts for men seeking male companionship. Our male escorts are experienced, discreet and available in both active and passive roles.",
  usps: ["Mannelijke escorts", "Actief & passief", "Volledig discreet"],
  uspsEn: ["Male escorts", "Active & passive", "Fully discreet"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Gay Escorts bij Desire",
  coreContentTitleEn: "Gay Escorts at Desire",
  coreContent: `Onze gay escorts zijn mannelijke escorts voor mannelijke klanten. Of je nu openlijk gay bent of dit discreet wilt verkennen — wij bieden een veilige, oordeelvrije omgeving.

De escorts kunnen zowel actief als passief zijn, afhankelijk van jouw voorkeur. Bespreek vooraf wat je zoekt, dan matchen we je met de juiste escort.

Discretie is gegarandeerd. Je privacy wordt te allen tijde beschermd.`,
  coreContentEn: `Our gay escorts are male escorts for male clients. Whether you're openly gay or want to explore this discreetly — we offer a safe, judgment-free environment.

The escorts can be both active and passive, depending on your preference. Discuss beforehand what you're looking for, then we match you with the right escort.

Discretion is guaranteed. Your privacy is protected at all times.`,
  benefitsTitle: "Gay Escort Service",
  benefitsTitleEn: "Gay Escort Service",
  benefits: [
    { title: "Mannelijke escorts", description: "Aantrekkelijke mannen voor mannelijke klanten." },
    { title: "Beide rollen", description: "Actief of passief, of beide — jij bepaalt." },
    { title: "Geen oordeel", description: "Veilige ruimte voor verkenning." },
    { title: "Volledige discretie", description: "Je privacy is gegarandeerd." },
  ],
  benefitsEn: [
    { title: "Male escorts", description: "Attractive men for male clients." },
    { title: "Both roles", description: "Active or passive, or both — you decide." },
    { title: "No judgment", description: "Safe space for exploration." },
    { title: "Full discretion", description: "Your privacy is guaranteed." },
  ],
  pricingTitle: "Tarieven Gay Escorts",
  pricingTitleEn: "Gay Escort Rates",
  pricingContent: "Gay escorts beginnen bij €160 per uur. Prijs varieert per escort.",
  pricingContentEn: "Gay escorts start at €160 per hour. Price varies per escort.",
  faqs: [
    { question: "Zijn gay escorts ook voor bi-curious mannen?", answer: "Ja, ook mannen die willen verkennen zijn welkom. Geen oordeel." },
    { question: "Wat betekent actief en passief?", answer: "Actief = penetrerend, passief = ontvangend. Beide rollen zijn beschikbaar." },
    { question: "Is dit volledig discreet?", answer: "Absoluut. Wij delen nooit informatie over boekingen." },
  ],
  faqsEn: [
    { question: "Are gay escorts also for bi-curious men?", answer: "Yes, men who want to explore are also welcome. No judgment." },
    { question: "What does active and passive mean?", answer: "Active = penetrating, passive = receiving. Both roles are available." },
    { question: "Is this fully discreet?", answer: "Absolutely. We never share information about bookings." },
  ],
  relatedServices: [
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
    { slug: "overnight-escort", label: "Overnight", labelEn: "Overnight" },
  ],
  relatedTypes: [
    { slug: "shemale-escort", label: "Shemale Escort", labelEn: "Shemale Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/gay-escort.jpg",
  primaryImageAlt: "Gay escorts - mannelijke escorts",
  primaryImageAltEn: "Gay escorts - male escorts",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/gay-escort.jpg",
  quotePool: ["Professioneel en discreet.", "Veilige ruimte om te verkennen.", "Geen oordeel, alleen plezier."],
  trustBadges: ["Volledig discreet", "Geen oordeel", "Veilig"],
  trustBadgesEn: ["Fully discreet", "No judgment", "Safe"],
};

/**
 * High Class Escort Type Page
 */
export const highClassEscortPageData: ServiceTypeDetailPageData = {
  slug: "high-class-escort",
  pageType: "type",
  seoTitle: "High Class Escorts - Premium Service | Vanaf €250",
  title: "High Class Escorts",
  titleEn: "High Class Escorts",
  metaDescription:
    "Boek een high class escort bij Desire Escorts. ✓ Premium service ✓ Exceptionele schoonheid ✓ Intelligent gezelschap ✓ Ultieme discretie.",
  metaDescriptionEn:
    "Book a high class escort at Desire Escorts. ✓ Premium service ✓ Exceptional beauty ✓ Intelligent companionship ✓ Ultimate discretion.",
  heroIntro:
    "High class escorts zijn onze premium selectie. Exceptionele schoonheid, intelligentie en klasse. Voor veeleisende gasten die het beste zoeken.",
  heroIntroEn:
    "High class escorts are our premium selection. Exceptional beauty, intelligence and class. For discerning guests who seek the best.",
  usps: ["Premium selectie", "Exceptionele schoonheid", "Ultieme discretie"],
  uspsEn: ["Premium selection", "Exceptional beauty", "Ultimate discretion"],
  priceFrom: "€250",
  minDuration: "2 uur",
  responseTime: "3 uur",
  coreContentTitle: "High Class bij Desire",
  coreContentTitleEn: "High Class at Desire",
  coreContent: `High class escorts zijn onze elite selectie. Deze dames voldoen aan de hoogste standaarden qua uiterlijk, intelligentie en sociale vaardigheden.

Ze zijn perfect voor: executive dinners, zakelijke evenementen, reisgezelschap naar het buitenland, of simpelweg een luxe privé-ervaring.

High class betekent ook high service. Verwacht perfecte verzorging, designer kleding, meertaligheid en een niveau van gezelschap dat past bij de meest veeleisende situaties.`,
  coreContentEn: `High class escorts are our elite selection. These ladies meet the highest standards in terms of appearance, intelligence and social skills.

They are perfect for: executive dinners, business events, travel companionship abroad, or simply a luxury private experience.

High class also means high service. Expect perfect grooming, designer clothing, multilingualism and a level of companionship that suits the most demanding situations.`,
  benefitsTitle: "High Class Ervaring",
  benefitsTitleEn: "High Class Experience",
  benefits: [
    { title: "Exceptioneel uiterlijk", description: "Model-kwaliteit schoonheid en verzorging." },
    { title: "Intellectueel niveau", description: "Universitair opgeleid, meertalig." },
    { title: "Sociale gratie", description: "Perfect gedrag in elke setting." },
    { title: "Premium service", description: "Alles wordt tot in perfectie verzorgd." },
  ],
  benefitsEn: [
    { title: "Exceptional appearance", description: "Model-quality beauty and grooming." },
    { title: "Intellectual level", description: "University educated, multilingual." },
    { title: "Social grace", description: "Perfect behavior in any setting." },
    { title: "Premium service", description: "Everything is arranged to perfection." },
  ],
  pricingTitle: "Tarieven High Class",
  pricingTitleEn: "High Class Rates",
  pricingContent:
    "High class escorts beginnen bij €250 per uur met een minimum van 2 uur. Langere boekingen en reizen op maat.",
  pricingContentEn:
    "High class escorts start at €250 per hour with a minimum of 2 hours. Longer bookings and travel custom priced.",
  faqs: [
    { question: "Wat maakt high class anders?", answer: "Strengere selectie op uiterlijk, intelligentie, opleiding en sociale vaardigheden." },
    { question: "Is high class alleen voor zakelijk?", answer: "Nee, ook voor privé-ervaringen waar je het beste wilt." },
    { question: "Waarom een minimum van 2 uur?", answer: "High class escorts nemen de tijd om een complete ervaring te bieden." },
  ],
  faqsEn: [
    { question: "What makes high class different?", answer: "Stricter selection on appearance, intelligence, education and social skills." },
    { question: "Is high class only for business?", answer: "No, also for private experiences where you want the best." },
    { question: "Why a minimum of 2 hours?", answer: "High class escorts take time to provide a complete experience." },
  ],
  relatedServices: [
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
    { slug: "business-escort", label: "Business Escort", labelEn: "Business Escort" },
    { slug: "reisgezelschap", label: "Reisgezelschap", labelEn: "Travel Companion" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/high-class-escort.jpg",
  primaryImageAlt: "High class escorts - premium service",
  primaryImageAltEn: "High class escorts - premium service",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/high-class-escort.jpg",
  quotePool: ["Absoluut premium niveau.", "Intelligentie en schoonheid gecombineerd.", "Het beste wat er is."],
  trustBadges: ["Premium selectie", "Elite service", "Ultieme discretie"],
  trustBadgesEn: ["Premium selection", "Elite service", "Ultimate discretion"],
};

/**
 * Jonge Escort Type Page
 */
export const jongeEscortPageData: ServiceTypeDetailPageData = {
  slug: "jonge-escort",
  pageType: "type",
  seoTitle: "Jonge Escorts - Dames 21-25 Jaar | Vanaf €160",
  title: "Jonge Escorts",
  titleEn: "Young Escorts",
  metaDescription:
    "Boek een jonge escort (21-25) bij Desire Escorts. ✓ Geverifieerde leeftijd ✓ Fris en energiek ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book a young escort (21-25) at Desire Escorts. ✓ Verified age ✓ Fresh and energetic ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Jonge escorts in de leeftijd van 21-25 jaar. Fris, energiek en vol levenslust. Alle leeftijden zijn geverifieerd — minimaal 21 jaar.",
  heroIntroEn:
    "Young escorts aged 21-25. Fresh, energetic and full of zest for life. All ages are verified — minimum 21 years.",
  usps: ["21-25 jaar", "Leeftijd geverifieerd", "Fris & energiek"],
  uspsEn: ["21-25 years", "Age verified", "Fresh & energetic"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Jonge Escorts bij Desire",
  coreContentTitleEn: "Young Escorts at Desire",
  coreContent: `Jonge escorts bieden een energieke, frisse ervaring. In de leeftijd van 21 tot 25 jaar zijn ze vaak nieuwsgierig, enthousiast en vol levenslust.

We verifiëren de leeftijd van al onze escorts. Niemand jonger dan 21 jaar werkt bij ons. Dit is essentieel voor veilige, legale dienstverlening.

Jonge dames passen goed bij wie energie en spontaniteit zoekt. Of je nu zelf jong bent of juist de jeugdige vibe waardeert — onze jonge escorts leveren.`,
  coreContentEn: `Young escorts offer an energetic, fresh experience. Aged 21 to 25, they are often curious, enthusiastic and full of zest for life.

We verify the age of all our escorts. No one under 21 works with us. This is essential for safe, legal service.

Young ladies suit those seeking energy and spontaneity. Whether you're young yourself or appreciate the youthful vibe — our young escorts deliver.`,
  benefitsTitle: "Jonge Escorts",
  benefitsTitleEn: "Young Escorts",
  benefits: [
    { title: "Jeugdige energie", description: "21-25 jaar, vol leven en enthousiasme." },
    { title: "Geverifieerde leeftijd", description: "100% legaal, alle leeftijden gecontroleerd." },
    { title: "Frisse uitstraling", description: "Moderne, hedendaagse schoonheid." },
    { title: "Nieuwsgierig", description: "Open voor nieuwe ervaringen." },
  ],
  benefitsEn: [
    { title: "Youthful energy", description: "21-25 years, full of life and enthusiasm." },
    { title: "Verified age", description: "100% legal, all ages checked." },
    { title: "Fresh appearance", description: "Modern, contemporary beauty." },
    { title: "Curious", description: "Open to new experiences." },
  ],
  pricingTitle: "Tarieven Jonge Escorts",
  pricingTitleEn: "Young Escort Rates",
  pricingContent: "Jonge escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn: "Young escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Hoe jong zijn 'jonge escorts'?", answer: "21 tot 25 jaar. Niemand jonger dan 21 werkt bij ons." },
    { question: "Wordt de leeftijd gecontroleerd?", answer: "Ja, we verifiëren de leeftijd van alle escorts met ID." },
    { question: "Zijn jonge escorts ook ervaren?", answer: "Ja, leeftijd zegt niets over ervaring. Veel jonge dames zijn zeer bekwaam." },
  ],
  faqsEn: [
    { question: "How young are 'young escorts'?", answer: "21 to 25 years. No one under 21 works with us." },
    { question: "Is age verified?", answer: "Yes, we verify the age of all escorts with ID." },
    { question: "Are young escorts also experienced?", answer: "Yes, age says nothing about experience. Many young ladies are very capable." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "uitgaan-escort", label: "Uitgaan", labelEn: "Going Out" },
  ],
  relatedTypes: [
    { slug: "studenten-escort", label: "Studenten Escort", labelEn: "Student Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/jonge-escort.jpg",
  primaryImageAlt: "Jonge escorts - 21-25 jaar",
  primaryImageAltEn: "Young escorts - 21-25 years",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/jonge-escort.jpg",
  quotePool: ["Frisse energie, geweldig.", "Jong en toch professioneel.", "Enthousiasme dat aanstekelijk werkt."],
  trustBadges: ["21+ geverifieerd", "Leeftijd gecontroleerd", "Legaal"],
  trustBadgesEn: ["21+ verified", "Age checked", "Legal"],
};

/**
 * Latina Escorts Type Page
 */
export const latinaEscortsPageData: ServiceTypeDetailPageData = {
  slug: "latina-escorts",
  pageType: "type",
  seoTitle: "Latina Escorts - Latijns-Amerikaanse Schoonheid | Vanaf €160",
  title: "Latina Escorts",
  titleEn: "Latina Escorts",
  metaDescription:
    "Boek een Latina escort bij Desire Escorts. ✓ Latijns-Amerikaans temperament ✓ Passie en vuur ✓ 24/7 beschikbaar in heel Nederland.",
  metaDescriptionEn:
    "Book a Latina escort at Desire Escorts. ✓ Latin American temperament ✓ Passion and fire ✓ Available 24/7 throughout the Netherlands.",
  heroIntro:
    "Latina escorts brengen Latijns-Amerikaans temperament naar Nederland. Vurig, sensueel en met een aanstekelijke levenslust. Van Braziliaans tot Colombiaans, van Cubaans tot Mexicaans.",
  heroIntroEn:
    "Latina escorts bring Latin American temperament to the Netherlands. Fiery, sensual and with an infectious zest for life. From Brazilian to Colombian, from Cuban to Mexican.",
  usps: ["Latijns temperament", "Vurig & sensueel", "Diverse achtergronden"],
  uspsEn: ["Latin temperament", "Fiery & sensual", "Diverse backgrounds"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Latina Escorts bij Desire",
  coreContentTitleEn: "Latina Escorts at Desire",
  coreContent: `Latina escorts zijn bekend om hun vurige persoonlijkheid en sensuele uitstraling. De Latijns-Amerikaanse cultuur straalt passie uit in alles — ook in intimiteit.

Onze Latina's komen uit verschillende landen: Brazilië, Colombia, Dominicaanse Republiek, Mexico en meer. Elke achtergrond brengt eigen charme.

Verwacht energie, warmte en een directheid die verfrissend is. Latinas zijn niet verlegen en weten wat ze willen.`,
  coreContentEn: `Latina escorts are known for their fiery personality and sensual appearance. Latin American culture radiates passion in everything — including intimacy.

Our Latinas come from various countries: Brazil, Colombia, Dominican Republic, Mexico and more. Each background brings its own charm.

Expect energy, warmth and a directness that is refreshing. Latinas are not shy and know what they want.`,
  benefitsTitle: "Latina Ervaring",
  benefitsTitleEn: "Latina Experience",
  benefits: [
    { title: "Vurig temperament", description: "Passie die je voelt in elke interactie." },
    { title: "Sensuele curves", description: "Latinas staan bekend om hun lichaamsbouw." },
    { title: "Warm en direct", description: "Geen spelletjes, eerlijke connectie." },
    { title: "Dans en ritme", description: "Veel Latinas kunnen fantastisch bewegen." },
  ],
  benefitsEn: [
    { title: "Fiery temperament", description: "Passion you feel in every interaction." },
    { title: "Sensual curves", description: "Latinas are known for their body shape." },
    { title: "Warm and direct", description: "No games, honest connection." },
    { title: "Dance and rhythm", description: "Many Latinas can move fantastically." },
  ],
  pricingTitle: "Tarieven Latina Escorts",
  pricingTitleEn: "Latina Escort Rates",
  pricingContent: "Latina escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn: "Latina escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Uit welke landen komen jullie Latinas?", answer: "Brazilië, Colombia, Dominicaanse Republiek, Mexico en andere Latijns-Amerikaanse landen." },
    { question: "Spreken Latinas Nederlands?", answer: "Sommigen wel, allen spreken Engels en Spaans/Portugees." },
    { question: "Klopt het stereotype van temperament?", answer: "Onze Latinas zijn inderdaad vurig en passievol — geen stereotype, gewoon cultuur." },
  ],
  faqsEn: [
    { question: "Which countries do your Latinas come from?", answer: "Brazil, Colombia, Dominican Republic, Mexico and other Latin American countries." },
    { question: "Do Latinas speak Dutch?", answer: "Some do, all speak English and Spanish/Portuguese." },
    { question: "Is the stereotype of temperament true?", answer: "Our Latinas are indeed fiery and passionate — not a stereotype, just culture." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "uitgaan-escort", label: "Uitgaan", labelEn: "Going Out" },
  ],
  relatedTypes: [
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "zwarte-escort", label: "Zwarte Escort", labelEn: "Black Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/latina-escort.jpg",
  primaryImageAlt: "Latina escorts - Latijns-Amerikaanse schoonheid",
  primaryImageAltEn: "Latina escorts - Latin American beauty",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/latina-escort.jpg",
  quotePool: ["Dat Latijnse vuur is echt.", "Passie en warmte gecombineerd.", "Aanstekelijke energie."],
  trustBadges: ["Latijns temperament", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Latin temperament", "21+ verified", "Discreet"],
};

/**
 * Mature Escort Type Page
 */
export const matureEscortPageData: ServiceTypeDetailPageData = {
  slug: "mature-escort",
  pageType: "type",
  seoTitle: "Mature Escorts - Ervaren Dames 35+ | Vanaf €160",
  title: "Mature Escorts",
  titleEn: "Mature Escorts",
  metaDescription:
    "Boek een mature escort bij Desire Escorts. ✓ Ervaren dames 35+ ✓ Levenswijsheid en sensuele expertise ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a mature escort at Desire Escorts. ✓ Experienced ladies 35+ ✓ Life wisdom and sensual expertise ✓ Available 24/7.",
  heroIntro:
    "Mature escorts bieden wat jongere dames nog moeten leren: ervaring, zelfvertrouwen en sensuele expertise. Dames van 35+ die precies weten wat mannen willen.",
  heroIntroEn:
    "Mature escorts offer what younger ladies still have to learn: experience, confidence and sensual expertise. Ladies 35+ who know exactly what men want.",
  usps: ["35+ ervaren", "Zelfverzekerd", "Sensuele expertise"],
  uspsEn: ["35+ experienced", "Confident", "Sensual expertise"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Mature Escorts bij Desire",
  coreContentTitleEn: "Mature Escorts at Desire",
  coreContent: `Mature escorts zijn voor gasten die ervaring waarderen. Deze dames van 35 jaar en ouder hebben levenservaring die zich vertaalt naar sensuele expertise.

Ze zijn zelfverzekerd, weten wat ze willen en zijn niet verlegen. Er is geen ongemak, geen onzekerheid — alleen volwassen plezier tussen volwassenen.

Veel gasten prefereren mature escorts juist vanwege die ervaring. Ze weten hoe ze een man moeten lezen en geven je precies wat je nodig hebt.`,
  coreContentEn: `Mature escorts are for guests who appreciate experience. These ladies aged 35 and older have life experience that translates to sensual expertise.

They are confident, know what they want and are not shy. There is no awkwardness, no uncertainty — just adult pleasure between adults.

Many guests prefer mature escorts precisely because of that experience. They know how to read a man and give you exactly what you need.`,
  benefitsTitle: "Voordelen Mature Escorts",
  benefitsTitleEn: "Benefits Mature Escorts",
  benefits: [
    { title: "Levenservaring", description: "35+ jaar wijsheid in en buiten de slaapkamer." },
    { title: "Zelfvertrouwen", description: "Geen onzekerheid, weten wat ze willen." },
    { title: "Sensuele kennis", description: "Jarenlange ervaring in wat mannen fijn vinden." },
    { title: "Geen games", description: "Volwassen, directe communicatie." },
  ],
  benefitsEn: [
    { title: "Life experience", description: "35+ years of wisdom in and out of the bedroom." },
    { title: "Confidence", description: "No uncertainty, know what they want." },
    { title: "Sensual knowledge", description: "Years of experience in what men like." },
    { title: "No games", description: "Adult, direct communication." },
  ],
  pricingTitle: "Tarieven Mature Escorts",
  pricingTitleEn: "Mature Escort Rates",
  pricingContent: "Mature escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn: "Mature escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Vanaf welke leeftijd is 'mature'?", answer: "Wij hanteren 35 jaar en ouder voor mature escorts." },
    { question: "Zijn mature escorts minder aantrekkelijk?", answer: "Absoluut niet. Mature schoonheid is tijdloos en vaak verfijnder." },
    { question: "Waarom kiezen voor mature?", answer: "Ervaring, zelfvertrouwen en expertise die jonge dames nog moeten ontwikkelen." },
  ],
  faqsEn: [
    { question: "From what age is 'mature'?", answer: "We use 35 years and older for mature escorts." },
    { question: "Are mature escorts less attractive?", answer: "Absolutely not. Mature beauty is timeless and often more refined." },
    { question: "Why choose mature?", answer: "Experience, confidence and expertise that young ladies still have to develop." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "tantra-escort", label: "Tantra", labelEn: "Tantra" },
  ],
  relatedTypes: [
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/mature-escort.jpg",
  primaryImageAlt: "Mature escorts - ervaren dames 35+",
  primaryImageAltEn: "Mature escorts - experienced ladies 35+",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/mature-escort.jpg",
  quotePool: ["Ervaring maakt echt verschil.", "Ze wist precies wat ik nodig had.", "Volwassen plezier."],
  trustBadges: ["35+ ervaring", "Zelfverzekerd", "Discreet"],
  trustBadgesEn: ["35+ experience", "Confident", "Discreet"],
};

/**
 * Petite Escort Type Page
 */
export const petiteEscortPageData: ServiceTypeDetailPageData = {
  slug: "petite-escort",
  pageType: "type",
  seoTitle: "Petite Escorts - Kleine Sierlijke Dames | Vanaf €160",
  title: "Petite Escorts",
  titleEn: "Petite Escorts",
  metaDescription:
    "Boek een petite escort bij Desire Escorts. ✓ Kleine sierlijke dames ✓ Tot 165cm ✓ Compact en elegant ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a petite escort at Desire Escorts. ✓ Small graceful ladies ✓ Up to 165cm ✓ Compact and elegant ✓ Available 24/7.",
  heroIntro:
    "Petite escorts zijn klein, sierlijk en compact. Dames tot 165cm die veel gasten aantrekkelijk vinden. Klein van stuk, groot van persoonlijkheid.",
  heroIntroEn:
    "Petite escorts are small, graceful and compact. Ladies up to 165cm that many guests find attractive. Small in stature, big in personality.",
  usps: ["Tot 165cm", "Sierlijk & compact", "Veel variatie"],
  uspsEn: ["Up to 165cm", "Graceful & compact", "Lots of variety"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Petite Escorts bij Desire",
  coreContentTitleEn: "Petite Escorts at Desire",
  coreContent: `Petite escorts zijn dames met een lengte tot 165cm. Ze zijn compact, sierlijk en vaak atletisch of slank gebouwd.

Veel mannen vinden kleine vrouwen extra aantrekkelijk. Het contrast, de behoefte om te beschermen, of simpelweg esthetische voorkeur — petites zijn populair.

Onderschat hun energie niet: kleine dames zijn vaak bijzonder vurig. Hun compacte formaat betekent niet minder passie.`,
  coreContentEn: `Petite escorts are ladies with a height up to 165cm. They are compact, graceful and often athletic or slender build.

Many men find small women extra attractive. The contrast, the need to protect, or simply aesthetic preference — petites are popular.

Don't underestimate their energy: small ladies are often particularly fiery. Their compact size doesn't mean less passion.`,
  benefitsTitle: "Petite Escorts",
  benefitsTitleEn: "Petite Escorts",
  benefits: [
    { title: "Compact formaat", description: "Klein en sierlijk, tot 165cm." },
    { title: "Atletisch/slank", description: "Veel petites zijn getraind en fit." },
    { title: "Vurige energie", description: "Klein van stuk, groot van passie." },
    { title: "Diverse types", description: "Blonde, brunette, Aziatisch — allemaal petite." },
  ],
  benefitsEn: [
    { title: "Compact size", description: "Small and graceful, up to 165cm." },
    { title: "Athletic/slim", description: "Many petites are trained and fit." },
    { title: "Fiery energy", description: "Small in stature, big in passion." },
    { title: "Diverse types", description: "Blonde, brunette, Asian — all petite." },
  ],
  pricingTitle: "Tarieven Petite Escorts",
  pricingTitleEn: "Petite Escort Rates",
  pricingContent: "Petite escorts beginnen bij €160 per uur. Prijs varieert per dame.",
  pricingContentEn: "Petite escorts start at €160 per hour. Price varies per lady.",
  faqs: [
    { question: "Hoe klein is petite?", answer: "Tot 165cm. Dit is een richtlijn; sommige dames zijn nog kleiner." },
    { question: "Zijn petites ook atletisch?", answer: "Veel wel. Klein hoeft niet fragiel te betekenen." },
    { question: "Kan ik petite combineren met andere kenmerken?", answer: "Ja, filter op petite + haarkleur, leeftijd, nationaliteit etc." },
  ],
  faqsEn: [
    { question: "How small is petite?", answer: "Up to 165cm. This is a guideline; some ladies are even smaller." },
    { question: "Are petites also athletic?", answer: "Many are. Small doesn't have to mean fragile." },
    { question: "Can I combine petite with other features?", answer: "Yes, filter on petite + hair color, age, nationality etc." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "erotische-massage", label: "Erotische Massage", labelEn: "Erotic Massage" },
  ],
  relatedTypes: [
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "jonge-escort", label: "Jonge Escort", labelEn: "Young Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/petite-escort.jpg",
  primaryImageAlt: "Petite escorts - kleine sierlijke dames",
  primaryImageAltEn: "Petite escorts - small graceful ladies",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/petite-escort.jpg",
  quotePool: ["Klein maar vurig.", "Sierlijk en energiek.", "Precies mijn type."],
  trustBadges: ["Tot 165cm", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Up to 165cm", "21+ verified", "Discreet"],
};

/**
 * Marokkaanse Escort Type Page
 */
export const marokkaanseEscortPageData: ServiceTypeDetailPageData = {
  slug: "marokkaanse-escort",
  pageType: "type",
  seoTitle: "Marokkaanse Escorts - Exotische Schoonheid | Vanaf €160",
  title: "Marokkaanse Escorts",
  titleEn: "Moroccan Escorts",
  metaDescription:
    "Boek een Marokkaanse escort bij Desire Escorts. ✓ Exotische schoonheid ✓ Warm temperament ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book a Moroccan escort at Desire Escorts. ✓ Exotic beauty ✓ Warm temperament ✓ Available 24/7 discreetly.",
  heroIntro:
    "Marokkaanse escorts brengen Noord-Afrikaanse schoonheid en warmte. Donkere ogen, olijfkleurige huid en een gastvrij temperament.",
  heroIntroEn:
    "Moroccan escorts bring North African beauty and warmth. Dark eyes, olive skin and a hospitable temperament.",
  usps: ["Exotische schoonheid", "Warm temperament", "Noord-Afrikaans"],
  uspsEn: ["Exotic beauty", "Warm temperament", "North African"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Marokkaanse Escorts",
  coreContentTitleEn: "Moroccan Escorts",
  coreContent: `Marokkaanse escorts combineren exotische schoonheid met een warm, gastvrij karakter. De Marokkaanse cultuur waardeert gastvrijheid hoog — dat merk je in de service.

Typische kenmerken: donkere ogen, olijfkleurige huid, vaak donker haar en een mediterraan temperament. Marokkaanse vrouwen staan bekend om hun schoonheid.

De combinatie van westerse professionaliteit en oosterse warmte maakt Marokkaanse escorts bijzonder.`,
  coreContentEn: `Moroccan escorts combine exotic beauty with a warm, hospitable character. Moroccan culture values hospitality highly — you notice that in the service.

Typical features: dark eyes, olive skin, often dark hair and a Mediterranean temperament. Moroccan women are known for their beauty.

The combination of Western professionalism and Eastern warmth makes Moroccan escorts special.`,
  benefitsTitle: "Marokkaanse Schoonheid",
  benefitsTitleEn: "Moroccan Beauty",
  benefits: [
    { title: "Exotisch uiterlijk", description: "Donkere ogen, olijfhuid, mediterraan." },
    { title: "Gastvrij karakter", description: "Warmte en aandacht zijn cultureel." },
    { title: "Sensueel", description: "Noord-Afrikaanse passie." },
    { title: "Discreet", description: "Discretie is cultureel belangrijk." },
  ],
  benefitsEn: [
    { title: "Exotic appearance", description: "Dark eyes, olive skin, Mediterranean." },
    { title: "Hospitable character", description: "Warmth and attention are cultural." },
    { title: "Sensual", description: "North African passion." },
    { title: "Discreet", description: "Discretion is culturally important." },
  ],
  pricingTitle: "Tarieven Marokkaanse Escorts",
  pricingTitleEn: "Moroccan Escort Rates",
  pricingContent: "Marokkaanse escorts beginnen bij €160 per uur.",
  pricingContentEn: "Moroccan escorts start at €160 per hour.",
  faqs: [
    { question: "Spreken Marokkaanse escorts Nederlands?", answer: "Veel wel, zij zijn vaak in Nederland opgegroeid of wonen hier lang." },
    { question: "Is dit discreet?", answer: "Absoluut. Discretie is cultureel belangrijk en wij garanderen privacy." },
  ],
  faqsEn: [
    { question: "Do Moroccan escorts speak Dutch?", answer: "Many do, they often grew up in the Netherlands or have lived here long." },
    { question: "Is this discreet?", answer: "Absolutely. Discretion is culturally important and we guarantee privacy." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "turkse-escort", label: "Turkse Escort", labelEn: "Turkish Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/marokkaanse-escort.jpg",
  primaryImageAlt: "Marokkaanse escorts - exotische schoonheid",
  primaryImageAltEn: "Moroccan escorts - exotic beauty",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/marokkaanse-escort.jpg",
  quotePool: ["Exotisch en warm.", "Die donkere ogen...", "Gastvrij en sensueel."],
  trustBadges: ["Exotisch", "21+ geverifieerd", "Volledig discreet"],
  trustBadgesEn: ["Exotic", "21+ verified", "Fully discreet"],
};

/**
 * Nederlandse Escort Type Page
 */
export const nederlandseEscortPageData: ServiceTypeDetailPageData = {
  slug: "nederlandse-escort",
  pageType: "type",
  seoTitle: "Nederlandse Escorts - Autochtone Nederlandse Dames | Vanaf €160",
  title: "Nederlandse Escorts",
  titleEn: "Dutch Escorts",
  metaDescription:
    "Boek een Nederlandse escort bij Desire Escorts. ✓ Autochtone Nederlandse dames ✓ Spreekt vloeiend Nederlands ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a Dutch escort at Desire Escorts. ✓ Native Dutch ladies ✓ Speaks fluent Dutch ✓ Available 24/7.",
  heroIntro:
    "Nederlandse escorts voor wie communicatie in het Nederlands waardeert. Autochtone dames die de Nederlandse cultuur en humor kennen.",
  heroIntroEn:
    "Dutch escorts for those who appreciate communication in Dutch. Native ladies who know Dutch culture and humor.",
  usps: ["Vloeiend Nederlands", "Nederlandse cultuur", "Autochtoon"],
  uspsEn: ["Fluent Dutch", "Dutch culture", "Native"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Nederlandse Escorts",
  coreContentTitleEn: "Dutch Escorts",
  coreContent: `Nederlandse escorts zijn voor gasten die communicatie in het Nederlands waarderen. Deze autochtone dames begrijpen Nederlandse cultuur, humor en gewoonten.

Veel gasten vinden het fijn om in hun moedertaal te kunnen praten. Het maakt de ervaring persoonlijker en relaxter.

Nederlandse dames staan bekend om hun directheid — wat je ziet is wat je krijgt. Geen spelletjes, eerlijke communicatie.`,
  coreContentEn: `Dutch escorts are for guests who appreciate communication in Dutch. These native ladies understand Dutch culture, humor and customs.

Many guests find it nice to be able to talk in their native language. It makes the experience more personal and relaxed.

Dutch ladies are known for their directness — what you see is what you get. No games, honest communication.`,
  benefitsTitle: "Nederlandse Escorts",
  benefitsTitleEn: "Dutch Escorts",
  benefits: [
    { title: "Vloeiend Nederlands", description: "Praat in je moedertaal, relaxter en persoonlijker." },
    { title: "Cultureel begrip", description: "Begrijpt Nederlandse humor en gewoonten." },
    { title: "Direct en eerlijk", description: "Typisch Nederlands: wat je ziet is wat je krijgt." },
    { title: "Diverse looks", description: "Nederlandse dames in alle types en vormen." },
  ],
  benefitsEn: [
    { title: "Fluent Dutch", description: "Talk in your native language, more relaxed and personal." },
    { title: "Cultural understanding", description: "Understands Dutch humor and customs." },
    { title: "Direct and honest", description: "Typically Dutch: what you see is what you get." },
    { title: "Diverse looks", description: "Dutch ladies in all types and shapes." },
  ],
  pricingTitle: "Tarieven Nederlandse Escorts",
  pricingTitleEn: "Dutch Escort Rates",
  pricingContent: "Nederlandse escorts beginnen bij €160 per uur.",
  pricingContentEn: "Dutch escorts start at €160 per hour.",
  faqs: [
    { question: "Zijn alle Nederlandse escorts autochtoon?", answer: "Wij selecteren op vloeiend Nederlands en cultureel begrip. Meestal autochtoon of hier opgegroeid." },
    { question: "Zijn er veel Nederlandse escorts?", answer: "We hebben een selectie; niet alle escorts zijn Nederlands, maar vraag naar beschikbaarheid." },
  ],
  faqsEn: [
    { question: "Are all Dutch escorts native?", answer: "We select for fluent Dutch and cultural understanding. Usually native or raised here." },
    { question: "Are there many Dutch escorts?", answer: "We have a selection; not all escorts are Dutch, but ask about availability." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "dinnerdate-escort", label: "Dinner Date", labelEn: "Dinner Date" },
  ],
  relatedTypes: [
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
    { slug: "europese-escort", label: "Europese Escort", labelEn: "European Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/nederlandse-escort.jpg",
  primaryImageAlt: "Nederlandse escorts - autochtone dames",
  primaryImageAltEn: "Dutch escorts - native ladies",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/nederlandse-escort.jpg",
  quotePool: ["Fijn om Nederlands te praten.", "Typisch direct, no-nonsense.", "Cultureel begrip maakt verschil."],
  trustBadges: ["Vloeiend Nederlands", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Fluent Dutch", "21+ verified", "Discreet"],
};

/**
 * Japanse Escort Type Page
 */
export const japanseEscortPageData: ServiceTypeDetailPageData = {
  slug: "japanse-escort",
  pageType: "type",
  seoTitle: "Japanse Escorts - Verfijnde Schoonheid | Vanaf €160",
  title: "Japanse Escorts",
  titleEn: "Japanese Escorts",
  metaDescription:
    "Boek een Japanse escort bij Desire Escorts. ✓ Verfijnde schoonheid ✓ Elegantie en gratie ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book a Japanese escort at Desire Escorts. ✓ Refined beauty ✓ Elegance and grace ✓ Available 24/7 discreetly.",
  heroIntro:
    "Japanse escorts brengen Oosterse verfijning naar Nederland. Bekend om elegantie, gratie en een unieke mix van traditionele en moderne schoonheid.",
  heroIntroEn:
    "Japanese escorts bring Eastern refinement to the Netherlands. Known for elegance, grace and a unique mix of traditional and modern beauty.",
  usps: ["Verfijnde elegantie", "Japanse gratie", "Unieke schoonheid"],
  uspsEn: ["Refined elegance", "Japanese grace", "Unique beauty"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Japanse Escorts",
  coreContentTitleEn: "Japanese Escorts",
  coreContent: `Japanse escorts zijn zeldzamer maar zeer gewild. De Japanse cultuur staat voor verfijning, beleefdheid en een unieke esthetiek.

Onze Japanse dames combineren traditionele elegantie met moderne sensualiteit. Ze zijn vaak kleiner, sierlijk en met een zachte, vrouwelijke energie.

Voor liefhebbers van Japanse cultuur of gewoon Aziatische schoonheid zijn deze escorts een bijzondere ervaring.`,
  coreContentEn: `Japanese escorts are rarer but highly sought after. Japanese culture stands for refinement, politeness and a unique aesthetic.

Our Japanese ladies combine traditional elegance with modern sensuality. They are often smaller, graceful and with soft, feminine energy.

For lovers of Japanese culture or just Asian beauty, these escorts are a special experience.`,
  benefitsTitle: "Japanse Schoonheid",
  benefitsTitleEn: "Japanese Beauty",
  benefits: [
    { title: "Verfijnd", description: "Japanse esthetiek is uniek en elegant." },
    { title: "Beleefd", description: "Cultuur van respect en aandacht." },
    { title: "Sierlijk", description: "Vaak petite met zachte energie." },
    { title: "Zeldzaam", description: "Beperkte beschikbaarheid maakt het speciaal." },
  ],
  benefitsEn: [
    { title: "Refined", description: "Japanese aesthetics are unique and elegant." },
    { title: "Polite", description: "Culture of respect and attention." },
    { title: "Graceful", description: "Often petite with soft energy." },
    { title: "Rare", description: "Limited availability makes it special." },
  ],
  pricingTitle: "Tarieven Japanse Escorts",
  pricingTitleEn: "Japanese Escort Rates",
  pricingContent: "Japanse escorts beginnen bij €160 per uur. Beperkte beschikbaarheid.",
  pricingContentEn: "Japanese escorts start at €160 per hour. Limited availability.",
  faqs: [
    { question: "Zijn er veel Japanse escorts beschikbaar?", answer: "Ze zijn zeldzamer. Vraag naar huidige beschikbaarheid." },
    { question: "Spreken ze Nederlands of Engels?", answer: "Engels altijd, Nederlands soms. Japans natuurlijk ook." },
  ],
  faqsEn: [
    { question: "Are there many Japanese escorts available?", answer: "They are rarer. Ask about current availability." },
    { question: "Do they speak Dutch or English?", answer: "Always English, sometimes Dutch. Japanese of course too." },
  ],
  relatedServices: [
    { slug: "nuru-massage", label: "Nuru Massage", labelEn: "Nuru Massage" },
    { slug: "tantra-escort", label: "Tantra", labelEn: "Tantra" },
  ],
  relatedTypes: [
    { slug: "aziatische-escorts", label: "Aziatische Escort", labelEn: "Asian Escort" },
    { slug: "petite-escort", label: "Petite Escort", labelEn: "Petite Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/japanse-escort.jpg",
  primaryImageAlt: "Japanse escorts - verfijnde schoonheid",
  primaryImageAltEn: "Japanese escorts - refined beauty",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/japanse-escort.jpg",
  quotePool: ["Verfijnde elegantie.", "Unieke Japanse schoonheid.", "Zeldzaam en speciaal."],
  trustBadges: ["Japanse verfijning", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Japanese refinement", "21+ verified", "Discreet"],
};

/**
 * Poolse Escort Type Page
 */
export const poolseEscortPageData: ServiceTypeDetailPageData = {
  slug: "poolse-escort",
  pageType: "type",
  seoTitle: "Poolse Escorts - Oost-Europese Elegantie | Vanaf €160",
  title: "Poolse Escorts",
  titleEn: "Polish Escorts",
  metaDescription:
    "Boek een Poolse escort bij Desire Escorts. ✓ Oost-Europese elegantie ✓ Natuurlijke schoonheid ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a Polish escort at Desire Escorts. ✓ Eastern European elegance ✓ Natural beauty ✓ Available 24/7.",
  heroIntro:
    "Poolse escorts zijn bekend om hun natuurlijke schoonheid en elegantie. Oost-Europese vrouwen met vaak blonde of lichtbruine haren en sierlijke lichaamsbouw.",
  heroIntroEn:
    "Polish escorts are known for their natural beauty and elegance. Eastern European women with often blonde or light brown hair and graceful build.",
  usps: ["Oost-Europese elegantie", "Natuurlijke schoonheid", "Slank & sierlijk"],
  uspsEn: ["Eastern European elegance", "Natural beauty", "Slim & graceful"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Poolse Escorts",
  coreContentTitleEn: "Polish Escorts",
  coreContent: `Poolse escorts vertegenwoordigen de Oost-Europese schoonheidsstandaard. Vaak blond of lichtbruin, slank en met klassieke gelaatstrekken.

Polen levert al jaren enkele van de mooiste modellen ter wereld. Die schoonheid vind je terug in onze Poolse escorts.

Poolse vrouwen staan ook bekend als hardwerkend en professioneel. Je krijgt schoonheid gecombineerd met goede service.`,
  coreContentEn: `Polish escorts represent the Eastern European beauty standard. Often blonde or light brown, slim and with classic features.

Poland has been producing some of the most beautiful models in the world for years. You find that beauty in our Polish escorts.

Polish women are also known as hardworking and professional. You get beauty combined with good service.`,
  benefitsTitle: "Poolse Schoonheid",
  benefitsTitleEn: "Polish Beauty",
  benefits: [
    { title: "Natuurlijk mooi", description: "Oost-Europese genen zorgen voor klassieke schoonheid." },
    { title: "Slank & fit", description: "Poolse vrouwen zorgen goed voor hun lichaam." },
    { title: "Professioneel", description: "Hardwerkende mentaliteit." },
    { title: "Toegankelijk", description: "Veel Poolse dames wonen in Nederland." },
  ],
  benefitsEn: [
    { title: "Naturally beautiful", description: "Eastern European genes provide classic beauty." },
    { title: "Slim & fit", description: "Polish women take good care of their body." },
    { title: "Professional", description: "Hardworking mentality." },
    { title: "Accessible", description: "Many Polish ladies live in the Netherlands." },
  ],
  pricingTitle: "Tarieven Poolse Escorts",
  pricingTitleEn: "Polish Escort Rates",
  pricingContent: "Poolse escorts beginnen bij €160 per uur.",
  pricingContentEn: "Polish escorts start at €160 per hour.",
  faqs: [
    { question: "Spreken Poolse escorts Nederlands?", answer: "Sommigen wel, allen spreken Engels. Veel wonen lang in NL." },
    { question: "Zijn er veel Poolse escorts?", answer: "Ja, Polen is goed vertegenwoordigd in onze selectie." },
  ],
  faqsEn: [
    { question: "Do Polish escorts speak Dutch?", answer: "Some do, all speak English. Many live long in NL." },
    { question: "Are there many Polish escorts?", answer: "Yes, Poland is well represented in our selection." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "europese-escort", label: "Europese Escort", labelEn: "European Escort" },
    { slug: "blonde-escort-dames", label: "Blonde Escort", labelEn: "Blonde Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/poolse-escort.jpg",
  primaryImageAlt: "Poolse escorts - Oost-Europese elegantie",
  primaryImageAltEn: "Polish escorts - Eastern European elegance",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/poolse-escort.jpg",
  quotePool: ["Klassieke Oost-Europese schoonheid.", "Professioneel en mooi.", "Poolse elegantie."],
  trustBadges: ["Oost-Europees", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Eastern European", "21+ verified", "Discreet"],
};

/**
 * Roemeense Escort Type Page
 */
export const roemeenseEscortPageData: ServiceTypeDetailPageData = {
  slug: "roemeense-escort",
  pageType: "type",
  seoTitle: "Roemeense Escorts - Zuidoost-Europese Charme | Vanaf €160",
  title: "Roemeense Escorts",
  titleEn: "Romanian Escorts",
  metaDescription:
    "Boek een Roemeense escort bij Desire Escorts. ✓ Zuidoost-Europese schoonheid ✓ Donkerharige charme ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a Romanian escort at Desire Escorts. ✓ Southeast European beauty ✓ Dark-haired charm ✓ Available 24/7.",
  heroIntro:
    "Roemeense escorts brengen Zuidoost-Europese charme. Vaak donkerharig met mediterrane trekken en een warme, passionele energie.",
  heroIntroEn:
    "Romanian escorts bring Southeast European charm. Often dark-haired with Mediterranean features and warm, passionate energy.",
  usps: ["Zuidoost-Europees", "Mediterrane trekken", "Passioneel"],
  uspsEn: ["Southeast European", "Mediterranean features", "Passionate"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Roemeense Escorts",
  coreContentTitleEn: "Romanian Escorts",
  coreContent: `Roemeense escorts zijn vaak donkerharig met mediterrane gelaatstrekken. Roemenië ligt op de grens van Oost-Europa en de Balkan, wat een unieke mix oplevert.

Roemeense vrouwen staan bekend om hun schoonheid — niet voor niets komen veel modellen uit deze regio. Ze combineren elegantie met warmte.

Veel Roemeense dames wonen in Nederland en spreken goed Nederlands of Engels.`,
  coreContentEn: `Romanian escorts are often dark-haired with Mediterranean features. Romania is on the border of Eastern Europe and the Balkans, which produces a unique mix.

Romanian women are known for their beauty — not for nothing many models come from this region. They combine elegance with warmth.

Many Romanian ladies live in the Netherlands and speak good Dutch or English.`,
  benefitsTitle: "Roemeense Charme",
  benefitsTitleEn: "Romanian Charm",
  benefits: [
    { title: "Mediterraan uiterlijk", description: "Donker haar, warme huidskleur, expressieve ogen." },
    { title: "Balkan temperament", description: "Warmte en passie zijn cultureel." },
    { title: "Elegant", description: "Roemeense vrouwen verzorgen zich goed." },
    { title: "Toegankelijk", description: "Veel Roemeense dames in Nederland." },
  ],
  benefitsEn: [
    { title: "Mediterranean appearance", description: "Dark hair, warm skin tone, expressive eyes." },
    { title: "Balkan temperament", description: "Warmth and passion are cultural." },
    { title: "Elegant", description: "Romanian women take good care of themselves." },
    { title: "Accessible", description: "Many Romanian ladies in the Netherlands." },
  ],
  pricingTitle: "Tarieven Roemeense Escorts",
  pricingTitleEn: "Romanian Escort Rates",
  pricingContent: "Roemeense escorts beginnen bij €160 per uur.",
  pricingContentEn: "Romanian escorts start at €160 per hour.",
  faqs: [
    { question: "Spreken Roemeense escorts Nederlands?", answer: "Veel wel, of Engels. Roemeens natuurlijk ook." },
    { question: "Wat maakt Roemeense escorts anders?", answer: "De mix van Oost-Europese elegantie en Balkan warmte." },
  ],
  faqsEn: [
    { question: "Do Romanian escorts speak Dutch?", answer: "Many do, or English. Romanian of course too." },
    { question: "What makes Romanian escorts different?", answer: "The mix of Eastern European elegance and Balkan warmth." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "europese-escort", label: "Europese Escort", labelEn: "European Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/roemeense-escort.jpg",
  primaryImageAlt: "Roemeense escorts - Zuidoost-Europese charme",
  primaryImageAltEn: "Romanian escorts - Southeast European charm",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/roemeense-escort.jpg",
  quotePool: ["Balkan warmte, Europese elegantie.", "Donkere schoonheid.", "Passioneel en warm."],
  trustBadges: ["Zuidoost-Europees", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Southeast European", "21+ verified", "Discreet"],
};

/**
 * Striptease Escort Type Page
 */
export const stripteaseEscortPageData: ServiceTypeDetailPageData = {
  slug: "striptease-escort",
  pageType: "type",
  seoTitle: "Striptease Escorts - Sensuele Dans | Vanaf €160",
  title: "Striptease Escorts",
  titleEn: "Striptease Escorts",
  metaDescription:
    "Boek een striptease escort bij Desire Escorts. ✓ Professionele striptease ✓ Privé of evenement ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a striptease escort at Desire Escorts. ✓ Professional striptease ✓ Private or event ✓ Available 24/7.",
  heroIntro:
    "Striptease escorts combineren sensuele dans met escortservice. Geniet van een privé striptease of entertainment voor een evenement, gevolgd door intimiteit als je dat wilt.",
  heroIntroEn:
    "Striptease escorts combine sensual dance with escort service. Enjoy a private striptease or entertainment for an event, followed by intimacy if you want.",
  usps: ["Professionele striptease", "Privé of evenement", "Gecombineerd met escort"],
  uspsEn: ["Professional striptease", "Private or event", "Combined with escort"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "2 uur",
  coreContentTitle: "Striptease Escorts",
  coreContentTitleEn: "Striptease Escorts",
  coreContent: `Striptease escorts zijn dames met ervaring in sensuele dans. Ze kunnen een privé show geven of entertainment bieden voor een groep (zoals een vrijgezellenfeest).

Het verschil met een gewone stripper? Na de show is er mogelijkheid tot intimiteit. Je krijgt entertainment én escort in één boeking.

De striptease kan variëren van langzaam en verleidelijk tot energiek en opzwepend — afhankelijk van de situatie en je voorkeur.`,
  coreContentEn: `Striptease escorts are ladies with experience in sensual dance. They can give a private show or provide entertainment for a group (like a bachelor party).

The difference with a regular stripper? After the show there is possibility for intimacy. You get entertainment and escort in one booking.

The striptease can range from slow and seductive to energetic and exciting — depending on the situation and your preference.`,
  benefitsTitle: "Striptease + Escort",
  benefitsTitleEn: "Striptease + Escort",
  benefits: [
    { title: "Entertainment + intimiteit", description: "Twee ervaringen in één boeking." },
    { title: "Privé of groep", description: "Solo show of voor een feest." },
    { title: "Professionele dansers", description: "Dames met striptease-ervaring." },
    { title: "Flexibel", description: "Stijl aangepast aan de situatie." },
  ],
  benefitsEn: [
    { title: "Entertainment + intimacy", description: "Two experiences in one booking." },
    { title: "Private or group", description: "Solo show or for a party." },
    { title: "Professional dancers", description: "Ladies with striptease experience." },
    { title: "Flexible", description: "Style adapted to the situation." },
  ],
  pricingTitle: "Tarieven Striptease Escorts",
  pricingTitleEn: "Striptease Escort Rates",
  pricingContent: "Striptease escorts beginnen bij €160 per uur inclusief show én intimiteit.",
  pricingContentEn: "Striptease escorts start at €160 per hour including show and intimacy.",
  faqs: [
    { question: "Is intimiteit inbegrepen na de striptease?", answer: "Ja, het is een escort boeking. De striptease is onderdeel van de ervaring." },
    { question: "Kan dit ook voor een groep?", answer: "Ja, voor vrijgezellenfeesten of andere groepsevents. De striptease is dan voor de groep, intimiteit optioneel." },
    { question: "Hoe lang duurt een striptease?", answer: "Typisch 15-30 minuten als onderdeel van een langere boeking." },
  ],
  faqsEn: [
    { question: "Is intimacy included after the striptease?", answer: "Yes, it's an escort booking. The striptease is part of the experience." },
    { question: "Can this also be for a group?", answer: "Yes, for bachelor parties or other group events. The striptease is for the group, intimacy optional." },
    { question: "How long does a striptease last?", answer: "Typically 15-30 minutes as part of a longer booking." },
  ],
  relatedServices: [
    { slug: "vrijgezellenfeest-escort", label: "Vrijgezellenfeest", labelEn: "Bachelor Party" },
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
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/striptease-escort.jpg",
  primaryImageAlt: "Striptease escorts - sensuele dans",
  primaryImageAltEn: "Striptease escorts - sensual dance",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/striptease-escort.jpg",
  quotePool: ["Show én intimiteit in één.", "Professionele dans, geweldige afsluiting.", "Perfect voor het vrijgezellenfeest."],
  trustBadges: ["Professionele dansers", "Show + escort", "Discreet"],
  trustBadgesEn: ["Professional dancers", "Show + escort", "Discreet"],
};

/**
 * Turkse Escort Type Page
 */
export const turkseEscortPageData: ServiceTypeDetailPageData = {
  slug: "turkse-escort",
  pageType: "type",
  seoTitle: "Turkse Escorts - Exotische Schoonheid | Vanaf €160",
  title: "Turkse Escorts",
  titleEn: "Turkish Escorts",
  metaDescription:
    "Boek een Turkse escort bij Desire Escorts. ✓ Exotische schoonheid ✓ Mediterraan temperament ✓ 24/7 discreet beschikbaar.",
  metaDescriptionEn:
    "Book a Turkish escort at Desire Escorts. ✓ Exotic beauty ✓ Mediterranean temperament ✓ Available 24/7 discreetly.",
  heroIntro:
    "Turkse escorts brengen Mediterrane schoonheid met Oosterse invloeden. Donkere ogen, olijfhuid en een warm, gastvrij karakter.",
  heroIntroEn:
    "Turkish escorts bring Mediterranean beauty with Eastern influences. Dark eyes, olive skin and a warm, hospitable character.",
  usps: ["Mediterraan-Oosters", "Exotische schoonheid", "Warm karakter"],
  uspsEn: ["Mediterranean-Eastern", "Exotic beauty", "Warm character"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Turkse Escorts",
  coreContentTitleEn: "Turkish Escorts",
  coreContent: `Turkse escorts combineren Europese en Aziatische invloeden — een unieke mix die Turkije kenmerkt. Het resultaat is exotische schoonheid met Mediterraans temperament.

Typische kenmerken zijn donkere ogen, olijfhuid, donker haar en een warm, gastvrij karakter. Turkse vrouwen staan bekend om hun schoonheid.

Veel Turkse dames wonen in Nederland en spreken vloeiend Nederlands.`,
  coreContentEn: `Turkish escorts combine European and Asian influences — a unique mix that characterizes Turkey. The result is exotic beauty with Mediterranean temperament.

Typical features are dark eyes, olive skin, dark hair and a warm, hospitable character. Turkish women are known for their beauty.

Many Turkish ladies live in the Netherlands and speak fluent Dutch.`,
  benefitsTitle: "Turkse Schoonheid",
  benefitsTitleEn: "Turkish Beauty",
  benefits: [
    { title: "Exotisch", description: "Mix van Europa en Azië." },
    { title: "Warm karakter", description: "Gastvrijheid is cultureel." },
    { title: "Mediterraan", description: "Passie en temperament." },
    { title: "Toegankelijk", description: "Veel Turkse dames in Nederland." },
  ],
  benefitsEn: [
    { title: "Exotic", description: "Mix of Europe and Asia." },
    { title: "Warm character", description: "Hospitality is cultural." },
    { title: "Mediterranean", description: "Passion and temperament." },
    { title: "Accessible", description: "Many Turkish ladies in the Netherlands." },
  ],
  pricingTitle: "Tarieven Turkse Escorts",
  pricingTitleEn: "Turkish Escort Rates",
  pricingContent: "Turkse escorts beginnen bij €160 per uur.",
  pricingContentEn: "Turkish escorts start at €160 per hour.",
  faqs: [
    { question: "Spreken Turkse escorts Nederlands?", answer: "Veel wel, vaak opgegroeid in Nederland." },
    { question: "Is dit discreet?", answer: "Volledig. Discretie is gegarandeerd." },
  ],
  faqsEn: [
    { question: "Do Turkish escorts speak Dutch?", answer: "Many do, often raised in the Netherlands." },
    { question: "Is this discreet?", answer: "Completely. Discretion is guaranteed." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "marokkaanse-escort", label: "Marokkaanse Escort", labelEn: "Moroccan Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/turkse-escort.jpg",
  primaryImageAlt: "Turkse escorts - exotische schoonheid",
  primaryImageAltEn: "Turkish escorts - exotic beauty",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/turkse-escort.jpg",
  quotePool: ["Exotisch en warm.", "Die donkere ogen...", "Mediterraans temperament."],
  trustBadges: ["Exotisch", "21+ geverifieerd", "Volledig discreet"],
  trustBadgesEn: ["Exotic", "21+ verified", "Fully discreet"],
};

/**
 * Zwarte Escort Type Page
 */
export const zwarteEscortPageData: ServiceTypeDetailPageData = {
  slug: "zwarte-escort",
  pageType: "type",
  seoTitle: "Zwarte Escorts - Afrikaanse Schoonheid | Vanaf €160",
  title: "Zwarte Escorts",
  titleEn: "Black Escorts",
  metaDescription:
    "Boek een zwarte escort bij Desire Escorts. ✓ Afrikaanse en Caribische schoonheid ✓ Diverse achtergronden ✓ 24/7 beschikbaar.",
  metaDescriptionEn:
    "Book a black escort at Desire Escorts. ✓ African and Caribbean beauty ✓ Diverse backgrounds ✓ Available 24/7.",
  heroIntro:
    "Zwarte escorts brengen Afrikaanse en Caribische schoonheid. Diverse achtergronden, van Surinaams tot Afrikaans, elk met eigen charme.",
  heroIntroEn:
    "Black escorts bring African and Caribbean beauty. Diverse backgrounds, from Surinamese to African, each with their own charm.",
  usps: ["Afrikaans & Caribisch", "Diverse achtergronden", "Unieke schoonheid"],
  uspsEn: ["African & Caribbean", "Diverse backgrounds", "Unique beauty"],
  priceFrom: "€160",
  minDuration: "1 uur",
  responseTime: "90 min",
  coreContentTitle: "Zwarte Escorts",
  coreContentTitleEn: "Black Escorts",
  coreContent: `Zwarte escorts bij Desire komen uit diverse achtergronden: Surinaams, Antilliaans, Afrikaans en meer. Elke achtergrond brengt eigen cultuur en charme.

Van Caribische warmte tot Afrikaanse elegantie — de diversiteit is groot. Wat ze delen is een unieke schoonheid en vaak een uitgesproken persoonlijkheid.

Veel van onze zwarte escorts zijn in Nederland opgegroeid en spreken vloeiend Nederlands.`,
  coreContentEn: `Black escorts at Desire come from diverse backgrounds: Surinamese, Antillean, African and more. Each background brings its own culture and charm.

From Caribbean warmth to African elegance — the diversity is great. What they share is a unique beauty and often an outspoken personality.

Many of our black escorts grew up in the Netherlands and speak fluent Dutch.`,
  benefitsTitle: "Diversiteit in Schoonheid",
  benefitsTitleEn: "Diversity in Beauty",
  benefits: [
    { title: "Caribische warmte", description: "Surinaamse en Antilliaanse dames." },
    { title: "Afrikaanse elegantie", description: "Diverse Afrikaanse achtergronden." },
    { title: "Uniek", description: "Schoonheid die opvalt." },
    { title: "Nederlands", description: "Veel spreken vloeiend Nederlands." },
  ],
  benefitsEn: [
    { title: "Caribbean warmth", description: "Surinamese and Antillean ladies." },
    { title: "African elegance", description: "Various African backgrounds." },
    { title: "Unique", description: "Beauty that stands out." },
    { title: "Dutch", description: "Many speak fluent Dutch." },
  ],
  pricingTitle: "Tarieven Zwarte Escorts",
  pricingTitleEn: "Black Escort Rates",
  pricingContent: "Zwarte escorts beginnen bij €160 per uur.",
  pricingContentEn: "Black escorts start at €160 per hour.",
  faqs: [
    { question: "Uit welke landen komen zwarte escorts?", answer: "Suriname, Antillen, diverse Afrikaanse landen — grote variatie." },
    { question: "Spreken ze Nederlands?", answer: "Veel wel, vooral Surinaamse en Antilliaanse dames." },
  ],
  faqsEn: [
    { question: "Which countries do black escorts come from?", answer: "Suriname, Antilles, various African countries — great variety." },
    { question: "Do they speak Dutch?", answer: "Many do, especially Surinamese and Antillean ladies." },
  ],
  relatedServices: [
    { slug: "gfe-escorts", label: "GFE", labelEn: "GFE" },
    { slug: "hotel-escort", label: "Hotel Escort", labelEn: "Hotel Escort" },
  ],
  relatedTypes: [
    { slug: "latina-escorts", label: "Latina Escort", labelEn: "Latina Escort" },
    { slug: "brunette-escort-dames", label: "Brunette Escort", labelEn: "Brunette Escort" },
  ],
  relatedLocations: [
    { slug: "escort-amsterdam", label: "Amsterdam" },
    { slug: "escort-rotterdam", label: "Rotterdam" },
  ],
  primaryImageUrl: "https://desire-escorts.nl/wp-content/uploads/zwarte-escort.jpg",
  primaryImageAlt: "Zwarte escorts - Afrikaanse en Caribische schoonheid",
  primaryImageAltEn: "Black escorts - African and Caribbean beauty",
  ogImageUrl: "https://desire-escorts.nl/wp-content/uploads/zwarte-escort.jpg",
  quotePool: ["Unieke schoonheid.", "Caribische warmte.", "Afrikaanse elegantie."],
  trustBadges: ["Diverse achtergronden", "21+ geverifieerd", "Discreet"],
  trustBadgesEn: ["Diverse backgrounds", "21+ verified", "Discreet"],
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
  blondeEscortPageData.slug,
  brunetteEscortPageData.slug,
  shemaleEscortPageData.slug,
  goedkopeEscortsPageData.slug,
  studentenEscortPageData.slug,
  europeseEscortPageData.slug,
  gayEscortPageData.slug,
  highClassEscortPageData.slug,
  jongeEscortPageData.slug,
  latinaEscortsPageData.slug,
  matureEscortPageData.slug,
  petiteEscortPageData.slug,
  marokkaanseEscortPageData.slug,
  nederlandseEscortPageData.slug,
  japanseEscortPageData.slug,
  poolseEscortPageData.slug,
  roemeenseEscortPageData.slug,
  stripteaseEscortPageData.slug,
  turkseEscortPageData.slug,
  zwarteEscortPageData.slug,
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

function withLegacyPageImage(
  page: ServiceTypeDetailPageData
): ServiceTypeDetailPageData {
  const fs = require("fs");
  const path = require("path");

  const FALLBACK_IMAGE = "/images/service-type/featured-image-158.jpg";

  const explicitImageOverrides: Record<string, string> = {
    "rollenspel-escort": "/images/service-type/serivce-roleplay.jpg.avif",
  };

  const wpUploadsPrefix = "https://desire-escorts.nl/wp-content/uploads/";

  const toLocalRepoImage = (imageUrl: string): string => {
    if (!imageUrl.startsWith(wpUploadsPrefix)) {
      return imageUrl;
    }
    const filename = imageUrl.slice(wpUploadsPrefix.length);
    return `/images/service-type/${filename}`;
  };

  const localImageExists = (localPath: string): boolean => {
    try {
      const fullPath = path.join(process.cwd(), "public", localPath);
      return fs.existsSync(fullPath);
    } catch {
      return false;
    }
  };

  const resolveImage = (): string => {
    const explicitImage = explicitImageOverrides[page.slug];
    if (explicitImage && localImageExists(explicitImage)) {
      return explicitImage;
    }

    const curatedImageIsWpUrl = page.primaryImageUrl.startsWith(wpUploadsPrefix);
    if (curatedImageIsWpUrl) {
      const localImage = toLocalRepoImage(page.primaryImageUrl);
      if (localImageExists(localImage)) {
        return localImage;
      }
    }

    const legacyImage =
      getLegacyPageSnapshot(page.slug, page.title)?.imageUrl ??
      getLivePageImageBySlug(page.slug);

    if (legacyImage) {
      const localImage = toLocalRepoImage(legacyImage);
      if (localImageExists(localImage)) {
        return localImage;
      }
    }

    return FALLBACK_IMAGE;
  };

  const resolvedImage = resolveImage();

  return {
    ...page,
    primaryImageUrl: resolvedImage,
    ogImageUrl: resolvedImage,
  };
}

const allServiceTypeDetailPagesRaw: ServiceTypeDetailPageData[] = [
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
  blondeEscortPageData,
  brunetteEscortPageData,
  shemaleEscortPageData,
  goedkopeEscortsPageData,
  studentenEscortPageData,
  europeseEscortPageData,
  gayEscortPageData,
  highClassEscortPageData,
  jongeEscortPageData,
  latinaEscortsPageData,
  matureEscortPageData,
  petiteEscortPageData,
  marokkaanseEscortPageData,
  nederlandseEscortPageData,
  japanseEscortPageData,
  poolseEscortPageData,
  roemeenseEscortPageData,
  stripteaseEscortPageData,
  turkseEscortPageData,
  zwarteEscortPageData,
  ...generatedServiceTypePages,
];

export const allServiceTypeDetailPages: ServiceTypeDetailPageData[] =
  allServiceTypeDetailPagesRaw.map(withLegacyPageImage);
