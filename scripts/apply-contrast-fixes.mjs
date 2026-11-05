/**
 * READ THE INK, NOT THE TOKEN
 * ==========================
 * The massacre sweep asked a new question: can this text be READ, not only
 * does it collide? It answered 791 times "no", and the answers fall into
 * two families that are both real defects and neither is a styling accident:
 *
 *   1. A HAIRLINE COLOUR USED AS TYPE. --4 (#c5d3df) is the structural
 *      hairline. It is 1.53:1 on white. .news-date used it, and the news
 *      strip runs on every route, so one mistake produced 388 findings.
 *
 *   2. A FILL COLOUR USED AS TYPE. The Wada ambers (#f99d1b, #f59e0b) are
 *      graphic colours: 2.13:1 and 2.15:1 on white. The codebase already
 *      knows this — --gold-ink (#9a5d0a, 5.32:1) and the seven
 *      --pillar-*-text tokens exist precisely because the bright hues cannot
 *      carry type. The offenders simply had not been moved onto them yet.
 *
 * The fix is therefore not a new palette. It is the existing discipline,
 * applied where it was missing:
 *
 *   · a hairline becomes --3 when it has to carry type on a light ground;
 *   · a bright fill becomes --gold-ink when it has to carry type;
 *   · a white label on a bright ground becomes ink on that ground, or the
 *     ground is stepped down until white passes on it — the same move the
 *     pillar tokens already make, in the same direction.
 *
 * Every ratio below is WCAG AA (4.5:1 body, 3:1 large) and every pairing is
 * verified by the sweep after this runs.
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

// ─── 1. A hairline that had to carry type ───────────────────────────────
// --4 is 1.53:1 on white. --3 is 5.8:1. --2 is 8.2:1, for the 32px year
// marker, which is a display element and should read as one.
css = once(
  css,
  `.news-date { font: 600 var(--text-micro) var(--mono); color: var(--4); }`,
  `.news-date { font: 600 var(--text-micro) var(--mono); color: var(--3); }`,
  ".news-date  var(--4) → var(--3)",
);
css = once(
  css,
  `.spotlight-id { font: 500 var(--text-micro) var(--mono); color: var(--4); }`,
  `.spotlight-id { font: 500 var(--text-micro) var(--mono); color: var(--3); }`,
  ".spotlight-id  var(--4) → var(--3)",
);
css = once(
  css,
  `.story-tl-year { font: 800 var(--text-display) var(--font-heading); color: var(--4); line-height: 1; }`,
  `.story-tl-year { font: 800 var(--text-display) var(--font-heading); color: var(--2); line-height: 1; }`,
  ".story-tl-year  var(--4) → var(--2)",
);

// ─── 2. A fill that had to carry type ───────────────────────────────────
// --depa-amber/--amber/--gold are graphic colours. --gold-ink is the same
// hue stepped down until it clears WCAG AA as type.
css = once(
  css,
  `  text-transform: uppercase;
  color: var(--depa-amber, #f99d1b);
}
.home-collection-headline {`,
  `  text-transform: uppercase;
  color: var(--gold-ink);
}
.home-collection-headline {`,
  ".home-collection-kicker  amber → --gold-ink",
);
css = once(
  css,
  `  letter-spacing: .05em;
  color: var(--amber, #f59e0b);
}
.home-field-op-limit {`,
  `  letter-spacing: .05em;
  color: var(--gold-ink);
}
.home-field-op-limit {`,
  ".home-field-op-target-label  amber → --gold-ink",
);
css = once(
  css,
  `  text-transform: uppercase;
  color: var(--depa-amber, #f99d1b);
}
.weekly-digest {`,
  `  text-transform: uppercase;
  color: var(--gold-ink);
}
.weekly-digest {`,
  ".weekly-stamp  amber → --gold-ink",
);
css = once(
  css,
  `.meth-ety-sma { color: var(--amber, #f59e0b); }`,
  `.meth-ety-sma { color: var(--gold-ink); }`,
  ".meth-ety-sma  amber → --gold-ink",
);
css = once(
  css,
  `  letter-spacing: -0.05em;
  color: var(--amber, #f59e0b);
}

.ranking-map-view {`,
  `  letter-spacing: -0.05em;
  color: var(--gold-ink);
}

.ranking-map-view {`,
  ".ranking-view-tab-icon  amber → --gold-ink",
);
css = once(
  css,
  `.globe-lg-stat { margin-left: auto; color: var(--gold); font-weight: 600; }`,
  `.globe-lg-stat { margin-left: auto; color: var(--gold-ink); font-weight: 600; }`,
  ".globe-lg-stat  --gold → --gold-ink",
);

// The stalled partner badge was the same amber, on a pale ground.
css = once(
  css,
  `.partner-visual-status-stalled { color: var(--gold); border-color: var(--gold); background: rgba(196,154,42,.06); }`,
  `.partner-visual-status-stalled { color: var(--gold-ink); border-color: var(--gold-ink); background: rgba(196,154,42,.06); }`,
  ".partner-visual-status-stalled  --gold → --gold-ink",
);

// ─── 3. A pale label on a pale ground ───────────────────────────────────
// #888 is 3.54:1 on white. --3 is 5.8:1.
css = once(
  css,
  `.canvas-box-hint {
  font: 400 italic var(--text-micro) var(--font);
  color: #888;`,
  `.canvas-box-hint {
  font: 400 italic var(--text-micro) var(--font);
  color: var(--3);`,
  ".canvas-box-hint  #888 → var(--3)",
);

// The baseline caption sat at rgba(255,255,255,.5) on the navy masthead:
// 4.4:1, a hair under the floor. --4 on that navy is 8.37:1.
css = once(
  css,
  `  text-transform: uppercase;
  color: rgba(255,255,255,.5);`,
  `  text-transform: uppercase;
  color: var(--4);`,
  ".baseline-dims-caption  rgba(255,255,255,.5) → var(--4)",
);

// ─── 4. A white link on a white page ────────────────────────────────────
// The export chip was authored for the dark open-data band on the homepage,
// where it is right. On /methodology and /invest it sits on a white page:
// white text, white ground, an invisible link. The chip now carries ink on a
// hairline ground by default, and keeps its light reading inside the dark
// band.
css = once(
  css,
  `.export-doc-link {
  font: 500 var(--text-micro) var(--mono); color: rgba(255,255,255,.78);
  text-decoration: none; padding: .2rem .6rem; background: rgba(255,255,255,.04);
  transition: color .15s; min-height: 44px; display: inline-flex; align-items: center;
}`,
  `.export-doc-link {
  font: 500 var(--text-micro) var(--mono); color: var(--2);
  text-decoration: none; padding: .2rem .6rem; background: var(--5);
  transition: color .15s; min-height: 44px; display: inline-flex; align-items: center;
}
/* The homepage's open-data band is dark; there the chip keeps its light
   reading. On every other page the ground is light and the ink is dark. */
.open-data-section .export-doc-link {
  color: rgba(255,255,255,.86); background: rgba(255,255,255,.08);
}`,
  ".export-doc-link  white-on-white → ink on a hairline ground",
);

// ─── 5. Thai headings need the leading the script requires ─────────────
// Thai stacks tone marks above the em box. At line-height 1.3 the ink of a
// heading rises 1.5-3.1px ABOVE its own box, so the mark collides with
// whatever sits beside it. A line-height is not a fourth text size — the
// type law holds — and it is the leading the script actually needs.
const THAI_BLOCK = `/* Thai script stacks its tone marks above the em box. At a 1.3
   line-height the ink of a heading rises above the heading's own box and
   collides with whatever sits beside it. Line-height is leading, not a
   fourth text size: the type law still holds. */
html[lang="th"] :is(h1, h2, h3, h4, h5, h6) {
  line-height: 1.6;
}

`;

const THAI_ANCHOR = `/* Chinese locale — system CJK faces; system-ui for Latin. No decorative serifs. */`;
css = once(css, THAI_ANCHOR, THAI_BLOCK + THAI_ANCHOR, "Thai heading leading inserted");

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);

writeFileSync(FILE, css);
console.log(`  ${FILE} written`);
