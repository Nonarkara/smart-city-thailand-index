import { useMemo, useState } from "react";
import ComparisonGrid from "./ComparisonGrid";
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
import type { CityTier, Locale, ScoringPillar, SmartCity } from "./types";
import { PILLAR_COLORS, TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type SortKey =
  | "composite"
  | "gpp"
  | "pm25"
  | "readiness"
  | "edges"
  | "livability"
  | "safety"
  | "environment"
  | "wellbeing"
  | "digital";

type RegionFilter = SmartCity["region"] | "all";
type TierFilter = CityTier | "all";
type StatusFilter = SmartCity["status"] | "all";

const SCALE_PILLARS: ScoringPillar[] = [
  "livability",
  "safety",
  "environment",
  "wellbeing",
  "digital",
];

const REGION_LABELS: Record<Locale, Record<SmartCity["region"] | "all", string>> = {
  en: {
    all: "All",
    bangkok: "Bangkok",
    central: "Central",
    north: "North",
    northeast: "Northeast",
    east: "East",
    south: "South",
  },
  th: {
    all: "ทั้งหมด",
    bangkok: "กรุงเทพ",
    central: "กลาง",
    north: "เหนือ",
    northeast: "อีสาน",
    east: "ตะวันออก",
    south: "ใต้",
  },
  zh: {
    all: "全部",
    bangkok: "曼谷",
    central: "中部",
    north: "北部",
    northeast: "东北",
    east: "东部",
    south: "南部",
  },
};

function toAppPath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  return path === "/" ? `${prefix}/` || "/" : `${prefix}${path}`;
}

