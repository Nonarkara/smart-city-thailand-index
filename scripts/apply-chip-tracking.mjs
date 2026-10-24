/**
 * THE BAHT SIGN IS NOT A LATIN CHARACTER
 * =====================================
 * The chip on the investability panel reads "Land: ฿50,000/m²" and is
 * set in tracked mono. The baht sign (U+0E3F) is inside the Thai
 * Unicode block, and tracking pulls it off the digits it belongs to —
 * the same defect the Thai-locale override exists to prevent, arriving
 * on the English page through a currency symbol.
 *
 * The chip is a data chip carrying a figure and its unit. Mono numerals
 * do not need their counters opened; the tracked tactical look belongs
 * to the uppercase labels, and this is not one of them.
 *
 * Run: node scripts/apply-chip-tracking.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const CSS = "src/styles.css";
let css = readFileSync(CSS, "utf8");
const before = css;

const anchor = `.dev-score-delta {
  display: inline-block;
  margin-top: .4rem;
  padding: .18rem .5rem;
  font: 600 var(--text-micro) var(--mono);
  letter-spacing: .06em;
  border-radius: 0;
  border: 1px solid var(--5);
}`;
if (!css.includes(anchor)) {
  console.error("FAIL: dev-score-delta anchor not found");
  process.exit(1);
}
const parts = css.split(anchor);
if (parts.length !== 2) {
  console.error(`FAIL: dev-score-delta appears ${parts.length - 1} times`);
  process.exit(1);
}
css = parts.join(`/* No tracking. The chip carries a figure and the baht sign
 * (U+0E3F), which is a Thai-block character; tracking pulls it away
 * from the digits. Mono numerals do not need their counters opened. */
.dev-score-delta {
  display: inline-block;
  margin-top: .4rem;
  padding: .18rem .5rem;
  font: 600 var(--text-micro) var(--mono);
  letter-spacing: normal;
  border-radius: 0;
  border: 1px solid var(--5);
}`);

const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`FAIL: brace imbalance ${open}/${close}`);
  process.exit(1);
}
writeFileSync(CSS, css);
console.log(`OK  chip tracking removed  (+${css.length - before.length} bytes, braces ${open}/${close})`);
