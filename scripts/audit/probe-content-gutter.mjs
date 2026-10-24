/**
 * WHERE IS THE CONTENT COLUMN'S RIGHT EDGE, AND WHERE IS THE GUTTER?
 * ================================================================
 * The floating chat button can only live in a gutter — the empty space
 * between the content column and the viewport edge. This measures the
 * rightmost TEXT-BEARING element (the same filter the massacre sweep
 * uses, so the number is comparable) at every width.
 *
 * The crossover is where the text stops clearing the button. That width
 * decides where the button may float and where it must live in the
 * navigation instead.
 *
 * Run: node scripts/audit/probe-content-gutter.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const WIDTHS = [390, 480, 600, 720, 768, 834, 900, 1024, 1100, 1180, 1280, 1360, 1440, 1600];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/why", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(300);

console.log("width   text.right   fab.left   gap   verdict");
for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(260);
  const r = await page.evaluate(() => {
    const textNodes = [...document.querySelectorAll("body *")].filter(el => {
      if (el.closest(".chat-fab, .chat-panel, .site-footer, .topbar, svg")) return false;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (!own) return false;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
      return el.getBoundingClientRect().height > 4;
    });
    let right = 0;
    for (const el of textNodes) right = Math.max(right, el.getBoundingClientRect().right);
    const fab = document.querySelector(".chat-fab");
    const fr = fab?.getBoundingClientRect();
    return { right: Math.round(right), fabLeft: fr ? Math.round(fr.left) : null };
  });
  const gap = r.fabLeft - r.right;
  console.log(
    `${String(w).padStart(5)}   ${String(r.right).padStart(9)}   ${String(r.fabLeft).padStart(8)}   ${String(Math.round(gap)).padStart(4)}   ${gap >= 0 ? "clear" : "OVERLAPS by " + Math.round(-gap)}`
  );
}

await ctx.close();
await browser.close();
