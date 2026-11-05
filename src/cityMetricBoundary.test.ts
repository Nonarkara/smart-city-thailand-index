import { describe, expect, it, vi } from "vitest";

vi.mock("./cityData.ts", () => ({
  allCities: [{
    id: "synthetic-zero-city", nameEn: "Synthetic city", nameTh: "เมืองทดสอบ",
    province: "Phuket", provinceTh: "ภูเก็ต", region: "south",
    status: "certified", reality: "operational", smartDimensions: [],
    scores: { livability: 60, economy: 60, safety: 60, wellbeing: 60, environment: 60, hospitality: 60, digital: 60 },
    compositeScore: 60, tier: "beta", tagline: "Synthetic boundary fixture", taglineTh: "ข้อมูลทดสอบ", highlights: [],
    metrics: {
      population: 0,
      gppPerCapita: 0,
      avgMonthlyIncome: 0,
      pm25Annual: Number.NaN,
      hospitalBedsPer10k: 0,
      crimeRatePer100k: 0,
      greenCoverage: 0,
      gppGrowthRate: Number.POSITIVE_INFINITY,
      waterQuality: 0,
      forestCoverage: 0,
      fdiInflow: 0,
      industryComposition: "   ",
      laborForce: 0,
    } }],
}));

import { getCityDetail, getCityFactsRows } from "./cityCdp";

describe("city observation boundaries", () => {
  it("retains zero observations and omits nonfinite or empty inputs from UI and exports", () => {
    const detail = getCityDetail("synthetic-zero-city")!;
    const observations = detail.metricBlocks.flatMap(block => block.observations);
    expect(observations.map(row => row.metricKey)).not.toContain("pm25Annual");
    expect(observations.map(row => row.metricKey)).not.toContain("gppGrowthRate");
    expect(observations.map(row => row.metricKey)).not.toContain("industryComposition");
    for (const key of ["population", "gppPerCapita", "avgMonthlyIncome", "hospitalBedsPer10k", "crimeRatePer100k", "greenCoverage", "waterQuality", "forestCoverage", "fdiInflow", "laborForce"]) {
      expect(observations.find(row => row.metricKey === key)?.metricValueNum, key).toBe(0);
    }
    expect(observations.find(row => row.metricKey === "population")?.metricValueText).toBe("0K");
    const exported = getCityFactsRows("synthetic-zero-city").filter(row => row.fact_type === "metric");
    expect(exported).toHaveLength(observations.length);
    expect(exported.some(row => /NaN|Infinity/.test(row.value))).toBe(false);
  });
});
