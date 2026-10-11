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
  tier: string;
  compositeScore: number;
  scores: CityScores;
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
      const leftScore = sort === "composite" ? left.compositeScore : left.scores[sort];
      const rightScore = sort === "composite" ? right.compositeScore : right.scores[sort];
      if (rightScore !== leftScore) return rightScore - leftScore;
      return left.nameEn.localeCompare(right.nameEn);
    });
}
