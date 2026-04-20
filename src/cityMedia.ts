import type { SmartCity } from "./types";

export type CityPhotoAsset = {
  src: string;
  objectPosition?: string;
};

export const HOME_HERO_ASSET: CityPhotoAsset = {
  src: "/photos/report-city-night.jpg",
  objectPosition: "center 48%",
};

// Regional fallbacks — only used for cities without explicit mapping below.
// Kept diverse so no two cities in the same region share the same photo
// unless they actually share a geographic identity.
const REGION_FALLBACKS: Record<SmartCity["region"], CityPhotoAsset> = {
  bangkok: { src: "/photos/report-city-night.jpg", objectPosition: "center center" },
  central: { src: "/photos/wp-nakhonsawan.jpg", objectPosition: "center 50%" },
  east: { src: "/photos/wp-chanthaburi.jpg", objectPosition: "center 50%" },
  north: { src: "/photos/chiangmai-night.jpg", objectPosition: "center center" },
  northeast: { src: "/photos/khonkaen-aerial.jpg", objectPosition: "center center" },
  south: { src: "/photos/wp-songkhla.jpg", objectPosition: "center 50%" },
};

const CITY_PHOTO_ASSETS: Record<string, CityPhotoAsset> = {
  // ─── Explicit per-city photos (existing) ───
  "chiang-mai-old-town": { src: "/photos/chiangmai-night.jpg", objectPosition: "center 58%" },
  "cmu-smart-city": { src: "/photos/cmu-smart-city.jpg", objectPosition: "center 40%" },
  "khon-kaen": { src: "/photos/khonkaen-smart-city.jpg", objectPosition: "center 50%" },
  "samyan": { src: "/photos/samyan-smart-city.jpg", objectPosition: "center 45%" },
  "phra-ram-4": { src: "/photos/samyan-smart-city.jpg", objectPosition: "center 45%" },
  "phuket": { src: "/photos/phuket-smart-city.jpg", objectPosition: "center 48%" },

  // ─── New Wikimedia Commons photos (CC BY-SA) ───
  // North
  "chiang-rai": { src: "/photos/wp-chiang-rai.jpg", objectPosition: "center 45%" },
  "lampang": { src: "/photos/wp-lampang.jpg", objectPosition: "center 45%" },
  "nan": { src: "/photos/wp-nan.jpg", objectPosition: "center 50%" },
  "phitsanulok-muni": { src: "/photos/wp-phitsanulok.jpg", objectPosition: "center 50%" },
  "phitsanulok-nu": { src: "/photos/wp-phitsanulok.jpg", objectPosition: "center 50%" },
  "phitsanulok-ppao": { src: "/photos/wp-phitsanulok.jpg", objectPosition: "center 50%" },

  // Northeast
  "korat": { src: "/photos/wp-korat.jpg", objectPosition: "center 45%" },
  "ubon": { src: "/photos/wp-ubon.jpg", objectPosition: "center 50%" },
  "ubon-muni": { src: "/photos/wp-ubon.jpg", objectPosition: "center 50%" },

  // Central
  "nakhonsawan": { src: "/photos/wp-nakhonsawan.jpg", objectPosition: "center 50%" },

  // East
  "rayong": { src: "/photos/wp-rayong.jpg", objectPosition: "center 50%" },
  "saensuk": { src: "/photos/wp-saensuk.jpg", objectPosition: "center 50%" },
  "bang-saray": { src: "/photos/wp-saensuk.jpg", objectPosition: "center 50%" },
  "chachoengsao": { src: "/photos/wp-chachoengsao.jpg", objectPosition: "center 45%" },
  "chanthaburi": { src: "/photos/wp-chanthaburi.jpg", objectPosition: "center 45%" },

  // Bangkok
  "rattanakosin": { src: "/photos/wp-rattanakosin.jpg", objectPosition: "center 55%" },
  "klong-phadung": { src: "/photos/wp-klong-phadung.jpg", objectPosition: "center 50%" },
  "makkasan": { src: "/photos/wp-makkasan.jpg", objectPosition: "center 50%" },

  // Central / metro
  "nonthaburi": { src: "/photos/wp-nonthaburi.jpg", objectPosition: "center 50%" },
  "samut-prakan": { src: "/photos/wp-samut-prakan.jpg", objectPosition: "center 50%" },

  // North (additional)
  "maesai": { src: "/photos/wp-maesai.jpg", objectPosition: "center 50%" },
  "umong": { src: "/photos/wp-umong.jpg", objectPosition: "center 50%" },
  "tak": { src: "/photos/wp-tak.jpg", objectPosition: "center 50%" },
  "phichit": { src: "/photos/wp-phichit.jpg", objectPosition: "center 50%" },
  "mae-moh": { src: "/photos/wp-lampang.jpg", objectPosition: "center 50%" },

  // East — tiny/obscure smart zones use nearest regional photo
  "nikhom-phatthana": { src: "/photos/wp-rayong.jpg", objectPosition: "center 50%" },
  "wangchan-valley": { src: "/photos/wp-rayong.jpg", objectPosition: "center 50%" },
  "phlapphla": { src: "/photos/wp-chanthaburi.jpg", objectPosition: "center 50%" },
  "thep-paraj": { src: "/photos/wp-chachoengsao.jpg", objectPosition: "center 50%" },

  // South — tiny/obscure smart zones
  "phuket-tinicon": { src: "/photos/wp-phangnga.jpg", objectPosition: "center 50%" },
  "tai-yong": { src: "/photos/wp-sritrang.jpg", objectPosition: "center 50%" },
  "khao-khun-song": { src: "/photos/wp-satun.jpg", objectPosition: "center 50%" },

  // South
  "krabi": { src: "/photos/wp-krabi.jpg", objectPosition: "center 45%" },
  "phangnga": { src: "/photos/wp-phangnga.jpg", objectPosition: "center 50%" },
  "satun": { src: "/photos/wp-satun.jpg", objectPosition: "center 50%" },
  "samui": { src: "/photos/wp-samui.jpg", objectPosition: "center 50%" },
  "sritrang": { src: "/photos/wp-sritrang.jpg", objectPosition: "center 50%" },
  "songkhla-city": { src: "/photos/wp-songkhla.jpg", objectPosition: "center 50%" },
  "hat-yai": { src: "/photos/wp-hat-yai.jpg", objectPosition: "center 50%" },
  "yala": { src: "/photos/wp-yala.jpg", objectPosition: "center 50%" },
  "pattani": { src: "/photos/wp-pattani.jpg", objectPosition: "center 45%" },
  "narathiwat": { src: "/photos/wp-narathiwat.jpg", objectPosition: "center 50%" },
  "nakhon-si-thammarat": { src: "/photos/wp-nakhon-si-thammarat.jpg", objectPosition: "center 50%" },
};

export function getCityPhotoAsset(city: Pick<SmartCity, "id" | "region">): CityPhotoAsset {
  return CITY_PHOTO_ASSETS[city.id] ?? REGION_FALLBACKS[city.region];
}
