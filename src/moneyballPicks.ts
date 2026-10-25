// ---------------------------------------------------------------------------
// Moneyball Picks — editorial, not algorithmic
// ---------------------------------------------------------------------------
// Hand-selected. The Michelin-guide layer over the directory.
// Picks are editorial starting points, not investment recommendations.
// Values are read from the current city record rather than repeated constants.
// Historical comparisons and operating claims require dated local evidence;
// they are not inferred from a score, annual air value or provincial GPP.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp";
import type { SmartCity } from "./types";

export interface MoneyballChip {
  label: LocalizedText;
  value: (city: SmartCity) => string; // current record, never a duplicated editorial constant
  anchor: LocalizedText;  // provenance qualification
}

export interface MoneyballPick {
  cityId: string;
  kicker: LocalizedText;  // the subject for further investigation
  why: LocalizedText;     // one editorial sentence
  chips: [MoneyballChip, MoneyballChip];
}

export const MONEYBALL_PICKS: MoneyballPick[] = [
  {
    cityId: "nakhon-si-thammarat",
    kicker: {
      en: "Southern city context",
      th: "บริบทเมืองภาคใต้",
      zh: "南部城市背景",
    },
    why: {
      en: "Compare annual air exposure with seasonal conditions, flood coverage and actual access to services.",
      th: "ควรเทียบอากาศเฉลี่ยรายปีกับสภาพตามฤดูกาล ความครอบคลุมการป้องกันน้ำท่วม และการเข้าถึงบริการจริง",
      zh: "请结合季节状况、防洪覆盖与实际服务可达性比较年均空气暴露。",
    },
    chips: [
      {
        label: { en: "PM₂.₅", th: "PM₂.₅", zh: "PM₂.₅" },
        value: city => formatPickValue(city.metrics.pm25Annual, " µg/m³"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "Hospitality", th: "อัธยาศัย", zh: "人文" },
        value: city => formatPickValue(city.scores.hospitality, " / 100"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
  {
    cityId: "yala",
    kicker: {
      en: "Air & green space",
      th: "อากาศและพื้นที่สีเขียว",
      zh: "空气与绿地",
    },
    why: {
      en: "Annual air and green-cover figures are a starting point. Check neighbourhood conditions and current travel advice separately.",
      th: "ข้อมูลอากาศรายปีและพื้นที่สีเขียวใช้เริ่มศึกษาต่อ ควรตรวจสภาพรายย่านและคำแนะนำการเดินทางปัจจุบันแยกกัน",
      zh: "年均空气与绿地数据可作为起点；请另查街区状况及当前旅行建议。",
    },
    chips: [
      {
        label: { en: "PM₂.₅", th: "PM₂.₅", zh: "PM₂.₅" },
        value: city => formatPickValue(city.metrics.pm25Annual, " µg/m³"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "Green cover", th: "พื้นที่สีเขียว", zh: "绿地覆盖" },
        value: city => formatPickValue(city.metrics.greenCoverage, "%"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
  {
    cityId: "khon-kaen",
    kicker: {
      en: "Regional economy",
      th: "เศรษฐกิจภูมิภาค",
      zh: "区域经济",
    },
    why: {
      en: "Compare provincial economic figures with demand at your site. Verify transport project status, timelines and costs directly.",
      th: "ควรเทียบตัวเลขเศรษฐกิจจังหวัดกับอุปสงค์ ณ พื้นที่จริง และตรวจสถานะโครงการคมนาคม กำหนดเวลา และต้นทุนโดยตรง",
      zh: "请将省级经济数据与项目地点需求比较，并直接核查交通项目进度、时间及成本。",
    },
    chips: [
      {
        label: { en: "GPP growth", th: "GPP เติบโต", zh: "GPP 增速" },
        value: city => formatPickValue(city.metrics.gppGrowthRate, "%"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "FDI inflow", th: "FDI เข้า", zh: "外资流入" },
        value: city => formatPickValue(city.metrics.fdiInflow, " million THB"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
  {
    cityId: "nan",
    kicker: {
      en: "Forest & hospitality",
      th: "ป่าไม้และการต้อนรับ",
      zh: "森林与接待条件",
    },
    why: {
      en: "Province-level forest cover does not describe every neighbourhood. Check seasonal air, access and local services before choosing a site.",
      th: "พื้นที่ป่าระดับจังหวัดไม่ได้บอกสภาพทุกย่าน ควรตรวจอากาศตามฤดูกาล การเดินทาง และบริการในพื้นที่ก่อนเลือกทำเล",
      zh: "省级森林覆盖不代表每个街区；选址前请核查季节性空气、交通及本地服务。",
    },
    chips: [
      {
        label: { en: "Hospitality", th: "อัธยาศัย", zh: "人文" },
        value: city => formatPickValue(city.scores.hospitality, " / 100"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "Forest cover", th: "พื้นที่ป่า", zh: "森林覆盖" },
        value: city => formatPickValue(city.metrics.forestCoverage, "%"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
  {
    cityId: "rayong",
    kicker: {
      en: "Production per person",
      th: "ผลผลิตต่อคน",
      zh: "人均产出",
    },
    why: {
      en: "GPP per person measures production, not household wealth or investment returns. Check local pollution, costs and sector demand.",
      th: "GPP ต่อคนวัดผลผลิต ไม่ใช่ความมั่งคั่งครัวเรือนหรือผลตอบแทนการลงทุน ควรตรวจมลพิษ ต้นทุน และอุปสงค์รายสาขาในพื้นที่",
      zh: "人均GPP衡量产出，不是家庭财富或投资回报；请核查本地污染、成本及行业需求。",
    },
    chips: [
      {
        label: { en: "GPP / capita", th: "GPP ต่อหัว", zh: "人均 GPP" },
        value: city => formatPickValue(city.metrics.gppPerCapita, " THB/person"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "FDI inflow", th: "FDI เข้า", zh: "外资流入" },
        value: city => formatPickValue(city.metrics.fdiInflow, " million THB"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
  {
    cityId: "phitsanulok-muni",
    kicker: {
      en: "Municipal delivery",
      th: "บริการเทศบาล",
      zh: "市政服务",
    },
    why: {
      en: "Use the digital and environment scores to frame questions. Confirm service use, savings and flood operations in dated local records.",
      th: "ใช้คะแนนดิจิทัลและสิ่งแวดล้อมตั้งคำถาม แล้วตรวจการใช้บริการ การประหยัด และการจัดการน้ำท่วมจากหลักฐานท้องถิ่นที่ระบุวันที่",
      zh: "用数字与环境评分提出问题，并以注明日期的本地记录核实使用率、节省额及防洪运行。",
    },
    chips: [
      {
        label: { en: "Digital score", th: "คะแนนดิจิทัล", zh: "数字评分" },
        value: city => formatPickValue(city.scores.digital, " / 100"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "Environment score", th: "คะแนนสิ่งแวดล้อม", zh: "环境评分" },
        value: city => formatPickValue(city.scores.environment, " / 100"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
  {
    cityId: "korat",
    kicker: {
      en: "Workforce & air",
      th: "แรงงานและอากาศ",
      zh: "劳动力与空气",
    },
    why: {
      en: "Provincial labour supply does not establish vacancies or available skills. Check employers, wages, commuting and current air conditions.",
      th: "แรงงานระดับจังหวัดไม่ได้ยืนยันตำแหน่งว่างหรือทักษะที่หาได้ ควรตรวจนายจ้าง ค่าจ้าง การเดินทาง และอากาศปัจจุบัน",
      zh: "省级劳动力规模不证明岗位空缺或可用技能；请核查雇主、工资、通勤及当前空气。",
    },
    chips: [
      {
        label: { en: "Annual PM₂.₅", th: "PM₂.₅ รายปี", zh: "年均PM₂.₅" },
        value: city => formatPickValue(city.metrics.pm25Annual, " µg/m³"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
      {
        label: { en: "Labour force", th: "แรงงาน", zh: "劳动力" },
        value: city => formatPickValue(city.metrics.laborForce, " thousand people"),
        anchor: {
          en: "Curated baseline · check sources and dates in dossier",
          th: "ข้อมูลฐานที่คัดสรร · ตรวจแหล่งข้อมูลและวันที่ในแฟ้มเมือง",
          zh: "编辑基线 · 请核查城市档案中的来源及日期",
        },
      },
    ],
  },
];

/** Preserve missing values; no invented editorial number fills a source gap. */
function formatPickValue(value: number | undefined, unit: string): string {
  return value == null || !Number.isFinite(value) ? "—" : value.toLocaleString("en-US", { maximumFractionDigits: 1 }) + unit;
}
