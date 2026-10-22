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

import { RESIDUAL_GAPS } from "./baselineSources";

const derivations = deriveAll(allCities);

const scoredCitiesFor = (dim: string) =>
  allCities.filter(c => derivations.get(c.id)!.dimensions[dim as never].score != null).length;

describe("baseline gap definition", () => {
  it("names no dimension as a gap, because every one is measured", () => {
    // Energy and Governance used to be the two named gaps. Both are now
    // measured from a real province-level source — the Ministry of Energy's
    // own catalogue and the national open-data portal — so no dimension has
    // zero measured cities, and the page must not claim one.
    const gaps = DEPA_DIMENSION_ORDER.filter(d => scoredCitiesFor(d) === 0);
    expect(gaps).toEqual([]);
  });

  it("measures EVERY dimension for EVERY city, except the one city history excludes", () => {
    // Not merely "some cities". A province series that covers all 77
    // provinces covers all 118 cities, and the guard is that a regression
    // in coverage shows up here rather than as a quiet blank cell.
    //
    // The single exception is Bueng Kan: it was created in 2011, so it is
    // absent from the 2010 household survey that carries the Living
    // indicators. Its Living score cannot exist. That is stated in the
    // registry note, not hidden behind a zero.
    for (const dim of DEPA_DIMENSION_ORDER) {
      const n = scoredCitiesFor(dim);
      if (dim === "living") {
        expect(n, "living is missing for Bueng Kan only").toBe(allCities.length - 1);
      } else {
        expect(n, `${dim} should be measured for every city`).toBe(allCities.length);
      }
    }
  });

  it("keeps the registry's partial ratings about source depth, not measurement", () => {
    // The registry rates Energy and Governance "partial" because two
    // measurements inside them still do not exist. That is a fact about the
    // sources, not about the baseline, and it must not be used to decide
    // whether a dimension is a gap — nor to pretend the dimensions are
    // unmeasured.
    const gaps = DEPA_DIMENSION_ORDER.filter(d => scoredCitiesFor(d) === 0);
    expect(gaps).toHaveLength(0);
    expect(DIMENSION_LABELS.energy.en).toBeTruthy();
    expect(DIMENSION_LABELS.governance.en).toBeTruthy();
  });

  it("names what is still missing inside the dimensions it measures", () => {
    // Two specific measurements are absent, and they are named rather than
    // approximated. If one is closed, this test must fail so the register
    // can be updated.
    expect(RESIDUAL_GAPS.map(g => g.id).sort()).toEqual([
      "province-egov-index", "renewable-share",
    ]);
    for (const gap of RESIDUAL_GAPS) {
      expect(gap.note.en.length, `${gap.id} must say why it is missing`).toBeGreaterThan(40);
      expect(gap.note.th.length, `${gap.id} needs a Thai reason`).toBeGreaterThan(20);
      expect(gap.note.zh.length, `${gap.id} needs a Chinese reason`).toBeGreaterThan(20);
    }
  });
});
