// ---------------------------------------------------------------------------
// City Investment Profiles integrity test
// ---------------------------------------------------------------------------
// The /invest page's "Where to put the money" section (InvestCityLens.tsx)
// renders 8 curated city profiles. If any of these drift — a missing
// translation, a broken ASEAN toolkit link, a cityId that no longer exists
// in cityData.ts — judges will see a half-rendered table and a "?" link.
// The /invest page is on the critical path of the award submission, so
// this guard runs in CI.
// ---------------------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import {
  CITY_INVESTMENT_PROFILES,
  TOOL_LABELS,
  type CityInvestmentProfile,
  type InvestmentTool,
} from "./cityInvestmentProfiles";

const KNOWN_TOOLS: Set<InvestmentTool> = new Set(Object.keys(TOOL_LABELS) as InvestmentTool[]);
const ASEAN_TOOLKIT_BASE = "https://smartcitytoolkit.asean.org/";

function isBilingualField(obj: { en: string; th: string; zh: string }, label: string): string | null {
  if (typeof obj.en !== "string" || obj.en.trim().length === 0) return `${label}.en is empty`;
  if (typeof obj.th !== "string" || obj.th.trim().length === 0) return `${label}.th is empty`;
  if (typeof obj.zh !== "string" || obj.zh.trim().length === 0) return `${label}.zh is empty`;
  return null;
}

describe("city investment profiles — /invest section", () => {
  it("has exactly the curated 8 cities", () => {
    expect(CITY_INVESTMENT_PROFILES).toHaveLength(8);
  });

  it("every cityId (when present) exists in cityData (no orphans)", () => {
    const knownIds = new Set(allCities.map(c => c.id));
    for (const p of CITY_INVESTMENT_PROFILES) {
      if (p.subjectKind === "metropolitan") {
        // Bangkok (the only metropolitan subject today) is intentionally
        // virtual — Bangkok is a province in cityData, not a single city.
        // Verify the structure: subjectKind is set, cityId is absent.
        expect(p.cityId, `${p.provinceEn}: metropolitan subject should not have a cityId`).toBeUndefined();
        continue;
      }
      expect(p.cityId, `city subject missing cityId`).toBeDefined();
      expect(knownIds.has(p.cityId!), `cityId "${p.cityId}" not found in cityData.ts`).toBe(true);
    }
  });

  it("subjectKind is one of the valid values", () => {
    for (const p of CITY_INVESTMENT_PROFILES) {
      expect(["city", "metropolitan"]).toContain(p.subjectKind);
    }
  });

  it("ranks are unique and sequential 1..N", () => {
    const ranks = CITY_INVESTMENT_PROFILES.map(p => p.rank).sort((a, b) => a - b);
    expect(ranks).toEqual(CITY_INVESTMENT_PROFILES.map((_, i) => i + 1));
  });

  it("EEC zone flag matches the city region (east ⇒ EEC)", () => {
    // The regional EEC provinces (Chachoengsao, Chonburi, Rayong) are the
    // only cities that should carry the EEC tag. Anywhere else is a bug.
    for (const p of CITY_INVESTMENT_PROFILES) {
      const city = allCities.find(c => c.id === p.cityId);
      if (p.eecZone) {
        expect(city?.region, `${p.cityId} flagged EEC but region is ${city?.region}`).toBe("east");
      } else {
        expect(city?.region, `${p.cityId} flagged non-EEC but region is ${city?.region}`).not.toBe("east");
      }
    }
  });

  it("primary and secondary tools are real ASEAN-toolkit categories", () => {
    for (const p of CITY_INVESTMENT_PROFILES) {
      expect(KNOWN_TOOLS.has(p.primaryTool), `${p.cityId}: primaryTool "${p.primaryTool}" not in TOOL_LABELS`).toBe(true);
      expect(KNOWN_TOOLS.has(p.secondaryTool), `${p.cityId}: secondaryTool "${p.secondaryTool}" not in TOOL_LABELS`).toBe(true);
      expect(p.primaryTool !== p.secondaryTool, `${p.cityId}: primary and secondary tool are the same`).toBe(true);
    }
  });

  it("every bilingual field is non-empty in en, th, zh", () => {
    const fields: Array<keyof Pick<CityInvestmentProfile, "oneLiner" | "bestFor" | "keyRisk">> = ["oneLiner", "bestFor", "keyRisk"];
    for (const p of CITY_INVESTMENT_PROFILES) {
      for (const f of fields) {
        const err = isBilingualField(p[f], `${p.cityId}.${f}`);
        expect(err, err ?? "").toBeNull();
      }
    }
  });

  it("every ASEAN toolkit comparable case links to a real case-study page", () => {
    for (const p of CITY_INVESTMENT_PROFILES) {
      const url = p.comparableCase.caseUrl;
      expect(
        url.startsWith(ASEAN_TOOLKIT_BASE),
        `${p.cityId}: case URL ${url} does not point at the ASEAN toolkit`,
      ).toBe(true);
      // Toolkit case URLs are /case-study/<slug>/
      expect(
        url.includes("/case-study/"),
        `${p.cityId}: case URL ${url} missing /case-study/ path segment`,
      ).toBe(true);
    }
  });

  it("comparable case has a non-empty country, caseName, amount, and bilingual oneLine", () => {
    for (const p of CITY_INVESTMENT_PROFILES) {
      const c = p.comparableCase;
      expect(c.country.trim().length, `${p.cityId}: case country empty`).toBeGreaterThan(0);
      expect(c.caseName.trim().length, `${p.cityId}: case name empty`).toBeGreaterThan(0);
      expect(c.amount.trim().length, `${p.cityId}: case amount empty`).toBeGreaterThan(0);
      expect(c.flagEmoji.trim().length, `${p.cityId}: case flagEmoji empty`).toBeGreaterThan(0);
      const err = isBilingualField(c.oneLine, `${p.cityId}.comparableCase.oneLine`);
      expect(err, err ?? "").toBeNull();
    }
  });

  it("optional climateNote, when present, is bilingual", () => {
    for (const p of CITY_INVESTMENT_PROFILES) {
      if (!p.climateNote) continue;
      const err = isBilingualField(p.climateNote, `${p.cityId}.climateNote`);
      expect(err, err ?? "").toBeNull();
    }
  });

  it("province is in th + en, with non-empty values", () => {
    for (const p of CITY_INVESTMENT_PROFILES) {
      expect(p.provinceEn.trim().length, `${p.cityId}: provinceEn empty`).toBeGreaterThan(0);
      expect(p.provinceTh.trim().length, `${p.cityId}: provinceTh empty`).toBeGreaterThan(0);
    }
  });
});
