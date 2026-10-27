import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { allCities } from "./cityData";
import { getCityName } from "./cityPresentation";
import CityCanvasPage from "./CityCanvasPage";
import type { SmartCity } from "./types";

let fixtures: SmartCity[] = [];
vi.mock("./cityApi", () => ({ useCitySummaries: () => ({ data: fixtures }) }));
afterEach(cleanup);

describe("printable city worksheet evidence envelope", () => {
  it("uses the selected language and includes a source/cutoff qualification without duplicate geography", () => {
    const city = allCities.find(item => item.id === "phuket")!;
    fixtures = [city];
    const { container } = render(<CityCanvasPage cityId={city.id} locale="th" onNavigate={vi.fn()} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(getCityName(city, "th"));
    expect(container.querySelector('.canvas-province')).toBeNull();
    expect(container.querySelector('.canvas-source-note')).toHaveTextContent("2026-04-04");
    expect(container.querySelector('.canvas-source-note a')).toHaveAttribute("href", "https://sciti.nonarkara.org/city/phuket");
    expect(container.querySelectorAll('.canvas-box')).toHaveLength(4);
    expect(container.querySelectorAll('.canvas-box-empty')).toHaveLength(2);
  });

  it("distinguishes genuine numeric zero from a missing field", () => {
    const city = { ...allCities[0], metrics: { gppPerCapita: 0, landPriceBaht: 0, fdiInflow: 0 } };
    fixtures = [city];
    const { container } = render(<CityCanvasPage cityId={city.id} locale="en" onNavigate={vi.fn()} />);
    const values = [...container.querySelectorAll('.cm-value')].map(el => el.textContent);
    expect(values).toEqual(["฿0", "—", "฿0/m²", "฿0M"]);
    expect(screen.getByRole("heading", { name: "Unverified seed estimates" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Legacy research claims · not independently verified" })).toBeTruthy();
    expect(screen.getByText("FDI seed figure · measure unverified")).toBeTruthy();
    expect(container.querySelector('.canvas-source-note')).toHaveTextContent("not a financing or service-readiness assessment");
  });
});
