import { useEffect, lazy, Suspense, useState } from "react";
import { parseRoute, getRouteKey, type Route } from "./routing";
import { syncDocumentMeta } from "./siteMeta";
import { ResponsiveImage } from "./mediaAssets";
import TopbarNav from "./TopbarNav";
import type { Locale } from "./types";
import { trackVisitor } from "./visitorTracking";
import { ErrorBoundary } from "./ErrorBoundary";

import HomePage from "./HomePage";
import RankingsPage from "./RankingsPage";
import CityDetailPage from "./CityDetailPage";

const MethodologyPage = lazy(() => import("./MethodologyPage"));
const StoryPage = lazy(() => import("./StoryPage"));
const WhyPage = lazy(() => import("./WhyPage"));
const ShowcasePage = lazy(() => import("./ShowcasePage"));
const GeminiChat = lazy(() => import("./GeminiChat"));
const PartnershipsPage = lazy(() => import("./PartnershipsPage"));
const MapDashboardPage = lazy(() => import("./MapDashboardPage"));
const AsusPage = lazy(() => import("./AsusPage"));
const AuditPage = lazy(() => import("./AuditPage"));
const ReferencesPage = lazy(() => import("./ReferencesPage"));
const ProgramPage = lazy(() => import("./ProgramPage"));
const KnowledgePage = lazy(() => import("./KnowledgePage"));
const DiscoverPage = lazy(() => import("./DiscoverPage"));
const InvestPage = lazy(() => import("./InvestPage"));
const ComparePage = lazy(() => import("./ComparePage"));
const ScitiBingoPage = lazy(() => import("./ScitiBingoPage"));
const CityCanvasPage = lazy(() => import("./CityCanvasPage"));
import DataFeedback from "./DataFeedback";

const LOCALE_STORAGE_KEY = "smart-city-thailand-locale";
const THEME_STORAGE_KEY = "smart-city-thailand-theme";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") return "dark";
  return "light";
}

// Phase 2.4 — NAV_ITEMS replaced by NAV_GROUPS in src/TopbarNav.tsx,
// which consolidates 13 flat nav items into 5 grouped dropdowns
// (Home · Rankings · Method · Stories · Network).

const MDES_LOGO = {
  src: "/mdes_logo.jpg",
  width: 381,
  height: 132,
};

const DEPA_LOGO = {
  src: "/depa_logo.jpg",
  width: 1182,
  height: 798,
};

const SMART_CITY_LOGO = {
  src: "/smart_city_thailand_logo.jpg",
  width: 1182,
  height: 1182,
};

const SLIC_LOGO = {
  src: "/slic_logo.jpg",
  width: 200,
  height: 200,
};

type PageHeroCopy = { en: string; th: string; zh: string };
type StaticHeroKind = Exclude<Route["kind"], "home" | "city" | "canvas">;
type PageHeroAsset = {
  src: string;
  objectPosition?: string;
  title: PageHeroCopy;
  place: string;
};

