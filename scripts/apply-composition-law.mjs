/**
 * THE COMPOSITION LAW — applied to the stylesheet and the homepage
 * ================================================================
 * The type law says how big a thing may be. The rhythm law says how far
 * apart two things sit. The COMPOSITION law says what the reader meets
 * FIRST, and what they meet NEXT.
 *
 * Three findings drove this pass, all measured, none of them a taste
 * call dressed up as a fact:
 *
 * 1. THE HOME RIBBON RESTATED THE HERO. The hero states 118 cities, 39
 *    operational, 37 depa-certified. Fifty pixels below, a second band
 *    stated 118 and 37 again — in six display-size yellow numerals on
 *    dark blue. Two bands, the same numbers, the second one louder than
 *    the page's h1. The reader could not tell what was first and what
 *    was third, because the second statement was competing with the
 *    first.
 *
 *    The ribbon now carries only what the hero does not, in one
 *    treatment, at the weight a legend deserves rather than the weight
 *    of a headline. The display size stays with the page's single
 *    statement and the numbers that ARE the argument.
 *
 * 2. THE HERO EYEBROW WAS ILLEGIBLE OVER THE PHOTO. The cinematic
 *    overlay's gradient was transparent for its top half, and the
 *    content block on a phone is tall enough that its FIRST line — the
 *    amber eyebrow — sat over bare, bright temple roof. Amber on a
 *    lit photograph at 11px is not legible, and the design law is
 *    explicit: dark gradients plus a text shadow over every photo.
 *
 * 3. THE HERO PHOTO OUTWEIGHED THE PAGE. A full-bleed photograph is
 *    the heaviest thing on a page by area, and the eye meets it first.
 *    That is fine — a photograph IS the first thing — provided the
 *    page's own statement is unmistakable one beat later. It was not,
 *    because the ribbon shouted over it. Fixing (1) fixes (3).
 *
 * Every edit below is asserted and counted. Run:
 *   node scripts/apply-composition-law.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const CSS = path.join(ROOT, "src/styles.css");
const HOME = path.join(ROOT, "src/HomePage.tsx");
let src = fs.readFileSync(CSS, "utf8");
const edits = [];

/* ── a real parser, because a loose regex can swallow a stylesheet ────── */
function parseRules(css) {
  const rules = [];
  const skipComment = (j, end) => {
    if (css[j] === "/" && css[j + 1] === "*") {
      const e = css.indexOf("*/", j + 2);
      return e < 0 || e > end ? end : e + 2;
    }
    return j;
  };
  const skipString = (j, end) => {
    const q = css[j];
    let k = j + 1;
    while (k < end && css[k] !== q) { if (css[k] === "\\") k++; k++; }
    return Math.min(k + 1, end);
  };
  const matchBrace = (openIdx, end) => {
    let d = 1, k = openIdx + 1;
    while (k < end) {
      k = skipComment(k, end);
      if (k >= end) break;
      const c = css[k];
      if (c === '"' || c === "'") { k = skipString(k, end); continue; }
      if (c === "{") d++;
      else if (c === "}") { d--; if (d === 0) return k; }
      k++;
    }
    return -1;
  };
  const scan = (start, end) => {
    let j = start, prelude = "";
    while (j < end) {
      j = skipComment(j, end);
      if (j >= end) break;
      const c = css[j];
      if (c === '"' || c === "'") { j = skipString(j, end); continue; }
      if (c === "{") {
        const bodyEnd = matchBrace(j, end);
        if (bodyEnd < 0) break;
        const sel = prelude.trim();
        rules.push({ selector: sel, preludeStart: j, bodyStart: j, bodyEnd, end: bodyEnd + 1 });
        if (sel.startsWith("@")) scan(j + 1, bodyEnd);
        j = bodyEnd + 1; prelude = "";
        continue;
      }
      if (c === ";") { prelude = ""; j++; continue; }
      prelude += c;
      j++;
    }
  };
  scan(0, css.length);
  return rules;
}

