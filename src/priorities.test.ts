import {
  DEFAULT_PRIORITY_WEIGHTS,
  PRIORITY_MAX_WEIGHT,
  PRIORITY_MIN_WEIGHT,
  PRIORITY_TOTAL,
  redistributePriorityWeights,
} from "./priorities";

describe("priority redistribution", () => {
  it("keeps the total fixed at 100 while respecting min and max bounds", () => {
    const next = redistributePriorityWeights(
      {
        livability: 60,
        economy: 2,
        safety: 2,
        wellbeing: 2,
        environment: 2,
        hospitality: 32,
      },
      "livability",
      2,
    );

    const values = Object.values(next);
    expect(values.reduce((sum, value) => sum + value, 0)).toBe(PRIORITY_TOTAL);
    expect(Math.min(...values)).toBeGreaterThanOrEqual(PRIORITY_MIN_WEIGHT);
    expect(Math.max(...values)).toBeLessThanOrEqual(PRIORITY_MAX_WEIGHT);
  });

  it("returns the original object when the target value is unchanged", () => {
    const same = redistributePriorityWeights(
      DEFAULT_PRIORITY_WEIGHTS,
      "livability",
      DEFAULT_PRIORITY_WEIGHTS.livability,
    );

    expect(same).toBe(DEFAULT_PRIORITY_WEIGHTS);
  });
});
