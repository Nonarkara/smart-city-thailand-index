#!/usr/bin/env node
/**
 * Nong Plub's crayon drawings.
 *
 * The source drawings live in scripts/assets/nong-plub-src/. This script
 * gives them the HAND used in miaoshen.nonarkara.org — coloured pencil
 * over a pencil underdrawing on warm paper, with a muted earth palette
 * and a soft uneven line — and writes the result to public/nong-plub/.
 *
 * What differs between that site and this one is the ORDER, not the
 * hand. There the drawing leads and the artefact follows. Here the
 * artefact leads: people must see the most representative photograph of
 * the city first, and the drawing is the human garnish beside it. So the
 * picture stays a picture of a person, and only the surface changes.
 *
 *   node scripts/build-nong-plub-art.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "assets/nong-plub-src");
const OUT = resolve(HERE, "../public/nong-plub");

/* ── the palette, read off the miaoshen drawings ───────────────────────── */
/* Nothing is black. The line is a warm pencil brown, the fills are earth
   colours, and the yellows and cyans of the flat originals come down to
   ochre and dusty blue. */
const MAP = {
  /* the line, and the hair that shares it */
  "#2d2b30": "#5a4a3e",
  "#0f1115": "#463a31",
  "#1e2229": "#4a4038",
  "#020617": "#3f3a34",
  /* skin */
  "#fcd7b6": "#f0c9a4",
  "#fde6cf": "#f5d7b8",
  "#e09f67": "#e0b287",
  "#d79b63": "#d3a479",
  "#b0733d": "#a97f4e",
  "#a4632e": "#9a7444",
  "#8a5327": "#8a6238",
  "#fed7aa": "#f0d6b4",
  "#fdba74": "#e8c9a4",
  /* white becomes paper */
  "#ffffff": "#fbf8f1",
  "#f8fafc": "#f7f2e6",
  "#fcfdfa": "#f6f2e8",
  "#fdfbf7": "#f6f2e8",
  "#fffaf5": "#f6f2e8",
  "#fefce8": "#f6f2e8",
  "#fff7ed": "#f6f2e8",
  "#fdfbf7 ": "#f6f2e8",
  /* the purples come down to a muted plum */
  "#7e3af2": "#8a6bb0",
  "#6c2bd9": "#6a5c70",
  "#a855f7": "#9b86b5",
  /* the yellows come down to ochre */
  "#facc15": "#d9a441",
  "#fde047": "#e6bd68",
  "#fef08a": "#ecd489",
  "#eab308": "#c08a2e",
  "#ca8a04": "#a5762a",
  "#a16207": "#8f6524",
  "#d97706": "#b8862f",
  "#f59e0b": "#c89434",
  /* the cyans come down to dusty blue */
  "#38bdf8": "#7fa3bd",
  "#06b6d4": "#6b8ca8",
  "#0e7490": "#4d6b84",
  "#0891b2": "#5f8099",
  "#0284c7": "#5b7f9b",
  "#0ea5e9": "#7fa3bd",
  /* the greens come down to sage */
  "#16a34a": "#7f9a6e",
  "#10b981": "#6f9070",
  "#059669": "#5f7a52",
  "#4ade80": "#9bb087",
  "#65a30d": "#75905f",
  "#22c55e": "#86a074",
  /* the reds come down to a warm brick */
  "#ef4444": "#b8413a",
  "#dc2626": "#a93a33",
  "#f43f5e": "#c4524a",
  "#fb7185": "#d4786f",
  "#f87171": "#e79a8c",
  "#fca5a5": "#e0a396",
  "#fda4af": "#dfa79c",
  "#e11d48": "#b8413a",
  /* the greys come down to warm stone */
  "#475569": "#5b5850",
  "#334155": "#4d4a43",
  "#1e293b": "#454239",
  "#374151": "#504c44",
  "#64748b": "#8a8578",
  "#94a3b8": "#a8a29a",
  "#cbd5e1": "#d8d2c4",
  "#e2e8f0": "#e4dece",
  /* the warm browns of wood and brick */
  "#7c2d12": "#93422f",
  "#78350f": "#8a6238",
  "#92400e": "#8f6524",
  "#9a3412": "#8f5033",
  "#c2410c": "#b4573f",
  "#ea580c": "#c9662f",
  "#fb923c": "#dd9155",
  "#f0fdfa": "#f2f0e4",
  "#ccfbf1": "#d7e4e2",
  "#e0f2fe": "#dfe6ea",
  "#dcfce7": "#dfe7d6",
  "#bbf7d0": "#cfe0c4",
  "#eedcc5": "#e8d8bd",
};

const PAPER = "#f6f2e8";
const PENCIL = "#6f5f4e";

