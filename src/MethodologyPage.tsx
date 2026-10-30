import { cdpSources } from "./cdpData";
import { dataSources } from "./evidenceData";
import {
  CDP_PLATFORM_COUNT,
  CORE_METRIC_KEYS,
  EVIDENCE_SOURCE_FAMILY_COUNT,
  EXTENDED_METRIC_KEYS,
  FIELD_SOURCE_COUNT,
  GOVERNMENT_SOURCE_COUNT,
  INTERNATIONAL_SOURCE_COUNT,
  SATELLITE_SOURCE_COUNT,
  SCITI_DATA_CUTOFF_ISO,
  SCITI_METHOD_CODE,
  SCITI_METHOD_VERSION,
  SCORE_DOMAIN,
  TIER_THRESHOLDS,
} from "./methodologySpec";
import { SCORING_PILLARS } from "./scoring";
import { allCities } from "./cityData";
import {
  DEPA_DIMENSION_ORDER,
  DIMENSION_LABELS,
  DIMENSION_WEIGHTS,
  INDICATORS,
  deriveAll,
  resolveProvince,
} from "./dimensionScores";
import { BASELINE_COVERAGE } from "./baselineSources";
import { PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData";
import { PROVINCE_ZH } from "./cityNamesZh";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_TEXT_COLORS, PILLAR_WEIGHTS } from "./types";
import { translate } from "./cityPresentation";
import { assetUrl } from "./assetUtils";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

/**
 * The baseline program, measured live from the engine so the page cannot
 * drift from what /baseline actually computes.
 */
const baselineDimensionRows = (() => {
  const derivations = deriveAll(allCities);
  return DEPA_DIMENSION_ORDER.map(dim => {
    const defs = INDICATORS.filter(i => i.dimension === dim && i.weight > 0);
    let scored = 0;
    for (const city of allCities) {
      if (derivations.get(city.id)!.dimensions[dim].score != null) scored++;
    }
    return { dim, weight: DIMENSION_WEIGHTS[dim], defs, scored, total: allCities.length };
  });
})();

const baselineScoredCities = baselineDimensionRows.filter(r => r.scored > 0).length;

/**
 * The fewest cities any measured dimension covers. Living reaches 117 —
 * Bueng Kan was created in 2011 and does not exist in any vintage of the
 * household survey — so "for all 118 cities" would be a small lie.
 */
const baselineCoverageFloor = Math.min(
  ...baselineDimensionRows.filter(r => r.scored > 0).map(r => r.scored),
);

/**
 * The national road-death rate and the best province, computed live.
 *
 * The sentence that quotes them is a claim about the data, so it must not
 * be a claim about a number someone typed once.
 */
const baselineRoadSafety = (() => {
  const deaths = PROVINCE_BASELINE_BY_ID["rtddi-road-deaths"];
  const pop = PROVINCE_BASELINE_BY_ID["nso-province-population"];
  let totalDeaths = 0, totalPop = 0;
  const rates: { province: string; rate: number }[] = [];
  for (const [province, n] of Object.entries(deaths)) {
    const p = pop[province];
    if (!p) continue;
    totalDeaths += n;
    totalPop += p;
    rates.push({ province, rate: (n / p) * 100 });
  }
  const best = rates.reduce((a, b) => (b.rate < a.rate ? b : a));
  const city = allCities.find(c => resolveProvince(c.province) === best.province);
  return {
    national: (totalDeaths / totalPop) * 100,
    best,
    bestName: {
      en: best.province,
      th: city?.provinceTh ?? best.province,
      zh: PROVINCE_ZH[best.province] ?? best.province,
    },
  };
})();

/**
 * The dimensions with nothing measured for them, named from the engine.
 *
 * The gap sentence used to say "Two" and name Energy and Governance in
 * prose. Both were hand-typed, and both could drift from the model the
 * page is reporting on — which is exactly the kind of quiet disagreement
 * this page exists to prevent.
 */
const baselineGapDimensions = (() => {
  const derivations = deriveAll(allCities);
  return DEPA_DIMENSION_ORDER.filter(dim =>
    allCities.every(c => derivations.get(c.id)!.dimensions[dim].score == null),
  );
})();

const baselineGapNames = (locale: Locale) =>
  baselineGapDimensions.map(d => DIMENSION_LABELS[d][locale]).join(locale === "th" ? " และ " : locale === "zh" ? " 与 " : " and ");

/**
 * The coverage range, measured live. A hand-typed range rots the moment an
 * indicator is added or a province falls out of a series, and this sentence
 * is the one a committee member checks.
 */
const baselineCoverageRange = (() => {
  const covs = [...deriveAll(allCities).values()]
    .filter(d => d.composite != null)
    .map(d => d.weightCoverage);
  return {
    min: Math.round(Math.min(...covs) * 100),
    max: Math.round(Math.max(...covs) * 100),
  };
})();

type TriLingual = { en: string; th: string; zh: string };

