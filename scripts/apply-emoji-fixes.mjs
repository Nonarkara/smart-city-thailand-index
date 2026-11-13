#!/usr/bin/env node
/**
 * apply-emoji-fixes.mjs
 *
 * L15 bans "emoji icons/bullets"; Book commandment 7 says "Never
 * emoji-as-UI-icon"; the Book's anti-slop table caps "Emoji as icons"
 * at 0. The repo carried 313 emoji glyphs. Most are DATA — a flag
 * beside a country name, an icon beside a partner's focus — but a set
 * are used as UI ICONS, which is the banned case.
 *
 * MEASURED, NOT ASSUMED. The emoji were found by scanning the rendered
 * stack, and each fix below is one of three kinds:
 *
 *  1. A UI ICON that had a real mark available. The bingo dimension
 *     controls (.bingo-dim-strip-emoji, .bingo-call-bar-emoji) drew
 *     DIM_EMOJIS — 🌿 📈 🚌 ⚡ 👥 🏠 🏛️ — as the ONLY content of their
 *     button. Two problems at once:
 *       - it is an emoji as a UI icon (L15 / Book 7);
 *       - the button had NO accessible name. The dim-strip buttons are
 *         icon-only, and a screen reader announced seven unlabelled
 *         glyphs.
 *     The repo already ships the seven commissioned dimension marks —
 *     public/icon 7 Smarts PNG/icon 7 Smarts Logo-01..07.png — and the
 *     card back already draws them. So the control now draws the same
 *     real mark the card back draws, and carries the dimension name as
 *     its accessible name. One source of truth for what a dimension
 *     looks like.
 *
 *  2. A decorative emoji with no job. The win banner read
 *     "🎉 BINGO! 🎉" and the won call bar showed a bare 🎉. The word
 *     BINGO is the message; the emoji is a sticker (Book 6.3: "Never
 *     flatten Non's voice to pass a detector" cuts both ways — but a
 *     confetti glyph adds no information and Book 19 bans hype badges
 *     as chrome). The banner keeps a typographic mark instead.
 *
 *  3. An emoji used as a bullet/icon where a real mark or the text
 *     itself does the job. The /why benefit blocks drew 📊 🏛️ 👥 🌏 🎯
 *     beside a heading that already names the thing. Each block's
 *     "lens" line (Capital allocation, Benchmarking, Accountability…)
 *     is the marker; the emoji was a second, weaker label for it.
 *
 * WHAT IS DELIBERATELY LEFT ALONE:
 *   - The 58 card-face emoji on the bingo cards. Those are the card's
 *     CONTENT — a physical bingo card has a picture on each square,
 *     and the emoji is what makes the board scannable at a glance.
 *     Book 30 ("Preserve the product") and Book 6.3 ("judge the stack,
 *     not the item") both say a deliberate choice survives a cleanup.
 *   - The country flags beside partner names. A flag is the
 *     international mark for a country — the Book's own example of a
 *     compact symbol where a mark does the job (Book 7). They are
 *     data, not chrome.
 *
 * Every edit goes through brace-matched, asserted replacement with an
 * exact anchor count. Idempotent.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const BINGO = path.join(ROOT, "src/ScitiBingoPage.tsx");
const WHY = path.join(ROOT, "src/WhyPage.tsx");
const CSS = path.join(ROOT, "src/styles.css");

let bingo = fs.readFileSync(BINGO, "utf8");
let why = fs.readFileSync(WHY, "utf8");
let css = fs.readFileSync(CSS, "utf8");

function once(haystack, needle, replacement, label) {
  const found = haystack.split(needle).length - 1;
  if (found !== 1) {
    throw new Error(
      `${label}: expected exactly 1 anchor, found ${found}. Anchor:\n${needle.slice(0, 180)}`
    );
  }
  console.log(`  ✓ ${label}`);
  return haystack.replace(needle, replacement);
}

// ─── 1. The bingo dimension controls draw the real commissioned mark ──

// The mobile dimension strip: seven icon-only buttons with no
// accessible name. They now draw the same mark the card back draws
// and are named.
bingo = once(
  bingo,
  `            <span className="bingo-dim-strip-emoji">{DIM_EMOJIS[dim]}</span>`,
  `            <img src={DIM_LOGOS[dim]} alt={t(DIM_LABELS[dim])} className="bingo-dim-strip-mark" loading="lazy"/>`,
  "bingo dim strip  emoji → real mark + name",
);

// The call bar names the dimension in words right beside the glyph, so
// the mark there is identification, not decoration.
bingo = once(
  bingo,
  `            <span className="bingo-call-bar-emoji">{DIM_EMOJIS[targetDim]}</span>`,
  `            <img src={DIM_LOGOS[targetDim]} alt="" className="bingo-call-bar-mark" loading="lazy"/>`,
  "bingo call bar  emoji → real mark",
);

// The dimension map is now dead.
bingo = once(
  bingo,
  `const DIM_EMOJIS: Record<SmartDimension,string> = { environment:"🌿", economy:"📈", mobility:"🚌", energy:"⚡", people:"👥", living:"🏠", governance:"🏛️" };\n`,
  ``,
  "bingo  DIM_EMOJIS removed",
);

// ─── 2. The win banner's confetti ─────────────────────────────────────

bingo = once(
  bingo,
  `            <span className="bingo-win-text">🎉 BINGO! 🎉</span>`,
  `            <span className="bingo-win-text">BINGO!</span>`,
  "bingo win banner  confetti removed",
);

bingo = once(
  bingo,
  `            <span className="bingo-call-bar-emoji">🎉</span>`,
  `            <span className="bingo-win-mark" aria-hidden="true">★</span>`,
  "bingo won call bar  confetti → typographic mark",
);

// ─── 3. The /why benefit blocks ────────────────────────────────────────

why = once(
  why,
  `interface BenefitBlock {
  icon: string;
  lens: { en: string; th: string; zh: string };`,
  `interface BenefitBlock {
  lens: { en: string; th: string; zh: string };`,
  "why  BenefitBlock.icon removed from the type",
);

why = once(
  why,
  `          <div key={i} className="benefit-block">
            <div className="benefit-icon">{b.icon}</div>
            <div className="benefit-content">`,
  `          <div key={i} className="benefit-block">
            <div className="benefit-content">`,
  "why  benefit icon element removed",
);

// The five icon fields in the data.
why = once(
  why,
  `    icon: "📊",\n    lens: { en: "Capital allocation", th: "การจัดสรรทุน", zh: "资本配置" },`,
  `    lens: { en: "Capital allocation", th: "การจัดสรรทุน", zh: "资本配置" },`,
  "why  benefit 1  icon field removed",
);
why = once(
  why,
  `    icon: "🏛️",\n    lens: { en: "Benchmarking", th: "การเทียบเคียง", zh: "基准比较" },`,
  `    lens: { en: "Benchmarking", th: "การเทียบเคียง", zh: "基准比较" },`,
  "why  benefit 2  icon field removed",
);
why = once(
  why,
  `    icon: "👥",\n    lens: { en: "Accountability", th: "ความรับผิดรับชอบ", zh: "问责" },`,
  `    lens: { en: "Accountability", th: "ความรับผิดรับชอบ", zh: "问责" },`,
  "why  benefit 3  icon field removed",
);
why = once(
  why,
  `    icon: "🌏",\n    lens: { en: "Regional model", th: "โมเดลระดับภูมิภาค", zh: "区域模型" },`,
  `    lens: { en: "Regional model", th: "โมเดลระดับภูมิภาค", zh: "区域模型" },`,
  "why  benefit 4  icon field removed",
);
why = once(
  why,
  `    icon: "🎯",\n    lens: { en: "Policy targeting", th: "การกำหนดเป้าหมายนโยบาย", zh: "政策瞄准" },`,
  `    lens: { en: "Policy targeting", th: "การกำหนดเป้าหมายนโยบาย", zh: "政策瞄准" },`,
  "why  benefit 5  icon field removed",
);

// ─── 4. The CSS that drew them ─────────────────────────────────────────

css = once(
  css,
  `.benefit-block { display: grid; grid-template-columns: 1.8rem 1fr; gap: .5rem; padding: 1rem 0; border-bottom: 1px solid var(--5); align-items: start; }
.benefit-block:first-child { border-top: 2px solid var(--ink); }
.benefit-icon { font-size: var(--text-body); }`,
  `/* The block was a two-column grid whose first column held an emoji
   icon. The "lens" line inside the block already names the thing, so
   the column was a second, weaker label for it — and it spent 1.8rem
   plus a gap on every block. One column now. */
