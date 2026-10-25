/**
 * IS ANY PARAGRAPH PRINTED TWICE ON ONE PAGE?
 * ===========================================
 * The mechanical tell is not a single repeated sentence — it is a reader
 * scrolling a page and meeting the same words again. For the 68 cities
 * without hand-written context, three voices were rendered in two places
 * each: the factbook rows and the texture cards wanted the same text.
 *
 * This reads the rendered page, takes every paragraph-like block, and
 * reports any block that appears twice — or that is contained inside
 * another block, which is the same repetition wearing a hat.
 *
 * Run: node scripts/audit/probe-repeat-blocks.mjs [baseUrl] [locale]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const LOCALE = process.argv[3] || "en";

const ROUTES = [
  "/city/reg-ayutthaya/",
  "/city/reg-lampang-pao/",
  "/city/reg-phayao/",
  "/city/reg-samut-sakhon/",
  "/city/reg-bangkok-noi/",
  "/city/phuket/",
  "/city/chiang-mai-old-town/",
];

const SELECTORS = [
  ".city-factbook-value",
  ".city-factbook-note",
  ".city-research-body",
  ".city-dossier-summary",
  ".city-dossier-thesis",
  ".city-dossier-card-body",
  ".city-dossier-card-meta",
  ".city-analog-copy",
  ".city-profile-read p",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addInitScript(loc => {
  window.localStorage.setItem("smart-city-thailand-locale", loc);
}, LOCALE);
const page = await ctx.newPage();

let repeats = 0;
let checks = 0;

for (const route of ROUTES) {
  const res = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (!res || res.status() !== 200) {
    console.log(`  ${route} → HTTP ${res ? res.status() : "no response"}`);
    continue;
  }
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(200);

  const blocks = await page.evaluate(sels => {
    const out = [];
    for (const sel of sels) {
      for (const el of document.querySelectorAll(sel)) {
        // NOT filtered by visibility. The dossier keeps every tab in the
        // DOM and hides the inactive ones with CSS, so a visibility filter
        // would silently skip the whole Analysis tab and the probe would
        // report nothing at all. The text of a hidden panel is still the
        // text a reader sees when they open that tab.
        const t = (el.textContent || "").trim().replace(/\s+/g, " ");
        if (t.length < 40) continue;
        out.push({ sel, text: t });
      }
    }
    return out;
  }, SELECTORS);

  checks++;
  const seen = new Map();
  for (const b of blocks) {
    if (seen.has(b.text)) {
      repeats++;
      console.log(`\n  ${route}`);
      console.log(`    EXACT REPEAT  ${seen.get(b.text).sel} == ${b.sel}`);
      console.log(`      "${b.text.slice(0, 170)}"`);
    } else {
      seen.set(b.text, b);
    }
  }
  // A block fully contained in another block is the same repetition.
  const texts = blocks.map(b => b.text);
  for (const b of blocks) {
    for (const other of texts) {
      if (other === b.text) continue;
      if (other.length > b.text.length && other.includes(b.text)) {
        repeats++;
        console.log(`\n  ${route}`);
        console.log(`    NESTED REPEAT  "${b.text.slice(0, 130)}"`);
        console.log(`      inside       "${other.slice(0, 130)}"`);
        break;
      }
    }
  }
}

console.log(`\n${"=".repeat(72)}`);
console.log(`pages checked: ${checks}   repeated blocks: ${repeats}`);
console.log(repeats === 0
  ? "PASS — no paragraph is printed twice on any page"
  : "FINDINGS ABOVE");
await ctx.close();
await browser.close();
