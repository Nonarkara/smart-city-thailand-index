import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface Spotlight {
  id: string;
  typeen: string;
  typeth: string;
  typezh: string;
  titleEn: string;
  titleTh: string;
  titleZh: string;
  vibeEn: string;
  vibeTh: string;
  vibeZh: string;
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
  metric: string;
  metricLabelEn: string;
  metricLabelTh: string;
}

const spotlights: Spotlight[] = [
  {
    id: "phuket",
    typeen: "The Heavyweight",
    typeth: "รุ่นใหญ่",
    typezh: "重量级",
    titleEn: "Phuket: The Tourism Engine",
    titleTh: "ภูเก็ต: เครื่องยนต์ท่องเที่ยว",
    titleZh: "普吉：旅游引擎",
    vibeEn: "High output, high data maturity. Real sensors, real impact.",
    vibeTh: "ผลลัพธ์สูง ข้อมูลพร้อม เซ็นเซอร์จริง ผลกระทบจริง",
    vibeZh: "高产出，高数据成熟度。真实传感器，真实影响。",
    bodyEn: "Phuket isn't just a beach. It's Thailand's most mature data ecosystem, scoring high in Hospitality and Digital. From high-resolution CCTV to environmental sensors, it's the closest we have to a 'Running' smart city.",
    bodyTh: "ภูเก็ตไม่ใช่แค่หาดทราย แต่เป็นระบบนิเวศข้อมูลที่สมบูรณ์ที่สุดของไทย คะแนนสูงในด้าน Hospitality และ Digital ตั้งแต่ CCTV ความละเอียดสูงไปจนถึงเซ็นเซอร์สิ่งแวดล้อม นี่คือใกล้เคียงที่สุดกับคำว่าเมืองอัจฉริยะที่ 'ทำงานจริง'",
    bodyZh: "普吉不仅有海滩。它是泰国最成熟的数据生态系统，在款待与数字维度得分很高。从高清监控到环境传感器，它是我们最接近“运行中”的智慧城市。",
    metric: "88%",
    metricLabelEn: "Efficiency Level",
    metricLabelTh: "ระดับประสิทธิภาพ",
  },
  {
    id: "khon-kaen",
    typeen: "The Grit",
    typeth: "ใจสู้",
    typezh: "韧性",
    titleEn: "Khon Kaen: The Community Deal",
    titleTh: "ขอนแก่น: สัญญาประชาคม",
    titleZh: "孔敬：社区契约",
    vibeEn: "Bottom-up innovation. Less flash, more infrastructure.",
    vibeTh: "นวัตกรรมจากล่างขึ้นบน แฟลชน้อยกว่า แต่โครงสร้างแน่นกว่า",
    vibeZh: "自下而上的创新。少点噱头，多点基础设施。",
    bodyEn: "Khon Kaen is the 'people's city'. While others wait for central budgets, Khon Kaen builds its own Smart Bus and pushes for LRT via community-led investment. It scores high in Wellbeing and Economy through sheer local grit.",
    bodyTh: "ขอนแก่นคือ 'เมืองของประชาชน' ในขณะที่เมืองอื่นรอสมาธิจากส่วนกลาง ขอนแก่นสร้าง Smart Bus ของตัวเองและผลักดัน LRT ผ่านการลงทุนที่นำโดยชุมชน คะแนนสูงในด้าน Wellbeing และ Economy ด้วยความใจสู้ของคนในพื้นที่",
    bodyZh: "孔敬是“人民的城市”。当其他城市在等待中央预算时，孔敬建立了自己的智慧巴士，并通过社区主导的投资推动轻轨建设。凭借地方韧性，它在福祉与经济方面得分很高。",
    metric: "72.4",
    metricLabelEn: "Grit Score",
    metricLabelTh: "คะแนนความใจสู้",
  },
  {
    id: "wangchan-valley",
    typeen: "The Reality Check",
    typeth: "ภาพสะท้อนความจริง",
    typezh: "现实检查",
    titleEn: "Wangchan Valley: The Lab Gap",
    titleTh: "วังจันทร์วัลเลย์: ช่องว่างห้องทดลอง",
    titleZh: "旺参谷：实验室差距",
    vibeEn: "The Paper Plan vs. Lived Reality. High potential, zero residents.",
    vibeTh: "แผนกระดาษ vs. ความจริงที่มีชีวิต ศักยภาพสูง แต่ยังไม่มีคนอยู่",
    vibeZh: "纸上规划 vs. 生活现实。潜力巨大，居民为零。",
    bodyEn: "Wangchan Valley is a bold 'Silicon Valley' pitch. The infrastructure is futuristic, but our index ranks it Gamma. Why? Because a city without residents is a lab, not a city. It’s the ultimate benchmark for 'Planned' vs. 'Operational'.",
    bodyTh: "วังจันทร์วัลเลย์คือ 'ซิลิคอนวัลเลย์' ที่กล้าหาญ โครงสร้างพื้นฐานดูล้ำยุค แต่ดัชนีของเราจัดให้อยู่ระดับ Gamma ทำไม? เพราะเมืองที่ไม่มีคนอยู่คือห้องทดลอง ไม่ใช่เมือง นี่คือจุดเปรียบเทียบที่ดีที่สุดระหว่าง 'แผน' กับ 'การใช้งานจริง'",
    bodyZh: "旺参谷是一个大胆的“硅谷”构想。基础设施颇具未来感，但我们的指数将其评为 Gamma。为什么？因为没有居民的城市只是一个实验室，而不是城市。它是“规划”与“运维”之间的终极基准。",
    metric: "Gamma",
    metricLabelEn: "Reality Tier",
    metricLabelTh: "ระดับความจริง",
  }
];

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

