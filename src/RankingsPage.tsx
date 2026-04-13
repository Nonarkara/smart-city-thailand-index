import { useMemo, useState } from "react";
import { useCitySummaries } from "./cityApi";
import { groupCitiesByTier, sortCities } from "./cityCollections";
import ComparisonGrid from "./ComparisonGrid";
import ThailandMiniMap from "./ThailandMiniMap";
import { getLocalizedList, getLocalizedText, resolveCityResearch } from "./cityResearch";
import {
  getCityName,
  getCityRealityLabel,
  getCityTagline,
  getDimensionChipLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { SCORING_PILLARS } from "./scoring";
import type { CityTier, Locale, ScoringPillar, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_SHORT_LABELS, TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
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
  const symbol = tier === "alpha" ? "α" : tier === "beta" ? "β" : "γ";

  return (
    <div className={`tier-section tier-section-${tier} reveal visible`}>
      <div className="tier-section-header">
        <span className="tier-section-symbol">{symbol}</span>
        <h2>{TIER_LABELS[locale][tier]}</h2>
        <span className="tier-section-count">
          {cities.length} {translate(locale, { en: "cities", th: "เมือง", zh: "城" })}
        </span>
      </div>
      <div className="city-grid">
        {cities.map(city => (
          <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} onHover={onHover} />
        ))}
      </div>
    </div>
  );
}

function CityCard({
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
  const path = `/city/${city.id}`;
  const cityName = getCityName(city, locale);

  return (
    <button
      type="button"
      className={`city-card city-card-${city.tier}`}
      role="link"
      onClick={() => onNavigate(path)}
      onMouseEnter={() => onHover?.(city)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(city)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(path); } }}
    >
      <div className="city-card-top">
        <div className="city-card-name">{cityName}</div>
        <div className="city-card-province">{getProvinceName(city, locale)}</div>
      </div>

      <div className="city-card-score-row">
        <span className="city-card-composite">{city.compositeScore.toFixed(1)}</span>
        <span className={`city-card-status status-${city.reality}`}>
          {getCityRealityLabel(city.reality, locale)}
        </span>
      </div>

      <div className="city-card-bars">
        {SCORING_PILLARS.map(pillar => {
          const score = city.scores[pillar];
          return (
            <div key={pillar} className="hbar-row">
              <span className="hbar-label">{PILLAR_SHORT_LABELS[locale][pillar]}</span>
              <div className="hbar-track">
                <div
                  className="hbar-fill"
                  style={{ width: `${score}%`, background: PILLAR_COLORS[pillar] }}
                />
              </div>
              <span className="hbar-value">{score}</span>
            </div>
          );
        })}
      </div>

      <div className="city-card-dims">
        {city.smartDimensions.map(dimension => (
          <span key={dimension} className="dim-chip">
            {getDimensionChipLabel(dimension, locale)}
          </span>
        ))}
      </div>

      <p className="city-card-tagline">{getCityTagline(city, locale)}</p>
    </button>
  );
}

function EditorialStoryCard({
  city,
  locale,
  onNavigate,
  rank,
}: {
  city: SmartCity;
  locale: Locale;
  onNavigate: (path: string) => void;
  rank: number;
}) {
  const research = resolveCityResearch(city);

  return (
    <button
      type="button"
      className="editorial-story-card"
      role="link"
      onClick={() => onNavigate(`/city/${city.id}`)}
    >
      <div className="editorial-story-head">
        <span className="editorial-story-rank">#{rank}</span>
        <span className={`editorial-story-tier editorial-story-tier-${city.tier}`}>{TIER_LABELS[locale][city.tier]}</span>
      </div>
      <div className="editorial-story-title-row">
        <div>
          <h3>{getCityName(city, locale)}</h3>
          <p>{getProvinceName(city, locale)}</p>
        </div>
        <strong>{city.compositeScore.toFixed(1)}</strong>
      </div>
      <div className="editorial-chip-row">
        {getLocalizedList(locale, research.industries).slice(0, 4).map(industry => (
          <span key={`${city.id}-${industry}`} className="editorial-chip">{industry}</span>
        ))}
      </div>
      <p className="editorial-story-copy">{getLocalizedText(locale, research.compareNote)}</p>
      <div className="editorial-story-meta">
        <span>{translate(locale, { en: "Live", th: "ชีวิต", zh: "生活" })}</span>
        <p>{getLocalizedText(locale, research.dailyLife)}</p>
      </div>
      <div className="editorial-story-meta">
        <span>{translate(locale, { en: "Fun fact", th: "เกร็ดสนุก", zh: "趣闻" })}</span>
        <p>{getLocalizedText(locale, research.funFact)}</p>
      </div>
    </button>
  );
}

