/**
 * THE MASSAACRE SWEEP
 * ===================
 * Checks the things the existing instruments do not:
 *   1. FLOATING CONTROL COLLISION — a fixed element painted over body text.
 *   2. DUPLICATE DISPLAY TEXT — the same words at 32px twice on one page.
 *      (The type audit only counts 3+-word sentences, so a repeated city
 *      name sailed straight through it.)
 *   3. THAI IN A TRACKED RUN — letter-spacing on Thai breaks the script's
 *      connecting strokes; it is a typographic defect in Thai.
 *   4. OVERLAPPING TEXT — two text boxes painted over each other.
 *
 * Run: node scripts/audit/collide.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5188";
const LOCALES = (process.argv[3] || "en,th").split(",");
const ROUTES = [
  "/", "/about", "/creative-economy", "/rankings", "/methodology", "/story",
  "/why", "/showcase", "/partners", "/map", "/asus", "/audit", "/references",
  "/program", "/knowledge", "/discover", "/invest", "/compare", "/bingo",
  "/baseline", "/city/phuket", "/canvas/phuket",
];
const VIEWPORTS = [390, 1440];

const browser = await chromium.launch();
let collisions = 0, dupes = 0, thaiTrack = 0, overlaps = 0;

for (const route of ROUTES) {
 for (const locale of LOCALES) {
  for (const width of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2200);
      if (locale !== "en") {
        // The site keeps the locale on <html lang>; switch it the way a reader does.
        await page.evaluate((want) => {
          const btn = [...document.querySelectorAll("button, a")].find(b => new RegExp(`^(${want.toUpperCase()}|${want === "th" ? "ไทย" : "中文"})$`, "i").test((b.textContent || "").trim()));
          if (btn) btn.click();
        }, locale);
        await page.waitForTimeout(1800);
      }
      await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
      await page.waitForTimeout(300);

      const r = await page.evaluate(() => {
        const out = { fabCollisions: [], dupDisplay: [], thaiTracked: [], overlaps: [] };
        const THAI = /[\u0E00-\u0E7F]/;
        const TEXTISH = new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TD", "TH", "A", "BUTTON", "STRONG", "EM", "SMALL", "LABEL", "FIGCAPTION", "DT", "DD", "BLOCKQUOTE", "SUMMARY", "CODE", "TIME", "DIV"]);

        // 1. Floating control painted over text.
        const floats = [...document.querySelectorAll(".chat-fab, .chat-panel, .back-to-top, [class*='fab']")]
          .filter(el => {
            const cs = getComputedStyle(el);
            if (cs.position !== "fixed" && cs.position !== "sticky") return false;
            return cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.1 && el.getBoundingClientRect().width > 0;
          });
        const textNodes = [...document.querySelectorAll("body *")].filter(el => {
          if (el.closest(".chat-fab, .chat-panel, .site-footer, .topbar, svg")) return false;
          const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
          if (!own) return false;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
          return el.getBoundingClientRect().height > 4;
        });
        for (const f of floats) {
          const fr = f.getBoundingClientRect();
          for (const t of textNodes) {
            const tr = t.getBoundingClientRect();
            if (tr.bottom < 0 || tr.top > innerHeight) continue; // only what is on screen
            const ox = Math.min(fr.right, tr.right) - Math.max(fr.left, tr.left);
            const oy = Math.min(fr.bottom, tr.bottom) - Math.max(fr.top, tr.top);
            if (ox > 2 && oy > 2) {
              out.fabCollisions.push({
                float: String(f.className).slice(0, 30),
                over: t.tagName + "." + String(t.className || "").slice(0, 28),
                text: (t.textContent || "").trim().slice(0, 40),
                area: Math.round(ox * oy),
                px: `${Math.round(ox)}×${Math.round(oy)}`,
              });
              break;
            }
          }
        }

        // 2. Duplicate display-size text.
        //    Distance matters: two display-size statements a reader can see
        //    at once read as repetition; the same figure repeated a screen
        //    apart, where the second instance ADDS the breakdown, reads as
        //    summary-then-evidence. Both are reported; the gap decides.
        const disp = [];
        for (const el of document.querySelectorAll("body *")) {
          if (el.closest("svg, .site-footer, .topbar, nav, footer, .site-header")) continue;
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").replace(/\s+/g, " ").trim();
          if (!own) continue;
          const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
          if (fs < 30) continue;
          const r = el.getBoundingClientRect();
          disp.push({ key: own.toLowerCase(), tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), text: own.slice(0, 40), top: Math.round(r.top + scrollY), fs });
        }
        const seen = new Map();
        for (const d of disp) seen.set(d.key, [...(seen.get(d.key) || []), d]);
        for (const [, v] of seen) {
          if (v.length < 2) continue;
          const gaps = [];
          for (let i = 1; i < v.length; i++) gaps.push(Math.abs(v[i].top - v[i - 1].top));
          const nearest = Math.min(...gaps);
          out.dupDisplay.push({ v, nearest });
        }

        // 3. Thai text inside a tracked (letter-spaced) run.
        for (const el of document.querySelectorAll("body *")) {
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("");
          if (!THAI.test(own)) continue;
          const cs = getComputedStyle(el);
          const ls = parseFloat(cs.letterSpacing);
          if (ls > 0.01) {
            out.thaiTracked.push({
              tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34),
              ls: ls.toFixed(3), text: own.trim().slice(0, 34),
            });
          }
        }

        // 4. Text painted over text — measured as INK, not boxes.
        //    An element's bounding box can overlap its neighbour while the
        //    glyphs sit clear (a tall paragraph with slack under the last
        //    line, a button pulled up by a margin). Only the line boxes
        //    from Range.getClientRects() are actual painted text, so only
        //    those are compared. Measuring boxes produced 3,419 phantom
        //    overlaps on /invest and zero real ones.
        //
        //    But geometry alone is not "painted". Three cases report a box
        //    for ink that is never drawn, and all three produced thousands
        //    of phantom pairs:
        //      · content inside a CLOSED <details> — hidden with
        //        content-visibility, so nothing is painted, yet
        //        getClientRects() still returns layout geometry;
        //      · <option> inside a <select> — the options live in a
        //        dropdown list, not the flow, and their range reports the
        //        select's own box;
        //      · a section with `content-visibility: auto` that is still
        //        off screen — the browser lays it out at its
        //        contain-intrinsic-size placeholder, so its children
        //        report positions the real content never occupies.
        //        Scrolling the section into view moved the density strip
        //        2,301px and left ZERO real overlaps, which is what
        //        settled it.
        //    checkVisibility() — with contentVisibilityAuto — is the
        //    browser's own answer to "is this actually painted", so the
        //    instrument asks it rather than guessing.
        //
        //    AND the box a Range reports is a FONT BOX, not an ink box.
        //    For a 32px mono numeral the range rect is ~42px tall — the
        //    font's ascent and descent — while the glyphs occupy about
        //    22px of it. Two stacked elements can therefore report a 5px
        //    "overlap" while the digits and the label above them are
        //    plainly clear of each other on screen.
        //
        //    The instrument therefore converts every range rect into its
        //    true ink band using the browser's own text metrics: canvas
        //    measureText() reports actualBoundingBoxAscent/Descent (the
        //    glyph extent) and fontBoundingBoxAscent (where the baseline
        //    sits inside the rect). What is compared is where the ink is,
        //    not where the font's leading is.
        const measureCanvas = document.createElement("canvas");
        const mctx = measureCanvas.getContext("2d");
        const inkCache = new Map();

        /**
         * The box a Range reports is a FONT BOX, not an ink box.
         * For a 32px mono numeral the range rect is ~42px tall — the
         * font's ascent and descent — while the glyphs occupy about
         * 22px of it. Two stacked elements can therefore report a 5px
         * "overlap" while the digits and the label above them are
         * plainly clear of each other on screen.
         *
         * The instrument converts every range rect into its true ink band
         * using the browser's own text metrics: canvas measureText()
         * reports actualBoundingBoxAscent/Descent (the glyph extent)
         * and fontBoundingBoxAscent (where the baseline sits inside the
         * rect). What is compared is where the ink is, not where the
         * font's leading is.
         */
        function inkBand(el, rect, text) {
          const cs = getComputedStyle(el);
          const key = `${cs.fontStyle}|${cs.fontVariant}|${cs.fontWeight}|${cs.fontSize}|${cs.fontFamily}|${text}`;
          let m = inkCache.get(key);
          if (!m) {
            mctx.font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
            m = mctx.measureText(text || "Ag");
            inkCache.set(key, m);
          }
          const size = parseFloat(cs.fontSize) || 16;
          const asc = m.fontBoundingBoxAscent || size * 0.8;
          const inkAsc = m.actualBoundingBoxAscent;
          const inkDesc = m.actualBoundingBoxDescent;
          if (!Number.isFinite(inkAsc) || !Number.isFinite(inkDesc) || (inkAsc === 0 && inkDesc === 0)) {
            return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          }
          const baseline = rect.top + asc;
          return {
            left: rect.left,
            right: rect.right,
            top: baseline - inkAsc,
            bottom: baseline + inkDesc,
          };
        }

        /**
         * The box the text is actually PAINTED inside.
         *
         * A Range reports a rect for every laid-out line, including lines
         * that a clamp or an overflow rule keeps from being drawn:
         * `-webkit-line-clamp: 3` clips the painting but the layout still
         * has a fourth and fifth line, and their rects sit over whatever
         * is below. That produced 53 phantom overlaps on the homepage,
         * where a three-line news summary was reported as covering its
         * own source line.
         *
         * So the band is clipped to the padding box of every ancestor
         * that clips, which is exactly the region the browser paints in.
         */
        function clipBox(el) {
          let box = null;
          let node = el;
          while (node && node !== document.body && node !== document.documentElement) {
            const cs = getComputedStyle(node);
            if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible") {
              const b = node.getBoundingClientRect();
              const c = {
                left: b.left + node.clientLeft,
                top: b.top + node.clientTop,
                right: b.left + node.clientLeft + node.clientWidth,
                bottom: b.top + node.clientTop + node.clientHeight,
              };
              if (!box) box = c;
              else {
                box.left = Math.max(box.left, c.left);
                box.top = Math.max(box.top, c.top);
                box.right = Math.min(box.right, c.right);
                box.bottom = Math.min(box.bottom, c.bottom);
              }
            }
            node = node.parentElement;
          }
          return box;
        }

        function applyClip(rect, box) {
          if (!box) return rect;
          const left = Math.max(rect.left, box.left);
          const right = Math.min(rect.right, box.right);
          const top = Math.max(rect.top, box.top);
          const bottom = Math.min(rect.bottom, box.bottom);
          if (right - left <= 0 || bottom - top <= 0) return null;
          return { left, right, top, bottom };
        }

        const inkRects = [];
        for (const el of textNodes) {
          if (!TEXTISH.has(el.tagName)) continue;
          if (el.closest("details:not([open])")) continue;
          if (el.closest("select")) continue;
          const cs = getComputedStyle(el);
          if (cs.position === "fixed" || cs.position === "absolute") continue;
          let visible = true;
          try {
            visible = el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true });
          } catch {
            visible = cs.display !== "none" && cs.visibility !== "hidden";
          }
          if (!visible) continue;
          const clip = clipBox(el);
          const range = document.createRange();
          const rects = [];
          for (const node of el.childNodes) {
            if (node.nodeType !== 3 || !node.textContent.trim()) continue;
            try {
              range.selectNodeContents(node);
              for (const r of range.getClientRects()) {
                if (r.width > 1 && r.height > 1) {
                  const band = applyClip(inkBand(el, r, node.textContent), clip);
                  if (band) rects.push(band);
                }
              }
            } catch { /* detached node */ }
          }
          if (rects.length) inkRects.push({ el, rects });
        }
        // Prefilter by vertical proximity so the pair test stays cheap.
        inkRects.sort((x, y) => Math.min(...x.rects.map(r => r.top)) - Math.min(...y.rects.map(r => r.top)));
        for (let i = 0; i < inkRects.length; i++) {
          const a = inkRects[i];
          const aTop = Math.min(...a.rects.map(r => r.top));
          const aBottom = Math.max(...a.rects.map(r => r.bottom));
          for (let j = i + 1; j < inkRects.length; j++) {
            const b = inkRects[j];
            const bTop = Math.min(...b.rects.map(r => r.top));
            if (bTop > aBottom + 6) break;
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
            let hit = null;
            for (const ra of a.rects) {
              for (const rb of b.rects) {
                const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
                const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
                // 2px, because the band is derived from font metrics and
                // carries its own error of about a pixel. Below that the
                // instrument cannot tell a contact from a graze. The one
                // finding this threshold excluded was checked by hand: a
                // 1.4px reported contact between the Thai hero kicker and
                // the Sao Chingcha title, and a photograph of the two
                // shows clear space between them.
                if (ox > 2 && oy > 2) { hit = { ox: Math.round(ox), oy: Math.round(oy) }; break; }
              }
              if (hit) break;
            }
            if (hit) {
              out.overlaps.push({
                a: a.el.tagName + "." + String(a.el.className || "").slice(0, 22) + ` "${(a.el.textContent || "").trim().slice(0, 22)}"`,
                b: b.el.tagName + "." + String(b.el.className || "").slice(0, 22) + ` "${(b.el.textContent || "").trim().slice(0, 22)}"`,
                px: `${hit.ox}×${hit.oy}`,
              });
            }
          }
        }
        return out;
      });
      const tag = `${route}@${locale}@${width}`;
      if (r.fabCollisions.length) {
        collisions += r.fabCollisions.length;
        console.log(`\n[${tag}] FLOAT CONTROL OVER TEXT — ${r.fabCollisions.length}`);
        for (const c of r.fabCollisions) console.log(`   ${c.float} over ${c.over} (${c.px}px) "${c.text}"`);
      }
      if (r.dupDisplay.length) {
        dupes += r.dupDisplay.length;
        console.log(`\n[${tag}] DUPLICATE DISPLAY TEXT — ${r.dupDisplay.length}`);
        for (const d of r.dupDisplay) {
          const coVisible = d.nearest < 1200;
          console.log(`   "${d.v[0].text}" x${d.v.length}  gap=${d.nearest}px ${coVisible ? "*** CO-VISIBLE — DEFECT" : "(far apart — summary→detail)"}`);
          console.log(`      ${d.v.map(x => `${x.tag}.${x.cls}@${x.top}`).join(" | ")}`);
        }
      }
      if (r.thaiTracked.length) {
        thaiTrack += r.thaiTracked.length;
        console.log(`\n[${tag}] THAI IN A TRACKED RUN — ${r.thaiTracked.length}`);
        for (const t of r.thaiTracked.slice(0, 8)) console.log(`   ${t.tag}.${t.cls} ls=${t.ls} "${t.text}"`);
      }
      if (r.overlaps.length) {
        overlaps += r.overlaps.length;
        console.log(`\n[${tag}] TEXT OVER TEXT — ${r.overlaps.length}`);
        for (const o of r.overlaps.slice(0, 8)) console.log(`   ${o.px}px  ${o.a}  ×  ${o.b}`);
      }
    } catch (e) {
      console.log(`${route}@${locale}@${width} FAILED ${String(e).slice(0, 80)}`);
    } finally {
      await ctx.close();
    }
  }
 }
}
await browser.close();
console.log(`\n================ MASSACRE SWEEP ================`);
console.log(`floating-control collisions : ${collisions}`);
console.log(`duplicate display text      : ${dupes}`);
console.log(`Thai in a tracked run        : ${thaiTrack}`);
console.log(`text painted over text       : ${overlaps}`);
