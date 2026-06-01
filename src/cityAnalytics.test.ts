import { getCityById } from "./cityData";
import { computeDevelopability } from "./cityAnalytics";
import { getLandPrice } from "./provincialLandPriceData";
import type { SmartCity } from "./types";

describe("cityAnalytics - Developability & Investability", () => {
  it("computes developability and investability correctly for Bangkok (Samyan)", () => {
    const city = getCityById("samyan");
    expect(city).toBeDefined();

    const dev = computeDevelopability(city!);
    expect(dev.total).toBeGreaterThan(0);
    expect(dev.landPriceBaht).toBe(250000);
    expect(dev.investabilityScore).toBeDefined();
    // Bangkok has high land price (250k = normalised price 1.0)
    // Multiplier is (1.2 - 0.8 * 1.0) = 0.4. Investability is total * 0.4
    expect(dev.investabilityScore).toBe(Math.round(dev.total * 0.4));
    expect(dev.investabilityLabel).toContain("Barrier");
  });

  it("computes developability and investability correctly for Khon Kaen", () => {
    const city = getCityById("khon-kaen");
    expect(city).toBeDefined();

    const dev = computeDevelopability(city!);
    expect(dev.total).toBeGreaterThan(0);
    expect(dev.landPriceBaht).toBe(20000);
    // Khon Kaen has lower land price (20k = normalised price 0.08)
    // Multiplier is (1.2 - 0.8 * 0.08) = 1.136. Investability is total * 1.136 (capped at 100)
    const expectedScore = Math.min(100, Math.round(dev.total * (1.2 - 0.8 * (20000 / 250000))));
    expect(dev.investabilityScore).toBe(expectedScore);
    expect(dev.investabilityLabel).toBeDefined();
  });

  it("handles null land price gracefully", () => {
    const mockCity: SmartCity = {
      id: "test-campus",
      nameEn: "Test Campus",
      nameTh: "วิทยาเขตทดสอบ",
      province: "Chiang Mai",
      provinceTh: "เชียงใหม่",
      region: "north" as const,
      status: "certified" as const,
      reality: "operational" as const,
      smartDimensions: ["living"],
      scores: {
        livability: 70,
        economy: 60,
        safety: 60,
        wellbeing: 60,
        environment: 60,
        hospitality: 60,
        digital: 60,
      },
      metrics: {
        population: 10,
        landPriceBaht: null, // explicitly null
      },
      compositeScore: 61,
      tier: "beta" as const,
      tagline: "Test",
      taglineTh: "ทดสอบ",
      highlights: [],
    };

    const dev = computeDevelopability(mockCity);
    expect(dev.total).toBeGreaterThan(0);
    expect(dev.landPriceBaht).toBeNull();
    expect(dev.investabilityScore).toBeNull();
    expect(dev.investabilityLabel).toBe("");
  });

  it("resolves provincial land price lookups", () => {
    expect(getLandPrice("Bangkok")).toBe(250000);
    expect(getLandPrice("Phuket")).toBe(50000);
    expect(getLandPrice("Unknown Province")).toBeNull();
  });
});
