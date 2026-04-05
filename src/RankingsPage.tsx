import { useMemo, useState } from "react";
import { useCitySummaries } from "./cityApi";
import { groupCitiesByTier, sortCities } from "./cityCollections";
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
}: {
  tier: CityTier;
  cities: SmartCity[];
  locale: Locale;
  onNavigate: (path: string) => void;
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
          <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function CityCard({
  city,
  locale,
  onNavigate,
}: {
  city: SmartCity;
  locale: Locale;
  onNavigate: (path: string) => void;
}) {
  const path = `/city/${city.id}`;
  const cityName = getCityName(city, locale);

  return (
    <button
      type="button"
      className="city-card"
      role="link"
      onClick={() => onNavigate(path)}
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

      <div className="city-card-pillars">
        {SCORING_PILLARS.map(pillar => (
          <div key={pillar} className="mini-pillar">
            <div className="mini-pillar-track">
              <div
                className="mini-pillar-fill"
                style={{ height: `${city.scores[pillar]}%`, background: PILLAR_COLORS[pillar] }}
              />
            </div>
            <span className="mini-pillar-label">{PILLAR_SHORT_LABELS[locale][pillar]}</span>
          </div>
        ))}
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

export default function RankingsPage({ locale, onNavigate }: Props) {
  const [tab, setTab] = useState<"all" | "certified" | "promotion">("all");
  const [sortPillar, setSortPillar] = useState<ScoringPillar | "composite">("composite");
  const sortSelectId = "rankings-sort";
  const { data: cities } = useCitySummaries();
  const certifiedCities = useMemo(() => cities.filter(city => city.status === "certified"), [cities]);
  const promotionZoneCities = useMemo(() => cities.filter(city => city.status === "promotion"), [cities]);

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

      <section className="section">
        {groupedCities.alpha.length > 0 && (
          <TierSection tier="alpha" cities={groupedCities.alpha} locale={locale} onNavigate={onNavigate} />
        )}
        {groupedCities.beta.length > 0 && (
          <TierSection tier="beta" cities={groupedCities.beta} locale={locale} onNavigate={onNavigate} />
        )}
        {groupedCities.gamma.length > 0 && (
          <TierSection tier="gamma" cities={groupedCities.gamma} locale={locale} onNavigate={onNavigate} />
        )}
      </section>
    </>
  );
}
