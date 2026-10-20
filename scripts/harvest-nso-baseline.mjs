/**
 * NSO baseline harvester — SCITI 7-dimension baseline program
 * ===========================================================
 *
 * Pulls province-level indicators from the National Statistical Office and
 * emits them as a committed TypeScript module with full provenance.
 *
 * WHY THIS IS DECLARATIVE, NOT A GENERIC SCRAPER
 * ----------------------------------------------
 * NSO tables are cubes, not flat series. The labour-force table is
 * YEAR x QUARTER x REGION x PROVINCE x SEX x LABOR_FORCE_STATUS x VALUE. A
 * generic "latest row per province" grab silently returns one arbitrary cell
 * of that cube — during development it returned Nakhon Ratchasima's
 * "seasonally-waiting labour force" (20.96 thousand) instead of its labour
 * force, because that happened to be the last matching row.
 *
 * So every indicator below states, in readable form, exactly which cube
 * members are included and how the remainder is aggregated. A committee
 * member can read the spec and know precisely what the number is.
 *
 * THE ENDPOINT HAS TWO TRAPS
 * --------------------------
 *   1. `catalogapi.nso.go.th` sits behind CloudWAF, which fingerprints the
 *      TLS client. Node's undici handshake is refused (HTTP 200 with a
 *      3-byte body, or 418); curl's is accepted. This script shells out to
 *      curl rather than using fetch.
 *   2. The dataset registry REQUIRES `&div=1`. Without it the API answers
 *      200 with a bare UTF-8 BOM — an empty CSV, not an error. The harvester
 *      treats a suspiciously tiny body as a failure.
 *
 * Output: src/nsoBaselineData.ts  (committed — the site never calls a live
 * government API at build or run time).
 *
 * Run: node scripts/harvest-nso-baseline.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const API = "https://catalogapi.nso.go.th/api/index";
const CATALOG = "https://catalog.nso.go.th/dataset";

/* ─────────────────────────── the 77 provinces ─────────────────────────── */

const PROVINCE_TH = {
  "กรุงเทพมหานคร": "Bangkok", "กรุงเทพฯ": "Bangkok",
  "อำนาจเจริญ": "Amnat Charoen", "อ่างทอง": "Ang Thong", "บึงกาฬ": "Bueng Kan",
  "บุรีรัมย์": "Buriram", "ฉะเชิงเทรา": "Chachoengsao", "ชัยนาท": "Chai Nat",
  "ชัยภูมิ": "Chaiyaphum", "จันทบุรี": "Chanthaburi", "เชียงใหม่": "Chiang Mai",
  "เชียงราย": "Chiang Rai", "ชลบุรี": "Chonburi", "ชุมพร": "Chumphon",
  "กาฬสินธุ์": "Kalasin", "กำแพงเพชร": "Kamphaeng Phet", "กาญจนบุรี": "Kanchanaburi",
  "ขอนแก่น": "Khon Kaen", "กระบี่": "Krabi", "ลำปาง": "Lampang", "ลำพูน": "Lamphun",
  "เลย": "Loei", "ลพบุรี": "Lopburi", "แม่ฮ่องสอน": "Mae Hong Son",
  "มหาสารคาม": "Maha Sarakham", "มุกดาหาร": "Mukdahan", "นครนายก": "Nakhon Nayok",
  "นครปฐม": "Nakhon Pathom", "นครพนม": "Nakhon Phanom", "นครราชสีมา": "Nakhon Ratchasima",
  "นครสวรรค์": "Nakhon Sawan", "นครศรีธรรมราช": "Nakhon Si Thammarat", "น่าน": "Nan",
  "นราธิวาส": "Narathiwat", "หนองบัวลำภู": "Nong Bua Lamphu", "หนองคาย": "Nong Khai",
  "นนทบุรี": "Nonthaburi", "ปทุมธานี": "Pathum Thani", "ปัตตานี": "Pattani",
  "พังงา": "Phang Nga", "พัทลุง": "Phatthalung", "พะเยา": "Phayao",
  "เพชรบูรณ์": "Phetchabun", "เพชรบุรี": "Phetchaburi", "พิจิตร": "Phichit",
  "พิษณุโลก": "Phitsanulok", "พระนครศรีอยุธยา": "Phra Nakhon Si Ayutthaya",
  "แพร่": "Phrae", "ภูเก็ต": "Phuket", "ปราจีนบุรี": "Prachinburi",
  "ประจวบคีรีขันธ์": "Prachuap Khiri Khan", "ระนอง": "Ranong", "ระยอง": "Rayong",
  "ร้อยเอ็ด": "Roi Et", "สระแก้ว": "Sa Kaeo", "สกลนคร": "Sakon Nakhon",
  "สมุทรปราการ": "Samut Prakan", "สมุทรสาคร": "Samut Sakhon", "สมุทรสงคราม": "Samut Songkhram",
  "สระบุรี": "Saraburi", "สตูล": "Satun", "สิงห์บุรี": "Sing Buri", "ศรีสะเกษ": "Sisaket",
  "สงขลา": "Songkhla", "สุโขทัย": "Sukhothai", "สุพรรณบุรี": "Suphan Buri",
  "สุราษฎร์ธานี": "Surat Thani", "สุรินทร์": "Surin", "ตาก": "Tak", "ตรัง": "Trang",
  "ตราด": "Trat", "อุบลราชธานี": "Ubon Ratchathani", "อุดรธานี": "Udon Thani",
  "อุทัยธานี": "Uthai Thani", "อุตราดินแทน": "Uttaradit", "ยะลา": "Yala",
  "ยโสธร": "Yasothon",
};

