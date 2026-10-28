import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface BenefitBlock {
  icon: string;
  lens: { en: string; th: string; zh: string };
  title: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
}

const benefits: BenefitBlock[] = [
  {
    icon: "📊",
    lens: { en: "Capital allocation", th: "การจัดสรรทุน", zh: "资本配置" },
    title: { en: "For investors: discover what's beyond Bangkok", th: "สำหรับนักลงทุน: ค้นพบสิ่งที่อยู่นอกเหนือจากกรุงเทพฯ", zh: "投资者：发现曼谷以外的机遇" },
    body: {
      en: "Start by comparing candidate places, then inspect each city’s evidence. Provincial income, population and environmental baselines can provide context, but they do not establish a project’s operating costs, utility capacity or investment eligibility. Check the source period, geographic unit and original document before using a figure in a site-selection decision. Local due diligence remains necessary.",
      th: "เริ่มจากเปรียบเทียบพื้นที่ที่สนใจ แล้วตรวจหลักฐานในแฟ้มเมือง ข้อมูลรายได้ ประชากร และสิ่งแวดล้อมระดับจังหวัดช่วยให้เห็นบริบท แต่ไม่ยืนยันต้นทุนดำเนินงาน ความจุสาธารณูปโภค หรือสิทธิลงทุนของโครงการ ควรตรวจช่วงเวลา หน่วยพื้นที่ และเอกสารต้นฉบับก่อนใช้ตัวเลขเลือกพื้นที่ และยังต้องตรวจสอบพื้นที่จริง",
      zh: "先比较候选地点，再查看各城证据。省级收入、人口与环境基线可提供背景，但不能证明具体项目的运营成本、公用设施容量或投资资格。将数字用于选址前，请核查统计期、地理单位和原始文件；实地尽调仍不可少。",
    },
  },
  {
    icon: "🏛️",
    lens: { en: "Benchmarking", th: "การเทียบเคียง", zh: "基准比较" },
    title: { en: "For cities: know where you stand, learn from peers", th: "สำหรับเมือง: รู้ว่าคุณอยู่ตรงไหน เรียนรู้จากเพื่อน", zh: "城市：了解自身定位，向同行学习" },
    body: {
      en: "Use the seven research pillars as a starting set of questions for peer comparison. A higher estimate may suggest where to examine a source or visit a project; it does not show which policy caused the result. Compare like geographic units and dates, distinguish observations from research estimates, and read missing data as a gap rather than a poor performance score.",
      th: "ใช้เสาวิจัยทั้งเจ็ดด้านเป็นคำถามตั้งต้นสำหรับการเทียบเคียงเมือง ค่าประมาณที่สูงกว่าอาจชี้ว่าควรศึกษาแหล่งข้อมูลหรือโครงการใดต่อ แต่ไม่ได้ยืนยันว่านโยบายใดเป็นสาเหตุ ควรเทียบหน่วยพื้นที่และช่วงเวลาที่ใกล้เคียงกัน แยกข้อมูลสังเกตจากค่าประมาณ และอ่านข้อมูลที่ขาดว่าเป็นช่องว่าง ไม่ใช่คะแนนผลงานต่ำ",
      zh: "七项研究维度可作为同类城市比较的起点。较高估值可能提示值得进一步查阅的来源或项目，但不能说明哪项政策导致了结果。应比较相同地理单位与时期，区分观测值和研究估算，并将缺失视为证据空白，而非低绩效分数。",
    },
  },
  {
    icon: "👥",
    lens: { en: "Accountability", th: "ความรับผิดรับชอบ", zh: "问责" },
    title: { en: "For citizens: hold your city accountable", th: "สำหรับประชาชน: ตรวจสอบเมืองของคุณ", zh: "市民：让你的城市承担责任" },
    body: {
      en: "A city’s designation and its service outcomes answer different questions. Follow the linked records to ask what was proposed, what was reported and what has been independently observed. Check whether a number concerns the municipality, the whole province or only a particular facility. A low research score is not proof of misconduct, and a missing reading is not an all-clear.",
      th: "ตราสัญลักษณ์เมืองกับผลลัพธ์บริการตอบคนละคำถาม ใช้ลิงก์หลักฐานเพื่อตรวจว่าอะไรเป็นข้อเสนอ อะไรเป็นรายงาน และอะไรเป็นข้อมูลที่สังเกตอย่างอิสระ ควรดูว่าตัวเลขกล่าวถึงเทศบาล ทั้งจังหวัด หรือสถานบริการแห่งใด คะแนนวิจัยต่ำไม่ใช่หลักฐานการกระทำผิด และการไม่มีค่าตรวจวัดไม่ได้แปลว่าปลอดภัย",
      zh: "城市称号与服务结果回答不同问题。可沿来源链接核查哪些属于提案、报告或独立观测，并确认数字涵盖市镇、全府还是某一设施。低研究评分不构成不当行为的证据，缺少监测值也不代表一切正常。",
    },
  },
  {
    icon: "🌏",
    lens: { en: "Regional model", th: "โมเดลระดับภูมิภาค", zh: "区域模型" },
    title: { en: "For researchers: examine and reuse the methods", th: "สำหรับนักวิจัย: ศึกษาและใช้ระเบียบวิธีต่อ", zh: "研究者：审视与复用方法" },
    body: {
      en: "The methods and source registry are available for readers who want to study how a city profile is assembled. Reuse requires preserving source dates, definitions, geographic scope and the original data’s rights. A framework used in Thailand should not be treated as a validated comparison of other countries without checking local definitions, coverage and sampling. The reference reading below offers broader context.",
      th: "ระเบียบวิธีและทะเบียนแหล่งข้อมูลเปิดให้ศึกษาองค์ประกอบของแฟ้มเมือง การนำไปใช้ต่อควรรักษาวันที่ นิยาม ขอบเขตพื้นที่ และสิทธิของข้อมูลต้นทาง ไม่ควรถือว่ากรอบที่ใช้ในไทยเป็นการเปรียบเทียบประเทศอื่นที่ผ่านการตรวจสอบแล้ว โดยไม่ตรวจนิยาม ความครอบคลุม และการเก็บตัวอย่างในพื้นที่นั้น เอกสารด้านล่างเป็นบริบทสำหรับศึกษาต่อ",
      zh: "读者可利用方法说明和来源登记表研究城市档案的组成。复用时应保留日期、定义、地理范围及原始资料的使用权。在泰国使用的框架不能未经核查就视为其他国家的有效比较；仍须检查当地定义、覆盖与抽样。下列阅读材料提供进一步背景。",
    },
  },
  {
    icon: "🎯",
    lens: { en: "Policy targeting", th: "การกำหนดเป้าหมายนโยบาย", zh: "政策瞄准" },
    title: { en: "For policymakers: evidence-based decisions", th: "สำหรับผู้กำหนดนโยบาย: ตัดสินใจบนหลักฐาน", zh: "政策制定者：基于证据的决策" },
    body: {
      en: "Use the registry to distinguish proposals awaiting assessment from city profiles that contain research scores. The platform can help identify questions for further investigation, but it does not determine which project should receive public money. Funding decisions need current local demand, service coverage, delivery capacity and affordability evidence. Keep those project-level checks separate from a composite research estimate.",
      th: "ใช้ทะเบียนเพื่อแยกข้อเสนอที่รอการประเมินออกจากแฟ้มเมืองที่มีคะแนนวิจัย แพลตฟอร์มช่วยระบุคำถามสำหรับศึกษาต่อ แต่ไม่ได้ตัดสินว่าโครงการใดควรได้รับงบประมาณ การจัดสรรทุนต้องอาศัยความต้องการปัจจุบัน ความครอบคลุมบริการ ความสามารถดำเนินงาน และความสามารถในการจ่าย ควรแยกการตรวจระดับโครงการเหล่านี้ออกจากค่าประมาณวิจัยรวม",
      zh: "名录用于区分待评估提案与包含研究评分的城市档案。本平台可帮助提出后续问题，但不决定哪个项目应获得公共资金。拨款决策仍需当前本地需求、服务覆盖、交付能力及可负担性的证据；这些项目层面的核查应与综合研究估值区分开。",
    },
  },
];