const pillarDescriptions: Record<ScoringPillar, TriLingual & { signals: TriLingual[] }> = {
  livability: {
    en: "Two-component doctrine: housing/infra/daily-life (75%) + GISTDA flood-frequency factor (25%). A province repeatedly inundated by floods cannot be called livable, no matter how good its housing stock or transit — the lived experience of September Chao Phraya overflow in Nakhon Sawan or December monsoon in Narathiwat is part of the score. Flood data is sourced from GISTDA repeat-flood polygons 2005–2016 and DDPM annual records, with a per-province note documenting the recurrence pattern.",
    th: "หลักคิดสองส่วน: ที่อยู่/โครงสร้างพื้นฐาน/ชีวิตประจำวัน (75%) + ปัจจัยน้ำท่วมจาก GISTDA (25%) จังหวัดที่ท่วมซ้ำซากเรียกว่าน่าอยู่ไม่ได้ ไม่ว่าที่อยู่อาศัยจะดีหรือขนส่งจะสะดวกเพียงใด ประสบการณ์จริงของน้ำท่วมเจ้าพระยาที่นครสวรรค์ทุกกันยายนหรือมรสุมธันวาคมที่นราธิวาส เป็นส่วนหนึ่งของคะแนน ข้อมูลน้ำท่วมมาจากชั้นข้อมูลน้ำท่วมซ้ำซาก GISTDA ปี 2548-2559 บวกข้อมูลกรมป้องกันและบรรเทาสาธารณภัย (ปภ.) พร้อมหมายเหตุรายจังหวัด",
    zh: "两段式：住房/基础设施/日常生活（75%）+ GISTDA 洪水频率因子（25%）。反复被淹的省份不能称为宜居，无论住房或交通多好——那空沙旺九月昭披耶河泛滥、那拉提瓦十二月季风带来的真实经验同样是分数的一部分。洪水数据来源：GISTDA 2005–2016 重复洪水图层 + DDPM 年度记录，每个省份附有出处说明。",
    signals: [
      { en: "Housing and affordability", th: "ที่อยู่อาศัยและความสามารถในการจ่าย", zh: "住房与可负担性" },
      { en: "Transit access", th: "การเข้าถึงขนส่ง", zh: "交通可达性" },
      { en: "Infrastructure reliability", th: "ความเชื่อถือได้ของโครงสร้างพื้นฐาน", zh: "基础设施可靠性" },
      { en: "Flood-frequency factor (GISTDA)", th: "ปัจจัยความถี่น้ำท่วม (GISTDA)", zh: "洪水频率因子 (GISTDA)" },
    ],
  },
  economy: {
    en: "Productive capacity and earning power: output, income, labor scale, and the city's ability to absorb capital honestly.",
    th: "ศักยภาพการผลิตและกำลังหารายได้: ผลผลิต รายได้ ขนาดแรงงาน และความสามารถของเมืองในการรับทุนอย่างซื่อสัตย์",
    zh: "生产能力与收入能力：产出、收入、劳动力规模，以及城市真实吸纳资本的能力。",
    signals: [
      { en: "GPP per capita", th: "GPP ต่อหัว", zh: "人均 GPP" },
      { en: "Monthly income", th: "รายได้ต่อเดือน", zh: "月收入" },
      { en: "Growth trajectory", th: "ทิศทางการเติบโต", zh: "增长趋势" },
      { en: "FDI and industry mix", th: "FDI และโครงสร้างอุตสาหกรรม", zh: "FDI 与产业结构" },
    ],
  },
  safety: {
    en: "Three-component doctrine: road fatality rate (30%), crime exposure (40%), and disaster resilience (30%). Road safety is sourced from thairsc.com provincial data — annual deaths per 100,000 population — because a city cannot be called safe while its roads are lethal. Crime and resilience components remain qualitatively assessed against available provincial data.",
    th: "หลักคำสอนสามองค์ประกอบ: อัตราการเสียชีวิตบนท้องถนน (30%) ความเสี่ยงอาชญากรรม (40%) และความยืดหยุ่นต่อภัยพิบัติ (30%) ความปลอดภัยทางถนนมาจากข้อมูลรายจังหวัดของ thairsc.com — จำนวนผู้เสียชีวิตต่อแสนคนต่อปี — เพราะเมืองไม่อาจอ้างว่าปลอดภัยหากถนนยังคร่าชีวิตผู้คน ส่วนองค์ประกอบด้านอาชญากรรมและความยืดหยุ่นยังคงประเมินเชิงคุณภาพเทียบกับข้อมูลระดับจังหวัดที่มีอยู่",
    zh: "三要素原则：道路死亡率（30%）、犯罪暴露（40%）与灾害韧性（30%）。道路安全数据来自 thairsc.com 的省级年度死亡率（每十万人）——因为一座城市若道路夺命，便无权自称安全。犯罪与韧性部分继续以定性方式对照省级数据评估。",
    signals: [
      { en: "Road deaths per 100K — thairsc.com (30%)", th: "ผู้เสียชีวิตทางถนนต่อแสนคน — thairsc.com (30%)", zh: "每十万人道路死亡 — thairsc.com（30%）" },
      { en: "Crime per 100K (40%)", th: "อาชญากรรมต่อแสนคน (40%)", zh: "每十万人犯罪率（40%）" },
      { en: "Disaster preparedness (30%)", th: "ความพร้อมรับภัยพิบัติ (30%)", zh: "灾害准备度（30%）" },
      { en: "Operational safety systems", th: "ระบบความปลอดภัยที่ใช้งานจริง", zh: "实际运行的安全系统" },
    ],
  },
  wellbeing: {
    en: "Public-service depth: health access, education-serving capacity, and whether the city can sustain human development after the ribbon-cutting.",
    th: "ความลึกของบริการสาธารณะ: การเข้าถึงสุขภาพ ศักยภาพด้านการศึกษา และเมืองสามารถพัฒนาคนต่อได้หลังตัดริบบิ้นหรือไม่",
    zh: "公共服务深度：医疗可及性、教育承载力，以及剪彩之后城市是否还能持续支撑人的发展。",
    signals: [
      { en: "Hospital beds and care access", th: "เตียงและการเข้าถึงการดูแล", zh: "病床与医疗可及性" },
      { en: "Education-serving capacity", th: "ศักยภาพรองรับการศึกษา", zh: "教育承载能力" },
      { en: "Service continuity", th: "ความต่อเนื่องของบริการ", zh: "服务连续性" },
      { en: "Family-friendly conditions", th: "เงื่อนไขที่เป็นมิตรต่อครอบครัว", zh: "家庭友好条件" },
    ],
  },
  environment: {
    en: "Environmental stress and resilience: air, water, green coverage, and whether the ecological baseline supports healthy urban life. World Bank CCDR 2025 quantifies the cost of inaction at 7–14% of GDP by 2050 under business-as-usual — making the environment pillar an investment signal, not just a sustainability score. Cities with stronger environmental baselines face lower climate adaptation costs and smaller economic drag from flood damage, heat stress, and water scarcity.",
    th: "ความกดดันและความยืดหยุ่นด้านสิ่งแวดล้อม: อากาศ น้ำ พื้นที่สีเขียว และฐานนิเวศรองรับชีวิตเมืองที่ดีหรือไม่ ธนาคารโลก CCDR 2025 วัดค่าต้นทุนของการไม่ดำเนินการที่ 7-14% ของ GDP ภายในปี 2593 ภายใต้สถานการณ์ปกติ ทำให้เสาหลักสิ่งแวดล้อมเป็นสัญญาณการลงทุน ไม่ใช่แค่คะแนนความยั่งยืน เมืองที่มีฐานสิ่งแวดล้อมแข็งแกร่งกว่าจะเผชิญต้นทุนการปรับตัวด้านภูมิอากาศที่ต่ำกว่า และแรงฉุดทางเศรษฐกิจจากความเสียหายน้ำท่วม ความเครียดจากความร้อน และภาวะขาดแคลนน้ำก็น้อยกว่า",
    zh: "环境压力与韧性：空气、水、绿地，以及生态底盘是否支撑健康的城市生活。世界银行CCDR 2025将不作为的代价量化为2050年前占GDP7-14%——使环境支柱成为投资信号，而非仅仅是可持续发展评分。环境基线更强的城市面临更低的气候适应成本和更小的洪水、热应力和水资源短缺造成的经济拖累。",
    signals: [
      { en: "Annual PM2.5 (GISTDA live stations)", th: "PM2.5 รายปี (สถานีสด GISTDA)", zh: "年均 PM2.5（GISTDA实时站）" },
      { en: "Water quality + EEC water security risk", th: "คุณภาพน้ำ + ความเสี่ยงความมั่นคงทางน้ำ EEC", zh: "水质 + EEC水安全风险" },
      { en: "Green and forest coverage (GISTDA 50k)", th: "พื้นที่สีเขียวและป่าไม้ (GISTDA 50k)", zh: "绿地与森林覆盖（GISTDA 50k）" },
      { en: "Observed environmental trajectory", th: "ทิศทางสิ่งแวดล้อมที่สังเกตได้", zh: "可观察的环境趋势" },
      { en: "Flood-frequency factor (GISTDA + World Bank CCDR)", th: "ปัจจัยความถี่น้ำท่วม (GISTDA + ธนาคารโลก CCDR)", zh: "洪水频率因子（GISTDA + 世界银行CCDR）" },
    ],
  },
  hospitality: {
    en: "Belonging and civic warmth: the city's cultural legibility, social welcome, and whether people want to stay rather than merely pass through.",
    th: "ความรู้สึกเป็นส่วนหนึ่งและความอบอุ่นของเมือง: ความชัดเจนทางวัฒนธรรม การต้อนรับทางสังคม และผู้คนอยากอยู่ต่อหรือแค่ผ่านไป",
    zh: "归属感与城市温度：文化可识别性、社会欢迎度，以及人们是否愿意留下而不只是路过。",
    signals: [
      { en: "Cultural intensity", th: "ความเข้มข้นทางวัฒนธรรม", zh: "文化强度" },
      { en: "Community programming", th: "กิจกรรมชุมชน", zh: "社区活动" },
      { en: "Tourism experience quality", th: "คุณภาพประสบการณ์ท่องเที่ยว", zh: "旅游体验质量" },
      { en: "Field evidence of civic life", th: "หลักฐานภาคสนามของชีวิตเมือง", zh: "城市生活的实地证据" },
    ],
  },
  digital: {
    en: "Digital is an enabling pillar, not a halo effect: data rails, IoT, service usage, and whether technology changes outcomes rather than headlines.",
    th: "ดิจิทัลเป็นเสาหลักที่เปิดทาง ไม่ใช่รัศมี: รางข้อมูล IoT การใช้งานบริการ และเทคโนโลยีเปลี่ยนผลลัพธ์ ไม่ใช่แค่พาดหัว",
    zh: "数字是赋能支柱，不是光环：数据底座、IoT、服务使用，以及技术是否改变结果而不只是制造标题。",
    signals: [
      { en: "Data platform maturity", th: "วุฒิภาวะของแพลตฟอร์มข้อมูล", zh: "数据平台成熟度" },
      { en: "Operational IoT systems", th: "ระบบ IoT ที่ใช้งานจริง", zh: "实际运行的 IoT 系统" },
      { en: "Citizen-facing service uptake", th: "การใช้บริการที่ประชาชนสัมผัสได้", zh: "面向市民的服务采用" },
      { en: "Interoperability evidence", th: "หลักฐานการเชื่อมต่อกันได้", zh: "互操作性证据" },
    ],
  },
};

// World Bank CCDR 2025 urgency — added to the method snapshot ribbon so
// the investment cost of inaction is visible at the top of the methodology page.
const CCDR_GDP_RISK = "7–14% GDP by 2050";
const CCDR_INVESTMENT_NEED = "$219B / 25 yr";

const methodSnapshots: Array<{ label: TriLingual; value: TriLingual }> = [
  {
    label: { en: "Method code", th: "รหัสวิธีวิจัย", zh: "方法代码" },
    value: { en: SCITI_METHOD_CODE, th: SCITI_METHOD_CODE, zh: SCITI_METHOD_CODE },
  },
  {
    label: { en: "Version", th: "เวอร์ชัน", zh: "版本" },
    value: { en: SCITI_METHOD_VERSION, th: SCITI_METHOD_VERSION, zh: SCITI_METHOD_VERSION },
  },
  {
    label: { en: "Data cut-off", th: "วันตัดข้อมูล", zh: "数据截点" },
    value: { en: "2026-04-04", th: "2026-04-04", zh: "2026-04-04" },
  },
  {
    label: { en: "Evidence registry", th: "ทะเบียนหลักฐาน", zh: "证据名录" },
    value: {
      en: `${EVIDENCE_SOURCE_FAMILY_COUNT} source families`,
      th: `${EVIDENCE_SOURCE_FAMILY_COUNT} ตระกูลแหล่งข้อมูล`,
      zh: `${EVIDENCE_SOURCE_FAMILY_COUNT} 个来源族群`,
    },
  },
  {
    label: { en: "Platform map", th: "แผนที่แพลตฟอร์ม", zh: "平台映射" },
    value: {
      en: `${CDP_PLATFORM_COUNT} public endpoints`,
      th: `${CDP_PLATFORM_COUNT} ปลายทางสาธารณะ`,
      zh: `${CDP_PLATFORM_COUNT} 个公开端点`,
    },
  },
  {
    label: { en: "Score domain", th: "ช่วงคะแนน", zh: "分数区间" },
    value: {
      en: `${SCORE_DOMAIN.min}-${SCORE_DOMAIN.max}`,
      th: `${SCORE_DOMAIN.min}-${SCORE_DOMAIN.max}`,
      zh: `${SCORE_DOMAIN.min}-${SCORE_DOMAIN.max}`,
    },
  },
  {
    label: { en: "Tier rule", th: "กฎจัดระดับ", zh: "层级规则" },
    value: {
      en: `α >= ${TIER_THRESHOLDS.alpha}, β >= ${TIER_THRESHOLDS.beta}`,
      th: `α >= ${TIER_THRESHOLDS.alpha}, β >= ${TIER_THRESHOLDS.beta}`,
      zh: `α >= ${TIER_THRESHOLDS.alpha}, β >= ${TIER_THRESHOLDS.beta}`,
    },
  },
  // World Bank CCDR 2025 — climate cost of inaction shown in the method header
  {
    label: { en: "Climate cost of inaction", th: "ต้นทุนของการไม่ดำเนินการด้านภูมิอากาศ", zh: "不作为的气候代价" },
    value: { en: CCDR_GDP_RISK, th: CCDR_GDP_RISK, zh: CCDR_GDP_RISK },
  },
  {
    label: { en: "Climate investment needed", th: "การลงทุนด้านภูมิอากาศที่ต้องการ", zh: "所需气候投资" },
    value: { en: CCDR_INVESTMENT_NEED, th: CCDR_INVESTMENT_NEED, zh: CCDR_INVESTMENT_NEED },
  },
];

const evidenceHighlightIds = ["nso", "nesdc", "pcd", "gistda", "rtp", "moph", "boi", "onep", "rfd", "field"];
const platformHighlightIds = ["data-go-th", "citydata-in-th", "air4thai", "dopa-stat", "tmd"];

const evidenceHighlights = evidenceHighlightIds
  .map(id => dataSources.find(source => source.id === id))
  .filter((source): source is (typeof dataSources)[number] => Boolean(source));

