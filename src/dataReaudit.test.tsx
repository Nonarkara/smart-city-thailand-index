import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { allCities } from "./cityData";
import { generateSWOT } from "./swotAnalysis";
import { assessBankability, recommendInstruments } from "./financialToolkit";
import { getCityDetail } from "./cityCdp";
import AboutPage from "./AboutPage";
import ShowcasePage from "./ShowcasePage";

const navigate = () => undefined;

describe("research claims stay inside their evidence", () => {
  it("does not turn editorial default dates into an asserted observation year for any of the 118 city seeds", () => {
    expect(allCities).toHaveLength(118);
    for (const city of allCities) {
      const detail = getCityDetail(city.id)!;
      for (const row of detail.metricBlocks.flatMap(block => block.observations)) {
        expect(row.provenance.dateBasis).toBe("editorial_defaults_not_observation_or_verification");
        expect(row.periodLabel).toMatch(/original observation period.*not.*verified/);
        expect(row.periodLabel).not.toMatch(/^2025 (baseline|annual average)$/);
        if (row.metricKey === "fdiInflow") expect(row.methodNote).toContain("not proof of disbursed FDI");
      }
    }
  });

  it("does not turn low scores, plan-stage records or missing metrics into service or geographic facts", () => {
    for (const city of allCities) {
      const swot = generateSWOT({ ...city, reality: "planned", metrics: {} });
      const output = Object.values(swot).flat().join(" ");
      expect(output).not.toMatch(/no built infrastructure|no critical weaknesses|eligible|deep south|Andaman|stagnation|National 105/i);
      expect(output).not.toMatch(/PM₂.₅|Stored crime rate|Stored green-coverage/);
    }
  });

  it("compares stored annual PM2.5 to the WHO2021 annual5 guideline and never treats an absent value as clean air", () => {
    const city = { ...allCities[0], metrics: { pm25Annual: 6 } };
    const threats = generateSWOT(city).threats.join(" ");
    expect(threats).toContain("WHO 2021 annual guideline of 5");
    expect(threats).toContain("not a current reading");
    expect(generateSWOT({ ...city, metrics: {} }).threats.join(" ")).toContain("not an all-clear");
  });

  it("qualifies finance screens even for the strongest curated records", () => {
    for (const city of allCities) {
      const recommendation = assessBankability(city).recommendation;
      expect(recommendation).toContain("not a credit assessment");
      expect(recommendation).not.toMatch(/can access|supports debt service|Ready for THB|Strong bankability/);
      expect(recommendInstruments(city).map(item => item.reason).join(" ")).not.toContain("eligible for EEC");
    }
  });

  it("uses the same conservative SWOT interpretation in all three languages", () => {
    for (const locale of ["en", "th", "zh"] as const) {
      const swot = generateSWOT({ ...allCities[0], province: "Trat", metrics: {} }, locale);
      expect(Object.values(swot).every(items => items.length > 0 && items.length <= 4)).toBe(true);
      if (locale !== "en") expect(Object.values(swot).flat().join(" ")).not.toContain("critical gap");
    }
  });

  it("describes incomplete FDI/cost data and dates national LINE use without claiming resident adoption", () => {
    const about = renderToStaticMarkup(<AboutPage locale="en" onNavigate={navigate} />);
    expect(about).toContain("not complete comparable datasets");
    const showcase = renderToStaticMarkup(<ShowcasePage locale="en" onNavigate={navigate} />);
    expect(showcase).toContain("54 million");
    expect(showcase).toContain("December 2024");
    expect(showcase).not.toContain("70 million");
    expect(showcase).not.toContain("tentative list");
    expect(showcase).toContain("property 1761");
    expect(showcase).toContain("not a count of unique municipal residents");
  });
});
