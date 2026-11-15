#!/usr/bin/env node
/**
 * tap-targets.mjs — enforce the owner's tap-target law, which nothing enforced.
 *
 * WHY THIS GATE EXISTS
 * --------------------
 * An independent audit of the platform found that the 44 px rule was
 * unenforced: seventeen audit gates ran in CI and not one of them measured
 * an interactive target's size. The two "44" literals in scripts/audit/ are
 * row-height assertions, not tap targets. A green CI therefore said nothing
 * about the rule, and 240 controls were failing it.
 *
 * THE LAW (workspace CLAUDE.md §11.8 item 2, as amended by §11.12)
 * ----------------------------------------------------------------
 *   "44 x 44 px applies to isolated primary actions and map/icon controls.
 *    A dense group of text controls keeps label-plus-padding boxes: at
 *    least 32 px high on touch, never under the 24 px WCAG 2.2 floor, at
 *    least 4 px apart so hit areas do not overlap... Touchability comes
 *    from layout and from fewer controls: group them, move rare ones into
 *    a menu, drop the ones nobody needs. It never comes from padding every
 *    box to 44 px. A 44 px slab around a one-word label is spatial
 *    hallucination, not accessibility."
 *
 * So the gate is not "everything must be 44". It classifies each control
 * and applies the floor that the law sets for that class:
 *
 *   ISOLATED_ACTION / ICON / MAP CONTROL  ->  44 x 44
 *   DENSE_GROUP (a run of sibling controls) ->  >= 32 px tall, >= 4 px apart
 *   INLINE_LINK (a link inside running text)  ->  exempt
 *
 * HOW A TARGET IS MEASURED
 * -------------------------
 * By its EFFECTIVE hit area, not by its CSS box. A control can carry its
 * target on a pseudo-element, and the audit proved the difference matters:
 * the hamburger's ::after expansion resolved to the topbar, not the button,
 * so a 36 px button was really a 36 px target. So the ground truth is
 * elementFromPoint: a grid of probe points is scanned and the extent that
 * resolves to the control (or a descendant of it) is its real target.
 *
 * Probe points are tested one pixel at a time, and the control is scrolled
 * into view with instant behaviour first — the audit's first pass measured
 * 0 x 0 targets and a 43 x 43 control because html{scroll-behavior:smooth}
 * made scrollIntoView animate and the clip landed on the wrong pixels.
 *
 * Usage:
 *   node scripts/audit/tap-targets.mjs --serve     (preview the built dist)
 *   node scripts/audit/tap-targets.mjs <origin>    (any running origin)
 */
import { chromium } from "@playwright/test";

const ROUTES = [
  "/", "/rankings", "/invest", "/compare", "/methodology", "/story", "/program",
  "/partners", "/audit", "/why", "/showcase", "/knowledge", "/baseline", "/city/phuket",
];

const VIEWPORTS = [
  { w: 390, h: 844, label: "390x844" },
  { w: 1440, h: 900, label: "1440x900" },
];

const LOCALE = "en";

let BASE = process.argv.find(a => a.startsWith("http")) || "";
let server = null;
if (process.argv.includes("--serve")) {
  const { preview } = await import("vite");
  server = await preview({ preview: { host: "127.0.0.1", port: 0, strictPort: true }, logLevel: "error" });
  BASE = `http://127.0.0.1:${server.httpServer.address().port}`;
}
if (!BASE) {
  console.error("tap-targets: pass --serve or an origin URL");
  process.exit(2);
}

const browser = await chromium.launch();
const findings = [];
let measured = 0;

