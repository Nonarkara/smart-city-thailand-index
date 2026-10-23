import { INFRASTRUCTURE_EVIDENCE_NEEDS } from "./infrastructureEvidenceNeeds";
import { allCities } from "./cityData";
import { buildCohort, deriveCity, DEPA_DIMENSION_ORDER, DIMENSION_LABELS, INDICATORS, resolveProvince } from "./dimensionScores";
import { PROVINCE_BASELINE } from "./provinceBaselineData";
import { getCityName, translate } from "./cityPresentation";
import snapshot from "./researchSnapshot.json";
import type { Locale, SmartCity } from "./types";

const cohort = buildCohort(allCities);
const unknown = { en: "Not recorded", th: "ไม่ได้บันทึก", zh: "未记录" };

export default function CityResearchAppendix({city, locale}: {city: SmartCity; locale: Locale}) {
  const t = (copy: {en:string;th:string;zh:string}) => translate(locale,copy);
  const result = deriveCity(city,cohort);
  return <details className="city-research-appendix">
    <summary>{t({en:"Research appendix: observations, methods, and citation",th:"ภาคผนวกวิจัย: ข้อมูล วิธีวัด และการอ้างอิง",zh:"研究附录：观测、方法与引用"})}</summary>
    <p>{t({en:"Read each observation in its original scope and period. A target-based score describes distance from that target; a cohort percentile describes relative position. Neither establishes local infrastructure adequacy.",th:"อ่านข้อมูลแต่ละรายการตามขอบเขตพื้นที่และช่วงเวลาต้นฉบับ คะแนนเทียบเป้าหมายบอกระยะห่างจากเป้าหมายนั้น ส่วนเปอร์เซ็นไทล์บอกตำแหน่งในกลุ่มเปรียบเทียบ ทั้งสองอย่างไม่ได้ยืนยันความเพียงพอของโครงสร้างพื้นฐานในพื้นที่",zh:"请按原始地域范围和时期解读各项观测。目标评分表示距目标的差距，群体百分位表示相对位置。两者均不能证明当地基础设施充足。"})}</p>
    <div className="city-research-actions"><button type="button" onClick={()=>window.print()}>{t({en:"Print dossier and evidence",th:"พิมพ์แฟ้มเมืองและหลักฐาน",zh:"打印城市档案与证据"})}</button><a href={snapshot.path} download>{t({en:`Download research snapshot (JSON, ${(snapshot.bytes / 1048576).toFixed(1)} MB)`,th:`ดาวน์โหลดชุดข้อมูลอ้างอิง (JSON, ${(snapshot.bytes / 1048576).toFixed(1)} MB)`,zh:`下载研究快照（JSON，${(snapshot.bytes / 1048576).toFixed(1)} MB）`})}</a></div>
    <p>{t({en:"Suggested citation",th:"รูปแบบการอ้างอิง",zh:"建议引用格式"})}: SCITI (2026). {getCityName(city,locale)}. Seven-domain baseline research snapshot, {snapshot.releaseDate}, {snapshot.sha256.slice(0,16)}. https://sciti.nonarkara.org{snapshot.path}</p>
    <p>{t({en:"The download freezes all 118 cities, provincial series, indicator definitions, weights, calculated results, and the calculation source. Retain the file with your research. Its release date is not the observation date. Publication date and source-check date are not recorded consistently and are not inferred here.",th:"ไฟล์ดาวน์โหลดเก็บข้อมูลเมืองทั้ง 118 เมือง ชุดข้อมูลจังหวัด นิยามตัวชี้วัด น้ำหนัก ผลคำนวณ และต้นฉบับวิธีคำนวณไว้เป็นรุ่นเดียวกัน ควรเก็บไฟล์ร่วมกับงานวิจัย วันที่เผยแพร่รุ่นนี้ไม่ใช่วันที่สำรวจ วันที่แหล่งข้อมูลเผยแพร่และวันที่ตรวจสอบยังบันทึกไม่ครบ จึงไม่อนุมานแทน",zh:"下载文件固定保存全部 118 个城市、省级序列、指标定义、权重、计算结果与计算源码。请随研究保留文件。快照发布日期并非观测日期。来源发布日期和核查日期尚未完整记录，此处不作推断。"})}</p>
    {DEPA_DIMENSION_ORDER.map(domain=><details key={domain} className="research-domain"><summary>{DIMENSION_LABELS[domain][locale]}</summary>
      <p><strong>{t({en:"Evidence still needed for a local infrastructure judgment (SCITI research checklist)",th:"หลักฐานที่ยังต้องมีเพื่อประเมินโครงสร้างพื้นฐานในพื้นที่ (รายการตรวจสอบวิจัยของ SCITI)",zh:"判断当地基础设施仍需的证据（SCITI 研究清单）"})}: </strong>{INFRASTRUCTURE_EVIDENCE_NEEDS[domain][locale]}</p>
      {result.dimensions[domain].contributions.map(row=>{
        const definition=INDICATORS.find(def=>def.id===row.id)!;
        const series=definition.provinceId?PROVINCE_BASELINE.find(series=>series.id===definition.provinceId):undefined;
        const period=series?`${series.year}${series.quarter?` Q${series.quarter}`:""}`:t(unknown);
        return <article key={row.id} className="research-indicator"><h3>{row.label[locale]}</h3><dl>
          <dt>{t({en:"Observation",th:"ค่าที่สำรวจ",zh:"观测值"})}</dt><dd>{row.raw===null?t({en:"Missing — not zero",th:"ไม่มีข้อมูล — ไม่ใช่ศูนย์",zh:"缺失，非零值"}):row.raw.toLocaleString(locale)} {series?.unit??""}</dd>
          <dt>{t({en:"Period / scope",th:"ช่วงเวลา / ขอบเขต",zh:"时期 / 范围"})}</dt><dd>{period} · {series?`${resolveProvince(city.province)} (${t({en:"province",th:"จังหวัด",zh:"省级"})})`:t({en:"See source note; local scope not established",th:"ดูหมายเหตุแหล่งข้อมูล ยังไม่ยืนยันขอบเขตระดับพื้นที่",zh:"参见来源说明；当地范围尚未确认"})}</dd>
          <dt>{t({en:"Source",th:"แหล่งข้อมูล",zh:"来源"})}</dt><dd>{series?<><a href={series.catalogUrl}>{series.publisher}</a> · {series.dataset} / {series.table}</>:row.source[locale]}</dd>
          <dt>{t({en:"Interpretation",th:"การตีความ",zh:"解读"})}</dt><dd>{row.relative?t({en:"Relative to the cohort; not a service standard",th:"เทียบกับกลุ่มข้อมูล ไม่ใช่มาตรฐานบริการ",zh:"相对群体位置，并非服务标准"}):t({en:"Indicator scale; not a local service verdict",th:"มาตราส่วนตัวชี้วัด ไม่ใช่ข้อสรุปบริการในพื้นที่",zh:"指标量表，并非当地服务结论"})}</dd>
        </dl><p className="research-method">{t({en:"Calculation specification (English)",th:"ข้อกำหนดการคำนวณ (ภาษาอังกฤษ)",zh:"计算规范（英文）"})}: {row.scaleNote}{series?` · ${series.includes} · ${series.aggregate}`:""}</p></article>;
      })}
    </details>)}
  </details>;
}
