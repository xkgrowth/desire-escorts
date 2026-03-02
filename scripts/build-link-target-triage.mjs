import fs from "node:fs";
import path from "node:path";

const STATUS_INPUT = "data/reconcile/unresolved-link-http-status.json";
const TRIAGE_OUT = "data/reconcile/link-target-triage.json";
const REDIRECT_OUT = "data/reconcile/redirect-candidates.json";
const INVENTORY_PATH = "data/inventory/canonical-url-inventory.json";

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

function classify(entry) {
  const source = normalizeUrl(entry.url);
  const location = entry.location ? normalizeUrl(entry.location) : "";
  const pathname = new URL(source).pathname;

  if (entry.status === 200) {
    return {
      decision: "include",
      target: source,
      reason: "URL resolves directly with 200 and should be included in scope.",
    };
  }

  if (entry.status === 301) {
    if (pathname.startsWith("/author/") || pathname.startsWith("/en/author/")) {
      return {
        decision: "ignore",
        target: location || source,
        reason: "Author archive URL treated as out-of-scope for Phase 1 parity migration pages.",
      };
    }

    if (pathname.startsWith("/de/")) {
      return {
        decision: "ignore",
        target: location || source,
        reason: "Non-target locale route (DE) is out-of-scope for NL/EN migration.",
      };
    }

    if (location === "https://desire-escorts.nl" || location === "https://desire-escorts.nl/en") {
      return {
        decision: "redirect",
        target: location,
        reason: "Legacy URL currently redirects to home and should be tracked as redirect candidate.",
      };
    }

    if (location && location !== source) {
      return {
        decision: "redirect",
        target: location,
        reason: "URL has canonical redirect target and should be captured in redirect matrix.",
      };
    }

    return {
      decision: "include",
      target: source,
      reason: "Redirect normalizes URL form (e.g. trailing slash); include canonical path in scope.",
    };
  }

  return {
    decision: "review",
    target: location || source,
    reason: "Non-standard response status requires manual review.",
  };
}

async function run() {
  const root = process.cwd();
  const statusPayload = readJson(path.resolve(root, STATUS_INPUT));
  const inventoryPayload = readJson(path.resolve(root, INVENTORY_PATH));
  const inventorySet = new Set((inventoryPayload?.urls || []).map((row) => normalizeUrl(row.url)));
  const rows = Array.isArray(statusPayload?.results) ? statusPayload.results : [];

  const triage = rows.map((entry) => {
    const source = normalizeUrl(entry.url);
    const base = classify(entry);
    return {
      url: source,
      httpStatus: entry.status,
      observedLocation: entry.location || "",
      decision: base.decision,
      target: base.target,
      reason: base.reason,
      inCurrentInventory: inventorySet.has(source),
      targetInCurrentInventory: inventorySet.has(base.target),
      owner: "migration-engineering",
    };
  });

  const redirects = triage
    .filter((row) => row.decision === "redirect")
    .map((row) => ({
      sourceUrl: row.url,
      targetUrl: row.target,
      reason: row.reason,
      statusCode: 301,
    }));

  const summary = {
    generatedAt: new Date().toISOString(),
    counts: {
      total: triage.length,
      include: triage.filter((r) => r.decision === "include").length,
      redirect: triage.filter((r) => r.decision === "redirect").length,
      ignore: triage.filter((r) => r.decision === "ignore").length,
      review: triage.filter((r) => r.decision === "review").length,
    },
  };

  writeJson(path.resolve(root, TRIAGE_OUT), {
    ...summary,
    entries: triage,
  });
  writeJson(path.resolve(root, REDIRECT_OUT), {
    generatedAt: summary.generatedAt,
    count: redirects.length,
    redirects,
  });

  console.log("Link target triage complete");
  console.log(
    `Decisions - include:${summary.counts.include} redirect:${summary.counts.redirect} ignore:${summary.counts.ignore} review:${summary.counts.review}`
  );
  console.log(`Artifacts: ${TRIAGE_OUT}, ${REDIRECT_OUT}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
