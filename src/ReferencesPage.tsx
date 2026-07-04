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
  environmental: { en: "Environmental & Climate", th: "สิ่งแวดล้อมและสภาพภูมิอากาศ", zh: "环境与气候", color: "var(--emerald)" },
  social: { en: "Social & Wellbeing", th: "สังคมและความเป็นอยู่", zh: "社会与福祉", color: "var(--indigo)" },
  digital: { en: "Digital & Infrastructure", th: "ดิจิทัลและโครงสร้างพื้นฐาน", zh: "数字与基础设施", color: "var(--sky)" },
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

      {/* ─── DOMAIN BREAKDOWN ─── */}
      <section className="section reveal stagger-1 visible">
        <div className="domain-grid">
          {Object.entries(DOMAINS).map(([key, domain]) => (
            <div key={key} className="domain-card glass-card shadow-premium" style={{ borderLeft: `4px solid ${domain.color}` }}>
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
        <div className="engine-audit glass-card shadow-heavy">
          <div className="formula-box">
             <code>Composite = Σ (pillar score × weight) / 100</code>
          </div>
          <div className="formula-box" style={{ marginTop: ".75rem" }}>
             <code>Confidence = w(core coverage 65%, extended coverage 15%, provenance 10%, freshness 10%)</code>
          </div>
          <p style={{ fontSize: ".72rem", color: "var(--2)", lineHeight: 1.65, marginTop: "1rem" }}>
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
        <p style={{ fontSize: ".75rem", color: "var(--2)", lineHeight: 1.6, maxWidth: "620px", marginBottom: "1rem" }}>
          {t(locale, {
            en: "City photos on this site are sourced from Wikimedia Commons under Creative Commons licenses. Each requires attribution to the original photographer. The full list is below, with direct links to the source file on Wikimedia.",
            th: "ภาพเมืองบนเว็บไซต์นี้มาจาก Wikimedia Commons ภายใต้สัญญาอนุญาต Creative Commons ซึ่งกำหนดให้ต้องอ้างอิงช่างภาพต้นฉบับ รายการทั้งหมดอยู่ด้านล่าง พร้อมลิงก์ไปยังไฟล์ต้นฉบับบน Wikimedia",
            zh: "本站的城市照片来自 Wikimedia Commons，使用 Creative Commons 许可证。每张都需要注明原作者。完整列表如下，并附有指向 Wikimedia 原始文件的链接。",
          })}
        </p>
        <div className="photo-credits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: ".5rem" }}>
          {WIKIMEDIA_PHOTO_CREDITS.map(credit => (
            <div key={credit.cityId} className="photo-credit-card glass-card" style={{ padding: ".7rem", fontSize: ".65rem", lineHeight: 1.5 }}>
              <div style={{ font: "700 .6rem var(--mono)", color: "var(--teal)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".2rem" }}>{credit.cityId}</div>
              <div style={{ fontWeight: 600, marginBottom: ".15rem" }}>{credit.author}</div>
              <div style={{ color: "var(--3)", marginBottom: ".3rem" }}>{credit.license}</div>
              <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: ".6rem", color: "var(--teal)" }}>
                {t(locale, { en: "Source on Wikimedia", th: "แหล่งที่มา Wikimedia", zh: "Wikimedia 原文件" })} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LEGAL & COMPLIANCE HUD ─── */}
      <section className="section reveal stagger-3 visible">
        <div className="compliance-hud glass-card shadow-premium">
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
