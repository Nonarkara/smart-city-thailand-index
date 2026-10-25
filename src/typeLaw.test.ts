/**
 * THE TYPE LAW — SOURCE-LEVEL GATE
 * =================================
 * Workspace CLAUDE.md §11.7: "Display (--text-display, 32px) — page title
 * only. One per page." Composite numerals are exempt: "a single hero number
 * like a score or a date ... reads as a number, not as text."
 *
 * The browser instrument (scripts/audit/type-and-rhythm.mjs) measures the
 * rendered page and is the truth. It needs a served build, so it runs late
 * and it can miss a route. This test is the cheap, always-on guard: it
 * reads the stylesheet and refuses any rule that hands the display token to
 * a heading.
 *
 * It exists because Codex's 8c7d4b1 made every section heading
 * display-size. The instrument counted 97 display statements across twelve
 * routes where the law allows one per page, and nobody read the number —
 * it printed, it did not fail. This fails.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const CSS_PATH = path.resolve(process.cwd(), "src/styles.css");
const css = fs.readFileSync(CSS_PATH, "utf8");

/** Parse nested rules as well as top-level rules; comments are not CSS syntax. */
function rules(source = css): { selector: string; body: string }[] {
  const out: { selector: string; body: string }[] = [];
  postcss.parse(source).walkRules(rule => {
    out.push({ selector: rule.selector.replace(/\s+/g, " "), body: (rule.nodes ?? []).map(node => node.toString()).join("; ") });
  });
  return out;
}

const ALL = rules();

/**
 * The page title is the one thing allowed to hold the display token.
 * Every entry is a heading that IS the page's <h1>, not a section heading.
 * Adding a name here is a decision, not a convenience.
 */
const PAGE_TITLE_CLASSES = [
  "hero-title",
  "cinematic-hero-title",
  "dashboard-title",
  "city-hero-photo-title",
  "city-hero-gradient-title",
  "route-photo-hero-title",
  "compare-title",
  "bingo-title",
  "canvas-title",
];

const PROMOTES_TO_DISPLAY = (body: string) =>
  /font-size:\s*var\(--text-display\)/.test(body) ||
  /font:\s*[^;]*var\(--text-display\)/.test(body);

describe("§11.7 — the display token belongs to the page title", () => {
  it("sees forbidden headings inside nested media and supports rules", () => {
    const nested = rules("@media (min-width:700px) { @supports (display:grid) { main h2 {font-size:var(--text-display);} } }");
    expect(nested.some(rule => /h2/.test(rule.selector) && PROMOTES_TO_DISPLAY(rule.body))).toBe(true);
  });

  it("no rule hands the display token to an h2, h3 or h4", () => {
    const offenders = ALL.filter(
      (r) =>
        /\bh[234]\b/.test(r.selector) &&
        PROMOTES_TO_DISPLAY(r.body),
    ).map((r) => `${r.selector}  →  ${r.body.trim().slice(0, 90)}`);
    expect(offenders, "a heading rule promotes to --text-display").toEqual([]);
  });

  it("no rule hands the display token to a prose title class", () => {
    // A *-title / *-headline / *-heading class that is not a page title is a
    // section or card heading. It reads as text, so it is not a numeral and
    // the numeral exemption does not apply to it.
    const offenders = ALL.filter((r) => {
      if (!PROMOTES_TO_DISPLAY(r.body)) return false;
      const classes = r.selector.match(/\.[a-z0-9-]+/gi) ?? [];
      const isProseTitle = classes.some((c) =>
        /(^|-)(title|headline|heading)$/i.test(c.replace(/^\./, "")),
      );
      if (!isProseTitle) return false;
      return classes.some(c => /(^|-)(title|headline|heading)$/i.test(c.slice(1)) && !PAGE_TITLE_CLASSES.includes(c.slice(1)));
    }).map((r) => `${r.selector}  →  ${r.body.trim().slice(0, 90)}`);
    expect(offenders, "a prose title rule promotes to --text-display").toEqual([]);
  });

  it("the section heading carries the body token, not the display token", () => {
    const block = ALL.find((r) => r.selector.includes("main .section > h2"));
    expect(block, "main .section > h2 rule not found").toBeTruthy();
    expect(block!.body).toMatch(/font-size:\s*var\(--text-body\)/);
    expect(block!.body).not.toMatch(/font-size:\s*var\(--text-display\)/);
  });

  it("the section landmark is a hairline, not a 3px ink slab", () => {
    const headingRules = ALL.filter((r) => /\bh[234]\b/.test(r.selector));
    const slabs = headingRules
      .filter((r) => /border-top:\s*3px/.test(r.body))
      .map((r) => r.selector);
    expect(slabs, "a heading carries a 3px rule; the landmark is a hairline").toEqual([]);
    const landmark = ALL.find(
      (r) => r.selector.includes("main .section > h2") && /border-top/.test(r.body),
    );
    expect(landmark, "the hairline landmark rule is missing").toBeTruthy();
    expect(landmark!.body).toMatch(/border-top:\s*1px solid var\(--5\)/);
  });

  it("the three canonical tokens are untouched", () => {
    const root = ALL.find((r) => r.selector === ":root");
    expect(root, ":root not found").toBeTruthy();
    // 2rem = 32px, 0.875rem = 14px, 0.72rem = 11.52px
    expect(root!.body).toMatch(/--text-display:\s*2rem/);
    expect(root!.body).toMatch(/--text-body:\s*0\.875rem/);
    expect(root!.body).toMatch(/--text-micro:\s*0\.72rem/);
  });
});
