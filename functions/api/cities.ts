import { filterCitySummaries } from "../../src/cityListQuery";

type CitySummary = {
  status: string;
  tier: string;
  compositeScore: number;
  scores: {
    livability: number;
    economy: number;
    safety: number;
    wellbeing: number;
    environment: number;
    hospitality: number;
    digital: number;
  };
  nameEn: string;
};

type Envelope = {
  success: boolean;
  data?: CitySummary[];
  error?: string;
  requestId: string;
  timestamp: string;
};

type PagesContext = {
  request: Request;
  env: {
    ASSETS: {
      fetch: (input: Request | string) => Promise<Response>;
    };
  };
};

const READ_CACHE_CONTROL = "public, max-age=0, s-maxage=900, stale-while-revalidate=86400";

function json(body: Envelope, status: number, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Request-Id": body.requestId,
      ...Object.fromEntries(new Headers(extraHeaders)),
    },
  });
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return json(
      { success: false, error: "Method not allowed", requestId, timestamp },
      405,
      { Allow: "GET, HEAD", "Cache-Control": "no-store" },
    );
  }

  try {
    const assetUrl = new URL("/api-static/cities.json", context.request.url);
    const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (!asset.ok) {
      return json(
        { success: false, error: "City index unavailable", requestId, timestamp },
        502,
        { "Cache-Control": "no-store" },
      );
    }

    const payload = await asset.json() as Envelope;
    const cities = Array.isArray(payload.data) ? payload.data : [];
    const url = new URL(context.request.url);
    const data = filterCitySummaries(cities, {
      status: url.searchParams.get("status") ?? undefined,
      tier: url.searchParams.get("tier") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
    });
    const body: Envelope = { success: true, data, requestId, timestamp };

    if (context.request.method === "HEAD") {
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": READ_CACHE_CONTROL,
          "X-Content-Type-Options": "nosniff",
          "X-Request-Id": requestId,
        },
      });
    }

    return json(body, 200, { "Cache-Control": READ_CACHE_CONTROL });
  } catch {
    return json(
      { success: false, error: "City index unavailable", requestId, timestamp },
      502,
      { "Cache-Control": "no-store" },
    );
  }
}
