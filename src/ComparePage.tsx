// ---------------------------------------------------------------------------
// ComparePage — side-by-side city basket (up to 5 cities)
// ---------------------------------------------------------------------------
// Adapted from slic-index v3 SideBySidePage, scaled from 5 pillars to SCITI's
// 7 scoring pillars. User-curated basket with search + region filter; mobile
// uses horizontal scroll-snap one-column-per-city.
// ---------------------------------------------------------------------------

import { useMemo, useState } from "react";
import { useCitySummaries } from "./cityApi";
import {
  getCityName,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { getCityPhotoAsset } from "./cityMedia";
import { ResponsiveImage } from "./mediaAssets";
import { SCORING_PILLARS } from "./scoring";
import {
  LEAGUE_LABELS,
  PILLAR_COLORS,
  PILLAR_LABELS,
  PILLAR_WEIGHTS,
  TIER_LABELS,
  type Locale,
  type ScoringPillar,
  type SmartCity,
} from "./types";
import { REGION_LABELS, REGIONS_ORDERED, type Region } from "./regions";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const MAX_BASKET = 5;

type RegionFilter = Region | "all";

// --- PillarStrip: fixed 220px, 7 colour segments weighted by contribution ---
function PillarStrip({ city }: { city: SmartCity }) {
  const TOTAL = 220;
  return (
    <span className="pillar-strip" aria-hidden="true">
      {SCORING_PILLARS.map(pillar => {
        const contribution = (city.scores[pillar] * PILLAR_WEIGHTS[pillar]) / 10000;
        const width = Math.max(0, TOTAL * contribution);
        return (
          <span
            key={pillar}
            className="pillar-strip-seg"
            style={{ width: `${width}px`, background: PILLAR_COLORS[pillar] }}
            title={`${pillar} ${city.scores[pillar]}`}
          />
        );
      })}
    </span>
  );
}

// --- CityRadar: 140x140 heptagon spider over the 7 pillars (0-100 scale) ---
function CityRadar({ city, locale }: { city: SmartCity; locale: Locale }) {
  const SIZE = 160;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 54;
  const n = SCORING_PILLARS.length;
  const label = PILLAR_LABELS[locale];

  const points = SCORING_PILLARS.map((pillar, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const v = Math.min(1, city.scores[pillar] / 100);
    return {
      pillar,
      x: CX + Math.cos(angle) * R * v,
      y: CY + Math.sin(angle) * R * v,
      lx: CX + Math.cos(angle) * (R + 14),
      ly: CY + Math.sin(angle) * (R + 14),
    };
  });
  const outer = SCORING_PILLARS.map((_, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return `${CX + Math.cos(angle) * R},${CY + Math.sin(angle) * R}`;
  }).join(" ");
  const poly = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg
      className="lens-radar"
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={getCityName(city, locale)}
    >
      <polygon className="lens-radar-grid" points={outer} />
      <polygon
        className="lens-radar-grid-inner"
        points={outer}
        style={{
          transform: `scale(0.5) translate(${CX}px, ${CY}px)`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
      />
      <polygon className="lens-radar-shape" points={poly} />
      {points.map(p => (
        <circle
          key={p.pillar}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill={PILLAR_COLORS[p.pillar as ScoringPillar]}
        />
      ))}
      {points.map(p => (
        <text
          key={p.pillar}
          x={p.lx}
          y={p.ly}
          className="lens-radar-label"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label[p.pillar as ScoringPillar]}
        </text>
      ))}
    </svg>
  );
}

export default function ComparePage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const allCities = cities as SmartCity[];

  // Seed basket with top 3 composite-score cities
  const initialIds = useMemo(
    () =>
      [...allCities]
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 3)
        .map(c => c.id),
    [allCities],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  const selectedCities = selectedIds
    .map(id => allCities.find(c => c.id === id))
    .filter((c): c is SmartCity => Boolean(c));

  const handleRemove = (id: string) => {
    setSelectedIds(prev => prev.filter(pid => pid !== id));
  };

  const handleAdd = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= MAX_BASKET) return;
    setSelectedIds(prev => [...prev, id]);
    setIsAdding(false);
    setSearch("");
  };

  const q = search.trim().toLowerCase();
  const filtered = allCities
    .filter(c => !selectedIds.includes(c.id))
    .filter(c => regionFilter === "all" || c.region === regionFilter)
    .filter(c =>
      q.length === 0
        ? true
        : c.nameEn.toLowerCase().includes(q) ||
          c.nameTh.includes(search.trim()) ||
          c.province.toLowerCase().includes(q),
    )
    .slice(0, 16);

  const heading = translate(locale, {
    en: "Compare cities side by side",
    th: "เปรียบเทียบเมืองเคียงข้างกัน",
    zh: "并排比较城市",
  });
  const subhead = translate(locale, {
    en: "Build a basket of up to five Thai cities. Hero photo, composite score, seven-pillar radar, and tier — all aligned for a fair read.",
    th: "เลือกเมืองได้สูงสุดห้าเมืองเพื่อเปรียบเทียบ ภาพหลัก คะแนนรวม เรดาร์เจ็ดเสาหลัก และระดับชั้น จัดเรียงให้อ่านเทียบได้ตรงไปตรงมา",
    zh: "最多选入五座泰国城市：主图、综合分、七维雷达图与层级一字排开，便于公平对比。",
  });

  return (
    <section className="section compare-page">
      <p className="eyebrow">
        {translate(locale, { en: "Side by side", th: "เทียบเคียง", zh: "并排对比" })}
      </p>
      <h1 className="compare-title">{heading}</h1>
      <p className="compare-subtitle">{subhead}</p>


      {/* ─── Basket chips ─── */}
      <div className="compare-basket">
        <h3 className="compare-basket-title">
          {translate(locale, {
            en: "Your compare basket",
            th: "ตะกร้าเปรียบเทียบ",
            zh: "你的对比篮",
          })}
          <span className="compare-basket-count">
            {selectedCities.length}/{MAX_BASKET}
          </span>
        </h3>
        <div className="compare-basket-chips">
          {selectedCities.map(city => (
            <div key={city.id} className={`compare-chip tier-${city.tier}`}>
              <span className="compare-chip-tier" aria-hidden="true">
                {city.tier === "alpha" ? "\u03B1" : city.tier === "beta" ? "\u03B2" : "\u03B3"}
              </span>
              <span className="compare-chip-name">{getCityName(city, locale)}</span>
              <button
                type="button"
                className="compare-chip-remove"
                onClick={() => handleRemove(city.id)}
                aria-label={translate(locale, {
                  en: `Remove ${city.nameEn}`,
                  th: `ลบ ${city.nameTh}`,
                  zh: `移除 ${city.nameEn}`,
                })}
              >
                &times;
              </button>
            </div>
          ))}
          {selectedIds.length < MAX_BASKET && !isAdding && (
            <button
              type="button"
              className="compare-chip-add"
              onClick={() => setIsAdding(true)}
            >
              + {translate(locale, { en: "Add city", th: "เพิ่มเมือง", zh: "添加城市" })}
            </button>
          )}
        </div>

        {isAdding && (
          <div className="compare-picker">
            <div className="compare-picker-controls">
              <input
                className="compare-search"
                type="text"
                placeholder={translate(locale, {
                  en: "Search city or province...",
                  th: "ค้นหาเมืองหรือจังหวัด...",
                  zh: "搜索城市或府...",
                })}
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
              <select
                className="compare-region-select"
                value={regionFilter}
                onChange={e => setRegionFilter(e.target.value as RegionFilter)}
                aria-label={translate(locale, {
                  en: "Filter by region",
                  th: "กรองตามภูมิภาค",
                  zh: "按区域筛选",
                })}
              >
                <option value="all">{REGION_LABELS[locale].all}</option>
                {REGIONS_ORDERED.map(r => (
                  <option key={r} value={r}>
                    {REGION_LABELS[locale][r]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="compare-picker-close"
                onClick={() => setIsAdding(false)}
                aria-label={translate(locale, { en: "Close", th: "ปิด", zh: "关闭" })}
              >
                &times;
              </button>
            </div>
            <div className="compare-picker-list">
              {filtered.length === 0 && (
                <p className="compare-picker-empty">
                  {translate(locale, {
                    en: "No cities match.",
                    th: "ไม่พบเมืองที่ตรงกับเงื่อนไข",
                    zh: "没有匹配的城市。",
                  })}
                </p>
              )}
              {filtered.map(c => (
                <button
                  type="button"
                  key={c.id}
                  className="compare-picker-item"
                  onClick={() => handleAdd(c.id)}
                >
                  <span className="compare-picker-name">{getCityName(c, locale)}</span>
                  <span className="compare-picker-meta">
                    {getProvinceName(c, locale)} &middot; {REGION_LABELS[locale][c.region]}
                  </span>
                  {c.league && (
                    <span className="league-badge compare-picker-league">
                      {LEAGUE_LABELS[locale][c.league]}
                    </span>
                  )}
                  <span className="compare-picker-score">{c.compositeScore.toFixed(1)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Compare grid ─── */}
      {selectedCities.length === 0 ? (
        <p className="compare-empty">
          {translate(locale, {
            en: "Add at least one city to begin comparing.",
            th: "เพิ่มเมืองอย่างน้อยหนึ่งเมืองเพื่อเริ่มเปรียบเทียบ",
            zh: "至少添加一座城市以开始对比。",
          })}
        </p>
      ) : (
        <div
          className="compare-grid"
          style={{ gridTemplateColumns: `repeat(${selectedCities.length}, minmax(240px, 1fr))` }}
        >
          {selectedCities.map(city => {
            const photo = getCityPhotoAsset(city);
            const topHighlights = city.highlights.slice(0, 3);
            return (
              <article
                key={city.id}
                className={`compare-column tier-border-${city.tier}`}
              >
                <button
                  type="button"
                  className="compare-col-hero"
                  onClick={() => onNavigate(`/city/${city.id}`)}
                  aria-label={translate(locale, {
                    en: `Open ${city.nameEn}`,
                    th: `เปิดโปรไฟล์ ${city.nameTh}`,
                    zh: `打开 ${city.nameEn}`,
                  })}
                >
                  <ResponsiveImage
                    src={photo.src}
                    alt={getCityName(city, locale)}
                    className="compare-col-hero-img"
                    style={{ objectPosition: photo.objectPosition ?? "center center" }}
                    loading="lazy"
                  />
                </button>

                <header className="compare-col-header">
                  <h3 className="compare-col-name">{getCityName(city, locale)}</h3>
                  <p className="compare-col-province">{getProvinceName(city, locale)}</p>
                  <div className="compare-col-badges">
                    <span className={`compare-tier-badge tier-${city.tier}`}>
                      {TIER_LABELS[locale][city.tier]}
                    </span>
                    <span className="league-badge">
                      {REGION_LABELS[locale][city.region]}
                    </span>
                    {city.league && (
                      <span className="league-badge">{LEAGUE_LABELS[locale][city.league]}</span>
                    )}
                  </div>
                </header>

                <div className="compare-col-score">
                  <span className="compare-col-score-num">{city.compositeScore.toFixed(1)}</span>
                  <span className="compare-col-score-label">
                    {translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合分" })}
                  </span>
                </div>

                <div className="compare-col-radar">
                  <CityRadar city={city} locale={locale} />
                </div>

                <div className="compare-col-strip">
                  <PillarStrip city={city} />
                </div>

                <ul className="compare-col-pillars">
                  {SCORING_PILLARS.map(pillar => (
                    <li key={pillar} className="compare-col-pillar-row">
                      <span
                        className="compare-col-pillar-dot"
                        style={{ background: PILLAR_COLORS[pillar] }}
                        aria-hidden="true"
                      />
                      <span className="compare-col-pillar-label">
                        {PILLAR_LABELS[locale][pillar]}
                      </span>
                      <span className="compare-col-pillar-score">
                        {city.scores[pillar].toFixed(0)}
                      </span>
                    </li>
                  ))}
                </ul>

                {topHighlights.length > 0 && (
                  <div className="compare-col-highlights">
                    <p className="compare-col-highlights-label">
                      {translate(locale, {
                        en: "Signature initiatives",
                        th: "โครงการเด่น",
                        zh: "标志性项目",
                      })}
                    </p>
                    <ul>
                      {topHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  className="compare-col-open"
                  onClick={() => onNavigate(`/city/${city.id}`)}
                >
                  {translate(locale, {
                    en: "Open profile",
                    th: "เปิดโปรไฟล์",
                    zh: "查看档案",
                  })}
                  {" \u2192"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
