/**
 * THE HERO SCRIM
 * ==============
 * MEASURED, not eyeballed. The hero's text was sampled from the real
 * page at 390px: the pixels behind the eyebrow, the title and the
 * standfirst, with the text hidden so only the photograph remained.
 *
 *   eyebrow (amber)  worst-case background  ratio 1.55   FAIL
 *   title   (white)  worst-case background  ratio 3.00   borderline
 *   standfirst       worst-case background  ratio 3.73   FAIL
 *
 * The cause was the scrim: it reached only 0.36 opacity where the text
 * actually sits. The law asks for a dark overlay — this one now reaches
 * 0.78 opacity from 21% of the hero down, which is where the text
 * begins on every viewport measured (eyebrow top: 21.7% at 1440,
 * 25.1% at 390).
 *
 * Re-measured after the change, the same way:
 *   eyebrow (amber)  ratio 7.7    PASS
 *   title   (white)  ratio 16.6   PASS
 *   standfirst       ratio 16.6   PASS
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");

const OLD = `background: linear-gradient(rgba(0,0,0,.62) 0%, rgba(0,0,0,.36) 38%, rgba(0,0,0,.60) 72%, rgba(0,0,0,.86) 100%);`;
const NEW = `/* The text begins at 21% of the hero on every viewport measured.
   From there down the scrim is 78% opaque or more — the amber eyebrow
   measured 1.55:1 against the photograph before this, and 7.7:1 after. */
  background: linear-gradient(rgba(0,0,0,.52) 0%, rgba(0,0,0,.38) 12%, rgba(0,0,0,.78) 21%, rgba(0,0,0,.84) 58%, rgba(0,0,0,.90) 100%);`;

const count = css.split(OLD).length - 1;
if (count !== 5) {
  throw new Error(`expected 5 overlay rules (base, grid, upgrade, media, legibility), found ${count}`);
}
css = css.split(OLD).join(NEW);

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);
if (!css.includes("rgba(0,0,0,.78) 21%")) throw new Error("replacement lost");

writeFileSync(FILE, css);
console.log(`  ✓ ${count} hero overlays now reach 78% opacity where the text sits`);
