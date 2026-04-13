import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RankingsPage from "./RankingsPage";

describe("RankingsPage", () => {
  it("re-sorts cities within a tier when a pillar is selected", async () => {
    const user = userEvent.setup();
    render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    const alphaHeadings = screen.getAllByRole("heading", { level: 2, name: "Alpha" });
    expect(alphaHeadings[0]).toBeInTheDocument();

    const alphaSection = alphaHeadings[0].closest(".tier-section");
    expect(alphaSection).not.toBeNull();
    const initialCards = within(alphaSection as HTMLElement).getAllByRole("link");
    expect(initialCards[0]).toHaveTextContent("Phuket Smart City");

    await user.selectOptions(screen.getByRole("combobox"), "hospitality");

    const sortedCards = within(alphaSection as HTMLElement).getAllByRole("link");
    expect(sortedCards[0]).toHaveTextContent("Chiang Mai Smart Old Town");
  });

  it("replaces comparison slots one by one in side-by-side view", async () => {
    const user = userEvent.setup();
    const { container } = render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    await user.click(screen.getByRole("tab", { name: "Side-by-side" }));

    const slots = container.querySelectorAll(".compare-slot-card");
    expect(slots).toHaveLength(5);
    expect(within(slots[0] as HTMLElement).getByText("Phuket Smart City")).toBeInTheDocument();
    expect(within(slots[1] as HTMLElement).getByText("Samyan Smart City")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Saensuk Smart City/i }));
    expect(within(slots[0] as HTMLElement).getByText("Saensuk Smart City")).toBeInTheDocument();
    expect(within(slots[1] as HTMLElement).getByText("Samyan Smart City")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Phra Ram 4 Smart City/i }));
    expect(within(slots[1] as HTMLElement).getByText("Phra Ram 4 Smart City")).toBeInTheDocument();
  });
});
