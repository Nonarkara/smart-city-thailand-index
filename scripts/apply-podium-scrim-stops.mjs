// Correct the leader podium scrim stops using the MEASURED geometry.
//
// WHY
// ---
// The three-band scrim concept is right; the first set of stops was not.
// Gradient stops are only meaningful against the real geometry of the
// card, and guessing them put the stats row inside the open photographic
// band:
//
//   measured failure at the guessed stops:
//     .podium-photo-stat  3.84:1  (needs 4.5)
//
// The overlay geometry was then measured directly (see the probe that
// reports each text element's band as a percentage of the overlay box):
//
//   leader, 390px phone, overlay 220px:
//     rank   5.8% -> 12.6%
//     name  12.6% -> 19.6%
//     score  5.8% -> 20.4%
//     stat  65.0% -> 71.8%   <- the lowest text on the phone
//     stat  73.3% -> 80.1%
//     vibe  83.7% -> 90.5%
//
//   leader, 1440px desktop, overlay 320px:
//     rank   7.5% -> 12.2%
//     score  7.5% -> 17.5%
//     stat  78.1% -> 82.8%
//     vibe  85.3% -> 90.0%
//
// So the free photographic band is 20.4%-65% on the phone and
// 17.5%-78.1% on the desktop, and the strong bottom band must be FULL
// STRENGTH by 65% — not 78%. The stops below are set from those numbers:
//
//   0%-20%   strong   carries rank, name, score
//   30%-54%  open     the photograph reads through (inside the free band
//                      on BOTH viewports)
//   63%+     strong   carries stats and vibe on the phone, where they
//                      sit lowest
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
    console.error(`REFUSE: anchor not found:\n${anchor.slice(0, 200)}`);
    process.exit(1);
  }
  if (n > 1) {
    console.error(`REFUSE: anchor appears ${n} times, expected exactly 1:\n${anchor.slice(0, 200)}`);
    process.exit(1);
  }
  css = css.replace(anchor, replacement);
}

const OLD = `  background: linear-gradient(
    rgba(18,17,15,.86) 0%,
    rgba(18,17,15,.86) 24%,
    rgba(20,19,16,.16) 44%,
    rgba(22,20,17,.26) 60%,
    rgba(26,24,20,.88) 78%,
    rgba(26,24,20,.92) 100%
  );
}`;

const NEW = `  background: linear-gradient(
    rgba(18,17,15,.86) 0%,
    rgba(18,17,15,.86) 20%,
    rgba(20,19,16,.30) 30%,
    rgba(22,20,17,.22) 54%,
    rgba(26,24,20,.86) 63%,
    rgba(26,24,20,.92) 100%
  );
}`;

once(OLD, NEW);

const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — leader scrim stops corrected to the measured geometry.");
