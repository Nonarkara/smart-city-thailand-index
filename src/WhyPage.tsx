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
      en: "Most foreign investors know Bangkok and Phuket. This index reveals cities like Khon Kaen, Chachoengsao, and Hat Yai — cities with strong infrastructure, growing economies, and lower operating costs. Research from the Financial Times' fDi Benchmark shows that city-level data is critical for FDI site selection, yet most investors rely on country-level rankings that miss sub-national variation. This index gives investors the granular, city-level intelligence they need to find better locations for manufacturing hubs, R&D centers, logistics operations, and regional offices.",
      th: "นักลงทุนต่างชาติส่วนใหญ่รู้จักแค่กรุงเทพฯ และภูเก็ต ดัชนีนี้เปิดเผยเมืองอย่างขอนแก่น ฉะเชิงเทรา และหาดใหญ่ — เมืองที่มีโครงสร้างพื้นฐานแข็งแกร่ง เศรษฐกิจเติบโต และต้นทุนดำเนินงานต่ำกว่า งานวิจัยจาก fDi Benchmark ของ Financial Times แสดงว่าข้อมูลระดับเมืองสำคัญต่อการเลือกสถานที่ลงทุน FDI แต่นักลงทุนส่วนใหญ่พึ่งพาการจัดอันดับระดับประเทศที่พลาดความแตกต่างภายในประเทศ",
      zh: "大多数外国投资者只了解曼谷和普吉岛。本指数揭示了孔敬、北柳和合艾等城市——基础设施完善、经济增长强劲、运营成本更低的城市。金融时报fDi Benchmark的研究表明，城市级数据对FDI选址至关重要，但大多数投资者依赖国家级排名，忽略了国内差异。本指数为投资者提供所需的精细城市级情报，帮助他们找到制造中心、研发中心、物流运营和区域办事处的更优位置。",
    },
  },
  {
    icon: "🏛️",
    lens: { en: "Benchmarking", th: "การเทียบเคียง", zh: "基准比较" },
    title: { en: "For cities: know where you stand, learn from peers", th: "สำหรับเมือง: รู้ว่าคุณอยู่ตรงไหน เรียนรู้จากเพื่อน", zh: "城市：了解自身定位，向同行学习" },
    body: {
      en: "This is not about embarrassing cities. It's about giving every municipality a clear diagnostic — like a doctor's checkup, not a beauty contest. The IMD Smart City Index demonstrates that benchmarking enables cities to identify specific strengths and weaknesses, then design targeted strategies. When Nakhon Si Thammarat sees that Khon Kaen scores higher on digital governance, it can study exactly what Khon Kaen did and adapt it. When Hat Yai sees Yala's environmental excellence, it learns that even cities in challenging security situations can achieve green city outcomes.",
      th: "นี่ไม่ใช่การทำให้เมืองอาย แต่เป็นการให้เทศบาลทุกแห่งได้รับการวินิจฉัยที่ชัดเจน — เหมือนการตรวจสุขภาพ ไม่ใช่การประกวดความงาม IMD Smart City Index แสดงว่าการเปรียบเทียบช่วยให้เมืองระบุจุดแข็งและจุดอ่อนเฉพาะ แล้วออกแบบกลยุทธ์ที่ตรงเป้า เมื่อนครศรีธรรมราชเห็นว่าขอนแก่นได้คะแนนสูงกว่าด้าน digital governance ก็สามารถศึกษาว่าขอนแก่นทำอะไรแล้วนำมาปรับใช้",
      zh: "这不是为了让城市难堪，而是给每个市政当局一个清晰的诊断——像医生体检，而不是选美比赛。IMD智慧城市指数表明，基准评估使城市能够识别具体的优势和劣势，然后设计有针对性的策略。当洛坤看到孔敬在数字治理方面得分更高时，它可以研究孔敬究竟做了什么并加以调整。当合艾看到也拉的环境卓越表现时，它了解到即使在安全形势严峻的城市也能取得绿色城市成果。",
    },
  },
  {
    icon: "👥",
    lens: { en: "Accountability", th: "ความรับผิดรับชอบ", zh: "问责" },
    title: { en: "For citizens: hold your city accountable", th: "สำหรับประชาชน: ตรวจสอบเมืองของคุณ", zh: "市民：让你的城市承担责任" },
    body: {
      en: "When a city receives a Smart City logo but scores Gamma in our index, citizens can ask: where did the money go? When a city claims to be \"smart\" but its PM2.5 readings are dangerous, its crime rate is rising, or its citizens can't afford housing — the data is here, transparent and auditable. Research published in Sustainable Cities and Society shows that transparency in urban performance data increases citizen trust and civic participation. This index makes every number traceable to its source.",
      th: "เมื่อเมืองได้รับตราสัญลักษณ์เมืองอัจฉริยะแต่ได้คะแนน Gamma ในดัชนีของเรา ประชาชนสามารถถามได้ว่า: เงินไปไหน? เมื่อเมืองอ้างว่า 'อัจฉริยะ' แต่ค่า PM2.5 อันตราย อัตราอาชญากรรมเพิ่มขึ้น หรือประชาชนซื้อบ้านไม่ได้ — ข้อมูลอยู่ที่นี่ โปร่งใสและตรวจสอบได้ งานวิจัยใน Sustainable Cities and Society แสดงว่าความโปร่งใสของข้อมูลประสิทธิภาพเมืองเพิ่มความไว้วางใจของประชาชนและการมีส่วนร่วมทางพลเมือง",
      zh: "当一个城市获得了智慧城市标志但在我们的指数中评为Gamma级时，市民可以质问：钱花到哪里去了？当一个城市声称'智慧'但其PM2.5读数危险、犯罪率上升、或市民买不起房时——数据在这里，透明且可审计。发表在《可持续城市与社会》上的研究表明，城市绩效数据的透明度能增加市民信任和公民参与。本指数使每个数字都可追溯到其来源。",
    },
  },
  {
    icon: "🌏",
    lens: { en: "Regional model", th: "โมเดลระดับภูมิภาค", zh: "区域模型" },
    title: { en: "For ASEAN: a model for regional benchmarking", th: "สำหรับอาเซียน: แบบจำลองสำหรับการเปรียบเทียบระดับภูมิภาค", zh: "东盟：区域基准评估的典范" },
    body: {
      en: "The ASEAN Smart Cities Network has 38 pilot cities across 10 countries, but no standardized way to compare them. This index, built on SLIC methodology, can be adapted for any ASEAN city. Thailand has built a transparent, citizen-centric smart city index for its own cities, openly licensed so any country can adopt it. The Frontiers in Sustainable Cities journal documented how Thailand's data-driven approach contributes to smart city innovation across the region.",
      th: "ASEAN Smart Cities Network มี 38 เมืองนำร่องใน 10 ประเทศ แต่ไม่มีวิธีมาตรฐานในการเปรียบเทียบ ดัชนีนี้สร้างจากวิธีการ SLIC สามารถปรับใช้กับเมืองอาเซียนใดก็ได้ ไทยได้สร้างดัชนีเมืองอัจฉริยะแบบโปร่งใสที่เน้นประชาชนสำหรับเมืองของตัวเอง และเปิดเผยวิธีการให้ประเทศใดก็นำไปปรับใช้ได้",
      zh: "东盟智慧城市网络在10个国家拥有38个试点城市，但没有标准化的比较方式。本指数基于SLIC方法论，可适用于任何东盟城市。泰国为本国城市建立了透明、以市民为中心的智慧城市指数，并开放方法论供任何国家采用。《可持续城市前沿》期刊记录了泰国的数据驱动方法如何促进该地区的智慧城市创新。",
    },
  },
  {
    icon: "🎯",
    lens: { en: "Policy targeting", th: "การกำหนดเป้าหมายนโยบาย", zh: "政策瞄准" },
    title: { en: "For policymakers: evidence-based decisions", th: "สำหรับผู้กำหนดนโยบาย: ตัดสินใจบนหลักฐาน", zh: "政策制定者：基于证据的决策" },
    body: {
      en: "Thailand's target is 105 smart cities by 2027. But how do you allocate limited resources? This index shows which cities are closest to Alpha tier and would benefit most from targeted investment, which cities are stuck in Gamma and need fundamental infrastructure before smart technology, and which policies actually correlate with better outcomes. Academic research in Land Use Policy (2024) demonstrates that composite smart city indices enable more efficient resource allocation when they are transparent about their methodology.",
      th: "ไทยตั้งเป้า 105 เมืองอัจฉริยะภายปี 2570 แต่จะจัดสรรทรัพยากรจำกัดอย่างไร? ดัชนีนี้แสดงว่าเมืองไหนใกล้ Alpha ที่สุดและจะได้ประโยชน์มากที่สุดจากการลงทุนตรงเป้า เมืองไหนติดอยู่ที่ Gamma และต้องการโครงสร้างพื้นฐานก่อนเทคโนโลยีอัจฉริยะ และนโยบายใดสัมพันธ์กับผลลัพธ์ที่ดีขึ้นจริง",
      zh: "泰国的目标是到2027年拥有105个智慧城市。但如何分配有限的资源？本指数显示哪些城市最接近Alpha级别并能从定向投资中获益最大，哪些城市困在Gamma级别需要先完善基础设施再引入智能技术，以及哪些政策实际上与更好的成果相关。《土地利用政策》(2024)的学术研究表明，当复合智慧城市指数的方法论透明时，能实现更高效的资源分配。",
    },
  },
];

