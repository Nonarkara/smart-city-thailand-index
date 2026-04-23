import { SCORING_PILLARS } from "./scoring";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, PILLAR_WEIGHTS } from "./types";
import { translate } from "./cityPresentation";

interface Props {
  locale: Locale;
}

type TriLingual = { en: string; th: string; zh: string };

const pillarDescriptions: Record<ScoringPillar, TriLingual & { signals: TriLingual[] }> = {
  livability: {
    en: "Housing quality, infrastructure reliability, transit access, daily convenience.",
    th: "คุณภาพที่อยู่อาศัย ความน่าเชื่อถือของโครงสร้างพื้นฐาน การเข้าถึงขนส่ง ความสะดวกในชีวิตประจำวัน",
    zh: "住房质量、基础设施可靠性、交通可达性与日常便利度。",
    signals: [
      { en: "Housing affordability index", th: "ดัชนีความสามารถซื้อที่อยู่อาศัย", zh: "住房可负担指数" },
      { en: "Transit coverage and frequency", th: "ความครอบคลุมและความถี่ขนส่ง", zh: "公交覆盖与频次" },
      { en: "Infrastructure reliability", th: "ความน่าเชื่อถือโครงสร้างพื้นฐาน", zh: "基础设施可靠性" },
      { en: "Utilities uptime", th: "ความเสถียรสาธารณูปโภค", zh: "公共事业运行率" },
      { en: "Walkability score", th: "คะแนนเดินเท้า", zh: "步行友好度" },
    ],
  },
  economy: {
    en: "Jobs, income growth, business environment, cost of living balance.",
    th: "งาน การเติบโตของรายได้ สภาพแวดล้อมธุรกิจ ความสมดุลค่าครองชีพ",
    zh: "工作、收入增长、营商环境与生活成本的平衡。",
    signals: [
      { en: "GPP per capita", th: "ผลิตภัณฑ์มวลรวมจังหวัดต่อหัว", zh: "人均地区生产总值" },
      { en: "Employment rate", th: "อัตราการมีงานทำ", zh: "就业率" },
      { en: "Income growth trend", th: "แนวโน้มรายได้", zh: "收入增长趋势" },
      { en: "Business formation rate", th: "อัตราการจดทะเบียนธุรกิจ", zh: "企业创建率" },
      { en: "Cost-to-income ratio", th: "สัดส่วนค่าใช้จ่ายต่อรายได้", zh: "生活成本与收入比" },
    ],
  },
  safety: {
    en: "Crime rates, disaster resilience, road safety, personal security perception.",
    th: "อัตราอาชญากรรม ความยืดหยุ่นต่อภัยพิบัติ ความปลอดภัยบนถนน การรับรู้ความปลอดภัยส่วนบุคคล",
    zh: "犯罪率、灾害韧性、道路安全与个人安全感。",
    signals: [
      { en: "Reported crime rate", th: "อัตราอาชญากรรมที่แจ้งเหตุ", zh: "报案犯罪率" },
      { en: "Road fatality rate", th: "อัตราเสียชีวิตบนถนน", zh: "道路死亡率" },
      { en: "Natural disaster preparedness", th: "ความพร้อมรับมือภัยพิบัติ", zh: "自然灾害应对准备" },
      { en: "Personal safety perception", th: "การรับรู้ความปลอดภัยส่วนบุคคล", zh: "个人安全感" },
      { en: "Emergency response time", th: "เวลาตอบสนองฉุกเฉิน", zh: "应急响应时间" },
    ],
  },
  wellbeing: {
    en: "Healthcare access, education quality, mental health support, birth rate confidence.",
    th: "การเข้าถึงสาธารณสุข คุณภาพการศึกษา การสนับสนุนสุขภาพจิต ความมั่นใจในการมีลูก",
    zh: "医疗可及性、教育质量、心理健康支持与生育信心。",
    signals: [
      { en: "Hospital beds per capita", th: "เตียงโรงพยาบาลต่อประชากร", zh: "人均病床数" },
      { en: "Education attainment", th: "ระดับการศึกษา", zh: "受教育程度" },
      { en: "Mental health service access", th: "การเข้าถึงบริการสุขภาพจิต", zh: "心理健康服务可及性" },
      { en: "Birth rate trend", th: "แนวโน้มอัตราการเกิด", zh: "出生率趋势" },
      { en: "Life satisfaction index", th: "ดัชนีความพึงพอใจในชีวิต", zh: "生活满意度指数" },
    ],
  },
  environment: {
    en: "Air quality, green space, water quality, waste management, climate resilience.",
    th: "คุณภาพอากาศ พื้นที่สีเขียว คุณภาพน้ำ การจัดการขยะ ความยืดหยุ่นต่อสภาพอากาศ",
    zh: "空气质量、绿地、水质、垃圾管理与气候韧性。",
    signals: [
      { en: "Annual PM2.5 average", th: "ค่าเฉลี่ย PM2.5 รายปี", zh: "年均 PM2.5" },
      { en: "Green space per capita", th: "พื้นที่สีเขียวต่อประชากร", zh: "人均绿地面积" },
      { en: "Water quality index", th: "ดัชนีคุณภาพน้ำ", zh: "水质指数" },
      { en: "Waste management coverage", th: "ความครอบคลุมจัดการขยะ", zh: "垃圾管理覆盖率" },
      { en: "Flood risk assessment", th: "การประเมินความเสี่ยงน้ำท่วม", zh: "洪水风险评估" },
    ],
  },
  hospitality: {
    en: "Cultural richness, community warmth, social belonging, tolerance, tourism appeal.",
    th: "ความอุดมทางวัฒนธรรม ความอบอุ่นของชุมชน ความเป็นส่วนหนึ่งทางสังคม ความอดทน",
    zh: "文化丰度、社区温度、归属感、包容度与旅游吸引力。",
    signals: [
      { en: "Cultural venue density", th: "ความหนาแน่นพื้นที่วัฒนธรรม", zh: "文化场所密度" },
      { en: "Community event frequency", th: "ความถี่กิจกรรมชุมชน", zh: "社区活动频率" },
      { en: "Social cohesion index", th: "ดัชนีความสมานฉันท์ทางสังคม", zh: "社会凝聚力指数" },
      { en: "Tourism satisfaction", th: "ความพึงพอใจนักท่องเที่ยว", zh: "旅游满意度" },
      { en: "Belonging perception", th: "การรับรู้ความเป็นส่วนหนึ่ง", zh: "归属感" },
    ],
  },
  digital: {
    en: "Smart sensors, IoT, data platforms, AI applications that citizens can feel.",
    th: "เซ็นเซอร์อัจฉริยะ IoT แพลตฟอร์มข้อมูล AI ที่ประชาชนสัมผัสได้จริง",
    zh: "重点是市民感受得到的智能传感器、IoT、数据平台与 AI 应用。",
    signals: [
      { en: "Smart tech deployment count", th: "จำนวนเทคโนโลยีที่ใช้งานจริง", zh: "智能技术部署数量" },
      { en: "Digital service adoption rate", th: "อัตราการใช้บริการดิจิทัล", zh: "数字服务采用率" },
      { en: "IoT sensor coverage", th: "ความครอบคลุมเซ็นเซอร์ IoT", zh: "IoT 传感器覆盖率" },
      { en: "Open data platform maturity", th: "วุฒิภาวะแพลตฟอร์มข้อมูลเปิด", zh: "开放数据平台成熟度" },
      { en: "Citizen digital satisfaction", th: "ความพึงพอใจดิจิทัลของประชาชน", zh: "市民数字满意度" },
    ],
  },
};