const references = [
  { id: 1, text: { en: "Financial Times fDi Benchmark — site-selection data reference", th: "Financial Times fDi Benchmark — แหล่งอ้างอิงข้อมูลเลือกพื้นที่", zh: "金融时报fDi基准——选址数据参考" }, url: "https://www.fdibenchmark.com/" },
  { id: 2, text: { en: "IMD Smart City Observatory — benchmarking background", th: "IMD Smart City Observatory — บริบทการเทียบเคียงเมือง", zh: "IMD智慧城市观察站——城市比较背景" }, url: "https://www.imd.org/smart-city-observatory/home/" },
  { id: 3, text: { en: "Measuring progress of smart cities: Indexing the smart city indices — Technological Forecasting and Social Change (2022)", th: "การวัดความก้าวหน้าของเมืองอัจฉริยะ: การจัดทำดัชนีของดัชนีเมืองอัจฉริยะ — Technological Forecasting and Social Change (2022)", zh: "衡量智慧城市进展：智慧城市指数的指数化——《技术预测与社会变革》(2022)" }, url: "https://www.sciencedirect.com/science/article/pii/S2664328622000699" },
  { id: 4, text: { en: "How data contributes to Thailand's smart city innovation — Frontiers in Sustainable Cities (2024)", th: "ข้อมูลมีส่วนต่อนวัตกรรมเมืองอัจฉริยะไทยอย่างไร — Frontiers in Sustainable Cities (2024)", zh: "数据如何促进泰国智慧城市创新——《可持续城市前沿》(2024)" }, url: "https://www.frontiersin.org/journals/sustainable-cities/articles/10.3389/frsc.2024.1473123/full" },
  { id: 5, text: { en: "Smart city competitiveness index: conceptualization, modelling, application — Land Use Policy (2024)", th: "ดัชนีการแข่งขันเมืองอัจฉริยะ: แนวคิด การสร้างแบบจำลอง การประยุกต์ — Land Use Policy (2024)", zh: "智慧城市竞争力指数：概念化、建模、应用——《土地利用政策》(2024)" }, url: "https://www.sciencedirect.com/science/article/abs/pii/S0264837724003612" },
  { id: 6, text: { en: "Smart Cities Dive — How local government leverage smart city indicators to enhance urban competitiveness", th: "Smart Cities Dive — รัฐบาลท้องถิ่นใช้ตัวชี้วัดเมืองอัจฉริยะเพิ่มความสามารถแข่งขันเมืองอย่างไร", zh: "Smart Cities Dive——地方政府如何利用智慧城市指标提升城市竞争力" }, url: "https://www.smartcitiesdive.com/press-release/20241119-how-local-governments-can-leverage-smart-city-indicators-to-enhance-urban-c-1/" },
];

