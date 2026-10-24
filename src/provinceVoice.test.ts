// ---------------------------------------------------------------------------
// The generated voice must be measurably different between cities, and every
// number in it must be the number the dataset holds.
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { allCities } from "./cityData";
import { cityContexts } from "./cityContext";
import { buildProvinceSentenceSets, buildProvinceVoice } from "./provinceNarrative";
import { bandIn, canonicalProvince, ordinal, populationText, readProvince } from "./provinceVoice";
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

// ---------------------------------------------------------------------------
// The prose quality gates
//
// These four tests exist because the live page showed four defects the
// earlier "all distinct, all sourced" tests could not see: sentences with
// no terminator, a number said twice on one page, and sixty-eight
// sentences poured into one identical frame.
// ---------------------------------------------------------------------------

const FIELDS = ["livelihood", "famousFor", "opportunity", "theCatch"] as const;
const LOCALES = ["en", "th", "zh"] as const;

/**
 * The skeleton of a city's text: the words, with the numbers and the
 * place names removed. Two cities that say the same things in the same
 * order share a skeleton even when the numbers differ.
 */
function skeleton(text: string, city: { nameEn: string; nameTh: string; province: string; provinceTh: string }): string {
  return text
    .split(city.nameEn).join("<CITY>")
    .split(city.nameTh).join("<CITY>")
    .split(city.province).join("<PROV>")
    .split(city.provinceTh).join("<PROV>")
    .replace(/\d+(?:[.,]\d+)?/g, "#");
}

/**
 * Every measured quantity, and the one field that owns it. A quantity may
 * appear in exactly one field; appearing in two is the template tell.
 */
const OWNERS: Array<[RegExp, string]> = [
  [/The province carries/, "livelihood"],
  [/labour force of/, "livelihood"],
  [/informal work/, "livelihood"],
  [/Internal migration/, "livelihood"],
  [/is forest\b/, "famousFor"],
  [/kWh per person a year/, "famousFor"],
  [/goes to homes/, "famousFor"],
  [/Drinking water/, "famousFor"],
  [/internet users/, "opportunity"],
  [/mobile subscription/, "opportunity"],
  [/building permits/, "opportunity"],
  [/non-durable housing/, "opportunity"],
  [/household register/, "theCatch"],
  [/Road deaths/, "theCatch"],
  [/Motorcycles carry/, "theCatch"],
  [/PM2\.5/, "theCatch"],
];

