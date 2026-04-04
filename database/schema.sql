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
  themes TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(themes) <= 8),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fingerprint TEXT GENERATED ALWAYS AS (
    encode(
      digest(
        concat_ws(
          '|',
          coalesce(city_id, ''),
          btrim(source),
          btrim(channel),
          btrim(text_body),
          sentiment_label::TEXT,
          observed_at::TEXT,
          array_to_string(themes, '||')
        ),
        'sha256'
      ),
      'hex'
    )
  ) STORED,
  CONSTRAINT smart_city_signals_source_not_blank CHECK (length(btrim(source)) > 0),
  CONSTRAINT smart_city_signals_channel_not_blank CHECK (length(btrim(channel)) > 0),
  CONSTRAINT smart_city_signals_text_not_blank CHECK (length(btrim(text_body)) > 0),
  CONSTRAINT smart_city_signals_text_reasonable_length CHECK (length(text_body) <= 5000)
);

CREATE INDEX idx_smart_city_signals_observed ON smart_city_signals(observed_at DESC);
CREATE INDEX idx_smart_city_signals_city ON smart_city_signals(city_id);
CREATE INDEX idx_smart_city_signals_sentiment ON smart_city_signals(sentiment_label);
CREATE INDEX idx_smart_city_signals_themes ON smart_city_signals USING GIN(themes);
CREATE INDEX idx_smart_city_signals_channel ON smart_city_signals(channel);
CREATE UNIQUE INDEX idx_smart_city_signals_fingerprint ON smart_city_signals(fingerprint);

CREATE OR REPLACE VIEW smart_city_signal_daily_trends AS
SELECT
  DATE_TRUNC('day', observed_at) AS observed_day,
  sentiment_label,
  COUNT(*) AS signal_count,
  AVG(sentiment_score) AS avg_sentiment
FROM smart_city_signals
GROUP BY 1, 2;

-- ─── 14. CITY CDP CORE — Tailored delivery / finance dossiers ───

CREATE TABLE finance_instruments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('debt', 'equity', 'grant', 'hybrid', 'innovative')),
  segment_fit city_tier[] NOT NULL DEFAULT '{}',
  description JSONB NOT NULL CHECK (jsonb_typeof(description) = 'object'),
  why_it_fits JSONB NOT NULL CHECK (jsonb_typeof(why_it_fits) = 'object'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE city_metric_observations (
  id BIGSERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  metric_value_num DECIMAL(14, 2),
  metric_value_text TEXT,
  unit TEXT,
  period_label TEXT NOT NULL,
  source_id TEXT REFERENCES data_sources(id) ON DELETE SET NULL,
  source_url TEXT,
  observed_at TIMESTAMPTZ NOT NULL,
  confidence DECIMAL(4, 2) NOT NULL DEFAULT 0.75 CHECK (confidence BETWEEN 0 AND 1),
  method_note TEXT NOT NULL DEFAULT '',
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT city_metric_observations_value_present CHECK (
    metric_value_num IS NOT NULL OR
    (metric_value_text IS NOT NULL AND length(btrim(metric_value_text)) > 0)
  )
);

CREATE UNIQUE INDEX idx_city_metric_observations_unique
  ON city_metric_observations(city_id, metric_key, period_label, observed_at, version);
CREATE INDEX idx_city_metric_observations_city ON city_metric_observations(city_id);
CREATE INDEX idx_city_metric_observations_metric ON city_metric_observations(metric_key);

CREATE TABLE city_delivery_profiles (
  id BIGSERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  vision_status TEXT NOT NULL CHECK (vision_status IN ('ready', 'building', 'gap')),
  infrastructure_status TEXT NOT NULL CHECK (infrastructure_status IN ('ready', 'building', 'gap')),
  data_platform_status TEXT NOT NULL CHECK (data_platform_status IN ('ready', 'building', 'gap')),
  business_model_status TEXT NOT NULL CHECK (business_model_status IN ('ready', 'building', 'gap')),
  partnership_status TEXT NOT NULL CHECK (partnership_status IN ('ready', 'building', 'gap')),
  recommended_lead_step TEXT NOT NULL CHECK (recommended_lead_step IN ('vision', 'infrastructure', 'data_platform', 'business_model', 'partnerships')),
  delivery_note JSONB NOT NULL CHECK (jsonb_typeof(delivery_note) = 'object'),
  public_role JSONB NOT NULL CHECK (jsonb_typeof(public_role) = 'object'),
  private_role JSONB NOT NULL CHECK (jsonb_typeof(private_role) = 'object'),
  risk_allocation JSONB NOT NULL CHECK (jsonb_typeof(risk_allocation) = 'object'),
  contract_lens JSONB NOT NULL CHECK (jsonb_typeof(contract_lens) = 'object'),
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, version)
);

CREATE TABLE city_finance_profiles (
  id BIGSERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  revenue_base TEXT NOT NULL CHECK (revenue_base IN ('strong', 'moderate', 'thin')),
  institutional_capacity TEXT NOT NULL CHECK (institutional_capacity IN ('strong', 'moderate', 'thin')),
  project_pipeline TEXT NOT NULL CHECK (project_pipeline IN ('strong', 'moderate', 'thin')),
  private_interest TEXT NOT NULL CHECK (private_interest IN ('strong', 'moderate', 'thin')),
  risk_profile TEXT NOT NULL CHECK (risk_profile IN ('low', 'medium', 'high', 'acute')),
  delivery_readiness TEXT NOT NULL CHECK (delivery_readiness IN ('advanced', 'building', 'foundational')),
  readiness_score INT NOT NULL CHECK (readiness_score BETWEEN 0 AND 100),
  segment city_tier NOT NULL,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, version)
);

