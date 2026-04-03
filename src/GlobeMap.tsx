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

// Simplified but recognizable continent outlines from Natural Earth data
// Each continent as a single closed SVG path — traced from actual coastlines
const LAND = [
  // North America (with Central America)
  "M58,58L78,52 98,48 118,46 136,48 155,54 168,52 178,56 190,62 195,58 205,55 210,60 215,68 210,78 202,85 195,90 188,98 180,108 172,115 166,120 158,128 152,135 148,140 144,148 138,155 130,162 122,164 115,168 108,172 100,176 92,178 85,180 78,176 72,168 65,160 58,148 52,138 48,128 45,118 42,108 40,98 38,88 42,78 48,68Z",
  // South America
  "M155,185L162,180 170,182 178,188 185,198 190,210 192,225 190,242 186,258 180,272 172,285 164,295 155,302 146,305 140,298 136,288 132,275 128,260 126,245 125,232 126,218 128,205 132,195 138,188Z",
  // Europe (with Scandinavia)
  "M410,38L420,35 432,36 442,40 452,38 458,32 465,28 472,32 478,38 484,44 490,50 492,58 490,65 486,72 480,78 472,82 464,80 458,75 450,72 442,68 436,72 428,76 420,74 414,68 408,62 405,55 408,48Z",
  // Africa
  "M420,98L432,95 445,98 455,105 462,115 468,128 472,142 474,158 472,175 468,192 462,208 455,222 446,234 436,242 425,248 416,248 408,242 402,232 396,218 392,202 390,185 390,168 392,150 395,135 400,120 406,108Z",
  // Asia (mainland, large mass)
  "M462,32L480,28 500,30 522,28 545,32 568,38 590,42 612,48 632,55 650,62 668,68 682,75 694,84 702,95 706,108 702,118 694,125 684,128 672,122 660,118 648,125 636,132 622,138 608,142 594,138 580,130 566,122 552,112 538,102 524,92 510,84 498,78 486,70 476,62 468,52 464,42Z",
  // Southeast Asia (peninsulas + islands)
  "M648,132L658,128 670,132 680,140 688,150 692,162 686,170 676,175 664,172 654,164 648,152Z M698,148L710,142 722,148 728,160 724,172 712,176 702,168 698,158Z M732,158L748,152 762,158 768,170 764,182 750,186 738,178 732,168Z",
  // Australia
  "M728,218L750,212 775,210 798,214 818,222 832,235 838,252 832,268 820,280 802,288 782,290 762,286 745,276 735,262 730,248 728,232Z",
  // Japan/Korea
  "M708,62L714,56 720,58 722,66 718,74 712,72 708,66Z M726,52L732,48 738,52 738,60 734,66 728,62 726,56Z",
  // UK/Ireland
  "M392,42L398,38 404,40 406,48 402,54 396,52 392,46Z M384,44L388,40 392,42 390,48 386,48Z",
  // New Zealand
  "M858,278L864,272 870,276 868,286 862,290 856,284Z M852,292L858,288 862,292 860,300 854,302 850,296Z",
  // Indonesia (simplified)
  "M658,178L672,175 688,178 702,182 715,188 728,192 718,198 705,196 690,194 676,190 664,185Z",
];

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
      <svg viewBox="0 0 960 480" className="globe-svg" preserveAspectRatio="xMidYMid meet">
        {/* Dark ocean with subtle blue tint */}
        <rect width="960" height="480" fill="#0A0E12" />

        {/* Lat/lng graticule — subtle */}
        {[...Array(11)].map((_, i) => {
          const y = (i + 1) * 40;
          return <line key={`lat${i}`} x1="0" y1={y} x2="960" y2={y} stroke="rgba(26,154,130,.04)" strokeWidth="0.5" />;
        })}
        {[...Array(11)].map((_, i) => {
          const x = (i + 1) * 80;
          return <line key={`lng${i}`} x1={x} y1="0" x2={x} y2="480" stroke="rgba(26,154,130,.04)" strokeWidth="0.5" />;
        })}
        {/* Equator */}
        <line x1="0" y1={proj(0, 0).y} x2="960" y2={proj(0, 0).y} stroke="rgba(26,154,130,.06)" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Land masses */}
        {LAND.map((d, i) => (
          <path key={i} d={d} fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="0.6" strokeLinejoin="round" />
        ))}

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
            <g key={p.id}>
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
