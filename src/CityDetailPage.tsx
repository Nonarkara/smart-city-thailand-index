import { useMemo } from "react";
import { getCityExternalResearchLinks } from "./cityCdp";
import { useCityDetail } from "./cityApi";
import {
  getCityName,
  getCityRealityLabel,
  getCityTagline,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { ResponsiveImage } from "./mediaAssets";
import { getCompositeBreakdown, SCORING_PILLARS } from "./scoring";
import type { Locale, ScoringPillar } from "./types";
import { DIMENSION_LABELS, PILLAR_COLORS, PILLAR_LABELS, PILLAR_SHORT_LABELS, PILLAR_WEIGHTS, TIER_LABELS } from "./types";

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
      <title id="radar-title">{pillars.map(p => `${PILLAR_SHORT_LABELS[locale][p]}: ${scores[p]}/100`).join(", ")}</title>
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
        const labelPt = getPoint(index, 125);
        return (
          <text
            key={pillar}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            fill="#888"
          >
            {PILLAR_SHORT_LABELS[locale][pillar]}
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
        <span className="decomp-formula">Composite = Σ (score × weight) / Σ weights</span>
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

  // Only verified local field photos — no Unsplash, no conference shots
  const cityPhotoMap: Record<string, string> = {
    "chiang-mai-old-town": "/Chiang Mai/IMG_20251218_190749854.jpg",
    "khon-kaen": "/Khon Kaen/IMG_4264.JPG",
    "cmu-smart-city": "/CMU Smart City/P1210289.JPG",
    "nakhon-si-thammarat": "/photos/report-city-walkway.jpg",
    "hat-yai": "/photos/report-city-night.jpg",
    krabi: "/photos/slic-waterfront.jpg",
  };

  const instrumentLookup = useMemo(
    () => new Map(city?.financeInstrumentCatalog.map(item => [item.id, item]) ?? []),
    [city],
  );

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
  const cityPhoto = cityPhotoMap[city.id];
  const researchLinks = getCityExternalResearchLinks(city);

  return (
    <>
      {cityPhoto ? (
        <div className="city-hero-photo">
          <ResponsiveImage
            src={cityPhoto}
            alt={cityName}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="city-hero-photo-overlay">
            <span className="city-hero-photo-title">{cityName}</span>
            <span className="city-hero-photo-score">{city.compositeScore.toFixed(1)}</span>
          </div>
        </div>
      ) : (
        <div className={`city-hero-gradient city-hero-gradient-${city.tier}`}>
          <span className="city-hero-gradient-title">{cityName}</span>
          <span className="city-hero-gradient-score">{city.compositeScore.toFixed(1)}</span>
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
                : (locale === "th" ? "เขตส่งเสริมเมืองอัจฉริยะ" : locale === "zh" ? "智慧城市推广区" : "Smart City Promotion Zone")}
            </p>
            <h1>{cityName}</h1>
            <p className="city-detail-province">{provinceName}</p>
          </div>
          <div className="city-detail-score-block">
            <div className={`tier-badge-large tier-${city.tier}`}>
              {tierSymbol} {TIER_LABELS[locale][city.tier]}
            </div>
            <div className="composite-large">{city.compositeScore.toFixed(1)}</div>
            <div className={`reality-badge reality-${city.reality}`}>
              {getCityRealityLabel(city.reality, locale)}
            </div>
          </div>
        </div>

        <p className="city-detail-tagline">{cityTagline}</p>
        <p className="section-intro">{city.shortTailoredNote[locale]}</p>

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

          <div className="city-context-grid">
            {city.contextNotes.map(note => (
              <div key={note.id} className="city-ctx">
                <span className="city-ctx-label">{note.title[locale]}</span>
                <p className="city-ctx-body">{note.body[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section rpg-section">
        <p className="eyebrow">{locale === "th" ? "สถิติเมือง" : locale === "zh" ? "城市数据" : "City stats"}</p>
        <h2>{locale === "th" ? "แผ่นสถิติ" : locale === "zh" ? "城市属性表" : "Stat Sheet"}</h2>

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
      </section>

      <section className="section">
        <p className="eyebrow">{locale === "th" ? "การคำนวณ" : locale === "zh" ? "计算方式" : "Score math"}</p>
        <h2>{locale === "th" ? "ตัวเลขมาจากไหน" : locale === "zh" ? "这些数字怎么来的" : "Where the numbers come from"}</h2>
        <ScoreBreakdown scores={city.scores} locale={locale} />
      </section>

      <section className="section">
        <div className="planning-section-header">
          <div>
            <p className="eyebrow">{translate(locale, { en: "Delivery profile", th: "โปรไฟล์การส่งมอบ", zh: "交付画像" })}</p>
            <h2>{translate(locale, { en: "Five steps from logo to operating city", th: "ห้าขั้นจากโลโก้สู่เมืองที่เดินได้จริง", zh: "从标识走到真正运营城市的五个步骤" })}</h2>
          </div>
          <a className="ghost-button csv-download" href={city.exportMetadata.cityCsvUrl}>
            {translate(locale, { en: "Export city CSV", th: "ส่งออก CSV เมือง", zh: "导出城市 CSV" })}
          </a>
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
            <span className="record-value">{city.freshness.latestObservedAt.slice(0, 10)}</span>
          </div>
          <div className="record-item">
            <span className="record-label">{translate(locale, { en: "Provenance rows", th: "แถวหลักฐาน", zh: "溯源行数" })}</span>
            <span className="record-value">{city.provenanceCount}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">{translate(locale, { en: "Tailored finance", th: "การเงินเฉพาะเมือง", zh: "定制融资" })}</p>
        <h2>{translate(locale, { en: "Which mechanism actually fits this city", th: "กลไกไหนที่เข้ากับเมืองนี้จริง", zh: "什么机制真的适合这座城市" })}</h2>
        <div className="finance-blueprint-grid">
          <div className="finance-blueprint-card">
            <div className="finance-blueprint-label">{translate(locale, { en: "Revenue base", th: "ฐานรายได้", zh: "收入基础" })}</div>
            <p className="finance-blueprint-body">{city.financeProfile.revenueBase}</p>
          </div>
          <div className="finance-blueprint-card">
            <div className="finance-blueprint-label">{translate(locale, { en: "Institutional capacity", th: "ศักยภาพสถาบัน", zh: "机构能力" })}</div>
            <p className="finance-blueprint-body">{city.financeProfile.institutionalCapacity}</p>
          </div>
          <div className="finance-blueprint-card">
            <div className="finance-blueprint-label">{translate(locale, { en: "Project pipeline", th: "ท่อโครงการ", zh: "项目管线" })}</div>
            <p className="finance-blueprint-body">{city.financeProfile.projectPipeline}</p>
          </div>
          <div className="finance-blueprint-card">
            <div className="finance-blueprint-label">{translate(locale, { en: "Private interest", th: "ความสนใจเอกชน", zh: "私营兴趣" })}</div>
            <p className="finance-blueprint-body">{city.financeProfile.privateInterest}</p>
          </div>
          <div className="finance-blueprint-card finance-blueprint-card-wide">
            <div className="finance-blueprint-label">{translate(locale, { en: "Risk profile", th: "โปรไฟล์ความเสี่ยง", zh: "风险画像" })}</div>
            <p className="finance-blueprint-body">
              {city.financeProfile.riskProfile} · {city.financeProfile.deliveryReadiness} · {city.financeProfile.readinessScore}/100
            </p>
          </div>
        </div>

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
                <h3 className="finance-card-title">{recommendation.instrumentName}</h3>
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
                      <span className="record-label">{support.supportType === "metric" ? support.metricLabel ?? support.metricKey : "Evidence"}</span>
                      <span className="record-value">{support.summary}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
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

      <section className="section">
        <p className="eyebrow">{translate(locale, { en: "Data rails", th: "รางข้อมูล", zh: "数据轨道" })}</p>
        <h2>{translate(locale, { en: "How this city becomes research-grade", th: "ทำอย่างไรให้เมืองนี้เป็น research-grade", zh: "这座城市如何达到研究级" })}</h2>
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
          <a className="cta-button" href={city.exportMetadata.summaryCsvUrl}>
            {translate(locale, { en: "Export summary CSV", th: "ส่งออก summary CSV", zh: "导出 summary CSV" })}
          </a>
          <a className="ghost-button" href={city.exportMetadata.factsCsvUrl}>
            {translate(locale, { en: "Export fact rows CSV", th: "ส่งออกแถวข้อมูล CSV", zh: "导出事实行 CSV" })}
          </a>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">{locale === "th" ? "มิติอัจฉริยะ depa" : locale === "zh" ? "depa 智慧维度" : "depa dimensions"}</p>
        <h2>{locale === "th" ? "ขอบเขต" : locale === "zh" ? "关注领域" : "Focus areas"}</h2>
        <div className="dimension-grid">
          {city.smartDimensions.map(dimension => (
            <div key={dimension} className="dimension-card">
              <span className="dimension-icon">
                {dimension === "economy" ? "💰" : dimension === "energy" ? "⚡" : dimension === "environment" ? "🌿" : dimension === "governance" ? "🏛️" : dimension === "living" ? "🏠" : dimension === "mobility" ? "🚌" : "👥"}
              </span>
              <span className="dimension-name">{DIMENSION_LABELS[locale][dimension]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">{locale === "th" ? "จุดเด่น" : locale === "zh" ? "重点证据" : "Evidence"}</p>
        <h2>{locale === "th" ? "สิ่งที่ทำได้จริง" : locale === "zh" ? "真正运作的东西" : "What actually works"}</h2>
        <ul className="highlights-list">
          {city.highlights.map((highlight, index) => (
            <li key={index} className="highlight-item">{highlight}</li>
          ))}
        </ul>
      </section>

      {city.evidenceItems.length > 0 && (
        <section className="section">
          <p className="eyebrow">{locale === "th" ? "หลักฐาน" : locale === "zh" ? "证据" : "Evidence"}</p>
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

      <section className="section">
        <p className="eyebrow">{translate(locale, { en: "Research links", th: "ลิงก์วิจัย", zh: "研究链接" })}</p>
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
    </>
  );
}
