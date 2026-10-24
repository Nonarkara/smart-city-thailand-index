/**
 * THE PHUKET HERO SCORE CARD — IS THE LABEL TOUCHING THE NUMBER?
 * =============================================================
 * The sweep reports the "Curated score" label and the "72.6" numeral
 * overlapping by 67 × 5px of ink at both 390 and 1440. Five pixels is
 * small enough to be a line-box artefact and large enough to be real.
 *
 * This measures the exact ink rects of the two, with and without the
 * grid gap, and screenshots the card so the question can be answered by
 * looking rather than by arguing about thresholds.
 *
 * Run: node scripts/audit/probe-hero-score.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
mkdirSync("/tmp/hero-probe", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/city/phuket", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(400);

const data = await page.evaluate(() => {
  const card = document.querySelector(".city-hero-photo-score-card");
  const label = document.querySelector(".city-hero-photo-score-label");
  const score = document.querySelector(".city-hero-photo-score");
  const note = document.querySelector(".city-hero-photo-score-note");

  const ink = (el) => {
    if (!el) return null;
    const range = document.createRange();
    const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 0.5 && r.height > 0.5) out.push(r);
    }
    return out.map(r => ({ l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }));
  };

  const cs = card ? getComputedStyle(card) : null;
  return {
    cardBox: card ? (() => { const b = card.getBoundingClientRect(); return { t: Math.round(b.top), l: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) }; })() : null,
    gridGap: cs?.rowGap,
    display: cs?.display,
    labelText: label?.textContent,
    labelInk: ink(label),
    scoreText: score?.textContent,
    scoreInk: ink(score),
    noteInk: ink(note),
    labelFont: label ? getComputedStyle(label).font : null,
    scoreFont: score ? getComputedStyle(score).font : null,
  };
});

console.log(`card box: ${JSON.stringify(data.cardBox)}  display=${data.display} rowGap=${data.gridGap}`);
console.log(`label "${data.labelText}" ink=${JSON.stringify(data.labelInk)}`);
console.log(`score "${data.scoreText}" ink=${JSON.stringify(data.scoreInk)}`);
console.log(`label font: ${data.labelFont}`);
console.log(`score font: ${data.scoreFont}`);

const a = data.labelInk?.[0];
const b = data.scoreInk?.[0];
if (a && b) {
  const oy = Math.min(a.t + a.h, b.t + b.h) - Math.max(a.t, b.t);
  const ox = Math.min(a.l + a.w, b.l + b.w) - Math.max(a.l, b.l);
  console.log(`\nlabel bottom = ${a.t + a.h}, score top = ${b.t}  → vertical gap ${b.t - (a.t + a.h)}px (ink overlap ${oy}px)`);
  console.log(`horizontal overlap ${ox}px`);
}

// Screenshot the card.
const card = await page.$(".city-hero-photo-score-card");
if (card) {
  const box = await card.boundingBox();
  if (box) {
    await page.screenshot({
      path: "/tmp/hero-probe/score-card.png",
      clip: { x: Math.max(0, box.x - 12), y: Math.max(0, box.y - 12), width: box.width + 24, height: box.height + 24 },
    });
    console.log("\nscreenshot: /tmp/hero-probe/score-card.png");
  }
}

await ctx.close();
await browser.close();
