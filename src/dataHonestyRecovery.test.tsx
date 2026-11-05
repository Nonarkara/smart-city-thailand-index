import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { allCities } from "./cityData";
import { getCityDetail, getCitySummaries } from "./cityCdp";
import { getEvidenceForCity } from "./evidenceData";
import { applyEvidenceConfidenceCap, computeMetricCoverage } from "./methodologySpec";
import { getFloodNote, getFloodScore, PROVINCIAL_FLOOD_SCORE } from "./provincialFloodData";
import { blendLivabilityScore, blendSafetyScore } from "./scoring";
import CityDetailPage from "./CityDetailPage";

const fixture = vi.hoisted(() => ({ legacy: false, unsafeSource: false }));
vi.mock("./cityApi", async importOriginal => {
  const actual = await importOriginal<typeof import("./cityApi")>();
  const { getCityDetail: detailFor } = await import("./cityCdp");
  return {
    ...actual,
    useCityDetail: (id: string) => {
      const detail = detailFor(id);
      return { data: detail && fixture.legacy ? {
        ...detail,
        keyMetrics: detail.keyMetrics.map(({ sourceUrl: _url, sourceName: _name, provenance: _scope, referenceLabel: _period, ...metric }) => metric),
      } : detail && fixture.unsafeSource ? { ...detail, keyMetrics: detail.keyMetrics.map(metric => ({ ...metric, sourceUrl: "javascript:alert(1)" })) } : detail, loading: false, error: null };
    },
  };
});
afterEach(() => { fixture.legacy = false; fixture.unsafeSource = false; });

describe("recovered missing-data guards", () => {
  it("does not manufacture an average flood score or note for an absent province", () => {
    expect(getFloodScore("Not a province")).toBeUndefined();
    expect(getFloodNote("Not a province")).toBeUndefined();
    expect(getFloodScore("Phuket")).toBe(80);
  });

  it.each([undefined, null, Number.NaN, Number.POSITIVE_INFINITY, -1])("leaves the safety score alone for invalid rate %s", rate => {
    expect(blendSafetyScore(63, rate)).toBe(63);
  });

  it.each([undefined, null, Number.NaN, Number.POSITIVE_INFINITY, -1, 101])("leaves livability alone for invalid flood score %s", score => {
    expect(blendLivabilityScore(63, score)).toBe(63);
  });

  it("retains a genuine zero rather than treating it as absent", () => {
    expect(blendSafetyScore(60, 0)).toBe(72);
    expect(blendLivabilityScore(60, 0)).toBe(45);
    const coverage = computeMetricCoverage({ pm25Annual: 0, crimeRatePer100k: 0, gppPerCapita: Number.NaN, avgMonthlyIncome: Number.POSITIVE_INFINITY });
    expect(coverage.coreFilled).toBe(2);
    PROVINCIAL_FLOOD_SCORE["Synthetic test province"] = { score: 0, note: "Synthetic zero fixture" };
    try {
      expect(getFloodScore("Synthetic test province")).toBe(0);
      expect(getFloodNote("Synthetic test province")).toBe("Synthetic zero fixture");
      PROVINCIAL_FLOOD_SCORE["Synthetic test province"].score = Number.NaN;
      expect(getFloodScore("Synthetic test province")).toBeUndefined();
      expect(getFloodNote("Synthetic test province")).toBeUndefined();
    } finally {
      delete PROVINCIAL_FLOOD_SCORE["Synthetic test province"];
    }
  });

  it("caps confidence without equating evidence presence with verification", () => {
    expect(applyEvidenceConfidenceCap("high", 0, "certified")).toBe("medium");
    expect(applyEvidenceConfidenceCap("high", Number.NaN, "certified")).toBe("medium");
    expect(applyEvidenceConfidenceCap("high", 10, "registered")).toBe("low");
    expect(applyEvidenceConfidenceCap("low", 10, "certified")).toBe("low");
    for (const city of [...allCities, ...getCitySummaries()]) {
      if (city.status === "registered") expect(city.dataConfidence, city.id).toBe("low");
      else if (getEvidenceForCity(city.id).length === 0) expect(city.dataConfidence, city.id).not.toBe("high");
    }
  });

  it("does not award the legacy high-confidence finance bonus to an evidence-empty dossier", () => {
    const city = allCities.find(item => item.id === "phra-ram-4")!;
    const detail = getCityDetail(city.id)!;
    expect(getEvidenceForCity(city.id)).toHaveLength(0);
    expect(city.dataConfidence).toBe("medium");
    // The same heuristic previously returned65/building after assigning high confidence
    // solely from filled inputs. These are model outputs, not measured readiness.
    expect(detail.financeProfile.readinessScore).toBe(63);
    expect(detail.deliveryProfile.dataPlatformStatus).toBe("gap");
    expect(detail.financeRecommendations[0].priorityScore).toBe(73);
    // Preserve the existing unverified registry categories; do not invent acute risk.
    for (const registered of getCitySummaries().filter(item => item.status === "registered")) {
      expect(getCityDetail(registered.id)!.financeProfile.riskProfile).toBe("low");
    }
  });

  it("omits the three documented placeholder populations, without changing planned-city risk handling", () => {
    for (const id of ["makkasan", "wangchan-valley", "phuket-tinicon"]) {
      const city = getCityDetail(id)!;
      expect(city.metrics.population, id).toBeUndefined();
      expect(city.metricBlocks.flatMap(block => block.observations).some(row => row.metricKey === "population")).toBe(false);
      expect(city.financeProfile.riskProfile).toBe("acute");
    }
  });
});

describe("quick metrics carry their evidence limits", () => {
  it.each(["en", "th", "zh"] as const)("shows source, scope and unverified reference period beside every value in %s", locale => {
    const detail = getCityDetail("phuket")!;
    const root = document.createElement("div");
    root.innerHTML = renderToStaticMarkup(<CityDetailPage cityId="phuket" locale={locale} onNavigate={() => undefined} />);
    const rows = [...root.querySelectorAll(".city-quick-metrics .city-qm")].slice(0, detail.keyMetrics.length);
    expect(rows).toHaveLength(detail.keyMetrics.length);
    rows.forEach((row, i) => {
      const metric = detail.keyMetrics[i];
      expect(row.querySelector(".city-qm-val")?.textContent).toBe(metric.value);
      expect(row.textContent).toContain(metric.provenance![locale]);
      expect(row.textContent).toContain(metric.referenceLabel![locale]);
      expect(row.querySelector("a")?.getAttribute("href")).toBe(metric.sourceUrl);
    });
    expect(detail.keyMetrics.find(metric => metric.key === "gppPerCapita")?.provenance?.en).toBe("Provincial proxy");
  });

  it("renders an older cached DTO with explicit unknown scope and period instead of crashing", () => {
    fixture.legacy = true;
    const root = document.createElement("div");
    root.innerHTML = renderToStaticMarkup(<CityDetailPage cityId="phuket" locale="en" onNavigate={() => undefined} />);
    expect(root.querySelector(".city-quick-metrics")?.textContent).toContain("Scope unverified");
    expect(root.querySelector(".city-quick-metrics")?.textContent).toContain("Reference seed · period unverified");
  });

  it("does not turn a non-web source URL from an API payload into an executable link", () => {
    fixture.unsafeSource = true;
    const root = document.createElement("div");
    root.innerHTML = renderToStaticMarkup(<CityDetailPage cityId="phuket" locale="en" onNavigate={() => undefined} />);
    expect(root.querySelector(".city-quick-metrics")?.textContent).toContain("NESDC");
    expect(root.querySelectorAll(".city-quick-metrics a")).toHaveLength(0);
  });
});
