/**
 * COMPACT THE BASELINE PAGE
 * =========================
 * /baseline was 21.7 phone screens, and it asked a reader to scroll past
 * two kinds of waste:
 *
 *  1. EVERY CITY ROW WAS THREE LINES. The name, then the seven
 *     dimension cells, then the composite score on a line of its own —
 *     118 rows × one wasted line each. The score has the same weight as
 *     the name and belongs on the name's line. The desktop layout
 *     already did this in one line; only the phone stacked it.
 *
 *  2. EVERY FILTER REPEATED ITS SOURCE. Twenty-five indicators, each
 *     carrying the full citation of the survey it came from, all of it
 *     shown before the reader had chosen a threshold. A filter set to
 *     "Any" makes no claim, so it needs no citation. The citation now
 *     appears when a threshold IS chosen, and the full source list stays
 *     at the foot of the page where all fourteen sources are already
 *     listed.
 *
 * Nothing is removed. The provenance moves to the moment it is needed.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");

function once(text, needle, replacement, label) {
  const parts = text.split(needle);
  if (parts.length !== 2) {
    throw new Error(`${label}: expected exactly 1 match, found ${parts.length - 1}`);
  }
  console.log(`  ✓ ${label}`);
  return parts[0] + replacement + parts[1];
}

/* ── 1. The row is two lines, not three. ────────────────────────────── */

css = once(
  css,
  `.baseline-row-link {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: .15rem .6rem;
  align-items: baseline;
  padding: .7rem 0;`,
  `.baseline-row-link {
  display: grid;
  /* The score has the same weight as the name, so it stands beside it.
     One line instead of two: 118 rows, one line each, saved. */
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  gap: .15rem .6rem;
  align-items: baseline;
  padding: .7rem 0;`,
  "baseline row: the score gets its own track beside the name"
);

css = once(
  css,
  `.baseline-row-rank {
  grid-row: 1 / span 2;`,
  `.baseline-row-rank {
  grid-row: 1;`,
  "baseline row: the rank no longer spans two rows"
);

css = once(
  css,
  `.baseline-row-city {
  font: 700 var(--text-body)/1.3 var(--font);
  display: flex;
  flex-direction: column;
}`,
  `.baseline-row-city {
  grid-column: 2;
  grid-row: 1;
  font: 700 var(--text-body)/1.3 var(--font);
  display: flex;
  flex-direction: column;
  min-width: 0;
}`,
  "baseline row: the city name takes the second track, first row"
);

css = once(
  css,
  `.baseline-row-dims {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-top: .3rem;
}`,
  `.baseline-row-dims {
  grid-column: 2 / -1;
  grid-row: 2;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-top: .3rem;
}`,
  "baseline row: the dimension strip spans the full width under the name"
);

css = once(
  css,
  `.baseline-row-score {
  grid-column: 2;
  justify-self: end;
  font: 700 var(--text-body) var(--mono);
  color: var(--ink);
  display: flex;
  align-items: baseline;
  gap: .35rem;
  margin-top: .2rem;
}`,
  `.baseline-row-score {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  font: 700 var(--text-body) var(--mono);
  color: var(--ink);
  display: flex;
  align-items: baseline;
  gap: .35rem;
  margin-top: 0;
}`,
  "baseline row: the score stands on the name's line"
);

/* The desktop layout puts the strip in its own track; it must stay on the
   same row as the name now that the base layout puts the score beside it. */
css = once(
  css,
  `  .baseline-row-dims { grid-column: 3; margin-top: 0; }`,
  `  .baseline-row-dims { grid-column: 3; grid-row: 1; margin-top: 0; }`,
  "baseline row: the strip stays on one row from 720px up"
);

/* ── 2. A filter states its source when it states a threshold. ─────── */

css = once(
  css,
  `.baseline-facet { display: flex; flex-direction: column; gap: .3rem; }`,
  `/* The label and the control share a line: the reader is choosing a
   threshold, not reading an essay. The source, when there is one to
   give, runs underneath across the full width. */
.baseline-facet {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: .3rem .75rem;
}`,
  "baseline filter: the label and the select share a line"
);

css = once(
  css,
  `.baseline-facet-select {
  min-height: 44px;
  padding: .45rem .5rem;
  font: 400 var(--text-body) var(--font);
  color: var(--ink);
  background: var(--bg);
  border: 1px solid var(--4);
  border-radius: 0;
  width: 100%;
}`,
  `.baseline-facet-select {
  min-height: 44px;
  padding: .45rem .5rem;
  font: 400 var(--text-body) var(--font);
  color: var(--ink);
  background: var(--bg);
  border: 1px solid var(--4);
  border-radius: 0;
  width: auto;
  min-width: 7.25rem;
  max-width: 100%;
}`,
  "baseline filter: the select is sized to its content, not the column"
);

css = once(
  css,
  `.baseline-facet-source {
  font: 400 var(--text-micro)/1.5 var(--font);
  color: var(--3);
}`,
  `.baseline-facet-source {
  grid-column: 1 / -1;
  font: 400 var(--text-micro)/1.5 var(--font);
  color: var(--3);
}
.baseline-facet-note {
  margin: 0;
  font: 400 var(--text-micro)/1.5 var(--font);
  color: var(--3);
}`,
  "baseline filter: the source spans the row, and the note has a place"
);

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);

writeFileSync(FILE, css);
console.log(`  ${FILE} written`);
