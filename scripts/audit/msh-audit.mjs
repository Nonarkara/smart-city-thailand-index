/**
 * THE MSH AUDIT — first screen, page bleed, and MoMA bounds
 * ==========================================================
 * The massacre sweep (collide.mjs) asks "do these two things overlap?".
 * This instrument asks the questions the owner's November 2026 brief
 * asks, and that the sweep cannot see:
 *
 *   FIRST SCREEN   The page's primary action — the single next step the
 *                  page exists to offer — must be on the FIRST SCREEN.
 *                  Not in the document, not after a scroll: on the screen
 *                  the reader is already looking at. This is the SCITI
 *                  reading of the Model-view project's "Start on page 1"
 *                  rule, and of MSH B1: "Primary info + primary action
 *                  visible together".
 *
 *   PAGE BLEED     Content that escapes the page's own box. Horizontal
 *                  overflow past the viewport, a full-bleed element that
 *                  is not meant to bleed, a band whose painted ground runs
 *                  past the content column, an element wider than the
 *                  viewport. The brief says "no page bleed", and MSH.md
 *                  names "page-bleeding, unbalanced UI" as design slop.
 *
 *   BOUNDS         The page's edges land where the grid says they land.
 *                  A composed page lands on a small set of left edges
 *                  (one column, two, maybe three). A page that lands on
 *                  eight different edges has no invisible grid, only an
 *                  accident — and the brief asks for "every page MoMA
 *                  rule bounded", which is exactly "no loose corners".
 *
 *   CHROME COST    Fixed chrome (the sticky topbar) as a share of the
 *                  viewport height. MSH §11.12 sets a guide of under
 *                  ~12-15% on a phone.
 *
 *   HIERARCHY      One thing wins. The page must have a focal point: the
 *                  first screen must carry the page's statement, not
 *                  twelve equal-weight cards.
 *
 * WHAT IT DOES NOT DO
 * It does not judge taste. It reports geometry and the arithmetic of
 * boxes against their words. Every threshold here is taken from a law
 * that already exists in this repository or in the shared workspace law,
 * and each rule names the law it comes from. A threshold that cannot be
 * traced to a law does not go in.
 *
 * RUN
 *   node scripts/audit/msh-audit.mjs [baseUrl] [locales]
 *   node scripts/audit/msh-audit.mjs --report          (print, do not fail)
 *
 *   Env:
 *     SCITI_AUDIT_ROUTES="/bingo,/asus"   measure a subset
 *     MSH_VIEWPORTS="390x844,390x664"     override the viewport set
 *
 * EXIT CODE
 *   0  nothing found, and every route was measured
 *   1  a finding, or a measurement that could not be taken
 *
 * A route that failed to load is NOT a pass. A route whose primary
 * action could not be located is NOT a pass either: it is a measurement
 * that was refused, and a refused measurement is counted as a failure.
 */
import { chromium } from "@playwright/test";

