// ---------------------------------------------------------------------------
// Provincial Traffic / Commute-Stress Signal
// ---------------------------------------------------------------------------
// Real congestion data (TomTom Traffic Index) only exists for a handful of
// major Thai cities. Where it doesn't, the DLT (Department of Land Transport)
// publishes registered-vehicles-per-capita by province, a legitimate real
// proxy for commute pressure that we label distinctly from a direct index.
//
// STATUS: awaiting verified data from the ladder-research workflow.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp.ts";

export type TrafficMetricKind = "congestion-index" | "vehicle-density-proxy";

export interface TrafficEntry {
  kind: TrafficMetricKind;
  /** For congestion-index: raw index value. For vehicle-density-proxy: vehicles per 1,000 residents. */
  rawValue: number;
  /** 0-100, higher = calmer (less traffic stress) — already inverted for the ladder. */
  score: number;
  source: string;
  sourceUrl?: string;
  asOf: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_TRAFFIC: Record<string, TrafficEntry> = {
  // Populated from verified research — see tasks/todo.md "Needs Ladder" section.
};

export interface TrafficSignal {
  label: LocalizedText;
  value: string;
  score: number;
}

const CONGESTION_LABEL: LocalizedText = { en: "Traffic congestion index", th: "ดัชนีความหนาแน่นการจราจร", zh: "交通拥堵指数" };
const DENSITY_LABEL: LocalizedText = { en: "Vehicle density (proxy)", th: "ความหนาแน่นยานพาหนะ (ตัวแทน)", zh: "车辆密度（替代指标）" };

export function getTrafficSignal(province: string): TrafficSignal | undefined {
  const entry = PROVINCIAL_TRAFFIC[province];
  if (!entry) return undefined;
  const label = entry.kind === "congestion-index" ? CONGESTION_LABEL : DENSITY_LABEL;
  const value = entry.kind === "congestion-index" ? `${entry.rawValue}` : `${entry.rawValue}/1,000 residents`;
  return { label, value, score: entry.score };
}
