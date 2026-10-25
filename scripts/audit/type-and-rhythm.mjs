/**
 * TYPE + RHYTHM MASSACRE INSTRUMENT
 * =================================
 * Measures, per route:
 *   1. every distinct computed font-size on the page (§11.7 allows three)
 *   2. the heading tree, so semantic structure can be checked
 *   3. the vertical gaps between top-level sections (the rhythm)
 *   4. chrome cost: the top bar's height and its share of the viewport
 *
 * SVG text is EXCLUDED: diagram labels are measured in user units and
 * scaled by the viewBox. They are diagram typography, not page
 * typography, and the page's three-size law does not apply to them.
 *
 * Run: node scripts/audit/type-and-rhythm.mjs [baseUrl] [outDir]
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:5188";
const OUT = process.argv[3] || "/tmp/sciti-audit";
// EVERY live route. A massacre that samples half the routes is a sample.
// The list is the routing table in src/routing.ts, plus one city dossier
// (the five tabs are measured as screens of their own below) and one
// canvas, which is a separate surface with its own title.
const ROUTES = [
  "/", "/about", "/creative-economy", "/rankings", "/methodology", "/story",
  "/why", "/showcase", "/partners", "/map", "/asus", "/audit", "/references",
  "/program", "/knowledge", "/discover", "/invest", "/compare", "/bingo",
  "/baseline", "/city/phuket", "/canvas/phuket",
];
const CANON = new Set([32, 14, 11.5]);

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
let totalOff = 0;
let totalStatements = 0;
/** GATE — §11.7: "Display — page title only. One per page." A display-size
 *  sentence that is not the page's <h1>, or a second one, is a violation.
 *  The instrument reported this number for weeks without failing anything,
 *  so a regression could ship quietly. It fails now. */
