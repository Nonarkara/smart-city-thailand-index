import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import land110m from "world-atlas/land-110m.json";
import { partners, type Partner } from "./partnerData";
import type { Locale } from "./types";

interface Props { locale: Locale; }

// ---------------------------------------------------------------------------
// Projection — d3 equirectangular fitted to the viewport. This replaces the
// hand-rolled proj() we used before. Every partner dot, the Thailand hub,
// and the land outline all go through the same projection, so they line
// up pixel-exact. The viewport spans lat -60 → 75 (polar white-out hidden).
// ---------------------------------------------------------------------------
const VIEW_W = 960;
const VIEW_H = 480;
const projection = geoEquirectangular()
  .rotate([0, 0])
  .fitExtent(
    [[0, 0], [VIEW_W, VIEW_H]],
    {
      type: "Polygon",
      coordinates: [[[-180, 75], [180, 75], [180, -60], [-180, -60], [-180, 75]]],
    } as GeoJSON.Polygon,
  );
const pathGen = geoPath(projection);

const TYPE_COLORS: Record<string, string> = {
  government: "#1A9A82", multilateral: "#C49A2A", university: "#4A9AFF",
  corporate: "#B56AFF", ngo: "#6BDB6B", event: "#FF6B6B",
};

// ---------------------------------------------------------------------------
// Land outline — TopoJSON from world-atlas. Same pattern SLIC uses. Rendered
// once via useMemo, then cached. This is the BASE LAYER: always visible,
// zero network dependency, works offline. Satellite imagery layers on top.
// ---------------------------------------------------------------------------
function useLandPath(): string {
  return useMemo(() => {
    const topology = land110m as unknown as Topology;
    const land = feature(topology, topology.objects.land as GeometryCollection) as FeatureCollection;
    return pathGen(land) ?? "";
  }, []);
}

// ---------------------------------------------------------------------------
// Optional satellite/physical/night overlay. These are public-domain
// equirectangular JPGs served direct (NASA Blue Marble, Earth at Night,
// Wikipedia reference). They layer on top of the outline at reduced opacity
// so the minimalist base still reads through.
// ---------------------------------------------------------------------------
type OverlayId = "none" | "physical" | "satellite" | "night";
type Overlay = {
  id: OverlayId;
  label: { en: string; th: string; zh: string };
  src?: string;
  tone: "on-light" | "on-dark";
};
const OVERLAYS: Overlay[] = [
  { id: "none", label: { en: "Outline", th: "โครง", zh: "轮廓" }, tone: "on-light" },
  {
    id: "physical", label: { en: "Physical", th: "ภูมิประเทศ", zh: "地形" },
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1920px-Equirectangular_projection_SW.jpg",
    tone: "on-light",
  },
  {
    id: "satellite", label: { en: "Satellite", th: "ดาวเทียม", zh: "卫星" },
    src: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Land_ocean_ice_2048.jpg",
    tone: "on-dark",
  },
  {
    id: "night", label: { en: "Night", th: "กลางคืน", zh: "夜间" },
    src: "https://eoimages.gsfc.nasa.gov/images/imagerecords/55000/55167/earth_lights_lrg.jpg",
    tone: "on-dark",
  },
];

// Equirectangular JPGs cover lat 90 → -90 (180°). Our viewport spans lat 75
// → -60 (135°). So to line up, image height in SVG units = VIEW_H * 180/135
// ≈ 640, and y-offset = -(90-75)/180 * 640 ≈ -53.33.
const IMG_Y = -((90 - 75) / 180) * (VIEW_H * 180 / 135);
const IMG_H = VIEW_H * 180 / 135;

function labelOf(o: Overlay, locale: Locale): string {
  return locale === "th" ? o.label.th : locale === "zh" ? o.label.zh : o.label.en;
}

function pickDefault(): OverlayId {
  if (typeof document === "undefined") return "none";
  const theme = document.documentElement.getAttribute("data-theme");
  // Dark-theme users see the outline with dark ocean — still legible. Don't
  // auto-load imagery; let the user opt in. Saves ~500 kB on first paint.
  return theme === "dark" ? "none" : "none";
}

