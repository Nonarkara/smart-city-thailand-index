// ---------------------------------------------------------------------------
// ASEAN Smart City Financial Toolkit
// ---------------------------------------------------------------------------
// Based on smartcitytoolkit.asean.org FIRST tool + ADB/OECD research
// 15 financial instruments mapped to city tiers and characteristics
// ---------------------------------------------------------------------------

import type { SmartCity, CityTier, ScoringPillar } from "./types";

export interface FinancialInstrument {
  id: string;
  name: string;
  nameTh: string;
  category: "debt" | "equity" | "grant" | "hybrid" | "innovative";
  descEn: string;
  descTh: string;
  applicableTiers: CityTier[];
  applicableStages: ("operational" | "partial" | "planned")[];
  targetPillars: ScoringPillar[];
  complexity: "low" | "medium" | "high";
  typicalSize: string;
  aseanExample?: string;
  thaiRelevance: string;
  sourceUrl?: string;
}

export interface FinancialRecommendation {
  instrument: FinancialInstrument;
  priority: "primary" | "secondary" | "exploratory";
  reason: string;
  reasonTh: string;
}

export const instruments: FinancialInstrument[] = [
  {
    id: "ppp",
    name: "Public-Private Partnership (PPP)",
    nameTh: "ความร่วมมือรัฐ-เอกชน (PPP)",
    category: "equity",
    descEn: "Long-term contracts where private sector finances, builds, and operates infrastructure. Government sets standards and provides regulatory certainty. Best for large-scale transport, energy, and digital infrastructure.",
    descTh: "สัญญาระยะยาวที่เอกชนลงทุน สร้าง และดำเนินงานโครงสร้างพื้นฐาน รัฐกำหนดมาตรฐาน เหมาะสำหรับขนส่ง พลังงาน โครงสร้างพื้นฐานดิจิทัลขนาดใหญ่",
    applicableTiers: ["alpha", "beta"],
    applicableStages: ["operational", "partial"],
    targetPillars: ["livability", "economy", "digital"],
    complexity: "high",
    typicalSize: "THB 500M – 10B+",
    aseanExample: "Philippines public markets via BOT/PPP",
    thaiRelevance: "EECi PPP package THB 74.5B for smart grids, water, transport, digital. Khon Kaen LRT uses PPP model.",
    sourceUrl: "https://smartcitytoolkit.asean.org",
  },
  {
    id: "green-bond",
    name: "Green/Climate Bond",
    nameTh: "พันธบัตรสีเขียว/ภูมิอากาศ",
    category: "debt",
    descEn: "Bonds where proceeds are exclusively used for green projects — renewable energy, clean transport, waste management, flood control. Attracts ESG investors. Can be issued by municipalities or national agencies.",
    descTh: "พันธบัตรที่เงินไปสู่โครงการสีเขียวเท่านั้น — พลังงานหมุนเวียน ขนส่งสะอาด จัดการขยะ ควบคุมน้ำท่วม ดึงดูดนักลงทุน ESG",
    applicableTiers: ["alpha", "beta"],
    applicableStages: ["operational", "partial"],
    targetPillars: ["environment", "livability"],
    complexity: "high",
    typicalSize: "THB 1B – 20B",
    aseanExample: "Malaysia first Green Sukuk — 40% of global sukuk market",
    thaiRelevance: "ACGF (ASEAN Catalytic Green Finance Facility) provides advisory. Thailand green bond market growing rapidly under SEC framework.",
    sourceUrl: "https://www.climatebonds.net/resources/reports/asean-green-financial-instruments-guide",
  },
  {
    id: "lvc",
    name: "Land Value Capture",
    nameTh: "จับมูลค่าที่ดิน",
    category: "innovative",
    descEn: "Captures the increase in land values created by public investment (new transit, parks, flood protection) to fund that investment. Works through betterment levies, tax increment financing, or development charges.",
    descTh: "จับมูลค่าที่ดินที่เพิ่มขึ้นจากการลงทุนสาธารณะ (ขนส่งใหม่ สวน ป้องกันน้ำท่วม) เพื่อเป็นเงินทุน ผ่านค่าธรรมเนียมการพัฒนาหรือภาษีส่วนเพิ่ม",
    applicableTiers: ["alpha"],
    applicableStages: ["operational"],
    targetPillars: ["livability", "economy"],
    complexity: "high",
    typicalSize: "THB 200M – 5B",
    aseanExample: "India Amaravati new capital via land pooling",
    thaiRelevance: "Bangkok BTS/MRT corridors show massive land value increases. Khon Kaen LRT zone could pilot LVC.",
    sourceUrl: "https://www.adb.org/news/infographics/land-value-capture-financing-infrastructure-asias-cities",
  },
  {
    id: "municipal-bond",
    name: "Municipal Revenue Bond",
    nameTh: "พันธบัตรรายได้เทศบาล",
    category: "debt",
    descEn: "Bonds backed by specific revenue streams (water fees, parking, waste collection). Allows cities to borrow against future income. Requires strong financial management and credit rating.",
    descTh: "พันธบัตรค้ำประกันด้วยรายได้เฉพาะ (ค่าน้ำ ค่าจอดรถ ค่าขยะ) ให้เมืองกู้ยืมจากรายได้อนาคต ต้องมีการจัดการการเงินที่แข็งแกร่ง",
    applicableTiers: ["alpha"],
    applicableStages: ["operational"],
    targetPillars: ["livability", "environment"],
    complexity: "high",
    typicalSize: "THB 500M – 5B",
    aseanExample: "Gujarat India municipal bonds for water infrastructure",
    thaiRelevance: "Thai municipalities have growing own-revenue bases. Phuket and Khon Kaen could qualify.",
  },
  {
    id: "bot",
    name: "Build-Operate-Transfer (BOT)",
    nameTh: "สร้าง-ดำเนินงาน-โอน (BOT)",
    category: "equity",
    descEn: "Private sector builds and operates for a concession period, then transfers to government. Common for tollways, power plants, water treatment. Lower government upfront cost.",
    descTh: "เอกชนสร้างและดำเนินงานตามสัมปทาน แล้วโอนให้รัฐ ใช้ทั่วไปกับทางด่วน โรงไฟฟ้า บำบัดน้ำ ลดต้นทุนรัฐ",
    applicableTiers: ["alpha", "beta"],
    applicableStages: ["operational", "partial"],
    targetPillars: ["livability", "economy", "environment"],
    complexity: "medium",
    typicalSize: "THB 200M – 5B",
    aseanExample: "Indonesia toll roads via asset recycling ($292M)",
    thaiRelevance: "Thailand has extensive BOT experience (expressways, airports). EEC zone uses BOT for smart infrastructure.",
  },
  {
    id: "regional-dev-fund",
    name: "Regional Development Finance (ADB/JICA/WB)",
    nameTh: "เงินทุนพัฒนาภูมิภาค (ADB/JICA/WB)",
    category: "grant",
    descEn: "Concessional loans and grants from multilateral development banks. ADB has the ASEAN Australia Smart Cities Trust Fund. JICA partners with depa for technical cooperation. Lower interest rates, longer terms.",
    descTh: "เงินกู้ผ่อนปรนและเงินช่วยเหลือจากธนาคารพัฒนาพหุภาคี ADB มี ASEAN Australia Smart Cities Trust Fund JICA ร่วมมือกับ depa อัตราดอกเบี้ยต่ำ ระยะเวลายาว",
    applicableTiers: ["alpha", "beta", "gamma"],
    applicableStages: ["operational", "partial", "planned"],
    targetPillars: ["livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital"],
    complexity: "medium",
    typicalSize: "THB 50M – 2B",
    aseanExample: "Myanmar Yangon sanitation via JICA grants ($7.27M)",
    thaiRelevance: "JICA already collaborates with depa and DLA. ADB ASEAN Australia Smart Cities Trust Fund supports Thai cities. USTDA grant for Phuket data platform.",
    sourceUrl: "https://www.adb.org/what-we-do/funds/asean-australia-smart-cities-fund",
  },
  {
    id: "blended-finance",
    name: "Blended Finance Vehicle",
    nameTh: "การเงินผสมผสาน",
    category: "hybrid",
    descEn: "Combines concessional (below-market) capital with commercial investment. De-risks projects for private investors. Often structured by DFIs to catalyze private capital for smart city projects.",
    descTh: "รวมเงินทุนผ่อนปรนกับการลงทุนเชิงพาณิชย์ ลดความเสี่ยงสำหรับนักลงทุนเอกชน มักจัดโครงสร้างโดย DFI เพื่อกระตุ้นทุนเอกชน",
    applicableTiers: ["beta", "gamma"],
    applicableStages: ["partial", "planned"],
    targetPillars: ["economy", "environment", "digital"],
    complexity: "high",
    typicalSize: "THB 100M – 5B",
    aseanExample: "Cambodia solar plant via blended finance ($41M)",
    thaiRelevance: "UNCDF Smart Green ASEAN Cities (SGAC) program provides blended finance for Thai smart city projects.",
    sourceUrl: "https://www.uncdf.org/sgac",
  },
  {
    id: "boi-incentive",
    name: "BOI Digital Economy Incentives",
    nameTh: "สิทธิประโยชน์ BOI เศรษฐกิจดิจิทัล",
    category: "grant",
    descEn: "Thailand Board of Investment tax incentives for smart city investments — corporate income tax exemptions (3-8 years), import duty exemptions, fast-track permits. Smart City is a priority sector.",
    descTh: "สิทธิประโยชน์ทางภาษีของ BOI สำหรับการลงทุนเมืองอัจฉริยะ — ยกเว้นภาษีเงินได้ 3-8 ปี ยกเว้นอากรนำเข้า อนุมัติเร็ว เมืองอัจฉริยะเป็นภาคส่วนสำคัญ",
    applicableTiers: ["alpha", "beta"],
    applicableStages: ["operational", "partial"],
    targetPillars: ["economy", "digital"],
    complexity: "low",
    typicalSize: "Tax savings THB 10M – 500M+",
    thaiRelevance: "Smart City is one of BOI's 12 targeted industries under the S-curve policy. EEC zone has additional incentives layered on top.",
  },
  {
    id: "nat-gov-transfer",
    name: "National Government Transfer",
    nameTh: "เงินอุดหนุนจากรัฐบาลกลาง",
    category: "grant",
    descEn: "Direct budget allocation from central government to municipalities for smart city development. depa provides matching grants through the Smart City Promotion Fund.",
    descTh: "การจัดสรรงบจากรัฐบาลกลางสู่เทศบาลเพื่อพัฒนาเมืองอัจฉริยะ depa ให้เงินอุดหนุนสมทบผ่าน Smart City Promotion Fund",
    applicableTiers: ["alpha", "beta", "gamma"],
    applicableStages: ["operational", "partial", "planned"],
    targetPillars: ["livability", "digital", "safety"],
    complexity: "low",
    typicalSize: "THB 5M – 200M",
    aseanExample: "Brunei BruHealth app via government transfers (B$18M)",
    thaiRelevance: "depa's Smart City Promotion Fund is the primary mechanism. Master Plan 1 allocates THB 200B budget target through 2027.",
  },
  {
    id: "ta-grant",
    name: "Technical Assistance Grant",
    nameTh: "เงินช่วยเหลือทางเทคนิค",
    category: "grant",
    descEn: "Non-repayable grants for capacity building, feasibility studies, masterplanning, and knowledge transfer. Often the first step before larger financing.",
    descTh: "เงินช่วยเหลือไม่ต้องคืนสำหรับสร้างศักยภาพ ศึกษาความเป็นไปได้ วางแผนแม่บท ถ่ายทอดความรู้ มักเป็นขั้นตอนแรกก่อนการเงินที่ใหญ่กว่า",
    applicableTiers: ["beta", "gamma"],
    applicableStages: ["partial", "planned"],
    targetPillars: ["digital", "livability"],
    complexity: "low",
    typicalSize: "THB 1M – 50M",
    aseanExample: "U.S.-ASEAN Smart Cities Business Innovation Fund ($3M for SME solutions)",
    thaiRelevance: "UK-Thailand smart city partnership, Austria MOU, US-ASEAN SCBIF, JICA technical cooperation all provide TA grants.",
    sourceUrl: "https://www.usascp.org/programs/climate-finance/",
  },
  {
    id: "crowdfunding",
    name: "Civic Crowdfunding",
    nameTh: "ระดมทุนจากประชาชน",
    category: "innovative",
    descEn: "Citizens directly fund small-scale civic projects — community solar, park improvements, local IoT sensors. Builds ownership and engagement. Works best for visible, community-scale projects.",
    descTh: "ประชาชนระดมทุนโครงการพลเมืองขนาดเล็กโดยตรง — โซลาร์ชุมชน ปรับปรุงสวน เซ็นเซอร์ IoT สร้างความเป็นเจ้าของและการมีส่วนร่วม",
    applicableTiers: ["alpha", "beta", "gamma"],
    applicableStages: ["operational", "partial", "planned"],
    targetPillars: ["hospitality", "environment"],
    complexity: "low",
    typicalSize: "THB 100K – 10M",
    aseanExample: "Netherlands crowdfunding for wind energy projects",
    thaiRelevance: "Thailand SEC approved equity crowdfunding. Could work for community-scale smart city projects in smaller cities.",
  },
  {
    id: "on-bill",
    name: "On-Bill Financing",
    nameTh: "การเงินผ่านบิลค่าบริการ",
    category: "innovative",
    descEn: "Energy efficiency or smart infrastructure upgrades paid through savings on utility bills. No upfront cost. The upgrade pays for itself through reduced consumption.",
    descTh: "อัพเกรดประสิทธิภาพพลังงานหรือโครงสร้างพื้นฐานอัจฉริยะจ่ายผ่านค่าสาธารณูปโภคที่ประหยัดได้ ไม่มีค่าใช้จ่ายล่วงหน้า การอัพเกรดจ่ายคืนตัวเอง",
    applicableTiers: ["alpha", "beta"],
    applicableStages: ["operational"],
    targetPillars: ["environment", "economy"],
    complexity: "medium",
    typicalSize: "THB 10M – 500M",
    aseanExample: "Chile on-bill financing for electric buses",
    thaiRelevance: "Mae Moh clean energy transition, EGAT partnerships could use this model for smart energy in industrial cities.",
  },
  {
    id: "sez",
    name: "Smart City Special Economic Zone",
    nameTh: "เขตเศรษฐกิจพิเศษเมืองอัจฉริยะ",
    category: "equity",
    descEn: "Designated zones with fast-tracked permits, tax holidays, and infrastructure guarantees. Attracts both domestic and foreign investment. Thailand's EEC is the prime example.",
    descTh: "เขตที่กำหนดพร้อมอนุมัติเร็ว ยกเว้นภาษี ค้ำประกันโครงสร้างพื้นฐาน ดึงดูดการลงทุนทั้งในและต่างประเทศ EEC ของไทยเป็นตัวอย่างหลัก",
    applicableTiers: ["alpha"],
    applicableStages: ["operational"],
    targetPillars: ["economy", "digital"],
    complexity: "high",
    typicalSize: "THB 5B – 100B+",
    thaiRelevance: "EEC has THB 1.35T master plan through 2037. 87.5% from private sector. Chachoengsao, Rayong, Chon Buri are the primary zones.",
  },
  {
    id: "land-pooling",
    name: "Land Pooling / Readjustment",
    nameTh: "การรวมแปลงที่ดิน",
    category: "innovative",
    descEn: "Landowners pool their land, government provides infrastructure, land is redistributed with roads/utilities — now worth more. Everyone benefits. Used for new urban districts.",
    descTh: "เจ้าของที่ดินรวมแปลง รัฐจัดโครงสร้างพื้นฐาน แจกจ่ายที่ดินใหม่พร้อมถนน/สาธารณูปโภค — มูลค่าสูงขึ้น ทุกคนได้ประโยชน์ ใช้สำหรับย่านเมืองใหม่",
    applicableTiers: ["beta"],
    applicableStages: ["partial", "planned"],
    targetPillars: ["livability", "economy"],
    complexity: "medium",
    typicalSize: "THB 200M – 2B",
    aseanExample: "India Amaravati new capital via land pooling from 30,000+ farmers",
    thaiRelevance: "Could work for new smart city districts around Khon Kaen LRT stations or EEC transit hubs.",
  },
  {
    id: "asset-recycling",
    name: "Asset Recycling",
    nameTh: "รีไซเคิลสินทรัพย์",
    category: "equity",
    descEn: "Government sells or leases existing assets (buildings, land, utilities) to private sector, then reinvests proceeds in new smart infrastructure. Unlocks value from underperforming public assets.",
    descTh: "รัฐขายหรือให้เช่าสินทรัพย์ที่มี (อาคาร ที่ดิน สาธารณูปโภค) ให้เอกชน แล้วนำเงินลงทุนในโครงสร้างพื้นฐานอัจฉริยะใหม่",
    applicableTiers: ["alpha"],
    applicableStages: ["operational"],
    targetPillars: ["economy", "livability"],
    complexity: "high",
    typicalSize: "THB 500M – 10B",
    aseanExample: "Indonesia toll roads via asset recycling ($292M equivalent)",
    thaiRelevance: "Thai municipalities have underutilized public land/buildings that could be recycled to fund smart infrastructure.",
  },
];

