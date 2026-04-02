# Smart City Thailand Index — Database Schema

## Overview

PostgreSQL schema for Supabase powering the full City Data Platform (CDP).

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

## Key Design Decisions

1. **Versioned scores**: `city_scores` has a `version` column. Each re-scoring creates a new version, preserving history. Latest score = highest version per city.

2. **Three city statuses**: `certified` (37 with depa logo), `promotion` (173 promotion zones), `registered` (submitted plans, minimal data).

3. **Data confidence**: Every city has a `data_confidence` level (`high`/`medium`/`low`). Cities with `low` confidence show a warning badge and are excluded from tier rankings.

4. **Composite formula**: `(livability×25 + economy×20 + safety×15 + wellbeing×15 + environment×10 + hospitality×10 + digital×5) / 100`. Helper function `compute_composite()` in SQL.

5. **Row-Level Security**: All tables have RLS enabled. Public read access. Most content writes stay server-side. `page_views`, `chat_messages`, and `smart_city_signals` allow anonymous inserts so the public-facing app can collect telemetry and sentiment without a heavyweight auth layer.

6. **Trend intake**: `smart_city_signals` stores how people actually talk about smart city work: source, city, raw text, tone, themes, and timestamps. It supports direct Supabase reads, Vercel API proxying, and a Google Sheets fallback via Apps Script.

## Setup

```bash
# 1. Create a Supabase project at supabase.com
# 2. Run the schema:
psql $DATABASE_URL < database/schema.sql

# 3. Set environment variables for the frontend:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Set environment variables for the Vercel API (preferred):
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional force-order:
TREND_BACKEND=supabase
```

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

The frontend and `/api/smart-city-signals` both know how to use this endpoint.

## Data Sources

| Source | API | Updates | Used for |
|--------|-----|---------|----------|
| data.go.th | CKAN API | Varies | GPP, employment, land use |
| air4thai.pcd.go.th | REST | Hourly | PM2.5, AQI |
| stathub.nso.go.th | SDMX | Annual | Census, income, demographics |
| sphere.gistda.or.th | WMS/API | Quarterly | Satellite, green coverage |
| citydata.in.th | Dashboard | Real-time | IoT, citizen engagement |
| stat.bora.dopa.go.th | Download | Monthly | Population |
