// Give the standalone source links an INVISIBLE hit area.
//
// WHY
// ---
// The independent audit found the source links on /audit, /city/:id and
// /invest standing between 13px and 17px tall — under the 24 px WCAG 2.2
// AA floor, and small for a thumb on the one page whose whole purpose is
// to make the sources reachable.
//
// These links are NOT inside running text. The law exempts a link inside a
// sentence (WCAG 2.2 SC 2.5.8's inline exception), but these stand alone:
// "Source 1 ↗" is the closing line of an evidence card, "Source on
// Wikimedia →" is the credit under a photograph, "Source-linked baseline
// ↗" is a provenance row, and the MLIT record is a line of its own. A
// link that stands alone is a control of its own, and the law gives it
// "an invisible hit area, not a taller line".
//
// The fix is exactly that: vertical padding on an inline box. Vertical
// padding on an inline element does not change the line box, so nothing
// moves and no line gets taller — it only grows the area a thumb can
// find. Nothing is painted: no background, no border, no radius.
//
// The room was measured before choosing the padding, so the expanded area
// lands on whitespace rather than on the line above:
//
//   "Source 1 ↗"            70x17   40.0px above, 61.4px below
//   "Source on Wikimedia →"  128x13   9.1px above, 34.6px below
//   "Source-linked baseline" 166x15   3.8px above,  7.5px below
//   "MLIT · demonstration"   304x15  19.4px above, 29.4px below
//
// Each padding below reaches the 24px floor and stays inside the room:
//
//   .evidence-source-link    17 + 8  = 25px   (4px each side, 40 / 61 free)
//   .credit-source-link      13 + 12 = 25px   (6px each side, 9 / 34 free)
//   .ladder-source-link      15 + 10 = 25px   (5px each side, 3.8 / 7.5 free)
//   .city-record-source-link 15 + 10 = 25px   (5px each side, 19 / 29 free)
//
// The ladder row is the tight one: its 5px reaches 1.2px past the value
// printed above it. That value is a measurement, not a control, so there
// is no tap to steal — and the alternative, a taller row, would have cost
// the page its scroll budget.
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

// Idempotency guard: the anchor below SURVIVES the insertion, so without
// this a second run would insert the rules a second time. The second run
// must refuse, not double-apply.
if (css.includes("STANDALONE SOURCE LINKS")) {
  console.error("REFUSE: the standalone-link hit area is already applied.");
  process.exit(1);
}

once(
`/* ─── BENEFITS / WHY ─── */`,
`/* ─── STANDALONE SOURCE LINKS: an invisible hit area, not a taller line ──
   A link that stands on its own — a card's closing "Source 1 ↗", the
   credit under a photograph, a provenance row — is a control of its own,
   not a link inside a sentence. Vertical padding on an inline box grows
   the area a thumb can find WITHOUT moving the line: inline vertical
   padding does not change the line box. Nothing is painted. */
.evidence-source-link { padding-block: 4px; }
.credit-source-link { padding-block: 6px; }
.ladder-source-link { padding-block: 5px; }
.city-record-source-link { padding-block: 5px; }

/* ─── BENEFITS / WHY ─── */`
);

const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — standalone source links given an invisible hit area.");
