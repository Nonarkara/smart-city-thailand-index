import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface BenefitBlock {
  iconEn: string;
  lensEn: string;
  lensTh: string;
  lensZh: string;
  titleEn: string;
  titleTh: string;
  titleZh: string;
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
}

const benefits: BenefitBlock[] = [
  {
    iconEn: "📊",
    lensEn: "Capital allocation",
    lensTh: "การจัดสรรทุน",
    lensZh: "资本配置",
    titleEn: "For investors: discover what's beyond Bangkok",
    titleTh: "สำหรับนักลงทุน: ค้นพบสิ่งที่อยู่นอกเหนือจากกรุงเทพฯ",
    titleZh: "投资者：发现曼谷以外的机遇",
    bodyEn: "Most foreign investors know Bangkok and Phuket. This index reveals cities like Khon Kaen, Chachoengsao, and Hat Yai — cities with strong infrastructure, growing economies, and lower operating costs. Research from the Financial Times' fDi Benchmark shows that city-level data is critical for FDI site selection, yet most investors rely on country-level rankings that miss sub-national variation. This index gives investors the granular, city-level intelligence they need to find better locations for manufacturing hubs, R&D centers, logistics operations, and regional offices.",
    bodyTh: "นักลงทุนต่างชาติส่วนใหญ่รู้จักแค่กรุงเทพฯ และภูเก็ต ดัชนีนี้เปิดเผยเมืองอย่างขอนแก่น ฉะเชิงเทรา และหาดใหญ่ — เมืองที่มีโครงสร้างพื้นฐานแข็งแกร่ง เศรษฐกิจเติบโต และต้นทุนดำเนินงานต่ำกว่า งานวิจัยจาก fDi Benchmark ของ Financial Times แสดงว่าข้อมูลระดับเมืองสำคัญต่อการเลือกสถานที่ลงทุน FDI แต่นักลงทุนส่วนใหญ่พึ่งพาการจัดอันดับระดับประเทศที่พลาดความแตกต่างภายในประเทศ",
    bodyZh: "大多数外国投资者只了解曼谷和普吉岛。本指数揭示了孔敬、北柳和合艾等城市——基础设施完善、经济增长强劲、运营成本更低的城市。金融时报fDi Benchmark的研究表明，城市级数据对FDI选址至关重要，但大多数投资者依赖国家级排名，忽略了国内差异。本指数为投资者提供所需的精细城市级情报，帮助他们找到制造中心、研发中心、物流运营和区域办事处的更优位置。",
  },
  {
    iconEn: "🏛️",
    lensEn: "Benchmarking",
    lensTh: "การเทียบเคียง",
    lensZh: "基准比较",
    titleEn: "For cities: know where you stand, learn from peers",
    titleTh: "สำหรับเมือง: รู้ว่าคุณอยู่ตรงไหน เรียนรู้จากเพื่อน",
    titleZh: "城市：了解自身定位，向同行学习",
    bodyEn: "This is not about embarrassing cities. It's about giving every municipality a clear diagnostic — like a doctor's checkup, not a beauty contest. The IMD Smart City Index demonstrates that benchmarking enables cities to identify specific strengths and weaknesses, then design targeted strategies. When Nakhon Si Thammarat sees that Khon Kaen scores higher on digital governance, it can study exactly what Khon Kaen did and adapt it. When Hat Yai sees Yala's environmental excellence, it learns that even cities in challenging security situations can achieve green city outcomes.",
    bodyTh: "นี่ไม่ใช่การทำให้เมืองอาย แต่เป็นการให้เทศบาลทุกแห่งได้รับการวินิจฉัยที่ชัดเจน — เหมือนการตรวจสุขภาพ ไม่ใช่การประกวดความงาม IMD Smart City Index แสดงว่าการเปรียบเทียบช่วยให้เมืองระบุจุดแข็งและจุดอ่อนเฉพาะ แล้วออกแบบกลยุทธ์ที่ตรงเป้า เมื่อนครศรีธรรมราชเห็นว่าขอนแก่นได้คะแนนสูงกว่าด้าน digital governance ก็สามารถศึกษาว่าขอนแก่นทำอะไรแล้วนำมาปรับใช้",
    bodyZh: "这不是为了让城市难堪，而是给每个市政当局一个清晰的诊断——像医生体检，而不是选美比赛。IMD智慧城市指数表明，基准评估使城市能够识别具体的优势和劣势，然后设计有针对性的策略。当那空是贪玛叻看到孔敬在数字治理方面得分更高时，它可以研究孔敬究竟做了什么并加以调整。当合艾看到也拉的环境卓越表现时，它了解到即使在安全形势严峻的城市也能取得绿色城市成果。",
  },
  {
    iconEn: "👥",
    lensEn: "Accountability",
    lensTh: "ความรับผิดรับชอบ",
    lensZh: "问责",
    titleEn: "For citizens: hold your city accountable",
    titleTh: "สำหรับประชาชน: ตรวจสอบเมืองของคุณ",
    titleZh: "市民：让你的城市承担责任",
    bodyEn: "When a city receives a Smart City logo but scores Gamma in our index, citizens can ask: where did the money go? When a city claims to be \"smart\" but its PM2.5 readings are dangerous, its crime rate is rising, or its citizens can't afford housing — the data is here, transparent and auditable. Research published in Sustainable Cities and Society shows that transparency in urban performance data increases citizen trust and civic participation. This index makes every number traceable to its source.",
    bodyTh: "เมื่อเมืองได้รับตราสัญลักษณ์เมืองอัจฉริยะแต่ได้คะแนน Gamma ในดัชนีของเรา ประชาชนสามารถถามได้ว่า: เงินไปไหน? เมื่อเมืองอ้างว่า 'อัจฉริยะ' แต่ค่า PM2.5 อันตราย อัตราอาชญากรรมเพิ่มขึ้น หรือประชาชนซื้อบ้านไม่ได้ — ข้อมูลอยู่ที่นี่ โปร่งใสและตรวจสอบได้ งานวิจัยใน Sustainable Cities and Society แสดงว่าความโปร่งใสของข้อมูลประสิทธิภาพเมืองเพิ่มความไว้วางใจของประชาชนและการมีส่วนร่วมทางพลเมือง",
    bodyZh: "当一个城市获得了智慧城市标志但在我们的指数中评为Gamma级时，市民可以质问：钱花到哪里去了？当一个城市声称'智慧'但其PM2.5读数危险、犯罪率上升、或市民买不起房时——数据在这里，透明且可审计。发表在《可持续城市与社会》上的研究表明，城市绩效数据的透明度能增加市民信任和公民参与。本指数使每个数字都可追溯到其来源。",
  },
  {
    iconEn: "🌏",
    lensEn: "Regional model",
    lensTh: "โมเดลระดับภูมิภาค",
    lensZh: "区域模型",
    titleEn: "For ASEAN: a model for regional benchmarking",
    titleTh: "สำหรับอาเซียน: แบบจำลองสำหรับการเปรียบเทียบระดับภูมิภาค",
    titleZh: "东盟：区域基准评估的典范",
    bodyEn: "The ASEAN Smart Cities Network has 38 pilot cities across 10 countries, but no standardized way to compare them. This index, built on SLIC methodology, can be adapted for any ASEAN city. Thailand is the first country to create a transparent, citizen-centric smart city index for its own cities. The methodology is open — any country can adopt it. The Frontiers in Sustainable Cities journal documented how Thailand's data-driven approach contributes to smart city innovation across the region.",
    bodyTh: "ASEAN Smart Cities Network มี 38 เมืองนำร่องใน 10 ประเทศ แต่ไม่มีวิธีมาตรฐานในการเปรียบเทียบ ดัชนีนี้สร้างจากวิธีการ SLIC สามารถปรับใช้กับเมืองอาเซียนใดก็ได้ ไทยเป็นประเทศแรกที่สร้างดัชนีเมืองอัจฉริยะแบบโปร่งใสเน้นประชาชนสำหรับเมืองของตัวเอง วิธีการเปิดเผย — ประเทศใดก็นำไปใช้ได้",
    bodyZh: "东盟智慧城市网络在10个国家拥有38个试点城市，但没有标准化的比较方式。本指数基于SLIC方法论，可适用于任何东盟城市。泰国是第一个为本国城市创建透明、以市民为中心的智慧城市指数的国家。方法论是开放的——任何国家都可以采用。《可持续城市前沿》期刊记录了泰国的数据驱动方法如何促进该地区的智慧城市创新。",
  },
  {
    iconEn: "🎯",
    lensEn: "Policy targeting",
    lensTh: "การกำหนดเป้าหมายนโยบาย",
    lensZh: "政策瞄准",
    titleEn: "For policymakers: evidence-based decisions",
    titleTh: "สำหรับผู้กำหนดนโยบาย: ตัดสินใจบนหลักฐาน",
    titleZh: "政策制定者：基于证据的决策",
    bodyEn: "Thailand's target is 105 smart cities by 2027. But how do you allocate limited resources? This index shows which cities are closest to Alpha tier and would benefit most from targeted investment, which cities are stuck in Gamma and need fundamental infrastructure before smart technology, and which policies actually correlate with better outcomes. Academic research in Land Use Policy (2024) demonstrates that composite smart city indices enable more efficient resource allocation when they are transparent about their methodology.",
    bodyTh: "ไทยตั้งเป้า 105 เมืองอัจฉริยะภายปี 2570 แต่จะจัดสรรทรัพยากรจำกัดอย่างไร? ดัชนีนี้แสดงว่าเมืองไหนใกล้ Alpha ที่สุดและจะได้ประโยชน์มากที่สุดจากการลงทุนตรงเป้า เมืองไหนติดอยู่ที่ Gamma และต้องการโครงสร้างพื้นฐานก่อนเทคโนโลยีอัจฉริยะ และนโยบายใดสัมพันธ์กับผลลัพธ์ที่ดีขึ้นจริง",
    bodyZh: "泰国的目标是到2027年拥有105个智慧城市。但如何分配有限的资源？本指数显示哪些城市最接近Alpha级别并能从定向投资中获益最大，哪些城市困在Gamma级别需要先完善基础设施再引入智能技术，以及哪些政策实际上与更好的成果相关。《土地利用政策》(2024)的学术研究表明，当复合智慧城市指数的方法论透明时，能实现更高效的资源分配。",
  },
];

