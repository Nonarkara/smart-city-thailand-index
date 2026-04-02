import { useMemo } from "react";
import { getCityById } from "./cityData";
import {
  getCityName,
  getCityRealityLabel,
  getCityTagline,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { getEvidenceForCity, dataSources } from "./evidenceData";
import type { Locale, ScoringPillar } from "./types";
import { getCompositeBreakdown, SCORING_PILLARS } from "./scoring";
import { PILLAR_LABELS, PILLAR_SHORT_LABELS, PILLAR_COLORS, TIER_LABELS, DIMENSION_LABELS, PILLAR_WEIGHTS } from "./types";

interface Props {
  cityId: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}

/** RPG-style stat grade */
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

/** RPG radar chart — pure SVG */
function RadarChart({ scores, locale }: { scores: Record<ScoringPillar, number>; locale: Locale }) {
  const cx = 140;
  const cy = 140;
  const maxR = 110;
  const pillars = SCORING_PILLARS;
  const n = pillars.length;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100];

  // Data polygon
  const dataPoints = pillars.map((p, i) => getPoint(i, scores[p]));
  const dataPath = dataPoints.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 280 280" className="radar-chart">
      {/* Grid rings */}
      {rings.map(r => {
        const pts = pillars.map((_, i) => getPoint(i, r));
        const path = pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";
        return <path key={r} d={path} fill="none" stroke="var(--border-hard)" strokeWidth="0.5" opacity="0.5" />;
      })}

      {/* Axis lines */}
      {pillars.map((_, i) => {
        const pt = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="var(--border-hard)" strokeWidth="0.5" opacity="0.3" />;
      })}

      {/* Data fill */}
      <path d={dataPath} fill="rgba(232, 145, 58, 0.12)" stroke="var(--saffron)" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill={PILLAR_COLORS[pillars[i]]} />
      ))}

      {/* Labels */}
      {pillars.map((p, i) => {
        const labelPt = getPoint(i, 125);
        return (
          <text
            key={p}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            fill="var(--ink-soft)"
          >
            {PILLAR_SHORT_LABELS[locale][p]}
          </text>
        );
      })}
    </svg>
  );
}

/** RPG horizontal stat bar */
function StatBar({ pillar, value, locale }: { pillar: ScoringPillar; value: number; locale: Locale }) {
  const grade = statGrade(value);
  const weight = PILLAR_WEIGHTS[pillar];

  return (
    <div className="rpg-stat-row">
      <div className="rpg-stat-color" style={{ background: PILLAR_COLORS[pillar] }} />
      <div className="rpg-stat-name">{PILLAR_LABELS[locale][pillar]}</div>
      <div className="rpg-stat-weight">{weight}%</div>
      <div className="rpg-stat-bar-track">
        <div
          className="rpg-stat-bar-fill"
          style={{ width: `${value}%`, background: PILLAR_COLORS[pillar] }}
        />
        {/* HP-style segmented marks at 25, 50, 75 */}
        <div className="rpg-stat-bar-mark" style={{ left: "25%" }} />
        <div className="rpg-stat-bar-mark" style={{ left: "50%" }} />
        <div className="rpg-stat-bar-mark" style={{ left: "75%" }} />
      </div>
      <div className="rpg-stat-value">{value}</div>
      <div className="rpg-stat-grade" style={{ color: gradeColor(grade) }}>{grade}</div>
    </div>
  );
}

