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
    en: "Housing quality, infrastructure reliability, transit access, daily convenience. Can a family live here comfortably? Is commuting bearable? Does the plumbing work?",
    th: "คุณภาพที่อยู่อาศัย ความน่าเชื่อถือของโครงสร้างพื้นฐาน การเข้าถึงขนส่ง ความสะดวกในชีวิตประจำวัน ครอบครัวอยู่ที่นี่ได้สบายไหม?",
    zh: "住房质量、基础设施可靠性、交通可达性与日常便利度。一个家庭能不能舒舒服服住在这里？通勤会不会把人逼疯？水电到底稳不稳？",
    signals: [
      { en: "Housing affordability index", th: "ดัชนีความสามารถซื้อที่อยู่อาศัย", zh: "住房可负担指数" },
      { en: "Transit coverage and frequency", th: "ความครอบคลุมและความถี่ขนส่ง", zh: "公交覆盖与频次" },
      { en: "Infrastructure reliability", th: "ความน่าเชื่อถือโครงสร้างพื้นฐาน", zh: "基础设施可靠性" },
      { en: "Utilities uptime", th: "ความเสถียรสาธารณูปโภค", zh: "公共事业运行率" },
      { en: "Walkability score", th: "คะแนนเดินเท้า", zh: "步行友好度" },
    ],
  },
  economy: {
    en: "Jobs, income growth, business environment, cost of living balance. Can a young graduate find meaningful work? Can a family afford to raise children?",
    th: "งาน การเติบโตของรายได้ สภาพแวดล้อมธุรกิจ ความสมดุลค่าครองชีพ บัณฑิตจบใหม่หางานที่มีความหมายได้ไหม? ครอบครัวมีกำลังเลี้ยงลูกไหม?",
    zh: "工作、收入增长、营商环境与生活成本的平衡。年轻毕业生能不能找到像样的工作？一个家庭养不养得起孩子？",
    signals: [
      { en: "GPP per capita", th: "ผลิตภัณฑ์มวลรวมจังหวัดต่อหัว", zh: "人均地区生产总值" },
      { en: "Employment rate", th: "อัตราการมีงานทำ", zh: "就业率" },
      { en: "Income growth trend", th: "แนวโน้มรายได้", zh: "收入增长趋势" },
      { en: "Business formation rate", th: "อัตราการจดทะเบียนธุรกิจ", zh: "企业创建率" },
      { en: "Cost-to-income ratio", th: "สัดส่วนค่าใช้จ่ายต่อรายได้", zh: "生活成本与收入比" },
    ],
  },
  safety: {
    en: "Crime rates, disaster resilience, road safety, personal security perception. Do women feel safe walking at night? Are children safe going to school?",
    th: "อัตราอาชญากรรม ความยืดหยุ่นต่อภัยพิบัติ ความปลอดภัยบนถนน การรับรู้ความปลอดภัยส่วนบุคคล ผู้หญิงรู้สึกปลอดภัยเดินตอนกลางคืนไหม?",
    zh: "犯罪率、灾害韧性、道路安全与个人安全感。女性晚上走路安不安全？孩子上学路上安不安全？",
    signals: [
      { en: "Reported crime rate", th: "อัตราอาชญากรรมที่แจ้งเหตุ", zh: "报案犯罪率" },
      { en: "Road fatality rate", th: "อัตราเสียชีวิตบนถนน", zh: "道路死亡率" },
      { en: "Natural disaster preparedness", th: "ความพร้อมรับมือภัยพิบัติ", zh: "自然灾害应对准备" },
      { en: "Personal safety perception", th: "การรับรู้ความปลอดภัยส่วนบุคคล", zh: "个人安全感" },
      { en: "Emergency response time", th: "เวลาตอบสนองฉุกเฉิน", zh: "应急响应时间" },
    ],
  },
  wellbeing: {
    en: "Healthcare access, education quality, mental health support, birth rate confidence. Does the city give people enough hope to start a family?",
    th: "การเข้าถึงสาธารณสุข คุณภาพการศึกษา การสนับสนุนสุขภาพจิต ความมั่นใจในการมีลูก เมืองให้ความหวังเพียงพอที่จะสร้างครอบครัวไหม?",
    zh: "医疗可及性、教育质量、心理健康支持与生育信心。这个城市是否给人足够的希望去建立家庭？",
    signals: [
      { en: "Hospital beds per capita", th: "เตียงโรงพยาบาลต่อประชากร", zh: "人均病床数" },
      { en: "Education attainment", th: "ระดับการศึกษา", zh: "受教育程度" },
      { en: "Mental health service access", th: "การเข้าถึงบริการสุขภาพจิต", zh: "心理健康服务可及性" },
      { en: "Birth rate trend", th: "แนวโน้มอัตราการเกิด", zh: "出生率趋势" },
      { en: "Life satisfaction index", th: "ดัชนีความพึงพอใจในชีวิต", zh: "生活满意度指数" },
    ],
  },
  environment: {
    en: "Air quality, green space, water quality, waste management, climate resilience. Can you breathe? Is there nature nearby? Does the city flood every year?",
    th: "คุณภาพอากาศ พื้นที่สีเขียว คุณภาพน้ำ การจัดการขยะ ความยืดหยุ่นต่อสภาพอากาศ หายใจได้ไหม? มีธรรมชาติใกล้ๆ ไหม? เมืองน้ำท่วมทุกปีไหม?",
    zh: "空气质量、绿地、水质、垃圾管理与气候韧性。你能不能好好呼吸？附近有没有自然空间？这座城市是不是每年都淹？",
    signals: [
      { en: "Annual PM2.5 average", th: "ค่าเฉลี่ย PM2.5 รายปี", zh: "年均 PM2.5" },
      { en: "Green space per capita", th: "พื้นที่สีเขียวต่อประชากร", zh: "人均绿地面积" },
      { en: "Water quality index", th: "ดัชนีคุณภาพน้ำ", zh: "水质指数" },
      { en: "Waste management coverage", th: "ความครอบคลุมจัดการขยะ", zh: "垃圾管理覆盖率" },
      { en: "Flood risk assessment", th: "การประเมินความเสี่ยงน้ำท่วม", zh: "洪水风险评估" },
    ],
  },
  hospitality: {
    en: "Cultural richness, community warmth, social belonging, tolerance, tourism appeal. Do people feel welcome? Is there life beyond work? Does the city have soul?",
    th: "ความอุดมทางวัฒนธรรม ความอบอุ่นของชุมชน ความเป็นส่วนหนึ่งทางสังคม ความอดทน เมืองมีจิตวิญญาณไหม? คนรู้สึกเป็นที่ต้อนรับไหม?",
    zh: "文化丰度、社区温度、归属感、包容度与旅游吸引力。人会不会觉得自己受到欢迎？这座城市除了工作还有没有生活？它有没有灵魂？",
    signals: [
      { en: "Cultural venue density", th: "ความหนาแน่นพื้นที่วัฒนธรรม", zh: "文化场所密度" },
      { en: "Community event frequency", th: "ความถี่กิจกรรมชุมชน", zh: "社区活动频率" },
      { en: "Social cohesion index", th: "ดัชนีความสมานฉันท์ทางสังคม", zh: "社会凝聚力指数" },
      { en: "Tourism satisfaction", th: "ความพึงพอใจนักท่องเที่ยว", zh: "旅游满意度" },
      { en: "Belonging perception", th: "การรับรู้ความเป็นส่วนหนึ่ง", zh: "归属感" },
    ],
  },
  digital: {
    en: "Bonus pillar. Extra points for cities that actually use digital technology to improve outcomes — not just having a website. Smart sensors, IoT, data platforms, AI applications that citizens can feel.",
    th: "เสาหลักโบนัส คะแนนเพิ่มเติมสำหรับเมืองที่ใช้เทคโนโลยีดิจิทัลเพื่อปรับปรุงผลลัพธ์จริง ไม่ใช่แค่มีเว็บไซต์ เซ็นเซอร์อัจฉริยะ IoT แพลตฟอร์มข้อมูล AI ที่ประชาชนสัมผัสได้",
    zh: "加分支柱。只有真正用数字技术改善结果的城市才得分，不是光有网站就算。重点是市民感受得到的智能传感器、IoT、数据平台与 AI 应用。",
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
  {
    source: { en: "Royal Thai Police", th: "สำนักงานตำรวจแห่งชาติ", zh: "泰国皇家警察" },
    frequency: { en: "Annual", th: "รายปี", zh: "年度" },
    lastUpdate: { en: "Jan 2026", th: "ม.ค. 2569", zh: "2026 年 1 月" },
    status: "current",
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
  return (
    <div className="methodology-page">
      <section className="section methodology-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Methodology", th: "วิธีการ", zh: "方法论" })}</p>
        <h1 className="hero-title">
          {translate(locale, { en: "The Reality Blueprint", th: "พิมพ์เขียวแห่งความจริง", zh: "现实之蓝图" })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Decoding Thai cities through hard data, not vibes. Built on the SLIC methodology, calibrated specifically for Thailand's unique data infrastructure.",
            th: "เราถอดรหัสเมืองไทยผ่านข้อมูล ไม่ใช่ความรู้สึก ดัชนีนี้สร้างขึ้นจากวิธีการ SLIC ที่ปรับให้เหมาะกับโครงสร้างข้อมูลของไทยโดยเฉพาะ",
            zh: "我们通过数据而非直觉来解读泰国城市。该指数基于 SLIC 方法论，并专门针对泰国的数据结构进行了优化。",
          })}
        </p>
      </section>

      {/* ─── SIGNAL FRESHNESS HUD ─── */}
      <section className="section reveal stagger-1 visible">
        <div className="methodology-hud shadow-premium">
          <div className="hud-header">
            <span className="hud-dot animate-pulse" />
            <h2 className="hud-title">{translate(locale, { en: "Data Stream Status", th: "สถานะการรับส่งข้อมูล", zh: "数据流状态" })}</h2>
          </div>
          <div className="hud-grid">
            {dataFreshness.map((f, i) => (
              <div key={i} className="hud-item">
                <span className="hud-label">{translate(locale, f.source)}</span>
                <span className="hud-value">{translate(locale, f.lastUpdate)}</span>
                <span className={`hud-badge badge-${f.status}`}>{translate(locale, f.frequency)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIGNAL MATRIX ─── */}
      <section className="section reveal stagger-2 visible">
        <p className="eyebrow">{translate(locale, { en: "Signal Matrix", th: "เมทริกซ์สัญญาณ", zh: "信号矩阵" })}</p>
        <h2>{translate(locale, { en: "How we calculate", th: "เราคำนวณอย่างไร", zh: "我们如何计算" })}</h2>

        <div className="methodology-pillars">
          {SCORING_PILLARS.map(p => {
            const desc = pillarDescriptions[p];
            return (
              <div key={p} className="methodology-pillar-card glass-card shadow-premium">
                <div className="methodology-pillar-header">
                  <span className="methodology-pillar-dot" style={{ background: PILLAR_COLORS[p] }} />
                  <span className="methodology-pillar-name">{PILLAR_LABELS[locale][p]}</span>
                  <span className="methodology-pillar-weight">{PILLAR_WEIGHTS[p]}%</span>
                </div>
                <p className="methodology-pillar-desc">{translate(locale, desc)}</p>
                <div className="methodology-pillar-signals">
                  {desc.signals.map((s, i) => (
                    <span key={i} className="signal-chip">{translate(locale, s)}</span>
                  ))}
                </div>
                <div className="pillar-signal-flow" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TIER THRESHOLDS ─── */}
      <section className="section reveal stagger-3 visible">
        <p className="eyebrow">{translate(locale, { en: "Performance Tiers", th: "เกณฑ์การจัดกลุ่ม", zh: "分层阈值" })}</p>
        <h2>Alpha · Beta · Gamma</h2>
        <div className="threshold-hud glass-card shadow-heavy">
          <div className="threshold-row threshold-alpha">
            <span className="threshold-symbol">α</span>
            <div className="threshold-content">
              <span className="threshold-name">Alpha</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: "Operational advanced smart city",
                  th: "เมืองอัจฉริยะที่ฉลาดจริง น่าอยู่จริง (Operational)",
                  zh: "真正智慧，也真正宜居 (Operational)",
                })}
              </span>
            </div>
            <span className="threshold-range">≥ 65.0</span>
          </div>
          <div className="threshold-row threshold-beta">
            <span className="threshold-symbol">β</span>
            <div className="threshold-content">
              <span className="threshold-name">Beta</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: "Building / Emerging infrastructure",
                  th: "กำลังดำเนินการ มีผลลัพธ์บางส่วน (Emerging)",
                  zh: "推进中，已有部分成果 (Emerging)",
                })}
              </span>
            </div>
            <span className="threshold-range">45.0 – 64.9</span>
          </div>
          <div className="threshold-row threshold-gamma">
            <span className="threshold-symbol">γ</span>
            <div className="threshold-content">
              <span className="threshold-name">Gamma</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: "Planning or foundation stage",
                  th: "เริ่มต้นมาก หรือมีแต่แผน (Foundation)",
                  zh: "非常早期，或只有规划 (Foundation)",
                })}
              </span>
            </div>
            <span className="threshold-range">{"< 45.0"}</span>
          </div>
        </div>
      </section>

      {/* ─── WEIGHTING & LIMITATIONS ─── */}
      <section className="reveal stagger-4 visible" style={{ marginTop: '3rem', borderTop: '1px solid var(--5)', paddingTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3>{translate(locale, { en: "Citizen-Centric Weighting", th: "การถ่วงน้ำหนักโดยยึดพลเมือง", zh: "以公民为中心的权重分配" })}</h3>
            <p style={{ fontSize: '.75rem', color: 'var(--2)', lineHeight: 1.6 }}>
              {translate(locale, {
                en: "Unlike traditional indices that weight 'Planning' or 'Investment Volume' highly, SCITI prioritizes 'Lived Experience'. Livability and Wellbeing account for 35% of the score because a smart city that doesn't improve daily life is just an expensive server room.",
                th: "ต่างจากดัชนีทั่วไปที่ให้น้ำหนัก 'การวางแผน' หรือ 'งบประมาณ' สูง SCITI ให้ความสำคัญกับ 'ประสบการณ์จริง' Livability และ Wellbeing คิดเป็น 35% ของคะแนน เพราะเมืองที่ฉลาดแต่ไม่ทำให้ชีวิตดีขึ้น ก็เป็นเพียงห้องเซิร์ฟเวอร์ราคาแพง",
                zh: "与传统指数高度评价“规划”或“投资额”不同，SCITI 优先考虑“生活体验”。宜居性和福祉占得分的 35%，因为不改善日常生活的智慧城市只不过是一个昂贵的服务器机房。"
              })}
            </p>
          </div>
          <div>
            <h3>{translate(locale, { en: "Data Limitations", th: "ข้อจำกัดของข้อมูล", zh: "数据局限性" })}</h3>
            <p style={{ fontSize: '.75rem', color: 'var(--2)', lineHeight: 1.6 }}>
              {translate(locale, {
                en: "We only measure what is falsifiable. Digital metrics rely on depa-certified API nodes. If a city has a project but no data rail, it scores 0. This is a feature, not a bug—it forces cities to prioritize interoperability over PR.",
                th: "เราวัดเฉพาะสิ่งที่พิสูจน์ได้เท่านั้น ตัวชี้วัดดิจิทัลอ้างอิงจาก API ที่ depa รับรอง หากเมืองมีโปรเจกต์แต่ไม่มีรางข้อมูล (Data Rail) จะได้ 0 คะแนน นี่คือ 'คุณลักษณะ' ไม่ใช่ 'ข้อผิดพลาด' เพื่อบีบให้เมืองเลิกทำ PR แล้วหันมาทำระบบข้อมูลที่เชื่อมต่อได้จริง",
                zh: "我们只测量可证伪的内容。数字指标依赖于 depa 认证的 API 节点。如果一个城市有项目但没有数据轨道（Data Rail），它将得到 0 分。这是一个“特性”而非“错误”——它迫使城市优先考虑互操作性而非公关。"
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ─── EXTERNAL SOURCES ─── */}
      <section className="section reveal visible" style={{ marginTop: '2rem' }}>
        <p className="eyebrow">{translate(locale, { en: "Data Sovereignty", th: "แหล่งข้อมูลอ้างอิง", zh: "数据主权" })}</p>
        <h2>{translate(locale, { en: "Primary Evidence Nodes", th: "โหนดหลักฐานหลัก", zh: "原始证据节点" })}</h2>
        <div className="sources-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {EXTERNAL_SOURCES.map(s => (
            <div key={s.url} className="source-card glass-card">
              <div className="source-card-name" style={{ fontSize: '.7rem', fontWeight: 800 }}>{translate(locale, s.name)}</div>
              <div className="source-card-desc" style={{ fontSize: '.6rem', marginBottom: '.5rem' }}>{translate(locale, s.label)}</div>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.55rem', color: 'var(--teal)' }}>{s.url} →</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
