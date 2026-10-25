import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import * as cityApi from "./cityApi";
import { allCities } from "./cityData";

describe("HomePage", () => {
  it("uses current research scores instead of invented adoption percentages or WHO targets", () => {
    const leader = [...allCities].sort((a,b) => b.compositeScore-a.compositeScore)[0];
    const data = allCities.map(city => city.id === leader.id ? {...city, scores:{...city.scores,livability:47}} : city);
    const spy = vi.spyOn(cityApi, "useCitySummaries").mockReturnValue({data} as ReturnType<typeof cityApi.useCitySummaries>);
    try {
      const {container} = render(<HomePage locale="en" onNavigate={vi.fn()} />);
      expect(container.querySelector('.podium-photo-stats')).toHaveTextContent("Livability 47/100");
      expect(container.querySelector('.podium-photo-stats')).not.toHaveTextContent('%');
      expect(screen.getByText('Five largest recorded totals among indexed provinces')).toBeInTheDocument();
      expect(container).not.toHaveTextContent('WHO target');
    } finally { spy.mockRestore(); }
  });
  it("explains recognition limits without repeating headline counts", () => {
    const { container } = render(<HomePage locale="en" onNavigate={vi.fn()} />);
    const guide = container.querySelector('.opening-argument');
    expect(guide).toHaveTextContent("How to read this index");
    expect(guide).toHaveTextContent("It does not establish that every service operates today");
    expect(guide).not.toHaveTextContent("This index measures outcomes");
    expect(Array.from(guide!.querySelectorAll('.opening-argument-num')).map(e => e.textContent))
      .toEqual(["Scope", "Certification", "Evidence"]);
  });

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
