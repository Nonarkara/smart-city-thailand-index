// ---------------------------------------------------------------------------
// Per-City Investment Lens — for /invest
// ---------------------------------------------------------------------------
// A city-by-city view of which financing instruments actually work where.
// Cross-references the ASEAN Smart City Financing Toolkit
// (https://smartcitytoolkit.asean.org/) and the FIRST recommendation engine
// for comparable cross-country case studies. The Thai case study that the
// Toolkit carries — "Green Bond for Wind Farm Development" — is referenced
// directly in the Phuket card below.
//
// What this file is NOT: it does not invent financing instruments. Every
// primary/secondary tool name maps to a real instrument category in the
// ASEAN Toolkit (financial-instruments/) or to a Thai-specific vehicle
// (BOI Section 31, depa Smart City Fund, SEC Green Bond Framework).
// ---------------------------------------------------------------------------

import { getCityById } from "./cityData";
import { getFinancingAdvice } from "./cityAnalytics";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

export type InvestmentTool =
  | "boi-section-31"        // BOI 8-year CIT exemption (Section 31)
  | "boi-non-eec"           // BOI 5-year CIT exemption (non-EEC)
  | "gsss-bond"             // Green/Social/Sustainable/Sustainability-Linked Bond
  | "sec-green-bond"        // Thai SEC Green Bond Framework (municipal/corporate)
  | "ppp-bot"               // PPP Build-Operate-Transfer
  | "ppp-kkts"              // Khon Kaen Think Tank PPP model (transit, digital health)
  | "gov-funding"           // National / provincial government transfers
  | "blended-finance"       // Concessional DFI + commercial co-finance
  | "adb-acgf"              // ASEAN Catalytic Green Finance Facility (ADB)
  | "aasctf"                // ASEAN Australia Smart Cities Trust Fund
  | "jasca-partner"         // Japan Association for Smart Cities in ASEAN
  | "us-asean"              // US-ASEAN Smart Cities Partnership
  | "depa-fund"             // depa Smart City Fund (technical assistance grant)
  | "tourism-levy"          // Tourism fee reinvestment
  | "municipal-bond"        // Municipal bond issuance (Indian model)
  | "asset-recycling"       // Divest existing infra, reinvest proceeds
  | "term-loan"             // Commercial bank term loan
  | "land-value-capture"    // LVC around transit / infrastructure corridors
  | "crowdfunding";         // Citizen / community crowdfunding

export const TOOL_LABELS: Record<InvestmentTool, { en: string; th: string; zh: string }> = {
  "boi-section-31":      { en: "BOI Section 31 (8yr CIT, EEC)",   th: "BOI มาตรา 31 (CIT 8 ปี, EEC)",   zh: "BOI 第31条（EEC 8年免税）" },
  "boi-non-eec":         { en: "BOI 5yr CIT (non-EEC)",           th: "BOI CIT 5 ปี (นอก EEC)",          zh: "BOI 5年免税（非EEC）" },
  "gsss-bond":           { en: "GSSS Bond",                        th: "พันธบัตร GSSS",                     zh: "GSSS 债券" },
  "sec-green-bond":      { en: "SEC Green Bond Framework",         th: "กรอบพันธบัตรเขียว ก.ล.ต.",          zh: "SEC绿色债券框架" },
  "ppp-bot":             { en: "PPP / Build-Operate-Transfer",    th: "PPP / Build-Operate-Transfer",      zh: "PPP / BOT" },
  "ppp-kkts":            { en: "PPP — Khon Kaen (KKTS) Model",    th: "PPP — ขอนแก่น (รูปแบบ KKTS)",        zh: "PPP — 孔敬（KKTS 模式）" },
  "gov-funding":         { en: "National / Provincial Funding",   th: "เงินอุดหนุนรัฐบาลกลาง/จังหวัด",         zh: "国家/省级拨款" },
  "blended-finance":     { en: "Blended Finance (DFI + private)", th: "การเงินผสม (DFI + เอกชน)",            zh: "混合融资（DFI + 私营）" },
  "adb-acgf":            { en: "ADB ACGF (ASEAN green finance)",  th: "ADB ACGF (การเงินสีเขียวอาเซียน)",    zh: "亚开行 ACGF（东盟绿色融资）" },
  "aasctf":              { en: "ASEAN Australia Smart Cities Trust Fund", th: "กองทุนอาเซียน-ออสเตรเลียเมืองอัจฉริยะ", zh: "东盟-澳大利亚智慧城市信托基金" },
  "jasca-partner":       { en: "JASCA Partner (Japan)",            th: "พันธมิตร JASCA (ญี่ปุ่น)",            zh: "JASCA 合作伙伴（日本）" },
  "us-asean":            { en: "US-ASEAN Smart Cities Partnership", th: "ความร่วมมือเมืองอัจฉริยะสหรัฐ-อาเซียน", zh: "美国-东盟智慧城市合作" },
  "depa-fund":           { en: "depa Smart City Fund (TA grant)",  th: "กองทุน depa Smart City (ทุน TA)",   zh: "depa 智慧城市基金（技援拨款）" },
  "tourism-levy":        { en: "Tourism Levy Reinvestment",        th: "การลงทุนซ้ำจากค่าธรรมเนียมท่องเที่ยว", zh: "旅游税再投资" },
  "municipal-bond":      { en: "Municipal Bond Issuance",          th: "การออกพันธบัตรเทศบาล",                zh: "市政债券发行" },
  "asset-recycling":     { en: "Asset Recycling",                  th: "Asset Recycling",                   zh: "资产回收" },
  "term-loan":           { en: "Bank Term Loan",                   th: "สินเชื่อระยะยาวธนาคาร",                  zh: "银行定期贷款" },
  "land-value-capture":  { en: "Land Value Capture",               th: "จับมูลค่าที่ดิน (LVC)",                 zh: "土地增值捕获" },
  "crowdfunding":        { en: "Crowdfunding",                     th: "ระดมทุนจากประชาชน",                     zh: "众筹" },
};

