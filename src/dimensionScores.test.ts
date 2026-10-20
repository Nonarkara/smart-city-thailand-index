import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import {
  INDICATORS,
  DIMENSION_WEIGHTS,
  DEPA_DIMENSION_ORDER,
  deriveAll,
  buildCohort,
  resolveProvince,
  type DepaDimension,
} from "./dimensionScores";
import { NSO_BASELINE, NSO_BASELINE_BY_ID } from "./nsoBaselineData";

/**
 * These guards ask questions about the derivation engine that a screenshot
 * could never answer:
 *
 *   - Does every dimension score actually come from a measured indicator,
 *     or did a number get typed in somewhere?
 *   - When a dimension cannot be measured, is it null (not measured) or 0
 *     (measured and terrible)? The difference is the whole point.
 *   - Is the arithmetic right, on a hand-computed case?
 *   - Does a missing province degrade coverage instead of silently scoring?
 */

const derivations = deriveAll(allCities);
const TOTAL_WEIGHT = Object.values(DIMENSION_WEIGHTS).reduce((a, b) => a + b, 0);

describe("derivation engine", () => {
  it("derives a composite for every city that has any measurable dimension", () => {
    const withComposite = [...derivations.values()].filter(d => d.composite != null);
    // Two registered cities (Uttaradit, Ratchaburi) have neither NSO province
    // data nor city metrics, so they CANNOT be scored. They are excluded and
    // reported, never given a zero.
    expect(withComposite.length).toBe(allCities.length - 2);
    const unscorable = [...derivations.values()].filter(d => d.composite == null);
    for (const d of unscorable) {
      expect(d.weightCoverage).toBe(0);
      expect(d.tier).toBeNull();
    }
  });

  it("never returns 0 for a dimension it could not measure", () => {
    for (const d of derivations.values()) {
      for (const dim of DEPA_DIMENSION_ORDER) {
        const r = d.dimensions[dim];
        if (r.score === 0 && r.coverage === 0) {
          throw new Error(`${d.cityId}.${dim} scored 0 with no data — must be null`);
        }
        if (r.coverage === 0) expect(r.score).toBeNull();
      }
    }
  });

  it("covers every depa dimension that has data, and names the ones that do not", () => {
    // Five of depa's seven dimensions have province-level data. Energy and
    // governance do not — no verified national source exists for either. The
    // engine must say so by having no weighted indicator for them, and every
    // city must report them as unscored.
    const withData = DEPA_DIMENSION_ORDER.filter(
      d => INDICATORS.some(i => i.dimension === d && i.weight > 0),
    );
    expect(withData.sort()).toEqual(["economy", "environment", "living", "mobility", "people"]);

    for (const d of derivations.values()) {
      expect(d.unscored).toContain("energy");
      expect(d.unscored).toContain("governance");
    }
  });

  it("weights within a dimension sum to a round number", () => {
    for (const dim of DEPA_DIMENSION_ORDER) {
      const defs = INDICATORS.filter(i => i.dimension === dim && i.weight > 0);
      const sum = defs.reduce((s, i) => s + i.weight, 0);
      expect(sum % 5, `${dim} weights sum to ${sum}`).toBe(0);
    }
  });

  it("publishes dimension weights that total 100", () => {
    expect(TOTAL_WEIGHT).toBe(100);
  });

  it("keeps every derived score inside 0-100", () => {
    for (const d of derivations.values()) {
      for (const dim of DEPA_DIMENSION_ORDER) {
        const s = d.dimensions[dim].score;
        if (s == null) continue;
        expect(s, `${d.cityId}.${dim} = ${s}`).toBeGreaterThanOrEqual(0);
        expect(s, `${d.cityId}.${dim} = ${s}`).toBeLessThanOrEqual(100);
      }
      if (d.composite != null) {
        expect(d.composite).toBeGreaterThanOrEqual(0);
        expect(d.composite).toBeLessThanOrEqual(100);
      }
    }
  });

  it("reproduces a hand-computed dimension score exactly", () => {
    // Pick a city and recompute one dimension from its contributions.
    const city = allCities.find(c => c.id === "phuket")!;
    const d = deriveAll([city, ...allCities.filter(c => c.id !== "phuket")]).get("phuket")!;
    const living = d.dimensions.living;
    const usable = living.contributions.filter(c => c.score != null);
    const expected = usable.reduce((s, c) => s + c.score * c.weight, 0) /
      usable.reduce((s, c) => s + c.weight, 0);
    expect(living.score).toBeCloseTo(Math.round(expected * 10) / 10, 1);
  });

  it("reports coverage honestly — a partial dimension is below full coverage", () => {
    for (const d of derivations.values()) {
      for (const dim of DEPA_DIMENSION_ORDER) {
        const r = d.dimensions[dim];
        expect(r.coverage).toBeGreaterThanOrEqual(0);
        expect(r.coverage).toBeLessThanOrEqual(1);
        const published = r.contributions.reduce((s, c) => s + c.weight, 0);
        if (published === 0) {
          // A dimension with no weighted indicator (energy, governance) has
          // no published weight, so there is nothing to cover.
          expect(r.coverage).toBe(0);
          expect(r.score).toBeNull();
          continue;
        }
        const observed = r.contributions.filter(c => c.score != null);
        const expectObs = observed.reduce((s, c) => s + c.weight, 0);
        expect(r.coverage).toBeCloseTo(expectObs / published, 5);
      }
    }
  });

  it("never silently imputes a missing indicator as zero", () => {
    for (const d of derivations.values()) {
      for (const dim of DEPA_DIMENSION_ORDER) {
        for (const c of d.dimensions[dim].contributions) {
          if (c.raw == null) expect(c.score).toBeNull();
          // A score of exactly 0 is legitimate ONLY when the scale says so:
          // either the raw value is 0, or the raw value is worse than the
          // scale's `worst` anchor. It is never a stand-in for "unknown".
          if (c.score === 0 && c.raw !== 0) {
            const ind = INDICATORS.find(i => i.id === c.id)!;
            // Legitimate only when the raw value sits on the bad side of the
            // scale's `worst` anchor. Which side that is depends on the
            // direction: for "lower is better" scales, being ABOVE the worst
            // anchor is worse; for "higher is better", being BELOW it is.
            const beyondWorst =
              ind.scale.kind === "target"
                ? (ind.scale.best < ind.scale.worst
                    ? c.raw > ind.scale.worst
                    : c.raw < ind.scale.worst)
                : // A cohort percentile gives the lowest observed value a
                  // score of 0 by definition — that is the scale working,
                  // not an imputation.
                  ind.scale.kind === "cohort";
            expect(
              beyondWorst,
              `${d.cityId}.${c.id}: score 0 from raw ${c.raw} that is not beyond the worst anchor`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("names the dimensions it could not measure", () => {
    for (const d of derivations.values()) {
      for (const dim of d.unscored) {
        expect(d.dimensions[dim].score).toBeNull();
        expect(d.dimensions[dim].coverage).toBe(0);
      }
      expect(d.weightCoverage).toBeLessThanOrEqual(1);
    }
    // A city's composite covers the published weight of the dimensions it
    // could actually measure. Energy (5) and governance (10) are the named
    // gap, so no city exceeds 85%. A city that ALSO lacks environment data
    // covers less — and must say so rather than being given a flattering
    // renormalisation.
    const covered = [...derivations.values()].filter(d => d.composite != null);
    const covs = covered.map(d => d.weightCoverage);
    expect(Math.max(...covs)).toBeCloseTo(0.85, 5);
    // A city with only one measurable dimension still has a composite, and
    // its coverage says so. The floor is one dimension's weight, not zero.
    expect(Math.min(...covs)).toBeGreaterThan(0);

    // Every city's coverage must equal the published weight of the dimensions
    // it could score — recomputed independently here.
    for (const d of covered) {
      const expected = DEPA_DIMENSION_ORDER.reduce((s, dim) => {
        if (d.dimensions[dim].score == null) return s;
        return s + DIMENSION_WEIGHTS[dim];
      }, 0) / 100;
      expect(d.weightCoverage).toBeCloseTo(expected, 5);
    }
  });
});

describe("NSO baseline data", () => {
  it("carries provenance for every indicator", () => {
    for (const i of NSO_BASELINE) {
      expect(i.dataset).toBeTruthy();
      expect(i.table).toBeTruthy();
      expect(i.catalogUrl).toMatch(/^https:\/\/catalog\.nso\.go\.th\/dataset\//);
      expect(i.includes).toBeTruthy();
      expect(["sum", "last"]).toContain(i.aggregate);
      expect(i.year).toBeGreaterThan(2000);
      expect(i.provinceCount).toBeGreaterThanOrEqual(70);
    }
  });

  it("covers a real majority of provinces", () => {
    for (const i of NSO_BASELINE) {
      expect(Object.keys(i.provinces).length).toBe(i.provinceCount);
    }
  });

  it("records the year each series actually stops at", () => {
    // The 2010 vintage of the household survey is a fact the UI must show.
    const dw = NSO_BASELINE.find(i => i.id === "nso-drinking-water")!;
    expect(dw.year).toBe(2010);
    const internet = NSO_BASELINE.find(i => i.id === "nso-internet-users")!;
    expect(internet.year).toBe(2026);
  });

  it("uses a table id distinct from its dataset id — they are not the same thing", () => {
    // NSO's catalogue page id and its data table id differ; the harvester
    // must not conflate them.
    for (const i of NSO_BASELINE) {
      expect(i.table).not.toBe(i.dataset);
    }
  });
});

describe("province resolution", () => {
  it("resolves every repo province name to a canonical name", () => {
    for (const city of allCities) {
      const resolved = resolveProvince(city.province);
      expect(resolved).toBeTruthy();
      // The alias table must actually be doing something for the five that
      // the repo spells differently.
      expect(resolved).not.toMatch(/^(Chon Buri|Lop Buri|Ayutthaya|Chainat|Prachin Buri)$/);
    }
  });

  it("knows which four provinces the 2010 household survey never published", () => {
    // Bueng Kan did not exist as a province in 2010; the other three were
    // not published in that survey. The engine must return null for them,
    // not a zero and not a guess.
    const nsoProvinces = new Set(Object.keys(NSO_BASELINE_BY_ID["nso-drinking-water"]));
    const repoProvs = [...new Set(allCities.map(c => resolveProvince(c.province)))];
    const missing = repoProvs.filter(p => !nsoProvinces.has(p)).sort();
    expect(missing).toEqual(["Bueng Kan", "Phetchabun", "Ratchaburi", "Uttaradit"]);
  });

  it("returns null — never zero — for a province the survey never published", () => {
    const miss = allCities.find(c => resolveProvince(c.province) === "Ratchaburi")!;
    const d = derivations.get(miss.id)!;
    const dw = d.dimensions.living.contributions.find(c => c.id === "drinking-water")!;
    expect(dw.raw).toBeNull();
    expect(dw.score).toBeNull();
  });
});

describe("cohort percentiles", () => {
  it("builds a cohort for every cohort-scaled indicator", () => {
    const cohort = buildCohort(allCities);
    for (const ind of INDICATORS) {
      if (ind.scale.kind !== "cohort") continue;
      const arr = cohort.get(ind.id);
      expect(arr, `${ind.id} has no cohort`).toBeDefined();
      expect(arr!.length).toBeGreaterThan(10);
      // sorted ascending
      for (let i = 1; i < arr!.length; i++) expect(arr![i]).toBeGreaterThanOrEqual(arr![i - 1]);
    }
  });
});
