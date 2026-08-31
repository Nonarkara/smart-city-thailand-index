# Smart City Thailand Index (SCITI)

Thailand's smart city index — **measuring reality, not paper plans.**

SCITI (pronounced "City") is an independent, trilingual (EN / TH / CN) scorecard of Thai smart cities. depa certification mainly evaluates **plans and readiness**. This index scores **what is actually running**: housing and flood exposure, jobs and income, road deaths and crime, health access, air and green cover, civic warmth, and whether digital systems change outcomes rather than headlines.

> Scores are based on real-world outcomes, not plans or proposals.
> A city that has a beautiful proposal but nothing built scores low.
> A city where people actually live well scores high.
>
> — `src/cityData.ts`

**Live:** [https://smart-city-thailand-index.vercel.app](https://smart-city-thailand-index.vercel.app)

The source also publishes the same index at [sciti.nonarkara.org](https://sciti.nonarkara.org) (Open Graph, dataset, and methodology URLs in `index.html`).

No city lobbied for rank. No investor paid for placement. Corrections with checkable evidence are welcome at [data@slic-index.org](mailto:data@slic-index.org).

---

## Relation to [SLIC-Index V3](https://github.com/Nonarkara/SLIC-Index)

SCITI is the **Thailand programme sibling** of [SLIC Index V3](https://github.com/Nonarkara/SLIC-Index) (Smart Liveable Cities Index). Same research lineage, same demand that every score be traceable, same React 19 + TypeScript + Vite stack, same EN / TH / CN surface.

They are not the same ranking.

| | [SLIC-Index V3](https://github.com/Nonarkara/SLIC-Index) | SCITI (this repo) |
|---|---|---|
| Scope | Global livability ranking | Thailand Smart City programme |
| Question | What is left after rent? | Is this "smart city" operational, or a paper plan? |
| Pillars | 5 (Growth, Viability, Capability, Community, Creative) | 7 (see weights below) |
| Live | [slic.nonarkara.org](https://slic.nonarkara.org/) | [smart-city-thailand-index.vercel.app](https://smart-city-thailand-index.vercel.app) |

The FAQ in `src/KnowledgePage.tsx` states that SCITI was developed using the SLIC methodology. The compare view (`src/ComparePage.tsx`) is adapted from SLIC V3's side-by-side page, scaled from five pillars to SCITI's seven.

---

## What the index measures

Seven scoring pillars and fixed weights, from `PILLAR_WEIGHTS` in `src/types.ts` (they sum to 100):

| Pillar | Weight | What the code scores |
|--------|--------|----------------------|
| Livability | 25% | Housing / infrastructure / daily life (75%) + GISTDA flood-frequency factor (25%) |
| Economy | 20% | Jobs, GPP, growth, affordability |
| Safety | 15% | Road fatality rate (30%) + crime exposure (40%) + disaster resilience (30%) |
| Wellbeing | 15% | Healthcare, education, family-friendliness |
| Environment | 10% | Air quality, green space, sustainability |
| Hospitality | 10% | Culture, tourism, belonging |
| Digital | 5% | Enabling tech — not a halo effect |

Composite (from `src/scoring.ts` and `formatCompositeFormula` in `src/methodologySpec.ts`):

```
Composite = (LIV×25 + ECO×20 + SAF×15 + WEL×15 + ENV×10 + HOS×10 + DIG×5) / 100
```

Tiers, from `TIER_THRESHOLDS` in `src/methodologySpec.ts`:

- **Alpha** — composite ≥ 65 (stronger evidence of real operation)
- **Beta** — composite ≥ 45
- **Gamma** — below 45 (mostly planned, lightly evidenced, or not yet producing public outcomes)

Method code **SCITI-2026-METH**, version **2026.04**, data cut-off **2026-04-04** (`src/methodologySpec.ts`). Full write-up: [`/methodology`](https://smart-city-thailand-index.vercel.app/methodology). Audit trail: [`/audit`](https://smart-city-thailand-index.vercel.app/audit).

---

## What is in the dataset (quoted from source)

These are **programme and file counts from the code**, not a census of every Thai municipality.

**depa national registry** (January 2026), from `src/claimRegistry.ts`:

- 37 certified cities
- 190 promotion cities
- 227 submitted proposals

**Records encoded in this repository:**

- **37 certified** Smart City Local dossiers — `src/cityData.ts` (`certifiedCities`; batches 1–4)
- **Selected promotion-zone dossiers** drawn from depa's 190 — `src/cityData.ts` (`promotionZoneCities`)
- **69 registered entries** with default baseline scores and `dataConfidence: "low"` — `src/registeredCityData.ts` ("69 encoded entries (from depa's ~190-zone promotion pool)")

`allCities` is the union of those three arrays (`src/cityData.ts`). The homepage counts cities at runtime from that union; it does not hard-code a total. The JSON-LD block in `index.html` currently describes the published set as 118 Thai smart cities.

Evidence depth is **not equal**. The audit page states that this release is an index dataset, not the complete national proposal registry, and that registry-only rows stay low-confidence until city-level evidence exists.

National programme targets cited in the claim registry (not SCITI's own sample size): at least 105 livable smart cities in the 2024-2027 plan period.

---

## How to run

Requires **Node.js 20+** (GitHub Actions uses Node 20 and Node 24). The SPA serves the bundled city dataset locally; Supabase is optional.

```bash
git clone https://github.com/Nonarkara/smart-city-thailand-index.git
cd smart-city-thailand-index
npm install
npm run dev
```

Dev server: **http://localhost:5188** (`package.json` / Vite `--port 5188`).

```bash
npm run test:run   # Vitest
npm run lint       # ESLint
npm run build      # tsc -b && vite build
```

`npm run build` is the CI type-check path (`tsc -b`, not `tsc --noEmit`). After a production build, `postbuild` writes `dist/data/cities.json` for crawlers and downloads.

Optional (live City Data Platform / API only — leave unset for a local read of the repo dataset):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not commit keys. Optional backend setup is in `database/README.md`.

---

## Repository map

| Path | Role |
|------|------|
| `src/types.ts` | Pillar weights, city types, locales (`en` / `th` / `zh`) |
| `src/scoring.ts` | Composite, tiers, flood and road-safety blends |
| `src/methodologySpec.ts` | Method code, cut-off, confidence |
| `src/cityData.ts` | Certified + selected promotion dossiers |
| `src/registeredCityData.ts` | Registry-only baseline rows |
| `src/claimRegistry.ts` | Displayed national figures with sources |
| `src/routing.ts` | Client router (no React Router) |
| `src/cityCdp.ts` | Per-city dossiers, finance notes, CSV exports |

Stack: React 19, Vite 6, TypeScript 5.8. Interface languages: English, Thai, Chinese (on-screen abbreviation **CN**).

---

## License

- **Source code** — [MIT](LICENSE)
- **Published index data** (scores, rankings, generated `cities.json`) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as stated on the site. Attribution: Smart City Thailand Index (SCITI), depa.
- **Photographs** keep their original licenses (often CC BY / CC BY-SA); see `src/photoCredits.ts`.

SCITI was developed by Dr. Non A., Senior Expert at depa's Smart City Promotion Department, Ministry of Digital Economy and Society (MDES), using the SLIC methodology.
