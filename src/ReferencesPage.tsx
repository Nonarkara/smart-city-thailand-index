import { dataSources } from "./evidenceData";
import { instruments } from "./financialToolkit";
import { SCORING_PILLARS, computeComposite, assignTier, roundScore } from "./scoring";
import { PILLAR_LABELS, PILLAR_WEIGHTS, PILLAR_COLORS } from "./types";
import type { Locale, CityScores } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface LocalizedItem {
  en: string;
  th: string;
  zh: string;
}

function t(locale: Locale, copy: LocalizedItem): string {
  return locale === "th" ? copy.th : locale === "zh" ? copy.zh : copy.en;
}

// ─── International Standards & Frameworks ───
const STANDARDS = [
  {
    id: "un-habitat-cpi",
    name: "UN-Habitat City Prosperity Initiative (CPI)",
    body: "United Nations Human Settlements Programme",
    year: "2012–present",
    pillarMapping: "Livability, Wellbeing",
    desc: {
      en: "Global framework measuring city prosperity across productivity, infrastructure, quality of life, equity, and environmental sustainability. Our livability and wellbeing pillars align with CPI dimensions.",
      th: "กรอบวัดความเจริญรุ่งเรืองของเมืองระดับโลก ครอบคลุมด้านผลิตภาพ โครงสร้างพื้นฐาน คุณภาพชีวิต ความเสมอภาค และความยั่งยืน",
      zh: "衡量城市繁荣度的全球框架，涵盖生产力、基础设施、生活质量、公平与环境可持续性。",
    },
    url: "https://unhabitat.org/programme/city-prosperity-initiative",
  },
  {
    id: "iso-37122",
    name: "ISO 37122:2019",
    body: "International Organization for Standardization",
    year: "2019",
    pillarMapping: "All 7 pillars",
    desc: {
      en: "Indicators for smart cities — defines 80 indicators across economy, education, energy, environment, recreation, safety, waste, and transport. Our pillar signals are mapped to ISO 37122 domains.",
      th: "ตัวชี้วัดเมืองอัจฉริยะ — กำหนด 80 ตัวชี้วัดครอบคลุมเศรษฐกิจ การศึกษา พลังงาน สิ่งแวดล้อม นันทนาการ ความปลอดภัย ขยะ และขนส่ง",
      zh: "智慧城市指标——定义涵盖经济、教育、能源、环境、休闲、安全、废弃物和交通的80项指标。",
    },
    url: "https://www.iso.org/standard/69050.html",
  },
  {
    id: "sdg-11",
    name: "UN SDG 11: Sustainable Cities and Communities",
    body: "United Nations",
    year: "2015–2030",
    pillarMapping: "Safety, Environment, Livability",
    desc: {
      en: "Make cities and human settlements inclusive, safe, resilient, and sustainable. Our safety, environment, and livability pillars directly map to SDG 11 targets 11.1–11.7.",
      th: "ทำให้เมืองและชุมชนเปิดกว้าง ปลอดภัย ยืดหยุ่น และยั่งยืน เสาหลักด้านความปลอดภัย สิ่งแวดล้อม และความน่าอยู่ตรงกับเป้าหมาย SDG 11",
      zh: "让城市和人类住区包容、安全、有韧性且可持续。安全、环境和宜居支柱直接对应SDG 11目标。",
    },
    url: "https://sdgs.un.org/goals/goal11",
  },
  {
    id: "ascf",
    name: "ASEAN Smart Cities Framework (ASCF)",
    body: "ASEAN Secretariat",
    year: "2018",
    pillarMapping: "All 7 pillars",
    desc: {
      en: "Framework adopted at the 32nd ASEAN Summit defining smart city development across civic and social, health and well-being, safety and security, quality environment, built infrastructure, and industry and innovation.",
      th: "กรอบที่รับรองในการประชุมสุดยอดอาเซียนครั้งที่ 32 กำหนดการพัฒนาเมืองอัจฉริยะ 6 มิติ",
      zh: "在第32届东盟峰会上通过的框架，定义了智慧城市发展的六个维度。",
    },
    url: "https://asean.org/asean-smart-cities-network/",
  },
  {
    id: "ascap",
    name: "ASEAN Smart Cities Action Plan (ASCAP) 2021–2025",
    body: "ASEAN Smart Cities Network",
    year: "2021–2025",
    pillarMapping: "Economy, Digital",
    desc: {
      en: "Operational action plan for 26 ASEAN pilot cities including Bangkok, Chiang Mai, and Phuket. Defines collaboration mechanisms, knowledge-sharing platforms, and financing pathways.",
      th: "แผนปฏิบัติการสำหรับ 26 เมืองนำร่องอาเซียน รวมถึงกรุงเทพฯ เชียงใหม่ และภูเก็ต",
      zh: "26个东盟试点城市的行动计划，包括曼谷、清迈和普吉。",
    },
    url: "https://ascn.asean.org",
  },
  {
    id: "nua",
    name: "New Urban Agenda",
    body: "UN-Habitat III",
    year: "2016",
    pillarMapping: "Livability, Environment",
    desc: {
      en: "Adopted at the United Nations Conference on Housing and Sustainable Urban Development (Habitat III) in Quito. Sets shared vision for sustainable and equitable urban development.",
      th: "รับรองที่การประชุม Habitat III ในกีโต กำหนดวิสัยทัศน์ร่วมสำหรับการพัฒนาเมืองที่ยั่งยืนและเป็นธรรม",
      zh: "在基多的Habitat III会议上通过。设定可持续和公平城市发展的共同愿景。",
    },
    url: "https://habitat3.org/the-new-urban-agenda/",
  },
  {
    id: "aus4asean",
    name: "Aus4ASEAN Smart Cities Trust Fund",
    body: "Australian Government via ADB",
    year: "2019–present",
    pillarMapping: "Economy, Digital, Environment",
    desc: {
      en: "AUD 20.8M trust fund administered by ADB supporting digital, green, and inclusive urban development across ASEAN. Finances feasibility studies, capacity building, and pilot projects. The financial toolkit in this index draws from the ASEAN Smart City Financing Toolkit developed under this program.",
      th: "กองทุนทรัสต์ 20.8 ล้าน AUD บริหารโดย ADB สนับสนุนการพัฒนาเมืองดิจิทัล สีเขียว และมีส่วนร่วมทั่วอาเซียน เครื่องมือทางการเงินในดัชนีนี้อ้างอิงจาก ASEAN Smart City Financing Toolkit ที่พัฒนาภายใต้โครงการนี้",
      zh: "由ADB管理的2080万澳元信托基金，支持东盟数字、绿色和包容性城市发展。本指数的金融工具箱参考了该项目下开发的东盟智慧城市融资工具箱。",
    },
    url: "https://www.adb.org/what-we-do/funds/asean-australia-smart-cities-fund",
  },
];

