import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

/* ─── DATA STRUCTURES ─── */

interface MacroStat {
  label: { en: string; th: string; zh: string };
  value: string;
  sub: { en: string; th: string; zh: string };
}

const macroStats: MacroStat[] = [
  {
    label: { en: "GDP (2024)", th: "GDP (2567)", zh: "GDP (2024)" },
    value: "$515B",
    sub: { en: "2.5% growth YoY", th: "เติบโต 2.5% YoY", zh: "同比增长2.5%" },
  },
  {
    label: { en: "FDI Inflows", th: "FDI ไหลเข้า", zh: "FDI流入" },
    value: "$10.2B",
    sub: { en: "BOI 2024 Annual Report", th: "รายงานประจำปี BOI 2567", zh: "BOI 2024年度报告" },
  },
  {
    label: { en: "Digital Economy Target", th: "เป้าหมายเศรษฐกิจดิจิทัล", zh: "数字经济目标" },
    value: "22%",
    sub: { en: "of GDP by 2027 (NESDC)", th: "ของ GDP ภายใน 2570 (สศช.)", zh: "占GDP比重，2027年目标 (NESDC)" },
  },
  {
    label: { en: "Smart City National Target", th: "เป้าหมายเมืองอัจฉริยะ", zh: "智慧城市国家目标" },
    value: "100",
    sub: { en: "cities by 2036 (depa)", th: "เมือง ภายใน 2579 (depa)", zh: "座城市，2036年目标 (depa)" },
  },
  {
    label: { en: "BOI Tax Holiday", th: "สิทธิประโยชน์ BOI", zh: "BOI税收优惠" },
    value: "8yr",
    sub: { en: "CIT exemption, targeted industries", th: "ยกเว้น CIT สำหรับอุตสาหกรรมเป้าหมาย", zh: "企业所得税免除，目标产业" },
  },
  {
    label: { en: "EEC Committed Investment", th: "การลงทุน EEC ที่ผูกพัน", zh: "EEC承诺投资" },
    value: "$43B",
    sub: { en: "Eastern Economic Corridor", th: "ระเบียงเศรษฐกิจพิเศษภาคตะวันออก", zh: "东部经济走廊" },
  },
];

interface InsightCard {
  tier: string;
  tierColor: string;
  headline: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
}

const insightCards: InsightCard[] = [
  {
    tier: "Alpha",
    tierColor: "var(--a-500)",
    headline: {
      en: "Composite score 65+ = Investable NOW",
      th: "คะแนนรวม 65+ = ลงทุนได้ทันที",
      zh: "综合评分65+ = 当下可投资",
    },
    body: {
      en: "Alpha cities have operational infrastructure, live data pipelines, and measurable citizen outcomes. Currently only 3-5 cities qualify. These are not promises — they are running systems.",
      th: "เมือง Alpha มีโครงสร้างพื้นฐานที่ใช้งานจริง มี data pipeline ที่ทำงานอยู่ และมีผลลัพธ์สำหรับพลเมืองที่วัดได้ ปัจจุบันมีเพียง 3-5 เมืองที่ผ่านเกณฑ์ สิ่งเหล่านี้ไม่ใช่คำสัญญา แต่คือระบบที่ทำงานจริง",
      zh: "Alpha城市拥有运营中的基础设施、实时数据管道和可衡量的市民成效。目前仅3-5座城市达标。这些不是承诺，而是运行中的系统。",
    },
  },
  {
    tier: "Beta",
    tierColor: "var(--s-warn)",
    headline: {
      en: "Score 45-64.9 = The growth arbitrage",
      th: "คะแนน 45-64.9 = โอกาสเก็งกำไรจากการเติบโต",
      zh: "评分45-64.9 = 增长套利机会",
    },
    body: {
      en: "Infrastructure is actively building, governance is partially digitized, and community buy-in is emerging. Entry at a discount before operational maturity. The 2-3 year window is open.",
      th: "โครงสร้างพื้นฐานกำลังก่อสร้าง การปกครองดิจิทัลเริ่มเป็นรูปเป็นร่าง และชุมชนเริ่มยอมรับ เข้าลงทุนในราคาส่วนลดก่อนจะเติบโตเต็มที่ หน้าต่าง 2-3 ปียังเปิดอยู่",
      zh: "基础设施正在积极建设，治理部分数字化，社区参与度正在提升。在运营成熟之前以折价进入。2-3年的窗口期仍然开放。",
    },
  },
];

