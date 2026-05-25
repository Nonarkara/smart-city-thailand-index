import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface IndicatorCard {
  dim: { en: string; th: string; zh: string };
  threshold: { en: string; th: string; zh: string };
}

const INDICATOR_CARDS: IndicatorCard[] = [
  {
    dim: { en: "Smart Energy", th: "พลังงานอัจฉริยะ", zh: "智慧能源" },
    threshold: {
      en: "≥50% renewable · 100% Smart Meters (AMI) · ≥40% GHG cut from BAU",
      th: "พลังงานหมุนเวียน ≥50% · มิเตอร์อัจฉริยะ 100% · ลด GHG ≥40% จากกรณีฐาน",
      zh: "可再生能源 ≥50% · 智能电表(AMI)100% · 温室气体较基准减少 ≥40%",
    },
  },
  {
    dim: { en: "Smart Environment", th: "สิ่งแวดล้อมอัจฉริยะ", zh: "智慧环境" },
    threshold: {
      en: "≥10 m² green space per resident · disaster climate adaptation plans required",
      th: "พื้นที่สีเขียว ≥10 ตร.ม./คน · ต้องมีแผนรับมือภัยพิบัติและการเปลี่ยนแปลงภูมิอากาศ",
      zh: "人均绿地 ≥10 平方米 · 必须制定气候灾害适应计划",
    },
  },
  {
    dim: { en: "Smart Mobility", th: "การเดินทางอัจฉริยะ", zh: "智慧出行" },
    threshold: {
      en: "Transit within 500m of all residences · cashless payments 100% · emergency drills ≥1/yr",
      th: "ระบบขนส่งสาธารณะภายใน 500 ม.จากที่พักทุกหลัง · ชำระเงินไร้เงินสด 100% · ฝึกซ้อมภัยพิบัติ ≥1 ครั้ง/ปี",
      zh: "公共交通覆盖所有住宅500米内 · 无现金支付100% · 应急演练 ≥1次/年",
    },
  },
  {
    dim: { en: "Smart Living", th: "การใช้ชีวิตอัจฉริยะ", zh: "智慧生活" },
    threshold: {
      en: "Preventive health data platform + child care centers + elderly day care + community health volunteers",
      th: "แพลตฟอร์มข้อมูลสุขภาพเชิงป้องกัน + ศูนย์เด็กเล็ก + ศูนย์ดูแลผู้สูงอายุ + อสม.",
      zh: "预防性健康数据平台 + 儿童托育中心 + 老年日间照料 + 社区健康志愿者",
    },
  },
  {
    dim: { en: "Smart Governance", th: "ธรรมาภิบาลอัจฉริยะ", zh: "智慧治理" },
    threshold: {
      en: "Open Government Data portal + one-stop service + external performance auditors",
      th: "พอร์ทัลข้อมูลเปิดภาครัฐ + บริการเบ็ดเสร็จ ณ จุดเดียว + ผู้ตรวจสอบประสิทธิภาพภายนอก",
      zh: "政府开放数据门户 + 一站式服务 + 外部绩效审计员",
    },
  },
  {
    dim: { en: "Smart Economy", th: "เศรษฐกิจอัจฉริยะ", zh: "智慧经济" },
    threshold: {
      en: "Incubation center + cashless society + Big Data infrastructure for business continuity",
      th: "ศูนย์บ่มเพาะ + สังคมไร้เงินสด + โครงสร้างพื้นฐาน Big Data เพื่อความต่อเนื่องทางธุรกิจ",
      zh: "孵化中心 + 无现金社会 + 业务连续性大数据基础设施",
    },
  },
];

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

