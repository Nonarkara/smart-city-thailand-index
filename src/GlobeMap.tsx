import { useState, useMemo } from "react";
import { partners, type Partner } from "./partnerData";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
}

// Simple Mercator projection for world map
// x: -180 to 180 → 0 to 800
// y: -60 to 75 → 400 to 0 (inverted)
function projectWorld(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 800;
  const y = ((75 - lat) / 135) * 400;
  return { x, y };
}

// Thailand position for the connection lines
const THAILAND = projectWorld(15.0, 101.0);

function typeColor(type: Partner["type"]): string {
  switch (type) {
    case "government": return "var(--teal, #2BBAA0)";
    case "multilateral": return "var(--gold, #D4A843)";
    case "university": return "var(--silk-blue, #4A9AFF)";
    case "corporate": return "var(--orchid, #B56AFF)";
    case "ngo": return "var(--lime, #6BDB6B)";
    case "event": return "var(--coral, #FF5252)";
    default: return "var(--ink-muted)";
  }
}

// Simplified world coastline paths (key continents)
const CONTINENTS = `
M 120,85 L 135,80 150,82 160,90 165,105 170,120 175,135 168,145 155,150 140,155 125,150 115,140 110,125 112,105 Z
M 200,55 L 210,50 230,48 260,50 280,55 295,60 310,65 320,75 325,90 330,110 340,130 335,150 320,155 310,145 295,140 280,145 265,155 250,160 235,165 220,158 210,145 200,130 195,110 198,90 195,75 Z
M 340,55 L 360,50 390,52 420,55 450,58 480,62 510,60 530,55 550,58 560,65 570,80 580,95 575,110 565,125 555,140 545,155 535,150 520,135 510,120 500,110 490,105 480,115 470,130 460,145 450,160 440,170 430,175 420,180 405,175 395,165 390,150 380,135 370,120 360,105 350,90 345,75 Z
M 620,80 L 645,75 670,78 695,82 710,90 720,105 715,120 705,135 690,145 675,150 660,148 645,140 635,128 625,115 620,100 618,90 Z
M 590,250 L 610,240 640,235 660,240 680,250 690,265 685,280 670,295 650,305 630,310 610,305 595,290 590,275 588,260 Z
`;

export default function GlobeMap({ locale }: Props) {
  const [hovered, setHovered] = useState<Partner | null>(null);

  // Deduplicate by proximity (some partners share same city)
  const dots = useMemo(() => {
    const seen = new Set<string>();
    return partners.filter(p => {
      const key = `${Math.round(p.lat)}_${Math.round(p.lng)}`;
      if (seen.has(key)) {
        // Allow up to 3 per location with slight offset
        return true;
      }
      seen.add(key);
      return true;
    });
  }, []);

  return (
    <div className="globe-container">
      <svg viewBox="0 0 800 400" className="globe-svg">
        <defs>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--teal, #2BBAA0)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width="800" height="400" fill="var(--bg, #0A1210)" />

        {/* Grid lines */}
        {[...Array(12)].map((_, i) => (
          <line key={`vg${i}`} x1={(i + 1) * 66.6} y1="0" x2={(i + 1) * 66.6} y2="400"
            stroke="var(--border, rgba(43,186,160,0.06))" strokeWidth="0.3" />
        ))}
        {[...Array(5)].map((_, i) => (
          <line key={`hg${i}`} x1="0" y1={(i + 1) * 66.6} x2="800" y2={(i + 1) * 66.6}
            stroke="var(--border, rgba(43,186,160,0.06))" strokeWidth="0.3" />
        ))}

        {/* Continents — simplified fills */}
        <path d={CONTINENTS} fill="rgba(43, 186, 160, 0.06)" stroke="rgba(43, 186, 160, 0.12)" strokeWidth="0.5" />

        {/* Thailand highlight */}
        <circle cx={THAILAND.x} cy={THAILAND.y} r="30" fill="url(#globe-glow)" />
        <circle cx={THAILAND.x} cy={THAILAND.y} r="4" fill="var(--gold, #D4A843)" stroke="var(--gold, #D4A843)" strokeWidth="1.5" opacity="0.9" />
        <text x={THAILAND.x} y={THAILAND.y - 8} textAnchor="middle" fontSize="5" fontWeight="700"
          fontFamily="var(--font-mono, monospace)" fill="var(--gold, #D4A843)" opacity="0.8">
          THAILAND
        </text>

        {/* Connection lines from Thailand to each partner */}
        {dots.map(p => {
          const pt = projectWorld(p.lat, p.lng);
          const isActive = hovered?.id === p.id;
          return (
            <line key={`line-${p.id}`}
              x1={THAILAND.x} y1={THAILAND.y} x2={pt.x} y2={pt.y}
              stroke={typeColor(p.type)} strokeWidth={isActive ? 1 : 0.3}
              opacity={isActive ? 0.8 : hovered ? 0.05 : 0.15}
              style={{ transition: "all 0.15s" }}
            />
          );
        })}

        {/* Partner dots */}
        {dots.map((p, i) => {
          const pt = projectWorld(p.lat, p.lng);
          const isActive = hovered?.id === p.id;
          // Slight offset for partners in same city
          const offset = (i % 3) * 3;
          return (
            <g key={p.id}>
              {isActive && (
                <circle cx={pt.x + offset} cy={pt.y} r="8" fill={typeColor(p.type)} opacity="0.15" />
              )}
              <circle
                cx={pt.x + offset} cy={pt.y} r={isActive ? 4 : 2.5}
                fill={typeColor(p.type)}
                opacity={isActive ? 1 : hovered ? 0.2 : 0.7}
                style={{ cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered && (() => {
          const pt = projectWorld(hovered.lat, hovered.lng);
          const tx = pt.x > 650 ? pt.x - 160 : pt.x + 10;
          const ty = pt.y < 40 ? pt.y + 10 : pt.y - 35;
          return (
            <g transform={`translate(${tx}, ${ty})`}>
              <rect x="0" y="0" width="155" height="32" fill="rgba(10,18,16,0.95)" />
              <text x="5" y="11" fontSize="6.5" fontWeight="700" fill="#fff" fontFamily="var(--font-body, sans-serif)">
                {hovered.flag} {hovered.name}
              </text>
              <text x="5" y="22" fontSize="5" fill="var(--teal, #2BBAA0)" fontFamily="var(--font-mono, monospace)" fontWeight="600">
                {locale === "th" ? hovered.focusTh : hovered.focusEn}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Type legend */}
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
