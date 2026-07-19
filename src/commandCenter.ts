// ---------------------------------------------------------------------------
// Command Center Intelligence Module
// ---------------------------------------------------------------------------
// Strategic SWOT, international case studies, financial model blueprints,
// and improvement roadmaps for Thailand's Smart City Control Tower
// ---------------------------------------------------------------------------

import type { SmartCity, ScoringPillar, SmartDimension } from "./types";

// ---------------------------------------------------------------------------
// 1. INTERNATIONAL CASE STUDIES — famous projects with similar contexts
// ---------------------------------------------------------------------------

export interface CaseStudy {
  id: string;
  city: string;
  country: string;
  project: string;
  year: string;
  investment: string;
  relevantPillars: ScoringPillar[];
  relevantDimensions: SmartDimension[];
  context: { en: string; th: string; zh: string };
  outcome: { en: string; th: string; zh: string };
  lesson: { en: string; th: string; zh: string };
  financialModel: string;
  source?: string;  // citation for the outcome stats, where a credible one exists
  applicableTiers: ("alpha" | "beta" | "gamma")[];
  similarContext: string[];  // tags for matching to Thai cities
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "songdo-ibd",
    city: "Songdo",
    country: "South Korea",
    project: "Songdo International Business District",
    year: "2003-2022",
    investment: "$40B",
    relevantPillars: ["livability", "digital", "economy"],
    relevantDimensions: ["economy", "living", "governance"],
    context: {
      en: "Built from scratch on 1,500 acres of reclaimed land near Incheon Airport. Korea's bet on a greenfield smart city with ubiquitous connectivity, pneumatic waste collection, and centralized city management.",
      th: "สร้างจากศูนย์บนพื้นที่ถมทะเล 1,500 เอเคอร์ใกล้สนามบินอินชอน เกาหลีเดิมพันกับเมืองอัจฉริยะสร้างใหม่ทั้งหมดพร้อมระบบเชื่อมต่อทุกที่ ระบบขยะนิวแมติก และศูนย์จัดการเมืองรวม",
      zh: "在仁川机场附近1500英亩填海造地上从零建造。韩国押注绿地智慧城市：无处不在的连接、气动垃圾收集与集中城市管理。",
    },
    outcome: {
      en: "Two decades in, occupancy and street life still trail the master plan. Infrastructure works but the city lacks organic urban life. Lesson: technology doesn't create community — people do.",
      th: "ผ่านไปสองทศวรรษ อัตราการเข้าอยู่และชีวิตชีวาบนท้องถนนยังตามไม่ทันแผนแม่บท โครงสร้างพื้นฐานเวิร์กแต่เมืองขาดชีวิตเมืองแบบเกิดขึ้นเอง บทเรียน: เทคโนโลยีไม่ได้สร้างชุมชน — คนต่างหากที่สร้าง",
      zh: "二十年过去，入住率与街头活力仍落后于总体规划。基础设施有效但城市缺乏有机城市生活。教训：技术不能创造社区——人才能。",
    },
    lesson: {
      en: "Greenfield cities need demand anchors (universities, corporate HQs, transit hubs) not just tech. Apply to EEC zone cities planning new districts.",
      th: "เมืองสร้างใหม่ต้องมีจุดยึดดีมานด์ (มหาวิทยาลัย สำนักงานใหญ่ ศูนย์ขนส่ง) ไม่ใช่แค่เทคโนโลยี ประยุกต์ใช้กับเมือง EEC ที่วางแผนย่านใหม่",
      zh: "新城需要需求锚（大学、企业总部、交通枢纽），不能只靠技术。适用于EEC区域规划新城区的城市。",
    },
    financialModel: "Master developer PPP with government land + private capital",
    applicableTiers: ["alpha"],
    similarContext: ["eec", "new-district", "industrial", "greenfield"],
  },
  {
    id: "medellin-metrocable",
    city: "Medellín",
    country: "Colombia",
    project: "MetroCable + Social Urbanism",
    year: "2004-2015",
    investment: "$400M",
    relevantPillars: ["livability", "safety", "economy"],
    relevantDimensions: ["mobility", "living", "people"],
    context: {
      en: "Violence-plagued informal hillside communities connected to the city center via cable cars. Combined transport with public libraries, parks, and economic development zones at each station.",
      th: "ชุมชนบนเขาที่เต็มไปด้วยความรุนแรงถูกเชื่อมต่อกับใจกลางเมืองด้วยกระเช้าลอยฟ้า ผสานขนส่งเข้ากับห้องสมุด สวนสาธารณะ และเขตพัฒนาเศรษฐกิจที่แต่ละสถานี",
      zh: "用缆车将暴力猖獗的非正式山坡社区连接到市中心。每个站点结合公共图书馆、公园与经济开发区。",
    },
    outcome: {
      en: "Homicide rate dropped 80% from its 1991 peak. Property values near stations climbed sharply. Won the Lee Kuan Yew World City Prize 2016. Model for how transport transforms marginalized areas.",
      th: "อัตราฆาตกรรมลด 80% จากจุดพีคปี 1991 มูลค่าที่ดินใกล้สถานีพุ่งขึ้นอย่างมีนัยสำคัญ ได้รับรางวัล Lee Kuan Yew World City Prize 2016 ต้นแบบว่าขนส่งเปลี่ยนพื้นที่ชายขอบได้อย่างไร",
      zh: "凶杀率较1991年峰值下降80%。站点附近房产价值大幅上涨。获2016年李光耀世界城市奖。交通如何改造边缘地区的典范。",
    },
    lesson: {
      en: "Transit works when co-designed with social infrastructure. Land value capture around stations can fund operations. Direct model for Khon Kaen LRT and hillside cities in Northern Thailand.",
      th: "ขนส่งเวิร์กเมื่อออกแบบร่วมกับโครงสร้างพื้นฐานทางสังคม การจับมูลค่าที่ดินรอบสถานีช่วยจ่ายค่าเดินระบบ ต้นแบบตรงสำหรับ LRT ขอนแก่นและเมืองบนเขาในภาคเหนือ",
      zh: "交通与社会基础设施共同设计时才有效。站点周边土地价值回收可支持运营。直接适用于孔敬LRT和泰国北部山地城市。",
    },
    financialModel: "Municipal bonds + land value capture + national grants",
    source: "Lee Kuan Yew World City Prize 2016; Americas Quarterly (homicide vs 1991 peak)",
    applicableTiers: ["alpha", "beta"],
    similarContext: ["transit", "inequality", "tourism", "cultural-city"],
  },
  {
    id: "barcelona-superblocks",
    city: "Barcelona",
    country: "Spain",
    project: "Superblocks (Superilles) + City Data Platform",
    year: "2016-2025",
    investment: "$50M (superblocks) + $30M (data platform)",
    relevantPillars: ["environment", "livability", "digital"],
    relevantDimensions: ["environment", "living", "governance"],
    context: {
      en: "Nine-block grids where interior streets are car-free, returned to pedestrians, play, and green space. Combined with Sentilo/CityOS open-source city data platform processing 2M+ sensor readings daily.",
      th: "กริด 9 ช่วงตึกที่ถนนภายในปลอดรถยนต์ คืนให้คนเดินเท้า ที่เล่น และพื้นที่สีเขียว ควบคู่กับแพลตฟอร์มข้อมูลเมือง Sentilo/CityOS โอเพนซอร์สประมวลผลเซ็นเซอร์ 2 ล้านครั้ง/วัน",
      zh: "九个街区组成的网格，内部街道禁车，归还给行人、游乐与绿化。配合开源城市数据平台Sentilo/CityOS每日处理200万+传感器数据。",
    },
    outcome: {
      en: "NO₂ dropped 25% in superblock areas. Foot traffic up 10%. Commercial activity up 30%. City data platform now manages parking, waste, environment, and traffic in real time.",
      th: "NO₂ ลด 25% ในพื้นที่ Superblock คนเดินเท้าเพิ่ม 10% กิจกรรมเชิงพาณิชย์เพิ่ม 30% แพลตฟอร์มข้อมูลเมืองจัดการที่จอดรถ ขยะ สิ่งแวดล้อม และจราจรแบบเรียลไทม์",
      zh: "超级街区NO₂降低25%，人流增加10%，商业活动增长30%。城市数据平台实时管理停车、垃圾、环境与交通。",
    },
    lesson: {
      en: "Start with one pilot superblock, measure outcomes, then scale. The data platform is the operational spine, not a PR dashboard. Direct model for walkable old-town Thai cities like Chiang Mai and Nakhon Si Thammarat.",
      th: "เริ่มจาก Superblock นำร่องหนึ่งแห่ง วัดผล แล้วขยาย แพลตฟอร์มข้อมูลคือแกนปฏิบัติการ ไม่ใช่แดชบอร์ดประชาสัมพันธ์ ต้นแบบตรงสำหรับเมืองเก่าที่เดินได้อย่างเชียงใหม่และนครศรีธรรมราช",
      zh: "从一个试点超级街区开始，测量结果，然后扩展。数据平台是运营主干，不是公关看板。直接适用于清迈和洛坤等可步行的泰国古城。",
    },
    financialModel: "Municipal budget + EU structural funds + performance contracts with tech vendors",
    source: "Barcelona City Council superblock monitoring, Sant Antoni (via EEA Climate-ADAPT)",
    applicableTiers: ["alpha", "beta"],
    similarContext: ["heritage", "tourism", "walkable", "old-town", "air-quality"],
  },
  {
    id: "kigali-masterplan",
    city: "Kigali",
    country: "Rwanda",
    project: "Kigali Smart City Master Plan + Innovation City",
    year: "2019-2030",
    investment: "$2B (master plan target)",
    relevantPillars: ["digital", "economy", "safety"],
    relevantDimensions: ["governance", "economy", "people"],
    context: {
      en: "Africa's cleanest city leveraged strong governance to attract smart city investment despite low GDP. National digital ID, cashless payments, and drone delivery (Zipline) deployed ahead of wealthier nations. Innovation City being built as tech hub.",
      th: "เมืองที่สะอาดที่สุดในแอฟริกาใช้ธรรมาภิบาลที่แข็งแกร่งดึงดูดการลงทุนเมืองอัจฉริยะแม้ GDP ต่ำ Digital ID ระดับชาติ การจ่ายเงินไร้เงินสด และจัดส่งด้วยโดรน (Zipline) ถูกใช้งานก่อนประเทศที่ร่ำรวยกว่า",
      zh: "非洲最清洁的城市利用强大治理吸引智慧城市投资，尽管GDP较低。国家数字ID、无现金支付和无人机配送（Zipline）先于富裕国家部署。",
    },
    outcome: {
      en: "100% digital ID coverage. Zipline drone deliveries serve 75% of blood supply needs. E-government portal handles 100+ services. Crime reduced through CCTV and community policing integration.",
      th: "ครอบคลุม Digital ID 100% โดรน Zipline จัดส่งเลือด 75% ของความต้องการ ระบบ e-government รองรับบริการ 100+ อาชญากรรมลดผ่าน CCTV และการบูรณาการตำรวจชุมชน",
      zh: "数字ID覆盖100%。Zipline无人机配送满足75%血液供应需求。电子政务处理100+项服务。通过CCTV和社区警务整合降低犯罪。",
    },
    lesson: {
      en: "Governance quality matters more than GDP for smart city success. Small cities can leapfrog with focused digital services. Model for Thai gamma-tier cities that have political will but limited budgets.",
      th: "คุณภาพธรรมาภิบาลสำคัญกว่า GDP สำหรับความสำเร็จเมืองอัจฉริยะ เมืองเล็กสามารถกระโดดข้ามขั้นด้วยบริการดิจิทัลที่โฟกัส ต้นแบบสำหรับเมืองระดับ gamma ของไทยที่มีเจตจำนงทางการเมืองแต่งบจำกัด",
      zh: "治理质量比GDP对智慧城市成功更重要。小城市可以通过聚焦数字服务实现跨越。适用于有政治意愿但预算有限的泰国gamma级城市。",
    },
    financialModel: "Government budget + DFI grants (World Bank, AfDB) + private tech partnerships",
    applicableTiers: ["beta", "gamma"],
    similarContext: ["governance", "small-city", "digital-leap", "low-budget"],
  },
  {
    id: "amsterdam-circular",
    city: "Amsterdam",
    country: "Netherlands",
    project: "Amsterdam Smart City + Circular Economy Strategy",
    year: "2009-2025",
    investment: "€600M across programs",
    relevantPillars: ["environment", "economy", "digital"],
    relevantDimensions: ["energy", "environment", "economy"],
    context: {
      en: "Europe's living lab for smart city innovation. 200+ projects across energy, mobility, circular economy, and citizen-driven data. AMS Institute brings university research directly into city operations. Circular economy target: fully circular by 2050.",
      th: "ห้องทดลองมีชีวิตของยุโรปสำหรับนวัตกรรมเมืองอัจฉริยะ 200+ โครงการครอบคลุมพลังงาน การเดินทาง เศรษฐกิจหมุนเวียน และข้อมูลที่ขับเคลื่อนโดยประชาชน AMS Institute นำงานวิจัยมหาวิทยาลัยเข้าสู่การปฏิบัติการเมืองโดยตรง",
      zh: "欧洲智慧城市创新的活体实验室。200+项目覆盖能源、出行、循环经济与市民数据。AMS研究院将大学研究直接导入城市运营。",
    },
    outcome: {
      en: "The city targets a 55% CO₂ cut by 2030 versus 1990 under its Climate Neutral 2050 roadmap. 10,000+ EV charging points. Smart grid pilots cut peak demand 10%. Living lab approach validated: fail fast, scale what works.",
      th: "เมืองตั้งเป้าลด CO₂ 55% ภายในปี 2030 เทียบปี 1990 ภายใต้แผน Climate Neutral 2050 จุดชาร์จ EV 10,000+ Smart grid นำร่องลดดีมานด์พีค 10% แนวทาง Living lab พิสูจน์แล้ว: ล้มเร็ว ขยายสิ่งที่เวิร์ก",
      zh: "该市根据其《2050气候中和路线图》，目标是到2030年较1990年减排55%二氧化碳。10000+EV充电桩。智能电网试点削减峰值需求10%。活体实验室方法验证：快速失败，扩展有效方案。",
    },
    lesson: {
      en: "University-city partnerships create sustainable innovation pipelines. CMU Smart City and university-anchored Thai cities can replicate this model. Start with energy and environment — they have the clearest ROI.",
      th: "ความร่วมมือมหาวิทยาลัย-เมืองสร้างท่อนวัตกรรมที่ยั่งยืน CMU Smart City และเมืองไทยที่มีมหาวิทยาลัยเป็นจุดยึดสามารถทำตามได้ เริ่มจากพลังงานและสิ่งแวดล้อม — ROI ชัดที่สุด",
      zh: "大学-城市合作创造可持续创新管线。CMU智慧城市和以大学为锚的泰国城市可复制此模式。从能源和环境开始——ROI最清晰。",
    },
    financialModel: "EU Horizon grants + city budget + corporate R&D partnerships + green bonds",
    source: "Roadmap Amsterdam Climate Neutral 2050 (City of Amsterdam)",
    applicableTiers: ["alpha", "beta"],
    similarContext: ["university", "energy", "circular", "living-lab", "environment"],
  },
  {
    id: "estonia-digital",
    city: "Tallinn / Estonia",
    country: "Estonia",
    project: "e-Estonia Digital Government Stack",
    year: "2000-2025",
    investment: "€200M+ (national program)",
    relevantPillars: ["digital", "economy", "safety"],
    relevantDimensions: ["governance", "people", "economy"],
    context: {
      en: "Small nation (1.3M people) built the world's most advanced digital government. X-Road backbone connects all public and many private databases. 99% of government services available online. Digital ID for every citizen. E-residency program attracts global entrepreneurs.",
      th: "ประเทศเล็ก (1.3 ล้านคน) สร้างรัฐบาลดิจิทัลที่ล้ำสุดในโลก X-Road เชื่อมฐานข้อมูลภาครัฐและเอกชนทั้งหมด บริการรัฐ 99% ออนไลน์ Digital ID สำหรับพลเมืองทุกคน e-Residency ดึงดูดผู้ประกอบการทั่วโลก",
      zh: "130万人小国建立了世界最先进的数字政府。X-Road骨干连接所有公共和许多私有数据库。99%政府服务在线。每个公民数字ID。电子居住权吸引全球企业家。",
    },
    outcome: {
      en: "Saves 800+ years of working time annually through digital services. GDP per capita doubled in 15 years. Corruption perception improved dramatically. Blueprint for Thailand's digital government ambitions.",
      th: "ประหยัดเวลาทำงานกว่า 800 ปี/ปีผ่านบริการดิจิทัล GDP ต่อหัวเพิ่มเป็นเท่าตัวใน 15 ปี ภาพลักษณ์คอร์รัปชันดีขึ้นมาก ต้นแบบสำหรับความทะเยอทะยานด้านรัฐบาลดิจิทัลของไทย",
      zh: "每年通过数字服务节省800多年工作时间。15年内人均GDP翻倍。腐败感知大幅改善。泰国数字政府雄心的蓝图。",
    },
    lesson: {
      en: "Start with identity and interoperability, not flashy apps. Thailand's Smart City program needs a shared data backbone (like X-Road) to avoid 105 cities each building their own silos.",
      th: "เริ่มจากระบบตัวตนและการเชื่อมต่อข้อมูล ไม่ใช่แอปโก้ โครงการเมืองอัจฉริยะของไทยต้องมีแกนข้อมูลร่วม (เช่น X-Road) เพื่อหลีกเลี่ยง 105 เมืองที่ต่างคนต่างสร้าง silo ของตัวเอง",
      zh: "从身份和互操作性开始，而非炫酷应用。泰国智慧城市计划需要共享数据骨干（如X-Road），避免105个城市各建各的数据孤岛。",
    },
    financialModel: "National budget + EU structural funds + private sector co-investment",
    source: "PwC — Estonia: the Digital Republic Secured by Blockchain; e-Estonia",
    applicableTiers: ["alpha", "beta", "gamma"],
    similarContext: ["digital-government", "governance", "national-program", "interoperability"],
  },
  {
    id: "curitiba-brt",
    city: "Curitiba",
    country: "Brazil",
    project: "Bus Rapid Transit (BRT) System",
    year: "1974-present",
    investment: "$300M (fraction of metro cost)",
    relevantPillars: ["livability", "environment", "economy"],
    relevantDimensions: ["mobility", "environment", "living"],
    context: {
      en: "Developing-world city that couldn't afford a metro built the world's first BRT system instead. Tube stations, dedicated lanes, pre-paid boarding. Moved 2.3M daily passengers at 1/100th the cost of a subway. Now copied by 200+ cities worldwide.",
      th: "เมืองกำลังพัฒนาที่ไม่มีงบสร้างรถไฟใต้ดินจึงสร้างระบบ BRT แห่งแรกของโลกแทน สถานีแบบท่อ เลนเฉพาะ จ่ายค่าโดยสารก่อนขึ้น ขนส่งผู้โดยสาร 2.3 ล้านคน/วัน ด้วยต้นทุน 1/100 ของรถไฟใต้ดิน ปัจจุบัน 200+ เมืองทั่วโลกลอก",
      zh: "发展中城市买不起地铁，转而建造世界第一个BRT系统。管式车站、专用车道、预付费上车。每天运载230万乘客，成本仅地铁的1/100。现被全球200+城市复制。",
    },
    outcome: {
      en: "Highest public transport usage in Brazil (45% mode share). 25% less fuel consumption per capita than similar cities. Sparked global BRT movement. Proved smart mobility doesn't require smart tech — it requires smart design.",
      th: "ใช้ขนส่งสาธารณะสูงสุดในบราซิล (45% mode share) ใช้เชื้อเพลิงน้อยกว่าเมืองใกล้เคียง 25% จุดประกายขบวนการ BRT ทั่วโลก พิสูจน์ว่า smart mobility ไม่ต้องใช้ smart tech — ต้องใช้ smart design",
      zh: "巴西公共交通使用率最高（45%出行份额）。人均燃油消耗比类似城市低25%。引发全球BRT运动。证明智慧出行不需要智慧技术——需要智慧设计。",
    },
    lesson: {
      en: "Affordable, well-designed transit beats expensive high-tech solutions. Perfect model for mid-size Thai cities (Nakhon Ratchasima, Udon Thani, Hat Yai) that need mobility but can't justify LRT costs.",
      th: "ขนส่งที่ราคาถูกและออกแบบดีชนะโซลูชันไฮเทคราคาแพง ต้นแบบสมบูรณ์สำหรับเมืองไทยขนาดกลาง (นครราชสีมา อุดรธานี หาดใหญ่) ที่ต้องการขนส่งแต่ให้เหตุผลกับต้นทุน LRT ไม่ได้",
      zh: "价格实惠、设计良好的公交胜过昂贵的高科技方案。完美适用于需要交通但无法论证LRT成本的泰国中型城市。",
    },
    financialModel: "Municipal bonds + farebox revenue + land value capture along corridors",
    applicableTiers: ["alpha", "beta", "gamma"],
    similarContext: ["transit", "developing", "cost-effective", "mid-size-city"],
  },
  {
    id: "shenzhen-ev",
    city: "Shenzhen",
    country: "China",
    project: "100% Electric Bus Fleet + EV Infrastructure",
    year: "2011-2019",
    investment: "$1.6B (buses) + $600M (charging)",
    relevantPillars: ["environment", "livability", "digital"],
    relevantDimensions: ["energy", "mobility", "environment"],
    context: {
      en: "Manufacturing hub of 17M people electrified its entire bus fleet — 16,359 buses, the first city worldwide to achieve 100% electric public transit. Also electrified 22,000 taxis. Supported by massive charging infrastructure build-out.",
      th: "ศูนย์กลางอุตสาหกรรม 17 ล้านคนเปลี่ยนรถบัสทั้งหมดเป็นไฟฟ้า 16,359 คัน เป็นเมืองแรกในโลกที่ขนส่งสาธารณะเป็นไฟฟ้า 100% รวมถึงแท็กซี่ 22,000 คัน พร้อมโครงสร้างชาร์จขนาดใหญ่",
      zh: "1700万人的制造业中心将全部公交车——16359辆——电动化，成为全球首个实现100%电动公共交通的城市。还电动化了22000辆出租车。",
    },
    outcome: {
      en: "48% reduction in bus emissions. Noise pollution from buses eliminated. Operating costs 35% lower than diesel. Air quality in CBD measurably improved. Model replicated in major Chinese cities.",
      th: "ลดการปล่อยมลพิษจากรถบัส 48% เสียงจากรถบัสหมดไป ต้นทุนเดินระบบต่ำกว่าดีเซล 35% คุณภาพอากาศในย่านธุรกิจดีขึ้นอย่างวัดได้ ต้นแบบถูกทำซ้ำในเมืองใหญ่ของจีน",
      zh: "公交排放减少48%。公交噪音消除。运营成本比柴油低35%。CBD空气质量可测量改善。模式在中国主要城市复制。",
    },
    lesson: {
      en: "Electric fleet transition pays for itself through lower operating costs. Government subsidy + operator concession model works. Directly relevant for Phuket smart bus, Bangkok BMA, and cities with air quality problems.",
      th: "การเปลี่ยนเป็นรถไฟฟ้าคุ้มทุนเองผ่านต้นทุนเดินระบบที่ต่ำกว่า โมเดลเงินอุดหนุนรัฐ + สัมปทานผู้ให้บริการเวิร์ก เกี่ยวข้องตรงกับ Phuket smart bus, กทม BMA และเมืองที่มีปัญหาคุณภาพอากาศ",
      zh: "电动化通过更低运营成本自行回本。政府补贴+运营商特许模式有效。直接适用于普吉智能巴士、曼谷BMA和有空气质量问题的城市。",
    },
    financialModel: "Government subsidy (60%) + operator equity (40%) + on-bill financing through fuel savings",
    applicableTiers: ["alpha", "beta"],
    similarContext: ["ev", "transit", "air-quality", "industrial", "energy"],
  },
  {
    id: "vienna-housing",
    city: "Vienna",
    country: "Austria",
    project: "Social Housing + Smart Energy Districts",
    year: "1920-present (digital layer 2015+)",
    investment: "€600M/year (housing) + €100M (smart districts)",
    relevantPillars: ["livability", "wellbeing", "environment"],
    relevantDimensions: ["living", "energy", "people"],
    context: {
      en: "62% of Vienna's residents live in subsidized housing. The city owns or controls 220,000 apartments. Aspern Seestadt (2015+) is the newest smart district: 10,500 apartments with shared EV fleet, smart energy grid, and community-designed public spaces.",
      th: "ผู้อยู่อาศัยเวียนนา 62% อยู่ในที่พักอาศัยที่ได้รับเงินอุดหนุน เมืองเป็นเจ้าของหรือควบคุมอพาร์ตเมนต์ 220,000 ยูนิต Aspern Seestadt (2015+) เป็นย่านอัจฉริยะใหม่ล่าสุด: 10,500 ยูนิตพร้อม EV ร่วม โครงข่ายพลังงานอัจฉริยะ และพื้นที่สาธารณะที่ชุมชนร่วมออกแบบ",
      zh: "62%维也纳居民住在补贴住房中。城市拥有或控制22万套公寓。Aspern Seestadt(2015+)是最新智慧社区：10500套公寓配共享EV、智能能源电网和社区设计公共空间。",
    },
    outcome: {
      en: "Ranked #1 most liveable city worldwide (Economist, Mercer) for 10+ consecutive years. Housing costs 27% of income vs 40%+ in comparable cities. Aspern residents have 35% lower carbon footprint.",
      th: "อันดับ 1 เมืองน่าอยู่ที่สุดในโลก (Economist, Mercer) ติดต่อกัน 10+ ปี ค่าที่อยู่อาศัย 27% ของรายได้ vs 40%+ ในเมืองเทียบเท่า ผู้อยู่ Aspern มีคาร์บอนฟุตพริ้นท์ต่ำกว่า 35%",
      zh: "连续10+年排名全球最宜居城市第1（经济学人、美世）。住房成本占收入27%，对比可比城市40%+。Aspern居民碳足迹低35%。",
    },
    lesson: {
      en: "Livability is the ultimate smart city metric. Vienna proves that housing policy IS smart city policy. Relevant for Thai cities where housing affordability drives livability scores down. Austria MOU with Thailand makes this a direct partnership opportunity.",
      th: "ความน่าอยู่คือตัวชี้วัดเมืองอัจฉริยะขั้นสุดท้าย เวียนนาพิสูจน์ว่านโยบายที่อยู่อาศัยคือนโยบายเมืองอัจฉริยะ เกี่ยวข้องกับเมืองไทยที่ค่าที่อยู่อาศัยฉุดคะแนนความน่าอยู่ MOU ออสเตรีย-ไทยทำให้เป็นโอกาสพันธมิตรตรง",
      zh: "宜居是智慧城市的终极指标。维也纳证明住房政策就是智慧城市政策。适用于住房可负担性拖累宜居分数的泰国城市。奥地利-泰国MOU使其成为直接合作机会。",
    },
    financialModel: "Municipal land trust + housing levy + rent revenue + EU green investment fund",
    applicableTiers: ["alpha", "beta"],
    similarContext: ["housing", "livability", "energy", "wellbeing", "european-partner"],
  },
  {
    id: "bogota-ciclovia",
    city: "Bogotá",
    country: "Colombia",
    project: "Ciclovía + TransMilenio BRT",
    year: "1974 (Ciclovía), 2000 (TransMilenio)",
    investment: "$240M (TransMilenio Phase 1)",
    relevantPillars: ["livability", "hospitality", "environment"],
    relevantDimensions: ["mobility", "people", "living"],
    context: {
      en: "Every Sunday, 120km of roads close to cars for 2M+ cyclists, runners, and families. Combined with TransMilenio BRT serving 2.2M daily passengers. A developing-world city that prioritized people over cars with almost no tech budget.",
      th: "ทุกวันอาทิตย์ ถนน 120 กม. ปิดรถยนต์สำหรับนักปั่น นักวิ่ง และครอบครัว 2 ล้านคน+ ผสานกับ TransMilenio BRT ที่รองรับผู้โดยสาร 2.2 ล้านคน/วัน เมืองกำลังพัฒนาที่ให้ความสำคัญกับคนมากกว่ารถโดยแทบไม่มีงบเทคโนโลยี",
      zh: "每周日120公里道路对汽车关闭，供200万+骑行者、跑步者和家庭使用。结合每日服务220万乘客的TransMilenio BRT。发展中城市几乎没有技术预算却把人置于车之上。",
    },
    outcome: {
      en: "Ciclovía generates $3.20 in health benefits per $1 spent. Air quality measurably improves on Sundays. Social cohesion across economic classes visible and measurable. The cheapest, highest-impact smart city intervention ever invented.",
      th: "Ciclovía สร้างผลตอบแทนด้านสุขภาพ $3.20 ต่อ $1 ที่ใช้ คุณภาพอากาศดีขึ้นอย่างวัดได้ในวันอาทิตย์ ความเหนียวแน่นทางสังคมข้ามชนชั้นมองเห็นและวัดได้ นวัตกรรมเมืองอัจฉริยะที่ถูกที่สุดและมีผลกระทบสูงสุดที่เคยถูกคิดค้น",
      zh: "Ciclovía每花1美元产生3.20美元健康效益。周日空气质量可测量改善。跨经济阶层的社会凝聚可见可测。有史以来成本最低、影响最大的智慧城市干预。",
    },
    lesson: {
      en: "Smart city doesn't mean high-tech. Low-cost, high-impact social infrastructure is the real innovation. Every Thai city can do a Ciclovía this weekend — the only cost is political courage.",
      th: "เมืองอัจฉริยะไม่ได้แปลว่าไฮเทค โครงสร้างพื้นฐานทางสังคมต้นทุนต่ำผลกระทบสูงคือนวัตกรรมที่แท้จริง ทุกเมืองไทยทำ Ciclovía ได้สุดสัปดาห์นี้ — ต้นทุนเดียวคือความกล้าหาญทางการเมือง",
      zh: "智慧城市不等于高科技。低成本、高影响的社会基础设施才是真正的创新。每个泰国城市本周末就能做Ciclovía——唯一的成本是政治勇气。",
    },
    financialModel: "Minimal cost ($0.5M/year) — funded by municipal budget, massive ROI in health savings",
    applicableTiers: ["alpha", "beta", "gamma"],
    similarContext: ["low-cost", "community", "hospitality", "health", "developing"],
  },
];

