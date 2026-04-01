import { useState, useMemo, lazy, Suspense } from "react";
import { allCities, alphaCities, betaCities, gammaCities } from "./cityData";
import type { Locale, ScoringPillar, CityTier, SmartCity } from "./types";
import { PILLAR_LABELS, PILLAR_COLORS, TIER_LABELS } from "./types";

const SpiderAllocator = lazy(() => import("./SpiderAllocator"));
const ThailandMap = lazy(() => import("./ThailandMap"));

const PILLAR_ORDER: ScoringPillar[] = ["livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital"];

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function TierBadge({ tier, locale }: { tier: CityTier; locale: Locale }) {
  return (
    <span className={`tier-badge tier-${tier}`}>
      {tier === "alpha" ? "α" : tier === "beta" ? "β" : "γ"} {TIER_LABELS[locale][tier]}
    </span>
  );
}

function PillarBar({ pillar, value }: { pillar: ScoringPillar; value: number }) {
  return (
    <div className="pillar-bar">
      <div
        className="pillar-bar-fill"
        style={{ width: `${value}%`, background: PILLAR_COLORS[pillar] }}
      />
    </div>
  );
}

function CityRow({ city, locale, onNavigate, rank }: { city: SmartCity; locale: Locale; onNavigate: (path: string) => void; rank: number }) {
  return (
    <tr className="city-row" onClick={() => onNavigate(`/city/${city.id}`)}>
      <td className="city-rank">{rank}</td>
      <td className="city-name-cell">
        <div className="city-name">{locale === "th" ? city.nameTh : city.nameEn}</div>
        <div className="city-province">{locale === "th" ? city.provinceTh : city.province}</div>
      </td>
      <td className="city-tier-cell">
        <TierBadge tier={city.tier} locale={locale} />
      </td>
      <td className="city-score">{city.compositeScore.toFixed(1)}</td>
      <td className="city-status-cell">
        <span className={`status-dot status-${city.reality}`} />
        {city.status === "certified" ? (locale === "th" ? "รับรอง" : "Certified") : (locale === "th" ? "ส่งเสริม" : "Promotion")}
      </td>
      <td className="pillar-bars-cell">
        {PILLAR_ORDER.map(p => (
          <PillarBar key={p} pillar={p} value={city.scores[p]} />
        ))}
      </td>
    </tr>
  );
}

