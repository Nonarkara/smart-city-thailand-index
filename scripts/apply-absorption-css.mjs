/**
 * THE ABSORPTION READOUT
 * ======================
 * A data block, not a hero: three rows of figures, the electricity
 * restatement, and the honest limit of what the numbers establish.
 *
 * The type law applies — body 14px and micro 11px only. This block has no
 * display statement: the dossier's one is the city name in the hero, and
 * the composite numeral belongs to the score card beside it.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");
const before = css.length;

function sub(from, to, count, label) {
  const found = css.split(from).length - 1;
  if (found !== count) {
    console.error(`ABORT  ${label}: expected ${count}, found ${found}`);
    process.exit(1);
  }
  css = css.split(from).join(to);
  console.log(`ok     ${label}  (${found})`);
}

const ANCHOR = `.city-research-appendix { margin-top: .5rem; font-size: var(--text-body); }`;

if (css.split(ANCHOR).length - 1 !== 1) {
  console.error("ABORT  anchor not found exactly once");
  process.exit(1);
}

const RULES = `/* ─── INFRASTRUCTURE ABSORPTION ────────────────────────────────────────
 * Three rows of figures and the limit of what they establish. The number
 * that carries the argument is the electricity restatement: the same grid,
 * a crowd the register never counted. */
.city-absorption-grid { display: grid; gap: 0; margin: 0 0 1rem; border-top: 1px solid var(--5); }
.city-absorption-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .1rem .75rem; padding: .6rem 0; border-bottom: 1px solid var(--5); }
.city-absorption-label { font: 700 var(--text-body) var(--font); color: var(--ink); }
.city-absorption-value { margin: 0; font: 700 var(--text-body) var(--mono); color: var(--ink); text-align: end; }
.city-absorption-note { grid-column: 1 / -1; font: var(--text-micro)/1.5 var(--font); color: var(--3); margin: .15rem 0 0; max-width: 62ch; }
.city-absorption-adjust { font: 600 var(--text-body)/1.6 var(--font); color: var(--ink); border-left: 2px solid var(--teal); padding-left: .75rem; margin: 0 0 .75rem; }
.city-absorption-caveat { font: var(--text-body)/1.6 var(--font); color: var(--3); max-width: 68ch; margin: 0 0 .5rem; }
.city-absorption-source { font: var(--text-micro)/1.5 var(--mono); color: var(--3); margin: 0; }
@media (min-width: 720px) {
  .city-absorption-row { grid-template-columns: minmax(0, 22rem) auto; }
}

`;

css = css.replace(ANCHOR, RULES + ANCHOR);

const REQUIRED = [
  `.city-absorption-grid`,
  `.city-absorption-value`,
  `.city-absorption-adjust`,
  `.city-absorption-caveat`,
  `.city-absorption-source`,
];
for (const sel of REQUIRED) {
  if (!css.includes(sel)) {
    console.error(`ABORT  required rule lost: ${sel}`);
    process.exit(1);
  }
}
writeFileSync(FILE, css);
console.log(`\nstyles.css ${before} -> ${css.length} bytes`);
