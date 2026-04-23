# Smart City Thailand Index — Database Schema

## Overview

PostgreSQL schema for Supabase powering the full City Data Platform (CDP).

## Recommended production stack

- `Supabase Postgres` as the source of truth. This backend now depends on relational joins, generated columns, indexes, row-level security, and a materialized export view. That is exactly Postgres territory.
- `SQLite` or `Turso` only as edge cache or offline companion, not as the canonical CDP database. They are excellent for simple local apps, but this product now needs richer provenance joins, concurrent write handling, and refreshable research exports.
- `Vercel Analytics` and `Vercel Speed Insights` in production so design quality is measured by real-world behavior, not taste alone.

## Tables

| Table | Purpose | Rows (estimated) |
|-------|---------|-----------------|
| `cities` | Core registry — every city in the network | 200+ |
| `city_scores` | Versioned pillar scores with composite + tier | 200+ per version |
| `city_dimensions` | Which 7 depa dimensions each city focuses on | 800+ |
| `evidence` | News, data points, field observations per city | 500+ |
| `financial_recommendations` | ASEAN toolkit instrument recommendations | 1000+ |
| `cdp_snapshots` | Cached data from government APIs | 10,000+ |
| `data_sources` | Registry of external API/data sources | 15 |
| `partnerships` | International smart city partnerships | 10+ |
| `partnership_cities` | Junction: which cities each partnership involves | 30+ |
| `city_highlights` | What actually works per city | 200+ |
| `page_views` | Analytics | growing |
| `chat_messages` | Gemini chatbot conversation history | growing |
| `smart_city_signals` | Incoming opinions, field notes, media scan, and trend signals | growing |
| `finance_instruments` | Canonical finance mechanism catalog used by the CDP backend | 10-20 |
| `city_metric_observations` | Verified line-item city metrics with timestamps and sources | growing |
| `city_delivery_profiles` | Five-step delivery status per city/version | 100+ |
| `city_finance_profiles` | Bankability/readiness profile per city/version | 100+ |
| `city_finance_recommendations` | Tailored finance recommendations with rationale | 300+ |
| `city_finance_recommendation_support` | Provenance rows backing every recommendation | 600+ |
| `city_context_notes` | Curated opportunity/constraint/warning/lesson notes | 400+ |
| `city_research_export_rows` | Materialized wide-open research export view | growing |

## Key Design Decisions

1. **Versioned scores**: `city_scores` has a `version` column. Each re-scoring creates a new version, preserving history. Latest score = highest version per city.

2. **Three city statuses**: `certified` (37 with depa logo as of January 2026), `promotion` (190 promotion cities), `registered` (submitted plans, minimal data).

3. **Data confidence**: Every city has a `data_confidence` level (`high`/`medium`/`low`). Cities with `low` confidence show a warning badge and are excluded from tier rankings.

4. **Composite formula**: `(livability×25 + economy×20 + safety×15 + wellbeing×15 + environment×10 + hospitality×10 + digital×5) / 100`. Helper function `compute_composite()` in SQL.

5. **Row-Level Security**: All tables have RLS enabled. Public read access. Most content writes stay server-side. `page_views`, `chat_messages`, and `smart_city_signals` allow anonymous inserts so the public-facing app can collect telemetry and sentiment without a heavyweight auth layer.

6. **Trend intake**: `smart_city_signals` stores how people actually talk about smart city work: source, city, raw text, tone, themes, and timestamps. It supports direct Supabase reads, Vercel API proxying, and a Google Sheets fallback via Apps Script.

7. **Idempotent signal ingestion**: signal writes now use content-stable IDs and a generated `fingerprint` index. Retries collapse into the same logical record instead of spraying duplicates all over the trend table.

8. **Fail closed on writes**: the Vercel API will serve demo data for reads when remote storage is down, but it will not pretend a write succeeded unless it reached a durable backend. That keeps operator trust intact and lets the frontend decide whether to fall back to local-only drafts.

9. **Tailored city dossiers**: the CDP backend now stores city-specific metrics, delivery logic, finance readiness, recommendation rationale, and context notes as first-class tables. The frontend should render these DTOs directly instead of inferring finance or process from tier alone.

10. **Research exports by default**: `city_research_export_rows` is the backend spine for CSV exports. If a recommendation cannot be backed by support rows, it should not be published.

## Setup

```bash
# 1. Create a Supabase project at supabase.com
# 2. Run the schema:
psql $DATABASE_URL < database/schema.sql

# 2a. Export deterministic seed files from the repo snapshot
node scripts/export-city-cdp-seeds.mjs

# 3. Set environment variables for the frontend:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Set environment variables for the Vercel API (preferred):
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional force-order:
TREND_BACKEND=supabase
```

The seed export writes:

- `database/cdp-seeds/finance-instruments.json`
- `database/cdp-seeds/city-research-export-rows.json`
- `database/cdp-seeds/cities/<city-id>.json` for every city dossier
- `database/cdp-seeds/manifest.json`

Those files are the repo-managed seed layer for the CDP backend. They are deterministic: if the source code and city inputs do not change, the exported city files do not change either.

If you already created the table before this backend hardening pass, add a migration for:

- `fingerprint` generated column on `smart_city_signals`
- unique index on `fingerprint`
- non-blank and text-length check constraints
- `metadata` object check and `themes` cardinality check

If you are migrating to the city-specific CDP backend, also add:

- `finance_instruments`
- `city_metric_observations`
- `city_delivery_profiles`
- `city_finance_profiles`
- `city_finance_recommendations`
- `city_finance_recommendation_support`
- `city_context_notes`
- `city_research_export_rows` materialized view

After loading seed data, run:

```sql
REFRESH MATERIALIZED VIEW city_research_export_rows;
```

## Backend API contract

The frontend now expects these routes to exist:

- `GET /api/cities`
- `GET /api/cities/:cityId`
- `GET /api/exports/cities-summary.csv`
- `GET /api/exports/city-facts.csv`
- `GET /api/cities/:cityId/export.csv`

The list/detail routes expose:

- freshness timestamps
- provenance counts
- delivery profile
- finance profile
- finance recommendations with support rows

That means the UI can show not just "what tier is this city?" but "why did we say that, what metric backs it, and what financing logic actually fits this place?"

## Google Sheets fallback

If Supabase is blocked, you can use Google Sheets as a scrappy but perfectly serviceable backend.

1. Open [`database/google-apps-script/Code.gs`](./google-apps-script/Code.gs) in a Google Apps Script project.
2. Set script properties:
   - `SMART_CITY_SIGNAL_SHEET_ID`
   - `SMART_CITY_SIGNAL_SECRET`
3. Deploy the script as a web app.
4. Set:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment/exec
GOOGLE_APPS_SCRIPT_SECRET=shared-secret

# Optional browser-side direct fallback
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment/exec
```

The frontend and `/api/smart-city-signals` both know how to use this endpoint. Apps Script is the emergency runway, not the flagship. Supabase remains the preferred path because it supports durable constraints, indexed reads, and idempotent upserts.

## Data Sources

| Source | API | Updates | Used for |
|--------|-----|---------|----------|
| data.go.th | CKAN API | Varies | GPP, employment, land use |
| air4thai.pcd.go.th | REST | Hourly | PM2.5, AQI |
| stathub.nso.go.th | SDMX | Annual | Census, income, demographics |
| sphere.gistda.or.th | WMS/API | Quarterly | Satellite, green coverage |
| citydata.in.th | Dashboard | Real-time | IoT, citizen engagement |
| stat.bora.dopa.go.th | Download | Monthly | Population |
