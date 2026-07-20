import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { computeNeedsLadder, weakestRung } from "./needsLadderEngine";

describe("Needs Ladder integrity", () => {
  it("scores only dossier cities and never invents a rung without signals", () => {
    const dossiers = allCities.filter(city => city.status !== "registered");
    expect(dossiers.length).toBeGreaterThan(0);

    for (const city of dossiers) {
      const profile = computeNeedsLadder(city);
      expect(profile.cityId).toBe(city.id);
      expect(profile.rungs).toHaveLength(8);
      expect(profile.coverage).toBe(
        profile.rungs.filter(rung => rung.score !== undefined).length,
      );

      for (const rung of profile.rungs) {
        if (rung.score === undefined) {
          expect(rung.signals).toHaveLength(0);
        } else {
          expect(rung.score).toBeGreaterThanOrEqual(0);
          expect(rung.score).toBeLessThanOrEqual(100);
          expect(rung.signals.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps TomTom calm-traffic coverage honest (sourced provinces only)", () => {
    const dossiers = allCities.filter(city => city.status !== "registered");
    const calmTrafficBacked = dossiers.filter(city => {
      const calm = computeNeedsLadder(city).rungs.find(rung => rung.id === "calm");
      return calm?.score !== undefined
        && calm.signals.some(signal => signal.source === "provincial");
    });

    // TomTom covers five Thai cities; dossier cities in those provinces only.
    expect(calmTrafficBacked.length).toBeGreaterThanOrEqual(1);
    expect(calmTrafficBacked.length).toBeLessThanOrEqual(dossiers.length);
    expect(calmTrafficBacked.length).toBeLessThan(dossiers.length);
  });

  it("surfaces a weakest rung only from scored rungs", () => {
    const phuket = allCities.find(city => city.id === "phuket");
    expect(phuket).toBeDefined();
    const profile = computeNeedsLadder(phuket!);
    const weak = weakestRung(profile);
    expect(weak).toBeDefined();
    expect(weak!.score).toBeDefined();
    expect(profile.rungs.every(rung =>
      rung.score === undefined || rung.score >= weak!.score!,
    )).toBe(true);
  });
});
