/**
 * THE NEWS CARDS — DO THEY REALLY OVERLAP?
 * =======================================
 * The corrected sweep reports the news card's summary paragraph
 * overlapping its source line, its date, and — on the homepage — the
 * density strip below the grid. Fifty-three of them on the homepage.
 *
 * That is either a real layout fault (the card's content spilling out
 * of the card and over the next section) or another instrument fault.
 * A screenshot settles it; the numbers alone do not.
 *
 * Run: node scripts/audit/probe-news-cards.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
mkdirSync("/tmp/news-probe", { recursive: true });

const browser = await chromium.launch();

for (const [label, width, height, route] of [
  ["home-390", 390, 844, "/"],
  ["home-1440", 1440, 1000, "/"],
  ["rankings-390", 390, 844, "/rankings"],
]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(400);

  // Scroll the first news card into view and photograph it.
  const box = await page.evaluate(() => {
    const card = document.querySelector(".news-card");
    if (!card) return null;
    const b = card.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });

  if (box) {
    await page.evaluate(() => {
      const card = document.querySelector(".news-card");
      if (card) card.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(500);
    const card = await page.$(".news-card");
    if (card) {
      const b = await card.boundingBox();
      if (b && b.y > 0 && b.y + b.height < height) {
        await page.screenshot({
          path: `/tmp/news-probe/${label}-card.png`,
          clip: { x: Math.max(0, b.x - 10), y: Math.max(0, b.y - 10), width: Math.min(width, b.width + 20), height: Math.min(height - Math.max(0, b.y - 10), b.height + 20) },
        });
      } else {
        await page.screenshot({ path: `/tmp/news-probe/${label}-card.png` });
      }
    }

    // Measure the pieces of that card.
    const parts = await page.evaluate(() => {
      const card = document.querySelector(".news-card");
      if (!card) return null;
      const rel = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const cb = card.getBoundingClientRect();
        return { top: Math.round(b.top - cb.top), bottom: Math.round(b.bottom - cb.top), h: Math.round(b.height), text: (el.textContent || "").trim().slice(0, 40) };
      };
      const cs = getComputedStyle(card);
      return {
        cardHeight: Math.round(card.getBoundingClientRect().height),
        display: cs.display,
        summary: rel(card.querySelector(".news-card-summary")),
        meta: rel(card.querySelector(".news-card-meta")),
        source: rel(card.querySelector(".news-card-source")),
        date: rel(card.querySelector(".news-card-date")),
        title: rel(card.querySelector(".news-card-title")),
        tag: rel(card.querySelector(".news-card-tag")),
        summaryClamp: card.querySelector(".news-card-summary") ? getComputedStyle(card.querySelector(".news-card-summary")).webkitLineClamp : null,
        summaryOverflow: card.querySelector(".news-card-summary") ? getComputedStyle(card.querySelector(".news-card-summary")).overflow : null,
      };
    });
    console.log(`\n${label}  (${route})`);
    console.log(`  card height ${parts.cardHeight}px  display=${parts.display}`);
    console.log(`  title  ${JSON.stringify(parts.title)}`);
    console.log(`  summary${JSON.stringify(parts.summary)}  clamp=${parts.summaryClamp} overflow=${parts.summaryOverflow}`);
    console.log(`  meta   ${JSON.stringify(parts.meta)}`);
    console.log(`  source ${JSON.stringify(parts.source)}`);
    console.log(`  date   ${JSON.stringify(parts.date)}`);
    console.log(`  tag    ${JSON.stringify(parts.tag)}`);
    if (parts.summary && parts.source) {
      console.log(`  --> summary bottom ${parts.summary.bottom} vs source top ${parts.source.top} → ${parts.source.top < parts.summary.bottom ? "OVERLAP " + (parts.summary.bottom - parts.source.top) + "px" : "clear"}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log("\nscreenshots: /tmp/news-probe/");
