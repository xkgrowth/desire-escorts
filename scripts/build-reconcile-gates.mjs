import fs from "node:fs";
import path from "node:path";
import { fetchStrapiJson, getStrapiConfig, strapiAuthHeaders } from "./strapi-utils.mjs";

const DATASET_PATH = "data/reconcile/normalized-content-dataset.json";
const COVERAGE_PATH = "data/firecrawl/coverage-report.json";
const REVIEW_QUEUE_PATH = "data/inventory/review-queue.json";
const OVERRIDES_PATH = "data/reconcile/manual-decision-overrides.json";
const OUT_MANIFEST = "data/reconcile/include-review-exclude-manifest.json";
const OUT_GATES = "data/reconcile/parity-gate-summary.json";

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

function isProfileUrl(url) {
  const { pathname } = new URL(url);
  return /^\/(?:en\/)?escorts\/[^/]+$/.test(pathname);
}

function profileSlugFromUrl(url) {
  const { pathname } = new URL(url);
  const match = pathname.match(/^\/(?:en\/)?escorts\/([^/]+)$/);
  return match ? match[1] : "";
}

function unwrapProfileEntity(entity) {
  if (entity && typeof entity === "object" && entity.attributes && typeof entity.attributes === "object") {
    return {
      id: entity.id ?? entity.attributes.id ?? null,
      ...entity.attributes,
    };
  }
  return entity || {};
}

