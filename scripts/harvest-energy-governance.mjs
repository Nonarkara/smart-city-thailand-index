/**
 * ENERGY + GOVERNANCE harvester — SCITI 7-dimension baseline program
 * ====================================================================
 *
 * Closes the two dimensions that shipped as named gaps: Energy (0/118) and
 * Governance (0/118). Both now have real, province-level, open sources.
 *
 * ── ENERGY ──────────────────────────────────────────────────────────────
 * Publisher: สำนักงานปลัดกระทรัฐ / Office of the Permanent Secretary,
 *            Ministry of Energy (กองยุทธศาสตร์และแผนงาน).
 * Dataset:   "ข้อมูลการใช้ไฟฟ้ารายจังหวัดสาขา" — electricity consumed per
 *            province per tariff class, BE 2566 (2023), for all 77 provinces.
 *            The underlying numbers are PEA (การไฟฟ้าส่วนภูมิภาค) and MEA
 *            (การไฟฟ้านครหลวง) reporting, re-tabulated by the Ministry.
 *
 *   E1  electricity per person   = total kWh ÷ population
 *   E2  residential share        = residential kWh ÷ total kWh
 *
 * WHY THESE TWO
 * E1 is the standard energy-intensity-per-capita measure: it says how much
 * power each resident's economy draws. E2 says whether a province's grid
 * serves its people or its factories — the 10.4% (Samut Sakhon) to 52.0%
 * (Uthai Thani) spread is a real structural signal about where a city's
 * economic base sits, read through the energy channel rather than the
 * accounts.
 *
 * NOT USED, AND WHY
 *  - EGAT's public sales and production tables are national, split by
 *    utility, NOT by province. Verified against the EGAT catalogue: 15
 *    datasets, zero province-level.
 *  - The Energy Business Department's province fuel-sales files are monthly
 *    snapshots, and the province-level energy-consumption files stop at
 *    BE 2563 — vintage-mismatched against BE 2566 electricity, so a fuel
 *    ratio would mix periods. Excluded rather than fudged.
 *  - DEDE's renewable datasets are national by sector; its province-level
 *    renewable-potential layer ships only as maps (JPEG/PNG), not as
 *    machine-readable values. So no renewable share is claimed.
 *
 * ── GOVERNANCE ──────────────────────────────────────────────────────────
 * Publisher: กรมธุรกิจปฏิรูปและพัฒนาระบบคอมพิวเตอร์ / Government Data
 *            Management Office, which runs data.go.th, the national open-data
 *            portal, and the สำนักงานจังหวัด (provincial administration)
 *            organisations inside it.
 *
 *   G1  open datasets published  = datasets the provincial administration
 *                                  has published on the national portal
 *   G2  tabular share           = of those, the % that carry a downloadable
 *                                  CSV data table (i.e. published as DATA,
 *                                  not as a PDF document)
 *
 * WHY THESE, AND WHAT IS NOT CLAIMED
 * Thailand publishes NO province-level e-government index. That is not a
 * gap in SCITI's searching; it is a gap in the national statistics. DGA's
 * digital-government readiness score is agency-level, the ITA integrity
 * assessment is published per organisation (and only 76 provinces publish
 * one to the portal at all — Phichit 94 files, Rayong 1, Nan 0), and the
 * NSO citizen-satisfaction series (POS_01_Table_0002..0004) is national
 * only. Each was probed and rejected on the evidence.
 *
 * So Governance is measured by the one slice of Thai public administration
 * that IS published per province and IS machine-readable: open-data
 * publication. It is labelled as exactly that — digital transparency
 * capacity — and the UI says plainly that it is not an e-government index.
 *
 * TRAPS (all hit, all documented)
 *  1. The CKAN API sits behind a CloudWAF that fingerprints the TLS client:
 *     plain fetch is refused. curl with a browser User-Agent is accepted.
 *  2. Asking for 1,000 packages with their resources TIMES OUT (90s, 0
 *     bytes). `rows=0` count queries answer in milliseconds, so every
 *     governance number here is a COUNT query, never a bulk listing.
 *  3. The Ministry of Energy workbook is XLSX, which is a ZIP of XML. There
 *     is no xlsx dependency in this repo, so the sheet is read with `unzip`
 *     plus a small shared-strings reader — no new dependency, no guessing.
 *  4. The Ministry of Energy's own CKAN ids COLLIDE with data.go.th's ids:
 *     `dataset_41_07` is the electricity table on gdcatalog.energy.go.th
 *     and "จำนวนครัวเรือนยากจน" on data.go.th. Never resolve an id without
 *     naming the host.
 *
 * Output: src/energyGovernanceData.ts (committed — the site never calls a
 *         government API at build or run time).
 *
 * Run: node scripts/harvest-energy-governance.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { PROVINCE_TH } from "./lib/province-th.mjs";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const DATA_GO_TH = "https://data.go.th";
const ENERGY_CATALOG = "https://gdcatalog.energy.go.th";

/* ───────────────────────────── http ─────────────────────────────────────── */

