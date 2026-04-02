import { useEffect, lazy, Suspense, useState } from "react";
import { parseRoute, getRouteKey, type Route } from "./routing";
import { syncDocumentMeta } from "./siteMeta";
import type { Locale } from "./types";

const HomePage = lazy(() => import("./HomePage"));
const RankingsPage = lazy(() => import("./RankingsPage"));
const MethodologyPage = lazy(() => import("./MethodologyPage"));
const CityDetailPage = lazy(() => import("./CityDetailPage"));
const StoryPage = lazy(() => import("./StoryPage"));
const WhyPage = lazy(() => import("./WhyPage"));
const ShowcasePage = lazy(() => import("./ShowcasePage"));
const GeminiChat = lazy(() => import("./GeminiChat"));
const PartnershipsPage = lazy(() => import("./PartnershipsPage"));

const LOCALE_STORAGE_KEY = "smart-city-thailand-locale";

const newsItems = [
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

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    const sync = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    syncDocumentMeta(route.path, locale);
  }, [locale, route]);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setRoute(parseRoute(path));
  };

  const cycleLocale = () => setLocale(l => l === "en" ? "th" : l === "th" ? "zh" : "en");

  return (
    <div className="page-shell">
      {/* ─── INSTITUTIONAL BANNER ─── */}
      <div className="institutional-banner">
        <div className="institutional-logos">
          <img src="/mdes_logo.jpg" alt="Ministry of Digital Economy and Society" className="inst-logo" />
          <img src="/depa_logo.jpg" alt="depa — Digital Economy Promotion Agency" className="inst-logo" />
          <img src="/smart_city_thailand_logo.jpg" alt="Smart City Thailand Office" className="inst-logo" />
          <img src="/slic_logo.jpg" alt="SLIC — Smart Liveable Cities Index" className="inst-logo" />
        </div>
      </div>

      {/* ─── TOPBAR ─── */}
      <nav className="topbar">
        <button className="brand-lockup" onClick={() => navigate("/")}>
          <img src="/smart_city_thailand_logo.jpg" alt="Smart City Thailand" className="brand-logo" />
          <span className="brand-name">
            {locale === "th" ? "ดัชนีเมืองอัจฉริยะไทย" : locale === "zh" ? "泰国智慧城市指数" : "Smart City Thailand Index"}
          </span>
        </button>
        <div className="nav-links">
          <button className={`nav-link ${route.kind === "home" ? "active" : ""}`} onClick={() => navigate("/")}>
            {locale === "th" ? "หน้าหลัก" : locale === "zh" ? "首页" : "Home"}
          </button>
          <button className={`nav-link ${route.kind === "rankings" ? "active" : ""}`} onClick={() => navigate("/rankings")}>
            {locale === "th" ? "จัดอันดับ" : locale === "zh" ? "排名" : "Rankings"}
          </button>
          <button className={`nav-link ${route.kind === "methodology" ? "active" : ""}`} onClick={() => navigate("/methodology")}>
            {locale === "th" ? "วิธีการ" : locale === "zh" ? "方法论" : "Methodology"}
          </button>
          <button className={`nav-link ${route.kind === "story" ? "active" : ""}`} onClick={() => navigate("/story")}>
            {locale === "th" ? "เรื่องราว" : locale === "zh" ? "故事" : "Story"}
          </button>
          <button className={`nav-link ${route.kind === "why" ? "active" : ""}`} onClick={() => navigate("/why")}>
            {locale === "th" ? "ทำไม" : locale === "zh" ? "为什么" : "Why"}
          </button>
          <button className={`nav-link ${route.kind === "showcase" ? "active" : ""}`} onClick={() => navigate("/showcase")}>
            {locale === "th" ? "ต้นแบบ" : locale === "zh" ? "样板" : "NST"}
          </button>
          <button className={`nav-link ${route.kind === "partners" ? "active" : ""}`} onClick={() => navigate("/partners")}>
            {locale === "th" ? "พันธมิตร" : locale === "zh" ? "伙伴" : "Partners"}
          </button>
          <button
            className="locale-toggle"
            aria-label={locale === "en" ? "Switch language to Thai" : locale === "th" ? "Switch language to Chinese" : "Switch language to English"}
            onClick={cycleLocale}
          >
            {locale === "en" ? "TH" : locale === "th" ? "中" : "EN"}
          </button>
        </div>
      </nav>

      {/* ─── CONTENT ─── */}
      <main className="page-frame" key={getRouteKey(route)}>
        <Suspense fallback={<div className="loading">Loading...</div>}>
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
          ) : route.kind === "city" ? (
            <CityDetailPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
          ) : (
            <HomePage locale={locale} onNavigate={navigate} />
          )}
        </Suspense>
      </main>

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
            <img src="/mdes_logo.jpg" alt="MDES" className="footer-logo" />
            <img src="/depa_logo.jpg" alt="depa" className="footer-logo" />
            <img src="/smart_city_thailand_logo.jpg" alt="Smart City Thailand" className="footer-logo" />
            <img src="/slic_logo.jpg" alt="SLIC Index" className="footer-logo" />
          </div>

          <div className="footer-bottom">
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
          </div>
        </div>
      </footer>

      {/* ─── GEMINI CHATBOT ─── */}
      <Suspense fallback={null}>
        <GeminiChat locale={locale} />
      </Suspense>
    </div>
  );
}
