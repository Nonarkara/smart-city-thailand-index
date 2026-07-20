import { claimRegistry } from "./claimRegistry";
import { getCityFactsRows, getCitySummaries } from "./cityCdp";
import { allCities } from "./cityData";
import { computeNeedsLadder } from "./needsLadderEngine";
import { getCompositeBreakdown } from "./scoring";

export function buildAuditReleaseSummary() {
  const cities = getCitySummaries();
  const factRows = getCityFactsRows();
  const metricRows = factRows.filter(row => row.fact_type === "metric");
  const sourceLinkedMetricRows = metricRows.filter(row => row.source_url.trim() !== "");
  const example = cities.find(city => city.id === "phuket") ?? cities[0];

  const dossierCities = allCities.filter(city => city.status !== "registered");
  const ladderProfiles = dossierCities.map(city => computeNeedsLadder(city));
  const coverageTotal = ladderProfiles.reduce((sum, profile) => sum + profile.coverage, 0);
  const calmTrafficBacked = ladderProfiles.filter(profile =>
    profile.rungs.some(rung => rung.id === "calm" && rung.score !== undefined
      && rung.signals.some(signal => signal.source === "provincial")),
  ).length;

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
    needsLadder: {
      dossierCities: dossierCities.length,
      meanCoverage: dossierCities.length === 0
        ? 0
        : Math.round((coverageTotal / dossierCities.length) * 10) / 10,
      fullCoverage: ladderProfiles.filter(profile => profile.coverage === 8).length,
      calmTrafficBacked,
      rungs: 8,
    },
  };
}
