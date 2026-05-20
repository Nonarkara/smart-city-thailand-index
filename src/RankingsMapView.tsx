// ---------------------------------------------------------------------------
// RankingsMapView — Thailand map with city markers + GISTDA layer toggles
// ---------------------------------------------------------------------------
// Renders the 49 certified cities as ranked markers on a Leaflet map of
// Thailand. Toggleable GISTDA overlays show flood-prone areas, fire hotspots,
// air pollution, and forest coverage.
//
// Leaflet is loaded via CDN (see index.html). The component checks for
// window.L before mounting; if not yet available it renders a placeholder.
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from "react";
import { getCityCoords } from "./cityCoordinates";
import { getCityName, getProvinceName, translate } from "./cityPresentation";
import { PROVINCIAL_FLOOD_SCORE, getFloodScore, getFloodNote } from "./provincialFloodData";
import { PILLAR_COLORS } from "./types";
import { toAppPath } from "./routing";
import type { Locale, SmartCity } from "./types";

// Minimal Leaflet type declaration (CDN-loaded global)
declare global {
  interface Window {
    L?: any;
  }
}

interface Props {
  locale: Locale;
  cities: SmartCity[];
  onNavigate: (path: string) => void;
}

type LayerKey = "flood" | "fire" | "pm25" | "forest";

interface LayerDef {
  key: LayerKey;
  icon: string;
  label: { en: string; th: string; zh: string };
  description: { en: string; th: string; zh: string };
  /** Tile URL template (ArcGIS REST /tile/{z}/{y}/{x}) */
  tileUrl?: string;
  /** Optional opacity for raster overlay (default 0.6) */
  opacity?: number;
  /** Optional accent color for legend dot */
  accent: string;
}

const LAYERS: LayerDef[] = [
  {
    key: "flood",
    icon: "🌊",
    label: { en: "Flood-prone areas", th: "พื้นที่เสี่ยงน้ำท่วม", zh: "易涝区域" },
    description: {
      en: "GISTDA repeat-flood polygons 2005–2016. Darker = more frequently inundated.",
      th: "ชั้นน้ำท่วมซ้ำซาก GISTDA ปี 2548-2559 พื้นที่เข้มกว่าคือท่วมบ่อยกว่า",
      zh: "GISTDA 2005-2016 重复洪水多边形。颜色越深，淹水频率越高。",
    },
    tileUrl:
      "https://gistdaportal.gistda.or.th/data/rest/services/FL_Flood/FL_RepeatedFlooding_GISTDA_50k_Y2005_Y2016/MapServer/tile/{z}/{y}/{x}",
    opacity: 0.7,
    accent: "#3D6BE8",
  },
  {
    key: "fire",
    icon: "🔥",
    label: { en: "Active fire hotspots", th: "จุดความร้อนล่าสุด", zh: "活跃热点" },
    description: {
      en: "GISTDA daily MODIS Terra/Aqua hotspot points — live wildfire/agricultural burning.",
      th: "จุดความร้อนรายวันจาก MODIS Terra/Aqua — ไฟป่าและการเผาทางการเกษตร",
      zh: "GISTDA 每日 MODIS Terra/Aqua 热点 — 实时山火与农业焚烧。",
    },
    tileUrl:
      "https://gistdaportal.gistda.or.th/data/rest/services/FR_Fire/hotspot_daily/MapServer/tile/{z}/{y}/{x}",
    opacity: 0.85,
    accent: "#E84D3D",
  },
  {
    key: "pm25",
    icon: "💨",
    label: { en: "Air pollution (PM2.5)", th: "ฝุ่น PM2.5", zh: "空气污染 PM2.5" },
    description: {
      en: "GISTDA daily air quality stations across Thailand. Hot spots show poor air quality.",
      th: "สถานีตรวจวัดคุณภาพอากาศ GISTDA รายวันทั่วประเทศไทย พื้นที่สีเข้มคือคุณภาพอากาศแย่",
      zh: "GISTDA 每日空气质量监测站。深色区域空气质量较差。",
    },
    tileUrl:
      "https://gistdaportal.gistda.or.th/data/rest/services/FR_Fire/AirQuality_daily/MapServer/tile/{z}/{y}/{x}",
    opacity: 0.8,
    accent: "#A05BD8",
  },
  {
    key: "forest",
    icon: "🌳",
    label: { en: "Forest coverage", th: "พื้นที่ป่าไม้", zh: "森林覆盖" },
    description: {
      en: "GISTDA forest cover at 50k scale — Royal Forest Department classification.",
      th: "พื้นที่ป่าไม้ GISTDA สเกล 50k จัดประเภทโดยกรมป่าไม้",
      zh: "GISTDA 50k 比例尺森林覆盖 — 皇家林业部分类。",
    },
    tileUrl:
      "https://gistdaportal.gistda.or.th/data/rest/services/L10_Forest/L10_Forest_GISTDA_50k/MapServer/tile/{z}/{y}/{x}",
    opacity: 0.55,
    accent: "#2D8C5C",
  },
];

