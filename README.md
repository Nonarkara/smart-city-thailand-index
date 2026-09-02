# Smart City Thailand Index (SCITI)

<p align="center">
  <img src="docs/hero-banner.png" alt="Manga-style illustration of a researcher at a glass dashboard over a colour-coded map of Thailand. Scores and weights on the dashboard are artwork, not live SCITI telemetry." width="100%">
</p>

<p align="center"><em>Studio banner for the public repo. The HUD on the glass — six dimension bars, a 74/100 gauge, "Data / Policy / Implementation / Outcome" weights — is illustration only. It is not live telemetry, and those labels and weights are not the published SCITI method.</em></p>

Thailand's smart city index — **measuring reality, not paper plans.**

SCITI (pronounced "City") is a trilingual (EN / TH / **CN**) scorecard of Thai smart cities. [depa](https://www.depa.or.th) Smart City Local certification mainly evaluates **plans and readiness**. This index scores **what is actually running**: housing and flood exposure, jobs and income, road deaths and crime, health access, air and green cover, civic warmth, and whether digital systems change outcomes rather than headlines.

> Scores are based on real-world outcomes, not plans or proposals.
> A city that has a beautiful proposal but nothing built scores low.
> A city where people actually live well scores high.
>
> — `src/cityData.ts`

**Live:** [sciti.nonarkara.org](https://sciti.nonarkara.org) · [smart-city-thailand-index.vercel.app](https://smart-city-thailand-index.vercel.app)

No city lobbied for rank. No investor paid for placement. Corrections with checkable evidence are welcome at [data@slic-index.org](mailto:data@slic-index.org).

---

## What this is

SCITI is an **open assessment instrument** for Thailand's Smart City programme: seven weighted pillars, a deterministic composite, Alpha / Beta / Gamma delivery tiers, and a public audit trail. The FAQ in `src/KnowledgePage.tsx` describes it as an independent assessment tool — independent of the **certification decision**, not a claim that the work sits outside depa.

It was developed by Dr. Non A., Senior Expert at depa's Smart City Promotion Department, Ministry of Digital Economy and Society (MDES), using the SLIC (Smart Liveable Cities Index) methodology. This repository is the source of the live site, the scoring code, and the encoded city dossiers.

It is **not** a census of every Thai municipality. It is **not** a black-box vendor ranking. It is **not**, on the evidence in this repo, a gazetted national ranking (see [Ethical use](#ethical-use)).

### Relation to [SLIC-Index V3](https://github.com/Nonarkara/SLIC-Index)

SCITI is the Thailand-programme sibling of [SLIC Index V3](https://github.com/Nonarkara/SLIC-Index). Same research lineage, same demand that every score be traceable, same React 19 + TypeScript + Vite stack, same EN / TH / CN surface. They are **not** the same ranking.

| | [SLIC-Index V3](https://github.com/Nonarkara/SLIC-Index) | SCITI (this repo) |
|---|---|---|
| Scope | Global livability ranking | Thailand Smart City programme |
| Question | What is left after rent? | Is this "smart city" operational, or a paper plan? |
| Pillars | 5 (Growth, Viability, Capability, Community, Creative) | 7 (see [How it works](#how-it-works)) |
| Live | [slic.nonarkara.org](https://slic.nonarkara.org/) | [sciti.nonarkara.org](https://sciti.nonarkara.org) |

The compare view (`src/ComparePage.tsx`) is adapted from SLIC V3's side-by-side page, scaled from five pillars to SCITI's seven.

---

## Philosophy

**Seven pillars. One composite. Zero black boxes.** (`src/MethodologyPage.tsx`)

City rankings usually hide the formula, sell a league table, and leave mayors arguing with a score they cannot reproduce. SCITI is built the other way around:

1. **Outcomes over paper.** Certification can acknowledge a plan. The index asks whether sensors run, data stays online, air is breathable, roads kill fewer people, and residents can afford to live there.
2. **The math is public.** Pillar weights are a frozen vector in `src/types.ts`. The composite is ordinary weighted arithmetic in `src/scoring.ts`. Once pillar scores are fixed, tier assignment is automatic — no committee override, no hidden bonus, no paid placement.
3. **Data lives in git.** Dossiers are TypeScript constants (`src/cityData.ts`, `src/registeredCityData.ts`), not an unreadable database dump. A score change is a commit. A commit is a public record.
4. **Uncertainty is labelled.** Confidence (`high` / `medium` / `low`) is computed separately and does **not** secretly alter the composite. Registry-only rows stay low-confidence until city-level evidence exists.
5. **Challenge is part of the method.** A low score is a workplan, not a verdict. Corrections that come with a public dataset, official document, working platform, or field record are in scope. Press releases are not.

The banner art on this page is part of that honesty: a civic studio drawing of looking *through* a dashboard, not a screenshot of production telemetry.

---

## Ethical use

Treat SCITI as an **open, auditable assessment**. Do not treat it as an official government index unless you can cite a published instrument that says so.

This repository documents:

- **Who built it** — depa Smart City Promotion Department (site footer, JSON-LD in `index.html`, MIT copyright line).
- **What it is not** — it is not depa Smart City Local certification. Certification evaluates boundaries, infrastructure plans, CDP design, projects, and participation models. SCITI scores operational evidence. A certified city can still be Gamma. (`src/KnowledgePage.tsx`)
- **What this repo does not contain** — a ministerial regulation, Cabinet resolution, or depa gazette that designates SCITI as Thailand's statutory national city ranking. Until such a document is on the record, do not present a SCITI rank as government endorsement, as a substitute for certification, or as a funding decision on its own.

Use it well:

- **Cite the method.** Name SCITI, the method code (`SCITI-2026-METH`, version `2026.04` in `src/methodologySpec.ts`), the data cut-off, and the confidence label.
- **Show the seven bars**, not only the composite. A single number hides trade-offs.
- **Do not launder illustration as data.** Do not quote the banner HUD (six dimensions, 74/100, 15%×5 + 10%) as SCITI scores. The live pillars and weights are in the next section.
- **Do not smear a city.** Gamma means evidence of delivery is thin, not that residents failed. The FAQ: a Gamma city is a signal that the next work should be specific.
- **Do not imply paid placement.** No city, developer, vendor, or sponsor paid for inclusion, weighting, or editorial treatment in this index.
- **Respect privacy.** The public dataset is city- and province-level. Do not attempt to re-identify individuals from this project.

Corrections: [data@slic-index.org](mailto:data@slic-index.org) or via [sciti.nonarkara.org](https://sciti.nonarkara.org). Bring evidence another person can check.

---

## How it works

Two layers (`src/KnowledgePage.tsx`): research assigns each pillar a 0–100 score from public indicators, evidence items, and field verification; deterministic math then produces the composite, tier, and confidence label.

Seven scoring pillars and fixed weights, from `PILLAR_WEIGHTS` in `src/types.ts` (they sum to 100). These are **not** the six HUD categories in the banner, and they are **not** depa's seven programme dimensions (`economy`, `energy`, `environment`, `governance`, `living`, `mobility`, `people` in `src/types.ts`).

| Pillar | Weight | What the code scores |
|--------|--------|----------------------|
| Livability | 25% | Housing / infrastructure / daily life (75%) + GISTDA flood-frequency factor (25%) |
| Economy | 20% | Jobs, GPP, growth, affordability |
| Safety | 15% | Road fatality rate (30%) + crime exposure (40%) + disaster resilience (30%) |
| Wellbeing | 15% | Healthcare, education, family-friendliness |
| Environment | 10% | Air quality, green space, sustainability |
| Hospitality | 10% | Culture, tourism, belonging |
| Digital | 5% | Enabling tech — not a halo effect |

Composite (`src/scoring.ts`, `formatCompositeFormula` in `src/methodologySpec.ts`):

```
Composite = (LIV×25 + ECO×20 + SAF×15 + WEL×15 + ENV×10 + HOS×10 + DIG×5) / 100
```

Tiers, from `TIER_THRESHOLDS` in `src/methodologySpec.ts`. Read them as **delivery tiers**, not prestige labels:

- **Alpha** — composite ≥ 65 (stronger evidence of real operation)
- **Beta** — composite ≥ 45 (mixed: some parts work, some still need proof)
- **Gamma** — below 45 (mostly planned, lightly evidenced, or not yet producing public outcomes)

Method code **SCITI-2026-METH**, version **2026.04**, data cut-off **2026-04-04** (`src/methodologySpec.ts`).

Full write-up: [`/methodology`](https://sciti.nonarkara.org/methodology). Audit trail: [`/audit`](https://sciti.nonarkara.org/audit). Open dataset: [`/data/cities.json`](https://sciti.nonarkara.org/data/cities.json).

### What is in the dataset (quoted from source)

These are **programme and file counts from the code**, not a census of every Thai municipality.

**depa national registry** (January 2026), from `src/claimRegistry.ts`:

- 37 certified cities
- 190 promotion cities
- 227 submitted proposals

**Records encoded in this repository:**

- **37 certified** Smart City Local dossiers — `src/cityData.ts` (`certifiedCities`; batches 1–4)
- **Selected promotion-zone dossiers** drawn from depa's 190 — `src/cityData.ts` (`promotionZoneCities`)
- **69 registered entries** with default baseline scores and `dataConfidence: "low"` — `src/registeredCityData.ts` ("69 encoded entries (from depa's ~190-zone promotion pool)")

`allCities` is the union of those three arrays (`src/cityData.ts`). The homepage counts cities at runtime from that union; it does not hard-code a total. Tests and the JSON-LD block in `index.html` currently describe the published set as **118** Thai smart cities.

Evidence depth is **not equal**. This release is an index dataset, not the complete national proposal registry. Registry-only rows stay low-confidence until city-level evidence exists.

National programme target cited in the claim registry (not SCITI's own sample size): at least 105 livable smart cities in the 2024–2027 plan period.

---

## How to run or fork

Requires **Node.js 20+** (GitHub Actions uses Node 20 for scheduled sync and Node 24 for Pages). The SPA serves the bundled city dataset locally; a backend is optional.

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

To **fork** the method rather than restyle the UI, start with:

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

Keep weights summing to 100, keep scores in 0–100, and keep every displayed national figure sourced. If you publish a fork, say so in the method code and do not present it as SCITI.

Optional (live City Data Platform / API only — leave unset to read the repo dataset):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not commit keys or `.env` files. Optional backend setup is in `database/README.md`.

Stack: React 19, Vite 6, TypeScript 5.8. Interface languages: English, Thai, Chinese (on-screen abbreviation **CN**). Routing is custom (`src/routing.ts`); do not add React Router.

Production for [sciti.nonarkara.org](https://sciti.nonarkara.org) is Cloudflare Pages. GitHub Actions also deploys a Pages mirror on push to `main`. This README does not include deploy credentials.

---

## License

- **Source code** — [MIT](LICENSE) (copyright 2026 Digital Economy Promotion Agency (depa)).
- **Published index data** (scores, rankings, generated `cities.json`) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as stated on the site footer and in `index.html` JSON-LD. Attribution: Smart City Thailand Index (SCITI), depa.
- **Photographs** keep their original licenses (often CC BY / CC BY-SA); see `src/photoCredits.ts`.
- **Hero banner** (`docs/hero-banner.png`) is studio illustration for this README, not a data product.

Fork, cite, teach, replicate, and critique. Keep the source visible, preserve the declared method, and do not imply paid placement or official ranking status this repository does not document.
