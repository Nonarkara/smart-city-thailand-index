/**
 * DO THE NEWS CARDS REALLY OVERLAP THE DENSITY STRIP?
 * ==================================================
 * The sweep reports a news card's summary paragraph painted over the
 * density strip's labels and values — 26 pairs on the homepage.
 *
 * The suspect is `.news-section { content-visibility: auto; contain-
 * intrinsic-size: 0 300px; }`: while the section is off screen the
 * browser lays it out at a 300px placeholder, so the elements inside
 * report positions the real content does not occupy. Whether that is a
 * page defect (content jumping when the section renders) or an
 * instrument artefact (the sweep measured the placeholder, not the
 * page) is settled by looking at the rendered page.
 *
 * Run: node scripts/audit/probe-news-density.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
mkdirSync("/tmp/nd-probe", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: "*, *::before, *::array { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(400);

const before = await page.evaluate(() => {
  const section = document.querySelector(".news-section");
  const density = document.querySelector(".data-density-section, .density-strip, [class*='density']");
  const grid = document.querySelector(".news-grid");
  const card = document.querySelector(".news-card");
  const abs = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), h: Math.round(b.height) };
  };
  return {
    newsSection: abs(section),
    newsGrid: abs(grid),
    firstCard: abs(card),
    density: abs(density),
    densityCls: density ? String(density.className).slice(0, 60) : null,
    scrollHeight: document.documentElement.scrollHeight,
  };
});
console.log("AT SCROLL 0 (news section off screen, placeholder layout):");
console.log(`  news section  ${JSON.stringify(before.newsSection)}`);
console.log(`  news grid     ${JSON.stringify(before.newsGrid)}`);
console.log(`  first card    ${JSON.stringify(before.firstCard)}`);
console.log(`  density strip ${JSON.stringify(before.density)}  (${before.densityCls})`);

// Now scroll the news section into view so it renders for real.
await page.evaluate(() => document.querySelector(".news-section")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(900);

const after = await page.evaluate(() => {
  const abs = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), h: Math.round(b.height) };
  };
  const section = document.querySelector(".news-section");
  const grid = document.querySelector(".news-grid");
  const card = document.querySelector(".news-card");
  const density = document.querySelector(".data-density-section, .density-strip, [class*='density']");
  const summary = card?.querySelector(".news-card-summary");
  const source = card?.querySelector(".news-card-source");
  // Do any two of these actually overlap in the real layout?
  const hits = [];
  const els = [...document.querySelectorAll(".news-card-summary, .news-card-title, .news-card-source, .news-card-date, .density-label, .density-value, .density-sources-label, .news-card-tag")];
  for (let i = 0; i < els.length; i++) {
    for (let j = i + 1; j < els.length; j++) {
      const a = els[i].getBoundingClientRect();
      const b = els[j].getBoundingClientRect();
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 1) {
        hits.push(`${els[i].className || els[i].tagName} × ${els[j].className || els[j].tagName} ${Math.round(ox)}×${Math.round(oy)}`);
      }
    }
  }
  return {
    newsSection: abs(section),
    newsGrid: abs(grid),
    firstCard: abs(card),
    density: abs(density),
    summary: abs(summary),
    source: abs(source),
    hits: hits.slice(0, 8),
    hitCount: hits.length,
    scrollHeight: document.documentElement.scrollHeight,
  };
});
console.log("\nAFTER SCROLLING THE SECTION INTO VIEW (real layout):");
console.log(`  news section  ${JSON.stringify(after.newsSection)}`);
console.log(`  news grid     ${JSON.stringify(after.newsGrid)}`);
console.log(`  first card    ${JSON.stringify(after.firstCard)}`);
console.log(`  density strip ${JSON.stringify(after.density)}`);
console.log(`  summary       ${JSON.stringify(after.summary)}`);
console.log(`  source        ${JSON.stringify(after.source)}`);
console.log(`  page height   ${before.scrollHeight} → ${after.scrollHeight}`);
console.log(`\n  REAL overlapping pairs on screen: ${after.hitCount}`);
for (const h of after.hits) console.log(`    ${h}`);

await page.screenshot({ path: "/tmp/nd-probe/news-section.png" });
console.log("\nscreenshot: /tmp/nd-probe/news-section.png");

await ctx.close();
await browser.close();
