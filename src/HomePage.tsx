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
  const path = `/city/${city.id}`;
  const cityName = locale === "th" ? city.nameTh : city.nameEn;
  const provinceName = locale === "th" ? city.provinceTh : city.province;

  return (
    <tr
      className="city-row"
      role="link"
      tabIndex={0}
      aria-label={`${cityName}, ${provinceName}`}
      onClick={() => onNavigate(path)}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate(path);
        }
      }}
    >
      <td className="city-rank">{rank}</td>
      <td className="city-name-cell">
        <div className="city-name">{cityName}</div>
        <div className="city-province">{provinceName}</div>
      </td>
      <td className="city-tier-cell">
        <TierBadge tier={city.tier} locale={locale} />
      </td>
      <td className="city-score">{city.compositeScore.toFixed(1)}</td>
      <td className="city-status-cell">
        <span className={`status-dot status-${city.reality}`} />
        {city.status === "certified"
          ? (locale === "th" ? "รับรอง" : locale === "zh" ? "认证" : "Certified")
          : (locale === "th" ? "ส่งเสริม" : locale === "zh" ? "推广" : "Promotion")}
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
  const spotlightCities = useMemo(
    () => [...allCities].sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 3),
    [],
  );

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
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              {locale === "th" ? "ดัชนีเมืองอัจฉริยะประเทศไทย — 2026" : locale === "zh" ? "泰国智慧城市指数 — 2026" : "Smart City Thailand Index — 2026"}
            </p>
            <h1 className="hero-title">
              {locale === "th"
                ? <>ไม่ใช่แผน<br />แต่คือความจริง</>
                : locale === "zh"
                  ? <>不是规划。<br />而是现实校验。</>
                  : <>Not a plan.<br />A reality check.</>}
            </h1>
            <p className="hero-strapline">
              {locale === "th"
                ? `${stats.total} เมืองอัจฉริยะ จัดกลุ่มตามผลลัพธ์จริง ไม่ใช่ข้อเสนอบนกระดาษ เมืองที่เรียกตัวเองว่าอัจฉริยะแต่ยังไม่สร้าง ได้คะแนนต่ำ เมืองที่คนอยู่ได้จริง ได้คะแนนสูง`
                : locale === "zh"
                  ? `${stats.total} 座智慧城市按真实结果分组，而不是按纸面方案排场。自称智慧却尚未落地的城市得分低；真正让人住得下去、活得好的城市得分高。`
                  : `${stats.total} smart cities grouped by what actually exists — not paper proposals. Cities that call themselves smart but haven't built anything score low. Cities where people actually live well score high.`}
            </p>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => onNavigate("/rankings")}>
                {locale === "th" ? "ดูอันดับทั้งหมด" : locale === "zh" ? "查看完整排名" : "View full rankings"}
              </button>
              <button className="ghost-button" onClick={() => onNavigate("/story")}>
                {locale === "th" ? "ดูเรื่องราวเบื้องหลัง" : locale === "zh" ? "查看背后故事" : "Read the backstory"}
              </button>
            </div>
            <div className="hero-scanline" aria-label="Index summary">
              <span>{stats.total} {locale === "th" ? "เมือง" : locale === "zh" ? "城" : "cities"}</span>
              <span>{stats.certified} {locale === "th" ? "รับรอง" : locale === "zh" ? "认证" : "certified"}</span>
              <span>{stats.promotion} {locale === "th" ? "เขตส่งเสริม" : locale === "zh" ? "推广区" : "promotion zones"}</span>
              <span>{stats.operational} {locale === "th" ? "ใช้งานจริง" : locale === "zh" ? "真实运行" : "operational"}</span>
            </div>
          </div>

          <div className="hero-rail">
            <div className="hero-signal-card">
              <p className="hero-panel-kicker">
                {locale === "th" ? "สนามจริง" : locale === "zh" ? "现场信号" : "Field signal"}
              </p>
              <div className="hero-panel-headline">
                {locale === "th"
                  ? "เราวัดเมืองจากของที่เดินอยู่จริง"
                  : locale === "zh"
                    ? "我们按真实运转的东西给城市打分"
                    : "We score cities by what actually runs"}
              </div>
              <p className="hero-panel-copy">
                {locale === "th"
                  ? "ไม่ใช่ PowerPoint ไม่ใช่โลโก้ ไม่ใช่คำประกาศ ถ้าไม่มีผลลัพธ์ในเมือง คะแนนก็ไม่ขึ้น"
                  : locale === "zh"
                    ? "不是 PPT，不是徽章，不是口号。城市里没有结果，分数就不会自己长出来。"
                    : "Not by PowerPoint. Not by logos. Not by declarations. If the result is not visible in the city, the score does not rise."}
              </p>
              <div className="hero-signal-grid">
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">{locale === "th" ? "Alpha" : locale === "zh" ? "Alpha" : "Alpha"}</span>
                  <strong>{stats.alpha}</strong>
                </div>
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">{locale === "th" ? "Beta" : locale === "zh" ? "Beta" : "Beta"}</span>
                  <strong>{stats.beta}</strong>
                </div>
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">{locale === "th" ? "Gamma" : locale === "zh" ? "Gamma" : "Gamma"}</span>
                  <strong>{stats.gamma}</strong>
                </div>
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">{locale === "th" ? "จริง" : locale === "zh" ? "真实" : "Live"}</span>
                  <strong>{stats.operational}</strong>
                </div>
              </div>
            </div>

            <div className="hero-spotlight-card">
              <p className="hero-panel-kicker">
                {locale === "th" ? "สัญญาณนำ" : locale === "zh" ? "领先信号" : "Lead signals"}
              </p>
              <div className="hero-spotlight-list">
                {spotlightCities.map((city, index) => (
                  <button
                    key={city.id}
                    type="button"
                    className="hero-city-chip"
                    onClick={() => onNavigate(`/city/${city.id}`)}
                  >
                    <span className="hero-city-rank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="hero-city-meta">
                      <span className="hero-city-name">{locale === "th" ? city.nameTh : city.nameEn}</span>
                      <span className="hero-city-tier">{TIER_LABELS[locale][city.tier]}</span>
                    </span>
                    <span className="hero-city-score">{city.compositeScore.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="stats-strip section">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">{locale === "th" ? "เมืองทั้งหมด" : locale === "zh" ? "纳入城市" : "Cities tracked"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.certified}</div>
          <div className="stat-label">{locale === "th" ? "ได้รับตราสัญลักษณ์" : locale === "zh" ? "已认证城市" : "Certified (Smart City Local)"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.promotion}</div>
          <div className="stat-label">{locale === "th" ? "เขตส่งเสริม" : locale === "zh" ? "本版收录推广区" : "Profiled promotion zones"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.operational}</div>
          <div className="stat-label">{locale === "th" ? "ใช้งานจริง" : locale === "zh" ? "真实运行中" : "Actually operational"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.alpha}</div>
          <div className="stat-label">{locale === "th" ? "ระดับ Alpha" : locale === "zh" ? "Alpha 级" : "Alpha tier"}</div>
        </div>
      </section>

      {/* ─── TIER OVERVIEW ─── */}
      <section className="tier-overview section">
        <p className="eyebrow">{locale === "th" ? "ระบบจัดกลุ่ม" : locale === "zh" ? "分层系统" : "Tier system"}</p>
        <h2>{locale === "th" ? "Alpha · Beta · Gamma" : "Alpha · Beta · Gamma"}</h2>
        <p className="section-intro">
          {locale === "th"
            ? "เราไม่จัดอันดับเมือง 1, 2, 3 เพราะไร้ความหมาย เราจัดกลุ่มเมืองตามระดับผลลัพธ์จริง แล้วให้คุณดูตามมิติที่สนใจ"
            : locale === "zh"
              ? "我们不做 1、2、3 这种假精确排名。我们按结果层级分组，再让你按最关心的维度去看。"
              : "We don't rank cities 1, 2, 3 — that's meaningless precision on fuzzy data. We group cities by outcome tier, then let you inspect the metric that matters to you."}
        </p>
        <div className="tier-cards">
          <div className="tier-card tier-card-alpha">
            <div className="tier-card-header">
              <span className="tier-symbol">α</span>
              <span className="tier-name">Alpha</span>
              <span className="tier-count">{stats.alpha} {locale === "th" ? "เมือง" : locale === "zh" ? "城" : "cities"}</span>
            </div>
            <p className="tier-desc">
              {locale === "th"
                ? "เมืองที่ฉลาดจริง น่าอยู่จริง มีโครงสร้างพื้นฐานดิจิทัลทำงาน คนรู้สึกมีความหวัง"
                : locale === "zh"
                  ? "真正聪明、真正宜居的城市。数字基础设施运作，居民对未来还有感觉。"
                : "Genuinely smart and livable. Digital infrastructure works. People feel hopeful."}
            </p>
          </div>
          <div className="tier-card tier-card-beta">
            <div className="tier-card-header">
              <span className="tier-symbol">β</span>
              <span className="tier-name">Beta</span>
              <span className="tier-count">{stats.beta} {locale === "th" ? "เมือง" : locale === "zh" ? "城" : "cities"}</span>
            </div>
            <p className="tier-desc">
              {locale === "th"
                ? "กำลังดำเนินการ ผลลัพธ์เห็นได้บ้าง แต่ยังมีช่องว่างระหว่างแผนกับความจริง"
                : locale === "zh"
                  ? "正在推进，已有部分成果，但规划与现实之间仍有明显落差。"
                : "Work in progress. Some visible outcomes, but gaps between plans and reality remain."}
            </p>
          </div>
          <div className="tier-card tier-card-gamma">
            <div className="tier-card-header">
              <span className="tier-symbol">γ</span>
              <span className="tier-name">Gamma</span>
              <span className="tier-count">{stats.gamma} {locale === "th" ? "เมือง" : locale === "zh" ? "城" : "cities"}</span>
            </div>
            <p className="tier-desc">
              {locale === "th"
                ? "มีแผนแต่ยังไม่สร้าง หรือเพิ่งเริ่มต้น บางเมืองมีตราสัญลักษณ์แล้วแต่ไม่มีอะไรให้เห็น"
                : locale === "zh"
                  ? "仍停留在方案或刚起步阶段。有些城市有标识，却几乎没有可见成果。"
                : "Plans on paper or very early stage. Some have logos but nothing to show for it."}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CITY PHOTO STRIP ─── */}
      <section className="photo-strip">
        {[
          { city: "Bangkok", src: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=340&fit=crop", id: "samyan" },
          { city: "Phuket", src: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=340&fit=crop", id: "phuket" },
          { city: "Chiang Mai", src: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&h=340&fit=crop", id: "chiang-mai-old-town" },
          { city: "Khon Kaen", src: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=340&fit=crop", id: "khon-kaen" },
          { city: "Krabi", src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=340&fit=crop", id: "krabi" },
        ].map(p => (
          <button key={p.id} className="photo-strip-item" onClick={() => onNavigate(`/city/${p.id}`)}>
            <img src={p.src} alt={p.city} loading="lazy" />
            <span className="photo-strip-label">{p.city}</span>
          </button>
        ))}
      </section>

      {/* ─── REALITY CHECK CALLOUT ─── */}
      <section className="callout-section section">
        <div className="callout-card">
          <p className="eyebrow">{locale === "th" ? "ตรวจสอบความเป็นจริง" : locale === "zh" ? "现实校验" : "Reality check"}</p>
          <h2>
            {locale === "th"
              ? "ทำไมวังจันทร์วัลเลย์ถึงอยู่ Gamma?"
              : locale === "zh"
                ? "为什么 Wangchan Valley 会落在 Gamma？"
              : "Why is Wangchan Valley in Gamma?"}
          </h2>
          <p>
            {locale === "th"
              ? "เพราะเมื่อคุณไปที่นั่น คุณไม่เห็นอะไรเลย สร้างไม่ถึง 10% แต่ถูกจัดอันดับ #1 ในดัชนีเก่า นั่นคือปัญหาของดัชนีที่วัดจากแผน ไม่ใช่ความจริง ดัชนีนี้วัดจากสิ่งที่มีอยู่จริง ไม่ใช่ PowerPoint"
              : locale === "zh"
                ? "因为你亲自去看，会发现大部分只是空地。建成不到 10%，却曾在旧指数里排第 1。这正是按方案而不是按现实打分的毛病。这个指数衡量的是已经存在的东西，不是 PPT。"
              : "Because when you go there, you see empty land. Less than 10% built. Yet it was ranked #1 in the old index. That's the problem with indices that measure plans, not reality. This index measures what actually exists — not PowerPoint decks."}
          </p>
          <button className="cta-button" onClick={() => onNavigate("/methodology")}>
            {locale === "th" ? "อ่านวิธีการให้คะแนน" : locale === "zh" ? "查看评分方法" : "Read our methodology"}
          </button>
        </div>
      </section>
    </>
  );
}