const PAGE_HERO_ASSETS: Record<StaticHeroKind, PageHeroAsset> = {
  rankings: {
    src: "/photos/khonkaen-aerial.jpg",
    objectPosition: "center 48%",
    title: { en: "Rankings", th: "อันดับเมือง", zh: "城市排名" },
    place: "Khon Kaen",
  },
  discover: {
    src: "/photos/wp-songkhla.jpg",
    objectPosition: "center 52%",
    title: { en: "Find Your City", th: "ค้นหาเมืองของคุณ", zh: "寻找你的城市" },
    place: "Songkhla",
  },
  program: {
    src: "/photos/wp-samut-prakan.jpg",
    objectPosition: "center 50%",
    title: { en: "Smart City Program", th: "โครงการเมืองอัจฉริยะ", zh: "智慧城市计划" },
    place: "Samut Prakan",
  },
  methodology: {
    src: "/photos/wiki-bangkok-bts.jpg",
    objectPosition: "center 52%",
    title: { en: "Methodology", th: "วิธีการประเมิน", zh: "评估方法" },
    place: "Bangkok",
  },
  story: {
    src: "/photos/chiangmai-night.jpg",
    objectPosition: "center 44%",
    title: { en: "Story", th: "เรื่องราว", zh: "故事" },
    place: "Chiang Mai",
  },
  why: {
    src: "/photos/report-city-night.jpg",
    objectPosition: "center 55%",
    title: { en: "Why SCITI", th: "ทำไมต้อง SCITI", zh: "为什么是 SCITI" },
    place: "Bangkok",
  },
  showcase: {
    src: "/Nakhon%20Si%20Thammarat/Z03A4010-3946608958.jpg",
    objectPosition: "center 10%",
    title: { en: "Nakhon Si Thammarat", th: "นครศรีธรรมราช", zh: "洛坤府" },
    place: "Nakhon Si Thammarat",
  },
  partners: {
    src: "/photos/wp-rattanakosin.jpg",
    objectPosition: "center 54%",
    title: { en: "Partners", th: "พันธมิตร", zh: "伙伴" },
    place: "Rattanakosin",
  },
  map: {
    src: "/photos/wp-makkasan.jpg",
    objectPosition: "center 50%",
    title: { en: "National Map", th: "แผนที่ประเทศ", zh: "全国地图" },
    place: "Makkasan",
  },
  asus: {
    src: "/photos/phuket-smart-city.jpg",
    objectPosition: "center 48%",
    title: { en: "ASUS Collaboration", th: "ความร่วมมือ ASUS", zh: "ASUS 合作" },
    place: "Phuket",
  },
  audit: {
    src: "/photos/wp-chanthaburi.jpg",
    objectPosition: "center 45%",
    title: { en: "Audit", th: "การตรวจสอบ", zh: "审计" },
    place: "Chanthaburi",
  },
  references: {
    src: "/photos/samyan-smart-city.jpg",
    objectPosition: "center 45%",
    title: { en: "References", th: "แหล่งอ้างอิง", zh: "参考资料" },
    place: "Samyan",
  },
  knowledge: {
    src: "/photos/cmu-doiSuthep.jpg",
    objectPosition: "center 45%",
    title: { en: "Knowledge Base", th: "คลังความรู้", zh: "知识库" },
    place: "Chiang Mai",
  },
  invest: {
    src: "/photos/phuket-smart-city.jpg",
    objectPosition: "center 50%",
    title: { en: "Invest", th: "ลงทุน", zh: "投资" },
    place: "Phuket",
  },
  compare: {
    src: "/photos/wiki-wat-arun.jpg",
    objectPosition: "center 58%",
    title: { en: "Compare Cities", th: "เปรียบเทียบเมือง", zh: "城市对比" },
    place: "Bangkok",
  },
  bingo: {
    src: "/photos/khonkaen-smart-city.jpg",
    objectPosition: "center 50%",
    title: { en: "SCITI Bingo", th: "SCITI บิงโก", zh: "SCITI 宾果" },
    place: "Khon Kaen",
  },
};

