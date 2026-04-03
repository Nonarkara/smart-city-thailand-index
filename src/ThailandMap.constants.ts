/** Thailand bounding box */
export const BOUNDS = { minLat: 5.4, maxLat: 20.6, minLng: 97.2, maxLng: 105.8 };

/** Default map dimensions (for SVG viewBox) */
export const MAP_W = 480;
export const MAP_H = 640;

/** Projection logic to convert GPS coords to SVG pixels */
export function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * (MAP_W - 40) + 20;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * (MAP_H - 40) + 20;
  return { x, y };
}

/** City coordinates database for smart cities on the map */
export const cityCoords: Record<string, { lat: number; lng: number }> = {
  "chiang-mai-old-town": { lat: 18.79, lng: 98.98 },
  "cmu-smart-city": { lat: 18.80, lng: 98.95 },
  "mae-moh": { lat: 18.31, lng: 99.72 },
  "nakhonsawan": { lat: 15.70, lng: 100.12 },
  "khon-kaen": { lat: 16.43, lng: 102.83 },
  "samyan": { lat: 13.73, lng: 100.53 },
  "phra-ram-4": { lat: 13.72, lng: 100.54 },
  "klong-phadung": { lat: 13.75, lng: 100.50 },
  "makkasan": { lat: 13.75, lng: 100.56 },
  "chachoengsao": { lat: 13.69, lng: 101.07 },
  "saensuk": { lat: 13.28, lng: 100.92 },
  "wangchan-valley": { lat: 12.88, lng: 101.20 },
  "phuket": { lat: 7.88, lng: 98.39 },
  "sritrang": { lat: 7.56, lng: 99.61 },
  "yala": { lat: 6.54, lng: 101.28 },
  "rayong": { lat: 12.68, lng: 101.27 },
  "khao-khun-song": { lat: 12.75, lng: 101.30 },
  "phitsanulok-muni": { lat: 16.82, lng: 100.26 },
  "phitsanulok-nu": { lat: 16.74, lng: 100.20 },
  "chiang-rai": { lat: 19.91, lng: 99.83 },
  "nan": { lat: 18.78, lng: 100.77 },
  "korat": { lat: 14.97, lng: 102.10 },
  "ubon": { lat: 15.25, lng: 104.85 },
  "krabi": { lat: 8.09, lng: 98.91 },
  "phangnga": { lat: 8.45, lng: 98.52 },
  "satun": { lat: 6.62, lng: 100.07 },
  "samui": { lat: 9.51, lng: 100.06 },
  "hat-yai": { lat: 7.00, lng: 100.47 },
  "pattani": { lat: 6.87, lng: 101.25 },
  "narathiwat": { lat: 6.43, lng: 101.82 },
  "lampang": { lat: 18.29, lng: 99.49 },
  "samut-prakan": { lat: 13.60, lng: 100.60 },
  "thep-paraj": { lat: 13.65, lng: 101.10 },
  "nikhom-phatthana": { lat: 12.75, lng: 101.15 },
  "nakhon-si-thammarat": { lat: 8.43, lng: 99.96 },
  "tai-yong": { lat: 8.40, lng: 99.90 },
  "phuket-tinicon": { lat: 7.85, lng: 98.35 },
  "songkhla-city": { lat: 7.19, lng: 100.59 },
  "rattanakosin": { lat: 13.76, lng: 100.49 },
  "nonthaburi": { lat: 13.86, lng: 100.51 },
  "chanthaburi": { lat: 12.61, lng: 102.10 },
  "tak": { lat: 16.88, lng: 99.13 },
  "phichit": { lat: 16.44, lng: 100.35 },
  "umong": { lat: 18.57, lng: 98.98 },
  "maesai": { lat: 20.43, lng: 99.88 },
  "bang-saray": { lat: 12.78, lng: 100.92 },
  "phitsanulok-ppao": { lat: 16.80, lng: 100.28 },
  "ubon-muni": { lat: 15.23, lng: 104.87 },
  "phlapphla": { lat: 12.58, lng: 102.12 },
};
