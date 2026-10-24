/**
 * IS THE /invest OVERLAP CLUSTER REAL, OR AN INSTRUMENT FAULT?
 * ============================================================
 * The sweep reports ~3,000 ink-overlap pairs on /invest, all of them pairing
 * the Moneyball paragraph (a multi-line <p>) with table cells and links that
 * live in a DIFFERENT section of the page, thousands of pixels away.
 *
 * The hypothesis: the cells are `position: sticky`. A sticky element's
 * getClientRects() reports where it is PAINTED — pinned to the scrollport —
 * not where it sits in flow. So every sticky cell reports the same y, and
 * the pair test then thinks it is sitting on top of whatever paragraph is
 * painted at that y. Nothing overlaps on screen.
 *
 * This probe measures the few elements involved, and reads the screenshot
 * to see whether any glyphs actually collide.
 *
 * Run: node scripts/audit/probe-invest-sticky.mjs [baseUrl]
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
  const out = { sticky: [], sample: [] };

  // How many elements on this page are sticky?
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position === "sticky") {
      const r = el.getBoundingClientRect();
      out.sticky.push({
        tag: el.tagName + "." + String(el.className || "").slice(0, 30),
        text: (el.textContent || "").trim().slice(0, 24),
        top: Math.round(r.top), left: Math.round(r.left), h: Math.round(r.height),
      });
    }
  }

  // The specific elements the sweep paired.
  const pick = (needle) => [...document.querySelectorAll("body *")].find(el => {
    const own = [...el.childNodes].some(n => n.nodeType === 3 && (n.textContent || "").includes(needle));
    return own;
  });
  for (const needle of ["In 2002 the Oakland", "Chiang Mai Smart Old T", "Samyan Smart City", "What Is Moneyball?"]) {
    const el = pick(needle);
    if (!el) { out.sample.push({ needle, found: false }); continue; }
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const range = document.createRange();
    const rects = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      range.selectNodeContents(node);
      for (const rr of range.getClientRects()) if (rr.width > 1 && rr.height > 1) rects.push(rr);
    }
    out.sample.push({
      needle, found: true,
      tag: el.tagName + "." + String(el.className || "").slice(0, 28),
      position: cs.position,
      box: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
      inkRects: rects.map(rr => ({ l: Math.round(rr.left), t: Math.round(rr.top), w: Math.round(rr.width), h: Math.round(rr.height) })),
    });
  }
  return out;
});

console.log(`sticky elements on /invest: ${data.sticky.length}`);
for (const s of data.sticky.slice(0, 12)) console.log(`  ${s.tag} "${s.text}" top=${s.top} left=${s.left} h=${s.h}`);

console.log("\nsample elements:");
for (const s of data.sample) {
  if (!s.found) { console.log(`  "${s.needle}" NOT FOUND`); continue; }
  console.log(`  "${s.needle}" -> ${s.tag} position=${s.position}`);
  console.log(`     box ${JSON.stringify(s.box)}`);
  console.log(`     ink ${JSON.stringify(s.inkRects)}`);
}

// Screenshot: where the paragraph and the table cells actually sit.
await page.evaluate(() => {
  const el = [...document.querySelectorAll("p")].find(p => (p.textContent || "").includes("In 2002 the Oakland"));
  if (el) el.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(600);
await page.screenshot({ path: "/tmp/invest-probe/moneyball.png" });
console.log("\nscreenshot: /tmp/invest-probe/moneyball.png");

await ctx.close();
await browser.close();
