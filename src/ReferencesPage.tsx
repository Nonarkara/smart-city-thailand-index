import { CDP_PLATFORM_COUNT, EVIDENCE_SOURCE_FAMILY_COUNT, SCITI_DATA_CUTOFF_ISO, SCITI_METHOD_CODE, TIER_THRESHOLDS } from "./methodologySpec";
import { SCORING_PILLARS } from "./scoring";
import { PILLAR_LABELS, PILLAR_WEIGHTS, PILLAR_COLORS } from "./types";
import { WIKIMEDIA_PHOTO_CREDITS } from "./photoCredits";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
}

interface LocalizedItem {
  en: string;
  th: string;
  zh: string;
}

function t(locale: Locale, copy: LocalizedItem): string {
  return locale === "th" ? copy.th : locale === "zh" ? copy.zh : copy.en;
}

// ─── DOMAIN CATEGORIES ───
const DOMAINS = {
  economic: { en: "Economic & Productivity", th: "เศรษฐกิจและผลิตภาพ", zh: "经济与生产力", color: "var(--gold-text, #946B0C)" },
  environmental: { en: "Environmental & Climate", th: "สิ่งแวดล้อมและสภาพภูมิอากาศ", zh: "环境与气候", color: "var(--wada-green, #009465)" },
  social: { en: "Social & Wellbeing", th: "สังคมและความเป็นอยู่", zh: "社会与福祉", color: "var(--wada-blue, #1c4286)" },
  digital: { en: "Digital & Infrastructure", th: "ดิจิทัลและโครงสร้างพื้นฐาน", zh: "数字与基础设施", color: "var(--wada-antwarp, #007190)" },
};

// ─── API & Data Endpoints (Categorized) ───
const API_ENDPOINTS = [
  {
    name: "NSO Statistical Data",
    domain: "economic",
    endpoint: "nso.go.th",
    usage: { en: "Provincial income, employment, and household demographics", th: "รายได้จังหวัด การจ้างงาน และประชากรศาสตร์ครัวเรือน", zh: "省级收入、就业和家庭人口统计" },
    url: "https://www.nso.go.th",
    auditTrail: "Available via NSO Data Catalog",
  },
  {
    name: "NESDC GPP Data",
    domain: "economic",
    endpoint: "nesdc.go.th",
    usage: { en: "Gross Provincial Product (GPP) per capita — core economic output", th: "ผลิตภัณฑ์มวลรวมจังหวัด (GPP) ต่อหัว — ผลผลิตเศรษฐกิจหลัก", zh: "人均省内生产总值 (GPP) —— 核心经济产出" },
    url: "https://www.nesdc.go.th",
    auditTrail: "Annual publication series",
  },
  {
    name: "Open-Meteo Climate API",
    domain: "environmental",
    endpoint: "api.open-meteo.com/v1",
    usage: { en: "Historical PM2.5, temperature, and climate risk modeling", th: "ข้อมูล PM2.5 ย้อนหลัง อุณหภูมิ และโมเดลความเสี่ยงสภาพภูมิอากาศ", zh: "历史 PM2.5、温度和气候风险建模" },
    url: "https://open-meteo.com",
    auditTrail: "Live JSON feed / Historical Archiv",
  },
  {
    name: "GISTDA Satellite",
    domain: "environmental",
    endpoint: "gistda.or.th",
    usage: { en: "Urban green coverage and land-use change detection", th: "พื้นที่สีเขียวในเมืองและการตรวจจับการเปลี่ยนแปลงการใช้ที่ดิน", zh: "城市绿地覆盖率和土地利用变化检测" },
    url: "https://www.gistda.or.th",
    auditTrail: "Copernicus/Sentinel-2 derived imagery",
  },
  {
    name: "Royal Thai Police",
    domain: "social",
    endpoint: "rtp.go.th",
    usage: { en: "Reported crime rates per 100,000 residents", th: "อัตราอาชญากรรมที่รายงานต่อ 100,000 ประชากร", zh: "每 10 万名居民的报告犯罪率" },
    url: "https://www.rtp.go.th",
    auditTrail: "Official Annual Statistics",
  },
  {
    name: "depa City Platform",
    domain: "digital",
    endpoint: "citydata.in.th",
    usage: { en: "IoT deployment counts, digital service adoption, and open data maturity", th: "จำนวนการติดตั้ง IoT การใช้บริการดิจิทัล และความพร้อมของข้อมูลเปิด", zh: "IoT 部署数量、数字服务采用率和开放数据成熟度" },
    url: "https://www.citydata.in.th",
    auditTrail: "City-level API dashboards",
  },
];

