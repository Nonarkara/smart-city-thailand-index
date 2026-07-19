import {
  classifyDataConfidence,
  computeDataConfidenceScore,
  computeMetricCoverage,
  computeProvenanceWeight,
} from "./methodologySpec";

describe("methodology spec helpers", () => {
  it("measures core and extended metric coverage separately", () => {
    const coverage = computeMetricCoverage({
      population: 100,
      gppPerCapita: 500000,
      avgMonthlyIncome: 32000,
      pm25Annual: 18,
      hospitalBedsPer10k: 24,
      crimeRatePer100k: 110,
      greenCoverage: 42,
      gppGrowthRate: 4.5,
      pm25Trend: "improving",
    });

    expect(coverage.coreFilled).toBe(6);
    expect(coverage.extendedFilled).toBe(2);
    expect(coverage.coreRatio).toBe(1);
  });

  it("saturates provenance support instead of growing without bound", () => {
    expect(computeProvenanceWeight(0)).toBe(0);
    expect(computeProvenanceWeight(9)).toBe(0.6);
    expect(computeProvenanceWeight(36)).toBe(1);
  });

  it("classifies a rich, fresh evidence backbone as high confidence", () => {
    const score = computeDataConfidenceScore({
      metrics: {
        population: 100,
        gppPerCapita: 500000,
        avgMonthlyIncome: 32000,
        pm25Annual: 18,
        hospitalBedsPer10k: 24,
        crimeRatePer100k: 110,
        greenCoverage: 42,
        gppGrowthRate: 4.5,
        pm25Trend: "improving",
        waterQuality: 70,
        forestCoverage: 35,
        fdiInflow: 2500,
        industryComposition: "services 50%, manufacturing 30%, agriculture 20%",
        laborForce: 400,
      },
      provenanceCount: 22,
      latestObservedAt: "2026-03-20T00:00:00.000Z",
    });

    expect(score).toBeGreaterThanOrEqual(70);
    expect(classifyDataConfidence(score)).toBe("high");
  });

  it("classifies sparse, stale observations as low confidence", () => {
    const score = computeDataConfidenceScore({
      metrics: {
        population: 12,
        pm25Annual: 41,
      },
      provenanceCount: 1,
      latestObservedAt: "2024-01-01T00:00:00.000Z",
    });

    expect(score).toBeLessThan(40);
    expect(classifyDataConfidence(score)).toBe("low");
  });
});
