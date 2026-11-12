#!/usr/bin/env node
/**
 * apply-contrast-fixes-round2.mjs
 *
 * Fixes the 11 text-contrast failures the corrected instrument found
 * across 22 routes at 390x844.
 *
 * THE INSTRUMENT MATTERED. Three earlier scans of this same site
 * reported failures that were not there, and one real failure it had
 * already found was measured wrong:
 *
 *   - `label.visually-hidden` read 1:1. It is a clipped 1x1 label.
 *   - `button.cta-button` read 1:1 (white on white). The button's own
 *     background is var(--ink); the scan had walked past it.
 *   - `.density-sources` read 4.12:1. Its ancestor carries
 *     `opacity: .55`, which multiplies the TEXT as a group as well as
 *     the ground. The true value is 6.19:1 and it passes.
 *   - Text over a photograph read 1:1. A photo overlay is governed by
 *     the scrim rule (dark gradient >= 78% + text-shadow), not by
 *     colour compositing.
 *
 * The instrument was corrected until it reported 11 failures and no
 * false positives. These are those 11. The earlier class of failures
 * (a hairline or an amber fill carrying type) was already fixed by
 * scripts/apply-contrast-fixes.mjs; this script is a different set.
 *
 * THE FIXES
 *
 *  1. `.needs-ladder-rung-index` (1.43:1, 24 instances) and
 *     `.meth-github-slash` (1.43:1) used `--4` — the hairline token —
 *     as type. The repo's own rule (CLAUDE.md): "--4 #c5d3df (hairline,
 *     never type)". They move to `--3` (#3b5268), the muted tone the
 *     stylesheet already documents at 5.8:1.
 *
 *  2. `.baseline-row-dim.is-missing` (1.53:1) — a dash standing for a
 *     value that was not measured. Same token, same fix. The dash is
 *     meaningful: it says "no value", so it has to be readable, not
 *     merely present.
 *
 *  3. `.bingo-cell-num` (2.75:1 to 4.2:1, 24 instances) — the card
 *     number is painted in the dimension colour, and the board's
 *     waiting state dims the whole card front to `opacity: .68`.
 *     Group opacity multiplies the text, so a colour that passes at
 *     full strength (4.91:1 for the lightest dimension) drops to
 *     2.75:1 while waiting.
 *
 *     The fix is NOT to darken the seven dimension colours: they are
 *     the game's identity, they are already stepped down once for the
 *     white label on the flipped card, and darkening them again would
 *     change what the board looks like and what the back of the card
 *     says. The fix is that the WAITING state should not dim the
 *     number into illegibility. The dim moves off the text and onto
 *     the card's own ground and its label, where it still reads as
 *     "not yet playable" and the number keeps its 4.91:1.
 *
 *  4. `.kb-cat-badge` (4.43:1, 72 instances) — teal on the teal glow
 *     misses 4.5:1 by 0.07. A step darker on the same hue reads
 *     5.72:1 and still reads as the same colour.
 *
 * Every edit goes through brace-matched, asserted replacement with an
 * exact anchor count. The script is idempotent: a second run refuses
 * rather than double-applying.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const CSS = path.join(ROOT, "src/styles.css");

let css = fs.readFileSync(CSS, "utf8");

function once(haystack, needle, replacement, label) {
  const found = haystack.split(needle).length - 1;
  if (found !== 1) {
    throw new Error(
      `${label}: expected exactly 1 anchor, found ${found}. Anchor:\n${needle.slice(0, 160)}`
    );
  }
  console.log(`  ✓ ${label}`);
  return haystack.replace(needle, replacement);
}

// ─── 1. A hairline that had to carry type ───────────────────────────────

css = once(
  css,
  `.needs-ladder-rung-index {
  font: 700 var(--text-micro) var(--mono);
  color: var(--4);
  min-width: 1.1rem;
}`,
  `.needs-ladder-rung-index {
  font: 700 var(--text-micro) var(--mono);
  /* --4 is the hairline token (CLAUDE.md: "hairline, never type"). As
     type it read 1.43:1 on the surface. --3 is the muted tone the
     stylesheet documents at 5.8:1. */
  color: var(--3);
  min-width: 1.1rem;
}`,
  ".needs-ladder-rung-index  var(--4) → var(--3)",
);

css = once(
  css,
  `.meth-github-slash { color: var(--4); }`,
  `/* The separator between two source links. --4 as type read 1.43:1. */
.meth-github-slash { color: var(--3); }`,
  ".meth-github-slash  var(--4) → var(--3)",
);

css = once(
  css,
  `.baseline-row-dim.is-missing { background: transparent; color: var(--4); }`,
  `/* The dash means "not measured". It has to be read, not merely
   present, so it carries --3 rather than the hairline token. */
.baseline-row-dim.is-missing { background: transparent; color: var(--3); }`,
  ".baseline-row-dim.is-missing  var(--4) → var(--3)",
);

// ─── 2. The bingo waiting state ─────────────────────────────────────────

css = once(
  css,
  `.bingo-cell-waiting .bingo-card-front { opacity: .68; }`,
  `/* The waiting state used to dim the whole card front to opacity .68.
   * Group opacity multiplies the TEXT as well as the ground, so the
   * dimension-coloured card number fell from 4.91:1 to 2.75:1 and
   * every one of the 24 cards failed AA. The dim now lives on the
   * card's own ground and its label — never on the number, which is
   * the one thing on the card that has to be read. */
.bingo-cell-waiting .bingo-card-front { background: var(--5); }
.bingo-cell-waiting .bingo-cell-num { opacity: 1; }
.bingo-cell-waiting .bingo-cell-text { opacity: .68; }
.bingo-cell-waiting .bingo-cell-emoji { opacity: .68; }`,
  ".bingo-cell-waiting  dim moved off the card number",
);

// ─── 3. The knowledge badge ─────────────────────────────────────────────

css = once(
  css,
  `.kb-cat-badge {
  font: 600 var(--text-micro) var(--mono); color: var(--teal); background: var(--teal-glow);`,
  `.kb-cat-badge {
  font: 600 var(--text-micro) var(--mono);
  /* Teal on the teal glow read 4.43:1 — 0.07 short of AA across 72
   * instances. A step darker on the same hue reads 5.72:1. */
  color: #005f78; background: var(--teal-glow);`,
  ".kb-cat-badge  teal → darker teal",
);

// ─── WRITE ──────────────────────────────────────────────────────────────

const before = fs.readFileSync(CSS, "utf8");
const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) throw new Error(`styles.css: braces unbalanced (${open} { vs ${close} })`);

fs.writeFileSync(CSS, css);
console.log(`  ${CSS} written (${before.split("\n").length} → ${css.split("\n").length} lines)`);
