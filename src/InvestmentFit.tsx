// What the law attaches to this place for an investor: the EEC legal area and BOI incentives.
// Facts and sources come from the Thailand Digital Valley investor research (checked 19 and 24 Oct 2026).
// No category, score or recommendation is derived here; only legal geography decides which rows show.
import type { Locale, SmartCity } from "./types";
import { isEecProvince } from "./eecGeography";

type L3 = Record<Locale, string>;
interface Row { label: L3; text: L3 }

const BOI: L3 = { en: "BOI", th: "BOI", zh: "BOI" };

const EEC_ROWS: Row[] = [
  { label: { en: "EEC Act", th: "กฎหมาย EEC", zh: "EEC 法" }, text: {
    en: "Corporate income tax exemption of 1 to 15 years from first revenue, set case by case by the EEC Negotiation Committee; 50% reduction for 1 to 10 years where no exemption is granted.",
    th: "ยกเว้นภาษีเงินได้นิติบุคคล 1–15 ปีนับจากวันมีรายได้ครั้งแรก กำหนดเป็นรายกรณีโดยคณะกรรมการเจรจา EEC ลดภาษี 50% นาน 1–10 ปี สำหรับผู้ที่ไม่ได้รับการยกเว้น",
    zh: "企业所得税免征 1 至 15 年，自首笔收入起算，由 EEC 谈判委员会逐案确定；未获免征者可减征 50%，为期 1 至 10 年。" } },
  { label: { en: "Staff", th: "บุคลากร", zh: "人员" }, text: {
    en: "Eligible foreign specialists and executives of approved operators work under an EEC Work Permit; fees and procedure need confirming with EECO.",
    th: "ผู้เชี่ยวชาญและผู้บริหารต่างชาติของผู้ประกอบการที่ได้รับอนุมัติ ซึ่งมีคุณสมบัติตามเกณฑ์ ทำงานภายใต้ใบอนุญาตทำงาน EEC ค่าธรรมเนียมและขั้นตอนต้องยืนยันกับ EECO",
    zh: "获批运营商的合资格外籍专家和高管持 EEC 工作许可证工作；费用和程序需向 EECO 确认。" } },
  { label: { en: "Data centres", th: "ศูนย์ข้อมูล", zh: "数据中心" }, text: {
    en: "BOI base exemption of 5 years at PUE ≤ 1.3 and 3 years above it (8 and 5 years outside the EEC).",
    th: "BOI ยกเว้นภาษีพื้นฐาน 5 ปี เมื่อ PUE ≤ 1.3 และ 3 ปี เมื่อสูงกว่า (นอกเขต EEC คือ 8 และ 5 ปี)",
    zh: "BOI 基础免税期：PUE ≤ 1.3 为 5 年，高于则为 3 年（EEC 之外分别为 8 年和 5 年）。" } },
];

const OTHER_ROWS: Row[] = [
  { label: BOI, text: {
    en: "Corporate income tax exemption or reduction, machinery import duty exemption, and up to 100% foreign ownership outside restricted activities.",
    th: "ยกเว้นหรือลดภาษีเงินได้นิติบุคคล ยกเว้นอากรนำเข้าเครื่องจักร และถือหุ้นต่างชาติได้สูงสุด 100% ยกเว้นกิจการที่จำกัด",
    zh: "企业所得税免征或减征、机器进口关税免征，以及除受限活动外最高 100% 外资持股。" } },
  { label: { en: "EEC Act", th: "กฎหมาย EEC", zh: "EEC 法" }, text: {
    en: "Does not apply here: its legal extent is Chachoengsao, Chon Buri and Rayong only (2018 Act, section 6).",
    th: "ไม่ใช้ที่นี่ ขอบเขตกฎหมายครอบคลุมเฉพาะฉะเชิงเทรา ชลบุรี และระยอง (พ.ร.บ. 2561 มาตรา 6)",
    zh: "此处不适用：其法定范围仅限北柳府、春武里府和罗勇府（2018 年法案第 6 条）。" } },
  { label: { en: "Data centres", th: "ศูนย์ข้อมูล", zh: "数据中心" }, text: {
    en: "BOI base exemption of 8 years at PUE ≤ 1.3 and 5 years above it, longer than the 5 and 3 years inside the EEC.",
    th: "BOI ยกเว้นภาษีพื้นฐาน 8 ปี เมื่อ PUE ≤ 1.3 และ 5 ปี เมื่อสูงกว่า ยาวกว่าในเขต EEC ซึ่งเป็น 5 และ 3 ปี",
    zh: "BOI 基础免税期：PUE ≤ 1.3 为 8 年，高于则为 5 年，长于 EEC 内的 5 年和 3 年。" } },
];

