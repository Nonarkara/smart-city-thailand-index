# SCITI 2026 — Smart City Thailand Index

Public Thailand smart-city data platform: city dossiers, comparisons, source records and assessment gaps. Built by depa Smart City Promotion Department. Historical award material is retained as archive, not the platform’s current purpose.

React 19 + Vite 6 + TypeScript 5.8 SPA. No React Router — custom routing in `src/routing.ts`.

## Build & Deploy

```bash
tsc -b              # Type-check (NOT tsc --noEmit — must match CI)
npx vite build      # Always verify both before pushing
```

- Base path is `/` (VITE_BASE_PATH is unset anywhere; `vite.config.ts` falls back to `"/"`)
- **Production (sciti.nonarkara.org) is Cloudflare Pages — deploy is MANUAL:**
  `VITE_BASE_PATH=/ npm run build && wrangler pages deploy dist --project-name=smart-city-thailand-index --branch=main --commit-dirty=true`
  Pushing to `main` alone does **not** update the live site.
- **The read API is static on Cloudflare.** `npm run build` postbuild writes
  `dist/api-static/` (city index, per-city dossiers, CSV). `public/_redirects`
  maps `/api/cities/:id` and the CSV routes onto those files, and
  `functions/api/cities.ts` applies `status` / `tier` / `sort` on `/api/cities`.
  The Vercel handlers in `/api` still run if this repo is deployed to Vercel;
  they do not run on Cloudflare. Never let `/api/*` fall through to the SPA
  shell — clients will parse `index.html` as JSON.
- GitHub Actions also auto-deploys to GitHub Pages on push to `main` (`gh run list --limit 1` to verify), but DNS for `sciti.nonarkara.org` resolves to Cloudflare — the GitHub Pages copy is a live mirror, not what users see.

### CDPT — the one-command ship sequence

**CDPT = Commit · Push · Deploy · Test-on-web.** The full sequence above is
hardcoded into `scripts/cdpt.sh` — use it instead of running the steps by hand:

```bash
npm run cdpt -- "commit message"   # or:  bash scripts/cdpt.sh "commit message"
```

Or invoke the Claude Code slash command **`/cdpt commit message`** (defined in
`.claude/commands/cdpt.md`). The script gates on `vitest` + `eslint` + a
`base=/` build (aborts if red), commits **tracked** changes only (never
auto-stages new/untracked files — stage those yourself so no stray secret
lands in this public repo), pushes `origin main`, `wrangler pages deploy dist`
to Cloudflare, then polls the live domain until it serves the freshly-built
chunk hash and asserts HTTP 200 on the key routes. It is idempotent — running
it with no changes just re-deploys and re-verifies.

If shared-host contention makes local test timing unreliable, commit and push
the candidate to run the existing full GitHub Pages workflow (tests, lint,
build and production-dependency audit). After that run succeeds, use
`CDPT_REMOTE_TEST_RUN=<run-id> npm run cdpt` from a clean checkout. CDPT requires
the completed successful workflow to match the exact current commit, then
downloads that run's validated Pages artifact and performs the normal Cloudflare/live checks.
This changes the test runner location, not the assertions or timeouts.

## Redundant identity and MSH (27 October 2026)

A compact city record must not repeat its province when the displayed localized
name already identifies it. `getDistinctProvinceName` suppresses only that UI
subtitle; distinct geography, provenance and exported province fields remain.
A short single-line record should fit a 44px row; long names may wrap fully.
Do not preserve an empty metadata track after removing duplication.
`scripts/audit/identity-density.mjs --serve` checks the 14 editorial records in
three languages at six widths, distinct geography, keyboard navigation and the
shared correction disclosure. Both duplicate identity and inflated-row mutations
must fail. CI and CDPT run it alongside the existing density/type checks.
Shared MSH and installed design skills carry this rule. A route sweep and these
bounded guards do not certify every possible state of all 118 dossiers.

## Design Philosophy

"Jony Ive meets Dieter Rams" — clarity, simplicity, elegance.

