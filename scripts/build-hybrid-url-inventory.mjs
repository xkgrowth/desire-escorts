import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { loadProjectEnv } from "./wp-utils.mjs";

const DEFAULT_DOMAIN = "https://desire-escorts.nl";
const SITEMAP_CANDIDATES = [
  "/sitemap_index.xml",
  "/wp-sitemap.xml",
];

function parseArgs(argv) {
  let baseUrl = "";
  let sitemapUrl = "";
  let outDir = "data/inventory";
  let firecrawlLimit = 5000;
  let firecrawlOut = ".firecrawl/map-desire-escorts.json";
  let skipFirecrawl = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base-url" && argv[i + 1]) {
      baseUrl = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--sitemap-url" && argv[i + 1]) {
      sitemapUrl = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--out-dir" && argv[i + 1]) {
      outDir = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--firecrawl-limit" && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        firecrawlLimit = parsed;
      }
      i += 1;
      continue;
    }
    if (arg === "--firecrawl-out" && argv[i + 1]) {
      firecrawlOut = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--skip-firecrawl") {
      skipFirecrawl = true;
    }
  }

  return {
    baseUrl,
    sitemapUrl,
    outDir,
    firecrawlLimit,
    firecrawlOut,
    skipFirecrawl,
  };
}

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeUrl(input, preferredHost = "desire-escorts.nl") {
  const url = new URL(input);
  const host = url.hostname.replace(/^www\./i, "");
  url.protocol = "https:";
  url.hostname = host || preferredHost;
  url.port = "";
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "");
  if (!url.pathname) url.pathname = "/";
  return url.toString();
}

function localeFromUrl(input) {
  const { pathname } = new URL(input);
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
}

function inferType(input) {
  const { pathname } = new URL(input);
  if (pathname === "/") return "home";

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "home";
  if (parts[0] === "en") return parts[1] || "en-home";
  return parts[0];
}

function extractLocUrls(xml) {
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim()).filter(Boolean);
}

function isXmlLike(text) {
  return text.includes("<urlset") || text.includes("<sitemapindex");
}

async function fetchXml(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  if (!isXmlLike(text)) {
    throw new Error(`Unexpected non-XML response from ${url}`);
  }
  return text;
}

async function discoverSitemapTree(entryUrl, preferredHost) {
  const visited = new Set();
  const queue = [entryUrl];
  const pageUrls = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const xml = await fetchXml(current);
    const urls = extractLocUrls(xml);

    if (xml.includes("<sitemapindex")) {
      for (const loc of urls) {
        if (!visited.has(loc)) queue.push(loc);
      }
    } else {
      for (const loc of urls) {
        try {
          pageUrls.add(normalizeUrl(loc, preferredHost));
        } catch {
          // Skip malformed URL entries.
        }
      }
    }
  }

  return { visitedSitemaps: [...visited], pageUrls: [...pageUrls] };
}

async function getSitemapDiscovery(baseUrl, sitemapUrl) {
  const preferredHost = new URL(baseUrl).hostname.replace(/^www\./i, "");

  if (sitemapUrl) {
    const discovered = await discoverSitemapTree(sitemapUrl, preferredHost);
    return {
      entrySitemap: sitemapUrl,
      ...discovered,
    };
  }

  for (const suffix of SITEMAP_CANDIDATES) {
    const candidate = `${baseUrl}${suffix}`;
    try {
      const discovered = await discoverSitemapTree(candidate, preferredHost);
      return {
        entrySitemap: candidate,
        ...discovered,
      };
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(
    "Unable to fetch sitemap from default candidates. Pass --sitemap-url explicitly."
  );
}

function runFirecrawlMap(baseUrl, outPath, limit) {
  ensureDir(outPath);
  const result = spawnSync(
    "firecrawl",
    ["map", baseUrl, "--limit", String(limit), "--json", "-o", outPath],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    }
  );

  if (result.status !== 0) {
    throw new Error(`Firecrawl map failed with exit code ${result.status}`);
  }
}

function toUrlArray(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object") {
        if (typeof entry.url === "string") return entry.url;
        if (typeof entry.href === "string") return entry.href;
        if (typeof entry.link === "string") return entry.link;
      }
      return "";
    })
    .filter(Boolean);
}

function extractFirecrawlUrls(payload) {
  const candidates = [
    toUrlArray(payload),
    toUrlArray(payload?.links),
    toUrlArray(payload?.urls),
    toUrlArray(payload?.data),
    toUrlArray(payload?.data?.links),
    toUrlArray(payload?.data?.urls),
    toUrlArray(payload?.results),
    toUrlArray(payload?.result),
  ];

  const flat = candidates.flat();
  return [...new Set(flat)];
}

