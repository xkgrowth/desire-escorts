import fs from "node:fs";
import path from "node:path";

const MANIFEST_PATH = "data/reconcile/include-review-exclude-manifest.json";
const DATASET_PATH = "data/reconcile/normalized-content-dataset.json";
const FIRECRAWL_MANIFEST_DIR = "data/firecrawl";
const OUT_FILE = "data/reconcile/metadata-parity-gaps.json";

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, payload) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
}

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

function collectRenderedEntries(rootDir) {
  const manifestDir = path.resolve(rootDir, FIRECRAWL_MANIFEST_DIR);
  if (!fs.existsSync(manifestDir)) return [];

  const files = fs
    .readdirSync(manifestDir)
    .filter((name) => name.endsWith("-manifest.json"))
    .map((name) => path.join(manifestDir, name));

  const rows = [];
  for (const filePath of files) {
    const payload = readJson(filePath);
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    for (const entry of entries) {
      if (entry?.status !== "success" || !entry?.url || !entry?.outputFile) continue;
      rows.push({
        url: normalizeUrl(entry.url),
        outputFile: entry.outputFile,
      });
    }
  }
  return rows;
}

function metadataFromPayload(payload) {
  const meta = payload?.metadata || {};
  const title = meta?.title || meta?.ogTitle || meta?.["og:title"] || "";
  const description = meta?.description || meta?.ogDescription || meta?.["og:description"] || "";
  const robots = meta?.robots || "";
  const canonicalLike =
    meta?.canonical || meta?.ogUrl || meta?.["og:url"] || meta?.url || meta?.sourceURL || "";
  return { title, description, robots, canonicalLike };
}

function expectedSourceFor(record) {
  if (!record) return "template";
  const authority = record?.contentAuthority?.primary || "template";
  if (authority === "strapi") return "strapi";
  if (authority === "wordpress") return "wp";
  return "template";
}

function isTechnicalAssetUrl(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return [".kml", ".xml", ".txt", ".json"].some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

async function run() {
  const root = process.cwd();
  const manifest = readJson(path.resolve(root, MANIFEST_PATH));
  const dataset = readJson(path.resolve(root, DATASET_PATH));
  const includeUrls = new Set(
    (manifest?.decisions || [])
      .filter((d) => d.decision === "include")
      .map((d) => normalizeUrl(d.url))
  );

  const datasetByUrl = new Map(
    (dataset?.records || []).map((record) => [normalizeUrl(record.url), record])
  );

  const renderedEntries = collectRenderedEntries(root);
  const renderedByUrl = new Map();
  for (const row of renderedEntries) {
    if (!renderedByUrl.has(row.url)) renderedByUrl.set(row.url, row.outputFile);
  }

  const gaps = [];
  const exemptedTechnicalAssets = [];
  for (const url of includeUrls) {
    if (isTechnicalAssetUrl(url)) {
      exemptedTechnicalAssets.push(url);
      continue;
    }

    const outputFile = renderedByUrl.get(url);
    if (!outputFile) {
      gaps.push({
        url,
        missingKeys: ["title", "description", "robots", "canonicalLike"],
        expectedSource: expectedSourceFor(datasetByUrl.get(url)),
        actionOwner: "seo-qa",
        note: "Rendered extract missing for URL (unexpected; verify extraction manifests).",
      });
      continue;
    }

    const absoluteOutput = path.resolve(root, outputFile);
    if (!fs.existsSync(absoluteOutput)) {
      gaps.push({
        url,
        missingKeys: ["title", "description", "robots", "canonicalLike"],
        expectedSource: expectedSourceFor(datasetByUrl.get(url)),
        actionOwner: "seo-qa",
        note: "Referenced rendered output file not found.",
      });
      continue;
    }

    let payload = null;
    try {
      payload = readJson(absoluteOutput);
    } catch {
      gaps.push({
        url,
        missingKeys: ["title", "description", "robots", "canonicalLike"],
        expectedSource: expectedSourceFor(datasetByUrl.get(url)),
        actionOwner: "seo-qa",
        note: "Rendered output JSON could not be parsed.",
      });
      continue;
    }

    const meta = metadataFromPayload(payload);
    const missingKeys = [];
    if (!meta.title) missingKeys.push("title");
    if (!meta.description) missingKeys.push("description");
    if (!meta.robots) missingKeys.push("robots");
    if (!meta.canonicalLike) missingKeys.push("canonicalLike");

    if (missingKeys.length > 0) {
      gaps.push({
        url,
        missingKeys,
        expectedSource: expectedSourceFor(datasetByUrl.get(url)),
        actionOwner: "seo-qa",
        note: "Missing metadata keys in rendered extraction payload.",
      });
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    includedUrls: includeUrls.size,
    gapCount: gaps.length,
    byMissingKey: {
      title: gaps.filter((g) => g.missingKeys.includes("title")).length,
      description: gaps.filter((g) => g.missingKeys.includes("description")).length,
      robots: gaps.filter((g) => g.missingKeys.includes("robots")).length,
      canonicalLike: gaps.filter((g) => g.missingKeys.includes("canonicalLike")).length,
    },
    technicalAssetExemptions: exemptedTechnicalAssets.length,
  };

  writeJson(path.resolve(root, OUT_FILE), {
    ...summary,
    exemptedTechnicalAssets,
    gaps,
  });

  console.log("Metadata parity gap report generated");
  console.log(`Included URLs: ${summary.includedUrls}`);
  console.log(`Gap URLs: ${summary.gapCount}`);
  console.log(
    `Missing keys - title:${summary.byMissingKey.title} description:${summary.byMissingKey.description} robots:${summary.byMissingKey.robots} canonicalLike:${summary.byMissingKey.canonicalLike}`
  );
  console.log(`Artifact: ${OUT_FILE}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
