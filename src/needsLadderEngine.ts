// ---------------------------------------------------------------------------
// Needs Ladder — a Maslow-style hierarchy of what a city actually has to get
// right, in order. Not a replacement for the 7-pillar composite score (that
// stays the official ranking instrument) — this is a second, narrative lens
// for the city detail page: which rungs does THIS city clear, and by how much.
//
// The ladder (highest priority first, per the project brief):
//   1. Apex        — hygiene: clean air, clean water, no trash/disease
//   2. Protection   — safety, healthcare access, access to nature
//   3. Belonging    — community, hospitality
//   4. Livelihood   — employment, labor, land, BOI tax incentives
//   5. Reach        — distance from regional hubs (Bangkok/Chiang Mai/Phuket)
//   6. Convenience  — quality of life, ease of daily living
//   7. Affordability— rent, cost of living, schooling
//   8. Calm         — mental health: traffic, commute stress
//
// Every rung is computed ONLY from fields that already carry a real source
// (CityMetrics, already-cited in the codebase) or from newly-verified
// provincial data (see provincialBoiZones.ts, provincialLaborEconomics.ts,
// provincialTrafficIndex.ts, provincialAccessData.ts — each entry there
// carries its own source, matching the house "no hallucination" rule).
// A rung a city has no real data for renders as unavailable, never guessed.
//
// Every signal label is trilingual (LocalizedText) — this ladder ships in
// EN/TH/ZH like every other surface in the app, not just the rung titles.
// ---------------------------------------------------------------------------

import type { SmartCity } from "./types.ts";
import type { LocalizedText } from "./cityCdp.ts";
import { getHubDistances, marketAccessScore } from "./regionalDistance.ts";
import { getBoiZone } from "./provincialBoiZones.ts";
import { getLaborEconomics } from "./provincialLaborEconomics.ts";
import { getTrafficSignal } from "./provincialTrafficIndex.ts";
import { getAccessSignal } from "./provincialAccessData.ts";

export type LadderRungId =
  | "apex"
  | "protection"
  | "belonging"
  | "livelihood"
  | "reach"
  | "convenience"
  | "affordability"
  | "calm";

export interface LadderRung {
  id: LadderRungId;
  /** 0-100, undefined when there is not enough real data to score this rung at all. */
  score: number | undefined;
  /** Real, cited data points that fed the score — always at least 1 if score is defined. */
  signals: LadderSignal[];
}

export interface LadderSignal {
  label: LocalizedText;
  value: string;
  source: "metrics" | "provincial" | "geometry" | "pillar";
}

export interface NeedsLadderProfile {
  cityId: string;
  rungs: LadderRung[];
  /** How many of the 8 rungs have a real score (vs. no-data). */
  coverage: number;
}

const RUNGS: LadderRungId[] = [
  "apex",
  "protection",
  "belonging",
  "livelihood",
  "reach",
  "convenience",
  "affordability",
  "calm",
];

