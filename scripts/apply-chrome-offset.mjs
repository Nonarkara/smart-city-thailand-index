/**
 * THE CHROME OFFSET
 * ==================
 * The top bar is sticky. Anything that scrolls a target into view —
 * the skip link, an in-page anchor — lands it UNDER the bar, so the
 * first line of the destination is hidden behind the chrome.
 *
 * scroll-padding-top on the scrolling element is the honest fix: it
 * reserves the chrome's height before the target is positioned, so the
 * reader arrives at the content, not at the bar.
 *
 * One asserted, single-occurrence replacement.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");
const before = css;

const NEEDLE = `html { color-scheme: light; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }`;
const REPLACEMENT = `html {
  color-scheme: light;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  /* The top bar is sticky. Reserve its height so a scrolled-to target
     lands BELOW the chrome instead of behind it. */
  scroll-padding-top: 3.5rem;
}`;

const parts = css.split(NEEDLE);
if (parts.length !== 2) {
  throw new Error(`expected exactly 1 match, found ${parts.length - 1}`);
}
css = parts[0] + REPLACEMENT + parts[1];

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);
if (!css.includes("scroll-padding-top: 3.5rem")) throw new Error("replacement lost");

writeFileSync(FILE, css);
console.log(`  ✓ scroll-padding-top added (${before.length} -> ${css.length} bytes)`);
