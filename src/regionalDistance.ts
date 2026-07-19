// ---------------------------------------------------------------------------
// Regional Distance — great-circle distance from every city to the three
// national hubs (Bangkok, Chiang Mai, Phuket). Pure geometry from the real
// coordinates already in cityCoordinates.ts — no external data, no research
// needed, cannot drift or go stale.
// ---------------------------------------------------------------------------

import { CITY_COORDINATES, type LatLng } from "./cityCoordinates.ts";

// Reference points for the three hubs a city is most likely to be judged
// against for market access / logistics. Coordinates are each hub's own
// entry in CITY_COORDINATES so this file never hardcodes a second copy.
const HUB_IDS = {
  bangkok: "samyan",
  chiangMai: "chiang-mai-old-town",
  phuket: "phuket",
} as const;

export type Hub = keyof typeof HUB_IDS;

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine great-circle distance in km between two lat/lng points. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h)));
}

export interface HubDistances {
  bangkokKm: number;
  chiangMaiKm: number;
  phuketKm: number;
  nearestHub: Hub;
  nearestHubKm: number;
}

/**
 * Distance from a city to each of the three national hubs. Returns
 * undefined if the city has no coordinate entry (should not happen — all
 * 118 cities carry coordinates — but the function must not throw on a
 * future gap).
 */
export function getHubDistances(cityId: string): HubDistances | undefined {
  const point = CITY_COORDINATES[cityId];
  if (!point) return undefined;

  const bangkokKm = cityId === HUB_IDS.bangkok ? 0 : haversineKm(point, CITY_COORDINATES[HUB_IDS.bangkok]);
  const chiangMaiKm = cityId === HUB_IDS.chiangMai ? 0 : haversineKm(point, CITY_COORDINATES[HUB_IDS.chiangMai]);
  const phuketKm = cityId === HUB_IDS.phuket ? 0 : haversineKm(point, CITY_COORDINATES[HUB_IDS.phuket]);

  const entries: [Hub, number][] = [
    ["bangkok", bangkokKm],
    ["chiangMai", chiangMaiKm],
    ["phuket", phuketKm],
  ];
  const [nearestHub, nearestHubKm] = entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min));

  return { bangkokKm, chiangMaiKm, phuketKm, nearestHub, nearestHubKm };
}

/**
 * 0-100 market-access score from nearest-hub distance. Calibrated so that
 * being IN a hub (0km) scores 100, ~100km (a comfortable day-trip radius)
 * scores ~80, ~400km (a short domestic flight) scores ~40, and 700km+
 * (the practical diagonal of Thailand) floors at 5 — never zero, since
 * every city has some access via the domestic flight network.
 */
export function marketAccessScore(nearestHubKm: number): number {
  const score = 100 * Math.exp(-nearestHubKm / 220);
  return Math.max(5, Math.round(score));
}
