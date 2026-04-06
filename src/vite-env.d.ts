/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_GOOGLE_APPS_SCRIPT_URL?: string;
  readonly VITE_SCITI_TRACKING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