export default function HomePage({ locale, onNavigate }: Props) {
  const [filter, setFilter] = useState<"all" | "certified" | "promotion">("all");
  const [tierFilter, setTierFilter] = useState<"all" | CityTier>("all");

  const filtered = useMemo(() => {
    let cities = allCities;
    if (filter !== "all") cities = cities.filter(c => c.status === filter);
    if (tierFilter !== "all") cities = cities.filter(c => c.tier === tierFilter);
    return cities;
  }, [filter, tierFilter]);

  const stats = {
    total: allCities.length,
    certified: allCities.filter(c => c.status === "certified").length,
    promotion: allCities.filter(c => c.status === "promotion").length,
    alpha: alphaCities.length,
    beta: betaCities.length,
    gamma: gammaCities.length,
    operational: allCities.filter(c => c.reality === "operational").length,
  };

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="hero section">
        <p className="eyebrow">
          {locale === "th" ? "ดัชนีเมืองอัจฉริยะประเทศไทย — 2026" : "Smart City Thailand Index — 2026"}
        </p>
        <h1 className="hero-title">
          {locale === "th"
            ? <>ไม่ใช่แผน<br />แต่คือความจริง</>
            : <>Not a plan.<br />A reality check.</>}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? `${stats.total} เมืองอัจฉริยะ จัดกลุ่มตามผลลัพธ์จริง ไม่ใช่ข้อเสนอบนกระดาษ เมืองที่เรียกตัวเองว่าอัจฉริยะแต่ยังไม่สร้าง ได้คะแนนต่ำ เมืองที่คนอยู่ได้จริง ได้คะแนนสูง`
            : `${stats.total} smart cities grouped by what actually exists — not paper proposals. Cities that call themselves smart but haven't built anything score low. Cities where people actually live well score high.`}
        </p>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="stats-strip section">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">{locale === "th" ? "เมืองทั้งหมด" : "Cities tracked"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.certified}</div>
          <div className="stat-label">{locale === "th" ? "ได้รับตราสัญลักษณ์" : "Certified (Smart City Local)"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.promotion}</div>
          <div className="stat-label">{locale === "th" ? "เขตส่งเสริม" : "Promotion zones"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.operational}</div>
          <div className="stat-label">{locale === "th" ? "ใช้งานจริง" : "Actually operational"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.alpha}</div>
          <div className="stat-label">{locale === "th" ? "ระดับ Alpha" : "Alpha tier"}</div>
        </div>
      </section>

      {/* ─── TIER OVERVIEW ─── */}
      <section className="tier-overview section">
        <p className="eyebrow">{locale === "th" ? "ระบบจัดกลุ่ม" : "Tier system"}</p>
        <h2>{locale === "th" ? "Alpha · Beta · Gamma" : "Alpha · Beta · Gamma"}</h2>
        <p className="section-intro">
          {locale === "th"
            ? "เราไม่จัดอันดับเมือง 1, 2, 3 เพราะไร้ความหมาย เราจัดกลุ่มเมืองตามระดับผลลัพธ์จริง เมืองแต่ละกลุ่มเรียงตามตัวอักษร"
            : "We don't rank cities 1, 2, 3 — that's meaningless precision on imprecise data. We group cities by outcome tier. Within each tier, cities are listed alphabetically."}
        </p>
        <div className="tier-cards">
          <div className="tier-card tier-card-alpha">
            <div className="tier-card-header">
              <span className="tier-symbol">α</span>
              <span className="tier-name">Alpha</span>
              <span className="tier-count">{stats.alpha} {locale === "th" ? "เมือง" : "cities"}</span>
            </div>
            <p className="tier-desc">
              {locale === "th"
                ? "เมืองที่ฉลาดจริง น่าอยู่จริง มีโครงสร้างพื้นฐานดิจิทัลทำงาน คนรู้สึกมีความหวัง"
                : "Genuinely smart and livable. Digital infrastructure works. People feel hopeful."}
            </p>
          </div>
          <div className="tier-card tier-card-beta">
            <div className="tier-card-header">
              <span className="tier-symbol">β</span>
              <span className="tier-name">Beta</span>
              <span className="tier-count">{stats.beta} {locale === "th" ? "เมือง" : "cities"}</span>
            </div>
            <p className="tier-desc">
              {locale === "th"
                ? "กำลังดำเนินการ ผลลัพธ์เห็นได้บ้าง แต่ยังมีช่องว่างระหว่างแผนกับความจริง"
                : "Work in progress. Some visible outcomes, but gaps between plans and reality remain."}
            </p>
          </div>
          <div className="tier-card tier-card-gamma">
            <div className="tier-card-header">
              <span className="tier-symbol">γ</span>
              <span className="tier-name">Gamma</span>
              <span className="tier-count">{stats.gamma} {locale === "th" ? "เมือง" : "cities"}</span>
            </div>
            <p className="tier-desc">
              {locale === "th"
                ? "มีแผนแต่ยังไม่สร้าง หรือเพิ่งเริ่มต้น บางเมืองมีตราสัญลักษณ์แล้วแต่ไม่มีอะไรให้เห็น"
                : "Plans on paper or very early stage. Some have logos but nothing to show for it."}
            </p>
          </div>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <Suspense fallback={null}>
        <ThailandMap locale={locale} onNavigate={onNavigate} />
      </Suspense>

      {/* ─── INTERACTIVE SPIDER ALLOCATOR ─── */}
      <Suspense fallback={null}>
        <SpiderAllocator locale={locale} onNavigate={onNavigate} />
      </Suspense>

      {/* ─── RANKING TABLE ─── */}
      <section className="ranking-section section" id="rankings">
        <p className="eyebrow">{locale === "th" ? "ตารางอันดับ" : "The ranking"}</p>
        <h2>{locale === "th" ? "เมืองอัจฉริยะทั้งหมด" : "All Smart Cities"}</h2>

        {/* Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              {locale === "th" ? "ทั้งหมด" : "All"} ({stats.total})
            </button>
            <button className={`filter-btn ${filter === "certified" ? "active" : ""}`} onClick={() => setFilter("certified")}>
              {locale === "th" ? "รับรองแล้ว" : "Certified"} ({stats.certified})
            </button>
            <button className={`filter-btn ${filter === "promotion" ? "active" : ""}`} onClick={() => setFilter("promotion")}>
              {locale === "th" ? "เขตส่งเสริม" : "Promotion"} ({stats.promotion})
            </button>
          </div>
          <div className="filter-group">
            <button className={`filter-btn ${tierFilter === "all" ? "active" : ""}`} onClick={() => setTierFilter("all")}>
              α β γ
            </button>
            <button className={`filter-btn tier-alpha ${tierFilter === "alpha" ? "active" : ""}`} onClick={() => setTierFilter("alpha")}>
              α Alpha
            </button>
            <button className={`filter-btn tier-beta ${tierFilter === "beta" ? "active" : ""}`} onClick={() => setTierFilter("beta")}>
              β Beta
            </button>
            <button className={`filter-btn tier-gamma ${tierFilter === "gamma" ? "active" : ""}`} onClick={() => setTierFilter("gamma")}>
              γ Gamma
            </button>
          </div>
        </div>

        {/* Pillar legend */}
        <div className="pillar-legend">
          {PILLAR_ORDER.map(p => (
            <span key={p} className="legend-item">
              <span className="legend-dot" style={{ background: PILLAR_COLORS[p] }} />
              {PILLAR_LABELS[locale][p]}
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{locale === "th" ? "เมือง" : "City"}</th>
                <th>{locale === "th" ? "ระดับ" : "Tier"}</th>
                <th>{locale === "th" ? "คะแนน" : "Score"}</th>
                <th>{locale === "th" ? "สถานะ" : "Status"}</th>
                <th>{locale === "th" ? "เสาหลัก" : "Pillars"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((city, i) => (
                <CityRow key={city.id} city={city} locale={locale} onNavigate={onNavigate} rank={i + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── REALITY CHECK CALLOUT ─── */}
      <section className="callout-section section">
        <div className="callout-card">
          <p className="eyebrow">{locale === "th" ? "ตรวจสอบความเป็นจริง" : "Reality check"}</p>
          <h2>
            {locale === "th"
              ? "ทำไมวังจันทร์วัลเลย์ถึงอยู่ Gamma?"
              : "Why is Wangchan Valley in Gamma?"}
          </h2>
          <p>
            {locale === "th"
              ? "เพราะเมื่อคุณไปที่นั่น คุณไม่เห็นอะไรเลย สร้างไม่ถึง 10% แต่ถูกจัดอันดับ #1 ในดัชนีเก่า นั่นคือปัญหาของดัชนีที่วัดจากแผน ไม่ใช่ความจริง ดัชนีนี้วัดจากสิ่งที่มีอยู่จริง ไม่ใช่ PowerPoint"
              : "Because when you go there, you see empty land. Less than 10% built. Yet it was ranked #1 in the old index. That's the problem with indices that measure plans, not reality. This index measures what actually exists — not PowerPoint decks."}
          </p>
          <button className="cta-button" onClick={() => onNavigate("/methodology")}>
            {locale === "th" ? "อ่านวิธีการให้คะแนน" : "Read our methodology"}
          </button>
        </div>
      </section>
    </>
  );
}
