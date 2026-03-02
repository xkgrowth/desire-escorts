import {
  fetchStrapiJson,
  getStrapiConfig,
  strapiAuthHeaders,
} from "./strapi-utils.mjs";

function buildChecks(baseUrl, host) {
  const hostLabel = host ? ` [host=${host}]` : "";
  return [
    {
      name: `Profiles health${hostLabel}`,
      url: `${baseUrl}/api/profiles/health`,
      host,
    },
    {
      name: `Profiles list pageSize=1${hostLabel}`,
      url: `${baseUrl}/api/profiles?pagination[pageSize]=1`,
      host,
    },
  ];
}

function inferBodyShape(json) {
  if (Array.isArray(json)) return `array(${json.length})`;
  if (json && typeof json === "object") {
    if (Array.isArray(json.data)) return `object[data:${json.data.length}]`;
    if ("data" in json) return "object[data]";
    return "object";
  }
  return typeof json;
}

async function run() {
  const { baseUrl, apiToken, siteHost, secondarySiteHost } = getStrapiConfig();
  const checks = [
    ...buildChecks(baseUrl, siteHost),
    ...(secondarySiteHost ? buildChecks(baseUrl, secondarySiteHost) : []),
  ];

  console.log("Strapi connection healthcheck");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Primary host scope: ${siteHost}`);
  if (secondarySiteHost) {
    console.log(`Secondary host scope: ${secondarySiteHost}`);
  }
  console.log("");

  for (const check of checks) {
    const started = Date.now();

    try {
      const headers = strapiAuthHeaders(apiToken, check.host);
      const { response, json } = await fetchStrapiJson(check.url, headers);
      const ms = Date.now() - started;
      const shape = inferBodyShape(json);

      console.log(`PASS  ${check.name}`);
      console.log(`      ${response.status} ${response.statusText} in ${ms}ms | body: ${shape}`);
    } catch (error) {
      console.log(`FAIL  ${check.name}`);
      console.log(`      ${(error && error.message) || String(error)}`);
      process.exitCode = 1;
    }
  }

  console.log("");
  if (process.exitCode) {
    console.log("Healthcheck failed. Review Strapi token scope, host scoping, and endpoint access.");
  } else {
    console.log("All checks passed.");
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