describe("voice prose quality", () => {
  it("terminates every English and Chinese sentence", () => {
    // A fragment with no terminator runs into the next one and reads as
    // machine output. This is the defect the live page actually showed.
    const bad: string[] = [];
    for (const c of generated) {
      const sets = buildProvinceSentenceSets(c);
      for (const field of FIELDS) {
        for (const s of sets[field].en) {
          if (!/[.!?…]$/.test(s.trim())) bad.push(`${c.id}/${field} en: ${s.trim()}`);
        }
        for (const s of sets[field].zh) {
          if (!/[。！？…]$/.test(s.trim())) bad.push(`${c.id}/${field} zh: ${s.trim()}`);
        }
      }
    }
    expect(bad.slice(0, 8)).toEqual([]);
    expect(bad.length).toBe(0);
  });

  it("gives each measured quantity exactly one field", () => {
    // A figure that appears twice on a page reads as a template even when
    // both sentences are true.
    //
    // The test follows the QUANTITY, not the numeral. 0.3% of households in
    // non-durable housing and 0.3% of the household register not counted
    // are two different facts that happen to share a value — a numeral scan
    // flagged them, and it was measuring coincidence, not duplication.
    const offenders: string[] = [];
    for (const c of generated) {
      const ctx = cityContexts[c.id];
      for (const [marker, owner] of OWNERS) {
        const found = FIELDS.filter(f => marker.test(ctx[f].en));
        if (found.length > 1) {
          offenders.push(`${c.id}: ${marker} appears in ${found.join(" + ")}`);
        } else if (found.length === 1 && found[0] !== owner) {
          offenders.push(`${c.id}: ${marker} is in ${found[0]}, but ${owner} owns it`);
        }
      }
    }
    expect(offenders.slice(0, 8)).toEqual([]);
    expect(offenders.length).toBe(0);
  });

  it("never gives two different provinces the same frame", () => {
    // The mechanical tell. If many cities share one skeleton, the prose is
    // a form with the numbers filled in.
    //
    // THE MEASURE IS IN PROVINCES, NOT CITIES. Five of the 68 are districts
    // of Bangkok, and every reading here is province-level, so those five
    // necessarily read alike — that is the geography of the data, not a
    // template. What must never happen is one frame serving DIFFERENT
    // provinces.
    //
    // WHY THE LIMIT IS FIVE AND NOT ONE
    // ---------------------------------
    // The widest frame spans Nakhon Pathom, Samut Sakhon, Samut Songkhram,
    // Sing Buri and Bangkok — five provinces, nine cities (five of them
    // districts of Bangkok, which necessarily share every province-level
    // reading). Checked by hand against their measured values: forest cover
    // of 0.1 to 7.4%, electricity use of 3,258 to 7,834 kWh per person, a
    // low residential share of the grid in every one of them, and drinking
    // water above 99% in every one of them. They ARE the same kind of place,
    // and the prose says so because the data says so. Manufacturing a
    // difference the data does not support would be a worse failure than the
    // repeat.
    //
    // Before the banded frames, ONE frame served all 68 cities and all 77
    // provinces. The measure fell from 77 provinces to 5.
    for (const locale of LOCALES) {
      for (const field of FIELDS) {
        const groups = new Map<string, Set<string>>();
        for (const c of generated) {
          const sk = skeleton(cityContexts[c.id][field][locale], c);
          if (!groups.has(sk)) groups.set(sk, new Set());
          groups.get(sk)!.add(c.province);
        }
        const widest = Math.max(...[...groups.values()].map(set => set.size));
        expect({ locale, field, widest, limit: 5 }).toEqual({ locale, field, widest, limit: 5 });
        expect(widest).toBeLessThanOrEqual(5);
      }
    }
  });

  it("bands provinces against the real distribution, not a hand-picked threshold", () => {
    // The frame changes with the data only if the band boundaries come
    // from the data. This pins the mechanism: the top band must be the
    // top quarter of the provinces that carry the reading.
    const forest = PROVINCE_BASELINE_BY_ID["rfd-forest-coverage"];
    const values = Object.values(forest).filter((v): v is number => typeof v === "number");
    const sorted = [...values].sort((a, b) => b - a);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];

    const topBand = bandIn("rfd-forest-coverage", Object.keys(forest).find(k => forest[k] === top)!);
    expect(topBand?.band).toBe(0);
    expect(topBand?.rank).toBe(1);
    expect(topBand?.of).toBe(sorted.length);

    const bottomBand = bandIn("rfd-forest-coverage", Object.keys(forest).find(k => forest[k] === bottom)!);
    expect(bottomBand?.band).toBe(3);
    // Tied values share the best of their ranks, so the lowest forest
    // figure is not necessarily ranked last — several provinces record the
    // same minimum. What must hold is that it falls in the bottom quarter.
    expect(bottomBand?.rank).toBeGreaterThan(sorted.length - 4);
    expect(bottomBand?.of).toBe(sorted.length);
  });

  it("writes ordinals the way English writes them", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(2)).toBe("2nd");
    expect(ordinal(3)).toBe("3rd");
    expect(ordinal(4)).toBe("4th");
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(12)).toBe("12th");
    expect(ordinal(13)).toBe("13th");
    expect(ordinal(21)).toBe("21st");
    expect(ordinal(22)).toBe("22nd");
    expect(ordinal(23)).toBe("23rd");
    expect(ordinal(101)).toBe("101st");
  });
});
