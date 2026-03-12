/**
 * Extract location page content from Firecrawl JSON into LocationDetailPageData-shaped content.
 *
 * Reads:
 * - data/inventory/nl-location-slugs.txt (223 NL location slugs)
 * - data/firecrawl/*-manifest.json (latest manifest with NL locale entries)
 * - .firecrawl/rendered/full/desire-escorts.nl__escort-{slug}.json per slug
 *
 * Outputs:
 * - data/firecrawl/location-extracted-content.json: per-slug extracted fields (heroIntro,
 *   locationNarrative, faqs, hotels, metaTitle, metaDescription, speedSummary, pricingSummary)
 *   for use by the location data layer when building LocationDetailPageData.
 *
 * Usage: node scripts/extract-location-content-from-firecrawl.mjs [--manifest path] [--output path]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SLUGS_FILE = path.join(ROOT, "data", "inventory", "nl-location-slugs.txt");
const FIRECRAWL_DIR = path.join(ROOT, "data", "firecrawl");
const RENDERED_ROOT = path.join(ROOT, ".firecrawl", "rendered", "full");
const DEFAULT_OUTPUT = path.join(ROOT, "data", "firecrawl", "location-extracted-content.json");

function parseArgs(argv) {
  let manifestPath = null;
  let outputPath = DEFAULT_OUTPUT;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--manifest" && argv[i + 1]) {
      manifestPath = path.resolve(ROOT, argv[i + 1].trim());
      i++;
    } else if (argv[i] === "--output" && argv[i + 1]) {
      outputPath = path.resolve(ROOT, argv[i + 1].trim());
      i++;
    }
  }
  return { manifestPath, outputPath };
}

function readSlugs() {
  const text = fs.readFileSync(SLUGS_FILE, "utf8");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function findManifests(overridePath) {
  if (overridePath && fs.existsSync(overridePath)) {
    return [overridePath];
  }
  const files = fs.readdirSync(FIRECRAWL_DIR).filter((f) => f.endsWith("-manifest.json"));
  return files.sort((a, b) => b.localeCompare(a)).map((f) => path.join(FIRECRAWL_DIR, f));
}

/** Load all manifests and merge NL location entries by type (slug); later manifest wins for same slug. */
function loadMergedManifestEntries(manifestPaths) {
  const byType = new Map();
  for (const manifestPath of manifestPaths) {
    const raw = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const entries = Array.isArray(raw.entries) ? raw.entries : [];
    for (const e of entries) {
      if (e.locale === "nl" && e.type && e.type.startsWith("escort-") && e.outputFile && e.status === "success") {
        byType.set(e.type, e);
      }
    }
  }
  return Array.from(byType.values());
}

function getMarkdownFromFirecrawlJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  const markdown =
    data.markdown ??
    data.data?.markdown ??
    (typeof data.content === "string" ? data.content : null);
  return typeof markdown === "string" ? markdown : null;
}

function trim(str) {
  return typeof str === "string" ? str.trim().replace(/\s+/g, " ").trim() : "";
}

function truncate(str, maxLen) {
  const s = trim(str);
  if (s.length <= maxLen) return s;
  const last = s.lastIndexOf(" ", maxLen - 3);
  return (last > maxLen >> 1 ? s.slice(0, last) : s.slice(0, maxLen - 3)) + "...";
}

/** Strip markdown links [text](url) to plain text (Batch 1 alignment). */
function stripMarkdownLinks(str) {
  if (typeof str !== "string") return str;
  return str.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
}

/** Detect legacy generic hero opener to replace with short CTA (Batch 1 alignment). */
const GENERIC_HERO_PATTERN = /wil jij de beste escort (van|in) .+\?\s*desire escorts helpt graag\!?/i;

/** Normalise FAQ answer: first sentence or max length; escort girl → escort; u/uw → je/jouw. */
function normaliseFaqAnswer(answer, maxLen = 220) {
  let s = trim(answer);
  s = s.replace(/\bescort girl(s)?\b/gi, "escort$1");
  s = s.replace(/\bUw\b/g, "Jouw").replace(/\suw\s/g, " jouw ").replace(/\su\s/g, " je ");
  const firstSentence = s.match(/^[^.!?]+[.!?]/);
  const candidate = firstSentence ? firstSentence[0] : s;
  return truncate(candidate, maxLen);
}

