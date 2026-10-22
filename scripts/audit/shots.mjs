/**
 * MSH EVIDENCE CAPTURE
 * ====================
 * Renders each route at 390 / 1024 / 1440 and records, per viewport:
 *   - chrome cost: the top bar's height and its share of the viewport
 *   - the type sizes in play
 *   - the vertical gaps between top-level sections
 *   - a screenshot of the first screen
 *
 * Run: node scripts/audit/shots.mjs [baseUrl] [outDir] [route ...]
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:5188";
const OUT = process.argv[3] || "/tmp/sciti-shots";
const ROUTES = process.argv.slice(4).length
  ? process.argv.slice(4)
  : ["/", "/rankings", "/methodology", "/baseline", "/city/phuket", "/invest", "/compare", "/story", "/program", "/partners", "/audit", "/why"];
const VIEWPORTS = [[390, 844], [1024, 900], [1440, 900]];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const route of ROUTES) {
  for (const [w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1900);
      // Kill every transition and animation BEFORE measuring. The .reveal
    // entrance moves an element by translateY(20px) while it settles, so a
    // measurement taken mid-transition reports a 20px overlap that does not
    // exist in the built page. A probe fault must never be dressed up as a
    // layout defect.
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
    await page.waitForTimeout(400);
      const m = await page.evaluate((vh) => {
        const bar = document.querySelector(".topbar");
        const barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
        const sizes = {};
        for (const el of document.querySelectorAll("main *")) {
          if (el.closest("svg")) continue;
          const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
          if (!hasText) continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
          if (el.getBoundingClientRect().height === 0) continue;
          const fs = Math.round(parseFloat(cs.fontSize) * 10) / 10;
          sizes[fs] = (sizes[fs] || 0) + 1;
        }
        const secs = [...document.querySelectorAll("main > section, main > div > section")];
        const gaps = [];
        let prev = null;
        for (const s of secs) {
          const r = s.getBoundingClientRect();
          if (prev !== null) gaps.push(Math.round(r.top - prev));
          prev = r.bottom;
        }
        const firstScreen = [...document.querySelectorAll("main h1, main h2, main .eyebrow")]
          .filter(el => el.getBoundingClientRect().top < vh)
          .slice(0, 6)
          .map(el => (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40));
        return { barH, sizes, gaps, firstScreen, scrollH: document.documentElement.scrollHeight };
      }, h);
      const name = route.replace(/\//g, "_").replace(/^_/, "") || "home";
      const file = `${OUT}/${name}-${w}.png`;
      await page.screenshot({ path: file });
      report.push({ route, w, h, ...m, file });
      console.log(`${route.padEnd(15)} ${String(w).padStart(4)}px  bar ${String(m.barH).padStart(3)}px (${((m.barH / h) * 100).toFixed(1)}%)  sizes ${Object.keys(m.sizes).sort((a, b) => b - a).join("/")}  gaps ${m.gaps.join(",")}`);
    } catch (e) {
      console.log(`${route} @${w} FAILED: ${String(e).slice(0, 90)}`);
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`\nscreenshots → ${OUT}`);