const gateFailures = [];
/** Routes that could not be loaded are routes that were not measured. */
const failedRoutes = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    // Kill every transition and animation BEFORE measuring. The .reveal
    // entrance moves an element by translateY(20px) while it settles, so a
    // measurement taken mid-transition reports a 20px overlap that does not
    // exist in the built page. A probe fault must never be dressed up as a
    // layout defect.
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
    await page.waitForTimeout(400);

    const m = await page.evaluate(() => {
      const sizes = {};
      const offenders = {};
      const headings = [];
      const displayProse = [];   // a SENTENCE at the display size
      const displayBlocks = [];  // every display-size statement on the page
      const bar = document.querySelector(".topbar");
      const barH = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("svg, .leaflet-container, .site-footer, .topbar, .skip-link, nav, footer, .site-header")) continue;
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
        if (!hasText) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
        if (el.getBoundingClientRect().height === 0) continue;
        const fs = Math.round(parseFloat(cs.fontSize) * 10) / 10;
        sizes[fs] = (sizes[fs] || 0) + 1;
        if (/^H[1-6]$/.test(el.tagName)) {
          headings.push({ tag: el.tagName, fs, w: cs.fontWeight, text: (el.textContent || "").trim().slice(0, 30) });
        }
        if (![32, 14, 11.5].includes(fs)) {
          offenders[fs] = (offenders[fs] || 0) + 1;
        }
        // THE DISPLAY SIZE IS FOR ONE STATEMENT AND FOR NUMERALS. A
        // source scan cannot see the CONTENT, so this is checked here,
        // in the rendered page, where the words are.
        if (fs === 32) {
          const own = [...el.childNodes]
            .filter(n => n.nodeType === 3)
            .map(n => n.textContent.trim())
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          if (!own) continue;
          const words = own.split(" ").filter(w => /[A-Za-z]/.test(w)).length;
          const numerals = (own.match(/[\d.,%]/g) || []).length;
          const isNumeral = numerals >= own.length * 0.4;
          const rec = {
            tag: el.tagName.toLowerCase(),
            cls: String(el.className || "").slice(0, 44),
            words, isNumeral,
            text: own.slice(0, 60),
          };
          displayBlocks.push(rec);
          // A sentence of words at the display size: the page's one
          // statement is allowed; a second one is not.
          if (words >= 2 && !isNumeral) displayProse.push(rec);
        }
      }
      const secs = [...document.querySelectorAll("main > section, main > div > section")];
      const gaps = [];
      let prev = null;
      for (const s of secs) {
        const r = s.getBoundingClientRect();
        if (prev !== null) gaps.push(Math.round(r.top - prev));
        prev = r.bottom;
      }
      // DUPLICATE DISPLAY TEXT. The statement counter below only fires on a
      // 3+-word sentence, so a city name repeated at the display size passed
      // the old instrument unnoticed. One fact, one place, one size.
      const dispSeen = new Map();
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("svg, .leaflet-container, .site-footer, .topbar, nav, footer, .site-header")) continue;
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").replace(/\s+/g, " ").trim();
        if (!own) continue;
        const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
        if (fs < 30) continue;
        const key = own.toLowerCase();
        dispSeen.set(key, [...(dispSeen.get(key) || []), { tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), text: own.slice(0, 40) }]);
      }
      const dupDisplay = [...dispSeen.values()].filter(v => v.length > 1);
      return { sizes, offenders, headings, gaps, barH, displayProse, displayBlocks, dupDisplay };
    });

    const sizeEntries = Object.entries(m.sizes).sort((a, b) => b[0] - a[0]);
    const off = sizeEntries.filter(([s]) => !CANON.has(Number(s)));
    const offCount = off.reduce((a, [, c]) => a + c, 0);
    totalOff += offCount;
    const h1s = m.headings.filter(h => h.tag === "H1");
    const h2s = m.headings.filter(h => h.tag === "H2");
    const h3s = m.headings.filter(h => h.tag === "H3");

    // ONE statement per page — §11.7: "Display — page title only. One per
    // page." The page title is the <h1>. A second sentence at the display
    // size, or a display-size sentence that is NOT the title, is a
    // violation. Codex's 8c7d4b1 made every section heading display-size:
    // 97 statements across twelve routes where the law allows one per
    // page, which is why every section shouted and nothing led the eye.
    const statements = m.displayProse;
    const titles = statements.filter((s) => s.tag === "h1");
    for (const st of statements) {
      console.log(`   DISPLAY STATEMENT: ${st.tag}.${st.cls} — "${st.text}"`);
    }
    if (titles.length > 1) {
      gateFailures.push(`${route}: ${titles.length} display-size titles — one per page is the law`);
    }
    for (const st of statements) {
      if (st.tag === "h1") continue;
      gateFailures.push(`${route}: display-size text that is not the page title — ${st.tag}.${st.cls} "${st.text}"`);
    }
    totalStatements += statements.length;
    // One fact, one place. The same words at the display size twice on one
    // page is repetition the reader can see at a glance. The sentence
    // counter above cannot catch it: a city name is one word.
    for (const v of m.dupDisplay ?? []) {
      console.log(`   DUPLICATE DISPLAY TEXT: "${v[0].text}" ×${v.length} — ${v.map(x => x.tag + "." + x.cls).join(" | ")}`);
      totalStatements += v.length - 1;
    }

    console.log(`\n=== ${route} — ${sizeEntries.length} sizes, ${offCount} off-scale, bar ${m.barH}px`);
    console.log("   sizes: " + sizeEntries.map(([s, c]) => `${s}×${c}`).join(" "));
    console.log(`   h1: ${h1s.length} (${h1s.map(h => h.fs + "/" + h.w).join(", ")}) | h2: ${h2s.length} @${[...new Set(h2s.map(h => h.fs))].join("/")} | h3: ${h3s.length} @${[...new Set(h3s.map(h => h.fs))].join("/")}`);
    if (m.headings.length <= 14) {
      console.log("   tree: " + m.headings.map(h => `${h.tag}@${h.fs}/${h.w}`).join(" "));
    }
    console.log("   gaps: " + m.gaps.join(","));
    if (off.length) console.log("   OFF-SCALE: " + off.map(([s, c]) => `${s}px×${c}`).join(" "));

    // THE TABS ARE SEPARATE SCREENS. The dossier keeps all five panels in
    // the DOM so the print pass can lay them out itself, which means the
    // measurement above sees only the visible one. Each tab is measured
    // as a screen of its own — before this, the Analysis tab's three
    // display-size text statements were invisible to this instrument.
    const tabCount = await page.evaluate(() => document.querySelectorAll(".dossier-tab").length);
    for (let t = 0; t < tabCount; t++) {
      await page.evaluate((n) => document.querySelectorAll(".dossier-tab")[n].click(), t);
      await page.waitForTimeout(450);
      const tab = await page.evaluate(() => {
        const sizes = {}; const offenders = {}; const display = [];
        for (const el of document.querySelectorAll("body *")) {
          if (el.closest("svg, .site-footer, .topbar, nav, footer, .site-header")) continue;
          const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
          if (!own) continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
          if (el.getBoundingClientRect().height === 0) continue;
          const fs = Math.round(parseFloat(cs.fontSize) * 10) / 10;
          sizes[fs] = (sizes[fs] || 0) + 1;
          if (![32, 14, 11.5].includes(fs)) offenders[fs] = (offenders[fs] || 0) + 1;
          if (fs === 32) {
            const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").replace(/\s+/g, " ").trim();
            if (txt) display.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 26), text: txt.slice(0, 34) });
          }
        }
        return { sizes, offenders, display };
      });
      const tabLabel = await page.evaluate((n) => document.querySelectorAll(".dossier-tab")[n].textContent.trim(), t);
      const tabOff = Object.entries(tab.offenders);
      const tabSizes = Object.keys(tab.sizes).sort((a, b) => b - a);
      console.log(`   TAB "${tabLabel}": sizes ${tabSizes.join("/")} · off-scale ${tabOff.length ? tabOff.map(([s, c]) => `${s}px×${c}`).join(" ") : "0"} · display ${tab.display.length}`);
      if (tabOff.length) {
        totalOff += tabOff.reduce((a, [, c]) => a + c, 0);
      }
      // A text statement at the display size is a second announcement.
      const textStatements = tab.display.filter(d => {
        const words = d.text.split(/\s+/).filter(w => /[A-Za-z]{3,}/.test(w)).length;
        const numerals = (d.text.match(/[\d.,%]/g) || []).length;
        return words >= 2 && numerals < d.text.length * 0.4;
      });
      if (textStatements.length) {
        totalStatements += textStatements.length;
        for (const d of textStatements) {
          console.log(`      DISPLAY TEXT STATEMENT IN TAB: ${d.tag}.${d.cls} "${d.text}"`);
          // The city page's <h1> is outside the tab panels, so the sweep sees
          // it in every tab. Anything else at the display size inside a tab
          // is a statement the tab does not own.
          if (d.tag === "h1") continue;
          gateFailures.push(`${route} tab "${tabLabel}": display-size text that is not the page title — ${d.tag}.${d.cls} "${d.text}"`);
        }
      }
    }
    if (tabCount > 1) {
      await page.evaluate(() => document.querySelectorAll(".dossier-tab")[0].click());
      await page.waitForTimeout(250);
    }
  } catch (e) {
    console.log(`=== ${route} FAILED: ${String(e).slice(0, 120)}`);
    // A route that could not be loaded was NOT measured. Reporting that as
    // a pass is how a probe fault gets dressed up as a finding — the
    // instrument used to swallow it, and a dead server read as a clean run.
    failedRoutes.push(route);
    gateFailures.push(`${route}: could not be loaded, so it was not measured — ${String(e).slice(0, 90)}`);
  }
  await ctx.close();
}
await browser.close();
console.log(`\nTOTAL off-scale text nodes: ${totalOff}`);
console.log(`TOTAL display-size statements: ${totalStatements} (one per page is the law)`);
console.log(`ROUTES MEASURED: ${ROUTES.length - failedRoutes.length}/${ROUTES.length}${failedRoutes.length ? " (not measured: " + failedRoutes.join(", ") + ")" : ""}`);
if (totalOff > 0) gateFailures.push(`${totalOff} application text nodes use an off-scale size (Leaflet widget controls excluded)`);
if (gateFailures.length) {
  console.log(`\n✗ GATE FAILED — §11.7, one display statement per page:`);
  for (const f of gateFailures) console.log(`   ${f}`);
  process.exit(1);
}
console.log(`\n✓ GATE PASSED — every display-size statement on every route is the page title.`);