const THAILAND_BOUNDS: [[number, number], [number, number]] = [
  [5.6, 97.3],
  [20.5, 105.7],
];
const INITIAL_CENTER: [number, number] = [13.5, 101.5];
const INITIAL_ZOOM = 6;

function tierColor(tier: SmartCity["tier"]): string {
  if (tier === "alpha") return "#0C2F53";
  if (tier === "beta") return "#3D5068";
  return "#9AA8BC";
}

function markerSize(score: number): number {
  return 6 + Math.round(score / 8); // 6 px at score 0 → 18.5 px at score 100
}

export default function RankingsMapView({ locale, cities, onNavigate }: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const layersRef = useRef<Record<LayerKey, any>>({} as Record<LayerKey, any>);
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set());
  const [hoveredCity, setHoveredCity] = useState<SmartCity | null>(null);
  const [leafletReady, setLeafletReady] = useState<boolean>(typeof window !== "undefined" && !!window.L);

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  // Wait for Leaflet CDN to finish loading
  useEffect(() => {
    if (leafletReady) return;
    const interval = window.setInterval(() => {
      if (window.L) {
        setLeafletReady(true);
        window.clearInterval(interval);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [leafletReady]);

  // Cities with valid coordinates (sorted by composite for marker render order)
  const citiesWithCoords = useMemo(() => {
    return cities
      .map(city => {
        const coords = getCityCoords(city.id);
        return coords ? { city, coords } : null;
      })
      .filter((x): x is { city: SmartCity; coords: { lat: number; lng: number } } => x !== null)
      .sort((a, b) => a.city.compositeScore - b.city.compositeScore); // low first so high renders on top
  }, [cities]);

  const sortedForList = useMemo(
    () => [...cities].sort((a, b) => b.compositeScore - a.compositeScore),
    [cities],
  );

  // Initialise map once Leaflet is available
  useEffect(() => {
    if (!leafletReady || !mapEl.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(mapEl.current, {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: 5,
      maxBounds: THAILAND_BOUNDS,
      maxBoundsViscosity: 0.7,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: false,
    });

    // Base layer — Carto Positron (clean, neutral, matches Jony-Ive brief)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletReady]);

  // Render city markers
  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;
    const L = window.L;
    const map = mapRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    citiesWithCoords.forEach(({ city, coords }) => {
      const size = markerSize(city.compositeScore);
      const fill = tierColor(city.tier);
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: size / 2,
        weight: 1.5,
        color: "#ffffff",
        fillColor: fill,
        fillOpacity: 0.95,
        opacity: 1,
      });

      const provinceName = getProvinceName(city, locale);
      const cityName = getCityName(city, locale);
      marker.bindTooltip(
        `<strong>${cityName}</strong><br/>${provinceName} · ${city.compositeScore.toFixed(1)}`,
        { direction: "top", offset: [0, -4], className: "ranking-map-tooltip" },
      );
      marker.on("mouseover", () => setHoveredCity(city));
      marker.on("mouseout", () => setHoveredCity(null));
      marker.on("click", () => onNavigate(`/city/${city.id}`));
      marker.addTo(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];
    };
  }, [leafletReady, citiesWithCoords, locale, onNavigate]);

  // Toggle layers
  const toggleLayer = (key: LayerKey) => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;
    const def = LAYERS.find(l => l.key === key);
    if (!def || !def.tileUrl) return;

    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        const layer = layersRef.current[key];
        if (layer) {
          map.removeLayer(layer);
          delete layersRef.current[key];
        }
        next.delete(key);
      } else {
        const layer = L.tileLayer(def.tileUrl, {
          opacity: def.opacity ?? 0.6,
          maxZoom: 19,
          attribution: "GISTDA",
        });
        layer.addTo(map);
        layersRef.current[key] = layer;
        next.add(key);
      }
      return next;
    });
  };

  const headerCity = hoveredCity;
  const headerProvince = hoveredCity ? hoveredCity.province : null;
  // getFloodScore() falls back to 60 (Thailand average) for provinces
  // without explicit GISTDA records. We want to show the numeric pill
  // ONLY for provinces with real data, but always show the methodology
  // note (dimmed if it's the fallback). So track the explicit-data flag
  // separately from the score itself.
  const hasExplicitFloodData = headerProvince ? !!PROVINCIAL_FLOOD_SCORE[headerProvince] : false;
  const floodScore = hasExplicitFloodData && headerProvince ? getFloodScore(headerProvince) : undefined;

  return (
    <div className="ranking-map-view">
      {/* Layer toggle strip */}
      <div className="ranking-map-toggles" role="group" aria-label={t({ en: "GISTDA data layers", th: "ชั้นข้อมูล GISTDA", zh: "GISTDA 数据层" })}>
        <span className="ranking-map-toggle-eyebrow">
          {t({ en: "GISTDA layers", th: "ชั้นข้อมูล GISTDA", zh: "GISTDA 层" })}
        </span>
        {LAYERS.map(def => {
          const active = activeLayers.has(def.key);
          return (
            <button
              key={def.key}
              type="button"
              className={`ranking-map-toggle ${active ? "active" : ""}`}
              onClick={() => toggleLayer(def.key)}
              aria-pressed={active}
              title={t(def.description)}
            >
              <span className="ranking-map-toggle-icon" aria-hidden="true">{def.icon}</span>
              <span className="ranking-map-toggle-label">{t(def.label)}</span>
              <span className="ranking-map-toggle-dot" style={{ background: active ? def.accent : "transparent", borderColor: def.accent }} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="ranking-map-layout">
        {/* Left: city list */}
        <ol className="ranking-map-list ranking-map-list-left">
          {sortedForList.slice(0, Math.ceil(sortedForList.length / 2)).map((city, idx) => {
            const province = getProvinceName(city, locale);
            const isHovered = hoveredCity?.id === city.id;
            return (
              <li key={city.id} className={`ranking-map-list-row ${isHovered ? "is-hovered" : ""}`}>
                <a
                  href={toAppPath(`/city/${city.id}`)}
                  className="ranking-map-list-link"
                  onClick={(e) => { e.preventDefault(); onNavigate(`/city/${city.id}`); }}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <span className="ranking-map-list-num">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="ranking-map-list-name">{getCityName(city, locale)}</span>
                  <span className="ranking-map-list-province">{province}</span>
                  <span className="ranking-map-list-score">{city.compositeScore.toFixed(1)}</span>
                </a>
              </li>
            );
          })}
        </ol>

        {/* Centre: map */}
        <div className="ranking-map-canvas">
          <div className="ranking-map-eyebrow">
            {t({ en: "Thailand · 49 certified cities", th: "ประเทศไทย · 49 เมืองรับรอง", zh: "泰国 · 49 座认证城市" })}
          </div>
          <div ref={mapEl} className="ranking-map-leaflet" aria-label={t({ en: "Map of Thailand smart cities", th: "แผนที่เมืองอัจฉริยะของไทย", zh: "泰国智慧城市地图" })} />
          {!leafletReady && (
            <div className="ranking-map-loading">
              {t({ en: "Loading map…", th: "กำลังโหลดแผนที่…", zh: "正在加载地图…" })}
            </div>
          )}
          {/* Active-layer description footer */}
          {activeLayers.size > 0 && (
            <div className="ranking-map-active-layers">
              {LAYERS.filter(l => activeLayers.has(l.key)).map(l => (
                <span key={l.key} className="ranking-map-active-chip" style={{ borderColor: l.accent }}>
                  <span className="ranking-map-active-dot" style={{ background: l.accent }} aria-hidden="true" />
                  {t(l.label)}
                </span>
              ))}
              <span className="ranking-map-active-source">
                {t({ en: "Source: GISTDA", th: "ที่มา: GISTDA", zh: "来源：GISTDA" })}
              </span>
            </div>
          )}
        </div>

        {/* Right: city list */}
        <ol className="ranking-map-list ranking-map-list-right" start={Math.ceil(sortedForList.length / 2) + 1}>
          {sortedForList.slice(Math.ceil(sortedForList.length / 2)).map((city, idx) => {
            const province = getProvinceName(city, locale);
            const absoluteRank = Math.ceil(sortedForList.length / 2) + idx + 1;
            const isHovered = hoveredCity?.id === city.id;
            return (
              <li key={city.id} className={`ranking-map-list-row ${isHovered ? "is-hovered" : ""}`}>
                <a
                  href={toAppPath(`/city/${city.id}`)}
                  className="ranking-map-list-link"
                  onClick={(e) => { e.preventDefault(); onNavigate(`/city/${city.id}`); }}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <span className="ranking-map-list-num">{String(absoluteRank).padStart(2, "0")}</span>
                  <span className="ranking-map-list-name">{getCityName(city, locale)}</span>
                  <span className="ranking-map-list-province">{province}</span>
                  <span className="ranking-map-list-score">{city.compositeScore.toFixed(1)}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Hover detail card */}
      {headerCity && (
        <div className="ranking-map-hover-card">
          <div className="ranking-map-hover-name">{getCityName(headerCity, locale)}</div>
          <div className="ranking-map-hover-meta">
            {getProvinceName(headerCity, locale)} · composite {headerCity.compositeScore.toFixed(1)}
          </div>
          {floodScore != null && (
            <div className="ranking-map-hover-flood">
              <span className="ranking-map-hover-flood-label">
                {t({ en: "Flood factor", th: "ปัจจัยน้ำท่วม", zh: "洪水因子" })}
              </span>
              <span className="ranking-map-hover-flood-value" style={{ color: floodScore >= 70 ? "#2D8C5C" : floodScore >= 50 ? "#C77A00" : "#C12F2F" }}>
                {floodScore}/100
              </span>
            </div>
          )}
          <div className="ranking-map-hover-note" style={{ opacity: hasExplicitFloodData ? 1 : 0.7 }}>
            {getFloodNote(headerCity.province)}
          </div>
        </div>
      )}

      {/* Unused color reference suppression — keeps PILLAR_COLORS import live for future legend */}
      <span hidden aria-hidden="true" style={{ display: "none" }}>{PILLAR_COLORS.livability}</span>
    </div>
  );
}
