import { useState, useMemo, useEffect, type ReactNode } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, translate } from "./cityPresentation";
import { THAILAND_BOUNDS, CITY_COORDS as coords, projectTo, esriTileUrl, tierColor } from "./mapUtils";
import { REGIONS_ORDERED, REGION_LABELS } from "./regions";
import type { Locale, SmartCity } from "./types";
import { TIER_LABELS } from "./types";
import { toAppPath } from "./routing";
import "./LaemChabangPage.css";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
  guide?: ReactNode;
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

export default function MapDashboardPage({ locale, onNavigate, guide }: Props) {
  const [layer, setLayer] = useState<MapLayer>("base");
  const [filter, setFilter] = useState<"all" | "certified" | "promotion">("all");
  const [hovered, setHovered] = useState<SmartCity | null>(null);
  const [hovPos, setHovPos] = useState({ x: 0, y: 0 });
  const { data: cities } = useCitySummaries();
  const [imageState, setImageState] = useState<{ layer: MapLayer; state: "ready" | "unavailable" } | null>(null);
  const basemapState = imageState?.layer === layer ? imageState.state : "loading";
  useEffect(() => {
    const timer = window.setTimeout(() => setImageState(current => current?.layer === layer ? current : { layer, state: "unavailable" }), 12000);
    return () => window.clearTimeout(timer);
  }, [layer]);

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
      alpha: filtered.filter(c => c.region === r && c.status !== "registered" && c.tier === "alpha").length,
      beta: filtered.filter(c => c.region === r && c.status !== "registered" && c.tier === "beta").length,
      gamma: filtered.filter(c => c.region === r && c.status !== "registered" && c.tier === "gamma").length,
      unassessed: filtered.filter(c => c.region === r && c.status === "registered").length,
    }));
  }, [filtered, locale]);

  const maxRegion = Math.max(...regionStats.map(r => r.total), 1);
  const isDark = layer === "satellite";

  return (
    <div className="map-dashboard">
      {/* ─── HEADER ─── */}
      <div className="map-dash-header">
        <div>
          <h1>
            {translate(locale, {
              en: "City reference map",
              th: "แผนที่อ้างอิงเมือง",
              zh: "城市参考地图",
            })}
          </h1>
        </div>
        <div className="map-dash-controls">
          <div className="map-dash-filter">
            {(["all", "certified", "promotion"] as const).map(f => (
              <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}>
                {translate(locale, FILTER_LABELS[f])}
              </button>
            ))}
          </div>
          <div className="map-dash-layers">
            {(["base", "satellite", "terrain"] as const).map(l => (
              <button key={l} className={`map-layer-btn ${layer === l ? "active" : ""}`}
                aria-pressed={layer === l}
                onClick={() => setLayer(l)}>
                {translate(locale, LAYER_LABELS[l])}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="map-coordinate-note section" id="map-coordinate-note">{translate(locale, {
        en: `${filtered.filter(city => coords[city.id]).length} legacy reference points / ${filtered.length} records. Not verified project sites or boundaries; not for navigation or site selection.`,
        th: `จุดอ้างอิงเดิม ${filtered.filter(city => coords[city.id]).length} จุด / ${filtered.length} แฟ้ม ไม่ใช่ตำแหน่งโครงการหรือขอบเขตที่ยืนยันแล้ว ห้ามใช้นำทางหรือเลือกที่ตั้ง`,
        zh: `${filtered.filter(city => coords[city.id]).length} 个旧版参考点 / ${filtered.length} 份档案。非已核实的项目地点或边界，不用于导航或选址。`,
      })}</p>

      <div className="map-dash-body">
        {/* ─── MAP ─── */}
        <div className="map-dash-map">
          <p className="map-basemap-status" role="status">{basemapState === "ready" ? translate(locale, { en: "Basemap: Esri · Reference imagery; not a live feed", th: "แผนที่พื้นฐาน: Esri · ภาพอ้างอิง ไม่ใช่ข้อมูลสด", zh: "底图：Esri · 参考影像，非实时数据" }) : basemapState === "loading" ? translate(locale, { en: "Loading Esri basemap… Reference points remain available.", th: "กำลังโหลดแผนที่ Esri… ยังเปิดแฟ้มจากจุดอ้างอิงได้", zh: "正在加载 Esri 底图…参考点仍可使用。" }) : translate(locale, { en: "Esri basemap unavailable. Reference points only; try another layer.", th: "โหลดแผนที่ Esri ไม่สำเร็จ แสดงเฉพาะจุดอ้างอิง ลองเปลี่ยนชั้นข้อมูล", zh: "Esri 底图不可用。仅显示参考点，请尝试其他图层。" })}</p>
          <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={translate(locale, { en: "City reference points", th: "จุดอ้างอิงเมือง", zh: "城市参考点" })} aria-describedby="map-coordinate-note">
            <image key={layer} href={layerUrls[layer]} x="0" y="0" width={W} height={H} preserveAspectRatio="none" onLoad={() => setImageState({ layer, state: "ready" })} onError={() => setImageState({ layer, state: "unavailable" })} />

            {/* Reference grid, not surveyed distance intervals. */}
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
                    className="map-city-marker"
                    role="link" tabIndex={0}
                    aria-label={translate(locale, { en: `Open ${getCityName(city, locale)} dossier`, th: `เปิดแฟ้ม ${getCityName(city, locale)}`, zh: `打开${getCityName(city, locale)}档案` })}
                    fill={tierColor(city.tier)}
                    opacity={hovered && !isHov ? .15 : .85}
                    stroke={isDark ? "#fff" : "#111"} strokeWidth={city.status === "certified" ? .8 : 0}
                    style={{ cursor: "pointer", transition: "all .12s" }}
                    onClick={() => onNavigate(`/city/${city.id}`)}
                    onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onNavigate(`/city/${city.id}`); } }}
                    onFocus={() => { setHovered(city); setHovPos({ x, y }); }}
                    onBlur={() => setHovered(null)}
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

            {/* The legacy projection does not establish a calibrated distance scale. */}
          </svg>
        </div>

        {/* ─── SIDEBAR: Regional breakdown ─── */}
        <div className="map-dash-sidebar">
          <p className="municipal-context-link"><a href={toAppPath("/city/laem-chabang")}>{translate(locale, { en: "Laem Chabang · unranked municipal context →", th: "แหลมฉบัง · ข้อมูลเทศบาลที่ยังไม่จัดอันดับ →", zh: "林查班 · 尚未排名的市政资料 →" })}</a></p>
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
                {r.unassessed > 0 && <div style={{ flex: r.unassessed, background: "var(--4)" }} />}
                <div style={{ flex: Math.max(0, maxRegion - r.total), background: "var(--surface, #F5F5F5)" }} />
              </div>
              <div className="map-dash-region-detail">
                {r.alpha > 0 && <span style={{ color: "var(--alpha)" }}>α{r.alpha}</span>}
                {r.beta > 0 && <span style={{ color: "var(--beta-text)" }}>β{r.beta}</span>}
                {r.gamma > 0 && <span style={{ color: "var(--gamma)" }}>γ{r.gamma}</span>}
                {r.unassessed > 0 && <span>{translate(locale, { en: "Unassessed", th: "ยังไม่ประเมิน", zh: "待评估" })} {r.unassessed}</span>}
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
      <div className="map-guide-context">{guide}</div>
    </div>
  );
}
