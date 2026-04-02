import { lazy, Suspense, useMemo, useState } from "react";
import { allCities, getCityById } from "./cityData";
import { filterCities, getSpotlightCities, sortCities, summarizeCities } from "./cityCollections";
import {
  getCityName,
  getCityStatusLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { SCORING_PILLARS } from "./scoring";
import type { CityTier, Locale, SmartCity } from "./types";
import { PILLAR_COLORS, TIER_LABELS } from "./types";

const SpiderAllocator = lazy(() => import("./SpiderAllocator"));
const ThailandMap = lazy(() => import("./ThailandMap"));

const PHOTO_STRIP_ITEMS = [
  {
    id: "samyan",
    fallbackLabel: "Bangkok",
    src: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=340&fit=crop",
  },
  {
    id: "phuket",
    fallbackLabel: "Phuket",
    src: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=340&fit=crop",
  },
  {
    id: "chiang-mai-old-town",
    fallbackLabel: "Chiang Mai",
    src: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&h=340&fit=crop",
  },
  {
    id: "khon-kaen",
    fallbackLabel: "Khon Kaen",
    src: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=340&fit=crop",
  },
  {
    id: "krabi",
    fallbackLabel: "Krabi",
    src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=340&fit=crop",
  },
] as const;

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

function PillarBar({ pillar, value }: { pillar: (typeof SCORING_PILLARS)[number]; value: number }) {
  return (
    <div className="pillar-bar">
      <div
        className="pillar-bar-fill"
        style={{ width: `${value}%`, background: PILLAR_COLORS[pillar] }}
      />
    </div>
  );
}

function CityRow({
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
  const path = `/city/${city.id}`;
  const cityName = getCityName(city, locale);
  const provinceName = getProvinceName(city, locale);

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
        {getCityStatusLabel(city.status, locale)}
      </td>
      <td className="pillar-bars-cell">
        {SCORING_PILLARS.map(pillar => (
          <PillarBar key={pillar} pillar={pillar} value={city.scores[pillar]} />
        ))}
      </td>
    </tr>
  );
}

export default function HomePage({ locale, onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState<"all" | "certified" | "promotion">("all");
  const [tierFilter, setTierFilter] = useState<"all" | CityTier>("all");

  const stats = useMemo(() => summarizeCities(allCities), []);
  const spotlightCities = useMemo(() => getSpotlightCities(allCities), []);
  const previewCities = useMemo(() => {
    const filteredCities = filterCities(allCities, {
      status: statusFilter,
      tier: tierFilter,
    });
    return sortCities(filteredCities).slice(0, 12);
  }, [statusFilter, tierFilter]);
  const photoStripCities = useMemo(() => {
    return PHOTO_STRIP_ITEMS.map(item => ({
      ...item,
      city: getCityById(item.id),
    }));
  }, []);

  return (
    <>
      <section className="hero section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              {translate(locale, {
                en: "Smart City Thailand Index — 2026",
                th: "ดัชนีเมืองอัจฉริยะประเทศไทย — 2026",
                zh: "泰国智慧城市指数 — 2026",
              })}
            </p>
            <h1 className="hero-title">
              {locale === "th"
                ? <>ไม่ใช่แผน<br />แต่คือความจริง</>
                : locale === "zh"
                  ? <>不是规划。<br />而是现实校验。</>
                  : <>Not a plan.<br />A reality check.</>}
            </h1>
            <p className="hero-strapline">
              {translate(locale, {
                en: `${stats.total} smart cities grouped by what actually exists, not what was promised in a deck. Cities with outcomes rise. Cities with logos and empty land sink.`,
                th: `${stats.total} เมืองอัจฉริยะที่เราจัดกลุ่มจากสิ่งที่มีอยู่จริง ไม่ใช่สิ่งที่เขียนไว้ในสไลด์ เมืองที่มีผลลัพธ์ขึ้น เมืองที่มีแต่โลโก้กับที่ดินว่างตกลง`,
                zh: `${stats.total} 座智慧城市按真实落地结果分组，不按幻灯片里的承诺排场。有成果的城市会上升，只有标识和空地的城市会往下掉。`,
              })}
            </p>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => onNavigate("/rankings")}>
                {translate(locale, {
                  en: "View full rankings",
                  th: "ดูอันดับทั้งหมด",
                  zh: "查看完整排名",
                })}
              </button>
              <button className="ghost-button" onClick={() => onNavigate("/story")}>
                {translate(locale, {
                  en: "Read the backstory",
                  th: "ดูเรื่องราวเบื้องหลัง",
                  zh: "查看背后故事",
                })}
              </button>
            </div>
            <div className="hero-scanline" aria-label="Index summary">
              <span>{stats.total} {translate(locale, { en: "cities", th: "เมือง", zh: "城" })}</span>
              <span>{stats.certified} {translate(locale, { en: "certified", th: "รับรอง", zh: "认证" })}</span>
              <span>{stats.promotion} {translate(locale, { en: "promotion zones", th: "เขตส่งเสริม", zh: "推广区" })}</span>
              <span>{stats.operational} {translate(locale, { en: "operational", th: "ใช้งานจริง", zh: "真实运行" })}</span>
            </div>
          </div>

          <div className="hero-rail">
            <div className="hero-signal-card">
              <p className="hero-panel-kicker">
                {translate(locale, {
                  en: "Field signal",
                  th: "สนามจริง",
                  zh: "现场信号",
                })}
              </p>
              <div className="hero-panel-headline">
                {translate(locale, {
                  en: "We score cities by what actually runs",
                  th: "เราวัดเมืองจากของที่เดินอยู่จริง",
                  zh: "我们按真实运转的东西给城市打分",
                })}
              </div>
              <p className="hero-panel-copy">
                {translate(locale, {
                  en: "Not by PowerPoint. Not by logos. Not by declarations. If the result is not visible in the city, the score does not move.",
                  th: "ไม่ใช่ PowerPoint ไม่ใช่โลโก้ ไม่ใช่คำประกาศ ถ้าไม่มีผลลัพธ์ในเมือง คะแนนก็ไม่ขยับ",
                  zh: "不是 PPT，不是徽章，不是口号。城市里看不到结果，分数就不会自己动起来。",
                })}
              </p>
              <div className="hero-signal-grid">
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">Alpha</span>
                  <strong>{stats.alpha}</strong>
                </div>
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">Beta</span>
                  <strong>{stats.beta}</strong>
                </div>
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">Gamma</span>
                  <strong>{stats.gamma}</strong>
                </div>
                <div className="hero-mini-metric">
                  <span className="hero-mini-label">
                    {translate(locale, { en: "Live", th: "จริง", zh: "真实" })}
                  </span>
                  <strong>{stats.operational}</strong>
                </div>
              </div>
            </div>

            <div className="hero-spotlight-card">
              <p className="hero-panel-kicker">
                {translate(locale, {
                  en: "Lead signals",
                  th: "สัญญาณนำ",
                  zh: "领先信号",
                })}
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
                      <span className="hero-city-name">{getCityName(city, locale)}</span>
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

      <section className="stats-strip section">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">
            {translate(locale, { en: "Cities tracked", th: "เมืองทั้งหมด", zh: "纳入城市" })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.certified}</div>
          <div className="stat-label">
            {translate(locale, {
              en: "Certified (Smart City Local)",
              th: "ได้รับตราสัญลักษณ์",
              zh: "已认证城市",
            })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.promotion}</div>
          <div className="stat-label">
            {translate(locale, {
              en: "Profiled promotion zones",
              th: "เขตส่งเสริม",
              zh: "本版收录推广区",
            })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.operational}</div>
          <div className="stat-label">
            {translate(locale, {
              en: "Actually operational",
              th: "ใช้งานจริง",
              zh: "真实运行中",
            })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.alpha}</div>
          <div className="stat-label">
            {translate(locale, { en: "Alpha tier", th: "ระดับ Alpha", zh: "Alpha 级" })}
          </div>
        </div>
      </section>

      <section className="tier-overview section">
        <p className="eyebrow">
          {translate(locale, { en: "Tier system", th: "ระบบจัดกลุ่ม", zh: "分层系统" })}
        </p>
        <h2>Alpha · Beta · Gamma</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "We do not pretend the difference between rank 7 and rank 8 means anything sacred. We group cities by outcome tier, then let you inspect the evidence.",
            th: "เราไม่แกล้งทำเป็นว่าความต่างระหว่างอันดับ 7 กับ 8 มีความหมายศักดิ์สิทธิ์ เราจัดกลุ่มเมืองตามระดับผลลัพธ์ แล้วให้คุณดูหลักฐานเอง",
            zh: "我们不假装第 7 名和第 8 名之间有什么神圣差别。先按结果层级分组，再把证据摊给你看。",
          })}
        </p>
        <div className="tier-cards">
          <div className="tier-card tier-card-alpha">
            <div className="tier-card-header">
              <span className="tier-symbol">α</span>
              <span className="tier-name">Alpha</span>
              <span className="tier-count">{stats.alpha} {translate(locale, { en: "cities", th: "เมือง", zh: "城" })}</span>
            </div>
            <p className="tier-desc">
              {translate(locale, {
                en: "Cities where infrastructure works, daily life is bearable, and the smart-city claim survives contact with the street.",
                th: "เมืองที่โครงสร้างพื้นฐานทำงาน ชีวิตประจำวันอยู่ได้ และคำว่าเมืองอัจฉริยะยังไม่พังเมื่อเจอของจริงบนถนน",
                zh: "基础设施能运转、日常生活站得住脚，而且“智慧城市”这句话放到街头也不会露馅的城市。",
              })}
            </p>
          </div>
          <div className="tier-card tier-card-beta">
            <div className="tier-card-header">
              <span className="tier-symbol">β</span>
              <span className="tier-name">Beta</span>
              <span className="tier-count">{stats.beta} {translate(locale, { en: "cities", th: "เมือง", zh: "城" })}</span>
            </div>
            <p className="tier-desc">
              {translate(locale, {
                en: "Work in progress. Some real movement, some visible gaps, and a lot riding on whether execution catches up with the promise.",
                th: "กำลังขยับ มีของจริงบางส่วน มีช่องว่างให้เห็นชัด และทุกอย่างขึ้นกับว่าการลงมือทำจะตามคำพูดทันไหม",
                zh: "正在推进。有些成果看得见，也有明显缺口，最后要看执行能不能追上承诺。",
              })}
            </p>
          </div>
          <div className="tier-card tier-card-gamma">
            <div className="tier-card-header">
              <span className="tier-symbol">γ</span>
              <span className="tier-name">Gamma</span>
              <span className="tier-count">{stats.gamma} {translate(locale, { en: "cities", th: "เมือง", zh: "城" })}</span>
            </div>
            <p className="tier-desc">
              {translate(locale, {
                en: "Plan-heavy or early-stage cities. Some have badges. Some have speeches. Too many still do not have outcomes.",
                th: "เมืองที่ยังหนักไปทางแผนหรืออยู่ช่วงเริ่มต้น บางเมืองมีตรา บางเมืองมีคำพูด แต่ยังไม่มีผลลัพธ์พอ",
                zh: "以规划和早期阶段为主的城市。有些有徽章，有些有演讲，但成果仍然太少。",
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">
          {translate(locale, { en: "Quick scan", th: "ดูภาพเร็ว", zh: "快速扫描" })}
        </p>
        <h2>
          {translate(locale, {
            en: "Filter the fieldboard",
            th: "กรองกระดานภาคสนาม",
            zh: "筛选现场看板",
          })}
        </h2>
        <p className="section-intro">
          {translate(locale, {
            en: "A compact preview of the ranking logic. Filter by program status or tier, then jump into the city pages if something looks off.",
            th: "ตัวอย่างย่อของตรรกะการจัดอันดับ กรองตามสถานะโครงการหรือระดับชั้น แล้วกดเข้าไปดูเมืองถ้าตัวเลขมันชวนสงสัย",
            zh: "这是排名逻辑的紧凑预览。按项目状态或层级筛选，哪座城市看着不对劲就点进去看细节。",
          })}
        </p>
        <div className="filter-row">
          <div className="filter-group">
            <button className={`filter-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
              {translate(locale, { en: "All", th: "ทั้งหมด", zh: "全部" })}
            </button>
            <button className={`filter-btn ${statusFilter === "certified" ? "active" : ""}`} onClick={() => setStatusFilter("certified")}>
              {translate(locale, { en: "Certified", th: "รับรองแล้ว", zh: "已认证" })}
            </button>
            <button className={`filter-btn ${statusFilter === "promotion" ? "active" : ""}`} onClick={() => setStatusFilter("promotion")}>
              {translate(locale, { en: "Promotion", th: "เขตส่งเสริม", zh: "推广区" })}
            </button>
          </div>
          <div className="filter-group">
            <button className={`filter-btn ${tierFilter === "all" ? "active" : ""}`} onClick={() => setTierFilter("all")}>
              {translate(locale, { en: "All tiers", th: "ทุกระดับ", zh: "全部层级" })}
            </button>
            <button className={`filter-btn ${tierFilter === "alpha" ? "active" : ""}`} onClick={() => setTierFilter("alpha")}>
              Alpha
            </button>
            <button className={`filter-btn ${tierFilter === "beta" ? "active" : ""}`} onClick={() => setTierFilter("beta")}>
              Beta
            </button>
            <button className={`filter-btn ${tierFilter === "gamma" ? "active" : ""}`} onClick={() => setTierFilter("gamma")}>
              Gamma
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{translate(locale, { en: "City", th: "เมือง", zh: "城市" })}</th>
                <th>{translate(locale, { en: "Tier", th: "ระดับ", zh: "层级" })}</th>
                <th>{translate(locale, { en: "Score", th: "คะแนน", zh: "分数" })}</th>
                <th>{translate(locale, { en: "Program", th: "สถานะ", zh: "状态" })}</th>
                <th>{translate(locale, { en: "Pillars", th: "เสาหลัก", zh: "支柱" })}</th>
              </tr>
            </thead>
            <tbody>
              {previewCities.map((city, index) => (
                <CityRow key={city.id} city={city} locale={locale} onNavigate={onNavigate} rank={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Suspense fallback={<div className="loading">Loading geography…</div>}>
        <ThailandMap locale={locale} onNavigate={onNavigate} />
      </Suspense>

      <Suspense fallback={<div className="loading">Loading priorities…</div>}>
        <SpiderAllocator locale={locale} onNavigate={onNavigate} />
      </Suspense>

      <section className="photo-strip">
        {photoStripCities.map(item => {
          const label = item.city ? getCityName(item.city, locale) : item.fallbackLabel;
          return (
            <button key={item.id} className="photo-strip-item" onClick={() => onNavigate(`/city/${item.id}`)}>
              <img src={item.src} alt={label} loading="lazy" />
              <span className="photo-strip-label">{label}</span>
            </button>
          );
        })}
      </section>

      <section className="callout-section section">
        <div className="callout-card">
          <p className="eyebrow">
            {translate(locale, { en: "Reality check", th: "ตรวจสอบความเป็นจริง", zh: "现实校验" })}
          </p>
          <h2>
            {translate(locale, {
              en: "Why is Wangchan Valley in Gamma?",
              th: "ทำไมวังจันทร์วัลเลย์ถึงอยู่ Gamma?",
              zh: "为什么 Wangchan Valley 会落在 Gamma？",
            })}
          </h2>
          <p>
            {translate(locale, {
              en: "Because when you go there, you still see more promise than city. Less than 10% built, yet older indices put it at the top. That is exactly the bug this index is trying to kill.",
              th: "เพราะถ้าคุณไปจริง คุณยังเห็นคำสัญญามากกว่าเมือง สร้างไม่ถึง 10% แต่ดัชนีเก่ากลับเคยให้ขึ้นอันดับบน นี่แหละคือบั๊กที่ดัชนีนี้ตั้งใจฆ่าทิ้ง",
              zh: "因为你真的去看，会发现那里仍然更像承诺而不是城市。建成不到 10%，旧指数却曾把它放在前排。这正是本指数要狠狠干掉的错误。",
            })}
          </p>
          <button className="cta-button" onClick={() => onNavigate("/methodology")}>
            {translate(locale, {
              en: "Read our methodology",
              th: "อ่านวิธีการให้คะแนน",
              zh: "查看评分方法",
            })}
          </button>
        </div>
      </section>
    </>
  );
}
