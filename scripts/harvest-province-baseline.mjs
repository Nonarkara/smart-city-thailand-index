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
  // PCD's Bangkok-area file uses the short form "กรุงเทพ" for the province.
  "กรุงเทพ": "Bangkok",
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
  // NSO spells several provinces differently from table to table. Each of
  // these variants was silently dropping a province from EVERY indicator it
  // appeared in, because a label that is not in this map is skipped:
  //   เพชรบรูณ์  — Phetchabun in the household survey (the standard form
  //                เพชรบูรณ์ is used by the permits and ICT tables)
  //   สุราษฏร์ธานี — Surat Thani in the labour force table (ฏ instead of ฎ)
  //   ศรีษะเกษ  — Sisaket in the building permits table (ษ instead of ส)
  //   ราชบุรี / อุตรดิตถ์ — the forms used by the ICT and household tables
  "เพชรบรูณ์": "Phetchabun", "สุราษฏร์ธานี": "Surat Thani", "ศรีษะเกษ": "Sisaket",
  "ราชบุรี": "Ratchaburi", "อุตรดิตถ์": "Uttaradit",
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
  // NSO ordinal prefix, written two ways: "10) กรุงเทพมหานคร" (the ICT
  // tables) and "10 ) กรุงเทพมหานคร" (the building permits table). Only the
  // first form was handled, which dropped the second form's rows.
  v = v.replace(/^\s*\d+\s*\)\s*/, "");
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
    // Scored under Smart Economy, not Smart People: a population movement
    // statistic measures the dynamism of a labour market, not the capability
    // of the citizens. The dimension here must match the engine's.
    dimension: "economy",
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
    // Scored under Smart Economy, not Smart People — same reasoning as the
    // internal migration series above.
    dimension: "economy",
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
      // NSO relabelled the labour-force statuses at 2568Q1: "1.1 มีงานทำ"
      // became "ผู้มีงานทำ" and "1.2 ผู้ว่างงาน" became "ผู้ว่างงาน".
      // Filtering on the older labels alone silently pinned this indicator
      // to 2567Q4 — seven quarters stale — while its note still claimed the
      // latest quarter. Both spellings are accepted so the newest quarter
      // actually wins.
      LABOR_FORCE_STATUS: ["1.1 มีงานทำ", "1.2 ผู้ว่างงาน", "ผู้มีงานทำ", "ผู้ว่างงาน"],
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
  /* ── The ICT province table changes meaning mid-series. ───────────────
     `ICTH_37_4_Table_31` carries ONE value column, `Pop_use_In`. Up to the
     2565Q4 vintage it holds the PROVINCE POPULATION. From 2566Q1 it holds
     the number of INTERNET USERS. The proof is exact, not inferred: for
     every vintage the 77 province values sum to the region table's
     `Pop_Total` (population) before the flip and to its `Pop_use_In`
     (users) after it — 0.00% deviation either way.

     The mobile table never flipped: `Pop_use_Mo` has always held users
     (the same identity holds for every vintage from 2558 onward).

     So the three ICT indicators are pinned to the vintages where the
     arithmetic is sound:
       population @2565Q4  — the last population vintage
       internet users @2566Q1 — the first users vintage, one quarter later
       mobile users @2565Q4 — the same quarter as the population, so that
                              ratio is a pure same-vintage penetration rate
     Both pairings reproduce NSO's own published penetration rate to within
     0.08 percentage points (internet) and 0.00 (mobile). Pairing the newest
     users vintage against the frozen province population produces 10-14
     provinces over 100%, so it is deliberately not used. */
  {
    id: "nso-province-population",
    dataset: "0505_16_1040",
    table: "ICTH_37_4_Table_31",
    label: { en: "Province population (ICT survey base)", th: "ประชากรจังหวัด (ฐานประชากรตามสำรวจ ICT)" },
    dimension: "people",
    unit: "thousand people",
    yearColumn: "year", geoColumn: "province", valueColumn: "Pop_use_In",
    filters: {}, aggregate: "last",
    pinPeriod: "2565Q4",
    note: "NSO ICT Household Survey, province totals. This is the LAST vintage in which " +
          "the province table's value column holds population rather than users.",
  },
  {
    id: "nso-internet-users",
    dataset: "0505_16_1040",
    table: "ICTH_37_4_Table_31",
    label: { en: "Population using the internet", th: "ประชากรที่ใช้อินเทอร์เน็ต" },
    dimension: "people",
    unit: "thousand people",
    yearColumn: "year", geoColumn: "province", valueColumn: "Pop_use_In",
    filters: {}, aggregate: "last",
    pinPeriod: "2566Q1",
    note: "NSO ICT Household Survey, province totals. From this vintage the province " +
          "table's value column holds USERS, not population. Pair with the 2565Q4 " +
          "province population for a penetration rate.",
  },
  {
    id: "nso-mobile-users",
    dataset: "0505_16_1046",
    table: "ICTH_37_10_Table_31",
    label: { en: "Population using mobile phones", th: "ประชากรที่ใช้โทรศัพท์มือถือ" },
    dimension: "people",
    unit: "thousand people",
    yearColumn: "year", geoColumn: "province", valueColumn: "Pop_use_Mo",
    filters: {}, aggregate: "last",
    pinPeriod: "2565Q4",
    note: "NSO ICT Household Survey, province totals. This column has always held users. " +
          "The same quarter as the province population, so the ratio is a same-vintage " +
          "penetration rate that reproduces NSO's own published figure exactly.",
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

/**
 * Fetch one NSO table, once. Several specs read the same table at different
 * pinned vintages — the ICT province table carries both the population and
 * the users series — and re-downloading it per spec would triple the load
 * on a public government endpoint for no reason.
 */
const tableCache = new Map();
async function fetchTable(table) {
  if (tableCache.has(table)) return tableCache.get(table);
  const csv = await get(`${API}?table=${table}&format=csv`);
  tableCache.set(table, csv);
  return csv;
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

/**
 * Parse a period cell. Two shapes appear in the NSO tables:
 *   "2569"    — an annual figure
 *   "2569Q2"  — a quarterly figure, quarter embedded in the year cell
 * Returns { iso, q } where q is null for an annual period.
 */
function parsePeriod(cell) {
  const s = String(cell ?? "").trim();
  const m = s.match(/^(\d{4})(?:Q(\d))?$/);
  if (!m) return null;
  const be = parseInt(m[1], 10);
  if (!Number.isFinite(be)) return null;
  return { iso: be > 2400 ? be - 543 : be, q: m[2] != null ? parseInt(m[2], 10) : null };
}

/**
 * Apply one indicator spec to a fetched table.
 *
 * The period can come from two shapes:
 *   - a dedicated quarterColumn next to a yearColumn (labour force), or
 *   - a single cell that embeds the quarter, e.g. "2569Q2" (ICT survey).
 * `pinPeriod` selects one exact period instead of the latest, which is how
 * the ICT survey's restated column is read at the vintage where it still
 * holds population.
 */
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

  // Resolve each row to a period.
  const periodOf = (r) => {
    if (cQ >= 0) {
      const y = beToIso(r[cY]);
      if (y == null) return null;
      return { iso: y, q: quarterNo(r[cQ]) ?? 0 };
    }
    return parsePeriod(r[cY]);
  };

  let maxYear = -Infinity, maxQ = -Infinity;
  for (const r of kept) {
    const p = periodOf(r);
    if (!p) continue;
    const q = p.q ?? 0;
    if (p.iso > maxYear || (p.iso === maxYear && q > maxQ)) { maxYear = p.iso; maxQ = q; }
  }
  if (maxYear === -Infinity) return null;

  // A pinned period overrides "latest". It is written as the raw cell text
  // so the spec reads exactly like the source.
  let wantIso = maxYear, wantQ = maxQ;
  if (spec.pinPeriod) {
    const cell = String(spec.pinPeriod).trim();
    const p = parsePeriod(cell);
    if (!p) return null;
    wantIso = p.iso;
    wantQ = p.q ?? 0;
  }

  // Group by province within the selected period, then aggregate.
  const groups = new Map();
  for (const r of kept) {
    const p = periodOf(r);
    if (!p) continue;
    if (p.iso !== wantIso) continue;
    if ((p.q ?? 0) !== wantQ) continue;
    const prov = toProvince(r[cG]);
    if (!prov) continue;
    const v = parseFloat(String(r[cV] ?? "").replace(/,/g, ""));
    if (!Number.isFinite(v)) continue;
    if (!groups.has(prov)) groups.set(prov, []);
    groups.get(prov).push(v);
  }
  if (groups.size < 40) return null;

  const provinces = {};
  for (const [prov, vals] of groups) {
    const total = vals.reduce((a, b) => a + b, 0);
    provinces[prov] = spec.aggregate === "sum" ? round1(total) : round1(vals[vals.length - 1]);
  }
  return {
    provinces,
    provinceCount: Object.keys(provinces).length,
    // The period actually used — the pinned one when a spec pins a period,
    // the newest otherwise. Reporting the newest here while reading an
    // older vintage would misdate the whole indicator.
    year: wantIso,
    quarter: wantQ >= 1 && wantQ <= 4 ? wantQ : null,
  };
}

const round1 = n => Math.round(n * 10) / 10;

/* ─────────────────────── Royal Forest Department (กรมป่าไม้) ───────────────────
   Forest area by province, published as a plain CSV on the department's own
   CKAN portal at data.forest.go.th.

   THE ENGLISH COLUMN IS MISALIGNED — DO NOT USE IT. The file carries a stale
   76-province English list, so the row for "อำนาจเจริญ" (Amnat Charoen) is
   labelled "Umnad Chareun" — the former name of Uttaradit — and every label
   after it is off by one. The Thai column is correct and complete for all 77
   current provinces, so the mapping below goes through PROVINCE_TH.

   The numbers were cross-checked against a second, independently published RFD
   file (2562-64e7.csv): all 77 provinces agree to the last decimal on the
   2564 forest area. Only the labels are stale.

   A cell reading "ไม่มีพื้นที่ป่าไม้" means the department records NO forest
   area for that province. That is a verified zero, not a missing value, and
   it is stored as 0. */

const RFD_FOREST_URL =
  "https://data.forest.go.th/dataset/46cf6f8b-dee3-42d8-9c38-02690af49cc0" +
  "/resource/3f9534d5-c30d-403a-a63c-3a2480331698/download/t2564-4.csv";
const RFD_FOREST_VINTAGE = 2021; // BE 2564

async function harvestRfdForest() {
  const csv = await get(RFD_FOREST_URL);
  const rows = parseCsv(csv);
  // Two header rows: a Thai/English caption row, then the column names.
  const provinces = {};
  for (const r of rows.slice(2)) {
    if (r.length < 4) continue;
    const th = String(r[0] ?? "").trim();
    if (!th || th.startsWith("ภาค") || th.includes("รวมทั้งประเทศ")) continue;
    const canonical = PROVINCE_TH[th];
    if (!canonical) continue;
    const raw = String(r[3] ?? "").trim();
    const value = raw.includes("ไม่มี") ? 0 : parseFloat(raw.replace(/,/g, ""));
    if (!Number.isFinite(value)) continue;
    provinces[canonical] = round1(value);
  }
  const count = Object.keys(provinces).length;
  if (count < 70) throw new Error(`RFD forest: only ${count} provinces parsed`);
  return {
    id: "rfd-forest-coverage",
    label: { en: "Forest area as a share of province area", th: "สัดส่วนพื้นที่ป่าต่อพื้นที่จังหวัด" },
    dimension: "environment",
    unit: "%",
    publisher: "กรมป่าไม้และสัตว์ป่า / RFD — Royal Forest Department",
    dataset: "46cf6f8b-dee3-42d8-9c38-02690af49cc0",
    table: "t2564-4.csv",
    catalogUrl: "https://data.forest.go.th/dataset/46cf6f8b-dee3-42d8-9c38-02690af49cc0",
    includes: "Province rows only; the department's own % of province area",
    aggregate: "last",
    year: RFD_FOREST_VINTAGE,
    quarter: null,
    provinceCount: count,
    note: "Royal Forest Department province forest statistics, BE 2564 (2021). " +
          "The file's English province column is a stale 76-province list and is " +
          "deliberately ignored; the Thai column is used instead. Provinces with no " +
          "recorded forest area are a verified zero, not a gap.",
    provinces,
  };
}

/* ── Pollution Control Department — provincial PM2.5 ────────────────────── */

/**
 * PCD publishes annual PM2.5 as STATIONS, split across three files:
 * provincial stations, Bangkok-area stations, and Bangkok-metropolitan
 * stations. The provincial file deliberately omits the Bangkok area, so all
 * three are needed to reach a complete province list.
 *
 * The province value is the arithmetic mean of that province's station
 * annual averages. The source publishes no province total, so the aggregation
 * is ours and is stated in the note and in `includes`. Every station value is
 * kept in `stations` so the mean can be re-derived by hand.
 *
 * Two row kinds are excluded:
 *   "ค่ามาตรฐาน" rows — the regulatory standard, not a measurement.
 *   The "กรุงเทพมหานคร/สมุทรปราการ" row — one physical station that serves
 *   both provinces and is already listed in the Bangkok-area file.
 */
const PCD_DATASET = "fc3b51fd-91e3-4788-8241-32d418e636d4";
const PCD_PM25_VINTAGE = 2024; // BE 2567
const PCD_PM25_FILES = [
  { resource: "e8ccae77-4d23-498c-8115-bccff5fd45e0", file: "prov_2024_pm2.5.csv", area: "provincial stations" },
  { resource: "bbd8076b-7fc5-46e4-af84-c5005048d022", file: "bkk-amb_2024_pm2.5.csv", area: "Bangkok area stations" },
  { resource: "08a04166-1e75-4c03-a117-4bedcdfdb360", file: "bma_2024_pm2.5.csv", area: "Bangkok metropolitan stations" },
];

async function harvestPcdPm25() {
  const stationValues = {};
  const stationCounts = {};
  for (const f of PCD_PM25_FILES) {
    const url =
      `https://pcd.gdcatalog.go.th/dataset/${PCD_DATASET}/resource/${f.resource}/download/${f.file}`;
    const rows = parseCsv(await get(url));
    const header = rows[0] ?? [];
    const iProv = header.indexOf("Province");
    const iStation = header.indexOf("Station");
    const iYear = header.findIndex((h) => /24hr1y/.test(h));
    if (iProv < 0 || iStation < 0 || iYear < 0) {
      throw new Error(`PCD ${f.file}: expected Province/Station/24hr1y columns`);
    }
    for (const r of rows.slice(1)) {
      if (r.length <= Math.max(iProv, iStation, iYear)) continue;
      const prov = String(r[iProv] ?? "").trim();
      const station = String(r[iStation] ?? "").trim();
      // The regulatory standard, not a measurement.
      if (prov === "ค่ามาตรฐาน" || station === "มาตรฐาน") continue;
      // One physical station serving two provinces; already in the Bangkok file.
      if (prov.includes("/")) continue;
      const canonical = PROVINCE_TH[prov];
      if (!canonical) continue;
      const value = parseFloat(String(r[iYear] ?? ""));
      if (!Number.isFinite(value)) continue;
      if (!stationValues[canonical]) stationValues[canonical] = [];
      stationValues[canonical].push(value);
      stationCounts[canonical] = (stationCounts[canonical] ?? 0) + 1;
    }
  }

  const provinces = {};
  const stations = {};
  for (const [canonical, vals] of Object.entries(stationValues)) {
    provinces[canonical] = round1(vals.reduce((a, b) => a + b, 0) / vals.length);
    stations[canonical] = vals.map((v) => round1(v));
  }
  const count = Object.keys(provinces).length;
  if (count < 60) throw new Error(`PCD PM2.5: only ${count} provinces parsed`);

  const totalStations = Object.values(stations).reduce((a, s) => a + s.length, 0);
  return {
    id: "pcd-pm25-annual",
    label: { en: "Annual PM2.5 concentration", th: "ค่าเฉลี่ยความเข้มข้น PM2.5 รายปี" },
    dimension: "environment",
    unit: "µg/m³",
    publisher: "พด. / PCD — Pollution Control Department",
    dataset: PCD_DATASET,
    table: PCD_PM25_FILES.map((f) => f.file).join(" + "),
    catalogUrl: "https://data.go.th/dataset/" + PCD_DATASET,
    includes:
      "Every PCD monitoring station in the province, across the provincial, " +
      "Bangkok-area and Bangkok-metropolitan files; province value is the mean " +
      "of the station annual averages",
    aggregate: "mean",
    year: PCD_PM25_VINTAGE,
    quarter: null,
    provinceCount: count,
    note:
      `Pollution Control Department annual average 24-hour PM2.5, BE 2567 (2024), ` +
      `published with data date 31 March 2025, across ${totalStations} stations in ` +
      `${count} provinces. The source publishes stations, not a province total, so the ` +
      `province value is the arithmetic mean of its stations' annual averages; the ` +
      `station values are stored alongside so the mean can be checked by hand. ` +
      `Rows labelled "ค่ามาตรฐาน" are the regulatory standard and are excluded, as is ` +
      `the single combined Bangkok/Samut Prakan station that also appears in the ` +
      `Bangkok-area file.`,
    provinces,
    stations,
  };
}

/* ────────────────────────────── run ────────────────────────────────────── */
const NSO_PUBLISHER = "สศ. / NSO — National Statistical Office";

const results = [];
for (const spec of SPECS) {
  try {
    const csv = await fetchTable(spec.table);
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

// Royal Forest Department — a different publisher, a different host, and a
// different file shape, so it is harvested by its own function rather than
// by the NSO cube spec machinery.
try {
  const rfd = await harvestRfdForest();
  results.push({ direct: rfd });
  const vals = Object.values(rfd.provinces);
  console.log(
    `  ✓ ${rfd.id.padEnd(26)} n=${String(rfd.provinceCount).padStart(2)}  ` +
    `${rfd.year}  ${Math.min(...vals)}–${Math.max(...vals)} ${rfd.unit}`,
  );
} catch (e) {
  console.log(`  ✗ rfd-forest-coverage  ${e.message}`);
}

// Pollution Control Department — a third publisher, and a different province
// aggregation (a mean over stations rather than a single published figure).
try {
  const pcd = await harvestPcdPm25();
  results.push({ direct: pcd });
  const vals = Object.values(pcd.provinces);
  const nStations = Object.values(pcd.stations).reduce((a, s) => a + s.length, 0);
  console.log(
    `  ✓ ${pcd.id.padEnd(26)} n=${String(pcd.provinceCount).padStart(2)}  ` +
    `${pcd.year}  ${Math.min(...vals)}–${Math.max(...vals)} ${pcd.unit}  ` +
    `(${nStations} stations)`,
  );
} catch (e) {
  console.log(`  ✗ pcd-pm25-annual  ${e.message}`);
}

/* ─────────────────────────── emit the TS module ────────────────────────── */

const ts = `/**
 * PROVINCE BASELINE — harvested ${new Date().toISOString().slice(0, 10)}
 * =====================================================================
 * Generated by scripts/harvest-province-baseline.mjs. DO NOT HAND-EDIT.
 *
 * Every value below was fetched from a Thai government machine-readable
 * source and carries, per indicator: the publisher, the dataset id, the data
 * table, the cube members included, how the rest was aggregated, the period,
 * and the source URL. A reader can reproduce any number.
 *
 * Three publishers so far:
 *   สศ. / NSO   — National Statistical Office, via catalogapi.nso.go.th
 *   กรมป่าไม้ / RFD — Royal Forest Department, via data.forest.go.th
 *   พด. / PCD   — Pollution Control Department, via pcd.gdcatalog.go.th
 *
 * The data is COMMITTED, not fetched at build time — the site must never
 * depend on a government API being up.
 *
 * Note the vintages. The six household-survey indicators are 2010; the digital
 * indicators are 2022-2023; forest cover is 2021; PM2.5 is 2024. That spread is
 * real and is surfaced in the UI rather than hidden.
 *
 * Source: https://catalog.nso.go.th  ·  https://catalogapi.nso.go.th  ·  https://data.forest.go.th  ·  https://data.go.th
 */

export interface BaselineIndicator {
  id: string;
  label: { en: string; th: string };
  dimension: "environment" | "mobility" | "living" | "people" | "energy" | "economy" | "governance";
  unit: string;
  /** Who published it. */
  publisher: string;
  /** Dataset id, e.g. 0703_01_33 */
  dataset: string;
  /** Data table, e.g. OS_01_00061_01 */
  table: string;
  /** The catalogue page a reader can open. */
  catalogUrl: string;
  /** Which cube members were included, stated in plain text. */
  includes: string;
  /** How the remaining members were combined within a province-period. */
  aggregate: "sum" | "last" | "mean";
  /** Latest period covered. */
  year: number;
  quarter: number | null;
  provinceCount: number;
  note: string;
  /** Province name (English) -> value. */
  provinces: Record<string, number>;
  /**
   * Province name (English) -> the source rows it was built from, for
   * indicators whose province value is an aggregation the publisher does not
   * itself publish (currently PM2.5: the station annual averages).
   */
  stations?: Record<string, number[]>;
}

export const PROVINCE_BASELINE: BaselineIndicator[] = ${JSON.stringify(
  results.map(r => r.direct ?? {
    id: r.spec.id,
    label: r.spec.label,
    dimension: r.spec.dimension,
    unit: r.spec.unit,
    publisher: NSO_PUBLISHER,
    dataset: r.spec.dataset,
    table: r.spec.table,
    catalogUrl: `${CATALOG}/${r.spec.dataset}`,
    includes: Object.entries(r.spec.filters ?? {})
      .map(([k, v]) => `${k} in [${v.join(" | ")}]`)
      .join("; ") || "all members",
    aggregate: r.spec.aggregate,
    year: r.ex.year,
    quarter: r.ex.quarter,
    provinceCount: r.ex.provinceCount,
    note: r.spec.note,
    provinces: r.ex.provinces,
  }),
  null,
  2,
)};

/** Fast lookup: indicator id -> province -> value. */
export const PROVINCE_BASELINE_BY_ID: Record<string, Record<string, number>> =
  Object.fromEntries(PROVINCE_BASELINE.map(i => [i.id, i.provinces]));

export const PROVINCE_BASELINE_INDICATORS = PROVINCE_BASELINE.map(i => i.id);
`;

const outPath = path.resolve(process.cwd(), "src/provinceBaselineData.ts");
fs.writeFileSync(outPath, ts);
console.log(`\n${results.length} indicators → ${outPath}`);
