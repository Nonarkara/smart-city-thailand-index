/**
 * ONE VIEW OF EIGHT CITIES, NOT TWO
 * ================================
 * The city lens carried the same eight cities twice: a six-column
 * comparison table (985px on a phone) and eight expandable city cards
 * (1,135px). On a desktop both fit and the table earns its keep as the
 * at-a-glance comparison. On a 390px phone the table is a horizontally
 * scrolling six-column grid of eight rows, and the cards below it already
 * hold every city with more per city — so the phone was paying 985px for a
 * second copy of the same list.
 *
 * The table is therefore hidden below 720px, and the one field the cards did
 * not carry — the province — moves onto the card itself, shown only when the
 * city's name does not already identify it (getDistinctProvinceName). The
 * table's other fields, the best vehicle and the key risk, were already in
 * the card body.
 *
 * Nothing is deleted. The table is still in the document for the desktop and
 * for the screen reader; it is simply not rendered where it duplicates.
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

const TITLE_BLOCK = `/* The card's title cell: the place, and — only when the place's name
   does not already identify it — the province it sits in. */
.city-lens-card-title {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.city-lens-card-prov {
  font: 500 var(--text-micro) var(--mono);
  color: var(--3);
  letter-spacing: 0;
}

`;

const TITLE_ANCHOR = `.city-lens-card h4 {`;
if (!css.includes(".city-lens-card-title {")) {
  css = once(css, TITLE_ANCHOR, TITLE_BLOCK + TITLE_ANCHOR, "city-lens card title cell");
} else {
  console.log("  · city-lens card title cell already present");
}

/* The table and the cards are two answers to one question. Below 720px the
   cards are the answer: they hold every city, they read on a phone, and the
   table beside them is a horizontally scrolling duplicate. */
const PHONE_RULE = `/* ─── THE CITY LENS: ONE VIEW OF EIGHT CITIES, NOT TWO ───────────────
   The comparison table and the city cards below it are the same eight
   cities. On a phone the table is a six-column grid that has to be scrolled
   sideways, beside a list that already holds every city — so below 720px the
   table is not rendered and the province rides on the card instead. */
@media screen and (max-width: 719px) {
  .city-lens-table-wrap { display: none; }
  .city-lens-cards-h { margin-top: 1rem; }
}

`;

const PHONE_ANCHOR = `.city-lens-cards-h {`;
if (!css.includes("ONE VIEW OF EIGHT CITIES, NOT TWO")) {
  css = once(css, PHONE_ANCHOR, PHONE_RULE + PHONE_ANCHOR, "city-lens phone rule");
} else {
  console.log("  · city-lens phone rule already present");
}

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);

writeFileSync(FILE, css);
console.log(`  ${FILE} written`);