// ---------------------------------------------------------------------------
// Thailand PPP Legal Framework — PPP Act BE 2562 (2019)
// Source: SEPO / World Bank PPP Thailand / UNESCAP
// ---------------------------------------------------------------------------

export const THAILAND_PPP_FRAMEWORK = {
  law: "Public-Private Partnership Act B.E. 2562 (2019)",
  effectiveDate: "March 2019",
  centralBody: "State Enterprise Policy Office (SEPO), Ministry of Finance",
  policyCommission: "PPP Policy Commission (chaired by Prime Minister)",
  investmentThreshold: "THB 5,000M+ (projects below may qualify if deemed important by the Board)",
  eligibleSectors: [
    "Roads & expressways", "Rail & mass transit", "Ports & airports",
    "Energy & power", "Telecom & ICT", "Water & sanitation",
    "Healthcare", "Education", "Social housing", "Smart city infrastructure",
  ],
  pppModels: ["BTO (Build-Transfer-Operate)", "BOT (Build-Operate-Transfer)", "BOO (Build-Own-Operate)", "DBFOM (Design-Build-Finance-Operate-Maintain)"],
  concessionTerms: "Typically 15–50 years depending on project type and capital recovery period",
  approvalProcess: [
    "Project screening by responsible agency",
    "SEPO review and PPP Committee endorsement",
    "Cabinet approval for projects ≥ THB 5,000M",
    "Private partner selection via competitive bidding",
    "Contract negotiation and execution",
  ],
  recentProjects: [
    { name: "Bangkok Orange Line MRT", value: "THB 140B", sector: "Mass transit", status: "Under construction" },
    { name: "EECi Smart Park (Wangchan Valley)", value: "THB 74.5B", sector: "Smart infrastructure", status: "Planning" },
    { name: "Motorway M6 (Bang Pa-in to Nakhon Ratchasima)", value: "THB 84B", sector: "Roads", status: "Operational" },
    { name: "Don Mueang Airport Phase 3", value: "USD 1.1B", sector: "Aviation", status: "Pipeline (ASEAN Infrastructure)" },
    { name: "Hat Yai-Sadao Motorway", value: "USD 903M", sector: "Roads", status: "Feasibility completed (ASEAN Pipeline)" },
    { name: "Bangkok-Nong Khai HSR Phase 2", value: "THB 300B+", sector: "High-speed rail", status: "Cabinet approved Feb 2025" },
    { name: "Thailand Landbridge", value: "USD 27B", sector: "Port/logistics", status: "Feasibility (ASEAN Pipeline)" },
  ],
  gdpPerCapitaPPP: "USD 21,100 (2024 est., World Bank)",
  eecIncentives: "EEC Act B.E. 2561 (2018) — additional tax holidays (up to 15 years CIT exemption), 200% R&D deduction, fast-track permits, special visa programs",
};

