// Fix the six defects the independent audit found in the screen-economy batch.
//
// The audit (19 November 2026, an independent verifier that did not write the
// batch) measured the shipped surfaces and returned FAIL on three of them.
// These are its fixes, each with the measurement that produced it.
//
// F1  /baseline, expanded state: two stacked disclosure bars, the first still
//     offering "Show all 118" with all 118 rows already showing. A button
//     that did nothing, and a count line that said nothing. FIXED IN
//     BaselinePage.tsx — one bar, one button, two states.
// F2  /baseline facets: the unit ("%") was moved next to the label with
//     justify-content: flex-start, but the label is a FLEX container, so the
//     text is an anonymous flex item whose box ends where line 1 ends. On a
//     wrapping label the unit still pinned to the far edge of the cell —
//     measured 15–174px of void from the last word, on 9 of 20 facets at 390
//     and 11 of 20 at 1440. The label must not be a flex container: the unit
//     has to FLOW with the words so it lands after the last one, on whichever
//     line that word ends.
// F3  / : the category chip moved into the metadata line, and that line is a
//     nowrap flex row. The chip took 61–116px of a 350px row and the ISO
//     date broke mid-token — "2026-03-" / "02" — on 2 of 12 cards at 390 and
//     5 of 12 at 320. A date is a value; a broken date is a misread value.
//     The row wraps instead, and the date never breaks.
// F4  The site-wide news band: the metadata row was a 1fr/auto grid with the
//     source pinned to the right edge, leaving 123–220px of void at 390 and
//     328–335px at 1440 between the date and the source. Two pieces of
//     metadata belong together, not at opposite ends of the row.
// F5  /partners: the ninth card has no source URL, so its source name was
//     rendered as a link-looking span at opacity 0.4 — measured 1.9:1 against
//     the surface, far below WCAG AA, and it invited a tap it cannot answer.
//     It is now plain text in the body colour (8.1:1) that reads as what it
//     is: a recorded source with nothing to link to.
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

// ── F2. The unit flows with the words it qualifies ────────────────────────
once(
`.baseline-facet-label {
  font: 600 var(--text-body)/1.3 var(--font);
  display: flex;
  /* The unit ("%") is part of the indicator's name, not a floating mark at
     the far edge of the cell. */
  justify-content: flex-start;
  gap: .3rem;
  align-items: baseline;
}
.baseline-facet-unit {
  font: 400 var(--text-micro) var(--mono);
  color: var(--3);
}`,
`.baseline-facet-label {
  font: 600 var(--text-body)/1.3 var(--font);
  /* Not a flex container: as one, the text is an anonymous flex item whose
     box ends where the first line ends, so a wrapping label left the unit
     pinned to the cell's far edge — 174px of void from the last word. As a
     block, the unit flows with the words and lands after the last one. */
  display: block;
}
.baseline-facet-unit {
  font: 400 var(--text-micro) var(--mono);
  color: var(--3);
  margin-left: .25rem;
}`
);

// ── F3. The date is a value and does not break ────────────────────────────
once(
`.news-card-meta { margin-top: 0; padding-top: 0; border-top: 0; justify-content: flex-start; gap: 12px; }`,
`.news-card-meta { margin-top: 0; padding-top: 0; border-top: 0; justify-content: flex-start; gap: 12px; flex-wrap: wrap; }
.news-card-date { white-space: nowrap; flex: none; }`
);

// ── F4. The metadata row keeps its two pieces together ────────────────────
once(
`.news-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;`,
`.news-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);`
);

once(
`.news-item .news-date { align-self: end; }
.news-item .news-source { align-self: end; justify-self: end; }`,
`.news-item .news-date { align-self: end; }
.news-item .news-source { align-self: end; justify-self: start; }`
);

// ── F5. A source with nothing to link to is plain text ────────────────────
once(
`.partner-visual-link:hover {
  text-decoration: underline;
}`,
`.partner-visual-link:hover {
  text-decoration: underline;
}
/* One partner record has no source URL. Its source name used to be a
   link-looking span at opacity 0.4 — 1.9:1 on the card surface, far under
   WCAG AA, and it invited a tap it could not answer. It is now plain text
   in the body colour: a recorded source with nothing behind it. */
.partner-visual-source-note {
  font: 600 var(--text-micro) var(--mono);
  color: var(--3);
}`
);

const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — the six audit findings fixed: the dead bar (in the page), the flowing unit, the unbroken date, the adjacent metadata, and the stand-in source.");
