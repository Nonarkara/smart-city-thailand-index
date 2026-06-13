import {
  buildStableSignalId,
  coerceSentimentScore,
  normalizeLabel,
  normalizeOptionalSlug,
  normalizeSignalSentiment,
  normalizeSignalText,
  normalizeThemes,
  normalizeTimestamp,
  parseSignalLimit,
  SignalValidationError,
  type SignalBackendMode,
  type SignalSentiment,
} from "../src/signalContracts";

type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

type SignalRecord = {
  id: string;
  city_id: string | null;
  source: string;
  channel: string;
  text_body: string;
  sentiment_label: SignalSentiment;
  sentiment_score: number;
  themes: string[];
  observed_at: string;
  ingested_at: string;
};

type BackendStatus = {
  mode: SignalBackendMode;
  healthy: boolean;
  detail: string;
};

type ListResponse = {
  backend: BackendStatus;
  signals: SignalRecord[];
  warnings?: string[];
};

type InsertResponse =
  | {
      ok: true;
      statusCode: 201;
      backend: BackendStatus;
      signal: SignalRecord;
      warnings: string[];
    }
  | {
      ok: false;
      statusCode: 503;
      backend: BackendStatus;
      signal: SignalRecord;
      error: string;
      warnings: string[];
    };

const TABLE_NAME = process.env.SUPABASE_SIGNALS_TABLE || "smart_city_signals";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BACKEND_TIMEOUT_MS = 8000;

const DEMO_SIGNALS: SignalRecord[] = [
  {
    id: "server-demo-1",
    city_id: "nakhon-si-thammarat",
    source: "demo seed",
    channel: "manual",
    text_body: "Flood-warning trust and visible service delivery still dominate the strongest positive smart-city stories.",
    sentiment_label: "positive",
    sentiment_score: 0.8,
    themes: ["resilience", "trust", "service delivery"],
    observed_at: "2026-03-28T09:30:00.000Z",
    ingested_at: "2026-03-28T09:30:00.000Z",
  },
  {
    id: "server-demo-2",
    city_id: "wangchan-valley",
    source: "demo seed",
    channel: "press",
    text_body: "The reality gap still gets punished whenever branding outruns built outcomes.",
    sentiment_label: "negative",
    sentiment_score: -0.82,
    themes: ["branding", "reality gap", "governance"],
    observed_at: "2026-03-25T12:00:00.000Z",
    ingested_at: "2026-03-25T12:00:00.000Z",
  },
];

function createRequestId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseJsonBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      throw new SignalValidationError("body", "Request body must be valid JSON.");
    }
  }

  if (typeof body === "object" && body !== null) {
    return body as Record<string, unknown>;
  }

  return {};
}

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "";

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";

  return {
    url,
    key,
    ready: Boolean(url && key),
  };
}

function getAppsScriptConfig() {
  const url =
    process.env.GOOGLE_APPS_SCRIPT_URL ||
    process.env.VITE_GOOGLE_APPS_SCRIPT_URL ||
    "";

  return {
    url,
    secret: process.env.GOOGLE_APPS_SCRIPT_SECRET || "",
    ready: Boolean(url),
  };
}

function withSecret(url: string, secret: string, params: Record<string, string>): string {
  const target = new URL(url);

  Object.entries(params).forEach(([key, value]) => {
    target.searchParams.set(key, value);
  });

  if (secret) {
    target.searchParams.set("secret", secret);
  }

  return target.toString();
}

