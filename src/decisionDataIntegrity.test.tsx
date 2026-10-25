import { render, screen } from "@testing-library/react";
import { allCities } from "./cityData";
import { PRESET_LENSES, computePresetScore } from "./presetLenses";
import { MONEYBALL_PICKS } from "./moneyballPicks";
import { computePreferenceScore, type CityPreferences } from "./preferenceScore";
import NewsStrip from "./NewsStrip";
import { EVIDENCE_SOURCE_FAMILY_COUNT } from "./methodologySpec";

const city = allCities[0];
const prefs = (grade: "A" | "B" | "C") => Object.fromEntries(Object.keys(city.scores).map(key => [key, grade])) as CityPreferences;

describe("decision score integrity", () => {
  it("every purpose is exactly its displayed weights, without city or metric bonuses", () => {
    for (const lens of PRESET_LENSES) {
      expect(Object.values(lens.weights).reduce((sum, weight) => sum + weight, 0)).toBe(100);
      const expected = Object.entries(lens.weights).reduce((sum, [key, weight]) => sum + city.scores[key as keyof typeof city.scores] * weight, 0) / 100;
      expect(computePresetScore(city, lens)).toBeCloseTo(lens.id === "balanced" ? city.compositeScore : expected, 8);
      const changedMetrics = { ...city, id: "samyan", metrics: { ...city.metrics, gppPerCapita: 1, fdiInflow: 999999, pm25Annual: 1 } };
      expect(computePresetScore(changedMetrics, lens)).toBe(computePresetScore(city, lens));
    }
  });

  it("preference scores distinguish cities above the former threshold instead of saturating at100", () => {
    const moderate = Object.fromEntries(Object.keys(city.scores).map(key => [key, 50])) as typeof city.scores;
    const strong = Object.fromEntries(Object.keys(city.scores).map(key => [key, 80])) as typeof city.scores;
    expect(computePreferenceScore(moderate, prefs("B"), 55)).toBe(50);
    expect(computePreferenceScore(strong, prefs("B"), 55)).toBe(80);
    expect(computePreferenceScore(strong, prefs("C"), 55)).toBe(55);
  });

  it("no-preference pillars cannot compensate for a low priority score", () => {
    const preferences = prefs("C"); preferences.safety = "A";
    expect(computePreferenceScore({ ...city.scores, safety: 20, economy: 100 }, preferences, 70)).toBe(20);
  });

  it("editorial chips use current record values and preserve missing data", () => {
    for (const pick of MONEYBALL_PICKS) {
      const current = allCities.find(entry => entry.id === pick.cityId)!;
      expect(current).toBeDefined();
      for (const chip of pick.chips) expect(typeof chip.value(current)).toBe("string");
    }
    const pick = MONEYBALL_PICKS.find(entry => entry.cityId === "phitsanulok-muni")!;
    expect(pick.chips[0].value({ ...city, scores: { ...city.scores, digital: 61 } })).toBe("61 / 100");
    expect(MONEYBALL_PICKS[0].chips[0].value({ ...city, metrics: {} })).toBe("—");
  });

  it("news metadata describes the current registry and source families without claiming verification", () => {
    const { container } = render(<NewsStrip locale="en" />);
    const density = container.querySelector('.data-density-grid')!;
    expect(density).toHaveTextContent(String(allCities.length));
    expect(density).toHaveTextContent(String(EVIDENCE_SOURCE_FAMILY_COUNT));
    expect(density).not.toHaveTextContent("Verified sources");
    expect(screen.getByText("Selected reading")).toBeInTheDocument();
    expect(screen.queryByText("Updated weekly")).not.toBeInTheDocument();
  });
});
