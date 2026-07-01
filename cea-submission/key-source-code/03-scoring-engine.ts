// Source: src/scoring.ts (live at github.com/Nonarkara/smart-city-thailand-index)
// The composite score calculation. Takes 7 pillar scores, applies the weights from 01, returns one auditable number per city.
// ---------------------------------------------------------------------------

import { SCORE_DOMAIN, TIER_THRESHOLDS, validateCityScores } from "./methodologySpec.ts";
import { PILLAR_WEIGHTS } from "./types.ts";
import type { CityScores, CityTier, ScoringPillar } from "./types.ts";

export const SCORING_PILLARS: ScoringPillar[] = [
  "livability",
  "economy",
  "safety",
  "wellbeing",
  "environment",
  "hospitality",
  "digital",
];

export interface CompositeScoreTerm {
  pillar: ScoringPillar;
  score: number;
  weight: number;
  contribution: number;
}

/**
 * Rounds a score to one decimal place for presentation.
 * @param value Raw numeric score
 * @returns Rounded score (e.g. 74.56 -> 74.6)
 */
export function roundScore(value: number): number {
  const precision = 10 ** SCORE_DOMAIN.decimals;
  return Math.round(value * precision) / precision;
}

/**
 * Breaks down a city's scores into weighted terms for the composite calculation.
 * Each term represents the contribution of a single pillar to the final score.
 * @param scores Individual pillar scores (0-100)
 * @returns Array of score terms with weights and contributions
 */
export function buildCompositeScoreTerms(scores: CityScores): CompositeScoreTerm[] {
  validateCityScores(scores);

  return SCORING_PILLARS.map(pillar => ({
    pillar,
    score: scores[pillar],
    weight: PILLAR_WEIGHTS[pillar],
    contribution: (scores[pillar] * PILLAR_WEIGHTS[pillar]) / 100,
  }));
}

/**
 * Calculates the final composite score for a city based on weighted pillars.
 * Weighted Sum / Total Weight * 100
 * @param scores Individual pillar scores
 * @returns Final composite score (0-100)
 */
export function computeComposite(scores: CityScores): number {
  const terms = buildCompositeScoreTerms(scores);
  const weightedSum = terms.reduce((sum, term) => sum + term.score * term.weight, 0);
  const totalWeight = terms.reduce((sum, term) => sum + term.weight, 0);

  return roundScore(weightedSum / totalWeight);
}

/**
 * Assigns a city to a Performance Tier based on its composite score.
 * Alpha: ≥ 65 (Operational/Advanced)
 * Beta: 45-64 (Building/Emerging)
 * Gamma: < 45 (Planning/Foundation)
 * @param composite Final composite score
 * @returns Assigned tier
 */
export function assignTier(composite: number): CityTier {
  if (composite >= TIER_THRESHOLDS.alpha) return "alpha";
  if (composite >= TIER_THRESHOLDS.beta) return "beta";
  return "gamma";
}

/**
 * Converts a provincial road fatality rate (deaths per 100,000 population)
 * into a 0–100 safety sub-score using a linear scale anchored to:
 *   ≤ 5  → 100  (WHO Decade of Action target)
 *   20   →  57  (Thai national average, thairsc 2023–24)
 *   ≥ 40 →   0  (extreme danger zone)
 *
 * Source: thairsc.com provincial annual data + PMC/Nature academic validation
 * Weight in safety pillar: 30% (road safety) of the full safety score.
 * Remaining 70% reflects crime exposure (40%) and disaster resilience (30%).
 *
 * @param ratePerHundredK Annual road deaths per 100,000 population
 * @returns Road safety sub-score 0–100
 */
export function computeRoadSafetyScore(ratePerHundredK: number): number {
  return Math.max(0, Math.min(100, Math.round(100 * (40 - ratePerHundredK) / 35)));
}

/**
 * Blends the existing manual safety score (crime + resilience, 70 %) with
 * the data-driven road safety sub-score from thairsc (30 %).
 *
 * @param existingScore Current manually-assessed safety score (crime + resilience)
 * @param roadFatalityRate Annual road deaths per 100,000 population
 * @returns Blended safety score 0–100
 */
export function blendSafetyScore(existingScore: number, roadFatalityRate: number): number {
  return Math.round(0.7 * existingScore + 0.3 * computeRoadSafetyScore(roadFatalityRate));
}

/**
 * Blends the existing manual livability score (housing, infra, daily life — 75 %)
 * with the GISTDA flood-frequency factor (25 %). Phase 19 doctrine.
 *
 * Flood-prone provinces have a structural drag on livability that no amount
 * of urban infrastructure investment can fully erase — annual September
 * inundation in Nakhon Sawan or Dec-Jan flooding in Narathiwat shapes the
 * lived experience as much as housing stock or transit. The factor is
 * documented per-province in src/provincialFloodData.ts with a one-line
 * source note for every entry.
 *
 * @param existingLivability Hand-curated livability score
 * @param floodScore         0-100 from PROVINCIAL_FLOOD_SCORE (higher = less flood-prone)
 *                           If undefined, returns existingLivability unchanged.
 * @returns Blended livability score 0–100
 */
export function blendLivabilityScore(existingLivability: number, floodScore: number | undefined): number {
  if (floodScore == null) return existingLivability;
  return Math.round(0.75 * existingLivability + 0.25 * floodScore);
}

export function getCompositeBreakdown(scores: CityScores) {
  const terms = buildCompositeScoreTerms(scores);
  const totalWeight = terms.reduce((sum, term) => sum + term.weight, 0);
  const weightedSum = terms.reduce((sum, term) => sum + term.score * term.weight, 0);

  return {
    terms,
    totalWeight,
    weightedSum,
    composite: computeComposite(scores),
  };
}
