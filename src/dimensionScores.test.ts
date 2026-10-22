import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import {
  INDICATORS,
  DIMENSION_WEIGHTS,
  DEPA_DIMENSION_ORDER,
  deriveAll,
  buildCohort,
  resolveProvince,
} from "./dimensionScores";
import { PROVINCE_BASELINE, PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData";

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
    // Every city is scored. The province-level NSO series now reach all 118
    // cities — including the registered ones that carry no city metrics at
    // all, because province data does not need city metrics. Uttaradit and
    // Ratchaburi used to be the two exceptions until NSO's spelling
    // variants for them were mapped.
    expect(withComposite.length).toBe(allCities.length);
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
    // All SEVEN of depa's dimensions now carry a weighted, province-level
    // indicator: energy from the Ministry of Energy's own catalogue,
    // governance from the national open-data portal. The engine must show
    // no dimension unscored, and the guard is that a dimension cannot
    // silently return to being unscored without a test failing here.
    const withData = DEPA_DIMENSION_ORDER.filter(
      d => INDICATORS.some(i => i.dimension === d && i.weight > 0),
    );
    expect(withData.sort()).toEqual([
      "economy", "energy", "environment", "governance", "living", "mobility", "people",
    ]);

    // Exactly one city is still unscored, and for one reason: Bueng Kan was
    // created in 2011, so it appears in no vintage of the 2010 household
    // survey that carries the Living indicators. That is a fact about Thai
    // administrative history, not a gap in the data, and the page says so
    // in the registry note.
    const unscoredCities = [...derivations.values()].filter(d => d.unscored.length > 0);
    expect(unscoredCities.map(d => d.cityId)).toEqual(["reg-bueng-kan"]);
    for (const d of unscoredCities) {
      expect(d.unscored).toEqual(["living"]);
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
    // could actually measure. All seven dimensions are now measured, so a
    // city with complete province coverage reaches the FULL published
    // weight. A city that lacks environment data covers less — and must say
    // so rather than being given a flattering renormalisation.
    const covered = [...derivations.values()].filter(d => d.composite != null);
    const covs = covered.map(d => d.weightCoverage);
    expect(Math.max(...covs)).toBeCloseTo(1, 5);
    // A city with only one measurable dimension still has a composite, and
    // its coverage says so. The floor is one dimension's weight, not zero.
    expect(Math.min(...covs)).toBeGreaterThan(0);

    // Every city's coverage must equal the share of the published weight that
    // rests on actual observations — recomputed independently here.
    //
    // This is NOT the same as "which dimensions could be scored". A dimension
    // scored from only some of its indicators contributes only that share, so
    // a city measured on 2 of 5 environment indicators reports 45% of the
    // environment weight, not 100%. Without this, the badge would read 85%
    // for a city whose environment number rests on two observations.
    for (const d of covered) {
      const expected = DEPA_DIMENSION_ORDER.reduce((s, dim) => {
        const r = d.dimensions[dim];
        if (r.score == null) return s;
        return s + DIMENSION_WEIGHTS[dim] * r.coverage;
      }, 0) / 100;
      expect(d.weightCoverage).toBeCloseTo(expected, 5);
    }
  });
});