/* ── the crayon engine ──────────────────────────────────────────────────── */
const crayonFilter = (id) => `
    <!-- COLOURED PENCIL. The shape is pushed about by a noise field so no
         edge is straight, then a fibrous grain is multiplied into it, so
         the fill reads as pencil laid down in strokes rather than as a
         flat vector fill. This is the miaoshen hand. -->
    <filter id="${id}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="3" seed="7" result="wobble" />
      <feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="shaken" />
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" seed="19" result="fibre" />
      <feColorMatrix in="fibre" type="matrix"
        values="0 0 0 0 0.44  0 0 0 0 0.38  0 0 0 0 0.30  0 0 0 0.16 0" result="fibreTint" />
      <feComposite in="fibreTint" in2="shaken" operator="in" result="fibreOnShape" />
      <feBlend in="shaken" in2="fibreOnShape" mode="multiply" />
    </filter>
    <!-- The sheet the drawing is on. It is not white. -->
    <filter id="paper-${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="23" result="noise" />
      <feColorMatrix in="noise" type="matrix"
        values="0 0 0 0 0.56  0 0 0 0 0.50  0 0 0 0 0.42  0 0 0 0.05 0" />
      <feComposite operator="in" in2="SourceGraphic" />
    </filter>`;

const PAPER_GROUND = (id, w, h) => `
    <!-- the paper -->
    <rect width="${w}" height="${h}" fill="${PAPER}" />
    <rect width="${w}" height="${h}" fill="${PAPER}" filter="url(#paper-${id})" />`;

/* The flat originals framed the figure in a DASHED circle — a sticker
   device. A drawn page does not have one. The circle stays, but it is
   now a soft pencil ring laid down by hand. */
const VIGNETTE = (fill) => `
    <!-- the place, loosely: a drawn vignette rather than a sticker rim -->
    <circle cx="160" cy="200" r="143" fill="${fill}" opacity="0.42" />
    <circle cx="160" cy="200" r="143" fill="none" stroke="${PENCIL}" stroke-width="1.6" opacity="0.3" stroke-linecap="round" />`;

const remap = (svg) => {
  let out = svg;
  for (const [from, to] of Object.entries(MAP)) {
    out = out.split(from.toLowerCase()).join(to);
    out = out.split(from.toUpperCase()).join(to);
  }
  return out;
};

const build = (file) => {
  const raw = readFileSync(resolve(SRC, file), "utf8");
  const name = file.replace("nong-plub-", "").replace(".svg", "");
  const id = `crayon-${name}`;
  let svg = remap(raw);

  /* 1 ── the filter becomes a real coloured-pencil filter */
  const filterRe = new RegExp(`<filter id="${id}"[^>]*>[\\s\\S]*?</filter>`);
  if (!filterRe.test(svg)) throw new Error(`${file}: no ${id} filter found`);
  svg = svg.replace(filterRe, crayonFilter(id).trim());

  /* 2 ── the paper goes under everything */
  const auraRe = new RegExp(`<circle cx="160" cy="200" r="145"[^>]*/>`);
  const aura = svg.match(auraRe);
  if (aura) {
    const tint = (aura[0].match(/fill="(#[0-9a-fA-F]{6})"/) || [])[1] || "#f0e6d2";
    svg = svg.replace(auraRe, VIGNETTE(tint).trim());
  }

  /* 3 ── the paper rect goes in front of the defs, behind the drawing */
  const vb = (svg.match(/viewBox="0 0 (\d+) (\d+)"/) || [, "320", "400"]);

  /* 4 ── no dashed rims anywhere. A drawn page does not have a sticker
      border, and a dashed ochre ring was the last of it. */
  svg = svg.replace(/stroke-dasharray="[^"]*"\s*/g, "");
  svg = svg.replace(/(<circle[^>]*?)stroke="#[0-9a-fA-F]{6}"/g, (m, head) => `${head}stroke="${PENCIL}"`);

  svg = svg.replace("</defs>", `</defs>\n  <g filter="url(#${id})">\n  ${PAPER_GROUND(id, vb[1], vb[2]).trim()}`);
  /* close that group at the end of the file */
  svg = svg.replace(/<\/svg>\s*$/, "  </g>\n</svg>\n");

  return svg;
};

mkdirSync(OUT, { recursive: true });
for (const file of [
  "nong-plub-heritage.svg",
  "nong-plub-temple.svg",
  "nong-plub-urban.svg",
  "nong-plub-cafe.svg",
  "nong-plub-nature.svg",
  "nong-plub-avatar.svg",
]) {
  const svg = build(file);
  writeFileSync(resolve(OUT, file), svg);
  console.log("wrote", file, `${svg.length} bytes`);
}
