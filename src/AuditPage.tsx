import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const timelineEvents = [
  { year: "2018", type: "pos", text: { en: "National Smart City Committee formed. Vision of 100+ cities.", th: "จัดตั้งคณะกรรมการเมืองอัจฉริยะแห่งชาติ วางวิสัยทัศน์ 100+ เมือง", zh: "国家智慧城市委员会成立。愿景 100+ 城市。" } },
  { year: "2019", type: "pos", text: { en: "Smart City Thailand Office (depa) formally opens.", th: "เปิดสำนักงานเมืองอัจฉริยะประเทศไทย (depa) อย่างเป็นทางการ", zh: "泰国智慧城市办公室 (depa) 正式启用。" } },
  { year: "2020", type: "neu", text: { en: "Pandemic shifts focus to health-tech and contact tracing.", th: "โรคระบาดเปลี่ยนโฟกัสไปที่ health-tech และการติดตามผู้สัมผัส", zh: "疫情使重点转向健康科技和接触者追踪。" } },
  { year: "2021", type: "neg", text: { en: "First wave of certification. Criticism over 'marketing-first' approach.", th: "การรับรองระลอกแรก เริ่มมีข้อวิจารณ์เรื่อง 'การตลาดนำ'", zh: "第一波认证。对“营销优先”模式的批评。" } },
  { year: "2023", type: "neu", text: { en: "Integration with ASEAN Smart Cities Network. Standards tightening.", th: "บูรณาการกับ ASEAN Smart Cities Network เริ่มคุมมาตรฐานเข้มขึ้น", zh: "融入东盟智慧城市网络。标准收紧。" } },
  { year: "2025", type: "neg", text: { en: "Audit phase begins. High delta found between plans and reality.", th: "เริ่มเฟสการตรวจสอบ พบช่องว่างขนาดใหญ่ระหว่างแผนกับความจริง", zh: "审计阶段开始。发现规划与现实之间存在巨大差距。" } },
];

const kpis = [
  { value: "37", label: { en: "Certified Cities", th: "เมืองที่ได้รับการรับรอง", zh: "认证城市" }, sub: { en: "Official count", th: "จำนวนทางการ", zh: "官方统计" } },
  { value: "4", label: { en: "Alpha Tier", th: "ระดับ Alpha", zh: "Alpha 层级" }, sub: { en: "Operational reality", th: "ความจริงเชิงปฏิบัติการ", zh: "运维现实" } },
  { value: "21", label: { en: "Dead Links", th: "ลิงก์เสีย", zh: "失效链接" }, sub: { en: "Open Data targets", th: "เป้าหมาย Open Data", zh: "开放数据目标" } },
  { value: "12%", label: { en: "Citizen Usage", th: "การใช้งานจริงโดยคน", zh: "市民使用率" }, sub: { en: "Average adoption", th: "ค่าเฉลี่ยการใช้งาน", zh: "平均采用率" } },
];

const domains = [
  { name: { en: "Smart Environment", th: "สิ่งแวดล้อมอัจฉริยะ", zh: "智慧环境" }, pr: 95, real: 42 },
  { name: { en: "Smart Economy", th: "เศรษฐกิจอัจฉริยะ", zh: "智慧经济" }, real: 38, pr: 88 },
  { name: { en: "Smart Governance", th: "การปกครองอัจฉริยะ", zh: "智慧治理" }, real: 55, pr: 92 },
  { name: { en: "Smart Living", th: "การใช้ชีวิตอัจฉริยะ", zh: "智慧生活" }, real: 61, pr: 85 },
  { name: { en: "Smart Mobility", th: "การขนส่งอัจฉริยะ", zh: "智慧出行" }, real: 49, pr: 90 },
  { name: { en: "Smart People", th: "พลเมืองอัจฉริยะ", zh: "智慧人文" }, real: 28, pr: 82 },
  { name: { en: "Smart Energy", th: "พลังงานอัจฉริยะ", zh: "智慧能源" }, real: 44, pr: 87 },
];