**Spatial hallucination is frontend enemy number one.** Short comparison
records should first be composed as name/value plus shared metadata, rather
than four padded vertical fields. Preserve complete information, readable
type and interaction targets. An overflow/font pass does not clear SH.
`scripts/audit/record-density.mjs --serve` tests the compiled shortlist in all
three languages at390/730/1024/1440/1980, including preserved fields, row and
section budgets, gutters, keyboard navigation and an oversized-layout mutation.
CDPT and GitHub Pages CI block release when this check fails. This is a scoped
record-pattern gate, not a declaration that the rest of a page is SH-free.

- **Mobile-first, non-negotiable.** SCITI is a Moneyball-style manual
  for investment in Thai cities, and the primary surface is a
  smartphone — people hand their phone across a table and say "look
  at this city." Base CSS must be phone (≤ 480 px) and scale up via
  `@media (min-width: …)`. Every interactive target ≥ 44 × 44 px.
  Every grid collapses cleanly to one column. Test on the iOS
  simulator or a real device before pushing any home/rankings change.
- **Pillar bars belong only on `/rankings` and `/city/:id`.** The
  homepage must never rehearse them — seven bars in nineteen separate
  100%-scale rows cannot be compared, so the homepage summarises by
  theme instead (collections, pillar champions, weekly digest).
- **Photo overlays**: dark gradients ≥ 78% opacity + `text-shadow`
  for legibility.
- **Ranking viz (on Rankings page only)**: individual pillar
  segments at fixed pixel widths, not `width: %` of a flexing
  parent. The Phase 11 `.pillar-strip` (220 px fixed, 7 segments) is
  the pattern.
- **Typography**: three sizes only — `--text-display` (32px), `--text-body`
  (14px), `--text-micro` (11px). All numerics in `var(--mono)`. Legacy
  Major-Third `--text-xs`..`--text-3xl` aliases are frozen for back-compat —
  reach for the canonical three in new code (see Anti-Regression below).
- **Thai typography — non-looped only.** Native Thai readers clock a
  non-Thai establishment in one glance by its looped หัว (head-loops).
  When a Thai person handwrites, the loop shrinks until it's vestigial
  or absent; big prominent loops are a foreigner's crutch and read as
  "learner material" or "not made by Thais". Use only non-looped Thai
  faces: **IBM Plex Sans Thai** (non-looped) as primary, **Noto Sans
  Thai** or display faces like **Prompt** / **Kanit** as alternates.
  NEVER `IBM Plex Sans Thai Looped`, `Sarabun`, `TH Sarabun New`, or
  any other looped Thai face. This rule applies to every Thai-facing
  surface in this workspace — dashboards, decks, PDFs, signage.
- **Cards**: flat, hairline-bordered (1px). No border-radius, no gradient,
  no drop shadow — see Anti-Regression / Phase 17 zero tokens below.
- **Color System — Sanzo Wada × Dr Non Palette (`https://github.com/Nonarkara/palette`).**
  Governed by relational color harmony, unequal proportions, and authorial restraint.
  Core brand chord is Wada Plate 002: Dark Tyrian Blue (`#12354e`) and Yellow Orange (`#f99d1b`),
  with Wada Yellow (`#fff200`) and the single amber focus token (`#f59e0b`). Reality tiers
  use Wada Antwarp Blue (`#007190` — Operational/Certified), Yellow Orange (`#d98218` / `#f99d1b` —
  Building/Partial), and Dr Non's About Red (`#a72144` — Planned/Risk: classy & dangerous).
  All text pairings meet WCAG AA (≥ 4.5:1).
- **Scroll animations**: `.reveal` class + IntersectionObserver.

## Trilingual Content (EN / TH / CN)

- Internal `Locale` type: `"en" | "th" | "zh"` — keep as-is (ISO standard)
- **Visible abbreviation**: always **CN**, never ZH
- All user-facing text: `translate(locale, { en, th, zh })` helper
- Chinese must read naturally — not machine-translation quality
- Thai must be accurate and idiomatic

## Content Standards

- **No hallucination** — every number cited, every claim sourced
- **Fair and unbiased** — no personal interest in boosting or penalizing any city
- Content must be **different per city**, accurate, interesting, and elegant in writing
- The 7 pillars and weights: livability (25%), economy (20%), safety (15%), wellbeing (15%), environment (10%), hospitality (10%), digital (5%)

## Code Patterns

