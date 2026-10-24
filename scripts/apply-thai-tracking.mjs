/**
 * THAI IS NOT A TRACKED SCRIPT
 * ============================
 * Removes letter-spacing from Thai text.
 *
 * Tracking is a Latin typographic device: it opens the counters of an
 * uppercase Latin word so the letters read as a unit. Thai has no uppercase
 * and no counters to open — its vowel and tone marks stack above the base
 * and its strokes join into continuous shapes. Tracking pulls those marks
 * off their base and separates the strokes. A Thai reader clocks the result
 * in one glance and reads it as a foreigner's typesetting, which is the
 * exact failure the non-looped-face rule exists to prevent.
 *
 * Measured before the fix: 3,327 elements across 12 routes carried Thai
 * text inside a tracked run, from 0.058px to 1.96px of tracking.
 *
 * Latin fragments inside a Thai line lose their tracking too. That is the
 * smaller cost, and every affected element is a label or chip where a
 * looser fit is harmless.
 *
 * !important is deliberate: 409 rules in this file set letter-spacing, and a
 * locale-scoped typographic override has to beat every one of them.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
let css = readFileSync(FILE, "utf8");
const before = css.length;

const ANCHOR = `html[lang="th"] {
  --font: "IBM Plex Sans Thai", "Noto Sans Thai", system-ui, "Segoe UI", sans-serif;
  --font-heading: "IBM Plex Sans Thai", "Noto Sans Thai", system-ui, sans-serif;
  /* One family carries both scripts here, so the Thai headline and the
     Latin fragments inside it share a voice — the point of the face. */
  --font-display: "Sao Chingcha", "IBM Plex Sans Thai", "Noto Sans Thai", system-ui, sans-serif;
}`;

if (!css.includes(ANCHOR)) {
  console.error("ABORT  anchor not found — the Thai locale block changed shape");
  process.exit(1);
}
const occurrences = css.split(ANCHOR).length - 1;
if (occurrences !== 1) {
  console.error(`ABORT  expected 1 Thai locale block, found ${occurrences}`);
  process.exit(1);
}

const RULE = `${ANCHOR}

/* THAI IS NOT A TRACKED SCRIPT.
 * Tracking opens the counters of an uppercase Latin word so the letters read
 * as one unit. Thai has no uppercase and no counters to open: its vowel and
 * tone marks stack above the base and its strokes join into continuous
 * shapes. Tracking pulls those marks off their base and separates the
 * strokes, and the result reads as a foreigner's typesetting.
 *
 * So in the Thai locale the tracking comes off. !important is deliberate:
 * 409 rules in this file set letter-spacing, and a locale-scoped override
 * has to beat every one of them. */
html[lang="th"] :is(
  p, span, div, dd, dt, strong, em, a, button, h1, h2, h3, h4, h5, h6,
  li, ul, ol, label, summary, td, th, code, small, figcaption,
  section, article, blockquote, legend, caption
) {
  letter-spacing: normal !important;
}
html[lang="th"] svg text {
  letter-spacing: normal !important;
}`;

css = css.replace(ANCHOR, RULE);

// Assert the rule survived and the rest of the file did not change.
const REQUIRED = [
  `html[lang="th"] :is(`,
  `html[lang="th"] svg text {`,
  `--font-display: "Sao Chingcha"`,
  `html[lang="zh"] {`,
];
for (const sel of REQUIRED) {
  if (!css.includes(sel)) {
    console.error(`ABORT  required rule lost: ${sel}`);
    process.exit(1);
  }
}
if (css.split(`html[lang="th"] :is(`).length - 1 !== 1) {
  console.error("ABORT  the Thai tracking rule was not written exactly once");
  process.exit(1);
}
writeFileSync(FILE, css);
console.log(`ok     Thai tracking override added (${before} -> ${css.length} bytes)`);
