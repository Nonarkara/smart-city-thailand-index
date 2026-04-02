import { useCallback, useRef, useState, useMemo } from "react";
import { allCities } from "./cityData";
import type { Locale, CityScores } from "./types";

/* ───── 6 pillars (no Digital — it's a tool, not a goal) ───── */

type PillarId = "livability" | "economy" | "safety" | "wellbeing" | "environment" | "hospitality";

const PILLARS: { id: PillarId; color: string; labelEn: string; labelTh: string; labelZh: string }[] = [
  { id: "livability", color: "#1A7D72", labelEn: "Livability", labelTh: "ความน่าอยู่", labelZh: "宜居" },
  { id: "economy", color: "#D4832F", labelEn: "Economy", labelTh: "เศรษฐกิจ", labelZh: "经济" },
  { id: "safety", color: "#2B4FAF", labelEn: "Safety", labelTh: "ความปลอดภัย", labelZh: "安全" },
  { id: "wellbeing", color: "#C94444", labelEn: "Wellbeing", labelTh: "คุณภาพชีวิต", labelZh: "福祉" },
  { id: "environment", color: "#3D8B3D", labelEn: "Environment", labelTh: "สิ่งแวดล้อม", labelZh: "环境" },
  { id: "hospitality", color: "#8B6914", labelEn: "Hospitality", labelTh: "อัธยาศัย", labelZh: "人文" },
];

const TOTAL = 100;
const DEFAULT_WEIGHTS: Record<PillarId, number> = {
  livability: 22, economy: 22, safety: 16, wellbeing: 16, environment: 12, hospitality: 12,
};