function toProvince(raw) {
  let v = String(raw ?? "").trim();
  v = v.replace(/^\d+\)\s*/, "");     // NSO ordinal prefix: "10) กรุงเทพมหานคร"
  v = v.replace(/^["']|["']$/g, "");
  v = v.trim();
  if (!v || v === "รวม" || v === "ทั่วประเทศ" || v === "ทั้งประเทศ") return null;
  return PROVINCE_TH[v] ?? null;
}

/* ───────────────────────────── the indicator specs ─────────────────────── */

/**
 * Each spec says exactly which cube members are in, and how the rest is
 * aggregated. `aggregate` is applied within one province for one period.
 */
const SPECS = [
  {
    id: "nso-drinking-water",
    dataset: "0703_01_33",
    table: "OS_01_00061_01",
    label: { en: "Households with access to clean drinking water", th: "ครัวเรือนที่มีน้ำดื่มสะอาด" },
    dimension: "living",
    unit: "%",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {}, aggregate: "last",
    note: "NSO Household Socio-Economic Survey. 46.4–99.9% across provinces.",
  },
  {
    id: "nso-hygienic-toilet",
    dataset: "0703_01_32",
    table: "OS_01_00060_01",
    label: { en: "Households with a hygienic toilet", th: "ครัวเรือนที่มีส้วมถูกสุขลักษณะ" },
    dimension: "living",
    unit: "%",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {}, aggregate: "last",
    note: "NSO Household Socio-Economic Survey. Near-ceiling countrywide (93.9–99.9%).",
  },
  {
    id: "nso-home-ownership",
    dataset: "0703_01_31",
    table: "OS_01_00059_01",
    label: { en: "Households that own their dwelling", th: "ครัวเรือนที่เป็นเจ้าของที่อยู่อาศัย" },
    dimension: "living",
    unit: "%",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {}, aggregate: "last",
    note: "NSO Household Socio-Economic Survey. 40.3–95.8%.",
  },
  {
    id: "nso-non-durable-housing",
    dataset: "0703_01_30",
    table: "OS_01_00058_01",
    label: { en: "Households in non-durable housing material", th: "ที่อยู่อาศัยที่ใช้วัสดุไม่ถาวร" },
    dimension: "living",
    unit: "%",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {}, aggregate: "last",
    note: "NSO Household Socio-Economic Survey. Lower is better. 0.1–11.2%.",
  },
  {
    id: "nso-internal-migration",
    dataset: "0703_01_18",
    table: "OS_01_00032_01",
    label: { en: "Population who moved within the province in 5 years", th: "ประชากรที่ย้ายถิ่นภายใน 5 ปี" },
    dimension: "people",
    unit: "%",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {}, aggregate: "last",
    note: "NSO Household Socio-Economic Survey. 3.1–29.4%.",
  },
  {
    id: "nso-born-elsewhere",
    dataset: "0703_01_19",
    table: "OS_01_00033_01",
    label: { en: "Population not living in their province of birth", th: "ประชากรที่ไม่ได้อาศัยอยู่ในจังหวัดที่เกิด" },
    dimension: "people",
    unit: "%",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {}, aggregate: "last",
    note: "NSO Household Socio-Economic Survey. Proxy for labour-market pull. 3.9–57.8%.",
  },
  {
    id: "nso-residential-permits",
    dataset: "os_12_00026",
    table: "OS_12_0026_01",
    label: { en: "Residential building permits granted", th: "ใบอนุญาตก่อสร้างอาคารโรงเรือน" },
    dimension: "economy",
    unit: "permits",
    yearColumn: "year", geoColumn: "province", valueColumn: "value",
    filters: {
      permission: ["สิ่งก่อสร้างที่เป็นอาคารโรงเรือน"],
      license_type: ["จำนวนผู้ได้รับอนุญาต (ราย)"],
    },
    aggregate: "sum",
    note: "NSO Building Permits. Count of residential permits, not floor area.",
  },
  {
    id: "nso-labour-force",
    dataset: "0706_02_0001",
    table: "ST_02_2005005_4",
    label: { en: "Total labour force (employed + unemployed)", th: "กำลังแรงงานรวม" },
    dimension: "economy",
    unit: "thousand people",
    yearColumn: "YEAR", geoColumn: "PROVINCE", valueColumn: "VALUE",
    filters: {
      LABOR_FORCE_STATUS: ["1.1 มีงานทำ", "1.2 ผู้ว่างงาน"],
      SEX: ["ชาย", "หญิง"],
    },
    quarterColumn: "QUARTER",
    aggregate: "sum",
    note: "NSO Labour Force Survey, quarterly. Employed + unemployed, both sexes, " +
          "latest quarter. Excludes seasonally-waiting labour by design.",
  },
  {
    id: "nso-informal-labour",
    dataset: "0706_02_0007",
    table: "OS_02_0007_04",
    label: { en: "Informal-sector labour force", th: "แรงงานนอกระบบ" },
    dimension: "economy",
    unit: "thousand people",
    yearColumn: "YEAR", geoColumn: "PROVINCE", valueColumn: "VALUE",
    filters: { SEX: ["ชาย", "หญิง"] },
    aggregate: "sum",
    note: "NSO Informal Employment Survey. Both sexes, all age groups, summed.",
  },
  {
    id: "nso-internet-users",
    dataset: "0505_16_1040",
    table: "ICTH_37_4_Table_31",
    label: { en: "Population using the internet", th: "ประชากรที่ใช้อินเทอร์เน็ต" },
    dimension: "digital",
    unit: "thousand people",
    yearColumn: "year", geoColumn: "province", valueColumn: "Pop_use_In",
    filters: {}, aggregate: "last",
    note: "NSO ICT Household Survey, province totals. Pair with population for a rate.",
  },
  {
    id: "nso-mobile-users",
    dataset: "0505_16_1046",
    table: "ICTH_37_10_Table_31",
    label: { en: "Population using mobile phones", th: "ประชากรที่ใช้โทรศัพท์มือถือ" },
    dimension: "digital",
    unit: "thousand people",
    yearColumn: "year", geoColumn: "province", valueColumn: "Pop_use_Mo",
    filters: {}, aggregate: "last",
    note: "NSO ICT Household Survey, province totals.",
  },
];

/* ───────────────────────────── plumbing ────────────────────────────────── */

const sleep = ms => new Promise(r => setTimeout(r, ms));

function curlText(url) {
  const res = spawnSync("curl", [
    "-sL", "--max-time", "60", "--compressed", "-A", UA, url,
  ], { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`curl exited ${res.status}`);
  const body = res.stdout ?? "";
  if (body.replace(/^﻿/, "").trim().length < 4) {
    throw new Error(`empty body (WAF or missing div=1) for ${url}`);
  }
  return body;
}

async function get(url) {
  let last;
  for (let i = 1; i <= 3; i++) {
    try { return curlText(url); }
    catch (e) { last = e; await sleep(700 * i); }
  }
  throw last;
}

/** RFC4180 CSV parser — NSO quotes fields that contain commas. */
function parseCsv(text) {
  const rows = [];
  let field = "", row = [], inQuotes = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/** Buddhist Era -> ISO. 2553 BE = 2010 CE. */
function beToIso(be) {
  const m = String(be ?? "").trim().match(/^(\d{4})/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (!Number.isFinite(n)) return null;
  return n > 2400 ? n - 543 : n;
}

/** "ไตรมาส 1".."ไตรมาส 4" -> 1..4 */
function quarterNo(q) {
  const m = String(q ?? "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Apply one indicator spec to a fetched table. */
function applySpec(csv, spec) {
  const rows = parseCsv(csv);
  if (rows.length < 2) return null;
  const hdr = rows[0].map(h => String(h).trim());
  const idx = n => hdr.findIndex(h => h.toLowerCase() === String(n).toLowerCase());
  const cY = idx(spec.yearColumn);
  const cG = idx(spec.geoColumn);
  const cV = idx(spec.valueColumn);
  if (cY < 0 || cG < 0 || cV < 0) return null;
  const cQ = spec.quarterColumn ? idx(spec.quarterColumn) : -1;

  const filterCols = Object.entries(spec.filters ?? {}).map(([k, v]) => [idx(k), v]);
  if (filterCols.some(([i]) => i < 0)) return null;

  // Keep only rows matching every filter.
  const kept = rows.slice(1).filter(r =>
    filterCols.every(([i, allowed]) => allowed.includes(String(r[i] ?? "").trim())),
  );
  if (kept.length === 0) return null;

  // Latest period: max year, then max quarter within that year.
  let maxYear = -Infinity, maxQ = -Infinity;
  for (const r of kept) {
    const y = beToIso(r[cY]);
    if (y == null) continue;
    const q = cQ >= 0 ? (quarterNo(r[cQ]) ?? 0) : 0;
    if (y > maxYear || (y === maxYear && q > maxQ)) { maxYear = y; maxQ = q; }
  }
  if (maxYear === -Infinity) return null;

  // Group by province within the latest period, then aggregate.
  const groups = new Map();
  for (const r of kept) {
    const y = beToIso(r[cY]);
    if (y !== maxYear) continue;
    if (cQ >= 0) {
      const q = quarterNo(r[cQ]) ?? 0;
      if (q !== maxQ) continue;
    }
    const p = toProvince(r[cG]);
    if (!p) continue;
    const v = parseFloat(String(r[cV] ?? "").replace(/,/g, ""));
    if (!Number.isFinite(v)) continue;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(v);
  }
  if (groups.size < 40) return null;

  const provinces = {};
  for (const [p, vals] of groups) {
    const total = vals.reduce((a, b) => a + b, 0);
    provinces[p] = spec.aggregate === "sum" ? round1(total) : round1(vals[vals.length - 1]);
  }
  return {
    provinces,
    provinceCount: Object.keys(provinces).length,
    year: maxYear,
    quarter: cQ >= 0 ? maxQ : null,
  };
}

const round1 = n => Math.round(n * 10) / 10;

/* ────────────────────────────── run ────────────────────────────────────── */

const results = [];
for (const spec of SPECS) {
  try {
    const csv = await get(`${API}?table=${spec.table}&format=csv`);
    const ex = applySpec(csv, spec);
    if (!ex) { console.log(`  ✗ ${spec.id}  no province-level series after filters`); continue; }
    results.push({ spec, ex });
    const vals = Object.values(ex.provinces);
    console.log(
      `  ✓ ${spec.id.padEnd(26)} n=${String(ex.provinceCount).padStart(2)}  ` +
      `${ex.year}${ex.quarter ? "Q" + ex.quarter : ""}  ` +
      `${Math.min(...vals)}–${Math.max(...vals)} ${spec.unit}`,
    );
  } catch (e) {
    console.log(`  ✗ ${spec.id}  ${e.message}`);
  }
}

/* ─────────────────────────── emit the TS module ────────────────────────── */

const ts = `/**
 * NSO PROVINCE BASELINE — harvested ${new Date().toISOString().slice(0, 10)}
 * =====================================================================
 * Generated by scripts/harvest-nso-baseline.mjs. DO NOT HAND-EDIT.
 *
 * Every value below was fetched from the National Statistical Office's
 * machine-readable API and carries, per indicator: the NSO dataset id, the
 * data table, the cube members included, how the rest was aggregated, the
 * period, and the source URL. A reader can reproduce any number.
 *
 * The data is COMMITTED, not fetched at build time — the site must never
 * depend on a government API being up.
 *
 * Note the vintages. The six household-survey indicators are 2010; the
 * digital indicators are 2026. That gap is real and is surfaced in the UI
 * rather than hidden.
 *
 * Source: https://catalog.nso.go.th  ·  https://catalogapi.nso.go.th
 */

export interface BaselineIndicator {
  id: string;
  label: { en: string; th: string };
  dimension: "environment" | "mobility" | "living" | "people" | "energy" | "economy" | "governance";
  unit: string;
  /** NSO dataset id, e.g. 0703_01_33 */
  dataset: string;
  /** NSO data table, e.g. OS_01_00061_01 */
  table: string;
  /** The NSO page a reader can open. */
  catalogUrl: string;
  /** Which cube members were included, stated in plain text. */
  includes: string;
  /** How the remaining members were combined within a province-period. */
  aggregate: "sum" | "last";
  /** Latest period covered. */
  year: number;
  quarter: number | null;
  provinceCount: number;
  note: string;
  /** Province name (English) -> value. */
  provinces: Record<string, number>;
}

export const NSO_BASELINE: BaselineIndicator[] = ${JSON.stringify(
  results.map(({ spec, ex }) => ({
    id: spec.id,
    label: spec.label,
    dimension: spec.dimension,
    unit: spec.unit,
    dataset: spec.dataset,
    table: spec.table,
    catalogUrl: `${CATALOG}/${spec.dataset}`,
    includes: Object.entries(spec.filters ?? {})
      .map(([k, v]) => `${k} in [${v.join(" | ")}]`)
      .join("; ") || "all members",
    aggregate: spec.aggregate,
    year: ex.year,
    quarter: ex.quarter,
    provinceCount: ex.provinceCount,
    note: spec.note,
    provinces: ex.provinces,
  })),
  null,
  2,
)};

/** Fast lookup: indicator id -> province -> value. */
export const NSO_BASELINE_BY_ID: Record<string, Record<string, number>> =
  Object.fromEntries(NSO_BASELINE.map(i => [i.id, i.provinces]));

export const NSO_BASELINE_INDICATORS = NSO_BASELINE.map(i => i.id);
`;

const outPath = path.resolve(process.cwd(), "src/nsoBaselineData.ts");
fs.writeFileSync(outPath, ts);
console.log(`\n${results.length} indicators → ${outPath}`);
