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
    zh: "文化丰度、社区温度、归属感、包容度与旅游吸引力。人会不会觉得自己被欢迎？这座城市除了工作还有没有生活？它有没有灵魂？",
    signals: ["Cultural venue density", "Community event frequency", "Social cohesion index", "Tourism satisfaction", "Belonging perception"],
  },
  digital: {
    en: "Bonus pillar. Extra points for cities that actually use digital technology to improve outcomes — not just having a website. Smart sensors, IoT, data platforms, AI applications that citizens can feel.",
    th: "เสาหลักโบนัส คะแนนเพิ่มเติมสำหรับเมืองที่ใช้เทคโนโลยีดิจิทัลเพื่อปรับปรุงผลลัพธ์จริง ไม่ใช่แค่มีเว็บไซต์ เซ็นเซอร์อัจฉริยะ IoT แพลตฟอร์มข้อมูล AI ที่ประชาชนสัมผัสได้",
    zh: "加分支柱。只有真正用数字技术改善结果的城市才得分，不是光有网站就算。重点是市民感受得到的智能传感器、IoT、数据平台与 AI 应用。",
    signals: ["Smart city tech deployment count", "Digital service adoption rate", "IoT sensor coverage", "Open data platform maturity", "Citizen digital satisfaction"],
  },
};

