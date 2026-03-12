import wpPosts from "../../data/wordpress/nl/posts.json";

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
};

type AuthorInfo = {
  id: number;
  slug: string;
  name: string;
  bio?: string;
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
  imageUrl?: string;
  imageAlt?: string;
};

const AUTHOR_BY_ID: Record<number, AuthorInfo> = {
  8: {
    id: 8,
    slug: "julian-van-dijk",
    name: "Julian van Dijk",
    bio: "Met grofweg 20 jaar ervaring is Julian van Dijk een gepassioneerde Nederlandse schrijver van boeiende en informatieve blog posts. Sinds het begin van zijn carrière is Julian begonnen met het schrijven van content voor Desire Escorts en sinds kort is hij begonnen met onze Blog sectie.",
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

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
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

function normalizePost(post: WpPost): BlogPost {
  const author = AUTHOR_BY_ID[post.author] || FALLBACK_AUTHOR;
  const readTimeMinutes = estimateReadTime(post.content.rendered);
  const firstImage = extractFirstImage(post.content.rendered);

  return {
    id: post.id,
    slug: post.slug,
    link: post.link,
    title: decodeHtmlEntities(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    contentHtml: post.content.rendered,
    publishedAt: post.date,
    publishedAtLabel: formatPublishedDate(post.date),
    readTimeMinutes,
    readTimeLabel: `${readTimeMinutes} min leestijd`,
    author,
    imageUrl: firstImage.imageUrl,
    imageAlt: firstImage.imageAlt,
  };
}

const normalizedPosts: BlogPost[] = (wpPosts as WpPost[])
  .map(normalizePost)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

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
