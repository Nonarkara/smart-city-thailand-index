import { useState, useMemo, useRef } from "react";
import { partners, type Partner } from "./partnerData";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
}

function projectWorld(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 960;
  const y = ((75 - lat) / 135) * 480;
  return { x, y };
}

const THAILAND = projectWorld(15.0, 101.0);

function typeColor(type: Partner["type"]): string {
  switch (type) {
    case "government": return "#1A9A82";
    case "multilateral": return "#C49A2A";
    case "university": return "#4A9AFF";
    case "corporate": return "#B56AFF";
    case "ngo": return "#6BDB6B";
    case "event": return "#FF6B6B";
    default: return "#888";
  }
}

// Better continent outlines — simplified but recognizable
const NORTH_AMERICA = "M 40,100 L 55,80 80,72 110,68 140,72 165,80 180,95 185,110 190,130 178,148 165,155 150,165 130,170 115,168 105,175 90,180 80,172 70,160 55,152 42,145 38,130 35,115 Z";
const SOUTH_AMERICA = "M 135,195 L 148,188 160,192 168,205 172,220 175,240 178,260 176,280 170,295 160,308 148,315 135,310 128,295 125,275 122,255 118,240 120,225 125,210 Z";
const EUROPE = "M 380,55 L 395,48 415,50 435,52 450,58 455,65 460,52 470,48 485,55 490,68 488,80 480,88 470,85 460,78 445,80 435,75 425,78 410,82 398,78 388,72 382,62 Z";
const AFRICA = "M 395,110 L 410,105 430,108 445,115 455,128 460,145 462,165 460,190 455,210 448,228 440,240 428,248 415,252 402,248 392,238 385,225 380,208 378,188 380,168 382,148 385,130 388,118 Z";
const ASIA = "M 460,42 L 490,38 520,40 550,38 580,42 610,48 640,55 665,60 685,65 700,72 715,82 725,95 728,110 720,118 708,122 695,115 680,110 668,118 655,128 640,135 625,140 610,138 595,132 580,125 565,118 550,108 535,98 520,92 505,85 495,78 480,72 470,65 465,55 Z";
const SOUTHEAST_ASIA = "M 640,140 L 660,135 680,138 695,145 705,155 700,168 688,172 672,175 655,170 645,158 Z M 710,155 L 725,148 740,152 748,165 742,178 728,182 715,175 Z M 750,165 L 770,160 785,168 788,182 778,192 762,188 752,178 Z";
const OCEANIA = "M 720,225 L 745,218 775,215 800,218 820,225 835,240 840,258 832,275 818,285 798,290 775,288 755,280 742,268 735,252 730,238 Z M 870,248 L 885,242 895,248 892,258 882,262 872,258 Z";

