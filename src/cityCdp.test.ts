import { getCityDetail, getCityFactsCsv, getCitySummaries, getCitySummariesCsv } from "./cityCdp";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

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

  it("exports spreadsheet-safe summary and fact CSVs with quantitative columns", () => {
    const summaryRows = parseCsv(getCitySummariesCsv());
    const factRows = parseCsv(getCityFactsCsv());
    const summaryHeaders = summaryRows[0];
    const factHeaders = factRows[0];

    expect(summaryHeaders).toContain("livability_score");
    expect(summaryHeaders).toContain("profile_level");
    expect(summaryHeaders).toContain("population_thousand");
    expect(summaryHeaders).toContain("land_area_km2");
    expect(summaryHeaders).toContain("population_density_per_km2");
    expect(summaryHeaders).toContain("population_source_scope");
    expect(summaryHeaders).toContain("land_area_method_note");
    expect(summaryHeaders).toContain("pm25_annual_ug_m3");
    expect(summaryHeaders).toContain("smart_dimensions");
    expect(factHeaders).toContain("value_numeric");
    expect(factHeaders).toContain("source_name");
    expect(factHeaders).toContain("method_note");

    for (const rows of [summaryRows, factRows]) {
      const headers = rows[0];
      expect(new Set(headers).size).toBe(headers.length);
      rows.slice(1).forEach(row => {
        expect(row).toHaveLength(headers.length);
        expect(row.join(" ")).not.toMatch(/\b(undefined|null|NaN)\b/);
      });
    }
  });

  it("fills registered-city baseline population, land area, density, and provenance", () => {
    const summaryRows = parseCsv(getCitySummariesCsv());
    const summaryHeaders = summaryRows[0];
    const summaryById = new Map(summaryRows.slice(1).map(row => [row[summaryHeaders.indexOf("id")], row]));
    const chumphon = summaryById.get("reg-chumphon");

    expect(chumphon).toBeDefined();
    expect(chumphon?.[summaryHeaders.indexOf("population_thousand")]).toBe("508");
    expect(chumphon?.[summaryHeaders.indexOf("land_area_km2")]).toBe("5998");
    expect(chumphon?.[summaryHeaders.indexOf("population_density_per_km2")]).toBe("85");
    expect(chumphon?.[summaryHeaders.indexOf("population_source_scope")]).toBe("province");
    expect(chumphon?.[summaryHeaders.indexOf("land_area_source_scope")]).toBe("province");

    const factRows = parseCsv(getCityFactsCsv("reg-chumphon"));
    const factHeaders = factRows[0];
    const landAreaFact = factRows.find(row => row[factHeaders.indexOf("metric_key_or_recommendation_key")] === "landAreaKm2");
    const densityFact = factRows.find(row => row[factHeaders.indexOf("metric_key_or_recommendation_key")] === "populationDensityPerKm2");

    expect(landAreaFact?.[factHeaders.indexOf("source_id")]).toBe("admin-boundaries");
    expect(landAreaFact?.[factHeaders.indexOf("value_numeric")]).toBe("5998");
    expect(densityFact?.[factHeaders.indexOf("value_numeric")]).toBeTruthy();
  });
});
