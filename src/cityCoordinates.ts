// ---------------------------------------------------------------------------
// City Coordinates — for the Rankings map view (GISTDA layer overlay)
// ---------------------------------------------------------------------------
// All 49 certified + promotion-zone cities, plus registered cities, pull from their inline lat/lng.
// Coordinates are the recognizable city centre (municipality hall or
// university campus where applicable), not provincial capital fallbacks.
// ---------------------------------------------------------------------------

export interface LatLng {
  lat: number;
  lng: number;
}

export const CITY_COORDINATES: Record<string, LatLng> = {
  // ─── BATCH 1 (2021) ───
  "chiang-mai-old-town": { lat: 18.7883, lng: 98.9853 },
  "cmu-smart-city": { lat: 18.7967, lng: 98.9509 },
  "mae-moh": { lat: 18.3024, lng: 99.7128 },
  "nakhonsawan": { lat: 15.7050, lng: 100.1377 },
  "khon-kaen": { lat: 16.4419, lng: 102.8360 },
  "samyan": { lat: 13.7339, lng: 100.5300 },
  "phra-ram-4": { lat: 13.7220, lng: 100.5435 },
  "klong-phadung": { lat: 13.7611, lng: 100.5111 },
  "makkasan": { lat: 13.7522, lng: 100.5621 },
  "chachoengsao": { lat: 13.6904, lng: 101.0779 },
  "saensuk": { lat: 13.2867, lng: 100.9220 },
  "wangchan-valley": { lat: 12.9817, lng: 101.5497 },
  "phuket": { lat: 7.8804, lng: 98.3923 },
  "sritrang": { lat: 7.5563, lng: 99.6114 },
  "yala": { lat: 6.5410, lng: 101.2812 },

  // ─── BATCH 2 (2022) ───
  "rayong": { lat: 12.6803, lng: 101.2575 },
  "khao-khun-song": { lat: 12.8456, lng: 101.4128 },
  "phitsanulok-muni": { lat: 16.8211, lng: 100.2659 },
  "phitsanulok-nu": { lat: 16.7457, lng: 100.1936 },
  "chiang-rai": { lat: 19.9094, lng: 99.8278 },
  "nan": { lat: 18.7868, lng: 100.7800 },
  "korat": { lat: 14.9799, lng: 102.0978 },
  "ubon": { lat: 15.2400, lng: 104.8470 },
  "krabi": { lat: 8.0863, lng: 98.9063 },
  "phangnga": { lat: 8.4504, lng: 98.5253 },
  "satun": { lat: 6.6244, lng: 100.0673 },
  "samui": { lat: 9.5018, lng: 99.9650 },
  "hat-yai": { lat: 7.0086, lng: 100.4747 },
  "pattani": { lat: 6.8692, lng: 101.2502 },
  "narathiwat": { lat: 6.4254, lng: 101.8253 },

  // ─── BATCH 3 (2023) ───
  "lampang": { lat: 18.2783, lng: 99.4906 },
  "samut-prakan": { lat: 13.5990, lng: 100.5998 },
  "thep-paraj": { lat: 13.6500, lng: 101.0500 },
  "nikhom-phatthana": { lat: 12.8333, lng: 101.3500 },
  "nakhon-si-thammarat": { lat: 8.4304, lng: 99.9633 },
  "tai-yong": { lat: 8.4500, lng: 99.9700 },

  // ─── BATCH 4 (2025) ───
  "phuket-tinicon": { lat: 7.9203, lng: 98.3625 },

  // ─── ADDITIONAL CERTIFIED ───
  "songkhla-city": { lat: 7.1995, lng: 100.5953 },
  "rattanakosin": { lat: 13.7544, lng: 100.4974 },
  "nonthaburi": { lat: 13.8590, lng: 100.5141 },
  "chanthaburi": { lat: 12.6113, lng: 102.1035 },
  "tak": { lat: 16.8839, lng: 99.1258 },
  "phichit": { lat: 16.4429, lng: 100.3487 },
  "umong": { lat: 18.5778, lng: 99.0153 },
  "maesai": { lat: 20.4283, lng: 99.8806 },
  "bang-saray": { lat: 12.7596, lng: 100.9217 },
  "phitsanulok-ppao": { lat: 16.8200, lng: 100.2700 },
  "ubon-muni": { lat: 15.2287, lng: 104.8568 },
  "phlapphla": { lat: 12.5867, lng: 102.0950 },
};

/**
 * Returns lat/lng for a city. For registered cities (prefixed "reg-"),
 * the coordinates are stored inline in registeredCityData.ts and are
 * passed in separately — this lookup covers only certified cities.
 *
 * Returns null if the city has no recorded coordinates.
 */
export function getCityCoords(id: string): LatLng | null {
  return CITY_COORDINATES[id] ?? null;
}
