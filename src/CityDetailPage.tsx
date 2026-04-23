import { useMemo } from "react";
import { getPopulationDensityPerKm2, getResolvedLandAreaKm2, getResolvedPopulationThousand } from "./adminBaselines";
import { getCityContext } from "./cityContext";
import { getCityExternalResearchLinks, getCityFactsCsv, getCitySummariesCsv } from "./cityCdp";
import { downloadCsv } from "./csvDownload";
import { useCityDetail } from "./cityApi";
import { getCityPhotoAsset } from "./cityMedia";
import { getCityResearchSources, getLocalizedList, getLocalizedText, resolveCityResearch } from "./cityResearch";
import {
  getCityName,
  getCityRealityLabel,
  getCityTagline,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { ResponsiveImage } from "./mediaAssets";
import { getCompositeBreakdown, SCORING_PILLARS } from "./scoring";
import type { Locale, ScoringPillar, SmartCity } from "./types";
import { DIMENSION_LABELS, PILLAR_COLORS, PILLAR_LABELS, PILLAR_WEIGHTS, TIER_LABELS, LEAGUE_LABELS } from "./types";
import { computeDevelopability, getGlobalComparison, getMoneyballProfile, getTailoredSteps, getFinancingAdvice } from "./cityAnalytics";
import { allCities } from "./cityData";
import { getCityFacts } from "./cityFacts";

interface Props {
  cityId: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}

const DELIVERY_STEPS = [
  {
    key: "visionStatus",
    label: {
      en: "1. Vision + mandate",
      th: "1. วิสัยทัศน์ + อำนาจขับเคลื่อน",
      zh: "1. 愿景与授权",
    },
  },
  {
    key: "infrastructureStatus",
    label: {
      en: "2. Infrastructure",
      th: "2. โครงสร้างพื้นฐาน",
      zh: "2. 基础设施",
    },
  },
  {
    key: "dataPlatformStatus",
    label: {
      en: "3. Data platform",
      th: "3. แพลตฟอร์มข้อมูล",
      zh: "3. 数据平台",
    },
  },
  {
    key: "businessModelStatus",
    label: {
      en: "4. Business model",
      th: "4. โมเดลธุรกิจ",
      zh: "4. 商业模式",
    },
  },
  {
    key: "partnershipStatus",
    label: {
      en: "5. Partnerships",
      th: "5. พันธมิตร",
      zh: "5. 伙伴关系",
    },
  },
] as const;

const DELIVERY_STATUS_LABELS = {
  ready: { en: "Ready", th: "พร้อม", zh: "就绪" },
  building: { en: "Building", th: "กำลังสร้าง", zh: "建设中" },
  gap: { en: "Gap", th: "ยังขาด", zh: "缺口" },
} as const;

const DELIVERY_STEP_BY_LEAD_STEP = {
  vision: "visionStatus",
  infrastructure: "infrastructureStatus",
  data_platform: "dataPlatformStatus",
  business_model: "businessModelStatus",
  partnerships: "partnershipStatus",
} as const;

const DATA_CONFIDENCE_LABELS = {
  high: { en: "High confidence", th: "ความเชื่อมั่นสูง", zh: "高置信度" },
  medium: { en: "Medium confidence", th: "ความเชื่อมั่นปานกลาง", zh: "中等置信度" },
  low: { en: "Low confidence", th: "ความเชื่อมั่นต่ำ", zh: "低置信度" },
} as const;

const FINANCE_STRENGTH_LABELS: Record<"strong" | "moderate" | "thin", Record<Locale, string>> = {
  strong: { en: "Strong", th: "แข็งแกร่ง", zh: "强" },
  moderate: { en: "Moderate", th: "ปานกลาง", zh: "中等" },
  thin: { en: "Thin", th: "บาง", zh: "弱" },
};

const FINANCE_RISK_LABELS: Record<"low" | "medium" | "high" | "acute", Record<Locale, string>> = {
  low: { en: "Low", th: "ต่ำ", zh: "低" },
  medium: { en: "Medium", th: "ปานกลาง", zh: "中" },
  high: { en: "High", th: "สูง", zh: "高" },
  acute: { en: "Acute", th: "วิกฤต", zh: "严峻" },
};

const FINANCE_READINESS_LABELS: Record<"advanced" | "building" | "foundational", Record<Locale, string>> = {
  advanced: { en: "Advanced", th: "ขั้นสูง", zh: "先进" },
  building: { en: "Building", th: "กำลังสร้าง", zh: "建设中" },
  foundational: { en: "Foundational", th: "รากฐาน", zh: "基础阶段" },
};

const REGION_LABELS = {
  north: { en: "North", th: "ภาคเหนือ", zh: "北部" },
  central: { en: "Central", th: "ภาคกลาง", zh: "中部" },
  northeast: { en: "Northeast", th: "ภาคตะวันออกเฉียงเหนือ", zh: "东北部" },
  east: { en: "East", th: "ภาคตะวันออก", zh: "东部" },
  south: { en: "South", th: "ภาคใต้", zh: "南部" },
  bangkok: { en: "Bangkok metro", th: "กรุงเทพมหานคร", zh: "大曼谷" },
} as const;

const PM25_TREND_LABELS = {
  improving: { en: "Improving", th: "ดีขึ้น", zh: "改善中" },
  stable: { en: "Stable", th: "ทรงตัว", zh: "稳定" },
  worsening: { en: "Worsening", th: "แย่ลง", zh: "恶化中" },
} as const;

type FactItem = {
  label: string;
  value: string;
  note?: string;
};

type FactGroup = {
  id: string;
  title: string;
  items: FactItem[];
};

function formatIsoDate(value: string): string {
  return value.slice(0, 10);
}

function compactStepLabel(label: string): string {
  return label.replace(/^\d+\.\s*/, "");
}

function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

function formatCompactPeople(thousands: number): string {
  const actual = thousands * 1000;
  return formatNumber(actual, {
    notation: "compact",
    maximumFractionDigits: actual >= 1_000_000 ? 1 : 0,
  });
}

function formatBahtCompact(value: number): string {
  return `THB ${formatNumber(value, { notation: "compact", maximumFractionDigits: 1 })}`;
}

function formatFdiMillions(value: number): string {
  if (value >= 1000) {
    return `THB ${formatNumber(value / 1000, { maximumFractionDigits: 1 })}B`;
  }
  return `THB ${formatNumber(value, { maximumFractionDigits: 0 })}M`;
}

function formatAreaKm2(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: value < 10 ? 1 : 0 })} km²`;
}

function formatDensity(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} / km²`;
}

function formatPercent(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: value % 1 === 0 ? 0 : 1 })}%`;
}

function formatPerTenThousand(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} / 10K`;
}

