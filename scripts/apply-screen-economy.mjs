// Reclaim the screen: five measured fixes for the owner's scroll economy.
//
// WHY
// ---
// The owner's law (workspace CLAUDE.md §11.12): "no boxes bigger than their
// words", "no scroll without earned content", and the standing order — "the
// real estate economy for the screen is very important… scrolling is always
// bad for the users unless you have something really important for them to
// see down".
//
// Measured on the rendered pages at 390x844 (19 November 2026), the dead
// space and the padded boxes were:
//
//   1. /partners — the country card's three facts were a BOXED THREE-ROW
//      TABLE on a phone: 155px of bordered table for "$2.4B / 5 / a list of
//      focus areas". A media query stacked the 3-across desktop row into one
//      column, so each card carried 155px of air where a metadata run is
//      enough. 9 cards = ~1,400px of nothing on the page's largest section.
//      Fix: on a phone the facts become one inline run — "INVESTMENT $2.4B
//      (ASEAN) · CITIES 5 · FOCUS …" — ruled top and bottom, no box.
//
//   2. The partner card itself wore .75rem of padding around a 1rem card and
//      a lesson box that padded its own words. Tightened to the label plus
//      half a line.
//
//   3. /baseline — each filter row put its unit ("%") at the far right of the
//      label cell, so the unit floated alone between the label and the
//      control. It belongs next to the word it qualifies.
//
//   4. The site-wide news band (every non-dashboard route) stacked date,
//      title and source into three padded boxes in a bordered grid. The home
//      page's own reading strip had already been converted to ruled rows
//      ("12 cards cost 2643px on a phone"); the band still had the old shape.
//      Fix: the title leads, the date and source share one metadata line.
//
//   5. The baseline register's progressive-disclosure footer — the same
//      stated, counted pattern the rankings directory already uses.
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

// ── 1. The partner card: the facts become a metadata run on a phone ────────
once(
`@media (max-width: 768px) {
  .partner-visual-grid { grid-template-columns: 1fr; }
  .partner-visual-facts { grid-template-columns: 1fr; }
  .partner-visual-fact { border-right: 0; border-bottom: 1px solid var(--5); }
  .partner-visual-fact:last-child { border-bottom: 0; }
}`,
`@media (max-width: 768px) {
  .partner-visual-grid { grid-template-columns: 1fr; }
  /* The desktop row of three facts is a row. On a phone the old rule turned
     it into a three-row bordered table — 155px of box for one value and one
     label — and nine cards carried 1,400px of it. The facts are shared
     metadata: one run, ruled above and below, no box. */
  .partner-visual-facts {
    display: flex;
    flex-wrap: wrap;
    gap: .1rem .75rem;
    border: 0;
    border-top: 1px solid var(--5);
    border-bottom: 1px solid var(--5);
    padding: .35rem 0;
    margin-bottom: .5rem;
  }
  .partner-visual-fact {
    display: inline-flex;
    align-items: baseline;
    gap: .3rem;
    min-width: 0;
    padding: 0;
    border-right: 0;
    text-align: left;
  }
  .partner-visual-fact-label { order: -1; }
}`
);

// ── 2. The partner card wears less around its words ───────────────────────
once(
`.partner-visual-card {
  position: relative;
  padding: 1rem;`,
`.partner-visual-card {
  position: relative;
  padding: .75rem;`
);

once(
`.partner-visual-lesson {
  margin: .5rem 0 0;
  padding: .5rem .6rem;`,
`.partner-visual-lesson {
  margin: .4rem 0 0;
  padding: .4rem .5rem;`
);

// ── 3. The filter unit belongs with the word it qualifies ─────────────────
once(
`.baseline-facet-label {
  font: 600 var(--text-body)/1.3 var(--font);
  display: flex;
  justify-content: space-between;
  gap: .5rem;
  align-items: baseline;
}`,
`.baseline-facet-label {
  font: 600 var(--text-body)/1.3 var(--font);
  display: flex;
  /* The unit ("%") is part of the indicator's name, not a floating mark at
     the far edge of the cell. */
  justify-content: flex-start;
  gap: .3rem;
  align-items: baseline;
}`
);

// ── 4. The site-wide news band: ruled rows, not padded boxes ──────────────
once(
`.news-item { display: flex; flex-direction: column; gap: .1rem; padding: .45rem .6rem; border-right: 1px solid var(--5); border-bottom: 1px solid var(--5); border-left: 0; transition: color .15s var(--ease), background-color .15s var(--ease), border-color .15s var(--ease), opacity .15s var(--ease), transform .15s var(--ease), box-shadow .15s var(--ease), filter .15s var(--ease), fill .15s var(--ease), stroke .15s var(--ease); }
.news-item:first-child { border-right: 1px solid var(--5); padding-right: 1rem; }
.news-item:not(:first-child) { padding-left: .6rem; }`,
`/* The band had the old shape the home page's reading strip already left
   behind: date, title and source stacked in a padded box inside a bordered
   grid. Ruled rows instead — the title leads, and the date and the source
   share one metadata line under it. */
.news-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: .75rem;
  row-gap: 2px;
  padding: .5rem 0;
  border: 0;
  border-bottom: 1px solid var(--5);
  transition: color .15s var(--ease), background-color .15s var(--ease), border-color .15s var(--ease), opacity .15s var(--ease), transform .15s var(--ease), box-shadow .15s var(--ease), filter .15s var(--ease), fill .15s var(--ease), stroke .15s var(--ease);
}
.news-item .news-title { grid-column: 1 / -1; order: -1; }
.news-item .news-date { align-self: end; }
.news-item .news-source { align-self: end; justify-self: end; }`
);

// ── 5. The baseline register's disclosure footer ───────────────────────────
once(
`.baseline-table.is-unmeasured { border-top-color: var(--4); }`,
`.baseline-table.is-unmeasured { border-top-color: var(--4); }
/* The register leads with its top 25 and states the rest behind one counted
   action. The count comes before the action, so the reader knows the list is
   capped and how much is behind it — the pattern the rankings directory
   already uses, on the same page family. */
.baseline-list-more {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .75rem 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--5);
}
.baseline-list-more-count {
  font: 500 var(--text-micro) var(--mono);
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--3);
}
.baseline-list-more-btn {
  min-height: 44px; /* §11.8 tap target */
  cursor: pointer;
}`
);

const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — the screen-economy batch applied: partner metadata run, tighter cards, the unit with its label, and the news band as ruled rows.");
