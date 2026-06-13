import { useMemo, useState, useEffect } from "react";
// ActionAtlas removed — map was ugly, data speaks for itself
import { useInView } from "./useInView";
import NewsStrip from "./NewsStrip";
import { useCitySummaries } from "./cityApi";
import { summarizeCities } from "./cityCollections";
import { getCityPhotoAsset, HOME_HERO_ASSETS, type HeroAsset } from "./cityMedia";
import {
  getCityName,
  getProvinceName,
  translate,
} from "./cityPresentation";
import type { Locale, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS } from "./types";
import { SCORING_PILLARS } from "./scoring";
import { getCitySummariesCsv, getCityFactsCsv } from "./cityCdp";
import { ResponsiveImage } from "./mediaAssets";
import { assetUrl } from "./assetUtils";
import { PILLAR_WEIGHTS } from "./types";
import { HOME_COLLECTIONS } from "./homeCollections";
import { CDP_PLATFORM_COUNT, EVIDENCE_SOURCE_FAMILY_COUNT, SCITI_METHOD_CODE } from "./methodologySpec";
import { WEEKLY_DIGEST, formatWeeklyStamp } from "./weeklyDigest";
import { REGIONS_ORDERED, REGION_LABELS, type Region } from "./regions";

/** Short, unique vibe phrase per city — used by the top-5 podium. */
function getCityVibe(city: SmartCity, locale: Locale): string {
  const pillars = SCORING_PILLARS;
  const sorted = [...pillars].sort((a, b) => city.scores[b] - city.scores[a]);
  const strongest = sorted[0];

  const vibes: Record<string, { en: string; th: string; zh: string }> = {
    "phuket": { en: "Tourism engine, real tech", th: "เครื่องยนต์ท่องเที่ยวที่ใช้เทคโนโลยีจริง", zh: "旅游引擎，真技术" },
    "samyan": { en: "Innovation district, alive", th: "ย่านนวัตกรรมที่มีชีวิต", zh: "创新区，活的" },
    "chiang-mai-old-town": { en: "Heritage meets sensors", th: "มรดกเมืองเก่าคู่เซ็นเซอร์อัจฉริยะ", zh: "遗产遇上传感器" },
    "khon-kaen": { en: "Isan's economic engine", th: "เครื่องยนต์เศรษฐกิจของอีสาน", zh: "伊桑经济引擎" },
    "saensuk": { en: "Beach town, clean data", th: "เมืองชายหาดที่ข้อมูลไว้ใจได้", zh: "海滩小城，干净数据" },
    "yala": { en: "Cleanest city, real grit", th: "เมืองสะอาดที่สุด ด้วยความมุ่งมั่นของคนในพื้นที่", zh: "最干净城市，真韧性" },
    "wangchan-valley": { en: "Innovation hub, in development", th: "ศูนย์กลางนวัตกรรมที่ยังอยู่ระหว่างพัฒนา", zh: "创新中心，开发中" },
  };

  if (vibes[city.id]) return vibes[city.id][locale];

  const pillarVibes: Record<string, { en: string; th: string; zh: string }> = {
    livability: { en: "Built for living", th: "สร้างมาเพื่อการอยู่อาศัย", zh: "为生活而建" },
    economy: { en: "Money moves here", th: "เม็ดเงินหมุนเวียนที่นี่", zh: "资金流动之地" },
    safety: { en: "Quiet streets, real data", th: "ถนนสงบ ข้อมูลยืนยันได้", zh: "安静街道，真实数据" },
    wellbeing: { en: "People-first signal", th: "เมืองที่ให้คนมาก่อน", zh: "以人为先信号" },
    environment: { en: "Green signal, verified", th: "สัญญาณสีเขียวที่ตรวจสอบแล้ว", zh: "绿色信号，已验证" },
    hospitality: { en: "Warm city, open doors", th: "เมืองอบอุ่นที่เปิดรับทุกคน", zh: "温暖城市，敞开大门" },
    digital: { en: "Wired and running", th: "เชื่อมต่อและเดินระบบแล้ว", zh: "已联网，运行中" },
  };

  if (city.reality === "planned") {
    return locale === "th" ? "ยังอยู่ในขั้นวางแผน" : locale === "zh" ? "处于规划阶段" : "In planning phase";
  }
  if (city.reality === "partial") {
    return locale === "th" ? "กำลังก่อร่าง ยังมีช่องว่างอยู่" : locale === "zh" ? "建设中，有缺口" : "Building, gaps remain";
  }

  return pillarVibes[strongest]?.[locale] ?? (locale === "th" ? "เดินระบบจริงแล้ว" : locale === "zh" ? "运行中" : "Running");
}

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function HomePage({ locale, onNavigate }: Props) {
  const [championsRef, championsVisible] = useInView(0.1);
  const [podiumRef, podiumVisible] = useInView(0.1);
  const [collectionsRef, collectionsVisible] = useInView(0.1);
  const [digestRef, digestVisible] = useInView(0.1);
  const [feedbackRef, feedbackVisible] = useInView(0.1);
  const [fineprintRef] = useInView(0.1);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HOME_HERO_ASSETS.length);
    }, 7000); // 7s display + 2.4s fade = ~9.4s per photo feels unhurried
    return () => clearInterval(interval);
  }, []);

  const { data: cities } = useCitySummaries();
  const stats = useMemo(() => summarizeCities(cities), [cities]);

  const cityById = useMemo(
    () => new Map(cities.map(c => [c.id, c])),
    [cities],
  );

  // The top-5 photo podium still lives on the homepage — the strongest block.
  const top5 = useMemo(
    () => [...cities].sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 5),
    [cities],
  );

  // Pillar champions — one city per pillar, the highest scorer.
  const pillarChampions = useMemo(() => {
    return SCORING_PILLARS.map(pillar => {
      const city = [...cities].sort(
        (a, b) => b.scores[pillar] - a.scores[pillar],
      )[0];
      return { pillar, city };
    }).filter(x => x.city != null);
  }, [cities]);

  const digestCity = cityById.get(WEEKLY_DIGEST.trendingCity.cityId);

  // Phase 13 — province count for the "Thailand by the numbers" ribbon.
  const provinceCount = useMemo(
    () => new Set(cities.map(c => c.province)).size,
    [cities],
  );

  // Road safety champions — cities with the lowest provincial road fatality
  // rate (deaths per 100,000 pop, source: thairsc.com). De-duplicated by
  // province so Bangkok doesn't fill all 5 slots. Max 5 entries.
  const roadSafetyChampions = useMemo(() => {
    const seen = new Set<string>();
    return [...cities]
      .filter(c => c.metrics.roadFatalityRate != null)
      .sort((a, b) => (a.metrics.roadFatalityRate ?? 99) - (b.metrics.roadFatalityRate ?? 99))
      .filter(c => {
        if (seen.has(c.province)) return false;
        seen.add(c.province);
        return true;
      })
      .slice(0, 5);
  }, [cities]);

  // Phase 14 — regional champions. One highest-composite city per region,
  // in canonical north→south order. Gives the homepage a geographic read
  // that the global composite sort hides.
  const regionalChampions = useMemo(() => {
    return REGIONS_ORDERED.map(region => ({
      region,
      city: [...cities]
        .filter(c => c.region === region)
        .sort((a, b) => b.compositeScore - a.compositeScore)[0],
    })).filter((x): x is { region: Region; city: typeof cities[number] } => x.city != null);
  }, [cities]);

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  return (
    <div className="dashboard-home">
      {/* ─── CINEMATIC HERO ─── */}
      <section className="cinematic-hero reveal visible">
        {(HOME_HERO_ASSETS as HeroAsset[]).map((asset, index) => {
          const active = index === heroIndex;
          return (
            <div
              key={asset.src}
              className="hero-slide-wrapper"
              style={{
                opacity: active ? 1 : 0,
                transition: "opacity 2.4s cubic-bezier(0.45, 0, 0.55, 1)",
                zIndex: active ? 1 : 0,
              }}
              aria-hidden={!active}
            >
              <ResponsiveImage
                src={asset.src}
                alt={asset.label ? `Thai smart city — ${asset.label}` : "Thai smart city"}
                className="cinematic-hero-img"
                width={1920}
                height={900}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
                style={{ objectPosition: asset.objectPosition }}
              />
            </div>
          );
        })}
        {/* City label — bottom-right credit for the active photo */}
        {(HOME_HERO_ASSETS as HeroAsset[])[heroIndex]?.label && (
          <span className="hero-slide-label">
            {(HOME_HERO_ASSETS as HeroAsset[])[heroIndex].label}
          </span>
        )}
        <div className="cinematic-hero-overlay">
          <p className="cinematic-hero-eyebrow">
            SCITI 2026 — {t({ en: "pronounced \"City\"", th: "อ่านว่า \"ซิตี้\"", zh: "读作 \"City\"" })}
            <span className="cinematic-hero-wordplay" aria-label="SmaSCITI equals Samastiti"> · <span className="cinematic-hero-wordplay-sma">Sma</span><span className="cinematic-hero-wordplay-sciti">SCITI</span> = Samastiti</span>
          </p>
          <h1 className="cinematic-hero-title">
            {locale === "th" ? <>เอาความจริง<br />ไม่เอาพิธีตัดริบบิ้น</> : locale === "zh" ? <>看现实<br />不看剪彩</> : <>Reality, not<br />ribbon&#8209;cutting.</>}
          </h1>
          <p className="cinematic-hero-why">
            {t({
              en: "Thailand has certified 37 smart cities. But how many of them actually work? This index exists because the gap between announcements and outcomes needed measuring.",
              th: "ประเทศไทยรับรองเมืองอัจฉริยะไปแล้ว 37 เมือง แต่มีกี่เมืองที่เดินระบบได้จริง? ดัชนีนี้เกิดขึ้นเพราะช่องว่างระหว่างคำประกาศกับผลลัพธ์ที่จับต้องได้ ต้องมีใครสักคนลงมือวัด",
              zh: "泰国已认证37座智慧城市。但其中有多少真正在运转？这个指数的存在，是因为公告与结果之间的差距需要被衡量。",
            })}
          </p>
          <div className="cinematic-hero-stats">
            <span>{stats.total} {t({ en: "cities", th: "เมือง", zh: "城市" })}</span>
            <span>{stats.operational} {t({ en: "operational", th: "เดินระบบแล้ว", zh: "运营中" })}</span>
            <span>{stats.certified} {t({ en: "certified", th: "ได้รับการรับรอง", zh: "已认证" })}</span>
          </div>
          <div className="cinematic-hero-actions">
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>
              {t({ en: "Get Rankings", th: "ดูอันดับ", zh: "查看排名" })}
            </button>
            <button className="ghost-button cinematic-ghost" onClick={() => onNavigate("/methodology")}>
              {t({ en: "Methodology", th: "ระเบียบวิธี", zh: "方法论" })}
            </button>
          </div>
        </div>
      </section>

      {/* ─── THAILAND BY THE NUMBERS (Phase 13 bridge band) ─── */}
      <section
        className="home-stat-ribbon"
        aria-label={t({ en: "Thailand by the numbers", th: "ประเทศไทยด้วยตัวเลข", zh: "数字里的泰国" })}
      >
        <div className="home-stat-ribbon-inner">
          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "Cities indexed", th: "เมืองในดัชนี", zh: "入选城市" })}</span>
            <span className="home-stat-value">{stats.total}</span>
          </div>
          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "depa-certified", th: "ได้รับการรับรองจาก depa", zh: "depa 认证" })}</span>
            <span className="home-stat-value">{stats.certified}</span>
          </div>
          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "Provinces covered", th: "จังหวัดครอบคลุม", zh: "覆盖府县" })}</span>
            <span className="home-stat-value">{provinceCount}</span>
          </div>
          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "Pillars measured", th: "เสาหลักที่ประเมิน", zh: "衡量支柱" })}</span>
            <span className="home-stat-value">{SCORING_PILLARS.length}</span>
          </div>
          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "Edition", th: "ฉบับ", zh: "版本" })}</span>
            <span className="home-stat-value">SCITI 2026</span>
          </div>
          <div className="home-stat-cell">
            <span className="home-stat-label">{t({ en: "Refreshed", th: "อัปเดต", zh: "刷新" })}</span>
            <span className="home-stat-value">{formatWeeklyStamp(WEEKLY_DIGEST.weekOf, locale)}</span>
          </div>
        </div>
      </section>

      {/* ─── EDITION STAMP ─── */}
      <div className="edition-stamp">
        <span>
          {`SCITI 2026 Edition · ${stats.total} ${t({ en: "cities", th: "เมือง", zh: "城市" })} · ${EVIDENCE_SOURCE_FAMILY_COUNT} ${t({ en: "evidence source families", th: "ตระกูลแหล่งหลักฐาน", zh: "证据来源族群" })} · ${CDP_PLATFORM_COUNT} ${t({ en: "public endpoints", th: "ปลายทางสาธารณะ", zh: "公开端点" })}`}
        </span>
        <span>{t({ en: "Research by Dr. Non A · depa · SLIC Methodology · Peer-reviewed at SCSE Taipei 2026", th: "งานวิจัยโดย ดร.ณณ · depa · ระเบียบวิธี SLIC · ผ่านการพิจารณาของผู้ทรงคุณวุฒิที่ SCSE ไทเป 2026", zh: "研究：Non A博士 · depa · SLIC方法论 · 2026台北SCSE同行评审" })}</span>
      </div>

      {/* ─── OPENING ARGUMENT ─── */}
      {/* The editorial heart of SCITI: why it exists, what makes it honest,
          what the user is about to see. Dark panel, ink-on-white reversed,
          large monospaced numbers anchoring three hard claims. */}
      <section className="opening-argument" aria-label={t({ en: "Opening argument", th: "ข้อโต้แย้งเปิด", zh: "开篇论点" })}>
        <div className="opening-argument-inner">
          <p className="opening-argument-eyebrow">
            {t({ en: "Opening argument", th: "ข้อโต้แย้งเปิด", zh: "开篇论点" })}
          </p>
          <h2 className="opening-argument-headline">
            {locale === "th"
              ? <>118 เมือง. 37 รับรองแล้ว.<br />นี่คือสิ่งที่แยกพวกเขาออกจากกัน</>
              : locale === "zh"
                ? <>118 座城市。37 座已认证。<br />这就是区别它们的东西。</>
                : <>118 cities, 37 certified.<br />Here is what separates them.</>
            }
          </h2>

          <div className="opening-argument-grid">
            <div className="opening-argument-block">
              <span className="opening-argument-num">{stats.total}</span>
              <p className="opening-argument-copy">
                {t({
                  en: "cities measured across every depa smart city zone and registered promotion area. The index begins with the complete picture — no cherry-picking.",
                  th: "เมืองที่วัดในทุกเขตเมืองอัจฉริยะ depa และพื้นที่ส่งเสริมที่จดทะเบียน ดัชนีเริ่มต้นจากภาพรวมที่สมบูรณ์ ไม่คัดเลือกเฉพาะ",
                  zh: "座城市——覆盖 depa 每一个智慧城市区域和已登记促进区。指数从完整图景出发，无一遗漏。",
                })}
              </p>
            </div>

            <div className="opening-argument-block">
              <span className="opening-argument-num">{stats.certified}</span>
              <p className="opening-argument-copy">
                {t({
                  en: "cities hold depa certification. Fewer than half have operational systems as of 2026. The certification measures intent. This index measures outcomes.",
                  th: "เมืองถือครองการรับรอง depa น้อยกว่าครึ่งหนึ่งมีระบบปฏิบัติการจริงในปี 2569 การรับรองวัดเจตนา ดัชนีนี้วัดผลลัพธ์",
                  zh: "座城市持有 depa 认证。截至 2026 年，有实际运营系统的不到一半。认证衡量意图，本指数衡量结果。",
                })}
              </p>
            </div>

            <div className="opening-argument-block">
              <span className="opening-argument-num">{SCORING_PILLARS.length}</span>
              <p className="opening-argument-copy">
                {t({
                  en: "pillars scored from real provincial data. Road fatalities from thairsc.com. Flood frequency from GISTDA 2005–2016. PM2.5 from live stations. No proxies. No interpolation. No null treated as zero.",
                  th: "เสาหลักที่ประเมินจากข้อมูลจังหวัดจริง อัตราเสียชีวิตบนถนนจาก thairsc.com ความถี่น้ำท่วมจาก GISTDA ปี 2548–2559 PM2.5 จากสถานีสด ไม่มีตัวแทน ไม่มีการประมาณ ไม่มีค่า null ที่ถือเป็นศูนย์",
                  zh: "个支柱，基于真实省级数据评分。道路死亡率来自 thairsc.com，洪水频率来自 GISTDA 2005–2016，PM2.5 来自实时站点。无代理数据，无插值，不以零代替空值。",
                })}
              </p>
            </div>
          </div>

          <p className="opening-argument-thesis">
            {t({
              en: "The city that buys hardware and cuts the ribbon scores the same as the city that never bothers — unless the data says otherwise. That is the only rule this index follows.",
              th: "เมืองที่ซื้อฮาร์ดแวร์และตัดริบบิ้นได้คะแนนเท่ากับเมืองที่ไม่สนใจ — เว้นเสียแต่ข้อมูลจะบอกเป็นอย่างอื่น นั่นคือกฎเดียวที่ดัชนีนี้ยึดถือ",
              zh: "买了设备、剪了彩的城市，与根本没有努力的城市，得分相同——除非数据另有说法。这是本指数遵守的唯一规则。",
            })}
          </p>

          <button
            type="button"
            className="opening-argument-cta"
            onClick={() => onNavigate("/methodology")}
          >
            {t({ en: "Read the full methodology →", th: "อ่านระเบียบวิธีทั้งหมด →", zh: "阅读完整方法论 →" })}
          </button>
        </div>
      </section>

      <div className="home-column">
        {/* ─── PILLAR CHAMPIONS ─── */}
        <section
          ref={championsRef}
          className={`section reveal stagger-1 ${championsVisible ? "visible" : ""}`}
          aria-label={t({ en: "Pillar champions", th: "เมืองผู้นำรายเสาหลัก", zh: "各支柱冠军" })}
        >
          <p className="eyebrow">{t({ en: "The seven pillars, by champion", th: "เจ็ดเสาหลัก ดูผ่านเมืองผู้นำ", zh: "七支柱，冠军演绎" })}</p>
          <h2 className="home-section-title">
            {t({
              en: "One city that wins each axis",
              th: "หนึ่งเมืองผู้นำ ต่อหนึ่งแกน",
              zh: "每条主轴的头名城市",
            })}
          </h2>
          <ul className="pillar-champions">
            {pillarChampions.map(({ pillar, city }) => (
              <li key={pillar} className="pillar-champion-cell">
                <button
                  type="button"
                  className="pillar-champion-btn"
                  onClick={() => onNavigate(`/city/${city.id}`)}
                >
                  <span
                    className="pillar-champion-dot"
                    style={{ background: PILLAR_COLORS[pillar] }}
                    aria-hidden="true"
                  />
                  <span className="pillar-champion-label">{PILLAR_LABELS[locale][pillar]}</span>
                  <span className="pillar-champion-city">{getCityName(city, locale)}</span>
                  <span className="pillar-champion-score">{city.scores[pillar]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── REGIONAL CHAMPIONS (Phase 14) ─── */}
        {regionalChampions.length > 0 && (
          <section
            className="section reveal visible"
            aria-label={t({ en: "Regional champions", th: "เมืองผู้นำรายภูมิภาค", zh: "区域冠军" })}
          >
            <p className="eyebrow">{t({ en: "By region", th: "รายภูมิภาค", zh: "按区域" })}</p>
            <h2 className="home-section-title">
              {t({
                en: "The champion of each Thai region",
                th: "เมืองผู้นำของแต่ละภูมิภาคในประเทศไทย",
                zh: "泰国各区域的头名城市",
              })}
            </h2>
            <ul className="regional-champions">
              {regionalChampions.map(({ region, city }) => (
                <li key={region}>
                  <button
                    type="button"
                    className="regional-champion-btn"
                    onClick={() => onNavigate(`/city/${city.id}`)}
                  >
                    <span className="regional-champion-region">{REGION_LABELS[locale][region]}</span>
                    <span className="regional-champion-city">{getCityName(city, locale)}</span>
                    <span className="regional-champion-meta">
                      <span>{getProvinceName(city, locale)}</span>
                      <span className="regional-champion-score">{city.compositeScore.toFixed(1)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ─── ROAD SAFETY CHAMPIONS ─── */}
        {roadSafetyChampions.length > 0 && (
          <section
            className="section reveal visible"
            aria-label={t({ en: "Road safety leaders", th: "เมืองผู้นำความปลอดภัยทางถนน", zh: "道路安全领先城市" })}
          >
            <p className="eyebrow">{t({ en: "Road safety · Source: thairsc.com", th: "ความปลอดภัยทางถนน · ที่มา: thairsc.com", zh: "道路安全 · 来源：thairsc.com" })}</p>
            <h2 className="home-section-title">
              {t({
                en: "Lowest road fatality rate in Thailand",
                th: "อัตราการเสียชีวิตบนท้องถนนต่ำที่สุดในประเทศไทย",
                zh: "全泰国道路死亡率最低城市",
              })}
            </h2>
            <ul className="regional-champions road-safety-champions">
              {roadSafetyChampions.map(city => (
                <li key={city.id}>
                  <button
                    type="button"
                    className="regional-champion-btn"
                    onClick={() => onNavigate(`/city/${city.id}`)}
                  >
                    <span className="regional-champion-region" style={{ color: "var(--amber)" }}>
                      {city.metrics.roadFatalityRate}/100K
                    </span>
                    <span className="regional-champion-city">{getCityName(city, locale)}</span>
                    <span className="regional-champion-meta">
                      <span>{getProvinceName(city, locale)}</span>
                      <span className="regional-champion-score" style={{ color: "var(--amber)" }}>
                        {t({ en: "deaths/yr", th: "เสียชีวิต/ปี", zh: "死亡/年" })}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="home-section-note">
              {t({
                en: "Thai national average: ~25 deaths per 100,000. WHO target: ≤5. Source: thairsc.com provincial annual data.",
                th: "ค่าเฉลี่ยประเทศไทย: ~25 ต่อแสนคน เป้าหมาย WHO: ≤5 ที่มา: ข้อมูลรายปีรายจังหวัด thairsc.com",
                zh: "泰国全国平均：约每十万人25人死亡。WHO目标：≤5。来源：thairsc.com 省级年度数据。",
              })}
            </p>
          </section>
        )}

        {/* ─── TOP 5 PHOTO PODIUM ─── */}
        {top5.length >= 5 && (() => {
          const leader = top5[0];
          const cityQuickStats: Record<string, string[]> = {
            phuket: ["GPP ฿492K/capita", "PM2.5 18.2 μg/m³", "88% hospitality", "72% digital adoption"],
            samyan: ["GPP ฿628K/capita", "200+ startups", "82% digital score", "5G testbed live"],
            "chiang-mai-old-town": ["300+ temple sensors", "PM2.5 46.1 μg/m³", "92% hospitality", "50+ AQ stations"],
            "khon-kaen": ["LRT under construction", "Smart bus running", "GPP ฿155K/capita", "6 hospital network"],
            "cmu-smart-city": ["30% energy reduction", "12 AI intersections", "500+ open datasets", "80% digital"],
          };
          const leaderPhoto = getCityPhotoAsset(leader);
          return (
            <section ref={podiumRef} className={`reveal stagger-2 ${podiumVisible ? "visible" : ""}`}>
              <p className="eyebrow">{t({ en: "Top five", th: "ห้าอันดับแรก", zh: "前五名" })}</p>
              <div className="podium-photo-layout">
                <button type="button" className="podium-photo-leader" onClick={() => onNavigate(`/city/${leader.id}`)}>
                  <ResponsiveImage
                    src={leaderPhoto.src}
                    alt={getCityName(leader, locale)}
                    className="podium-photo-img"
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 58vw"
                    style={{ objectPosition: leaderPhoto.objectPosition }}
                  />
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
                    <div className="podium-photo-vibe">{getCityVibe(leader, locale)}</div>
                  </div>
                </button>
                <div className="podium-photo-grid">
                  {top5.slice(1).map((city, i) => {
                    const photo = getCityPhotoAsset(city);
                    return (
                      <button key={city.id} type="button" className="podium-photo-card" onClick={() => onNavigate(`/city/${city.id}`)}>
                        <ResponsiveImage
                          src={photo.src}
                          alt={getCityName(city, locale)}
                          className="podium-photo-card-img"
                          loading="lazy"
                          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                          style={{ objectPosition: photo.objectPosition }}
                        />
                        <div className="podium-photo-card-overlay">
                          <div className="podium-rank">{String(i + 2).padStart(2, "0")}</div>
                          <h3 className="podium-photo-card-name">{getCityName(city, locale)}</h3>
                          <div className="podium-photo-card-score">{city.compositeScore.toFixed(1)}</div>
                          <div className="podium-photo-card-stats">
                            {(cityQuickStats[city.id] ?? []).slice(0, 2).map((stat, j) => (
                              <span key={j} className="podium-photo-stat">{stat}</span>
                            ))}
                          </div>
                          <span className={`podium-photo-card-vibe dashboard-ranking-vibe-${city.reality}`}>{getCityVibe(city, locale)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}

        {/* ─── EDITORIAL COLLECTIONS ─── */}
        <section
          ref={collectionsRef}
          className={`section reveal stagger-3 ${collectionsVisible ? "visible" : ""}`}
        >
          <p className="eyebrow">{t({ en: "The shortlists", th: "ชุดเมืองคัดสรร", zh: "精选榜单" })}</p>
          <h2 className="home-section-title">
            {t({
              en: "Thailand, grouped by what each city is doing",
              th: "เมืองไทย จัดกลุ่มตามสิ่งที่แต่ละเมืองลงมือทำ",
              zh: "泰国城市，按其正在做的事分组",
            })}
          </h2>
          <div className="home-collections">
            {HOME_COLLECTIONS.map(col => (
              <article key={col.id} className="home-collection-card glass-card">
                <p className="home-collection-kicker">{translate(locale, col.kicker)}</p>
                <h3 className="home-collection-headline">{translate(locale, col.headline)}</h3>
                <p className="home-collection-body">{translate(locale, col.body)}</p>
                <ul className="home-collection-chips">
                  {col.cityIds.map(id => {
                    const city = cityById.get(id);
                    if (!city) return null;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className="home-collection-chip"
                          onClick={() => onNavigate(`/city/${city.id}`)}
                        >
                          <span className="home-collection-chip-name">{getCityName(city, locale)}</span>
                          <span className="home-collection-chip-meta">{getProvinceName(city, locale)}</span>
                          <span className="home-collection-chip-score">{city.compositeScore.toFixed(1)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ─── WEEKLY DIGEST ─── */}
        <section
          ref={digestRef}
          className={`section reveal stagger-4 ${digestVisible ? "visible" : ""}`}
        >
          <div className="weekly-digest-header">
            <p className="eyebrow">{t({ en: "This week", th: "สัปดาห์นี้", zh: "本周" })}</p>
            <span className="weekly-stamp">{formatWeeklyStamp(WEEKLY_DIGEST.weekOf, locale)}</span>
          </div>
          <div className="weekly-digest glass-card">
            {digestCity && (
              <button
                type="button"
                className="weekly-digest-slot"
                onClick={() => onNavigate(`/city/${digestCity.id}`)}
              >
                <span className="weekly-digest-label">{t({ en: "Trending city", th: "เมืองมาแรง", zh: "热门城市" })}</span>
                <span className="weekly-digest-headline">{getCityName(digestCity, locale)}</span>
                <span className="weekly-digest-note">{translate(locale, WEEKLY_DIGEST.trendingCity.note)}</span>
              </button>
            )}
            <button
              type="button"
              className="weekly-digest-slot"
              onClick={() => onNavigate("/rankings")}
            >
              <span className="weekly-digest-label">{t({ en: "Trending search", th: "คำค้นมาแรง", zh: "热门搜索" })}</span>
              <span className="weekly-digest-headline">{translate(locale, WEEKLY_DIGEST.trendingSearch.phrase)}</span>
              <span className="weekly-digest-note">{translate(locale, WEEKLY_DIGEST.trendingSearch.deltaLabel)}</span>
            </button>
            <a
              className="weekly-digest-slot"
              href={WEEKLY_DIGEST.headline.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="weekly-digest-label">{t({ en: "Headline", th: "ข่าวเด่น", zh: "头条" })}</span>
              <span className="weekly-digest-headline">{translate(locale, WEEKLY_DIGEST.headline.title)}</span>
              <span className="weekly-digest-note">{translate(locale, WEEKLY_DIGEST.headline.gloss)} ↗</span>
            </a>
          </div>
        </section>

        {/* ─── FEEDBACK & CONTRIBUTIONS ─── */}
        <section ref={feedbackRef} className={`section reveal stagger-4 ${feedbackVisible ? "visible" : ""}`}>
          <div className="feedback-cta glass-card shadow-premium">
            <h2>{t({ en: "Is your city missing?", th: "เมืองของคุณยังไม่อยู่ในดัชนี?", zh: "您的城市不在名单上？" })}</h2>
            <p>{t({ en: "We only rank cities with enough verifiable data.", th: "เราจัดอันดับเฉพาะเมืองที่มีข้อมูลซึ่งตรวจสอบได้เพียงพอ", zh: "我们仅对拥有足够可验证数据的城市进行排名。" })}</p>
            <button className="cta-button" onClick={() => window.open("mailto:data@slic-index.org")}>{t({ en: "Submit Data", th: "ส่งข้อมูล", zh: "提交数据" })}</button>
          </div>
        </section>
      </div>

      {/* ═══ OPEN DATA: Big CSV Export Buttons ═══ */}
      <section className="open-data-section">
        <div className="open-data-inner">
          <div className="open-data-text">
            <h2 className="open-data-title">
              {t({ en: "Open data. No gatekeeping.", th: "ข้อมูลเปิด ไม่มีการกั้นใคร", zh: "开放数据，不设门槛。" })}
            </h2>
            <p className="open-data-body">
              {t({
                en: `Every score, every metric, every source row — downloadable. No city lobbied for a higher rank. No investor paid for placement. SCITI publishes the research layer, the deterministic equation, and the provenance exports under CC BY 4.0. Take the data. Audit the method. Build on it.`,
                th: "ทุกคะแนน ทุกตัวชี้วัด ทุกแถวของแหล่งข้อมูล — ดาวน์โหลดได้ทั้งหมด ไม่มีเมืองใดวิ่งเต้นขอขึ้นอันดับ ไม่มีนักลงทุนจ่ายเงินซื้อตำแหน่ง SCITI เผยแพร่ทั้งชั้นงานวิจัย สมการที่คำนวณตายตัว และไฟล์แสดงที่มาของข้อมูล ภายใต้สัญญาอนุญาต CC BY 4.0 นำข้อมูลไปใช้ ตรวจสอบระเบียบวิธี แล้วต่อยอดได้ทันที",
                zh: "每个分数、每项指标、每一行来源记录都可下载。没有城市游说更高排名，也没有投资者付费买位置。SCITI 公开研究层、确定性公式和溯源导出文件，并采用 CC BY 4.0 许可。",
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
                <strong>{t({ en: "Export All Cities (CSV)", th: "ส่งออกทุกเมือง (CSV)", zh: "导出所有城市 (CSV)" })}</strong>
                <span>{t({ en: "Scores, tiers, finance signals, confidence", th: "คะแนน ระดับเมือง สัญญาณทางการเงิน ค่าความเชื่อมั่น", zh: "分数、层级、金融信号、置信度" })}</span>
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
                <strong>{t({ en: "Export Detailed Facts (CSV)", th: "ส่งออกข้อมูลละเอียด (CSV)", zh: "导出详细事实 (CSV)" })}</strong>
                <span>{t({ en: "Every metric, every source, every timestamp", th: "ทุกตัวชี้วัด ทุกแหล่งข้อมูล ทุกวันที่บันทึก", zh: "每项指标、每个来源、每个时间戳" })}</span>
              </span>
            </button>
            <div className="export-docs">
              <a href={assetUrl("/downloads/SCITI-2026-Executive-Summary.pdf")} download className="export-doc-link">{t({ en: "Executive Summary (PDF)", th: "บทสรุปผู้บริหาร (PDF)", zh: "执行摘要 (PDF)" })}</a>
              <a href={assetUrl("/downloads/SCITI-2026-Methodology.pdf")} download className="export-doc-link">{t({ en: "Methodology Paper (PDF)", th: "เอกสารระเบียบวิธี (PDF)", zh: "方法论文 (PDF)" })}</a>
              <a href={assetUrl("/downloads/SCITI-2026-Report.pdf")} download className="export-doc-link">{t({ en: "Full Report (PDF)", th: "รายงานฉบับเต็ม (PDF)", zh: "完整报告 (PDF)" })}</a>
              <a href={assetUrl("/downloads/SCITI-2026-Audit.pdf")} download className="export-doc-link">{t({ en: "Performance Audit (PDF)", th: "การตรวจสอบผลการดำเนินงาน (PDF)", zh: "绩效审计 (PDF)" })}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRANSPARENCY: How the numbers work ═══ */}
      <section className="transparency-section">
        <div className="transparency-inner">
          <h2>{t({ en: "How the numbers work", th: "เบื้องหลังตัวเลขทั้งหมดนี้", zh: "数字如何运作" })}</h2>
          <div className="transparency-formula">
            <code>Composite = ({SCORING_PILLARS.map(p => `${PILLAR_LABELS[locale][p]}×${PILLAR_WEIGHTS[p]}`).join(" + ")}) / 100</code>
          </div>
          <div className="transparency-steps">
            <div className="transparency-step">
              <span className="transparency-step-num">1</span>
              <div>
                <strong>{t({ en: "Raw data in", th: "ข้อมูลดิบต้นทาง", zh: "原始数据输入" })}</strong>
                <p>{t({
                  en: `${EVIDENCE_SOURCE_FAMILY_COUNT} evidence source families plus ${CDP_PLATFORM_COUNT} mapped public endpoints. Public indicators, platform registries, and field verification feed the research layer.`,
                  th: `แหล่งหลักฐาน ${EVIDENCE_SOURCE_FAMILY_COUNT} ตระกูล และปลายทางสาธารณะที่เชื่อมโยงไว้ ${CDP_PLATFORM_COUNT} จุด ตัวชี้วัดสาธารณะ ทะเบียนแพลตฟอร์ม และการตรวจสอบภาคสนามทั้งหมด ป้อนเข้าสู่ชั้นงานวิจัย`,
                  zh: `${EVIDENCE_SOURCE_FAMILY_COUNT} 个证据来源族群，加上 ${CDP_PLATFORM_COUNT} 个已映射公开端点。公共指标、平台名录和实地核验共同进入研究层。`,
                })}</p>
              </div>
            </div>
            <div className="transparency-step">
              <span className="transparency-step-num">2</span>
              <div>
                <strong>{t({ en: "7 pillars assessed 0-100", th: "ประเมิน 7 เสาหลัก ในช่วง 0-100", zh: "7个支柱评估为0-100" })}</strong>
                <p>{t({
                  en: "Each pillar is a structured research assessment anchored in observed indicators and evidence items. The repo does not pretend one API feed can explain a whole city.",
                  th: "แต่ละเสาหลักคือการประเมินเชิงวิจัยอย่างเป็นระบบ ยึดกับตัวชี้วัดที่สังเกตได้จริงและหลักฐานที่ตรวจสอบได้ ดัชนีนี้ไม่แกล้งทำว่า API เพียงเส้นเดียวจะอธิบายเมืองทั้งเมืองได้",
                  zh: "每个支柱都是以可观察指标和证据项为锚点的结构化研究评估。本仓库并不假装单一 API 就能解释整座城市。",
                })}</p>
              </div>
            </div>
            <div className="transparency-step">
              <span className="transparency-step-num">3</span>
              <div>
                <strong>{t({ en: "Weighted composite", th: "คะแนนรวมแบบถ่วงน้ำหนัก", zh: "加权综合" })}</strong>
                <p>{t({
                  en: "Weights sum to 100%. Livability carries 25% because daily function matters most; digital carries 5% because technology is an enabler, not the objective. No hidden adjustments.",
                  th: "น้ำหนักรวมกันเป็น 100% ความน่าอยู่ได้ 25% เพราะการใช้ชีวิตประจำวันสำคัญที่สุด ดิจิทัลได้ 5% เพราะเทคโนโลยีเป็นเครื่องมือสนับสนุน ไม่ใช่เป้าหมายในตัวเอง ไม่มีการปรับแต่งที่ซ่อนไว้",
                  zh: "权重总和为100%。宜居占25%，因为日常运转最重要；数字占5%，因为技术是赋能工具而不是目的。没有隐藏调整。",
                })}</p>
              </div>
            </div>
            <div className="transparency-step">
              <span className="transparency-step-num">4</span>
              <div>
                <strong>{t({ en: "Tier + confidence", th: "ระดับเมือง + ค่าความเชื่อมั่น", zh: "层级 + 置信度" })}</strong>
                <p>{t({
                  en: `Tier assignment is automatic once the composite is known. Confidence is reported separately so uncertainty stays visible instead of being hidden inside the score. Full method: ${SCITI_METHOD_CODE}.`,
                  th: `เมื่อได้คะแนนรวมแล้ว การจัดระดับเมืองจะคำนวณโดยอัตโนมัติ ส่วนค่าความเชื่อมั่นรายงานแยกต่างหาก เพื่อให้ความไม่แน่นอนปรากฏชัด แทนที่จะซ่อนไว้ในคะแนน ระเบียบวิธีฉบับเต็ม: ${SCITI_METHOD_CODE}`,
                  zh: `一旦综合分确定，层级分配即自动完成。置信度单独报告，让不确定性保持可见，而不是藏进分数里。完整方法：${SCITI_METHOD_CODE}。`,
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INVESTOR: Secondary city opportunities ═══ */}
      <section className="investor-section">
        <div className="investor-inner">
          <h2>{t({ en: "Beyond Bangkok: where the real opportunity is", th: "ไกลกว่ากรุงเทพฯ: โอกาสจริงอยู่ที่ไหน", zh: "超越曼谷：真正的机会在哪里" })}</h2>
          <p className="investor-lead">
            {t({
              en: "Not every investor needs to pile into Bangkok or Phuket. Thailand's secondary cities offer BOI incentives, lower costs, better air, and less competition — with the same legal protections and digital infrastructure. This index helps match the right capital with the right city.",
              th: "นักลงทุนไม่จำเป็นต้องกระจุกอยู่แค่กรุงเทพฯ หรือภูเก็ต เมืองรองของไทยมีสิทธิประโยชน์ BOI ต้นทุนต่ำกว่า อากาศดีกว่า และการแข่งขันน้อยกว่า — โดยได้รับการคุ้มครองทางกฎหมายและโครงสร้างพื้นฐานดิจิทัลในระดับเดียวกัน ดัชนีนี้ช่วยจับคู่ทุนที่เหมาะสมกับเมืองที่ใช่",
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
            {t({
              en: "These are cities with real infrastructure, working governance, and room to grow — not yet Alpha, but building fast. BOI S-Curve incentives apply. EEC adjacency benefits included. Every city profile shows bankability score, financial toolkit, and specific opportunities.",
              th: "เมืองเหล่านี้มีโครงสร้างพื้นฐานจริง มีการบริหารที่เดินได้ และยังมีพื้นที่เหลือให้เติบโต — ยังไม่ถึงระดับ Alpha แต่กำลังขยายตัวเร็ว ใช้สิทธิประโยชน์ BOI S-Curve ได้ รวมถึงอานิสงส์จากพื้นที่ติดกับ EEC โปรไฟล์ของทุกเมืองจะแสดงคะแนนความพร้อมทางการเงิน ชุดเครื่องมือทางการเงิน และโอกาสเฉพาะของเมืองนั้น",
              zh: "这些城市拥有真实基础设施、运转中的治理体系和增长空间——尚未达到Alpha但建设迅速。BOI S-Curve激励适用。EEC邻近利益包含在内。",
            })}
          </p>
        </div>
      </section>

      {/* ─── NEWS + DATA DENSITY + LEGAL ─── */}
      <NewsStrip locale={locale} />

      {/* ─── FINE PRINT ─── */}
      <section ref={fineprintRef} className={`dashboard-fineprint reveal visible`}>
        <div className="dashboard-fineprint-inner">
          <p>© 2026 depa, MDES, Kingdom of Thailand · SLIC Methodology · CC BY 4.0 · No city lobbied for rank · No investor paid for placement · SCITI-2026-R1</p>
        </div>
      </section>
    </div>
  );
}
