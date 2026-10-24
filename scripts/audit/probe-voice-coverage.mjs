/**
 * WHICH CITIES ACTUALLY HAVE CURATED CONTEXT?
 * ============================================
 * cityContext.ts ends with a loop that fills in a generated fallback for
 * every city without a curated entry, so `getCityContext()` returns a
 * value for all 118 — and a coverage count built on it reads as "118/118
 * curated", which is false.
 *
 * This counts the CURATED entries (the literal keys in cityContexts)
 * and, for the rest, reports what measured data each city actually has.
 * The generated fallback can only cite what exists; where nothing exists,
 * the honest sentence says so rather than inventing a personality.
 *
 * Run: node scripts/audit/probe-voice-coverage.mjs
 */
import { allCities } from "../../src/cityData.ts";
import { cityContexts } from "../../src/cityContext.ts";
import { resolveCityResearch } from "../../src/cityResearch.ts";

const FIELDS = [
  "population", "gppPerCapita", "avgMonthlyIncome", "pm25Annual",
  "hospitalBedsPer10k", "crimeRatePer100k", "greenCoverage", "gppGrowthRate",
  "laborForce", "waterQuality", "forestCoverage", "fdiInflow",
  "floodFrequencyScore", "landPriceBaht", "industryComposition",
];

// The curated entries are the ones written by hand. The generated ones are
// appended by the loop at the end of cityContext.ts. Curated ones have a
// real, city-specific livelihood string; generated ones are formulaic.
// Distinguish by the shape of the text: generated livelihood always begins
// with the city name followed by " is " and a role phrase.
function isGenerated(city) {
  const ctx = cityContexts[city.id];
  if (!ctx) return true;
  return ctx.livelihood.en.startsWith(`${city.nameEn} is `);
}

const curated = allCities.filter(c => !isGenerated(c));
const generated = allCities.filter(c => isGenerated(c));

console.log(`total cities     : ${allCities.length}`);
console.log(`curated context  : ${curated.length}`);
console.log(`generated context: ${generated.length}`);

console.log("\n=== field coverage among the GENERATED cities ===");
for (const f of FIELDS) {
  const n = generated.filter(c => c.metrics[f] !== undefined && c.metrics[f] !== null).length;
  const pct = Math.round((n / generated.length) * 100);
  const bar = "#".repeat(Math.round((n / generated.length) * 32)).padEnd(32, ".");
  console.log(`  ${f.padEnd(22)} ${String(n).padStart(3)}/${generated.length} (${String(pct).padStart(3)}%)  ${bar}`);
}

console.log("\n=== generated cities, ordered by how much measured data they have ===");
const rows = generated.map(c => {
  let n = 0;
  for (const f of FIELDS) if (c.metrics[f] !== undefined && c.metrics[f] !== null) n++;
  const r = resolveCityResearch(c);
  const hasHighlights = (c.highlights || []).length > 0;
  return { id: c.id, name: c.nameEn, facts: n, highlights: hasHighlights, status: c.status };
});
rows.sort((a, b) => a.facts - b.facts);
console.log("  thinnest 15:");
for (const r of rows.slice(0, 15)) {
  console.log(`    ${String(r.facts).padStart(2)} metrics  ${r.id.padEnd(24)} ${r.name.padEnd(26)} status=${r.status} highlights=${r.highlights}`);
}
const rich = rows.filter(r => r.facts >= 8).length;
const mid = rows.filter(r => r.facts >= 5 && r.facts < 8).length;
const thin = rows.filter(r => r.facts < 5).length;
console.log(`\n  rich (8+ metrics): ${rich}   workable (5-7): ${mid}   thin (<5): ${thin}`);

const noHighlights = rows.filter(r => !r.highlights).length;
console.log(`  generated cities with no highlights array: ${noHighlights}`);

// Which generated cities share the identical registered tagline?
const sameTagline = generated.filter(c => c.tagline === "Promotion zone — awaiting sufficient data for full assessment.").length;
console.log(`  generated cities sharing the identical registered tagline: ${sameTagline}`);
