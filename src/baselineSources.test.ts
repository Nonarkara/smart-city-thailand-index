import { describe, expect, it } from "vitest";
import {
  DEPA_DIMENSIONS,
  BASELINE_COVERAGE,
  SOURCE_REGISTRY,
  SOURCE_COUNT,
  type BaselineStrength,
} from "./baselineSources";

/**
 * Guards for the baseline source registry.
 *
 * These exist because the registry makes factual claims about live URLs and
 * about what data does or does not exist. Both claim types rot silently:
 * a URL dies, or someone "fills in" an empty dimension to make a table look
 * tidier. Each guard below names the question it is actually asking, so a
 * future edit has to justify itself against the question rather than against
 * the assertion.
 */

describe("baseline source registry", () => {
  it("covers every depa dimension exactly once", () => {
    expect(new Set(DEPA_DIMENSIONS).size).toBe(DEPA_DIMENSIONS.length);
    expect([...DEPA_DIMENSIONS].sort()).toEqual(
      ["economy", "energy", "environment", "governance", "living", "mobility", "people"].sort(),
    );
  });

  it("records an observed status for every source — no URL is left assumed", () => {
    for (const s of SOURCE_REGISTRY) {
      expect(s.verified, `${s.id} has no verified status`).not.toBe("unprobed");
      expect(
        ["200", "201", "301", "401", "418", "unreachable"],
        `${s.id} has an unknown status "${s.verified}"`,
      ).toContain(s.verified);
    }
  });

  it("never claims a source serves a dimension it is not registered for", () => {
    for (const s of SOURCE_REGISTRY) {
      for (const d of s.serves) {
        expect(DEPA_DIMENSIONS, `${s.id} serves unknown dimension "${d}"`).toContain(d);
      }
    }
  });

  it("reports at least one concrete indicator per source — no empty claims", () => {
    for (const s of SOURCE_REGISTRY) {
      expect(s.indicators.length, `${s.id} claims coverage but names no indicator`).toBeGreaterThan(0);
    }
  });

  // The question this guards: does the coverage table's "sources" count match
  // what the registry can actually serve? A hand-typed count that drifts from
  // the registry would make the methodology page lie in the one place a
  // committee member would actually check it.
  it("keeps the coverage source counts equal to the registry that backs them", () => {
    for (const d of DEPA_DIMENSIONS) {
      const actual = SOURCE_REGISTRY.filter(s => s.serves.includes(d)).length;
      expect(
        BASELINE_COVERAGE[d].sources,
        `BASELINE_COVERAGE.${d}.sources says ${BASELINE_COVERAGE[d].sources}, ` +
          `registry actually serves ${actual}`,
      ).toBe(actual);
    }
  });

  // The question this guards: can a dimension marked "none" still be silently
  // scored? The honest answer for energy is that no province-level national
  // source was verified, so it must stay unscoreable rather than be backfilled
  // from MEA (Bangkok only).
  it("keeps energy unscorable — no verified national province-level source exists", () => {
    expect(BASELINE_COVERAGE.energy.strength).toBe("none");
    const nationalEnergySources = SOURCE_REGISTRY.filter(
      s => s.serves.includes("energy") && !s.caveat?.includes("Bangkok"),
    );
    expect(
      nationalEnergySources.map(s => s.id),
      "a national energy source appeared — re-assess the 'none' rating",
    ).toEqual([]);
  });

  // The question this guards: is a "none" rating allowed to hide behind a
  // tidy-looking note? Any dimension rated none must say why, in words.
  it("gives every 'none' dimension an explicit written reason", () => {
    for (const d of DEPA_DIMENSIONS) {
      if (BASELINE_COVERAGE[d].strength !== "none") continue;
      expect(BASELINE_COVERAGE[d].note.length, `${d} is 'none' but gives no reason`).toBeGreaterThan(40);
    }
  });

  it("keeps every strength value inside the declared union", () => {
    const allowed: BaselineStrength[] = ["strong", "partial", "none"];
    for (const d of DEPA_DIMENSIONS) {
      expect(allowed).toContain(BASELINE_COVERAGE[d].strength);
    }
  });

  it("exports a source count that matches the registry length", () => {
    expect(SOURCE_COUNT).toBe(SOURCE_REGISTRY.length);
    expect(SOURCE_COUNT).toBeGreaterThanOrEqual(10);
  });
});

describe("known-bad endpoint guard", () => {
  // Perplexity and several AI assistants list
  // https://catalog.citydata.in.th/ as a ready-to-ingest depa catalogue.
  // It failed HTTPS on 2026-10-20. If someone later "fixes" the registry by
  // trusting that URL without re-probing, this guard is the thing that
  // should make them re-check.
  it("records that the depa catalogue HTTPS host failed, rather than silently trusting it", () => {
    const depa = SOURCE_REGISTRY.find(s => s.id === "depa-citydata");
    expect(depa).toBeDefined();
    expect(depa!.url).toContain("www.citydata.in.th"); // the host that actually served 200
    expect(depa!.caveat).toMatch(/catalog\.citydata\.in\.th/);
    expect(depa!.caveat).toMatch(/000|unstable/i);
  });

  // The question this guards: did anyone re-point the NSO index at a URL that
  // 418s without a User-Agent? That failure mode is silent — the CSV is real,
  // the worker just gets a teapot.
  it("keeps the NSO index caveat about its 418 User-Agent requirement", () => {
    const nso = SOURCE_REGISTRY.find(s => s.id === "nso-catalog-index");
    expect(nso!.caveat).toMatch(/418/);
    expect(nso!.caveat).toMatch(/User-Agent/i);
  });
});