const newsItems = [
  {
    date: "2026-05-20",
    titleEn: "SCITI 2026 submitted to Red Dot Design Award — open-data scorecard for 118 Thai cities",
    titleTh: "SCITI 2026 ส่งเข้าประกวด Red Dot Design Award — ตารางคะแนนข้อมูลเปิดสำหรับ 118 เมือง",
    titleZh: "SCITI 2026 提交红点设计奖——覆盖 118 座泰国城市的开放数据评分卡",
    url: "https://www.depa.or.th/en/smartcity",
    source: "depa / SCITI",
  },
  {
    date: "2026-03-18",
    titleEn: "SLIC Index V2 launched at Smart City Summit & Expo 2026 in Taipei",
    titleTh: "SLIC Index V2 เปิดตัวบนเวที SCSE 2026 ไทเป",
    titleZh: "SLIC Index V2 在 2026 台北智慧城市展发布",
    url: "https://slic-index.onrender.com/history",
    source: "SLIC Index",
  },
  {
    date: "2026-03-17",
    titleEn: "Dr. Non keynotes City Vision in Action stage at SCSE Taipei — Taiwan VP opens event",
    titleTh: "ดร.ณณ ขึ้นเวที City Vision in Action ที่ SCSE ไทเป รองประธานาธิบดีไต้หวันเปิดงาน",
    titleZh: "Non 博士在台北 SCSE City Vision in Action 主舞台发表主题演讲，台湾副总统开幕",
    url: "https://en.smartcity.org.tw/index.php/en-us/",
    source: "SCSE 2026",
  },
  {
    date: "2026-03",
    titleEn: "depa advances smart city from grassroots — upgrading safety and quality of life nationwide",
    titleTh: "depa ต่อยอดเมืองอัจฉริยะจากฐานราก ยกระดับความปลอดภัยและคุณภาพชีวิตทั่วประเทศ",
    titleZh: "depa 从基层推进智慧城市，提升全国安全与生活质量",
    url: "https://www.nexttopbrand.com/2026/03/depa.html",
    source: "NextTopBrand",
  },
  {
    date: "2026-02",
    titleEn: "depa and DLA co-design new mechanism to drive Smart City for local governments",
    titleTh: "depa ร่วม สถ. ออกแบบกลไกใหม่ขับเคลื่อน Smart City มุ่งยกระดับท้องถิ่น",
    titleZh: "depa 与地方行政厅共同设计地方智慧城市新机制",
    url: "https://smartcitythailand.com/depa-smart-city/",
    source: "Smart City Thailand",
  },
  {
    date: "2025-11",
    titleEn: "Phuket Tinicon Valley receives Smart City Local logo — 43 new promotion zones certified",
    titleTh: "ภูเก็ตทินิคอนวัลเลย์ได้รับตราสัญลักษณ์ — ประกาศเขตส่งเสริม 43 แห่ง",
    titleZh: "普吉 Tinicon Valley 获得智慧城市标识，新增 43 个推广区",
    url: "https://www.depa.or.th/th/smart-city-plan/existing-smart-city",
    source: "depa",
  },
  {
    date: "2025",
    titleEn: "depa pushes Smart City targeting 105 inclusive cities by 2027",
    titleTh: "depa ผลักดันเมืองอัจฉริยะ เป้า 105 เมืองภายในปี 2570",
    titleZh: "depa 推动智慧城市计划，目标到 2027 年达到 105 座包容型城市",
    url: "https://www.nationthailand.com/blogs/sustaination/40057822",
    source: "Nation Thailand",
  },
];

function getInitialLocale(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "th" || stored === "zh") {
    return stored;
  }
  return "en";
}

