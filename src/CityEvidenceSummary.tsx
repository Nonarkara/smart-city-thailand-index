import CityResearchAppendix from "./CityResearchAppendix";
import { allCities } from "./cityData";
import { buildCohort, deriveCity, DEPA_DIMENSION_ORDER, DIMENSION_LABELS, INDICATORS } from "./dimensionScores";
import { SOURCE_REGISTRY } from "./baselineSources";
import { getProvinceName, translate } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

const cohort = buildCohort(allCities);

/** Observation availability is never interpreted as service adequacy. */
export default function CityEvidenceSummary({ city, locale }: { city: SmartCity; locale: Locale }) {
  const result = deriveCity(city, cohort);
  const measured = DEPA_DIMENSION_ORDER.filter(domain => result.dimensions[domain].contributions.some(row => row.raw !== null)).length;
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  return <section className="section city-evidence-summary" aria-labelledby="city-evidence-title">
    <h2 id="city-evidence-title">{t({ en: "What the baseline can tell you", th: "สิ่งที่ข้อมูลฐานบอกได้ — และสิ่งที่บอกไม่ได้", zh: "基线能说明什么 — 不能说明什么" })}</h2>
    <p className="city-evidence-finding">{t({ en: `Baseline inputs in ${measured} of 7 domains; local infrastructure adequacy remains unverified`, th: `มีข้อมูลฐาน ${measured} จาก 7 มิติ แต่ยังยืนยันความเพียงพอของโครงสร้างพื้นฐานในพื้นที่ไม่ได้`, zh: `${measured} 个领域有基线输入（共 7 个）；当地基础设施是否充足仍待核实` })}</p>
    <p>{t({ en: "The livability assessment uses SCITI’s curated seven pillars. The depa baseline below measures a different set of seven domains. Available inputs do not establish whether local infrastructure is sufficient.", th: "การประเมินความน่าอยู่ใช้เกณฑ์เจ็ดด้านที่ SCITI คัดสรร ส่วนข้อมูลฐานตามกรอบ depa ด้านล่างวัดเจ็ดมิติอีกชุดหนึ่ง การมีข้อมูลไม่ได้ยืนยันว่าโครงสร้างพื้นฐานในพื้นที่เพียงพอ", zh: "宜居评估采用 SCITI 策划的七项支柱。下方 depa 基线衡量另一组七个领域。有输入数据并不代表当地基础设施充足。" })}</p>
    {city.status !== "registered" && result.composite !== null && (
      <p>{t({
        en: `Curated livability composite: ${city.compositeScore.toFixed(1)}/100. Seven-domain baseline: ${result.composite}/100. Each uses different inputs and weights.`,
        th: `คะแนนรวมความน่าอยู่ที่คัดสรร ${city.compositeScore.toFixed(1)}/100 คะแนนฐานเจ็ดมิติ ${result.composite}/100 ทั้งสองใช้ข้อมูลและน้ำหนักต่างกัน`,
        zh: `策划宜居综合分 ${city.compositeScore.toFixed(1)}/100，七领域基线分 ${result.composite}/100。两者使用不同的输入和权重。`,
      })}</p>
    )}
    <p className="city-baseline-disclosure">{t({ en: "City metrics are curated baseline inputs. Catalogue dates and confidence labels describe the baseline, not local observation or verification. Agency links identify source families; check the original series before citing a city value.", th: "ตัวเลขเมืองเป็นข้อมูลฐานที่คัดสรร วันที่ในทะเบียนและระดับความเชื่อมั่นอธิบายชุดข้อมูล ไม่ได้ยืนยันการสำรวจหรือตรวจสอบในพื้นที่ ลิงก์หน่วยงานระบุประเภทแหล่งข้อมูล ควรตรวจชุดข้อมูลต้นฉบับก่อนอ้างตัวเลขของเมือง", zh: "城市指标属于编辑整理的基线输入。目录日期和置信标签描述基线，不代表本地观测或核验。机构链接标识来源类别；引用城市数值前应核查原始序列。" })}</p>
    {city.id === "phuket" && (
      <p>{t({
        en: "Before citing outcomes: the reported traffic improvement lacks a linked measurement report. The finance screen uses research proxies. Check project costs, demand and operating evidence before use.",
        th: "ก่อนอ้างผลลัพธ์ รายงานการปรับปรุงจราจรไม่มีลิงก์รายงานการวัด คะแนนคัดกรองการเงินใช้ตัวชี้วัดแทน ควรตรวจต้นทุน อุปสงค์ และหลักฐานการดำเนินงานของโครงการก่อนใช้",
        zh: "引用成效前，请注意交通改善说法缺少测量报告链接。融资筛选采用研究代理指标。使用前请核查项目成本、需求和运营证据。",
      })}</p>
    )}
    <details className="city-evidence-details"><summary>{t({ en: "Explore evidence across seven domains", th: "ดูหลักฐานทั้งเจ็ดมิติ", zh: "查看七个领域的证据" })}</summary>
      <p>{t({ en: `Provincial context: ${getProvinceName(city, locale)}. Cities in the same province can share these inputs. The table counts available inputs, including estimates and derived values.`, th: `บริบทระดับจังหวัด: ${getProvinceName(city, locale)} เมืองในจังหวัดเดียวกันอาจใช้ข้อมูลชุดเดียวกัน ตารางนับตัวชี้วัดที่มีข้อมูล รวมค่าประมาณและค่าคำนวณ`, zh: `省级背景：${getProvinceName(city, locale)}。同省城市可能共用这些输入。下表统计有输入的指标，包括估算值与衍生值。` })}</p>
      <table><caption>{t({ en: "Evidence availability · not infrastructure adequacy", th: "ความพร้อมของข้อมูล · ไม่ใช่ความเพียงพอของโครงสร้างพื้นฐาน", zh: "证据可用性 · 非基础设施充足程度" })}</caption>
        <thead><tr><th>{t({ en: "Domain", th: "มิติ", zh: "领域" })}</th><th>{t({ en: "Inputs / selected", th: "มีข้อมูล / ที่เลือกวัด", zh: "有输入 / 已选指标" })}</th><th>{t({ en: "Provincial indicators", th: "ตัวชี้วัดระดับจังหวัด", zh: "省级指标" })}</th></tr></thead>
        <tbody>{DEPA_DIMENSION_ORDER.map(domain => {
          const rows = result.dimensions[domain].contributions;
          const observed = rows.filter(row => row.raw !== null);
          const provincial = observed.filter(row => INDICATORS.find(def => def.id === row.id)?.origin === "province").length;
          return <tr key={domain}><th scope="row">{DIMENSION_LABELS[domain][locale]}</th><td>{observed.length} / {rows.length}</td><td>{provincial}</td></tr>;
        })}</tbody>
      </table>
      <p>{t({ en: "Infrastructure adequacy: not established by this baseline. A defensible verdict needs local service coverage, capacity, reliability, and a named benchmark. Derived and city-metric indicators also need their individual source scope checked.", th: "ความเพียงพอของโครงสร้างพื้นฐาน: ข้อมูลฐานนี้ยังยืนยันไม่ได้ ต้องมีข้อมูลความครอบคลุม กำลังให้บริการ ความเชื่อถือได้ และเกณฑ์อ้างอิงที่ชัดเจน ตัวชี้วัดคำนวณและตัวชี้วัดเมืองต้องตรวจสอบขอบเขตแหล่งข้อมูลเป็นรายตัวด้วย", zh: "基础设施充足程度：本基线尚不能确认。判断需要当地服务覆盖、容量、可靠性及明确基准。衍生指标和城市指标也须逐项核查来源的地理范围。" })}</p>
      <p>{t({ en: "Baseline sources and observation periods", th: "แหล่งข้อมูลฐานและช่วงเวลาที่สำรวจ", zh: "基线来源与观测时期" })}: <a href="/baseline">{t({ en: "Baseline", th: "ข้อมูลฐาน", zh: "基线" })}</a> · <a href="/methodology">{t({ en: "Methods and weights", th: "วิธีวัดและน้ำหนัก", zh: "方法与权重" })}</a></p>
      <ul>{SOURCE_REGISTRY.filter(source => source.serves.length > 0).map(source => <li key={source.id}><a href={source.url}>{source.publisher}: {source.title}</a></li>)}</ul>
      <p>{t({ en: "Source-link checks are not observation dates. These series have different vintages; they are not a real-time service monitor.", th: "วันที่ตรวจสอบลิงก์ไม่ใช่วันที่สำรวจ ข้อมูลแต่ละชุดมาจากต่างช่วงเวลา และไม่ใช่ระบบติดตามบริการแบบเรียลไทม์", zh: "链接核查日期并非观测日期。各序列年份不同，不能视为实时服务监测。" })}</p>
    </details>
    <CityResearchAppendix city={city} locale={locale} />
  </section>;
}