async function fetchStrapiProfileSlugs(baseUrl, apiToken, host) {
  const headers = strapiAuthHeaders(apiToken, host);
  const pageSize = 100;
  let page = 1;
  let pageCount = 1;
  const slugs = new Set();

  while (page <= pageCount) {
    const url = `${baseUrl}/api/profiles?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const { json } = await fetchStrapiJson(url, headers);
    const data = Array.isArray(json?.data) ? json.data : [];

    for (const item of data) {
      const unwrapped = unwrapProfileEntity(item);
      const slug = unwrapped?.slug;
      if (slug) slugs.add(String(slug));
    }

    const metaPageCount = json?.meta?.pagination?.pageCount;
    pageCount = Number.isFinite(metaPageCount) ? metaPageCount : page;
    page += 1;
  }

  return slugs;
}

function buildDecision(record, context) {
  const reasons = [];
  let decision = "include";

  if (context.reviewQueueUrls.has(record.url)) {
    decision = "review";
    reasons.push("URL discovered outside sitemap baseline and queued for manual classification");
  }

  if (record.entityKind === "unknown") {
    decision = "review";
    reasons.push("Entity kind unknown");
  }

  if (context.coverageMissing.has(record.url)) {
    decision = "review";
    reasons.push("Rendered extract missing in coverage report");
  }

  if (record.contentAuthority?.primary === "wordpress") {
    const hasWp = Boolean(record.provenance?.wpApi || record.provenance?.wpLegacyExport);
    if (!hasWp) {
      decision = "review";
      reasons.push("No WordPress source record found");
    }
  }

  if (record.contentAuthority?.primary === "strapi" && isProfileUrl(record.url)) {
    const slug = profileSlugFromUrl(record.url);
    if (!slug || !context.strapiProfileSlugs.has(slug)) {
      decision = "review";
      reasons.push("Profile URL slug not found in Strapi profiles list for scoped host");
    }
  }

  if (reasons.length === 0) {
    reasons.push("Meets current parity-first source and coverage criteria");
  }

  return {
    url: record.url,
    locale: record.locale,
    type: record.type,
    entityKind: record.entityKind,
    authority: record.contentAuthority?.primary || "unknown",
    source: record.sourceFlags?.source || "unknown",
    decision,
    reasons,
  };
}

function applyManualOverride(decision, override) {
  if (!override || !override.decision) return decision;
  const reasons = Array.isArray(override.reasons) && override.reasons.length > 0
    ? override.reasons
    : decision.reasons;

  return {
    ...decision,
    decision: override.decision,
    reasons,
    override: true,
  };
}

function summarizeDecisions(decisions) {
  return {
    include: decisions.filter((d) => d.decision === "include").length,
    review: decisions.filter((d) => d.decision === "review").length,
    exclude: decisions.filter((d) => d.decision === "exclude").length,
  };
}

function gate(status, evidence, note = "") {
  return { status, evidence, note };
}

function buildGateSummary({ dataset, decisions, coverage, strapiProfileSlugs }) {
  const summary = summarizeDecisions(decisions);
  const total = decisions.length;

  const profileUrls = dataset.filter((r) => r.contentAuthority?.primary === "strapi");
  const matchedProfileUrls = profileUrls.filter((r) => {
    const slug = profileSlugFromUrl(r.url);
    return slug && strapiProfileSlugs.has(slug);
  });

  const wpUrls = dataset.filter((r) => r.contentAuthority?.primary === "wordpress");
  const wpWithSource = wpUrls.filter((r) => r.provenance?.wpApi || r.provenance?.wpLegacyExport);

  const localeCounts = dataset.reduce(
    (acc, row) => {
      const key = row.locale || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      urls: total,
      decisions: summary,
    },
    gates: {
      coverage: gate(
        coverage?.totals?.missingRenderedExtracts === 0 ? "pass" : "review",
        {
          inventoryUrls: coverage?.totals?.inventoryUrls ?? total,
          successfulRenderedExtracts: coverage?.totals?.successfulRenderedExtracts ?? 0,
          missingRenderedExtracts: coverage?.totals?.missingRenderedExtracts ?? total,
        }
      ),
      content: gate(
        summary.review === 0 ? "pass" : "review",
        {
          profileUrls: profileUrls.length,
          profileUrlsMatchedInStrapi: matchedProfileUrls.length,
          wordpressUrls: wpUrls.length,
          wordpressUrlsWithSource: wpWithSource.length,
        },
        "Review items require manual include/review/exclude triage before lock"
      ),
      link: gate(
        "review",
        {
          renderedCoverageAtUrlLevel: coverage?.totals?.successfulRenderedExtracts ?? 0,
        },
        "Link-graph retention still needs dedicated path-level QA checks"
      ),
      metadata: gate(
        "review",
        {
          renderedCoverageAtUrlLevel: coverage?.totals?.successfulRenderedExtracts ?? 0,
        },
        "Title/canonical/hreflang parity checks pending dedicated metadata audit"
      ),
      media: gate(
        "review",
        {
          renderedCoverageAtUrlLevel: coverage?.totals?.successfulRenderedExtracts ?? 0,
        },
        "Broken/missing media validation pending dedicated media pass"
      ),
      language: gate(
        localeCounts.nl > 0 && localeCounts.en > 0 ? "pass" : "review",
        {
          localeCounts,
        }
      ),
    },
  };
}

async function run() {
  const root = process.cwd();
  const dataset = readJson(path.resolve(root, DATASET_PATH));
  const coverage = readJson(path.resolve(root, COVERAGE_PATH));
  const reviewQueue = readJson(path.resolve(root, REVIEW_QUEUE_PATH));
  const overridesPayload = readJsonIfExists(path.resolve(root, OVERRIDES_PATH), { overrides: [] });
  const records = Array.isArray(dataset?.records) ? dataset.records : [];
  if (records.length === 0) {
    throw new Error("Normalized dataset is empty. Run `npm run reconcile:build-dataset` first.");
  }

  const { baseUrl, apiToken, siteHost } = getStrapiConfig();
  const strapiProfileSlugs = await fetchStrapiProfileSlugs(baseUrl, apiToken, siteHost);

  const context = {
    reviewQueueUrls: new Set((reviewQueue?.urls || []).map((r) => r.url)),
    coverageMissing: new Set((coverage?.missing || []).map((r) => r.url)),
    strapiProfileSlugs,
  };

  const overrideMap = new Map(
    (Array.isArray(overridesPayload?.overrides) ? overridesPayload.overrides : [])
      .filter((item) => item?.url && item?.decision)
      .map((item) => [item.url, item])
  );

  const decisions = records.map((record) => {
    const base = buildDecision(record, context);
    const override = overrideMap.get(record.url);
    return applyManualOverride(base, override);
  });
  const decisionCounts = summarizeDecisions(decisions);
  const gateSummary = buildGateSummary({
    dataset: records,
    decisions,
    coverage,
    strapiProfileSlugs,
  });

  writeJson(path.resolve(root, OUT_MANIFEST), {
    generatedAt: new Date().toISOString(),
    counts: decisionCounts,
    decisions,
  });
  writeJson(path.resolve(root, OUT_GATES), gateSummary);

  console.log("Reconciliation gate artifacts generated");
  console.log(`Decisions - include:${decisionCounts.include} review:${decisionCounts.review} exclude:${decisionCounts.exclude}`);
  console.log(`Artifacts: ${OUT_MANIFEST}, ${OUT_GATES}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
