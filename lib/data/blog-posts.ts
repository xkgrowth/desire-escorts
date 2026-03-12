import wpPosts from "../../data/wordpress/nl/posts.json";
import wpMedia from "../../data/wordpress/media.json";

type WpRenderedField = {
  rendered: string;
};

type WpPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WpRenderedField;
  content: WpRenderedField;
  excerpt: WpRenderedField;
  author: number;
  featured_media?: number;
};

type WpMedia = {
  id: number;
  alt_text?: string;
  guid?: WpRenderedField;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

type AuthorInfo = {
  id: number;
  slug: string;
  name: string;
  bio?: string;
  imageUrl?: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  link: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  publishedAtLabel: string;
  readTimeMinutes: number;
  readTimeLabel: string;
  author: AuthorInfo;
  contentHtmlMain: string;
  faqItems: { question: string; answer: string }[];
  imageUrl?: string;
  imageAlt?: string;
};

const AUTHOR_BY_ID: Record<number, AuthorInfo> = {
  8: {
    id: 8,
    slug: "julian-van-dijk",
    name: "Julian van Dijk",
    bio: "Met grofweg 20 jaar ervaring is Julian van Dijk een gepassioneerde Nederlandse schrijver van boeiende en informatieve blog posts. Sinds het begin van zijn carrière is Julian begonnen met het schrijven van content voor Desire Escorts en sinds kort is hij begonnen met onze Blog sectie.",
    imageUrl:
      "https://desire-escorts.nl/wp-content/uploads/2024/04/julianvandijk-300x300-1.webp",
  },
  4: {
    id: 4,
    slug: "desire-escorts",
    name: "Desire Escorts",
  },
};

const FALLBACK_AUTHOR: AuthorInfo = {
  id: 0,
  slug: "desire-escorts",
  name: "Desire Escorts",
};

const preferredMediaSizes = ["medium_large", "large", "medium", "full"];

const mediaById = new Map<number, WpMedia>(
  (wpMedia as WpMedia[]).map((mediaItem) => [mediaItem.id, mediaItem])
);

const EXCLUDED_BLOG_SLUGS = new Set([
  "hinter-den-kulissen-von-desire-escorts",
  "party-escort-girls",
]);

const FALLBACK_IMAGE_BY_SLUG: Record<
  string,
  { imageUrl: string; imageAlt: string }
> = {
  "party-escort-girls": {
    imageUrl:
      "https://desire-escorts.nl/wp-content/uploads/pexels-krivitskiy-1591595-600x413.jpg",
    imageAlt: "Party escort blog afbeelding",
  },
  "die-besten-escorts-in-amsterdam-2": {
    imageUrl:
      "https://desire-escorts.nl/wp-content/uploads/blog-ade-uitgaan-service-600x400.jpg",
    imageAlt: "Amsterdam escorts blog afbeelding",
  },
};

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
  hellip: "...",
  ndash: "-",
  mdash: "-",
  rsquo: "'",
  lsquo: "'",
  rdquo: "\"",
  ldquo: "\"",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, entity) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return ENTITY_MAP[entity] || full;
  });
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWordBoundary(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const base = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return `${base}...`;
}

function buildCardExcerpt(excerptHtml: string, contentHtml: string): string {
  const cleanExcerpt = stripHtml(excerptHtml);
  const contentText = stripHtml(contentHtml);

  const source = cleanExcerpt.length >= 90 ? cleanExcerpt : contentText;
  return truncateAtWordBoundary(source, 170);
}

function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function estimateReadTime(contentHtml: string): number {
  const text = stripHtml(contentHtml);
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function extractFirstImage(contentHtml: string): { imageUrl?: string; imageAlt?: string } {
  const imageMatch = contentHtml.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
  if (!imageMatch) {
    return {};
  }

  const imgTag = imageMatch[0];
  const imageUrl = imageMatch[1];
  const altMatch = imgTag.match(/alt="([^"]*)"/i);

  return {
    imageUrl,
    imageAlt: altMatch ? decodeHtmlEntities(altMatch[1]) : undefined,
  };
}

