import { useMemo, useState, useEffect } from "react";
import { useInView } from "./useInView";
import AnimatedScore from "./AnimatedScore";
import NewsStrip from "./NewsStrip";
import HomeDecisionGuide from "./HomeDecisionGuide";
import { getHomeRoadEvidence } from "./homeRoadEvidence";
import { useCitySummaries } from "./cityApi";
import { summarizeCities } from "./cityCollections";
import { getCityPhotoAsset, HOME_HERO_ASSETS, type HeroAsset } from "./cityMedia";
import {
  getCityName,
  getProvinceName,
  getDistinctProvinceName,
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
import { CDP_PLATFORM_COUNT, EVIDENCE_SOURCE_FAMILY_COUNT, SCITI_DATA_CUTOFF_ISO, SCITI_METHOD_CODE } from "./methodologySpec";
import { WEEKLY_DIGEST, formatWeeklyStamp } from "./weeklyDigest";
import { REGIONS_ORDERED, REGION_LABELS, type Region } from "./regions";

/** Short, unique vibe phrase per city — used by the top-5 podium. */
function getCityVibe(city: SmartCity, locale: Locale): string {
  const pillars = SCORING_PILLARS;
  const sorted = [...pillars].sort((a, b) => city.scores[b] - city.scores[a]);
  const strongest = sorted[0];

  return `${PILLAR_LABELS[locale][strongest]} ${city.scores[strongest]}/100`;

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

  // Registry counts have a source year; legacy seed rates do not.
  const roadEvidence = useMemo(() => getHomeRoadEvidence(cities), [cities]);

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
            SCITI 2026 · {t({ en: "DELIVERY EVIDENCE & RESIDENT OUTCOMES", th: "หลักฐานการส่งมอบและผลลัพธ์ผู้อยู่อาศัย", zh: "交付实证与居民成果" })}
          </p>
          <h1 className="cinematic-hero-title">
            {locale === "th" ? (
              <>หลักฐานการส่งมอบ<br />เมืองอัจฉริยะประเทศไทย</>
            ) : locale === "zh" ? (
              <>泰国智慧城市的<br />交付实证与运营基准</>
            ) : (
              <>Delivery Evidence for<br />Thailand's Smart Cities</>
            )}
          </h1>
          <p className="cinematic-hero-why">
            {t({
              en: "Recognition, installed technology and public visibility are not evidence of improved lives. SCITI grounds 118 Thai cities in operational delivery, accountable operators, and measurable resident outcomes.",
              th: "การรับรอง เทคโนโลยีที่ติดตั้ง และการมองเห็น ไม่ใช่หลักฐานว่าชีวิตประชาชนดีขึ้น SCITI ประเมิน 118 เมืองไทยด้วยผลลัพธ์การส่งมอบจริง ผู้รับผิดชอบที่ตรวจสอบได้ และผลลัพธ์ที่วัดได้จริงของผู้อยู่อาศัย",
              zh: "行政认证、已安装技术和曝光度并非居民生活改善的证据。SCITI 将泰国 118 座城市建立在实际交付、可问责运营方与可衡量的居民生活成果之上。",
            })}
          </p>

          <div className="cinematic-hero-stats">
            <div className="hero-stat-cell">
              <AnimatedScore target={stats.total} from={0} decimals={0} duration={1600} className="hero-stat-num" />
              <span className="hero-stat-label">{t({ en: "cities indexed", th: "เมืองในดัชนี", zh: "收录城市" })}</span>
            </div>
            <div className="hero-stat-cell">
              <AnimatedScore target={stats.certified} from={0} decimals={0} duration={1600} className="hero-stat-num" />
              <span className="hero-stat-label">{t({ en: "depa-designated areas", th: "พื้นที่ประกาศ depa", zh: "depa 指定区域" })}</span>
            </div>
            <div className="hero-stat-cell">
              <span className="hero-stat-num" style={{ font: "700 var(--text-body)/1 var(--mono)", color: "var(--amber, #f59e0b)" }}>2</span>
              <span className="hero-stat-label">{t({ en: "delivery priorities (CNX · NST)", th: "พื้นที่นำร่อง (เชียงใหม่ · นครฯ)", zh: "重点交付 (清迈 · 洛坤)" })}</span>
            </div>
          </div>
          <p className="hero-status-note">{t({ en: "Prioritise Chiang Mai and Nakhon Si Thammarat; Bangkok as conditional district partnership.", th: "ให้ความสำคัญกับเชียงใหม่และนครศรีธรรมราชเป็นลำดับแรก กรุงเทพฯ เป็นความร่วมมือเฉพาะระดับเขตหรือลุ่มน้ำ", zh: "优先推进清迈与洛坤；曼谷作为附条件的行政区或水系合作。" })}</p>
          <div className="cinematic-hero-actions">
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>
              {t({ en: "Explore Rankings", th: "สำรวจอันดับ", zh: "探索排名" })}
            </button>
            <button type="button" className="ghost-button cinematic-ghost" onClick={() => onNavigate("/references")}>
              {t({
                en: "Delivery Evidence Brief →",
                th: "สรุปหลักฐานการส่งมอบ →",
                zh: "交付实证简报 →",
              })}
            </button>
            <button className="ghost-button cinematic-ghost" onClick={() => onNavigate("/audit")}>
              {t({ en: "Jury: start here", th: "กรรมการ: เริ่มที่นี่", zh: "评审：从这里开始" })}
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
            <span className="home-stat-label">{t({ en: "Provinces covered", th: "จังหวัดครอบคลุม", zh: "覆盖省份" })}</span>
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
            <span className="home-stat-label">{t({ en: "Reading list", th: "เรื่องคัดอ่าน", zh: "编辑选读" })}</span>
            <span className="home-stat-value">{formatWeeklyStamp(WEEKLY_DIGEST.weekOf, locale)}</span>
          </div>
        </div>
      </section>

      {/* ─── EDITION STAMP ─── */}
      <div className="edition-stamp">
        <span>
          {`SCITI 2026 Edition · ${stats.total} ${t({ en: "cities", th: "เมือง", zh: "城市" })} · ${EVIDENCE_SOURCE_FAMILY_COUNT} ${t({ en: "evidence source families", th: "ตระกูลแหล่งหลักฐาน", zh: "证据来源类别" })} · ${CDP_PLATFORM_COUNT} ${t({ en: "public endpoints", th: "ปลายทางสาธารณะ", zh: "公开端点" })}`}
        </span>
        <span>{t({ en: `Research by Dr. Non A · depa · ${SCITI_METHOD_CODE} · release cut-off ${SCITI_DATA_CUTOFF_ISO.slice(0, 10)}`, th: `งานวิจัยโดย ดร.ณณ · depa · ${SCITI_METHOD_CODE} · วันตัดข้อมูล ${SCITI_DATA_CUTOFF_ISO.slice(0, 10)}`, zh: `研究：Non A 博士 · depa · ${SCITI_METHOD_CODE} · 数据截点 ${SCITI_DATA_CUTOFF_ISO.slice(0, 10)}` })}</span>
      </div>

      {/* ─── OPENING ARGUMENT ─── */}
      {/* The editorial heart of SCITI: why it exists, what makes it honest,
          what the user is about to see. Dark panel, ink-on-white reversed,
          large monospaced numbers anchoring three hard claims. */}
      <section className="opening-argument" aria-label={t({ en: "Opening argument", th: "ประเด็นตั้งต้น", zh: "开篇论点" })}>
        <div className="opening-argument-inner">
          <p className="opening-argument-eyebrow">
            {t({ en: "Opening argument", th: "ประเด็นตั้งต้น", zh: "开篇论点" })}
          </p>
          <h2 className="opening-argument-headline">
            {t({ en: "What are you choosing a city for?", th: "คุณกำลังเลือกเมืองเพื่ออะไร", zh: "您选择城市的目的是什么？" })}
          </h2>
          <HomeDecisionGuide locale={locale} onNavigate={onNavigate} />
          <details className="home-evidence-guide">
            <summary>{t({ en: "How to read this index: scope, certification, evidence", th: "อ่านดัชนีนี้อย่างไร: ขอบเขต การรับรอง หลักฐาน", zh: "如何阅读本指数：范围、认证与证据" })}</summary>
          <div className="opening-argument-grid">
            <div className="opening-argument-block">
              <span className="opening-argument-num">{t({ en: "Scope", th: "ขอบเขต", zh: "范围" })}</span>
              <p className="opening-argument-copy">
                {t({
                  en: "Records cover certified cities, modeled promotion zones, and registry-only entries. Evidence depth differs; check each city’s coverage.",
                  th: "ระเบียนเมืองในฉบับนี้ ครอบคลุมเมืองรับรอง เขตส่งเสริมที่นำมาสร้างแบบจำลอง และรายการระดับทะเบียน โดยระบุขอบเขตชัดเจน และไม่อ้างว่าความลึกของหลักฐานเท่ากัน",
                  zh: "条城市记录，涵盖认证城市、已建模推广区与仅名录条目。范围明确，也不声称证据深度相同。",
                })}
              </p>
            </div>

            <div className="opening-argument-block">
              <span className="opening-argument-num">{t({ en: "Certification", th: "การรับรอง", zh: "认证" })}</span>
              <p className="opening-argument-copy">
                {t({
                  en: "depa certification records recognition of a city plan. It does not establish that every service operates today. Check dated sources and local operating evidence.",
                  th: "การรับรอง depa ยืนยันการรับรองแผนเมือง ไม่ได้ยืนยันว่าทุกบริการใช้งานได้ในวันนี้ ควรตรวจวันที่ของแหล่งข้อมูลและหลักฐานการดำเนินงานในพื้นที่",
                  zh: "depa 认证记录城市规划获得认可，并不证明每项服务目前都在运行。请核查来源日期及本地运营证据。",
                })}
              </p>
            </div>

            <div className="opening-argument-block">
              <span className="opening-argument-num">{t({ en: "Evidence", th: "หลักฐาน", zh: "证据" })}</span>
              <p className="opening-argument-copy">
                {t({
                  en: "Seven pillars are assessed against public baselines and research evidence. Provincial proxies are disclosed when municipal values are unavailable. Missing evidence lowers confidence; it is not silently converted to zero.",
                  th: "ประเมินเจ็ดเสาหลักเทียบกับข้อมูลฐานสาธารณะและหลักฐานวิจัย เมื่อไม่มีค่าระดับเทศบาล จะระบุชัดว่าใช้ตัวแทนระดับจังหวัด หลักฐานที่ขาดจะลดค่าความเชื่อมั่น ไม่ถูกเปลี่ยนเป็นศูนย์อย่างเงียบๆ",
                  zh: "以七个支柱及公开基线与研究证据评估。缺少市级值时会明确标注省级代理；证据缺失会降低置信度，不会被悄然改成零。",
                })}
              </p>
            </div>
          </div>

          <p className="opening-argument-thesis">
            {t({
              en: "Use the rank to choose what to investigate. Before investing, verify local figures, service coverage, and operating status in the city’s evidence dossier.",
              th: "ใช้อันดับเลือกประเด็นที่จะศึกษาต่อ ก่อนลงทุน ควรตรวจสอบตัวเลขในพื้นที่ ความครอบคลุมของบริการ และสถานะการดำเนินงานจากแฟ้มหลักฐานของเมือง",
              zh: "用排名选择值得深入调查的问题。投资前，请核查城市证据档案中的本地数据、服务覆盖范围及运营状态。",
            })}
          </p>

          <button
            type="button"
            className="opening-argument-cta"
            onClick={() => onNavigate("/audit")}
          >
            {t({ en: "Start the jury walk-through →", th: "เริ่มเส้นทางสำหรับคณะกรรมการ →", zh: "开始评审导览 →" })}
          </button>
          </details>
        </div>
      </section>

      {/* ─── FIELD OPERATIONS & DELIVERY EVIDENCE ─── */}
      <section className="home-field-ops-section" aria-label={t({ en: "Field Operations & Delivery Evidence", th: "การปฏิบัติการภาคสนามและหลักฐานการส่งมอบ", zh: "现场运营与交付实证" })}>
        <div className="section">
          <p className="eyebrow">{t({ en: "Field Operations · 21 October 2026 Evidence", th: "การปฏิบัติการภาคสนาม · ข้อมูลเชิงประจักษ์ 21 ตุลาคม 2569", zh: "现场运营 · 2026年10月21日实证" })}</p>
          <h2 className="home-section-title">
            {t({
              en: "Two Public Decision-Support Interfaces in Active Use",
              th: "สองระบบสนับสนุนการตัดสินใจสาธารณะที่เปิดให้ตรวจสอบ",
              zh: "两套公开运行中的决策支持系统",
            })}
          </h2>
          <p className="home-section-intro">
            {t({
              en: "Thailand's smart city opportunity is connecting existing digital assets to accountable operators, accessible services and funded maintenance. These two interfaces display tangible decision support for provincial leadership.",
              th: "โอกาสของเมืองอัจฉริยะไทยคือการเชื่อมสินทรัพย์ดิจิทัลที่มีอยู่เข้ากับผู้ปฏิบัติงานที่มีความรับผิดชอบ บริการที่เข้าถึงได้ และงบบำรุงรักษา ทั้งสองระบบนี้แสดงการสนับสนุนการตัดสินใจที่เป็นรูปธรรมสำหรับผู้บริหารจังหวัด",
              zh: "泰国智慧城市的核心机遇在于将既有数字资产与可问责的运营方、易获取的服务及有保障的运维资金对接。这两套界面展示了面向省府领导的实质性决策支持功能。",
            })}
          </p>

          <div className="home-field-ops-grid">
            {/* Card 1: Chiang Mai Situation Summary */}
            <article className="home-field-op-card">
              <div className="home-field-op-media">
                <ResponsiveImage
                  src="/photos/delivery-brief/chiang-mai-governor-brief.webp"
                  alt={t({ en: "Chiang Mai situation summary governor brief interface", th: "หน้าจอรายงานสถานการณ์ผู้ว่าราชการจังหวัดเชียงใหม่", zh: "清迈态势摘要省长简报界面" })}
                  className="home-field-op-img"
                  width={1180}
                  height={757}
                  loading="lazy"
                />
                <span className="home-field-op-badge">CNX WAR ROOM · 21 OCT 2026</span>
              </div>
              <div className="home-field-op-body">
                <div className="home-field-op-header">
                  <h3 className="home-field-op-title">{t({ en: "Chiang Mai Situation Summary (Governor Brief)", th: "สรุปสถานการณ์เชียงใหม่ (รายงานผู้ว่าฯ)", zh: "清迈态势摘要 (省长简报)" })}</h3>
                  <span className="home-field-op-tag">{t({ en: "Priority 1", th: "ลำดับความสำคัญ 1", zh: "第一优先级" })}</span>
                </div>
                <p className="home-field-op-desc">
                  {t({
                    en: "Live decision-support synthesizing air quality (PCD ground stations), wildfire hotspots (NASA FIRMS VIIRS), Nawarat Bridge water clearance (ThaiWater/RID P.1), and aviation arrivals into an actionable brief ready to forward on LINE or print.",
                    th: "ระบบสนับสนุนการตัดสินใจสังเคราะห์ข้อมูลคุณภาพอากาศ (สถานี คพ.) จุดความร้อนไฟป่า (NASA FIRMS VIIRS) ระดับน้ำสะพานนวรัฐ (ThaiWater/ชลประทาน P.1) และเที่ยวบินขาเข้า สู่รายงานกระชับพร้อมส่งต่อทาง LINE หรือพิมพ์",
                    zh: "实时决策支持系统：综合空气质量（环保厅地面站）、林火热点（NASA FIRMS VIIRS）、纳瓦拉桥水位净空（ThaiWater/水利局 P.1）及航班抵港信息，生成可直接转发 LINE 或打印的态势简报。",
                  })}
                </p>
                <div className="home-field-op-target">
                  <span className="home-field-op-target-label">{t({ en: "6-Month Acceptance Gate:", th: "เกณฑ์ตรวจรับ 6 เดือน:", zh: "6个月验收门槛：" })}</span>
                  <span>{t({
                    en: "Occupied-room PM2.5 at least 50% below outdoor levels with verified resident access and adequate ventilation.",
                    th: "PM2.5 ในห้องที่มีคนอยู่ลดลงอย่างน้อย 50% เทียบกับอากาศภายนอก พร้อมการเข้าถึงที่ตรวจสอบได้และการระบายอากาศที่เพียงพอ",
                    zh: "有人房间内 PM2.5 较室外实测水平降低至少 50%，具备经核实的居民进出条件与充足通风。",
                  })}</span>
                </div>
                <div className="home-field-op-limit">
                  <strong>{t({ en: "Operating limit:", th: "ข้อจำกัดการใช้งาน:", zh: "运营边界：" })}</strong>{" "}
                  {t({
                    en: "Tangible decision support, not proof of automated dispatch, formal adoption or clinical outcomes.",
                    th: "เป็นการสนับสนุนการตัดสินใจ ไม่ใช่หลักฐานการสั่งการอัตโนมัติ การนำไปใช้อย่างเป็นทางการ หรือผลลัพธ์ทางสุขภาพ",
                    zh: "属于实质性决策支持，并非自动调度、官方正式采纳或临床效果的证明。",
                  })}
                </div>
              </div>
            </article>

            {/* Card 2: Nakhon Si Thammarat Flood Operations */}
            <article className="home-field-op-card">
              <div className="home-field-op-media">
                <ResponsiveImage
                  src="/photos/delivery-brief/nakhon-flood-operations.webp"
                  alt={t({ en: "Nakhon Si Thammarat flood operations monitoring interface", th: "หน้าจอศูนย์เฝ้าระวังน้ำท่วมนครศรีธรรมราช", zh: "洛坤防汛运营监控界面" })}
                  className="home-field-op-img"
                  width={1170}
                  height={751}
                  loading="lazy"
                />
                <span className="home-field-op-badge">NST FLOOD OPS · 21 OCT 2026</span>
              </div>
              <div className="home-field-op-body">
                <div className="home-field-op-header">
                  <h3 className="home-field-op-title">{t({ en: "Nakhon Si Thammarat Flood Operations", th: "ศูนย์เฝ้าระวังน้ำท่วมนครศรีธรรมราช", zh: "洛坤洪涝运营监控系统" })}</h3>
                  <span className="home-field-op-tag">{t({ en: "Priority 2", th: "ลำดับความสำคัญ 2", zh: "第二优先级" })}</span>
                </div>
                <p className="home-field-op-desc">
                  {t({
                    en: "Hydrological telemetry separating upstream Khao Luang mountain runoff, Tha Di/Tha Wang city canals, and Pak Nakhon coastal discharge, tracking remaining bridge clearance (PTTEP3: 0.36m / 36h lead time).",
                    th: "โทรมาตรอุทกวิทยาแยกการไหลของน้ำป่าต้นน้ำเขาหลวง คลองในเมืองท่าดี-ท่าวัง และทางออกทะเลปากนคร พร้อมติดตามระยะถึงตลิ่งสะพานนางพระยา-บางหลวง (PTTEP3: 0.36 ม. / เตือนล่วงหน้า 36 ชม.)",
                    zh: "水文遥测系统分段监控：考銮山东麓山区径流、城内塔迪与塔旺运河瓶颈、以及北洛坤入海口排水，实时追踪桥梁净空（PTTEP3 剩余 0.36 米，36 小时预警）。",
                  })}
                </p>
                <div className="home-field-op-target">
                  <span className="home-field-op-target-label">{t({ en: "12-Month Acceptance Gate:", th: "เกณฑ์ตรวจรับ 12 เดือน:", zh: "12个月验收门槛：" })}</span>
                  <span>{t({
                    en: "25% reduction in household disruption hours and market trading hours lost under comparable rainfall events.",
                    th: "ลดชั่วโมงความเสียหายต่อครัวเรือนและชั่วโมงหยุดทำการของตลาดลง 25% ภายใต้เหตุการณ์ฝนตกที่เทียบเคียงกัน",
                    zh: "在相当雨量事件下，使家庭受灾时长与市场停业损失时长减少 25%。",
                  })}</span>
                </div>
                <div className="home-field-op-limit">
                  <strong>{t({ en: "Operating limit:", th: "ข้อจำกัดการใช้งาน:", zh: "运营边界：" })}</strong>{" "}
                  {t({
                    en: "Bank clearance indicates gauge height, not street-level depth; physical bottlenecks and high tides govern real flooding.",
                    th: "ระยะถึงตลิ่งบอกระดับน้ำที่สถานี ไม่ใช่ความลึกบนถนน คอขวดทางกายภาพและน้ำทะเลหนุนเป็นตัวกำหนดน้ำท่วมจริง",
                    zh: "堤岸净空反映测站水位，非街道实际积水水深；物理瓶颈与天文潮位直接制约排涝实效。",
                  })}
                </div>
              </div>
            </article>
          </div>

          {/* Delivery Evidence Reality Matrix */}
          <div className="home-delivery-matrix">
            <h3 className="home-matrix-title">{t({ en: "Four Empirical Reality Checks (Evidence Brief 2024–2026)", th: "สี่ข้อเท็จจริงเชิงประจักษ์ (จากรายงานหลักฐานการส่งมอบ 2567–2569)", zh: "四大实证事实核验 (交付实证简报 2024–2026)" })}</h3>
            <div className="home-matrix-grid">
              <div className="home-matrix-cell">
                <span className="home-matrix-num">01 · FISCAL</span>
                <h4>{t({ en: "Own-Source Revenue ~7.7%", th: "รายได้จัดเก็บเอง ~7.7%", zh: "地方自主收入 ~7.7%" })}</h4>
                <p>{t({
                  en: "Thai local authorities generate THB44.8B out of THB584.5B total revenue. While 5 surveyed cities held surpluses, only 3 of 26 concepts were ready for PPP proposals (World Bank 2024). Affordability and procurement must be funded, not assumed.",
                  th: "อปท. จัดเก็บเองได้เพียง 44.8 พันล้านจาก 584.5 พันล้านบาท แม้ 5 เมืองมีเงินเกินดุล แต่มีเพียง 3 จาก 26 แนวคิดที่พร้อมเปิดรับข้อเสนอ PPP (ธนาคารโลก 2024) ความพร้อมการจัดซื้อต้องได้รับการสนับสนุน",
                  zh: "泰国地方政府总收入 5845 亿泰铢中自主收入仅 448 亿。调查的 5 座城市虽有盈余，但 26 个概念中仅 3 个具备 PPP 招标条件（世行 2024）。支付能力与采购必须资金先行，不能想当然。",
                })}</p>
              </div>
              <div className="home-matrix-cell">
                <span className="home-matrix-num">02 · HEALTH</span>
                <h4>{t({ en: "Heat & Haze Mortality", th: "การเสียชีวิตจากความร้อนและหมอกควัน", zh: "极端高温与雾霾死亡" })}</h4>
                <p>{t({
                  en: "Bangkok localized modeling estimates an additional 1°C adds 827–1,158 heat-related deaths annually (World Bank & BMA 2025). Northern haze episodes correlate with significant COPD readmission increases (Sapbamrer 2024).",
                  th: "แบบจำลองสภาพภูมิอากาศกรุงเทพฯ ชี้ว่าอุณหภูมิที่เพิ่ม 1°C จะเพิ่มผู้เสียชีวิต 827–1,158 คนต่อปี (ธนาคารโลก & กทม. 2025) หมอกควันภาคเหนือเชื่อมโยงกับการกลับเข้ารักษาซ้ำจากโรคปอดเรื้อรัง (2024)",
                  zh: "曼谷局部建模预测气温每升 1°C 将导致每年增加 827–1,158 例热相关死亡（世行与 BMA 2025）。北部雾霾期与慢性阻塞性肺病再入院显著正相关（Sapbamrer 2024）。",
                })}</p>
              </div>
              <div className="home-matrix-cell">
                <span className="home-matrix-num">03 · HYDROLOGY</span>
                <h4>{t({ en: "Compound Deltaic Risk", th: "ความเสี่ยงน้ำท่วมซ้ำซ้อนในดินดอนสามเหลี่ยม", zh: "三角洲复合洪涝风险" })}</h4>
                <p>{t({
                  en: "Bangkok flood risk combines compressible deltaic clay, localized groundwater withdrawal, and combined fluvial-tidal surges (Soonthornrangsan 2025). Dashboards cannot eliminate physical catchment engineering barriers.",
                  th: "ความเสี่ยงน้ำท่วมกรุงเทพฯ ประกอบด้วยดินเหนียวอัดตัวได้ การสูบน้ำบาดาล และน้ำหนุนผสมน้ำหลาก (2025) แดชบอร์ดไม่สามารถข้ามข้อจำกัดวิศวกรรมลุ่มน้ำทางกายภาพได้",
                  zh: "曼谷防汛难点交织着压缩性三角洲软黏土、局部地下水抽取及江河潮水顶托（Soonthornrangsan 2025）。单纯软件大屏无法取代跨部门水系流域工程。",
                })}</p>
              </div>
              <div className="home-matrix-cell">
                <span className="home-matrix-num">04 · EQUITY</span>
                <h4>{t({ en: "74.1% Foundational Skills Gap", th: "74.1% ขาดทักษะดิจิทัลพื้นฐาน", zh: "74.1% 缺乏基础数字技能" })}</h4>
                <p>{t({
                  en: "Internet use reached 89.7% among age 6+, but drops to 29.3% for age 80+. 74.1% of adults fall below foundational digital-skills thresholds (NSO / World Bank). Phone and in-person assistance must remain inside civic services.",
                  th: "การใช้อินเทอร์เน็ตถึง 89.7% ในกลุ่มอายุ 6 ปีขึ้นไป แต่ลดเหลือ 29.3% ในกลุ่ม 80 ปีขึ้นไป ผู้ใหญ่ 74.1% ขาดทักษะดิจิทัลพื้นฐาน โทรศัพท์และการช่วยเหลือแบบพบหน้าต้องคงอยู่ในบริการเมือง",
                  zh: "6岁以上互联网普及率达 89.7%，但 80岁以上降至 29.3%。74.1% 成年人低于基础数字技能门槛（NSO/世行）。热线电话与线下人工辅助必须内置于市政服务。",
                })}</p>
              </div>
            </div>
          </div>
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
                      {getDistinctProvinceName(city, locale) && <span>{getDistinctProvinceName(city, locale)}</span>}
                      <span className="regional-champion-score">{city.compositeScore.toFixed(1)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ─── ROAD SAFETY CHAMPIONS ─── */}
        {roadEvidence.source && roadEvidence.entries.length > 0 ? (
          <section
            className="section reveal visible"
            aria-label={t({ en: "Provincial road-death evidence", th: "หลักฐานการเสียชีวิตบนถนนระดับจังหวัด", zh: "省级道路死亡记录" })}
          >
            <p className="eyebrow">{t({ en: "Road deaths · Reference data", th: "ผู้เสียชีวิตบนถนน · ข้อมูลอ้างอิง", zh: "道路死亡 · 参考数据" })} · {roadEvidence.source.year}</p>
            <h2 className="home-section-title">
              {t({
                en: "Five largest recorded totals among indexed provinces",
                th: "ห้าจังหวัดในดัชนีที่มีจำนวนผู้เสียชีวิตบันทึกไว้สูงสุด",
                zh: "本指数所涉省份中记录死亡人数最多的五省",
              })}
            </h2>
            <ul className="regional-champions road-safety-champions">
              {roadEvidence.entries.map(({ city, deaths }) => (
                <li key={city.id}>
                  <button
                    type="button"
                    className="regional-champion-btn"
                    onClick={() => onNavigate(`/city/${city.id}`)}
                  >
                    <span className="regional-champion-region" style={{ color: "var(--gold-text, #946B0C)" }}>
                      {t({ en: `Dossier: ${getCityName(city, locale)}`, th: `แฟ้มเมือง: ${getCityName(city, locale)}`, zh: `档案：${getCityName(city, locale)}` })}
                    </span>
                    <span className="regional-champion-city">{getProvinceName(city, locale)}</span>
                    <span className="regional-champion-meta">
                      <span>{t({ en: "deaths", th: "ผู้เสียชีวิต", zh: "登记死亡" })}</span>
                      <span className="regional-champion-score" style={{ color: "var(--gold-text, #946B0C)" }}>
                        {deaths.toLocaleString(locale === "zh" ? "zh-CN" : locale === "th" ? "th-TH" : "en-US")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="home-section-note">
              {t({
                en: "Annual registered deaths in the province, not in the named city. Counts are not population-adjusted rates or a ranking of personal risk. City names open the associated dossiers.",
                th: "จำนวนผู้เสียชีวิตที่บันทึกในจังหวัดตลอดปี ไม่ใช่จำนวนในเมืองที่ระบุ ตัวเลขนี้ไม่ได้ปรับตามประชากรและไม่ใช่อันดับความเสี่ยงส่วนบุคคล ชื่อเมืองเปิดแฟ้มเมืองที่เกี่ยวข้อง",
                zh: "全年省级登记死亡人数，并非所列城市的死亡人数。原始计数未经人口调整，不是个人风险排名。城市名称链接至相关档案。",
              })}
              {" "}<a href={roadEvidence.source.catalogUrl} target="_blank" rel="noreferrer">{t({ en: "Source: integrated road-traffic death registry ↗", th: "ที่มา: ระบบบูรณาการข้อมูลการตายจากอุบัติเหตุทางถนน ↗", zh: "来源：道路交通死亡综合登记系统 ↗" })}</a>
              {" "}<button type="button" onClick={() => onNavigate("/baseline")}>{t({ en: "Inspect the baseline →", th: "ตรวจข้อมูลฐาน →", zh: "查看基线数据 →" })}</button>
            </p>
          </section>
        ) : (
          <section className="section reveal visible" aria-label={t({ en: "Road-death data unavailable", th: "ไม่มีข้อมูลการเสียชีวิตบนถนนที่ใช้เปรียบเทียบได้", zh: "道路死亡数据不可用" })}>
            <p className="home-section-note">{t({
              en: "No comparable province records are available for this selection. No estimates are substituted.",
              th: "ไม่มีข้อมูลระดับจังหวัดที่ใช้เปรียบเทียบได้สำหรับรายการนี้ ระบบไม่แทนค่าด้วยข้อมูลประมาณการ",
              zh: "当前选择没有可比较的省级记录，系统不会用估算值填补。",
            })}</p>
          </section>
        )}

        {/* ─── TOP 5 PHOTO PODIUM ─── */}
        {top5.length >= 5 && (() => {
          const leader = top5[0];
          const leaderStats = (["livability", "economy", "safety"] as const)
            .map(pillar => `${PILLAR_LABELS[locale][pillar]} ${leader.scores[pillar]}/100`);
          const leaderPhoto = getCityPhotoAsset(leader);
          return (
            <section ref={podiumRef} className={`reveal stagger-2 ${podiumVisible ? "visible" : ""}`}>
              <p className="eyebrow">{t({ en: "Top five · curated scores", th: "ห้าอันดับแรก · คะแนนวิจัย", zh: "前五名 · 编辑研究评分" })}</p>
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
                      {leaderStats.map((stat, i) => (
                        <span key={i} className="podium-photo-stat">{stat}</span>
                      ))}
                    </div>
                    <div className="podium-photo-vibe">{getCityVibe(leader, locale)}</div>
                  </div>
                </button>
                <div className="podium-photo-grid">
                  {top5.slice(1).map((city, i) => {
                    const photo = getCityPhotoAsset(city);
                    const cityStats = (["livability", "economy"] as const)
                      .map(pillar => `${PILLAR_LABELS[locale][pillar]} ${city.scores[pillar]}/100`);
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
                            {cityStats.map((stat, j) => (
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
              en: "Explore cities by topic",
              th: "สำรวจเมืองตามหัวข้อ",
              zh: "按主题探索城市",
            })}
          </h2>
          <p className="section-intro">{t({
            en: "Editorial selections. All values are curated overall scores /100, not sector measurements.",
            th: "รายชื่อคัดสรรโดยผู้จัดทำ ตัวเลขทั้งหมดเป็นคะแนนประเมินรวมเต็ม 100 ไม่ใช่ค่าที่ตรวจวัดเฉพาะด้าน",
            zh: "编辑选单。所有数值均为编辑评估的综合分数，满分100，并非各领域的实测值。",
          })}</p>
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
                          data-city-id={city.id}
                          onClick={() => onNavigate(`/city/${city.id}`)}
                        >
                          <span className="home-collection-chip-name">{getCityName(city, locale)}</span>
                          {getDistinctProvinceName(city, locale) && <span className="home-collection-chip-meta">{getDistinctProvinceName(city, locale)}</span>}
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
            <p className="eyebrow">{t({ en: "Editor's reading list", th: "เรื่องคัดอ่านโดยบรรณาธิการ", zh: "编辑选读" })}</p>
            <span className="weekly-stamp">{formatWeeklyStamp(WEEKLY_DIGEST.weekOf, locale)}</span>
          </div>
          <div className="weekly-digest glass-card">
            {digestCity && (
              <button
                type="button"
                className="weekly-digest-slot"
                onClick={() => onNavigate(`/city/${digestCity.id}`)}
              >
                <span className="weekly-digest-label">{t({ en: "City to investigate", th: "เมืองที่ควรศึกษาต่อ", zh: "待研究城市" })}</span>
                <span className="weekly-digest-headline">{getCityName(digestCity, locale)}</span>
                <span className="weekly-digest-note">{translate(locale, WEEKLY_DIGEST.trendingCity.note)}</span>
              </button>
            )}
            <a
              className="weekly-digest-slot"
              href={`https://www.google.com/search?q=${encodeURIComponent(translate(locale, WEEKLY_DIGEST.trendingSearch.phrase))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="weekly-digest-label">{t({ en: "Suggested research query", th: "คำค้นสำหรับศึกษาต่อ", zh: "建议检索词" })}</span>
              <span className="weekly-digest-headline">{translate(locale, WEEKLY_DIGEST.trendingSearch.phrase)} ↗</span>
              <span className="weekly-digest-note">{translate(locale, WEEKLY_DIGEST.trendingSearch.deltaLabel)}</span>
            </a>
            <a
              className="weekly-digest-slot"
              href={WEEKLY_DIGEST.headline.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="weekly-digest-label">{t({ en: "Primary source", th: "แหล่งข้อมูลต้นทาง", zh: "一手来源" })}</span>
              <span className="weekly-digest-headline">{translate(locale, WEEKLY_DIGEST.headline.title)}</span>
              <span className="weekly-digest-note">{translate(locale, WEEKLY_DIGEST.headline.gloss)} ↗</span>
            </a>
          </div>
        </section>

        {/* ─── FEEDBACK & CONTRIBUTIONS ─── */}
        <section ref={feedbackRef} className={`section reveal stagger-4 ${feedbackVisible ? "visible" : ""}`}>
          <div className="feedback-cta glass-card shadow-premium">
            <h2>{t({ en: "Is your city missing?", th: "เมืองของคุณยังไม่อยู่ในดัชนี?", zh: "您的城市不在名单上？" })}</h2>
            <p>{t({ en: "Help improve a city dossier with a dated, checkable source.", th: "ช่วยปรับปรุงแฟ้มเมืองด้วยแหล่งข้อมูลที่ระบุวันที่และตรวจสอบได้", zh: "提供带日期、可核查的来源，帮助完善城市档案。" })}</p>
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
                en: "Download the city scores, metrics and provenance exports. SCITI publishes its research layer and deterministic equation under CC BY 4.0. Upstream data and images keep their own terms. Audit the method and build on the research.",
                th: "ดาวน์โหลดคะแนนเมือง ตัวชี้วัด และไฟล์แสดงที่มา SCITI เผยแพร่ชั้นงานวิจัยและสมการที่คำนวณตายตัวภายใต้ CC BY 4.0 ข้อมูลต้นทางและภาพมีเงื่อนไขของตนเอง ตรวจสอบวิธีประเมินและนำงานวิจัยไปต่อยอดได้",
                zh: "下载城市评分、指标及溯源文件。SCITI以CC BY 4.0公开研究层及确定性公式；上游数据与图片保留各自条款。可核查方法并继续开展研究。",
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
              <a href={assetUrl("/downloads/SCITI-2026-Methodology.pdf")} download className="export-doc-link">{t({ en: "Methodology Paper (PDF)", th: "เอกสารระเบียบวิธี (PDF)", zh: "方法论文 (PDF)" })}</a>
              <a href={assetUrl("/downloads/SCITI-2026-cities-dataset.csv")} download className="export-doc-link">{t({ en: "City Dataset (CSV, 118 cities)", th: "ชุดข้อมูลเมือง (CSV, 118 เมือง)", zh: "城市数据集 (CSV, 118城市)" })}</a>
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
          <h2>{t({ en: "Secondary cities to investigate", th: "เมืองรองที่ควรศึกษาต่อ", zh: "值得深入调查的二线城市" })}</h2>
          <p className="investor-lead">
            {t({
              en: "Selection: Beta cities, operational label, economy score ≥55. Curated data: verify services, costs, air quality and investment suitability in each dossier, including sources and dates.",
              th: "เกณฑ์คัด: เมือง Beta ที่ระบุว่าเดินระบบและคะแนนเศรษฐกิจ ≥55 ข้อมูลนี้เรียบเรียงไว้ ควรตรวจบริการ ต้นทุน อากาศ ความเหมาะสมลงทุน แหล่งข้อมูลและวันที่ในแฟ้มเมือง",
              zh: "筛选：标为运营中、经济评分 ≥55 的 Beta 城市。数据经编辑整理；请在档案中核查服务、成本、空气、投资适合程度、来源与日期。",
            })}
          </p>
          <div className="investor-grid">
            {cities.filter(c => c.tier === "beta" && c.reality === "operational" && c.scores.economy >= 55).slice(0, 6).map(city => (
              <button key={city.id} className="investor-card" data-city-id={city.id} onClick={() => onNavigate(`/city/${city.id}`)}>
                <span className="investor-card-name">{getCityName(city, locale)}</span>
                <span className="investor-card-score">{city.compositeScore.toFixed(1)}<span className="investor-score-unit">/100</span></span>
                <span className="investor-card-meta">
                  {getDistinctProvinceName(city, locale) && <span className="investor-card-province">{getDistinctProvinceName(city, locale)}</span>}
                  <span className="investor-card-vibe">{getCityVibe(city, locale)}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="investor-cta-text">
            {t({
              en: "Before committing, compare land and lease prices, utility capacity, demand and staffing. BOI eligibility depends on project activity and conditions; listing here or EEC proximity grants no automatic benefit.",
              th: "ก่อนตัดสินใจ เทียบราคาที่ดิน ค่าเช่า กำลังสาธารณูปโภค อุปสงค์และบุคลากร สิทธิ BOI ขึ้นกับกิจการและเงื่อนไขโครงการ การอยู่ในรายชื่อนี้หรือใกล้ EEC ไม่ให้สิทธิอัตโนมัติ",
              zh: "决策前比较土地及租金、公用设施容量、需求和人员。BOI 资格取决于项目活动及条件；入选名单或靠近 EEC 不会自动获得优惠。",
            })}
          </p>
          <a href="https://www.boi.go.th/index.php?page=eligible_activities&amp;language=en" target="_blank" rel="noreferrer">{t({ en: "Check BOI eligible activities and conditions ↗", th: "ตรวจประเภทกิจการและเงื่อนไข BOI ↗", zh: "核查 BOI 合格活动与条件 ↗" })}</a>
        </div>
      </section>

      {/* ─── NEWS + DATA DENSITY + LEGAL ─── */}
      <NewsStrip locale={locale} />

    </div>
  );
}
