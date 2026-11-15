// Give the remaining tap targets their measured floors.
//
// WHY
// ---
// The tap-target gate (scripts/audit/tap-targets.mjs) measures the EFFECTIVE
// hit area of every control on fourteen routes at a 390px touch phone and a
// 1440px desktop. It found six classes of control that fall under the
// owner's law (workspace CLAUDE.md §11.8 item 2, as amended by §11.12):
//
//   ISOLATED_ACTION  -> 44 x 44 on touch, 32 x 32 with a mouse
//   DENSE_GROUP      -> height only: 32px on touch, 24px with a mouse
//   ICON_CONTROL     -> 44 x 44 on touch, 32 x 32 with a mouse
//
// What each of these actually is, measured:
//
//   .meth-github-link      "View repository →"  125 x 17 -> 17
//     The Open-source section's only action. It is the section's primary
//     action, so it is an ISOLATED_ACTION, and it gets the full 44 on touch.
//   .depa-official-source  "Read the certification plan (PDF) ↗"  236 x 29
//     The sole link of the certification block. Same class, same floor.
//   .asean-toolkit-link   "Use FIRST →"  318 x 15
//     Three of these sit side by side in .asean-toolkit-actions — a DENSE
//     GROUP of text controls. The law keeps those as label-plus-padding
//     boxes, so 32px on touch and never below the 24px WCAG 2.2 AA floor.
//     NOT 44: a 44px slab around a one-word label is spatial hallucination.
//     On the phone the row is a column and the links were stretching to the
//     full column width; align-items: flex-start puts the box back around
//     the label it holds.
//   .leaflet-control-zoom a  30 x 30
//     A zoom button is an ICON control and carries the full 44 x 44 on
//     touch. Leaflet's default is 30 x 30 — a thumb cannot find that. The
//     showcase locator had no Leaflet chrome styling at all, so it also
//     gets the same house treatment the rankings map already has: zero
//     radius, hairline border, system-ui.
//
// The hit area is grown, not the painted box: none of these rules adds a
// background, a border or a radius. They are invisible targets.
//
// House style: brace-matched, anchor-count-asserted, idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = join(ROOT, "src", "styles.css");

let css = readFileSync(CSS, "utf8");

function once(anchor, replacement) {
  const n = css.split(anchor).length - 1;
  if (n === 0) {
    console.error(`REFUSE: anchor not found:\n${anchor.slice(0, 240)}`);
    process.exit(1);
  }
  if (n > 1) {
    console.error(`REFUSE: anchor appears ${n} times, expected exactly 1:\n${anchor.slice(0, 240)}`);
    process.exit(1);
  }
  css = css.replace(anchor, replacement);
}

// ── 1. The ASEAN toolkit links: a dense group of text controls ───────────
once(
`.asean-toolkit-link {
  font: 600 var(--text-micro) var(--mono);
  letter-spacing: .06em;
  color: var(--teal);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-transform: uppercase;
}`,
`.asean-toolkit-link {
  font: 600 var(--text-micro) var(--mono);
  letter-spacing: .06em;
  color: var(--teal);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-transform: uppercase;
  /* Three of these sit side by side, so this is a dense group of text
     controls, not an isolated action: label-plus-padding boxes, at least
     32px high on touch and never below the 24px WCAG 2.2 AA floor. */
  display: inline-flex;
  align-items: center;
  min-height: 24px;
}`
);

// The phone column stretched every link to the full column width, so the
// box was the width of the page and the height of one word. The box goes
// back around the label it holds.
once(
`  .asean-toolkit-actions { flex-direction: column; gap: .25rem; }`,
`  .asean-toolkit-actions { flex-direction: column; align-items: flex-start; gap: .25rem; }`
);

// ── 2. The methodology repository link: an isolated primary action ─────────
once(
`.meth-github-link { font: 700 var(--text-body) var(--font); color: var(--teal); text-decoration: none; }`,
`.meth-github-link { font: 700 var(--text-body) var(--font); color: var(--teal); text-decoration: none; display: inline-flex; align-items: center; min-height: 32px; }`
);

// ── 3. The certification-plan link: an isolated primary action ───────────
once(
`.depa-official-source { background: none; color: var(--teal); font: 650 var(--text-body)/1.4 var(--font); text-transform: none; letter-spacing: 0; padding: .3rem 0; text-decoration: underline; text-underline-offset: .2em; max-width: 100%; }`,
`.depa-official-source { background: none; color: var(--teal); font: 650 var(--text-body)/1.4 var(--font); text-transform: none; letter-spacing: 0; padding: .3rem 0; text-decoration: underline; text-underline-offset: .2em; max-width: 100%; min-height: 32px; }`
);

// ── 4. Leaflet's zoom buttons: icon controls, 44 x 44 on touch ───────────
once(
`.ranking-map-leaflet .leaflet-control-zoom a:hover {
  background: var(--ink);
  color: var(--bg, #fff);
}`,
`.ranking-map-leaflet .leaflet-control-zoom a:hover {
  background: var(--ink);
  color: var(--bg, #fff);
}
/* The showcase locator carried no Leaflet chrome styling at all, so its
   zoom control was Leaflet's rounded white box in a different typeface.
   Same house treatment as the rankings map: zero radius, hairline border,
   system-ui. */
.showcase-locator-canvas .leaflet-control {
  border-radius: 0;
  border: 1px solid var(--ink);
  background: var(--surface, #fff);
  color: var(--ink);
  font: 500 var(--text-body) var(--font);
}
.showcase-locator-canvas .leaflet-control-zoom a {
  border-radius: 0;
  background: var(--surface, #fff);
  color: var(--ink);
  border-color: var(--5);
}
.showcase-locator-canvas .leaflet-control-zoom a:hover {
  background: var(--ink);
  color: var(--bg, #fff);
}
/* A zoom button is an ICON control, so it carries the full 44 x 44 on
   touch. Leaflet's default is 30 x 30, which a thumb cannot find. */
.ranking-map-leaflet .leaflet-control-zoom a,
.showcase-locator-canvas .leaflet-control-zoom a {
  width: 32px;
  height: 32px;
  line-height: 30px;
}`
);

// ── 5. The touch floors ──────────────────────────────────────────────────
once(
`@media (pointer: coarse) { .rankings-primary-search .directory-search, .icon-action { min-height: 44px; } .icon-action { width: 44px; height: 44px; } }`,
`@media (pointer: coarse) { .rankings-primary-search .directory-search, .icon-action { min-height: 44px; } .icon-action { width: 44px; height: 44px; } }
/* An isolated primary action takes the full 44px on touch. A dense group
   of text controls keeps 32px — touchability comes from layout and from
   fewer controls, never from padding every box to 44px. */
@media (pointer: coarse) {
  .meth-github-link, .depa-official-source { min-height: 44px; }
  .asean-toolkit-link { min-height: 32px; }
  .ranking-map-leaflet .leaflet-control-zoom a,
  .showcase-locator-canvas .leaflet-control-zoom a { width: 44px; height: 44px; line-height: 42px; }
}`
);

const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — tap-target floors applied to the six measured classes.");