// ─── Trilingual signal-label dictionary — every static label used below ────
const L = {
  pm25: { en: "PM2.5 (annual avg)", th: "PM2.5 (เฉลี่ยรายปี)", zh: "PM2.5（年均值）" },
  waterQuality: { en: "Water quality index", th: "ดัชนีคุณภาพน้ำ", zh: "水质指数" },
  crimeRate: { en: "Crime rate", th: "อัตราอาชญากรรม", zh: "犯罪率" },
  roadFatality: { en: "Road fatality rate", th: "อัตราผู้เสียชีวิตบนถนน", zh: "道路死亡率" },
  hospitalBeds: { en: "Hospital beds", th: "เตียงโรงพยาบาล", zh: "医院床位" },
  floodSafety: { en: "Flood safety", th: "ความปลอดภัยจากน้ำท่วม", zh: "防洪安全" },
  greenCoverage: { en: "Green coverage", th: "พื้นที่สีเขียว", zh: "绿化覆盖率" },
  hospitalsProvince: { en: "Public hospitals (province)", th: "โรงพยาบาลรัฐ (จังหวัด)", zh: "公立医院（省级）" },
  hospitalityPillar: { en: "Hospitality pillar", th: "เสาหลักอัธยาศัย", zh: "待客支柱" },
  wellbeingPillar: { en: "Wellbeing pillar", th: "เสาหลักคุณภาพชีวิต", zh: "福祉支柱" },
  gppPerCapita: { en: "GPP per capita", th: "GPP ต่อหัว", zh: "人均GPP" },
  gppGrowth: { en: "GPP growth", th: "การเติบโตของ GPP", zh: "GPP增长" },
  fdiInflow: { en: "FDI inflow", th: "เงินลงทุนโดยตรงจากต่างประเทศ", zh: "外国直接投资流入" },
  boiZone: { en: "BOI investment zone", th: "เขตส่งเสริมการลงทุน BOI", zh: "BOI投资促进区" },
  minWage: { en: "Minimum wage", th: "ค่าแรงขั้นต่ำ", zh: "最低工资" },
  educationAccess: { en: "Education access (province)", th: "การเข้าถึงการศึกษา (จังหวัด)", zh: "教育资源（省级）" },
  distanceToChiangMai: { en: "Distance to Chiang Mai", th: "ระยะทางถึงเชียงใหม่", zh: "距清迈距离" },
  distanceToBangkok: { en: "Distance to Bangkok", th: "ระยะทางถึงกรุงเทพฯ", zh: "距曼谷距离" },
  distanceToPhuket: { en: "Distance to Phuket", th: "ระยะทางถึงภูเก็ต", zh: "距普吉距离" },
  digitalPillar: { en: "Digital pillar", th: "เสาหลักดิจิทัล", zh: "数字支柱" },
  smartDimensions: { en: "Smart dimensions active", th: "มิติอัจฉริยะที่ใช้งาน", zh: "活跃智慧维度" },
  avgIncome: { en: "Avg. monthly income", th: "รายได้เฉลี่ยต่อเดือน", zh: "月均收入" },
  landPrice: { en: "Land price", th: "ราคาที่ดิน", zh: "地价" },
  costOfLiving: { en: "Cost-of-living index", th: "ดัชนีค่าครองชีพ", zh: "生活成本指数" },
  urbanProximity: { en: "Urban-core proximity", th: "ความใกล้ศูนย์กลางเมือง", zh: "邻近城市核心区" },
} as const satisfies Record<string, LocalizedText>;