// ---------------------------------------------------------------------------
// ASUS Project — UN-Habitat ASEAN Sustainable Urbanisation Strategy
// Source: ASUS Phase II Inception Reports (April 2025)
// ---------------------------------------------------------------------------

export interface ASUSCityProject {
  cityId: string;
  cityName: string;
  country: string;
  priorityArea: string;
  phase: "phase1" | "phase2" | "both";
  status: string;
  keyInterventions: string[];
  potentialFunding: string[];
  timeline: string;
}

export const ASUS_PROJECTS: ASUSCityProject[] = [
  // Phase I cities continuing in Phase II
  {
    cityId: "hat-yai", cityName: "Hat Yai", country: "Thailand",
    priorityArea: "Safety & Security with Urban Resilience",
    phase: "both", status: "CTP advancing — Climate Change Adaptation Roadmap under development",
    keyInterventions: [
      "AI-enabled CCTV integration with flood monitoring",
      "Climate Change Adaptation Roadmap for U-Tapao watershed",
      "Policy recommendations for cross-municipal flood management",
      "THB 3.5M (USD 100K) municipal budget for 400 CCTV cameras already approved",
    ],
    potentialFunding: ["Municipal budget (approved)", "ACCCRN legacy framework", "Donor climate finance"],
    timeline: "Policy workshop Feb 2026",
  },
  // Phase II new Thai cities
  {
    cityId: "nakhon-si-thammarat", cityName: "Nakhon Si Thammarat", country: "Thailand",
    priorityArea: "Solid Waste Management",
    phase: "phase2", status: "Inception phase — CTP under development",
    keyInterventions: [
      "Integrated solid waste management system",
      "Community-based recycling and circular economy",
      "Digital waste tracking and citizen reporting",
    ],
    potentialFunding: ["Korea Smart City Cooperation Fund", "National budget", "Municipal own-revenue"],
    timeline: "CTP completion June 2026",
  },
  {
    cityId: "chiang-mai-old-town", cityName: "Chiang Mai", country: "Thailand",
    priorityArea: "Safety & Security",
    phase: "phase2", status: "Inception phase — CTP under development",
    keyInterventions: [
      "Smart safety infrastructure for tourism zones",
      "Traffic safety improvements at high-risk intersections",
      "Digital safety reporting and monitoring systems",
    ],
    potentialFunding: ["Korea Smart City Cooperation Fund", "depa Smart City Fund", "Provincial budget"],
    timeline: "CTP completion June 2026",
  },
  // ASEAN peers for comparison
  {
    cityId: "shah-alam", cityName: "Shah Alam", country: "Malaysia",
    priorityArea: "Safety & Security (M&E focus)",
    phase: "both", status: "M&E consultant being recruited Q4 2025",
    keyInterventions: [
      "74 CCTV units installed (25 MDES-funded, 50 Selangor-funded)",
      "AI traffic lights deployed",
      "Power BI dashboards for Community Transformation Programme",
      "SDG 11 benchmarking and PDPA compliance training",
    ],
    potentialFunding: ["Selangor State", "Ministry of Economy", "Microsoft partnership"],
    timeline: "KPI framework Jan 2026",
  },
  {
    cityId: "general-santos", cityName: "General Santos", country: "Philippines",
    priorityArea: "Mobility (Electric tricycle modernisation)",
    phase: "both", status: "City Climate Gap Fund application in progress",
    keyInterventions: [
      "121 electric jeepneys + 72 Euro-IV units on 10 routes",
      "Electric tricycle fleet modernisation",
      "Special Support Fund for cooperative financing",
      "IFC Apex Green Cities Programme loan discussions",
    ],
    potentialFunding: ["City Climate Gap Fund", "IFC Apex Green Cities", "Special Support Fund"],
    timeline: "E-mobility assessment Feb 2026",
  },
];

