/**
 * BASELINE FACETS — browsable province-level indicators
 * ======================================================
 *
 * The point of the Committee brief is that a city official can open SCITI,
 * pick their province, and see where they stand against the country on
 * measures that actually exist. So every real indicator becomes a facet:
 * filterable, sourced, dated, and honest about coverage.
 *
 * Every facet carries:
 *   - the raw value for a city
 *   - the cohort range, so a slider can be bounded to real data
 *   - how many of the 118 cities have a value at all
 *   - the source, including the vintage
 *
 * A facet with 0 coverage is not published — it would be a filter that
 * silently returns nothing.
 */

import type { SmartCity } from "./types";
import { NSO_BASELINE_BY_ID, NSO_BASELINE } from "./nsoBaselineData";
import { resolveProvince, type DepaDimension } from "./dimensionScores";

export interface FacetDef {
  id: string;
  label: { en: string; th: string; zh: string };
  dimension: DepaDimension;
  unit: string;
  /** Where the numbers come from, with the year they stop at. */
  source: { en: string; th: string; zh: string };
  /** The year the series ends. */
  vintage: string;
  /** Coherent cohort range across the cities that have a value. */
  min: number;
  max: number;
  /** How many of the 118 cities have a value. */
  coverage: number;
  /** Value for one city, or null when unknown. */
  value: (city: SmartCity) => number | null;
}

function nsoValue(id: string) {
  const map = NSO_BASELINE_BY_ID[id];
  if (!map) return undefined;
  return (province: string) => map[resolveProvince(province)];
}

function nsoMeta(id: string) {
  return NSO_BASELINE.find(i => i.id === id);
}

