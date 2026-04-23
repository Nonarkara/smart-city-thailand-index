import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RankingsPage from "./RankingsPage";

describe("RankingsPage", () => {
  it("re-ranks the directory when a different preset lens is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    const firstRowBefore = container.querySelectorAll(".rank-row-link")[0];
    expect(firstRowBefore).not.toBeUndefined();
    const initialText = firstRowBefore?.textContent ?? "";

    await user.click(screen.getByRole("tab", { name: "Growth, growth, growth" }));

    const firstRowAfter = container.querySelectorAll(".rank-row-link")[0];
    expect(firstRowAfter?.textContent).not.toBe(initialText);
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
    expect(container.querySelectorAll(".compare-city-card")).toHaveLength(2);
    expect(screen.getAllByText(/phuket smart city/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/samyan smart city/i)[0]).toBeInTheDocument();
  });
});
