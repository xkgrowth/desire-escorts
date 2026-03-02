import fs from "node:fs";
import path from "node:path";
import {
  fetchStrapiJson,
  getStrapiConfig,
  strapiAuthHeaders,
} from "./strapi-utils.mjs";

const OUT_FILE = "data/strapi/coverage-audit.json";
const REQUIRED_PROFILE_FIELDS = ["name", "slug", "isAvailable", "isHidden"];

function ensureDir(fileOrDirPath, isDir = false) {
  const dirPath = isDir ? fileOrDirPath : path.dirname(fileOrDirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

function readDataArray(json) {
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;
  return [];
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

function extractPagination(json) {
  return json?.meta?.pagination || null;
}

async function fetchAllProfiles(baseUrl, headers) {
  const pageSize = 100;
  let page = 1;
  let pageCount = 1;
  const rows = [];

  while (page <= pageCount) {
    const url =
      `${baseUrl}/api/profiles?pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
      "&populate[0]=sites&populate[1]=languages";
    const { json } = await fetchStrapiJson(url, headers);
    const data = readDataArray(json);
    rows.push(...data);

    const pagination = extractPagination(json);
    if (pagination?.pageCount) {
      pageCount = pagination.pageCount;
    } else {
      pageCount = page;
    }
    page += 1;
  }

  return rows;
}

function auditProfiles(profiles) {
  const missingFieldCounts = Object.fromEntries(
    REQUIRED_PROFILE_FIELDS.map((field) => [field, 0])
  );
  const localeCounts = {};
  let withSites = 0;
  let withLanguages = 0;
  let published = 0;
  let hidden = 0;
  let available = 0;

  for (const raw of profiles) {
    const profile = unwrapProfileEntity(raw);
    for (const field of REQUIRED_PROFILE_FIELDS) {
      const value = profile?.[field];
      if (value === null || value === undefined || value === "") {
        missingFieldCounts[field] += 1;
      }
    }

    const locale = profile?.locale || "unknown";
    localeCounts[locale] = (localeCounts[locale] || 0) + 1;

    if (profile?.publishedAt) published += 1;
    if (profile?.isHidden === true) hidden += 1;
    if (profile?.isAvailable === true) available += 1;

    const sites = profile?.sites?.data || profile?.sites;
    const languages = profile?.languages?.data || profile?.languages;
    if (Array.isArray(sites) && sites.length > 0) withSites += 1;
    if (Array.isArray(languages) && languages.length > 0) withLanguages += 1;
  }

  return {
    totalProfiles: profiles.length,
    localeCounts,
    missingRequiredFieldCounts: missingFieldCounts,
    relationCoverage: {
      withSites,
      withLanguages,
    },
    statusCoverage: {
      published,
      hidden,
      available,
    },
  };
}

async function runHostAudit(baseUrl, apiToken, host) {
  const headers = strapiAuthHeaders(apiToken, host);
  let healthStatus = null;
  let healthOk = false;
  let healthNote = "";
  let filtersOk = false;
  let filtersKeys = [];
  let filtersNote = "";

  try {
    const { response } = await fetchStrapiJson(`${baseUrl}/api/profiles/health`, headers);
    healthStatus = response.status;
    healthOk = response.ok;
  } catch (error) {
    const text = String(error?.message || error);
    healthNote = text;
    if (text.includes(" 403: ")) {
      healthStatus = 403;
      healthOk = false;
      healthNote = "Endpoint returns 403 for read-only token in current backend config";
    }
  }

  try {
    const { json: filtersJson } = await fetchStrapiJson(`${baseUrl}/api/profiles/filters`, headers);
    filtersOk = true;
    filtersKeys = filtersJson ? Object.keys(filtersJson) : [];
  } catch (error) {
    filtersOk = false;
    filtersNote = String(error?.message || error);
  }

  const { json: sampleJson } = await fetchStrapiJson(
    `${baseUrl}/api/profiles?pagination[pageSize]=1`,
    headers
  );
  const profiles = await fetchAllProfiles(baseUrl, headers);

  const audit = auditProfiles(profiles);
  const sample = readDataArray(sampleJson)[0] || null;

  return {
    host,
    checks: {
      health: {
        ok: healthOk,
        status: healthStatus,
        note: healthNote,
      },
      filtersEndpoint: {
        ok: filtersOk,
        keys: filtersKeys,
        note: filtersNote,
      },
      profilesListEndpoint: {
        ok: true,
        sampleShape: sample ? Object.keys(sample).slice(0, 20) : [],
      },
    },
    audit,
  };
}

function writeJson(filePath, payload) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function run() {
  const { baseUrl, apiToken, siteHost, secondarySiteHost } = getStrapiConfig();
  const hosts = [siteHost, secondarySiteHost].filter(Boolean);

  const hostAudits = [];
  for (const host of hosts) {
    hostAudits.push(await runHostAudit(baseUrl, apiToken, host));
  }

  const primary = hostAudits[0]?.audit || null;
  const secondary = hostAudits[1]?.audit || null;

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    scope: {
      hosts,
    },
    assumptions: {
      profileAuthority: "strapi",
      profileUrlParityIntent: "keep existing profile URLs",
    },
    results: hostAudits,
    consistency: secondary
      ? {
          profileCountMatch:
            primary?.totalProfiles === secondary?.totalProfiles,
          localeCountMatch:
            JSON.stringify(primary?.localeCounts || {}) ===
            JSON.stringify(secondary?.localeCounts || {}),
        }
      : null,
  };

  const absoluteOut = path.resolve(process.cwd(), OUT_FILE);
  writeJson(absoluteOut, payload);

  console.log("Strapi coverage audit complete");
  for (const result of hostAudits) {
    console.log(
      `- ${result.host}: profiles=${result.audit.totalProfiles}, locales=${JSON.stringify(
        result.audit.localeCounts
      )}`
    );
  }
  console.log(`Report: ${OUT_FILE}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
