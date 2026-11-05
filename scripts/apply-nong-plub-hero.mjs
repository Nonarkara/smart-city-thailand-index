/**
 * NONG PLUB, IN THE PICTURE
 * =========================
 * The city dossier's hero is a photograph, and a photograph with a hole
 * in the middle of it is a spatial hallucination: a band that carries a
 * title on the left, a score card on the right, and nothing at all
 * between them.
 *
 * The obvious fix — drop her into the hole — is the failure the owner
 * named: a sticker filling a gap. The difference between a mascot and a
 * sticker is not size or polish, it is WHERE SHE IS. A sticker is a
 * rectangle of somebody laid over the edge of a picture. A mascot is
 * somebody who is somewhere: her feet are on the ground, the frame cuts
 * her because the camera was closer than she was, and she is lit by the
 * same picture she is standing in.
 *
 * So she is not placed in the hole. She stands on the band's bottom edge,
 * off centre, and the score card overlaps her — a thing that overlaps
 * another thing is nearer the camera, and that is what says "she is in
 * the picture" instead of "a shape was laid over the picture". The
 * drawings carry a transparent ground, so there is no paper rectangle to
 * announce the insertion, and the frame's own crop is what grounds her —
 * which is why she needs no drop shadow, and the design law allows none.
 *
 * On a phone the band is 390×250 and already carries the title, the
 * score card and the fingerprint: a figure there would be a sticker in a
 * gap, so on phones she arrives one band lower, at full size, in the
 * "One minute with Nong Plub" infographic that follows.
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

const ANCHOR = `/* Visual heritage is evidence: retain the whole object and its attribution. */`;
const MARKER = `   NONG PLUB, IN THE PICTURE`;

const BLOCK = `/* ═══════════════════════════════════════════════════════════════════════════
   NONG PLUB, IN THE PICTURE
   ═══════════════════════════════════════════════════════════════════════════
   She stands in the photograph, on the band's bottom edge, cropped by the
   frame the way a camera crops a person standing close to it. Not in the
   hole in the middle of the band — that would be a sticker filling a gap,
   which is the spatial hallucination this placement exists to avoid.

   The selectors are COMPOUND on purpose. The photograph's own rule is
   ".city-hero-photo img" — one class, one type — and a bare class cannot
   outrank it, so the figure inherited width:100%, height:100% and
   display:block from the photograph and was stretched across the whole
   band. The compound selector is what makes the placement real. */

.city-hero-photo img.nong-plub-hero-figure,
.city-hero-gradient img.nong-plub-hero-figure {
  position: absolute;
  bottom: 0;
  /* Off centre on purpose: a figure dead in the middle of the band is a
     sticker in a hole. She stands in the photograph's right third, clear
     of the score card: the card carries the city's number and no drawing
     may ever sit on top of a number. Her grounding comes from the frame
     itself — the band cuts her off at the hips, the way a camera cuts off
     a person standing closer to it than the photographer meant. */
  left: 73.5%;
  transform: translateX(-50%);
  height: 96%;
  width: auto;
  object-fit: contain;
  object-position: bottom center;
  pointer-events: none;
  /* The photograph runs a slow kenBurns zoom, and an animation on the
     transform property BEATS a declaration of it — so the animation was
     silently cancelling the translateX(-50%) that centres her, and left
     was setting her EDGE instead of her middle. A drawing does not need
     the photograph's zoom anyway. */
  animation: none;
  /* Above the photograph and its scrim, below the words: the copy must
   * never end up behind a drawing, and the score card must never end up
   * behind one either. */
  z-index: 2;
}

/* The copy is a child of the overlay, and the overlay is not a stacking
   context, so the figure would paint over the words without this. */
.city-hero-photo-copy,
.city-hero-photo-score-card { position: relative; z-index: 3; }

/* On a phone the band is 390×250 and already carries the title, the score
   card and the fingerprint. She arrives one band lower instead, at full
   size, in the infographic that follows. */
@media screen and (max-width: 719px) {
  .city-hero-photo img.nong-plub-hero-figure,
  .city-hero-gradient img.nong-plub-hero-figure { display: none; }
}

`;

/* Idempotent: any earlier copy of this block is removed before the new one
   is written, so the script can be re-run after an edit. */
if (css.includes(MARKER)) {
  const start = css.indexOf(MARKER);
  const end = css.indexOf(ANCHOR, start);
  if (end === -1) throw new Error("the anchor is missing after the existing block");
  css = css.slice(0, start - 68) + css.slice(end);
  console.log("  ✓ existing block removed");
}

css = once(css, ANCHOR, BLOCK + ANCHOR, "Nong Plub in the picture — rules inserted");

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);

writeFileSync(FILE, css);
console.log(`  ${FILE} written`);
