/**
 * DERIVATION ENGINE — depa seven dimensions
 * =========================================
 *
 * Every dimension score in SCITI is COMPUTED here from named indicators.
 * Nothing is typed by hand. A score can only exist if a source produced a
 * number for it, and the engine always reports how much of the published
 * weight it actually covered.
 *
 * THE TWO SCALES
 * --------------
 *  - `target`  — absolute, anchored to a published target (WHO guideline,
 *                100% coverage, etc.). Comparable across years and provinces;
 *                a province's score does not move because another province
 *                changed. This is the scale a committee can defend.
 *  - `cohort`  — relative: the city's percentile among the provinces (or
 *                among the 118 cities) for that indicator. Used only where no
 *                meaningful target exists. Explicitly marked, because a
 *                cohort score is only meaningful relative to its cohort.
 *
 * MISSING DATA
 * ------------
 * A missing indicator is EXCLUDED and the remaining weights renormalised.
 * It is never imputed as zero, and never silently dropped: the returned
 * `coverage` says how much of the dimension's published weight was actually
 * observed. A dimension with no observed indicator returns null — not 0.
 * 0 would mean "measured and found terrible"; null means "not measured".
 *
 * WEIGHTS
 * -------
 * depa publishes seven dimensions but NO weights for them. The weights below
 * are SCITI's editorial choice and are labelled as such wherever they are
 * shown. They are not presented as official.
 *
 * Sources: src/provinceBaselineData.ts (harvested NSO province series),
 *          src/cityData.ts (per-city metrics, each carrying its own source).
 */

import type { SmartCity, CityMetrics } from "./types";
import { PROVINCE_BASELINE, PROVINCE_BASELINE_BY_ID, type BaselineIndicator } from "./provinceBaselineData";

export type DepaDimension =
  | "environment" | "mobility" | "living" | "people" | "energy" | "economy" | "governance";

export const DEPA_DIMENSION_ORDER: readonly DepaDimension[] = [
  "environment", "mobility", "living", "people", "energy", "economy", "governance",
];

export const DIMENSION_LABELS: Record<DepaDimension, { en: string; th: string; zh: string }> = {
  environment: { en: "Smart Environment", th: "สิ่งแวดล้อมอัจฉริยะ", zh: "智慧环境" },
  mobility:    { en: "Smart Mobility",    th: "การเดินทางและขนส่งอัจฉริยะ", zh: "智慧出行" },
  living:      { en: "Smart Living",      th: "การดำรงชีวิตอัจฉริยะ", zh: "智慧生活" },
  people:      { en: "Smart People",      th: "พลเมืองอัจฉริยะ", zh: "智慧市民" },
  energy:      { en: "Smart Energy",      th: "พลังงานอัจฉริยะ", zh: "智慧能源" },
  economy:     { en: "Smart Economy",     th: "เศรษฐกิจอัจฉริยะ", zh: "智慧经济" },
  governance:  { en: "Smart Governance",  th: "การบริหารภาครัฐอัจฉริยะ", zh: "智慧治理" },
};

/** Editorial weights. NOT official — depa publishes dimensions, not weights. */
export const DIMENSION_WEIGHTS: Record<DepaDimension, number> = {
  living: 20, economy: 20, environment: 15, mobility: 15, people: 15, governance: 10, energy: 5,
};

/* ─────────────────────────── province name aliases ──────────────────────── */

/** The repo writes a few provinces differently from NSO. */
const PROVINCE_ALIAS: Record<string, string> = {
  "Chon Buri": "Chonburi",
  "Lop Buri": "Lopburi",
  "Ayutthaya": "Phra Nakhon Si Ayutthaya",
  "Chainat": "Chai Nat",
  "Prachin Buri": "Prachinburi",
};

export function resolveProvince(name: string): string {
  return PROVINCE_ALIAS[name] ?? name;
}

/* ─────────────────────────────── scales ────────────────────────────────── */

export type Scale =
  /** Linear map from `worst` (0 points) to `best` (100 points). */
  | { kind: "target"; best: number; worst: number; note: string }
  /** Percentile within the observed cohort. */
  | { kind: "cohort"; note: string }
  /** The raw value is already a 0-100 score. */
  | { kind: "already"; note: string };

/* ───────────────────────────── indicators ──────────────────────────────── */

export type IndicatorOrigin = "province" | "city-metric" | "derived";

