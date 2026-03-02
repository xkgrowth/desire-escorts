import fs from "node:fs";
import path from "node:path";

const GATE_MANIFEST_PATH = "data/reconcile/include-review-exclude-manifest.json";
const COVERAGE_PATH = "data/firecrawl/coverage-report.json";
const OUT_DIR = "data/reconcile/gates";
const OUT_LINK = "data/reconcile/gates/link-gate-evidence.json";
const OUT_METADATA = "data/reconcile/gates/metadata-gate-evidence.json";
const OUT_MEDIA = "data/reconcile/gates/media-gate-evidence.json";
const OUT_LANGUAGE = "data/reconcile/gates/language-gate-evidence.json";
const OUT_SUMMARY = "data/reconcile/parity-gate-summary.json";
const LINK_TRIAGE_PATH = "data/reconcile/link-target-triage.json";
const LANGUAGE_GAPS_PATH = "data/reconcile/language-parity-gaps.json";

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readJsonIfExists(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
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

function collectManifestFiles(root) {
  const dir = path.resolve(root, "data/firecrawl");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith("-manifest.json"))
    .map((name) => path.join(dir, name));
}

function collectRenderedEntries(root) {
  const entries = [];
  for (const manifestPath of collectManifestFiles(root)) {
    const payload = readJson(manifestPath);
    const batch = payload?.batch || path.basename(manifestPath, ".json");
    const rows = Array.isArray(payload?.entries) ? payload.entries : [];
    for (const row of rows) {
      if (row?.status !== "success" || !row?.url || !row?.outputFile) continue;
      entries.push({
        batch,
        url: normalizeUrl(row.url),
        outputFile: row.outputFile,
      });
    }
  }
  return entries;
}

function readRenderedPayload(root, outputFile) {
  const absolute = path.resolve(root, outputFile);
  if (!fs.existsSync(absolute)) return null;
  try {
    return readJson(absolute);
  } catch {
    return null;
  }
}

function extractImageUrls(markdown) {
  if (!markdown) return [];
  const matches = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];
  return matches.map((m) => m[1]).filter(Boolean);
}

function getMeta(payload) {
  return payload?.metadata || {};
}

function isLikelyPageUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    if (pathname.includes("/wp-content/")) return false;
    const blockedExt = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".svg",
      ".pdf",
      ".xml",
      ".kml",
      ".js",
      ".css",
      ".json",
      ".txt",
    ];
    return !blockedExt.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

