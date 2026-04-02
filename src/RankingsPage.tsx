import { useState, useMemo } from "react";
import { certifiedCities, promotionZoneCities, allCities } from "./cityData";
import type { Locale, ScoringPillar, CityTier, SmartCity } from "./types";
import { PILLAR_LABELS, PILLAR_SHORT_LABELS, PILLAR_COLORS, TIER_LABELS, DIMENSION_LABELS } from "./types";

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

  return (
    <div className={`tier-section tier-section-${tier}`}>
      <div className="tier-section-header">
        <span className="tier-section-symbol">{symbol}</span>
        <h3>{TIER_LABELS[locale][tier]}</h3>
        <span className="tier-section-count">
          {cities.length} {locale === "th" ? "เมือง" : locale === "zh" ? "城" : "cities"}
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

function CityCard({ city, locale, onNavigate }: { city: SmartCity; locale: Locale; onNavigate: (path: string) => void }) {
  const path = `/city/${city.id}`;
  const cityName = locale === "th" ? city.nameTh : city.nameEn;

  return (
    <button type="button" className="city-card" aria-label={cityName} onClick={() => onNavigate(path)}>
      <div className="city-card-top">
        <div className="city-card-name">{cityName}</div>
        <div className="city-card-province">{locale === "th" ? city.provinceTh : city.province}</div>
      </div>

      <div className="city-card-score-row">
        <span className="city-card-composite">{city.compositeScore.toFixed(1)}</span>
        <span className={`city-card-status status-${city.reality}`}>
          {city.reality === "operational"
            ? (locale === "th" ? "ใช้งานจริง" : locale === "zh" ? "已运行" : "Operational")
            : city.reality === "partial"
              ? (locale === "th" ? "บางส่วน" : locale === "zh" ? "部分落实" : "Partial")
              : (locale === "th" ? "แผนเท่านั้น" : locale === "zh" ? "仅有规划" : "Plan only")}
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
            <span className="mini-pillar-label">{PILLAR_SHORT_LABELS[locale][p]}</span>
          </div>
        ))}
      </div>

      <div className="city-card-dims">
        {city.smartDimensions.map(d => (
          <span key={d} className="dim-chip">
            {DIMENSION_LABELS[locale][d].replace("Smart ", "").replace("อัจฉริยะ", "").replace("智慧", "").trim()}
          </span>
        ))}
      </div>

      <p className="city-card-tagline">
        {locale === "th" ? city.taglineTh : city.tagline}
      </p>
    </button>
  );
}

export default function RankingsPage({ locale, onNavigate }: Props) {
  const [tab, setTab] = useState<"all" | "certified" | "promotion">("all");
  const [sortPillar, setSortPillar] = useState<ScoringPillar | "composite">("composite");

  const cities = useMemo(() => {
    let list = tab === "certified" ? certifiedCities : tab === "promotion" ? promotionZoneCities : allCities;
    if (sortPillar === "composite") {
      list = [...list].sort((a, b) => {
        if (b.compositeScore !== a.compositeScore) {
          return b.compositeScore - a.compositeScore;
        }
        return a.nameEn.localeCompare(b.nameEn);
      });
    } else {
      list = [...list].sort((a, b) => {
        if (b.scores[sortPillar] !== a.scores[sortPillar]) {
          return b.scores[sortPillar] - a.scores[sortPillar];
        }
        return a.nameEn.localeCompare(b.nameEn);
      });
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
          {locale === "th" ? "การจัดอันดับเต็มรูปแบบ" : locale === "zh" ? "完整排名" : "Full rankings"}
        </p>
        <h1>
          {locale === "th"
            ? "เมืองอัจฉริยะไทย: ใครจริง ใครแค่พูด"
            : locale === "zh"
              ? "泰国智慧城市：谁真做，谁只会说"
            : "Thai Smart Cities: Who delivers, who just talks"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "จัดกลุ่ม Alpha · Beta · Gamma ตามผลลัพธ์จริง ไม่ใช่ตัวเลขอันดับ และเรียงในแต่ละกลุ่มตามคะแนนที่คุณเลือก คลิกเมืองเพื่อดูรายละเอียด"
            : locale === "zh"
              ? "按真实结果分为 Alpha · Beta · Gamma，并在每个层级内按你选择的指标排序。点击城市查看详情。"
              : "Grouped into Alpha · Beta · Gamma by real outcomes, not fake precision. Cities within each tier are sorted by the metric you choose. Click any city for details."}
        </p>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="section">
        <div className="filter-row">
          <div className="filter-group">
            <button className={`filter-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
              {locale === "th" ? "ทั้งหมด" : locale === "zh" ? "全部" : "All"} ({allCities.length})
            </button>
            <button className={`filter-btn ${tab === "certified" ? "active" : ""}`} onClick={() => setTab("certified")}>
              {locale === "th" ? "รับรองแล้ว" : locale === "zh" ? "已认证" : "Certified"} ({certifiedCities.length})
            </button>
            <button className={`filter-btn ${tab === "promotion" ? "active" : ""}`} onClick={() => setTab("promotion")}>
              {locale === "th" ? "เขตส่งเสริม" : locale === "zh" ? "推广区" : "Promotion"} ({promotionZoneCities.length})
            </button>
          </div>
          <div className="filter-group">
            <label className="sort-label">{locale === "th" ? "เรียงตาม" : locale === "zh" ? "排序依据" : "Sort by"}</label>
            <select
              className="sort-select"
              value={sortPillar}
              onChange={e => setSortPillar(e.target.value as ScoringPillar | "composite")}
            >
              <option value="composite">{locale === "th" ? "คะแนนรวม" : locale === "zh" ? "综合分" : "Composite"}</option>
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
