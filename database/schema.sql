-- ═══════════════════════════════════════════════════════════════════════════
-- SMART CITY THAILAND INDEX — Database Schema (Supabase / PostgreSQL)
-- ═══════════════════════════════════════════════════════════════════════════
-- This schema powers the full City Data Platform:
-- - 100+ city registry with scores, metrics, and dimensions
-- - Evidence provenance (news, data, field observations)
-- - Financial toolkit recommendations
-- - CDP API data snapshots
-- - International partnerships
-- - Visitor analytics
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── ENUMS ───

CREATE TYPE city_status AS ENUM ('certified', 'promotion', 'registered');
CREATE TYPE city_reality AS ENUM ('operational', 'partial', 'planned');
CREATE TYPE city_region AS ENUM ('north', 'central', 'northeast', 'east', 'south', 'bangkok');
CREATE TYPE city_tier AS ENUM ('alpha', 'beta', 'gamma');
CREATE TYPE data_confidence AS ENUM ('high', 'medium', 'low');
CREATE TYPE evidence_type AS ENUM ('news', 'data', 'field', 'satellite', 'government');
CREATE TYPE recommendation_priority AS ENUM ('primary', 'secondary', 'exploratory');
CREATE TYPE partnership_status AS ENUM ('active', 'completed', 'stalled', 'early');
CREATE TYPE smart_dimension AS ENUM ('economy', 'energy', 'environment', 'governance', 'living', 'mobility', 'people');
CREATE TYPE signal_sentiment AS ENUM ('positive', 'neutral', 'negative');

-- ─── 1. CITIES — Core registry ───

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  province TEXT NOT NULL,
  province_th TEXT NOT NULL,
  region city_region NOT NULL,
  status city_status NOT NULL DEFAULT 'registered',
  reality city_reality NOT NULL DEFAULT 'planned',
  batch INT,                              -- certification batch (1-4) for certified cities
  lat DECIMAL(8, 5),
  lng DECIMAL(8, 5),
  population_thousands INT,
  gpp_per_capita INT,                     -- Thai baht
  avg_monthly_income INT,                 -- Thai baht
  pm25_annual DECIMAL(4, 1),              -- ug/m3
  hospital_beds_per_10k INT,
  crime_rate_per_100k INT,
  green_coverage INT,                     -- percentage 0-100
  data_confidence data_confidence NOT NULL DEFAULT 'low',
  tagline TEXT,
  tagline_th TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cities_status ON cities(status);
CREATE INDEX idx_cities_region ON cities(region);

-- ─── 2. CITY SCORES — Versioned pillar scores with audit trail ───

CREATE TABLE city_scores (
  id SERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  livability INT CHECK (livability BETWEEN 0 AND 100),
  economy INT CHECK (economy BETWEEN 0 AND 100),
  safety INT CHECK (safety BETWEEN 0 AND 100),
  wellbeing INT CHECK (wellbeing BETWEEN 0 AND 100),
  environment INT CHECK (environment BETWEEN 0 AND 100),
  hospitality INT CHECK (hospitality BETWEEN 0 AND 100),
  digital INT CHECK (digital BETWEEN 0 AND 100),
  composite DECIMAL(4, 1),
  tier city_tier,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, version)
);

CREATE INDEX idx_city_scores_city ON city_scores(city_id);
CREATE INDEX idx_city_scores_tier ON city_scores(tier);

-- ─── 3. CITY DIMENSIONS — Which depa dimensions each city focuses on ───

CREATE TABLE city_dimensions (
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  dimension smart_dimension NOT NULL,
  PRIMARY KEY (city_id, dimension)
);

-- ─── 4. EVIDENCE — News, data points, field observations per city ───

