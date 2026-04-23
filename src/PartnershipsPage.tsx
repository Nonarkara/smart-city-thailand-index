import { lazy, Suspense } from "react";
import type { Locale } from "./types";

const GlobeMap = lazy(() => import("./GlobeMap"));

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface Partnership {
  flag: string;
  country: string;
  countryTh: string;
  countryZh: string;
  program: string;
  year: string;
  investment: string;
  cities: string;
  focusEn: string;
  focusTh: string;
  focusZh: string;
  status: "active" | "completed" | "stalled" | "early";
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
  sourceUrl: string;
  sourceLabel: string;
}

const partnerships: Partnership[] = [
  {
    flag: "🇯🇵",
    country: "Japan",
    countryTh: "ญี่ปุ่น",
    countryZh: "日本",
    program: "JASCA / Smart JAMP",
    year: "2020–present",
    investment: "250B yen / $2.4B (ASEAN-wide)",
    cities: "Bangkok (Bangsue), Phuket, Chiang Mai, Khon Kaen, Chonburi",
    focusEn: "Autonomous transport, city data platforms, CCTV, PRT systems",
    focusTh: "ขนส่งอัตโนมัติ แพลตฟอร์มข้อมูลเมือง CCTV และระบบ PRT",
    focusZh: "自动交通、城市数据平台、CCTV 与 PRT 系统",
    status: "active",
    bodyEn: "Japan is the biggest external system-builder in this list. The programme-scale fund is regional, not Thailand-only, but Thailand repeatedly shows up in the delivery layer: Bangsue mapping for autonomous-route planning, city data platform work, and a standing coordination channel through JASCA.",
    bodyTh: "ญี่ปุ่นคือผู้เล่นต่างประเทศที่ลงมือสร้างระบบมากที่สุดในลิสต์นี้ เงินก้อนนี้เป็นระดับภูมิภาค ไม่ใช่เงินลงไทยล้วนๆ แต่ไทยโผล่อยู่ในชั้นการส่งมอบซ้ำๆ ทั้งงาน mapping ที่บางซื่อสำหรับเส้นทางอัตโนมัติ งาน city data platform และช่องทางประสานงานต่อเนื่องผ่าน JASCA",
    bodyZh: "日本是这份名单里最像“系统建设者”的外部伙伴。资金规模是区域级的，不是全部砸在泰国，但泰国持续出现在交付层：包括 Bangsue 自动驾驶路线测绘、城市数据平台工作，以及通过 JASCA 持续存在的协调通道。",
    sourceUrl: "https://www.jasca2021.jp/cooperative/country/thailand/",
    sourceLabel: "JASCA Thailand",
  },
  {
    flag: "🇺🇸",
    country: "United States",
    countryTh: "สหรัฐอเมริกา",
    countryZh: "美国",
    program: "U.S.-ASEAN Smart Cities Partnership",
    year: "2018–present",
    investment: "$10M initial (ASEAN-wide)",
    cities: "Bangkok, Phuket",
    focusEn: "Energy grid, water management, ICT infrastructure, 5G, cybersecurity",
    focusTh: "โครงข่ายพลังงาน จัดการน้ำ ICT โครงสร้างพื้นฐาน 5G และความปลอดภัยไซเบอร์",
    focusZh: "能源电网、水管理、ICT 基础设施、5G 与网络安全",
    status: "active",
    bodyEn: "The U.S. line is narrower but technically specific. Bangkok and Phuket are linked to concrete expertise rather than vague branding: renewable-grid planning, water-management exchanges, and technical assistance for Phuket's operations centre and communications stack.",
    bodyTh: "เส้นของสหรัฐแคบกว่า แต่เฉพาะทางเชิงเทคนิคกว่า กรุงเทพฯ และภูเก็ตเชื่อมกับความเชี่ยวชาญที่จับต้องได้ ไม่ใช่แค่แบรนด์ลอยๆ เช่น การวางแผนโครงข่ายพลังงาน งานจัดการน้ำ และ technical assistance สำหรับศูนย์ปฏิบัติการกับระบบสื่อสารของภูเก็ต",
    bodyZh: "美国这条线规模更窄，但技术指向更明确。曼谷与普吉对应的是具体专长，而不是抽象品牌：可再生能源电网规划、水管理交流，以及对普吉运营中心与通信栈的技术支持。",
    sourceUrl: "https://asean.usmission.gov/u-s-asean-smart-cities-partnership-usascp-sharing-expertise-between-cities-to-benefit-the-people-of-asean/",
    sourceLabel: "U.S. Mission to ASEAN",
  },
];

const statusLabels: Record<Partnership["status"], Record<Locale, string>> = {
  active: { en: "Active", th: "ยังเดินอยู่", zh: "仍在推进" },
  completed: { en: "Completed", th: "ส่งมอบแล้ว", zh: "已交付" },
  stalled: { en: "Stalled", th: "ติดคอขวด", zh: "推进受阻" },
  early: { en: "Early stage", th: "ยังต้นน้ำ", zh: "仍在早期" },
};

