/**
 * AT WHICH WIDTH DOES THE FLOATING CHAT BUTTON START COVERING TEXT?
 * ===============================================================
 * The gutter probe measured element boxes and found full-bleed sections
 * reaching the viewport edge at every width — which says nothing, because
 * those are wrappers, not text.
 *
 * This uses the sweep's OWN filter (elements that actually own a text
 * node) so the number it produces is the same one the massacre sweep
 * reports. The crossover width is what decides whether the button stays
 * a floating control or moves into the navigation on a phone.
 *
 * Run: node scripts/audit/probe-fab-crossover.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const ROUTES = ["/", "/why", "/program", "/audit", "/partners", "/story"];
const WIDTHS = [390, 480, 600, 720, 768, 834, 900, 1024, 1180, 1280, 1440];

const browser = await chromium.launch();
const totals = new Map();

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 } });
  const page = await ctx.newPage();
  let hits = 0;
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1200);
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
    await page.waitForTimeout(200);
    const n = await page.evaluate(() => {
      const floats = [...document.querySelectorAll(".chat-fab, .chat-panel, .back-to-top, [class*='fab']")].filter(el => {
        const cs = getComputedStyle(el);
        if (cs.position !== "fixed" && cs.position !== "sticky") return false;
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) <= 0.1) return false;
        return el.getBoundingClientRect().width > 0;
      });
      const textNodes = [...document.querySelectorAll("body *")].filter(el => {
        if (el.closest(".chat-fab, .chat-panel, .site-footer, .topbar, svg")) return false;
        const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (!own) return false;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
        return el.getBoundingClientRect().height > 4;
      });
      let count = 0;
      for (const f of floats) {
        const fr = f.getBoundingClientRect();
        for (const t of textNodes) {
          const tr = t.getBoundingClientRect();
          if (tr.bottom < 0 || tr.top > innerHeight) continue;
          const ox = Math.min(fr.right, tr.right) - Math.max(fr.left, tr.left);
          const oy = Math.min(fr.bottom, tr.bottom) - Math.max(fr.top, tr.top);
          if (ox > 2 && oy > 2) { count++; break; }
        }
      }
      return count;
    });
    hits += n;
  }
  totals.set(w, hits);
  console.log(`${String(w).padStart(5)}px  text covered by floating control: ${hits} ${hits === 0 ? "  ← CLEAR" : ""}`);
  await ctx.close();
}

const firstClear = [...totals.entries()].find(([, n]) => n === 0)?.[0];
console.log(`\nfirst width with zero coverage: ${firstClear ?? "none"}`);
await browser.close();
