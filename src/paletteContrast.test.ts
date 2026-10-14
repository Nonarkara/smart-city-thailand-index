// ---------------------------------------------------------------------------
// Palette contrast guard
// ---------------------------------------------------------------------------
// The Sanzo Wada × Dr Non palette (commit 0eaa53a) is graphic-first: several
// hues are deliberately bright for fills and strips. Those same hues cannot
// be used as text — economy sits at 2.13:1 on white and hospitality at 1.92:1,
// both well under the WCAG AA 4.5:1 floor for body copy.
//
// The rule this test enforces: any token that carries type must have a
// documented contrast-safe companion, and the companion must actually clear
// 4.5:1 against the surfaces it is used on. This is the CI guard for the
// bug class, not a snapshot of today's numbers.
// ---------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PILLAR_COLORS, PILLAR_TEXT_COLORS } from "./types";

const stylesCss = readFileSync(join(process.cwd(), "src/styles.css"), "utf8");

// ── WCAG 2.1 relative luminance and contrast ratio ──────────────────────────
function srgbToLinear(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map(c => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrast(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const WHITE = "#ffffff";
const SURFACE = "#f6f8fa"; // --surface, light theme
const AA_TEXT = 4.5;

/** Pull a hex value out of a `:root`-adjacent CSS custom property. */
function cssToken(name: string): string {
  const match = stylesCss.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!match) throw new Error(`CSS token --${name} not found in styles.css`);
  return match[1];
}

describe("palette contrast — text companions clear WCAG AA", () => {
  it("--beta-text clears 4.5:1 on white and on --beta-bg", () => {
    const betaText = cssToken("beta-text");
    const betaBg = cssToken("beta-bg");
    expect(contrast(betaText, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(betaText, betaBg)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("--gold-ink clears 4.5:1 on white", () => {
    expect(contrast(cssToken("gold-ink"), WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("--gold-text clears 4.5:1 on white", () => {
    expect(contrast(cssToken("gold-text"), WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("each pillar text hue clears 4.5:1 on white and --surface", () => {
    for (const pillar of Object.keys(PILLAR_TEXT_COLORS) as Array<keyof typeof PILLAR_TEXT_COLORS>) {
      const color = PILLAR_TEXT_COLORS[pillar];
      expect(contrast(color, WHITE), `${pillar} text on white`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(color, SURFACE), `${pillar} text on --surface`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  it("every pillar has both a graphic hue and a text hue", () => {
    expect(Object.keys(PILLAR_TEXT_COLORS).sort()).toEqual(Object.keys(PILLAR_COLORS).sort());
  });

  it("only the pillars whose fill fails as type get a stepped-down companion", () => {
    // The companion map is uniform across all seven so callers never branch,
    // but a value is only allowed to differ from its fill when the fill
    // genuinely fails as text. Safety, wellbeing and digital are already
    // AA-safe as fills, so their companions are the same hex — anything else
    // would mean darkening a colour that did not need it.
    for (const pillar of Object.keys(PILLAR_TEXT_COLORS) as Array<keyof typeof PILLAR_TEXT_COLORS>) {
      const fillFailsAsText = contrast(PILLAR_COLORS[pillar], WHITE) < AA_TEXT;
      const differs = PILLAR_TEXT_COLORS[pillar].toLowerCase() !== PILLAR_COLORS[pillar].toLowerCase();
      expect(
        differs,
        `${pillar}: companion ${PILLAR_TEXT_COLORS[pillar]} ${fillFailsAsText ? "should differ from" : "should match"} fill ${PILLAR_COLORS[pillar]}`,
      ).toBe(fillFailsAsText);
    }
  });

  it("documents which pillar fills are unsafe as type, so the tradeoff is explicit", () => {
    // economy and hospitality are the two that fail hardest as text. If a
    // future palette pass makes every fill AA-safe, this test tells us to
    // revisit the split rather than leave a redundant token pair behind.
    const unsafeAsText = (Object.keys(PILLAR_COLORS) as Array<keyof typeof PILLAR_COLORS>).filter(
      p => contrast(PILLAR_COLORS[p], WHITE) < AA_TEXT,
    );
    expect(unsafeAsText.sort()).toEqual(["economy", "hospitality", "livability", "environment"].sort());
  });
});