export default function GlobeMap({ locale }: Props) {
  const [hovered, setHovered] = useState<Partner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const dots = useMemo(() => partners, []);
  const sameCountry = useMemo(() => {
    if (!hovered) return new Set<string>();
    return new Set(partners.filter(p => p.country === hovered.country).map(p => p.id));
  }, [hovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div className="globe-container" ref={containerRef} onMouseMove={handleMouseMove}>
      <svg viewBox="0 0 960 480" className="globe-svg" preserveAspectRatio="xMidYMid meet">
        {/* Ocean */}
        <rect x="0" y="0" width="960" height="480" fill="#0F0E0C" />

        {/* Subtle grid */}
        {[...Array(16)].map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 60} y1="0" x2={(i + 1) * 60} y2="480"
            stroke="rgba(255,255,255,.03)" strokeWidth="0.5" />
        ))}
        {[...Array(7)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 60} x2="960" y2={(i + 1) * 60}
            stroke="rgba(255,255,255,.03)" strokeWidth="0.5" />
        ))}

        {/* Continents */}
        {[NORTH_AMERICA, SOUTH_AMERICA, EUROPE, AFRICA, ASIA, SOUTHEAST_ASIA, OCEANIA].map((d, i) => (
          <path key={i} d={d} fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.08)" strokeWidth="0.8" />
        ))}

        {/* Thailand glow */}
        <circle cx={THAILAND.x} cy={THAILAND.y} r="35" fill="rgba(26,154,130,.08)" />
        <circle cx={THAILAND.x} cy={THAILAND.y} r="18" fill="rgba(26,154,130,.06)" />

        {/* Curved connection lines */}
        {dots.map(p => {
          const pt = projectWorld(p.lat, p.lng);
          const isActive = hovered?.id === p.id || sameCountry.has(p.id);
          const mx = (THAILAND.x + pt.x) / 2;
          const my = Math.min(THAILAND.y, pt.y) - 30 - Math.abs(pt.x - THAILAND.x) * 0.08;
          return (
            <path key={`arc-${p.id}`}
              d={`M ${THAILAND.x},${THAILAND.y} Q ${mx},${my} ${pt.x},${pt.y}`}
              fill="none"
              stroke={typeColor(p.type)}
              strokeWidth={isActive ? 1.5 : 0.4}
              opacity={isActive ? 0.7 : hovered ? 0.03 : 0.12}
              style={{ transition: "all .2s" }}
            />
          );
        })}

        {/* Thailand marker */}
        <circle cx={THAILAND.x} cy={THAILAND.y} r="5" fill="#C49A2A" stroke="#C49A2A" strokeWidth="2" opacity="0.9" />
        <text x={THAILAND.x} y={THAILAND.y - 10} textAnchor="middle" fontSize="7" fontWeight="700"
          fontFamily="Helvetica Neue, sans-serif" fill="#C49A2A" opacity="0.8">THAILAND</text>

        {/* Partner dots — bigger with invisible hit targets */}
        {dots.map((p, i) => {
          const pt = projectWorld(p.lat, p.lng);
          const isActive = hovered?.id === p.id;
          const isSameCountry = sameCountry.has(p.id);
          const offset = (i % 3) * 4;
          return (
            <g key={p.id}>
              {/* Invisible hit target */}
              <circle
                cx={pt.x + offset} cy={pt.y} r="14"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
              />
              {isActive && (
                <circle cx={pt.x + offset} cy={pt.y} r="10" fill={typeColor(p.type)} opacity="0.12" />
              )}
              <circle
                cx={pt.x + offset} cy={pt.y}
                r={isActive ? 5 : isSameCountry ? 4 : 3.5}
                fill={typeColor(p.type)}
                opacity={isActive ? 1 : isSameCountry ? 0.9 : hovered ? 0.15 : 0.65}
                style={{ transition: "all .2s", pointerEvents: "none" }}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML Tooltip — positioned outside SVG */}
      {hovered && (
        <div
          className="globe-html-tooltip"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y - 10,
            transform: mousePos.x > 600 ? "translateX(calc(-100% - 32px))" : "none",
          }}
        >
          <div className="globe-tooltip-header">
            <span className="globe-tooltip-flag">{hovered.flag}</span>
            <span className="globe-tooltip-name">{hovered.name}</span>
          </div>
          <div className="globe-tooltip-meta">
            <span className="globe-tooltip-country">{hovered.country}</span>
            <span className="globe-tooltip-type" style={{ color: typeColor(hovered.type) }}>{hovered.type}</span>
          </div>
          <p className="globe-tooltip-focus">
            {locale === "th" ? hovered.focusTh : hovered.focusEn}
          </p>
          {hovered.url && (
            <span className="globe-tooltip-url">{hovered.url.replace(/^https?:\/\//, "").slice(0, 40)}</span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="globe-legend">
        {([
          ["government", "Government"],
          ["multilateral", "UN / Multilateral"],
          ["university", "University"],
          ["corporate", "Corporate"],
          ["ngo", "NGO / Network"],
          ["event", "Event / Expo"],
        ] as [Partner["type"], string][]).map(([type, label]) => (
          <span key={type} className="globe-legend-item">
            <span className="globe-legend-dot" style={{ background: typeColor(type) }} />
            {label}
          </span>
        ))}
        <span className="globe-legend-count">
          {partners.length} {locale === "th" ? "องค์กร" : "organizations"} · {new Set(partners.map(p => p.country)).size} {locale === "th" ? "ประเทศ" : "countries"}
        </span>
      </div>
    </div>
  );
}
