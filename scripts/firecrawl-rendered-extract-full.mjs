import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const DEFAULT_INVENTORY_PATH = "data/inventory/canonical-url-inventory.json";
const DEFAULT_LIMIT = 200;
const DEFAULT_CONCURRENCY = 5;
const OUTPUT_ROOT = ".firecrawl/rendered/full";
const MANIFEST_DIR = "data/firecrawl";
const COVERAGE_FILE = "data/firecrawl/coverage-report.json";

function parseArgs(argv) {
  let inventoryPath = DEFAULT_INVENTORY_PATH;
  let limit = DEFAULT_LIMIT;
  let concurrency = DEFAULT_CONCURRENCY;
  let includeProfiles = true;
  let dryRun = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--inventory" && argv[i + 1]) {
      inventoryPath = argv[i + 1].trim();
      i += 1;
      continue;
    }
    if (arg === "--limit" && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0) limit = parsed;
      i += 1;
      continue;
    }
    if (arg === "--concurrency" && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isFinite(parsed) && parsed > 0 && parsed <= 10) concurrency = parsed;
      i += 1;
      continue;
    }
    if (arg === "--exclude-profiles") {
      includeProfiles = false;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
    }
  }

  return { inventoryPath, limit, concurrency, includeProfiles, dryRun };
}

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
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

function isProfileUrl(url) {
  const { pathname } = new URL(url);
  return /^\/(?:en\/)?escorts\/[^/]+$/.test(pathname);
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

function readJsonIfExists(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readInventory(rootDir, inventoryPath, includeProfiles) {
  const payload = readJsonIfExists(path.resolve(rootDir, inventoryPath), { urls: [] });
  const rows = Array.isArray(payload?.urls) ? payload.urls : [];
  return rows
    .filter((row) => row?.url)
    .filter((row) => includeProfiles || !isProfileUrl(row.url))
    .map((row) => ({
      ...row,
      url: normalizeUrl(row.url),
    }));
}

function collectSuccessfulUrlsFromManifests(rootDir) {
  const manifestRoot = path.resolve(rootDir, MANIFEST_DIR);
  if (!fs.existsSync(manifestRoot)) return new Set();

  const files = fs
    .readdirSync(manifestRoot)
    .filter((name) => name.endsWith("-manifest.json"))
    .map((name) => path.join(manifestRoot, name));

  const success = new Set();
  for (const filePath of files) {
    const payload = readJsonIfExists(filePath, {});
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    for (const entry of entries) {
      if (entry?.status === "success" && entry?.url) {
        success.add(normalizeUrl(entry.url));
      }
    }
  }

  return success;
}

function firecrawlScrape(url, outPath) {
  return new Promise((resolve) => {
    ensureDir(outPath);
    const child = spawn(
      "firecrawl",
      ["scrape", url, "-f", "markdown,links", "--only-main-content", "-o", outPath],
      {
        cwd: process.cwd(),
        stdio: "ignore",
      }
    );

    child.on("error", (error) => {
      resolve({ ok: false, error: String(error) });
    });
    child.on("close", (code) => {
      resolve({ ok: code === 0, code });
    });
  });
}

async function runPool(tasks, concurrency, worker) {
  const results = new Array(tasks.length);
  let next = 0;

  async function runWorker() {
    while (true) {
      const index = next;
      next += 1;
      if (index >= tasks.length) break;
      results[index] = await worker(tasks[index], index);
    }
  }

  const size = Math.min(concurrency, tasks.length);
  await Promise.all(Array.from({ length: size }, () => runWorker()));
  return results;
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function buildCoverage(inventoryRows, successfulUrls, includeProfiles) {
  const inventoryUrls = inventoryRows.map((row) => row.url);
  const missing = inventoryRows.filter((row) => !successfulUrls.has(row.url));
  const missingProfiles = missing.filter((row) => isProfileUrl(row.url)).length;

  return {
    generatedAt: new Date().toISOString(),
    scope: includeProfiles ? "all-inventory-urls" : "non-profile-urls",
    totals: {
      inventoryUrls: inventoryUrls.length,
      successfulRenderedExtracts: [...successfulUrls].filter((url) =>
        inventoryUrls.includes(url)
      ).length,
      missingRenderedExtracts: missing.length,
      missingProfileUrls: missingProfiles,
    },
    missing: missing.map((row) => ({
      url: row.url,
      locale: row.locale,
      type: row.type,
      source: row.source,
    })),
  };
}

async function run() {
  const root = process.cwd();
  const { inventoryPath, limit, concurrency, includeProfiles, dryRun } = parseArgs(
    process.argv.slice(2)
  );

  const inventoryRows = readInventory(root, inventoryPath, includeProfiles);
  if (inventoryRows.length === 0) {
    throw new Error("No inventory URLs available. Run `npm run inventory:build` first.");
  }

  const existingSuccess = collectSuccessfulUrlsFromManifests(root);
  const pending = inventoryRows.filter((row) => !existingSuccess.has(row.url));
  const selected = pending.slice(0, limit);

  console.log("Firecrawl full extraction runner");
  console.log(`Inventory scope: ${includeProfiles ? "all URLs" : "excluding profile URLs"}`);
  console.log(`Already successful: ${existingSuccess.size}`);
  console.log(`Pending: ${pending.length}`);
  console.log(`Selected this run: ${selected.length}`);
  console.log(`Concurrency: ${concurrency}`);

  const startedAt = new Date().toISOString();
  const batchId = `full-${startedAt.replace(/[:.]/g, "-")}`;
  const entries = [];

  if (!dryRun && selected.length > 0) {
    const results = await runPool(selected, concurrency, async (row, index) => {
      const fileName = `${slugifyUrl(row.url)}.json`;
      const outPath = path.resolve(root, OUTPUT_ROOT, fileName);
      const res = await firecrawlScrape(row.url, outPath);

      const status = res.ok ? "success" : "failed";
      const entry = {
        url: row.url,
        locale: row.locale,
        type: row.type,
        source: row.source,
        outputFile: path.relative(root, outPath),
        status,
        scrapedAt: new Date().toISOString(),
      };

      const idx = index + 1;
      if (idx % 25 === 0 || idx === selected.length) {
        console.log(`Progress ${idx}/${selected.length}`);
      }
      return entry;
    });

    entries.push(...results);
  } else {
    for (const row of selected) {
      entries.push({
        url: row.url,
        locale: row.locale,
        type: row.type,
        source: row.source,
        outputFile: "",
        status: "skipped-dry-run",
        scrapedAt: new Date().toISOString(),
      });
    }
  }

  const manifestPath = path.resolve(root, MANIFEST_DIR, `${batchId}-manifest.json`);
  writeJson(manifestPath, {
    batch: batchId,
    startedAt,
    completedAt: new Date().toISOString(),
    entries,
  });

  const refreshedSuccess = collectSuccessfulUrlsFromManifests(root);
  const coverage = buildCoverage(inventoryRows, refreshedSuccess, includeProfiles);
  writeJson(path.resolve(root, COVERAGE_FILE), coverage);

  const successCount = entries.filter((entry) => entry.status === "success").length;
  const failCount = entries.filter((entry) => entry.status === "failed").length;

  console.log("");
  console.log(`Batch complete: ${batchId}`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Manifest: ${path.relative(root, manifestPath)}`);
  console.log(`Coverage report: ${COVERAGE_FILE}`);
  console.log(`Remaining missing extracts: ${coverage.totals.missingRenderedExtracts}`);

  if (failCount > 0) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