/** Bottom-up: every edit rewrites the file, so an offset computed on the
 *  old string is only valid for rules that come AFTER the one edited. */
function rulesFor(sel) {
  return parseRules(src)
    .filter((r) => r.selector.split(",").some((part) => part.trim() === sel))
    .sort((a, b) => b.bodyStart - a.bodyStart);
}

function setDecl(sel, prop, value, label) {
  const hits = rulesFor(sel);
  if (!hits.length) throw new Error(`no rule for selector: ${sel} (${label})`);
  let changed = 0;
  for (const rule of hits) {
    const body = src.slice(rule.bodyStart + 1, rule.bodyEnd);
    const re = new RegExp(`(^|[;{\\s])${prop}\\s*:\\s*[^;}]+;`, "g");
    const newBody = body.replace(re, (m, prefix) => {
      const next = `${prefix}${prop}: ${value};`;
      if (m === next) return m;
      changed++;
      return next;
    });
    if (newBody !== body) src = src.slice(0, rule.bodyStart + 1) + newBody + src.slice(rule.bodyEnd);
  }
  edits.push(changed ? `${label} → ${value}` : `${label} → ${value} (already)`);
}

/** Replace the whole body of a rule — used when several declarations move
 *  together and a property-by-property edit would be two passes over the
 *  same rule with stale offsets. */
function setBody(sel, body, label) {
  const hits = rulesFor(sel);
  if (!hits.length) throw new Error(`no rule for selector: ${sel} (${label})`);
  for (const rule of hits) {
    const old = src.slice(rule.bodyStart + 1, rule.bodyEnd);
    const next = "\n" + body.trim().split("\n").map((l) => "  " + l.trim()).join("\n") + "\n";
    src = src.slice(0, rule.bodyStart + 1) + next + src.slice(rule.bodyEnd);
  }
  edits.push(`${label}`);
}

/* ══════════════════════════════════════════════════════════════════════
   1. THE HERO PHOTO — legible over every pixel of it
   ══════════════════════════════════════════════════════════════════════ */

// The gradient was transparent across its top half. On a phone the
// content block is tall, so its first line — the amber eyebrow — landed
// on bare, lit temple roof.
setDecl(
  ".cinematic-hero-overlay",
  "background",
  "linear-gradient(rgba(0,0,0,.62) 0%, rgba(0,0,0,.36) 38%, rgba(0,0,0,.60) 72%, rgba(0,0,0,.86) 100%)",
  ".cinematic-hero-overlay background",
);

// A shadow under every line that sits on the photograph. The design law
// asks for dark gradients AND a text shadow over a photo; the gradient
// alone cannot save a line that lands on a lit roof.
setDecl(
  ".cinematic-hero-eyebrow",
  "text-shadow",
  "0 1px 3px rgba(0,0,0,.6)",
  ".cinematic-hero-eyebrow text-shadow",
);
setDecl(
  ".cinematic-hero-title",
  "text-shadow",
  "0 2px 16px rgba(0,0,0,.45)",
  ".cinematic-hero-title text-shadow",
);

/* ══════════════════════════════════════════════════════════════════════
   2. THE HOME RIBBON — one statement, one weight, no repetition
   ══════════════════════════════════════════════════════════════════════ */

// The ribbon is a legend, not a second headline. Its figures drop to the
// body size so the page's h1 and the hero's three numbers keep the top
// of the hierarchy to themselves.
setDecl(
  ".home-stat-value",
  "font",
  "700 var(--text-body) var(--mono)",
  ".home-stat-value font",
);
setDecl(
  ".home-stat-value",
  "color",
  "rgba(255,255,255,.92)",
  ".home-stat-value colour",
);

// The desktop media query put the display size back at 900px and up. The
// ribbon is a legend at every width, not a headline on a wide screen.
const wideRule = `@media (min-width: 900px) {
  .home-stat-value { font-size: var(--text-display); }
}`;
if (src.includes(wideRule)) {
  src = src.replace(wideRule, "");
  edits.push(".home-stat-value at 900px — the display size removed");
} else {
  edits.push(".home-stat-value at 900px — already without the display size");
}