const references = [
  { id: 1, textEn: "Financial Times fDi Benchmark — city-level FDI site selection intelligence used by 70+ investment promotion agencies globally", textTh: "Financial Times fDi Benchmark — ข้อมูลเลือกสถานที่ FDI ระดับเมือง ใช้โดยหน่วยงานส่งเสริมการลงทุน 70+ แห่งทั่วโลก", textZh: "金融时报fDi基准——全球70多家投资促进机构使用的城市级FDI选址情报", url: "https://www.fdibenchmark.com/" },
  { id: 2, textEn: "IMD Smart City Index 2026 — \"Transparency and public trust are key to urban success\"", textTh: "IMD Smart City Index 2026 — 'ความโปร่งใสและความไว้วางใจสาธารณะเป็นกุญแจสู่ความสำเร็จของเมือง'", textZh: "IMD智慧城市指数2026——透明度和公众信任是城市成功的关键", url: "https://www.imd.org/smart-city-observatory/home/" },
  { id: 3, textEn: "Measuring progress of smart cities: Indexing the smart city indices — Technological Forecasting and Social Change (2022)", textTh: "Measuring progress of smart cities — Technological Forecasting and Social Change (2022)", textZh: "衡量智慧城市进展：智慧城市指数的指数化——《技术预测与社会变革》(2022)", url: "https://www.sciencedirect.com/science/article/pii/S2664328622000699" },
  { id: 4, textEn: "How data contributes to Thailand's smart city innovation — Frontiers in Sustainable Cities (2024)", textTh: "ข้อมูลมีส่วนต่อนวัตกรรมเมืองอัจฉริยะไทยอย่างไร — Frontiers in Sustainable Cities (2024)", textZh: "数据如何促进泰国智慧城市创新——《可持续城市前沿》(2024)", url: "https://www.frontiersin.org/journals/sustainable-cities/articles/10.3389/frsc.2024.1473123/full" },
  { id: 5, textEn: "Smart city competitiveness index: conceptualization, modelling, application — Land Use Policy (2024)", textTh: "ดัชนีการแข่งขันเมืองอัจฉริยะ: แนวคิด การสร้างแบบจำลอง การประยุกต์ — Land Use Policy (2024)", textZh: "智慧城市竞争力指数：概念化、建模、应用——《土地利用政策》(2024)", url: "https://www.sciencedirect.com/science/article/abs/pii/S0264837724003612" },
  { id: 6, textEn: "Smart Cities Dive — How local governments leverage smart city indicators to enhance urban competitiveness", textTh: "Smart Cities Dive — รัฐบาลท้องถิ่นใช้ตัวชี้วัดเมืองอัจฉริยะเพิ่มความสามารถแข่งขันเมืองอย่างไร", textZh: "Smart Cities Dive——地方政府如何利用智慧城市指标提升城市竞争力", url: "https://www.smartcitiesdive.com/press-release/20241119-how-local-governments-can-leverage-smart-city-indicators-to-enhance-urban-c-1/" },
];

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

