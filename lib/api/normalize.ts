/**
 * Normalization utilities for Strapi API responses.
 * Handles Strapi v4 nested attribute shape and relation unwrapping.
 */

import type {
  StrapiProfileEntity,
  StrapiProfileAttributes,
  StrapiService,
  StrapiLanguage,
  Profile,
} from "@/lib/types/profile";

/**
 * Unwrap Strapi relation array (handles both flat and nested data shapes).
 */
function unwrapRelation<T>(
  relation: T[] | { data: T[] } | undefined | null
): T[] {
  if (!relation) return [];
  if (Array.isArray(relation)) return relation;
  if (Array.isArray(relation.data)) return relation.data;
  return [];
}

function getNestedValue<T extends object, K extends string>(
  item: T,
  key: K
): string | undefined {
  const direct = (item as Record<string, unknown>)[key];
  if (typeof direct === "string" && direct.length > 0) {
    return direct;
  }

  const nested = (item as Record<string, unknown>).attributes;
  if (nested && typeof nested === "object") {
    const nestedValue = (nested as Record<string, unknown>)[key];
    if (typeof nestedValue === "string" && nestedValue.length > 0) {
      return nestedValue;
    }
  }

  return undefined;
}

/**
 * Normalize services relation to slug array.
 */
function normalizeServices(
  services: StrapiService[] | { data: StrapiService[] } | undefined
): string[] {
  const items = unwrapRelation(services);
  return items
    .map((service) => getNestedValue(service as unknown as object, "slug") || getNestedValue(service as unknown as object, "name"))
    .filter(Boolean);
}

/**
 * Normalize languages relation to name/code array.
 */
function normalizeLanguages(
  languages: StrapiLanguage[] | { data: StrapiLanguage[] } | undefined
): string[] {
  const items = unwrapRelation(languages);
  return items
    .map((lang) => getNestedValue(lang as unknown as object, "code") || getNestedValue(lang as unknown as object, "name"))
    .filter(Boolean);
}

/**
 * Normalize tags component to label array.
 */
function normalizeTags(
  tags: { label: string; slug?: string }[] | undefined
): string[] {
  if (!tags) return [];
  return tags.map((tag) => tag.label).filter(Boolean);
}

/**
 * Normalize attributesList component to key-value map.
 */
function normalizeAttributes(
  attributes: { key: string; value?: string }[] | undefined
): Record<string, string> {
  if (!attributes) return {};
  const result: Record<string, string> = {};
  for (const attr of attributes) {
    if (attr.key) {
      result[attr.key] = attr.value || "";
    }
  }
  return result;
}

/**
 * Normalize a Strapi profile entity to app Profile model.
 * Handles Strapi v4 nested attributes shape.
 */
export function normalizeProfile(entity: StrapiProfileEntity): Profile {
  const attrs: StrapiProfileAttributes = entity.attributes || (entity as unknown as StrapiProfileAttributes);

  return {
    id: entity.id ?? (attrs as unknown as { id?: number }).id ?? 0,
    documentId: attrs.documentId,
    name: attrs.name || "",
    slug: attrs.slug || "",
    shortBio: attrs.shortBio,
    bio: attrs.bio,
    age: attrs.age,
    height: attrs.height,
    cupSize: attrs.cupSize,
    postuur: attrs.postuur,
    geaardheid: attrs.geaardheid,
    haarKleur: attrs.haarKleur,
    oogKleur: attrs.oogKleur,
    verified: attrs.verified ?? false,
    featured: attrs.featured ?? false,
    isAvailable: attrs.isAvailable ?? false,
    isHidden: attrs.isHidden ?? false,
    sortOrder: attrs.sortOrder ?? 999,
    photos: attrs.photos || [],
    services: normalizeServices(attrs.services),
    languages: normalizeLanguages(attrs.languages),
    tags: normalizeTags(attrs.tags),
    attributes: normalizeAttributes(attrs.attributesList),
    availability: attrs.availability || [],
    contact: attrs.contact ?? undefined,
    seo: attrs.seo ?? undefined,
  };
}

/**
 * Normalize multiple profile entities.
 */
export function normalizeProfiles(entities: StrapiProfileEntity[]): Profile[] {
  return entities.map(normalizeProfile);
}
