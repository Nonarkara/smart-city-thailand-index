import { SCORING_PILLARS } from "./scoring";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, PILLAR_WEIGHTS } from "./types";

interface Props {
  locale: Locale;
}

const pillarDescriptions: Record<ScoringPillar, { en: string; th: string; zh: string; signals: string[] }> = {
  livability: {
    en: "Housing quality, infrastructure reliability, transit access, daily convenience. Can a family live here comfortably? Is commuting bearable? Does the plumbing work?",
    th: "คุณภาพที่อยู่อาศัย ความน่าเชื่อถือของโครงสร้างพื้นฐาน การเข้าถึงขนส่ง ความสะดวกในชีวิตประจำวัน ครอบครัวอยู่ที่นี่ได้สบายไหม?",
    zh: "住房质量、基础设施可靠性、交通可达性与日常便利度。一个家庭能不能舒舒服服住在这里？通勤会不会把人逼疯？水电到底稳不稳？",
    signals: ["Housing affordability index", "Transit coverage and frequency", "Infrastructure reliability", "Utilities uptime", "Walkability score"],
  },
  economy: {
    en: "Jobs, income growth, business environment, cost of living balance. Can a young graduate find meaningful work? Can a family afford to raise children?",
    th: "งาน การเติบโตของรายได้ สภาพแวดล้อมธุรกิจ ความสมดุลค่าครองชีพ บัณฑิตจบใหม่หางานที่มีความหมายได้ไหม? ครอบครัวมีกำลังเลี้ยงลูกไหม?",
    zh: "工作、收入增长、营商环境与生活成本的平衡。年轻毕业生能不能找到像样的工作？一个家庭养不养得起孩子？",
    signals: ["GPP per capita", "Employment rate", "Income growth trend", "Business formation rate", "Cost-to-income ratio"],
  },
  safety: {
    en: "Crime rates, disaster resilience, road safety, personal security perception. Do women feel safe walking at night? Are children safe going to school?",
    th: "อัตราอาชญากรรม ความยืดหยุ่นต่อภัยพิบัติ ความปลอดภัยบนถนน การรับรู้ความปลอดภัยส่วนบุคคล ผู้หญิงรู้สึกปลอดภัยเดินตอนกลางคืนไหม?",
    zh: "犯罪率、灾害韧性、道路安全与个人安全感。女性晚上走路安不安全？孩子上学路上安不安全？",
    signals: ["Reported crime rate", "Road fatality rate", "Natural disaster preparedness", "Personal safety perception", "Emergency response time"],
  },
  wellbeing: {
    en: "Healthcare access, education quality, mental health support, birth rate confidence. Does the city give people enough hope to start a family?",
    th: "การเข้าถึงสาธารณสุข คุณภาพการศึกษา การสนับสนุนสุขภาพจิต ความมั่นใจในการมีลูก เมืองให้ความหวังเพียงพอที่จะสร้างครอบครัวไหม?",
    zh: "医疗可及性、教育质量、心理健康支持与生育信心。这个城市是否给人足够的希望去建立家庭？",
    signals: ["Hospital beds per capita", "Education attainment", "Mental health service access", "Birth rate trend", "Life satisfaction index"],
  },
  environment: {
    en: "Air quality, green space, water quality, waste management, climate resilience. Can you breathe? Is there nature nearby? Does the city flood every year?",
    th: "คุณภาพอากาศ พื้นที่สีเขียว คุณภาพน้ำ การจัดการขยะ ความยืดหยุ่นต่อสภาพอากาศ หายใจได้ไหม? มีธรรมชาติใกล้ๆ ไหม? เมืองน้ำท่วมทุกปีไหม?",
    zh: "空气质量、绿地、水质、垃圾管理与气候韧性。你能不能好好呼吸？附近有没有自然空间？这座城市是不是每年都淹？",
    signals: ["Annual PM2.5 average", "Green space per capita", "Water quality index", "Waste management coverage", "Flood risk assessment"],
  },
  hospitality: {
    en: "Cultural richness, community warmth, social belonging, tolerance, tourism appeal. Do people feel welcome? Is there life beyond work? Does the city have soul?",
    th: "ความอุดมทางวัฒนธรรม ความอบอุ่นของชุมชน ความเป็นส่วนหนึ่งทางสังคม ความอดทน เมืองมีจิตวิญญาณไหม? คนรู้สึกเป็นที่ต้อนรับไหม?",
    zh: "文化丰度、社区温度、归属感、包容度与旅游吸引力。人会不会觉得自己ถูกต้อนรับ? 这座城市除了工作还有没有生活？它有没有灵魂？",
    signals: ["Cultural venue density", "Community event frequency", "Social cohesion index", "Tourism satisfaction", "Belonging perception"],
  },
  digital: {
    en: "Bonus pillar. Extra points for cities that actually use digital technology to improve outcomes — not just having a website. Smart sensors, IoT, data platforms, AI applications that citizens can feel.",
    th: "เสาหลักโบนัส คะแนนเพิ่มเติมสำหรับเมืองที่ใช้เทคโนโลยีดิจิทัลเพื่อปรับปรุงผลลัพธ์จริง ไม่ใช่แค่มีเว็บไซต์ เซ็นเซอร์อัจฉริยะ IoT แพลตฟอร์มข้อมูล AI ที่ประชาชนสัมผัสได้",
    zh: "加分支柱。只有真正用数字技术改善结果的城市才得分，不是光有网站就算。重点是市民感受得到的智能传感器、IoT、数据平台与 AI 应用。",
    signals: ["Smart city tech deployment count", "Digital service adoption rate", "IoT sensor coverage", "Open data platform maturity", "Citizen digital satisfaction"],
  },
};