const NOTE: Record<"eec" | "other", L3> = {
  eec: {
    en: "Investing here? This province sits inside the Eastern Economic Corridor, so two incentive routes can apply.",
    th: "สนใจลงทุนที่นี่? จังหวัดนี้อยู่ในเขตเศรษฐกิจพิเศษภาคตะวันออก จึงมีสิทธิประโยชน์ได้สองทาง",
    zh: "想在这里投资？本府位于东部经济走廊（EEC）内，可能适用两条激励路径。",
  },
  other: {
    en: "Investing here? BOI incentives follow your approved activity, not the province.",
    th: "สนใจลงทุนที่นี่? สิทธิประโยชน์ BOI ผูกกับกิจกรรมที่ได้รับอนุมัติ ไม่ใช่จังหวัด",
    zh: "想在这里投资？BOI 优惠取决于获批的活动，而非所在府。",
  },
};

const CAVEAT: L3 = {
  en: "Granted case by case by BOI, EECO and the Revenue Department. Figures are ceilings or published rules, not promises; benefits attach to the company and its approved activity. Sources checked 19–24 October 2026.",
  th: "BOI สำนักงาน EEC และกรมสรรพากรพิจารณาเป็นรายกรณี ตัวเลขเป็นเพดานหรือกฎที่ประกาศ ไม่ใช่คำมั่น สิทธิผูกกับบริษัทและกิจกรรมที่ได้รับอนุมัติ ตรวจแหล่งอ้างอิงเมื่อ 19–24 ต.ค. 2569",
  zh: "由 BOI、EEC 办公室和税务厅逐案批准。数字为上限或已公布规则，并非承诺；优惠归属于公司及其获批活动。来源核查于 2026 年 10 月 19–24 日。",
};

const SOURCES: { name: string; href: string }[] = [
  { name: "EECO", href: "https://www.eeco.or.th/en/incentives-under-the-eec-act-b-e-2561-2018/" },
  { name: "BOI 4 Aug 2026", href: "https://www.boi.go.th/upload/content/20260804%20BOI%20EN.pdf" },
  { name: "EEC Act 2018", href: "https://www.eeco.or.th/wp-content/uploads/2025/11/EEC-ACT-2561-English-version.pdf" },
];

export default function InvestmentFit({ city, locale }: { city: SmartCity; locale: Locale }) {
  if (!city.province) return null;
  const eec = isEecProvince(city.province);
  const rows = eec ? EEC_ROWS : OTHER_ROWS;
  return (
    <section className="section investment-fit" lang={locale === "zh" ? "zh-Hans" : locale}>
      <p className="investment-fit-note mascot-hand">{NOTE[eec ? "eec" : "other"][locale]}</p>
      <dl className="investment-fit-rows">
        {rows.map(r => (
          <div key={r.label.en}><dt>{r.label[locale]}</dt><dd>{r.text[locale]}</dd></div>
        ))}
      </dl>
      <p className="investment-fit-caveat">{CAVEAT[locale]} {SOURCES.map((s, i) => <span key={s.name}>{i ? " · " : ""}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a></span>)}</p>
    </section>
  );
}
