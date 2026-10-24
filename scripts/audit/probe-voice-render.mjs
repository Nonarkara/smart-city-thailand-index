/**
 * WHAT DOES A REGISTERED CITY DOSSIER ACTUALLY READ LIKE?
 * ===================================================
 * 68 of 118 cities have no curated editorial context, no highlights, no
 * metrics, and the same tagline. That is where the "everything feels
 * mechanical" complaint comes from — but the reader sees the rendered
 * page, not the data model, so the rendered page is what gets read here.
 *
 * This dumps the visible prose of a registered city and of a curated one,
 * side by side, so the difference can be judged as prose.
 *
 * Run: node scripts/audit/probe-voice-render.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const CITIES = [
  ["registered", "/city/reg-ayutthaya/"],
  ["registered", "/city/reg-lampang-pao/"],
  ["registered", "/city/reg-phayao/"],
  ["curated", "/city/phuket/"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

for (const [kind, route] of CITIES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(300);

  const prose = await page.evaluate(() => {
    const out = [];
    const seen = new Set();
    for (const sel of [".city-dossier-card-body", ".city-profile-read p", ".city-hero-photo-title", ".city-dossier-card-label", ".city-profile-row-value", ".city-profile-row-label", ".city-quick-read p"]) {
      for (const el of document.querySelectorAll(sel)) {
        const t = (el.textContent || "").trim().replace(/\s+/g, " ");
        if (!t || t.length < 12 || seen.has(t)) continue;
        seen.add(t);
        out.push(`[${sel.replace(/^\./, "").split(" ")[0]}] ${t}`);
      }
    }
    return out.slice(0, 26);
  });

  console.log(`\n${"=".repeat(78)}\n${kind.toUpperCase()}  ${route}\n${"=".repeat(78)}`);
  for (const p of prose) console.log("  " + p);
}

await ctx.close();
await browser.close();
