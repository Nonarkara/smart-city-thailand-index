import { useState, useMemo, useRef, useCallback } from "react";
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

// Map tiles from ESRI — no hand-drawn continents needed

export default function GlobeMap({ locale }: Props) {
  const [hovered, setHovered] = useState<Partner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mPos, setMPos] = useState({ x: 0, y: 0 });

  const sameCountry = useMemo(() => {
    if (!hovered) return new Set<string>();
    return new Set(partners.filter(p => p.country === hovered.country).map(p => p.id));
  }, [hovered]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) setMPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  // Group partners by country for summary stats
  const countryCount = useMemo(() => new Set(partners.map(p => p.country)).size, []);

  return (
    <div className="globe-wrap" ref={containerRef} onMouseMove={onMove}>
      <svg viewBox="0 0 960 480" className="globe-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="globe-title globe-desc">
        <title id="globe-title">SCITI Partner Network</title>
        <desc id="globe-desc">{partners.length} partner organizations across {countryCount} countries connected to Thailand&apos;s smart city program</desc>
        {/* Real map tiles from ESRI — dark gray basemap */}
        <image
          href="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/export?bbox=-180,-60,180,75&size=1920,960&format=png&f=image&transparent=false"
          x="0" y="0" width="960" height="480"
          preserveAspectRatio="none"
          opacity="0.85"
        />

        {/* Thailand pulse */}
        <circle cx={TH.x} cy={TH.y} r="40" fill="rgba(196,154,42,.04)" />
        <circle cx={TH.x} cy={TH.y} r="22" fill="rgba(196,154,42,.06)" />
        <circle cx={TH.x} cy={TH.y} r="8" fill="none" stroke="rgba(196,154,42,.2)" strokeWidth="1" />

        {/* Arcs from Thailand to each partner */}
        {partners.map(p => {
          const pt = proj(p.lat, p.lng);
          const active = hovered?.id === p.id || sameCountry.has(p.id);
          // Bezier control point — arc upward proportional to distance
          const dx = pt.x - TH.x;
          const dy = pt.y - TH.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cx = (TH.x + pt.x) / 2;
          const cy = Math.min(TH.y, pt.y) - dist * 0.12;
          return (
            <path key={`a-${p.id}`}
              d={`M${TH.x},${TH.y}Q${cx},${cy},${pt.x},${pt.y}`}
              fill="none" stroke={TYPE_COLORS[p.type] ?? "#888"}
              strokeWidth={active ? 1.8 : 0.35}
              opacity={active ? 0.75 : hovered ? 0.02 : 0.1}
              style={{ transition: "all .2s" }}
            />
          );
        })}

        {/* Thailand hub */}
        <circle cx={TH.x} cy={TH.y} r="5.5" fill="#C49A2A" />
        <text x={TH.x} y={TH.y - 12} textAnchor="middle" fontSize="7.5" fontWeight="700"
          fontFamily="Helvetica Neue,sans-serif" fill="#C49A2A" letterSpacing="1.5">THAILAND</text>

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
              {active && <circle cx={pt.x + off} cy={pt.y} r="9" fill={TYPE_COLORS[p.type]} opacity="0.15" />}
              <circle cx={pt.x + off} cy={pt.y}
                r={active ? 5 : same ? 4 : 3}
                fill={TYPE_COLORS[p.type] ?? "#888"}
                opacity={active ? 1 : same ? 0.85 : hovered ? 0.12 : 0.6}
                style={{ transition: "all .2s", pointerEvents: "none" }}
              />
              {active && (
                <text x={pt.x + off} y={pt.y - 8} textAnchor="middle" fontSize="5.5" fontWeight="600"
                  fill="#fff" fontFamily="Helvetica Neue,sans-serif" opacity="0.9">
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
