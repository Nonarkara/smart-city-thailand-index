#!/usr/bin/env node
/**
 * NONG PLUB — THE FIGURE, CUT FREE FROM THE PAPER
 * ===============================================
 * The drawings in public/nong-plub/ are drawings ON a sheet of warm paper:
 * a sheet rectangle behind everything, a soft tinted vignette, and a drawn
 * ground line. That is right for a picture in a frame, and wrong for a
 * character who is supposed to be standing in a photograph.
 *
 * This script cuts the figure out of the sheet:
 *
 *   - the paper rectangles go;
 *   - the tinted vignette disc and its drawn ring go — a halo is a sticker
 *     device, and a figure with a halo in a photograph reads as pasted on;
 *   - the drawn ground line goes — she stands on the photograph's ground,
 *     not on a line somebody drew;
 *   - a soft contact shadow is laid down at her feet, because that is
 *     what seats a figure in a scene rather than on top of one.
 *
 * The result is rasterised by Chromium, because the crayon hand lives in
 * SVG filters (turbulence, displacement) and only a real browser renders
 * them faithfully. The PNG keeps a transparent ground; a WebP sibling is
 * written beside it because the site ships both.
 *
 *   node scripts/build-nong-plub-figure.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = resolve(HERE, "../public/nong-plub");
const OUT = resolve(SVG_DIR, "figure");

/** Where her feet are, per scene, and whether she is on the ground at all.
 *  The cafe scene is her sitting at a table — a shadow under a chair she
 *  is not standing on would be a lie about the drawing. */
const GROUND = {
  urban:    { cy: 354, rx: 58, ry: 8 },
  heritage: { cy: 354, rx: 58, ry: 8 },
  temple:   { cy: 354, rx: 58, ry: 8 },
  nature:   { cy: 356, rx: 64, ry: 8 },
  cafe:     null,
};

const SCENES = Object.keys(GROUND);

/** What is scenery and what is her.
 *
 *  Each drawing is a small world: a brick wall behind her at the old city,
 *  a sky and railway tracks at the highland station, temple roofs and a
 *  parasol behind her, a café table she sits at. In a picture on a sheet
 *  that is the drawing. Over a photograph those things would float — a
 *  rectangle of brick wall lying on a street — so they are cut away and
 *  only she is kept.
 *
 *  The units are counted inside the drawing group, a nested group counting
 *  as one unit, and the two boundary units are ASSERTED: if a source
 *  drawing is redrawn and its parts move, this script stops rather than
 *  quietly cutting the wrong thing out of it. */
const FIGURE = {
  /* her hair is the first thing she draws with */
  urban:    { from: 2,  to: 47, first: "M 115 150", last: "M 114 135" },
  /* the earring on her ear is the last thing in her drawing */
  heritage: { from: 3,  to: 34, first: "M 125 150", last: 'cx="198" cy="125" r="2"' },
  /* the glint on the sunglasses resting on her cap */
  temple:   { from: 4,  to: 51, first: "M 115 150", last: 'x1="168" y1="121"' },
  /* her collar */
  nature:   { from: 4,  to: 36, first: "M 142 295", last: "M 152 155" },
  /* her hair; she is sitting, so the drawing ends at her hem */
  cafe:     { from: 8,  to: 37, first: "M 115 145", last: "M 265 110" },
};

/** The drawing group is the LAST <g filter="url(#crayon-X)"> in the file.
 *  Its children are the drawing; a nested group counts as one unit. */
function drawingUnits(svg, name) {
  const marker = `<g filter="url(#crayon-${name})">`;
  const at = svg.lastIndexOf(marker);
  if (at < 0) throw new Error(`${name}: no drawing group`);
  const inner = svg.slice(at + marker.length);
  const end = inner.lastIndexOf("</g>");
  const body = inner.slice(0, end);

  const units = [];
  const re = /<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(body))) {
    const [, close, tag, attrs, selfClose] = m;
    if (tag === "g" && !close && !selfClose) {
      let depth = 1;
      const inner2 = /<(\/?)g\b([^>]*?)(\/?)>/g;
      inner2.lastIndex = re.lastIndex;
      let im;
      while ((im = inner2.exec(body))) {
        if (!im[1] && !im[3]) depth++;
        else if (im[1]) { depth--; if (depth === 0) break; }
      }
      const closeEnd = inner2.lastIndex + (body[inner2.lastIndex] === ">" ? 1 : 0);
      units.push({ tag: "g", attrs: attrs.trim(), text: body.slice(m.index, closeEnd) });
      re.lastIndex = closeEnd;
      continue;
    }
    units.push({ tag, attrs: attrs.trim(), text: m[0] });
  }
  return units;
}

