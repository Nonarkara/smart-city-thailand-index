// ---------------------------------------------------------------------------
// Moneyball Picks — editorial, not algorithmic
// ---------------------------------------------------------------------------
// Hand-selected. The Michelin-guide layer over the directory.
// Each pick frames one city against the Big Three (Bangkok / Phuket / Chiang Mai)
// with two concrete, comparable chips. Benchmarks anchor every claim (verified
// against src/cityData.ts, July 2026 — the Bangkok anchor is "samyan", which
// carries Bangkok-province metrics):
//   Bangkok (samyan): GPP/cap ฿628k, PM2.5 32.4 µg/m³, crime 285/100k, beds 42/10k
//   Phuket:  composite 72.6, hospitality 88
//   Chiang Mai (old town): composite 67.0, PM2.5 46.1 annual (burn season)
//   Big-3 averages: GPP/cap ฿429k, PM2.5 32.2, crime 208/100k, beds 33/10k
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp";

export interface MoneyballChip {
  label: LocalizedText;
  value: string;          // plain string — already formatted
  anchor: LocalizedText;  // comparison anchor, e.g. "half of Bangkok"
}

export interface MoneyballPick {
  cityId: string;
  kicker: LocalizedText;  // the frame: "Undervalued gamma", "Climate outperformer"...
  why: LocalizedText;     // one editorial sentence
  chips: [MoneyballChip, MoneyballChip];
}

