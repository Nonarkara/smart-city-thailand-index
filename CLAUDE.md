# SCITI 2026 — Smart City Thailand Index

Red Dot Design Award submission. Built by depa Smart City Promotion Department.

React 19 + Vite 6 + TypeScript 5.8 SPA. No React Router — custom routing in `src/routing.ts`.

## Build & Deploy

```bash
tsc -b              # Type-check (NOT tsc --noEmit — must match CI)
npx vite build      # Always verify both before pushing
```

- GitHub Pages via GitHub Actions — push to `main` triggers auto-deploy
- Base path: `VITE_BASE_PATH=/smart-city-thailand-index/`
- Verify deploy: `gh run list --limit 1`

## Design Philosophy

"Jony Ive meets Dieter Rams" — clarity, simplicity, elegance.

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
- **Typography**: Major Third scale (1.25), tokens `--text-xs`
  through `--text-3xl`. All numerics in `var(--mono)`.
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
- **Cards**: glass-morphism, premium shadows.
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
- **Page loading**: lazy-loaded via `React.lazy()`, except `HomePage`, `RankingsPage`, `CityDetailPage`

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
  push. GitHub Pages redeploys. The page's "Updated N days ago"
  stamp is the illusion of real time.

## Preview & Testing

- `.reveal` animations don't fire in headless preview — force `.visible` via `preview_eval`
- Dev server port: **5188** (configured in `.claude/launch.json`)

---

## Anti-Regression — Do Not Touch

See `/Users/nonarkara/Projects/CLAUDE.md` §11 (The Codex Incident — Anti-Regression Laws) for the full rules. These items are the personality of SCITI 2026. Do not remove, replace, or "simplify" any of them without Dr Non's explicit in-chat approval:

- **SCITI mobile-first layout** — designed for Red Dot submission. Do not retro-fit as desktop-first.
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
