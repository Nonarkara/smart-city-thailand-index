import { useMemo, useState } from "react";
import ActionAtlas from "./ActionAtlas";
import { useInView } from "./useInView";
import { useCitySummaries } from "./cityApi";
import { filterCities, sortCities, summarizeCities } from "./cityCollections";
import {
  getCityName,
  getProvinceName,
  translate,
} from "./cityPresentation";
import type { CityTier, Locale, SmartCity } from "./types";
import { TIER_LABELS, PILLAR_COLORS, PILLAR_SHORT_LABELS } from "./types";
import { SCORING_PILLARS } from "./scoring";

/** Short, unique vibe phrase per city — keeps the reality color but says something memorable */
function getCityVibe(city: SmartCity, locale: Locale): string {
  // Find the city's strongest and weakest pillars
  const pillars = SCORING_PILLARS;
  const sorted = [...pillars].sort((a, b) => city.scores[b] - city.scores[a]);
  const strongest = sorted[0];

  // City-specific vibes for well-known cities
  const vibes: Record<string, { en: string; th: string; zh: string }> = {
    "phuket": { en: "Tourism engine, real tech", th: "เครื่องยนต์ท่องเที่ยว เทคจริง", zh: "旅游引擎，真技术" },
    "samyan": { en: "Innovation district, alive", th: "ย่านนวัตกรรม มีชีวิต", zh: "创新区，活的" },
    "chiang-mai-old-town": { en: "Heritage meets sensors", th: "มรดกพบเซ็นเซอร์", zh: "遗产遇上传感器" },
    "khon-kaen": { en: "Isan's real deal", th: "ของจริงอีสาน", zh: "伊善การเมือง", },
    "saensuk": { en: "Beach town, clean data", th: "เมืองชายหาด ข้อมูลสะอาด", zh: "海滩小城，干净数据" },
    "yala": { en: "Cleanest city, real grit", th: "เมืองสะอาดสุด ใจสู้", zh: "最干净城市，真韧性" },
    "wangchan-valley": { en: "Empty land, bold pitch", th: "ที่ดินว่าง pitch กล้า", zh: "空地一片，愿景很大" },
  };

  if (vibes[city.id]) {
    return vibes[city.id][locale];
  }

  const pillarVibes: Record<string, { en: string; th: string; zh: string }> = {
    livability: { en: "Built for living", th: "สร้างเพื่ออยู่", zh: "为生活而建" },
    economy: { en: "Money moves here", th: "เงินไหลที่นี่", zh: "资金流动之地" },
    safety: { en: "Quiet streets, real data", th: "ถนนสงบ ข้อมูลจริง", zh: "安静街道，真实数据" },
    wellbeing: { en: "People-first signal", th: "สัญญาณคนมาก่อน", zh: "以人为先信号" },
    environment: { en: "Green signal, verified", th: "สัญญาณเขียว ยืนยันแล้ว", zh: "绿色信号，已验证" },
    hospitality: { en: "Warm city, open doors", th: "เมืองอบอุ่น เปิดประตู", zh: "温暖城市，敞开大门" },
    digital: { en: "Wired and running", th: "เชื่อมต่อและวิ่ง", zh: "已联网，运行中" },
  };

  if (city.reality === "planned") {
    return locale === "th" ? "แผนบนกระดาษ" : locale === "zh" ? "纸上规划" : "Paper plan, unbuilt";
  }
  if (city.reality === "partial") {
    return locale === "th" ? "กำลังสร้าง มีช่องว่าง" : locale === "zh" ? "建设中，有缺口" : "Building, gaps remain";
  }

  return pillarVibes[strongest]?.[locale] ?? (locale === "th" ? "ทำงานจริง" : locale === "zh" ? "运行中" : "Running");
}

