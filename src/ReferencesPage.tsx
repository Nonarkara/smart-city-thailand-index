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

// ─── DOMAIN CATEGORIES ───
const DOMAINS = {
  economic: { en: "Economic & Productivity", th: "เศรษฐกิจและผลิตภาพ", zh: "经济与生产力", color: "var(--amber)" },
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

export default function ReferencesPage({ locale, onNavigate }: Props) {
  return (
    <div className="references-page">
      <section className="section rankings-hero reveal visible">
        <p className="eyebrow">{t(locale, { en: "Transparency", th: "ความโปร่งใส", zh: "透明度" })}</p>
        <h1 className="hero-title">{t(locale, { en: "Audit Trail & References", th: "ร่องรอยการตรวจสอบและแหล่งอ้างอิง", zh: "审计轨迹与参考资料" })}</h1>
        <p className="hero-strapline">
          {t(locale, {
            en: "Every decimal in the Smart City Thailand Index is anchored in verifiable evidence. We provide full traceability for every signal used in our calculation engine.",
            th: "ทุกทศนิยมในดัชนีเมืองอัจฉริยะไทย ยึดโยงกับหลักฐานที่ตรวจสอบได้ เราให้ความโปร่งใสและตรวจสอบย้อนกลับได้ทุกสัญญาณที่ใช้ในเครื่องมือคำนวณ",
            zh: "泰国智慧城市指数中的每一位小数都基于可验证的证据。我们为计算引擎中使用的每个信号提供完整的可追溯性。",
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
             <code>Composite = Σ (Pillar_n * Weight_n) / 100</code>
          </div>
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
              <span className="c-value">{t(locale, { en: "Manual Field Audit + Automated API Poll", th: "ตรวจภาคสนามด้วยตนเอง + ดึงข้อมูล API อัตโนมัติ", zh: "人工实地审核 + 自动 API 采集" })}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
