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
      en: "Investigate rail plans",
      th: "ศึกษาแผนระบบราง",
      zh: "研究轨道交通规划",
    },
    body: {
      en: "Check proposals, funding, construction and operating status in each dossier. Inclusion does not establish a working rail service.",
      th: "ตรวจสอบข้อเสนอ งบประมาณ การก่อสร้าง และสถานะบริการในแต่ละแฟ้ม การอยู่ในรายชื่อไม่ยืนยันว่าระบบรางเปิดใช้งานแล้ว",
      zh: "在各城市档案中核查提案、拨款、建设和运营状态。入选不代表轨道交通已运营。",
    },
    cityIds: ["khon-kaen", "phuket", "korat", "chiang-mai-old-town", "rattanakosin"],
  },
  {
    id: "clean-air",
    kicker: { en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" },
    headline: {
      en: "Places to investigate air quality",
      th: "เมืองสำหรับศึกษาคุณภาพอากาศ",
      zh: "值得研究空气质量的城市",
    },
    body: {
      en: "Check station coverage, dates and seasonal PM₂.₅ in each dossier. This shortlist does not certify clean air.",
      th: "ตรวจสอบสถานีตรวจวัด ช่วงเวลา และ PM₂.₅ ตามฤดูกาลในแฟ้มแต่ละเมือง รายชื่อนี้ไม่ใช่การรับรองอากาศสะอาด",
      zh: "请在各城市档案中核查监测站覆盖、日期和季节性 PM₂.₅。本选单并非空气洁净认证。",
    },
    cityIds: ["yala", "nakhon-si-thammarat", "satun", "ubon", "narathiwat"],
  },
  {
    id: "money-moving",
    kicker: { en: "Economy", th: "เศรษฐกิจ", zh: "经济" },
    headline: {
      en: "Economic profiles to investigate",
      th: "เมืองสำหรับศึกษาเศรษฐกิจ",
      zh: "值得研究的经济概况",
    },
    body: {
      en: "Compare local demand and costs. Inclusion does not establish investment inflows, growth or returns.",
      th: "เปรียบเทียบอุปสงค์และต้นทุนในพื้นที่ การอยู่ในรายชื่อไม่ยืนยันเงินลงทุนไหลเข้า การเติบโต หรือผลตอบแทน",
      zh: "比较当地需求和成本。入选不代表投资流入、增长或回报。",
    },
    cityIds: ["rayong", "samyan", "saensuk", "chachoengsao"],
  },
];
