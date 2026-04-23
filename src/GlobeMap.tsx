import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { partners, type Partner } from "./partnerData";
import type { Locale } from "./types";

interface Props { locale: Locale; }

// Equirectangular projection — 960×480, lat -60 to 75
function proj(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 960, y: ((75 - lat) / 135) * 480 };
}
const TH = proj(15, 101);

const TYPE_COLORS: Record<string, string> = {
  government: "#1A9A82", multilateral: "#C49A2A", university: "#4A9AFF",
  corporate: "#B56AFF", ngo: "#6BDB6B", event: "#FF6B6B",
};

// ---------------------------------------------------------------------------
// Basemap registry — free ESRI tile services, no key needed.
// Each "export" endpoint returns a single PNG for the requested bbox so we
// can paint it straight into <image> inside the SVG. Satellite + terrain get
// an optional transparent label overlay so place names stay legible.
// ---------------------------------------------------------------------------
type BasemapId = "light" | "dark" | "satellite" | "terrain" | "ocean";
type Basemap = {
  id: BasemapId;
  label: { en: string; th: string; zh: string };
  tile: string;
  /** Optional transparent overlay (roads, borders, labels). */
  labelOverlay?: string;
  /** Hover tint for arcs — light basemaps need darker strokes. */
  tone: "on-light" | "on-dark";
};
const BBOX = "bbox=-180,-60,180,75&size=1920,960&format=png&f=image&transparent=false";
const BBOX_LABEL = "bbox=-180,-60,180,75&size=1920,960&format=png&f=image&transparent=true";
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const BASEMAPS: Basemap[] = [
  {
    id: "light",
    label: { en: "Light", th: "สว่าง", zh: "浅色" },
    tile: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/export?${BBOX}`,
    labelOverlay: `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/export?${BBOX_LABEL}`,
    tone: "on-light",
  },
  {
    id: "dark",
    label: { en: "Dark", th: "มืด", zh: "深色" },
    tile: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/export?${BBOX}`,
    labelOverlay: `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/export?${BBOX_LABEL}`,
    tone: "on-dark",
  },
  {
    id: "satellite",
    label: { en: "Satellite", th: "ดาวเทียม", zh: "卫星" },
    tile: `${ESRI}/World_Imagery/MapServer/export?${BBOX}`,
    labelOverlay: `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/export?${BBOX_LABEL}`,
    tone: "on-dark",
  },
  {
    id: "terrain",
    label: { en: "Terrain", th: "ภูมิประเทศ", zh: "地形" },
    tile: `${ESRI}/World_Physical_Map/MapServer/export?${BBOX}`,
    tone: "on-light",
  },
  {
    id: "ocean",
    label: { en: "Ocean", th: "มหาสมุทร", zh: "海洋" },
    tile: `${ESRI}/Ocean/World_Ocean_Base/MapServer/export?${BBOX}`,
    labelOverlay: `${ESRI}/Ocean/World_Ocean_Reference/MapServer/export?${BBOX_LABEL}`,
    tone: "on-dark",
  },
];

function pickDefault(): BasemapId {
  if (typeof document === "undefined") return "light";
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "dark" ? "dark" : "light";
}

function labelOf(b: Basemap, locale: Locale): string {
  return locale === "th" ? b.label.th : locale === "zh" ? b.label.zh : b.label.en;
}

