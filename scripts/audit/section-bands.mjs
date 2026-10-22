/**
 * THE BAND LIST
 * ==============
 * Which sections on this site are BANDS, and which are plain ground.
 *
 * A band is a section with its own painted ground (a background colour).
 * Its padding lives INSIDE that colour, so the reader sees a division at
 * the band's edge and the air belongs to the band.
 *
 * A plain section has no ground of its own. Its padding is invisible air
 * on the page, and it merges with the next section's step into one long
 * run that nothing explains.
 *
 * That distinction decides which sections may keep their padding and
 * which must give it up, so the list is measured in the browser rather
 * than guessed from the stylesheet.
 *
 * Run: node scripts/audit/section-bands.mjs [baseUrl]
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://localhost:5188";
const ROUTES = [
  "/", "/rankings", "/methodology", "/baseline", "/city/phuket", "/invest",
  "/compare", "/story", "/program", "/partners", "/audit", "/why",
  "/discover", "/about", "/references", "/city",
];

const browser = await chromium.launch();
const bandClasses = new Map();   // class → { band: bool, seen: n }
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  const rows = await page.evaluate(() => {
    const opaque = (c) => {
      if (!c || c === "transparent") return false;
      const m = /rgba?\(([^)]+)\)/.exec(c);
      if (!m) return false;
      const p = m[1].split(",").map(s => parseFloat(s));
      return p.length === 4 ? p[3] > 0.02 : true;
    };
    const rgb = (c) => {
      const m = /rgba?\(([^)]+)\)/.exec(c);
      if (!m) return null;
      const p = m[1].split(",").map(s => parseFloat(s));
      return [p[0] || 0, p[1] || 0, p[2] || 0];
    };
    const same = (a, b) => {
      const x = rgb(a), y = rgb(b);
      return x && y && x[0] === y[0] && x[1] === y[1] && x[2] === y[2];
    };
    // the ground immediately behind a section: its parent's effective paint
    const groundBehind = (el) => {
      let n = el.parentElement;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (opaque(bg)) return bg;
        n = n.parentElement;
      }
      return getComputedStyle(document.documentElement).backgroundColor;
    };
    const out = [];
    for (const s of document.querySelectorAll("main section, main > div > section")) {
      const cs = getComputedStyle(s);
      const bg = cs.backgroundColor;
      const painted = opaque(bg) && !same(bg, groundBehind(s));
      out.push({
        classes: (typeof s.className === "string" ? s.className : "").trim().split(/\s+/).filter(Boolean),
        painted, bg,
        padTop: cs.paddingTop, padBottom: cs.paddingBottom,
        marginTop: cs.marginTop, marginBottom: cs.marginBottom,
      });
    }
    return out;
  });
  for (const r of rows) {
    for (const c of r.classes) {
      const cur = bandClasses.get(c) || { band: false, seen: 0, padBottom: new Set(), marginBottom: new Set() };
      cur.seen++;
      if (r.painted) cur.band = true;
      cur.padBottom.add(r.padBottom);
      cur.marginBottom.add(r.marginBottom);
      bandClasses.set(c, cur);
    }
  }
}
await ctx.close();
await browser.close();

const band = [...bandClasses.entries()].filter(([, v]) => v.band).map(([k]) => k).sort();
const plain = [...bandClasses.entries()].filter(([, v]) => !v.band).map(([k, v]) => `${k} (pad-b ${[...v.padBottom].join("|")}, margin-b ${[...v.marginBottom].join("|")})`).sort();

console.log(`BANDS — own a painted ground (${band.length}):`);
console.log("  " + band.join(", "));
console.log(`\nPLAIN — no ground of their own (${plain.length}):`);
for (const p of plain) console.log("  " + p);
