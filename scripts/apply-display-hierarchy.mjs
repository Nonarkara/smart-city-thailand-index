/**
 * A REFERENCE BAND SETS ITS FIGURES AT BODY SIZE;
 * A CLAIM-BEARING CARD KEEPS DISPLAY
 * ==========================================
 * The homepage shouted the same numbers twice. The hero's telemetry band
 * read 118 / 39 / 37 at display size; 537px below it the opening
 * argument led with 118 / 37 / 7 at display size. Two of the three were
 * the same number in the same size — the mechanical repetition the whole
 * pass exists to remove.
 *
 * The rule this applies, everywhere:
 *
 *   · A REFERENCE BAND — a row of figures that indexes the release
 *     (the hero telemetry, the /invest macro strip, the /audit scope
 *     ledger) — sets its figures at body size. It is a table, not a
 *     headline, and a table of 32px numerals is a wall of noise.
 *
 *   · A CLAIM-BEARING CARD — a figure that IS the point of its panel
 *     (the podium scores, the confidence bands, the world bank's GDP at
 *     risk) — keeps display size, and appears once.
 *
 * So the numbers move:
 *
 *   · .opening-argument-num  32px → body. The numeral already opens its
 *     sentence ("118 city records in this release…"), so the fact
 *     survives at body size; the hero keeps the display statement.
 *   · .regional-champion-score 32px → body. A six-item list, and in the
 *     road-safety variant the same class holds the UNIT "deaths/yr" —
 *     a unit repeated five times at display size. It also duplicated
 *     the podium's scores for the same cities.
 *   · .audit-kpi-value 32px → body. A four-tile release ledger; the
 *     confidence cards below keep display size for their own counts.
 *
 * The script is idempotent: it asserts the AFTER state and only writes
 * when something is still off. A rule that re-declares the size
 * elsewhere in the file (a more specific selector, a media query) has
 * to move too, or the demotion is silently undone on exactly the widths
 * the massacre measures.
 *
 * Run: node scripts/apply-display-hierarchy.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const CSS = "src/styles.css";
let css = readFileSync(CSS, "utf8");
const before = css;
let changed = 0;

/** Replace `from` with `to`, tolerating an already-applied file. */
function enforce(from, to, label) {
  if (css.includes(to)) {
    console.log(`    ${label}: already applied`);
    return;
  }
  const count = css.split(from).length - 1;
  if (count !== 1) {
    console.error(`FAIL: ${label} — expected 1 occurrence of the "before" form, found ${count}`);
    process.exit(1);
  }
  css = css.split(from).join(to);
  changed++;
  console.log(`    ${label}: applied`);
}

enforce(
  `.opening-argument-num {
  font: 800 var(--text-display)/1 var(--mono);
  color: #fff;
  letter-spacing: -0.04em;
  display: block;
  /* Amber underline accent — the equals-key on the Braun ET66 */
  border-bottom: 3px solid var(--amber, #f59e0b);
  padding-bottom: 0.5rem;
  width: fit-content;
  margin-bottom: 0.25rem;
}`,
  `.opening-argument-num {
  /* Body size, not display. The hero's telemetry band already states
   * 118 and 37 at display size, 537px above this one; repeating the
   * same numeral in the same size is the mechanical repetition this
   * pass removes. The numeral still opens its sentence. */
  font: 800 var(--text-body)/1.25 var(--mono);
  color: #fff;
  letter-spacing: -0.01em;
  display: block;
  /* Amber underline accent — the equals-key on the Braun ET66 */
  border-bottom: 3px solid var(--amber, #f59e0b);
  padding-bottom: 0.4rem;
  width: fit-content;
  margin-bottom: 0.25rem;
}`,
  ".opening-argument-num",
);

enforce(
  `  .opening-argument-num { font-size: var(--text-display); }`,
  `  .opening-argument-num { font-size: var(--text-body); }`,
  ".opening-argument-num (phone media query)",
);