/* ══════════════════════════════════════════════════════════════════════
   2. THE CITY PAGE CARRIED TWO DISPLAY STATEMENTS
   ══════════════════════════════════════════════════════════════════════ */

// The city photo's caption and the page's h1 were BOTH at the display
// size, both reading the city's name. §11.7 gives the display size to
// ONE statement per page. The photo's caption is a caption: it belongs
// at body size, over the photograph, where the h1 owns the statement.
setDecl(
  ".city-hero-photo-title",
  "font-size",
  "var(--text-body)",
  ".city-hero-photo-title font-size",
);

/* ══════════════════════════════════════════════════════════════════════
   3. THE FALLBACK LITERALS — one source of truth for a size
   ══════════════════════════════════════════════════════════════════════ */

// var(--text-micro, .68rem) is a second, silent source for a size: it
// says 10.9px where the token says 11.5px, and it only shows up if the
// token is ever removed. A law with a spare number attached to it is
// not a law.
const FALLBACKS = [
  "var(--text-display, 2rem)", "var(--text-display,2rem)",
  "var(--text-body, .875rem)", "var(--text-body,.875rem)",
  "var(--text-micro, .68rem)", "var(--text-micro,.68rem)",
  "var(--text-micro, .72rem)", "var(--text-micro,.72rem)",
  "var(--text-body, 0.875rem)", "var(--text-display, 2.0rem)",
];
for (const fb of FALLBACKS) {
  const bare = fb.replace(/var\(--(text-[a-z]+).*/, "var(--$1)");
  if (src.includes(fb)) {
    src = src.split(fb).join(bare);
    edits.push(`${fb} — the fallback literal removed`);
  }
}

fs.writeFileSync(CSS, src);

/* ══════════════════════════════════════════════════════════════════════
   3. THE RIBBON'S CELLS — the two the hero already said are removed
   ══════════════════════════════════════════════════════════════════════ */

let home = fs.readFileSync(HOME, "utf8");

const DUPLICATE_CELLS = [
  // Cities indexed — the hero already states 118 CITIES, 40 pixels above.
  `          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "Cities indexed", th: "เมืองในดัชนี", zh: "入选城市" })}</span>
            <span className="home-stat-value">{stats.total}</span>
          </div>
`,
  // depa-certified — the hero already states 37 DEPA-CERTIFIED.
  `          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "depa-certified", th: "ได้รับการรับรองจาก depa", zh: "depa 认证" })}</span>
            <span className="home-stat-value">{stats.certified}</span>
          </div>
`,
];

let removed = 0;
for (const cell of DUPLICATE_CELLS) {
  if (home.includes(cell)) {
    home = home.replace(cell, "");
    removed++;
    edits.push("home ribbon — removed a cell the hero already states");
  }
}

if (removed) {
  // The strip is a deliberate horizontal scroller with a scroll
  // signifier. With four cells instead of six it needs less width, and
  // the comment that recorded the old width must record the new one.
  home = home.replace(
    "/* The ribbon stays a scroll-snap strip at EVERY width. With labels on the\n * micro token the six cells need ~1340px of intrinsic width — more than the",
    "/* The ribbon stays a scroll-snap strip at EVERY width. With labels on the\n * micro token the four cells need ~900px of intrinsic width — more than the",
  );
}

fs.writeFileSync(HOME, home);

/* ══════════════════════════════════════════════════════════════════════
   4. THE VERDICT
   ══════════════════════════════════════════════════════════════════════ */
const open = (src.match(/\{/g) || []).length;
const close = (src.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`BRACES DO NOT BALANCE: ${open} open, ${close} close.`);
  process.exit(1);
}
const cells = (home.match(/home-stat-cell"/g) || []).length;
console.log(`stylesheet edits: ${edits.length}`);
for (const e of edits) console.log("  ·", e);
console.log(`\nhome ribbon cells: ${cells}`);
console.log(`braces balance: ${open} / ${close}`);
