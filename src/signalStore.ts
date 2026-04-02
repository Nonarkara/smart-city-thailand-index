import { supabase, hasSupabaseCredentials } from "./supabaseClient";

export type SignalBackendMode = "supabase" | "google-apps-script" | "local";
export type SignalSentiment = "positive" | "neutral" | "negative";

export interface SmartCitySignal {
  id: string;
  cityId: string | null;
  source: string;
  channel: string;
  text: string;
  sentiment: SignalSentiment;
  sentimentScore: number;
  themes: string[];
  observedAt: string;
  createdAt: string;
}

export interface SignalBackendStatus {
  mode: SignalBackendMode;
  healthy: boolean;
  detail: string;
}

export interface SignalSnapshot {
  backend: SignalBackendStatus;
  recentSignals: SmartCitySignal[];
  metrics: {
    totalSignals: number;
    activeCities: number;
    positiveShare: number;
    latestObservedAt: string | null;
  };
  themeBreakdown: Array<{ theme: string; count: number }>;
  cityBreakdown: Array<{ cityId: string; count: number }>;
}

export interface SignalInput {
  cityId?: string;
  source: string;
  channel?: string;
  text: string;
  sentiment: SignalSentiment;
  themes?: string[];
  observedAt?: string;
}

interface ServerSignalPayload {
  backend?: {
    mode?: SignalBackendMode;
    healthy?: boolean;
    detail?: string;
  };
  signals?: unknown[];
}

const DEFAULT_LIMIT = 12;
const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim() ?? "";

const SENTIMENT_SCORES: Record<SignalSentiment, number> = {
  positive: 0.75,
  neutral: 0,
  negative: -0.7,
};

const seedSignals: SmartCitySignal[] = [
  {
    id: "demo-1",
    cityId: "nakhon-si-thammarat",
    source: "field interview",
    channel: "manual",
    text: "Citizens trust the flood alerts because the municipality actually warns early and follows up fast.",
    sentiment: "positive",
    sentimentScore: 0.82,
    themes: ["resilience", "trust", "service delivery"],
    observedAt: "2026-03-28T09:30:00.000Z",
    createdAt: "2026-03-28T09:30:00.000Z",
  },
  {
    id: "demo-2",
    cityId: "khon-kaen",
    source: "workshop notes",
    channel: "manual",
    text: "People want mobility data that connects buses, sidewalks, and safety instead of another ceremonial dashboard.",
    sentiment: "positive",
    sentimentScore: 0.61,
    themes: ["mobility", "walkability", "data platform"],
    observedAt: "2026-03-27T06:20:00.000Z",
    createdAt: "2026-03-27T06:20:00.000Z",
  },
  {
    id: "demo-3",
    cityId: "wangchan-valley",
    source: "media scan",
    channel: "press",
    text: "Big smart-city branding still gets mocked when people cannot point to daily-life improvements on the ground.",
    sentiment: "negative",
    sentimentScore: -0.84,
    themes: ["branding", "reality gap", "governance"],
    observedAt: "2026-03-25T12:00:00.000Z",
    createdAt: "2026-03-25T12:00:00.000Z",
  },
  {
    id: "demo-4",
    cityId: "phuket",
    source: "tourism operator",
    channel: "manual",
    text: "Tourism businesses like the smart-city label, but they want cleaner transport and less congestion, not more logos.",
    sentiment: "neutral",
    sentimentScore: -0.05,
    themes: ["tourism", "mobility", "branding"],
    observedAt: "2026-03-24T08:45:00.000Z",
    createdAt: "2026-03-24T08:45:00.000Z",
  },
  {
    id: "demo-5",
    cityId: "chiang-mai-old-town",
    source: "citizen interview",
    channel: "manual",
    text: "Residents care more about air quality, shade, and public space than abstract smart-city slogans.",
    sentiment: "negative",
    sentimentScore: -0.62,
    themes: ["air quality", "public space", "livability"],
    observedAt: "2026-03-23T14:10:00.000Z",
    createdAt: "2026-03-23T14:10:00.000Z",
  },
  {
    id: "demo-6",
    cityId: "songkhla-city",
    source: "line message",
    channel: "citizen",
    text: "People respond well when city staff explain what the data means and what action follows next.",
    sentiment: "positive",
    sentimentScore: 0.68,
    themes: ["communication", "governance", "trust"],
    observedAt: "2026-03-22T04:15:00.000Z",
    createdAt: "2026-03-22T04:15:00.000Z",
  },
  {
    id: "demo-7",
    cityId: null,
    source: "national panel",
    channel: "event",
    text: "Across Thailand the conversation is shifting from certification counts to proof of delivery and citizen outcomes.",
    sentiment: "positive",
    sentimentScore: 0.71,
    themes: ["accountability", "delivery", "national policy"],
    observedAt: "2026-03-20T10:00:00.000Z",
    createdAt: "2026-03-20T10:00:00.000Z",
  },
  {
    id: "demo-8",
    cityId: "yala",
    source: "field note",
    channel: "manual",
    text: "Security tech matters, but people still judge the city by whether services feel fair, fast, and human.",
    sentiment: "neutral",
    sentimentScore: 0.08,
    themes: ["safety", "service delivery", "people"],
    observedAt: "2026-03-18T16:40:00.000Z",
    createdAt: "2026-03-18T16:40:00.000Z",
  },
];

