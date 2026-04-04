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
  return Math.round(value * 10) / 10;
}

/**
 * Breaks down a city's scores into weighted terms for the composite calculation.
 * Each term represents the contribution of a single pillar to the final score.
 * @param scores Individual pillar scores (0-100)
 * @returns Array of score terms with weights and contributions
 */
export function buildCompositeScoreTerms(scores: CityScores): CompositeScoreTerm[] {
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
  const weightedSum = terms.reduce((sum, term) => sum + term.contribution, 0);
  const totalWeight = terms.reduce((sum, term) => sum + term.weight, 0);

  return roundScore(weightedSum / (totalWeight / 100));
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
  if (composite >= 65) return "alpha";
  if (composite >= 45) return "beta";
  return "gamma";
}

export function getCompositeBreakdown(scores: CityScores) {
  const terms = buildCompositeScoreTerms(scores);
  const totalWeight = terms.reduce((sum, term) => sum + term.weight, 0);

  return {
    terms,
    totalWeight,
    composite: computeComposite(scores),
  };
}