export const MONEYBALL_PICKS: MoneyballPick[] = [
  {
    cityId: "nakhon-si-thammarat",
    kicker: {
      en: "Climate outperformer",
      th: "โดดเด่นด้านภูมิอากาศ",
      zh: "气候佼佼者",
    },
    why: {
      en: "Ancient southern capital with working flood telemetry and air that shames Bangkok — the kind of second-tier city you move to, not past.",
      th: "เมืองหลวงโบราณภาคใต้ ระบบเตือนน้ำท่วมใช้ได้จริง อากาศดีกว่ากรุงเทพเกินครึ่ง เป็นเมืองรองที่ควรย้ายไปอยู่ ไม่ใช่ผ่านเลย",
      zh: "南部古都，防洪遥测系统真实运行，空气质量让曼谷汗颜——是那种你会搬去而非路过的二线城市。",
    },
    chips: [
      {
        label: { en: "PM₂.₅", th: "PM₂.₅", zh: "PM₂.₅" },
        value: "15.8 µg/m³",
        anchor: {
          en: "half of Bangkok's 32",
          th: "ครึ่งหนึ่งของกรุงเทพ (32)",
          zh: "曼谷 32 的一半",
        },
      },
      {
        label: { en: "Hospitality", th: "อัธยาศัย", zh: "人文" },
        value: "74",
        anchor: {
          en: "top-quartile, β tier",
          th: "25% แรก ระดับเบตา",
          zh: "前四分之一，β 层",
        },
      },
    ],
  },
  {
    cityId: "yala",
    kicker: {
      en: "Cleanest-air play",
      th: "เดิมพันอากาศสะอาดที่สุด",
      zh: "最清新空气押注",
    },
    why: {
      en: "Deep-south city that wins Thailand's cleanest-city award year after year. The security narrative obscures a genuinely green, walkable core.",
      th: "เมืองชายแดนใต้ที่คว้ารางวัลเมืองสะอาดที่สุดของประเทศติดต่อกันหลายปี เรื่องความมั่นคงบังภาพแก่นเมืองที่เขียวและเดินได้จริง",
      zh: "深南部城市，年年摘得泰国最洁净城市奖。安全叙事遮蔽了这里真正绿意盎然、步行友好的核心。",
    },
    chips: [
      {
        label: { en: "PM₂.₅", th: "PM₂.₅", zh: "PM₂.₅" },
        value: "14.2 µg/m³",
        anchor: {
          en: "among the five cleanest in the index",
          th: "หนึ่งในห้าเมืองอากาศสะอาดสุดของดัชนี",
          zh: "位列本指数空气最洁净前五",
        },
      },
      {
        label: { en: "Green cover", th: "พื้นที่สีเขียว", zh: "绿地覆盖" },
        value: "58%",
        anchor: {
          en: "vs index median 45%",
          th: "เทียบมัธยฐานดัชนี 45%",
          zh: "对比指数中位数 45%",
        },
      },
    ],
  },
  {
    cityId: "khon-kaen",
    kicker: {
      en: "Momentum play",
      th: "เดิมพันโมเมนตัม",
      zh: "势能之选",
    },
    why: {
      en: "Isan's economic capital has a BRT running, an LRT under construction, and a university–industry corridor that actually ships. The Big Three without the price tag.",
      th: "เมืองหลวงเศรษฐกิจอีสาน มี BRT วิ่งแล้ว LRT กำลังสร้าง ระเบียงมหาวิทยาลัย–อุตสาหกรรมส่งมอบงานจริง คุณภาพสามใหญ่แต่ราคาไม่ใหญ่",
      zh: "东北部经济之都：BRT 已通车、LRT 在建，产学走廊真出成果。无需付出「三大城市」的代价即可获得同等品质。",
    },
    chips: [
      {
        label: { en: "GPP growth", th: "GPP เติบโต", zh: "GPP 增速" },
        value: "+3.5% YoY",
        anchor: {
          en: "~70% faster than Bangkok",
          th: "เร็วกว่ากรุงเทพราว 70%",
          zh: "比曼谷快约 70%",
        },
      },
      {
        label: { en: "FDI inflow", th: "FDI เข้า", zh: "外资流入" },
        value: "฿2.8B",
        anchor: {
          en: "tied-4th outside Bangkok & EEC",
          th: "ร่วมอันดับ 4 นอกกรุงเทพและ EEC",
          zh: "曼谷与 EEC 以外并列第四",
        },
      },
    ],
  },
  {
    cityId: "nan",
    kicker: {
      en: "Undervalued beta",
      th: "เบต้าที่ถูกประเมินต่ำ",
      zh: "被低估的 β 城",
    },
    why: {
      en: "A quiet northern town holding the index's highest forest cover and a hospitality score in the top five — the composite score hides what the metrics actually say.",
      th: "เมืองเหนือเงียบๆ ที่มีพื้นที่ป่าสูงสุดในดัชนีและคะแนนอัธยาศัยติดห้าอันดับแรก คะแนนรวมบังสิ่งที่ตัวเลขบอกเอาไว้",
      zh: "静谧的北部小城，森林覆盖率居本指数之首，人文得分位列前五——综合分掩盖了指标真正的声音。",
    },
    chips: [
      {
        label: { en: "Hospitality", th: "อัธยาศัย", zh: "人文" },
        value: "82",
        anchor: {
          en: "top-five in the index",
          th: "ติดห้าอันดับแรกของดัชนี",
          zh: "位列指数前五",
        },
      },
      {
        label: { en: "Forest cover", th: "พื้นที่ป่า", zh: "森林覆盖" },
        value: "75%",
        anchor: {
          en: "highest in this index",
          th: "สูงสุดในดัชนีนี้",
          zh: "本指数之最",
        },
      },
    ],
  },
  {
    cityId: "rayong",
    kicker: {
      en: "Wealth per head",
      th: "ความมั่งคั่งต่อหัว",
      zh: "人均财富",
    },
    why: {
      en: "EEC anchor city where GPP per capita runs ~60% above Bangkok's. Not a lifestyle pick — an investor's pick. Environmental monitoring is genuine, not ornamental.",
      th: "เมืองหลักใน EEC ที่ GPP ต่อหัวสูงกว่ากรุงเทพราว 60% ไม่ใช่เดิมพันไลฟ์สไตล์ แต่เป็นเดิมพันนักลงทุน การเฝ้าระวังสิ่งแวดล้อมเป็นจริง ไม่ประดับ",
      zh: "EEC 锚点城市，人均 GPP 比曼谷高约 60%。非生活方式之选，是投资人之选。环境监测真实运作，绝非装饰。",
    },
    chips: [
      {
        label: { en: "GPP / capita", th: "GPP ต่อหัว", zh: "人均 GPP" },
        value: "฿1.02M",
        anchor: {
          en: "1.6× Bangkok",
          th: "1.6 เท่าของกรุงเทพ",
          zh: "曼谷的 1.6 倍",
        },
      },
      {
        label: { en: "FDI inflow", th: "FDI เข้า", zh: "外资流入" },
        value: "฿5.8B",
        anchor: {
          en: "top-10 FDI inflow in the index",
          th: "FDI ติดสิบอันดับแรกของดัชนี",
          zh: "外资流入位列指数前十",
        },
      },
    ],
  },
  {
    cityId: "phitsanulok-muni",
    kicker: {
      en: "Governance dividend",
      th: "เงินปันผลการบริหาร",
      zh: "治理红利",
    },
    why: {
      en: "An unshowy lower-north municipality where the digital citizen platform crossed 80% adoption and the flood-management stack actually runs. Delivery over pitch deck.",
      th: "เทศบาลภาคเหนือตอนล่างที่ไม่โอ้อวด แพลตฟอร์มพลเมืองดิจิทัลเกิน 80% และระบบจัดการน้ำท่วมทำงานจริง ส่งมอบจริง ไม่ใช่เดคพิทช์",
      zh: "低调的下北部市政——市民数字平台使用率突破 80%，防洪系统真实运行。交付胜过路演。",
    },
    chips: [
      {
        label: { en: "Civic adoption", th: "การใช้งานพลเมือง", zh: "市民采用率" },
        value: "80%+",
        anchor: {
          en: "rare at any tier",
          th: "หายากทุกระดับ",
          zh: "任何层级皆罕见",
        },
      },
      {
        label: { en: "Street-light savings", th: "ประหยัดไฟถนน", zh: "路灯节能" },
        value: "−35%",
        anchor: {
          en: "measured, not modelled",
          th: "วัดจริง ไม่ใช่จำลอง",
          zh: "实测而非建模",
        },
      },
    ],
  },
  {
    cityId: "korat",
    kicker: {
      en: "Logistics hub waiting",
      th: "ศูนย์โลจิสติกส์รอเวลา",
      zh: "物流枢纽待启",
    },
    why: {
      en: "Gateway to Isan, on the Bangkok–Nong Khai high-speed rail path. Improving air, rising GPP, manufacturing-heavy base. A five-year bet, not a one-year one.",
      th: "ประตูสู่อีสาน อยู่บนเส้นทางรถไฟความเร็วสูงกรุงเทพ–หนองคาย อากาศดีขึ้น GPP โต ฐานการผลิตหนัก เดิมพันห้าปี ไม่ใช่หนึ่งปี",
      zh: "通往东北之门，位于曼谷—廊开高铁沿线。空气改善、GPP 上扬、制造业基础厚。五年之注，非一年之博。",
    },
    chips: [
      {
        label: { en: "PM₂.₅ trend", th: "แนวโน้ม PM₂.₅", zh: "PM₂.₅ 趋势" },
        value: "improving",
        anchor: {
          en: "while Chiang Rai worsens",
          th: "ขณะที่เชียงรายแย่ลง",
          zh: "而清莱在恶化",
        },
      },
      {
        label: { en: "Labour force", th: "แรงงาน", zh: "劳动力" },
        value: "1.38M",
        anchor: {
          en: "deepest pool in Isan",
          th: "ลึกที่สุดในอีสาน",
          zh: "东北最深",
        },
      },
    ],
  },
];
