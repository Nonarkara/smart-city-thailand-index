import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * THE TYPE LAW — a guard, not a description
 * =========================================
 * §11.7 of the house law: a page may have at most three distinct text
 * sizes. The canonical SCITI scale is:
 *
 *   display  var(--text-display)  32px  the page's one statement + numerals
 *   body     var(--text-body)     14px  everything else
 *   micro    var(--text-micro)    11px  eyebrows, ticks, tiny meta
 *
 * The scale shipped with four steps and section headings at five
 * different sizes and <h3> at three, which left every page reading as
 * the same flat field of text. This test exists so that cannot come
 * back: a new rule that invents a fourth size fails here rather than
 * shipping.
 *
 * It scans the source, not the rendered page — the rendered truth is
 * checked by scripts/audit/type-and-rhythm.mjs, which measures the real
 * computed sizes in a browser. Both are needed: the source scan catches
 * a bad rule before it is seen, the browser catches a bad cascade.
 *
 * Each size is read WITH THE RULE THAT DECLARED IT. A guard that only
 * knows the numbers cannot tell a reading page from a game board, and
 * would either wave through a real fourth size on /bingo or force the
 * board's tiles to a size that overflows them.
 */

const ROOT = path.resolve(__dirname, "..");
const CSS = path.join(ROOT, "src", "styles.css");

const CANON = new Set(["var(--text-display)", "var(--text-body)", "var(--text-micro)"]);

/**
 * Surfaces whose type is NOT page typography. Each one is a measured
 * reason, not a convenience.
 */
const EXEMPT: { test: (selector: string, value: string) => boolean; why: string }[] = [
  {
    // The decoration is a ::before with no text node, so it is outside
    // the page's text sizes by construction.
    test: (_s, v) => v === "8rem",
    why: "decorative ::before quotation glyph, not text",
  },
  {
    // §11.8: a hero headline may use clamp() with a 28px floor. The
    // floor is 1.75rem = 28px and the ceiling is the display token, so
    // the line never leaves the scale — it only moves along it.
    test: (_s, v) => /^clamp\(1\.75rem,\s*[\d.]+vw,\s*var\(--text-display\)\)$/.test(v),
    why: "§11.8 hero headline: 28px floor, display ceiling",
  },
  {
    // The bingo board is a GAME SURFACE. A 9×9 grid on a 390px phone
    // gives each tile roughly 40px, and the tile carries a number, an
    // emoji and a label at once. A fixed 11px label with a 12px number
    // beside it overflows the cell; the board scales its own type to
    // the grid so the tiles stay readable and intact. This is the same
    // category as the SVG diagram text: typography that belongs to the
    // object, not to the page.
    test: (s) => /^\.bingo-/.test(s),
    why: "bingo board: game tile typography, scaled to the grid",
  },
];

function readCss(): string {
  return fs.readFileSync(CSS, "utf8");
}

/**
 * Every font-size / font shorthand in the stylesheet, with the rule that
 * declared it. The scan tracks the current selector, so an exemption can
 * be written against the RULE and not against a magic number.
 */
