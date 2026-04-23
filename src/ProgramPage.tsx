import { useMemo } from "react";
import { useCitySummaries } from "./cityApi";
import { summarizeCities } from "./cityCollections";
import { translate } from "./cityPresentation";
import type { Locale, SmartDimension } from "./types";
import { DIMENSION_LABELS } from "./types";
import { useInView } from "./useInView";
import { assetUrl } from "./mediaAssets";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const DIMENSION_ICONS: Record<SmartDimension, string> = {
  economy: "📈", energy: "⚡", environment: "🌿",
  governance: "🏛️", living: "🏠", mobility: "🚌", people: "👥",
};

const DIMENSION_DESCS: Record<SmartDimension, { en: string; th: string; zh: string }> = {
  economy: { 
    en: "How can technology help improve the economy and manage resources more efficiently?", 
    th: "เทคโนโลยีช่วยปรับปรุงเศรษฐกิจและจัดการทรัพยากรให้มีประสิทธิภาพมากขึ้นได้อย่างไร?",
    zh: "技术如何帮助改善经济并更有效地管理资源？"
  },
  energy: { 
    en: "How can conserving non-renewable energy be balanced with producing clean alternatives?", 
    th: "การอนุรักษ์พลังงานที่ใช้แล้วหมดจะสมดุลกับการผลิตพลังงานสะอาดทดแทนได้อย่างไร?",
    zh: "如何平衡不可再生能源的保护与清洁替代能源的生产？"
  },
  environment: { 
    en: "How can the ecological quality of a sustainable urban environment be improved?", 
    th: "จะปรับปรุงคุณภาพเชิงนิเวศของสิ่งแวดล้อมเมืองที่ยั่งยืนได้อย่างไร?",
    zh: "如何改善可持续城市环境的生态质量？"
  },
  governance: { 
    en: "How can a digital system be designed where people benefit from open data and accountability?", 
    th: "จะออกแบบระบบดิจิทัลที่ประชาชนได้ประโยชน์จากข้อมูลเปิดและความโปร่งใสได้อย่างไร?",
    zh: "如何设计一个让人们从开放数据和问责制中受益的数字系统？"
  },
  living: { 
    en: "How can innovation improve quality of life, safety, and health for urban residents?", 
    th: "นวัตกรรมจะช่วยปรับปรุงคุณภาพชีวิต ความปลอดภัย และสุขภาพของผู้อยู่อาศัยในเมืองได้อย่างไร?",
    zh: "创新如何改善城市居民的生活质量、安全和健康？"
  },
  mobility: { 
    en: "How can technology solve traffic problems so people travel conveniently and sustainably?", 
    th: "เทคโนโลยีจะแก้ปัญหาจราจรเพื่อให้คนเดินทางสะดวกและยั่งยืนได้อย่างไร?",
    zh: "技术如何解决交通问题，让人们便捷、可持续地出行？"
  },
  people: { 
    en: "How can skills be developed to boost creativity, decrease inequality, and create more jobs?", 
    th: "จะพัฒนาทักษะเพื่อกระตุ้นความคิดสร้างสรรค์ ลดความเหลื่อมล้ำ และสร้างงานมากขึ้นได้อย่างไร?",
    zh: "如何培养技能以激发创造力、减少不平等并创造更多就业机会？"
  },
};

const CERT_STEPS = [
  { 
    en: "Apply", th: "สมัคร", zh: "申请",
    desc: { 
      en: "Municipality submits proposal with city master plan and smart city project blueprint.", 
      th: "เทศบาลยื่นข้อเสนอพร้อมแผนแม่บทเมืองและพิมพ์เขียวโครงการเมืองอัจฉริยะ",
      zh: "市政当局提交包含城市总体规划和智慧城市项目蓝图的提案。"
    } 
  },
  { 
    en: "Evaluate", th: "ประเมิน", zh: "评估",
    desc: { 
      en: "depa technical committee reviews across 7 dimensions. Field visits verify claims.", 
      th: "คณะกรรมการเทคนิค depa ตรวจสอบ 7 มิติ ลงพื้นที่ตรวจสอบข้อเท็จจริง",
      zh: "depa 技术委员会对 7 个维度进行评审。实地考察以验证陈述。"
    } 
  },
  { 
    en: "Approve", th: "อนุมัติ", zh: "批准",
    desc: { 
      en: "National Smart City Committee chaired by Deputy PM reviews and approves.", 
      th: "คณะกรรมการเมืองอัจฉริยะแห่งชาติ มีรองนายกรัฐมนตรีเป็นประธาน พิจารณาและอนุมัติ",
      zh: "由副总理主持的国家智慧城市委员会进行审查并批准。"
    } 
  },
  { 
    en: "Certify", th: "รับรอง", zh: "认证",
    desc: { 
      en: "City receives Smart City Local logo. Annual outcome reporting begins.", 
      th: "เมืองได้รับตราสัญลักษณ์ Smart City Local เริ่มรายงานผลลัพธ์ประจำปี",
      zh: "城市获得“智慧城市地方”标志。开始年度成果报告。"
    } 
  },
];

