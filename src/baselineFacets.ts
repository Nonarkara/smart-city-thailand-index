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
import { PROVINCE_BASELINE_BY_ID, PROVINCE_BASELINE } from "./provinceBaselineData";
import { resolveProvince, type DepaDimension } from "./dimensionScores";

export interface FacetDef {
  id: string;
  label: { en: string; th: string; zh: string };
  dimension: DepaDimension;
  unit: string;
  /** The NSO indicator id behind this facet, when there is one. Lets the
   *  dimension of a facet be checked against the source record mechanically. */
  provinceId?: string;
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

function provinceValue(id: string) {
  const map = PROVINCE_BASELINE_BY_ID[id];
  if (!map) return undefined;
  return (province: string) => map[resolveProvince(province)];
}

function provinceMeta(id: string) {
  return PROVINCE_BASELINE.find(i => i.id === id);
}

/**
 * A province penetration rate: NSO's users for an indicator ÷ NSO's province
 * population, the survey's own population base.
 *
 * Both inputs are province-level, so the result is a province rate. It is
 * deliberately NOT a city-level population: NSO publishes the survey's users
 * by province, and dividing a province's users by one city's residents is a
 * category error that produces rates over 100%.
 */
function penetration(province: string, usersId: string): number | null {
  const users = provinceValue(usersId)?.(province);
  const pop = provinceValue("nso-province-population")?.(province);
  if (users == null || pop == null || pop <= 0) return null;
  return (users / pop) * 100;
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
      vintage: String(provinceMeta("nso-drinking-water")?.year ?? ""),
      provinceId: "nso-drinking-water",
      value: c => provinceValue("nso-drinking-water")?.(c.province) ?? null,
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
      vintage: String(provinceMeta("nso-hygienic-toilet")?.year ?? ""),
      provinceId: "nso-hygienic-toilet",
      value: c => provinceValue("nso-hygienic-toilet")?.(c.province) ?? null,
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
      vintage: String(provinceMeta("nso-home-ownership")?.year ?? ""),
      provinceId: "nso-home-ownership",
      value: c => provinceValue("nso-home-ownership")?.(c.province) ?? null,
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
      vintage: String(provinceMeta("nso-non-durable-housing")?.year ?? ""),
      provinceId: "nso-non-durable-housing",
      value: c => provinceValue("nso-non-durable-housing")?.(c.province) ?? null,
    },
    {
      id: "internal-migration",
      label: { en: "Moved within province (5 yrs)", th: "ย้ายถิ่นภายในจังหวัด 5 ปี", zh: "5 年内省内迁移" },
      // Scored under Smart Economy — the same placement the derivation
      // engine uses. Population movement measures a labour market, not
      // citizen capability.
      dimension: "economy",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % who moved within the province in 5 years",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ที่ย้ายถิ่นภายในจังหวัดใน 5 ปี",
        zh: "NSO 家庭社会经济调查 — 5 年内省内迁移人口比例",
      },
      vintage: String(provinceMeta("nso-internal-migration")?.year ?? ""),
      provinceId: "nso-internal-migration",
      value: c => provinceValue("nso-internal-migration")?.(c.province) ?? null,
    },
    {
      id: "born-elsewhere",
      label: { en: "Living outside birth province", th: "อาศัยนอกจังหวัดภูมิเมืองเกิด", zh: "居住地非出生地" },
      // Scored under Smart Economy — the same placement the derivation
      // engine uses.
      dimension: "economy",
      unit: "%",
      source: {
        en: "NSO Household Socio-Economic Survey — % not living in their province of birth",
        th: "สำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน สศ. — % ที่ไม่ได้อาศัยอยู่ในจังหวัดที่เกิด",
        zh: "NSO 家庭社会经济调查 — 居住地非出生地人口比例",
      },
      vintage: String(provinceMeta("nso-born-elsewhere")?.year ?? ""),
      provinceId: "nso-born-elsewhere",
      value: c => provinceValue("nso-born-elsewhere")?.(c.province) ?? null,
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
      vintage: String(provinceMeta("nso-residential-permits")?.year ?? ""),
      provinceId: "nso-residential-permits",
      value: c => provinceValue("nso-residential-permits")?.(c.province) ?? null,
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
      vintage: provinceMeta("nso-labour-force")
        ? `${provinceMeta("nso-labour-force")!.year}Q${provinceMeta("nso-labour-force")!.quarter ?? ""}`
        : "",
      provinceId: "nso-labour-force",
      value: c => provinceValue("nso-labour-force")?.(c.province) ?? null,
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
      vintage: String(provinceMeta("nso-informal-labour")?.year ?? ""),
      provinceId: "nso-informal-labour",
      value: c => provinceValue("nso-informal-labour")?.(c.province) ?? null,
    },
    {
      id: "internet-penetration",
      label: { en: "Internet penetration", th: "สัดส่วนการใช้อินเทอร์เน็ต", zh: "互联网普及率" },
      // depa defines Smart People as citizens able to apply technology, so
      // internet and mobile penetration are scored under People — the same
      // mapping the derivation engine uses. These two files must agree.
      dimension: "people",
      unit: "%",
      source: {
        en: "NSO ICT Household Survey — province internet users (Q1 2023) ÷ province population (Q4 2022)",
        th: "สำรวจ ICT ในครัวเรือน สศ. — ผู้ใช้อินเทอร์เน็ตรายจังหวัด (ไตรมาส 1/2566) ÷ ประชากรจังหวัด (ไตรมาส 4/2565)",
        zh: "NSO 家庭 ICT 调查 — 省级网民数（2023Q1）÷ 省级人口（2022Q4）",
      },
      vintage: `${provinceMeta("nso-internet-users")?.year ?? ""}Q${provinceMeta("nso-internet-users")?.quarter ?? ""}`,
      value: c => penetration(c.province, "nso-internet-users"),
    },
    {
      id: "mobile-penetration",
      label: { en: "Mobile phone penetration", th: "สัดส่วนการใช้โทรศัพท์มือถือ", zh: "手机普及率" },
      dimension: "people",
      unit: "%",
      source: {
        en: "NSO ICT Household Survey — province mobile users (Q4 2022) ÷ province population (Q4 2022)",
        th: "สำรวจ ICT ในครัวเรือน สศ. — ผู้ใช้โทรศัพท์มือถือรายจังหวัด (ไตรมาส 4/2565) ÷ ประชากรจังหวัด (ไตรมาส 4/2565)",
        zh: "NSO 家庭 ICT 调查 — 省级手机用户数（2022Q4）÷ 省级人口（2022Q4）",
      },
      vintage: `${provinceMeta("nso-mobile-users")?.year ?? ""}Q${provinceMeta("nso-mobile-users")?.quarter ?? ""}`,
      value: c => penetration(c.province, "nso-mobile-users"),
    },
    {
      id: "province-population",
      label: { en: "Province population", th: "ประชากรจังหวัด", zh: "省份人口" },
      dimension: "people",
      unit: "thousand",
      source: {
        en: "NSO ICT Household Survey — the survey's province population base (Q4 2022)",
        th: "สำรวจ ICT ในครัวเรือน สศ. — ฐานประชากรรายจังหวัด (ไตรมาส 4/2565)",
        zh: "NSO 家庭 ICT 调查 — 调查的省份人口基数（2022Q4）",
      },
      vintage: `${provinceMeta("nso-province-population")?.year ?? ""}Q${provinceMeta("nso-province-population")?.quarter ?? ""}`,
      value: c => provinceValue("nso-province-population")?.(c.province) ?? null,
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
        en: "Pollution Control Department — annual mean of the province's monitoring stations",
        th: "กรมควบคุมมลพิษษ — ค่าเฉลี่ยของสถานีตรวจวัดในจังหวัดต่อปี",
        zh: "泰国污染控制厅 — 省内监测站年均值",
      },
      vintage: String(provinceMeta("pcd-pm25-annual")?.year ?? ""),
      provinceId: "pcd-pm25-annual",
      value: c => provinceValue("pcd-pm25-annual")?.(c.province) ?? null,
    },
    {
      id: "forest-coverage",
      label: { en: "Forest coverage", th: "สัดส่วนพื้นที่ป่า", zh: "森林覆盖率" },
      dimension: "environment",
      unit: "%",
      source: {
        en: "Royal Forest Department — forest area as a share of province area",
        th: "กรมป่าไม้และสัตว์ป่า — สัดส่วนพื้นที่ป่าต่อพื้นที่จังหวัด",
        zh: "泰国皇家林业厅 — 森林面积占省域比例",
      },
      vintage: String(provinceMeta("rfd-forest-coverage")?.year ?? ""),
      provinceId: "rfd-forest-coverage",
      value: c => provinceValue("rfd-forest-coverage")?.(c.province) ?? null,
    },
    {
      id: "road-fatality",
      label: { en: "Road deaths per 100,000", th: "ผู้เสียชีวิตบนถนนต่อ 100,000", zh: "每10万道路死亡" },
      dimension: "mobility",
      unit: "per 100k",
      source: {
        en: "Integrated road-traffic death registry — deaths where the crash happened ÷ NSO province population",
        th: "ระบบบูรณาการข้อมูลการตายจากอุบัติเหตุทางถนน — ผู้เสียชีวิตที่จังหวัดที่เกิดเหตุ ÷ ประชากรจังหวัด สศ.",
        zh: "道路死亡综合登记系统 — 事故发生地省份的死亡人数 ÷ 统计局省份人口",
      },
      vintage: String(provinceMeta("rtddi-road-deaths")?.year ?? ""),
      provinceId: "rtddi-road-deaths",
      value: c => {
        const deaths = provinceValue("rtddi-road-deaths")?.(c.province);
        const pop = provinceValue("nso-province-population")?.(c.province);
        if (deaths == null || pop == null || pop <= 0) return null;
        return (deaths / pop) * 100;
      },
    },
    {
      id: "motorcycle-share",
      label: { en: "Motorcycle share of road deaths", th: "สัดส่วนผู้เสียชีวิตที่เป็นรถจักรยานยนต์", zh: "摩托车占道路死亡比例" },
      dimension: "mobility",
      unit: "%",
      source: {
        en: "Integrated road-traffic death registry — of road deaths with a recorded vehicle",
        th: "ระบบบูรณาการข้อมูลการตายจากอุบัติเหตุทางถนน — จากผู้เสียชีวิตที่มีการบันทึกประเภทพาหนะ",
        zh: "道路死亡综合登记系统 — 已记录车辆类型的道路死亡中",
      },
      vintage: String(provinceMeta("rtddi-motorcycle-share")?.year ?? ""),
      provinceId: "rtddi-motorcycle-share",
      value: c => provinceValue("rtddi-motorcycle-share")?.(c.province) ?? null,
    },
    {
      id: "electricity-per-capita",
      label: { en: "Electricity per person", th: "ไฟฟ้าที่ใช้ต่อหัวประชากร", zh: "人均用电量" },
      dimension: "energy",
      unit: "kWh/person",
      source: {
        en: "Ministry of Energy province electricity consumption, 2023 ÷ NSO province population, 2022",
        th: "การใช้ไฟฟ้ารายจังหวัด สำนักงานปลัดกระทรวงพลังงาน 2566 ÷ ประชากรจังหวัด สศ. 2565",
        zh: "能源部省级用电量 2023 ÷ 统计局省级人口 2022",
      },
      vintage: String(provinceMeta("moe-electricity-per-capita")?.year ?? ""),
      provinceId: "moe-electricity-per-capita",
      value: c => provinceValue("moe-electricity-per-capita")?.(c.province) ?? null,
    },
    {
      id: "residential-electricity-share",
      label: { en: "Share of the grid serving homes", th: "สัดส่วนไฟฟ้าที่ใช้ในบ้านอยู่อาศัย", zh: "居民用电占比" },
      dimension: "energy",
      unit: "%",
      source: {
        en: "Ministry of Energy province electricity consumption, 2023 — residential tariff class ÷ all tariff classes",
        th: "การใช้ไฟฟ้ารายจังหวัด สำนักงานปลัดกระทรวงพลังงาน 2566 — สาขาบ้านอยู่อาศัย ÷ ทุกสาขา",
        zh: "能源部省级用电量 2023 — 居民电价类别 ÷ 全部类别",
      },
      vintage: String(provinceMeta("moe-residential-electricity-share")?.year ?? ""),
      provinceId: "moe-residential-electricity-share",
      value: c => provinceValue("moe-residential-electricity-share")?.(c.province) ?? null,
    },
    {
      id: "open-datasets",
      label: { en: "Open datasets published", th: "ชุดข้อมูลเปิดที่เผยแพร่", zh: "已发布开放数据集" },
      dimension: "governance",
      unit: "datasets",
      source: {
        en: "data.go.th — datasets published by the provincial administration organisation",
        th: "data.go.th — ชุดข้อมูลที่สำนักงานจังหวัดเผยแพร่บนแพลตฟอร์มข้อมูลเปิดภาครัฐ",
        zh: "data.go.th — 省级管理机构在开放数据门户发布的数据集",
      },
      vintage: String(provinceMeta("data-go-th-open-datasets")?.year ?? ""),
      provinceId: "data-go-th-open-datasets",
      value: c => provinceValue("data-go-th-open-datasets")?.(c.province) ?? null,
    },
    {
      id: "open-data-tabular",
      label: { en: "Open data offered as a data table", th: "ข้อมูลเปิดที่เป็นตารางข้อมูล", zh: "以数据表形式发布的开放数据" },
      dimension: "governance",
      unit: "%",
      source: {
        en: "data.go.th — share of the province's published datasets carrying a downloadable CSV",
        th: "data.go.th — สัดส่วนชุดข้อมูลของจังหวัดที่มีไฟล์ CSV ให้ดาวน์โหลด",
        zh: "data.go.th — 该省已发布数据集中附带可下载 CSV 的比例",
      },
      vintage: String(provinceMeta("data-go-th-open-data-tabular")?.year ?? ""),
      provinceId: "data-go-th-open-data-tabular",
      value: c => provinceValue("data-go-th-open-data-tabular")?.(c.province) ?? null,
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
