import { useState, useMemo } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, translate } from "./cityPresentation";
import { THAILAND_BOUNDS, CITY_COORDS as coords, projectTo, esriTileUrl, tierColor } from "./mapUtils";
import { REGIONS_ORDERED, REGION_LABELS } from "./regions";
import type { Locale, SmartCity } from "./types";
import { TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const B = THAILAND_BOUNDS;
const W = 560, H = 740;

function project(lat: number, lng: number) {
  return projectTo(lat, lng, B, W, H, 20);
}

type MapLayer = "base" | "satellite" | "terrain";

const layerUrls: Record<MapLayer, string> = {
  base: esriTileUrl(B, W, H, "light"),
  satellite: esriTileUrl(B, W, H, "satellite"),
  terrain: esriTileUrl(B, W, H, "topo"),
};

const LAYER_LABELS: Record<MapLayer, { en: string; th: string; zh: string }> = {
  base: { en: "Base", th: "แผนที่พื้นฐาน", zh: "基础" },
  satellite: { en: "Satellite", th: "ดาวเทียม", zh: "卫星" },
  terrain: { en: "Terrain", th: "ภูมิประเทศ", zh: "地形" },
};

const FILTER_LABELS: Record<"all" | "certified" | "promotion", { en: string; th: string; zh: string }> = {
  all: { en: "All", th: "ทั้งหมด", zh: "全部" },
  certified: { en: "Certified", th: "ได้รับการรับรอง", zh: "已认证" },
  promotion: { en: "Promotion", th: "ส่งเสริม", zh: "推广中" },
};

export default function MapDashboardPage({ locale, onNavigate }: Props) {
  const [layer, setLayer] = useState<MapLayer>("base");
  const [filter, setFilter] = useState<"all" | "certified" | "promotion">("all");
  const [hovered, setHovered] = useState<SmartCity | null>(null);
  const [hovPos, setHovPos] = useState({ x: 0, y: 0 });
  const { data: cities } = useCitySummaries();

  const filtered = useMemo(() => {
    if (filter === "all") return cities;
    return cities.filter(c => c.status === filter);
  }, [cities, filter]);

  // Regional stats
  const regionStats = useMemo(() => {
    return REGIONS_ORDERED.map(r => ({
      region: r,
      label: REGION_LABELS[locale][r],
      total: filtered.filter(c => c.region === r).length,
      alpha: filtered.filter(c => c.region === r && c.tier === "alpha").length,
      beta: filtered.filter(c => c.region === r && c.tier === "beta").length,
      gamma: filtered.filter(c => c.region === r && c.tier === "gamma").length,
    }));
  }, [filtered, locale]);

  const maxRegion = Math.max(...regionStats.map(r => r.total), 1);
  const isDark = layer === "satellite";

  return (
    <div className="map-dashboard">
      {/* ─── HEADER ─── */}
      <div className="map-dash-header">
        <div>
          <p className="eyebrow">{translate(locale, { en: "Smart City Map", th: "แผนที่เมืองอัจฉริยะ", zh: "智慧城市地图" })}</p>
          <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-.03em" }}>
            {translate(locale, {
              en: `${filtered.length} cities across Thailand`,
              th: `${filtered.length} เมืองทั่วประเทศ`,
              zh: `泰国全境 ${filtered.length} 座城市`,
            })}
          </h1>
        </div>
        <div className="map-dash-controls">
          <div className="map-dash-filter">
            {(["all", "certified", "promotion"] as const).map(f => (
              <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}>
                {translate(locale, FILTER_LABELS[f])}
              </button>
            ))}
          </div>
          <div className="map-dash-layers">
            {(["base", "satellite", "terrain"] as const).map(l => (
              <button key={l} className={`map-layer-btn ${layer === l ? "active" : ""}`}
                onClick={() => setLayer(l)}>
                {translate(locale, LAYER_LABELS[l])}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="map-dash-body">
        {/* ─── MAP ─── */}
        <div className="map-dash-map">
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
            <image href={layerUrls[layer]} x="0" y="0" width={W} height={H} preserveAspectRatio="none" />

            {/* 50km grid */}
            {Array.from({ length: 30 }, (_, i) => {
              const lat = B.minLat + i * 0.45;
              if (lat > B.maxLat) return null;
              const { y } = project(lat, B.minLng);
              return <line key={`h${i}`} x1="0" y1={y} x2={W} y2={y} stroke={isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)"} strokeWidth="0.5" strokeDasharray="3 6" />;
            })}
            {Array.from({ length: 20 }, (_, i) => {
              const lng = B.minLng + i * 0.47;
              if (lng > B.maxLng) return null;
              const { x } = project(B.minLat, lng);
              return <line key={`v${i}`} x1={x} y1="0" x2={x} y2={H} stroke={isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)"} strokeWidth="0.5" strokeDasharray="3 6" />;
            })}

            {/* City markers */}
            {filtered.map(city => {
              const c = coords[city.id];
              if (!c) return null;
              const { x, y } = project(c[0], c[1]);
              const isHov = hovered?.id === city.id;
              const r = city.status === "certified" ? (isHov ? 7 : 5) : (isHov ? 5 : 3.5);
              return (
                <g key={city.id}>
                  {city.tier === "alpha" && city.status === "certified" && (
                    <circle cx={x} cy={y} r={r + 5} fill="none" stroke={tierColor(city.tier)} strokeWidth="0.5" opacity={isHov ? .5 : .15} />
                  )}
                  <circle cx={x} cy={y} r={r}
                    fill={tierColor(city.tier)}
                    opacity={hovered && !isHov ? .15 : .85}
                    stroke={isDark ? "#fff" : "#111"} strokeWidth={city.status === "certified" ? .8 : 0}
                    style={{ cursor: "pointer", transition: "all .12s" }}
                    onClick={() => onNavigate(`/city/${city.id}`)}
                    onMouseEnter={() => { setHovered(city); setHovPos({ x, y }); }}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}

            {/* Tooltip */}
            {hovered && (() => {
              const tx = hovPos.x > W - 150 ? hovPos.x - 140 : hovPos.x + 12;
              const ty = hovPos.y < 30 ? hovPos.y + 14 : hovPos.y - 12;
              return (
                <g transform={`translate(${tx},${ty})`}>
                  <rect x="0" y="-14" width="135" height="36" fill="rgba(26,26,26,.92)" />
                  <text x="5" y="1" fontSize="8" fontWeight="700" fill="#fff">{getCityName(hovered, locale)}</text>
                  <text x="5" y="14" fontSize="6.5" fontFamily="var(--mono)" fontWeight="600">
                    <tspan fill="var(--teal)">{hovered.compositeScore.toFixed(1)}</tspan>
                    <tspan fill="rgba(255,255,255,.5)"> · {TIER_LABELS[locale][hovered.tier]} · {hovered.status}</tspan>
                  </text>
                </g>
              );
            })()}

            {/* Scale bar */}
            <g transform={`translate(${W - 80},${H - 20})`}>
              <line x1="0" y1="0" x2="46" y2="0" stroke={isDark ? "#fff" : "#111"} strokeWidth="1.5" />
              <text x="23" y="10" textAnchor="middle" fontSize="6" fontFamily="var(--mono)" fontWeight="600" fill={isDark ? "rgba(255,255,255,.6)" : "var(--3)"}>50 km</text>
            </g>
          </svg>
        </div>

        {/* ─── SIDEBAR: Regional breakdown ─── */}
        <div className="map-dash-sidebar">
          <div className="map-dash-sidebar-title">
            {translate(locale, { en: "By region", th: "แยกตามภูมิภาค", zh: "按地区" })}
          </div>
          {regionStats.map(r => (
            <div key={r.region} className="map-dash-region">
              <div className="map-dash-region-head">
                <span className="map-dash-region-name">{r.label}</span>
                <span className="map-dash-region-count">{r.total}</span>
              </div>
              <div className="map-dash-region-bar">
                {r.alpha > 0 && <div style={{ flex: r.alpha, background: "var(--alpha, #1A8A72)" }} />}
                {r.beta > 0 && <div style={{ flex: r.beta, background: "var(--beta, #9A7A1A)" }} />}
                {r.gamma > 0 && <div style={{ flex: r.gamma, background: "var(--gamma, #B03030)" }} />}
                <div style={{ flex: Math.max(0, maxRegion - r.total), background: "var(--surface, #F5F5F5)" }} />
              </div>
              <div className="map-dash-region-detail">
                {r.alpha > 0 && <span style={{ color: "var(--alpha)" }}>α{r.alpha}</span>}
                {r.beta > 0 && <span style={{ color: "var(--beta)" }}>β{r.beta}</span>}
                {r.gamma > 0 && <span style={{ color: "var(--gamma)" }}>γ{r.gamma}</span>}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="map-dash-legend">
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4.5" fill="var(--alpha)" stroke="#111" strokeWidth=".6" /></svg> {translate(locale, { en: "Alpha certified", th: "Alpha ได้รับการรับรอง", zh: "Alpha 已认证" })}</div>
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="3.5" fill="var(--beta)" /></svg> Beta</div>
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="3" fill="var(--gamma)" /></svg> Gamma</div>
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4.5" fill="none" stroke="var(--alpha)" strokeWidth=".5" /><circle cx="5" cy="5" r="2.5" fill="var(--alpha)" /></svg> {translate(locale, { en: "Alpha glow", th: "รัศมี Alpha", zh: "Alpha 光环" })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