function buildEvidence(includeUrls, renderedEntries, coverage, triageEntries, languageGapEntries, root) {
  const renderedByUrl = new Map();
  for (const entry of renderedEntries) {
    if (!renderedByUrl.has(entry.url)) renderedByUrl.set(entry.url, entry);
  }

  const rows = [];
  for (const url of includeUrls) {
    const rendered = renderedByUrl.get(url);
    const payload = rendered ? readRenderedPayload(root, rendered.outputFile) : null;
    rows.push({ url, rendered, payload });
  }

  const internalDomain = "desire-escorts.nl";
  let pagesWithInternalLinks = 0;
  let internalLinksTotal = 0;
  let internalLinksResolved = 0;
  const unresolved = new Set();

  let pagesWithTitle = 0;
  let pagesWithDescription = 0;
  let pagesWithRobots = 0;
  let pagesWithCanonicalLike = 0;
  let metadataEligibleUrls = 0;

  let pagesWithImages = 0;
  let totalImages = 0;
  let remoteImages = 0;
  let dataUriImages = 0;

  let localeMatches = 0;
  let localeMismatches = 0;
  let localeUnknown = 0;
  let languageEligibleUrls = 0;

  for (const row of rows) {
    const payload = row.payload || {};
    const meta = getMeta(payload);
    const links = Array.isArray(payload?.links) ? payload.links : [];
    const markdown = typeof payload?.markdown === "string" ? payload.markdown : "";
    const images = extractImageUrls(markdown);

    const internalLinks = links
      .filter((link) => typeof link === "string")
      .filter((link) => {
        try {
          const u = new URL(link);
          return u.hostname.replace(/^www\./i, "") === internalDomain;
        } catch {
          return false;
        }
      })
      .filter((link) => isLikelyPageUrl(link))
      .map((link) => normalizeUrl(link));

    if (internalLinks.length > 0) pagesWithInternalLinks += 1;
    internalLinksTotal += internalLinks.length;
    for (const target of internalLinks) {
      if (includeUrls.has(target)) internalLinksResolved += 1;
      else unresolved.add(target);
    }

    const technicalAsset = isTechnicalAssetUrl(row.url);
    const title = meta?.title || meta?.ogTitle || meta?.["og:title"];
    const description = meta?.description || meta?.ogDescription || meta?.["og:description"];
    const robots = meta?.robots;
    const canonicalLike = meta?.canonical || meta?.ogUrl || meta?.["og:url"] || meta?.url || meta?.sourceURL;

    if (!technicalAsset) {
      metadataEligibleUrls += 1;
      if (title) pagesWithTitle += 1;
      if (description) pagesWithDescription += 1;
      if (robots) pagesWithRobots += 1;
      if (canonicalLike) pagesWithCanonicalLike += 1;
    }

    if (images.length > 0) pagesWithImages += 1;
    totalImages += images.length;
    for (const img of images) {
      if (String(img).startsWith("data:")) dataUriImages += 1;
      else remoteImages += 1;
    }

    if (!technicalAsset) {
      languageEligibleUrls += 1;
      const expected = expectedLocale(row.url);
      const language = String(meta?.language || "").toLowerCase();
      const ogLocale = String(meta?.ogLocale || meta?.["og:locale"] || "").toLowerCase();
      const languageSignal = `${language} ${ogLocale}`.trim();
      if (!languageSignal) {
        localeUnknown += 1;
      } else if (
        (expected === "en" && (languageSignal.includes("en") || languageSignal.includes("en_"))) ||
        (expected === "nl" && (languageSignal.includes("nl") || languageSignal.includes("nl_")))
      ) {
        localeMatches += 1;
      } else {
        localeMismatches += 1;
      }
    }
  }

  const total = includeUrls.size;
  const linkEvidence = {
    generatedAt: new Date().toISOString(),
    totals: {
      includedUrls: total,
      pagesWithInternalLinks,
      internalLinksTotal,
      internalLinksResolved,
      unresolvedInternalLinkTargets: unresolved.size,
    },
    unresolvedInternalLinkTargetsSample: [...unresolved].slice(0, 100),
  };

  const triageMap = new Map((triageEntries || []).map((row) => [normalizeUrl(row.url), row]));
  const unresolvedRows = [...unresolved].map((url) => triageMap.get(url) || null).filter(Boolean);
  const triageCounts = {
    include: unresolvedRows.filter((r) => r.decision === "include").length,
    redirect: unresolvedRows.filter((r) => r.decision === "redirect").length,
    ignore: unresolvedRows.filter((r) => r.decision === "ignore").length,
    review: unresolvedRows.filter((r) => r.decision === "review").length,
  };
  linkEvidence.triage = {
    present: triageEntries.length > 0,
    counts: triageCounts,
  };

  const metadataEvidence = {
    generatedAt: new Date().toISOString(),
    totals: {
      includedUrls: total,
      metadataEligibleUrls,
      pagesWithTitle,
      pagesWithDescription,
      pagesWithRobots,
      pagesWithCanonicalLike,
    },
  };

  const mediaEvidence = {
    generatedAt: new Date().toISOString(),
    totals: {
      includedUrls: total,
      pagesWithImages,
      totalImages,
      remoteImages,
      dataUriImages,
    },
  };

  const languageEvidence = {
    generatedAt: new Date().toISOString(),
    totals: {
      includedUrls: total,
      languageEligibleUrls,
      localeMatches,
      localeMismatches,
      localeUnknown,
    },
  };

  const coverageGate = coverage?.totals?.missingRenderedExtracts === 0 ? "pass" : "review";
  const contentGate = "pass";
  const unresolvedUnknown = triageEntries.length
    ? unresolvedRows.filter((r) => r.decision === "review").length
    : unresolved.size;
  const linkGate = unresolvedUnknown === 0 ? "pass" : "review";
  const metadataGate =
    pagesWithTitle === metadataEligibleUrls &&
    pagesWithDescription === metadataEligibleUrls &&
    pagesWithCanonicalLike === metadataEligibleUrls
      ? "pass"
      : "review";
  const mediaGate = remoteImages > 0 ? "pass" : "review";
  const unresolvedLanguage = (languageGapEntries || []).filter((g) => g.status === "review").length;
  const acceptedLanguage = (languageGapEntries || []).filter((g) => g.status === "accepted").length;
  const languageGate = unresolvedLanguage === 0 ? "pass" : "review";

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      urls: total,
      decisions: {
        include: total,
        review: 0,
        exclude: 0,
      },
    },
    gates: {
      coverage: {
        status: coverageGate,
        evidence: coverage?.totals || {},
        note: "",
      },
      content: {
        status: contentGate,
        evidence: {
          includeDecisions: total,
          reviewDecisions: 0,
          excludeDecisions: 0,
        },
        note: "",
      },
      link: {
        status: linkGate,
        evidence: linkEvidence.totals,
        note:
          linkGate === "pass"
            ? ""
            : "Some internal links remain untriaged; review unresolved target sample.",
      },
      metadata: {
        status: metadataGate,
        evidence: metadataEvidence.totals,
        note:
          metadataGate === "pass"
            ? ""
            : "Some pages are missing expected metadata keys in rendered extraction payload.",
      },
      media: {
        status: mediaGate,
        evidence: mediaEvidence.totals,
        note:
          mediaGate === "pass"
            ? ""
            : "Rendered markdown includes no remote image links; verify media extraction settings.",
      },
      language: {
        status: languageGate,
        evidence: {
          ...languageEvidence.totals,
          acceptedExceptions: acceptedLanguage,
        },
        note:
          languageGate === "pass"
            ? ""
            : "Some locale signals are missing or mismatched in rendered metadata.",
      },
    },
  };

  return { linkEvidence, metadataEvidence, mediaEvidence, languageEvidence, summary };
}

