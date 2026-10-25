import type { SmartCity } from "./types";
import { resolveProvince } from "./dimensionScores";
import { PROVINCE_BASELINE, type BaselineIndicator } from "./provinceBaselineData";

/** A dated province count is not a municipal mortality rate or a safety rank. */
export function getHomeRoadEvidence(
  cities: SmartCity[],
  indicator: BaselineIndicator | undefined = PROVINCE_BASELINE.find(item => item.id === "rtddi-road-deaths"),
) {
  if (!indicator) return { source: null, entries: [] };
  const representatives = new Map<string, SmartCity>();
  for (const city of cities) {
    const province = resolveProvince(city.province);
    const previous = representatives.get(province);
    if (!previous || city.compositeScore > previous.compositeScore ||
      (city.compositeScore === previous.compositeScore && city.id.localeCompare(previous.id) < 0)) {
      representatives.set(province, city);
    }
  }
  const entries = [...representatives].flatMap(([province, city]) => {
    const deaths = indicator.provinces[province];
    return Number.isInteger(deaths) && deaths >= 0 ? [{ province, city, deaths }] : [];
  }).sort((left, right) => right.deaths - left.deaths || left.province.localeCompare(right.province)).slice(0, 5);
  return { source: indicator, entries };
}
