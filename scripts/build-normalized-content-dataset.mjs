import fs from "node:fs";
import path from "node:path";

const DEFAULT_INVENTORY_PATH = "data/inventory/canonical-url-inventory.json";
const OUT_DATASET = "data/reconcile/normalized-content-dataset.json";
const OUT_SUMMARY = "data/reconcile/provenance-summary.json";

function normalizeUrl(input) {
  const url = new URL(input);
  url.protocol = "https:";
  url.hostname = url.hostname.replace(/^www\./i, "");
  url.port = "";
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "");
  if (!url.pathname) url.pathname = "/";
  return url.toString();
}

function readJsonIfExists(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

function isProfileUrl(url) {
  const { pathname } = new URL(url);
  return /^\/(?:en\/)?escorts\/[^/]+$/.test(pathname);
}

function inferEntityKind(url, wpType = "") {
  if (isProfileUrl(url)) return "profile";
  if (wpType === "page") return "page";
  if (wpType === "post") return "post";
  return "unknown";
}

function collectWpEntries(rootDir) {
  const candidates = [
    { locale: "nl", type: "page", file: "data/wordpress/nl/pages.json", provenance: "wpApi" },
    { locale: "nl", type: "post", file: "data/wordpress/nl/posts.json", provenance: "wpApi" },
    { locale: "en", type: "page", file: "data/wordpress/en/pages.json", provenance: "wpApi" },
    { locale: "en", type: "post", file: "data/wordpress/en/posts.json", provenance: "wpApi" },
    { locale: "unknown", type: "page", file: "data/wordpress/pages.json", provenance: "wpLegacyExport" },
    { locale: "unknown", type: "post", file: "data/wordpress/posts.json", provenance: "wpLegacyExport" },
  ];

  const rows = [];
  for (const candidate of candidates) {
    const absolute = path.resolve(rootDir, candidate.file);
    const items = readJsonIfExists(absolute, []);
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      if (!item?.link) continue;
      let canonical = "";
      try {
        canonical = normalizeUrl(item.link);
      } catch {
        continue;
      }

      rows.push({
        canonicalUrl: canonical,
        locale: candidate.locale === "unknown" ? inferLocale(canonical) : candidate.locale,
        wpType: candidate.type,
        provenance: candidate.provenance,
        id: item.id || null,
        status: item.status || null,
        slug: item.slug || null,
        title: item?.title?.rendered || "",
        modified: item.modified_gmt || item.modified || null,
      });
    }
  }

  return rows;
}

function inferLocale(url) {
  const { pathname } = new URL(url);
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
}

function collectFirecrawlEntries(rootDir) {
  const dir = path.resolve(rootDir, "data/firecrawl");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith("-manifest.json"))
    .map((name) => path.join(dir, name));

  const rows = [];
  for (const filePath of files) {
    const payload = readJsonIfExists(filePath, {});
    const batch = payload?.batch || path.basename(filePath, ".json");
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];

    for (const entry of entries) {
      if (!entry?.url) continue;
      let canonical = "";
      try {
        canonical = normalizeUrl(entry.url);
      } catch {
        continue;
      }
      rows.push({
        canonicalUrl: canonical,
        batch,
        status: entry.status || "unknown",
        outputFile: entry.outputFile || "",
        scrapedAt: entry.scrapedAt || null,
      });
    }
  }

  return rows;
}

