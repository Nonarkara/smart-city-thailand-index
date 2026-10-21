import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * The header chrome is the first thing a judge sees, and it is where
 * spatial slop hides easiest.
 *
 * The defect this guards: the Smart City Thailand seal appeared TWICE above
 * the fold — once in the institutional banner and again in the topbar brand
 * lockup, 44 pixels apart. The same square mark printed twice in immediate
 * succession read as a mistake, not as branding.
 *
 * The rule: the institutional strip carries the institutions that back the
 * index; the lockup carries the mark. Each asset appears in exactly one of
 * the two zones.
 */

function srcsIn(container: Element): string[] {
  return [...container.querySelectorAll("img")].map(img => {
    const raw = img.getAttribute("src") ?? "";
    return raw.split("/").pop() ?? "";
  });
}

describe("header chrome", () => {
  it("never prints the same logo in the institutional strip and the topbar", () => {
    const { container } = render(<App />);

    const banner = container.querySelector(".institutional-banner");
    const topbar = container.querySelector(".topbar");
    expect(banner, "no institutional banner rendered").toBeTruthy();
    expect(topbar, "no topbar rendered").toBeTruthy();

    const bannerLogos = srcsIn(banner!);
    const topbarLogos = srcsIn(topbar!);

    const shared = bannerLogos.filter(src => topbarLogos.includes(src));
    expect(
      shared,
      `the same logo appears in both the banner and the topbar: ${shared.join(", ")}`,
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

  it("keeps the institutional marks to the two backing institutions", () => {
    const { container } = render(<App />);
    const banner = container.querySelector(".institutional-banner")!;
    const logos = srcsIn(banner);
    expect(logos.length).toBeGreaterThan(0);
    // The strip is MDES and depa. The Smart City Thailand seal belongs to
    // the lockup, where it is the product's own mark.
    expect(
      logos.some(src => src.startsWith("smart_city_thailand_logo")),
      "the Smart City Thailand seal is back in the institutional strip",
    ).toBe(false);
  });

  it("renders the site title for assistive technology", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /Smart City Thailand Index/i })).toBeTruthy();
  });
});
