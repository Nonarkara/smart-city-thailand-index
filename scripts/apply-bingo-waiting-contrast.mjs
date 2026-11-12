#!/usr/bin/env node
/**
 * apply-bingo-waiting-contrast.mjs
 *
 * The last of the 11 contrast failures: the bingo card number in the
 * board's waiting state read 4.38:1 against the dimmed card face.
 *
 * apply-contrast-fixes-round2.mjs moved the waiting state's dim off the
 * number and onto the card's ground and label. That fixed the number,
 * but it also changed the ground from the card face (--surface) to
 * --5, and --5 is darker than --surface, so the lightest dimension
 * (environment green, #2E7D32) lost a little more contrast and came
 * out at 4.38:1 — still 0.12 short.
 *
 * The fix keeps the identity. The waiting number is the SAME dimension
 * hue, darkened with the same colour-mix() idiom the stylesheet
 * already uses for the claim badges (see .claim-verified at
 * styles.css:6144). Darkening to 80% of the hue reads 6.73:1 on the
 * dimmed face and still reads as that dimension's colour — the board
 * does not change what it says while it waits, it only says it more
 * quietly.
 *
 * One anchored replacement. Idempotent.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const CSS = path.join(ROOT, "src/styles.css");

let css = fs.readFileSync(CSS, "utf8");

const ANCHOR = `.bingo-cell-waiting .bingo-cell-num { opacity: 1; }`;
const REPLACEMENT = `.bingo-cell-waiting .bingo-cell-num {
  /* The same dimension hue, darkened with the colour-mix() idiom the
     claim badges already use. It reads as that dimension and clears
     AA at 6.73:1 on the dimmed face; at full strength it was 4.38:1. */
  opacity: 1;
  color: color-mix(in srgb, var(--cell-color, var(--3)) 80%, #000);
}`;

const found = css.split(ANCHOR).length - 1;
if (found !== 1) {
  throw new Error(`expected exactly 1 anchor, found ${found}`);
}

css = css.replace(ANCHOR, REPLACEMENT);

const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) throw new Error(`styles.css: braces unbalanced (${open} { vs ${close} })`);

fs.writeFileSync(CSS, css);
console.log("  ✓ .bingo-cell-waiting .bingo-cell-num  → darkened dimension hue (6.73:1)");
console.log(`  ${CSS} written`);