const spotlights: Spotlight[] = [
  {
    id: "phuket",
    type: { en: "The Heavyweight", th: "รุ่นใหญ่", zh: "重量级" },
    title: { en: "Phuket: The Tourism Engine", th: "ภูเก็ต: เครื่องยนต์ท่องเที่ยว", zh: "普吉：旅游引擎" },
    vibe: { en: "High output, high data maturity. Real sensors, real impact.", th: "ผลลัพธ์สูง ข้อมูลพร้อม เซ็นเซอร์จริง ผลกระทบจริง", zh: "高产出，高数据成熟度。真实传感器，真实影响。" },
    body: {
      en: "Phuket isn't just a beach. It's Thailand's most mature data ecosystem, scoring high in Hospitality and Digital. From high-resolution CCTV to environmental sensors, it's the closest we have to a 'Running' smart city.",
      th: "ภูเก็ตไม่ใช่แค่หาดทราย แต่เป็นระบบนิเวศข้อมูลที่สมบูรณ์ที่สุดของไทย คะแนนสูงในด้าน Hospitality และ Digital ตั้งแต่ CCTV ความละเอียดสูงไปจนถึงเซ็นเซอร์สิ่งแวดล้อม นี่คือใกล้เคียงที่สุดกับคำว่าเมืองอัจฉริยะที่ 'ทำงานจริง'",
      zh: "普吉不仅有海滩。它是泰国最成熟的数据生态系统，在款待与数字维度得分很高。从高清监控到环境传感器，它是我们最接近“运行中”的智慧城市。",
    },
    metric: "88%",
    metricLabel: { en: "Efficiency Level", th: "ระดับประสิทธิภาพ", zh: "效率级别" },
  },
  {
    id: "khon-kaen",
    type: { en: "The Grit", th: "ใจสู้", zh: "韧性" },
    title: { en: "Khon Kaen: The Community Deal", th: "ขอนแก่น: สัญญาประชาคม", zh: "孔敬：社区契约" },
    vibe: { en: "Bottom-up innovation. Less flash, more infrastructure.", th: "นวัตกรรมจากล่างขึ้นบน แฟลชน้อยกว่า แต่โครงสร้างแน่นกว่า", zh: "自下而上的创新。少点噱头，多点基础设施。" },
    body: {
      en: "Khon Kaen is the 'people's city'. While others wait for central budgets, Khon Kaen builds its own Smart Bus and pushes for LRT via community-led investment. It scores high in Wellbeing and Economy through sheer local grit.",
      th: "ขอนแก่นคือ 'เมืองของประชาชน' ในขณะที่เมืองอื่นรอสมาธิจากส่วนกลาง ขอนแก่นสร้าง Smart Bus ของตัวเองและผลักดัน LRT ผ่านการลงทุนที่นำโดยชุมชน คะแนนสูงในด้าน Wellbeing และ Economy ด้วยความใจสู้ของคนในพื้นที่",
      zh: "孔敬是“人民的城市”。当其他城市在等待中央预算时，孔敬建立了自己的智慧巴士，并通过社区主导的投资推动轻轨建设。凭借地方韧性，它在福祉与经济方面得分很高。",
    },
    metric: "72.4",
    metricLabel: { en: "Grit Score", th: "คะแนนความใจสู้", zh: "韧性评分" },
  },
  {
    id: "wangchan-valley",
    type: { en: "The Reality Check", th: "ภาพสะท้อนความจริง", zh: "现实检查" },
    title: { en: "Wangchan Valley: The Lab Gap", th: "วังจันทร์วัลเลย์: ช่องว่างห้องทดลอง", zh: "旺参谷：实验室差距" },
    vibe: { en: "Masterplan vs. Operations. High potential, pre-population.", th: "แผนแม่บท vs. การปฏิบัติงาน ศักยภาพสูง อยู่ในระยะก่อนการอยู่อาศัย", zh: "总体规划 vs. 实际运营。潜力巨大，处于人口准备前期。" },
    body: {
      en: "Wangchan Valley represents an ambitious 'Silicon Valley' masterplan. The proposed infrastructure is highly advanced, but our index categorizes it as Gamma because it is currently pre-operational without an established resident population. It serves as the ultimate study in 'Planned' vs. 'Operational'.",
      th: "วังจันทร์วัลเลย์นำเสนอแผนแม่บท 'ซิลิคอนวัลเลย์' ที่ทะเยอทะยาน โครงสร้างพื้นฐานที่นำเสนอมีความก้าวหน้าสูง แต่ดัชนีของเราจัดให้อยู่ในกลุ่ม Gamma เนื่องจากปัจจุบันยังอยู่ในช่วงก่อนเริ่มปฏิบัติการและยังไม่มีกลุ่มประชากรอยู่อาศัยที่ชัดเจน จึงเป็นกรณีศึกษาสำคัญในการเปรียบเทียบระหว่าง 'แผนงาน' กับ 'การใช้งานจริง'",
      zh: "旺掺谷代表了一个雄心勃勃的“硅谷”总体规划。尽管拟建的基础设施高度先进，但我们的指数将其归类为 Gamma，因为它目前处于投入运营前的阶段，尚无常住人口。这是研究“规划中”与“实施中”差异的最佳案例。",
    },
    metric: "Gamma",
    metricLabel: { en: "Reality Tier", th: "ระดับความจริง", zh: "现实层级" },
  }
];