async function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Backend request timed out after ${BACKEND_TIMEOUT_MS}ms.`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeSignal(body: Record<string, unknown>): SignalRecord {
  const now = new Date().toISOString();
  const cityId = normalizeOptionalSlug(body.city_id ?? body.cityId);
  const source = normalizeLabel(body.source, "unknown");
  const channel = normalizeLabel(body.channel, "manual");
  const textBody = normalizeSignalText(body.text_body ?? body.text);

  if (!textBody) {
    throw new SignalValidationError("text", "Signal text is required.");
  }

  const sentiment = normalizeSignalSentiment(body.sentiment_label ?? body.sentiment);
  const observedAt = normalizeTimestamp(body.observed_at ?? body.observedAt, now, "observedAt");
  const ingestedAt = normalizeTimestamp(body.ingested_at ?? body.createdAt, now, "createdAt");
  const themes = normalizeThemes(body.themes);
  const computedId = buildStableSignalId({
    cityId,
    source,
    channel,
    text: textBody,
    sentiment,
    themes,
    observedAt,
  });
  const providedId = typeof body.id === "string" && UUID_PATTERN.test(body.id.trim())
    ? body.id.trim()
    : "";

  return {
    id: providedId || computedId,
    city_id: cityId,
    source,
    channel,
    text_body: textBody,
    sentiment_label: sentiment,
    sentiment_score: coerceSentimentScore(body.sentiment_score ?? body.sentimentScore, sentiment),
    themes,
    observed_at: observedAt,
    ingested_at: ingestedAt,
  };
}

async function listFromSupabase(limit: number): Promise<ListResponse> {
  const { url, key } = getSupabaseConfig();
  const target = new URL(`${url}/rest/v1/${TABLE_NAME}`);

  target.searchParams.set(
    "select",
    "id,city_id,source,channel,text_body,sentiment_label,sentiment_score,themes,observed_at,ingested_at",
  );
  target.searchParams.set("order", "observed_at.desc");
  target.searchParams.set("limit", String(limit));

  const response = await fetchWithTimeout(target.toString(), {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase ${response.status} ${response.statusText}`.trim());
  }

  const signals = await response.json() as SignalRecord[];

  return {
    backend: {
      mode: "supabase",
      healthy: true,
      detail: "Vercel API is reading live data from Supabase.",
    },
    signals,
  };
}

async function insertIntoSupabase(signal: SignalRecord): Promise<SignalRecord> {
  const { url, key } = getSupabaseConfig();
  const target = new URL(`${url}/rest/v1/${TABLE_NAME}`);

  target.searchParams.set("on_conflict", "id");
  target.searchParams.set(
    "select",
    "id,city_id,source,channel,text_body,sentiment_label,sentiment_score,themes,observed_at,ingested_at",
  );

  const response = await fetchWithTimeout(target.toString(), {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(signal),
  });

  if (!response.ok) {
    throw new Error(`Supabase ${response.status} ${response.statusText}`.trim());
  }

  const payload = await response.json() as SignalRecord[];
  return payload[0] ?? signal;
}