const platformHighlights = platformHighlightIds
  .map(id => cdpSources.find(source => source.id === id))
  .filter((source): source is (typeof cdpSources)[number] => Boolean(source));

const platformHighlightZh: Record<string, string> = {
  "data-go-th": "泰国政府开放数据门户，聚合各部委和地方单位的数据集，可按省份和行政区检索。",
  "citydata-in-th": "depa 的智慧城市数据平台，汇集项目、传感器与城市仪表板入口。",
  "air4thai": "污染控制部门的实时空气质量平台，提供 PM2.5、AQI 及历史监测记录。",
  "dopa-stat": "DOPA 户籍人口统计平台，提供省、县、分区层级的人口与迁移数据。",
  "tmd": "泰国气象局实时天气平台，提供温度、湿度、降雨与预报数据。",
};

function formatIsoDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().slice(0, 10);
}

/** Inline SVG — layperson data-flow diagram */
function DataFlowDiagram({ locale }: { locale: Locale }) {
  const t = (en: string, th: string, zh: string) =>
    locale === "th" ? th : locale === "zh" ? zh : en;

  const boxes = [
    { id: "sources", label: t(`${EVIDENCE_SOURCE_FAMILY_COUNT} Sources`, `${EVIDENCE_SOURCE_FAMILY_COUNT} แหล่งข้อมูล`, `${EVIDENCE_SOURCE_FAMILY_COUNT} 个数据源`), sub: t("NSO · NESDC · PCD · GISTDA…", "NSO · NESDC · PCD · GISTDA…", "NSO · NESDC · PCD · GISTDA…"), x: 20, color: "#0D9488" },
    { id: "research", label: t("Research Layer", "ชั้นวิจัย", "研究层"), sub: t("7 pillars · field verification", "7 เสาหลัก · ยืนยันภาคสนาม", "7 支柱 · 实地核验"), x: 200, color: "#D97706" },
    { id: "math", label: t("Math Layer", "ชั้นคณิตศาสตร์", "数学层"), sub: t("Weighted sum · deterministic", "ผลรวมถ่วงน้ำหนัก · กำหนดแน่นอน", "加权求和 · 确定性"), x: 380, color: "#1A6FB5" },
    { id: "output", label: t("Score + Tier", "คะแนน + ระดับ", "得分 + 层级"), sub: t("0–100 · α β γ", "0–100 · α β γ", "0–100 · α β γ"), x: 560, color: "#6366F1" },
  ];

  return (
    <div className="methodology-flow" role="group" aria-label={t("Data flow diagram", "แผนภาพการไหลของข้อมูล", "数据流向图")}>
      <ol className="methodology-flow-steps">
        {boxes.map(box => (
          <li key={box.id} style={{ borderColor: box.color }}>
            <strong style={{ color: box.color }}>{box.label}</strong>
            <span>{box.sub}</span>
          </li>
        ))}
      </ol>
      <p className="methodology-flow-note">{t("Research judgment is applied in the first step only. Everything after is deterministic mathematics.", "วิจารณญาณวิจัยใช้ในขั้นแรกเท่านั้น ที่เหลือเป็นคณิตศาสตร์กำหนดแน่นอน", "研究判断仅用于第一步，此后全为确定性数学。")}</p>
    </div>
  );
}

/** Inline SVG — technical composite formula diagram */
function CompositeDiagram({ locale }: { locale: Locale }) {
  const t = (en: string, th: string, zh: string) =>
    locale === "th" ? th : locale === "zh" ? zh : en;

  const pillars = SCORING_PILLARS.map(p => ({
    name: PILLAR_LABELS.en[p].slice(0, 3).toUpperCase(),
    weight: PILLAR_WEIGHTS[p],
    color: PILLAR_COLORS[p],
    // The 9px mono abbreviation is TYPE, not a graphic — economy/hospitality
    // sit at 2.13:1 / 1.92:1 on the panel surface. Deepen for the glyph only.
    textColor: PILLAR_TEXT_COLORS[p],
  }));

  return (
    <div className="methodology-formula" role="group" aria-label={t("Composite formula diagram", "แผนภาพสูตรคะแนนรวม", "综合分公式图")}>
      <p className="methodology-formula-line"><b>{t("COMPOSITE", "คะแนนรวม", "综合分")}</b> = Σ</p>
      <ul className="methodology-formula-terms">
        {pillars.map(p => (
          <li key={p.name} style={{ borderColor: p.color }}><b style={{ color: p.textColor }}>{p.name}</b> ×{p.weight}%</li>
        ))}
      </ul>
      <p className="methodology-formula-line">{t("÷ 100 → round to 0.1 → assign tier (α≥65 / β≥45 / γ<45)", "÷ 100 → ปัดหนึ่งตำแหน่ง → จัดระดับ (α≥65 / β≥45 / γ<45)", "÷ 100 → 保留一位小数 → 分配层级 (α≥65 / β≥45 / γ<45)")}</p>
      <p className="methodology-flow-note">{t("Weights are fixed and public. The research team cannot adjust them per city.", "น้ำหนักคงที่และเปิดเผย ทีมวิจัยปรับไม่ได้ตามเมือง", "权重固定且公开，研究团队不能按城市调整。")}</p>
    </div>
  );
}

const GITHUB_URL = "https://github.com/Nonarkara/smart-city-thailand-index";

