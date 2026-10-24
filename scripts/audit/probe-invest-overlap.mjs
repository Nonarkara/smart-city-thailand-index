/**
 * WHY DOES /invest REPORT THOUSANDS OF INK OVERLAPS?
 * ====================================================
 * The massacre sweep reports 3,082 text-over-text pairs on /invest at 1440px.
 * That number is either a real defect (a table painted over a paragraph) or
 * an instrument fault (two elements in different clipping contexts whose
 * layout rects coincide while their painted ink does not).
 *
 * This probe answers it with the only question that matters: for each pair,
 * are both rects inside the SAME clipping context, and does a screenshot
 * actually show two glyphs on top of each other?
 *
 * Run: node scripts/audit/probe-invest-overlap.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
mkdirSync("/tmp/invest-probe", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/invest", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(400);

const data = await page.evaluate(() => {
  const TEXTISH = new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TD", "TH", "A", "BUTTON", "STRONG", "EM", "SMALL", "LABEL", "FIGCAPTION", "DT", "DD", "BLOCKQUOTE", "SUMMARY", "CODE", "TIME", "DIV"]);
  const textNodes = [...document.querySelectorAll("body *")].filter(el => {
    if (el.closest(".chat-fab, .chat-panel, .site-footer, .topbar, svg")) return false;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    return el.getBoundingClientRect().height > 4;
  });

  // Which clipping ancestor does each ink rect live inside? Two elements
  // inside DIFFERENT scroll/clip containers cannot paint over each other
  // unless those containers themselves overlap.
  const clipOf = (el) => {
    let node = el.parentElement;
    while (node && node !== document.body) {
      const cs = getComputedStyle(node);
      if (/(auto|scroll|hidden|clip)/.test(cs.overflow + cs.overflowX + cs.overflowY)) {
        return node.tagName.toLowerCase() + "." + String(node.className || "").slice(0, 40);
      }
      node = node.parentElement;
    }
    return "none";
  };

  const inkRects = [];
  for (const el of textNodes) {
    if (!TEXTISH.has(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.position === "absolute") continue;
    const range = document.createRange();
    const rects = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      try {
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) rects.push(r);
      } catch { /* detached */ }
    }
    if (rects.length) inkRects.push({ el, rects, clip: clipOf(el) });
  }
  inkRects.sort((x, y) => Math.min(...x.rects.map(r => r.top)) - Math.min(...y.rects.map(r => r.top)));

  const pairs = [];
  for (let i = 0; i < inkRects.length; i++) {
    const a = inkRects[i];
    const aTop = Math.min(...a.rects.map(r => r.top));
    const aBottom = Math.max(...a.rects.map(r => r.bottom));
    for (let j = i + 1; j < inkRects.length; j++) {
      const b = inkRects[j];
      const bTop = Math.min(...b.rects.map(r => r.top));
      if (bTop > aBottom + 6) break;
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      let hit = null, ra = null, rb = null;
      for (const x of a.rects) {
        for (const y of b.rects) {
          const ox = Math.min(x.right, y.right) - Math.max(x.left, y.left);
          const oy = Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top);
          if (ox > 2 && oy > 2) { hit = { ox: Math.round(ox), oy: Math.round(oy) }; ra = x; rb = y; break; }
        }
        if (hit) break;
      }
      if (hit) {
        pairs.push({
          aTag: a.el.tagName + "." + String(a.el.className || "").slice(0, 26),
          aText: (a.el.textContent || "").trim().slice(0, 34),
          aClip: a.clip,
          bTag: b.el.tagName + "." + String(b.el.className || "").slice(0, 26),
          bText: (b.el.textContent || "").trim().slice(0, 34),
          bClip: b.clip,
          ox: hit.ox, oy: hit.oy,
          aRect: { l: Math.round(ra.left), t: Math.round(ra.top), w: Math.round(ra.width), h: Math.round(ra.height) },
          bRect: { l: Math.round(rb.left), t: Math.round(rb.top), w: Math.round(rb.width), h: Math.round(rb.height) },
          sameClip: a.clip === b.clip,
        });
      }
    }
  }
  return { total: pairs.length, pairs: pairs.slice(0, 40) };
});

console.log(`total ink-overlap pairs on /invest@1440: ${data.total}\n`);

const sameClip = data.pairs.filter(p => p.sameClip);
const diffClip = data.pairs.filter(p => !p.sameClip);
console.log(`sample: ${sameClip.length} same-clip, ${diffClip.length} different-clip\n`);

console.log("--- SAME CLIP (could be a real overlap) ---");
for (const p of sameClip.slice(0, 12)) {
  console.log(`  ${p.ox}×${p.oy}px  ${p.aTag} "${p.aText}" @${JSON.stringify(p.aRect)}`);
  console.log(`            ×  ${p.bTag} "${p.bText}" @${JSON.stringify(p.bRect)}`);
  console.log(`            clip: ${p.aClip}`);
}
console.log("\n--- DIFFERENT CLIP (instrument fault) ---");
for (const p of diffClip.slice(0, 6)) {
  console.log(`  ${p.ox}×${p.oy}px  ${p.aTag} "${p.aText}" clip=${p.aClip}`);
  console.log(`            ×  ${p.bTag} "${p.bText}" clip=${p.bClip}`);
}

// Screenshot the region where the worst same-clip pair sits.
if (sameClip.length) {
  const worst = sameClip.sort((a, b) => b.ox * b.oy - a.ox * a.oy)[0];
  const y = Math.max(0, worst.aRect.t - 120);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/invest-probe/overlap-region.png" });
  console.log(`\nscreenshot: /tmp/invest-probe/overlap-region.png (scrollY=${y}, worst pair at top=${worst.aRect.t})`);
}

await ctx.close();
await browser.close();