interface DeliveryEvidence {
  citation: string;
  urls: string[];
  scope: LocalizedItem;
  finding: LocalizedItem;
  provenance: LocalizedItem;
}

const DELIVERY_EVIDENCE_REGISTRY: DeliveryEvidence[] = [
  {
    citation: "World Bank (2024)",
    urls: ["https://documents1.worldbank.org/curated/en/099062924133030977/pdf/P50100914f725005f1b9211803e7e17020a.pdf"],
    scope: { en: "Urban Infrastructure Financing", th: "การเงินโครงสร้างพื้นฐานเมือง", zh: "城市基础设施融资" },
    finding: {
      en: "In 2022, local authorities excluding Bangkok and Pattaya collected THB44.8B locally out of THB584.5B total revenue. A five-city assessment found three of 26 concepts nearly ready to solicit PPP proposals. These historical findings do not establish current financing eligibility.",
      th: "ปี 2565 อปท. ไม่รวมกรุงเทพฯ และพัทยา จัดเก็บเอง 44.8 พันล้านจากรายได้รวม 584.5 พันล้านบาท การประเมินห้าเมืองพบว่าสามจาก 26 แนวคิดเกือบพร้อมเปิดรับข้อเสนอ PPP ผลในอดีตนี้ไม่ยืนยันสิทธิหรือความพร้อมทางการเงินปัจจุบัน",
      zh: "2022年，不含曼谷及芭提雅的地方政府总收入5845亿泰铢，自筹448亿。五城评估中，26项构想仅三项接近征集PPP方案的准备阶段。这些历史发现不能证明当前融资资格。",
    },
    provenance: {
      en: "World Bank diagnostic assessment using audited Department of Local Administration (DLA) municipal accounts",
      th: "การประเมินวินิจฉัยของธนาคารโลกจากบัญชีตรวจสอบของกรมส่งเสริมการปกครองท้องถิ่น (สถ.)",
      zh: "世界银行基于泰国地方行政厅 (DLA) 审计市政账目所得的诊断评估",
    },
  },
  {
    citation: "Hansen & Dahiya (2025)",
    urls: ["https://doi.org/10.3389/frsc.2025.1491621"],
    scope: { en: "Bangkok Civic Incident Dispatch", th: "การจัดการเรื่องร้องทุกข์เมืองกรุงเทพฯ", zh: "曼谷市民报修调度实证" },
    finding: {
      en: "A Bangkok case study analyzed about 98,000 Traffy Fondue reports from a nine-month window alongside stakeholder interviews. The authors identify the short observation period and single-city scope as limits; this does not verify current response performance in every municipality.",
      th: "กรณีศึกษากรุงเทพฯ วิเคราะห์รายงาน Traffy Fondue ประมาณ 98,000 รายการในเก้าเดือนร่วมกับการสัมภาษณ์ ผู้เขียนระบุข้อจำกัดของระยะเวลาสั้นและพื้นที่ศึกษาเมืองเดียว ไม่ยืนยันประสิทธิภาพการตอบสนองปัจจุบันของทุกเทศบาล",
      zh: "此曼谷个案分析约九个月内98,000条Traffy Fondue报告并访谈相关人员。作者明确指出短期窗口和单城范围的限制；这不能核实各市镇当前响应表现。",
    },
    provenance: {
      en: "Peer-reviewed Bangkok case study in Frontiers in Sustainable Cities; nine-month data window",
      th: "กรณีศึกษากรุงเทพฯ ผ่านการประเมินใน Frontiers in Sustainable Cities ใช้ข้อมูลเก้าเดือน",
      zh: "《Frontiers in Sustainable Cities》同行评议曼谷个案研究，数据窗口九个月",
    },
  },
  {
    citation: "World Bank & BMA (2025)",
    urls: ["https://documents1.worldbank.org/curated/en/099032525024532810/pdf/P181082-9cc5dd2a-bc60-49ed-a145-c3a8621dc1f4.pdf"],
    scope: { en: "Bangkok Urban Heat Mortality", th: "ความเสี่ยงการเสียชีวิตจากความร้อนในกรุงเทพฯ", zh: "曼谷城市热致死风险情景" },
    finding: {
      en: "A Bangkok heat scenario estimates 827–1,158 additional annual deaths under a 1°C rise against a 2019 baseline (World Bank & BMA, 2025); this is modeled, not an observed death count.",
      th: "สถานการณ์จำลองกรุงเทพฯ ประเมินผู้เสียชีวิตเพิ่ม 827–1,158 คนต่อปีหากอุณหภูมิเพิ่ม 1°C เทียบฐานปี 2562 (ธนาคารโลกและ กทม., 2025) ไม่ใช่ยอดเสียชีวิตที่สังเกตจริง",
      zh: "曼谷情景模型估计，相对2019年基线升温1°C，每年可能增加827–1,158例死亡（世行与BMA，2025）；这是模型结果，并非观测死亡人数。",
    },
    provenance: {
      en: "Joint World Bank & Bangkok Metropolitan Administration (BMA) technical climate assessment",
      th: "การประเมินทางเทคนิคสภาพภูมิอากาศร่วมระหว่างธนาคารโลกและกรุงเทพมหานคร",
      zh: "世界银行与曼谷市政府 (BMA) 联合气候技术评估",
    },
  },
  {
    citation: "Sapbamrer et al. (2024)",
    urls: ["https://doi.org/10.3390/toxics12050321"],
    scope: { en: "Northern Haze & Clinical Outcomes", th: "หมอกควันภาคเหนือและผลลัพธ์ทางคลินิก", zh: "北部雾霾与临床重症关联" },
    finding: {
      en: "Ecological epidemiology across eight upper-northern provinces (2013–2022) linking dry-season PM2.5 haze episodes with marked increases in COPD hospitalization readmissions and fatalities.",
      th: "ระบาดวิทยาเชิงนิเวศวิทยาทั่ว 8 จังหวัดภาคเหนือตอนบน (2556–2565) เชื่อมโยงช่วงหมอกควัน PM2.5 หน้าแล้งกับการกำเริบซ้ำจนต้องนอนโรงพยาบาลและเสียชีวิตจากโรคปอดอุดกั้นเรื้อรัง (COPD)",
      zh: "涵盖泰国北部八个省份（2013–2022）的生态流行病学研究，将旱季 PM2.5 雾霾期与慢性阻塞性肺病 (COPD) 再入院及死亡率显著上升直接关联。",
    },
    provenance: {
      en: "Clinical epidemiology published in Toxics (MDPI)",
      th: "ระบาดวิทยาคลินิกตีพิมพ์ในวารสาร Toxics (MDPI)",
      zh: "发表于《Toxics》(MDPI) 的临床流行病学实证",
    },
  },
  {
    citation: "Soonthornrangsan et al. (2025)",
    urls: ["https://doi.org/10.1111/gwat.13443"],
    scope: { en: "Bangkok Groundwater & Land Subsidence", th: "น้ำบาดาลและแผ่นดินทรุดในกรุงเทพฯ", zh: "曼谷地下水与地面沉降" },
    finding: {
      en: "Bangkok modeling links groundwater withdrawal and clay-layer compaction to land subsidence (Soonthornrangsan et al., 2025). This study does not establish a current street-level flood depth or alert; dashboards cannot replace catchment engineering.",
      th: "แบบจำลองกรุงเทพฯ เชื่อมการสูบน้ำบาดาลและการอัดตัวของชั้นดินเหนียวกับแผ่นดินทรุด (Soonthornrangsan และคณะ, 2025) ไม่ได้ระบุความลึกน้ำท่วมถนนหรือคำเตือนปัจจุบัน แดชบอร์ดไม่แทนงานวิศวกรรมลุ่มน้ำ",
      zh: "曼谷模型将地下水抽取及黏土层压实与地面沉降相联系（Soonthornrangsan等，2025）。该研究并不提供当前街道洪水深度或警报；仪表盘不能替代流域工程。",
    },
    provenance: {
      en: "Groundwater-pumping and subsidence modeling in Groundwater; not a current flood-warning feed",
      th: "แบบจำลองการสูบน้ำบาดาลและแผ่นดินทรุดใน Groundwater ไม่ใช่ข้อมูลเตือนน้ำท่วมปัจจุบัน",
      zh: "《Groundwater》地下水抽取与沉降模型；并非当前洪水预警数据",
    },
  },
  {
    citation: "NSO (2025) · World Bank & EEF (2024)",
    urls: ["https://www.nso.go.th/public/e-book/Statistical-Yearbook/SYB-2025/60/", "https://www.worldbank.org/en/country/thailand/publication/fostering-foundational-skills-in-thailand"],
    scope: { en: "Demographics & Digital Inclusion Reality", th: "ประชากรศาสตร์และความจริงของการเข้าถึงดิจิทัล", zh: "人口学与数字包容现实" },
    finding: {
      en: "NSO reports 89.7% internet use among people aged 6+ in 2024. A separate World Bank/EEF assessment found 74.1% of 15–64-year-olds below foundational digital-skills thresholds (2024 report). These different populations should not be treated as one measure; retain phone and in-person assistance.",
      th: "สสช. รายงานการใช้อินเทอร์เน็ต 89.7% ในคนอายุ 6 ปีขึ้นไปปี 2567 การประเมินอีกชุดของธนาคารโลกและ กสศ. พบว่า 74.1% ของคนอายุ 15–64 ปีมีทักษะดิจิทัลต่ำกว่าเกณฑ์ (รายงาน 2024) ประชากรสองชุดนี้ไม่ใช่มาตรวัดเดียวกัน ควรคงโทรศัพท์และบริการพบหน้า",
      zh: "NSO报告2024年6岁以上人群互联网使用率为89.7%。另一项世行与EEF评估发现，15–64岁人群中74.1%低于基础数字技能门槛（2024年报告）。不同人口范围不能混为一个指标；应保留电话及线下协助。",
    },
    provenance: {
      en: "NSO Statistical Yearbook 2025 (2024 internet use) and World Bank/EEF 2024 foundational-skills report; different populations",
      th: "สถิติรายปี สสช. 2568 (การใช้อินเทอร์เน็ตปี 2567) และรายงานทักษะพื้นฐานธนาคารโลก/กสศ. 2024 ประชากรต่างชุด",
      zh: "NSO 2025统计年鉴（2024年互联网使用）及世行/EEF 2024基础技能报告；人口范围不同",
    },
  },
];

