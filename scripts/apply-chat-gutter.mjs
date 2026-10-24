/**
 * THE CHAT BUTTON GETS A GUTTER, OR IT GETS THE NAVIGATION
 * ========================================================
 * A fixed bottom-right button is only acceptable when the content column
 * leaves it a lane to sit in. Measured on this site:
 *
 *   width   text right edge   button left   gap
 *    390         370              326       -44   overlaps
 *    768         737              704       -33   overlaps
 *   1024         992              960       -32   overlaps
 *   1180        1118             1116        -2   overlaps
 *   1280        1168             1216       +48   clear
 *   1440        1248             1376      +128   clear
 *
 * Below 1280px the column is full width, so there is no lane and the
 * button lands on the words. It therefore floats only at 1280px and
 * above, and below that it lives in the navigation — as a full-width row
 * in the hamburger panel on a phone, and as a 44px control in the
 * navigation row on a tablet.
 *
 * One control, two placements, never both at once.
 *
 * Run: node scripts/apply-chat-gutter.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const CSS = "src/styles.css";
let css = readFileSync(CSS, "utf8");
const before = css;

function mustFind(needle, label) {
  if (!css.includes(needle)) {
    console.error(`FAIL: ${label} — anchor not found:\n${needle}`);
    process.exit(1);
  }
}

function replaceOnce(needle, replacement, label) {
  mustFind(needle, label);
  const parts = css.split(needle);
  if (parts.length !== 2) {
    console.error(`FAIL: ${label} — anchor appears ${parts.length - 1} times, expected exactly 1`);
    process.exit(1);
  }
  css = parts.join(replacement);
}

// ── 1. The FAB floats only where a gutter exists ───────────────────────────
const fabAnchor = `.chat-fab { position: fixed; bottom: 1.25rem; right: max(1.25rem, calc(50vw - 720px + 1.25rem)); z-index: 150; width: 44px; height: 44px; display: grid; place-items: center; background: var(--teal); color: #fff; transition: transform .22s ease-out, opacity .22s ease-out; }`;
const fabReplacement = `${fabAnchor}
/* Measured gutter: the content column only leaves a lane at 1280px and
 * above. Below that the button would sit on the words being read, so it
 * gives way to the navigation entry (.chat-nav-btn). */
@media (max-width: 1279px) {
  .chat-fab { display: none; }
}`;
replaceOnce(fabAnchor, fabReplacement, "chat-fab anchor");

// ── 2. The navigation entry, and the rules that make it a proper control ──
const themeAnchor = `.theme-toggle {
  margin-left: .2rem; padding: .18rem .4rem; font-size: var(--text-body); line-height: 1;
  min-width: 44px; display: inline-flex; align-items: center; justify-content: center;
  position: relative;
  color: var(--3); border-radius: 0; transition: all .2s var(--ease);
}`;
if (!css.includes(themeAnchor)) {
  console.error("FAIL: theme-toggle anchor not found — locate the nav control styles before applying.");
  process.exit(1);
}

const navBtn = `
/* The assistant, in the navigation. Same control as the floating button,
 * in the only place it can live without covering the text. */
.chat-nav-btn {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid var(--5);
  background: var(--surface);
  color: var(--2);
  cursor: pointer;
}
.chat-nav-btn:hover { background: var(--bg-2); }
/* At 1280px and above the gutter exists and the floating button is the
 * better placement, so the navigation entry stands down. */
@media (min-width: 1280px) {
  .chat-nav-btn { display: none; }
}
/* In the hamburger panel the entry becomes a full-width row, matching the
 * other controls there. */
@media (max-width: 900px) {
  .nav-links.nav-links-open .chat-nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 44px;
    margin: 0;
    padding: .55rem .45rem;
    border: 1px solid var(--5);
    background: var(--surface);
    color: var(--2);
  }
}
/* The floating button and the navigation entry are never both live. */
@media (max-width: 900px) {
  body:has(.nav-links-open) .chat-panel {
    visibility: hidden;
    pointer-events: none;
  }
}`;

replaceOnce(fabReplacement, fabReplacement + navBtn, "chat-fab replacement block");

// ── 3. Print: neither the button nor the entry belongs on paper ──────────
const printAnchor = `body:has(.city-evidence-summary) .chat-fab,`;
if (css.includes(printAnchor)) {
  // Add the nav entry beside it inside the same print block.
  const idx = css.indexOf(printAnchor);
  const blockEnd = css.indexOf("}", idx);
  const block = css.slice(idx, blockEnd);
  if (!block.includes(".chat-nav-btn")) {
    const newBlock = block.replace(
      printAnchor,
      `.chat-nav-btn,\n${printAnchor}`,
    );
    css = css.slice(0, idx) + newBlock + css.slice(blockEnd);
  }
}

// ── 4. Assert: the rules exist and no selector was lost ─────────────────
const assertions = [
  ["@media (max-width: 1279px) {\n  .chat-fab { display: none; }", "FAB hidden below 1280px"],
  [".chat-nav-btn {", "navigation chat entry exists"],
  ["@media (min-width: 1280px) {\n  .chat-nav-btn { display: none; }", "nav entry hidden at 1280px+"],
  [".chat-fab { position: fixed;", "FAB rule preserved"],
];
for (const [needle, label] of assertions) {
  if (!css.includes(needle)) {
    console.error(`FAIL: ${label} — rule missing after edit`);
    process.exit(1);
  }
}

// Brace balance must be unchanged.
const openBefore = (before.match(/\{/g) || []).length;
const closeBefore = (before.match(/\}/g) || []).length;
const openAfter = (css.match(/\{/g) || []).length;
const closeAfter = (css.match(/\}/g) || []).length;
if (openAfter !== closeAfter) {
  console.error(`FAIL: brace imbalance — ${openAfter} open vs ${closeAfter} close`);
  process.exit(1);
}
if (openAfter - openBefore !== closeAfter - closeBefore) {
  console.error("FAIL: brace count changed by an unexpected amount");
  process.exit(1);
}

writeFileSync(CSS, css);
console.log(`OK  chat gutter applied`);
console.log(`    braces ${openBefore}/${closeBefore} -> ${openAfter}/${closeAfter} (balanced)`);
console.log(`    +${css.length - before.length} bytes`);