let localSignals = [...seedSignals].sort((left, right) => {
  return Date.parse(right.observedAt) - Date.parse(left.observedAt);
});

function isLocalRuntime(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function normalizeThemes(themes: unknown): string[] {
  if (Array.isArray(themes)) {
    return themes
      .map(theme => String(theme).trim())
      .filter(Boolean);
  }

  if (typeof themes === "string") {
    return themes
      .split(/[|,]/)
      .map(theme => theme.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSignalRecord(record: unknown): SmartCitySignal {
  const item = typeof record === "object" && record !== null ? record as Record<string, unknown> : {};
  const sentiment = item.sentiment_label ?? item.sentiment ?? "neutral";
  const observedAt = typeof item.observed_at === "string"
    ? item.observed_at
    : typeof item.observedAt === "string"
      ? item.observedAt
      : new Date().toISOString();
  const createdAt = typeof item.ingested_at === "string"
    ? item.ingested_at
    : typeof item.created_at === "string"
      ? item.created_at
      : typeof item.createdAt === "string"
        ? item.createdAt
        : observedAt;

  const normalizedSentiment: SignalSentiment =
    sentiment === "positive" || sentiment === "negative" ? sentiment : "neutral";

  return {
    id: String(item.id ?? crypto.randomUUID()),
    cityId: typeof item.city_id === "string"
      ? item.city_id
      : typeof item.cityId === "string"
        ? item.cityId
        : null,
    source: typeof item.source === "string" ? item.source : "unknown",
    channel: typeof item.channel === "string" ? item.channel : "manual",
    text: typeof item.text_body === "string"
      ? item.text_body
      : typeof item.text === "string"
        ? item.text
        : "",
    sentiment: normalizedSentiment,
    sentimentScore:
      typeof item.sentiment_score === "number"
        ? item.sentiment_score
        : typeof item.sentimentScore === "number"
          ? item.sentimentScore
          : SENTIMENT_SCORES[normalizedSentiment],
    themes: normalizeThemes(item.themes),
    observedAt,
    createdAt,
  };
}

export function summarizeSignals(signals: SmartCitySignal[], backend: SignalBackendStatus): SignalSnapshot {
  const recentSignals = [...signals]
    .sort((left, right) => Date.parse(right.observedAt) - Date.parse(left.observedAt))
    .slice(0, DEFAULT_LIMIT);

  const themeCounts = new Map<string, number>();
  const cityCounts = new Map<string, number>();
  let positiveSignals = 0;

  recentSignals.forEach(signal => {
    if (signal.sentiment === "positive") positiveSignals += 1;
    if (signal.cityId) {
      cityCounts.set(signal.cityId, (cityCounts.get(signal.cityId) ?? 0) + 1);
    }
    signal.themes.forEach(theme => {
      themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
    });
  });

  const themeBreakdown = Array.from(themeCounts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((left, right) => right.count - left.count || left.theme.localeCompare(right.theme));

  const cityBreakdown = Array.from(cityCounts.entries())
    .map(([cityId, count]) => ({ cityId, count }))
    .sort((left, right) => right.count - left.count || left.cityId.localeCompare(right.cityId));

  return {
    backend,
    recentSignals,
    metrics: {
      totalSignals: recentSignals.length,
      activeCities: cityBreakdown.length,
      positiveShare: recentSignals.length === 0 ? 0 : Math.round((positiveSignals / recentSignals.length) * 100),
      latestObservedAt: recentSignals[0]?.observedAt ?? null,
    },
    themeBreakdown,
    cityBreakdown,
  };
}

function normalizeInput(input: SignalInput): SmartCitySignal {
  const observedAt = input.observedAt ?? new Date().toISOString();
  const sentimentScore = SENTIMENT_SCORES[input.sentiment] ?? 0;

  return {
    id: crypto.randomUUID(),
    cityId: input.cityId?.trim() ? input.cityId.trim() : null,
    source: input.source.trim(),
    channel: input.channel?.trim() || "manual",
    text: input.text.trim(),
    sentiment: input.sentiment,
    sentimentScore,
    themes: normalizeThemes(input.themes ?? []),
    observedAt,
    createdAt: new Date().toISOString(),
  };
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }
  return response.json() as Promise<T>;
}

async function fetchFromSignalApi(limit: number): Promise<SignalSnapshot> {
  const payload = await fetchJson<ServerSignalPayload>(`/api/smart-city-signals?limit=${limit}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const signals = Array.isArray(payload.signals)
    ? payload.signals.map(normalizeSignalRecord)
    : [];

  return summarizeSignals(signals, {
    mode: payload.backend?.mode ?? "local",
    healthy: payload.backend?.healthy ?? false,
    detail: payload.backend?.detail ?? "Backend API responded without provider metadata.",
  });
}

async function fetchFromSupabase(limit: number): Promise<SignalSnapshot> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data, error } = await supabase
    .from("smart_city_signals")
    .select("id, city_id, source, channel, text_body, sentiment_label, sentiment_score, themes, observed_at, ingested_at")
    .order("observed_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  const signals = (data ?? []).map(normalizeSignalRecord);

  return summarizeSignals(signals, {
    mode: "supabase",
    healthy: true,
    detail: "Live Supabase trend table is responding.",
  });
}

async function fetchFromAppsScript(limit: number): Promise<SignalSnapshot> {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    throw new Error("Google Apps Script endpoint is not configured.");
  }

  const separator = GOOGLE_APPS_SCRIPT_URL.includes("?") ? "&" : "?";
  const payload = await fetchJson<ServerSignalPayload>(`${GOOGLE_APPS_SCRIPT_URL}${separator}action=list&limit=${limit}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const signals = Array.isArray(payload.signals)
    ? payload.signals.map(normalizeSignalRecord)
    : [];

  return summarizeSignals(signals, {
    mode: "google-apps-script",
    healthy: true,
    detail: "Google Sheets + Apps Script fallback is responding.",
  });
}

function buildLocalSnapshot(detail: string, healthy = false): SignalSnapshot {
  return summarizeSignals(localSignals, {
    mode: "local",
    healthy,
    detail,
  });
}

export async function loadSignalSnapshot(limit = DEFAULT_LIMIT): Promise<SignalSnapshot> {
  const errors: string[] = [];

  if (!isLocalRuntime()) {
    try {
      return await fetchFromSignalApi(limit);
    } catch (error) {
      errors.push(`API ${error instanceof Error ? error.message : "request failed"}`);
    }
  }

  if (hasSupabaseCredentials) {
    try {
      return await fetchFromSupabase(limit);
    } catch (error) {
      errors.push(`Supabase ${error instanceof Error ? error.message : "request failed"}`);
    }
  }

  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      return await fetchFromAppsScript(limit);
    } catch (error) {
      errors.push(`Apps Script ${error instanceof Error ? error.message : "request failed"}`);
    }
  }

  if (errors.length > 0) {
    return buildLocalSnapshot(`Remote backend is down or unconfigured. Falling back to local demo. ${errors[0]}`);
  }

  return buildLocalSnapshot("No remote backend configured yet. Using local demo signals until Supabase or Apps Script is wired.");
}

async function submitToSignalApi(signal: SmartCitySignal): Promise<void> {
  const response = await fetch("/api/smart-city-signals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(signal),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }
}

async function submitToSupabase(signal: SmartCitySignal): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { error } = await supabase
    .from("smart_city_signals")
    .insert({
      id: signal.id,
      city_id: signal.cityId,
      source: signal.source,
      channel: signal.channel,
      text_body: signal.text,
      sentiment_label: signal.sentiment,
      sentiment_score: signal.sentimentScore,
      themes: signal.themes,
      observed_at: signal.observedAt,
      ingested_at: signal.createdAt,
    });

  if (error) {
    throw new Error(error.message);
  }
}

async function submitToAppsScript(signal: SmartCitySignal): Promise<void> {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    throw new Error("Google Apps Script endpoint is not configured.");
  }

  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(signal),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }
}

export async function submitSignal(input: SignalInput): Promise<SmartCitySignal> {
  const signal = normalizeInput(input);
  const errors: string[] = [];

  if (!isLocalRuntime()) {
    try {
      await submitToSignalApi(signal);
      return signal;
    } catch (error) {
      errors.push(`API ${error instanceof Error ? error.message : "request failed"}`);
    }
  }

  if (hasSupabaseCredentials) {
    try {
      await submitToSupabase(signal);
      return signal;
    } catch (error) {
      errors.push(`Supabase ${error instanceof Error ? error.message : "request failed"}`);
    }
  }

  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      await submitToAppsScript(signal);
      return signal;
    } catch (error) {
      errors.push(`Apps Script ${error instanceof Error ? error.message : "request failed"}`);
    }
  }

  localSignals = [signal, ...localSignals].sort((left, right) => {
    return Date.parse(right.observedAt) - Date.parse(left.observedAt);
  });

  if (errors.length > 0) {
    console.warn("Signal submission fell back to local storage.", errors.join(" | "));
  }

  return signal;
}
