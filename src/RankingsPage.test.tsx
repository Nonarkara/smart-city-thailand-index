import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RankingsPage from "./RankingsPage";

describe("RankingsPage", () => {
  it("re-sorts cities within a tier when a pillar is selected", async () => {
    const user = userEvent.setup();
    render(<RankingsPage locale="en" onNavigate={vi.fn()} />);

    const alphaHeadings = screen.getAllByRole("heading", { level: 3, name: "Alpha" });
    expect(alphaHeadings[0]).toBeInTheDocument();

    const alphaSection = alphaHeadings[0].closest(".tier-section");
    expect(alphaSection).not.toBeNull();
    const initialCards = within(alphaSection as HTMLElement).getAllByRole("link");
    expect(initialCards[0]).toHaveTextContent("Phuket Smart City");

    await user.selectOptions(screen.getByRole("combobox"), "hospitality");

    const sortedCards = within(alphaSection as HTMLElement).getAllByRole("link");
    expect(sortedCards[0]).toHaveTextContent("Chiang Mai Smart Old Town");
  });
});
