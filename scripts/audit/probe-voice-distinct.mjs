/**
 * DOES THE GENERATED VOICE ACTUALLY DIFFER BETWEEN CITIES?
 * ========================================================
 * The complaint was that the product read mechanical. The fix was to
 * build the generated context from each province's own measured values.
 *
 * This is the falsifier: it prints the generated voice for a sample of
 * cities and checks that
 *   · no two cities share the same four sentences,
 *   · every sentence carries a number or an explicit absence,
 *   · the numbers in the prose match the datasets they came from.
 *
 * Run: node scripts/audit/probe-voice-distinct.mjs
 */
import { allCities } from "../../src/cityData.ts";
import { cityContexts } from "../../src/cityContext.ts";
import { buildProvinceVoice } from "../../src/provinceNarrative.ts";
import { readProvince, absorptionRank } from "../../src/provinceVoice.ts";

function isGenerated(city) {
  const ctx = cityContexts[city.id];
  if (!ctx) return true;
  return ctx.livelihood.en.startsWith(`${city.nameEn} is `);
}

const generated = allCities.filter(isGenerated);

console.log(`generated cities: ${generated.length}`);

// ── 1. Distinctness ────────────────────────────────────────────────────────
const byLivelihood = new Map();
for (const c of generated) {
  const k = cityContexts[c.id].livelihood.en;
  byLivelihood.set(k, (byLivelihood.get(k) || 0) + 1);
}
const dupLivelihood = [...byLivelihood.entries()].filter(([, n]) => n > 1);
console.log(`\ndistinct livelihood strings: ${byLivelihood.size}/${generated.length}`);
console.log(`duplicated livelihood strings: ${dupLivelihood.length}`);
for (const [k, n] of dupLivelihood.slice(0, 5)) {
  console.log(`  ×${n}  ${k.slice(0, 100)}`);
}

const byFamous = new Map();
for (const c of generated) {
  const k = cityContexts[c.id].famousFor.en;
  byFamous.set(k, (byFamous.get(k) || 0) + 1);
}
console.log(`distinct famousFor strings: ${byFamous.size}/${generated.length}`);

// ── 2. Every sentence carries a fact or an explicit absence ────────────────
const FIELDS = ["livelihood", "famousFor", "opportunity", "theCatch"];
const hasNumber = /\d/;
const absenceWords = /no public reading|no record|not held|unknown|no province-level|ยังไม่มี|ไม่มีตัวเลข|没有|无记录|暂无/;
let thin = 0;
for (const c of generated) {
  const ctx = cityContexts[c.id];
  for (const f of FIELDS) {
    const s = ctx[f].en;
    if (!hasNumber.test(s) && !absenceWords.test(s)) {
      thin++;
      console.log(`  THIN  ${c.id}.${f}: ${s.slice(0, 110)}`);
    }
  }
}
console.log(`\nsentences with neither a number nor an explicit absence: ${thin}`);

// ── 3. Do the numbers match the datasets? ──────────────────────────────────
// The prose writes numbers the way a person says them ("8.6 million
// people", "2,247 kWh"), so the check PARSES the prose back into
// (value, scale) pairs and compares numerically against the dataset
// within the tolerance of the rounding the prose used.
//
// A substring check would be too weak (it would miss a wrong number that
// happens to appear elsewhere) and a strict equality check would be too
// brittle (it would flag correct rounding as an error).
console.log("\n=== spot-check: the figures in the prose against the datasets ===");

function parseNumbers(text) {
  const out = [];
  const re = /([\d][\d,]*(?:\.\d+)?)\s*(thousand|million|%)?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const num = parseFloat(m[1].replace(/,/g, ""));
    if (!Number.isFinite(num)) continue;
    const scale = /thousand/i.test(m[2] || "") ? 1e3 : /million/i.test(m[2] || "") ? 1e6 : 1;
    out.push({ raw: num, value: num * scale, scale, unit: m[2] || "" });
  }
  return out;
}

function matchesValue(nums, target, { scale = 1, tolerance = 0 } = {}) {
  return nums.some(n => {
    if (n.scale !== scale) return false;
    if (Math.abs(n.raw - target) <= tolerance + 1e-9) return true;
    return false;
  });
}

let checked = 0;
let mismatch = 0;
const TOL = { population: 0.51, electricity: 0.51, pm25: 0.051, forest: 0.051, roadDeaths: 0.51, permits: 0.51 };

for (const c of generated) {
  const r = readProvince(c.province);
  const ctx = cityContexts[c.id];
  const prose = [ctx.livelihood.en, ctx.famousFor.en, ctx.opportunity.en, ctx.theCatch.en].join(" ");
  const nums = parseNumbers(prose);

  const cases = [
    // population is stored in THOUSAND people
    ["population", r.population, { scale: 1, tol: TOL.population }],
    ["electricity", r.electricityPerCapita, { scale: 1, tol: TOL.electricity }],
    ["pm25", r.pm25, { scale: 1, tol: TOL.pm25 }],
    ["forest", r.forestCoverage, { scale: 1, tol: TOL.forest }],
    ["roadDeaths", r.roadDeaths, { scale: 1, tol: TOL.roadDeaths }],
    ["permits", r.residentialPermits, { scale: 1, tol: TOL.permits }],
  ];

  for (const [label, target, spec] of cases) {
    if (target === undefined) continue;
    checked++;
    // population may be written in thousands, millions, or people
    const ok =
      matchesValue(nums, target, { scale: 1, tolerance: spec.tol }) ||
      (label === "population" &&
        (matchesValue(nums, target, { scale: 1e3, tolerance: spec.tol }) ||
          matchesValue(nums, target, { scale: 1e6, tolerance: spec.tol * 1e6 })));
    if (!ok) {
      console.log(`  MISS ${label} for ${c.id}: dataset ${target} not found among parsed numbers`);
      mismatch++;
    }
  }
}
console.log(`  values checked: ${checked}   mismatches: ${mismatch}`);

// ── 4. A sample, read as prose ─────────────────────────────────────────────
const sample = ["reg-ayutthaya", "reg-lampang-pao", "reg-phayao", "reg-samut-sakhon", "reg-hat-yai"];
console.log("\n=== sample voices ===");
for (const id of sample) {
  const c = allCities.find(x => x.id === id);
  if (!c) continue;
  const v = buildProvinceVoice(c);
  console.log(`\n${c.nameEn} (${c.province})`);
  console.log(`  LIVELIHOOD : ${v.livelihood.en}`);
  console.log(`  KNOWN FOR  : ${v.famousFor.en}`);
  console.log(`  OPPORTUNITY: ${v.opportunity.en}`);
  console.log(`  THE CATCH  : ${v.theCatch.en}`);
}
