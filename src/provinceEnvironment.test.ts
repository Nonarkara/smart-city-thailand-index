import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { buildFacets } from "./baselineFacets";
import { deriveAll, INDICATORS, resolveProvince } from "./dimensionScores";
import { PROVINCE_BASELINE, PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData";

/**
 * The environment dimension used to be scored from hand-typed city metrics —
 * numbers whose vintage and method nobody could name. It is now scored from
 * two published provincial series: PM2.5 from the Pollution Control
 * Department, forest cover from the Royal Forest Department.
 *
 * Three things must stay true, and each one can rot silently:
 *
 *   1. The PM2.5 province value is the mean of the stations it was built from.
 *      The source publishes stations, not a province total, so the arithmetic
 *      is ours — and a reader must be able to redo it from the stored values.
 *
 *   2. A province with no forest area is a VERIFIED ZERO, not a gap. Three
 *      provinces have no forest at all; rendering them as "missing" would let
 *      a city claim an environment score it never earned.
 *
 *   3. The facet a person filters on and the number the engine scores must be
 *      the same number. This is the invariant that broke once already, when
 *      internet and mobile were labelled "governance" on one page and "people"
 *      on another.
 */

const facets = buildFacets(allCities);
const derivations = deriveAll(allCities);
const byCity = new Map(allCities.map((c) => [c.id, c]));

describe("provincial environment indicators", () => {
  it("reproduces every PM2.5 province value from the stations it came from", () => {
    const pm25 = PROVINCE_BASELINE.find((i) => i.id === "pcd-pm25-annual")!;
    expect(pm25).toBeTruthy();
    expect(pm25.aggregate).toBe("mean");
    expect(pm25.year).toBe(2024);
    expect(pm25.stations).toBeTruthy();

    for (const [province, value] of Object.entries(pm25.provinces)) {
      const stations = pm25.stations![province];
      expect(stations, `${province} has a value but no station list`).toBeTruthy();
      expect(stations.length, `${province} has no stations`).toBeGreaterThan(0);
      const mean = stations.reduce((a, b) => a + b, 0) / stations.length;
      expect(
        Math.round(mean * 10) / 10,
        `${province} does not equal the mean of its ${stations.length} stations`,
      ).toBeCloseTo(value, 6);
    }
  });

  it("covers more than 60 provinces with PM2.5 and every one with forest", () => {
    const pm25 = PROVINCE_BASELINE_BY_ID["pcd-pm25-annual"];
    const forest = PROVINCE_BASELINE_BY_ID["rfd-forest-coverage"];
    expect(Object.keys(pm25).length).toBeGreaterThanOrEqual(60);
    expect(Object.keys(forest).length).toBe(77);
  });

  it("treats a province with no forest area as a verified zero, not a gap", () => {
    const forest = PROVINCE_BASELINE_BY_ID["rfd-forest-coverage"];
    // The department records these as "ไม่มีพื้นที่ป่าไม้" — no forest area.
    for (const province of ["Nonthaburi", "Pathum Thani", "Ang Thong"]) {
      expect(province in forest, `${province} is missing from the forest series`).toBe(true);
      expect(forest[province], `${province} should be a verified zero`).toBe(0);
    }
    // And forest cover is a share, so it cannot exceed 100.
    for (const value of Object.values(forest)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it("scores PM2.5 and forest from the published province series, not city metrics", () => {
    for (const id of ["pm25", "forest-coverage"]) {
      const ind = INDICATORS.find((i) => i.id === id)!;
      expect(ind, `${id} is missing from the indicator catalogue`).toBeTruthy();
      expect(ind.origin, `${id} must not be scored from a hand-typed city metric`).toBe("province");
      expect(ind.provinceId).toBeTruthy();
      expect(ind.metricKey).toBeUndefined();
    }
  });

  it("scores Smart Environment for every one of the 118 cities", () => {
    const unscored = [...derivations.values()].filter(
      (d) => d.dimensions.environment.score == null,
    );
    expect(
      unscored.map((d) => d.cityId),
      "these cities have no environment score at all",
    ).toEqual([]);
    // Coverage is reported, not assumed: every city must be told how much of
    // the environment weight it actually had.
    for (const d of derivations.values()) {
      const env = d.dimensions.environment;
      expect(env.coverage).toBeGreaterThan(0);
      expect(env.coverage).toBeLessThanOrEqual(1);
    }
  });

  it("reports a verified-zero forest province as scored, not missing", () => {
    // A city in a forestless province must still receive an environment
    // score, and the forest contribution must be 0 — not null.
    const nonthaburi = allCities.find((c) => resolveProvince(c.province) === "Nonthaburi");
    expect(nonthaburi, "expected a city in Nonthaburi").toBeTruthy();
    const d = derivations.get(nonthaburi!.id)!;
    const forest = d.dimensions.environment.contributions.find((c) => c.id === "forest-coverage")!;
    expect(forest).toBeTruthy();
    expect(forest.raw).toBe(0);
    expect(forest.score).toBe(0);
  });

  it("shows the facet the same number the engine scores", () => {
    for (const facetId of ["pm25", "forest-coverage"]) {
      const facet = facets.find((f) => f.id === facetId)!;
      expect(facet, `${facetId} has no facet`).toBeTruthy();
      expect(facet.coverage, `${facetId} has no coverage`).toBeGreaterThan(0);
      for (const city of allCities) {
        const facetValue = facet.value(city);
        if (facetValue == null) continue;
        const d = derivations.get(city.id)!;
        const contribution = d.dimensions.environment.contributions.find(
          (c) => c.id === facetId,
        );
        expect(contribution, `${facetId} is not scored for ${city.id}`).toBeTruthy();
        expect(
          contribution!.raw,
          `${facetId}: facet says ${facetValue}, engine scored ${contribution!.raw}`,
        ).toBeCloseTo(facetValue, 6);
      }
    }
  });

  it("keeps every environment indicator's dimension in step with its source record", () => {
    for (const ind of INDICATORS.filter((i) => i.dimension === "environment")) {
      if (!ind.provinceId) continue;
      const record = PROVINCE_BASELINE.find((i) => i.id === ind.provinceId);
      expect(record, `${ind.id} points at an unknown province indicator`).toBeTruthy();
      expect(ind.dimension).toBe(record!.dimension);
    }
  });

  it("names the province a city belongs to when the series has one", () => {
    // A city whose province is absent from a province series must report no
    // value for it — never a zero.
    const pm25 = PROVINCE_BASELINE_BY_ID["pcd-pm25-annual"];
    for (const city of allCities) {
      const province = resolveProvince(city.province);
      const v = pm25[province];
      if (v === undefined) {
        const facet = facets.find((f) => f.id === "pm25")!;
        expect(facet.value(city), `${city.id} in ${province} has no PM2.5`).toBeNull();
      } else {
        expect(v).toBeGreaterThan(0);
      }
    }
    // Every city in the 118 has a province we can name.
    expect(byCity.size).toBe(118);
  });
});
