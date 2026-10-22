/**
 * THE THREE FIXES
 * ===============
 * Three real spatial defects, measured by the rhythm census:
 *
 *   1. /invest  40px x5   the macro table's row transition. Eight cells
 *                          in an auto-fit grid resolved to six columns,
 *                          so the last row sat four cells short — a table
 *                          that reads as broken — and the air between two
 *                          rows had no rule to mark it.
 *   2. /story   56px      the last timeline item's 24px of padding plus
 *                          the item margin plus the section step: three
 *                          gaps for one division.
 *   3. /partners 38px     the globe legend's 5.6px of bottom padding on
 *                          top of the section step.
 *
 * Every edit is an exact, asserted, single-occurrence replacement. The
 * script verifies the file still parses and that no selector was lost.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");
const before = css;

/** Count every rule's selector in a stylesheet. */
const selectors = (text) => {
  const out = [];
  const re = /(^|})\s*([^{}@]+\{)/g;
  let m;
  while ((m = re.exec(text))) {
    const sel = m[2].trim().replace(/\s+/g, " ");
    if (sel && !sel.startsWith("@") && !sel.startsWith("/*")) out.push(sel);
  }
  return out;
};

const selBefore = selectors(before);

/** Replace `needle` exactly once. Throws if it is missing or ambiguous. */
function once(needle, replacement, label) {
  const parts = css.split(needle);
  if (parts.length !== 2) {
    throw new Error(`${label}: expected exactly 1 match, found ${parts.length - 1}`);
  }
  css = parts[0] + replacement + parts[1];
  console.log(`  ✓ ${label}`);
}

// ── 1. THE MACRO TABLE ────────────────────────────────────────────────
// The column count must DIVIDE the cell count. Eight cells: two columns
// on a phone, four on a wide screen — never six, which strands four
// empty cells. Every cell carries its own hairline, so a row boundary
// is a rule: the air on either side of it is marked air, not a hole.
const MACRO = `/* ─── THE MACRO TABLE ───
 * Eight cells. The column count DIVIDES the cell count — auto-fit
 * resolved to six columns and stranded four empty cells, so the table
 * read as broken. Every cell carries its own hairline, which means a
 * row boundary is a rule: the air on either side of it is marked air,
 * not a hole.
 */
.invest-macro-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid var(--5);
  border-left: 1px solid var(--5);
}
.invest-macro-cell {
  display: flex;
  flex-direction: column;
  gap: .35rem;
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--5);
  border-bottom: 1px solid var(--5);
}
.invest-macro-label {
  font: 700 var(--text-micro) var(--mono);
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--3);
}
.invest-macro-value {
  font: 800 var(--text-display) var(--font-heading);
  letter-spacing: -.04em;
  color: var(--ink);
}
.invest-macro-sub {
  font: 500 var(--text-micro) var(--font);
  color: var(--2);
}
@media (min-width: 720px) {
  .invest-macro-grid { grid-template-columns: repeat(4, 1fr); }
}
`;
once(
  `/* ─── STORY TIMELINE ─── */`,
  MACRO + `\n/* ─── STORY TIMELINE ─── */`,
  "macro table CSS inserted"
);

// ── 2. THE STORY TIMELINE ─────────────────────────────────────────────
// The last item has no rule under it, so its 24px of padding was
// invisible air on top of the section step. Give it none.
once(
  `.story-tl-item:last-child .story-tl-content { border-bottom: 0; }`,
  `.story-tl-item:last-child .story-tl-content { padding-bottom: 0; border-bottom: 0; }`,
  "story: last timeline item gives up its padding"
);

// ── 3. THE GLOBE LEGEND ───────────────────────────────────────────────
// The legend's bottom padding sat on top of the section step. The step
// owns the division; the legend keeps its top padding, which belongs to
// the legend.
once(
  `  padding: .35rem 0; font: 500 var(--text-micro) var(--mono); color: var(--3);`,
  `  padding: .35rem 0 0; font: 500 var(--text-micro) var(--mono); color: var(--3);`,
  "partners: legend gives up its bottom padding"
);

// ── VERIFY ─────────────────────────────────────────────────────────────
const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance after edit: ${bal}`);

const selAfter = selectors(css);
const lost = selBefore.filter((s) => !selAfter.includes(s));
if (lost.length) throw new Error(`selectors lost: ${lost.join(" | ")}`);

writeFileSync(FILE, css);
console.log(`\n  ${FILE}: ${before.length} -> ${css.length} bytes`);
console.log(`  rules before ${selBefore.length}, after ${selAfter.length}, none lost`);
console.log(`  added: ${selAfter.filter((s) => !selBefore.includes(s)).length}`);
