/**
 * WHY DOES /invest REPORT 3,000+ INK OVERLAPS ON A CLEAN PAGE?
 * ================================================================
 * A screenshot of the Moneyball section shows perfect rendering — no glyph
 * collides with another. Yet the sweep reports 3,082 ink-overlap pairs there.
 *
 * Two suspects, both classic false positives:
 *   1. <option> inside a <select>. The options are not painted in the flow;
 *      a Range over an option's text reports the SELECT's own rect, so all
 *      ~118 options report the same box and each "overlaps" the others and
 *      whatever else sits under the select.
 *   2. Content inside a CLOSED <details>. Chrome hides it with
 *      content-visibility, so nothing is painted, but Range.getClientRects()
 *      still returns layout geometry.
 *
 * This probe measures both and reports what the sweep should have measured.
 *
 * Run: node scripts/audit/probe-invest-falsepos.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/invest", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(400);

const out = await page.evaluate(() => {
  const res = { options: [], details: [], selects: [] };

  // 1. Every <select> and the rect its options report.
  for (const sel of document.querySelectorAll("select")) {
    const r = sel.getBoundingClientRect();
    res.selects.push({
      cls: String(sel.className || "").slice(0, 30),
      optionCount: sel.options.length,
      box: { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
    });
    const opt = sel.options[0];
    if (!opt) continue;
    const range = document.createRange();
    range.selectNodeContents(opt);
    const rects = [...range.getClientRects()].map(x => ({ l: Math.round(x.left), t: Math.round(x.top), w: Math.round(x.width), h: Math.round(x.height) }));
    res.options.push({
      selCls: String(sel.className || "").slice(0, 30),
      optionText: (opt.textContent || "").trim().slice(0, 30),
      optionBox: (() => { const b = opt.getBoundingClientRect(); return { t: Math.round(b.top), l: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) }; })(),
      rangeRects: rects,
    });
  }

  // 2. Content inside closed <details>.
  for (const d of document.querySelectorAll("details")) {
    if (d.open) continue;
    const tds = d.querySelectorAll("td");
    if (!tds.length) continue;
    const td = tds[0];
    const range = document.createRange();
    range.selectNodeContents(td);
    const rects = [...range.getClientRects()].map(x => ({ l: Math.round(x.left), t: Math.round(x.top), w: Math.round(x.width), h: Math.round(x.height) }));
    const b = td.getBoundingClientRect();
    let hidden = false;
    try { hidden = !td.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }); } catch { /* older API */ }
    res.details.push({
      tdText: (td.textContent || "").trim().slice(0, 12),
      tdCount: tds.length,
      tdBox: { t: Math.round(b.top), l: Math.round(b.left), w: Math.round(b.width), h: Math.round(b.height) },
      rangeRects: rects,
      checkVisibility: hidden,
    });
  }
  return res;
});

console.log("=== SELECTS ===");
for (const s of out.selects) console.log(`  ${s.cls} options=${s.optionCount} box=${JSON.stringify(s.box)}`);
console.log("\n=== FIRST OPTION OF EACH SELECT (what the range reports) ===");
for (const o of out.options) {
  console.log(`  select.${o.selCls} option "${o.optionText}"`);
  console.log(`     option element box : ${JSON.stringify(o.optionBox)}`);
  console.log(`     range reports      : ${JSON.stringify(o.rangeRects)}`);
}
console.log("\n=== TD INSIDE CLOSED <details> ===");
for (const d of out.details) {
  console.log(`  td "${d.tdText}" (of ${d.tdCount}) box=${JSON.stringify(d.tdBox)}`);
  console.log(`     range reports      : ${JSON.stringify(d.rangeRects)}`);
  console.log(`     checkVisibility=false → ${d.checkVisibility}`);
}

await ctx.close();
await browser.close();