const dataFreshness = [
  { source: "NSO Thailand", frequency: "Annual", lastUpdate: "April 2025", status: "current" },
  { source: "GISTDA Satellite", frequency: "Weekly", lastUpdate: "March 2026", status: "live" },
  { source: "Open-Meteo", frequency: "Hourly", lastUpdate: "Live", status: "live" },
  { source: "depa City Platform", frequency: "Real-time", lastUpdate: "Live", status: "live" },
  { source: "Royal Thai Police", frequency: "Annual", lastUpdate: "Jan 2026", status: "current" },
];

export default function MethodologyPage({ locale }: Props) {
  return (
    <div className="methodology-page">
      <section className="section methodology-hero reveal visible">
        <p className="eyebrow">{locale === "th" ? "วิธีการ" : locale === "zh" ? "方法论" : "Methodology"}</p>
        <h1 className="hero-title">
          {locale === "th"
            ? "พิมพ์เขียวแห่งความจริง"
            : locale === "zh"
              ? "现实之蓝图"
            : "The Reality Blueprint"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "เราถอดรหัสเมืองไทยผ่านข้อมูล ไม่ใช่ความรู้สึก ดัชนีนี้สร้างขึ้นจากวิธีการ SLIC ที่ปรับให้เหมาะกับโครงสร้างข้อมูลของไทยโดยเฉพาะ"
            : locale === "zh"
              ? "我们通过数据而非直觉来解读泰国城市。该指数基于 SLIC 方法论，并专门针对泰国的数据结构进行了优化。"
            : "Decoding Thai cities through hard data, not vibes. Built on the SLIC methodology, calibrated specifically for Thailand's unique data infrastructure."}
        </p>
      </section>

      {/* ─── SIGNAL FRESHNESS HUD ─── */}
      <section className="section reveal stagger-1 visible">
        <div className="methodology-hud shadow-premium">
          <div className="hud-header">
            <span className="hud-dot animate-pulse" />
            <h2 className="hud-title">{locale === "th" ? "สถานะการรับส่งข้อมูล" : locale === "zh" ? "数据流状态" : "Data Stream Status"}</h2>
          </div>
          <div className="hud-grid">
            {dataFreshness.map((f, i) => (
              <div key={i} className="hud-item">
                <span className="hud-label">{f.source}</span>
                <span className="hud-value">{f.lastUpdate}</span>
                <span className={`hud-badge badge-${f.status}`}>{f.frequency}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIGNAL MATRIX ─── */}
      <section className="section reveal stagger-2 visible">
        <p className="eyebrow">{locale === "th" ? "เมทริกซ์สัญญาณ" : locale === "zh" ? "信号矩阵" : "Signal Matrix"}</p>
        <h2>{locale === "th" ? "เราคำนวณอย่างไร" : locale === "zh" ? "我们如何计算" : "How we calculate"}</h2>
        
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
                <p className="methodology-pillar-desc">{locale === "th" ? desc.th : locale === "zh" ? desc.zh : desc.en}</p>
                <div className="methodology-pillar-signals">
                  {desc.signals.map((s, i) => (
                    <span key={i} className="signal-chip">{s}</span>
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
        <p className="eyebrow">{locale === "th" ? "เกณฑ์การจัดกลุ่ม" : locale === "zh" ? "分层阈值" : "Performance Tiers"}</p>
        <h2>{locale === "th" ? "Alpha · Beta · Gamma" : locale === "zh" ? "Alpha · Beta · Gamma" : "Alpha · Beta · Gamma"}</h2>
        <div className="threshold-hud glass-card shadow-heavy">
          <div className="threshold-row threshold-alpha">
            <span className="threshold-symbol">α</span>
            <div className="threshold-content">
              <span className="threshold-name">Alpha</span>
              <span className="threshold-desc">
                {locale === "th" ? "เมืองอัจฉริยะที่ฉลาดจริง น่าอยู่จริง (Operational)" : locale === "zh" ? "真正智慧，也真正宜居 (Operational)" : "Operational advanced smart city"}
              </span>
            </div>
            <span className="threshold-range">≥ 65.0</span>
          </div>
          <div className="threshold-row threshold-beta">
            <span className="threshold-symbol">β</span>
            <div className="threshold-content">
              <span className="threshold-name">Beta</span>
              <span className="threshold-desc">
                {locale === "th" ? "กำลังดำเนินการ มีผลลัพธ์บางส่วน (Emerging)" : locale === "zh" ? "推进中，已有部分成果 (Emerging)" : "Building/Emerging infrastructure"}
              </span>
            </div>
            <span className="threshold-range">45.0 – 64.9</span>
          </div>
          <div className="threshold-row threshold-gamma">
            <span className="threshold-symbol">γ</span>
            <div className="threshold-content">
              <span className="threshold-name">Gamma</span>
              <span className="threshold-desc">
                {locale === "th" ? "เริ่มต้นมาก หรือมีแต่แผน (Foundation)" : locale === "zh" ? "非常早期，或只有规划 (Foundation)" : "Planning or foundation stage"}
              </span>
            </div>
            <span className="threshold-range">{"< 45.0"}</span>
          </div>
        </div>
      </section>

      {/* ─── AUDIT TRAIL CTA ─── */}
      <section className="section reveal stagger-4 visible">
        <div className="audit-cta glass-card shadow-premium">
          <div className="audit-cta-content">
            <h3>{locale === "th" ? "ความโปร่งใสแบบโอเพนซอร์ส" : locale === "zh" ? "开源透明性" : "Open Source Transparency"}</h3>
            <p>
              {locale === "th" 
                ? "เราไม่เก็บซ่อนสูตรลับ ทุกการคำนวณตรวจสอบได้ผ่านหน้า Audit และ API Reference" 
                : locale === "zh" 
                ? "我们不隐藏秘密配方。所有计算都可通过 Audit 页面和 API 参考进行验证。" 
                : "No black boxes. Every calculation is auditable through our Audit logs and API references."}
            </p>
          </div>
          <div className="audit-cta-actions">
            <a href="/audit" className="cta-button shadow-premium">View Audit Logs</a>
            <a href="/references" className="ghost-button">API Specs</a>
          </div>
        </div>
      </section>
    </div>
  );
}
