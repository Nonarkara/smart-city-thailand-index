import { useState } from "react";
import { allCities } from "./cityData";
import type { Locale, SmartCity } from "./types";
import { TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

// Approximate lat/lng for each city, projected to SVG coordinates
// Thailand bounding box: lat 5.6-20.5, lng 97.3-105.6
// SVG: 0-400 width, 0-600 height
function project(lat: number, lng: number): { x: number; y: number } {
  const minLat = 5.6, maxLat = 20.5, minLng = 97.3, maxLng = 105.6;
  const x = ((lng - minLng) / (maxLng - minLng)) * 340 + 30;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 540 + 30;
  return { x, y };
}

const cityCoords: Record<string, { lat: number; lng: number }> = {
  "chiang-mai-old-town": { lat: 18.79, lng: 98.98 },
  "cmu-smart-city": { lat: 18.80, lng: 98.95 },
  "mae-moh": { lat: 18.31, lng: 99.72 },
  "nakhonsawan": { lat: 15.70, lng: 100.12 },
  "khon-kaen": { lat: 16.43, lng: 102.83 },
  "samyan": { lat: 13.73, lng: 100.53 },
  "phra-ram-4": { lat: 13.72, lng: 100.54 },
  "klong-phadung": { lat: 13.75, lng: 100.50 },
  "makkasan": { lat: 13.75, lng: 100.56 },
  "chachoengsao": { lat: 13.69, lng: 101.07 },
  "saensuk": { lat: 13.28, lng: 100.92 },
  "wangchan-valley": { lat: 12.88, lng: 101.20 },
  "phuket": { lat: 7.88, lng: 98.39 },
  "sritrang": { lat: 7.56, lng: 99.61 },
  "yala": { lat: 6.54, lng: 101.28 },
  "rayong": { lat: 12.68, lng: 101.27 },
  "khao-khun-song": { lat: 12.75, lng: 101.30 },
  "phitsanulok-muni": { lat: 16.82, lng: 100.26 },
  "phitsanulok-nu": { lat: 16.74, lng: 100.20 },
  "chiang-rai": { lat: 19.91, lng: 99.83 },
  "nan": { lat: 18.78, lng: 100.77 },
  "korat": { lat: 14.97, lng: 102.10 },
  "ubon": { lat: 15.25, lng: 104.85 },
  "krabi": { lat: 8.09, lng: 98.91 },
  "phangnga": { lat: 8.45, lng: 98.52 },
  "satun": { lat: 6.62, lng: 100.07 },
  "samui": { lat: 9.51, lng: 100.06 },
  "hat-yai": { lat: 7.00, lng: 100.47 },
  "pattani": { lat: 6.87, lng: 101.25 },
  "narathiwat": { lat: 6.43, lng: 101.82 },
  "lampang": { lat: 18.29, lng: 99.49 },
  "samut-prakan": { lat: 13.60, lng: 100.60 },
  "thep-paraj": { lat: 13.65, lng: 101.10 },
  "nikhom-phatthana": { lat: 12.75, lng: 101.15 },
  "nakhon-si-thammarat": { lat: 8.43, lng: 99.96 },
  "tai-yong": { lat: 8.40, lng: 99.90 },
  "phuket-tinicon": { lat: 7.85, lng: 98.35 },
  // Promotion zones
  "songkhla-city": { lat: 7.19, lng: 100.59 },
  "rattanakosin": { lat: 13.76, lng: 100.49 },
  "nonthaburi": { lat: 13.86, lng: 100.51 },
  "chanthaburi": { lat: 12.61, lng: 102.10 },
  "tak": { lat: 16.88, lng: 99.13 },
  "phichit": { lat: 16.44, lng: 100.35 },
  "umong": { lat: 18.57, lng: 98.98 },
  "maesai": { lat: 20.43, lng: 99.88 },
  "bang-saray": { lat: 12.78, lng: 100.92 },
  "phitsanulok-ppao": { lat: 16.80, lng: 100.28 },
  "ubon-muni": { lat: 15.23, lng: 104.87 },
  "phlapphla": { lat: 12.58, lng: 102.12 },
};

// Simplified Thailand outline path (key coastal/border points)
const THAILAND_OUTLINE = "M 198,30 L 210,45 225,55 235,52 245,60 250,75 260,85 270,80 285,90 290,105 280,120 275,135 280,150 290,160 300,175 310,180 320,195 310,210 305,225 295,240 300,260 295,275 288,290 280,300 285,315 278,330 270,340 260,350 252,365 245,380 238,395 230,410 222,420 215,435 220,445 225,460 218,470 210,475 205,485 195,490 188,500 182,510 178,520 185,530 192,540 198,548 205,555 210,560 202,565 190,558 180,555 170,548 158,540 148,530 140,520 135,510 128,502 120,510 115,520 108,530 102,535 95,530 88,520 82,510 78,500 82,490 88,480 95,470 102,460 110,445 115,430 112,415 108,400 105,385 100,375 95,360 90,345 88,330 92,315 95,300 100,290 105,275 108,260 115,245 120,232 125,220 128,205 132,190 138,178 145,165 150,150 158,138 165,125 170,110 175,95 180,80 185,65 190,50 195,38 Z";

function tierColor(tier: string): string {
  if (tier === "alpha") return "#1A7D72";
  if (tier === "beta") return "#D4832F";
  return "#C94444";
}

export default function ThailandMap({ locale, onNavigate }: Props) {
  const [hovered, setHovered] = useState<SmartCity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  return (
    <section className="section map-section">
      <p className="eyebrow">
        {locale === "th" ? "แผนที่" : locale === "zh" ? "地图" : "Geography"}
      </p>
      <h2>
        {locale === "th" ? "49 เมืองที่เราติดตามในเวอร์ชันนี้" : locale === "zh" ? "本版本追踪的 49 座城市" : "49 cities profiled in this release"}
      </h2>

      <div className="map-layout">
        <div className="map-panel">
          <svg viewBox="0 0 400 600" className="map-svg">
            {/* Thailand outline */}
            <path d={THAILAND_OUTLINE} fill="rgba(26, 22, 18, 0.03)" stroke="var(--border-hard)" strokeWidth="1" />

            {/* City dots */}
            {allCities.map(city => {
              const coords = cityCoords[city.id];
              if (!coords) return null;
              const { x, y } = project(coords.lat, coords.lng);
              const r = city.status === "certified" ? 5 : 3.5;
              return (
                <g key={city.id}>
                  <circle
                    className="map-marker"
                    cx={x} cy={y} r={r}
                    fill={tierColor(city.tier)}
                    opacity={hovered && hovered.id !== city.id ? 0.25 : 0.85}
                    stroke={city.status === "certified" ? tierColor(city.tier) : "none"}
                    strokeWidth={city.status === "certified" ? 1.5 : 0}
                    tabIndex={0}
                    role="button"
                    aria-label={`${locale === "th" ? city.nameTh : city.nameEn}, ${city.compositeScore.toFixed(1)}`}
                    style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                    onClick={() => onNavigate(`/city/${city.id}`)}
                    onKeyDown={event => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onNavigate(`/city/${city.id}`);
                      }
                    }}
                    onMouseEnter={() => {
                      setHovered(city);
                      setTooltipPos({ x: x, y: y });
                    }}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}

            {/* Tooltip */}
            {hovered && (
              <g transform={`translate(${tooltipPos.x + 10}, ${tooltipPos.y - 8})`}>
                <rect x="0" y="-12" width="120" height="30" fill="var(--ink)" rx="0" opacity="0.92" />
                <text x="6" y="1" fontSize="7" fontWeight="700" fill="white" fontFamily="var(--font-body)">
                  {locale === "th" ? hovered.nameTh : hovered.nameEn}
                </text>
                <text x="6" y="12" fontSize="6" fill="rgba(255,255,255,0.6)" fontFamily="var(--font-mono)" fontWeight="600">
                  {hovered.compositeScore.toFixed(1)} · {TIER_LABELS[locale][hovered.tier]}
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="map-legend">
          <div className="map-legend-title">
            {locale === "th" ? "สัญลักษณ์" : locale === "zh" ? "图例" : "Legend"}
          </div>
          <div className="map-legend-item">
            <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#1A7D72" /></svg>
            <span>Alpha — {locale === "th" ? "อัจฉริยะจริง" : locale === "zh" ? "真正智慧" : "genuinely smart"}</span>
          </div>
          <div className="map-legend-item">
            <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#D4832F" /></svg>
            <span>Beta — {locale === "th" ? "กำลังดำเนินการ" : locale === "zh" ? "进行中" : "work in progress"}</span>
          </div>
          <div className="map-legend-item">
            <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#C94444" /></svg>
            <span>Gamma — {locale === "th" ? "เริ่มต้น/แผนเท่านั้น" : locale === "zh" ? "早期/仅计划" : "early / plan only"}</span>
          </div>
          <div className="map-legend-item">
            <svg width="14" height="12"><circle cx="7" cy="6" r="5" fill="none" stroke="#999" strokeWidth="1.5" /></svg>
            <span>{locale === "th" ? "วงใหญ่ = รับรองแล้ว" : locale === "zh" ? "大圆 = 已认证" : "larger = certified"}</span>
          </div>
          <div className="map-legend-item">
            <svg width="14" height="12"><circle cx="7" cy="6" r="3" fill="#999" /></svg>
            <span>{locale === "th" ? "วงเล็ก = เขตส่งเสริมที่คัดมานำเสนอ" : locale === "zh" ? "小圆 = 本版收录的推广区" : "smaller = profiled promotion zone"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
