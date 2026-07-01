// Source: src/scoring.test.ts (live at github.com/Nonarkara/smart-city-thailand-index)
// Automated test proving the composite formula: fixed inputs, hand-checkable expected output. Run with 'npm run test:run'.
// ---------------------------------------------------------------------------

import { assignTier, computeComposite, getCompositeBreakdown, roundScore } from "./scoring";

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

  it("rejects pillar scores outside the 0-100 domain", () => {
    expect(() => computeComposite({
      ...sampleScores,
      digital: 101,
    })).toThrow(/between 0 and 100/i);
  });
});
