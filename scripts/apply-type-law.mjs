/**
 * THE TYPE LAW — applied to the stylesheet
 * =======================================
 * §11.7: a page may have at most three distinct text sizes. The canonical
 * SCITI scale is display 32 / body 14 / micro 11.
 *
 * The scale shipped as four steps (64 / 32 / 14 / 11.5), with section
 * headings at five different sizes and <h3> at three. An eye cannot build a
 * hierarchy from that, and it left every page reading as the same flat
 * field of text.
 *
 * So the section level can no longer be carried by size. It is carried by
 * WEIGHT (800 section, 650 card, 400 running text), by COLOUR (ink against
 * body grey), and by the rhythm scale. That is the Swiss grid's way of
 * saying "this is a division" without a bigger number — and it is what
 * lets the hierarchy survive a squinted screenshot on a phone.
 *
 *   display 32px  one per page: the page's single statement, plus the
 *                 composite numerals (a score, a year, a count).
 *   body    14px  everything else, at three weights.
 *   micro   11px  eyebrows, tracked uppercase ticks, tiny meta.
 *
 * This script edits by BRACE MATCHING, never by a loose selector regex:
 * a regex that spans rule bodies can swallow two thousand lines of CSS.
 * Every edit is counted and asserted.
 *
 * Run: node scripts/apply-type-law.mjs
 */
import fs from "node:fs";
import path from "node:path";

const CSS = path.resolve("src/styles.css");
let src = fs.readFileSync(CSS, "utf8");
const edits = [];

/** Replace the first occurrence of an exact string. Throws if absent. */
function replaceExact(from, to, label) {
  const i = src.indexOf(from);
  if (i < 0) throw new Error(`anchor not found: ${label}`);
  if (src.indexOf(from, i + 1) >= 0) throw new Error(`anchor is ambiguous: ${label}`);
  src = src.slice(0, i) + to + src.slice(i + from.length);
  edits.push(label);
}

/**
 * Set font-size inside the rule whose selector contains `selectorNeedle`.
 * Uses brace matching so the edit can never cross a rule boundary.
 */
function setFontSizeInRule(selectorNeedle, value, label) {
  let i = 0, hits = 0;
  while (true) {
    const at = src.indexOf(selectorNeedle, i);
    if (at < 0) break;
    // The needle sits in the SELECTOR, so the rule's opening brace is the
    // next one after it — not the previous one, which would be the rule
    // above.
    const braceStart = src.indexOf("{", at);
    if (braceStart < 0) break;
    // walk forward, brace matching, to the end of the rule body
    let depth = 1, j = braceStart + 1;
    while (j < src.length && depth) {
      if (src[j] === "{") depth++;
      else if (src[j] === "}") depth--;
      j++;
    }
    const body = src.slice(braceStart + 1, j - 1);
    if (!/font-size\s*:/.test(body)) { i = at + 1; continue; }
    const newBody = body.replace(/font-size:\s*[^;]+;/, `font-size: ${value};`);
    // Already at the target value — that is a hit, not a miss, so the
    // script can be run twice without complaining.
    if (newBody === body) { hits++; i = at + 1; continue; }
    src = src.slice(0, braceStart + 1) + newBody + src.slice(j - 1);
    hits++;
    edits.push(`${label} → ${value}`);
    i = braceStart + newBody.length + 2;
  }
  if (!hits) throw new Error(`no font-size found for ${label}`);
}

/**
 * Replace the size inside a `font:` shorthand within the named rule.
 */
function setFontShorthandSizeInRule(selectorNeedle, token, label) {
  const at = src.indexOf(selectorNeedle);
  if (at < 0) throw new Error(`anchor not found: ${label}`);
  const braceStart = src.indexOf("{", at);
  let depth = 1, j = braceStart + 1;
  while (j < src.length && depth) {
    if (src[j] === "{") depth++;
    else if (src[j] === "}") depth--;
    j++;
  }
  const body = src.slice(braceStart + 1, j - 1);
  const newBody = body.replace(
    /(font:\s*[^;]*?)(var\(--text-[a-z]+\)|[\d.]+(?:rem|px))/,
    (m, head, size) => `${head}${token}`,
  );
  if (newBody === body) {
    // Already at the target — a hit, so the script is safe to run twice.
    edits.push(`${label} → ${token} (already)`);
    return;
  }
  src = src.slice(0, braceStart + 1) + newBody + src.slice(j - 1);
  edits.push(`${label} → ${token}`);
}

/* ── 1. the outline-levels block becomes the three-tier law ─────────────── */

