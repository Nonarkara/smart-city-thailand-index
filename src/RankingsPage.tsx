import { useMemo, useState } from "react";
import ComparisonGrid from "./ComparisonGrid";
import RankingsMapView from "./RankingsMapView";
import { useCitySummaries } from "./cityApi";
import { computeDevelopability, getMoneyballProfile } from "./cityAnalytics";
import {
  getCityName,
  getCityRealityLabel,
  getCityStatusLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { MONEYBALL_PICKS } from "./moneyballPicks";
import {
  PRESET_LENSES,
  computePresetScore,
  getPresetById,
  type PresetLens,
} from "./presetLenses";
import type { CityTier, Locale, ScoringPillar, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_WEIGHTS, TIER_LABELS, LEAGUE_LABELS } from "./types";
import { REGION_LABELS } from "./regions";
import { toAppPath } from "./routing";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type RegionFilter = SmartCity["region"] | "all";
type TierFilter = CityTier | "all";
type StatusFilter = SmartCity["status"] | "all";

const PILLAR_ORDER: ScoringPillar[] = [
  "livability",
  "economy",
  "safety",
  "wellbeing",
  "environment",
  "hospitality",
  "digital",
];

// REGION_LABELS lives in regions.ts so HomePage + RankingsPage + future
// surfaces share one trilingual source.

function percentile(value: number, all: number[]): number {
  if (all.length <= 1) return 100;
  const below = all.filter(v => v < value).length;
  return Math.round((below / (all.length - 1)) * 100);
}

function tierSymbol(tier: CityTier): string {
  return tier === "alpha" ? "α" : tier === "beta" ? "β" : "γ";
}

// ---------------------------------------------------------------------------
// IndividualPillarBars — 7 segments, each a separate bar for easy comparison
// ---------------------------------------------------------------------------
function IndividualPillarBars({
  city,
  locale,
}: {
  city: SmartCity;
  locale: Locale;
}) {
  const getShort = (pillar: ScoringPillar): string => {
    // We use standard 3-letter codes for the mono-interface look
    const map: Record<ScoringPillar, string> = {
      livability: "LIV",
      economy: "ECO",
      safety: "SAF",
      wellbeing: "WEL",
      environment: "ENV",
      hospitality: "HOS",
      digital: "DIG",
    };
    return map[pillar];
  };

  return (
    <div className="ranking-pillar-grid" aria-hidden="true">
      {PILLAR_ORDER.map(pillar => {
        const value = city.scores[pillar];
        return (
          <div key={pillar} className="ranking-pillar-row">
            <span className="ranking-pillar-label">{getShort(pillar)}</span>
            <div className="ranking-pillar-track">
              <div
                className="ranking-pillar-fill"
                style={{ width: `${value}%`, background: PILLAR_COLORS[pillar] }}
              />
            </div>
            <span className="ranking-pillar-value">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LensRadar — 140×140 heptagon spider visualising lens weights
// ---------------------------------------------------------------------------
function LensRadar({ lens, locale }: { lens: PresetLens; locale: Locale }) {
  const SIZE = 140;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 52;
  const MAX_WEIGHT = 40; // scale: max plausible lens weight
  const n = PILLAR_ORDER.length;

  const points = PILLAR_ORDER.map((pillar, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const v = Math.min(1, lens.weights[pillar] / MAX_WEIGHT);
    return {
      pillar,
      x: CX + Math.cos(angle) * R * v,
      y: CY + Math.sin(angle) * R * v,
      lx: CX + Math.cos(angle) * (R + 10),
      ly: CY + Math.sin(angle) * (R + 10),
    };
  });
  const outer = PILLAR_ORDER.map((_, i) => {
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
      aria-label={translate(locale, lens.label)}
    >
      <polygon className="lens-radar-grid" points={outer} />
      <polygon className="lens-radar-grid-inner" points={outer} style={{ transform: `scale(0.5) translate(${CX}px, ${CY}px)`, transformOrigin: `${CX}px ${CY}px` }} />
      <polygon className="lens-radar-shape" points={poly} />
      {points.map(p => (
        <circle key={p.pillar} cx={p.x} cy={p.y} r={2} fill={PILLAR_COLORS[p.pillar]} />
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
          {PILLAR_LABELS[locale][p.pillar].slice(0, 3).toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MoneyballPicksStrip — preserved from Phase 10
// ---------------------------------------------------------------------------
function MoneyballPicksStrip({
  locale,
  onNavigate,
  cities,
}: {
  locale: Locale;
  onNavigate: (path: string) => void;
  cities: SmartCity[];
}) {
  const cityById = useMemo(() => new Map(cities.map(c => [c.id, c])), [cities]);
  const visible = MONEYBALL_PICKS.filter(pick => cityById.has(pick.cityId));

  return (
    <div className="picks-strip">
      {visible.map(pick => {
        const city = cityById.get(pick.cityId)!;
        const cityPath = `/city/${city.id}`;
        return (
          <a
            key={pick.cityId}
            href={toAppPath(cityPath)}
            className="pick-card glass-card"
            onClick={event => {
              event.preventDefault();
              onNavigate(cityPath);
            }}
          >
            <p className="pick-kicker">{translate(locale, pick.kicker)}</p>
            <h3 className="pick-name">
              {getCityName(city, locale)}{" "}
              <span className="pick-tier" aria-hidden="true">· {tierSymbol(city.tier)}</span>
            </h3>
            <p className="pick-why">{translate(locale, pick.why)}</p>
            <div className="pick-chips">
              {pick.chips.map((chip, idx) => (
                <div key={idx} className="pick-chip">
                  <span className="pick-chip-label">{translate(locale, chip.label)}</span>
                  <span className="pick-chip-value">{chip.value}</span>
                  <span className="pick-chip-anchor">{translate(locale, chip.anchor)}</span>
                </div>
              ))}
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default function RankingsPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const [viewMode, setViewMode] = useState<"directory" | "compare" | "map">("directory");
  const [lensId, setLensId] = useState<string>("balanced");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [query, setQuery] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  const lens = getPresetById(lensId);
  const isBalanced = lens.id === "balanced";
  const activeWeights = isBalanced ? PILLAR_WEIGHTS : lens.weights;

  const enriched = useMemo(
    () =>
      cities.map(city => {
        const profile = getMoneyballProfile(city);
        const readiness = computeDevelopability(city).total;
        const edgeCount = profile.edges.filter(e => e.advantage).length;
        const lensScore = isBalanced
          ? city.compositeScore
          : computePresetScore(city, lens);
        return { city, readiness, edgeCount, lensScore };
      }),
    [cities, lens, isBalanced],
  );

  const lensScoreValues = useMemo(() => enriched.map(e => e.lensScore), [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(({ city }) => {
      if (tierFilter !== "all" && city.tier !== tierFilter) return false;
      if (statusFilter !== "all" && city.status !== statusFilter) return false;
      if (regionFilter !== "all" && city.region !== regionFilter) return false;
      if (q.length > 0) {
        const hay = [city.nameEn, city.nameTh, city.province, city.provinceTh, city.id]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, tierFilter, statusFilter, regionFilter, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.lensScore - a.lensScore);
  }, [filtered]);

  // Top-1 per tier under the active lens (full unfiltered set, so the panel
  // is stable regardless of filters)
  const topByTier = useMemo(() => {
    const byTier: Record<CityTier, { city: SmartCity; lensScore: number } | undefined> = {
      alpha: undefined,
      beta: undefined,
      gamma: undefined,
    };
    for (const entry of enriched) {
      const t = entry.city.tier;
      if (!byTier[t] || entry.lensScore > byTier[t]!.lensScore) {
        byTier[t] = { city: entry.city, lensScore: entry.lensScore };
      }
    }
    return byTier;
  }, [enriched]);

  const toggleSelect = (id: string) => {
    setSelectedIds(current => {
      if (current.includes(id)) return current.filter(x => x !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  return (
    <div className="rankings-page">
      <div className="rankings-column">
        <section className="section reveal visible">
          <p className="eyebrow">{t({ en: "Directory", th: "สารบบ", zh: "名录" })}</p>
          <h1 className="hero-title">
            {t({
              en: "The Moneyball of Thai city investment",
              th: "มันนี่บอลของการลงทุนในเมืองไทย",
              zh: "泰国城市投资的点球成金",
            })}
          </h1>
          <p className="hero-strapline">
            {t({
              en: "You already know Bangkok, Chiang Mai, and Phuket. Pick a lens and the directory re-ranks under that worldview — growth at all costs, retirement paradise, climate refuge. The spider shows the shape of each lens.",
              th: "คุณรู้จักกรุงเทพ เชียงใหม่ และภูเก็ตอยู่แล้ว เลือกเลนส์ แล้วสารบบจะจัดอันดับใหม่ตามมุมมองนั้น — เติบโตล้วนๆ สวรรค์วัยเกษียณ ที่พักพิงภูมิอากาศ ใยแมงมุมแสดงรูปร่างของแต่ละเลนส์",
              zh: "你已熟悉曼谷、清迈、普吉。选一副镜头，名录便按那套世界观重排——只看增长、退休天堂、气候避风港。蛛网呈现每副镜头的形状。",
            })}
          </p>
        </section>

        <section className="section reveal visible">
          <div className="picks-section-header">
            <p className="eyebrow">{t({ en: "Editor's picks", th: "คัดสรรโดยบรรณาธิการ", zh: "编辑精选" })}</p>
            <h2 className="picks-section-title">
              {t({ en: "Seven cities worth a second look", th: "เจ็ดเมืองที่ควรมองครั้งที่สอง", zh: "七座值得重新审视的城市" })}
            </h2>
          </div>
          <MoneyballPicksStrip locale={locale} onNavigate={onNavigate} cities={cities} />
        </section>

        <section className="section reveal visible">
          <p className="eyebrow">{t({ en: "Lenses", th: "เลนส์", zh: "镜头" })}</p>
          <div className="lens-chip-row" role="tablist" aria-label={t({ en: "Preset lenses", th: "เลนส์สำเร็จรูป", zh: "预设镜头" })}>
            {PRESET_LENSES.map(preset => (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={lensId === preset.id}
                className={`lens-chip ${lensId === preset.id ? "active" : ""}`}
                onClick={() => setLensId(preset.id)}
              >
                {translate(locale, preset.label)}
              </button>
            ))}
          </div>

          <div className="lens-panel glass-card">
            <div className="lens-panel-copy">
              <p className="lens-panel-label">{translate(locale, lens.label)}</p>
              <p className="lens-panel-tagline">{translate(locale, lens.tagline)}</p>
              <p className="lens-panel-flavour">{translate(locale, lens.flavour)}</p>
            </div>
            <div className="lens-panel-radar">
              <LensRadar lens={lens} locale={locale} />
            </div>
            <div className="lens-panel-top">
              <p className="lens-panel-top-label">
                {t({ en: "Top under this lens", th: "อันดับหนึ่งของเลนส์นี้", zh: "此镜头下的第一" })}
              </p>
              {(["alpha", "beta", "gamma"] as CityTier[]).map(tier => {
                const entry = topByTier[tier];
                if (!entry) return null;
                const cityPath = `/city/${entry.city.id}`;
                return (
                  <a
                    key={tier}
                    href={toAppPath(cityPath)}
                    className="lens-panel-top-row"
                    onClick={event => {
                      event.preventDefault();
                      onNavigate(cityPath);
                    }}
                  >
                    <span className="lens-panel-top-tier">{tierSymbol(tier)} {TIER_LABELS[locale][tier]}</span>
                    <span className="lens-panel-top-name">{getCityName(entry.city, locale)}</span>
                    <span className="lens-panel-top-score">{entry.lensScore.toFixed(1)}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section reveal visible">
          {/* View-mode tabs — Phase 19 added the "map" view backed by GISTDA layers */}
          <div className="ranking-view-tabs" role="tablist" aria-label={t({ en: "View mode", th: "โหมดการดู", zh: "视图模式" })}>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "directory"}
              className={`ranking-view-tab ${viewMode === "directory" ? "active" : ""}`}
              onClick={() => setViewMode("directory")}
            >
              <span className="ranking-view-tab-icon" aria-hidden="true">▌▍▎</span>
              {t({ en: "Capacities", th: "ขีดความสามารถ", zh: "能力" })}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "map"}
              className={`ranking-view-tab ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
            >
              <span className="ranking-view-tab-icon" aria-hidden="true">⌖</span>
              {t({ en: "Map", th: "แผนที่", zh: "地图" })}
            </button>
          </div>

          {viewMode === "map" ? (
            <RankingsMapView locale={locale} cities={cities} onNavigate={onNavigate} />
          ) : (<>
          <div className="directory-toolbar">
            <input
              type="search"
              className="directory-search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={t({ en: "Search city or province", th: "ค้นหาเมืองหรือจังหวัด", zh: "搜索城市或府" })}
              aria-label={t({ en: "Search", th: "ค้นหา", zh: "搜索" })}
            />

            <div className="filter-chip-row" role="group" aria-label={t({ en: "Tier filter", th: "ตัวกรองระดับ", zh: "层级筛选" })}>
              {(["all", "alpha", "beta", "gamma"] as const).map(key => (
                <button
                  key={key}
                  type="button"
                  className={`filter-chip ${tierFilter === key ? "active" : ""}`}
                  onClick={() => setTierFilter(key)}
                >
                  {key === "all" ? t({ en: "All", th: "ทั้งหมด", zh: "全部" }) : TIER_LABELS[locale][key]}
                </button>
              ))}
            </div>

            <div className="filter-chip-row" role="group" aria-label={t({ en: "Status filter", th: "ตัวกรองสถานะ", zh: "状态筛选" })}>
              {(["all", "certified", "promotion"] as const).map(key => (
                <button
                  key={key}
                  type="button"
                  className={`filter-chip ${statusFilter === key ? "active" : ""}`}
                  onClick={() => setStatusFilter(key)}
                >
                  {key === "all" ? t({ en: "Any status", th: "ทุกสถานะ", zh: "任意状态" }) : getCityStatusLabel(key, locale)}
                </button>
              ))}
            </div>

            <div className="filter-chip-row" role="group" aria-label={t({ en: "Region filter", th: "ตัวกรองภาค", zh: "区域筛选" })}>
              {(["all", "bangkok", "north", "northeast", "central", "east", "south"] as const).map(key => (
                <button
                  key={key}
                  type="button"
                  className={`filter-chip ${regionFilter === key ? "active" : ""}`}
                  onClick={() => setRegionFilter(key)}
                >
                  {REGION_LABELS[locale][key]}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`btn-tab ${compareMode ? "active" : ""}`}
              onClick={() => {
                setCompareMode(current => !current);
                if (compareMode) setSelectedIds([]);
              }}
              aria-pressed={compareMode}
            >
              {compareMode
                ? t({ en: "Exit compare", th: "ออกจากโหมดเทียบ", zh: "退出对比" })
                : t({ en: "Compare mode", th: "โหมดเปรียบเทียบ", zh: "对比模式" })}
            </button>
          </div>

          {viewMode === "directory" ? (
            <div className="rank-list-wrap">
              <ol className="rank-list">
                {sorted.map(({ city, edgeCount, lensScore }, idx) => {
                  const pct = percentile(lensScore, lensScoreValues);
                  const isSelected = selectedIds.includes(city.id);
                  const cityPath = `/city/${city.id}`;
                  const handleClick = (event: React.MouseEvent) => {
                    event.preventDefault();
                    if (compareMode) toggleSelect(city.id);
                    else onNavigate(cityPath);
                  };
                  return (
                    <li
                      key={city.id}
                      className={`rank-row ${isSelected ? "is-selected" : ""}`}
                    >
                      <a
                        href={toAppPath(cityPath)}
                        className="rank-row-link"
                        onClick={handleClick}
                      >
                        <span className="rank-row-num">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="rank-row-body">
                          <span className="rank-row-head">
                            <span className="rank-row-name">
                              {getCityName(city, locale)}
                              <span className="rank-row-tier" aria-hidden="true">
                                {" "}· {tierSymbol(city.tier)}
                              </span>
                            </span>
                          </span>
                          <span className="rank-row-caption">
                            {getProvinceName(city, locale)} · {getCityStatusLabel(city.status, locale)} · {getCityRealityLabel(city.reality, locale)}
                            {city.league ? (
                              <>
                                {" "}· <span className="league-badge">{LEAGUE_LABELS[locale][city.league]}</span>
                              </>
                            ) : null}
                          </span>
                          <IndividualPillarBars city={city} locale={locale} />
                        </span>
                        <span className="rank-row-meta">
                          <span className="rank-row-score">{lensScore.toFixed(1)}</span>
                          <span className="rank-row-pct">p{pct}</span>
                          <span className={`rank-row-edges ${edgeCount >= 3 ? "is-strong" : ""}`}>
                            {edgeCount} {t({ en: "edges", th: "จุดเด่น", zh: "优势" })}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
                {sorted.length === 0 && (
                  <li className="rank-row-empty">
                    {t({ en: "No cities match these filters.", th: "ไม่มีเมืองตรงกับตัวกรอง", zh: "无城市符合当前筛选。" })}
                  </li>
                )}
              </ol>

              {compareMode && selectedIds.length >= 2 && (
                <div className="compare-launch-bar">
                  <span className="compare-launch-count">
                    {t({
                      en: `${selectedIds.length} selected`,
                      th: `เลือกแล้ว ${selectedIds.length}`,
                      zh: `已选 ${selectedIds.length}`,
                    })}
                  </span>
                  <button type="button" className="btn-primary" onClick={() => setViewMode("compare")}>
                    {t({ en: "Compare →", th: "เปรียบเทียบ →", zh: "对比 →" })}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="compare-view-wrap">
              <button type="button" className="btn-tab" onClick={() => setViewMode("directory")}>
                {t({ en: "← Back to directory", th: "← กลับสู่สารบบ", zh: "← 返回名录" })}
              </button>
              <ComparisonGrid locale={locale} onNavigate={onNavigate} preselectedIds={selectedIds} />
            </div>
          )}
          </>)}
        </section>
      </div>
    </div>
  );
}
