import { describe, expect, it } from "vitest";
import { getCitySummaries } from "./cityCdp";
import { getEvidenceForCity } from "./evidenceData";
import { getFloodNote, getFloodScore } from "./provincialFloodData";
import { parseRankingsAxis, rankingsHref } from "./rankingsQuery";

describe("data legitimacy guards", () => {
  it("does not invent a flood score or note for unknown provinces", () => {
    expect(getFloodScore("Not A Province")).toBeUndefined();
    expect(getFloodNote("Not A Province")).toBeUndefined();
    expect(getFloodScore("Phuket")).toBeGreaterThan(0);
  });

  it("keeps registry-only cities at low confidence", () => {
    const registered = getCitySummaries().filter(city => city.status === "registered");
    expect(registered.length).toBeGreaterThan(0);
    registered.forEach(city => {
      expect(city.dataConfidence).toBe("low");
    });
  });

  it("does not mark evidence-empty dossiers as high confidence", () => {
    getCitySummaries()
      .filter(city => city.status !== "registered")
      .forEach(city => {
        if (getEvidenceForCity(city.id).length === 0) {
          expect(city.dataConfidence, city.id).not.toBe("high");
        }
      });
  });

  it("builds shareable rankings URLs for a pillar axis", () => {
    expect(rankingsHref("safety")).toBe("/rankings?pillar=safety");
    expect(parseRankingsAxis("?pillar=safety")).toBe("safety");
    expect(parseRankingsAxis("")).toBe("composite");
  });
});
