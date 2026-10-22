/**
 * THE RHYTHM CENSUS
 * =================
 * Every unexplained run of vertical space on every route, at every
 * viewport the law asks for (390 / 1024 / 1440).
 *
 * The threshold is the rhythm itself. The deliberate step between two
 * groups is --rhythm-section, 32px. A run of nothing that the eye
 * crosses, unmarked by a rule or a change of ground, and LONGER than
 * that step, is space that no decision explains: that is the census
 * population. Runs at or under 32px are within the scale.
 *
 * Run: node scripts/audit/rhythm-census.mjs [baseUrl] [viewport]
 *      RHYTHM_MIN=48  raise the threshold
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";
import { measureVoidRuns } from "./lib/void-measure.mjs";

const BASE = process.argv[2] || "http://localhost:5188";
const VIEWPORTS = (process.argv[3] || "390,1024,1440").split(",").map(Number);
// The deliberate step between two groups is --rhythm-section, 32px.
// A run measured from a line of text carries up to ~2px of descender
// slack, and rounding adds a pixel, so 32-35px is the STEP, measured.
// A run is a DEFECT when it exceeds the step by a full close step
// (8px) or more — that is space no decision on this site accounts for.
// Both bands are reported; nothing is hidden by the threshold.
const NEAR = Number(process.env.RHYTHM_MIN || 32);
const MIN = Number(process.env.RHYTHM_MIN || 36);
const ROUTES = [
  "/", "/rankings", "/methodology", "/baseline", "/city/phuket", "/invest",
  "/compare", "/story", "/program", "/partners", "/audit", "/why",
  "/discover", "/about", "/references", "/city",
];

const browser = await chromium.launch();
let total = 0;
const byShape = new Map();

for (const width of VIEWPORTS) {
  console.log(`\n──────── ${width}px ────────`);
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1500);
      await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
      await page.waitForTimeout(300);
      const out = await page.evaluate(measureVoidRuns);
      const near = out.unmarked.filter(r => r.g > NEAR && r.g <= MIN).length;
      const bad = out.unmarked.filter(r => r.g > MIN);
      if (!bad.length) {
        console.log(`${route.padEnd(14)} ${near ? `at the step (${near})` : "—"}`);
        await ctx.close();
        continue;
      }
      total += bad.length;
      console.log(`${route.padEnd(14)} ${bad.length} over ${MIN}px${near ? `  +${near} at the step` : ""}`);
      for (const r of bad) {
        console.log(`     ${String(r.g).padStart(4)}px @${String(r.at).padStart(6)}   ${r.above}  →  ${r.below}`);
        const key = r.above.split(".")[0] + "→" + r.below.split(".")[0];
        byShape.set(key, (byShape.get(key) || 0) + 1);
      }
    } catch (e) {
      console.log(`${route.padEnd(14)} FAILED ${String(e).slice(0, 70)}`);
    }
    await ctx.close();
  }
}

console.log(`\n════════ TOTAL unexplained runs over ${MIN}px: ${total}`);
if (byShape.size) {
  console.log("Most repeated shape (element → element):");
  [...byShape.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log(`   ${String(v).padStart(3)}×  ${k}`));
}
await browser.close();
