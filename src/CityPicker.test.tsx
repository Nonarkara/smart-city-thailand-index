import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CityPicker from "./CityPicker";
import { allCities } from "./cityData";
import { getCityName, getProvinceName } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

afterEach(cleanup);

const GLYPH = { alpha: "α", beta: "β", gamma: "γ" } as const;

function collation(locale: Locale): string {
  if (locale === "th") return "th";
  if (locale === "zh") return "zh";
  return "en";
}

function ordered(locale: Locale, query = ""): SmartCity[] {
  const needle = query.normalize("NFKC").trim().toLocaleLowerCase();
  return [...allCities]
    .filter(city => !needle || [
      city.nameEn,
      city.nameTh,
      getCityName(city, "zh"),
      city.province,
      city.provinceTh,
      getProvinceName(city, "zh"),
    ].join("\n").normalize("NFKC").toLocaleLowerCase().includes(needle))
    .sort((a, b) => {
      const byName = getCityName(a, locale).localeCompare(
        getCityName(b, locale),
        collation(locale),
        { sensitivity: "base" },
      );
      return byName || a.id.localeCompare(b.id);
    });
}

function open(locale: Locale, currentCityId?: string) {
  const onNavigate = vi.fn();
  const onClose = vi.fn();
  render(
    <CityPicker
      locale={locale}
      currentCityId={currentCityId}
      onNavigate={onNavigate}
      onClose={onClose}
    />,
  );
  const label = locale === "th" ? "ค้นหาเมือง" : locale === "zh" ? "查找城市" : "Find a city";
  expect(document.querySelector(".city-picker-panel")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: label }));
  return { onNavigate, onClose };
}

function rows(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(".city-picker-item")];
}

describe("topbar city finder", () => {
  it.each(["en", "th", "zh"] as const)("lists every city alphabetically in %s with its tier glyph and score", (locale) => {
    open(locale);
    const expected = ordered(locale);
    const rendered = rows();
    expect(rendered).toHaveLength(expected.length);
    rendered.forEach((row, index) => {
      const city = expected[index];
      expect(row.querySelector(".city-picker-name")?.textContent).toBe(getCityName(city, locale));
      expect(row.querySelector(".city-picker-tier")?.textContent).toBe(GLYPH[city.tier]);
      expect(row.querySelector(".city-picker-tier")?.classList.contains(`city-picker-tier-${city.tier}`)).toBe(true);
      expect(row.querySelector(".city-picker-score")?.textContent).toBe(city.compositeScore.toFixed(1));
    });
  });

  it("filters by English, Thai or Chinese as the reader types, then says when nothing matches", () => {
    open("en");
    const city = allCities.find(entry => entry.id === "phuket")!;
    const field = screen.getByRole("searchbox", { name: "City or province" });
    for (const term of [city.nameEn, city.nameTh, getCityName(city, "zh")]) {
      fireEvent.change(field, { target: { value: term } });
      const names = rows().map(row => row.querySelector(".city-picker-name")?.textContent);
      expect(names).toContain(city.nameEn);
      expect(names).toEqual(ordered("en", term).map(entry => entry.nameEn));
    }
    fireEvent.change(field, { target: { value: "not-a-city-xyz" } });
    expect(rows()).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toBe("No city matches");
  });

  it("opens the dossier for the chosen row and marks the city already on screen", () => {
    const city = allCities.find(entry => entry.id === "phuket")!;
    const { onNavigate, onClose } = open("en", city.id);
    const row = rows().find(entry => entry.querySelector(".city-picker-name")?.textContent === city.nameEn)!;
    expect(row.classList.contains("active")).toBe(true);
    expect(row.getAttribute("aria-selected")).toBe("true");
    fireEvent.click(row);
    expect(onNavigate).toHaveBeenCalledWith(`/city/${city.id}`);
    expect(onClose).toHaveBeenCalledOnce();
    expect(document.querySelector(".city-picker-panel")).toBeNull();
  });

  it("closes on Escape and on a click outside the drawer", () => {
    open("th");
    expect(screen.getByRole("searchbox", { name: "เมืองหรือจังหวัด" })).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.querySelector(".city-picker-panel")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "ค้นหาเมือง" }));
    fireEvent.mouseDown(document.body);
    expect(document.querySelector(".city-picker-panel")).toBeNull();
  });
});
