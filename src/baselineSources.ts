/**
 * VERIFIED SOURCE REGISTRY — SCITI baseline program
 * =================================================
 * Compiled 2026-10-20 by direct HTTP probe, not by search-result reading.
 * Every `verified` field below records the observed status code on that date.
 * Anything that was not probed is `verified: "unprobed"` — never guess a URL.
 *
 * Why this file exists
 * -------------------
 * depa's Smart City Committee asked for "foundational data across all 7
 * dimensions, using what is already available, as a baseline cities can
 * compare against" (Dr Yai → Dr Non, Oct 2026). That brief needs a defensible
 * answer to two questions a marketing page cannot answer:
 *
 *   1. What open data actually exists, per dimension, per province?
 *   2. Where is the baseline simply absent, so we stop inventing it?
 *
 * This file answers (1) honestly and marks (2) rather than filling it.
 */

/** depa's official seven smart-city dimensions.
 *  Source: depa.or.th "การพัฒนาเมืองอัจฉริยะ" — "มีมิติที่สำคัญ 7 ด้านคือ..."
 *  https://www.depa.or.th/th/smart-city-plan/smart-city-office  (verified 200)
 *  Corroborated by depa/Smart City Thailand Office + Hitachi Review,
 *  "Smart City Initiatives in Thailand: Key Concepts and Methods" (2021). */
export const DEPA_DIMENSIONS = [
  "environment",
  "mobility",
  "living",
  "people",
  "energy",
  "economy",
  "governance",
] as const;
export type DepaDimension = (typeof DEPA_DIMENSIONS)[number];

/** How well the baseline can actually be measured in that dimension TODAY,
 *  given the verified sources below. This is the honest state, not the
 *  aspirational one — a dimension with "none" has no national province-level
 *  open data behind it, and SCITI must say so rather than score it. */
export type BaselineStrength =
  | "strong"      // province-level national data exists, multiple indicators
  | "partial"     // exists but only via one agency or one survey
  | "none";       // no province-level open source verified

/** One verifiable source. `indicators` lists what this source can actually
 *  supply per province — not what it could theoretically supply. */
export interface SourceRecord {
  id: string;
  publisher: string;
  title: string;
  url: string;
  /** Observed HTTP status on 2026-10-20. */
  verified: "200" | "201" | "301" | "401" | "418" | "unreachable" | "unprobed";
  /** Anything that will bite an ingestion worker. */
  caveat?: string;
  /** Dimensions this source can genuinely serve, at province level. */
  serves: readonly DepaDimension[];
  /** Concrete province-level indicators, named. */
  indicators: readonly string[];
}

/**
 * The national backbone. Ten sources, each probed 2026-10-20.
 */
