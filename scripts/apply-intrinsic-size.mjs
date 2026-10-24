/**
 * THE OFF-SCREEN PLACEHOLDER WAS A LAYOUT SHIFT
 * ============================================
 * `.news-section` and `.site-footer` carry
 * `content-visibility: auto; contain-intrinsic-size: 0 300px;` so the
 * browser can skip rendering them until they approach the viewport.
 *
 * The placeholder was a fixed guess. Measured on the homepage: the page
 * was 12,046px tall while the section was skipped and 14,347px once it
 * rendered — a 2,301px shift the moment the reader scrolled to it, and
 * the section's real height is 2,658px, so the guess was wrong by 88%.
 *
 * `contain-intrinsic-size: auto <fallback>` tells the browser to REMEMBER
 * the last rendered size and use it as the placeholder from then on, with
 * the fallback only for the first visit. The shift disappears on every
 * subsequent view, and the fallback stays for the first one.
 *
 * Run: node scripts/apply-intrinsic-size.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const CSS = "src/styles.css";
let css = readFileSync(CSS, "utf8");
const before = css;

const changes = [
  [
    `.site-footer { content-visibility: auto; contain-intrinsic-size: 0 400px; }`,
    `/* "auto" makes the browser remember the last rendered size and use it
 * as the placeholder, so the section does not shift the page under the
 * reader on the way down. The number after it is the first-visit
 * fallback. */
.site-footer { content-visibility: auto; contain-intrinsic-size: auto 400px; }`,
  ],
  [
    `.news-section { content-visibility: auto; contain-intrinsic-size: 0 300px; }`,
    `.news-section { content-visibility: auto; contain-intrinsic-size: auto 300px; }`,
  ],
];

for (const [from, to] of changes) {
  if (css.includes(to)) {
    console.log(`    already applied: ${from.slice(0, 44)}`);
    continue;
  }
  const count = css.split(from).length - 1;
  if (count !== 1) {
    console.error(`FAIL: expected 1 occurrence of "${from.slice(0, 50)}", found ${count}`);
    process.exit(1);
  }
  css = css.split(from).join(to);
  console.log(`    applied: ${from.slice(0, 44)}`);
}

for (const needle of ["contain-intrinsic-size: auto 400px;", "contain-intrinsic-size: auto 300px;"]) {
  if (!css.includes(needle)) {
    console.error(`FAIL: assertion — missing "${needle}"`);
    process.exit(1);
  }
}
const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`FAIL: brace imbalance ${open}/${close}`);
  process.exit(1);
}
writeFileSync(CSS, css);
console.log(`OK  intrinsic size fixed  (+${css.length - before.length} bytes, braces ${open}/${close})`);
