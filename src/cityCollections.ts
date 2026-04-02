import type { CityStatus, CityTier, ScoringPillar, SmartCity } from "./types";

export function filterCities(
  cities: SmartCity[],
  filters: { status?: "all" | CityStatus; tier?: "all" | CityTier },
): SmartCity[] {
  return cities.filter(city => {
    const statusMatches = !filters.status || filters.status === "all" || city.status === filters.status;
    const tierMatches = !filters.tier || filters.tier === "all" || city.tier === filters.tier;
    return statusMatches && tierMatches;
  });
}

export function sortCities(
  cities: SmartCity[],
  sortBy: ScoringPillar | "composite" = "composite",
): SmartCity[] {
  return [...cities].sort((left, right) => {
    const leftScore = sortBy === "composite" ? left.compositeScore : left.scores[sortBy];
    const rightScore = sortBy === "composite" ? right.compositeScore : right.scores[sortBy];

    if (rightScore !== leftScore) return rightScore - leftScore;
    return left.nameEn.localeCompare(right.nameEn);
  });
}

export function groupCitiesByTier(cities: SmartCity[]) {
  return {
    alpha: cities.filter(city => city.tier === "alpha"),
    beta: cities.filter(city => city.tier === "beta"),
    gamma: cities.filter(city => city.tier === "gamma"),
  };
}

export function summarizeCities(cities: SmartCity[]) {
  const { alpha, beta, gamma } = groupCitiesByTier(cities);

  return {
    total: cities.length,
    certified: cities.filter(city => city.status === "certified").length,
    promotion: cities.filter(city => city.status === "promotion").length,
    alpha: alpha.length,
    beta: beta.length,
    gamma: gamma.length,
    operational: cities.filter(city => city.reality === "operational").length,
  };
}

export function getSpotlightCities(cities: SmartCity[], limit = 3): SmartCity[] {
  return sortCities(cities, "composite").slice(0, limit);
}

