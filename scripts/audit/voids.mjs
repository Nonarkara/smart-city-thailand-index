/**
 * THE VOID HUNT
 * =============
 * The measured report: how much of this page is space that no rule and
 * no colour change explains.
 *
 * The rule lives in ./lib/void-measure.mjs so that this instrument and
 * void-explain.mjs cannot drift apart. Read that file for the reason a
 * run is SPLIT at every rule and every change of ground — a mark
 * re-anchors the eye, so the space on either side is a different space.
 *
 * Run: node scripts/audit/voids.mjs [baseUrl] [route ...]
 *      VOID_DEBUG=1  prints the largest runs and what marks them
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";
import { measureVoidRuns } from "./lib/void-measure.mjs";

const BASE = process.argv[2] || "http://localhost:5188";
const ROUTES = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/rankings", "/methodology", "/baseline", "/city/phuket", "/invest", "/compare", "/story", "/program", "/partners", "/audit", "/why"];

const browser = await chromium.launch();
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1800);
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
    await page.waitForTimeout(400);

    const out = await page.evaluate(measureVoidRuns);
    const t = (r) => `${r.g}px@${r.at}${r.marked ? "" : "!"}`;
    console.log(
      `${route.padEnd(15)} page ${String(out.pageH).padStart(6)}px | unmarked ${String(out.unmarked.length).padStart(2)} | worst unmarked: ${(out.worstUnmarked ? t(out.worstUnmarked) : "none")}`
    );
    if (process.env.VOID_DEBUG) {
      for (const r of out.worst) console.log(`      ${t(r).padEnd(14)} ${r.by}`);
    }
  } catch (e) {
    console.log(`${route} FAILED: ${String(e).slice(0, 120)}`);
  }
  await ctx.close();
}
await browser.close();
