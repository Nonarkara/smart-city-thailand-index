import { useMemo, useState } from "react";
import ComparisonGrid from "./ComparisonGrid";
import ThailandMiniMap from "./ThailandMiniMap";
import { useCitySummaries } from "./cityApi";
import { groupCitiesByTier, sortCities } from "./cityCollections";
import {
  getCityName,
  getCityRealityLabel,
  getCityStatusLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { SCORING_PILLARS } from "./scoring";
import type { CityTier, Locale, ScoringPillar, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_SHORT_LABELS, TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function toAppPath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  return path === "/" ? `${prefix}/` || "/" : `${prefix}${path}`;
}

function RankingLedgerRow({
  city,
  locale,
  onNavigate,
  onHover,
}: {
  city: SmartCity;
  locale: Locale;
  onNavigate: (path: string) => void;
  onHover?: (city: SmartCity | null) => void;
}) {
  const cityPath = `/city/${city.id}`;

  return (
    <a
      href={toAppPath(cityPath)}
      className="dashboard-ranking-row tier-ranking-row"
      onClick={event => {
        event.preventDefault();
        onNavigate(cityPath);
      }}
      onMouseEnter={() => onHover?.(city)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(city)}
      onBlur={() => onHover?.(null)}
    >
      <div className="dashboard-ranking-summary">
        <span className="dashboard-ranking-name">{getCityName(city, locale)}</span>
        <span className="dashboard-ranking-caption">
          {getProvinceName(city, locale)} · {getCityStatusLabel(city.status, locale)} ·{" "}
          {getCityRealityLabel(city.reality, locale)}
        </span>
      </div>

      <div className="ranking-pillar-grid" aria-hidden="true">
        {SCORING_PILLARS.map(pillar => (
          <span key={pillar} className="ranking-pillar-cell">
            <span className="ranking-pillar-code">{PILLAR_SHORT_LABELS[locale][pillar]}</span>
            <span className="ranking-pillar-track">
              <span
                className="ranking-pillar-fill"
                style={{
                  width: `${city.scores[pillar]}%`,
                  backgroundColor: PILLAR_COLORS[pillar],
                }}
              />
            </span>
          </span>
        ))}
      </div>

      <div className="dashboard-ranking-score">
        <span className="data-label">
          {translate(locale, { en: "Composite", th: "รวม", zh: "综合" })}
        </span>
        <strong>{city.compositeScore.toFixed(1)}</strong>
      </div>
    </a>
  );
}

function TierSection({
  tier,
  cities,
  locale,
  onNavigate,
  onHover,
}: {
  tier: CityTier;
  cities: SmartCity[];
  locale: Locale;
  onNavigate: (path: string) => void;
  onHover?: (city: SmartCity | null) => void;
}) {
  return (
    <section className="tier-section">
      <div className="tier-section-header">
        <div>
          <p className="eyebrow">
            {translate(locale, { en: "Tier", th: "ระดับ", zh: "层级" })}
          </p>
          <h2>{TIER_LABELS[locale][tier]}</h2>
        </div>
        <span className="tier-section-count">{cities.length}</span>
      </div>

      <div className="dashboard-ranking-list">
        {cities.map(city => (
          <RankingLedgerRow
            key={city.id}
            city={city}
            locale={locale}
            onNavigate={onNavigate}
            onHover={onHover}
          />
        ))}
      </div>
    </section>
  );
}

export default function RankingsPage({ locale, onNavigate }: Props) {
  const [viewMode, setViewMode] = useState<"leaderboard" | "compare">("leaderboard");
  const [tab, setTab] = useState<"all" | "certified" | "promotion">("all");
  const [sortPillar, setSortPillar] = useState<ScoringPillar | "composite">("composite");
  const [selectedCity, setSelectedCity] = useState<SmartCity | null>(null);
  const { data: cities } = useCitySummaries();

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  const filteredCities = useMemo(
    () => (tab === "all" ? cities : cities.filter(city => city.status === tab)),
    [cities, tab],
  );

  const groupedCities = useMemo(() => {
    const grouped = groupCitiesByTier(filteredCities);
    return {
      alpha: sortCities(grouped.alpha, sortPillar),
      beta: sortCities(grouped.beta, sortPillar),
      gamma: sortCities(grouped.gamma, sortPillar),
    };
  }, [filteredCities, sortPillar]);

  return (
    <div className="rankings-page">
      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Comparison surface",
            th: "พื้นผิวการเปรียบเทียบ",
            zh: "比较界面",
          })}
        </p>
        <h1 className="hero-title">
          {t({
            en: "National leaderboard and comparison matrix",
            th: "กระดานอันดับและเมทริกซ์เปรียบเทียบระดับประเทศ",
            zh: "全国排行榜与对比矩阵",
          })}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "Tier sections keep the hierarchy readable. Sorting changes the order inside each tier without touching the data model.",
            th: "การแบ่งตามระดับช่วยให้ลำดับชั้นอ่านง่าย การเรียงใหม่จะเปลี่ยนลำดับภายในแต่ละระดับโดยไม่แตะโมเดลข้อมูล",
            zh: "分层区块让层级更易扫描。排序只改变层级内顺序，不改动数据模型。",
          })}
        </p>
      </section>

      <section className="section reveal visible">
        <div className="rankings-toolbar">
          <div className="filter-group">
            <button
              type="button"
              className={`btn-tab ${tab === "all" ? "active" : ""}`}
              onClick={() => setTab("all")}
            >
              {t({ en: "All", th: "ทั้งหมด", zh: "全部" })}
            </button>
            <button
              type="button"
              className={`btn-tab ${tab === "certified" ? "active" : ""}`}
              onClick={() => setTab("certified")}
            >
              {t({ en: "Certified", th: "รับรอง", zh: "认证" })}
            </button>
            <button
              type="button"
              className={`btn-tab ${tab === "promotion" ? "active" : ""}`}
              onClick={() => setTab("promotion")}
            >
              {t({ en: "Promotion", th: "ส่งเสริม", zh: "推广" })}
            </button>
          </div>

          <label className="select-field">
            <span className="data-label">
              {t({ en: "Sort by", th: "เรียงตาม", zh: "排序依据" })}
            </span>
            <select
              value={sortPillar}
              onChange={event => setSortPillar(event.target.value as ScoringPillar | "composite")}
              aria-label={t({ en: "Sort by pillar", th: "เรียงตามเสาหลัก", zh: "按支柱排序" })}
            >
              <option value="composite">
                {t({ en: "Composite", th: "คะแนนรวม", zh: "综合分" })}
              </option>
              {SCORING_PILLARS.map(pillar => (
                <option key={pillar} value={pillar}>
                  {pillar}
                </option>
              ))}
            </select>
          </label>

          <div className="view-toggle" role="tablist" aria-label="View mode">
            <button
              id="leaderboard-tab"
              type="button"
              role="tab"
              className={`btn-tab ${viewMode === "leaderboard" ? "active" : ""}`}
              aria-selected={viewMode === "leaderboard"}
              aria-controls="leaderboard-panel"
              onClick={() => setViewMode("leaderboard")}
            >
              {t({ en: "Leaderboard", th: "อันดับ", zh: "排行榜" })}
            </button>
            <button
              id="compare-tab"
              type="button"
              role="tab"
              className={`btn-tab ${viewMode === "compare" ? "active" : ""}`}
              aria-selected={viewMode === "compare"}
              aria-controls="compare-panel"
              onClick={() => setViewMode("compare")}
            >
              {t({ en: "Side-by-side", th: "เทียบกันตรงๆ", zh: "并排对比" })}
            </button>
          </div>
        </div>

        {viewMode === "leaderboard" ? (
          <div
            id="leaderboard-panel"
            role="tabpanel"
            aria-labelledby="leaderboard-tab"
            className="matrix-layout"
          >
            <div className="matrix-content">
              {groupedCities.alpha.length > 0 && (
                <TierSection
                  tier="alpha"
                  cities={groupedCities.alpha}
                  locale={locale}
                  onNavigate={onNavigate}
                  onHover={setSelectedCity}
                />
              )}
              {groupedCities.beta.length > 0 && (
                <TierSection
                  tier="beta"
                  cities={groupedCities.beta}
                  locale={locale}
                  onNavigate={onNavigate}
                  onHover={setSelectedCity}
                />
              )}
              {groupedCities.gamma.length > 0 && (
                <TierSection
                  tier="gamma"
                  cities={groupedCities.gamma}
                  locale={locale}
                  onNavigate={onNavigate}
                  onHover={setSelectedCity}
                />
              )}
            </div>

            <aside className="matrix-rail">
              <ThailandMiniMap
                cities={filteredCities}
                selectedCity={selectedCity}
                locale={locale}
                onSelect={setSelectedCity}
                onNavigate={onNavigate}
              />
            </aside>
          </div>
        ) : (
          <div id="compare-panel" role="tabpanel" aria-labelledby="compare-tab">
            <ComparisonGrid locale={locale} onNavigate={onNavigate} />
          </div>
        )}
      </section>
    </div>
  );
}
