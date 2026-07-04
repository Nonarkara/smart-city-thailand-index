import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function AboutPage({ locale, onNavigate }: Props) {
  const [section1Ref, section1Visible] = useInView(0.1);
  const [section2Ref, section2Visible] = useInView(0.1);
  const [section3Ref, section3Visible] = useInView(0.1);
  const [section4Ref, section4Visible] = useInView(0.1);

  return (
    <div className="about-page">
      <section className="section reveal visible" style={{ paddingTop: "7rem", paddingBottom: "1.5rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Mission", th: "พันธกิจ", zh: "使命" })}</p>
        <h1 className="hero-title">
          {translate(locale, {
            en: "Why SCITI Exists",
            th: "ทำไม SCITI จึงถือกำเนิดขึ้น",
            zh: "SCITI为何存在",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Thailand's creative economy is a THB 1.44 trillion juggernaut -- 8.01% of national GDP (CEA, Creative Economy Strategic Direction 2026). But here is the problem: a disproportionate share of it happens in one city.",
            th: "เศรษฐกิจสร้างสรรค์ของไทยเป็นขุมพลังขนาด 1.44 ล้านล้านบาท หรือคิดเป็น 8.01% ของ GDP ประเทศ (CEA, ทิศทางยุทธศาสตร์เศรษฐกิจสร้างสรรค์ 2026) แต่ปัญหาคือ สัดส่วนที่มากเกินควรกระจุกตัวอยู่แค่เมืองเดียว",
            zh: "泰国的创意经济是一个价值1.44万亿泰铢的庞然大物——占国家GDP的8.01%（CEA《2026创意经济战略方向》）。但问题在于：其中相当大的一部分集中在同一座城市。",
          })}
        </p>
      </section>

      <section ref={section1Ref} className={`section reveal stagger-1 ${section1Visible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <div className="prose" style={{ maxWidth: "800px", margin: "0 auto", fontSize: "var(--text-lg)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "Bangkok and its surrounding provinces soak up the investment, the talent, and the policy attention while 76 provinces watch from the sidelines. This is not just unfair. It is inefficient.",
              th: "กรุงเทพฯ และปริมณฑลดึงดูดทั้งการลงทุน บุคลากร และความสนใจเชิงนโยบาย ในขณะที่อีก 76 จังหวัดทำได้แค่มองอยู่รอบนอก นี่ไม่ใช่แค่เรื่องของความไม่เป็นธรรม แต่มันคือความไร้ประสิทธิภาพ",
              zh: "曼谷及其周边省份吸收了投资、人才和政策关注，而其他76个省份只能在旁观望。这不仅不公平，而且效率低下。"
            })}
          </p>
          <p style={{ marginBottom: "1.5rem", fontWeight: "bold", fontSize: "var(--text-xl)" }}>
            {translate(locale, {
              en: "SCITI was built on a simple conviction: data can level the playing field.",
              th: "SCITI สร้างขึ้นจากความเชื่อมั่นง่ายๆ ว่า: ข้อมูลสามารถสร้างความเท่าเทียมได้",
              zh: "SCITI建立在一个简单的信念上：数据可以创造公平的竞争环境。"
            })}
          </p>
        </div>
      </section>

      <section ref={section2Ref} className={`section reveal stagger-2 ${section2Visible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <div className="prose" style={{ maxWidth: "800px", margin: "0 auto", fontSize: "var(--text-lg)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "We call it the \"Moneyball\" approach. Just as the Oakland Athletics used data analytics to spot undervalued baseball players that traditional scouts missed, SCITI uses provincial data to uncover hidden investment opportunities across Thailand's 77 provinces.",
              th: "เราเรียกสิ่งนี้ว่าแนวทางแบบ \"Moneyball\" เช่นเดียวกับที่ทีม Oakland Athletics ใช้การวิเคราะห์ข้อมูลเพื่อหาผู้เล่นที่ถูกประเมินค่าต่ำกว่าความเป็นจริงซึ่งแมวมองทั่วไปมองข้าม SCITI ใช้ข้อมูลระดับจังหวัดเพื่อค้นหาโอกาสการลงทุนที่ซ่อนอยู่ใน 77 จังหวัดทั่วไทย",
              zh: "我们称之为“魔球（Moneyball）”方法。就像奥克兰运动家队利用数据分析发现传统球探忽略的被低估的棒球运动员一样，SCITI利用省级数据揭示泰国77个省份中隐藏的投资机会。"
            })}
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "Every province has creative assets -- crafts clusters, festival economies, artisan communities, digital talent pools, heritage tourism potential -- but these assets are invisible without systematic data. When decision-makers lack data, they default to Bangkok. SCITI changes that calculation.",
              th: "ทุกจังหวัดมีสินทรัพย์เชิงสร้างสรรค์ ไม่ว่าจะเป็นกลุ่มงานคราฟต์ เศรษฐกิจเทศกาล ชุมชนช่างฝีมือ แหล่งรวมบุคลากรดิจิทัล หรือศักยภาพการท่องเที่ยวเชิงมรดก แต่สินทรัพย์เหล่านี้กลับมองไม่เห็นหากขาดข้อมูลที่เป็นระบบ เมื่อผู้มีอำนาจตัดสินใจไม่มีข้อมูล พวกเขาก็มักจะเลือกลงทุนในกรุงเทพฯ เป็นค่าเริ่มต้น SCITI เปลี่ยนการคำนวณนั้น",
              zh: "每个省都有创意资产——手工艺集群、节日经济、工匠社区、数字人才库、文化遗产旅游潜力——但如果没有系统的数据，这些资产是看不见的。当决策者缺乏数据时，他们默认选择曼谷。SCITI改变了这种计算方式。"
            })}
          </p>
        </div>
      </section>

      <section ref={section3Ref} className={`section reveal stagger-3 ${section3Visible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <div className="prose" style={{ maxWidth: "800px", margin: "0 auto", fontSize: "var(--text-lg)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "Our platform aggregates Gross Provincial Product, FDI flows, BOI incentive zones, infrastructure readiness, creative economy indicators, labor costs, and cultural asset data -- all in one place, all comparable, all actionable.",
              th: "แพลตฟอร์มของเรารวบรวมผลิตภัณฑ์มวลรวมจังหวัด กระแส FDI เขตส่งเสริมของ BOI ความพร้อมด้านโครงสร้างพื้นฐาน ตัวชี้วัดเศรษฐกิจสร้างสรรค์ ต้นทุนแรงงาน และข้อมูลสินทรัพย์ทางวัฒนธรรม ไว้ในที่เดียว สามารถเปรียบเทียบได้ และนำไปใช้งานได้จริง",
              zh: "我们的平台汇集了省级生产总值、FDI流量、BOI激励区、基础设施就绪度、创意经济指标、劳动力成本和文化资产数据——集中在一处，可比对，可操作。"
            })}
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "Whether you are an investor hunting for the next Chiang Mai before the market catches on, a policymaker designing decentralization strategy, or a creative entrepreneur choosing your next base, SCITI gives you the numbers to decide with confidence.",
              th: "ไม่ว่าคุณจะเป็นนักลงทุนที่กำลังตามหาเชียงใหม่แห่งต่อไปก่อนที่ตลาดจะรู้ตัว ผู้กำหนดนโยบายที่กำลังออกแบบยุทธศาสตร์การกระจายอำนาจ หรือผู้ประกอบการสร้างสรรค์ที่กำลังเลือกฐานที่มั่นแห่งใหม่ SCITI ให้ตัวเลขเพื่อให้คุณตัดสินใจได้อย่างมั่นใจ",
              zh: "无论您是寻找下一个清迈的投资者、设计去中心化战略的政策制定者，还是选择下一个基地的创意企业家，SCITI都能为您提供数据，让您充满信心地做出决策。"
            })}
          </p>
        </div>
      </section>

      <section ref={section4Ref} className={`section reveal stagger-4 ${section4Visible ? "visible" : ""}`} style={{ marginBottom: "5rem" }}>
        <div className="callout-card glass-card shadow-premium" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", padding: "3rem 2rem" }}>
          <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "1rem" }}>
            {translate(locale, {
              en: "SCITI is not just a dashboard. It is a policy argument made visible.",
              th: "SCITI ไม่ใช่แค่แดชบอร์ด แต่มันคือข้อเสนอนโยบายที่มองเห็นได้",
              zh: "SCITI不仅仅是一个仪表盘。它是一个清晰可见的政策主张。"
            })}
          </h2>
          <button className="cta-button" onClick={() => onNavigate("/rankings")} style={{ marginTop: "1.5rem" }}>
            {translate(locale, { en: "Explore the Data", th: "สำรวจข้อมูล", zh: "探索数据" })}
          </button>
        </div>
      </section>
    </div>
  );
}
