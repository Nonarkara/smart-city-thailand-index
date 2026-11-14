// Restore the three-band podium scrim, rejecting the per-element plate approach.
//
// WHAT HAPPENED
// -------------
// Upstream commit 329a827 lightened the podium scrim so the city photographs
// would show through, and moved the contrast burden onto small dark plates
// behind each individual text element (rgba(18,17,15,.5/.55) + padding).
//
// The intent — let the photograph read — is right. The execution is not:
//
//  1. MEASURED FAILURE. Pixel measurement of the real composited ground
//     (plate over scrim over photograph, taking the LIGHTEST pixel behind
//     each glyph) at that HEAD:
//
//       .podium-photo-card-vibe   2.38:1   needs 4.5   FAIL
//       .podium-photo-name        3.09:1   needs 4.5   FAIL
//       .podium-photo-vibe        4.36:1   needs 4.5   FAIL
//       .podium-photo-score       4.03:1   needs 3     pass
//       .podium-photo-card-score  4.52:1   needs 3     pass
//
//     Three elements out of eighteen fail. The commit message claimed
//     "WCAG contrast" but shipped no gate that would have caught this.
//
//  2. IT UNDID A DELIBERATE PRIOR DECISION. Commit 137051f ("podium text
//     sits on the full-card scrim without per-element plates") removed
//     these plates on purpose.
//
//  3. THE PLATES ARE THE SLOP THE OWNER NAMED. A padding box behind every
//     individual text run is a scattered dark rectangle — exactly the
//     "text boxes... where SH sprawls out into AI design slop" complaint.
//     The repo's aesthetic law is flat and hairlined, not chipped.
//
// THE FIX
// -------
// A single gradient cannot both carry the text and leave the photograph
// open. A three-band gradient can:
//
//   top band    strong  — carries rank, name and score
//   middle band open    — the photograph reads through, which is what the
//                          upstream commit was actually trying to achieve
//   bottom band strong  — carries stats and vibe
//
// The middle band is widened and opened slightly relative to the first
// restoration, because the middle band is where the photograph is supposed
// to be seen, and nothing is measured there.
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

// ─── 1. Leader card overlay: the three-band scrim ─────────────────────
const LEADER_OLD = `  /* Light scrim: the photograph shows through; text contrast comes from
     the dark plates on .podium-photo-name / .podium-photo-score /
     .podium-photo-leader .podium-rank (top band) and .podium-photo-stat
     / .podium-photo-vibe (bottom band). No element reads text off the
     bare photo, so no band needs to be opaque. */
  background: linear-gradient(
    rgba(18,17,15,.42) 0%,
    rgba(18,17,15,.42) 26%,
    rgba(20,19,16,.18) 46%,
    rgba(22,20,17,.30) 62%,
    rgba(26,24,20,.48) 84%,
    rgba(26,24,20,.52) 100%
  );
}`;

const LEADER_NEW = `  /* Three-band scrim. The photograph reads through the open middle
     band; the top band carries the rank, name and score, and the bottom
     band carries the stats and vibe. A per-element plate was tried and
     measured at 2.38:1 / 3.09:1 / 4.36:1 on three elements — below their
     WCAG floor — and it read as scattered dark boxes. A single scrim with
     an open middle does both jobs without the chips. */
  background: linear-gradient(
    rgba(18,17,15,.86) 0%,
    rgba(18,17,15,.86) 24%,
    rgba(20,19,16,.16) 44%,
    rgba(22,20,17,.26) 60%,
    rgba(26,24,20,.88) 78%,
    rgba(26,24,20,.92) 100%
  );
}`;

once(LEADER_OLD, LEADER_NEW);

