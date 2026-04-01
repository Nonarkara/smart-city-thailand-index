import type { Locale, ScoringPillar } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, PILLAR_WEIGHTS } from "./types";

const PILLAR_ORDER: ScoringPillar[] = ["livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital"];

interface Props {
  locale: Locale;
}

const pillarDescriptions: Record<ScoringPillar, { en: string; th: string; signals: string[] }> = {
  livability: {
    en: "Housing quality, infrastructure reliability, transit access, daily convenience. Can a family live here comfortably? Is commuting bearable? Does the plumbing work?",
    th: "คุณภาพที่อยู่อาศัย ความน่าเชื่อถือของโครงสร้างพื้นฐาน การเข้าถึงขนส่ง ความสะดวกในชีวิตประจำวัน ครอบครัวอยู่ที่นี่ได้สบายไหม?",
    signals: ["Housing affordability index", "Transit coverage and frequency", "Infrastructure reliability", "Utilities uptime", "Walkability score"],
  },
  economy: {
    en: "Jobs, income growth, business environment, cost of living balance. Can a young graduate find meaningful work? Can a family afford to raise children?",
    th: "งาน การเติบโตของรายได้ สภาพแวดล้อมธุรกิจ ความสมดุลค่าครองชีพ บัณฑิตจบใหม่หางานที่มีความหมายได้ไหม? ครอบครัวมีกำลังเลี้ยงลูกไหม?",
    signals: ["GPP per capita", "Employment rate", "Income growth trend", "Business formation rate", "Cost-to-income ratio"],
  },
  safety: {
    en: "Crime rates, disaster resilience, road safety, personal security perception. Do women feel safe walking at night? Are children safe going to school?",
    th: "อัตราอาชญากรรม ความยืดหยุ่นต่อภัยพิบัติ ความปลอดภัยบนถนน การรับรู้ความปลอดภัยส่วนบุคคล ผู้หญิงรู้สึกปลอดภัยเดินตอนกลางคืนไหม?",
    signals: ["Reported crime rate", "Road fatality rate", "Natural disaster preparedness", "Personal safety perception", "Emergency response time"],
  },
  wellbeing: {
    en: "Healthcare access, education quality, mental health support, birth rate confidence. Does the city give people enough hope to start a family?",
    th: "การเข้าถึงสาธารณสุข คุณภาพการศึกษา การสนับสนุนสุขภาพจิต ความมั่นใจในการมีลูก เมืองให้ความหวังเพียงพอที่จะสร้างครอบครัวไหม?",
    signals: ["Hospital beds per capita", "Education attainment", "Mental health service access", "Birth rate trend", "Life satisfaction index"],
  },
  environment: {
    en: "Air quality, green space, water quality, waste management, climate resilience. Can you breathe? Is there nature nearby? Does the city flood every year?",
    th: "คุณภาพอากาศ พื้นที่สีเขียว คุณภาพน้ำ การจัดการขยะ ความยืดหยุ่นต่อสภาพอากาศ หายใจได้ไหม? มีธรรมชาติใกล้ๆ ไหม? เมืองน้ำท่วมทุกปีไหม?",
    signals: ["Annual PM2.5 average", "Green space per capita", "Water quality index", "Waste management coverage", "Flood risk assessment"],
  },
  hospitality: {
    en: "Cultural richness, community warmth, social belonging, tolerance, tourism appeal. Do people feel welcome? Is there life beyond work? Does the city have soul?",
    th: "ความอุดมทางวัฒนธรรม ความอบอุ่นของชุมชน ความเป็นส่วนหนึ่งทางสังคม ความอดทน เมืองมีจิตวิญญาณไหม? คนรู้สึกเป็นที่ต้อนรับไหม?",
    signals: ["Cultural venue density", "Community event frequency", "Social cohesion index", "Tourism satisfaction", "Belonging perception"],
  },
  digital: {
    en: "Bonus pillar. Extra points for cities that actually use digital technology to improve outcomes — not just having a website. Smart sensors, IoT, data platforms, AI applications that citizens can feel.",
    th: "เสาหลักโบนัส คะแนนเพิ่มเติมสำหรับเมืองที่ใช้เทคโนโลยีดิจิทัลเพื่อปรับปรุงผลลัพธ์จริง ไม่ใช่แค่มีเว็บไซต์ เซ็นเซอร์อัจฉริยะ IoT แพลตฟอร์มข้อมูล AI ที่ประชาชนสัมผัสได้",
    signals: ["Smart city tech deployment count", "Digital service adoption rate", "IoT sensor coverage", "Open data platform maturity", "Citizen digital satisfaction"],
  },
};

