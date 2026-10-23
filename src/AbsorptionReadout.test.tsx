import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AbsorptionReadout from "./AbsorptionReadout";
import { ABSORPTION_PROVINCES, ABSORPTION_YEARS } from "./absorptionData";
import { allCities } from "./cityData";

afterEach(cleanup);

const cityIn = (province: string) => allCities.find(c => c.province === province)!;

describe("the absorption base", () => {
  it("covers every province with a record, and never invents a zero", () => {
    expect(Object.keys(ABSORPTION_PROVINCES)).toHaveLength(77);
    for (const [province, record] of Object.entries(ABSORPTION_PROVINCES)) {
      // A share is either a number or absent. It is never 0 standing in
      // for a province that simply has no record.
      expect(record.unplannedShare === null || record.unplannedShare >= 0).toBe(true);
      expect(record.registered === null || record.registered > 0).toBe(true);
      expect(province.length).toBeGreaterThan(0);
    }
  });

  it("shows the load the register does not count", () => {
    render(<AbsorptionReadout city={cityIn("Samut Sakhon")} locale="en" />);
    expect(screen.getByText(/Living here, not on the register/)).toBeTruthy();
    expect(screen.getByText(/Coming in to work or study/)).toBeTruthy();
    // Samut Sakhon: 548,488 people live there without being on its register.
    expect(screen.getByText("548,488")).toBeTruthy();
    const share = (ABSORPTION_PROVINCES["Samut Sakhon"].nightShare! * 100).toFixed(1);
    expect(screen.getByText(`${share}% of registered population; a separate resident-demand signal.`)).toBeTruthy();
  });

  it("keeps separate counts instead of inventing simultaneous population or electricity rates", () => {
    render(<AbsorptionReadout city={cityIn("Samut Sakhon")} locale="en" />);
    expect(screen.getByText(/not a simultaneous daytime population/)).toBeTruthy();
    expect(screen.queryByText(/kWh/)).toBeNull();
    expect(screen.queryByText(/people actually present/)).toBeNull();
    expect(screen.queryByText(/no plan has accounted/)).toBeNull();
  });

  it("states the limit of what a headcount can establish", () => {
    render(<AbsorptionReadout city={cityIn("Samut Sakhon")} locale="en" />);
    expect(screen.getByText(/counts people; it does not measure capacity/)).toBeTruthy();
  });

  it("says NO RECORD rather than zero where a province has no share", () => {
    const missing = Object.entries(ABSORPTION_PROVINCES).find(([, r]) => r.unplannedShare === null);
    expect(missing).toBeTruthy();
    const city = allCities.find(c => c.province === missing![0]);
    if (!city) return; // no tracked city sits in that province
    render(<AbsorptionReadout city={city} locale="en" />);
    expect(screen.getAllByText(/No share recorded for this province/).length).toBeGreaterThan(0);
  });

  it("names the years it read", () => {
    render(<AbsorptionReadout city={cityIn("Phuket")} locale="en" />);
    expect(screen.getByText(new RegExp(`BE ${ABSORPTION_YEARS.nonRegistered}`))).toBeTruthy();
  });
});
