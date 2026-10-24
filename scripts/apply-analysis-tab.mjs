/**
 * THE ANALYSIS TAB — TYPE LAW + GRID COUNT
 * ========================================
 * Two defects, both on the city dossier's Analysis tab.
 *
 * 1. TYPE. The tab carried THREE display-size text statements of its own
 *    (two section h2s, one h3) plus a text-valued metric tile, on a page
 *    whose one display statement is the city name in the hero. A reader
 *    could not tell which was the statement. The h2/h3 go back to the
 *    canonical body size and the metric tiles follow the site's tile
 *    convention — the same treatment the homepage ribbon already received.
 *
 * 2. GRID COUNT. `.record-grid` used `repeat(auto-fill, minmax(140px, 1fr))`,
 *    which resolved FOUR delivery-step figures into THREE columns and
 *    stranded two empty cells beside the last figure. The columns are now
 *    chosen from the count: four items, two columns or four, never three.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");
const before = css.length;

function sub(from, to, count, label) {
  const found = css.split(from).length - 1;
  if (found !== count) {
    console.error(`ABORT  ${label}: expected ${count}, found ${found}`);
    console.error("---- pattern ----\n" + from);
    process.exit(1);
  }
  css = css.split(from).join(to);
  console.log(`ok     ${label}  (${found})`);
}

/* ── 1. The section headings return to the h2 / h3 law ────────────────── */
sub(
  `  .city-dossier-section > h2,
  .city-analog-section > h2,
  .city-factbook-header h2 {
    max-width: 900px;
    font-size: var(--text-display);
    line-height: .98;
    letter-spacing: -.06em;
  }`,
  `  .city-dossier-section > h2,
  .city-analog-section > h2,
  .city-factbook-header h2 {
    max-width: 900px;
    font-size: var(--text-body);
    line-height: 1.3;
    letter-spacing: -.02em;
  }`,
  1,
  "Analysis section headings return to body size",
);

sub(
  `  .city-analog-headline {
    max-width: 760px;
    font-size: var(--text-display);
    line-height: 1.06;
    letter-spacing: -.055em;
  }`,
  `  .city-analog-headline {
    max-width: 760px;
    font-size: var(--text-body);
    line-height: 1.35;
    letter-spacing: -.02em;
  }`,
  1,
  "the analog headline returns to body size",
);

sub(
  `  .city-analog-metric-value {
    font-size: var(--text-display);
    line-height: 1.15;
    letter-spacing: -.045em;
  }`,
  `  .city-analog-metric-value {
    font-size: var(--text-body);
    line-height: 1.35;
    letter-spacing: -.02em;
  }`,
  1,
  "the metric tiles follow the site's tile convention",
);

/* ── 2. The four delivery-step figures ───────────────────────────────── */
sub(
  `.city-dossier-record-grid {
  margin-top: .85rem;
  background: rgba(255,255,255,.55);
}`,
  `.city-dossier-record-grid {
  margin-top: .85rem;
  background: rgba(255,255,255,.55);
  /* Four figures. The columns are chosen from the count — three columns
     stranded the last figure beside two empty cells. */
  grid-template-columns: repeat(2, minmax(0, 1fr));
}`,
  1,
  "the delivery-step grid takes its columns from the count",
);

const ANCHOR = `/* ─── INFRASTRUCTURE ABSORPTION ────────────────────────────────────────`;
if (css.split(ANCHOR).length - 1 !== 1) {
  console.error("ABORT  anchor not found exactly once");
  process.exit(1);
}
css = css.replace(
  ANCHOR,
  `/* Four delivery-step figures in four columns once there is room for
 * them. Below that they pair. Never three — that strands the last. */
@media (min-width: 1024px) {
  .city-dossier-record-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

${ANCHOR}`,
);

/* The last cell in a row must not draw a right border against the frame. */
sub(
  `.city-dossier-record-grid {
  margin-top: .85rem;
  background: rgba(255,255,255,.55);
  /* Four figures. The columns are chosen from the count — three columns
     stranded the last figure beside two empty cells. */
  grid-template-columns: repeat(2, minmax(0, 1fr));
}`,
  `.city-dossier-record-grid {
  margin-top: .85rem;
  background: rgba(255,255,255,.55);
  /* Four figures. The columns are chosen from the count — three columns
     stranded the last figure beside two empty cells. */
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.city-dossier-record-grid .record-item:nth-child(2n) { border-right: 0; }
@media (min-width: 1024px) {
  .city-dossier-record-grid .record-item:nth-child(2n) { border-right: 1px solid var(--5); }
  .city-dossier-record-grid .record-item:nth-child(4n) { border-right: 0; }
}`,
  1,
  "the record grid's inner rules follow the column count",
);

const REQUIRED = [
  `.city-dossier-record-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }`,
  `.city-analog-metric-value {\n    font-size: var(--text-body);`,
];
for (const sel of REQUIRED) {
  if (!css.includes(sel)) {
    console.error(`ABORT  required rule lost: ${sel}`);
    process.exit(1);
  }
}
writeFileSync(FILE, css);
console.log(`\nstyles.css ${before} -> ${css.length} bytes`);
