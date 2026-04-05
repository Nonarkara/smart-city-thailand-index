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
import { getCitySummariesCsv, getCityFactsCsv } from "./cityCdp";
import { PILLAR_WEIGHTS } from "./types";

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

      {/* ═══ OPEN DATA: Big CSV Export Buttons ═══ */}
      <section className="open-data-section">
        <div className="open-data-inner">
          <div className="open-data-text">
            <h2 className="open-data-title">
              {translate(locale, { en: "Open data. No gatekeeping.", th: "ข้อมูลเปิด ไม่มีกั้น", zh: "开放数据，不设门槛。" })}
            </h2>
            <p className="open-data-body">
              {translate(locale, {
                en: "Every score, every metric, every source — downloadable. No city lobbied for a higher rank. No investor paid for placement. This is just facts that came in, processed through transparent equations, published under CC BY 4.0. Take the data. Challenge the methodology. Build on it.",
                th: "ทุกคะแนน ทุกตัวชี้วัด ทุกแหล่งข้อมูล — ดาวน์โหลดได้ ไม่มีเมืองไหนล็อบบี้เพื่อขึ้นอันดับ ไม่มีนักลงทุนจ่ายเพื่อตำแหน่ง นี่คือข้อเท็จจริงที่เข้ามา ประมวลผลผ่านสมการที่โปร่งใส เผยแพร่ภายใต้ CC BY 4.0 เอาข้อมูลไปใช้ ท้าทายวิธีการ ต่อยอดได้เลย",
                zh: "每个分数、每项指标、每个来源——都可下载。没有城市游说获取更高排名。没有投资者付费获取位置。这只是事实输入，通过透明方程处理，以CC BY 4.0发布。",
              })}
            </p>
          </div>
          <div className="open-data-buttons">
            <button className="export-btn export-btn-primary" onClick={() => {
              const blob = new Blob([getCitySummariesCsv()], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "sciti-2026-city-summaries.csv"; a.click();
              URL.revokeObjectURL(url);
            }}>
              <span className="export-btn-icon">↓</span>
              <span className="export-btn-text">
                <strong>{translate(locale, { en: "Export All Cities (CSV)", th: "ส่งออกทุกเมือง (CSV)", zh: "导出所有城市 (CSV)" })}</strong>
                <span>{translate(locale, { en: "Scores, tiers, finance signals, confidence", th: "คะแนน ระดับ สัญญาณการเงิน ความเชื่อมั่น", zh: "分数、层级、金融信号、置信度" })}</span>
              </span>
            </button>
            <button className="export-btn" onClick={() => {
              const blob = new Blob([getCityFactsCsv()], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "sciti-2026-city-facts.csv"; a.click();
              URL.revokeObjectURL(url);
            }}>
              <span className="export-btn-icon">↓</span>
              <span className="export-btn-text">
                <strong>{translate(locale, { en: "Export Detailed Facts (CSV)", th: "ส่งออกข้อมูลละเอียด (CSV)", zh: "导出详细事实 (CSV)" })}</strong>
                <span>{translate(locale, { en: "Every metric, every source, every timestamp", th: "ทุกตัวชี้วัด ทุกแหล่ง ทุก timestamp", zh: "每项指标、每个来源、每个时间戳" })}</span>
              </span>
            </button>
            <div className="export-docs">
              <a href="/downloads/SCITI-2026-Executive-Summary.pdf" download className="export-doc-link">Executive Summary (PDF)</a>
              <a href="/downloads/SCITI-2026-Methodology.pdf" download className="export-doc-link">Methodology Paper (PDF)</a>
              <a href="/downloads/SCITI-2026-Report.pdf" download className="export-doc-link">Full Report (PDF)</a>
              <a href="/downloads/SCITI-2026-Audit.pdf" download className="export-doc-link">Performance Audit (PDF)</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRANSPARENCY: How the numbers work ═══ */}
      <section className="transparency-section">
        <div className="transparency-inner">
          <h2>{translate(locale, { en: "How the numbers work", th: "ตัวเลขทำงานอย่างไร", zh: "数字如何运作" })}</h2>
          <div className="transparency-formula">
            <code>Composite = ({SCORING_PILLARS.map(p => `${PILLAR_SHORT_LABELS[locale][p]}×${PILLAR_WEIGHTS[p]}`).join(" + ")}) / 100</code>
          </div>
          <div className="transparency-steps">
            <div className="transparency-step">
              <span className="transparency-step-num">1</span>
              <div>
                <strong>{translate(locale, { en: "Raw data in", th: "ข้อมูลดิบเข้ามา", zh: "原始数据输入" })}</strong>
                <p>{translate(locale, { en: "15+ government sources: NSO, NESDC, PCD, GISTDA, Royal Thai Police, BOI, MOPH. No surveys, no self-reporting. Verifiable public data only.", th: "15+ แหล่งราชการ: NSO, NESDC, PCD, GISTDA, สำนักงานตำรวจแห่งชาติ, BOI, สธ. ไม่มีแบบสอบถาม ไม่มีการรายงานตนเอง ข้อมูลสาธารณะที่ตรวจสอบได้เท่านั้น", zh: "15+政府来源。无问卷，无自我报告。仅可验证的公开数据。" })}</p>
              </div>
            </div>
            <div className="transparency-step">
              <span className="transparency-step-num">2</span>
              <div>
                <strong>{translate(locale, { en: "7 pillars scored 0-100", th: "7 เสาหลัก ให้คะแนน 0-100", zh: "7个支柱评分0-100" })}</strong>
                <p>{translate(locale, { en: "Each pillar converts raw metrics (PM2.5 μg/m³, crime/100K, GPP/capita, beds/10K) into a normalized 0-100 score. Higher = better for citizens.", th: "เสาหลักแต่ละอันแปลงตัวชี้วัดดิบ (PM2.5 μg/m³, อาชญากรรม/100K, GPP/หัว, เตียง/10K) เป็นคะแนน 0-100 ที่ปรับมาตรฐาน สูง = ดีกว่าสำหรับประชาชน", zh: "每个支柱将原始指标转换为标准化的0-100分。越高=对市民越好。" })}</p>
              </div>
            </div>
            <div className="transparency-step">
              <span className="transparency-step-num">3</span>
              <div>
                <strong>{translate(locale, { en: "Weighted composite", th: "ถ่วงน้ำหนักรวม", zh: "加权综合" })}</strong>
                <p>{translate(locale, { en: "Livability 25% because housing and transit matter most. Digital only 5% because tech is a tool, not the goal. Weights sum to 100%. No hidden adjustments.", th: "ความน่าอยู่ 25% เพราะที่อยู่และขนส่งสำคัญที่สุด ดิจิทัลเพียง 5% เพราะเทคเป็นเครื่องมือ ไม่ใช่เป้าหมาย น้ำหนักรวม 100% ไม่มีการปรับที่ซ่อนอยู่", zh: "宜居25%因为住房和交通最重要。数字仅5%因为技术是工具不是目标。权重总和100%。无隐藏调整。" })}</p>
              </div>
            </div>
            <div className="transparency-step">
              <span className="transparency-step-num">4</span>
              <div>
                <strong>{translate(locale, { en: "Tier assignment", th: "จัดระดับ", zh: "层级分配" })}</strong>
                <p>{translate(locale, { en: "Alpha ≥ 65 (operational, citizens feel it). Beta 45-64 (building, gaps remain). Gamma < 45 (mostly plans). Automatic — no committee picks winners.", th: "Alpha ≥ 65 (ใช้งานจริง ประชาชนรู้สึกได้) Beta 45-64 (กำลังสร้าง ยังมีช่องว่าง) Gamma < 45 (ส่วนใหญ่เป็นแผน) อัตโนมัติ — ไม่มีคณะกรรมการเลือกผู้ชนะ", zh: "Alpha≥65(运营中)。Beta 45-64(建设中)。Gamma<45(规划中)。自动分配——无委员会挑选赢家。" })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INVESTOR: Secondary city opportunities ═══ */}
      <section className="investor-section">
        <div className="investor-inner">
          <h2>{translate(locale, { en: "Beyond Bangkok: where the real opportunity is", th: "เหนือกรุงเทพฯ: โอกาสจริงอยู่ตรงไหน", zh: "超越曼谷：真正的机会在哪里" })}</h2>
          <p className="investor-lead">
            {translate(locale, {
              en: "Not every investor needs to pile into Bangkok or Phuket. Thailand's secondary cities offer BOI incentives, lower costs, better air, and less competition — with the same legal protections and digital infrastructure. This index helps match the right capital with the right city.",
              th: "นักลงทุนทุกคนไม่จำเป็นต้องกระจุกในกรุงเทพฯ หรือภูเก็ต เมืองรองของไทยมีสิทธิประโยชน์ BOI ต้นทุนต่ำกว่า อากาศดีกว่า แข่งขันน้อยกว่า — ด้วยการคุ้มครองทางกฎหมายและโครงสร้างพื้นฐานดิจิทัลเท่ากัน ดัชนีนี้ช่วยจับคู่ทุนที่ใช่กับเมืองที่ใช่",
              zh: "不是每个投资者都需要挤进曼谷或普吉。泰国二线城市提供BOI激励、更低成本、更好空气和更少竞争——享有同样的法律保护和数字基础设施。这个指数帮助将合适的资本匹配到合适的城市。",
            })}
          </p>
          <div className="investor-grid">
            {cities.filter(c => c.tier === "beta" && c.reality === "operational" && c.scores.economy >= 55).slice(0, 6).map(city => (
              <button key={city.id} className="investor-card" onClick={() => onNavigate(`/city/${city.id}`)}>
                <span className="investor-card-name">{getCityName(city, locale)}</span>
                <span className="investor-card-score">{city.compositeScore.toFixed(1)}</span>
                <span className="investor-card-province">{getProvinceName(city, locale)}</span>
                <span className="investor-card-vibe">{getCityVibe(city, locale)}</span>
              </button>
            ))}
          </div>
          <p className="investor-cta-text">
            {translate(locale, {
              en: "These are cities with real infrastructure, working governance, and room to grow — not yet Alpha, but building fast. BOI S-Curve incentives apply. EEC adjacency benefits included. Every city profile shows bankability score, financial toolkit, and specific opportunities.",
              th: "เหล่านี้คือเมืองที่มีโครงสร้างพื้นฐานจริง ปกครองใช้ได้ และมีพื้นที่เติบโต — ยังไม่ Alpha แต่สร้างเร็ว สิทธิประโยชน์ BOI S-Curve ใช้ได้ ประโยชน์ EEC ใกล้เคียงรวม โปรไฟล์ทุกเมืองแสดงคะแนนความพร้อมทางการเงิน ชุดเครื่องมือการเงิน และโอกาสเฉพาะ",
              zh: "这些城市拥有真实基础设施、运转中的治理体系和增长空间——尚未达到Alpha但建设迅速。BOI S-Curve激励适用。EEC邻近利益包含在内。",
            })}
          </p>
        </div>
      </section>

      {/* ─── FINE PRINT ─── */}
      <section ref={fineprintRef} className={`dashboard-fineprint reveal visible`}>
        <div className="dashboard-fineprint-inner">
           <p>© 2026 depa, MDES, Kingdom of Thailand · SLIC Methodology · CC BY 4.0 · No city lobbied for rank · No investor paid for placement · SCITI-2026-R1</p>
        </div>
      </section>
    </div>
  );
}