const dataFreshness: Array<{
  source: TriLingual;
  frequency: TriLingual;
  lastUpdate: TriLingual;
  status: "current" | "live";
}> = [
  {
    source: { en: "NSO Thailand", th: "สำนักงานสถิติแห่งชาติ", zh: "泰国国家统计局" },
    frequency: { en: "Annual", th: "รายปี", zh: "年度" },
    lastUpdate: { en: "April 2025", th: "เม.ย. 2568", zh: "2025 年 4 月" },
    status: "current",
  },
  {
    source: { en: "GISTDA Satellite", th: "ดาวเทียม GISTDA", zh: "GISTDA 卫星" },
    frequency: { en: "Weekly", th: "รายสัปดาห์", zh: "每周" },
    lastUpdate: { en: "March 2026", th: "มี.ค. 2569", zh: "2026 年 3 月" },
    status: "live",
  },
  {
    source: { en: "Open-Meteo", th: "Open-Meteo", zh: "Open-Meteo" },
    frequency: { en: "Hourly", th: "รายชั่วโมง", zh: "每小时" },
    lastUpdate: { en: "Live", th: "เรียลไทม์", zh: "实时" },
    status: "live",
  },
  {
    source: { en: "depa City Platform", th: "แพลตฟอร์มเมือง depa", zh: "depa 城市平台" },
    frequency: { en: "Real-time", th: "เรียลไทม์", zh: "实时" },
    lastUpdate: { en: "Live", th: "เรียลไทม์", zh: "实时" },
    status: "live",
  },
];

