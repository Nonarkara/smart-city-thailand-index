# SCITI 2026 — Smart City Thailand Index

CEA Creative Excellence Awards 2026 submission (Category 1.3 — Creative City Policy Award). Built by depa Smart City Promotion Department.

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

- **Photo overlays**: dark gradients ≥78% opacity + `text-shadow` for legibility
- **Ranking viz**: show individual pillar bars (not a single composite bar) — differences between cities must be immediately obvious
- **Typography**: Major Third scale (1.25), tokens `--text-xs` through `--text-3xl`
- **Cards**: glass-morphism, premium shadows
- **Scroll animations**: `.reveal` class + IntersectionObserver

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

## Preview & Testing

- `.reveal` animations don't fire in headless preview — force `.visible` via `preview_eval`
- Dev server port: **5188** (configured in `.Codex/launch.json`)