enforce(
  `.regional-champion-score {
  font: 600 var(--text-display) var(--mono);
  color: var(--ink);
  letter-spacing: -0.01em;
}`,
  `.regional-champion-score {
  /* Body size. A six-item list is a reference band, and in the
   * road-safety variant this class carries the UNIT "deaths/yr" — five
   * units at display size, side by side. It also duplicated the podium
   * scores for the same cities. */
  font: 700 var(--text-body) var(--mono);
  color: var(--ink);
  letter-spacing: -0.01em;
}`,
  ".regional-champion-score",
);

enforce(
  `.audit-kpi-value { font: 800 var(--text-display) var(--font-heading); line-height: 1; margin-bottom: 0.25rem; }`,
  `.audit-kpi-value { font: 800 var(--text-body) var(--mono); line-height: 1.2; margin-bottom: 0.25rem; }`,
  ".audit-kpi-value (heading face)",
);

enforce(
  `.audit-kpi-value { font: 700 var(--text-display) var(--mono); margin-bottom: .1rem; }`,
  `.audit-kpi-value { font: 700 var(--text-body) var(--mono); margin-bottom: .1rem; }`,
  ".audit-kpi-value (compact)",
);

enforce(
  `.audit-kpi-value { font: 700 var(--text-display) var(--mono); line-height: 1; margin-bottom: 0.25rem; }`,
  `.audit-kpi-value { font: 700 var(--text-body) var(--mono); line-height: 1.2; margin-bottom: 0.25rem; }`,
  ".audit-kpi-value (page)",
);

enforce(
  `.audit-page .audit-kpi-value,
.audit-page .audit-verified-claim > span,
.audit-page .audit-proof-result strong { font-size: var(--text-display); }`,
  `.audit-page .audit-kpi-value { font-size: var(--text-body); }
.audit-page .audit-verified-claim > span,
.audit-page .audit-proof-result strong { font-size: var(--text-display); }`,
  ".audit-page .audit-kpi-value (specificity)",
);

// ── Assert the AFTER state ──────────────────────────────────────────────
const required = [
  ["font: 800 var(--text-body)/1.25 var(--mono);", "opening-argument-num is body size"],
  ["  .opening-argument-num { font-size: var(--text-body); }", "opening-argument-num stays body size on phones"],
  [".regional-champion-score {\n  /* Body size.", "regional-champion-score is body size"],
  [".audit-kpi-value { font: 700 var(--text-body) var(--mono); line-height: 1.2;", "audit-kpi-value is body size"],
  [".audit-page .audit-kpi-value { font-size: var(--text-body); }", "audit-kpi-value specificity rule follows"],
  [".hero-stat-num {", "the hero keeps its display statement"],
  [".podium-photo-score {", "the podium keeps its claim"],
  [".audit-domain-score-val {", "the confidence cards keep their counts"],
];
for (const [needle, label] of required) {
  if (!css.includes(needle)) {
    console.error(`FAIL: ${label} — missing "${needle.slice(0, 60)}"`);
    process.exit(1);
  }
}
// No rule may still declare these at display size.
const forbidden = [
  [".audit-kpi-value", /audit-kpi-value[^{]*\{[^}]*text-display/g, "audit-kpi-value must not be display size"],
  [".opening-argument-num", /opening-argument-num[^{]*\{[^}]*text-display/g, "opening-argument-num must not be display size"],
  [".regional-champion-score", /regional-champion-score[^{]*\{[^}]*text-display/g, "regional-champion-score must not be display size"],
];
for (const [label, re, message] of forbidden) {
  const hits = css.match(re);
  if (hits) {
    console.error(`FAIL: ${message}`);
    for (const h of hits) console.error(`      ${h.replace(/\s+/g, " ").trim()}`);
    process.exit(1);
  }
}

const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`FAIL: brace imbalance ${open}/${close}`);
  process.exit(1);
}
if (changed === 0) {
  console.log("OK  display hierarchy already in place — nothing written");
} else {
  writeFileSync(CSS, css);
  console.log(`OK  display hierarchy applied  (${changed} rules, +${css.length - before.length} bytes, braces ${open}/${close})`);
}
