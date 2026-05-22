// ---------------------------------------------------------------------------
// CityFingerprint — the visual DNA of a Thai smart city
// ---------------------------------------------------------------------------
// Each city's 7-pillar profile is rendered as a unique geometric polygon:
// 7 arms radiating from the centre, each scaled by pillar score (0–100).
// Cities with balanced profiles produce near-circles; specialists show
// pronounced spikes. No two cities look the same.
//
// Sizes:
//   xs  — 28px  in ranking-row gutters
//   sm  — 48px  in lens / compact cards
//   md  — 88px  in rankings gallery cards
//   lg  — 160px in city-detail hero overlay
//   xl  — 240px for standalone display
//
// Aesthetic brief: Braun ET66 precision — crisp hairline stroke, ink fill
// at low opacity, coloured pillar dots. Zero gradients, zero blur, no glow.
// ---------------------------------------------------------------------------

import type { CityScores } from "./types";
import { PILLAR_COLORS } from "./types";

/** Left-to-right pillar order, matching the arm angles (top → clockwise) */
const PILLAR_ORDER = [
  "livability",
  "economy",
  "safety",
  "wellbeing",
  "environment",
  "hospitality",
  "digital",
] as const;

type Pillar = (typeof PILLAR_ORDER)[number];

interface Props {
  scores: CityScores;
  /** Rendered square size in pixels. Defaults to 88. */
  size?: number;
  /** Overall opacity of the shape fill. Defaults to 0.12. */
  fillOpacity?: number;
  /** Whether to show per-pillar coloured dots at arm tips. Defaults to true. */
  showDots?: boolean;
  /** Whether to show the light grid heptagon behind the shape. Defaults to true for md+. */
  showGrid?: boolean;
  /** A11y: screenreader description. Provide the city name. */
  cityName?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Degrees → radians. */
const RAD = (deg: number) => (deg * Math.PI) / 180;

/**
 * Builds the SVG points string for a regular heptagon grid or the
 * score-scaled inner polygon.
 */
function buildPolygon(
  cx: number,
  cy: number,
  radii: number[],
): string {
  const n = radii.length;
  return radii
    .map((r, i) => {
      // Arm 0 points straight up (−90°). Subsequent arms rotate clockwise.
      const angle = RAD(-90 + (360 / n) * i);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function CityFingerprint({
  scores,
  size = 88,
  fillOpacity = 0.12,
  showDots = true,
  showGrid,
  cityName,
  className,
  style,
}: Props) {
  const n = PILLAR_ORDER.length;
  const cx = size / 2;
  const cy = size / 2;
  // Leave a small margin (10% each side) so dots don't clip at full score
  const maxR = (size / 2) * 0.82;
  const gridR = maxR;
  const dotR = Math.max(1.5, size * 0.028);

  // Default: show grid for md (88px) and above
  const renderGrid = showGrid ?? size >= 80;

  const scoreRadii = PILLAR_ORDER.map(p => ((scores[p] ?? 50) / 100) * maxR);
  const gridRadii = Array(n).fill(gridR);
  const innerGridRadii = Array(n).fill(gridR * 0.5);

  const shapePoly = buildPolygon(cx, cy, scoreRadii);
  const gridPoly = buildPolygon(cx, cy, gridRadii);
  const innerGridPoly = buildPolygon(cx, cy, innerGridRadii);

  // Arm tip positions for dots
  const tipPoints = scoreRadii.map((r, i) => {
    const angle = RAD(-90 + (360 / n) * i);
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      color: PILLAR_COLORS[PILLAR_ORDER[i] as Pillar] ?? "var(--ink)",
    };
  });

  return (
    <svg
      className={`city-fingerprint${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={style}
      aria-label={
        cityName
          ? `${cityName} — 7-pillar profile visualization`
          : "City pillar profile"
      }
      role="img"
    >
      {/* Grid heptagon (outer + 50% inner) */}
      {renderGrid && (
        <>
          <polygon
            points={gridPoly}
            fill="none"
            stroke="var(--4)"
            strokeWidth={0.5}
            opacity={0.6}
          />
          <polygon
            points={innerGridPoly}
            fill="none"
            stroke="var(--4)"
            strokeWidth={0.5}
            opacity={0.4}
          />
          {/* Axis lines from centre to grid vertices */}
          {gridRadii.map((r, i) => {
            const angle = RAD(-90 + (360 / n) * i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(angle) * r}
                y2={cy + Math.sin(angle) * r}
                stroke="var(--4)"
                strokeWidth={0.5}
                opacity={0.4}
              />
            );
          })}
        </>
      )}

      {/* Score polygon fill */}
      <polygon
        points={shapePoly}
        fill="var(--ink)"
        fillOpacity={fillOpacity}
        stroke="var(--ink)"
        strokeWidth={1}
        strokeOpacity={0.55}
        strokeLinejoin="round"
      />

      {/* Per-pillar coloured dots at arm tips */}
      {showDots &&
        tipPoints.map((tip, i) => (
          <circle
            key={i}
            cx={tip.x}
            cy={tip.y}
            r={dotR}
            fill={tip.color}
            fillOpacity={0.9}
          />
        ))}
    </svg>
  );
}
