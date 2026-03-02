import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULT_INVENTORY_PATH = "data/inventory/canonical-url-inventory.json";
const DEFAULT_BATCH = "core-pilot";
const DEFAULT_LIMIT = 12;

function parseArgs(argv) {
  let inventoryPath = DEFAULT_INVENTORY_PATH;
  let batch = DEFAULT_BATCH;
  let limit = DEFAULT_LIMIT;
  let outputDir = ".firecrawl/rendered";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--inventory" && argv[i + 1]) {
      inventoryPath = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--batch" && argv[i + 1]) {
      batch = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--limit" && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        limit = parsed;
      }
      i += 1;
      continue;
    }
    if (arg === "--output-dir" && argv[i + 1]) {
      outputDir = argv[i + 1].trim();
      i += 1;
    }
  }

  return { inventoryPath, batch, limit, outputDir };
}

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugifyUrl(url) {
  const parsed = new URL(url);
  const raw = `${parsed.hostname}${parsed.pathname === "/" ? "/home" : parsed.pathname}`;
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9/.-]/g, "-")
    .replace(/\//g, "__")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

function readInventory(inventoryPath) {
  const absolute = path.resolve(process.cwd(), inventoryPath);
  const payload = JSON.parse(fs.readFileSync(absolute, "utf8"));
  return payload.urls || [];
}

function selectCorePilotUrls(urlRows, limit) {
  const byUrl = new Map(urlRows.map((row) => [row.url, row]));
  const selected = [];

  const preferred = [
    "https://desire-escorts.nl/",
    "https://desire-escorts.nl/en",
    "https://desire-escorts.nl/alle-escorts",
    "https://desire-escorts.nl/en/escorts",
    "https://desire-escorts.nl/blog",
    "https://desire-escorts.nl/en/blog",
    "https://desire-escorts.nl/contact",
    "https://desire-escorts.nl/en/contact",
    "https://desire-escorts.nl/24-uurs-escort",
    "https://desire-escorts.nl/en/24-hours-escort",
    "https://desire-escorts.nl/bdsm-escorts",
    "https://desire-escorts.nl/en/bdsm-escorts",
    "https://desire-escorts.nl/business-escort",
    "https://desire-escorts.nl/en/business-escort",
  ];

  for (const url of preferred) {
    if (selected.length >= limit) break;
    const row = byUrl.get(url);
    if (row) selected.push(row);
  }

  if (selected.length < limit) {
    const fallback = urlRows
      .filter((row) => row.source === "both")
      .filter((row) => !selected.some((x) => x.url === row.url))
      .slice(0, limit - selected.length);
    selected.push(...fallback);
  }

  return selected;
}

function runFirecrawlScrape(url, outPath) {
  ensureDir(outPath);
  const result = spawnSync(
    "firecrawl",
    ["scrape", url, "-f", "markdown,links", "--only-main-content", "-o", outPath],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    }
  );

  return result.status === 0;
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function run() {
  const { inventoryPath, batch, limit, outputDir } = parseArgs(process.argv.slice(2));
  const urls = readInventory(inventoryPath);
  const selected = selectCorePilotUrls(urls, limit);

  if (selected.length === 0) {
    throw new Error("No URLs selected for extraction. Check inventory artifact.");
  }

  const runDir = path.resolve(process.cwd(), outputDir, batch);
  ensureDir(runDir, true);
  const startedAt = new Date().toISOString();
  const manifestEntries = [];

  console.log("Running Firecrawl rendered extraction");
  console.log(`Batch: ${batch}`);
  console.log(`Selected URLs: ${selected.length}`);

  for (const row of selected) {
    const fileName = `${slugifyUrl(row.url)}.json`;
    const outPath = path.join(runDir, fileName);
    const ok = runFirecrawlScrape(row.url, outPath);

    manifestEntries.push({
      url: row.url,
      locale: row.locale,
      type: row.type,
      source: row.source,
      outputFile: path.relative(process.cwd(), outPath),
      status: ok ? "success" : "failed",
      scrapedAt: new Date().toISOString(),
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    startedAt,
    batch,
    selectedCount: selected.length,
    successCount: manifestEntries.filter((item) => item.status === "success").length,
    failureCount: manifestEntries.filter((item) => item.status === "failed").length,
  };

  const manifestPath = path.resolve(process.cwd(), "data/firecrawl", `${batch}-manifest.json`);
  const summaryPath = path.resolve(process.cwd(), "data/firecrawl", `${batch}-summary.json`);
  writeJson(manifestPath, { batch, entries: manifestEntries });
  writeJson(summaryPath, summary);

  console.log("");
  console.log("Firecrawl rendered extraction complete");
  console.log(`Success: ${summary.successCount}, Failed: ${summary.failureCount}`);
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Summary: ${path.relative(process.cwd(), summaryPath)}`);

  if (summary.failureCount > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