export default function ReferencesPage({ locale }: Props) {
  return (
    <div className="references-page">
      <section className="section rankings-hero reveal visible">
        <p className="eyebrow">{t(locale, { en: "Transparency", th: "ความโปร่งใส", zh: "透明度" })}</p>
        <h1 className="hero-title">{t(locale, { en: "Audit Trail & References", th: "ร่องรอยการตรวจสอบและแหล่งอ้างอิง", zh: "审计轨迹与参考资料" })}</h1>
        <p className="hero-strapline">
          {t(locale, {
            en: `SCITI runs on a research layer plus a deterministic aggregation layer. This page shows the provenance registry, the exact composite equation, and the evidence rules behind method ${SCITI_METHOD_CODE}.`,
            th: `SCITI ประกอบด้วยชั้นวิจัยและชั้นรวมคะแนนเชิงกำหนด หน้านี้แสดงทะเบียนแหล่งที่มา สมการคะแนนรวม และกฎหลักฐานของวิธี ${SCITI_METHOD_CODE}`,
            zh: `SCITI 由研究层和确定性汇总层共同构成。本页展示溯源名录、精确综合公式，以及方法 ${SCITI_METHOD_CODE} 背后的证据规则。`,
          })}
        </p>
      </section>

      {/* ─── DELIVERY EVIDENCE & FIELD EVALUATIONS ─── */}
      <section className="section reveal stagger-1 visible">
        <p className="eyebrow">{t(locale, { en: "Empirical Grounding", th: "ข้อมูลเชิงประจักษ์ภาคสนาม", zh: "实证基础" })}</p>
        <h2>{t(locale, { en: "Delivery Evidence & Field Evaluations (2024–2026)", th: "หลักฐานการส่งมอบและการประเมินภาคสนาม (2567–2569)", zh: "交付实证与实地评估 (2024–2026)" })}</h2>
        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, maxWidth: "720px", marginBottom: "1.5rem" }}>
          {t(locale, {
            en: "Smart city policy cannot rely on ungrounded optimism. These readings provide dated context for interpreting city research. They have different populations, periods and methods; they do not independently validate all SCITI seed values or current services.",
            th: "นโยบายเมืองอัจฉริยะไม่อาจพึ่งพาการมองโลกในแง่ดีที่ไร้หลักฐาน เอกสารเหล่านี้ให้บริบทตามช่วงเวลาสำหรับตีความงานวิจัยเมือง โดยมีประชากร ช่วงเวลา และวิธีศึกษาต่างกัน ไม่ยืนยันค่าตั้งต้นหรือบริการปัจจุบันทั้งหมดของ SCITI",
            zh: "智慧城市政策不能依赖缺乏根据的盲目乐观。这些读物为城市研究提供注明时期的背景；人口、时段与方法各异，不能独立验证SCITI所有既有估计或当前服务。",
          })}
        </p>

        <div className="delivery-evidence-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
          {DELIVERY_EVIDENCE_REGISTRY.map((ev, i) => (
            <article
              key={i}
              className="delivery-evidence-card"
              style={{
                border: "1px solid var(--5)",
                background: "var(--1)",
                padding: "1.25rem 1.5rem",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: ".5rem", marginBottom: ".6rem", borderBottom: "1px solid var(--5)", paddingBottom: ".5rem" }}>
                <span style={{ font: "700 var(--text-body) var(--mono)", color: "var(--ink)" }}>{ev.citation}</span>
                <span style={{ font: "600 var(--text-micro) var(--mono)", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--teal)" }}>
                  {t(locale, ev.scope)}
                </span>
              </div>
              <p style={{ font: "400 var(--text-body)/1.65 var(--font)", color: "var(--ink)", margin: "0 0 .75rem 0" }}>
                {t(locale, ev.finding)}
              </p>
              <div style={{ font: "400 var(--text-micro) var(--mono)", color: "var(--3)", display: "flex", alignItems: "center", gap: ".4rem" }}>
                <span style={{ color: "var(--gold-ink)" }}>PROVENANCE:</span>
                <span>{t(locale, ev.provenance)}</span>
              </div>
              <p style={{ margin: ".5rem 0 0", fontSize: "var(--text-body)", overflowWrap: "anywhere" }}>
                {ev.urls.map((url, sourceIndex) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ marginInlineEnd: ".75rem" }}>{t(locale, { en: "Source", th: "แหล่งข้อมูล", zh: "来源" })} {sourceIndex + 1} ↗</a>)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── DOMAIN BREAKDOWN ─── */}
      <section className="section reveal stagger-1 visible">
        <div className="domain-grid">
          {Object.entries(DOMAINS).map(([key, domain]) => (
            <div key={key} className="domain-card" style={{ borderLeft: `4px solid ${domain.color}` }}>
              <h3 className="domain-title" style={{ color: domain.color }}>{t(locale, domain)}</h3>
              <div className="domain-endpoints">
                {API_ENDPOINTS.filter(api => api.domain === key).map((api, i) => (
                  <div key={i} className="endpoint-item">
                    <div className="endpoint-meta">
                      <span className="endpoint-name">{api.name}</span>
                      <span className="endpoint-audit">{t(locale, { en: "Audit Trail", th: "ร่องรอยการตรวจสอบ", zh: "审计轨迹" })}: {api.auditTrail}</span>
                    </div>
                    <p className="endpoint-usage">{t(locale, api.usage)}</p>
                    <a href={api.url} target="_blank" rel="noopener noreferrer" className="endpoint-link">{t(locale, { en: "Source", th: "แหล่งข้อมูล", zh: "来源" })} →</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SCORING ENGINE AUDIT ─── */}
      <section className="section reveal stagger-2 visible">
        <p className="eyebrow">{t(locale, { en: "Method", th: "วิธีการ", zh: "方法" })}</p>
        <h2>{t(locale, { en: "The Scoring Engine", th: "เครื่องมือคำนวณคะแนน", zh: "评分引擎" })}</h2>
        <div className="engine-audit" style={{ border: "1px solid var(--5)", background: "var(--1)", padding: "1.5rem" }}>
          <div className="formula-box">
             <code>Composite = Σ (pillar score × weight) / 100</code>
          </div>
          <div className="formula-box" style={{ marginTop: ".75rem" }}>
             <code>Confidence = w(core coverage 65%, extended coverage 15%, provenance 10%, freshness 10%)</code>
          </div>
          <p style={{ fontSize: "var(--text-micro)", color: "var(--2)", lineHeight: 1.65, marginTop: "1rem" }}>
            {t(locale, {
              en: `Once the seven pillar scores are fixed, the composite is fully deterministic. Confidence is computed separately and does not secretly alter the score. Tier thresholds are fixed at Alpha ≥ ${TIER_THRESHOLDS.alpha}, Beta ≥ ${TIER_THRESHOLDS.beta}, Gamma < ${TIER_THRESHOLDS.beta}.`,
              th: `เมื่อคะแนน 7 เสาหลักล็อกแล้ว คะแนนรวมจะถูกคำนวณเชิงกำหนดทั้งหมด ความเชื่อมั่นคำนวณแยกต่างหากและไม่แอบปรับคะแนน เกณฑ์ระดับคงที่: Alpha ≥ ${TIER_THRESHOLDS.alpha}, Beta ≥ ${TIER_THRESHOLDS.beta}, Gamma < ${TIER_THRESHOLDS.beta}`,
              zh: `一旦七个支柱分固定，综合分即完全由确定性公式计算。置信度单独计算，不会暗中改写分数。层级阈值固定为 Alpha ≥ ${TIER_THRESHOLDS.alpha}、Beta ≥ ${TIER_THRESHOLDS.beta}、Gamma < ${TIER_THRESHOLDS.beta}。`,
            })}
          </p>
          <div className="weight-audit-grid">
            {SCORING_PILLARS.map(p => (
              <div key={p} className="weight-audit-row">
                <span className="p-dot" style={{ background: PILLAR_COLORS[p] }} />
                <span className="p-label">{PILLAR_LABELS[locale][p]}</span>
                <span className="p-weight">{PILLAR_WEIGHTS[p]}%</span>
                <div className="p-bar-track"><div className="p-bar-fill" style={{ width: `${PILLAR_WEIGHTS[p]}%`, background: PILLAR_COLORS[p] }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHOTO CREDITS (CC BY / CC BY-SA attribution) ─── */}
      <section className="section reveal stagger-3 visible">
        <p className="eyebrow">{t(locale, { en: "Photo Credits", th: "เครดิตภาพ", zh: "图片致谢" })}</p>
        <h2>{t(locale, { en: "Wikimedia Commons Attribution", th: "การอ้างอิงภาพจาก Wikimedia Commons", zh: "Wikimedia Commons 图片致谢" })}</h2>
        <p style={{ fontSize: "var(--text-micro)", color: "var(--2)", lineHeight: 1.6, maxWidth: "620px", marginBottom: "1rem" }}>
          {t(locale, {
            en: "City photos on this site are sourced from Wikimedia Commons under Creative Commons licenses. Each requires attribution to the original photographer. The full list is below, with direct links to the source file on Wikimedia.",
            th: "ภาพเมืองบนเว็บไซต์นี้มาจาก Wikimedia Commons ภายใต้สัญญาอนุญาต Creative Commons ซึ่งกำหนดให้ต้องอ้างอิงช่างภาพต้นฉบับ รายการทั้งหมดอยู่ด้านล่าง พร้อมลิงก์ไปยังไฟล์ต้นฉบับบน Wikimedia",
            zh: "本站的城市照片来自 Wikimedia Commons，使用 Creative Commons 许可证。每张都需要注明原作者。完整列表如下，并附有指向 Wikimedia 原始文件的链接。",
          })}
        </p>
        <div className="photo-credits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: ".5rem" }}>
          {WIKIMEDIA_PHOTO_CREDITS.map(credit => (
            <div key={credit.cityId} className="photo-credit-card" style={{ border: "1px solid var(--5)", background: "var(--1)", padding: ".7rem", fontSize: "var(--text-micro)", lineHeight: 1.5 }}>
              <div style={{ font: "700 var(--text-micro) var(--mono)", color: "var(--teal)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".2rem" }}>{credit.cityId}</div>
              <div style={{ fontWeight: 600, marginBottom: ".15rem" }}>{credit.author}</div>
              <div style={{ color: "var(--3)", marginBottom: ".3rem" }}>{credit.license}</div>
              <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "var(--text-micro)", color: "var(--teal)" }}>
                {t(locale, { en: "Source on Wikimedia", th: "แหล่งที่มา Wikimedia", zh: "Wikimedia 原文件" })} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LEGAL & COMPLIANCE HUD ─── */}
      <section className="section reveal stagger-3 visible">
        <div className="compliance-hud" style={{ border: "1px solid var(--5)", background: "var(--1)", padding: "1.5rem" }}>
          <div className="hud-header">
            <span className="hud-dot" />
            <h3>{t(locale, { en: "Institutional & Compliance Standards", th: "มาตรฐานเชิงสถาบันและการกำกับดูแล", zh: "机构与合规标准" })}</h3>
          </div>
          <div className="compliance-grid">
            <div className="compliance-item">
              <span className="c-label">{t(locale, { en: "License", th: "ใบอนุญาต", zh: "许可" })}</span>
              <span className="c-value">Creative Commons Attribution 4.0 (CC BY 4.0)</span>
            </div>
            <div className="compliance-item">
              <span className="c-label">{t(locale, { en: "Alignment", th: "ความสอดคล้อง", zh: "对齐标准" })}</span>
              <span className="c-value">UN-Habitat CPI · ISO 37122:2019 · ASEAN ASCF</span>
            </div>
            <div className="compliance-item">
              <span className="c-label">{t(locale, { en: "Verification", th: "การยืนยัน", zh: "验证方式" })}</span>
              <span className="c-value">{t(locale, { en: "Registry-backed provenance + field verification + fixed release cut-off", th: "ทะเบียนหลักฐาน + การยืนยันภาคสนาม + วันตัดข้อมูลคงที่", zh: "溯源名录 + 实地核验 + 固定发布截点" })}</span>
            </div>
            <div className="compliance-item">
              <span className="c-label">{t(locale, { en: "Source scope", th: "ขอบเขตแหล่งข้อมูล", zh: "来源范围" })}</span>
              <span className="c-value">{t(locale, {
                en: `${EVIDENCE_SOURCE_FAMILY_COUNT} evidence source families + ${CDP_PLATFORM_COUNT} mapped public endpoints`,
                th: `${EVIDENCE_SOURCE_FAMILY_COUNT} กลุ่มแหล่งหลักฐาน + ${CDP_PLATFORM_COUNT} จุดเชื่อมต่อข้อมูลสาธารณะ`,
                zh: `${EVIDENCE_SOURCE_FAMILY_COUNT} 个证据来源族群 + ${CDP_PLATFORM_COUNT} 个已映射公开端点`,
              })}</span>
            </div>
            <div className="compliance-item">
              <span className="c-label">{t(locale, { en: "Data cut-off", th: "วันตัดข้อมูล", zh: "数据截点" })}</span>
              <span className="c-value">{SCITI_DATA_CUTOFF_ISO.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
