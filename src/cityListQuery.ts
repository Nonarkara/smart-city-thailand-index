import type { CityScores, CityStatus, CityTier, ScoringPillar } from "./types";

export type CityListStatus = "all" | CityStatus;
export type CityListTier = "all" | CityTier;
export type CityListSort = "composite" | ScoringPillar;

export type CityListQuery = {
  status?: string;
  tier?: string;
  sort?: string;
};

const PILLARS = new Set<ScoringPillar>([
  "livability",
  "economy",
  "safety",
  "wellbeing",
  "environment",
  "hospitality",
  "digital",
]);

type ListableCity = {
  status: string;
  tier: string | null;
  compositeScore: number | null;
  scores: CityScores | null;
  nameEn: string;
};

export function parseCityListQuery(query: CityListQuery = {}): {
  status: CityListStatus;
  tier: CityListTier;
  sort: CityListSort;
} {
  const status = query.status;
  const tier = query.tier;
  const sort = query.sort;

  return {
    status: status === "certified" || status === "promotion" || status === "registered" ? status : "all",
    tier: tier === "alpha" || tier === "beta" || tier === "gamma" ? tier : "all",
    sort: sort && PILLARS.has(sort as ScoringPillar) ? sort as ScoringPillar : "composite",
  };
}

export function filterCitySummaries<T extends ListableCity>(cities: readonly T[], query: CityListQuery = {}): T[] {
  const { status, tier, sort } = parseCityListQuery(query);

  return cities
    .filter(city => status === "all" || city.status === status)
    .filter(city => tier === "all" || city.tier === tier)
    .slice()
    .sort((left, right) => {
      // An unassessed city has no score; it sorts after every assessed one, never among them.
      const leftScore = sort === "composite" ? left.compositeScore : left.scores?.[sort] ?? null;
      const rightScore = sort === "composite" ? right.compositeScore : right.scores?.[sort] ?? null;
      if (leftScore === null && rightScore !== null) return 1;
      if (rightScore === null && leftScore !== null) return -1;
      if (leftScore !== null && rightScore !== null && rightScore !== leftScore) return rightScore - leftScore;
      return left.nameEn.localeCompare(right.nameEn);
    });
}
