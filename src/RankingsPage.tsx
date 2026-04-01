import { useState, useMemo } from "react";
import { certifiedCities, promotionZoneCities, allCities } from "./cityData";
import type { Locale, ScoringPillar, CityTier, SmartCity } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, TIER_LABELS, DIMENSION_LABELS } from "./types";

const PILLAR_ORDER: ScoringPillar[] = ["livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital"];

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
  const sorted = [...cities].sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  return (
    <div className={`tier-section tier-section-${tier}`}>
      <div className="tier-section-header">
        <span className="tier-section-symbol">{symbol}</span>
        <h3>{TIER_LABELS[locale][tier]}</h3>
        <span className="tier-section-count">
          {sorted.length} {locale === "th" ? "เมือง" : "cities"}
        </span>
      </div>
      <div className="city-grid">
        {sorted.map(city => (
          <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function CityCard({ city, locale, onNavigate }: { city: SmartCity; locale: Locale; onNavigate: (path: string) => void }) {
  return (
    <div className="city-card" onClick={() => onNavigate(`/city/${city.id}`)}>
      <div className="city-card-top">
        <div className="city-card-name">{locale === "th" ? city.nameTh : city.nameEn}</div>
        <div className="city-card-province">{locale === "th" ? city.provinceTh : city.province}</div>
      </div>

      <div className="city-card-score-row">
        <span className="city-card-composite">{city.compositeScore.toFixed(1)}</span>
        <span className={`city-card-status status-${city.reality}`}>
          {city.reality === "operational"
            ? (locale === "th" ? "ใช้งานจริง" : "Operational")
            : city.reality === "partial"
              ? (locale === "th" ? "บางส่วน" : "Partial")
              : (locale === "th" ? "แผนเท่านั้น" : "Plan only")}
        </span>
      </div>

      <div className="city-card-pillars">
        {PILLAR_ORDER.map(p => (
          <div key={p} className="mini-pillar">
            <div className="mini-pillar-track">
              <div
                className="mini-pillar-fill"
                style={{ height: `${city.scores[p]}%`, background: PILLAR_COLORS[p] }}
              />
            </div>
            <span className="mini-pillar-label">{PILLAR_LABELS[locale][p].slice(0, 3)}</span>
          </div>
        ))}
      </div>

      <div className="city-card-dims">
        {city.smartDimensions.map(d => (
          <span key={d} className="dim-chip">
            {DIMENSION_LABELS[locale][d].replace("Smart ", "").replace("อัจฉริยะ", "").trim()}
          </span>
        ))}
      </div>

      <p className="city-card-tagline">
        {locale === "th" ? city.taglineTh : city.tagline}
      </p>
    </div>
  );
}

export default function RankingsPage({ locale, onNavigate }: Props) {
  const [tab, setTab] = useState<"all" | "certified" | "promotion">("all");
  const [sortPillar, setSortPillar] = useState<ScoringPillar | "composite">("composite");

  const cities = useMemo(() => {
    let list = tab === "certified" ? certifiedCities : tab === "promotion" ? promotionZoneCities : allCities;
    if (sortPillar === "composite") {
      list = [...list].sort((a, b) => b.compositeScore - a.compositeScore);
    } else {
      list = [...list].sort((a, b) => b.scores[sortPillar] - a.scores[sortPillar]);
    }
    return list;
  }, [tab, sortPillar]);

  const alphas = cities.filter(c => c.tier === "alpha");
  const betas = cities.filter(c => c.tier === "beta");
  const gammas = cities.filter(c => c.tier === "gamma");

  return (
    <>
      <section className="section rankings-hero">
        <p className="eyebrow">
          {locale === "th" ? "การจัดอันดับเต็มรูปแบบ" : "Full rankings"}
        </p>
        <h1>
          {locale === "th"
            ? "เมืองอัจฉริยะไทย: ใครจริง ใครแค่พูด"
            : "Thai Smart Cities: Who delivers, who just talks"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "จัดกลุ่ม Alpha · Beta · Gamma ตามผลลัพธ์จริง ไม่ใช่ตัวเลขอันดับ เมืองในกลุ่มเดียวกันเรียงตามตัวอักษร คลิกเมืองเพื่อดูรายละเอียด"
            : "Grouped into Alpha · Beta · Gamma by real outcomes, not rank numbers. Cities within the same tier are alphabetical. Click any city for details."}
        </p>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="section">
        <div className="filter-row">
          <div className="filter-group">
            <button className={`filter-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
              {locale === "th" ? "ทั้งหมด" : "All"} ({allCities.length})
            </button>
            <button className={`filter-btn ${tab === "certified" ? "active" : ""}`} onClick={() => setTab("certified")}>
              {locale === "th" ? "รับรองแล้ว" : "Certified"} ({certifiedCities.length})
            </button>
            <button className={`filter-btn ${tab === "promotion" ? "active" : ""}`} onClick={() => setTab("promotion")}>
              {locale === "th" ? "เขตส่งเสริม" : "Promotion"} ({promotionZoneCities.length})
            </button>
          </div>
          <div className="filter-group">
            <label className="sort-label">{locale === "th" ? "เรียงตาม" : "Sort by"}</label>
            <select
              className="sort-select"
              value={sortPillar}
              onChange={e => setSortPillar(e.target.value as ScoringPillar | "composite")}
            >
              <option value="composite">{locale === "th" ? "คะแนนรวม" : "Composite"}</option>
              {PILLAR_ORDER.map(p => (
                <option key={p} value={p}>{PILLAR_LABELS[locale][p]}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ─── TIER SECTIONS ─── */}
      <section className="section">
        {alphas.length > 0 && (
          <TierSection tier="alpha" cities={alphas} locale={locale} onNavigate={onNavigate} />
        )}
        {betas.length > 0 && (
          <TierSection tier="beta" cities={betas} locale={locale} onNavigate={onNavigate} />
        )}
        {gammas.length > 0 && (
          <TierSection tier="gamma" cities={gammas} locale={locale} onNavigate={onNavigate} />
        )}
      </section>
    </>
  );
}
