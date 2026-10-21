import { render, screen } from "@testing-library/react";
import BaselinePage from "./BaselinePage";

/**
 * The baseline page states which dimensions have no data in three places:
 * the strip, the gap band, and the count in the gap heading. They drifted
 * apart once — the strip said "partial" for Governance while every row
 * showed it blank, and the band listed one gap under a heading that said
 * two. A reader cannot check a page that disagrees with itself, so this
 * test renders the page and requires the three statements to match.
 */

const renderPage = () => {
  const { container } = render(<BaselinePage locale="en" onNavigate={() => {}} />);
  return container;
};

describe("BaselinePage gap statements", () => {
  it("marks exactly Energy and Governance as having no baseline", () => {
    const container = renderPage();
    const states = [...container.querySelectorAll(".baseline-dim")].map((d) => ({
      label: d.querySelector(".baseline-dim-label")?.textContent?.trim() ?? "",
      state: d.querySelector(".baseline-dim-state")?.textContent?.trim() ?? "",
      missing: d.classList.contains("is-missing"),
    }));

    const gaps = states.filter((s) => s.missing).map((s) => s.label);
    expect(gaps.sort()).toEqual(["Smart Energy", "Smart Governance"]);

    // A gap must say so in words, not merely look different.
    for (const s of states.filter((x) => x.missing)) {
      expect(s.state.toLowerCase()).toContain("no baseline");
    }

    // And a measured dimension must carry a count, never the word "partial".
    for (const s of states.filter((x) => !x.missing)) {
      expect(s.state).toMatch(/^\d+\/\d+$/);
    }
  });

  it("lists one gap entry per gap, and the heading counts them", () => {
    const container = renderPage();
    const items = container.querySelectorAll(".baseline-gap-item");
    expect(items).toHaveLength(2);

    const names = [...items].map((i) => i.querySelector(".baseline-gap-item-name")?.textContent?.trim());
    expect(names.sort()).toEqual(["Smart Energy", "Smart Governance"]);

    const heading = container.querySelector(".baseline-gap-title")?.textContent?.trim() ?? "";
    expect(heading).toMatch(/^2\s/);
  });
});