export default function RankingsPage({ locale, onNavigate }: Props) {
  const [viewMode, setViewMode] = useState<"leaderboard" | "compare">("leaderboard");
  const [tab, setTab] = useState<"all" | "certified" | "promotion">("all");
  const [sortPillar, setSortPillar] = useState<ScoringPillar | "composite">("composite");
  const [selectedCity, setSelectedCity] = useState<SmartCity | null>(null);
  const sortSelectId = "rankings-sort";
  const { data: cities } = useCitySummaries();
  const certifiedCities = useMemo(() => cities.filter(city => city.status === "certified"), [cities]);
  const promotionZoneCities = useMemo(() => cities.filter(city => city.status === "promotion"), [cities]);
  const featuredCities = useMemo(() => sortCities(cities, "composite").slice(0, 5), [cities]);

  const groupedCities = useMemo(() => {
    const sourceCities =
      tab === "certified" ? certifiedCities : tab === "promotion" ? promotionZoneCities : cities;
    const grouped = groupCitiesByTier(sourceCities);

    return {
      alpha: sortCities(grouped.alpha, sortPillar),
      beta: sortCities(grouped.beta, sortPillar),
      gamma: sortCities(grouped.gamma, sortPillar),
    };
  }, [certifiedCities, cities, promotionZoneCities, sortPillar, tab]);

  return (
    <>
      <section className="section rankings-hero">
        <p className="eyebrow">
          {translate(locale, { en: "Full rankings", th: "การจัดอันดับเต็มรูปแบบ", zh: "完整排名" })}
        </p>
        <h1>
          {translate(locale, {
            en: "Thai Smart Cities: Who delivers, who just talks",
            th: "เมืองอัจฉริยะไทย: ใครจริง ใครแค่พูด",
            zh: "泰国智慧城市：谁真做，谁只会说",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Cities stay inside Alpha, Beta, or Gamma based on outcomes. The sort only reorders cities within each tier, because fake precision is still fake even when it looks scientific.",
            th: "เมืองจะอยู่ใน Alpha, Beta หรือ Gamma ตามผลลัพธ์จริง การเรียงลำดับจะเกิดขึ้นแค่ภายในแต่ละกลุ่ม เพราะความแม่นยำปลอมก็ยังเป็นของปลอม ถึงหน้าตาจะดูวิทยาศาสตร์ก็ตาม",
            zh: "城市先按结果归入 Alpha、Beta 或 Gamma。排序只会在各自层级内部重排，因为假精确就算披上科学外衣，也还是假精确。",
          })}
        </p>
      </section>

      <section className="section">
        <div className="rankings-editorial-head">
          <div>
            <p className="eyebrow">{translate(locale, { en: "Beyond the score", th: "เกินกว่าคะแนน", zh: "超越分数" })}</p>
            <h2>{translate(locale, {
              en: "What these top cities actually feel like on the ground",
              th: "เมืองหัวตารางเหล่านี้มีชีวิตจริงแบบไหน",
              zh: "这些头部城市在现实里到底是什么样子",
            })}</h2>
          </div>
          <div className="rankings-view-toggle" role="tablist" aria-label={translate(locale, { en: "Ranking views", th: "มุมมองการจัดอันดับ", zh: "排名视图" })}>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "leaderboard"}
              className={`rankings-view-btn ${viewMode === "leaderboard" ? "active" : ""}`}
              onClick={() => setViewMode("leaderboard")}
            >
              {translate(locale, { en: "Leaderboard", th: "ตารางหลัก", zh: "排行榜" })}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "compare"}
              className={`rankings-view-btn ${viewMode === "compare" ? "active" : ""}`}
              onClick={() => setViewMode("compare")}
            >
              {translate(locale, { en: "Side-by-side", th: "เทียบกัน", zh: "并排对比" })}
            </button>
          </div>
        </div>
        <div className="editorial-story-grid">
          {featuredCities.map((city, index) => (
            <EditorialStoryCard
              key={city.id}
              city={city}
              locale={locale}
              onNavigate={onNavigate}
              rank={index + 1}
            />
          ))}
        </div>
      </section>

      {viewMode === "leaderboard" ? (
        <>
          <section className="section">
            <div className="filter-row">
              <div className="filter-group">
                <button className={`filter-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
                  {translate(locale, { en: "All", th: "ทั้งหมด", zh: "全部" })} ({cities.length})
                </button>
                <button className={`filter-btn ${tab === "certified" ? "active" : ""}`} onClick={() => setTab("certified")}>
                  {translate(locale, { en: "Certified", th: "รับรองแล้ว", zh: "已认证" })} ({certifiedCities.length})
                </button>
                <button className={`filter-btn ${tab === "promotion" ? "active" : ""}`} onClick={() => setTab("promotion")}>
                  {translate(locale, { en: "Promotion", th: "เขตส่งเสริม", zh: "推广区" })} ({promotionZoneCities.length})
                </button>
              </div>
              <div className="filter-group">
                <label className="sort-label" htmlFor={sortSelectId}>
                  {translate(locale, { en: "Sort by", th: "เรียงตาม", zh: "排序依据" })}
                </label>
                <select
                  id={sortSelectId}
                  className="sort-select"
                  value={sortPillar}
                  onChange={event => setSortPillar(event.target.value as ScoringPillar | "composite")}
                >
                  <option value="composite">
                    {translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合分" })}
                  </option>
                  {SCORING_PILLARS.map(pillar => (
                    <option key={pillar} value={pillar}>
                      {PILLAR_LABELS[locale][pillar]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="section rankings-main-layout">
            <div className="rankings-cards-col">
              {groupedCities.alpha.length > 0 && (
                <TierSection tier="alpha" cities={groupedCities.alpha} locale={locale} onNavigate={onNavigate} onHover={setSelectedCity} />
              )}
              {groupedCities.beta.length > 0 && (
                <TierSection tier="beta" cities={groupedCities.beta} locale={locale} onNavigate={onNavigate} onHover={setSelectedCity} />
              )}
              {groupedCities.gamma.length > 0 && (
                <TierSection tier="gamma" cities={groupedCities.gamma} locale={locale} onNavigate={onNavigate} onHover={setSelectedCity} />
              )}
            </div>
            <aside className="rankings-map-col">
              <ThailandMiniMap
                cities={cities}
                selectedCity={selectedCity}
                locale={locale}
                onSelect={setSelectedCity}
                onNavigate={onNavigate}
              />
            </aside>
          </section>
        </>
      ) : (
        <section className="section">
          <ComparisonGrid locale={locale} onNavigate={onNavigate} />
        </section>
      )}
    </>
  );
}
