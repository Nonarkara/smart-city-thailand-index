export type StaticRoutePath = "/" | "/rankings" | "/methodology" | "/story" | "/why" | "/showcase" | "/partners" | "/map" | "/asus" | "/audit" | "/references" | "/program" | "/knowledge" | "/discover" | "/invest" | "/compare" | "/bingo";

export type Route =
  | { kind: "home"; path: "/" }
  | { kind: "rankings"; path: "/rankings" }
  | { kind: "methodology"; path: "/methodology" }
  | { kind: "story"; path: "/story" }
  | { kind: "why"; path: "/why" }
  | { kind: "showcase"; path: "/showcase" }
  | { kind: "partners"; path: "/partners" }
  | { kind: "map"; path: "/map" }
  | { kind: "asus"; path: "/asus" }
  | { kind: "audit"; path: "/audit" }
  | { kind: "references"; path: "/references" }
  | { kind: "program"; path: "/program" }
  | { kind: "knowledge"; path: "/knowledge" }
  | { kind: "discover"; path: "/discover" }
  | { kind: "invest"; path: "/invest" }
  | { kind: "compare"; path: "/compare" }
  | { kind: "bingo"; path: "/bingo" }
  | { kind: "city"; path: `/city/${string}`; cityId: string };

export function parseRoute(rawPathname: string): Route {
  // Strip Vite BASE_URL prefix (e.g., /smart-city-thailand-index/) for GitHub Pages
  const base = import.meta.env.BASE_URL || "/";
  const pathname = rawPathname.startsWith(base) ? rawPathname.slice(base.length - 1) || "/" : rawPathname;
  if (pathname === "/rankings") return { kind: "rankings", path: "/rankings" };
  if (pathname === "/methodology") return { kind: "methodology", path: "/methodology" };
  if (pathname === "/story") return { kind: "story", path: "/story" };
  if (pathname === "/why") return { kind: "why", path: "/why" };
  if (pathname === "/showcase") return { kind: "showcase", path: "/showcase" };
  if (pathname === "/partners") return { kind: "partners", path: "/partners" };
  if (pathname === "/map") return { kind: "map", path: "/map" };
  if (pathname === "/asus") return { kind: "asus", path: "/asus" };
  if (pathname === "/audit") return { kind: "audit", path: "/audit" };
  if (pathname === "/references") return { kind: "references", path: "/references" };
  if (pathname === "/program") return { kind: "program", path: "/program" };
  if (pathname === "/knowledge") return { kind: "knowledge", path: "/knowledge" };
  if (pathname === "/discover") return { kind: "discover", path: "/discover" };
  if (pathname === "/invest") return { kind: "invest", path: "/invest" };
  if (pathname === "/compare") return { kind: "compare", path: "/compare" };
  if (pathname === "/bingo") return { kind: "bingo", path: "/bingo" };
  if (pathname.startsWith("/city/")) {
    const cityId = pathname.slice("/city/".length).trim();
    if (cityId) {
      return { kind: "city", cityId, path: `/city/${cityId}` };
    }
  }
  return { kind: "home", path: "/" };
}

export function getRouteKey(route: Route): string {
  return route.path;
}

/** Prepends Vite BASE_URL so hrefs work on GitHub Pages subpaths. */
export function toAppPath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  return path === "/" ? `${prefix}/` : `${prefix}${path}`;
}
