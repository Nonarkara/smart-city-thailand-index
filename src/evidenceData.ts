// ---------------------------------------------------------------------------
// Evidence & Data Provenance
// ---------------------------------------------------------------------------
// Every score has a source. Every claim has evidence.
// This is the foundation of a credible index.
// ---------------------------------------------------------------------------

import { getClaimValue } from "./claimRegistry.ts";

export interface EvidenceItem {
  cityId: string;
  pillar: string;
  type: "news" | "data" | "field" | "satellite" | "government";
  titleEn: string;
  titleTh: string;
  titleZh: string;
  source: string;
  url?: string;
  date: string;
  metric?: string;
  value?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: "government" | "international" | "satellite" | "field" | "academic";
  descEn: string;
  descTh: string;
  descZh: string;
  url: string;
  updateFrequency: string;
  metrics: string[];
}

const certifiedCityCount = Number(getClaimValue("certified-cities") ?? 37);
const promotionCityCount = Number(getClaimValue("promotion-zones") ?? 190);

export const dataSources: DataSource[] = [
  {
    id: "nso",
    name: "National Statistical Office (NSO)",
    type: "government",
    descEn: "Thailand's official statistical agency. Provides household income, employment, population, and social indicator data at provincial level.",
    descTh: "สำนักงานสถิติแห่งชาติ ให้ข้อมูลรายได้ครัวเรือน การจ้างงาน ประชากร และตัวชี้วัดสังคมระดับจังหวัด",
    descZh: "泰国官方统计机构。提供省级家庭收入、就业、人口和社会指标数据。",
    url: "https://www.nso.go.th",
    updateFrequency: "Annual",
    metrics: ["avgMonthlyIncome", "population", "employment"],
  },
  {
    id: "nesdc",
    name: "NESDC — GPP Data",
    type: "government",
    descEn: "National Economic and Social Development Council. Publishes Gross Provincial Product (GPP) per capita — the primary economic output metric.",
    descTh: "สภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ เผยแพร่ผลิตภัณฑ์มวลรวมจังหวัด (GPP) ต่อหัว",
    descZh: "国家经济和社会发展委员会。发布各省人均国内生产总值(GPP)。",
    url: "https://www.nesdc.go.th",
    updateFrequency: "Annual",
    metrics: ["gppPerCapita"],
  },
  {
    id: "pcd",
    name: "Pollution Control Department (PCD)",
    type: "government",
    descEn: "Ministry of Natural Resources. Operates 70+ air quality monitoring stations. PM2.5 annual averages are the primary environmental health metric.",
    descTh: "กรมควบคุมมลพิษ กระทรวงทรัพยากรธรรมชาติ ดำเนินการสถานีเฝ้าระวังคุณภาพอากาศ 70+ แห่ง",
    descZh: "污染控制部门。运营70多个空气质量监测站。PM2.5年均值是主要环境健康指标。",
    url: "http://air4thai.pcd.go.th",
    updateFrequency: "Real-time / Annual average",
    metrics: ["pm25Annual"],
  },
  {
    id: "rtp",
    name: "Royal Thai Police",
    type: "government",
    descEn: "Official crime statistics per province. Reported crimes per 100,000 population — the primary safety metric.",
    descTh: "สำนักงานตำรวจแห่งชาติ สถิติอาชญากรรมรายจังหวัด อาชญากรรมต่อแสนประชากร",
    descZh: "泰国皇家警察。各省官方犯罪统计。每10万人口报案数——主要安全指标。",
    url: "https://www.royalthaipolice.go.th",
    updateFrequency: "Annual",
    metrics: ["crimeRatePer100k"],
  },
  {
    id: "moph",
    name: "Ministry of Public Health",
    type: "government",
    descEn: "Hospital bed counts, healthcare access metrics, disease surveillance data at provincial level.",
    descTh: "กระทรวงสาธารณสุข จำนวนเตียงโรงพยาบาล ตัวชี้วัดการเข้าถึงสาธารณสุข",
    descZh: "公共卫生部。医院床位数、医疗可及性指标、省级疾病监测数据。",
    url: "https://www.moph.go.th",
    updateFrequency: "Annual",
    metrics: ["hospitalBedsPer10k"],
  },
  {
    id: "gistda",
    name: "GISTDA — Satellite Imagery",
    type: "satellite",
    descEn: "Geo-Informatics and Space Technology Agency. Provides satellite-derived green coverage, urban sprawl, and land use data for all Thai provinces.",
    descTh: "สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ ภาพถ่ายดาวเทียมให้ข้อมูลพื้นที่สีเขียว การขยายตัวของเมือง",
    descZh: "地理信息和空间技术机构。提供卫星衍生的绿地覆盖率、城市扩张和土地利用数据。",
    url: "https://www.gistda.or.th",
    updateFrequency: "Quarterly",
    metrics: ["greenCoverage"],
  },
  {
    id: "open-meteo",
    name: "Open-Meteo / Copernicus",
    type: "satellite",
    descEn: "Open weather and climate API. Provides historical PM2.5, temperature, humidity, and climate comfort data cross-validated against PCD stations.",
    descTh: "API สภาพอากาศเปิด ให้ข้อมูล PM2.5 ย้อนหลัง อุณหภูมิ ความชื้น ตรวจสอบร่วมกับสถานี PCD",
    descZh: "开放气象和气候API。提供历史PM2.5、温度、湿度和气候舒适度数据，与PCD站点交叉验证。",
    url: "https://open-meteo.com",
    updateFrequency: "Daily",
    metrics: ["pm25Annual", "climate"],
  },
  {
    id: "wb",
    name: "World Bank Open Data",
    type: "international",
    descEn: "Country-context indicators: GDP growth, Gini coefficient, ease of doing business, governance quality. Used for national-level normalization.",
    descTh: "ตัวชี้วัดระดับประเทศ: การเติบโต GDP ค่า Gini ความง่ายในการทำธุรกิจ คุณภาพการปกครอง",
    descZh: "国家背景指标：GDP增长、基尼系数、营商便利度、治理质量。用于国家级标准化。",
    url: "https://data.worldbank.org",
    updateFrequency: "Annual",
    metrics: ["gdpGrowth", "gini", "governance"],
  },
  {
    id: "depa",
    name: "depa Smart City Office",
    type: "government",
    descEn: `Smart city certification status, project data, digital initiative details, and the national program registry covering all ${certifiedCityCount} certified cities plus ${promotionCityCount} promotion cities.`,
    descTh: `สถานะการรับรองเมืองอัจฉริยะ ข้อมูลโครงการ รายละเอียดโครงการดิจิทัล และทะเบียนโครงการระดับชาติที่ครอบคลุม ${certifiedCityCount} เมืองรับรองกับ ${promotionCityCount} เมืองเขตส่งเสริม`,
    descZh: `智慧城市认证状态、项目数据、数字计划细节，以及覆盖全部 ${certifiedCityCount} 座认证城市与 ${promotionCityCount} 座推广城市的国家项目名录。`,
    url: "https://www.depa.or.th/th/smart-city-plan/existing-smart-city",
    updateFrequency: "Annual (certification batches)",
    metrics: ["smartDimensions", "certificationStatus", "digitalProjects"],
  },
  {
    id: "citydata",
    name: "City Data Platform Thailand",
    type: "government",
    descEn: "depa's unified smart city data dashboard. Aggregates IoT sensor data, municipal service metrics, and citizen engagement data from participating cities.",
    descTh: "แดชบอร์ดข้อมูลเมืองอัจฉริยะรวมศูนย์ของ depa รวบรวมข้อมูลเซ็นเซอร์ IoT ตัวชี้วัดบริการเทศบาล",
    descZh: "depa的统一智慧城市数据仪表板。汇总参与城市的物联网传感器数据、市政服务指标和市民参与数据。",
    url: "https://www.citydata.in.th",
    updateFrequency: "Real-time (participating cities)",
    metrics: ["iotSensors", "citizenEngagement", "serviceMetrics"],
  },
  {
    id: "boi",
    name: "Board of Investment (BOI)",
    type: "government",
    descEn: "Thailand Board of Investment. FDI approvals, promoted projects by province/sector, foreign ownership data, and S-Curve industry tracking. Key source for economic competitiveness assessment.",
    descTh: "สำนักงานคณะกรรมการส่งเสริมการลงทุน (BOI) ข้อมูลอนุมัติ FDI โครงการที่ส่งเสริมรายจังหวัด/รายภาค ติดตามอุตสาหกรรม S-Curve",
    descZh: "泰国投资促进委员会(BOI)。各省FDI审批、促进项目、外资所有权数据和S-Curve产业跟踪。",
    url: "https://ipstat.boi.go.th/",
    updateFrequency: "Quarterly",
    metrics: ["fdiInflow", "promotedProjects", "investmentZones"],
  },
  {
    id: "onep",
    name: "ONEP — Environmental Performance Index",
    type: "government",
    descEn: "Office of Natural Resources and Environmental Policy and Planning. National EPI with provincial inputs covering air quality, water quality, waste management, and forest cover. Latest report 2023.",
    descTh: "สำนักงานนโยบายและแผนทรัพยากรธรรมชาติฯ (สผ.) ดัชนีสิ่งแวดล้อมแห่งชาติ ครอบคลุมคุณภาพอากาศ น้ำ ขยะ และป่าไม้ รายงานล่าสุด 2023",
    descZh: "自然资源与环境政策规划办公室。国家环境绩效指数，涵盖空气、水质、废弃物和森林覆盖。",
    url: "https://www.onep.go.th/",
    updateFrequency: "Annual",
    metrics: ["waterQuality", "environmentalPerformance"],
  },
  {
    id: "rfd",
    name: "Royal Forest Department",
    type: "government",
    descEn: "Official forest cover statistics by province. Tracks deforestation rates, reforestation programs, and protected area extent. Critical for environment pillar verification.",
    descTh: "สถิติพื้นที่ป่าไม้อย่างเป็นทางการรายจังหวัด อัตราการตัดไม้ทำลายป่า โครงการปลูกป่า พื้นที่คุ้มครอง",
    descZh: "各省官方森林覆盖率统计。跟踪毁林率、重新造林项目和保护区范围。",
    url: "https://www.forest.go.th/",
    updateFrequency: "Annual",
    metrics: ["forestCoverage", "deforestation"],
  },
  {
    id: "field",
    name: "Field Observation",
    type: "field",
    descEn: "Direct site visits by the research team. Verified: is the infrastructure actually built? Do citizens use the smart services? Does the city match its proposal?",
    descTh: "การลงพื้นที่สำรวจจริงโดยทีมวิจัย ตรวจสอบ: โครงสร้างพื้นฐานสร้างจริงหรือไม่? ประชาชนใช้บริการอัจฉริยะหรือไม่?",
    descZh: "研究团队实地考察。验证：基础设施是否真正建成？市民是否使用智能服务？城市是否符合其提案？",
    url: "",
    updateFrequency: "Ongoing",
    metrics: ["reality", "citizenUsage", "infrastructureCompletion"],
  },
  {
    id: "treasury",
    name: "Treasury Department",
    type: "government",
    descEn: "Ministry of Finance. Publishes official land appraisal values for Thailand, updated every 4 years. Primary baseline for real estate valuation.",
    descTh: "กรมธนารักษ์ กระทรวงการคลัง เผยแพร่ราคาประเมินทุนทรัพย์ที่ดินอย่างเป็นทางการของประเทศไทย ปรับปรุงทุก 4 ปี",
    descZh: "财政部财政厅。发布泰国官方土地评估价值，每 4 年更新一次。房地产估值的主要基准。",
    url: "https://www.treasury.go.th",
    updateFrequency: "Every 4 years",
    metrics: ["landPriceBaht"],
  },
];

