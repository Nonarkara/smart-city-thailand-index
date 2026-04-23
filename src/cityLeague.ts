// ---------------------------------------------------------------------------
// City league — taxonomy layer on top of SmartCity
// ---------------------------------------------------------------------------
// Answers the reviewer's question: "is this a province, a municipality, or
// a campus?" CMU Smart City (45K, university) and Phuket (418K, whole
// province) are not comparable by composite — the league badge tells the
// reader which ruler to use.
//
// Populated manually. A city only appears here if the classification is
// unambiguous. Uncertain cities are omitted — the UI simply hides the badge.
// ---------------------------------------------------------------------------

import type { CityLeague } from "./types";

export const CITY_LEAGUES: Record<string, CityLeague> = {
  // ─── Province (whole-province smart-city coverage) ───
  "chachoengsao": "province",
  "chanthaburi": "province",
  "chiang-rai": "province",
  "khon-kaen": "province",
  "krabi": "province",
  "lampang": "province",
  "nakhon-si-thammarat": "province",
  "nakhonsawan": "province",
  "nan": "province",
  "narathiwat": "province",
  "nonthaburi": "province",
  "pattani": "province",
  "phangnga": "province",
  "phichit": "province",
  "phitsanulok-ppao": "province", // Provincial Administration Organization — province-wide
  "phuket": "province",
  "rayong": "province",
  "samut-prakan": "province",
  "satun": "province",
  "tak": "province",
  "ubon": "province",
  "yala": "province",

  // ─── Municipality (เทศบาลนคร / เทศบาลเมือง) ───
  "hat-yai": "municipality",
  "korat": "municipality", // Nakhon Ratchasima City Municipality
  "phitsanulok-muni": "municipality",
  "saensuk": "municipality",
  "samui": "municipality", // Koh Samui Municipality
  "songkhla-city": "municipality",
  "ubon-muni": "municipality",

  // ─── District (sub-provincial project) ───
  "bang-saray": "district",
  "chiang-mai-old-town": "district",
  "klong-phadung": "district",
  "maesai": "district",
  "makkasan": "district",
  "phlapphla": "district",
  "phra-ram-4": "district",
  "rattanakosin": "district",
  "samyan": "district",
  "sritrang": "district",
  "thep-paraj": "district",
  "umong": "district",

  // ─── Campus (university / corporate living-lab) ───
  "cmu-smart-city": "campus",
  "phitsanulok-nu": "campus", // Naresuan University
  "tai-yong": "campus",
  "wangchan-valley": "campus",

  // ─── Special economic / industrial zone ───
  "khao-khun-song": "special-zone",
  "nikhom-phatthana": "special-zone",
  "phuket-tinicon": "special-zone",

  // ─── Township (planned community) ───
  "mae-moh": "township",
};

export function getCityLeague(cityId: string): CityLeague | undefined {
  return CITY_LEAGUES[cityId];
}
