import { cdpSources, getAirQualityUrl, getBOIInvestmentUrl, getCityDataUrl, getOpenDataSearchUrl } from "./cdpData.ts";
import { cityContexts, type CityContext } from "./cityContext.ts";
import { allCities } from "./cityData.ts";
import { dataSources, getEvidenceForCity, type DataSource, type EvidenceItem } from "./evidenceData.ts";
import { SCORING_PILLARS } from "./scoring.ts";
import type {
  CityReality,
  CityStatus,
  CityTier,
  DataConfidence,
  Locale,
  ScoringPillar,
  SmartCity,
} from "./types.ts";

export interface LocalizedText {
  en: string;
  th: string;
  zh: string;
}

export type DeliveryStatus = "ready" | "building" | "gap";

export type ContextNoteKind =
  | "opportunity"
  | "constraint"
  | "implementation_warning"
  | "exportable_lesson";

export type FinancePriority = "lead" | "secondary" | "watch";

export type FinanceCategory =
  | "debt"
  | "equity"
  | "grant"
  | "hybrid"
  | "innovative";

export interface CityKeyMetric {
  key: string;
  label: LocalizedText;
  value: string;
  unit?: string;
  confidence: DataConfidence;
  sourceId: string;
}

export interface CityMetricObservation {
  cityId: string;
  metricKey: string;
  label: LocalizedText;
  metricValueNum: number | null;
  metricValueText: string | null;
  unit: string | null;
  periodLabel: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  observedAt: string;
  confidence: number;
  methodNote: string;
  verifiedAt: string;
  version: string;
}

export interface CityMetricBlock {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  observations: CityMetricObservation[];
}

export interface CityContextNote {
  id: string;
  kind: ContextNoteKind;
  title: LocalizedText;
  body: LocalizedText;
}

export interface CityDeliveryProfile {
  cityId: string;
  visionStatus: DeliveryStatus;
  infrastructureStatus: DeliveryStatus;
  dataPlatformStatus: DeliveryStatus;
  businessModelStatus: DeliveryStatus;
  partnershipStatus: DeliveryStatus;
  recommendedLeadStep: "vision" | "infrastructure" | "data_platform" | "business_model" | "partnerships";
  deliveryNote: LocalizedText;
  publicRole: LocalizedText;
  privateRole: LocalizedText;
  riskAllocation: LocalizedText;
  contractLens: LocalizedText;
  version: string;
}

export interface FinanceInstrumentSeed {
  id: string;
  name: string;
  nameTh: string;
  category: FinanceCategory;
  segmentFit: CityTier[];
  desc: LocalizedText;
  whyItFits: LocalizedText;
}

export interface CityFinanceProfile {
  cityId: string;
  revenueBase: "strong" | "moderate" | "thin";
  institutionalCapacity: "strong" | "moderate" | "thin";
  projectPipeline: "strong" | "moderate" | "thin";
  privateInterest: "strong" | "moderate" | "thin";
  riskProfile: "low" | "medium" | "high" | "acute";
  deliveryReadiness: "advanced" | "building" | "foundational";
  readinessScore: number;
  segment: CityTier;
  assessedAt: string;
  version: string;
}

export interface CityFinanceRecommendationSupport {
  id: string;
  supportType: "metric" | "evidence";
  metricKey?: string;
  metricLabel?: string;
  sourceId: string;
  sourceUrl: string;
  observedAt: string;
  confidence: number;
  summary: string;
}

export interface CityFinanceRecommendation {
  id: string;
  cityId: string;
  instrumentId: string;
  instrumentName: string;
  priority: FinancePriority;
  priorityScore: number;
  stage: CityReality;
  segment: CityTier;
  reasonSummary: LocalizedText;
  nextStep: LocalizedText;
  whyNow: LocalizedText;
  publicFundingRole: LocalizedText;
  privateCapitalRole: LocalizedText;
  supports: CityFinanceRecommendationSupport[];
  version: string;
}

export interface CityFinanceSignal {
  leadInstrumentId: string;
  leadInstrumentName: string;
  line: LocalizedText;
  readinessScore: number;
}

export interface CityDataRail {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  sourceUrl: string;
}

export interface CityExportMetadata {
  latestObservedAt: string;
  lastVerifiedAt: string;
  provenanceCount: number;
  summaryCsvUrl: string;
  factsCsvUrl: string;
  cityCsvUrl: string;
}

export interface CitySummaryDTO extends SmartCity {
  keyMetrics: CityKeyMetric[];
  shortTailoredNote: LocalizedText;
  financeSignal: CityFinanceSignal;
  exportReady: boolean;
  freshness: {
    latestObservedAt: string;
    lastVerifiedAt: string;
  };
  provenanceCount: number;
}

export interface CityDetailDTO extends CitySummaryDTO {
  metricBlocks: CityMetricBlock[];
  contextNotes: CityContextNote[];
  deliveryProfile: CityDeliveryProfile;
  financeProfile: CityFinanceProfile;
  financeRecommendations: CityFinanceRecommendation[];
  financeInstrumentCatalog: FinanceInstrumentSeed[];
  evidenceItems: EvidenceItem[];
  dataRails: CityDataRail[];
  exportMetadata: CityExportMetadata;
}

export interface CityResearchExportRow {
  city_id: string;
  city_name_en: string;
  city_name_th: string;
  province: string;
  fact_type: "metric" | "recommendation" | "context" | "summary";
  metric_key_or_recommendation_key: string;
  value: string;
  unit: string;
  source_id: string;
  source_url: string;
  observed_at: string;
  confidence: string;
  version: string;
}

const VERSION = "2026.04-cdp-v1";
const DEFAULT_OBSERVED_AT = "2026-04-01T00:00:00.000Z";
const DEFAULT_VERIFIED_AT = "2026-04-04T00:00:00.000Z";

