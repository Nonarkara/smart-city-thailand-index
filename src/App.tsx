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
const MapDashboardPage = lazy(() => import("./MapDashboardPage"));
const AsusPage = lazy(() => import("./AsusPage"));
const AuditPage = lazy(() => import("./AuditPage"));
const ReferencesPage = lazy(() => import("./ReferencesPage"));
const ProgramPage = lazy(() => import("./ProgramPage"));
const KnowledgePage = lazy(() => import("./KnowledgePage"));

const LOCALE_STORAGE_KEY = "smart-city-thailand-locale";
const THEME_STORAGE_KEY = "smart-city-thailand-theme";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") return "dark";
  return "light";
}

const NAV_ITEMS = [
  { kind: "home", path: "/", label: { en: "Home", th: "หน้าหลัก", zh: "首页" } },
  { kind: "rankings", path: "/rankings", label: { en: "Rankings", th: "อันดับ", zh: "排名" } },
  { kind: "program", path: "/program", label: { en: "Program", th: "โครงการ", zh: "计划" } },
  { kind: "methodology", path: "/methodology", label: { en: "Method", th: "วิธีการ", zh: "方法" } },
  { kind: "story", path: "/story", label: { en: "Story", th: "เรื่องราว", zh: "故事" } },
  { kind: "showcase", path: "/showcase", label: { en: "NST", th: "ต้นแบบ", zh: "样板" } },
  { kind: "partners", path: "/partners", label: { en: "Partners", th: "พันธมิตร", zh: "伙伴" } },
  { kind: "audit", path: "/audit", label: { en: "Audit", th: "ตรวจสอบ", zh: "审计" } },
  { kind: "knowledge", path: "/knowledge", label: { en: "KB", th: "คลังรู้", zh: "知识库" } },
] as const;

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
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDashboardRoute = route.kind === "home";

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
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    syncDocumentMeta(route.path, locale);
  }, [locale, route]);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setRoute(parseRoute(path));
    setMobileMenuOpen(false);
  };

  const cycleLocale = () => setLocale(l => l === "en" ? "th" : l === "th" ? "zh" : "en");
  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <div className={`page-shell ${isDashboardRoute ? "page-shell-dashboard" : ""}`}>
      {/* ─── INSTITUTIONAL BANNER ─── */}
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="institutional-banner">
        <div className="institutional-logos">
          <img src="/mdes_logo.jpg" alt={locale === "th" ? "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม" : "Ministry of Digital Economy and Society"} className="institutional-logo" />
          <img src="/depa_logo.jpg" alt={locale === "th" ? "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล" : "Digital Economy Promotion Agency (depa)"} className="institutional-logo" />
          <img src="/smart_city_thailand_logo.jpg" alt={locale === "th" ? "สำนักงานเมืองอัจฉริยะประเทศไทย" : "Smart City Thailand Office"} className="institutional-logo" />
        </div>
      </div>

      {/* ─── TOPBAR ─── */}
      <nav className="topbar">
        <button type="button" className="brand-lockup" onClick={() => navigate("/")}>
          <img src="/smart_city_thailand_logo.jpg" alt="Smart City Thailand" className="brand-logo" />
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
            {NAV_ITEMS.map(item => (
              <button
                key={item.kind}
                type="button"
                className={`nav-link ${route.kind === item.kind ? "active" : ""}`}
                aria-current={route.kind === item.kind ? "page" : undefined}
                onClick={() => navigate(item.path)}
              >
                {item.label[locale]}
              </button>
            ))}
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
              {locale === "en" ? "TH" : locale === "th" ? "中" : "EN"}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── CONTENT ─── */}
      <main id="main-content" className={`page-frame ${isDashboardRoute ? "page-frame-dashboard" : ""}`} key={getRouteKey(route)}>
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
          ) : route.kind === "map" ? (
            <MapDashboardPage locale={locale} onNavigate={navigate} />
          ) : route.kind === "asus" ? (
            <AsusPage locale={locale} onNavigate={navigate} />
          ) : route.kind === "audit" ? (
            <AuditPage locale={locale} onNavigate={navigate} />
          ) : route.kind === "references" ? (
            <ReferencesPage locale={locale} onNavigate={navigate} />
          ) : route.kind === "program" ? (
            <ProgramPage locale={locale} onNavigate={navigate} />
          ) : route.kind === "knowledge" ? (
            <KnowledgePage locale={locale} onNavigate={navigate} />
          ) : route.kind === "city" ? (
            <CityDetailPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
          ) : (
            <HomePage locale={locale} onNavigate={navigate} />
          )}
        </Suspense>
      </main>

      {!isDashboardRoute && (
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
                    ? "แหล่งข้อมูล: สำนักงานสถิติแห่งชาติ (NSO) · สภาพัฒน์ (NESDC) · กรมควบคุมมลพิษ (PCD) · GISTDA · ธนาคารโลก Open Data · ADB · Open-Meteo/Copernicus · สำนักงานตำรวจแห่งชาติ · กรมการปกครอง (DOPA) · depa City Data Platform (citydata.in.th) · กระทรวงสาธารณสุข (MOPH)"
                    : locale === "zh"
                      ? "数据来源：NSO · NESDC · PCD · GISTDA · 世界银行 · ADB · Open-Meteo/Copernicus · 泰国皇家警察 · DOPA · depa citydata.in.th · 公共卫生部。"
                      : "Data sources: NSO · NESDC · PCD · GISTDA · World Bank Open Data · ADB · Open-Meteo/Copernicus · Royal Thai Police · DOPA · depa City Data Platform (citydata.in.th) · Ministry of Public Health (MOPH)."}
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
                    ? "การเข้าถึง: ออกแบบตาม WCAG 2.1 AA · รองรับคีย์บอร์ด · ภาพมี alt text · ตารางใช้ semantic HTML · รองรับ 3 ภาษา (EN/TH/ZH) · Focus visible สำหรับ keyboard navigation"
                    : locale === "zh"
                      ? "无障碍：遵循 WCAG 2.1 AA · 支持键盘导航 · 图片含 alt 文本 · 语义化表格 · 三语支持 (EN/TH/ZH)"
                      : "Accessibility: WCAG 2.1 AA compliant · Keyboard navigable · Alt text on images · Semantic HTML tables · Trilingual (EN/TH/ZH) · Focus-visible indicators for assistive technology."}
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
      <Suspense fallback={null}>
        <GeminiChat locale={locale} />
      </Suspense>
    </div>
  );
}
