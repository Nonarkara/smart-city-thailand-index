// ---------------------------------------------------------------------------
// BOI Investment Promotion — Area-Based Overlays, by province
// ---------------------------------------------------------------------------
// IMPORTANT: the old "Zone 1/2/3" province classification was superseded around
// 2015 and does NOT appear in BOI's current guide — citing it would be citing
// dead law. The current system (BOI Announcement No.8/2565, Five-Year Strategy
// 2023-2027) grades projects by activity merit (A1+ through B, not province-based)
// PLUS stackable AREA-BASED add-ons tied to real, named geographies. This file
// tracks only the area-based overlay, which is genuinely a per-province fact.
//
// Source: BOI Investment Promotion Guide 2026 (boi.go.th), verified July 2026.
// 46 of 77 provinces carry at least one tag; the rest (Bangkok and most of the
// central/interior belt) have no area-based overlay under the current rules —
// that is a real, sourced absence, not a research gap.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp.ts";

export type BoiTag =
  | "EEC" // Eastern Economic Corridor — Chachoengsao, Chonburi, Rayong
  | "southern-border-zone" // 8yr CIT exemption, no cap — deepest incentive in the guide
  | "decentralization-20-lowest-income" // 20 lowest per-capita-income provinces
  | "economic-corridor-NEC" // Northern Economic Corridor
  | "economic-corridor-NeEC" // Northeastern Economic Corridor
  | "economic-corridor-CWEC" // Central-Western Economic Corridor
  | "economic-corridor-SEC" // Southern Economic Corridor
  | "border-sez-subdistrict" // Border Special Economic Zone (named sub-districts only)
  | "model-city"; // one of BOI's 4 southern-border Model City districts

