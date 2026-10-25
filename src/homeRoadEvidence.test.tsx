import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { allCities } from "./cityData";
import { PROVINCE_BASELINE } from "./provinceBaselineData";
import { getHomeRoadEvidence } from "./homeRoadEvidence";
import HomePage from "./HomePage";

describe("homepage road evidence", () => {
  const source = PROVINCE_BASELINE.find(item => item.id === "rtddi-road-deaths")!;

  it("uses dated registry counts, not mutable seed rates or municipal populations", () => {
    const original = getHomeRoadEvidence(allCities);
    const mutated = getHomeRoadEvidence(allCities.map(city => ({ ...city, metrics: { ...city.metrics, roadFatalityRate: 99999, population: 1 } })));
    const records = (result: ReturnType<typeof getHomeRoadEvidence>) => result.entries.map(entry => ({ province: entry.province, cityId: entry.city.id, deaths: entry.deaths }));
    expect(records(mutated)).toEqual(records(original));
    expect(original.source?.year).toBe(2025);
    expect(original.entries).toHaveLength(5);
    expect(new Set(original.entries.map(entry => entry.province)).size).toBe(5);
    original.entries.forEach(entry => expect(entry.deaths).toBe(source.provinces[entry.province]));
    expect(original.entries.map(entry => entry.deaths)).toEqual([...original.entries.map(entry => entry.deaths)].sort((a, b) => b - a));
  });

  it("never manufactures missing values, retains verified zero, and limits the comparison cohort", () => {
    const fixture = allCities.slice(0, 3);
    const evidence = getHomeRoadEvidence(fixture, { ...source, provinces: { [fixture[0].province]: 0, Unrepresented: 99999 } });
    expect(evidence.entries).toHaveLength(1);
    expect(evidence.entries[0].deaths).toBe(0);
    expect(getHomeRoadEvidence([], source).entries).toEqual([]);
    expect(getHomeRoadEvidence(fixture, { ...source, provinces: { [fixture[0].province]: -1 } }).entries).toEqual([]);
  });

  it.each(["en", "th", "zh"] as const)("shows source, reference year and scope beside the %s values", locale => {
    const onNavigate = vi.fn();
    const { container } = render(<HomePage locale={locale} onNavigate={onNavigate} />);
    const section = container.querySelector('.road-safety-champions')!.closest('section')!;
    expect(section).toHaveTextContent("2025");
    expect(section.querySelector('a')?.href).toBe(source.catalogUrl);
    expect(section.querySelectorAll('.regional-champion-btn')).toHaveLength(5);
    expect(section).not.toHaveTextContent(/100K|WHO|thairsc\.com/);
    const first = getHomeRoadEvidence(allCities).entries[0];
    fireEvent.click(section.querySelector('.regional-champion-btn')!);
    expect(onNavigate).toHaveBeenCalledWith(`/city/${first.city.id}`);
    if (locale === "en") {
      expect(within(section).getByText(/not population-adjusted rates/)).toBeInTheDocument();
      expect(screen.queryByText("Lowest road fatality rate in Thailand")).not.toBeInTheDocument();
    }
  });
});
