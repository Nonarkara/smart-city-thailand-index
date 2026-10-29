/**
 * THE MASSAACRE SWEEP
 * ===================
 * Runs the shared core measurement (scripts/audit/lib/collide-core.mjs)
 * over every route, locale and viewport, and turns the result into a
 * VERDICT rather than a report.
 *
 * Run: node scripts/audit/collide.mjs [baseUrl] [locales]
 * Env:  SCITI_AUDIT_ROUTES="/bingo,/asus"  — measure a subset.
 *
 * EXIT CODE
 *   0  nothing found, and every route/locale/viewport was measured
 *   1  a finding, or a measurement that could not be taken
 *
 * A route that fails to load is NOT a pass. A route whose font metrics
 * the browser refused to give is NOT a pass. An instrument that skips
 * what it cannot see green-lights its own blindness, so both are counted
 * and reported as "measurements NOT taken".
 */
import { chromium } from "@playwright/test";
import { collideCore } from "./lib/collide-core.mjs";

const BASE = process.argv[2] || "http://localhost:5188";
const LOCALES = (process.argv[3] || "en,th").split(",");
const ALL_ROUTES = [
  "/", "/about", "/creative-economy", "/rankings", "/methodology", "/story",
  "/why", "/showcase", "/partners", "/map", "/asus", "/audit", "/references",
  "/program", "/knowledge", "/discover", "/invest", "/compare", "/bingo",
  "/baseline", "/city/phuket", "/canvas/phuket",
];
const ROUTES = process.env.SCITI_AUDIT_ROUTES
  ? process.env.SCITI_AUDIT_ROUTES.split(",").map(s => s.trim()).filter(Boolean)
  : ALL_ROUTES;
const VIEWPORTS = [390, 1440];

const browser = await chromium.launch();
let collisions = 0, dupes = 0, thaiTrack = 0, overlaps = 0, outside = 0;
const unmeasured = [];

for (const route of ROUTES) {
 for (const locale of LOCALES) {
  for (const width of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2200);
      if (locale !== "en") {
        // The site keeps the locale on <html lang>; switch it the way a reader does.
        await page.evaluate((want) => {
          const btn = [...document.querySelectorAll("button, a")].find(b => new RegExp(`^(${want.toUpperCase()}|${want === "th" ? "ไทย" : "中文"})$`, "i").test((b.textContent || "").trim()));
          if (btn) btn.click();
        }, locale);
        await page.waitForTimeout(1800);
      }
      await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
      await page.waitForTimeout(300);

      const r = await page.evaluate(collideCore);
      const tag = `${route}@${locale}@${width}`;
      if (r.fabCollisions.length) {
        collisions += r.fabCollisions.length;
        console.log(`\n[${tag}] FLOAT CONTROL OVER TEXT — ${r.fabCollisions.length}`);
        for (const c of r.fabCollisions) console.log(`   ${c.float} over ${c.over} (${c.px}px) "${c.text}"`);
      }
      if (r.dupDisplay.length) {
        dupes += r.dupDisplay.length;
        console.log(`\n[${tag}] DUPLICATE DISPLAY TEXT — ${r.dupDisplay.length}`);
        for (const d of r.dupDisplay) {
          const coVisible = d.nearest < 1200;
          console.log(`   "${d.v[0].text}" x${d.v.length}  gap=${d.nearest}px ${coVisible ? "*** CO-VISIBLE — DEFECT" : "(far apart — summary→detail)"}`);
          console.log(`      ${d.v.map(x => `${x.tag}.${x.cls}@${x.top}`).join(" | ")}`);
        }
      }
      if (r.thaiTracked.length) {
        thaiTrack += r.thaiTracked.length;
        console.log(`\n[${tag}] THAI IN A TRACKED RUN — ${r.thaiTracked.length}`);
        for (const t of r.thaiTracked.slice(0, 8)) console.log(`   ${t.tag}.${t.cls} ls=${t.ls} "${t.text}"`);
      }
      if (r.overlaps.length) {
        overlaps += r.overlaps.length;
        console.log(`\n[${tag}] TEXT OVER TEXT — ${r.overlaps.length}`);
        for (const o of r.overlaps.slice(0, 8)) console.log(`   ${o.px}px  ${o.a}  ×  ${o.b}`);
      }
      if (r.outside.length) {
        outside += r.outside.length;
        console.log(`\n[${tag}] TEXT OUTSIDE ITS BOX — ${r.outside.length}`);
        for (const o of r.outside.slice(0, 10)) console.log(`   ${o.over}px ${o.side}  ${o.el}  (box: ${o.box})`);
      }
      if (r.refused.length) {
        unmeasured.push(`${tag}: ${r.refused.length} element(s) refused a font measurement`);
        console.log(`\n[${tag}] MEASUREMENT REFUSED — ${r.refused.length}`);
        for (const x of r.refused.slice(0, 5)) console.log(`   ${x.el} asked ${x.asked}, browser kept ${x.readback}`);
      }
    } catch (e) {
      unmeasured.push(`${route}@${locale}@${width}: ${String(e).slice(0, 90)}`);
      console.log(`${route}@${locale}@${width} FAILED ${String(e).slice(0, 120)}`);
    } finally {
      await ctx.close();
    }
  }
 }
}
await browser.close();
console.log(`\n================ MASSACRE SWEEP ================`);
console.log(`floating-control collisions : ${collisions}`);
console.log(`duplicate display text      : ${dupes}`);
console.log(`Thai in a tracked run        : ${thaiTrack}`);
console.log(`text painted over text       : ${overlaps}`);
console.log(`text outside its box         : ${outside}`);
if (unmeasured.length) {
  console.log(`\n!! measurements NOT taken — ${unmeasured.length}`);
  for (const u of unmeasured) console.log(`   ${u}`);
}
const findings = collisions + dupes + thaiTrack + overlaps + outside;
if (findings || unmeasured.length) {
  console.log(`\nVERDICT: FAIL (${findings} finding(s), ${unmeasured.length} unmeasured)`);
  process.exit(1);
}
console.log(`\nVERDICT: PASS (${ROUTES.length} route(s) × ${LOCALES.length} locale(s) × ${VIEWPORTS.length} viewport(s), all measured)`);