export default function MethodologyPage({ locale }: Props) {
  return (
    <>
      <section className="section methodology-hero">
        <p className="eyebrow">{locale === "th" ? "วิธีการ" : "Methodology"}</p>
        <h1>
          {locale === "th"
            ? "เราวัดอะไร และทำไม"
            : "What we measure, and why"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "ดัชนีนี้สร้างขึ้นจากวิธีการ SLIC (Smart Liveable Cities Index) ที่ปรับให้เหมาะกับบริบทเมืองอัจฉริยะของไทย เราไม่จัดอันดับ 1, 2, 3 เพราะข้อมูลไม่แม่นยำพอ เราจัดกลุ่ม Alpha · Beta · Gamma"
            : "Built on the SLIC (Smart Liveable Cities Index) methodology, adapted for Thailand's smart city context. We don't rank 1, 2, 3 — the data isn't precise enough for that. We group into Alpha · Beta · Gamma."}
        </p>
      </section>

      {/* ─── CORE PRINCIPLE ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "หลักการหลัก" : "Core principle"}</p>
        <h2>{locale === "th" ? "วัดจากความเป็นจริง ไม่ใช่แผน" : "Measure reality, not plans"}</h2>
        <div className="principle-grid">
          <div className="principle-card">
            <h3>{locale === "th" ? "เมืองที่ใช้งานจริง" : "Operational cities"}</h3>
            <p>{locale === "th"
              ? "ได้คะแนนจากผลลัพธ์จริง ข้อมูลจาก NSO, World Bank, Open-Meteo, depa"
              : "Scored on real outcomes. Data from NSO, World Bank, Open-Meteo, depa"}</p>
          </div>
          <div className="principle-card">
            <h3>{locale === "th" ? "เมืองที่สร้างบางส่วน" : "Partially built cities"}</h3>
            <p>{locale === "th"
              ? "ได้คะแนนจากส่วนที่สร้างแล้วเท่านั้น ไม่นับ master plan"
              : "Scored only on what's built. Master plans don't count."}</p>
          </div>
          <div className="principle-card">
            <h3>{locale === "th" ? "เมืองที่มีแต่แผน" : "Plan-only cities"}</h3>
            <p>{locale === "th"
              ? "ได้คะแนนต่ำโดยอัตโนมัติ ไม่ว่าแผนจะดูดีแค่ไหน เพราะมันยังไม่มีอยู่จริง"
              : "Score low automatically, no matter how good the plan looks. It doesn't exist yet."}</p>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "7 เสาหลัก" : "7 Pillars"}</p>
        <h2>{locale === "th" ? "สิ่งที่ทำให้เมืองน่าอยู่จริง" : "What actually makes a city livable"}</h2>
        <p className="section-intro">
          {locale === "th"
            ? "6 เสาหลักหลัก + 1 เสาหลักโบนัสดิจิทัล เสาหลักดิจิทัลมีน้ำหนัก 5% เพราะเทคโนโลยีเป็นเครื่องมือ ไม่ใช่เป้าหมาย"
            : "6 core pillars + 1 digital bonus. The digital pillar weighs only 5% because technology is a tool, not a goal."}
        </p>

        <div className="methodology-pillars">
          {PILLAR_ORDER.map(p => {
            const desc = pillarDescriptions[p];
            return (
              <div key={p} className="methodology-pillar-card">
                <div className="methodology-pillar-header">
                  <span className="methodology-pillar-dot" style={{ background: PILLAR_COLORS[p] }} />
                  <span className="methodology-pillar-name">{PILLAR_LABELS[locale][p]}</span>
                  <span className="methodology-pillar-weight">{PILLAR_WEIGHTS[p]}%</span>
                </div>
                <p className="methodology-pillar-desc">{locale === "th" ? desc.th : desc.en}</p>
                <div className="methodology-pillar-signals">
                  {desc.signals.map((s, i) => (
                    <span key={i} className="signal-chip">{s}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TIER THRESHOLDS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "เกณฑ์การจัดกลุ่ม" : "Tier thresholds"}</p>
        <h2>{locale === "th" ? "Alpha · Beta · Gamma" : "Alpha · Beta · Gamma"}</h2>
        <div className="threshold-table">
          <div className="threshold-row threshold-alpha">
            <span className="threshold-symbol">α</span>
            <span className="threshold-name">Alpha</span>
            <span className="threshold-range">≥ 65</span>
            <span className="threshold-desc">
              {locale === "th" ? "เมืองอัจฉริยะที่ฉลาดจริง น่าอยู่จริง" : "Genuinely smart, genuinely livable"}
            </span>
          </div>
          <div className="threshold-row threshold-beta">
            <span className="threshold-symbol">β</span>
            <span className="threshold-name">Beta</span>
            <span className="threshold-range">45 – 64</span>
            <span className="threshold-desc">
              {locale === "th" ? "กำลังดำเนินการ มีผลลัพธ์บางส่วน" : "Work in progress, partial outcomes"}
            </span>
          </div>
          <div className="threshold-row threshold-gamma">
            <span className="threshold-symbol">γ</span>
            <span className="threshold-name">Gamma</span>
            <span className="threshold-range">{"< 45"}</span>
            <span className="threshold-desc">
              {locale === "th" ? "เริ่มต้นมาก หรือมีแต่แผน" : "Very early stage or plan-only"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── DEPA BONUS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "คะแนนพิเศษ" : "Bonus points"}</p>
        <h2>{locale === "th" ? "เสาหลักดิจิทัล: โบนัส depa" : "Digital Pillar: The depa Bonus"}</h2>
        <div className="callout-card">
          <p>
            {locale === "th"
              ? "เสาหลักดิจิทัล (5%) เป็นคะแนนพิเศษสำหรับเมืองที่ใช้เทคโนโลยีดิจิทัลจริงเพื่อปรับปรุงผลลัพธ์ ไม่ใช่แค่มีเว็บไซต์หรือ WiFi ฟรี แต่ต้องเป็นเซ็นเซอร์ IoT ที่วัดคุณภาพน้ำจริง AI ที่จัดการจราจรจริง แพลตฟอร์มข้อมูลเปิดที่ประชาชนใช้จริง"
              : "The digital pillar (5%) is bonus points for cities that actually use digital technology to improve outcomes — not just having a website or free WiFi. We mean IoT sensors that really measure water quality, AI that actually manages traffic, open data platforms that citizens actually use."}
          </p>
          <p>
            {locale === "th"
              ? "นี่คือส่วนที่แตกต่างจากดัชนี SLIC ทั่วไป เราให้คะแนนเพิ่มเติมเฉพาะสำหรับนวัตกรรมดิจิทัลเพราะนี่คือดัชนีเมืองอัจฉริยะ ไม่ใช่แค่ดัชนีเมืองน่าอยู่"
              : "This is what makes this different from the general SLIC index. We give extra credit specifically for digital innovation because this is a smart city index, not just a livability index."}
          </p>
        </div>
      </section>

      {/* ─── DATA SOURCES ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "แหล่งข้อมูล" : "Data sources"}</p>
        <h2>{locale === "th" ? "ข้อมูลมาจากไหน" : "Where the data comes from"}</h2>
        <ul className="source-list">
          <li><strong>depa</strong> — {locale === "th" ? "สถานะเมืองอัจฉริยะ มิติการพัฒนา ข้อมูลโครงการ" : "Smart city status, development dimensions, project data"}</li>
          <li><strong>NSO Thailand</strong> — {locale === "th" ? "ข้อมูลประชากร รายได้ GPP การจ้างงาน" : "Population, income, GPP, employment data"}</li>
          <li><strong>World Bank</strong> — {locale === "th" ? "ตัวชี้วัดเศรษฐกิจและสังคม" : "Socioeconomic indicators"}</li>
          <li><strong>Open-Meteo / Copernicus</strong> — {locale === "th" ? "คุณภาพอากาศ PM2.5 ข้อมูลสภาพอากาศ" : "Air quality, PM2.5, climate data"}</li>
          <li><strong>Royal Thai Police</strong> — {locale === "th" ? "สถิติอาชญากรรม" : "Crime statistics"}</li>
          <li><strong>GISTDA</strong> — {locale === "th" ? "ภาพถ่ายดาวเทียม พื้นที่สีเขียว" : "Satellite imagery, green coverage"}</li>
          <li><strong>{locale === "th" ? "การสำรวจภาคสนาม" : "Field observation"}</strong> — {locale === "th" ? "ไปดูเมืองจริงๆ" : "Actually going to the cities"}</li>
        </ul>
      </section>
    </>
  );
}
