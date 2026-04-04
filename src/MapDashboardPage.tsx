import { useState, useMemo } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName } from "./cityPresentation";
import type { Locale, SmartCity, CityTier } from "./types";
import { TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

// Thailand bounding box for projection
const B = { minLat: 5.4, maxLat: 20.6, minLng: 97.2, maxLng: 105.8 };
const W = 560, H = 740;

function project(lat: number, lng: number) {
  return {
    x: ((lng - B.minLng) / (B.maxLng - B.minLng)) * (W - 40) + 20,
    y: ((B.maxLat - lat) / (B.maxLat - B.minLat)) * (H - 40) + 20,
  };
}

// City coordinates (reused from ThailandMap)
const coords: Record<string, [number, number]> = {
  "chiang-mai-old-town": [18.79, 98.98], "cmu-smart-city": [18.80, 98.95],
  "mae-moh": [18.31, 99.72], "nakhonsawan": [15.70, 100.12],
  "khon-kaen": [16.43, 102.83], "samyan": [13.73, 100.53],
  "phra-ram-4": [13.72, 100.54], "klong-phadung": [13.75, 100.50],
  "makkasan": [13.75, 100.56], "chachoengsao": [13.69, 101.07],
  "saensuk": [13.28, 100.92], "wangchan-valley": [12.88, 101.20],
  "phuket": [7.88, 98.39], "sritrang": [7.56, 99.61],
  "yala": [6.54, 101.28], "rayong": [12.68, 101.27],
  "khao-khun-song": [12.75, 101.30], "phitsanulok-muni": [16.82, 100.26],
  "phitsanulok-nu": [16.74, 100.20], "chiang-rai": [19.91, 99.83],
  "nan": [18.78, 100.77], "korat": [14.97, 102.10],
  "ubon": [15.25, 104.85], "krabi": [8.09, 98.91],
  "phangnga": [8.45, 98.52], "satun": [6.62, 100.07],
  "samui": [9.51, 100.06], "hat-yai": [7.00, 100.47],
  "pattani": [6.87, 101.25], "narathiwat": [6.43, 101.82],
  "lampang": [18.29, 99.49], "samut-prakan": [13.60, 100.60],
  "thep-paraj": [13.65, 101.10], "nikhom-phatthana": [12.75, 101.15],
  "nakhon-si-thammarat": [8.43, 99.96], "tai-yong": [8.40, 99.90],
  "phuket-tinicon": [7.85, 98.35], "songkhla-city": [7.19, 100.59],
  "rattanakosin": [13.76, 100.49], "nonthaburi": [13.86, 100.51],
  "chanthaburi": [12.61, 102.10], "tak": [16.88, 99.13],
  "phichit": [16.44, 100.35], "umong": [18.57, 98.98],
  "maesai": [20.43, 99.88], "bang-saray": [12.78, 100.92],
  "phitsanulok-ppao": [16.80, 100.28], "ubon-muni": [15.23, 104.87],
  "phlapphla": [12.58, 102.12],
};

type MapLayer = "base" | "satellite" | "terrain";

const layerUrls: Record<MapLayer, string> = {
  base: `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/export?bbox=${B.minLng},${B.minLat},${B.maxLng},${B.maxLat}&bboxSR=4326&size=${W},${H}&f=image&format=png`,
  satellite: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${B.minLng},${B.minLat},${B.maxLng},${B.maxLat}&bboxSR=4326&size=${W},${H}&f=image&format=png`,
  terrain: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/export?bbox=${B.minLng},${B.minLat},${B.maxLng},${B.maxLat}&bboxSR=4326&size=${W},${H}&f=image&format=png`,
};

function tierColor(tier: CityTier) {
  return tier === "alpha" ? "var(--alpha, #1A8A72)" : tier === "beta" ? "var(--beta, #9A7A1A)" : "var(--gamma, #B03030)";
}

const REGIONS: SmartCity["region"][] = ["north", "central", "northeast", "east", "south", "bangkok"];
const REGION_LABELS: Record<SmartCity["region"], string> = {
  north: "North", central: "Central", northeast: "Isan", east: "East", south: "South", bangkok: "BKK",
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
    return REGIONS.map(r => ({
      region: r,
      label: REGION_LABELS[r],
      total: filtered.filter(c => c.region === r).length,
      alpha: filtered.filter(c => c.region === r && c.tier === "alpha").length,
      beta: filtered.filter(c => c.region === r && c.tier === "beta").length,
      gamma: filtered.filter(c => c.region === r && c.tier === "gamma").length,
    }));
  }, [filtered]);

  const maxRegion = Math.max(...regionStats.map(r => r.total), 1);
  const isDark = layer === "satellite";

  return (
    <div className="map-dashboard">
      {/* ─── HEADER ─── */}
      <div className="map-dash-header">
        <div>
          <p className="eyebrow">{locale === "th" ? "แผนที่เมืองอัจฉริยะ" : "Smart City Map"}</p>
          <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-.03em" }}>
            {locale === "th" ? `${filtered.length} เมืองทั่วประเทศ` : `${filtered.length} cities across Thailand`}
          </h1>
        </div>
        <div className="map-dash-controls">
          <div className="map-dash-filter">
            {(["all", "certified", "promotion"] as const).map(f => (
              <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "certified" ? "Certified" : "Promotion"}
              </button>
            ))}
          </div>
          <div className="map-dash-layers">
            {(["base", "satellite", "terrain"] as const).map(l => (
              <button key={l} className={`map-layer-btn ${layer === l ? "active" : ""}`}
                onClick={() => setLayer(l)}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
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
            {locale === "th" ? "ภูมิภาค" : "By region"}
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
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4.5" fill="var(--alpha)" stroke="#111" strokeWidth=".6" /></svg> Alpha certified</div>
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="3.5" fill="var(--beta)" /></svg> Beta</div>
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="3" fill="var(--gamma)" /></svg> Gamma</div>
            <div className="map-dash-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4.5" fill="none" stroke="var(--alpha)" strokeWidth=".5" /><circle cx="5" cy="5" r="2.5" fill="var(--alpha)" /></svg> Alpha glow</div>
          </div>
        </div>
      </div>
    </div>
  );
}
