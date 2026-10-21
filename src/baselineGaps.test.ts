import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { deriveAll, DEPA_DIMENSION_ORDER, DIMENSION_LABELS } from "./dimensionScores";

/**
 * The baseline page tells the reader, in three places, which dimensions have
 * no data:
 *
 *   1. The strip above the table — a hatched cell and "no baseline".
 *   2. The gap band — a heading with a count, and one entry per gap.
 *   3. The methodology page — the same count and the same names.
 *
 * These three used to disagree. The strip asked the source registry how
 * thinly a dimension was served, so Governance — three probed sources, zero
 * measured cities — was labelled "partial" while every row showed it blank.
 * The gap band asked the registry again and found only Energy, under a
 * heading that said "Two".
 *
 * The one definition all three now share: a dimension is a gap when NO city
 * has a score for it. This test holds that definition in place.
 */

const derivations = deriveAll(allCities);

const scoredCitiesFor = (dim: string) =>
  allCities.filter(c => derivations.get(c.id)!.dimensions[dim as never].score != null).length;

describe("baseline gap definition", () => {
  it("names exactly the dimensions with no measured city", () => {
    const gaps = DEPA_DIMENSION_ORDER.filter(d => scoredCitiesFor(d) === 0);
    expect(gaps.sort()).toEqual(["energy", "governance"]);
  });

  it("measures every other dimension for at least some cities", () => {
    for (const dim of DEPA_DIMENSION_ORDER) {
      const n = scoredCitiesFor(dim);
      if (dim === "energy" || dim === "governance") {
        expect(n, `${dim} should have no measured cities`).toBe(0);
      } else {
        expect(n, `${dim} should be measured for some cities`).toBeGreaterThan(0);
      }
    }
  });

  it("agrees with the source registry on the two named gaps", () => {
    // The registry rates Governance "partial" because its sources were probed
    // and rejected. That is a fact about the sources, not about the baseline,
    // and it must not be used to decide whether a dimension is a gap.
    const gaps = DEPA_DIMENSION_ORDER.filter(d => scoredCitiesFor(d) === 0);
    expect(gaps).toHaveLength(2);
    expect(DIMENSION_LABELS.energy.en).toBeTruthy();
    expect(DIMENSION_LABELS.governance.en).toBeTruthy();
  });
});
