import { computeComposite, getCompositeBreakdown } from "./scoring";

describe("scoring helpers", () => {
  it("keeps the breakdown composite aligned with the scoring function", () => {
    const scores = {
      livability: 80,
      economy: 70,
      safety: 60,
      wellbeing: 75,
      environment: 65,
      hospitality: 85,
      digital: 55,
    };

    const breakdown = getCompositeBreakdown(scores);

    expect(breakdown.totalWeight).toBe(100);
    expect(breakdown.composite).toBe(computeComposite(scores));
  });
});
