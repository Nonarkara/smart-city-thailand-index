import { render } from "@testing-library/react";
import BaselinePage from "./BaselinePage";
import { RESIDUAL_GAPS } from "./baselineSources";

/**
 * The baseline page states what is missing in three places: the strip above
 * the table, the gap band, and the count in the band's heading. They drifted
 * apart once — the strip said "partial" for Governance while every row
 * showed it blank, and the band listed one gap under a heading that said
 * two. A reader cannot check a page that disagrees with itself, so this
 * test renders the page and requires the three statements to match.
 *
 * All seven dimensions are measured now, so the band no longer lists whole
 * dimensions: it names the two measurements that are still absent INSIDE
 * them, with the reason each one is missing. The band must never render
 * empty — a section that says nothing is spatial hallucination.
 */

const renderPage = () => {
  const { container } = render(<BaselinePage locale="en" onNavigate={() => {}} />);
  return container;
};

describe("BaselinePage gap statements", () => {
  it("marks no dimension as missing, because every one is measured", () => {
    const container = renderPage();
    const states = [...container.querySelectorAll(".baseline-dim")].map((d) => ({
      label: d.querySelector(".baseline-dim-label")?.textContent?.trim() ?? "",
      state: d.querySelector(".baseline-dim-state")?.textContent?.trim() ?? "",
      missing: d.classList.contains("is-missing"),
    }));

    // All seven dimensions now carry a measured indicator, so none of them
    // may be marked missing. A regression here must fail this test rather
    // than ship a hatched cell.
    expect(states.filter((s) => s.missing)).toEqual([]);
    expect(states).toHaveLength(7);

    // A measured dimension carries a count — never the word "partial".
    for (const s of states) {
      expect(s.state, `${s.label} must carry a count`).toMatch(/^\d+\/\d+$/);
    }
  });

  it("lists one entry per named residual gap, and the heading counts them", () => {
    const container = renderPage();
    const items = container.querySelectorAll(".baseline-gap-item");
    expect(items).toHaveLength(RESIDUAL_GAPS.length);

    const names = [...items].map((i) => i.querySelector(".baseline-gap-item-name")?.textContent?.trim());
    expect(names).toEqual(RESIDUAL_GAPS.map(g => g.label.en));

    const heading = container.querySelector(".baseline-gap-title")?.textContent?.trim() ?? "";
    expect(heading).toMatch(new RegExp(`^${RESIDUAL_GAPS.length}\\s`));

    // Each entry must say WHY it is missing, not merely that it is.
    for (const item of items) {
      const note = item.querySelector(".baseline-gap-item-note")?.textContent?.trim() ?? "";
      expect(note.length, "a residual gap must carry its reason").toBeGreaterThan(40);
    }
  });

  it("never renders an empty gap band", () => {
    // A section that says nothing is spatial hallucination. The band must
    // always carry either a dimension gap or a named residual gap.
    const container = renderPage();
    const band = container.querySelector(".baseline-gap");
    expect(band).toBeTruthy();
    expect(band!.querySelectorAll(".baseline-gap-item").length).toBeGreaterThan(0);
  });
});
