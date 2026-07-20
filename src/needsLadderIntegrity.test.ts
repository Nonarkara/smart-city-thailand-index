import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { computeNeedsLadder, weakestRung } from "./needsLadderEngine";
import { getBoiZone } from "./provincialBoiZones";

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
      expect(profile.observedCoverage).toBeLessThanOrEqual(profile.coverage);

      for (const rung of profile.rungs) {
        if (rung.score === undefined) {
          expect(rung.signals).toHaveLength(0);
        } else {
          expect(rung.score).toBeGreaterThanOrEqual(0);
          expect(rung.score).toBeLessThanOrEqual(100);
          expect(rung.signals.length).toBeGreaterThan(0);
        }
      }

      for (const signal of profile.rungs.flatMap(rung => rung.signals)) {
        if (signal.source === "provincial") {
          expect(signal.sourceLabel).toBeTruthy();
          expect(signal.sourceUrl).toMatch(/^https?:\/\//);
          expect(signal.asOf).toBeTruthy();
          expect(signal.geography).toBeTruthy();
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

    expect(calmTrafficBacked.map(city => city.id).sort()).toEqual([
      "chiang-mai-old-town",
      "cmu-smart-city",
      "hat-yai",
      "khon-kaen",
      "klong-phadung",
      "korat",
      "makkasan",
      "phra-ram-4",
      "rattanakosin",
      "samyan",
    ]);
    expect(calmTrafficBacked.some(city => city.id === "songkhla-city")).toBe(false);
  });

  it("does not promote district-only BOI overlays to province-wide evidence", () => {
    expect(getBoiZone("Songkhla")).toBeUndefined();
    expect(getBoiZone("Tak")).toBeUndefined();
    expect(getBoiZone("Trat")).toBeUndefined();
    expect(getBoiZone("Chachoengsao")).toBeDefined();
    expect(getBoiZone("Chiang Rai")?.label.en).toBe("Northern Economic Corridor");
  });

  it("keeps Pattaya cost-of-living evidence scoped to Pattaya", () => {
    const saensuk = allCities.find(city => city.id === "saensuk");
    const pattaya = allCities.find(city => city.id === "reg-pattaya");
    expect(saensuk).toBeDefined();
    expect(pattaya).toBeDefined();

    const saensukAffordability = computeNeedsLadder(saensuk!).rungs.find(rung => rung.id === "affordability");
    const pattayaAffordability = computeNeedsLadder(pattaya!).rungs.find(rung => rung.id === "affordability");
    expect(saensukAffordability?.signals.some(signal => signal.label.en === "Cost-of-living index")).toBe(false);
    expect(pattayaAffordability?.signals.some(signal => signal.label.en === "Cost-of-living index")).toBe(true);
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