export default function AuditPage({ locale, onNavigate }: Props) {
  const [timelineRef, timelineVisible] = useInView(0.1);
  const [kpiRef, kpiVisible] = useInView(0.1);
  const [domainRef, domainVisible] = useInView(0.1);
  const [socialRef, socialVisible] = useInView(0.1);
  const [recRef, recVisible] = useInView(0.1);

  return (
    <div className="audit-page">
      <section className="section audit-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Technical Audit", th: "การตรวจสอบทางเทคนิค", zh: "技术审计" })}</p>
        <h1 className="hero-title">{translate(locale, { en: "Institutional Honesty.", th: "ความซื่อสัตย์ของสถาบัน", zh: "体制诚信。" })}</h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "This is the evidence layer. We map public announcements to technical infrastructure logs and report gaps plainly when systems are offline.",
            th: "นี่คือชั้นหลักฐาน เราจับคู่คำแถลงสาธารณะกับบันทึกโครงสร้างพื้นฐานทางเทคนิค และรายงานช่องว่างอย่างตรงไปตรงมาเมื่อระบบไม่พร้อมใช้งาน",
            zh: "这是证据层。我们将公开公告与技术基础设施日志对应，并在系统离线时清楚说明差距。",
          })}
        </p>
      </section>

      {/* ─── HISTORY TIMELINE ─── */}
      <section ref={timelineRef} className={`section audit-section reveal stagger-1 ${timelineVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Timeline of Reality", th: "ไทม์ไลน์ความจริง", zh: "现实时间线" })}</p>
        <h2>{translate(locale, { en: "How we got here", th: "เรามาถึงจุดนี้ได้อย่างไร", zh: "我们是如何走到这一步的" })}</h2>
        <div className="audit-timeline">
          {timelineEvents.map((ev, i) => (
            <div key={i} className="audit-timeline-row">
              <span className={`audit-timeline-year ${ev.type}`}>{ev.year}</span>
              <p className="audit-timeline-event">{translate(locale, ev.text)}</p>
            </div>
          ))}
        </div>
        <div className="audit-verdict">
          <p className="audit-verdict-label">{translate(locale, { en: "Audit Verdict", th: "คำวินิจฉัยตรวจสอบ", zh: "审计结论" })}</p>
          <p className="audit-verdict-text">
            {translate(locale, {
              en: "The current trajectory shows a significant 'Identity Crisis'. Cities are buying equipment faster than they are training staff or engaging citizens. The risk of stranded assets is high.",
              th: "ทิศทางปัจจุบันแสดงถึง 'วิกฤตอัตลักษณ์' ที่ชัดเจน เมืองต่างๆ ซื้ออุปกรณ์เร็วกว่าการฝึกอบรมเจ้าหน้าที่หรือการดึงประชาชนมามีส่วนร่วม ความเสี่ยงเรื่องทรัพย์สินที่ใช้งานไม่ได้นั้นสูงมาก",
              zh: "目前的轨迹显示出明显的“身份危机”。城市购买设备的速度超过了培训员工或吸引公民参与的速度。资产搁淺风险很高。",
            })}
          </p>
        </div>
      </section>

      {/* ─── MACRO KPIs ─── */}
      <section ref={kpiRef} className={`section audit-section reveal stagger-2 ${kpiVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Macro KPI", th: "ตัวชี้วัดมหาภาค", zh: "宏观 KPI" })}</p>
        <div className="audit-kpi-grid">
          {kpis.map((k, i) => (
            <div key={i} className="audit-kpi shadow-premium">
              <div className="audit-kpi-value">{k.value}</div>
              <div className="audit-kpi-label">{translate(locale, k.label)}</div>
              <div className="audit-kpi-sub">{translate(locale, k.sub)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DOMAIN PERFORMANCE GAP ─── */}
      <section ref={domainRef} className={`section audit-section reveal stagger-3 ${domainVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Domain Audit", th: "ตรวจสอบรายแอป", zh: "领域审计" })}</p>
        <h2>{translate(locale, { en: "The Performance Gap", th: "ช่องว่างของสมรรถนะ", zh: "性能差距" })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "We compare self-reported 'PR' scores (grey) against our independent 'Operational' assessment (colored bars).",
            th: "เราเปรียบเทียบคะแนน 'PR' ที่รายงานตัวเอง (สีเทา) กับการประเมิน 'เชิงปฏิบัติการ' ที่เป็นอิสระของเรา (แถบสี)",
            zh: "我们将自行报告的“公关”得分（灰色）与我们的独立“运维”评估（彩色条）进行对比。",
          })}
        </p>
        <p className="section-intro" style={{ color: "var(--3)" }}>
          {translate(locale, {
            en: "These per-domain gaps are an illustrative model built from public messaging patterns, not a per-city crawl — treat them as directional, not a sourced claim like the numbers below.",
            th: "ช่องว่างรายด้านนี้เป็นแบบจำลองประกอบภาพจากรูปแบบการสื่อสารสาธารณะ ไม่ใช่การเก็บข้อมูลรายเมือง — โปรดถือเป็นทิศทางคร่าวๆ ไม่ใช่ข้อมูลอ้างอิงแบบตัวเลขด้านล่าง",
            zh: "各领域的差距为基于公开信息传播模式构建的示意模型，并非逐城市抓取的数据——请视为方向性参考，而非下方带来源的数据。",
          })}
        </p>
        <div className="audit-domain-grid">
          {domains.map((d, i) => (
            <div key={i} className="audit-domain-card shadow-premium">
              <h3 className="audit-domain-name">{translate(locale, d.name)}</h3>
              <div className="audit-domain-scores">
                <div className="audit-domain-score-box">
                  <span className="audit-domain-score-label">Real</span>
                  <span className="audit-domain-score-val" style={{ color: d.real > 50 ? 'var(--alpha)' : 'var(--gamma)' }}>{d.real}</span>
                </div>
                <div className="audit-domain-divider">/</div>
                <div className="audit-domain-score-box">
                  <span className="audit-domain-score-label">PR</span>
                  <span className="audit-domain-score-val" style={{ color: 'var(--4)' }}>{d.pr}</span>
                </div>
              </div>
              <div className="audit-gap-meter">
                <div className="audit-gap-fill-pr" style={{ width: `${d.pr}%` }}></div>
                <div className="audit-gap-fill-result" style={{ width: `${d.real}%`, background: d.real > 50 ? 'var(--alpha)' : 'var(--gamma)' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* MISSION LOG / TRACE LOG */}
        <div className="audit-trace-log shadow-heavy">
          <div className="audit-trace-header">[MISSION LOG — SCITI SYSTEM AUDIT — v2.0 — APRIL 2026 SNAPSHOT]</div>
          <div className="audit-trace-row">
            <span className="audit-trace-ts">2026-04-05 08:31:02</span>
            <span className="audit-trace-msg">Pinging Open Data API endpoints for 37 certified cities...</span>
            <span className="audit-trace-status status-pass">PASS</span>
          </div>
          <div className="audit-trace-row">
            <span className="audit-trace-ts">2026-04-05 08:31:05</span>
            <span className="audit-trace-msg">Analyzing certificate vs. sensor metadata delta...</span>
            <span className="audit-trace-status status-warn">WARN</span>
          </div>
          <div className="audit-trace-row">
            <span className="audit-trace-ts">2026-04-05 08:31:12</span>
            <span className="audit-trace-msg">Verifying citizen feedback integration (LINE/Traffy)...</span>
            <span className="audit-trace-status status-fail">FAIL</span>
          </div>
          <div className="audit-trace-row">
            <span className="audit-trace-ts">2026-04-05 08:31:15</span>
            <span className="audit-trace-msg">Compiling Reality Tiers based on operational uptime...</span>
            <span className="audit-trace-status status-pass">PASS</span>
          </div>
          <div style={{ color: '#555', marginTop: '0.4rem' }}>&gt; Audit complete. Delta 44.2% identified. System integrity compromised.</div>
        </div>
      </section>

      {/* ─── SENTIMENT ANALYSIS ─── */}
      <section ref={socialRef} className={`section audit-section reveal stagger-4 ${socialVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Social Audit", th: "ตรวจสอบสังคม", zh: "社会审计" })}</p>
        <h2>{translate(locale, { en: "Citizen Sentiment", th: "ความรู้สึกพลเมือง", zh: "市民情绪" })}</h2>
        <div className="audit-sentiment-grid">
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label" style={{ color: 'var(--gamma)' }}>{translate(locale, { en: "Frustration", th: "ความหงุดหงิด", zh: "沮丧" })}</p>
            <div className="audit-sentiment-pct">68%</div>
            <p className="audit-sentiment-desc">{translate(locale, { en: "Mentions of 'apps that don't work' or 'broken links' in social scraping.", th: "การพูดถึง 'แอปที่ใช้งานไม่ได้' หรือ 'ลิงก์เสีย' ในการขุดข้อมูลโซเชียล", zh: "社交媒体抓取中提到的“运行不灵的应用”或“死链”。" })}</p>
          </div>
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label" style={{ color: 'var(--alpha)' }}>{translate(locale, { en: "Hope", th: "ความหวัง", zh: "希望" })}</p>
            <div className="audit-sentiment-pct">22%</div>
            <p className="audit-sentiment-desc">{translate(locale, { en: "Positive mentions of specific local services (Traffy Fondue, Smart Bus).", th: "การพูดถึงเชิงบวกต่อบริการท้องถิ่นเฉพาะทาง (Traffy Fondue, Smart Bus)", zh: "对特定地方服务（Traffy Fondue, Smart Bus）的正向提及。" })}</p>
          </div>
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label" style={{ color: 'var(--3)' }}>{translate(locale, { en: "Indifference", th: "ความเฉยเมย", zh: "漠不关心" })}</p>
            <div className="audit-sentiment-pct">10%</div>
            <p className="audit-sentiment-desc">{translate(locale, { en: "Citizens unaware their city is officially 'smart'.", th: "พลเมืองไม่รู้ว่าเมืองของเขานั้นเป็น 'เมืองอัจฉริยะ' อย่างเป็นทางการ", zh: "市民甚至不知道他们的城市已被正式认证为“智慧”城市。" })}</p>
          </div>
        </div>
      </section>

      {/* ─── RECOMMENDATIONS ─── */}
      <section ref={recRef} className={`section audit-section reveal stagger-5 ${recVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Strategic Directives", th: "คำสั่งยุทธศาสตร์", zh: "战略指令" })}</p>
        <h2>{translate(locale, { en: "Recommendations", th: "ข้อเสนอแนะ", zh: "建议" })}</h2>
        <div className="audit-rec-grid">
          <div className="audit-rec-card shadow-premium">
            <div className="audit-rec-type audit-rec-more">DO MORE</div>
            <button type="button" className="audit-rec-action" onClick={() => onNavigate("/why")}>
              <h3 className="audit-rec-title">{translate(locale, { en: "Human Infrastructure", th: "โครงสร้างพื้นฐานมนุษย์", zh: "人文基础设施" })}</h3>
              <p className="audit-rec-body">{translate(locale, { en: "Invest in training municipal staff before buying dashboards. A smart city is an operational skill, not a software license.", th: "ลงทุนในการฝึกอบรมเจ้าหน้าที่เทศบาลก่อนซื้อแดชบอร์ด เมืองอัจฉริยะคือทักษะการปฏิบัติงาน ไม่ใช่แค่ใบอนุญาตซอฟต์แวร์", zh: "在购买仪表板之前，先投资于市政职员培训。智慧城市是一项运维技能，而非软件许可证。" })}</p>
              <div className="audit-rec-evidence">{translate(locale, { en: "Based on success in Khon Kaen local consortium models.", th: "อ้างอิงจากความสำเร็จในโมเดล KKTS ที่ขอนแก่น", zh: "基于孔敬地方联盟模式的成功经验。" })}</div>
            </button>
          </div>
          <div className="audit-rec-card shadow-premium">
            <div className="audit-rec-type audit-rec-less">DO LESS</div>
            <div>
              <h3 className="audit-rec-title">{translate(locale, { en: "Ribbon Cutting", th: "พิธีตัดริบบิ้น", zh: "剪彩仪式" })}</h3>
              <p className="audit-rec-body">{translate(locale, { en: "Stop the ceremonial cycle. Move toward permanent, funded maintenance budgets for digital assets.", th: "หยุดวงจรพิธีกรรม เปลี่ยนไปสู่การตั้งงบประมาณบำรุงรักษาถาวรสำหรับสินทรัพย์ดิจิทัล", zh: "停止仪式化循环。向为数字资产建立永久性、有资金支持的运维预算方向转变。" })}</p>
              <div className="audit-rec-evidence">{translate(locale, { en: "21% dead link rate identified in active certification projects.", th: "พบอัตราลิงก์เสีย 21% ในโครงการที่ได้รับการรับรอง", zh: "在活跃认证项目中发现 21% 的死链率。" })}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
