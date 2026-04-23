import { SCORING_PILLARS } from "./scoring";
import { PILLAR_LABELS, PILLAR_WEIGHTS, PILLAR_COLORS } from "./types";
import { WIKIMEDIA_PHOTO_CREDITS } from "./photoCredits";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const API_ENDPOINTS = [
  { name: "NSO STATISTICAL DATA", domain: "ECONOMIC", endpoint: "nso.go.th", summary: { en: "Provincial income, employment, and household demographics.", th: "ข้อมูลรายได้จังหวัด การจ้างงาน และโครงสร้างครัวเรือน", zh: "省/直辖市收入、就业及家庭人口统计数据。" } },
  { name: "NESDC GPP DATA", domain: "ECONOMIC", endpoint: "nesdc.go.th", summary: { en: "Gross Provincial Product (GPP) per capita output.", th: "ผลิตภัณฑ์มวลรวมจังหวัดต่อหัว (GPP per capita)", zh: "省级人均生产总值数据。" } },
  { name: "OPEN-METEO CLIMATE API", domain: "ENVIRONMENTAL", endpoint: "api.open-meteo.com", summary: { en: "Historical PM2.5, temperature, and climate risk modeling.", th: "ข้อมูล PM2.5 อุณหภูมิย้อนหลัง และโมเดลความเสี่ยงสภาพภูมิอากาศ", zh: "历史 PM2.5、气温及气候风险模型数据。" } },
  { name: "DEPA CITY PLATFORM", domain: "DIGITAL", endpoint: "citydata.in.th", summary: { en: "IoT deployment counts and open data maturity.", th: "จำนวนการติดตั้ง IoT และความพร้อมข้อมูลเปิด", zh: "物联网部署规模及开放数据成熟度。" } },
];

export default function ReferencesPage({ locale }: Props) {
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="references-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. HERO SIGNAGE */}
      <section className="section hero-signage reveal visible">
        <p className="eyebrow">{t({ en: "Audit Trail // TECHNICAL-v2.1", th: "ร่องรอยการตรวจสอบ // TECHNICAL-v2.1", zh: "审计轨迹 // TECHNICAL-v2.1" })}</p>
        <h1 className="hero-title">{t({ en: "References & Sources", th: "แหล่งอ้างอิงและข้อมูล", zh: "参考资料与数据源" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "Every decimal in the Smart City Thailand Index is anchored in verifiable evidence. Full traceability for every signal used in the calculation engine.",
            th: "ทุกจุดทศนิยมในดัชนีเมืองอัจฉริยะไทย ยึดโยงกับหลักฐานที่ตรวจสอบได้ มีความโปร่งใสในทุกสัญญาณที่ใช้คำนวณ",
            zh: "泰国智慧城市指数中的每一位小数都基于可验证的证据。计算引擎中使用的每个信号都具备完整的可追溯性。",
          })}
        </p>
      </section>

      {/* 2. ENGINE SPECIFICATION */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Calculation Engine", th: "เครื่องมือคำนวณ", zh: "计算引擎" })}</p>
        <div className="data-sheet">
           <div className="data-row" style={{ borderBottom: '2px solid var(--n-900)', paddingBottom: 'var(--space-2)' }}>
              <span className="data-value" style={{ fontSize: '24px', fontWeight: 800 }}>Σ (Pillar_n * Weight_n) / 100</span>
           </div>
           <div className="weight-audit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {SCORING_PILLARS.map(p => (
                <div key={p}>
                   <div className="data-label" style={{ color: PILLAR_COLORS[p] }}>{PILLAR_LABELS[locale][p].toUpperCase()}</div>
                   <div className="data-value" style={{ fontWeight: 800 }}>{PILLAR_WEIGHTS[p]}%</div>
                   <div style={{ height: '4px', background: 'var(--n-100)', marginTop: '4px' }}>
                      <div style={{ height: '100%', width: `${PILLAR_WEIGHTS[p]}%`, background: PILLAR_COLORS[p] }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. SOURCE REPOSITORY */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Verifiable Endpoints", th: "จุดเชื่อมต่อข้อมูลที่ตรวจสอบได้", zh: "可验证的数据终端" })}</p>
        <div className="data-sheet" style={{ padding: 0 }}>
          {API_ENDPOINTS.map((api, i) => (
            <div key={i} className="data-row" style={{ padding: 'var(--space-3) var(--space-4)' }}>
               <div style={{ flex: 1 }}>
                  <div className="data-label">{api.domain}</div>
                  <div className="data-value" style={{ fontWeight: 700 }}>{api.name}</div>
                  <div className="data-note" style={{ color: 'var(--a-500)', fontWeight: 600 }}>{api.endpoint}</div>
               </div>
               <p className="data-note" style={{ flex: 2, margin: 0 }}>{t(api.summary)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MEDIA ATTRIBUTION */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Media Attribution", th: "การอ้างอิงสื่อ", zh: "媒体归属" })}</p>
        <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
          {WIKIMEDIA_PHOTO_CREDITS.slice(0, 12).map(credit => (
            <div key={credit.cityId} className="data-sheet" style={{ padding: 'var(--space-2)' }}>
               <div className="data-label">{credit.cityId.toUpperCase()}</div>
               <div className="data-value" style={{ fontSize: '12px', fontWeight: 700 }}>{credit.author}</div>
               <div className="data-note" style={{ fontSize: '10px' }}>{credit.license}</div>
            </div>
          ))}
        </div>
        <p className="data-note" style={{ marginTop: 'var(--space-2)' }}>SOURCED VIA WIKIMEDIA COMMONS // CREATIVE COMMONS COMPLIANT</p>
      </section>

      {/* 5. COMPLIANCE STANDARDS */}
      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <p className="eyebrow">{t({ en: "Standards & Compliance", th: "มาตรฐานและการกำกับดูแล", zh: "标准与合规" })}</p>
        <div className="data-sheet" style={{ background: 'var(--n-900)', color: 'var(--n-0)' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>LICENSE</div>
               <div className="data-value">CC BY 4.0</div>
             </div>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>FRAMEWORK</div>
               <div className="data-value">ISO 37122:2019</div>
             </div>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>AUDIT METHOD</div>
               <div className="data-value">MANUAL + API</div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
