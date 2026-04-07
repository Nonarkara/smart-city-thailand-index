import { useMemo, useState } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, getProvinceName, translate } from "./cityPresentation";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, TIER_LABELS } from "./types";
import { SCORING_PILLARS } from "./scoring";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type Grade = "A" | "B" | "C";

const GRADE_LABELS: Record<Grade, { en: string; th: string; zh: string; min: number }> = {
  A: { en: "Strong (65+)", th: "แข็ง (65+)", zh: "强 (65+)", min: 65 },
  B: { en: "Moderate (45-64)", th: "ปานกลาง (45-64)", zh: "中等 (45-64)", min: 45 },
  C: { en: "Any level", th: "ทุกระดับ", zh: "任何水平", min: 0 },
};

function gradeColor(g: Grade): string {
  return g === "A" ? "var(--teal, #1A9A82)" : g === "B" ? "var(--gold-text, #946B0C)" : "var(--3, #888)";
}

export default function DiscoverPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const [heroRef, heroVisible] = useInView(0.1);
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
      .map(city => {
        let matchScore = 0;
        let totalWeight = 0;

        SCORING_PILLARS.forEach(p => {
          const pref = prefs[p];
          const score = city.scores[p];
          const threshold = GRADE_LABELS[pref].min;

          // Weight: A preferences matter 3x, B 2x, C 1x
          const weight = pref === "A" ? 3 : pref === "B" ? 2 : 1;
          totalWeight += weight;

          if (score >= threshold) {
            // Bonus for exceeding threshold
            matchScore += weight * (1 + (score - threshold) / 100);
          } else {
            // Penalty for missing threshold — proportional to gap
            matchScore += weight * Math.max(0, score / Math.max(threshold, 1));
          }
        });

        return { city, matchScore: Math.round((matchScore / totalWeight) * 100) };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }, [cities, prefs]);

  // Count how many pillars are set to each grade
  const gradeCount = { A: 0, B: 0, C: 0 };
  SCORING_PILLARS.forEach(p => { gradeCount[prefs[p]]++; });

  return (
    <div className="discover-page">
      {/* ─── HERO ─── */}
      <section ref={heroRef} className={`section rankings-hero reveal ${heroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "City matcher", th: "จับคู่เมือง", zh: "城市匹配" })}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
          {translate(locale, { en: "What is your city?", th: "เมืองของคุณคือเมืองไหน?", zh: "你的城市是哪座？" })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Set your priorities across 7 pillars. We'll find which Thai smart cities match what you care about. Click a pillar to cycle: A (strong) → B (moderate) → C (any).",
            th: "ตั้งค่าลำดับความสำคัญใน 7 เสาหลัก เราจะหาว่าเมืองอัจฉริยะไทยเมืองไหนตรงกับสิ่งที่คุณสนใจ คลิกเสาหลักเพื่อเปลี่ยน: A (แข็ง) → B (ปานกลาง) → C (ทุกระดับ)",
            zh: "在7个支柱上设定你的优先级。我们将找出哪些泰国智慧城市最匹配你的关注点。点击支柱循环：A(强) → B(中等) → C(任意)。",
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
                <span className="mixer-pillar-desc">{locale === "th" ? GRADE_LABELS[grade].th : GRADE_LABELS[grade].en}</span>
              </button>
            );
          })}
        </div>
        <div className="mixer-summary">
          <span>{gradeCount.A} A</span> · <span>{gradeCount.B} B</span> · <span>{gradeCount.C} C</span>
          {" · "}
          <span>{translate(locale, { en: "14 buttons, 21 slots", th: "14 ปุ่ม 21 ช่อง", zh: "14按钮，21插槽" })}</span>
        </div>
      </section>

      {/* ─── RESULTS ─── */}
      <section ref={resultsRef} className={`section discover-results reveal ${resultsVisible ? "visible" : ""}`}>
        <h2>{translate(locale, { en: "Your top 10 matches", th: "10 เมืองที่ตรงที่สุด", zh: "你的前10名匹配" })}</h2>
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
                  const meets = city.scores[p] >= GRADE_LABELS[prefs[p]].min;
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
              <span className="discover-match">{matchScore}%</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
