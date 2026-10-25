import type { CityScores, ScoringPillar } from "./types";
import { SCORING_PILLARS } from "./scoring";

export type PreferenceGrade = "A" | "B" | "C";
export type CityPreferences = Record<ScoringPillar, PreferenceGrade>;

/** A priority-weighted research score, never a probability of personal fit.
 * C contributes no weight. With no stated preferences, use the published
 * composite supplied by the caller rather than inventing a perfect match. */
export function computePreferenceScore(scores: CityScores, preferences: CityPreferences, composite: number): number {
  let weighted = 0;
  let denominator = 0;
  for (const pillar of SCORING_PILLARS) {
    const weight = preferences[pillar] === "A" ? 3 : preferences[pillar] === "B" ? 2 : 0;
    weighted += scores[pillar] * weight;
    denominator += weight;
  }
  return denominator === 0 ? composite : weighted / denominator;
}
