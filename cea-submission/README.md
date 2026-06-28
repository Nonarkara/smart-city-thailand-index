# SCITI 2026 — CEA Creative Excellence Awards 2026 Submission

Category **1.3 Creative City Policy Award**  
Applicant: **depa Smart City Promotion Department, Ministry of Digital Economy and Society (MDES)**  
Submission deadline: **30 June 2026**

---

## Submission documents

| File | Purpose | Pages |
|---|---|---|
| `executive-summary.pdf` | Thai narrative explaining SCITI 2026 as a creative government policy instrument | 4 |
| `fact-sheet.pdf` | One-page landscape visual fact sheet | 1 |
| `evidence-appendix.pdf` | Inventory of evidence, sources, and verified claims | 2 |

## Supporting evidence

- `screenshots/` — full-page desktop + mobile captures of the live site
  - `01-home-desktop.png`
  - `02-invest-desktop.png`
  - `03-rankings-desktop.png`
  - `04-methodology-desktop.png`
  - `05-home-mobile.png`
- `../public/downloads/` — published reports and guidelines
  - `SCITI-2026-Executive-Summary.pdf`
  - `SCITI-2026-Methodology.pdf`
  - `SCITI-2026-Report.pdf`
  - `SCITI-2026-Audit.pdf`
  - `smart-city-local-proposal-guideline-scl6-2026.pdf`
  - `thailand-digital-catalog-scl6-2026.pdf`

## Live properties

- **Website:** https://sciti.nonarkara.org
- **Source code:** https://github.com/Nonarkara/smart-city-thailand-index
- **License:** CC BY 4.0

## Key message

SCITI 2026 is the first transparent, outcome-based assessment instrument for Thailand’s Smart City Thailand programme. It is designed as a **government policy/measure** that:

1. Closes the accountability gap between certification and real outcomes.
2. Reveals each province/city’s **structural competitive advantage** so it can be matched with the right investors, technologies, and markets.
3. Publishes open data and auditable methodology so citizens, cities, and investors can act on the same facts.

## How to regenerate PDFs / screenshots

```bash
# PDFs
node cea-submission/generate-pdfs.mjs

# Screenshots
node cea-submission/capture-screenshots.mjs
```

Requires `@playwright/test` and its Chromium browser (already installed in this project).
