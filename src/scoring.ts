import { PILLAR_WEIGHTS } from "./types";
import type { CityScores, CityTier, ScoringPillar } from "./types";

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

export function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

export function buildCompositeScoreTerms(scores: CityScores): CompositeScoreTerm[] {
  return SCORING_PILLARS.map(pillar => ({
    pillar,
    score: scores[pillar],
    weight: PILLAR_WEIGHTS[pillar],
    contribution: (scores[pillar] * PILLAR_WEIGHTS[pillar]) / 100,
  }));
}

export function computeComposite(scores: CityScores): number {
  const terms = buildCompositeScoreTerms(scores);
  const weightedSum = terms.reduce((sum, term) => sum + term.contribution, 0);
  const totalWeight = terms.reduce((sum, term) => sum + term.weight, 0);

  return roundScore(weightedSum / (totalWeight / 100));
}

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

