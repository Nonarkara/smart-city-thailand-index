type BackendMode = "supabase" | "google-apps-script" | "local";
type SignalSentiment = "positive" | "neutral" | "negative";

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

const TABLE_NAME = process.env.SUPABASE_SIGNALS_TABLE || "smart_city_signals";

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

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `signal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseJsonBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    return JSON.parse(body) as Record<string, unknown>;
  }

  if (typeof body === "object" && body !== null) {
    return body as Record<string, unknown>;
  }

  return {};
}

function parseLimit(queryValue: string | string[] | undefined): number {
  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue;
  const limit = Number(raw ?? 12);
  if (!Number.isFinite(limit) || limit < 1) return 12;
  return Math.min(limit, 50);
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

function normalizeThemes(themes: unknown): string[] {
  if (Array.isArray(themes)) {
    return themes.map(theme => String(theme).trim()).filter(Boolean);
  }

  if (typeof themes === "string") {
    return themes.split(/[|,]/).map(theme => theme.trim()).filter(Boolean);
  }

  return [];
}

function normalizeSignal(body: Record<string, unknown>): SignalRecord {
  const sentimentCandidate = body.sentiment_label ?? body.sentiment ?? "neutral";
  const sentiment: SignalSentiment =
    sentimentCandidate === "positive" || sentimentCandidate === "negative"
      ? sentimentCandidate
      : "neutral";

  const now = new Date().toISOString();

  return {
    id: typeof body.id === "string" ? body.id : createId(),
    city_id:
      typeof body.city_id === "string"
        ? body.city_id
        : typeof body.cityId === "string"
          ? body.cityId
          : null,
    source: typeof body.source === "string" && body.source.trim() ? body.source.trim() : "unknown",
    channel: typeof body.channel === "string" && body.channel.trim() ? body.channel.trim() : "manual",
    text_body:
      typeof body.text_body === "string"
        ? body.text_body.trim()
        : typeof body.text === "string"
          ? body.text.trim()
          : "",
    sentiment_label: sentiment,
    sentiment_score:
      typeof body.sentiment_score === "number"
        ? body.sentiment_score
        : sentiment === "positive"
          ? 0.75
          : sentiment === "negative"
            ? -0.7
            : 0,
    themes: normalizeThemes(body.themes),
    observed_at:
      typeof body.observed_at === "string"
        ? body.observed_at
        : typeof body.observedAt === "string"
          ? body.observedAt
          : now,
    ingested_at:
      typeof body.ingested_at === "string"
        ? body.ingested_at
        : typeof body.createdAt === "string"
          ? body.createdAt
          : now,
  };
}

async function listFromSupabase(limit: number) {
  const { url, key } = getSupabaseConfig();
  const target = new URL(`${url}/rest/v1/${TABLE_NAME}`);
  target.searchParams.set("select", "id,city_id,source,channel,text_body,sentiment_label,sentiment_score,themes,observed_at,ingested_at");
  target.searchParams.set("order", "observed_at.desc");
  target.searchParams.set("limit", String(limit));

  const response = await fetch(target.toString(), {
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
      mode: "supabase" as const,
      healthy: true,
      detail: "Vercel API is reading live data from Supabase.",
    },
    signals,
  };
}

async function insertIntoSupabase(signal: SignalRecord) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${TABLE_NAME}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(signal),
  });

  if (!response.ok) {
    throw new Error(`Supabase ${response.status} ${response.statusText}`.trim());
  }
}

async function listFromAppsScript(limit: number) {
  const { url, secret } = getAppsScriptConfig();
  const response = await fetch(withSecret(url, secret, { action: "list", limit: String(limit) }), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Apps Script ${response.status} ${response.statusText}`.trim());
  }

  const payload = await response.json() as { signals?: SignalRecord[] };
  return {
    backend: {
      mode: "google-apps-script" as const,
      healthy: true,
      detail: "Vercel API is proxying Google Sheets through Apps Script.",
    },
    signals: payload.signals ?? [],
  };
}

async function insertIntoAppsScript(signal: SignalRecord) {
  const { url, secret } = getAppsScriptConfig();
  const response = await fetch(withSecret(url, secret, {}), {
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
}

function getRequestedOrder(): BackendMode[] {
  const forced = process.env.TREND_BACKEND || "";
  if (forced === "supabase") return ["supabase", "google-apps-script", "local"];
  if (forced === "google-apps-script") return ["google-apps-script", "supabase", "local"];
  if (forced === "local") return ["local"];
  return ["supabase", "google-apps-script", "local"];
}

async function handleList(limit: number) {
  const errors: string[] = [];
  const supabaseConfig = getSupabaseConfig();
  const appsScriptConfig = getAppsScriptConfig();

  for (const mode of getRequestedOrder()) {
    if (mode === "supabase" && supabaseConfig.ready) {
      try {
        return await listFromSupabase(limit);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Supabase request failed");
      }
    }

    if (mode === "google-apps-script" && appsScriptConfig.ready) {
      try {
        return await listFromAppsScript(limit);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Apps Script request failed");
      }
    }

    if (mode === "local") {
      return {
        backend: {
          mode: "local" as const,
          healthy: false,
          detail: errors[0]
            ? `Remote backend unavailable. Serving local demo data. ${errors[0]}`
            : "No remote backend configured. Serving local demo data.",
        },
        signals: DEMO_SIGNALS.slice(0, limit),
      };
    }
  }

  return {
    backend: {
      mode: "local" as const,
      healthy: false,
      detail: "No backend path resolved. Serving local demo data.",
    },
    signals: DEMO_SIGNALS.slice(0, limit),
  };
}

async function handleInsert(signal: SignalRecord) {
  const errors: string[] = [];
  const supabaseConfig = getSupabaseConfig();
  const appsScriptConfig = getAppsScriptConfig();

  for (const mode of getRequestedOrder()) {
    if (mode === "supabase" && supabaseConfig.ready) {
      try {
        await insertIntoSupabase(signal);
        return {
          backend: {
            mode: "supabase" as const,
            healthy: true,
            detail: "Signal written to Supabase.",
          },
        };
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Supabase request failed");
      }
    }

    if (mode === "google-apps-script" && appsScriptConfig.ready) {
      try {
        await insertIntoAppsScript(signal);
        return {
          backend: {
            mode: "google-apps-script" as const,
            healthy: true,
            detail: "Signal written to Google Sheets through Apps Script.",
          },
        };
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Apps Script request failed");
      }
    }

    if (mode === "local") {
      return {
        backend: {
          mode: "local" as const,
          healthy: false,
          detail: errors[0]
            ? `Signal stored only in demo memory. ${errors[0]}`
            : "Signal stored only in demo memory.",
        },
      };
    }
  }

  return {
    backend: {
      mode: "local" as const,
      healthy: false,
      detail: "Signal stored only in demo memory.",
    },
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method === "GET") {
      const limit = parseLimit(req.query?.limit);
      const payload = await handleList(limit);
      res.status(200).json(payload);
      return;
    }

    if (req.method === "POST") {
      const signal = normalizeSignal(parseJsonBody(req.body));

      if (!signal.text_body) {
        res.status(400).json({ error: "Signal text is required." });
        return;
      }

      const payload = await handleInsert(signal);
      res.status(200).json(payload);
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected backend failure.",
    });
  }
}
