import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  let perPage = 25;
  let includeMedia = true;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--per-page" && argv[i + 1]) {
      const value = Number(argv[i + 1]);
      if (Number.isFinite(value) && value > 0 && value <= 100) {
        perPage = value;
      }
      i += 1;
      continue;
    }

    if (arg === "--skip-media") {
      includeMedia = false;
    }
  }

  return { perPage, includeMedia };
}

function runStep(label, args) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function readSummary(summaryPath) {
  return JSON.parse(fs.readFileSync(summaryPath, "utf8"));
}

async function run() {
  const { perPage, includeMedia } = parseArgs(process.argv.slice(2));

  runStep("Export NL pages/posts", [
    "scripts/wp-export.mjs",
    "--lang",
    "nl",
    "--types",
    "pages,posts",
    "--out-dir",
    "data/wordpress/nl",
    "--per-page",
    String(perPage),
  ]);

  runStep("Export EN pages/posts", [
    "scripts/wp-export.mjs",
    "--lang",
    "en",
    "--types",
    "pages,posts",
    "--out-dir",
    "data/wordpress/en",
    "--per-page",
    String(perPage),
  ]);

  if (includeMedia) {
    runStep("Export shared media", [
      "scripts/wp-export.mjs",
      "--types",
      "media",
      "--out-dir",
      "data/wordpress/shared",
      "--per-page",
      String(perPage),
    ]);
  }

  const nlSummary = readSummary(path.resolve(process.cwd(), "data/wordpress/nl/summary.json"));
  const enSummary = readSummary(path.resolve(process.cwd(), "data/wordpress/en/summary.json"));
  const sharedSummaryPath = path.resolve(process.cwd(), "data/wordpress/shared/summary.json");
  const sharedSummary = includeMedia && fs.existsSync(sharedSummaryPath) ? readSummary(sharedSummaryPath) : null;

  const manifest = {
    generatedAt: new Date().toISOString(),
    perPage,
    includeMedia,
    locales: {
      nl: nlSummary.types,
      en: enSummary.types,
    },
    shared: sharedSummary ? sharedSummary.types : {},
  };

  const manifestPath = path.resolve(process.cwd(), "data/wordpress/export-manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  console.log("\nAll locale exports completed.");
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
