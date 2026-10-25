// ---------------------------------------------------------------------------
// Province Voice — the generated editorial layer for cities without a
// hand-written context
// ---------------------------------------------------------------------------
// WHY THIS EXISTS
//
// 50 cities have hand-written context. The other 68 — the registered
// municipalities and promotion zones — used to share four paragraphs of
// boilerplate. Ayutthaya and Phayao and Lampang all rendered the same
// sentences. That sameness is what made the whole product read as
// mechanical: the words looked written but carried no information about
// the place.
//
// THE RULE
//
// Every sentence here is assembled from that city's own province's
// MEASURED values, with the source and the geographic scope stated. No
// claim is made that the data does not support. Where a province has no
// record for a measure, the sentence says there is no record — absence is
// never printed as zero.
//
// The scope caveat is not decoration. A province-level figure describes
// the province, not the municipal boundary inside it, and a reader who
// cannot tell the difference will over-read the number. So the scope is
// stated in the same breath as the number.
//
// WHERE THE DATA COMES FROM
//
//   NSO      population, labour force, internal migration, housing,
//            internet and mobile penetration, water and sanitation
//   NESDC    provincial output per head
//   PCD      PM2.5 annual mean
//   RFD      forest and rubber cover
//   RTDDI    road deaths and motorcycle share
//   MoE      electricity per person, residential electricity share
//   NSO/DOPA non-registered population share (see absorptionData.ts)
// ---------------------------------------------------------------------------

import { PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData.ts";
import { ABSORPTION_PROVINCES } from "./absorptionData.ts";

// ── Reading helpers ────────────────────────────────────────────────────────
// A province name that the datasets do not carry is ABSENT, not zero.

function read(indicator: string, province: string): number | undefined {
  const map = PROVINCE_BASELINE_BY_ID[indicator];
  if (!map) return undefined;
  const v = map[province];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

/** Nearest-neighbour province name lookup, for spelling variants only. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

const PROVINCE_ALIASES: Record<string, string> = (() => {
  const known = new Set<string>();
  for (const map of Object.values(PROVINCE_BASELINE_BY_ID)) {
    for (const k of Object.keys(map)) known.add(k);
  }
  for (const k of Object.keys(ABSORPTION_PROVINCES)) known.add(k);
  const alias: Record<string, string> = {};
  for (const k of known) alias[norm(k)] = k;
  // The city registry says "Ayutthaya"; the datasets say "Phra Nakhon Si
  // Ayutthaya". The alias maps the CITY's spelling to the DATASET's key.
  // Without it, Ayutthaya resolves to nothing and the narrative claims
  // the data is absent when it is present — a false statement of
  // absence, which is the one failure this module must never produce.
  alias[norm("Ayutthaya")] = "Phra Nakhon Si Ayutthaya";
  return alias;
})();

export function canonicalProvince(province: string): string | undefined {
  return PROVINCE_ALIASES[norm(province)];
}

// Generated city copy repeats the same two locale/precision combinations.
// Reuse the formatter rather than negotiating locale data for every number.
// Intl retains the exact rounding, grouping and special-value semantics of
// Number.toLocaleString with these same options.
const numberFormatters = new Map<string, Intl.NumberFormat>();

function formatLocalizedNumber(n: number, locale: "en-US" | "th-TH", digits: number): string {
  const key = `${locale}:${digits}`;
  let formatter = numberFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: digits });
    numberFormatters.set(key, formatter);
  }
  return formatter.format(n);
}

function fmt(n: number, digits = 0): string {
  return formatLocalizedNumber(n, "en-US", digits);
}

function fmtTh(n: number, digits = 0): string {
  return formatLocalizedNumber(n, "th-TH", digits);
}

// ── The measured picture of one province ──────────────────────────────────
//
// UNITS ARE NOT GUESSED. Each indicator in PROVINCE_BASELINE carries its
// own unit string, and the reading below keeps that unit so the prose
// cannot misstate it. Three of these are not what the label suggests:
//   · nso-province-population  thousand people, NOT people
//   · nso-labour-force         thousand people
//   · nso-informal-labour      thousand people
//   · nso-internet-users       thousand people, NOT a percentage
//   · nso-mobile-users         thousand people, NOT a percentage
//   · nso-internal-migration   a percentage, NOT a head count
//   · nso-born-elsewhere       a percentage
// A narrative that says "1,694 residents" where the dataset says "1,694
// thousand" is wrong by three orders of magnitude, so the unit is read
// from the data and the sentence is written to match it.

export interface ProvinceReading {
  province: string;
  canonical?: string;
  /** Population in THOUSAND people (NSO ICT survey base, 2022). */
  population?: number;
  /** Labour force in THOUSAND people. */
  labourForce?: number;
  /** Informal labour in THOUSAND people. */
  informalLabour?: number;
  /** Internal migration as a PERCENTAGE. */
  internalMigration?: number;
  /** Born elsewhere as a PERCENTAGE. */
  bornElsewhere?: number;
  /** Internet users in THOUSAND people. */
  internetUsers?: number;
  /** Mobile users in THOUSAND people. */
  mobileUsers?: number;
  drinkingWater?: number;
  hygienicToilet?: number;
  homeOwnership?: number;
  nonDurableHousing?: number;
  residentialPermits?: number;
  pm25?: number;
  forestCoverage?: number;
  roadDeaths?: number;
  motorcycleShare?: number;
  electricityPerCapita?: number;
  residentialElectricityShare?: number;
  absorptionRegistered?: number;
  absorptionUnregistered?: number;
  absorptionUnplanned?: number;
  absorptionUnplannedShare?: number;
}

export function readProvince(province: string): ProvinceReading {
  const canonical = canonicalProvince(province);
  const p = canonical ?? province;
  const abs = ABSORPTION_PROVINCES[p];
  return {
    province,
    canonical,
    population: read("nso-province-population", p),
    labourForce: read("nso-labour-force", p),
    informalLabour: read("nso-informal-labour", p),
    internalMigration: read("nso-internal-migration", p),
    bornElsewhere: read("nso-born-elsewhere", p),
    internetUsers: read("nso-internet-users", p),
    mobileUsers: read("nso-mobile-users", p),
    drinkingWater: read("nso-drinking-water", p),
    hygienicToilet: read("nso-hygienic-toilet", p),
    homeOwnership: read("nso-home-ownership", p),
    nonDurableHousing: read("nso-non-durable-housing", p),
    residentialPermits: read("nso-residential-permits", p),
    pm25: read("pcd-pm25-annual", p),
    forestCoverage: read("rfd-forest-coverage", p),
    roadDeaths: read("rtddi-road-deaths", p),
    motorcycleShare: read("rtddi-motorcycle-share", p),
    electricityPerCapita: read("moe-electricity-per-capita", p),
    residentialElectricityShare: read("moe-residential-electricity-share", p),
    absorptionRegistered: abs?.registered ?? undefined,
    absorptionUnregistered: abs?.unregisteredNight ?? undefined,
    absorptionUnplanned: abs?.unplanned ?? undefined,
    absorptionUnplannedShare: abs?.unplannedShare ?? undefined,
  };
}

// ── Ranking, so a city's claim is comparative and therefore specific ─────

/**
 * Where does this province sit among all measured provinces on one
 * indicator? A value alone says little; a rank says whether it is
 * unusual. Returns a 1-based rank (1 = highest) and the number of
 * provinces measured, or undefined when the province has no record.
 */
export function rankIn(
  indicator: string,
  province: string,
  direction: "high" | "low" = "high",
): { rank: number; of: number; value: number } | undefined {
  const map = PROVINCE_BASELINE_BY_ID[indicator];
  if (!map) return undefined;
  const canonical = canonicalProvince(province) ?? province;
  const value = map[canonical];
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const all = Object.entries(map)
    .filter(([, v]) => typeof v === "number" && Number.isFinite(v))
    .map(([, v]) => v as number);
  const sorted = [...all].sort((a, b) => (direction === "high" ? b - a : a - b));
  const idx = sorted.indexOf(value);
  if (idx < 0) return undefined;
  return { rank: idx + 1, of: sorted.length, value };
}

/** Rank among the measured provinces on the unplanned population share. */
export function absorptionRank(province: string): { rank: number; of: number; value: number } | undefined {
  const canonical = canonicalProvince(province) ?? province;
  const rec = ABSORPTION_PROVINCES[canonical];
  if (!rec || typeof rec.unplannedShare !== "number") return undefined;
  const all = Object.values(ABSORPTION_PROVINCES)
    .map(r => r.unplannedShare)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const sorted = [...all].sort((a, b) => b - a);
  const idx = sorted.indexOf(rec.unplannedShare);
  if (idx < 0) return undefined;
  return { rank: idx + 1, of: sorted.length, value: rec.unplannedShare };
}

// ── Bands: which quarter of the measured set a province sits in ─────────
//
// A rank says "unusual". A band says WHICH QUARTER of the country it sits
// in, and that is what lets the prose change shape with the data instead of
// reciting one frame for all sixty-eight cities.
//
// The boundaries are computed from the values the dataset actually holds. No
// threshold here is hand-picked, so a band always means the same thing: the
// top quarter, the middle, or the bottom quarter of the provinces that this
// particular indicator covers.

export interface Band {
  /** 0 = top quarter for the direction, 3 = bottom quarter. */
  band: 0 | 1 | 2 | 3;
  /** 1-based rank, 1 = best for the direction. */
  rank: number;
  /** How many provinces carry the reading. */
  of: number;
  /** The value itself. */
  value: number;
}

function bandFromSorted(sortedBestFirst: number[], value: number): Band | undefined {
  const idx = sortedBestFirst.indexOf(value);
  if (idx < 0) return undefined;
  const of = sortedBestFirst.length;
  if (of === 0) return undefined;
  const band = Math.min(3, Math.max(0, Math.floor((idx / of) * 4))) as 0 | 1 | 2 | 3;
  return { band, rank: idx + 1, of, value };
}

const INDICATOR_VALUES = new Map<string, number[]>();

function indicatorValues(indicator: string, direction: "high" | "low"): number[] {
  const key = `${indicator}|${direction}`;
  const hit = INDICATOR_VALUES.get(key);
  if (hit) return hit;
  const map = PROVINCE_BASELINE_BY_ID[indicator];
  const values = map
    ? Object.values(map).filter((v): v is number => typeof v === "number" && Number.isFinite(v))
    : [];
  values.sort((a, b) => (direction === "high" ? b - a : a - b));
  INDICATOR_VALUES.set(key, values);
  return values;
}

/** Which quarter of the measured provinces this province sits in. */
export function bandIn(
  indicator: string,
  province: string,
  direction: "high" | "low" = "high",
): Band | undefined {
  const map = PROVINCE_BASELINE_BY_ID[indicator];
  if (!map) return undefined;
  const canonical = canonicalProvince(province) ?? province;
  const value = map[canonical];
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return bandFromSorted(indicatorValues(indicator, direction), value);
}

// ── Derived measures: ratios the indicators do not carry directly ────────

export type DerivedMeasure = (r: ProvinceReading) => number | undefined;

const DERIVED_VALUES = new Map<string, number[]>();

/** Every province any dataset in this project actually names. */
function allProvinceKeys(): string[] {
  const keys = new Set<string>();
  for (const map of Object.values(PROVINCE_BASELINE_BY_ID)) {
    for (const k of Object.keys(map)) keys.add(k);
  }
  for (const k of Object.keys(ABSORPTION_PROVINCES)) keys.add(k);
  return [...keys];
}

function derivedValues(name: string, measure: DerivedMeasure): number[] {
  const hit = DERIVED_VALUES.get(name);
  if (hit) return hit;
  const values: number[] = [];
  for (const p of allProvinceKeys()) {
    const v = measure(readProvince(p));
    if (v !== undefined && Number.isFinite(v)) values.push(v);
  }
  values.sort((a, b) => b - a);
  DERIVED_VALUES.set(name, values);
  return values;
}

/** Band for a measure computed from two indicators rather than read directly. */
export function bandOfDerived(name: string, measure: DerivedMeasure, value: number): Band | undefined {
  return bandFromSorted(derivedValues(name, measure), value);
}

/** Share of residents who are internet users — NSO counts over NSO population. */
export function internetShare(r: ProvinceReading): number | undefined {
  if (r.internetUsers === undefined || r.population === undefined || r.population <= 0) return undefined;
  return (r.internetUsers / r.population) * 100;
}

/** Share of residents who hold a mobile subscription. */
export function mobileShare(r: ProvinceReading): number | undefined {
  if (r.mobileUsers === undefined || r.population === undefined || r.population <= 0) return undefined;
  return (r.mobileUsers / r.population) * 100;
}

/** Band for the informal share of the labour force. */
export function informalBand(r: ProvinceReading): Band | undefined {
  const share = informalShare(r);
  if (share === undefined) return undefined;
  return bandOfDerived("informal", informalShare, share);
}

/** Band for the internet-user share of residents. */
export function internetBand(r: ProvinceReading): Band | undefined {
  const share = internetShare(r);
  if (share === undefined) return undefined;
  return bandOfDerived("internet", internetShare, share);
}

/** Band for the mobile-subscription share of residents. */
export function mobileBand(r: ProvinceReading): Band | undefined {
  const share = mobileShare(r);
  if (share === undefined) return undefined;
  return bandOfDerived("mobile", mobileShare, share);
}

/** Band for the share of the household register that the register does not count. */
export function absorptionBand(province: string): Band | undefined {
  const canonical = canonicalProvince(province) ?? province;
  const rec = ABSORPTION_PROVINCES[canonical];
  if (!rec || typeof rec.unplannedShare !== "number") return undefined;
  return bandOfDerived("absorption", (x) => x.absorptionUnplannedShare, rec.unplannedShare);
}

/** 1st, 2nd, 3rd, 11th, 21st — the naive version gets 21st wrong. */
export function ordinal(n: number): string {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] || suffix[v] || suffix[0]}`;
}

/** How much of the province's labour force is in informal work. */
export function informalShare(r: ProvinceReading): number | undefined {
  if (r.informalLabour === undefined || r.labourForce === undefined) return undefined;
  if (r.labourForce <= 0) return undefined;
  return (r.informalLabour / r.labourForce) * 100;
}

/** Share of the register that is people the register does not count. */
export function absorptionPct(r: ProvinceReading): number | undefined {
  if (r.absorptionUnplanned === undefined || r.absorptionRegistered === undefined) return undefined;
  const total = r.absorptionRegistered + r.absorptionUnplanned;
  if (total <= 0) return undefined;
  return (r.absorptionUnplanned / total) * 100;
}

/**
 * A population figure read from the NSO series is in THOUSAND people.
 * Written into a sentence, it has to say so, and the unit should read
 * the way a person would say it: 8,572,500 people is "8.6 million", not
 * "8,573 thousand people".
 */
export function populationText(thousands: number, locale: "en" | "th" | "zh" = "en"): string {
  if (thousands >= 1000) {
    const millions = thousands / 1000;
    if (locale === "th") return `${fmtTh(millions, 1)} ล้านคน`;
    if (locale === "zh") return `${fmt(millions, 1)} 百万人`;
    return `${fmt(millions, 1)} million people`;
  }
  if (thousands >= 100) {
    if (locale === "th") return `${fmtTh(thousands, 0)} พันคน`;
    if (locale === "zh") return `${fmt(thousands, 0)} 千人`;
    return `${fmt(thousands, 0)} thousand people`;
  }
  const people = Math.round(thousands * 1000);
  if (locale === "th") return `${fmtTh(people, 0)} คน`;
  if (locale === "zh") return `${fmt(people, 0)} 人`;
  return `${fmt(people, 0)} people`;
}

export { fmt as formatNumber, fmtTh as formatNumberTh };