// ---------------------------------------------------------------------------
// ASEAN Infrastructure Pipeline — SMBC/LIB-SI (April 2025)
// Thailand-specific projects in the Updated Pipeline
// ---------------------------------------------------------------------------

export const ASEAN_PIPELINE_THAILAND = [
  { name: "Hat Yai–Sadao Motorway", cost: "USD 903M", status: "Feasibility/funding identified", sector: "Transport", impact: "High connectivity — links southern Thailand to Malaysia" },
  { name: "Udon Thani–Bueng Kan Highway", cost: "USD 577M", status: "Funding identified", sector: "Transport", impact: "High connectivity — multilateral support being discussed" },
  { name: "Don Mueang Airport Phase 3", cost: "USD 1.1B", status: "Funding identified", sector: "Aviation", impact: "High ASEAN connectivity — government supporting land acquisition" },
  { name: "Thailand Landbridge", cost: "USD 27B", status: "Feasibility stage", sector: "Port/logistics", impact: "Highest-value project — strong private sector interest" },
  { name: "ASEAN Digital Hub", cost: "N/A", status: "Completion by 2025", sector: "Digital", impact: "Regional digital infrastructure" },
  { name: "Bangkok–Nong Khai HSR Phase 2", cost: "THB 300B+", status: "Cabinet approved Feb 2025", sector: "High-speed rail", impact: "Links to China-Laos railway" },
];