function buildDataset(inventoryRows, wpRows, firecrawlRows) {
  const wpByUrl = new Map();
  const firecrawlByUrl = new Map();

  for (const row of wpRows) {
    if (!wpByUrl.has(row.canonicalUrl)) wpByUrl.set(row.canonicalUrl, []);
    wpByUrl.get(row.canonicalUrl).push(row);
  }

  for (const row of firecrawlRows) {
    if (!firecrawlByUrl.has(row.canonicalUrl)) firecrawlByUrl.set(row.canonicalUrl, []);
    firecrawlByUrl.get(row.canonicalUrl).push(row);
  }

  const dataset = [];
  for (const inv of inventoryRows) {
    const wpMatches = wpByUrl.get(inv.url) || [];
    const firecrawlMatches = firecrawlByUrl.get(inv.url) || [];

    const wpApiMatches = wpMatches.filter((row) => row.provenance === "wpApi");
    const wpLegacyMatches = wpMatches.filter((row) => row.provenance === "wpLegacyExport");
    const successfulFirecrawl = firecrawlMatches.filter((row) => row.status === "success");

    const bestWp = wpApiMatches[0] || wpLegacyMatches[0] || null;
    const authority = isProfileUrl(inv.url) ? "strapi" : "wordpress";
    const entityKind = inferEntityKind(inv.url, bestWp?.wpType || "");

    dataset.push({
      url: inv.url,
      locale: inv.locale,
      type: inv.type,
      sourceFlags: {
        fromSitemap: inv.fromSitemap,
        fromFirecrawl: inv.fromFirecrawl,
        source: inv.source,
      },
      routing: {
        parityIntent: "keep-url",
      },
      contentAuthority: {
        primary: authority,
        rule:
          authority === "strapi"
            ? "profile routes are Strapi-led; WordPress products are migration reference only"
            : "non-profile pages/posts are WordPress-led migration sources",
      },
      provenance: {
        wpApi: wpApiMatches.length > 0,
        wpLegacyExport: wpLegacyMatches.length > 0,
        firecrawlRendered: successfulFirecrawl.length > 0,
      },
      entityKind,
      wp: bestWp
        ? {
            id: bestWp.id,
            type: bestWp.wpType,
            status: bestWp.status,
            slug: bestWp.slug,
            title: bestWp.title,
            modified: bestWp.modified,
          }
        : null,
      firecrawl: successfulFirecrawl.length
        ? {
            batches: [...new Set(successfulFirecrawl.map((row) => row.batch))],
            outputs: successfulFirecrawl.map((row) => row.outputFile),
            latestScrapedAt: successfulFirecrawl
              .map((row) => row.scrapedAt)
              .filter(Boolean)
              .sort()
              .at(-1),
          }
        : null,
    });
  }

  return dataset;
}

function buildSummary(dataset) {
  const total = dataset.length;
  const byAuthority = {
    strapi: dataset.filter((row) => row.contentAuthority.primary === "strapi").length,
    wordpress: dataset.filter((row) => row.contentAuthority.primary === "wordpress").length,
  };
  const byEntityKind = {
    profile: dataset.filter((row) => row.entityKind === "profile").length,
    page: dataset.filter((row) => row.entityKind === "page").length,
    post: dataset.filter((row) => row.entityKind === "post").length,
    unknown: dataset.filter((row) => row.entityKind === "unknown").length,
  };
  const provenanceCoverage = {
    wpApi: dataset.filter((row) => row.provenance.wpApi).length,
    wpLegacyExport: dataset.filter((row) => row.provenance.wpLegacyExport).length,
    firecrawlRendered: dataset.filter((row) => row.provenance.firecrawlRendered).length,
  };
  const localeBreakdown = {
    nl: dataset.filter((row) => row.locale === "nl").length,
    en: dataset.filter((row) => row.locale === "en").length,
  };

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      urls: total,
      byAuthority,
      byEntityKind,
      localeBreakdown,
    },
    coverage: provenanceCoverage,
  };
}

function writeJson(filePath, payload) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function run() {
  const root = process.cwd();
  const inventoryPayload = readJsonIfExists(
    path.resolve(root, DEFAULT_INVENTORY_PATH),
    { urls: [] }
  );
  const inventoryRows = Array.isArray(inventoryPayload.urls) ? inventoryPayload.urls : [];
  if (inventoryRows.length === 0) {
    throw new Error("Inventory is empty. Run `npm run inventory:build` first.");
  }

  const wpRows = collectWpEntries(root);
  const firecrawlRows = collectFirecrawlEntries(root);
  const dataset = buildDataset(inventoryRows, wpRows, firecrawlRows);
  const summary = buildSummary(dataset);

  writeJson(path.resolve(root, OUT_DATASET), {
    generatedAt: new Date().toISOString(),
    source: "inventory+wordpress+firecrawl",
    records: dataset,
  });
  writeJson(path.resolve(root, OUT_SUMMARY), summary);

  console.log("Normalized dataset built");
  console.log(`Records: ${dataset.length}`);
  console.log(`Authority - Strapi: ${summary.totals.byAuthority.strapi}, WordPress: ${summary.totals.byAuthority.wordpress}`);
  console.log(`Coverage - WP API: ${summary.coverage.wpApi}, Firecrawl rendered: ${summary.coverage.firecrawlRendered}`);
  console.log(`Artifacts: ${OUT_DATASET}, ${OUT_SUMMARY}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