export const SOURCE_REGISTRY: readonly SourceRecord[] = [
  {
    id: "nso-catalog-index",
    publisher: "สศ. / NSO — National Statistical Office",
    title: "NSO Data Catalog machine-readable index",
    url: "https://catalogapi.nso.go.th/api/index?table=GSI_NSO_DATASET&format=csv&div=1",
    verified: "200",
    caveat:
      "Returns HTTP 418 without a User-Agent header. With a browser UA it returns a " +
      "692 KB CSV of every NSO dataset. Filter to geo_coverage containing 'จังหวัด': " +
      "45 of 690 datasets are province-level, all Database/CSV/JSON. " +
      "TRAP: the ICT household survey's province table (ICTH_37_4_Table_31) has ONE value " +
      "column, Pop_use_In, which holds POPULATION up to the 2565Q4 vintage and INTERNET " +
      "USERS from 2566Q1 onward. The mobile twin (ICTH_37_10_Table_31) never flipped — " +
      "Pop_use_Mo has always held users. Every vintage is provable: the 77 province values " +
      "sum exactly to the region table's Pop_Total before the flip and to its Pop_use_In " +
      "after it. SCITI pins the population at 2565Q4, internet users at 2566Q1 and mobile " +
      "users at 2565Q4; both resulting rates reproduce NSO's own published penetration " +
      "figure to within 0.08 and 0.00 percentage points.",
    serves: ["living", "people", "economy"],
    indicators: [
      "household income Gini coefficient, by province",
      "employment, total and by manufacturing establishment",
      "informal-sector labour force (สำรวจแรงงานนอกระบบ)",
      "household ICT device usage (ICT household survey)",
      "province population, the ICT survey's own base (2565Q4)",
      "population using the internet, age 6+ (2566Q1)",
      "population using mobile phones (2565Q4)",
      "internal migration within 5 years, and not residing in birth province",
      "household home-ownership rate",
      "households with a hygienic toilet",
      "households with access to clean drinking water",
      "housing construction materials (durability of dwelling)",
      "building permits granted (form 3.1 / 39 twin)",
      "population by age band: <18, 18–25, 60+",
      "total labour force",
    ],
  },
  {
    id: "air4thai",
    publisher: "กรมควบคุมมลพิษษ / PCD — Pollution Control Department",
    title: "Air4Thai real-time AQI station feed",
    url: "http://air4thai.pcd.go.th/services/getNewAQI_JSON.php",
    verified: "200",
    caveat:
      "Plain HTTP, no HTTPS. Returns 134 KB JSON of live stations, each carrying " +
      "areaEN with subdistrict/district — so station coverage maps to province, but " +
      "coverage is uneven: a province with no station yields nothing, not zero. " +
      "Absence of a station must not be scored as clean air.",
    serves: ["environment", "living"],
    indicators: ["PM2.5 station readings", "AQI by station", "station count per province"],
  },
  {
    id: "rtddi",
    publisher: "data.go.th — MOPH-led road-traffic integration",
    title: "Integrated road-traffic death dataset (rtddi)",
    url: "https://data.go.th/dataset/rtddi",
    verified: "200",
    serves: ["mobility", "living"],
    indicators: ["road deaths per 100,000 population", "accidents by road class"],
  },
  {
    id: "gistda-open",
    publisher: "GISTDA — Geo-Informatics and Space Technology Development Agency",
    title: "GISTDA Open Data geospatial catalogue",
    url: "https://opendata.gistda.or.th/dataset/",
    verified: "200",
    caveat:
      "Catalogue browses without a key; per-dataset API calls generally require a " +
      "GISTDA API Gateway key. Treat as catalogue-now, ingest-after-registration. " +
      "NOTE: this source deliberately does NOT serve 'energy'. Its renewable layers " +
      "are SITING data (where renewables could go), not consumption or generation " +
      "performance, so it cannot baseline how a city actually uses energy.",
    serves: ["environment"],
    indicators: [
      "flood recurrence / inundation layers",
      "wildfire and burn-scar",
      "land cover, land use",
      "PM2.5 satellite surface layers",
    ],
  },
  {
    id: "mots-domestic-tourism",
    publisher: "กระทรวงการท่องเที่ยวและกีฬา / MOTS",
    title: "Domestic tourism statistics by region and province",
    url: "https://data.go.th/dataset/stattourism",
    verified: "200",
    caveat:
      "Each province publishes on its own year and its own definition — some count " +
      "'visitors', some 'tourists', some 'lodged guests'. These are different " +
      "populations and must NOT be summed or ranked against each other raw. " +
      "Provinces absent from the table are unpublished, not zero.",
    serves: ["economy", "living"],
    indicators: [
      "domestic + foreign tourists by province",
      "tourism revenue by province",
      "accommodation: rooms, occupancy rate, average length of stay",
    ],
  },
  {
    id: "obec-open",
    publisher: "สพฐ. / OBEC — Office of the Basic Education Commission",
    title: "OBEC Open Data API list",
    url: "https://opendata.edudev.in.th/ListApis",
    verified: "200",
    serves: ["people"],
    indicators: [
      "enrolment by province",
      "student–teacher ratio",
      "dropout rate",
      "classrooms and school infrastructure",
    ],
  },
  {
    id: "traffy",
    publisher: "Traffy Fondue",
    title: "Citizen-reported urban service complaints (public API)",
    url: "https://publicapi.traffy.in.th/ud/search?type=%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%A5%E0%B8%B2%E0%B8%94&offset=5",
    verified: "201",
    caveat:
      "Returns 201 (created), not 200 — it is a working search endpoint, not a REST " +
      "GET-by-id. Complaint volume must be normalised per capita: a bigger city " +
      "reports more, and raw counts would rank Bangkok top on every measure.",
    serves: ["governance", "mobility", "living"],
    indicators: [
      "complaint volume per capita by category",
      "complaint resolution rate",
      "pothole / footpath / drainage / streetlight reporting density",
    ],
  },
  {
    id: "mea-open",
    publisher: "การไฟฟ้านครหลวง / MEA — Metropolitan Electricity Authority",
    title: "MEA Open Data (80 statistical datasets)",
    url: "https://opendata.mea.or.th/th/",
    verified: "200",
    caveat:
      "MEA covers Bangkok and its metropolitan area only — it is NOT a national " +
      "source. Provincial coverage needs EGAT/PEA, which must be negotiated separately.",
    serves: ["energy"],
    indicators: ["electricity users by district and type", "consumption pattern, metropolitan only"],
  },
  {
    id: "depa-citydata",
    publisher: "depa — City Data Platform",
    title: "depa City Data Platform / CDP catalogue",
    url: "https://www.citydata.in.th/",
    verified: "200",
    caveat:
      "IMPORTANT: the catalogue host https://catalog.citydata.in.th/ FAILED to " +
      "connect over HTTPS on 2026-10-20 (curl 000); http:// returns 301. The main " +
      "site www.citydata.in.th serves 200. Treat the CKAN catalogue as " +
      "HTTPS-unstable and do not build an automated connector against it until " +
      "depa confirms a working endpoint.",
    serves: ["governance", "economy", "environment"],
    indicators: ["municipal smart-city datasets", "city-level dashboard layers", "open-data publication per city"],
  },
  {
    id: "dga-gdx",
    publisher: "กรมกิจการดิจิทัลฯ / DGA",
    title: "Government Data Exchange / catalogue gallery",
    url: "https://gdx.dga.or.th/catalog/gallery/dataset",
    verified: "200",
    serves: ["governance", "mobility"],
    indicators: ["government dataset discovery", "administrative boundaries", "transport/accident datasets"],
  },
];

