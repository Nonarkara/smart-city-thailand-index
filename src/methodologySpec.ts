import { cdpSources } from "./cdpData.ts";
import { dataSources } from "./evidenceData.ts";
import { PILLAR_WEIGHTS, type CityMetrics, type CityScores, type DataConfidence, type ScoringPillar } from "./types.ts";

export const SCITI_METHOD_CODE = "SCITI-2026-METH";
export const SCITI_METHOD_VERSION = "2026.04";
export const SCITI_RELEASE_LABEL = "April 2026";
export const SCITI_DATA_CUTOFF_ISO = "2026-04-04T00:00:00.000Z";

export const SCORE_DOMAIN = Object.freeze({
  min: 0,
  max: 100,
  decimals: 1,
});

export const TIER_THRESHOLDS = Object.freeze({
  alpha: 65,
  beta: 45,
});

export const CORE_METRIC_KEYS = [
  "gppPerCapita",
  "avgMonthlyIncome",
  "pm25Annual",
  "hospitalBedsPer10k",
  "crimeRatePer100k",
  "greenCoverage",
] as const;

export const EXTENDED_METRIC_KEYS = [
  "gppGrowthRate",
  "pm25Trend",
  "waterQuality",
  "forestCoverage",
  "fdiInflow",
  "industryComposition",
  "laborForce",
] as const;

type MetricKey = (typeof CORE_METRIC_KEYS)[number] | (typeof EXTENDED_METRIC_KEYS)[number];

export const EVIDENCE_SOURCE_FAMILY_COUNT = dataSources.length;
export const PLATFORM_SOURCE_COUNT = cdpSources.length;
export const CDP_PLATFORM_COUNT = PLATFORM_SOURCE_COUNT;
export const GOVERNMENT_SOURCE_COUNT = dataSources.filter(source => source.type === "government").length;
export const SATELLITE_SOURCE_COUNT = dataSources.filter(source => source.type === "satellite").length;
export const INTERNATIONAL_SOURCE_COUNT = dataSources.filter(source => source.type === "international").length;
export const FIELD_SOURCE_COUNT = dataSources.filter(source => source.type === "field").length;

function filledMetricCount(metrics: CityMetrics, keys: readonly MetricKey[]): number {
  return keys.reduce((count, key) => {
    const value = metrics[key];
    if (value == null) return count;
    if (typeof value === "number") return value === 0 ? count : count + 1;
    return String(value).trim() ? count + 1 : count;
  }, 0);
}

export function computeMetricCoverage(metrics: CityMetrics) {
  const coreFilled = filledMetricCount(metrics, CORE_METRIC_KEYS);
  const extendedFilled = filledMetricCount(metrics, EXTENDED_METRIC_KEYS);

  return {
    coreFilled,
    coreTotal: CORE_METRIC_KEYS.length,
    coreRatio: coreFilled / CORE_METRIC_KEYS.length,
    extendedFilled,
    extendedTotal: EXTENDED_METRIC_KEYS.length,
    extendedRatio: extendedFilled / EXTENDED_METRIC_KEYS.length,
  };
}

export function clampScore(value: number): number {
  return Math.min(SCORE_DOMAIN.max, Math.max(SCORE_DOMAIN.min, value));
}

export function validateCityScores(scores: CityScores): CityScores {
  for (const pillar of Object.keys(PILLAR_WEIGHTS) as ScoringPillar[]) {
    const value = scores[pillar];
    if (!Number.isFinite(value)) {
      throw new TypeError(`Score for ${pillar} must be a finite number.`);
    }
    if (value < SCORE_DOMAIN.min || value > SCORE_DOMAIN.max) {
      throw new RangeError(
        `Score for ${pillar} must be between ${SCORE_DOMAIN.min} and ${SCORE_DOMAIN.max}. Received ${value}.`,
      );
    }
  }

  return scores;
}

export function formatCompositeFormula(shortLabels: Record<ScoringPillar, string>): string {
  const terms = (Object.keys(PILLAR_WEIGHTS) as ScoringPillar[])
    .map(pillar => `${shortLabels[pillar]}×${PILLAR_WEIGHTS[pillar]}`);
  return `Composite = (${terms.join(" + ")}) / 100`;
}

function daysBetween(startIso: string, endIso: string): number | null {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, Math.round((start - end) / 86_400_000));
}

export function computeFreshnessWeight(latestObservedAt?: string): number {
  if (!latestObservedAt) return 0.35;
  const ageDays = daysBetween(SCITI_DATA_CUTOFF_ISO, latestObservedAt);
  if (ageDays == null) return 0.35;
  if (ageDays <= 31) return 1;
  if (ageDays <= 92) return 0.8;
  if (ageDays <= 183) return 0.6;
  if (ageDays <= 366) return 0.4;
  return 0.2;
}

export function computeProvenanceWeight(provenanceCount?: number): number {
  if (!provenanceCount || provenanceCount <= 0) return 0;
  return Math.min(1, provenanceCount / EVIDENCE_SOURCE_FAMILY_COUNT);
}

interface DataConfidenceInputs {
  metrics?: CityMetrics;
  provenanceCount?: number;
  latestObservedAt?: string;
}

export function computeDataConfidenceScore(inputs: DataConfidenceInputs): number {
  const weightedParts: Array<{ weight: number; value: number }> = [];

  if (inputs.metrics) {
    const coverage = computeMetricCoverage(inputs.metrics);
    weightedParts.push({ weight: 0.65, value: coverage.coreRatio });
    weightedParts.push({ weight: 0.15, value: coverage.extendedRatio });
  }

  if (typeof inputs.provenanceCount === "number") {
    weightedParts.push({ weight: 0.1, value: computeProvenanceWeight(inputs.provenanceCount) });
  }

  if (inputs.latestObservedAt) {
    weightedParts.push({ weight: 0.1, value: computeFreshnessWeight(inputs.latestObservedAt) });
  }

  if (weightedParts.length === 0) return 0;

  const weightedSum = weightedParts.reduce((sum, part) => sum + part.weight * part.value, 0);
  const totalWeight = weightedParts.reduce((sum, part) => sum + part.weight, 0);

  return Math.round((weightedSum / totalWeight) * 1000) / 10;
}

export function classifyDataConfidence(score: number): DataConfidence {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}
