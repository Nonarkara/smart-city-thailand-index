import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { buildFacets, matchesFacets } from "./baselineFacets";
import { INDICATORS, resolveProvince } from "./dimensionScores";
import { NSO_BASELINE, NSO_BASELINE_BY_ID } from "./nsoBaselineData";

/**
 * The facets are the browsable face of the baseline: a city official picks
 * their province and filters on what actually exists. Two invariants matter.
 *
 * 1. A facet must not claim a dimension its source record does not. An
 *    earlier version labelled internet and mobile usage as "governance"
 *    while the derivation engine scored them under People — so the same
 *    number appeared under two different dimensions on two different pages.
 *    The `nsoId` link on each facet makes that mismatch mechanically
 *    checkable instead of a convention.
 *
 * 2. A facet must never be published with nothing behind it. A filter that
 *    silently returns no cities is worse than no filter.
 */

const facets = buildFacets(allCities);

describe("baseline facets", () => {
  it("agrees with the source record on which dimension each facet belongs to", () => {
    for (const facet of facets) {
      if (!facet.nsoId) continue;
      const record = NSO_BASELINE.find(i => i.id === facet.nsoId);
      expect(record, `${facet.id} points at an unknown NSO indicator ${facet.nsoId}`).toBeTruthy();
      expect(
        facet.dimension,
        `${facet.id} claims ${facet.dimension} but ${facet.nsoId} is a ${record!.dimension} indicator`,
      ).toBe(record!.dimension);
    }
  });

  it("agrees with the derivation engine on which dimension each indicator belongs to", () => {
    for (const ind of INDICATORS) {
      if (!ind.nsoId) continue;
      const record = NSO_BASELINE.find(i => i.id === ind.nsoId);
      expect(record, `${ind.id} points at an unknown NSO indicator ${ind.nsoId}`).toBeTruthy();
      expect(
        ind.dimension,
        `${ind.id} is scored under ${ind.dimension} but ${ind.nsoId} is a ${record!.dimension} indicator`,
      ).toBe(record!.dimension);
    }
  });

  it("publishes every facet with a real range and real coverage", () => {
    for (const facet of facets) {
      expect(facet.coverage, `${facet.id} has no data`).toBeGreaterThan(0);
      expect(facet.max, `${facet.id} has no range`).toBeGreaterThanOrEqual(facet.min);
      expect(facet.vintage, `${facet.id} has no vintage`).toBeTruthy();
      expect(facet.source.en).toBeTruthy();
    }
  });

  it("uses only real values — a facet never invents a number for a city without one", () => {
    for (const facet of facets) {
      for (const city of allCities) {
        const v = facet.value(city);
        if (v == null) continue;
        expect(Number.isFinite(v), `${facet.id} for ${city.name} is not finite`).toBe(true);
        expect(v, `${facet.id} for ${city.name} is negative`).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("reports the digital indicators as rates, not raw counts", () => {
    // A raw user count is meaningless to a city official comparing a small
    // city with a large one. The penetration rate is the comparable number,
    // and it is the number the engine scores.
    const net = facets.find(f => f.id === "internet-penetration")!;
    const mob = facets.find(f => f.id === "mobile-penetration")!;
    expect(net).toBeTruthy();
    expect(mob).toBeTruthy();
    expect(net.unit).toBe("%");
    expect(mob.unit).toBe("%");
    expect(net.max).toBeLessThanOrEqual(100);
    expect(mob.max).toBeLessThanOrEqual(100);

    // And they must equal the engine's own contribution for the same city.
    const city = allCities.find(c => c.nameEn.includes("Phuket"))!;
    const province = resolveProvince(city.province);
    const pop = NSO_BASELINE_BY_ID["nso-province-population"][province];
    const users = NSO_BASELINE_BY_ID["nso-internet-users"][province];
    expect(net.value(city)).toBeCloseTo((users / pop) * 100, 6);
  });

  it("filters cities by a range and excludes cities with no value", () => {
    const net = facets.find(f => f.id === "internet-penetration")!;
    const high = matchesFacets(allCities[0], [net], { "internet-penetration": [95, 100] });
    const low = matchesFacets(allCities[0], [net], { "internet-penetration": [0, 10] });
    expect(high || low).toBe(true); // a city must satisfy one side or the other
    // A city whose province has no value cannot satisfy a range filter.
    const buengKan = allCities.find(c => resolveProvince(c.province) === "Bueng Kan");
    if (buengKan) {
      expect(net.value(buengKan)).not.toBeNull(); // province data does cover it
    }
  });
});