if (src.includes("/* ─── OUTLINE LEVELS — one size per level, site-wide ───")) {
replaceExact(
  `/* ─── OUTLINE LEVELS — one size per level, site-wide ───
 * Measured 2026-10: section headings shipped at five different sizes
 * (14 / 27.2 / 32 / 38.4 / 51.2px) and <h3> at three (14 / 17.6 / 32), with
 * /knowledge carrying a 32px <h3> above its 27.2px <h2>. An eye cannot build a
 * hierarchy from that, and Webflow rule 2 fails outright.
 *
 * The scale is now four steps and every one is a canonical token:
 *   64px  page <h1>          (.hero-title — the page's single statement)
 *   32px  section <h2>       --text-display
 *   14px  card / <h3>        --text-body, bold
 *   11.5px labels            --text-micro
 * Page title → section → body is a clean ~1.4–2:1 descent on every route. */
h2 { font-size: var(--text-display); font-weight: 700; letter-spacing: -.03em; line-height: 1.1; margin-bottom: .35rem; }
h3 { font-size: var(--text-body); font-weight: 700; letter-spacing: -.01em; line-height: 1.3; }`,
  `/* ─── THE TYPE LAW — three sizes, site-wide ──────────────────────────────
 * §11.7: a page may have at most three distinct text sizes. The canonical
 * SCITI scale is display 32 / body 14 / micro 11, and every text size on
 * the site now resolves to one of them.
 *
 * The scale shipped as four steps (64 / 32 / 14 / 11.5), with section
 * headings at five different sizes and <h3> at three — and /methodology
 * carrying a 32px <h3> above its own <h2>. An eye cannot build a hierarchy
 * from that, and it left every page reading as the same flat field of text.
 *
 * So the section level can no longer be carried by size. It is carried by
 * WEIGHT (800 section, 650 card, 400 running text), by COLOUR (ink against
 * body grey), and by the rhythm scale. That is the Swiss grid's way of
 * saying "this is a division" without a bigger number — and it is what
 * lets the hierarchy survive a squinted screenshot on a phone.
 *
 *   display 32px  one per page: the page's single statement, plus the
 *                 composite numerals (a score, a year, a count).
 *   body    14px  everything else, at three weights.
 *   micro   11px  eyebrows, tracked uppercase ticks, tiny meta.
 */
h2 { font-size: var(--text-body); font-weight: 800; letter-spacing: -.02em; line-height: 1.25; color: var(--ink); }
h3 { font-size: var(--text-body); font-weight: 650; letter-spacing: -.01em; line-height: 1.3; }
h4 { font-size: var(--text-micro); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--3); }`,
  "the outline-levels block → the three-tier law",
);
} else {
  edits.push("the outline-levels block → already the three-tier law");
}

/* ── 2. the rules that would otherwise force a heading off its level ───── */

setFontSizeInRule(".action-atlas-stage-header h3", "var(--text-body)", ".action-atlas-stage-header h3");
setFontSizeInRule(".feedback-cta h2", "var(--text-body)", ".feedback-cta h2");
setFontSizeInRule(".transparency-inner h2", "var(--text-body)", ".transparency-inner h2");
setFontSizeInRule(".investor-inner h2", "var(--text-body)", ".investor-inner h2");
setFontSizeInRule(".city-scope-meta h2", "var(--text-body)", ".city-scope-meta h2");
setFontSizeInRule(".vibe-map-header h2", "var(--text-body)", ".vibe-map-header h2");

setFontShorthandSizeInRule(".opening-argument-headline {", "var(--text-body)", ".opening-argument-headline");
setFontSizeInRule(".opening-argument-headline", "var(--text-body)", ".opening-argument-headline (media)");

for (const cls of [
  ".baseline-gap-title",
  ".baseline-sources-title",
  ".home-section-title",
  ".open-data-title",
  ".picks-section-title",
  ".spotlight-title",
]) {
  setFontSizeInRule(cls, "var(--text-body)", cls);
}

/* ── 3. the h4 rules that exist sit in the micro tier like every other h4 ── */
// .program-logo-requirement h4 already declares the micro token.
setFontShorthandSizeInRule(".city-lens-card h4", "var(--text-micro)", ".city-lens-card h4");

/* ── 4. the legacy Major-Third aliases stop being used ─────────────────── */
// --text-xs (11.52) → micro, --text-sm (13.6) → body, --text-md (20) →
// display for numerals and body for the city name.
const ALIAS = [
  ["font: 700 var(--text-xs) var(--mono);", "font: 700 var(--text-micro) var(--mono);", "--text-xs (eyebrow)"],
  ["font: 500 var(--text-xs) var(--mono, monospace);", "font: 500 var(--text-micro) var(--mono, monospace);", "--text-xs (rank)"],
  ["font: 500 var(--text-xs) var(--mono);", "font: 500 var(--text-micro) var(--mono);", "--text-xs (vibe)"],
  ["font: 600 var(--text-xs) var(--mono);", "font: 600 var(--text-micro) var(--mono);", "--text-xs (mono)"],
  ["font: 600 var(--text-sm) var(--mono); letter-spacing: .18em;", "font: 600 var(--text-micro) var(--mono); letter-spacing: .18em;", "--text-sm (tracked)"],
  ["font: 500 var(--text-sm) var(--mono); color: rgba(255,255,255,.75);", "font: 500 var(--text-micro) var(--mono); color: rgba(255,255,255,.75);", "--text-sm (photo caption)"],
  ["font: 600 var(--text-sm) var(--mono); color: rgba(255,255,255,.75);", "font: 600 var(--text-micro) var(--mono); color: rgba(255,255,255,.75);", "--text-sm (podium rank)"],
  ["font: 600 var(--text-md) var(--font);", "font: 600 var(--text-body) var(--font);", "--text-md (city name)"],
  ["font: 600 var(--text-md) var(--mono);", "font: 600 var(--text-display) var(--mono);", "--text-md (score)"],
  ["font: 700 var(--text-md) var(--mono, monospace);", "font: 700 var(--text-display) var(--mono, monospace);", "--text-md (rank score)"],
];
for (const [a, b, label] of ALIAS) {
  if (src.includes(a)) {
    src = src.split(a).join(b);
    edits.push(label);
  }
}

/* ── 5. the decorative quotation glyph is an ornament, not text ────────── */
// It lives in a ::before with no text node, so it is outside the page's
// text sizes by construction. It is left at 8rem on purpose.

fs.writeFileSync(CSS, src);
console.log(`edits applied: ${edits.length}`);
for (const e of edits) console.log("  ·", e);