/** Score decomposition — shows how composite was computed */
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
        {terms.map(t => (
          <div key={t.pillar} className="decomp-row">
            <span className="decomp-pillar">
              <span className="decomp-dot" style={{ background: PILLAR_COLORS[t.pillar] }} />
              {PILLAR_LABELS[locale][t.pillar]}
            </span>
            <span className="decomp-num">{t.score}</span>
            <span className="decomp-num">{t.weight}%</span>
            <span className="decomp-num decomp-contribution">{t.contribution.toFixed(1)}</span>
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
  const city = useMemo(() => getCityById(cityId), [cityId]);
  const evidence = useMemo(() => getEvidenceForCity(cityId), [cityId]);

  if (!city) {
    return (
      <section className="section" style={{ paddingTop: "7rem" }}>
        <h1>{translate(locale, { en: "City not found", th: "ไม่พบเมือง", zh: "未找到城市" })}</h1>
        <button className="cta-button" onClick={() => onNavigate("/")}>
          {translate(locale, { en: "Back to home", th: "กลับหน้าหลัก", zh: "返回首页" })}
        </button>
      </section>
    );
  }

  const tierSymbol = city.tier === "alpha" ? "α" : city.tier === "beta" ? "β" : "γ";
  const overallGrade = statGrade(city.compositeScore);
  const cityName = getCityName(city, locale);
  const provinceName = getProvinceName(city, locale);
  const cityTagline = getCityTagline(city, locale);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section city-detail-hero">
        <button className="back-link" onClick={() => onNavigate("/rankings")}>
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
      </section>

      {/* ─── RPG STAT SHEET ─── */}
      <section className="section rpg-section">
        <p className="eyebrow">{locale === "th" ? "สถิติเมือง" : locale === "zh" ? "城市数据" : "City stats"}</p>
        <h2>{locale === "th" ? "แผ่นสถิติ" : locale === "zh" ? "城市属性表" : "Stat Sheet"}</h2>

        <div className="rpg-layout">
          {/* Radar chart */}
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

          {/* Stat bars */}
          <div className="rpg-stats-panel">
            {SCORING_PILLARS.map(p => (
              <StatBar key={p} pillar={p} value={city.scores[p]} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCORE DECOMPOSITION ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "การคำนวณ" : locale === "zh" ? "计算方式" : "Score math"}</p>
        <h2>{locale === "th" ? "ตัวเลขมาจากไหน" : locale === "zh" ? "这些数字怎么来的" : "Where the numbers come from"}</h2>
        <ScoreBreakdown scores={city.scores} locale={locale} />
      </section>

      {/* ─── SMART DIMENSIONS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "มิติอัจฉริยะ depa" : locale === "zh" ? "depa 智慧维度" : "depa dimensions"}</p>
        <h2>{locale === "th" ? "ขอบเขต" : locale === "zh" ? "关注领域" : "Focus areas"}</h2>
        <div className="dimension-grid">
          {city.smartDimensions.map(d => (
            <div key={d} className="dimension-card">
              <span className="dimension-icon">
                {d === "economy" ? "💰" : d === "energy" ? "⚡" : d === "environment" ? "🌿" : d === "governance" ? "🏛️" : d === "living" ? "🏠" : d === "mobility" ? "🚌" : "👥"}
              </span>
              <span className="dimension-name">{DIMENSION_LABELS[locale][d]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── METRICS ─── */}
      {(city.metrics.gppPerCapita || city.metrics.avgMonthlyIncome || city.metrics.pm25Annual) && (
        <section className="section">
          <p className="eyebrow">{locale === "th" ? "ข้อมูล" : locale === "zh" ? "原始数据" : "Raw data"}</p>
          <h2>{locale === "th" ? "ตัวเลขจริง" : locale === "zh" ? "真实数字" : "Real numbers"}</h2>
          <div className="metrics-grid">
            {city.metrics.population > 0 && (
              <div className="metric-card">
                <div className="metric-value">{city.metrics.population.toLocaleString()}K</div>
                <div className="metric-label">{locale === "th" ? "ประชากร" : locale === "zh" ? "人口" : "Population"}</div>
              </div>
            )}
            {city.metrics.gppPerCapita && city.metrics.gppPerCapita > 0 && (
              <div className="metric-card">
                <div className="metric-value">฿{(city.metrics.gppPerCapita / 1000).toFixed(0)}K</div>
                <div className="metric-label">{locale === "th" ? "GPP ต่อหัว" : locale === "zh" ? "人均 GPP" : "GPP / capita"}</div>
              </div>
            )}
            {city.metrics.avgMonthlyIncome && city.metrics.avgMonthlyIncome > 0 && (
              <div className="metric-card">
                <div className="metric-value">฿{city.metrics.avgMonthlyIncome.toLocaleString()}</div>
                <div className="metric-label">{locale === "th" ? "รายได้/เดือน" : locale === "zh" ? "月收入" : "Income / mo"}</div>
              </div>
            )}
            {city.metrics.pm25Annual && (
              <div className="metric-card">
                <div className={`metric-value ${city.metrics.pm25Annual > 35 ? "metric-warning" : city.metrics.pm25Annual > 25 ? "metric-caution" : ""}`}>
                  {city.metrics.pm25Annual}
                </div>
                <div className="metric-label">PM2.5 μg/m³</div>
              </div>
            )}
            {city.metrics.hospitalBedsPer10k && (
              <div className="metric-card">
                <div className="metric-value">{city.metrics.hospitalBedsPer10k}</div>
                <div className="metric-label">{locale === "th" ? "เตียง/หมื่น" : locale === "zh" ? "每万人床位" : "Beds / 10K"}</div>
              </div>
            )}
            {city.metrics.crimeRatePer100k && (
              <div className="metric-card">
                <div className={`metric-value ${city.metrics.crimeRatePer100k > 200 ? "metric-warning" : ""}`}>
                  {city.metrics.crimeRatePer100k}
                </div>
                <div className="metric-label">{locale === "th" ? "อาชญากรรม/แสน" : locale === "zh" ? "每十万犯罪" : "Crime / 100K"}</div>
              </div>
            )}
            {city.metrics.greenCoverage && (
              <div className="metric-card">
                <div className="metric-value">{city.metrics.greenCoverage}%</div>
                <div className="metric-label">{locale === "th" ? "สีเขียว" : locale === "zh" ? "绿地 %" : "Green %"}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── HIGHLIGHTS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "จุดเด่น" : locale === "zh" ? "重点证据" : "Evidence"}</p>
        <h2>{locale === "th" ? "สิ่งที่ทำได้จริง" : locale === "zh" ? "真正运作的东西" : "What actually works"}</h2>
        <ul className="highlights-list">
          {city.highlights.map((h, i) => (
            <li key={i} className="highlight-item">{h}</li>
          ))}
        </ul>
      </section>

      {/* ─── EVIDENCE & DATA PROVENANCE ─── */}
      {evidence.length > 0 && (
        <section className="section">
          <p className="eyebrow">{locale === "th" ? "หลักฐาน" : locale === "zh" ? "证据" : "Evidence"}</p>
          <h2>{locale === "th" ? "ข้อมูลมาจากไหน" : locale === "zh" ? "数据从哪里来" : "Where the data comes from"}</h2>
          <div className="evidence-feed">
            {evidence.map((e, i) => (
              <div key={i} className="evidence-item">
                <div className="evidence-meta">
                  <span className={`evidence-type evidence-type-${e.type}`}>
                    {e.type === "news" ? "NEWS" : e.type === "data" ? "DATA" : e.type === "field" ? "FIELD" : e.type === "satellite" ? "SAT" : "GOV"}
                  </span>
                  <span className="evidence-pillar">{e.pillar}</span>
                  <span className="evidence-date">{e.date}</span>
                </div>
                <div className="evidence-title">
                  {locale === "th" ? e.titleTh : locale === "zh" ? e.titleZh : e.titleEn}
                </div>
                <div className="evidence-source">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer">{e.source} →</a>
                  ) : (
                    <span>{e.source}</span>
                  )}
                  {e.value && <span className="evidence-value">{e.metric}: {e.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── DATA SOURCES ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "แหล่งข้อมูล" : locale === "zh" ? "数据来源" : "Data sources"}</p>
        <h2>{locale === "th" ? "ทุกตัวเลขสืบย้อนได้" : locale === "zh" ? "每个数字都可追溯" : "Every number is traceable"}</h2>
        <div className="sources-grid">
          {dataSources.slice(0, 6).map(ds => (
            <div key={ds.id} className="source-card">
              <div className="source-card-type">{ds.type.toUpperCase()}</div>
              <div className="source-card-name">{ds.name}</div>
              <div className="source-card-desc">
                {locale === "th" ? ds.descTh : locale === "zh" ? ds.descZh : ds.descEn}
              </div>
              <div className="source-card-freq">{ds.updateFrequency}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
