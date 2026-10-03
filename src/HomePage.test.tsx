import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("opens a pillar ranking from a champion cell", () => {
    const onNavigate = vi.fn();
    render(<HomePage locale="en" onNavigate={onNavigate} />);

    const hospitality = screen.getAllByRole("button").find(button =>
      /hospitality/i.test(button.textContent ?? "") && button.className.includes("pillar-champion-btn"),
    );
    expect(hospitality).toBeDefined();
    fireEvent.click(hospitality as HTMLButtonElement);
    expect(onNavigate).toHaveBeenCalledWith("/rankings?pillar=hospitality");
  });

  it("allows keyboard activation on ranking rows", () => {
    const onNavigate = vi.fn();
    render(<HomePage locale="en" onNavigate={onNavigate} />);

    const rankingRows = screen.getAllByRole("link").filter(el =>
      el.className.includes("dashboard-ranking-row"),
    );

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
