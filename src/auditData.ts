import { claimRegistry } from "./claimRegistry";
import { getCityFactsRows, getCitySummaries } from "./cityCdp";
import { getCompositeBreakdown } from "./scoring";

export function buildAuditReleaseSummary() {
  const cities = getCitySummaries();
  const factRows = getCityFactsRows();
  const metricRows = factRows.filter(row => row.fact_type === "metric");
  const sourceLinkedMetricRows = metricRows.filter(row => row.source_url.trim() !== "");
  const example = cities.find(city => city.id === "phuket") ?? cities[0];

  return {
    cities,
    fullDossiers: cities.filter(city => city.status !== "registered").length,
    registeredOnly: cities.filter(city => city.status === "registered").length,
    status: {
      certified: cities.filter(city => city.status === "certified").length,
      promotion: cities.filter(city => city.status === "promotion").length,
      registered: cities.filter(city => city.status === "registered").length,
    },
    confidence: {
      high: cities.filter(city => city.dataConfidence === "high").length,
      medium: cities.filter(city => city.dataConfidence === "medium").length,
      low: cities.filter(city => city.dataConfidence === "low").length,
    },
    metricRows: metricRows.length,
    sourceLinkedMetricRows: sourceLinkedMetricRows.length,
    verifiedClaims: claimRegistry.filter(claim => claim.confidence === "verified"),
    example,
    breakdown: getCompositeBreakdown(example.scores),
  };
}