export interface IndicatorDef {
  id: string;
  label: { en: string; th: string; zh: string };
  dimension: DepaDimension;
  /** Weight inside its dimension. */
  weight: number;
  scale: Scale;
  origin: IndicatorOrigin;
  /** For province indicators: the id in provinceBaselineData. */
  provinceId?: string;
  /** For city-metric indicators: the CityMetrics key. */
  metricKey?: keyof CityMetrics;
  /** For derived indicators: how to compute it from other inputs. */
  derive?: (ctx: DeriveContext) => number | null;
  /** Where the number comes from, for display. */
  sourceNote: { en: string; th: string; zh: string };
  /** True when higher raw values are better. */
  higherIsBetter: boolean;
}

export interface DeriveContext {
  metrics: CityMetrics;
  /** The province this city sits in, canonical spelling. */
  province: string;
  /** Read a published province indicator, e.g. "nso-internet-users". */
  indicator: (id: string) => number | undefined;
}

/**
 * The indicator catalogue.
 *
 * Provenance rules followed here:
 *   - An indicator that is a percentage of households is scored against a
 *     0-100 target (100% of households is the maximum achievable).
 *   - An indicator with a published health guideline is scored against that
 *     guideline, not against the cohort.
 *   - An indicator with no meaningful ceiling is scored as a cohort
 *     percentile, and says so.
 */
