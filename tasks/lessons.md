# Lessons · SCITI — Smart City Thailand Index (sciti.nonarkara.org)

Corrections log. Updated after every mistake. **Read at the start of every session.**
Per §13: the same mistake never happens twice.

---

## 2026-05-26 · Bootstrap: §13 adopted

- **What went wrong:** n/a — first entry
- **Correct behaviour:** Log every correction here. Read before each session.
- **How to recognise:** Any time you repeat a fix you've already made.

---

## 2026-06-30 · Cloudflare deploy to wrong dir shipped an incomplete build

- **What went wrong:** Deployed Cloudflare Pages from `dist_cf/` after
  `VITE_BASE_PATH=/ npm run build -- --outDir dist_cf`. The `postbuild` scripts
  (`generate-city-og-pages.mjs`, `generate-cities-json.mjs`) **hardcode `dist/`**,
  so `dist_cf` shipped with NO city OG pages, NO `sitemap.xml`, and a stale
  `data/cities.json` (copied from a stray `public/data/`). Social-share cards and
  the sitemap were dead on the live site, masked because the SPA itself still ran.
- **Correct behaviour:** For the CF manual deploy, build to the **default `dist/`**
  with `VITE_BASE_PATH=/ npm run build` (postbuild writes OG pages/sitemap/cities.json
  into that same `dist/`), then `wrangler pages deploy dist`. Never deploy a dir the
  postbuild generators didn't write into. GitHub Pages rebuilds itself with its own
  base path via Actions, so the local base=/ `dist` is correct for CF only.
- **How to recognise:** After `wrangler pages deploy`, if the upload count is small
  (~20 files) the OG pages/sitemap are missing — a full deploy is ~140 files. Verify
  `ls dist/city | wc -l` (=118) and `dist/sitemap.xml` exist *before* deploying.

---

## 2026-05-26 · GitHub Actions token expired — always deploy manually

- **What went wrong:** CI fails with code 9109 (invalid CLOUDFLARE_API_TOKEN in GH secrets).
- **Correct behaviour:** `npx vite build && npx wrangler pages deploy dist --project-name=smart-city-thailand-index --branch=main --commit-dirty=true`
- **How to recognise:** CI green but sciti.nonarkara.org not updated = token expired.

---

## 2026-05-26 · Dev server is port 5188, not 3000

- **What went wrong:** n/a — reminder
- **Correct behaviour:** `npx vite --port 5188` (hardcoded in project config). Visiting localhost:3000 returns nothing.
- **How to recognise:** `ERR_CONNECTION_REFUSED` on 3000 = wrong port. Use 5188.

---

## 2026-05-26 · GISTDA ArcGIS — Thai field names, no pagination

- **What went wrong:** Querying with English field names (`pv_en`) and `resultRecordCount` both fail with 400.
- **Correct behaviour:** Use Thai field names: `pv_tn` (province), `ap_tn` (district), `tb_tn` (tambon). Use `where=` clauses to filter, never `resultRecordCount` or `resultOffset`.
- **How to recognise:** GISTDA 400 "Failed to execute query" = English field name. GISTDA 400 "Pagination is not supported" = remove resultRecordCount.

---

## 2026-05-26 · GISTDA Sphere API is JS SDK only — direct REST returns 401

- **What went wrong:** n/a — reminder
- **Correct behaviour:** Sphere API (Thai vector tiles, search, geocode) is browser-only JS SDK. Load via `<script src="https://api.sphere.gistda.or.th/map/?key={KEY}">`. Direct REST calls to `basemap.sphere.gistda.or.th` return 401 regardless of key.
- **How to recognise:** 401 on Sphere REST endpoint = use the JS SDK, not direct REST.

---

<!-- FORMAT for future entries:
## YYYY-MM-DD · [short title of the mistake]
- **What went wrong:** ...
- **Correct behaviour:** ...
- **How to recognise this pattern:** ...
-->

---

## 2026-06-14 · CI used vite build directly, bypassing postbuild hook

- **What went wrong:** `.github/workflows/cloudflare-pages.yml` ran `npx tsc -b && npx vite build` directly. The `postbuild` script in `package.json` (`node scripts/generate-city-og-pages.mjs`) only fires for `npm run build`, not for `npx vite build`. City OG pages were never generated in CI.
- **Correct behaviour:** CI must use `npm run build` (or explicitly append `&& node scripts/generate-city-og-pages.mjs`) so the postbuild hook fires.
- **How to recognise:** When adding a `postbuild` or `prebuild` hook, immediately check the CI workflow — if it calls `vite build`/`tsc`/etc. directly instead of `npm run build`, the hook will silently not fire. grep `.github/` for `npx vite` after adding any npm lifecycle hooks.

