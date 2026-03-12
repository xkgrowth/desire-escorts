import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SLUGS_FILE = path.join(ROOT, "data", "inventory", "nl-location-slugs.txt");
const MEDIA_FILE = path.join(ROOT, "data", "wordpress", "media.json");
const OUTPUT_DIR = path.join(ROOT, "public", "images", "location");
const MANIFEST_FILE = path.join(ROOT, "data", "inventory", "location-image-manifest.json");

const BASE_UPLOADS = "https://desire-escorts.nl/wp-content/uploads";
const BASE_SITE_URL = "https://desire-escorts.nl";
const REQUEST_TIMEOUT_MS = 6_000;
const PAGE_REQUEST_TIMEOUT_MS = 8_000;
const CONCURRENCY = 8;
const MAX_PRIMARY_ATTEMPTS = 4;
const MAX_SECONDARY_ATTEMPTS = 4;
const PAGE_IMAGE_GROUPS_TO_SKIP = 4;
const UPLOAD_IMAGE_URL_PATTERN =
  /https:\/\/desire-escorts\.nl\/wp-content\/uploads\/[^"'\s<>]+?\.(?:jpe?g|png|webp|gif|svg)(?:\.avif)?/gi;

function parseSlugs(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function safeSuffix(slug) {
  return slug.replace(/^escort-/, "");
}

function stripQuery(url) {
  return String(url).split("?")[0];
}

function extFromUrl(url) {
  const clean = stripQuery(url);
  const match = clean.match(/\.(jpe?g|png|webp|gif|avif|svg)$/i);
  return match ? `.${match[1].toLowerCase().replace("jpeg", "jpg")}` : "";
}

function extFromContentType(contentType) {
  if (!contentType) return "";
  if (contentType.includes("image/jpeg")) return ".jpg";
  if (contentType.includes("image/png")) return ".png";
  if (contentType.includes("image/webp")) return ".webp";
  if (contentType.includes("image/gif")) return ".gif";
  if (contentType.includes("image/avif")) return ".avif";
  if (contentType.includes("image/svg+xml")) return ".svg";
  return "";
}

function getAltFromMedia(mediaByUrl, url) {
  const media = mediaByUrl.get(url);
  if (!media) return "";
  const alt = String(media.alt_text || "").trim();
  if (alt) return alt;
  const title = String(media?.title?.rendered || "").trim();
  return title;
}

function getAltFromMaps(mediaByUrl, pageAltByUrl, url) {
  return getAltFromMedia(mediaByUrl, url) || pageAltByUrl.get(url) || "";
}

function normalizeUploadUrl(url) {
  const clean = stripQuery(url)
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/[),]+$/g, "")
    .trim();
  if (!clean.startsWith(`${BASE_SITE_URL}/wp-content/uploads/`)) return "";
  return clean;
}