export const INDICATORS: readonly IndicatorDef[] = [
  /* ── environment ── */
  {
    id: "pm25",
    label: { en: "PM2.5 concentration", th: "ความเข้มข้น PM2.5", zh: "PM2.5 浓度" },
    dimension: "environment",
    weight: 30,
    scale: { kind: "target", best: 5, worst: 50, note: "WHO 2021 annual guideline 5 µg/m³ is 100 points; 50 µg/m³ is 0." },
    origin: "province",
    provinceId: "pcd-pm25-annual",
    sourceNote: { en: "Pollution Control Department (PCD) 2024 provincial station averages.", th: "กรมควบคุมมลพิษษ (พด.) ค่าเฉลี่ยสถานีรายจังหวัด 2567", zh: "泰国污染控制厅 2024 省份监测站年均值" },
    higherIsBetter: false,
  },
  {
    id: "water-quality",
    label: { en: "Water quality index", th: "ดัชนีคุณภาพน้ำ", zh: "水质指数" },
    dimension: "environment",
    weight: 20,
    scale: { kind: "already", note: "PCD/ONEP index, already 0-100." },
    origin: "city-metric",
    metricKey: "waterQuality",
    sourceNote: { en: "PCD / ONEP water quality index.", th: "ดัชนีคุณภาพน้ำ พด./สพผ.", zh: "PCD/ONEP 水质指数" },
    higherIsBetter: true,
  },
  {
    id: "green-coverage",
    label: { en: "Green coverage", th: "สัดส่วนพื้นที่สีเขียว", zh: "绿地覆盖率" },
    dimension: "environment",
    weight: 20,
    scale: { kind: "target", best: 60, worst: 0, note: "60% green coverage is the 100-point mark; 0% is 0 points." },
    origin: "city-metric",
    metricKey: "greenCoverage",
    sourceNote: { en: "Royal Forest Department / provincial green-area reporting.", th: "กรมป่าไม้และสัตว์ป่า", zh: "泰国皇家林业厅" },
    higherIsBetter: true,
  },
  {
    id: "forest-coverage",
    label: { en: "Forest coverage", th: "สัดส่วนพื้นที่ป่า", zh: "森林覆盖率" },
    dimension: "environment",
    weight: 15,
    scale: { kind: "target", best: 60, worst: 0, note: "60% forest cover scores 100." },
    origin: "province",
    provinceId: "rfd-forest-coverage",
    sourceNote: { en: "Royal Forest Department province forest statistics, 2021.", th: "กรมป่าไม้และสัตว์ป่า สถิติพื้นที่ป่ารายจังหวัด 2564", zh: "泰国皇家林业厅 省级森林统计 2021" },
    higherIsBetter: true,
  },
  {
    id: "flood-resilience",
    label: { en: "Flood resilience", th: "ความทนทานต่อน้ำท่วม", zh: "抗洪韧性" },
    dimension: "environment",
    weight: 15,
    scale: { kind: "already", note: "GISTDA repeat-flood frequency factor, already 0-100 (higher = less flood-prone)." },
    origin: "city-metric",
    metricKey: "floodFrequencyScore",
    sourceNote: { en: "GISTDA repeat-flood 2005-2016 + DDPM.", th: "GISTDA น้ำท่วมซ้ำ 2558-2559 + ปภ.", zh: "GISTDA 重复洪泛 + 民防厅" },
    higherIsBetter: true,
  },

  /* ── mobility ── */
  {
    id: "road-safety",
    label: { en: "Road fatality rate", th: "อัตราการเสียชีวิตบนถนน", zh: "道路死亡率" },
    dimension: "mobility",
    weight: 70,
    scale: { kind: "target", best: 5, worst: 40, note: "WHO Decade of Action: ≤5 deaths per 100,000 scores 100; ≥40 scores 0." },
    origin: "derived",
    derive: ctx => {
      const deaths = ctx.indicator("rtddi-road-deaths");
      const pop = ctx.indicator("nso-province-population");
      if (deaths == null || pop == null || pop <= 0) return null;
      // The population series is in THOUSANDS, so deaths ÷ (pop × 1000) × 100,000
      // is deaths ÷ pop × 100.
      return (deaths / pop) * 100;
    },
    sourceNote: {
      en: "Integrated road-traffic death registry (2025) — deaths in the province where the crash happened ÷ NSO province population (Q4 2022), the same population base the rest of the baseline uses.",
      th: "ระบบบูรณาการข้อมูลการตายจากอุบัติเหตุทางถนน (2568) — ผู้เสียชีวิตในจังหวัดที่เกิดอุบัติเหตุ ÷ ประชากรจังหวัด สศ. (ไตรมาส 4/2565) ฐานประชากรเดียวกับทั้งระบบ",
      zh: "道路死亡综合登记系统（2025）— 事故发生地所在省份的死亡人数 ÷ 泰国统计局省份人口（2022Q4），与全站使用同一人口基数",
    },
    higherIsBetter: false,
  },
  // Mobility rests on ONE indicator, and now it reaches every city. The
  // integrated road-traffic death registry publishes a record per death with
  // the province the crash happened in, so the rate is a province series
  // rather than a hand-typed city metric. The motorcycle share of those
  // deaths is published as a browsable indicator but deliberately NOT scored:
  // a high motorcycle share reflects how a province travels, and scoring it
  // would systematically penalise rural provinces for being rural.
  //
  // Building permits used to sit here as a province-level backbone, but
  // residential construction is an economic activity, not a transport one —
  // depa's Smart Mobility is about moving people and goods, and a permit is
  // neither. It is scored under Economy.

  /* ── living ── */
  {
    id: "drinking-water",
    label: { en: "Access to clean drinking water", th: "การเข้าถึงน้ำดื่มสะอาด", zh: "清洁饮用水可及性" },
    dimension: "living",
    weight: 20,
    scale: { kind: "target", best: 100, worst: 40, note: "100% of households with clean water scores 100; 40% scores 0." },
    origin: "province",
    provinceId: "nso-drinking-water",
    sourceNote: { en: "NSO Household Socio-Economic Survey.", th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ.", zh: "NSO 家庭社会经济调查" },
    higherIsBetter: true,
  },
  {
    id: "hygienic-toilet",
    label: { en: "Access to a hygienic toilet", th: "การเข้าถึงส้วมถูกสุขลักษณะ", zh: "卫生厕所可及性" },
    dimension: "living",
    weight: 15,
    scale: { kind: "target", best: 100, worst: 80, note: "Near-ceiling nationally: 100% scores 100, 80% scores 0." },
    origin: "province",
    provinceId: "nso-hygienic-toilet",
    sourceNote: { en: "NSO Household Socio-Economic Survey.", th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ.", zh: "NSO 家庭社会经济调查" },
    higherIsBetter: true,
  },
  {
    id: "home-ownership",
    label: { en: "Home ownership rate", th: "สัดส่วนครัวเรือนที่เป็นเจ้าของที่อยู่อาศัย", zh: "住房自有率" },
    dimension: "living",
    weight: 15,
    scale: { kind: "target", best: 90, worst: 40, note: "90% ownership scores 100; 40% scores 0." },
    origin: "province",
    provinceId: "nso-home-ownership",
    sourceNote: { en: "NSO Household Socio-Economic Survey.", th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ.", zh: "NSO 家庭社会经济调查" },
    higherIsBetter: true,
  },
  {
    id: "housing-durability",
    label: { en: "Durable housing material", th: "วัสดุถาวรของที่อยู่อาศัย", zh: "住房材料耐久性" },
    dimension: "living",
    weight: 10,
    scale: { kind: "target", best: 0, worst: 10, note: "0% non-durable housing scores 100; 10% scores 0." },
    origin: "province",
    provinceId: "nso-non-durable-housing",
    sourceNote: { en: "NSO Household Socio-Economic Survey.", th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ.", zh: "NSO 家庭社会经济调查" },
    higherIsBetter: false,
  },
  {
    id: "personal-safety",
    label: { en: "Personal safety (crime exposure)", th: "ความปลอดภัยส่วนบุคคล", zh: "个人安全（犯罪暴露）" },
    dimension: "living",
    weight: 20,
    scale: { kind: "cohort", note: "Percentile among cities — no published national target for crime exposure." },
    origin: "city-metric",
    metricKey: "crimeRatePer100k",
    sourceNote: { en: "Provincial crime records per 100,000 population.", th: "ข้อมูลอาชญากรรมรายจังหวัดต่อ 100,000", zh: "省级犯罪记录 /10万人口" },
    higherIsBetter: false,
  },
  {
    id: "health-access",
    label: { en: "Hospital beds per 10,000", th: "เตียงโรงพยาบาลต่อ 10,000 คน", zh: "每万人床位数" },
    dimension: "living",
    weight: 20,
    scale: { kind: "target", best: 40, worst: 5, note: "40 beds per 10,000 scores 100; 5 scores 0." },
    origin: "city-metric",
    metricKey: "hospitalBedsPer10k",
    sourceNote: { en: "Ministry of Public Health provincial facility reporting.", th: "กรมการแพทย์ รายจังหวัด", zh: "泰国卫生部 省级机构报告" },
    higherIsBetter: true,
  },

  /* ── people — depa: "citizens with knowledge and the ability to apply
        technology". Internet and mobile penetration measure that directly,
        and NSO publishes them for 2026.

        THE DENOMINATOR IS THE PROVINCE, NOT THE CITY.

        An earlier version of this file divided NSO's province-level user
        counts by `metrics.population` — a CITY-level figure. That is a
        category error: a province's users over a city's residents produced
        rates up to 9,922% and left 70 of 116 cities with no People score at
        all. NSO publishes the province population on the same projection
        basis as the survey, so the denominator is province population.

        The vintages are pinned, and the reason is in the source table.
        `ICTH_37_4_Table_31` has one value column, `Pop_use_In`: up to
        2565Q4 it holds POPULATION, from 2566Q1 it holds INTERNET USERS.
        The proof is exact — for every vintage the 77 province values sum to
        the region table's `Pop_Total` before the flip and to its
        `Pop_use_In` after it, 0.00% deviation either way. The mobile table
        never flipped; `Pop_use_Mo` has always held users.

        So: population is read at 2565Q4 (the last population vintage),
        internet users at 2566Q1 (the first users vintage) and mobile users
        at 2565Q4 (the same quarter as the population, which makes the
        mobile ratio a pure same-vintage rate). Both reproduce NSO's own
        published penetration rate to within 0.08 and 0.00 percentage
        points. Pairing the newest users vintage against the frozen
        province population instead pushes 10-14 provinces over 100%, so it
        is deliberately not done. */
  {
    id: "internet-penetration",
    label: { en: "Internet penetration", th: "สัดส่วนการใช้อินเทอร์เน็ต", zh: "互联网普及率" },
    dimension: "people",
    weight: 60,
    scale: { kind: "target", best: 95, worst: 30, note: "95% of the population online scores 100; 30% scores 0." },
    origin: "derived",
    derive: ctx => {
      const users = ctx.indicator("nso-internet-users");
      const pop = ctx.indicator("nso-province-population");
      if (users == null || pop == null || pop <= 0) return null;
      return (users / pop) * 100;
    },
    sourceNote: {
      en: "NSO ICT Household Survey — province internet users (Q1 2023) ÷ province population (Q4 2022), the survey's own population base.",
      th: "สำรวจ ICT ในครัวเรือน สศ. — ผู้ใช้อินเทอร์เน็ตรายจังหวัด (ไตรมาส 1/2566) ÷ ประชากรจังหวัด (ไตรมาส 4/2565)",
      zh: "NSO 家庭 ICT 调查 — 省级网民数（2023Q1）÷ 省级人口（2022Q4），即调查自身的人口基数",
    },
    higherIsBetter: true,
  },
  {
    id: "mobile-penetration",
    label: { en: "Mobile phone penetration", th: "สัดส่วนการใช้โทรศัพท์มือถือ", zh: "手机普及率" },
    dimension: "people",
    weight: 40,
    scale: { kind: "target", best: 98, worst: 40, note: "98% of the population with a mobile scores 100; 40% scores 0." },
    origin: "derived",
    derive: ctx => {
      const users = ctx.indicator("nso-mobile-users");
      const pop = ctx.indicator("nso-province-population");
      if (users == null || pop == null || pop <= 0) return null;
      return (users / pop) * 100;
    },
    sourceNote: {
      en: "NSO ICT Household Survey — province mobile-phone users (Q4 2022) ÷ province population (Q4 2022), the same survey quarter.",
      th: "สำรวจ ICT ในครัวเรือน สศ. — ผู้ใช้โทรศัพท์มือถือรายจังหวัด (ไตรมาส 4/2565) ÷ ประชากรจังหวัด (ไตรมาส 4/2565)",
      zh: "NSO 家庭 ICT 调查 — 省级手机用户数（2022Q4）÷ 省级人口（2022Q4），同一调查季度",
    },
    higherIsBetter: true,
  },

  /* ── economy — depa: business fluidity. People arriving from elsewhere are
        the clearest observable signal of a working regional labour market,
        so labour mobility sits here rather than under People. Construction
        activity sits here too: a residential permit is real-estate and
        construction business, not transport. ── */
  {
    id: "internal-migration",
    label: { en: "Internal mobility (moved within province)", th: "การย้ายถิ่นภายในจังหวัด", zh: "省内人口流动" },
    dimension: "economy",
    weight: 15,
    scale: { kind: "cohort", note: "Percentile among provinces — no published target." },
    origin: "province",
    provinceId: "nso-internal-migration",
    sourceNote: { en: "NSO Household Socio-Economic Survey.", th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ.", zh: "NSO 家庭社会经济调查" },
    higherIsBetter: true,
  },
  {
    id: "birth-place-mobility",
    label: { en: "Population living outside its birth province", th: "ประชากรที่อาศัยนอกจังหวัดภูมิเมืองเกิด", zh: "居住地非出生地的人口比例" },
    dimension: "economy",
    weight: 15,
    scale: { kind: "cohort", note: "Percentile among provinces — proxy for labour-market pull." },
    origin: "province",
    provinceId: "nso-born-elsewhere",
    sourceNote: { en: "NSO Household Socio-Economic Survey.", th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ.", zh: "NSO 家庭社会经济调查" },
    higherIsBetter: true,
  },
  {
    id: "building-permits",
    label: { en: "Residential building permits", th: "ใบอนุญาตก่อสร้างอาคารโรงเรือน", zh: "住宅建筑许可" },
    dimension: "economy",
    weight: 15,
    scale: { kind: "cohort", note: "Percentile among provinces — no published target exists for permit volume." },
    origin: "province",
    provinceId: "nso-residential-permits",
    sourceNote: { en: "NSO Building Permits (residential).", th: "ใบอนุญาตก่อสร้าง สศ.", zh: "NSO 建筑许可（住宅）" },
    higherIsBetter: true,
  },
  {
    id: "gdp-per-capita",
    label: { en: "GDP per capita", th: "จีดพีต่อหัว", zh: "人均 GDP" },
    dimension: "economy",
    weight: 25,
    scale: { kind: "cohort", note: "Percentile among cities — GDP per capita has no ceiling target." },
    origin: "city-metric",
    metricKey: "gppPerCapita",
    sourceNote: { en: "NESDC provincial accounts (GRPP per capita).", th: "สศ. บัญชีภาค/จังหวัด (GRPP ต่อหัว)", zh: "NESDC 省级账户（人均 GRPP）" },
    higherIsBetter: true,
  },
  {
    id: "gdp-growth",
    label: { en: "GDP growth rate", th: "อัตราการเติบโตของจีดพี", zh: "GDP 增长率" },
    dimension: "economy",
    weight: 15,
    scale: { kind: "cohort", note: "Percentile among cities." },
    origin: "city-metric",
    metricKey: "gppGrowthRate",
    sourceNote: { en: "NESDC year-on-year provincial growth.", th: "สศ. การเติบโตรายปีรายจังหวัด", zh: "NESDC 省级同比增速" },
    higherIsBetter: true,
  },
  {
    id: "fdi-inflow",
    label: { en: "FDI inflow", th: "เงินลงทุนจากต่างประเทศ", zh: "外国直接投资流入" },
    dimension: "economy",
    weight: 15,
    scale: { kind: "cohort", note: "Percentile among cities." },
    origin: "city-metric",
    metricKey: "fdiInflow",
    sourceNote: { en: "Board of Investment provincial awards.", th: "กรมเศรษฐกิจการลงทุน รายจังหวัด", zh: "泰国投资委员会 省级数据" },
    higherIsBetter: true,
  },
  {
    id: "informal-share",
    label: { en: "Informal share of the labour force", th: "สัดส่วนแรงงานนอกระบบต่อกำลังแรงงาน", zh: "非正规就业占比" },
    dimension: "economy",
    weight: 25,
    scale: { kind: "target", best: 0, worst: 40, note: "0% informal labour scores 100; 40% scores 0." },
    origin: "derived",
    derive: ctx => {
      const informal = ctx.indicator("nso-informal-labour");
      const total = ctx.indicator("nso-labour-force");
      if (informal == null || total == null || total <= 0) return null;
      return (informal / total) * 100;
    },
    sourceNote: { en: "Derived: NSO informal employment ÷ NSO labour force, same province.", th: "คำนวณ: แรงงานนอกระบบ สศ. ÷ กำลังแรงงาน สศ.", zh: "推导：NSO 非正规就业 ÷ NSO 劳动力" },
    higherIsBetter: false,
  },
  {
    id: "informal-count",
    label: { en: "Informal labour force", th: "แรงงานนอกระบบ", zh: "非正规就业人口" },
    dimension: "economy",
    weight: 20,
    scale: { kind: "cohort", note: "Percentile among provinces." },
    origin: "province",
    provinceId: "nso-informal-labour",
    sourceNote: { en: "NSO Informal Employment Survey.", th: "สำรวจแรงงานนอกระบบ สศ.", zh: "NSO 非正规就业调查" },
    higherIsBetter: false,
  },

  /* ── energy — depa: smart energy. Measured on the scale of a province's
        electrified economy: that is what the Ministry of Energy publishes
        per province, and it is what separates a wired-up city from a
        powered one. It is a SCALE measure, not an efficiency measure — a
        province can score well here and badly on Environment, and the
        dimension says so rather than pretending otherwise.

        The residential share of the grid is published and browsable but
        deliberately NOT scored, on the same principle as the motorcycle
        share of road deaths: it is a structural descriptor (Samut Sakhon's
        grid serves factories, Uthai Thani's serves homes), and scoring it
        would reward a province for having no industry. ── */
  {
    id: "electricity-per-capita",
    label: { en: "Electricity consumed per person", th: "ปริมาณการใช้ไฟฟ้าต่อหัวประชากร", zh: "人均用电量" },
    dimension: "energy",
    weight: 100,
    scale: { kind: "cohort", note: "Percentile among provinces — no published target exists for electricity per person." },
    origin: "province",
    provinceId: "moe-electricity-per-capita",
    sourceNote: {
      en: "Ministry of Energy province electricity consumption, 2023 (PEA + MEA reporting, re-tabulated by the Ministry), ÷ NSO province population, 2022.",
      th: "การใช้ไฟฟ้ารายจังหวัด สำนักงานปลัดกระทรวงพลังงาน 2566 (ข้อมูล กฟภ. และ กนช.) ÷ ประชากรจังหวัด สศ. 2565",
      zh: "能源部省级用电量 2023（PEA+MEA 上报）÷ 统计局省级人口 2022",
    },
    higherIsBetter: true,
  },

  /* ── governance — depa: smart governance. Thailand publishes NO
        province-level e-government index; that is not a gap in SCITI's
        searching, it is a gap in the national statistics. So this dimension
        measures the one slice of Thai public administration that IS
        published per province and IS machine-readable: what the provincial
        administration has published to the national open-data portal, and
        whether it published DATA or DOCUMENTS.

        It is labelled as exactly that — digital transparency capacity — and
        the methodology page says plainly that it is not an e-government
        index. What was probed and rejected is written down in
        src/baselineSources.ts, so the absence is a finding, not a shrug. ── */
  {
    id: "open-data-volume",
    label: { en: "Open datasets published by the province", th: "ชุดข้อมูลเปิดที่จังหวัดเผยแพร่", zh: "省级开放数据集数量" },
    dimension: "governance",
    weight: 60,
    scale: { kind: "cohort", note: "Percentile among provinces — no published target exists for open-data volume." },
    origin: "province",
    provinceId: "data-go-th-open-datasets",
    sourceNote: {
      en: "data.go.th — datasets published by the provincial administration organisation, counted from the government open-data portal, 2026.",
      th: "data.go.th — จำนวนชุดข้อมูลที่สำนักงานจังหวัดเผยแพร่บนแพลตฟอร์มข้อมูลเปิดภาครัฐ 2569",
      zh: "data.go.th — 省级管理机构在国家开放数据门户发布的数据集数量，2026",
    },
    higherIsBetter: true,
  },
  {
    id: "open-data-usability",
    label: { en: "Open data published as a data table", th: "ข้อมูลเปิดที่เผยแพร่เป็นตารางข้อมูล", zh: "以数据表形式发布的开放数据" },
    dimension: "governance",
    weight: 40,
    scale: { kind: "cohort", note: "Percentile among provinces — the share of a province's published datasets that carry a downloadable CSV." },
    origin: "province",
    provinceId: "data-go-th-open-data-tabular",
    sourceNote: {
      en: "data.go.th — share of the province's published datasets that carry a downloadable CSV data table rather than a document, 2026.",
      th: "data.go.th — สัดส่วนชุดข้อมูลของจังหวัดที่มีไฟล์ CSV ให้ดาวน์โหลด 2569",
      zh: "data.go.th — 该省已发布数据集中附带可下载 CSV 的比例，2026",
    },
    higherIsBetter: true,
  },
];

/* ─────────────────────────────── the engine ────────────────────────────── */

export interface IndicatorContribution {
  id: string;
  label: { en: string; th: string; zh: string };
  raw: number | null;
  score: number | null;
  weight: number;
  scaleNote: string;
  source: { en: string; th: string; zh: string };
  /** True when the score came from a cohort percentile rather than a target. */
  relative: boolean;
}

export interface DimensionResult {
  dimension: DepaDimension;
  /** null when nothing could be measured — NOT zero. */
  score: number | null;
  /** Share of the dimension's published weight that was actually observed. */
  coverage: number;
  contributions: IndicatorContribution[];
}

export interface CityDerivation {
  cityId: string;
  dimensions: Record<DepaDimension, DimensionResult>;
  /** Weighted composite over the dimensions that could be scored. */
  composite: number | null;
  /** Share of the TOTAL published weight the composite covers. */
  weightCoverage: number;
  /** Dimensions with no measurable data. */
  unscored: DepaDimension[];
  tier: "alpha" | "beta" | "gamma" | null;
}

function percentileOf(sorted: number[], v: number): number {
  if (sorted.length === 0) return 50;
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < v) lo = mid + 1; else hi = mid;
  }
  // mid = first index with value >= v
  const below = lo;
  const equal = sorted.filter(x => x === v).length;
  const rank = below + (equal - 1) / 2;
  return (rank / Math.max(1, sorted.length - 1)) * 100;
}

/** Apply a scale to a raw value, using the cohort when the scale needs it. */
function applyScale(
  scale: Scale,
  raw: number,
  cohortSorted: number[] | undefined,
): { score: number; relative: boolean } {
  if (scale.kind === "already") {
    return { score: Math.max(0, Math.min(100, raw)), relative: false };
  }
  if (scale.kind === "target") {
    const { best, worst } = scale;
    const span = best - worst;
    if (span === 0) return { score: 50, relative: false };
    const t = (raw - worst) / span;
    return { score: Math.max(0, Math.min(100, t * 100)), relative: false };
  }
  if (!cohortSorted || cohortSorted.length === 0) return { score: 50, relative: true };
  return { score: Math.max(0, Math.min(100, percentileOf(cohortSorted, raw))), relative: true };
}

/** Read a raw indicator value for a city. */
function rawValue(
  ind: IndicatorDef,
  ctx: DeriveContext,
): number | null {
  if (ind.derive) {
    const v = ind.derive(ctx);
    return v == null || !Number.isFinite(v) ? null : v;
  }
  if (ind.provinceId) {
    const v = ctx.indicator(ind.provinceId);
    return v == null || !Number.isFinite(v) ? null : v;
  }
  if (ind.metricKey) {
    const v = ctx.metrics[ind.metricKey];
    if (typeof v !== "number" || !Number.isFinite(v)) return null;
    // 0 is a legitimate value for some metrics but "omit when unknown, reserve
    // 0 for verified zero" — so 0 is kept, and absence is undefined.
    return v;
  }
  return null;
}

/**
 * Build the cohort for every cohort-scaled indicator. Called once for the
 * whole city set so all percentiles are relative to the same population.
 */
export function buildCohort(cities: SmartCity[]): Map<string, number[]> {
  const cohort = new Map<string, number[]>();
  for (const ind of INDICATORS) {
    if (ind.scale.kind !== "cohort") continue;
    const vals: number[] = [];
    for (const city of cities) {
      const ctx = makeContext(city);
      const v = rawValue(ind, ctx);
      if (v != null) vals.push(v);
    }
    cohort.set(ind.id, vals.sort((a, b) => a - b));
  }
  return cohort;
}

function makeContext(city: SmartCity): DeriveContext {
  const province = resolveProvince(city.province);
  const metrics = city.metrics ?? {};
  return {
    metrics,
    province,
    indicator: (id: string) => {
      const map = PROVINCE_BASELINE_BY_ID[id];
      if (!map) return undefined;
      return map[province];
    },
  };
}

/** Derive every dimension for one city. */
export function deriveCity(city: SmartCity, cohort: Map<string, number[]>): CityDerivation {
  const ctx = makeContext(city);
  const dimensions = {} as Record<DepaDimension, DimensionResult>;

  for (const dim of DEPA_DIMENSION_ORDER) {
    const defs = INDICATORS.filter(i => i.dimension === dim && i.weight > 0);
    const contributions: IndicatorContribution[] = [];
    let weightSum = 0, scoreSum = 0, observedWeight = 0;

    for (const ind of defs) {
      const raw = rawValue(ind, ctx);
      const cohortSorted = cohort.get(ind.id);
      let score: number | null = null;
      let relative = ind.scale.kind === "cohort";
      if (raw != null) {
        const applied = applyScale(ind.scale, raw, cohortSorted);
        score = Math.round(applied.score * 10) / 10;
        relative = applied.relative;
        weightSum += ind.weight;
        scoreSum += score * ind.weight;
        observedWeight += ind.weight;
      }
      contributions.push({
        id: ind.id,
        label: ind.label,
        raw,
        score,
        weight: ind.weight,
        scaleNote: ind.scale.note,
        source: ind.sourceNote,
        relative,
      });
    }

    const publishedWeight = defs.reduce((s, i) => s + i.weight, 0);
    dimensions[dim] = {
      dimension: dim,
      score: weightSum > 0 ? Math.round((scoreSum / weightSum) * 10) / 10 : null,
      // A dimension with no weighted indicator at all (energy, governance)
      // has no published weight to cover, so coverage is 0 — not 1, and never
      // a division by zero.
      coverage: publishedWeight > 0 ? observedWeight / publishedWeight : 0,
      contributions,
    };
  }

  // Composite: weighted over the dimensions that could be scored, and the
  // weight actually covered is reported alongside.
  let composite = 0, coveredWeight = 0, totalWeight = 0, observedWeight = 0;
  const unscored: DepaDimension[] = [];
  for (const dim of DEPA_DIMENSION_ORDER) {
    const w = DIMENSION_WEIGHTS[dim];
    totalWeight += w;
    const s = dimensions[dim].score;
    if (s == null) { unscored.push(dim); continue; }
    composite += s * w;
    coveredWeight += w;
    // A dimension that was scored from only some of its indicators does not
    // contribute its full weight to what was actually measured. This is the
    // share of the published weight that rests on real observations, which is
    // strictly less than the share of dimensions that happened to be scorable.
    observedWeight += w * dimensions[dim].coverage;
  }

  const compositeValue = coveredWeight > 0 ? Math.round((composite / coveredWeight) * 10) / 10 : null;
  return {
    cityId: city.id,
    dimensions,
    composite: compositeValue,
    /**
     * Share of the TOTAL published weight that rests on actual observations.
     *
     * A dimension with no score contributes 0. A dimension scored from only
     * some of its indicators contributes only that share. So this number is
     * what a reader wants to know: how much of this city's ranking is
     * measured data rather than absence.
     */
    weightCoverage: totalWeight > 0 ? observedWeight / totalWeight : 0,
    unscored,
    tier: compositeValue == null ? null
      : compositeValue >= 65 ? "alpha"
      : compositeValue >= 45 ? "beta"
      : "gamma",
  };
}

/** All derivations for a city set, in one pass. */
export function deriveAll(cities: SmartCity[]): Map<string, CityDerivation> {
  const cohort = buildCohort(cities);
  const out = new Map<string, CityDerivation>();
  for (const city of cities) out.set(city.id, deriveCity(city, cohort));
  return out;
}

/** The indicator catalogue as published, for the methodology page. */
export function publishedIndicators(): IndicatorDef[] {
  return [...INDICATORS];
}

export { PROVINCE_BASELINE };
export type { BaselineIndicator };
