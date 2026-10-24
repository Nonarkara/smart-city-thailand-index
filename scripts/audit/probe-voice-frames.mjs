/**
 * DOES THE PROSE STILL READ LIKE A TEMPLATE?
 * ==========================================
 * The complaint was mechanical: every city said the same thing. Two
 * different defects hide behind that complaint, and they need different
 * instruments.
 *
 *   1. THE FRAME. Strip the digits out of a city's sentences and you are
 *      left with the skeleton — the frame the words are poured into. If
 *      sixty-eight cities share one skeleton, the sentences are a form
 *      with the numbers filled in, and a reader moving from one page to
 *      the next will feel the repeat before they can name it.
 *
 *   2. THE REPEATED FACT. A number that appears in two fields on the
 *      same page reads as a template even when both sentences are true.
 *
 * This probe measures both against the real builders, in all three
 * languages, and prints the worst offenders.
 *
 * Run: node scripts/audit/probe-voice-frames.mjs
 */
import { allCities } from "../../src/cityData.ts";
import { cityContexts } from "../../src/cityContext.ts";
import { buildProvinceSentenceSets } from "../../src/provinceNarrative.ts";

/** The 68 cities whose context came from the generated builder. */
function isGenerated(city) {
  const ctx = cityContexts[city.id];
  return Boolean(ctx && city && ctx.livelihood.en.startsWith(`${city.nameEn} is `));
}

const generated = allCities.filter(isGenerated);

const FIELDS = ["livelihood", "famousFor", "opportunity", "theCatch"];
const LOCALES = ["en", "th", "zh"];

console.log(`generated cities: ${generated.length}\n`);

// ── 1. FRAME DISTRIBUTION ────────────────────────────────────────────────
//
// The skeleton keeps the words and drops the numbers and the names, so two
// cities that say the same things in the same order share a skeleton.

function skeleton(text, city) {
  return text
    .split(city.nameEn).join("<CITY>")
    .split(city.nameTh).join("<CITY>")
    .split(city.province).join("<PROV>")
    .split(city.provinceTh).join("<PROV>")
    .replace(/\d+(?:[.,]\d+)?/g, "#");
}

console.log("=".repeat(78));
console.log("FRAME DISTRIBUTION — how many cities share one skeleton");
console.log("=".repeat(78));

const worst = [];
for (const locale of LOCALES) {
  for (const field of FIELDS) {
    const groups = new Map();
    for (const city of generated) {
      const ctx = cityContexts[city.id];
      const sk = skeleton(ctx[field][locale], city);
      if (!groups.has(sk)) groups.set(sk, []);
      groups.get(sk).push(city.id);
    }
    const ranked = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
    const largest = ranked[0]?.[1].length ?? 0;
    const total = generated.length;
    // The count that actually matters. Several municipalities share ONE
    // province — five of the 68 are districts of Bangkok — and province-level
    // readings are identical for all of them by construction. A frame shared
    // only by cities of one province is the data's geography, not a template.
    // A frame shared across DIFFERENT provinces is the mechanical residue.
    let widest = 0;
    let widestGroup = [];
    for (const [, ids] of groups) {
      const provinces = new Set(ids.map(id => allCities.find(c => c.id === id)?.province));
      if (provinces.size > widest) {
        widest = provinces.size;
        widestGroup = ids;
      }
    }
    console.log(
      `\n  ${locale} / ${field}: ${groups.size} distinct skeletons across ${total} cities — largest group holds ${largest} cities (${((largest / total) * 100).toFixed(0)}%), widest across ${widest} province(s)`
    );
    for (const [sk, ids] of ranked.slice(0, 2)) {
      if (ids.length <= 1) break;
      const provinces = new Set(ids.map(id => allCities.find(c => c.id === id)?.province));
      console.log(`     ${String(ids.length).padStart(3)} cities across ${provinces.size} province(s) — e.g. ${ids.slice(0, 4).join(", ")}`);
      console.log(`        "${sk.slice(0, 130)}${sk.length > 130 ? "…" : ""}"`);
      worst.push({ locale, field, count: ids.length, provinces: provinces.size, sk, ids });
    }
  }
}

// ── 2. THE SAME NUMBER IN TWO FIELDS ─────────────────────────────────────
//
// Contextual numbers are excluded: the province count ("77 provinces
// measured") and the source years are the same in every sentence by
// design and are not facts about the place.

const ALLOW = new Set([
  "2022", "2023", "2026", "2565", "2568", "2569", "66", "69",
  "71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
]);

function numbers(text) {
  const out = [];
  for (const m of text.matchAll(/\d+(?:[.,]\d+)?/g)) {
    const raw = m[0];
    const n = raw.replace(/,/g, "");
    if (ALLOW.has(n)) continue;
    out.push(raw);
  }
  return out;
}

console.log(`\n${"=".repeat(78)}`);
console.log("REPEATED FACT — the same number in two fields of one city");
console.log("=".repeat(78));

let repeats = 0;
for (const city of generated) {
  const ctx = cityContexts[city.id];
  const seen = new Map();
  for (const field of FIELDS) {
    for (const num of numbers(ctx[field].en)) {
      if (!seen.has(num)) seen.set(num, []);
      seen.get(num).push(field);
    }
  }
  for (const [num, fields] of seen) {
    if (fields.length > 1) {
      repeats++;
      console.log(`  ${city.id}: ${num} appears in ${fields.join(" + ")}`);
    }
  }
}
console.log(`\n  repeated facts: ${repeats}`);

// ── 3. UNTERMINATED SENTENCES ────────────────────────────────────────────
//
// Read from the raw sentence sets, not from the joined string, so the
// boundary is known rather than guessed.

console.log(`\n${"=".repeat(78)}`);
console.log("TERMINATORS — every English sentence ends with a full stop");
console.log("=".repeat(78));

let unterminated = 0;
let zhUnterminated = 0;
for (const city of generated) {
  const sets = buildProvinceSentenceSets(city);
  for (const field of FIELDS) {
    for (const s of sets[field].en) {
      if (!/[.!?…]$/.test(s.trim())) {
        unterminated++;
        console.log(`  ${city.id} / ${field}: "${s.trim()}"`);
      }
    }
    for (const s of sets[field].zh) {
      if (!/[。！？…]$/.test(s.trim())) {
        zhUnterminated++;
        console.log(`  ${city.id} / ${field} (zh): "${s.trim()}"`);
      }
    }
  }
}
console.log(`\n  unterminated English sentences: ${unterminated}`);
console.log(`  unterminated Chinese sentences: ${zhUnterminated}`);

console.log(`\n${"=".repeat(78)}`);
console.log("VERDICT");
console.log("=".repeat(78));
const widestProvinces = Math.max(
  ...LOCALES.flatMap(locale =>
    FIELDS.map(field => {
      const groups = new Map();
      for (const city of generated) {
        const sk = skeleton(cityContexts[city.id][field][locale], city);
        if (!groups.has(sk)) groups.set(sk, new Set());
        groups.get(sk).add(city.province);
      }
      return Math.max(...[...groups.values()].map(set => set.size));
    })
  )
);
console.log(`  widest single frame across distinct provinces: ${widestProvinces}`);
console.log(`  repeated facts: ${repeats}`);
console.log(`  unterminated sentences: ${unterminated} en / ${zhUnterminated} zh`);
console.log(
  `  ${widestProvinces <= 2 && repeats === 0 && unterminated === 0 && zhUnterminated === 0
    ? "PASS — no frame is shared across more than two provinces, every sentence is finished"
    : "FINDINGS ABOVE"}`
);
