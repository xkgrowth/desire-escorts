import fs from "node:fs";
import path from "node:path";
import { fetchWpJson, getWpConfig, wpAuthHeader } from "./wp-utils.mjs";

const DEFAULT_TYPES = ["pages", "posts", "media"];

function parseArgs(argv) {
  let outDir = "data/wordpress";
  let types = [...DEFAULT_TYPES];
  let perPage = 50;
  let lang = "";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out-dir" && argv[i + 1]) {
      outDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--types" && argv[i + 1]) {
      types = argv[i + 1]
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg === "--per-page" && argv[i + 1]) {
      const value = Number(argv[i + 1]);
      if (Number.isFinite(value) && value > 0 && value <= 100) {
        perPage = value;
      }
      i += 1;
      continue;
    }
    if (arg === "--lang" && argv[i + 1]) {
      lang = argv[i + 1].trim();
      i += 1;
    }
  }

  return { outDir, types, perPage, lang };
}

async function fetchPageWithRetry(url, authHeader, attempts = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchWpJson(url, authHeader, { timeoutMs: 30000 });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const backoffMs = attempt * 1500;
        console.warn(
          `Request failed (attempt ${attempt}/${attempts}) for ${url}. Retrying in ${backoffMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw lastError;
}

async function fetchAllForType(baseUrl, authHeader, type, perPage, lang) {
  let page = 1;
  let totalPages = 1;
  const allItems = [];

  while (page <= totalPages) {
    const query = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
    });
    if (lang) query.set("lang", lang);

    const url = `${baseUrl}/wp-json/wp/v2/${type}?${query.toString()}`;
    const { response, json } = await fetchPageWithRetry(url, authHeader);

    if (!Array.isArray(json)) {
      throw new Error(`Expected array for type "${type}" page ${page}`);
    }

    const headerPages = Number(response.headers.get("x-wp-totalpages"));
    if (Number.isFinite(headerPages) && headerPages > 0) {
      totalPages = headerPages;
    }

    allItems.push(...json);
    console.log(`Fetched ${type} page ${page}/${totalPages} (${json.length} items)`);
    page += 1;
  }

  return allItems;
}

async function run() {
  const { outDir, types, perPage, lang } = parseArgs(process.argv.slice(2));
  const { baseUrl, username, appPassword } = getWpConfig();
  const auth = wpAuthHeader(username, appPassword);
  const absoluteOutDir = path.resolve(process.cwd(), outDir);

  fs.mkdirSync(absoluteOutDir, { recursive: true });

  const summary = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    lang: lang || "default",
    types: {},
  };

  for (const type of types) {
    const started = Date.now();
    const items = await fetchAllForType(baseUrl, auth, type, perPage, lang);
    const filePath = path.join(absoluteOutDir, `${type}.json`);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

    summary.types[type] = {
      count: items.length,
      file: path.relative(process.cwd(), filePath),
      durationMs: Date.now() - started,
    };
  }

  const summaryPath = path.join(absoluteOutDir, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");

  console.log("");
  console.log("WordPress export complete");
  console.log(`Output directory: ${path.relative(process.cwd(), absoluteOutDir)}`);
  for (const [type, stats] of Object.entries(summary.types)) {
    console.log(`- ${type}: ${stats.count} items -> ${stats.file}`);
  }
  console.log(`Summary: ${path.relative(process.cwd(), summaryPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
