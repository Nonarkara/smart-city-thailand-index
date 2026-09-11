import { SCORING_PILLARS } from "./scoring";
import type { ScoringPillar } from "./types";

/** Directory sort axis: composite (lens score) or one published pillar. */
export type RankingsAxis = ScoringPillar | "composite";

export function parseRankingsAxis(search: string): RankingsAxis {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const value = params.get("pillar");
  if (value && (SCORING_PILLARS as readonly string[]).includes(value)) {
    return value as ScoringPillar;
  }
  return "composite";
}

export function rankingsHref(axis: RankingsAxis = "composite"): string {
  return axis === "composite" ? "/rankings" : `/rankings?pillar=${axis}`;
}
