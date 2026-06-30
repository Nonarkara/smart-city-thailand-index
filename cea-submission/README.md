# SCITI 2026 — CEA Creative Excellence Awards 2026 Submission

Category **1.3 Creative City Policy Award**
Applicant: **depa Smart City Promotion Department, Ministry of Digital Economy and Society (MDES)**
Submission deadline: **30 June 2026**

---

## Canonical deliverables

The submission set lives in **`gdrive-pack/`** (upload-ready) and is built from
**`form-pack/`**. These three PDFs are the only documents to submit:

| File | Purpose | Form field |
|---|---|---|
| `SCITI-2026-CEA-Form-Answers.pdf` | Trilingual answers to form questions (Q1–Q3, Q13–Q16) | Q17/Q18 upload |
| `SCITI-2026-CEA-Proposal.pdf` | Proposal against all five official requirements | Q4 attachment |
| `SCITI-2026-CEA-Portfolio.pdf` | Design notes + live-site plates | Q5 attachment |

Plus the open dataset for the judges:

| File | Purpose |
|---|---|
| `SCITI-2026-cities-dataset.csv` | Full 118-city × 22-column dataset (UTF-8, opens in Excel) |

All three PDFs are under the form's 10 MB limit, and the same dataset CSV is
published live at `https://sciti.nonarkara.org/downloads/SCITI-2026-cities-dataset.csv`.

> Superseded internal drafts (executive-summary, fact-sheet, evidence-appendix,
> the old `form-docs/`) are in `_ARCHIVE-DO-NOT-SEND/` — **do not submit them.**

## Page snapshots

`gdrive-pack/` also carries PNG snapshots of every page (150 DPI) for quick
browsing without opening the PDFs, plus `README.txt` (bilingual index).

## Live properties

- **Website:** https://sciti.nonarkara.org
- **Source code:** https://github.com/Nonarkara/smart-city-thailand-index
- **License:** CC BY 4.0

## Key message

SCITI 2026 is a transparent, outcome-based assessment instrument for Thailand's
Smart City Thailand programme. It is designed as a **government policy/measure** that:

1. Closes the accountability gap between certification and real outcomes.
2. Reveals each province/city's **structural competitive advantage** so it can be matched with the right investors, technologies, and markets.
3. Publishes open data and auditable methodology so citizens, cities, and investors can act on the same facts.

## How to regenerate

```bash
# Form-pack PDFs (answers / proposal / portfolio) — reads content.json
node cea-submission/build-form-pack.mjs

# Dataset CSV — reads dist/data/cities.json (run a build first)
node cea-submission/generate-data-csv.mjs

# Site screenshots
node cea-submission/capture-site-screens.mjs
```

Requires Playwright + Chromium (already installed in this project).
