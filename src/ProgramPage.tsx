import { useMemo } from "react";
import { allCities } from "./cityData";
import { summarizeCities } from "./cityCollections";
import type { Locale, SmartDimension } from "./types";
import { DIMENSION_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function t(l: Locale, en: string, th: string, zh: string) {
  return l === "th" ? th : l === "zh" ? zh : en;
}

const DIMENSION_ICONS: Record<SmartDimension, string> = {
  economy: "\u{1F4C8}",
  energy: "\u{26A1}",
  environment: "\u{1F33F}",
  governance: "\u{1F3DB}",
  living: "\u{1F3E0}",
  mobility: "\u{1F68C}",
  people: "\u{1F465}",
};

const DIMENSION_DESCRIPTIONS: Record<SmartDimension, { en: string; th: string; zh: string }> = {
  economy: { en: "Digital trade, startup ecosystems, financial inclusion, and innovation-driven growth.", th: "การค้าดิจิทัล ระบบนิเวศสตาร์ทอัพ การเงินดิจิทัล และการเติบโตจากนวัตกรรม", zh: "数字贸易、创业生态、金融包容和创新驱动增长。" },
  energy: { en: "Smart grids, renewable energy, energy efficiency monitoring, and clean transition.", th: "สมาร์ทกริด พลังงานหมุนเวียน ติดตามประสิทธิภาพพลังงาน และการเปลี่ยนผ่านสะอาด", zh: "智能电网、可再生能源、能效监测和清洁转型。" },
  environment: { en: "Air quality monitoring, waste management, water systems, and green space preservation.", th: "ติดตามคุณภาพอากาศ จัดการขยะ ระบบน้ำ และอนุรักษ์พื้นที่สีเขียว", zh: "空气质量监测、废弃物管理、水系统和绿地保护。" },
  governance: { en: "Open data, citizen participation, digital services, and transparent decision-making.", th: "ข้อมูลเปิด การมีส่วนร่วมของประชาชน บริการดิจิทัล และการตัดสินใจโปร่งใส", zh: "开放数据、公民参与、数字服务和透明决策。" },
  living: { en: "Housing, healthcare access, safety systems, and quality-of-life infrastructure.", th: "ที่อยู่อาศัย การเข้าถึงสาธารณสุข ระบบความปลอดภัย และโครงสร้างพื้นฐานคุณภาพชีวิต", zh: "住房、医疗可及性、安全系统和生活质量基础设施。" },
  mobility: { en: "Public transit, smart traffic, EV infrastructure, and connected transport systems.", th: "ขนส่งสาธารณะ จราจรอัจฉริยะ สถานีชาร์จ EV และระบบขนส่งเชื่อมต่อ", zh: "公共交通、智能交通、电动车基础设施和互联交通系统。" },
  people: { en: "Digital literacy, education technology, workforce development, and community engagement.", th: "ทักษะดิจิทัล เทคโนโลยีการศึกษา พัฒนากำลังคน และการมีส่วนร่วมชุมชน", zh: "数字素养、教育技术、劳动力发展和社区参与。" },
};

const CERT_STEPS = [
  { en: "Apply", th: "สมัคร", zh: "申请", desc: { en: "Municipality submits proposal with city master plan and smart city project blueprint.", th: "เทศบาลยื่นข้อเสนอพร้อมแผนแม่บทเมืองและพิมพ์เขียวโครงการ", zh: "市政提交提案，包含城市总体规划和智慧城市项目蓝图。" } },
  { en: "Evaluate", th: "ประเมิน", zh: "评估", desc: { en: "depa technical committee reviews across 7 dimensions. Field visits verify claims.", th: "คณะกรรมการเทคนิค depa ตรวจสอบ 7 มิติ ลงพื้นที่ตรวจสอบ", zh: "depa技术委员会按7个维度审查。实地考察验证声明。" } },
  { en: "Approve", th: "อนุมัติ", zh: "批准", desc: { en: "National Smart City Committee reviews and approves qualifying cities.", th: "คณะกรรมการเมืองอัจฉริยะแห่งชาติพิจารณาและอนุมัติ", zh: "国家智慧城市委员会审查并批准合格城市。" } },
  { en: "Certify", th: "รับรอง", zh: "认证", desc: { en: "City receives Smart City Local logo. Annual reporting begins.", th: "เมืองได้รับตราสัญลักษณ์ Smart City Local เริ่มรายงานประจำปี", zh: "城市获得Smart City Local标识。开始年度报告。" } },
];

const BATCHES = [
  { batch: 1, year: "2019", cities: 15, label: "Pioneers" },
  { batch: 2, year: "2021", cities: 15, label: "Expansion" },
  { batch: 3, year: "2023", cities: 6, label: "Consolidation" },
  { batch: 4, year: "2025", cities: 1, label: "Latest" },
];

export default function ProgramPage({ locale, onNavigate }: Props) {
  const stats = useMemo(() => summarizeCities(allCities), []);
  const dimensions: SmartDimension[] = ["economy", "energy", "environment", "governance", "living", "mobility", "people"];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section rankings-hero">
        <p className="eyebrow">{t(locale, "depa · MDES · Kingdom of Thailand", "depa · กระทรวง DE · ราชอาณาจักรไทย", "depa · MDES · 泰王国")}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}>
          {t(locale, "Smart City Thailand", "เมืองอัจฉริยะประเทศไทย", "泰国智慧城市")}
        </h1>
        <p className="hero-strapline">
          {t(locale,
            "Launched in 2018 under the Digital Economy Promotion Agency (depa) and the Ministry of Digital Economy and Society (MDES), the Smart City Thailand program certifies cities that demonstrate real progress across seven dimensions of urban intelligence. It is the national framework for building cities that work — not cities that look good on slides.",
            "เปิดตัวในปี 2561 ภายใต้สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) และกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม โครงการเมืองอัจฉริยะประเทศไทยรับรองเมืองที่แสดงความก้าวหน้าจริงใน 7 มิติของความฉลาดเมือง กรอบระดับชาติสำหรับสร้างเมืองที่ทำงานได้ ไม่ใช่เมืองที่ดูดีบนสไลด์",
            "2018年由数字经济促进局(depa)和数字经济与社会部(MDES)发起，泰国智慧城市计划认证在城市智能七个维度中展现真实进步的城市。这是建设真正有用的城市的国家框架。"
          )}
        </p>
        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          <a href="https://www.smartcitythailand.or.th/" target="_blank" rel="noopener noreferrer" className="cta-button">
            {t(locale, "Official website", "เว็บไซต์ทางการ", "官方网站")} →
          </a>
          <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
            {t(locale, "View index rankings", "ดูอันดับดัชนี", "查看排名")}
          </button>
        </div>
      </section>

      {/* ─── 7 DIMENSIONS ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Framework", "กรอบแนวคิด", "框架")}</p>
        <h2>{t(locale, "Seven dimensions of a smart city", "เจ็ดมิติของเมืองอัจฉริยะ", "智慧城市的七个维度")}</h2>
        <div className="program-dims-grid">
          {dimensions.map(d => (
            <div key={d} className="program-dim-card">
              <span className="program-dim-icon">{DIMENSION_ICONS[d]}</span>
              <h3 className="program-dim-name">{DIMENSION_LABELS[locale][d]}</h3>
              <p className="program-dim-desc">{DIMENSION_DESCRIPTIONS[d][locale]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CERTIFICATION PROCESS ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Process", "กระบวนการ", "流程")}</p>
        <h2>{t(locale, "How a city gets certified", "เมืองได้รับรองอย่างไร", "城市如何获得认证")}</h2>
        <div className="program-cert-flow">
          {CERT_STEPS.map((step, i) => (
            <div key={i} className="program-cert-step">
              <span className="program-cert-number">{i + 1}</span>
              <h3 className="program-cert-label">{step[locale]}</h3>
              <p className="program-cert-desc">{step.desc[locale]}</p>
              {i < CERT_STEPS.length - 1 && <span className="program-cert-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── BATCH TIMELINE ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Timeline", "ไทม์ไลน์", "时间线")}</p>
        <h2>{t(locale, "Four batches, eight years", "สี่รุ่น แปดปี", "四批次，八年")}</h2>
        <div className="program-batch-grid">
          {BATCHES.map(b => (
            <div key={b.batch} className="program-batch-card">
              <span className="program-batch-label">Batch {b.batch}</span>
              <span className="program-batch-year">{b.year}</span>
              <span className="program-batch-count">{b.cities} {t(locale, "cities", "เมือง", "城市")}</span>
              <span className="program-batch-tag">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── KEY STATS ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <div className="program-stats-grid">
          <div className="program-stat"><span className="program-stat-value">{stats.certified}</span><span className="program-stat-label">{t(locale, "Certified cities", "เมืองที่ได้รับรอง", "认证城市")}</span></div>
          <div className="program-stat"><span className="program-stat-value">173+</span><span className="program-stat-label">{t(locale, "Promotion zones", "เขตส่งเสริม", "推广区")}</span></div>
          <div className="program-stat"><span className="program-stat-value">7</span><span className="program-stat-label">{t(locale, "Dimensions", "มิติ", "维度")}</span></div>
          <div className="program-stat"><span className="program-stat-value">4</span><span className="program-stat-label">{t(locale, "Batches", "รุ่น", "批次")}</span></div>
          <div className="program-stat"><span className="program-stat-value">{stats.operational}</span><span className="program-stat-label">{t(locale, "Operational", "ใช้งานจริง", "运行中")}</span></div>
          <div className="program-stat"><span className="program-stat-value">105</span><span className="program-stat-label">{t(locale, "Target by 2027", "เป้าหมาย 2570", "2027目标")}</span></div>
        </div>
      </section>

      {/* ─── CDP CONNECTION ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <div className="callout-card" style={{ borderLeftColor: "var(--teal)" }}>
          <h2>{t(locale, "Connected to the City Data Platform", "เชื่อมต่อกับ City Data Platform", "连接到城市数据平台")}</h2>
          <p>
            {t(locale,
              "This index pulls data from 15+ government sources including NSO, NESDC, PCD, GISTDA, BOI, and depa's own citydata.in.th platform. Every score is traceable. Every claim has a source. The data layer is designed for long-term provincial analysis — not one-off snapshots.",
              "ดัชนีนี้ดึงข้อมูลจาก 15+ แหล่งข้อมูลราชการ รวมถึง NSO, NESDC, PCD, GISTDA, BOI และแพลตฟอร์ม citydata.in.th ของ depa ทุกคะแนนตรวจสอบได้ ทุกข้อกล่าวอ้างมีแหล่งที่มา ชั้นข้อมูลออกแบบสำหรับการวิเคราะห์ระดับจังหวัดระยะยาว",
              "本指数从15个以上政府来源获取数据，包括NSO、NESDC、PCD、GISTDA、BOI以及depa的citydata.in.th平台。每个分数可追溯，每个论断有来源。数据层专为长期省级分析设计。"
            )}
          </p>
          <div style={{ display: "flex", gap: ".4rem", marginTop: ".75rem" }}>
            <button type="button" className="cta-button" onClick={() => onNavigate("/references")}>
              {t(locale, "View all data sources", "ดูแหล่งข้อมูลทั้งหมด", "查看所有数据来源")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