/** Normalise FAQ question: strip ### and escort girl → escort. */
function normaliseFaqQuestion(q) {
  return trim(q.replace(/^#+\s*/, "").replace(/\bescort girl(s)?\b/gi, "escort$1"));
}

/**
 * Extract FAQs: look for section "Veelgestelde vragen" / "FAQ" and question-like lines (?) followed by answer.
 */
function extractFaqs(markdown) {
  const faqs = [];
  const lower = markdown.toLowerCase();
  const faqStarts = [
    lower.indexOf("veelgestelde vragen"),
    lower.indexOf("## faq"),
    lower.indexOf("### faq"),
    lower.indexOf("veelgestelde vraag"),
  ].filter((i) => i >= 0);
  const faqStart = faqStarts.length ? Math.min(...faqStarts) : -1;
  const section = faqStart >= 0 ? markdown.slice(faqStart) : markdown;

  const qaPattern =
    /(?:^|\n)(?:\*\*)?([^\n*]+?\?)\s*(?:\*\*)?\s*\n+([^\n#*]+(?:\n(?!\s*[#*]|\s*[A-Z][a-z]+:)[^\n#*]*)*)/gm;
  let m;
  while ((m = qaPattern.exec(section)) !== null) {
    const question = normaliseFaqQuestion(trim(m[1]).replace(/\*\*/g, ""));
    const answer = normaliseFaqAnswer(trim(m[2]).replace(/\*\*/g, ""));
    if (question.length > 10 && answer.length > 15)
      faqs.push({ question: truncate(question, 200), answer });
  }

  if (faqs.length > 0) return faqs.slice(0, 10);

  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = trim(lines[i]);
    if (line.endsWith("?") && line.length > 15 && line.length < 250) {
      const answerParts = [];
      i++;
      while (i < lines.length) {
        const next = trim(lines[i]);
        if (!next) {
          i++;
          break;
        }
        if (next.startsWith("#") || (next.endsWith("?") && answerParts.length > 0)) break;
        answerParts.push(next);
        i++;
      }
      const answer = normaliseFaqAnswer(answerParts.join(" "));
      if (answer.length > 20) faqs.push({ question: truncate(normaliseFaqQuestion(line), 200), answer });
    } else {
      i++;
    }
  }
  return faqs.slice(0, 10);
}

/**
 * Extract hotels: section with "Hotel" in heading, or any list item containing "Hotel" in the name.
 */
function extractHotels(markdown, cityLabel) {
  const seen = new Set();
  const hotels = [];
  const sections = markdown.split(/\n##?\s+/);
  for (const block of sections) {
    const firstLine = block.split("\n")[0] || "";
    const isHotelSection = /hotel|accommodatie|overnachten/i.test(firstLine);
    const listMatch = block.match(/(?:^|\n)(?:[-*]|\d+\.)\s*\*?\*?([^*\n]+?)(?:\*?\*?\s*[-–—]\s*([^\n]+))?/g);
    if (listMatch) {
      for (const item of listMatch) {
        const m = item.match(/(?:^|\n)(?:[-*]|\d+\.)\s*\*?\*?([^*\n]+?)(?:\*?\*?\s*[-–—]\s*([^\n]+))?/);
        if (m) {
          const name = trim(m[1]).replace(/\*\*/g, "");
          const desc = trim((m[2] || "").replace(/\*\*/g, ""));
          const looksLikeHotel = /hotel|grand|hilton|hyatt|okura|sofitel|waldorf|conservatorium|marriott|ibis|nh\s|van der valk/i.test(name);
          if ((isHotelSection || looksLikeHotel) && name.length > 3 && (name.length < 80 || desc)) {
            const key = name.slice(0, 60).toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              hotels.push({
                name: truncate(name, 120),
                description: desc ? truncate(stripMarkdownLinks(desc), 200) : `Discrete locatie in ${cityLabel}.`,
              });
            }
          }
        }
      }
    }
  }
  return hotels.slice(0, 6);
}

/**
 * First meaningful paragraph(s) before first ## as hero intro.
 * Strip markdown; replace generic legacy opener with Batch 1-style CTA.
 */
function extractHeroIntro(markdown, cityLabel) {
  const beforeFirstH2 = markdown.split(/\n##\s+/)[0] || "";
  const paragraphs = beforeFirstH2
    .split(/\n\n+/)
    .map((p) => trim(p))
    .filter((p) => p.length > 40 && !p.startsWith("#"));
  let intro = stripMarkdownLinks(paragraphs.slice(0, 2).join(" "));
  if (GENERIC_HERO_PATTERN.test(intro))
    intro = `Escort service in ${cityLabel} met snelle beschikbaarheid en discrete afhandeling. Boek via live chat of WhatsApp.`;
  else if (intro.length > 50) intro = truncate(intro, 320);
  else intro = `Escort service in ${cityLabel} met snelle beschikbaarheid en discrete afhandeling. Boek via live chat of WhatsApp.`;
  return intro;
}

/**
 * Extract narrative: a block about the location (e.g. after "Escort in X" or "Over X").
 */
function extractNarrative(markdown, cityLabel) {
  const sections = markdown.split(/\n##\s+/);
  for (let i = 1; i < sections.length; i++) {
    const head = (sections[i].split("\n")[0] || "").toLowerCase();
    if (
      head.includes(cityLabel.toLowerCase()) ||
      head.includes("over ") ||
      head.includes("in ") ||
      head.includes("escort ") ||
      head.includes("waar ")
    ) {
      const body = sections[i].replace(/^[^\n]+\n/, "").split(/\n##\s+/)[0];
      let text = body
        .split("\n\n")
        .map((p) => trim(p))
        .filter((p) => p.length > 30 && !p.startsWith("#") && !p.startsWith("-"))
        .slice(0, 3)
        .join(" ");
      text = stripMarkdownLinks(text);
      if (text.length > 80) return truncate(text, 500);
    }
  }
  const firstLong = sections
    .slice(1)
    .map((s) => trim(s.replace(/^[^\n]+\n/, "").split(/\n##\s+/)[0]))
    .find((p) => p.length > 100);
  return firstLong ? truncate(stripMarkdownLinks(firstLong), 500) : "";
}

function extractSpeedSummary(markdown, cityLabel) {
  const m = markdown.match(/(?:binnen|vaak binnen|service binnen)\s*(\d+)\s*(?:min|minuten|uur)/i);
  if (m) return `Binnen ${m[1]} minuten in ${cityLabel} mogelijk`;
  if (/binnen\s+(\d+)\s*uur/i.test(markdown)) return `Binnen 1-2 uur in ${cityLabel} mogelijk`;
  return `Snelle service in ${cityLabel}`;
}

function extractPricingSummary(markdown) {
  const m = markdown.match(/(?:vanaf|startprijs|€)\s*(\d{2,4})\s*(?:voor|per)/i) ?? markdown.match(/€\s*(\d{2,4})/);
  if (m) return `Vanaf €${m[1]} voor minimaal 1 uur`;
  return "Vanaf €160 voor minimaal 1 uur";
}

function inferCityFromSlug(slug) {
  return slug
    .replace(/^escort-/, "")
    .split("-")
    .map((part) => (part.length > 2 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(" ");
}

/**
 * Build meta from KEYWORD_STRATEGY template (CTR-optimised), not legacy H1/paragraph.
 */
function buildMetaFromTemplate(cityLabel, speedSummary, pricingSummary) {
  const metaTitle = `Escort Service ${cityLabel} | Desire Escorts`;
  const metaDescription = truncate(
    `Escorts in ${cityLabel} beschikbaar voor outcall. ${speedSummary}. ${pricingSummary}. Bekijk beschikbare escorts.`,
    160
  );
  return { metaTitle, metaDescription };
}

function extractOne(slug, markdown) {
  const cityLabel = inferCityFromSlug(slug);
  const speedSummary = extractSpeedSummary(markdown, cityLabel);
  const pricingSummary = extractPricingSummary(markdown);
  const heroIntro = extractHeroIntro(markdown, cityLabel);
  const locationNarrative = extractNarrative(markdown, cityLabel);
  const faqs = extractFaqs(markdown);
  const hotels = extractHotels(markdown, cityLabel);
  const { metaTitle, metaDescription } = buildMetaFromTemplate(cityLabel, speedSummary, pricingSummary);

  return {
    slug,
    heroIntro,
    locationNarrative: locationNarrative || null,
    faqs: faqs.length ? faqs : null,
    hotels: hotels.length ? hotels : null,
    speedSummary,
    pricingSummary,
    metaTitle,
    metaDescription,
  };
}

function run() {
  const { manifestPath, outputPath } = parseArgs(process.argv.slice(2));
  const slugs = readSlugs();
  const manifestPaths = findManifests(manifestPath);
  if (manifestPaths.length === 0) {
    console.error("No Firecrawl manifest found in data/firecrawl/*-manifest.json. Use --manifest <path>.");
    process.exit(1);
  }

  const entries = loadMergedManifestEntries(manifestPaths);
  const byType = new Map(entries.map((e) => [e.type, e]));

  const scopeSet = new Set(slugs);
  const results = {};
  let readCount = 0;
  let failCount = 0;

  for (const slug of slugs) {
    const entry = byType.get(slug);
    if (!entry?.outputFile) {
      results[slug] = { slug, _missingScrape: true };
      failCount++;
      continue;
    }
    const absolutePath = path.resolve(ROOT, entry.outputFile);
    const markdown = getMarkdownFromFirecrawlJson(absolutePath);
    if (!markdown) {
      results[slug] = { slug, _missingFile: true, _path: entry.outputFile };
      failCount++;
      continue;
    }
    readCount++;
    results[slug] = extractOne(slug, markdown);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), manifests: manifestPaths.map((p) => path.relative(ROOT, p)), bySlug: results }, null, 2), "utf8");

  console.log("Location content extraction complete.");
  console.log(`Manifests used: ${manifestPaths.length}`);
  console.log(`Slugs in scope: ${slugs.length}`);
  console.log(`With scrape read: ${readCount}`);
  console.log(`Missing/failed: ${failCount}`);
  console.log(`Output: ${path.relative(ROOT, outputPath)}`);
}

run();
