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
import { measureMsh } from "./lib/msh-core.mjs";

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
  { route: "/map", action: "circle.map-city-marker", expect: ".map-dash-header h1" },
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
        await page.addInitScript(locale => {
          localStorage.setItem("smart-city-thailand-locale", locale);
        }, locale);
        await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.locator(spec.expect).first().waitFor({ state: "attached" });
        await page.locator(spec.action).first().waitFor({ state: "attached" });
        await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
        await page.evaluate(async () => {
          document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
          await document.fonts.ready;
        });
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