// ─── API & Data Endpoints ───
const API_ENDPOINTS = [
  {
    name: "Open-Meteo Climate API",
    method: "GET",
    endpoint: "api.open-meteo.com/v1/forecast",
    pillar: "Environment",
    usage: { en: "PM2.5 historical averages, temperature, humidity for environmental scoring", th: "ค่าเฉลี่ย PM2.5 ย้อนหลัง อุณหภูมิ ความชื้น สำหรับคะแนนสิ่งแวดล้อม", zh: "PM2.5历史均值、温度、湿度用于环境评分" },
    url: "https://open-meteo.com/en/docs",
    free: true,
  },
  {
    name: "World Bank Open Data API",
    method: "GET",
    endpoint: "api.worldbank.org/v2/country/THA",
    pillar: "Economy",
    usage: { en: "GDP growth, Gini coefficient, governance indicators for national-level normalization", th: "การเติบโต GDP ค่า Gini ตัวชี้วัดธรรมาภิบาล สำหรับการทำให้เป็นมาตรฐานระดับชาติ", zh: "GDP增长、基尼系数、治理指标用于国家级标准化" },
    url: "https://data.worldbank.org/",
    free: true,
  },
  {
    name: "PCD Air Quality (air4thai)",
    method: "Web scraping",
    endpoint: "air4thai.pcd.go.th/webV3",
    pillar: "Environment",
    usage: { en: "Real-time and annual PM2.5 from 70+ monitoring stations nationwide", th: "PM2.5 เรียลไทม์และรายปีจากสถานี 70+ แห่งทั่วประเทศ", zh: "来自全国70多个监测站的实时和年度PM2.5数据" },
    url: "http://air4thai.pcd.go.th",
    free: true,
  },
  {
    name: "NSO Statistical Data",
    method: "Census / reports",
    endpoint: "nso.go.th",
    pillar: "Wellbeing, Economy",
    usage: { en: "Population, household income, employment rates at provincial level", th: "ประชากร รายได้ครัวเรือน อัตราจ้างงานระดับจังหวัด", zh: "省级人口、家庭收入、就业率" },
    url: "https://www.nso.go.th",
    free: true,
  },
  {
    name: "NESDC GPP Data",
    method: "Reports",
    endpoint: "nesdc.go.th",
    pillar: "Economy",
    usage: { en: "Gross Provincial Product per capita — primary economic output metric", th: "ผลิตภัณฑ์มวลรวมจังหวัดต่อหัว — ตัวชี้วัดเศรษฐกิจหลัก", zh: "人均省内生产总值——主要经济产出指标" },
    url: "https://www.nesdc.go.th",
    free: true,
  },
  {
    name: "GISTDA Satellite Data",
    method: "API / imagery",
    endpoint: "gistda.or.th",
    pillar: "Environment",
    usage: { en: "Satellite-derived green coverage, urban sprawl, land use change analysis", th: "พื้นที่สีเขียว การขยายตัวเมือง วิเคราะห์การเปลี่ยนแปลงการใช้ที่ดิน จากดาวเทียม", zh: "卫星衍生的绿地覆盖率、城市扩张、土地利用变化分析" },
    url: "https://www.gistda.or.th",
    free: true,
  },
  {
    name: "depa City Data Platform",
    method: "Dashboard / API",
    endpoint: "citydata.in.th",
    pillar: "Digital",
    usage: { en: "IoT sensor data, municipal service metrics, citizen engagement from participating smart cities", th: "ข้อมูลเซ็นเซอร์ IoT ตัวชี้วัดบริการเทศบาล จากเมืองอัจฉริยะที่เข้าร่วม", zh: "参与智慧城市的IoT传感器数据、市政服务指标、市民参与数据" },
    url: "https://www.citydata.in.th",
    free: true,
  },
  {
    name: "Copernicus Sentinel Hub",
    method: "API",
    endpoint: "services.sentinel-hub.com",
    pillar: "Environment",
    usage: { en: "Satellite imagery for cross-validating air quality and green coverage data", th: "ภาพถ่ายดาวเทียมสำหรับตรวจสอบร่วมข้อมูลคุณภาพอากาศและพื้นที่สีเขียว", zh: "用于交叉验证空气质量和绿地覆盖数据的卫星影像" },
    url: "https://www.sentinel-hub.com",
    free: false,
  },
  {
    name: "Royal Thai Police Crime Statistics",
    method: "Annual reports",
    endpoint: "rtp.go.th",
    pillar: "Safety",
    usage: { en: "Provincial crime rates per 100,000 population — primary safety metric", th: "อัตราอาชญากรรมระดับจังหวัดต่อ 100,000 ประชากร — ตัวชี้วัดความปลอดภัยหลัก", zh: "每10万人省级犯罪率——主要安全指标" },
    url: "https://www.rtp.go.th",
    free: true,
  },
  {
    name: "ASEAN Smart City Financing Toolkit",
    method: "Reference",
    endpoint: "smartcitytoolkit.asean.org",
    pillar: "All (Finance)",
    usage: { en: "15 financial instruments for smart city investment — PPP, green bonds, LVC, BOT, blended finance, and more. Developed under Aus4ASEAN program.", th: "15 เครื่องมือทางการเงินสำหรับลงทุนเมืองอัจฉริยะ พัฒนาภายใต้โครงการ Aus4ASEAN", zh: "15种智慧城市投资金融工具——在Aus4ASEAN项目下开发。" },
    url: "https://smartcitytoolkit.asean.org",
    free: true,
  },
];

