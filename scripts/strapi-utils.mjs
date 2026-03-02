import { loadProjectEnv } from "./wp-utils.mjs";

const REQUIRED_ENV = ["STRAPI_BASE_URL", "STRAPI_API_TOKEN"];

export function getStrapiConfig() {
  loadProjectEnv();

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  return {
    baseUrl: process.env.STRAPI_BASE_URL.replace(/\/+$/, ""),
    apiToken: process.env.STRAPI_API_TOKEN,
    siteHost: process.env.STRAPI_SITE_HOST || "desire-escorts.nl",
    secondarySiteHost: process.env.STRAPI_SITE_HOST_SECONDARY || "",
  };
}

export function strapiAuthHeaders(apiToken, siteHost) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${apiToken}`,
  };

  if (siteHost) {
    headers["x-forwarded-host"] = siteHost;
  }

  return headers;
}

export async function fetchStrapiJson(url, headers, options = {}) {
  const { timeoutMs = 30000 } = options;

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  });

  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Keep null when response body is not JSON.
  }

  if (!response.ok) {
    const details = json?.error?.message || json?.message || text || response.statusText;
    throw new Error(`Strapi request failed ${response.status}: ${details}`);
  }

  return { response, json };
}