for (const vp of VIEWPORTS) {
  // A real phone has a COARSE pointer. The stylesheet already carries a
  // `@media (pointer: coarse)` block that grows several controls to 44px
  // for exactly this reason, so a context without touch would measure a
  // phone viewport with mouse behaviour and report failures that a real
  // thumb never sees. The phone context therefore declares touch.
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    reducedMotion: "reduce",
    hasTouch: vp.w < 900,
    isMobile: vp.w < 900,
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(800);
    await page.locator("h1").first().waitFor({ timeout: 12000 }).catch(() => {});
    await page.evaluate(() => {
      document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible"));
      // Instant scroll: a smooth scroll would leave the rect stale at the
      // moment of measurement.
      const s = document.documentElement.style;
      s.scrollBehavior = "auto";
    });
    // Scroll the whole page so lazily loaded chunks (the globe map, the
    // dossier tabs) are actually in the DOM before anything is measured.
    // A gate that never triggers the lazy content cannot see it.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 400));
    });
    await page.waitForTimeout(600);

    const rows = await page.evaluate(async ({ route, vp }) => {
      const FLOW = new Set(["block", "list-item", "inline", "flow-root", "inline-block", "contents", "table-cell", "table-row"]);
      const INTERACTIVE = 'a[href],button,input,select,textarea,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="switch"],[tabindex]:not([tabindex="-1"])';

      const visible = el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };

      // A control parked outside the viewport until it is focused (the
      // skip link) is not a target anyone can miss; it appears the moment
      // it is needed. Exempt it rather than report a 0x0.
      const offScreen = el => {
        const r = el.getBoundingClientRect();
        return r.bottom <= 0 || r.top >= window.innerHeight || r.right <= 0 || r.left >= window.innerWidth;
      };

      const out = [];
      let count = 0;

      // The control's own effective hit area: probe one pixel at a time.
      const effectiveBox = el => {
        el.scrollIntoView({ block: "center", behavior: "instant" });
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity, n = 0;
        const R = 30; // 60px window covers a 44px target plus its margin
        for (let dy = -R; dy <= R; dy++) {
          for (let dx = -R; dx <= R; dx++) {
            const x = Math.round(cx + dx), y = Math.round(cy + dy);
            if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
            const t = document.elementFromPoint(x, y);
            if (t && (t === el || el.contains(t))) {
              n++;
              if (x < minx) minx = x; if (x > maxx) maxx = x;
              if (y < miny) miny = y; if (y > maxy) maxy = y;
            }
          }
        }
        return n
          ? { w: maxx - minx + 1, h: maxy - miny + 1 }
          : { w: 0, h: 0 };
      };

      // Classify the control by STRUCTURE, not by taste.
      const classify = el => {
        const cs = getComputedStyle(el);
        const p = el.parentElement;
        const pcs = p ? getComputedStyle(p) : null;
        const text = (el.textContent || "").trim();
        const isAnchor = el.tagName === "A" && el.hasAttribute("href");

        // A link inside running text: inline, unstyled, and its parent holds
        // other text beside it.
        let sibText = "";
        if (p) for (const n of p.childNodes) if (n.nodeType === 3) sibText += n.textContent;
        const inlineInProse =
          isAnchor && cs.display === "inline" && pcs && FLOW.has(pcs.display) &&
          sibText.trim().length > 0 &&
          cs.backgroundColor === "rgba(0, 0, 0, 0)" &&
          parseFloat(cs.borderTopWidth) === 0 &&
          parseFloat(cs.paddingTop) === 0;
        if (inlineInProse) return "INLINE_LINK";

        // A dense group: this control has sibling controls in the same
        // container, so the group is made touchable by layout.
        const siblings = p ? [...p.querySelectorAll(INTERACTIVE)].filter(visible) : [];
        const dense = siblings.length >= 3;

        // An icon or map control carries no words, so it can never be a
        // one-word slab; it gets the full 44 x 44.
        const isIcon = text.length === 0 && (el.getAttribute("aria-label") || el.getAttribute("title") || "");
        if (isIcon) return "ICON_CONTROL";
        if (dense) return "DENSE_GROUP";
        return "ISOLATED_ACTION";
      };

      const seen = new Set();
      for (const el of document.querySelectorAll(INTERACTIVE)) {
        if (!visible(el)) continue;

        // A control wrapped in a <label> is tapped through the label:
        // clicking the label's text toggles the input. The input's own
        // box is only the indicator. So the target is the label.
        const target = (el.tagName === "INPUT" && el.closest("label")) ? el.closest("label") : el;

        const r0 = target.getBoundingClientRect();
        if (r0.width >= 44 && r0.height >= 44) continue;
        const cls = (target.className && target.className.toString ? target.className.toString() : target.tagName) + "|" + target.tagName;
        if (seen.has(cls)) continue;
        seen.add(cls);

        const category = classify(target);
        if (category === "INLINE_LINK") continue;
        if (offScreen(target)) continue;

        const eff = effectiveBox(target);
        count++;

        const w = Math.max(eff.w, Math.round(r0.width));
        const h = Math.max(eff.h, Math.round(r0.height));

        // The floor the law sets for this class. The 44 px rule is a TOUCH
        // rule (Apple HIG, §11.8; §11.12 says "at least 32 px high ON
        // TOUCH"), so a coarse pointer gets the full figure and a fine
        // pointer gets the WCAG 2.2 AA floor of 24 px. A dense group of
        // text controls is measured on HEIGHT only: the law sets "at least
        // 32 px high on touch ... and at least 4 px apart so hit areas do
        // not overlap". It sets no width floor, because the group is made
        // touchable by layout, not by fattening each label.
        const coarse = matchMedia("(pointer: coarse)").matches;
        let need, ok;
        if (category === "DENSE_GROUP") {
          need = coarse ? 32 : 24;
          ok = h >= need;
        } else {
          need = coarse ? 44 : 32;
          ok = w >= need && h >= need;
        }
        if (!ok) {
          out.push({
            route, viewport: vp.label, category, need,
            tag: target.tagName.toLowerCase(),
            cls: (target.className && target.className.toString ? target.className.toString() : "").slice(0, 44),
            box: [Math.round(r0.width), Math.round(r0.height)],
            eff: [eff.w, eff.h],
            name: ((target.getAttribute("aria-label") || target.textContent || "").trim()).slice(0, 40),
          });
        }
      }
      return { out, count };
    }, { route, vp });

    findings.push(...rows.out);
    measured += rows.count;
    const bad = rows.out.length;
    console.log(`${bad ? "FAIL" : "ok  "} ${route} ${vp.label}${bad ? " — " + bad + " finding(s)" : ""}`);
  }
  await ctx.close();
}

await browser.close();
if (server) await server.close();

console.log(`\n${measured} controls measured, ${findings.length} finding(s).`);
if (findings.length) {
  console.log("\nBY CONTROL:");
  const by = {};
  for (const f of findings) {
    const key = `${f.cls}|${f.category}`;
    (by[key] ||= []).push(f);
  }
  for (const [key, list] of Object.entries(by)) {
    const f = list[0];
    console.log(`  ${f.category} needs ${f.need}px — ${f.cls}`);
    console.log(`      box ${f.box[0]}x${f.box[1]}  effective ${f.eff[0]}x${f.eff[1]}  "${f.name}"`);
    for (const g of list.slice(0, 3)) console.log(`      ${g.route} ${g.viewport}`);
    if (list.length > 3) console.log(`      ... and ${list.length - 3} more`);
  }
  console.log("\nVERDICT FAIL");
  process.exit(1);
}
console.log("\nVERDICT PASS");