function RankingRow({
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
  const cityName = getCityName(city, locale);
  const cityPath = `/city/${city.id}`;

  return (
    <button
      type="button"
      className="dashboard-ranking-row"
      role="link"
      onClick={() => onNavigate(cityPath)}
    >
      <div className="dashboard-ranking-topline">
        <span className="dashboard-ranking-rank">{String(rank).padStart(2, "0")}</span>
        <span className="dashboard-ranking-name">{cityName}</span>
        <span className="dashboard-ranking-score">{city.compositeScore.toFixed(1)}</span>
      </div>
      <div className="dashboard-ranking-bars">
        {(SCORING_PILLARS).map(p => (
          <div key={p} className="dashboard-ranking-bar-track" title={`${PILLAR_SHORT_LABELS[locale][p]}: ${city.scores[p]}`}>
            <div className="dashboard-ranking-bar-fill" style={{ width: `${city.scores[p]}%`, background: PILLAR_COLORS[p] }} />
          </div>
        ))}
      </div>
      <div className="dashboard-ranking-bottomline">
        <span className="dashboard-ranking-meta">
          {getProvinceName(city, locale)} · {TIER_LABELS[locale][city.tier]}
        </span>
        <span className={`dashboard-ranking-vibe dashboard-ranking-vibe-${city.reality}`}>
          {getCityVibe(city, locale)}
        </span>
      </div>
    </button>
  );
}

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function HomePage({ locale, onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState<"all" | "certified" | "promotion">("all");
  const [tierFilter, setTierFilter] = useState<"all" | CityTier>("all");
  const [heroRef, heroVisible] = useInView(0.1);
  const [guideRef, guideVisible] = useInView(0.1);
  const [atlasRef, atlasVisible] = useInView(0.1);
  const [rankingRef, rankingVisible] = useInView(0.1);
  const [feedbackRef, feedbackVisible] = useInView(0.1);
  const [fineprintRef, fineprintVisible] = useInView(0.1);

  const { data: cities } = useCitySummaries();
  const stats = useMemo(() => summarizeCities(cities), [cities]);
  const previewCities = useMemo(() => {
    return sortCities(
      filterCities(cities, {
        status: statusFilter,
        tier: tierFilter,
      }),
    ).slice(0, 24);
  }, [cities, statusFilter, tierFilter]);

  return (
    <div className="dashboard-home">
      {/* ─── CINEMATIC HERO ─── */}
      <section ref={heroRef} className={`cinematic-hero reveal ${heroVisible ? "visible" : ""}`}>
        <img
          src="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1920&h=900&fit=crop&q=80"
          alt="Bangkok skyline"
          className="cinematic-hero-img"
          width={1920}
          height={900}
          loading="eager"
        />
        <div className="cinematic-hero-overlay">
          <p className="cinematic-hero-eyebrow">SCITI 2026 — {translate(locale, { en: "pronounced \"City\"", th: "อ่านว่า \"ซิตี้\"", zh: "读作 \"City\"" })}</p>
          <h1 className="cinematic-hero-title">
            {locale === "th" ? <>เอาความจริง<br />ไม่เอาพิธีตัดริบบิ้น</> : locale === "zh" ? <>看现实<br />不看剪彩</> : <>Reality, not<br />ribbon&#8209;cutting.</>}
          </h1>
          <p className="cinematic-hero-why">
             {translate(locale, {
              en: "Thailand has certified 37 smart cities. But how many of them actually work? This index exists because the gap between announcements and outcomes needed measuring.",
              th: "ประเทศไทยรับรองเมืองอัจฉริยะ 37 เมือง แต่มีกี่เมืองที่ทำงานได้จริง? ดัชนีนี้มีอยู่เพราะช่องว่างระหว่างคำประกาศกับผลลัพธ์ต้องถูกวัด",
              zh: "泰国已认证37座智慧城市。但其中有多少真正在运转？这个指数的存在，是因为公告与结果之间的差距需要被衡量。",
            })}
          </p>
          <div className="cinematic-hero-stats">
            <span>{stats.total} {locale === "th" ? "เมือง" : "cities"}</span>
            <span>{stats.operational} {locale === "th" ? "ใช้งานจริง" : "operational"}</span>
            <span>{stats.certified} {locale === "th" ? "รับรอง" : "certified"}</span>
          </div>
          <div className="cinematic-hero-actions">
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>Get Rankings</button>
            <button className="ghost-button cinematic-ghost" onClick={() => onNavigate("/methodology")}>Methodology</button>
          </div>
        </div>
      </section>

      {/* ─── HOW TO READ THIS ─── */}
      <section ref={guideRef} className={`guide-strip reveal stagger-1 ${guideVisible ? "visible" : ""}`}>
        <div className="guide-strip-inner">
          <p className="guide-item">
            <strong>{translate(locale, { en: "Score 0\u2013100", th: "คะแนน 0\u2013100", zh: "0\u2013100 分" })}</strong>
            {translate(locale, { en: " \u2014 Outcomes, not plans.", th: " \u2014 ผลลัพธ์ ไม่ใช่แผน", zh: " \u2014 结果，而非计划。" })}
          </p>
        </div>
      </section>

      {/* ─── ACTION ATLAS ─── */}
      <section ref={atlasRef} className={`reveal stagger-2 ${atlasVisible ? "visible" : ""}`}>
        <ActionAtlas cities={previewCities} locale={locale} onNavigate={onNavigate} />
      </section>

      {/* ─── FIELDboard ─── */}
      <section ref={rankingRef} className={`dashboard-panel reveal stagger-3 ${rankingVisible ? "visible" : ""}`}>
        <div className="dashboard-controls">
          <button className={`filter-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All</button>
          <button className={`filter-btn ${statusFilter === "certified" ? "active" : ""}`} onClick={() => setStatusFilter("certified")}>Certified</button>
        </div>
        <div className="dashboard-ranking-list">
          {previewCities.map((city, index) => (
            <RankingRow key={city.id} city={city} locale={locale} onNavigate={onNavigate} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* ─── FEEDBACK & CONTRIBUTIONS ─── */}
      <section ref={feedbackRef} className={`section reveal stagger-4 ${feedbackVisible ? "visible" : ""}`}>
        <div className="feedback-cta glass-card shadow-premium">
          <h2>{translate(locale, { en: "Is your city missing?", th: "เมืองของคุณหายไปใช่ไหม?", zh: "您的城市不在名单上？" })}</h2>
          <p>{translate(locale, { en: "We only rank cities with enough verifiable data.", th: "เราจัดอันดับเฉพาะเมืองที่มีข้อมูลตรวจสอบได้เพียงพอ", zh: "我们仅对拥有足够可验证数据的城市进行排名。" })}</p>
          <button className="cta-button" onClick={() => window.open("mailto:data@slic-index.org")}>Submit Data</button>
        </div>
      </section>

      {/* ─── FINE PRINT ─── */}
      <section ref={fineprintRef} className={`dashboard-fineprint reveal visible`}>
        <div className="dashboard-fineprint-inner">
           <p>© 2026 depa, MDES, Kingdom of Thailand · SLIC Methodology · CC BY 4.0</p>
        </div>
      </section>
    </div>
  );
}
