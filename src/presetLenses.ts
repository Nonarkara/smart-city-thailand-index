// ---------------------------------------------------------------------------
// Preset lenses — curated weight profiles for ranking cities
// ---------------------------------------------------------------------------
// Each lens redistributes the 7 pillar weights (they sum to 100) without metric bonuses. Click a lens, the directory re-ranks under that
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
}

export const PRESET_LENSES: PresetLens[] = [
  {
    id: "balanced",
    label: {
      en: "Balanced",
      th: "สมดุล",
      zh: "均衡",
    },
    tagline: {
      en: "The published composite: livability 25%, economy 20%, and five supporting pillars.",
      th: "คะแนนรวมที่เผยแพร่: ความน่าอยู่ 25% เศรษฐกิจ 20% และอีกห้าเสาหลัก",
      zh: "已发布综合分：宜居25%、经济20%，以及另外五个支柱。",
    },
    flavour: {
      en: "Curated research scores; check source dates and city-level coverage before deciding.",
      th: "คะแนนวิจัยที่คัดสรร ควรตรวจวันที่และความครอบคลุมระดับเมืองก่อนตัดสินใจ",
      zh: "研究评分经过编辑整理；决策前请核查来源日期及市级覆盖范围。",
    },
    weights: { livability: 25, economy: 20, safety: 15, wellbeing: 15, environment: 10, hospitality: 10, digital: 5 },
  },
  {
    id: "growth",
    label: {
      en: "Economy & digital",
      th: "เศรษฐกิจและดิจิทัล",
      zh: "经济与数字",
    },
    tagline: {
      en: "More weight on economy and digital indicators.",
      th: "ให้น้ำหนักตัวชี้วัดเศรษฐกิจและดิจิทัลมากขึ้น",
      zh: "提高经济与数字指标的权重。",
    },
    flavour: {
      en: "A screening view, not a forecast of returns. Check sector demand, costs, permits and project cash flow.",
      th: "ใช้คัดกรองเบื้องต้น ไม่ใช่การพยากรณ์ผลตอบแทน ควรตรวจอุปสงค์รายสาขา ต้นทุน ใบอนุญาต และกระแสเงินสดของโครงการ",
      zh: "用于初步筛选，不预测回报；请核查行业需求、成本、许可及项目现金流。",
    },
    weights: { livability: 5, economy: 35, safety: 5, wellbeing: 5, environment: 5, hospitality: 5, digital: 40 },
  },
  {
    id: "affordability",
    label: {
      en: "Daily life",
      th: "ชีวิตประจำวัน",
      zh: "日常生活",
    },
    tagline: {
      en: "More weight on livability, wellbeing and safety.",
      th: "ให้น้ำหนักความน่าอยู่ คุณภาพชีวิต และความปลอดภัยมากขึ้น",
      zh: "提高宜居、福祉与安全的权重。",
    },
    flavour: {
      en: "Rent and household budgets are not measured here. Low GPP per person does not establish cheap living costs.",
      th: "ยังไม่วัดค่าเช่าหรืองบครัวเรือน GPP ต่อคนต่ำไม่ได้ยืนยันว่าค่าครองชีพต่ำ",
      zh: "本视图未衡量房租或家庭预算。人均GPP较低并不证明生活成本较低。",
    },
    weights: { livability: 35, economy: 5, safety: 15, wellbeing: 25, environment: 10, hospitality: 10, digital: 0 },
  },
  {
    id: "startup",
    label: {
      en: "Digital & work",
      th: "ดิจิทัลและการทำงาน",
      zh: "数字与工作",
    },
    tagline: {
      en: "More weight on digital, economy and livability.",
      th: "ให้น้ำหนักดิจิทัล เศรษฐกิจ และความน่าอยู่มากขึ้น",
      zh: "提高数字、经济及宜居的权重。",
    },
    flavour: {
      en: "Not a measure of job vacancies, university quality, tax eligibility or BOI approval. Verify each separately.",
      th: "ไม่ได้วัดตำแหน่งงานว่าง คุณภาพมหาวิทยาลัย สิทธิภาษี หรือการอนุมัติ BOI ต้องตรวจแต่ละเรื่องแยกกัน",
      zh: "不衡量招聘岗位、大学质量、税惠资格或BOI审批；须逐项核实。",
    },
    weights: { livability: 10, economy: 25, safety: 10, wellbeing: 10, environment: 5, hospitality: 5, digital: 35 },
  },
  {
    id: "nomad",
    label: {
      en: "Remote work",
      th: "ทำงานทางไกล",
      zh: "远程工作",
    },
    tagline: {
      en: "Balance environment, digital access, hospitality and daily life.",
      th: "พิจารณาสิ่งแวดล้อม การเข้าถึงดิจิทัล การต้อนรับ และชีวิตประจำวัน",
      zh: "综合考虑环境、数字接入、接待条件及日常生活。",
    },
    flavour: {
      en: "Check current air quality, the actual connection at your address, rent and visa/work rules.",
      th: "ควรตรวจคุณภาพอากาศปัจจุบัน อินเทอร์เน็ต ณ ที่พักจริง ค่าเช่า และกฎวีซ่าหรือการทำงาน",
      zh: "请核查当前空气质量、住址实际网速、租金及签证和工作规定。",
    },
    weights: { livability: 15, economy: 10, safety: 15, wellbeing: 10, environment: 20, hospitality: 15, digital: 15 },
  },
  {
    id: "retirement",
    label: {
      en: "Health & safety",
      th: "สุขภาพและความปลอดภัย",
      zh: "健康与安全",
    },
    tagline: {
      en: "More weight on wellbeing, safety and livability.",
      th: "ให้น้ำหนักคุณภาพชีวิต ความปลอดภัย และความน่าอยู่มากขึ้น",
      zh: "提高福祉、安全及宜居的权重。",
    },
    flavour: {
      en: "Hospital capacity does not establish access to your specialist, insurance coverage or treatment cost.",
      th: "จำนวนเตียงไม่ได้ยืนยันการเข้าถึงแพทย์เฉพาะทาง ความคุ้มครองประกัน หรือค่ารักษาของคุณ",
      zh: "医院容量并不证明可获得所需专科、保险覆盖或治疗费用。",
    },
    weights: { livability: 20, economy: 5, safety: 20, wellbeing: 30, environment: 15, hospitality: 10, digital: 0 },
  },
  {
    id: "climate",
    label: {
      en: "Environment",
      th: "สิ่งแวดล้อม",
      zh: "环境",
    },
    tagline: {
      en: "More weight on environmental indicators.",
      th: "ให้น้ำหนักตัวชี้วัดสิ่งแวดล้อมมากขึ้น",
      zh: "提高环境指标的权重。",
    },
    flavour: {
      en: "This is not a climate-safety rating. Check seasonal air quality, local flooding and heat at the intended site.",
      th: "ไม่ใช่ระดับความปลอดภัยจากภูมิอากาศ ควรตรวจอากาศตามฤดูกาล น้ำท่วม และความร้อน ณ พื้นที่จริง",
      zh: "这不是气候安全评级；请核查目标地点的季节性空气、洪水及高温风险。",
    },
    weights: { livability: 10, economy: 5, safety: 10, wellbeing: 10, environment: 40, hospitality: 15, digital: 10 },
  },
  {
    id: "learning",
    label: { en: "Learning", th: "การเรียนรู้", zh: "学习" },
    tagline: { en: "Daily life, digital access and wellbeing around a place of study.", th: "ชีวิตประจำวัน การเข้าถึงดิจิทัล และคุณภาพชีวิตรอบสถานศึกษา", zh: "考察学习地点周边的日常生活、数字接入及福祉。" },
    flavour: { en: "This index does not rank teaching quality. Compare course accreditation, admission, tuition, housing and the actual campus separately.", th: "ดัชนีนี้ไม่ได้จัดอันดับคุณภาพการสอน ควรตรวจการรับรองหลักสูตร การรับเข้า ค่าเล่าเรียน ที่พัก และวิทยาเขตจริงแยกกัน", zh: "本指数不对教学质量排名；须另查课程认证、录取、学费、住宿及实际校区。" },
    weights: { livability: 25, economy: 10, safety: 15, wellbeing: 20, environment: 10, hospitality: 5, digital: 15 },
  },
  {
    id: "visiting",
    label: { en: "Visiting & leisure", th: "ท่องเที่ยวและพักผ่อน", zh: "旅行与休闲" },
    tagline: { en: "More weight on hospitality, safety, environment and livability.", th: "ให้น้ำหนักการต้อนรับ ความปลอดภัย สิ่งแวดล้อม และความน่าอยู่มากขึ้น", zh: "提高接待条件、安全、环境及宜居的权重。" },
    flavour: { en: "Check season, transport, opening hours and total trip cost. Scores do not confirm current availability or conditions.", th: "ควรตรวจฤดูกาล การเดินทาง เวลาเปิด และค่าใช้จ่ายทั้งทริป คะแนนไม่ได้ยืนยันบริการหรือสภาพปัจจุบัน", zh: "请核查季节、交通、开放时间及旅行总费用；评分不证明当前服务可用或现场状况。" },
    weights: { livability: 20, economy: 5, safety: 20, wellbeing: 10, environment: 20, hospitality: 20, digital: 5 },
  },
];

export function computePresetScore(city: SmartCity, lens: PresetLens): number {
  if (lens.id === "balanced") return city.compositeScore;
  const weightedPillarSum =
    (city.scores.livability * lens.weights.livability +
      city.scores.economy * lens.weights.economy +
      city.scores.safety * lens.weights.safety +
      city.scores.wellbeing * lens.weights.wellbeing +
      city.scores.environment * lens.weights.environment +
      city.scores.hospitality * lens.weights.hospitality +
      city.scores.digital * lens.weights.digital) /
    100;
  // Every lens is the displayed weight profile, with no hidden city or metric bonus.
  return Math.min(100, Math.max(0, weightedPillarSum));
}

export function getPresetById(id: string): PresetLens {
  return PRESET_LENSES.find(p => p.id === id) ?? PRESET_LENSES[0];
}
