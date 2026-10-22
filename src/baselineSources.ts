/**
 * VERIFIED SOURCE REGISTRY — SCITI baseline program
 * =================================================
 * Compiled 2026-10-20, extended 2026-10-21, by direct HTTP probe — not by
 * reading search results. Every `verified` field below records the observed
 * status code on the date named in that entry's caveat. Anything that was
 * not probed is `verified: "unprobed"` — never guess a URL.
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
 * The national backbone. Twelve sources, probed by direct HTTP request —
 * ten on 2026-10-20, two more on 2026-10-21 when the environment dimension
 * gained its two province series.
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
      "Absence of a station must not be scored as clean air. NOTE: the baseline does " +
      "not score this feed. It is a live reading, not a series with a vintage; the " +
      "scored PM2.5 number comes from PCD's annual station averages (see " +
      "pcd-pm25-annual), which have a named year and a reproducible province value.",
    serves: ["environment", "living"],
    indicators: ["PM2.5 station readings", "AQI by station", "station count per province"],
  },
  {
    id: "pcd-pm25-annual",
    publisher: "กรมควบคุมมลพิษษ / PCD — Pollution Control Department",
    title: "Annual average PM2.5 concentration by monitoring station, 2015–2024",
    url: "https://data.go.th/dataset/fc3b51fd-91e3-4788-8241-32d418e636d4",
    verified: "200",
    caveat:
      "Probed 2026-10-21: the catalogue API and the CSVs both return 200. The source " +
      "publishes STATIONS, not province totals, and splits them across three files — " +
      "provincial stations, Bangkok-area stations, and Bangkok-metropolitan stations — " +
      "because the provincial file deliberately omits the Bangkok area; all three are " +
      "needed for a complete province list. The province value SCITI uses is therefore " +
      "the arithmetic mean of that province's station annual averages, and the station " +
      "values are stored beside it so the mean can be checked by hand. Rows labelled " +
      "'ค่ามาตรฐาน' are the regulatory standard (15 µg/m³ annual), not a measurement, and " +
      "are excluded. One physical station serving both Bangkok and Samut Prakan appears " +
      "in two files and is counted once. The 2024 file carries a data date of 31 March 2025.",
    serves: ["environment"],
    indicators: [
      "annual average 24-hour PM2.5 per monitoring station, by province",
      "station maximum, minimum and exceedance count",
    ],
  },
  {
    id: "rfd-forest-area",
    publisher: "กรมป่าไม้และสัตว์ป่า / RFD — Royal Forest Department",
    title: "Province forest area and forest area as a share of province area, BE 2564 (2021)",
    url: "https://data.forest.go.th/dataset/46cf6f8b-dee3-42d8-9c38-02690af49cc0",
    verified: "200",
    caveat:
      "Probed 2026-10-21: the CSV resource returns 200; the dataset page 302-redirects " +
      "to /dataset/https-www-forest-go-th-land and then serves 200. TRAP: the file's " +
      "English province column is a STALE 76-province list in which the labels are " +
      "shifted — 'อำนาจเจริญ' (Amnat Charoen) is labelled 'Umnad Chareun', the old name " +
      "for Uttaradit, and every row after it is off by one. The Thai column is correct " +
      "and is the one SCITI reads. Provinces with no forest area are recorded as " +
      "'ไม่มีพื้นที่ป่าไม้' and are a VERIFIED ZERO, not a missing value. A later series " +
      "(BE 2556–2566 and BE 2567) exists as XLSX and would need a spreadsheet reader; " +
      "SCITI uses the 2021 CSV rather than take that dependency.",
    serves: ["environment"],
    indicators: [
      "forest area by province, square kilometres",
      "forest area as a share of province area",
    ],
  },
  {
    id: "rtddi",
    publisher: "data.go.th — MOPH-led road-traffic integration",
    title: "Integrated road-traffic death dataset (rtddi)",
    url: "https://data.go.th/dataset/rtddi",
    verified: "200",
    caveat:
      "Probed 2026-10-21. The catalogue id 'rtddi' resolves; the resource itself lives " +
      "under dataset f5804870-7dc2-42df-86f3-769d6cc2ae23 and is a CSV per year from " +
      "BE 2554 to BE 2569. TRAP: the BE 2569 file holds ONLY January to March, so it is " +
      "not a year and is not used; BE 2568 (2025) is the latest complete year, with all " +
      "twelve months present. TRAP: the file carries TWO province columns and they mean " +
      "different things. 'Province' is the victim's registered address — filled on only " +
      "36% of records, and agreeing with the accident's province in just 53.5% of the " +
      "rows where both could be checked. 'จ.ที่เสียชีวิต' is the province the death is " +
      "recorded against, which is where the crash occurred; it is filled on 100% of records " +
      "and matched the accident district's province in 612 of 612 rows resolvable against " +
      "the DOPA gazetteer. That is the column the baseline uses. Also: the helmet and " +
      "seatbelt risk columns are empty, and vehicle type is unrecorded on 44.2% of " +
      "records, so the motorcycle share is computed on the recorded-vehicle subset only.",
    serves: ["mobility", "living"],
    indicators: [
      "road deaths by province where the crash occurred",
      "motorcycle share of road deaths with a recorded vehicle",
      "accident district and sub-district",
      "victim age, sex and nationality",
    ],
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

  {
    id: "moe-province-electricity",
    publisher: "สำนักงานปลัดกระทรัฐ กระทรวงพลังงาน / Office of the Permanent Secretary, Ministry of Energy",
    title: "Electricity consumed per province per tariff class, BE 2566 (2023)",
    url: "https://gdcatalog.energy.go.th/dataset/7fc9e90f-0433-4612-81ab-7f1d689f9271",
    verified: "200",
    caveat:
      "Probed 2026-10-22: the Ministry of Energy runs its OWN CKAN catalogue at " +
      "gdcatalog.energy.go.th, and its dataset ids COLLIDE with data.go.th's — " +
      "`dataset_41_07` is the electricity table here and 'จำนวนครัวเรือนยากจน' on " +
      "data.go.th. Never resolve an id without naming the host. The workbook is XLSX " +
      "(a ZIP of XML); there is no xlsx dependency in this repo, so the sheet is read " +
      "with unzip plus a small shared-strings reader. The file covers all 77 provinces " +
      "across twelve tariff classes, including EV charging stations. Underlying numbers " +
      "are PEA and MEA reporting, re-tabulated by the Ministry.",
    serves: ["energy"],
    indicators: [
      "electricity consumed per province, by tariff class (kWh)",
      "electricity per person, per province",
      "residential share of a province's electricity",
    ],
  },
  {
    id: "data-go-th-open-data",
    publisher: "กรมธุรกิจปฏิรูปและพัฒนาระบบคอมพิวเตอร์ / Government Data Management Office",
    title: "data.go.th — the national open-data portal, and the provincial administration organisations inside it",
    url: "https://data.go.th/api/3/action/organization_list?q=%E0%B8%AA%E0%B8%B3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94",
    verified: "200",
    caveat:
      "Probed 2026-10-22. TRAP: asking for 1,000 packages with their resources TIMES " +
      "OUT (90s, 0 bytes). Every number here is a `rows=0` COUNT query, never a bulk " +
      "listing. Bangkok is not a 'สำนักงานจังหวัด' — it publishes through the Bangkok " +
      "Metropolitan Administration, counted under its own organisation. All 77 " +
      "provinces have a publishing organisation, so no province is missing here; " +
      "nothing is scored as zero for absence. THIS IS NOT AN E-GOVERNMENT INDEX: " +
      "Thailand publishes none. The DGA readiness score is agency-level; the ITA " +
      "integrity assessment is organisation-level and reaches the portal from only " +
      "some provinces (Phichit 94 files, Lopburi 3, Rayong 1, Nan 0); the NSO " +
      "citizen-satisfaction series POS_01_Table_0002..0004 is national only.",
    serves: ["governance"],
    indicators: [
      "datasets published by a provincial administration organisation",
      "share of those datasets carrying a downloadable CSV data table",
    ],
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
    note: "Housing tenure, sanitation, drinking water, age structure, air quality, road deaths, tourism load. " +
          "The household socio-economic survey that carries water, sanitation and tenure stops at 2010, " +
          "so one province — Bueng Kan, created in 2011 — is absent from every vintage and cannot be " +
          "measured on those three indicators at all.",
  },
  people: {
    strength: "partial",
    sources: 2,
    note: "OBEC education API is solid; NSO covers migration and ICT access. Digital-skill data is thin.",
  },
  environment: {
    strength: "partial",
    sources: 5,
    note: "Scored for all 118 cities. PCD station PM2.5 (65 provinces) and RFD forest " +
          "cover (77 provinces) are province series, so every city carries an " +
          "environment number. Water quality, urban green space and flood recurrence " +
          "are still city-level only, so 69 cities rest on 2 of 5 environment " +
          "indicators and their coverage is reported on every row.",
  },
  mobility: {
    strength: "partial",
    sources: 3,
    note: "Scored for all 118 cities from the integrated road-traffic death registry: " +
          "deaths in the province where the crash happened, per 100,000 residents. " +
          "Commute time and transit coverage still have no verified open source, and the " +
          "motorcycle share of those deaths is published for browsing but not scored.",
  },
  governance: {
    strength: "partial",
    sources: 4,
    note: "Scored for all 118 cities from the national open-data portal: what the " +
          "provincial administration has published there, and whether it published DATA " +
          "or DOCUMENTS. Thailand publishes NO province-level e-government index — the " +
          "DGA readiness score is agency-level, the ITA integrity assessment is " +
          "organisation-level and reaches the portal from only some provinces, and the " +
          "NSO citizen-satisfaction series is national only. So this dimension measures " +
          "digital transparency capacity and is labelled as exactly that. Traffy's " +
          "complaint feed and depa's own city-platform endpoint were also probed and " +
          "rejected.",
  },
  energy: {
    strength: "partial",
    sources: 2,
    note: "Scored for all 118 cities from the Ministry of Energy's own catalogue: " +
          "electricity consumed per person (2023) for all 77 provinces. The share of a " +
          "province's grid that serves homes is published and browsable but deliberately " +
          "NOT scored — it is a structural descriptor, and scoring it would reward a " +
          "province for having no industry. NO renewable share is claimed: DEDE " +
          "publishes province renewable potential only as maps, not as machine-readable " +
          "values. EGAT's public sales tables are national, split by utility, not by " +
          "province; the Energy Business Department's province fuel files stop three " +
          "years before the electricity series, so no fuel ratio is computed.",
  },
};

/**
 * WHAT IS STILL MISSING, INSIDE THE DIMENSIONS WE NOW MEASURE
 * ===========================================================
 *
 * All seven depa dimensions carry a measured indicator, so there is no
 * dimension with nothing behind it. But "measured" is not "complete", and
 * two specific measurements are still absent. They are named here — with
 * the reason they are absent — because a named absence is a research
 * instruction, and an unstated one is a quiet over-claim.
 *
 * Nothing in this list is scored, and nothing in it is approximated.
 */
