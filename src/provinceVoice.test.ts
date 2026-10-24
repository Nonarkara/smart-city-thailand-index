// ---------------------------------------------------------------------------
// The generated voice must be measurably different between cities, and every
// number in it must be the number the dataset holds.
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { allCities } from "./cityData";
import { cityContexts } from "./cityContext";
import { buildProvinceVoice } from "./provinceNarrative";
import { canonicalProvince, populationText, readProvince } from "./provinceVoice";
import { PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData";

/**
 * A city is "generated" when its context came from the fallback builder
 * rather than the hand-written table. The hand-written entries start with
 * a hand-written livelihood string; the generated ones all begin with
 * the template "${city.nameEn} is ${regionRole}".
 */
function isGenerated(cityId: string): boolean {
  const ctx = cityContexts[cityId];
  const city = allCities.find(c => c.id === cityId);
  if (!ctx || !city) return false;
  return ctx.livelihood.en.startsWith(`${city.nameEn} is `);
}

const generated = allCities.filter(c => isGenerated(c.id));

describe("province voice", () => {
  it("covers the cities without hand-written context", () => {
    // The hand-written table holds 50 cities; the rest are generated.
    expect(generated.length).toBeGreaterThan(60);
  });

  it("gives every generated city a distinct livelihood sentence", () => {
    const seen = new Map<string, number>();
    for (const c of generated) {
      const k = cityContexts[c.id].livelihood.en;
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    const duplicates = [...seen.entries()].filter(([, n]) => n > 1);
    expect(duplicates).toEqual([]);
    expect(seen.size).toBe(generated.length);
  });

  it("gives every generated city a distinct known-for sentence", () => {
    const seen = new Set(generated.map(c => cityContexts[c.id].famousFor.en));
    expect(seen.size).toBe(generated.length);
  });

  it("states a number or an explicit absence in every field", () => {
    const absence = /no public reading|no record|not held|unknown|no province-level|ยังไม่มี|ไม่มีตัวเลข|没有|无记录|暂无/;
    for (const c of generated) {
      const ctx = cityContexts[c.id];
      for (const field of ["livelihood", "famousFor", "opportunity", "theCatch"] as const) {
        const text = ctx[field].en;
        expect(text.length).toBeGreaterThan(40);
        expect(/\d/.test(text) || absence.test(text)).toBe(true);
      }
    }
  });

  it("never claims a zero for a province that has no record", () => {
    // A province with no reading must say so, not print 0.
    for (const c of generated) {
      const r = readProvince(c.province);
      if (r.canonical === undefined) continue;
      const ctx = cityContexts[c.id];
      const all = [ctx.livelihood.en, ctx.famousFor.en, ctx.opportunity.en, ctx.theCatch.en].join(" ");
      // A standalone zero percentage, not the tail of "63.0%".
      expect(all).not.toMatch(/(?<![\d.])0(\.0)?% of\b/);
    }
  });

  it("resolves every city's province to a dataset key", () => {
    const unresolved = allCities.filter(c => canonicalProvince(c.province) === undefined);
    expect(unresolved.map(c => `${c.id}:${c.province}`)).toEqual([]);
  });

  it("keeps forest cover as the percentage the dataset holds", () => {
    // A value below 1 is a genuine low percentage, not a fraction.
    const forest = PROVINCE_BASELINE_BY_ID["rfd-forest-coverage"];
    const low = Object.entries(forest).filter(([, v]) => v > 0 && v < 1);
    expect(low.length).toBeGreaterThan(0);
    for (const [province, value] of low) {
      const city = allCities.find(c => c.province === province || canonicalProvince(c.province) === province);
      if (!city) continue;
      const voice = buildProvinceVoice(city);
      const wrong = `${(value * 100).toFixed(1)}%`;
      expect(voice.famousFor.en).not.toContain(wrong);
    }
  });

  it("reads population in thousands, not people", () => {
    const pop = PROVINCE_BASELINE_BY_ID["nso-province-population"];
    const bangkok = pop["Bangkok"];
    expect(bangkok).toBeGreaterThan(1000);
    expect(populationText(bangkok, "en")).toMatch(/million people$/);
    const small = pop["Phayao"];
    expect(populationText(small, "en")).toMatch(/thousand people$/);
  });
});

describe("province reading", () => {
  it("keeps the units the indicators declare", () => {
    const r = readProvince("Lampang");
    // Population is stored in THOUSAND people.
    expect(r.population).toBeGreaterThan(100);
    // Internal migration is a percentage, not a head count.
    expect(r.internalMigration).toBeLessThan(100);
    expect(r.internetUsers).toBeGreaterThan(100);
  });

  it("leaves a province with no record undefined rather than zero", () => {
    const r = readProvince("Nowhere At All");
    expect(r.population).toBeUndefined();
    expect(r.pm25).toBeUndefined();
    expect(r.electricityPerCapita).toBeUndefined();
  });
});
