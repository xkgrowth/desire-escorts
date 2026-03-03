import type {
  CupSize,
  Geaardheid,
  HaarKleur,
  OogKleur,
  Postuur,
  Profile,
} from "@/lib/types/profile";

export type FilterState = {
  availableOnly: boolean;
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  cupSizeMin?: CupSize;
  cupSizeMax?: CupSize;
  services: string[];
  buildTypes: Postuur[];
  hairColors: HaarKleur[];
  eyeColors: OogKleur[];
  orientations: Geaardheid[];
};

export type FilterOption = {
  value: string;
  label: string;
  count: number;
};

export type RangeOption = {
  min: number;
  max: number;
};

export type FilterOptionSet = {
  services: FilterOption[];
  buildTypes: FilterOption[];
  hairColors: FilterOption[];
  eyeColors: FilterOption[];
  orientations: FilterOption[];
  cupSizes: FilterOption[];
  ageRange: RangeOption;
  heightRange: RangeOption;
  totalCount: number;
  availableCount: number;
};

export const CUP_SIZE_ORDER: CupSize[] = [
  "A cup",
  "B cup",
  "C cup",
  "D cup",
  "DD cup",
  "E cup",
  "F cup",
];

export const BUILD_TYPE_ORDER: Postuur[] = ["Slank", "Normaal", "Vol"];
export const HAIR_COLOR_ORDER: HaarKleur[] = ["Blond", "Donkerblond", "Bruin", "Zwart"];
export const EYE_COLOR_ORDER: OogKleur[] = ["Blauw", "Groen", "Grijs", "Bruin"];
export const ORIENTATION_ORDER: Geaardheid[] = ["Heteroseksueel", "Biseksueel"];

export const defaultFilterState: FilterState = {
  availableOnly: false,
  services: [],
  buildTypes: [],
  hairColors: [],
  eyeColors: [],
  orientations: [],
};

export type FilterArrayKey =
  | "services"
  | "buildTypes"
  | "hairColors"
  | "eyeColors"
  | "orientations";

export type FilterRangeFacet = "age" | "height" | "cupSize";

export type FilterFacet =
  | FilterArrayKey
  | "availableOnly"
  | FilterRangeFacet;

export function cupSizeIndex(size: CupSize | undefined): number {
  if (!size) return -1;
  return CUP_SIZE_ORDER.indexOf(size);
}

export function hasActiveFilters(filters: FilterState): boolean {
  if (filters.availableOnly) return true;
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) return true;
  if (filters.heightMin !== undefined || filters.heightMax !== undefined) return true;
  if (filters.cupSizeMin !== undefined || filters.cupSizeMax !== undefined) return true;
  if (filters.services.length > 0) return true;
  if (filters.buildTypes.length > 0) return true;
  if (filters.hairColors.length > 0) return true;
  if (filters.eyeColors.length > 0) return true;
  if (filters.orientations.length > 0) return true;
  return false;
}

export function sanitizeFilterState(value: unknown): FilterState {
  if (!value || typeof value !== "object") {
    return defaultFilterState;
  }

  const candidate = value as Partial<FilterState>;
  return {
    availableOnly: Boolean(candidate.availableOnly),
    ageMin: typeof candidate.ageMin === "number" ? candidate.ageMin : undefined,
    ageMax: typeof candidate.ageMax === "number" ? candidate.ageMax : undefined,
    heightMin: typeof candidate.heightMin === "number" ? candidate.heightMin : undefined,
    heightMax: typeof candidate.heightMax === "number" ? candidate.heightMax : undefined,
    cupSizeMin: CUP_SIZE_ORDER.includes(candidate.cupSizeMin as CupSize)
      ? (candidate.cupSizeMin as CupSize)
      : undefined,
    cupSizeMax: CUP_SIZE_ORDER.includes(candidate.cupSizeMax as CupSize)
      ? (candidate.cupSizeMax as CupSize)
      : undefined,
    services: Array.isArray(candidate.services)
      ? candidate.services.filter((item): item is string => typeof item === "string")
      : [],
    buildTypes: Array.isArray(candidate.buildTypes)
      ? candidate.buildTypes.filter((item): item is Postuur =>
          BUILD_TYPE_ORDER.includes(item as Postuur)
        )
      : [],
    hairColors: Array.isArray(candidate.hairColors)
      ? candidate.hairColors.filter((item): item is HaarKleur =>
          HAIR_COLOR_ORDER.includes(item as HaarKleur)
        )
      : [],
    eyeColors: Array.isArray(candidate.eyeColors)
      ? candidate.eyeColors.filter((item): item is OogKleur =>
          EYE_COLOR_ORDER.includes(item as OogKleur)
        )
      : [],
    orientations: Array.isArray(candidate.orientations)
      ? candidate.orientations.filter((item): item is Geaardheid =>
          ORIENTATION_ORDER.includes(item as Geaardheid)
        )
      : [],
  };
}

export function profileRangeBounds(
  profiles: Profile[],
  key: "age" | "height",
  fallback: RangeOption
): RangeOption {
  const values = profiles
    .map((profile) => profile[key])
    .filter((value): value is number => typeof value === "number");

  if (values.length === 0) {
    return fallback;
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
