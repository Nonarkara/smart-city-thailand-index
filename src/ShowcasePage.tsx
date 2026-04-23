import { translate } from "./cityPresentation";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const metrics = [
  { value: "112,000+", label: { en: "Active app users", th: "ผู้ใช้แอปที่ใช้งานจริง", zh: "活跃应用用户" } },
  { value: "38,000", label: { en: "Complaints resolved", th: "เรื่องร้องเรียนที่แก้แล้ว", zh: "已处理投诉" } },
  { value: "10h", label: { en: "Flood warning window", th: "เวลานำเตือนน้ำท่วม", zh: "洪灾预警窗口" } },
  { value: "0", label: { en: "Flood fatalities since 2021", th: "ผู้เสียชีวิตจากน้ำท่วมตั้งแต่ปี 2564", zh: "2021 年以来洪灾死亡数" } },
];

const ideas = [
  { id: "h-on-w", label: "01", title: { en: "HOSPITAL ON WHEELS", th: "โรงพยาบาลเคลื่อนที่", zh: "移动医院" }, desc: { en: "Mobile medical units bridging clinical gaps.", th: "หน่วยแพทย์เคลื่อนที่ลดช่องว่างการเข้าถึงคลินิก", zh: "配备医生、护士与远程医疗支持的移动医疗单元。" } },
  { id: "d-cat", label: "02", title: { en: "DIGITAL CATALOG", th: "แคตตาล็อกดิจิทัล", zh: "街头商贩数字目录" }, desc: { en: "QR-based economic inclusion for local merchants.", th: "การรวมตัวทางเศรษฐกิจดิจิทัลสำหรับผู้ค้ารายย่อย", zh: "基于 QR 的数字店面层，助力非正规摊贩进入数字经济。" } },
  { id: "m-class", label: "03", title: { en: "MAYOR'S CLASSROOM", th: "ห้องเรียนนายก", zh: "市长课堂" }, desc: { en: "Direct LINE-based institutional accountability.", th: "ความรับผิดชอบเชิงสถาบันผ่าน LINE โดยตรง", zh: "市长通过 LINE 进行定期直播问答问责。" } },
];

const beforeAfterRows = [
  { metric: { en: "Response time", th: "เวลาตอบสนอง", zh: "响应时间" }, before: "Fragmented/Slow", after: "Tracked Workflow" },
  { metric: { en: "Flood alerts", th: "การเตือนน้ำท่วม", zh: "洪水预警" }, before: "Reactive", after: "10-Hour Anticipation" },
];

