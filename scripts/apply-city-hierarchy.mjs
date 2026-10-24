/**
 * CITY DOSSIER HIERARCHY SURGERY
 * ==============================
 * Moves the page's ONE display statement into the hero, and removes the
 * four facts that were rendered twice (name, province, composite, rank).
 *
 * Every replacement is asserted: the script aborts if the expected number
 * of replacements is not made, so no selector can be silently lost.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");
const before = css.length;

/** Replace `from` with `to`, asserting `count` occurrences existed. */
function sub(from, to, count, label) {
  const found = css.split(from).length - 1;
  if (found !== count) {
    console.error(`ABORT  ${label}: expected ${count} occurrence(s), found ${found}`);
    console.error("---- pattern ----\n" + from);
    process.exit(1);
  }
  css = css.split(from).join(to);
  console.log(`ok     ${label}  (${found})`);
}

/* ── 1. The hero title IS the page's one display statement ─────────────── */
sub(
  `.city-hero-photo-title { font-size: var(--text-body); font-weight: 700; color: #fff; letter-spacing: -.03em; }`,
  `.city-hero-photo-title {
  font-size: clamp(1.75rem, 6vw, var(--text-display));
  font-weight: 700; color: #fff; letter-spacing: -.03em; margin: 0;
  max-width: 100%; overflow-wrap: anywhere; text-wrap: balance;
}`,
  1,
  "hero title becomes the display statement",
);

// The media-query copies must not re-pin it to body size.
sub(
  `  .city-hero-photo-title {
    display: block;
    font-family: var(--font-heading);
    font-size: var(--text-body);
    font-weight: 700;`,
  `  .city-hero-photo-title {
    display: block;
    font-family: var(--font-heading);
    font-weight: 700;`,
  1,
  "desktop override stops re-pinning the title size",
);

sub(
  `  .city-hero-photo-title { font-size: var(--text-body); }
`,
  ``,
  2,
  "phone + small-screen overrides stop re-pinning the title size",
);

sub(
  `  .city-hero-photo-title {
    /* 11.8vw put a 375px phone at 44px — cap at the display token (28px floor per §11.8) */
    font-size: var(--text-body);
    line-height: .98;
  }`,
  `  .city-hero-photo-title {
    /* §11.8: hero headline, 28px floor, display token ceiling */
    line-height: .98;
  }`,
  1,
  "narrow override stops re-pinning the title size",
);

/* ── 2. The evidence heading is a section heading, not the page title ──── */
sub(
  `.city-evidence-summary h1 { margin: 0; font-size: var(--text-display); }`,
  `.city-evidence-summary h2 { margin: 0; }`,
  1,
  "evidence heading drops from h1 to h2",
);

/* ── 3. The photo is no longer the evidence block's sibling ────────────── */
sub(
  `/* The dossier photograph supplies context without displacing the finding. */
.city-evidence-summary + .city-hero-photo { height: auto; min-height: 0; aspect-ratio: 4 / 3; }
@media (min-width: 720px) {
  .city-evidence-summary + .city-hero-photo { aspect-ratio: 6 / 1; }
}
@media (max-width: 719px) {
  .city-evidence-summary + .city-hero-photo { aspect-ratio: 3 / 2; }
}
.city-repeat-name { font-size: var(--text-display); font-weight: 700; margin: 0; }
@media (min-width: 720px) and (max-width: 1199px) {
  .city-evidence-summary + .city-hero-photo { aspect-ratio: 4 / 1; }
}
@media (min-width: 901px) and (max-width: 1199px) {
  .city-evidence-summary + .city-hero-photo .city-hero-fingerprint {
    top: .5rem; bottom: auto; width: 72px !important; height: 72px !important;
  }
}
`,
  ``,
  1,
  "sibling aspect-ratio rules and the duplicate name class are gone",
);

/* ── 4. Dead rules left behind by the de-duplication ───────────────────── */
sub(
  `.city-detail-header h1 { font-size: var(--text-display); font-weight: 700; letter-spacing: -.04em; line-height: .95; margin-bottom: .15rem; }
.city-detail-province { font-size: var(--text-body); color: var(--3); }
`,
  ``,
  1,
  "dead header h1 + province rules",
);
sub(`.composite-large { font: 700 var(--text-display) var(--mono); letter-spacing: -.03em; }
`, ``, 1, "dead composite-large rule");
sub(
  `  .city-detail-header h1 {
    max-width: 760px;
    font-size: var(--text-display);
    line-height: .98;
    letter-spacing: -.055em;
  }

  .city-detail-province {
    margin-top: .22rem;
    font: 600 var(--text-body)/1.4 var(--font);
    color: var(--3);
  }

`,
  ``,
  1,
  "dead desktop header h1 + province rules",
);
sub(
  `  .composite-large {
    font-size: var(--text-display);
    line-height: .95;
    color: var(--ink);
  }

`,
  ``,
  1,
  "dead desktop composite-large rule",
);
sub(
  `.city-detail-header h1 {
  max-width: 100%;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

`,
  ``,
  1,
  "dead balance rule (moved onto the hero title)",
);
sub(
  `  .city-detail-header h1 {
    font-size: var(--text-display);
    line-height: 1.02;
    letter-spacing: -.035em;
  }
`,
  ``,
  1,
  "dead narrow header h1 rule",
);
sub(
  `  .city-detail-score-block .composite-large {
    font-size: clamp(1.75rem, 9vw, var(--text-display));
  }
`,
  ``,
  1,
  "dead narrow composite-large rule",
);

/* Grouped rule: drop only the orphaned selector, keep the rest. */
sub(
  `.composite-large, .city-card-composite, .stat-value,`,
  `.city-card-composite, .stat-value,`,
  1,
  "orphaned selector removed from the numeric group",
);

/* ── Assert: the selectors the page still needs all survived ──────────── */
const REQUIRED = [
  `.city-hero-photo-title`,
  `.city-hero-photo-score-card`,
  `.city-hero-photo-score`,
  `.city-evidence-summary`,
  `.city-evidence-details`,
  `.city-readable-radar`,
  `.city-research-appendix`,
  `.tier-badge-large`,
  `.reality-badge`,
  `.league-badge`,
  `.city-detail-score-block`,
];
for (const sel of REQUIRED) {
  if (!css.includes(sel)) {
    console.error(`ABORT  required selector lost: ${sel}`);
    process.exit(1);
  }
}
console.log(`ok     all ${REQUIRED.length} required selectors survive`);

writeFileSync(FILE, css);
console.log(`\nstyles.css ${before} -> ${css.length} bytes`);
