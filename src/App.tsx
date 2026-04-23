import { lazy, Suspense, useEffect, useState, type MouseEvent } from "react";
import HomePage from "./HomePage";
import RankingsPage from "./RankingsPage";
import CityDetailPage from "./CityDetailPage";
import { ErrorBoundary } from "./ErrorBoundary";
import { translate } from "./cityPresentation";
import { parseRoute, getRouteKey, type Route } from "./routing";
import { syncDocumentMeta } from "./siteMeta";
import type { Locale } from "./types";
import { trackVisitor } from "./visitorTracking";

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

const LOCALE_STORAGE_KEY = "smart-city-thailand-locale";
const THEME_STORAGE_KEY = "smart-city-thailand-theme";

type NavItem = {
  kind: Exclude<Route["kind"], "city">;
  path: string;
  label: { en: string; th: string; zh: string };
};

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { kind: "home", path: "/", label: { en: "Home", th: "หน้าหลัก", zh: "首页" } },
  { kind: "rankings", path: "/rankings", label: { en: "Rankings", th: "อันดับ", zh: "排名" } },
  { kind: "discover", path: "/discover", label: { en: "Your City", th: "เมืองของคุณ", zh: "你的城市" } },
  { kind: "program", path: "/program", label: { en: "Program", th: "โครงการ", zh: "项目" } },
  { kind: "methodology", path: "/methodology", label: { en: "Methodology", th: "ระเบียบวิธี", zh: "方法论" } },
  { kind: "audit", path: "/audit", label: { en: "Audit", th: "ตรวจสอบ", zh: "审计" } },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { kind: "story", path: "/story", label: { en: "Story", th: "เรื่อง", zh: "叙事" } },
  { kind: "showcase", path: "/showcase", label: { en: "Showcase", th: "กรณีเด่น", zh: "案例" } },
  { kind: "partners", path: "/partners", label: { en: "Partners", th: "พันธมิตร", zh: "伙伴" } },
  { kind: "knowledge", path: "/knowledge", label: { en: "Knowledge", th: "คลังความรู้", zh: "知识库" } },
  { kind: "invest", path: "/invest", label: { en: "Invest", th: "ลงทุน", zh: "投资" } },
  { kind: "references", path: "/references", label: { en: "References", th: "อ้างอิง", zh: "参考" } },
  { kind: "why", path: "/why", label: { en: "Why This Index", th: "ทำไมต้องมีดัชนี", zh: "为何需要指数" } },
];

function getInitialLocale(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "th" || stored === "zh") return stored;
  return "en";
}

function getNextLocale(locale: Locale): Locale {
  if (locale === "en") return "th";
  if (locale === "th") return "zh";
  return "en";
}

function getLocaleBadge(locale: Locale): "EN" | "TH" | "CN" {
  if (locale === "th") return "TH";
  if (locale === "zh") return "CN";
  return "EN";
}

function getLocaleSwitchLabel(locale: Locale): string {
  const next = getNextLocale(locale);
  if (next === "th") return "Switch language to Thai";
  if (next === "zh") return "Switch language to Chinese";
  return "Switch language to English";
}

function toAppPath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  return path === "/" ? `${prefix}/` || "/" : `${prefix}${path}`;
}

function isActiveRoute(route: Route, item: NavItem): boolean {
  if (item.kind === "discover") {
    return route.kind === "discover" || route.kind === "city";
  }
  return route.kind === item.kind;
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
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute("data-theme");
  }, []);

  useEffect(() => {
    syncDocumentMeta(route.path, locale);
  }, [locale, route]);

  useEffect(() => {
    void trackVisitor(route.path);
  }, [route.path]);

  const navigate = (path: string) => {
    const nextPath = toAppPath(path);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setRoute(parseRoute(nextPath));
  };

  const handleNavigate =
    (path: string) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      navigate(path);
    };

  const localeLabel = getLocaleBadge(locale);

  return (
    <div className="page-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="site-header">
        <div className="section shell-header-row">
          <a
            href={toAppPath("/")}
            className="shell-brand"
            onClick={handleNavigate("/")}
            aria-label="Smart City Thailand Index home"
          >
            <span className="shell-brand-kicker">Smart City Thailand Index</span>
            <span className="shell-brand-name">SCITI 2026</span>
            <span className="shell-brand-meta">depa / MDES / Kingdom of Thailand</span>
          </a>

          <button
            type="button"
            className="locale-switch"
            onClick={() => setLocale(current => getNextLocale(current))}
            aria-label={getLocaleSwitchLabel(locale)}
          >
            {localeLabel}
          </button>
        </div>

        <div className="section shell-nav-row">
          <nav
            className="shell-nav shell-nav-primary"
            aria-label={translate(locale, {
              en: "Primary navigation",
              th: "เมนูหลัก",
              zh: "主导航",
            })}
          >
            {PRIMARY_NAV_ITEMS.map(item => {
              const active = isActiveRoute(route, item);
              return (
                <a
                  key={item.kind}
                  href={toAppPath(item.path)}
                  className={`shell-nav-link ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={handleNavigate(item.path)}
                >
                  {translate(locale, item.label)}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="main-content" className="page-frame" key={getRouteKey(route)}>
        <ErrorBoundary locale={locale}>
          <Suspense
            fallback={
              <section className="section reveal visible">
                <div className="data-sheet loading-sheet">
                  <p className="eyebrow">
                    {translate(locale, {
                      en: "Loading",
                      th: "กำลังโหลด",
                      zh: "加载中",
                    })}
                  </p>
                  <h2 className="section-title">
                    {translate(locale, {
                      en: "Preparing the next section.",
                      th: "กำลังเตรียมส่วนถัดไป",
                      zh: "正在准备下一部分。",
                    })}
                  </h2>
                </div>
              </section>
            }
          >
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
            ) : route.kind === "discover" ? (
              <DiscoverPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "invest" ? (
              <InvestPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "city" ? (
              <CityDetailPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
            ) : (
              <HomePage locale={locale} onNavigate={navigate} />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="site-footer">
        <div className="section footer-grid">
          <div className="footer-note-block">
            <p className="eyebrow">SCITI 2026</p>
            <p className="footer-note">
              {translate(locale, {
                en: "Operational city index for Thailand. Light theme, evidence-first, no marketing theatre.",
                th: "ดัชนีเมืองเชิงปฏิบัติการของไทย โทนสว่าง หลักฐานมาก่อน ไม่มีละครการตลาด",
                zh: "泰国运营型城市指数。浅色系统，证据优先，不做营销表演。",
              })}
            </p>
          </div>

          <nav
            className="shell-nav shell-nav-secondary"
            aria-label={translate(locale, {
              en: "Secondary navigation",
              th: "เมนูรอง",
              zh: "次级导航",
            })}
          >
            {SECONDARY_NAV_ITEMS.map(item => {
              const active = isActiveRoute(route, item);
              return (
                <a
                  key={item.kind}
                  href={toAppPath(item.path)}
                  className={`shell-nav-link ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={handleNavigate(item.path)}
                >
                  {translate(locale, item.label)}
                </a>
              );
            })}
          </nav>
        </div>
      </footer>

      <Suspense fallback={null}>
        <GeminiChat locale={locale} />
      </Suspense>
    </div>
  );
}
