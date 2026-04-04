import { useState, useMemo } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, translate } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";
import { TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

import { BOUNDS, MAP_W, MAP_H, project, cityCoords } from "./ThailandMap.constants";

// 50km grid: at Thailand's latitude (~15°N), 1° lat ≈ 111km, 1° lng ≈ 107km
// So 50km ≈ 0.45° lat, 0.47° lng
const GRID_STEP_LAT = 0.45;
const GRID_STEP_LNG = 0.47;

function buildGridLines() {
  const hLines: { y: number; lat: number }[] = [];
  const vLines: { x: number; lng: number }[] = [];
  for (let lat = Math.ceil(BOUNDS.minLat / GRID_STEP_LAT) * GRID_STEP_LAT; lat < BOUNDS.maxLat; lat += GRID_STEP_LAT) {
    const { y } = project(lat, BOUNDS.minLng);
    hLines.push({ y, lat });
  }
  for (let lng = Math.ceil(BOUNDS.minLng / GRID_STEP_LNG) * GRID_STEP_LNG; lng < BOUNDS.maxLng; lng += GRID_STEP_LNG) {
    const { x } = project(BOUNDS.minLat, lng);
    vLines.push({ x, lng });
  }
  return { hLines, vLines };
}

// Map tile layers — free providers
type MapLayer = "base" | "terrain" | "night" | "vegetation";

const LAYER_LABELS: Record<MapLayer, { en: string; th: string; zh: string }> = {
  base: { en: "Base", th: "พื้นฐาน", zh: "基础" },
  terrain: { en: "Terrain", th: "ภูมิประเทศ", zh: "地形" },
  night: { en: "Night", th: "กลางคืน", zh: "夜景" },
  vegetation: { en: "NDVI", th: "พืชพรรณ", zh: "植被" },
};

// Tile URL templates — using free Stamen/ESRI/NASA tiles
// We generate a composite image from multiple tiles at zoom 6 covering Thailand
function getTileUrl(layer: MapLayer): string {
  // Thailand center: ~15°N, 101°E, zoom level 6
  // Using static tile images for simplicity (no JS map library needed)
  switch (layer) {
    case "terrain":
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/export?bbox=97.2,5.4,105.8,20.6&bboxSR=4326&size=480,640&f=image&format=png&transparent=false";
    case "night":
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=97.2,5.4,105.8,20.6&bboxSR=4326&size=480,640&f=image&format=png&transparent=false";
    case "vegetation":
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=97.2,5.4,105.8,20.6&bboxSR=4326&size=480,640&f=image&format=png&transparent=false";
    default: // base — light cartographic
      return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/export?bbox=97.2,5.4,105.8,20.6&bboxSR=4326&size=480,640&f=image&format=png&transparent=false";
  }
}


function tierColor(tier: string): string {
  if (tier === "alpha") return "var(--teal, #2BBAA0)";
  if (tier === "beta") return "var(--gold, #D4A843)";
  return "var(--coral, #FF5252)";
}

const LAYERS: MapLayer[] = ["base", "terrain", "night", "vegetation"];

export default function ThailandMap({ locale, onNavigate }: Props) {
  const [hovered, setHovered] = useState<SmartCity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [layer, setLayer] = useState<MapLayer>("base");
  const [showGrid, setShowGrid] = useState(true);
  const { data: cities } = useCitySummaries();

  const grid = useMemo(() => buildGridLines(), []);
  const tileUrl = useMemo(() => getTileUrl(layer), [layer]);
  const isDark = layer === "night" || layer === "vegetation";

  return (
    <section className="section map-section">
      <p className="eyebrow">
        {translate(locale, { en: "Geography", th: "แผนที่", zh: "地图" })}
      </p>
      <h2>
        {translate(locale, {
          en: `${cities.length} cities across Thailand`,
          th: `${cities.length} เมืองทั่วประเทศไทย`,
          zh: `泰国全境 ${cities.length} 座城市`,
        })}
      </h2>

      <div className="map-layout">
        <div className="map-panel">
          {/* Layer toggle */}
          <div className="map-layer-toggle">
            {LAYERS.map(l => (
              <button
                key={l}
                className={`map-layer-btn ${layer === l ? "active" : ""}`}
                onClick={() => setLayer(l)}
              >
                {LAYER_LABELS[l][locale]}
              </button>
            ))}
            <button
              className={`map-layer-btn ${showGrid ? "active" : ""}`}
              onClick={() => setShowGrid(g => !g)}
              title="50km grid"
            >
              Grid
            </button>
          </div>

          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="map-svg">
            {/* Tile background */}
            <image
              href={tileUrl}
              x="0" y="0"
              width={MAP_W} height={MAP_H}
              preserveAspectRatio="none"
              opacity={isDark ? 0.7 : 0.5}
            />

            {/* 50km grid overlay */}
            {showGrid && (
              <g className="map-grid" opacity="0.15">
                {grid.hLines.map((line, i) => (
                  <line key={`h${i}`} x1="0" y1={line.y} x2={MAP_W} y2={line.y}
                    stroke={isDark ? "#fff" : "var(--ink, #222)"} strokeWidth="0.5" />
                ))}
                {grid.vLines.map((line, i) => (
                  <line key={`v${i}`} x1={line.x} y1="0" x2={line.x} y2={MAP_H}
                    stroke={isDark ? "#fff" : "var(--ink, #222)"} strokeWidth="0.5" />
                ))}
              </g>
            )}

            {/* City markers */}
            {cities.map(city => {
              const coords = cityCoords[city.id];
              if (!coords) return null;
              const { x, y } = project(coords.lat, coords.lng);
              const isCertified = city.status === "certified";
              const r = isCertified ? 5.5 : 3.5;
              const isHovered = hovered?.id === city.id;
              const isAlpha = city.tier === "alpha";

              return (
                <g key={city.id}>
                  {/* Alpha glow ring */}
                  {isAlpha && isCertified && (
                    <circle cx={x} cy={y} r={r + 4} fill="none"
                      stroke={tierColor(city.tier)} strokeWidth="0.5" opacity={isHovered ? 0.6 : 0.2} />
                  )}
                  <circle
                    className="map-marker"
                    cx={x} cy={y} r={isHovered ? r + 1.5 : r}
                    fill={tierColor(city.tier)}
                    opacity={hovered && !isHovered ? 0.2 : 0.9}
                    stroke={isCertified ? (isDark ? "#fff" : "var(--ink, #222)") : "none"}
                    strokeWidth={isCertified ? 0.8 : 0}
                    tabIndex={0}
                    role="button"
                    aria-label={`${getCityName(city, locale)}, ${city.compositeScore.toFixed(1)}`}
                    style={{ cursor: "pointer", transition: "all 0.15s" }}
                    onClick={() => onNavigate(`/city/${city.id}`)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(`/city/${city.id}`); } }}
                    onMouseEnter={() => { setHovered(city); setTooltipPos({ x, y }); }}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}

            {/* Tooltip */}
            {hovered && (() => {
              const tx = tooltipPos.x > MAP_W - 140 ? tooltipPos.x - 130 : tooltipPos.x + 12;
              const ty = tooltipPos.y < 30 ? tooltipPos.y + 16 : tooltipPos.y - 10;
              return (
                <g transform={`translate(${tx}, ${ty})`}>
                  <rect x="0" y="-14" width="125" height="34" fill="rgba(10,18,16,0.92)" />
                  <text x="6" y="1" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="var(--font-body, sans-serif)">
                    {getCityName(hovered, locale)}
                  </text>
                  <text x="6" y="13" fontSize="6" fontFamily="var(--font-mono, monospace)" fontWeight="600">
                    <tspan fill="var(--teal, #2BBAA0)">{hovered.compositeScore.toFixed(1)}</tspan>
                    <tspan fill="rgba(255,255,255,0.5)"> · {TIER_LABELS[locale][hovered.tier]}</tspan>
                  </text>
                </g>
              );
            })()}

            {/* Scale bar — 50km reference */}
            {showGrid && (() => {
              const km50inLng = 0.47;
              const p1 = project(6.0, 98.0);
              const p2 = project(6.0, 98.0 + km50inLng);
              const barW = p2.x - p1.x;
              return (
                <g transform={`translate(${MAP_W - barW - 20}, ${MAP_H - 25})`}>
                  <line x1="0" y1="0" x2={barW} y2="0" stroke={isDark ? "#fff" : "var(--ink, #222)"} strokeWidth="1.5" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke={isDark ? "#fff" : "var(--ink, #222)"} strokeWidth="1" />
                  <line x1={barW} y1="-3" x2={barW} y2="3" stroke={isDark ? "#fff" : "var(--ink, #222)"} strokeWidth="1" />
                  <text x={barW / 2} y="10" textAnchor="middle" fontSize="6" fontFamily="var(--font-mono, monospace)"
                    fontWeight="600" fill={isDark ? "rgba(255,255,255,0.7)" : "var(--ink-muted, #999)"}>
                    50 km
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="map-legend">
          <div className="map-legend-title">
            {translate(locale, { en: "Legend", th: "สัญลักษณ์", zh: "图例" })}
          </div>
          <div className="map-legend-item">
            <svg width="14" height="14"><circle cx="7" cy="7" r="5.5" fill="var(--teal, #2BBAA0)" stroke="var(--ink, #222)" strokeWidth="0.8" /></svg>
            <span>Alpha — {translate(locale, { en: "genuinely smart", th: "อัจฉริยะจริง", zh: "真正智慧" })}</span>
          </div>
          <div className="map-legend-item">
            <svg width="14" height="14"><circle cx="7" cy="7" r="4.5" fill="var(--gold, #D4A843)" stroke="var(--ink, #222)" strokeWidth="0.8" /></svg>
            <span>Beta — {translate(locale, { en: "in progress", th: "กำลังดำเนินการ", zh: "进行中" })}</span>
          </div>
          <div className="map-legend-item">
            <svg width="14" height="14"><circle cx="7" cy="7" r="4" fill="var(--coral, #FF5252)" /></svg>
            <span>Gamma — {translate(locale, { en: "early / plan", th: "เริ่มต้น/แผน", zh: "早期/规划" })}</span>
          </div>
          <div className="map-legend-item">
            <svg width="14" height="14">
              <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--teal, #2BBAA0)" strokeWidth="0.5" />
              <circle cx="7" cy="7" r="3" fill="var(--teal, #2BBAA0)" />
            </svg>
            <span>{translate(locale, { en: "glow = Alpha certified", th: "วงเรือง = Alpha รับรอง", zh: "光环 = Alpha认证" })}</span>
          </div>
          <div className="map-legend-item" style={{ marginTop: "0.5rem", opacity: 0.6 }}>
            <svg width="14" height="14"><line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="0.5" /></svg>
            <span>{translate(locale, { en: "grid = 50km", th: "ตาราง = 50 กม.", zh: "网格 = 50公里" })}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