export default function WhyPage({ locale, onNavigate }: Props) {
  const [metricRef, metricVisible] = useInView(0.1);
  const [benefitRef, benefitVisible] = useInView(0.1);
  const [sourceRef, sourceVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  return (
    <div className="why-page">
      <section className="page-hero section reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Why this index", th: "ทำไมดัชนีนี้", zh: "为什么需要这个指数" })}</p>
        <h1 className="hero-title">
          {translate(locale, {
            en: "Who benefits, and how.",
            th: "ใครได้ประโยชน์ และอย่างไร",
            zh: "谁受益 以及如何受益",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Use the city data platform to compare places, locate original records and identify what still needs to be checked. These are starting points for research and public discussion, not a substitute for local evidence.",
      th: "ใช้แพลตฟอร์มข้อมูลเมืองเพื่อเปรียบเทียบพื้นที่ ค้นหาเอกสารต้นทาง และระบุสิ่งที่ยังต้องตรวจสอบ ข้อมูลนี้เป็นจุดเริ่มต้นของการวิจัยและการสนทนาสาธารณะ ไม่ใช่สิ่งทดแทนหลักฐานในพื้นที่",
      zh: "利用城市数据平台比较地点、查找原始记录并识别待核查事项。这些是研究与公共讨论的起点，不能替代当地证据。",
          })}
        </p>
      </section>

      <section ref={metricRef} className={`section story-metric-section reveal stagger-1 ${metricVisible ? "visible" : ""}`}>
        <div className="story-metric-grid">
          <div className="story-metric-card">
            <div className="story-metric-value">49</div>
            <div className="story-metric-label">{translate(locale, { en: "Cities compared", th: "เมืองที่เปรียบเทียบ", zh: "比较城市" })}</div>
          </div>
          <div className="story-metric-card">
            <div className="story-metric-value">3</div>
            <div className="story-metric-label">{translate(locale, { en: "Tiers, not fake precision", th: "จัดเป็น 3 ระดับ ไม่ใช่ความแม่นยำปลอม", zh: "三层级，而非虚假精确" })}</div>
          </div>
          <div className="story-metric-card">
            <div className="story-metric-value">7</div>
            <div className="story-metric-label">{translate(locale, { en: "Pillars under the hood", th: "เสาหลักใต้ฝากระโปรง", zh: "底层 7 个支柱" })}</div>
          </div>
          <div className="story-metric-card">
            <div className="story-metric-value">Open</div>
            <div className="story-metric-label">{translate(locale, { en: "Weights and sources", th: "น้ำหนักและแหล่งข้อมูล", zh: "权重与来源" })}</div>
          </div>
        </div>
      </section>

      <section ref={benefitRef} className={`section reveal stagger-2 ${benefitVisible ? "visible" : ""}`}>
        {benefits.map((b, i) => (
          <div key={i} className="benefit-block">
            <div className="benefit-icon">{b.icon}</div>
            <div className="benefit-content">
              <p className="benefit-lens">{translate(locale, b.lens)}</p>
              <h2 className="benefit-title">{translate(locale, b.title)}</h2>
              <p className="benefit-body">{translate(locale, b.body)}</p>
            </div>
          </div>
        ))}
      </section>

      <section ref={sourceRef} className={`section reveal stagger-3 ${sourceVisible ? "visible" : ""}`}>
        <p className="story-source-note">
          {translate(locale, {
            en: "The references below are background reading on benchmarking and city data. They do not independently validate every SCITI score or establish current local service capacity.",
      th: "เอกสารด้านล่างเป็นแหล่งอ่านต่อเรื่องการเทียบเคียงและข้อมูลเมือง ไม่ได้ตรวจสอบคะแนน SCITI ทุกรายการอย่างอิสระ หรือยืนยันความจุบริการในปัจจุบัน",
      zh: "以下资料提供城市比较与数据研究的阅读背景，并不独立验证每项SCITI评分，也不能证明当前当地服务容量。",
          })}
        </p>
        <p className="eyebrow">{translate(locale, { en: "References", th: "เอกสารอ้างอิง", zh: "参考文献" })}</p>
        <h2>{translate(locale, { en: "Sources and citations", th: "แหล่งข้อมูลและการอ้างอิง", zh: "来源与引用" })}</h2>
        <div className="references-list">
          {references.map(ref => (
            <a key={ref.id} href={ref.url} target="_blank" rel="noopener noreferrer" className="reference-item">
              <span className="reference-num">[{ref.id}]</span>
              <span className="reference-text">{translate(locale, ref.text)}</span>
            </a>
          ))}
        </div>
      </section>

      <section ref={ctaRef} className={`section reveal stagger-4 ${ctaVisible ? "visible" : ""}`}>
        <div className="callout-card glass-card shadow-premium">
          <h2>{translate(locale, { en: "This index is open. Use it.", th: "ดัชนีนี้เปิดเผย ใช้ได้เลย", zh: "本指数是开放的。请使用。" })}</h2>
          <p>{translate(locale, {
            en: "Every score, every weight, every data source is transparent. Cities can use this to benchmark themselves. Investors can use this to discover opportunities. Citizens can use this to hold their leaders accountable. The methodology is built on SLIC — the same framework presented at the Smart City Summit & Expo in Taipei to 174 cities from 53 countries.",
            th: "ทุกคะแนน ทุกน้ำหนัก ทุกแหล่งข้อมูลโปร่งใส เมืองใช้เพื่อเปรียบเทียบตัวเอง นักลงทุนใช้เพื่อค้นพบโอกาส ประชาชนใช้เพื่อตรวจสอบผู้นำ วิธีการสร้างจาก SLIC — กรอบเดียวกันที่นำเสนอที่ SCSE ไทเปต่อ 174 เมืองจาก 53 ประเทศ",
            zh: "每个分数、每个权重、每个数据来源都是透明的。城市可以用它来对标自己。投资者可以用它来发现机会。市民可以用它来让领导者承担责任。方法论基于SLIC——同一框架在台北智慧城市展上向来自53个国家的174个城市展示。",
          })}</p>
          <button className="cta-button" onClick={() => onNavigate("/rankings")}>
            {translate(locale, { en: "Explore the rankings", th: "สำรวจอันดับ", zh: "探索排名" })}
          </button>
        </div>
      </section>
    </div>
  );
}