function curl(url, { binary = false } = {}) {
  const r = spawnSync(
    "curl",
    ["-sL", "--max-time", "60", "-A", UA, ...(binary ? ["-o", "-"] : []), url],
    { encoding: binary ? "buffer" : "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  if (r.status !== 0) throw new Error(`curl failed (${r.status}) for ${url}`);
  return binary ? r.stdout : r.stdout;
}

function getJson(url) {
  const body = curl(url);
  const j = JSON.parse(body);
  if (!j.success) throw new Error(`API error for ${url}: ${JSON.stringify(j.error).slice(0, 200)}`);
  return j.result;
}

/* ────────────────────────── xlsx reader ─────────────────────────────────── */

/**
 * Read the first worksheet of an .xlsx into an array of arrays.
 * An xlsx is a ZIP; the sheet cells reference a shared string table by
 * index. No dependency needed for one rectangular table.
 */
function readXlsx(file) {
  const unzip = (...args) => {
    const r = spawnSync("unzip", ["-p", file, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (r.status !== 0) throw new Error(`unzip failed for ${file}`);
    return r.stdout;
  };
  const decode = s =>
    s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&amp;/g, "&");

  // Shared strings: <si>…<t>text</t>…</si> (a <t> may be split by <r> runs).
  const ssXml = unzip("xl/sharedStrings.xml");
  const shared = [];
  for (const si of ssXml.split("<si>").slice(1)) {
    const parts = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(m => decode(m[1]));
    shared.push(parts.join(""));
  }

  const sheetXml = unzip("xl/worksheets/sheet1.xml");
  const rows = [];
  for (const rowXml of sheetXml.split("<row ").slice(1)) {
    const cells = [];
    for (const m of rowXml.matchAll(/<c\s+r="([A-Z]+)(\d+)"([^>]*)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const col = m[1];
      const attrs = m[3] || "";
      const inner = m[4] || "";
      const v = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      let value = v === undefined ? "" : v;
      if (attrs.includes('t="s"')) value = shared[Number(value)] ?? "";
      else if (attrs.includes('t="inlineStr"')) {
        value = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => decode(x[1])).join("");
      } else if (value !== "") value = Number(value);
      // Column letters -> index (A=0, B=1, … AA=26).
      let idx = 0;
      for (const ch of col) idx = idx * 26 + (ch.charCodeAt(0) - 64);
      cells[idx - 1] = value;
    }
    for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = "";
    rows.push(cells);
  }
  return rows;
}

/* ─────────────────────── population (committed) ────────────────────────── */

/** NSO province population, read out of the committed baseline module. */
async function loadPopulation() {
  const esbuild = path.resolve("node_modules/.bin/esbuild");
  const tmp = path.resolve("node_modules/.cache/sciti-harvest/population.mjs");
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  spawnSync(esbuild, ["src/provinceBaselineData.ts", "--bundle", "--format=esm", "--outfile=" + tmp, "--log-level=error"], {
    stdio: "inherit",
  });
  const mod = await import(pathToFileURL(tmp).href);
  const pop = mod.PROVINCE_BASELINE_BY_ID["nso-province-population"];
  if (!pop) throw new Error("population series missing from the committed baseline");
  return pop;
}

/* ───────────────────────────── main ─────────────────────────────────────── */

const ENERGY_DATASET = "7fc9e90f-0433-4612-81ab-7f1d689f9271";
const ENERGY_RESOURCE_66 = "0d386dd4-ee5e-439a-8c6c-10e1f5dfd010";
const ENERGY_CATALOG_URL = `${ENERGY_CATALOG}/dataset/${ENERGY_DATASET}`;
const ENERGY_XLSX_URL = `${ENERGY_CATALOG}/dataset/${ENERGY_DATASET}/resource/${ENERGY_RESOURCE_66}/download/untitled.xlsx`;

const ENERGY_PUBLISHER =
  "สำนักงานปลัดกระทรัฐ กระทรวงพลังงาน / Office of the Permanent Secretary, Ministry of Energy";

const GOV_PUBLISHER =
  "กรมธุรกิจปฏิรูปและพัฒนาระบบคอมพิวเตอร์ / Government Data Management Office — data.go.th";

/** Machine-readable = a CSV you can load into a spreadsheet or a program. */
const TABULAR = "CSV";

async function main() {
  const tmpDir = path.resolve("node_modules/.cache/sciti-harvest");
  fs.mkdirSync(tmpDir, { recursive: true });

  /* ── ENERGY ─────────────────────────────────────────────────────────── */
  console.log("· downloading the Ministry of Energy province electricity workbook…");
  const xlsxPath = path.join(tmpDir, "moe-electricity-66.xlsx");
  fs.writeFileSync(xlsxPath, curl(ENERGY_XLSX_URL, { binary: true }));

  const rows = readXlsx(xlsxPath);
  const header = rows[0];
  const RESIDENTIAL = 2; // บ้านอยู่อาศัย(kWh)
  console.log(`  sheet: ${rows.length - 1} province rows × ${header.length} columns`);

  const pop = await loadPopulation();
  const perCapita = {};
  const residentialShare = {};
  const unresolved = [];

  for (const r of rows.slice(1)) {
    const thName = String(r[1] ?? "").trim();
    const canonical = PROVINCE_TH[thName];
    if (!canonical) {
      unresolved.push(thName);
      continue;
    }
    const values = r.slice(RESIDENTIAL).map(v => (typeof v === "number" ? v : 0));
    const total = values.reduce((a, b) => a + b, 0);
    const residential = values[0] ?? 0;
    const people = pop[canonical];
    if (!people || people <= 0) throw new Error(`no population for ${canonical}`);
    perCapita[canonical] = Math.round((total / (people * 1000)) * 10) / 10;
    residentialShare[canonical] = Math.round((residential / total) * 1000) / 10;
  }

  if (unresolved.length) throw new Error(`unmapped Thai province names: ${unresolved.join(", ")}`);
  console.log(`  energy: ${Object.keys(perCapita).length} provinces`);

  /* ── GOVERNANCE ─────────────────────────────────────────────────────── */
  console.log("· counting open datasets per provincial administration…");
  const orgs = getJson(
    `${DATA_GO_TH}/api/3/action/organization_list?q=${encodeURIComponent("สำนักงานจังหวัด")}`,
  );
  // Bangkok is not a "สำนักงานจังหวัด" — it is a metropolitan administration,
  // and it publishes to the same portal under its own organisation.
  const bma = getJson(`${DATA_GO_TH}/api/3/action/organization_show?id=bangkok_metropolitan_administration`);
  const allOrgs = [...orgs.map(slug => ({ slug })), { slug: "bangkok_metropolitan_administration", title: bma.title }];

  const openDatasets = {};
  const tabularShare = {};
  const orgToProvince = {};
  const missing = [];

  for (const org of allOrgs) {
    let title = org.title;
    if (!title) {
      const shown = getJson(`${DATA_GO_TH}/api/3/action/organization_show?id=${org.slug}`);
      title = shown.title;
    }
    // "สำนักงานจังหวัดพิจิตร" -> "พิจิตร"; BMA -> "กรุงเทพมหานคร".
    const thProvince = title.replace(/^สำนักงานจังหวัด/, "").trim();
    const canonical = PROVINCE_TH[thProvince];
    if (!canonical) {
      missing.push(`${org.slug} (${title})`);
      continue;
    }
    orgToProvince[canonical] = org.slug;
    const total = getJson(`${DATA_GO_TH}/api/3/action/package_search?fq=${encodeURIComponent(`organization:${org.slug}`)}&rows=0`).count;
    const tabular = getJson(
      `${DATA_GO_TH}/api/3/action/package_search?fq=${encodeURIComponent(`organization:${org.slug} res_format:${TABULAR}`)}&rows=0`,
    ).count;
    openDatasets[canonical] = total;
    tabularShare[canonical] = total > 0 ? Math.round((tabular / total) * 1000) / 10 : 0;
    process.stdout.write(`\r  ${Object.keys(openDatasets).length}/${allOrgs.length} organisations counted`);
  }
  process.stdout.write("\n");

  if (missing.length) throw new Error(`organisations with no province mapping: ${missing.join(", ")}`);
  console.log(`  governance: ${Object.keys(openDatasets).length} provinces`);

  /* ── emit ───────────────────────────────────────────────────────────── */
  const indicators = [
    {
      id: "moe-electricity-per-capita",
      label: {
        en: "Electricity consumed per person",
        th: "ปริมาณการใช้ไฟฟ้าต่อหัวประชากร",
      },
      dimension: "energy",
      unit: "kWh per person per year",
      publisher: ENERGY_PUBLISHER,
      dataset: ENERGY_DATASET,
      table: "ปริมาณการใช้ไฟฟ้ารายจังหวัดสาขา-66",
      catalogUrl: ENERGY_CATALOG_URL,
      includes:
        "All twelve electricity tariff classes for the province (residential, small business, medium business, large business, " +
        "specific business, standby, interruptible rate, public lighting, government/enterprise, water pumping, temporary supply, " +
        "EV charging stations), summed; then divided by NSO's province population.",
      aggregate: "sum",
      year: 2023,
      quarter: null,
      provinceCount: Object.keys(perCapita).length,
      note:
        "Electricity consumed per resident in 2023. PEA and MEA reporting, re-tabulated by the Ministry of Energy. " +
        "A province's figure is its whole economy's electrical load spread over its people — it rises with industrialisation " +
        "and with the price of not burning fuel directly. The denominator is NSO's 2022 population, one year behind the " +
        "electricity year; that mismatch is disclosed rather than smoothed.",
      provinces: sortProvinces(perCapita),
    },
    {
      id: "moe-residential-electricity-share",
      label: {
        en: "Share of electricity going to homes",
        th: "สัดส่วนการใช้ไฟฟ้าที่เป็นสาขาบ้านอยู่อาศัย",
      },
      dimension: "energy",
      unit: "%",
      publisher: ENERGY_PUBLISHER,
      dataset: ENERGY_DATASET,
      table: "ปริมาณการใช้ไฟฟ้ารายจังหวัดสาขา-66",
      catalogUrl: ENERGY_CATALOG_URL,
      includes:
        "Residential tariff class (บ้านอยู่อาศัย) as a percentage of the sum of all twelve tariff classes for the province.",
      aggregate: "sum",
      year: 2023,
      quarter: null,
      provinceCount: Object.keys(residentialShare).length,
      note:
        "How much of a province's electricity is consumed by homes rather than by factories, commerce and public services. " +
        "Read through the grid: a low share means the province's power is a production base (Samut Sakhon 10.4%, Rayong 11.1%), " +
        "a high share means the grid serves a domestic economy (Uthai Thani 52.0%, Sukhothai 52.0%).",
      provinces: sortProvinces(residentialShare),
    },
    {
      id: "data-go-th-open-datasets",
      label: {
        en: "Open datasets published by the province",
        th: "ชุดข้อมูลเปิดที่จังหวัดเผยแพร่",
      },
      dimension: "governance",
      unit: "datasets",
      publisher: GOV_PUBLISHER,
      dataset: "data-go-th-ckan",
      table: "package_search?fq=organization:{province-slug}&rows=0",
      catalogUrl: `${DATA_GO_TH}/api/3/action/organization_list?q=${encodeURIComponent("สำนักงานจังหวัด")}`,
      includes:
        "Every dataset published by the province's administration organisation on the national open-data portal, counted with one " +
        "package_search query per organisation (rows=0, so only the count is transferred). Bangkok is counted through the Bangkok " +
        "Metropolitan Administration, the equivalent province-level body.",
      aggregate: "sum",
      year: 2026,
      quarter: null,
      provinceCount: Object.keys(openDatasets).length,
      note:
        "How much the provincial administration has published to the national open-data portal. This is the one slice of Thai " +
        "public administration that is published per province and is machine-readable. It is NOT an e-government index: " +
        "Thailand publishes none, and the DGA readiness score is agency-level while the ITA integrity assessment is " +
        "organisation-level and reaches the portal from only some provinces.",
      provinces: sortProvinces(openDatasets),
    },
    {
      id: "data-go-th-open-data-tabular",
      label: {
        en: "Published open data offered as a data table",
        th: "สัดส่วนข้อมูลเปิดที่เผยแพร่เป็นตารางข้อมูล",
      },
      dimension: "governance",
      unit: "%",
      publisher: GOV_PUBLISHER,
      dataset: "data-go-th-ckan",
      table: "package_search?fq=organization:{province-slug} res_format:CSV&rows=0",
      catalogUrl: `${DATA_GO_TH}/api/3/action/organization_list?q=${encodeURIComponent("สำนักงานจังหวัด")}`,
      includes:
        "Datasets carrying a downloadable CSV resource, as a percentage of all datasets published by the same organisation.",
      aggregate: "sum",
      year: 2026,
      quarter: null,
      provinceCount: Object.keys(tabularShare).length,
      note:
        "Whether a province publishes DATA or DOCUMENTS. A PDF of a scanned table is not open data; a CSV is. The share separates " +
        "a province that has a functioning data programme from one that has a filing cabinet.",
      provinces: sortProvinces(tabularShare),
    },
  ];

  const ts = `/**
 * ENERGY + GOVERNANCE baseline — harvested ${new Date().toISOString().slice(0, 10)}
 * ========================================================================
 * Generated by scripts/harvest-energy-governance.mjs. DO NOT HAND-EDIT.
 *
 * Four indicators that close the two dimensions that shipped as named gaps:
 *
 *   ENERGY     moe-electricity-per-capita        kWh per person per year, 2023
 *              moe-residential-electricity-share  % of a province's grid that serves homes, 2023
 *   GOVERNANCE data-go-th-open-datasets          datasets the province publishes on data.go.th
 *              data-go-th-open-data-tabular      % of those offered as a downloadable CSV
 *
 * Two publishers, each with its own catalogue:
 *   สำนักงานปลัดกระทรัฐ กระทรวงพลังงาน — via gdcatalog.energy.go.th
 *   กรมธุรกิจปฏิรูปและพัฒนาระบบคอมพิวเตอร์ — via data.go.th
 *
 * The data is COMMITTED, not fetched at build time — the site must never
 * depend on a government API being up.
 *
 * What is NOT here, and why: no renewable-energy share (DEDE publishes
 * province renewable potential only as maps, not machine-readable values),
 * no e-government index (Thailand publishes none), no ITA score (published per
 * organisation, reaching the portal from only some provinces), no fuel-sales
 * ratio (monthly snapshots, and the province series stop three years before
 * the electricity series). Each was probed; none was fudged.
 *
 * Source: https://gdcatalog.energy.go.th  ·  https://data.go.th
 */

import type { BaselineIndicator } from "./provinceBaselineData";

export const ENERGY_GOVERNANCE_BASELINE: BaselineIndicator[] = ${JSON.stringify(indicators, null, 2)};
`;

  const outPath = path.resolve(process.cwd(), "src/energyGovernanceData.ts");
  fs.writeFileSync(outPath, ts);
  console.log(`\n${indicators.length} indicators → ${outPath}`);
}

/** Stable, readable key order — Bangkok first, then alphabetical. */
function sortProvinces(map) {
  const out = {};
  const keys = Object.keys(map).sort((a, b) => {
    if (a === "Bangkok") return -1;
    if (b === "Bangkok") return 1;
    return a.localeCompare(b);
  });
  for (const k of keys) out[k] = map[k];
  return out;
}

await main();