export interface BoiZoneEntry {
  tags: BoiTag[];
  /** Whether the tag(s) apply to the whole province or only named districts/sub-districts. */
  scope: string;
  detail: string;
  source: string;
  sourceUrl?: string;
  asOf: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_BOI_ZONES: Record<string, BoiZoneEntry> = {
  "Amnat Charoen": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Ayutthaya": {
    tags: ["economic-corridor-CWEC"],
    scope: "full-province",
    detail: "Central-Western Economic Corridor -- targeted industries: agriculture/food, electrical/electronics.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Bueng Kan": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Buriram": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier. Spelled 'Buri Ram' (two words) in the official BOI document; also commonly rendered 'Buriram'.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Chachoengsao": {
    tags: ["EEC"],
    scope: "full-province",
    detail: "Eastern Economic Corridor. Basic incentives (A1+ to B) plus EEC add-on: A1+ +1-2yr CIT, A1-A2 50% CIT reduction, A3-A4 +2yr CIT. Contains EECa (Eastern Airport City) zone.",
    source: "BOI Investment Promotion Guide 2026, p.40, 43",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Chaiyaphum": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Chiang Mai": {
    tags: ["economic-corridor-NEC"],
    scope: "full-province",
    detail: "Northern Economic Corridor 'Creative Lanna' -- targeted industries: agriculture/food, digital, creative industries, tourism/wellness.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Chiang Rai": {
    tags: ["economic-corridor-NEC", "border-sez-subdistrict"],
    scope: "full-province (NEC corridor) + 21 named sub-districts in Chiang Khong, Chiang Saen, Mae Sai districts (border SEZ)",
    detail: "Part of the Northern Economic Corridor 'Creative Lanna' (targeted industries: agriculture/food, digital, creative industries, tourism/wellness). Also has a border-SEZ overlay on part of the province.",
    source: "BOI Investment Promotion Guide 2026, p.27, 37, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Chon Buri": {
    tags: ["EEC"],
    scope: "full-province",
    detail: "Eastern Economic Corridor -- Thailand's top FDI destination (54% of pledged investment value per BOI's July 2026 press release). Contains EECd (Digital Park), EECg (Genomics Thailand), EECmd (Medical Hub), EECi (Innovation Platform).",
    source: "BOI Investment Promotion Guide 2026, p.40, 43; BOI press release, July 2026",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Chumphon": {
    tags: ["economic-corridor-SEC"],
    scope: "full-province",
    detail: "Southern Economic Corridor -- targeted industries: agriculture/food, bio-industries, tourism/wellness.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Kalasin": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "One of BOI's 20 provinces with lowest per-capita income. +3yr CIT exemption (activities A3/A4/B) or 50% CIT reduction for 5yrs post-exemption (A1/A2). Closest living equivalent to the old, superseded 'Zone 3' concept.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Kanchanaburi": {
    tags: ["economic-corridor-CWEC", "border-sez-subdistrict"],
    scope: "full-province (CWEC corridor) + 2 named sub-districts in Mueang Kanchanaburi district (border SEZ)",
    detail: "Central-Western Economic Corridor plus a small border-SEZ overlay.",
    source: "BOI Investment Promotion Guide 2026, p.27, 37, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Khon Kaen": {
    tags: ["economic-corridor-NeEC"],
    scope: "full-province",
    detail: "Northeastern Economic Corridor 'Bioeconomy'.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Lampang": {
    tags: ["economic-corridor-NEC"],
    scope: "full-province",
    detail: "Northern Economic Corridor 'Creative Lanna'.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Lamphun": {
    tags: ["economic-corridor-NEC"],
    scope: "full-province",
    detail: "Northern Economic Corridor 'Creative Lanna'.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Mae Hong Son": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Maha Sarakham": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Mukdahan": {
    tags: ["decentralization-20-lowest-income", "border-sez-subdistrict"],
    scope: "full-province (decentralization) + 11 named sub-districts in Mueang Mukdahan, Wan Yai, Don Tan districts (border SEZ)",
    detail: "Lowest-income decentralization tier plus a border-SEZ overlay on part of the province.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31, 36",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nakhon Pathom": {
    tags: ["economic-corridor-CWEC"],
    scope: "full-province",
    detail: "Central-Western Economic Corridor.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nakhon Phanom": {
    tags: ["decentralization-20-lowest-income", "border-sez-subdistrict"],
    scope: "full-province (decentralization) + 13 named sub-districts in Mueang and Tha Uthen districts (border SEZ)",
    detail: "Lowest-income decentralization tier plus a border-SEZ overlay on part of the province.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31, 37",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nakhon Ratchasima": {
    tags: ["economic-corridor-NeEC"],
    scope: "full-province",
    detail: "Northeastern Economic Corridor 'Bioeconomy' -- targeted industries: agriculture/food, bio-industries.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nakhon Si Thammarat": {
    tags: ["economic-corridor-SEC"],
    scope: "full-province",
    detail: "Southern Economic Corridor.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nan": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Narathiwat": {
    tags: ["southern-border-zone", "border-sez-subdistrict", "model-city"],
    scope: "full-province (border zone) + 5 named sub-districts (border SEZ) + Su-ngai Kolok district (model city)",
    detail: "8yr CIT exemption with no cap + 50% CIT reduction for 5yrs after -- the deepest incentive tier in the entire BOI guide. Eligible activities relaxed vs. other southern-border provinces. Also hosts one of BOI's 4 southern-border 'Model City' projects at Su-ngai Kolok district.",
    source: "BOI Investment Promotion Guide 2026, p.27, 37, 45-50",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nong Bua Lamphu": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Nong Khai": {
    tags: ["economic-corridor-NeEC", "border-sez-subdistrict"],
    scope: "full-province (NeEC corridor) + 13 named sub-districts in Mueang Nong Khai, Sakhrai districts (border SEZ)",
    detail: "Northeastern Economic Corridor plus a border-SEZ overlay on part of the province.",
    source: "BOI Investment Promotion Guide 2026, p.27, 37, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Pattani": {
    tags: ["southern-border-zone", "model-city"],
    scope: "full-province (border zone) + Nong Chik district (model city)",
    detail: "8yr CIT exemption, no cap, +50% reduction for 5yrs. Model City project at Nong Chik district.",
    source: "BOI Investment Promotion Guide 2026, p.27, 45-50",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Phatthalung": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Phrae": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Ranong": {
    tags: ["economic-corridor-SEC"],
    scope: "full-province",
    detail: "Southern Economic Corridor.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Rayong": {
    tags: ["EEC"],
    scope: "full-province",
    detail: "Eastern Economic Corridor. Contains EECtp (Tech Park Ban Chang), Map Ta Phut/Laem Chabang port and U-Tapao airport cluster.",
    source: "BOI Investment Promotion Guide 2026, p.40, 43",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Roi Et": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Sa Kaeo": {
    tags: ["decentralization-20-lowest-income", "border-sez-subdistrict"],
    scope: "full-province (decentralization) + 4 named sub-districts in Aranyaprathet, Watthana Nakhon districts (border SEZ)",
    detail: "Lowest-income decentralization tier plus a border-SEZ overlay on part of the province.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31, 36",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Sakon Nakhon": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Satun": {
    tags: ["southern-border-zone"],
    scope: "full-province",
    detail: "8yr CIT exemption, no cap, +50% reduction for 5yrs. No model-city or border-SEZ sub-district overlay.",
    source: "BOI Investment Promotion Guide 2026, p.27, 45-46",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Sisaket": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Songkhla": {
    tags: ["southern-border-zone", "border-sez-subdistrict", "model-city"],
    scope: "PARTIAL ONLY -- 4 districts (Chana, Na Thawi, Saba Yoi, Thepha) for the border-zone incentive, not the whole province; separately, Sadao district (4 sub-districts) is a border-SEZ zone; Chana district is also a model-city site",
    detail: "Do not tag Songkhla as a full-province southern-border zone -- the incentive is district-scoped, unlike Narathiwat/Pattani/Yala/Satun which are whole-province.",
    source: "BOI Investment Promotion Guide 2026, p.27, 36, 45-46",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Suphan Buri": {
    tags: ["economic-corridor-CWEC"],
    scope: "full-province",
    detail: "Central-Western Economic Corridor.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Surat Thani": {
    tags: ["economic-corridor-SEC"],
    scope: "full-province",
    detail: "Southern Economic Corridor.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Surin": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Tak": {
    tags: ["border-sez-subdistrict"],
    scope: "14 named sub-districts in Mae Sot, Phop Phra, Mae Ramat districts only -- NOT full province",
    detail: "No decentralization or economic-corridor tag; the only BOI area-based overlay is the border-SEZ zone (Mae Sot is the largest of Thailand's original 2015 SEZ pilot zones).",
    source: "BOI Investment Promotion Guide 2026, p.27, 36",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Trat": {
    tags: ["border-sez-subdistrict"],
    scope: "3 named sub-districts in Khlong Yai district only -- NOT full province",
    detail: "No decentralization or economic-corridor tag; only overlay is the small border-SEZ zone at Khlong Yai (Cambodia border crossing).",
    source: "BOI Investment Promotion Guide 2026, p.27, 36",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Ubon Ratchathani": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Udon Thani": {
    tags: ["economic-corridor-NeEC"],
    scope: "full-province",
    detail: "Northeastern Economic Corridor 'Bioeconomy'.",
    source: "BOI Investment Promotion Guide 2026, p.27, 40-41",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Yala": {
    tags: ["southern-border-zone", "model-city"],
    scope: "full-province (border zone) + Betong district (model city)",
    detail: "8yr CIT exemption, no cap, +50% reduction for 5yrs. Model City project at Betong district.",
    source: "BOI Investment Promotion Guide 2026, p.27, 45-50",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
  "Yasothon": {
    tags: ["decentralization-20-lowest-income"],
    scope: "full-province",
    detail: "20 lowest-income-province decentralization tier.",
    source: "BOI Investment Promotion Guide 2026, p.27, 30-31",
    sourceUrl: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf",
    asOf: "2026-07",
  },
};

// Incentive-depth weighting, calibrated from the real CIT-exemption terms in the
// guide: southern-border (8yr, no cap) is the single richest incentive; EEC and
// the 4 economic corridors are the next tier (multi-year CIT + infrastructure
// investment); decentralization is a real but shallower add-on (+3yr or 50%
// reduction); the two narrow-scope tags (sub-district only) add a smaller bonus
// since they cover a fraction of the province, not all of it.
const TAG_WEIGHT: Record<BoiTag, number> = {
  "southern-border-zone": 95,
  "EEC": 88,
  "economic-corridor-NEC": 75,
  "economic-corridor-NeEC": 75,
  "economic-corridor-CWEC": 75,
  "economic-corridor-SEC": 75,
  "decentralization-20-lowest-income": 65,
  "border-sez-subdistrict": 55,
  "model-city": 55,
};

const TAG_LABEL: Record<BoiTag, LocalizedText> = {
  "EEC": { en: "EEC", th: "เขตพัฒนาพิเศษภาคตะวันออก (EEC)", zh: "东部经济走廊（EEC）" },
  "southern-border-zone": {
    en: "Southern Border Zone",
    th: "เขตพัฒนาพิเศษเฉพาะกิจจังหวัดชายแดนภาคใต้",
    zh: "南部边境特别开发区",
  },
  "decentralization-20-lowest-income": {
    en: "BOI Decentralization Tier",
    th: "กลุ่มจังหวัดรายได้ต่อหัวต่ำ 20 อันดับ (BOI)",
    zh: "BOI 低收入省份优惠层级",
  },
  "economic-corridor-NEC": { en: "Northern Economic Corridor", th: "ระเบียงเศรษฐกิจภาคเหนือ (NEC)", zh: "北部经济走廊（NEC）" },
  "economic-corridor-NeEC": {
    en: "Northeastern Economic Corridor",
    th: "ระเบียงเศรษฐกิจภาคตะวันออกเฉียงเหนือ (NeEC)",
    zh: "东北部经济走廊（NeEC）",
  },
  "economic-corridor-CWEC": {
    en: "Central-Western Economic Corridor",
    th: "ระเบียงเศรษฐกิจภาคกลาง-ตะวันตก (CWEC)",
    zh: "中西部经济走廊（CWEC）",
  },
  "economic-corridor-SEC": { en: "Southern Economic Corridor", th: "ระเบียงเศรษฐกิจภาคใต้ (SEC)", zh: "南部经济走廊（SEC）" },
  "border-sez-subdistrict": {
    en: "Border SEZ (sub-district)",
    th: "เขตเศรษฐกิจพิเศษชายแดน (ระดับตำบล)",
    zh: "边境经济特区（乡级）",
  },
  "model-city": { en: "BOI Model City", th: "เมืองต้นแบบ BOI", zh: "BOI 示范城市" },
};

export interface BoiZoneSignal {
  label: LocalizedText;
  /** 0-100 — deeper/broader BOI incentive overlays score higher. */
  score: number;
}

export function getBoiZone(province: string): BoiZoneSignal | undefined {
  const entry = PROVINCIAL_BOI_ZONES[province];
  if (!entry || entry.tags.length === 0) return undefined;
  const best = entry.tags.reduce((max, t) => Math.max(max, TAG_WEIGHT[t]), 0);
  const label: LocalizedText = {
    en: entry.tags.map(t => TAG_LABEL[t].en).join(" + "),
    th: entry.tags.map(t => TAG_LABEL[t].th).join(" + "),
    zh: entry.tags.map(t => TAG_LABEL[t].zh).join(" + "),
  };
  return { label, score: Math.min(100, best) };
}
