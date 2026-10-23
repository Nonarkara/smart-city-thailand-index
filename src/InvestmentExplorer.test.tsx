import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InvestmentExplorer from "./InvestmentExplorer";
import { allCities } from "./cityData";

describe("InvestmentExplorer", () => {
  it("supports keyboard selection, accurate values and dossier navigation", () => {
    const onNavigate = vi.fn();
    render(<InvestmentExplorer locale="en" onNavigate={onNavigate} />);
    const city = allCities[1];
    fireEvent.change(screen.getByLabelText("Explore city"), { target: { value: city.id } });
    expect(screen.getByText(city.nameEn, { selector: "h3" })).toBeTruthy();
    expect(screen.getAllByText(`${city.scores.livability}/100`).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/Read the city evidence/));
    expect(onNavigate).toHaveBeenCalledWith(`/city/${city.id}`);
    expect(screen.getByText(/not investment returns/)).toBeTruthy();
  });
  it("filters chart, selector and reference table together", () => {
    render(<InvestmentExplorer locale="en" onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByLabelText("Certified cities only"));
    const certified = allCities.filter(city => city.status === "certified");
    expect(document.querySelectorAll("option")).toHaveLength(certified.length);
    expect(document.querySelectorAll("circle")).toHaveLength(certified.length);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(certified.length);
  });
});
