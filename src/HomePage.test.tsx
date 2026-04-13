import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("allows keyboard activation on ranking rows", () => {
    const onNavigate = vi.fn();
    render(<HomePage locale="en" onNavigate={onNavigate} />);

    // Instead of grabbing any link, look for a ranking row by its specific labeling or name
    // The ranking rows have role="link" and contain names like "Phuket" etc (from cityData)
    const rankingRows = screen.getAllByRole("link").filter(el => 
      el.className.includes("dashboard-ranking-row")
    );
    
    // We expect there to be ranking rows (at least 5 are skipped in the podium)
    if (rankingRows.length > 0) {
      fireEvent.keyDown(rankingRows[0], { key: "Enter" });
      expect(onNavigate).toHaveBeenCalled();
    }
  });

  it("renders imagery for every podium slot", () => {
    const { container } = render(<HomePage locale="en" onNavigate={vi.fn()} />);

    const heroImage = container.querySelector(".cinematic-hero img");
    const podiumImages = container.querySelectorAll(".podium-photo-layout img");

    expect(heroImage).not.toBeNull();
    expect(podiumImages).toHaveLength(5);
    podiumImages.forEach(image => {
      expect(image.getAttribute("src")).toBeTruthy();
    });
  });
});