function getFeaturedImageByMediaId(mediaId?: number): { imageUrl?: string; imageAlt?: string } {
  if (!mediaId) {
    return {};
  }

  const mediaItem = mediaById.get(mediaId);
  if (!mediaItem) {
    return {};
  }

  const sizes = mediaItem.media_details?.sizes || {};

  for (const size of preferredMediaSizes) {
    const sourceUrl = sizes[size]?.source_url;
    if (sourceUrl) {
      return {
        imageUrl: sourceUrl,
        imageAlt: mediaItem.alt_text || undefined,
      };
    }
  }

  return {
    imageUrl: mediaItem.guid?.rendered,
    imageAlt: mediaItem.alt_text || undefined,
  };
}

function extractFaqItems(contentHtml: string): { question: string; answer: string }[] {
  const detailsBlocks = [...contentHtml.matchAll(/<details[\s\S]*?<\/details>/gi)].map(
    (match) => match[0]
  );

  return detailsBlocks
    .map((block) => {
      const summaryMatch = block.match(/<summary[\s\S]*?<\/summary>/i);
      const question = summaryMatch ? stripHtml(summaryMatch[0]) : "";
      const answer = stripHtml(block.replace(/<summary[\s\S]*?<\/summary>/i, ""));

      return {
        question,
        answer,
      };
    })
    .filter((item) => item.question.length > 0 && item.answer.length > 0);
}

function stripFaqFromContent(contentHtml: string): string {
  return contentHtml
    .replace(/<h2[^>]*>\s*(?:<strong>)?\s*FAQ\s*(?:<\/strong>)?\s*<\/h2>/gi, "")
    .replace(/<details[\s\S]*?<\/details>/gi, "")
    .replace(/<div[^>]*class="[^"]*e-n-accordion[^"]*"[\s\S]*?<\/div>/gi, "");
}

function normalizePost(post: WpPost): BlogPost {
  const author = AUTHOR_BY_ID[post.author] || FALLBACK_AUTHOR;
  const readTimeMinutes = estimateReadTime(post.content.rendered);
  const firstImage = extractFirstImage(post.content.rendered);
  const featuredImage = getFeaturedImageByMediaId(post.featured_media);
  const fallbackImage = FALLBACK_IMAGE_BY_SLUG[post.slug];
  const imageUrl = firstImage.imageUrl || featuredImage.imageUrl || fallbackImage?.imageUrl;
  const imageAlt = firstImage.imageAlt || featuredImage.imageAlt || fallbackImage?.imageAlt;
  const faqItems = extractFaqItems(post.content.rendered);
  const contentHtmlMain = stripFaqFromContent(post.content.rendered);

  return {
    id: post.id,
    slug: post.slug,
    link: post.link,
    title: decodeHtmlEntities(post.title.rendered),
    excerpt: buildCardExcerpt(post.excerpt.rendered, post.content.rendered),
    contentHtml: post.content.rendered,
    publishedAt: post.date,
    publishedAtLabel: formatPublishedDate(post.date),
    readTimeMinutes,
    readTimeLabel: `${readTimeMinutes} min leestijd`,
    author,
    contentHtmlMain,
    faqItems,
    imageUrl,
    imageAlt,
  };
}

const normalizedPosts: BlogPost[] = (wpPosts as WpPost[])
  .filter((post) => !EXCLUDED_BLOG_SLUGS.has(post.slug))
  .sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }
    return b.id - a.id;
  })
  .map(normalizePost)
  .filter(
    (post, index, allPosts) =>
      allPosts.findIndex((candidate) => candidate.slug === post.slug) === index
  );

export function getBlogPosts(): BlogPost[] {
  return normalizedPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return normalizedPosts.find((post) => post.slug === slug) || null;
}

export function getBlogPostSlugs(): string[] {
  return normalizedPosts.map((post) => post.slug);
}

export function getRelatedBlogPosts(slug: string, limit = 6): BlogPost[] {
  return normalizedPosts.filter((post) => post.slug !== slug).slice(0, limit);
}

export function getAuthorBySlug(slug: string): AuthorInfo | null {
  return Object.values(AUTHOR_BY_ID).find((author) => author.slug === slug) || null;
}

export function getPostsByAuthorSlug(slug: string): BlogPost[] {
  return normalizedPosts.filter((post) => post.author.slug === slug);
}