const EXTERNAL_SOURCES: Array<{ name: TriLingual; url: string; label: TriLingual }> = [
  {
    name: { en: "NSO Thailand", th: "สำนักงานสถิติแห่งชาติ", zh: "泰国国家统计局" },
    url: "http://www.nso.go.th/",
    label: { en: "Socio-economic Stats", th: "สถิติเศรษฐกิจสังคม", zh: "社会经济统计" },
  },
  {
    name: { en: "GISTDA", th: "GISTDA", zh: "GISTDA" },
    url: "https://www.gistda.or.th/",
    label: { en: "Satellite / Environment", th: "ดาวเทียม / สิ่งแวดล้อม", zh: "卫星与环境" },
  },
  {
    name: { en: "Air4Thai", th: "Air4Thai", zh: "Air4Thai" },
    url: "http://air4thai.pcd.go.th/",
    label: { en: "Real-time Air Quality", th: "คุณภาพอากาศเรียลไทม์", zh: "实时空气质量" },
  },
  {
    name: { en: "depa City Platform", th: "แพลตฟอร์มเมือง depa", zh: "depa 城市平台" },
    url: "https://smartcitythailand.com",
    label: { en: "Certified Project API", th: "API โครงการที่ได้รับการรับรอง", zh: "认证项目 API" },
  },
];

