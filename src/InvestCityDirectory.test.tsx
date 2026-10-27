import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InvestCityDirectory from "./InvestCityDirectory";
import { allCities } from "./cityData";
import { getCityName, getProvinceName } from "./cityPresentation";
import { getInvestorPitchForLocale } from "./cityInvestorPitch";

const results = () => document.querySelector(".investment-atlas-results") as HTMLElement;
const ids = () => [...results().querySelectorAll<HTMLElement>("[data-atlas-city-id]")].map(element => element.dataset.atlasCityId!);
const search = () => screen.getByLabelText("Search city or province");

afterEach(cleanup);
beforeEach(() => { Element.prototype.scrollIntoView = vi.fn(); });

describe("Investment Atlas directory", () => {
  it("supports next and previous pages without mounting the full directory", () => {
    render(<InvestCityDirectory locale="en" onNavigate={vi.fn()} />);
    const initial = ids();
    expect(initial).toHaveLength(12);
    const firstCard = results().firstElementChild!;
    const firstCity = allCities.find(city => city.id === initial[0])!;
    expect(firstCard.querySelector("h3")?.textContent).toBe(firstCity.nameEn);
    expect(firstCard.querySelector(".investment-atlas-headline")?.textContent).not.toContain(`${firstCity.nameEn} — `);
    expect(document.querySelector(".investment-atlas-featured")?.hasAttribute("open")).toBe(false);
    fireEvent.click(screen.getByText("Next cities", { selector: "button" }));
    expect(ids()).toHaveLength(12);
    expect(ids().every(id => !initial.includes(id))).toBe(true);
    expect(screen.getByText("Previous cities", { selector: "button" })).not.toBeDisabled();
    fireEvent.click(screen.getByText("Previous cities", { selector: "button" }));
    expect(ids()).toEqual(initial);
    expect(screen.getByText("Page 1 of 10")).toBeTruthy();
  });

  it("finds a city outside the initial page and opens its complete story and dossier", () => {
    const onNavigate = vi.fn();
    render(<InvestCityDirectory locale="en" onNavigate={onNavigate} />);
    const city = allCities.at(-1)!;
    fireEvent.change(search(), { target: { value: city.id } });
    expect(ids()).toEqual([city.id]);
    const card = results().querySelector("[data-atlas-city-id]") as HTMLElement;
    const story = card.querySelector("details")!;
    fireEvent.click(within(card).getByText("Read the full story"));
    // The entire curated story remains present, including its risk and next step.
    const pitch = getInvestorPitchForLocale(city, "en");
    expect(story.textContent).toContain(pitch.riskNote);
    expect(story.textContent).toContain(pitch.nextStep);
    fireEvent.click(within(card).getByRole("button", { name: "Open city dossier →" }));
    expect(onNavigate).toHaveBeenCalledWith(`/city/${city.id}`);
  });

  it("resets pagination when search, filters or sort change and recovers from an empty result", () => {
    render(<InvestCityDirectory locale="en" onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByText("Next cities", { selector: "button" }));
    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "south" } });
    expect(ids().every(id => allCities.find(city => city.id === id)?.region === "south")).toBe(true);
    expect(screen.getByText(/^1–/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "all" } });
    fireEvent.click(screen.getByText("Next cities", { selector: "button" }));
    fireEvent.change(screen.getByLabelText("Sort cities"), { target: { value: "name" } });
    expect(screen.getByText("Page 1 of 10")).toBeTruthy();
    fireEvent.click(screen.getByText("Next cities", { selector: "button" }));
    fireEvent.change(search(), { target: { value: "not-a-city-xyz" } });
    expect(screen.getByText("No cities match")).toBeTruthy();
    expect(ids()).toEqual([]);
    fireEvent.click(screen.getByText("Clear search and filters", { selector: "button" }));
    expect(screen.getByText("Page 1 of 10")).toBeTruthy();
    fireEvent.click(screen.getByText("Next cities", { selector: "button" }));
    fireEvent.change(screen.getByLabelText("Tier"), { target: { value: "beta" } });
    expect(ids().every(id => allCities.find(city => city.id === id)?.tier === "beta")).toBe(true);
    expect(screen.getByText(/^1–/)).toBeTruthy();
  });

  it("accepts Thai and Chinese city and province searches from the same search field", () => {
    render(<InvestCityDirectory locale="en" onNavigate={vi.fn()} />);
    const city = allCities.find(city => city.id === "phuket")!;
    for (const term of [city.nameTh, getCityName(city, "zh"), getProvinceName(city, "zh")]) {
      fireEvent.change(search(), { target: { value: term } });
      expect(ids()).toContain(city.id);
    }
  });
});
