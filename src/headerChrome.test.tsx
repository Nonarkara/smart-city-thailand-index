import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * The header chrome is the first thing a judge sees, and it is where
 * spatial slop hides easiest.
 *
 * Two defects are guarded here.
 *
 * The first: the Smart City Thailand seal appeared TWICE above the fold —
 * once in the institutional banner and again in the topbar brand lockup,
 * 44 pixels apart. The same square mark printed twice in immediate
 * succession read as a mistake, not as branding.
 *
 * The second, and the more recent: the header was TWO bands. An
 * institutional strip sat above the topbar, spending a whole row of
 * height on 130 pixels of logos and then pushing the product name into a
 * second row. Two bands saying one thing, with the second band existing
 * only because the first one had to be somewhere else.
 *
 * The rule now: ONE band. The three programme marks — MDES, depa and the
 * Smart City Thailand Office — lead the line, a hairline separates them
 * from the product wordmark, and the navigation anchors the right edge.
 * The lockup starts with words, never with a mark.
 */

function srcsIn(container: Element): string[] {
  return [...container.querySelectorAll("img")].map(img => {
    const raw = img.getAttribute("src") ?? "";
    return raw.split("/").pop() ?? "";
  });
}

describe("header chrome", () => {
  it("builds the header as ONE band, not two", () => {
    const { container } = render(<App />);

    // The separate institutional strip is gone. If this ever comes back,
    // the two rows of the header are back with it.
    expect(
      container.querySelector(".institutional-banner"),
      "a second header band has reappeared above the topbar",
    ).toBeNull();

    const topbar = container.querySelector(".topbar");
    expect(topbar, "no topbar rendered").toBeTruthy();
    expect(container.querySelectorAll(".topbar").length).toBe(1);

    // The marks, the hairline and the wordmark are siblings inside one
    // flex row, so they cannot wrap onto separate lines.
    const brand = topbar!.querySelector(".topbar-brand");
    expect(brand, "no brand cluster rendered").toBeTruthy();
    const brandChildren = Array.from(brand!.children);
    expect(brandChildren).toContain(brand!.querySelector(".institutional-logos"));
    expect(brandChildren).toContain(brand!.querySelector(".topbar-rule"));
    expect(brandChildren).toContain(brand!.querySelector(".brand-lockup"));

    // The navigation is in the same topbar element, so it shares that line.
    expect(Array.from(topbar!.children)).toContain(topbar!.querySelector(".topbar-actions"));
  });

  it("keeps the three programme marks in the one line", () => {
    const { container } = render(<App />);
    const logos = srcsIn(container.querySelector(".institutional-logos")!);
    expect(logos.length).toBe(3);
    expect(
      logos.some(src => src.startsWith("mdes_logo")),
      "the Ministry of Digital Economy and Society mark is missing",
    ).toBe(true);
    expect(
      logos.some(src => src.startsWith("depa_logo")),
      "the depa mark is missing",
    ).toBe(true);
    expect(
      logos.some(src => src.startsWith("smart_city_thailand_emblem")),
      "the Smart City Thailand Office mark is missing from the line",
    ).toBe(true);
  });

  it("uses the transparent marks, not the white-background JPEGs", () => {
    const { container } = render(<App />);
    const logos = srcsIn(container.querySelector(".institutional-logos")!);
    // The JPEGs carry an opaque white ground. Inside the glass topbar that
    // white rectangle showed as a box floating over the hero photo, so the
    // header must use the alpha variants built by
    // scripts/build-transparent-logos.py.
    const jpegs = logos.filter(src => /\.jpe?g$/i.test(src));
    expect(
      jpegs,
      `the header still serves white-background images: ${jpegs.join(", ")}`,
    ).toEqual([]);
  });

  it("never prints the same logo twice above the fold", () => {
    const { container } = render(<App />);
    const topbar = container.querySelector(".topbar")!;
    const seen = srcsIn(topbar);
    const dupes = seen.filter((src, i) => seen.indexOf(src) !== i);
    expect(
      dupes,
      `the same logo appears twice in the header: ${dupes.join(", ")}`,
    ).toEqual([]);
  });

  it("gives the brand lockup an identity on every viewport", () => {
    const { container } = render(<App />);
    const lockup = container.querySelector(".brand-lockup");
    expect(lockup, "no brand lockup rendered").toBeTruthy();

    // A mark, a wordmark, or both — but never neither. A lockup that is
    // empty on a phone is a row that says nothing.
    const hasMark = !!lockup!.querySelector("img");
    const hasName = !!lockup!.querySelector(".brand-name");
    expect(hasMark || hasName).toBe(true);
  });

  it("starts the lockup with the wordmark, not with a mark", () => {
    const { container } = render(<App />);
    const lockup = container.querySelector(".brand-lockup")!;
    // The mark sits in the same line as the other two logos. A logo in
    // front of the site title would put the same square back at the head
    // of the name — the duplication that was removed in the first place.
    expect(lockup.querySelector("img"), "the lockup still carries a mark").toBeNull();
    expect(lockup.querySelector(".brand-name")).toBeTruthy();
  });

  it("renders the site title for assistive technology", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /Smart City Thailand Index/i })).toBeTruthy();
  });
});
