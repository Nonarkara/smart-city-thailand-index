// ---------------------------------------------------------------------------
// Moneyball Picks — editorial, not algorithmic
// ---------------------------------------------------------------------------
// Hand-selected. The Michelin-guide layer over the directory.
// Each pick frames one city against the Big Three (Bangkok / Phuket / Chiang Mai)
// with two concrete, comparable chips. Benchmarks anchor every claim:
//   Bangkok: GPP/cap ฿429k, PM2.5 32.2 µg/m³, crime 208/100k, beds 33/10k
//   Phuket:  composite 74, hospitality 88
//   Chiang Mai: PM2.5 historically 40+ during burn season
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
          en: "lowest among 49 cities",
          th: "ต่ำสุดใน 49 เมือง",
          zh: "49 城中最低",
        },
      },
      {
        label: { en: "Green cover", th: "พื้นที่สีเขียว", zh: "绿地覆盖" },
        value: "58%",
        anchor: {
          en: "vs national median ~42%",
          th: "เทียบค่ากลาง 42%",
          zh: "对比全国中位数约 42%",
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
          en: "double Bangkok's pace",
          th: "เร็วกว่ากรุงเทพสองเท่า",
          zh: "曼谷增速的两倍",
        },
      },
      {
        label: { en: "FDI inflow", th: "FDI เข้า", zh: "外资流入" },
        value: "฿2.8B",
        anchor: {
          en: "largest outside EEC",
          th: "สูงสุดนอก EEC",
          zh: "EEC 以外最高",
        },
      },
    ],
  },
  {
    cityId: "nan",
    kicker: {
      en: "Undervalued gamma",
      th: "แกมมาที่ถูกประเมินต่ำ",
      zh: "被低估的 γ 城",
    },
    why: {
      en: "A quiet northern town where safety, forest cover, and community warmth all read in the top decile — the composite score hides what the metrics actually say.",
      th: "เมืองเหนือเงียบๆ ที่ความปลอดภัย พื้นที่ป่า และความอบอุ่นของชุมชนอยู่ใน 10% แรกทั้งหมด คะแนนรวมบังสิ่งที่ตัวเลขบอกเอาไว้",
      zh: "静谧的北部小城，安全、森林覆盖与社区温情三项皆入前一成——综合分掩盖了指标真正的声音。",
    },
    chips: [
      {
        label: { en: "Safety", th: "ความปลอดภัย", zh: "安全" },
        value: "78",
        anchor: {
          en: "vs Bangkok ~62",
          th: "เทียบกรุงเทพ ~62",
          zh: "对比曼谷约 62",
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
      en: "EEC anchor city where GPP per capita runs more than double Bangkok's. Not a lifestyle pick — an investor's pick. Environmental monitoring is genuine, not ornamental.",
      th: "เมืองหลักใน EEC ที่ GPP ต่อหัวมากกว่ากรุงเทพสองเท่า ไม่ใช่เดิมพันไลฟ์สไตล์ แต่เป็นเดิมพันนักลงทุน การเฝ้าระวังสิ่งแวดล้อมเป็นจริง ไม่ประดับ",
      zh: "EEC 锚点城市，人均 GPP 超过曼谷两倍。非生活方式之选，是投资人之选。环境监测真实运作，绝非装饰。",
    },
    chips: [
      {
        label: { en: "GPP / capita", th: "GPP ต่อหัว", zh: "人均 GPP" },
        value: "฿1.02M",
        anchor: {
          en: "2.4× Bangkok",
          th: "2.4 เท่าของกรุงเทพ",
          zh: "曼谷的 2.4 倍",
        },
      },
      {
        label: { en: "FDI inflow", th: "FDI เข้า", zh: "外资流入" },
        value: "฿5.8B",
        anchor: {
          en: "#1 among certified cities",
          th: "อันดับ 1 ในเมืองรับรอง",
          zh: "认证城市第一",
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
          en: "while Chiang Mai worsens",
          th: "ขณะที่เชียงใหม่แย่ลง",
          zh: "而清迈在恶化",
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
