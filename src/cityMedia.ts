import type { SmartCity } from "./types";

// ---------------------------------------------------------------------------
// Photo sourcing status (Phase 16 — 2026-04-24)
// ---------------------------------------------------------------------------
// REAL city photos (authored / curated, not stock) live in capitalised folders
// under public/:
//   - public/Nakhon Si Thammarat/  — 9 NST shots (Phase 16 hero Z03A4010)
//   - public/CMU Smart City/       — P1210289 (campus)
//   - public/Chiang Mai/           — IMG_20251218_190749854 (night skyline)
//   - public/Khon Kaen/            — IMG_4264 (aerial LRT corridor)
//
// Every other city still references either:
//   - public/photos/wp-*.jpg       — Wikimedia Commons CC BY-SA (legitimate)
//   - public/photos/*-smart-city.jpg, *-night.jpg, *-aerial.jpg
//     (founder placeholder snaps; acceptable until replaced)
//
// TODO (photo sourcing backlog) — cities that still lean on wp-*.jpg and
// should get a dedicated folder + real photo when available:
//   bangkok, chiang-rai, lampang, nan, phitsanulok-*, korat, ubon,
//   nakhonsawan, rayong, saensuk, bang-saray, chachoengsao, chanthaburi,
//   rattanakosin, klong-phadung, makkasan, nonthaburi, samut-prakan,
//   maesai, umong, tak, phichit, mae-moh, samui, krabi, phangnga, satun,
//   sritrang, songkhla-city, hat-yai, yala, pattani, narathiwat,
//   phuket-tinicon, tai-yong, khao-khun-song, samyan, phra-ram-4, phuket.
//
// NST .webp siblings still to be generated (cwebp -q 82) — the <picture>
// source will 404-fall-through to the JPG until then. See ResponsiveImage.
// ---------------------------------------------------------------------------

export type CityPhotoAsset = {
  src: string;
  objectPosition?: string;
};

/** Encode a path segment containing spaces so browsers get %20, not raw " ". */
function enc(path: string): string {
  return encodeURI(path);
}

// Phase 13 — Wikimedia Commons, Bangkok night expressway above Makkasan.
// Chosen over the founder's own photo because SCITI's subject is urban
// infrastructure (rail, roads, grids), not tourism theatre. Attribution is
// tracked in src/photoCredits.ts under the same filename.
export const HOME_HERO_ASSET: CityPhotoAsset = {
  src: "/photos/wp-makkasan.jpg",
  objectPosition: "center 55%",
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
  // ─── Real, authored city photos in capitalised folders (Phase 16) ───
  "chiang-mai-old-town": { src: enc("/Chiang Mai/IMG_20251218_190749854.jpg"), objectPosition: "center 58%" },
  "cmu-smart-city": { src: enc("/CMU Smart City/P1210289.JPG"), objectPosition: "center 45%" },
  "khon-kaen": { src: enc("/Khon Kaen/IMG_4264.JPG"), objectPosition: "center 50%" },
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
  "nakhon-si-thammarat": { src: enc("/Nakhon Si Thammarat/Z03A4010-3946608958.jpg"), objectPosition: "center 50%" },
};

export function getCityPhotoAsset(city: Pick<SmartCity, "id" | "region">): CityPhotoAsset {
  return CITY_PHOTO_ASSETS[city.id] ?? REGION_FALLBACKS[city.region];
}
