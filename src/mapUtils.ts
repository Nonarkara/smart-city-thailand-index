// ---------------------------------------------------------------------------
// Shared map utilities — coordinates, projection, ESRI tiles
// ---------------------------------------------------------------------------
import type { CityTier } from "./types";

// Thailand + neighbors bounding box (wider view)
export const MAP_BOUNDS = { minLat: 4.0, maxLat: 22.0, minLng: 92.0, maxLng: 110.0 };

// Thailand-only bounding box (tight view for MapDashboardPage)
export const THAILAND_BOUNDS = { minLat: 5.4, maxLat: 20.6, minLng: 97.2, maxLng: 105.8 };

export function projectTo(
  lat: number, lng: number,
  bounds: typeof MAP_BOUNDS, width: number, height: number, pad = 20,
) {
  return {
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - pad * 2) + pad,
    y: ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - pad * 2) + pad,
  };
}

export function esriTileUrl(
  bounds: typeof MAP_BOUNDS, width: number, height: number,
  layer: "light" | "satellite" | "topo" = "light",
) {
  const services: Record<string, string> = {
    light: "Canvas/World_Light_Gray_Base",
    satellite: "World_Imagery",
    topo: "World_Topo_Map",
  };
  return `https://server.arcgisonline.com/ArcGIS/rest/services/${services[layer]}/MapServer/export?bbox=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}&bboxSR=4326&size=${width},${height}&f=image&format=png`;
}

export function tierColor(tier: CityTier) {
  return tier === "alpha" ? "var(--alpha, #1A8A72)" : tier === "beta" ? "var(--beta, #9A7A1A)" : "var(--gamma, #B03030)";
}

// All 49 city coordinates [lat, lng]
export const CITY_COORDS: Record<string, [number, number]> = {
  "chiang-mai-old-town": [18.79, 98.98], "cmu-smart-city": [18.80, 98.95],
  "mae-moh": [18.31, 99.72], "nakhonsawan": [15.70, 100.12],
  "khon-kaen": [16.43, 102.83], "samyan": [13.73, 100.53],
  "phra-ram-4": [13.72, 100.54], "klong-phadung": [13.75, 100.50],
  "makkasan": [13.75, 100.56], "chachoengsao": [13.69, 101.07],
  "saensuk": [13.28, 100.92], "wangchan-valley": [12.88, 101.20],
  "phuket": [7.88, 98.39], "sritrang": [7.56, 99.61],
  "yala": [6.54, 101.28], "rayong": [12.68, 101.27],
  "khao-khun-song": [12.75, 101.30], "phitsanulok-muni": [16.82, 100.26],
  "phitsanulok-nu": [16.74, 100.20], "chiang-rai": [19.91, 99.83],
  "nan": [18.78, 100.77], "korat": [14.97, 102.10],
  "ubon": [15.25, 104.85], "krabi": [8.09, 98.91],
  "phangnga": [8.45, 98.52], "satun": [6.62, 100.07],
  "samui": [9.51, 100.06], "hat-yai": [7.00, 100.47],
  "pattani": [6.87, 101.25], "narathiwat": [6.43, 101.82],
  "lampang": [18.29, 99.49], "samut-prakan": [13.60, 100.60],
  "thep-paraj": [13.65, 101.10], "nikhom-phatthana": [12.75, 101.15],
  "nakhon-si-thammarat": [8.43, 99.96], "tai-yong": [8.40, 99.90],
  "phuket-tinicon": [7.85, 98.35], "songkhla-city": [7.19, 100.59],
  "rattanakosin": [13.76, 100.49], "nonthaburi": [13.86, 100.51],
  "chanthaburi": [12.61, 102.10], "tak": [16.88, 99.13],
  "phichit": [16.44, 100.35], "umong": [18.57, 98.98],
  "maesai": [20.43, 99.88], "bang-saray": [12.78, 100.92],
  "phitsanulok-ppao": [16.80, 100.28], "ubon-muni": [15.23, 104.87],
  "phlapphla": [12.58, 102.12],
};

// Neighboring country label positions [lat, lng]
export const NEIGHBOR_LABELS: { name: string; lat: number; lng: number }[] = [
  { name: "Myanmar", lat: 19.5, lng: 96.0 },
  { name: "Laos", lat: 18.5, lng: 103.5 },
  { name: "Cambodia", lat: 12.5, lng: 105.5 },
  { name: "Malaysia", lat: 5.0, lng: 102.5 },
  { name: "Vietnam", lat: 16.0, lng: 108.0 },
];
