import { useState } from "react";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

const PURPOSES = [
  { id: "invest", lens: "growth", label: { en: "Invest", th: "ลงทุน", zh: "投资" },
    evidence: { en: "Compare economy and digital scores, then open the underlying city evidence.", th: "เทียบคะแนนเศรษฐกิจและดิจิทัล แล้วเปิดหลักฐานของแต่ละเมือง", zh: "比较经济与数字评分，再查阅城市的原始证据。" },
    check: { en: "Still verify: land and lease prices, demand, utilities, permits, and BOI eligibility. The score does not forecast returns.", th: "ต้องตรวจเพิ่ม: ราคาที่ดินและค่าเช่า อุปสงค์ สาธารณูปโภค ใบอนุญาต และสิทธิ BOI คะแนนไม่ได้พยากรณ์ผลตอบแทน", zh: "仍需核查：土地及租金、需求、公用设施、许可和 BOI 资格。评分不预测投资回报。" } },
  { id: "live", lens: "affordability", label: { en: "Live", th: "อยู่อาศัย", zh: "居住" },
    evidence: { en: "Compare livability, wellbeing, safety, and environment. Provincial context may differ from your neighbourhood.", th: "เทียบความน่าอยู่ คุณภาพชีวิต ความปลอดภัย และสิ่งแวดล้อม ข้อมูลจังหวัดอาจต่างจากย่านที่จะอยู่", zh: "比较宜居、福祉、安全与环境。省级情况可能与目标社区不同。" },
    check: { en: "Still verify: rent, household bills, commute, local healthcare, and seasonal air quality. Provincial output is not a cost-of-living measure.", th: "ต้องตรวจเพิ่ม: ค่าเช่า ค่าใช้จ่ายครัวเรือน เวลาเดินทาง บริการสุขภาพใกล้บ้าน และอากาศแต่ละฤดู ผลผลิตจังหวัดไม่ใช่ค่าครองชีพ", zh: "仍需核查：租金、家庭开支、通勤、本地医疗和季节性空气质量。省级产出并非生活成本。" } },
  { id: "learn", lens: "learning", label: { en: "Learn", th: "เรียน", zh: "学习" },
    evidence: { en: "Compare the surroundings: digital access, wellbeing, safety, and daily life. These are city scores, not university rankings.", th: "เทียบสภาพแวดล้อม: ดิจิทัล คุณภาพชีวิต ความปลอดภัย และการใช้ชีวิต นี่คือคะแนนเมือง ไม่ใช่อันดับมหาวิทยาลัย", zh: "比较学习环境：数字条件、福祉、安全和日常生活。这是城市评分，并非大学排名。" },
    check: { en: "Still verify: course accreditation, admissions, tuition, language, housing, and access to campus.", th: "ต้องตรวจเพิ่ม: การรับรองหลักสูตร เกณฑ์รับเข้า ค่าเล่าเรียน ภาษา ที่พัก และการเดินทางไปสถานศึกษา", zh: "仍需核查：课程认证、录取条件、学费、授课语言、住宿和到校交通。" } },
  { id: "work", lens: "startup", label: { en: "Work", th: "ทำงาน", zh: "工作" },
    evidence: { en: "Compare economy and digital conditions alongside daily life. Scores do not establish job availability or business readiness.", th: "เทียบเศรษฐกิจและดิจิทัลควบคู่กับการใช้ชีวิต คะแนนไม่ยืนยันว่ามีงานว่างหรือธุรกิจพร้อมดำเนินการ", zh: "结合日常生活比较经济与数字条件。评分不证明存在职位空缺或企业已经具备运营条件。" },
    check: { en: "Still verify: current vacancies, actual wages, work permits, reliable connectivity, and your commute.", th: "ต้องตรวจเพิ่ม: ตำแหน่งงานปัจจุบัน ค่าจ้างจริง ใบอนุญาตทำงาน ความเสถียรของอินเทอร์เน็ต และเวลาเดินทาง", zh: "仍需核查：当前职位、实际工资、工作许可、网络可靠性和通勤。" } },
  { id: "play", lens: "visiting", label: { en: "Play", th: "เที่ยว", zh: "休闲" },
    evidence: { en: "Compare hospitality, safety, environment, and livability, then explore the city’s credited cultural images.", th: "เทียบการต้อนรับ ความปลอดภัย สิ่งแวดล้อม และความน่าอยู่ แล้วดูภาพวัฒนธรรมพร้อมที่มาของเมือง", zh: "比较旅游接待、安全、环境与宜居条件，再浏览注明出处的城市文化影像。" },
    check: { en: "Still verify: opening hours, access, fares, weather, seasonal risks, and current local conditions.", th: "ต้องตรวจเพิ่ม: เวลาเปิด การเข้าถึง ค่าเดินทาง สภาพอากาศ ความเสี่ยงตามฤดู และสถานการณ์ในพื้นที่", zh: "仍需核查：开放时间、可达性、交通费用、天气、季节性风险和当地现状。" } },
];

export default function HomeDecisionGuide({ locale, onNavigate }: { locale: Locale; onNavigate: (path: string) => void }) {
  const [purposeId, setPurposeId] = useState("live");
  const purpose = PURPOSES.find(item => item.id === purposeId)!;
  return <div className="home-decision-guide">
    <div className="home-purpose-controls" role="group" aria-label={translate(locale, { en: "Your purpose", th: "เป้าหมายของคุณ", zh: "您的目的" })}>
      {PURPOSES.map(item => <button key={item.id} type="button" aria-pressed={purposeId === item.id} onClick={() => setPurposeId(item.id)}>{translate(locale, item.label)}</button>)}
    </div>
    <div className="home-purpose-evidence" aria-live="polite">
      <p>{translate(locale, purpose.evidence)}</p>
      <p className="home-purpose-check">{translate(locale, purpose.check)}</p>
      <button type="button" className="text-button" onClick={() => onNavigate(`/rankings?lens=${purpose.lens}`)}>{translate(locale, { en: "Compare cities with these priorities →", th: "เทียบเมืองตามเป้าหมายนี้ →", zh: "按这些优先事项比较城市 →" })}</button>
    </div>
  </div>;
}