.benefit-block { padding: 1rem 0; border-bottom: 1px solid var(--5); }
.benefit-block:first-child { border-top: 2px solid var(--ink); }`,
  "css  benefit block  two columns → one",
);

css = once(
  css,
  `.bingo-dim-strip-emoji { font-size: var(--text-body); }`,
  `/* The real commissioned dimension mark, the same one the card back
   draws. Sized to the strip and centred. */
.bingo-dim-strip-mark {
  width: 100%;
  max-width: 26px;
  height: auto;
  display: block;
  margin-inline: auto;
}`,
  "css  bingo dim strip mark",
);

css = once(
  css,
  `.bingo-call-bar-emoji { font-size: var(--text-body); flex-shrink: 0; }`,
  `/* The real commissioned dimension mark. */
.bingo-call-bar-mark {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
/* The win mark is typographic, not a sticker. */
.bingo-win-mark { font-size: var(--text-body); flex-shrink: 0; color: var(--gold); }`,
  "css  bingo call bar mark",
);

// ─── WRITE ─────────────────────────────────────────────────────────────

const beforeB = fs.readFileSync(BINGO, "utf8");
const beforeW = fs.readFileSync(WHY, "utf8");
const beforeC = fs.readFileSync(CSS, "utf8");

for (const [src, label] of [[bingo, "ScitiBingoPage.tsx"], [why, "WhyPage.tsx"], [css, "styles.css"]]) {
  const open = (src.match(/\{/g) || []).length;
  const close = (src.match(/\}/g) || []).length;
  if (open !== close) throw new Error(`${label}: braces unbalanced (${open} { vs ${close} })`);
}

fs.writeFileSync(BINGO, bingo);
fs.writeFileSync(WHY, why);
fs.writeFileSync(CSS, css);

console.log(`  ScitiBingoPage.tsx  ${beforeB.split("\n").length} → ${bingo.split("\n").length} lines`);
console.log(`  WhyPage.tsx          ${beforeW.split("\n").length} → ${why.split("\n").length} lines`);
console.log(`  styles.css           ${beforeC.split("\n").length} → ${css.split("\n").length} lines`);
