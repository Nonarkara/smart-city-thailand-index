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
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_WEIGHTS } from "./types";
import { translate } from "./cityPresentation";
import { assetUrl } from "./mediaAssets";

interface Props {
  locale: Locale;
}

type TriLingual = { en: string; th: string; zh: string };

const pillarDescriptions: Record<ScoringPillar, TriLingual & { signals: TriLingual[] }> = {
  livability: {
    en: "Daily urban function: housing, transit, utilities, and whether routine life works without heroic effort.",
    th: "การทำงานของเมืองในชีวิตประจำวัน: ที่อยู่อาศัย การเดินทาง สาธารณูปโภค และชีวิตประจำวันที่ไม่ต้องใช้ความพยายามเกินปกติ",
    zh: "日常城市功能：住房、出行、公用事业，以及普通生活是否能正常运转。",
    signals: [
      { en: "Housing and affordability", th: "ที่อยู่อาศัยและความสามารถในการจ่าย", zh: "住房与可负担性" },
      { en: "Transit access", th: "การเข้าถึงขนส่ง", zh: "交通可达性" },
      { en: "Infrastructure reliability", th: "ความเชื่อถือได้ของโครงสร้างพื้นฐาน", zh: "基础设施可靠性" },
      { en: "Utility continuity", th: "ความต่อเนื่องของสาธารณูปโภค", zh: "公共服务连续性" },
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
    en: "The city's constraint stack: crime exposure, emergency readiness, and whether daily movement feels secure.",
    th: "ชุดข้อจำกัดของเมือง: ความเสี่ยงอาชญากรรม ความพร้อมฉุกเฉิน และการเดินทางในชีวิตจริงรู้สึกปลอดภัยหรือไม่",
    zh: "城市的约束栈：犯罪暴露、应急响应，以及日常出行是否让人感到安全。",
    signals: [
      { en: "Crime per 100K", th: "อาชญากรรมต่อแสนคน", zh: "每十万人犯罪率" },
      { en: "Emergency response proxies", th: "ตัวแทนการตอบสนองฉุกเฉิน", zh: "应急响应代理指标" },
      { en: "Disaster preparedness", th: "ความพร้อมรับภัยพิบัติ", zh: "灾害准备度" },
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
    en: "Environmental stress and resilience: air, water, green coverage, and whether the ecological baseline supports healthy urban life.",
    th: "ความกดดันและความยืดหยุ่นด้านสิ่งแวดล้อม: อากาศ น้ำ พื้นที่สีเขียว และฐานนิเวศรองรับชีวิตเมืองที่ดีหรือไม่",
    zh: "环境压力与韧性：空气、水、绿地，以及生态底盘是否支撑健康的城市生活。",
    signals: [
      { en: "Annual PM2.5", th: "PM2.5 รายปี", zh: "年均 PM2.5" },
      { en: "Water quality", th: "คุณภาพน้ำ", zh: "水质" },
      { en: "Green and forest coverage", th: "พื้นที่สีเขียวและป่าไม้", zh: "绿地与森林覆盖" },
      { en: "Observed environmental trajectory", th: "ทิศทางสิ่งแวดล้อมที่สังเกตได้", zh: "可观察的环境趋势" },
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
    { id: "sources", label: t("18+ Sources", "18+ แหล่งข้อมูล", "18+ 数据源"), sub: t("NSO · NESDC · PCD · GISTDA…", "NSO · NESDC · PCD · GISTDA…", "NSO · NESDC · PCD · GISTDA…"), x: 20, color: "#0D9488" },
    { id: "research", label: t("Research Layer", "ชั้นวิจัย", "研究层"), sub: t("7 pillars · field verification", "7 เสาหลัก · ยืนยันภาคสนาม", "7 支柱 · 实地核验"), x: 200, color: "#D97706" },
    { id: "math", label: t("Math Layer", "ชั้นคณิตศาสตร์", "数学层"), sub: t("Weighted sum · deterministic", "ผลรวมถ่วงน้ำหนัก · กำหนดแน่นอน", "加权求和 · 确定性"), x: 380, color: "#3B82F6" },
    { id: "output", label: t("Score + Tier", "คะแนน + ระดับ", "得分 + 层级"), sub: t("0–100 · α β γ", "0–100 · α β γ", "0–100 · α β γ"), x: 560, color: "#6366F1" },
  ];

  return (
    <svg viewBox="0 0 760 100" className="methodology-flow-svg" aria-label={t("Data flow diagram", "แผนภาพการไหลของข้อมูล", "数据流向图")}>
      {boxes.map((box, i) => (
        <g key={box.id}>
          <rect x={box.x} y={10} width={155} height={72} fill="var(--surface)" stroke={box.color} strokeWidth="1.5" rx="0" />
          <text x={box.x + 12} y={33} fontFamily="var(--mono)" fontSize="8" fontWeight="700" fill={box.color} letterSpacing="0.08em">{box.label.toUpperCase()}</text>
          <text x={box.x + 12} y={52} fontFamily="var(--font)" fontSize="8" fill="var(--2)">{box.sub}</text>
          {i < boxes.length - 1 && (
            <>
              <line x1={box.x + 157} y1={46} x2={box.x + 175} y2={46} stroke="var(--4)" strokeWidth="1" />
              <polygon points={`${box.x + 175},41 ${box.x + 183},46 ${box.x + 175},51`} fill="var(--4)" />
            </>
          )}
        </g>
      ))}
      <text x={20} y={97} fontFamily="var(--mono)" fontSize="7" fill="var(--3)" letterSpacing="0.05em">
        {t("Research judgment is applied in the first step only. Everything after is deterministic mathematics.", "วิจารณญาณวิจัยใช้ในขั้นแรกเท่านั้น ที่เหลือเป็นคณิตศาสตร์กำหนดแน่นอน", "研究判断仅用于第一步，此后全为确定性数学。")}
      </text>
    </svg>
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
  }));

  return (
    <svg viewBox="0 0 760 80" className="methodology-flow-svg" aria-label={t("Composite formula diagram", "แผนภาพสูตรคะแนนรวม", "综合分公式图")}>
      <text x={10} y={18} fontFamily="var(--mono)" fontSize="8" fontWeight="700" fill="var(--3)" letterSpacing="0.1em">{t("COMPOSITE", "คะแนนรวม", "综合分")}</text>
      <text x={100} y={18} fontFamily="var(--mono)" fontSize="8" fill="var(--3)"> = (</text>
      {pillars.map((p, i) => {
        const xBase = 122 + i * 89;
        return (
          <g key={p.name}>
            <rect x={xBase} y={5} width={82} height={22} fill="var(--surface)" stroke={p.color} strokeWidth="1" rx="0" />
            <text x={xBase + 8} y={20} fontFamily="var(--mono)" fontSize="9" fontWeight="700" fill={p.color}>{p.name}</text>
            <text x={xBase + 34} y={20} fontFamily="var(--mono)" fontSize="9" fill="var(--3)">×{p.weight}%</text>
            {i < pillars.length - 1 && (
              <text x={xBase + 84} y={20} fontFamily="var(--mono)" fontSize="9" fill="var(--3)"> +</text>
            )}
          </g>
        );
      })}
      <text x={746} y={18} fontFamily="var(--mono)" fontSize="8" fill="var(--3)">)</text>
      <text x={10} y={48} fontFamily="var(--mono)" fontSize="7.5" fill="var(--2)">
        {t("÷ 100 → round to 0.1 → assign tier (α≥65 / β≥45 / γ<45)", "÷ 100 → ปัดหนึ่งตำแหน่ง → จัดระดับ (α≥65 / β≥45 / γ<45)", "÷ 100 → 保留一位小数 → 分配层级 (α≥65 / β≥45 / γ<45)")}
      </text>
      <text x={10} y={68} fontFamily="var(--font)" fontSize="7.5" fill="var(--3)">
        {t("Weights are fixed and public. The research team cannot adjust them per city.", "น้ำหนักคงที่และเปิดเผย ทีมวิจัยปรับไม่ได้ตามเมือง", "权重固定且公开，研究团队不能按城市调整。")}
      </text>
    </svg>
  );
}

const GITHUB_URL = "https://github.com/Nonarkara/smart-city-thailand-index";

export default function MethodologyPage({ locale }: Props) {
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
            "SCITI is a two-layer model. Research assigns seven pillar scores from auditable metrics, evidence items, and field verification. Deterministic mathematics then aggregates those pillar scores into a composite, tier, and contribution breakdown.",
            "SCITI เป็นโมเดลสองชั้น งานวิจัยกำหนดคะแนน 7 เสาหลักจากตัวชี้วัดที่ตรวจสอบได้ หลักฐาน และการยืนยันภาคสนาม จากนั้นคณิตศาสตร์แบบกำหนดแน่นอนจะรวมคะแนนเหล่านั้นเป็นคะแนนรวม ระดับ และการแยกส่วนการมีส่วนร่วม",
            "SCITI 是一个双层模型。研究层先根据可审计指标、证据项与实地核验给出七个支柱分数；随后由确定性的数学层将这些分数汇总为综合分、层级和贡献分解。",
          )}
        </p>
      </section>

      {/* ─── VERSION JOURNEY ─── */}
      <section className="section reveal visible">
        <p className="eyebrow">{t("Version history", "ประวัติเวอร์ชัน", "版本历史")}</p>
        <h2>{t("From a LinkedIn rant to a Red Dot submission", "จากบ่นบน LinkedIn สู่การส่ง Red Dot", "从 LinkedIn 的一声抱怨到红点奖参赛作品")}</h2>
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
                en: "A LinkedIn post that said, simply: Thailand has certified 30 smart cities. Which of them actually work? No index. No scoring. Just the question — which turned out to be enough to start a conversation.",
                th: "โพสต์ LinkedIn ที่บอกตรงๆ ว่า ไทยรับรองเมืองอัจฉริยะ 30 แห่ง มีกี่แห่งที่เดินจริง? ไม่มีดัชนี ไม่มีคะแนน มีแค่คำถาม — ซึ่งปรากฏว่าพอแล้วสำหรับเริ่มต้นการสนทนา",
                zh: "一条 LinkedIn 帖子，直白地问：泰国认证了 30 座智慧城市，哪些真的在运转？没有指数，没有评分，只有这个问题——事实证明，这已经足以引发一场对话。",
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
                en: `118+ certified and promotion-zone cities. 7 pillars. A confidence model. Official depa certification data integrated from source PDFs. A live React app, not a slide. Submitted for the Red Dot Design Award 2026.`,
                th: `118+ เมืองรับรองและเขตส่งเสริม 7 เสาหลัก โมเดลความเชื่อมั่น รวมข้อมูลรับรองอย่างเป็นทางการจาก depa ผ่าน PDF ต้นฉบับ เป็น React app แบบสด ไม่ใช่สไลด์ ส่งเข้าประกวด Red Dot Design Award 2026`,
                zh: `118+ 座认证及推广城市，7 个支柱，置信模型，从官方 PDF 集成 depa 认证数据，是实时 React 应用而非幻灯片。已提交 2026 年红点设计奖。`,
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
              icon: "⚛",
              name: "React 19 + TypeScript",
              what: {
                en: "The interface layer. Every city card, pillar bar, and ranking list you see is a React component — a reusable block of logic and display. TypeScript means the data shapes are enforced: if a city's score field contains text instead of a number, the build fails.",
                th: "ชั้น interface ทุกการ์ดเมือง แถบเสาหลัก และลิสต์อันดับที่เห็นคือ React component — บล็อกของ logic และการแสดงผลที่ใช้ซ้ำได้ TypeScript ทำให้ตัวข้อมูลถูกบังคับ: ถ้าฟิลด์คะแนนของเมืองมีข้อความแทนตัวเลข build จะล้มเหลว",
                zh: "界面层。你看到的每个城市卡片、支柱条形图和排名列表都是 React 组件——可复用的逻辑与显示块。TypeScript 强制数据格式：如果城市分数字段包含文本而非数字，构建就会失败。",
              },
            },
            {
              icon: "📦",
              name: "Vite 6",
              what: {
                en: "The build tool. It bundles all the code and data into the fast static files you download when you open this page. The entire index deploys to GitHub Pages in under 2 seconds.",
                th: "เครื่องมือ build รวม code และข้อมูลทั้งหมดเป็นไฟล์สถิตที่เร็ว ซึ่งคุณดาวน์โหลดเมื่อเปิดหน้านี้ ทั้งดัชนีดีพลอยไปที่ GitHub Pages ในเวลาไม่ถึง 2 วินาที",
                zh: "构建工具。将所有代码和数据打包成快速的静态文件，就是你打开这个页面时下载的内容。整个索引部署到 GitHub Pages 不到 2 秒。",
              },
            },
            {
              icon: "📊",
              name: t("Data as TypeScript constants", "ข้อมูลเป็น TypeScript constants", "数据作为 TypeScript 常量"),
              what: {
                en: "No database. City scores live inside the code itself, in `src/cityData.ts`. This sounds weird until you realize it means the data is version-controlled, auditable by anyone with a browser, and impossible to update without a commit. A commit is a permanent public record.",
                th: "ไม่มีฐานข้อมูล คะแนนเมืองอยู่ใน code เอง ใน src/cityData.ts ฟังดูแปลก จนกว่าจะรู้ว่ามันหมายความว่าข้อมูลถูกควบคุมเวอร์ชัน ตรวจสอบได้โดยใครก็ตามที่มี browser และอัปเดตไม่ได้โดยไม่มี commit commit คือบันทึกสาธารณะถาวร",
                zh: "没有数据库。城市分数存在代码本身中，在 src/cityData.ts 里。这听起来奇怪，直到你意识到：这意味着数据有版本控制，任何有浏览器的人都可以审计，且不提交就无法更新。提交是永久的公开记录。",
              },
            },
            {
              icon: "🚀",
              name: "GitHub Pages + GitHub Actions",
              what: {
                en: "Every push to the main branch automatically deploys to the live URL. The CI pipeline builds the app, runs type checks, and publishes. No servers, no cloud bills, no DevOps team. Just a push.",
                th: "ทุก push ไปที่ main branch จะ deploy ไปยัง URL สดโดยอัตโนมัติ CI pipeline build app รันการตรวจสอบ type และเผยแพร่ ไม่มีเซิร์ฟเวอร์ ไม่มีค่า cloud ไม่มีทีม DevOps แค่ push",
                zh: "每次推送到主分支都会自动部署到实时 URL。CI 流水线构建应用、运行类型检查并发布。没有服务器，没有云账单，没有 DevOps 团队。只是一次推送。",
              },
            },
            {
              icon: "🎨",
              name: t("Zero CSS frameworks", "ไม่มี CSS framework", "零 CSS 框架"),
              what: {
                en: "No Tailwind, no Bootstrap, no shadcn. Every rule in `src/styles.css` was written by hand. Design tokens enforce zero border-radius, zero drop shadows, and a three-size typography rule site-wide — rules that an AI can accidentally break without a committed policy.",
                th: "ไม่มี Tailwind ไม่มี Bootstrap ไม่มี shadcn ทุก rule ใน src/styles.css เขียนด้วยมือ Design tokens บังคับให้ border-radius เป็นศูนย์ drop shadows เป็นศูนย์ และกฎ typography 3 ขนาดทั่วทั้งเว็บ — กฎที่ AI อาจทำเสียโดยไม่ตั้งใจโดยไม่มีนโยบายที่บันทึกไว้",
                zh: "没有 Tailwind，没有 Bootstrap，没有 shadcn。src/styles.css 中的每条规则都是手写的。设计令牌强制执行全站零 border-radius、零投影和三尺寸排版规则——这些规则在没有书面政策的情况下，AI 可能会不小心破坏。",
              },
            },
          ].map(item => (
            <div key={item.name} className="meth-stack-card">
              <div className="meth-stack-icon">{item.icon}</div>
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
      <section className="section reveal visible" style={{ marginTop: "2rem" }}>
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
              <div className="source-card-desc" style={{ fontSize: "var(--text-micro)", marginBottom: ".5rem" }}>
                {translate(locale, { en: source.descEn, th: source.descTh, zh: source.descZh })}
              </div>
              <div style={{ fontSize: "var(--text-micro)", color: "var(--2)" }}>
                {translate(locale, { en: `Frequency: ${source.updateFrequency}`, th: `ความถี่: ${source.updateFrequency}`, zh: `频率：${source.updateFrequency}` })}
              </div>
            </div>
          ))}
          {platformHighlights.map(source => (
            <div key={source.id} className="source-card glass-card">
              <div className="source-card-name" style={{ fontSize: "var(--text-body)", fontWeight: 800 }}>{locale === "th" ? source.nameTh : source.nameEn}</div>
              <div className="source-card-desc" style={{ fontSize: "var(--text-micro)", marginBottom: ".5rem" }}>
                {translate(locale, { en: source.descEn, th: source.descTh, zh: platformHighlightZh[source.id] ?? source.descEn })}
              </div>
              <div style={{ fontSize: "var(--text-micro)", color: "var(--2)" }}>
                {translate(locale, { en: `Mapped endpoint · ${source.frequency}`, th: `ปลายทางที่แม็ปไว้ · ${source.frequency}`, zh: `已映射端点 · ${source.frequency}` })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AUDIT RULES ─── */}
      <section className="section reveal visible" style={{ marginTop: "2rem" }}>
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

      {/* ─── DOWNLOADS ─── */}
      <section className="section reveal visible" style={{ marginTop: "2rem" }}>
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
            {t("Methodology Paper (PDF)", "Methodology Paper (PDF)", "方法论文（PDF）")}
          </a>
          <a href={assetUrl("/downloads/SCITI-2026-Methodology.html")} download className="export-doc-link">
            {t("Methodology Source (HTML)", "Methodology Source (HTML)", "方法源文件（HTML）")}
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="export-doc-link">
            {t("Source code (GitHub)", "Source code (GitHub)", "源代码（GitHub）")}
          </a>
        </div>
      </section>

    </div>
  );
}
