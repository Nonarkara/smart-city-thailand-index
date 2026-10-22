/**
 * THE VOID EXPLANATION
 * =====================
 * voids.mjs measures. This one explains.
 *
 * For the largest unexplained runs on a page it prints what sits ABOVE
 * the hole and what sits BELOW it, plus the ancestor chain of the
 * element below — with each ancestor's padding-top, margin-top and
 * border-top. That turns "a 112px void" into "the story band declares
 * 64px of padding, the section above declares 48px of margin, and the
 * h2 declares 12.8px of padding — three gaps for one division".
 *
 * It uses the SAME measurement rule as voids.mjs, imported from
 * ./lib/void-measure.mjs, so the run it explains is the run that was
 * reported.
 *
 * Run: node scripts/audit/void-explain.mjs [baseUrl] [route ...] [maxRuns]
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";
import { measureVoidRuns } from "./lib/void-measure.mjs";

const args = process.argv.slice(2);
const BASE = args[0] || "http://localhost:5188";
const MAXRUNS = Number(args[args.length - 1]) || 3;
const ROUTES = args.slice(1, args.length - 1).length
  ? args.slice(1, args.length - 1)
  : ["/", "/rankings", "/methodology", "/baseline", "/city/phuket", "/invest", "/compare", "/story", "/program", "/partners", "/audit", "/why"];

const browser = await chromium.launch();
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1800);
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
    await page.waitForTimeout(400);

    const out = await page.evaluate((measureSrc) => {
      const measure = eval("(" + measureSrc + ")");
      const m = measure();
      const desc = (el) => {
        if (!el) return "(none)";
        const tag = el.tagName.toLowerCase();
        const cls = (el.className && typeof el.className === "string" ? el.className : "")
          .trim().split(/\s+/).filter(Boolean).slice(0, 3).join(".");
        const id = el.id ? "#" + el.id : "";
        return tag + id + (cls ? "." + cls : "");
      };
      const leaves = [];
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest(".site-footer")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 2 || r.width < 2) continue;
        const hasElementChild = [...el.children].some(c => {
          if (c.closest("svg")) return false;
          const cr = c.getBoundingClientRect();
          return cr.height >= 2 && cr.width >= 2;
        });
        if (hasElementChild) continue;
        leaves.push({ el, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY });
      }
      const report = m.unmarked.slice(0, 6).map((run) => {
        const above = leaves.filter(L => Math.abs(L.bottom - run.at) <= 3).sort((a, b) => b.bottom - a.bottom)[0];
        const below = leaves.filter(L => Math.abs(L.top - run.to) <= 3).sort((a, b) => a.top - b.top)[0];
        const chain = (leaf, edge) => {
          const out = [];
          let n = leaf ? leaf.el : null;
          let depth = 0;
          while (n && depth < 5) {
            const cs = getComputedStyle(n);
            out.push({
              el: desc(n),
              pt: cs.paddingTop, pb: cs.paddingBottom,
              mt: cs.marginTop, mb: cs.marginBottom,
              bt: cs.borderTopWidth, bb: cs.borderBottomWidth,
            });
            n = n.parentElement;
            depth++;
          }
          return out;
        };
        return {
          g: run.g, at: run.at,
          above: above ? desc(above.el) : "(none)",
          below: below ? desc(below.el) : "(none)",
          aboveChain: chain(above, "bottom"),
          belowChain: chain(below, "top"),
        };
      });
      return { pageH: m.pageH, report };
    }, measureVoidRuns.toString());

    console.log(`\n═══ ${route} — page ${out.pageH}px — unexplained runs ═══`);
    if (!out.report.length) console.log("  none");
    for (const r of out.report) {
      console.log(`\n  VOID ${r.g}px @ ${r.at}`);
      console.log(`    ABOVE  ${r.above}`);
      for (const c of r.aboveChain) {
        console.log(`      ${c.el.padEnd(38)} pad-b ${String(c.pb).padEnd(7)} margin-b ${String(c.mb).padEnd(9)} border-b ${c.bb}`);
      }
      console.log(`    BELOW  ${r.below}`);
      for (const c of r.belowChain) {
        console.log(`      ${c.el.padEnd(38)} pad-t ${String(c.pt).padEnd(7)} margin-t ${String(c.mt).padEnd(9)} border-t ${c.bt}`);
      }
    }
  } catch (e) {
    console.log(`${route} FAILED: ${String(e).slice(0, 120)}`);
  }
  await ctx.close();
}
await browser.close();
