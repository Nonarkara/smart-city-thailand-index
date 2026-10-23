import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CityResearchAppendix from "./CityResearchAppendix";
import { allCities } from "./cityData";
afterEach(cleanup);
describe("research provenance", () => {
  it("shows historic observation periods instead of treating release time as freshness", () => {
    render(<CityResearchAppendix city={allCities[0]} locale="en"/>);
    expect(screen.getAllByText(/2010/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Not recorded/).length).toBeGreaterThan(0);
    expect(screen.getByText(/release date is not the observation date/)).toBeTruthy();
    expect(screen.getByRole("link",{name:/Download research snapshot/,hidden:true})).toHaveAttribute("href",expect.stringMatching(/^\/research\/sciti-baseline-[a-f0-9]{16}\.json$/));
  });
});