function isUploadImageUrl(url) {
  const clean = normalizeUploadUrl(url);
  if (!clean) return false;
  if (!/\.(?:jpe?g|png|webp|gif|avif|svg)$/i.test(clean)) return false;
  if (/\/elementor\//i.test(clean)) return false;
  if (/\/flags\//i.test(clean)) return false;
  if (/featured-image|favicon|logo-desire|cropped-favicon/i.test(clean)) return false;
  return true;
}

function extractUploadUrls(text) {
  return [...text.matchAll(UPLOAD_IMAGE_URL_PATTERN)].map((match) => match[0]);
}

function imageGroupKey(url) {
  const clean = normalizeUploadUrl(url);
  if (!clean) return "";
  const withoutAvif = clean.replace(/\.avif$/i, "");
  return withoutAvif.replace(/-\d+x\d+(?=\.[a-z]+$)/i, "");
}

function scorePreferredImageVariant(url) {
  const clean = normalizeUploadUrl(url);
  if (!clean) return 0;
  const withoutAvif = clean.replace(/\.avif$/i, "");
  let score = 0;
  if (!/\.avif$/i.test(clean)) score += 40;
  if (/scaled\./i.test(withoutAvif)) score += 30;
  if (!/-\d+x\d+\./i.test(withoutAvif)) score += 20;
  if (/\/escort-/i.test(withoutAvif)) score += 10;
  return score;
}

function extractUploadImageUrlsFromHtml(html) {
  const matches = extractUploadUrls(html);
  return unique(matches.map(normalizeUploadUrl).filter(isUploadImageUrl));
}

function extractPageAltByUrl(html) {
  const map = new Map();
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgTags) {
    const altMatch = tag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
    const alt = String(altMatch?.[2] || altMatch?.[3] || "").trim();
    if (!alt) continue;
    const urlMatches = extractUploadUrls(tag);
    for (const rawUrl of urlMatches) {
      const normalized = normalizeUploadUrl(rawUrl);
      if (!normalized || !isUploadImageUrl(normalized)) continue;
      if (!map.has(normalized)) map.set(normalized, alt);
      const key = imageGroupKey(normalized);
      if (key && !map.has(key)) map.set(key, alt);
    }
  }
  return map;
}

function buildPagePrioritizedImages(rawUrls) {
  const groups = new Map();
  const orderedGroupKeys = [];
  for (const url of rawUrls) {
    const key = imageGroupKey(url);
    if (!key) continue;
    if (!groups.has(key)) {
      groups.set(key, []);
      orderedGroupKeys.push(key);
    }
    groups.get(key).push(url);
  }

  const preferred = orderedGroupKeys
    .map((key) => {
      const variants = groups.get(key) || [];
      if (variants.length === 0) return "";
      return variants
        .slice()
        .sort((a, b) => scorePreferredImageVariant(b) - scorePreferredImageVariant(a))[0];
    })
    .filter(Boolean);

  return unique(preferred);
}

async function fetchPageImageContext(slug) {
  const pageUrl = `${BASE_SITE_URL}/${slug}/`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PAGE_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(pageUrl, { signal: controller.signal });
    if (!response.ok) {
      return {
        candidates: { primary: [], secondary: [], related: [] },
        altByUrl: new Map(),
      };
    }
    const html = await response.text();
    const rawUploads = extractUploadImageUrlsFromHtml(html);
    const prioritized = buildPagePrioritizedImages(rawUploads);
    const afterProfileCards = prioritized.slice(PAGE_IMAGE_GROUPS_TO_SKIP);
    const escortOnly = afterProfileCards.filter((url) => /\/escort-[^/]+\./i.test(url));
    const hotelOnly = escortOnly.filter((url) => /hotels?/i.test(url));

    const primary = unique([...escortOnly, ...afterProfileCards]).slice(0, MAX_PRIMARY_ATTEMPTS);
    const secondary = unique([...hotelOnly, ...escortOnly.slice(1), ...afterProfileCards.slice(1)]).slice(
      0,
      MAX_SECONDARY_ATTEMPTS
    );

    return {
      candidates: {
        primary,
        secondary,
        related: unique(afterProfileCards),
      },
      altByUrl: extractPageAltByUrl(html),
    };
  } catch {
    return {
      candidates: { primary: [], secondary: [], related: [] },
      altByUrl: new Map(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildDeterministicCandidates(suffix) {
  return {
    primary: unique([
      `${BASE_UPLOADS}/escort-dames-in-${suffix}-scaled.webp`,
      `${BASE_UPLOADS}/escort-dames-in-${suffix}-scaled.jpg`,
      `${BASE_UPLOADS}/escort-${suffix}-scaled.webp`,
      `${BASE_UPLOADS}/escort-${suffix}-scaled.jpg`,
    ]),
    secondary: unique([
      `${BASE_UPLOADS}/escort-${suffix}-hotels-scaled.jpg`,
      `${BASE_UPLOADS}/escort-${suffix}-hotels-1-scaled.jpg`,
    ]),
  };
}

function buildMediaCandidates(mediaUrls, suffix) {
  const slugPattern = new RegExp(`escort[-_]${suffix.replace(/-/g, "[-_]")}`, "i");
  const damesPattern = new RegExp(`escort[-_]dames[-_]in[-_]${suffix.replace(/-/g, "[-_]")}`, "i");
  const hotelsPattern = new RegExp(`escort[-_]${suffix.replace(/-/g, "[-_]")}[-_]hotels`, "i");

  const related = mediaUrls.filter((url) => slugPattern.test(url) || damesPattern.test(url));
  const primary = related.filter((url) => damesPattern.test(url) || /scaled\.(?:webp|jpg|jpeg)$/i.test(url));
  const secondary = related.filter((url) => hotelsPattern.test(url));

  return {
    primary: unique(primary),
    secondary: unique(secondary),
    related: unique(related),
  };
}

async function fetchImage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      buffer,
      contentType,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadFirst(candidates, outputBaseName) {
  for (const url of candidates) {
    const payload = await fetchImage(url);
    if (!payload) continue;

    const ext = extFromContentType(payload.contentType) || extFromUrl(url) || ".jpg";
    const outputFilename = `${outputBaseName}${ext}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    await fs.writeFile(outputPath, payload.buffer);

    return {
      url,
      outputFilename,
      bytes: payload.buffer.length,
    };
  }
  return null;
}

async function copyFileForSecondary(primaryFilename, secondaryBaseName) {
  const src = path.join(OUTPUT_DIR, primaryFilename);
  const ext = path.extname(primaryFilename) || ".jpg";
  const dstFilename = `${secondaryBaseName}${ext}`;
  const dst = path.join(OUTPUT_DIR, dstFilename);
  await fs.copyFile(src, dst);
  return dstFilename;
}

function buildPrimaryCandidates(fromPage, fromMedia, deterministic) {
  return unique([...fromPage.primary, ...fromMedia.primary, ...deterministic.primary, ...fromPage.related, ...fromMedia.related]).slice(
    0,
    MAX_PRIMARY_ATTEMPTS
  );
}

function buildSecondaryCandidates(fromPage, fromMedia, deterministic, primaryUrl) {
  return unique([
    ...fromPage.secondary,
    ...fromMedia.secondary,
    ...deterministic.secondary,
    ...fromPage.related,
    ...fromMedia.related,
  ])
    .filter((url) => !primaryUrl || url !== primaryUrl)
    .slice(0, MAX_SECONDARY_ATTEMPTS);
}

async function processSlug(slug, mediaUrls, mediaByUrl) {
  const suffix = safeSuffix(slug);
  const deterministic = buildDeterministicCandidates(suffix);
  const fromMedia = buildMediaCandidates(mediaUrls, suffix);
  const pageContext = await fetchPageImageContext(slug);

  const primaryCandidates = buildPrimaryCandidates(pageContext.candidates, fromMedia, deterministic);
  const primary = await downloadFirst(primaryCandidates, `${slug}-primary`);

  let secondary = null;
  let secondaryFallbackToPrimary = false;
  const secondaryCandidates = buildSecondaryCandidates(
    pageContext.candidates,
    fromMedia,
    deterministic,
    primary?.url
  );

  if (secondaryCandidates.length > 0) {
    secondary = await downloadFirst(secondaryCandidates, `${slug}-secondary`);
  }

  if (!secondary && primary) {
    const outputFilename = await copyFileForSecondary(primary.outputFilename, `${slug}-secondary`);
    secondary = {
      url: primary.url,
      outputFilename,
      bytes: primary.bytes,
    };
    secondaryFallbackToPrimary = true;
  }

  return {
    slug,
    primary: primary
      ? {
          url: primary.url,
          file: primary.outputFilename,
          alt: getAltFromMaps(mediaByUrl, pageContext.altByUrl, primary.url),
        }
      : null,
    secondary: secondary
      ? {
          url: secondary.url,
          file: secondary.outputFilename,
          alt: getAltFromMaps(mediaByUrl, pageContext.altByUrl, secondary.url),
          fallbackToPrimary: secondaryFallbackToPrimary,
        }
      : null,
    candidateCounts: {
      primary: primaryCandidates.length,
      secondary: secondaryCandidates.length,
    },
    stats: {
      withPrimary: primary ? 1 : 0,
      withSecondary: secondary ? 1 : 0,
      secondaryFallbackToPrimary: secondaryFallbackToPrimary ? 1 : 0,
      missingBoth: !primary && !secondary ? 1 : 0,
    },
  };
}

async function main() {
  const slugsText = await fs.readFile(SLUGS_FILE, "utf8");
  const slugs = parseSlugs(slugsText);
  const media = JSON.parse(await fs.readFile(MEDIA_FILE, "utf8"));
  const mediaByUrl = new Map(
    media
      .filter((item) => typeof item?.source_url === "string")
      .map((item) => [item.source_url, item])
  );
  const mediaUrls = [...mediaByUrl.keys()];

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalSlugs: slugs.length,
    outputDir: path.relative(ROOT, OUTPUT_DIR),
    stats: {
      withPrimary: 0,
      withSecondary: 0,
      secondaryFallbackToPrimary: 0,
      globalFallbackPrimary: 0,
      globalFallbackSecondary: 0,
      missingBoth: 0,
    },
    entries: [],
  };

  const entries = new Array(slugs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < slugs.length) {
      const idx = nextIndex;
      nextIndex += 1;
      const slug = slugs[idx];
      const result = await processSlug(slug, mediaUrls, mediaByUrl);
      entries[idx] = result;
      if ((idx + 1) % 25 === 0 || idx + 1 === slugs.length) {
        console.log(`Processed ${idx + 1}/${slugs.length} slugs...`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  for (const entry of entries) {
    manifest.stats.withPrimary += entry.stats.withPrimary;
    manifest.stats.withSecondary += entry.stats.withSecondary;
    manifest.stats.secondaryFallbackToPrimary += entry.stats.secondaryFallbackToPrimary;
    manifest.stats.missingBoth += entry.stats.missingBoth;
    manifest.entries.push({
      slug: entry.slug,
      primary: entry.primary,
      secondary: entry.secondary,
      candidateCounts: entry.candidateCounts,
    });
  }

  const primarySeed = manifest.entries.find((entry) => entry.primary);
  const secondarySeed = manifest.entries.find((entry) => entry.secondary);

  if (!primarySeed?.primary || !secondarySeed?.secondary) {
    throw new Error("Unable to seed global fallback images. No downloaded base image found.");
  }

  for (const entry of manifest.entries) {
    if (!entry.primary) {
      const src = path.join(OUTPUT_DIR, primarySeed.primary.file);
      const ext = path.extname(primarySeed.primary.file) || ".jpg";
      const dstFile = `${entry.slug}-primary${ext}`;
      await fs.copyFile(src, path.join(OUTPUT_DIR, dstFile));
      entry.primary = {
        url: primarySeed.primary.url,
        file: dstFile,
        alt: primarySeed.primary.alt,
        fallbackToGlobalDefault: true,
      };
      manifest.stats.globalFallbackPrimary += 1;
      manifest.stats.withPrimary += 1;
      manifest.stats.missingBoth = Math.max(0, manifest.stats.missingBoth - 1);
    }

    if (!entry.secondary) {
      const src = path.join(OUTPUT_DIR, secondarySeed.secondary.file);
      const ext = path.extname(secondarySeed.secondary.file) || ".jpg";
      const dstFile = `${entry.slug}-secondary${ext}`;
      await fs.copyFile(src, path.join(OUTPUT_DIR, dstFile));
      entry.secondary = {
        url: secondarySeed.secondary.url,
        file: dstFile,
        alt: secondarySeed.secondary.alt,
        fallbackToPrimary: false,
        fallbackToGlobalDefault: true,
      };
      manifest.stats.globalFallbackSecondary += 1;
      manifest.stats.withSecondary += 1;
    }
  }

  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));

  console.log(`Saved manifest: ${path.relative(ROOT, MANIFEST_FILE)}`);
  console.log(
    `Primary: ${manifest.stats.withPrimary}/${manifest.totalSlugs} | Secondary: ${manifest.stats.withSecondary}/${manifest.totalSlugs} | Secondary fallback: ${manifest.stats.secondaryFallbackToPrimary}`
  );
}

main().catch((error) => {
  console.error("download-location-images failed:", error);
  process.exit(1);
});