export default function StoryPage({ locale, onNavigate }: Props) {
  return (
    <div className="story-page">
      <section className="section story-hero reveal visible">
        <p className="eyebrow">{t(locale, "Storytelling", "เรื่องเล่า", "故事")}</p>
        <h1 className="hero-title">From Sensors to Citizens</h1>
        <p className="hero-strapline">
          {t(locale, 
            "The story of Thailand's smart city program isn't just about technology—it's about the shift from ribbon-cutting ceremonies to hard outcomes.",
            "เรื่องราวของโครงการเมืองอัจฉริยะไทยไม่ใช่แค่เรื่องเทคโนโลยี แต่คือการเปลี่ยนจากพิธีตัดริบบิ้นไปสู่ผลลัพธ์ที่จับต้องได้จริง",
            "泰国智慧城市计划的故事不只是技术——它是关于从剪彩仪式走向硬核结果的转变。")}
        </p>
      </section>

      {/* ─── CITY SPOTLIGHTS ─── */}
      <section className="section reveal stagger-1 visible">
        <div className="spotlight-grid">
          {spotlights.map(s => (
            <div key={s.id} className="spotlight-card glass-card shadow-premium">
              <div className="spotlight-header">
                <span className="spotlight-type">{t(locale, s.typeen, s.typeth, s.typezh)}</span>
                <span className="spotlight-id">#{s.id.toUpperCase()}</span>
              </div>
              <h2 className="spotlight-title">{t(locale, s.titleEn, s.titleTh, s.titleZh)}</h2>
              <p className="spotlight-vibe">{t(locale, s.vibeEn, s.vibeTh, s.vibeZh)}</p>
              <div className="spotlight-body">
                <p>{t(locale, s.bodyEn, s.bodyTh, s.bodyZh)}</p>
              </div>
              <div className="spotlight-footer">
                <div className="spotlight-metric">
                  <span className="s-metric-value">{s.metric}</span>
                  <span className="s-metric-label">{locale === "th" ? s.metricLabelTh : s.metricLabelEn}</span>
                </div>
                <button onClick={() => onNavigate(`/city/${s.id}`)} className="endpoint-link">Real-time Data →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE TRANSFORMATION ─── */}
      <section className="section reveal stagger-2 visible">
        <p className="eyebrow">Transformation</p>
        <h2>The Cultural Shift</h2>
        <div className="story-shift-grid">
          <div className="story-shift-card glass-card">
            <h3>Logo Distribution → Evidence Mapping</h3>
            <p>Certification used to be the end goal. Now, it's just the starting line for auditable outcomes.</p>
          </div>
          <div className="story-shift-card glass-card">
            <h3>Technology Theater → Citizen Pain Points</h3>
            <p>Moving away from 'buying gadgets' to 'removing pain'. Every sensor must justify its utility.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section reveal stagger-3 visible">
        <div className="callout-card glass-card shadow-heavy">
          <h2>The index is the accountability layer Thailand was missing.</h2>
          <p>We score cities on what citizens experience—not what got presented on a deck.</p>
          <div className="story-closing-actions">
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>See the Rankings</button>
            <button className="ghost-button" onClick={() => onNavigate("/methodology")}>Read Methodology</button>
          </div>
        </div>
      </section>
    </div>
  );
}