- **Smart quotes**: NEVER use Unicode curly quotes `\u201C \u201D` as string delimiters in TypeScript — always ASCII `"`
- **Photos**: always generate `.webp` alongside `.jpg` (`cwebp -q 82`), then update `src/cityMedia.ts`
- **`<picture>` in overlays**: must be `position: absolute` inside overlay containers (otherwise it pushes overlay text below `overflow: hidden` boundaries)
- **New routes** — update three files:
  1. `src/routing.ts` — add type + parser case
  2. `src/App.tsx` — lazy import + nav item + render case
  3. `src/siteMeta.ts` — add route title in all 3 locales
- **Page loading**: lazy-loaded via `React.lazy()`, except `HomePage` and `RankingsPage`. `CityDetailPage` is lazy **with a warm-up** in `App.tsx` — the import fires immediately on direct `/city/` links and on idle otherwise, so shared city links (the primary surface, §11.8) never wait on a serial chunk fetch. `ComparisonGrid` is lazy inside `RankingsPage` (compare mode only). All `node_modules` go to a `vendor` chunk (function-form `manualChunks` in `vite.config.ts`) so content deploys don't re-download React.

## Roadmap notes

- **Phase 13 — Land price as an investability signal.** Add
  provincial land-price data (Treasury Department appraisal values,
  updated every 4 years; BOT / NESDC land-price index where
  available; BOI industrial-estate rates for EEC/SEZ zones). Fold
  into a new `investability` sub-score or as a `landPriceBaht` field
  on `CityMetrics`. The math must be legible: document the raw
  source per city, the normalisation function, and how it enters
  the composite or a Moneyball edge. **No proxy data, no guessing**
  — if a city has no Treasury record, leave the field null and let
  the UI degrade. Cheap land is an asymmetric growth signal against
  EEC benchmarks; surfacing it is the whole point of the Moneyball
  frame.
- **Weekly digest ritual** (live now): edit
  `src/weeklyDigest.ts` every Monday. Update `weekOf`, the trending
  city note, one Google Trends phrase, one headline link. Commit,
  push. GitHub Pages redeploys. The stamp dates the editorial selection; it must never imply a live feed or that every source was refreshed.

## Preview & Testing

- `.reveal` animations don't fire in headless preview — force `.visible` via `preview_eval`
- Dev server port: **5188** (configured in `.claude/launch.json`)

---

## Anti-Regression — Do Not Touch

See `/Users/nonarkara/Projects/CLAUDE.md` §11 (The Codex Incident — Anti-Regression Laws) for the full rules. These items are the personality of SCITI 2026. Do not remove, replace, or "simplify" any of them without Dr Non's explicit in-chat approval:

- **SCITI mobile-first layout** — designed for award submission (CEA 2026). Do not retro-fit as desktop-first.
- **One header band, one line.** The header is a single row: the three programme marks (MDES, depa, Smart City Thailand Office) lead, a hairline separates them from the product wordmark, and the navigation anchors the right edge. There is no second band and no `.institutional-banner` element — a strip above the topbar spent a whole row of height on 130 px of logos and pushed the wordmark into a second row, which read as spatial hallucination. The lockup starts with words, never with a mark. The marks use the alpha PNGs from `scripts/build-transparent-logos.py`; the JPEGs carry a white ground that showed as a box over the hero photo. Enforced by `src/headerChrome.test.tsx`; the footer's four-mark credit line (adds SLIC Index) is a separate zone and is not a duplicate.
- **No React Router — single-page architecture.** Do not add routing, do not split pages.
- **Jony Ive × Dieter Rams typography** — editorial type scale, hairline rules, mono numerics. ZERO border-radius, ZERO gradients, ZERO drop shadows.
- **Design tokens are deliberately zero (Phase 17).** `--radius`, `--radius-sm`, `--radius-xs`, `--shadow-premium`, `--shadow-heavy`, `--card-shadow`, `--card-shadow-hover` are all `0` / `none` in `src/styles.css`. This is the Codex Incident law enforced at the token layer — any future "restore" of non-zero values is a regression, not a fix. Only gradients permitted in the stylesheet are dark-over-photo legibility overlays (see `.cinematic-hero-overlay` etc.). Only shadows permitted are `inset` border-substitutes and `:focus-visible` accessibility rings.
- **`.reveal` scroll-animation pattern** — do not replace with a generic library.
- **Dev server port 5188** — do not change without updating `.claude/launch.json`.
- **The four templated cliches are banned site-wide** (workspace `CLAUDE.md` §11.6). Round-corner rectangles, gradient color fills, fat serif display fonts, drop shadows. If your draft contains any of them, stop and show the diff first — that instinct is templated muscle memory, not design.
- **Three text sizes per page, hard rule** (workspace `CLAUDE.md` §11.7). The canonical tokens are `--text-display` (32px), `--text-body` (14px), `--text-micro` (11px). Adding a fourth size is a regression. The legacy `--text-xs` through `--text-3xl` aliases exist only so old rules don't break — every new rule should reach for the canonical three.
- **System-ui for Latin script.** No Raleway, no Fraunces, no Inter, no decorative typeface. `--font` resolves to SF Pro on macOS, Segoe UI on Windows. Thai script keeps `IBM Plex Sans Thai` (non-looped). Mono numerics keep `IBM Plex Mono`. The font should disappear into the OS — that is the Jony-Ive brief.
- **Smartphone-perfect, every page** (workspace `CLAUDE.md` §11.8). Every page in this project — `/`, `/rankings`, `/city/:id`, `/methodology`, `/story`, `/program`, `/partners`, `/audit`, `/invest`, `/compare`, all of them — must be perfect on a phone. Phone-first base CSS, ≥44 × 44 px tap targets, single-column collapse, no fixed-pixel body widths, 3-size typography held, photo aspect collapses 21:9 → 4:3 on ≤ 720 px. Test on iOS simulator before pushing any layout change. Informational and marketing pages have a *higher* bar than data dashboards — phone-broken marketing reads as "not made by Thais" the way a looped Thai font does.