export default function StoryPage({ locale, onNavigate }: Props) {
  const [spotlightRef, spotlightVisible] = useInView(0.1);
  const [quoteRef, quoteVisible] = useInView(0.1);
  const [timelineRef, timelineVisible] = useInView(0.1);
  const [shiftRef, shiftVisible] = useInView(0.1);
  const [indicatorsRef, indicatorsVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  return (
    <div className="story-page">
      <section className="section story-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Storytelling", th: "เรื่องเล่า", zh: "故事" })}</p>
        <h1 className="hero-title">{translate(locale, { en: "From Sensors to Citizens", th: "จากเซ็นเซอร์สู่พลเมือง", zh: "从传感器到公民" })}</h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "The story of Thailand's smart city program isn't just about technology—it's about the shift from ribbon-cutting ceremonies to hard outcomes.",
            th: "เรื่องราวของโครงการเมืองอัจฉริยะไทยไม่ใช่แค่เรื่องเทคโนโลยี แต่คือการเปลี่ยนจากพิธีตัดริบบิ้นไปสู่ผลลัพธ์ที่จับต้องได้จริง",
            zh: "泰国智慧城市计划的故事不只是技术——它是关于从剪彩仪式走向硬核结果的转变。",
          })}
        </p>
      </section>

      {/* ─── CITY SPOTLIGHTS ─── */}
      <section ref={spotlightRef} className={`section reveal stagger-1 ${spotlightVisible ? "visible" : ""}`}>
        <div className="spotlight-grid">
          {spotlights.map(s => (
            <div key={s.id} className="spotlight-card glass-card shadow-premium">
              <div className="spotlight-header">
                <span className="spotlight-type">{translate(locale, s.type)}</span>
                <span className="spotlight-id">#{s.id.toUpperCase()}</span>
              </div>
              <h2 className="spotlight-title">{translate(locale, s.title)}</h2>
              <p className="spotlight-vibe">{translate(locale, s.vibe)}</p>
              <div className="spotlight-body">
                <p>{translate(locale, s.body)}</p>
              </div>
              <div className="spotlight-footer">
                <div className="spotlight-metric">
                  <span className="s-metric-value">{s.metric}</span>
                  <span className="s-metric-label">{translate(locale, s.metricLabel)}</span>
                </div>
                <button onClick={() => onNavigate(`/city/${s.id}`)} className="endpoint-link">
                  {translate(locale, { en: "Real-time Data →", th: "ข้อมูลเรียลไทม์ →", zh: "实时数据 →" })}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE PSYCHOLOGICAL SHIFT (QUOTES) ─── */}
      <section ref={quoteRef} className={`section reveal stagger-2 ${quoteVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Voice of Evolution", th: "วาทะแห่งการเปลี่ยนแปลง", zh: "进化之声" })}</p>
        <div className="quote-grid">
          <div className="quote-card">
            <p className="quote-text">
              {translate(locale, {
                en: "In 2018, we thought if we could just measure the number of sensors, we could measure progress. We were wrong.",
                th: "ในปี 2018 เราคิดว่าถ้าเราแค่วัดจำนวนเซ็นเซอร์ได้ เราก็วัดความก้าวหน้าได้ เราคิดผิด",
                zh: "2018年，我们以为只要能测量传感器的数量，就能测量进步。我们错了。",
              })}
            </p>
            <p className="quote-author">Nonarkara, 2018 (The Engineer Mindset)</p>
          </div>
          <div className="quote-card">
            <p className="quote-text">
              {translate(locale, {
                en: "Coined the term 'Citizen-Centric Smart City'. Because if the citizen's pulse doesn't slow down in a park, the IoT sensor failed.",
                th: "นิยามคำว่า 'เมืองอัจฉริยะแบบเน้นพลเมือง' เพราะถ้าชีพจรของพลเมืองไม่ช้าลงในสวนสาธารณะ เซ็นเซอร์ IoT ก็ล้มเหลว",
                zh: "创造了“以公民为中心的智慧城市”一词。因为如果公民在公园里脉搏没有慢下来，IoT传感器就失效了。",
              })}
            </p>
            <p className="quote-author">Nonarkara, 2026 (The Anthropological Shift)</p>
          </div>
        </div>
      </section>

      {/* ─── THE EVOLUTION TIMELINE ─── */}
      <section ref={timelineRef} className={`section reveal stagger-3 ${timelineVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Timeline", th: "ไทม์ไลน์", zh: "时间线" })}</p>
        <h2>{translate(locale, { en: "From Silicon to Soul", th: "จากซิลิคอนสู่จิตวิญญาณ", zh: "从硅片到灵魂" })}</h2>
        <div className="story-timeline">
          <div className="story-tl-item">
            <div className="story-tl-year">2018</div>
            <div className="story-tl-content">
              <h3 className="story-tl-title">{translate(locale, { en: "The Engineer Era", th: "ยุควิศวกร", zh: "工程师时代" })}</h3>
              <p className="story-tl-body">
                {translate(locale, {
                  en: "Focus on hardware, dashboards, and command centers. Smart City was seen as a technology shopping list.",
                  th: "โฟกัสที่ฮาร์ดแวร์ แดชบอร์ด และศูนย์บัญชาการ เมืองอัจฉริยะถูกมองเป็นเพียงรายการซื้อเทคโนโลยี",
                  zh: "聚焦于硬件、仪表板和指挥中心。智慧城市被视为技术采购清单。",
                })}
              </p>
            </div>
          </div>
          <div className="story-tl-item">
            <div className="story-tl-year">2021</div>
            <div className="story-tl-content">
              <h3 className="story-tl-title">{translate(locale, { en: "The Infrastructure Reality", th: "ความจริงของโครงสร้างพื้นฐาน", zh: "基础设施现实" })}</h3>
              <p className="story-tl-body">
                {translate(locale, {
                  en: "Realization that pipes and wires aren't enough. Projects stalled due to a lack of community buy-in and operational maintenance.",
                  th: "ตระหนักว่าท่อและสายไฟไม่เพียงพอ โครงการชะงักเพราะขาดการยอมรับจากชุมชนและการบำรุงรักษาในพื้นที่",
                  zh: "意识到仅有管道和线路是不够的。由于缺乏社区支持和运维支持，项目一度停滞。",
                })}
              </p>
            </div>
          </div>
          <div className="story-tl-item active">
            <div className="story-tl-year">2024</div>
            <div className="story-tl-content">
              <h3 className="story-tl-title">{translate(locale, { en: "The Anthropological Turn", th: "การหันเข้าสู่ด้านมานุษยวิทยา", zh: "人类学转向" })}</h3>
              <p className="story-tl-body">
                {translate(locale, {
                  en: "Shift to qualitative outcomes. Understanding urban psychology. Smart city as a tool for social equity and mental wellbeing.",
                  th: "เปลี่ยนขั้วสู่ผลลัพธ์เชิงคุณภาพ เข้าใจจิตวิทยาเมือง เมืองอัจฉริยะคือเครื่องมือเพื่อความเท่าเทียมทางสังคมและสุขภาวะทางจิต",
                  zh: "转向定性结果。理解城市心理学。智慧城市作为社会公平和心理健康的工具。",
                })}
              </p>
            </div>
          </div>
          <div className="story-tl-item active">
            <div className="story-tl-year">2026</div>
            <div className="story-tl-content">
              <h3 className="story-tl-title">{translate(locale, { en: "The Operational OS (SCITI)", th: "ระบบปฏิบัติการเมือง SCITI", zh: "城市操作系统 SCITI" })}</h3>
              <p className="story-tl-body">
                {translate(locale, {
                  en: "SCITI 2026 launches as a brutal mirror. No more marketing. Just the mapping of citizens' values to measurable city performance.",
                  th: "SCITI 2026 เปิดตัวเป็นกระจกสะท้อนความจริง เลิกทำมาร์เก็ตติ้ง เหลือเพียงการจับคู่อุดมคติของพลเมืองกับสมรรถนะเมืองที่วัดได้",
                  zh: "SCITI 2026 作为真实之镜发布。不再有营销，仅有公民价值观与可衡量城市绩效的映射。",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE TRANSFORMATION ─── */}
      <section ref={shiftRef} className={`section reveal stagger-4 ${shiftVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Transformation", th: "การเปลี่ยนแปลง", zh: "转化" })}</p>
        <h2>{translate(locale, { en: "The Cultural Shift", th: "การเปลี่ยนผ่านทางวัฒนธรรม", zh: "文化转变" })}</h2>
        <div className="story-shift-grid" style={{ borderTop: '2px solid var(--ink)', padding: '1rem 0' }}>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: '0', borderRadius: '0', borderRight: '1px solid var(--5)' }}>
            <h3 style={{ fontSize: '.85rem' }}>{translate(locale, { en: "Logo Distribution → Evidence Mapping", th: "การแจกโลโก้ → การวางแผนหลักฐาน", zh: "Logo分发 → 证据映射" })}</h3>
            <p style={{ fontSize: '.65rem' }}>{translate(locale, { en: "Certification used to be the end goal. Now, it's just the starting line for auditable outcomes.", th: "การรับรอบที่เคยเป็นความจบสิ้นแล้ว แต่ตอนนี้เป็นเป้าหมายที่มีการตรวจสอบได้", zh: "认证曾是终极目标。现在，它只是可审计结果的起点。" })}</p>
          </div>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: '0', borderRadius: '0', borderRight: '1px solid var(--5)' }}>
            <h3 style={{ fontSize: '.85rem' }}>{translate(locale, { en: "Technology Theater → Citizen Pain Points", th: "ละครเทคโนโลยี → จุดที่ประชาชนเดือนร้อน", zh: "技术表演 → 公民痛点" })}</h3>
            <p style={{ fontSize: '.65rem' }}>{translate(locale, { en: "Moving away from 'buying gadgets' to 'removing pain'. Every sensor must justify its utility.", th: "ย้ายหน้าจากการซื้ออุปกรณ์เป็นการแก้ปัญหา ทุกเซ็นเซอร์ต้องมีความรับผิดชอบ", zh: "从'购买小工具'转向'消除痛苦'。每个传感器都必须证明其效用。" })}</p>
          </div>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: '0', borderRadius: '0' }}>
            <h3 style={{ fontSize: '.85rem' }}>{translate(locale, { en: "Central Planning → Local Grit", th: "แผนจากส่วนกลาง → พลังท้องถิ่น", zh: "中央规划 → 地方韧性" })}</h3>
            <p style={{ fontSize: '.65rem' }}>{translate(locale, { en: "From waiting for Bangkok to empowerment of local consortiums like KKTS for resilience.", th: "ย้ายหน้าจากการรอฟังคำสั่งจากกรุงเทพเพื่อเสริมพลังท้องถิ่นในการพัฒนาความยืดหยุ่น", zh: "从等待曼谷指令转向赋权地方联盟（如KKTS）以增强韧性。" })}</p>
          </div>
        </div>
      </section>

      {/* ─── THE NUMBERS ARE MANDATORY ─── */}
      <section ref={indicatorsRef} className={`section reveal stagger-1 ${indicatorsVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Official Standards · depa Thailand", th: "มาตรฐานทางการ · depa ประเทศไทย", zh: "官方标准 · depa 泰国" })}</p>
        <h2>{translate(locale, { en: "What smart cities are actually required to deliver", th: "สิ่งที่เมืองอัจฉริยะต้องส่งมอบจริงๆ", zh: "智慧城市被实际要求交付的内容" })}</h2>
        <p className="hero-strapline" style={{ maxWidth: "680px", marginBottom: "2rem" }}>
          {translate(locale, {
            en: "These are not voluntary targets. Cities applying for Smart City Local status are evaluated against official depa thresholds. The following numbers are extracted from the depa 7 Smart City Indicators measurement framework.",
            th: "เหล่านี้ไม่ใช่เป้าหมายสมัครใจ เมืองที่สมัครสถานะ Smart City Local ถูกประเมินตามเกณฑ์ทางการของ depa ตัวเลขต่อไปนี้ถูกดึงมาจากกรอบการวัดผล 7 ตัวชี้วัดเมืองอัจฉริยะของ depa",
            zh: "这些不是自愿目标。申请智慧城市地方认证的城市将依据depa官方阈值进行评估。以下数据摘自depa 7项智慧城市指标测量框架。",
          })}
        </p>
        <div className="story-indicator-grid">
          {INDICATOR_CARDS.map((card, i) => (
            <div key={i} className="story-indicator-card">
              <p className="story-indicator-dim">{translate(locale, card.dim)}</p>
              <p className="story-indicator-threshold">{translate(locale, card.threshold)}</p>
            </div>
          ))}
        </div>
        <p className="story-indicator-note">
          {translate(locale, {
            en: "Source: 7 Smart City Indicators, Smart City Thailand Office (depa)",
            th: "ที่มา: 7 ตัวชี้วัดเมืองอัจฉริยะ, สำนักงานเมืองอัจฉริยะประเทศไทย (depa)",
            zh: "来源：7项智慧城市指标，泰国智慧城市办公室（depa）",
          })}
        </p>
      </section>

      {/* ─── CTA ─── */}
      <section ref={ctaRef} className={`section reveal stagger-3 ${ctaVisible ? "visible" : ""}`}>
        <div className="callout-card glass-card shadow-heavy">
          <h2>{translate(locale, { en: "The index is the accountability layer Thailand was missing.", th: "ดัชนีนี้คือชั้นความรับผิดรับชอบที่ประเทศไทยขาดหายไป", zh: "该指数是泰国缺失的问责层。" })}</h2>
          <p>{translate(locale, { en: "We score cities on what citizens experience—not what got presented on a deck.", th: "เราให้คะแนนเมืองจากสิ่งที่พลเมืองสัมผัส ไม่ใช่จากสิ่งที่นำเสนอในสไลด์", zh: "我们根据公民的体验为城市评分，而不是根据幻灯片上展示的内容。" })}</p>
          <div className="story-closing-actions">
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>
              {translate(locale, { en: "See the Rankings", th: "ดูการจัดอันดับ", zh: "查看排名" })}
            </button>
            <button className="ghost-button" onClick={() => onNavigate("/methodology")}>
              {translate(locale, { en: "Read Methodology", th: "อ่านระเบียบวิธีวิจัย", zh: "阅读方法论" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