const statusNotes: Record<Partnership["status"], Record<Locale, string>> = {
  active: {
    en: "Visible follow-through or ongoing programme infrastructure still matters in the Thai context.",
    th: "ยังเห็น follow-through หรือโครงสร้างโปรแกรมที่มีผลต่อบริบทไทยอยู่",
    zh: "仍能看到后续动作，或项目基础设施仍对泰国情境有影响。",
  },
  completed: {
    en: "Delivered outputs are visible, even if the programme itself is no longer the main active channel.",
    th: "เห็น output ที่ส่งมอบแล้ว แม้โปรแกรมจะไม่ใช่ช่องทางหลักที่ active อยู่ในตอนนี้",
    zh: "交付成果仍然可见，即使该项目本身已不是当前最活跃通道。",
  },
  stalled: {
    en: "The diplomatic lane exists, but on-the-ground delivery momentum has clearly slowed or become intermittent.",
    th: "ช่องทางความร่วมมือยังมีอยู่ แต่แรงส่งในการลงมือทำจริงชะลอลงหรือไม่ต่อเนื่องอย่างชัดเจน",
    zh: "合作渠道仍在，但落地交付的动能已经明显放缓或变得断续。",
  },
  early: {
    en: "Too early to score as delivery. Treat this as pipeline signal rather than proof of execution.",
    th: "ยังเร็วเกินกว่าจะนับเป็นการส่งมอบ ให้มองเป็นสัญญาณในท่อ มากกว่าหลักฐานของการปฏิบัติ",
    zh: "现在还太早，不能算作交付成果。应将其视为管线信号，而非执行证明。",
  },
};

type Tri = { en: string; th: string; zh: string };

