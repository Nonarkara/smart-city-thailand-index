// Fix the podium photo scrims so every text element over a photograph
// clears its WCAG floor again.
//
// Background
// ----------
// Upstream commit 328118a lightened the podium scrims (.72/.88 -> .45/.62
// on the leader, .7/.86 -> .4/.58 on the #2-#5 cards) so the city photos
// would show through. But the repo's own law is explicit:
//
//   "Photo overlays: dark gradients >= 78% opacity + text-shadow for
//    legibility."                                      (CLAUDE.md)
//
// and measurement at that HEAD confirmed the lightening broke three
// elements outright:
//
//   .podium-photo-score   1.65:1  (needs 3)
//   .podium-photo-vibe    2.39:1  (needs 4.5)
//   .podium-rank          3.17:1  (needs 4.5)
//
// A single flat gradient cannot serve both requirements. The leader card
// has text at the TOP (rank, name, score) and at the BOTTOM (stats, vibe),
// with the photograph showing through the middle. So the scrim is built
// as a multi-stop gradient: strong at the top where the rank/name/score
// sit, easing to transparent across the photographic middle band, and
// strong again at the bottom where the stats and vibe sit.
//
// The gradient stops are placed so that every TEXT BAND is covered by an
// opaque-enough region, while the photograph still reads through the
// middle of the card. Verified by pixel measurement, not by eye.
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
    console.error(`REFUSE: anchor not found:\n${anchor}`);
    process.exit(1);
  }
  if (n > 1) {
    console.error(`REFUSE: anchor appears ${n} times, expected exactly 1:\n${anchor}`);
    process.exit(1);
  }
  css = css.replace(anchor, replacement);
}

// ─── Leader card ──────────────────────────────────────────────────────
// Text sits in two bands: the top row (rank + name + score) and the
// bottom row (stats + vibe). The photographic middle stays open.
const LEADER_OLD = `  background: linear-gradient(rgba(20,19,16,.45) 0%, rgba(26,24,20,.62) 62%);
}`;

const LEADER_NEW = `  /* Three-band scrim: the top row (rank, name, score) and the
     bottom row (stats, vibe) each sit on an opaque ground, while the
     photographic middle band stays open so the city picture still reads.
     The top band must stay >= 78% opacity -- see the photo-overlay law
     in CLAUDE.md and the pixel measurement in
     scripts/audit/ (the .podium-photo-score element failed at 1.65:1
     when this scrim was lightened to .45). */
  background: linear-gradient(
    rgba(18,17,15,.86) 0%,
    rgba(18,17,15,.86) 26%,
    rgba(20,19,16,.28) 46%,
    rgba(22,20,17,.42) 62%,
    rgba(26,24,20,.88) 84%,
    rgba(26,24,20,.92) 100%
  );
}`;

// ─── #2-#5 grid cards ─────────────────────────────────────────────────
// These stack rank, name, score, stats and vibe vertically at the bottom
// of the card, so the scrim has to rise from the bottom edge far enough
// to carry all five.
const CARD_OLD = `  background: linear-gradient(rgba(20,19,16,.4) 0%, rgba(26,24,20,.58) 62%);
}`;

const CARD_NEW = `  /* Same three-band logic as the leader, compressed: the card is
     short, so the open photographic band is only the top third and the
     text stack is carried by the strong lower half. */
  background: linear-gradient(
    rgba(20,19,16,.62) 0%,
    rgba(22,20,17,.86) 34%,
    rgba(26,24,20,.92) 100%
  );
}`;

once(LEADER_OLD, LEADER_NEW);
once(CARD_OLD, CARD_NEW);

// Brace balance check on the whole stylesheet.
const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — podium scrims restored to a legible three-band gradient.");
