// ---------------------------------------------------------------------------
// Smart City Thailand Index — Type definitions
// ---------------------------------------------------------------------------

export type Locale = "en" | "th" | "zh";

/** The 7 depa Smart City dimensions */
export type SmartDimension =
  | "economy"
  | "energy"
  | "environment"
  | "governance"
  | "living"
  | "mobility"
  | "people";

/** Our 7 scoring pillars — what actually matters for livability */
export type ScoringPillar =
  | "livability"
  | "economy"
  | "safety"
  | "wellbeing"
  | "environment"
  | "hospitality"
  | "digital";

/** Alpha/Beta/Gamma tier classification */
export type CityTier = "alpha" | "beta" | "gamma";

/** Smart City Local (certified) vs Promotion Zone (aspiring) */
export type CityStatus = "certified" | "promotion" | "registered";

export type DataConfidence = "high" | "medium" | "low";

/** Whether city is built and operational or still mostly plans */
export type CityReality = "operational" | "partial" | "planned";

export interface CityScores {
  livability: number;    // 0-100: housing, infrastructure, daily life quality
  economy: number;       // 0-100: jobs, GPP, growth, affordability
  safety: number;        // 0-100: crime rate, disaster resilience
  wellbeing: number;     // 0-100: healthcare, education, optimism, family-friendliness
  environment: number;   // 0-100: air quality, green space, sustainability
  hospitality: number;   // 0-100: culture, tourism, community warmth, belonging
  digital: number;       // 0-100: digital innovation, smart city tech adoption
}

export interface CityMetrics {
  population: number;            // thousands
  gppPerCapita?: number;         // Thai baht
  avgMonthlyIncome?: number;     // Thai baht
  pm25Annual?: number;           // ug/m3
  hospitalBedsPer10k?: number;
  crimeRatePer100k?: number;
  greenCoverage?: number;        // percentage
  // Extended CDP fields — provincial data sources
  gppGrowthRate?: number;        // percent YoY (NESDC)
  laborForce?: number;           // thousands (NSO)
  industryComposition?: string;  // e.g. "agriculture 12%, manufacturing 38%, services 50%"
  pm25Trend?: "improving" | "stable" | "worsening"; // PCD historical
  waterQuality?: number;         // 0-100 index (PCD/ONEP)
  forestCoverage?: number;       // percentage (Royal Forest Dept)
  fdiInflow?: number;            // million baht (BOI)
  dataLastUpdated?: string;      // ISO date of most recent data sync
  landAreaKm2?: number;          // optional land area override from dataset
}

export interface SmartCity {
  id: string;
  nameEn: string;
  nameTh: string;
  province: string;
  provinceTh: string;
  region: "north" | "central" | "northeast" | "east" | "south" | "bangkok";
  provinceId?: string;           // Thai province code for CDP linkage
  status: CityStatus;
  reality: CityReality;
  batch?: number;                // announcement batch (1-4) for certified cities
  smartDimensions: SmartDimension[];
  scores: CityScores;
  metrics: CityMetrics;
  compositeScore: number;        // weighted composite 0-100
  tier: CityTier;
  tagline: string;
  taglineTh: string;
  highlights: string[];
  dataConfidence?: DataConfidence;
}

export const PILLAR_WEIGHTS: Record<ScoringPillar, number> = {
  livability: 25,
  economy: 20,
  safety: 15,
  wellbeing: 15,
  environment: 10,
  hospitality: 10,
  digital: 5,
};

export const PILLAR_LABELS: Record<Locale, Record<ScoringPillar, string>> = {
  en: {
    livability: "Livability",
    economy: "Economy",
    safety: "Safety",
    wellbeing: "Wellbeing",
    environment: "Environment",
    hospitality: "Hospitality",
    digital: "Digital",
  },
  th: {
    livability: "ความน่าอยู่",
    economy: "เศรษฐกิจ",
    safety: "ความปลอดภัย",
    wellbeing: "คุณภาพชีวิต",
    environment: "สิ่งแวดล้อม",
    hospitality: "อัธยาศัย",
    digital: "ดิจิทัล",
  },
  zh: {
    livability: "宜居",
    economy: "经济",
    safety: "安全",
    wellbeing: "福祉",
    environment: "环境",
    hospitality: "人文",
    digital: "数字",
  },
};

export const PILLAR_SHORT_LABELS: Record<Locale, Record<ScoringPillar, string>> = {
  en: {
    livability: "LIV",
    economy: "ECO",
    safety: "SAF",
    wellbeing: "WLB",
    environment: "ENV",
    hospitality: "HOS",
    digital: "DIG",
  },
  th: {
    livability: "อยู่",
    economy: "ศก",
    safety: "ปล",
    wellbeing: "ชีว",
    environment: "สิ่ง",
    hospitality: "คน",
    digital: "ดิจ",
  },
  zh: {
    livability: "居",
    economy: "经",
    safety: "安",
    wellbeing: "福",
    environment: "环",
    hospitality: "文",
    digital: "数",
  },
};

export const PILLAR_COLORS: Record<ScoringPillar, string> = {
  livability: "#2BA89C",    // Andaman teal
  economy: "#E8913A",       // temple saffron
  safety: "#3D6BE8",        // Thai silk blue
  wellbeing: "#E84393",     // bougainvillea pink
  environment: "#5CBD5C",   // tropical green
  hospitality: "#D4A843",   // marigold gold
  digital: "#9B5DE5",       // orchid purple
};

export const TIER_LABELS: Record<Locale, Record<CityTier, string>> = {
  en: { alpha: "Alpha", beta: "Beta", gamma: "Gamma" },
  th: { alpha: "อัลฟา", beta: "เบตา", gamma: "แกมมา" },
  zh: { alpha: "Alpha", beta: "Beta", gamma: "Gamma" },
};

export const DIMENSION_LABELS: Record<Locale, Record<SmartDimension, string>> = {
  en: { economy: "Smart Economy", energy: "Smart Energy", environment: "Smart Environment", governance: "Smart Governance", living: "Smart Living", mobility: "Smart Mobility", people: "Smart People" },
  th: { economy: "เศรษฐกิจอัจฉริยะ", energy: "พลังงานอัจฉริยะ", environment: "สิ่งแวดล้อมอัจฉริยะ", governance: "การปกครองอัจฉริยะ", living: "การดำรงชีวิตอัจฉริยะ", mobility: "การเดินทางอัจฉริยะ", people: "พลเมืองอัจฉริยะ" },
  zh: { economy: "智慧经济", energy: "智慧能源", environment: "智慧环境", governance: "智慧治理", living: "智慧生活", mobility: "智慧出行", people: "智慧市民" },
};