export type AseanCase = {
  country: string;
  flagEmoji: string;
  caseName: string;
  caseUrl: string;
  amount: string;
  oneLine: { en: string; th: string; zh: string };
};

export type CityInvestmentProfile = {
  /**
   * cityId is OPTIONAL. Some entries are metropolitan areas (Bangkok) that
   * do not have a single cityData entry. When present, the lens renders a
   * deep link to /city/<cityId>/. When absent (subjectKind === "metropolitan"),
   * the lens renders the subject as a province-level view.
   */
  cityId?: string;
  subjectKind: "city" | "metropolitan";
  rank: number; // ordering on the /invest page
  provinceEn: string;
  provinceTh: string;
  region: "north" | "south" | "east" | "central" | "bangkok" | "northeast" | "west";
  ascnMember: boolean;
  eecZone: boolean;
  primaryTool: InvestmentTool;
  secondaryTool: InvestmentTool;
  oneLiner: { en: string; th: string; zh: string };
  bestFor: { en: string; th: string; zh: string };
  keyRisk: { en: string; th: string; zh: string };
  comparableCase: AseanCase;
  climateNote?: { en: string; th: string; zh: string };
};

// Eight cities. The order is editorial, not by score — Bangkok first because
// every conversation starts there, then EEC because the strongest incentive
// package lives there, then secondary cities, then the south.
export const CITY_INVESTMENT_PROFILES: CityInvestmentProfile[] = [
  {
    subjectKind: "metropolitan",
    rank: 1,
    provinceEn: "Bangkok",
    provinceTh: "กรุงเทพฯ",
    region: "bangkok",
    ascnMember: true,
    eecZone: false,
    primaryTool: "gov-funding",
    secondaryTool: "sec-green-bond",
    oneLiner: {
      en: "The capital. Special administrative status — not one of the 76 provinces, governor is elected. ASCN member. ESG bond market is the deepest in the country.",
      th: "เมืองหลวง มีสถานะปกครองพิเศษ ไม่ได้เป็น 1 ใน 76 จังหวัด ผู้ว่าฯ มาจากการเลือกตั้ง สมาชิก ASCN ตลาดพันธบัตร ESG ลึกที่สุดในประเทศ",
      zh: "首都。特别行政区地位 — 不属于76府，府尹由选举产生。ASCN 成员。ESG债券市场是泰国最深的。",
    },
    bestFor: {
      en: "Sukuk, corporate green bonds, ADB ACGF co-lending, national-scale pilots. Where the central budget first arrives.",
      th: "สุกุก พันธบัตรเขียวองค์กร ADB ACGF ร่วมปล่อยกู้ โครงการนำร่องระดับประเทศ งบประมาณส่วนกลางมาถึงที่นี่ก่อน",
      zh: "Sukuk、企业绿色债券、亚开行 ACGF 联合贷款、国家级试点。中央预算首先到达这里。",
    },
    keyRisk: {
      en: "Regulatory pace. BMA budget approval cycles run on Bangkok's clock, not the national fiscal year. Project timelines stretch.",
      th: "ความเร็วกฎระเบียบ วงจรอนุมัติงบ กทม. เดินตามนาฬิกากรุงเทพฯ ไม่ใช่ปีงบประมาณของชาติ เส้นเวลาโครงการยืดเยื้อ",
      zh: "监管节奏。BMA 预算审批周期按曼谷节奏而非国家财政年度运行。项目时间线拉长。",
    },
    comparableCase: {
      country: "Singapore",
      flagEmoji: "🇸🇬",
      caseName: "National Government Transfers for Smart City Initiatives",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/national-government-transfers-for-smart-city-initiatives-in-singapore/",
      amount: "Whole-of-government",
      oneLine: {
        en: "Same instrument category — central transfers to city agencies for digital infrastructure. The Singapore version runs faster because their inter-agency governance is tighter.",
        th: "หมวดเครื่องมือเดียวกัน — เงินโอนจากส่วนกลางไปยังหน่วยงานเมืองเพื่อโครงสร้างพื้นฐานดิจิทัล เวอร์ชันสิงคโปร์เร็วกว่าเพราะธรรมาภิบาลระหว่างหน่วยงานแน่นกว่า",
        zh: "同一类工具 — 中央向城市机构转移支付用于数字基础设施。新加坡版本更快，因为跨机构治理更紧。",
      },
    },
  },
  {
    cityId: "chachoengsao",
    subjectKind: "city",
    rank: 2,
    provinceEn: "Chachoengsao",
    provinceTh: "ฉะเชิงเทรา",
    region: "east",
    ascnMember: false,
    eecZone: true,
    primaryTool: "boi-section-31",
    secondaryTool: "adb-acgf",
    oneLiner: {
      en: "EEC gateway. The 8-year CIT exemption plus import-duty waiver is the strongest incentive package in Thailand. World Bank CCDR 2025 names this the EEC province with the largest water deficit (897 MCM by 2037).",
      th: "ประตูสู่ EEC ยกเว้น CIT 8 ปี + ยกเว้นอากรนำเข้า แพ็คเกจจูงใจแข็งแกร่งที่สุดในไทย ธนาคารโลก CCDR 2568: จังหวัด EEC ที่ขาดแคลนน้ำมากที่สุด (897 ล้านลบ.ม. ปี 2580)",
      zh: "EEC 门户。8 年免税加进口关税豁免是泰国最强的激励组合。世银 CCDR 2025 将其列为 EEC 中水缺口最大的府（到2037年缺口8.97亿立方米）。",
    },
    bestFor: {
      en: "EEC-located manufacturing with smart-factory ops, 5G infrastructure that follows the EEC corridor, water-efficiency technology — the deficit is also a market.",
      th: "การผลิตในเขต EEC ที่มี smart factory โครงสร้างพื้นฐาน 5G ที่ตามแนว EEC เทคโนโลยีประสิทธิภาพน้ำ — การขาดแคลนคือตลาด",
      zh: "EEC 内的智能工厂制造业、沿 EEC 走廊的 5G 基础设施、节水技术 — 缺水本身也是市场。",
    },
    keyRisk: {
      en: "897 MCM water deficit by 2037 is structural, not cyclical. ADB ACGF and depa fund this; commercial banks do not.",
      th: "การขาดแคลนน้ำ 897 ล้านลบ.ม. ปี 2580 เป็นเชิงโครงสร้าง ไม่ใช่วัฏจักร ADB ACGF และ depa สนับสนุน ธนาคารพาณิชย์ไม่สนใจ",
      zh: "到2037年缺口8.97亿立方米是结构性的，不是周期性的。ADB ACGF 和 depa 资助；商业银行不参与。",
    },
    comparableCase: {
      country: "Viet Nam",
      flagEmoji: "🇻🇳",
      caseName: "Water Environment Improvement Project",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/water-environment-improvement-project-vietnam/",
      amount: "Term loan",
      oneLine: {
        en: "Asian Development Bank term loan for water infrastructure in a similarly water-stressed basin. Same financing category, comparable size.",
        th: "สินเชื่อระยะยาว ADB สำหรับโครงสร้างพื้นฐานน้ำในลุ่มน้ำที่เครียดน้ำคล้ายกัน หมวดเดียวกัน ขนาดเทียบเคียงได้",
        zh: "亚开行向类似缺水流域的水基础设施提供定期贷款。同类工具，规模可比较。",
      },
    },
    climateNote: {
      en: "World Bank CCDR 2025: 897 MCM deficit by 2037, the largest of the three EEC provinces. Also named as priority for upper Gulf coastal mud-beach protection.",
      th: "ธนาคารโลก CCDR 2568: ขาดแคลน 897 ล้านลบ.ม. ปี 2580 มากที่สุดใน EEC 3 จังหวัด ระบุเป็นพื้นที่ลำดับความสำคัญสำหรับปกป้องชายฝั่งอ่าวบน",
      zh: "世银 CCDR 2025：到2037年缺口8.97亿立方米，EEC三府中最大。也列为上 Gulf 沿海泥滩保护重点。",
    },
  },
  {
    cityId: "rayong",
    subjectKind: "city",
    rank: 3,
    provinceEn: "Rayong",
    provinceTh: "ระยอง",
    region: "east",
    ascnMember: false,
    eecZone: true,
    primaryTool: "boi-section-31",
    secondaryTool: "blended-finance",
    oneLiner: {
      en: "EEC's industrial powerhouse. Map Ta Phut petrochemical complex. World Bank CCDR 2025: water deficit grows from 170 MCM in 2024 to 292 MCM by 2037. Only 37% of EEC wastewater is currently treated.",
      th: "ผู้มีอำนาจอุตสาหกรรมของ EEC นิคมปิโตรเคมีมาบตาพุด ธนาคารโลก CCDR 2568: การขาดแคลนน้ำเพิ่มจาก 170 ล้านลบ.ม. ปี 2567 เป็น 292 ล้านลบ.ม. ปี 2580 มีเพียง 37% ของน้ำเสีย EEC ที่ผ่านการบำบัด",
      zh: "EEC 的工业重镇。马达普石化综合体。世银 CCDR 2025：缺水从2024年的1.7亿立方米增长到2037年的2.92亿。EEC 废水目前只有 37% 处理。",
    },
    bestFor: {
      en: "Petrochemical and industrial-process efficiency, water-recycling technology (37% treatment is the supply ceiling), environmental monitoring around Map Ta Phut.",
      th: "ประสิทธิภาพกระบวนการปิโตรเคมีและอุตสาหกรรม เทคโนโลยีนำน้ำกลับมาใช้ใหม่ (37% เป็นเพดานอุปทาน) การเฝ้าระวังรอบมาบตาพุด",
      zh: "石化与工业流程效率、水回收技术（37% 处理是供给上限）、马达普周边环境监测。",
    },
    keyRisk: {
      en: "Only 37% of EEC wastewater is treated. Water circularity is the next industrial constraint — not a niche ESG line.",
      th: "มีเพียง 37% ของน้ำเสีย EEC ที่ผ่านการบำบัด การหมุนเวียนน้ำคือข้อจำกัดอุตสาหกรรมถัดไป — ไม่ใช่ ESG เฉพาะกลุ่ม",
      zh: "EEC 废水只有 37% 处理。水循环是下一个工业约束 — 不是小众 ESG 项。",
    },
    comparableCase: {
      country: "Indonesia",
      flagEmoji: "🇮🇩",
      caseName: "Asset Recycling for Toll Road Projects",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/asset-recycling-for-toll-road-projects-in-indonesia/",
      amount: "IDR 4.38T (US$291.6M)",
      oneLine: {
        en: "Divest 40% of operating toll-road company, reinvest proceeds. Rayong's petrochemical assets can run the same playbook if Maptaphut operators choose to recycle.",
        th: "ขาย 40% ของบริษัททางด่วนที่ดำเนินงาน นำเงินไปลงทุนใหม่ สินทรัพย์ปิโตรเคมีระยองเล่นแบบเดียวกันได้ถ้าผู้ประกอบการมาบตาพุดเลือกทำ",
        zh: "剥离运营中的收费公路公司 40%，收益再投资。洛勇的石化资产可走同样路径，如果马塔普运营商选择回收。",
      },
    },
    climateNote: {
      en: "World Bank CCDR 2025: 292 MCM water deficit by 2037. Water circularity — not expansion — is the next industrial edge for this corridor.",
      th: "ธนาคารโลก CCDR 2568: ขาดแคลนน้ำ 292 ล้านลบ.ม. ปี 2580 การหมุนเวียนน้ำ — ไม่ใช่การขยาย — คือความได้เปรียบอุตสาหกรรมถัดไปของแนวนี้",
      zh: "世银 CCDR 2025：到2037年缺口2.92亿立方米。水循环 — 非扩张 — 是这条走廊的下一个工业优势。",
    },
  },
  {
    cityId: "phuket",
    subjectKind: "city",
    rank: 4,
    provinceEn: "Phuket",
    provinceTh: "ภูเก็ต",
    region: "south",
    ascnMember: true,
    eecZone: false,
    primaryTool: "gsss-bond",
    secondaryTool: "tourism-levy",
    oneLiner: {
      en: "Thailand's most functional smart-tourism city. ASCN member. The Thai case study the ASEAN Toolkit carries is a wind-farm Green Bond — same GSSS instrument, climate-resilient infrastructure.",
      th: "เมืองท่องเที่ยวอัจฉริยะที่ทำงานได้มากที่สุดของไทย สมาชิก ASCN เคสไทยใน ASEAN Toolkit คือ Green Bond กังหันลม — เครื่องมือ GSSS เดียวกัน โครงสร้างพื้นฐานทนภูมิอากาศ",
      zh: "泰国最实用的智能旅游城市。ASCN 成员。ASEAN 工具包中的泰国案例是风电绿色债券 — 同样 GSSS 工具、气候韧性基础设施。",
    },
    bestFor: {
      en: "Climate-resilient coastal infrastructure (GSSS Bond), mangrove restoration with a revenue model (Nai Nang model), smart-tourism platforms.",
      th: "โครงสร้างพื้นฐานชายฝั่งทนภูมิอากาศ (GSSS Bond) การฟื้นฟูป่าชายเลนพร้อมโมเดลรายได้ (โมเดลนายนาง) แพลตฟอร์มท่องเที่ยวอัจฉริยะ",
      zh: "气候韧性海岸基础设施（GSSS 债券）、带收入模型的红树林修复（Nai Nang 模式）、智能旅游平台。",
    },
    keyRisk: {
      en: "Heat stress shortening outdoor tourism seasons (World Bank CCDR 2025). 695 hotels on TAT's CF-Hotels platform; only 160 self-reported emissions in 2024 — sustainability narrative is ahead of operational reporting.",
      th: "ความเครียดร้อนทำให้ฤดูท่องเที่ยวกลางแจ้งสั้นลง (ธนาคารโลก CCDR 2568) โรงแรม 695 แห่งอยู่บนแพลตฟอร์ม CF-Hotels ของ TAT มีเพียง 160 แห่งที่รายงานการปล่อยในปี 2567 — เรื่องเล่าเรื่องความยั่งยืนนำหน้าการรายงานจริง",
      zh: "高温压力缩短户外旅游季（世银 CCDR 2025）。695 家酒店在 TAT 的 CF-Hotels 平台；2024 年仅 160 家自报排放数据 — 可持续叙事领先于运营报告。",
    },
    comparableCase: {
      country: "Thailand",
      flagEmoji: "🇹🇭",
      caseName: "Green Bond for Wind Farm Development in Thailand",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/green-bond-for-wind-farm-development-in-thailand/",
      amount: "GSSS Bond (ASEAN Toolkit's only Thai case study)",
      oneLine: {
        en: "The ASEAN Toolkit's lone Thai case study. GSSS Bond issuance for wind farm development. Same instrument category Phuket can use for coastal climate infrastructure.",
        th: "เคสไทยเพียงหนึ่งเดียวใน ASEAN Toolkit การออก GSSS Bond สำหรับพัฒนากังหันลม หมวดเครื่องมือเดียวกันที่ภูเก็ตใช้ได้กับโครงสร้างพื้นฐานชายฝั่งทนภูมิอากาศ",
        zh: "ASEAN 工具包中唯一的泰国案例。风电开发的 GSSS 债券发行。同类工具，Phuket 可用于海岸气候基础设施。",
      },
    },
    climateNote: {
      en: "World Bank CCDR 2025: heat stress vulnerability reduces beach tourism seasons; coastal resorts co-finance mangrove restoration to prevent erosion and storm surge damage.",
      th: "ธนาคารโลก CCDR 2568: ความเปราะบางจากความร้อนลดฤดูท่องเที่ยวชายหาด รีสอร์ตชายฝั่งร่วมทุนฟื้นฟูป่าชายเลนป้องกันการกัดเซาะและซัดชายฝั่ง",
      zh: "世银 CCDR 2025：高温脆弱性缩短海滩旅游季；海滨度假村共同资助红树林修复以防止侵蚀和风暴潮损害。",
    },
  },
  {
    cityId: "chiang-mai-old-town",
    subjectKind: "city",
    rank: 5,
    provinceEn: "Chiang Mai",
    provinceTh: "เชียงใหม่",
    region: "north",
    ascnMember: true,
    eecZone: false,
    primaryTool: "ppp-kkts",
    secondaryTool: "aasctf",
    oneLiner: {
      en: "Cultural heart of the north. ASCN member. UNESCO Creative Cities Network candidate. KKTS-style PPPs for heritage preservation + digital tourism. Haze (PM2.5) is the structural headwind.",
      th: "หัวใจวัฒนธรรของภาคเหนือ สมาชิก ASCN ผู้สมัครเครือข่ายเมืองสร้างสรรค์ UNESCO PPP สไตล์ KKTS สำหรับอนุรักษ์มรดก + ท่องเที่ยวดิจิทัล หมอกควัน (PM2.5) คือแรงต้านโครงสร้าง",
      zh: "北部文化心脏。ASCN 成员。联合国教科文创意城市网络候选。以 KKTS 模式 PPP 用于遗产保护 + 数字旅游。雾霾（PM2.5）是结构性逆风。",
    },
    bestFor: {
      en: "Cultural heritage IoT (sensor monitoring at temple sites), digital tourism platforms, creative-economy PPP. Tourism revenue can self-fund part of the smart infrastructure if structured right.",
      th: "IoT มรดกวัฒนธรรม (เซนเซอร์ที่ไซต์วัด) แพลตฟอร์มท่องเที่ยวดิจิทัล PPP เศรษฐกิจสร้างสรรค์ รายได้ท่องเที่ยวระดมทุนโครงสร้างพื้นฐานอัจฉริยะได้เองถ้าจัดโครงสร้างถูก",
      zh: "文化遗产 IoT（古迹传感器监测）、数字旅游平台、创意经济 PPP。如果结构得当，旅游收入可为智能基础设施自筹部分资金。",
    },
    keyRisk: {
      en: "PM2.5 46.1 µg/m³ annual average — over 4x WHO guideline. Burning season is structural, not weather. Smart air-quality networks help, but the source is agricultural policy, not sensors.",
      th: "PM2.5 เฉลี่ยต่อปี 46.1 µg/m³ — เกินเกณฑ์ WHO 4 เท่า ฤดูเผาเป็นเชิงโครงสร้าง ไม่ใช่สภาพอากาศ เครือข่ายคุณภาพอากาศช่วยได้ แต่ที่มาคือนโยบายเกษตร ไม่ใช่เซนเซอร์",
      zh: "PM2.5 年均 46.1 µg/m³ — 超过 WHO 准则 4 倍以上。焚烧季是结构性的，不是天气。智能空气质量网络有帮助，但根源是农业政策。",
    },
    comparableCase: {
      country: "Lao PDR",
      flagEmoji: "🇱🇦",
      caseName: "Urban Environment Improvement Investment Project",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/urban-environment-improvement-investment-project-lao-pdr/",
      amount: "US$45M (regional development funds)",
      oneLine: {
        en: "Same financing category — regional development funds for an urban-environment improvement project in a UNESCO heritage town. A working precedent for Chiang Mai's temple-zone approach.",
        th: "หมวดเดียวกัน — เงินทุนพัฒนาภูมิภาคสำหรับโครงการปรับปรุงสิ่งแวดล้อมเมืองในเมืองมรดก UNESCO เป็นบรรทัดฐานสำหรับแนวทางเขตวัดเชียงใหม่",
        zh: "同类工具 — 区域发展基金用于 UNESCO 遗产城镇的城市环境改善项目。可作为清迈寺庙区方案的先例。",
      },
    },
  },
  {
    cityId: "khon-kaen",
    subjectKind: "city",
    rank: 6,
    provinceEn: "Khon Kaen",
    provinceTh: "ขอนแก่น",
    region: "northeast",
    ascnMember: true,
    eecZone: false,
    primaryTool: "ppp-kkts",
    secondaryTool: "adb-acgf",
    oneLiner: {
      en: "Isan's anchor city. ASCN member. The KKTS (Khon Kaen Think Tank) consortium pioneered local PPP templates now replicable to other secondary cities. Pilot projects here cost 3-5x less than Bangkok or EEC.",
      th: "เมืองหลักของอีสาน สมาชิก ASCN กลุ่ม KKTS (สถาบันคลังปัญญา) บุกเบิกแม่แบบ PPP ในพื้นที่ ขยายไปเมืองรองอื่นได้ โครงการนำร่องที่นี่ราคา 3-5 เท่า ต่ำกว่ากรุงเทพฯ หรือ EEC",
      zh: "伊善地区核心城市。ASCN 成员。KKTS（孔敬智库）联合体开创了可复制到其他次级城市的地方 PPP 模板。这里的试点项目成本比曼谷或 EEC 低 3-5 倍。",
    },
    bestFor: {
      en: "KKTS-model PPPs (transit, digital health, urban services), ADB ACGF green infrastructure. The 3-5x cost discount on pilots means a US$5M proof-of-concept here is what US$20M looks like in Bangkok.",
      th: "PPP รูปแบบ KKTS (ขนส่ง สุขภาพดิจิทัล บริการเมือง) ADB ACGF โครงสร้างพื้นฐานสีเขียว ส่วนลดต้นทุน 3-5 เท่าในการนำร่อง หมายความว่า proof-of-concept US$5M ที่นี่เทียบเท่า US$20M ในกรุงเทพฯ",
      zh: "KKTS 模式 PPP（交通、数字健康、城市服务）、亚开行 ACGF 绿色基础设施。试点项目 3-5 倍的成本折扣意味着这里的 500 万美元概念验证相当于曼谷的 2000 万美元。",
    },
    keyRisk: {
      en: "Smaller talent pool than Bangkok or Chiang Mai. The cost discount is real; the labour depth is the trade.",
      th: "บุคลากรน้อยกว่ากรุงเทพฯ หรือเชียงใหม่ ส่วนลดต้นทุนจริง ความลึกของแรงงานคือข้อแลกเปลี่ยน",
      zh: "人才池比曼谷或清迈小。成本折扣是真的；劳动力深度是取舍。",
    },
    comparableCase: {
      country: "Philippines",
      flagEmoji: "🇵🇭",
      caseName: "Public-Private Partnership to Develop Public Market in the Philippines",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/public-private-partnership-to-develop-public-market-in-the-phillipines/",
      amount: "PPP / BOT",
      oneLine: {
        en: "BOT structure for a public market. Khon Kaen's KKTS model is a more sophisticated version of the same template — a replicable BOT shape for any secondary city.",
        th: "โครงสร้าง BOT สำหรับตลาดสาธารณะ โมเดล KKTS ขอนแก่นคือเวอร์ชันซับซ้อนกว่าของแม่แบบเดียวกัน — รูปทรง BOT ที่จำลองได้สำหรับเมืองรองใดก็ได้",
        zh: "公共市场的 BOT 结构。孔敬 KKTS 模式是同一模板的更复杂版本 — 任何次级城市可复制的 BOT 形态。",
      },
    },
  },
  {
    cityId: "hat-yai",
    subjectKind: "city",
    rank: 7,
    provinceEn: "Songkhla (Hat Yai)",
    provinceTh: "สงขลา (หาดใหญ่)",
    region: "south",
    ascnMember: false,
    eecZone: false,
    primaryTool: "boi-non-eec",
    secondaryTool: "tourism-levy",
    oneLiner: {
      en: "Southern commercial capital. Cross-border gateway to Malaysia. BOI Section 31 (5-year CIT, non-EEC) plus tourism-levy reinvestment. ASEAN Toolkit's Malaysia sukuk precedent applies to the regional bond market.",
      th: "เมืองหลวงการค้าภาคใต้ ประตูข้ามพรมแดนมาเลเซีย BOI มาตรา 31 (CIT 5 ปี นอก EEC) บวกการลงทุนซ้ำจากค่าธรรมเนียมท่องเที่ยว บรรทัดฐานสุกุกมาเลเซียใน ASEAN Toolkit ใช้กับตลาดพันธบัตรภูมิภาคได้",
      zh: "南部商业之都。通往马来西亚的跨境门户。BOI 第31条（5年免税，非EEC）加上旅游税再投资。ASEAN 工具包的马来西亚 sukuk 先例适用于区域债券市场。",
    },
    bestFor: {
      en: "Cross-border logistics and trade, halal-economy plays (Malaysia sukuk framework is the regional reference), tourism reinvestment into TAT priority destinations.",
      th: "โลจิสติกส์ข้ามพรมแดนและการค้า เศรษฐกิจฮาลาล (กรอบสุกุกมาเลเซียคือข้อมูลอ้างอิงภูมิภาค) การลงทุนซ้ำจากการท่องเที่ยวสู่จุดหมาย TAT ลำดับความสำคัญ",
      zh: "跨境物流和贸易、清真经济（马来西亚 sukuk 框架是区域参考）、TAT 优先目的地的旅游再投资。",
    },
    keyRisk: {
      en: "Deep south security situation. Some sectors insurance-priced; some not. The line moves over time — verify with a current-source desk check before committing capital.",
      th: "สถานการณ์ความมั่นคงชายแดนใต้ บางภาคส่วนมีการตั้งราคาประกันภัย บางส่วนไม่มี เส้นแบ่งเคลื่อนตามเวลา — ตรวจสอบกับโต๊ะแหล่งข่าวปัจจุบันก่อนลงทุน",
      zh: "南部边境安全局势。某些行业已纳入保险定价；某些则没有。界限随时间变化 — 投入资本前请用当前来源核查。",
    },
    comparableCase: {
      country: "Malaysia",
      flagEmoji: "🇲🇾",
      caseName: "First Green Sukuk in Malaysia",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/first-green-sukuk-in-malaysia/",
      amount: "SRI Sukuk framework (~40% of global sukuk market)",
      oneLine: {
        en: "The regional sukuk reference. Malaysia's Sustainable and Responsible Investment sukuk framework is the template any southern Thai city can use for shariah-compliant green issuance.",
        th: "ข้อมูลอ้างอิงสุกุกภูมิภาค กรอบ SRI Sukuk ของมาเลเซียคือแม่แบบที่เมืองไทยภาคใต้ใช้สำหรับการออกพันธบัตรสีเขียวที่เป็นไปตามหลักชารีอะห์ได้",
        zh: "区域 sukuk 参考。马来西亚的可持续与负责任投资 sukuk 框架是任何南部泰国城市可用于伊斯兰绿色发行的模板。",
      },
    },
  },
  {
    cityId: "krabi",
    subjectKind: "city",
    rank: 8,
    provinceEn: "Krabi",
    provinceTh: "กระบี่",
    region: "south",
    ascnMember: false,
    eecZone: false,
    primaryTool: "gsss-bond",
    secondaryTool: "blended-finance",
    oneLiner: {
      en: "Andaman tourism hub. World Bank CCDR 2025 cites the Nai Nang apiculture group — mangrove restoration paired with beekeeping, sold in hotel restaurants. Nature-based coastal protection with a revenue model attached.",
      th: "ศูนย์กลางท่องเที่ยวอันดามัน ธนาคารโลก CCDR 2568 อ้างกลุ่มเลี้ยงผึ้งนายนาง — ฟื้นฟูป่าชายเลนคู่กับการเลี้ยงผึ้ง ขายในร้านอาหารโรงแรม การปกป้องชายฝั่งจากธรรมชาติพร้อมโมเดลรายได้",
      zh: "安达曼旅游中心。世银 CCDR 2025 引用 Nai Nang 养蜂合作社 — 红树林修复与养蜂结合，在酒店餐厅销售。带收入模型的基于自然的海岸保护。",
    },
    bestFor: {
      en: "GSSS bonds for coastal climate infrastructure, blended finance for mangrove-and-livelihood projects (Nai Nang template), carbon-credit co-funding through nature-based solutions.",
      th: "GSSS Bond สำหรับโครงสร้างพื้นฐานชายฝั่งทนภูมิอากาศ การเงินผสมสำหรับโครงการป่าชายเลนและอาชีพ (แม่แบบนายนาง) การร่วมทุนคาร์บอนเครดิตผ่านโซลูชันจากธรรมชาติ",
      zh: "用于海岸气候基础设施的 GSSS 债券、用于红树林与生计项目的混合融资（Nai Nang 模板）、基于自然的解决方案的碳信用联合融资。",
    },
    keyRisk: {
      en: "Heat stress shortening tourism seasons (World Bank CCDR 2025). Erosion and storm surge are co-financed by resorts but the protection is still front-loaded toward hardware.",
      th: "ความเครียดร้อนทำให้ฤดูท่องเที่ยวสั้นลง (ธนาคารโลก CCDR 2568) การกัดเซาะและซัดชายฝั่งรีสอร์ตร่วมทุน แต่การปกป้องยังเน้นฮาร์ดแวร์",
      zh: "高温压力缩短旅游季（世银 CCDR 2025）。侵蚀和风暴潮由度假村共同融资，但保护仍以硬件为主。",
    },
    comparableCase: {
      country: "Cambodia",
      flagEmoji: "🇰🇭",
      caseName: "Tapping on Blended Finance Mechanism for the Development of Solar Power Plant",
      caseUrl: "https://smartcitytoolkit.asean.org/case-study/tapping-on-blended-finance-mechanism-for-the-development-of-solar-power-plant-in-cambodia/",
      amount: "US$41M total, US$4M concessional (Canada-IFC)",
      oneLine: {
        en: "Blended finance template: small concessional slice ($4M) de-risks the larger commercial stack ($37M). The same shape works for a mangrove + livelihood hybrid in Krabi.",
        th: "แม่แบบการเงินผสม: ส่วนผ่อนปรนเล็ก ($4M) ลดความเสี่ยงของสแต็กเชิงพาณิชย์ที่ใหญ่กว่า ($37M) รูปร่างเดียวกันใช้ได้กับไฮบริดป่าชายเลน + อาชีพในกระบี่",
        zh: "混合融资模板：少量优惠资金（400万美元）降低更大商业堆栈（3700万美元）的风险。同一形态适用于甲米的红树林 + 生计混合项目。",
      },
    },
  },
];

// Helper — lookup a profile by city id. Returns undefined for cities not in
// the curated 8; callers should fall back to getFinancingAdvice(city) in that
// case (cityAnalytics has broader coverage for all 118 cities).
export function getCityInvestmentProfile(cityId: string): CityInvestmentProfile | undefined {
  return CITY_INVESTMENT_PROFILES.find(c => c.cityId === cityId);
}

// Helper — derive a one-line financing label for the comparison table by
// calling cityAnalytics.getFinancingAdvice and combining with the curated
// profile. Used so the table is consistent with the per-city data already
// computed in cityAnalytics, not a parallel hand-written system.
export function getShortFinancingLabel(cityId: string, locale: Locale): string {
  const city = getCityById(cityId);
  if (city) {
    const advice = getFinancingAdvice(city);
    return translate(locale, {
      en: advice.primaryInstrument,
      th: advice.primaryInstrumentTh,
      zh: advice.primaryInstrumentZh,
    });
  }
  return "";
}