/** Build the facet catalogue for a set of cities, with real cohort ranges. */
export function buildFacets(cities: SmartCity[]): FacetDef[] {
  const defs: Omit<FacetDef, "min" | "max" | "coverage">[] = [
    {
      id: "drinking-water",
      label: { en: "Clean drinking water", th: "น้ำดื่มสะอาด", zh: "清洁饮用水" },
      dimension: "living",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % of households with access",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ของครัวเรือนที่มีน้ำดื่มสะอาด",
        zh: "NSO 家庭社会经济调查 — 有清洁饮用水接入的家庭比例",
      },
      vintage: String(nsoMeta("nso-drinking-water")?.year ?? ""),
      value: c => nsoValue("nso-drinking-water")?.(c.province) ?? null,
    },
    {
      id: "hygienic-toilet",
      label: { en: "Hygienic toilet", th: "ส้วมถูกสุขลักษณะ", zh: "卫生厕所" },
      dimension: "living",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % of households with a hygienic toilet",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ของครัวเรือนที่มีส้วมถูกสุขลักษณะ",
        zh: "NSO 家庭社会经济调查 — 有卫生厕所的家庭比例",
      },
      vintage: String(nsoMeta("nso-hygienic-toilet")?.year ?? ""),
      value: c => nsoValue("nso-hygienic-toilet")?.(c.province) ?? null,
    },
    {
      id: "home-ownership",
      label: { en: "Home ownership", th: "การเป็นเจ้าของที่อยู่อาศัย", zh: "住房自有率" },
      dimension: "living",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % of households owning their dwelling",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ของครัวเรือนที่เป็นเจ้าของที่อยู่อาศัย",
        zh: "NSO 家庭社会经济调查 — 自有住房家庭比例",
      },
      vintage: String(nsoMeta("nso-home-ownership")?.year ?? ""),
      value: c => nsoValue("nso-home-ownership")?.(c.province) ?? null,
    },
    {
      id: "non-durable-housing",
      label: { en: "Non-durable housing material", th: "วัสดุไม่ถาวร", zh: "非耐久住房材料" },
      dimension: "living",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % of households in non-durable housing",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ของครัวเรือนที่ใช้วัสดุไม่ถาวร",
        zh: "NSO 家庭社会经济调查 — 使用非耐久材料住房的家庭比例",
      },
      vintage: String(nsoMeta("nso-non-durable-housing")?.year ?? ""),
      value: c => nsoValue("nso-non-durable-housing")?.(c.province) ?? null,
    },
    {
      id: "internal-migration",
      label: { en: "Moved within province (5 yrs)", th: "ย้ายถิ่นภายในจังหวัด 5 ปี", zh: "5 年内省内迁移" },
      dimension: "people",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % who moved within the province in 5 years",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ที่ย้ายถิ่นภายในจังหวัดใน 5 ปี",
        zh: "NSO 家庭社会经济调查 — 5 年内省内迁移人口比例",
      },
      vintage: String(nsoMeta("nso-internal-migration")?.year ?? ""),
      value: c => nsoValue("nso-internal-migration")?.(c.province) ?? null,
    },
    {
      id: "born-elsewhere",
      label: { en: "Living outside birth province", th: "อาศัยนอกจังหวัดภูมิเมืองเกิด", zh: "居住地非出生地" },
      dimension: "people",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % not living in their province of birth",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ที่ไม่ได้อาศัยอยู่ในจังหวัดที่เกิด",
        zh: "NSO 家庭社会经济调查 — 居住地非出生地人口比例",
      },
      vintage: String(nsoMeta("nso-born-elsewhere")?.year ?? ""),
      value: c => nsoValue("nso-born-elsewhere")?.(c.province) ?? null,
    },
    {
      id: "residential-permits",
      label: { en: "Residential building permits", th: "ใบอนุญาตก่อสร้างอาคารโรงเรือน", zh: "住宅建筑许可" },
      dimension: "economy",
      unit: "permits",
      source: {
        en: "NSO Building Permits — residential permits granted",
        th: "ใบอนุญาตก่อสร้าง สศ. — ใบอนุญาตก่อสร้างอาคารโรงเรือน",
        zh: "NSO 建筑许可 — 住宅建设许可数",
      },
      vintage: String(nsoMeta("nso-residential-permits")?.year ?? ""),
      value: c => nsoValue("nso-residential-permits")?.(c.province) ?? null,
    },
    {
      id: "labour-force",
      label: { en: "Labour force", th: "กำลังแรงงานรวม", zh: "劳动力总数" },
      dimension: "economy",
      unit: "thousand",
      source: {
        en: "NSO Labour Force Survey — employed + unemployed, both sexes, latest quarter",
        th: "สำรวจกำลังแรงงาน สศ. — มีงานทำ + ว่างงาน ทั้งเพศ ไตรมาสล่าสุด",
        zh: "NSO 劳动力调查 — 就业+失业，两性，最新季度",
      },
      vintage: nsoMeta("nso-labour-force")
        ? `${nsoMeta("nso-labour-force")!.year}Q${nsoMeta("nso-labour-force")!.quarter ?? ""}`
        : "",
      value: c => nsoValue("nso-labour-force")?.(c.province) ?? null,
    },
    {
      id: "informal-labour",
      label: { en: "Informal labour force", th: "แรงงานนอกระบบ", zh: "非正规就业人口" },
      dimension: "economy",
      unit: "thousand",
      source: {
        en: "NSO Informal Employment Survey — both sexes, all age groups",
        th: "สำรวจแรงงานนอกระบบ สศ. — ทั้งเพศ ทุกช่วงอายุ",
        zh: "NSO 非正规就业调查 — 两性，全年龄",
      },
      vintage: String(nsoMeta("nso-informal-labour")?.year ?? ""),
      value: c => nsoValue("nso-informal-labour")?.(c.province) ?? null,
    },
    {
      id: "internet-users",
      label: { en: "Population using the internet", th: "ประชากรที่ใช้อินเทอร์เน็ต", zh: "网民人数" },
      dimension: "governance",
      unit: "thousand",
      source: {
        en: "NSO ICT Household Survey — population using the internet, province total",
        th: "สำรวจ ICT ในครัวเรือน สศ. — จำนวนประชากรที่ใช้อินเทอร์เน็ต รายจังหวัด",
        zh: "NSO 家庭 ICT 调查 — 省级网民人口",
      },
      vintage: String(nsoMeta("nso-internet-users")?.year ?? ""),
      value: c => nsoValue("nso-internet-users")?.(c.province) ?? null,
    },
    {
      id: "mobile-users",
      label: { en: "Population using mobile phones", th: "ประชากรที่ใช้โทรศัพท์มือถือ", zh: "手机用户人口" },
      dimension: "governance",
      unit: "thousand",
      source: {
        en: "NSO ICT Household Survey — population using mobile phones, province total",
        th: "สำรวจ ICT ในครัวเรือน สศ. — จำนวนประชากรที่ใช้โทรศัพท์มือถือ รายจังหวัด",
        zh: "NSO 家庭 ICT 调查 — 省级手机用户人口",
      },
      vintage: String(nsoMeta("nso-mobile-users")?.year ?? ""),
      value: c => nsoValue("nso-mobile-users")?.(c.province) ?? null,
    },
    {
      id: "gdp-per-capita",
      label: { en: "GDP per capita", th: "จีดพีต่อหัว", zh: "人均 GDP" },
      dimension: "economy",
      unit: "THB",
      source: {
        en: "NESDC provincial accounts — GRPP per capita",
        th: "สศ. บัญชีภาค/จังหวัด — GRPP ต่อหัว",
        zh: "NESDC 省级账户 — 人均 GRPP",
      },
      vintage: "2026",
      value: c => c.metrics?.gppPerCapita ?? null,
    },
    {
      id: "pm25",
      label: { en: "PM2.5", th: "PM2.5", zh: "PM2.5" },
      dimension: "environment",
      unit: "µg/m³",
      source: {
        en: "Pollution Control Department — annual provincial mean",
        th: "กรมควบคุมมลพิษษ — ค่าเฉลี่ยรายจังหวัดต่อปี",
        zh: "泰国污染控制厅 — 省份年均值",
      },
      vintage: "2026",
      value: c => c.metrics?.pm25Annual ?? null,
    },
    {
      id: "road-fatality",
      label: { en: "Road deaths per 100,000", th: "ผู้เสียชีวิตบนถนนต่อ 100,000", zh: "每10万道路死亡" },
      dimension: "mobility",
      unit: "per 100k",
      source: {
        en: "thairsc.com — provincial road deaths per 100,000 population",
        th: "thairsc.com — ผู้เสียชีวิตบนถนนรายจังหวัดต่อ 100,000 คน",
        zh: "thairsc.com — 省级每10万人口道路死亡",
      },
      vintage: "2026",
      value: c => c.metrics?.roadFatalityRate ?? null,
    },
  ];

  // Compute the real cohort range and coverage for each facet.
  return defs.map(def => {
    const values = cities
      .map(c => def.value(c))
      .filter((v): v is number => v != null && Number.isFinite(v));
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    return { ...def, min, max, coverage: values.length };
  });
}

/** A facet filter state: facet id -> [min, max] selected range. */
export type FacetSelection = Record<string, [number, number]>;

export function matchesFacets(city: SmartCity, facets: FacetDef[], selection: FacetSelection): boolean {
  for (const [id, range] of Object.entries(selection)) {
    const facet = facets.find(f => f.id === id);
    if (!facet) continue;
    const v = facet.value(city);
    if (v == null) return false; // unknown value cannot satisfy a range filter
    if (v < range[0] || v > range[1]) return false;
  }
  return true;
}
