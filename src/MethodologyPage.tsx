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
    zh: "城市的约束栈：犯罪暴露、应急准备，以及日常出行是否让人感到安全。",
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

export default function MethodologyPage({ locale }: Props) {
  return (
    <div className="methodology-page">
      <section className="section methodology-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Methodology", th: "วิธีการ", zh: "方法论" })}</p>
        <h1 className="hero-title">
          {translate(locale, {
            en: "Scoring, evidence, and uncertainty",
            th: "คะแนน หลักฐาน และความไม่แน่นอน",
            zh: "评分、证据与不确定性",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "SCITI is a two-layer model. Research assigns seven pillar scores from auditable metrics, evidence items, and field verification. Deterministic mathematics then aggregates those pillar scores into a composite, tier, and contribution breakdown.",
            th: "SCITI เป็นโมเดลสองชั้น งานวิจัยกำหนดคะแนน 7 เสาหลักจากตัวชี้วัดที่ตรวจสอบได้ หลักฐาน และการยืนยันภาคสนาม จากนั้นคณิตศาสตร์แบบกำหนดแน่นอนจะรวมคะแนนเหล่านั้นเป็นคะแนนรวม ระดับ และการแยกส่วนการมีส่วนร่วม",
            zh: "SCITI 是一个双层模型。研究层先根据可审计指标、证据项与实地核验给出七个支柱分数；随后由确定性的数学层将这些分数汇总为综合分、层级和贡献分解。",
          })}
        </p>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Downloads", th: "ดาวน์โหลด", zh: "下载" })}</p>
        <h2>{translate(locale, { en: "Method paper and source", th: "เอกสารวิธีวิจัยและต้นฉบับ", zh: "方法论文与源文件" })}</h2>
        <p className="hero-strapline" style={{ maxWidth: "56rem" }}>
          {translate(locale, {
            en: "The downloadable paper is the same audited methodology now used on this page. The HTML source is included as a readable master so the paper can be inspected, updated, and regenerated directly from the repo.",
            th: "เอกสารที่ดาวน์โหลดได้คือวิธีวิจัยฉบับตรวจสอบเดียวกับที่ใช้บนหน้านี้ และมีไฟล์ HTML ต้นฉบับให้อ่านได้ เพื่อให้ตรวจ แก้ และสร้างเอกสารใหม่ได้ตรงจากรีโป",
            zh: "可下载的论文与本页使用的是同一份审计后方法文本。HTML 源文件也一并提供，便于直接从仓库中审阅、更新和重新生成论文。",
          })}
        </p>
        <div className="export-docs" style={{ marginTop: "1rem" }}>
          <a href={assetUrl("/downloads/SCITI-2026-Methodology.pdf")} download className="export-doc-link">
            {translate(locale, { en: "Methodology Paper (PDF)", th: "Methodology Paper (PDF)", zh: "方法论文（PDF）" })}
          </a>
          <a href={assetUrl("/downloads/SCITI-2026-Methodology.html")} download className="export-doc-link">
            {translate(locale, { en: "Methodology Source (HTML)", th: "Methodology Source (HTML)", zh: "方法源文件（HTML）" })}
          </a>
        </div>
      </section>

      <section className="section reveal stagger-1 visible">
        <div className="methodology-hud shadow-premium">
          <div className="hud-header">
            <span className="hud-dot" />
            <h2 className="hud-title">{translate(locale, { en: "Method Snapshot", th: "สรุปวิธีการ", zh: "方法快照" })}</h2>
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

      <section className="section reveal stagger-2 visible">
        <p className="eyebrow">{translate(locale, { en: "Pillar Model", th: "แบบจำลองเสาหลัก", zh: "支柱模型" })}</p>
        <h2>{translate(locale, { en: "Seven pillars, fixed weights", th: "7 เสาหลัก น้ำหนักคงที่", zh: "七个支柱，固定权重" })}</h2>

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

      <section className="section reveal stagger-3 visible">
        <p className="eyebrow">{translate(locale, { en: "Mathematics", th: "คณิตศาสตร์", zh: "数学" })}</p>
        <h2>{translate(locale, { en: "What the code computes exactly", th: "สิ่งที่โค้ดคำนวณแบบตรงตัว", zh: "代码究竟计算什么" })}</h2>
        <div className="threshold-hud glass-card shadow-heavy">
          <div className="threshold-row threshold-alpha">
            <span className="threshold-symbol">1</span>
            <div className="threshold-content">
              <span className="threshold-name">{translate(locale, { en: "Composite score", th: "คะแนนรวม", zh: "综合得分" })}</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: `Composite = (${SCORING_PILLARS.map(pillar => `${PILLAR_LABELS.en[pillar]} × ${PILLAR_WEIGHTS[pillar]}`).join(" + ")}) / 100`,
                  th: `คะแนนรวม = (${SCORING_PILLARS.map(pillar => `${PILLAR_LABELS.th[pillar]} × ${PILLAR_WEIGHTS[pillar]}`).join(" + ")}) / 100`,
                  zh: `综合分 = (${SCORING_PILLARS.map(pillar => `${PILLAR_LABELS.zh[pillar]} × ${PILLAR_WEIGHTS[pillar]}`).join(" + ")}) / 100`,
                })}
              </span>
            </div>
            <span className="threshold-range">{translate(locale, { en: "Rounded to 0.1", th: "ปัดถึง 0.1", zh: "保留到 0.1" })}</span>
          </div>
          <div className="threshold-row threshold-beta">
            <span className="threshold-symbol">2</span>
            <div className="threshold-content">
              <span className="threshold-name">{translate(locale, { en: "Confidence score", th: "คะแนนความเชื่อมั่น", zh: "置信得分" })}</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: "Confidence is separate from the composite. It is a weighted average of core metric coverage (65%), extended indicator coverage (15%), provenance density (10%), and freshness against the release cut-off (10%).",
                  th: "คะแนนความเชื่อมั่นแยกจากคะแนนรวม คำนวณจากค่าเฉลี่ยถ่วงน้ำหนักของความครบถ้วนตัวชี้วัดหลัก (65%) ตัวชี้วัดเสริม (15%) ความหนาแน่นของหลักฐาน (10%) และความสดใหม่เทียบวันตัดข้อมูล (10%)",
                  zh: "置信得分与综合分分离。它是核心指标覆盖率（65%）、扩展指标覆盖率（15%）、溯源密度（10%）和相对发布截点的新鲜度（10%）的加权平均。",
                })}
              </span>
            </div>
            <span className="threshold-range">{translate(locale, { en: "No hidden penalty", th: "ไม่มีโทษแฝง", zh: "没有隐藏惩罚" })}</span>
          </div>
          <div className="threshold-row threshold-gamma">
            <span className="threshold-symbol">3</span>
            <div className="threshold-content">
              <span className="threshold-name">{translate(locale, { en: "Tier assignment", th: "การจัดระดับ", zh: "层级分配" })}</span>
              <span className="threshold-desc">
                {translate(locale, {
                  en: `Alpha >= ${TIER_THRESHOLDS.alpha}. Beta ${TIER_THRESHOLDS.beta}-${TIER_THRESHOLDS.alpha - 0.1}. Gamma < ${TIER_THRESHOLDS.beta}. Once pillar scores are fixed, tier assignment is automatic.`,
                  th: `Alpha >= ${TIER_THRESHOLDS.alpha} Beta ${TIER_THRESHOLDS.beta}-${(TIER_THRESHOLDS.alpha - 0.1).toFixed(1)} Gamma < ${TIER_THRESHOLDS.beta} เมื่อตรึงคะแนนเสาหลักแล้ว การจัดระดับเป็นอัตโนมัติ`,
                  zh: `Alpha >= ${TIER_THRESHOLDS.alpha}，Beta ${TIER_THRESHOLDS.beta}-${(TIER_THRESHOLDS.alpha - 0.1).toFixed(1)}，Gamma < ${TIER_THRESHOLDS.beta}。一旦支柱分固定，层级分配即自动完成。`,
                })}
              </span>
            </div>
            <span className="threshold-range">{translate(locale, { en: "Deterministic", th: "กำหนดแน่นอน", zh: "确定性" })}</span>
          </div>
        </div>
      </section>

      <section className="reveal stagger-4 visible" style={{ marginTop: "3rem", borderTop: "1px solid var(--5)", paddingTop: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h3>{translate(locale, { en: "What is deterministic", th: "สิ่งที่กำหนดแน่นอน", zh: "哪些部分是确定性的" })}</h3>
            <p style={{ fontSize: ".75rem", color: "var(--2)", lineHeight: 1.6 }}>
              {translate(locale, {
                en: "The aggregation layer is fully reproducible. The code validates that every pillar input is within 0-100, applies the fixed weight vector once, rounds to one decimal place, and then assigns a tier using fixed thresholds. There are no hidden bonuses, black-box penalties, or committee overrides in the composite step.",
                th: "ชั้นการรวมคะแนนทำซ้ำได้ทั้งหมด โค้ดตรวจว่าคะแนนเสาหลักทุกค่าต้องอยู่ระหว่าง 0-100 ใช้น้ำหนักชุดเดิมครั้งเดียว ปัดหนึ่งตำแหน่งทศนิยม แล้วจัดระดับด้วยเกณฑ์คงที่ ไม่มีโบนัสแฝง ไม่มีโทษจากกล่องดำ และไม่มีคณะกรรมการแก้คะแนนในขั้นคะแนนรวม",
                zh: "汇总层完全可复现。代码先验证每个支柱输入都在 0-100 之间，再套用固定权重向量、保留一位小数，并按固定阈值分层。综合分阶段不存在隐藏加分、黑箱惩罚或人工委员会改分。",
              })}
            </p>
          </div>
          <div>
            <h3>{translate(locale, { en: "What still requires research judgment", th: "สิ่งที่ยังต้องใช้วิจารณญาณวิจัย", zh: "哪些部分仍需研究判断" })}</h3>
            <p style={{ fontSize: ".75rem", color: "var(--2)", lineHeight: 1.6 }}>
              {translate(locale, {
                en: "SCITI is not pretending to auto-generate a whole city from one API feed. Pillar scores are structured research assessments anchored in public metrics, evidence items, and field verification. Not every listed source contributes to every city. Registered or promotion-zone cities without enough evidence receive provisional low-confidence baselines rather than being dressed up as fully observed cases.",
                th: "SCITI ไม่ได้แสร้งทำเหมือนสร้างเมืองทั้งเมืองจาก API เส้นเดียว คะแนนเสาหลักเป็นการประเมินเชิงวิจัยที่มีโครงสร้าง ยึดกับตัวชี้วัดสาธารณะ หลักฐาน และการยืนยันภาคสนาม ไม่ใช่ทุกแหล่งข้อมูลจะถูกใช้กับทุกเมือง และเมืองที่ยังเป็นเขตส่งเสริมหรือข้อมูลไม่พอ จะได้ baseline ชั่วคราวที่ความเชื่อมั่นต่ำ แทนการทำให้ดูเหมือนถูกสังเกตครบแล้ว",
                zh: "SCITI 并不假装能从单一 API 自动生成整座城市。支柱分数是以公共指标、证据项和实地核验为锚点的结构化研究判断。并非每个来源都会作用于每座城市。对证据不足的注册/推广城市，系统给出的是低置信度的临时基线，而不是把它们伪装成完整观测样本。",
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="section reveal visible" style={{ marginTop: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Evidence Base", th: "ฐานหลักฐาน", zh: "证据基础" })}</p>
        <h2>{translate(locale, { en: "Source registries behind the method", th: "ทะเบียนแหล่งข้อมูลหลังวิธีวิจัย", zh: "方法背后的来源名录" })}</h2>
        <p style={{ fontSize: ".75rem", color: "var(--2)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {translate(locale, {
            en: `${EVIDENCE_SOURCE_FAMILY_COUNT} evidence source families are tracked in the provenance registry: ${GOVERNMENT_SOURCE_COUNT} government, ${SATELLITE_SOURCE_COUNT} satellite, ${INTERNATIONAL_SOURCE_COUNT} international reference, and ${FIELD_SOURCE_COUNT} field-verification entries. A separate platform map tracks ${CDP_PLATFORM_COUNT} public data endpoints that cities and researchers can inspect directly.`,
            th: `มีการติดตาม ${EVIDENCE_SOURCE_FAMILY_COUNT} ตระกูลแหล่งข้อมูลในทะเบียนหลักฐาน: ภาครัฐ ${GOVERNMENT_SOURCE_COUNT} รายการ ดาวเทียม ${SATELLITE_SOURCE_COUNT} รายการ อ้างอิงสากล ${INTERNATIONAL_SOURCE_COUNT} รายการ และภาคสนาม ${FIELD_SOURCE_COUNT} รายการ อีกทะเบียนหนึ่งติดตามแพลตฟอร์มสาธารณะ ${CDP_PLATFORM_COUNT} ปลายทางที่เมืองและนักวิจัยเข้าไปตรวจดูได้ตรงๆ`,
            zh: `溯源名录中跟踪了 ${EVIDENCE_SOURCE_FAMILY_COUNT} 个证据来源族群：${GOVERNMENT_SOURCE_COUNT} 个政府来源、${SATELLITE_SOURCE_COUNT} 个卫星来源、${INTERNATIONAL_SOURCE_COUNT} 个国际参考来源，以及 ${FIELD_SOURCE_COUNT} 个实地核验来源。另有一张平台地图跟踪 ${CDP_PLATFORM_COUNT} 个公开数据端点，城市与研究者都可直接核查。`,
          })}
        </p>
        <div className="sources-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {evidenceHighlights.map(source => (
            <div key={source.id} className="source-card glass-card">
              <div className="source-card-name" style={{ fontSize: ".7rem", fontWeight: 800 }}>{source.name}</div>
              <div className="source-card-desc" style={{ fontSize: ".6rem", marginBottom: ".5rem" }}>
                {translate(locale, { en: source.descEn, th: source.descTh, zh: source.descZh })}
              </div>
              <div style={{ fontSize: ".55rem", color: "var(--2)" }}>
                {translate(locale, {
                  en: `Frequency: ${source.updateFrequency}`,
                  th: `ความถี่: ${source.updateFrequency}`,
                  zh: `频率：${source.updateFrequency}`,
                })}
              </div>
            </div>
          ))}
          {platformHighlights.map(source => (
            <div key={source.id} className="source-card glass-card">
              <div className="source-card-name" style={{ fontSize: ".7rem", fontWeight: 800 }}>{locale === "th" ? source.nameTh : source.nameEn}</div>
              <div className="source-card-desc" style={{ fontSize: ".6rem", marginBottom: ".5rem" }}>
                {translate(locale, { en: source.descEn, th: source.descTh, zh: platformHighlightZh[source.id] ?? source.descEn })}
              </div>
              <div style={{ fontSize: ".55rem", color: "var(--2)" }}>
                {translate(locale, {
                  en: `Mapped endpoint · ${source.frequency}`,
                  th: `ปลายทางที่แม็ปไว้ · ${source.frequency}`,
                  zh: `已映射端点 · ${source.frequency}`,
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible" style={{ marginTop: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Audit Rules", th: "กฎการตรวจสอบ", zh: "审计规则" })}</p>
        <h2>{translate(locale, { en: "What the method does not do", th: "สิ่งที่วิธีนี้ไม่ทำ", zh: "本方法不做什么" })}</h2>
        <div className="sources-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="source-card glass-card">
            <div className="source-card-name">{translate(locale, { en: "No hidden smoothing", th: "ไม่มีการไล่ค่าแบบซ่อน", zh: "没有隐藏平滑" })}</div>
            <div className="source-card-desc">
              {translate(locale, {
                en: "Composite math does not include secret caps, bespoke city bonuses, or prestige multipliers.",
                th: "คณิตศาสตร์ของคะแนนรวมไม่มีเพดานลับ โบนัสเฉพาะเมือง หรือคูณชื่อเสียง",
                zh: "综合分数学中不存在秘密上限、特定城市加成或声望倍增器。",
              })}
            </div>
          </div>
          <div className="source-card glass-card">
            <div className="source-card-name">{translate(locale, { en: "No one-feed automation myth", th: "ไม่มีมายาคติ API เส้นเดียว", zh: "没有单一数据流神话" })}</div>
            <div className="source-card-desc">
              {translate(locale, {
                en: `The repo tracks ${CORE_METRIC_KEYS.length} core indicators and ${EXTENDED_METRIC_KEYS.length} extended indicators. That is not the same as claiming a single normalization pipeline can fully explain urban life.`,
                th: `รีโปนี้ติดตามตัวชี้วัดหลัก ${CORE_METRIC_KEYS.length} ตัว และตัวชี้วัดเสริม ${EXTENDED_METRIC_KEYS.length} ตัว แต่นั่นไม่เท่ากับการอ้างว่ามี normalization pipeline เดียวที่อธิบายชีวิตเมืองได้ครบ`,
                zh: `本仓库跟踪 ${CORE_METRIC_KEYS.length} 个核心指标和 ${EXTENDED_METRIC_KEYS.length} 个扩展指标，但这并不等于声称存在一条单一的标准化流水线就能完整解释城市生活。`,
              })}
            </div>
          </div>
          <div className="source-card glass-card">
            <div className="source-card-name">{translate(locale, { en: "No stale-date theater", th: "ไม่มีละครวันที่ลวงตา", zh: "没有伪装时效的戏法" })}</div>
            <div className="source-card-desc">
              {translate(locale, {
                en: `Freshness is evaluated against the fixed release cut-off of ${formatIsoDate(SCITI_DATA_CUTOFF_ISO)}. Scores reflect conditions at the time of assessment, not a promise about what happened after publication.`,
                th: `ความสดใหม่ถูกประเมินเทียบกับวันตัดข้อมูลคงที่ ${formatIsoDate(SCITI_DATA_CUTOFF_ISO)} คะแนนสะท้อนสภาพ ณ เวลาประเมิน ไม่ใช่คำสัญญาว่าหลังเผยแพร่เกิดอะไรขึ้น`,
                zh: `新鲜度是相对于固定发布截点 ${formatIsoDate(SCITI_DATA_CUTOFF_ISO)} 评估的。分数反映的是评估时点的状态，而不是出版后的承诺。`,
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
