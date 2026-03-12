/**
 * Strapi API client for profile data fetching.
 * Server-side only — uses private API token.
 */

import type {
  StrapiProfilesResponse,
  StrapiProfileEntity,
  Profile,
} from "@/lib/types/profile";
import { normalizeProfile } from "./normalize";

const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL?.replace(/\/+$/, "") || "";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";
const STRAPI_SITE_HOST = process.env.STRAPI_SITE_HOST || "desire-escorts.nl";

function getStrapiHeaders(): HeadersInit {
  if (!STRAPI_API_TOKEN) {
    throw new Error("STRAPI_API_TOKEN is not configured");
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    "x-forwarded-host": STRAPI_SITE_HOST,
  };
}

async function fetchStrapi<T>(endpoint: string): Promise<T> {
  if (!STRAPI_BASE_URL) {
    throw new Error("STRAPI_BASE_URL is not configured");
  }

  const url = `${STRAPI_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: getStrapiHeaders(),
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Strapi request failed ${response.status}: ${text}`);
  }

  const trimmed = text.replace(/^\uFEFF/, "").trim();
  // Some APIs prepend )]}' or similar; strip to first { for parse
  const start = trimmed.indexOf("{");
  const toParse = start >= 0 ? trimmed.slice(start) : trimmed;

  try {
    return JSON.parse(toParse) as T;
  } catch (err) {
    const snippet = trimmed.slice(0, 200).replace(/\n/g, " ");
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Strapi returned invalid JSON: ${msg}. Body start: ${snippet}`
    );
  }
}

/**
 * Fetch all profiles from Strapi with full population.
 * Returns normalized Profile[] sorted by sortOrder then name.
 */
export async function getProfiles(): Promise<Profile[]> {
  const response = await fetchStrapi<StrapiProfilesResponse>(
    "/api/profiles?populate=*&pagination[pageSize]=200"
  );

  const profiles = response.data
    .map((entity) => normalizeProfile(entity))
    .filter((profile) => !profile.isHidden);

  // Sort by sortOrder (ascending), then by name
  profiles.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });

  return profiles;
}

/**
 * Fetch available profiles only (isAvailable=true, isHidden=false).
 */
export async function getAvailableProfiles(): Promise<Profile[]> {
  const profiles = await getProfiles();
  return profiles.filter((profile) => profile.isAvailable);
}

/**
 * Fetch a single profile by slug.
 * Returns null if not found or hidden.
 */
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const response = await fetchStrapi<StrapiProfilesResponse>(
    `/api/profiles?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`
  );

  if (response.data.length === 0) {
    return null;
  }

  const profile = normalizeProfile(response.data[0]);

  if (profile.isHidden) {
    return null;
  }

  return profile;
}

/**
 * Get all profile slugs (for static generation).
 */
export async function getAllProfileSlugs(): Promise<string[]> {
  const profiles = await getProfiles();
  return profiles.map((profile) => profile.slug);
}

/**
 * Build absolute image URL from Strapi media.
 * Handles both absolute URLs and relative paths.
 */
export function getStrapiImageUrl(url: string | undefined): string {
  if (!url) {
    return "";
  }

  // Already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Relative path — prepend Strapi base URL
  return `${STRAPI_BASE_URL}${url}`;
}

/**
 * Get responsive image URL from Strapi media formats.
 * Prefers the specified format, falls back to original URL.
 */
export function getStrapiImageFormat(
  image: { url: string; formats?: Record<string, { url: string }> } | undefined,
  format: "thumbnail" | "small" | "medium" | "large" = "medium"
): string {
  if (!image) {
    return "";
  }

  const formatUrl = image.formats?.[format]?.url;
  return getStrapiImageUrl(formatUrl || image.url);
}
