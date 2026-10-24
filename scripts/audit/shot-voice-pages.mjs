/**
 * THE HUMANIZED CITY, ON SCREEN
 * =============================
 * 68 cities used to print the same four paragraphs. The generated
 * context is now built from each province's own measured values. This
 * photographs the dossier of three of them — one with a lot of data,
 * one in the middle, and one with almost none — so the result can be
 * judged as a page rather than as a JSON field.
 *
 * Run: node scripts/audit/shot-voice-pages.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
const OUT = "/tmp/voice-pages";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["samut-sakhon", "/city/reg-samut-sakhon/"],
  ["lampang-pao", "/city/reg-lampang-pao/"],
  ["phayao", "/city/reg-phayao/"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

for (const [name, route] of PAGES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2200);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(400);

  // Scroll the profile/voice block into view.
  const target = await page.evaluate(() => {
    const el = document.querySelector(".city-profile-read, .city-dossier-card-body, .city-profile-row");
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height };
  });
  if (target) {
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 140)), target.y);
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });

  const prose = await page.evaluate(() => {
    const out = [];
    for (const sel of [".city-profile-read p", ".city-dossier-card-body p", ".city-profile-row-value"]) {
      for (const el of document.querySelectorAll(sel)) {
        const t = (el.textContent || "").trim().replace(/\s+/g, " ");
        if (t.length > 40) out.push(t.slice(0, 190));
      }
    }
    return [...new Set(out)].slice(0, 6);
  });
  console.log(`\n${name}`);
  for (const p of prose) console.log(`  • ${p}`);
}

await ctx.close();
await browser.close();
console.log(`\nscreenshots: ${OUT}/`);