export default function MethodologyPage({ locale, onNavigate }: Props) {
  const t = (en: string, th: string, zh: string) => translate(locale, { en, th, zh });

  return (
    <div className="methodology-page">

      {/* ─── HERO ─── */}
      <section className="section methodology-hero reveal visible">
        <p className="eyebrow">{t("Methodology", "วิธีการ", "方法论")}</p>
        <h1 className="hero-title">
          {t("Scoring, evidence, and uncertainty", "คะแนน หลักฐาน และความไม่แน่นอน", "评分、证据与不确定性")}
        </h1>
        <p className="hero-strapline">
          {t(
            "Seven pillars. One composite. Zero black boxes.",
            "เจ็ดเสาหลัก คะแนนรวมหนึ่งเดียว ไม่มีกล่องดำ",
            "七个支柱，一个综合分，没有黑箱。",
          )}
        </p>
      </section>

      {/* ─── NAME ETYMOLOGY ─── */}
      <section className="section meth-etymology reveal visible">
        <div className="meth-etymology-block">
          <div className="meth-etymology-row">
            <span className="meth-ety-form">SCITI</span>
            <span className="meth-ety-eq">=</span>
            <span className="meth-ety-def">{t("Smart City Thailand Index", "ดัชนีเมืองอัจฉริยะไทย", "泰国智慧城市指数")}</span>
          </div>
          <div className="meth-etymology-row">
            <span className="meth-ety-form"><span className="meth-ety-sma">Sma</span><span className="meth-ety-sciti">SCITI</span></span>
            <span className="meth-ety-eq">=</span>
            <span className="meth-ety-def">{t("Sma- (Smart) + SCITI — same index, compressed", "Sma- (Smart) + SCITI — ดัชนีเดิม ในรูปย่อ", "Sma-（Smart）+ SCITI——同一指数，压缩形式")}</span>
          </div>
          <div className="meth-etymology-row">
            <span className="meth-ety-form meth-ety-samastiti">Samastiti</span>
            <span className="meth-ety-eq">≈</span>
            <span className="meth-ety-def">{t("สมาร์ทซิตี้ — Thai phonetic for Smart City · all three are one", "สมาร์ทซิตี้ — การออกเสียงภาษาไทยของ Smart City · ทั้งสามคือหนึ่ง", "สมาร์ทซิตี้——Smart City的泰语音译 · 三形同一")}</span>
          </div>
        </div>
      </section>

      {/* ─── VERSION JOURNEY ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Version history", "ประวัติเวอร์ชัน", "版本历史")}</p>
        <h2>{t("From a public question to a city data platform", "จากคำถามสาธารณะสู่แพลตฟอร์มข้อมูลเมือง", "从一个公开问题到城市数据平台")}</h2>
        <p className="section-intro" style={{ marginBottom: "1.5rem" }}>
          {t(
            "This is version 2026.04 — the fourth major iteration. Each version asked a harder question than the last.",
            "นี่คือเวอร์ชัน 2026.04 — การปรับปรุงครั้งใหญ่ครั้งที่สี่ แต่ละเวอร์ชันตั้งคำถามที่ยากกว่าเดิม",
            "这是 2026.04 版本——第四次重大迭代。每个版本都比上一个问了更难的问题。",
          )}
        </p>
        <div className="meth-version-timeline">
          {[
            {
              ver: "v0", date: "2024",
              label: { en: "The provocation", th: "การตั้งคำถาม", zh: "一声质疑" },
              desc: {
                en: "A public post asked a simple question: Thailand had certified 30 smart cities. Which of them actually worked? No index. No scoring. Just the question, which proved enough to start a serious conversation.",
                th: "โพสต์สาธารณะตั้งคำถามง่ายๆ ว่า ไทยรับรองเมืองอัจฉริยะ 30 แห่งแล้ว มีกี่แห่งที่เดินจริง? ยังไม่มีดัชนี ยังไม่มีคะแนน มีเพียงคำถาม ซึ่งเพียงพอที่จะเริ่มบทสนทนาที่จริงจัง",
                zh: "一篇公开帖提出了一个简单问题：泰国已认证 30 座智慧城市，哪些真正运转？当时没有指数，也没有评分，只有这个问题，却足以开启一场严肃讨论。",
              },
            },
            {
              ver: "v1", date: "2025-Q1",
              label: { en: "The prototype", th: "ต้นแบบ", zh: "原型" },
              desc: {
                en: "30 cities, hand-collected data from public sources, 3 rough pillars, no confidence model. Built to prove the idea was worth building properly. It was ugly. It worked.",
                th: "30 เมือง รวบรวมข้อมูลมือจากแหล่งสาธารณะ 3 เสาหลักคร่าวๆ ไม่มีโมเดลความเชื่อมั่น สร้างขึ้นเพื่อพิสูจน์ว่าไอเดียนี้ควรสร้างอย่างจริงจัง มันน่าเกลียด แต่ใช้งานได้",
                zh: "30 座城市，人工从公开来源收集数据，3 个粗略支柱，没有置信模型。建它是为了证明这个想法值得认真去做。丑，但能用。",
              },
            },
            {
              ver: "v2", date: "2025-Q3",
              label: { en: "The Smart City Summit", th: "งาน Smart City Summit", zh: "智慧城市峰会版" },
              desc: {
                en: "174 cities tracked for the Thailand Smart City Summit 2026. Expanded to 5 pillars. First proper evidence registry. Still a slide deck, not a live index — but the structure started to hold.",
                th: "ติดตาม 174 เมืองสำหรับงาน Thailand Smart City Summit 2026 ขยายเป็น 5 เสาหลัก ทะเบียนหลักฐานครั้งแรกที่จริงจัง ยังเป็นชุดสไลด์ ไม่ใช่ดัชนีสด — แต่โครงสร้างเริ่มแข็งแกร่งขึ้น",
                zh: "为泰国智慧城市峰会 2026 追踪 174 座城市。扩展至 5 个支柱。首个正式的证据名录。仍是演示文稿，还不是实时指数——但结构开始站稳了。",
              },
            },
            {
              ver: "2026.04", date: "2026-04",
              label: { en: "This version — SCITI 2026", th: "เวอร์ชันนี้ — SCITI 2026", zh: "当前版本——SCITI 2026" },
              desc: {
                en: `118 certified, promotion-zone and registered city records, seven research pillars and a confidence model. Certification entries draw on depa source documents. The platform supports comparison and source review; registration alone is not an assessment.`,
                th: `แฟ้มเมืองรับรอง เขตส่งเสริม และเมืองที่ขึ้นทะเบียน 118 แห่ง เจ็ดเสาวิจัย และโมเดลความเชื่อมั่น ข้อมูลรับรองอ้างอิงเอกสารต้นทางของ depa แพลตฟอร์มช่วยเปรียบเทียบและตรวจแหล่งข้อมูล การขึ้นทะเบียนเพียงอย่างเดียวไม่ใช่การประเมิน`,
                zh: `涵盖118个认证、推广及注册城市档案，采用七项研究维度与置信模型。认证资料依据depa原始文件。平台用于比较和来源核查；仅有注册并不等于完成评估。`,
              },
              current: true,
            },
          ].map(v => (
            <div key={v.ver} className={`meth-version-item${v.current ? " meth-version-current" : ""}`}>
              <div className="meth-version-tag">
                <span className="meth-version-label">{v.ver}</span>
                <span className="meth-version-date">{v.date}</span>
              </div>
              <div className="meth-version-body">
                <p className="meth-version-name">{translate(locale, v.label)}</p>
                <p className="meth-version-desc">{translate(locale, v.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT WE BUILT WITH ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Stack", "เทคโนโลยีที่ใช้", "技术栈")}</p>
        <h2>{t("What this is made of, for non-programmers", "สร้างจากอะไร สำหรับคนที่ไม่ได้เขียนโค้ด", "对非程序员说明：这是用什么做的")}</h2>
        <div className="meth-stack-grid">
          {[
            {
              name: "React 19 + TypeScript",
              what: {
                en: "The interface layer. Every city card, pillar bar, and ranking list you see is a React component — a reusable block of logic and display. TypeScript means the data shapes are enforced: if a city's score field contains text instead of a number, the build fails.",
                th: "ชั้น interface ทุกการ์ดเมือง แถบเสาหลัก และลิสต์อันดับที่เห็นคือ React component — บล็อกของ logic และการแสดงผลที่ใช้ซ้ำได้ TypeScript ทำให้ตัวข้อมูลถูกบังคับ: ถ้าฟิลด์คะแนนของเมืองมีข้อความแทนตัวเลข build จะล้มเหลว",
                zh: "界面层。你看到的每个城市卡片、支柱条形图和排名列表都是 React 组件——可复用的逻辑与显示块。TypeScript 强制数据格式：如果城市分数字段包含文本而非数字，构建就会失败。",
              },
            },
            {
              name: "Vite 6",
              what: {
                en: "The build tool. It bundles all the code and data into the fast static files you download when you open this page. The entire index deploys to GitHub Pages in under 2 seconds.",
                th: "เครื่องมือ build รวม code และข้อมูลทั้งหมดเป็นไฟล์สถิตที่เร็ว ซึ่งคุณดาวน์โหลดเมื่อเปิดหน้านี้ ทั้งดัชนีดีพลอยไปที่ GitHub Pages ในเวลาไม่ถึง 2 วินาที",
                zh: "构建工具。将所有代码和数据打包成快速的静态文件，就是你打开这个页面时下载的内容。整个索引部署到 GitHub Pages 不到 2 秒。",
              },
            },
            {
              name: t("Data as TypeScript constants", "ข้อมูลเป็น TypeScript constants", "数据作为 TypeScript 常量"),
              what: {
                en: "No database. City scores live inside the code itself, in `src/cityData.ts`. This sounds weird until you realize it means the data is version-controlled, auditable by anyone with a browser, and impossible to update without a commit. A commit is a permanent public record.",
                th: "ไม่มีฐานข้อมูล คะแนนเมืองอยู่ใน code เอง ใน src/cityData.ts ฟังดูแปลก จนกว่าจะรู้ว่ามันหมายความว่าข้อมูลถูกควบคุมเวอร์ชัน ตรวจสอบได้โดยใครก็ตามที่มี browser และอัปเดตไม่ได้โดยไม่มี commit commit คือบันทึกสาธารณะถาวร",
                zh: "没有数据库。城市分数存在代码本身中，在 src/cityData.ts 里。这听起来奇怪，直到你意识到：这意味着数据有版本控制，任何有浏览器的人都可以审计，且不提交就无法更新。提交是永久的公开记录。",
              },
            },
            {
              name: "GitHub Pages + GitHub Actions",
              what: {
                en: "Every push to the main branch automatically deploys to the live URL. The CI pipeline builds the app, runs type checks, and publishes. No servers, no cloud bills, no DevOps team. Just a push.",
                th: "ทุก push ไปที่ main branch จะ deploy ไปยัง URL สดโดยอัตโนมัติ CI pipeline build app รันการตรวจสอบ type และเผยแพร่ ไม่มีเซิร์ฟเวอร์ ไม่มีค่า cloud ไม่มีทีม DevOps แค่ push",
                zh: "每次推送到主分支都会自动部署到实时 URL。CI 流水线构建应用、运行类型检查并发布。没有服务器，没有云账单，没有 DevOps 团队。只是一次推送。",
              },
            },
            {
              name: t("Zero CSS frameworks", "ไม่มี CSS framework", "零 CSS 框架"),
              what: {
                en: "No Tailwind, no Bootstrap, no shadcn. Every rule in `src/styles.css` was written by hand. Design tokens enforce zero border-radius, zero drop shadows, and a three-size typography rule site-wide — rules that an AI can accidentally break without a committed policy.",
                th: "ไม่มี Tailwind ไม่มี Bootstrap ไม่มี shadcn ทุก rule ใน src/styles.css เขียนด้วยมือ Design tokens บังคับให้ border-radius เป็นศูนย์ drop shadows เป็นศูนย์ และกฎ typography 3 ขนาดทั่วทั้งเว็บ — กฎที่ AI อาจทำเสียโดยไม่ตั้งใจโดยไม่มีนโยบายที่บันทึกไว้",
                zh: "没有 Tailwind，没有 Bootstrap，没有 shadcn。src/styles.css 中的每条规则都是手写的。设计令牌强制执行全站零 border-radius、零投影和三尺寸排版规则——这些规则在没有书面政策的情况下，AI 可能会不小心破坏。",
              },
            },
          ].map(item => (
            <div key={item.name} className="meth-stack-card">
              <div className="meth-stack-name">{item.name}</div>
              <p className="meth-stack-what">{translate(locale, item.what)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── GITHUB + TRANSPARENCY ─── */}
      <section className="section reveal visible meth-github-section">
        <div className="meth-github-inner">
          <div className="meth-github-text">
            <p className="eyebrow">{t("Open source", "โอเพนซอร์ส", "开源")}</p>
            <h2>{t("Everything is on GitHub", "ทุกอย่างอยู่บน GitHub", "一切都在 GitHub 上")}</h2>
            <p>
              {t(
                "The city scores, the composite formula, the evidence registry, the CSS design tokens — all of it is public. You can read the commit history, file an issue if you find an error, or fork the whole thing and run it for your own city.",
                "คะแนนเมือง สูตรคะแนนรวม ทะเบียนหลักฐาน design tokens ของ CSS — ทั้งหมดสาธารณะ คุณอ่านประวัติ commit ได้ เปิด issue ถ้าเจอข้อผิดพลาด หรือ fork ทั้งหมดและรันสำหรับเมืองของคุณเอง",
                "城市分数、综合公式、证据名录、CSS 设计令牌——全部公开。你可以读取提交历史，发现错误时提交 issue，或者 fork 整个项目为自己的城市运行。",
              )}
            </p>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="meth-github-link">
              {t("View repository →", "ดู repository →", "查看仓库 →")}
            </a>
          </div>
          <div className="meth-github-mono">
            <span className="meth-github-badge">github.com</span>
            <div className="meth-github-repo">
              <span className="meth-github-owner">Nonarkara</span>
              <span className="meth-github-slash"> / </span>
              <span className="meth-github-name">smart-city-thailand-index</span>
            </div>
            <div className="meth-github-files">
              {["src/cityData.ts", "src/scoring.ts", "src/depaOfficialData.ts", "src/evidenceData.ts"].map(f => (
                <div key={f} className="meth-github-file">— {f}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DATA FLOW DIAGRAM (LAYPERSON) ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("How it works", "มันทำงานยังไง", "它是如何运作的")}</p>
        <h2>{t("The 4-step pipeline", "ขั้นตอน 4 ขั้น", "4 步流程")}</h2>
        <p className="section-intro">
          {t(
            "Imagine a factory. Raw ingredients go in (government statistics, satellite data, field visits). Skilled researchers weigh and assemble them into pillar scores. A fixed machine runs the same calculation on every city without preference. The output is a score and a tier.",
            "ลองนึกถึงโรงงาน วัตถุดิบเข้าไป (สถิติรัฐบาล ข้อมูลดาวเทียม การลงพื้นที่) นักวิจัยผู้เชี่ยวชาญชั่งและประกอบเป็นคะแนนเสาหลัก เครื่องจักรที่ตายตัวรันการคำนวณเดียวกันกับทุกเมืองโดยไม่มีอคติ ผลลัพธ์คือคะแนนและระดับ",
            "想象一家工厂。原材料进入（政府统计、卫星数据、实地走访）。专业研究人员对其进行称量和组装，得出支柱分数。一台固定的机器对每座城市运行相同的计算，没有偏好。输出是分数和层级。",
          )}
        </p>
        <div className="meth-diagram-block">
          <DataFlowDiagram locale={locale} />
        </div>
      </section>

      {/* ─── COMPOSITE FORMULA DIAGRAM (TECHNICAL) ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Technical", "เชิงเทคนิค", "技术细节")}</p>
        <h2>{t("The composite formula", "สูตรคะแนนรวม", "综合分公式")}</h2>
        <div className="meth-diagram-block">
          <CompositeDiagram locale={locale} />
        </div>
        <p className="section-intro" style={{ marginTop: "1rem" }}>
          {t(
            "Each pillar weight is fixed and identical across every city. A researcher cannot inflate a city by choosing a different weight. The only way to change a city's composite score is to change its pillar scores — which requires evidence, sources, and a new commit to the repo.",
            "น้ำหนักแต่ละเสาหลักคงที่และเท่ากันกับทุกเมือง นักวิจัยไม่สามารถเพิ่มคะแนนเมืองด้วยการเลือกน้ำหนักอื่น วิธีเดียวที่จะเปลี่ยนคะแนนรวมของเมืองคือเปลี่ยนคะแนนเสาหลัก — ซึ่งต้องการหลักฐาน แหล่งข้อมูล และ commit ใหม่ใน repo",
            "每个支柱权重固定，对所有城市一致。研究人员不能通过选择不同权重来抬高某座城市的分数。改变城市综合分的唯一方式是改变其支柱分——这需要证据、来源，以及向仓库提交一次新的 commit。",
          )}
        </p>
      </section>

      {/* ─── METHOD SNAPSHOT ─── */}
      <section className="section reveal stagger-1 visible">
        <div className="methodology-hud shadow-premium">
          <div className="hud-header">
            <span className="hud-dot" />
            <h2 className="hud-title">{t("Method Snapshot", "สรุปวิธีการ", "方法快照")}</h2>
          </div>
          <div className="hud-grid">
            {methodSnapshots.map(item => (
              <div key={item.label.en} className="hud-item">
                <span className="hud-label">{translate(locale, item.label)}</span>
                <span className="hud-value">{translate(locale, item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PILLAR MODEL ─── */}
      <section className="section reveal stagger-2 visible">
        <p className="eyebrow">{t("Pillar Model", "แบบจำลองเสาหลัก", "支柱模型")}</p>
        <h2>{t("Seven pillars, fixed weights", "7 เสาหลัก น้ำหนักคงที่", "七个支柱，固定权重")}</h2>
        <div className="methodology-pillars">
          {SCORING_PILLARS.map(pillar => {
            const desc = pillarDescriptions[pillar];
            return (
              <div key={pillar} className="methodology-pillar-card glass-card shadow-premium">
                <div className="methodology-pillar-header">
                  <span className="methodology-pillar-dot" style={{ background: PILLAR_COLORS[pillar] }} />
                  <span className="methodology-pillar-name">{PILLAR_LABELS[locale][pillar]}</span>
                  <span className="methodology-pillar-weight">{PILLAR_WEIGHTS[pillar]}%</span>
                </div>
                <p className="methodology-pillar-desc">{translate(locale, desc)}</p>
                <div className="methodology-pillar-signals">
                  {desc.signals.map(signal => (
                    <span key={signal.en} className="signal-chip">{translate(locale, signal)}</span>
                  ))}
                </div>
                <div className="pillar-signal-flow" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── MATHEMATICS ─── */}
      <section className="section reveal stagger-3 visible">
        <p className="eyebrow">{t("Mathematics", "คณิตศาสตร์", "数学")}</p>
        <h2>{t("What the code computes exactly", "สิ่งที่โค้ดคำนวณแบบตรงตัว", "代码究竟计算什么")}</h2>
        <div className="threshold-hud glass-card shadow-heavy">
          <div className="threshold-row threshold-alpha">
            <span className="threshold-symbol">1</span>
            <div className="threshold-content">
              <span className="threshold-name">{t("Composite score", "คะแนนรวม", "综合得分")}</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: `Composite = (${SCORING_PILLARS.map(p => `${PILLAR_LABELS.en[p]} × ${PILLAR_WEIGHTS[p]}`).join(" + ")}) / 100`,
                  th: `คะแนนรวม = (${SCORING_PILLARS.map(p => `${PILLAR_LABELS.th[p]} × ${PILLAR_WEIGHTS[p]}`).join(" + ")}) / 100`,
                  zh: `综合分 = (${SCORING_PILLARS.map(p => `${PILLAR_LABELS.zh[p]} × ${PILLAR_WEIGHTS[p]}`).join(" + ")}) / 100`,
                })}
              </span>
            </div>
            <span className="threshold-range">{t("Rounded to 0.1", "ปัดถึง 0.1", "保留到 0.1")}</span>
          </div>
          <div className="threshold-row threshold-beta">
            <span className="threshold-symbol">2</span>
            <div className="threshold-content">
              <span className="threshold-name">{t("Confidence score", "คะแนนความเชื่อมั่น", "置信得分")}</span>
              <span className="threshold-desc">
                {t(
                  "Confidence is separate from the composite. It is a weighted average of core metric coverage (65%), extended indicator coverage (15%), provenance density (10%), and freshness against the release cut-off (10%).",
                  "คะแนนความเชื่อมั่นแยกจากคะแนนรวม คำนวณจากค่าเฉลี่ยถ่วงน้ำหนักของความครบถ้วนตัวชี้วัดหลัก (65%) ตัวชี้วัดเสริม (15%) ความหนาแน่นของหลักฐาน (10%) และความสดใหม่เทียบวันตัดข้อมูล (10%)",
                  "置信得分与综合分分离。它是核心指标覆盖率（65%）、扩展指标覆盖率（15%）、溯源密度（10%）和相对发布截点的新鲜度（10%）的加权平均。",
                )}
              </span>
            </div>
            <span className="threshold-range">{t("No hidden penalty", "ไม่มีโทษแฝง", "没有隐藏惩罚")}</span>
          </div>
          <div className="threshold-row threshold-gamma">
            <span className="threshold-symbol">3</span>
            <div className="threshold-content">
              <span className="threshold-name">{t("Tier assignment", "การจัดระดับ", "层级分配")}</span>
              <span className="threshold-desc">
                {t(
                  `Alpha >= ${TIER_THRESHOLDS.alpha}. Beta ${TIER_THRESHOLDS.beta}-${TIER_THRESHOLDS.alpha - 0.1}. Gamma < ${TIER_THRESHOLDS.beta}. Once pillar scores are fixed, tier assignment is automatic.`,
                  `Alpha >= ${TIER_THRESHOLDS.alpha} Beta ${TIER_THRESHOLDS.beta}-${(TIER_THRESHOLDS.alpha - 0.1).toFixed(1)} Gamma < ${TIER_THRESHOLDS.beta} เมื่อตรึงคะแนนเสาหลักแล้ว การจัดระดับเป็นอัตโนมัติ`,
                  `Alpha >= ${TIER_THRESHOLDS.alpha}，Beta ${TIER_THRESHOLDS.beta}-${(TIER_THRESHOLDS.alpha - 0.1).toFixed(1)}，Gamma < ${TIER_THRESHOLDS.beta}。一旦支柱分固定，层级分配即自动完成。`,
                )}
              </span>
            </div>
            <span className="threshold-range">{t("Deterministic", "กำหนดแน่นอน", "确定性")}</span>
          </div>
        </div>
      </section>

      {/* ─── DETERMINISTIC vs JUDGMENT ─── */}
      <section className="section methodology-judgment-section reveal stagger-4 visible">
        <div className="methodology-judgment-grid">
          <div>
            <h3>{t("What is deterministic", "สิ่งที่กำหนดแน่นอน", "哪些部分是确定性的")}</h3>
            <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6 }}>
              {t(
                "The aggregation layer is fully reproducible. The code validates that every pillar input is within 0-100, applies the fixed weight vector once, rounds to one decimal place, and assigns a tier using fixed thresholds. There are no hidden bonuses, black-box penalties, or committee overrides in the composite step.",
                "ชั้นการรวมคะแนนทำซ้ำได้ทั้งหมด โค้ดตรวจว่าคะแนนเสาหลักทุกค่าต้องอยู่ระหว่าง 0-100 ใช้น้ำหนักชุดเดิมครั้งเดียว ปัดหนึ่งตำแหน่งทศนิยม แล้วจัดระดับด้วยเกณฑ์คงที่",
                "汇总层完全可复现。代码先验证每个支柱输入都在 0-100 之间，再套用固定权重向量、保留一位小数，并按固定阈值分层。综合分阶段不存在隐藏加分、黑箱惩罚或人工委员会改分。",
              )}
            </p>
          </div>
          <div>
            <h3>{t("What still requires research judgment", "สิ่งที่ยังต้องใช้วิจารณญาณวิจัย", "哪些部分仍需研究判断")}</h3>
            <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6 }}>
              {t(
                "SCITI is not pretending to auto-generate a whole city from one API feed. Pillar scores are structured research assessments anchored in public metrics, evidence items, and field verification. Registered or promotion-zone cities without enough evidence receive provisional low-confidence baselines.",
                "SCITI ไม่ได้แสร้งทำเหมือนสร้างเมืองทั้งเมืองจาก API เส้นเดียว คะแนนเสาหลักเป็นการประเมินเชิงวิจัยที่มีโครงสร้าง ยึดกับตัวชี้วัดสาธารณะ หลักฐาน และการยืนยันภาคสนาม",
                "SCITI 并不假装能从单一 API 自动生成整座城市。支柱分数是以公共指标、证据项和实地核验为锚点的结构化研究判断。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ─── EVIDENCE BASE ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Evidence Base", "ฐานหลักฐาน", "证据基础")}</p>
        <h2>{t("Source registries behind the method", "ทะเบียนแหล่งข้อมูลหลังวิธีวิจัย", "方法背后的来源名录")}</h2>
        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {translate(locale, {
            en: `${EVIDENCE_SOURCE_FAMILY_COUNT} evidence source families are tracked: ${GOVERNMENT_SOURCE_COUNT} government, ${SATELLITE_SOURCE_COUNT} satellite, ${INTERNATIONAL_SOURCE_COUNT} international reference, and ${FIELD_SOURCE_COUNT} field-verification entries. A separate platform map tracks ${CDP_PLATFORM_COUNT} public data endpoints.`,
            th: `มี ${EVIDENCE_SOURCE_FAMILY_COUNT} ตระกูลแหล่งข้อมูล: ภาครัฐ ${GOVERNMENT_SOURCE_COUNT} ดาวเทียม ${SATELLITE_SOURCE_COUNT} อ้างอิงสากล ${INTERNATIONAL_SOURCE_COUNT} และภาคสนาม ${FIELD_SOURCE_COUNT} รายการ`,
            zh: `跟踪了 ${EVIDENCE_SOURCE_FAMILY_COUNT} 个证据来源族群：${GOVERNMENT_SOURCE_COUNT} 个政府、${SATELLITE_SOURCE_COUNT} 个卫星、${INTERNATIONAL_SOURCE_COUNT} 个国际参考、${FIELD_SOURCE_COUNT} 个实地核验。`,
          })}
        </p>
        <div className="sources-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {evidenceHighlights.map(source => (
            <div key={source.id} className="source-card glass-card">
              <div className="source-card-name" style={{ fontSize: "var(--text-body)", fontWeight: 800 }}>{source.name}</div>
              <div className="source-card-desc" style={{ marginBottom: ".5rem" }}>
                {translate(locale, { en: source.descEn, th: source.descTh, zh: source.descZh })}
              </div>
              <div style={{ fontSize: "var(--text-body)", color: "var(--2)" }}>
                {translate(locale, { en: `Frequency: ${source.updateFrequency}`, th: `ความถี่: ${source.updateFrequency}`, zh: `频率：${source.updateFrequency}` })}
              </div>
            </div>
          ))}
          {platformHighlights.map(source => (
            <div key={source.id} className="source-card glass-card">
              <div className="source-card-name" style={{ fontSize: "var(--text-body)", fontWeight: 800 }}>{locale === "th" ? source.nameTh : source.nameEn}</div>
              <div className="source-card-desc" style={{ marginBottom: ".5rem" }}>
                {translate(locale, { en: source.descEn, th: source.descTh, zh: platformHighlightZh[source.id] ?? source.descEn })}
              </div>
              <div style={{ fontSize: "var(--text-body)", color: "var(--2)" }}>
                {translate(locale, { en: `Mapped endpoint · ${source.frequency}`, th: `ปลายทางที่แม็ปไว้ · ${source.frequency}`, zh: `已映射端点 · ${source.frequency}` })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BASELINE PROGRAM ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Baseline Program", "โครงการข้อมูลพื้นฐาน", "基线项目")}</p>
        <h2>{t("depa's seven dimensions, measured from source", "7 มิติตาม depa วัดจากแหล่งข้อมูลจริง", "depa 七个维度，全部来自公开数据")}</h2>
        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          {translate(locale, {
            en: "The pillar model above is the index. The baseline program is a separate, parallel measurement of the same 118 cities: it re-bases onto depa's own seven dimensions — Environment, Mobility, Living, People, Energy, Economy, Governance — and derives every score from published data instead of hand-assigned values. It exists so a city can open one page, see where its province stands against the country on measures that actually exist, and use that as a reference point without commissioning a new study.",
            th: "แบบจำลองเสาหลักข้างบนคือดัชนี ส่วนโครงการข้อมูลพื้นฐานเป็นการวัดคู่ขนานของเมืองชุดเดียวกัน โดยย้ายกลับไปใช้ 7 มิติตาม depa เอง คือ สิ่งแวดล้อม การเดินทาง การดำรงชีวิต พลเมือง พลังงาน เศรษฐกิจ และการบริหาร และคำนวณคะแนนทุกตัวจากข้อมูลที่เผยแพร่ ไม่ใช่การประเมินด้วยสายตา เพื่อให้เมืองเปิดหน้าเดียวเห็นว่าตัวเองอยู่ตรงไหนเทียบกับทั้งประเทศ ในตัวชี้วัดที่มีอยู่จริง และใช้เป็นจุดอ้างอิงได้โดยไม่ต้องจ้างงานวิจัยใหม่",
            zh: "上面的支柱模型是本指数。基线项目则是对同一批 118 个城市的并行测量：它回归 depa 自身的七个维度——环境、出行、生活、市民、能源、经济、治理——每一个分数都由已公开的数据推导而来，而不是人工赋值。它的目的是让一座城市打开一个页面，就能看到自己的省份在全国的真实可比位置上，并把它当作参照点，而不必另行委托研究。",
          })}
        </p>

        <div className="meth-baseline-rows">
          {baselineDimensionRows.map(row => {
            const isGap = row.defs.length === 0;
            return (
              <div key={row.dim} className={`meth-baseline-row${isGap ? " is-gap" : ""}`}>
                <span className="meth-baseline-name">{DIMENSION_LABELS[row.dim][locale]}</span>
                <span className="meth-baseline-weight">{row.weight}%</span>
                <span className="meth-baseline-coverage">
                  {isGap
                    ? t("no data", "ไม่มีข้อมูล", "无数据")
                    : `${row.scored} / ${row.total}`}
                </span>
                <span className="meth-baseline-indicators">
                  {isGap
                    ? BASELINE_COVERAGE[row.dim].note
                    : row.defs.map(d => d.label[locale]).join(" · ")}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginTop: "1.25rem" }}>
          {translate(locale, {
            en: `${baselineGapDimensions.length} of depa's seven dimensions have no baseline at all — ${baselineGapNames("en")}. They have no province-level source that can be downloaded, reproduced and cited, so they are published as named gaps rather than filled with an estimate. Where a dimension cannot be measured the score is null, never zero — and every row reports the share of the published weight that actually rests on observations, between ${baselineCoverageRange.min}% and ${baselineCoverageRange.max}% depending on the city, instead of quietly renormalising over the dimensions it can see. ${baselineScoredCities} of the 7 dimensions are measured today, covering at least ${baselineCoverageFloor} of the 118 cities.`,
            th: `${baselineGapDimensions.length} มิติในเจ็ดมิติของ depa ยังไม่มีข้อมูลพื้นฐานเลย — ${baselineGapNames("th")} ไม่มีแหล่งข้อมูลระดับจังหวัดที่ดาวน์โหลด ทำซ้ำ และอ้างอิงได้ จึงประกาศเป็นช่องว่างที่มีชื่อ แทนที่จะเดาค่ามาแทน เมื่อมิติใดวัดไม่ได้ คะแนนจะเป็น null ไม่ใช่ศูนย์ และทุกแถวจะรายงานสัดส่วนน้ำหนักที่ประกาศไว้ซึ่งมีข้อมูลจริงรองรับ ระหว่าง ${baselineCoverageRange.min}% ถึง ${baselineCoverageRange.max}% ขึ้นอยู่กับเมือง แทนการปรับสัดส่วนเงียบ ๆ เฉพาะมิติที่มองเห็น ปัจจุบันวัดได้ ${baselineScoredCities} จาก 7 มิติ ครอบคลุมอย่างน้อย ${baselineCoverageFloor} จาก 118 เมือง`,
            zh: `depa 七个维度中有 ${baselineGapDimensions.length} 个完全没有基线 —— ${baselineGapNames("zh")}。它们没有任何可下载、可复现、可引用的省级来源，因此被作为「有名字的缺口」公布，而不是用估算填满。凡是无法测量的维度，得分为 null，绝不是 0；每一行都报告实际有观测支撑的公布权重份额（依城市而异，为 ${baselineCoverageRange.min}%–${baselineCoverageRange.max}%），而不是悄悄在能看见的维度上重新归一。今天 7 个维度中有 ${baselineScoredCities} 个可测，至少覆盖 118 座城市中的 ${baselineCoverageFloor} 座。`,
          })}
        </p>

        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginTop: ".75rem", maxWidth: "65ch" }}>
          {translate(locale, {
            en: "One provenance note worth stating plainly: the NSO ICT household survey's province table carries a single value column that holds population up to the 2565Q4 vintage and internet users from 2566Q1 onward. The baseline reads the population at 2565Q4 and the users at 2566Q1, and both resulting rates reproduce NSO's own published penetration figure to within 0.08 and 0.00 percentage points.",
            th: "ข้อควรระบุเรื่องที่มาของข้อมูล: ตารางจังหวัดของสำรวจ ICT ในครัวเรือน สสช. มีคอลัมน์ค่าเพียงคอลัมน์เดียว ซึ่งเก็บจำนวนประชากรถึงไตรมาส 4/2565 แล้วเปลี่ยนเป็นจำนวนผู้ใช้อินเทอร์เน็ตตั้งแต่ไตรมาส 1/2566 ข้อมูลพื้นฐานจึงอ่านประชากรที่ไตรมาส 4/2565 และผู้ใช้ที่ไตรมาส 1/2566 และอัตราที่ได้ทั้งสองรูปแบบตรงกับอัตราการใช้งานที่ สสช. เผยแพร่เองภายใน 0.08 และ 0.00 ร้อยละ",
            zh: "有一项溯源说明值得直说：泰国国家统计局家庭 ICT 调查的省级表只有一个数值列，2565Q4 之前存的是人口，2566Q1 起存的是网民数。基线因此在 2565Q4 读取人口、在 2566Q1 读取用户，两个口径算出的普及率与统计局自己公布的普及率相差不超过 0.08 与 0.00 个百分点。",
          })}
        </p>

        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginTop: ".75rem", maxWidth: "65ch" }}>
          {translate(locale, {
            en: "A second provenance note: the environment dimension's two province series come from two other publishers. PM2.5 is the Pollution Control Department's 2024 annual average per monitoring station — the source publishes stations, not province totals, so the province figure is the mean of its stations' annual averages, and every station value is stored beside it so the mean can be checked by hand. Forest cover is the Royal Forest Department's 2021 province statistics, read from the Thai column: the file's English column is a stale, shifted list and is deliberately ignored. Three provinces record no forest area at all, and that is a verified zero, not a gap.",
            th: "ข้อควรระบุเรื่องที่มาของข้อมูลอีกข้อ: สองชุดข้อมูลระดับจังหวัดของมิติสิ่งแวดล้อมมาจากหน่วยงานอื่นอีกสองแห่ง PM2.5 คือค่าเฉลี่ยรายปี 2567 รายสถานีตรวจวัดของกรมควบคุมมลพิษ แหล่งข้อมูลนี้เผยแพร่รายสถานี ไม่ใช่ยอดรวมรายจังหวัด ค่าระดับจังหวัดจึงเป็นค่าเฉลี่ยของค่าเฉลี่ยรายสถานีในจังหวัดนั้น และเก็บค่าของทุกสถานีไว้ข้าง ๆ เพื่อให้ตรวจสอบด้วยมือ ส่วนสัดส่วนพื้นที่ป่าเป็นสถิติรายจังหวัดปี 2564 ของกรมป่าไม้ อ่านจากคอลัมน์ภาษาไทย เพราะคอลัมน์ภาษาอังกฤษในไฟล์เป็นรายการจังหวัดรุ่นเก่าที่เลื่อนตำแหน่งแล้ว จึงถูกข้ามไปโดยเจตนา สามจังหวัดไม่มีพื้นที่ป่าเลย ซึ่งเป็นศูนย์ที่ตรวจสอบแล้ว ไม่ใช่ข้อมูลที่ขาดหาย",
            zh: "第二条溯源说明：环境维度的两套省级系列来自另外两家发布机构。PM2.5 是泰国污染控制厅 2024 年的逐监测站年均值——该来源发布的是监测站而非省份合计，因此省级数值是本省各站年均值的平均，且每个站点数值都与其一同保存，可手工复核。森林覆盖率是泰国皇家林业厅 2021 年的省级统计，读自泰文列——该文件的英文列是一份陈旧且错位的清单，故被有意忽略。有三个省份完全没有森林面积，这是经过核实的零值，而非数据缺失。",
          })}
        </p>

        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginTop: ".75rem", maxWidth: "65ch" }}>
          {translate(locale, {
            en: `A third provenance note, on Smart Mobility. The score comes from Thailand's integrated road-traffic death registry, which merges the police, hospital and insurance registers into one record per road death. Each death is attributed to the province where the crash happened — the file also carries the victim's home province, and the baseline does not use it, because a crash in Phayao that kills a Khon Kaen resident belongs to Phayao's road-safety record. The 2025 file is the latest complete year; the 2026 file holds only January to March. The rate divides those deaths by the same NSO province population every other rate in the baseline uses. In this stored snapshot, the national screening rate is ${baselineRoadSafety.national.toFixed(1)} per 100,000; ${baselineRoadSafety.bestName.en} has the lowest provincial rate at ${baselineRoadSafety.best.rate.toFixed(1)}. Source periods can differ. The 5-per-100,000 scoring anchor is a SCITI research choice. WHO's global goal is a 50% reduction in road deaths and injuries by 2030, not a uniform rate of 5.`,
            th: `ข้อควรระบุเรื่องที่มาของข้อมูลอีกข้อ เรื่องมิติการเดินทาง คะแนนมาจากระบบบูรณาการข้อมูลการตายจากอุบัติเหตุทางถนนของไทย ซึ่งรวมข้อมูลจากตำรวจ โรงพยาบาล และบริษัทประกัน เป็นหนึ่งระเบียนต่อหนึ่งการเสียชีวิต แต่ละรายการถูกจัดสรรให้จังหวัดที่เกิดอุบัติเหตุ ไม่ใช่จังหวัดที่ผู้เสียชีวิตอาศัยอยู่ เพราะอุบัติเหตุที่เกิดในจังหวัดพะเยาและคร่าชีวิตผู้อยู่อาศัยในจังหวัดขอนแก่น ควรบันทึกอยู่ในบันทึกความปลอดภัยทางถนนของจังหวัดพะเยา ไฟล์ปี 2025 เป็นปีล่าสุดที่สมบูรณ์ ไฟล์ปี 2026 มีเพียงมกราคมถึงมีนาคม อัตราคำนวณจากการเสียชีวิตหารด้วยประชากรจังหวัดของ สสช. ชุดเดียวกับที่ใช้ในทุกอัตราของระบบนี้ ในข้อมูลฉบับนี้ อัตราสำหรับคัดกรองระดับประเทศอยู่ที่ ${baselineRoadSafety.national.toFixed(1)} รายต่อแสนคน และ${baselineRoadSafety.bestName.th}มีอัตราระดับจังหวัดต่ำสุดที่ ${baselineRoadSafety.best.rate.toFixed(1)} ช่วงเวลาของแหล่งข้อมูลอาจต่างกัน ค่าอ้างอิง 5 รายต่อแสนคนเป็นทางเลือกในการให้คะแนนของ SCITI ส่วนเป้าหมายระดับโลกของ WHO คือลดการเสียชีวิตและบาดเจ็บทางถนนลง 50% ภายในปี 2030 ไม่ใช่อัตรา 5 รายที่ใช้เหมือนกันทุกแห่ง`,
            zh: `第三条溯源说明，关于智慧出行维度。得分来自泰国道路死亡综合登记系统，该系统把警方、医院与保险三方记录合并为每起道路死亡一条记录。每条死亡都归属到事故发生地所在省份——文件同时载有死者登记住址所在省份，而基线不使用后者：发生在帕夭州、导致孔敬府居民身亡的事故，应计入帕夭州的道路安全记录。2025 年文件是最近一个完整年度；2026 年文件只有 1 月至 3 月。该比率以每条基线比率所用的同一份统计局省份人口为分母。在本存储快照中，全国筛选比率为每十万人 ${baselineRoadSafety.national.toFixed(1)} 例，最低的省级比率为${baselineRoadSafety.bestName.zh}的 ${baselineRoadSafety.best.rate.toFixed(1)} 例。来源时期可能不同。每十万人 5 例是 SCITI 选择的评分参照；WHO 的全球目标是到 2030 年将道路死亡和伤害减少 50%，并非统一的每十万人 5 例。`,
          })}
          {" "}<a href="https://www.who.int/teams/social-determinants-of-health/safety-and-mobility/decade-of-action-for-road-safety-2021-2030/" target="_blank" rel="noreferrer">{translate(locale, { en: "WHO Global Plan for Road Safety ↗", th: "แผนความปลอดภัยทางถนนระดับโลกของ WHO ↗", zh: "WHO 全球道路安全计划 ↗" })}</a>
        </p>

        <p style={{ marginTop: "1rem" }}>
          <a
            href="/baseline"
            className="ghost-button"
            onClick={e => { e.preventDefault(); onNavigate("/baseline"); }}
          >
            {t("Open the baseline", "เปิดดูข้อมูลพื้นฐาน", "打开基线")}
          </a>
        </p>
      </section>

      {/* ─── AUDIT RULES ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Audit Rules", "กฎการตรวจสอบ", "审计规则")}</p>
        <h2>{t("What the method does not do", "สิ่งที่วิธีนี้ไม่ทำ", "本方法不做什么")}</h2>
        <div className="sources-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="source-card glass-card">
            <div className="source-card-name">{t("No hidden smoothing", "ไม่มีการไล่ค่าแบบซ่อน", "没有隐藏平滑")}</div>
            <div className="source-card-desc">
              {t("Composite math does not include secret caps, bespoke city bonuses, or prestige multipliers.", "คณิตศาสตร์ของคะแนนรวมไม่มีเพดานลับ โบนัสเฉพาะเมือง หรือคูณชื่อเสียง", "综合分数学中不存在秘密上限、特定城市加成或声望倍增器。")}
            </div>
          </div>
          <div className="source-card glass-card">
            <div className="source-card-name">{t("No one-feed automation myth", "ไม่มีมายาคติ API เส้นเดียว", "没有单一数据流神话")}</div>
            <div className="source-card-desc">
              {translate(locale, {
                en: `The repo tracks ${CORE_METRIC_KEYS.length} core indicators and ${EXTENDED_METRIC_KEYS.length} extended indicators. That is not the same as claiming a single normalization pipeline can fully explain urban life.`,
                th: `รีโปติดตามตัวชี้วัดหลัก ${CORE_METRIC_KEYS.length} ตัว และเสริม ${EXTENDED_METRIC_KEYS.length} ตัว นั่นไม่ใช่การอ้างว่า pipeline เดียวอธิบายชีวิตเมืองได้ครบ`,
                zh: `本仓库跟踪 ${CORE_METRIC_KEYS.length} 个核心指标和 ${EXTENDED_METRIC_KEYS.length} 个扩展指标，但这并不等于声称一条流水线就能完整解释城市生活。`,
              })}
            </div>
          </div>
          <div className="source-card glass-card">
            <div className="source-card-name">{t("No stale-date theater", "ไม่มีละครวันที่ลวงตา", "没有伪装时效的戏法")}</div>
            <div className="source-card-desc">
              {translate(locale, {
                en: `Freshness is evaluated against the fixed release cut-off of ${formatIsoDate(SCITI_DATA_CUTOFF_ISO)}. Scores reflect conditions at the time of assessment, not a promise about what happened after.`,
                th: `ความสดใหม่ประเมินเทียบกับวันตัดข้อมูล ${formatIsoDate(SCITI_DATA_CUTOFF_ISO)} คะแนนสะท้อนสภาพ ณ เวลาประเมิน ไม่ใช่คำสัญญาหลังเผยแพร่`,
                zh: `新鲜度是相对于固定发布截点 ${formatIsoDate(SCITI_DATA_CUTOFF_ISO)} 评估的。分数反映评估时状态，不是出版后的承诺。`,
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CREATIVE ECONOMY METHODOLOGY ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Cultural & economic context", "บริบทวัฒนธรรมและเศรษฐกิจ", "文化与经济背景")}</p>
        <h2>{t("Culture, talent and economic indicators", "ตัวชี้วัดวัฒนธรรม บุคลากร และเศรษฐกิจ", "文化、人才与经济指标")}</h2>
        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginBottom: "2rem" }}>
          {translate(locale, {
            en: "SCITI's creative economy indicators are constructed from multiple validated sources and follow the UNESCO Culture|2030 Indicators framework across four thematic dimensions.",
            th: "ตัวชี้วัดเศรษฐกิจสร้างสรรค์ของ SCITI สร้างขึ้นจากแหล่งข้อมูลที่ผ่านการตรวจสอบหลายแหล่ง และทำตามกรอบตัวชี้วัด UNESCO Culture|2030 ในสี่มิติหลัก",
            zh: "SCITI的创意经济指标由多个经验证的数据源构建，并遵循联合国教科文组织文化|2030指标框架的四个主题维度。",
          })}
        </p>

        <h3 style={{ fontSize: "var(--text-body)", marginBottom: "1rem" }}>{t("The Moneyball Score: Composite", "คะแนน Moneyball: การคำนวณรวม", "Moneyball评分：综合计算")}</h3>
        <p style={{ fontSize: "var(--text-body)", color: "var(--3)", lineHeight: 1.6, marginBottom: "1rem", borderLeft: "2px solid var(--5, #E5E5E5)", paddingLeft: "0.75rem" }}>
          {translate(locale, {
            en: "Note: the SCITI index score is the 7-pillar composite described above. The Moneyball Score below is a separate, downloadable investment analysis built on top of the index — it is not the index score itself.",
            th: "หมายเหตุ: คะแนนดัชนี SCITI คือคะแนนรวม 7 เสาหลักที่อธิบายไว้ด้านบน คะแนน Moneyball ด้านล่างเป็นการวิเคราะห์เพื่อการลงทุนแบบดาวน์โหลดแยกต่างหากที่สร้างต่อยอดจากดัชนี ไม่ใช่คะแนนดัชนี",
            zh: "注：SCITI 指数得分是上文所述的七支柱综合分。下方的 Moneyball 评分是基于该指数构建的独立可下载投资分析，并非指数得分本身。",
          })}
        </p>
        <p style={{ fontSize: "var(--text-body)", color: "var(--2)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {translate(locale, {
            en: "The SCITI Moneyball Score is a weighted composite index calculated as follows:",
            th: "คะแนน SCITI Moneyball เป็นดัชนีชี้วัดแบบถ่วงน้ำหนักที่คำนวณดังนี้:",
            zh: "SCITI Moneyball评分是一个加权综合指数，计算如下：",
          })}
        </p>
        <ul style={{ listStyle: "decimal", paddingLeft: "2rem", marginBottom: "2rem", color: "var(--2)", fontSize: "var(--text-body)" }}>
          <li style={{ marginBottom: "0.5rem" }}><strong>{t("GPP Growth Potential (30%)", "ศักยภาพการเติบโต GPP (30%)", "GPP增长潜力 (30%)")}</strong> — {t("GPP/capita relative to regional average", "GPP ต่อหัวเทียบกับค่าเฉลี่ยภูมิภาค", "相对于区域平均水平的人均GPP")}</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>{t("Cost Advantage (25%)", "ข้อได้เปรียบด้านต้นทุน (25%)", "成本优势 (25%)")}</strong> — {t("Inverse ranking of minimum wage tier", "อันดับผกผันของอัตราค่าจ้างขั้นต่ำ", "最低工资等级的反向排名")}</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>{t("Infrastructure Readiness (20%)", "ความพร้อมของโครงสร้างพื้นฐาน (20%)", "基础设施就绪度 (20%)")}</strong> — {t("Binary scoring across 6 dimensions (airport, rail, port, highway, 5G, university)", "การให้คะแนนแบบทวิวิภาคใน 6 มิติ (สนามบิน รถไฟ ท่าเรือ ทางหลวง 5G มหาวิทยาลัย)", "跨6个维度的二元评分 (机场、铁路、港口、高速公路、5G、大学)")}</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>{t("Creative/Talent Index (15%)", "ดัชนีสร้างสรรค์และบุคลากร (15%)", "创意/人才指数 (15%)")}</strong> — {t("University students, UNESCO City status, CEA district, festival economy", "นักศึกษามหาวิทยาลัย สถานะเมืองยูเนสโก เขต CEA เศรษฐกิจเทศกาล", "大学生人数、联合国教科文组织城市地位、CEA街区、节日经济")}</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>{t("Policy Support (10%)", "การสนับสนุนทางนโยบาย (10%)", "政策支持 (10%)")}</strong> — {t("BOI zone classification (EEC, SEZ, Corridors)", "การจัดกลุ่มเขต BOI (EEC, SEZ, ระเบียงเศรษฐกิจ)", "BOI区域分类 (EEC, SEZ, 经济走廊)")}</li>
        </ul>
        <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "2rem" }}>
          {translate(locale, {
            en: "Scores are normalized to a 0-10 scale. >7.5 is \"Strong Buy\" (Tier 1), 6.5-7.5 is \"Buy\" (Tier 2), and <6.5 is \"Emerging\" (Tier 3).",
            th: "คะแนนถูกปรับให้เป็นสเกล 0-10 >7.5 คือ \"ซื้อแข็งแกร่ง\" (กลุ่ม 1), 6.5-7.5 คือ \"ซื้อ\" (กลุ่ม 2) และ <6.5 คือ \"ตลาดเกิดใหม่\" (กลุ่ม 3)",
            zh: "分数标准化为0-10分制。>7.5 为“强力推荐”（第一梯队），6.5-7.5 为“推荐”（第二梯队），<6.5 为“新兴”（第三梯队）。",
          })}
        </p>

        <h3 style={{ fontSize: "var(--text-body)", marginBottom: "1rem" }}>{t("Limitations & Transparency", "ข้อจำกัดและความโปร่งใส", "局限性与透明度")}</h3>
        <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", color: "var(--3)", fontSize: "var(--text-body)" }}>
          <li style={{ marginBottom: "0.5rem", listStyleType: "square" }}>{translate(locale, {
            en: "GPP data reflects 2019 chain-volume measures and may not capture post-pandemic recovery dynamics in real time.",
            th: "ข้อมูล GPP สะท้อนมูลค่า ณ ราคาปี 62 และอาจไม่สามารถจับทิศทางการฟื้นตัวหลังโรคระบาดแบบเรียลไทม์ได้",
            zh: "GPP数据反映的是2019年的环比物量测算，可能无法实时反映疫情后的复苏动态。",
          })}</li>
          <li style={{ marginBottom: "0.5rem", listStyleType: "square" }}>{translate(locale, {
            en: "Creative economy employment data at provincial level is estimated from national samples and should be treated as directional.",
            th: "ข้อมูลการจ้างงานเศรษฐกิจสร้างสรรค์ระดับจังหวัดถูกประเมินจากกลุ่มตัวอย่างระดับชาติและควรใช้เป็นเพียงทิศทาง",
            zh: "省级层面的创意经济就业数据是根据全国样本估算的，应作为方向性参考。",
          })}</li>
          <li style={{ marginBottom: "0.5rem", listStyleType: "square" }}>{translate(locale, {
            en: "Digital infrastructure coverage is based on operator-reported data, not independent measurement.",
            th: "ความครอบคลุมของโครงสร้างพื้นฐานดิจิทัลอิงตามข้อมูลที่ผู้ให้บริการรายงาน ไม่ใช่การวัดที่เป็นอิสระ",
            zh: "数字基础设施的覆盖范围是基于运营商报告的数据，而非独立测量。",
          })}</li>
          <li style={{ marginBottom: "0.5rem", listStyleType: "square" }}>{translate(locale, {
            en: "Cultural heritage asset inventory is incomplete; SCITI catalogs major registered sites but does not claim comprehensive coverage.",
            th: "บัญชีสินทรัพย์มรดกทางวัฒนธรรมยังไม่สมบูรณ์ SCITI จัดทำแคตตาล็อกสถานที่จดทะเบียนหลัก แต่ไม่ครอบคลุมทั้งหมด",
            zh: "文化遗产资产清单尚不完整；SCITI 收录了主要的注册遗址，但不代表全面覆盖。",
          })}</li>
        </ul>
      </section>

      {/* ─── DOWNLOADS ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Downloads", "ดาวน์โหลด", "下载")}</p>
        <h2>{t("Method paper and source", "เอกสารวิธีวิจัยและต้นฉบับ", "方法论文与源文件")}</h2>
        <p className="hero-strapline" style={{ maxWidth: "56rem" }}>
          {t(
            "The downloadable paper is the same audited methodology now used on this page. The source is included so the paper can be inspected, updated, and regenerated directly from the repo.",
            "เอกสารที่ดาวน์โหลดได้คือวิธีวิจัยฉบับตรวจสอบเดียวกับที่ใช้บนหน้านี้ มีไฟล์ต้นฉบับให้ตรวจ แก้ และสร้างใหม่ได้ตรงจากรีโป",
            "可下载的论文与本页使用的是同一份审计后方法文本，并附源文件以便从仓库直接审阅和更新。",
          )}
        </p>
        <div className="export-docs" style={{ marginTop: "1rem" }}>
          <a href={assetUrl("/downloads/SCITI-2026-Methodology.pdf")} download className="export-doc-link">
            {t("Methodology Paper (PDF)", "เอกสารระเบียบวิธี (PDF)", "方法论文（PDF）")}
          </a>
          <a href={assetUrl("/downloads/SCITI-2026-Methodology.html")} download className="export-doc-link">
            {t("Methodology Source (HTML)", "Methodology Source (HTML)", "方法源文件（HTML）")}
          </a>
          <a href={assetUrl("/downloads/SCITI-2026-cities-dataset.csv")} download className="export-doc-link">
            {t("City Dataset (CSV, 118 cities)", "ชุดข้อมูลเมือง (CSV, 118 เมือง)", "城市数据集（CSV，118城市）")}
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="export-doc-link">
            {t("Source code (GitHub)", "Source code (GitHub)", "源代码（GitHub）")}
          </a>
        </div>
      </section>

    </div>
  );
}
