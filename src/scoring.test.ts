import { assignTier, blendSafetyScore, computeComposite, getCompositeBreakdown, getStrongestWeakest, roundScore } from "./scoring";

const sampleScores = {
  livability: 80,
  economy: 70,
  safety: 60,
  wellbeing: 75,
  environment: 65,
  hospitality: 85,
  digital: 55,
};

describe("scoring helpers", () => {
  it("computes the weighted average exactly once the pillar scores are fixed", () => {
    expect(computeComposite(sampleScores)).toBe(72);
  });

  it("keeps the breakdown aligned with the scoring function", () => {
    const breakdown = getCompositeBreakdown(sampleScores);

    expect(breakdown.totalWeight).toBe(100);
    expect(breakdown.weightedSum).toBe(7200);
    expect(breakdown.terms).toHaveLength(7);
    expect(breakdown.composite).toBe(computeComposite(sampleScores));
  });

  it("rounds to one decimal place", () => {
    expect(roundScore(64.94)).toBe(64.9);
    expect(roundScore(64.95)).toBe(65);
  });

  it("assigns tiers at the documented boundaries", () => {
    expect(assignTier(65)).toBe("alpha");
    expect(assignTier(64.9)).toBe("beta");
    expect(assignTier(45)).toBe("beta");
    expect(assignTier(44.9)).toBe("gamma");
  });

  it("leaves safety unblended when the road fatality rate is missing", () => {
    expect(blendSafetyScore(70, undefined)).toBe(70);
    expect(blendSafetyScore(70, 20)).toBe(Math.round(0.7 * 70 + 0.3 * Math.round(100 * (40 - 20) / 35)));
  });

  it("names the strongest and weakest pillars without inventing ties", () => {
    expect(getStrongestWeakest(sampleScores)).toEqual({ strongest: "hospitality", weakest: "digital" });
  });

  it("rejects pillar scores outside the 0-100 domain", () => {
    expect(() => computeComposite({
      ...sampleScores,
      digital: 101,
    })).toThrow(/between 0 and 100/i);
  });
});
