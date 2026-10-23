import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import CityEvidenceSummary from "./CityEvidenceSummary";
afterEach(cleanup);
describe("city evidence interpretation", () => {
  it("does not equate populated baseline data with adequate services", () => {
    render(<CityEvidenceSummary city={allCities[0]} locale="en" />);
    expect(screen.getByText(/local infrastructure adequacy remains unverified/)).toBeTruthy();
    expect(screen.getByText(/not operational services/)).toBeTruthy();
    expect(screen.getAllByRole("row")).toHaveLength(8);
  });
  it("exposes shared provincial context for every city rather than calling it local evidence", () => {
    const shared = allCities.find(city => allCities.some(other => other.id !== city.id && other.province === city.province))!;
    render(<CityEvidenceSummary city={shared} locale="en" />);
    expect(screen.getByText(/Cities in the same province can share/)).toBeTruthy();
    expect(screen.getByText(/not a real-time service monitor/)).toBeTruthy();
  });
});
