/**
 * THE HOMEPAGE'S TWO DISPLAY BANDS
 * ================================
 * The hero carries 118 / 39 / 37 at display size. The opening argument
 * below carries 118 / 37 / 7 at display size. Two of the three numbers
 * are the same number, repeated about 600-800px apart.
 *
 * The reader judges the fix by looking, so this photographs both bands
 * and measures where each numeral sits, on the same page, at the same
 * time. The decision — which band keeps display size — is an editorial
 * one, and the pictures are the evidence for it.
 *
 * Run: node scripts/audit/probe-home-dual-band.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
mkdirSync("/tmp/dual-band", { recursive: true });

const browser = await chromium.launch();

for (const [label, width, height] of [["home-1440", 1440, 1000], ["home-390", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(500);

  const bands = await page.evaluate(() => {
    const out = {};
    const grab = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), h: Math.round(b.height) };
    };
    out.hero = grab(".cinematic-hero-stats");
    out.argument = grab(".opening-argument-grid");
    out.nums = [...document.querySelectorAll(".hero-stat-num, .opening-argument-num")].map(el => {
      const b = el.getBoundingClientRect();
      return {
        cls: el.className,
        text: (el.textContent || "").trim(),
        top: Math.round(b.top + scrollY),
        fs: getComputedStyle(el).fontSize,
      };
    });
    return out;
  });

  console.log(`\n${label}`);
  console.log(`  hero stat band   ${JSON.stringify(bands.hero)}`);
  console.log(`  opening argument ${JSON.stringify(bands.argument)}`);
  console.log(`  gap between them: ${bands.argument && bands.hero ? bands.argument.top - bands.hero.bottom : "?"}px`);
  for (const n of bands.nums) console.log(`    ${n.cls.padEnd(24)} "${n.text}" ${n.fs} @${n.top}`);

  // Hero band photograph.
  const hero = await page.$(".cinematic-hero-stats");
  if (hero) {
    const b = await hero.boundingBox();
    if (b) {
      await page.evaluate(() => document.querySelector(".cinematic-hero-stats")?.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(400);
      const b2 = await (await page.$(".cinematic-hero-stats")).boundingBox();
      if (b2) {
        await page.screenshot({
          path: `/tmp/dual-band/${label}-hero.png`,
          clip: { x: Math.max(0, b2.x - 8), y: Math.max(0, b2.y - 8), width: Math.min(width, b2.width + 16), height: Math.min(height - Math.max(0, b2.y - 8), b2.height + 16) },
        });
      }
    }
  }

  // Opening argument photograph.
  const arg = await page.$(".opening-argument-grid");
  if (arg) {
    await page.evaluate(() => document.querySelector(".opening-argument-grid")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(400);
    const b2 = await (await page.$(".opening-argument-grid")).boundingBox();
    if (b2) {
      await page.screenshot({
        path: `/tmp/dual-band/${label}-argument.png`,
        clip: { x: Math.max(0, b2.x - 8), y: Math.max(0, b2.y - 8), width: Math.min(width, b2.width + 16), height: Math.min(height - Math.max(0, b2.y - 8), b2.height + 16) },
      });
    }
  }

  await ctx.close();
}

await browser.close();
console.log("\nscreenshots: /tmp/dual-band/");