CREATE TABLE evidence (
  id SERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  pillar TEXT,
  type evidence_type NOT NULL,
  title_en TEXT,
  title_th TEXT,
  title_zh TEXT,
  source TEXT NOT NULL,
  url TEXT,
  date TEXT,
  metric TEXT,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_city ON evidence(city_id);
CREATE INDEX idx_evidence_type ON evidence(type);

-- ─── 5. FINANCIAL RECOMMENDATIONS — Instrument recommendations per city ───

CREATE TABLE financial_recommendations (
  id SERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  instrument_id TEXT NOT NULL,
  priority recommendation_priority NOT NULL,
  reason_en TEXT,
  reason_th TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fin_rec_city ON financial_recommendations(city_id);

-- ─── 6. CDP SNAPSHOTS — Cached data from government APIs ───

CREATE TABLE cdp_snapshots (
  id SERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL,               -- e.g. 'air4thai', 'nso', 'gistda'
  metric TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cdp_city ON cdp_snapshots(city_id);
CREATE INDEX idx_cdp_source ON cdp_snapshots(source_id);
CREATE INDEX idx_cdp_fetched ON cdp_snapshots(fetched_at);

-- ─── 7. DATA SOURCES — Registry of external API/data sources ───

CREATE TABLE data_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,                    -- 'government', 'international', 'satellite', 'field', 'academic'
  desc_en TEXT,
  desc_th TEXT,
  desc_zh TEXT,
  url TEXT,
  api_endpoint TEXT,
  update_frequency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 8. PARTNERSHIPS — International smart city partnerships ───

CREATE TABLE partnerships (
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  country_th TEXT,
  flag TEXT,                              -- emoji flag
  program TEXT NOT NULL,
  year_established TEXT,
  investment TEXT,
  status partnership_status NOT NULL DEFAULT 'active',
  focus_en TEXT,
  focus_th TEXT,
  body_en TEXT,
  body_th TEXT,
  source_url TEXT,
  source_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 9. PARTNERSHIP CITIES — Junction table ───

CREATE TABLE partnership_cities (
  partnership_id INT NOT NULL REFERENCES partnerships(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  PRIMARY KEY (partnership_id, city_id)
);

-- ─── 10. CITY HIGHLIGHTS — What actually works ───

CREATE TABLE city_highlights (
  id SERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  highlight TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- ─── 11. PAGE VIEWS — Analytics ───

CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  city_id TEXT,
  locale TEXT,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_views_city ON page_views(city_id);
CREATE INDEX idx_page_views_date ON page_views(viewed_at);

-- ─── 12. CHAT HISTORY — Gemini chatbot conversations ───

CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  locale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_session ON chat_messages(session_id);

-- ─── 13. SMART CITY SIGNALS — Incoming sentiment / trend observations ───

CREATE TABLE smart_city_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'manual',
  text_body TEXT NOT NULL,
  sentiment_label signal_sentiment NOT NULL DEFAULT 'neutral',
  sentiment_score DECIMAL(4, 2) NOT NULL DEFAULT 0 CHECK (sentiment_score BETWEEN -1 AND 1),
  themes TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_smart_city_signals_observed ON smart_city_signals(observed_at DESC);
CREATE INDEX idx_smart_city_signals_city ON smart_city_signals(city_id);
CREATE INDEX idx_smart_city_signals_sentiment ON smart_city_signals(sentiment_label);
CREATE INDEX idx_smart_city_signals_themes ON smart_city_signals USING GIN(themes);

CREATE OR REPLACE VIEW smart_city_signal_daily_trends AS
SELECT
  DATE_TRUNC('day', observed_at) AS observed_day,
  sentiment_label,
  COUNT(*) AS signal_count,
  AVG(sentiment_score) AS avg_sentiment
FROM smart_city_signals
GROUP BY 1, 2;

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW-LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cdp_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_city_signals ENABLE ROW LEVEL SECURITY;

-- Public read access for all content tables
CREATE POLICY "Public read" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_scores FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_dimensions FOR SELECT USING (true);
CREATE POLICY "Public read" ON evidence FOR SELECT USING (true);
CREATE POLICY "Public read" ON financial_recommendations FOR SELECT USING (true);
CREATE POLICY "Public read" ON cdp_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read" ON data_sources FOR SELECT USING (true);
CREATE POLICY "Public read" ON partnerships FOR SELECT USING (true);
CREATE POLICY "Public read" ON partnership_cities FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_highlights FOR SELECT USING (true);
CREATE POLICY "Public read" ON smart_city_signals FOR SELECT USING (true);

-- Analytics: anyone can insert (anonymous writes)
CREATE POLICY "Anyone can insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert" ON smart_city_signals FOR INSERT WITH CHECK (true);

-- Write access for content tables requires service role (server-side only)
-- Supabase service_role key bypasses RLS automatically

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Compute composite score from pillar scores
CREATE OR REPLACE FUNCTION compute_composite(
  p_livability INT, p_economy INT, p_safety INT,
  p_wellbeing INT, p_environment INT, p_hospitality INT, p_digital INT
) RETURNS DECIMAL(4,1) AS $$
BEGIN
  RETURN ROUND(
    (p_livability * 25 + p_economy * 20 + p_safety * 15 +
     p_wellbeing * 15 + p_environment * 10 + p_hospitality * 10 + p_digital * 5
    )::DECIMAL / 100, 1
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Assign tier from composite score
CREATE OR REPLACE FUNCTION assign_tier(composite DECIMAL)
RETURNS city_tier AS $$
BEGIN
  IF composite >= 65 THEN RETURN 'alpha'; END IF;
  IF composite >= 45 THEN RETURN 'beta'; END IF;
  RETURN 'gamma';
END;
$$ LANGUAGE plpgsql IMMUTABLE;