const references = [
  { id: 1, text: { en: "Financial Times fDi Benchmark — city-level FDI site selection intelligence used by 70+ investment promotion agencies globally", th: "Financial Times fDi Benchmark — ข้อมูลเลือกสถานที่ FDI ระดับเมือง ใช้โดยหน่วยงานส่งเสริมการลงทุน 70+ แห่งทั่วโลก", zh: "金融时报fDi基准——全球70多家投资促进机构使用的城市级FDI选址情报" }, url: "https://www.fdibenchmark.com/" },
  { id: 2, text: { en: "IMD Smart City Index 2026 — \"Transparency and public trust are key to urban success\"", th: "IMD Smart City Index 2026 — 'ความโปร่งใสและความไว้วางใจสาธารณะเป็นกุญแจสู่ความสำเร็จของเมือง'", zh: "IMD智慧城市指数2026——透明度和公众信任是城市成功的关键" }, url: "https://www.imd.org/smart-city-observatory/home/" },
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
      <section className="section reveal visible" style={{ paddingTop: "7rem", paddingBottom: "1.5rem" }}>
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
            en: "A transparent city index isn't a vanity project. It's infrastructure for smarter investment, better policy, and stronger citizen voice. Here's the evidence.",
            th: "ดัชนีเมืองที่โปร่งใสไม่ใช่โครงการเพื่อภาพลักษณ์ แต่เป็นโครงสร้างพื้นฐานสำหรับการลงทุนที่ฉลาดกว่า นโยบายที่ดีกว่า และเสียงประชาชนที่แข็งแกร่งกว่า นี่คือหลักฐาน",
            zh: "透明的城市指数不是虚荣项目。它是更明智投资、更好政策和更强公民话语权的基础设施。以下是证据。",
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

      <section ref={sourceRef} className={`section reveal stagger-3 ${sourceVisible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <p className="story-source-note">
          {translate(locale, {
            en: "These references explain why benchmarking matters. Some are Thailand-specific, some are broader smart-city research, and together they justify the need for a transparent city index.",
            th: "เอกสารอ้างอิงชุดนี้อธิบายว่าทำไมการเทียบเคียงจึงสำคัญ บางชิ้นเฉพาะไทย บางชิ้นเป็นงานวิจัยกว้างๆ ด้านสมาร์ตซิตี้ และเมื่อนำมารวมกัน มันรองรับเหตุผลของการมีดัชนีเมืองที่โปร่งใส",
            zh: "这些参考文献用于说明为什么城市比较有必要。有些专门针对泰国，有些属于更广泛的智慧城市研究，合起来为透明城市指数提供了论证基础。",
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

      <section ref={ctaRef} className={`section reveal stagger-4 ${ctaVisible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
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