CREATE TABLE city_finance_recommendations (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  instrument_id TEXT NOT NULL REFERENCES finance_instruments(id) ON DELETE RESTRICT,
  priority TEXT NOT NULL CHECK (priority IN ('lead', 'secondary', 'watch')),
  priority_score INT NOT NULL CHECK (priority_score BETWEEN 0 AND 100),
  stage city_reality NOT NULL,
  segment city_tier NOT NULL,
  reason_summary JSONB NOT NULL CHECK (jsonb_typeof(reason_summary) = 'object'),
  next_step JSONB NOT NULL CHECK (jsonb_typeof(next_step) = 'object'),
  why_now JSONB NOT NULL CHECK (jsonb_typeof(why_now) = 'object'),
  public_funding_role JSONB NOT NULL CHECK (jsonb_typeof(public_funding_role) = 'object'),
  private_capital_role JSONB NOT NULL CHECK (jsonb_typeof(private_capital_role) = 'object'),
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_city_finance_recommendations_city ON city_finance_recommendations(city_id);
CREATE INDEX idx_city_finance_recommendations_priority ON city_finance_recommendations(priority);

CREATE TABLE city_finance_recommendation_support (
  id BIGSERIAL PRIMARY KEY,
  recommendation_id TEXT NOT NULL REFERENCES city_finance_recommendations(id) ON DELETE CASCADE,
  metric_observation_id BIGINT REFERENCES city_metric_observations(id) ON DELETE CASCADE,
  evidence_id BIGINT REFERENCES evidence(id) ON DELETE CASCADE,
  support_type TEXT NOT NULL CHECK (support_type IN ('metric', 'evidence')),
  summary TEXT NOT NULL,
  source_id TEXT,
  source_url TEXT,
  observed_at TIMESTAMPTZ NOT NULL,
  confidence DECIMAL(4, 2) NOT NULL DEFAULT 0.75 CHECK (confidence BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT city_finance_support_reference_present CHECK (
    metric_observation_id IS NOT NULL OR evidence_id IS NOT NULL
  )
);

CREATE INDEX idx_city_finance_support_recommendation ON city_finance_recommendation_support(recommendation_id);

CREATE TABLE city_context_notes (
  id BIGSERIAL PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  note_kind TEXT NOT NULL CHECK (note_kind IN ('opportunity', 'constraint', 'implementation_warning', 'exportable_lesson')),
  title JSONB NOT NULL CHECK (jsonb_typeof(title) = 'object'),
  body JSONB NOT NULL CHECK (jsonb_typeof(body) = 'object'),
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, note_kind, version)
);

CREATE MATERIALIZED VIEW city_research_export_rows AS
SELECT
  c.id AS city_id,
  c.name_en AS city_name_en,
  c.name_th AS city_name_th,
  c.province AS province,
  'metric'::TEXT AS fact_type,
  o.metric_key AS metric_key_or_recommendation_key,
  COALESCE(o.metric_value_text, o.metric_value_num::TEXT, '') AS value,
  COALESCE(o.unit, '') AS unit,
  COALESCE(o.source_id, '') AS source_id,
  COALESCE(o.source_url, '') AS source_url,
  o.observed_at AS observed_at,
  o.confidence::TEXT AS confidence,
  o.version AS version
FROM city_metric_observations o
JOIN cities c ON c.id = o.city_id

UNION ALL

SELECT
  c.id AS city_id,
  c.name_en AS city_name_en,
  c.name_th AS city_name_th,
  c.province AS province,
  'recommendation'::TEXT AS fact_type,
  r.instrument_id AS metric_key_or_recommendation_key,
  s.summary AS value,
  '' AS unit,
  COALESCE(s.source_id, '') AS source_id,
  COALESCE(s.source_url, '') AS source_url,
  s.observed_at AS observed_at,
  s.confidence::TEXT AS confidence,
  r.version AS version
FROM city_finance_recommendations r
JOIN city_finance_recommendation_support s ON s.recommendation_id = r.id
JOIN cities c ON c.id = r.city_id

UNION ALL

SELECT
  c.id AS city_id,
  c.name_en AS city_name_en,
  c.name_th AS city_name_th,
  c.province AS province,
  'context'::TEXT AS fact_type,
  n.note_kind AS metric_key_or_recommendation_key,
  COALESCE(n.body ->> 'en', '') AS value,
  '' AS unit,
  'sciti-curation' AS source_id,
  '' AS source_url,
  n.created_at AS observed_at,
  '0.8' AS confidence,
  n.version AS version
FROM city_context_notes n
JOIN cities c ON c.id = n.city_id
WITH NO DATA;

CREATE INDEX idx_city_research_export_rows_city ON city_research_export_rows(city_id);
CREATE INDEX idx_city_research_export_rows_fact_type ON city_research_export_rows(fact_type);

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
ALTER TABLE finance_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_metric_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_delivery_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_finance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_finance_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_finance_recommendation_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_context_notes ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Public read" ON finance_instruments FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_metric_observations FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_delivery_profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_finance_profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_finance_recommendations FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_finance_recommendation_support FOR SELECT USING (true);
CREATE POLICY "Public read" ON city_context_notes FOR SELECT USING (true);

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