describe("province baseline data", () => {
  it("carries provenance for every indicator", () => {
    // The baseline draws on three publishers, each with its own catalogue.
    // The test is that every number names a real, openable source — not that
    // they all come from NSO.
    const CATALOGUES = [
      /^https:\/\/catalog\.nso\.go\.th\/dataset\//,
      /^https:\/\/data\.forest\.go\.th\/dataset\//,
      /^https:\/\/data\.go\.th\/dataset\//,
      // The Ministry of Energy runs its own CKAN catalogue; the two
      // governance indicators are counted from the national open-data
      // portal's API, and a reader verifies them there.
      /^https:\/\/gdcatalog\.energy\.go\.th\/dataset\//,
      /^https:\/\/data\.go\.th\/api\/3\/action\//,
    ];
    for (const i of PROVINCE_BASELINE) {
      expect(i.dataset).toBeTruthy();
      expect(i.table).toBeTruthy();
      expect(
        CATALOGUES.some((re) => re.test(i.catalogUrl)),
        `${i.id} has an unexpected catalogue URL: ${i.catalogUrl}`,
      ).toBe(true);
      expect(i.publisher).toBeTruthy();
      expect(i.includes).toBeTruthy();
      expect(["sum", "last", "mean"]).toContain(i.aggregate);
      expect(i.year).toBeGreaterThan(2000);
      expect(i.provinceCount).toBeGreaterThanOrEqual(60);
    }
  });

  it("covers a real majority of provinces", () => {
    for (const i of PROVINCE_BASELINE) {
      expect(Object.keys(i.provinces).length).toBe(i.provinceCount);
    }
  });

  it("records the year each series actually stops at", () => {
    // The 2010 vintage of the household survey is a fact the UI must show.
    const dw = PROVINCE_BASELINE.find(i => i.id === "nso-drinking-water")!;
    expect(dw.year).toBe(2010);
    // The ICT series are pinned, and the pin is the whole point: the ICT
    // province table's value column stops being population at 2565Q4, so the
    // population series must be read AT 2565Q4 (ISO 2022) and the internet
    // users series AT 2566Q1 (ISO 2023).
    const internet = PROVINCE_BASELINE.find(i => i.id === "nso-internet-users")!;
    expect([internet.year, internet.quarter]).toEqual([2023, 1]);
    const pop = PROVINCE_BASELINE.find(i => i.id === "nso-province-population")!;
    expect([pop.year, pop.quarter]).toEqual([2022, 4]);
    const mobile = PROVINCE_BASELINE.find(i => i.id === "nso-mobile-users")!;
    expect([mobile.year, mobile.quarter]).toEqual([2022, 4]);
    // The labour force series must be the newest quarter, not the last one
    // whose status labels the harvester happened to match.
    const lf = PROVINCE_BASELINE.find(i => i.id === "nso-labour-force")!;
    expect(lf.year).toBe(2026);
    expect(lf.quarter).toBe(2);
  });

  it("uses a table id distinct from its dataset id — they are not the same thing", () => {
    // NSO's catalogue page id and its data table id differ; the harvester
    // must not conflate them.
    for (const i of PROVINCE_BASELINE) {
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

  it("knows which province the 2010 household survey never published", () => {
    // Bueng Kan did not exist as a province in 2010 — it was split out of
    // Nakhon Phanom that year. The engine must return null for it, not a
    // zero and not a guess.
    //
    // Ratchaburi, Uttaradit and Phetchabun used to appear in this list too.
    // They were not missing from the survey: NSO simply spells them
    // differently in these tables, and an unmapped label was being skipped
    // in silence. Mapping the variants is what brought the household survey
    // from 73 provinces to 76.
    const nsoProvinces = new Set(Object.keys(PROVINCE_BASELINE_BY_ID["nso-drinking-water"]));
    const repoProvs = [...new Set(allCities.map(c => resolveProvince(c.province)))];
    const missing = repoProvs.filter(p => !nsoProvinces.has(p)).sort();
    expect(missing).toEqual(["Bueng Kan"]);
  });

  it("returns null — never zero — for a province the survey never published", () => {
    const miss = allCities.find(c => resolveProvince(c.province) === "Bueng Kan")!;
    expect(miss).toBeTruthy();
    const d = derivations.get(miss.id)!;
    const dw = d.dimensions.living.contributions.find(c => c.id === "drinking-water")!;
    expect(dw.raw).toBeNull();
    expect(dw.score).toBeNull();
  });

  it("maps every province spelling NSO uses, so none is dropped in silence", () => {
    // Each of these was silently absent from every indicator it appeared in,
    // because NSO spells it differently in these tables than in the others.
    // If a spelling regresses, a province silently loses its data again.
    const mustBePresent: Record<string, string[]> = {
      "nso-drinking-water": ["Ratchaburi", "Uttaradit", "Phetchabun"],
      "nso-labour-force": ["Surat Thani", "Ratchaburi", "Uttaradit"],
      "nso-residential-permits": ["Sisaket", "Surat Thani", "Phetchabun"],
      "nso-province-population": ["Surat Thani", "Sisaket", "Phetchabun"],
      "nso-internet-users": ["Surat Thani", "Sisaket", "Phetchabun"],
      "nso-mobile-users": ["Surat Thani", "Sisaket", "Phetchabun"],
    };
    for (const [id, provinces] of Object.entries(mustBePresent)) {
      const map = PROVINCE_BASELINE_BY_ID[id];
      expect(map, `${id} is missing from the baseline`).toBeTruthy();
      for (const p of provinces) {
        expect(map[p], `${id} has no value for ${p}`).toBeDefined();
        expect(map[p]).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * The People dimension is where a category error was hiding: NSO publishes
 * internet and mobile users by PROVINCE, and they were being divided by a
 * CITY's population. These guards make that mistake impossible to reintroduce
 * silently, because the arithmetic is pinned to the published province data.
 */
describe("Smart People — penetration rates", () => {
  const POP = PROVINCE_BASELINE_BY_ID["nso-province-population"];
  const INTERNET = PROVINCE_BASELINE_BY_ID["nso-internet-users"];
  const MOBILE = PROVINCE_BASELINE_BY_ID["nso-mobile-users"];

  it("divides province users by PROVINCE population, never by city population", () => {
    for (const city of allCities) {
      const province = resolveProvince(city.province);
      const d = derivations.get(city.id)!;
      const net = d.dimensions.people.contributions.find(c => c.id === "internet-penetration")!;
      const mob = d.dimensions.people.contributions.find(c => c.id === "mobile-penetration")!;

      const expectedNet = (INTERNET[province] / POP[province]) * 100;
      const expectedMob = (MOBILE[province] / POP[province]) * 100;
      expect(net.raw, `${city.name} internet rate`).toBeCloseTo(expectedNet, 6);
      expect(mob.raw, `${city.name} mobile rate`).toBeCloseTo(expectedMob, 6);

      // The point of the guard: a city whose own population is a tiny
      // fraction of its province's must still get the PROVINCE rate. If the
      // engine ever divides by city population again, this fails.
      if (city.metrics?.population) {
        const cityRate = (INTERNET[province] / city.metrics.population) * 100;
        if (cityRate > 100) {
          expect(net.raw!, `${city.name} used city population`).toBeLessThan(100);
        }
      }
    }
  });

  it("keeps every penetration rate between 0 and 100", () => {
    for (const d of derivations.values()) {
      for (const c of d.dimensions.people.contributions) {
        if (c.raw == null) continue;
        expect(c.raw, `${d.cityId}.${c.id} = ${c.raw}`).toBeGreaterThanOrEqual(0);
        expect(c.raw, `${d.cityId}.${c.id} = ${c.raw}`).toBeLessThanOrEqual(100);
      }
    }
  });

  it("scores the People dimension for every city", () => {
    for (const d of derivations.values()) {
      expect(d.dimensions.people.score, `${d.cityId} has no People score`).not.toBeNull();
      expect(d.dimensions.people.coverage).toBe(1);
      expect(d.unscored).not.toContain("people");
    }
  });

  it("reproduces NSO's own published penetration rate", () => {
    // NSO publishes the ICT survey's population and users by region as well
    // as by province. Summing the 77 province values must land on the
    // published national rate. If this drifts, the province table has been
    // read at the wrong vintage or the wrong meaning.
    const sum = (m: Record<string, number>) =>
      Object.values(m).reduce((a, b) => a + b, 0);
    // internet: users at 2566Q1 over population at 2565Q4
    const netRate = (sum(INTERNET) / sum(POP)) * 100;
    expect(netRate).toBeGreaterThan(80);
    expect(netRate).toBeLessThan(95);
    // mobile: same quarter, so it is a pure same-vintage ratio
    const mobRate = (sum(MOBILE) / sum(POP)) * 100;
    expect(mobRate).toBeGreaterThan(90);
    expect(mobRate).toBeLessThan(100);
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