const BATCHES = [
  { batch: 1, year: "2019", cities: 15, label: { en: "Pioneers", th: "ผู้บุกเบิก", zh: "先驱者" } },
  { batch: 2, year: "2021", cities: 15, label: { en: "Expansion", th: "ขยายผล", zh: "扩成果" } },
  { batch: 3, year: "2023", cities: 6, label: { en: "Consolidation", th: "รวมพลัง", zh: "凝力量" } },
  { batch: 4, year: "2025", cities: 1, label: { en: "Latest", th: "ล่าสุด", zh: "最新批次" } },
];

const PHOTOS_WORKSHOP = [
  "/photos/IMG_7504.JPG", "/photos/IMG_6654.JPG", "/photos/IMG_6692.JPG",
  "/photos/IMG_1382.JPG", "/photos/IMG_1447.JPG",
];
const PHOTOS_INTL = [
  "/Photos international/20260317092525-_DON6841.jpg",
  "/Photos international/20260317093438-_DON6939.jpg",
  "/Photos international/Z03A9727-opq3949327416.jpg",
  "/Photos international/JSCF2025-2495.jpg",
];

export default function ProgramPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const stats = useMemo(() => summarizeCities(cities), [cities]);
  const dimensions: SmartDimension[] = ["environment", "economy", "mobility", "energy", "people", "living", "governance"];

  const [heroRef, heroVisible] = useInView(0.1);
  const [dnaRef, dnaVisible] = useInView(0.1);
  const [mref257, visible257] = useInView(0.1);
  const [certRef, certVisible] = useInView(0.1);
  const [batchRef, batchVisible] = useInView(0.1);
  const [cdpRef, cdpVisible] = useInView(0.1);

  return (
    <>
      {/* ─── HERO ─── */}
      <section ref={heroRef} className={`section rankings-hero reveal ${heroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { 
          en: "depa \u00b7 MDES \u00b7 Kingdom of Thailand", 
          th: "depa · กระทรวง DE · ราชอาณาจักรไทย", 
          zh: "depa · MDES · 泰王国" 
        })}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}>
          {translate(locale, { en: "Smart City Thailand", th: "เมืองอัจฉริยะประเทศไทย", zh: "泰国智慧城市" })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "A smart city is a process, not a result. No city reaches the status of a smart city by simply ticking boxes. Smart refers to the ability to comprehend, adapt, and transform — to cope with and improve the changing world. This is Thailand’s national framework for building cities where citizens come first and technology stays in the background.",
            th: "เมืองอัจฉริยะคือกระบวนการ ไม่ใช่ผลลัพธ์ ไม่มีความเป็นเมืองอัจฉริยะได้หากเพียงแค่การทำเครื่องหมายในช่องสี่เหลี่ยม คำว่า “อัจฉริยะ” หมายถึงความสามารถในการเข้าใจ ปรับตัว และเปลี่ยนแปลง เพื่อรับมือและพัฒนาโลกที่เปลี่ยนแปลงไป นี่คือกรอบกระบวนการระดับชาติของไทยในการสร้างเมืองที่ประชาชนมาก่อนและเทคโนโลยีอยู่เบื้องหลัง",
            zh: "智慧城市是一个过程，不是结果。没有城市可以通过简单的勾选而获得智慧城市地位。“智慧”是指理解、适应和转变的能力——以应对和改善变化的世界。这是泰国为建设以市民为中心、技术退居幕后的城市而制定的国家框架。"
          })}
        </p>
        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          <a href="https://www.smartcitythailand.or.th/" target="_blank" rel="noopener noreferrer" className="cta-button">
            {translate(locale, { en: "Official website", th: "เว็บไซต์ทางการ", zh: "官方网站" })} →
          </a>
          <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
            {translate(locale, { en: "View index rankings", th: "ดูอันดับดัชนี", zh: "查看排名" })}
          </button>
        </div>
      </section>

      {/* ─── THREE CONCEPTS ─── */}
      <section ref={dnaRef} className={`section reveal stagger-1 ${dnaVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Three concepts", th: "สามแนวคิดหลัก", zh: "三大概念" })}</p>
        <h2>{translate(locale, { en: "The DNA of Thai smart cities", th: "DNA ของเมืองอัจฉริยะไทย", zh: "泰国智慧城市的DNA" })}</h2>
        <div className="program-concepts-grid">
          <div className="program-concept-card">
            <span className="program-concept-num">1</span>
            <h3>{translate(locale, { en: "Citizens at the center, technology in the background", th: "ประชาชนอยู่ตรงกลาง เทคโนโลยีอยู่เบื้องหลัง", zh: "市民在中心，技术在幕后" })}</h3>
            <p>{translate(locale, {
              en: "Cities are for people. A smart city should not force residents to be hooked on smartphones 12 hours a day. Instead, it uses appropriate technology to enhance quality of life in the background — less travel time, worry-free healthcare, more spare time. The evidence of success lies in measurable outcomes, not hardware specs.",
              th: "เมืองมีไว้เพื่อคน เมืองอัจฉริยะไม่ควรบังคับให้ผู้อยู่อาศัยติดมือถือ 12 ชั่วโมงต่อวัน แต่ใช้เทคโนโลยีที่เหมาะสมเพื่อยกระดับคุณภาพชีวิตในเบื้องหลัง ทั้งเวลาเดินทางที่ลดลง การดูแลสุขภาพที่ไร้กังวล และเวลาว่างที่มากขึ้น หลักฐานความสำเร็จคือผลลัพธ์ที่วัดได้ ไม่ใช่สเปกฮาร์ดแวร์",
              zh: "城市是为人而存在的。智慧城市不应强迫居民每天盯着手机12小时。相反，它在幕后使用适当技术提升生活质量。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">2</span>
            <h3>{translate(locale, { en: "People-Public-Private-Partnership (PPPP)", th: "ความร่วมมือ ประชาชน-รัฐ-เอกชน (PPPP)", zh: "人民-政府-私营合作 (PPPP)" })}</h3>
            <p>{translate(locale, {
              en: "Not PPP but PPPP. The extra P is for People. Recent successes and failures of smart city projects worldwide show the crucial need to communicate with citizens and galvanize their support.",
              th: "ไม่ใช่ PPP แต่เป็น PPPP โดยตัว P ที่เพิ่มขึ้นคือประชาชน เพื่อให้เกิดการมีส่วนร่วมที่แท้จริง ไม่เช่นนั้นโครงการจะขาดความยั่งยืน",
              zh: "不是PPP而是PPPP。额外的P是人民。没有人民参与，建设的基础设施没人会用。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">3</span>
            <h3>{translate(locale, { en: "Simultaneous physical + digital development", th: "พัฒนากายภาพและดิจิทัลไปพร้อมกัน", zh: "物理+数字同步发展" })}</h3>
            <p>{translate(locale, {
              en: "Cities still consist of connected physical spaces. Digital platforms are meaningless if goods and services cannot physically reach people.",
              th: "เมืองยังคงประกอบด้วยพื้นที่ทางกายภาพ แพลตฟอร์มดิจิทัลไม่มีความหมายถ้าบริการไม่ถึงมือคนจริง และไม่ครอบคลุมทุกคน",
              zh: "城市仍由连接的物理空间组成。如果商品和服务无法实际到达人们身边，数字平台毫无意义。"
            })}</p>
          </div>
        </div>
        <p className="program-source">{translate(locale, {
          en: "Source: Hitachi Review Vol. 70, No. 1 (2021) — Smart City Initiatives in Thailand",
          th: "ที่มา: Hitachi Review Vol. 70, No. 1 (2021) — Smart City Initiatives in Thailand",
          zh: "来源: Hitachi Review Vol. 70, No. 1 (2021)"
        })}</p>
      </section>

      {/* ─── PHOTO STRIP: Workshops ─── */}
      <div className="photo-strip">
        {PHOTOS_WORKSHOP.map(p => (
          <div key={p} className="photo-strip-item" style={{ width: "220px", height: "140px" }}>
            <img src={assetUrl(p)} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ─── TWO-FIVE-SEVEN ─── */}
      <section ref={mref257} className={`section reveal stagger-2 ${visible257 ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Two-Five-Seven", th: "สอง-ห้า-เจ็ด", zh: "二-五-七" })}</p>
        <h2>{translate(locale, { en: "The mnemonic that drives the program", th: "สูตรที่ขับเคลื่อนโครงการ", zh: "驱动项目的口诀" })}</h2>
        <div className="program-257-grid">
          <div className="program-257-card">
            <span className="program-257-num">2</span>
            <h3>{translate(locale, { en: "Two types of smart cities", th: "สองประเภทเมืองอัจฉริยะ", zh: "两种智慧城市" })}</h3>
            <p><strong>{translate(locale, { en: "Smart Livable City", th: "เมืองอัจฉริยะน่าอยู่", zh: "智慧宜居城市" })}</strong> {translate(locale, { en: "— existing cities.", th: "— เมืองที่มีอยู่แล้ว", zh: "— 现有城市。" })}</p>
            <p><strong>{translate(locale, { en: "Smart New City", th: "เมืองอัจฉริยะใหม่", zh: "智慧新城" })}</strong> {translate(locale, { en: "— new developments.", th: "— พัฒนาพื้นที่ใหม่", zh: "— 新城开发。" })}</p>
          </div>
          <div className="program-257-card">
            <span className="program-257-num">5</span>
            <h3>{translate(locale, { en: "Five criteria for development", th: "ห้าเกณฑ์การพัฒนา", zh: "五项发展标准" })}</h3>
            <ol className="program-criteria-list">
              <li>{translate(locale, { en: "Vision, goals, and geographic boundaries", th: "วิสัยทัศน์ เป้าหมาย และขอบเขตพื้นที่", zh: "愿景、目标和地理边界" })}</li>
              <li>{translate(locale, { en: "Infrastructure and investment plan", th: "แผนโครงสร้างพื้นฐานและการลงทุน", zh: "基础设施和投资计划" })}</li>
              <li>{translate(locale, { en: "City Data Platform (CDP) + cybersecurity", th: "แพลตฟอร์มข้อมูลเมือง (CDP) + ความปลอดภัยไซเบอร์", zh: "城市数据平台(CDP)+网络安全" })}</li>
              <li>{translate(locale, { en: "Urban systems and service projects", th: "ระบบเมืองและโครงการบริการ", zh: "城市系统和服务项目" })}</li>
              <li>{translate(locale, { en: "Management model and public participation", th: "รูปแบบการจัดการและการมีส่วนร่วม", zh: "管理模式和公众参与" })}</li>
            </ol>
          </div>
          <div className="program-257-card">
            <span className="program-257-num">7</span>
            <h3>{translate(locale, { en: "Seven smart dimensions", th: "เจ็ดมิติอัจฉริยะ", zh: "七个智慧维度" })}</h3>
            <div className="program-dims-grid">
              {dimensions.map(d => (
                <div key={d} className="program-dim-card">
                  <span className="program-dim-icon">{DIMENSION_ICONS[d]}</span>
                  <h3 className="program-dim-name">{DIMENSION_LABELS[locale][d]}</h3>
                  <p className="program-dim-desc">{locale === "th" ? DIMENSION_DESCS[d].th : (locale === "zh" ? DIMENSION_DESCS[d].zh : DIMENSION_DESCS[d].en)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHOTO STRIP: International ─── */}
      <div className="photo-strip">
        {PHOTOS_INTL.map(p => (
          <div key={p} className="photo-strip-item" style={{ width: "280px", height: "170px" }}>
            <img src={assetUrl(p)} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ─── CERTIFICATION PROCESS ─── */}
      <section ref={certRef} className={`section reveal stagger-3 ${certVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Process", th: "กระบวนการ", zh: "流程" })}</p>
        <h2>{translate(locale, { en: "How a city gets the logo", th: "เมืองได้ตราสัญลักษณ์อย่างไร", zh: "城市如何获得标识" })}</h2>
        <div className="program-cert-flow">
          {CERT_STEPS.map((step, i) => (
            <div key={i} className="program-cert-step">
              <span className="program-cert-number">{i + 1}</span>
              <h3 className="program-cert-label">{translate(locale, { en: step.en, th: step.th, zh: step.zh })}</h3>
              <p className="program-cert-desc">{translate(locale, { en: step.desc.en, th: step.desc.th, zh: step.desc.zh })}</p>
              {i < CERT_STEPS.length - 1 && <span className="program-cert-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── BATCH TIMELINE + KEY STATS ─── */}
      <section ref={batchRef} className={`section reveal stagger-4 ${batchVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Timeline", th: "ไทม์ไลน์", zh: "时间线" })}</p>
        <h2>{translate(locale, { en: "Four batches, eight years", th: "สี่รุ่น แปดปี", zh: "四批次，八年" })}</h2>
        <div className="program-batch-grid">
          {BATCHES.map(b => (
            <div key={b.batch} className="program-batch-card shadow-premium">
              <span className="program-batch-label">Batch {b.batch}</span>
              <span className="program-batch-year">{b.year}</span>
              <span className="program-batch-count">{b.cities} {translate(locale, { en: "cities", th: "เมือง", zh: "城市" })}</span>
              <span className="program-batch-tag">{translate(locale, { en: b.label.en, th: b.label.th, zh: b.label.zh })}</span>
            </div>
          ))}
        </div>

        <div className="program-stats-grid" style={{ marginTop: "1.5rem" }}>
          <div className="program-stat">
            <span className="program-stat-value">{stats.certified}</span>
            <span className="program-stat-label">{translate(locale, { en: "Certified", th: "รับรอง", zh: "认证" })}</span>
          </div>
          <div className="program-stat">
            <span className="program-stat-value">173+</span>
            <span className="program-stat-label">{translate(locale, { en: "Promotion zones", th: "เขตส่งเสริม", zh: "推广区" })}</span>
          </div>
          <div className="program-stat">
            <span className="program-stat-value">{stats.operational}</span>
            <span className="program-stat-label">{translate(locale, { en: "Operational", th: "ใช้งานจริง", zh: "运行中" })}</span>
          </div>
          <div className="program-stat">
            <span className="program-stat-value">105</span>
            <span className="program-stat-label">{translate(locale, { en: "Target by 2027", th: "เป้าหมาย 2570", zh: "2027目标" })}</span>
          </div>
        </div>
      </section>

      {/* ─── CDP + Primer Source ─── */}
      <section ref={cdpRef} className={`section reveal stagger-3 ${cdpVisible ? "visible" : ""}`} style={{ marginBottom: "3rem" }}>
        <div className="callout-card glass-card shadow-heavy" style={{ borderLeftColor: "var(--teal)" }}>
          <p className="eyebrow">{translate(locale, { en: "City Data Platform", th: "แพลตฟอร์มข้อมูลเมือง", zh: "城市数据平台" })}</p>
          <h2>{translate(locale, { en: "CDP: the digital backbone", th: "CDP: กระดูกสันหลังดิจิทัล", zh: "CDP: 数字主干" })}</h2>
          <p>
            {translate(locale, {
              en: "The City Data Platform integrates the large amount of data in cities to give a holistic view of a city’s condition.",
              th: "แพลตฟอร์มข้อมูลเมืองบูรณาการข้อมูลจำนวนมหาศาลในเมืองเพื่อให้เห็นภาพรวมสถานะของเมือง",
              zh: "CDP将城市大量数据整合，提供城市状况的全景视图。"
            })}
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button type="button" className="cta-button" onClick={() => onNavigate("/references")}>
              {translate(locale, { en: "View data sources", th: "ดูแหล่งข้อมูล", zh: "查看数据源" })}
            </button>
            <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
              {translate(locale, { en: "Explore rankings", th: "สำรวจอันดับ", zh: "探索排名" })}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
