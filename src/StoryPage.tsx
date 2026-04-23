import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface Spotlight {
  id: string;
  type: { en: string; th: string; zh: string };
  title: { en: string; th: string; zh: string };
  vibe: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
  metric: string;
  metricLabel: { en: string; th: string; zh: string };
}

const hotspots: Spotlight[] = [
  {
    id: "phuket",
    type: { en: "High Maturity", th: "วุฒิภาวะสูง", zh: "成熟度高" },
    title: { en: "Phuket: Operational Standard", th: "ภูเก็ต: มาตรฐานการดำเนินงาน", zh: "普吉：运营标准" },
    vibe: { en: "Established dataset. Real sensors, real revenue.", th: "ชุดข้อมูลที่สมบูรณ์ เซ็นเซอร์จริง รายได้จริง", zh: "完善的数据集。真实传感器，真实收入。" },
    body: {
      en: "Phuket scoring reflects Thailand's most mature IoT ecosystem. Beyond tourism marketing, it maintains genuine data pipelines for traffic and environmental monitoring.",
      th: "คะแนนของภูเก็ตสะท้อนถึงระบบนิเวศ IoT ที่ล้ำหน้าที่สุดของไทย นอกเหนือจากการตลาดท่องเที่ยว คือท่อส่งข้อมูลจริงสำหรับการจราจรและการติดตามสิ่งแวดล้อม",
      zh: "普吉岛的评分反映了泰国最成熟的物联网生态系统。除了旅游营销，它还维护着真实的交通和环境监测数据管道。",
    },
    metric: "88%",
    metricLabel: { en: "Efficiency", th: "ประสิทธิภาพ", zh: "效率" },
  },
  {
    id: "khon-kaen",
    type: { en: "Community Logic", th: "ตรรกะชุมชน", zh: "社区逻辑" },
    title: { en: "Khon Kaen: Local Consortium", th: "ขอนแก่น: กลุ่มพันธมิตท้องถิ่น", zh: "孔敬：地方联盟" },
    vibe: { en: "Public-Private infrastructure bet.", th: "การเดิมพันโครงสร้างพื้นฐานรัฐ-เอกชน", zh: "公私基础设施博弈。" },
    body: {
      en: "The KKTS model represents a shift from central dependency to local grit. Community-led investment in LRT and digital health networks is the benchmark for secondary cities.",
      th: "โมเดล KKTS แสดงให้เห็นถึงการเปลี่ยนจากการพึ่งพาสูุส่วนกลางเป็นพลังท้องถิ่น การลงทุนโดยชุมชนในด้าน LRT และเครือข่ายสุขภาพดิจิทัลคือมาตรฐานสำหรับเมืองรอง",
      zh: "KKTS 模式代表了从中央依赖到地方韧性的转变。社区主导的轻轨和数字医疗网络投资是二线城市的基准。",
    },
    metric: "72.4",
    metricLabel: { en: "Grit Score", th: "คะแนนความแกร่ง", zh: "韧性评分" },
  },
];