function buildInventory({ baseUrl, sitemapUrls, firecrawlUrls }) {
  const preferredHost = new URL(baseUrl).hostname.replace(/^www\./i, "");
  const rows = new Map();

  function upsert(sourceUrls, sourceKey) {
    for (const sourceUrl of sourceUrls) {
      let canonical = "";
      try {
        canonical = normalizeUrl(sourceUrl, preferredHost);
      } catch {
        continue;
      }

      const existing = rows.get(canonical) || {
        url: canonical,
        locale: localeFromUrl(canonical),
        type: inferType(canonical),
        fromSitemap: false,
        fromFirecrawl: false,
      };

      if (sourceKey === "sitemap") existing.fromSitemap = true;
      if (sourceKey === "firecrawl") existing.fromFirecrawl = true;

      rows.set(canonical, existing);
    }
  }

  upsert(sitemapUrls, "sitemap");
  upsert(firecrawlUrls, "firecrawl");

  const inventory = [...rows.values()]
    .map((item) => ({
      ...item,
      source:
        item.fromSitemap && item.fromFirecrawl
          ? "both"
          : item.fromSitemap
            ? "fromSitemap"
            : "fromFirecrawl",
    }))
    .sort((a, b) => a.url.localeCompare(b.url));

  // Review queue should focus on URLs discovered outside sitemap intent.
  const reviewQueue = inventory
    .filter((item) => item.source === "fromFirecrawl")
    .map((item) => ({
      ...item,
      reviewReason: "Discovered by Firecrawl but missing from sitemap baseline",
    }));
  return { inventory, reviewQueue };
}

function summarize(inventory, reviewQueue) {
  const byLocale = {
    nl: inventory.filter((item) => item.locale === "nl").length,
    en: inventory.filter((item) => item.locale === "en").length,
  };

  const bySource = {
    fromSitemap: inventory.filter((item) => item.source === "fromSitemap").length,
    fromFirecrawl: inventory.filter((item) => item.source === "fromFirecrawl").length,
    both: inventory.filter((item) => item.source === "both").length,
  };

  return {
    totalCanonicalUrls: inventory.length,
    localeBreakdown: byLocale,
    sourceBreakdown: bySource,
    reviewQueueCount: reviewQueue.length,
  };
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function run() {
  loadProjectEnv();

  const args = parseArgs(process.argv.slice(2));
  const baseUrl = (args.baseUrl || process.env.WP_BASE_URL || DEFAULT_DOMAIN).replace(/\/+$/, "");
  const outDir = path.resolve(process.cwd(), args.outDir);
  const firecrawlOutPath = path.resolve(process.cwd(), args.firecrawlOut);
  ensureDir(outDir, true);

  console.log("Building hybrid URL inventory");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Output dir: ${path.relative(process.cwd(), outDir)}`);
  console.log("");

  console.log("1/3 Discovering sitemap URLs...");
  const sitemap = await getSitemapDiscovery(baseUrl, args.sitemapUrl);

  let firecrawlUrls = [];
  if (!args.skipFirecrawl) {
    console.log("2/3 Running Firecrawl map...");
    runFirecrawlMap(baseUrl, firecrawlOutPath, args.firecrawlLimit);
    const firecrawlRaw = JSON.parse(fs.readFileSync(firecrawlOutPath, "utf8"));
    firecrawlUrls = extractFirecrawlUrls(firecrawlRaw);
  } else {
    console.log("2/3 Skipping Firecrawl map by flag.");
  }

  console.log("3/3 Merging canonical inventory...");
  const { inventory, reviewQueue } = buildInventory({
    baseUrl,
    sitemapUrls: sitemap.pageUrls,
    firecrawlUrls,
  });
  const summary = summarize(inventory, reviewQueue);

  const sitemapArtifact = {
    generatedAt: new Date().toISOString(),
    entrySitemap: sitemap.entrySitemap,
    scannedSitemaps: sitemap.visitedSitemaps.length,
    pageUrlCount: sitemap.pageUrls.length,
    visitedSitemaps: sitemap.visitedSitemaps,
  };

  writeJson(path.join(outDir, "sitemap-discovery.json"), sitemapArtifact);
  writeJson(path.join(outDir, "canonical-url-inventory.json"), {
    generatedAt: new Date().toISOString(),
    baseUrl,
    urls: inventory,
  });
  writeJson(path.join(outDir, "review-queue.json"), {
    generatedAt: new Date().toISOString(),
    baseUrl,
    urls: reviewQueue,
  });
  writeJson(path.join(outDir, "inventory-summary.json"), {
    generatedAt: new Date().toISOString(),
    baseUrl,
    ...summary,
  });

  console.log("");
  console.log("Hybrid inventory complete");
  console.log(`Sitemap pages: ${sitemap.pageUrls.length}`);
  console.log(`Firecrawl discovered: ${firecrawlUrls.length}`);
  console.log(`Canonical URLs: ${summary.totalCanonicalUrls}`);
  console.log(
    `Sources - sitemap:${summary.sourceBreakdown.fromSitemap}, firecrawl:${summary.sourceBreakdown.fromFirecrawl}, both:${summary.sourceBreakdown.both}`
  );
  console.log(`Locales - nl:${summary.localeBreakdown.nl}, en:${summary.localeBreakdown.en}`);
  console.log(`Review queue: ${summary.reviewQueueCount}`);
  console.log(`Artifacts: ${path.relative(process.cwd(), outDir)}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
