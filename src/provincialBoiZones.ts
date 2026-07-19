// ---------------------------------------------------------------------------
// BOI Investment Promotion Zones — by province
// ---------------------------------------------------------------------------
// Thailand's Board of Investment classifies provinces into Zone 1 (Bangkok +
// 5 surrounding — lightest incentives), Zone 2, and Zone 3 (least-developed
// provinces — deepest tax holidays, up to 8-year CIT exemption), plus overlay
// special zones: EEC (Eastern Economic Corridor) and the Southern Border
// Economic Zone. A province's zone is a real, government-published fact that
// directly answers "employment, labor, land, tax benefits from BOI."
//
// STATUS: awaiting verified data from the ladder-research workflow. Every
// entry below must carry a real BOI source before being added — this file
// intentionally ships near-empty rather than guess.
// ---------------------------------------------------------------------------

export type BoiZoneTier = 1 | 2 | 3;
export type BoiSpecialZone = "EEC" | "southern-border-sez" | null;

export interface BoiZoneEntry {
  zone: BoiZoneTier;
  specialZone: BoiSpecialZone;
  source: string;
  sourceUrl?: string;
  asOf: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_BOI_ZONES: Record<string, BoiZoneEntry> = {
  // Populated from verified research — see tasks/todo.md "Needs Ladder" section.
};

export interface BoiZoneSignal {
  label: string;
  /** 0-100 — Zone 3 + special zones score highest (deepest incentives = most investable). */
  score: number;
}

const ZONE_SCORE: Record<BoiZoneTier, number> = { 1: 35, 2: 65, 3: 90 };

export function getBoiZone(province: string): BoiZoneSignal | undefined {
  const entry = PROVINCIAL_BOI_ZONES[province];
  if (!entry) return undefined;
  const tag = entry.specialZone === "EEC" ? " + EEC" : entry.specialZone === "southern-border-sez" ? " + Border SEZ" : "";
  return {
    label: `BOI Zone ${entry.zone}${tag}`,
    score: Math.min(100, ZONE_SCORE[entry.zone] + (entry.specialZone ? 10 : 0)),
  };
}
