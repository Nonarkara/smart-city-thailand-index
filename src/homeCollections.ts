// ---------------------------------------------------------------------------
// Home collections — editorial groupings for the front page
// ---------------------------------------------------------------------------
// Each collection is a thesis + 3–5 cities. The homepage renders them as
// small cards so a reader can see the shape of Thai smart cities by theme
// rather than by rank. Ranking and pillar bars live on /rankings — this
// module does a different job: it curates.
//
// Editorial rule: a city should appear in at most one launch collection,
// so the page doesn't feel repetitive when read top to bottom.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp";

export interface HomeCollection {
  id: string;
  kicker: LocalizedText;
  headline: LocalizedText;
  body: LocalizedText;
  cityIds: string[];
}

export const HOME_COLLECTIONS: HomeCollection[] = [
  {
    id: "rail",
    kicker: { en: "Infrastructure", th: "โครงสร้างพื้นฐาน", zh: "基础设施" },
    headline: {
      en: "Cities betting on rail",
      th: "เมืองที่เดิมพันด้วยระบบราง",
      zh: "押注轨道交通的城市",
    },
    body: {
      en: "Smart city spending in Thailand is tilting toward fixed rail — the investment that changes a city for forty years, not four.",
      th: "งบประมาณเมืองอัจฉริยะของไทยกำลังเทไปที่รางถาวร — การลงทุนที่เปลี่ยนเมืองได้ยาวสี่สิบปี ไม่ใช่สี่ปี",
      zh: "泰国智慧城市的支出正向固定轨道倾斜——这类投资能改变一座城市四十年，而非四年。",
    },
    cityIds: ["khon-kaen", "phuket", "korat", "chiang-mai-old-town", "rattanakosin"],
  },
  {
    id: "clean-air",
    kicker: { en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" },
    headline: {
      en: "Where the air is actually clean",
      th: "เมืองที่อากาศสะอาดจริง",
      zh: "真正空气洁净之地",
    },
    body: {
      en: "Most of Thailand lives with PM₂.₅ above WHO interim targets. These cities don't.",
      th: "คนไทยส่วนใหญ่หายใจ PM₂.₅ เกินเกณฑ์ชั่วคราวขององค์การอนามัยโลก ส่วนเมืองกลุ่มนี้อยู่ในเกณฑ์",
      zh: "泰国多数地区的 PM₂.₅ 高于 WHO 暂定目标。这些城市不是。",
    },
    cityIds: ["yala", "nakhon-si-thammarat", "chiang-rai", "ubon", "nan"],
  },
  {
    id: "money-moving",
    kicker: { en: "Economy", th: "เศรษฐกิจ", zh: "经济" },
    headline: {
      en: "Where the money is moving",
      th: "เมืองที่เม็ดเงินไหลเข้า",
      zh: "资金正在流动的地方",
    },
    body: {
      en: "GPP growth, FDI inflow, new industrial estates — cities that outperform the national mean on the money axes.",
      th: "GPP โต การลงทุนต่างประเทศเพิ่ม นิคมอุตสาหกรรมใหม่เปิด — เมืองที่ทำได้ดีกว่าค่าเฉลี่ยประเทศในแกนเศรษฐกิจ",
      zh: "GPP 增长、外资流入、新工业园——在资金维度上跑赢全国平均的城市。",
    },
    cityIds: ["rayong", "samyan", "wangchan-valley", "chachoengsao"],
  },
];
