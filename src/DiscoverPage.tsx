import { useMemo, useState } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, getProvinceName, translate } from "./cityPresentation";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, TIER_LABELS } from "./types";
import { SCORING_PILLARS } from "./scoring";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type Grade = "A" | "B" | "C";

const GRADE_LABELS: Record<Grade, { en: string; th: string; zh: string; min: number }> = {
  A: { en: "65+", th: "65+", zh: "65+", min: 65 },
  B: { en: "45+", th: "45+", zh: "45+", min: 45 },
  C: { en: "ANY", th: "ใดๆ", zh: "任意", min: 0 },
};

export default function DiscoverPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const [prefs, setPrefs] = useState<Record<ScoringPillar, Grade>>(() => {
    const init: Partial<Record<ScoringPillar, Grade>> = {};
    SCORING_PILLARS.forEach(p => { init[p] = "B"; });
    return init as Record<ScoringPillar, Grade>;
  });

  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  const toggleGrade = (pillar: ScoringPillar) => {
    setPrefs(prev => {
      const current = prev[pillar];
      const next: Grade = current === "C" ? "B" : current === "B" ? "A" : "C";
      return { ...prev, [pillar]: next };
    });
  };

  const ranked = useMemo(() => {
    return cities
      .map(city => {
        let matchScore = 0;
        let totalWeight = 0;
        SCORING_PILLARS.forEach(p => {
          const pref = prefs[p];
          const score = city.scores[p];
          const threshold = GRADE_LABELS[pref].min;
          const weight = pref === "A" ? 3 : pref === "B" ? 2 : 1;
          totalWeight += weight;
          if (score >= threshold) matchScore += weight * (1 + (score - threshold) / 100);
          else matchScore += weight * Math.max(0, score / Math.max(threshold, 1));
        });
        return { city, matchScore: Math.round((matchScore / totalWeight) * 100) };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }, [cities, prefs]);

  return (
    <div className="discover-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. HERO SIGNAGE */}
      <section className="section hero-signage reveal visible">
        <p className="eyebrow">{t({ en: "Algorithm // MATCH-v2.1", th: "อัลกอริทึม // MATCH-v2.1", zh: "算法 // MATCH-v2.1" })}</p>
        <h1 className="hero-title">{t({ en: "Identify Your City", th: "ระบุตัวตนเมืองของคุณ", zh: "识别你的城市" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "Set performance expectations across 7 pillars. We identify which Thai cities technically align with your requirements.",
            th: "ตั้งค่าระดับประสิทธิภาพที่คาดหวังใน 7 เสาหลัก เราจะระบุเมืองไทยทางเทคนิคที่ตรงกับความต้องการของคุณ",
            zh: "设定 7 个维度的绩效预期。我们将识别哪些泰国城市在技术上符合您的要求。",
          })}
        </p>
      </section>

      {/* 2. PREFERENCE MATRIX */}
      <section className="section reveal visible">
         <p className="eyebrow">{t({ en: "Requirement Matrix", th: "เมทริกซ์ความต้องการ", zh: "需求矩阵" })}</p>
         <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-2)' }}>
           {SCORING_PILLARS.map(p => (
             <button key={p} className="data-sheet" onClick={() => toggleGrade(p)} style={{ textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div className="data-row" style={{ padding: 0 }}>
                   <span className="data-label" style={{ color: PILLAR_COLORS[p] }}>{PILLAR_LABELS[locale][p].toUpperCase()}</span>
                   <span className="data-value" style={{ fontWeight: 800 }}>{GRADE_LABELS[prefs[p]].en}</span>
                </div>
                <div style={{ height: '4px', background: 'var(--n-100)', marginTop: '8px', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: prefs[p] === 'A' ? '100%' : prefs[p] === 'B' ? '66%' : '33%', background: PILLAR_COLORS[p] }} />
                </div>
             </button>
           ))}
         </div>
         <p className="data-note" style={{ marginTop: 'var(--space-2)' }}>SELECTOR: [A] HIGH PERFORMANCE / [B] MODERATE / [C] AGNOSTIC</p>
      </section>

      {/* 3. MATCHING LOG */}
      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <p className="eyebrow">{t({ en: "Top 10 Alignments", th: "10 เมืองที่ตรงที่สุด", zh: "前10名对齐城市" })}</p>
        <div className="data-sheet" style={{ padding: 0 }}>
          {ranked.map(({ city, matchScore }, i) => (
            <div key={city.id} className="data-row" onClick={() => onNavigate(`/city/${city.id}`)} style={{ cursor: 'pointer', padding: 'var(--space-2) var(--space-4)' }}>
               <span className="data-label" style={{ width: '40px', fontWeight: 800 }}>0{i+1}</span>
               <div style={{ flex: 1 }}>
                  <div className="data-value" style={{ fontSize: '16px', fontWeight: 700 }}>{getCityName(city, locale)}</div>
                  <div className="data-note">{getProvinceName(city, locale)} · {TIER_LABELS[locale][city.tier].toUpperCase()}</div>
               </div>
               <div style={{ display: 'flex', gap: '2px', marginRight: 'var(--space-4)' }}>
                 {SCORING_PILLARS.map(p => {
                    const meets = city.scores[p] >= GRADE_LABELS[prefs[p]].min;
                    return <div key={p} style={{ width: '12px', height: '12px', background: meets ? PILLAR_COLORS[p] : 'var(--n-100)' }} title={PILLAR_LABELS[locale][p]} />;
                 })}
               </div>
               <span className="data-value" style={{ width: '60px', textAlign: 'right', color: 'var(--a-500)', fontWeight: 800 }}>{matchScore}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SUBMISSION CTA */}
      <section className="section reveal visible" style={{ borderBottom: 0, textAlign: 'center' }}>
         <div className="data-sheet" style={{ background: 'var(--n-900)', color: 'var(--n-0)', padding: 'var(--space-6)' }}>
            <h2 className="cta-title" style={{ color: 'var(--n-0)' }}>{t({ en: "CITY MISSING FROM RECORDS?", th: "เมืองของคุณไม่อยู่ในฐานข้อมูล?", zh: "记录中缺少城市？" })}</h2>
            <p className="data-note" style={{ color: 'var(--n-400)', marginBottom: 'var(--space-4)' }}>
              {t({ en: "All submissions require depa-certified audit trails and evidence catalogs.", th: "แผนการยื่นทั้งหมดต้องมีร่องรอยการตรวจสอบที่ได้รับการรับรองจาก depa และแคตตาล็อกหลักฐาน", zh: "所有提交均需经过 depa 认证的审计跟踪和证据目录。" })}
            </p>
            <a href="mailto:non.ar@depa.or.th?subject=SCITI%202026%20-%20City%20Submission" className="btn btn-primary" style={{ display: 'inline-block' }}>SUBMIT DATA SPEC</a>
         </div>
      </section>
    </div>
  );
}
