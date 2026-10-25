import { useMemo, useState } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, getProvinceName, translate } from "./cityPresentation";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, TIER_LABELS } from "./types";
import { SCORING_PILLARS } from "./scoring";
import { useInView } from "./useInView";
import { computePreferenceScore } from "./preferenceScore";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type Grade = "A" | "B" | "C";

const GRADE_LABELS: Record<Grade, { en: string; th: string; zh: string }> = {
  A: { en: "High priority", th: "สำคัญมาก", zh: "高优先级" },
  B: { en: "Medium priority", th: "สำคัญปานกลาง", zh: "中优先级" },
  C: { en: "No preference", th: "ไม่กำหนด", zh: "无偏好" },
};

function gradeColor(g: Grade): string {
  return g === "A" ? "var(--teal, #1A9A82)" : g === "B" ? "var(--gold-text, #946B0C)" : "var(--3, #888)";
}

export default function DiscoverPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const [resultsRef, resultsVisible] = useInView(0.1);

  // 7 pillars × A/B/C preference — default all to B (moderate)
  const [prefs, setPrefs] = useState<Record<ScoringPillar, Grade>>(() => {
    const init: Partial<Record<ScoringPillar, Grade>> = {};
    SCORING_PILLARS.forEach(p => { init[p] = "B"; });
    return init as Record<ScoringPillar, Grade>;
  });

  const toggleGrade = (pillar: ScoringPillar) => {
    setPrefs(prev => {
      const current = prev[pillar];
      const next: Grade = current === "C" ? "B" : current === "B" ? "A" : "C";
      return { ...prev, [pillar]: next };
    });
  };

  // Score each city against preferences — higher = better match
  const ranked = useMemo(() => {
    return cities
      .map(city => ({ city, matchScore: computePreferenceScore(city.scores, prefs, city.compositeScore) }))
      .sort((a, b) => b.matchScore - a.matchScore || b.city.compositeScore - a.city.compositeScore || a.city.id.localeCompare(b.city.id))
      .slice(0, 10);
  }, [cities, prefs]);

  // Count how many pillars are set to each grade
  const gradeCount = { A: 0, B: 0, C: 0 };
  SCORING_PILLARS.forEach(p => { gradeCount[prefs[p]]++; });

  return (
    <div className="discover-page">
      {/* ─── HERO ─── */}
      <section className="section rankings-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "City matcher", th: "จับคู่เมือง", zh: "城市匹配" })}</p>
        <h1 className="hero-title" style={{ fontSize: "var(--text-display)" }}>
          {translate(locale, { en: "What is your city?", th: "เมืองของคุณคือเมืองไหน?", zh: "你的城市是哪座？" })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Choose priorities across seven research scores: A gets weight 3, B weight 2, and C no weight. Results are weighted scores out of 100, not a probability of fit. With no preferences, the published composite applies.",
            th: "เลือกลำดับความสำคัญของคะแนนวิจัยเจ็ดด้าน: A น้ำหนัก 3, B น้ำหนัก 2 และ C ไม่นับน้ำหนัก ผลลัพธ์เป็นคะแนนถ่วงน้ำหนักเต็ม 100 ไม่ใช่โอกาสที่เหมาะกับคุณ หากไม่กำหนดด้านใด จะใช้คะแนนรวมที่เผยแพร่",
            zh: "设置七项研究评分的优先级：A权重3、B权重2、C不计权重。结果为满分100的加权分，不是个人匹配概率。全部无偏好时使用已发布综合分。",
          })}
        </p>
      </section>

      {/* ─── PILLAR MIXER ─── */}
      <section className="section discover-mixer">
        <div className="mixer-grid">
          {SCORING_PILLARS.map(p => {
            const grade = prefs[p];
            return (
              <button
                key={p}
                className={`mixer-pillar mixer-pillar-${grade.toLowerCase()}`}
                onClick={() => toggleGrade(p)}
                aria-label={`${PILLAR_LABELS[locale][p]}: ${grade}`}
              >
                <div className="mixer-pillar-bar" style={{ background: PILLAR_COLORS[p] }} />
                <span className="mixer-pillar-name">{PILLAR_LABELS[locale][p]}</span>
                <span className="mixer-pillar-grade" style={{ color: gradeColor(grade) }}>{grade}</span>
                <span className="mixer-pillar-desc">{translate(locale, { en: GRADE_LABELS[grade].en, th: GRADE_LABELS[grade].th, zh: GRADE_LABELS[grade].zh })}</span>
              </button>
            );
          })}
        </div>
        <div className="mixer-summary">
          <span>{gradeCount.A} A</span> · <span>{gradeCount.B} B</span> · <span>{gradeCount.C} C</span>
          {" · "}
          <span>{translate(locale, { en: "7 pillars, 3 levels each", th: "7 เสาหลัก 3 ระดับ", zh: "7支柱，各3级" })}</span>
        </div>
      </section>

      {/* ─── RESULTS ─── */}
      <section ref={resultsRef} className={`section discover-results reveal ${resultsVisible ? "visible" : ""}`}>
        <h2>{translate(locale, { en: "Top 10 by your priorities", th: "10 อันดับตามลำดับความสำคัญ", zh: "按优先级排列的前十名" })}</h2>
        <div className="discover-list">
          {ranked.map(({ city, matchScore }, i) => (
            <button
              key={city.id}
              className="discover-row"
              onClick={() => onNavigate(`/city/${city.id}`)}
            >
              <span className="discover-rank">{String(i + 1).padStart(2, "0")}</span>
              <div className="discover-city-info">
                <span className="discover-city-name">{getCityName(city, locale)}</span>
                <span className="discover-city-meta">
                  {getProvinceName(city, locale)} · {TIER_LABELS[locale][city.tier]} · {city.compositeScore.toFixed(1)}
                </span>
              </div>
              <div className="discover-pillars">
                {SCORING_PILLARS.map(p => {
                  const meets = prefs[p] !== "C";
                  return (
                    <span
                      key={p}
                      className={`discover-pill ${meets ? "discover-pill-pass" : "discover-pill-miss"}`}
                      title={`${PILLAR_LABELS[locale][p]}: ${city.scores[p]}`}
                      style={{ background: meets ? PILLAR_COLORS[p] : "var(--surface)" }}
                    >
                      {city.scores[p]}
                    </span>
                  );
                })}
              </div>
              <span className="discover-match">{matchScore.toFixed(1)} / 100</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── MISSING CITY CTA ─── */}
      <section className="section" style={{ textAlign: "center" }}>
        <p style={{ font: "500 var(--text-micro) var(--font)", color: "var(--2)", marginBottom: ".4rem" }}>
          {translate(locale, {
            en: "Is your city missing?",
            th: "เมืองของคุณไม่อยู่ในนี้?",
            zh: "找不到你的城市？",
          })}
        </p>
        <a
          href="mailto:non.ar@depa.or.th?subject=SCITI%202026%20-%20City%20Submission"
          className="cta-button"
          style={{ display: "inline-flex" }}
        >
          {translate(locale, {
            en: "Email non.ar@depa.or.th",
            th: "ส่งอีเมลถึง non.ar@depa.or.th",
            zh: "发送邮件至 non.ar@depa.or.th",
          })}
        </a>
      </section>
    </div>
  );
}
