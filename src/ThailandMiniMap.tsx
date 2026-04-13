import { useMemo } from "react";
import { MAP_BOUNDS, CITY_COORDS, NEIGHBOR_LABELS, projectTo, esriTileUrl, tierColor } from "./mapUtils";
import { getCityName, getProvinceName } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

interface Props {
  cities: SmartCity[];
  selectedCity: SmartCity | null;
  locale: Locale;
  onSelect: (city: SmartCity) => void;
  onNavigate: (path: string) => void;
}

const W = 320;
const H = 420;

export default function ThailandMiniMap({ cities, selectedCity, locale, onSelect, onNavigate }: Props) {
  const tileUrl = useMemo(() => esriTileUrl(MAP_BOUNDS, W * 2, H * 2, "light"), []);

  const proj = (lat: number, lng: number) => projectTo(lat, lng, MAP_BOUNDS, W, H, 12);

  const selectedCoord = selectedCity && CITY_COORDS[selectedCity.id];
  const selectedPos = selectedCoord ? proj(selectedCoord[0], selectedCoord[1]) : null;

  return (
    <div className="mini-map-container">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mini-map-svg"
        aria-label="Thailand smart city locations"
      >
        {/* Background tile */}
        <image href={tileUrl} x={0} y={0} width={W} height={H} />

        {/* Neighbor labels */}
        {NEIGHBOR_LABELS.map(n => {
          const p = proj(n.lat, n.lng);
          return (
            <text
              key={n.name}
              x={p.x}
              y={p.y}
              className="mini-map-neighbor-label"
              textAnchor="middle"
            >
              {n.name}
            </text>
          );
        })}

        {/* All city dots */}
        {cities.map(city => {
          const coord = CITY_COORDS[city.id];
          if (!coord) return null;
          const p = proj(coord[0], coord[1]);
          const isSelected = selectedCity?.id === city.id;
          return (
            <circle
              key={city.id}
              cx={p.x}
              cy={p.y}
              r={isSelected ? 6 : 3}
              fill={tierColor(city.tier)}
              opacity={selectedCity && !isSelected ? 0.3 : 0.9}
              stroke={isSelected ? "#fff" : "none"}
              strokeWidth={isSelected ? 2 : 0}
              className={isSelected ? "mini-map-dot-selected" : "mini-map-dot"}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(city)}
              onDoubleClick={() => onNavigate(`/city/${city.id}`)}
            >
              <title>{getCityName(city, locale)}</title>
            </circle>
          );
        })}

        {/* Selected city label */}
        {selectedCity && selectedPos && (
          <g>
            {/* Pulse ring */}
            <circle
              cx={selectedPos.x}
              cy={selectedPos.y}
              r={12}
              fill="none"
              stroke={tierColor(selectedCity.tier)}
              strokeWidth={1.5}
              opacity={0.5}
              className="mini-map-pulse"
            />
            {/* Label background */}
            <rect
              x={selectedPos.x + 10}
              y={selectedPos.y - 20}
              width={Math.max(getCityName(selectedCity, locale).length * 6.5, 80)}
              height={32}
              rx={4}
              fill="rgba(255,255,255,0.92)"
              stroke="var(--border, #d0d0d0)"
              strokeWidth={0.5}
            />
            {/* City name */}
            <text
              x={selectedPos.x + 14}
              y={selectedPos.y - 6}
              className="mini-map-label-name"
            >
              {getCityName(selectedCity, locale)}
            </text>
            {/* Province */}
            <text
              x={selectedPos.x + 14}
              y={selectedPos.y + 6}
              className="mini-map-label-province"
            >
              {getProvinceName(selectedCity, locale)} · {selectedCity.compositeScore.toFixed(1)}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mini-map-legend">
        <span className="mini-map-legend-item"><span className="mini-map-legend-dot" style={{ background: "var(--alpha, #1A8A72)" }} /> Alpha</span>
        <span className="mini-map-legend-item"><span className="mini-map-legend-dot" style={{ background: "var(--beta, #9A7A1A)" }} /> Beta</span>
        <span className="mini-map-legend-item"><span className="mini-map-legend-dot" style={{ background: "var(--gamma, #B03030)" }} /> Gamma</span>
      </div>
    </div>
  );
}