// ---------------------------------------------------------------------------
// Bankability Assessment — per-city readiness scoring
// ---------------------------------------------------------------------------

export interface BankabilityAssessment {
  revenueBase: "strong" | "moderate" | "weak";
  institutionalCapacity: "high" | "medium" | "low";
  projectPipeline: "active" | "emerging" | "nascent";
  privateInterest: "high" | "medium" | "low";
  riskProfile: "low" | "moderate" | "elevated";
  readinessScore: number; // 0-100
  recommendation: string;
  recommendationTh: string;
}

export function assessBankability(city: SmartCity): BankabilityAssessment {
  let score = 0;

  // Revenue base (GPP per capita)
  const gpp = city.metrics.gppPerCapita ?? 0;
  const revenueBase: BankabilityAssessment["revenueBase"] =
    gpp > 300000 ? "strong" : gpp > 150000 ? "moderate" : "weak";
  score += revenueBase === "strong" ? 25 : revenueBase === "moderate" ? 15 : 5;

  // Institutional capacity (composite score as proxy)
  const institutionalCapacity: BankabilityAssessment["institutionalCapacity"] =
    city.compositeScore >= 65 ? "high" : city.compositeScore >= 45 ? "medium" : "low";
  score += institutionalCapacity === "high" ? 25 : institutionalCapacity === "medium" ? 15 : 5;

  // Project pipeline (reality + digital score)
  const projectPipeline: BankabilityAssessment["projectPipeline"] =
    city.reality === "operational" && city.scores.digital >= 55 ? "active" :
    city.reality !== "planned" ? "emerging" : "nascent";
  score += projectPipeline === "active" ? 20 : projectPipeline === "emerging" ? 12 : 4;

  // Private sector interest (economy score + EEC bonus)
  let privateInterest: BankabilityAssessment["privateInterest"] = "low";
  if (city.scores.economy >= 70 || city.region === "east") {
    privateInterest = "high";
    score += 20;
  } else if (city.scores.economy >= 55) {
    privateInterest = "medium";
    score += 12;
  } else {
    score += 4;
  }

  // Risk profile (safety + crime rate)
  const crime = city.metrics.crimeRatePer100k ?? 150;
  const riskProfile: BankabilityAssessment["riskProfile"] =
    crime > 200 ? "elevated" : crime > 150 ? "moderate" : "low";
  score += riskProfile === "low" ? 10 : riskProfile === "moderate" ? 6 : 2;

  // Generate recommendation
  let recommendation = "";
  let recommendationTh = "";

  if (score >= 75) {
    recommendation = `Strong bankability (${score}/100). This city can access commercial finance: PPP under the PPP Act B.E. 2562, municipal bonds, and green bonds. The revenue base supports debt service. Ready for THB 5B+ projects.`;
    recommendationTh = `ความพร้อมทางการเงินสูง (${score}/100) เมืองนี้เข้าถึงการเงินเชิงพาณิชย์ได้: PPP ภายใต้ พ.ร.บ. PPP 2562, พันธบัตรเทศบาล, และพันธบัตรสีเขียว ฐานรายได้รองรับการชำระหนี้ได้ พร้อมสำหรับโครงการ 5 พันล้านบาท+`;
  } else if (score >= 50) {
    recommendation = `Moderate bankability (${score}/100). Blended finance recommended: combine concessional DFI lending (JICA/ADB) with BOI incentives and national government transfers. Build track record before approaching commercial markets.`;
    recommendationTh = `ความพร้อมทางการเงินปานกลาง (${score}/100) แนะนำการเงินผสมผสาน: ผสม DFI lending ผ่อนปรน (JICA/ADB) กับสิทธิประโยชน์ BOI และเงินอุดหนุนจากรัฐบาลกลาง สร้างประวัติก่อนเข้าตลาดเชิงพาณิชย์`;
  } else {
    recommendation = `Early-stage bankability (${score}/100). Focus on grants and technical assistance first: depa Smart City Fund, USTDA, ASUS Project TA, Korea Smart City Cooperation Fund. Build institutional capacity before seeking repayable finance.`;
    recommendationTh = `ความพร้อมทางการเงินระยะเริ่มต้น (${score}/100) เน้นเงินช่วยเหลือและ TA ก่อน: กองทุน depa, USTDA, ASUS Project TA, กองทุนความร่วมมือเมืองอัจฉริยะเกาหลี สร้างศักยภาพสถาบันก่อนการเงินที่ต้องชำระคืน`;
  }

  return { revenueBase, institutionalCapacity, projectPipeline, privateInterest, riskProfile, readinessScore: score, recommendation, recommendationTh };
}

