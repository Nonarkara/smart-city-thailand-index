import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function CreativeEconomyPage({ locale, onNavigate }: Props) {
  const [section1Ref, section1Visible] = useInView(0.1);
  const [section2Ref, section2Visible] = useInView(0.1);
  const [section3Ref, section3Visible] = useInView(0.1);
  const [section4Ref, section4Visible] = useInView(0.1);

  return (
    <div className="about-page">
      <section className="section reveal visible" style={{ paddingTop: "7rem", paddingBottom: "1.5rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Creative Economy", th: "เศรษฐกิจสร้างสรรค์", zh: "创意经济" })}</p>
        <h1 className="hero-title">
          {translate(locale, {
            en: "Creative Economy, Provincial Scale",
            th: "เศรษฐกิจสร้างสรรค์ระดับจังหวัด",
            zh: "省级规模的创意经济",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Thailand's creative economy spans 15 industries -- from crafts and performing arts to software, design, advertising, and cultural tourism. Yet most creative economy data stops at the national level.",
            th: "เศรษฐกิจสร้างสรรค์ของไทยครอบคลุม 15 อุตสาหกรรม ทว่าข้อมูลเศรษฐกิจสร้างสรรค์ส่วนใหญ่หยุดอยู่แค่ระดับชาติ",
            zh: "泰国的创意经济涵盖15个行业。然而，大多数创意经济数据止步于国家层面。",
          })}
        </p>
      </section>

      <section ref={section1Ref} className={`section reveal stagger-1 ${section1Visible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <div className="prose" style={{ maxWidth: "800px", margin: "0 auto", fontSize: "var(--text-body)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "1.5rem", fontWeight: "bold", fontSize: "var(--text-display)" }}>
            {translate(locale, {
              en: "SCITI goes deeper, mapping creative assets province by province so that Bangkok is no longer the default.",
              th: "SCITI เจาะลึกลงไปกว่านั้น โดยทำแผนที่สินทรัพย์เชิงสร้างสรรค์แบบรายจังหวัด เพื่อไม่ให้กรุงเทพฯ เป็นเพียงตัวเลือกเดียวอีกต่อไป",
              zh: "SCITI深入挖掘，逐省绘制创意资产地图，使曼谷不再是唯一选择。"
            })}
          </p>
        </div>
      </section>

      <section ref={section2Ref} className={`section reveal stagger-2 ${section2Visible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <div className="prose" style={{ maxWidth: "800px", margin: "0 auto", fontSize: "var(--text-body)", lineHeight: "1.7" }}>
          <h2 style={{ fontSize: "var(--text-display)", marginBottom: "1rem" }}>
            {translate(locale, { en: "How SCITI Maps Creative Assets", th: "SCITI ทำแผนที่สินทรัพย์เชิงสร้างสรรค์อย่างไร", zh: "SCITI如何绘制创意资产地图" })}
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "For each of Thailand's 77 provinces, SCITI tracks creative economy indicators across four dimensions:",
              th: "สำหรับทั้ง 77 จังหวัดของไทย SCITI ติดตามตัวชี้วัดเศรษฐกิจสร้างสรรค์ในสี่มิติ:",
              zh: "对于泰国的77个省份，SCITI在四个维度追踪创意经济指标："
            })}
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>{translate(locale, { en: "Cultural Heritage:", th: "มรดกทางวัฒนธรรม:", zh: "文化遗产：" })}</strong>{" "}
              {translate(locale, { en: "tangible and intangible assets, UNESCO designations, traditional crafts", th: "สินทรัพย์ที่จับต้องได้และจับต้องไม่ได้ การขึ้นทะเบียนยูเนสโก งานหัตถกรรมดั้งเดิม", zh: "有形与无形资产、教科文组织认定、传统手工艺" })}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>{translate(locale, { en: "Creative Infrastructure:", th: "โครงสร้างพื้นฐานเชิงสร้างสรรค์:", zh: "创意基础设施：" })}</strong>{" "}
              {translate(locale, { en: "venues, studios, co-working spaces, digital connectivity", th: "พื้นที่จัดงาน สตูดิโอ พื้นที่ทำงานร่วม และการเชื่อมต่อดิจิทัล", zh: "场馆、工作室、共享办公空间与数字连接" })}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>{translate(locale, { en: "Talent & Education:", th: "บุคลากรและการศึกษา:", zh: "人才与教育：" })}</strong>{" "}
              {translate(locale, { en: "universities, vocational training, creative workforce size", th: "มหาวิทยาลัย การฝึกอาชีพ และขนาดกำลังคนสายสร้างสรรค์", zh: "高校、职业培训与创意从业人口规模" })}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>{translate(locale, { en: "Economic Output:", th: "ผลผลิตทางเศรษฐกิจ:", zh: "经济产出：" })}</strong>{" "}
              {translate(locale, { en: "GPP contributions, BOI-promoted creative projects, SME revenue growth", th: "สัดส่วนใน GPP โครงการสร้างสรรค์ที่ BOI ส่งเสริม และการเติบโตของรายได้ SME", zh: "对省内生产总值的贡献、BOI 扶持的创意项目、中小企业营收增长" })}
            </li>
          </ul>
        </div>
      </section>

      <section ref={section3Ref} className={`section reveal stagger-3 ${section3Visible ? "visible" : ""}`} style={{ marginBottom: "2.5rem" }}>
        <div className="prose" style={{ maxWidth: "800px", margin: "0 auto", fontSize: "var(--text-body)", lineHeight: "1.7" }}>
          <h2 style={{ fontSize: "var(--text-display)", marginBottom: "1rem" }}>
            {translate(locale, { en: "CEA & UNESCO Alignment", th: "ความสอดคล้องกับ CEA และ ยูเนสโก", zh: "与CEA和联合国教科文组织的协同" })}
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "SCITI directly supports the Creative Economy Agency's (CEA) Thailand Creative District Network (TCDN), which targets 30+ creative districts across 60 provinces. Our data infrastructure gives CEA the province-level evidence base it needs to deploy resources where they matter most.",
              th: "SCITI สนับสนุนเครือข่ายย่านเศรษฐกิจสร้างสรรค์ประเทศไทย (TCDN) ของสำนักงานส่งเสริมเศรษฐกิจสร้างสรรค์ (CEA) โดยตรง ซึ่งมีเป้าหมายที่ย่านสร้างสรรค์กว่า 30 แห่งใน 60 จังหวัด โครงสร้างพื้นฐานด้านข้อมูลของเราช่วยให้ CEA มีฐานข้อมูลระดับจังหวัดที่จำเป็นต่อการจัดสรรทรัพยากรไปยังจุดที่สำคัญที่สุด",
              zh: "SCITI直接支持创意经济局 (CEA) 的泰国创意街区网络 (TCDN)，该网络针对60个省份的30多个创意街区。我们的数据基础设施为CEA提供了将资源部署到最重要地方所需的省级证据基础。"
            })}
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            {translate(locale, {
              en: "Thailand is home to 9 UNESCO Creative Cities -- among the most in Southeast Asia -- including Chiang Mai (Crafts & Folk Art), Phuket (Gastronomy), Suphan Buri (Music), Chiang Rai (Design), and Songkhla (Gastronomy). SCITI provides these cities with monitoring data for their quadrennial UNESCO reports while helping aspiring cities build the evidence case for their own applications.",
              th: "ประเทศไทยเป็นบ้านของเครือข่ายเมืองสร้างสรรค์ของยูเนสโกถึง 9 เมือง ซึ่งเป็นหนึ่งในกลุ่มที่มากที่สุดในเอเชียตะวันออกเฉียงใต้ ได้แก่ เชียงใหม่ ภูเก็ต สุพรรณบุรี เชียงราย และสงขลา SCITI นำเสนอข้อมูลติดตามผลสำหรับรายงานยูเนสโกทุก 4 ปีของเมืองเหล่านี้ ในขณะเดียวกันก็ช่วยเมืองที่มุ่งหวังจะเข้าร่วมในการสร้างฐานข้อมูลหลักฐานสำหรับการสมัครของตนเอง",
              zh: "泰国拥有9个联合国教科文组织创意城市——位居东南亚前列——包括清迈、普吉、素攀武里、清莱和宋卡。SCITI为这些城市提供每四年一次的教科文组织报告所需的监测数据，同时帮助有抱负的城市为自己的申请建立证据案例。"
            })}
          </p>
        </div>
      </section>

      <section ref={section4Ref} className={`section reveal stagger-4 ${section4Visible ? "visible" : ""}`} style={{ marginBottom: "5rem" }}>
        <div className="callout-card glass-card shadow-premium" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", padding: "3rem 2rem" }}>
          <p style={{ fontSize: "var(--text-body)", marginBottom: "1rem" }}>
            {translate(locale, {
              en: "In a country where cultural heritage data has been \"limited and dispersed across various institutes and agencies, stored in formats that pose challenges to public access,\" SCITI is the connective tissue. We operationalize UNESCO's Culture|2030 Indicators at provincial scale.",
              th: "ในประเทศที่ข้อมูลมรดกทางวัฒนธรรมมีจำกัดและกระจัดกระจายตามสถาบันต่างๆ จัดเก็บในรูปแบบที่ยากต่อการเข้าถึงของสาธารณะ SCITI คือเนื้อเยื่อเกี่ยวพันที่เชื่อมโยงสิ่งเหล่านี้เข้าด้วยกัน เรานำตัวชี้วัด Culture|2030 ของยูเนสโกมาปฏิบัติจริงในระดับจังหวัด",
              zh: "在一个文化遗产数据“有限并分散在各个机构，且储存格式难以供公众取用”的国家，SCITI正是串联这一切的纽带。我们在省级层面实操联合国教科文组织的“文化|2030”指标。"
            })}
          </p>
          <button className="cta-button" onClick={() => onNavigate("/methodology")} style={{ marginTop: "1.5rem" }}>
            {translate(locale, { en: "View Methodology", th: "ดูระเบียบวิธี", zh: "查看方法论" })}
          </button>
        </div>
      </section>
    </div>
  );
}