// ─── Legal & License ───
const LEGAL_ITEMS = [
  {
    title: { en: "Data License", th: "สัญญาอนุญาตข้อมูล", zh: "数据许可" },
    body: {
      en: "All index data, scores, and rankings are published under the Creative Commons Attribution 4.0 International License (CC BY 4.0). You are free to share, adapt, and build upon this data for any purpose, including commercial use, provided you give appropriate credit and indicate changes made.",
      th: "ข้อมูลดัชนี คะแนน และอันดับทั้งหมดเผยแพร่ภายใต้ Creative Commons Attribution 4.0 International License (CC BY 4.0) ท่านสามารถแชร์ ดัดแปลง และต่อยอดได้ทุกวัตถุประสงค์ รวมถึงเชิงพาณิชย์ โดยให้เครดิตอย่างเหมาะสมและระบุการเปลี่ยนแปลง",
      zh: "所有指数数据、评分和排名均以知识共享署名4.0国际许可协议(CC BY 4.0)发布。您可以自由分享、改编和使用这些数据，但需注明出处和所做更改。",
    },
    url: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: { en: "Methodology Copyright", th: "ลิขสิทธิ์วิธีการ", zh: "方法论版权" },
    body: {
      en: "The SLIC (Smart Liveable Cities Index) methodology, pillar definitions, weighting system, and tier classification framework are intellectual property of the SLIC research team. The methodology may be cited and referenced with attribution per academic convention. Derivative indices must clearly distinguish themselves from the original SLIC framework.",
      th: "วิธีการ SLIC คำจำกัดความเสาหลัก ระบบน้ำหนัก และกรอบจัดระดับเป็นทรัพย์สินทางปัญญาของทีมวิจัย SLIC สามารถอ้างอิงโดยให้เครดิตตามหลักวิชาการ ดัชนีที่พัฒนาต่อยอดต้องระบุให้ชัดเจนว่าแตกต่างจากกรอบ SLIC ต้นฉบับ",
      zh: "SLIC方法论、支柱定义、权重系统和层级分类框架是SLIC研究团队的知识产权。引用时需按学术惯例注明出处。衍生指数必须与原始SLIC框架明确区分。",
    },
  },
  {
    title: { en: "Institutional Affiliation", th: "สังกัดสถาบัน", zh: "机构隶属" },
    body: {
      en: "This index is developed in collaboration with the Digital Economy Promotion Agency (depa), Ministry of Digital Economy and Society (MDES), Kingdom of Thailand. Official smart city certification data is sourced from depa's Smart City Thailand program. The index operates independently for scoring and assessment purposes.",
      th: "ดัชนีนี้จัดทำร่วมกับสำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม ข้อมูลการรับรองเมืองอัจฉริยะจาก Smart City Thailand ดัชนีดำเนินการอย่างอิสระในด้านการให้คะแนนและประเมิน",
      zh: "本指数与数字经济促进局(depa)、数字经济与社会部(MDES)合作开发。认证数据来自depa智慧城市泰国项目。指数在评分和评估方面独立运作。",
    },
  },
  {
    title: { en: "Disclaimer", th: "ข้อจำกัดความรับผิดชอบ", zh: "免责声明" },
    body: {
      en: "Scores are computed from publicly available data and reflect conditions at the time of assessment. They are designed as a transparency and benchmarking tool, not as investment advice or official government ratings. Individual city conditions may change between assessment cycles. Users should conduct their own due diligence before making decisions based on this data. Financial instrument recommendations are informational and do not constitute financial advice.",
      th: "คะแนนคำนวณจากข้อมูลสาธารณะ สะท้อนสภาพ ณ เวลาที่ประเมิน ออกแบบเป็นเครื่องมือความโปร่งใสและเปรียบเทียบ ไม่ใช่คำแนะนำการลงทุนหรือการจัดอันดับของรัฐบาล สภาพเมืองอาจเปลี่ยนแปลงระหว่างรอบการประเมิน ผู้ใช้ควรตรวจสอบข้อมูลด้วยตนเองก่อนตัดสินใจ คำแนะนำเครื่องมือทางการเงินเป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการเงิน",
      zh: "评分基于公开数据计算，反映评估时的状况。本工具用于透明度和基准比较，不构成投资建议或官方政府评级。城市状况可能在评估周期之间发生变化。用户应在做出决策前自行尽职调查。金融工具推荐仅供参考，不构成财务建议。",
    },
  },
  {
    title: { en: "Third-Party Data Attribution", th: "การระบุแหล่งข้อมูลบุคคลที่สาม", zh: "第三方数据归属" },
    body: {
      en: "This index incorporates data from NSO Thailand, NESDC, World Bank, ADB, Open-Meteo (Copernicus Atmosphere Monitoring Service), GISTDA, Royal Thai Police, PCD (air4thai), DOPA, and depa citydata.in.th. Each source retains its respective licensing terms. Satellite imagery is processed under Copernicus Sentinel Hub license. Financial toolkit references are based on the ASEAN Smart City Financing Toolkit (smartcitytoolkit.asean.org) developed under the Aus4ASEAN Smart Cities Trust Fund administered by ADB.",
      th: "ดัชนีนี้ใช้ข้อมูลจาก สถิติแห่งชาติ สศช. ธนาคารโลก ADB Open-Meteo GISTDA ตำรวจแห่งชาติ กรมควบคุมมลพิษ กรมการปกครอง และ citydata.in.th แต่ละแหล่งยังคงเงื่อนไขอนุญาตของตน เครื่องมือทางการเงินอ้างอิงจาก ASEAN Smart City Financing Toolkit ภายใต้ Aus4ASEAN",
      zh: "本指数纳入来自NSO、NESDC、世界银行、ADB、Open-Meteo、GISTDA、泰国皇家警察、PCD、DOPA和depa citydata.in.th的数据。各来源保留其各自的许可条款。金融工具箱参考基于Aus4ASEAN下的东盟智慧城市融资工具箱。",
    },
  },
];

