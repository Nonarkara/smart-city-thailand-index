/**
 * THE COMPOSITION INSTRUMENT
 * ===========================
 * The MSH law measures geometry. This one measures the other half of the
 * brief: does the page tell the reader what to read FIRST, what SECOND,
 * what THIRD, and what to do NEXT — and is it composed on an invisible
 * grid?
 *
 * It reports facts, not verdicts. A number here is evidence for a
 * judgement, never the judgement itself.
 *
 * WHAT IT MEASURES
 *
 *   ORDER     Visual weight per horizontal band, heaviest first. A page
 *             whose heaviest band is not the one carrying the page's
 *             statement has an order problem, whatever the type says.
 *
 *   WEIGHT    An analytic model of visual weight: type by size, weight
 *             and contrast against its own ground; images and SVG by
 *             area; tinted fields and rules by area and length. It is a
 *             model, not a rendering — which is why the screenshots
 *             still have to be looked at.
 *
 *   GRID      The distinct left edges of the page's full-width blocks.
 *             A composed page lands on a small set of edges — one
 *             column, two, maybe three. A page that lands on eight
 *             different edges has no invisible grid, only an accident.
 *
 *   BALANCE   Where the mass sits horizontally, and how it splits across
 *             the content width. Asymmetry is fine; imbalance is not.
 *
 *   NEXT      The first action the page offers after its opening. A page
 *             that never says what to do next has left the reader to
 *             invent the intention — the law's "unexplained space" in a
 *             different costume.
 *
 *   DENSITY   How much of the page is content, how much is marked space
 *             (inside a division) and how much is unexplained.
 *
 * Run: node scripts/audit/composition.mjs [baseUrl] [route ...]
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://localhost:5188";
const ROUTES = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/rankings", "/methodology", "/baseline", "/city/phuket", "/invest", "/compare", "/story", "/program", "/partners", "/audit", "/why"];

const browser = await chromium.launch();

for (const route of ROUTES) {
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1800);
      await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
      await page.waitForTimeout(350);

      const out = await page.evaluate(() => {
        const parseRgb = (c) => {
          const m = /rgba?\(([^)]+)\)/.exec(c || "");
          if (!m) return null;
          const p = m[1].split(",").map(s => parseFloat(s));
          return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: p.length === 4 ? p[3] : 1 };
        };
        const lum = (c) => {
          const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
        };
        const contrast = (a, b) => {
          const l1 = lum(a), l2 = lum(b);
          const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
          return (hi + 0.05) / (lo + 0.05);
        };
        const desc = (el) => {
          const tag = el.tagName.toLowerCase();
          const cls = (el.className && typeof el.className === "string" ? el.className : "")
            .trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".");
          return (tag === "div" || tag === "span" ? "" : tag) + (cls ? "." + cls : "");
        };
        const groundOf = (el) => {
          let n = el;
          while (n && n !== document.documentElement) {
            const bg = parseRgb(getComputedStyle(n).backgroundColor);
            if (bg && bg.a > 0.5) return bg;
            n = n.parentElement;
          }
          return parseRgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
        };

        const main = document.querySelector("main") || document.body;
        const mainRect = main.getBoundingClientRect();
        const contentW = mainRect.width;

        const items = [];
        for (const el of main.querySelectorAll("*")) {
          if (el.closest(".site-footer, .site-header, nav")) continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          const area = r.width * r.height;

          let weight = 0;
          let kind = "";
          const tag = el.tagName.toLowerCase();
          const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length);
          const isLeafText = ownText && !el.children.length;

          if (isLeafText) {
            const fs = parseFloat(cs.fontSize);
            const fw = parseInt(cs.fontWeight, 10) || 400;
            const fg = parseRgb(cs.color) || { r: 0, g: 0, b: 0, a: 1 };
            const bg = groundOf(el);
            const c = Math.min(contrast(fg, bg), 12);
            // size² because a glyph's presence grows with its area
            weight = (fs * fs) * (fw / 400) * (0.35 + c / 12) * 0.55;
            kind = "text";
          } else if (tag === "img" || tag === "video" || tag === "canvas" || tag === "svg" || tag === "picture") {
            weight = Math.min(area / 26, 900);
            kind = "image";
          } else if (tag === "button" || tag === "a") {
            weight = Math.min(area / 14, 500) * 0.8;
            kind = "action";
          } else {
            // a painted field or a rule: present, but quiet
            const bg = parseRgb(cs.backgroundColor);
            const painted = bg && bg.a > 0.5;
            const rule = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
            if (painted) { weight = Math.min(area / 90, 320) * 0.35; kind = "field"; }
            else if (rule > 0) { weight = r.width * rule * 0.22; kind = "rule"; }
          }
          if (weight <= 0) continue;
          items.push({
            el, weight, kind,
            // A text link is an action as well as text. The kind says how
            // the thing LOOKS; isAction says what the reader can DO with
            // it. Checking only for <button> missed every text link, and
            // four pages reported no next action when they offer dozens.
            isAction: tag === "a" || tag === "button",
            top: r.top + window.scrollY,
            left: r.left,
            bottom: r.bottom + window.scrollY,
            right: r.right,
            width: r.width, height: r.height,
            text: (el.textContent || "").trim().slice(0, 42),
          });
        }

        // ── ORDER: weight per horizontal band ─────────────────────────
        const bands = [];
        for (const it of items) {
          const b = bands.find(x => Math.abs(x.top - it.top) < 12);
          if (b) { b.weight += it.weight; b.parts.push(it); b.top = Math.min(b.top, it.top); }
          else bands.push({ top: it.top, weight: it.weight, parts: [it] });
        }
        bands.sort((a, b) => a.top - b.top);
        const ranked = [...bands].sort((a, b) => b.weight - a.weight);
        const order = ranked.slice(0, 4).map(b => {
          const lead = [...b.parts].sort((x, y) => y.weight - x.weight)[0];
          return { top: Math.round(b.top), w: Math.round(b.weight), lead: desc(lead.el), kind: lead.kind };
        });
        const heaviest = order[0];

        // ── GRID: the distinct left edges of the full-width blocks ───
        const edges = new Map();
        for (const it of items) {
          if (it.width < contentW * 0.55) continue;
          if (it.height < 20) continue;
          const key = Math.round(it.left / 4) * 4;
          edges.set(key, (edges.get(key) || 0) + 1);
        }
        const gridEdges = [...edges.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);

        // ── BALANCE ───────────────────────────────────────────────────
        // How the mass splits across the content width. An item that
        // straddles the midline is split by how much of it lies on each
        // side — counting it whole on one side put every full-width
        // paragraph on the right, because its centre lands exactly on
        // the midline.
        let total = 0, cx = 0, left = 0, right = 0;
        const mid = mainRect.left + contentW / 2;
        for (const it of items) {
          total += it.weight;
          cx += it.weight * (it.left + it.width / 2);
          const rightEdge = it.left + it.width;
          const wLeft = Math.max(0, Math.min(rightEdge, mid) - it.left);
          const wRight = Math.max(0, rightEdge - Math.max(it.left, mid));
          const span = wLeft + wRight;
          if (span <= 0) continue;
          left += it.weight * (wLeft / span);
          right += it.weight * (wRight / span);
        }
        const centroid = total ? cx / total : mainRect.left;
        const offset = contentW ? ((centroid - mainRect.left) / contentW) * 100 : 0;

        // ── NEXT: the first action after the opening statement ───────
        const h1 = main.querySelector("h1");
        const h1Bottom = h1 ? h1.getBoundingClientRect().bottom + window.scrollY : 0;
        let next = null;
        for (const it of items) {
          if (!it.isAction) continue;
          if (it.top < h1Bottom) continue;
          if (!next || it.top < next.top) next = it;
        }

        // ── FIRST SCREEN ─────────────────────────────────────────────
        const firstScreenBottom = window.innerHeight;
        const inFirst = items.filter(i => i.top < firstScreenBottom && i.bottom > 0);
        const firstScreenWeight = inFirst.reduce((s, i) => s + i.weight, 0);
        const h1InFirst = h1 ? h1.getBoundingClientRect().top < firstScreenBottom : false;

        return {
          pageH: document.documentElement.scrollHeight,
          contentW: Math.round(contentW),
          order,
          heaviest,
          gridEdges,
          balance: {
            centroidOffsetPct: Math.round(offset),
            leftPct: total ? Math.round((left / total) * 100) : 0,
            rightPct: total ? Math.round((right / total) * 100) : 0,
          },
          next: next ? { top: Math.round(next.top), text: next.text, lead: desc(next.el) } : null,
          h1InFirst,
          firstScreenWeightPct: total ? Math.round((firstScreenWeight / total) * 100) : 0,
          pageH: document.documentElement.scrollHeight,
        };
      });

      const o = out.order.map(x => `${x.lead}(${x.w})`).join(" → ");
      console.log(
        `\n${route} @${w}px  page ${out.pageH}px  content ${out.contentW}px\n` +
        `   ORDER   ${o}\n` +
        `   GRID    ${out.gridEdges.length} left edge(s): ${out.gridEdges.join(", ") || "none"}\n` +
        `   BALANCE centroid ${out.balance.centroidOffsetPct}%  L${out.balance.leftPct}/R${out.balance.rightPct}\n` +
        `   FIRST   h1 in first screen: ${out.h1InFirst ? "yes" : "NO"}  ·  first-screen mass ${out.firstScreenWeightPct}%\n` +
        `   NEXT    ${out.next ? `"${out.next.text}" @${out.next.top}` : "NONE FOUND"}`
      );
    } catch (e) {
      console.log(`${route} @${w}px FAILED: ${String(e).slice(0, 100)}`);
    }
    await ctx.close();
  }
}
await browser.close();
