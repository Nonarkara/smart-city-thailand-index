#!/usr/bin/env node
/**
 * apply-emoji-fixes-round2.mjs
 *
 * The first pass replaced the emoji in the mobile dimension controls and
 * the /why benefit blocks, then removed DIM_EMOJIS. The type-check
 * caught two more uses the scan had missed, both in the desktop bingo
 * sidebar:
 *
 *   - .bingo-last-emoji  — the current-call panel draws the dimension
 *     glyph above the words "Current Call: Smart Environment".
 *   - .bingo-dim-emoji   — each desktop dimension button draws the
 *     glyph BESIDE the words "Smart Environment". A mark that repeats
 *     the label next to it is decoration; the mark belongs where the
 *     label is absent.
 *
 * So the desktop sidebar follows the same rule as the mobile strip:
 * the real commissioned mark identifies the dimension where nothing
 * else does, and where the words already say it, the glyph goes.
 *
 * Idempotent.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const BINGO = path.join(ROOT, "src/ScitiBingoPage.tsx");
const CSS = path.join(ROOT, "src/styles.css");

let bingo = fs.readFileSync(BINGO, "utf8");
let css = fs.readFileSync(CSS, "utf8");

function once(haystack, needle, replacement, label) {
  const found = haystack.split(needle).length - 1;
  if (found !== 1) {
    throw new Error(
      `${label}: expected exactly 1 anchor, found ${found}. Anchor:\n${needle.slice(0, 180)}`
    );
  }
  console.log(`  ✓ ${label}`);
  return haystack.replace(needle, replacement);
}

// The current-call panel names the dimension in words two lines below.
// The mark identifies it; the glyph was decoration.
bingo = once(
  bingo,
  `              <span className="bingo-last-emoji">{DIM_EMOJIS[targetDim]}</span>`,
  `              <img src={DIM_LOGOS[targetDim]} alt="" className="bingo-last-mark" loading="lazy"/>`,
  "bingo last called  emoji → real mark",
);

// Each desktop button already reads "Smart Environment" in words. The
// glyph beside it repeated that label in a weaker form.
bingo = once(
  bingo,
  `                <span className="bingo-dim-emoji">{DIM_EMOJIS[dim]}</span>\n`,
  ``,
  "bingo desktop dim button  redundant glyph removed",
);

css = once(
  css,
  `.bingo-dim-strip-mark {`,
  `/* The current-call panel's mark — the real commissioned one. */
.bingo-last-mark {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}
.bingo-dim-strip-mark {`,
  "css  bingo last called mark",
);

const beforeB = fs.readFileSync(BINGO, "utf8");
const beforeC = fs.readFileSync(CSS, "utf8");

for (const [src, label] of [[bingo, "ScitiBingoPage.tsx"], [css, "styles.css"]]) {
  const open = (src.match(/\{/g) || []).length;
  const close = (src.match(/\}/g) || []).length;
  if (open !== close) throw new Error(`${label}: braces unbalanced (${open} { vs ${close} })`);
}

fs.writeFileSync(BINGO, bingo);
fs.writeFileSync(CSS, css);

console.log(`  ScitiBingoPage.tsx  ${beforeB.split("\n").length} → ${bingo.split("\n").length} lines`);
console.log(`  styles.css           ${beforeC.split("\n").length} → ${css.split("\n").length} lines`);
