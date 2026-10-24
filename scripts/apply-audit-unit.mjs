/**
 * THE UNIT ON THE CONFIDENCE FIGURE
 * =================================
 * "49" appeared twice on /audit at display size: a scope KPI and the
 * high-confidence city count. The fix is not to shrink one of them but
 * to say what the second one counts — a number with its unit is not a
 * duplicate of a bare number, and "49 cities" is a better label than
 * "49" beside the word "High confidence".
 *
 * The unit sits at body size beside the display numeral, so the page
 * keeps its three-size rule: display for the numeral, body for the
 * unit, micro for nothing else.
 *
 * Run: node scripts/apply-audit-unit.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const CSS = "src/styles.css";
let css = readFileSync(CSS, "utf8");
const before = css;

const anchor = `.audit-domain-score-val { font: 800 var(--text-display) var(--mono); line-height: 1; }`;
if (!css.includes(anchor)) {
  console.error("FAIL: audit-domain-score-val anchor not found");
  process.exit(1);
}
const parts = css.split(anchor);
if (parts.length !== 2) {
  console.error(`FAIL: audit-domain-score-val appears ${parts.length - 1} times`);
  process.exit(1);
}
css = parts.join(`${anchor}
/* The unit the figure counts. It is what distinguishes this "49" from
 * the "49" in the scope KPI above it. */
.audit-domain-score-unit {
  font: 600 var(--text-body) var(--mono);
  color: var(--3);
  margin-left: .35rem;
  letter-spacing: 0;
}`);

const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`FAIL: brace imbalance ${open}/${close}`);
  process.exit(1);
}
writeFileSync(CSS, css);
console.log(`OK  audit unit applied  (+${css.length - before.length} bytes, braces ${open}/${close})`);