// ─── Live weight verification ───
const EXAMPLE_SCORES: CityScores = {
  livability: 72,
  economy: 65,
  safety: 58,
  wellbeing: 68,
  environment: 55,
  hospitality: 63,
  digital: 48,
};

export default function ReferencesPage({ locale, onNavigate }: Props) {
  // Live calculation proof
  const weightSum = SCORING_PILLARS.reduce((s, p) => s + PILLAR_WEIGHTS[p], 0);
  const exampleComposite = computeComposite(EXAMPLE_SCORES);
  const exampleTier = assignTier(exampleComposite);
  const exampleTerms = SCORING_PILLARS.map(p => ({
    pillar: p,
    score: EXAMPLE_SCORES[p],
    weight: PILLAR_WEIGHTS[p],
    contribution: roundScore((EXAMPLE_SCORES[p] * PILLAR_WEIGHTS[p]) / 100),
  }));

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section rankings-hero">
        <p className="eyebrow">{t(locale, { en: "Reference", th: "อ้างอิง", zh: "参考" })}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
          {t(locale, {
            en: "APIs, Data Sources & Standards",
            th: "API แหล่งข้อมูล และมาตรฐาน",
            zh: "API、数据来源与标准",
          })}
        </h1>
        <p className="hero-strapline">
          {t(locale, {
            en: "Every score in this index has a source. Every claim has evidence. This page documents every API, dataset, standard, financial instrument, and legal term used in the system.",
            th: "ทุกคะแนนในดัชนีนี้มีแหล่งที่มา ทุกคำกล่าวอ้างมีหลักฐาน หน้านี้รวบรวม API ชุดข้อมูล มาตรฐาน เครื่องมือทางการเงิน และเงื่อนไขทางกฎหมายทั้งหมดที่ใช้ในระบบ",
            zh: "本指数中每一项评分都有出处，每一个论断都有证据。本页记录系统使用的所有API、数据集、标准、金融工具和法律条款。",
          })}
        </p>
      </section>

      {/* ─── SCORING FORMULA + LIVE PROOF ─── */}
      <section className="section ref-section">
        <p className="eyebrow">{t(locale, { en: "Scoring system", th: "ระบบคะแนน", zh: "评分系统" })}</p>
        <h2>{t(locale, { en: "Composite Score Formula", th: "สมการคะแนนรวม", zh: "综合评分公式" })}</h2>
        <div className="ref-formula-card">
          <div className="ref-formula-display">
            <span className="ref-formula-text">Composite = Σ (Pillar<sub>i</sub> × Weight<sub>i</sub>) ÷ Σ Weight<sub>i</sub></span>
          </div>
          <div className="ref-pillar-weight-grid">
            {SCORING_PILLARS.map(p => (
              <div key={p} className="ref-pillar-weight-item">
                <div className="ref-pillar-weight-bar">
                  <div className="ref-pillar-weight-fill" style={{ width: `${PILLAR_WEIGHTS[p]}%`, background: PILLAR_COLORS[p] }} />
                </div>
                <span className="ref-pillar-weight-name">{PILLAR_LABELS[locale][p]}</span>
                <span className="ref-pillar-weight-value">{PILLAR_WEIGHTS[p]}%</span>
              </div>
            ))}
          </div>

          {/* Weight checksum */}
          <div className="ref-checksum">
            <span className="ref-checksum-label">{t(locale, { en: "Weight checksum", th: "ผลรวมน้ำหนัก", zh: "权重校验和" })}</span>
            <span className="ref-checksum-value" style={{ color: weightSum === 100 ? "var(--alpha)" : "var(--gamma)" }}>
              {SCORING_PILLARS.map(p => PILLAR_WEIGHTS[p]).join(" + ")} = {weightSum}%
              {weightSum === 100 ? " ✓" : " ✗"}
            </span>
          </div>

          <div className="ref-tier-thresholds">
            <div className="ref-tier-item ref-tier-alpha"><span className="ref-tier-symbol">α</span> Alpha ≥ 65</div>
            <div className="ref-tier-item ref-tier-beta"><span className="ref-tier-symbol">β</span> Beta 45–64</div>
            <div className="ref-tier-item ref-tier-gamma"><span className="ref-tier-symbol">γ</span> Gamma &lt; 45</div>
          </div>

          {/* Live calculation example */}
          <div className="ref-proof">
            <p className="ref-proof-title">{t(locale, { en: "Live calculation proof", th: "การพิสูจน์การคำนวณสด", zh: "实时计算验证" })}</p>
            <div className="ref-proof-table">
              <div className="ref-proof-header">
                <span>{t(locale, { en: "Pillar", th: "เสาหลัก", zh: "支柱" })}</span>
                <span>{t(locale, { en: "Score", th: "คะแนน", zh: "分数" })}</span>
                <span>{t(locale, { en: "Weight", th: "น้ำหนัก", zh: "权重" })}</span>
                <span>{t(locale, { en: "Contribution", th: "สัดส่วน", zh: "贡献" })}</span>
              </div>
              {exampleTerms.map(term => (
                <div key={term.pillar} className="ref-proof-row">
                  <span style={{ color: PILLAR_COLORS[term.pillar] }}>{PILLAR_LABELS[locale][term.pillar]}</span>
                  <span>{term.score}</span>
                  <span>{term.weight}%</span>
                  <span>{term.contribution}</span>
                </div>
              ))}
              <div className="ref-proof-result">
                <span>{t(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合分" })}</span>
                <span className="ref-proof-composite">{exampleComposite}</span>
                <span className={`tier-badge tier-${exampleTier}`}>{exampleTier.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <p className="ref-formula-note">
            {t(locale, {
              en: "Each pillar is scored 0–100 from verifiable data sources. The composite is a weighted average. Tier assignment is automatic based on composite thresholds. All weights sum to 100%. The calculation above runs live from the same scoring engine used for every city in the index.",
              th: "เสาหลักแต่ละด้านได้คะแนน 0–100 จากแหล่งข้อมูลที่ตรวจสอบได้ คะแนนรวมเป็นค่าเฉลี่ยถ่วงน้ำหนัก ระดับถูกกำหนดอัตโนมัติตามเกณฑ์ การคำนวณข้างบนรันสดจาก scoring engine เดียวกับที่ใช้กับทุกเมือง",
              zh: "各支柱从可验证数据源获得0-100分。综合分为加权平均。层级根据综合分阈值自动分配。以上计算使用与所有城市相同的评分引擎实时运行。",
            })}
          </p>
        </div>
      </section>

      {/* ─── DATA SOURCES ─── */}
      <section className="section ref-section">
        <p className="eyebrow">{t(locale, { en: "Data provenance", th: "แหล่งข้อมูล", zh: "数据溯源" })}</p>
        <h2>{t(locale, { en: "Primary Data Sources", th: "แหล่งข้อมูลหลัก", zh: "主要数据来源" })}</h2>
        <p className="section-intro">
          {t(locale, {
            en: "11 authoritative sources covering government statistics, satellite imagery, international benchmarks, and field observations.",
            th: "11 แหล่งข้อมูลหลักครอบคลุมสถิติราชการ ภาพถ่ายดาวเทียม เกณฑ์มาตรฐานสากล และการสำรวจภาคสนาม",
            zh: "11个权威来源，涵盖政府统计、卫星影像、国际基准和实地观察。",
          })}
        </p>
        <div className="sources-grid">
          {dataSources.map(source => (
            <article key={source.id} className="source-card">
              <p className="source-card-type">{source.type.toUpperCase()}</p>
              <h3 className="source-card-name">{source.name}</h3>
              <p className="source-card-desc">
                {locale === "th" ? source.descTh : locale === "zh" ? source.descZh : source.descEn}
              </p>
              <p className="source-card-freq">{source.updateFrequency}</p>
              {source.url && (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="ref-source-link">
                  {source.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ─── API ENDPOINTS ─── */}
      <section className="section ref-section">
        <p className="eyebrow">{t(locale, { en: "Technical", th: "เทคนิค", zh: "技术" })}</p>
        <h2>{t(locale, { en: "API & Data Endpoints", th: "API และจุดเชื่อมต่อข้อมูล", zh: "API与数据端点" })}</h2>
        <div className="ref-api-table">
          <div className="ref-api-header">
            <span>{t(locale, { en: "Source", th: "แหล่ง", zh: "来源" })}</span>
            <span>{t(locale, { en: "Method", th: "วิธี", zh: "方法" })}</span>
            <span>{t(locale, { en: "Pillar", th: "เสาหลัก", zh: "支柱" })}</span>
            <span>{t(locale, { en: "Usage", th: "การใช้งาน", zh: "用途" })}</span>
          </div>
          {API_ENDPOINTS.map(api => (
            <div key={api.name} className="ref-api-row">
              <span className="ref-api-name">
                <a href={api.url} target="_blank" rel="noopener noreferrer">{api.name}</a>
                {api.free && <span className="ref-api-free">FREE</span>}
              </span>
              <span className="ref-api-method">{api.method}</span>
              <span className="ref-api-pillar">{api.pillar}</span>
              <span className="ref-api-usage">{t(locale, api.usage)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INTERNATIONAL STANDARDS ─── */}
      <section className="section ref-section">
        <p className="eyebrow">{t(locale, { en: "Alignment", th: "การเทียบเคียง", zh: "对齐" })}</p>
        <h2>{t(locale, { en: "International Standards & Frameworks", th: "มาตรฐานและกรอบสากล", zh: "国际标准与框架" })}</h2>
        <div className="ref-standards-grid">
          {STANDARDS.map(std => (
            <article key={std.id} className="ref-standard-card">
              <div className="ref-standard-header">
                <h3 className="ref-standard-name">{std.name}</h3>
                <span className="ref-standard-year">{std.year}</span>
              </div>
              <p className="ref-standard-body-name">{std.body}</p>
              <p className="ref-standard-mapping">{t(locale, { en: "Maps to: ", th: "เชื่อมกับ: ", zh: "映射到: " })}{std.pillarMapping}</p>
              <p className="ref-standard-desc">{t(locale, std.desc)}</p>
              {std.url && (
                <a href={std.url} target="_blank" rel="noopener noreferrer" className="ref-source-link">
                  {t(locale, { en: "View standard", th: "ดูมาตรฐาน", zh: "查看标准" })} →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ─── FINANCIAL TOOLKIT ─── */}
      <section className="section ref-section">
        <p className="eyebrow">{t(locale, { en: "Finance", th: "การเงิน", zh: "金融" })}</p>
        <h2>{t(locale, { en: "ASEAN Smart City Financial Toolkit", th: "ชุดเครื่องมือการเงินเมืองอัจฉริยะอาเซียน", zh: "东盟智慧城市金融工具箱" })}</h2>
        <p className="section-intro">
          {t(locale, {
            en: "15 financial instruments mapped to city tiers, development stages, and pillar gaps. Based on the ASEAN Smart City Financing Toolkit (smartcitytoolkit.asean.org) developed under the Aus4ASEAN Smart Cities Trust Fund (ADB) and supplemented by ADB/OECD infrastructure finance research.",
            th: "15 เครื่องมือทางการเงินเชื่อมโยงกับระดับเมือง ระยะพัฒนา และช่องว่างเสาหลัก อ้างอิงจาก ASEAN Smart City Financing Toolkit (smartcitytoolkit.asean.org) ภายใต้ Aus4ASEAN Smart Cities Trust Fund (ADB) เสริมด้วยงานวิจัยโครงสร้างพื้นฐาน ADB/OECD",
            zh: "15种金融工具对应城市层级、发展阶段和支柱差距。基于Aus4ASEAN Smart Cities Trust Fund (ADB)下的东盟智慧城市融资工具箱(smartcitytoolkit.asean.org)及ADB/OECD基础设施融资研究。",
          })}
        </p>

        {/* Quick summary strip */}
        <div className="ref-finance-summary">
          <div className="ref-finance-summary-item">
            <span className="ref-finance-summary-value">{instruments.length}</span>
            <span className="ref-finance-summary-label">{t(locale, { en: "Instruments", th: "เครื่องมือ", zh: "工具" })}</span>
          </div>
          <div className="ref-finance-summary-item">
            <span className="ref-finance-summary-value">{instruments.filter(i => i.category === "debt").length}</span>
            <span className="ref-finance-summary-label">{t(locale, { en: "Debt", th: "หนี้สิน", zh: "债务" })}</span>
          </div>
          <div className="ref-finance-summary-item">
            <span className="ref-finance-summary-value">{instruments.filter(i => i.category === "equity").length}</span>
            <span className="ref-finance-summary-label">{t(locale, { en: "Equity", th: "ทุน", zh: "股权" })}</span>
          </div>
          <div className="ref-finance-summary-item">
            <span className="ref-finance-summary-value">{instruments.filter(i => i.category === "grant").length}</span>
            <span className="ref-finance-summary-label">{t(locale, { en: "Grant", th: "ให้เปล่า", zh: "赠款" })}</span>
          </div>
          <div className="ref-finance-summary-item">
            <span className="ref-finance-summary-value">{instruments.filter(i => i.category === "innovative").length}</span>
            <span className="ref-finance-summary-label">{t(locale, { en: "Innovative", th: "นวัตกรรม", zh: "创新" })}</span>
          </div>
          <div className="ref-finance-summary-item">
            <span className="ref-finance-summary-value">{instruments.filter(i => i.category === "hybrid").length}</span>
            <span className="ref-finance-summary-label">{t(locale, { en: "Hybrid", th: "ผสมผสาน", zh: "混合" })}</span>
          </div>
        </div>

        <div className="ref-finance-grid">
          {instruments.map(inst => (
            <article key={inst.id} className="ref-finance-card">
              <div className="ref-finance-header">
                <span className={`ref-finance-category ref-cat-${inst.category}`}>{inst.category}</span>
                <span className="ref-finance-complexity">{inst.complexity}</span>
              </div>
              <h3 className="ref-finance-name">{locale === "th" ? inst.nameTh : inst.name}</h3>
              <p className="ref-finance-desc">{locale === "th" ? inst.descTh : inst.descEn}</p>
              <div className="ref-finance-meta">
                <span className="ref-finance-size">{inst.typicalSize}</span>
                <span className="ref-finance-tiers">
                  {inst.applicableTiers.map(tier => (
                    <span key={tier} className={`tier-badge tier-${tier}`}>{tier[0].toUpperCase()}</span>
                  ))}
                </span>
              </div>
              <p className="ref-finance-thai">{inst.thaiRelevance}</p>
              {inst.aseanExample && (
                <p className="ref-finance-example">
                  <strong>ASEAN:</strong> {inst.aseanExample}
                </p>
              )}
              {inst.sourceUrl && (
                <a href={inst.sourceUrl} target="_blank" rel="noopener noreferrer" className="ref-source-link">
                  {t(locale, { en: "Source", th: "แหล่งอ้างอิง", zh: "来源" })} →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ─── LEGAL & LICENSE ─── */}
      <section className="section ref-section">
        <p className="eyebrow">{t(locale, { en: "Legal", th: "กฎหมาย", zh: "法律" })}</p>
        <h2>{t(locale, { en: "License, Copyright & Disclaimer", th: "สัญญาอนุญาต ลิขสิทธิ์ และข้อจำกัดความรับผิดชอบ", zh: "许可、版权与免责声明" })}</h2>
        <div className="ref-legal-grid">
          {LEGAL_ITEMS.map((item, i) => (
            <article key={i} className="ref-legal-card">
              <h3 className="ref-legal-title">{t(locale, item.title)}</h3>
              <p className="ref-legal-body">{t(locale, item.body)}</p>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="ref-source-link">
                  {t(locale, { en: "View license", th: "ดูสัญญาอนุญาต", zh: "查看许可" })} →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section ref-section">
        <div className="callout-card" style={{ borderLeftColor: "var(--teal)" }}>
          <h2>{t(locale, { en: "Built on open data. Fully auditable.", th: "สร้างจากข้อมูลเปิด ตรวจสอบได้ทั้งหมด", zh: "基于开放数据构建。完全可审计。" })}</h2>
          <p>
            {t(locale, {
              en: "If you find a data error, a broken source link, or a scoring discrepancy — we want to know. Transparency is not a slogan; it is an operating principle.",
              th: "หากคุณพบข้อมูลผิดพลาด ลิงก์แหล่งข้อมูลเสีย หรือความไม่สอดคล้องของคะแนน — เราอยากรู้ ความโปร่งใสไม่ใช่สโลแกน แต่เป็นหลักการทำงาน",
              zh: "如果您发现数据错误、失效的来源链接或评分差异——我们希望知道。透明不是口号，而是运营原则。",
            })}
          </p>
          <div className="story-closing-actions" style={{ marginTop: ".75rem" }}>
            <button type="button" className="cta-button" onClick={() => onNavigate("/methodology")}>
              {t(locale, { en: "View methodology", th: "ดูวิธีการ", zh: "查看方法论" })}
            </button>
            <button type="button" className="ghost-button" onClick={() => onNavigate("/audit")}>
              {t(locale, { en: "View audit", th: "ดูการตรวจสอบ", zh: "查看审计" })}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