/** Rebuild the SVG around the drawing group, keeping only her. */
const cut = (svg, name) => {
  const spec = FIGURE[name];
  if (!spec) throw new Error(`${name}: no figure specification`);
  const units = drawingUnits(svg, name);

  const first = units[spec.from];
  const last = units[spec.to];
  if (!first || !last) throw new Error(`${name}: unit range ${spec.from}..${spec.to} is out of range (${units.length} units)`);
  if (!first.attrs.includes(spec.first)) {
    throw new Error(`${name}: unit ${spec.from} is not what the specification expects — the drawing was redrawn and this script must be re-pointed`);
  }
  if (!last.attrs.includes(spec.last)) {
    throw new Error(`${name}: unit ${spec.to} is not what the specification expects — the drawing was redrawn and this script must be re-pointed`);
  }

  const kept = units.slice(spec.from, spec.to + 1).map(u => u.text).join("\n    ");

  /* everything up to and including the drawing group's opening tag, then
     her, then the group's closing tag */
  const marker = `<g filter="url(#crayon-${name})">`;
  const at = svg.lastIndexOf(marker);
  const head = svg.slice(0, at + marker.length);
  const defsEnd = head.indexOf("</defs>");
  const defs = head.slice(0, defsEnd + 7);
  const openSvg = head.slice(0, head.indexOf("<defs>"));

  const g = GROUND[name];
  const shadow = g ? contactShadow(g) : "";

  return `${openSvg}${defs}\n  <g filter="url(#crayon-${name})">\n    ${shadow}\n    ${kept}\n  </g>\n</svg>\n`;
};

/** A soft contact shadow at her feet. It is part of the drawing, so it is
 *  baked into the file — no CSS shadow, no extra layer to place. */
const contactShadow = (g) => `
    <!-- the contact shadow: what seats a figure in a scene -->
    <ellipse cx="160" cy="${g.cy}" rx="${g.rx}" ry="${g.ry}" fill="#3a2f26" opacity="0.26" filter="url(#contact-${g.cy})" />
    <filter id="contact-${g.cy}" x="-40%" y="-160%" width="180%" height="420%">
      <feGaussianBlur stdDeviation="5.5" />
    </filter>`;

const build = (name) => {
  const file = `nong-plub-${name}.svg`;
  return cut(readFileSync(resolve(SVG_DIR, file), "utf8"), name);
};

const page_html = (svg) => `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent}svg{display:block;width:320px;height:400px}</style>
${svg}`;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 320, height: 400 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

for (const name of SCENES) {
  const svg = build(name);
  await page.setContent(page_html(svg), { waitUntil: "load" });
  await page.waitForTimeout(120);
  const raw = await page.screenshot({ omitBackground: true });

  /* Trim the transparent margin so the file is the figure and nothing
     else — the layout sizes her by height, and a padded file would make
     that height mean something different on every screen. */
  const trimmed = await sharp(raw).trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(trimmed).metadata();

  const png = resolve(OUT, `nong-plub-${name}.png`);
  const webp = resolve(OUT, `nong-plub-${name}.webp`);
  await sharp(trimmed).png({ compressionLevel: 9, palette: true }).toFile(png);
  await sharp(trimmed).webp({ quality: 82, alphaQuality: 90 }).toFile(webp);

  const alpha = await sharp(trimmed).ensureAlpha().stats();
  console.log(
    `OK  nong-plub-${name}  ${meta.width}×${meta.height}px  ` +
    `alpha[min ${alpha.channels[3].min}, max ${alpha.channels[3].max}]`
  );
}

await browser.close();
console.log(`\n${SCENES.length} figures written to public/nong-plub/figure/`);
