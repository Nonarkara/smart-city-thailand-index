/**
 * DOES EVERY CITY'S PROVINCE RESOLVE TO A DATASET KEY?
 * =====================================================
 * A province whose name does not resolve falls through to "no record" —
 * and the narrative then claims the data is absent when it is present
 * under a different spelling. That is the worst kind of failure: a
 * false statement of absence.
 *
 * This lists every city whose province does not resolve, and shows the
 * closest dataset keys, so the aliases can be written from evidence
 * rather than from a guess.
 *
 * Run: node scripts/audit/probe-province-resolution.mjs
 */
import { allCities } from "../../src/cityData.ts";
import { PROVINCE_BASELINE_BY_ID } from "../../src/provinceBaselineData.ts";
import { ABSORPTION_PROVINCES } from "../../src/absorptionData.ts";
import { canonicalProvince } from "../../src/provinceVoice.ts";

const known = new Set();
for (const map of Object.values(PROVINCE_BASELINE_BY_ID)) {
  for (const k of Object.keys(map)) known.add(k);
}
for (const k of Object.keys(ABSORPTION_PROVINCES)) known.add(k);
const knownList = [...known].sort();

function norm(s) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}
const knownNorm = new Map(knownList.map(k => [norm(k), k]));

const unresolved = [];
for (const city of allCities) {
  const c = canonicalProvince(city.province);
  if (!c) {
    // Find candidates: exact normalized match, or high overlap.
    const target = norm(city.province);
    const exact = knownNorm.get(target);
    const candidates = knownList
      .filter(k => {
        const n = norm(k);
        let shared = 0;
        for (const ch of new Set(target)) if (n.includes(ch)) shared++;
        return shared / Math.max(target.length, n.length) > 0.6;
      })
      .slice(0, 4);
    unresolved.push({ id: city.id, city: city.nameEn, province: city.province, exact, candidates });
  }
}

console.log(`cities: ${allCities.length}`);
console.log(`provinces that DO resolve: ${allCities.length - unresolved.length}`);
console.log(`provinces that do NOT resolve: ${unresolved.length}\n`);

const byProvince = new Map();
for (const u of unresolved) {
  if (!byProvince.has(u.province)) byProvince.set(u.province, u);
}
for (const u of byProvince.values()) {
  console.log(`  "${u.province}"  (${u.id})`);
  console.log(`     exact normalized match in datasets: ${u.exact ?? "NONE"}`);
  console.log(`     candidate dataset keys           : ${u.candidates.join(" | ")}`);
}

console.log("\n=== all dataset province keys, for building the alias table ===");
console.log(knownList.join(" | "));