interface Corridor {
  id: string;
  tag: string;
  tagColor: string;
  name: { en: string; th: string; zh: string };
  subtitle: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
  stats: { label: { en: string; th: string; zh: string }; value: string }[];
  opportunities: { en: string; th: string; zh: string };
}

const corridors: Corridor[] = [
  {
    id: "phuket",
    tag: "Alpha",
    tagColor: "var(--a-500)",
    name: {
      en: "Phuket Tourism-Tech Corridor",
      th: "ระเบียงเทคโนโลยีท่องเที่ยวภูเก็ต",
      zh: "普吉旅游科技走廊",
    },
    subtitle: {
      en: "Thailand's most data-mature smart city. Real sensors, real revenue.",
      th: "เมืองอัจฉริยะที่มีข้อมูลสมบูรณ์ที่สุดของไทย เซ็นเซอร์จริง รายได้จริง",
      zh: "泰国数据最成熟的智慧城市。真实传感器，真实收入。",
    },
    body: {
      en: "Phuket's tourism economy generates over 400B baht annually. Fujitsu AI traffic management has cut congestion on key corridors. The hospitality score of 88% reflects a city that knows how to monetize visitor experience.",
      th: "เศรษฐกิจการท่องเที่ยวภูเก็ตสร้างรายได้กว่า 400,000 ล้านบาทต่อปี ระบบ AI จัดการจราจรของ Fujitsu ลดการจราจรติดขัดบนเส้นทางหลัก คะแนน Hospitality 88% สะท้อนเมืองที่รู้วิธีสร้างรายได้จากประสบการณ์ของนักท่องเที่ยว",
      zh: "普吉旅游经济年收入超过4000亿泰铢。富士通AI交通管理系统已减少主要通道的拥堵。88%的款待评分反映了一座善于将游客体验变现的城市。",
    },
    stats: [
      { label: { en: "Hospitality Score", th: "คะแนนอัธยาศัย", zh: "款待评分" }, value: "88%" },
      { label: { en: "Tourism GDP", th: "GDP ท่องเที่ยว", zh: "旅游GDP" }, value: "400B+" },
      { label: { en: "Data Maturity", th: "ความสมบูรณ์ข้อมูล", zh: "数据成熟度" }, value: "High" },
    ],
    opportunities: {
      en: "PropTech / Tourism platforms / Smart mobility",
      th: "PropTech / แพลตฟอร์มท่องเที่ยว / การเดินทางอัจฉริยะ",
      zh: "房产科技 / 旅游平台 / 智慧出行",
    },
  },
  {
    id: "bangkok",
    tag: "Alpha",
    tagColor: "var(--a-500)",
    name: {
      en: "Bangkok Innovation Belt",
      th: "แถบนวัตกรรมกรุงเทพ",
      zh: "曼谷创新带",
    },
    subtitle: {
      en: "Samyan-Phra Ram 4 axis. Startup density, 5G testbed.",
      th: "แกนสามย่าน-พระราม 4 ความหนาแน่นของสตาร์ทอัพ 5G ทดสอบ",
      zh: "三养-拍喃四轴线。创业密度、5G试验区。",
    },
    body: {
      en: "The Samyan-Phra Ram 4 corridor houses 200+ startups, True Digital Park, and the One Bangkok development. As Thailand's sole Alpha-tier metropolis, FinTech, HealthTech, and EdTech ecosystems are self-sustaining.",
      th: "ระเบียง สามย่าน-พระราม 4 เป็นที่ตั้งของสตาร์ทอัพกว่า 200 แห่ง True Digital Park และโครงการ One Bangkok ในฐานะมหานครระดับ Alpha เพียงแห่งเดียวของไทย ระบบนิเวศ FinTech, HealthTech และ EdTech สามารถดำรงอยู่ได้ด้วยตัวเอง",
      zh: "三养-拍喃四走廊集聚了200多家初创企业、True Digital Park和One Bangkok项目。作为泰国唯一的Alpha级大都市，金融科技、健康科技和教育科技生态系统能够自我维持。",
    },
    stats: [
      { label: { en: "Startups", th: "สตาร์ทอัพ", zh: "初创企业" }, value: "200+" },
      { label: { en: "5G Coverage", th: "ครอบคลุม 5G", zh: "5G覆盖" }, value: "Live" },
      { label: { en: "Anchor", th: "จุดยึด", zh: "锚点" }, value: "TDP / CU" },
    ],
    opportunities: {
      en: "FinTech / HealthTech / Deep tech R&D",
      th: "FinTech / HealthTech / วิจัย Deep Tech",
      zh: "金融科技 / 健康科技 / 深科技研发",
    },
  },
];