If you are about to remove, replace, or "simplify" any item above: stop, show the diff, wait for explicit approval.

## Verified visual context (28 October 2026)

Every city dossier has an openly licensed or public-domain visual record with
explicit province/local/regional scope, author, source and reuse terms.
`public/heritage/source-register.json` is generated deterministically from the
actual records at postbuild, into public and dist. Do not hand-edit it.
`heritage-gallery.mjs --serve` checks all 118 mappings, real image bytes and
representative multilingual interaction. `footer-density.mjs --serve` checks
the complete closing path, preserved qualifications and original-fault mutations.
Both gates run in CI and CDPT. A geometry pass is not a data-truth certificate.

Use verified provincial context instead of an unrelated photograph chosen only
for uniqueness. Preserve authored city photographs. Documented editorial
stand-ins and absent-city-photo fallbacks in CityDetail use a verified cultural
record with visible scope and credits; do not present it as a project-site view.
Legacy project/finance/highlight claims must be labeled at their point of use,
not rescued by a distant footer disclaimer. Unknown observation periods stay
unknown. Framework references and programme logos do not establish certification.

### Exact-build remote browser validation
`CDPT_REMOTE_TEST_RUN` now verifies every required named CI test/build/audit/browser
step succeeded, in addition to the workflow name and exact HEAD. Missing or skipped
gates fail closed. CDPT downloads that run's `site-dist` and reuses its completed
rendered checks rather than repeating them on a contended shared Mac. Artifact
staging, clean-tree checks, Cloudflare deployment and live publication checks still
run locally. The ordinary local path continues to execute every gate locally.

## Page budget and the presenter band (30 October 2026)

Law: workspace `CLAUDE.md` §11.12.1. Every page opens with one presenter band
(`PageMascot.tsx`): the page's commissioned Nong Plub pose from
`public/nong-plub/guide/` (built by `scripts/build-guide-figures.py`) stands on a
hairline beside one handwritten note and one link, 104 px on phones and 128 px on
desktop. Never shrink her to an avatar and never enlarge her into a sticker; the
photo context is a symbol-only camera toggle, not a text row. Ranking rows state
a peak and trough (▲▼) instead of seven pillar bars; the full bars live on the
city dossier. Compact lists are ruled rows, not padded cards (`.atlas-row`,
`.fact-grid`). `scripts/audit/page-budget.mjs --serve` gates per-route page height
in screens at 390 and 1440, H1 position and the band; ceilings only go down. It
runs in CI and CDPT. Remaining giants to compact: `/invest` finance, checklist and
explorer sections, `/baseline`, `/methodology`, `/program`.