/** Clamp + round to a clean integer 0-100 score. */
function clampScore(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

/** Linear map: worse raw value -> lower score, capped to [0,100]. */
function scoreLowerIsBetter(value: number, best: number, worst: number): number {
  const t = (worst - value) / (worst - best);
  return clampScore(100 * t);
}

function scoreHigherIsBetter(value: number, worst: number, best: number): number {
  const t = (value - worst) / (best - worst);
  return clampScore(100 * t);
}

function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

// ─── Rung 1 — Apex: air, water, hygiene ─────────────────────────────────────
function apexRung(city: SmartCity): LadderRung {
  const { pm25Annual, waterQuality } = city.metrics;
  const signals: LadderSignal[] = [];
  const parts: number[] = [];

  if (pm25Annual !== undefined) {
    // WHO annual guideline is 5 ug/m3 (excellent); 60+ is Thailand's worst
    // burn-season readings (poor). Calibrated to that real range.
    parts.push(scoreLowerIsBetter(pm25Annual, 5, 60));
    signals.push({ label: L.pm25, value: `${pm25Annual} µg/m³`, source: "metrics" });
  }
  if (waterQuality !== undefined) {
    parts.push(waterQuality); // already a real 0-100 PCD/ONEP index
    signals.push({ label: L.waterQuality, value: `${waterQuality}/100`, source: "metrics" });
  }

  return { id: "apex", score: parts.length ? clampScore(average(parts)!) : undefined, signals };
}

// ─── Rung 2 — Protection: safety, healthcare, nature ────────────────────────
function protectionRung(city: SmartCity): LadderRung {
  const { crimeRatePer100k, roadFatalityRate, hospitalBedsPer10k, floodFrequencyScore, greenCoverage } = city.metrics;
  const signals: LadderSignal[] = [];
  const parts: number[] = [];

  if (crimeRatePer100k !== undefined) {
    parts.push(scoreLowerIsBetter(crimeRatePer100k, 50, 400));
    signals.push({ label: L.crimeRate, value: `${crimeRatePer100k}/100k`, source: "metrics" });
  }
  if (roadFatalityRate !== undefined) {
    parts.push(scoreLowerIsBetter(roadFatalityRate, 5, 60));
    signals.push({ label: L.roadFatality, value: `${roadFatalityRate}/100k/yr`, source: "metrics" });
  }
  if (hospitalBedsPer10k !== undefined) {
    parts.push(scoreHigherIsBetter(hospitalBedsPer10k, 5, 45));
    signals.push({ label: L.hospitalBeds, value: `${hospitalBedsPer10k}/10k pop.`, source: "metrics" });
  }
  if (floodFrequencyScore !== undefined) {
    parts.push(floodFrequencyScore); // already 0-100, higher = less flood-prone
    signals.push({ label: L.floodSafety, value: `${floodFrequencyScore}/100`, source: "metrics" });
  }
  if (greenCoverage !== undefined) {
    parts.push(scoreHigherIsBetter(greenCoverage, 10, 70));
    signals.push({ label: L.greenCoverage, value: `${greenCoverage}%`, source: "metrics" });
  }

  const access = getAccessSignal(city.province);
  if (access?.hospitalsPerProvince !== undefined) {
    signals.push({ label: L.hospitalsProvince, value: `${access.hospitalsPerProvince}`, source: "provincial" });
  }

  return { id: "protection", score: parts.length ? clampScore(average(parts)!) : undefined, signals };
}

// ─── Rung 3 — Belonging: community, hospitality ─────────────────────────────
function belongingRung(city: SmartCity): LadderRung {
  const signals: LadderSignal[] = [
    { label: L.hospitalityPillar, value: `${city.scores.hospitality}/100`, source: "pillar" },
    { label: L.wellbeingPillar, value: `${city.scores.wellbeing}/100`, source: "pillar" },
  ];
  const score = clampScore(average([city.scores.hospitality, city.scores.wellbeing])!);
  return { id: "belonging", score, signals };
}

// ─── Rung 4 — Livelihood: employment, labor, land, BOI ──────────────────────
function livelihoodRung(city: SmartCity): LadderRung {
  const { gppPerCapita, gppGrowthRate, fdiInflow } = city.metrics;
  const signals: LadderSignal[] = [];
  const parts: number[] = [];

  if (gppPerCapita !== undefined) {
    parts.push(scoreHigherIsBetter(gppPerCapita, 60000, 1_200_000));
    signals.push({ label: L.gppPerCapita, value: `฿${gppPerCapita.toLocaleString()}`, source: "metrics" });
  }
  if (gppGrowthRate !== undefined) {
    parts.push(scoreHigherIsBetter(gppGrowthRate, -2, 8));
    signals.push({ label: L.gppGrowth, value: `${gppGrowthRate > 0 ? "+" : ""}${gppGrowthRate}% YoY`, source: "metrics" });
  }
  if (fdiInflow !== undefined) {
    parts.push(scoreHigherIsBetter(Math.log10(Math.max(fdiInflow, 1)), Math.log10(10), Math.log10(10000)));
    signals.push({ label: L.fdiInflow, value: `฿${fdiInflow.toLocaleString()}M`, source: "metrics" });
  }

  const boi = getBoiZone(city.province);
  if (boi) {
    parts.push(boi.score);
    signals.push({ label: L.boiZone, value: boi.label, source: "provincial" });
  }
  const labor = getLaborEconomics(city.province);
  if (labor?.minWageBaht !== undefined) {
    signals.push({ label: L.minWage, value: `฿${labor.minWageBaht}/day`, source: "provincial" });
  }

  return { id: "livelihood", score: parts.length ? clampScore(average(parts)!) : undefined, signals };
}

// ─── Rung 5 — Reach: distance from regional hubs ────────────────────────────
function reachRung(city: SmartCity): LadderRung {
  const hub = getHubDistances(city.id);
  if (!hub) return { id: "reach", score: undefined, signals: [] };

  const nearestLabel = hub.nearestHub === "chiangMai" ? L.distanceToChiangMai : hub.nearestHub === "bangkok" ? L.distanceToBangkok : L.distanceToPhuket;
  const signals: LadderSignal[] = [
    { label: nearestLabel, value: `${hub.nearestHubKm} km`, source: "geometry" },
  ];
  if (hub.nearestHub !== "bangkok") {
    signals.push({ label: L.distanceToBangkok, value: `${hub.bangkokKm} km`, source: "geometry" });
  }

  return { id: "reach", score: marketAccessScore(hub.nearestHubKm), signals };
}

// ─── Rung 6 — Convenience: quality of life, ease of daily living ───────────
function convenienceRung(city: SmartCity): LadderRung {
  const signals: LadderSignal[] = [
    { label: L.digitalPillar, value: `${city.scores.digital}/100`, source: "pillar" },
    { label: L.smartDimensions, value: `${city.smartDimensions.length}/7`, source: "pillar" },
  ];
  const parts = [city.scores.digital, scoreHigherIsBetter(city.smartDimensions.length, 0, 7)];

  const access = getAccessSignal(city.province);
  if (access?.universities !== undefined || access?.internationalSchools !== undefined) {
    const bits: string[] = [];
    if (access.universities !== undefined) bits.push(`${access.universities} univ.`);
    if (access.internationalSchools !== undefined) bits.push(`${access.internationalSchools} int'l schools`);
    signals.push({ label: L.educationAccess, value: bits.join(", "), source: "provincial" });
  }

  return { id: "convenience", score: clampScore(average(parts)!), signals };
}

// ─── Rung 7 — Affordability: rent, cost of living, schooling ────────────────
function affordabilityRung(city: SmartCity): LadderRung {
  const { avgMonthlyIncome, landPriceBaht } = city.metrics;
  const signals: LadderSignal[] = [];
  const parts: number[] = [];

  if (avgMonthlyIncome !== undefined) {
    parts.push(scoreHigherIsBetter(avgMonthlyIncome, 12000, 45000));
    signals.push({ label: L.avgIncome, value: `฿${avgMonthlyIncome.toLocaleString()}`, source: "metrics" });
  }
  if (landPriceBaht !== null && landPriceBaht !== undefined) {
    // Lower land price = more affordable to live/build here. Real range from
    // provincialLandPriceData.ts spans roughly 800-180,000 baht/sqm.
    parts.push(scoreLowerIsBetter(landPriceBaht, 800, 180_000));
    signals.push({ label: L.landPrice, value: `฿${landPriceBaht.toLocaleString()}/m²`, source: "metrics" });
  }

  const labor = getLaborEconomics(city.province);
  if (labor?.costOfLivingIndex !== undefined) {
    parts.push(labor.costOfLivingIndex);
    signals.push({ label: L.costOfLiving, value: `${labor.costOfLivingIndex}/100`, source: "provincial" });
  }

  return { id: "affordability", score: parts.length ? clampScore(average(parts)!) : undefined, signals };
}

// ─── Rung 8 — Calm: traffic, commute stress ─────────────────────────────────
function calmRung(city: SmartCity): LadderRung {
  const signals: LadderSignal[] = [];
  const parts: number[] = [];

  const traffic = getTrafficSignal(city.province);
  if (traffic) {
    parts.push(traffic.score);
    signals.push({ label: traffic.label, value: traffic.value, source: "provincial" });
  }

  // Distance-to-hub is a genuine, real proxy for commute pressure even where
  // no direct congestion index exists: cities far from any hub don't have
  // hub-style gridlock, cities embedded in one usually do.
  const hub = getHubDistances(city.id);
  if (hub && hub.nearestHubKm < 30) {
    parts.push(scoreLowerIsBetter(hub.nearestHubKm, 0, 30));
    signals.push({ label: L.urbanProximity, value: `${hub.nearestHubKm} km`, source: "geometry" });
  }

  return { id: "calm", score: parts.length ? clampScore(average(parts)!) : undefined, signals };
}

const RUNG_BUILDERS: Record<LadderRungId, (city: SmartCity) => LadderRung> = {
  apex: apexRung,
  protection: protectionRung,
  belonging: belongingRung,
  livelihood: livelihoodRung,
  reach: reachRung,
  convenience: convenienceRung,
  affordability: affordabilityRung,
  calm: calmRung,
};

export function computeNeedsLadder(city: SmartCity): NeedsLadderProfile {
  const rungs = RUNGS.map(id => RUNG_BUILDERS[id](city));
  const coverage = rungs.filter(r => r.score !== undefined).length;
  return { cityId: city.id, rungs, coverage };
}

/** Highest-scoring rung with real data — "this city's strongest need it meets". */
export function strongestRung(profile: NeedsLadderProfile): LadderRung | undefined {
  return profile.rungs
    .filter(r => r.score !== undefined)
    .sort((a, b) => (b.score! - a.score!))[0];
}

/** Lowest-scoring rung with real data — the honest gap, not hidden. */
export function weakestRung(profile: NeedsLadderProfile): LadderRung | undefined {
  return profile.rungs
    .filter(r => r.score !== undefined)
    .sort((a, b) => (a.score! - b.score!))[0];
}
