// ---------------------------------------------------------------------------
// Provincial Access Data — healthcare facilities + education access
// ---------------------------------------------------------------------------
// Hospital COUNT (distinct from hospitalBedsPer10k, already tracked per-city)
// is sourced from the Ministry of Public Health's provincial facility
// registry. University + international-school counts are sourced from the
// Ministry of Higher Education and international-school directories.
//
// STATUS: awaiting verified data from the ladder-research workflow.
// ---------------------------------------------------------------------------

export interface AccessEntry {
  hospitalsPerProvince?: number;
  universities?: number;
  internationalSchools?: number;
  source: string;
  sourceUrl?: string;
  asOf: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_ACCESS: Record<string, AccessEntry> = {
  // Populated from verified research — see tasks/todo.md "Needs Ladder" section.
};

export function getAccessSignal(province: string): AccessEntry | undefined {
  return PROVINCIAL_ACCESS[province];
}
