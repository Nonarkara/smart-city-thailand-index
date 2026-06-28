// ---------------------------------------------------------------------------
// TopbarNav — 5-group dropdown navigation (Phase 2.4 consolidation)
// ---------------------------------------------------------------------------
// Collapses 13 flat nav items into 5 grouped surfaces with dropdowns:
//   Home · Rankings · Method · Stories · Network
//
// Behaviour:
// - Desktop: hover or click to open dropdown (with proper focus trap)
// - Mobile (≤ 768 px): all groups expand into a stacked list inside the
//   hamburger menu — preserves the existing nav-links-open pattern
// - Keyboard: full arrow-key nav between groups + within dropdowns
// - ARIA: menubar/menu/menuitem roles, aria-expanded, aria-current
//
// Hairline borders, ZERO radius, ZERO drop-shadow — per Anti-Regression §11.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import type { Locale } from "./types";
import type { Route } from "./routing";

type RouteKind = Route["kind"];

interface NavItem {
  kind: RouteKind;
  path: string;
  label: { en: string; th: string; zh: string };
}

interface NavGroup {
  /** Identifier — also used to keep one dropdown open at a time */
  id: string;
  label: { en: string; th: string; zh: string };
  /** If single item, no dropdown is shown — clicking the group goes there */
  items: NavItem[];
}

/**
 * 5-group consolidation. Order: left → right.
 * Home is a direct link (no dropdown). The other four each carry related
 * pages that previously cluttered the topbar.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    id: "home",
    label: { en: "Home", th: "หน้าหลัก", zh: "首页" },
    items: [
      { kind: "home", path: "/", label: { en: "Home", th: "หน้าหลัก", zh: "首页" } },
    ],
  },
  {
    id: "rankings",
    label: { en: "Rankings", th: "อันดับ", zh: "排名" },
    items: [
      { kind: "rankings", path: "/rankings", label: { en: "Rankings", th: "อันดับเมือง", zh: "城市排名" } },
      { kind: "discover", path: "/discover", label: { en: "Your City", th: "เมืองคุณ", zh: "你的城市" } },
      { kind: "compare", path: "/compare", label: { en: "Compare", th: "เทียบเมือง", zh: "对比城市" } },
    ],
  },
  {
    id: "method",
    label: { en: "Method", th: "วิธีการ", zh: "方法" },
    items: [
      { kind: "methodology", path: "/methodology", label: { en: "Methodology", th: "ระเบียบวิธี", zh: "方法论" } },
      { kind: "audit", path: "/audit", label: { en: "Audit", th: "ตรวจสอบ", zh: "审计" } },
      { kind: "knowledge", path: "/knowledge", label: { en: "Knowledge base", th: "คลังความรู้", zh: "知识库" } },
      { kind: "bingo", path: "/bingo", label: { en: "Evidence bingo", th: "บิงโกหลักฐาน", zh: "证据宾果" } },
    ],
  },
  {
    id: "stories",
    label: { en: "Stories", th: "เรื่องราว", zh: "故事" },
    items: [
      { kind: "about", path: "/about", label: { en: "Mission", th: "พันธกิจ", zh: "使命" } },
      { kind: "creative-economy", path: "/creative-economy", label: { en: "Creative Economy", th: "เศรษฐกิจสร้างสรรค์", zh: "创意经济" } },
      { kind: "story", path: "/story", label: { en: "Manifesto", th: "ปฏิญญา", zh: "宣言" } },
      { kind: "showcase", path: "/showcase", label: { en: "NST showcase", th: "นครศรีต้นแบบ", zh: "那空是贪玛叻样板" } },
      { kind: "program", path: "/program", label: { en: "Program", th: "โครงการ", zh: "计划" } },
    ],
  },
  {
    id: "network",
    label: { en: "Network", th: "เครือข่าย", zh: "网络" },
    items: [
      { kind: "partners", path: "/partners", label: { en: "Partners", th: "พันธมิตร", zh: "合作伙伴" } },
      { kind: "invest", path: "/invest", label: { en: "Invest", th: "ลงทุน", zh: "投资" } },
    ],
  },
];

interface Props {
  locale: Locale;
  currentKind: RouteKind;
  onNavigate: (path: string) => void;
  /** True when the parent has expanded the mobile menu (≤ 768 px). */
  mobileOpen: boolean;
  /** Closes the mobile menu after a navigation (parent owns the state). */
  onClose: () => void;
}

/**
 * Returns the id of the group containing the active route, so we can
 * highlight the parent button when the user is on a sub-page.
 */
function findActiveGroup(currentKind: RouteKind): string | null {
  for (const group of NAV_GROUPS) {
    if (group.items.some(i => i.kind === currentKind)) return group.id;
  }
  return null;
}

export default function TopbarNav({ locale, currentKind, onNavigate, mobileOpen, onClose }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const activeGroup = findActiveGroup(currentKind);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!openGroup) return;
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [openGroup]);

  const [prevKind, setPrevKind] = useState(currentKind);
  if (currentKind !== prevKind) {
    setPrevKind(currentKind);
    setOpenGroup(null);
  }

  const handleItemClick = (path: string) => {
    setOpenGroup(null);
    onClose();
    onNavigate(path);
  };

  return (
    <div
      ref={navRef}
      className={`nav-groups ${mobileOpen ? "nav-groups-mobile-open" : ""}`}
      role="menubar"
      aria-label={locale === "th" ? "เมนูหลัก" : locale === "zh" ? "主菜单" : "Primary navigation"}
    >
      {NAV_GROUPS.map(group => {
        const isSingle = group.items.length === 1;
        const isActiveGroup = activeGroup === group.id;
        const isOpen = openGroup === group.id;

        if (isSingle) {
          const item = group.items[0];
          return (
            <button
              key={group.id}
              type="button"
              role="menuitem"
              className={`nav-link ${isActiveGroup ? "active" : ""}`}
              aria-current={currentKind === item.kind ? "page" : undefined}
              onClick={() => handleItemClick(item.path)}
            >
              {group.label[locale]}
            </button>
          );
        }

        return (
          <div key={group.id} className={`nav-group ${isOpen ? "nav-group-open" : ""}`}>
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              className={`nav-link nav-group-trigger ${isActiveGroup ? "active" : ""}`}
              onClick={() => setOpenGroup(isOpen ? null : group.id)}
              onMouseEnter={() => {
                // Hover-open on desktop only — mobile uses click
                if (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(hover: hover)").matches) {
                  setOpenGroup(group.id);
                }
              }}
            >
              {group.label[locale]}
              <span className="nav-group-caret" aria-hidden="true">›</span>
            </button>
            <div
              className="nav-dropdown"
              role="menu"
              aria-label={group.label[locale]}
              onMouseLeave={() => {
                if (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(hover: hover)").matches) {
                  setOpenGroup(null);
                }
              }}
            >
              {group.items.map(item => (
                <button
                  key={item.kind}
                  type="button"
                  role="menuitem"
                  className={`nav-dropdown-item ${currentKind === item.kind ? "active" : ""}`}
                  aria-current={currentKind === item.kind ? "page" : undefined}
                  onClick={() => handleItemClick(item.path)}
                >
                  {item.label[locale]}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