export interface ResidualGap {
  id: string;
  dimension: DepaDimension;
  label: { en: string; th: string; zh: string };
  note: { en: string; th: string; zh: string };
}

export const RESIDUAL_GAPS: readonly ResidualGap[] = [
  {
    id: "renewable-share",
    dimension: "energy",
    label: {
      en: "Renewable share of a province's energy",
      th: "สัดส่วนพลังงานทดแทนของจังหวัด",
      zh: "省级能源中的可再生能源占比",
    },
    note: {
      en: "DEDE publishes renewable-energy potential by province — solar, wind, biomass — but only as maps. The machine-readable layer is not published, so there is no number to score. Not approximated from the national share, which would be an invention.",
      th: "กรมพัฒนาพลังงานทดแทนเผยแพร่ศักยภาพพลังงานทดแทนรายจังหวัด (แสงอาทิตย์ ลม ชีวมวล) แต่เป็นเพียงแผนที่ ไม่มีชั้นข้อมูลที่อ่านเป็นตัวเลขได้ จึงไม่มีค่าที่จะให้คะแนน และไม่ถูกประมาณจากสัดส่วนระดับประเทศ ซึ่งจะเป็นการกุขึ้นมา",
      zh: "泰国可再生能源发展署按省公布可再生能源潜力（太阳能、风能、生物质），但仅以地图形式发布，机器可读图层未发布，因此没有可评分的数值。也不用全国占比推算——那等于编造。",
    },
  },
  {
    id: "province-egov-index",
    dimension: "governance",
    label: {
      en: "A province-level e-government index",
      th: "ดัชนีรัฐบาลอิเล็กทรอนิกส์ระดับจังหวัด",
      zh: "省级电子政务指数",
    },
    note: {
      en: "Thailand publishes none. DGA's digital-government readiness score is agency-level; the ITA integrity assessment is organisation-level and reaches the national portal from only some provinces; NSO's citizen-satisfaction series is national only. All three were probed. Governance is therefore measured by open-data publication, and labelled as exactly that.",
      th: "ประเทศไทยไม่มีการจัดทำ คะแนนความพร้อมรัฐบาลดิจิทัลของ DGA เป็นระดับหน่วยงาน ผลประเมิน ITA เป็นระดับองค์กรและมาถึงแพลตฟอร์มกลางเพียงบางจังหวัด ส่วนชุดข้อมูลความพึงพอใจของ สศ. เป็นระดับประเทศ ทั้งสามแหล่งถูกตรวจสอบแล้ว มิติการบริหารจึงวัดจากการเผยแพร่ข้อมูลเปิด และระบุไว้ว่าเป็นการวัดเช่นนั้น",
      zh: "泰国没有此类指数。DGA 的数字政府就绪度评分是机构级的；ITA 诚信评估是组织级的，且只有部分省份发布到国家门户；统计局的公民满意度数据是全国级的。三者均已实测核查。治理维度因此以开放数据发布量衡量，并如实如此标注。",
    },
  },
];

/** Human-readable summary used by the methodology page and the test suite. */
export function baselineCoverageRows() {
  return DEPA_DIMENSIONS.map(d => ({ dimension: d, ...BASELINE_COVERAGE[d] }));
}

/** Total verified sources in the registry. */
export const SOURCE_COUNT = SOURCE_REGISTRY.length;