const TIMELINE: Array<{ year: string; flag: string; project: Tri; country: Tri }> = [
  { year: "2017", flag: "🇹🇭", project: { en: "depa established", th: "ก่อตั้ง depa", zh: "depa 成立" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2018", flag: "🇺🇸", project: { en: "U.S.-ASEAN Smart Cities Partnership ($10M)", th: "เปิดตัวความร่วมมือเมืองอัจฉริยะสหรัฐฯ-อาเซียน ($10M)", zh: "美国-东盟智慧城市伙伴关系启动 ($10M)" }, country: { en: "USA", th: "สหรัฐฯ", zh: "美国" } },
];

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

export default function PartnershipsPage({ locale, onNavigate }: Props) {
  const getCountry = (p: Partnership) => t(locale, p.country, p.countryTh, p.countryZh);
  const getFocus = (p: Partnership) => t(locale, p.focusEn, p.focusTh, p.focusZh);
  const getBody = (p: Partnership) => t(locale, p.bodyEn, p.bodyTh, p.bodyZh);

  return (
    <>
      <section className="section story-hero reveal visible">
        <p className="eyebrow">{t(locale, "Foreign Service Record", "บันทึกการทำงานต่างประเทศ", "外交服务记录")}</p>
        <h1 className="hero-title">
          {locale === "th"
            ? <>โครงสร้างพันธมิตร:<br />การตรวจสอบการส่งมอบ</>
            : locale === "zh"
              ? <>伙伴关系架构：<br />交付尽职调查</>
              : <>Partnership Architecture:<br />Delivery Due Diligence</>}
        </h1>
        <p className="hero-strapline">
          {t(
            locale,
            "Thailand's international smart-city partnerships are audited here as hard delivery signals rather than diplomatic theatre. We measure what stuck.",
            "ตรวจสอบพันธมิตรเมืองอัจฉริยะระหว่างประเทศของไทยในฐานะสัญญาณการส่งมอบจริง ไม่ใช่บทละครทางการทูต เราวัดความสำเร็จที่เกิดขึ้นจริง",
            "本文件将泰国的国际智慧城市伙伴关系视为硬交付信号，而非外交表演。我们衡量真正落地的成果。")}
        </p>
      </section>

      {/* ─── SUMMARY GRID ─── */}
      <section className="section reveal visible">
        <div className="data-sheet">
          <div className="data-sheet-title">{t(locale, "Alliance Infrastructure Aggregate", "ยอดรวมโครงสร้างพื้นฐานพันธมิตร", "联盟基础设施汇总")}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', background: 'var(--n-100)', border: '1px solid var(--n-100)' }}>
            <div style={{ background: 'var(--n-0)', padding: 'var(--space-2)' }}>
              <div className="data-label">{t(locale, "Partnership Tracks", "เส้นความร่วมมือ", "合作轨道")}</div>
              <div className="data-value" style={{ fontWeight: 700, fontSize: '24px' }}>06</div>
            </div>
            <div style={{ background: 'var(--n-0)', padding: 'var(--space-2)' }}>
              <div className="data-label">{t(locale, "Core Touchpoints", "จุดแตะหลัก", "核心触点")}</div>
              <div className="data-value" style={{ fontWeight: 700, fontSize: '24px' }}>12+</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GLOBE MAP ─── */}
      <section className="section reveal visible">
        <div className="data-sheet">
          <div className="data-sheet-title">{t(locale, "Geospatial Alignment", "การจัดวางเชิงพื้นที่", "地理空间对齐")}</div>
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--n-50)' }}>
            <Suspense fallback={<div className="data-note">Initializing Engine...</div>}>
              <GlobeMap locale={locale} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ─── PARTNERSHIP RECORDS ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t(locale, "Systemic Audits", "การตรวจสอบเชิงระบบ", "系统性审计")}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {partnerships.map(partnership => (
            <div key={partnership.country} className="data-sheet">
              <div className="data-row">
                <span className="data-label">{partnership.flag} {partnership.program}</span>
                <div className="data-value" style={{ fontWeight: 700, fontSize: '20px' }}>{getCountry(partnership)}</div>
              </div>
              <div className="data-row">
                <span className="data-label">{t(locale, "Operational Status", "สถานะการดำเนินงาน", "运营状态")}</span>
                <div className="data-value" style={{ color: partnership.status === 'stalled' ? 'var(--s-err)' : 'var(--a-500)', fontWeight: 700 }}>
                  {statusLabels[partnership.status][locale].toUpperCase()}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--n-100)', borderTop: '1px solid var(--n-100)', borderBottom: '1px solid var(--n-100)' }}>
                <div style={{ background: 'var(--n-0)', padding: 'var(--space-2)' }}>
                  <div className="data-label">{t(locale, "Capital Deployment", "การลงเงิน", "资本开发")}</div>
                  <div className="data-value" style={{ fontSize: 'var(--text-base)' }}>{partnership.investment}</div>
                </div>
                <div style={{ background: 'var(--n-0)', padding: 'var(--space-2)' }}>
                  <div className="data-label">{t(locale, "Targeted Corridors", "ระเบียงเป้าหมาย", "目标走廊")}</div>
                  <div className="data-value" style={{ fontSize: 'var(--text-base)' }}>{partnership.cities}</div>
                </div>
              </div>
              <div className="data-row">
                <span className="data-label">{t(locale, "Strategic Narrative", "คำอธิบายเชิงกลยุทธ์", "战略叙述")}</span>
                <div className="data-value" style={{ fontSize: 'var(--text-base)', lineHeight: 1.5 }}>{getBody(partnership)}</div>
              </div>
              <div style={{ background: 'var(--n-50)', padding: 'var(--space-2)', border: '1px solid var(--n-100)' }}>
                <div className="data-label" style={{ color: 'var(--a-500)' }}>{t(locale, "Procedural Lesson", "บทเรียนเชิงกระบวนการ", "程序性教训")}</div>
                <div className="data-note" style={{ color: 'var(--n-900)' }}>
                  {partnership.country === "Japan" 
                    ? t(locale, "Cameras vs Asphalt: AI traffic management is 1/10th the cost of road expansion with better long-term outcomes.", "กล้อง vs ยางมะตอย: AI จัดการจราจรประหยัดกว่าสร้างถนน 10 เท่า", "摄像头 vs 沥青：AI 驱动的交通管理成本仅为道路扩建的 1/10。")
                    : t(locale, "Standardization is Infrastructure: A common vocabulary is as important as fiber optic cables.", "มาตรฐานคือโครงสร้างพื้นฐาน: 'ศัพท์เทคนิคที่ตรงกัน' สำคัญเท่ากับสายไฟเบอร์", "标准即基础设施：统一的话语体系与光缆同样重要。")
                  }
                </div>
              </div>
              <div style={{ padding: 'var(--space-2) 0' }}>
                <a href={partnership.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  {t(locale, "Verify Source →", "ตรวจสอบต้นทาง →", "验证来源 →")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CALL TO ACCOUNTABILITY ─── */}
      <section className="section reveal visible" style={{ borderBottom: 0, marginBottom: 'var(--space-8)' }}>
        <div className="cta-block">
          <h2 className="cta-title">{t(locale, "Implementation is the only valid metric.", "การลงมือทำคือตัวชี้วัดเดียวที่มีความหมาย", "执行是唯一有效的衡量标准。")}</h2>
          <p className="cta-text">
            {t(locale,
              "Partnerships are recorded here as delivery signals. Use these as benchmarks for operational capacity in Thailand.",
              "เราบันทึกพันธมิตรในฐานะสัญญาณการส่งมอบเชิงปฏิบัติ ใช้สิ่งเหล่านี้เป็นพื้นฐานสำหรับขีดความสามารถในการดำเนินงาน",
              "伙伴关系在这里被记录为交付信号。请将其作为泰国运营能力的基准。")}
          </p>
          <div className="cta-actions">
            <button onClick={() => onNavigate("/rankings")} className="btn btn-primary">{t(locale, "See City Rankings", "ดูอันดับเมือง", "查看城市排名")}</button>
          </div>
        </div>
      </section>
    </>
  );
}