---

## 2026-06-14 · preview_eval window.innerWidth=0 after scrollIntoView — viewport is 0x0

- **What went wrong:** After calling `scrollIntoView()` in preview_eval, subsequent screenshot showed blank white. Root cause: `window.innerWidth` / `window.innerHeight` reported 0x0 even though the screenshot tool renders at full size. `window.scrollTo(0, n)` silently does nothing in this state.
- **Correct behaviour:** Use `document.documentElement.scrollTo({ top: n, behavior: 'instant' })` to scroll (not `window.scrollTo`). Use `preview_resize` to reset the viewport if `window.innerWidth` reports 0. The actual screenshot tool renders at full desktop size regardless of `window.innerWidth`.
- **How to recognise:** `window.innerWidth + 'x' + window.innerHeight` returns "0x0" → call `preview_resize` with a preset before proceeding. If `document.documentElement.scrollTop` won't change, the page may use `html { overflow: visible }` — use `document.documentElement.scrollTo()` with `behavior: 'instant'` instead.

## 2026-09-03 · Type audit: grep the cascade in the browser, not the stylesheet
- **What went wrong:** the stylesheet declared `.source-card-desc { font-size: var(--text-body) }`, yet it rendered at 11.5px. Two hidden overrides defeated the token system: inline `style={{ fontSize: "var(--text-micro)" }}` in JSX, and duplicate later CSS rules (`.callout-card p` declared body at L839 and micro at L3088 — last wins). A stylesheet grep had already been done once ("micro-token floor" pass) and missed both.
- **Correct behaviour:** audit *computed* styles in the running page — census `getComputedStyle().fontSize` across routes at 375px, classify prose (≥60 chars) vs labels, then ask the browser which rule wins for a sample element. Only then edit.
- **How to recognise:** a rule says X but the element renders Y; `font:` shorthand and single-quoted inline styles slip past `font-size:`/double-quote greps.

## 2026-09-03 · `min(calc((100% − W)/2), X)` goes negative below W and drops the whole declaration
- **What went wrong:** `.edition-stamp { padding: .65rem min(calc((100% - 1060px)/2), 1.25rem) }` — below 1060px the calc is negative, `min()` returns it, negative padding is invalid, the entire `padding` is discarded → element flush at x=0 under a gutter-inset hero.
- **Correct behaviour:** `padding: max(var(--gutter), calc((100% - var(--w))/2 + var(--gutter)))` — never below the gutter, aligns to the column above W.
- **How to recognise:** a container aligned on desktop but flush-left on phones; computed `paddingLeft: 0px` while the rule clearly sets one.

## 2026-09-03 · SVG `<text fontSize="8">` in a 760-unit viewBox renders at 2.8px on a phone
- **What went wrong:** `width:100%` scaled the methodology diagrams to 0.396× at 375px; computed style still reports 8px, so a font-size census misses it. The scoring formula was invisible on the primary surface.
- **Correct behaviour:** measure `rect.width / viewBox.width × authoredSize`; hold a `min-width` inside an `overflow-x:auto; max-width:100%` wrapper so the SVG scales *up* to ≥11px effective and scrolls, instead of shrinking past legibility.
- **How to recognise:** any `<svg viewBox>` with authored text ≤10 and `width:100%`.

## 2026-09-03 · `scroll-snap-type: x mandatory` snaps to the padding edge and swallows the gutter
- **What went wrong:** the stat ribbon's first cell rested at x=0 despite `padding-inline: var(--gutter)` — mandatory snap aligns `snap-align:start` cells to the scrollport (padding) edge.
- **Correct behaviour:** add `scroll-padding-inline: var(--gutter)`; if a sticky edge affordance must reach the true viewport edge, put the gutter on `:first-child`/`:last-child` margins instead of scrollport padding.
- **How to recognise:** a snap strip whose first item ignores container padding at rest.

## 2026-09-03 · Minified CSS serialises `::after` as `:after` — don't grep live CSS for the double colon
- **What went wrong:** the post-deploy check grepped production CSS for `home-stat-ribbon-inner::after` and aborted a green deploy.
- **Correct behaviour:** assert on the single-colon form or a regex `:+after`, or on a property inside the rule.
