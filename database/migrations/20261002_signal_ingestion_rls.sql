-- Apply to existing installations; schema.sql covers fresh installations.
-- Preserve public reads, but remove the previously anonymous write policy.
BEGIN;
ALTER TABLE public.smart_city_signals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert" ON public.smart_city_signals;
REVOKE INSERT, UPDATE, DELETE ON public.smart_city_signals FROM anon, authenticated;
COMMIT;