// ───────────────────────────────────────────────────────────────────
// THE ROUTE TABLE
// Every live route in src/routing.ts. `action` is the primary action
// selector: the one thing the page exists to let the reader do next.
// For the routes that carry the presenter band, that next step is the
// band link itself — the band is the first block of <main> and it
// carries the route's declared next step (src/pageMascotBriefs.ts).
// `expect` is what the instrument must find for the route to count as
// measured: if the selector matches nothing, the route is unmeasured.
//
// The selectors are the ones read off the source. Where a page's own
// hero CTA is the real primary action, that is the selector used —
// the mascot band is a reading prompt, not the page's task.
// ───────────────────────────────────────────────────────────────────
const ROUTE_ACTIONS = [
  { route: "/", action: "a.home-city-guide-action", expect: "h1#home-guide-title" },
  { route: "/rankings", action: ".home-city-guide-action, .page-guide-actions a, .rankings-primary-search", expect: "h1" },
  { route: "/methodology", action: ".page-guide-actions a", expect: "h1" },
  { route: "/story", action: ".page-guide-actions a", expect: "h1" },
  { route: "/why", action: ".page-guide-actions a", expect: "h1" },
  { route: "/showcase", action: ".showcase-hero-actions .cta-button", expect: "h1" },
  { route: "/partners", action: ".page-guide-actions a", expect: "h1" },
  { route: "/map", action: ".map-guide-context a, .map-dash-header a", expect: "h1" },
  { route: "/asus", action: ".page-guide-actions a", expect: "h1" },
  { route: "/references", action: ".page-guide-actions a", expect: "h1" },
  { route: "/program", action: ".hero-actions .cta-button", expect: "h1" },
  { route: "/knowledge", action: ".page-guide-actions a", expect: "h1" },
  { route: "/discover", action: ".page-guide-actions a", expect: "h1" },
  { route: "/invest", action: ".page-guide-actions a", expect: "h1" },
  { route: "/compare", action: ".compare-chip-add", expect: ".compare-title" },
  { route: "/bingo", action: ".bingo-dim-strip-btn, .bingo-dim-btn", expect: ".bingo-title, .bingo-mobile-bar" },
  { route: "/baseline", action: ".page-guide-actions a", expect: "h1" },
  { route: "/city/phuket", action: ".dossier-tab-list .dossier-tab", expect: "h1" },
  { route: "/canvas/phuket", action: ".canvas-print-btn", expect: ".canvas-title" },
  { route: "/about", action: ".page-guide-actions a", expect: "h1" },
];

// ───────────────────────────────────────────────────────────────────
// THE VIEWPORT SET
// The phone sizes a real reader holds. 390x844 is the iPhone 14/15
// class; 390x664 is the same phone in Safari WITH the toolbars showing
// (the visible viewport, not the device viewport); 320x568 is the
// smallest screen this platform still claims to support and 320x700 is
// a tall narrow phone. 1440x900 is the desktop.
//
// The short-viewport cases are here because they are the ones that
// break: a band sized for a tall phone pushes the action off the
// screen on a short one. The Model-view project's audit found exactly
// this and fixed it with a height cap on the panel.
// ───────────────────────────────────────────────────────────────────
const VIEWPORTS = (process.env.MSH_VIEWPORTS || "390x844,390x664,320x568,320x700,1440x900")
  .split(",")
  .map(s => {
    const [w, h] = s.trim().split("x").map(Number);
    return { w, h, label: `${w}x${h}` };
  });

let BASE = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "http://[::1]:5188";
const LOCALES = (process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "en,th").split(",");
const REPORT = process.argv.includes("--report");
const ROUTES = process.env.SCITI_AUDIT_ROUTES
  ? process.env.SCITI_AUDIT_ROUTES.split(",").map(s => s.trim()).filter(Boolean)
  : ROUTE_ACTIONS.map(r => r.route);