function formatCompactBaht(value?: number): string {
  if (!value) return "—";
  if (value >= 1_000_000) return `฿${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `฿${(value / 1_000).toFixed(0)}K`;
  return `฿${value}`;
}

function ScaleBar({ value, color }: { value: number; color: string }) {
  return (
    <span className="scale-bar" aria-hidden="true">
      <span className="scale-bar-tick" />
      <span
        className="scale-bar-fill"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </span>
  );
}

function percentile(value: number, all: number[]): number {
  if (all.length <= 1) return 100;
  const below = all.filter(v => v < value).length;
  return Math.round((below / (all.length - 1)) * 100);
}

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
            className="pick-card"
            onClick={event => {
              event.preventDefault();
              onNavigate(cityPath);
            }}
          >
            <p className="pick-kicker">{translate(locale, pick.kicker)}</p>
            <h3 className="pick-name">
              {getCityName(city, locale)}{" "}
              <span className="pick-tier" aria-hidden="true">
                ·{" "}
                {city.tier === "alpha"
                  ? "α"
                  : city.tier === "beta"
                  ? "β"
                  : "γ"}
              </span>
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
  const [viewMode, setViewMode] = useState<"directory" | "compare">("directory");
  const [sortKey, setSortKey] = useState<SortKey>("composite");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [query, setQuery] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  // Pre-compute per-city enrichment once
  const enriched = useMemo(
    () =>
      cities.map(city => {
        const profile = getMoneyballProfile(city);
        const readiness = computeDevelopability(city).total;
        const edgeCount = profile.edges.filter(e => e.advantage).length;
        return { city, readiness, edgeCount };
      }),
    [cities],
  );

  const compositeValues = useMemo(
    () => enriched.map(e => e.city.compositeScore),
    [enriched],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(({ city }) => {
      if (tierFilter !== "all" && city.tier !== tierFilter) return false;
      if (statusFilter !== "all" && city.status !== statusFilter) return false;
      if (regionFilter !== "all" && city.region !== regionFilter) return false;
      if (q.length > 0) {
        const hay = [
          city.nameEn,
          city.nameTh,
          city.province,
          city.provinceTh,
          city.id,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, tierFilter, statusFilter, regionFilter, query]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    rows.sort((a, b) => {
      switch (sortKey) {
        case "composite":
          return b.city.compositeScore - a.city.compositeScore;
        case "gpp":
          return (b.city.metrics.gppPerCapita ?? 0) - (a.city.metrics.gppPerCapita ?? 0);
        case "pm25":
          return (a.city.metrics.pm25Annual ?? 999) - (b.city.metrics.pm25Annual ?? 999);
        case "readiness":
          return b.readiness - a.readiness;
        case "edges":
          return b.edgeCount - a.edgeCount;
        default:
          return b.city.scores[sortKey] - a.city.scores[sortKey];
      }
    });
    return rows;
  }, [filtered, sortKey]);

  const toggleSelect = (id: string) => {
    setSelectedIds(current => {
      if (current.includes(id)) return current.filter(x => x !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const handleLaunchCompare = () => {
    setViewMode("compare");
  };

  return (
    <div className="rankings-page">
      <section className="section reveal visible">
        <p className="eyebrow">
          {t({ en: "Directory", th: "สารบบ", zh: "名录" })}
        </p>
        <h1 className="hero-title">
          {t({
            en: "The Moneyball of Thai city investment",
            th: "มันนี่บอลของการลงทุนในเมืองไทย",
            zh: "泰国城市投资的点球成金",
          })}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "You already know Bangkok, Chiang Mai, and Phuket. This is the directory that helps you find the next three — the cities that outperform on specific axes the market hasn't priced in yet.",
            th: "คุณรู้จักกรุงเทพ เชียงใหม่ และภูเก็ตอยู่แล้ว นี่คือสารบบที่จะพาคุณเจออีกสามเมือง — เมืองที่ทำได้ดีในแกนเฉพาะซึ่งตลาดยังไม่ได้ตีราคา",
            zh: "你已熟悉曼谷、清迈、普吉。这份名录带你发现下一组三城——在市场尚未定价的特定维度上表现卓越的城市。",
          })}
        </p>
      </section>

      <section className="section reveal visible">
        <div className="picks-section-header">
          <p className="eyebrow">
            {t({
              en: "Editor's picks",
              th: "คัดสรรโดยบรรณาธิการ",
              zh: "编辑精选",
            })}
          </p>
          <h2 className="picks-section-title">
            {t({
              en: "Seven cities worth a second look",
              th: "เจ็ดเมืองที่ควรมองครั้งที่สอง",
              zh: "七座值得重新审视的城市",
            })}
          </h2>
        </div>
        <MoneyballPicksStrip locale={locale} onNavigate={onNavigate} cities={cities} />
      </section>

      <section className="section reveal visible">
        <div className="directory-toolbar">
          <input
            type="search"
            className="directory-search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={t({
              en: "Search city or province",
              th: "ค้นหาเมืองหรือจังหวัด",
              zh: "搜索城市或府",
            })}
            aria-label={t({ en: "Search", th: "ค้นหา", zh: "搜索" })}
          />

          <label className="select-field">
            <span className="data-label">
              {t({ en: "Sort by", th: "เรียงตาม", zh: "排序" })}
            </span>
            <select
              value={sortKey}
              onChange={event => setSortKey(event.target.value as SortKey)}
            >
              <option value="composite">{t({ en: "Composite", th: "คะแนนรวม", zh: "综合" })}</option>
              <option value="edges">{t({ en: "Moneyball edges", th: "ข้อได้เปรียบ", zh: "优势数" })}</option>
              <option value="readiness">{t({ en: "Finance readiness", th: "ความพร้อมการเงิน", zh: "融资准备度" })}</option>
              <option value="gpp">{t({ en: "GPP per capita", th: "GPP ต่อหัว", zh: "人均 GPP" })}</option>
              <option value="pm25">{t({ en: "PM₂.₅ (lower is better)", th: "PM₂.₅ (น้อย = ดี)", zh: "PM₂.₅（越低越好）" })}</option>
              <option value="livability">{t({ en: "Livability", th: "น่าอยู่", zh: "宜居" })}</option>
              <option value="safety">{t({ en: "Safety", th: "ปลอดภัย", zh: "安全" })}</option>
              <option value="environment">{t({ en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" })}</option>
              <option value="wellbeing">{t({ en: "Wellbeing", th: "คุณภาพชีวิต", zh: "福祉" })}</option>
              <option value="digital">{t({ en: "Digital", th: "ดิจิทัล", zh: "数字" })}</option>
            </select>
          </label>

          <div className="filter-chip-row" role="group" aria-label={t({ en: "Tier filter", th: "ตัวกรองระดับ", zh: "层级筛选" })}>
            {(["all", "alpha", "beta", "gamma"] as const).map(key => (
              <button
                key={key}
                type="button"
                className={`filter-chip ${tierFilter === key ? "active" : ""}`}
                onClick={() => setTierFilter(key)}
              >
                {key === "all"
                  ? t({ en: "All", th: "ทั้งหมด", zh: "全部" })
                  : TIER_LABELS[locale][key]}
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
                {key === "all"
                  ? t({ en: "Any status", th: "ทุกสถานะ", zh: "任意状态" })
                  : getCityStatusLabel(key, locale)}
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
          <div className="directory-table-wrap">
            <table className="directory-table">
              <thead>
                <tr>
                  <th scope="col" className="col-city">
                    {t({ en: "City", th: "เมือง", zh: "城市" })}
                  </th>
                  <th scope="col" className="col-num">COMP</th>
                  <th scope="col" className="col-num">GPP/CAP</th>
                  <th scope="col" className="col-num">PM₂.₅</th>
                  <th scope="col" className="col-bar">LIV</th>
                  <th scope="col" className="col-bar">SAF</th>
                  <th scope="col" className="col-bar">ENV</th>
                  <th scope="col" className="col-bar">WLB</th>
                  <th scope="col" className="col-bar">DIG</th>
                  <th scope="col" className="col-num">READY</th>
                  <th scope="col" className="col-num">EDGE</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(({ city, readiness, edgeCount }) => {
                  const pct = percentile(city.compositeScore, compositeValues);
                  const isSelected = selectedIds.includes(city.id);
                  const cityPath = `/city/${city.id}`;
                  const handleClick = (event: React.MouseEvent) => {
                    if (compareMode) {
                      event.preventDefault();
                      toggleSelect(city.id);
                    } else {
                      event.preventDefault();
                      onNavigate(cityPath);
                    }
                  };
                  return (
                    <tr
                      key={city.id}
                      className={`directory-row ${isSelected ? "is-selected" : ""}`}
                    >
                      <td className="col-city">
                        <a
                          href={toAppPath(cityPath)}
                          className="directory-city-link"
                          onClick={handleClick}
                        >
                          <span className="directory-city-name">
                            {getCityName(city, locale)}
                          </span>
                          <span className="directory-city-caption">
                            {getProvinceName(city, locale)} ·{" "}
                            {getCityStatusLabel(city.status, locale)} ·{" "}
                            {getCityRealityLabel(city.reality, locale)}
                          </span>
                          <span className="directory-city-tagline">
                            {locale === "th" ? city.taglineTh : city.tagline}
                          </span>
                        </a>
                      </td>
                      <td className="col-num">
                        <span className="num-primary">{city.compositeScore.toFixed(1)}</span>
                        <span className="num-chip">p{pct}</span>
                      </td>
                      <td className="col-num">
                        <span className="num-primary">
                          {formatCompactBaht(city.metrics.gppPerCapita)}
                        </span>
                        {city.metrics.gppGrowthRate != null && (
                          <span
                            className={`num-chip ${
                              city.metrics.gppGrowthRate >= 2.5 ? "is-pos" : "is-neutral"
                            }`}
                          >
                            {city.metrics.gppGrowthRate >= 0 ? "+" : ""}
                            {city.metrics.gppGrowthRate.toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td className="col-num">
                        <span className="num-primary">
                          {city.metrics.pm25Annual != null
                            ? city.metrics.pm25Annual.toFixed(1)
                            : "—"}
                        </span>
                        {city.metrics.pm25Annual != null && (
                          <span
                            className={`num-chip ${
                              city.metrics.pm25Annual < 25
                                ? "is-pos"
                                : city.metrics.pm25Annual > 35
                                ? "is-neg"
                                : "is-neutral"
                            }`}
                          >
                            {city.metrics.pm25Annual < 25
                              ? t({ en: "clean", th: "สะอาด", zh: "洁净" })
                              : city.metrics.pm25Annual > 35
                              ? t({ en: "high", th: "สูง", zh: "偏高" })
                              : t({ en: "avg", th: "ค่ากลาง", zh: "一般" })}
                          </span>
                        )}
                      </td>
                      {SCALE_PILLARS.map(pillar => (
                        <td key={pillar} className="col-bar">
                          <ScaleBar
                            value={city.scores[pillar]}
                            color={PILLAR_COLORS[pillar]}
                          />
                          <span className="bar-value">{city.scores[pillar]}</span>
                        </td>
                      ))}
                      <td className="col-num">
                        <span className="num-primary">{readiness}</span>
                      </td>
                      <td className="col-num">
                        <span
                          className={`num-primary ${edgeCount >= 3 ? "is-strong" : ""}`}
                        >
                          {edgeCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={11} className="directory-empty">
                      {t({
                        en: "No cities match these filters.",
                        th: "ไม่มีเมืองตรงกับตัวกรอง",
                        zh: "无城市符合当前筛选。",
                      })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {compareMode && selectedIds.length >= 2 && (
              <div className="compare-launch-bar">
                <span className="compare-launch-count">
                  {t({
                    en: `${selectedIds.length} selected`,
                    th: `เลือกแล้ว ${selectedIds.length}`,
                    zh: `已选 ${selectedIds.length}`,
                  })}
                </span>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleLaunchCompare}
                >
                  {t({ en: "Compare →", th: "เปรียบเทียบ →", zh: "对比 →" })}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="compare-view-wrap">
            <button
              type="button"
              className="btn-tab"
              onClick={() => setViewMode("directory")}
            >
              {t({ en: "← Back to directory", th: "← กลับสู่สารบบ", zh: "← 返回名录" })}
            </button>
            <ComparisonGrid
              locale={locale}
              onNavigate={onNavigate}
              preselectedIds={selectedIds}
            />
          </div>
        )}
      </section>
    </div>
  );
}