// ---------------------------------------------------------------------------
// 2. CASE STUDY MATCHING — find relevant case studies for each city
// ---------------------------------------------------------------------------

function getCityContextTags(city: SmartCity): string[] {
  const tags: string[] = [];

  // Region-based
  if (city.region === "east") tags.push("eec", "industrial");
  if (city.region === "north") tags.push("heritage", "air-quality", "tourism");
  if (city.region === "south") tags.push("tourism");
  if (city.region === "northeast") tags.push("developing", "mid-size-city");

  // Dimension-based
  if (city.smartDimensions.includes("mobility")) tags.push("transit");
  if (city.smartDimensions.includes("energy")) tags.push("energy");
  if (city.smartDimensions.includes("environment")) tags.push("environment", "circular");
  if (city.smartDimensions.includes("governance")) tags.push("governance", "digital-government");
  if (city.smartDimensions.includes("people")) tags.push("community");

  // Score-based
  if (city.scores.digital < 50) tags.push("digital-leap");
  if (city.scores.livability < 50) tags.push("housing", "livability");
  if (city.scores.environment < 50) tags.push("air-quality");
  if (city.scores.hospitality > 70) tags.push("hospitality", "community");

  // Reality-based
  if (city.reality === "planned") tags.push("low-budget", "small-city");
  if (city.reality === "partial") tags.push("developing");

  // Specific features
  if (city.id.includes("university") || city.id.includes("cmu")) tags.push("university", "living-lab");
  if (city.metrics.pm25Annual && city.metrics.pm25Annual > 35) tags.push("air-quality");
  if (city.id.includes("phuket")) tags.push("ev", "tourism");
  if (city.id.includes("khon-kaen")) tags.push("transit");

  // Cost-effective is relevant for most Thai cities
  tags.push("cost-effective");
  tags.push("developing");

  return [...new Set(tags)];
}