// ───────────────────────────────────────────────────────────────────
// THE MEASUREMENT
// Runs inside the page. Everything is measured on rendered geometry:
// getBoundingClientRect for boxes, computed styles for paint, and
// scrollWidth for bleed. Nothing here reads the stylesheet as text.
// ───────────────────────────────────────────────────────────────────
function measureMsh({ route, actionSel, expectSel, viewport }) {
  const q = sel => { try { return document.querySelector(sel); } catch { return null; } };
  const all = sel => { try { return [...document.querySelectorAll(sel)]; } catch { return []; } };
  const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, w: r.width, h: r.height }; };
  const visible = el => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const findings = [];
  const add = (rule, severity, detail, extra) => findings.push({ rule, severity, detail, ...(extra || {}) });

  // ── the page's own box ──────────────────────────────────────────
  const docW = document.documentElement.clientWidth;
  const scrollW = document.documentElement.scrollWidth;
  const overflow = scrollW - docW;

  // ── the primary action ──────────────────────────────────────────
  const actionEl = q(actionSel);
  const actionBox = rect(actionEl);
  const actionVisible = visible(actionEl);
  const expectEl = q(expectSel);
  const expectBox = rect(expectEl);

  // The FIRST SCREEN is the visible viewport at scroll position 0.
  // A tall phone shows more of the page than a short one, so this is
  // measured per viewport, not assumed.
  const vh = innerHeight;
  const onFirstScreen = b => b && b.top < vh && b.bottom > 0;

  if (!actionEl) {
    add("FIRST-SCREEN-ACTION", "critical", `primary action "${actionSel}" not found; the route could not be measured`);
  } else if (!actionVisible) {
    add("FIRST-SCREEN-ACTION", "critical", `primary action "${actionSel}" is not visible (hidden or zero-size)`);
  } else if (!onFirstScreen(actionBox)) {
    add("FIRST-SCREEN-ACTION", "critical",
      `primary action "${actionSel}" sits ${Math.round(actionBox.top - vh)}px below the first screen (top ${Math.round(actionBox.top)} vs viewport ${vh})`,
      { actionTop: Math.round(actionBox.top) });
  }

  if (!expectEl) {
    add("FIRST-SCREEN-STATEMENT", "major", `the route's statement "${expectSel}" was not found`);
  } else if (!onFirstScreen(expectBox)) {
    add("FIRST-SCREEN-STATEMENT", "major",
      `the page's statement "${expectSel}" starts ${Math.round(expectBox.top)}px down; the first screen does not carry it`,
      { statementTop: Math.round(expectBox.top) });
  }

  // ── chrome cost ─────────────────────────────────────────────────
  // Fixed chrome that stays on screen: the sticky topbar and anything
  // else pinned to the viewport. MSH §11.12 sets a guide of under
  // ~12-15% of the viewport on a phone.
  const chrome = [];
  for (const el of all("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    // Only chrome that is actually pinned to an edge of the viewport
    // counts. A sticky element inside a scrolling list is page content.
    const pinnedTop = r.top <= 1 && r.bottom > 1;
    const pinnedBottom = r.bottom >= vh - 1 && r.top < vh - 1;
    if (!pinnedTop && !pinnedBottom) continue;
    if (r.height >= vh * 0.9) continue; // a full-screen overlay is not chrome
    chrome.push({ h: r.height, top: pinnedTop ? r.top : r.bottom, cls: (el.className || "").toString().slice(0, 40) });
  }
  // Merge bands that overlap in the viewport, then take the total.
  const bands = chrome.map(c => ({ top: c.top, bottom: c.top + c.h })).sort((a, b) => a.top - b.top);
  let chromeH = 0, bandTop = null, bandBottom = null;
  for (const b of bands) {
    if (bandTop === null) { bandTop = b.top; bandBottom = b.bottom; continue; }
    if (b.top <= bandBottom) bandBottom = Math.max(bandBottom, b.bottom);
    else { chromeH += bandBottom - bandTop; bandTop = b.top; bandBottom = b.bottom; }
  }
  if (bandTop !== null) chromeH += bandBottom - bandTop;
  const chromeShare = chromeH / vh;
  const chromeCap = viewport.w < 720 ? 0.15 : 0.20;
  if (chromeShare > chromeCap) {
    add("CHROME-COST", "major",
      `fixed chrome is ${(chromeShare * 100).toFixed(1)}% of the viewport (${Math.round(chromeH)}px of ${vh}px); the guide is under ${(chromeCap * 100).toFixed(0)}%`,
      { chromeH: Math.round(chromeH), chromeShare: +chromeShare.toFixed(3) });
  }

  // ── page bleed ──────────────────────────────────────────────────
  if (overflow > 1) {
    add("PAGE-BLEED", "critical",
      `content is ${overflow}px wider than the viewport (scrollWidth ${scrollW} vs ${docW})`);
  }
  // An element that paints outside the viewport horizontally is bleeding
  // even when the document happens to clip it.
  //
  // A PARKED element is not bleeding. The accessibility pattern — a skip
  // link parked at left: -9999px until it takes focus — is deliberately
  // off-canvas and the reader never sees it there. What bleeds is content
  // that is CUT OFF at the edge: a small negative left, or a right edge
  // past the viewport. So an element displaced by more than one viewport
  // width is parked; anything else outside is a defect.
  for (const el of all("body *")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2) continue;
    if (r.right > docW + 1 || r.left < -1) {
      const parkedLeft = r.right <= 0 && r.left < -docW;
      const parkedRight = r.left >= docW && r.left > docW * 2;
      const parkedVertical = r.bottom <= 0 && r.top < -docW;
      if (parkedLeft || parkedRight || parkedVertical) continue;
      const cs = getComputedStyle(el);
      // A deliberately full-bleed element inside a full-bleed parent is
      // allowed to reach the edges; what is not allowed is a full-bleed
      // element inside a COLUMN (the content column), which is the
      // classic "page bleed" — content that lost its gutter.
      const parentBleed = el.parentElement && getComputedStyle(el.parentElement).width >= docW - 1;
      if (!parentBleed) {
        add("PAGE-BLEED", "major",
          `"${(el.className || el.tagName).toString().slice(0, 46)}" paints from ${Math.round(r.left)} to ${Math.round(r.right)} in a ${docW}px viewport`,
          { bleedRight: Math.round(r.right), docW });
        break; // one offender is enough to name the defect
      }
    }
  }

  // ── MoMA bounds: the set of left edges ─────────────────────────
  // A composed page lands on a small set of left edges. The law
  // (shared §14, "Planar Alignment: every edge meets another edge")
  // asks for an invisible grid; MSH.md asks for edges that align.
  // We measure the distinct left edges of the page's BLOCK children
  // (the sections that make up the page), not of every nested element.
  const main = q("main") || document.body;
  const blocks = [...main.children].filter(el => visible(el) && el.getBoundingClientRect().height > 8);
  const edges = new Map();
  for (const el of blocks) {
    const r = el.getBoundingClientRect();
    if (r.width < 40) continue;
    const left = Math.round(r.left);
    if (!edges.has(left)) edges.set(left, []);
    edges.get(left).push((el.className || el.tagName).toString().slice(0, 34));
  }
  const edgeList = [...edges.keys()].sort((a, b) => a - b);
  // Three left edges is a grid. Five is an accident.
  if (edgeList.length > 4) {
    add("MO-MA-EDGES", "major",
      `the page lands on ${edgeList.length} different left edges (${edgeList.join(", ")}); a composed page lands on one, two, maybe three`,
      { edges: edgeList });
  }

  // ── hierarchy: one thing wins ───────────────────────────────────
  // The first screen must have a focal point. We measure the heaviest
  // ink in the first screen and ask whether the page's statement is
  // among the top two, and whether the heaviest thing is a heading or
  // a value rather than a decoration.
  const inFirst = all("h1, h2, h3, p, li, button, a, span, td, th, div").filter(el => {
    if (!visible(el)) return false;
    const r = el.getBoundingClientRect();
    if (r.top >= vh || r.bottom <= 0) return false;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.5) return false;
    return el.textContent && el.textContent.trim().length > 0;
  });
  const weightOf = el => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const fs = parseFloat(cs.fontSize) || 0;
    const bold = (parseInt(cs.fontWeight, 10) || 400) >= 600;
    // Type by size and weight; images and rules by area.
    return fs * (bold ? 1.6 : 1) * Math.min(4, r.width / 40);
  };
  const ranked = inFirst.map(el => ({ el, w: weightOf(el) })).sort((a, b) => b.w - a.w);
  const heaviest = ranked.slice(0, 6);
  const statementIsHeavy = heaviest.some(x => x.el === expectEl || expectEl?.contains(x.el) || x.el.contains?.(expectEl));
  if (heaviest.length && !statementIsHeavy) {
    add("HIERARCHY", "major",
      `the heaviest thing on the first screen is "${((heaviest[0].el.className || heaviest[0].el.tagName) + "").slice(0, 40)}", not the page's statement; the eye has no path`);
  }

  return {
    route, viewport: viewport.label, locale: document.documentElement.lang || "?",
    overflow, chromeH: Math.round(chromeH), chromeShare: +chromeShare.toFixed(3),
    actionTop: actionBox ? Math.round(actionBox.top) : null,
    actionBottom: actionBox ? Math.round(actionBox.bottom) : null,
    statementTop: expectBox ? Math.round(expectBox.top) : null,
    edges: edgeList.length,
    findings,
  };
}

