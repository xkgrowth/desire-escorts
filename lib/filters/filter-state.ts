/**
 * Filter state types and defaults for profile filtering.
 */

import type { CupSize, Postuur, HaarKleur, OogKleur, Geaardheid } from "@/lib/types/profile";

export type FilterState = {
  // Availability
  availableOnly: boolean;

  // Ranges
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;

  // Cup size range (index-based for range slider)
  cupSizeMin?: CupSize;
  cupSizeMax?: CupSize;

  // Enumerations
  postuur?: Postuur[];
  haarKleur?: HaarKleur[];
  oogKleur?: OogKleur[];
  geaardheid?: Geaardheid[];

  // Relations
  services?: string[];
};

export const defaultFilterState: FilterState = {
  availableOnly: false,
};

// Cup size order for range comparisons
export const CUP_SIZE_ORDER: CupSize[] = [
  "A cup",
  "B cup",
  "C cup",
  "D cup",
  "DD cup",
  "E cup",
  "F cup",
];

export function cupSizeIndex(size: CupSize | undefined): number {
  if (!size) return -1;
  return CUP_SIZE_ORDER.indexOf(size);
}

// Display labels for filter UI
export const POSTUUR_OPTIONS: { value: Postuur; label: string }[] = [
  { value: "Slank", label: "Slank" },
  { value: "Normaal", label: "Normaal" },
  { value: "Vol", label: "Vol" },
];

export const HAAR_KLEUR_OPTIONS: { value: HaarKleur; label: string }[] = [
  { value: "Blond", label: "Blond" },
  { value: "Bruin", label: "Bruin" },
  { value: "Donkerblond", label: "Donkerblond" },
  { value: "Zwart", label: "Zwart" },
];

export const OOG_KLEUR_OPTIONS: { value: OogKleur; label: string }[] = [
  { value: "Blauw", label: "Blauw" },
  { value: "Bruin", label: "Bruin" },
  { value: "Grijs", label: "Grijs" },
  { value: "Groen", label: "Groen" },
];

export const GEAARDHEID_OPTIONS: { value: Geaardheid; label: string }[] = [
  { value: "Heteroseksueel", label: "Heteroseksueel" },
  { value: "Biseksueel", label: "Biseksueel" },
];

export const CUP_SIZE_OPTIONS: { value: CupSize; label: string }[] = [
  { value: "A cup", label: "A" },
  { value: "B cup", label: "B" },
  { value: "C cup", label: "C" },
  { value: "D cup", label: "D" },
  { value: "DD cup", label: "DD" },
  { value: "E cup", label: "E" },
  { value: "F cup", label: "F" },
];
