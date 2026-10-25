import { fireEvent, render, screen } from "@testing-library/react";
import HomeDecisionGuide from "./HomeDecisionGuide";

describe("HomeDecisionGuide", () => {
  it("opens the intended ranking lens for all five decisions and keeps data gaps visible", () => {
    const onNavigate = vi.fn();
    render(<HomeDecisionGuide locale="en" onNavigate={onNavigate} />);
    for (const [label, lens, limitation] of [
      ["Invest", "growth", "does not forecast returns"],
      ["Live", "affordability", "not a cost-of-living measure"],
      ["Learn", "learning", "tuition"],
      ["Work", "startup", "work permits"],
      ["Play", "visiting", "opening hours"],
    ]) {
      fireEvent.click(screen.getByRole("button", { name: label, exact: true }));
      expect(screen.getByText(new RegExp(limitation))).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Compare cities with these priorities/ }));
      expect(onNavigate).toHaveBeenLastCalledWith(`/rankings?lens=${lens}`);
    }
  });
});