const FINANCE_INSTRUMENTS: FinanceInstrumentSeed[] = [
  {
    id: "ppp-concession",
    name: "PPP / Concession",
    nameTh: "PPP / สัมปทาน",
    category: "equity",
    segmentFit: ["alpha", "beta"],
    desc: {
      en: "Best for infrastructure the city cannot fake: transport, utilities, district energy, and high-volume civic operations.",
      th: "เหมาะกับโครงสร้างพื้นฐานที่หลอกไม่ได้: ขนส่ง สาธารณูปโภค พลังงานระดับย่าน และบริการเมืองปริมาณสูง",
      zh: "适合不能靠PPT伪造的基础设施：交通、公用事业、区域能源和高频市政运营。",
    },
    whyItFits: {
      en: "Works when there is enough demand, enough operating discipline, and a city government that can hold a contract line.",
      th: "ใช้ได้เมื่อมีดีมานด์พอ มีวินัยการเดินระบบพอ และภาครัฐคุมสัญญาได้",
      zh: "当需求、运营纪律和政府的合同管理能力都足够时才真正成立。",
    },
  },
  {
    id: "municipal-revenue-bond",
    name: "Municipal Revenue Bond",
    nameTh: "พันธบัตรรายได้ท้องถิ่น",
    category: "debt",
    segmentFit: ["alpha"],
    desc: {
      en: "Good for cities with visible cashflow from tourism, utilities, or recurring urban service fees.",
      th: "เหมาะกับเมืองที่มีกระแสเงินสดเห็นชัดจากการท่องเที่ยว สาธารณูปโภค หรือค่าบริการเมืองที่เก็บได้จริง",
      zh: "适合拥有旅游、公用事业或稳定城市服务费现金流的城市。",
    },
    whyItFits: {
      en: "It converts strong operating revenue into upfront capex instead of waiting for Bangkok to drip-feed money.",
      th: "มันเปลี่ยนรายได้เดินระบบที่แข็งแรงให้เป็นเงินลงทุนก้อนหน้า แทนการรอเงินจากส่วนกลาง",
      zh: "它能把稳定运营收入提前转成资本开支，而不是等中央慢慢放款。",
    },
  },
  {
    id: "land-value-capture",
    name: "Land Value Capture",
    nameTh: "จับมูลค่าที่ดิน",
    category: "innovative",
    segmentFit: ["alpha", "beta"],
    desc: {
      en: "Fits corridor cities where public investment visibly pushes up land value around stations, campuses, or waterfronts.",
      th: "เหมาะกับเมืองแนวระเบียงที่การลงทุนสาธารณะดันมูลค่าที่ดินรอบสถานี แคมปัส หรือริมน้ำขึ้นชัดเจน",
      zh: "适合公共投资能明显推高车站、校园或滨水片区土地价值的走廊型城市。",
    },
    whyItFits: {
      en: "If the city creates the uplift, it should capture part of that uplift instead of gifting it away.",
      th: "ถ้าเมืองเป็นคนสร้างมูลค่าเพิ่ม เมืองก็ควรเก็บบางส่วนกลับมา ไม่ใช่ปล่อยให้ไหลออกหมด",
      zh: "如果增值由城市创造，城市就该拿回其中一部分。",
    },
  },
  {
    id: "green-climate-bond",
    name: "Green / Climate Bond",
    nameTh: "พันธบัตรสีเขียว / ภูมิอากาศ",
    category: "debt",
    segmentFit: ["alpha", "beta"],
    desc: {
      en: "Best when the city has a real environmental problem and a real capex pipeline to solve it.",
      th: "เหมาะเมื่อเมืองมีปัญหาสิ่งแวดล้อมจริงและมีโครงการลงทุนจริงเพื่อแก้ปัญหานั้น",
      zh: "当城市存在真实环境问题且有真实资本项目去解决时最有意义。",
    },
    whyItFits: {
      en: "The bond story only works if the pollutant, flood risk, or resilience gap is measurable and auditable.",
      th: "เรื่องเล่าของพันธบัตรจะใช้ได้ก็ต่อเมื่อมลพิษ ความเสี่ยงน้ำท่วม หรือช่องว่างด้านความยืดหยุ่น วัดและตรวจสอบได้",
      zh: "只有污染、洪水风险或韧性缺口可测且可审计时，这种工具才不是空话。",
    },
  },
  {
    id: "blended-finance",
    name: "Blended Finance",
    nameTh: "การเงินผสมผสาน",
    category: "hybrid",
    segmentFit: ["beta", "gamma"],
    desc: {
      en: "Useful where a city has decent potential but still needs concessional capital to drag private money into the deal.",
      th: "ใช้ได้เมื่อเมืองมีศักยภาพพอสมควร แต่ยังต้องใช้เงินผ่อนปรนช่วยดึงทุนเอกชนเข้าดีล",
      zh: "适合有潜力但仍需优惠资本为商业资金垫底的城市。",
    },
    whyItFits: {
      en: "This is the bridge between 'not bankable yet' and 'commercially believable'.",
      th: "นี่คือสะพานระหว่าง 'ยังไม่ bankable' กับ 'เริ่มเชื่อทางการค้าได้'",
      zh: "它是“尚不可融资”和“开始具备商业可信度”之间的桥。",
    },
  },
  {
    id: "performance-contract",
    name: "Performance Contract",
    nameTh: "สัญญาอิงผลลัพธ์",
    category: "hybrid",
    segmentFit: ["alpha", "beta", "gamma"],
    desc: {
      en: "Good for lighting, water, waste, and energy retrofits where savings or service outcomes can be measured.",
      th: "เหมาะกับไฟส่องสว่าง น้ำ ขยะ และการปรับปรุงพลังงานที่วัดผลประหยัดหรือผลบริการได้",
      zh: "适用于照明、供水、废弃物和节能改造等可量化节省或服务结果的场景。",
    },
    whyItFits: {
      en: "Cities that cannot stomach big capex can still pay for verified outcomes.",
      th: "เมืองที่ยังรับ capex ก้อนใหญ่ไม่ไหว ยังสามารถจ่ายตามผลลัพธ์ที่พิสูจน์ได้",
      zh: "即便扛不起大额前期投资，城市仍可为已验证结果付费。",
    },
  },
  {
    id: "dfi-cofinance",
    name: "DFI Co-finance",
    nameTh: "เงินร่วมลงทุนจาก DFI",
    category: "grant",
    segmentFit: ["beta", "gamma"],
    desc: {
      en: "Works when cities need credibility, technical diligence, and patient capital before commercial debt is realistic.",
      th: "เหมาะเมื่อเมืองต้องการความน่าเชื่อถือ การตรวจสอบเชิงเทคนิค และทุนอดทน ก่อนที่หนี้พาณิชย์จะสมเหตุผล",
      zh: "当城市在走向商业债务前仍需要可信度、技术尽调和耐心资本时最好用。",
    },
    whyItFits: {
      en: "ADB, JICA, and similar players often matter more as signal amplifiers than as raw money.",
      th: "ADB, JICA และพวกเดียวกัน บางทีสำคัญในฐานะตัวขยายความน่าเชื่อถือ มากกว่าแค่ตัวเงิน",
      zh: "ADB、JICA 等机构很多时候作为信誉放大器比单纯给钱更关键。",
    },
  },
  {
    id: "technical-assistance-grant",
    name: "Technical Assistance Grant",
    nameTh: "ทุนช่วยเหลือทางเทคนิค",
    category: "grant",
    segmentFit: ["beta", "gamma"],
    desc: {
      en: "Right for cities that still need pipeline design, data governance, feasibility work, and procurement readiness.",
      th: "เหมาะกับเมืองที่ยังต้องปั้น pipeline ออกแบบธรรมาภิบาลข้อมูล ศึกษาความเป็นไปได้ และเตรียม procurement",
      zh: "适合仍需打磨项目管线、数据治理、可行性研究和采购准备的城市。",
    },
    whyItFits: {
      en: "If the city cannot define the project cleanly, throwing bigger money at it is just a more expensive mess.",
      th: "ถ้าเมืองยังนิยามโครงการไม่ชัด เอาเงินก้อนใหญ่ไปใส่ก็แค่ทำให้ความเละเทะแพงขึ้น",
      zh: "如果项目定义都还没站稳，往里砸更大的钱只是更贵的混乱。",
    },
  },
  {
    id: "government-budget",
    name: "Government Budget / Grant",
    nameTh: "งบประมาณ / เงินอุดหนุนภาครัฐ",
    category: "grant",
    segmentFit: ["alpha", "beta", "gamma"],
    desc: {
      en: "Still the right tool for public goods, data plumbing, resilience basics, and services with weak direct revenue.",
      th: "ยังเป็นเครื่องมือที่ถูกต้องสำหรับของสาธารณะ โครงข้อมูลพื้นฐาน พื้นฐานความยืดหยุ่น และบริการที่หารายได้ตรงยาก",
      zh: "对于公共品、数据底座、韧性基础和难以直接收费的服务，它依然是正确工具。",
    },
    whyItFits: {
      en: "Some things should not be tortured into fake bankability just to sound sophisticated.",
      th: "บางอย่างไม่ควรถูกบิดให้ดู bankable ปลอมๆ แค่เพื่อให้ฟังหรู",
      zh: "有些项目不该为了显得高级而被硬拗成“可融资”。",
    },
  },
  {
    id: "pooled-procurement",
    name: "Pooled Procurement",
    nameTh: "จัดซื้อรวม",
    category: "innovative",
    segmentFit: ["gamma"],
    desc: {
      en: "Small cities can buy smarter by bundling commodity technology, maintenance, and support instead of pretending each city is a unicorn.",
      th: "เมืองเล็กซื้อให้ฉลาดขึ้นได้ด้วยการรวมความต้องการเทคโนโลยีพื้นฐาน บำรุงรักษา และซัพพอร์ต แทนการแกล้งทำว่าแต่ละเมืองเป็นยูนิคอร์น",
      zh: "小城市应把基础技术、维护和支持打包采购，而不是假装每座城都是独角兽。",
    },
    whyItFits: {
      en: "For gamma cities, scale usually comes from the buying coalition, not from the city itself.",
      th: "สำหรับเมือง gamma ขนาดมักไม่ได้มาจากตัวเมือง แต่มาจากการรวมกันซื้อ",
      zh: "对 gamma 城市来说，规模通常来自联合采购，而不是单城本身。",
    },
  },
  {
    id: "asset-recycling",
    name: "Asset Recycling",
    nameTh: "รีไซเคิลสินทรัพย์รัฐ",
    category: "equity",
    segmentFit: ["alpha"],
    desc: {
      en: "Strong fit where a city owns valuable land or legacy assets and needs to free capital for new infrastructure.",
      th: "เหมาะมากเมื่อเมืองถือครองที่ดินหรือสินทรัพย์เดิมที่มีมูลค่า และต้องการปลดทุนไปลงโครงสร้างพื้นฐานใหม่",
      zh: "适合掌握高价值土地或存量资产、需要释放资本投向新基础设施的城市。",
    },
    whyItFits: {
      en: "Better than begging for new money while underused public assets sit there doing nothing.",
      th: "ดีกว่านั่งขอเงินใหม่ ทั้งที่สินทรัพย์รัฐที่ใช้ไม่คุ้มยังนอนนิ่งอยู่",
      zh: "总比一边哭穷一边把闲置公共资产晾着强。",
    },
  },
];

const TIER_PROCESS_COPY: Record<CityTier, LocalizedText> = {
  alpha: {
    en: "Alpha cities should invest forward: infrastructure-scale finance, corridor monetization, and contract discipline. This is not the tier for passive grant dependency.",
    th: "เมือง Alpha ต้องลงทุนเชิงรุก: การเงินระดับโครงสร้างพื้นฐาน การดึงมูลค่าจากระเบียงพัฒนา และวินัยสัญญา นี่ไม่ใช่ระดับที่ควรรอเงินอุดหนุนแบบรับชะตา",
    zh: "Alpha 城市应主动投资：做基础设施级融资、走廊变现和严密合同管理，而不是被动等补助。",
  },
  beta: {
    en: "Beta cities need phased delivery: blended finance, performance contracts, and readiness-building before going full commercial.",
    th: "เมือง Beta ต้องเดินแบบเป็นช่วง: blended finance, performance contract และการสร้าง readiness ก่อนจะไปเชิงพาณิชย์เต็มตัว",
    zh: "Beta 城市需要分阶段交付：先做混合融资、绩效合同和准备度建设，再谈完全商业化。",
  },
  gamma: {
    en: "Gamma cities should build the boring essentials first: grants, pooled procurement, data plumbing, and civic-scale pilots before dashboard theatre.",
    th: "เมือง Gamma ต้องสร้างของจำเป็นที่น่าเบื่อก่อน: เงินอุดหนุน การจัดซื้อรวม ระบบข้อมูลพื้นฐาน และ pilot ขนาดชุมชน ก่อนจะเล่นละครแดชบอร์ด",
    zh: "Gamma 城市应先把那些“无聊但必要”的底座搭好：补助、联合采购、数据底座和社区级试点，然后再谈仪表板表演。",
  },
};

