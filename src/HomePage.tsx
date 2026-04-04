import { useMemo, useState, useEffect } from "react";
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
import { cityCoords as mapCityCoords, BOUNDS as MAP_BOUNDS } from "./ThailandMap.constants";

// Mini map projection (compact version for homepage)
const MINI_MAP_W = 240;
const MINI_MAP_H = 320;
function miniProject(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * (MINI_MAP_W - 20) + 10;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * (MINI_MAP_H - 20) + 10;
  return { x, y };
}

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
    "khon-kaen": { en: "Isan's real deal", th: "ของจริงอีสาน", zh: "伊善的真货" },
    "cmu-smart-city": { en: "Campus as living lab", th: "แคมปัสเป็นห้องทดลอง", zh: "校园即实验室" },
    "saensuk": { en: "Beach town, clean data", th: "เมืองชายหาด ข้อมูลสะอาด", zh: "海滩小城，干净数据" },
    "phra-ram-4": { en: "CBD corridor, gritty", th: "ระเบียง CBD ดิบๆ", zh: "CBD走廊，硬核" },
    "krabi": { en: "Quiet coast, steady build", th: "ชายฝั่งเงียบ สร้างต่อเนื่อง", zh: "静谧海岸，稳步建设" },
    "chachoengsao": { en: "EEC gateway, working", th: "ประตู EEC ใช้งานได้", zh: "EEC门户，运转中" },
    "hat-yai": { en: "Border trade hub", th: "ศูนย์กลางค้าชายแดน", zh: "边贸枢纽" },
    "nakhon-si-thammarat": { en: "The city that listens", th: "เมืองที่ฟัง", zh: "会倾听的城市" },
    "yala": { en: "Cleanest city, real grit", th: "เมืองสะอาดสุด ใจสู้", zh: "最干净城市，真韧性" },
    "mae-moh": { en: "Coal to clean pivot", th: "เปลี่ยนจากถ่านสู่สะอาด", zh: "从煤到清洁" },
    "nakhonsawan": { en: "River sensors, flood-ready", th: "เซ็นเซอร์แม่น้ำ พร้อมรับน้ำท่วม", zh: "河流传感器，防洪就绪" },
    "klong-phadung": { en: "Canal revival project", th: "โครงการฟื้นคลอง", zh: "运河复兴" },
    "makkasan": { en: "Big plan, no ground yet", th: "แผนใหญ่ ยังไม่ลงดิน", zh: "大计划，尚未落地" },
    "wangchan-valley": { en: "Empty land, bold pitch", th: "ที่ดินว่าง pitch กล้า", zh: "空地一片，愿景很大" },
    "rattanakosin": { en: "Old Bangkok, new wiring", th: "กรุงเก่า สายไฟใหม่", zh: "老曼谷，新线路" },
    "chon-buri": { en: "Industrial spine, EEC", th: "กระดูกสันหลังอุตสาหกรรม", zh: "工业脊柱，EEC" },
    "rayong": { en: "Petrochem meets digital", th: "ปิโตรเคมีพบดิจิทัล", zh: "石化遇上数字" },
    "udon-thani": { en: "Isan's quiet riser", th: "ม้ามืดอีสาน", zh: "伊善的黑马" },
    "nonthaburi": { en: "Bangkok's overflow, growing", th: "ล้นจากกรุงเทพฯ กำลังโต", zh: "曼谷溢出，增长中" },
    "phitsanulok": { en: "Two-river city, steady", th: "เมืองสองแม่น้ำ มั่นคง", zh: "双河之城，稳健" },
    "surat-thani": { en: "Gulf gateway, emerging", th: "ประตูอ่าวไทย กำลังมา", zh: "湾区门户，崛起中" },
  };

  if (vibes[city.id]) {
    return vibes[city.id][locale];
  }

  // Auto-generate from strongest pillar for cities without custom vibes
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

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

