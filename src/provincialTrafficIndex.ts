// ---------------------------------------------------------------------------
// Provincial Traffic Congestion — TomTom Traffic Index
// ---------------------------------------------------------------------------
// TomTom publishes city-level congestion data for only 5 Thai cities. All other
// provinces are correctly absent (a DLT vehicle-registration fallback was
// attempted and rejected — the source files could not be parsed reliably enough
// to cite without risking a misread column, so the smaller verified dataset was
// kept instead of a larger uncertain one).
// Source: TomTom Traffic Index 2025 (tomtom.com/traffic-index), verified July 2026.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp";

export interface TrafficEntry {
  congestionLevelPct: number;
  hoursLostPerYear: number;
  source: string;
  sourceUrl?: string;
  asOf: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_TRAFFIC: Record<string, TrafficEntry> = {
  "Bangkok": {
    congestionLevelPct: 67.9,
    hoursLostPerYear: 115,
    source: "TomTom Traffic Index",
    sourceUrl: "https://www.tomtom.com/traffic-index/city/bangkok/",
    asOf: "2025",
  },
  "Chiang Mai": {
    congestionLevelPct: 48.7,
    hoursLostPerYear: 89,
    source: "TomTom Traffic Index",
    sourceUrl: "https://www.tomtom.com/traffic-index/city/chiang-mai",
    asOf: "2025",
  },
  "Khon Kaen": {
    congestionLevelPct: 44.8,
    hoursLostPerYear: 81,
    source: "TomTom Traffic Index",
    sourceUrl: "https://www.tomtom.com/traffic-index/country/thailand",
    asOf: "2025",
  },
  "Nakhon Ratchasima": {
    congestionLevelPct: 41.4,
    hoursLostPerYear: 80,
    source: "TomTom Traffic Index",
    sourceUrl: "https://www.tomtom.com/traffic-index/country/thailand",
    asOf: "2025",
  },
  "Songkhla": {
    congestionLevelPct: 55.2,
    hoursLostPerYear: 94,
    source: "TomTom Traffic Index",
    sourceUrl: "https://www.tomtom.com/traffic-index/country/thailand",
    asOf: "2025",
  },
};

export interface TrafficSignal {
  label: LocalizedText;
  value: string;
  /** 0-100, higher = calmer (less congested). */
  score: number;
}

const CONGESTION_LABEL: LocalizedText = {
  en: "Traffic congestion (TomTom)",
  th: "ความหนาแน่นการจราจร (TomTom)",
  zh: "交通拥堵指数（TomTom）",
};

export function getTrafficSignal(province: string): TrafficSignal | undefined {
  const e = PROVINCIAL_TRAFFIC[province];
  if (!e) return undefined;
  const score = Math.max(0, 100 - e.congestionLevelPct);
  return {
    label: CONGESTION_LABEL,
    value: `${e.congestionLevelPct}% congestion, ${e.hoursLostPerYear} hrs/yr lost`,
    score,
  };
}