function fontSizesIn(css: string): { value: string; line: number; selector: string }[] {
  const out: { value: string; line: number; selector: string }[] = [];
  const lines = css.split("\n");
  let selector = "";
  let buffer = "";

  lines.forEach((l, i) => {
    // track the selector: everything since the last "}" that is not a
    // declaration, up to the "{"
    const beforeBrace = l.split("{")[0];
    if (l.includes("{")) {
      buffer = (buffer + " " + beforeBrace).replace(/\s+/g, " ").trim();
      selector = buffer.replace(/,\s*$/, "").trim();
      buffer = "";
    } else if (l.includes("}")) {
      buffer = "";
    }

    for (const m of l.matchAll(/font-size:\s*([^;]+);/g)) {
      const raw = m[1].trim().replace(/\s*!important$/, "");
      // a token, with or without a fallback literal
      const tok = raw.match(/var\(--text-[a-z]+(?:\s*,\s*[^)]+)?\)/);
      if (tok) {
        const name = tok[0].slice(4, -1).split(",")[0].trim();
        out.push({ value: `var(${name})`, line: i + 1, selector });
        continue;
      }
      out.push({ value: raw, line: i + 1, selector });
    }
    for (const m of l.matchAll(/(^|[\s;{])font:\s*([^;]+);/g)) {
      const decl = m[2].trim();
      // a token, with or without a fallback literal
      const tok = decl.match(/var\(--text-[a-z]+(?:\s*,\s*[^)]+)?\)/);
      if (tok) {
        const inner = tok[0].slice(4, -1);
        const name = inner.split(",")[0].trim();
        out.push({ value: `var(${name})`, line: i + 1, selector });
        continue;
      }
      const num = decl.match(/(^|[\s/])(\d*\.?\d+(?:rem|px|em))/);
      if (num) out.push({ value: num[2], line: i + 1, selector });
      const clamp = decl.match(/clamp\([^)]+\)/);
      if (clamp) out.push({ value: clamp[0], line: i + 1, selector });
    }
  });
  return out;
}

describe("the type law", () => {
  it("defines exactly the three canonical tokens", () => {
    const css = readCss();
    expect(css).toMatch(/--text-display:\s*0?\.?2rem/);
    expect(css).toMatch(/--text-body:\s*0?\.?875rem/);
    expect(css).toMatch(/--text-micro:\s*0?\.?72rem/);
  });

  it("resolves every font size in the stylesheet onto a canonical token", () => {
    const offenders = fontSizesIn(readCss()).filter(
      f => !CANON.has(f.value) && !EXEMPT.some(a => a.test(f.selector, f.value)),
    );
    const report = offenders
      .map(o => `  line ${o.line}: ${o.value}   (${o.selector || "?"})`)
      .join("\n");
    expect(
      offenders.length,
      `off-scale font sizes found in src/styles.css:\n${report}\n` +
        `Every size must be var(--text-display), var(--text-body) or var(--text-micro). ` +
        `A new size is a regression, not a decision.`,
    ).toBe(0);
  });

  it("keeps the legacy Major-Third aliases defined but unused", () => {
    // The aliases stay frozen for back-compat; nothing may USE them, or a
    // 13.6px or 20px size creeps back onto the page.
    const css = readCss();
    for (const alias of ["--text-xs", "--text-sm", "--text-md", "--text-lg", "--text-xl", "--text-2xl", "--text-3xl"]) {
      expect(css, `${alias} must stay defined`).toMatch(new RegExp(`${alias}:\\s*\\d`));
      const used = css.split("\n").filter((l) => l.includes(`var(${alias}`) && !l.trim().startsWith("--"));
      expect(used, `${alias} must not be used`).toEqual([]);
    }
  });

  it("keeps the display size on the page's single statement", () => {
    // A source scan cannot see the CONTENT of a rule, so it cannot tell
    // a statement from a caption — only the rendered page can. The check
    // that matters ("one display-size statement per page") therefore
    // lives in scripts/audit/type-and-rhythm.mjs, which measures the
    // real words at the real size.
    //
    // What this test CAN hold: the display token is never attached to a
    // rule that sets a prose-like line-height and weight together with
    // a text-transform, which is the signature of a sentence set as a
    // headline. A numeral has none of those.
    const css = readCss();
    const offenders = css
      .split("\n")
      .filter((l) => /font[^;]*var\(--text-display\)/.test(l))
      .filter((l) => /text-transform:\s*uppercase/.test(l))
      .filter((l) => /letter-spacing:\s*\.[0-9]+em/.test(l));
    expect(
      offenders,
      `the display size is for a statement and for numerals — never for an\n` +
        `uppercase tracked SHOUT line:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
