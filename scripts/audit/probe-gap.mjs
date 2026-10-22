/**
 * THE GAP PROBE
 * =============
 * One question: between two markers on a page, what is actually there?
 *
 * The census says "44px between span.rank-row-tier and span.league-badge".
 * This prints every TEXT rect (via Range) and every element rect that
 * intersects that window, plus the ancestor chain of the lower marker
 * with its padding/margin/border. A hole that turns out to be full of
 * text was never a hole — and a hole that stays empty is real.
 *
 * Text is measured through Range.getClientRects(), because a bare text
 * node inside a block that also holds an inline element produces no
 * element rect of its own. That is exactly what the census cannot see.
 *
 * Run: node scripts/audit/probe-gap.mjs <baseUrl> <route> <width> <upperSel> <lowerSel> [occurrence]
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";

const [BASE, ROUTE, W, UP, LO, OCC = "0"] = process.argv.slice(2);
const width = Number(W || 390);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + ROUTE, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1500);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(300);

const out = await page.evaluate(({ UP, LO, OCC }) => {
  const desc = (el) => {
    if (!el) return "(none)";
    const cls = (el.getAttribute("class") || "").trim().split(/\s+/).join(".");
    const txt = (el.textContent || "").trim().slice(0, 40);
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""} "${txt}"`;
  };
  const ups = [...document.querySelectorAll(UP)];
  const los = [...document.querySelectorAll(LO)];
  if (!ups.length || !los.length) return { error: `no match ${!ups.length ? UP : LO}` };
  const up = ups[Number(OCC)];
  const lo = los.find(l => l.getBoundingClientRect().top >= up.getBoundingClientRect().bottom - 1);
  if (!lo) return { error: "no lower marker below" };

  const u = up.getBoundingClientRect();
  const l = lo.getBoundingClientRect();
  const winTop = u.bottom;
  const winBot = l.top;

  // ── every TEXT rect in the window, via Range ──────────────────────
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const texts = [];
  let node;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue || !node.nodeValue.trim()) continue;
    const r = document.createRange();
    r.selectNodeContents(node);
    for (const rect of r.getClientRects()) {
      if (rect.height < 1 || rect.width < 1) continue;
      if (rect.bottom <= winTop + 0.5) continue;
      if (rect.top >= winBot - 0.5) continue;
      texts.push({
        text: node.nodeValue.trim().slice(0, 48),
        parent: desc(node.parentElement),
        top: Math.round(rect.top - winTop),
        bottom: Math.round(rect.bottom - winTop),
        h: Math.round(rect.height),
      });
    }
  }
  texts.sort((a, b) => a.top - b.top);

  // ── element boxes in the window (graphics, boxes, rules) ──────────
  const boxes = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.height < 1 || r.width < 1) continue;
    if (r.bottom <= winTop + 0.5) continue;
    if (r.top >= winBot - 0.5) continue;
    const cs = getComputedStyle(el);
    const hasTextChild = [...el.children].some(c => (c.textContent || "").trim().length);
    const isGraphic = el.tagName === "svg" || el.tagName === "IMG" || el.tagName === "CANVAS";
    if (hasTextChild && !isGraphic) continue;
    boxes.push({
      el: desc(el),
      top: Math.round(r.top - winTop),
      bottom: Math.round(r.bottom - winTop),
      tag: el.tagName.toLowerCase(),
      bg: cs.backgroundColor,
    });
  }

  const chainOf = (from) => {
    const out = [];
    for (let el = from; el && el !== document.body; el = el.parentElement) {
      const cs = getComputedStyle(el);
      out.push({
        el: desc(el),
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        borderTop: cs.borderTopWidth,
        display: cs.display,
        gap: cs.gap,
        lineHeight: cs.lineHeight,
      });
    }
    return out;
  };
  const chain = chainOf(lo);
  const upperChain = chainOf(up);

  return {
    gap: Math.round(winBot - winTop),
    upper: { el: desc(up), text: (up.textContent || "").trim().slice(0, 60) },
    lower: { el: desc(lo), text: (lo.textContent || "").trim().slice(0, 60) },
    textsInWindow: texts,
    boxesInWindow: boxes,
    chain: chain.slice(0, 6),
    upperChain: upperChain.slice(0, 6),
  };
}, { UP, LO, OCC });

console.log(JSON.stringify(out, null, 2));
await browser.close();
