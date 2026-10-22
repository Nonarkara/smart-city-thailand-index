/**
 * THE HERO EYEBROW'S COLOUR
 * =========================
 * MEASURED on the live site: the hero eyebrow rendered #9a5d0a — the
 * light theme's --gold-ink, a token chosen for text on a WHITE page.
 * The hero's eyebrow sits on a photographic scrim that is dark in every
 * theme, so the token was wrong for the surface it was on.
 *
 *   #9a5d0a over the scrimmed photograph: 2.80:1   FAIL
 *
 * The token itself cannot be rescued by more scrim: at 4.5:1 it would
 * need a background luminance of -0.007, which is below black. Even on
 * pure black it reaches only 3.89:1. So the colour has to change, not
 * the darkness.
 *
 * The hero now takes Wada Yellow Orange (#f99d1b) — the same chord the
 * rest of the brand uses on dark grounds — and the wordplay's "Sma"
 * inherits it instead of carrying a second, near-identical amber. The
 * meaningful contrast in the wordplay (amber "Sma" against white
 * "SCITI") is untouched.
 *
 *   #f99d1b over the scrimmed photograph: 7.05:1   PASS
 *
 * The gradient hero (.hero-gradient) is a solid depa-blue field and
 * keeps its own bright yellow: that rule is more specific, so it still
 * wins.
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

// The hero's eyebrow sits on a dark photographic scrim in EVERY theme.
// --gold-ink resolves to the light-theme token on a light page (#9a5d0a,
// 2.80:1 on the scrim); the hero needs the dark-ground amber.
css = once(
  css,
  `.cinematic-hero-title,
.cinematic-hero-why,
.cinematic-hero-stats,
.cinematic-hero-eyebrow {
  text-shadow: 0 2px 16px rgba(0,0,0,.45);
}`,
  `.cinematic-hero-title,
.cinematic-hero-why,
.cinematic-hero-stats,
.cinematic-hero-eyebrow {
  text-shadow: 0 2px 16px rgba(0,0,0,.45);
}
/* The eyebrow sits on a photographic scrim that is dark in EVERY theme.
   --gold-ink resolves to the light-theme token on a light page
   (#9a5d0a) — 2.80:1 against the scrim, and it cannot reach 4.5:1 on
   any ground at all. The hero takes the dark-ground amber. The
   .hero-gradient rule is more specific and keeps its own yellow. */
.cinematic-hero-eyebrow { color: #f99d1b; }`,
  "hero eyebrow: Wada Yellow Orange on a dark ground"
);

// "Sma" inherits the eyebrow's amber rather than carrying a second
// near-identical one. The meaningful contrast in the wordplay — amber
// "Sma" against white "SCITI" — is untouched.
css = once(
  css,
  `.cinematic-hero-wordplay-sma { color: var(--amber, #f59e0b); font-weight: 700; }`,
  `.cinematic-hero-wordplay-sma { font-weight: 700; }`,
  "wordplay 'Sma' inherits the eyebrow's amber"
);

const bal = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
if (bal !== 0) throw new Error(`brace imbalance: ${bal}`);

writeFileSync(FILE, css);
console.log(`  ${FILE} written`);