export default function StoryPage({ locale, onNavigate }: Props) {
  const [heroRef, heroVisible] = useInView(0.1);
  const [dataRef, dataVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="story-page">
      {/* SECTION 1: HERO */}
      <section ref={heroRef} className={`section story-hero reveal ${heroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Institutional Narrative", th: "เรื่องเล่าเชิงสถาบัน", zh: "制度叙事" })}</p>
        <h1 className="hero-title">
          {locale === "th" ? <>จากสถานะ<br />สู่ประสิทธิภาพ</> : locale === "zh" ? <>从地位<br />到效能</> : <>From Status<br />to Performance</>}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "Smart City Thailand was once a catalog of aspirations. SCITI 2026 converts that history into a technical record of auditable outcomes.",
            th: "สมาร์ทซิตี้ประเทศไทยเคยเป็นเพียงแคตตาล็อกของความหวัง SCITI 2569 เปลี่ยนประวัตินั้นเป็นบันทึกทางเทคนิคของผลลัพธ์ที่ตรวจสอบได้",
            zh: "泰国智慧城市曾是一本愿景手册。SCITI 2026 将这段历史转化为可审计成果的技术记录。",
          })}
        </p>
      </section>

      {/* SECTION 2: CASE AUDITS */}
      <section ref={dataRef} className={`section reveal ${dataVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Case Studies / Operational Audit", th: "กรณีศึกษา / การตรวจสอบการดำเนินงาน", zh: "案例研究 / 运营审计" })}</p>
        <div className="hotspot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          {hotspots.map(s => (
            <div key={s.id} className="data-sheet">
              <div className="data-row">
                <span className="data-label" style={{ color: 'var(--a-500)' }}>{t(s.type)}</span>
                <span className="data-label">#{s.id.toUpperCase()}</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{t(s.title)}</h2>
              <div className="data-row" style={{ border: 0 }}>
                <div className="data-note" style={{ color: 'var(--n-900)' }}>{t(s.body)}</div>
              </div>
              <div className="data-row">
                <span className="data-label">{t(s.metricLabel)}</span>
                <div className="data-value">{s.metric}</div>
              </div>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <button onClick={() => onNavigate(`/city/${s.id}`)} className="btn btn-secondary">
                  {t({ en: "Verify File →", th: "ตรวจสอบไฟล์ →", zh: "验证文件 →" })}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EVOLUTION */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Phase Transformation", th: "การเปลี่ยนผ่านระยะ", zh: "阶段转型" })}</p>
        <div className="data-sheet">
          <div className="data-sheet-title">{t({ en: "The Maturity Model (2018-2026)", th: "แบบจำลองวุฒิภาวะ (2561-2569)", zh: "成熟度模型 (2018-2026)" })}</div>
          <div className="data-row">
            <span className="data-label">PHASE 1</span>
            <div style={{ flex: 1, paddingLeft: 'var(--space-4)' }}>
              <div className="data-value">{t({ en: "The Hardware Procurement Era", th: "ยุคการจัดซื้อฮาร์ดแวร์", zh: "硬件采购时代" })}</div>
              <div className="data-note">{t({ en: "Command centers and dashboard theater. Success measured by number of sensors deployed.", th: "ศูนย์บัญชาการและแดชบอร์ด ความสำเร็จวัดจากจำนวนเซ็นเซอร์", zh: "指挥中心与仪表板表演。成功以部署传感器的数量来衡量。" })}</div>
            </div>
          </div>
          <div className="data-row">
            <span className="data-label">PHASE 2</span>
            <div style={{ flex: 1, paddingLeft: 'var(--space-4)' }}>
              <div className="data-value">{t({ en: "The Operational Reality Gap", th: "ช่องว่างความเป็นจริงในการดำเนินงาน", zh: "运营现实差距" })}</div>
              <div className="data-note">{t({ en: "Legacy infrastructure without maintenance. Stalled projects due to lack of local capacity.", th: "โครงข่ายที่ไม่มีการบำรุงรักษา โครงการหยุดชะงักเพราะขาดศักยภาพท้องถิ่น", zh: "缺乏维护的遗留基础设施。因地方能力不足导致的项目停滞。" })}</div>
            </div>
          </div>
          <div className="data-row">
            <span className="data-label">PHASE 3</span>
            <div style={{ flex: 1, paddingLeft: 'var(--space-4)' }}>
              <div className="data-value" style={{ color: 'var(--a-500)' }}>{t({ en: "Technical Performance (SCITI)", th: "ประสิทธิภาพทางเทคนิค (SCITI)", zh: "技术性能 (SCITI)" })}</div>
              <div className="data-note">{t({ en: "Automated outcome tracking. Just the mapping of citizens' needs to measurable performance.", th: "การติดตามผลลัพธ์อัตโนมัติ เหลือเพียงข้อมูลความต้องการชาวบ้านและผลลัพธ์", zh: "自动化结果跟踪。仅保留公民需求与可衡量绩效的映射。" })}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section ref={ctaRef} className={`section reveal visible ${ctaVisible ? "stagger-1" : ""}`} style={{ borderBottom: 0 }}>
        <div className="cta-block">
          <h2 className="cta-title">{t({ en: "Access the Industrial Baseline.", th: "เข้าถึงเกณฑ์ฐานระดับอุตสาหกรรม", zh: "访问工业基准。" })}</h2>
          <p className="cta-text">
            {t({
              en: "Marketing is over. The index provides the auditable record of what is actually running in Thailand today.",
              th: "การตลาดจบลงแล้ว ดัชนีนี้ให้บันทึกที่ตรวจสอบได้ของสิ่งที่ทำงานจริงในไทยวันนี้",
              zh: "营销结束了。该指数提供了泰国当今实际运行情况的可审计记录。",
            })}
          </p>
          <div className="cta-actions">
            <button onClick={() => onNavigate("/rankings")} className="btn btn-primary">
              {t({ en: "Examine Rankings", th: "ตรวจสอบอันดับ", zh: "检查排名" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