async function listFromAppsScript(limit: number): Promise<ListResponse> {
  const { url, secret } = getAppsScriptConfig();
  const response = await fetchWithTimeout(
    withSecret(url, secret, { action: "list", limit: String(limit) }),
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Apps Script ${response.status} ${response.statusText}`.trim());
  }

  const payload = await response.json() as { signals?: SignalRecord[] };

  return {
    backend: {
      mode: "google-apps-script",
      healthy: true,
      detail: "Vercel API is proxying Google Sheets through Apps Script.",
    },
    signals: payload.signals ?? [],
  };
}

async function insertIntoAppsScript(signal: SignalRecord): Promise<SignalRecord> {
  const { url, secret } = getAppsScriptConfig();
  const response = await fetchWithTimeout(withSecret(url, secret, {}), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(signal),
  });

  if (!response.ok) {
    throw new Error(`Apps Script ${response.status} ${response.statusText}`.trim());
  }

  const payload = await response.json() as { signal?: SignalRecord };
  return payload.signal ?? signal;
}

function getRequestedOrder(): SignalBackendMode[] {
  const forced = process.env.TREND_BACKEND || "";

  if (forced === "supabase") return ["supabase", "google-apps-script", "local"];
  if (forced === "google-apps-script") return ["google-apps-script", "supabase", "local"];
  if (forced === "local") return ["local"];

  return ["supabase", "google-apps-script", "local"];
}

async function handleList(limit: number): Promise<ListResponse> {
  const errors: string[] = [];
  const supabaseConfig = getSupabaseConfig();
  const appsScriptConfig = getAppsScriptConfig();

  for (const mode of getRequestedOrder()) {
    if (mode === "supabase" && supabaseConfig.ready) {
      try {
        const result = await listFromSupabase(limit);
        return errors.length > 0
          ? { ...result, warnings: errors }
          : result;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Supabase request failed.");
      }
    }

    if (mode === "google-apps-script" && appsScriptConfig.ready) {
      try {
        const result = await listFromAppsScript(limit);
        return errors.length > 0
          ? { ...result, warnings: errors }
          : result;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Apps Script request failed.");
      }
    }

    if (mode === "local") {
      return {
        backend: {
          mode: "local",
          healthy: false,
          detail: errors[0]
            ? `Remote backend unavailable. Serving local demo data. ${errors[0]}`
            : "No remote backend configured. Serving local demo data.",
        },
        signals: DEMO_SIGNALS.slice(0, limit),
        warnings: errors,
      };
    }
  }

  return {
    backend: {
      mode: "local",
      healthy: false,
      detail: "No backend path resolved. Serving local demo data.",
    },
    signals: DEMO_SIGNALS.slice(0, limit),
    warnings: errors,
  };
}

async function handleInsert(signal: SignalRecord): Promise<InsertResponse> {
  const errors: string[] = [];
  const supabaseConfig = getSupabaseConfig();
  const appsScriptConfig = getAppsScriptConfig();

  for (const mode of getRequestedOrder()) {
    if (mode === "supabase" && supabaseConfig.ready) {
      try {
        const stored = await insertIntoSupabase(signal);
        return {
          ok: true,
          statusCode: 201,
          backend: {
            mode: "supabase",
            healthy: true,
            detail: "Signal written to Supabase with idempotent upsert semantics.",
          },
          signal: stored,
          warnings: errors,
        };
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Supabase request failed.");
      }
    }

    if (mode === "google-apps-script" && appsScriptConfig.ready) {
      try {
        const stored = await insertIntoAppsScript(signal);
        return {
          ok: true,
          statusCode: 201,
          backend: {
            mode: "google-apps-script",
            healthy: true,
            detail: "Signal written to Google Sheets through Apps Script.",
          },
          signal: stored,
          warnings: errors,
        };
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Apps Script request failed.");
      }
    }

    if (mode === "local") {
      return {
        ok: false,
        statusCode: 503,
        backend: {
          mode: "local",
          healthy: false,
          detail: errors[0]
            ? `No durable signal backend is available. ${errors[0]}`
            : "No durable signal backend is configured.",
        },
        signal,
        error: "Signal was not persisted by the API because no durable backend is available.",
        warnings: errors,
      };
    }
  }

  return {
    ok: false,
    statusCode: 503,
    backend: {
      mode: "local",
      healthy: false,
      detail: "No durable signal backend is configured.",
    },
    signal,
    error: "Signal was not persisted by the API because no durable backend is available.",
    warnings: errors,
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const requestId = createRequestId();

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Request-Id", requestId);

  try {
    if (req.method === "GET") {
      const limit = parseSignalLimit(req.query?.limit);
      const payload = await handleList(limit);
      res.status(200).json({
        success: true,
        data: payload.signals,
        backend: payload.backend,
        warnings: payload.warnings,
        requestId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === "POST") {
      const signal = normalizeSignal(parseJsonBody(req.body));
      const payload = await handleInsert(signal);

      if (payload.ok) {
        res.status(payload.statusCode).json({
          success: true,
          data: payload.signal,
          backend: payload.backend,
          warnings: payload.warnings,
          requestId,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(payload.statusCode).json({
        success: false,
        error: payload.error,
        data: payload.signal,
        backend: payload.backend,
        warnings: payload.warnings,
        requestId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({
      requestId,
      error: "Method not allowed.",
    });
  } catch (error) {
    if (error instanceof SignalValidationError) {
      res.status(400).json({
        success: false,
        field: error.field,
        error: error.message,
        requestId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unexpected backend failure.",
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