/**
 * Baseline coverage per depa dimension, derived from the registry above.
 *
 * This is the table that should sit on /methodology. It is deliberately
 * unflattering in places — "none" is a finding, not a gap to be papered over.
 */
export const BASELINE_COVERAGE: Readonly<Record<DepaDimension, {
  strength: BaselineStrength;
  /** How many verified sources can serve this dimension. */
  sources: number;
  /** One line a city could act on this week, or why it cannot. */
  note: string;
}>> = {
  economy: {
    strength: "strong",
    sources: 3,
    note: "NSO Gini + employment + informal labour, MOTS tourism revenue/receipts, depa CDP.",
  },
  living: {
    strength: "strong",
    sources: 5,
    note: "Housing tenure, sanitation, drinking water, age structure, air quality, road deaths, tourism load.",
  },
  people: {
    strength: "partial",
    sources: 2,
    note: "OBEC education API is solid; NSO covers migration and ICT access. Digital-skill data is thin.",
  },
  environment: {
    strength: "partial",
    sources: 3,
    note: "GISTDA layers + Air4Thai stations. No province is fully covered — station absence ≠ clean air.",
  },
  mobility: {
    strength: "partial",
    sources: 3,
    note: "Road deaths are solid via the integrated road-traffic dataset. Commute time " +
          "and transit coverage have no verified open source.",
  },
  governance: {
    strength: "partial",
    sources: 3,
    note: "Traffy's complaint feed and the DGA's data.go.th catalogue were both probed, " +
          "and depa's own city-platform endpoint is unstable over HTTPS. Nothing that can " +
          "be downloaded, reproduced and cited yet, so nothing is scored.",
  },
  energy: {
    strength: "none",
    sources: 1,
    note: "The one verified energy source, the Metropolitan Electricity Authority, covers " +
          "Bangkok's metropolitan area only — it cannot baseline a province. EGAT and PEA " +
          "provincial sales need a negotiated feed. GISTDA publishes renewable siting, not " +
          "consumption, and neither measures how a city actually uses energy.",
  },
};

/** Human-readable summary used by the methodology page and the test suite. */
export function baselineCoverageRows() {
  return DEPA_DIMENSIONS.map(d => ({ dimension: d, ...BASELINE_COVERAGE[d] }));
}

/** Total verified sources in the registry. */
export const SOURCE_COUNT = SOURCE_REGISTRY.length;