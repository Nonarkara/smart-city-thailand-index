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

## Key Design Decisions

1. **Versioned scores**: `city_scores` has a `version` column. Each re-scoring creates a new version, preserving history. Latest score = highest version per city.

2. **Three city statuses**: `certified` (37 with depa logo), `promotion` (173 promotion zones), `registered` (submitted plans, minimal data).

3. **Data confidence**: Every city has a `data_confidence` level (`high`/`medium`/`low`). Cities with `low` confidence show a warning badge and are excluded from tier rankings.

4. **Composite formula**: `(livability×25 + economy×20 + safety×15 + wellbeing×15 + environment×10 + hospitality×10 + digital×5) / 100`. Helper function `compute_composite()` in SQL.

5. **Row-Level Security**: All tables have RLS enabled. Public read access. Write access requires Supabase service role key (server-side only). Analytics tables allow anonymous inserts.

## Setup

```bash
# 1. Create a Supabase project at supabase.com
# 2. Run the schema:
psql $DATABASE_URL < database/schema.sql

# 3. Set environment variables:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Data Sources

| Source | API | Updates | Used for |
|--------|-----|---------|----------|
| data.go.th | CKAN API | Varies | GPP, employment, land use |
| air4thai.pcd.go.th | REST | Hourly | PM2.5, AQI |
| stathub.nso.go.th | SDMX | Annual | Census, income, demographics |
| sphere.gistda.or.th | WMS/API | Quarterly | Satellite, green coverage |
| citydata.in.th | Dashboard | Real-time | IoT, citizen engagement |
| stat.bora.dopa.go.th | Download | Monthly | Population |
