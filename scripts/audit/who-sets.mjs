/**
 * THE DECLARATION PROBE
 * =====================
 * Which rule actually set this declaration? The CSSOM knows: every
 * matched rule can be read back with its selector and its winning value.
 *
 * Guessing from the stylesheet is not good enough when the same property
 * is declared in six places — the measured value and the rule that set
 * it must agree.
 *
 * Run: node scripts/audit/who-sets.mjs <baseUrl> <route> <selector> <property>
 *   e.g. node scripts/audit/who-sets.mjs http://localhost:5188 /about ".audit-hero" padding-bottom
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://localhost:5188";
const ROUTE = process.argv[3] || "/";
const SELECTOR = process.argv[4] || "section";
const PROPERTY = process.argv[5] || "padding-bottom";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + ROUTE, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1500);

const out = await page.evaluate(({ SELECTOR, PROPERTY }) => {
  const el = document.querySelector(SELECTOR);
  if (!el) return { error: "no element matches " + SELECTOR };
  const hits = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    const walk = (list, ctxSel) => {
      for (const r of list) {
        // Check the selector FIRST. Chrome exposes cssRules on every
        // CSSStyleRule now that CSS Nesting ships, and an empty
        // CSSRuleList is truthy — so testing cssRules alone silently
        // skips every ordinary rule in the stylesheet.
        if (r.selectorText) {
          let matches = false;
          try { matches = el.matches(r.selectorText); } catch {}
          if (matches) {
            const v = r.style.getPropertyValue(PROPERTY);
            if (v) {
              hits.push({
                selector: r.selectorText,
                value: v,
                important: r.style.getPropertyPriority(PROPERTY) === "important",
                media: ctxSel || "(none)",
                order: hits.length,
              });
            }
          }
          continue;
        }
        if (r.cssRules && r.cssRules.length) {
          walk(r.cssRules, (r.conditionText || r.media?.mediaText || r.name || "") + " / " + (ctxSel || ""));
        }
      }
    };
    walk(rules, "");
  }
  const computed = getComputedStyle(el).getPropertyValue(PROPERTY);
  return { computed, hits, classes: el.className };
}, { SELECTOR, PROPERTY });

if (out.error) { console.log(out.error); await browser.close(); process.exit(1); }
console.log(`${ROUTE} ${SELECTOR} → ${PROPERTY}`);
console.log(`  element classes: ${out.classes}`);
console.log(`  computed: ${out.computed}\n`);
for (const h of out.hits) {
  console.log(`  ${h.value}${h.important ? " !important" : ""}   ←  ${h.selector}${h.media !== "(none)" ? "   [" + h.media + "]" : ""}`);
}
await browser.close();
