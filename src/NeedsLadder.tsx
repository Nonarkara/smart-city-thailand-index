// ---------------------------------------------------------------------------
// NeedsLadder — the 8-rung hierarchy of what a city has to get right, in
// priority order, rendered literally as a ladder: apex (hygiene) at top,
// calm (mental health/traffic) at the base. Deliberately mono — unlike
// CityFingerprint's multi-color 7-pillar radar (peer dimensions, so color
// distinguishes them), this hierarchy is ORDERED, so position does the
// differentiating work. The single amber accent is reserved for one honest
// callout: the rung this city is weakest on. Braun-precision hairline bars,
// zero gradient, zero shadow, zero decoration.
// ---------------------------------------------------------------------------

import type { Locale } from "./types.ts";
import type { NeedsLadderProfile, LadderRungId } from "./needsLadderEngine.ts";
import { weakestRung } from "./needsLadderEngine.ts";

const RUNG_LABELS: Record<LadderRungId, { en: string; th: string; zh: string }> = {
  apex: { en: "Clean air & water", th: "อากาศและน้ำสะอาด", zh: "清洁空气与水" },
  protection: { en: "Safety, health & nature", th: "ความปลอดภัย สุขภาพ ธรรมชาติ", zh: "安全、健康与自然" },
  belonging: { en: "Community & hospitality", th: "ชุมชนและอัธยาศัย", zh: "社区与待客之道" },
  livelihood: { en: "Jobs, land & BOI incentives", th: "งาน ที่ดิน สิทธิประโยชน์ BOI", zh: "就业、土地与BOI优惠" },
  reach: { en: "Reach to regional hubs", th: "ระยะทางสู่ศูนย์กลางภูมิภาค", zh: "通达区域枢纽" },
  convenience: { en: "Convenience of daily life", th: "ความสะดวกในชีวิตประจำวัน", zh: "日常生活便利度" },
  affordability: { en: "Affordability", th: "ความคุ้มค่าค่าครองชีพ", zh: "生活可负担性" },
  calm: { en: "Calm — low commute stress", th: "ความสงบ — ความเครียดจากการเดินทาง", zh: "宁静 — 低通勤压力" },
};

interface Props {
  profile: NeedsLadderProfile;
  locale: Locale;
  className?: string;
}

export default function NeedsLadder({ profile, locale, className }: Props) {
  const weak = weakestRung(profile);

  return (
    <div className={`needs-ladder ${className ?? ""}`}>
      <div className="needs-ladder-head">
        <span className="needs-ladder-eyebrow">
          {locale === "th" ? "บันไดความสำคัญ" : locale === "zh" ? "重要性阶梯" : "Ladder of needs"}
        </span>
        <span className="needs-ladder-coverage">
          {locale === "th"
            ? `มีข้อมูลจริง ${profile.coverage}/8 ขั้น`
            : locale === "zh"
              ? `${profile.coverage}/8 层有真实数据`
              : `${profile.coverage}/8 rungs backed by real data`}
        </span>
      </div>

      <ol className="needs-ladder-rungs">
        {profile.rungs.map((rung, i) => {
          const isWeakest = weak && rung.id === weak.id;
          const label = RUNG_LABELS[rung.id][locale];
          return (
            <li key={rung.id} className={`needs-ladder-rung ${isWeakest ? "needs-ladder-rung-weakest" : ""}`}>
              <div className="needs-ladder-rung-head">
                <span className="needs-ladder-rung-index">{i + 1}</span>
                <span className="needs-ladder-rung-label">{label}</span>
                <span className="needs-ladder-rung-value">
                  {rung.score !== undefined ? rung.score : "—"}
                </span>
              </div>
              <div className="needs-ladder-rung-track">
                <div
                  className="needs-ladder-rung-fill"
                  style={{ width: rung.score !== undefined ? `${rung.score}%` : "0%" }}
                />
              </div>
              {rung.signals.length > 0 && (
                <ul className="needs-ladder-rung-signals">
                  {rung.signals.map((s, si) => (
                    <li key={si}>
                      <span className="needs-ladder-signal-label">{s.label[locale]}</span>
                      <span className="needs-ladder-signal-value">{s.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