export default function ShowcasePage({ locale, onNavigate }: Props) {
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="showcase-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. HERO SIGNAGE */}
      <section className="section hero-signage reveal visible">
        <p className="eyebrow">{t({ en: "Operational Showcase // NAKHON-audit", th: "ต้นแบบปฏิบัติการ // ตรวจสอบนครฯ", zh: "运营展示 // 洛坤府审计" })}</p>
        <h1 className="hero-title">{t({ en: "The City that Listened", th: "เมืองที่ฟังประชาชน", zh: "学会倾听的城市" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "Audit of Nakhon Si Thammarat's shift from ceremonial smart city plans to citizen-centric operational reality.",
            th: "การตรวจสอบการปรับเปลี่ยนของนครศรีธรรมราช จากแผนเมืองอัจฉริยะแบบพิธีการ สู่ความเป็นจริงที่ยึดประชาชนเป็นศูนย์กลาง",
            zh: "那空是贪玛叻从仪式性的智慧城市计划向以市民为中心的运营现实转变的审计。",
          })}
        </p>
      </section>

      {/* 2. OPERATIONAL METRICS */}
      <section className="section reveal visible">
        <div className="data-sheet" style={{ background: 'var(--n-900)', color: 'var(--n-0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', textAlign: 'center' }}>
            {metrics.map((m, i) => (
              <div key={i}>
                <div className="data-value" style={{ fontSize: '32px', color: 'var(--a-300)' }}>{m.value}</div>
                <div className="data-label" style={{ color: 'var(--n-400)' }}>{t(m.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CASE AUDIT */}
      <section className="section reveal visible">
         <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
           <div className="data-sheet">
             <div className="data-label" style={{ color: 'var(--a-500)' }}>CORE PRINCIPLE</div>
             <div className="data-sheet-title">{t({ en: "LOOP CLOSURE", th: "การปิดลูปบริการ", zh: "闭环服务" })}</div>
             <p className="data-note" style={{ color: 'var(--n-900)' }}>{t({ en: "Tracking, ratings, and alerts are tied into a singular accountability system.", th: "การติดตาม การให้คะแนน และการเตือนภัย ถูกผูกติดเข้ากับระบบความรับผิดชอบเดียว", zh: "追踪、评分和预警被绑入一个单一的问责体系。" })}</p>
           </div>
           <div className="data-sheet">
             <div className="data-label" style={{ color: 'var(--a-500)' }}>MODEL SCALE</div>
             <div className="data-sheet-title">{t({ en: "MODULAR REPLICATION", th: "แม่แบบที่ทำซ้ำได้", zh: "模块化复制" })}</div>
             <p className="data-note" style={{ color: 'var(--n-900)' }}>{t({ en: "Mechanics designed for local government scale, not billion-baht vanity projects.", th: "กลไกที่ออกแบบมาเพื่อสเกลท้องถิ่น ไม่ใช่โครงการโอ้อวดราคานับพันล้าน", zh: "专为地方政府规模设计的机制，而非耗资数十亿的虚荣项目。" })}</p>
           </div>
         </div>
      </section>

      {/* 4. PLAYBOOK MECHANICS */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Operational Playbook", th: "คู่มือปฏิบัติการ", zh: "运营手册" })}</p>
        <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2)' }}>
          {ideas.map(idea => (
            <div key={idea.id} className="data-sheet">
               <div className="data-row" style={{ padding: 0, marginBottom: 'var(--space-2)' }}>
                  <span className="data-label" style={{ fontWeight: 800, color: 'var(--a-500)' }}>{idea.label}</span>
                  <span className="data-sheet-title" style={{ flex: 1, textAlign: 'left' }}>{t(idea.title)}</span>
               </div>
               <p className="data-note" style={{ color: 'var(--n-900)' }}>{t(idea.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DELTA ANALYSIS */}
      <section className="section reveal visible">
         <p className="eyebrow">{t({ en: "Operational Delta", th: "ความเปลี่ยนแปลงที่เกิดขึ้น", zh: "运行增量" })}</p>
         <div className="data-sheet">
            <div className="data-row" style={{ borderBottom: '2px solid var(--n-900)', padding: 'var(--space-2) 0' }}>
               <span className="data-label" style={{ flex: 1, fontWeight: 800 }}>METRIC</span>
               <span className="data-label" style={{ flex: 1, fontWeight: 800 }}>BEFORE (ANALOG)</span>
               <span className="data-label" style={{ flex: 1, fontWeight: 800 }}>AFTER (OPERATIONAL)</span>
            </div>
            {beforeAfterRows.map((row, i) => (
              <div key={i} className="data-row">
                 <span className="data-value" style={{ flex: 1, fontSize: '14px', fontWeight: 700 }}>{t(row.metric)}</span>
                 <span className="data-note" style={{ flex: 1 }}>{row.before}</span>
                 <span className="data-value" style={{ flex: 1, color: 'var(--a-500)', fontWeight: 800 }}>{row.after.toUpperCase()}</span>
              </div>
            ))}
         </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="section reveal visible" style={{ borderBottom: 0, textAlign: 'center' }}>
         <div className="data-sheet" style={{ background: 'var(--n-50)' }}>
            <h2 className="cta-title">{t({ en: "EVERY CITY CAN LEARN FROM NAKHON", th: "ทุกเมืองเรียนรู้จากนครฯ ได้", zh: "城市的榜样" })}</h2>
            <p className="data-note" style={{ marginBottom: 'var(--space-4)' }}>{t({ en: "A city that listens beats a city that buys shiny hardware.", th: "เมืองที่รับฟังชนะเมืองที่ซื้อแค่ฮาร์ดแวร์เงาวับ", zh: "一座倾听的城市胜过一座只会购买闪亮设备的城市。" })}</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
               <button className="btn btn-primary" onClick={() => onNavigate("/city/nakhon-si-thammarat")}>FULL DOSSIER</button>
               <button className="btn btn-secondary" onClick={() => onNavigate("/rankings")}>RETURN TO INDEX</button>
            </div>
         </div>
      </section>
    </div>
  );
}
