// ---------------------------------------------------------------------------
// Provincial Land Price Appraisal Data
// ---------------------------------------------------------------------------
// Source: Treasury Department (Ministry of Finance) official land appraisal
// values for the 2023-2026 valuation cycle. Peak commercial zone values
// normalized to Baht per square meter (1 square wah = 4 square meters).
//
// Cheap land acts as an asymmetric investment leverage factor ("Moneyball edge")
// when paired with high developability/composite scores.
// ---------------------------------------------------------------------------

import type { Locale } from "./types.ts";

export interface ProvincialLandPriceEntry {
  /** Appraisal rate in Baht per square meter (฿ / m²) */
  landPriceBaht: number;
  /** Raw data source catalog mapping */
  source: {
    en: string;
    th: string;
    zh: string;
  };
  /** Detail note explaining location/appraisal context */
  note: {
    en: string;
    th: string;
    zh: string;
  };
}

export const PROVINCIAL_LAND_PRICE_SCORE: Record<string, ProvincialLandPriceEntry> = {
  // ─── Bangkok Metro ───
  "Bangkok": {
    landPriceBaht: 250000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department peak commercial appraisal (Silom/Rama IV at ฿1,000,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านพาณิชย์ของกรมธนารักษ์ (สีลม/พระราม 4 ที่ 1,000,000 บาท/ตารางวา)",
      zh: "财政厅最高商业区评估价（席隆/拉玛四路，1,000,000 泰铢/平方哇）",
    },
  },
  "Nonthaburi": {
    landPriceBaht: 42500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department main road peak appraisal (Ngamwongwan/Tiwanon at ฿170,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนสายหลักของกรมธนารักษ์ (งามวงศ์วาน/ติวานนท์ ที่ 170,000 บาท/ตารางวา)",
      zh: "财政厅主要道路最高评估价（昂旺湾/提瓦农，170,000 泰铢/平方哇）",
    },
  },
  "Samut Prakan": {
    landPriceBaht: 35000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Sukhumvit road peak appraisal (฿140,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนสุขุมวิทของกรมธนารักษ์ (140,000 บาท/ตารางวา)",
      zh: "财政厅苏坤蔚路最高评估价（140,000 泰铢/平方哇）",
    },
  },

  // ─── Central Plains ───
  "Nakhon Sawan": {
    landPriceBaht: 12500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Kosi road peak appraisal (฿50,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนโกสีย์ของกรมธนารักษ์ (50,000 บาท/ตารางวา)",
      zh: "财政厅高西路最高评估价（50,000 泰铢/平方哇）",
    },
  },
  "Phichit": {
    landPriceBaht: 5000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department town center appraisal (฿20,000/sq.wah)",
      th: "ราคาประเมินบริเวณใจกลางเมืองของกรมธนารักษ์ (20,000 บาท/ตารางวา)",
      zh: "财政厅市中心评估价（20,000 泰铢/平方哇）",
    },
  },
  "Phitsanulok": {
    landPriceBaht: 15000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department town center commercial peak appraisal (฿60,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านพาณิชย์ใจกลางเมืองของกรมธนารักษ์ (60,000 บาท/ตารางวา)",
      zh: "财政厅市中心商业区最高评估价（60,000 泰铢/平方哇）",
    },
  },
  "Chachoengsao": {
    landPriceBaht: 20000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department town center peak appraisal (฿80,000/sq.wah) / EEC zone rate",
      th: "ราคาประเมินสูงสุดในใจกลางเมืองของกรมธนารักษ์ (80,000 บาท/ตารางวา) / อัตราในเขต EEC",
      zh: "财政厅市中心最高评估价（80,000 泰铢/平方哇）/ 东部经济走廊特区价",
    },
  },

  // ─── Eastern Seaboard ───
  "Chon Buri": {
    landPriceBaht: 37500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Pattaya beachfront peak appraisal (฿150,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบริเวณริมหาดพัทยาของกรมธนารักษ์ (150,000 บาท/ตารางวา)",
      zh: "财政厅芭提雅海滩最高评估价（150,000 泰铢/平方哇）",
    },
  },
  "Rayong": {
    landPriceBaht: 25000,
    source: {
      en: "Treasury Dept appraisal / BOI EEC rate",
      th: "ราคาประเมินกรมธนารักษ์ / อัตรา BOI EEC",
      zh: "财政厅评估价 / BOI 投资区价",
    },
    note: {
      en: "BOI EEC industrial zone average rate / prime city commercial appraisal (฿100,000/sq.wah)",
      th: "ราคาประเมินเฉลี่ยในนิคมอุตสาหกรรม EEC ของ BOI / ย่านพาณิชย์หลักในเมือง (100,000 บาท/ตารางวา)",
      zh: "BOI 东部经济走廊工业区平均价/市区核心商业评估价（100,000 泰铢/平方哇）",
    },
  },
  "Chanthaburi": {
    landPriceBaht: 17500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department gems trading district peak appraisal (฿70,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านค้าพลอยของกรมธนารักษ์ (70,000 บาท/ตารางวา)",
      zh: "财政厅宝石交易区最高评估价（70,000 泰铢/平方哇）",
    },
  },

  // ─── North ───
  "Chiang Mai": {
    landPriceBaht: 62500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department town center commercial peak appraisal (Tha Phae road at ฿250,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านพาณิชย์ใจกลางเมืองของกรมธนารักษ์ (ถนนท่าแพ ที่ 250,000 บาท/ตารางวา)",
      zh: "财政厅市中心商业区最高评估价（塔佩路，250,000 泰铢/平方哇）",
    },
  },
  "Chiang Rai": {
    landPriceBaht: 15000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department town center commercial peak appraisal (฿60,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านพาณิชย์ใจกลางเมืองของกรมธนารักษ์ (60,000 บาท/ตารางวา)",
      zh: "财政厅市中心商业区最高评估价（60,000 泰铢/平方哇）",
    },
  },
  "Lampang": {
    landPriceBaht: 10000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Boonyawat road peak appraisal (฿40,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนบุญวาทย์ของกรมธนารักษ์ (40,000 บาท/ตารางวา)",
      zh: "财政厅布亚瓦路最高评估价（40,000 泰铢/平方哇）",
    },
  },
  "Nan": {
    landPriceBaht: 8750,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Sumondhararaj road peak appraisal (฿35,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนสุมนเทวราชของกรมธนารักษ์ (35,000 บาท/ตารางวา)",
      zh: "财政厅苏蒙塔拉拉路最高评估价（35,000 泰铢/平方哇）",
    },
  },
  "Tak": {
    landPriceBaht: 7500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Mae Sot border zone commercial appraisal (฿30,000/sq.wah)",
      th: "ราคาประเมินเพื่อการพาณิชย์ในเขตชายแดนแม่สอดของกรมธนารักษ์ (30,000 บาท/ตารางวา)",
      zh: "财政厅美索边境区商业评估价（30,000 泰铢/平方哇）",
    },
  },

  // ─── Northeast ───
  "Khon Kaen": {
    landPriceBaht: 20000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Srichan road commercial peak appraisal (฿80,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนศรีจันทร์ของกรมธนารักษ์ (80,000 บาท/ตารางวา)",
      zh: "财政厅室利赞路商业区最高评估价（80,000 泰铢/平方哇）",
    },
  },
  "Nakhon Ratchasima": {
    landPriceBaht: 18750,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Chomphon road commercial peak appraisal (฿75,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนจอมพลของกรมธนารักษ์ (75,000 บาท/ตารางวา)",
      zh: "财政厅宗朋路商业区最高评估价（75,000 泰铢/平方哇）",
    },
  },
  "Ubon Ratchathani": {
    landPriceBaht: 12500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Chayangkun road peak appraisal (฿50,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนชยางกูรของกรมธนารักษ์ (50,000 บาท/ตารางวา)",
      zh: "财政厅差扬坤路最高评估价（50,000 泰铢/平方哇）",
    },
  },

  // ─── South ───
  "Phuket": {
    landPriceBaht: 50000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department beachfront/town center peak appraisal (฿200,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านริมหาดและใจกลางเมืองของกรมธนารักษ์ (200,000 บาท/ตารางวา)",
      zh: "财政厅海滩及市中心最高评估价（200,000 泰铢/平方哇）",
    },
  },
  "Krabi": {
    landPriceBaht: 22500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department beachfront peak appraisal (Ao Nang road at ฿90,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบริเวณริมหาดของกรมธนารักษ์ (ถนนอ่าวนาง ที่ 90,000 บาท/ตารางวา)",
      zh: "财政厅海滩地区最高评估价（奥南海滩路，90,000 泰铢/平方哇）",
    },
  },
  "Phang Nga": {
    landPriceBaht: 15000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Phetkasem road peak appraisal (฿60,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนเพชรเกษมของกรมธนารักษ์ (60,000 บาท/ตารางวา)",
      zh: "财政厅碧甲盛路最高评估价（60,000 泰铢/平方哇）",
    },
  },
  "Trang": {
    landPriceBaht: 12500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department town center commercial peak appraisal (฿50,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในย่านพาณิชย์ใจกลางเมืองของกรมธนารักษ์ (50,000 บาท/ตารางวา)",
      zh: "财政厅市中心商业区最高评估价（50,000 泰铢/平方哇）",
    },
  },
  "Satun": {
    landPriceBaht: 7500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Satun Thanee road peak appraisal (฿30,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนสตูลธานีของกรมธนารักษ์ (30,000 บาท/ตารางวา)",
      zh: "财政厅沙敦塔尼路最高评估价（30,000 泰铢/平方哇）",
    },
  },
  "Surat Thani": {
    landPriceBaht: 30000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Koh Samui beachfront peak appraisal (฿120,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบริเวณริมหาดเกาะสมุยของกรมธนารักษ์ (120,000 บาท/ตารางวา)",
      zh: "财政厅苏梅岛海滩最高评估价（120,000 泰铢/平方哇）",
    },
  },
  "Songkhla": {
    landPriceBaht: 37500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Hat Yai center commercial peak appraisal (Nipat Uthit road at ฿150,000/sq.wah)",
      th: "ราคาประเมินสูงสุดในใจกลางเมืองหาดใหญ่ของกรมธนารักษ์ (ถนนนิพัทธ์อุทิศ ที่ 150,000 บาท/ตารางวา)",
      zh: "财政厅合艾市中心商业区最高评估价（尼帕乌迪路，150,000 泰铢/平方哇）",
    },
  },
  "Nakhon Si Thammarat": {
    landPriceBaht: 10000,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Ratchadamnoen road peak appraisal (฿40,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนราชดำเนินของกรมธนารักษ์ (40,000 บาท/ตารางวา)",
      zh: "财政厅拉差达蒙路最高评估价（40,000 泰铢/平方哇）",
    },
  },

  // ─── Deep South ───
  "Pattani": {
    landPriceBaht: 7500,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Pipit road peak appraisal (฿30,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนพิพิธของกรมธนารักษ์ (30,000 บาท/ตารางวา)",
      zh: "财政厅皮皮路最高评估价（30,000 泰铢/平方哇）",
    },
  },
  "Yala": {
    landPriceBaht: 8750,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Pipitpakdee road peak appraisal (฿35,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนพิพิธภักดีของกรมธนารักษ์ (35,000 บาท/ตารางวา)",
      zh: "财政厅皮皮管迪路最高评估价（35,000 泰铢/平方哇）",
    },
  },
  "Narathiwat": {
    landPriceBaht: 6250,
    source: {
      en: "Treasury Dept appraisal 2023-2026",
      th: "ราคาประเมินกรมธนารักษ์ 2566-2569",
      zh: "财政厅评估价 2023-2026",
    },
    note: {
      en: "Treasury Department Phuphaphakdee road peak appraisal (฿25,000/sq.wah)",
      th: "ราคาประเมินสูงสุดบนถนนภูผาภักดีของกรมธนารักษ์ (25,000 บาท/ตารางวา)",
      zh: "财政厅普帕帕迪路最高评估价（25,000 泰铢/平方哇）",
    },
  },
};

/**
 * Returns the land appraisal rate (Baht / m²) for a Thai province.
 * Falls back to null if no official records are available for the province.
 */
export function getLandPrice(province: string): number | null {
  return PROVINCIAL_LAND_PRICE_SCORE[province]?.landPriceBaht ?? null;
}

/**
 * Returns the land appraisal data source, or null when the province has no
 * official record — never imply a source for data that does not exist.
 */
export function getLandPriceSource(province: string): string | null {
  return PROVINCIAL_LAND_PRICE_SCORE[province]?.source.en ?? null;
}

/**
 * Returns the localized detail note explaining the appraisal context.
 */
export function getLandPriceNote(province: string, locale: Locale): string {
  const entry = PROVINCIAL_LAND_PRICE_SCORE[province];
  if (!entry) return "No Treasury Department appraisal record found for this province";
  return locale === "zh" ? entry.note.zh : locale === "th" ? entry.note.th : entry.note.en;
}
