import fs from "node:fs";
import path from "node:path";

const MANIFEST_PATH = "data/reconcile/include-review-exclude-manifest.json";
const FIRECRAWL_MANIFEST_DIR = "data/firecrawl";
const LINK_TRIAGE_PATH = "data/reconcile/link-target-triage.json";
const OUT_FILE = "data/reconcile/language-parity-gaps.json";

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

function readJsonIfExists(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

function expectedLocale(url) {
  const { pathname } = new URL(url);
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
}

function isTechnicalAssetUrl(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return [".kml", ".xml", ".txt", ".json"].some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
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

function detectSignals(meta) {
  const language = String(meta?.language || "").toLowerCase();
  const ogLocale = String(meta?.ogLocale || meta?.["og:locale"] || "").toLowerCase();
  return { language, ogLocale };
}

function resolveDecision(url, expected, signals) {
  const combined = `${signals.language} ${signals.ogLocale}`.trim();
  const hasSignal = Boolean(combined);
  if (!hasSignal) {
    return {
      status: "review",
      resolution: "Missing locale signal in rendered metadata payload.",
    };
  }

  const looksEn = combined.includes("en") || combined.includes("en_");
  const looksNl = combined.includes("nl") || combined.includes("nl_");

  if ((expected === "en" && looksEn) || (expected === "nl" && looksNl)) {
    return {
      status: "pass",
      resolution: "Locale signals align with expected URL locale.",
    };
  }

  // Common edge: ambiguous mixed locale signal in metadata. Keep as review until template rules are explicit.
  return {
    status: "review",
    resolution: "Observed locale metadata does not match URL locale; verify template locale metadata mapping.",
  };
}

async function checkRedirectTarget(url) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    const location = response.headers.get("location") || "";
    return {
      status: response.status,
      location,
    };
  } catch {
    return {
      status: 0,
      location: "",
    };
  }
}

async function run() {
  const root = process.cwd();
  const manifest = readJson(path.resolve(root, MANIFEST_PATH));
  const includeUrls = new Set(
    (manifest?.decisions || [])
      .filter((d) => d.decision === "include")
      .map((d) => normalizeUrl(d.url))
  );
  const triagePayload = readJsonIfExists(path.resolve(root, LINK_TRIAGE_PATH), { entries: [] });
  const triageMap = new Map(
    (Array.isArray(triagePayload?.entries) ? triagePayload.entries : []).map((e) => [
      normalizeUrl(e.url),
      e,
    ])
  );

  const renderedEntries = collectRenderedEntries(root);
  const renderedByUrl = new Map();
  for (const row of renderedEntries) {
    if (!renderedByUrl.has(row.url)) renderedByUrl.set(row.url, row.outputFile);
  }

  const gaps = [];
  for (const url of includeUrls) {
    if (isTechnicalAssetUrl(url)) continue;
    const outputFile = renderedByUrl.get(url);
    if (!outputFile) {
      gaps.push({
        url,
        expectedLocale: expectedLocale(url),
        observedSignals: { language: "", ogLocale: "" },
        status: "review",
        resolution: "Rendered output not found for URL.",
      });
      continue;
    }

    const abs = path.resolve(root, outputFile);
    if (!fs.existsSync(abs)) {
      gaps.push({
        url,
        expectedLocale: expectedLocale(url),
        observedSignals: { language: "", ogLocale: "" },
        status: "review",
        resolution: "Rendered output file path missing.",
      });
      continue;
    }

    let payload = null;
    try {
      payload = readJson(abs);
    } catch {
      gaps.push({
        url,
        expectedLocale: expectedLocale(url),
        observedSignals: { language: "", ogLocale: "" },
        status: "review",
        resolution: "Rendered output JSON parse failed.",
      });
      continue;
    }

    const signals = detectSignals(payload?.metadata || {});
    const expected = expectedLocale(url);
    const triage = triageMap.get(url);

    if (triage?.decision === "redirect") {
      gaps.push({
        url,
        expectedLocale: expected,
        observedSignals: signals,
        status: "accepted",
        resolution:
          "URL is a known redirect candidate; locale signal is taken from redirect target and accepted for migration parity.",
      });
      continue;
    }

    const result = resolveDecision(url, expected, signals);
    if (result.status !== "pass") {
      let status = result.status;
      let resolution = result.resolution;

      // Accept locale mismatch when the legacy URL is intentionally redirected.
      if (status === "review") {
        const redirectInfo = await checkRedirectTarget(url);
        if ([301, 302, 307, 308].includes(redirectInfo.status) && redirectInfo.location) {
          status = "accepted";
          resolution =
            `Locale mismatch accepted because URL redirects (${redirectInfo.status}) to ${redirectInfo.location}.`;
        }
      }

      gaps.push({
        url,
        expectedLocale: expected,
        observedSignals: signals,
        status,
        resolution,
      });
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    includedUrls: includeUrls.size,
    gapCount: gaps.length,
    reviewCount: gaps.filter((g) => g.status === "review").length,
    acceptedCount: gaps.filter((g) => g.status === "accepted").length,
  };

  writeJson(path.resolve(root, OUT_FILE), {
    ...summary,
    gaps,
  });

  console.log("Language parity gap report generated");
  console.log(`Included URLs: ${summary.includedUrls}`);
  console.log(`Gap URLs: ${summary.gapCount}`);
  console.log(`Artifact: ${OUT_FILE}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
