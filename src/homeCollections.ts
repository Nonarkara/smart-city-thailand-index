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
      en: "Editorial starting points for investigating rail proposals and access. Inclusion does not establish funding, construction or an operating service. Scores are the curated overall index (/100), not rail performance.",
      th: "รายชื่อคัดสรรสำหรับศึกษาแผนระบบรางและการเข้าถึง การอยู่ในรายชื่อไม่ยืนยันงบประมาณ การก่อสร้าง หรือการเปิดบริการ คะแนนเป็นดัชนีรวมจากการประเมิน (เต็ม 100) ไม่ใช่ผลงานระบบราง",
      zh: "供研究轨道交通规划与可达性的编辑选单。入选不代表已获拨款、开工或运营。所列为编辑评估的综合指数（满分100），并非轨道交通绩效。",
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
      en: "An editorial shortlist, not a clean-air certification. Check station coverage, dates and seasonal PM₂.₅ in each dossier. Scores are the curated overall index (/100), not air-quality readings.",
      th: "รายชื่อคัดสรร ไม่ใช่การรับรองอากาศสะอาด ตรวจสอบสถานีตรวจวัด ช่วงเวลา และ PM₂.₅ ตามฤดูกาลในแฟ้มแต่ละเมือง คะแนนเป็นดัชนีรวมจากการประเมิน (เต็ม 100) ไม่ใช่ค่าคุณภาพอากาศ",
      zh: "编辑选单，并非空气洁净认证。请在各城市档案中核查监测站覆盖、日期和季节性 PM₂.₅。所列为编辑评估的综合指数（满分100），并非空气质量读数。",
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
      en: "An editorial selection for comparing local economies. Inclusion does not establish investment inflows, growth or returns. Scores are the curated overall index (/100); verify demand and costs separately.",
      th: "รายชื่อคัดสรรสำหรับเปรียบเทียบเศรษฐกิจท้องถิ่น ไม่ยืนยันเงินลงทุนไหลเข้า การเติบโต หรือผลตอบแทน คะแนนเป็นดัชนีรวมจากการประเมิน (เต็ม 100) ต้องตรวจสอบอุปสงค์และต้นทุนแยกต่างหาก",
      zh: "供比较地方经济的编辑选单。入选不代表投资流入、增长或回报。所列为编辑评估的综合指数（满分100）；需求和成本须另行核实。",
    },
    cityIds: ["rayong", "samyan", "saensuk", "chachoengsao"],
  },
];