export default function WhyPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section" style={{ paddingTop: "7rem", paddingBottom: "1.5rem" }}>
        <p className="eyebrow">{t(locale, "Why this index", "ทำไมดัชนีนี้", "为什么需要这个指数")}</p>
        <h1 className="hero-title">
          {locale === "th"
            ? <>ใครได้ประโยชน์<br />และอย่างไร</>
            : locale === "zh"
              ? <>谁受益<br />以及如何受益</>
              : <>Who benefits,<br />and how.</>}
        </h1>
        <p className="hero-strapline">
          {t(locale,
            "A transparent city index isn't a vanity project. It's infrastructure for smarter investment, better policy, and stronger citizen voice. Here's the evidence.",
            "ดัชนีเมืองที่โปร่งใสไม่ใช่โครงการเพื่อภาพลักษณ์ แต่เป็นโครงสร้างพื้นฐานสำหรับการลงทุนที่ฉลาดกว่า นโยบายที่ดีกว่า และเสียงประชาชนที่แข็งแกร่งกว่า นี่คือหลักฐาน",
            "透明的城市指数不是虚荣项目。它是更明智投资、更好政策和更强公民话语权的基础设施。以下是证据。"
          )}
        </p>
      </section>

      <section className="section story-metric-section">
        <div className="story-metric-grid">
          <div className="story-metric-card">
            <div className="story-metric-value">49</div>
            <div className="story-metric-label">{t(locale, "Cities compared", "เมืองที่เปรียบเทียบ", "比较城市")}</div>
          </div>
          <div className="story-metric-card">
            <div className="story-metric-value">3</div>
            <div className="story-metric-label">{t(locale, "Tiers, not fake precision", "จัดเป็น 3 ระดับ ไม่ใช่ความแม่นยำปลอม", "三层级，而非虚假精确")}</div>
          </div>
          <div className="story-metric-card">
            <div className="story-metric-value">7</div>
            <div className="story-metric-label">{t(locale, "Pillars under the hood", "เสาหลักใต้ฝากระโปรง", "底层 7 个支柱")}</div>
          </div>
          <div className="story-metric-card">
            <div className="story-metric-value">Open</div>
            <div className="story-metric-label">{t(locale, "Weights and sources", "น้ำหนักและแหล่งข้อมูล", "权重与来源")}</div>
          </div>
        </div>
      </section>

      <section className="section">
        {benefits.map((b, i) => (
          <div key={i} className="benefit-block">
            <div className="benefit-icon">{b.iconEn}</div>
            <div className="benefit-content">
              <p className="benefit-lens">
                {locale === "th" ? b.lensTh : locale === "zh" ? b.lensZh : b.lensEn}
              </p>
              <h2 className="benefit-title">
                {locale === "th" ? b.titleTh : locale === "zh" ? b.titleZh : b.titleEn}
              </h2>
              <p className="benefit-body">
                {locale === "th" ? b.bodyTh : locale === "zh" ? b.bodyZh : b.bodyEn}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="story-source-note">
          {t(
            locale,
            "These references explain why benchmarking matters. Some are Thailand-specific, some are broader smart-city research, and together they justify the need for a transparent city index.",
            "เอกสารอ้างอิงชุดนี้อธิบายว่าทำไมการเทียบเคียงจึงสำคัญ บางชิ้นเฉพาะไทย บางชิ้นเป็นงานวิจัยกว้างๆ ด้านสมาร์ตซิตี้ และเมื่อนำมารวมกัน มันรองรับเหตุผลของการมีดัชนีเมืองที่โปร่งใส",
            "这些参考文献用于说明为什么城市比较有必要。有些专门针对泰国，有些属于更广泛的智慧城市研究，合起来为透明城市指数提供了论证基础。")}
        </p>
        <p className="eyebrow">{t(locale, "References", "เอกสารอ้างอิง", "参考文献")}</p>
        <h2>{t(locale, "Sources and citations", "แหล่งข้อมูลและการอ้างอิง", "来源与引用")}</h2>
        <div className="references-list">
          {references.map(ref => (
            <a key={ref.id} href={ref.url} target="_blank" rel="noopener noreferrer" className="reference-item">
              <span className="reference-num">[{ref.id}]</span>
              <span className="reference-text">
                {locale === "th" ? ref.textTh : locale === "zh" ? ref.textZh : ref.textEn}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <div className="callout-card">
          <h2>{t(locale,
            "This index is open. Use it.",
            "ดัชนีนี้เปิดเผย ใช้ได้เลย",
            "本指数是开放的。请使用。"
          )}</h2>
          <p>{t(locale,
            "Every score, every weight, every data source is transparent. Cities can use this to benchmark themselves. Investors can use this to discover opportunities. Citizens can use this to hold their leaders accountable. The methodology is built on SLIC — the same framework presented at the Smart City Summit & Expo in Taipei to 174 cities from 53 countries.",
            "ทุกคะแนน ทุกน้ำหนัก ทุกแหล่งข้อมูลโปร่งใส เมืองใช้เพื่อเปรียบเทียบตัวเอง นักลงทุนใช้เพื่อค้นพบโอกาส ประชาชนใช้เพื่อตรวจสอบผู้นำ วิธีการสร้างจาก SLIC — กรอบเดียวกันที่นำเสนอที่ SCSE ไทเปต่อ 174 เมืองจาก 53 ประเทศ",
            "每个分数、每个权重、每个数据来源都是透明的。城市可以用它来对标自己。投资者可以用它来发现机会。市民可以用它来让领导者承担责任。方法论基于SLIC——同一框架在台北智慧城市展上向来自53个国家的174个城市展示。"
          )}</p>
          <button className="cta-button" onClick={() => onNavigate("/rankings")}>
            {t(locale, "Explore the rankings", "สำรวจอันดับ", "探索排名")}
          </button>
        </div>
      </section>
    </>
  );
}
