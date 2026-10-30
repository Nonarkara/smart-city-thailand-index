import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RankingsPage from "./RankingsPage";

describe("RankingsPage", () => {
  it("re-ranks the directory when a different preset lens is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    const firstRowBefore = container.querySelectorAll(".rank-row-link")[0];
    expect(firstRowBefore).not.toBeUndefined();
    const initialText = firstRowBefore?.textContent ?? "";

    await user.click(screen.getByRole("tab", { name: "Economy & digital" }));

    const firstRowAfter = container.querySelectorAll(".rank-row-link")[0];
    expect(firstRowAfter?.textContent).not.toBe(initialText);
  });

  it("states where each ranked city peaks and where it is weak, not seven near-identical bars", () => {
    const { container } = render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    const firstRow = container.querySelector(".rank-row-link");
    expect(firstRow).not.toBeNull();
    // Among the top ten the pillar gaps are 2-6 points: bars cannot be told apart and cost a line per row.
    expect(firstRow?.querySelector(".rank-pillar-bar, .rank-pillar-bars")).not.toBeInTheDocument();
    const extremes = firstRow?.querySelector(".rank-row-extremes");
    expect(extremes?.querySelectorAll(".rank-extreme")).toHaveLength(2);
    // The seven values are not lost: they remain on hover and for screen readers.
    const label = extremes?.getAttribute("aria-label") ?? "";
    expect(label).toMatch(/Strongest pillar .+ \d+; weakest .+ \d+/);
    for (const pillar of ["Livability", "Economy", "Safety", "Wellbeing", "Environment", "Hospitality", "Digital"]) expect(label).toContain(pillar);
    expect(extremes?.getAttribute("title")).toBe(label);
  });

  it("enters compare view after selecting cities in compare mode", async () => {
    const user = userEvent.setup();
    const { container } = render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Compare mode" }));
    const rankLinks = Array.from(container.querySelectorAll(".rank-row-link")) as HTMLAnchorElement[];
    await user.click(rankLinks.find(link => /phuket smart city/i.test(link.textContent ?? "")) as HTMLAnchorElement);
    await user.click(rankLinks.find(link => /samyan smart city/i.test(link.textContent ?? "")) as HTMLAnchorElement);

    expect(screen.getByText("2 selected")).toBeInTheDocument();

    await user.click(container.querySelector(".compare-launch-bar .btn-primary") as HTMLButtonElement);

    expect(screen.getByRole("button", { name: /back to directory/i })).toBeInTheDocument();
    // ComparisonGrid is lazy-loaded — wait for the chunk to resolve through Suspense
    await waitFor(() => expect(container.querySelectorAll(".compare-city-card")).toHaveLength(2));
    expect(screen.getAllByText(/phuket smart city/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/samyan smart city/i)[0]).toBeInTheDocument();
  });
});
