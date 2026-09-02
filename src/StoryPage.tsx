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
  {
    dim: { en: "Smart People", th: "คนอัจฉริยะ", zh: "智慧人才" },
    threshold: {
      en: "Digital literacy & ICT skills programs · lifelong learning centers · equal access to education technology",
      th: "โครงการพัฒนาทักษะดิจิทัลและ ICT · ศูนย์การเรียนรู้ตลอดชีวิต · การเข้าถึงเทคโนโลยีการศึกษาอย่างเท่าเทียม",
      zh: "数字素养与ICT技能项目 · 终身学习中心 · 平等获取教育技术",
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
      th: "ภูเก็ตไม่ใช่แค่หาดทราย แต่เป็นระบบนิเวศข้อมูลที่สมบูรณ์ที่สุดของไทย คะแนนสูงในด้านอัธยาศัยและดิจิทัล ตั้งแต่ CCTV ความละเอียดสูงไปจนถึงเซ็นเซอร์สิ่งแวดล้อม นี่คือใกล้เคียงที่สุดกับคำว่าเมืองอัจฉริยะที่ 'ทำงานจริง'",
      zh: "普吉不仅有海滩。它是泰国最成熟的数据生态系统，在人文与数字支柱得分很高。从高清监控到环境传感器，它是我们最接近“运行中”的智慧城市。",
    },
    metric: "88",
    metricLabel: { en: "Hospitality Score", th: "คะแนนอัธยาศัย", zh: "人文得分" },
  },
  {
    id: "khon-kaen",
    type: { en: "The Grit", th: "ใจสู้", zh: "韧性" },
    title: { en: "Khon Kaen: The Community Deal", th: "ขอนแก่น: สัญญาประชาคม", zh: "孔敬：社区契约" },
    vibe: { en: "Bottom-up innovation. Less flash, more infrastructure.", th: "นวัตกรรมจากล่างขึ้นบน แฟลชน้อยกว่า แต่โครงสร้างแน่นกว่า", zh: "自下而上的创新。少点噱头，多点基础设施。" },
    body: {
      en: "Khon Kaen is the 'people's city'. While others wait for central budgets, Khon Kaen builds its own Smart Bus and pushes for LRT via community-led investment. It scores high in Wellbeing and Economy through sheer local grit.",
      th: "ขอนแก่นคือ 'เมืองของประชาชน' ในขณะที่เมืองอื่นรอสมาธิจากส่วนกลาง ขอนแก่นสร้าง Smart Bus ของตัวเองและผลักดัน LRT ผ่านการลงทุนที่นำโดยชุมชน คะแนนสูงในด้านคุณภาพชีวิตและเศรษฐกิจ ด้วยความใจสู้ของคนในพื้นที่",
      zh: "孔敬是“人民的城市”。当其他城市在等待中央预算时，孔敬建立了自己的智慧巴士，并通过社区主导的投资推动轻轨建设。凭借地方韧性，它在福祉与经济方面得分很高。",
    },
    metric: "66.6",
    metricLabel: { en: "Composite Score", th: "คะแนนรวม", zh: "综合评分" },
  },
  {
    id: "wangchan-valley",
    type: { en: "The Reality Check", th: "ภาพสะท้อนความจริง", zh: "现实检查" },
    title: { en: "Wangchan Valley: The Lab Gap", th: "วังจันทร์วัลเลย์: ช่องว่างห้องทดลอง", zh: "旺湛谷：实验室差距" },
    vibe: { en: "Masterplan vs. Operations. High potential, pre-population.", th: "แผนแม่บท vs. การปฏิบัติงาน ศักยภาพสูง อยู่ในระยะก่อนการอยู่อาศัย", zh: "总体规划 vs. 实际运营。潜力巨大，处于人口准备前期。" },
    body: {
      en: "Wangchan Valley represents an ambitious 'Silicon Valley' masterplan. The proposed infrastructure is highly advanced, but our index categorizes it as Gamma because it is currently pre-operational without an established resident population. It serves as the ultimate study in 'Planned' vs. 'Operational'.",
      th: "วังจันทร์วัลเลย์นำเสนอแผนแม่บท 'ซิลิคอนวัลเลย์' ที่ทะเยอทะยาน โครงสร้างพื้นฐานที่นำเสนอมีความก้าวหน้าสูง แต่ดัชนีของเราจัดให้อยู่ในกลุ่ม Gamma เนื่องจากปัจจุบันยังอยู่ในช่วงก่อนเริ่มปฏิบัติการและยังไม่มีกลุ่มประชากรอยู่อาศัยที่ชัดเจน จึงเป็นกรณีศึกษาสำคัญในการเปรียบเทียบระหว่าง 'แผนงาน' กับ 'การใช้งานจริง'",
      zh: "旺湛谷代表了一个雄心勃勃的“硅谷”总体规划。尽管拟建的基础设施高度先进，但我们的指数将其归类为 Gamma，因为它目前处于投入运营前的阶段，尚无常住人口。这是研究“规划中”与“实施中”差异的最佳案例。",
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
                th: "ในปี 2018 ผมคิดว่าถ้าแค่วัดจำนวนเซ็นเซอร์ได้ ก็วัดความก้าวหน้าได้ ผมคิดผิด",
                zh: "2018年，我以为只要能测量传感器的数量，就能测量进步。我错了。",
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
                  en: "Hardware, dashboards, command centres — smart city as a technology shopping list. The programme opened with a central master plan that cities were invited to join, and certification criteria drafted to a high engineering standard.",
                  th: "ฮาร์ดแวร์ แดชบอร์ด ศูนย์บัญชาการ เมืองอัจฉริยะถูกมองเป็นรายการซื้อเทคโนโลยี โครงการเริ่มด้วยแผนแม่บทจากส่วนกลางแล้วเชิญเมืองเข้าร่วม พร้อมเกณฑ์การรับรองที่ร่างตามมาตรฐานวิศวกรรมระดับสูง",
                  zh: "硬件、仪表板、指挥中心——智慧城市被视为技术采购清单。项目以中央总体规划开局，邀请城市加入，认证标准则按高工程标准起草。",
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
                  en: "Pipes and wires were not enough: projects stalled without community buy-in or a maintenance path. About two years in it was also clear the original criteria were not filtering for quality, they were filtering out participation — almost no municipality could meet them, so they were rewritten toward outcomes a city can observe directly.",
                  th: "ท่อและสายไฟไม่เพียงพอ โครงการชะงักเพราะขาดการยอมรับจากชุมชนและเส้นทางการบำรุงรักษา ผ่านไปราวสองปีก็ชัดว่าเกณฑ์ชุดแรกไม่ได้คัดกรองคุณภาพ แต่คัดคนออกจากการเข้าร่วม เพราะแทบไม่มีเทศบาลใดผ่านได้ จึงเขียนใหม่ให้มุ่งผลลัพธ์ที่เมืองสังเกตได้เอง",
                  zh: "管道和线路并不够：缺少社区认同与维护路径，项目随之停滞。约两年后也看清了，最初的标准筛的不是质量，而是把参与者筛掉了——几乎没有市镇能达标，于是被改写为城市可直接观察的结果。",
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
                  en: "Qualitative outcomes, urban psychology, equity and mental wellbeing — arrived at by fieldwork rather than by theory. Policy stopped being written first and started being written from what visiting the municipalities actually turned up.",
                  th: "ผลลัพธ์เชิงคุณภาพ จิตวิทยาเมือง ความเท่าเทียมและสุขภาวะทางจิต ทั้งหมดมาจากการลงพื้นที่ ไม่ใช่จากทฤษฎี นโยบายเลิกถูกเขียนก่อน และเริ่มถูกเขียนจากสิ่งที่พบจริงเมื่อไปเยือนเทศบาล",
                  zh: "定性结果、城市心理学、公平与心理健康——这些是通过实地工作得出的，而非源自理论。政策不再被预先写好，而是开始依据走访市镇后真正发现的东西来写。",
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

      {/* ─── THE METHOD — how the anthropological turn actually happened ───
           The timeline above says policy shifted from central planning to
           fieldwork. This section is the evidence for that claim: what was
           tried first, why it failed, and the practice that replaced it. */}
      <section className="section reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Method", th: "วิธีทำงาน", zh: "工作方法" })}</p>
        <h2>{translate(locale, { en: "How the pain points were actually found", th: "ค้นหาปัญหาที่แท้จริงได้อย่างไร", zh: "真正的痛点是怎么找到的" })}</h2>
        <p className="hero-strapline" style={{ maxWidth: "680px", marginBottom: "1.5rem" }}>
          {translate(locale, {
            en: "Top-down was tried first. It failed for a structural reason rather than a political one: a central agency cannot know what a specific municipality needs. The centre thinks in national policy — adopt 5G everywhere — while a small municipality may want wastewater treatment. Both are reasonable. They are not the same problem, and no master plan written in Bangkok can tell them apart.",
            th: "แนวทางบนลงล่างถูกลองก่อน และล้มเหลวด้วยเหตุผลเชิงโครงสร้างมากกว่าเหตุผลทางการเมือง คือหน่วยงานส่วนกลางไม่มีทางรู้ว่าเทศบาลแห่งหนึ่งต้องการอะไร ส่วนกลางคิดเป็นนโยบายระดับชาติ เช่น ให้ใช้ 5G ทั่วประเทศ ขณะที่เทศบาลเล็ก ๆ อาจต้องการระบบบำบัดน้ำเสีย ทั้งสองอย่างสมเหตุสมผล แต่ไม่ใช่ปัญหาเดียวกัน และไม่มีแผนแม่บทที่เขียนในกรุงเทพฯ ฉบับใดแยกแยะสองสิ่งนี้ออกจากกันได้",
            zh: "自上而下的做法先被尝试过。它的失败源于结构性原因而非政治原因：中央机构无法知道某个具体市镇需要什么。中央以国家政策思考——全国部署5G——而一个小市镇想要的可能是污水处理。两者都合理，但不是同一个问题，而任何在曼谷写就的总体规划都无法分辨二者。",
          })}
        </p>
        <div className="story-shift-grid" style={{ borderTop: "2px solid var(--ink)", padding: "1rem 0" }}>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: "0", borderRadius: "0", borderRight: "1px solid var(--5)" }}>
            <h3 style={{ fontSize: "var(--text-body)" }}>{translate(locale, { en: "1 · Go there", th: "1 · ไปให้ถึงพื้นที่", zh: "1 · 亲自到场" })}</h3>
            <p style={{ fontSize: "var(--text-body)" }}>
              {translate(locale, {
                en: "Thailand has roughly 7,000 local administrative organisations. Over eight years of the programme, about half have been visited in person — by train, by bus, staying a week, eating and living in the community. Pain points do not survive a questionnaire; they surface on the fourth day.",
                th: "ไทยมีองค์กรปกครองส่วนท้องถิ่นราว 7,000 แห่ง ตลอดแปดปีของโครงการ ได้ลงพื้นที่จริงไปแล้วราวครึ่งหนึ่ง ทั้งโดยรถไฟ รถโดยสาร พักค้างเป็นสัปดาห์ กินและใช้ชีวิตอยู่กับชุมชน ปัญหาที่แท้จริงไม่ปรากฏในแบบสอบถาม แต่โผล่ขึ้นมาในวันที่สี่",
                zh: "泰国约有7,000个地方行政组织。在项目的八年间，其中约一半已被实地走访——搭火车、坐巴士，一住就是一周，与社区同吃同住。真正的痛点在问卷里活不下来，它们出现在第四天。",
              })}
            </p>
          </div>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: "0", borderRadius: "0", borderRight: "1px solid var(--5)" }}>
            <h3 style={{ fontSize: "var(--text-body)" }}>{translate(locale, { en: "2 · Find the repeat", th: "2 · หาสิ่งที่ซ้ำ", zh: "2 · 找出重复项" })}</h3>
            <p style={{ fontSize: "var(--text-body)" }}>
              {translate(locale, {
                en: "One city's problem is a case. The same problem in forty cities is a policy. The work between the two is pattern-finding, and it is the step that a central master plan skips — which is why its solutions fit the plan rather than the place.",
                th: "ปัญหาของเมืองเดียวคือกรณีศึกษา ปัญหาเดียวกันในสี่สิบเมืองคือนโยบาย งานที่อยู่ตรงกลางคือการหาแบบแผนร่วม และเป็นขั้นที่แผนแม่บทจากส่วนกลางข้ามไป จึงได้คำตอบที่เข้ากับแผน มากกว่าเข้ากับพื้นที่",
                zh: "一座城市的问题是个案。四十座城市的同一个问题才是政策。两者之间的工作是找出共性，而这正是中央总体规划跳过的一步——所以它的方案贴合的是规划，而不是地方。",
              })}
            </p>
          </div>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: "0", borderRadius: "0" }}>
            <h3 style={{ fontSize: "var(--text-body)" }}>{translate(locale, { en: "3 · Then write the policy", th: "3 · แล้วจึงเขียนนโยบาย", zh: "3 · 然后才写政策" })}</h3>
            <p style={{ fontSize: "var(--text-body)" }}>
              {translate(locale, {
                en: "Policy is still written top-down — it has to be. The change is sequencing: it is written after the evidence rather than before it. That single reordering is what separates the current programme from the one that launched in 2018.",
                th: "นโยบายยังเขียนจากบนลงล่างอยู่ และต้องเป็นเช่นนั้น สิ่งที่เปลี่ยนคือลำดับ คือเขียนหลังมีหลักฐาน ไม่ใช่ก่อน การสลับลำดับเพียงข้อเดียวนี้คือสิ่งที่แยกโครงการในปัจจุบันออกจากโครงการที่เริ่มต้นในปี 2561",
                zh: "政策依然自上而下地制定——这是必然的。改变的是次序：它写在证据之后，而不是之前。仅仅这一处顺序的调换，就把今天的项目与2018年启动的那个区分开来。",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ─── THE TRANSFORMATION ─── */}
      <section ref={shiftRef} className={`section reveal stagger-4 ${shiftVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Transformation", th: "การเปลี่ยนแปลง", zh: "转化" })}</p>
        <h2>{translate(locale, { en: "The Cultural Shift", th: "การเปลี่ยนผ่านทางวัฒนธรรม", zh: "文化转变" })}</h2>
        <div className="story-shift-grid" style={{ borderTop: '2px solid var(--ink)', padding: '1rem 0' }}>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: '0', borderRadius: '0', borderRight: '1px solid var(--5)' }}>
            <h3 style={{ fontSize: 'var(--text-body)' }}>{translate(locale, { en: "Logo Distribution → Evidence Mapping", th: "การแจกโลโก้ → การวางแผนหลักฐาน", zh: "Logo分发 → 证据映射" })}</h3>
            <p style={{ fontSize: 'var(--text-body)' }}>{translate(locale, { en: "Certification used to be the end goal. Now, it's just the starting line for auditable outcomes.", th: "การรับรองเคยเป็นเป้าหมายสูงสุด แต่ตอนนี้มันคือเพียงเส้นเริ่มต้นของผลลัพธ์ที่ตรวจสอบได้", zh: "认证曾是终极目标。现在，它只是可审计结果的起点。" })}</p>
          </div>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: '0', borderRadius: '0', borderRight: '1px solid var(--5)' }}>
            <h3 style={{ fontSize: 'var(--text-body)' }}>{translate(locale, { en: "Technology Theater → Citizen Pain Points", th: "ละครเทคโนโลยี → จุดที่ประชาชนเดือนร้อน", zh: "技术表演 → 公民痛点" })}</h3>
            <p style={{ fontSize: 'var(--text-body)' }}>{translate(locale, { en: "Moving away from 'buying gadgets' to 'removing pain'. Every sensor must justify its utility.", th: "ย้ายหน้าจากการซื้ออุปกรณ์เป็นการแก้ปัญหา ทุกเซ็นเซอร์ต้องมีความรับผิดชอบ", zh: "从'购买小工具'转向'消除痛苦'。每个传感器都必须证明其效用。" })}</p>
          </div>
          <div className="story-shift-card glass-card shadow-premium" style={{ border: '0', borderRadius: '0' }}>
            <h3 style={{ fontSize: 'var(--text-body)' }}>{translate(locale, { en: "Central Planning → Local Grit", th: "แผนจากส่วนกลาง → พลังท้องถิ่น", zh: "中央规划 → 地方韧性" })}</h3>
            <p style={{ fontSize: 'var(--text-body)' }}>{translate(locale, { en: "From waiting for Bangkok to empowerment of local consortiums like KKTS for resilience.", th: "ย้ายหน้าจากการรอฟังคำสั่งจากกรุงเทพเพื่อเสริมพลังท้องถิ่นในการพัฒนาความยืดหยุ่น", zh: "从等待曼谷指令转向赋权地方联盟（如KKTS）以增强韧性。" })}</p>
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
        {/* Two registers exist and readers otherwise find them contradictory:
            the formal certification indicators above are demanding, while the
            working benchmarks below are deliberately plain. Both are real. */}
        <div className="story-indicator-note" style={{ borderTop: "1px solid var(--5)", paddingTop: "1rem", marginTop: "1.25rem" }}>
          <p style={{ font: "400 var(--text-body)/1.7 var(--font)", color: "var(--4)", maxWidth: "680px", marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "Read alongside these a second, plainer set. The certification indicators above are the formal bar. In day-to-day assessment the programme also uses working benchmarks chosen so a mayor can verify them without hiring a consultant: average local income above roughly 20,000 baht a month, a measurable annual cut in emissions on the order of one percent within the designated area, residents getting home meaningfully faster — around an hour is the working figure — and fewer road accidents.",
              th: "ควรอ่านคู่กับชุดที่สอง ที่เรียบง่ายกว่า ตัวชี้วัดการรับรองด้านบนคือเกณฑ์ทางการ แต่ในการประเมินประจำวัน โครงการยังใช้เกณฑ์ใช้งานจริงที่เลือกให้นายกเทศมนตรีตรวจสอบเองได้โดยไม่ต้องจ้างที่ปรึกษา ได้แก่ รายได้เฉลี่ยในพื้นที่สูงกว่าราว 20,000 บาทต่อเดือน การลดการปล่อยมลพิษที่วัดได้ราวร้อยละหนึ่งต่อปีในพื้นที่ที่กำหนด ประชาชนกลับถึงบ้านเร็วขึ้นอย่างมีนัยสำคัญ โดยราวหนึ่งชั่วโมงคือตัวเลขที่ใช้จริง และอุบัติเหตุบนถนนที่ลดลง",
              zh: "请与第二套更朴素的标准并读。上方的认证指标是正式门槛。而在日常评估中，项目还使用一组便于操作的基准，其选取标准是让市长无需聘请顾问也能自行核验：本地平均收入高于约每月20,000泰铢；指定区域内每年可测量的减排约百分之一；居民回家时间显著缩短——约一小时是实际使用的数字；以及道路事故减少。",
            })}
          </p>
          <p style={{ font: "400 var(--text-body)/1.7 var(--font)", color: "var(--4)", maxWidth: "680px", marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "The gap between the two registers is deliberate, and it has a history. The first criteria were drafted to a high engineering standard and proved unreachable for the municipalities they were aimed at — about two years in, the bar was filtering out participation rather than filtering for quality. The plainer benchmarks were written to fix that. A target nobody can measure is not a target.",
              th: "ช่องว่างระหว่างสองชุดนี้เป็นความตั้งใจ และมีที่มา เกณฑ์ชุดแรกถูกร่างตามมาตรฐานวิศวกรรมระดับสูง และพิสูจน์แล้วว่าเกินเอื้อมสำหรับเทศบาลที่เป็นกลุ่มเป้าหมาย ผ่านไปราวสองปีก็พบว่าเกณฑ์นั้นคัดคนออกจากการเข้าร่วม มากกว่าจะคัดกรองคุณภาพ เกณฑ์ที่เรียบง่ายกว่าจึงถูกเขียนขึ้นเพื่อแก้ปัญหานั้น เป้าหมายที่ไม่มีใครวัดได้ ไม่ถือเป็นเป้าหมาย",
              zh: "两套标准之间的差距是有意为之，且事出有因。第一套标准按高工程标准起草，事实证明对其面向的市镇而言遥不可及——约两年后可以看到，这道门槛筛掉的是参与者，而不是在筛质量。更朴素的基准正是为解决这一点而写的。无人能测量的目标就不是目标。",
            })}
          </p>
          <p>
            {translate(locale, {
              en: "Source: 7 Smart City Indicators, Smart City Thailand Office (depa)",
              th: "ที่มา: 7 ตัวชี้วัดเมืองอัจฉริยะ, สำนักงานเมืองอัจฉริยะประเทศไทย (depa)",
              zh: "来源：7项智慧城市指标，泰国智慧城市办公室（depa）",
            })}
          </p>
        </div>
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
