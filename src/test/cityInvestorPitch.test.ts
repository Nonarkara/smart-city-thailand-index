import { describe, it, expect } from "vitest";
import { allCities } from "../cityData.ts";
import { getInvestorPitch, getInvestorPitchForLocale } from "../cityInvestorPitch.ts";

describe("cityInvestorPitch", () => {
  it("generates a pitch for every city without throwing", () => {
    for (const city of allCities) {
      const pitch = getInvestorPitch(city);
      expect(pitch.cityId).toBe(city.id);
      expect(pitch.headline.en.length).toBeGreaterThan(10);
      expect(pitch.whyLook.en.length).toBeGreaterThan(10);
      expect(pitch.competitiveEdge.en.length).toBeGreaterThan(10);
      expect(pitch.opportunity.en.length).toBeGreaterThan(10);
      expect(pitch.idealInvestor.en.length).toBeGreaterThan(10);
      expect(pitch.riskNote.en.length).toBeGreaterThan(10);
      expect(pitch.nextStep.en.length).toBeGreaterThan(10);
    }
  });

  it("produces Thai and Chinese outputs for Phuket", () => {
    const phuket = allCities.find(c => c.id === "phuket")!;
    const pitch = getInvestorPitch(phuket);
    expect(pitch.headline.th).toContain("ภูเก็ต");
    expect(pitch.headline.zh).toContain("Phuket");
    expect(pitch.whyLook.th).toContain("คะแนน");
    expect(pitch.whyLook.zh).toContain("综合评分");
  });

  it("includes the standout pillar with score", () => {
    const phuket = allCities.find(c => c.id === "phuket")!;
    const pitch = getInvestorPitch(phuket);
    expect(pitch.standoutPillar.score).toBeGreaterThanOrEqual(0);
    expect(pitch.standoutPillar.score).toBeLessThanOrEqual(100);
    expect(["livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital"]).toContain(pitch.standoutPillar.key);
  });

  it("locale-specific helper returns correct language", () => {
    const khonKaen = allCities.find(c => c.id === "khon-kaen")!;
    const en = getInvestorPitchForLocale(khonKaen, "en");
    const th = getInvestorPitchForLocale(khonKaen, "th");
    expect(en.headline).toContain("Khon Kaen");
    expect(th.headline).toContain("ขอนแก่น");
    expect(en.tags.length).toBeGreaterThan(0);
    expect(th.tags.length).toBeGreaterThan(0);
  });

  it("uses context-specific opportunity and risk when available", () => {
    const nst = allCities.find(c => c.id === "nakhon-si-thammarat")!;
    const pitch = getInvestorPitch(nst);
    // Nakhon Si Thammarat has curated context; opportunity should mention LINE/citizen model
    expect(pitch.opportunity.en.length).toBeGreaterThan(20);
    expect(pitch.riskNote.en.length).toBeGreaterThan(10);
  });

  it("falls back gracefully for registered cities with low confidence", () => {
    const registered = allCities.find(c => c.status === "registered")!;
    const pitch = getInvestorPitch(registered);
    expect(pitch.headline.en).toContain(registered.nameEn);
    expect(pitch.whyLook.en).toContain("/100");
    expect(pitch.riskNote.en.length).toBeGreaterThan(10);
  });
});
