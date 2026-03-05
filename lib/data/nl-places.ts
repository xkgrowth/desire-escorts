import { readFile } from "node:fs/promises";
import path from "node:path";

export type DutchPlace = {
  name: string;
  province: string;
};

const DATASET_DIR_CANDIDATES = [
  process.env.CBS_WOONPLAATSEN_DATASET_DIR,
  "/Users/xennith/Downloads/85210NED-202304260104",
].filter((value): value is string => Boolean(value));

let placesCache: Promise<DutchPlace[]> | null = null;

function parseSemicolonRow(line: string): string[] {
  return line.split(";").map((cell) => cell.trim());
}

async function readCsvRows(filePath: string): Promise<string[][]> {
  const content = await readFile(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map(parseSemicolonRow);
}

async function loadFromDatasetDir(datasetDir: string): Promise<DutchPlace[]> {
  const placesFile = path.join(datasetDir, "WoonplaatsenCodes.csv");
  const observationsFile = path.join(datasetDir, "Observations.csv");

  const [placeRows, observationRows] = await Promise.all([
    readCsvRows(placesFile),
    readCsvRows(observationsFile),
  ]);

  const placeNameByCode = new Map<string, string>();
  for (const row of placeRows.slice(1)) {
    const code = row[0];
    const placeName = row[4];
    if (!code || !placeName) continue;
    placeNameByCode.set(code, placeName);
  }

  const provinceByCode = new Map<string, string>();
  for (const row of observationRows.slice(1)) {
    const measure = row[1];
    if (measure !== "PV0002") continue;
    const placeCode = row[2];
    const province = row[4];
    if (!placeCode || !province) continue;
    provinceByCode.set(placeCode, province);
  }

  const dedupe = new Set<string>();
  const places: DutchPlace[] = [];

  for (const [code, name] of placeNameByCode.entries()) {
    const province = provinceByCode.get(code);
    if (!province) continue;
    const dedupeKey = `${name.toLowerCase()}|${province.toLowerCase()}`;
    if (dedupe.has(dedupeKey)) continue;
    dedupe.add(dedupeKey);
    places.push({ name, province });
  }

  return places.sort((a, b) => a.name.localeCompare(b.name, "nl"));
}

async function loadDutchPlaces(): Promise<DutchPlace[]> {
  for (const datasetDir of DATASET_DIR_CANDIDATES) {
    try {
      return await loadFromDatasetDir(datasetDir);
    } catch {
      // Try next candidate directory.
    }
  }

  return [];
}

export async function getDutchPlaces(): Promise<DutchPlace[]> {
  if (!placesCache) {
    placesCache = loadDutchPlaces();
  }
  return placesCache;
}