// ─── 2. Leader card overlay: strip the per-element plates ──────────────
const PLATE_RULES = [
  // .podium-photo-name
  [`  text-shadow: 0 1px 4px rgba(0,0,0,.5);
  padding: .1rem .3rem;
  background: rgba(18,17,15,.5);
}`,
   `  text-shadow: 0 1px 4px rgba(0,0,0,.5);
}`],
  // .podium-photo-score
  [`  /* Sits on the card's full scrim; dark plate keeps the number readable
     whatever the photograph underneath. */
  padding: .1rem .3rem;
  background: rgba(18,17,15,.55);
  text-shadow: 0 1px 6px rgba(0,0,0,.6);`,
   `  /* Sits on the card's full scrim; no plate of its own. */
  text-shadow: 0 1px 6px rgba(0,0,0,.6);`],
  // .podium-photo-stat
  [`  font: 500 var(--text-micro) var(--mono); color: rgba(255,255,255,.86);
  padding: .1rem .3rem;
  background: rgba(18,17,15,.55);
  text-shadow: 0 1px 3px rgba(0,0,0,.5);`,
   `  font: 500 var(--text-micro) var(--mono); color: rgba(255,255,255,.86);
  text-shadow: 0 1px 3px rgba(0,0,0,.5);`],
  // .podium-photo-vibe
  [`  font: 600 var(--text-micro) var(--mono); color: var(--gold);
  margin-bottom: .5rem;
  padding: .1rem .3rem;
  background: rgba(18,17,15,.55);
  text-shadow: 0 1px 3px rgba(0,0,0,.6);`,
   `  font: 600 var(--text-micro) var(--mono); color: var(--gold);
  margin-bottom: .5rem;
  text-shadow: 0 1px 3px rgba(0,0,0,.6);`],
  // .podium-photo-leader .podium-rank
  [`  font: 700 var(--text-micro) var(--mono); color: rgba(255,255,255,.92);
  padding: .1rem .3rem;
  background: rgba(18,17,15,.55);
  text-shadow: 0 1px 3px rgba(0,0,0,.6);
  letter-spacing: .08em;`,
   `  font: 700 var(--text-micro) var(--mono); color: rgba(255,255,255,.92);
  text-shadow: 0 1px 3px rgba(0,0,0,.6);
  letter-spacing: .08em;`],
];

for (const [oldText, newText] of PLATE_RULES) once(oldText, newText);

// ─── 3. #2-#5 grid card overlay: compressed three-band scrim ───────────
const CARD_OLD = `  /* Same light-scrim logic as the leader, compressed: the card is
     short, so the open photographic band is most of the card and the
     text stack is carried by dark plates on each element. */
  background: linear-gradient(
    rgba(20,19,16,.35) 0%,
    rgba(22,20,17,.45) 34%,
    rgba(26,24,20,.55) 100%
  );
}`;

const CARD_NEW = `  /* Same three-band logic as the leader, compressed: the card is
     short, so the open photographic band is only the top third and the
     text stack is carried by the strong lower half. */
  background: linear-gradient(
    rgba(20,19,16,.72) 0%,
    rgba(22,20,17,.86) 30%,
    rgba(26,24,20,.92) 100%
  );
}`;

once(CARD_OLD, CARD_NEW);

// ─── 4. #2-#5 card elements: strip the per-element plates ─────────────
const CARD_PLATE_RULES = [
  [`.podium-photo-card .podium-rank { font: 600 var(--text-micro) var(--mono); color: rgba(255,255,255,.92); padding: .1rem .3rem; background: rgba(18,17,15,.55); text-shadow: 0 1px 3px rgba(0,0,0,.6); letter-spacing: .06em; }`,
   `.podium-photo-card .podium-rank { font: 600 var(--text-micro) var(--mono); color: rgba(255,255,255,.92); text-shadow: 0 1px 3px rgba(0,0,0,.6); letter-spacing: .06em; }`],
  [`.podium-photo-card-name { font-size: var(--text-body); font-weight: 700; color: #fff; letter-spacing: -.02em; text-shadow: 0 1px 3px rgba(0,0,0,.5); padding: .1rem .3rem; background: rgba(18,17,15,.5); }`,
   `.podium-photo-card-name { font-size: var(--text-body); font-weight: 700; color: #fff; letter-spacing: -.02em; text-shadow: 0 1px 3px rgba(0,0,0,.5); }`],
  [`.podium-photo-card-score { font: 700 var(--text-display) var(--mono); color: var(--gold); letter-spacing: -.03em; line-height: 1; padding: .1rem .3rem; background: rgba(18,17,15,.55); text-shadow: 0 1px 4px rgba(0,0,0,.4); }`,
   `.podium-photo-card-score { font: 700 var(--text-display) var(--mono); color: var(--gold); letter-spacing: -.03em; line-height: 1; text-shadow: 0 1px 4px rgba(0,0,0,.4); }`],
  [`.podium-photo-card-vibe { font: 600 var(--text-micro) var(--mono); padding: .1rem .3rem; background: rgba(18,17,15,.55); }`,
   `.podium-photo-card-vibe { font: 600 var(--text-micro) var(--mono); }`],
];

for (const [oldText, newText] of CARD_PLATE_RULES) once(oldText, newText);

// ─── Brace balance check ───────────────────────────────────────────────
const opens = (css.match(/\{/g) || []).length;
const closes = (css.match(/\}/g) || []).length;
if (opens !== closes) {
  console.error(`REFUSE: brace imbalance after edit — ${opens} '{' vs ${closes} '}'`);
  process.exit(1);
}

writeFileSync(CSS, css);
console.log("OK — three-band scrim restored, per-element plates removed.");
