import fs from "node:fs";
import path from "node:path";

type KnowledgeCsvRecord = {
  type: string;
  id: number;
  date: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  status: string;
  slug: string;
  modifiedDate: string;
  categoryIds: number[];
  taxonomy: string;
  termId: number;
  termName: string;
  termSlug: string;
  assignedDocs: number[];
  docCategoryOrder: number;
};

export type KnowledgeTocItem = {
  id: string;
  level: 2 | 3;
  title: string;
};

export type KnowledgeDoc = {
  id: number;
  slug: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  date: string;
  modifiedDate: string;
  readTimeMinutes: number;
  readTimeLabel: string;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  categoryPath: string;
  path: string;
  toc: KnowledgeTocItem[];
};

export type KnowledgeCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
  docs: KnowledgeDoc[];
};

const DATA_FILE_PATH = path.join(
  process.cwd(),
  "data/wordpress/knowledge-centre/betterdocs_docs.2026-03-12.csv"
);

const NL_DOC_CATEGORY_SLUGS = new Set([
  "boeken-reserveringen",
  "prijzen-betaling",
  "services-ervaring",
  "discretie-veiligheid",
  "locatie-beschikbaarheid",
]);

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
  hellip: "...",
  ndash: "-",
  mdash: "-",
  rsquo: "'",
  lsquo: "'",
  rdquo: "\"",
  ldquo: "\"",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, entity) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return ENTITY_MAP[entity] || full;
  });
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(contentHtml: string): number {
  const text = stripHtml(contentHtml);
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizePathname(urlOrPath: string): string {
  if (!urlOrPath) {
    return "/";
  }

  const withoutDomain = urlOrPath
    .replace(/^https?:\/\/desire-escorts\.nl/i, "")
    .replace(/^https?:\/\/www\.desire-escorts\.nl/i, "");

  if (!withoutDomain.startsWith("/")) {
    return `/${withoutDomain}`;
  }

  return withoutDomain;
}

function normalizeDocHtml(contentHtml: string): string {
  return contentHtml
    .replace(/href=""([^"]+)""/g, 'href="$1"')
    .replace(/src=""([^"]+)""/g, 'src="$1"')
    .replace(/https?:\/\/(?:www\.)?desire-escorts\.nl(\/[^"'\s<]*)/gi, (_, pathName) =>
      normalizePathname(pathName)
    );
}

function slugify(value: string): string {
  const normalized = decodeHtmlEntities(value)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || "section";
}

function addHeadingAnchors(contentHtml: string): { html: string; toc: KnowledgeTocItem[] } {
  const slugUsage = new Map<string, number>();
  const toc: KnowledgeTocItem[] = [];

  const htmlWithAnchors = contentHtml.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full, levelValue, attributes, innerHtml) => {
      const level = Number.parseInt(levelValue, 10);
      if (level !== 2 && level !== 3) {
        return full;
      }

      const title = stripHtml(innerHtml);
      if (!title) {
        return full;
      }

      const baseId = slugify(title);
      const currentUse = slugUsage.get(baseId) || 0;
      slugUsage.set(baseId, currentUse + 1);
      const id = currentUse === 0 ? baseId : `${baseId}-${currentUse + 1}`;
      const cleanAttributes = attributes.replace(/\s+id="[^"]*"/i, "");

      toc.push({
        id,
        level: level as 2 | 3,
        title,
      });

      return `<h${level}${cleanAttributes} id="${id}">${innerHtml}</h${level}>`;
    }
  );

  return { html: htmlWithAnchors, toc };
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentField += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

function toInt(value: string): number {
  const parsed = Number.parseInt((value || "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseIntList(value: string): number[] {
  if (!value || !value.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((part) => toInt(part))
    .filter((item) => item > 0);
}

function parseKnowledgeCsvRecords(): KnowledgeCsvRecord[] {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
  const rows = parseCsv(raw);

  if (rows.length < 2) {
    return [];
  }

  return rows.slice(1).map((columns) => ({
    type: (columns[0] || "").trim(),
    id: toInt(columns[1] || ""),
    date: (columns[3] || "").trim(),
    title: (columns[5] || "").trim(),
    contentHtml: columns[6] || "",
    excerpt: columns[7] || "",
    status: (columns[8] || "").trim(),
    slug: (columns[10] || "").trim(),
    modifiedDate: (columns[11] || "").trim(),
    categoryIds: parseIntList(columns[17] || ""),
    taxonomy: (columns[28] || "").trim(),
    termId: toInt(columns[29] || ""),
    termName: (columns[30] || "").trim(),
    termSlug: (columns[31] || "").trim(),
    assignedDocs: parseIntList(columns[34] || ""),
    docCategoryOrder: toInt(columns[37] || ""),
  }));
}

function buildKnowledgeStore() {
  const records = parseKnowledgeCsvRecords();

  const categoryTerms = records
    .filter((record) => record.type === "Term" && record.taxonomy === "doc_category")
    .map((record) => ({
      id: record.termId,
      slug: record.termSlug,
      name: decodeHtmlEntities(record.termName),
      order: record.docCategoryOrder || 999,
      assignedDocs: record.assignedDocs,
    }))
    .filter((term) => term.id > 0 && NL_DOC_CATEGORY_SLUGS.has(term.slug));

  const categoryById = new Map(categoryTerms.map((term) => [term.id, term]));

  const docRows = records.filter(
    (record) =>
      record.type === "Docs" &&
      record.status === "publish" &&
      record.slug &&
      record.categoryIds.some((categoryId) => categoryById.has(categoryId))
  );

  const latestByPath = new Map<string, KnowledgeDoc>();

  for (const row of docRows) {
    const categoryId = row.categoryIds.find((id) => categoryById.has(id));
    if (!categoryId) {
      continue;
    }

    const category = categoryById.get(categoryId);
    if (!category) {
      continue;
    }

    const categoryPath = `/kennisbank/${category.slug}/`;
    const docPath = `/kennisbank/${category.slug}/${row.slug}/`;
    const normalizedContent = normalizeDocHtml(row.contentHtml);
    const anchored = addHeadingAnchors(normalizedContent);
    const readTimeMinutes = estimateReadTime(normalizedContent);
    const doc: KnowledgeDoc = {
      id: row.id,
      slug: row.slug,
      title: decodeHtmlEntities(row.title),
      contentHtml: anchored.html,
      excerpt: stripHtml(row.excerpt || normalizedContent),
      date: row.date,
      modifiedDate: row.modifiedDate,
      readTimeMinutes,
      readTimeLabel: `${readTimeMinutes} min`,
      categoryId,
      categorySlug: category.slug,
      categoryName: category.name,
      categoryPath,
      path: docPath,
      toc: anchored.toc,
    };

    const existing = latestByPath.get(doc.path);
    if (!existing) {
      latestByPath.set(doc.path, doc);
      continue;
    }

    const existingDate = new Date(existing.modifiedDate || existing.date || 0).getTime();
    const nextDate = new Date(doc.modifiedDate || doc.date || 0).getTime();
    if (nextDate >= existingDate) {
      latestByPath.set(doc.path, doc);
    }
  }

  const allDocs = [...latestByPath.values()];

  const categories: KnowledgeCategory[] = categoryTerms
    .map((category) => {
      const docsInCategory = allDocs.filter((doc) => doc.categoryId === category.id);
      const assignedOrderMap = new Map<number, number>();
      category.assignedDocs.forEach((docId, index) => {
        assignedOrderMap.set(docId, index);
      });

      docsInCategory.sort((a, b) => {
        const aAssigned = assignedOrderMap.get(a.id);
        const bAssigned = assignedOrderMap.get(b.id);

        if (aAssigned !== undefined && bAssigned !== undefined) {
          return aAssigned - bAssigned;
        }
        if (aAssigned !== undefined) {
          return -1;
        }
        if (bAssigned !== undefined) {
          return 1;
        }

        const aDate = new Date(a.modifiedDate || a.date || 0).getTime();
        const bDate = new Date(b.modifiedDate || b.date || 0).getTime();
        return bDate - aDate;
      });

      return {
        id: category.id,
        slug: category.slug,
        name: category.name,
        order: category.order,
        docs: docsInCategory,
      };
    })
    .filter((category) => category.docs.length > 0)
    .sort((a, b) => a.order - b.order);

  const docsByPath = new Map(allDocs.map((doc) => [doc.path, doc]));

  return {
    categories,
    docsByPath,
  };
}

const knowledgeStore = buildKnowledgeStore();

export function getKnowledgeCategories(): KnowledgeCategory[] {
  return knowledgeStore.categories;
}

export function getKnowledgeCategoryBySlug(categorySlug: string): KnowledgeCategory | null {
  return knowledgeStore.categories.find((category) => category.slug === categorySlug) || null;
}

export function getKnowledgeDocByCategoryAndSlug(
  categorySlug: string,
  slug: string
): KnowledgeDoc | null {
  const pathKey = `/kennisbank/${categorySlug}/${slug}/`;
  return knowledgeStore.docsByPath.get(pathKey) || null;
}

export function getKnowledgeDocPaths(): Array<{ category: string; slug: string }> {
  return knowledgeStore.categories.flatMap((category) =>
    category.docs.map((doc) => ({
      category: category.slug,
      slug: doc.slug,
    }))
  );
}

export function getRelatedKnowledgeDocs(
  categorySlug: string,
  slug: string,
  limit = 8
): KnowledgeDoc[] {
  const category = getKnowledgeCategoryBySlug(categorySlug);
  if (!category) {
    return [];
  }

  return category.docs.filter((doc) => doc.slug !== slug).slice(0, limit);
}