const METRIC_SOURCE_LOOKUP: Record<string, string> = {
  population: "nso",
  gppPerCapita: "nesdc",
  avgMonthlyIncome: "nso",
  pm25Annual: "pcd",
  hospitalBedsPer10k: "moph",
  crimeRatePer100k: "rtp",
  greenCoverage: "gistda",
  gppGrowthRate: "nesdc",
  laborForce: "nso",
  industryComposition: "nesdc",
  pm25Trend: "pcd",
  waterQuality: "onep",
  forestCoverage: "rfd",
  fdiInflow: "boi",
  dataLastUpdated: "citydata",
};

type CityDetailBuild = {
  summary: CitySummaryDTO;
  detail: CityDetailDTO;
  exportRows: CityResearchExportRow[];
};

function localized(en: string, th: string, zh = en): LocalizedText {
  return { en, th, zh };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function strengthLabel(score: number): "strong" | "moderate" | "thin" {
  if (score >= 70) return "strong";
  if (score >= 45) return "moderate";
  return "thin";
}

function statusFromScore(score: number): DeliveryStatus {
  if (score >= 72) return "ready";
  if (score >= 48) return "building";
  return "gap";
}

function getSource(sourceId: string): DataSource {
  return dataSources.find(source => source.id === sourceId) ?? {
    id: sourceId,
    name: sourceId.toUpperCase(),
    type: "government",
    descEn: "",
    descTh: "",
    descZh: "",
    url: "",
    updateFrequency: "Annual",
    metrics: [],
  };
}

function formatMetricValue(metricKey: string, value: number | string | undefined): { text: string; unit: string } {
  if (value === undefined) return { text: "", unit: "" };

  if (typeof value === "string") {
    return { text: value, unit: "" };
  }

  if (metricKey === "population") {
    return { text: `${value.toLocaleString()}K`, unit: "people" };
  }
  if (metricKey === "gppPerCapita" || metricKey === "avgMonthlyIncome" || metricKey === "fdiInflow") {
    return { text: `฿${value.toLocaleString()}`, unit: "THB" };
  }
  if (metricKey === "pm25Annual") {
    return { text: `${value}`, unit: "ug/m3" };
  }
  if (metricKey === "greenCoverage" || metricKey === "forestCoverage" || metricKey === "gppGrowthRate") {
    return { text: `${value}`, unit: "%" };
  }
  if (metricKey === "hospitalBedsPer10k") {
    return { text: `${value}`, unit: "beds/10k" };
  }
  if (metricKey === "crimeRatePer100k") {
    return { text: `${value}`, unit: "incidents/100k" };
  }
  return { text: `${value}`, unit: "" };
}

function latestDate(values: string[]): string {
  const filtered = values.filter(Boolean);
  if (!filtered.length) return DEFAULT_OBSERVED_AT;
  const sorted = filtered.slice().sort();
  return sorted[sorted.length - 1] ?? DEFAULT_OBSERVED_AT;
}

function strongestPillars(city: SmartCity): ScoringPillar[] {
  return [...SCORING_PILLARS]
    .sort((left, right) => city.scores[right] - city.scores[left])
    .slice(0, 2);
}

function weakestPillars(city: SmartCity): ScoringPillar[] {
  return [...SCORING_PILLARS]
    .sort((left, right) => city.scores[left] - city.scores[right])
    .slice(0, 2);
}

function pillarLabel(pillar: ScoringPillar): string {
  if (pillar === "livability") return "livability";
  if (pillar === "wellbeing") return "wellbeing";
  return pillar;
}

function citySpecificOpportunity(city: SmartCity, context?: CityContext): LocalizedText {
  if (context) {
    return localized(
      context.opportunity.en,
      context.opportunity.th,
      context.opportunity.en,
    );
  }

  const [strongest] = strongestPillars(city);
  const dimension = city.smartDimensions[0] ?? "people";
  return localized(
    `${city.nameEn} has room to turn its ${pillarLabel(strongest)} advantage into a city product instead of another presentation. The clearest wedge is ${dimension} delivery backed by hard metrics.`,
    `${city.nameTh} มีโอกาสเปลี่ยนจุดแข็งด้าน${pillarLabel(strongest)} ให้กลายเป็นผลิตภัณฑ์ของเมืองจริง ไม่ใช่แค่สไลด์ โดยเริ่มจากการส่งมอบด้าน${dimension} ที่ผูกกับตัวชี้วัดจริง`,
    `${city.nameEn} can turn its ${pillarLabel(strongest)} edge into a real city product. The clearest wedge is ${dimension} delivery tied to hard metrics.`,
  );
}

function citySpecificConstraint(city: SmartCity, context?: CityContext): LocalizedText {
  if (context) {
    return localized(context.theCatch.en, context.theCatch.th, context.theCatch.en);
  }

  const [weakest] = weakestPillars(city);
  const pm = city.metrics.pm25Annual;
  if (typeof pm === "number" && pm > 35) {
    return localized(
      `Air quality is not a side note here. PM2.5 at ${pm} means the city cannot claim livability leadership without a serious environmental pipeline.`,
      `คุณภาพอากาศไม่ใช่เรื่องข้างเคียงของเมืองนี้ PM2.5 ที่ ${pm} แปลว่าเมืองจะอ้างความน่าอยู่ไม่ได้ ถ้าไม่มี pipeline ด้านสิ่งแวดล้อมที่จริงจัง`,
      `Air quality is not a side note. PM2.5 at ${pm} means the city cannot claim livability leadership without a serious environmental pipeline.`,
    );
  }

  return localized(
    `The weakest drag is ${pillarLabel(weakest)}. If that stays soft, the city will keep getting capped no matter how polished the narrative sounds.`,
    `ตัวฉุดหลักคือด้าน${pillarLabel(weakest)} ถ้าจุดนี้ยังอ่อน เมืองจะถูกกดเพดานต่อให้เล่าเรื่องเก่งแค่ไหนก็ตาม`,
    `The weakest drag is ${pillarLabel(weakest)}. If it stays soft, the city will keep getting capped no matter how polished the narrative becomes.`,
  );
}

function citySpecificWarning(city: SmartCity): LocalizedText {
  if (city.reality === "planned") {
    return localized(
      "Do not finance dashboard theatre before the physical city exists. Pipe, wire, rights-of-way, and service operators come first.",
      "อย่าไปลงเงินกับ dashboard theatre ก่อนที่เมืองทางกายภาพจะมีจริง ท่อ สาย สิทธิทาง และผู้เดินระบบ ต้องมาก่อน",
      "Do not fund dashboard theatre before the physical city exists. Pipes, wires, rights-of-way, and operators come first.",
    );
  }

  if ((city.metrics.population ?? 0) < 100) {
    return localized(
      "This city is small enough to prototype fast. That also means bad procurement choices get very visible, very quickly.",
      "เมืองนี้เล็กพอที่จะทดลองได้เร็ว แปลว่าถ้าจัดซื้อพลาด ความพลาดจะมองเห็นชัดและเร็วเหมือนกัน",
      "This city is small enough to prototype fast. That also means bad procurement becomes visible very quickly.",
    );
  }

  return localized(
    "The failure mode is generic copy-paste. The city needs a delivery stack tied to its own metrics, not borrowed swagger from a different urban economy.",
    "โหมดล้มเหลวของเมืองนี้คือการ copy-paste แบบเหมารวม เมืองต้องมี delivery stack ที่ผูกกับตัวเลขของตัวเอง ไม่ใช่ยืม swagger จากเศรษฐกิจเมืองอื่น",
    "The failure mode here is generic copy-paste. The delivery stack must tie back to local metrics, not borrowed swagger from another city.",
  );
}

function citySpecificLesson(city: SmartCity, context?: CityContext): LocalizedText {
  if (context) {
    return localized(
      context.opportunity.en,
      context.opportunity.th,
      context.opportunity.en,
    );
  }

  const [strongest] = strongestPillars(city);
  return localized(
    `${city.nameEn} is most exportable when it acts like itself. The reusable lesson is how it turns ${pillarLabel(strongest)} into something operational.`,
    `${city.nameTh} ส่งออกบทเรียนได้ดีที่สุดเมื่อมันเป็นตัวเองจริงๆ บทเรียนที่ถอดซ้ำได้คือการเปลี่ยน${pillarLabel(strongest)} ให้เป็นระบบปฏิบัติการ`,
    `${city.nameEn} becomes exportable when it acts like itself. The reusable lesson is how it turns ${pillarLabel(strongest)} into operations.`,
  );
}

function metricLabel(metricKey: string): LocalizedText {
  switch (metricKey) {
    case "population":
      return localized("Population", "ประชากร", "人口");
    case "gppPerCapita":
      return localized("GPP per capita", "GPP ต่อหัว", "人均 GPP");
    case "avgMonthlyIncome":
      return localized("Average monthly income", "รายได้เฉลี่ยต่อเดือน", "月均收入");
    case "pm25Annual":
      return localized("Annual PM2.5", "PM2.5 เฉลี่ยรายปี", "年均 PM2.5");
    case "hospitalBedsPer10k":
      return localized("Hospital beds / 10K", "เตียงโรงพยาบาล / หมื่นคน", "每万人床位");
    case "crimeRatePer100k":
      return localized("Crime / 100K", "อาชญากรรม / แสนคน", "每十万人犯罪率");
    case "greenCoverage":
      return localized("Green coverage", "พื้นที่สีเขียว", "绿化覆盖");
    default:
      return localized(metricKey, metricKey, metricKey);
  }
}

function metricMethod(metricKey: string): string {
  switch (metricKey) {
    case "population":
      return "Baseline city population from index input; used as scale proxy.";
    case "gppPerCapita":
      return "Provincial economic productivity proxy; used for revenue and demand scoring.";
    case "avgMonthlyIncome":
      return "Household earning proxy; used for affordability and fee tolerance.";
    case "pm25Annual":
      return "Environmental stress proxy; used for resilience and green finance scoring.";
    case "hospitalBedsPer10k":
      return "Public service capacity proxy; used for wellbeing and delivery maturity.";
    case "crimeRatePer100k":
      return "Risk proxy; used for contractability and investor comfort.";
    case "greenCoverage":
      return "Land/environment quality proxy; used for resilience and amenity value.";
    default:
      return "Derived from the city baseline dataset.";
  }
}

function buildMetricObservations(city: SmartCity): CityMetricObservation[] {
  const metrics = city.metrics;
  const keepZeroMetrics = new Set(["population", "gppPerCapita", "avgMonthlyIncome"]);
  const entries: Array<[string, number | string | undefined]> = [
    ["population", metrics.population],
    ["gppPerCapita", metrics.gppPerCapita],
    ["avgMonthlyIncome", metrics.avgMonthlyIncome],
    ["pm25Annual", metrics.pm25Annual],
    ["hospitalBedsPer10k", metrics.hospitalBedsPer10k],
    ["crimeRatePer100k", metrics.crimeRatePer100k],
    ["greenCoverage", metrics.greenCoverage],
  ];

  return entries
    .filter(([metricKey, value]) => value !== undefined && value !== null && (value !== 0 || keepZeroMetrics.has(metricKey)))
    .map(([metricKey, value]) => {
      const sourceId = METRIC_SOURCE_LOOKUP[metricKey] ?? "field";
      const source = getSource(sourceId);
      const formatted = formatMetricValue(metricKey, value);
      const observedAt = metricKey === "pm25Annual" ? "2026-03-01T00:00:00.000Z" : DEFAULT_OBSERVED_AT;

      return {
        cityId: city.id,
        metricKey,
        label: metricLabel(metricKey),
        metricValueNum: typeof value === "number" ? value : null,
        metricValueText: typeof value === "string" ? value : formatted.text,
        unit: formatted.unit || null,
        periodLabel: metricKey === "pm25Annual" ? "2025 annual average" : "2025 baseline",
        sourceId,
        sourceName: source.name,
        sourceUrl: source.url,
        observedAt,
        confidence: city.dataConfidence === "high" ? 0.9 : city.dataConfidence === "medium" ? 0.75 : 0.6,
        methodNote: metricMethod(metricKey),
        verifiedAt: DEFAULT_VERIFIED_AT,
        version: VERSION,
      };
    });
}

function buildMetricBlocks(city: SmartCity, observations: CityMetricObservation[]): CityMetricBlock[] {
  const economic = observations.filter(item => ["population", "gppPerCapita", "avgMonthlyIncome"].includes(item.metricKey));
  const risk = observations.filter(item => ["pm25Annual", "crimeRatePer100k", "greenCoverage"].includes(item.metricKey));
  const service = observations.filter(item => ["hospitalBedsPer10k"].includes(item.metricKey));

  return [
    {
      id: "economic-readiness",
      title: localized("Economic readiness", "ฐานเศรษฐกิจ", "经济基础"),
      summary: localized(
        "What scale of capital this city can plausibly absorb without making up demand.",
        "เมืองนี้รับเงินลงทุนระดับไหนได้จริงโดยไม่ต้องแต่งดีมานด์",
        "This block shows how much capital the city can plausibly absorb without inventing demand.",
      ),
      observations: economic,
    },
    {
      id: "risk-and-resilience",
      title: localized("Risk and resilience", "ความเสี่ยงและความยืดหยุ่น", "风险与韧性"),
      summary: localized(
        "The constraint stack that should shape finance structure, contract terms, and sequencing.",
        "ชุดข้อจำกัดที่ต้องกำหนดโครงสร้างการเงิน เงื่อนไขสัญญา และลำดับงาน",
        "These constraints should shape financing structure, contract terms, and sequencing.",
      ),
      observations: risk,
    },
    {
      id: "service-capacity",
      title: localized("Service capacity", "ศักยภาพบริการสาธารณะ", "服务能力"),
      summary: localized(
        "Signals for whether the city can operate systems after ribbon-cutting day.",
        "สัญญาณว่าเมืองจะเดินระบบต่อหลังวันตัดริบบิ้นได้หรือไม่",
        "Signals of whether the city can run systems after ribbon-cutting day.",
      ),
      observations: service,
    },
  ].filter(block => block.observations.length > 0);
}

function revenueBaseScore(city: SmartCity): number {
  let score = city.scores.economy * 0.45 + city.compositeScore * 0.2;
  const gpp = city.metrics.gppPerCapita ?? 0;
  const income = city.metrics.avgMonthlyIncome ?? 0;
  const population = city.metrics.population ?? 0;

  if (gpp >= 450000) score += 24;
  else if (gpp >= 250000) score += 16;
  else if (gpp >= 120000) score += 10;
  else score += 4;

  if (income >= 30000) score += 12;
  else if (income >= 22000) score += 8;
  else if (income >= 15000) score += 4;

  if (population >= 500) score += 8;
  else if (population >= 150) score += 4;

  return clamp(score / 1.25, 0, 100);
}

function institutionalCapacityScore(city: SmartCity): number {
  let score = city.scores.digital * 0.4 + city.scores.safety * 0.15 + city.scores.wellbeing * 0.15;
  score += city.smartDimensions.length * 3;

  if (city.dataConfidence === "high") score += 15;
  else if (city.dataConfidence === "medium") score += 9;
  else score += 4;

  if (city.reality === "operational") score += 16;
  else if (city.reality === "partial") score += 9;
  else score -= 10;

  return clamp(score, 0, 100);
}

function projectPipelineScore(city: SmartCity, evidence: EvidenceItem[]): number {
  let score = city.scores.digital * 0.2 + city.scores.livability * 0.2 + city.scores.environment * 0.1;
  score += city.highlights.length * 5 + evidence.length * 3;

  if (city.reality === "operational") score += 20;
  else if (city.reality === "partial") score += 10;
  else score -= 6;

  return clamp(score, 0, 100);
}

function privateInterestScore(city: SmartCity, context?: CityContext): number {
  let score = city.scores.economy * 0.35 + city.scores.hospitality * 0.2 + city.scores.digital * 0.15;
  if (city.region === "east" || city.region === "bangkok" || city.region === "south") score += 10;
  if (city.metrics.gppPerCapita && city.metrics.gppPerCapita > 350000) score += 12;
  if (city.metrics.population && city.metrics.population > 300) score += 8;

  const contextText = `${context?.livelihood.en ?? ""} ${context?.famousFor.en ?? ""}`.toLowerCase();
  if (contextText.includes("tourism") || contextText.includes("industrial") || contextText.includes("startup")) {
    score += 10;
  }

  return clamp(score, 0, 100);
}

function riskProfile(city: SmartCity): "low" | "medium" | "high" | "acute" {
  if (city.reality === "planned" && (city.metrics.population ?? 0) === 0) return "acute";
  if ((city.metrics.crimeRatePer100k ?? 0) >= 220 || (city.metrics.pm25Annual ?? 0) >= 45) return "high";
  if ((city.metrics.crimeRatePer100k ?? 0) >= 150 || (city.metrics.pm25Annual ?? 0) >= 30) return "medium";
  return "low";
}

function buildFinanceProfile(city: SmartCity, evidence: EvidenceItem[], context?: CityContext): CityFinanceProfile {
  const revenue = revenueBaseScore(city);
  const capacity = institutionalCapacityScore(city);
  const pipeline = projectPipelineScore(city, evidence);
  const privateInterest = privateInterestScore(city, context);
  const risk = riskProfile(city);
  const readinessRaw = revenue * 0.3 + capacity * 0.3 + pipeline * 0.25 + privateInterest * 0.15;
  const riskPenalty = risk === "acute" ? 18 : risk === "high" ? 10 : risk === "medium" ? 5 : 0;
  const readinessScore = clamp(Math.round(readinessRaw - riskPenalty), 0, 100);

  return {
    cityId: city.id,
    revenueBase: strengthLabel(revenue),
    institutionalCapacity: strengthLabel(capacity),
    projectPipeline: strengthLabel(pipeline),
    privateInterest: strengthLabel(privateInterest),
    riskProfile: risk,
    deliveryReadiness: readinessScore >= 70 ? "advanced" : readinessScore >= 48 ? "building" : "foundational",
    readinessScore,
    segment: city.tier,
    assessedAt: DEFAULT_VERIFIED_AT,
    version: VERSION,
  };
}

function buildDeliveryProfile(city: SmartCity, finance: CityFinanceProfile, observations: CityMetricObservation[]): CityDeliveryProfile {
  const hasEconomicSignal = observations.some(item => item.metricKey === "gppPerCapita");
  const hasEnvironmentalSignal = observations.some(item => item.metricKey === "pm25Annual" || item.metricKey === "greenCoverage");
  const hasServiceSignal = observations.some(item => item.metricKey === "hospitalBedsPer10k");

  const visionScore = city.reality === "planned" ? 58 : city.compositeScore + city.smartDimensions.length * 2;
  const infrastructureScore = city.scores.livability * 0.5 + city.scores.safety * 0.2 + city.scores.environment * 0.3;
  const dataPlatformScore = city.scores.digital * 0.45 + (city.dataConfidence === "high" ? 22 : city.dataConfidence === "medium" ? 12 : 4);
  const businessModelScore = finance.readinessScore * 0.65 + (hasEconomicSignal ? 10 : 0) + (city.reality === "operational" ? 12 : 2);
  const partnershipScore = city.scores.hospitality * 0.35 + city.scores.wellbeing * 0.2 + city.scores.economy * 0.2 + (hasServiceSignal ? 8 : 0) + (hasEnvironmentalSignal ? 6 : 0);

  const stepStatus = {
    visionStatus: statusFromScore(visionScore),
    infrastructureStatus: statusFromScore(infrastructureScore),
    dataPlatformStatus: statusFromScore(dataPlatformScore),
    businessModelStatus: statusFromScore(businessModelScore),
    partnershipStatus: statusFromScore(partnershipScore),
  };

  const ordered: Array<[CityDeliveryProfile["recommendedLeadStep"], DeliveryStatus]> = [
    ["infrastructure", stepStatus.infrastructureStatus],
    ["data_platform", stepStatus.dataPlatformStatus],
    ["business_model", stepStatus.businessModelStatus],
    ["partnerships", stepStatus.partnershipStatus],
    ["vision", stepStatus.visionStatus],
  ];

  const recommendedLeadStep =
    ordered.find(([, status]) => status === "gap")?.[0] ??
    ordered.find(([, status]) => status === "building")?.[0] ??
    "vision";

  return {
    cityId: city.id,
    ...stepStatus,
    recommendedLeadStep,
    deliveryNote: TIER_PROCESS_COPY[city.tier],
    publicRole: localized(
      city.tier === "alpha"
        ? "Set the corridor logic, hold the concession line, and protect public interest with measurable KPIs."
        : city.tier === "beta"
          ? "Anchor the pipeline, de-risk first-loss pieces, and keep the city from overpromising."
          : "Fund the boring baseline, standardize procurement, and protect service continuity.",
      city.tier === "alpha"
        ? "รัฐต้องกำหนดตรรกะของ corridor คุมเส้นสัญญา และปกป้องประโยชน์สาธารณะด้วย KPI ที่วัดได้"
        : city.tier === "beta"
          ? "รัฐต้องยึด pipeline ลดความเสี่ยงในชิ้น first-loss และกันไม่ให้เมืองขายฝันเกินจริง"
          : "รัฐต้องจ่ายของพื้นฐานที่น่าเบื่อ มาตรฐาน procurement และคุ้มครองความต่อเนื่องของบริการ",
      city.tier === "alpha"
        ? "Government should set corridor logic, hold the contract line, and protect public interest with measurable KPIs."
        : city.tier === "beta"
          ? "Government should anchor the pipeline, de-risk first-loss pieces, and stop the city from overselling."
          : "Government should fund the boring baseline, standardize procurement, and protect service continuity.",
    ),
    privateRole: localized(
      city.tier === "alpha"
        ? "Bring capex, operating know-how, and revenue discipline where demand is already visible."
        : city.tier === "beta"
          ? "Co-invest in phased systems after the city proves the first operating metrics."
          : "Supply practical service packages and maintenance, not vanity tech stacks.",
      city.tier === "alpha"
        ? "เอกชนต้องเอา capex ความรู้เดินระบบ และวินัยรายได้เข้ามา ในจุดที่ดีมานด์เห็นชัดอยู่แล้ว"
        : city.tier === "beta"
          ? "เอกชนควรร่วมลงทุนแบบเป็นช่วง หลังเมืองพิสูจน์ตัวเลขปฏิบัติการชุดแรกได้แล้ว"
          : "เอกชนควรขายชุดบริการใช้งานจริงพร้อมบำรุงรักษา ไม่ใช่สแต็กเทคโชว์",
      city.tier === "alpha"
        ? "Private capital should bring capex, operating know-how, and revenue discipline where demand is already visible."
        : city.tier === "beta"
          ? "Private capital should co-invest in phases once the city proves first operating metrics."
          : "Private providers should supply practical service packages and maintenance, not vanity tech stacks.",
    ),
    riskAllocation: localized(
      finance.riskProfile === "low"
        ? "Construction and operating risk can move outward; policy and land assembly should stay public."
        : finance.riskProfile === "medium"
          ? "Keep demand risk partly public until usage data firms up. Push performance risk to operators."
          : "Do not dump core demand risk on the private side. Stage the project until the city earns trust with data.",
      finance.riskProfile === "low"
        ? "ความเสี่ยงก่อสร้างและเดินระบบโยนออกไปได้ แต่ความเสี่ยงเชิงนโยบายและการจัดที่ดินควรอยู่ฝั่งรัฐ"
        : finance.riskProfile === "medium"
          ? "ความเสี่ยงดีมานด์ควรยังอยู่กับรัฐบางส่วนจนกว่าข้อมูลการใช้งานจะนิ่ง ส่วนความเสี่ยงผลงานให้ผู้เดินระบบรับ"
          : "อย่าโยนความเสี่ยงดีมานด์หลักไปฝั่งเอกชน ให้แบ่งเป็นช่วงจนเมืองสร้างความเชื่อมั่นจากข้อมูลได้ก่อน",
      finance.riskProfile === "low"
        ? "Construction and operating risk can move outward, but policy and land assembly should stay public."
        : finance.riskProfile === "medium"
          ? "Keep some demand risk public until usage data settles. Push performance risk to operators."
          : "Do not dump core demand risk on the private side. Stage the project until the city earns trust with data.",
    ),
    contractLens: localized(
      recommendedLeadStep === "business_model"
        ? "Write the operating model before buying the hardware. Opex discipline beats shiny procurement."
        : recommendedLeadStep === "data_platform"
          ? "Contract for data standards, uptime, and interoperability. Not just dashboards and screenshots."
          : recommendedLeadStep === "infrastructure"
            ? "Tie payment to service availability, resilience, and maintenance handover."
            : "Use contracts to sequence readiness, not to pretend readiness already exists.",
      recommendedLeadStep === "business_model"
        ? "เขียน operating model ก่อนซื้อ hardware วินัย Opex สำคัญกว่า procurement สวยๆ"
        : recommendedLeadStep === "data_platform"
          ? "ทำสัญญาเรื่องมาตรฐานข้อมูล uptime และ interoperability ไม่ใช่แค่ dashboard กับ screenshot"
          : recommendedLeadStep === "infrastructure"
            ? "ผูกการจ่ายกับความพร้อมใช้งาน ความยืดหยุ่น และการส่งมอบงานบำรุงรักษา"
            : "ใช้สัญญาเพื่อจัดลำดับ readiness ไม่ใช่แกล้งทำว่า readiness มีอยู่แล้ว",
      recommendedLeadStep === "business_model"
        ? "Write the operating model before buying hardware. Opex discipline beats shiny procurement."
        : recommendedLeadStep === "data_platform"
          ? "Contract for data standards, uptime, and interoperability. Not just dashboards and screenshots."
          : recommendedLeadStep === "infrastructure"
            ? "Tie payment to service availability, resilience, and maintenance handover."
            : "Use contracts to sequence readiness, not to pretend readiness already exists.",
    ),
    version: VERSION,
  };
}

function buildDataRails(city: SmartCity): CityDataRail[] {
  return [
    {
      id: "local-ops",
      label: localized("Local operations rail", "รางข้อมูลปฏิบัติการท้องถิ่น", "本地运营数据轨"),
      description: localized(
        `${city.nameEn} needs live service data from municipal ops, utilities, and frontline incident handling. If the city cannot see operations, it cannot run them.`,
        `${city.nameTh} ต้องมีข้อมูลบริการสดจากงานเทศบาล สาธารณูปโภค และการรับเหตุหน้างาน ถ้าเมืองมองไม่เห็นการปฏิบัติการ เมืองก็เดินระบบไม่ได้`,
        `${city.nameEn} needs live service data from municipal ops, utilities, and frontline incident handling. If the city cannot see operations, it cannot run them.`,
      ),
      sourceUrl: getCityDataUrl(city.nameEn),
    },
    {
      id: "national-stack",
      label: localized("National data stack", "รางข้อมูลระดับชาติ", "国家数据栈"),
      description: localized(
        "NSO, NESDC, PCD, BOI, and other national rails should feed the city profile so local claims sit on verifiable baselines.",
        "NSO, NESDC, PCD, BOI และรางข้อมูลระดับชาติอื่นต้องไหลเข้าโปรไฟล์เมือง เพื่อให้คำอ้างอิงท้องถิ่นตั้งอยู่บนฐานที่ตรวจสอบได้",
        "NSO, NESDC, PCD, BOI, and other national rails should feed the city profile so local claims sit on verifiable baselines.",
      ),
      sourceUrl: getOpenDataSearchUrl(city.province),
    },
    {
      id: "public-research",
      label: localized("Public research rail", "รางข้อมูลสาธารณะเพื่อวิจัย", "公共研究数据轨"),
      description: localized(
        "Exports should flatten the city dossier into rows researchers can audit, download, and challenge without asking for special access.",
        "การ export ต้อง flatten dossier ของเมืองออกเป็นแถวข้อมูลที่นักวิจัยดาวน์โหลด ตรวจ และโต้แย้งได้ โดยไม่ต้องขอสิทธิพิเศษ",
        "Exports should flatten the city dossier into rows researchers can audit, download, and challenge without asking for special access.",
      ),
      sourceUrl: `/api/cities/${city.id}/export.csv`,
    },
  ];
}

function buildSupportFromMetric(city: SmartCity, metric: CityMetricObservation, summary: string): CityFinanceRecommendationSupport {
  return {
    id: `${city.id}-${metric.metricKey}`,
    supportType: "metric",
    metricKey: metric.metricKey,
    metricLabel: metric.label.en,
    sourceId: metric.sourceId,
    sourceUrl: metric.sourceUrl,
    observedAt: metric.observedAt,
    confidence: metric.confidence,
    summary,
  };
}

function buildSupportFromEvidence(city: SmartCity, evidence: EvidenceItem): CityFinanceRecommendationSupport {
  return {
    id: `${city.id}-${evidence.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    supportType: "evidence",
    sourceId: evidence.source.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "field",
    sourceUrl: evidence.url ?? "",
    observedAt: evidence.date.length === 4 ? `${evidence.date}-01-01T00:00:00.000Z` : DEFAULT_OBSERVED_AT,
    confidence: evidence.type === "field" ? 0.92 : evidence.type === "government" ? 0.88 : 0.8,
    summary: evidence.titleEn,
  };
}

type InstrumentScore = {
  instrument: FinanceInstrumentSeed;
  score: number;
  reason: string;
  drivers: CityFinanceRecommendationSupport[];
  whyNow: string;
  nextStep: string;
};

function scoreInstruments(
  city: SmartCity,
  finance: CityFinanceProfile,
  observations: CityMetricObservation[],
  evidence: EvidenceItem[],
): InstrumentScore[] {
  const metricByKey = new Map(observations.map(item => [item.metricKey, item]));
  const topEvidence = evidence[0];
  const touristPattern = /tourism|visitor|island|beach|hospitality/i.test(
    `${city.tagline} ${city.highlights.join(" ")} ${cityContexts[city.id]?.livelihood.en ?? ""}`,
  );
  const industrialPattern = /industrial|petrochemical|manufacturing|eec|logistics|energy/i.test(
    `${city.tagline} ${city.highlights.join(" ")} ${cityContexts[city.id]?.livelihood.en ?? ""}`,
  );
  const corridorPattern = /corridor|lrt|transit|station|campus|district|waterfront/i.test(
    `${city.tagline} ${city.highlights.join(" ")} ${cityContexts[city.id]?.famousFor.en ?? ""} ${city.highlights.join(" ")}`,
  );

  return FINANCE_INSTRUMENTS
    .filter(instrument => instrument.segmentFit.includes(city.tier))
    .map(instrument => {
      let score = 20;
      const drivers: CityFinanceRecommendationSupport[] = [];

      const gpp = metricByKey.get("gppPerCapita");
      const pm25 = metricByKey.get("pm25Annual");
      const crime = metricByKey.get("crimeRatePer100k");
      const green = metricByKey.get("greenCoverage");
      const population = metricByKey.get("population");

      if (instrument.id === "ppp-concession") {
        score += finance.readinessScore * 0.35;
        if (finance.revenueBase === "strong") score += 20;
        if (finance.privateInterest === "strong") score += 16;
        if (touristPattern || industrialPattern) score += 12;
        if (city.reality === "planned") score -= 18;
        if (gpp) drivers.push(buildSupportFromMetric(city, gpp, "High economic output supports contractable demand."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      } else if (instrument.id === "municipal-revenue-bond") {
        score += finance.readinessScore * 0.32;
        if (finance.revenueBase === "strong") score += 22;
        if (touristPattern) score += 14;
        if (population && (population.metricValueNum ?? 0) >= 300) score += 8;
        if (city.reality !== "operational") score -= 12;
        if (gpp) drivers.push(buildSupportFromMetric(city, gpp, "Economic base indicates fee-backed borrowing capacity."));
        if (population) drivers.push(buildSupportFromMetric(city, population, "Scale supports recurring municipal revenue."));
      } else if (instrument.id === "land-value-capture") {
        score += finance.readinessScore * 0.24;
        if (corridorPattern) score += 24;
        if (finance.segment === "alpha") score += 10;
        if (touristPattern || industrialPattern) score += 8;
        if (city.reality === "planned") score -= 8;
        if (gpp) drivers.push(buildSupportFromMetric(city, gpp, "Strong urban demand makes value capture plausible."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      } else if (instrument.id === "green-climate-bond") {
        score += finance.readinessScore * 0.18;
        if ((pm25?.metricValueNum ?? 0) >= 30) score += 20;
        if ((green?.metricValueNum ?? 100) <= 30) score += 10;
        if (industrialPattern || touristPattern) score += 8;
        if (pm25) drivers.push(buildSupportFromMetric(city, pm25, "Environmental stress is measurable, so the green capex case is auditable."));
        if (green) drivers.push(buildSupportFromMetric(city, green, "Land and resilience conditions shape green project urgency."));
      } else if (instrument.id === "blended-finance") {
        score += finance.readinessScore * 0.22;
        if (finance.deliveryReadiness === "building") score += 16;
        if (finance.riskProfile === "medium" || finance.riskProfile === "high") score += 12;
        if (city.tier !== "alpha") score += 10;
        if (gpp) drivers.push(buildSupportFromMetric(city, gpp, "The city has enough demand to justify blended rather than pure grant finance."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      } else if (instrument.id === "performance-contract") {
        score += finance.readinessScore * 0.2;
        if (city.reality !== "planned") score += 15;
        if ((pm25?.metricValueNum ?? 0) > 25 || industrialPattern) score += 14;
        if (city.metrics.greenCoverage !== undefined || city.metrics.hospitalBedsPer10k !== undefined) score += 8;
        if (pm25) drivers.push(buildSupportFromMetric(city, pm25, "Outcome-based contracts make sense where performance can be metered."));
        if (green) drivers.push(buildSupportFromMetric(city, green, "Green coverage provides a resilience baseline for outcome measurement."));
      } else if (instrument.id === "dfi-cofinance") {
        score += 32;
        if (finance.riskProfile !== "low") score += 16;
        if (finance.deliveryReadiness === "building" || finance.deliveryReadiness === "foundational") score += 10;
        if (pm25) drivers.push(buildSupportFromMetric(city, pm25, "Measured environmental pressure supports concessional co-finance."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      } else if (instrument.id === "technical-assistance-grant") {
        score += 34;
        if (city.reality === "planned") score += 18;
        if (finance.deliveryReadiness === "foundational") score += 14;
        if (crime && (crime.metricValueNum ?? 0) > 180) score += 6;
        if (population) drivers.push(buildSupportFromMetric(city, population, "City scale shapes the right size for first-phase technical support."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      } else if (instrument.id === "government-budget") {
        score += 28;
        if (city.reality === "planned") score += 12;
        if (finance.revenueBase === "thin") score += 12;
        if (finance.riskProfile === "acute") score += 18;
        if (population) drivers.push(buildSupportFromMetric(city, population, "Population scale affects the public-good case for grant funding."));
        if (pm25) drivers.push(buildSupportFromMetric(city, pm25, "Measured externalities justify public funding for core resilience."));
      } else if (instrument.id === "pooled-procurement") {
        score += 30;
        if (city.tier === "gamma") score += 20;
        if ((population?.metricValueNum ?? 999) < 150) score += 12;
        if (finance.deliveryReadiness === "foundational") score += 12;
        if (population) drivers.push(buildSupportFromMetric(city, population, "Small scale supports pooled rather than bespoke procurement."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      } else if (instrument.id === "asset-recycling") {
        score += finance.readinessScore * 0.24;
        if (city.tier === "alpha") score += 16;
        if (corridorPattern || city.region === "bangkok") score += 14;
        if (city.reality === "operational") score += 8;
        if (gpp) drivers.push(buildSupportFromMetric(city, gpp, "Strong urban value supports recycling mature public assets."));
        if (topEvidence) drivers.push(buildSupportFromEvidence(city, topEvidence));
      }

      if (!drivers.length && gpp) {
        drivers.push(buildSupportFromMetric(city, gpp, "Economic productivity is the baseline support row."));
      }
      if (!drivers.length && topEvidence) {
        drivers.push(buildSupportFromEvidence(city, topEvidence));
      }

      return {
        instrument,
        score,
        reason:
          instrument.id === "government-budget"
            ? `${city.nameEn} still needs public risk-bearing for foundational delivery.`
            : instrument.id === "technical-assistance-grant"
              ? `${city.nameEn} needs sharper project definition and procurement readiness before bigger money.`
              : `${instrument.name} fits ${city.nameEn} because its metrics and operating context create a credible use case.`,
        drivers: drivers.slice(0, 3),
        whyNow:
          instrument.id === "green-climate-bond"
            ? "Because the environmental problem is visible enough to finance against."
            : instrument.id === "ppp-concession"
              ? "Because the city already has the demand spine to anchor long-term contracts."
              : instrument.id === "technical-assistance-grant"
                ? "Because unreadiness is cheaper to fix now than after a failed capital program."
                : "Because the city has enough signal to move from generic planning into tailored execution.",
        nextStep:
          instrument.id === "land-value-capture"
            ? "Map the uplift zone, define the public works trigger, and lock the capture rule before land speculation outruns the city."
            : instrument.id === "municipal-revenue-bond"
              ? "Ring-fence the revenue line, publish three years of collection quality, and prepare a credit story."
              : instrument.id === "pooled-procurement"
                ? "Bundle the commodity stack with peer cities and buy maintenance with the hardware."
                : instrument.id === "technical-assistance-grant"
                  ? "Write the feasibility package, data governance note, and procurement scope before applying for capital."
                  : "Translate the city metrics into a bankable project package with a clear public and private role split.",
      };
    })
    .sort((left, right) => right.score - left.score);
}

function recommendationCopy(
  city: SmartCity,
  instrument: FinanceInstrumentSeed,
  finance: CityFinanceProfile,
  reason: string,
  whyNow: string,
  nextStep: string,
): Pick<
  CityFinanceRecommendation,
  "reasonSummary" | "whyNow" | "nextStep" | "publicFundingRole" | "privateCapitalRole"
> {
  return {
    reasonSummary: localized(
      `${reason} ${instrument.whyItFits.en}`,
      `${reason} ${instrument.whyItFits.th}`,
      `${reason} ${instrument.whyItFits.en}`,
    ),
    whyNow: localized(
      `${whyNow} Readiness score: ${finance.readinessScore}/100.`,
      `${whyNow} คะแนน readiness: ${finance.readinessScore}/100`,
      `${whyNow} Readiness score: ${finance.readinessScore}/100.`,
    ),
    nextStep: localized(
      nextStep,
      nextStep,
      nextStep,
    ),
    publicFundingRole: localized(
      city.tier === "alpha"
        ? "Government should hold land, standards, permits, and the policy floor."
        : city.tier === "beta"
          ? "Government should anchor the first-loss piece and publish the delivery KPIs."
          : "Government should pay for baseline readiness and civic safeguards.",
      city.tier === "alpha"
        ? "ภาครัฐควรถือที่ดิน มาตรฐาน ใบอนุญาต และ policy floor"
        : city.tier === "beta"
          ? "ภาครัฐควรรับส่วน first-loss และประกาศ KPI การส่งมอบให้ชัด"
          : "ภาครัฐควรจ่าย baseline readiness และระบบคุ้มครองสาธารณะ",
      city.tier === "alpha"
        ? "Government should hold land, standards, permits, and the policy floor."
        : city.tier === "beta"
          ? "Government should anchor the first-loss piece and publish the delivery KPIs."
          : "Government should pay for baseline readiness and civic safeguards.",
    ),
    privateCapitalRole: localized(
      instrument.category === "grant"
        ? "Private actors should supply capability, delivery discipline, and co-development where the city proves uptake."
        : "Private capital should take the commercial slice only after the city proves the local demand logic.",
      instrument.category === "grant"
        ? "เอกชนควรลงความสามารถ วินัยการส่งมอบ และการร่วมพัฒนาในจุดที่เมืองพิสูจน์ uptake ได้"
        : "ทุนเอกชนควรรับส่วนเชิงพาณิชย์ก็ต่อเมื่อเมืองพิสูจน์ตรรกะ demand ของพื้นที่ได้แล้ว",
      instrument.category === "grant"
        ? "Private actors should supply capability, delivery discipline, and co-development where the city proves uptake."
        : "Private capital should take the commercial slice only after the city proves the local demand logic.",
    ),
  };
}

function buildFinanceRecommendations(
  city: SmartCity,
  finance: CityFinanceProfile,
  observations: CityMetricObservation[],
  evidence: EvidenceItem[],
): CityFinanceRecommendation[] {
  return scoreInstruments(city, finance, observations, evidence)
    .filter(candidate => candidate.drivers.length > 0)
    .slice(0, 3)
    .map((candidate, index) => {
      const priority: FinancePriority = index === 0 ? "lead" : index === 1 ? "secondary" : "watch";
      const copy = recommendationCopy(
        city,
        candidate.instrument,
        finance,
        candidate.reason,
        candidate.whyNow,
        candidate.nextStep,
      );

      return {
        id: `${city.id}-${candidate.instrument.id}`,
        cityId: city.id,
        instrumentId: candidate.instrument.id,
        instrumentName: candidate.instrument.name,
        priority,
        priorityScore: Math.round(candidate.score),
        stage: city.reality,
        segment: city.tier,
        ...copy,
        supports: candidate.drivers,
        version: VERSION,
      };
    });
}

function buildShortTailoredNote(city: SmartCity, context?: CityContext): LocalizedText {
  if (context) {
    return localized(
      `${context.opportunity.en} Watch the constraint: ${context.theCatch.en}`,
      `${context.opportunity.th} แต่ต้องระวัง: ${context.theCatch.th}`,
      `${context.opportunity.en} Watch the constraint: ${context.theCatch.en}`,
    );
  }

  const [strongest] = strongestPillars(city);
  const [weakest] = weakestPillars(city);
  return localized(
    `${city.nameEn} leans on ${pillarLabel(strongest)} but still gets capped by ${pillarLabel(weakest)}. That's where the backend should keep drilling.`,
    `${city.nameTh} มีแรงหลักอยู่ที่${pillarLabel(strongest)} แต่ยังถูกกดเพดานโดย${pillarLabel(weakest)} ตรงนี้แหละที่ backend ต้องขุดต่อ`,
    `${city.nameEn} leans on ${pillarLabel(strongest)} but is still capped by ${pillarLabel(weakest)}. That's where the backend should keep drilling.`,
  );
}

function buildKeyMetrics(city: SmartCity, observations: CityMetricObservation[]): CityKeyMetric[] {
  const preferred = ["gppPerCapita", "pm25Annual", "crimeRatePer100k", "greenCoverage", "population"];

  return preferred
    .map(metricKey => observations.find(item => item.metricKey === metricKey))
    .filter((item): item is CityMetricObservation => Boolean(item))
    .slice(0, 4)
    .map(item => ({
      key: item.metricKey,
      label: item.label,
      value: item.metricValueText ?? "",
      unit: item.unit ?? undefined,
      confidence: item.confidence >= 0.85 ? "high" : item.confidence >= 0.7 ? "medium" : "low",
      sourceId: item.sourceId,
    }));
}

function buildFinanceSignal(city: SmartCity, finance: CityFinanceProfile, recommendations: CityFinanceRecommendation[]): CityFinanceSignal {
  const lead = recommendations[0];
  return {
    leadInstrumentId: lead?.instrumentId ?? "government-budget",
    leadInstrumentName: lead?.instrumentName ?? "Government Budget / Grant",
    line: localized(
      lead
        ? `${lead.instrumentName} leads because ${city.nameEn} is ${finance.deliveryReadiness} with a ${finance.riskProfile} risk profile.`
        : `${city.nameEn} is still too thin for bespoke finance; stay with public baseline funding.`,
      lead
        ? `${lead.instrumentName} นำ เพราะ ${city.nameTh} อยู่ในระดับ ${finance.deliveryReadiness} และมีความเสี่ยงแบบ ${finance.riskProfile}`
        : `${city.nameTh} ยังบางเกินไปสำหรับการเงินเฉพาะทาง ควรใช้เงินภาครัฐพื้นฐานก่อน`,
      lead
        ? `${lead.instrumentName} leads because ${city.nameEn} is ${finance.deliveryReadiness} with a ${finance.riskProfile} risk profile.`
        : `${city.nameEn} is still too thin for bespoke finance; stay with public baseline funding.`,
    ),
    readinessScore: finance.readinessScore,
  };
}

function buildContextNotes(city: SmartCity, context?: CityContext): CityContextNote[] {
  return [
    {
      id: `${city.id}-opportunity`,
      kind: "opportunity",
      title: localized("Tailored opportunity", "โอกาสเฉพาะเมือง", "定制机会"),
      body: citySpecificOpportunity(city, context),
    },
    {
      id: `${city.id}-constraint`,
      kind: "constraint",
      title: localized("Constraint", "ข้อจำกัด", "约束"),
      body: citySpecificConstraint(city, context),
    },
    {
      id: `${city.id}-warning`,
      kind: "implementation_warning",
      title: localized("Implementation warning", "คำเตือนเชิงปฏิบัติ", "实施警告"),
      body: citySpecificWarning(city),
    },
    {
      id: `${city.id}-lesson`,
      kind: "exportable_lesson",
      title: localized("Exportable lesson", "บทเรียนที่ส่งออกได้", "可输出经验"),
      body: citySpecificLesson(city, context),
    },
  ];
}

function buildExportRows(
  city: SmartCity,
  observations: CityMetricObservation[],
  contextNotes: CityContextNote[],
  recommendations: CityFinanceRecommendation[],
): CityResearchExportRow[] {
  const summaryRow: CityResearchExportRow = {
    city_id: city.id,
    city_name_en: city.nameEn,
    city_name_th: city.nameTh,
    province: city.province,
    fact_type: "summary",
    metric_key_or_recommendation_key: "compositeScore",
    value: city.compositeScore.toFixed(1),
    unit: "score",
    source_id: "sciti-index",
    source_url: "",
    observed_at: DEFAULT_VERIFIED_AT,
    confidence: city.dataConfidence ?? "medium",
    version: VERSION,
  };

  const metricRows = observations.map(item => ({
    city_id: city.id,
    city_name_en: city.nameEn,
    city_name_th: city.nameTh,
    province: city.province,
    fact_type: "metric" as const,
    metric_key_or_recommendation_key: item.metricKey,
    value: item.metricValueText ?? "",
    unit: item.unit ?? "",
    source_id: item.sourceId,
    source_url: item.sourceUrl,
    observed_at: item.observedAt,
    confidence: String(item.confidence),
    version: item.version,
  }));

  const contextRows = contextNotes.map(note => ({
    city_id: city.id,
    city_name_en: city.nameEn,
    city_name_th: city.nameTh,
    province: city.province,
    fact_type: "context" as const,
    metric_key_or_recommendation_key: note.kind,
    value: note.body.en,
    unit: "",
    source_id: "sciti-curation",
    source_url: "",
    observed_at: DEFAULT_VERIFIED_AT,
    confidence: "0.8",
    version: VERSION,
  }));

  const recommendationRows = recommendations.flatMap(recommendation =>
    recommendation.supports.map(support => ({
      city_id: city.id,
      city_name_en: city.nameEn,
      city_name_th: city.nameTh,
      province: city.province,
      fact_type: "recommendation" as const,
      metric_key_or_recommendation_key: recommendation.instrumentId,
      value: `${recommendation.instrumentName}: ${support.summary}`,
      unit: "",
      source_id: support.sourceId,
      source_url: support.sourceUrl,
      observed_at: support.observedAt,
      confidence: String(support.confidence),
      version: VERSION,
    })),
  );

  return [summaryRow, ...metricRows, ...contextRows, ...recommendationRows];
}

function buildCitySummary(
  city: SmartCity,
  observations: CityMetricObservation[],
  financeProfile: CityFinanceProfile,
  recommendations: CityFinanceRecommendation[],
  exportRows: CityResearchExportRow[],
  context?: CityContext,
): CitySummaryDTO {
  const latestObservedAt = latestDate([
    ...observations.map(item => item.observedAt),
    ...recommendations.flatMap(item => item.supports.map(support => support.observedAt)),
  ]);

  return {
    ...city,
    keyMetrics: buildKeyMetrics(city, observations),
    shortTailoredNote: buildShortTailoredNote(city, context),
    financeSignal: buildFinanceSignal(city, financeProfile, recommendations),
    exportReady: recommendations.length > 0 && exportRows.length >= 6,
    freshness: {
      latestObservedAt,
      lastVerifiedAt: DEFAULT_VERIFIED_AT,
    },
    provenanceCount: observations.length + recommendations.reduce((sum, item) => sum + item.supports.length, 0),
  };
}

function buildCityDetail(city: SmartCity): CityDetailBuild {
  const context = cityContexts[city.id];
  const evidence = getEvidenceForCity(city.id);
  const metricObservations = buildMetricObservations(city);
  const financeProfile = buildFinanceProfile(city, evidence, context);
  const deliveryProfile = buildDeliveryProfile(city, financeProfile, metricObservations);
  const recommendations = buildFinanceRecommendations(city, financeProfile, metricObservations, evidence);
  const contextNotes = buildContextNotes(city, context);
  const exportRows = buildExportRows(city, metricObservations, contextNotes, recommendations);
  const summary = buildCitySummary(
    city,
    metricObservations,
    financeProfile,
    recommendations,
    exportRows,
    context,
  );

  const detail: CityDetailDTO = {
    ...summary,
    metricBlocks: buildMetricBlocks(city, metricObservations),
    contextNotes,
    deliveryProfile,
    financeProfile,
    financeRecommendations: recommendations,
    financeInstrumentCatalog: FINANCE_INSTRUMENTS,
    evidenceItems: evidence,
    dataRails: buildDataRails(city),
    exportMetadata: {
      latestObservedAt: summary.freshness.latestObservedAt,
      lastVerifiedAt: summary.freshness.lastVerifiedAt,
      provenanceCount: summary.provenanceCount,
      summaryCsvUrl: "/api/exports/cities-summary.csv",
      factsCsvUrl: "/api/exports/city-facts.csv",
      cityCsvUrl: `/api/cities/${city.id}/export.csv`,
    },
  };

  return { summary, detail, exportRows };
}

const CITY_BUILDS: CityDetailBuild[] = allCities.map(buildCityDetail);
const CITY_DETAIL_LOOKUP = new Map(CITY_BUILDS.map(build => [build.detail.id, build.detail]));
const CITY_SUMMARY_LOOKUP = new Map(CITY_BUILDS.map(build => [build.summary.id, build.summary]));
const CITY_EXPORT_ROW_LOOKUP = new Map(CITY_BUILDS.map(build => [build.detail.id, build.exportRows]));

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}

