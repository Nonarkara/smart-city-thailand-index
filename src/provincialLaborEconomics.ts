// ---------------------------------------------------------------------------
// Provincial Labor Economics — minimum wage + cost-of-living signal
// ---------------------------------------------------------------------------
// Minimum wage is set per province annually by the National Wage Committee
// (Ministry of Labour) — a real, government-published daily baht rate.
// Cost-of-living index is sourced from NSO provincial CPI or, where NSO
// coverage is thin, Numbeo's verified Thailand city cost-of-living data.
//
// STATUS: awaiting verified data from the ladder-research workflow.
// ---------------------------------------------------------------------------

export interface LaborEconomicsEntry {
  minWageBaht?: number;
  /** 0-100, higher = MORE affordable (inverted from a raw CPI so it slots
   *  directly into the ladder's "higher score is better" convention). */
  costOfLivingIndex?: number;
  source: string;
  sourceUrl?: string;
  asOf: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_LABOR_ECONOMICS: Record<string, LaborEconomicsEntry> = {
  // Populated from verified research — see tasks/todo.md "Needs Ladder" section.
};

export function getLaborEconomics(province: string): LaborEconomicsEntry | undefined {
  return PROVINCIAL_LABOR_ECONOMICS[province];
}