function polarToXY(cx: number, cy: number, r: number, index: number, count: number) {
  const angle = ((index / count) * 2 * Math.PI) - (Math.PI / 2);
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function computeWeightedScore(scores: CityScores, weights: Record<PillarId, number>): number {
  let num = 0;
  let den = 0;
  for (const p of PILLARS) {
    num += scores[p.id] * weights[p.id];
    den += weights[p.id];
  }
  return den > 0 ? num / den : 0;
}

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function SpiderAllocator({ locale, onNavigate }: Props) {
  const [weights, setWeights] = useState<Record<PillarId, number>>({ ...DEFAULT_WEIGHTS });
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const isDefault = PILLARS.every(p => weights[p.id] === DEFAULT_WEIGHTS[p.id]);

  // Re-rank cities with current weights
  const ranked = useMemo(() => {
    return [...allCities]
      .map(city => ({
        ...city,
        customScore: Math.round(computeWeightedScore(city.scores, weights) * 10) / 10,
      }))
      .sort((a, b) => b.customScore - a.customScore);
  }, [weights]);

  // SVG dimensions
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35;
  const n = PILLARS.length;

  // Radar polygon path
  const radarPath = PILLARS.map((p, i) => {
    const r = (weights[p.id] / TOTAL) * maxR;
    const pt = polarToXY(cx, cy, r, i, n);
    return `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`;
  }).join(" ") + " Z";

  // Handle drag on SVG
  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null || !svgRef.current) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const rawValue = Math.round((dist / maxR) * TOTAL);
    const newValue = Math.max(2, Math.min(60, rawValue));
    const diff = newValue - weights[PILLARS[dragging].id];
    if (diff === 0) return;

    // Redistribute difference across other pillars
    const others = PILLARS.filter((_, i) => i !== dragging);
    const othersTotal = others.reduce((s, p) => s + weights[p.id], 0);
    const newWeights = { ...weights };
    newWeights[PILLARS[dragging].id] = newValue;

    if (othersTotal > 0) {
      let remaining = TOTAL - newValue;
      for (let i = 0; i < others.length; i++) {
        const p = others[i];
        if (i === others.length - 1) {
          newWeights[p.id] = Math.max(2, remaining);
        } else {
          const share = Math.round((weights[p.id] / othersTotal) * (TOTAL - newValue));
          newWeights[p.id] = Math.max(2, share);
          remaining -= newWeights[p.id];
        }
      }
    }

    setWeights(newWeights);
  }, [cx, cy, dragging, maxR, weights]);

  const t = (en: string, th: string, zh: string) =>
    locale === "th" ? th : locale === "zh" ? zh : en;

  return (
    <section className="section spider-section">
      <p className="eyebrow">{t("Your priorities", "ลำดับความสำคัญของคุณ", "你的优先级")}</p>
      <h2>{t("Drag the web. Watch cities re-rank.", "ลากใยแมงมุม ดูเมืองจัดอันดับใหม่", "拖动蛛网，观看城市重新排名")}</h2>
      <p className="section-intro">
        {t(
          "Distribute 100 points across six dimensions. The ranking updates in real time. What matters most to you — safety? economy? environment? Pull the web and find out.",
          "กระจาย 100 คะแนนใน 6 มิติ อันดับอัปเดตเรียลไทม์ อะไรสำคัญที่สุดสำหรับคุณ — ความปลอดภัย? เศรษฐกิจ? สิ่งแวดล้อม? ลากใยแมงมุมแล้วดู",
          "在六个维度分配100分。排名实时更新。什么对你最重要——安全？经济？环境？拖动蛛网看看结果。"
        )}
      </p>

      <div className="spider-layout">
        {/* Spider chart */}
        <div className="spider-chart-panel">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size} ${size}`}
            className="spider-svg"
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
            style={{ touchAction: "none" }}
          >
            {/* Grid rings */}
            {[25, 50, 75, 100].map(pct => {
              const r = (pct / TOTAL) * maxR;
              const pts = PILLARS.map((_, i) => polarToXY(cx, cy, r, i, n));
              const path = pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";
              return <path key={pct} d={path} fill="none" stroke="var(--border-hard)" strokeWidth="0.5" opacity="0.4" />;
            })}

            {/* Axis lines */}
            {PILLARS.map((_, i) => {
              const pt = polarToXY(cx, cy, maxR, i, n);
              return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="var(--border-hard)" strokeWidth="0.5" opacity="0.25" />;
            })}

            {/* Radar fill */}
            <path d={radarPath} fill="rgba(212, 131, 47, 0.1)" stroke="var(--saffron)" strokeWidth="2" />

            {/* Drag handles */}
            {PILLARS.map((p, i) => {
              const r = (weights[p.id] / TOTAL) * maxR;
              const pt = polarToXY(cx, cy, r, i, n);
              return (
                <circle
                  key={p.id}
                  cx={pt.x}
                  cy={pt.y}
                  r={dragging === i ? 7 : 5}
                  fill={p.color}
                  stroke="white"
                  strokeWidth="2"
                  style={{ cursor: "grab" }}
                  onPointerDown={(e) => { e.preventDefault(); setDragging(i); }}
                />
              );
            })}

            {/* Labels */}
            {PILLARS.map((p, i) => {
              const pt = polarToXY(cx, cy, maxR + 22, i, n);
              const label = locale === "th" ? p.labelTh : locale === "zh" ? p.labelZh : p.labelEn;
              return (
                <text key={p.id} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" fontFamily="var(--font-mono)" fontWeight="700" fill={p.color}>
                  {label}
                </text>
              );
            })}

            {/* Center weight display */}
            {PILLARS.map((p, i) => {
              const r = (weights[p.id] / TOTAL) * maxR;
              const pt = polarToXY(cx, cy, r + 12, i, n);
              return (
                <text key={`w-${p.id}`} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize="7" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--ink-muted)">
                  {weights[p.id]}
                </text>
              );
            })}
          </svg>

          <div className="spider-controls">
            <button
              className="spider-reset"
              onClick={() => setWeights({ ...DEFAULT_WEIGHTS })}
              disabled={isDefault}
            >
              {t("Reset to default", "รีเซ็ตเป็นค่าเริ่มต้น", "重置为默认")}
            </button>
            <span className="spider-badge">
              {isDefault
                ? t("Default weights", "น้ำหนักเริ่มต้น", "默认权重")
                : t("Your priorities", "ลำดับของคุณ", "你的优先级")}
            </span>
          </div>
        </div>

        {/* Re-ranked city list */}
        <div className="spider-ranking">
          <div className="spider-ranking-header">
            <span>{t("City", "เมือง", "城市")}</span>
            <span>{t("Score", "คะแนน", "分数")}</span>
          </div>
          {ranked.slice(0, 20).map((city, i) => (
            <button
              type="button"
              key={city.id}
              className="spider-ranking-row"
              aria-label={locale === "th" ? city.nameTh : city.nameEn}
              onClick={() => onNavigate(`/city/${city.id}`)}
            >
              <span className="spider-rank">{i + 1}</span>
              <span className="spider-city-name">
                {locale === "th" ? city.nameTh : city.nameEn}
              </span>
              <span className={`spider-tier tier-${city.tier}`}>
                {city.tier === "alpha" ? "α" : city.tier === "beta" ? "β" : "γ"}
              </span>
              <span className="spider-score">{city.customScore.toFixed(1)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
