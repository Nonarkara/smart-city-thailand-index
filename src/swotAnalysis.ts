import { isEecProvince } from "./eecGeography";
import type { SmartCity, Locale } from "./types";
import { PILLAR_LABELS } from "./types";
import { translate } from "./cityPresentation";

export interface CitySWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/** Research prompts from the stored record, not an assessment of project viability. */
export function generateSWOT(city: SmartCity, locale: Locale = "en"): CitySWOT {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];
  const text = (en: string, th: string, zh: string) => translate(locale, { en, th, zh });
  const labels = PILLAR_LABELS[locale];
  for (const [pillar, score] of Object.entries(city.scores)) {
    const label = labels[pillar as keyof typeof labels];
    if (score >= 65) strengths.push(`${label} ${score}/100 — ${text("higher curated score", "คะแนนประเมินค่อนข้างสูง", "较高的编辑评分")}`);
    if (score < 45) weaknesses.push(`${label} ${score}/100 — ${text("lower curated score; verify evidence", "คะแนนประเมินค่อนข้างต่ำ ควรตรวจหลักฐาน", "较低的编辑评分；请核查证据")}`);
  }
  if (city.status === "certified") strengths.push(text("Official smart-city recognition; does not certify every service is operating", "ได้รับการรับรองเมืองอัจฉริยะ ไม่ได้ยืนยันว่าทุกบริการเปิดใช้แล้ว", "获官方智慧城市认可；不代表各项服务均已运营"));
  if (city.reality === "operational") strengths.push(text("Stored record describes operational activity; check project-level evidence", "ทะเบียนระบุว่ามีกิจกรรมที่เปิดใช้งาน ควรตรวจหลักฐานรายโครงการ", "存储记录描述了运营活动；请核查项目级证据"));
  if (city.reality === "planned") weaknesses.push(text("Record is plan-stage; current operating status needs verification", "ทะเบียนอยู่ในขั้นแผน ต้องตรวจสถานะการใช้งานปัจจุบัน", "记录处于规划阶段；当前运营状态待核实"));
  if (city.dataConfidence === "low") weaknesses.push(text("Limited evidence confidence", "ความเชื่อมั่นหลักฐานต่ำ", "证据置信度有限"));

  const gpp = city.metrics.gppPerCapita;
  if (gpp != null && gpp > 300000) strengths.push(text(`Stored provincial GPP per capita: ฿${gpp.toLocaleString("en-US")} (not municipal revenue)`, `GPP ต่อหัวระดับจังหวัดในข้อมูล: ฿${gpp.toLocaleString("en-US")} ไม่ใช่รายได้เทศบาล`, `存储的省级人均GPP：฿${gpp.toLocaleString("en-US")}，并非市政收入`));
  const pm25 = city.metrics.pm25Annual;
  if (pm25 != null && pm25 > 5) threats.push(text(`Stored annual PM₂.₅ ${pm25} µg/m³; above WHO 2021 annual guideline of 5 (not a current reading)`, `PM₂.₅ เฉลี่ยรายปีในข้อมูล ${pm25} µg/m³ สูงกว่าแนวทางรายปี WHO 2021 ที่ 5 ไม่ใช่ค่าปัจจุบัน`, `存储的年均PM₂.₅为${pm25} µg/m³，高于WHO 2021年均指南值5；并非当前读数`));
  const crime = city.metrics.crimeRatePer100k;
  if (crime != null && crime > 200) threats.push(text(`Stored crime rate: ${crime}/100,000; verify period and geography`, `อัตราอาชญากรรมในข้อมูล ${crime}/แสนคน ควรตรวจช่วงเวลาและขอบเขต`, `存储的犯罪率：${crime}/十万人；请核查时期与地理范围`));
  const green = city.metrics.greenCoverage;
  if (green != null && green > 50) strengths.push(text(`Stored green-coverage estimate: ${green}%; verify definition and boundary`, `ค่าประมาณพื้นที่สีเขียวในข้อมูล ${green}% ควรตรวจนิยามและขอบเขต`, `存储的绿化覆盖估计：${green}%；请核查定义与边界`));

  if (isEecProvince(city.province)) opportunities.push(text("EEC province: investigate project-specific BOI conditions; no automatic eligibility", "อยู่ในจังหวัด EEC ควรตรวจเงื่อนไข BOI รายโครงการ ไม่มีสิทธิอัตโนมัติ", "位于EEC府份：请核查项目的BOI条件；不自动取得资格"));
  if (city.smartDimensions.includes("energy")) opportunities.push(text("Energy programme: investigate a qualifying green project and repayment model", "แผนพลังงาน ควรศึกษาโครงการสีเขียวที่เข้าเกณฑ์และรูปแบบชำระคืน", "能源计划：研究合资格绿色项目及偿还模式"));
  if (city.smartDimensions.includes("mobility")) opportunities.push(text("Mobility programme: investigate local access, demand and operating evidence", "แผนการเดินทาง ควรตรวจการเข้าถึง อุปสงค์ และหลักฐานการเปิดใช้", "出行计划：核查当地可达性、需求及运营证据"));
  if (city.smartDimensions.length >= 5) strengths.push(text(`Programme scope names ${city.smartDimensions.length}/7 dimensions; not a service-coverage measure`, `ขอบเขตแผนระบุ ${city.smartDimensions.length}/7 มิติ ไม่ใช่ค่าความครอบคลุมบริการ`, `计划范围列有${city.smartDimensions.length}/7个维度；并非服务覆盖率`));

  // Absence of a generated warning is not evidence of safety or funding availability.
  if (!strengths.length) strengths.push(text("City registry entry available for further investigation", "มีข้อมูลทะเบียนเมืองสำหรับศึกษาต่อ", "已有城市名录记录，可进一步研究"));
  if (!weaknesses.length) weaknesses.push(text("This rule set establishes no additional weakness; evidence gaps may remain", "กฎชุดนี้ไม่ระบุจุดอ่อนเพิ่ม ยังอาจมีช่องว่างหลักฐาน", "本规则未识别其他弱项；仍可能存在证据缺口"));
  if (!opportunities.length) opportunities.push(text("Investigate demand, delivery capacity and programme terms before proposing a project", "ควรศึกษาอุปสงค์ ศักยภาพส่งมอบ และเงื่อนไขก่อนเสนอโครงการ", "提出项目前请研究需求、交付能力及计划条款"));
  if (!threats.length) threats.push(text("No additional risk identified by these limited inputs; not an all-clear", "ข้อมูลจำกัดชุดนี้ไม่ระบุความเสี่ยงเพิ่ม ไม่ใช่การรับรองว่าปลอดภัย", "这些有限输入未识别其他风险；并非安全保证"));
  return { strengths: strengths.slice(0, 4), weaknesses: weaknesses.slice(0, 4), opportunities: opportunities.slice(0, 4), threats: threats.slice(0, 4) };
}
