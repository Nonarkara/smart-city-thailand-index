import { useEffect, lazy, Suspense, useState } from "react";
import { parseRoute, getRouteKey, type Route } from "./routing";
import { syncDocumentMeta } from "./siteMeta";
import { ResponsiveImage } from "./mediaAssets";
import TopbarNav from "./TopbarNav";
import type { Locale } from "./types";
import { trackVisitor } from "./visitorTracking";
import { ErrorBoundary } from "./ErrorBoundary";
import { PAGE_HERO_ASSETS, type StaticHeroKind } from "./pageHeroAssets";

import HomePage from "./HomePage";
import RankingsPage from "./RankingsPage";

// CityDetailPage carries the full 118-city dossier machinery (~250 kB of
// research, facts, and analysis text), so it loads as its own chunk. The
// warm-up below keeps both entry paths fast: direct /city/ links (the
// primary shared surface, §11.8) start fetching immediately — in parallel
// with the app booting — and everyone else prefetches on first idle, so
// click-throughs from Home/Rankings hit a warm cache.
const cityDetailImport = () => import("./CityDetailPage");
const CityDetailPage = lazy(cityDetailImport);
if (window.location.pathname.startsWith("/city/")) {
  cityDetailImport();
} else if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(() => cityDetailImport(), { timeout: 4000 });
} else {
  window.setTimeout(cityDetailImport, 2500);
}

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
const AboutPage = lazy(() => import("./AboutPage"));
const CreativeEconomyPage = lazy(() => import("./CreativeEconomyPage"));
import DataFeedback from "./DataFeedback";

const LOCALE_STORAGE_KEY = "smart-city-thailand-locale";
const THEME_STORAGE_KEY = "smart-city-thailand-theme";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") return "dark";
  return "light";
}

// Route-chunk fallback: five hairline bars in the page column, so a lazy
// page reads as arriving instead of popping in from blank. `.section` +
// the inline gutter keep the bars on the same left edge as the content
// that replaces them (`.loading-skeleton` alone pads to 0 on phones).
function PageSkeleton({ locale }: { locale: Locale }) {
  return (
    <div
      className="section loading-skeleton"
      style={{ paddingInline: "var(--gutter)" }}
      role="status"
      aria-live="polite"
      aria-label={locale === "th" ? "กำลังโหลดหน้า" : locale === "zh" ? "页面加载中" : "Loading page"}
    >
      <div className="skeleton-bar" />
      <div className="skeleton-bar" />
      <div className="skeleton-bar" />
      <div className="skeleton-bar" />
      <div className="skeleton-bar" />
    </div>
  );
}

// Top nav lives in src/TopbarNav.tsx — 5 grouped dropdowns
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

