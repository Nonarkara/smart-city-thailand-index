/**
 * ONE FACT, ONE PLACE, ONE SIZE
 * ==============================
 * Three pages repeat the same numeral at display size in two places that
 * are close enough to be read together. Display size is a scarce
 * resource: it is a statement, and a statement repeated is noise.
 *
 * 1. /invest — the macro strip repeats "7–14%" and "$219B" from the
 *    World Bank CCDR panel further down the page. Worse, six of its
 *    eight cells are an em-dash standing for "source reconciliation
 *    pending" — six 32px holes in the page's hierarchy. The strip is a
 *    reference band, so its values drop to body size. The CCDR panel
 *    keeps display size: it is the page's actual finding.
 *
 * 2. /program — the three concept cards are numbered 1, 2, 3 and the
 *    Two-Five-Seven mnemonic below is numbered 2, 5, 7. Two bare "2"s at
 *    display size. The concept cards become 01 / 02 / 03, which is both
 *    distinct and the better way to write an ordered sequence.
 *
 * 3. /audit — a scope KPI reads "49" and the confidence panel below
 *    reads "49" for a different thing entirely. The confidence figure
 *    counts cities, so it says so: "49 cities". A number with its unit
 *    is not a duplicate of a bare number.
 *
 * Run: node scripts/apply-display-dedup.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

function editFile(path, fn) {
  const before = readFileSync(path, "utf8");
  const after = fn(before);
  if (after === before) {
    console.error(`FAIL: ${path} — nothing changed`);
    process.exit(1);
  }
  writeFileSync(path, after);
  console.log(`OK  ${path}  (${after.length - before.length >= 0 ? "+" : ""}${after.length - before.length} bytes)`);
  return after;
}

function replaceOnce(src, needle, replacement, label) {
  const parts = src.split(needle);
  if (parts.length !== 2) {
    console.error(`FAIL: ${label} — anchor found ${parts.length - 1} times, expected 1`);
    process.exit(1);
  }
  return parts.join(replacement);
}

// ── 1. /invest — the macro strip is a reference band, not a headline ──────
editFile("src/styles.css", (css) => {
  const anchor = `.invest-macro-value {
  font: 800 var(--text-display) var(--font-heading);
  letter-spacing: -.04em;
  color: var(--ink);
}`;
  const replacement = `/* Body size, not display. Six of the eight cells hold an em-dash
 * standing for "source reconciliation pending" — at display size that is
 * six holes in the page's hierarchy, and the two real figures were
 * repeated at display size again in the CCDR panel below. The strip is a
 * reference band; the CCDR panel keeps display size for the page's
 * actual finding. */
.invest-macro-value {
  font: 800 var(--text-body) var(--mono);
  letter-spacing: -.01em;
  color: var(--ink);
}`;
  return replaceOnce(css, anchor, replacement, "invest-macro-value");
});

// ── 2. /program — the concept sequence becomes 01 / 02 / 03 ───────────────
editFile("src/ProgramPage.tsx", (src) => {
  const a = `<span className="program-concept-num">1</span>`;
  const b = `<span className="program-concept-num">2</span>`;
  const c = `<span className="program-concept-num">3</span>`;
  for (const [needle, label] of [[a, "concept 1"], [b, "concept 2"], [c, "concept 3"]]) {
    if (!src.includes(needle)) {
      console.error(`FAIL: /program — ${label} anchor not found`);
      process.exit(1);
    }
  }
  let out = src;
  out = replaceOnce(out, a, `<span className="program-concept-num">01</span>`, "concept 1");
  out = replaceOnce(out, b, `<span className="program-concept-num">02</span>`, "concept 2");
  out = replaceOnce(out, c, `<span className="program-concept-num">03</span>`, "concept 3");
  return out;
});

// ── 3. /audit — the confidence figure says what it counts ─────────────────
editFile("src/AuditPage.tsx", (src) => {
  const anchor = `<div className="audit-domain-score-val">{row.value}</div>`;
  const replacement = `<div className="audit-domain-score-val">
                {row.value}
                <span className="audit-domain-score-unit">
                  {t({ en: "cities", th: "เมือง", zh: "座城市" })}
                </span>
              </div>`;
  return replaceOnce(src, anchor, replacement, "audit-domain-score-val");
});

// ── Assert: no selector or rule was lost ────────────────────────────────
const css = readFileSync("src/styles.css", "utf8");
for (const needle of [
  ".invest-macro-value {",
  "font: 800 var(--text-body) var(--mono);",
  ".chat-nav-btn {",
  "@media (max-width: 1279px) {",
]) {
  if (!css.includes(needle)) {
    console.error(`FAIL: css assertion failed — missing "${needle}"`);
    process.exit(1);
  }
}
const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`FAIL: css brace imbalance ${open}/${close}`);
  process.exit(1);
}
console.log(`OK  css braces balanced (${open}/${close})`);