function toCsv<Row extends Record<string, string>>(rows: Row[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [
    headers.join(","),
    ...rows.map(row => headers.map(header => csvEscape(row[header] ?? "")).join(",")),
  ].join("\n");
}

export function getCityFinanceInstrumentCatalog(): FinanceInstrumentSeed[] {
  return FINANCE_INSTRUMENTS;
}

export function getCitySummaries(): CitySummaryDTO[] {
  return CITY_BUILDS.map(build => build.summary);
}

export function getCitySummaryById(cityId: string): CitySummaryDTO | undefined {
  return CITY_SUMMARY_LOOKUP.get(cityId);
}

export function getCityDetail(cityId: string): CityDetailDTO | undefined {
  return CITY_DETAIL_LOOKUP.get(cityId);
}

export function getCityFactsRows(cityId?: string): CityResearchExportRow[] {
  if (cityId) {
    return CITY_EXPORT_ROW_LOOKUP.get(cityId) ?? [];
  }
  return CITY_BUILDS.flatMap(build => build.exportRows);
}

export function getCitySummariesCsv(): string {
  return toCsv(getCitySummaries().map(city => ({
    id: city.id,
    name_en: city.nameEn,
    name_th: city.nameTh,
    province: city.province,
    region: city.region,
    status: city.status,
    reality: city.reality,
    tier: city.tier,
    composite_score: city.compositeScore.toFixed(1),
    data_confidence: city.dataConfidence ?? "medium",
    lead_mechanism: city.financeSignal.leadInstrumentName,
    lead_note: city.financeSignal.line.en,
    readiness_score: String(city.financeSignal.readinessScore),
    latest_observed_at: city.freshness.latestObservedAt,
    last_verified_at: city.freshness.lastVerifiedAt,
    provenance_count: String(city.provenanceCount),
    export_ready: city.exportReady ? "true" : "false",
  })));
}

export function getCityFactsCsv(cityId?: string): string {
  return toCsv(getCityFactsRows(cityId).map(row => ({
    city_id: row.city_id,
    city_name_en: row.city_name_en,
    city_name_th: row.city_name_th,
    province: row.province,
    fact_type: row.fact_type,
    metric_key_or_recommendation_key: row.metric_key_or_recommendation_key,
    value: row.value,
    unit: row.unit,
    source_id: row.source_id,
    source_url: row.source_url,
    observed_at: row.observed_at,
    confidence: row.confidence,
    version: row.version,
  })));
}

export function getCitiesApiPayload(options?: {
  status?: "all" | CityStatus;
  tier?: "all" | CityTier;
  sort?: "composite" | ScoringPillar;
}): CitySummaryDTO[] {
  const status = options?.status ?? "all";
  const tier = options?.tier ?? "all";
  const sort = options?.sort ?? "composite";

  return getCitySummaries()
    .filter(city => (status === "all" ? true : city.status === status))
    .filter(city => (tier === "all" ? true : city.tier === tier))
    .slice()
    .sort((left, right) => {
      const leftScore = sort === "composite" ? left.compositeScore : left.scores[sort];
      const rightScore = sort === "composite" ? right.compositeScore : right.scores[sort];
      if (rightScore !== leftScore) return rightScore - leftScore;
      return left.nameEn.localeCompare(right.nameEn);
    });
}

export function getCityContextSummaryPrompt(limit = 20): string {
  return getCitySummaries()
    .slice(0, limit)
    .map(city =>
      `${city.nameEn}: Tier ${city.tier}, score ${city.compositeScore.toFixed(1)}, finance ${city.financeSignal.leadInstrumentName}. ${city.shortTailoredNote.en}`,
    )
    .join("\n");
}

export function getCityDataRailReferenceText(locale: Locale): string {
  return cdpSources
    .slice(0, 6)
    .map(source => (locale === "th" ? `${source.nameTh}: ${source.descTh}` : `${source.nameEn}: ${source.descEn}`))
    .join("\n");
}

export function getCityExternalResearchLinks(city: SmartCity): Array<{ label: string; url: string }> {
  return [
    { label: "City Data Platform", url: getCityDataUrl(city.nameEn) },
    { label: "Open Government Data", url: getOpenDataSearchUrl(city.province) },
    { label: "BOI provincial investment", url: getBOIInvestmentUrl(city.province) },
    { label: "Air quality dashboard", url: getAirQualityUrl() },
  ];
}
