// ---------------------------------------------------------------------------
// Regions — shared labels and ordering for Thailand's six SCITI regions
// ---------------------------------------------------------------------------
// Lifted out of RankingsPage so the Homepage's regional-champions block,
// the Rankings filter chips, and any future map/compare surface all read
// from the same source.
// ---------------------------------------------------------------------------

import type { Locale, SmartCity } from "./types";

export type Region = SmartCity["region"];

/** Canonical display order — roughly north-to-south, central in the middle. */
export const REGIONS_ORDERED: Region[] = [
  "north",
  "northeast",
  "central",
  "bangkok",
  "east",
  "south",
];

export const REGION_LABELS: Record<Locale, Record<Region | "all", string>> = {
  en: {
    all: "All",
    bangkok: "Bangkok",
    central: "Central",
    north: "North",
    northeast: "Northeast",
    east: "East",
    south: "South",
  },
  th: {
    all: "ทั้งหมด",
    bangkok: "กรุงเทพฯ",
    central: "ภาคกลาง",
    north: "ภาคเหนือ",
    northeast: "ภาคตะวันออกเฉียงเหนือ",
    east: "ภาคตะวันออก",
    south: "ภาคใต้",
  },
  zh: {
    all: "全部",
    bangkok: "曼谷",
    central: "中部",
    north: "北部",
    northeast: "东北部",
    east: "东部",
    south: "南部",
  },
};