interface Mechanism {
  name: { en: string; th: string; zh: string };
  desc: { en: string; th: string; zh: string };
  tag: string;
}

const mechanisms: Mechanism[] = [
  {
    name: { en: "BOI Privileges (Section 31)", th: "สิทธิประโยชน์ BOI (มาตรา 31)", zh: "BOI优惠 (第31条)" },
    desc: {
      en: "8-year corporate income tax exemption for S-Curve industries including digital, robotics, and medical hub sectors.",
      th: "ยกเว้นภาษีเงินได้นิติบุคคล 8 ปี สำหรับอุตสาหกรรม S-Curve ได้แก่ ดิจิทัล หุ่นยนต์ และศูนย์กลางการแพทย์",
      zh: "S曲线产业（包括数字、机器人和医疗中心）可享8年企业所得税免除。",
    },
    tag: "TAX",
  },
  {
    name: { en: "ADB ACGF", th: "ADB ACGF", zh: "亚行ACGF" },
    desc: {
      en: "ASEAN Catalytic Green Finance Facility. De-risks green infrastructure investments via co-lending.",
      th: "ลดความเสี่ยงการลงทุนโครงสร้างพื้นฐานสีเขียวผ่านการร่วมให้กู้สำหรับโครงการเมืองอัจฉริยะ",
      zh: "东盟催化绿色金融机制。通过联合贷款为智慧城市项目的绿色基础设施投资降低风险。",
    },
    tag: "GREEN",
  },
];

interface Risk {
  icon: string;
  title: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
  severity: "high" | "medium" | "low";
}

const risks: Risk[] = [
  {
    icon: "GOV",
    title: { en: "Centralized Bureaucracy", th: "ระบบราชการรวมศูนย์", zh: "中央集权官僚体制" },
    body: { en: "Budget approval flows through Bangkok, creating 12-18 month delays.", th: "การอนุมัติงบประมาณผ่านกรุงเทพฯ ทำให้เกิดความล่าช้า 12-18 เดือน", zh: "预算审批需经曼谷，造成12-18个月延误。" },
    severity: "high",
  },
];

/* ─── COMPONENT ─── */