// Evidence items — real news and data points backing city scores
export const evidenceItems: EvidenceItem[] = [
  // ─── Phuket ───
  { cityId: "phuket", pillar: "digital", type: "news", titleEn: "Phuket Smart City traffic management reduces congestion 25% on key corridors", titleTh: "ระบบจราจรอัจฉริยะภูเก็ตลดการจราจรติดขัด 25% บนเส้นทางหลัก", titleZh: "普吉智慧交通管理在主要走廊上将拥堵降低 25%", source: "depa Project Report", date: "2024", metric: "congestion_reduction", value: "25%" },
  { cityId: "phuket", pillar: "environment", type: "data", titleEn: "Phuket annual PM2.5: 18.2 μg/m³ — below WHO interim target of 25", titleTh: "ภูเก็ต PM2.5 เฉลี่ยปี: 18.2 μg/m³ — ต่ำกว่าเป้า WHO ชั่วคราว 25", titleZh: "普吉年均 PM2.5 为 18.2 μg/m³，低于 WHO 25 的阶段目标", source: "PCD / Open-Meteo", date: "2025", metric: "pm25", value: "18.2" },
  { cityId: "phuket", pillar: "economy", type: "data", titleEn: "Phuket GPP per capita ฿492,000 — 2nd highest outside Bangkok", titleTh: "GPP ต่อหัวภูเก็ต ฿492,000 — สูงสุดอันดับ 2 นอกกรุงเทพฯ", titleZh: "普吉人均 GPP 为 492,000 泰铢，是曼谷以外第二高", source: "NESDC", date: "2024", metric: "gpp", value: "492000" },
  { cityId: "phuket", pillar: "hospitality", type: "news", titleEn: "Smart tourist safety system with multilingual alerts deployed island-wide", titleTh: "ระบบความปลอดภัยนักท่องเที่ยวอัจฉริยะพร้อมการแจ้งเตือนหลายภาษาทั่วเกาะ", titleZh: "全岛部署多语种智慧游客安全预警系统", source: "Phuket Smart City Office", date: "2024" },

  // ─── Khon Kaen ───
  { cityId: "khon-kaen", pillar: "digital", type: "news", titleEn: "Khon Kaen smart bus system operational — real-time tracking via LINE app", titleTh: "ระบบรถบัสอัจฉริยะขอนแก่นเปิดให้บริการ — ติดตามเรียลไทม์ผ่านแอพ LINE", titleZh: "孔敬智慧公交已运行，可通过 LINE 实时追踪", source: "Khon Kaen Smart City", date: "2024" },
  { cityId: "khon-kaen", pillar: "economy", type: "data", titleEn: "Khon Kaen GPP per capita ฿155,000 — highest in Isan region", titleTh: "GPP ต่อหัวขอนแก่น ฿155,000 — สูงสุดในภาคอีสาน", titleZh: "孔敬人均 GPP 为 155,000 泰铢，在伊善地区最高", source: "NESDC", date: "2024", metric: "gpp", value: "155000" },
  { cityId: "khon-kaen", pillar: "livability", type: "news", titleEn: "LRT construction underway — digital twin used for urban planning", titleTh: "กำลังก่อสร้าง LRT — ใช้ digital twin สำหรับวางผังเมือง", titleZh: "LRT 正在建设中，并使用数字孪生进行城市规划", source: "MRTA / Khon Kaen Transit", date: "2025" },

  // ─── Wangchan Valley ───
  { cityId: "wangchan-valley", pillar: "livability", type: "field", titleEn: "Field visit observation: majority of the site is undeveloped, with early infrastructure phases underway.", titleTh: "การลงพื้นที่สังเกตการณ์: พื้นที่ส่วนใหญ่ยังไม่ได้รับการพัฒนา อยู่ในช่วงเริ่มต้นของโครงสร้างพื้นฐาน", titleZh: "实地踏查观察：大部分场地尚未开发，早期基础设施阶段正在进行中", source: "SLIC Field Team", date: "2025" },
  { cityId: "wangchan-valley", pillar: "economy", type: "data", titleEn: "Population: 0 permanent residents. No commercial activity. GPP contribution: negligible.", titleTh: "ประชากร: 0 ผู้อยู่อาศัยถาวร ไม่มีกิจกรรมเชิงพาณิชย์ การมีส่วนร่วม GPP: น้อยมาก", titleZh: "常住人口为 0，没有商业活动，对 GPP 的贡献几乎可以忽略", source: "NSO / Field observation", date: "2025", metric: "population", value: "0" },

  // ─── Samyan ───
  { cityId: "samyan", pillar: "digital", type: "news", titleEn: "Samyan 5G testbed supporting 200+ startups at True Digital Park and Block 28", titleTh: "Samyan 5G testbed รองรับ 200+ สตาร์ทอัพที่ True Digital Park และ Block 28", titleZh: "Samyan 5G 试验场支持 True Digital Park 与 Block 28 的 200 多家创业公司", source: "True Digital Park", date: "2024" },
  { cityId: "samyan", pillar: "economy", type: "data", titleEn: "Bangkok GPP per capita ฿628,000 — Samyan district benefits from Chulalongkorn University innovation corridor", titleTh: "GPP ต่อหัวกรุงเทพฯ ฿628,000 — ย่านสามย่านได้ประโยชน์จากระเบียงนวัตกรรมจุฬาฯ", titleZh: "曼谷人均 GPP 为 628,000 泰铢，Samyan 受益于朱拉隆功大学创新走廊", source: "NESDC / CU Innovation Hub", date: "2024" },

  // ─── Chiang Mai ───
  { cityId: "chiang-mai-old-town", pillar: "environment", type: "data", titleEn: "Chiang Mai annual PM2.5: 46.1 μg/m³ — exceeds WHO guideline by 4x. Burning season drives score down.", titleTh: "เชียงใหม่ PM2.5 เฉลี่ยปี: 46.1 μg/m³ — เกินมาตรฐาน WHO 4 เท่า ฤดูเผาดึงคะแนนลง", titleZh: "清迈年均 PM2.5 为 46.1 μg/m³，超过 WHO 指引四倍，烧荒季直接拖低评分", source: "PCD / Open-Meteo", date: "2025", metric: "pm25", value: "46.1" },
  { cityId: "chiang-mai-old-town", pillar: "hospitality", type: "news", titleEn: "Smart heritage preservation: IoT sensors on 300+ temples monitoring structural integrity", titleTh: "อนุรักษ์มรดกอัจฉริยะ: เซ็นเซอร์ IoT บนวัด 300+ แห่งเฝ้าระวังความมั่นคงโครงสร้าง", titleZh: "智慧遗产保护：300 多座寺庙部署 IoT 传感器监测结构安全", source: "Chiang Mai Municipality / depa", date: "2024" },
  { cityId: "chiang-mai-old-town", pillar: "digital", type: "news", titleEn: "50+ air quality monitoring stations deployed across Chiang Mai basin", titleTh: "สถานีเฝ้าระวังคุณภาพอากาศ 50+ แห่งติดตั้งทั่วแอ่งเชียงใหม่", titleZh: "清迈盆地已部署 50 多个空气质量监测站", source: "CMU / PCD Partnership", date: "2024" },

  // ─── Yala ───
  { cityId: "yala", pillar: "environment", type: "news", titleEn: "Yala wins Thailand's cleanest city award for the 4th consecutive year", titleTh: "ยะลาชนะรางวัลเมืองสะอาดที่สุดของไทย 4 ปีติดต่อกัน", titleZh: "也拉连续第四年获得泰国最清洁城市奖", source: "Ministry of Interior", date: "2024" },
  { cityId: "yala", pillar: "safety", type: "data", titleEn: "Crime rate 245 per 100K — elevated due to deep south security situation", titleTh: "อัตราอาชญากรรม 245 ต่อแสน — สูงเนื่องจากสถานการณ์ความมั่นคงชายแดนใต้", titleZh: "犯罪率为每十万人 245 起，受南部边境安全局势影响偏高", source: "Royal Thai Police", date: "2024", metric: "crime", value: "245" },

  // ─── Nakhon Si Thammarat ───
  { cityId: "nakhon-si-thammarat", pillar: "digital", type: "news", titleEn: "My City app cuts citizen complaint response time from 67 hours to 2 hours", titleTh: "แอพ My City ลดเวลาตอบสนองข้อร้องเรียนจาก 67 ชั่วโมงเหลือ 2 ชั่วโมง", titleZh: "My City 应用把市民投诉响应时间从 67 小时压到 2 小时", source: "depa / GovInsider", url: "https://govinsider.asia/intl-en/article/a-bottom-up-smart-city-thailands-evolving-approach-to-smart-city-development", date: "2024" },
  { cityId: "nakhon-si-thammarat", pillar: "livability", type: "news", titleEn: "Smart flood management for Pak Phanang basin — IoT sensors prevent repeat of 2017 flooding", titleTh: "จัดการน้ำท่วมอัจฉริยะสำหรับลุ่มน้ำปากพนัง — เซ็นเซอร์ IoT ป้องกันน้ำท่วมซ้ำรอยปี 2560", titleZh: "北榄河流域智慧防洪系统上线，IoT 传感器帮助避免重演 2017 年洪灾", source: "Nakhon Si Thammarat Municipality", date: "2024" },

  // ─── Hat Yai ───
  { cityId: "hat-yai", pillar: "livability", type: "news", titleEn: "Smart flood management system operational — critical for this flood-prone city", titleTh: "ระบบจัดการน้ำท่วมอัจฉริยะทำงานแล้ว — สำคัญสำหรับเมืองที่เสี่ยงน้ำท่วม", titleZh: "智慧防洪系统已运行，对这座易涝城市至关重要", source: "Hat Yai Municipality / depa", date: "2024" },
  { cityId: "hat-yai", pillar: "economy", type: "news", titleEn: "Cross-border trade digitization with Malaysia boosting Hat Yai commercial district", titleTh: "การค้าข้ามพรมแดนดิจิทัลกับมาเลเซียส่งเสริมย่านการค้าหาดใหญ่", titleZh: "与马来西亚的跨境贸易数字化正在带动合艾商业区", source: "Southern Border Provinces Administration Centre", date: "2024" },

  // ─── Mae Moh ───
  { cityId: "mae-moh", pillar: "environment", type: "news", titleEn: "EGAT smart energy monitoring for coal-to-clean transition at Mae Moh power plant", titleTh: "EGAT เฝ้าระวังพลังงานอัจฉริยะสำหรับการเปลี่ยนผ่านจากถ่านหินสู่พลังงานสะอาดที่โรงไฟฟ้าแม่เมาะ", titleZh: "EGAT 在 Mae Moh 电厂部署智慧能源监测，支撑从煤到清洁能源的转型", source: "EGAT / depa", date: "2024" },

  // ─── Saensuk ───
  { cityId: "saensuk", pillar: "environment", type: "news", titleEn: "Real-time beach water quality monitoring — bacteria counts visible to public", titleTh: "เฝ้าระวังคุณภาพน้ำชายหาดเรียลไทม์ — ปริมาณแบคทีเรียเปิดเผยต่อสาธารณะ", titleZh: "海滩水质实时监测上线，细菌数向公众公开", source: "Saensuk Municipality", date: "2024" },
];

export function getEvidenceForCity(cityId: string): EvidenceItem[] {
  return evidenceItems.filter(e => e.cityId === cityId);
}
