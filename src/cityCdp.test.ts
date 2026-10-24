import { parse } from "csv-parse/sync";
import { allCities } from "./cityData";
import { escapeCsvField, getCityDetail, getCitySummaries, getCityFactsCsv, getCityFactsRows, getCitySummariesCsv } from "./cityCdp";

describe("cityCdp derivation", () => {
  it("builds a profile, finance profile, and recommendations for every city", () => {
    const cities = getCitySummaries();

    expect(cities.length).toBeGreaterThan(40);

    cities.forEach(city => {
      const detail = getCityDetail(city.id);

      expect(detail).toBeDefined();
      expect(detail?.financeProfile.cityId).toBe(city.id);
      expect(detail?.financeRecommendations.length).toBeGreaterThan(0);
      expect(detail?.provenanceCount).toBeGreaterThan(0);
      expect(detail?.exportMetadata.provenanceCount).toBe(detail?.provenanceCount);
      detail?.financeRecommendations.forEach(recommendation => {
        expect(recommendation.supports.length).toBeGreaterThan(0);
      });
    });
  });

  it("produces differentiated finance logic for same-tier cities with different contexts", () => {
    const phuket = getCityDetail("phuket");
    const samyan = getCityDetail("samyan");

    expect(phuket?.tier).toBe(samyan?.tier);
    expect(phuket?.financeRecommendations[0].instrumentId).not.toBe(samyan?.financeRecommendations[0].instrumentId);
    expect(phuket?.financeRecommendations[0].reasonSummary.en).not.toBe(samyan?.financeRecommendations[0].reasonSummary.en);
  });

  it("separates alpha, beta, and gamma cities into different lead mechanisms or delivery notes", () => {
    const alpha = getCitySummaries().find(city => city.tier === "alpha");
    const beta = getCitySummaries().find(city => city.tier === "beta");
    const gamma = getCitySummaries().find(city => city.tier === "gamma");

    expect(alpha).toBeDefined();
    expect(beta).toBeDefined();
    expect(gamma).toBeDefined();

    const alphaDetail = getCityDetail(alpha!.id)!;
    const betaDetail = getCityDetail(beta!.id)!;
    const gammaDetail = getCityDetail(gamma!.id)!;

    expect(alphaDetail.financeRecommendations[0].segment).toBe("alpha");
    expect(betaDetail.financeRecommendations[0].segment).toBe("beta");
    expect(gammaDetail.financeRecommendations[0].segment).toBe("gamma");

    expect(new Set([
      alphaDetail.financeRecommendations[0].instrumentId,
      betaDetail.financeRecommendations[0].instrumentId,
      gammaDetail.financeRecommendations[0].instrumentId,
    ]).size).toBeGreaterThan(1);

    expect(alphaDetail.deliveryProfile.deliveryNote.en).not.toBe(betaDetail.deliveryProfile.deliveryNote.en);
    expect(betaDetail.deliveryProfile.deliveryNote.en).not.toBe(gammaDetail.deliveryProfile.deliveryNote.en);
  });

  it("neutralizes spreadsheet formulas without touching negative numbers", () => {
    expect(escapeCsvField("=HYPERLINK(\"http://evil\")")).toBe("\"'=HYPERLINK(\"\"http://evil\"\")\"");
    expect(escapeCsvField("-not-a-number")).toBe("\"'-not-a-number\"");
    expect(escapeCsvField("-12.5")).toBe("-12.5");
    expect(escapeCsvField("a,b")).toBe("\"a,b\"");
    expect(escapeCsvField("phuket")).toBe("phuket");
  });
});


describe("city export units and provenance", () => {
  it("exports population and labour numeric observations in people", () => {
    for (const city of allCities) {
      const detail = getCityDetail(city.id)!;
      const observations = detail.metricBlocks.flatMap(block => block.observations);
      for (const observation of observations.filter(item => item.metricKey === "population" || item.metricKey === "laborForce")) {
        const input = city.metrics[observation.metricKey as "population" | "laborForce"];
        expect(observation.unit).toBe("people");
        expect(observation.metricValueNum).toBe(input && input > 0 ? input * 1000 : null);
      }
    }
    const population = getCityDetail("phuket")!.metricBlocks.flatMap(block => block.observations).find(item => item.metricKey === "population")!;
    expect(population.metricValueNum).toBe(418000);
    expect(population.metricValueText).toBe("418K");
  });

  it("keeps FDI values in their declared million-baht scale", () => {
    const facts = getCityFactsRows();
    const fdi = facts.filter(row => row.fact_type === "metric" && row.metric_key_or_recommendation_key === "fdiInflow");
    expect(fdi.length).toBeGreaterThan(0);
    expect(fdi.every(row => row.unit === "million THB")).toBe(true);
    expect(fdi.find(row => row.city_id === "phuket")?.value).toBe("฿3,200");
  });

  it("roundtrips all 118 dossiers and CSV rows with baseline disclosures", () => {
    const cities = getCitySummaries();
    expect(cities).toHaveLength(118);
    expect(new Set(cities.map(city => city.id)).size).toBe(118);
    const summaries = parse(getCitySummariesCsv(), { columns: true });
    const facts = parse(getCityFactsCsv(), { columns: true });
    expect(summaries).toHaveLength(118);
    expect(facts).toHaveLength(getCityFactsRows().length);
    expect([...summaries, ...facts].every(row => row.locally_verified === "false" && row.input_basis === "curated_seed_baseline")).toBe(true);
    for (const city of cities) {
      expect(city.rawMetricUnits).toEqual({ population: "thousand people", laborForce: "thousand people", fdiInflow: "million THB" });
      expect(city.provenance.locallyVerified).toBe(false);
      expect(city.provenance.confidenceBasis).toBe("input_coverage_not_local_verification");
      expect(city.provenance.dateBasis).toBe("editorial_defaults_not_observation_or_verification");
      expect(parse(getCityFactsCsv(city.id), { columns: true })).toHaveLength(getCityFactsRows(city.id).length);
      getCityDetail(city.id)!.metricBlocks.flatMap(block => block.observations).forEach(observation => {
        expect(observation.provenance.locallyVerified).toBe(false);
      });
    }
  });
});
