import { fetchWpJson, getWpConfig, wpAuthHeader } from "./wp-utils.mjs";

async function run() {
  const { baseUrl, username, appPassword } = getWpConfig();
  const auth = wpAuthHeader(username, appPassword);
  const localeChecks = [
    {
      name: "Pages endpoint (lang=en)",
      url: `${baseUrl}/wp-json/wp/v2/pages?per_page=1&lang=en`,
      auth: true,
      optional: true,
    },
    {
      name: "Pages endpoint (lang=all)",
      url: `${baseUrl}/wp-json/wp/v2/pages?per_page=1&lang=all`,
      auth: true,
      optional: true,
    },
  ];

  const checks = [
    { name: "API index", url: `${baseUrl}/wp-json/`, auth: false },
    {
      name: "Authenticated user",
      url: `${baseUrl}/wp-json/wp/v2/users/me`,
      auth: true,
    },
    { name: "Pages endpoint", url: `${baseUrl}/wp-json/wp/v2/pages?per_page=1`, auth: true },
    { name: "Posts endpoint", url: `${baseUrl}/wp-json/wp/v2/posts?per_page=1`, auth: true },
    { name: "Media endpoint", url: `${baseUrl}/wp-json/wp/v2/media?per_page=1`, auth: true },
    ...localeChecks,
  ];

  console.log("WordPress connection healthcheck");
  console.log(`Base URL: ${baseUrl}`);
  console.log("");

  for (const check of checks) {
    const started = Date.now();

    try {
      const { response, json } = await fetchWpJson(check.url, check.auth ? auth : undefined);
      const ms = Date.now() - started;
      const shape = Array.isArray(json) ? `array(${json.length})` : typeof json;

      console.log(`PASS  ${check.name}`);
      console.log(`      ${response.status} ${response.statusText} in ${ms}ms | body: ${shape}`);
    } catch (error) {
      if (check.optional) {
        console.log(`WARN  ${check.name}`);
        console.log(`      ${(error && error.message) || String(error)}`);
      } else {
        console.log(`FAIL  ${check.name}`);
        console.log(`      ${(error && error.message) || String(error)}`);
        process.exitCode = 1;
      }
    }
  }

  console.log("");
  if (process.exitCode) {
    console.log("Healthcheck failed. Review auth credentials and endpoint access.");
  } else {
    console.log("All checks passed.");
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