export function getRelevantCaseStudies(city: SmartCity, maxResults = 5): CaseStudy[] {
  const cityTags = getCityContextTags(city);

  const scored = CASE_STUDIES.map(cs => {
    let score = 0;

    // Tier match
    if (cs.applicableTiers.includes(city.tier)) score += 3;

    // Context tag overlap
    for (const tag of cs.similarContext) {
      if (cityTags.includes(tag)) score += 2;
    }

    // Pillar weakness match (case studies that address the city's weak areas)
    for (const pillar of cs.relevantPillars) {
      if (city.scores[pillar] < 50) score += 2;
      else if (city.scores[pillar] < 65) score += 1;
    }

    // Dimension match
    for (const dim of cs.relevantDimensions) {
      if (city.smartDimensions.includes(dim)) score += 1;
    }

    return { caseStudy: cs, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map(s => s.caseStudy);
}

// ---------------------------------------------------------------------------
// 3. STRATEGIC IMPROVEMENT RECOMMENDATIONS — what to invest in and why
// ---------------------------------------------------------------------------

export interface ImprovementRecommendation {
  pillar: ScoringPillar;
  currentScore: number;
  targetScore: number;
  priority: "critical" | "high" | "medium";
  title: { en: string; th: string; zh: string };
  rationale: { en: string; th: string; zh: string };
  actions: { en: string; th: string; zh: string }[];
  estimatedImpact: { en: string; th: string; zh: string };
  timeframe: string;
  investmentRange: string;
}

export function generateImprovementPlan(city: SmartCity): ImprovementRecommendation[] {
  const recs: ImprovementRecommendation[] = [];
  const scores = city.scores;

  // Sort pillars by score (weakest first) weighted by pillar importance
  const pillarPriorityUnsorted: Array<{ pillar: ScoringPillar; urgency: number }> = [
    { pillar: "livability" as const, urgency: (100 - scores.livability) * 0.25 },
    { pillar: "economy" as const, urgency: (100 - scores.economy) * 0.20 },
    { pillar: "safety" as const, urgency: (100 - scores.safety) * 0.15 },
    { pillar: "wellbeing" as const, urgency: (100 - scores.wellbeing) * 0.15 },
    { pillar: "environment" as const, urgency: (100 - scores.environment) * 0.10 },
    { pillar: "hospitality" as const, urgency: (100 - scores.hospitality) * 0.10 },
    { pillar: "digital" as const, urgency: (100 - scores.digital) * 0.05 },
  ];
  const pillarPriority = pillarPriorityUnsorted.sort((a, b) => b.urgency - a.urgency);

  for (const { pillar } of pillarPriority.slice(0, 4)) {
    const score = scores[pillar];
    if (score >= 80) continue; // Already excellent

    const priority: "critical" | "high" | "medium" =
      score < 35 ? "critical" : score < 50 ? "high" : "medium";
    const target = Math.min(score + 15, 85);

    recs.push(buildPillarRecommendation(pillar, score, target, priority, city));
  }

  return recs;
}

function buildPillarRecommendation(
  pillar: ScoringPillar,
  score: number,
  target: number,
  priority: "critical" | "high" | "medium",
  city: SmartCity,
): ImprovementRecommendation {
  const recommendations: Record<ScoringPillar, () => ImprovementRecommendation> = {
    livability: () => ({
      pillar: "livability",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Upgrade housing, transit, and public infrastructure",
        th: "ยกระดับที่อยู่อาศัย ขนส่ง และโครงสร้างพื้นฐานสาธารณะ",
        zh: "升级住房、交通与公共基础设施",
      },
      rationale: {
        en: `Livability at ${score}/100 means daily life infrastructure is ${score < 45 ? "severely lacking" : "below potential"}. This pillar carries the highest weight (25%) — improving it yields the biggest composite score gain.`,
        th: `ความน่าอยู่ ${score}/100 หมายความว่าโครงสร้างพื้นฐานชีวิตประจำวัน${score < 45 ? "ขาดอย่างรุนแรง" : "ต่ำกว่าศักยภาพ"} เสาหลักนี้มีน้ำหนักสูงสุด (25%) — การปรับปรุงจะทำให้คะแนนรวมเพิ่มมากที่สุด`,
        zh: `宜居${score}/100意味着日常基础设施${score < 45 ? "严重不足" : "低于潜力"}。此支柱权重最高(25%)——改善它将带来最大综合分提升。`,
      },
      actions: [
        { en: "Launch affordable housing pilot in the designated smart city area", th: "เปิดโครงการที่อยู่อาศัยราคาที่เข้าถึงได้ในพื้นที่เมืองอัจฉริยะ", zh: "在智慧城市指定区域启动经济适用房试点" },
        { en: "Improve public transit frequency and coverage (BRT/minibus/EV routes)", th: "ปรับปรุงความถี่และการเข้าถึงขนส่งสาธารณะ (BRT/มินิบัส/เส้นทาง EV)", zh: "提高公共交通频率和覆盖(BRT/小巴/EV路线)" },
        { en: "Fix utility reliability — water, power, internet uptime to 99%+", th: "ซ่อมความเชื่อถือได้ของสาธารณูปโภค — น้ำ ไฟ อินเทอร์เน็ต uptime ถึง 99%+", zh: "修复公用设施可靠性——水电网uptime达99%+" },
      ],
      estimatedImpact: {
        en: `+${target - score} points livability → +${((target - score) * 0.25).toFixed(1)} composite score`,
        th: `+${target - score} คะแนนความน่าอยู่ → +${((target - score) * 0.25).toFixed(1)} คะแนนรวม`,
        zh: `宜居+${target - score}分 → 综合+${((target - score) * 0.25).toFixed(1)}分`,
      },
      timeframe: "18-36 months",
      investmentRange: "THB 200M – 2B",
    }),
    economy: () => ({
      pillar: "economy",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Strengthen local economy and job creation engines",
        th: "เสริมเศรษฐกิจท้องถิ่นและกลไกสร้างงาน",
        zh: "强化本地经济与就业引擎",
      },
      rationale: {
        en: `Economy at ${score}/100 with ${city.metrics.avgMonthlyIncome ? `avg income ฿${city.metrics.avgMonthlyIncome.toLocaleString()}/mo` : "limited income data"} suggests ${score < 50 ? "structural economic challenges" : "room for targeted growth"}.`,
        th: `เศรษฐกิจ ${score}/100 ${city.metrics.avgMonthlyIncome ? `รายได้เฉลี่ย ฿${city.metrics.avgMonthlyIncome.toLocaleString()}/เดือน` : "ข้อมูลรายได้จำกัด"} บ่งชี้${score < 50 ? "ปัญหาเศรษฐกิจเชิงโครงสร้าง" : "ศักยภาพเติบโตเป้าหมาย"}`,
        zh: `经济${score}/100，${city.metrics.avgMonthlyIncome ? `月均收入฿${city.metrics.avgMonthlyIncome.toLocaleString()}` : "收入数据有限"}，表明${score < 50 ? "结构性经济挑战" : "定向增长空间"}。`,
      },
      actions: [
        { en: "Create smart city innovation zone with BOI incentives for tech companies", th: "สร้างเขตนวัตกรรมเมืองอัจฉริยะพร้อมสิทธิ BOI สำหรับบริษัทเทค", zh: "创建智慧城市创新区配BOI激励科技公司" },
        { en: "Launch digital skills training program targeting 1,000+ local workers/year", th: "เปิดโปรแกรมฝึกทักษะดิจิทัลเป้าหมาย 1,000+ คน/ปี", zh: "启动数字技能培训计划目标1000+本地工人/年" },
        { en: "Develop smart agriculture or tourism value chain based on regional strength", th: "พัฒนาห่วงโซ่มูลค่าเกษตรอัจฉริยะหรือท่องเที่ยวตามจุดแข็งภูมิภาค", zh: "基于区域优势发展智慧农业或旅游价值链" },
      ],
      estimatedImpact: {
        en: `+${target - score} points economy → +${((target - score) * 0.20).toFixed(1)} composite score`,
        th: `+${target - score} คะแนนเศรษฐกิจ → +${((target - score) * 0.20).toFixed(1)} คะแนนรวม`,
        zh: `经济+${target - score}分 → 综合+${((target - score) * 0.20).toFixed(1)}分`,
      },
      timeframe: "12-24 months",
      investmentRange: "THB 50M – 500M",
    }),
    safety: () => ({
      pillar: "safety",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Strengthen public safety and disaster resilience",
        th: "เสริมความปลอดภัยสาธารณะและความพร้อมรับมือภัยพิบัติ",
        zh: "加强公共安全与灾害韧性",
      },
      rationale: {
        en: `Safety at ${score}/100 ${city.metrics.crimeRatePer100k ? `with crime rate ${city.metrics.crimeRatePer100k}/100K` : ""} indicates ${score < 50 ? "urgent safety infrastructure needs" : "room for smart safety systems"}.`,
        th: `ความปลอดภัย ${score}/100 ${city.metrics.crimeRatePer100k ? `อัตราอาชญากรรม ${city.metrics.crimeRatePer100k}/100K` : ""} บ่งชี้${score < 50 ? "ต้องการโครงสร้างพื้นฐานด้านความปลอดภัยเร่งด่วน" : "ศักยภาพสำหรับระบบความปลอดภัยอัจฉริยะ"}`,
        zh: `安全${score}/100 ${city.metrics.crimeRatePer100k ? `犯罪率${city.metrics.crimeRatePer100k}/10万` : ""} 表明${score < 50 ? "迫切需要安全基础设施" : "智能安全系统空间"}。`,
      },
      actions: [
        { en: "Deploy smart CCTV with emergency response integration at key nodes", th: "ติดตั้งกล้อง CCTV อัจฉริยะพร้อมระบบตอบสนองฉุกเฉินที่จุดสำคัญ", zh: "在关键节点部署智能CCTV与应急响应集成" },
        { en: "Build flood early warning system using IoT water level sensors", th: "สร้างระบบเตือนภัยน้ำท่วมล่วงหน้าด้วยเซ็นเซอร์ระดับน้ำ IoT", zh: "用IoT水位传感器建设洪水预警系统" },
        { en: "Integrate community policing app with city operations center", th: "เชื่อมแอปตำรวจชุมชนเข้ากับศูนย์ปฏิบัติการเมือง", zh: "将社区警务App与城市运营中心集成" },
      ],
      estimatedImpact: {
        en: `+${target - score} points safety → +${((target - score) * 0.15).toFixed(1)} composite score`,
        th: `+${target - score} คะแนนความปลอดภัย → +${((target - score) * 0.15).toFixed(1)} คะแนนรวม`,
        zh: `安全+${target - score}分 → 综合+${((target - score) * 0.15).toFixed(1)}分`,
      },
      timeframe: "6-18 months",
      investmentRange: "THB 30M – 300M",
    }),
    wellbeing: () => ({
      pillar: "wellbeing",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Improve healthcare access and quality of life services",
        th: "ปรับปรุงการเข้าถึงสาธารณสุขและบริการคุณภาพชีวิต",
        zh: "改善医疗可及性与生活质量服务",
      },
      rationale: {
        en: `Wellbeing at ${score}/100 ${city.metrics.hospitalBedsPer10k ? `with ${city.metrics.hospitalBedsPer10k} hospital beds/10K` : ""} means ${score < 50 ? "healthcare and education gaps need urgent attention" : "service delivery can be enhanced with digital health tools"}.`,
        th: `คุณภาพชีวิต ${score}/100 ${city.metrics.hospitalBedsPer10k ? `เตียงโรงพยาบาล ${city.metrics.hospitalBedsPer10k}/หมื่นคน` : ""} หมายความว่า${score < 50 ? "ช่องว่างด้านสาธารณสุขและการศึกษาต้องการความสนใจเร่งด่วน" : "การให้บริการสามารถเสริมด้วยเครื่องมือสุขภาพดิจิทัล"}`,
        zh: `福祉${score}/100 ${city.metrics.hospitalBedsPer10k ? `每万人${city.metrics.hospitalBedsPer10k}病床` : ""} 意味着${score < 50 ? "医疗和教育缺口需要紧急关注" : "可用数字健康工具增强服务"}。`,
      },
      actions: [
        { en: "Deploy telemedicine platform connecting rural clinics to provincial hospitals", th: "ติดตั้งแพลตฟอร์มแพทย์ทางไกลเชื่อมคลินิกชนบทกับโรงพยาบาลจังหวัด", zh: "部署远程医疗平台连接农村诊所与省级医院" },
        { en: "Create community wellness centers with preventive health programs", th: "สร้างศูนย์สุขภาพชุมชนพร้อมโปรแกรมสุขภาพป้องกัน", zh: "建设社区健康中心配预防性健康项目" },
        { en: "Integrate health data into city data platform for public health monitoring", th: "เชื่อมข้อมูลสุขภาพเข้ากับ city data platform สำหรับการเฝ้าระวังสาธารณสุข", zh: "将健康数据集成到城市数据平台用于公共卫生监测" },
      ],
      estimatedImpact: {
        en: `+${target - score} points wellbeing → +${((target - score) * 0.15).toFixed(1)} composite score`,
        th: `+${target - score} คะแนนคุณภาพชีวิต → +${((target - score) * 0.15).toFixed(1)} คะแนนรวม`,
        zh: `福祉+${target - score}分 → 综合+${((target - score) * 0.15).toFixed(1)}分`,
      },
      timeframe: "12-24 months",
      investmentRange: "THB 50M – 500M",
    }),
    environment: () => ({
      pillar: "environment",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Address air quality, waste, and green infrastructure",
        th: "แก้ปัญหาคุณภาพอากาศ ขยะ และโครงสร้างพื้นฐานสีเขียว",
        zh: "解决空气质量、垃圾与绿色基础设施",
      },
      rationale: {
        en: `Environment at ${score}/100 ${city.metrics.pm25Annual ? `with PM2.5 at ${city.metrics.pm25Annual} μg/m³` : ""} shows ${score < 45 ? "critical environmental challenges that directly impact health and livability" : "environmental infrastructure gaps that are addressable with targeted investment"}.`,
        th: `สิ่งแวดล้อม ${score}/100 ${city.metrics.pm25Annual ? `PM2.5 ${city.metrics.pm25Annual} μg/m³` : ""} แสดง${score < 45 ? "ความท้าทายด้านสิ่งแวดล้อมที่ส่งผลตรงต่อสุขภาพและความน่าอยู่" : "ช่องว่างโครงสร้างพื้นฐานสิ่งแวดล้อมที่แก้ไขได้ด้วยการลงทุนเป้าหมาย"}`,
        zh: `环境${score}/100 ${city.metrics.pm25Annual ? `PM2.5 ${city.metrics.pm25Annual} μg/m³` : ""} 显示${score < 45 ? "直接影响健康和宜居的关键环境挑战" : "可通过定向投资解决的环境基础设施缺口"}。`,
      },
      actions: [
        { en: "Deploy real-time air quality monitoring network (PM2.5, NO₂, O₃) with public alerts", th: "ติดตั้งเครือข่ายตรวจวัดคุณภาพอากาศแบบเรียลไทม์ (PM2.5, NO₂, O₃) พร้อมแจ้งเตือนสาธารณะ", zh: "部署实时空气质量监测网络(PM2.5、NO₂、O₃)配公共预警" },
        { en: "Implement smart waste management with sensor-equipped bins and optimized collection routes", th: "ดำเนินการจัดการขยะอัจฉริยะด้วยถังมีเซ็นเซอร์และเส้นทางเก็บที่เหมาะสม", zh: "实施智能垃圾管理配传感器垃圾箱和优化收集路线" },
        { en: "Increase urban green coverage to 30%+ through pocket parks and green corridor strategy", th: "เพิ่มพื้นที่สีเขียวเมืองเป็น 30%+ ผ่านสวนขนาดเล็กและกลยุทธ์ green corridor", zh: "通过口袋公园和绿色走廊策略将城市绿化覆盖率提升至30%+" },
      ],
      estimatedImpact: {
        en: `+${target - score} points environment → +${((target - score) * 0.10).toFixed(1)} composite score`,
        th: `+${target - score} คะแนนสิ่งแวดล้อม → +${((target - score) * 0.10).toFixed(1)} คะแนนรวม`,
        zh: `环境+${target - score}分 → 综合+${((target - score) * 0.10).toFixed(1)}分`,
      },
      timeframe: "12-30 months",
      investmentRange: "THB 30M – 500M",
    }),
    hospitality: () => ({
      pillar: "hospitality",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Build community engagement and cultural vitality",
        th: "สร้างการมีส่วนร่วมชุมชนและความมีชีวิตชีวาทางวัฒนธรรม",
        zh: "建设社区参与与文化活力",
      },
      rationale: {
        en: `Hospitality at ${score}/100 means community warmth and cultural programming ${score < 50 ? "need foundational work" : "can be amplified"}. This pillar reflects whether residents actually want to stay.`,
        th: `อัธยาศัย ${score}/100 หมายความว่าความอบอุ่นชุมชนและกิจกรรมวัฒนธรรม${score < 50 ? "ต้องทำงานฐานราก" : "สามารถขยายผลได้"} เสาหลักนี้สะท้อนว่าชาวเมืองอยากอยู่จริงหรือไม่`,
        zh: `人文${score}/100意味着社区温暖和文化活动${score < 50 ? "需要基础性工作" : "可以放大"}。此支柱反映居民是否真的想留下来。`,
      },
      actions: [
        { en: "Launch citizen engagement platform with participatory budgeting for local projects", th: "เปิดแพลตฟอร์มการมีส่วนร่วมพลเมืองพร้อมงบประมาณแบบมีส่วนร่วมสำหรับโครงการท้องถิ่น", zh: "启动市民参与平台配参与式预算用于本地项目" },
        { en: "Create cultural programming calendar with monthly community events and festivals", th: "สร้างปฏิทินกิจกรรมวัฒนธรรมพร้อมงานชุมชนรายเดือนและเทศกาล", zh: "创建文化活动日历配月度社区活动与节庆" },
        { en: "Develop smart tourism infrastructure connecting visitors to local experiences", th: "พัฒนาโครงสร้างพื้นฐานท่องเที่ยวอัจฉริยะเชื่อมนักท่องเที่ยวกับประสบการณ์ท้องถิ่น", zh: "开发智慧旅游基础设施连接游客与本地体验" },
      ],
      estimatedImpact: {
        en: `+${target - score} points hospitality → +${((target - score) * 0.10).toFixed(1)} composite score`,
        th: `+${target - score} คะแนนอัธยาศัย → +${((target - score) * 0.10).toFixed(1)} คะแนนรวม`,
        zh: `人文+${target - score}分 → 综合+${((target - score) * 0.10).toFixed(1)}分`,
      },
      timeframe: "6-18 months",
      investmentRange: "THB 10M – 200M",
    }),
    digital: () => ({
      pillar: "digital",
      currentScore: score,
      targetScore: target,
      priority,
      title: {
        en: "Accelerate digital infrastructure and smart systems",
        th: "เร่งโครงสร้างพื้นฐานดิจิทัลและระบบอัจฉริยะ",
        zh: "加速数字基础设施与智能系统",
      },
      rationale: {
        en: `Digital at ${score}/100 is the enabler pillar. While it has the lowest weight (5%), low digital scores block progress in every other dimension.`,
        th: `ดิจิทัล ${score}/100 เป็นเสาหลักที่เปิดทาง แม้มีน้ำหนักต่ำสุด (5%) แต่คะแนนดิจิทัลต่ำกั้นความก้าวหน้าในทุกมิติอื่น`,
        zh: `数字${score}/100是赋能支柱。虽然权重最低(5%)，但低数字分数会阻碍每个其他维度的进展。`,
      },
      actions: [
        { en: "Deploy city-wide fiber and 5G backbone infrastructure", th: "ติดตั้งโครงสร้างไฟเบอร์และ 5G ทั่วเมือง", zh: "部署全城光纤和5G骨干基础设施" },
        { en: "Build city data platform connecting local operations to national datasets", th: "สร้าง city data platform เชื่อมการปฏิบัติการท้องถิ่นกับข้อมูลระดับชาติ", zh: "建设城市数据平台连接本地运营与国家数据集" },
        { en: "Launch digital citizen services (permits, complaints, payments) via mobile app", th: "เปิดบริการพลเมืองดิจิทัล (ใบอนุญาต ร้องเรียน จ่ายเงิน) ผ่านแอปมือถือ", zh: "通过移动App启动数字市民服务(许可、投诉、支付)" },
      ],
      estimatedImpact: {
        en: `+${target - score} points digital → +${((target - score) * 0.05).toFixed(1)} composite score + enabler effect across all pillars`,
        th: `+${target - score} คะแนนดิจิทัล → +${((target - score) * 0.05).toFixed(1)} คะแนนรวม + ผลขยายทุกเสาหลัก`,
        zh: `数字+${target - score}分 → 综合+${((target - score) * 0.05).toFixed(1)}分 + 全支柱赋能效应`,
      },
      timeframe: "12-24 months",
      investmentRange: "THB 50M – 500M",
    }),
  };

  return recommendations[pillar]();
}