function PagePhotoHero({ route, locale }: { route: Route; locale: Locale }) {
  if (route.kind === "home" || route.kind === "city" || route.kind === "showcase" || route.kind === "canvas") return null;
  const hero = PAGE_HERO_ASSETS[route.kind as StaticHeroKind];
  if (!hero) return null;

  return (
    <section className={`route-photo-hero route-photo-hero-${route.kind}`} aria-label={hero.title[locale]}>
      <ResponsiveImage
        src={hero.src}
        alt={hero.place}
        className="route-photo-hero-img"
        style={{ objectPosition: hero.objectPosition ?? "center center" }}
        loading="eager"
      />
      <div className="route-photo-hero-overlay">
        <span className="route-photo-hero-place">{hero.place}</span>
        <p className="route-photo-hero-title">{hero.title[locale]}</p>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topbarScrolled, setTopbarScrolled] = useState(false);
  const isDashboardRoute = route.kind === "home";
  const isCanvasRoute = route.kind === "canvas";

  useEffect(() => {
    const sync = () => {
      setRoute(parseRoute(window.location.pathname));
      setMobileMenuOpen(false);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // Use more specific BCP-47 tags — zh-Hans for Simplified Chinese
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    syncDocumentMeta(route.path, locale);
  }, [locale, route]);

  // Scroll-aware topbar: add .topbar-scrolled after 4 px to reveal a subtle separator
  useEffect(() => {
    const handleScroll = () => setTopbarScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track visitor once per session (fire-and-forget to Google Sheets)
  useEffect(() => { trackVisitor(window.location.pathname); }, []);

  const navigate = (path: string) => {
    const base = import.meta.env.BASE_URL || "/";
    const fullPath = path.startsWith(base) ? path : base.replace(/\/$/, "") + path;
    if (window.location.pathname !== fullPath) {
      window.history.pushState({}, "", fullPath);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setRoute(parseRoute(fullPath));
    setMobileMenuOpen(false);
  };

  const cycleLocale = () => setLocale(l => l === "en" ? "th" : l === "th" ? "zh" : "en");
  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <div className={`page-shell ${isDashboardRoute ? "page-shell-dashboard" : ""} ${isCanvasRoute ? "page-shell-canvas" : ""}`}>
      {/* ─── INSTITUTIONAL BANNER ─── */}
      <a href="#main-content" className="skip-link">Skip to content</a>
      {!isCanvasRoute && (
        <div className="institutional-banner">
        <div className="institutional-logos">
          <div className="institutional-logo-container">
            <ResponsiveImage
              src={MDES_LOGO.src}
              alt={locale === "th" ? "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม" : "Ministry of Digital Economy and Society"}
              className="institutional-logo"
              width={MDES_LOGO.width}
              height={MDES_LOGO.height}
              loading="eager"
            />
          </div>
          <div className="institutional-logo-container">
            <ResponsiveImage
              src={DEPA_LOGO.src}
              alt={locale === "th" ? "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล" : "Digital Economy Promotion Agency (depa)"}
              className="institutional-logo"
              width={DEPA_LOGO.width}
              height={DEPA_LOGO.height}
              loading="eager"
            />
          </div>
          <div className="institutional-logo-container">
            <ResponsiveImage
              src={SMART_CITY_LOGO.src}
              alt={locale === "th" ? "สำนักงานเมืองอัจฉริยะประเทศไทย" : "Smart City Thailand Office"}
              className="institutional-logo"
              width={SMART_CITY_LOGO.width}
              height={SMART_CITY_LOGO.height}
              loading="eager"
            />
          </div>
        </div>
      </div>
      )}

      {/* ─── TOPBAR ─── */}
      {!isCanvasRoute && (
        <nav className={`topbar${topbarScrolled ? " topbar-scrolled" : ""}`}>
        <button type="button" className="brand-lockup" onClick={() => navigate("/")}>
          <div className="institutional-logo-container" style={{ padding: '2px', marginRight: '8px' }}>
            <ResponsiveImage
              src={SMART_CITY_LOGO.src}
              alt="Smart City Thailand"
              className="brand-logo"
              width={SMART_CITY_LOGO.width}
              height={SMART_CITY_LOGO.height}
              loading="eager"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
          <span className="brand-name">
            {locale === "th" ? "ดัชนีเมืองอัจฉริยะไทย" : locale === "zh" ? "泰国智慧城市指数" : "Smart City Thailand Index"}
          </span>
        </button>
        <div className="topbar-actions">
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen
                ? locale === "th"
                  ? "ปิดเมนูนำทาง"
                  : locale === "zh"
                    ? "关闭导航菜单"
                    : "Close navigation menu"
                : locale === "th"
                  ? "เปิดเมนูนำทาง"
                  : locale === "zh"
                    ? "打开导航菜单"
                    : "Open navigation menu"
            }
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`nav-links ${mobileMenuOpen ? "nav-links-open" : ""}`}>
            {/* Phase 2.4 \u2014 13 flat items consolidated into 5 grouped dropdowns */}
            <TopbarNav
              locale={locale}
              currentKind={route.kind}
              onNavigate={navigate}
              mobileOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              onClick={toggleTheme}
            >
              {theme === "light" ? "\u263E" : "\u2600"}
            </button>
            <button
              type="button"
              className="locale-toggle"
              aria-label={locale === "en" ? "Switch language to Thai" : locale === "th" ? "Switch language to Chinese" : "Switch language to English"}
              onClick={cycleLocale}
            >
              {locale === "en" ? "TH" : locale === "th" ? "CN" : "EN"}
            </button>
          </div>
        </div>
      </nav>
      )}

      {/* ─── CONTENT ─── */}
      <main id="main-content" className={`page-frame ${isDashboardRoute ? "page-frame-dashboard" : ""} ${isCanvasRoute ? "page-frame-canvas" : ""}`} key={getRouteKey(route)}>
        {!isCanvasRoute && <PagePhotoHero route={route} locale={locale} />}
        <ErrorBoundary locale={locale}>
          <Suspense fallback={<div className="loading" role="status" aria-live="polite" aria-label="Loading page" />}>
            {route.kind === "rankings" ? (
              <RankingsPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "methodology" ? (
              <MethodologyPage locale={locale} />
            ) : route.kind === "story" ? (
              <StoryPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "why" ? (
              <WhyPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "showcase" ? (
              <ShowcasePage locale={locale} onNavigate={navigate} />
            ) : route.kind === "partners" ? (
              <PartnershipsPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "map" ? (
              <MapDashboardPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "asus" ? (
              <AsusPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "audit" ? (
              <AuditPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "references" ? (
              <ReferencesPage locale={locale} />
            ) : route.kind === "program" ? (
              <ProgramPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "knowledge" ? (
              <KnowledgePage locale={locale} onNavigate={navigate} />
            ) : route.kind === "discover" ? (
              <DiscoverPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "invest" ? (
              <InvestPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "compare" ? (
              <ComparePage locale={locale} onNavigate={navigate} />
            ) : route.kind === "bingo" ? (
              <ScitiBingoPage locale={locale} />
            ) : route.kind === "city" ? (
              <CityDetailPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
            ) : route.kind === "canvas" ? (
              <CityCanvasPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
            ) : (
              <HomePage locale={locale} onNavigate={navigate} />
            )}
          </Suspense>
        </ErrorBoundary>
        
        {!isCanvasRoute && <DataFeedback locale={locale} />}
      </main>

      {(!isDashboardRoute && !isCanvasRoute) && (
        <>
          {/* ─── NEWS FEED ─── */}
          <section className="news-section">
            <div className="section">
              <p className="eyebrow">{locale === "th" ? "ข่าวสาร" : locale === "zh" ? "资讯" : "News feed"}</p>
              <h2>{locale === "th" ? "ข่าวล่าสุด" : locale === "zh" ? "最新动态" : "Latest"}</h2>
              <div className="news-grid">
                {newsItems.map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="news-item">
                    <span className="news-date">{item.date}</span>
                    <span className="news-title">{locale === "th" ? item.titleTh : locale === "zh" ? item.titleZh : item.titleEn}</span>
                    <span className="news-source">{item.source} →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PARTNERS FOOTER ─── */}
          <footer className="site-footer">
            <div className="section">
              <div className="footer-partners">
                <div className="footer-partner-block">
                  <p className="footer-partner-label">{locale === "th" ? "จัดทำโดย" : locale === "zh" ? "出品机构" : "Produced by"}</p>
                  <p className="footer-partner-name">
                    {locale === "th"
                      ? "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa)"
                      : locale === "zh"
                        ? "数字经济促进局（depa）"
                        : "Digital Economy Promotion Agency (depa)"}
                  </p>
                  <p className="footer-partner-sub">
                    {locale === "th"
                      ? "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม"
                      : locale === "zh"
                        ? "泰国数字经济与社会部"
                        : "Ministry of Digital Economy and Society"}
                  </p>
                </div>
                <div className="footer-partner-block">
                  <p className="footer-partner-label">{locale === "th" ? "วิธีการโดย" : locale === "zh" ? "方法论来源" : "Methodology by"}</p>
                  <p className="footer-partner-name">SLIC — Smart Liveable Cities Index</p>
                  <p className="footer-partner-sub">
                    {locale === "th"
                      ? "เปิดตัว SCSE 2026 ไทเป · 174 เมือง 53 ประเทศ"
                      : locale === "zh"
                        ? "于 2026 台北 SCSE 发布 · 53 个国家的 174 座城市"
                        : "Launched at SCSE 2026 Taipei · 174 cities across 53 countries"}
                  </p>
                </div>
                <div className="footer-partner-block">
                  <p className="footer-partner-label">{locale === "th" ? "แหล่งข้อมูล" : locale === "zh" ? "数据来源" : "Data from"}</p>
                  <p className="footer-partner-name">NSO · World Bank · Open-Meteo · GISTDA</p>
                  <p className="footer-partner-sub">
                    {locale === "th"
                      ? "Copernicus Sentinel Hub · สำนักงานตำรวจแห่งชาติ · depa"
                      : locale === "zh"
                        ? "Copernicus Sentinel Hub · 泰国皇家警察 · depa"
                        : "Copernicus Sentinel Hub · Royal Thai Police · depa"}
                  </p>
                </div>
              </div>

              <div className="footer-logos">
                <div className="institutional-logo-container"><ResponsiveImage src={MDES_LOGO.src} alt="MDES" className="footer-logo" width={MDES_LOGO.width} height={MDES_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={DEPA_LOGO.src} alt="depa" className="footer-logo" width={DEPA_LOGO.width} height={DEPA_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={SMART_CITY_LOGO.src} alt="Smart City Thailand" className="footer-logo" width={SMART_CITY_LOGO.width} height={SMART_CITY_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={SLIC_LOGO.src} alt="SLIC Index" className="footer-logo" width={SLIC_LOGO.width} height={SLIC_LOGO.height} /></div>
              </div>

              <div className="footer-bottom">
                <p className="footer-copy" style={{ opacity: 0.5, fontSize: "0.65rem", letterSpacing: "0.06em" }}
                   title="UNDP-JTC Digital Twins for Cities (Jul 2025) · ADB Digital Twin Framework (May 2025)">
                  {locale === "th"
                    ? "SCITI คือฐาน Level 1 — Descriptive ของ Digital Twin ระดับชาติ · สอดคล้องกับ UNDP · ADB 2025"
                    : locale === "zh"
                      ? "SCITI 构成国家数字孪生的 Level 1 — Descriptive 基础层 · 与 UNDP · ADB 2025 框架对齐"
                      : "SCITI forms the Level 1 — Descriptive foundation of a national digital twin · Aligned with UNDP · ADB 2025"}
                </p>
                <p className="footer-copy">
                  {locale === "th"
                    ? "ดัชนีเมืองอัจฉริยะประเทศไทย 2026 · วัดจากความเป็นจริง ไม่ใช่แผนบนกระดาษ"
                    : locale === "zh"
                      ? "2026 泰国智慧城市指数 · 衡量现实，而非纸上规划"
                      : "Smart City Thailand Index 2026 · Measuring reality, not paper plans"}
                </p>
                <p className="footer-copy">
                  {locale === "th"
                    ? "สร้างด้วยวิธีการ SLIC · ข้อมูลเปิดเผย ตรวจสอบได้"
                    : locale === "zh"
                      ? "基于 SLIC 方法论构建 · 开放数据，可追溯可审计"
                      : "Built on SLIC methodology · Open data, fully auditable"}
                </p>
                <button
                  type="button"
                  className="footer-ref-link"
                  onClick={() => navigate("/references")}
                  style={{ background: "none", border: "none", font: "600 .42rem var(--mono)", color: "var(--teal)", cursor: "pointer", marginTop: ".15rem", padding: 0 }}
                >
                  {locale === "th" ? "API แหล่งข้อมูล และมาตรฐาน →" : locale === "zh" ? "API、数据来源与标准 →" : "APIs, Data Sources & Standards →"}
                </button>
              </div>

              {/* ─── FINE PRINT: Standards, Compliance & Accessibility ─── */}
              <div className="footer-fineprint">
                <p style={{ fontWeight: 600, color: "var(--3)", marginBottom: ".15rem", fontSize: ".44rem", letterSpacing: ".06em", textTransform: "uppercase" as const, fontFamily: "var(--mono)" }}>
                  {locale === "th" ? "เอกสารอ้างอิง SCITI-2026-R1 · ปรับปรุงล่าสุด เมษายน 2026" : locale === "zh" ? "参考文件 SCITI-2026-R1 · 最后更新：2026 年 4 月" : "Document ref. SCITI-2026-R1 · Last updated April 2026"}
                </p>
                <p>
                  {locale === "th"
                    ? "มาตรฐาน: ดัชนีนี้จัดทำขึ้นตามแนวทาง UN-Habitat City Prosperity Initiative (CPI), ISO 37122:2019 Sustainable Cities — Indicators for Smart Cities, เป้าหมาย SDG 11 (เมืองและชุมชนที่ยั่งยืน), กรอบ ASEAN Smart Cities Framework (ASCF) 2018, แผนปฏิบัติการ ASCAP 2021–2025, และ New Urban Agenda 2016."
                    : locale === "zh"
                      ? "标准：本指数参照 UN-Habitat CPI、ISO 37122:2019 智慧城市指标、SDG 11（可持续城市与社区）、ASCF 2018、ASCAP 2021–2025 及 2016 年《新城市议程》编制。"
                      : "Standards alignment: UN-Habitat City Prosperity Initiative (CPI) · ISO 37122:2019 Sustainable Cities — Indicators for Smart Cities · UN SDG 11 (Sustainable Cities and Communities) · ASEAN Smart Cities Framework (ASCF) 2018 · ASCAP 2021–2025 · New Urban Agenda 2016."}
                </p>
                <p>
                  {locale === "th"
                    ? "แหล่งข้อมูลคะแนน: สำนักงานสถิติแห่งชาติ (NSO) · สภาพัฒน์ (NESDC) · กรมควบคุมมลพิษ (PCD/Air4Thai) · GISTDA · สำนักงานตำรวจแห่งชาติ · กรมการปกครอง (DOPA) · depa registry · citydata.in.th · กระทรวงสาธารณสุข (MOPH) · BOI · ONEP · กรมป่าไม้ · Open-Meteo/Copernicus · การยืนยันภาคสนาม"
                    : locale === "zh"
                      ? "评分来源：NSO · NESDC · PCD/Air4Thai · GISTDA · 泰国皇家警察 · DOPA · depa 名录 · citydata.in.th · 公共卫生部 · BOI · ONEP · 皇家森林局 · Open-Meteo/Copernicus · 实地核验。"
                      : "Scoring sources: NSO · NESDC · PCD/Air4Thai · GISTDA · Royal Thai Police · DOPA · depa registry · citydata.in.th · Ministry of Public Health · BOI · ONEP · Royal Forest Department · Open-Meteo/Copernicus · field verification."}
                </p>
                <p>
                  {locale === "th"
                    ? "การเงิน: กลไกที่แนะนำอ้างอิงจาก ASEAN Smart City Financing Toolkit (smartcitytoolkit.asean.org) · กองทุน ACGF ของ ADB · กรอบพันธบัตรสีเขียวของ ก.ล.ต. · สิทธิประโยชน์ BOI ภายใต้นโยบาย S-Curve · UNCDF Smart Green ASEAN Cities (SGAC)"
                    : locale === "zh"
                      ? "金融机制：东盟融资工具箱 · ADB ACGF · 泰国 SEC 绿色债券框架 · BOI S-Curve 激励 · UNCDF SGAC。"
                      : "Financial mechanisms: ASEAN Smart City Financing Toolkit (smartcitytoolkit.asean.org) · ADB ACGF · Thailand SEC Green Bond Framework · BOI S-Curve incentives · UNCDF Smart Green ASEAN Cities (SGAC)."}
                </p>
                <p>
                  {locale === "th"
                    ? "การเข้าถึง: ออกแบบตาม WCAG 2.1 AA · รองรับคีย์บอร์ด · ภาพมี alt text · ตารางใช้ semantic HTML · รองรับ 3 ภาษา (EN/TH/CN) · Focus visible สำหรับ keyboard navigation"
                    : locale === "zh"
                      ? "无障碍：遵循 WCAG 2.1 AA · 支持键盘导航 · 图片含 alt 文本 · 语义化表格 · 三语支持 (EN/TH/CN)"
                      : "Accessibility: WCAG 2.1 AA compliant · Keyboard navigable · Alt text on images · Semantic HTML tables · Trilingual (EN/TH/CN) · Focus-visible indicators for assistive technology."}
                </p>
                <p style={{ borderTop: "1px solid var(--5)", paddingTop: ".35rem", marginTop: ".25rem" }}>
                  {locale === "th"
                    ? "© 2026 สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม ราชอาณาจักรไทย · วิธีการ SLIC (Smart Liveable Cities Index) · สงวนลิขสิทธิ์ · ข้อมูลเปิดเผยภายใต้สัญญาอนุญาต Creative Commons Attribution 4.0 International (CC BY 4.0) · คะแนนสะท้อนสภาพ ณ เวลาที่ประเมิน ไม่ใช่คำแนะนำการลงทุน"
                    : locale === "zh"
                      ? "© 2026 数字经济促进局（depa），泰国数字经济与社会部 · SLIC 方法论 · 版权所有 · 数据依据 CC BY 4.0 许可公开 · 评分反映评估时状况，不构成投资建议。"
                      : "© 2026 Digital Economy Promotion Agency (depa), Ministry of Digital Economy and Society, Kingdom of Thailand · SLIC (Smart Liveable Cities Index) methodology · All rights reserved · Data published under Creative Commons Attribution 4.0 International (CC BY 4.0) · Scores reflect conditions at time of assessment and do not constitute investment advice."}
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ─── GEMINI CHATBOT ─── */}
      {!isCanvasRoute && (
        <Suspense fallback={null}>
          <GeminiChat locale={locale} />
        </Suspense>
      )}
    </div>
  );
}