export default function MethodologyPage({ locale }: Props) {
  return (
    <>
      <section className="section methodology-hero">
        <p className="eyebrow">{locale === "th" ? "วิธีการ" : locale === "zh" ? "方法论" : "Methodology"}</p>
        <h1>
          {locale === "th"
            ? "เราวัดอะไร และทำไม"
            : locale === "zh"
              ? "我们衡量什么，以及为什么"
            : "What we measure, and why"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "ดัชนีนี้สร้างขึ้นจากวิธีการ SLIC (Smart Liveable Cities Index) ที่ปรับให้เหมาะกับบริบทเมืองอัจฉริยะของไทย เราไม่จัดอันดับ 1, 2, 3 เพราะข้อมูลไม่แม่นยำพอ เราจัดกลุ่ม Alpha · Beta · Gamma"
            : locale === "zh"
              ? "这个指数建立在 SLIC（Smart Liveable Cities Index）方法论之上，并针对泰国智慧城市语境做了调整。我们不做 1、2、3 这种假精确排名，而是分为 Alpha · Beta · Gamma。"
            : "Built on the SLIC (Smart Liveable Cities Index) methodology, adapted for Thailand's smart city context. We don't rank 1, 2, 3 — the data isn't precise enough for that. We group into Alpha · Beta · Gamma."}
        </p>
      </section>

      {/* ─── CORE PRINCIPLE ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "หลักการหลัก" : locale === "zh" ? "核心原则" : "Core principle"}</p>
        <h2>{locale === "th" ? "วัดจากความเป็นจริง ไม่ใช่แผน" : locale === "zh" ? "衡量现实，而不是规划" : "Measure reality, not plans"}</h2>
        <div className="principle-grid">
          <div className="principle-card">
            <h3>{locale === "th" ? "เมืองที่ใช้งานจริง" : locale === "zh" ? "已运行城市" : "Operational cities"}</h3>
            <p>{locale === "th"
              ? "ได้คะแนนจากผลลัพธ์จริง ข้อมูลจาก NSO, World Bank, Open-Meteo, depa"
              : locale === "zh"
                ? "按真实结果评分。数据来自 NSO、World Bank、Open-Meteo 与 depa。"
              : "Scored on real outcomes. Data from NSO, World Bank, Open-Meteo, depa"}</p>
          </div>
          <div className="principle-card">
            <h3>{locale === "th" ? "เมืองที่สร้างบางส่วน" : locale === "zh" ? "部分建成城市" : "Partially built cities"}</h3>
            <p>{locale === "th"
              ? "ได้คะแนนจากส่วนที่สร้างแล้วเท่านั้น ไม่นับ master plan"
              : locale === "zh"
                ? "只按已经建成的部分评分，宏大总规不算分。"
              : "Scored only on what's built. Master plans don't count."}</p>
          </div>
          <div className="principle-card">
            <h3>{locale === "th" ? "เมืองที่มีแต่แผน" : locale === "zh" ? "仅有规划城市" : "Plan-only cities"}</h3>
            <p>{locale === "th"
              ? "ได้คะแนนต่ำโดยอัตโนมัติ ไม่ว่าแผนจะดูดีแค่ไหน เพราะมันยังไม่มีอยู่จริง"
              : locale === "zh"
                ? "无论方案看起来多漂亮，都会自动低分，因为现实里它还不存在。"
              : "Score low automatically, no matter how good the plan looks. It doesn't exist yet."}</p>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "7 เสาหลัก" : locale === "zh" ? "七大支柱" : "7 Pillars"}</p>
        <h2>{locale === "th" ? "สิ่งที่ทำให้เมืองน่าอยู่จริง" : locale === "zh" ? "真正决定城市宜居性的东西" : "What actually makes a city livable"}</h2>
        <p className="section-intro">
          {locale === "th"
            ? "6 เสาหลักหลัก + 1 เสาหลักโบนัสดิจิทัล เสาหลักดิจิทัลมีน้ำหนัก 5% เพราะเทคโนโลยีเป็นเครื่องมือ ไม่ใช่เป้าหมาย"
            : locale === "zh"
              ? "6 个核心支柱，加上 1 个数字化加分项。数字维度只占 5%，因为技术是工具，不是目标。"
            : "6 core pillars + 1 digital bonus. The digital pillar weighs only 5% because technology is a tool, not a goal."}
        </p>

        <div className="methodology-pillars">
          {SCORING_PILLARS.map(p => {
            const desc = pillarDescriptions[p];
            return (
              <div key={p} className="methodology-pillar-card">
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
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TIER THRESHOLDS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "เกณฑ์การจัดกลุ่ม" : locale === "zh" ? "分层阈值" : "Tier thresholds"}</p>
        <h2>{locale === "th" ? "Alpha · Beta · Gamma" : locale === "zh" ? "Alpha · Beta · Gamma" : "Alpha · Beta · Gamma"}</h2>
        <div className="threshold-table">
          <div className="threshold-row threshold-alpha">
            <span className="threshold-symbol">α</span>
            <span className="threshold-name">Alpha</span>
            <span className="threshold-range">≥ 65</span>
            <span className="threshold-desc">
              {locale === "th" ? "เมืองอัจฉริยะที่ฉลาดจริง น่าอยู่จริง" : locale === "zh" ? "真正智慧，也真正宜居" : "Genuinely smart, genuinely livable"}
            </span>
          </div>
          <div className="threshold-row threshold-beta">
            <span className="threshold-symbol">β</span>
            <span className="threshold-name">Beta</span>
            <span className="threshold-range">45 – 64</span>
            <span className="threshold-desc">
              {locale === "th" ? "กำลังดำเนินการ มีผลลัพธ์บางส่วน" : locale === "zh" ? "推进中，已有部分成果" : "Work in progress, partial outcomes"}
            </span>
          </div>
          <div className="threshold-row threshold-gamma">
            <span className="threshold-symbol">γ</span>
            <span className="threshold-name">Gamma</span>
            <span className="threshold-range">{"< 45"}</span>
            <span className="threshold-desc">
              {locale === "th" ? "เริ่มต้นมาก หรือมีแต่แผน" : locale === "zh" ? "非常早期，或只有规划" : "Very early stage or plan-only"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── DEPA BONUS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "คะแนนพิเศษ" : locale === "zh" ? "额外加分" : "Bonus points"}</p>
        <h2>{locale === "th" ? "เสาหลักดิจิทัล: โบนัส depa" : locale === "zh" ? "数字支柱：depa 加分项" : "Digital Pillar: The depa Bonus"}</h2>
        <div className="callout-card">
          <p>
            {locale === "th"
              ? "เสาหลักดิจิทัล (5%) เป็นคะแนนพิเศษสำหรับเมืองที่ใช้เทคโนโลยีดิจิทัลจริงเพื่อปรับปรุงผลลัพธ์ ไม่ใช่แค่มีเว็บไซต์หรือ WiFi ฟรี แต่ต้องเป็นเซ็นเซอร์ IoT ที่วัดคุณภาพน้ำจริง AI ที่จัดการจราจรจริง แพลตฟอร์มข้อมูลเปิดที่ประชาชนใช้จริง"
              : locale === "zh"
                ? "数字支柱（5%）是给那些真正用数字技术改善结果的城市的加分项，不是给有官网或免费 Wi‑Fi 的城市。我们看的是实际工作的 IoT 传感器、真正能管交通的 AI，以及居民真的会用的开放数据平台。"
              : "The digital pillar (5%) is bonus points for cities that actually use digital technology to improve outcomes — not just having a website or free WiFi. We mean IoT sensors that really measure water quality, AI that actually manages traffic, open data platforms that citizens actually use."}
          </p>
          <p>
            {locale === "th"
              ? "นี่คือส่วนที่แตกต่างจากดัชนี SLIC ทั่วไป เราให้คะแนนเพิ่มเติมเฉพาะสำหรับนวัตกรรมดิจิทัลเพราะนี่คือดัชนีเมืองอัจฉริยะ ไม่ใช่แค่ดัชนีเมืองน่าอยู่"
              : locale === "zh"
                ? "这就是它不同于一般 SLIC 指数的地方。因为这是智慧城市指数，而不是单纯的宜居指数，所以我们只对真正的数字创新额外加分。"
              : "This is what makes this different from the general SLIC index. We give extra credit specifically for digital innovation because this is a smart city index, not just a livability index."}
          </p>
        </div>
      </section>

      {/* ─── DATA SOURCES ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "แหล่งข้อมูล" : locale === "zh" ? "数据来源" : "Data sources"}</p>
        <h2>{locale === "th" ? "ข้อมูลมาจากไหน" : locale === "zh" ? "数据从哪里来" : "Where the data comes from"}</h2>
        <ul className="source-list">
          <li><strong>depa</strong> — {locale === "th" ? "สถานะเมืองอัจฉริยะ มิติการพัฒนา ข้อมูลโครงการ" : locale === "zh" ? "智慧城市状态、发展维度与项目数据" : "Smart city status, development dimensions, project data"}</li>
          <li><strong>NSO Thailand</strong> — {locale === "th" ? "ข้อมูลประชากร รายได้ GPP การจ้างงาน" : locale === "zh" ? "人口、收入、GPP 与就业数据" : "Population, income, GPP, employment data"}</li>
          <li><strong>World Bank</strong> — {locale === "th" ? "ตัวชี้วัดเศรษฐกิจและสังคม" : locale === "zh" ? "社会经济指标" : "Socioeconomic indicators"}</li>
          <li><strong>Open-Meteo / Copernicus</strong> — {locale === "th" ? "คุณภาพอากาศ PM2.5 ข้อมูลสภาพอากาศ" : locale === "zh" ? "空气质量、PM2.5 与气候数据" : "Air quality, PM2.5, climate data"}</li>
          <li><strong>Royal Thai Police</strong> — {locale === "th" ? "สถิติอาชญากรรม" : locale === "zh" ? "犯罪统计" : "Crime statistics"}</li>
          <li><strong>GISTDA</strong> — {locale === "th" ? "ภาพถ่ายดาวเทียม พื้นที่สีเขียว" : locale === "zh" ? "卫星影像与绿地覆盖" : "Satellite imagery, green coverage"}</li>
          <li><strong>{locale === "th" ? "การสำรวจภาคสนาม" : locale === "zh" ? "实地观察" : "Field observation"}</strong> — {locale === "th" ? "ไปดูเมืองจริงๆ" : locale === "zh" ? "亲自去现场看城市究竟是什么样" : "Actually going to the cities"}</li>
        </ul>
      </section>
    </>
  );
}
