// ---------------------------------------------------------------------------
// Preset lenses — curated weight profiles for ranking cities
// ---------------------------------------------------------------------------
// Each lens redistributes the 7 pillar weights (they sum to 100) and can
// apply a metric bonus. Click a lens, the directory re-ranks under that
// worldview. The radar on the preset panel visualises the weight shape.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp";
import type { ScoringPillar, SmartCity } from "./types";

type PresetWeights = Record<ScoringPillar, number>;

export interface PresetLens {
  id: string;
  label: LocalizedText;
  tagline: LocalizedText;
  flavour: LocalizedText; // the "this is who this city is for" line
  weights: PresetWeights; // must sum to 100
  metricBonus?: (city: SmartCity) => number; // 0–20 bonus added post-weighted
}

const UNI_CITY_IDS = new Set([
  "cmu-smart-city",
  "samyan",
  "khon-kaen",
  "korat",
  "chiang-rai",
  "ubon",
  "phitsanulok-nu",
  "wangchan-valley",
]);

export const PRESET_LENSES: PresetLens[] = [
  {
    id: "balanced",
    label: { en: "Balanced", th: "สมดุล", zh: "均衡" },
    tagline: {
      en: "The default composite — livability first, then economy.",
      th: "คะแนนรวมมาตรฐาน — น่าอยู่มาก่อน เศรษฐกิจตามมา",
      zh: "默认综合——宜居为先，经济次之。",
    },
    flavour: {
      en: "No axe to grind. Just the index as designed.",
      th: "ไม่เอนเอียง ใช้ดัชนีตามที่ออกแบบไว้",
      zh: "不偏不倚，按索引原样呈现。",
    },
    weights: { livability: 25, economy: 20, safety: 15, wellbeing: 15, environment: 10, hospitality: 10, digital: 5 },
  },
  {
    id: "growth",
    label: { en: "Growth, growth, growth", th: "เติบโตอย่างเดียว", zh: "只看增长" },
    tagline: {
      en: "Jobs, GPP, digital — the rest is noise.",
      th: "งาน GPP ดิจิทัล — ที่เหลือคือเสียงรบกวน",
      zh: "就业、GPP、数字——其余皆为噪声。",
    },
    flavour: {
      en: "You came for returns. Safety and sunsets don't move the needle.",
      th: "คุณมาเพื่อผลตอบแทน ความปลอดภัยกับพระอาทิตย์ตกไม่ใช่ประเด็น",
      zh: "你为回报而来。安全与晚霞撼动不了指针。",
    },
    weights: { livability: 5, economy: 35, safety: 5, wellbeing: 5, environment: 5, hospitality: 5, digital: 40 },
    metricBonus: city => {
      const growth = city.metrics.gppGrowthRate ?? 0;
      const fdi = city.metrics.fdiInflow ?? 0;
      return Math.min(20, Math.max(0, growth * 2) + Math.min(8, fdi / 500));
    },
  },
  {
    id: "affordability",
    label: { en: "Thriving on affordability", th: "ใช้ชีวิตคุ้มค่า", zh: "高性价比宜居" },
    tagline: {
      en: "Livable, decent wages — but nothing Bangkok-priced.",
      th: "น่าอยู่ รายได้พอดี — แต่ไม่แพงแบบกรุงเทพ",
      zh: "宜居、收入体面——但价格远低于曼谷。",
    },
    flavour: {
      en: "Middle-class life without the Bangkok overhead.",
      th: "ชีวิตชนชั้นกลางโดยไม่ต้องแบกค่าใช้จ่ายเมืองหลวง",
      zh: "中产生活，免除首都级开销。",
    },
    weights: { livability: 35, economy: 5, safety: 15, wellbeing: 25, environment: 10, hospitality: 10, digital: 0 },
    metricBonus: city => {
      // prefer low GPP/cap — cheaper cost of living
      const gpp = city.metrics.gppPerCapita ?? 0;
      if (gpp === 0) return 0;
      if (gpp > 400000) return 0;
      if (gpp < 120000) return 20;
      return Math.round(20 * (1 - (gpp - 120000) / 280000));
    },
  },
  {
    id: "startup",
    label: { en: "Startup town", th: "เมืองสตาร์ทอัพ", zh: "创业之城" },
    tagline: {
      en: "Digital infra, university pipeline, investor-friendly tax.",
      th: "โครงสร้างดิจิทัล สายป่านมหาวิทยาลัย ภาษีเป็นมิตร",
      zh: "数字基础设施、高校人才链、税制友好。",
    },
    flavour: {
      en: "You need bandwidth, talent, and BOI paperwork that works.",
      th: "คุณต้องการแบนด์วิดท์ คน และเอกสาร BOI ที่ใช้งานจริง",
      zh: "你需要带宽、人才，以及真正好用的 BOI 文件。",
    },
    weights: { livability: 10, economy: 25, safety: 10, wellbeing: 10, environment: 5, hospitality: 5, digital: 35 },
    metricBonus: city => {
      const uniBonus = UNI_CITY_IDS.has(city.id) ? 10 : 0;
      const fdi = city.metrics.fdiInflow ?? 0;
      return Math.min(20, uniBonus + Math.min(10, fdi / 600));
    },
  },
  {
    id: "nomad",
    label: { en: "Digital nomad dream", th: "ฝันนักเดินทางดิจิทัล", zh: "数字游民梦想" },
    tagline: {
      en: "Good air, good wifi, good coffee, no drama.",
      th: "อากาศดี เน็ตดี กาแฟดี ไม่มีดราม่า",
      zh: "空气清新、网速稳、咖啡好、无事发生。",
    },
    flavour: {
      en: "Two-week stays that become two-year stays.",
      th: "มาพักสองสัปดาห์ แต่อยู่ยาวสองปี",
      zh: "说好的两周，住成两年。",
    },
    weights: { livability: 15, economy: 10, safety: 15, wellbeing: 10, environment: 20, hospitality: 15, digital: 15 },
    metricBonus: city => {
      const pm = city.metrics.pm25Annual ?? 30;
      // reward clean air below WHO interim target of 25
      if (pm < 15) return 20;
      if (pm < 25) return 12;
      if (pm < 35) return 4;
      return 0;
    },
  },
  {
    id: "retirement",
    label: { en: "Retirement paradise", th: "สวรรค์วัยเกษียณ", zh: "退休天堂" },
    tagline: {
      en: "Healthcare nearby, safe streets, warm community.",
      th: "โรงพยาบาลใกล้ ถนนปลอดภัย ชุมชนอบอุ่น",
      zh: "医疗在旁、街巷安全、社区温暖。",
    },
    flavour: {
      en: "Your knees and your bank account both get to relax.",
      th: "เข่าและบัญชีธนาคารได้พักทั้งคู่",
      zh: "膝盖与账户都能松一口气。",
    },
    weights: { livability: 20, economy: 5, safety: 20, wellbeing: 30, environment: 15, hospitality: 10, digital: 0 },
    metricBonus: city => {
      const beds = city.metrics.hospitalBedsPer10k ?? 15;
      const crime = city.metrics.crimeRatePer100k ?? 200;
      const bedsScore = Math.min(12, Math.max(0, (beds - 15) * 1.5));
      const crimeScore = crime < 120 ? 8 : crime < 170 ? 4 : 0;
      return bedsScore + crimeScore;
    },
  },
  {
    id: "climate",
    label: { en: "Climate refuge", th: "ที่พักพิงภูมิอากาศ", zh: "气候避风港" },
    tagline: {
      en: "Green cover, clean air, resilient to the hot decade ahead.",
      th: "พื้นที่สีเขียว อากาศสะอาด ทนต่อทศวรรษที่ร้อนขึ้น",
      zh: "绿意浓、空气净、能扛住下一个炎热十年。",
    },
    flavour: {
      en: "Bangkok will keep heating. These cities already have the trees.",
      th: "กรุงเทพจะร้อนขึ้นเรื่อยๆ เมืองเหล่านี้มีต้นไม้อยู่แล้ว",
      zh: "曼谷只会更热。这些城市已经有了树。",
    },
    weights: { livability: 10, economy: 5, safety: 10, wellbeing: 10, environment: 40, hospitality: 15, digital: 10 },
    metricBonus: city => {
      const pm = city.metrics.pm25Annual ?? 30;
      const green = city.metrics.greenCoverage ?? 30;
      const pmBonus = pm < 20 ? 10 : pm < 30 ? 5 : 0;
      const greenBonus = green > 60 ? 10 : green > 45 ? 5 : 0;
      return pmBonus + greenBonus;
    },
  },
];

export function computePresetScore(city: SmartCity, lens: PresetLens): number {
  const weightedPillarSum =
    (city.scores.livability * lens.weights.livability +
      city.scores.economy * lens.weights.economy +
      city.scores.safety * lens.weights.safety +
      city.scores.wellbeing * lens.weights.wellbeing +
      city.scores.environment * lens.weights.environment +
      city.scores.hospitality * lens.weights.hospitality +
      city.scores.digital * lens.weights.digital) /
    100;
  const bonus = lens.metricBonus ? lens.metricBonus(city) : 0;
  return Math.min(100, weightedPillarSum + bonus * 0.3); // bonus softened to 0-6
}

export function getPresetById(id: string): PresetLens {
  return PRESET_LENSES.find(p => p.id === id) ?? PRESET_LENSES[0];
}