/** Get ASUS project info for a specific city */
export function getASUSProject(cityId: string): ASUSCityProject | undefined {
  return ASUS_PROJECTS.find(p => p.cityId === cityId);
}

/** Recommend financial instruments for a specific city */
export function recommendInstruments(city: SmartCity): FinancialRecommendation[] {
  const results: FinancialRecommendation[] = [];

  for (const inst of instruments) {
    // Check tier match
    if (!inst.applicableTiers.includes(city.tier)) continue;
    // Check stage match
    if (!inst.applicableStages.includes(city.reality)) continue;

    // Score relevance based on pillar weaknesses
    let relevance = 0;
    let reason = "";
    let reasonTh = "";

    for (const pillar of inst.targetPillars) {
      const score = city.scores[pillar];
      if (score < 50) {
        relevance += (50 - score); // Higher relevance for bigger gaps
      } else if (score < 70) {
        relevance += 5;
      }
    }

    // Bonus for matching city characteristics
    if (city.metrics.gppPerCapita && city.metrics.gppPerCapita > 300000 && inst.id === "municipal-bond") {
      relevance += 20;
      reason = "High GPP per capita suggests strong municipal revenue base for bond issuance.";
      reasonTh = "GPP ต่อหัวสูงบ่งชี้ฐานรายได้เทศบาลแข็งแกร่งสำหรับออกพันธบัตร";
    }

    if (city.smartDimensions.includes("energy") && (inst.id === "green-bond" || inst.id === "on-bill")) {
      relevance += 15;
      reason = reason || "City focuses on Smart Energy — green financing instruments are a natural fit.";
      reasonTh = reasonTh || "เมืองเน้น Smart Energy — เครื่องมือการเงินสีเขียวเหมาะเป็นพิเศษ";
    }

    if (city.smartDimensions.includes("environment") && inst.id === "green-bond") {
      relevance += 15;
      reason = reason || "Smart Environment focus aligns with green bond eligibility criteria.";
      reasonTh = reasonTh || "เน้น Smart Environment ตรงกับเกณฑ์คุณสมบัติพันธบัตรสีเขียว";
    }

    if (city.tier === "gamma" && (inst.id === "ta-grant" || inst.id === "nat-gov-transfer")) {
      relevance += 25;
      reason = reason || "Early-stage city needs grants and technical assistance before commercial financing.";
      reasonTh = reasonTh || "เมืองระยะเริ่มต้นต้องการเงินช่วยเหลือและความช่วยเหลือทางเทคนิคก่อนการเงินเชิงพาณิชย์";
    }

    if (city.region === "east" && inst.id === "sez") {
      relevance += 20;
      reason = reason || "Located in Eastern region — eligible for EEC Special Economic Zone incentives.";
      reasonTh = reasonTh || "ตั้งอยู่ในภาคตะวันออก — มีสิทธิ์รับสิทธิประโยชน์ EEC";
    }

    if (relevance <= 0 && inst.complexity === "low") {
      relevance = 3; // Low-complexity instruments always somewhat relevant
      reason = reason || "Low-complexity instrument accessible to most cities.";
      reasonTh = reasonTh || "เครื่องมือความซับซ้อนต่ำ เข้าถึงได้สำหรับเมืองส่วนใหญ่";
    }

    if (relevance <= 0) continue;

    if (!reason) {
      reason = `Matches city tier (${city.tier}) and development stage (${city.reality}).`;
      reasonTh = `ตรงกับระดับเมือง (${city.tier}) และระยะพัฒนา (${city.reality})`;
    }

    const priority: FinancialRecommendation["priority"] =
      relevance >= 20 ? "primary" : relevance >= 10 ? "secondary" : "exploratory";

    results.push({ instrument: inst, priority, reason, reasonTh });
  }

  // Sort: primary first, then secondary, then exploratory
  const order = { primary: 0, secondary: 1, exploratory: 2 };
  results.sort((a, b) => order[a.priority] - order[b.priority]);

  return results;
}
