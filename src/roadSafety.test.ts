import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { buildFacets } from "./baselineFacets";
import { deriveAll, INDICATORS, resolveProvince } from "./dimensionScores";
import { PROVINCE_BASELINE, PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData";

/**
 * Smart Mobility used to be scored from a hand-typed city metric that only
 * 49 of the 118 cities carried. It is now scored from the integrated
 * road-traffic death registry: deaths in the province where the crash
 * happened, over the same NSO province population the rest of the baseline
 * uses.
 *
 * Three things have to stay true, and each can rot silently:
 *
 *   1. The rate is deaths ÷ population × 100 — recomputable from the two
 *      published series. The population series is in THOUSANDS, so the
 *      factor is 100, not 100,000. Getting that wrong is a factor of a
 *      thousand and would still look like a plausible number.
 *
 *   2. The crash province is the registry's "จ.ที่เสียชีวิต" column, not
 *      the file's "Province" column — the latter is the victim's address and
 *      is filled on only 36% of records.
 *
 *   3. The motorcycle share is published and browsable but NOT scored.
 *      Scoring it would penalise rural provinces for how they travel.
 */

const facets = buildFacets(allCities);
const derivations = deriveAll(allCities);

describe("road safety indicator", () => {
  it("derives the rate from the published deaths and population series", () => {
    const deaths = PROVINCE_BASELINE_BY_ID["rtddi-road-deaths"];
    const pop = PROVINCE_BASELINE_BY_ID["nso-province-population"];
    expect(Object.keys(deaths).length).toBe(77);

    for (const [province, d] of Object.entries(deaths)) {
      const p = pop[province];
      expect(p, `${province} has no population base`).toBeGreaterThan(0);
      // population is in thousands, so per-100,000 is deaths / pop * 100.
      expect((d / p) * 100).toBeGreaterThan(0);
      expect((d / p) * 100).toBeLessThan(100);
    }
  });

  it("scores road safety from the registry, not from a hand-typed city metric", () => {
    const ind = INDICATORS.find((i) => i.id === "road-safety")!;
    expect(ind).toBeTruthy();
    expect(ind.origin).toBe("derived");
    expect(ind.metricKey).toBeUndefined();
    expect(ind.dimension).toBe("mobility");
  });

  it("scores Smart Mobility for every one of the 118 cities", () => {
    const unscored = [...derivations.values()].filter(
      (d) => d.dimensions.mobility.score == null,
    );
    expect(unscored.map((d) => d.cityId)).toEqual([]);
    for (const d of derivations.values()) {
      expect(d.dimensions.mobility.coverage).toBe(1);
    }
  });

  it("shows the facet the same rate the engine scores", () => {
    const facet = facets.find((f) => f.id === "road-fatality")!;
    expect(facet).toBeTruthy();
    expect(facet.coverage).toBe(118);
    for (const city of allCities) {
      const v = facet.value(city);
      if (v == null) continue;
      const d = derivations.get(city.id)!;
      const contribution = d.dimensions.mobility.contributions.find((c) => c.id === "road-safety")!;
      expect(contribution.raw).toBeCloseTo(v, 6);
    }
  });

  it("publishes the motorcycle share but does not score it", () => {
    const share = PROVINCE_BASELINE_BY_ID["rtddi-motorcycle-share"];
    expect(Object.keys(share).length).toBe(77);
    for (const value of Object.values(share)) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThanOrEqual(100);
    }
    // It must NOT enter the composite: a high motorcycle share reflects how a
    // province travels, and scoring it penalises rural provinces for being rural.
    const scored = INDICATORS.filter(
      (i) => i.provinceId === "rtddi-motorcycle-share",
    );
    expect(scored.map((i) => i.id)).toEqual([]);
    // But it must be browsable.
    const facet = facets.find((f) => f.id === "motorcycle-share")!;
    expect(facet).toBeTruthy();
    expect(facet.coverage).toBe(118);
  });

  it("records the crash province, and not the victim's home province", () => {
    // The registry's crash province must cover every province. If the
    // harvester had accidentally used the victim's address column — which is
    // filled on only 36% of records — coverage would collapse.
    const deaths = PROVINCE_BASELINE_BY_ID["rtddi-road-deaths"];
    for (const city of allCities) {
      const province = resolveProvince(city.province);
      expect(deaths[province], `${province} has no road-death count`).toBeGreaterThan(0);
    }
  });

  it("documents the gap to the SCITI reference anchor without attributing it to WHO", () => {
    // The scale maps ≤5 deaths per 100,000 to 100 points. This is an editorial scoring anchor, not the WHO global reduction goal.
    const deaths = PROVINCE_BASELINE_BY_ID["rtddi-road-deaths"];
    const pop = PROVINCE_BASELINE_BY_ID["nso-province-population"];
    const rates = Object.entries(deaths)
      .filter(([province]) => pop[province] > 0)
      .map(([province, d]) => ({ province, rate: (d / pop[province]) * 100 }));
    const best = rates.reduce((a, b) => (b.rate < a.rate ? b : a));
    expect(best.rate).toBeGreaterThan(5);
    expect(best.province).toBe("Bangkok");
    expect(INDICATORS.find(i => i.id === "road-safety")!.scale.note).toContain("SCITI editorial reference scale");
  });

  it("carries the road-death registry in the source registry", () => {
    const record = PROVINCE_BASELINE.find((i) => i.id === "rtddi-road-deaths")!;
    expect(record).toBeTruthy();
    expect(record.dimension).toBe("mobility");
    expect(record.year).toBe(2025);
    expect(record.aggregate).toBe("sum");
    expect(record.catalogUrl).toContain("data.go.th");
    expect(record.note).toMatch(/crash/i);
  });
});