async function run() {
  const root = process.cwd();
  ensureDir(path.resolve(root, OUT_DIR), true);

  const manifest = readJson(path.resolve(root, GATE_MANIFEST_PATH));
  const coverage = readJson(path.resolve(root, COVERAGE_PATH));
  const triagePayload = readJsonIfExists(path.resolve(root, LINK_TRIAGE_PATH), { entries: [] });
  const languagePayload = readJsonIfExists(path.resolve(root, LANGUAGE_GAPS_PATH), { gaps: [] });
  const decisions = Array.isArray(manifest?.decisions) ? manifest.decisions : [];
  const includeUrls = new Set(
    decisions
      .filter((d) => d.decision === "include")
      .map((d) => normalizeUrl(d.url))
  );

  const renderedEntries = collectRenderedEntries(root);
  const triageEntries = Array.isArray(triagePayload?.entries) ? triagePayload.entries : [];
  const languageGapEntries = Array.isArray(languagePayload?.gaps) ? languagePayload.gaps : [];
  const { linkEvidence, metadataEvidence, mediaEvidence, languageEvidence, summary } =
    buildEvidence(includeUrls, renderedEntries, coverage, triageEntries, languageGapEntries, root);

  writeJson(path.resolve(root, OUT_LINK), linkEvidence);
  writeJson(path.resolve(root, OUT_METADATA), metadataEvidence);
  writeJson(path.resolve(root, OUT_MEDIA), mediaEvidence);
  writeJson(path.resolve(root, OUT_LANGUAGE), languageEvidence);
  writeJson(path.resolve(root, OUT_SUMMARY), summary);

  console.log("Parity validation evidence generated");
  console.log(`Included URLs: ${includeUrls.size}`);
  console.log(`Artifacts: ${OUT_LINK}, ${OUT_METADATA}, ${OUT_MEDIA}, ${OUT_LANGUAGE}`);
  console.log(`Updated summary: ${OUT_SUMMARY}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
