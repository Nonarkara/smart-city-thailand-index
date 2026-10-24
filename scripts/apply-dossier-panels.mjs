/**
 * THE DOSSIER PANELS
 * ===================
 * All five panels live in the DOM; only the active one is painted. The
 * print stylesheet turns the rest on, so the print pass does the layout
 * itself instead of racing a DOM mount that Chromium would snapshot
 * before it had painted.
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

/* The panel slot rules, next to the other dossier-tab rules. */
sub(
  `.dossier-tab-panel { padding: 1.25rem 0; }
.dossier-tab-content { animation: tabFade .2s ease; }`,
  `.dossier-tab-panel { padding: 1.25rem 0; }
/* All five panels are in the DOM; only the active one is painted. The print
   stylesheet turns the rest on, so the print pass does its own layout
   rather than racing a mount it would snapshot before it had painted. */
.dossier-panel-slot { display: none; }
.dossier-panel-slot[data-active="true"] { display: block; }
.dossier-panel-heading { display: none; }
.dossier-tab-content { animation: tabFade .2s ease; }`,
  1,
  "panel slot rules",
);

/* The print rule that used to hang off .dossier-print-section. */
sub(
  `  .dossier-print-section { break-before: page; }
  .dossier-print-section .reveal { opacity: 1 !important; transform: none !important; }`,
  `  .dossier-panel-slot { display: block !important; break-before: page; }
  .dossier-panel-slot .reveal { opacity: 1 !important; transform: none !important; }
  .dossier-panel-heading { display: block; }`,
  1,
  "print rule now targets the panel slot",
);

sub(
  `  .dossier-print-section .city-print-hide { display: block !important; }
  .dossier-print-section .reveal { visibility: visible !important; }`,
  `  .dossier-panel-slot .city-print-hide { display: block !important; }
  .dossier-panel-slot .reveal { visibility: visible !important; }`,
  1,
  "second print rule now targets the panel slot",
);

const REQUIRED = [
  `.dossier-panel-slot { display: none; }`,
  `.dossier-panel-slot[data-active="true"] { display: block; }`,
  `.dossier-panel-slot { display: block !important; break-before: page; }`,
  `.dossier-tab-content`,
  `.dossier-tab-panel`,
];
for (const sel of REQUIRED) {
  if (!css.includes(sel)) {
    console.error(`ABORT  required rule lost: ${sel}`);
    process.exit(1);
  }
}
if (css.includes("dossier-print-section")) {
  console.error("ABORT  a .dossier-print-section rule survived");
  process.exit(1);
}
writeFileSync(FILE, css);
console.log(`\nstyles.css ${before} -> ${css.length} bytes`);