function formatPerHundredThousand(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} / 100K`;
}

function getContextText(
  locale: Locale,
  contextText: { en: string; th: string } | undefined,
  zhFallback: string,
  defaultValue?: string,
): string {
  if (contextText) {
    if (locale === "th") return contextText.th;
    if (locale === "zh") return zhFallback;
    return contextText.en;
  }
  return defaultValue ?? zhFallback;
}

function getStatusSummary(city: SmartCity, locale: Locale): string {
  if (city.status === "certified") {
    return translate(locale, {
      en: `Certified · Batch ${city.batch ?? "n/a"}`,
      th: `รับรองแล้ว · รุ่น ${city.batch ?? "n/a"}`,
      zh: `已认证 · 第 ${city.batch ?? "n/a"} 批`,
    });
  }

  if (city.status === "promotion") {
    return translate(locale, {
      en: "Promotion zone",
      th: "เขตส่งเสริม",
      zh: "推广区",
    });
  }

  return translate(locale, {
    en: "Registered proposal",
    th: "เมืองที่ขึ้นทะเบียน",
    zh: "已登记提案",
  });
}

function getActionStepText(
  locale: Locale,
  step: { step: string; stepTh: string; stepZh: string },
): string {
  if (locale === "th") return step.stepTh;
  if (locale === "zh") return step.stepZh;
  return step.step;
}

function getActionExampleText(
  locale: Locale,
  step: { worldExample: string; worldExampleTh: string; worldExampleZh: string },
): string {
  if (locale === "th") return step.worldExampleTh;
  if (locale === "zh") return step.worldExampleZh;
  return step.worldExample;
}

function inferGeographyDescriptor(haystack: string, locale: Locale): string {
  if (/island|beach|coastal|marine|andaman|gulf/i.test(haystack)) {
    return translate(locale, {
      en: "Island / coastal gateway",
      th: "เมืองเกาะ / ประตูชายฝั่ง",
      zh: "海岛 / 海岸门户",
    });
  }
  if (/border|cross-border|corridor|trade town/i.test(haystack)) {
    return translate(locale, {
      en: "Border trade corridor",
      th: "ระเบียงการค้าชายแดน",
      zh: "边境贸易走廊",
    });
  }
  if (/river|canal|lake|confluence/i.test(haystack)) {
    return translate(locale, {
      en: "Water-based urban system",
      th: "ระบบเมืองยึดโยงน้ำ",
      zh: "水系城市系统",
    });
  }
  if (/campus|university|research|knowledge/i.test(haystack)) {
    return translate(locale, {
      en: "Campus / knowledge district",
      th: "ย่านแคมปัส / ความรู้",
      zh: "校园 / 知识城区",
    });
  }
  if (/industrial|manufacturing|factory|petrochemical|eec|logistics/i.test(haystack)) {
    return translate(locale, {
      en: "Industrial growth corridor",
      th: "ระเบียงอุตสาหกรรมเติบโต",
      zh: "工业增长走廊",
    });
  }
  if (/heritage|historic|temple|old town|cultural/i.test(haystack)) {
    return translate(locale, {
      en: "Historic urban core",
      th: "แกนเมืองประวัติศาสตร์",
      zh: "历史城市核心",
    });
  }
  if (/cbd|metro|office|commercial district|capital/i.test(haystack)) {
    return translate(locale, {
      en: "Metropolitan commercial district",
      th: "ย่านพาณิชย์ในมหานคร",
      zh: "大都市商业城区",
    });
  }
  return translate(locale, {
    en: "Regional secondary city",
    th: "เมืองศูนย์กลางภูมิภาค",
    zh: "区域次级中心城市",
  });
}

function isFactItem(value: FactItem | null): value is FactItem {
  return value !== null;
}

function compactFacts(items: Array<FactItem | null>): FactItem[] {
  return items.filter(isFactItem);
}

function ensureFactCoverage(items: FactItem[], locale: Locale): FactItem[] {
  if (items.length > 0) return items;
  return [
    {
      label: translate(locale, { en: "Coverage gap", th: "ช่องว่างข้อมูล", zh: "覆盖缺口" }),
      value: translate(locale, { en: "Pending", th: "รอยืนยัน", zh: "待核验" }),
      note: translate(locale, {
        en: "No verified city-level observations are curated for this block yet.",
        th: "ยังไม่มีข้อมูลระดับเมืองที่ยืนยันแล้วสำหรับหมวดนี้",
        zh: "此模块尚未整理出已核验的城市级观测值。",
      }),
    },
  ];
}

function statGrade(value: number): string {
  if (value >= 85) return "S";
  if (value >= 75) return "A";
  if (value >= 65) return "B";
  if (value >= 50) return "C";
  if (value >= 35) return "D";
  return "E";
}

function gradeColor(grade: string): string {
  if (grade === "S") return "#1E8C7F";
  if (grade === "A") return "#4A9E4A";
  if (grade === "B") return "#3058C9";
  if (grade === "C") return "#E8913A";
  if (grade === "D") return "#D94F4F";
  return "#9C9183";
}

function RadarChart({ scores, locale }: { scores: Record<ScoringPillar, number>; locale: Locale }) {
  const cx = 140;
  const cy = 140;
  const maxR = 110;
  const pillars = SCORING_PILLARS;
  const angleStep = (2 * Math.PI) / pillars.length;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const rings = [25, 50, 75, 100];
  const dataPoints = pillars.map((pillar, index) => getPoint(index, scores[pillar]));
  const dataPath = dataPoints.map((pt, index) => `${index === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 280 280" className="radar-chart" role="img" aria-labelledby="radar-title">
      <title id="radar-title">{pillars.map(p => `${PILLAR_LABELS[locale][p]}: ${scores[p]}/100`).join(", ")}</title>
      {rings.map(ring => {
        const points = pillars.map((_, index) => getPoint(index, ring));
        const path = points.map((pt, index) => `${index === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";
        return <path key={ring} d={path} fill="none" stroke="var(--5, #E8E8EC)" strokeWidth="0.5" opacity="0.5" />;
      })}

      {pillars.map((_, index) => {
        const pt = getPoint(index, 100);
        return <line key={index} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#E8E8EC" strokeWidth="0.5" opacity="0.3" />;
      })}

      <path d={dataPath} fill="rgba(43, 186, 160, 0.15)" stroke="#2BBAA0" strokeWidth="2" />

      {dataPoints.map((pt, index) => (
        <circle key={index} cx={pt.x} cy={pt.y} r="3.5" fill={PILLAR_COLORS[pillars[index]]} />
      ))}

      {pillars.map((pillar, index) => {
        const labelPt = getPoint(index, 128);
        return (
          <text
            key={pillar}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontFamily="var(--font)"
            fontWeight="600"
            fill="var(--3, #888)"
          >
            {PILLAR_LABELS[locale][pillar]}
          </text>
        );
      })}
    </svg>
  );
}

function StatBar({ pillar, value, locale }: { pillar: ScoringPillar; value: number; locale: Locale }) {
  const grade = statGrade(value);
  const weight = PILLAR_WEIGHTS[pillar];

  return (
    <div className="rpg-stat-row">
      <div className="rpg-stat-color" style={{ background: PILLAR_COLORS[pillar] }} />
      <div className="rpg-stat-name">{PILLAR_LABELS[locale][pillar]}</div>
      <div className="rpg-stat-weight">{weight}%</div>
      <div className="rpg-stat-bar-track">
        <div className="rpg-stat-bar-fill" style={{ width: `${value}%`, background: PILLAR_COLORS[pillar] }} />
        <div className="rpg-stat-bar-mark" style={{ left: "25%" }} />
        <div className="rpg-stat-bar-mark" style={{ left: "50%" }} />
        <div className="rpg-stat-bar-mark" style={{ left: "75%" }} />
      </div>
      <div className="rpg-stat-value">{value}</div>
      <div className="rpg-stat-grade" style={{ color: gradeColor(grade) }}>{grade}</div>
    </div>
  );
}

function CitySpotlight({ cityId, locale }: { cityId: string; locale: Locale }) {
  if (cityId === "phuket") {
    return (
      <div className="city-spotlight-box glass-card shadow-premium" style={{ borderLeft: '4px solid var(--teal)', marginTop: '2rem' }}>
        <p className="eyebrow" style={{ color: 'var(--teal)' }}>{translate(locale, { en: "Institutional Spotlight", th: "จุดเด่นเชิงสถาบัน", zh: "机构亮点" })}</p>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '.5rem' }}>{translate(locale, { en: "Japan / Fujitsu Smart JAMP Case", th: "กรณีศึกษา Fujitsu Smart JAMP (ญี่ปุ่น)", zh: "日本 / 富士通 Smart JAMP 案例" })}</h3>
        <p style={{ fontSize: '.75rem', lineHeight: 1.6, color: 'var(--2)' }}>
          {translate(locale, {
            en: "Phuket isn't just installing cameras; it's proving the 'AI vs Asphalt' philosophy. By using Fujitsu's traffic AI, the city reduced congestion at major roundabouts by 15% without widening a single road. This is the definition of a high-maturity digital outcome.",
            th: "ภูเก็ตไม่ได้แค่ติดกล้อง แต่กำลังพิสูจน์ปรัชญา 'AI vs ยางมะตอย' ด้วยการใช้ AI จาก Fujitsu บริหารจราจร เมืองสามารถลดความหนาแน่นที่วงเวียนหลักได้ 15% โดยไม่ต้องขยายถนนแม้แต่นิ้วเดียว นี่คือคำนิยามของผลลัพธ์ดิจิทัลระดับสูง",
            zh: "普吉不仅是在安装摄像头；它正在证明“AI 对抗沥青”的哲学。通过使用富士通的交通 AI，该市在没有拓宽任何道路的情况下，将主要环岛的拥堵减少了 15%。这就是高成熟度数字成果的定义。"
          })}
        </p>
        <div style={{ marginTop: '1rem', font: '700 .6rem var(--mono)', color: 'var(--teal)' }}>
          RESULT: -15% CONGESTION | 0km NEW ASPHALT
        </div>
      </div>
    );
  }
  if (cityId === "khon-kaen") {
    return (
      <div className="city-spotlight-box glass-card shadow-premium" style={{ borderLeft: '4px solid var(--alpha)', marginTop: '2rem' }}>
        <p className="eyebrow" style={{ color: 'var(--alpha)' }}>{translate(locale, { en: "Community Grit", th: "ใจสู้คนท้องถิ่น", zh: "社区韧性" })}</p>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '.5rem' }}>{translate(locale, { en: "KKTS: The Local Consortium", th: "KKTS: คอนซอร์เทียมท้องถิ่น", zh: "KKTS：地方财团" })}</h3>
        <p style={{ fontSize: '.75rem', lineHeight: 1.6, color: 'var(--2)' }}>
          {translate(locale, {
            en: "Khon Kaen's success isn't about central budget—it's about local grit. Through KKTS (Khon Kaen Transit System), the city's private sectors and 5 municipalities funded their own Smart Bus and are pushing for LRT. This bottom-up ownership makes Khon Kaen the most resilient smart city in the index.",
            th: "ความสำเร็จของขอนแก่นไม่ใช่เรื่องงบส่วนกลาง แต่คือความใจสู้ของท้องถิ่น ผ่าน KKTS (บริษัท ขอนแก่น ทรานซิท ซิสเต็ม) ภาคเอกชนและ 5 เทศบาลร่วมกันลงขันสร้าง Smart Bus และผลักดัน LRT การเป็นเจ้าของจากฐานรากทำให้ขอนแก่นเป็นเมืองอัจฉริยะที่ยืดหยุ่นที่สุด",
            zh: "孔敬的成功不在于中央预算，而在于地方韧性。通过 KKTS，该市的私营部门和 5 个市政当局资助了自己的智慧巴士，并正在推动轻轨建设。这种自下而上的所有权使孔敬成为指数中最具韧性的智慧城市。"
          })}
        </p>
        <div style={{ marginTop: '1rem', font: '700 .6rem var(--mono)', color: 'var(--alpha)' }}>
          MODEL: PPP 2.0 | OWNERSHIP: 100% LOCAL
        </div>
      </div>
    );
  }
  if (cityId === "wangchan-valley") {
    return (
      <div className="city-spotlight-box glass-card shadow-premium" style={{ borderLeft: '4px solid var(--gamma)', marginTop: '2rem' }}>
        <p className="eyebrow" style={{ color: 'var(--gamma)' }}>{translate(locale, { en: "Reality Audit", th: "ตรวจสอบความจริง", zh: "现实审计" })}</p>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '.5rem' }}>{translate(locale, { en: "The Laboratory Gap", th: "ช่องว่างห้องทดลอง", zh: "实验室差距" })}</h3>
        <p style={{ fontSize: '.75rem', lineHeight: 1.6, color: 'var(--2)' }}>
          {translate(locale, {
            en: "Wangchan Valley has the highest infrastructure score in the country. However, our index ranks it Gamma. Why? Because a smart city without residents is a lab, not a city. Until the 'Live' component matches the 'Digital' hardware, it remains a brilliant prototype.",
            th: "วังจันทร์วัลเลย์มีคะแนนโครงสร้างพื้นฐานสูงที่สุดในประเทศ แต่ดัชนีของเราจัดให้อยู่ Gamma ทำไม? เพราะเมืองอัจฉริยะที่ไม่มีคนอยู่คือห้องทดลอง ไม่ใช่เมือง จนกว่าส่วนประกอบ 'Live' จะโตทันฮาร์ดแวร์ 'Digital' ที่นี่ก็ยังเป็นเพียงต้นแบบที่ยอดเยี่ยม",
            zh: "旺参谷拥有全国最高的基础设施得分。然而，我们的指数将其评为 Gamma。为什么？因为没有居民的智慧城市只是实验室，而不是城市。在“生活”维度赶上“数字”硬件之前，它仍然只是一个出色的原型。"
          })}
        </p>
        <div style={{ marginTop: '1rem', font: '700 .6rem var(--mono)', color: 'var(--gamma)' }}>
          STATUS: PLANNED GAMMA | GAP: 0 RESIDENTS
        </div>
      </div>
    );
  }
  return null;
}

function ScoreBreakdown({
  scores,
  locale,
}: {
  scores: Record<ScoringPillar, number>;
  locale: Locale;
}) {
  const { composite, terms, totalWeight } = getCompositeBreakdown(scores);

  return (
    <div className="score-decomposition">
      <div className="decomp-header">
        <span className="decomp-title">
          {translate(locale, {
            en: "Score decomposition",
            th: "สมการคะแนน",
            zh: "得分拆解",
          })}
        </span>
        <span className="decomp-formula">Composite = Σ (score × weight) / 100</span>
      </div>
      <div className="decomp-table">
        <div className="decomp-row decomp-row-header">
          <span>{translate(locale, { en: "Pillar", th: "เสาหลัก", zh: "支柱" })}</span>
          <span>{translate(locale, { en: "Score", th: "คะแนน", zh: "分数" })}</span>
          <span>{translate(locale, { en: "Weight", th: "น้ำหนัก", zh: "权重" })}</span>
          <span>{translate(locale, { en: "Contribution", th: "ผลต่อคะแนนรวม", zh: "贡献值" })}</span>
        </div>
        {terms.map(term => (
          <div key={term.pillar} className="decomp-row">
            <span className="decomp-pillar">
              <span className="decomp-dot" style={{ background: PILLAR_COLORS[term.pillar] }} />
              {PILLAR_LABELS[locale][term.pillar]}
            </span>
            <span className="decomp-num">{term.score}</span>
            <span className="decomp-num">{term.weight}%</span>
            <span className="decomp-num decomp-contribution">{term.contribution.toFixed(1)}</span>
          </div>
        ))}
        <div className="decomp-row decomp-row-total">
          <span>{translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合分" })}</span>
          <span />
          <span className="decomp-num">{totalWeight}%</span>
          <span className="decomp-num decomp-total-value">{composite.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default function CityDetailPage({ cityId, locale, onNavigate }: Props) {
  const { data: city, loading } = useCityDetail(cityId);

  const instrumentLookup = useMemo(
    () => new Map(city?.financeInstrumentCatalog.map(item => [item.id, item]) ?? []),
    [city],
  );

  const dossier = useMemo(() => {
    if (!city) {
      return null;
    }

    const noteLookup = new Map(city.contextNotes.map(note => [note.kind, note]));
    const opportunity = noteLookup.get("opportunity");
    const constraint = noteLookup.get("constraint");
    const warning = noteLookup.get("implementation_warning");
    const lesson = noteLookup.get("exportable_lesson");
    const leadRecommendation = city.financeRecommendations.find(item => item.priority === "lead") ?? city.financeRecommendations[0] ?? null;
    const readySteps = DELIVERY_STEPS.filter(step => city.deliveryProfile[step.key] === "ready");
    const buildingSteps = DELIVERY_STEPS.filter(step => city.deliveryProfile[step.key] === "building");
    const gapSteps = DELIVERY_STEPS.filter(step => city.deliveryProfile[step.key] === "gap");
    const nextCriticalSteps = (gapSteps.length > 0 ? gapSteps : buildingSteps).map(step => compactStepLabel(step.label[locale]));
    const leadStepKey = DELIVERY_STEP_BY_LEAD_STEP[city.deliveryProfile.recommendedLeadStep];
    const leadStep = DELIVERY_STEPS.find(step => step.key === leadStepKey);
    const leadStepLabel = leadStep ? compactStepLabel(leadStep.label[locale]) : city.deliveryProfile.recommendedLeadStep;
    const confidence = city.dataConfidence ?? "medium";
    const confidenceLabel = DATA_CONFIDENCE_LABELS[confidence][locale];
    const operatingSummary = city.reality === "operational"
      ? translate(locale, {
          en: `${readySteps.length} of 5 delivery steps already read as ready. This city behaves more like an operating system than a logo-only program.`,
          th: `${readySteps.length} จาก 5 ขั้นการส่งมอบอยู่ในสถานะพร้อมแล้ว เมืองนี้จึงเริ่มทำงานเหมือนระบบปฏิบัติการของเมืองจริง มากกว่าจะเป็นโครงการที่มีแค่โลโก้.`,
          zh: `五个交付步骤中已有 ${readySteps.length} 个达到就绪状态。这座城市更像一个正在运行的系统，而不只是挂着标识的计划。`,
        })
      : city.reality === "partial"
        ? translate(locale, {
            en: `${readySteps.length} of 5 delivery steps are already live, but ${buildingSteps.length + gapSteps.length} still need to harden before the city becomes durable.`,
            th: `${readySteps.length} จาก 5 ขั้นเริ่มเดินแล้ว แต่ยังมีอีก ${buildingSteps.length + gapSteps.length} ขั้นที่ต้องทำให้แข็งแรงกว่านี้ก่อนจะกลายเป็นเมืองที่ยืนระยะได้จริง.`,
            zh: `五个交付步骤中已有 ${readySteps.length} 个开始落地，但仍有 ${buildingSteps.length + gapSteps.length} 个步骤需要继续夯实，城市能力才会真正稳固。`,
          })
        : translate(locale, {
            en: `This city still leans on plans, pilots, or assets. Only ${readySteps.length} of 5 delivery steps read as truly ready today.`,
            th: `เมืองนี้ยังพึ่งพาแผน นำร่อง หรือทรัพย์สินที่ตั้งไว้ล่วงหน้าอยู่ โดยวันนี้มีเพียง ${readySteps.length} จาก 5 ขั้นที่อ่านได้ว่าพร้อมจริง.`,
            zh: `这座城市目前仍更多依赖规划、试点或预置资产。今天真正达到就绪状态的交付步骤只有五个中的 ${readySteps.length} 个。`,
          });
    const gapSummary = nextCriticalSteps.length > 0
      ? translate(locale, {
          en: `The current reality gap sits in ${nextCriticalSteps.join(" · ")}. Until those steps harden, smart-city branding will outrun operating capacity.`,
          th: `ช่องว่างความจริงตอนนี้อยู่ที่ ${nextCriticalSteps.join(" · ")} หากขั้นเหล่านี้ยังไม่แข็งแรง ภาพลักษณ์เมืองอัจฉริยะจะวิ่งนำศักยภาพการเดินระบบจริง.`,
          zh: `当前的现实缺口集中在 ${nextCriticalSteps.join(" · ")}。在这些步骤真正稳住之前，智慧城市的品牌叙事会继续跑在运营能力前面。`,
        })
      : translate(locale, {
          en: "No critical gap is flashing red in the five-step ladder right now. The challenge is preserving quality as delivery scales.",
          th: "ในบันไดห้าขั้นตอนยังไม่มีช่องว่างวิกฤตที่เป็นไฟแดงชัดเจน ความท้าทายคือรักษาคุณภาพเมื่อการส่งมอบขยายตัว.",
          zh: "五步交付梯度中暂时没有明显亮红灯的结构性缺口。真正的挑战在于规模扩大后还能否维持质量。",
        });
    const verificationSummary = translate(locale, {
      en: `Latest observed ${formatIsoDate(city.freshness.latestObservedAt)}. Last verified ${formatIsoDate(city.freshness.lastVerifiedAt)}. ${city.provenanceCount} provenance rows and ${city.evidenceItems.length} evidence items support this dossier.`,
      th: `สังเกตล่าสุด ${formatIsoDate(city.freshness.latestObservedAt)} ตรวจสอบล่าสุด ${formatIsoDate(city.freshness.lastVerifiedAt)} โดย dossier นี้รองรับด้วยแถวหลักฐาน ${city.provenanceCount} แถว และหลักฐาน ${city.evidenceItems.length} รายการ.`,
      zh: `最近观测日期为 ${formatIsoDate(city.freshness.latestObservedAt)}，最近核验日期为 ${formatIsoDate(city.freshness.lastVerifiedAt)}。这份档案由 ${city.provenanceCount} 条溯源记录和 ${city.evidenceItems.length} 条证据支撑。`,
    });

    return {
      leadStepLabel,
      leadRecommendation,
      readySteps,
      buildingSteps,
      gapSteps,
      confidenceLabel,
      confidence,
      operatingSummary,
      gapSummary,
      verificationSummary,
      cards: [
        {
          id: "opportunity",
          label: translate(locale, { en: "Strategic advantage", th: "ความได้เปรียบเชิงยุทธศาสตร์", zh: "战略优势" }),
          body: opportunity?.body[locale] ?? city.financeSignal.line[locale],
          meta: translate(locale, { en: "What this city can uniquely convert into momentum", th: "สิ่งที่เมืองนี้เปลี่ยนเป็นแรงส่งได้เป็นพิเศษ", zh: "这座城市最能转化为动能的部分" }),
        },
        {
          id: "constraint",
          label: translate(locale, { en: "Reality gap", th: "ช่องว่างความจริง", zh: "现实缺口" }),
          body: constraint?.body[locale] ?? gapSummary,
          meta: nextCriticalSteps.length > 0
            ? translate(locale, {
                en: `Watch next: ${nextCriticalSteps.join(" · ")}`,
                th: `จับตาต่อ: ${nextCriticalSteps.join(" · ")}`,
                zh: `下一步重点：${nextCriticalSteps.join(" · ")}`,
              })
            : translate(locale, { en: "No structural gap flagged right now", th: "ยังไม่พบช่องว่างเชิงโครงสร้างเด่นชัด", zh: "当前未发现明显结构性缺口" }),
        },
        {
          id: "warning",
          label: translate(locale, { en: "Implementation risk", th: "ความเสี่ยงเชิงปฏิบัติ", zh: "实施风险" }),
          body: warning?.body[locale] ?? city.deliveryProfile.deliveryNote[locale],
          meta: translate(locale, {
            en: `Lead step now: ${leadStepLabel}`,
            th: `ขั้นนำตอนนี้: ${leadStepLabel}`,
            zh: `当前领先步骤：${leadStepLabel}`,
          }),
        },
        {
          id: "lesson",
          label: translate(locale, { en: "Exportable lesson", th: "บทเรียนที่ส่งออกได้", zh: "可输出经验" }),
          body: lesson?.body[locale] ?? city.deliveryProfile.deliveryNote[locale],
          meta: translate(locale, { en: "What other Thai cities can actually borrow", th: "สิ่งที่เมืองไทยอื่นยืมไปใช้ได้จริง", zh: "其他泰国城市真正可以借鉴的部分" }),
        },
      ],
    };
  }, [city, locale]);

  if (!city && loading) {
    return (
      <section className="section" style={{ paddingTop: "7rem" }}>
        <h1>{translate(locale, { en: "Loading city dossier…", th: "กำลังโหลด dossier เมือง…", zh: "正在加载城市档案…" })}</h1>
      </section>
    );
  }

  if (!city) {
    return (
      <section className="section" style={{ paddingTop: "7rem" }}>
        <h1>{translate(locale, { en: "City not found", th: "ไม่พบเมือง", zh: "未找到城市" })}</h1>
        <button
          className="cta-button"
          role="link"
          onClick={() => onNavigate("/")}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onNavigate("/");
            }
          }}
        >
          {translate(locale, { en: "Back to home", th: "กลับหน้าหลัก", zh: "返回首页" })}
        </button>
      </section>
    );
  }

  const cityName = getCityName(city, locale);
  const provinceName = getProvinceName(city, locale);
  const cityTagline = getCityTagline(city, locale);
  const tierSymbol = city.tier === "alpha" ? "α" : city.tier === "beta" ? "β" : "γ";
  const overallGrade = statGrade(city.compositeScore);
  const cityPhoto = getCityPhotoAsset(city);
  const cityContext = getCityContext(city.id);
  const research = resolveCityResearch(city);
  const comparison = getGlobalComparison(city.id);
  const developability = computeDevelopability(city);
  const steps = getTailoredSteps(city);
  const financing = getFinancingAdvice(city);
  // Rank across all cities by composite score (descending). Ties share position; we use 1-indexed.
  const citiesByComposite = [...allCities].sort((a, b) => b.compositeScore - a.compositeScore);
  const cityRank = citiesByComposite.findIndex(c => c.id === city.id) + 1;
  const cityRankTotal = citiesByComposite.length;
  // Tier-median developability delta.
  const tierDevScores = allCities
    .filter(c => c.tier === city.tier && c.id !== city.id)
    .map(c => computeDevelopability(c).total)
    .sort((a, b) => a - b);
  const tierDevMedian = tierDevScores.length
    ? tierDevScores[Math.floor(tierDevScores.length / 2)]
    : null;
  const tierMedianDelta = tierDevMedian != null ? developability.total - tierDevMedian : null;
  const tierSymbolForMedian = city.tier === "alpha" ? "α" : city.tier === "beta" ? "β" : "γ";
  // Freshness staleness.
  const daysAgo = (iso: string | undefined): number | null => {
    if (!iso) return null;
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return null;
    return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
  };
  const freshnessDays = daysAgo(city.freshness.latestObservedAt);
  const freshnessTone = freshnessDays == null ? "unknown" : freshnessDays < 30 ? "fresh" : freshnessDays < 90 ? "warm" : "stale";
  const freshnessChipText = freshnessDays == null
    ? translate(locale, { en: "Date n/a", th: "ไม่มีวันที่", zh: "无日期" })
    : translate(locale, {
        en: `${freshnessDays}d ago`,
        th: `${freshnessDays} วันที่แล้ว`,
        zh: `${freshnessDays} 天前`,
      });
  const researchLinks = [
    ...getCityResearchSources(city).map(link => ({ label: getLocalizedText(locale, link.label), url: link.url })),
    ...getCityExternalResearchLinks(city),
  ].filter((link, index, list) => list.findIndex(item => item.url === link.url) === index);
  const leadInstrument = dossier?.leadRecommendation ? instrumentLookup.get(dossier.leadRecommendation.instrumentId) : undefined;
  const leadInstrumentName = dossier?.leadRecommendation
    ? locale === "th"
      ? (leadInstrument?.nameTh ?? dossier.leadRecommendation.instrumentName)
      : dossier.leadRecommendation.instrumentName
    : city.financeSignal.leadInstrumentName;
  const isRegisteredProfile = city.status === "registered";
  const resolvedPopulation = getResolvedPopulationThousand(city);
  const resolvedLandArea = getResolvedLandAreaKm2(city, cityContext?.landArea);
  const resolvedDensity = getPopulationDensityPerKm2(city, cityContext?.landArea);
  const hasPopulationBaseline = resolvedPopulation.value !== undefined && resolvedPopulation.value > 0;
  const landArea = resolvedLandArea.value;
  const density = resolvedDensity.value ?? null;
  const pendingValue = translate(locale, {
    en: "Pending",
    th: "รอยืนยัน",
    zh: "待核验",
  });
  const populationLabel = hasPopulationBaseline ? formatCompactPeople(resolvedPopulation.value ?? 0) : pendingValue;
  const missingAreaShortNote = translate(locale, {
    en: "Administrative area source pending",
    th: "รอแหล่งข้อมูลพื้นที่ทางปกครอง",
    zh: "行政面积来源待补",
  });
  const missingAreaLongNote = translate(locale, {
    en: "Administrative area still needs a verified source in the claim registry.",
    th: "ข้อมูลพื้นที่ทางปกครองยังต้องมีแหล่งอ้างอิงที่ยืนยันแล้วใน claim registry",
    zh: "行政面积在 claim registry 中仍需补上已核验来源。",
  });
  const densityMethodNote = translate(locale, {
    en: resolvedDensity.methodNote,
    th: "คำนวณจากฐานประชากรและฐานพื้นที่ที่แก้ไขแล้ว โปรดดู scope ของแหล่งข้อมูลก่อนเทียบความหนาแน่นแบบเทศบาลแท้",
    zh: "根据已解析的人口与面积基线计算；比较精确市政密度前请先检查来源范围。",
  });
  const geographicSignal = inferGeographyDescriptor(
    [
      comparison?.why ?? "",
      getLocalizedText("en", research.compareNote),
      getLocalizedText("en", research.signatureStory),
      city.tagline,
      city.metrics.industryComposition ?? "",
    ].join(" "),
    locale,
  );
  const economicDNA = getLocalizedList(locale, research.industries).slice(0, 4).join(" · ");
  const cityOrientation = translate(locale, {
    en: `${geographicSignal} in ${provinceName}. ${getStatusSummary(city, locale)} with ${city.smartDimensions.length} smart dimensions in play, serving a population base of ${populationLabel}${landArea ? ` across ${formatAreaKm2(landArea)}` : ""}.`,
    th: `${geographicSignal}ใน${provinceName} ${getStatusSummary(city, locale)} ครอบคลุม ${city.smartDimensions.length} มิติอัจฉริยะ รองรับฐานประชากร ${populationLabel}${landArea ? ` บนพื้นที่ ${formatAreaKm2(landArea)}` : ""}.`,
    zh: `${provinceName}的${geographicSignal}。${getStatusSummary(city, locale)}，覆盖 ${city.smartDimensions.length} 个智慧维度，服务人口基础约 ${populationLabel}${landArea ? `，面积 ${formatAreaKm2(landArea)}` : ""}。`,
  });
  const contextHighlight = getContextText(
    locale,
    cityContext?.famousFor,
    getLocalizedText(locale, research.signatureStory),
    getLocalizedText(locale, research.compareNote),
  );
  const analogyBreak = getContextText(
    locale,
    cityContext?.theCatch,
    dossier?.gapSummary ?? city.deliveryProfile.deliveryNote[locale],
    dossier?.gapSummary ?? city.deliveryProfile.deliveryNote[locale],
  );
  const investorTakeaway = translate(locale, {
    en: `${financing.primaryInstrument}. ${financing.competitiveAdvantage}`,
    th: `${financing.primaryInstrumentTh} ${financing.competitiveAdvantageTh}`,
    zh: `${financing.primaryInstrumentZh}。${financing.competitiveAdvantageZh}`,
  });
  const basicDataFields = [
    { label: translate(locale, { en: "Population", th: "ประชากร", zh: "人口" }), available: hasPopulationBaseline },
    { label: translate(locale, { en: "Land area", th: "พื้นที่", zh: "土地面积" }), available: Boolean(landArea) },
    { label: translate(locale, { en: "Avg. income", th: "รายได้เฉลี่ย", zh: "平均收入" }), available: city.metrics.avgMonthlyIncome != null },
    { label: translate(locale, { en: "GPP per capita", th: "GPP ต่อหัว", zh: "人均GPP" }), available: city.metrics.gppPerCapita != null },
    { label: translate(locale, { en: "Growth rate", th: "อัตราเติบโต", zh: "增长率" }), available: city.metrics.gppGrowthRate != null },
    { label: translate(locale, { en: "Labor force", th: "กำลังแรงงาน", zh: "劳动力" }), available: city.metrics.laborForce != null },
    { label: translate(locale, { en: "Industry mix", th: "โครงสร้างอุตสาหกรรม", zh: "产业结构" }), available: Boolean(city.metrics.industryComposition) },
    { label: translate(locale, { en: "PM2.5", th: "PM2.5", zh: "PM2.5" }), available: city.metrics.pm25Annual != null },
    { label: translate(locale, { en: "Hospital beds", th: "เตียงโรงพยาบาล", zh: "医院床位" }), available: city.metrics.hospitalBedsPer10k != null },
    { label: translate(locale, { en: "Crime rate", th: "อัตราอาชญากรรม", zh: "犯罪率" }), available: city.metrics.crimeRatePer100k != null },
    { label: translate(locale, { en: "Green coverage", th: "พื้นที่สีเขียว", zh: "绿地覆盖率" }), available: city.metrics.greenCoverage != null },
    { label: translate(locale, { en: "Water quality", th: "คุณภาพน้ำ", zh: "水质" }), available: city.metrics.waterQuality != null },
    { label: translate(locale, { en: "Forest cover", th: "พื้นที่ป่า", zh: "森林覆盖" }), available: city.metrics.forestCoverage != null },
    { label: translate(locale, { en: "FDI inflow", th: "FDI", zh: "外商直接投资" }), available: city.metrics.fdiInflow != null },
  ];
  const availableBasicFields = basicDataFields.filter(field => field.available);
  const missingBasicFields = basicDataFields.filter(field => !field.available);
  const missingBasicSummary = missingBasicFields.length === 0
    ? translate(locale, { en: "No core gaps flagged", th: "ยังไม่พบช่องว่างข้อมูลหลัก", zh: "未发现核心数据缺口" })
    : missingBasicFields.slice(0, 5).map(field => field.label).join(" · ") + (missingBasicFields.length > 5 ? ` +${missingBasicFields.length - 5}` : "");
  const profileLevelLabel = isRegisteredProfile
    ? translate(locale, { en: "Registered proposal profile", th: "โปรไฟล์ข้อเสนอที่ขึ้นทะเบียน", zh: "已登记提案档案" })
    : translate(locale, { en: "Full SCITI dossier", th: "SCITI dossier เต็ม", zh: "完整 SCITI 档案" });
  const primaryStep = steps[0] ?? {
    step: city.deliveryProfile.deliveryNote.en,
    stepTh: city.deliveryProfile.deliveryNote.th,
    stepZh: city.deliveryProfile.deliveryNote.zh,
    worldExample: city.financeSignal.line.en,
    worldExampleTh: city.financeSignal.line.th,
    worldExampleZh: city.financeSignal.line.zh,
    source: "SCITI city profile",
  };
  const analogHeadline = comparison
    ? `${comparison.worldCity}, ${comparison.country}`
    : translate(locale, {
        en: "No analog assigned yet",
        th: "ยังไม่มีเมืองเทียบเคียง",
        zh: "尚未指定类比城市",
      });
  const leadAction = dossier?.leadRecommendation?.nextStep[locale] ?? getActionStepText(locale, primaryStep);
  const leadActionEvidence = dossier?.leadRecommendation?.reasonSummary[locale] ?? getActionExampleText(locale, primaryStep);
  const developabilityLabel = locale === "zh"
    ? developability.labelZh
    : locale === "th"
      ? developability.labelTh
      : developability.label;
  const heroMeta = translate(locale, {
    en: `${provinceName} · ${getStatusSummary(city, locale)} · ${city.smartDimensions.length} smart dimensions`,
    th: `${provinceName} · ${getStatusSummary(city, locale)} · ${city.smartDimensions.length} มิติอัจฉริยะ`,
    zh: `${provinceName} · ${getStatusSummary(city, locale)} · ${city.smartDimensions.length} 个智慧维度`,
  });
  const riskProfileLabel = FINANCE_RISK_LABELS[city.financeProfile.riskProfile][locale];
  const deliveryReadinessLabel = FINANCE_READINESS_LABELS[city.financeProfile.deliveryReadiness][locale];
  const riskPostureNote = city.financeProfile.riskProfile === "low"
    ? translate(locale, {
        en: "Scale discipline matters more than basic de-risking.",
        th: "วินัยการขยายผลสำคัญกว่าการลดความเสี่ยงพื้นฐาน",
        zh: "重点在规模化纪律，而不是基础降险。",
      })
    : city.financeProfile.riskProfile === "medium"
      ? translate(locale, {
          en: "Package evidence before moving into heavier capex.",
          th: "ควรรวบหลักฐานให้แน่นก่อนเข้าสู่ capex ที่หนักขึ้น",
          zh: "进入更重资本开支前，应先把证据包扎实。",
        })
      : translate(locale, {
          en: "De-risk scope and governance before capital scale-up.",
          th: "ต้องลดความเสี่ยงด้านขอบเขตและธรรมาภิบาลก่อนขยายเงินทุน",
          zh: "扩大资本投入前，应先降低范围与治理风险。",
        });
  const scaleNote = landArea
    ? density
      ? translate(locale, {
          en: `${formatAreaKm2(landArea)} · ${formatDensity(density)}`,
          th: `${formatAreaKm2(landArea)} · ${formatDensity(density)}`,
          zh: `${formatAreaKm2(landArea)} · ${formatDensity(density)}`,
        })
      : formatAreaKm2(landArea)
    : missingAreaShortNote;
  const dataCoverageValue = `${availableBasicFields.length}/${basicDataFields.length}`;
  const factbookGroups: FactGroup[] = [
    {
      id: "data-coverage",
      title: translate(locale, {
        en: "Data coverage",
        th: "ความครบถ้วนข้อมูล",
        zh: "数据覆盖",
      }),
      items: compactFacts([
        {
          label: translate(locale, { en: "Profile level", th: "ระดับโปรไฟล์", zh: "档案级别" }),
          value: profileLevelLabel,
          note: isRegisteredProfile
            ? translate(locale, {
                en: "Use as a discovery lead, not yet as an investment-ready assessment.",
                th: "ใช้เป็น lead สำหรับสำรวจต่อ ยังไม่ใช่การประเมินพร้อมลงทุนเต็มรูปแบบ",
                zh: "适合作为发现线索，尚不是可直接投资评估。",
              })
            : translate(locale, {
                en: "Enough fields exist to support a printable investor discussion.",
                th: "มีข้อมูลเพียงพอสำหรับพิมพ์ไปคุยแผนลงทุน",
                zh: "字段足以支撑可打印的投资讨论。",
              }),
        },
        {
          label: translate(locale, { en: "Core field coverage", th: "ความครบถ้วนช่องหลัก", zh: "核心字段覆盖" }),
          value: `${availableBasicFields.length}/${basicDataFields.length}`,
          note: missingBasicSummary,
        },
        {
          label: translate(locale, { en: "Provenance", th: "หลักฐานข้อมูล", zh: "溯源" }),
          value: `${city.provenanceCount}`,
          note: translate(locale, {
            en: `${city.evidenceItems.length} evidence items · confidence ${city.dataConfidence ?? "medium"}`,
            th: `หลักฐาน ${city.evidenceItems.length} รายการ · ความเชื่อมั่น ${city.dataConfidence ?? "medium"}`,
            zh: `${city.evidenceItems.length} 条证据 · 置信度 ${city.dataConfidence ?? "medium"}`,
          }),
        },
      ]),
    },
    {
      id: "place",
      title: translate(locale, {
        en: "Place and scale",
        th: "ที่ตั้งและขนาด",
        zh: "区位与规模",
      }),
      items: compactFacts([
        {
          label: translate(locale, { en: "Population", th: "ประชากร", zh: "人口" }),
          value: populationLabel,
          note: comparison
            ? translate(locale, {
                en: `Peer reference: ${comparison.population}`,
                th: `เมืองอ้างอิง: ${comparison.population}`,
                zh: `对标城市参考：${comparison.population}`,
              })
            : undefined,
        },
        {
          label: translate(locale, { en: "Land area", th: "พื้นที่", zh: "土地面积" }),
          value: landArea ? formatAreaKm2(landArea) : pendingValue,
          note: landArea
            ? density
              ? translate(locale, {
                  en: `Density ${formatDensity(density)}`,
                  th: `ความหนาแน่น ${formatDensity(density)}`,
                  zh: `人口密度 ${formatDensity(density)}`,
                })
              : densityMethodNote
            : missingAreaLongNote,
        },
        {
          label: translate(locale, { en: "Population density", th: "ความหนาแน่นประชากร", zh: "人口密度" }),
          value: density ? formatDensity(density) : pendingValue,
          note: density ? densityMethodNote : missingAreaLongNote,
        },
        {
          label: translate(locale, { en: "Region", th: "ภูมิภาค", zh: "区域" }),
          value: REGION_LABELS[city.region][locale],
        },
        {
          label: translate(locale, { en: "Smart-city status", th: "สถานะเมืองอัจฉริยะ", zh: "智慧城市状态" }),
          value: getStatusSummary(city, locale),
        },
        cityContext?.established
          ? {
              label: translate(locale, { en: "Established", th: "ก่อตั้ง", zh: "建立时间" }),
              value: cityContext.established,
            }
          : null,
      ]),
    },
    {
      id: "economy",
      title: translate(locale, {
        en: "Economy and market",
        th: "เศรษฐกิจและตลาด",
        zh: "经济与市场",
      }),
      items: compactFacts([
        city.metrics.avgMonthlyIncome
          ? {
              label: translate(locale, { en: "Avg. monthly income", th: "รายได้เฉลี่ยต่อเดือน", zh: "月均收入" }),
              value: formatBahtCompact(city.metrics.avgMonthlyIncome),
            }
          : null,
        city.metrics.gppPerCapita
          ? {
              label: translate(locale, { en: "GPP per capita", th: "GPP ต่อหัว", zh: "人均GPP" }),
              value: formatBahtCompact(city.metrics.gppPerCapita),
            }
          : null,
        city.metrics.gppGrowthRate != null
          ? {
              label: translate(locale, { en: "Growth rate", th: "อัตราเติบโต", zh: "增长率" }),
              value: formatPercent(city.metrics.gppGrowthRate),
            }
          : null,
        city.metrics.laborForce
          ? {
              label: translate(locale, { en: "Labor force", th: "กำลังแรงงาน", zh: "劳动力规模" }),
              value: formatCompactPeople(city.metrics.laborForce),
            }
          : null,
        city.metrics.fdiInflow != null
          ? {
              label: translate(locale, { en: "FDI inflow", th: "FDI", zh: "外商直接投资" }),
              value: formatFdiMillions(city.metrics.fdiInflow),
            }
          : null,
        {
          label: translate(locale, { en: "Economic DNA", th: "DNA เศรษฐกิจ", zh: "经济DNA" }),
          value: economicDNA,
          note: city.metrics.industryComposition ?? undefined,
        },
      ]),
    },
    {
      id: "conditions",
      title: translate(locale, {
        en: "Living conditions and risk",
        th: "สภาพความเป็นอยู่และความเสี่ยง",
        zh: "生活条件与风险",
      }),
      items: ensureFactCoverage(compactFacts([
        city.metrics.pm25Annual != null
          ? {
              label: translate(locale, { en: "PM2.5", th: "PM2.5", zh: "PM2.5" }),
              value: `${formatNumber(city.metrics.pm25Annual, { maximumFractionDigits: 1 })} ug/m³`,
              note: city.metrics.pm25Trend ? PM25_TREND_LABELS[city.metrics.pm25Trend][locale] : undefined,
            }
          : null,
        city.metrics.hospitalBedsPer10k != null
          ? {
              label: translate(locale, { en: "Hospital beds", th: "เตียงโรงพยาบาล", zh: "医院床位" }),
              value: formatPerTenThousand(city.metrics.hospitalBedsPer10k),
            }
          : null,
        city.metrics.crimeRatePer100k != null
          ? {
              label: translate(locale, { en: "Crime rate", th: "อัตราอาชญากรรม", zh: "犯罪率" }),
              value: formatPerHundredThousand(city.metrics.crimeRatePer100k),
            }
          : null,
        city.metrics.greenCoverage != null
          ? {
              label: translate(locale, { en: "Green coverage", th: "พื้นที่สีเขียว", zh: "绿地覆盖率" }),
              value: formatPercent(city.metrics.greenCoverage),
            }
          : null,
        city.metrics.waterQuality != null
          ? {
              label: translate(locale, { en: "Water quality", th: "คุณภาพน้ำ", zh: "水质指数" }),
              value: `${formatNumber(city.metrics.waterQuality, { maximumFractionDigits: 0 })}/100`,
            }
          : null,
        city.metrics.forestCoverage != null
          ? {
              label: translate(locale, { en: "Forest cover", th: "พื้นที่ป่า", zh: "森林覆盖" }),
              value: formatPercent(city.metrics.forestCoverage),
            }
          : null,
      ]), locale),
    },
    {
      id: "positioning",
      title: translate(locale, {
        en: "Context and positioning",
        th: "บริบทและการวางตำแหน่ง",
        zh: "城市语境与定位",
      }),
      items: compactFacts([
        {
          label: translate(locale, { en: "Global analog", th: "เมืองเทียบเคียง", zh: "全球类比" }),
          value: analogHeadline,
          note: comparison
            ? (locale === "zh" ? comparison.whyZh : locale === "th" ? comparison.whyTh : comparison.why)
            : getLocalizedText(locale, research.compareNote),
        },
        {
          label: translate(locale, { en: "Known for", th: "ขึ้นชื่อเรื่อง", zh: "代表特征" }),
          value: contextHighlight,
        },
        {
          label: translate(locale, { en: "Livelihood pattern", th: "วิถีเศรษฐกิจหลัก", zh: "生计结构" }),
          value: getContextText(
            locale,
            cityContext?.livelihood,
            getLocalizedText(locale, research.dailyLife),
            getLocalizedText(locale, research.dailyLife),
          ),
        },
        {
          label: translate(locale, { en: "Main constraint", th: "ข้อจำกัดหลัก", zh: "主要限制" }),
          value: analogyBreak,
        },
      ]),
    },
    {
      id: "investment",
      title: translate(locale, {
        en: "Investment frame",
        th: "กรอบการลงทุน",
        zh: "投资框架",
      }),
      items: compactFacts([
        {
          label: translate(locale, { en: "Developability", th: "ศักยภาพพัฒนา", zh: "可开发性" }),
          value: `${developability.total}% · ${developabilityLabel}`,
          note: translate(locale, {
            en: `Growth ${developability.growthCapacity}% · Infra ${developability.infraReadiness}% · Livability ${developability.livabilityBase}%`,
            th: `เติบโต ${developability.growthCapacity}% · โครงสร้าง ${developability.infraReadiness}% · ความน่าอยู่ ${developability.livabilityBase}%`,
            zh: `增长 ${developability.growthCapacity}% · 基础设施 ${developability.infraReadiness}% · 宜居 ${developability.livabilityBase}%`,
          }),
        },
        {
          label: translate(locale, { en: "Lead mechanism", th: "กลไกนำ", zh: "主机制" }),
          value: leadInstrumentName,
          note: dossier?.leadRecommendation?.reasonSummary[locale] ?? city.financeSignal.line[locale],
        },
        {
          label: translate(locale, { en: "Immediate next move", th: "ก้าวถัดไปทันที", zh: "近期首要动作" }),
          value: leadAction,
          note: leadActionEvidence,
        },
        {
          label: translate(locale, { en: "Capital posture", th: "ท่าทีด้านเงินทุน", zh: "资本姿态" }),
          value: financing.typicalSize,
          note: locale === "zh"
            ? financing.competitiveAdvantageZh
            : locale === "th"
              ? financing.competitiveAdvantageTh
              : financing.competitiveAdvantage,
        },
        {
          label: translate(locale, { en: "Evidence posture", th: "สถานะหลักฐาน", zh: "证据状态" }),
          value: `${dossier?.confidenceLabel ?? DATA_CONFIDENCE_LABELS[city.dataConfidence ?? "medium"][locale]} · ${city.provenanceCount}`,
          note: translate(locale, {
            en: `Latest verified ${formatIsoDate(city.freshness.lastVerifiedAt)} · ${city.evidenceItems.length} evidence items`,
            th: `ตรวจสอบล่าสุด ${formatIsoDate(city.freshness.lastVerifiedAt)} · หลักฐาน ${city.evidenceItems.length} รายการ`,
            zh: `最近核验 ${formatIsoDate(city.freshness.lastVerifiedAt)} · ${city.evidenceItems.length} 条证据`,
          }),
        },
      ]),
    },
  ];

  return (
    <>
      {/* ─── CHAPTER 1 · WHO ─── City identity: hero photo, tier/score/rank, tagline, decision strip, at-a-glance facts. */}
      <div id="who" className="city-chapter city-chapter-who">
      {cityPhoto ? (
        <div className="city-hero-photo">
          <ResponsiveImage
            src={cityPhoto.src}
            alt={cityName}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            style={{ objectPosition: cityPhoto.objectPosition }}
          />
          <div className="city-hero-photo-overlay">
            <div className="city-hero-photo-copy">
              <span className="city-hero-photo-kicker">
                {translate(locale, { en: "SCITI 2026 city dossier", th: "แฟ้มข้อมูลเมือง SCITI 2026", zh: "SCITI 2026 城市档案" })}
              </span>
              <span className="city-hero-photo-title">{cityName}</span>
              <span className="city-hero-photo-subtitle">{heroMeta}</span>
            </div>
            <div className="city-hero-photo-score-card" aria-label={translate(locale, { en: "Composite score", th: "คะแนนรวม", zh: "综合得分" })}>
              <span className="city-hero-photo-score-label">{translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合" })}</span>
              <span className="city-hero-photo-score">{city.compositeScore.toFixed(1)}</span>
              <span className="city-hero-photo-score-note">{tierSymbol} {TIER_LABELS[locale][city.tier]}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`city-hero-gradient city-hero-gradient-${city.tier}`}>
          <div className="city-hero-photo-overlay city-hero-gradient-overlay">
            <div className="city-hero-photo-copy">
              <span className="city-hero-photo-kicker">
                {translate(locale, { en: "SCITI 2026 city dossier", th: "แฟ้มข้อมูลเมือง SCITI 2026", zh: "SCITI 2026 城市档案" })}
              </span>
              <span className="city-hero-photo-title city-hero-gradient-title">{cityName}</span>
              <span className="city-hero-photo-subtitle">{heroMeta}</span>
            </div>
            <div className="city-hero-photo-score-card" aria-label={translate(locale, { en: "Composite score", th: "คะแนนรวม", zh: "综合得分" })}>
              <span className="city-hero-photo-score-label">{translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合" })}</span>
              <span className="city-hero-photo-score city-hero-gradient-score">{city.compositeScore.toFixed(1)}</span>
              <span className="city-hero-photo-score-note">{tierSymbol} {TIER_LABELS[locale][city.tier]}</span>
            </div>
          </div>
        </div>
      )}

      <section className="section city-detail-hero">
        <button
          className="back-link"
          role="link"
          onClick={() => onNavigate("/rankings")}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onNavigate("/rankings");
            }
          }}
        >
          ← {locale === "th" ? "กลับ" : locale === "zh" ? "返回" : "Back"}
        </button>

        <div className="city-detail-header">
          <div>
            <p className="eyebrow">
              {city.status === "certified"
                ? (locale === "th" ? `ตราสัญลักษณ์เมืองอัจฉริยะ · รุ่น ${city.batch}` : locale === "zh" ? `智慧城市认证 · 第 ${city.batch} 批` : `Smart City Local · Batch ${city.batch}`)
                : city.status === "promotion"
                  ? (locale === "th" ? "เขตส่งเสริมเมืองอัจฉริยะ" : locale === "zh" ? "智慧城市推广区" : "Smart City Promotion Zone")
                  : (locale === "th" ? "ข้อเสนอเมืองอัจฉริยะที่ขึ้นทะเบียน" : locale === "zh" ? "已登记智慧城市提案" : "Registered Smart City Proposal")}
            </p>
            <h1>{cityName}</h1>
            <p className="city-detail-province">{provinceName}</p>
          </div>
          <div className="city-detail-score-block">
            <div className={`tier-badge-large tier-${city.tier}`}>
              {tierSymbol} {TIER_LABELS[locale][city.tier]}
            </div>
            <div className="composite-large">{city.compositeScore.toFixed(1)}</div>
            <div className="composite-rank-chip" title={translate(locale, { en: "Rank across all tracked cities", th: "อันดับในเมืองที่เราติดตามทั้งหมด", zh: "在所有受追踪城市中的排名" })}>
              {translate(locale, {
                en: `Rank #${cityRank} of ${cityRankTotal}`,
                th: `อันดับ #${cityRank} จาก ${cityRankTotal}`,
                zh: `排名 #${cityRank} / ${cityRankTotal}`,
              })}
            </div>
            <div className={`reality-badge reality-${city.reality}`}>
              {getCityRealityLabel(city.reality, locale)}
            </div>
            {city.league ? (
              <div className="league-badge" title={LEAGUE_LABELS[locale][city.league]}>
                {LEAGUE_LABELS[locale][city.league]}
              </div>
            ) : null}
          </div>
        </div>

        <p className="city-detail-tagline">{cityTagline}</p>
        <p className="section-intro">{cityOrientation}</p>

        <div className="city-decision-strip" aria-label={translate(locale, { en: "Investor decision brief", th: "สรุปเพื่อการตัดสินใจลงทุน", zh: "投资决策速览" })}>
          <div className="city-decision-item">
            <span className="city-decision-label">{translate(locale, { en: "Lead mechanism", th: "กลไกนำ", zh: "主机制" })}</span>
            <strong className="city-decision-value">{leadInstrumentName}</strong>
            <span className="city-decision-note">{dossier?.leadStepLabel ?? leadAction}</span>
          </div>
          <div className="city-decision-item">
            <span className="city-decision-label">{translate(locale, { en: "Readiness", th: "ความพร้อม", zh: "准备度" })}</span>
            <strong className="city-decision-value">{city.financeProfile.readinessScore}/100</strong>
            <span className="city-decision-note">{deliveryReadinessLabel} · {dossier?.confidenceLabel ?? DATA_CONFIDENCE_LABELS[city.dataConfidence ?? "medium"][locale]}</span>
          </div>
          <div className="city-decision-item">
            <span className="city-decision-label">{translate(locale, { en: "Scale", th: "ขนาดเมือง", zh: "规模" })}</span>
            <strong className="city-decision-value">{populationLabel}</strong>
            <span className="city-decision-note">{scaleNote}</span>
          </div>
          <div className="city-decision-item">
            <span className="city-decision-label">{translate(locale, { en: "Risk lens", th: "มุมมองความเสี่ยง", zh: "风险视角" })}</span>
            <strong className="city-decision-value">{riskProfileLabel}</strong>
            <span className="city-decision-note">{riskPostureNote}</span>
          </div>
          <div className="city-decision-item">
            <span className="city-decision-label">{translate(locale, { en: "Core data", th: "ข้อมูลหลัก", zh: "核心数据" })}</span>
            <strong className="city-decision-value">{dataCoverageValue}</strong>
            <span className="city-decision-note">{missingBasicSummary}</span>
          </div>
        </div>

        {isRegisteredProfile && (
          <div className="city-data-notice">
            <strong>{translate(locale, { en: "Read this as a proposal stub.", th: "อ่านหน้านี้เป็นโปรไฟล์ข้อเสนอ", zh: "请把此页视为提案档案。" })}</strong>
            <span>
              {translate(locale, {
                en: "This city is in the registry, but the quantitative baseline is still thin. The page keeps the investment frame visible while marking missing fields instead of inventing numbers.",
                th: "เมืองนี้อยู่ในทะเบียนแล้ว แต่ฐานข้อมูลเชิงปริมาณยังบาง หน้านี้จึงคงกรอบการลงทุนไว้ พร้อมระบุช่องข้อมูลที่ยังขาด แทนการแต่งตัวเลขขึ้นมา",
                zh: "这座城市已进入登记名单，但量化基线仍然很薄。本页保留投资框架，同时标出缺失字段，而不是编造数字。",
              })}
            </span>
          </div>
        )}

        {/* City-specific handcrafted spotlight */}
        <CitySpotlight cityId={cityId} locale={locale} />

        <div className="city-quick-facts">
          <div className="city-quick-metrics">
            {city.keyMetrics.map(metric => (
              <div key={metric.key} className="city-qm">
                <span className="city-qm-val">{metric.value}</span>
                <span className="city-qm-lab">{metric.label[locale]}</span>
              </div>
            ))}
            <div className="city-qm">
              <span className="city-qm-val">{city.financeSignal.readinessScore}</span>
              <span className="city-qm-lab">{translate(locale, { en: "Readiness", th: "ความพร้อม", zh: "准备度" })}</span>
            </div>
            <div className="city-qm">
              <span className={`city-qm-val city-qm-conf-${city.dataConfidence ?? "medium"}`}>{city.dataConfidence ?? "medium"}</span>
              <span className="city-qm-lab">{translate(locale, { en: "Data confidence", th: "ความเชื่อมั่นข้อมูล", zh: "数据置信度" })}</span>
            </div>
          </div>
        </div>
      </section>

      {(() => {
        const facts = getCityFacts(cityId);
        if (!facts) return null;
        const rows: { label: string; value: string }[] = [];
        if (facts.nativeName) {
          rows.push({
            label: translate(locale, { en: "Native name", th: "ชื่อพื้นถิ่น", zh: "本地名称" }),
            value: facts.nativeName,
          });
        }
        if (facts.geography) {
          rows.push({
            label: translate(locale, { en: "Geography", th: "ภูมิประเทศ", zh: "地理" }),
            value: translate(locale, facts.geography),
          });
        }
        if (facts.elevationM != null) {
          rows.push({
            label: translate(locale, { en: "Elevation", th: "ความสูง", zh: "海拔" }),
            value: `${facts.elevationM} m`,
          });
        }
        if (facts.distanceFromBangkokKm != null) {
          const km = facts.distanceFromBangkokKm;
          rows.push({
            label: translate(locale, { en: "From Bangkok", th: "จากกรุงเทพ", zh: "距曼谷" }),
            value: km === 0
              ? translate(locale, { en: "In Bangkok", th: "ในกรุงเทพ", zh: "位于曼谷" })
              : `${km} km${facts.driveTimeFromBangkok ? " · " + translate(locale, facts.driveTimeFromBangkok) : ""}`,
          });
        } else if (facts.driveTimeFromBangkok) {
          rows.push({
            label: translate(locale, { en: "From Bangkok", th: "จากกรุงเทพ", zh: "距曼谷" }),
            value: translate(locale, facts.driveTimeFromBangkok),
          });
        }
        if (facts.iata) {
          rows.push({
            label: translate(locale, { en: "Airport (IATA)", th: "สนามบิน (IATA)", zh: "机场 (IATA)" }),
            value: facts.iata,
          });
        }
        if (facts.postalPrefix) {
          rows.push({
            label: translate(locale, { en: "Postal", th: "รหัสไปรษณีย์", zh: "邮编" }),
            value: facts.postalPrefix,
          });
        }
        if (facts.foundedEra) {
          rows.push({
            label: translate(locale, { en: "Era / founded", th: "ยุค / ก่อตั้ง", zh: "历史 / 建制" }),
            value: translate(locale, facts.foundedEra),
          });
        }
        if (facts.notableInstitution) {
          rows.push({
            label: translate(locale, { en: "Notable institution", th: "สถาบันสำคัญ", zh: "重要机构" }),
            value: translate(locale, facts.notableInstitution),
          });
        }
        if (facts.dialect) {
          rows.push({
            label: translate(locale, { en: "Language / dialect", th: "ภาษา / สำเนียง", zh: "语言 / 方言" }),
            value: translate(locale, facts.dialect),
          });
        }
        if (rows.length === 0) return null;
        return (
          <section className="section at-a-glance">
            <p className="eyebrow">{translate(locale, { en: "At a glance", th: "ภาพรวมโดยย่อ", zh: "一览" })}</p>
            <h2 className="at-a-glance-title">
              {translate(locale, {
                en: "The basics before the dossier",
                th: "ข้อมูลพื้นฐานก่อนเข้าสู่แฟ้มเมือง",
                zh: "档案之前的基本事实",
              })}
            </h2>
            <dl className="at-a-glance-grid">
              {rows.map(row => (
                <div key={row.label} className="at-a-glance-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })()}
      </div>

      {/* ─── CHAPTER 2 · WHAT ─── The substance: reality-gap dossier, Moneyball band, performance triptych, analog comparison, factbook, city research. */}
      <div id="what" className="city-chapter city-chapter-what">
      {dossier && (
        <section className="section city-dossier-section">
          <p className="eyebrow">{translate(locale, { en: "Reality gap dossier", th: "แฟ้มช่องว่างระหว่างแผนกับความจริง", zh: "现实缺口档案" })}</p>
          <h2>{translate(locale, {
            en: "What is real now, what is missing, and what unlocks the next step",
            th: "อะไรจริงแล้ว อะไรยังขาด และอะไรจะปลดล็อกก้าวถัดไป",
            zh: "什么已经真实落地，什么仍然缺失，以及下一步靠什么被解锁",
          })}</h2>
          <div className="city-dossier-shell">
            <div className="city-dossier-main">
              <div className="city-dossier-lead">
                <div className="city-dossier-chip-row">
                  <span className={`city-dossier-chip city-dossier-chip-${city.reality}`}>{getCityRealityLabel(city.reality, locale)}</span>
                  <span className="city-dossier-chip city-dossier-chip-tier">{tierSymbol} {TIER_LABELS[locale][city.tier]}</span>
                  <span className={`city-dossier-chip city-dossier-chip-confidence city-dossier-chip-confidence-${dossier.confidence}`}>
                    {dossier.confidenceLabel}
                  </span>
                </div>
                <p className="city-dossier-thesis">{dossier.operatingSummary}</p>
                <p className="city-dossier-summary">{dossier.gapSummary}</p>
                <div className="record-grid city-dossier-record-grid">
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Lead step", th: "ขั้นนำ", zh: "领先步骤" })}</span>
                    <span className="record-value">{dossier.leadStepLabel}</span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Ready", th: "พร้อม", zh: "就绪" })}</span>
                    <span className="record-value">{dossier.readySteps.length}/5</span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Building", th: "กำลังสร้าง", zh: "建设中" })}</span>
                    <span className="record-value">{dossier.buildingSteps.length}/5</span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Gap", th: "ยังขาด", zh: "缺口" })}</span>
                    <span className="record-value">{dossier.gapSteps.length}/5</span>
                  </div>
                </div>
              </div>

              <div className="city-dossier-grid">
                {dossier.cards.map(card => (
                  <article key={card.id} className="city-dossier-card">
                    <span className="city-dossier-card-label">{card.label}</span>
                    <p className="city-dossier-card-body">{card.body}</p>
                    <span className="city-dossier-card-meta">{card.meta}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="city-dossier-rail">
              <div className="city-dossier-panel">
                <span className="city-dossier-panel-label">{translate(locale, { en: "Verification", th: "การตรวจสอบ", zh: "核验" })}</span>
                <p className="city-dossier-panel-copy">{dossier.verificationSummary}</p>
                <div className="record-grid city-dossier-record-grid">
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Latest observed", th: "ข้อมูลล่าสุด", zh: "最新观测" })}</span>
                    <span className="record-value">
                      {formatIsoDate(city.freshness.latestObservedAt)}
                      <span className={`freshness-chip freshness-chip-${freshnessTone}`}>{freshnessChipText}</span>
                    </span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Last verified", th: "ตรวจสอบล่าสุด", zh: "最近核验" })}</span>
                    <span className="record-value">{formatIsoDate(city.freshness.lastVerifiedAt)}</span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Evidence items", th: "รายการหลักฐาน", zh: "证据条目" })}</span>
                    <span className="record-value">{city.evidenceItems.length}</span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">{translate(locale, { en: "Research grade", th: "สถานะวิจัย", zh: "研究级状态" })}</span>
                    <span className="record-value">
                      {city.exportReady
                        ? translate(locale, { en: "Ready", th: "พร้อม", zh: "就绪" })
                        : translate(locale, { en: "Building", th: "กำลังสร้าง", zh: "建设中" })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="city-dossier-panel">
                <span className="city-dossier-panel-label">{translate(locale, { en: "Delivery ladder", th: "บันไดการส่งมอบ", zh: "交付阶梯" })}</span>
                <div className="city-dossier-steps">
                  {DELIVERY_STEPS.map(step => {
                    const status = city.deliveryProfile[step.key];
                    return (
                      <div key={step.key} className="city-dossier-step">
                        <span className="city-dossier-step-name">{compactStepLabel(step.label[locale])}</span>
                        <span className={`city-dossier-step-status city-dossier-step-status-${status}`}>
                          {DELIVERY_STATUS_LABELS[status][locale]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="city-dossier-panel city-dossier-panel-accent">
                <span className="city-dossier-panel-label">{translate(locale, { en: "Lead mechanism", th: "กลไกนำ", zh: "主机制" })}</span>
                <h3 className="city-dossier-panel-title">{leadInstrumentName}</h3>
                <p className="city-dossier-panel-copy">
                  {dossier.leadRecommendation?.reasonSummary[locale] ?? city.financeSignal.line[locale]}
                </p>
                <p className="city-dossier-panel-note">
                  {dossier.leadRecommendation?.nextStep[locale] ?? city.deliveryProfile.deliveryNote[locale]}
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}

      {(() => {
        const moneyball = getMoneyballProfile(city);
        const topEdges = moneyball.edges.filter(e => e.advantage).slice(0, 3);
        if (topEdges.length === 0) return null;
        return (
          <section className="section reveal visible moneyball-band">
            <p className="eyebrow">
              {translate(locale, {
                en: "Moneyball read",
                th: "อ่านแบบมันนี่บอล",
                zh: "点球成金读数",
              })}
            </p>
            <h2 className="section-title">
              {translate(locale, {
                en: "Why this city, not Bangkok",
                th: "ทำไมต้องเมืองนี้ ไม่ใช่กรุงเทพ",
                zh: "为什么是这座城市而非曼谷",
              })}
            </h2>
            <p className="moneyball-headline">
              {locale === "th" ? moneyball.headlineTh : moneyball.headline}
            </p>
            <div className="moneyball-edge-list">
              {topEdges.map((edge, idx) => (
                <div key={idx} className="moneyball-edge-row">
                  <span className="moneyball-edge-label">
                    {locale === "th" ? edge.labelTh : edge.label}
                  </span>
                  <span className="moneyball-edge-value">{edge.value}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      <section className="section performance-triptych city-print-hide">
        <p className="eyebrow">{translate(locale, { en: "Performance", th: "ประสิทธิภาพ", zh: "表现" })}</p>
        <h2>{translate(locale, { en: "Pillar scores, score math, and developability", th: "คะแนนรายเสาหลัก วิธีคำนวณ และความสามารถในการพัฒนา", zh: "七大支柱、计算方式与可开发性" })}</h2>

        <div className="rpg-layout">
          <div className="rpg-radar-panel">
            <RadarChart scores={city.scores} locale={locale} />
            <div className="rpg-overall-grade">
              <span className="rpg-grade-label">
                {translate(locale, { en: "Rank", th: "ระดับ", zh: "评级" })}
              </span>
              <span className="rpg-grade-letter" style={{ color: gradeColor(overallGrade) }}>
                {overallGrade}
              </span>
            </div>
          </div>

          <div className="rpg-stats-panel">
            {SCORING_PILLARS.map(pillar => (
              <StatBar key={pillar} pillar={pillar} value={city.scores[pillar]} locale={locale} />
            ))}
          </div>
        </div>

        <div className="triptych-subsection">
          <h3 className="triptych-subtitle">{locale === "th" ? "ตัวเลขมาจากไหน" : locale === "zh" ? "这些数字怎么来的" : "Where the numbers come from"}</h3>
          <ScoreBreakdown scores={city.scores} locale={locale} />
        </div>

        <div className="triptych-subsection">
          <h3 className="triptych-subtitle">{translate(locale, { en: "Developability assessment", th: "การประเมินความสามารถในการพัฒนา", zh: "可开发性评估" })}</h3>
          <div className="dev-score-grid">
            <div className="dev-score-main">
              <span className="dev-score-pct">{developability.total}%</span>
              <span className="dev-score-label">{locale === "zh" ? developability.labelZh : locale === "th" ? developability.labelTh : developability.label}</span>
              {tierMedianDelta != null && (
                <span className={`dev-score-delta dev-score-delta-${tierMedianDelta >= 0 ? "pos" : "neg"}`}>
                  {tierMedianDelta >= 0 ? "+" : ""}{tierMedianDelta} {translate(locale, { en: `vs ${tierSymbolForMedian} median`, th: `เทียบค่ากลาง ${tierSymbolForMedian}`, zh: `对比 ${tierSymbolForMedian} 中位` })}
                </span>
              )}
            </div>
            <div className="dev-score-breakdown">
              <div className="dev-metric"><span className="dev-metric-val">{developability.growthCapacity}%</span><span className="dev-metric-lab">{translate(locale, { en: "Growth capacity", th: "ศักยภาพเติบโต", zh: "增长能力" })}</span></div>
              <div className="dev-metric"><span className="dev-metric-val">{developability.infraReadiness}%</span><span className="dev-metric-lab">{translate(locale, { en: "Infra readiness", th: "ความพร้อมโครงสร้าง", zh: "基础设施就绪度" })}</span></div>
              <div className="dev-metric"><span className="dev-metric-val">{developability.livabilityBase}%</span><span className="dev-metric-lab">{translate(locale, { en: "Livability base", th: "ฐานความน่าอยู่", zh: "宜居基础" })}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section city-analog-section">
        <p className="eyebrow">{translate(locale, { en: "Investor shortcut", th: "ทางลัดสำหรับนักลงทุน", zh: "投资者速读" })}</p>
        <h2>{translate(locale, {
          en: "How to picture this city in 30 seconds",
          th: "นึกภาพเมืองนี้ให้ได้ใน 30 วินาที",
          zh: "30秒读懂这座城市",
        })}</h2>
        <div className="city-analog-shell">
          <div className="city-analog-main">
            <div className="city-analog-lead">
              <span className="city-analog-kicker">{translate(locale, { en: "Global analog", th: "เมืองเทียบเคียง", zh: "全球类比城市" })}</span>
              <h3 className="city-analog-headline">
                {comparison
                  ? translate(locale, {
                      en: `${cityName} reads faster if you think of ${comparison.worldCity}, ${comparison.country}.`,
                      th: `${cityName} จะเข้าใจได้เร็วขึ้นถ้านึกถึง ${comparison.worldCity}, ${comparison.country}`,
                      zh: `如果先想到 ${comparison.worldCity}, ${comparison.country}，就能更快理解 ${cityName}。`,
                    })
                  : translate(locale, {
                      en: `${cityName} needs a fast investor mental model.`,
                      th: `${cityName} ต้องมีโมเดลทางความคิดสำหรับนักลงทุนที่อ่านเร็ว`,
                      zh: `${cityName} 需要一个适合投资者快速理解的心智模型。`,
                    })}
              </h3>
              <p className="city-analog-copy">{getLocalizedText(locale, research.dailyLife)}</p>
              <div className="city-analog-tag-row">
                <span className="city-analog-tag">{geographicSignal}</span>
                <span className="city-analog-tag">{economicDNA}</span>
                <span className="city-analog-tag">
                  {translate(locale, {
                    en: `${city.smartDimensions.length} smart dimensions in play`,
                    th: `ขับเคลื่อน ${city.smartDimensions.length} มิติอัจฉริยะ`,
                    zh: `覆盖 ${city.smartDimensions.length} 个智慧维度`,
                  })}
                </span>
              </div>
              <p className="city-analog-note">{contextHighlight}</p>
            </div>

            <div className="city-analog-metric-grid">
              <div className="city-analog-metric">
                <span className="city-analog-metric-label">{translate(locale, { en: "Population", th: "ประชากร", zh: "人口" })}</span>
                <span className="city-analog-metric-value">{populationLabel}</span>
                <span className="city-analog-metric-note">
                  {comparison
                    ? translate(locale, {
                        en: `Peer reference ${comparison.population}`,
                        th: `เมืองอ้างอิง ${comparison.population}`,
                        zh: `对标参考 ${comparison.population}`,
                      })
                    : REGION_LABELS[city.region][locale]}
                </span>
              </div>
              <div className="city-analog-metric">
                <span className="city-analog-metric-label">{translate(locale, { en: "Land area", th: "พื้นที่", zh: "土地面积" })}</span>
                <span className="city-analog-metric-value">{landArea ? formatAreaKm2(landArea) : pendingValue}</span>
                <span className="city-analog-metric-note">
                  {density
                    ? translate(locale, {
                        en: `Density ${formatDensity(density)}`,
                        th: `ความหนาแน่น ${formatDensity(density)}`,
                        zh: `人口密度 ${formatDensity(density)}`,
                      })
                    : missingAreaShortNote}
                </span>
              </div>
              <div className="city-analog-metric">
                <span className="city-analog-metric-label">{translate(locale, { en: "Avg. income", th: "รายได้เฉลี่ย", zh: "平均收入" })}</span>
                <span className="city-analog-metric-value">
                  {city.metrics.avgMonthlyIncome ? formatBahtCompact(city.metrics.avgMonthlyIncome) : "—"}
                </span>
                <span className="city-analog-metric-note">
                  {city.metrics.gppPerCapita
                    ? translate(locale, {
                        en: `GPP/capita ${formatBahtCompact(city.metrics.gppPerCapita)}`,
                        th: `GPP/หัว ${formatBahtCompact(city.metrics.gppPerCapita)}`,
                        zh: `人均GPP ${formatBahtCompact(city.metrics.gppPerCapita)}`,
                      })
                    : translate(locale, { en: "Economic baseline still thin", th: "ฐานเศรษฐกิจยังบาง", zh: "经济基线仍偏薄" })}
                </span>
              </div>
              <div className="city-analog-metric">
                <span className="city-analog-metric-label">{translate(locale, { en: "Economic DNA", th: "DNA เศรษฐกิจ", zh: "经济DNA" })}</span>
                <span className="city-analog-metric-value">{economicDNA}</span>
                <span className="city-analog-metric-note">
                  {city.metrics.gppGrowthRate != null
                    ? translate(locale, {
                        en: `Growth ${formatPercent(city.metrics.gppGrowthRate)}`,
                        th: `เติบโต ${formatPercent(city.metrics.gppGrowthRate)}`,
                        zh: `增长 ${formatPercent(city.metrics.gppGrowthRate)}`,
                      })
                    : translate(locale, { en: "Growth rate not curated yet", th: "ยังไม่มีอัตราเติบโต", zh: "增长率尚未整理" })}
                </span>
              </div>
            </div>
          </div>

          <aside className="city-analog-rail">
            <div className="city-analog-panel">
              <span className="city-analog-panel-label">{translate(locale, { en: "Why the analogy works", th: "ทำไมถึงเทียบกันได้", zh: "为什么这个类比成立" })}</span>
              <p className="city-analog-panel-copy">
                {comparison
                  ? (locale === "zh" ? comparison.whyZh : locale === "th" ? comparison.whyTh : comparison.why)
                  : getLocalizedText(locale, research.compareNote)}
              </p>
            </div>
            <div className="city-analog-panel">
              <span className="city-analog-panel-label">{translate(locale, { en: "Investor takeaway", th: "ประเด็นสำหรับนักลงทุน", zh: "投资者要点" })}</span>
              <p className="city-analog-panel-copy">{investorTakeaway}</p>
            </div>
            <div className="city-analog-panel">
              <span className="city-analog-panel-label">{translate(locale, { en: "Where the analogy breaks", th: "จุดที่ความเทียบเคียงใช้ไม่ได้", zh: "这个类比失效的地方" })}</span>
              <p className="city-analog-panel-copy">{analogyBreak}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section city-factbook-section">
        <div className="city-factbook-header">
          <div>
            <p className="eyebrow">{translate(locale, { en: "City factbook", th: "สมุดข้อมูลเมือง", zh: "城市事实册" })}</p>
            <h2>{translate(locale, {
              en: "Printable baseline for investment discussions",
              th: "ฐานข้อมูลแบบพิมพ์ได้สำหรับคุยแผนลงทุน",
              zh: "可打印的投资讨论基础资料",
            })}</h2>
          </div>
          <p className="city-factbook-freshness">
            {translate(locale, {
              en: `Latest observed ${formatIsoDate(city.freshness.latestObservedAt)} · Last verified ${formatIsoDate(city.freshness.lastVerifiedAt)}`,
              th: `ข้อมูลล่าสุด ${formatIsoDate(city.freshness.latestObservedAt)} · ตรวจสอบล่าสุด ${formatIsoDate(city.freshness.lastVerifiedAt)}`,
              zh: `最新观测 ${formatIsoDate(city.freshness.latestObservedAt)} · 最近核验 ${formatIsoDate(city.freshness.lastVerifiedAt)}`,
            })}
            <span className={`freshness-chip freshness-chip-${freshnessTone}`} style={{ marginLeft: ".5rem" }}>{freshnessChipText}</span>
          </p>
        </div>
        <div className="city-factbook-grid">
          {factbookGroups.map(group => (
            <section key={group.id} className="city-factbook-group">
              <h3 className="city-factbook-title">{group.title}</h3>
              <div className="city-factbook-rows">
                {group.items.map(item => (
                  <div key={`${group.id}-${item.label}`} className="city-factbook-row">
                    <span className="city-factbook-label">{item.label}</span>
                    <div className="city-factbook-value-wrap">
                      <span className="city-factbook-value">{item.value}</span>
                      {item.note && <span className="city-factbook-note">{item.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="section city-research-section">
        <p className="eyebrow">{translate(locale, { en: "City texture", th: "เนื้อเมือง", zh: "城市肌理" })}</p>
        <h2>{translate(locale, { en: "What the place is really made of", th: "เมืองนี้จริงๆ ทำมาจากอะไร", zh: "这座城市真正由什么构成" })}</h2>
        <div className="city-research-grid">
          <div className="city-research-card city-research-card-wide">
            <span className="city-research-label">{translate(locale, { en: "Major industries", th: "อุตสาหกรรมหลัก", zh: "主要产业" })}</span>
            <div className="city-research-chip-row">
              {getLocalizedList(locale, research.industries).map(industry => (
                <span key={`${city.id}-${industry}`} className="city-research-chip">{industry}</span>
              ))}
            </div>
            <p className="city-research-body">{getLocalizedText(locale, research.compareNote)}</p>
          </div>
          <div className="city-research-card">
            <span className="city-research-label">{translate(locale, { en: "How people live", th: "คนใช้ชีวิตอย่างไร", zh: "人们如何生活" })}</span>
            <p className="city-research-body">{getLocalizedText(locale, research.dailyLife)}</p>
          </div>
          <div className="city-research-card">
            <span className="city-research-label">{translate(locale, { en: "Signature story", th: "เรื่องเล่าหลัก", zh: "代表故事" })}</span>
            <p className="city-research-body">{getLocalizedText(locale, research.signatureStory)}</p>
          </div>
          <div className="city-research-card">
            <span className="city-research-label">{translate(locale, { en: "Fun fact", th: "เกร็ดสนุก", zh: "趣味事实" })}</span>
            <p className="city-research-body">{getLocalizedText(locale, research.funFact)}</p>
          </div>
        </div>
      </section>
      </div>

      {/* ─── CHAPTER 3 · HOW ─── Execution path: delivery profile (five steps from logo to operating city) and tailored finance stack. */}
      <div id="how" className="city-chapter city-chapter-how">
      <section className="section city-print-hide">
        <div className="planning-section-header">
          <div>
            <p className="eyebrow">{translate(locale, { en: "Delivery profile", th: "โปรไฟล์การส่งมอบ", zh: "交付画像" })}</p>
            <h2>{translate(locale, { en: "Five steps from logo to operating city", th: "ห้าขั้นจากโลโก้สู่เมืองที่เดินได้จริง", zh: "从标识走到真正运营城市的五个步骤" })}</h2>
          </div>
          <button
            type="button"
            className="ghost-button csv-download"
            onClick={() => downloadCsv(`sciti-2026-${city.id}-facts.csv`, getCityFactsCsv(city.id))}
          >
            {translate(locale, { en: "Export city CSV", th: "ส่งออก CSV เมือง", zh: "导出城市 CSV" })}
          </button>
        </div>
        <p className="section-intro">{city.deliveryProfile.deliveryNote[locale]}</p>
        <div className="planning-stack">
          {DELIVERY_STEPS.map(step => {
            const status = city.deliveryProfile[step.key];
            return (
              <div key={step.key} className="planning-step">
                <div className="planning-step-header-row">
                  <div>
                    <h3 className="planning-step-title">{step.label[locale]}</h3>
                    <p className="planning-step-desc">
                      {step.key === "visionStatus"
                        ? city.deliveryProfile.publicRole[locale]
                        : step.key === "infrastructureStatus"
                          ? city.deliveryProfile.contractLens[locale]
                          : step.key === "dataPlatformStatus"
                            ? city.deliveryProfile.riskAllocation[locale]
                            : step.key === "businessModelStatus"
                              ? city.deliveryProfile.privateRole[locale]
                              : city.financeSignal.line[locale]}
                    </p>
                  </div>
                  <span className={`planning-step-status planning-step-status-${status}`}>
                    {DELIVERY_STATUS_LABELS[status][locale]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="record-grid" style={{ marginTop: "1rem" }}>
          <div className="record-item">
            <span className="record-label">{translate(locale, { en: "Lead step", th: "ขั้นนำ", zh: "领先步骤" })}</span>
            <span className="record-value">{city.deliveryProfile.recommendedLeadStep}</span>
          </div>
          <div className="record-item">
            <span className="record-label">{translate(locale, { en: "Latest observed", th: "ข้อมูลล่าสุด", zh: "最新观测" })}</span>
            <span className="record-value">{formatIsoDate(city.freshness.latestObservedAt)}</span>
          </div>
          <div className="record-item">
            <span className="record-label">{translate(locale, { en: "Provenance rows", th: "แถวหลักฐาน", zh: "溯源行数" })}</span>
            <span className="record-value">{city.provenanceCount}</span>
          </div>
        </div>
      </section>

      <section className="section city-print-hide">
        <p className="eyebrow">{translate(locale, { en: "Tailored finance", th: "การเงินเฉพาะเมือง", zh: "定制融资" })}</p>
        <h2>{translate(locale, { en: "Which mechanism actually fits this city", th: "กลไกไหนที่เข้ากับเมืองนี้จริง", zh: "什么机制真的适合这座城市" })}</h2>
        {(() => {
          const strengthFill: Record<"strong" | "moderate" | "thin", number> = { strong: 3, moderate: 2, thin: 1 };
          const strengthBars: Array<{ key: "revenueBase" | "institutionalCapacity" | "projectPipeline" | "privateInterest"; label: { en: string; th: string; zh: string } }> = [
            { key: "revenueBase",           label: { en: "Revenue base",           th: "ฐานรายได้",     zh: "收入基础" } },
            { key: "institutionalCapacity", label: { en: "Institutional capacity", th: "ศักยภาพสถาบัน", zh: "机构能力" } },
            { key: "projectPipeline",       label: { en: "Project pipeline",       th: "ท่อโครงการ",     zh: "项目管线" } },
            { key: "privateInterest",       label: { en: "Private interest",       th: "ความสนใจเอกชน", zh: "私营兴趣" } },
          ];
          const readinessClass = `readiness-${city.financeProfile.deliveryReadiness}`;
          const riskClass = `risk-${city.financeProfile.riskProfile}`;
          return (
            <div className="finance-readiness-banner">
              <div className="finance-readiness-headline">
                <div className="finance-readiness-score-wrap">
                  <span className="finance-readiness-score">{city.financeProfile.readinessScore}</span>
                  <span className="finance-readiness-score-unit">/100</span>
                </div>
                <div className="finance-readiness-meta">
                  <span className="finance-readiness-caption">{translate(locale, { en: "Overall finance readiness", th: "ความพร้อมทางการเงินโดยรวม", zh: "整体融资准备度" })}</span>
                  <div className="finance-readiness-pills">
                    <span className={`finance-readiness-pill ${readinessClass}`}>{FINANCE_READINESS_LABELS[city.financeProfile.deliveryReadiness][locale]}</span>
                    <span className={`finance-readiness-pill ${riskClass}`}>{translate(locale, { en: "Risk", th: "ความเสี่ยง", zh: "风险" })} · {FINANCE_RISK_LABELS[city.financeProfile.riskProfile][locale]}</span>
                  </div>
                </div>
              </div>
              <div className="finance-strength-bar-grid">
                {strengthBars.map(bar => {
                  const value = city.financeProfile[bar.key];
                  const filled = strengthFill[value];
                  return (
                    <div key={bar.key} className="finance-strength-bar">
                      <span className="finance-strength-label">{bar.label[locale]}</span>
                      <div className="finance-strength-segments" role="img" aria-label={`${bar.label[locale]}: ${FINANCE_STRENGTH_LABELS[value][locale]}`}>
                        {[1, 2, 3].map(i => (
                          <span key={i} className={`finance-strength-segment ${i <= filled ? `finance-strength-fill finance-strength-fill-${value}` : ""}`} />
                        ))}
                      </div>
                      <span className={`finance-strength-value finance-strength-value-${value}`}>{FINANCE_STRENGTH_LABELS[value][locale]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="finance-grid">
          {city.financeRecommendations.map(recommendation => {
            const instrument = instrumentLookup.get(recommendation.instrumentId);
            return (
              <div
                key={recommendation.id}
                className={`finance-card ${recommendation.priority === "lead" ? "finance-card-primary" : ""}`}
              >
                <div className="finance-card-kicker">
                  {recommendation.priority === "lead"
                    ? translate(locale, { en: "Lead mechanism", th: "กลไกนำ", zh: "主机制" })
                    : recommendation.priority === "secondary"
                      ? translate(locale, { en: "Secondary mechanism", th: "กลไกรอง", zh: "次机制" })
                      : translate(locale, { en: "Watchlist", th: "เฝ้าดู", zh: "观察名单" })}
                </div>
                <h3 className="finance-card-title">{locale === "th" ? (instrument?.nameTh ?? recommendation.instrumentName) : recommendation.instrumentName}</h3>
                <p className="finance-card-body">{instrument?.desc[locale] ?? recommendation.reasonSummary[locale]}</p>
                <p className="finance-card-body finance-card-consideration">{recommendation.reasonSummary[locale]}</p>
                <div className="finance-card-meta">
                  <span className="finance-card-meta-label">{translate(locale, { en: "Why now", th: "ทำไมตอนนี้", zh: "为什么是现在" })}</span>
                  <span className="finance-card-meta-value">{recommendation.whyNow[locale]}</span>
                </div>
                <div className="finance-card-meta">
                  <span className="finance-card-meta-label">{translate(locale, { en: "Next step", th: "ก้าวถัดไป", zh: "下一步" })}</span>
                  <span className="finance-card-meta-value">{recommendation.nextStep[locale]}</span>
                </div>
                <div className="record-grid" style={{ marginTop: "1rem" }}>
                  {recommendation.supports.map(support => (
                    <div key={support.id} className="record-item">
                      <span className="record-label">{support.supportType === "metric" ? (support.metricLabel ?? support.metricKey) : translate(locale, { en: "Evidence", th: "หลักฐาน", zh: "证据" })}</span>
                      <span className="record-value">{support.summary}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      </div>

      {/* ─── CHAPTER 4 · WHY ─── The evidence backbone: metric blocks, data rails, proof points, and the source trail that makes every claim audit-ready. */}
      <div id="why" className="city-chapter city-chapter-why">
      <section className="section city-print-hide">
        <p className="eyebrow">{translate(locale, { en: "Metric blocks", th: "ชุดตัวชี้วัด", zh: "指标模块" })}</p>
        <h2>{translate(locale, { en: "The evidence backbone", th: "โครงหลักฐานของเมือง", zh: "证据骨架" })}</h2>
        <div className="delivery-stack-grid">
          {city.metricBlocks.map(block => (
            <div key={block.id} className="delivery-column">
              <h3 className="delivery-column-title">{block.title[locale]}</h3>
              <p className="section-intro" style={{ marginBottom: "0.8rem" }}>{block.summary[locale]}</p>
              <div className="delivery-list">
                {block.observations.map(observation => (
                  <div key={observation.metricKey} className="delivery-item">
                    <div className="delivery-item-title">{observation.label[locale]}</div>
                    <p className="delivery-item-body">
                      {observation.metricValueText}
                      {observation.unit ? ` ${observation.unit}` : ""}
                      {" · "}
                      {observation.sourceName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section city-print-hide">
        <p className="eyebrow">{translate(locale, { en: "Data rails", th: "รางข้อมูล", zh: "数据轨道" })}</p>
        <h2>{translate(locale, { en: "How this city becomes research-grade", th: "ทำอย่างไรให้เมืองนี้ถึงเกณฑ์คุณภาพระดับงานวิจัย", zh: "这座城市如何达到研究级" })}</h2>
        <div className="data-rail-grid">
          {city.dataRails.map(rail => (
            <div key={rail.id} className="data-rail-card">
              <div className="data-rail-label">{rail.label[locale]}</div>
              <p className="data-rail-body">{rail.description[locale]}</p>
              <a href={rail.sourceUrl} target={rail.sourceUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                {rail.sourceUrl}
              </a>
            </div>
          ))}
        </div>
        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="cta-button"
            onClick={() => downloadCsv("sciti-2026-city-summaries.csv", getCitySummariesCsv())}
          >
            {translate(locale, { en: "Export summary CSV", th: "ส่งออกไฟล์สรุป CSV", zh: "导出 summary CSV" })}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => downloadCsv("sciti-2026-city-facts.csv", getCityFactsCsv())}
          >
            {translate(locale, { en: "Export fact rows CSV", th: "ส่งออกข้อมูลรายแถว CSV", zh: "导出事实行 CSV" })}
          </button>
        </div>
      </section>

      <section className="section city-print-hide">
        <p className="eyebrow">{translate(locale, { en: "Proof points", th: "ข้อพิสูจน์", zh: "要点证据" })}</p>
        <h2>{locale === "th" ? "สิ่งที่ทำได้จริง" : locale === "zh" ? "真正运作的东西" : "What actually works"}</h2>
        <ul className="highlights-list">
          {city.highlights.length > 0
            ? city.highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">{highlight}</li>
              ))
            : (
                <li className="highlight-item highlight-item-empty">
                  {translate(locale, {
                    en: "No verified implementation highlights are curated yet. Treat this page as a discovery lead until evidence rows are added.",
                    th: "ยังไม่มีจุดเด่นการดำเนินงานที่ได้รับการยืนยัน ขอให้ใช้หน้านี้เป็นเบาะแสเบื้องต้นสำหรับค้นคว้าเพิ่มเติม จนกว่าจะมีการเพิ่มหลักฐาน",
                    zh: "尚未整理出已核验的实施亮点。在补充证据行之前，请把此页视为发现线索。",
                  })}
                </li>
              )}
        </ul>
      </section>

      {city.evidenceItems.length > 0 && (
        <section className="section city-print-hide">
          <p className="eyebrow">{translate(locale, { en: "Source trail", th: "ร่องรอยแหล่งข้อมูล", zh: "数据溯源" })}</p>
          <h2>{locale === "th" ? "ข้อมูลมาจากไหน" : locale === "zh" ? "数据从哪里来" : "Where the data comes from"}</h2>
          <div className="evidence-feed">
            {city.evidenceItems.map((item, index) => (
              <div key={`${item.cityId}-${index}`} className="evidence-item">
                <div className="evidence-meta">
                  <span className={`evidence-type evidence-type-${item.type}`}>
                    {item.type === "news" ? "NEWS" : item.type === "data" ? "DATA" : item.type === "field" ? "FIELD" : item.type === "satellite" ? "SAT" : "GOV"}
                  </span>
                  <span className="evidence-pillar">{item.pillar}</span>
                  <span className="evidence-date">{item.date}</span>
                </div>
                <div className="evidence-title">
                  {locale === "th" ? item.titleTh : locale === "zh" ? item.titleZh : item.titleEn}
                </div>
                <div className="evidence-source">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">{item.source} →</a>
                  ) : (
                    <span>{item.source}</span>
                  )}
                  {item.value && <span className="evidence-value">{item.metric}: {item.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>

      {/* ─── CHAPTER 5 · NEXT ─── The move: tailored action steps, research links for deeper work, and the depa dimensions in scope. */}
      <div id="next" className="city-chapter city-chapter-next">
      <section className="section city-print-hide">
        <p className="eyebrow">{translate(locale, { en: "What to do next", th: "ก้าวต่อไป", zh: "下一步行动" })}</p>
        <h2>{translate(locale, { en: "Tailored action steps", th: "ขั้นตอนปฏิบัติเฉพาะเมืองนี้", zh: "定制行动步骤" })}</h2>
        <div className="action-steps-list">
          {steps.map((s, i) => (
            <div key={i} className="action-step-card">
              <div className="action-step-num">{i + 1}</div>
              <div>
                <strong>{locale === "zh" ? s.stepZh : locale === "th" ? s.stepTh : s.step}</strong>
                <p className="action-step-example">{locale === "zh" ? s.worldExampleZh : locale === "th" ? s.worldExampleTh : s.worldExample}</p>
                <span className="action-step-source">{s.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">{translate(locale, { en: "Research links", th: "ลิงก์งานวิจัย", zh: "研究链接" })}</p>
        <h2>{translate(locale, { en: "Go deeper without hallucinating", th: "ขุดต่อได้โดยไม่ต้องเดา", zh: "继续深挖而不靠幻觉" })}</h2>
        <div className="sources-grid">
          {researchLinks.map(link => (
            <div key={link.url} className="source-card">
              <div className="source-card-type">LINK</div>
              <div className="source-card-name">{link.label}</div>
              <div className="source-card-desc">{link.url}</div>
              <div className="source-card-freq">
                <a href={link.url} target={link.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {translate(locale, { en: "Open source", th: "เปิดแหล่งข้อมูล", zh: "打开来源" })}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section city-print-hide city-scope-meta">
        <p className="eyebrow">{translate(locale, { en: "Scope metadata", th: "ขอบเขตข้อมูล", zh: "范围元数据" })}</p>
        <h2>{translate(locale, { en: "depa smart-city dimensions in scope", th: "มิติเมืองอัจฉริยะ depa ที่อยู่ในขอบเขต", zh: "纳入范围的 depa 智慧维度" })}</h2>
        <div className="dimension-chip-row">
          {city.smartDimensions.map((dimension, i) => (
            <span key={dimension} className="dimension-chip">
              <span className="dimension-chip-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="dimension-chip-name">{DIMENSION_LABELS[locale][dimension]}</span>
            </span>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
