/**
 * INLINE TYPE NORMALISATION
 * =========================
 * Same band rule as scripts/normalize-type-scale.mjs, applied to the
 * inline `style={{ fontSize: … }}` declarations in src/*.tsx, which are
 * invisible to a stylesheet scan and were the last source of off-scale
 * text on the rendered pages.
 *
 *   resolved px >= 20   -> var(--text-display)
 *   13 <= resolved < 20 -> var(--text-body)
 *   resolved < 13       -> var(--text-micro)
 *
 * SVG text attributes (fontSize="9" on a <text> inside a chart) are NOT
 * touched: they are diagram labels measured in user units and scaled by
 * the viewBox, not page typography. Their legibility is a diagram
 * question, not a type-scale question.
 *
 * Run: node scripts/normalize-inline-type.mjs
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src");
const REM = r => Math.round(parseFloat(r) * 100) / 100 * 16;
const PX = r => Math.round(parseFloat(r) * 100) / 100;

function ceilingPx(expr) {
  const e = expr.trim();
  const clamp = e.match(/^clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)$/);
  if (clamp) {
    const numeric = clamp
      .slice(1, 4)
      .map(p => p.trim())
      .filter(p => !p.startsWith("var("))
      .map(p => (p.endsWith("rem") ? REM(p) : p.endsWith("px") ? PX(p) : null))
      .filter(v => v != null);
    return numeric.length ? Math.max(...numeric) : null;
  }
  if (e.startsWith("var(")) return null;
  if (e.endsWith("rem")) return REM(e);
  if (e.endsWith("px")) return PX(e);
  return null;
}

function tokenFor(px) {
  if (px == null) return null;
  if (px >= 20) return "var(--text-display)";
  if (px >= 13) return "var(--text-body)";
  return "var(--text-micro)";
}

let changed = 0;
const report = new Map();

/** A heading's size is decided by its LEVEL, not by the value it carried. */
const LEVEL_TOKEN = { h1: "var(--text-display)", h2: "var(--text-body)", h3: "var(--text-body)", h4: "var(--text-micro)" };

for (const file of fs.readdirSync(SRC).filter(f => f.endsWith(".tsx"))) {
  const full = path.join(SRC, file);
  const src = fs.readFileSync(full, "utf8");
  let out = src;

  // 1. headings: the level decides, so an <h2> can never carry the display
  //    token even if the value it was written with was a big one.
  out = out.replace(/(<h[1-4]\b[^>]*?fontSize:\s*")([^"]+)(")/g, (m, head, expr, tail) => {
    const tag = m.match(/<h([1-4])\b/)[1];
    const want = LEVEL_TOKEN["h" + tag];
    if (expr.trim() === want) return m;
    changed++;
    report.set(`<h${tag}> ${expr.trim()}`, want);
    return `${head}${want}${tail}`;
  });

  // 2. everything else: the band rule.
  out = out.replace(/fontSize:\s*"([^"]+)"/g, (m, expr) => {
    const e = expr.trim();
    if (e.startsWith("var(--text-")) return m;
    const tok = tokenFor(ceilingPx(e));
    if (!tok) return m;
    changed++;
    report.set(e, tok);
    return `fontSize: "${tok}"`;
  });
  if (out !== src) fs.writeFileSync(full, out);
}

console.log(`inline fontSize declarations rewritten: ${changed}`);
for (const [from, to] of [...report.entries()].sort()) {
  console.log(`  ${from.padEnd(42)} -> ${to}`);
}
