/**
 * Helper functions for mapping Strapi profiles to UI components.
 */

import type { Profile, StrapiImage } from "@/lib/types/profile";
import { getStrapiImageFormat } from "./strapi";

/**
 * Get the primary image URL from a profile's photos array.
 * Returns medium format if available, falls back to original.
 */
export function getProfileImageUrl(
  photos: StrapiImage[] | undefined,
  format: "thumbnail" | "small" | "medium" | "large" = "medium"
): string | undefined {
  if (!photos || photos.length === 0) {
    return undefined;
  }

  const firstPhoto = photos[0];
  return getStrapiImageFormat(firstPhoto, format) || undefined;
}

/**
 * Format height number to display string (e.g., 173 -> "173cm").
 */
export function formatHeight(height: number | undefined): string | undefined {
  if (height === undefined) return undefined;
  return `${height}cm`;
}

/**
 * Format cup size for display (e.g., "D cup" -> "D").
 */
export function formatCupSize(cupSize: string | undefined): string | undefined {
  if (!cupSize) return undefined;
  return cupSize.replace(" cup", "");
}

/**
 * Map a normalized Profile to ProfileCard component props.
 */
export function profileToCardProps(profile: Profile) {
  return {
    name: profile.name,
    slug: profile.slug,
    imageUrl: getProfileImageUrl(profile.photos, "medium"),
    tagline: profile.shortBio,
    isVerified: profile.verified,
    isAvailable: profile.isAvailable,
    age: profile.age,
    height: formatHeight(profile.height),
    cupSize: formatCupSize(profile.cupSize),
  };
}

/**
 * Map multiple profiles to ProfileCard props.
 */
export function profilesToCardProps(profiles: Profile[]) {
  return profiles.map(profileToCardProps);
}
