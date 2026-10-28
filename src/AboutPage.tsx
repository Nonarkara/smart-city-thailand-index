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
      <section className="page-hero section reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Mission", th: "พันธกิจ", zh: "使命" })}</p>
        <h1 className="hero-title">
          {translate(locale, {
            en: "About the city data platform",
              th: "เกี่ยวกับแพลตฟอร์มข้อมูลเมือง",
              zh: "关于城市数据平台",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "SCITI brings Thailand’s smart-city records, research estimates, maps and source-linked city profiles into one public reference. Its purpose is to help people ask better questions about where to live, learn, work, visit or invest.",
              th: "SCITI รวมทะเบียนเมืองอัจฉริยะ ค่าประมาณวิจัย แผนที่ และแฟ้มเมืองพร้อมแหล่งอ้างอิงไว้ในแหล่งข้อมูลสาธารณะเดียว เพื่อช่วยตั้งคำถามที่ดีขึ้นเกี่ยวกับเมืองที่จะอยู่อาศัย เรียน ทำงาน ท่องเที่ยว หรือลงทุน",
              zh: "SCITI将泰国智慧城市名录、研究估算、地图与附来源的城市档案汇集为公共参考，帮助人们更好地思考居住、学习、工作、旅行或投资的地点。",
          })}
        </p>
      </section>

      <section ref={section1Ref} className={`section reveal stagger-1 ${section1Visible ? "visible" : ""}`}>
        <div className="prose" style={{ maxWidth: "65ch", margin: "0 auto", fontSize: "var(--text-body)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "A city record may describe a province, municipality, district, campus or special zone. Those geographic units are not interchangeable. Each dossier should be read with its stated scope and source limitations.",
              th: "ระเบียนเมืองอาจหมายถึงจังหวัด เทศบาล เขต วิทยาเขต หรือเขตพิเศษ หน่วยพื้นที่เหล่านี้ใช้แทนกันไม่ได้ ควรอ่านแฟ้มเมืองควบคู่กับขอบเขตและข้อจำกัดของแหล่งข้อมูล",
              zh: "城市记录可能指府、市镇、区、校园或特别区域。这些地理单位不可互换，阅读档案时须结合其范围与来源限制。"
            })}
          </p>
          <p style={{ marginBottom: ".75rem", fontWeight: "bold", fontSize: "var(--text-body)" }}>
            {translate(locale, {
              en: "The useful question is not simply which city ranks first, but which evidence supports a decision.",
              th: "คำถามที่สำคัญไม่ใช่เพียงเมืองใดได้อันดับหนึ่ง แต่คือหลักฐานใดรองรับการตัดสินใจ",
              zh: "有用的问题不只是哪个城市排名第一，而是哪些证据能够支持决策。"
            })}
          </p>
        </div>
      </section>

      <section ref={section2Ref} className={`section reveal stagger-2 ${section2Visible ? "visible" : ""}`}>
        <div className="prose" style={{ maxWidth: "65ch", margin: "0 auto", fontSize: "var(--text-body)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "Rankings are one way to navigate the research. Maps, comparisons, city dossiers and the source registry offer other routes into the same material. A score is a research estimate, not a service guarantee or an investment recommendation.",
              th: "อันดับเป็นวิธีหนึ่งในการสำรวจงานวิจัย แผนที่ การเปรียบเทียบ แฟ้มเมือง และทะเบียนแหล่งข้อมูลเป็นอีกหลายทางเข้าสู่ข้อมูลชุดเดียวกัน คะแนนคือค่าประมาณวิจัย ไม่ใช่การรับประกันบริการหรือคำแนะนำลงทุน",
              zh: "排名只是浏览研究的一种方式。地图、对比、城市档案与来源登记表提供其他入口。分数属于研究估算，并非服务保证或投资建议。"
            })}
          </p>
          <p style={{ marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "Cultural photographs and objects help readers see a place beyond its numbers. Their captions identify sources, authors, reuse rights and whether the connection is local, provincial or regional. An attractive image does not establish a project boundary.",
              th: "ภาพถ่ายและวัตถุทางวัฒนธรรมช่วยให้เห็นเมืองมากกว่าตัวเลข คำบรรยายระบุแหล่งที่มา ผู้สร้าง สิทธิการใช้ และความเกี่ยวข้องระดับพื้นที่ จังหวัด หรือภูมิภาค ภาพที่สวยงามไม่ใช่หลักฐานยืนยันขอบเขตโครงการ",
              zh: "文化照片与文物让读者看见数字之外的地方。说明文字标注来源、作者、使用权及当地、省级或区域关联。漂亮的影像并不能证明项目边界。"
            })}
          </p>
        </div>
      </section>

      <section ref={section3Ref} className={`section reveal stagger-3 ${section3Visible ? "visible" : ""}`}>
        <div className="prose" style={{ maxWidth: "65ch", margin: "0 auto", fontSize: "var(--text-body)", lineHeight: "1.7" }}>
          <p style={{ marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "SCITI combines a city registry, curated research scores, provincial statistical baselines and linked cultural context. Source dates and geographic coverage vary. FDI flows, site-level costs and infrastructure capacity are not complete comparable datasets here; verify them separately for a project.",
              th: "SCITI รวมทะเบียนเมือง คะแนนวิจัยที่เรียบเรียงไว้ ข้อมูลสถิติระดับจังหวัด และบริบทวัฒนธรรมพร้อมลิงก์อ้างอิง ช่วงเวลาและขอบเขตข้อมูลต่างกัน ข้อมูลกระแส FDI ต้นทุนรายพื้นที่ และความจุโครงสร้างพื้นฐานยังไม่ใช่ชุดข้อมูลเปรียบเทียบที่ครบถ้วน ต้องตรวจสอบแยกสำหรับแต่ละโครงการ",
              zh: "SCITI汇集城市名录、编辑研究评分、省级统计基线和附有链接的文化背景。来源时期与地理范围各异。这里尚无完整可比的FDI流量、具体地点成本或基础设施容量数据；项目须另行核实。"
            })}
          </p>
          <p style={{ marginBottom: ".75rem" }}>
            {translate(locale, {
              en: "Use the platform to build a shortlist, locate original sources and identify missing evidence. For a consequential decision, verify current conditions and the specific project or neighbourhood on the ground.",
              th: "ใช้แพลตฟอร์มเพื่อคัดเลือกเมืองเบื้องต้น ค้นหาแหล่งข้อมูลต้นฉบับ และระบุหลักฐานที่ยังขาด สำหรับการตัดสินใจสำคัญ ควรตรวจสภาพปัจจุบันและพื้นที่โครงการหรือย่านนั้นโดยตรง",
              zh: "可用本平台筛选候选城市、查找原始来源并识别证据缺口。作出重要决定前，仍需实地核查当前情况及具体项目或社区。"
            })}
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="nong-plub-credit" data-mascot-consent="confirmed">
        <div className="prose" style={{ maxWidth: "65ch", margin: "0 auto" }}>
          <h2 id="nong-plub-credit">{translate(locale, { en: "Meet Nong Plub", th: "รู้จักน้องพลับ", zh: "认识小普" })}</h2>
          <p>{translate(locale, {
            en: "Nong Plub is the platform’s mascot and illustrated guide. She has consented to the use of her likeness to promote Thailand’s smart cities. Thank you, Nong Plub, for giving this public reference a familiar face.",
            th: "น้องพลับคือมาสคอตและผู้นำทางในภาพประกอบของแพลตฟอร์ม น้องพลับยินยอมให้ใช้ภาพลักษณ์เพื่อส่งเสริมเมืองอัจฉริยะของไทย ขอขอบคุณน้องพลับที่ช่วยให้แหล่งข้อมูลสาธารณะนี้มีใบหน้าที่คุ้นเคย",
            zh: "小普是本平台的吉祥物与插画向导。她已同意使用其形象来推广泰国智慧城市。感谢小普，让这份公共参考有了一张亲切熟悉的面孔。",
          })}</p>
          <p>{translate(locale, {
            en: "The crayon portraits are AI-generated illustrations based on supplied photographs. They introduce content; they are not evidence that she visited a city or verified its services.",
            th: "ภาพวาดสีเทียนสร้างด้วย AI จากภาพถ่ายอ้างอิง ใช้แนะนำเนื้อหา ไม่ใช่หลักฐานว่าน้องพลับไปเยือนเมืองหรือตรวจสอบบริการของเมืองนั้น",
            zh: "蜡笔肖像是依据所提供照片生成的AI插画，用于介绍内容，并非她到访城市或核验其服务的证据。",
          })}</p>
        </div>
      </section>

      <section ref={section4Ref} className={`section reveal stagger-4 ${section4Visible ? "visible" : ""}`}>
        <div className="callout-card" style={{ maxWidth: "65ch", margin: "0 auto", textAlign: "left", padding: "1rem 0" }}>
          <h2 style={{ fontSize: "var(--text-body)", marginBottom: "1rem" }}>
            {translate(locale, {
              en: "Start with a city. Follow its sources. Keep the unanswered questions visible.",
              th: "เริ่มจากเมืองที่สนใจ ตามไปดูแหล่งข้อมูล และมองเห็นคำถามที่ยังไม่มีคำตอบ",
              zh: "从一座城市开始，追溯来源，让尚未解答的问题保持可见。"
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
