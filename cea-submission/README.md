# SCITI 2026 — CEA Creative Excellence Awards 2026 Submission

Category **1.3 Creative City Policy Award**
Applicant: **depa Smart City Promotion Department, Ministry of Digital Economy and Society (MDES)**

---

## What's actually in this folder

| Item | What it is |
|---|---|
| `sciti-cea-2026-submission.zip` | Packaged executive-summary / fact-sheet / evidence-appendix PDFs + screenshots. **Dated 28 June — predates later content fixes** (see note below). Verify contents before submitting. |
| `screenshots/` | 5 full-page site captures (home, invest, rankings, methodology, mobile home) — the source images inside the zip. |
| `key-source-code/` | 8 real source files (scoring engine, routing, trilingual helper, data pipeline) with a bilingual README, for judges who want to verify the technical substance behind the claims. |
| `capture-screenshots.mjs` | Regenerates `screenshots/` via Playwright. |
| `generate-pdfs.mjs` | Regenerates the three PDFs from `executive-summary.html` / `fact-sheet.html` / `evidence-appendix.html` — **those `.html` sources are not currently in this folder**; recreate or restore them before running this script. |

> **Known gap:** an earlier pass produced a corrected PDF pack (`form-pack/` /
> `gdrive-pack/`, built via `build-form-pack.mjs` from a `content.json` with
> verified figures) that removed a stale self-review score and fixed a factual
> error. Those files and that script are no longer on disk. If the zip above
> is what actually gets submitted, diff its contents against the live site
> and `src/claimRegistry.ts` before sending — don't assume it reflects the
> latest fixes.

## Live properties

- **Website:** https://sciti.nonarkara.org
- **Source code:** https://github.com/Nonarkara/smart-city-thailand-index
- **License:** CC BY 4.0
- **Open dataset:** https://sciti.nonarkara.org/downloads/SCITI-2026-cities-dataset.csv (118 cities × 22 columns)

## Key message

SCITI 2026 is a transparent, outcome-based assessment instrument for Thailand's
Smart City Thailand programme. It is designed as a **government policy/measure** that:

1. Closes the accountability gap between certification and real outcomes.
2. Reveals each province/city's **structural competitive advantage** so it can be matched with the right investors, technologies, and markets.
3. Publishes open data and auditable methodology so citizens, cities, and investors can act on the same facts.

## How to regenerate

```bash
# Site screenshots
node cea-submission/capture-screenshots.mjs

# PDFs — requires executive-summary.html / fact-sheet.html / evidence-appendix.html
# to exist in this folder first (not currently present — see "Known gap" above)
node cea-submission/generate-pdfs.mjs
```

Requires Playwright + Chromium (already installed in this project).
