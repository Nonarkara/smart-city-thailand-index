// What the law attaches to this place for an investor: BOI Guide 2026 rules (src/boiGuide.ts) and the EEC Act.
// EEC Act facts come from the Thailand Digital Valley investor research (checked 19 and 24 Oct 2026).
// No category, score or recommendation is derived here; legal geography and the city's recorded sector pick the rows.
import type { Locale, SmartCity } from "./types";
import { isEecProvince } from "./eecGeography";
import { boiFacts, type L3, type Row } from "./boiGuide";

const EEC_ACT: Row = { key: "eec-act", label: { en: "EEC Act", th: "กฎหมาย EEC", zh: "EEC 法" }, text: {
  en: "Corporate income tax exemption of 1 to 15 years from first revenue, set case by case by the EEC Negotiation Committee; reduction of up to 50% for 1 to 10 years where no exemption is granted.",
  th: "ยกเว้นภาษีเงินได้นิติบุคคล 1–15 ปีนับจากวันมีรายได้ครั้งแรก กำหนดเป็นรายกรณีโดยคณะกรรมการเจรจา EEC ลดภาษีสูงสุด 50% นาน 1–10 ปี สำหรับผู้ที่ไม่ได้รับการยกเว้น",
  zh: "企业所得税免征 1 至 15 年，自首笔收入起算，由 EEC 谈判委员会逐案确定；未获免征者可减征最高 50%，为期 1 至 10 年。" } };

const NOTE: Record<ReturnType<typeof boiFacts>["note"], L3> = {
  eec: { en: "Investing here? In the Eastern Economic Corridor, eligible projects may seek BOI or EEC Act incentives; location alone grants neither.", th: "สนใจลงทุนที่นี่? โครงการที่เข้าเงื่อนไขในเขตเศรษฐกิจพิเศษภาคตะวันออกอาจขอสิทธิ BOI หรือกฎหมาย EEC ได้ ที่ตั้งอย่างเดียวไม่ให้สิทธิ", zh: "想在这里投资？东部经济走廊内，合资格项目可申请 BOI 或 EEC 法优惠；仅凭地址不能获得优惠。" },
  low: { en: "Investing here? This is one of the 20 lowest-income provinces, and BOI adds to its tax holiday.", th: "สนใจลงทุนที่นี่? จังหวัดนี้เป็นหนึ่งใน 20 จังหวัดรายได้ต่ำสุด BOI จึงเพิ่มสิทธิภาษีให้", zh: "想在这里投资？本府是收入最低的 20 个府之一，BOI 会增加其免税期。" },
  corridor: { en: "Investing here? This province sits in an Economic Corridor with its own targeted industries.", th: "สนใจลงทุนที่นี่? จังหวัดนี้อยู่ในเขตเศรษฐกิจพิเศษที่มีอุตสาหกรรมเป้าหมายของตัวเอง", zh: "想在这里投资？本府位于经济走廊内，有各自的目标产业。" },
  south: { en: "Investing here? The Southern Border measure has specific eligible areas; check the project district and activity.", th: "สนใจลงทุนที่นี่? มาตรการชายแดนภาคใต้จำกัดพื้นที่ ตรวจอำเภอและกิจกรรมของโครงการก่อน", zh: "想在这里投资？南部边境专项措施有特定适用区域；请先核对项目所在县和活动。" },
  sez: { en: "Investing here? Part of this province is a Border Economic Zone; check the sub-district.", th: "สนใจลงทุนที่นี่? บางส่วนของจังหวัดเป็นเขตเศรษฐกิจพิเศษชายแดน ตรวจสอบตำบลก่อน", zh: "想在这里投资？本府部分地区属边境经济特区，请先核对所在乡。" },
  plain: { en: "Investing here? The tax holiday follows your activity group; the area and industrial estate can add more.", th: "สนใจลงทุนที่นี่? ระยะภาษีขึ้นกับกลุ่มกิจกรรม พื้นที่และนิคมอุตสาหกรรมเพิ่มให้ได้อีก", zh: "想在这里投资？免税期取决于活动组别，所在区域和工业区可再增加。" },
};

const CAVEAT: L3 = {
  en: "Case by case by BOI, EECO and the Revenue Department: published ceilings, not promises. Guide read 4 Nov 2026; EEC sources 19–24 Oct 2026.",
  th: "BOI สำนักงาน EEC และกรมสรรพากรพิจารณาเป็นรายกรณี เป็นเพดานที่ประกาศ ไม่ใช่คำมั่น อ่านคู่มือ 4 พ.ย. 2569 แหล่งอ้างอิง EEC 19–24 ต.ค. 2569",
  zh: "由 BOI、EEC 办公室和税务厅逐案批准：为已公布的上限，非承诺。指南阅于 2026 年 11 月 4 日；EEC 来源 2026 年 10 月 19–24 日。",
};

const SOURCES: { name: string; href: string }[] = [
  { name: "BOI Guide 2026", href: "https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf" },
  { name: "EECO", href: "https://www.eeco.or.th/en/incentives-under-the-eec-act-b-e-2561-2018/" },
  { name: "EEC Act 2018", href: "https://www.eeco.or.th/wp-content/uploads/2025/11/EEC-ACT-2561-English-version.pdf" },
];

export default function InvestmentFit({ city, locale }: { city: SmartCity; locale: Locale }) {
  if (!city.province) return null;
  const { rows: base, note } = boiFacts(city.province, city.metrics.industryComposition);
  const rows = isEecProvince(city.province) ? [base[0], EEC_ACT, ...base.slice(1)] : base;
  return (
    <section className="section investment-fit" lang={locale === "zh" ? "zh-Hans" : locale}>
      <div className="investment-fit-band">
        <img src="/nong-plub/guide/nong-plub-invest.webp" width={179} height={300} alt="" loading="lazy" />
        <p className="investment-fit-note mascot-hand">{NOTE[note][locale]}</p>
      </div>
      <dl className="investment-fit-rows">
        {rows.map(r => (
          <div key={r.key}><dt>{r.label[locale]}</dt><dd>{r.text[locale]}</dd></div>
        ))}
      </dl>
      <p className="investment-fit-caveat">{CAVEAT[locale]} {SOURCES.map((s, i) => <span key={s.name}>{i ? " · " : ""}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a></span>)}</p>
    </section>
  );
}
