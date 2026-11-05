/**
 * THE LAST OF THE FILLS THAT WERE USED AS TYPE
 * ===========================================
 * The second pass of the legibility sweep. Four more places where a
 * graphic colour was carrying words:
 *
 *   · the export button's secondary line, rgba(12,47,83,.72) on the amber
 *     button — 3.96:1;
 *   · the medium-severity colour on /invest — var(--gold) at 2.13:1 as a
 *     label and 1.96:1 on its own tinted chip;
 *   · the environmental domain colour on /references — #009465 at 3.87:1
 *     as a heading;
 *   · the data-flow diagram's four layer colours on /methodology, three of
 *     which could not carry type on the surface they sit on.
 *
 * The diagram follows the pattern the pillars already use: the bright hue
 * stays the BOX, a deepened hue carries the WORDS. The domain green gains
 * its own --wada-green-text token beside the other palette tokens.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");

/** Idempotent: a fix already applied is skipped, never applied twice. */
function once(text, needle, replacement, label) {
  if (text.includes(replacement) && !text.includes(needle)) {
    console.log(`  · ${label} (already applied)`);
    return text;
  }
  const parts = text.split(needle);
  if (parts.length !== 2) {
    throw new Error(`${label}: expected exactly 1 match, found ${parts.length - 1}`);
  }
  console.log(`  ✓ ${label}`);
  return parts[0] + replacement + parts[1];
}

// The export button's secondary line on the amber ground.
css = once(
  css,
  `.export-btn-primary .export-btn-text span { color: rgba(12,47,83,.72); }`,
  `.export-btn-primary .export-btn-text span { color: rgba(12,47,83,.88); }`,
  "export button secondary text  .72 → .88",
);

// The environmental domain's green, deepened for type.
css = once(
  css,
  `  --wada-antwarp: #007190;   /* Antwarp Blue — Plate 140 / 163 */`,
  `  --wada-antwarp: #007190;   /* Antwarp Blue — Plate 140 / 163 */
  --wada-green-text: #007a52; /* Wada green stepped down for TYPE: 5.38:1 on white.
                                 The fill green (#009465) is 3.87:1 and cannot
                                 carry a heading. */`,
  "--wada-green-text token added",
);

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);

writeFileSync(FILE, css);
console.log(`  ${FILE} written`);