export default function GlobeMap({ locale }: Props) {
  const [hovered, setHovered] = useState<Partner | null>(null);
  const [overlayId, setOverlayId] = useState<OverlayId>(pickDefault);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [mPos, setMPos] = useState({ x: 0, y: 0 });

  // Track theme toggle so the outline colours swap live.
  useEffect(() => {
    const mo = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const overlay = OVERLAYS.find(o => o.id === overlayId) ?? OVERLAYS[0];
  const onLight = overlay.id === "none" ? !isDark : overlay.tone === "on-light";

  const landPath = useLandPath();
  const thailandPt = projection([101, 15]) ?? [0, 0];

  const sameCountry = useMemo(() => {
    if (!hovered) return new Set<string>();
    return new Set(partners.filter(p => p.country === hovered.country).map(p => p.id));
  }, [hovered]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) setMPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const countryCount = useMemo(() => new Set(partners.map(p => p.country)).size, []);

  // Outline colour system — hairline land fill + subtle country stroke.
  const oceanFill = overlay.id !== "none" ? "transparent" : (isDark ? "#0A0A0B" : "#F4F4F5");
  const landFill = overlay.id !== "none" ? "rgba(0,0,0,0)" : (isDark ? "#1D1D21" : "#E4E4E7");
  const landStroke = overlay.id !== "none" ? "rgba(255,255,255,.25)" : (isDark ? "#2A2A2E" : "#D4D4D8");
  const hubColor = "#C49A2A";
  const labelColor = onLight ? "#14120F" : "#F5F3EE";
  const labelStroke = onLight ? "#FFFFFF" : "#14120F";

  return (
    <div className="globe-wrap" ref={containerRef} onMouseMove={onMove}>
      {/* Overlay switcher — satellite-guy toggle */}
      <div className="globe-basemap-switch" role="tablist" aria-label="Overlay">
        {OVERLAYS.map(o => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={o.id === overlayId}
            className={`globe-basemap-btn${o.id === overlayId ? " active" : ""}`}
            onClick={() => setOverlayId(o.id)}
          >
            {labelOf(o, locale)}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="globe-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="globe-title globe-desc">
        <title id="globe-title">SCITI Partner Network</title>
        <desc id="globe-desc">{partners.length} partner organizations across {countryCount} countries connected to Thailand&apos;s smart city program</desc>

        {/* Ocean fill */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={oceanFill} />

        {/* Optional remote imagery (satellite / physical / night) */}
        {overlay.src && (
          <image
            key={overlay.id}
            href={overlay.src}
            x="0"
            y={IMG_Y}
            width={VIEW_W}
            height={IMG_H}
            preserveAspectRatio="none"
            opacity="0.92"
          />
        )}

        {/* Always-visible land outline — this is the base layer that
            guarantees the map is never blank even if imagery fails. */}
        <path d={landPath} fill={landFill} stroke={landStroke} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

        {/* Thailand pulse */}
        <circle cx={thailandPt[0]} cy={thailandPt[1]} r="40" fill="rgba(196,154,42,.05)" />
        <circle cx={thailandPt[0]} cy={thailandPt[1]} r="22" fill="rgba(196,154,42,.09)" />
        <circle cx={thailandPt[0]} cy={thailandPt[1]} r="8" fill="none" stroke="rgba(196,154,42,.45)" strokeWidth="1" />

        {/* Arcs from Thailand to each partner */}
        {partners.map(p => {
          const pt = projection([p.lng, p.lat]);
          if (!pt) return null;
          const active = hovered?.id === p.id || sameCountry.has(p.id);
          const dx = pt[0] - thailandPt[0];
          const dy = pt[1] - thailandPt[1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cx = (thailandPt[0] + pt[0]) / 2;
          const cy = Math.min(thailandPt[1], pt[1]) - dist * 0.12;
          const baseOpacity = onLight ? 0.32 : 0.22;
          const dimOpacity = onLight ? 0.08 : 0.05;
          return (
            <path key={`a-${p.id}`}
              d={`M${thailandPt[0]},${thailandPt[1]}Q${cx},${cy},${pt[0]},${pt[1]}`}
              fill="none" stroke={TYPE_COLORS[p.type] ?? "#888"}
              strokeWidth={active ? 2 : 0.6}
              opacity={active ? 0.92 : hovered ? dimOpacity : baseOpacity}
              style={{ transition: "all .2s" }}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Thailand hub */}
        <circle cx={thailandPt[0]} cy={thailandPt[1]} r="5.5" fill={hubColor} />
        <text x={thailandPt[0]} y={thailandPt[1] - 12} textAnchor="middle" fontSize="8" fontWeight="700"
          fontFamily="var(--mono)" fill={hubColor}
          stroke={labelStroke} strokeWidth="2.5" paintOrder="stroke"
          letterSpacing="1.5">THAILAND</text>

        {/* Partner dots */}
        {partners.map((p, i) => {
          const pt = projection([p.lng, p.lat]);
          if (!pt) return null;
          const active = hovered?.id === p.id;
          const same = sameCountry.has(p.id);
          const off = (i % 3) * 4;
          return (
            <g key={p.id} tabIndex={0} role="button"
              aria-label={`${p.name}, ${p.country} — ${p.type}`}
              onClick={() => setHovered(p)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setHovered(p);
                }
              }}
              onFocus={() => setHovered(p)} onBlur={() => setHovered(null)}>
              <circle cx={pt[0] + off} cy={pt[1]} r="12" fill="transparent" style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(p)} onMouseLeave={() => setHovered(null)} />
              {active && <circle cx={pt[0] + off} cy={pt[1]} r="9" fill={TYPE_COLORS[p.type]} opacity="0.22" />}
              <circle cx={pt[0] + off} cy={pt[1]}
                r={active ? 5.5 : same ? 4 : 3}
                fill={TYPE_COLORS[p.type] ?? "#888"}
                stroke={labelStroke}
                strokeWidth={onLight ? 0.6 : 0.4}
                opacity={active ? 1 : same ? 0.95 : hovered ? 0.2 : 0.88}
                style={{ transition: "all .2s", pointerEvents: "none" }}
              />
              {active && (
                <text x={pt[0] + off} y={pt[1] - 8} textAnchor="middle" fontSize="6.5" fontWeight="700"
                  fill={labelColor}
                  stroke={labelStroke} strokeWidth="2" paintOrder="stroke"
                  fontFamily="var(--mono)">
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
