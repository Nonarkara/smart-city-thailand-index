import { useMemo, useState } from "react";
import { allCities, getCityById, promotionZoneCities } from "./cityData";
import { filterCities, getSpotlightCities, sortCities, summarizeCities } from "./cityCollections";
import {
  getCityName,
  getCityRealityLabel,
  getCityStatusLabel,
  getCityTagline,
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

const REGION_LABELS: Record<SmartCity["region"], { en: string; th: string; zh: string }> = {
  bangkok: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
  central: { en: "Central", th: "ภาคกลาง", zh: "中部" },
  east: { en: "East", th: "ภาคตะวันออก", zh: "东部" },
  north: { en: "North", th: "ภาคเหนือ", zh: "北部" },
  northeast: { en: "Northeast", th: "อีสาน", zh: "东北部" },
  south: { en: "South", th: "ภาคใต้", zh: "南部" },
};

function DashboardMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="dashboard-metric-card">
      <span className="dashboard-metric-value">{value}</span>
      <span className="dashboard-metric-label">{label}</span>
    </div>
  );
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
            <div className="dashboard-ranking-bar-fill" style={{ width: `${city.scores[p]}%`, background: PILLAR_COLORS[p] }} />
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

function SpotlightRow({
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
  return (
    <button
      type="button"
      className="dashboard-spotlight-row"
      onClick={() => onNavigate(`/city/${city.id}`)}
    >
      <span className="dashboard-spotlight-rank">{String(rank).padStart(2, "0")}</span>
      <div className="dashboard-spotlight-copy">
        <span className="dashboard-spotlight-name">{getCityName(city, locale)}</span>
        <span className="dashboard-spotlight-meta">
          {TIER_LABELS[locale][city.tier]} · {getCityRealityLabel(city.reality, locale)}
        </span>
      </div>
      <span className="dashboard-spotlight-score">{city.compositeScore.toFixed(1)}</span>
    </button>
  );
}

function SignalCard({
  title,
  city,
  locale,
  onNavigate,
  tone,
  note,
}: {
  title: string;
  city: SmartCity;
  locale: Locale;
  onNavigate: (path: string) => void;
  tone: "good" | "watch" | "risk";
  note: string;
}) {
  return (
    <button
      type="button"
      className={`dashboard-signal-card dashboard-signal-card-${tone}`}
      onClick={() => onNavigate(`/city/${city.id}`)}
    >
      <span className="dashboard-signal-kicker">{title}</span>
      <div className="dashboard-signal-head">
        <strong>{getCityName(city, locale)}</strong>
        <span>{city.compositeScore.toFixed(1)}</span>
      </div>
      <p className="dashboard-signal-meta">
        {TIER_LABELS[locale][city.tier]} · {getCityRealityLabel(city.reality, locale)} · {getCityStatusLabel(city.status, locale)}
      </p>
      <p className="dashboard-signal-note">{note}</p>
    </button>
  );
}

/* ─── Photo collage data: all cityscape photos from /photos ─── */
const COLLAGE_PHOTOS = [
  "1-57.jpg", "318402.jpg", "350263.jpg", "350284.jpg",
  "4A2A6179.JPG", "4A2A6250.JPG",
  "578383385.557473.jpg", "593016939.296474.jpg",
  "66438786_2265889173489652_6708326457757663232_o.jpg",
  "72639510_2459479007664540_4785365931712839680_o.jpg",
  "73513755_10157605754953794_5475140449704345600_n.jpg",
  "IMG_0324.JPG", "IMG_0396.JPG", "IMG_0861.JPG", "IMG_0964.JPG",
  "IMG_1089.JPG", "IMG_1382.JPG", "IMG_1447.JPG", "IMG_1457.JPG",
  "IMG_1596.JPG", "IMG_3619.JPG", "IMG_4034.JPG", "IMG_4107.JPG",
  "IMG_4175.JPG", "IMG_4207.JPG", "IMG_4797.JPG", "IMG_5304.JPG",
  "IMG_5849.JPG", "IMG_6065.JPG", "IMG_6426.JPG", "IMG_6482.JPG",
  "IMG_6508.JPG", "IMG_6654.JPG", "IMG_6691.JPG", "IMG_6692.JPG",
  "IMG_7331.JPG", "IMG_7504.JPG", "IMG_7607.JPG", "IMG_7613.JPG",
  "IMG_7649.JPG", "IMG_7760.JPG", "IMG_7761.JPG", "IMG_9995.JPG",
  "OI000016.JPG", "P6204927.JPG", "P6205097.JPG", "SWP_8806.JPG",
  "_K635402.jpg", "d49adab4-a786-4fcb-922c-39883728de7f.jpg",
  "depa x korea SBAU2019.jpg",
  "f40e0bd32c239122ed14b39d13bc3c53.jpg", "f4b929dc011fb96fba76c9618ca6b93e.jpg",
];

const SHUFFLED_ROWS = (() => {
  const shuffled = [...COLLAGE_PHOTOS].sort(() => Math.random() - 0.5);
  const perRow = Math.ceil(shuffled.length / 4);
  return [
    shuffled.slice(0, perRow),
    shuffled.slice(perRow, perRow * 2),
    shuffled.slice(perRow * 2, perRow * 3),
    shuffled.slice(perRow * 3),
  ];
})();

/** Infinite scrolling photo collage — 4 rows moving in alternating directions */
function CollageStrip() {
  const rows = SHUFFLED_ROWS;

  return (
    <div className="collage-strip" aria-hidden="true">
      {rows.map((photos, i) => (
        <div
          key={i}
          className={`collage-row collage-row-${i % 2 === 0 ? "left" : "right"}`}
        >
          {/* Duplicate for seamless loop */}
          {[...photos, ...photos].map((p, j) => (
            <img
              key={`${i}-${j}`}
              src={`/photos/${p}`}
              alt=""
              className="collage-thumb"
              loading="lazy"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HomePage({ locale, onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState<"all" | "certified" | "promotion">("all");
  const [tierFilter, setTierFilter] = useState<"all" | CityTier>("all");

  const stats = useMemo(() => summarizeCities(allCities), []);
  const spotlightCities = useMemo(() => getSpotlightCities(allCities, 5), []);
  const previewCities = useMemo(() => {
    return sortCities(
      filterCities(allCities, {
        status: statusFilter,
        tier: tierFilter,
      }),
    ).slice(0, 24);
  }, [statusFilter, tierFilter]);

  const regionPulse = useMemo(() => {
    const grouped = new Map<SmartCity["region"], { cities: SmartCity[]; scoreSum: number; operational: number }>();

    allCities.forEach(city => {
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
  }, []);

  const operationalLeader = useMemo(() => {
    return sortCities(allCities.filter(city => city.reality === "operational"))[0];
  }, []);

  const promotionLeader = useMemo(() => {
    return sortCities(promotionZoneCities)[0];
  }, []);

  const realityGapCity = useMemo(() => {
    return getCityById("wangchan-valley") ?? sortCities(allCities.filter(city => city.reality === "planned"))[0];
  }, []);

  const realityCounts = useMemo(() => {
    return {
      operational: allCities.filter(city => city.reality === "operational").length,
      partial: allCities.filter(city => city.reality === "partial").length,
      planned: allCities.filter(city => city.reality === "planned").length,
    };
  }, []);

  return (
    <div className="dashboard-home">
      {/* ─── DATA-FORWARD HERO ─── */}
      <section className="dashboard-panel dashboard-hero-panel data-hero">
        <div className="data-hero-inner">
          <div className="data-hero-text">
            <p className="eyebrow">
              {translate(locale, {
                en: "SCTI · 2026 dashboard",
                th: "SCTI · แดชบอร์ด 2026",
                zh: "SCTI · 2026 仪表盘",
              })}
            </p>
            <h1 className="data-hero-title">
              {translate(locale, {
                en: "Reality, not ribbon-cutting.",
                th: "เอาความจริง ไม่เอาพิธีตัดริบบิ้น",
                zh: "看现实，不看剪彩。",
              })}
            </h1>
            <p className="data-hero-sub">
              {translate(locale, {
                en: "The Thai city fieldboard. Live tiers, hard filters, and the places that survive contact with the street.",
                th: "กระดานสนามจริงของเมืองไทย ชั้นคะแนน ตัวกรอง และเมืองที่ยังรอดเมื่อเจอของจริงบนถนน",
                zh: "泰国城市现场看板。真实分层、硬过滤，以及经得住街头检验的城市。",
              })}
            </p>
            <div className="dashboard-action-row">
              <button className="cta-button" onClick={() => onNavigate("/rankings")}>
                {translate(locale, { en: "Open full rankings", th: "เปิดอันดับทั้งหมด", zh: "打开完整排名" })}
              </button>
              <button className="ghost-button" onClick={() => onNavigate("/methodology")}>
                {translate(locale, { en: "Methodology", th: "วิธีการ", zh: "方法论" })}
              </button>
            </div>
          </div>
          <div className="data-hero-stats">
            <DashboardMetric label={translate(locale, { en: "Cities", th: "เมือง", zh: "城市" })} value={stats.total} />
            <DashboardMetric label={translate(locale, { en: "Operational", th: "ใช้งานจริง", zh: "运行中" })} value={stats.operational} />
            <DashboardMetric label={translate(locale, { en: "Certified", th: "รับรอง", zh: "认证" })} value={stats.certified} />
            <DashboardMetric label={translate(locale, { en: "Alpha", th: "Alpha", zh: "Alpha" })} value={stats.alpha} />
          </div>
        </div>
      </section>

      <section className="dashboard-panel dashboard-ranking-panel">
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

        {/* ─── PILLAR LEGEND ─── */}
        <div className="pillar-legend">
          {SCORING_PILLARS.map(p => (
            <span key={p} className="legend-item">
              <span className="legend-dot" style={{ background: PILLAR_COLORS[p] }} />
              {PILLAR_SHORT_LABELS[locale][p]}
            </span>
          ))}
        </div>

        {/* ─── PODIUM: #1 hero + #2 #3 flanking ─── */}
        {previewCities.length >= 3 && (() => {
          const top3 = previewCities.slice(0, 3);
          const leader = top3[0];
          return (
            <div className="podium-layout">
              {/* #1 — dominant card */}
              <button
                type="button"
                className="podium-leader"
                onClick={() => onNavigate(`/city/${leader.id}`)}
              >
                <div className="podium-leader-top">
                  <div>
                    <div className="podium-rank">01</div>
                    <h3 className="podium-leader-name">{getCityName(leader, locale)}</h3>
                    <span className="podium-leader-province">{getProvinceName(leader, locale)}</span>
                  </div>
                  <div className="podium-leader-scoreblock">
                    <div className="podium-leader-score">{leader.compositeScore.toFixed(1)}</div>
                    <span className={`dashboard-ranking-vibe dashboard-ranking-vibe-${leader.reality}`}>
                      {getCityVibe(leader, locale)}
                    </span>
                  </div>
                </div>
                <div className="podium-bars podium-leader-bars">
                  {SCORING_PILLARS.map(p => (
                    <div key={p} className="podium-bar-track">
                      <div className="podium-bar-fill" style={{ width: `${leader.scores[p]}%`, background: PILLAR_COLORS[p] }} />
                    </div>
                  ))}
                </div>
              </button>

              {/* #2 and #3 — compact flanking cards */}
              <div className="podium-runners">
                {top3.slice(1).map((city, i) => (
                  <button
                    key={city.id}
                    type="button"
                    className="podium-card"
                    onClick={() => onNavigate(`/city/${city.id}`)}
                  >
                    <div className="podium-rank">{String(i + 2).padStart(2, "0")}</div>
                    <h3 className="podium-name">{getCityName(city, locale)}</h3>
                    <div className="podium-score">{city.compositeScore.toFixed(1)}</div>
                    <div className="podium-bars">
                      {SCORING_PILLARS.map(p => (
                        <div key={p} className="podium-bar-track">
                          <div className="podium-bar-fill" style={{ width: `${city.scores[p]}%`, background: PILLAR_COLORS[p] }} />
                        </div>
                      ))}
                    </div>
                    <div className="podium-meta">
                      <span>{getProvinceName(city, locale)}</span>
                      <span className={`dashboard-ranking-vibe dashboard-ranking-vibe-${city.reality}`}>
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
          {previewCities.slice(3).map((city, index) => (
            <RankingRow key={city.id} city={city} locale={locale} onNavigate={onNavigate} rank={index + 4} />
          ))}
        </div>
      </section>

      <section className="dashboard-panel dashboard-spotlight-panel">
        <div className="dashboard-panel-head">
          <div>
            <p className="dashboard-kicker">
              {translate(locale, { en: "Lead signals", th: "สัญญาณนำ", zh: "领先信号" })}
            </p>
            <h2>
              {translate(locale, { en: "Cities worth opening first", th: "เมืองที่ควรเปิดดูก่อน", zh: "最值得先点开的城市" })}
            </h2>
          </div>
        </div>

        <div className="dashboard-spotlight-list">
          {spotlightCities.map((city, index) => (
            <SpotlightRow key={city.id} city={city} locale={locale} onNavigate={onNavigate} rank={index + 1} />
          ))}
        </div>

        <div className="dashboard-reality-strip">
          <span className="dashboard-reality-chip dashboard-reality-chip-operational">
            {realityCounts.operational} {translate(locale, { en: "operational", th: "ใช้งานจริง", zh: "已运行" })}
          </span>
          <span className="dashboard-reality-chip dashboard-reality-chip-partial">
            {realityCounts.partial} {translate(locale, { en: "partial", th: "บางส่วน", zh: "部分落实" })}
          </span>
          <span className="dashboard-reality-chip dashboard-reality-chip-planned">
            {realityCounts.planned} {translate(locale, { en: "plan only", th: "แผนล้วน", zh: "仅有规划" })}
          </span>
        </div>
      </section>

      <section className="dashboard-panel dashboard-region-panel">
        <div className="dashboard-panel-head">
          <div>
            <p className="dashboard-kicker">
              {translate(locale, { en: "Regional spread", th: "ภาพรวมรายภูมิภาค", zh: "区域分布" })}
            </p>
            <h2>
              {translate(locale, { en: "Where the signal is strongest", th: "สัญญาณแรงสุดอยู่ตรงไหน", zh: "哪里信号最强" })}
            </h2>
          </div>
        </div>

        <div className="dashboard-region-list">
          {regionPulse.map(region => (
            <div key={region.region} className="dashboard-region-row">
              <div className="dashboard-region-head">
                <strong>{REGION_LABELS[region.region][locale]}</strong>
                <span>{region.avgScore.toFixed(1)}</span>
              </div>
              <div className="dashboard-region-track">
                <div className="dashboard-region-fill" style={{ width: `${region.avgScore}%` }} />
              </div>
              <div className="dashboard-region-meta">
                <span>
                  {region.total} {translate(locale, { en: "cities", th: "เมือง", zh: "城市" })} · {region.operational}{" "}
                  {translate(locale, { en: "live", th: "ใช้งานจริง", zh: "真实运行" })}
                </span>
                <button type="button" className="dashboard-region-link" onClick={() => onNavigate(`/city/${region.topCity.id}`)}>
                  {getCityName(region.topCity, locale)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-panel dashboard-signal-panel">
        <div className="dashboard-panel-head">
          <div>
            <p className="dashboard-kicker">
              {translate(locale, { en: "Reality checks", th: "เช็กความจริง", zh: "现实校验" })}
            </p>
            <h2>
              {translate(locale, { en: "Three quick reads", th: "สามเรื่องที่ควรดู", zh: "三个快速判断" })}
            </h2>
          </div>
        </div>

        <div className="dashboard-signal-stack">
          {operationalLeader && (
            <SignalCard
              title={translate(locale, { en: "Operational leader", th: "ผู้นำที่วิ่งจริง", zh: "真实运行领跑者" })}
              city={operationalLeader}
              locale={locale}
              onNavigate={onNavigate}
              tone="good"
              note={translate(locale, {
                en: getCityTagline(operationalLeader, locale),
                th: getCityTagline(operationalLeader, locale),
                zh: getCityTagline(operationalLeader, locale),
              })}
            />
          )}
          {promotionLeader && (
            <SignalCard
              title={translate(locale, { en: "Best promotion zone", th: "เขตส่งเสริมที่ดูดีที่สุด", zh: "最佳推广区" })}
              city={promotionLeader}
              locale={locale}
              onNavigate={onNavigate}
              tone="watch"
              note={translate(locale, {
                en: "The strongest thing still outside certification. Worth opening before anyone starts bragging.",
                th: "ตัวที่แข็งสุดในกลุ่มนอกการรับรอง ควรเปิดดูก่อนที่ใครจะเริ่มโม้",
                zh: "认证之外最强的一座。有人开始吹之前，先点开看。",
              })}
            />
          )}
          {realityGapCity && (
            <SignalCard
              title={translate(locale, { en: "Reality gap", th: "ช่องว่างระหว่างคำพูดกับของจริง", zh: "现实落差" })}
              city={realityGapCity}
              locale={locale}
              onNavigate={onNavigate}
              tone="risk"
              note={translate(locale, {
                en: "Big branding, weak street-level evidence. Exactly the kind of fake precision this index is meant to kill.",
                th: "แบรนด์ใหญ่ แต่หลักฐานระดับถนนยังบาง นี่แหละของปลอมที่ดัชนีนี้ตั้งใจฆ่า",
                zh: "品牌很大，街头证据很薄。这正是假精确最该被干掉的地方。",
              })}
            />
          )}
        </div>
      </section>
    </div>
  );
}