export default function InvestPage({ locale, onNavigate }: Props) {
  const [heroRef, heroVisible] = useInView(0.1);
  const [macroRef, macroVisible] = useInView(0.1);
  const [insightRef, insightVisible] = useInView(0.1);
  const [corridorRef, corridorVisible] = useInView(0.1);
  const [mechRef, mechVisible] = useInView(0.1);
  const [riskRef, riskVisible] = useInView(0.1);

  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="invest-page">
      {/* 1. HERO */}
      <section ref={heroRef} className={`section story-hero reveal ${heroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Foreign Direct Strategy", th: "กลยุทธ์การลงทุนโดยตรง", zh: "外国直接战略" })}</p>
        <h1 className="hero-title">
          {locale === "th" ? <>การลงทุนเมืองอัจฉริยะ:<br />บันทึกขีดความสามารถ</> : locale === "zh" ? <>智慧城市投资：<br />运营能力记录</> : <>Smart City Investment:<br />Operational Capacity Record</>}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "This document audits Thailand's innovation corridors as structural opportunities rather than marketing prospects. We measure the grid, not the promise.",
            th: "เอกสารนี้ตรวจสอบระเบียงนวัตกรรมของไทยในฐานะโอกาสเชิงโครงสร้าง ไม่ใช่แค่ความหวังทางการตลาด เราวัดที่โครงข่าย ไม่ใช่คำสัญญา",
            zh: "本文件将泰国的创新走廊视为结构性机遇，而非营销前景。我们衡量的是电网，而非承诺。",
          })}
        </p>
      </section>

      {/* 2. MACRO SHOT */}
      <section ref={macroRef} className={`section reveal ${macroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Technical Baseline", th: "ฐานระดับเทคนิค", zh: "技术基准" })}</p>
        <div className="data-sheet">
          <div className="data-sheet-title">{t({ en: "Macro-Economic Aggregate (2024)", th: "ยอดรวมเศรษฐกิจมหภาค (2567)", zh: "宏观经济汇总 (2024)" })}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', background: 'var(--n-100)', border: '1px solid var(--n-100)' }}>
            {macroStats.map((s, i) => (
              <div key={i} style={{ background: 'var(--n-0)', padding: 'var(--space-2)' }}>
                <div className="data-label">{t(s.label)}</div>
                <div className="data-value" style={{ fontSize: '24px', fontWeight: 700 }}>{s.value}</div>
                <div className="data-note">{t(s.sub)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIGNALS */}
      <section ref={insightRef} className={`section reveal ${insightVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Market Intelligence", th: "ข้อมูลข่าวกรองตลาด", zh: "市场情报" })}</p>
        <div className="insight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          {insightCards.map((c, i) => (
            <div key={i} className="data-sheet">
              <div className="data-row">
                <span className="data-label" style={{ color: c.tierColor }}>{c.tier}</span>
                <div className="data-value">{t(c.headline)}</div>
              </div>
              <div className="data-row" style={{ border: 0 }}>
                <div className="data-note">{t(c.body)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CORRIDORS */}
      <section ref={corridorRef} className={`section reveal ${corridorVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Procedural Geography", th: "ภูมิศาสตร์เชิงกระบวนการ", zh: "程序地理" })}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          {corridors.map(c => (
            <div key={c.id} className="data-sheet">
              <div className="data-row">
                <span className="data-label" style={{ color: c.tagColor }}>{c.tag} / #{c.id.toUpperCase()}</span>
                <div className="data-value" style={{ fontWeight: 700, fontSize: '20px' }}>{t(c.name)}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--n-100)', borderTop: '1px solid var(--n-100)', borderBottom: '1px solid var(--n-100)' }}>
                {c.stats.map((st, j) => (
                  <div key={j} style={{ background: 'var(--n-0)', padding: 'var(--space-1) var(--space-2)' }}>
                    <div className="data-label">{t(st.label)}</div>
                    <div className="data-value">{st.value}</div>
                  </div>
                ))}
              </div>
              <div className="data-row">
                <span className="data-label">{t({ en: "Alpha Vertical", th: "กลุ่มอุตสาหกรรมเป้าหมาย", zh: "Alpha 垂直领域" })}</span>
                <div className="data-value" style={{ color: 'var(--a-500)', fontSize: 'var(--text-sm)' }}>{t(c.opportunities)}</div>
              </div>
              <div className="data-note" style={{ padding: 'var(--space-2) 0' }}>{t(c.subtitle)}</div>
              <div style={{ padding: 'var(--space-2) 0' }}>
                <button onClick={() => onNavigate(`/city/${c.id}`)} className="btn btn-secondary">
                  {t({ en: "Verify Dataset →", th: "ตรวจสอบชุดข้อมูล →", zh: "验证数据集 →" })}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RISKS */}
      <section ref={riskRef} className={`section reveal ${riskVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Systemic Friction", th: "แรงเสียดทานเชิงระบบ", zh: "系统磨损" })}</p>
        <div className="data-sheet">
          <div className="data-sheet-title">{t({ en: "Threat Vector Audit", th: "บันทึกปัจจัยความเสี่ยง", zh: "威胁向量审计" })}</div>
          {risks.map((r, i) => (
            <div key={i} className="data-row">
              <span className="data-label" style={{ color: 'var(--s-err)' }}>[{r.severity.toUpperCase()}] {r.icon}</span>
              <div style={{ flex: 1, paddingLeft: 'var(--space-4)' }}>
                <div className="data-value">{t(r.title)}</div>
                <div className="data-note">{t(r.body)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <div className="cta-block">
          <h2 className="cta-title">{t({ en: "Efficiency is not an aesthetic. It is a requirement.", th: "ประสิทธิภาพไม่ใช่แค่รสนิยม แต่คือข้อกำหนด", zh: "效率不是审美。它是要求。" })}</h2>
          <p className="cta-text">
            {t({
              en: "SCITI audits city capacity based on operational evidence. Use this record to de-risk your deployment strategy in Thailand.",
              th: "SCITI ตรวจสอบขีดความสามารถของเมืองจากหลักฐานการดำเนินงาน ใช้บันทึกนี้เพื่อลดความเสี่ยงในกลยุทธ์การลงทุนในไทย",
              zh: "SCITI 根据运营证据审计城市能力。利用此记录降低在泰部署策略的风险。",
            })}
          </p>
          <div className="cta-actions">
            <button onClick={() => onNavigate("/rankings")} className="btn btn-primary">
              {t({ en: "Analyze City Rankings", th: "วิเคราะห์อันดับเมือง", zh: "分析城市排名" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