export default function MethodologyPage({ locale }: Props) {
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="methodology-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. HERO SIGNAGE */}
      <section className="section hero-signage reveal visible">
        <p className="eyebrow">{t({ en: "Audit Standard // SCITI-2026", th: "มาตรฐานการตรวจสอบ // SCITI-2569", zh: "审计标准 // SCITI-2026" })}</p>
        <h1 className="hero-title">{t({ en: "The Reality Blueprint", th: "พิมพ์เขียวแห่งความจริง", zh: "现实之蓝图" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "Decoding Thai cities through falsifiable data. Built on the SLIC methodology, calibrated for regional infrastructure constraints.",
            th: "ถอดรหัสเมืองไทยผ่านข้อมูลที่พิสูจน์ได้ สร้างบนระเบียบวิธี SLIC ที่ปรับเทียบสำหรับข้อจำกัดโครงสร้างพื้นฐานระดับภูมิภาค",
            zh: "通过可证伪的数据解读泰国城市。该指数基于 SLIC 方法论，并针对区域基础设施限制进行了校准。",
          })}
        </p>
      </section>

      {/* 2. DATA LADDER / FRESHNESS */}
      <section className="section reveal visible">
        <div className="data-sheet">
          <div className="data-sheet-title">{t({ en: "Data Sovereignty & Freshness", th: "อธิปไตยของข้อมูลและความสดใหม่", zh: "数据主权与新鲜度" })}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {dataFreshness.map((f, i) => (
              <div key={i} style={{ borderLeft: '2px solid var(--n-100)', paddingLeft: 'var(--space-3)' }}>
                <div className="data-label" style={{ color: 'var(--a-500)' }}>{t(f.source)}</div>
                <div className="data-value" style={{ fontSize: 'var(--text-lg)' }}>{t(f.lastUpdate)}</div>
                <p className="data-note">{t(f.frequency).toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SCORING MATRIX */}
      <section className="section reveal visible">
         <p className="eyebrow">{t({ en: "Signal Matrix", th: "เมทริกซ์สัญญาณ", zh: "信号矩阵" })}</p>
         <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
           {SCORING_PILLARS.map(p => (
             <div key={p} className="data-sheet">
               <div className="data-row" style={{ padding: 0, marginBottom: 'var(--space-2)' }}>
                  <span className="data-sheet-title" style={{ color: PILLAR_COLORS[p] }}>{PILLAR_LABELS[locale][p].toUpperCase()}</span>
                  <span className="data-value" style={{ fontWeight: 800 }}>{PILLAR_WEIGHTS[p]}%</span>
               </div>
               <p className="data-note" style={{ color: 'var(--n-900)', marginBottom: 'var(--space-3)' }}>{t(pillarDescriptions[p])}</p>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                 {pillarDescriptions[p].signals.map((s, i) => (
                   <span key={i} className="dim-chip" style={{ background: 'var(--n-100)', color: 'var(--n-700)', fontSize: '9px' }}>{t(s)}</span>
                 ))}
               </div>
             </div>
           ))}
         </div>
      </section>

      {/* 4. PERFORMANCE THRESHOLDS */}
      <section className="section reveal visible">
        <div className="data-sheet" style={{ background: 'var(--n-900)', color: 'var(--n-0)' }}>
          <div className="data-sheet-title" style={{ color: 'var(--n-300)' }}>{t({ en: "Performance Thresholds", th: "เกณฑ์ประสิทธิภาพ", zh: "绩效阈值" })}</div>
          <div className="data-row" style={{ borderBottomColor: 'var(--n-800)' }}>
            <span className="data-label" style={{ color: 'var(--a-300)', fontSize: '24px', fontWeight: 800 }}>α ALPHA</span>
            <span className="data-value" style={{ fontSize: '18px' }}>≥ 65.0</span>
          </div>
          <div className="data-row" style={{ borderBottomColor: 'var(--n-800)' }}>
            <span className="data-label" style={{ color: 'var(--n-300)', fontSize: '24px', fontWeight: 800 }}>β BETA</span>
            <span className="data-value" style={{ fontSize: '18px' }}>45.0 – 64.9</span>
          </div>
          <div className="data-row" style={{ border: 0 }}>
            <span className="data-label" style={{ color: 'var(--n-600)', fontSize: '24px', fontWeight: 800 }}>γ GAMMA</span>
            <span className="data-value" style={{ fontSize: '18px' }}>{"< 45.0"}</span>
          </div>
        </div>
      </section>

      {/* 5. DATA SOURCES */}
      <section className="section reveal visible" style={{ borderBottom: 0 }}>
         <p className="eyebrow">{t({ en: "Evidence nodes", th: "โหนดหลักฐาน", zh: "证据节点" })}</p>
         <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-2)' }}>
           {EXTERNAL_SOURCES.map(s => (
             <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="data-sheet" style={{ textDecoration: 'none', color: 'inherit', transition: 'background 0.2s' }}>
                <div className="data-label" style={{ color: 'var(--a-500)' }}>{t(s.name)}</div>
                <div className="data-value" style={{ fontSize: '14px', fontWeight: 700 }}>{t(s.label)}</div>
                <p className="data-note" style={{ color: 'var(--n-500)', marginTop: '4px' }}>{s.url} →</p>
             </a>
           ))}
         </div>
      </section>
    </div>
  );
}
