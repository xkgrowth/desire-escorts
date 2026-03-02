import fs from "node:fs";
import path from "node:path";

const DEFAULT_SITEMAP_CANDIDATES = [
  "https://desire-escorts.nl/sitemap_index.xml",
  "https://desire-escorts.nl/wp-sitemap.xml",
];

function parseArgs(argv) {
  let outFile = "data/wordpress/sitemap-validation.json";
  let sitemapUrl = "";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out-file" && argv[i + 1]) {
      outFile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--sitemap-url" && argv[i + 1]) {
      sitemapUrl = argv[i + 1].trim();
      i += 1;
    }
  }

  return { outFile, sitemapUrl };
}

function normalizeUrl(input) {
  const url = new URL(input);
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

async function discoverSitemapTree(entryUrl) {
  const visited = new Set();
  const queue = [entryUrl];
  const urlPages = new Set();

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
        urlPages.add(normalizeUrl(loc));
      }
    }
  }

  return { visitedSitemaps: [...visited], pageUrls: [...urlPages] };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getExportLinks(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = readJson(filePath);
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => item?.link)
    .filter(Boolean)
    .map((link) => normalizeUrl(link));
}

function buildComparison(locale, sitemapUrls, exportUrls) {
  const sitemapSet = new Set(sitemapUrls.filter((url) => localeFromUrl(url) === locale));
  const exportSet = new Set(exportUrls.filter((url) => localeFromUrl(url) === locale));

  const missingInExport = [...sitemapSet].filter((url) => !exportSet.has(url));
  const extraInExport = [...exportSet].filter((url) => !sitemapSet.has(url));

  return {
    locale,
    sitemapCount: sitemapSet.size,
    exportCount: exportSet.size,
    missingInExportCount: missingInExport.length,
    extraInExportCount: extraInExport.length,
    missingInExport: missingInExport.slice(0, 200),
    extraInExport: extraInExport.slice(0, 200),
  };
}

async function getSitemapUrls(sitemapUrlArg) {
  if (sitemapUrlArg) {
    return {
      entrySitemap: sitemapUrlArg,
      ...(await discoverSitemapTree(sitemapUrlArg)),
    };
  }

  for (const candidate of DEFAULT_SITEMAP_CANDIDATES) {
    try {
      const discovered = await discoverSitemapTree(candidate);
      return { entrySitemap: candidate, ...discovered };
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(
    "Unable to fetch sitemap from default candidates. Pass --sitemap-url explicitly."
  );
}

async function run() {
  const { outFile, sitemapUrl } = parseArgs(process.argv.slice(2));
  const root = process.cwd();

  const sitemap = await getSitemapUrls(sitemapUrl);
  const sitemapUrls = sitemap.pageUrls;

  const nlExport = [
    ...getExportLinks(path.join(root, "data/wordpress/nl/pages.json")),
    ...getExportLinks(path.join(root, "data/wordpress/nl/posts.json")),
  ];
  const enExport = [
    ...getExportLinks(path.join(root, "data/wordpress/en/pages.json")),
    ...getExportLinks(path.join(root, "data/wordpress/en/posts.json")),
  ];

  const comparisonNl = buildComparison("nl", sitemapUrls, nlExport);
  const comparisonEn = buildComparison("en", sitemapUrls, enExport);

  const result = {
    generatedAt: new Date().toISOString(),
    entrySitemap: sitemap.entrySitemap,
    scannedSitemaps: sitemap.visitedSitemaps.length,
    sitemapUrlCount: sitemapUrls.length,
    comparisons: {
      nl: comparisonNl,
      en: comparisonEn,
    },
  };

  const outputPath = path.resolve(root, outFile);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");

  console.log("Sitemap validation complete");
  console.log(`Entry sitemap: ${result.entrySitemap}`);
  console.log(`Scanned sitemaps: ${result.scannedSitemaps}`);
  console.log(`Sitemap URLs (total): ${result.sitemapUrlCount}`);
  console.log(
    `NL - sitemap:${comparisonNl.sitemapCount} export:${comparisonNl.exportCount} missing:${comparisonNl.missingInExportCount} extra:${comparisonNl.extraInExportCount}`
  );
  console.log(
    `EN - sitemap:${comparisonEn.sitemapCount} export:${comparisonEn.exportCount} missing:${comparisonEn.missingInExportCount} extra:${comparisonEn.extraInExportCount}`
  );
  console.log(`Report: ${path.relative(root, outputPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
