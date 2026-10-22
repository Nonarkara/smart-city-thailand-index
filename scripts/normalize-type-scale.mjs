/**
 * TYPE NORMALISATION PASS
 * =======================
 * Rewrites every font-size in src/styles.css onto the three canonical
 * tokens, per §11.7 (a page may have at most three distinct text sizes:
 * 32 display, 14 body, 11 micro).
 *
 * BAND RULE
 *   resolved px >= 20   -> var(--text-display)   (32px)
 *   13 <= resolved < 20 -> var(--text-body)      (14px)
 *   resolved < 13       -> var(--text-micro)     (11px)
 *
 * The band is applied to the CEILING of a clamp, because that is the
 * largest the rule can ever be. Two clamps are exempt and are named below
 * with their reason: one is a long-form body-copy rule that must stay in
 * the body tier, and one is a decorative quotation glyph that is not text
 * at all.
 *
 * Run: node scripts/normalize-type-scale.mjs
 */
import fs from "node:fs";
import path from "node:path";

const CSS = path.resolve("src/styles.css");
const src = fs.readFileSync(CSS, "utf8");

/** Rules that must NOT be banded — each with its reason. */
const EXEMPT = [
  // Long-form body copy. The band would make a 20px reading size 32px.
  { needle: "clamp(1rem, 2.5vw, 1.25rem)", to: "var(--text-body)" },
  // A decorative dropped quotation mark in ::before. It is an ornament,
  // not readable text, and it carries no text node.
  { needle: "font: 800 8rem var(--font-heading)", to: null },
];

const PX = r => Math.round(parseFloat(r) * 100) / 100;
const REM = r => PX(r) * 16;

/** Resolve a font-size expression to its ceiling in px. */
function ceilingPx(expr) {
  const e = expr.trim();
  const clamp = e.match(/^clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)$/);
  if (clamp) {
    const parts = clamp.slice(1, 4).map(p => p.trim());
    // var() inside clamp: take the numeric bounds we know.
    const numeric = parts
      .map(p => (p.startsWith("var(") ? null : p))
      .filter(Boolean)
      .map(p => (p.endsWith("rem") ? REM(p) : p.endsWith("px") ? PX(p) : null))
      .filter(v => v != null);
    return numeric.length ? Math.max(...numeric) : null;
  }
  if (e.startsWith("var(")) return null; // already a token
  if (e.endsWith("rem")) return REM(e);
  if (e.endsWith("px")) return PX(e);
  if (e.endsWith("%")) return null;
  if (e.endsWith("em")) return null;
  return null;
}

function tokenFor(px) {
  if (px == null) return null;
  if (px >= 20) return "var(--text-display)";
  if (px >= 13) return "var(--text-body)";
  return "var(--text-micro)";
}

let changedFs = 0, changedShorthand = 0, skipped = 0;
const report = new Map();

/* ── 1. font-size: declarations ───────────────────────────────────────── */
let out = src.replace(/font-size:\s*([^;]+);/g, (full, expr) => {
  // `!important` rides along on the value — strip it, map the size, put it back.
  const important = /!important\s*$/.test(expr);
  const e = expr.replace(/!important\s*$/, "").trim();
  if (e.startsWith("var(--text-")) return full;
  let exemption = EXEMPT.find(x => x.needle === e);
  if (exemption) {
    if (exemption.to) { changedFs++; report.set(e, exemption.to); return `font-size: ${exemption.to};`; }
    skipped++;
    return full;
  }
  const tok = tokenFor(ceilingPx(e));
  if (!tok) { skipped++; return full; }
  changedFs++;
  report.set(e, tok);
  return `font-size: ${tok}${important ? " !important" : ""};`;
});

/* ── 2. literal sizes inside font: shorthands ─────────────────────────── */
out = out.replace(/font:\s*([^;]+);/g, (full, expr) => {
  let e = expr;
  let touched = false;
  // Replace a standalone size token (rem/px) with the mapped token.
  e = e.replace(/(^|[\s/])([\d.]+(?:rem|px))(?=[\s/]|$)/g, (m, pre, size) => {
    if (size === "8rem") return m; // the decorative quotation glyph
    const tok = tokenFor(size.endsWith("rem") ? REM(size) : PX(size));
    if (!tok) return m;
    touched = true;
    return `${pre}${tok}`;
  });
  // Replace a clamp() inside a shorthand with the mapped token.
  // Two traps, both hit: a var() nested inside the clamp breaks a [^)]+
  // pattern, and mutating the string WHILE it is being scanned makes the
  // scan offsets stale. So: collect the spans first, then splice.
  const spans = [];
  for (let i = 0; i < e.length; i++) {
    if (!e.startsWith("clamp(", i)) continue;
    let depth = 1, j = i + 5;
    while (j < e.length && depth) {
      if (e[j] === "(") depth++;
      else if (e[j] === ")") depth--;
      j++;
    }
    spans.push([i, j]);
    i = j - 1;
  }
  for (let k = spans.length - 1; k >= 0; k--) {
    const [a, b] = spans[k];
    const tok = tokenFor(ceilingPx(e.slice(a, b)));
    if (!tok) continue;
    e = e.slice(0, a) + tok + e.slice(b);
    touched = true;
  }
  if (!touched) return full;
  changedShorthand++;
  return `font: ${e};`;
});

fs.writeFileSync(CSS, out);

console.log(`font-size declarations rewritten: ${changedFs}`);
console.log(`font shorthands rewritten:         ${changedShorthand}`);
console.log(`exempt / skipped:                  ${skipped}`);
console.log("\nmapping applied:");
for (const [from, to] of [...report.entries()].sort()) {
  console.log(`  ${from.padEnd(40)} -> ${to}`);
}