// ---------------------------------------------------------------------------
// 4. TIER UPGRADE ANALYSIS — what it takes to reach the next tier
// ---------------------------------------------------------------------------

export interface TierUpgradeAnalysis {
  currentTier: string;
  currentScore: number;
  nextTier: string | null;
  nextThreshold: number | null;
  gap: number | null;
  feasibility: "achievable" | "stretch" | "long-term";
  quickestWins: { pillar: ScoringPillar; pointsNeeded: number; weight: number; compositeGain: number }[];
  projectedTimeline: string;
  summary: { en: string; th: string; zh: string };
}

export function analyzeTierUpgrade(city: SmartCity): TierUpgradeAnalysis {
  const thresholds = { gamma: 45, beta: 65, alpha: 100 };
  const tierOrder = ["gamma", "beta", "alpha"] as const;
  const currentIndex = tierOrder.indexOf(city.tier);
  const nextTier = currentIndex < 2 ? tierOrder[currentIndex + 1] : null;
  const nextThreshold = nextTier ? thresholds[city.tier === "gamma" ? "gamma" : "beta"] : null;
  const gap = nextThreshold ? nextThreshold - city.compositeScore : null;

  const feasibility: "achievable" | "stretch" | "long-term" =
    gap === null ? "long-term" :
    gap <= 5 ? "achievable" :
    gap <= 15 ? "stretch" : "long-term";

  // Find quickest wins: which pillars give the most composite gain per point
  const wins = (Object.entries(city.scores) as [ScoringPillar, number][])
    .filter(([, s]) => s < 75)
    .map(([pillar, score]) => {
      const weight = { livability: 25, economy: 20, safety: 15, wellbeing: 15, environment: 10, hospitality: 10, digital: 5 }[pillar];
      const pointsNeeded = Math.min(15, 75 - score);
      const compositeGain = (pointsNeeded * weight) / 100;
      return { pillar, pointsNeeded, weight, compositeGain };
    })
    .sort((a, b) => b.compositeGain - a.compositeGain)
    .slice(0, 3);

  const timeline =
    feasibility === "achievable" ? "6-12 months" :
    feasibility === "stretch" ? "12-24 months" : "24-48 months";

  const summaryText = nextTier
    ? {
        en: `${city.nameEn} needs +${gap?.toFixed(1)} composite points to reach ${nextTier} tier. Fastest path: improve ${wins.map(w => w.pillar).join(", ")} — these ${wins.length} pillars alone could add +${wins.reduce((s, w) => s + w.compositeGain, 0).toFixed(1)} points.`,
        th: `${city.nameTh} ต้องการ +${gap?.toFixed(1)} คะแนนรวมเพื่อถึงระดับ ${nextTier} ทางเร็วที่สุด: ปรับปรุง ${wins.map(w => w.pillar).join(", ")} — ${wins.length} เสาหลักนี้เพียงอย่างเดียวเพิ่มได้ +${wins.reduce((s, w) => s + w.compositeGain, 0).toFixed(1)} คะแนน`,
        zh: `${city.nameEn} 需要+${gap?.toFixed(1)}综合分才能达到${nextTier}级。最快路径：改善${wins.map(w => w.pillar).join("、")}——这${wins.length}个支柱就能带来+${wins.reduce((s, w) => s + w.compositeGain, 0).toFixed(1)}分。`,
      }
    : {
        en: `${city.nameEn} is already Alpha tier. Focus on maintaining excellence and becoming a model city for other Thai cities to learn from.`,
        th: `${city.nameTh} อยู่ระดับ Alpha แล้ว มุ่งเน้นรักษาความเป็นเลิศและเป็นต้นแบบให้เมืองไทยอื่นเรียนรู้`,
        zh: `${city.nameEn}已是Alpha级。专注保持卓越并成为其他泰国城市学习的典范。`,
      };

  return {
    currentTier: city.tier,
    currentScore: city.compositeScore,
    nextTier,
    nextThreshold,
    gap,
    feasibility,
    quickestWins: wins,
    projectedTimeline: timeline,
    summary: summaryText,
  };
}
