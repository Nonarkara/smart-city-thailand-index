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
