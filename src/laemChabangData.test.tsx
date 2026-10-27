import { render, screen, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import LaemChabangPage from "./LaemChabangPage";
import { laemChabangProfile as profile, validateMunicipalProfile } from "./laemChabangData";
import { allCities } from "./cityData";
import { isMunicipalContextCity, parseRoute } from "./routing";
import { syncDocumentMeta } from "./siteMeta";

afterEach(cleanup);

describe("Laem Chabang municipal context", () => {
  it("adds a city route without manufacturing an index or registry assessment", () => {
    expect(parseRoute("/city/laem-chabang/")).toEqual({ kind: "city", cityId: "laem-chabang", path: "/city/laem-chabang" });
    expect(isMunicipalContextCity("laem-chabang")).toBe(true);
    expect(isMunicipalContextCity("reg-chon-buri-muni")).toBe(false);
    expect(allCities).toHaveLength(118);
    expect(allCities.some(c => c.id === profile.id)).toBe(false);
    expect(profile.assessment).toBeNull();
    expect(profile.certification.status).toBe("not-verified");
  });

  it("preserves observation periods, distinct geographic scope and unknown municipal totals", () => {
    expect(validateMunicipalProfile(profile)).toBe(true);
    expect(profile.facts.find(f => f.id === "municipal-area")?.period).toBeNull();
    expect(profile.facts.find(f => f.id === "registered-population")).toMatchObject({ value: 86790, period: "2024-12" });
    expect(profile.facts.find(f => f.id === "port-calls-fy2023")).toMatchObject({ value: 11700, period: "FY2023" });
    expect(profile.facts.find(f => f.id === "lcit-containers-2025")?.scope.en).toContain("not whole-port");
    expect(profile.gaps.some(g => g.id === "municipal-economy")).toBe(true);
    expect(profile.facts.some(f => f.id.includes("gdp"))).toBe(false);
  });

  it("rejects invented assessments, uncited facts and malformed source documents", () => {
    for (const value of [null, {}, { ...profile, assessment: { score: 39.5 } }, { ...profile, certification: undefined }, { ...profile, facts: [{ ...profile.facts[0], value: NaN }] }, { ...profile, facts: [{ ...profile.facts[0], sourceIds: ["invented-source"] }] }, { ...profile, sources: [{ ...profile.sources[0], url: "javascript:alert(1)" }] }]) {
      expect(validateMunicipalProfile(value)).toBe(false);
    }
  });

  it("publishes the exact typed source record as reusable JSON", () => {
    const bytes = readFileSync("public/data/cities/laem-chabang.json");
    expect(JSON.parse(bytes.toString())).toEqual(profile);
    expect(createHash("sha256").update(bytes).digest("hex")).toHaveLength(64);
  });

  for (const locale of ["en", "th", "zh"] as const) {
    it(`keeps complete source/action pairs in ${locale}`, () => {
      render(<LaemChabangPage locale={locale} />);
      expect(screen.getByRole("heading", { level: 1, name: profile.title[locale] })).toBeInTheDocument();
      expect(document.querySelector(`a[href="${profile.links.twin}"]`)).toBeInTheDocument();
      expect(document.querySelector('a[download="laem-chabang.json"]')).toHaveAttribute("href", "/data/cities/laem-chabang.json");
      expect(screen.getByText(profile.certification.note[locale])).toBeInTheDocument();
      expect(screen.getByText(profile.facts[3].scope[locale], { exact: false })).toBeInTheDocument();
      expect(document.querySelectorAll(".municipal-fact")).toHaveLength(5);
      expect(document.querySelectorAll(".municipal-project")).toHaveLength(3);
      for (const source of profile.sources) expect(document.querySelector(`a[href="${source.url}"]`)).toBeInTheDocument();
      syncDocumentMeta("/city/laem-chabang/", locale);
      expect(document.title).toContain(profile.title[locale]);
      expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toContain(profile.certification.note[locale]);
    });
  }
});
