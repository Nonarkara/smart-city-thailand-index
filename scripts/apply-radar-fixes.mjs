/**
 * THE RADAR + GRID + FONT FIXES
 * =============================
 * Four corrections, each measured before it was written.
 *
 * 1. THE COMPARE RADAR'S LABELS.
 *    Measured in the browser: "Hospitality" started 27px LEFT of the
 *    SVG's own box (clipped), and "Environment" overlapped "Wellbeing"
 *    by 15px. Two text nodes occupying the same space.
 *    The cause was a 160-unit box holding labels up to 76 units wide,
 *    centred on their anchor points. The fix gives the box the room the
 *    labels need (260 x 130) and anchors each label AWAY from the
 *    centre, so the two labels that share a baseline grow in opposite
 *    directions and can never meet.
 *
 * 2. THE COMPARE GRID.
 *    An inline `gridTemplateColumns` on .compare-grid overrode the
 *    stylesheet's phone layout (`grid-auto-columns: 86vw`), squeezing
 *    each card to 240px and leaving the radar no room at all. The
 *    count moves into a custom property; the LAYOUT lives in the
 *    stylesheet, where the law says it belongs.
 *
 * 3. MONO + THAI.
 *    --mono had no Thai face. Thai text set in mono fell through to
 *    whatever the platform maps `monospace` to for Thai — a different,
 *    unpredictable face on every operating system. IBM Plex Sans Thai
 *    is already loaded and is non-looped, so it goes in the stack.
 *
 * 4. THE FAUX BOLD.
 *    IBM Plex Mono was loaded at 400/500/600. 278 rules ask for weight
 *    700, so every eyebrow, label and numeral on the site was
 *    SYNTHETICALLY bolded by the browser. Load the real 700.
 */
import { readFileSync, writeFileSync } from "node:fs";

/** One asserted, single-occurrence replacement. */
function once(text, needle, replacement, label) {
  const parts = text.split(needle);
  if (parts.length !== 2) {
    throw new Error(`${label}: expected exactly 1 match, found ${parts.length - 1}`);
  }
  console.log(`  ✓ ${label}`);
  return parts[0] + replacement + parts[1];
}

// ── 1 + 2 + 3: the stylesheet ─────────────────────────────────────────
const CSS = "src/styles.css";
let css = readFileSync(CSS, "utf8");
const cssBefore = css;

css = once(
  css,
  `  --mono: "IBM Plex Mono", "SF Mono", ui-monospace, "Roboto Mono", monospace;`,
  `  /* Thai first falls to Plex Sans Thai — already loaded, non-looped —
     instead of whatever the platform maps \`monospace\` to for Thai. */
  --mono: "IBM Plex Mono", "SF Mono", ui-monospace, "Roboto Mono", "IBM Plex Sans Thai", "Noto Sans Thai", monospace;`,
  "--mono carries a Thai face"
);

css = once(
  css,
  `@media (min-width: 960px) {
  .compare-grid {
    grid-auto-flow: initial;
    grid-auto-columns: initial;
    overflow-x: visible;
    margin: 0;
    padding-left: 0;
    padding-right: 0;
    gap: 1rem;
  }`,
  `@media (min-width: 960px) {
  .compare-grid {
    grid-auto-flow: initial;
    grid-auto-columns: initial;
    /* The city count is DATA, not layout: it arrives as a custom
       property. The column rule lives here. */
    grid-template-columns: repeat(var(--compare-cols, 3), minmax(0, 1fr));
    overflow-x: visible;
    margin: 0;
    padding-left: 0;
    padding-right: 0;
    gap: 1rem;
  }`,
  "compare grid: column count comes from the stylesheet"
);

css = once(
  css,
  `.lens-radar { animation: radar-in 300ms cubic-bezier(0.34, 1.2, 0.64, 1); }`,
  `.lens-radar { animation: radar-in 300ms cubic-bezier(0.34, 1.2, 0.64, 1); }
/* The compare radar is a wider box with its own centre, so it gets its
   own origin. Same motion, same timing, no shared origin to misplace. */
@keyframes compare-radar-in {
  from { opacity: 0; transform: scale(0.82); transform-origin: 134px 68px; }
  to   { opacity: 1; transform: scale(1);    transform-origin: 134px 68px; }
}
.compare-radar { animation: compare-radar-in 300ms cubic-bezier(0.34, 1.2, 0.64, 1); }`,
  "compare radar: its own animation origin"
);

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance in CSS: ${bal}`);
writeFileSync(CSS, css);
console.log(`  ${CSS}: ${cssBefore.length} -> ${css.length} bytes`);

// ── 4: the real bold ─────────────────────────────────────────────────
const HTML = "index.html";
let html = readFileSync(HTML, "utf8");
const htmlBefore = html;
html = once(
  html,
  `IBM+Plex+Mono:wght@400;500;600`,
  `IBM+Plex+Mono:wght@400;500;600;700`,
  "IBM Plex Mono loads the real 700"
);
writeFileSync(HTML, html);
console.log(`  ${HTML}: ${htmlBefore.length} -> ${html.length} bytes`);