/** Bangkok atomic clock — ICT (Indochina Time, UTC+7) */
function BangkokClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const bkk = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }).format(now);
      const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Bangkok", day: "2-digit", month: "short", year: "numeric",
      }).format(now);
      setTime(`${bkk} ICT · ${date}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="ct-bar-clock" aria-label="Bangkok time (ICT)" role="timer">{time}</span>;
}

const REGION_LABELS: Record<SmartCity["region"], { en: string; th: string; zh: string }> = {
  bangkok: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
  central: { en: "Central", th: "ภาคกลาง", zh: "中部" },
  east: { en: "East", th: "ภาคตะวันออก", zh: "东部" },
  north: { en: "North", th: "ภาคเหนือ", zh: "北部" },
  northeast: { en: "Northeast", th: "อีสาน", zh: "东北部" },
  south: { en: "South", th: "ภาคใต้", zh: "南部" },
};

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
      aria-label={`${cityName}, ${getProvinceName(city, locale)}`}
      onClick={() => onNavigate(cityPath)}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate(cityPath);
        }
      }}
    >
      {/* Top line: rank, name, score */}
      <div className="dashboard-ranking-topline">
        <span className="dashboard-ranking-rank">{String(rank).padStart(2, "0")}</span>
        <span className="dashboard-ranking-name">{cityName}</span>
        <span className="dashboard-ranking-score">{city.compositeScore.toFixed(1)}</span>
      </div>

      {/* Full-width color bars — the main visual */}
      <div className="dashboard-ranking-bars">
        {(SCORING_PILLARS).map(p => (
          <div key={p} className="dashboard-ranking-bar-track" title={`${PILLAR_SHORT_LABELS[locale][p]}: ${city.scores[p]}`}>
            <div className="dashboard-ranking-bar-fill" style={{ width: `${city.scores[p]}%`, background: PILLAR_COLORS[p] }}><span className="bar-score-label">{city.scores[p]}</span></div>
          </div>
        ))}
      </div>

      {/* Bottom line: province, vibe phrase */}
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

export default function HomePage({ locale, onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState<"all" | "certified" | "promotion">("all");
  const [tierFilter, setTierFilter] = useState<"all" | CityTier>("all");
  const [heroRef, heroVisible] = useInView(0.1);
  const [guideRef, guideVisible] = useInView(0.1);
  const [rankingRef, rankingVisible] = useInView(0.1);
  const [ctRef, ctVisible] = useInView(0.1);
  const [fineprintRef, fineprintVisible] = useInView(0.1);

  const [barsRef, barsVisible] = useInView(0.1);
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

  const regionPulse = useMemo(() => {
    const grouped = new Map<SmartCity["region"], { cities: SmartCity[]; scoreSum: number; operational: number }>();

    cities.forEach(city => {
      const current = grouped.get(city.region) ?? { cities: [], scoreSum: 0, operational: 0 };
      current.cities.push(city);
      current.scoreSum += city.compositeScore;
      if (city.reality === "operational") current.operational += 1;
      grouped.set(city.region, current);
    });

    return Array.from(grouped.entries())
      .map(([region, summary]) => {
        const topCity = sortCities(summary.cities)[0];

        return {
          region,
          total: summary.cities.length,
          operational: summary.operational,
          avgScore: Number((summary.scoreSum / summary.cities.length).toFixed(1)),
          topCity,
        };
      })
      .sort((left, right) => right.avgScore - left.avgScore);
  }, [cities]);

  return (
    <div className="dashboard-home">
      {/* ─── CINEMATIC HERO ─── */}
      <section ref={heroRef} className={`cinematic-hero reveal ${heroVisible ? "visible" : ""}`}>
        <img
          src="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1920&h=900&fit=crop&q=80"
          alt="Bangkok skyline aerial view at dusk"
          className="cinematic-hero-img"
        />
        <div className="cinematic-hero-overlay">
          <p className="cinematic-hero-eyebrow">SCITI 2026 — {translate(locale, { en: "pronounced \"City\"", th: "อ่านว่า \"ซิตี้\"", zh: "读作 \"City\"" })}</p>
          <h1 className="cinematic-hero-title">
            {locale === "th"
              ? <>เอาความจริง<br />ไม่เอาพิธีตัดริบบิ้น</>
              : locale === "zh"
                ? <>看现实<br />不看剪彩</>
                : <>Reality, not<br />ribbon&#8209;cutting.</>}
          </h1>
          <p className="cinematic-hero-why">
            {translate(locale, {
              en: "Thailand has certified 37 smart cities. But how many of them actually work? This index exists because the gap between announcements and outcomes needed measuring. We score cities on what citizens experience — not what got presented on a slide deck.",
              th: "ประเทศไทยรับรองเมืองอัจฉริยะ 37 เมือง แต่มีกี่เมืองที่ทำงานได้จริง? ดัชนีนี้มีอยู่เพราะช่องว่างระหว่างคำประกาศกับผลลัพธ์ต้องถูกวัด เราให้คะแนนเมืองจากสิ่งที่ประชาชนสัมผัสได้จริง ไม่ใช่สิ่งที่ถูกนำเสนอบนสไลด์",
              zh: "泰国已认证37座智慧城市。但其中有多少真正在运转？这个指数的存在，是因为公告与结果之间的差距需要被衡量。我们根据市民的真实体验来评分——而不是幻灯片上展示的内容。",
            })}
          </p>
          <div className="cinematic-hero-stats">
            <span>{stats.total} {locale === "th" ? "เมือง" : "cities"}</span>
            <span>{stats.operational} {locale === "th" ? "ใช้งานจริง" : "operational"}</span>
            <span>{stats.certified} {locale === "th" ? "รับรอง" : "certified"}</span>
            <span>{stats.alpha} Alpha</span>
          </div>
          <div className="cinematic-hero-actions">
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>
              {translate(locale, { en: "Open full rankings", th: "เปิดอันดับทั้งหมด", zh: "打开完整排名" })}
            </button>
            <button className="ghost-button cinematic-ghost" onClick={() => onNavigate("/methodology")}>
              {translate(locale, { en: "Methodology", th: "วิธีการ", zh: "方法论" })}
            </button>
            <a href="/downloads/SCITI-2026-Report.pdf" download className="ghost-button cinematic-ghost">
              {translate(locale, { en: "Download PDF", th: "ดาวน์โหลด PDF", zh: "下载PDF" })}
            </a>
          </div>
        </div>
      </section>

      {/* ─── HOW TO READ THIS ─── */}
      <section ref={guideRef} className={`guide-strip reveal stagger-1 ${guideVisible ? "visible" : ""}`}>
        <div className="guide-strip-inner">
          <p className="guide-item">
            <strong>{translate(locale, { en: "Score 0\u2013100", th: "คะแนน 0\u2013100", zh: "0\u2013100 分" })}</strong>
            {translate(locale, {
              en: " \u2014 higher means more built, more lived-in, more real. Not plans. Outcomes.",
              th: " \u2014 ยิ่งสูง ยิ่งสร้างจริง ยิ่งมีคนอยู่ ยิ่งจริง ไม่ใช่แผน แต่คือผลลัพธ์",
              zh: " \u2014 越高 = 越真实建成、越有人居住。不是规划，而是结果。",
            })}
          </p>
          <p className="guide-item">
            <strong>Alpha</strong> {translate(locale, { en: "\u2265 65 operational", th: "\u2265 65 ใช้งานจริง", zh: "\u2265 65 真实运行" })}
            {" \u00b7 "}
            <strong>Beta</strong> {translate(locale, { en: "45\u201364 building", th: "45\u201364 กำลังสร้าง", zh: "45\u201364 建设中" })}
            {" \u00b7 "}
            <strong>Gamma</strong> {translate(locale, { en: "< 45 planning", th: "< 45 วางแผน", zh: "< 45 规划阶段" })}
          </p>
          <p className="guide-item">
            {translate(locale, {
              en: "Each bar = one pillar. Click any city to see the full breakdown, evidence, financial toolkit, and what to do next.",
              th: "แต่ละแท่ง = หนึ่งเสาหลัก คลิกเมืองใดก็ได้เพื่อดูรายละเอียด หลักฐาน เครื่องมือการเงิน และสิ่งที่ควรทำต่อ",
              zh: "每根柱 = 一个维度。点击任意城市，查看完整拆解、证据、融资工具和下一步行动。",
            })}
          </p>
        </div>
      </section>


      <section ref={rankingRef} className={`dashboard-panel dashboard-ranking-panel reveal stagger-2 ${rankingVisible ? "visible" : ""}`}>
        <div className="fieldboard-header">
          <h2 className="fieldboard-title">
            {translate(locale, { en: "Fieldboard", th: "กระดานสนามจริง", zh: "现场看板" })}
          </h2>
          <span className="fieldboard-count">
            {previewCities.length} {translate(locale, { en: "cities", th: "เมือง", zh: "城市" })}
          </span>
        </div>

        <div className="dashboard-controls">
          <div className="dashboard-control-group">
            <button className={`filter-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
              {translate(locale, { en: "All", th: "ทั้งหมด", zh: "全部" })}
            </button>
            <button className={`filter-btn ${statusFilter === "certified" ? "active" : ""}`} onClick={() => setStatusFilter("certified")}>
              {translate(locale, { en: "Certified", th: "รับรอง", zh: "认证" })}
            </button>
            <button className={`filter-btn ${statusFilter === "promotion" ? "active" : ""}`} onClick={() => setStatusFilter("promotion")}>
              {translate(locale, { en: "Promotion", th: "เขตส่งเสริม", zh: "推广区" })}
            </button>
          </div>
          <div className="dashboard-control-group">
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

        {/* ─── PILLAR LEGEND + BARS (animated) ─── */}
        <div ref={barsRef} className={barsVisible ? "bar-animate" : ""}>
        <div className="pillar-legend">
          {SCORING_PILLARS.map(p => (
            <span key={p} className="legend-item">
              <span className="legend-dot" style={{ background: PILLAR_COLORS[p] }} />
              {PILLAR_SHORT_LABELS[locale][p]}
            </span>
          ))}
        </div>

        {/* ─── PODIUM: #1 hero + #2–#5 grid ─── */}
        {previewCities.length >= 5 && (() => {
          const top5 = previewCities.slice(0, 5);
          const leader = top5[0];

          // City hero photos + key stats
          const cityPhotos: Record<string, string> = {
            phuket: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=900&h=500&fit=crop&q=80",
            samyan: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=340&fit=crop&q=80",
            "chiang-mai-old-town": "/Chiang Mai/IMG_20251218_190749854.jpg",
            "khon-kaen": "/Khon Kaen/IMG_4264.JPG",
            "cmu-smart-city": "/CMU Smart City/P1210289.JPG",
          };
          const cityQuickStats: Record<string, string[]> = {
            phuket: ["GPP ฿492K/capita", "PM2.5 18.2 μg/m³", "88% hospitality", "72% digital adoption"],
            samyan: ["GPP ฿628K/capita", "200+ startups", "82% digital score", "5G testbed live"],
            "chiang-mai-old-town": ["300+ temple sensors", "PM2.5 46.1 μg/m³", "92% hospitality", "50+ AQ stations"],
            "khon-kaen": ["LRT under construction", "Smart bus running", "GPP ฿155K/capita", "6 hospital network"],
            "cmu-smart-city": ["30% energy reduction", "12 AI intersections", "500+ open datasets", "80% digital"],
          };

          return (
            <div className="podium-photo-layout">
              {/* #1 — Phuket: large photo card */}
              <button
                type="button"
                className="podium-photo-leader"
                role="link"
                aria-label={`01: ${getCityName(leader, locale)}, ${leader.compositeScore.toFixed(1)}`}
                onClick={() => onNavigate(`/city/${leader.id}`)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(`/city/${leader.id}`); } }}
              >
                {cityPhotos[leader.id] && (
                  <img src={cityPhotos[leader.id]} alt={getCityName(leader, locale)} className="podium-photo-img" loading="eager" />
                )}
                <div className="podium-photo-overlay">
                  <div className="podium-photo-top">
                    <div>
                      <div className="podium-rank">01</div>
                      <h3 className="podium-photo-name">{getCityName(leader, locale)}</h3>
                    </div>
                    <div className="podium-photo-scoreblock">
                      <div className="podium-photo-score">{leader.compositeScore.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="podium-photo-stats">
                    {(cityQuickStats[leader.id] ?? []).map((stat, i) => (
                      <span key={i} className="podium-photo-stat">{stat}</span>
                    ))}
                  </div>
                  <div className="podium-photo-vibe">
                    {getCityVibe(leader, locale)}
                  </div>
                  <div className="podium-bars">
                    {SCORING_PILLARS.map(p => (
                      <div key={p} className="podium-bar-track">
                        <div className="podium-bar-fill" style={{ width: `${leader.scores[p]}%`, background: PILLAR_COLORS[p] }}><span className="bar-score-label">{leader.scores[p]}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </button>

              {/* #2–#5 grid of smaller photo cards */}
              <div className="podium-photo-grid">
                {top5.slice(1).map((city, i) => (
                  <button
                    key={city.id}
                    type="button"
                    className="podium-photo-card"
                    role="link"
                    aria-label={`${String(i + 2).padStart(2, "0")}: ${getCityName(city, locale)}, ${city.compositeScore.toFixed(1)}`}
                    onClick={() => onNavigate(`/city/${city.id}`)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(`/city/${city.id}`); } }}
                  >
                    {cityPhotos[city.id] && (
                      <img src={cityPhotos[city.id]} alt={getCityName(city, locale)} className="podium-photo-card-img" loading="lazy" />
                    )}
                    <div className="podium-photo-card-overlay">
                      <div className="podium-rank">{String(i + 2).padStart(2, "0")}</div>
                      <h3 className="podium-photo-card-name">{getCityName(city, locale)}</h3>
                      <div className="podium-photo-card-score">{city.compositeScore.toFixed(1)}</div>
                      <div className="podium-photo-card-stats">
                        {(cityQuickStats[city.id] ?? []).slice(0, 2).map((stat, j) => (
                          <span key={j} className="podium-photo-stat">{stat}</span>
                        ))}
                      </div>
                      <span className={`podium-photo-card-vibe dashboard-ranking-vibe-${city.reality}`}>
                        {getCityVibe(city, locale)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ─── REST AS COMPACT ROWS ─── */}
        <div className="dashboard-ranking-list">
          {previewCities.slice(5).map((city, index) => (
            <RankingRow key={city.id} city={city} locale={locale} onNavigate={onNavigate} rank={index + 6} />
          ))}
        </div>
        </div>{/* close bar-animate wrapper */}
      </section>

      {/* ═══ CONTROL TOWER — Dense, data-rich, every pixel earns its keep ═══ */}
      <section ref={ctRef} className={`ct reveal stagger-3 ${ctVisible ? "visible" : ""}`}>
        {/* Top bar with Bangkok clock */}
        <div className="ct-bar">
          <span className="ct-bar-label">SCITI CONTROL TOWER</span>
          <span className="ct-bar-stats">
            {stats.total} {translate(locale, { en: "cities", th: "เมือง", zh: "城市" })} · {stats.operational} {translate(locale, { en: "operational", th: "ใช้งานจริง", zh: "运行中" })} · {stats.alpha} Alpha
          </span>
          <BangkokClock />
          <span className="ct-bar-live"><span className="ct-dot" /> LIVE</span>
        </div>

        <div className="ct-grid">
          {/* ─── LEFT: Inline map ─── */}
          <div className="ct-map-col">
            <svg viewBox={`0 0 ${MINI_MAP_W} ${MINI_MAP_H}`} className="ct-map-svg">
              {/* Grid */}
              {[...Array(6)].map((_, i) => (
                <line key={`g${i}`} x1="0" y1={(i + 1) * (MINI_MAP_H / 7)} x2={MINI_MAP_W} y2={(i + 1) * (MINI_MAP_H / 7)} stroke="rgba(255,255,255,.04)" strokeWidth="0.5" />
              ))}
              {/* Cities */}
              {cities.map(city => {
                const coords = mapCityCoords[city.id];
                if (!coords) return null;
                const { x, y } = miniProject(coords.lat, coords.lng);
                const c = city.tier === "alpha" ? "#1A9A82" : city.tier === "beta" ? "#C49A2A" : "#B03030";
                return (
                  <circle key={city.id} cx={x} cy={y} r={city.status === "certified" ? 4 : 2.5}
                    fill={c} opacity={0.85} style={{ cursor: "pointer" }}
                    onClick={() => onNavigate(`/city/${city.id}`)}>
                    <title>{getCityName(city, locale)} {city.compositeScore.toFixed(1)}</title>
                  </circle>
                );
              })}
            </svg>
            {/* Map legend inline */}
            <div className="ct-map-legend">
              <span><span className="ct-ldot" style={{ background: "#1A9A82" }} /> Alpha ≥65</span>
              <span><span className="ct-ldot" style={{ background: "#C49A2A" }} /> Beta 45–64</span>
              <span><span className="ct-ldot" style={{ background: "#B03030" }} /> Gamma &lt;45</span>
            </div>
          </div>

          {/* ─── MIDDLE: Regional signal + key metrics ─── */}
          <div className="ct-mid-col">
            <span className="ct-col-label">REGIONAL SIGNAL</span>
            {regionPulse.map(region => (
              <div key={region.region} className="ct-rr">
                <span className="ct-rr-name">{REGION_LABELS[region.region][locale]}</span>
                <div className="ct-rr-bar"><div style={{ width: `${region.avgScore}%`, background: "#1A9A82", height: "100%" }} /></div>
                <span className="ct-rr-score">{region.avgScore.toFixed(1)}</span>
                <span className="ct-rr-meta">{region.operational}/{region.total}</span>
              </div>
            ))}
            <div className="ct-key-metrics">
              <div className="ct-km"><span className="ct-km-val">{stats.certified}</span><span className="ct-km-lab">Certified</span></div>
              <div className="ct-km"><span className="ct-km-val">173+</span><span className="ct-km-lab">Promotion</span></div>
              <div className="ct-km"><span className="ct-km-val">7</span><span className="ct-km-lab">Dimensions</span></div>
              <div className="ct-km"><span className="ct-km-val">15+</span><span className="ct-km-lab">Data src</span></div>
            </div>
          </div>

          {/* ─── RIGHT: Live feeds ─── */}
          <div className="ct-right-col">
            <span className="ct-col-label">DATA FEEDS</span>
            {[
              { label: "Air4Thai", val: "70+ stn", freq: "1h", url: "http://air4thai.pcd.go.th" },
              { label: "citydata.in.th", val: `${stats.certified + 173}+ cities`, freq: "RT", url: "https://www.citydata.in.th" },
              { label: "GISTDA", val: "Satellite", freq: "Q", url: "https://sphere.gistda.or.th" },
              { label: "TMD IoT", val: "Weather", freq: "1h", url: "https://iot.tmd.go.th" },
              { label: "data.go.th", val: "Open API", freq: "CKAN", url: "https://data.go.th" },
              { label: "NESDC", val: "GPP/prov", freq: "Y", url: "https://www.nesdc.go.th" },
              { label: "NSO", val: "Census", freq: "Y", url: "https://www.nso.go.th" },
              { label: "BOI", val: "FDI", freq: "Q", url: "https://ipstat.boi.go.th/" },
            ].map(f => (
              <a key={f.label} href={f.url} target="_blank" rel="noopener noreferrer" className="ct-fd">
                <span className="ct-fd-name">{f.label}</span>
                <span className="ct-fd-val">{f.val}</span>
                <span className="ct-fd-freq">{f.freq}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTITUTIONAL FINE PRINT ─── */}
      <section ref={fineprintRef} className={`dashboard-fineprint reveal ${fineprintVisible ? "visible" : ""}`}>
        <div className="dashboard-fineprint-inner">
          <div className="dashboard-fp-col">
            <span className="dashboard-fp-label">{translate(locale, { en: "Standards", th: "มาตรฐาน", zh: "标准" })}</span>
            <p>{translate(locale, {
              en: "UN-Habitat CPI · ISO 37122:2019 · SDG 11 · ASEAN Smart Cities Framework 2018 · ASCAP 2021–2025 · New Urban Agenda 2016 · Thailand PPP Act B.E. 2562",
              th: "UN-Habitat CPI · ISO 37122:2019 · SDG 11 · กรอบ ASCF 2018 · ASCAP 2021–2025 · New Urban Agenda 2016 · พ.ร.บ. PPP 2562",
              zh: "UN-Habitat CPI · ISO 37122:2019 · SDG 11 · ASCF 2018 · ASCAP 2021–2025 · 新城市议程 2016",
            })}</p>
          </div>
          <div className="dashboard-fp-col">
            <span className="dashboard-fp-label">{translate(locale, { en: "Data sources", th: "แหล่งข้อมูล", zh: "数据来源" })}</span>
            <p>NSO · NESDC · PCD · GISTDA · World Bank · ADB · Open-Meteo · Royal Thai Police · DOPA · depa · MOPH · BOI · ONEP</p>
          </div>
          <div className="dashboard-fp-col">
            <span className="dashboard-fp-label">{translate(locale, { en: "Legal", th: "กฎหมาย", zh: "法律" })}</span>
            <p>{translate(locale, {
              en: "© 2026 depa, MDES, Kingdom of Thailand · SLIC methodology · CC BY 4.0 · Scores reflect conditions at time of assessment · Not investment advice · SCITI-2026-R1",
              th: "© 2026 depa กระทรวง DE ราชอาณาจักรไทย · วิธีการ SLIC · CC BY 4.0 · คะแนนสะท้อนสภาพ ณ เวลาประเมิน · ไม่ใช่คำแนะนำการลงทุน · SCITI-2026-R1",
              zh: "© 2026 depa MDES 泰王国 · SLIC方法论 · CC BY 4.0 · 评分反映评估时状况 · 非投资建议 · SCITI-2026-R1",
            })}</p>
          </div>
          <div className="dashboard-fp-col">
            <span className="dashboard-fp-label">{translate(locale, { en: "Accessibility", th: "การเข้าถึง", zh: "无障碍" })}</span>
            <p>{translate(locale, {
              en: "WCAG 2.1 AA · Keyboard navigable · Trilingual (EN/TH/ZH) · Screen reader compatible · Focus-visible indicators",
              th: "WCAG 2.1 AA · นำทางด้วยคีย์บอร์ด · 3 ภาษา (EN/TH/ZH) · รองรับ screen reader · ตัวบ่งชี้ focus-visible",
              zh: "WCAG 2.1 AA · 键盘导航 · 三语 (EN/TH/ZH) · 屏幕阅读器兼容 · 焦点指示器",
            })}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