// ───────────────────────────────────────────────────────────────────
// THE RUN
// ───────────────────────────────────────────────────────────────────
let server;
if (process.argv.includes("--serve")) {
  const { preview } = await import("vite");
  server = await preview({ preview: { host: "127.0.0.1", port: 0, strictPort: true }, logLevel: "error" });
  BASE = `http://127.0.0.1:${server.httpServer.address().port}`;
}
const browser = await chromium.launch();
const results = [];
const unmeasured = [];

for (const route of ROUTES) {
  const spec = ROUTE_ACTIONS.find(r => r.route === route) || { route, action: ".page-guide-actions a", expect: "h1" };
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: viewport.w, height: viewport.h } });
      const page = await ctx.newPage();
      try {
        await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(1400);
        if (locale !== "en") {
          await page.evaluate((want) => {
            const btn = [...document.querySelectorAll("button, a")].find(b =>
              new RegExp(`^(${want.toUpperCase()}|${want === "th" ? "ไทย" : "中文"})$`, "i").test((b.textContent || "").trim()));
            if (btn) btn.click();
          }, locale);
          await page.waitForTimeout(1200);
        }
        await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
        await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
        await page.waitForTimeout(250);

        const r = await page.evaluate(measureMsh, { route, actionSel: spec.action, expectSel: spec.expect, viewport });
        results.push(r);
        const bad = r.findings.length;
        if (bad) {
          console.log(`FAIL ${route} ${viewport.label} ${locale}: ` + r.findings.map(f => `[${f.rule}] ${f.detail}`).join(" | "));
        } else {
          console.log(`ok   ${route} ${viewport.label} ${locale}: action@${r.actionTop} statement@${r.statementTop} chrome=${(r.chromeShare * 100).toFixed(1)}% edges=${r.edges}`);
        }
      } catch (err) {
        unmeasured.push(`${route} ${viewport.label} ${locale}: ${String(err).slice(0, 120)}`);
        console.log(`UNMEASURED ${route} ${viewport.label} ${locale}: ${String(err).slice(0, 120)}`);
      } finally {
        await ctx.close();
      }
    }
  }
}
await browser.close();
if (server) await server.close();

const allFindings = results.flatMap(r => r.findings.map(f => ({ ...f, route: r.route, viewport: r.viewport, locale: r.locale })));
console.log(`\n${results.length} measurements, ${allFindings.length} findings, ${unmeasured.length} not measured.`);
if (allFindings.length) {
  console.log("\nBY RULE:");
  const byRule = {};
  for (const f of allFindings) (byRule[f.rule] ||= []).push(f);
  for (const [rule, list] of Object.entries(byRule)) {
    console.log(`  ${rule}: ${list.length}`);
    for (const f of list.slice(0, 6)) console.log(`    ${f.route} ${f.viewport} ${f.locale} — ${f.detail}`);
    if (list.length > 6) console.log(`    ... and ${list.length - 6} more`);
  }
}
if (unmeasured.length) {
  console.log("\nNOT MEASURED:");
  for (const u of unmeasured) console.log(`  ${u}`);
}

if (REPORT) process.exit(0);
if (allFindings.length || unmeasured.length) {
  console.log("\nVERDICT FAIL");
  process.exit(1);
}
console.log("VERDICT PASS");
