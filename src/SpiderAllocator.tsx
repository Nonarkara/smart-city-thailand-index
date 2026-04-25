import { useCallback, useMemo, useRef, useState } from "react";
import { allCities } from "./cityData";
import { getCityName, translate } from "./cityPresentation";
import {
  computePriorityScore,
  DEFAULT_PRIORITY_WEIGHTS,
  PRIORITY_PILLARS,
  PRIORITY_TOTAL,
  redistributePriorityWeights,
  type PriorityPillar,
} from "./priorities";
import { roundScore } from "./scoring";
import type { Locale } from "./types";

function polarToXY(cx: number, cy: number, r: number, index: number, count: number) {
  const angle = ((index / count) * 2 * Math.PI) - (Math.PI / 2);
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function SpiderAllocator({ locale, onNavigate }: Props) {
  const [weights, setWeights] = useState<Record<PriorityPillar, number>>({ ...DEFAULT_PRIORITY_WEIGHTS });
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const isDefault = PRIORITY_PILLARS.every(
    pillar => weights[pillar.id] === DEFAULT_PRIORITY_WEIGHTS[pillar.id],
  );

  const ranked = useMemo(() => {
    return [...allCities]
      .map(city => ({
        ...city,
        customScore: roundScore(computePriorityScore(city.scores, weights)),
      }))
      .sort((left, right) => right.customScore - left.customScore);
  }, [weights]);

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35;
  const n = PRIORITY_PILLARS.length;

  const updateWeight = useCallback((pillarId: PriorityPillar, rawValue: number) => {
    setWeights(current => redistributePriorityWeights(current, pillarId, rawValue));
  }, []);

  const nudgeWeight = useCallback((pillarId: PriorityPillar, delta: number) => {
    setWeights(current =>
      redistributePriorityWeights(current, pillarId, current[pillarId] + delta),
    );
  }, []);

  const radarPath = PRIORITY_PILLARS.map((pillar, index) => {
    const r = (weights[pillar.id] / PRIORITY_TOTAL) * maxR;
    const point = polarToXY(cx, cy, r, index, n);
    return `${index === 0 ? "M" : "L"} ${point.x},${point.y}`;
  }).join(" ") + " Z";

  const handlePointerMove = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    const mx = (event.clientX - rect.left) * scaleX;
    const my = (event.clientY - rect.top) * scaleY;
    const dx = mx - cx;
    const dy = my - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const rawValue = Math.round((distance / maxR) * PRIORITY_TOTAL);

    updateWeight(PRIORITY_PILLARS[dragging].id, rawValue);
  }, [cx, cy, dragging, maxR, size, updateWeight]);

  return (
    <section className="section spider-section">
      <p className="eyebrow">
        {translate(locale, { en: "Your priorities", th: "ลำดับความสำคัญของคุณ", zh: "你的优先级" })}
      </p>
      <h2>
        {translate(locale, {
          en: "Drag the web. Watch cities re-rank.",
          th: "ลากใยแมงมุม ดูเมืองจัดอันดับใหม่",
          zh: "拖动蛛网，观看城市重新排名",
        })}
      </h2>
      <p className="section-intro">
        {translate(locale, {
          en: "Distribute 100 points across six dimensions. The ranking updates in real time. Pull the shape toward what matters and watch the leaderboard change.",
          th: "กระจาย 100 คะแนนใน 6 มิติ อันดับจะอัปเดตทันที ลากรูปทรงไปทางสิ่งที่คุณให้ความสำคัญ แล้วดูว่าใครขึ้นใครลง",
          zh: "在六个维度里分配 100 分。排名会实时更新。把形状拉向你在乎的东西，然后看榜单怎么变。",
        })}
      </p>

      <div className="spider-layout">
        <div className="spider-chart-panel">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size} ${size}`}
            className="spider-svg"
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
            style={{ touchAction: "none" }}
          >
            {[25, 50, 75, 100].map(pct => {
              const r = (pct / PRIORITY_TOTAL) * maxR;
              const points = PRIORITY_PILLARS.map((_, index) => polarToXY(cx, cy, r, index, n));
              const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x},${point.y}`).join(" ") + " Z";
              return <path key={pct} d={path} fill="none" stroke="var(--border-hard)" strokeWidth="0.5" opacity="0.4" />;
            })}

            {PRIORITY_PILLARS.map((_, index) => {
              const point = polarToXY(cx, cy, maxR, index, n);
              return <line key={index} x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="var(--border-hard)" strokeWidth="0.5" opacity="0.25" />;
            })}

            <path d={radarPath} fill="rgba(212, 131, 47, 0.1)" stroke="var(--saffron)" strokeWidth="2" />

            {PRIORITY_PILLARS.map((pillar, index) => {
              const r = (weights[pillar.id] / PRIORITY_TOTAL) * maxR;
              const point = polarToXY(cx, cy, r, index, n);

              return (
                <circle
                  key={pillar.id}
                  cx={point.x}
                  cy={point.y}
                  r={dragging === index ? 7 : 5}
                  fill={pillar.color}
                  stroke="white"
                  strokeWidth="2"
                  style={{ cursor: "grab" }}
                  tabIndex={0}
                  role="slider"
                  aria-label={pillar.label[locale]}
                  aria-valuemin={2}
                  aria-valuemax={60}
                  aria-valuenow={weights[pillar.id]}
                  onPointerDown={event => {
                    event.preventDefault();
                    setDragging(index);
                  }}
                  onKeyDown={event => {
                    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
                      event.preventDefault();
                      nudgeWeight(pillar.id, 2);
                    }
                    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      nudgeWeight(pillar.id, -2);
                    }
                  }}
                />
              );
            })}

            {PRIORITY_PILLARS.map((pillar, index) => {
              const point = polarToXY(cx, cy, maxR + 22, index, n);
              return (
                <text
                  key={pillar.id}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fontFamily="var(--mono)"
                  fontWeight="700"
                  fill={pillar.color}
                >
                  {pillar.label[locale]}
                </text>
              );
            })}

            {PRIORITY_PILLARS.map((pillar, index) => {
              const r = (weights[pillar.id] / PRIORITY_TOTAL) * maxR;
              const point = polarToXY(cx, cy, r + 12, index, n);
              return (
                <text
                  key={`w-${pillar.id}`}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontFamily="var(--mono)"
                  fontWeight="600"
                  fill="var(--ink-muted)"
                >
                  {weights[pillar.id]}
                </text>
              );
            })}
          </svg>

          <div className="spider-controls">
            <button
              className="spider-reset"
              onClick={() => setWeights({ ...DEFAULT_PRIORITY_WEIGHTS })}
              disabled={isDefault}
            >
              {translate(locale, {
                en: "Reset to default",
                th: "รีเซ็ตเป็นค่าเริ่มต้น",
                zh: "重置为默认",
              })}
            </button>
            <span className="spider-badge">
              {isDefault
                ? translate(locale, { en: "Default weights", th: "น้ำหนักเริ่มต้น", zh: "默认权重" })
                : translate(locale, { en: "Your priorities", th: "ลำดับของคุณ", zh: "你的优先级" })}
            </span>
          </div>
        </div>

        <div className="spider-ranking">
          <div className="spider-ranking-header">
            <span>{translate(locale, { en: "City", th: "เมือง", zh: "城市" })}</span>
            <span>{translate(locale, { en: "Score", th: "คะแนน", zh: "分数" })}</span>
          </div>
          {ranked.slice(0, 20).map((city, index) => (
            <button
              type="button"
              key={city.id}
              className="spider-ranking-row"
              aria-label={getCityName(city, locale)}
              onClick={() => onNavigate(`/city/${city.id}`)}
            >
              <span className="spider-rank">{index + 1}</span>
              <span className="spider-city-name">{getCityName(city, locale)}</span>
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