const newsItems = [
  {
    date: "2026-05-20",
    titleEn: "SCITI 2026 submitted to CEA Creative Excellence Awards — open-data scorecard for 118 Thai cities",
    titleTh: "SCITI 2026 ส่งเข้าประกวด CEA Creative Excellence Awards — ตารางคะแนนข้อมูลเปิดสำหรับ 118 เมือง",
    titleZh: "SCITI 2026 提交 CEA 创意卓越奖——覆盖 118 座泰国城市的开放数据评分卡",
    url: "https://sciti.nonarkara.org/",
    source: "depa / SCITI",
  },
  {
    date: "2026-03-18",
    titleEn: "SLIC Index V2 launched at Smart City Summit & Expo 2026 in Taipei",
    titleTh: "SLIC Index V2 เปิดตัวบนเวที SCSE 2026 ไทเป",
    titleZh: "SLIC Index V2 在 2026 台北智慧城市展发布",
    url: "https://slic.nonarkara.org/",
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
    date: "2025-11-05",
    titleEn: "Minister of Digital Economy: smart cities are a key solution to improving people's lives",
    titleTh: "รัฐมนตรีดิจิทัลชี้สมาร์ทซิตี้เป็นโซลูชันหลักยกระดับคุณภาพชีวิต",
    titleZh: "数字经济部长：智慧城市是改善民生的关键方案",
    url: "https://en.moneyandbanking.co.th/2025/206803/",
    source: "Money & Banking",
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
        <p className="route-photo-hero-desc">{hero.description[locale]}</p>
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

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <div className={`page-shell ${isDashboardRoute ? "page-shell-dashboard" : ""} ${isCanvasRoute ? "page-shell-canvas" : ""}`}>
      {isDashboardRoute && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "SCITI - Smart City Thailand Index",
            "description": "Thailand's Provincial Creative Economy Data Platform. Aggregates Gross Provincial Product, FDI flows, BOI incentive zones, infrastructure readiness, creative economy indicators, labor costs, and cultural asset data across Thailand's 77 provinces.",
            "url": "https://sciti.nonarkara.org/",
            "creator": {
              "@type": "Organization",
              "name": "Digital Economy Promotion Agency (depa)"
            },
            "license": "https://creativecommons.org/licenses/by/4.0/",
            "inLanguage": ["th", "en", "zh-Hans"],
            "keywords": ["Thailand", "Smart City", "Creative Economy", "Provincial Data", "Investment"]
          })}
        </script>
      )}
      {/* ─── INSTITUTIONAL BANNER ─── */}
      <a href="#main-content" className="skip-link">{locale === "th" ? "ข้ามไปยังเนื้อหา" : locale === "zh" ? "跳转到主要内容" : "Skip to content"}</a>
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
            <div
              className="locale-segmented"
              role="group"
              aria-label={locale === "th" ? "เลือกภาษา" : locale === "zh" ? "选择语言" : "Select language"}
            >
              <button
                type="button"
                className="locale-segmented-btn"
                aria-pressed={locale === "en"}
                aria-label="English"
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <button
                type="button"
                className="locale-segmented-btn"
                aria-pressed={locale === "th"}
                aria-label="ภาษาไทย"
                onClick={() => setLocale("th")}
              >
                TH
              </button>
              <button
                type="button"
                className="locale-segmented-btn"
                aria-pressed={locale === "zh"}
                aria-label="中文"
                onClick={() => setLocale("zh")}
              >
                CN
              </button>
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* ─── CONTENT ─── */}
      <main id="main-content" className={`page-frame ${isDashboardRoute ? "page-frame-dashboard" : ""} ${isCanvasRoute ? "page-frame-canvas" : ""}`} key={getRouteKey(route)}>
        {!isCanvasRoute && <PagePhotoHero route={route} locale={locale} />}
        <ErrorBoundary locale={locale}>
          <Suspense fallback={<PageSkeleton locale={locale} />}>
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
            ) : route.kind === "about" ? (
              <AboutPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "creative-economy" ? (
              <CreativeEconomyPage locale={locale} onNavigate={navigate} />
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

          {/* ─── NEWSLETTER SIGNUP ─── */}
          {/* No horizontal padding here — the .section inside carries the column
              gutter, and a wrapper gutter on top of it pushed this block 16px
              inboard of every other block on the page. */}
          <section className="newsletter-section" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "3rem 0", textAlign: "center" }}>
            <div className="section" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h3 style={{ fontSize: "var(--text-display)", marginBottom: "0.5rem", color: "var(--ink)" }}>
                {locale === "th" ? "สมัครรับข้อมูลข่าวสาร" : locale === "zh" ? "订阅简报" : "Subscribe to SCITI Data Insights"}
              </h3>
              <p style={{ marginBottom: "1.5rem", color: "var(--2)" }}>
                {locale === "th" 
                  ? "รับข้อมูลเชิงลึกเศรษฐกิจสร้างสรรค์ระดับจังหวัดรายเดือน ส่งตรงถึงอีเมลคุณ" 
                  : locale === "zh" 
                    ? "获取每月省级创意经济数据洞察，直接发送到您的收件箱。" 
                    : "Get monthly provincial creative economy data insights straight to your inbox."}
              </p>
              <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                <input 
                  type="email" 
                  placeholder={locale === "th" ? "อีเมลของคุณ" : locale === "zh" ? "您的电子邮件" : "Your email address"} 
                  style={{ padding: "0.75rem 1rem", borderRadius: 0, border: "1px solid var(--border)", flex: "1", maxWidth: "300px", background: "var(--bg)", color: "var(--ink)" }}
                  required
                />
                <button type="submit" className="cta-button" style={{ padding: "0.75rem 1.5rem", border: "none" }}>
                  {locale === "th" ? "ติดตาม" : locale === "zh" ? "订阅" : "Subscribe"}
                </button>
              </form>
            </div>
          </section>

          {/* ─── NEW FOOTER ─── */}
          <footer className="site-footer">
            <div className="section" style={{ paddingBottom: "2rem" }}>
              <div className="footer-logos" style={{ marginBottom: "2rem" }}>
                <div className="institutional-logo-container"><ResponsiveImage src={MDES_LOGO.src} alt="MDES" className="footer-logo" width={MDES_LOGO.width} height={MDES_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={DEPA_LOGO.src} alt="depa" className="footer-logo" width={DEPA_LOGO.width} height={DEPA_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={SMART_CITY_LOGO.src} alt="Smart City Thailand" className="footer-logo" width={SMART_CITY_LOGO.width} height={SMART_CITY_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={SLIC_LOGO.src} alt="SLIC Index" className="footer-logo" width={SLIC_LOGO.width} height={SLIC_LOGO.height} /></div>
              </div>

              <nav
                className="footer-nav"
                aria-label={locale === "th" ? "ลิงก์ท้ายเว็บ" : locale === "zh" ? "页脚链接" : "Footer links"}
                style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}
              >
                <button type="button" className="endpoint-link" onClick={() => navigate("/why")}>
                  {locale === "th" ? "ทำไมต้อง SCITI" : locale === "zh" ? "为什么是 SCITI" : "Why SCITI"}
                </button>
                <button type="button" className="endpoint-link" onClick={() => navigate("/map")}>
                  {locale === "th" ? "แผนที่ประเทศ" : locale === "zh" ? "全国地图" : "National Map"}
                </button>
              </nav>

              <div className="footer-fineprint">
                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem", fontSize: "1rem" }}>
                  {locale === "th" ? "SCITI (sciti.nonarkara.org) -- แพลตฟอร์มข้อมูลเศรษฐกิจสร้างสรรค์ระดับจังหวัดของไทย" : locale === "zh" ? "SCITI (sciti.nonarkara.org) —— 泰国省级创意经济数据平台" : "SCITI (sciti.nonarkara.org) -- Thailand's Provincial Creative Economy Data Platform"}
                </p>
                <p style={{ fontWeight: 600, color: "var(--teal)", marginBottom: "1rem", fontSize: "var(--text-body)", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                  {locale === "th" ? "การสมัคร CEA Creative Excellence Awards 2026 | รางวัลนโยบายเมืองสร้างสรรค์ (ประเภท 1.3)" : locale === "zh" ? "CEA 创意卓越奖 2026 申请 | 创意城市政策奖（1.3 类）" : "CEA Creative Excellence Awards 2026 Application | Creative City Policy Award (Category 1.3)"}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--3)", lineHeight: "1.6" }}>
                  {locale === "th"
                    ? "SCITI เป็นต้นแบบเครื่องมือนโยบายสาธารณะดิจิทัลสำหรับเปรียบเทียบเมืองไทยด้วยข้อมูลฐานสาธารณะ งานวิจัยที่มีแหล่งอ้างอิง และวิธีรวมคะแนนแบบเปิดเผย โดยวางงานไว้ในบริบทของเครือข่ายย่านสร้างสรรค์ เมืองอัจฉริยะ และการกระจายโอกาสทางเศรษฐกิจของไทย"
                    : locale === "zh"
                      ? "SCITI 是一项数字公共政策工具原型，以公开基线、有来源的研究和透明的汇总方法比较泰国城市，并将成果置于泰国创意街区、智慧城市和经济机会下沉的政策语境中。"
                      : "SCITI is a digital public-policy prototype for comparing Thai cities through public baselines, source-linked research, and a transparent aggregation method. It places that work in the context of Thailand's creative districts, smart-city programme, and decentralized economic opportunity."}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--3)", lineHeight: "1.6" }}>
                  <strong style={{ color: "var(--3)" }}>{locale === "th" ? "การอ้างอิงข้อมูล: " : locale === "zh" ? "数据归属： " : "Data Attribution: "}</strong>
                  {locale === "th"
                    ? "ฉบับเผยแพร่นี้ผสานข้อมูลฐานสาธารณะระดับจังหวัด ทะเบียนและแพลตฟอร์มสาธารณะ รวมถึงดุลยพินิจทางวิจัยที่ระบุไว้อย่างชัดเจน แฟ้มเมืองและไฟล์ส่งออกแสดงสถาบันต้นทาง ระดับพื้นที่ ค่าความเชื่อมั่น และข้อจำกัด ไม่อ้างว่าทุกค่าเป็นข้อมูลเทศบาลหรือข้อมูลสด"
                    : locale === "zh"
                      ? "本版本结合省级公开基线、公开名录与平台记录，以及明确标注的研究判断。城市档案与导出文件说明来源机构、地理层级、置信度和局限；我们不声称每个值都是市级或实时数据。"
                      : "This release combines provincial public baselines, public registries and platform records, and explicitly labelled research judgement. City dossiers and exports disclose source institutions, geographic level, confidence, and limitations; not every value is claimed to be municipal or live."}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--3)", lineHeight: "1.6" }}>
                  <strong style={{ color: "var(--3)" }}>{locale === "th" ? "กิตติกรรมประกาศ: " : locale === "zh" ? "致谢： " : "Acknowledgments: "}</strong>
                  {locale === "th"
                    ? "SCITI พัฒนาขึ้นโดยสอดคล้องกับกรอบนโยบายเศรษฐกิจสร้างสรรค์แห่งชาติของไทย และแนวทางปฏิบัติที่ดีที่สุดระดับโลกในการกำกับดูแลข้อมูลวัฒนธรรม รวมถึง Amsterdam Cultural Infrastructure Mapping, Barcelona CityOS, Buenos Aires Data Cultura, Seoul Open Data Plaza และ Singapore Cultural Statistics"
                    : locale === "zh"
                      ? "SCITI 的开发符合泰国国家创意经济政策框架以及文化数据治理的全球最佳实践，包括阿姆斯特丹文化基础设施地图、巴塞罗那 CityOS、布宜诺斯艾利斯 Data Cultura、首尔开放数据广场和新加坡文化统计。"
                      : "SCITI is developed in alignment with Thailand's national creative economy policy framework and global best practices in cultural data governance, including Amsterdam Cultural Infrastructure Mapping, Barcelona CityOS, Buenos Aires Data Cultura, Seoul Open Data Plaza, and Singapore Cultural Statistics."}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--3)", lineHeight: "1.6" }}>
                  <strong style={{ color: "var(--3)" }}>{locale === "th" ? "ติดต่อ: " : locale === "zh" ? "联系方式： " : "Contact: "}</strong>
                  {locale === "th"
                    ? "สอบถามข้อมูล เสนอความร่วมมือ หรือแจ้งแก้ไข ติดต่อทีม SCITI ได้ทาง sciti.nonarkara.org"
                    : locale === "zh"
                      ? "有关数据查询、合作提案或更正，请通过 sciti.nonarkara.org 联系 SCITI 团队。"
                      : "For data inquiries, partnership proposals, or corrections, contact the SCITI team via sciti.nonarkara.org"}
                </p>
                <p style={{ borderTop: "1px solid var(--5)", paddingTop: ".5rem", marginTop: "1rem", fontSize: "0.75rem" }}>
                  {locale === "th"
                    ? "© 2026 สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) · วิธีการ SLIC · ข้อมูลเปิดเผยภายใต้ CC BY 4.0"
                    : locale === "zh"
                      ? "© 2026 数字经济促进局（depa） · SLIC 方法论 · 数据依据 CC BY 4.0 许可公开"
                      : "© 2026 Digital Economy Promotion Agency (depa) · SLIC methodology · Data published under CC BY 4.0"}
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
