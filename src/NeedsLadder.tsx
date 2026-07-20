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

type Signal = NeedsLadderProfile["rungs"][number]["signals"][number];

function sourceFallback(signal: Signal, locale: Locale) {
  if (signal.source === "metrics") {
    return {
      label: locale === "th" ? "ข้อมูลฐานพร้อมแหล่งอ้างอิง" : locale === "zh" ? "有来源的基线数据" : "Source-linked baseline",
      href: "/audit",
      geography: locale === "th" ? "ข้อมูลตัวแทนระดับจังหวัด" : locale === "zh" ? "府级代理数据" : "provincial proxy",
    };
  }
  if (signal.source === "pillar") {
    return {
      label: locale === "th" ? "การประเมิน SCITI" : locale === "zh" ? "SCITI 评估" : "SCITI assessment",
      href: "/methodology",
      geography: locale === "th" ? "การประเมินระดับเมือง" : locale === "zh" ? "城市评估" : "city assessment",
    };
  }
  if (signal.source === "geometry") {
    return {
      label: locale === "th" ? "พิกัดเมือง · คำนวณ Haversine" : locale === "zh" ? "城市坐标 · Haversine 推导" : "City coordinates · Haversine-derived",
      href: "/methodology",
      geography: locale === "th" ? "ค่าที่คำนวณ" : locale === "zh" ? "推导值" : "derived value",
    };
  }
  return {
    label: locale === "th" ? "ข้อมูลภายนอกที่ตรวจสอบแล้ว" : locale === "zh" ? "经核验的外部数据" : "Verified external data",
    href: undefined,
    geography: locale === "th" ? "ข้อมูลตัวแทนระดับจังหวัด" : locale === "zh" ? "府级代理数据" : "provincial proxy",
  };
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
            ? `ให้คะแนน ${profile.coverage}/8 · มีข้อมูลสังเกต ${profile.observedCoverage}/8`
            : locale === "zh"
              ? `${profile.coverage}/8 层已评分 · ${profile.observedCoverage}/8 层有观测数据`
              : `${profile.coverage}/8 scored · ${profile.observedCoverage}/8 observed`}
        </span>
      </div>
      <p className="needs-ladder-method">
        {locale === "th"
          ? "ชั้นข้อมูลประกอบ 0–100 ของ SCITI ไม่ใช่คะแนนทางการ แยกข้อมูลสังเกต การประเมิน และค่าคำนวณ พร้อมระบุขอบเขตพื้นที่และปีข้อมูลด้านล่าง"
          : locale === "zh"
            ? "这是 SCITI 的 0–100 归一化辅助层，并非官方评分。下方明确区分观测数据、评估和推导值，并标注地理范围与年份。"
            : "A normalized 0–100 SCITI overlay, not an official score. Observations, assessments, and derived values are separated below with geography and vintage."}
      </p>

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
                      <span className="needs-ladder-signal-main">
                        <span className="needs-ladder-signal-label">{s.label[locale]}</span>
                        <span className="needs-ladder-signal-value">
                          {typeof s.value === "string" ? s.value : s.value[locale]}
                        </span>
                      </span>
                      {(() => {
                        const fallback = sourceFallback(s, locale);
                        const href = s.sourceUrl ?? fallback.href;
                        const sourceLabel = s.sourceLabel ?? fallback.label;
                        const geography = s.geography?.[locale] ?? fallback.geography;
                        return (
                          <span className="needs-ladder-signal-provenance">
                            <span className={`needs-ladder-signal-role needs-ladder-signal-role-${s.role ?? "input"}`}>
                              {s.role === "context"
                                ? locale === "th" ? "บริบท" : locale === "zh" ? "背景" : "context"
                                : locale === "th" ? "ใช้คำนวณ" : locale === "zh" ? "计入评分" : "scored input"}
                            </span>
                            {href ? (
                              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
                                {sourceLabel} ↗
                              </a>
                            ) : <span>{sourceLabel}</span>}
                            {s.asOf ? <span>{s.asOf}</span> : null}
                            <span>{geography}</span>
                          </span>
                        );
                      })()}
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