export default function GlobeMap({ locale }: Props) {
  const [hovered, setHovered] = useState<Partner | null>(null);
  const [basemapId, setBasemapId] = useState<BasemapId>(pickDefault);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mPos, setMPos] = useState({ x: 0, y: 0 });

  // Re-sync basemap default when theme toggles — only if user hasn't
  // explicitly picked satellite/terrain/ocean (those stay sticky).
  useEffect(() => {
    const mo = new MutationObserver(() => {
      setBasemapId(prev => (prev === "light" || prev === "dark" ? pickDefault() : prev));
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const basemap = BASEMAPS.find(b => b.id === basemapId) ?? BASEMAPS[0];
  const onLight = basemap.tone === "on-light";

  const sameCountry = useMemo(() => {
    if (!hovered) return new Set<string>();
    return new Set(partners.filter(p => p.country === hovered.country).map(p => p.id));
  }, [hovered]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) setMPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const countryCount = useMemo(() => new Set(partners.map(p => p.country)).size, []);

  // Thailand / hub + label contrast swap
  const hubColor = "#C49A2A";
  const labelColor = onLight ? "#14120F" : "#F5F3EE";
  const labelStroke = onLight ? "#FFFFFF" : "#14120F";

  return (
    <div className="globe-wrap" ref={containerRef} onMouseMove={onMove}>
      {/* Basemap switcher — satellite-guy toggle */}
      <div className="globe-basemap-switch" role="tablist" aria-label="Basemap">
        {BASEMAPS.map(b => (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={b.id === basemapId}
            className={`globe-basemap-btn${b.id === basemapId ? " active" : ""}`}
            onClick={() => setBasemapId(b.id)}
          >
            {labelOf(b, locale)}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 960 480" className="globe-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="globe-title globe-desc">
        <title id="globe-title">SCITI Partner Network</title>
        <desc id="globe-desc">{partners.length} partner organizations across {countryCount} countries connected to Thailand&apos;s smart city program</desc>

        {/* Basemap tile */}
        <image
          key={basemap.id}
          href={basemap.tile}
          x="0" y="0" width="960" height="480"
          preserveAspectRatio="none"
          opacity={basemap.id === "satellite" ? 1 : 0.92}
        />
        {/* Optional transparent label overlay */}
        {basemap.labelOverlay && (
          <image
            key={`${basemap.id}-labels`}
            href={basemap.labelOverlay}
            x="0" y="0" width="960" height="480"
            preserveAspectRatio="none"
            opacity="0.85"
            style={{ pointerEvents: "none" }}
          />
        )}

        {/* Thailand pulse */}
        <circle cx={TH.x} cy={TH.y} r="40" fill="rgba(196,154,42,.05)" />
        <circle cx={TH.x} cy={TH.y} r="22" fill="rgba(196,154,42,.09)" />
        <circle cx={TH.x} cy={TH.y} r="8" fill="none" stroke="rgba(196,154,42,.35)" strokeWidth="1" />

        {/* Arcs from Thailand to each partner */}
        {partners.map(p => {
          const pt = proj(p.lat, p.lng);
          const active = hovered?.id === p.id || sameCountry.has(p.id);
          const dx = pt.x - TH.x;
          const dy = pt.y - TH.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cx = (TH.x + pt.x) / 2;
          const cy = Math.min(TH.y, pt.y) - dist * 0.12;
          const baseOpacity = onLight ? 0.28 : 0.18;
          const dimOpacity = onLight ? 0.06 : 0.04;
          return (
            <path key={`a-${p.id}`}
              d={`M${TH.x},${TH.y}Q${cx},${cy},${pt.x},${pt.y}`}
              fill="none" stroke={TYPE_COLORS[p.type] ?? "#888"}
              strokeWidth={active ? 2 : 0.5}
              opacity={active ? 0.9 : hovered ? dimOpacity : baseOpacity}
              style={{ transition: "all .2s" }}
            />
          );
        })}

        {/* Thailand hub */}
        <circle cx={TH.x} cy={TH.y} r="5.5" fill={hubColor} />
        <text x={TH.x} y={TH.y - 12} textAnchor="middle" fontSize="8" fontWeight="700"
          fontFamily="Helvetica Neue,sans-serif" fill={hubColor}
          stroke={labelStroke} strokeWidth="2.5" paintOrder="stroke"
          letterSpacing="1.5">THAILAND</text>

        {/* Partner dots */}
        {partners.map((p, i) => {
          const pt = proj(p.lat, p.lng);
          const active = hovered?.id === p.id;
          const same = sameCountry.has(p.id);
          const off = (i % 3) * 4;
          return (
            <g key={p.id} tabIndex={0} role="button"
              aria-label={`${p.name}, ${p.country} — ${p.type}`}
              onFocus={() => setHovered(p)} onBlur={() => setHovered(null)}>
              <circle cx={pt.x + off} cy={pt.y} r="12" fill="transparent" style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(p)} onMouseLeave={() => setHovered(null)} />
              {active && <circle cx={pt.x + off} cy={pt.y} r="9" fill={TYPE_COLORS[p.type]} opacity="0.22" />}
              <circle cx={pt.x + off} cy={pt.y}
                r={active ? 5.5 : same ? 4 : 3}
                fill={TYPE_COLORS[p.type] ?? "#888"}
                stroke={labelStroke}
                strokeWidth={onLight ? 0.6 : 0.4}
                opacity={active ? 1 : same ? 0.95 : hovered ? 0.2 : 0.85}
                style={{ transition: "all .2s", pointerEvents: "none" }}
              />
              {active && (
                <text x={pt.x + off} y={pt.y - 8} textAnchor="middle" fontSize="6.5" fontWeight="700"
                  fill={labelColor}
                  stroke={labelStroke} strokeWidth="2" paintOrder="stroke"
                  fontFamily="Helvetica Neue,sans-serif">
                  {p.flag} {p.country}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* HTML tooltip */}
      {hovered && (
        <div className="globe-html-tooltip" style={{
          left: mPos.x + 18, top: mPos.y - 8,
          transform: mPos.x > 580 ? "translateX(calc(-100% - 36px))" : "none",
        }}>
          <div className="globe-tt-head">
            <span className="globe-tt-flag">{hovered.flag}</span>
            <div>
              <span className="globe-tt-name">{hovered.name}</span>
              <span className="globe-tt-meta">{hovered.country} · <span style={{ color: TYPE_COLORS[hovered.type] }}>{hovered.type}</span></span>
            </div>
          </div>
          <p className="globe-tt-focus">{locale === "th" ? hovered.focusTh : hovered.focusEn}</p>
          {hovered.url && <span className="globe-tt-url">{hovered.url.replace(/^https?:\/\//, "").slice(0, 45)}</span>}
        </div>
      )}

      {/* Dense legend bar */}
      <div className="globe-legend-bar">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="globe-lg-item">
            <span className="globe-lg-dot" style={{ background: color }} />{type}
          </span>
        ))}
        <span className="globe-lg-stat">{partners.length} orgs · {countryCount} countries</span>
      </div>
    </div>
  );
}
