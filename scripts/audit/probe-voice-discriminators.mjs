/**
 * WHICH UNUSED READING SPLITS THE BIGGEST FRAME GROUPS?
 * =====================================================
 * The banded frames cut the largest group of identical skeletons down to
 * between four and ten cities. The remainder is not a fault in the
 * mechanism — it is that the readings already in use move together, so
 * several provinces land in the same band on every one of them.
 *
 * Before writing another clause, measure: for the biggest groups that are
 * left, which of the UNUSED indicators would put them in different bands?
 * An indicator that splits nothing adds prose for nothing.
 *
 * Run: node scripts/audit/probe-voice-discriminators.mjs
 */
import { allCities } from "../../src/cityData.ts";
import { cityContexts } from "../../src/cityContext.ts";
import { bandIn } from "../../src/provinceVoice.ts";

function isGenerated(city) {
  const ctx = cityContexts[city.id];
  return Boolean(ctx && city && ctx.livelihood.en.startsWith(`${city.nameEn} is `));
}
const generated = allCities.filter(isGenerated);

function skeleton(text, city) {
  return text
    .split(city.nameEn).join("<CITY>")
    .split(city.nameTh).join("<CITY>")
    .split(city.province).join("<PROV>")
    .split(city.provinceTh).join("<PROV>")
    .replace(/\d+(?:[.,]\d+)?/g, "#");
}

const FIELDS = ["livelihood", "famousFor", "opportunity", "theCatch"];

/** The five readings the narrative does not use yet. */
const UNUSED = [
  "nso-hygienic-toilet",
  "nso-home-ownership",
  "nso-non-durable-housing",
  "nso-born-elsewhere",
  "moe-residential-electricity-share",
];

// The bands each city already sits in, per field.
const used = {
  livelihood: [
    ["nso-province-population", "high"],
    ["nso-internal-migration", "high"],
  ],
  famousFor: [
    ["rfd-forest-coverage", "high"],
    ["moe-electricity-per-capita", "high"],
    ["nso-drinking-water", "high"],
  ],
  opportunity: [
    ["nso-residential-permits", "high"],
  ],
  theCatch: [
    ["rtddi-road-deaths", "high"],
    ["rtddi-motorcycle-share", "high"],
    ["pcd-pm25-annual", "low"],
  ],
};

for (const field of FIELDS) {
  const groups = new Map();
  for (const city of generated) {
    const sk = skeleton(cityContexts[city.id][field].en, city);
    if (!groups.has(sk)) groups.set(sk, []);
    groups.get(sk).push(city);
  }
  const ranked = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const biggest = ranked[0];
  console.log(`\n${"=".repeat(78)}`);
  console.log(`${field}: largest group holds ${biggest[1].length} — ${biggest[1].map(c => c.id).join(", ")}`);
  console.log("=".repeat(78));

  // The bands these cities already share.
  for (const [indicator, direction] of used[field]) {
    const bands = biggest[1].map(c => bandIn(indicator, c.province, direction)?.band);
    console.log(`  in use   ${indicator.padEnd(34)} bands: ${bands.join(",")}`);
  }

  // Would each unused indicator break the group?
  for (const indicator of UNUSED) {
    const bands = biggest[1].map(c => bandIn(indicator, c.province, "high")?.band);
    const distinct = new Set(bands).size;
    const coverage = bands.filter(b => b !== undefined).length;
    const marker = distinct > 1 ? "SPLITS" : "flat  ";
    console.log(`  unused  ${indicator.padEnd(34)} ${marker} distinct bands: ${distinct} of ${coverage} — ${bands.join(",")}`);
  }
}
