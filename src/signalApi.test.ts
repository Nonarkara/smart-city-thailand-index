import { describe, it, expect, vi, afterEach } from "vitest";
import handler from "../api/smart-city-signals";
import { buildStableSignalId, MAX_SIGNAL_THEMES } from "./signalContracts";

type MockResponse = {
  headers: Record<string, string>;
  statusCode: number;
  body: unknown;
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

const ENV_KEYS = [
  "SUPABASE_URL",
  "VITE_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_ANON_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "GOOGLE_APPS_SCRIPT_URL",
  "VITE_GOOGLE_APPS_SCRIPT_URL",
  "GOOGLE_APPS_SCRIPT_SECRET",
  "TREND_BACKEND",
  "SUPABASE_SIGNALS_TABLE",
] as const;

const ORIGINAL_ENV = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof ENV_KEYS)[number], string | undefined>;

function resetSignalEnv() {
  ENV_KEYS.forEach((key) => {
    if (ORIGINAL_ENV[key] === undefined) {
      delete process.env[key];
      return;
    }

    process.env[key] = ORIGINAL_ENV[key];
  });
}

function createMockResponse(): MockResponse {
  return {
    headers: {},
    statusCode: 0,
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;

      return {
        json: (body: unknown) => {
          this.body = body;
        },
      };
    },
  };
}

describe("/api/smart-city-signals", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetSignalEnv();
  });

  it("serves local demo signals for reads when no remote backend is configured", async () => {
    const response = createMockResponse();

    await handler(
      {
        method: "GET",
        query: { limit: "1" },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers["Cache-Control"]).toBe("no-store");
    expect(response.headers["X-Request-Id"]).toBeTruthy();
    
    const body = response.body as { success: boolean; data: unknown[]; backend: { mode: string } };
    expect(body.success).toBe(true);
    expect(body.backend).toMatchObject({
      mode: "local",
      healthy: false,
    });
    expect(body.data).toHaveLength(1);
  });

  it("rejects malformed JSON payloads", async () => {
    const response = createMockResponse();

    await handler(
      {
        method: "POST",
        body: "{",
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      field: "body",
      error: "Request body must be valid JSON.",
    });
  });

  it("fails closed for writes when no durable backend is available", async () => {
    const response = createMockResponse();

    await handler(
      {
        method: "POST",
        body: {
          source: "field interview",
          text: "Citizens want working buses, not another ribbon-cutting render.",
          sentiment: "negative",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(503);
    expect(response.body).toMatchObject({
      success: false,
      backend: {
        mode: "local",
        healthy: false,
      },
      error: "Signal was not persisted by the API because no durable backend is available.",
    });
  });

  it("rejects blank signal text", async () => {
    const response = createMockResponse();

    await handler(
      {
        method: "POST",
        body: {
          source: "field interview",
          text: "   ",
          sentiment: "neutral",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      field: "text",
      error: "Signal text is required.",
    });
  });

  it("rejects invalid timestamps", async () => {
    const response = createMockResponse();

    await handler(
      {
        method: "POST",
        body: {
          source: "field interview",
          text: "This timestamp is bullshit.",
          sentiment: "neutral",
          observedAt: "not-a-date",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      field: "observedAt",
      error: "observedAt must be a valid ISO-8601 timestamp.",
    });
  });

  it("upserts to Supabase with deterministic signal ids", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        id: buildStableSignalId({
          cityId: "phuket",
          source: "field interview",
          channel: "manual",
          text: "People want the bus data to match the street reality.",
          sentiment: "positive",
          themes: ["mobility", "trust"],
          observedAt: "2026-04-01T08:30:00.000Z",
        }),
        city_id: "phuket",
        source: "field interview",
        channel: "manual",
        text_body: "People want the bus data to match the street reality.",
        sentiment_label: "positive",
        sentiment_score: 0.75,
        themes: ["mobility", "trust"],
        observed_at: "2026-04-01T08:30:00.000Z",
        ingested_at: "2026-04-01T08:31:00.000Z",
      }],
    });

    vi.stubGlobal("fetch", fetchMock);

    const response = createMockResponse();
    await handler(
      {
        method: "POST",
        body: {
          cityId: "phuket",
          source: " field interview ",
          text: "  People want the bus data to match the street reality. ",
          sentiment: "positive",
          themes: ["mobility", "trust", "mobility"],
          observedAt: "2026-04-01T08:30:00Z",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(201);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toContain("/rest/v1/smart_city_signals");
    expect(requestUrl).toContain("on_conflict=id");
    expect((requestInit.headers as Record<string, string>).Prefer).toContain("resolution=merge-duplicates");

    const payload = JSON.parse(String(requestInit.body)) as {
      id: string;
      city_id: string | null;
      source: string;
      channel: string;
      text_body: string;
      themes: string[];
      observed_at: string;
      sentiment_label: "positive" | "neutral" | "negative";
    };

    expect(payload.id).toBe(buildStableSignalId({
      cityId: "phuket",
      source: "field interview",
      channel: "manual",
      text: "People want the bus data to match the street reality.",
      sentiment: "positive",
      themes: ["mobility", "trust"],
      observedAt: "2026-04-01T08:30:00.000Z",
    }));
    expect(payload).toMatchObject({
      city_id: "phuket",
      source: "field interview",
      channel: "manual",
      text_body: "People want the bus data to match the street reality.",
      themes: ["mobility", "trust"],
      sentiment_label: "positive",
      observed_at: "2026-04-01T08:30:00.000Z",
    });
    
    expect(response.body).toMatchObject({
      success: true,
      backend: {
        mode: "supabase",
        healthy: true,
      },
    });
  });

  it("dedupes and caps themes before writing to Supabase", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    vi.stubGlobal("fetch", fetchMock);

    const response = createMockResponse();
    await handler(
      {
        method: "POST",
        body: {
          source: "panel",
          text: "Theme cleanup should stay tight.",
          sentiment: "positive",
          themes: [
            "Mobility",
            " mobility ",
            "Trust",
            "Delivery",
            "Resilience",
            "Governance",
            "People",
            "Environment",
            "Economy",
            "Safety",
          ],
        },
      },
      response,
    );

    expect(response.statusCode).toBe(201);

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(String(requestInit.body)) as { themes: string[] };

    expect(payload.themes).toEqual([
      "Mobility",
      "Trust",
      "Delivery",
      "Resilience",
      "Governance",
      "People",
      "Environment",
      "Economy",
    ]);
    expect(payload.themes).toHaveLength(MAX_SIGNAL_THEMES);
  });
});
